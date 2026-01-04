// ==UserScript==
// @name         Gladiatus AutoBot
// @namespace    http://tampermonkey.net/
// @version      1.6.11
// @description  Bot do gladiatusa na automatyczne chodzenie na wyprawy i lochy
// @author       Moja osoba
// @match        *://*.gladiatus.gameforge.com/game/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538952/Gladiatus%20AutoBot.user.js
// @updateURL https://update.greasyfork.org/scripts/538952/Gladiatus%20AutoBot.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let mi_global = {
        ustawienia: {
            get: function (name, defvalue) {
                defvalue = defvalue || 0;
                this.loadFromLocalStorage();
                if (this.tablicaDanych[name] !== undefined)
                    return this.tablicaDanych[name];
                return defvalue;
            },
            set: function (name, value) {
                if (value !== undefined) {
                    this.tablicaDanych[name] = value;
                    this.saveToLocalStorage();
                    return true;
                }
                return false;
            },
            del: function (name) {
                if (this.tablicaDanych[name] !== undefined) {
                    this.loadFromLocalStorage();
                    delete this.tablicaDanych[name];
                    this.saveToLocalStorage();
                    return true;
                }
                return false;
            },
            saveToLocalStorage: function () {
                let json = JSON.stringify(this.tablicaDanych);
                return localStorage.setItem("automatyzacja_opcje", json);
            },
            loadFromLocalStorage: function () {
                let json = localStorage.getItem("automatyzacja_opcje");
                if (json !== null) this.tablicaDanych = JSON.parse(json);
            },

            tablicaDanych: {}
        },

        dane: {
            get: function (name, defvalue) {
                defvalue = defvalue || 0;
                this.loadFromLocalStorage();
                if (this.tablicaDanych[name] !== undefined)
                    return this.tablicaDanych[name];
                return defvalue;
            },
            set: function (name, value) {
                if (value !== undefined) {
                    this.loadFromLocalStorage();
                    this.tablicaDanych[name] = value;
                    this.saveToLocalStorage();
                    return true;
                }
                return false;
            },
            del: function (name) {
                if (this.tablicaDanych[name] !== undefined) {
                    this.loadFromLocalStorage();
                    delete this.tablicaDanych[name];
                    this.saveToLocalStorage();
                    return true;
                }
                return false;
            },
            saveToLocalStorage: function () {
                let json = JSON.stringify(this.tablicaDanych);
                return localStorage.setItem("mi_dane", json);
            },
            loadFromLocalStorage: function () {
                let json = localStorage.getItem("mi_dane");
                if (json !== null) this.tablicaDanych = JSON.parse(json);
            },

            tablicaDanych: {}
        },

        automatyzacjaAtak: {
            attack: function (d, b, c, a, e) {
                if (e === undefined) {
                    e = "";
                }
                jQuery("#errorRow").css({display: "none"});
                sendRequest("get", "ajax.php", "mod=location&submod=attack&location=" + b + "&stage=" + c + e + "&premium=" + a, d);
            },

            startFight: function (a, b) {
                sendRequest("get", "ajax/doDungeonFight.php", "did=" + b + "&posi=" + a);
            },

            wyprawa: function () {
                setTimeout(function () {
                    mi_global.automatyzacjaAtak.attack(null, mi_global.ustawienia.get("mapa"), mi_global.ustawienia.get("potwor"), 0, '');
                }, mi_global.przydatne.getCooldown("cooldown_bar_text_expedition") + mi_global.przydatne.dodatkoweOpoznienie());
            },

            loch: function () {
                if (mi_global.przydatne.getCooldown("cooldown_bar_text_dungeon") > 1000) {
                    setTimeout(function () {
                        mi_global.automatyzacjaAtak.loch();
                    }, mi_global.przydatne.getCooldown("cooldown_bar_text_dungeon"));
                    return;
                }

                jQuery.get(mi_global.przydatne.link({
                    "mod": "dungeon",
                    "loc": mi_global.ustawienia.get("loch")
                }), function (content) {
                    let poczatek = content.indexOf("startFight");

                    if (poczatek === -1) {
                        let dif = mi_global.ustawienia.get("loch_trudnosc") === "dif1" ? {"dif1": "1"} : {"dif2": "1"};
                        jQuery.post(mi_global.przydatne.link({
                            "mod": "dungeon",
                            "loc": mi_global.ustawienia.get("loch")
                        }), dif);
                        setTimeout(function () {
                            mi_global.automatyzacjaAtak.loch();
                        }, mi_global.przydatne.getCooldown("cooldown_bar_text_dungeon"));
                        return;
                    }

                    let koniec = content.indexOf(")", poczatek);
                    let informacje = content.substring(poczatek + 12, koniec - 1).split("', '");
                    let idPotwora = informacje[0];
                    let idLochu = informacje[1];

                    if (content.indexOf("Boss") !== -1 && !mi_global.ustawienia.get('boss_atakowany', true)) {
                        var xhttp = new XMLHttpRequest();
                        xhttp.open("POST", mi_global.przydatne.link({
                            "mod": "dungeon",
                            "loc": mi_global.ustawienia.get("loch"),
                            "action": "cancelDungeon"
                        }), true);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp.send("dungeonId=" + idLochu);
                        mi_global.automatyzacjaAtak.loch();
                    } else {
                        setTimeout(function () {
                            mi_global.automatyzacjaAtak.startFight(idPotwora, idLochu);
                        }, mi_global.przydatne.dodatkoweOpoznienie());
                    }
                });
            },

            automat: function () {
                setTimeout(function () {
                    let cde = document.getElementById("cooldown_bar_text_expedition");
                    let cdd = document.getElementById("cooldown_bar_text_dungeon");
                    if (cde !== null && cdd !== null && cde.innerHTML !== '-' && cdd.innerHTML !== '-') {
                        if (mi_global.ustawienia.get('wyprawa_aktywny', false)) mi_global.automatyzacjaAtak.wyprawa();
                        if (mi_global.ustawienia.get('loch_aktywny', false)) mi_global.automatyzacjaAtak.loch();
                    } else setTimeout(mi_global.automatyzacjaAtak.automat, 10000);
                }, 2000);
            }
        },

        przydatne: {
            link: function (x, path) {
                let url = document.location.href;
                let sh = (url.match(/sh=[0-9a-fA-F]+/i)) ? url.match(/sh=([0-9a-fA-F]+)/i)[1] : null;

                if (!path) path = "index.php";
                let link = path;
                let front = "?";
                for (let i in x) {
                    link += front + i + "=" + x[i];
                    if (front == "?") front = "&";
                }
                return link + front + "sh=" + sh;
            },

            getCooldown: function (id) {
                let button = document.getElementById(id);
                // Check no button
                if (!button) return;

                // Cooldown
                let cooldown = button.textContent.match(/(\d+):(\d+):(\d+)/);
                // Check id cooldown
                if (cooldown) {
                    // Calculate cooldown
                    cooldown = (parseInt(cooldown[1], 10) * 60 * 60 + parseInt(cooldown[2], 10) * 60 + parseInt(cooldown[3], 10)) * 1000;
                    // Return a cooldown
                    return cooldown;
                } else {
                    return 100;
                }
            },

            fireMouseEvent: function (type, elem, centerX, centerY) {
                let evt = document.createEvent('MouseEvents');
                evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
                elem.dispatchEvent(evt);
            },

            triggerDragAndDrop: function (itemToDrag, itemToDrop) {
                // calculate positions
                let pos = itemToDrag.getBoundingClientRect();
                let center1X = Math.floor((pos.left + pos.right) / 2);
                let center1Y = Math.floor((pos.top + pos.bottom) / 2);
                pos = itemToDrop.getBoundingClientRect();
                let center2X = Math.floor((pos.left + pos.right) / 2);
                let center2Y = Math.floor((pos.top + pos.bottom) / 2);

                // mouse over dragged element and mousedown
                mi_global.przydatne.fireMouseEvent('mousemove', itemToDrag, center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mouseenter', itemToDrag, center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mouseover', itemToDrag, center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mousedown', itemToDrag, center1X, center1Y);

                // start dragging process over to drop target
                mi_global.przydatne.fireMouseEvent('dragstart', itemToDrag, center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('drag', itemToDrag, center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mousemove', itemToDrag, center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('drag', itemToDrag, center2X, center2Y);
                mi_global.przydatne.fireMouseEvent('mousemove', itemToDrop, center2X, center2Y);

                // trigger dragging process on top of drop target
                mi_global.przydatne.fireMouseEvent('mouseenter', itemToDrop, center2X, center2Y);
                mi_global.przydatne.fireMouseEvent('dragenter', itemToDrop, center2X, center2Y);
                mi_global.przydatne.fireMouseEvent('mouseover', itemToDrop, center2X, center2Y);
                mi_global.przydatne.fireMouseEvent('dragover', itemToDrop, center2X, center2Y);

                // release dragged element on top of drop target
                mi_global.przydatne.fireMouseEvent('drop', itemToDrop, center2X, center2Y);
                mi_global.przydatne.fireMouseEvent('dragend', itemToDrag, center2X, center2Y);
                mi_global.przydatne.fireMouseEvent('mouseup', itemToDrag, center2X, center2Y);

                return true;
            },

            wyciagnijZPaczek: function (link, callback, cena, nrZakladek = '01234567', zmienStrone = true) {
                if (zmienStrone) {
                    let akcje = "mi_global.przydatne.wyciagnijZPaczek('" + link + "', " + callback + ", " + cena + ", '" + nrZakladek + "', false)";
                    localStorage.setItem("automatyzacja_akcje", akcje);

                    window.location.href = link;

                    return;
                }

                let paczki = document.querySelectorAll("#packages .packageItem div[class*='item-i-']");

                let pos = paczki[0].getBoundingClientRect();
                let center1X = Math.floor((pos.left + pos.right) / 2);
                let center1Y = Math.floor((pos.top + pos.bottom) / 2);

                let inv = document.querySelector('#inv');
                pos = inv.getBoundingClientRect();
                let center2X = Math.floor((pos.left + pos.right) / 2);
                let center2Y = Math.floor((pos.top + pos.bottom) / 2);

                let zakladki = document.querySelectorAll("a[data-available='true']");

                let wolne = null;

                mi_global.przydatne.fireMouseEvent('mousemove', paczki[0], center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mouseenter', paczki[0], center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mouseover', paczki[0], center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mousedown', paczki[0], center1X, center1Y);

                mi_global.przydatne.fireMouseEvent('dragstart', paczki[0], center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('drag', paczki[0], center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('mousemove', paczki[0], center1X, center1Y);
                mi_global.przydatne.fireMouseEvent('drag', paczki[0], center2X, center2Y);
                mi_global.przydatne.fireMouseEvent('mousemove', inv, center2X, center2Y);

                wolne = document.querySelector("#inv div.image-grayed.active:not([class*='item-i-'])");
                if (wolne === null) {
                    mi_global.przydatne.fireMouseEvent('drop', inv, center2X, center2Y);
                    mi_global.przydatne.fireMouseEvent('dragend', paczki[0], center2X, center2Y);
                    mi_global.przydatne.fireMouseEvent('mouseup', paczki[0], center2X, center2Y);

                    if (nrZakladek === '') {
                        mi_global.przydatne.wlasnyAlert("Brak miejsca w ekwipunku", "Paczki");
                        return false;
                    }
                    setTimeout(function () {
                        mi_global.przydatne.fireMouseEvent('click', zakladki[nrZakladek.slice(0, 1)], 0, 0);
                        nrZakladek = nrZakladek.slice(1);
                        mi_global.przydatne.wyciagnijZPaczek(link, callback, cena, nrZakladek, false);
                    }, 250);
                } else {
                    pos = wolne.getBoundingClientRect();
                    center2X = Math.floor((pos.left + pos.right) / 2);
                    center2Y = Math.floor((pos.top + pos.bottom) / 2);

                    mi_global.przydatne.fireMouseEvent('drag', paczki[0], center2X, center2Y);
                    mi_global.przydatne.fireMouseEvent('mousemove', wolne, center2X, center2Y);

                    mi_global.przydatne.fireMouseEvent('drop', wolne, center2X, center2Y);
                    mi_global.przydatne.fireMouseEvent('dragend', paczki[0], center2X, center2Y);
                    mi_global.przydatne.fireMouseEvent('mouseup', paczki[0], center2X, center2Y);

                    let przedmioty = document.querySelectorAll("#inv div[class*='item-i-']");
                    let wsp = {x: 0, y: 0};
                    wsp.x = przedmioty[przedmioty.length - 1].style.left.slice(0, -2) / 32 + 1;
                    wsp.y = przedmioty[przedmioty.length - 1].style.top.slice(0, -2) / 32 + 1;
                    callback.apply(this, [wsp.x, wsp.y, cena]);
                }
            },

            getAllUrlParams: function (url) {
                let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
                let obj = {};

                if (queryString) {
                    queryString = queryString.split('#')[0];
                    let arr = queryString.split('&');

                    for (let i = 0; i < arr.length; i++) {
                        let a = arr[i].split('=');

                        let paramNum = undefined;
                        let paramName = a[0].replace(/\[\d*\]/, function (v) {
                            paramNum = v.slice(1, -1);
                            return '';
                        });

                        let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
                        paramName = paramName.toLowerCase();
                        paramValue = paramValue.toLowerCase();

                        if (obj[paramName]) {
                            if (typeof obj[paramName] === 'string') {
                                obj[paramName] = [obj[paramName]];
                            }
                            if (typeof paramNum === 'undefined') {
                                obj[paramName].push(paramValue);
                            } else {
                                obj[paramName][paramNum] = paramValue;
                            }
                        } else {
                            obj[paramName] = paramValue;
                        }
                    }
                }

                return obj;
            },

            wykonajAkcje: function () {
                setTimeout(function () {
                    let akcje = localStorage.getItem("automatyzacja_akcje");
                    if (akcje !== null) {
                        try {
                            eval(akcje);
                            localStorage.removeItem("automatyzacja_akcje");
                            return true;
                        } catch (e) {
                            console.error(e);
                            localStorage.removeItem("automatyzacja_akcje");
                            return false;
                        }
                    }
                    return false;
                }, 1000);
            },

            dodatkoweOpoznienie: function (min, max) {
                min = min || mi_global.ustawienia.get('min_opoznienie', 5);
                max = max || mi_global.ustawienia.get('max_opoznienie', 10);
                let dodatkoweOpoznienie = Math.random() * (max * 1 - min * 1) + min * 1;
                dodatkoweOpoznienie *= 1000;
                return Math.round(dodatkoweOpoznienie);
            },

            wlasnyAlert: function (wiadomosc, tytul) {
                if (!tytul)
                    tytul = 'Wiadomość';

                if (!wiadomosc)
                    wiadomosc = 'Nie ma nic do wyswietlenia';

                jQuery('<div></div>').html(wiadomosc).dialog({
                    title: tytul,
                    resizable: false,
                    dialogClass: 'no-close',
                    buttons: {
                        'Ok': function () {
                            jQuery(this).dialog('close');
                        }
                    }
                });
            }
        },

        interfejs: {
            dodajInterfejs: function () {
                let smf = document.querySelector("#submenufooter");
                if (smf !== null) smf.innerHTML = null;
                jQuery('#submenufooter').prepend('<style>#submenufooter{height: auto !important;}input[type=\'number\'].menuitem{width: 156px;}.menutext{color: #bfae54; text-align: center;}.nextsection{margin-bottom: 30px;}.eq_table{margin-left: auto; margin-right: auto;}.eq_table td{border: 1px #af8e50 solid;}.hidden{display: none;}</style><script>function zwinRozwin(elem, ostatni=false){elem.nextElementSibling.classList.toggle(\'hidden\'); if (!ostatni) elem.nextElementSibling.classList.toggle(\'nextsection\'); let txt=elem.innerText; let lastChar=txt.slice(-2).split(""); elem.innerText=txt.slice(0, -2) + lastChar[1] + lastChar[0]; let zakladki=JSON.parse(localStorage.getItem("mi_pokazZakladki")); zakladki[elem.title]=!zakladki[elem.title]; localStorage.setItem("mi_pokazZakladki", JSON.stringify(zakladki));}</script><div style="margin-top: 20px; text-align: center; padding-top: 10px; padding-bottom: 10px;" class="submenu advanced_sub_menu" id="moj_interfejs"> <form onsubmit="mi_global.interfejs.zapiszDane()" action="javascript:void(0);" novalidate> <span title="opoznienie" class="menuitem" onclick="zwinRozwin(this)"><b>Wybór opóźnienia \\/</b></span> <section class="hidden"> <span class="menutext">Minimalne opóźnienie (s)</span> <input type="number" min="5" class="menuitem" name="mi_min_opoznienie"/> <span class="menutext">Maksymalne opóźnienie (s)</span> <input type="number" min="5" class="menuitem" name="mi_max_opoznienie"/> </section> <span title="wyprawy" class="menuitem underworld-hide" onclick="zwinRozwin(this)">Wybór wyprawa \\/</span> <section class="hidden"> <span class="menutext">Wybór mapy</span> <select class="menuitem" name="mi_mapa_wyprawa"> <option value="0">1</option> <option value="1">2</option> <option value="2">3</option> <option value="3">4</option> <option value="4">5</option> <option value="5">6</option> <option value="6">7</option> <option value="7">8</option> </select> <span class="menutext">Wybór potwora</span> <select class="menuitem" name="mi_potwor_wyprawa"> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> </select> <div class="menuitem"> <input type="checkbox" name="mi_aktywny_wyprawa"/> <span>Aktywne wyprawy</span> </div></section> <span title="lochy" class="menuitem underworld-hide" onclick="zwinRozwin(this)">Wybór lochy \\/</span> <section class="hidden"> <span class="menutext">Wybór mapy</span> <select class="menuitem" name="mi_mapa_loch"> <option value="0">1</option> <option value="1">2</option> <option value="2">3</option> <option value="3">4</option> <option value="4">5</option> <option value="5">6</option> <option value="6">7</option> <option value="7">8</option> </select> <span class="menutext">Wybór poziomu</span> <select class="menuitem" name="mi_trudnosc_loch"> <option value="dif1">normalny</option> <option value="dif2">zaawansowany</option> </select> <div class="menuitem"><input type="checkbox" name="mi_atakowany_boss"/> <span>Atakowanie bossa</span></div><div class="menuitem"><input type="checkbox" name="mi_aktywny_loch"/> <span>Aktywne lochy</span></div></section> <span title="event" class="menuitem underworld-hide" onclick="zwinRozwin(this)">Wybór event \\/</span> <section class="hidden"> <span class="menutext">Wybór potwora</span> <select class="menuitem" name="mi_potwor_event"> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> </select> <div class="menuitem"><input type="checkbox" name="mi_aktywny_event"/> <span>Aktywne eventy</span></div></section> <span title="jedzenie" class="menuitem underworld-hide" onclick="zwinRozwin(this)">Automatyczne jedzenie \\/</span> <section class="hidden"> <span class="menutext">Minimalny procent życia</span> <input type="number" min="1" max="99" class="menuitem" name="mi_min_zycie"/> <span class="menutext">Docelowy procent życia</span> <input type="number" min="1" max="99" class="menuitem" name="mi_docelowe_zycie"/> <div class="menuitem"><input type="checkbox" name="mi_aktywny_zycie"/> <span>Aktywne jedzenie</span></div><div class="menuitem"><input type="checkbox" name="mi_aktywny_jedzenie_wylacz"/> <span>Wyłącz wyprawy i arenę przy braku jedzenia</span> </div></section> <span title="arena-ct" class="menuitem" onclick="zwinRozwin(this)">Arena CT \\/</span> <section class="hidden"> <span class="menutext">Strategia arena</span> <select class="menuitem" name="mi_dobor_arena"> <option value="0">Losowo</option> <option value="1">Najwyżej w rankingu</option> <option value="3">Najniższy lv</option> </select> <div class="menuitem"><input type="checkbox" name="mi_arena_provinciarum"/> <span>Arena Provinciarum</span> </div><div class="menuitem"><input type="checkbox" name="mi_aktywny_arena"/> <span>Aktywna arena</span></div><span class="menutext">Strategia CT</span> <select class="menuitem" name="mi_dobor_ct"> <option value="0">Losowo</option> <option value="1">Najwyżej w rankingu</option> <option value="3">Najniższy lv</option> </select> <div class="menuitem"><input type="checkbox" name="mi_ct_provinciarum"/> <span>Circus Provinciarum</span> </div><div class="menuitem"><input type="checkbox" name="mi_aktywny_ct"/> <span>Aktywne CT</span></div></section> <span title="roztapiarka" class="menuitem" onclick="zwinRozwin(this)">Roztapiarka \\/</span> <section class="hidden"> <span class="menutext">Zakładki do roztopienia</span> <table class="eq_table"> <tr> <td><input type="checkbox" name="mi_roztapiarka_1"/><br/><span class="menutext">I</span></td><td><input type="checkbox" name="mi_roztapiarka_2"/><br/><span class="menutext">II</span></td><td><input type="checkbox" name="mi_roztapiarka_3"/><br/><span class="menutext">III</span></td><td><input type="checkbox" name="mi_roztapiarka_4"/><br/><span class="menutext">IV</span></td></tr><tr> <td><input type="checkbox" name="mi_roztapiarka_5"/><br/><span class="menutext">V</span></td><td><input type="checkbox" name="mi_roztapiarka_6"/><br/><span class="menutext">VI</span></td><td><input type="checkbox" name="mi_roztapiarka_7"/><br/><span class="menutext">VII</span></td><td><input type="checkbox" name="mi_roztapiarka_8"/><br/><span class="menutext">VIII</span></td></tr></table> <div class="menuitem"><input type="checkbox" name="mi_aktywny_roztapiarka"/> <span>Aktywne roztapianie</span></div></section> <span title="paczkowanie" class="menuitem" onclick="zwinRozwin(this)">Paczkowanie \\/</span> <section class="hidden"> <span class="menutext">Co jaki czas sprawdzać (min)</span> <input type="number" min="0" class="menuitem" name="mi_paczki_czas"/> <span class="menutext">Przy jakiej ilości złota kupić</span> <input type="number" min="0" class="menuitem" name="mi_paczki_zloto"/> <span class="menutext">Od jakiej ceny kupować</span> <input type="number" min="0" class="menuitem" name="mi_paczki_min_zloto"/> <div class="menuitem"><input type="checkbox" name="mi_paczki_odstawianie"/> <span>Odstawianie paczek</span> </div><div class="menuitem"><input type="checkbox" name="mi_aktywny_paczki"/> <span>Aktywne paczki</span></div><div class="menuitem" onclick="mi_global.paczki.wyborGraczy.utworzenieDialogu()">Wybór graczy</div></section> <span title="zadania" class="menuitem ostatni" onclick="zwinRozwin(this, true)">Zadania \\/</span> <section class="hidden"> <span class="menutext">Typy zadań</span> <table class="eq_table"> <tr> <td><span class="menutext">Arena</span></td><td><input type="checkbox" name="mi_zadania_arena"/></td></tr><tr> <td><span class="menutext">CT</span></td><td><input type="checkbox" name="mi_zadania_grouparena"/></td></tr><tr> <td><span class="menutext">Walka</span></td><td><input type="checkbox" name="mi_zadania_combat"/></td></tr><tr> <td><span class="menutext">Wyprawy</span></td><td><input type="checkbox" name="mi_zadania_expedition"/></td></tr><tr> <td><span class="menutext">Lochy</span></td><td><input type="checkbox" name="mi_zadania_dungeon"/></td></tr><tr> <td><span class="menutext">Praca</span></td><td><input type="checkbox" name="mi_zadania_work"/></td></tr><tr> <td><span class="menutext">Przedmioty</span></td><td><input type="checkbox" name="mi_zadania_items"/></td></tr><tr> <td></td><td></td></tr><tr> <td><span class="menutext">"Z rzędu"</span></td><td><input type="checkbox" name="mi_zadania_rzad"/></td></tr><tr> <td><span class="menutext">Czasowe</span></td><td><input type="checkbox" name="mi_zadania_czas"/></td></tr></table> <div class="menuitem"><input type="checkbox" name="mi_aktywny_zadania"/> <span>Aktywne zadania</span></div></section> <input type="submit" class="menuitem" style="margin-top: 5px" value="Zapisz"> <input type="button" class="menuitem" style="margin-top: 10px" onclick="mi_global.interfejs.zatrzymajWszystko()" value="Zatrzymaj wszystko"> <input type="button" class="menuitem" style="margin-top: 10px" onclick="mi_global.interfejs.resetUstawien()" value="Reset"> </form> <a type="button" class="menuitem" style="margin-top: 10px" href="https://drive.google.com/file/d/1Cxrlz8XtVll-p0biWTEEYnN-uLsykq3r/view" target="_blank">Pomoc</a> <span class="menutext" style="font-size: 10px">Wersja: 1.6.11</span></div>');

                mi_global.interfejs.ukonczDodawanieInterfejsu();
            },

            ukonczDodawanieInterfejsu: function () {
                if (document.querySelector("#moj_interfejs") === null) {
                    setTimeout(mi_global.interfejs.ukonczDodawanieInterfejsu, 100);
                } else {
                    let zakladki_roztapiarki = document.querySelectorAll("input[name*='mi_roztapiarka_']");

                    zakladki_roztapiarki.forEach(function (value, index) {
                        value.addEventListener("click", function () {
                            if (value.checked === true)
                                if (!confirm("Jesteś pewien dodania zakładki numer " + parseInt(index + 1) + "? Pamiętaj, że wszyskie przedmioty z niej zostaną usunięte!!!"))
                                    this.checked = false;
                        });
                    });

                    let nazwyMap = document.querySelectorAll("#submenu2 a:not(.glow)");
                    if (nazwyMap.length > 1) {
                        document.getElementsByName("mi_mapa_wyprawa")[0].innerHTML = null;
                        document.getElementsByName("mi_mapa_loch")[0].innerHTML = null;
                    }
                    for (let i = 1; i < nazwyMap.length; i++) {
                        let op = document.createElement('option');
                        let poczatekNr = nazwyMap[i].href.indexOf("loc=") + 4;
                        let koniecNr = nazwyMap[i].href.indexOf("&", poczatekNr);
                        op.value = nazwyMap[i].href.substr(poczatekNr, koniecNr - poczatekNr);
                        op.innerHTML = nazwyMap[i].innerHTML;
                        document.getElementsByName("mi_mapa_wyprawa")[0].appendChild(op.cloneNode(true));
                        document.getElementsByName("mi_mapa_loch")[0].appendChild(op);
                    }
                    if (nazwyMap.length > 1) {
                        this.pobierzDane();
                        this.ukryjZakladki();
                        this.hadesoweZakladki();
                    }
                }
            },

            pobierzDane: function () {
                document.getElementsByName("mi_mapa_wyprawa")[0].value = mi_global.ustawienia.get('mapa');
                document.getElementsByName("mi_mapa_loch")[0].value = mi_global.ustawienia.get('loch');
                document.getElementsByName("mi_potwor_wyprawa")[0].value = mi_global.ustawienia.get('potwor', 1);
                document.getElementsByName("mi_trudnosc_loch")[0].value = mi_global.ustawienia.get('loch_trudnosc', 'dif1');
                document.getElementsByName("mi_aktywny_wyprawa")[0].checked = mi_global.ustawienia.get('wyprawa_aktywny');
                document.getElementsByName("mi_aktywny_loch")[0].checked = mi_global.ustawienia.get('loch_aktywny', false);
                document.getElementsByName("mi_atakowany_boss")[0].checked = mi_global.ustawienia.get('boss_atakowany', true);
                document.getElementsByName("mi_potwor_event")[0].value = mi_global.ustawienia.get('event_potwor', 1);
                document.getElementsByName("mi_aktywny_event")[0].checked = mi_global.ustawienia.get('event_aktywny', false);
                document.getElementsByName("mi_aktywny_zycie")[0].checked = mi_global.ustawienia.get('jedzenie_aktywny');
                document.getElementsByName("mi_aktywny_jedzenie_wylacz")[0].checked = mi_global.ustawienia.get('brak_jedzenia_aktywny');
                document.getElementsByName("mi_min_zycie")[0].value = mi_global.ustawienia.get('min_zycia', 20);
                document.getElementsByName("mi_docelowe_zycie")[0].value = mi_global.ustawienia.get('docelowe_zycie', 21);
                document.getElementsByName("mi_min_opoznienie")[0].value = mi_global.ustawienia.get('min_opoznienie', 5);
                document.getElementsByName("mi_max_opoznienie")[0].value = mi_global.ustawienia.get('max_opoznienie', 10);
                document.getElementsByName("mi_dobor_arena")[0].value = mi_global.ustawienia.get('arena_dobor', 0);
                document.getElementsByName("mi_dobor_ct")[0].value = mi_global.ustawienia.get('ct_dobor', 0);
                document.getElementsByName("mi_aktywny_arena")[0].checked = mi_global.ustawienia.get('arena_aktywny', false);
                document.getElementsByName("mi_aktywny_ct")[0].checked = mi_global.ustawienia.get('ct_aktywny', false);
                document.getElementsByName("mi_arena_provinciarum")[0].checked = mi_global.ustawienia.get('arena_provinciarum', false);
                document.getElementsByName("mi_ct_provinciarum")[0].checked = mi_global.ustawienia.get('ct_provinciarum', false);
                document.getElementsByName("mi_aktywny_roztapiarka")[0].checked = mi_global.ustawienia.get('roztapiarka_aktywny', false);
                document.getElementsByName("mi_paczki_czas")[0].value = mi_global.ustawienia.get('paczki_czas', 10);
                document.getElementsByName("mi_paczki_zloto")[0].value = mi_global.ustawienia.get('paczki_zloto', 500000);
                document.getElementsByName("mi_paczki_odstawianie")[0].checked = mi_global.ustawienia.get('paczki_odstawianie', false);
                document.getElementsByName("mi_paczki_min_zloto")[0].value = mi_global.ustawienia.get('paczki_min_zloto', 100000);
                document.getElementsByName("mi_aktywny_paczki")[0].checked = mi_global.ustawienia.get('paczki_aktywny', false);
                document.getElementsByName("mi_aktywny_zadania")[0].checked = mi_global.ustawienia.get('zadania_aktywny', false);

                let zakladki_roztapiarki = document.querySelectorAll("input[name*='mi_roztapiarka_']");
                zakladki_roztapiarki.forEach(function (value, index) {
                    value.checked = mi_global.ustawienia.get('roztapiarka_zakladka_' + parseInt(index + 1), false);
                });

                let typyZadanInterfejs = document.querySelectorAll("input[name*='mi_zadania_']");
                let typyZadanZapisane = mi_global.ustawienia.get("zadania_typy", {});
                typyZadanInterfejs.forEach(function (value) {
                    value.checked = typyZadanZapisane[value.name.replace("mi_zadania_", "")];
                });
            },

            zapiszDane: function () {
                try {
                    mi_global.ustawienia.set('mapa', document.getElementsByName("mi_mapa_wyprawa")[0].value);
                    mi_global.ustawienia.set('loch', document.getElementsByName("mi_mapa_loch")[0].value);
                    mi_global.ustawienia.set('potwor', document.getElementsByName("mi_potwor_wyprawa")[0].value);
                    mi_global.ustawienia.set('loch_trudnosc', document.getElementsByName("mi_trudnosc_loch")[0].value);
                    mi_global.ustawienia.set('arena_dobor', document.getElementsByName("mi_dobor_arena")[0].value);
                    mi_global.ustawienia.set('ct_dobor', document.getElementsByName("mi_dobor_ct")[0].value);
                    mi_global.ustawienia.set('event_potwor', document.getElementsByName("mi_potwor_event")[0].value);

                    mi_global.ustawienia.set('wyprawa_aktywny', document.getElementsByName("mi_aktywny_wyprawa")[0].checked);
                    mi_global.ustawienia.set('loch_aktywny', document.getElementsByName("mi_aktywny_loch")[0].checked);
                    mi_global.ustawienia.set('boss_atakowany', document.getElementsByName("mi_atakowany_boss")[0].checked);
                    mi_global.ustawienia.set('jedzenie_aktywny', document.getElementsByName("mi_aktywny_zycie")[0].checked);
                    mi_global.ustawienia.set('brak_jedzenia_aktywny', document.getElementsByName("mi_aktywny_jedzenie_wylacz")[0].checked);
                    mi_global.ustawienia.set('arena_aktywny', document.getElementsByName("mi_aktywny_arena")[0].checked);
                    mi_global.ustawienia.set('ct_aktywny', document.getElementsByName("mi_aktywny_ct")[0].checked);
                    mi_global.ustawienia.set('paczki_aktywny', document.getElementsByName("mi_aktywny_paczki")[0].checked);
                    mi_global.ustawienia.set('roztapiarka_aktywny', document.getElementsByName("mi_aktywny_roztapiarka")[0].checked);
                    mi_global.ustawienia.set('zadania_aktywny', document.getElementsByName("mi_aktywny_zadania")[0].checked);
                    mi_global.ustawienia.set('event_aktywny', document.getElementsByName("mi_aktywny_event")[0].checked);

                    mi_global.ustawienia.set('arena_provinciarum', document.getElementsByName("mi_arena_provinciarum")[0].checked);
                    mi_global.ustawienia.set('ct_provinciarum', document.getElementsByName("mi_ct_provinciarum")[0].checked);

                    mi_global.ustawienia.set('paczki_czas', document.getElementsByName("mi_paczki_czas")[0].value);
                    mi_global.ustawienia.set('paczki_zloto', document.getElementsByName("mi_paczki_zloto")[0].value);
                    mi_global.ustawienia.set('paczki_min_zloto', document.getElementsByName("mi_paczki_min_zloto")[0].value);
                    mi_global.ustawienia.set('paczki_odstawianie', document.getElementsByName("mi_paczki_odstawianie")[0].checked);

                    mi_global.ustawienia.set('min_zycia', document.getElementsByName("mi_min_zycie")[0].value);
                    if (document.getElementsByName("mi_min_zycie")[0].value * 1 >= document.getElementsByName("mi_docelowe_zycie")[0].value * 1)
                        mi_global.ustawienia.set('docelowe_zycie', document.getElementsByName("mi_min_zycie")[0].value * 1 + 1);
                    else
                        mi_global.ustawienia.set('docelowe_zycie', document.getElementsByName("mi_docelowe_zycie")[0].value);

                    mi_global.ustawienia.set('min_opoznienie', document.getElementsByName("mi_min_opoznienie")[0].value);
                    if (document.getElementsByName("mi_min_opoznienie")[0].value * 1 > document.getElementsByName("mi_max_opoznienie")[0].value * 1)
                        mi_global.ustawienia.set('max_opoznienie', document.getElementsByName("mi_min_opoznienie")[0].value);
                    else
                        mi_global.ustawienia.set('max_opoznienie', document.getElementsByName("mi_max_opoznienie")[0].value);

                    let zakladki_roztapiarki = document.querySelectorAll("input[name*='mi_roztapiarka_']");
                    zakladki_roztapiarki.forEach(function (value, index) {
                        mi_global.ustawienia.set('roztapiarka_zakladka_' + parseInt(index + 1), value.checked);
                    });

                    let zadaniaTypyJSON = {};
                    let typyZadanInterfejs = document.querySelectorAll("input[name*='mi_zadania_']");
                    typyZadanInterfejs.forEach(function (value) {
                        zadaniaTypyJSON[value.name.replace("mi_zadania_", "")] = value.checked;
                    });
                    mi_global.ustawienia.set('zadania_typy', zadaniaTypyJSON);

                    location.reload();
                } catch (e) {
                    zglos(e);
                }
            },

            resetUstawien: function () {
                if (confirm("Czy na pewno chcesz zresetować ustawienia?")) {
                    localStorage.removeItem("automatyzacja_jedzenie");
                    localStorage.removeItem("automatyzacja_opcje");
                    localStorage.removeItem("mi_dane");
                    localStorage.removeItem("mi_ostatni_ct");
                    localStorage.removeItem("mi_ostatni_arena");
                    localStorage.removeItem("mi_pokazZakladki");
                    localStorage.removeItem("automatyzacja_akcje");

                    location.reload();
                }
            },

            zatrzymajWszystko: function () {
                mi_global.ustawienia.set('wyprawa_aktywny', false);
                mi_global.ustawienia.set('loch_aktywny', false);
                mi_global.ustawienia.set('jedzenie_aktywny', false);
                mi_global.ustawienia.set('arena_aktywny', false);
                mi_global.ustawienia.set('ct_aktywny', false);
                mi_global.ustawienia.set('paczki_aktywny', false);
                mi_global.ustawienia.set('roztapiarka_aktywny', false);
                mi_global.ustawienia.set('zadania_aktywny', false);
                mi_global.ustawienia.set('event_aktywny', false);
                location.reload();
            },

            ukryjZakladki: function () {
                let zakladki = JSON.parse(localStorage.getItem("mi_pokazZakladki"));
                if (zakladki !== null) {
                    for (let sekcja in zakladki) {
                        if (zakladki[sekcja]) {
                            let elem = document.querySelector('#moj_interfejs span.menuitem[title=' + sekcja + ']');
                            elem.nextElementSibling.classList.toggle('hidden');
                            if (!elem.classList.contains("ostatni")) elem.nextElementSibling.classList.toggle('nextsection');
                            let txt = elem.innerText;
                            let lastChar = txt.slice(-2).split("");
                            elem.innerText = txt.slice(0, -2) + lastChar[1] + lastChar[0];
                        }
                    }
                } else {
                    zakladki = {};
                    let sekcjeWMenu = document.querySelectorAll("#moj_interfejs span.menuitem");
                    for (let i = 0; i < sekcjeWMenu.length; i++) {
                        zakladki[sekcjeWMenu[i].title] = false;
                    }
                    localStorage.setItem("mi_pokazZakladki", JSON.stringify(zakladki));
                }
            },

            hadesoweZakladki: function () {
                let ukryj = document.querySelectorAll('.underworld #moj_interfejs .underworld-hide');
                for (let i = 0; i < ukryj.length; i++) {
                    const ukryjElement = ukryj[i];
                    ukryjElement.classList.add('inactive');
                }

                let pokaz = document.querySelectorAll('.underworld #moj_interfejs .underworld-show');
                for (let i = 0; i < pokaz.length; i++) {
                    const pokazElement = pokaz[i];
                    pokazElement.classList.remove('inactive');
                }

                let ukryte = document.querySelectorAll('#moj_interfejs .inactive');
                for (let i = 0; i < ukryte.length; i++) {
                    const ukryteElement = ukryte[i];
                    ukryteElement.onclick = function () {
                        mi_global.przydatne.wlasnyAlert("Nie dostępne w aktualnej lokalizacji. Pójdź do hadesu lub wróć do normalnego świata.")
                    };
                    ukryteElement.nextElementSibling.style.display = "none";
                }
            }
        },

        jedzenie: {
            jedzenie: function (idPrzedmiotu, numerInwentarza, wartoscLeczenia) {
                this.idPrzedmiotu = idPrzedmiotu;
                this.numerInwentarza = numerInwentarza;
                this.wartoscLeczenia = wartoscLeczenia;
            },

            listaJedzenia: [],

            zapiszDoPamieciLokalnej: function () {
                let json = JSON.stringify(this.listaJedzenia);
                return localStorage.setItem("automatyzacja_jedzenie", json);
            },

            wczytajZPamieciLokalnej: function () {
                let json = localStorage.getItem("automatyzacja_jedzenie");
                if (json !== null)
                    this.listaJedzenia = JSON.parse(json);
            },

            szukajJedzenia: function () {
                try {
                    mi_global.jedzenie.listaJedzenia = [];

                    let zakladki = document.querySelectorAll("a[data-available='true']");
                    if (zakladki.length === 0 || mi_global.przydatne.getAllUrlParams().mod === "packages") {
                        let akcje = "mi_global.jedzenie.szukajJedzenia();";
                        localStorage.setItem("automatyzacja_akcje", akcje);
                        window.location.href = mi_global.przydatne.link({"mod": "overview"});

                        return;
                    }

                    zakladki.forEach(function (value, index) {
                        mi_global.przydatne.fireMouseEvent("click", value, 0, 0);
                        document.getElementById("inv").querySelectorAll("div[class*='item-i-7']").forEach(function (value) {
                            if (value.attributes["data-tooltip"].value.match(/Cervisia/g) === null) {
                                let leczenie = 0;
                                let tooltip = JSON.parse(value.dataset.tooltip);
                                if (tooltip[0][2][0].match(/\+\d+/i)) {
                                    leczenie += parseInt(tooltip[0][1][0].match(/(\d+)/i)[0]);
                                } else if (tooltip[0][3][0].match(/\+\d+/i)) {
                                    leczenie += parseInt(tooltip[0][2][0].match(/(\d+)/i)[0]);
                                }
                                for (let i = 0; i < parseInt(value.attributes["data-amount"].value); i++) {
                                    let jedzenie = new mi_global.jedzenie.jedzenie(value.attributes["data-item-id"].value, index, leczenie);

                                    let len = mi_global.jedzenie.listaJedzenia.length;
                                    for (let i = 0; i < mi_global.jedzenie.listaJedzenia.length; i++) {
                                        if (parseInt(jedzenie["wartoscLeczenia"]) > parseInt(mi_global.jedzenie.listaJedzenia[i]["wartoscLeczenia"])) {
                                            mi_global.jedzenie.listaJedzenia.splice(i, 0, jedzenie);
                                            break;
                                        }
                                    }
                                    if (mi_global.jedzenie.listaJedzenia.length === len) mi_global.jedzenie.listaJedzenia.push(jedzenie);
                                }
                            }
                        })
                    });

                    mi_global.jedzenie.zapiszDoPamieciLokalnej();

                    if (document.querySelector("#mi_panel") !== null)
                        mi_global.jedzenie.panelInformacji.odswiezDane();
                } catch (e) {
                    zglos(e);
                }
            },

            jedz: function (jedzenie) {
                if (jedzenie == null) {
                    return;
                }

                if (mi_global.przydatne.getAllUrlParams().mod !== "overview" && (mi_global.przydatne.getAllUrlParams().doll !== "1") || mi_global.przydatne.getAllUrlParams().doll === undefined) {
                    let akcje = "mi_global.jedzenie.jedz(new mi_global.jedzenie.jedzenie(\"" + jedzenie["idPrzedmiotu"] + "\", " + jedzenie["numerInwentarza"] + ", \"" + jedzenie["wartoscLeczenia"] + "\"));";
                    localStorage.setItem("automatyzacja_akcje", akcje);
                    window.location.href = mi_global.przydatne.link({"mod": "overview", "doll": 1});

                    return;
                }
                mi_global.jedzenie.wczytajZPamieciLokalnej();
                let zakladki = document.querySelectorAll("a[data-available='true']");

                mi_global.przydatne.fireMouseEvent('click', zakladki[jedzenie["numerInwentarza"]], 0, 0);

                let przedmiot = document.getElementById("inv").querySelector("div[class*='item-i-7'][data-item-id='" + parseInt(jedzenie["idPrzedmiotu"]) + "']");
                let postac = document.getElementById("avatar").querySelector("div[class*='ui-droppable']");

                //Usuwanie z listy
                let index = -1;
                mi_global.jedzenie.listaJedzenia.forEach(function (value, index2) {
                    if (value.idPrzedmiotu === jedzenie.idPrzedmiotu) index = index2;
                });
                if (index > -1) {
                    mi_global.jedzenie.listaJedzenia.splice(index, 1);
                }
                mi_global.jedzenie.zapiszDoPamieciLokalnej();

                if (przedmiot !== null && postac !== null)
                    mi_global.przydatne.triggerDragAndDrop(przedmiot, postac);

                mi_global.jedzenie.panelInformacji.odswiezDane();

                setTimeout(function () {
                    if (parseInt(document.getElementById("char_leben").innerText.match(/\d+/g)[0]) < parseInt(mi_global.ustawienia.get("docelowe_zycie", 21)))
                        mi_global.jedzenie.jedz(mi_global.jedzenie.wybierzPrzedmiot());
                }, 1000);
            },

            wybierzPrzedmiot: function () {
                mi_global.jedzenie.wczytajZPamieciLokalnej();

                if (mi_global.jedzenie.listaJedzenia.length <= 0) {
                    let ilosc_szukan = mi_global.dane.get("ilosc_szukan", 1);
                    if (ilosc_szukan > 0) {
                        mi_global.dane.set("ilosc_szukan", mi_global.dane.get("ilosc_szukan", 1) - 1);
                        mi_global.jedzenie.szukajJedzenia();

                        setTimeout(mi_global.jedzenie.pilnujZycia, 2000);

                        return;
                    } else {
                        mi_global.dane.set("ilosc_szukan", 1)
                    }

                    mi_global.przydatne.wlasnyAlert("Brak jedzeznia w ekwipunku");
                    if (mi_global.ustawienia.get('brak_jedzenia_aktywny', false)) {
                        mi_global.ustawienia.set('jedzenie_aktywny', false);
                        mi_global.ustawienia.set('arena_aktywny', false);
                        mi_global.ustawienia.set('wyprawa_aktywny', false);
                    }
                    return;
                }

                let zwracane = null;
                let roznica = parseInt(document.querySelector("#header_values_hp_bar").getAttribute("data-max-value")) - parseInt(document.querySelector("#header_values_hp_bar").getAttribute("data-value"));
                mi_global.jedzenie.listaJedzenia.every(function (value) {
                    if (parseInt(value["wartoscLeczenia"]) < roznica) {
                        zwracane = value;
                        return false;
                    }
                    return true;
                });

                return zwracane || mi_global.jedzenie.listaJedzenia.getLast();
            },

            pilnujZycia: function () {
                if (localStorage.getItem("automatyzacja_akcje") === null || localStorage.getItem("automatyzacja_akcje").indexOf("mi_global.jedzenie.jedz") === -1)
                    setTimeout(function () {
                        try {
                            if (mi_global.ustawienia.get('jedzenie_aktywny', false)) {
                                if (parseInt(document.getElementById("header_values_hp_percent").innerText.match(/\d+/g)[0]) < parseInt(mi_global.ustawienia.get("min_zycia", 20))) {
                                    mi_global.jedzenie.jedz(mi_global.jedzenie.wybierzPrzedmiot());
                                }
                            }
                        } catch (e) {
                            setTimeout(mi_global.jedzenie.pilnujZycia, 5000);
                        }
                    }, 2000);
            },

            panelInformacji: {
                dodajPanel: function () {
                    if (document.querySelector("#mi_panel") !== null) return;

                    jQuery('#container_game').prepend('<style>.informacja{display: inline-block; margin-left: 10px; margin-right: 10px;}#mi_panel{background-color: #290d03cc; color: #dcbb85; text-align: center; padding: 5px; width: 910px; margin: auto;}#mi_panel input[type=\'button\']{float: right; margin: -1px;}.pasek{z-index: 9000; position: fixed; top: 0; left: 0; right: 0;}</style><div id="mi_panel"> <div class="informacja"> <span>Punkty życia: </span> <span id="mi_panel_pz">100</span> </div><div class="informacja"> <span>Ilość jedzenia: </span> <span id="mi_panel_jedzenie">0</span> </div><div class="informacja"> <span>Życie z jedzenia: </span> <span id="mi_panel_pzjedzenie">0</span> </div><input type="button" value="Szukaj jedzenia w eq" onclick="mi_global.jedzenie.szukajJedzenia()"></div>');

                    mi_global.jedzenie.panelInformacji.ukonczDodawaniePanelu();
                },

                ukonczDodawaniePanelu: function () {
                    if (document.querySelector("#mi_panel") === null) {
                        setTimeout(mi_global.jedzenie.panelInformacji.ukonczDodawaniePanelu, 100);
                    } else {
                        mi_global.jedzenie.panelInformacji.odswiezDane();

                        let top = typeof gca !== 'undefined' ? 183 : 141;
                        let margin = typeof gca !== 'undefined' ? 58 : 28;

                        let bt = document.getElementById("banner_top");
                        let be = document.getElementById("banner_event");
                        let ci = document.getElementById("chat_icon");
                        let cbe = document.getElementById("cooldown_bar_event");

                        if (bt != null)
                            bt.style.cssText += "top: " + top + "px !important";
                        if (be != null)
                            be.style.cssText += "top: " + top + "px !important";
                        if (ci != null)
                            ci.style.cssText += "top: 143px !important";
                        if (cbe != null)
                            cbe.style.cssText += "margin-top: " + margin + "px !important";

                        if (typeof gca !== 'undefined') document.getElementById("mi_panel").style.top = "24px";

                        window.addEventListener("scroll", function () {
                            mi_global.jedzenie.panelInformacji.onscroll();
                        });

                        mi_global.jedzenie.panelInformacji.onscroll();
                    }
                },

                odswiezDane: function () {
                    if (document.querySelector("#mi_panel") === null) {
                        setTimeout(mi_global.jedzenie.panelInformacji.odswiezDane, 100);
                        return;
                    }
                    mi_global.jedzenie.wczytajZPamieciLokalnej();

                    let akt = parseInt(document.querySelector("#header_values_hp_bar").getAttribute("data-value"));
                    let max = parseInt(document.querySelector("#header_values_hp_bar").getAttribute("data-max-value"));

                    let pz = akt;
                    pz += "/" + max;
                    pz += " (" + Math.round(akt / max * 100) + "%)";
                    document.getElementById("mi_panel_pz").innerText = pz;
                    document.getElementById("mi_panel_jedzenie").innerText = mi_global.jedzenie.listaJedzenia.length.toString();

                    let suma = 0;
                    mi_global.jedzenie.listaJedzenia.forEach(function (value) {
                        suma += parseInt(value.wartoscLeczenia);
                    });
                    document.getElementById("mi_panel_pzjedzenie").innerText = suma.toString();
                },

                onscroll: function () {
                    let przesuniecie = parseInt((document.all ? document.scrollTop : window.pageYOffset));

                    if (przesuniecie > 35) {
                        document.getElementById("mi_panel").classList.add("pasek");

                        let bt = document.getElementById("banner_top");
                        let be = document.getElementById("banner_event");
                        let ci = document.getElementById("chat_icon");

                        if (bt != null)
                            bt.style.top = "0";
                        if (be != null)
                            be.style.top = "0";
                        if (ci != null)
                            ci.style.top = "0";
                    } else {
                        document.getElementById("mi_panel").classList.remove("pasek");

                        let top = typeof gca !== 'undefined' ? 183 : 141;

                        let bt = document.getElementById("banner_top");
                        let be = document.getElementById("banner_event");
                        let ci = document.getElementById("chat_icon");

                        if (bt != null)
                            bt.style.cssText += "top: " + top + "px !important";
                        if (be != null)
                            be.style.cssText += "top: " + top + "px !important";
                        if (ci != null)
                            ci.style.cssText += "top: 143px !important";
                    }
                }
            }
        },

        arenaCT: {
            trybyWyboru: {
                0: "losowy",
                1: "najlepszy",
                2: "symulator",
                3: "najnizszy"
            },

            rodzajprovinciarum: {
                2: "arena",
                3: "ct"
            },

            sendRequestArena: function (method, url, data) {
                let request = {
                    method: method,
                    url: url,
                    data: data + "&a=" + new Date().getTime() + "&sh=" + mi_global.przydatne.getAllUrlParams()['sh'],
                    onComplete: function (response) {
                        if (response.indexOf("document.location.href = ") === -1) {
                            if (parseInt(localStorage.getItem("mi_" + url.split("/")[1]) || 0) >= 10) {
                                localStorage.setItem("mi_" + url.split("/")[1], 0);
                                mi_global.przydatne.wlasnyAlert(
                                    "Wszyscy przeciwnicy na " + url.split("/")[1] === "doArenaFight.php" ? "arenie" : "CT" + " zostali już po zaatakowani 5 razy. Rozpocznij ponownie jutro.", "Arena/CT");
                            } else {
                                localStorage.setItem("mi_" + url.split("/")[1], parseInt(localStorage.getItem("mi_" + url.split("/")[1]) || 0) + 1);
                                mi_global.arenaCT.automat();
                            }
                        } else {
                            localStorage.setItem("mi_" + url.split("/")[1], 0);
                        }
                        eval(response);
                    }
                };

                new Request(request).send()
            },

            startFight: function (a) {
                this.sendRequestArena("get", "ajax/doArenaFight.php", "did=" + a)
            },

            startGroupFight: function (a) {
                this.sendRequestArena("get", "ajax/doGroupFight.php", "did=" + a)
            },

            startProvinciarumFight: function (a, c, b, e) {
                sendRequest("get", "ajax.php", "mod=arena&submod=doCombat&aType=" + a + "&opponentId=" + c + "&serverId=" + b + "&country=" + e)
            },

            //TODO: Zrobić system requestów
            symulatorArena: function (gracze, index, maxSzanse, maxSzanseId) {
                let krajSerwer = window.location.host.split(".")[0].split("-");
                let kraj = krajSerwer[1];
                let serwer = krajSerwer[0].substr(1);
                let nick = gracze[gracze.length - 1].querySelector(".ellipsis").innerText;
                let przeciwnik = gracze[index].querySelector(".ellipsis").innerText;

                jQuery.getJSON("https://gladiatussimulator.tk/monkey-brain/arena.json?a-country=" + kraj + "&a-server=" + serwer + "&a-name=" + nick + "&d-country=" + kraj + "&d-server=" + serwer + "&d-name=" + przeciwnik,
                    function (data) {
                        console.log(data);
                        if (index < 4)
                            mi_global.arenaCT.symulatorArena(gracze, index + 1, -1, -1);
                    });
            },

            arena: function () {
                jQuery.get(mi_global.przydatne.link({
                    "mod": "arena"
                }), function (content) {
                    let idPrzeciwnika = -1;
                    let nrPrzeciwnika = -1;
                    let strona = document.createElement("div");
                    strona.innerHTML = content;
                    let gracze = strona.querySelectorAll("aside.right tr");

                    if (gracze.length <= 2) return;

                    switch (mi_global.ustawienia.get('arena_dobor', 0) * 1) {
                        case 1: {
                            nrPrzeciwnika = (parseInt(localStorage.getItem("mi_ostatni_arena")) || 0) % (gracze.length - 2);
                            nrPrzeciwnika++;
                            idPrzeciwnika = gracze[nrPrzeciwnika].innerHTML.match(/startFight\(this, \d+\)/g)[0].match(/\d+/g)[0];
                            break;
                        }
                        default: {
                            nrPrzeciwnika = Math.floor(Math.random() * (gracze.length - 2)) + 1;
                            idPrzeciwnika = gracze[nrPrzeciwnika].innerHTML.match(/startFight\(this, \d+\)/g)[0].match(/\d+/g)[0];
                            break;
                        }
                    }
                    if (idPrzeciwnika !== -1 && nrPrzeciwnika !== -1) {
                        localStorage.setItem("mi_ostatni_arena", nrPrzeciwnika);
                        localStorage.setItem("automatyzacja_akcje", 'if(document.querySelector(".reportWin") !== null)localStorage.setItem("mi_ostatni_arena",0);');
                        mi_global.arenaCT.startFight(idPrzeciwnika);
                    }
                });
            },

            ct: function () {
                jQuery.get(mi_global.przydatne.link({
                    "mod": "arena",
                    "submod": "grouparena"
                }), function (content) {
                    let idPrzeciwnika = -1;
                    let nrPrzeciwnika = -1;
                    var strona = document.createElement("div");
                    strona.innerHTML = content;
                    let gracze = strona.querySelectorAll("aside.right tr");

                    if (gracze.length <= 2) return;

                    switch (mi_global.ustawienia.get('ct_dobor', 0) * 1) {
                        case 1: {
                            nrPrzeciwnika = (parseInt(localStorage.getItem("mi_ostatni_ct")) || 0) % (gracze.length - 2);
                            nrPrzeciwnika++;
                            idPrzeciwnika = gracze[nrPrzeciwnika].innerHTML.match(/startGroupFight\(this, \d+\)/g)[0].match(/\d+/g)[0];
                            break;
                        }
                        default: {
                            nrPrzeciwnika = Math.floor(Math.random() * (gracze.length - 2)) + 1;
                            idPrzeciwnika = gracze[nrPrzeciwnika].innerHTML.match(/startGroupFight\(this, \d+\)/g)[0].match(/\d+/g)[0];
                            break;
                        }
                    }
                    if (idPrzeciwnika !== -1 && nrPrzeciwnika !== -1) {
                        localStorage.setItem("mi_ostatni_ct", nrPrzeciwnika);
                        localStorage.setItem("automatyzacja_akcje", 'if(document.querySelector(".reportWin") !== null)localStorage.setItem("mi_ostatni_ct",0);');
                        mi_global.arenaCT.startGroupFight(idPrzeciwnika);
                    }
                });
            },

            provinciarum: function (aType) {
                jQuery.get(mi_global.przydatne.link({
                    "mod": "arena",
                    "submod": "serverArena",
                    "aType": aType
                }), function (content) {
                    let idPrzeciwnika = -1;
                    let serwer = -1;
                    let kraj = '';
                    let nrPrzeciwnika = -1;
                    var strona = document.createElement("div");
                    strona.innerHTML = content;
                    let gracze = strona.querySelectorAll("#own" + aType + " tr");

                    if (gracze.length <= 1) return;

                    switch (mi_global.ustawienia.get(mi_global.arenaCT.rodzajprovinciarum[aType] + '_dobor', 0) * 1) {
                        case 1: {
                            nrPrzeciwnika = (parseInt(localStorage.getItem("mi_ostatni_" + mi_global.arenaCT.rodzajprovinciarum[aType])) || 0) % (gracze.length - 1);
                            nrPrzeciwnika++;
                            break;
                        }
                        case 3: {
                            let najnizszyLv = parseInt(gracze[1].getElementsByTagName("td")[1].innerText);
                            nrPrzeciwnika = 1;
                            for (let i = 2; i < gracze.length; i++) {
                                let kolumny = gracze[i].getElementsByTagName("td");
                                let lv = parseInt(kolumny[1].innerText);
                                if (lv < najnizszyLv) {
                                    najnizszyLv = lv;
                                    nrPrzeciwnika = i;
                                }
                            }
                            break;
                        }
                        default: {
                            nrPrzeciwnika = Math.floor(Math.random() * (gracze.length - 1)) + 1;
                            break;
                        }
                    }

                    if (nrPrzeciwnika !== -1) {
                        let informacje = gracze[nrPrzeciwnika].innerHTML.match(/startProvinciarumFight\(this, \d+, \d+, \d+, '.+'\)/g)[0];
                        let liczbyInformacje = informacje.match(/\d+/g);
                        idPrzeciwnika = liczbyInformacje[1];
                        serwer = liczbyInformacje[2];
                        kraj = informacje.match(/'.+'/g)[0];
                        kraj = kraj.substr(1, kraj.length - 2);
                    }

                    if (idPrzeciwnika !== -1 && nrPrzeciwnika !== -1) {
                        localStorage.setItem("mi_ostatni_" + mi_global.arenaCT.rodzajprovinciarum[aType], nrPrzeciwnika);
                        localStorage.setItem("automatyzacja_akcje", 'if(document.querySelector(".reportWin") !== null)localStorage.setItem("mi_ostatni_' + mi_global.arenaCT.rodzajprovinciarum[aType] + '",0);');
                        mi_global.arenaCT.startProvinciarumFight(aType, idPrzeciwnika, serwer, kraj);
                    }
                });
            },

            automat: function () {
                setTimeout(function () {
                    let cda = document.getElementById("cooldown_bar_text_arena");
                    let cdct = document.getElementById("cooldown_bar_text_ct");
                    if (cda !== null && cdct !== null && cda.innerHTML !== '-' && cdct.innerHTML !== '-') {
                        if (mi_global.ustawienia.get('arena_aktywny', false)) {
                            setTimeout(function () {
                                if (mi_global.ustawienia.get('arena_provinciarum', false))
                                    mi_global.arenaCT.provinciarum(2);
                                else
                                    mi_global.arenaCT.arena();
                            }, mi_global.przydatne.getCooldown("cooldown_bar_text_arena") + mi_global.przydatne.dodatkoweOpoznienie());
                        }
                        if (mi_global.ustawienia.get('ct_aktywny', false)) {
                            setTimeout(function () {
                                if (mi_global.ustawienia.get('ct_provinciarum', false))
                                    mi_global.arenaCT.provinciarum(3);
                                else
                                    mi_global.arenaCT.ct();
                            }, mi_global.przydatne.getCooldown("cooldown_bar_text_ct") + mi_global.przydatne.dodatkoweOpoznienie());
                        }
                    } else setTimeout(mi_global.automatyzacjaAtak.automat, 10000);
                }, 2000);
            }
        },

        roztapiarka: {
            automat: function () {
                if (mi_global.ustawienia.get('roztapiarka_aktywny', false))
                    setTimeout(mi_global.roztapiarka.sprawdzCzasy, 2000);
                else
                    mi_global.ustawienia.set('roztapiarka_aktywny', false);
            },

            sprawdzCzasy: function (od = 0) {
                for (let i = od; i < 6; i++) {
                    let value = mi_global.dane.get("roztapiarka_czas", []);
                    let czasZakladki = value[i];
                    if (!czasZakladki) czasZakladki = 0;

                    let timeOut = czasZakladki - Date.now();
                    if (timeOut < 100) timeOut = 100;

                    setTimeout(function () {
                        mi_global.roztapiarka.wrzucPrzedmiot(i);
                    }, timeOut);
                    if (timeOut <= 2000) {
                        setTimeout(function () {
                            mi_global.roztapiarka.sprawdzCzasy(i + 1);
                        }, 2000);
                        break;
                    }
                }
            },

            wrzucPrzedmiot: function (zakladkaRoztapiarki) {
                if (mi_global.przydatne.getAllUrlParams().mod !== "forge" || mi_global.przydatne.getAllUrlParams().submod !== "smeltery") {
                    window.location.href = mi_global.przydatne.link({"mod": "forge", "submod": "smeltery"});

                    return;
                }

                showForgeBox(zakladkaRoztapiarki);

                //wysłanie pakietu
                if (document.getElementById("slot-finished-succeeded").className !== "hidden") {
                    document.getElementById("forge_lootbox").click();

                    return;
                }

                if (document.getElementById("slot-closed").className === "hidden") {
                    setTimeout(function () {
                        let napis = document.querySelector("#forge_time_remaining");
                        let czasTrwania;
                        if (napis && (czasTrwania = napis.innerText.match(/(\d+):(\d+):(\d+)/))) {
                            czasTrwania = (parseInt(czasTrwania[1], 10) * 60 * 60 + parseInt(czasTrwania[2], 10) * 60 + parseInt(czasTrwania[3], 10)) * 1000;
                            czasTrwania += mi_global.przydatne.dodatkoweOpoznienie();
                            let dataZakonczenia = Date.now() + czasTrwania;
                            let value = mi_global.dane.get("roztapiarka_czas", []);
                            value[zakladkaRoztapiarki] = dataZakonczenia;
                            mi_global.dane.set("roztapiarka_czas", value);
                        }
                    }, 1500);

                    return;
                }

                //wybor przedmiotu
                let zakladki = document.querySelectorAll("a[data-available='true']");

                let saPrzedmioty = false;

                for (let index = 0; index < zakladki.length; index++) {
                    if (mi_global.ustawienia.get('roztapiarka_zakladka_' + parseInt(index + 1), false)) {
                        mi_global.przydatne.fireMouseEvent("click", zakladki[index], 0, 0);

                        let query = "";
                        for (let i = 1; i <= 9; i++)
                            if (i !== 7) query += "div[class*='item-i-" + i + "-'],";
                        query = query.substr(0, query.length - 1);

                        let przedmioty = document.getElementById("inv").querySelectorAll(query);

                        let pole = document.getElementById("itembox");
                        if (przedmioty.length > 0 && pole !== null) {
                            saPrzedmioty = true;
                            //aktywacja
                            mi_global.przydatne.triggerDragAndDrop(przedmioty[0], pole);
                            setTimeout(function () {
                                let napis = document.querySelector("#forge_duration span");
                                let czasTrwania;
                                if (napis && (czasTrwania = napis.innerText.match(/(\d+):(\d+):(\d+)/))) {
                                    czasTrwania = (parseInt(czasTrwania[1], 10) * 60 * 60 + parseInt(czasTrwania[2], 10) * 60 + parseInt(czasTrwania[3], 10)) * 1000;
                                    czasTrwania += mi_global.przydatne.dodatkoweOpoznienie();
                                    let dataZakonczenia = Date.now() + czasTrwania;
                                    let value = mi_global.dane.get("roztapiarka_czas", []);
                                    value[zakladkaRoztapiarki] = dataZakonczenia;
                                    mi_global.dane.set("roztapiarka_czas", value);
                                    document.querySelector("#rent div[data-rent='2']").click();

                                    setTimeout(function () {
                                        if (document.querySelectorAll(".error").length > 0) {
                                            let value = mi_global.dane.get("roztapiarka_czas", []);
                                            value[zakladkaRoztapiarki] = null;
                                            mi_global.dane.set("roztapiarka_czas", value);
                                        }
                                    }, 500);
                                }
                            }, 500);
                            break;
                        }
                    }
                }
                if (!saPrzedmioty) {
                    mi_global.ustawienia.set('roztapiarka_aktywny', false);
                    mi_global.przydatne.wlasnyAlert("Skończyły się przedmioty do roztapiania", "Roztapiarka");
                }
            }
        },

        paczki: {
            kup: function (buyid, cena) {
                let minZloto = parseInt(mi_global.ustawienia.get("paczki_min_zloto", 100000));
                cena = parseInt(cena);

                if (minZloto > cena)
                    return;

                let xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", mi_global.przydatne.link({"mod": "guildMarket"}), true);
                xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        mi_global.przydatne.wlasnyAlert("Kupiono paczkę za " + cena + " złota.", "Paczki");

                        if (xmlHttp.responseText.indexOf('data-item-id="' + buyid + '"') === -1 && mi_global.ustawienia.get('paczki_odstawianie', false)) {
                            let xmlHttp2 = new XMLHttpRequest();
                            xmlHttp2.open("POST", mi_global.przydatne.link({
                                mod: 'packages',
                                submod: 'sort',
                                page: 1
                            }), true);
                            xmlHttp2.setRequestHeader("Content-type", "text/html; charset=UTF-8");
                            xmlHttp2.onreadystatechange = function () {
                                if (xmlHttp2.readyState === 4 && xmlHttp2.status === 200) {
                                    mi_global.przydatne.wyciagnijZPaczek(mi_global.przydatne.link({mod: 'packages'}), mi_global.paczki.odstaw, cena);
                                }
                            };
                            xmlHttp2.send("packageSorting=in_desc");
                        } else {
                            let akcje = "mi_global.paczki.znajdz(document.querySelector(\"#sstat_gold_val\").innerText.replace(/\\./g, '') * 1, mi_global.paczki.kup)";
                            localStorage.setItem("automatyzacja_akcje", akcje);
                            window.location.href = mi_global.przydatne.link({"mod": "guildMarket"});
                        }
                    }
                };
                xmlHttp.send("buyid=" + buyid + "&buy=Kup");
            },

            znajdz: function (zaIleZlota, callback) {
                let minZloto = parseInt(mi_global.ustawienia.get("paczki_min_zloto", 100000));
                zaIleZlota = parseInt(zaIleZlota);

                if (minZloto > zaIleZlota)
                    return;

                let xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", mi_global.przydatne.link({
                    mod: 'guildMarket',
                    s: 'pd',
                    seller: mi_global.ustawienia.get("paczki_gracze", "")
                }), true);
                xmlHttp.setRequestHeader("Content-type", "text/html; charset=UTF-8");
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        let stronaRynku = jQuery('<div></div>');
                        stronaRynku.html(xmlHttp.responseText);

                        let przedmioty = jQuery('table#market_item_table tr', stronaRynku);

                        for (let i = 1; i < przedmioty.length; i++) {
                            let wiersz = jQuery('td', przedmioty[i]);
                            if (wiersz !== null && jQuery('a span', wiersz)[0] !== null && jQuery('a span', wiersz)[0].style.color !== 'blue') {
                                let cena = parseInt(wiersz[2].innerText.replace(/[\s.]/g, ""));
                                let ileDostepne = mi_global.ustawienia.get('paczki_odstawianie', false) ? cena * 1.04 : cena;
                                if (ileDostepne <= zaIleZlota) {
                                    callback.call(this, wiersz[0].querySelector('div').dataset.itemId, cena);

                                    return;
                                }
                            }
                        }
                        mi_global.przydatne.wlasnyAlert("Nie znaleziono paczki za maksimum " + zaIleZlota + " złota na rynku", 'Paczki');
                    }
                };
                xmlHttp.send();
            },

            odstaw: function (x, y, cena) {
                if (mi_global.przydatne.getAllUrlParams().mod !== "guildmarket") {
                    let akcje = "mi_global.paczki.odstaw(" + x + ", " + y + ", " + cena + ")";
                    setTimeout(function () {
                        localStorage.setItem("automatyzacja_akcje", akcje);
                        window.location.href = mi_global.przydatne.link({"mod": "guildMarket"});
                    }, 100);

                    return;
                }
                let itemId = document.querySelector("#inv div[class*='item-i-'][data-position-x='" + x + "'][data-position-y='" + y + "']").attributes['data-item-id'].value;

                let xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", mi_global.przydatne.link({"mod": "guildMarket"}), true);
                xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        mi_global.przydatne.wlasnyAlert("Odstawiono paczkę za " + cena + " złota.", "Paczki");
                        let akcje = "mi_global.paczki.znajdz(document.querySelector(\"#sstat_gold_val\").innerText.replace(/\\./g, '') * 1, mi_global.paczki.kup)";
                        localStorage.setItem("automatyzacja_akcje", akcje);
                        window.location.href = mi_global.przydatne.link({"mod": "guildMarket"});
                    }
                };
                xmlHttp.send("sellid=" + itemId + "&preis=" + cena + "&dauer=3&anbieten=Oferta");
            },

            sprawdzCzas: function () {
                let iloscZlota = document.querySelector("#sstat_gold_val").innerText.replace(/\./g, '') * 1;
                setTimeout(function () {
                    mi_global.dane.set("paczki_czas", Date.now() + mi_global.ustawienia.get('paczki_czas', 10) * 60 * 1000);
                    mi_global.paczki.znajdz(iloscZlota, mi_global.paczki.kup);
                }, Math.max(0, mi_global.dane.get("paczki_czas") - Date.now()) + mi_global.przydatne.dodatkoweOpoznienie());
            },

            sprawdzZloto: function () {
                let iloscZlota = document.querySelector("#sstat_gold_val").innerText.replace(/\./g, '') * 1;

                let odIlu = mi_global.ustawienia.get('paczki_odstawianie', false) ? mi_global.ustawienia.get("paczki_zloto", 500000) * 1.04 : mi_global.ustawienia.get("paczki_zloto", 500000);
                if (iloscZlota >= odIlu) {
                    setTimeout(function () {
                        mi_global.paczki.znajdz(iloscZlota, mi_global.paczki.kup);
                    }, mi_global.przydatne.dodatkoweOpoznienie());
                }
            },

            automat: function () {
                let iloscZlota = parseInt(document.querySelector("#sstat_gold_val").innerText.replace(/\./g, ''));
                if (mi_global.ustawienia.get('paczki_aktywny', false) && mi_global.ustawienia.get("paczki_min_zloto", 100000) <= iloscZlota) {
                    if (parseInt(mi_global.ustawienia.get('paczki_czas', 10)) !== 0)
                        mi_global.paczki.sprawdzCzas();
                    if (parseInt(mi_global.ustawienia.get("paczki_zloto", 500000)) !== 0)
                        mi_global.paczki.sprawdzZloto();
                }
            },

            wyborGraczy: {
                utworzenieDialogu: function () {
                    let tresc = "<table border=\"1px\" style=\"text-align: center\"> <tr> <th>Nazwa gracza</th> <th>Kupować?</th> </tr>";
                    jQuery.get(mi_global.przydatne.link({
                        "mod": "guild",
                        "submod": "memberList"
                    }), function (content) {
                        let strona = jQuery('<div></div>');
                        strona.html(content);

                        let gracze = jQuery("#mainbox table tr", strona);
                        let aktualniGracze = mi_global.ustawienia.get("paczki_gracze", " ");
                        for (let i = 1; i < gracze.length; i++) {
                            let nick = jQuery("td a", gracze[i])[0].innerText;
                            tresc += "<tr><td>" + nick + "</td><td><input type='checkbox' value='" + nick + "' ";
                            tresc += aktualniGracze.indexOf(nick) !== -1 ? "checked" : "";
                            tresc += "/></td></tr>";
                        }
                        tresc += "</table>";

                        jQuery('<div></div>').html(tresc).dialog({
                            title: "Wybór graczy do odkupowania",
                            resizable: false,
                            dialogClass: 'close',
                            buttons: {
                                'Zapisz': function () {
                                    mi_global.paczki.wyborGraczy.zapisz(jQuery("input[type='checkbox']", this));
                                    jQuery(this).dialog('close');

                                },
                                'Anuluj': function () {
                                    jQuery(this).dialog('close');
                                }
                            }
                        });
                    });
                },

                zapisz: function (zaznaczenia) {
                    let gracze = " ";
                    for (let i = 0; i < zaznaczenia.length; i++) {
                        if (zaznaczenia[i].checked === true) {
                            gracze += zaznaczenia[i].value + "+";
                        }
                    }
                    mi_global.ustawienia.set("paczki_gracze", gracze);
                    mi_global.przydatne.wlasnyAlert("Pomyślnie zapisano listę graczy.", "Paczki");
                }
            }
        },

        zadania: {
            zakonczPowtorzZadania: function (powtorzyc = false) {
                jQuery.get(mi_global.przydatne.link({
                    "mod": "quests"
                }), function (content) {
                    let strona = document.createElement('div');
                    strona.innerHTML = content;

                    strona.querySelectorAll(powtorzyc ? ".quest_slot_button_restart" : ".quest_slot_button_finish").forEach(function (elem) {
                        let xmlHttp = new XMLHttpRequest();
                        xmlHttp.open("GET", elem.href, true);
                        xmlHttp.setRequestHeader("Content-type", "text/html; charset=UTF-8");
                        xmlHttp.send();
                    });
                });
            },

            wezZadanie: function () {
                let query = "";
                let kategorie = mi_global.ustawienia.get("zadania_typy", {});

                for (let kategoria in kategorie) {
                    if (kategorie[kategoria])
                        query += ".contentboard_slot_inactive div[style*='_" + kategoria + "_'], ";
                }
                query = query.slice(0, -2);

                jQuery.get(mi_global.przydatne.link({
                    "mod": "quests"
                }), function (content) {
                    let strona = document.createElement('div');
                    strona.innerHTML = content;

                    let ilosc = strona.querySelector("#quest_header_accepted").innerText.match(/\d+/g);
                    if (ilosc[0] / ilosc[1] >= 1)
                        return;

                    let zadania = strona.querySelectorAll(query);
                    let zadanieAkceptuj = null;
                    if (kategorie['czas'] && kategorie['rzad'] && zadania.length > 0) {
                        zadanieAkceptuj = 0;
                    } else if (!kategorie['rzad'] && !kategorie['czas']) {
                        for (let i = 0; i < zadania.length; i++) {
                            if (zadania[i].parentElement.querySelector(".quest_slot_time") === null
                                && zadania[i].parentElement.querySelector(".quest_slot_title").innerText.indexOf("z rzędu") === -1) {
                                zadanieAkceptuj = i;
                                break;
                            }
                        }
                    } else if (!kategorie['rzad']) {
                        for (let i = 0; i < zadania.length; i++) {
                            if (zadania[i].parentElement.querySelector(".quest_slot_title").innerText.indexOf("z rzędu") === -1) {
                                zadanieAkceptuj = i;
                                break;
                            }
                        }
                    } else if (!kategorie['czas']) {
                        for (let i = 0; i < zadania.length; i++) {
                            if (zadania[i].parentElement.querySelector(".quest_slot_time") === null) {
                                zadanieAkceptuj = i;
                                break;
                            }
                        }
                    }

                    let href = null;
                    if (zadanieAkceptuj !== null) {
                        let elem = zadania[zadanieAkceptuj].parentElement.querySelector(".quest_slot_button_accept");
                        href = elem.href;
                    } else {
                        href = mi_global.przydatne.link({
                            mod: "quests",
                            submod: "resetQuests"
                        });
                    }
                    let xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", href, true);
                    xmlHttp.setRequestHeader("Content-type", "text/html; charset=UTF-8");
                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                            let strona = document.createElement('div');
                            strona.innerHTML = xmlHttp.responseText;

                            let czas = strona.querySelector("#quest_header_cooldown span.ticker");
                            czas = czas !== null ? czas.dataset.tickerTimeLeft : 60000;
                            mi_global.dane.set("zadania_czas", Date.now() + czas * 1 + 5000)
                        }
                    };
                    xmlHttp.send();
                });
            },

            sprawdzCzas: function () {
                let czas = mi_global.dane.get("zadania_czas", Date.now())
                setTimeout(mi_global.zadania.wezZadanie, czas - Date.now() + mi_global.przydatne.dodatkoweOpoznienie());
            },

            wymusOdswiezenieZakonczenie: function (coIleMinut) {
                let data = new Date();
                setTimeout(function () {
                    mi_global.zadania.zakonczPowtorzZadania(true);
                    mi_global.zadania.zakonczPowtorzZadania();
                }, (5 - (data.getMinutes() % coIleMinut)) * 60 * 1000 || 100);
            },

            automat: function () {
                if (mi_global.ustawienia.get('zadania_aktywny', false)) {
                    if (document.querySelector('a[href*=quests]').innerText.match(/\(\d+\)/g) !== null)
                        setTimeout(mi_global.zadania.zakonczPowtorzZadania, mi_global.przydatne.dodatkoweOpoznienie());

                    mi_global.zadania.sprawdzCzas();
                    mi_global.zadania.wymusOdswiezenieZakonczenie(5);
                }
            }
        },

        eventy: {
            czytajInformacjeZeStrony: function () {
                if (!document.querySelector("#submenu2 a.menuitem.glow"))
                    return;

                let obecny = mi_global.przydatne.getAllUrlParams();
                let eventowy = mi_global.przydatne.getAllUrlParams(document.querySelector("#submenu2 a.menuitem.glow").href);

                if (obecny.submod !== "serverquest" && obecny.loc !== eventowy.loc) {
                    let akcje = "mi_global.eventy.czytajInformacjeZeStrony();";
                    localStorage.setItem("automatyzacja_akcje", akcje);
                    window.location.href = document.querySelector("#submenu2 a.menuitem.glow").href;

                    return;
                }

                let liczbaPunktow = document.getElementById("content").getElementsByClassName("section-header")[0].parentNode.innerHTML.match(/(\d+)\s*<img/im);
                if (liczbaPunktow) {
                    liczbaPunktow = parseInt(liczbaPunktow[1]);
                } else {
                    liczbaPunktow = 0;
                }

                let id = document.querySelector("#expedition_list button").attributes.onclick.value.match(/'&\S+(\d+)'/mi);
                if (id)
                    id = parseInt(id[1]);
                else
                    id = null;

                let data = JSON.parse(document.querySelector("#server-time").attributes['data-start-time'].value);
                data = new Date(data[0], data[1] - 1, data[2]);

                mi_global.dane.set("ilosc_punktow", liczbaPunktow);
                mi_global.dane.set("id_eventu", id);
                mi_global.dane.set("event_ostatnia_data", data * 1);
            },

            atak: function () {
                let url = mi_global.przydatne.getAllUrlParams(document.querySelector("#submenu2 a.menuitem.glow").href);
                if (!mi_global.dane.get("id_eventu") && url.loc !== 'wild_farm' && url.loc !== 'nile_bank') {
                    mi_global.eventy.czytajInformacjeZeStrony();
                    return;
                }

                if (url.loc === 'wild_farm' || url.loc === 'nile_bank')
                    mi_global.automatyzacjaAtak.attack(null, url.loc, mi_global.ustawienia.get("event_potwor", 1), false, '');
                else
                    mi_global.automatyzacjaAtak.attack(null, url.loc, mi_global.ustawienia.get("event_potwor", 1), false, '&serverQuest=' + mi_global.dane.get('id_eventu'));

                mi_global.dane.set("event_czas", Date.now() + 5 * 60 * 1000 + mi_global.przydatne.dodatkoweOpoznienie());
                mi_global.dane.set("ilosc_punktow", mi_global.dane.get("ilosc_punktow", 0) - 1);
            },

            sprawdzCzas: function () {

                if (mi_global.dane.get("ilosc_punktow", 0) <= 0)
                    return;

                let czas = mi_global.dane.get("event_czas", Date.now());
                setTimeout(mi_global.eventy.atak, (czas - Date.now()) + mi_global.przydatne.dodatkoweOpoznienie());
            },

            sprawdzDate: function () {
                let data = JSON.parse(document.querySelector("#server-time").attributes['data-start-time'].value);
                data = new Date(data[0], data[1] - 1, data[2]);

                if (data > mi_global.dane.get("event_ostatnia_data")) {
                    mi_global.eventy.czytajInformacjeZeStrony();
                } else {
                    data.setDate(data.getDate() + 1);
                    let data2 = JSON.parse(document.querySelector("#server-time").attributes['data-start-time'].value);
                    data2 = new Date(data2[0], data2[1] - 1, data2[2], data2[3], data2[4], data2[5], data2[6]);
                    setTimeout(mi_global.eventy.czytajInformacjeZeStrony, data - data2)
                }
            },

            automat: function () {
                if (!mi_global.ustawienia.get('event_aktywny', false))
                    return;

                if (document.querySelector("#submenu2 a.menuitem.glow") === null) {
                    mi_global.ustawienia.set('event_aktywny', false);
                    return;
                }

                let obecny = mi_global.przydatne.getAllUrlParams();
                let eventowy = mi_global.przydatne.getAllUrlParams(document.querySelector("#submenu2 a.menuitem.glow").href);

                if (obecny.submod === "serverquest" || eventowy.loc === obecny.loc)
                    mi_global.eventy.czytajInformacjeZeStrony();

                if (mi_global.ustawienia.get('event_aktywny', false)) {
                    mi_global.eventy.sprawdzCzas();
                    mi_global.eventy.sprawdzDate();
                }
            }
        }
    };
    window.mi_global = mi_global;

    function zglos(e) {
        //Może kiedyś
    }

//Wywołanie funkcji
    if (mi_global.przydatne.getAllUrlParams().mod !== "start" && mi_global.przydatne.getAllUrlParams().mod !== "downtime") {
        console.log("W razie błędów pisz gg: 10563110. Pozdrawiam");
        let func = function () {
            try {
                //Działające tylko w hadesie
                if (document.querySelector('.underworld') == null) {
                    //Działające tylko poza hadesem
                    mi_global.jedzenie.pilnujZycia();
                    mi_global.automatyzacjaAtak.automat();
                    mi_global.eventy.automat();
                }
                //Hadesoobojętne
                mi_global.przydatne.wykonajAkcje();
                mi_global.interfejs.dodajInterfejs();
                mi_global.jedzenie.panelInformacji.dodajPanel();
                mi_global.arenaCT.automat();
                mi_global.roztapiarka.automat();
                mi_global.paczki.automat();
                mi_global.zadania.automat();
            } catch (e) {
                zglos(e);
            }
        };

        if (window.addEventListener) {
            window.addEventListener('load', func)
        } else {
            window.attachEvent('onload', func)
        }

        setTimeout(function () {
            if (document.querySelector("#moj_interfejs") === null)
                func();
        }, 1000);
    }
})();