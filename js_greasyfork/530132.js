// ==UserScript==
// @name         Chakra Cleaning
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Visualizza videocorso Chakra Clearing
// @author       Flejta
// @include      https://chakraclearing.it/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530132/Chakra%20Cleaning.user.js
// @updateURL https://update.greasyfork.org/scripts/530132/Chakra%20Cleaning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Definizione dei contenuti per ogni sezione/giorno
    let testiGiorni = {
        giorno1: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Giorno 1 - Chakra Radice</h1>

                <div class="sezione-video">
                    <h2>Video del Corso</h2>

                    <div class="video-item">
                        <h4>1. Chakra Radice: Benvenuto</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ea91d6b51d1ce1c263/de5c6de6c2f5241d?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>2. Chakra Radice: Caratteristiche</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7091d6b51d1ce1c0f9/c420225509d564cb?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>3. Chakra Radice: Arcangelo Ariel</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4d91d6b51d1ce1c1c4/181b0a9346deb25e?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>4. Chakra Radice: Alimentazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/0691d6b51d1ce1c68f/de361d0da58fdada?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>5. Chakra Radice: Pietre e Cristalli</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1ce1c75a/eede02b9cd14a1f8?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>6. Chakra Radice: Introduzione Meditazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1fe3c4f0/f5743aa187e0b69f?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>7. Chakra Radice: Meditazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1ce1c5f0/ed0afc11ca2f5769?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>8. Meditazione del Mattino</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1fe7c9cd/30287395c72e6ffd?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="sezione-materiali">
                    <h2>Materiali del Corso</h2>
                    <div class="pdf-download">
                        <a href="https://chakraclearing.it/wp-content/uploads/2021/02/chakra-clearing.pdf"
                           target="_blank" class="bottone-download">
                            Scarica il Libro Chakra Clearing (PDF)
                        </a>
                    </div>
                </div>
            </div>
        `,
        giorno1Sera: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Giorno 1 Sera</h1>
                <div class="sezione-meditazione">
                    <h2>Meditazione della Sera</h2>
                    <div class="video-meditazione">
                        <iframe src="https://player.vimeo.com/video/695704381?h=53f6e2f261&badge=0&autopause=0&player_id=0&app_id=58479"
                                frameborder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowfullscreen
                                style="width:100%;height:500px;"
                                title="Meditazione Serale Chakra Clearing">
                        </iframe>
                    </div>
                    <div class="audio-download">
                        <h3>Meditazione MP3</h3>
                        <audio controls style="width:100%; max-width:600px; display:block; margin:20px auto;">
                            <source src="https://www.mylife.it/mediafile/4671/download" type="audio/mpeg">
                            Il tuo browser non supporta l'elemento audio.
                        </audio>
                        <a href="https://www.mylife.it/mediafile/4671/download" class="bottone-download">
                            Scarica la Meditazione in MP3
                        </a>
                    </div>
                </div>
            </div>
        `,
        giorno2: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Giorno 2 - Chakra Sacrale</h1>

                <div class="sezione-video">
                    <h2>Video del Corso</h2>

                    <div class="video-item">
                        <h4>1. Chakra Sacrale: Caratteristiche</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/1191d6b51d1ce0cc98/6ee93bee5527ceb4?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>2. Chakra Sacrale: Arcangelo Gabriele</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1ce0cdcd/6b1ceb2775256d10?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>3. Chakra Sacrale: Alimentazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ea91d6b51d1ce0c363/ec65aa49efdb6e74?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>4. Chakra Sacrale: Pietre e Cristalli</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/a791d6b51d1ce0c22e/52f4aac45c70940c?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>5. Chakra Sacrale: Introduzione Meditazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ea91d6b51d1eebca63/7e06fa3345cba725?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>6. Chakra Sacrale: Meditazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/a791d6b51d1eebcb2e/528d6867a7c84294?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>7. Chakra Sacrale: Etica</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4d91d6b51d1ce0c0c4/f3bfaf3c80b76905?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="sezione-materiali">
                    <h2>Materiali del Corso</h2>
                    <div class="pdf-download">
                        <a href="https://chakraclearing.it/wp-content/uploads/2021/02/spazio_magico.pdf"
                           target="_blank" class="bottone-download">
                            Scarica "Spazio Magico" (PDF)
                        </a>
                    </div>
                </div>
            </div>
        `,
        giorno3: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Giorno 3 - Chakra Plesso Solare</h1>

        <div class="sezione-video">
            <h2>Video del Corso</h2>

            <div class="video-item">
                <h4>1. Chakra Plesso Solare: Caratteristiche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b51d1ce0c78f/c4a80274d9b3ed30?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>2. Chakra Plesso Solare: Arcangeli Ragual e Metatron</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b51d1ce0c525/59ed5c00adea8d79?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>3. Chakra Plesso Solare: Alimentazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1ce0c4f0/0c6cb4805bed9c18?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>4. Chakra Plesso Solare: Pietre e Cristalli</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b51d1feac598/f1e4f21c299b2fa2?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>5. Chakra Plesso Solare: Introduzione Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b51d1eebc8f9/4250749886c580fc?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>6. Chakra Plesso Solare: Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b51d1eebc9c4/3b4e05bb4154f7c9?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-materiali">
            <h2>Materiali del Corso</h2>
            <div class="pdf-download">
                <a href="https://chakraclearing.it/wp-content/uploads/2021/02/nuovo_equilibrio_emozionale.pdf"
                   target="_blank" class="bottone-download">
                    Scarica "Il Nuovo Equilibrio Emozionale" (PDF)
                </a>
            </div>
        </div>
    </div>
`,
        giorno4: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Giorno 4 - Chakra del Cuore</h1>

        <div class="sezione-video">
            <h2>Video del Corso</h2>

            <div class="video-item">
                <h4>1. Chakra del Cuore: Caratteristiche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b51d1feaca63/a8259a928a71f871?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>2. Chakra del Cuore: Arcangelo Raffaele</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b51d1feace8f/3efeca25e85c49df?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>3. Chakra del Cuore: Alimentazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b51d1febc498/b64b0b176422035b?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>4. Chakra del Cuore: Pietre e Cristalli</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b51d1febcb63/e8a71a3c70b7cc9c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>5. Chakra del Cuore: Introduzione Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b51d1eebce8f/9128f2ed0c49988c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>6. Chakra del Cuore: Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1eebcf5a/472c9ac738127cd3?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-materiali">
            <h2>Materiali del Corso</h2>
            <div class="pdf-download">
                <a href="https://amzn.to/3YamByF"
                   target="_blank" class="bottone-download">
                    Acquista "Fai Brillare l'Angelo che è in Te" (Libro)
                </a>
            </div>
        </div>
    </div>
`,
        giorno5: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Giorno 5 - Chakra della Gola</h1>

        <div class="sezione-video">
            <h2>Video del Corso</h2>

            <div class="video-item">
                <h4>1. Chakra della Gola: Caratteristiche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1febc5cd/3a6ccf75b6492908?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>2. Chakra della Gola: Arcangelo Sandalphon</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1feacf5a/b68be531be44290c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>3. Chakra della Gola: Alimentazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1feacdf0/51ea56d9ed4c56e8?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>4. Chakra della Gola: Introduzione Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b51d1eebcc25/2355426533dc326c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>5. Chakra della Gola: Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b51d1eeac498/edf33f017937355d?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>6. Meditazione del Mattino</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1fe7c9cd/30287395c72e6ffd?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>7. Meditazione della Sera</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1fe4c3f0/d220ab5aa15cd1d3?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-materiali">
            <h2>Materiali del Corso</h2>
            <div class="pdf-download">
                <a href="https://chakraclearing.it/wp-content/uploads/2021/02/angeli_in_te.pdf"
                   target="_blank" class="bottone-download">
                    Scarica "Gli Angeli in Te" (PDF)
                </a>
            </div>
        </div>
    </div>
`,
        giorno6: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Giorno 6 - Chakra delle Orecchie</h1>

        <div class="sezione-video">
            <h2>Video del Corso</h2>

            <div class="video-item">
                <h4>1. Meditazione del Mattino</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1fe7c9cd/30287395c72e6ffd?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>2. Meditazione della Sera</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1fe4c3f0/d220ab5aa15cd1d3?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>3. Chakra delle Orecchie: Caratteristiche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b51d1febcd25/2c6dad2d9e83d92f?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>4. Chakra delle Orecchie: Arcangelo Zadkiel</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1febccf0/53d764303f480256?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-materiali">
            <h2>Materiali del Corso</h2>
            <div class="pdf-download">
                <a href="https://chakraclearing.it/wp-content/uploads/2021/02/guarire_cuore_soffre.pdf"
                   target="_blank" class="bottone-download">
                    Scarica "Come Guarire un Cuore che Soffre" (PDF)
                </a>
            </div>
        </div>
    </div>
`,
        giorno7: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Giorno 7 - Chakra Terzo Occhio</h1>

        <div class="sezione-video">
            <h2>Video del Corso</h2>

            <div class="video-item">
                <h4>1. Chakra Terzo Occhio: Caratteristiche</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b51d1fe5c42e/82d73ba0e4de601c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>2. Chakra Terzo Occhio: Arcangeli Raziel e Haniel</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b51d1aefce8f/6ad269fd8bc46439?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>3. Chakra Terzo Occhio: Alimentazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b51d1fe5c7f9/188eaeef711f2bb6?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>4. Chakra Terzo Occhio: Pietre e Cristalli</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1fe5c05a/c8cd2b37b2667e2f?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>5. Chakra Terzo Occhio: Introduzione Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b51d1eeaca2e/0bd9f6573b882d31?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>6. Chakra Terzo Occhio: Meditazione</h4>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b51d1eeac8c4/c4da5d2964e55e02?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-meditazione">
            <h2>Meditazioni Quotidiane</h2>

            <div class="grid-meditazioni">
                <div class="meditazione-box">
                    <h3>Meditazione del Mattino</h3>
                    <div class="video-meditazione">
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1fe7c9cd/30287395c72e6ffd?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="300" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="meditazione-box">
                    <h3>Meditazione della Sera</h3>
                    <div class="video-meditazione">
                        <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1fe4c3f0/d220ab5aa15cd1d3?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="300" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>

        <div class="sezione-materiali">
            <h2>Materiali del Corso</h2>
            <div class="pdf-download">
                <a href="https://chakraclearing.it/wp-content/uploads/2021/02/angel_detox.pdf"
                   target="_blank" class="bottone-download">
                    Scarica "Angel Detox" (PDF)
                </a>
            </div>
        </div>
    </div>
`,
        giorno8: `
            <div class="corso-container">
                <h1 class="titolo-giorno">Giorno 8 - Chakra Corona</h1>

                <div class="sezione-video">
                    <h2>Video del Corso</h2>

                    <div class="video-item">
                        <h4>1. Chakra Corona: Caratteristiche</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ac91d6b51d1fe5c325/9affa3ee26bd9b55?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>2. Chakra Corona: Arcangelo Michele</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1fe5c2f0/446665838135cc8f?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>3. Chakra Corona: Alimentazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1fe6c8cd/7a44cdcf04e962ec?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>4. Chakra Corona: Pietre e Cristalli</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/1191d6b51d1fe6c998/7ffdc4c67ce3cd97?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>5. Chakra Corona: Introduzione Meditazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/ac91d6b51d1eeacd25/74e797fd73a805ea?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>6. Chakra Corona: Meditazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1ee5cacd/4e10440fc9f7a367?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="video-item">
                        <h4>7. Chakra Energy: Consigli di Integrazione</h4>
                        <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1fe6c35a/e2e82b14f79b2cbe?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="sezione-bonus">
                    <h2>Meditazioni Quotidiane</h2>

                    <div class="bonus-item">
                        <h3>Meditazione del Mattino</h3>
                        <iframe src="https://videos.sproutvideo.com/embed/4491d6b51d1fe7c9cd/30287395c72e6ffd?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="bonus-item">
                        <h3>Meditazione della Sera</h3>
                        <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1fe4c3f0/d220ab5aa15cd1d3?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="sezione-materiali">
                    <h2>Materiali del Corso</h2>
                    <div class="pdf-download">
                        <a href="https://chakraclearing.it/wp-content/uploads/2021/03/Crystal_Therapy.pdf"
                           target="_blank" class="bottone-download">
                            Scarica Crystal Therapy (PDF)
                        </a>
                    </div>
                </div>

                <div class="sezione-bonus-video">
                    <h2>Video Bonus</h2>

                    <div class="bonus-video-item">
                        <h3>Come Equilibrare i Chakra</h3>
                        <iframe src="https://videos.sproutvideo.com/embed/7091d6b51d1fe6c4f9/71e338524c38b625?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="bonus-video-item">
                        <h3>Angeli e Chakra</h3>
                        <iframe src="https://videos.sproutvideo.com/embed/0691d6b51d1fe6c28f/a51a4ec8ad367952?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>

                    <div class="bonus-video-item">
                        <h3>Come Armonizzare i Chakra</h3>
                        <iframe src="https://videos.sproutvideo.com/embed/ac91d6b51d1fe6c025/ddeaade8a547b040?playerTheme=dark&playerColor=2f3437"
                                width="100%" height="500" frameborder="0"
                                allow="autoplay; fullscreen" allowfullscreen>
                        </iframe>
                    </div>
                </div>
            </div>
        `,
        giorno9: `
    <div class="corso-container">
        <h1 class="titolo-giorno">Il Potere dei Cristalli</h1>

        <div class="sezione-video">
            <h2>Video del Corso</h2>

            <div class="video-item">
                <h4>1. Come scegliere il tuo cristallo</h4>
                <iframe src="https://videos.sproutvideo.com/embed/7991d6b51d1ee5c3f0/0f3e87dbf6c3b0fe?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>2. Scopri il potere dei cristalli</h4>
                <iframe src="https://videos.sproutvideo.com/embed/0691d6b51d1ee5c08f/28a7a3bd90198f8c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>3. Consigli di cristalloterapia per migliorare la tua vita sentimentale</h4>
                <iframe src="https://videos.sproutvideo.com/embed/ac91d6b51d1ee5c225/7a0b0297c33ea766?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="video-item">
                <h4>4. Prepara e carica il tuo cristallo</h4>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1ee5c15a/bf18e46a4b7d2f08?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-bonus">
            <h2>Pietre e Cristalli per i Chakra</h2>

            <div class="bonus-item">
                <h3>Chakra Radice: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1ce1c75a/eede02b9cd14a1f8?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="bonus-item">
                <h3>Chakra Sacrale: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/a791d6b51d1ce0c22e/52f4aac45c70940c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="bonus-item">
                <h3>Chakra Plesso Solare: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b51d1feac598/f1e4f21c299b2fa2?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="bonus-item">
                <h3>Chakra del Cuore: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/ea91d6b51d1febcb63/e8a71a3c70b7cc9c?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="bonus-item">
                <h3>Chakra della Gola: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/4d91d6b51d1feac9c4/16bb1fe2077c7f31?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="bonus-item">
                <h3>Chakra delle Orecchie: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/7091d6b51d1fe4c6f9/5d783d81182f5715?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="bonus-item">
                <h3>Chakra Terzo Occhio: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/d391d6b51d1fe5c05a/c8cd2b37b2667e2f?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>

            <div class="bonus-item">
                <h3>Chakra Corona: Pietre e Cristalli</h3>
                <iframe src="https://videos.sproutvideo.com/embed/1191d6b51d1fe6c998/7ffdc4c67ce3cd97?playerTheme=dark&playerColor=2f3437"
                        width="100%" height="500" frameborder="0"
                        allow="autoplay; fullscreen" allowfullscreen>
                </iframe>
            </div>
        </div>

        <div class="sezione-materiali">
            <h2>Materiali del Corso</h2>
            <div class="pdf-download">
                <a href="https://chakraclearing.it/wp-content/uploads/2021/02/guida-cristalli.pdf"
                   target="_blank" class="bottone-download">
                    Scarica la Guida ai Cristalli (PDF)
                </a>
            </div>
        </div>
    </div>
`

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
        .sezione-video, .sezione-materiali, .sezione-meditazione {
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
        .pdf-download, .audio-download {
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
        audio {
            margin: 20px auto;
            display: block;
        }
    </style>
    `;

    // Codice base della pagina (struttura HTML)
    let codicePagina = `
        ${style}
        <div id="container">
            <div id="menu">
                <button id="giorno1">Giorno 1</button>
                <button id="giorno1Sera">Giorno 1 Sera</button>
                <button id="giorno2">Giorno 2</button>
                <button id="giorno3">Giorno 3</button>
                <button id="giorno4">Giorno 4</button>
                <button id="giorno5">Giorno 5</button>
                <button id="giorno6">Giorno 6</button>
                <button id="giorno7">Giorno 7</button>
                <button id="giorno8">Giorno 8</button>
                <button id="giorno9">Giorno 9</button>
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