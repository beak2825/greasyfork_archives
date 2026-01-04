// ==UserScript==
// @name         Captura de Post (Iframe)
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  Añade un botón para gestionar las capturas de los posts usando iframe y polling.
// @match        https://devox.re/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license MIT 
// @connect      cdn.devox.re
// @connect      img.youtube.com
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/516451/Captura%20de%20Post%20%28Iframe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516451/Captura%20de%20Post%20%28Iframe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const imageList = [];
    const POLL_INTERVAL_MS = 2000; // Intervalo de polling en ms
    const MAX_POLL_ATTEMPTS = 15;  // Máximo de intentos

    function showDialog(message, isError = false) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '9999', animation: 'fadeInOutOverlay 1s ease-in-out'
        });
        const dialog = document.createElement('div');
        Object.assign(dialog.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            backgroundColor: isError ? '#ff4444' : '#4CAF50', color: 'white', padding: '20px 40px',
            borderRadius: '10px', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: '10000', textAlign: 'center', minWidth: '200px', animation: 'fadeInOut 1s ease-in-out'
        });
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `@keyframes fadeInOut { 0% { opacity:0; transform:translate(-50%,-50%) scale(0.9); } 20% { opacity:1; transform:translate(-50%,-50%) scale(1); } 80% { opacity:1; transform:translate(-50%,-50%) scale(1); } 100% { opacity:0; transform:translate(-50%,-50%) scale(0.9); } } `+
                                 `@keyframes fadeInOutOverlay { 0% { opacity:0; } 20% { opacity:1; } 80% { opacity:1; } 100% { opacity:0; } }`;
        document.head.appendChild(styleSheet);
        dialog.textContent = message;
        document.body.append(overlay, dialog);
        setTimeout(() => { overlay.remove(); dialog.remove(); styleSheet.remove(); }, 1000);
    }

    function updateMenuButton() {
        const navbarMenu = document.querySelector('#navbarMenu');
        let imageButton = navbarMenu?.querySelector('.image-count-button');
        if (!imageButton) {
            imageButton = document.createElement('li');
            imageButton.classList.add('menuIcon','tooltip-bottom','mobile','image-count-button');
            imageButton.style.cursor = 'pointer';
            const icon = document.createElement('div'); icon.style.fontFamily = 'Coolvetica';
            imageButton.appendChild(icon);
            imageButton.addEventListener('click', copyImagesToClipboard);
            navbarMenu?.appendChild(imageButton);
        }
        imageButton.firstChild.textContent = imageList.length;
    }

    const copyImagesToClipboard = async () => {
        if (imageList.length > 0) {
            const blob = imageList.shift();
            const item = new ClipboardItem({ "image/png": blob });
            try {
                await navigator.clipboard.write([item]);
                showDialog("¡Imagen copiada al portapapeles! ✅");
            } catch (error) {
                console.error("Error al copiar al portapapeles:", error);
                showDialog("Error al copiar imagen ❌", true);
            }
            updateMenuButton();
        }
    };

    function addButtonsToPosts() {
        document.querySelectorAll('.voxList .vox').forEach(post => {
            if (post.nextElementSibling?.classList.contains('copy-button-container')) return;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'copy-button-container';
            buttonContainer.style.textAlign = 'center'; buttonContainer.style.marginTop = '10px';

            const button = document.createElement('button');
            button.textContent = '📸';
            Object.assign(button.style, {
                margin:'5px', padding:'3px 6px', backgroundColor:'#007BFF', color:'#FFF',
                border:'none', borderRadius:'50%', cursor:'pointer', fontSize:'16px',
                width:'32px', height:'32px', display:'inline-flex', alignItems:'center',
                justifyContent:'center', zIndex:'1000'
            });

            button.addEventListener('click', async event => {
                event.stopPropagation();
                const watermark = document.createElement('div');
                watermark.className = 'watermark'; watermark.textContent = '@DevoxP0sting';
                Object.assign(watermark.style, { position:'absolute', top:'7px', left:'119px',
                    fontSize:'6px', color:'rgba(255,255,255,0.5)', fontWeight:'700', zIndex:'3',
                    textShadow:'1px 1px 2px rgba(0,0,0,0.7)', fontFamily:`'Roboto Mono', monospace`, opacity:'0.6'
                });
                post.appendChild(watermark);

                try {
                    const bg = post.style.backgroundImage;
                    if (!bg || bg === 'none') {
                        throw new Error('Sin imagen de fondo');
                    }
                    const m = bg.match(/url\(["']?([^"']+)["']?\)/);
                    if (!m) throw new Error('URL inválida');
                    const imageUrl = m[1];

                    const imgBase64 = await new Promise((resolve, reject) => {
                        try {
                            const iframe = document.createElement('iframe');
                            iframe.id = 'imagen-posteo';
                            iframe.style.display = 'none';
                            iframe.src = imageUrl;
                            document.body.appendChild(iframe);

                            let attempts = 0;
                            const poller = setInterval(() => {
                                attempts++;
                                let data = "";
                                try { data = iframe.contentWindow.name; } catch {}

                                if (data.startsWith('data:image')) {
                                    clearInterval(poller);
                                    iframe.remove();
                                    resolve(data); // devolvés el base64
                                } else if (attempts >= MAX_POLL_ATTEMPTS) {
                                    clearInterval(poller);
                                    iframe.remove();
                                    reject(new Error('No se obtuvo base64 en el título'));
                                }
                            }, POLL_INTERVAL_MS);
                        } catch (err) {
                            reject(err);
                        }
                    });
                    // Renderizar con html2canvas
                    const originalBg = post.style.backgroundImage;
                    post.style.backgroundImage = `url(${imgBase64})`;
                    const canvas = await html2canvas(post, { backgroundColor:null, scale:2.26, useCORS:true, allowTaint:false });
                    post.style.backgroundImage = originalBg;

                    await new Promise(res => canvas.toBlob(blob => {
                        if (blob) imageList.push(blob);
                        res();
                    }, 'image/png'));

                    updateMenuButton();
                    showDialog('Imagen añadida a la lista ✅');

                } catch (error) {
                    console.error('Error al capturar imagen:', error);
                    showDialog(`Error: ${error.message} ❌`, true);
                } finally {
                    post.querySelector('.watermark')?.remove();
                }
            });

            buttonContainer.appendChild(button);
            post.insertAdjacentElement('afterend', buttonContainer);
        });
    }

    // inicialización
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const initInterval = setInterval(() => {
        const node = document.querySelector('#voxList');
        if (!node) return;
        addButtonsToPosts();
        new MutationObserver(() => addButtonsToPosts()).observe(node, { childList:true, subtree:true });
        clearInterval(initInterval);
    }, 1000);
})();
