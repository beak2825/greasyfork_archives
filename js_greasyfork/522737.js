// ==UserScript==
// @name           Redirects Instagram to an open source alternative
// @name:es        Redirige Instagram a una alternativa de código abierto
// @namespace      https://greasyfork.org/es/users/1228259-tivp
// @version        3/1/2025 19:09
// @license        Unlicenced
// @description    It redirects Instagram to an ethical alternative (Imginn) and allows you to return to the site you were before being redirected. Ideal when you want to view Instagram content and don't want to log in.
// @description:es Redirige Instagram a una alternativa ética (Imginn) y permite regresar al sitio que estaba antes de ser redirigido. Ideal cuando quieres ver contenido de Instagram y no quieres iniciar sesión.
// @include        *instagram.com/*
// @include        *imginn.com/*
// @icon           https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.instagram.com&size=48
// @icon64         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.instagram.com&size=64
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/522737/Redirects%20Instagram%20to%20an%20open%20source%20alternative.user.js
// @updateURL https://update.greasyfork.org/scripts/522737/Redirects%20Instagram%20to%20an%20open%20source%20alternative.meta.js
// ==/UserScript==

(function () {
    const target = 'imginn.com';

    // Función para crear botones estilizados
    function createButton(text, position, color, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style = `
            position: fixed;
            bottom: 10px;
            ${position}: 10px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: ${color};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            transition: background-color 0.3s ease;
        `;
        btn.onclick = onClick;
        btn.onmouseover = () => btn.style.backgroundColor = '#1e9b74';
        btn.onmouseout = () => btn.style.backgroundColor = color;
        document.body.appendChild(btn);
    }

    // Si la página contiene el hash '#Desactivado', mostrar botón para volver
    if (location.hash === '#Desactivado') {
        createButton('Volver al sitio alternativo', 'left', '#2ed573', () => location.href = location.href.split('#')[0]);
        return;
    }

    // Redirigir desde Instagram a Imginn
    if (location.host.includes('instagram.com')) {
        const originalUrl = location.href;
        const reelsMatch = location.pathname.match(/^\/([^/]+)\/reels\/$/);
        const reelWithCodeMatch = location.pathname.match(/^\/([^/]+)\/reel\/([^/]+)\/$/);

        if (reelWithCodeMatch) {
            location.replace(`https://${target}/p/${reelWithCodeMatch[2]}/#${encodeURIComponent(originalUrl)}`);
        } else if (reelsMatch) {
            location.replace(`https://${target}/${reelsMatch[1]}#${encodeURIComponent(originalUrl)}`);
        } else {
            location.replace(`https://${target}${location.pathname}${location.search}#${encodeURIComponent(originalUrl)}`);
        }
    }

    // Cargar el botón para regresar al sitio original cuando estamos en Imginn
    window.onload = () => {
        if (location.host.includes(target)) {
            const originalUrl = decodeURIComponent(location.hash.substring(1));
            if (originalUrl) {
                createButton('Volver al sitio original', 'right', '#ff4757', () => {
                    location.href = `${originalUrl}#Desactivado`;
                });
            }
        }
    };
})();