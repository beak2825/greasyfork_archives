// ==UserScript==
// @name         54° Convegno APOS Video Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Visualizzatore video per il 54° Convegno di Aggiornamento APOS
// @author       Flejta
// @match        https://www.shiatsuapos.com/54convegno*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529411/54%C2%B0%20Convegno%20APOS%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/529411/54%C2%B0%20Convegno%20APOS%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Rimuovi il contenuto esistente della pagina
    document.body.innerHTML = '';
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>54° Convegno APOS</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    `;
    
    // Stile della pagina
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: linear-gradient(135deg, #4a6fa5 0%, #166d3b 100%);
            color: white;
            padding: 30px 0;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            font-size: 2.5rem;
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
        
        .subtitle {
            font-size: 1.5rem;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        
        .video-section {
            background: white;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease;
        }
        
        .video-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            overflow: hidden;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
            font-size: 1.4rem;
        }
        
        .video-title {
            font-style: italic;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .parts-container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .video-part {
            flex: 1;
            min-width: 300px;
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
            h1 {
                font-size: 2rem;
            }
            
            .subtitle {
                font-size: 1.2rem;
            }
            
            .video-section {
                padding: 15px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Struttura della pagina
    document.body.innerHTML = `
        <div class="container">
            <header>
                <h1>54° Convegno di Aggiornamento APOS</h1>
                <div class="subtitle">"Seguire il Ki: Shiatsu oltre i meridiani"</div>
            </header>
            
            <!-- Wilfried Rappenecker Video -->
            <section class="video-section">
                <h2><span class="speaker-name">Wilfried Rappenecker</span></h2>
                <div class="video-title">"Seguire il Ki: Shiatsu oltre i meridiani"</div>
                
                <div class="parts-container">
                    <div class="video-part">
                        <h3>Prima parte</h3>
                        <div class="video-container">
                            <iframe src="https://player.vimeo.com/video/946576389" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </div>
                    
                    <div class="video-part">
                        <h3>Seconda parte</h3>
                        <div class="video-container">
                            <iframe src="https://player.vimeo.com/video/946577246" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Enzo Antoci Video -->
            <section class="video-section">
                <h2><span class="speaker-name">Enzo Antoci</span></h2>
                <div class="video-title">Pillole di Shiatsu: "La priorità nel trattamento Shiatsu"</div>
                <div class="video-container">
                    <iframe src="https://player.vimeo.com/video/948614846" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
            </section>
            
            <!-- Roberto Pandini Video -->
            <section class="video-section">
                <h2><span class="speaker-name">Roberto Pandini</span></h2>
                <div class="video-title">Shiatsu e Autismo: "La pressione che nutre la relazione"</div>
                <div class="video-container">
                    <iframe src="https://player.vimeo.com/video/946077331" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
            </section>
            
            <!-- Benedetta Capezzuoli Video -->
            <section class="video-section">
                <h2><span class="speaker-name">Benedetta Capezzuoli</span></h2>
                <div class="video-title">Presentazione del suo ultimo libro "Anodo Sacrificale"</div>
                <div class="video-container">
                    <iframe src="https://player.vimeo.com/video/945963588" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
            </section>
            
            <footer class="footer">
                <p>54° Convegno di Aggiornamento APOS &copy; 2025 | Con <i class="fas fa-heart"></i> per lo Shiatsu</p>
            </footer>
        </div>
    `;
})();