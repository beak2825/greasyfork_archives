// ==UserScript==
// @name         Google Books Preview Downloader
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.3
// @license      AGPLv3
// @author       jcunews
// @description  Add link to download Google Books preview pages into a ZIP file including a book viewer HTML application for use with a web browser (use web browser's zoom feature to zoom in/out pages).
// @include      /^https:\/\/books\.google\.com\/books\?.*$/
// @include      /^https:\/\/books\.google\.com?\.[a-z]{2}\/books\?.*$/
// @include      /^https:\/\/books\.google\.[a-z]{2}\/books\?.*$/
// @require      https://cdn.jsdelivr.net/gh/nindogo/tiny_zip_js@4fa0ae770e32bac5181c83d8c5c6a9f59f853e12/tiny_zip.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445971/Google%20Books%20Preview%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/445971/Google%20Books%20Preview%20Downloader.meta.js
// ==/UserScript==

((em, dd, dp, dt, ic, dl, rl, pi, pc, dc, tz, ns, fe, ou, z) => {
  function cl(e) {
    clearInterval(dt);
    if (fe && (fe !== 1)) alert(em);
    dp.remove();
    document.body.style.pointerEvents = ""
  }
  function fer(e) {
    fe = e;
    if (--dc === 0) cl(e)
  }
  function html(s, e) {
    (e = document.createElement("DIV")).textContent = s;
    return e.innerHTML
  }
  function gi(ii, ti, si, ct) {
    if (fe) return;
    dc++;
    fetch(ii.page[si].src + "&w=" + dd[1].max_resolution_image_width).then(r => ((ct = r.headers.get("content-type")), r.arrayBuffer())).then((a, b) => {
      dc--;
      tz.add(ns[ti] = `${("000" + (ti + 1)).substr(-4)}-${ii.page[si].pid}${
        dd[0].page[ti].title ? " " + dd[0].page[ti].title.replace(/[\*:\\\|\<\>\/\?]/, "-") : ""
      }.${ct ? ct.match(/\/(.*)/)[1].replace("jpeg", "jpg") : "png"}`, new Uint8Array(a));
      if (++pc === dl) {
        (new Blob([`<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8 />
  <!--
    Downloaded on $(dltime) from: $(gburl)

    Using Google Books Preview Downloader v1.0.1.
    https://greasyfork.org/en/users/85671-jcunews
  -->
  <title>$(title)</title>
  <style>
    body{
      margin:1.7vw 0 0 0;background:#bbb;overflow:hidden;text-align:center;
      font-family:sans-serif;font-size:1.2vw;
    }
    button,input{
      box-sizing:border-box;border-width:.1vw;padding:0 .25vw;height:1.45vw;
      font:inherit;line-height:1vw;
    }
    #tnav{ display:none; }
    #panel{
      position:fixed;left:0;top:0;right:0;border-bottom:.1vw solid #000;
      box-sizing:border-box;height:1.7vw;background:#ddd;
    }
    #lnav{
      position:absolute;z-index:1;left:1.0vw;top:.1vw;box-sizing:border-box;
      border:.1vw solid #55f;border-radius:.3vw;;padding:0 .3vw;
      line-height:1.3vw;cursor:pointer;
    }
    #tnav:checked+#panel #lnav{
      border-color:transparent;background:#55f;color:#fff;
    }
    #title{
      position:absolute;left:6vw;width:36vw;height:1.6vw;overflow:hidden;
      text-align:left;white-space:nowrap;text-overflow:ellipsis;
    }
    #pnc{ display:inline-block;margin-top:.1vw;vertical-align:top; }
    #pnc button{ margin:0 1vw;width:1.6vw; }
    #pn{
      vertical-align:top;border-width:.1vw;padding-right:0;width:4vw;
      text-align:right;
    }
    #vgb{ position:absolute;right:.3vw;text-decoration:none }
    #nav{
      position:fixed;left:0;top:1.7vw;bottom:0;box-sizing:border-box;
      border-right:.1vw solid #000;padding-bottom:.4vw;width:6vw;
      overflow-y:scroll;background:#ddd;counter-reset:pg;
    }
    #tnav:not(:checked)~#nav{ display:none; }
    #nav a{
      display:inline-block;margin-top:.4vw;box-sizing:border-box;
      border:.1vw solid #000;width:4vw;background:#fff;
      text-decoration:none!important;counter-increment:a;
    }
    #nav a:after{
      display:block;color:#000;font-size:1vw;line-height:1vw;
      content:counter(a);
    }
    #nav a:hover:after{ background:#bbf; }
    #nav img{
      vertical-align:top;width:100%;object-fit:contain;object-position:0 0;
    }
    #pages{
      position:fixed;left:6vw;top:1.7vw;right:0;bottom:0;padding-bottom:.4vw;
      overflow:auto;
    }
    #tnav:not(:checked)~#pages{ left:0; }
    #pages img{
      vertical-align:top;margin:.4vw 0 0 .4vw;border:.1vw solid #000;
      box-sizing:border-box;width:calc(100% - .8vw);background:#fff;
      object-fit:contain;object-position:0 0;
    }
  </style>
  <style id=css></style>
</head>
<body>
  <input id=tnav type=checkbox checked />
  <div id=panel>
    <label id=lnav for=tnav>Nav</label>
    <div id=title title="$(title2)">$(title2)</div>
    <div id=pnc>
      <button id=pp>&lt;</button>
      Page <input id=pn type=number value=1 min=1 max=$(pagemax)/>
      <button id=np>&gt;</button>
    </div>
    <a id=vgb href="$(gburl)">View in Google Books</a>
  </div>
  <div id=nav></div>
  <div id=pages></div>
  <script>
    a = b = "";
    "${ns.join("|")}".split("|").forEach((n, i) => {
      a += \`<a href=#p$[i + 1]><img src="$[n]" /></a>\`;
      b += \`<img id=p$[i + 1] src="$[n]" />\`
    });
    nav.innerHTML = a;
    nav.querySelectorAll("A").forEach((e, i) => e.page = i + 1);
    pages.innerHTML = b;
    (ps = Array.from(pages.children)).forEach((e, i) => e.page = i + 1);
    (tnav.onchange = onresize = () => setTimeout(() => {
      css.innerHTML = \`#pages img{width:calc($[pages.offsetWidth - pages.offsetTop * 2]px * $[devicePixelRatio])}\`
    }, 0))();
    pn.oninput = e => (e = nav.querySelector(\`a[href="#p$[pn.value]"]\`)) && e.click();
    pages.onscroll = (vh, st, pm) => {
      vh = pages.offsetHeight / 2;
      st = pages.scrollTop;
      pm = ps[0].offsetTop;
      ps.some(e => {
        if ((st >= (e.offsetTop - pm - vh)) && (st < (e.offsetTop + e.offsetHeight - vh))) {
          pn.value = e.page;
          return true
        }
      })
    };
    addEventListener("keydown", ev => {
      if (!ev.altKey && !ev.ctrlKey && !ev.shiftKey) switch (ev.key) {
        case "ArrowLeft":
          pp.click()
          break;
        case "ArrowRight":
          np.click()
          break;
      }
    });
    addEventListener("click", (ev, e) => {
      switch ((e = ev.target).id) {
        case "pp":
          pn.oninput(pn.value = pn.value > 1 ? parseInt(pn.value) - 1 : 1);
          break;
        case "np":
          if (document.querySelector("#p" + (e = (p = parseInt(pn.value)) + 1))) {
            pn.oninput(pn.value = e);
            if (parseInt(pn.value) <= e) pn.oninput(pn.value = e + 2)
          }
          break;
        default:
          if (e.matches("#nav *")) {
            if (!e.href) e = e.parentNode;
            document.querySelector(e.hash).scrollIntoView();
            pages.scrollBy(0, -pages.children[0].offsetTop);
            ev.preventDefault(pn.value = e.page)
          }
      }
      onfocus()
    });
    onfocus = () => {
      if (!document.activeElement || (document.activeElement.id !== "pn")) pages.focus()
    };
    onload = () => setTimeout(() => pages.onscroll(onresize(pages.focus())), 0)
  </script>
</body>
</html>`.replace(/\$\(dltime\)/g, (new Date).toGMTString()
        ).replace(/\$\(gburl\)/g, location.href.match(/^[^#]+/)[0]
        ).replace(/\$\(title\)/,
          b = `${dd[1].title}${(si = document.querySelector('.gb-volume-title span')?.textContent?.trim()) ? ", " + si : ""
          }${dd[1].publisher ? ", " + dd[1].publisher : ""}, ${dd[1].volume_id}`
        ).replace(/\$\(title2\)/g, html(b)
        ).replace(/\$\(pagemax\)/, dd[0].page.length
        ).replace(/\$\[([^\]]+)\]/g, "${$1}"
        )], {type: "text/html"})).arrayBuffer().then(a => {
          tz.add("viewer.html", new Uint8Array(a));
          if (ou) URL.revokeObjectURL(ou);
          (ct = document.createElement("A")).href = ou = URL.createObjectURL(tz.generate());
          ct.download = `${b}.zip`;
          ct.style.display = "none";
          document.body.appendChild(ct).click();
          ct.remove();
          cl()
        })
      }
    }).catch(fer)
  }
  function nx(av) {
    try {
      if (!confirm(
`Book preview has ${dd[0].page.length} page(s).
Rough estimated download size is ${
  (() => {
    if (av >= 1024*1048576) {
      return parseFloat((av / 1024*1048576).toFixed(2)) + "GB"
    } else if (av >= 1048576) {
      return parseFloat((av / 1048576).toFixed(2)) + "MB"
    } else return parseFloat((av / 1024).toFixed(2)) + "KB"
  })()} based only from ${rl.length} already loaded page(s).
\nProceed with the download?`)) return;
      ic = document.createElement("DIV");
      dl = dd[0].page.length;
      rl = Math.ceil(dl / 4);
      pi = 0;
      pc = 0;
      dc = 0;
      tz = new tiny_zip;
      ns = [];
      document.body.style.pointerEvents = "none";
      dpp.textContent = `Retrieving pages (1/${dl})...`;
      document.documentElement.append(dp);
      dt = setInterval(() => (dpp.textContent = `Retrieving pages (${pc}/${dl})...`), 100);
      for (let ri = 0; ri < rl; ri++) {
        if (fe) break;
        let i = ri;
        dc++;
        fetch(`/books?id=${dd[1].volume_id}&pg=${dd[0].page[i * 4].pid}&jscmd=click3`).then(r => r.json()).then((j, d, k, x, y) => {
          dc--;
          if (fe) return;
          gi(j, i * 4, 0);
          z++;
          d = 1;
          if (i) { x = 2; y = 5
          } else { x = 1; y = 4 }
          while ((x < y) && (pi < dl)) {
            if ((k = i * 4 + d) >= dl) break;
            gi(j, k, x);
            d++;
            x++
          }
        }).catch(fer)
      }
      if (fe) cl()
    } catch(z) {
      alert(em, cl())
    }
  }
  em = "Failed to retrieve data due to site changes.";
  if (dd = document.querySelector(".gback+script")) try {
    (dp = document.createElement("DIV")).id = "gbpdujs";
    dp.innerHTML = `<style>
#gbpdujs{all:revert;position:fixed;z-index:999;left:0;top:0;right:0;bottom:0;background:#0007}
#gbpdujspop{
  position:absolute;left:50%;top:50%;transform:translate(-50%);
  border:.2em solid #00b;border-radius:.5em;padding:.5em 1em;background:#fff;font-family:sans-serif;
}
</style><div id="gbpdujspop"></div>`;
    dpp = dp.lastChild;
    dd = JSON.parse("[" + dd.text.match(/_OC_Run\((.*)\);/)[1] + "]");
    if (!(ic = document.querySelector(".menu_content p"))) throw 0;
    ic.insertAdjacentHTML("afterend", '<p><a href="javascript:void(0)" class="gb-left-nav-link"><span>Download preview pages</span></a></p>');
    ic.nextElementSibling.onclick = function() {
      this.style.pointerEvents = "none";
      if (!(rl = Array.from(viewport.querySelectorAll('img[src*="/books/content"]')).splice(0, 3)).length) return alert(em);
      dl = 0;
      (function gii(this_, i) {
        fetch(rl[i].src, {method: "HEAD"}).then(r => {
          dl += parseInt(r.headers.get("content-length"));
          if (++i < rl.length) {
            gii(this_, i)
          } else {
            this_.style.pointerEvents = "";
            nx(dl / rl.length * dd[0].page.length)
          }
        }).catch(e => {
          this_.style.pointerEvents = "";
          fer(e)
        })
      })(this, 0)
    }
  } catch(z) {
    alert(em)
  }
})()
