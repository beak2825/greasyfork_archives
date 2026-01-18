// ==UserScript==
// @name        DuckDuckgGo Image Direct Link Patch
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.0.4
// @license     AGPL v3
// @author      jcunews
// @description Make DuckDuckgGo Image search result entry's image size information as link to the direct image resource.
// @match       https://duckduckgo.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/428745/DuckDuckgGo%20Image%20Direct%20Link%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/428745/DuckDuckgGo%20Image%20Direct%20Link%20Patch.meta.js
// ==/UserScript==

((dt, xo, ft, mo, ht) => {
  function processEntries() {
    if (!dt) {
      clearTimeout(ht);
      ht = setTimeout(processEntries, 500);
      return;
    }
    document.querySelectorAll(':is(.tile--img>.tile--img__dimensions,div[data-testid="zci-images"] figure>div>img+p):not(.linked_didlp)').forEach((e, a, u) => {
      e.classList.add("linked_didlp");
      (a = document.createElement("A")).textContent = e.textContent;
      a.style.cssText = "color:inherit";
      a.rel = "nofollow noopener noreferrer";
      u = e.previousElementSibling?.href ? e.previousElementSibling.href : e.closest('figure').querySelector('a').href;
      if (!dt.some((d, i) => {
        if (d.url === u) {
          a.href = d.image;
          return true
        }
      })) a.href = 'javascript:void("Image URL is not found")';
      if (e.previousElementSibling?.href) {
        e.replaceChild(a, e.firstChild)
      } else {
        e.innerHTML = "";
        e.append(a)
      }
    });
  }

  xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(mtd, url) {
    if (/^\/?i\.js\?.*\bo=json/.test(url)) {
      this.addEventListener("load", (a, l, z) => {
        try {
          if (!(l = JSON.parse(this.responseText).results)) throw 0;
          Array.prototype.push.apply(dt, l);
        } catch(z) {}
        if (!mo) {
          mo = true;
          (new MutationObserver(recs => {
            clearTimeout(ht);
            ht = setTimeout(processEntries, 500);
          })).observe(document.body, {childList: true, subtree: true});
          processEntries();
        }
      })
    }
    return xo.apply(this, arguments);
  };
  ft = self.fetch;
  self.fetch = async function(url) {
    var r = await ft.apply(this, arguments);
    if (/^\/?i\.js\?.*\bo=json/.test(url)) {
      var rj = r.json;
      r.json = async function() {
        var r = await rj.apply(this, arguments);
        if (l = r.results) Array.prototype.push.apply(dt, l);
        if (!mo) {
          mo = true;
          (new MutationObserver(recs => {
            clearTimeout(ht);
            ht = setTimeout(processEntries, 500);
          })).observe(document.body, {childList: true, subtree: true});
          processEntries();
        }
        return r
      }
    }
    return r
  };

  dt = [];
})();
