// ==UserScript==
// @name                Save Image As...
// @description         Allows you to save an image in different formats.
// @namespace           Meica05GOD
// @version             2.4
// @license             MIT
// @author              GPT 4o
// @match               *://*/*
// @grant               GM_download
// @grant               GM_xmlhttpRequest
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/535185/Save%20Image%20As.user.js
// @updateURL https://update.greasyfork.org/scripts/535185/Save%20Image%20As.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const lang = (navigator.language || 'en').toLowerCase();
    const isEs = lang.startsWith('es');
    const L = {
        menu: {
            png:    isEs ? 'Guardar como PNG' : 'Save as PNG',
            jpg:    isEs ? 'Guardar como JPG' : 'Save as JPG',
            webp:   isEs ? 'Guardar como WEBP' : 'Save as WEBP',
        },
        alert: {
            httpError:       status => isEs
                                ? `Error HTTP ${status} al descargar la imagen.`
                                : `HTTP error ${status} downloading image.`,
            networkError:    isEs
                                ? 'Error de red al descargar la imagen.'
                                : 'Network error downloading image.',
            convertError:    ext => isEs
                                ? `No se pudo convertir la imagen a .${ext}`
                                : `Could not convert image to .${ext}`,
            loadError:       isEs
                                ? 'Error cargando la imagen para conversión.'
                                : 'Error loading image for conversion.',
        }
    };

    const menu = document.createElement('div');
    Object.assign(menu.style, {
        position: 'fixed',
        background: '#fff',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
        zIndex: 2147483647,
        padding: '5px 0',
        display: 'none',
        borderRadius: '4px',
        minWidth: '150px',
        fontFamily: 'sans-serif',
        fontSize: '14px'
    });
    document.body.appendChild(menu);

    const formats = [
        { key: 'png', mime: 'image/png', ext: 'png' },
        { key: 'jpg', mime: 'image/jpeg', ext: 'jpg' },
        { key: 'webp', mime: 'image/webp', ext: 'webp' }
    ];
    formats.forEach(({ key, mime, ext }) => {
        const item = document.createElement('div');
        item.textContent = L.menu[key];
        Object.assign(item.style, {
            padding: '6px 12px',
            cursor: 'pointer',
            color: '#000',
            opacity: '1',
            pointerEvents: 'auto',
        });
        item.addEventListener('click', e => {
            e.stopPropagation();
            if (currentImgUrl) downloadAs(currentImgUrl, mime, ext);
            hideMenu();
        });
        menu.appendChild(item);
    });

    let currentImgUrl = null;

    document.addEventListener('contextmenu', function(e) {
        const target = e.target;
        let imgUrl = null;
        const imgEl = target.closest('img');
        if (imgEl && imgEl.src) {
            imgUrl = imgEl.src;
        } else {
            const bg = getComputedStyle(target).getPropertyValue('background-image');
            const m = bg.match(/url\(["']?(.*?)["']?\)/);
            if (m) imgUrl = m[1];
        }

        if (e.shiftKey && imgUrl) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            currentImgUrl = imgUrl;
            showMenu(e.clientX, e.clientY);
        } else {
            hideMenu();
        }
    }, true);

    document.addEventListener('click', e => {
        if (!menu.contains(e.target)) hideMenu();
    }, true);

    function showMenu(x, y) {
        const mw = menu.offsetWidth, mh = menu.offsetHeight;
        const ww = window.innerWidth, wh = window.innerHeight;
        if (x + mw > ww) x = ww - mw - 5;
        if (y + mh > wh) y = wh - mh - 5;
        if (x < 0) x = 5;
        if (y < 0) y = 5;

        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.display = 'block';
    }

    function hideMenu() {
        menu.style.display = 'none';
        currentImgUrl = null;
    }

    function downloadAs(url, mimeType, ext) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload(resp) {
                if (resp.status >= 200 && resp.status < 300) {
                    processBlob(resp.response, mimeType, ext);
                } else {
                    alert(L.alert.httpError(resp.status));
                }
            },
            onerror() {
                alert(L.alert.networkError);
            }
        });
    }

    function processBlob(blob, mimeType, ext) {
        const oUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            c.getContext('2d').drawImage(img, 0, 0);
            URL.revokeObjectURL(oUrl);
            c.toBlob(cb => {
                if (!cb) {
                    alert(L.alert.convertError(ext));
                    return;
                }
                const dUrl = URL.createObjectURL(cb);
                GM_download({ url: dUrl, name: `image_${Date.now()}.${ext}`, saveAs: true });
                setTimeout(() => URL.revokeObjectURL(dUrl), 10000);
            }, mimeType);
        };
        img.onerror = () => {
            URL.revokeObjectURL(oUrl);
            alert(L.alert.loadError);
        };
        img.src = oUrl;
    }

})();
