// ==UserScript==
// @name        Google Image Direct Link Patch
// @namespace   GoogleImageDirectLinkPatch
// @version     1.3.18
// @license     AGPL v3
// @author      jcunews
// @description Readd Google Image search result entry's image bottom panel as bottom-right image size information and link it to the direct image resource.
// @website     https://greasyfork.org/en/users/85671-jcunews
// @include     /^https:\/\/www\.google\.(co\.)?[a-z]{2,3}\/search.*(tbm=isch|udm=2)/
// @include     /^https:\/\/www\.google\.com(\.[a-z]{2,3})?\/search.*(tbm=isch|udm=2)/
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/26510/Google%20Image%20Direct%20Link%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/26510/Google%20Image%20Direct%20Link%20Patch.meta.js
// ==/UserScript==

((cnt, xo, cd) => {
  function processEntries() {
    cnt.querySelectorAll('div>h3:not(.paneled_gidlp)').forEach((e, a, o) => {
      if (cd) {
        e.classList.add("paneled_gidlp");
        e.insertBefore(a = document.createElement("A"), e.firstChild).className = "panel_gidlp";
        a.rel = "nofollow noopener noreferrer";
        o = cd[e.closest('[jsdata]').getAttribute("jsdata").match(/[^;]+$/)?.[0]]
        a.dataset.ow = o?.[1]?.[3]?.[2] || "???";
        a.dataset.oh = o?.[1]?.[3]?.[1] || "???";
        a.href = o?.[1]?.[3]?.[0] || 'javascript:void("Image URL is not found")';
        a.addEventListener("click", ev => {
          ev.stopImmediatePropagation();
          ev.stopPropagation();
        }, true)
      } else {
        (function wl(e, a, o) {
          if (o = e.closest('div[jscontroller]')?.__jscontroller?.pending?.value?.Vz?.Bp?.[1]?.Bp?.[3]) {
            e.classList.add("paneled_gidlp");
            if (!(a = e.querySelector('.panel_gidlp'))) e.insertBefore(a = document.createElement("A"), e.firstChild).className = "panel_gidlp";
            a.rel = "nofollow noopener noreferrer";
            a.dataset.ow = o[2] || "???";
            a.dataset.oh = o[1] || "???";
            a.href = o[0] || 'javascript:void("Image URL is not found")';
            a.addEventListener("click", ev => {
              ev.stopImmediatePropagation();
              ev.stopPropagation();
            }, true)
          } else setTimeout(wl, 100, e, a)
        })(e, a)
      }
    })
  }

  xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(mtd, url) {
    if (url.startsWith("/search?")) {
      this.addEventListener("load", (v, z) => {
        if ((v = this.responseText.split(";[")).length) try {
          JSON.parse("[" + v[v.length - 1])[0].forEach(a => {
            try {
              cd[a[0]] = JSON.parse(a[1])
            } catch(z) {}
          })
        } catch(z) {}
      })
    }
    return xo.apply(this, arguments)
  };

  addEventListener("load", (a, mo, ht) => {
    Array.from(document.querySelectorAll('script:not([src])')).some(e => {
      if (e = e.text.match(/var [a-z]=(\{".*?\});/)) {
        cd = JSON.parse(e[1]);
        return true
      }
    });
    document.documentElement.appendChild(a = document.createElement("STYLE")).id = "css_gidpl";
    a.innerHTML = `
#rso div>h3>.panel_gidlp {
position: absolute; z-index: 1; right: 0; bottom: 0; font-size: 10pt; line-height: normal;
}
#rso div>h3>.panel_gidlp:before {
border-radius: .2em; padding: 0 .3ex; background-color: #444; color: #fff; content: attr(data-ow) "x" attr(data-oh);
}
#rso div>h3>.panel_gidlp:visited:before {
color: #f9f;
}`;
    if (cnt = document.querySelector("#rso div[jsmodel][jsdata]")) {
      (mo = new MutationObserver(recs => {
        clearTimeout(ht);
        ht = setTimeout(processEntries, 500);
      })).observe(cnt, {childList: true});
      processEntries()
    }
  })
})()
