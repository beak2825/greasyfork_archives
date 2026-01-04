// ==UserScript==
// @name         Corso Numerologia
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Visualizzazione corso di Numerologia
// @author       Flejta
// @match        https://corsonumerologia.it/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530741/Corso%20Numerologia.user.js
// @updateURL https://update.greasyfork.org/scripts/530741/Corso%20Numerologia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stile CSS personalizzato
    const style = `
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        #container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        #menu {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
            background-color: #2c3e50;
            padding: 10px;
        }
        #menu button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            border-radius: 5px;
        }
        #menu button:hover {
            background-color: #2980b9;
        }
        .corso-container {
            max-width: 900px;
            margin: 0 auto;
        }
        .titolo-giorno {
            color: #2c3e50;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .sezione-video, .sezione-materiali {
            margin-bottom: 30px;
        }
        .video-item {
            margin-bottom: 30px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 20px;
        }
        .video-item h4 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .pdf-download {
            text-align: center;
            margin-top: 20px;
        }
        .bottone-download {
            display: inline-block;
            background-color: #2ecc71;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .bottone-download:hover {
            background-color: #27ae60;
        }
    </style>
    `;

    // Definizione dei contenuti per ogni giorno
    let testiGiorni = {
        giorno2: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Giorno 2 - Numerologia</h1>

                <div class="sezione-video">
                    <h2>Video del Corso</h2>

                    <div class="video-item">
                        <h4>Il Debito karmico</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/a791d6b21d1de6c22e/2dcd76cba9e58bfa?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>I numeri del debito karmico</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7091d6b21d1de6c1f9/8b5b8be1a133d4d2?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Le otto principali lezioni di vita</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/0691d6b21d1de6c78f/1cf7509eb9ae8952?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Calcolare i numeri predittivi</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21d1de6c0c4/c4bb431dd685bd91?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Calcolare i numeri dei cicli di vita principali</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21d1de6c525/af84e59b04e705b4?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Il significato dei tuoi numeri predittivi</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/d391d6b21d1de6c65a/96217cf35c070681?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Calcolare i numeri pinnacoli e i numeri delle sfide</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/a791d6b21d1ae8cb2e/b62ce17c6f2bbce4?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>I significati dei numeri pinnacoli e delle sfide</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21d1ae8c9c4/1971ae781cf48096?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Karmic lesson numbers</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b21d1ae6cacd/1e951f0f5faf77ce?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Karmic debt numbers</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ea91d6b21d1ae6c463/7c02f0595a8da3a2?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="sezione-materiali">
                    <h2>Materiali del Corso</h2>
                    <div class="pdf-download">
                        <a href="https://corsonumerologia.it/wp-content/uploads/2023/12/03-Scheda-Numerologia.pdf"
                           target="_blank" class="bottone-download">
                            Scheda Numerologia 3
                        </a>
                        <a href="https://corsonumerologia.it/wp-content/uploads/2023/12/04-Scheda-Numerologia.pdf"
                           target="_blank" class="bottone-download">
                            Scheda Numerologia 4
                        </a>
                    </div>
                </div>
            </div>
        `,
        giorno3: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Giorno 3 - Numerologia</h1>

                <div class="sezione-video">
                    <h2>Video del Corso</h2>

                    <div class="video-item">
                        <h4>I numeri delle case</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7091d6b21d1ae8c8f9/22a3f9acf446924c?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Calcolo dei numeri che derivano dai nomi delle vie e il loro significato</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/0691d6b21d1ae8ce8f/ad2a97ac0b94ce67?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>I numeri ricorrenti</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/d391d6b21d1ae8cf5a/726a62b548c46461?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Calcolare i numeri di altri nomi e relativi significati</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21d1ae8cc25/861ebea49765c36f?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>I cinque maggiori punti di forza e critici di ogni numero</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7991d6b21d1ae8cdf0/58839626c1112442?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Affinità elettive</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b21d1ae9c5cd/277f8460eb6d610a?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Le scelte professionali</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/1191d6b21d1ae9c498/d0e9cd99637a2787?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Cambio del nome</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ea91d6b21d1ae9cb63/3f2e62162e09f0e9?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Le persone famose e i numeri</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/a791d6b21d1ae9ca2e/58afc20717898c1e?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Conclusioni</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7091d6b21d1ae9c9f9/3741ba3acb18f3b0?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="sezione-materiali">
                    <h2>Materiali del Corso</h2>
                    <div class="pdf-download">
                        <a href="https://corsonumerologia.it/wp-content/uploads/2023/12/05-Scheda-Numerologia.pdf"
                           target="_blank" class="bottone-download">
                            Scheda Numerologia 5
                        </a>
                        <a href="https://corsonumerologia.it/wp-content/uploads/2023/12/06-Scheda-Numerologia-1.pdf"
                           target="_blank" class="bottone-download">
                            Scheda Numerologia 6
                        </a>
                        <a href="https://corsonumerologia.it/wp-content/uploads/2023/12/Quiz-Scheda-Numerologia.pdf"
                           target="_blank" class="bottone-download">
                            Quiz Scheda Numerologia
                        </a>
                    </div>
                </div>
            </div>
        `
    };

    // Codice base della pagina (struttura HTML)
    let codicePagina = `
        ${style}
        <div id="container">
            <div id="menu">
                <button id="giorno2">Giorno 2</button>
                <button id="giorno3">Giorno 3</button>
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

        // Gestione degli event listener per i pulsanti
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                let giornoCorrente = testiGiorni[button.id] || '';

                // Aggiorna il contenuto
                divGiorni.innerHTML = giornoCorrente;
            });
        });
    }

    // Esegui la funzione principale
    main();
})();