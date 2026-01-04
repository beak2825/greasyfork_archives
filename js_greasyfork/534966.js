// ==UserScript==
// @name         NovelAI Inpainting Tools
// @version      0.8.2
// @description  Adds a number of tools, including an import mask button, export mask button, invert mask button, and layers.
// @author       IAintTellinYouNothin
// @match        https://novelai.net/*
// @run-at       document-idle
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1465742
// @downloadURL https://update.greasyfork.org/scripts/534966/NovelAI%20Inpainting%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/534966/NovelAI%20Inpainting%20Tools.meta.js
// ==/UserScript==
(() => {
    'use strict';
    // Constants
    let cachedCtl = null;
    // Track last pasted or dropped image
    let lastImg = null;
    window.addEventListener('paste', e => {
      for (const item of e.clipboardData?.items || []) {
        if (!item.type.startsWith('image/')) continue;
        const img = new Image();
        img.onload = () => {lastImg = img};
        img.src = URL.createObjectURL(item.getAsFile());
        break;
      }
    });
    //** Helper Functions **//
    function querySelectorIncludesText (selector, text){
        return Array.from(document.querySelectorAll(selector))
        .find(el => el.textContent.includes(text));
    }
    // Canvas Controller
    const getCanvasController = () => {
        if (cachedCtl?.displayCanvas?.isConnected) return cachedCtl;
        cachedCtl = findCanvasControllerRaw();
        return cachedCtl;
      };
    // Wait For Function
    function waitFor(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
          const interval = 200;
          let elapsed = 0;
          const handle = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
              clearInterval(handle);
              resolve(el);
            } else if ((elapsed += interval) >= timeout) {
              clearInterval(handle);
              reject(`Timed out waiting for ${selector}`);
            }
          }, interval);
        });
      }

    // Drag and drop listeners
    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (!file?.type.startsWith('image/')) return;
      const img = new Image();
      img.onload = () => {lastImg = img};
      img.src = URL.createObjectURL(file);
    });

    // Hidden file input for manual uploads
    const fileInput = Object.assign(document.createElement('input'), {
      type: 'file',
      accept: 'image/png,image/jpeg',
      style: 'display:none'
    });
    fileInput.onchange = () => {
      if (!fileInput.files.length) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => applyMask(img);
        img.src = ev.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
      fileInput.value = '';
    };
    document.body.appendChild(fileInput);

    // Check if element is visible
    const isVisible = el => {
      if (!el) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || +style.opacity === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    };

    // Find the React canvas controller
    const findCanvasControllerRaw = () => {
        const disp = document.getElementById('canvas');
        if (!disp) return null;
        const key = Object.keys(disp).find(k => k.startsWith('__reactFiber$'));
        if (!key) return null;
        const queue = [disp[key]];
        const seen = new Set();
        while (queue.length) {
          const f = queue.shift();
          if (!f || seen.has(f)) continue;
          seen.add(f);
          for (let h = f.memoizedState; h; h = h.next) {
            const ref = h.memoizedState;
            if (ref?.current?.addLayer && Array.isArray(ref.current.layers)) return ref.current;
          }
          queue.push(f.child, f.sibling, f.return);
        }
        return null;
      };

    // Import mask image onto current layer (white = mask)
    const applyMask = img => {
      const disp = document.getElementById('canvas');
      if (!disp) return;
      const ctl = findCanvasControllerRaw();
      if (!ctl) return;
      const { canvas } = ctl.currentLayer;
      const { width, height } = canvas;

      const ctx = canvas.getContext('2d');
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');

      // Scale input to mask layer resolution
      const scale = (width / disp.width !== 1/8) ? 1/8 : 1;
      octx.drawImage(img, 0, 0, disp.width, disp.height, 0, 0, width * scale, height * scale);

      const data = octx.getImageData(0, 0, width * scale, height * scale).data;
      for (let i = 0; i < data.length; i += 4) {
        const [r,g,b] = [data[i], data[i+1], data[i+2]];
        if (r > 250 && g > 250 && b > 250) {
          data[i+3] = 255;
        } else {
          data[i+3] = 0;
        }
      }

      ctx.clearRect(0, 0, width * scale, height * scale);
      ctx.putImageData(new ImageData(data, width * scale, height * scale), 0, 0);
      ctl.saveState?.();
      ctl.toolState?.changeToReload?.(true);
    };

    // Invert current mask layer
    const invertCurrentMask = () => {
      const disp = document.getElementById('canvas');
      if (!disp) return;
      const ctl = findCanvasControllerRaw();
      if (!ctl) return;
      const { canvas } = ctl.currentLayer;
      const ctx = canvas.getContext('2d');
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        img.data[i+3] = img.data[i+3] > 0 ? 0 : 255;
        if (img.data[i+3] === 255) {
          img.data[i] = img.data[i+1] = img.data[i+2] = 255;
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(img, 0, 0);
      ctl.saveState?.();
      ctl.toolState?.changeToReload?.(true);
    };

    // Export mask as PNG
    const exportMask = () => {
      const disp = document.getElementById('canvas');
      if (!disp) return;
      const ctl = findCanvasControllerRaw();
      if (!ctl) return;
      const src = ctl.currentLayer.canvas;
      const buf = document.createElement('canvas');
      buf.width = src.width;
      buf.height = src.height;
      const bctx = buf.getContext('2d');
      bctx.drawImage(src, 0, 0);

      // Clip zoom region if active
      if (ctl.toolState.maskZoomRegion && ctl.mode === 1) {
        const { from, to } = ctl.toolState.maskZoomRegion;
        const pad = ctl.toolState.safeAreaSize / (ctl.currentLayer.scaleFactor || 1);
        const clip = {
          x: Math.min(from.x,to.x)+pad,
          y: Math.min(from.y,to.y)+pad,
          width: Math.abs(to.x-from.x)-2*pad,
          height: Math.abs(to.y-from.y)-2*pad
        };
        if (clip.width>0 && clip.height>0) {
          bctx.globalCompositeOperation = 'destination-in';
          bctx.fillStyle = '#000';
          bctx.fillRect(clip.x, clip.y, clip.width, clip.height);
          bctx.globalCompositeOperation = 'source-over';
        } else {
          bctx.clearRect(0,0,buf.width,buf.height);
        }
      }

      // Upscale if needed
      const scaleUp = (src.width/disp.width === 1/8) ? 8 : 1;
      const out = document.createElement('canvas');
      out.width = src.width * scaleUp;
      out.height = src.height * scaleUp;
      const octx = out.getContext('2d');
      octx.imageSmoothingEnabled = false;
      octx.drawImage(buf, 0, 0, out.width, out.height);

      const a = document.createElement('a');
      a.download = 'mask.png';
      a.href = out.toDataURL('image/png');
      a.click();
    };

    // Add UI
    // Build layer UI row
    const createRow = () => {
        const saveBtn = document.querySelector('button.sc-4f026a5f-0.sc-4f026a5f-1.sc-4f026a5f-5');
        const wrap = saveBtn?.closest('div[style*="flex-wrap: wrap-reverse"]');
        if (!wrap) return null;
        const row = document.createElement('div');
        row.id = 'nai-layer-ui-row';
        Object.assign(row.style, {
          display: 'flex', alignItems: 'center',
          gap: '10px', width: '100%',
          marginTop: '10px', flexWrap: 'wrap'
        });
        wrap.parentNode.insertBefore(row, wrap.nextSibling);
        return row;
    };

    const cloneButton = (label, id) => {
        const proto = document.querySelector('button.sc-4f026a5f-2.iaNkyw') ||
                      document.querySelector('button.sc-4f026a5f-2');
        const btn = proto ? proto.cloneNode(true) : document.createElement('button');
        btn.id = id;
        btn.querySelector('div')?.remove();
        btn.textContent = label;
        Object.assign(btn.style, { position: 'static', margin: '0 4px' });
        return btn;
    };

    const makeDeleteBtn = cb => {
        let b = document.createElement('button');
        let trashIcon = document.createElement('svg');
        Object.assign(trashIcon.style, {
          width: '16px', height: '16px',
          top: '0', bottom: '0', right: '0', left: '0',
          position: 'absolute', margin: 'auto',
          background: 'rgb(255,255,255)',
          'mask-image': 'url(/_next/static/media/trash.72ef2ba9.svg)'
        });
        b.className = 'sc-4f026a5f-2 iaNkyw';
        b.onclick = cb;
        Object.assign(b.style, {
          position: 'absolute', top: '0.25em', right: '0.25em',
          width: '16px', height: '16px',
          padding: 0, lineHeight: 0,
          background: 'rgba(1,1,1,0.6)',
        });
        b.appendChild(trashIcon)
        return b;
    };

    // Render layer thumbnails
    const renderThumbnails = () => {
        const ctl = getCanvasController();
        const strip = document.getElementById('nai-layer-strip');
        if (!ctl || !strip) return;

        const previewW = 60;
        const layers = ctl.layers;

        // 1) Make sure strip has exactly one holder per layer
        //    Add new holders if layers grew, or remove extras if they shrank
        while (strip.children.length < layers.length) {
          const holder = document.createElement('div');
          holder.className = 'strip-holder';
          strip.appendChild(holder);
        }
        while (strip.children.length > layers.length) {
          strip.removeChild(strip.lastChild);
        }

        // 2) Update each holder/button in-place
        layers.forEach((layer, idx) => {
          const holder = strip.children[idx];
          // size the holder
          const h = Math.round(previewW * layer.canvas.height / layer.canvas.width);
          Object.assign(holder.style, {
            width:  `${previewW}px`,
            height: `${h}px`,
            position: 'relative',
            flex:     '0 0 auto',
          });

          // find or create the thumbnail button
          let btn = holder.querySelector('button');
          if (!btn) {
            btn = document.createElement('button');
            holder.appendChild(btn);
          }

          // apply classes & size
          btn.className = 'sc-4f026a5f-2 iaNkyw' + (idx === ctl.selectedLayer ? ' selected' : '');
          Object.assign(btn.style, {
            width:  `${previewW}px`,
            height: `${h}px`,
            padding: 0,
            border: idx === ctl.selectedLayer
              ? '3px solid var(--textMain,#fff)'
              : '3px solid var(--bg2,#3a3a3a)',
          });

          // redraw the thumbnail into a tiny offscreen canvas
          try {
            const c = document.createElement('canvas');
            c.width = previewW;
            c.height = h;
            const tx = c.getContext('2d');
            tx.imageSmoothingEnabled = true;
            tx.drawImage(
              layer.canvas,
              0, 0, layer.canvas.width, layer.canvas.height,
              0, 0, previewW, h
            );
            btn.style.backgroundImage = `url(${c.toDataURL()})`;
            btn.style.backgroundSize = 'cover';
            btn.style.backgroundPosition = 'center';
          } catch (e) {
            // drawing failed; just leave existing background
          }

          // update click handler
          btn.onclick = () => {
            ctl.switchLayer(idx);
            renderThumbnails();
          };

          // handle delete‐button
          let del = holder.querySelector('.delete-layer-btn');
          if (ctl.layers.length > 1) {
            if (!del) {
              del = makeDeleteBtn(ev => {
                ev.stopPropagation();
                ctl.removeLayer(idx, true);
                ctl.switchLayer(Math.min(idx, ctl.layers.length - 1));
                renderThumbnails();
              });
              del.classList.add('delete-layer-btn');
              holder.appendChild(del);
            }
          } else if (del) {
            // no longer needed
            holder.removeChild(del);
          }
        });
    };
    // Render Toolbar
    const refreshToolbar = () => {
        ['#nai-mask-import-btn', '#nai-mask-export-btn', '#nai-invert-btn'].forEach(sel => {
        document.querySelectorAll(sel).forEach(btn => {
            const wrap = btn.closest('.image-gen-canvas');
            if (!wrap || !isVisible(wrap)) btn.remove();
        });
        });
        document.querySelectorAll('.image-gen-canvas').forEach(container => {
        if (!isVisible(container)) return;
        const tpl = querySelectorIncludesText('span', 'Draw Mask').parentNode
        if (document.querySelector('#nai-mask-import-btn')) return;
        const makeBtn = (id, text, cb) => {
            const btn = tpl.cloneNode(true);
            btn.id = id;
            btn.style.cursor = 'pointer';
            btn.querySelector('div')?.replaceChildren();
            btn.querySelector('span').textContent = text;
            btn.addEventListener('click', cb);
            return btn;
        };
        const importBtn = makeBtn('nai-mask-import-btn','Mask Import',() => {
            const img = lastImg; lastImg = null;
            img ? applyMask(img) : fileInput.click();
        });
        const exportBtn = makeBtn('nai-mask-export-btn','Mask Export', exportMask);
        const invertBtn = makeBtn('nai-invert-btn','Invert Mask', invertCurrentMask);
        const bar = tpl.parentElement;
        const sep = Array.from(bar.childNodes).find(div => window.getComputedStyle(div).display !== 'flex');
        if (sep) sep.parentNode.insertBefore(importBtn, sep), sep.parentNode.insertBefore(exportBtn, sep), sep.parentNode.insertBefore(invertBtn, sep);
        else bar.append(importBtn, exportBtn, invertBtn);
        });
        const ctl = getCanvasController();
        if (!ctl || ctl.mode !== 1) return;
        let row = document.getElementById('nai-layer-ui-row');
        if (!row) row = createRow();
        if (!row || row.dataset.ready) return;

        row.style.position = 'relative';
        const newBtn = cloneButton('New Layer','nai-new-mask-layer');
        const toggleBtn = cloneButton('Toggle Layer','nai-toggle-mask-layer');
        row.append(newBtn, toggleBtn);

        const strip = document.createElement('div');
        strip.id = 'nai-layer-strip';
        Object.assign(strip.style, {
            position: 'absolute',
            top:'100%',
            left: '3',
            display: 'flex', alignItems: 'left',
            flexDirection: 'column',
            gap: '6px',
            padding: '0.2em 0.5em',
            zIndex: '999'
        });
        row.appendChild(strip);

        row.dataset.ready = '1';

        newBtn.onclick = () => {
            ctl.addLayer(true);
            const layer = ctl.currentLayer;
            layer.scaleFactor = 8;
            layer.canvas.width = ctl.displayCanvas.width / 8;
            layer.canvas.height = ctl.displayCanvas.height / 8;
            ctl.switchLayer(ctl.layers.length - 1);
            renderThumbnails();
        };

        toggleBtn.onclick = () => {
            const layer = ctl.layers[ctl.selectedLayer];
            layer.opacity = layer.opacity > 0 ? 0 : 0.5;
            ctl.toolState.changeToReload?.(true);
            renderThumbnails();
        };

        if (!window._naiLayerHotkeys) {
            window._naiLayerHotkeys = true;
            window.addEventListener('keydown', ev => {
            if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (!ctl || ctl.mode !== 1) return;
            if (ev.key === '[') {
                ctl.switchLayer((ctl.selectedLayer-1+ctl.layers.length)%ctl.layers.length);
                renderThumbnails();
            }
            if (ev.key === ']') {
                ctl.switchLayer((ctl.selectedLayer+1)%ctl.layers.length);
                renderThumbnails();
            }
            });
        renderThumbnails();
        }
    };
    waitFor('.image-gen-body').then(() => {
        const imageGenBody = document.querySelector('.image-gen-body')
        new MutationObserver(refreshToolbar).observe(imageGenBody, {childList: true, subtree: true, attributes: true});
        refreshToolbar();
    });
    setInterval(renderThumbnails, 100);


    // Add mask-upload button to preview modal
    const modalSelector = 'div[data-projection-id]';
    const addButton = modal => {
        if (modal.querySelector('#nai-mask-btn-modal')) return;
        const orig = querySelectorIncludesText('span', 'Image2Image').parentNode;
        if (!orig) return;
        const row = document.createElement('div');
        Object.assign(row.style, {
        display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', gap: '20px',
        width: '100%', marginTop: '20px'
        });
        orig.parentElement.after(row);

        const btn = orig.cloneNode(true);
        btn.id = 'nai-mask-btn-modal';
        btn.querySelector('div')?.replaceChildren();
        btn.querySelector('span').textContent = 'Mask Upload';
        btn.onclick = ev => {
        ev.preventDefault();
        const preview = modal.querySelector('div[style*="background-image"]');
        const bg = preview
            ? (preview.style.backgroundImage || getComputedStyle(preview).backgroundImage)
            : '';
        const m = bg.match(/url\(["']?(data:image\/[^"')]+)["']?\)/);
        if (m) {
            const img = new Image();
            img.onload = () => applyMask(img);
            img.src = m[1];
        } else if (lastImg) {
            applyMask(lastImg);
        } else {
            fileInput.click();
        }
        modal.querySelector('button.modal-close')?.click();
        };
        row.appendChild(btn);
    };
    new MutationObserver(muts => {
        muts.forEach(m => {
        m.addedNodes.forEach(n => {
            if (!(n instanceof Element)) return;
            if (n.matches(modalSelector)) addButton(n);
        });
        });
    }).observe(document.body, {childList: true, subtree: true});
  })();

  // Save and restore mask layers
  (() => {
    'use strict';
    const STORAGE_KEY = 'nai-mask-layers';

    const findCanvasController = () => {
      const disp = document.getElementById('canvas');
      if (!disp) return null;
      const key = Object.keys(disp).find(k => k.startsWith('__reactFiber$'));
      if (!key) return null;
      const queue = [disp[key]];
      const visited = new Set();
      while (queue.length) {
        const f = queue.shift();
        if (!f || visited.has(f)) continue;
        visited.add(f);
        for (let h = f.memoizedState; h; h = h.next) {
          const ref = h.memoizedState;
          if (ref?.current?.layers && ref.current.getImage) return ref.current;
        }
        queue.push(f.child, f.sibling, f.return);
      }
      return null;
    };

    const isMaskMode = ctl => ctl?.mode === 1;

    // Patch getImage to exclude hidden layers
    const patchGetImage = () => {
      const ctl = findCanvasController();
      if (!isMaskMode(ctl) || ctl._naiPatchedGetImage) return;
      ctl._naiPatchedGetImage = true;
      const orig = ctl.getImage.bind(ctl);
      ctl.getImage = function(...args) {
        const layers = this.layers;
        this.layers = layers.filter(l => l.opacity > 0);
        const result = orig(...args);
        this.layers = layers;
        return result;
      };
      console.log('[NAI helper] getImage() patched');
    };

    // Save all mask layers to localStorage
    const saveMaskLayers = () => {
      const ctl = findCanvasController();
      if (!isMaskMode(ctl)) return;
      const snapshot = ctl.layers.map(l => ({
        data: l.canvas.toDataURL('image/png'),
        opacity: l.opacity,
        scale: l.scaleFactor || 1
      }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        ctl._naiLayersRestored = false;
      } catch {
        console.warn('[NAI helper] could not save layers');
      }
    };

    // Load saved mask layers from localStorage
    const loadMaskLayers = async () => {
      const ctl = findCanvasController();
      if (!isMaskMode(ctl)) return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      let saved;
      try { saved = JSON.parse(raw); } catch { return; }

      // Remove existing extra layers
      for (let i = ctl.layers.length - 1; i >= 1; --i) {
        ctl.removeLayer(i, false);
      }
      for (let i = 0; i < saved.length; ++i) {
        const { data, opacity, scale } = saved[i];
        if (i > 0) {
          ctl.addLayer(true);
          ctl.switchLayer(ctl.layers.length - 1);
        }
        const layer = ctl.layers[i];
        if (scale !== 1) {
          layer.scaleFactor = scale;
          layer.canvas.width = ctl.displayCanvas.width / scale;
          layer.canvas.height = ctl.displayCanvas.height / scale;
        }
        layer.opacity = opacity;
        await new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            const ctx = layer.canvas.getContext('2d');
            ctx.clearRect(0,0,layer.canvas.width,layer.canvas.height);
            ctx.drawImage(img, 0,0,layer.canvas.width,layer.canvas.height);
            resolve();
          };
          img.src = data;
        });
      }
      ctl.switchLayer(0);
      ctl.toolState?.changeToReload?.(true);
    };

    // Hook the “Save & Close” button
    const hookSaveButton = () => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => /save\s*&\s*close/i.test(b.textContent));
      if (!btn || btn._naiPersistHook) return;
      btn._naiPersistHook = true;
      btn.addEventListener('click', saveMaskLayers, true);
    };

    const activatePersistence = () => {
      const ctl = findCanvasController();
      if (!isMaskMode(ctl) || ctl._naiLayersRestored) return;
      ctl._naiLayersRestored = true;
      patchGetImage();
      loadMaskLayers().then(() => {
        // reuse renderThumbnails from earlier scripts
        if (typeof renderThumbnails === 'function') renderThumbnails();
      });
      hookSaveButton();
    };

    const observer = new MutationObserver(activatePersistence);
    observer.observe(document.body, { childList: true, subtree: true });
    activatePersistence();
  })();