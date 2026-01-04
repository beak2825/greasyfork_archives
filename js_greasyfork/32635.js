// ==UserScript==
// @name        Disable Google Search Result URL Redirector
// @namespace   DisableGoogleSearchResultURLRedirector
// @version     1.1.16
// @license     GNU AGPLv3
// @author      jcunews
// @description Disable Google URL redirector (i.e. user data tracking) on Google Search result, including Google Custom Search Engine (CSE) which is used by many websites, and in Google Groups.
// @website     https://greasyfork.org/en/users/85671-jcunews
// @include     *://*/*
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/32635/Disable%20Google%20Search%20Result%20URL%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/32635/Disable%20Google%20Search%20Result%20URL%20Redirector.meta.js
// ==/UserScript==

(function() {

  //===== CONFIGURATION BEGIN =====

  var disableGoogleAdSense = true;
  var disableInterstitials = true; //e.g. malware warning page

  //===== CONFIGURATION END =====

  function rwt_() { return true }

  function checkElement(ele, m, obj, fn) {
    if (ele.tagName === "SCRIPT") {
      if (disableGoogleAdSense && (/:\/\/cse\.google\.com\/adsense\/search\/(async-)?ads\.js/).test(ele.src)) {
        return false;
      } else if (m = ele.src.match(/:\/\/www.googleapis.com\/customsearch\/.*callback=([^?]+)/)) {
        obj = unsafeWindow;
        m[1].split(".").forEach(function(k, i, a) {
          if (i < (a.length - 1)) {
            obj = obj[k];
          } else {
            fn = obj[k];
            obj[k] = function(data) {
              data.results.forEach(function(res) {
                delete res.clicktrackUrl;
              });
              return fn.apply(this, arguments);
            };
          }
        });
      }
    } else if (ele.querySelectorAll && (m = ele.querySelectorAll('a[data-cturl]')).length) {
      m.forEach(m => {
        delete m.dataset.cturl
      })
    }
    return true;
  }

  if ((/(www|groups)\.google\.[a-z]+(\.[a-z]+)?/).test(location.hostname)) {
    //Google site
    addEventListener("mousedown", (ev, a) => {
      //web search
      if (unsafeWindow.rwt && (unsafeWindow.rwt !== rwt_)) unsafeWindow.rwt = rwt_;
      //image search
      if (a = ev.target.closest('a[data-ved]')) a.setAttribute("rlhc", "1");
    }, true);
    //Google web search site
    function removeInterstitials() {
      document.querySelectorAll('#rcnt #res #search .g a[href^="/interstitial?"]').forEach(a => {
        a.setAttribute("href", decodeURIComponent(a.getAttribute("href").match(/\burl=([^&]+)/)[1]));
        a.rel = "noreferrer";
      });
    }
    //Google image search site
    let open_ = unsafeWindow.open;
    unsafeWindow.open = function(url, target) {
      if (!url) {
        let wnd = open_.apply(this, arguments);
        let wrt = wnd.document.write;
        wnd.document.write = function(s) {
          let m = s.match(/<meta http-equiv="refresh"[^>]+>/);
          if (m) {
            let e = document.createElement("DIV");
            e.innerHTML = m[0];
            e = e.firstElementChild;
            e.content = "0; url=" + decodeURIComponent(e.content.match(/https:\/\/www\.google\.[^/]+\/url\?.*?&url=([^&]+)/)[1]);
            s = s.replace(m[0], e.outerHTML);
            wnd.document.write = wrt;
          }
          return wrt.apply(this, arguments);
        };
        return wnd;
      } else {
        let m = url.match(/https:\/\/www\.google\.[^/]+\/url\?.*?&url=([^&]+)/);
        if (m) url = decodeURIComponent(m[1]);
        return open_.apply(this, arguments);
      }
    };
    //Google Groups and probably others too
    let desc = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, "href");
    let setHref = desc.set;
    desc.set = function(value) {
      if ((/:\/\/[^\/]+\/aclk\b|\/url\b/).test(value)) {
        this.rel = "noreferrer";
        return this.href;
      } else return setHref.apply(this, arguments);
    };
    Object.defineProperty(HTMLAnchorElement.prototype, "href", desc);
    //Any search site
    addEventListener("load", () => {
      if (disableInterstitials) removeInterstitials();
    });
  } else {
    //other sites
    let appendChild_ = Node.prototype.appendChild;
    Node.prototype.appendChild = function(ele) {
      if (checkElement(ele)) {
        return appendChild_.apply(this, arguments);
      } else return ele;
    };
    let insertBefore_ = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(ele) {
      if (checkElement(ele)) {
        return insertBefore_.apply(this, arguments);
      } else return ele;
    };
  }
})();
