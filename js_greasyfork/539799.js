// ==UserScript==
// @name         Yanmaga Manga Capture & ZIP (v2025 actualizado visible fix)
// @namespace    yanmaga-capture
// @version      2.5
// @description  Captura páginas completas de manga en yanmaga.jp, las muestra en una galería y permite descargar en ZIP.
// @author       ChatGPT
// @match        https://yanmaga.jp/viewer/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.0/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539799/Yanmaga%20Manga%20Capture%20%20ZIP%20%28v2025%20actualizado%20visible%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539799/Yanmaga%20Manga%20Capture%20%20ZIP%20%28v2025%20actualizado%20visible%20fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const capturedImages = [];

    function createFloatingUI() {
        const container = document.createElement('div');
        container.id = 'yanmaga-capture-ui';
        container.style = 'position: fixed; top: 10px; right: 10px; z-index: 999999; display: flex; flex-direction: column; gap: 5px;';

        const captureBtn = document.createElement('button');
        captureBtn.textContent = '📸 Capturar';
        const zipBtn = document.createElement('button');
        zipBtn.textContent = '⬇️ Descargar ZIP';
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️ Limpiar';

        [captureBtn, zipBtn, clearBtn].forEach(btn => {
            btn.style = 'padding: 6px 10px; background: #111; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;';
            container.appendChild(btn);
        });
        document.body.appendChild(container);

        const gallery = document.createElement('div');
        gallery.id = 'yanmaga-gallery';
        gallery.style = 'position: fixed; bottom: 10px; left: 10px; background: #fff; padding: 10px; max-height: 50vh; overflow-y: auto; z-index: 999998; border: 1px solid #aaa; border-radius: 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);';
        document.body.appendChild(gallery);

        return { captureBtn, zipBtn, clearBtn, gallery };
    }

    function addToGallery(img, index, gallery) {
        const wrapper = document.createElement('div');
        wrapper.style = 'margin-bottom: 8px;';
        const label = document.createElement('div');
        label.textContent = `📄 Página ${String(index + 1).padStart(3, '0')} - ${img.naturalWidth}x${img.naturalHeight}`;
        label.style = 'font-size: 12px; margin-bottom: 4px;';
        wrapper.appendChild(label);
        wrapper.appendChild(img);
        img.style.maxWidth = '120px';
        gallery.appendChild(wrapper);
    }

    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getMangaImages() {
        await wait(1000);
        const allImgs = [...document.querySelectorAll('img')];
        const valid = allImgs.filter(img => {
            const r = img.getBoundingClientRect();
            return (
                (img.src.includes('/viewer/pages/') ||
                 img.src.includes('/viewer/image?') ||
                 img.src.includes('/pages/')) &&
                r.height > 400 && r.width > 300 && img.naturalHeight > 1000
            );
        });
        return valid;
    }

    window.addEventListener('load', () => {
        const { captureBtn, zipBtn, clearBtn, gallery } = createFloatingUI();

        captureBtn.onclick = async () => {
            capturedImages.length = 0;
            gallery.innerHTML = '';

            const images = await getMangaImages();
            if (images.length === 0) {
                alert('No se encontraron imágenes grandes. Desplázate por las páginas para forzar la carga.');
                return;
            }

            for (let i = 0; i < images.length; i++) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = images[i].src;
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(blob => {
                            if (blob) {
                                capturedImages.push({
                                    name: `pagina_${String(i + 1).padStart(3, '0')}_${img.naturalWidth}x${img.naturalHeight}.jpg`,
                                    blob: blob,
                                    thumb: img
                                });
                                addToGallery(img, i, gallery);
                                resolve();
                            } else reject('No se pudo crear blob');
                        }, 'image/jpeg');
                    };
                    img.onerror = () => reject('Error al cargar imagen');
                });
            }

            alert(`Se capturaron ${capturedImages.length} páginas.`);
        };

        zipBtn.onclick = async () => {
            if (capturedImages.length === 0) {
                alert('No hay imágenes para descargar.');
                return;
            }
            const zip = new JSZip();
            capturedImages.forEach(({ name, blob }) => {
                zip.file(name, blob);
            });
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'yanmaga.zip');
        };

        clearBtn.onclick = () => {
            capturedImages.length = 0;
            gallery.innerHTML = '';
            alert('Galería limpiada.');
        };
    });
})();
