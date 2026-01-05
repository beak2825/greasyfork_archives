// ==UserScript==
// @name            Rai Play video download
// @namespace       http://andrealazzarotto.com
// @version         11.4.2
// @description     This script allows you to download videos on Rai Play
// @description:it  Questo script ti permette di scaricare i video su Rai Play
// @author          Andrea Lazzarotto
// @match           https://www.raiplay.it/*
// @match           https://www.rainews.it/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/foundation-essential/6.2.2/js/foundation.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require         https://unpkg.com/@ungap/from-entries@0.1.2/min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @connect         rai.it
// @connect         akamaized.net
// @connect         akamaihd.net
// @connect         msvdn.net
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/2128/Rai%20Play%20video%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/2128/Rai%20Play%20video%20download.meta.js
// ==/UserScript==

var instance;

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest) {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}

function fetch(params) {
    return new Promise(function(resolve, reject) {
        params.onload = resolve;
        params.onerror = reject;
        GM_xmlhttpRequest(params);
    });
}

(function() {
    'use strict';

    var Foundation = window.Foundation;
    var download_icon = '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M42 40v4H6v-4h36zM20 24v-8h8v8h7L24 37 13 24h7zm8-14v4h-8v-4h8zm0-6v4h-8V4h8z" /></svg>';

    var showModal = (title, content) => {
        if (instance) {
            instance.close();
        }
        var modal = $(`
            <div id="video-download-modal" class="small reveal" data-reveal aria-labelledby="Download video">
                <h2 id="modal-title">${title}</h2>
                <div id="modal-content"></div>
                <button class="close-button" data-close aria-label="Chiudi finestrella" type="button">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
        modal.css({
            'padding': '2rem',
            'background-color': '#001623',
            'color': 'white',
        });
        modal.find('#modal-content').append(content);
        instance = new Foundation.Reveal(modal);
        instance.open();
        modal.find('.button').css({
            'margin-top': '1rem',
            'margin-right': '1rem',
            'font-weight': 'bold',
        });
        modal.find('.close-button').css({
            'color': 'white',
        }).click(() => instance.close());
        // Prevent fullscreen issues
        $(".vjs-fullscreen-control:contains('Exit')").click();
    };

    var checkQuality = (url, rate) => {
        return fetch({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'raiweb',
                'Range': 'bytes=0-255',
            },
        }).then(
            (response) => {
                let headers = fromEntries(response.responseHeaders.split("\n").map(element => element.trim().toLowerCase().split(":")));
                let range = headers['content-range'] || '/0';
                let size = +(range.split('/').slice(1,)[0] || 0);
                let megabytes = Math.round(size / 1024 / 1024);
                if (size > 102400) {
                    return { quality: rate, url: response.finalUrl, megabytes: megabytes };
                } else {
                    return null;
                }
            },
            () => null
        );
    }

    var modernQualities = async (relinker) => {
        let rates = [5000, 3200, 2401, 2400, 1800, 1500, 1200, 800, 600, 400, '*'];
        let promises = [];
        rates.forEach(rate => {
            var promise = checkQuality(relinker + "&overrideUserAgentRule=mp4-" + rate, rate);
            promises.push(promise);
        });
        const results = await Promise.all(promises);
        return results.filter(value => (value !== null));
    };

    var DRMError = () => {
        showModal('Niente da fare...', "<p>Non è stato possibile trovare un link del video in formato MP4. Il video sembra essere protetto da DRM.</p>");
    };

    var resolveRelinker = (relinker) => {
        return fetch({
            method: 'HEAD',
            url: relinker,
            headers: {
                'User-Agent': 'raiweb',
            },
        }).then(
            (response) => {
                let final = response.finalUrl;
                let valid = (final.indexOf('mp4') > 0 || final.indexOf('.m3u8') > 0) && final.indexOf('DRM_') < 0;
                if (!valid) {
                    DRMError();
                } else {
                    modernQualities(relinker).then(results => {
                        if (!results.length) {
                            showModal('Video MP4 non disponibili', '<p>Su questo contenuto non ci sono video in formato MP4 disponibili.<p><strong><a href="https://andrealazzarotto.com/2024/02/12/registrare-i-video-di-rai-play-usando-stacher/">Clicca qui</a> per imparare come registrarlo con Stacher.</strong>');
                            return;
                        }

                        var buttons = '';
                        results.forEach(video => {
                            buttons += `<a href="${video.url}" class="button" target="_blank">MP4 ${video.quality} (${video.megabytes} MB)</a>`;
                        });

                        showModal('Link diretti', `
                                <p>Clicca su una opzione per aprire il video in formato MP4. Usa il tasto destro del mouse per salvarlo, oppure copiare il link.</p>
                                <p><strong>Per evitare interruzioni è raccomandato l'uso di un download manager.</strong></p>
                                <p>${buttons}</p>`);
                    });
                }
            },
            (response) => {
                var drm = response.finalUrl.indexOf('DRM_') > 0 || response.status === 0;
                if (drm) {
                    DRMError();
                } else {
                    showModal('Errore di rete', "<p>Si è verificato un errore di rete. Riprova più tardi.</p>");
                }
            }
        );
    }

    var getVideo = () => {
        showModal('Attendere', '<p>Sto elaborando...</p>');

        var path = location.href.replace(/\.html(\?.*)?$/, '.json');
        $.getJSON(path).then((data) => {
            var secure = data.video.content_url.replace('http://', 'https://');
            return resolveRelinker(secure);
        });
    };

    var getRaiNewsVideo = (relinker) => {
        showModal('Attendere', '<p>Sto elaborando...</p>');
        return resolveRelinker(relinker);
    };

    var downloadButton = (container, action) => {
        if (container.find('.video-download-button').length) {
            return;
        }

        container.find('.vjs-custom-control-spacer').after(`
            <button class="video-download-button vjs-control vjs-button" aria-disabled="false">
                <span aria-hidden="true" class="vjs-icon-placeholder">${download_icon}</span>
                <span class="vjs-control-text" aria-live="polite">Download</span>
            </button>
        `);
        container.find('.video-download-button').css({
            'order': 110,
        }).click(action).find('svg').css({
            'fill': '#039cf9',
            'height': '1.5em',
        });
    };

    $(document).arrive('rai-player .vjs-custom-control-spacer', (element) => {
        var container = $(element).parent();
        downloadButton(container, getVideo);
    });

    $(document).arrive('rainews-player .vjs-custom-control-spacer', (element) => {
        let container = $(element).parent();
        let player = container.closest('rainews-player');
        let relinker = JSON.parse(player.attr("data")).mediapolis;
        downloadButton(container, () => {
            getRaiNewsVideo(relinker);
        });
    });

    var isAnon = function() {
        return !!$('#accountPanelLoginPanel').is(':visible');
    };

    $(document).ready(() => {
        if (location.pathname.startsWith('/video')) {
            $('rai-sharing').after(`
                <a id="inline-download-button" class="cell small-4 medium-shrink highlight__share" aria-label="Download">
                    <div class="leaf__share__button button button--light-ghost button--circle float-center">${download_icon}</div>
                    <span class="button-label">Download</span>
                </a>
            `);
            $('#inline-download-button').click(getVideo);
        }

        $('body').on('touchstart mousedown', 'a.card-item__link', (event) => {
            if (isAnon() && event.which !== 3) {
                location.href = $(event.currentTarget).attr('href');
            }
        });

        $('body').on('touchstart mousedown', 'button[data-video-json]', (event) => {
            if (isAnon() && event.which !== 3) {
                location.href = $(event.currentTarget).data('video-json').replace(/\.json/, '.html');
            }
        });
    });
})();