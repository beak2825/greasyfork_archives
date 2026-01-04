// ==UserScript==
// @name         PornoLab.net Thumbnail ExpanderEX
// @namespace    http://pornolab.net/
// @version      1.1.1
// @description  Automatically unfolds spoilers and replaces thumbnails with full-sized images constrained to the viewport height while blocking thumbnails linking to adware.
// @author       Anonymous
// @license      GPL-3.0-or-later
// @include      http://pornolab.net/forum/viewtopic.php*
// @include      https://pornolab.net/forum/viewtopic.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/524901/PornoLabnet%20Thumbnail%20ExpanderEX.user.js
// @updateURL https://update.greasyfork.org/scripts/524901/PornoLabnet%20Thumbnail%20ExpanderEX.meta.js
// ==/UserScript==

(function() {
  const autoUnfold = true;
  const autoPreload = true;
  const maxImgWidth = '1200px';
  const maxImgHeight = (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 50) + 'px';
  const blockedHosts = ['piccash.net', 'picclick.ru', 'pic4cash.ru', 'picspeed.ru', 'picforall.ru', 'freescreens.ru'];
  const disableImageReplacementInsideFoldsWithTitle = ['show'];

  function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  class Ticker {
    #last = new Date();
    tick() { this.#last = new Date(); }
    async wrap(cb, ms) {
      this.tick();
      await cb();
      await this.after(ms);
    }
    async after(ms) {
      const passed = new Date() - this.#last;
      if (passed > ms) { return; }
      await sleep(ms - passed);
    }
  }

  const qhandler = new class {
    #running = false
    async run(queue) {
      if (this.#running) { return; }
      const ticker = new Ticker();

      this.#running = true
      for (let i = 0; i < queue.length; i++) {
        while (!document.hasFocus()) { await sleep(200); }

        try { await ticker.wrap(queue[i], 500); }
        catch (err) { console.error(err); i--; await ticker.after(1000); }
      }
      this.#running = false
    }
  };

  const queue = Array.from(document.querySelectorAll('.sp-wrap')).map((post) => {
    const links = Array.from(post.querySelectorAll('var.postImg'));
    if (!links.length) return;

    if (autoUnfold) {
      post.querySelectorAll('.sp-head').forEach(header => header.classList.add('unfolded'));
    }

    if (autoPreload || autoUnfold) {
      post.querySelectorAll('.sp-body').forEach(body => {
        if (autoPreload) body.classList.add('inited');
        if (autoUnfold) body.style.display = 'block';
      })
    }

    const foldTitle = post.querySelector('.sp-head')?.textContent;
    const disableReplace = disableImageReplacementInsideFoldsWithTitle.includes(foldTitle);

    const queue = [];
    for (const link of links) {
      const url = link.title;
      const parentHref = link.parentNode?.href;

      if (!parentHref || disableReplace) {
        updateImageUrl(link, url);
        continue;
      }

      if (isBlocked(url)) {
        updateImageUrl(link, null);
        continue;
      }

      const updater = getImageUpdater(url, parentHref);
      updater ? queue.push(() => updater(link)) : updateImageUrl(link, url);
    }

    return queue;
  }).flat().filter(e => e);

  qhandler.run(queue);

  async function req(url, method, responseType = undefined) {
    return new Promise((res, rej) => {
      GM_xmlhttpRequest({
        method,
        url,
        responseType,
        onerr: rej,
        onload: res
      });
    });
  }

  function isBlocked(url) {
    return blockedHosts.some(host => url.includes(host));
  }

  function getImageUpdater(url, parentHref) {
    if (url.includes('fastpic.org')) {
      return link => handleFastpic(link, parentHref);
    } else if (url.includes('imagebam.com')) {
      return link => handleImageBam(link, parentHref);
    } else if (url.includes('imagevenue.com')) {
      return link => handleImageVenue(link, parentHref);
    } else if (url.includes('imgbox.com')) {
      return link => updateImageUrl(link, url.replace('thumbs', 'images').replace('_t', '_o'));
    } else if (url.includes('imgdrive.net')) {
      return link => handleImgDrive(link, url.replace('small', 'big'));
    } else if (parentHref.includes('turboimagehost.com')) {
      return link => handleTurboimagehost(link, parentHref);
    }
    return null;
  }

  async function fastpicUrl(link, url) {
    return await req(url, 'GET').then(response => {
      const match = response.responseText.match(/https?:\/\/i[0-9]{0,3}\.fastpic\.org\/big\/.+\.(?:jpe?g|png)\?.+?"/);
      console.log(match);
      if (![302, 200].includes(response.status)) throw 429;
      if (match) updateImageUrl(link, match[0].slice(0, -1));
      else updateImageUrl(link, url);
    });
  }

  async function fastpicIsDirectUrl(_, url) {
    return await req(url, 'HEAD').then(response => {
      const responseType = response.responseHeaders.split('\n').find(e => e.startsWith('content-type'))?.split(' ')?.[1]?.replace(';', '');
      console.log(responseType);
      return responseType !== 'text/html';
    });
  }

  async function handleFastpic(link, parentHref) {
    const url = parentHref || link.title;
    return await fastpicIsDirectUrl(link, url).then(c => !c ? fastpicUrl(link, url) : updateImageUrl(link, url));
  }

  async function handleImageBam(link, parentHref) {
    return await req(parentHref, 'GET').then(r => {
      const match = r.responseText.match(/<img src="(.+?)"[^>]+class="main-image/i);
      if (match) updateImageUrl(link, match[1]);
    });
  }

  async function handleImageVenue(link, parentHref) {
    return await req(parentHref, 'GET').then(r => {
      const match = r.responseText.match(/https?:\/\/cdn-images\.imagevenue\.com\/[a-z0-9]{2}\/[a-z0-9]{2}\/[a-z0-9]{2}\/.+?_o\.(?:jp.?g|png)"/);
      if (match) updateImageUrl(link, match[0].slice(0, -1));
    });
  }

  async function handleImgDrive(link, url) {
    return await req(url, 'GET', 'blob').then(r => {
      const reader = new FileReader();
      reader.onload = () => updateImageUrl(link, reader.result);
      reader.readAsDataURL(r.response);
    });
  }

  async function handleTurboimagehost(link, url) {
    return await req(url, 'GET').then(r => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(r.responseText, 'text/html');
      const src = doc.body.querySelector('img#imageid')?.src
      if (src) updateImageUrl(link, src)
    });
  }

  function updateImageUrl(node, url) {
    node.title = url;
    if (url && autoPreload) {
      node.innerHTML = `<img src="${url}" style="max-width:${maxImgWidth}; max-height:${maxImgHeight};"/>`;
    }
  }
})()
