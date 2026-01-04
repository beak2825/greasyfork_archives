// ==UserScript==
// @name        Reader mode for SpaceBattles / SufficientVelocity
// @namespace   wsr
// @match       https://forums.spacebattles.com/threads/*/threadmarks
// @match       https://forums.sufficientvelocity.com/threads/*/threadmarks
// @grant       none
// @version     1.3
// @author      Serdan
// @description Custom reader mode for spacebattles.com and sufficientvelocity.com
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/407931/Reader%20mode%20for%20SpaceBattles%20%20SufficientVelocity.user.js
// @updateURL https://update.greasyfork.org/scripts/407931/Reader%20mode%20for%20SpaceBattles%20%20SufficientVelocity.meta.js
// ==/UserScript==

// https://github.com/facebookarchive/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
/*
BSD License

For FixedDataTable software

Copyright (c) 2015, Facebook, Inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

 * Neither the name Facebook nor the names of its contributors may be used to
   endorse or promote products derived from this software without specific
   prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function normalizeWheel(/*object*/ event) /*object*/ {
  var PIXEL_STEP  = 10;
  var LINE_HEIGHT = 40;
  var PAGE_HEIGHT = 800;
  
  var sX = 0, sY = 0,       // spinX, spinY
      pX = 0, pY = 0;       // pixelX, pixelY

  // Legacy
  if ('detail'      in event) { sY = event.detail; }
  if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
  if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
  if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

  // side scrolling on FF with DOMMouseScroll
  if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
    sX = sY;
    sY = 0;
  }

  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;

  if ('deltaY' in event) { pY = event.deltaY; }
  if ('deltaX' in event) { pX = event.deltaX; }

  if ((pX || pY) && event.deltaMode) {
    if (event.deltaMode == 1) {          // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    } else {                             // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
  if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

  return { spinX  : sX,
           spinY  : sY,
           pixelX : pX,
           pixelY : pY };
}

function sleep(milliseconds) {
  return new Promise(r => setTimeout(r, milliseconds));
}

Math.clamp = function (number, min, max) {
  return Math.min(Math.max(number, min), max);
}

class Reader {
  constructor() {
    this.selectors = {
      "content": "",
      "anchors": {}
    }
    this.hotkeys = {
      "next": "n",
      "prev": "p",
      "hide": "q"
    }
    this.loadValue = 0;
    this.pages = new Map();
    this.title = document.title;
  }
  
  async init() {
    this.page = document.getElementById("top");
    
    this.sources = await this.getSources();
    
    this.container = document.createElement("div");
    this.container.id = "wsr";
    document.body.appendChild(this.container);
    
    this.loadBar = document.createElement("div");
    this.loadBar.id = "wsr-loadbar";
    document.body.appendChild(this.loadBar);
    
    const style = document.createElement("style");
    style.innerHTML = this.style;
    document.body.appendChild(style);
    
    const params = new URLSearchParams(location.search);
    if (params.has("page")) {
      document.title = `${this.index + 1}: ${this.title}`;
      this.visible = true;
    }
    else {
      this.visible = false;
    }
    
    document.addEventListener("keydown", async e => await this.onKeyDown(e));
    window.addEventListener("popstate", async e => await this.loadPage());
    window.addEventListener("wheel", async e => await this.onScroll(e));
  }
  
  async loadPage(scrollTo = 0) {
    this.loading = true;
    const content = await this.fetch(this.index);
    if (content === null) {
      this.container.innerHTML = "Failed to load content.";
      return;
    }
    content.id = "wsr-content";
    
    this.container.innerHTML = "";
    this.container.appendChild(content);
    
    window.scrollTo(0, scrollTo * document.body.offsetHeight);
    
    await this.fetch(this.index + 1);
    this.loading = false;
  }
  
  async getSources() {
    const anchors = [];
    for (let i = 0; ; i++) {
      const response = await fetch(this.selectors.anchors.from(i));
      const template = document.createElement("template");
      template.innerHTML = await response.text();
      const a = template.content.querySelectorAll(this.selectors.anchors.selector);
      if (a.length === 0) {
        break;
      }
      anchors.push([...a]);
    }
    
    return anchors.flat().map(a => a.href);
  }
  
  async fetch(index) {
    if (this.pages.has(index)) {
      return this.pages.get(index);
    }
    const source = this.sources[index] || null;
    if (source === null) {
      return null;
    }
    
    const parts = source.split("#");
    const url = parts[0];
    const id = parts.length > 1 ? parts[1] : null;
    
    let page = null;
    if (this.lastFetch && this.lastFetch.url === url) {
      page = this.lastFetch.page;
    }
    else {
      const response = await fetch(url);
      page = await response.text();
      this.lastFetch = {
        "url": url,
        "page": page
      };
    }
    
    const template = document.createElement("template");
    template.innerHTML = page;
    const content = template.content.querySelector(this.selectors.content.replace("{id}", id));
    this.pages.set(index, content);
    return content;
  }
  
  async onKeyDown(e) {
    if (this.loading) {
      return;
    }
    switch (e.key) {
      case this.hotkeys.next:
        this.index++;
        await this.loadPage();
        break;
      case this.hotkeys.prev:
        this.index--;
        await this.loadPage();
        break;
      case this.hotkeys.hide:
        this.visible = !this.visible;
        break;
    }
  }
  
  async onScroll(e) {
    if (this.loading || !this.visible) {
      return;
    }
    if ((window.scrollY === 0 && this.index > 0) || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadValue += normalizeWheel(e).spinY;
      const load = Math.clamp(this.loadValue / 10, -1, 1);
      const width = this.loadBar.parentElement.clientWidth * Math.abs(load);
      this.loadBar.style.width = width + "px";

      if (load === 1 || load === -1) {
        this.loadValue = 0;
        this.index += load;
        await this.loadPage(Math.clamp(-load, 0, 1));
        this.loadBar.style.width = "0";
      }
    }
    else {
      this.loadValue = 0;
      this.loadBar.style.width = "0";
    }
  }
    
  getUrl(page) {
    return location.origin + location.pathname + `?page=${page}`;
  }
  
  get index() {
    const params = new URLSearchParams(location.search);
    return params.has("page") ? params.get("page") - 1 : 0;
  }
  
  set index(value) {
    value = Math.clamp(value, 0, this.sources.length - 1);
    if (this.index !== value) {
      const page = value + 1;
      const title = `${page}: ${this.title}`;
      history.pushState(null, title, this.getUrl(page));
      document.title = title;
    }
  }
  
  get visible() {
    return !this.container.hidden;
  }
  
  set visible(value) {
    if (value) {
      this.container.hidden = false;
      this.loadBar.hidden = false;
      this.page.style.display = "none";
    }
    else {
      this.container.hidden = true;
      this.loadBar.hidden = true;
      this.page.style.display = null;
    }
  }
}

(async () => {
  const reader = new Reader();
  
  function hijackAnchors(reader) {
    const anchors = document.querySelectorAll("#threadmark-category-1 .structItem-cell--main a[data-tp-primary]:not([data-hijacked])");
    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      anchor.innerHTML = "> " + anchor.innerHTML;
      anchor.onclick = async e => {
        e.preventDefault();
        reader.index = reader.sources.indexOf(anchor.href);
        await reader.loadPage();
        reader.visible = true;
      };
      anchor.dataset.hijacked = true;
    }
  }
  function hijackFetcher(reader) {
    const btn = document.querySelector('[data-xf-click="threadmark-fetcher"]');
    if (btn) {
      btn.addEventListener("click", async () => { await sleep(1000); hijackAnchors(reader); hijackFetcher(reader); });
    }
  }
  
  hijackFetcher(reader);
  hijackAnchors(reader);
  
  reader.selectors.content = "#{id} ~ .message-inner > .message-cell--main .bbWrapper";
  reader.selectors.anchors = {
    "from": i => `threadmarks-load-range?threadmark_category_id=1&min=${(i * 200) - 1}&max=${(i + 1) * 200}`,
    "selector": ".structItem-cell--main a[data-tp-primary]"
  };
  
  // reader.hotkeys.next = "n";
  // reader.hotkeys.prev = "p";
  // reader.hotkeys.hide = "q";
  
  reader.style = `
#wsr {
  background-color: #1d1d1d;
}

#wsr > #wsr-content {
  width: 800px;
  padding: 60px 100px;
  margin: 0 auto;
  background-color: #0f0f0f;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #bbbbbb;
  font-size: 15px;
  line-height: 24px;
}

#wsr-loadbar {
  height: 5px;
  width: 0;
  background-color: teal;
  position: fixed;
  bottom: 0;
}

#wsr .bbCodeBlock {
  margin: .75em 0;
  background: rgba(0,0,0,0.91);
  border: 1px solid #374e72;
}

#wsr .bbCodeBlock-content {
  position: relative;
  padding: 5px 10px;
}

#wsr .bbCodeBlock-expandLink, .bbCodeBlock-shrinkLink {
  display: none;
}

#wsr .bbCodeSpoiler-content {
  display: none;
}

#wsr .bbCodeSpoiler-content.is-active {
  display: block;
}

.tooltip {
  display: none !important;
}
`;
  
  await reader.init();
  await reader.loadPage();
})();