// ==UserScript==
// @name         La Mente Quantica
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Visualizza videocorso La Mente Quantica
// @author       Flejta
// @include      https://lamentequantica.it/
// @include      https://lamentequantica.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530222/La%20Mente%20Quantica.user.js
// @updateURL https://update.greasyfork.org/scripts/530222/La%20Mente%20Quantica.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Definizione dei contenuti per ogni sezione/giorno
    let testiGiorni = {
        giorno1: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Giorno 1 - Chi Siamo?</h1>

                <div class="sezione-video">
                    <h2>Video del Corso</h2>

                    <div class="video-item">
                        <h4>Chi sono io? Chi siamo noi?</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/0691d6b21e1fe7c78f/727c5e0e4fcfb3c2?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Dalla Mente al Cuore</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4d91d6b51d1ae5c3c4/3ad3d5cb15ee61cc?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Sintonizzare il Cuore al Cervello</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7091d6b51d1ae5c2f9/2c086504b76b75e7?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Il connubio tra Scienza e Spiritualità</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e1eefc4cd/d21d34f35b814392?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="sezione-video-inglese">
                    <h2>Video in Lingua Inglese</h2>

                    <div class="video-item">
                        <h4>Who am I? Who are we?</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/d391d6b21e18e3c55a/d037146c7a589216?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>From the Mind to the Heart</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21e18e3c625/f667020aba51f23d?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>Tuning the Heart to the Brain</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e18e3c7f0/8f17240b6e7cfea9?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>The union between Science and Spirituality</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e2cfcd/4fe2c4fd18aec549?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>
            </div>
        `,
        giorno2: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Giorno 2 - Attiva la tua Mente Quantica</h1>

        <div class="sezione-video">
            <h2>Video del Corso (Italiano)</h2>

            <div class="video-item">
                <h4>Benvenuto alla Parte 1 del corso Attiva la tua Mente Quantica</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b2101de2ca63/7f418f8a33109a2e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Scienziato o Rockstar</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b2101de2cb2e/be2696409f277725?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Conoscere te stesso</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101de2cf5a/917db64483af4f3f?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Un'epoca di estremi</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b2101de2cc25/8192994d78e2f610?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il mondo è cambiato</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b2101de2cdf0/ef2ffe8607ee3f6a?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Addio al passato</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101de3c498/8a8117dfb4a9d44c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Accogliere il cambiamento</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b2101de3cb63/847ce0162f5cca0e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Parte 2 - Attiva la tua Mente Quantica</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b2101ce3c9c4/b60e48da88a6313e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-video-extra">
            <h2>Video Supplementari</h2>

            <div class="video-item">
                <h4>Osservando l'antica Saggezza</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b2101ce3ce8f/5661efbe0fb1a142?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Domande e risposte Scientifiche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101ce3cf5a/8d76944021eb2537?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Testare la connessione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b2101ce3cdf0/f6134fc0c75f8093?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>La Matrix Divina</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101ce2c498/fdcfefafb4ab9e3d?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>La Scienza dello Spirito</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b2101ce2cb63/fe72d7827ce3dc7f?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-video-inglese">
            <h2>Video in Lingua Inglese</h2>

            <div class="video-item">
                <h4>Part 1</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b21e19e1c1f9/99b53e3da2f5b0fa?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Scientist or Rock Star</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21e19e1c0c4/b079d22d5f551ed2?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Knowing Yourself</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b21e19e1c78f/87c25b9a9f317110?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>A Time of Extremes</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e19e1c4f0/54dacc68c80797b2?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The World Has Changed</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e19e1c4f0/54dacc68c80797b2?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Saying Goodbye to the Past</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e9c4cd/c1744d10d816abd6?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Embracing Change</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b21e18e9ca63/e278af6b91ca4a1b?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Part 2</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b21e18e9cb2e/bca18ce6e8c50b1c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Looking To Ancient Wisdom</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b21e18e9c8f9/b6fe30f7b1e315be?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Scientific Questions And Answers</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21e18e9c9c4/d5d6b277bb2470ef?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Testing Connection</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b21e18e9ce8f/63321edfef5cff16?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Divine Matrix</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21e18e9cc25/aacc5425fbbbedd3?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Science Of Spirit</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b21e18e9cf5a/e3a0c9693cb1cf0a?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>
    </div>
`,
        giorno3: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Parte 3 - Attiva la tua Mente Quantica</h1>

        <div class="sezione-video">
            <h2>Video del Corso (Italiano)</h2>

            <div class="video-item">
                <h4>Parte 3 - Attiva la tua Mente Quantica</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b2101de3ca2e/a7738783efb67d0e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Mettere in dubbio i fatti storici</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b2101de3c9f9/6929e02b245f99ca?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Cooperazione e non competizione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101de3ce5a/f02068bdb89b2ea5?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Tappe del percorso</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101deccb98/b3cdb18df3a1ae23?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Ripensare alla civiltà umana</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b2101decc52e/6b8ea034a3c10811?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Civiltà cicliche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101decc15a/e5f3ddbfdfd28bde?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creare una nuova storia</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101dedca98/96807a33857f8653?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Parte 4 - Attiva la tua Mente Quantica</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b2101dedc42e/d3267a023493cbfa?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il corpo ricorda</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101dedc05a/d92a700876499681?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Accrescere le reti neurali</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b2101dedc2f0/fda463416edb17e7?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>L'intelligenza del cuore</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101deec35a/954484806c5c8f87?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creare una connessione cuore - cervello</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101defc898/3ad77a6ffe360787?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Ottimizzare la tua connessione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b2101defc5f9/f23d4997b4726329?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Dimostrare la coerenza</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b2101defc4c4/85ad56e87436fb19?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Alzare la tua linea di riferimento</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b2101defc125/0647d241a013a794?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Benefici della coerenza cuore - cervello</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101de8cf98/a98d620bd6569554?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Accogliere il cambiamento</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b2101de8c2f9/d1c006c80c43bba7?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Riunire tutto insieme</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b2101de8c48f/ae3d409eeaf1703a?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Un'esperienza condivisa</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b2101de8c625/1f989aff3e06bb4a?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Entrare nel tuo cuore</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101de9ce98/ecf9378dda3bb3aa?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-video-inglese">
            <h2>Video in Lingua Inglese</h2>

            <div class="video-item">
                <h4>Part 3</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e8c5cd/1f33c0b5d09780d6?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Questioning Historical Facts</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e18e9cdf0/a237930cdf136929?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Cooperation Not Competition</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b21e18e8cb63/40c0051aabef6523?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Stepping Stones</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b21e18e8ca2e/7a3d3b50eafa852d?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Rethinking Human Civilization</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b21e18e8c9f9/154df8e75fbab02c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Cyclic Civilizations</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21e18e8c8c4/b07db6390b2ba76b?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creating A New Story</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21e18e8cd25/fa0da9261db03580?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Part 4</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e18e8ccf0/bdd480d2f6402b41?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Body Remembers</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b21e18e7c463/05b4cdf19c49a8b6?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Growing Neural Networks</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e7cacd/4d868851cf19cecd?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Heart Intelligence</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b21e18e7cb98/7fe2a56d9178d15e?playerTheme=dark&playerColor=2f3437?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creating A Brain Heart Connection</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21e18e7c7c4/2ef58a9375d9c49e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Optimizing Your Connection</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b21e18e7c08f/7bda5513150d5014?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Demonstrating Coherence</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b21e18e7c52e/639fdc8f69484373?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Raising Your Baseline</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b21e18e7c15a/8f6294a667b4ebfe?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Benefits of Heart Brain Coherence</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21e18e7c225/82ba8ceed9938808?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Embracing Change</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e18e7c3f0/626103b355c50ad7?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Bringing It All Together</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e6cbcd/e5177f8276dd9c2b?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>A Shared Experience</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b21e18e6ca98/cef5109b114d1bd5?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Moving Into The Heart</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b21e18e6c42e/f847e4cfea712fe4?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>
    </div>
`,giorno3: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Parte 3 - Attiva la tua Mente Quantica</h1>

        <div class="sezione-video">
            <h2>Video del Corso (Italiano)</h2>

            <div class="video-item">
                <h4>Parte 3 - Attiva la tua Mente Quantica</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b2101de3ca2e/a7738783efb67d0e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Mettere in dubbio i fatti storici</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b2101de3c9f9/6929e02b245f99ca?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Cooperazione e non competizione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101de3ce5a/f02068bdb89b2ea5?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Tappe del percorso</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101deccb98/b3cdb18df3a1ae23?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Ripensare alla civiltà umana</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b2101decc52e/6b8ea034a3c10811?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Civiltà cicliche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101decc15a/e5f3ddbfdfd28bde?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creare una nuova storia</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101dedca98/96807a33857f8653?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Parte 4 - Attiva la tua Mente Quantica</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b2101dedc42e/d3267a023493cbfa?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il corpo ricorda</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101dedc05a/d92a700876499681?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Accrescere le reti neurali</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b2101dedc2f0/fda463416edb17e7?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>L'intelligenza del cuore</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b2101deec35a/954484806c5c8f87?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creare una connessione cuore - cervello</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101defc898/3ad77a6ffe360787?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Ottimizzare la tua connessione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b2101defc5f9/f23d4997b4726329?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Dimostrare la coerenza</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b2101defc4c4/85ad56e87436fb19?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Alzare la tua linea di riferimento</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b2101defc125/0647d241a013a794?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Benefici della coerenza cuore - cervello</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101de8cf98/a98d620bd6569554?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Accogliere il cambiamento</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b2101de8c2f9/d1c006c80c43bba7?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Riunire tutto insieme</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b2101de8c48f/ae3d409eeaf1703a?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Un'esperienza condivisa</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b2101de8c625/1f989aff3e06bb4a?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Entrare nel tuo cuore</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b2101de9ce98/ecf9378dda3bb3aa?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-video-inglese">
            <h2>Video in Lingua Inglese</h2>

            <div class="video-item">
                <h4>Part 3</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e8c5cd/1f33c0b5d09780d6?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Questioning Historical Facts</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e18e9cdf0/a237930cdf136929?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Cooperation Not Competition</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b21e18e8cb63/40c0051aabef6523?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Stepping Stones</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b21e18e8ca2e/7a3d3b50eafa852d?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Rethinking Human Civilization</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b21e18e8c9f9/154df8e75fbab02c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Cyclic Civilizations</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21e18e8c8c4/b07db6390b2ba76b?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creating A New Story</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21e18e8cd25/fa0da9261db03580?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Part 4</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e18e8ccf0/bdd480d2f6402b41?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Body Remembers</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b21e18e7c463/05b4cdf19c49a8b6?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Growing Neural Networks</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e7cacd/4d868851cf19cecd?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Heart Intelligence</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b21e18e7cb98/7fe2a56d9178d15e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Creating A Brain Heart Connection</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b21e18e7c7c4/2ef58a9375d9c49e?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Optimizing Your Connection</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b21e18e7c08f/7bda5513150d5014?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Demonstrating Coherence</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b21e18e7c52e/639fdc8f69484373?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Raising Your Baseline</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b21e18e7c15a/8f6294a667b4ebfe?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Benefits of Heart Brain Coherence</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b21e18e7c225/82ba8ceed9938808?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Embracing Change</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b21e18e7c3f0/626103b355c50ad7?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Bringing It All Together</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b21e18e6cbcd/e5177f8276dd9c2b?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>A Shared Experience</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b21e18e6ca98/cef5109b114d1bd5?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Moving Into The Heart</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b21e18e6c42e/f847e4cfea712fe4?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>
    </div>`,
        giorno4: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Parte 5 - Attiva la tua Mente Quantica</h1>

        <div class="sezione-video">
            <h2>Video del Corso (Italiano)</h2>

            <div class="video-item">
                <h4>Parte 5 - Attiva la tua Mente Quantica</h4>
                <iframe src="https://player.vimeo.com/video/706883906?h=8c6decbfea&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>La storia di Corey Sue</h4>
                <iframe src="https://player.vimeo.com/video/706884057?h=ff61b8ac05&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Leggere il codice</h4>
                <iframe src="https://player.vimeo.com/video/706884175?h=465ec65365&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il primo specchio delle relazioni</h4>
                <iframe src="https://player.vimeo.com/video/706884304?h=30d2fa07ce&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il secondo specchio delle relazioni - Parte 1</h4>
                <iframe src="https://player.vimeo.com/video/706884433?h=a0ef07836e&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il secondo specchio delle relazioni - Parte 2</h4>
                <iframe src="https://player.vimeo.com/video/706884626?h=84adf958ff&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il terzo specchio delle relazioni - Parte 1</h4>
                <iframe src="https://player.vimeo.com/video/706884788?h=f12fcd7364&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Il terzo specchio delle relazioni - Parte 2</h4>
                <iframe src="https://player.vimeo.com/video/706884941?h=45b8f0ace4&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>La fonte delle nostre convinzioni</h4>
                <iframe src="https://player.vimeo.com/video/706885099?h=9702dbb053&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Identifica i tuoi schemi</h4>
                <iframe src="https://player.vimeo.com/video/706885212?h=911cadf9f1&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Identifica le tue necessità</h4>
                <iframe src="https://player.vimeo.com/video/706885346?h=5e8c1d9cca&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Identifica le tue soluzioni</h4>
                <iframe src="https://player.vimeo.com/video/706885417?h=e5d4ffc1f1&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Mettere insieme i pezzi</h4>
                <iframe src="https://player.vimeo.com/video/706885561?h=7b2836d354&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Cambiare i tuoi schemi</h4>
                <iframe src="https://player.vimeo.com/video/706885753?h=ce71c92ddd&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>La tua buona alternativa</h4>
                <iframe src="https://player.vimeo.com/video/706885931?h=9d486033da&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-video-inglese">
            <h2>Video in Lingua Inglese</h2>

            <div class="video-item">
                <h4>Part 5</h4>
                <iframe src="https://player.vimeo.com/video/727814439?h=8fb8608eeb&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Story Of Corey Sue</h4>
                <iframe src="https://player.vimeo.com/video/727814526?h=f2edf1195b&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Reading The Code</h4>
                <iframe src="https://player.vimeo.com/video/727814603?h=c1f89ba215&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The First Mirror Of Relationship</h4>
                <iframe src="https://player.vimeo.com/video/727814671?h=c3b1e2de5b&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Second Mirror Of Relationship Part 1</h4>
                <iframe src="https://player.vimeo.com/video/727814750?h=ee3a1c229d&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Second Mirror Of Relationship Part 2</h4>
                <iframe src="https://player.vimeo.com/video/727815293?h=faf2fcbea9&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Third Mirror Of Relationship Part 1</h4>
                <iframe src="https://player.vimeo.com/video/727815361?h=d9c8b89175&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Third Mirror Of Relationship Part 2</h4>
                <iframe src="https://player.vimeo.com/video/727815439?h=826f3540c7&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>The Source Of Our Beliefs</h4>
                <iframe src="https://player.vimeo.com/video/727815509?h=f828990de9&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Identify Your Patterns</h4>
                <iframe src="https://player.vimeo.com/video/727815868?h=fe6f08c7db&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Identify Your Needs</h4>
                <iframe src="https://player.vimeo.com/video/727815941?h=79dc983723&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Identify Your Solutions</h4>
                <iframe src="https://player.vimeo.com/video/727815996?h=77c93c63e0&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>A Template</h4>
                <iframe src="https://player.vimeo.com/video/727816091?h=fc59dc91c2&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Changing Your Patterns</h4>
                <iframe src="https://player.vimeo.com/video/727816240?h=f6f668a7d4&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>Your Healthy Alternative</h4>
                <iframe src="https://player.vimeo.com/video/727816286?h=0d307cef04&badge=0&autopause=0&player_id=0&app_id=58479"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>
    </div>
`,
        giorno5: '',
        giorno6: ''
    };

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
        .sezione-video, .sezione-video-inglese {
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
    </style>
    `;

    // Codice base della pagina (struttura HTML)
    let codicePagina = `
        ${style}
        <div id="container">
            <div id="menu">
                <button id="giorno1">Giorno 1</button>
                <button id="giorno2">Giorno 2</button>
                <button id="giorno3">Giorno 3</button>
                <button id="giorno4">Giorno 4</button>
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