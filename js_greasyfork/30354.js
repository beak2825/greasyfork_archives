// ==UserScript==
// @name         Background Network Requests Indicator
// @namespace    BackgroundNetworkRequestsIndicator
// @version      1.1.21
// @license      AGPL v3
// @author       jcunews
// @description  Shows an indicator at bottom right/left when there is one or more background network requests in progress.
// @website      https://greasyfork.org/en/users/85671-jcunews
// @match        *://*/*
// @inject-into  page
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/30354/Background%20Network%20Requests%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/30354/Background%20Network%20Requests%20Indicator.meta.js
// ==/UserScript==

/*
The number on the indicator shows the number of background network requests in progress.

When it shows, by default it will be placed at bottom-right. When the mouse cursor is
moved to the right half area of the page, the indicator will move itself to the bottom-left.

If the SHIFT key is held down, the indicator will stay. And when the mouse cursor is on it,
a list of pending network request URLs will be shown.
*/

((eleContainer, eleStyle, eleList, eleIndicator, xhrId, xhrCount, xhrAbort, xhrOpen, xhrSend, shiftPressed) => {

  if (!(document instanceof HTMLDocument)) return;

  var to = {createHTML: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to, html = s => tp.createHTML(s);

  (eleContainer = document.createElement("DIV")).id = "bnriContainer";
  eleContainer.innerHTML = html(`<style>
#bnriContainer, #bnriList, #bnriList>.url, #bnriIndicator {
  display:block!important; opacity:1!important; visibility:visible!important;
  position:static!important; float:none!important; margin:0!important;
  box-sizing:content-box!important; border:none!important; padding:0!important;
  width:auto!important; min-width:0!important; max-width:none!important;
  height:auto!important; min-height:0!important; max-height:none!important;
  background:transparent!important; font:10pt/normal sans-serif!important;
}
#bnriContainer {
  position:fixed!important; z-index:9999999999!important; left:auto!important;
  top:auto!important; right:0!important; bottom:.5em!important;
}
#bnriContainer.left, #bnriContainer.left #bnriList {
  left:0!important; right:auto!important;
}
#bnriList {
  display:none!important; position:fixed!important; left:auto!important; top:auto!important;
  right:0!important; bottom:1.7em!important; border:1px solid #555!important;
  max-height:50vw!important; overflow-x:hidden!important; overflow-y:auto!important; background-color:#ddd!important;
}
#bnriContainer:hover>#bnriList {
  display:block!important;
}
#bnriList>.url {
  max-width:90vw!important; padding:0 .2em!important; line-height:1.5em!important;
  white-space: nowrap!important; text-overflow:ellipsis!important; color: #000!important;
}
#bnriList>.url:nth-child(2n) {
  background-color:#ccc!important;
}
#bnriIndicator {
  border:1mm solid #bb0!important; border-radius:2em!important;
  padding:0 1mm!important; background-color:#ff0!important; text-align:center!important;
  color:#000!important; cursor:default!important;
}
</style>
<div id="bnriList"></div>
<div id="bnriIndicator"></div>
`);
  eleList = eleContainer.querySelector("#bnriList");
  eleIndicator = eleContainer.querySelector("#bnriIndicator");

  xhrId = xhrCount = 0;

  function checkCursor(ev) {
    if (!shiftPressed) {
      if (ev.clientX >= Math.floor(innerWidth / 2)) {
        eleContainer.className = "left";
      } else eleContainer.className = "";
    }
  }

  function doneRequest(xhr) {
    if (xhr.id_bnri && (--xhrCount < 0)) xhrCount = 0;
    delete xhr.id_bnri;
    if (xhr.ele_bnri && xhr.ele_bnri.parentNode) {
      xhr.ele_bnri.parentNode.removeChild(xhr.ele_bnri); //ignorant Metodize library broke Element.prototype.remove()
      delete xhr.ele_bnri;
    }
    if (xhrCount) {
      eleIndicator.textContent = xhrCount;
    } else if (eleContainer.parentNode) {
      removeEventListener("mousemove", checkCursor);
      document.body.removeChild(eleContainer);
      setTimeout(() => { //workaround when element isn't removed somehow
        if (!xhrCount && eleContainer.parentNode) document.body.removeChild(eleContainer);
      }, 0);
    }
  }

  function doneEvent(ev) {
    doneRequest(ev.target)
  }

  function checkState() {
    if ((this.readyState >= XMLHttpRequest.HEADERS_RECEIVED) && !eleContainer.parentNode && document.body) {
      document.body.appendChild(eleContainer);
      addEventListener("mousemove", checkCursor);
    }
    if ((this.readyState !== XMLHttpRequest.DONE) || !this.id_bnri) return;
    doneRequest(this);
  }

  xhrAbort = XMLHttpRequest.prototype.abort;
  XMLHttpRequest.prototype.abort = function() {
    doneRequest(this);
    return xhrAbort.apply(this, arguments);
  };

  xhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    if (!this.url_bnri) {
      this.addEventListener("abort", doneEvent);
      this.addEventListener("error", doneEvent);
      this.addEventListener("load", doneEvent);
      this.addEventListener("timeout", doneEvent);
      this.addEventListener("readystatechange", checkState);
    }
    this.url_bnri = arguments[1];
    return xhrOpen.apply(this, arguments);
  };

  xhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    if (!this.id_bnri) {
      this.id_bnri = ++xhrId;
      (this.ele_bnri = eleList.appendChild(document.createElement("DIV"))).className = "url";
      this.ele_bnri.textContent = "XHR: " + this.url_bnri;
    }
    eleIndicator.textContent = ++xhrCount;
    if (!eleContainer.parentNode && document.body) {
      document.body.appendChild(eleContainer);
      addEventListener("mousemove", checkCursor);
    }
    return xhrSend.apply(this, arguments);
  };

  var ffetch = window.fetch;
  window.fetch = function(urlReq, opts) {
    var context = {urlReq: opts || urlReq, id_bnri: ++xhrId, ele_bnri: eleList.appendChild(document.createElement("DIV"))};
    context.ele_bnri.className = "url";
    context.ele_bnri.textContent = "fetch: " + (urlReq.url || urlReq);
    eleIndicator.textContent = ++xhrCount;
    if (!eleContainer.parentNode && document.body) {
      document.body.appendChild(eleContainer);
      addEventListener("mousemove", checkCursor);
    }
    function doneFetch() {
      doneRequest(context);
    }
    var a = "finally_bnri" + (urlReq.url || urlReq);
    window.fetch[a] = doneFetch;
    var res = ffetch.apply(this, arguments).finally(doneFetch);
    setTimeout(a => {
      delete window.fetch[a]
    }, window.fetch.timeout_bnri || 10000, a);
    return res;
  };

  var nac = Node.prototype.appendChild;
  Node.prototype.appendChild = function(e) {
    var z;
    if ((this.tagName === "BODY") && (e?.tagName === "IFRAME")) {
      var r = nac.apply(this, arguments);
      try {
        if (/^about:blank\b/.test(e.contentWindow.location.href)) e.contentWindow.fetch = fetch
      } catch(z) {}
      return r
    } else return nac.apply(this, arguments)
  }

  addEventListener("keydown", e => {
    if (e.key === "Shift") shiftPressed = true;
  });

  addEventListener("keyup", e => {
    if (e.key === "Shift") shiftPressed = false;
  });

})();
