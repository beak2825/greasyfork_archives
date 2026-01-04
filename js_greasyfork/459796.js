// ==UserScript==
// @name         Eva's universal torrent gallery only for kamept
// @namespace    https://github.com/po5
// @version      0.1.281
// @description  Gallery view for trackers
// @author       Eva
// @homepage     https://gist.github.com/po5
// @icon         https://ptpimg.me/9rmox4.png
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @match        https://kamept.com/*
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license      GPL-3.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459796/Eva%27s%20universal%20torrent%20gallery%20only%20for%20kamept.user.js
// @updateURL https://update.greasyfork.org/scripts/459796/Eva%27s%20universal%20torrent%20gallery%20only%20for%20kamept.meta.js
// ==/UserScript==
"use strict";

const config = [{
 site: ["kamept.com"],
 siteregex: /^https?:\/\/kamept\.com\/(torrents|special)\.php/,
 backgrounds: {
   title: {
     selector: "td.colhead"
   },
   details: {
     selector: "table.mainouter"
   }
 },
 container: {
   before: ".torrents",
   hide: ".torrents"
 },
 group: ".torrents > tbody > tr:not(:first-child)",
 data: {
   link: {
     selector: "td.embedded a[href^='details']",
     property: "href"
   },
   title: {
     selector: "td.embedded a[href^='details']",
     property: "innerText"
   },
   image: {
     selector: "img[data-src]",
     property: "data-src",
     search: /&w=\d+&h=\d+.*/,
     replace: "&w=186&h=280&fit=inside"
   },
   details: {
     selector: "td.embedded:nth-child(2) > div > div:nth-child(2)",
     property: "innerHTML",
     search: /<br><img class=".*/,
     replace: "",
     search2: /.*<br>/,
     replace2: "",
     search3: "</div>&nbsp;",
     replace3: "</div>"
   }
 },
 
 css: `
#userscript-gallery-toggle a, .userscript-gallery-title {
 font-weight: bold;
}
.userscript-gallery-details a.en_tag {
 margin-top: initial;
}
`
}
];

const domain = location.hostname.split('.').slice(-2).join('.'),
  backgrounds = {
    title: "background-color:rgba(0,0,0,.3)",
    details: "background-color:rgba(0,0,0,.1)"
  },
  fails = [];

let observe = null,
  multi = false,
  runcount = 0,
  cached = {},
  fail = {};

function info_replace(data, info) {
  Object.keys(info).forEach(key => {
    if (key.startsWith("search")) data = data.replace(info[key], info[key.replace("search", "replace")]);
  });
  return data;
}

async function gallery() {
  runcount += 1;
  const groups = {},
    ajax = {
      apilinks: [],
      links: []
    };

  let open = localStorage.getItem("userscript-gallery-open"),
    run = 1,
    fallback = "";

  if (multi) {
    const container = document.getElementById("userscript-gallery-container");
    if (container) {
      document.getElementById("userscript-gallery-toggle").outerHTML = "";
      container.outerHTML = "";
    }
  }

  config.forEach(site => {
    if (site.site.indexOf(window.location.hostname) == -1) return;
    if (site.siteregex != false && !window.location.href.match(site.siteregex)) {if(site.until) {setTimeout(gallery, 1000)} return};
    if (site.fallback) fallback = site.fallback;
    if (site.multi) multi = site.multi;
    if (site.until) {setTimeout(gallery, 1000); if(document.querySelector(site.until) == null) {observe = null; return}};
    if (site.until && site.observe && observe == null) {
      new MutationObserver(m => {
        const container = document.getElementById("userscript-gallery-container");
        if (container) {
          document.getElementById("userscript-gallery-toggle").outerHTML = "";
          container.outerHTML = "";
        }
        gallery();
      }).observe(document.querySelector(site.observe), {
        attributes: false,
        childList: true
      });
    }
    if (site.observe) observe = document.querySelector(site.observe);
    if (document.getElementById("userscript-gallery-container")) return;
    const base = document.querySelectorAll(site.group);
    if (base.length == 0) return;
    for (const [element, background] of Object.entries(site.backgrounds)) {
      if (background.selector) {
        backgrounds[element] = "";
        const bg = document.querySelector(background.selector);
        if (bg) {
          const styles = window.getComputedStyle(bg);
          for (const style of styles) {
            if (style.startsWith("background-")) backgrounds[element] += style + ":" + styles.getPropertyValue(style) + ";";
          }
        }
      } else {
        backgrounds[element] = "background:" + background.color;
      }
    }
    if (!document.getElementById("userscript-gallery-style")) {
      if (!site.css) site.css = "";
      const css = document.createElement("style");
      css.type = "text/css";
      css.id = "userscript-gallery-style";
      css.innerHTML = `
.userscript-gallery-hidden {
  display: none !important;
}
#userscript-gallery-toggle {
  margin-bottom: 10px;
  padding: 4px;
}
#userscript-gallery-toggle > a {
  cursor: pointer;
  float:right;
}
#userscript-gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(186px, 1fr));
  gap: 4px;
  justify-items: center;
}
.userscript-gallery-group {
  width: 186px;
  margin-bottom: 26px;
  position: relative;
}
.userscript-gallery-title {
  padding: 5px;
  text-overflow: ellipsis;
  line-height: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.12);
}
.userscript-gallery-link {
  display: block;
  text-align: center;
}
.userscript-gallery-image {
  max-width: 186px;
  max-height: 300px;
  vertical-align: middle;
}
.userscript-gallery-details {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.12);
  transition: max-height .3s;
  max-height: 26px;
  line-height: 13px;
  overflow: hidden;
  text-align: center;
  position: absolute;
  z-index: 10;
  width: 100%;
}
.userscript-gallery-details:hover {
  max-height: 1000%;
  z-index: 11;
}
#userscript-gallery-toggle {
  ${backgrounds.title}
}
.userscript-gallery-title {
  ${backgrounds.title}
}
.userscript-gallery-details {
  ${backgrounds.details}
}
` + site.css;
      document.body.appendChild(css);
    }
    const container = document.createElement("div");
    container.id = "userscript-gallery-container";
    container.classList.add("userscript-gallery-hidden");

    const toggle = document.createElement("div"),
      title = document.createElement("strong"),
      link = document.createElement("a");
    toggle.id = "userscript-gallery-toggle";
    title.innerText = "Gallery";
    link.innerText = "[Toggle]";
    link.addEventListener("click", e => {
      document.querySelectorAll(site.container.hide).forEach(group => {
        group.classList.toggle("userscript-gallery-hidden");
      });
      container.classList.toggle("userscript-gallery-hidden");
      if (run == 1) return;
      localStorage.setItem("userscript-gallery-open", +!parseInt(open));
      open = +!parseInt(open);
    }, false);
    if (open == 1) link.click();
    run = 0;
    toggle.appendChild(title);
    toggle.appendChild(link);

    if (site.container.before) {
      const before = document.querySelector(site.container.before);
      if (!before) return;
      before.parentNode.insertBefore(toggle, before);
      before.parentNode.insertBefore(container, before);
    } else {
      const after = document.querySelector(site.container.after);
      if (!after) return;
      after.parentNode.insertBefore(container, after.nextSibling);
      after.parentNode.insertBefore(toggle, after.nextSibling);
    }
    base.forEach(group => {
      const things = {};
      for (const [name, info] of Object.entries(site.data)) {
        if (info.api) {
          for (const [aname, ainfo] of Object.entries(info.api)) {
            ajax[aname] = ainfo;
          }
        }
        let data = (() => {
          let data = info.self ? group : group.querySelector(info.selector);
          if (!data) return "";
          data = data[info.property] || data.getAttribute(info.property);
          if (info.fail) fail = info;
          if (!data) return "";
          return info_replace(data, info);
        })();
        if (info.value) data = info.value;
        things[name] = data;
      }
      groups[things["link"]] = things;
    });
  });

  const container = document.getElementById("userscript-gallery-container");

  async function apireq(links) {
    if (links.length == 0) return;

    let data = "",
      start = performance.now();
    const id = links[0].match(ajax.id)[1];
    if (ajax.source == "cache") {
      start = false;
    } else {
      let fetchinit = {}
      if (ajax.post) {
        const postData = new FormData();
        for (const [key, value] of Object.entries(ajax.post)) {
          postData.append(key, value.replace("{id}", id));
        }
        fetchinit = {
          method: "POST",
          body: postData
        }
      }
      const json = await fetch(ajax.ajax.replace("{id}", id), fetchinit);
      data = await json.text();
    }
    if (ajax.redact) {
      ajax.redact.forEach(regex => {
        const matches = data.match(regex);
        matches.shift();
        matches.forEach(redact => {
          data = data.replace(RegExp(redact, "g"), "REDACTED") && data.replace(/\?passkey=[^"&><?]+&/g, "");
        });
      });
    }
    let api = {
      "response": {}
    };
    if (ajax.source == "local") {
      data = info_replace(data, ajax);
      api.response[links[0]] = data;
      cached[id] = api.response[links[0]];
      GM.setValue("userscript-gallery-cache-" + domain, JSON.stringify(cached));
    } else {
      const formData = new FormData();
      formData.append("action", "add");
      formData.append(`links[${links[0]}]`, data);

      const response = await fetch(ajax.cache, {
        method: "POST",
        body: formData
      });
      api = await response.json();
    }

    if (api.response[links[0]] == "") {
      document.querySelector(`.userscript-gallery-link[href='${links[0]}'] > img`).src = fallback;
    } else {
      document.querySelector(`.userscript-gallery-link[href='${links[0]}'] > img`).src = api.response[links[0]];
    }

    links.shift();
    setTimeout(() => apireq(links), start === false ? 0 : ajax.wait - (performance.now() - start));
  }

  Object.values(groups).forEach(group => {
    if (group.link == "") return;

    const galleryGroup = document.createElement("div"),
      galleryTitle = document.createElement("div"),
      galleryLink = document.createElement("a"),
      galleryImage = document.createElement("img"),
      galleryDetails = document.createElement("div");

    galleryGroup.classList.add("userscript-gallery-group");
    galleryTitle.classList.add("userscript-gallery-title");
    galleryTitle.innerHTML = group.title;
    galleryLink.classList.add("userscript-gallery-link");
    galleryLink.href = group.link;
    galleryLink.title = galleryTitle.innerText.trim();
    galleryImage.classList.add("userscript-gallery-image");
    galleryImage.src = group.image || fallback;
    if (ajax.cache) {
      ajax.links.push(group.link);
      if (ajax.loading) galleryImage.src = ajax.loading;
    }
    galleryImage.addEventListener("error", image => {
      if (Object.keys(fail).length !== 0) {
        const fdata = image.target.parentNode[fail.property] || image.target.parentNode.getAttribute(fail.property);
        if (fails.includes(fdata)) {
          image.target.src = fallback;
        } else {
          fails.push(fdata);
          image.target.src = fdata.replace(fail.search, fail.fail);
        }
      } else {
        image.target.src = fallback;
      }
    });
    galleryDetails.classList.add("userscript-gallery-details");
    galleryDetails.innerHTML = group.details;

    galleryGroup.appendChild(galleryTitle);
    galleryLink.appendChild(galleryImage);
    galleryGroup.appendChild(galleryLink);
    galleryGroup.appendChild(galleryDetails);
    container.appendChild(galleryGroup);
  });

  if (ajax.cache === true) {
    cached = await GM.getValue("userscript-gallery-cache-" + domain);
    if (cached == undefined) {
      cached = {}
    } else {
      cached = JSON.parse(cached);
    }
    ajax.links.forEach(link => {
      id = link.match(ajax.id)[1]
      if (cached[id] == "") {
        document.querySelector(`.userscript-gallery-link[href='${link}'] > img`).src = fallback;
      } else if (!cached[id]) {
        ajax.apilinks.push(link);
      } else {
        document.querySelector(`.userscript-gallery-link[href='${link}'] > img`).src = cached[id];
      }
    });
    if (ajax.apilinks.length > 0) apireq(ajax.apilinks);
  } else if (ajax.cache) {
    const formData = new FormData();
    formData.append("action", "fetch");
    ajax.links.forEach(link => formData.append("links[]", link));
    fetch(ajax.cache, {
        method: "POST",
        body: formData
      }).then(res => res.json())
      .then(cache => {
        if (cache.status != "success") {
          console.error("universal torrent gallery:", cache.status, cache.error);
        } else {
          for (const [link, image] of Object.entries(cache.response)) {
            if (image === false) {
              ajax.apilinks.push(link);
            } else if (image == "") {
              document.querySelector(`.userscript-gallery-link[href='${link}'] > img`).src = fallback;
            } else {
              document.querySelector(`.userscript-gallery-link[href='${link}'] > img`).src = image;
            }
          }
          if (ajax.apilinks.length > 0) apireq(ajax.apilinks);
        }
      })
      .catch(error => console.error("Error:", error));
  }
}

(async () => {
  await gallery();

  if (observe == null) return;
  new MutationObserver(m => gallery()).observe(observe, {
    attributes: false,
    childList: true
  });
})();