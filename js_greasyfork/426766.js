// ==UserScript==
// @name            Discovery Plus Search Video Streams
// @namespace       https://andrealazzarotto.com/
// @version         1.3
// @description     Search for videos on Discovery Plus
// @author          Andrea Lazzarotto
// @match           https://www.discoveryplus.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/foundation-essential/6.2.2/js/foundation.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require         https://unpkg.com/@ungap/from-entries@0.1.2/min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @connect         disco-api.discoveryplus.com
// @connect         discoveryplus.com
// @downloadURL https://update.greasyfork.org/scripts/426766/Discovery%20Plus%20Search%20Video%20Streams.user.js
// @updateURL https://update.greasyfork.org/scripts/426766/Discovery%20Plus%20Search%20Video%20Streams.meta.js
// ==/UserScript==

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

function fetchJSON(params) {
    return fetch(params).then(data => JSON.parse(data.responseText));
}

(function() {
    'use strict';

    var fetchList = () => {
        fetchJSON({
            'method': 'GET',
            'url': 'https://eu1-prod-direct.discoveryplus.com/cms/routes' + location.pathname.slice(3) + '?include=default',
        }).then(data => {
            var collections = data.included.filter(el => el.attributes && el.attributes.component && el.attributes.component.id.indexOf('tabbed') >= 0);
            var seasons = collections[0] || null;
            var filtered = data.included.filter(el => el.type === 'video' && !el.attributes.drmEnabled);
            console.log(filtered);
            showResults(seasons, filtered);
        });
    };


    var getSeason = async (seasons, selected) => {
        console.log(seasons);
        console.log(selected);

        var finalized = [];
        var pages = 1;
        for (var i = 1; i <= pages; i++) {
            var url = 'https://eu1-prod-direct.discoveryplus.com/cms/collections/' + seasons.id + '?decorators=viewingHistory&include=default&page[items.number]=' + i + '&' + selected.parameter;
            if (seasons.attributes.component.mandatoryParams) {
                url = url + '&' + seasons.attributes.component.mandatoryParams;
            }
            console.log(url);
            var single_page = await fetchJSON({
                'method': 'GET',
                'url': url,
            }).then(data => {
                var pages = data.meta.itemsTotalPages;
                var filtered = data.included.filter(el => el.type === 'video' && !el.attributes.drmEnabled);
                return {
                    filtered: filtered,
                    pages: pages,
                };
            });
            pages = single_page.pages;
            finalized = finalized.concat(single_page.filtered);
        }

        showResults(null, finalized);
    };

    var showResults = (seasons, results) => {
        $('#video-results').remove();
        $('#video-result').remove();
        if (!results.length && !seasons) {
            return alert('Non sono stati trovati risultati!');
        }

        var container = $('<div id="video-results"></div>').css({
            'position': 'fixed',
            'top': '50%',
            'left': '50%',
            'width': '90vw',
            'max-height': '90vh',
            'overflow': 'auto',
            'transform': 'translate(-50%, -50%)',
            'background': 'inherit',
            'color': 'white',
            'font-family': 'Roboto, Helvetica, sans-serif',
            'box-shadow': '0 0 2rem 2rem rgba(0, 0, 0, 0.5), 0 0 0 200vw rgba(0, 0, 0, 0.25)',
            'z-index': '9100',
            'padding': '3rem',
            'display': 'grid',
            'grid-template-columns': '1fr 1fr 1fr 1fr',
            'gap': '0.5rem 0.5rem',
        }).appendTo('body');

        if (seasons) {
            var options = seasons.attributes.component.filters[0].options || [];
            if (options.length) {
                container.append($('<h2>Stagioni</h2>'));

                options.forEach(element => {
                    var thing = $('<div class="season-download"></div>');
                    thing.append('<span>Stagione ' + element.value + '</span>');
                    thing.css({
                        'padding': '0.25rem 0.5rem',
                        'border-radius': '0.25rem',
                        'background-color': 'rgba(255, 255, 255, 0.1)',
                        'cursor': 'pointer',
                    });
                    thing.click(() => {
                        getSeason(seasons, element);
                    });

                    container.append(thing);
                });
            }
        }

        container.append($('<h2>Filmati</h2>'));
        results.sort((a,b) => { return b.id - a.id });
        results.forEach(element => {
            var thing = $('<div class="element-download"></div>');
            thing.append('<span>' + element.attributes.name + '</span>');
            thing.css({
                'padding': '0.25rem 0.5rem',
                'border-radius': '0.25rem',
                'background-color': 'rgba(255, 255, 255, 0.1)',
                'cursor': 'pointer',
            });
            thing.click(() => {
                downloadResult(element);
            });

            container.append(thing);
        });

        var close = $('<button>Chiudi</button>').css({
            'position': 'absolute',
            'top': '1rem',
            'right': '1rem',
            'background': '#2175d9',
            'color': 'white',
            'font-family': 'Roboto, Helvetica, sans-serif',
            'padding': '0.5rem',
        }).click(() => {
            $('#video-results').remove();
        });
        container.append(close);

        container.find('h2').css({
            'grid-column': '1 / span 4',
            'margin': '.5rem 0',
        });
    };

    var downloadResult = (element) => {
        $('#video-result').remove();
        console.log(element);

        console.log('https://eu1-prod-direct.discoveryplus.com/playback/v2/videoPlaybackInfo/' + element.id);

        fetchJSON({
            'method': 'GET',
            'url': 'https://eu1-prod-direct.discoveryplus.com/playback/v2/videoPlaybackInfo/' + element.id,
        }).then(data => {
            var streaming = data.data ? data.data.attributes.streaming : null;
            if (!(streaming && streaming.hls)) {
                return alert('Video non scaricabile!');
            }

            var container = $('<div id="video-result"></div>').css({
                'position': 'fixed',
                'top': '50%',
                'left': '50%',
                'width': '70vw',
                'transform': 'translate(-50%, -50%)',
                'background': 'inherit',
                'color': 'white',
                'font-family': 'Roboto, Helvetica, sans-serif',
                'box-shadow': '0 0 2rem 2rem rgba(0, 0, 0, 0.5), 0 0 0 200vw rgba(0, 0, 0, 0.25)',
                'z-index': '9100',
                'padding': '3rem',
            }).appendTo('body');

            $('<h1>Scarica "' + element.attributes.name + '"</h1>').css({
                'font-size': '1.5rem',
                'margin-bottom': '1rem',
            }).appendTo(container);
            container.append('<p>Copia questo codice nel programma Youtube-DL:');
            $('<pre><code>' + streaming.hls.url + '</code></pre>').css({
                'padding': '1rem',
                'font-family': 'monospace',
                'white-space': 'pre-wrap',
                'margin-top': '1rem',
            }).appendTo(container);;

            var close = $('<button>Chiudi</button>').css({
                'position': 'absolute',
                'top': '1rem',
                'right': '1rem',
                'background': '#2175d9',
                'color': 'white',
                'font-family': 'Roboto, Helvetica, sans-serif',
                'padding': '0.5rem',
            }).click(() => {
                $('#video-result').remove();
            });
            container.append(close);
        });
    };

    var button = $('<div id="fetcher"><button>Cerca video</button></div>');
    button.css({
        'position': 'fixed',
        'bottom': '1rem',
        'right': '1rem',
        'z-index': '9099',
    });
    button.find('button').css({
        'font-size': '1rem',
        'background': '#2175d9',
        'color': 'white',
        'font-family': 'Roboto, Helvetica, sans-serif',
        'padding': '0.5rem',
    }).click(fetchList);
    button.appendTo('body');
})();