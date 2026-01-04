// ==UserScript==
// @name         NovemaSpider
// @namespace    https://novema.jp/
// @version      0.1
// @description  Manga spider for novema.jp
// @author       DD1969
// @match        https://novema.jp/comic/serial/*/*/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444420/NovemaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/444420/NovemaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  // seedrandom library
  !function(f,a,c){var s,l=256,p="random",d=c.pow(l,6),g=c.pow(2,52),y=2*g,h=l-1;function n(n,t,r){function e(){for(var n=u.g(6),t=d,r=0;n<g;)n=(n+r)*l,t*=l,r=u.g(1);for(;y<=n;)n/=2,t/=2,r>>>=1;return(n+r)/t}var o=[],i=j(function n(t,r){var e,o=[],i=typeof t;if(r&&"object"==i)for(e in t)try{o.push(n(t[e],r-1))}catch(n){}return o.length?o:"string"==i?t:t+"\0"}((t=1==t?{entropy:!0}:t||{}).entropy?[n,S(a)]:null==n?function(){try{var n;return s&&(n=s.randomBytes)?n=n(l):(n=new Uint8Array(l),(f.crypto||f.msCrypto).getRandomValues(n)),S(n)}catch(n){var t=f.navigator,r=t&&t.plugins;return[+new Date,f,r,f.screen,S(a)]}}():n,3),o),u=new m(o);return e.int32=function(){return 0|u.g(4)},e.quick=function(){return u.g(4)/4294967296},e.double=e,j(S(u.S),a),(t.pass||r||function(n,t,r,e){return e&&(e.S&&v(e,u),n.state=function(){return v(u,{})}),r?(c[p]=n,t):n})(e,i,"global"in t?t.global:this==c,t.state)}function m(n){var t,r=n.length,u=this,e=0,o=u.i=u.j=0,i=u.S=[];for(r||(n=[r++]);e<l;)i[e]=e++;for(e=0;e<l;e++)i[e]=i[o=h&o+n[e%r]+(t=i[e])],i[o]=t;(u.g=function(n){for(var t,r=0,e=u.i,o=u.j,i=u.S;n--;)t=i[e=h&e+1],r=r*l+i[h&(i[e]=i[o=h&o+t])+(i[o]=t)];return u.i=e,u.j=o,r})(l)}function v(n,t){return t.i=n.i,t.j=n.j,t.S=n.S.slice(),t}function j(n,t){for(var r,e=n+"",o=0;o<e.length;)t[h&o]=h&(r^=19*t[h&o])+e.charCodeAt(o++);return S(t)}function S(n){return String.fromCharCode.apply(0,n)}if(j(c.random(),a),"object"==typeof module&&module.exports){module.exports=n;try{s=require("crypto")}catch(n){}}else"function"==typeof define&&define.amd?define(function(){return n}):c["seed"+p]=n}("undefined"!=typeof self?self:this,[],Math);
  const seedrandom = Math.seedrandom;

  start();

  async function start() {
    // get image data
    const serialNumber = window.location.href.match(/serial\/n(\d*)\/n(\d*)/)[1];
    const chapterNumber = window.location.href.match(/serial\/n(\d*)\/n(\d*)/)[2];
    const jsonURL = `https://novema.jp/img/serial-comic/${serialNumber}/${chapterNumber}/content/index.json`;
    const imageData = await axios.get(jsonURL).then(res => res.data.map(item => ({ url: `https://novema.jp/img/serial-comic/${serialNumber}/${chapterNumber}/content/${item.name}`, seed: item.seed })));

    // get title
    const title = `novama-n${serialNumber}-n${chapterNumber}`;

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 40px; left: 40px; z-index: 9999999; width: 120px; height: 36px; line-height: 36px; cursor: pointer; background-color: #eee; border: 1px solid #888; border-radius: 4px;';
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      download(imageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function getUnscrambleImageBase64(data) {
    return new Promise(async resolve => {
      const t = 480;
      const n = data.seed;
      const e = new Image;

      e.onload = function () {
        var r = Math.ceil(e.width / t) * Math.ceil(e.height / t)
        , s = [];
        for (let p = 0; p < r; p++) {
          s.push(p);
        }

        var a = document.createElement("canvas")
        , o = a.getContext("2d");
        a.width = e.width;
        a.height = e.height;

        var l = Math.ceil(e.width / t)
        , c = (e.height,
               function(e) {
          var t = {};
          return t.slices = e.length,
            t.cols = function(e) {
            if (1 == e.length)
              return 1;
            for (var t = "init", n = 0; n < e.length; n++)
              if ("init" == t && (t = e[n].y),
                  t != e[n].y)
                return n;
            return n
          }(e),
            t.rows = e.length / t.cols,
            t.width = e[0].width * t.cols,
            t.height = e[0].height * t.rows,
            t.x = e[0].x,
            t.y = e[0].y,
            t
        }
              )
        , d = function() {
          var n, i = {};
          for (n = 0; n < r; n++) {
            var s = {}
            , a = parseInt(n / l)
            , o = n - a * l;
            s.x = o * t,
              s.y = a * t,
              s.width = t - (s.x + t <= e.width ? 0 : s.x + t - e.width),
              s.height = t - (s.y + t <= e.height ? 0 : s.y + t - e.height),
              i[s.width + "-" + s.height] || (i[s.width + "-" + s.height] = []),
              i[s.width + "-" + s.height].push(s)
          }
          return i
        }();

        function rfunc(e, t, n) {
          return Math.floor(e() * (n - t + 1)) + t
        }

        function shuffle(e, t) {
          for (var s = e.length, a = seedrandom(t), o = [], l = [], c = 0; c < s; c++)
            l.push(c);

          for (c = 0; c < s; c++) {
            var d = rfunc(a, 0, l.length - 1)
            , u = l[d];
            l.splice(d, 1),
              o.push(e[u])
          }
          return o
        }

        for (var u in d) {
          var p, h = c(d[u]), f = [];
          for (p = 0; p < d[u].length; p++)
            f.push(p);

          f = shuffle(f, n);
          for (p = 0; p < d[u].length; p++) {
            var m = f[p]
            , v = parseInt(m / h.cols)
            , g = (m - v * h.cols) * d[u][p].width
            , w = v * d[u][p].height;
            o.drawImage(e, h.x + g, h.y + w, d[u][p].width, d[u][p].height, d[u][p].x, d[u][p].y, d[u][p].width, d[u][p].height)
          }
        }

        resolve(a.toDataURL().replace('data:image/png;base64,', ''));
      }

      e.src = data.url;
    });
  }

  async function download(imageData, title, dlBtn) {
    const promises = [];
    imageData.forEach(data => promises.push(getUnscrambleImageBase64(data)));
    const images = await Promise.all(promises);

    const zip = new JSZip();
    const folder = zip.folder(title);
    images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpg`, image, { base64: true }));

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${title}.zip`);
      dlBtn.innerText = "Completed";
    });
  }

})(axios, JSZip, saveAs);