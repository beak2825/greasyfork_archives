// ==UserScript==
// @name         YouTube Interface Booster
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Mejora la interfaz de YouTube con capturas HD, cambio de calidad, bloqueo de anuncios y tema adaptativo.
// @author       Yeferson Andres
// @license MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541169/YouTube%20Interface%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/541169/YouTube%20Interface%20Booster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let calidadActual = 'hd720';
    let controlesVisibles = false;

    const eliminarAnuncios = () => {
        const ads = document.querySelectorAll('.ad-showing, ytd-promoted-video-renderer, ytd-display-ad-renderer, .ytp-ad-module');
        ads.forEach(ad => ad.remove());
    };

    const aplicarCalidad = (modo = calidadActual) => {
        const player = document.getElementById('movie_player');
        if (player && player.setPlaybackQualityRange) {
            player.setPlaybackQualityRange(modo);
            player.setPlaybackQuality(modo);
        }
    };

    const capturarVisible = () => {
        const video = document.querySelector('video');
        if (!video) return alert('[BrayanBot] ❌ No se encontró el video');

        try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `captura-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }, 'image/png');
        } catch (e) {
            alert('[BrayanBot] ⚠️ Este video no se puede capturar (DRM activo)');
        }
    };

    const getThemeColors = () => {
        const dark = document.documentElement.getAttribute('dark') !== null || document.documentElement.classList.contains('dark');
        return dark
            ? { bg: '#181818', fg: '#ffffff', accent: '#bb0000' }
            : { bg: '#ffffff', fg: '#000000', accent: '#ff0000' };
    };

    const crearInterfaz = () => {
        if (document.getElementById('brayanHamburguesa')) return;

        const { bg, fg, accent } = getThemeColors();

        const btnHamburguesa = document.createElement('button');
        btnHamburguesa.id = 'brayanHamburguesa';
        btnHamburguesa.textContent = '☰';
        Object.assign(btnHamburguesa.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 9999,
            padding: '10px 15px',
            backgroundColor: bg,
            color: fg,
            fontSize: '20px',
            border: `2px solid ${fg}`,
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        });

        const contenedor = document.createElement('div');
        contenedor.id = 'brayanControles';
        Object.assign(contenedor.style, {
            position: 'fixed',
            bottom: '70px',
            left: '20px',
            zIndex: 9999,
            display: 'none',
            flexDirection: 'column',
            gap: '10px',
        });

        const estiloBoton = {
            padding: '10px 15px',
            backgroundColor: accent,
            color: fg,
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        };

        const btnCaptura = document.createElement('button');
        btnCaptura.textContent = '📸 Captura';
        Object.assign(btnCaptura.style, estiloBoton);
        btnCaptura.onclick = capturarVisible;

        const btnCalidad = document.createElement('button');
        btnCalidad.textContent = '🎚 Calidad: 720p';
        Object.assign(btnCalidad.style, estiloBoton);
        btnCalidad.onclick = () => {
            calidadActual = calidadActual === 'hd720' ? 'large' : 'hd720';
            btnCalidad.textContent = `🎚 Calidad: ${calidadActual === 'hd720' ? '720p' : '480p'}`;
            aplicarCalidad();
        };

        btnHamburguesa.onclick = () => {
            controlesVisibles = !controlesVisibles;
            contenedor.style.display = controlesVisibles ? 'flex' : 'none';
        };

        contenedor.appendChild(btnCaptura);
        contenedor.appendChild(btnCalidad);
        document.body.appendChild(btnHamburguesa);
        document.body.appendChild(contenedor);
    };

    // 💡 Reaplica tema si cambia en caliente
    const observarTema = () => {
        const observer = new MutationObserver(() => {
            const old = document.getElementById('brayanHamburguesa');
            const contenedor = document.getElementById('brayanControles');
            if (old) old.remove();
            if (contenedor) contenedor.remove();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dark', 'class'] });
    };

    setInterval(() => {
        eliminarAnuncios();
        crearInterfaz();
        aplicarCalidad();
    }, 1500);

    observarTema();
})();
