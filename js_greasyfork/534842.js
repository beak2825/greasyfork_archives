// ==UserScript==
// @name         Sketchfab Model Downloader
// @version      1.3
// @description  Download Sketchfab models
// @author       ncikkis
// @include      /^https?:\/\/(www\.)?sketchfab\.com\/.*/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.0.2/jszip-utils.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1465318
// @downloadURL https://update.greasyfork.org/scripts/534842/Sketchfab%20Model%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/534842/Sketchfab%20Model%20Downloader.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const window = unsafeWindow;
  if (typeof saveAs === 'function') window.saveAs = saveAs;

  const rDrawGeom    = /(this\._stateCache\.drawGeometry\(this\._graphicContext,t\))/g;
  const rDrawArrays  = /t\.drawArrays\(t\.TRIANGLES,0,6\)/g;
  const rRend1       = /A\.renderInto\(n,E,R/g;
  const rRend2       = /g\.renderInto=function\(e,i,r/g;
  const rGetResImg   = /getResourceImage:function\(e,t\){/g;

  let zip, folder, objects, cache, buttonInjected;
  window.allmodel = [];

  function reset() {
    zip = new JSZip();
    folder = zip.folder('collection');
    objects = {};
    cache = {};
  }

  function tryInsertButton(){
    const titleSpan = document.querySelector('span.model-name__label');
    if (titleSpan && !buttonInjected) {
      const btn = document.createElement('button');
      btn.textContent = 'Download this model';
      btn.style.cssText = [
        'background:#e74c3c',
        'color:#fff',
        'padding:10px 20px',
        'border:none',
        'border-radius:8px',
        'font-size:16px',
        'cursor:pointer',
        'margin-bottom:8px',
        'display:block'
      ].join(';');
      btn.addEventListener('click', downloadAll);
      titleSpan.parentNode.insertBefore(btn, titleSpan);
      buttonInjected = true;
    } else if (!buttonInjected) {
      setTimeout(tryInsertButton, 3000);
    }
  }

  function parseMesh(o){
    const prim = [];
    o._primitives.forEach(p => {
      if (p && p.indices) prim.push({ mode: p.mode, indices: p.indices._elements });
    });
    const A = o._attributes;
    const uvKey = ['TexCoord0','TexCoord1','TexCoord2','TexCoord3','TexCoord4','TexCoord5','TexCoord6','TexCoord7','TexCoord8']
      .find(k => A[k]);
    return {
      vertex:     A.Vertex._elements,
      normal:     A.Normal ? A.Normal._elements : [],
      uv:         uvKey ? A[uvKey]._elements : [],
      primitives: prim
    };
  }

  function saveMesh(m){
    let s = `mtllib ${m.name}.mtl\no ${m.name}\n`;
    m.obj.vertex.forEach((v,i) => { if(i%3===0) s += `v ${v} ${m.obj.vertex[i+1]} ${m.obj.vertex[i+2]}\n`; });
    m.obj.normal.forEach((v,i) => { if(i%3===0) s += `vn ${v} ${m.obj.normal[i+1]} ${m.obj.normal[i+2]}\n`; });
    m.obj.uv.forEach((v,i) => { if(i%2===0) s += `vt ${v} ${m.obj.uv[i+1]}\n`; });
    s += 's on\n';
    const hasVT = m.obj.uv.length > 0, hasVN = m.obj.normal.length > 0;
    m.obj.primitives.forEach(p => {
      if (p.mode === 4 || p.mode === 5) {
        const strip = p.mode === 5;
        for (let j = 0; j + 2 < p.indices.length; strip ? j++ : j += 3) {
          s += 'f ';
          let order = [0,1,2];
          if (strip && (j % 2)) order = [0,2,1];
          order.forEach(o => {
            const idx = p.indices[j+o] + 1;
            s += idx;
            if (hasVT || hasVN) {
              s += '/';
              if (hasVT) s += idx;
              if (hasVN) s += `/${idx}`;
            }
            s += ' ';
          });
          s += '\n';
        }
      }
    });
    objects[`${m.name}.obj`] = new Blob([s], { type: 'text/plain' });
  }

  function packageAll(){
    Object.keys(objects).forEach(fn => folder.file(fn, objects[fn], { binary: true }));
    const title = document.querySelector('span.model-name__label')?.textContent.trim() || 'sketchfab';
    zip.generateAsync({ type: 'blob' }).then(b => saveAs(b, `${title}.zip`));
  }

  function downloadAll(){
    reset();
    window.allmodel.forEach((o,i) => saveMesh({ name: `model_${i}`, obj: parseMesh(o) }));
    packageAll();
  }

  window.attachbody = o => {
    if (!o._faked && (o._name || (o.stateset && o.stateset._name))) {
      o._faked = true;
      if (o._name !== "composer layer" && o._name !== "Ground - Geometry") {
        window.allmodel.push(o);
      }
    }
  };

  window.drawhookcanvas = (e, mod) => {
    if (!mod) return e;
    let best = { size: 0 }, url = e.url;
    mod.attributes.images.forEach(img => {
      const ok = e.options.format === 'A' ? img.options.format === 'A' : true;
      if (ok && img.size > best.size) { best = img; url = img.url; }
    });
    if (!cache[url]) cache[url] = { name: mod.attributes.name };
    return best;
  };

  window.drawhookimg = (gl, t) => {
    const url = t[5].currentSrc;
    if (!cache[url]) return;
    const w = t[5].width, h = t[5].height;
    const px = new Uint8Array(w*h*4);
    gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,px);
    const row = w*4;
    for (let y = 0; y < h/2; y++) {
      const top = y*row, bot = (h-y-1)*row;
      const tmp = px.slice(top, top+row);
      px.copyWithin(top, bot, bot+row);
      px.set(tmp, bot);
    }
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const cx = c.getContext('2d'), id = cx.createImageData(w,h);
    id.data.set(px); cx.putImageData(id, 0, 0);
    const bn = cache[url].name.replace(/\.[^.]+$/, '');
    c.toBlob(b => { objects[`${bn}.png`] = b; }, 'image/png');
  };

  ;(function(){
    class E{ constructor(s){ this.script=s; this._cancel=false; } preventDefault(){ this._cancel=true; } }
    const cbs = [];
    window.addBeforeScriptExecuteListener = f => { if (typeof f !== 'function') throw ''; cbs.push(f); };
    const disp = n => { if (n.tagName === 'SCRIPT') { const ev = new E(n); cbs.forEach(f => f(ev)); if (ev._cancel) n.remove(); } };
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(disp)))
      .observe(document, { childList: true, subtree: true });
  })();

  window.onbeforescriptexecute = e => {
    const s = e.script?.src || '';
    if (!/web\/dist\/|standaloneViewer/.test(s)) return;
    e.preventDefault();
    const r = new XMLHttpRequest(); r.open('GET', s, false); r.send();
    let t = r.responseText;
    t = t.replace(rRend1, "$& ,i")
         .replace(rRend2, "$& ,image_data")
         .replace(rDrawArrays, "$& ,window.drawhookimg(t,image_data)")
         .replace(rGetResImg, "$& e=window.drawhookcanvas(e,this._imageModel);")
         .replace(rDrawGeom, (m, g) => g + ";window.attachbody(t);");
    const s2 = document.createElement('script');
    s2.text = t;
    document.head.appendChild(s2);
    setTimeout(tryInsertButton, 3000);
  };
})();