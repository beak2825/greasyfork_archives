// ==UserScript==
// @name          Remove Facebook's external link tracking (updated for the new FB)
// @description   Removes redirection and the "click identifier" from external links on FBs
// @namespace     https://gist.github.com/k-barton
// @include       https://*.facebook.com*
// @include       http://*.facebook.com*
// @version       0.3.6
// @grant         unsafeWindow
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/422649/Remove%20Facebook%27s%20external%20link%20tracking%20%28updated%20for%20the%20new%20FB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422649/Remove%20Facebook%27s%20external%20link%20tracking%20%28updated%20for%20the%20new%20FB%29.meta.js
// ==/UserScript==
(function() {

    var redirUrl = new URL('https://l.facebook.com/l.php');

    var findLinkUpwards = function(el) {
        var test;
        while (el && (test = el.tagName.toUpperCase() !== "A"))
            el = el.parentElement;
        return test ? undefined : el;
    }

    var fixLink = function(el) {
        var url = new URL(el.href);
        if (url.host.endsWith(document.location.host)) return false;

        var onclick = el.hasAttribute('onclick');
        if (el.hasAttribute('onclick'))
            el.removeAttribute('onclick');
        if (el.hasAttribute('onmouseover'))
            el.removeAttribute('onmouseover');
        if (el.onclick) el.onclick = null;
        if (el.onmouseover) el.onmouseover = null;

        if (url.host === redirUrl.host &&
            url.pathname === redirUrl.pathname &&
            url.searchParams.has("u")) {
            url = decodeURIComponent(url.searchParams.get("u"));
        }
        
        if (url.searchParams.has("fbclid"))
            url.searchParams.delete("fbclid");
        
        var rmKey = [];
        if(url.search) { // && (Array.from(url.searchParams).length !== 0)) { 
          for (let [k, v] of url.searchParams)
              if (k.startsWith("utm_")) rmKey.push(k);
          for(let i = 0; i < rmKey.length; ++i) url.searchParams.delete(rmKey[i]);
          
        }

        //console.debug("Original link: \n" +  el.href + "\nModified link: \n" + url.href);
        el.href = url.href;
        return true;
    };

    var linkClick = function(el) {
        //   alert(el.href); // DEBUG
        window.open(el.href, '_blank');
        // TODO: open link in background with CTRL/middle click
    };

    var markFixedElement = function(el) {
        if(el.classList.contains("cleaned_link"))
          return;
        el.classList.add("cleaned_link");
    };

    document.onclick = function(event) {
        var el = findLinkUpwards(event.target);
        if (!el) return;
        if (!fixLink(el)) return;
        event.preventDefault();
        markFixedElement(el); // XXX: this may obscure image links, comment this line out if needed
        linkClick(el);
    };
    
    var sheet = (function() {
      var style = document.createElement("style");
      style.setAttribute("media", "screen");
      style.appendChild(document.createTextNode("")); // WebKit hack
      document.head.appendChild(style);
      return style.sheet;
    })();
  
    sheet.insertRule(".cleaned_link { background-color: #FFEE2233 !important; }");
    sheet.insertRule(".cleaned_link::after { content: '☺'; }");

    //console.log("Loaded script: remove facebook tracking");

})();
