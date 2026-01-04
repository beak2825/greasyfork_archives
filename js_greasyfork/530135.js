// ==UserScript==
// @name         Ritorno alle Origini Master
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Visualizza il corso Ritorno alle Origini di Andreas Goldemann
// @author       Flejta
// @include      https://www.andreasgoldemann-italia.com/
// @include      https://www.andreasgoldemann-italia.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530135/Ritorno%20alle%20Origini%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/530135/Ritorno%20alle%20Origini%20Master.meta.js
// ==/UserScript==
//https://www.andreasgoldemann-italia.com/chapter-1/
(function() {
    'use strict';

    // Definizione dei contenuti per ogni sessione
    let testiGiorni = {
        benvenuto: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Benvenuto al corso Ritorno alle Origini</h1>
                <div class="sezione-intro">
                    <p>Un viaggio nel profondo della tua coscienza per eliminare la disarmonia, lo squilibrio e le energie negative.</p>
                    <p><em><strong>Ritorno alle Origini</strong></em> è un programma di lavoro energetico approfondito e progettato per <strong>ripristinare l'ordine energetico naturale del tuo corpo, mente e anima.</strong></p>
                    <p>Utilizzando tecniche all'avanguardia dell'<strong>unione di suono, voce, movimento e riflessione</strong>, Andreas Goldemann trasmette informazioni organizzative a ogni parte del corpo e ai centri energetici per eliminare i blocchi e ripristinare l'ordine.</p>
                </div>
            </div>
        `,
        giorno1: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Sessione 1</h1>
                <h3 class="sottotitolo-giorno">Introduzione e Allineamento & Transformazione</h3>

                <p class="descrizione-sessione">In questa sessione Andreas si concentrerà sulla colonna cervicale e ci guiderà a comprendere gli effetti delle emozioni negative sul nostro allineamento e sul flusso energetico, oltre a mostrarci come disattivare l'autoaggressività.</p>

                <div class="sezione-video">
                    <h2>Parte 01 - Introduzione e Allineamento</h2>

                    <div class="opzioni-lingua">
                        <div class="video-item">
                            <h4>Video con audio in Italiano</h4>
                            <div style="position:relative;padding-top:56.25%;">
                                <iframe src="https://iframe.mediadelivery.net/embed/55467/ad672c6d-4ea5-4d81-ac20-d2371202cefe?autoplay=false&loop=false&muted=false&preload=false&responsive=true&captions=IT"
                                        loading="lazy"
                                        style="border:0;position:absolute;top:0;height:100%;width:100%;"
                                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                                        allowfullscreen="true">
                                </iframe>
                            </div>
                        </div>

                        <div class="video-item">
                            <h4>Video in lingua originale con i sottotitoli in Italiano</h4>
                            <div style="position:relative;padding-top:56.25%;">
                                <iframe src="https://iframe.mediadelivery.net/embed/55467/9cb18db8-bb51-4ab5-b8e4-dbf7b0fe13b1?autoplay=false&loop=false&muted=false&preload=false&responsive=true&captions=IT"
                                        loading="lazy"
                                        style="border:0;position:absolute;top:0;height:100%;width:100%;"
                                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                                        allowfullscreen="true">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sezione-video">
                    <h2>Parte 02 - Transformazione</h2>

                    <div class="opzioni-lingua">
                        <div class="video-item">
                            <h4>Video con audio in Italiano</h4>
                            <div style="position:relative;padding-top:56.25%;">
                                <iframe src="https://iframe.mediadelivery.net/embed/55467/e1b8b1d9-8be1-4cbf-8526-c3b5d54d1ded?autoplay=false&loop=false&muted=false&preload=false&responsive=true"
                                        loading="lazy"
                                        style="border:0;position:absolute;top:0;height:100%;width:100%;"
                                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                                        allowfullscreen="true">
                                </iframe>
                            </div>
                        </div>

                        <div class="video-item">
                            <h4>Video in lingua originale con i sottotitoli in Italiano</h4>
                            <div style="position:relative;padding-top:56.25%;">
                                <iframe src="https://iframe.mediadelivery.net/embed/55467/ead7841c-c1da-442b-9232-5a1eef83d3a0?autoplay=false&loop=false&muted=false&preload=false&responsive=true&captions=IT"
                                        loading="lazy"
                                        style="border:0;position:absolute;top:0;height:100%;width:100%;"
                                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                                        allowfullscreen="true">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sezione-audio">
                    <h2>Parte 03 - Suono</h2>
                    <p>Siediti, rilassati e sperimenta il canto unico di Andreas Goldemann</p>

                    <div class="audio-player">
                        <audio controls>
                            <source src="https://1968799857.rsc.cdn77.org/audiofiles/goa-en/Session_1_Sound.mp3" type="audio/mpeg">
                            Il tuo browser non supporta l'elemento audio.
                        </audio>
                        <div class="audio-download">
                            <a href="https://1968799857.rsc.cdn77.org/audiofiles/goa-en/Session_1_Sound.mp3" download class="bottone-download">
                                Scarica file audio
                            </a>
                        </div>
                    </div>
                </div>

                <div class="sezione-materiali">
                    <h2>Materiali Correlati</h2>
                    <p>Vuoi scoprire di più sul corso completo? Visita la pagina dell'offerta:</p>
                    <div class="link-materiali">
                        <a href="/offer/" class="bottone-materiali">Scopri l'offerta completa</a>
                    </div>
                </div>
            </div>
        `,
        giorno2: '',
        giorno3: '',
        giorno4: '',
        giorno5: ''
    };

    // Stile CSS personalizzato
    const style = `
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f5f2;
            color: #333;
        }
        #container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        #menu {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 30px;
            background: linear-gradient(90deg, #1D2E64 0%, #E5007D 100%);
            padding: 15px;
            border-radius: 8px;
        }
        #menu button {
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
            padding: 12px 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 25px;
            font-weight: 500;
            font-size: 15px;
        }
        #menu button:hover {
            background-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .corso-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        .titolo-giorno {
            color: #1D2E64;
            text-align: center;
            font-size: 36px;
            margin-bottom: 10px;
            border-bottom: 2px solid #E5007D;
            padding-bottom: 15px;
        }
        .sottotitolo-giorno {
            color: #E5007D;
            text-align: center;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 30px;
        }
        .descrizione-sessione {
            text-align: center;
            font-size: 18px;
            max-width: 800px;
            margin: 0 auto 40px;
            line-height: 1.6;
        }
        .sezione-intro {
            background-color: #f1f1f1;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        .sezione-intro p {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .sezione-video, .sezione-audio, .sezione-materiali {
            margin-bottom: 50px;
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
        }
        .sezione-video h2, .sezione-audio h2, .sezione-materiali h2 {
            color: #1D2E64;
            text-align: center;
            margin-bottom: 25px;
            font-size: 24px;
        }
        .opzioni-lingua {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-top: 20px;
        }
        .video-item {
            margin-bottom: 20px;
        }
        .video-item h4 {
            color: #E5007D;
            margin-bottom: 15px;
            text-align: center;
        }
        .audio-player {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        .audio-player audio {
            width: 100%;
            margin-bottom: 20px;
        }
        .audio-download {
            margin-top: 15px;
        }
        .bottone-download, .bottone-materiali {
            display: inline-block;
            background: linear-gradient(90deg, #1D2E64 0%, #E5007D 100%);
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .bottone-download:hover, .bottone-materiali:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        }
        .link-materiali {
            text-align: center;
            margin-top: 20px;
        }

        @media (max-width: 768px) {
            .opzioni-lingua {
                grid-template-columns: 1fr;
            }
            #menu button {
                padding: 10px 15px;
                font-size: 14px;
            }
            .titolo-giorno {
                font-size: 28px;
            }
            .sottotitolo-giorno {
                font-size: 20px;
            }
        }
    </style>
    `;

    // Codice base della pagina (struttura HTML)
    let codicePagina = `
        ${style}
        <div id="container">
            <div id="menu">
                <button id="benvenuto">Benvenuto</button>
                <button id="giorno1">Sessione 1</button>
                <button id="giorno2">Sessione 2</button>
                <button id="giorno3">Sessione 3</button>
                <button id="giorno4">Sessione 4</button>
                <button id="giorno5">Sessione 5</button>
            </div>
            <div id="giorni">
                <!-- Contenuto dinamico verrà caricato qui -->
            </div>
        </div>
    `;

    // Funzione principale
    function main() {
        // Sostituisce l'intero contenuto del body
        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = codicePagina;

        // Seleziona tutti i pulsanti e l'area dei contenuti
        const buttons = document.querySelectorAll('button');
        const divGiorni = document.querySelector('#giorni');

        // Carica il contenuto del Benvenuto all'inizio
        divGiorni.innerHTML = testiGiorni.benvenuto;

        // Gestione degli event listener per i pulsanti
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                let contenutoCorrente = testiGiorni[button.id] || '';

                // Se il contenuto non è disponibile, mostra un messaggio
                if (!contenutoCorrente) {
                    contenutoCorrente = `
                        <div class="corso-container">
                            <h2 class="titolo-giorno">Contenuto in arrivo</h2>
                            <p style="text-align: center; font-size: 18px; margin-top: 30px;">
                                Questa sessione sarà disponibile prossimamente.
                            </p>
                        </div>
                    `;
                }

                // Aggiorna il contenuto
                divGiorni.innerHTML = contenutoCorrente;

                // Scroll all'inizio della pagina
                window.scrollTo(0, 0);
            });
        });
    }

    // Esegui la funzione principale
    main();
})();