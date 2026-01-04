// ==UserScript==
// @name         MHTML Reader
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  Script to read MHTML files. Use the "Open MHTML file" menu of Tampermonkey/Violentmonkey/Greasemonkey popup menu. The menu can also be made as a bookmarklet using this URL: javascript:mhtreader_ujs()
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/391906/MHTML%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/391906/MHTML%20Reader.meta.js
// ==/UserScript==

((mht) => {
  function mhtReader() {
    var inp = document.createElement("INPUT");
    inp.type = "file";
    inp.onchange = function(ev) {
      var ps, ls = {}, pt, qp;
      function decodeQuotedPrintable(s) {
        return s.replace(/(?:=[0-9A-Fa-f]{2})+/g, s => decodeURIComponent(s.replace(/=/g, "%")));
      }
      function addPart() {
        if (!pt) return;
        if (qp) pt.body = decodeQuotedPrintable(pt.body);
        ls[pt.headers["Content-Location"]] = ps.length;
        ps.push(pt);
        pt = null;
      }
      function absUrl(u, m) {
        if (!(/^[a-z]+:/).test(u)) { //relative
          if ((/^\/\//).test(u)) { //domain
            u = mht.url.match(/^[a-z]+:/)[0] + u;
          } else if (u[0] === "/") { //root path
            u = mht.url.match(/^[a-z]+:\/\/[^\/]+/)[0] + u;
          } else { //relative path
            if (mht.url[mht.url.length - 1] === "/") {
              u = mht.url + u;
            } else u = mht.url + "/" + u;
          }
        } //else: absolute
        if ((/^[a-z]+:\/\/[^\/]+$/).test(u)) u += "/";
        return u;
      }
      function fixCss(t) {
        return t.replace(/\b(url\(["']?)((?!data:)[^"')]+)/g, (s, a, b, u) => {
          if (ls[u = absUrl(b)] !== undefined) {
            return "data:;base64," + ps[ls[u]].body;
          } else return s;
        });
      }
      function fixHtml(p, i, h, a) {
        if ((h = p.body.match(/^(?:(?:.*|\s*)<(?:!doctype|\?xml)\b[^>]+>)*/i)) && h[0]) {
          p.body = p.body.substr((h = h[0]).length);
        } else h = "";
        (m = document.createElement("DIV")).innerHTML = p.body.replace(/<(\/?html|\/?head|\/?body)\b([^>]*>)/gi, (s, a, b) => "<" + a + "Z" + b);
        if (a = m.querySelector("title")) {
          p.title = a.textContent;
        } else p.title = "";
        if (mht.mainPart < 0) {
          if (mht.content.headers.Subject && (p.title === mht.content.headers.Subject)) {
            mht.url = ps[mht.mainPart = i].headers["Content-Location"] = absUrl(p.headers["Content-Location"]);
          }
        }
        [ ["link[href]", "href"], ["[src]", "src"] ].forEach(
          a => m.querySelectorAll(a[0]).forEach((e, u, b, c) => {
            if ((b = ls[u = absUrl(e.getAttribute(a[1]))]) !== undefined) {
              c = (b = ps[b]).headers["Content-Type"].match(/^[^;]+/)[0];
              if (b.headers["Content-Transfer-Encoding"] === "base64") {
                e.setAttribute(a[1], "data:" + c + ";base64," + b.body);
              } else {
                e.setAttribute(a[1], "data:" + c + ";base64," + btoa(encodeURIComponent(b.body).replace(
                  /%([0-9A-F]{2})/g, (m, c) => String.fromCharCode('0x' + c)
                )));
              }
            }
          })
        );
        m.querySelectorAll("style").forEach(e => e.innerHTML = fixCss(e.innerHTML));
        m.querySelectorAll("[style]").forEach(e => e.style.cssText = fixCss(e.style.cssText));
        a = m.innerHTML;
        while (n = (/<\/(?:doctypez|xmlz)>$/i).exec(a)) {
          a = a.substr(0, n.index);
        }
        return h + a.replace(/<(\/?html|\/?head|\/?body)z\b([^>]*>)/gi, (s, a, b) => "<" + a + b);
      }
      if (inp.files.length) {
        mht = inp.files[0];
        mht = {
          name: mht.name, type: mht.type, size: mht.size, lastModified: mht.lastModified, text: "", mainPart: -1, url: "", content: {}
        };
        fr = new FileReader();
        fr.onload = function() {
          var dat = mht.content, txt = mht.text = fr.result, rl = /(.*?)\r?\n/g, rh = /(^[^\t ][^:]+):\s*(.*)/,
            rt = /^multipart\/related(?:;\s*?boundary="([^"]+)"|;\s*?[^;]+)+/, rc = /^text\/html(;\s*charset="utf-8")?/i,
            m, s, sp = " ", hs, hn, bd, ds, dn, b64;
          while (m = rl.exec(txt)) {
            s = m[1].replace(/\s+$/, "");
            if (s) { //non-blank line
              if (bd) {
                if (s === (bd + "--")) { //boundary terminator
                  addPart();
                  break;
                } else if (s === bd) { //boundary
                  addPart();
                  ds = (pt = {}).headers = {};
                  continue;
                }
              }
              if (pt) { //part
                if (pt.body !== undefined) { //body
                  if (qp) {
                    if (s[s.length - 1] === "=") {
                      pt.body += s.substr(0, s.length - 1);
                    } else pt.body += s + "\n";
                  } else pt.body += s + "\n";
                } else { //headers
                  if (m = s.match(rh)) {
                    if (s = m[2].match(/^"(.*)"$/)) m[2] = s[1];
                    ds[dn = m[1]] = m[2];
                  } else ds[dn] += " " + s.replace(/^\s+/, "");
                }
              } else if (dat.body !== undefined) { //body
                dat.body += s + "\n"; //body
              } else { //headers
                if (!dat.headers) {
                  if (s.substr(0, 6) !== "From: ") break;
                  hs = dat.headers = {};
                }
                if (m = s.match(rh)) {
                  if (s = m[2].match(/^"(.*)"$/)) m[2] = s[1];
                  hs[hn = m[1]] = m[2];
                } else hs[hn] += " " + s.replace(/^\s+/, "");
              }
            } else { //blank line
              if (pt) { //at/after part
                if (pt.body !== undefined) {
                  pt.body += "\n";
                } else {
                  if (ds["Content-Transfer-Encoding"]) {
                    qp = ds["Content-Transfer-Encoding"] === "quoted-printable";
                    b64 = ds["Content-Transfer-Encoding"] === "base64";
                  } else {
                    qp = false;
                    b64 = false;
                  }
                  pt.body = "";
                }
              } else if (dat.body !== undefined) { //at/after body
                dat.body += "\n";
              } else { //after headers
                if (hs["Content-Type"] && (m = hs["Content-Type"].match(rt))) {
                  bd = "--" + m[1];
                  ps = dat.parts = [];
                }
                dat.body = "";
              }
            }
            sp = s;
          }
          if (pt && pt.body && b64) pt.body = pt.body.replace(/\r?\n/g, "");
          if (mht.content.headers["Content-Transfer-Encoding"] === "quoted-printable") {
            mht.content.body = decodeQuotedPrintable(mht.content.body.replace(/=\r?\n/g, ""));
          }
          if (dat.body) {
            addPart();
            if (mht.content.parts) {
              mht.content.parts.forEach((p, i) => {
                switch (
                  p.headers["Content-Type"].match(/^[^;]+/)[0].toLowerCase()
                ) {
                  case "text/html":
                    p.body = fixHtml(p, i);
                    break;
                  case "text/css":
                    p.body = fixCss(p.body);
                }
              });
              if (mht.mainPart < 0) {
                mht.mainPart = mht.content.parts.findIndex((p, i) => (/^text\/html(;|$)/).test(p.headers["Content-Type"]));
              }
              if (mht.mainPart >= 0) {
                s = new Blob([mht.content.parts[mht.mainPart].body], {type: "text/html"});
              } else {
                s = new Blob([mht.content.body], {type: mht.content.headers["Content-Type"].match(/^[^;]+/)[0]});
              }
            } else {
              s = new Blob([mht.content.body], {type: mht.content.headers["Content-Type"].match(/^[^;]+/)[0]});
            }
            (s = open(m = URL.createObjectURL(s))).addEventListener("load", (e, t) => {
              function addRow(n, v, r, a) {
                (r = t.insertRow()).insertCell().textContent = n;
                if (n === "Content-Location") {
                  (a = r.insertCell().appendChild(document.createElement("A"))).textContent = v;
                  a.href = v;
                } else r.insertCell().textContent = v;
              }
              function comma(n, i, f, s) {
                n = n.toString();
                s = [];
                if ((i = n.lastIndexOf(".")) > 0) {
                  f = n.substr(i);
                  n = n.substr(0, i);
                } else f = "";
                i = n.length - 3;
                while (i >= 0) {
                  s.unshift(n.substr(i, 3));
                  i -= 3;
                }
                if ((i > -3) && (i < 0)) s.unshift(n.substr(0, i + 3));
                return s.join(",") + f;
              }
              function fmtSize(n) {
                var us = [" Bytes", " KB", " MB"], u = 0, i;
                if (n > 9999) {
                  while (true) {
                    i = Math.floor(n);
                    if ((i > 999) && (u < 2)) {
                      n = n /1024;
                      u++;
                    } else if (i > 99) {
                      if (u) {
                        return comma(n.toFixed(0)) + us[u];
                      } else return comma(n) + us[u];
                    } else if (i > 9) {
                      if (u) {
                        return parseFloat(n.toFixed(1)) + us[u];
                      } else return n + us[u];
                    } else if (u) {
                      return parseFloat(n.toFixed(2)) + us[u];
                    } else return n + us[u];
                  }
                } else return comma(n) + us[u];
              }
              (e = document.createElement("DIV")).id = "mhtReaderInfo";
              e.innerHTML = `
<style>
html{overflow:hidden}
#mhtReaderInfo,#mhtReaderInfo *{
  visibility:visible;opacity:1;position:static;float:none;margin:0;border:none;border-radius:0;padding:0;width:auto;height:auto;overflow:auto;background:none;
  text-align:left;text-indent:0;color:#000;font:normal normal normal 12pt/12pt sans-serif;cursor:auto;
}
#mhtReaderInfo{display:flex;position:fixed;z-index:999999999;left:0;top:0;right:0;bottom:0;background:rgb(0,0,0,0.5);cursor:pointer}
#mhtReaderInfo .box{margin:auto;border:.3rem solid #007;border-radius:.3rem;background:#fff}
#mhtReaderInfo .title{position:relative;padding:.1rem 0;background:#77d;color:#fff;font-weight:bold;text-indent:.4rem}
#mhtReaderInfo .close{
  position:absolute;top:.1rem;right:.1rem;width:1.4rem;background:#b00;
  text-align:center;color:#fff;font-size:9pt;font-weight:bold;cursor:pointer;
}
#mhtReaderInfo .content{margin:.4rem .5rem;max-width:60rem}
#mhtReaderInfo td{padding:.2rem 0}
#mhtReaderInfo td:first-child{vertical-align:top;white-space:nowrap}
#mhtReaderInfo td:last-child{padding-left:1rem}
#mhtReaderInfo a{cursor:pointer;color:#00b}
#mhtReaderInfo a:visited{color:#b0b}
</style>
<div class="box">
  <div class="title">Document Information - MHTML Reader<span class="close">X</span></div>
  <table class="content"></table>
</div>`;
              t = e.querySelector(".content");
              addRow("File Name", mht.name);
              addRow("File Type", mht.type);
              addRow("File Last Modified", new Date(mht.lastModified));
              addRow("File Size", fmtSize(mht.size));
              Object.keys(mht.content.headers).forEach(k => addRow(k, mht.content.headers[k]));
              e.addEventListener("click", ev => {
                if ((ev.target.id === "mhtReaderInfo") || (ev.target.className === "close")) e.remove();
              })
              s.document.documentElement.appendChild(e);
              if (s.document.activeElement) s.document.activeElement.blur();
            });
            sp = setInterval(() => {
              if (s.closed) {
                URL.revokeObjectURL(m);
                clearInterval(sp);
              }
            }, 1000);
          } else alert("Invalid MHTML file.");
        };
        fr.readAsText(inp.files[0]);
      } else alert("Please select a file.");
      ev.preventDefault();
    }
    inp.click();
  }
  GM_registerMenuCommand("Open MHTML file", unsafeWindow.mhtreader_ujs = mhtReader.bind(unsafeWindow));
})();
