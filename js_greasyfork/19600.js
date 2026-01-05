// ==UserScript==
// @name         Geocaching Druckausgabe
// @namespace    https://www.geocaching.com/
// @version      0.6.2
// @description  Optimised print-view of the Geocaching-Cachedetails
// @author       Martin Jahn
// @match        https://www.geocaching.com/seek/cdpf.aspx?guid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19600/Geocaching%20Druckausgabe.user.js
// @updateURL https://update.greasyfork.org/scripts/19600/Geocaching%20Druckausgabe.meta.js
// ==/UserScript==

window.GCPRINT = {
    initialized: false,
    parsed: false,
    getCity: function(sCoords) {
        var aCoords;

        sCoords = sCoords.split('°').join('');
        sCoords = sCoords.split('.').join(' ');
        aCoords = sCoords.split(' ');

        var lat = Number(aCoords[1]) + Number(aCoords[2]) / 60 + Number(aCoords[3]) / 60000;
        if (aCoords[0] == 'S') {
            lat = 0 - lat;
        }

        var lon = Number(aCoords[5]) + Number(aCoords[6]) / 60 + Number(aCoords[7]) / 60000;
        if (aCoords[4] == 'W') {
            lon = 0 - lon;
        }
        var i, j, city, country, geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': {lat: lat, lng: lon}}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                for(i = 0; i < results.length; i++) {
                    /*
                    if (results[i].formatted_address.split(',').length !== 2) {
                        continue;
                    }
                    if(results[i].formatted_address.match(/\d+/) !== null) {
                        results[i].formatted_address = results[i].formatted_address.replace(/\d+/, '').trim();
                    }
                    document.querySelector('.gc-city').textContent = results[i].formatted_address;
                    break;
                */
                    city = '';
                    country = '';
                    for(j = 0; j < results[i].address_components.length; j++) {
                        if(results[i].address_components[j].types[0] === 'locality' && results[i].address_components[j].types[1] === 'political') {
                            city = results[i].address_components[j].long_name;
                        }
                        if(results[i].address_components[j].types[0] === 'country' && results[i].address_components[j].types[1] === 'political') {
                            country = results[i].address_components[j].long_name;
                        }
                    }
                    if (city !== '' && country !== '') {
                        document.querySelector('.gc-city').textContent = city + ', ' + country;
                        break;
                    }
                }
            }
        });
    },

    toggleContent: function(dataId) {
        var element = this.parentNode;
        if(element.className.indexOf(' hidden ') > -1) {
            element.className = element.className.replace(' hidden ', '');
        } else {
            element.className = element.className + ' hidden ';
        }
    },

    addContentButtons: function() {
        var i = 0;
        var elements = document.querySelectorAll('.gc-short, center, blockquote, .item-content h2, .item-content h3, .item-content td:not(:only-child), .item-content th:not(:only-child), .item-content p, .item-content > div, .item-content > strong, .item-content > a, .item-content > small,  .item-content > center,  .item-content > font, .item-content > big, .item-content > b, .item-content table, .item-content li, blockquote td:not(:only-child), blockquote th:not(:only-child), blockquote p, blockquote > div, blockquote > strong, blockquote > a, blockquote > small,  blockquote > center,  blockquote > font, blockquote > big, blockquote > b, blockquote table, blockquote li, blockquote h2, blockquote h3, .gc-waypoints');
        elements.forEach(function(element) {
            var button = document.createElement('button');
            button.textContent = '';
            button.type = 'button';
            button.className = 'gc-hideable-button';
            button.onclick = GCPRINT.toggleContent;
            element.insertBefore(button, element.firstChild);
            element.dataset.id = 'content-' + i;
            if(element.href) {
                element.href = 'javascript: void(0)';
            }
            element.className += ' gc-hideable';
            i++;
        });
    },

    handleContentElement: function(element) {
        var newElement;
        if(element.nodeType == 3) {
            newElement = document.createElement('p');
            newElement.textContent = '' + element.textContent.trim();
            element.parentNode.replaceChild(newElement, element);
        }
        if(element.nodeName.toUpperCase() == 'IMG') {
            newElement = document.createElement('p');
            element = element.parentNode.replaceChild(newElement, element);
            newElement.appendChild(element);
        }
    },

    handleChildContentElements: function(selector) {
        var nodes = document.querySelectorAll('#Content .ui-widget-content')[2];
        var result = nodes.querySelectorAll(selector);
        if(result !== null) {
            result.forEach(function(node) {
                node.childNodes.forEach(this.handleContentElement);
            }.bind(this));
        }
    },

    start: function() {
        var oCacheData = {};
        var elements = document.querySelectorAll('#Content .ui-widget-content');
        var waypoints = [];
        var i;
        var waypoint;
        var types = {
            'Unknown Cache': 'Mystery',
            'Earthcache': 'Earth-Cache',
            'Letterbox Hybrid': 'Letterbox',
            'Multi-cache': 'Multi'
        };

        this.handleChildContentElements('.item-content');
        this.handleChildContentElements('.item-content div');
        this.handleChildContentElements('.item-content blockquote');
        this.handleChildContentElements('.item-content center');
        this.handleChildContentElements('.item-content td');

        oCacheData.name = document.querySelector('#Content h2 ').textContent.trim();
        oCacheData.coords = document.querySelector('.LatLong ').textContent.trim();
        oCacheData.lat = oCacheData.coords.split(' ')[0];
        oCacheData.lon = oCacheData.coords.split(' ')[3];
        oCacheData.code = document.querySelector('#Header .HalfRight h1').textContent.trim();
        oCacheData.type = document.querySelector('#Content h2 img').getAttribute('alt');
        oCacheData.difficulty = document.querySelectorAll('#Content .DiffTerr img')[0].getAttribute('alt').split('out of 5')[0].trim();
        oCacheData.terrain = document.querySelectorAll('#Content .DiffTerr img')[1].getAttribute('alt').split('out of 5')[0].trim();
        oCacheData.size = document.querySelector('#Content .Third.AlignCenter small').textContent.replace('(', '').replace(')', '').trim();
        oCacheData.hint = document.querySelector('#uxDecryptedHint') !== null;

        if (types[oCacheData.type] !== undefined) {
            oCacheData.type = types[oCacheData.type];
        }

        elements = document.querySelectorAll('#Waypoints tbody tr');
        for (i = 0; i <	elements.length; i++) {
            if (elements[i].getAttribute('ishidden')) {
                if (waypoint !== undefined && waypoint !== null) {
                    waypoints.push(waypoint);
                    waypoint = null;
                }
                waypoint = {};
                waypoint.id = elements[i].querySelectorAll('td')[4].textContent.trim();
                waypoint.coords = elements[i].querySelectorAll('td')[6].textContent.replace('???', oCacheData.lat + ' ____________ ' + oCacheData.lon + ' ____________ ').replace('?', '__').trim();
                waypoint.type = elements[i].querySelector('td:nth-child(6) a').textContent.trim();
            } else {
                waypoint.content = elements[i].innerText.replace('Note:', '').trim();
            }
        }
        if (waypoint !== undefined && waypoint !== null) {
            waypoints.push(waypoint);
        }

        elements = document.querySelectorAll('#Content .ui-widget-content');

        oCacheData.note = elements[0].textContent.trim().replace('Cache Note', '');
        oCacheData.content = elements[2].innerHTML;
        oCacheData.short = elements[1].querySelector('.item-content').innerHTML;
        oCacheData.checker = false;

        var urls = ['geocheck.org/geo_inputchkcoord.php?', 'geochecker.com/index.php?', 'certitudes.org/certitude?'];
        for (i = 0; i < 3; i++) {
            if (oCacheData.content.indexOf(urls[i]) > 0) {
                oCacheData.checker = true;
            }
        }

        elements[3].remove();
        elements[4].remove();
        elements[5].remove();
        elements[6].remove();
        elements[7].remove();
        elements[8].remove();
        elements[1].remove();
        elements[0].remove();

        document.querySelector('#Footer').remove();
        document.querySelector('#Header').remove();
        document.querySelector('.TermsWidget').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('p.Meta').remove();
        document.querySelector('.Third').remove();
        document.querySelector('.Third').remove();
        document.querySelector('#Content h2').remove();
        document.querySelector('#Content h2').remove();
        document.querySelector('#Content > p').remove();

        var newElements = document.createElement('section');
        newElements.className = 'gc';
        newElements.innerHTML = '<h2>' + oCacheData.name + '<span class="subtitle">(' + oCacheData.type + ',<span class="gc-city"></span>)</span></h2><ul class="gc-meta"><li class="meta-gc-code">' + oCacheData.code + '</li><li class="meta-gc-difficulty">S: ' + oCacheData.difficulty + '</li><li class="meta-gc-terrain">G: ' + oCacheData.terrain + '</li><li class="meta-gc-size">' + oCacheData.size +'</li><li class="meta-gc-coords">' + oCacheData.coords + '</li></ul>' + (oCacheData.note !== '' ? '<div class="gc-note">' + oCacheData.note + '</div>' : '') + (oCacheData.short !== '' ? '<div class="gc-short">' + oCacheData.short + '</div>' : '');
        document.getElementById('Content').insertBefore(newElements, document.querySelector('#Content .sortables'));

        newElements = document.createElement('div');
        newElements.className = 'gc-hint-checker';
        newElements.innerHTML = (oCacheData.hint ? '<p>Hinweis vorhanden!</p>' : '') + (oCacheData.checker ? '<p>Geochecker vorhanden!</p>' : '');
        document.getElementById('Content').appendChild(newElements);

        var styles = document.createElement('style');
        styles.innerText = '.item { border: 0;} table { border: 0 !important; } .item .item-header { display: none; } hr { display: none; }';
        styles.innerText += '.item-content > br { display: none; } .gc-note { margin: 12pt 0; padding: 10pt; color: #888; border: 1pt solid; }';
        styles.innerText += '.item .item-content { font-weight: normal !important; font-size: 1rem !important; margin: 12pt 0; padding: 0 0 0 2pt; }';
        styles.innerText += '.item .item-content p { font-weight: normal !important; font-size: 1rem !important; }';
        styles.innerText += '.gc h2 { border-bottom: 1pt solid #000 !important; color: #000; font-size: 16pt !important; padding: 0 0 5pt 0; margin: 0 0 5pt 0; } .gc h2 span { font-size: 12pt; padding-left: 5pt; }';
        styles.innerText += '.gc-meta { display: block; overflow: hidden; margin: 0; padding: 0; list-style: none; font-size: 12pt; } .gc-short { margin: 12pt 0;}.gc-meta li { float: left; font-weight: bold; }';
        styles.innerText += '.gc-meta .meta-gc-code { float: right; } .gc-meta .meta-gc-difficulty { width: 3cm; } .gc-meta .meta-gc-terrain { width: 3cm; } .gc-meta .meta-gc-size { }';
        styles.innerText += '.gc-meta .meta-gc-found { float: right; clear: right; } .gc-meta .meta-gc-coords { clear: left; }';
        styles.innerText += '#Content, .gc-teaser, font, span { font-size: 11pt !important; font-weight: normal; font-family: sans-serif !important; line-height: 1.25; color: #000; }';
        styles.innerText += '#Content, .gc-teaser { margin-top: 5pt; overflow: hidden; } #Content img { max-width: 100%; } #Content img.left { max-width: 40%; }';
        styles.innerText += '#Content img.right { max-width: 40%; } .left { float: left; clear: left; margin-right: 5pt; margin-bottom: 5pt; } .right { float: right; clear: right; margin-right: 5pt; margin-bottom: 5pt; }';
        styles.innerText += '#Content, #Content p, #Content span, #Content center, #Content i, #Content em { text-align: left !important; font-size: 12pt !important; color: #000 !important; font-style: normal !important; font-variant: normal !important;  }';
        styles.innerText += '.gc-images { overflow: hidden; display: block; } .gc-img { float: left; width: 48%; padding: 1%; } .gc-img:only-child { width: 100%; }';
        styles.innerText += '.gc-img img, .gc-img span { display: block; margin: 0 auto; text-align: center; } .gc-img img { max-width: 98%; }';
        styles.innerText += 'font { color: #000; } table { height: auto !important; width: auto !important; } h3 { margin: 10pt 0 0 0; font-weight: bold; font-size: 12pt !important; break-after: avoid-page; }';
        styles.innerText += 'a[href*="geocheck.org/geo_inputchkcoord.php?"], a[href*="geochecker.com/index.php?"], a[href*="certitudes.org/certitude?"], a[href*=".flagcounter.com/"], a[href*="gccounter.de/"] { display: none; }';
        styles.innerText += '.gc-hideable { position: relative; display: block; }';
        styles.innerText += '.gc-hideable-button { position: static; float: right; margin-top: -1.1rem !important; background: #fff; border: none; font-weight: bold; font-size: 16px !important; color: blue; padding: 2px 5px; font-weight: bold; cursor: pointer; }';
        styles.innerText += '.gc-hideable-button:before { content: "-"; } .hidden .gc-hideable-button:before { content: "+"; } .gc-hideable:hover { outline: 3px dashed rgba(0, 0, 0, 0.5); }';
        styles.innerText += '.gc-hideable { clear: right; } .gc-hideable.hidden { outline: 2px dashed rgba(0, 0, 0, 0.25); color: #fff !important; padding: 1.5rem 0 0 0; overflow: hidden; max-height: 0; } }';
        document.querySelector('head').appendChild(styles);

        styles = document.createElement('style');
        styles.media = 'print';
        styles.innerText = 'table, td { display: block; width: 100% !important; } .gc-hideable { outline: 0 !important; padding: 0 !important; } .gc-hideable.hidden { display: none !important; outline: 0 !important; padding: 0 !important; } .gc-hideable-button { display: none !important; } .item .item-content { padding: 0 !important; }';
        document.querySelector('head').appendChild(styles);

        this.getCity(oCacheData.coords);

        var content = '';
        for(i = 0; i < waypoints.length; i++) {
            content += '<h3>WP ' + waypoints[i].id + (waypoints[i].coords !== '' ? ': <span class="gc-waypoint-coords">' + waypoints[i].coords + '</span>' : '') + '</h3><p>' + waypoints[i].content + '</p>';
        }
        if (content !== '') {
            content = '<h2>Wegpunkte</h2>' + content;
            newElements = document.createElement('div');
            newElements.className = 'gc-waypoints';
            newElements.innerHTML = content;
            document.getElementById('Content').appendChild(newElements, document.querySelector('#Content .sortables'));
        }
        this.parsed = true;

        this.addContentButtons();
    },

    init: function() {
        this.initialized = true;
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDpqtME_4P5HJu5gJ6k-IFWmQTdNjZgnVw&callback=GCPRINT.start';
        document.querySelector('body').appendChild(script);
    }
};

GCPRINT.init();