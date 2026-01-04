// ==UserScript==
// @name         APOS 55° Convegno Video Player
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Migliora la visualizzazione della pagina del 55° Convegno APOS, mostrando i video in un layout moderno, la lista dei relatori e la password.
// @author       GPT-4
// @match        https://www.shiatsuapos.com/55convegno*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=shiatsuapos.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541954/APOS%2055%C2%B0%20Convegno%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/541954/APOS%2055%C2%B0%20Convegno%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- DATI DEL CONVEGNO ---
    const pageTitle = "55° Convegno Nazionale APOS";
    const pageSubtitle = "L'ESSENZA DELLO SHIATSU - L'EREDITA' DEI MAESTRI";
    const videoPassword = "CNVG_55_APOS2025!";

    const speakersInfo = `
        <h4>Relatori d'eccezione:</h4>
        <p><strong>HARUHIKO MASUNAGA SENSEI</strong> (Iokai Shiatsu Center)</p>
        <p><strong>YUJI NAMIKOSHI SENSEI</strong> (Japan Shiatsu College)</p>
        <p><strong>YASUTAKA KANEKO SENSEI</strong> (Japan Shiatsu College)</p>
        <h4 style="margin-top: 20px;">Partecipazione straordinaria ONLINE:</h4>
        <p><strong>KAZUTAMI NAMIKOSHI SENSEI</strong> (Japan Shiatsu College)</p>
    `;

    const sections = [
        {
            speaker: "HARUHIKO MASUNAGA SENSEI",
            videos: [
                { title: "Prima parte", url: "https://player.vimeo.com/video/1097413677" },
                { title: "Seconda parte", url: "https://player.vimeo.com/video/1097353467" }
            ]
        },
        {
            speaker: "YUJI NAMIKOSHI, YASUTAKA KANEKO & KAZUTAMI NAMIKOSHI SENSEI",
            videos: [
                { title: "Prima parte", url: "https://player.vimeo.com/video/1097431454" },
                { title: "Seconda parte", url: "https://player.vimeo.com/video/1098275690" },
                { title: "Terza parte", url: "https://player.vimeo.com/video/1098288911" }
            ]
        }
    ];

    // --- FUNZIONE PER GENERARE L'HTML ---
    function generatePageHtml() {
        let sectionsHtml = '';
        sections.forEach(section => {
            let videosHtml = '';
            section.videos.forEach(video => {
                videosHtml += `
                    <div class="video-part">
                        <h3>${video.title}</h3>
                        <div class="video-container">
                            <iframe src="${video.url}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen=""></iframe>
                        </div>
                    </div>
                `;
            });

            sectionsHtml += `
                <section class="video-section">
                    <h2><span class="speaker-name">${section.speaker}</span></h2>
                    <div class="parts-container">
                        ${videosHtml}
                    </div>
                </section>
            `;
        });

        return `
            <div class="container">
                <header>
                    <h1>${pageTitle}</h1>
                    <div class="subtitle">${pageSubtitle}</div>
                </header>

                <div class="info-box speakers-info">
                    ${speakersInfo}
                </div>

                <div class="info-box password-box">
                    <i class="fas fa-key"></i>
                    Password per i video: <strong>${videoPassword}</strong>
                </div>

                ${sectionsHtml}

                <footer class="footer">
                    <p>55° Convegno Nazionale APOS © 2025 | Con <i class="fas fa-heart"></i> per lo Shiatsu</p>
                </footer>
            </div>
        `;
    }

    // --- CSS PER LO STILE DELLA PAGINA ---
    const pageStyle = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background-color: #f5f5f5 !important;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            opacity: 0;
            animation: fadeIn 1s forwards;
        }
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        header {
            background: linear-gradient(135deg, #4a6fa5 0%, #166d3b 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 2.8rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        h2 {
            font-size: 1.8rem;
            color: #166d3b;
            margin: 15px 0;
            border-bottom: 2px solid #4a6fa5;
            padding-bottom: 10px;
        }
        h3 {
            font-size: 1.3rem;
            color: #333;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 1.5rem;
            font-style: italic;
            opacity: 0.9;
        }
        .info-box {
            background: white;
            border-radius: 8px;
            padding: 25px 30px;
            margin: 0 auto 30px auto;
            max-width: 800px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .speakers-info {
            text-align: left;
            border-left: 5px solid #4a6fa5;
        }
        .speakers-info h4 {
            font-size: 1.3rem;
            color: #166d3b;
            margin-bottom: 12px;
            font-weight: 600;
        }
        .speakers-info p {
            font-size: 1.1rem;
            line-height: 1.7;
            margin-bottom: 5px;
        }
        .speakers-info p strong {
            color: #333;
        }
        .password-box {
            background-color: #fffbe6;
            border: 1px solid #ffe58f;
            border-left: 5px solid #ffc107;
            color: #8a6d3b;
            text-align: center;
            font-size: 1.3rem;
        }
        .password-box i {
            margin-right: 12px;
            color: #ffc107;
        }
        .password-box strong {
            font-family: 'Courier New', Courier, monospace;
            background: #f0f0f0;
            padding: 4px 8px;
            border-radius: 4px;
            color: #d63384;
            cursor: copy;
            border: 1px dashed #ccc;
        }
        .video-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .video-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            overflow: hidden;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }
        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
        .speaker-name {
            font-weight: 600;
            color: #4a6fa5;
            font-size: 2rem;
            text-transform: uppercase;
        }
        .parts-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            margin-top: 30px;
            font-size: 0.9rem;
            color: #666;
        }
        .footer i {
            color: #e74c3c;
            margin: 0 5px;
        }
        @media (max-width: 768px) {
            h1 { font-size: 2.2rem; }
            .subtitle { font-size: 1.3rem; }
            .info-box, .video-section { padding: 20px; }
            .speaker-name { font-size: 1.6rem; }
        }
    `;

    // --- ESECUZIONE DELLO SCRIPT ---

    // 1. Pulisce il corpo della pagina
    document.body.innerHTML = '';
    document.title = pageTitle;

    // 2. Inietta Font Awesome per le icone
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    // 3. Inietta lo stile CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = pageStyle;
    document.head.appendChild(styleElement);

    // 4. Inietta il nuovo contenuto HTML
    document.body.innerHTML = generatePageHtml();

})();