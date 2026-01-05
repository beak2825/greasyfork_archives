// ==UserScript==
// @name        PTT Imgur Fix
// @description	修正 Imgur 在 PTT 上的問題
// @namespace   eight04.blogspot.com
// @match https://www.ptt.cc/bbs/*.html
// @match https://www.ptt.cc/man/*.html
// @match https://term.ptt.cc/
// @version     0.10.0
// @author		eight
// @homepage	https://github.com/eight04/ptt-imgur-fix
// @supportURL	https://github.com/eight04/ptt-imgur-fix/issues
// @license		MIT
// @compatible firefox Tampermonkey, Violentmonkey, Greasemonkey 4.11+
// @compatible chrome Tampermonkey, Violentmonkey
// @run-at		document-start
// @grant GM_getValue
// @grant GM.getValue
// @grant GM_setValue
// @grant GM.setValue
// @grant GM_deleteValue
// @grant GM.deleteValue
// @grant GM_addValueChangeListener
// @grant GM_registerMenuCommand
// @grant GM.registerMenuCommand
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @require https://greasyfork.org/scripts/371339-gm-webextpref/code/GM_webextPref.js?version=961539
// @require https://cdnjs.cloudflare.com/ajax/libs/sentinel-js/0.0.7/sentinel.min.js
// @connect     imgur.com
// @downloadURL https://update.greasyfork.org/scripts/28264/PTT%20Imgur%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/28264/PTT%20Imgur%20Fix.meta.js
// ==/UserScript==

/* global GM_webextPref sentinel */

const request = typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : GM.xmlHttpRequest;

const pref = GM_webextPref({
  default: {
    term: true,
    embedYoutube: true,
    meeeSniffExt: false,
    youtubeParameters: "",
    embedImage: true,
    embedAlbum: false,
    embedVideo: true,
    albumMaxSize: 5,
    imgurVideo: false,
    lazyLoad: true,
    maxWidth: "100%",
    maxHeight: "none",
  },
  body: [
    {
      key: "embedImage",
      label: "Embed image",
      type: "checkbox",
    },
    {
      key: "embedVideo",
      label: "Embed video",
      type: "checkbox",
    },
    {
      key: "embedAlbum",
      label: "Embed imgur album. The script would request imgur.com for album info",
      type: "checkbox",
      children: [
        {
          key: "albumMaxSize",
          label: "Maximum number of images to load for an album",
          type: "number"
        }
      ]
    },
    {
      key: "imgurVideo",
      label: "Embed imgur video instead of GIF. Reduce file size",
      type: "checkbox"
    },
    {
      key: "embedYoutube",
      label: "Embed youtube video",
      type: "checkbox",
      children: [
        {
          key: "youtubeParameters",
          label: "Youtube player parameters (e.g. rel=0&loop=1)",
          type: "text",
          default: ""
        }
      ]
    },
    {
      key: "meeeSniffExt",
      label: "Fetch filename extension from meee",
      type: "checkbox",
    },
    {
      key: "lazyLoad",
      label: "Don't load images until scrolled into view",
      type: "checkbox"
    },
    {
      key: "maxWidth",
      label: "Maximum width of image",
      type: "text",
    },
    {
      key: "maxHeight",
      label: "Maximum height of image",
      type: "text",
    },
  ],
  navbar: false
});

const lazyLoader = (() => {
  const xo = new IntersectionObserver(onXoChange, {rootMargin: "30% 0px 30% 0px"});
  const elMap = new Map;
  pref.on('change', onPrefChange);
  
  return {add, clear};

  function clear() {
    for (const target of elMap.values()) {
      xo.unobserve(target.el);
    }
    elMap.clear();
  }
  
  function onPrefChange(changes) {
    if (changes.lazyLoad == null) return;
    
    if (changes.lazyLoad) {
      for (const target of elMap.values()) {
        xo.observe(target.el);
      }
    } else {
      xo.disconnect();
      for (const target of elMap.values()) {
        target.visible = true;
        loadTarget(target);
        showTarget(target);
      }
    }
  }
  
  function add(el) {
    if (elMap.has(el)) return;
    
    const target = {
      el,
      state: 'pause',
      visible: false,
      finalUrl: '',
      candidateUrls: el.dataset.srcset ? el.dataset.srcset.split(/\s*,\s*/) : [],
      mask: null,
      width: 0,
      height: 0
    };
    
    elMap.set(el, target);
    el.classList.add('lazy-target');
    
    if (pref.get('lazyLoad')) {
      xo.observe(target.el);
    } else {
      target.visible = true;
      loadTarget(target);
    }
  }
  
  function onXoChange(entries) {
    for (const entry of entries) {
      const target = elMap.get(entry.target);
      if (!target) {
        // unobserved element
        continue;
      }
      if (entry.isIntersecting) {
        target.visible = true;
        loadTarget(target);
        showTarget(target);
      } else {
        target.visible = false;
        hideTarget(target);
      }
    }
  }

  async function loadTarget(target) {
    if (target.state !== 'pause') return;
    target.state = 'loading';
    target.el.classList.add('lazy-load-loading');
    try {
      let finalUrl;
      if (target.el.tagName === 'IMG' || target.el.tagName === 'IFRAME') {
        finalUrl = await loadImgOrIframe(target);
      } else if (target.el.tagName === 'VIDEO') {
        finalUrl = await loadVideo(target);
      } else {
        throw new Error(`Invalid media: ${target.el.tagName}`);
      }
      target.finalUrl = finalUrl;
      target.state = 'complete';
      const {offsetWidth: w, offsetHeight: h} = target.el;
      target.el.style.aspectRatio = `${w} / ${h}`;
      if (target.visible) {
        showTarget(target, false);
      } else {
        hideTarget(target);
      }
      target.el.classList.add('lazy-load-end');
    } catch (err) {
      console.error(err);
      target.state = 'pause';
      target.el.dispatchEvent(new CustomEvent('loadMediaError'));
    } finally {
      target.el.classList.remove('lazy-load-loading');
    }
  }

  async function loadImgOrIframe(target) {
    const urls = target.candidateUrls.length ? target.candidateUrls : [target.el.dataset.src];
    for (const url of urls) {
      setSrc(target.el, url);
      try {
        await waitEvent(target.el, 'load');
        return url;
      } catch (err) {
        console.warn(err);
        continue;
      }
    }
    throw new Error(`failed loading media: ${urls.join(', ')}`);
  }

  function findMime(string) {
    const match = string.match(/content-type:\s*([\w/\-+]+)/i);
    if (match) {
      return match[1];
    }
    return "";
  }

  async function loadVideo(target) {
    const url = target.el.dataset.src;
    try {
      target.el.src = url;
      await waitEvent(target.el, "canplay");
      return url;
    } catch (err) {
      // cors?
      console.warn(err);
    }
    const r = await fetchStreamOrBlob(url);
    if (r.response.getReader) {
      // stream
      const mimeType = findMime(r.responseHeaders);
      if (MediaSource.isTypeSupported(mimeType)) {
        try {
          const mediaSource = new MediaSource();
          target.el.src = URL.createObjectURL(mediaSource);
          await loadMediaSource(mediaSource, r.response, mimeType);
          return target.el.src;
        } catch (err) {
          // not supported codec?
          console.warn(err);
        }
      }
      // fallback to blob
      r.response = await loadStreamAsBlob(r.response);
    }
    if (r.response instanceof Blob) {
      // Blob
      target.el.src = URL.createObjectURL(r.response);
      await waitEvent(target.el, "canplay");
      return target.el.src;
    }
    throw new Error(`unknown response type for video: ${url}`, r.response);
  }

  function loadStreamAsBlob(stream) {
    return new Promise((resolve, reject) => {
      const reader = stream.getReader();
      const chunks = [];
      async function read() {
        try {
          for (;;) {
            const {done, value} = await reader.read();
            if (value) {
              chunks.push(value);
            }
            if (done) {
              resolve(new Blob(chunks));
              return;
            }
          }
        } catch (err) {
          reject(new Error(`failed reading stream: ${err.message || err}`));
          return;
        }
      }
      read();
    });
  }

  function loadMediaSource(mediaSource, stream, mime) {
    return new Promise((resolve, reject) => {
      mediaSource.addEventListener('sourceopen', onSourceOpen);
      mediaSource.addEventListener('error', onError);
      
      async function onSourceOpen() {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer(mime);
          const reader = stream.getReader();
          for (;;) {
            const {done, value} = await reader.read();
            if (value) {
              sourceBuffer.appendBuffer(value);
              await waitEvent(sourceBuffer, 'updateend');
            }
            if (done) {
              mediaSource.endOfStream();
              resolve();
              return;
            }
          }
        } catch (err) {
          reject(new Error(`failed loading media source: ${err.message || err}`));
        }
      }
      
      function onError(e) {
        reject(new Error(`failed loading media source: ${e.message || e}`));
      }
    });
  }

  function waitEvent(el, eventName) {
    return new Promise((resolve, reject) => {
      function onEvent() {
        resolve();
        cleanup();
      }
      function onError(e) {
        reject(new Error(`failed waiting event ${eventName}: ${e.message || e}`));
        cleanup();
      }
      function cleanup() {
        el.removeEventListener(eventName, onEvent);
        el.removeEventListener('error', onError);
      }
      el.addEventListener(eventName, onEvent);
      el.addEventListener('error', onError);
    });
  }
  
  async function showTarget(target, useSrc = true) {
    if (target.state !== 'complete' && target.state !== 'hidden') return;
    if (useSrc) {
      // this has to work with image, video, iframe
      setSrc(target.el, target.finalUrl);
      // FIXME: why removing width/height?
      // loadMedia(target.el)
      //   .then(() => {
      //     if (target.el.style.width) {
      //       target.el.style.width = '';
      //       target.el.style.height = '';
      //     }
      //   });
    }
    target.state = 'shown';
  }
  
  function hideTarget(target) {
    if (target.state !== 'complete' && target.state !== 'shown') return;
    if (target.el.tagName === 'IFRAME') return;
    const {offsetWidth: w, offsetHeight: h} = target.el;
    if (w && h) {
      target.el.style.width = `${w}px`;
      // Waterfox
      // https://greasyfork.org/zh-TW/scripts/28264-ptt-imgur-fix/discussions/115795
      if (!CSS.supports("aspect-ratio", "1/1")) {
        target.el.style.height = `${h}px`;
      }
    }
    setSrc(target.el, 'about:blank');
    target.state = 'hidden';
  }

})();

document.addEventListener("beforescriptexecute", e => {
	var url = new URL(e.target.src, location.href);
	if (url.hostname.endsWith("imgur.com")) {
		e.preventDefault();
	}
});

Promise.all([
  pref.ready(),
  domReady()
])
  .then(init)
  .catch(console.error);
  
function fetchStreamOrBlob(url) {
  return new Promise((resolve, reject) => {
    request({
      method: "GET",
      url,
      headers: {
        "referer": ""
      },
      responseType: GM_xmlhttpRequest.RESPONSE_TYPE_STREAM === 'stream' ? 'stream' : 'blob',
      onloadstart: r => {
        if (!r.response) return;
        if (r.response.getReader) {
          resolve(r.response);
        }
      },
      onload: r => {
        resolve(r.response);
      },
      onerror: e => {
        reject(new Error(`failed fetching video: ${url}, ${e}`));
      }
    });
  });
}

function domReady() {
  return new Promise(resolve => {
    if (document.readyState !== "loading") {
      resolve();
      return;
    }
    document.addEventListener("DOMContentLoaded", resolve, {once: true});
  });
}

function createStyle(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

function init() {
  createStyle(`
    .ptt-imgur-fix {
      max-width: ${pref.get("maxWidth")};
      max-height: none;
    }
    .ptt-imgur-fix img,
    .ptt-imgur-fix video,
    .ptt-imgur-fix iframe {
      max-width: 100%;
      max-height: ${pref.get("maxHeight")};
    }
    .lazy-target:not(.lazy-load-end) {
      /* give them a size so that we don't load them all at once */
      min-height: 50vh;
    }
    span[type=bbsrow] .richcontent {
      display: flex;
      justify-content: center;
      .resize-container {
        flex-grow: 1;
      }
      iframe {
        aspect-ratio: 16 / 9;
        width: 100%;
      }
    }
  `)
  if (location.hostname === "term.ptt.cc") {
    if (pref.get("term")) {
      initTerm();
    }
  } else {
    initWeb();
  }
}

function initTerm() {
  const selector = "span[type=bbsrow] a:not(.embeded)";
  detectEasyReading({
    on: () => sentinel.on(selector, onLink),
    off: () => {
      sentinel.off(selector);
      lazyLoader.clear();
    }
  });
  
  function onLink(node) {
    node.classList.add("embeded");
    if (node.href) {
      const linkInfo = getLinkInfo(node);
      const bbsRowDiv = node.closest("span[type=bbsrow] > div");
      const hasDefaultContent = !bbsRowDiv.children[1].classList.contains("richcontent");
      if (linkInfo.embedable) {
        const richContent = createRichContent(linkInfo);
        if (!hasDefaultContent) {
          bbsRowDiv.appendChild(richContent);
        } else {
          bbsRowDiv.children[1].replaceWith(richContent);
        }
      } else if (hasDefaultContent) {
        // remove default content under links
        bbsRowDiv.children[1].innerHTML = "";
      }
    }
  }
}

function waitElement(selector) {
  return new Promise(resolve => {
    const id = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(id);
        resolve(el);
      }
    }, 1000);
  });
}

async function detectEasyReading({on, off}) {
  let state = false;
  const easyReadingLastRow = await waitElement("#easyReadingLastRow")
  // const easyReadingLastRow = document.querySelector("#easyReadingLastRow");
  const observer = new MutationObserver(onMutations);
  observer.observe(easyReadingLastRow, {attributes: true, attributeFilter: ["style"]});

  function onMutations() {
    const newState = easyReadingLastRow.style.display === "block";
    if (newState === state) {
      return;
    }
    if (newState) {
      on();
    } else {
      off();
    }
    state = newState;
  }
}

function initWeb() {
	// remove old .richcontent
	var rich = document.querySelectorAll("#main-content .richcontent");
	for (var node of rich) {
		node.parentNode.removeChild(node);
	}

	// embed links
	var links = document.querySelectorAll("#main-content a"),
		processed = new Set;
	for (var link of links) {
		if (processed.has(link) || !getLinkInfo(link).embedable) {
			continue;
		}
		var [links_, lineEnd] = findLinksInSameLine(link);
		links_.forEach(l => processed.add(l));
    for (const link of links_) {
      const linkInfo = getLinkInfo(link);
      if (!linkInfo.embedable) {
        continue;
      }
      const richContent = createRichContent(linkInfo);
      lineEnd.parentNode.insertBefore(richContent, lineEnd.nextSibling);
      lineEnd = richContent;
    }
		// createRichContent(links_, lineEnd);
	}
}

function findLinksInSameLine(node) {
	var links = [];
	while (node) {
		if (node.nodeName == "A") {
			links.push(node);
			node = node.nextSibling || node.parentNode.nextSibling;
			continue;
		}

		if (node.nodeType == Node.TEXT_NODE && node.nodeValue.includes("\n")) {
			return [links, findLineEnd(node)];
		}

		if (node.childNodes.length) {
			node = node.childNodes[0];
			continue;
		}

		if (node.nextSibling) {
			node = node.nextSibling;
			continue;
		}

		if (node.parentNode.id != "main-content") {
			node = node.parentNode.nextSibling;
			continue;
		}

		throw new Error("Invalid article, missing new line?");
	}
}

function findLineEnd(text) {
	var index = text.nodeValue.indexOf("\n");
	if (index == text.nodeValue.length - 1) {
		while (text.parentNode.id != "main-content") {
			text = text.parentNode;
		}
		return text;
	}

	var pre = document.createTextNode("");
	pre.nodeValue = text.nodeValue.slice(0, index + 1);
	text.nodeValue = text.nodeValue.slice(index + 1);
	text.parentNode.insertBefore(pre, text);
	return pre;
}

function createRichContent(linkInfo) {
  const richContent = document.createElement("div");
  richContent.className = "richcontent ptt-imgur-fix";
  const embed = createEmbed(linkInfo, richContent);
  if (typeof embed === "string") {
    richContent.innerHTML = embed;
  } else if (embed) {
    richContent.appendChild(embed);
  }
  const lazyTarget = richContent.querySelector("[data-src]");
  if (lazyTarget) {
    lazyLoader.add(lazyTarget);
  }
  return richContent;
}

function getLinkInfo(link) {
	return getUrlInfo(link.href);
}

function getUrlInfo(url) {
	var match;
	if ((match = url.match(/\/\/(?:[im]\.)?imgur\.com\/([a-z0-9]{2,})(\.[a-z0-9]{3,4})?/i)) && match[1] != "gallery") {
		return {
			type: "imgur",
			id: match[1],
			url: url,
			embedable: pref.get("embedImage"),
      extension: match[2] && match[2].toLowerCase()
		};
	}
	if ((match = url.match(/\/\/(?:[im]\.)?imgur\.com\/(?:a|gallery)\/([a-z0-9]{2,})/i))) {
		return {
			type: "imgur-album",
			id: match[1],
			url: url,
			embedable: pref.get("embedAlbum")
		};
	}
	if (
    (match = url.match(/youtube\.com\/watch?.*?v=([a-z0-9_-]{9,12})/i)) ||
    (match = url.match(/(?:youtu\.be|youtube\.com\/embed)\/([a-z0-9_-]{9,12})/i)) ||
    (match = url.match(/youtube\.com\/shorts\/([a-z0-9_-]{9,12})/i)) ||
    (match = url.match(/youtube\.com\/live\/([a-z0-9_-]{9,12})/i))
  ) {
		return {
			type: "youtube",
			id: match[1],
			url: url,
			embedable: pref.get("embedYoutube")
		};
	}
	if ((match = url.match(/\/\/pbs\.twimg\.com\/media\/([a-z0-9_-]+\.(?:jpg|png))/i))) {
		return {
			type: "twitter",
			id: match[1],
			url: url,
			embedable: pref.get("embedImage")
		};
	}
	if ((match = url.match(/\/\/pbs\.twimg\.com\/media\/([a-z0-9_-]+)(?:\?.*format=([\w]+))?/i))) {
    const ext = !match[2] || match[2] === "webp" ? ".jpg" : `.${match[2]}`;
		return {
			type: "twitter",
			id: `${match[1]}${ext}`,
			url: url,
			embedable: pref.get("embedImage")
		};
	}
  if ((match = url.match(/\bmeee\.com\.tw\/(\w+)(\.\w+)?/))) {
    return {
      type: "meee",
      id: match[1],
      ext: match[2] || "",
      url: url,
      embedable: pref.get("embedImage"),
    }
  }
	if (/^[^?#]+\.(?:jpg|png|gif|jpeg|webp|apng|avif|jfif|pjpeg|pjp|svg)(?:$|[?#])/i.test(url)) {
		return {
			type: "image",
			id: null,
			url: url,
			embedable: pref.get("embedImage")
		};
	}
  if (/.*\.(?:mp4|webm|ogg)(?:$|[?#])/i.test(url)) {
    return {
      type: "video",
      id: null,
      url: url,
      embedable: pref.get("embedVideo")
    };
  }
	return {
		type: "url",
		id: null,
		url: url,
		embedable: false
	};
}

function createEmbed(info, container) {
	if (info.type == "imgur") {
    let extension = info.extension || ".jpg";
    if (extension === ".gif" && pref.get("imgurVideo")) {
      extension = ".mp4";
    }
    if (extension === ".gifv") {
      extension = pref.get("imgurVideo") ? ".mp4" : ".gif";
    }
    const url = `//i.imgur.com/${info.id}${extension}`;
    if (extension !== ".mp4") {
      return `<img referrerpolicy="no-referrer" data-src="${url}">`;
    }
    const video = document.createElement("video");
    video.loop = true;
    video.autoplay = true;
    video.controls = true;
    video.dataset.src = url;
    video.muted = true;
    return video;
	}
	if (info.type == "youtube") {
		return `<div class="resize-container"><div class="resize-content"><iframe class="youtube-player" type="text/html" data-src="//www.youtube.com/embed/${info.id}?${mergeParams(new URL(info.url).search, pref.get("youtubeParameters"))}" frameborder="0" allowfullscreen></iframe></div></div>`;
	}
	if (info.type == "image") {
		return `<img referrerpolicy="no-referrer" data-src="${info.url}">`;
	}
  if (info.type == "video") {
    const video = document.createElement("video");
    video.controls = true;
    video.dataset.src = info.url;
    return video;
  }
	if (info.type == "twitter") {
    const urls = [
      `//pbs.twimg.com/media/${info.id}:orig`,
      `//pbs.twimg.com/media/${info.id.replace(/\.jpg\b/, ".png")}:orig`,
      `//pbs.twimg.com/media/${info.id}:large`,
      `//pbs.twimg.com/media/${info.id}`,
    ];
    return `<img data-src data-srcset="${urls.join(", ")}">`;
	}
	if (info.type == "imgur-album") {
		container.textContent = "Loading album...";
		request({
			method: "GET",
			url: `https://api.imgur.com/post/v1/albums/${info.id}?client_id=546c25a59c58ad7&include=media`,
      responseType: "json",
			onload(response) {
				if (response.status < 200 || response.status >= 300) {
					container.textContent = `${response.status} ${response.statusText}`;
					return;
				}
				container.textContent = "";
        const urls = response.response.media.map(m => m.url);
        
				let i = 0;
				const loadImages = (count = Infinity) => {
          const els = [];
					for (; i < urls.length && count--; i++) {
            els.push(createRichContent(getUrlInfo(urls[i])));
					}
					container.append(...els);
				};
				loadImages(pref.get("albumMaxSize"));
				if (i < urls.length) {
					const button = document.createElement("button");
					button.textContent = `Load all images (${urls.length - i} more)`;
					button.addEventListener('click', () => {
						button.remove();
						loadImages();
					});
					container.appendChild(button);
				}
			}
		});
		return;
	}
  if (info.type === "meee") {
    // https://greasyfork.org/zh-TW/scripts/28264-ptt-imgur-fix/discussions/302188
    let exts = [".jpg", ".jpeg", ".png", ".gif"];
    if (info.ext) {
      exts = [...new Set([info.ext, ...exts])];
    }
    if (!pref.get("meeeSniffExt")) {
      const urls = exts.map(ext => `https://i.meee.com.tw/${info.id}${ext}`);
      return `<img data-src data-srcset="${urls.join(", ")}">`;
    }
    const sniffAndLoad = () => {
      container.textContent = "Loading meee image...";
      request({
        method: "GET",
        url: `https://meee.com.tw/${info.id}`,
        onload(response) {
          if (response.status < 200 || response.status >= 300) {
            container.textContent = `${response.status} ${response.statusText}`;
            return;
          }
          const html = response.responseText;
          const match = html.match(new RegExp(String.raw`${info.id}(\.\w+)`));
          const ext = match?.[1];
          if (!exts.includes(ext)) {
            container.textContent = `Unsupported image type: ${ext}`;
            return;
          }
          const url = `https://i.meee.com.tw/${info.id}${ext}`;
          container.replaceWith(createRichContent(getUrlInfo(url)));
        }
      });
    }
    if (info.ext) {
      const i = new Image;
      i.dataset.src = `https://i.meee.com.tw/${info.id}${info.ext}`;
      i.addEventListener("loadMediaError", sniffAndLoad, {once: true});
      return i;
    }
    sniffAndLoad();
    return;
  }
	throw new Error(`Invalid type: ${info.type}`);
}

function mergeParams(origSearch, userSearch) {
  const result = new URLSearchParams();
  for (const [key, value] of new URLSearchParams(origSearch)) {
    if (key === "t") {
      result.set("start", value);
    } else {
      result.set(key, value);
    }
  }
  for (const [key, value] of new URLSearchParams(userSearch)) {
    result.set(key, value);
  }
  return result.toString();
}

function setSrc(el, url) {
  if (el.contentWindow) {
    try {
      el.contentWindow.location.replace(url);
      return;
    } catch (err) {
      console.warn(err);
    }
  }
  el.src = url;
}
