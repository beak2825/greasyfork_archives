// ==UserScript==
// @name         Assistente de Upload - BT
// @namespace    http://tampermonkey.net/
// @author       wastaken
// @version      1.7
// @description  .
// @match        https://brasiltracker.org/upload.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534814/Assistente%20de%20Upload%20-%20BT.user.js
// @updateURL https://update.greasyfork.org/scripts/534814/Assistente%20de%20Upload%20-%20BT.meta.js
// ==/UserScript==

let EnvioAnônimo = true; // Caso não queira enviar os torrents de forma anônima por padrão, mude true para false

const anonBtn = document.querySelector('input#anonymous');
if (anonBtn && EnvioAnônimo) {
    if (!anonBtn.checked) {
        anonBtn.click();
    }
}

(function () {
    'use strict';

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function createButton(label) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.marginRight = '10px';
        button.style.padding = '2px 15px 2px 15px';
        button.type = 'button';
        return button;
    }

    const metaInput = document.createElement('input');
    metaInput.type = 'file';
    metaInput.accept = 'application/json';
    metaInput.style.display = 'none';

    const mediaInfoInput = document.createElement('input');
    mediaInfoInput.type = 'file';
    mediaInfoInput.accept = '.txt';
    mediaInfoInput.style.display = 'none';

    const metaBtn = createButton('Carregar meta.json', 10);
    const mediaBtn = createButton('Carregar MEDIAINFO.txt ou BD_SUMMARY_EXT_00.txt', 50);

    const table = document.querySelector('table.layout.border');
    if (table) {
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.marginBottom = '10px';
        container.appendChild(metaBtn);
        container.appendChild(mediaBtn);
        table.parentNode.insertBefore(container, table.nextSibling);
    }

    document.body.appendChild(metaInput);
    document.body.appendChild(mediaInfoInput);

    let metaData = null;
    let mediaInfoText = '';
    let metaReady = false;

    metaBtn.onclick = () => metaInput.click();
    mediaBtn.onclick = () => mediaInfoInput.click();

    metaInput.addEventListener('change', async function () {
        const file = metaInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async function (event) {
            try {
                metaData = JSON.parse(event.target.result);
                metaReady = true;
                await preencherFormComMeta();
                if (mediaInfoText) {
                    preencherMediaInfo();
                }
            } catch (e) {
                console.error("Erro ao carregar ou parsear meta.json:", e);
                alert("Erro ao carregar ou parsear meta.json. Verifique o formato do arquivo.");
            }
        };
        reader.readAsText(file);
    });

    mediaInfoInput.addEventListener('change', async function () {
        const file = mediaInfoInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async function (event) {
            mediaInfoText = event.target.result.trim();
            preencherMediaInfo();
            if (metaReady) preencherScreens();
        };
        reader.readAsText(file);
    });

    async function preencherFormComMeta() {
        if (!metaData) return;

        // Categoria (Movie/TV)
        const category = metaData.category;
        const categorySelect = document.querySelector('#categories');
        if (categorySelect) {
            const valueMap = { MOVIE: '0', TV: '1' };
            const value = valueMap[category];
            if (value !== undefined) {
                categorySelect.value = value;
                categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        await waitForElement('#bitrate');

        // IMDb
        const imdbID = metaData.imdb_id ?
            `tt${String(metaData.imdb_id).padStart(7, '0')}` :
            null;

        const imdbInput = document.querySelector('#imdb_input');
        if (imdbID && imdbInput) {
            imdbInput.value = imdbID;
            imdbInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Qualidade
        const type = metaData.type;
        const size = metaData.torrent_comments?.[0]?.size || 0;
        const bitrateSelect = document.querySelector('#bitrate');

        if (bitrateSelect && type) {
            if (category === 'MOVIE') {
                if (type === 'DISC') {
                    if (size < 25000000000) bitrateSelect.value = 'BD25';
                    else if (size < 50000000000) bitrateSelect.value = 'BD50';
                    else if (size < 66000000000) bitrateSelect.value = 'BD66';
                    else if (size < 100000000000) bitrateSelect.value = 'BD100';
                } else {
                    const movieTypeMap = {
                        'ENCODE': 'Blu-ray',
                        'REMUX': 'Remux',
                        'WEBDL': 'WEB-DL',
                        'WEBRIP': 'WEBRip',
                        'BDRIP': 'BDRip',
                        'HDTV': 'HDTV',
                        'DVDRIP': 'DVDRip'
                    };
                    bitrateSelect.value = movieTypeMap[type] || '';
                }
            } else if (category === 'TV') {
                const tvTypeMap = {
                    'ENCODE': 'Blu-ray',
                    'WEBDL': 'WEB-DL',
                    'WEBRIP': 'WEBRip',
                    'HDTV': 'HDTV',
                    'DVDRIP': 'DVDRip',
                    'REMUX': 'Remux',
                    'BDRIP': 'BDRip'
                };
                bitrateSelect.value = tvTypeMap[type] || '';
            }
            bitrateSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Manipula o fórmulario de acordo com o tipo de envio, ep individual / temporada completa
        if (category === 'TV') {
            const tvPack = metaData.tv_pack;
            const tipoSelect = document.querySelector('select#tipo');
            const seasonInput = document.querySelector('input#temporada');
            const seasonEInput = document.querySelector('input#temporada_e');
            const episodeInput = document.querySelector('input#episodio');

            if (tipoSelect) {
                if (tvPack === 1) {
                    tipoSelect.value = 'completa';
                    tipoSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    if (seasonInput && metaData.season) {
                        const seasonNumber = metaData.season.replace(/^S0*/i, ''); // Remove 'S' e os leading zeros
                        seasonInput.value = seasonNumber;
                        seasonInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else if (tvPack === 0) {
                    tipoSelect.value = 'ep_individual';
                    tipoSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    if (seasonEInput && metaData.season) {
                        const seasonNumber = metaData.season.replace(/^S0*/i, ''); // Remove 'S' e os leading zeros
                        seasonEInput.value = seasonNumber;
                        seasonEInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    if (episodeInput && metaData.episode) {
                        const episodeNumber = metaData.episode.replace(/^E0*/i, ''); // Remove 'E' e os leading zeros
                        episodeInput.value = episodeNumber;
                        episodeInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }
        }

        // Preencher campo YouTube (trailer)
        const youtubeURL = metaData.youtube;
        const youtubeInput = document.querySelector('input#youtube');
        if (youtubeURL && youtubeInput) {
            youtubeInput.value = youtubeURL;
            youtubeInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Mapeamento de codec de vídeo
        const codecMap = {
            'AVC': 'H.264',
            'H.264': 'H.264',
            'H.265': 'H.265',
            'H.265 HDR': 'H.265 HDR',
            'MPEG-1': 'MPEG-1',
            'MPEG-2': 'MPEG-2',
            'VC-1': 'VC-1',
            'VP9': 'VP9',
            'DivX': 'DivX',
            'XviD': 'XviD',
            'x264': 'x264',
            'x265': 'x265',
            'x265 HDR': 'x265 HDR',
            'Outro': 'Outro'
        };

        const codecRaw = metaData.video_codec;
        const normalizedCodec = codecMap[codecRaw] || 'Outro';
        const codecSelect = document.querySelector('select#video_c');
        if (codecSelect) {
            codecSelect.value = normalizedCodec;
            codecSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

    }

    // Alguns codecs de áudio / resolução do BDinfo o site não detecta sozinho, a função abaixo faz a detecção necessária
    function preencherMediaInfo() {
        const mediaArea = document.querySelector('textarea#mediainfo');
        if (mediaArea && mediaInfoText) {
            const textoCorrigido = mediaInfoText
            .replace(/VC-1 Video/g, 'VC-1')
            .replace(/Portuguese \(BR\)/g, 'Portuguese'); // O site não detecta corretamente no MediaInfo a expressão 'Portuguese (BR)', " (BR)" precisa ser removido
            mediaArea.value = textoCorrigido;
            mediaArea.dispatchEvent(new Event('change', { bubbles: true }));

            const audioCodecSelect = document.querySelector('select#audio_c');
            if (audioCodecSelect) {
                // Verifica "Dolby TrueHD Audio" ou "Dolby TrueHD/Atmos Audio"
                if (/Dolby TrueHD(?:\/Atmos)? Audio/.test(textoCorrigido)) {
                    const option = Array.from(audioCodecSelect.options).find(opt => opt.value === 'TrueHD');
                    if (option) {
                        audioCodecSelect.value = 'TrueHD';
                        audioCodecSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Verifica "DTS-ES Audio"
                else if (/DTS-ES Audio/.test(textoCorrigido)) {
                    const option = Array.from(audioCodecSelect.options).find(opt => opt.value === 'DTS-ES');
                    if (option) {
                        audioCodecSelect.value = 'DTS-ES';
                        audioCodecSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Verifica "DTS:X"
                else if (/DTS:X/.test(textoCorrigido)) {
                    const option = Array.from(audioCodecSelect.options).find(opt => opt.value === 'DTS-X');
                    if (option) {
                        audioCodecSelect.value = 'DTS-X';
                        audioCodecSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Verifica "LPCM Audio"
                else if (/LPCM Audio/.test(textoCorrigido)) {
                    const option = Array.from(audioCodecSelect.options).find(opt => opt.value === 'PCM');
                    if (option) {
                        audioCodecSelect.value = 'PCM';
                        audioCodecSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Verifica "AAC"
                else if (/AAC/.test(textoCorrigido)) {
                    const option = Array.from(audioCodecSelect.options).find(opt => opt.value === 'AAC');
                    if (option) {
                        audioCodecSelect.value = 'AAC';
                        audioCodecSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }

            // Preenche a resolução
            // Por conta da expressão regular, essa regra só se aplica a BDinfo, envios que usam MediaInfo não são afetados
            const matchResolucao = textoCorrigido.match(/(1080|2160)p\s*\/\s*[\d.]+ fps\s*\//i);
            if (matchResolucao) {
                const altura = parseInt(matchResolucao[1], 10);
                let largura = null;
                if (altura === 1080) largura = 1920;
                else if (altura === 2160) largura = 3840;

                if (largura) {
                    const inputLargura = document.querySelector('input#resolucao_1');
                    const inputAltura = document.querySelector('input#resolucao_2');
                    if (inputLargura) {
                        inputLargura.value = largura;
                        inputLargura.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    if (inputAltura) {
                        inputAltura.value = altura;
                        inputAltura.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }
        }

        // Extrair faixas de áudio do meta.bdinfo ou meta.mediainfo
        let audioTracks = [];

        if (metaData.bdinfo && Array.isArray(metaData.bdinfo.audio)) {
        // Formato do bdinfo
            audioTracks = metaData.bdinfo.audio;
        } else if (
            metaData.mediainfo &&
            metaData.mediainfo.media &&
            Array.isArray(metaData.mediainfo.media.track)
        ) {
        // Formato do mediainfo
            audioTracks = metaData.mediainfo.media.track.filter(t => t['@type'] === 'Audio').map(t => ({
                language: t.Language === 'pt' ? 'Portuguese' : t.Language === 'en' ? 'English' : t.Language
            }));
        }

        // Verifica se há áudio em português, se há outros idiomas e se o idioma original é português
        const hasPortuguese = audioTracks.some(track => (track.language || "").toLowerCase().includes("pt"));
        const otherLanguages = audioTracks.filter(track => (track.language || "").toLowerCase() !== "pt");
        const originalLanguage = (metaData.original_language || "").toLowerCase();

        let tipoAudioValue = "Legendado";

        if (originalLanguage === "pt") {
            tipoAudioValue = "Nacional";
        } else if (hasPortuguese) {
            tipoAudioValue = "Dual Audio";
        } else if (!hasPortuguese) {
            tipoAudioValue = "Legendado";
        }

        document.querySelector('select#audio').value = tipoAudioValue;

    }

    function preencherScreens() {
        if (!metaData?.image_list?.length) return;
        const imageUrls = metaData.image_list.map(img => img.raw_url);
        const totalScreensNeeded = imageUrls.length;
        const screenContainer = document.querySelector('td#screenfield');
        const inputTemplate = screenContainer.querySelector('input[type="text"]');
        const existingInputs = screenContainer.querySelectorAll('input[type="text"]');
        let screensToCreate = totalScreensNeeded - existingInputs.length;

        for (let i = 0; i < screensToCreate; i++) {
            const newIndex = existingInputs.length + i;
            const lineBreak = document.createElement('br');
            const newInput = inputTemplate.cloneNode(true);

            newInput.id = `screen_${newIndex}`;
            newInput.name = 'screen[]';
            newInput.value = '';
            screenContainer.appendChild(lineBreak);
            screenContainer.appendChild(newInput);
        }

        const allScreenInputs = screenContainer.querySelectorAll('input[type="text"]');
        imageUrls.forEach((url, idx) => {
            if (allScreenInputs[idx]) {
                const input = allScreenInputs[idx];
                input.value = url;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
})();