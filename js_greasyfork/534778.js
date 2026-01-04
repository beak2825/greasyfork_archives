// ==UserScript==
// @name         Assistente de Upload - ASC
// @namespace    http://tampermonkey.net/
// @author       wastaken
// @version      1.5
// @description  .
// @match        https://cliente.amigos-share.club/enviar-filme.php
// @match        https://cliente.amigos-share.club/enviar-series.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534778/Assistente%20de%20Upload%20-%20ASC.user.js
// @updateURL https://update.greasyfork.org/scripts/534778/Assistente%20de%20Upload%20-%20ASC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let metaData = null;

    // Faz com que a página só aceite arquivos .torrent no campo do torrent (em vez de aceitar qualquer arquivo)
    const input = document.querySelector('input[type="file"]#torrent');
    if (input) {
        input.setAttribute('accept', '.torrent');
    }

    function createFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.style.display = 'none';
        fileInput.id = 'metaJsonInput';

        const labelButton = document.createElement('label');
        labelButton.setAttribute('for', 'metaJsonInput');
        labelButton.textContent = 'Carregar meta.json';
        labelButton.style.cursor = 'pointer';
        labelButton.style.display = 'inline-block';
        labelButton.style.padding = '10px 10px';
        labelButton.style.margin = '0px 30px';
        labelButton.style.fontSize = '14px';
        labelButton.style.fontWeight = 'bold';
        labelButton.style.color = '#fff';
        labelButton.style.backgroundColor = '#007bff';
        labelButton.style.border = 'none';
        labelButton.style.borderRadius = '.25rem';
        labelButton.style.transition = 'background-color 0.3s ease';
        labelButton.onmouseover = () => labelButton.style.backgroundColor = '#0056b3';
        labelButton.onmouseout = () => labelButton.style.backgroundColor = '#007bff';

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const text = await file.text();
                metaData = JSON.parse(text);
                preencherFormulario(metaData);
            }
        });

        // Insere ao lado de "Layout"
        const header = document.querySelector('body div.container-fluid div.row div.col-sm-10.col-md-10.col-lg-10.p-2.mb-5 div.card div.card-body form div.input-group.mb-3');

        if (header) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.justifyContent = 'flex-end';
            container.style.alignItems = 'center';
            container.style.gap = '0.5rem';

            container.appendChild(fileInput);
            container.appendChild(labelButton);

            header.appendChild(container);
        }
    }

    function preencherFormulario(meta) {
        // IMDB
        const imdbID = metaData.imdb_id
        ? `tt${String(metaData.imdb_id).padStart(7, '0')}`
        : null;

        const imdbInput = Array.from(document.querySelectorAll('input#imdb.form-control'))
        .find(el => el.classList.contains('col-sm-1') || el.classList.contains('col-sm-2'));

        if (imdbID && imdbInput) {
            imdbInput.value = imdbID;
        }

        // Pressiona o botão "Buscar" após preencher o IMDB
        document.querySelector('button#encontrar.btn.btn-info')?.click();
        // Atraso de 1500 milissegundos (1.5 segundos)
        // Tempo necessário para esperar o site fazer a busca do IMDb antes de continuar
        // Se não houver um atraso, o script não preenche corretamente o episódio/temporada no nome
        const TempoDeEspera = 1500

        setTimeout(() => {
        // Resolução
            const larguraInput = document.querySelector('input#largura.form-control.col-sm-2');
            const alturaInput = document.querySelector('input#altura.form-control.col-sm-2');
            const videoTrack = meta?.mediainfo?.media?.track?.find(track => track["@type"] === "Video");
            const TipoDeDisco = meta?.is_disc;

            let largura = null;
            let altura = null;

            if (TipoDeDisco === 'BDMV') {
                const resolucao = meta?.resolution;
                switch (resolucao) {
                    case '4320p':
                        largura = 7680;
                        altura = 4320;
                        break;
                    case '2160p':
                        largura = 3840;
                        altura = 2160;
                        break;
                    case '1080p':
                    case '1080i':
                        largura = 1920;
                        altura = 1080;
                        break;
                    case '720p':
                        largura = 1280;
                        altura = 720;
                        break;
                    case '576p':
                    case '576i':
                        largura = 720;
                        altura = 576;
                        break;
                    case '480p':
                    case '480i':
                        largura = 720;
                        altura = 480;
                        break;
                }
            } else if (videoTrack) {
                largura = videoTrack.Width || null;
                altura = videoTrack.Height || null;
            }

            if (larguraInput && largura !== null) {
                larguraInput.value = largura;
            }
            if (alturaInput && altura !== null) {
                alturaInput.value = altura;
            }

            // Idioma
            const idiomaMap = {
                "en": "1", "fr": "2", "de": "3", "it": "4", "ja": "5", "es": "6", "ru": "7", "pt": "8",
                "zh": "10", "da": "12", "sv": "13", "fi": "14", "bg": "15", "no": "16", "nl": "17",
                "pl": "19", "ko": "20", "th": "21", "hi": "23", "tr": "25"
            };

            const langCode = (meta.original_language || "").toLowerCase();
            const idiomaValue = idiomaMap[langCode] || "11"; // 11 = Outros
            document.querySelector('select[name="lang"]').value = idiomaValue;


            // Tipo (Qualidade)
            const qualidadeSelect = document.querySelector('select[name="qualidade"]');
            const tipo = meta.type;
            if (tipo === 'DISC') {
                const size = meta.torrent_comments[0].size;
                let value = "40"; // BD25
                if (size > 66000000000) value = "43"; // BD100
                else if (size > 50000000000) value = "42"; // BD66
                else if (size > 25000000000) value = "41"; // BD50
                qualidadeSelect.value = value;
            } else {
                const map = {
                    "ENCODE": "9", // Blu-Ray
                    "REMUX": "39", // BD-REMUX
                    "WEBDL": "23", // WEB-DL
                    "WEBRIP": "38", // WEB-RIP
                    "BDRIP": "8" // BDRip
                };
                qualidadeSelect.value = map[tipo] || "0";
            }

            // Tipo de áudio
            // Extrair faixas de áudio do meta.bdinfo ou meta.mediainfo
            let audioTracks = [];

            if (meta.bdinfo && Array.isArray(meta.bdinfo.audio)) {
                // Formato do bdinfo
                audioTracks = meta.bdinfo.audio;
            } else if (
                meta.mediainfo &&
                meta.mediainfo.media &&
                Array.isArray(meta.mediainfo.media.track)
            ) {
                // Formato do mediainfo
                audioTracks = meta.mediainfo.media.track.filter(t => t['@type'] === 'Audio').map(t => ({
                    language: t.Language === 'pt' ? 'Portuguese' : t.Language === 'en' ? 'English' : t.Language
                }));
            }


            // Manipula o fórmulario de acordo com o tipo de envio, ep individual / temporada completa
            const category = meta.category;
            const nameInput = document.querySelector('input#name.form-control.col-sm-5');
            if (nameInput && nameInput.value.trim() !== ''){
                if (category === 'TV') {
                    const tvPack = meta.tv_pack;

                    if (nameInput && meta.season) {
                        const seasonNumber = meta.season

                        if (tvPack === 1) {
                            // Temporada completa: adiciona " - S01"
                            nameInput.value = `${nameInput.value.trim()} - ${seasonNumber}`;
                        } else if (tvPack === 0 && meta.episode) {
                            // Episódio individual: adiciona " - S01E01"
                            const episodeNumber = meta.episode
                            nameInput.value = `${nameInput.value.trim()} - ${seasonNumber}${episodeNumber}`;
                        }
                    }
                }
            }

            // Verifica se há áudio em português e se há outros idiomas
            const portugueseVariants = ["pt", "portuguese", "português", "pt-br", "pt_pt"];

            const hasPortuguese = audioTracks.some(track => {
                const lang = (track.language || "").toLowerCase();
                return portugueseVariants.some(variant => lang.includes(variant));
            });

            const otherLanguages = audioTracks.filter(track => {
                const lang = (track.language || "").toLowerCase();
                return !portugueseVariants.some(variant => lang.includes(variant));
            });

            const originalLanguage = (meta.original_language || "").toLowerCase();

            let tipoAudioValue = "1"; // Legendado por padrão

            if (hasPortuguese && originalLanguage === "pt") {
                tipoAudioValue = "4"; // Nacional
            } else if (hasPortuguese && otherLanguages.length > 0) {
                tipoAudioValue = "2"; // Dual-Audio
            } else if (!hasPortuguese) {
                tipoAudioValue = "1"; // Legendado
            }

            document.querySelector('#audio').value = tipoAudioValue;

            // Extensão
            const extSelect = document.querySelector('select[name="extencao"]');
            const fullText = JSON.stringify(meta).toLowerCase();
            if (meta.is_disc === "BDMV") {
                extSelect.value = "5";
            } else if (fullText.includes(".mkv")) {
                extSelect.value = "6";
            } else if (fullText.includes(".mp4")) {
                extSelect.value = "8";
            }



            // Codec de áudio por texto
            const cleanName = meta.clean_name || "";
            const audioCodecSelect = document.querySelector('select[name="codecaudio"]');
            if (cleanName.includes("Atmos")) {
                audioCodecSelect.value = "43";
            } else if (cleanName.includes("DD+") && !cleanName.includes("Atmos")) {
                audioCodecSelect.value = "26";
            } else if (cleanName.includes("DD") && !cleanName.includes("+")) {
                audioCodecSelect.value = "11";
            } else if (cleanName.includes("AAC")) {
                audioCodecSelect.value = "10";
            } else if (cleanName.includes("DTS:X")) {
                audioCodecSelect.value = "25";
            } else if (cleanName.includes("DTS-HD MA")) {
                audioCodecSelect.value = "24";
            } else if (cleanName.includes("DTS-HD")) {
                audioCodecSelect.value = "23";
            } else if (cleanName.includes("DTS")) {
                audioCodecSelect.value = "12";
            } else if (cleanName.includes("FLAC")) {
                audioCodecSelect.value = "13";
            } else if (cleanName.includes("LPCM")) {
                audioCodecSelect.value = "21";
            } else if (cleanName.includes("MPEG")) {
                audioCodecSelect.value = "17";
            } else if (cleanName.includes("TrueHD")) {
                audioCodecSelect.value = "29";
            }

            // Screenshots
            const screenshots = (meta.image_list || []).slice(0, 4).map(i => i.raw_url);
            for (let i = 0; i < screenshots.length; i++) {
                const input = document.querySelector(`#screens${i + 1}.form-control.col-sm-3`);
                if (input) input.value = screenshots[i];
            }

            // Trailer do YouTube
            if (meta.youtube) {
                document.querySelector('input#tube.form-control.col-sm-5').value = meta.youtube;
            }

            // Codec de vídeo
            const codecMap = {
                "MPEG-4": "31", "AV1": "29", "AVC": "30", "AVC-HDR": "32", "DivX": "9", "H264": "17",
                "H265": "18", "H265 - HDR": "28", "H265 - SDR": "25", "HEVC": "27", "HVC1": "26",
                "M4V": "20", "MPEG-1": "10", "MPEG-2": "11", "Outros": "16", "RMVB": "12", "VC-1": "21",
                "VP6": "22", "VP9": "23", "WMV": "13", "XviD": "15"
            };

            const codecVideo = meta.video_codec;
            const codecSelect = document.querySelector('select[name="codecvideo"]');
            codecSelect.value = codecMap[codecVideo] || "16";

            // Verifica HDR para AVC e HEVC
            const hasHDR = videoTrack?.HDR_Format_String?.toUpperCase().includes("HDR");

            if (hasHDR) {
                if (codecVideo === "HEVC") {
                    codecSelect.value = "28";
                } else if (codecVideo === "AVC") {
                    codecSelect.value = "32";
                }
            }
        }, TempoDeEspera);
    }

    createFileInput();
})();
