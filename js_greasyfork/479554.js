// ==UserScript==
// @name         TWFG
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  TWFGDESC
// @author       You
// @match        https://*/game.php?*&screen=am_farm
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479554/TWFG.user.js
// @updateURL https://update.greasyfork.org/scripts/479554/TWFG.meta.js
// ==/UserScript==

(function() {
    window.FarmGod = {};
    window.FarmGod.Library = (function () {
        /**** TribalWarsLibrary.js ****/
        if (typeof window.twLib === 'undefined') {
            window.twLib = {
                queues: null,
                init: function () {
                    if (this.queues === null) {
                        this.queues = this.queueLib.createQueues(5);
                    }
                },
                queueLib: {
                    maxAttempts: 3,
                    Item: function (action, arg, promise = null) {
                        this.action = action;
                        this.arguments = arg;
                        this.promise = promise;
                        this.attempts = 0;
                    },
                    Queue: function () {
                        this.list = [];
                        this.working = false;
                        this.length = 0;

                        this.doNext = function () {
                            let item = this.dequeue();
                            let self = this;

                            if (item.action == 'openWindow') {
                                window.open(...item.arguments).addEventListener('DOMContentLoaded', function () {
                                    self.start();
                                });
                            } else {
                                $[item.action](...item.arguments).done(function () {
                                    item.promise.resolve.apply(null, arguments);
                                    self.start();
                                }).fail(function () {
                                    item.attempts += 1;
                                    if (item.attempts < twLib.queueLib.maxAttempts) {
                                        self.enqueue(item, true);
                                    } else {
                                        item.promise.reject.apply(null, arguments);
                                    }

                                    self.start();
                                });
                            }
                        };

                        this.start = function () {
                            if (this.length) {
                                this.working = true;
                                this.doNext();
                            } else {
                                this.working = false;
                            }
                        };

                        this.dequeue = function () {
                            this.length -= 1;
                            return this.list.shift();
                        };

                        this.enqueue = function (item, front = false) {
                            (front) ? this.list.unshift(item) : this.list.push(item);
                            this.length += 1;

                            if (!this.working) {
                                this.start();
                            }
                        };
                    },
                    createQueues: function (amount) {
                        let arr = [];

                        for (let i = 0; i < amount; i++) {
                            arr[i] = new twLib.queueLib.Queue();
                        }

                        return arr;
                    },
                    addItem: function (item) {
                        let leastBusyQueue = twLib.queues.map(q => q.length).reduce((next, curr) => (curr < next) ? curr : next, 0);
                        twLib.queues[leastBusyQueue].enqueue(item);
                    },
                    orchestrator: function (type, arg) {
                        let promise = $.Deferred();
                        let item = new twLib.queueLib.Item(type, arg, promise);

                        twLib.queueLib.addItem(item);

                        return promise;
                    }
                },
                ajax: function () {
                    return twLib.queueLib.orchestrator('ajax', arguments);
                },
                get: function () {
                    return twLib.queueLib.orchestrator('get', arguments);
                },
                post: function () {
                    return twLib.queueLib.orchestrator('post', arguments);
                },
                openWindow: function () {
                    let item = new twLib.queueLib.Item('openWindow', arguments);

                    twLib.queueLib.addItem(item);
                }
            };

            twLib.init();
        }

        /**** Script Library ****/
        const setUnitSpeeds = function () {
            let unitSpeeds = {};

            $.when($.get('/interface.php?func=get_unit_info')).then((xml) => {
                $(xml).find('config').children().map((i, el) => {
                    unitSpeeds[$(el).prop('nodeName')] = $(el).find('speed').text().toNumber();
                });

                localStorage.setItem('FarmGod_unitSpeeds', JSON.stringify(unitSpeeds));
            });
        };

        const getUnitSpeeds = function () {
            return JSON.parse(localStorage.getItem('FarmGod_unitSpeeds')) || false;
        };

        if (!getUnitSpeeds()) setUnitSpeeds();

        const determineNextPage = function (page, $html) {
            let villageLength = ($html.find('#scavenge_mass_screen').length > 0) ? $html.find('tr[id*="scavenge_village"]').length : $html.find('tr.row_a, tr.row_ax, tr.row_b, tr.row_bx').length;
            let navSelect = $html.find('.paged-nav-item').first().closest('td').find('select').first();
            let navLength = ($html.find('#am_widget_Farm').length > 0) ? $html.find('#plunder_list_nav').first().find('a.paged-nav-item').length : ((navSelect.length > 0) ? navSelect.find('option').length - 1 : $html.find('.paged-nav-item').not('[href*="page=-1"]').length);
            let pageSize = ($('#mobileHeader').length > 0) ? 10 : parseInt($html.find('input[name="page_size"]').val());

            if (page == -1 && villageLength == 1000) {
                return Math.floor(1000 / pageSize);
            } else if (page < navLength) {
                return page + 1;
            }

            return false;
        };

        const processPage = function (url, page, wrapFn) {
            let pageText = (url.match('am_farm')) ? `&Farm_page=${page}` : `&page=${page}`;

            return twLib.ajax({
                url: url + pageText
            }).then((html) => {
                return wrapFn(page, $(html));
            });
        };

        const processAllPages = function (url, processorFn) {
            let page = (url.match('am_farm') || url.match('scavenge_mass')) ? 0 : -1;
            let wrapFn = function (page, $html) {
                let dnp = determineNextPage(page, $html);

                if (dnp) {
                    processorFn($html);
                    return processPage(url, dnp, wrapFn);
                } else {
                    return processorFn($html);
                }
            };

            return processPage(url, page, wrapFn);
        };

        const getDistance = function (origin, target) {
            let a = origin.toCoord(true).x - target.toCoord(true).x;
            let b = origin.toCoord(true).y - target.toCoord(true).y;

            return Math.hypot(a, b);
        };

        const subtractArrays = function (array1, array2) {
            let result = array1.map((val, i) => {
                return val - array2[i];
            });

            return (result.some(v => v < 0)) ? false : result;
        };

        const getCurrentServerTime = function () {
            let [hour, min, sec, day, month, year] = $('#serverTime').closest('p').text().match(/\d+/g);
            return new Date(year, (month - 1), day, hour, min, sec).getTime();
        };

        const timestampFromString = function (timestr) {
            let d = $('#serverDate').text().split('/').map(x => +x);
            let todayPattern = new RegExp(window.lang['aea2b0aa9ae1534226518faaefffdaad'].replace('%s', '([\\d+|:]+)')).exec(timestr);
            let tomorrowPattern = new RegExp(window.lang['57d28d1b211fddbb7a499ead5bf23079'].replace('%s', '([\\d+|:]+)')).exec(timestr);
            let laterDatePattern = new RegExp(window.lang['0cb274c906d622fa8ce524bcfbb7552d'].replace('%1', '([\\d+|\\.]+)').replace('%2', '([\\d+|:]+)')).exec(timestr);
            let t, date;

            if (todayPattern !== null) {
                t = todayPattern[1].split(':');
                date = new Date(d[2], (d[1] - 1), d[0], t[0], t[1], t[2], (t[3] || 0));
            } else if (tomorrowPattern !== null) {
                t = tomorrowPattern[1].split(':');
                date = new Date(d[2], (d[1] - 1), (d[0] + 1), t[0], t[1], t[2], (t[3] || 0));
            } else if (laterDatePattern !== null) {
                d = (laterDatePattern[1] + d[2])?.split('.')?.map(x => +x);
                t = laterDatePattern[2].split(':');
                date = new Date(d[2], (d[1] - 1), d[0], t[0], t[1], t[2], (t[3] || 0));
            } else {
                return 0;
            }

            return date.getTime();
        };

        String.prototype.toCoord = function (objectified) {
            let c = (this.match(/\d{1,3}\|\d{1,3}/g) || [false]).pop();
            return (c && objectified) ? { x: c.split('|')[0], y: c.split('|')[1] } : c
        };

        String.prototype.toNumber = function () {
            return parseFloat(this);
        };

        Number.prototype.toNumber = function () {
            return parseFloat(this);
        };

        return {
            getUnitSpeeds,
            processPage,
            processAllPages,
            getDistance,
            subtractArrays,
            getCurrentServerTime,
            timestampFromString
        };
    })();

    window.FarmGod.Translation = (function () {
        const msg = {
            nl_NL: {
                missingFeatures: 'Script vereist een premium account en farm assistent!',
                options: {
                    title: 'FarmGod Opties',
                    warning: '<b>Waarschuwingen:</b><br>- Zorg dat A is ingesteld als je standaard microfarm en B als een grotere microfarm<br>- Zorg dat de farm filters correct zijn ingesteld voor je het script gebruikt',
                    filterImage: 'https://higamy.github.io/TW/Scripts/Assets/farmGodFilters.png',
                    group: 'Uit welke groep moet er gefarmd worden:',
                    distance: 'Maximaal aantal velden dat farms mogen lopen:',
                    time: 'Hoe veel tijd in minuten moet er tussen farms zitten:',
                    losses: 'Verstuur farm naar dorpen met gedeeltelijke verliezen:',
                    maxloot: 'Verstuur een B farm als de buit vorige keer vol was:',
                    newbarbs: 'Voeg nieuwe barbarendorpen toe om te farmen:',
                    button: 'Plan farms',
                },
                table: {
                    noFarmsPlanned: 'Er kunnen met de opgegeven instellingen geen farms verstuurd worden.',
                    origin: 'Oorsprong',
                    target: 'Doel',
                    fields: 'Velden',
                    farm: 'Farm',
                    goTo: 'Ga naar'
                },
                messages: {
                    villageChanged: 'Succesvol van dorp veranderd!',
                    villageError: 'Alle farms voor het huidige dorp zijn reeds verstuurd!',
                    sendError: 'Error: farm niet verstuurd!'
                }
            },
            hu_HU: {
                missingFeatures: 'A scriptnek szüksége van Prémium fiókra és Farmkezelőre!',
                options: {
                    title: 'FarmGod opciók',
                    warning: '<b>Figyelem:</b><br>- Bizonyosodj meg róla, hogy az "A" sablon az alapértelmezett és a "B" egy nagyobb mennyiségű mikró-farm<br>- Bizonyosodj meg róla, hogy a farm-filterek megfelelően vannak beállítva mielőtt használod a sctiptet',
                    filterImage: 'https://higamy.github.io/TW/Scripts/Assets/farmGodFilters_HU.png',
                    group: 'Ebből a csoportból küldje:',
                    distance: 'Maximális mező távolság:',
                    time: 'Mekkora időintervallumban küldje a támadásokat percben:',
                    losses: 'Küldjön támadást olyan falvakba ahol részleges veszteséggel járhat a támadás:',
                    maxloot: 'A "B" sablont küldje abban az esetben, ha az előző támadás maximális fosztogatással járt:',
                    newbarbs: 'Adj hozzá új barbár falukat:',
                    button: 'Farm megtervezése',
                },
                table: {
                    noFarmsPlanned: 'A jelenlegi beállításokkal nem lehet új támadást kiküldeni.',
                    origin: 'Origin',
                    target: 'Célpont',
                    fields: 'Távolság',
                    farm: 'Farm',
                    goTo: 'Go to'
                },
                messages: {
                    villageChanged: 'Falu sikeresen megváltoztatva!',
                    villageError: 'Minden farm kiment a jelenlegi faluból!',
                    sendError: 'Hiba: Farm nemvolt elküldve!'
                }
            },
            int: {
                missingFeatures: 'Script requires a premium account and loot assistent!',
                options: {
                    title: 'FarmGod Options',
                    warning: '<b>Warning:</b><br>- Make sure A is set as your default microfarm and B as a larger microfarm<br>- Make sure the farm filters are set correctly before using the script',
                    filterImage: 'https://higamy.github.io/TW/Scripts/Assets/farmGodFilters.png',
                    group: 'Send farms from group:',
                    distance: 'Maximum fields for farms:',
                    time: 'How much time in minutes should there be between farms:',
                    losses: 'Send farm to villages with partial losses:',
                    maxloot: 'Send a B farm if the last loot was full:',
                    newbarbs: 'Add new barbs te farm:',
                    button: 'Plan farms',
                },
                table: {
                    noFarmsPlanned: 'No farms can be sent with the specified settings.',
                    origin: 'Origin',
                    target: 'Target',
                    fields: 'fields',
                    farm: 'Farm',
                    goTo: 'Go to'
                },
                messages: {
                    villageChanged: 'Successfully changed village!',
                    villageError: 'All farms for the current village have been sent!',
                    sendError: 'Error: farm not send!'
                }
            }
        };

        const get = function () {
            let lang = (msg.hasOwnProperty(game_data.locale)) ? game_data.locale : 'int';
            return msg[lang];
        };

        return {
            get
        };
    })();

    window.FarmGod.Main = (function (Library, Translation) {
        const lib = Library;
        const t = Translation.get();
        let curVillage = null;
        let farmBusy = false;

        const init = function () {
            if (game_data.features.Premium.active && game_data.features.FarmAssistent.active) {
                if (game_data.screen == 'am_farm') {
                    $.when(buildOptions()).then((html) => {
                        Dialog.show('FarmGod', html);

                        $('.optionButton').off('click').on('click', () => {
                            let optionGroup = parseInt($('.optionGroup').val());
                            let optionDistance = parseFloat($('.optionDistance').val());
                            let optionTime = parseFloat($('.optionTime').val());
                            let optionLosses = $('.optionLosses').prop('checked');
                            let optionMaxloot = $('.optionMaxloot').prop('checked');
                            let optionNewbarbs = $('.optionNewbarbs').prop('checked') || false;

                            localStorage.setItem('farmGod_options', JSON.stringify({ optionGroup: optionGroup, optionDistance: optionDistance, optionTime: optionTime, optionLosses: optionLosses, optionMaxloot: optionMaxloot, optionNewbarbs: optionNewbarbs }));

                            $('.optionsContent').html(UI.Throbber[0].outerHTML + '<br><br>');
                            getData(optionGroup, optionNewbarbs, optionLosses).then((data) => {
                                Dialog.close();

                                let plan = createPlanning(optionDistance, optionTime, optionMaxloot, data);
                                $('.farmGodContent').remove();
                                $('#am_widget_Farm').first().before(buildTable(plan.farms));

                                bindEventHandlers();
                                UI.InitProgressBars();
                                UI.updateProgressBar($('#FarmGodProgessbar'), 0, plan.counter);
                                $('#FarmGodProgessbar').data('current', 0).data('max', plan.counter);
                            });
                        });

                        document.querySelector(".optionButton").focus();
                    });


                } else {
                    location.href = game_data.link_base_pure + 'am_farm';
                }
            } else {
                UI.ErrorMessage(t.missingFeatures);
            }

            /*
                if (game_data.market != 'nl') {
                  $.post('https://swtools.be/ScriptStats/insert.php', { script: 'FarmGod', market: game_data.market, world: game_data.world, player: game_data.player.id });
                }*/
        };

        const bindEventHandlers = function () {
            $('.farmGod_icon').off('click').on('click', function () {
                if (game_data.market != 'nl' || $(this).data('origin') == curVillage) {
                    sendFarm($(this));
                } else {
                    UI.ErrorMessage(t.messages.villageError);
                }
            });

            $(document).off('keydown').on('keydown', (event) => {
                if ((event.keyCode || event.which) == 13) {
                    $('.farmGod_icon').first().trigger('click');
                }
            });

            $('.switchVillage').off('click').on('click', function () {
                curVillage = $(this).data('id');
                UI.SuccessMessage(t.messages.villageChanged);
                $(this).closest('tr').remove();
            });
        };

        const buildOptions = function () {
            let options = JSON.parse(localStorage.getItem('farmGod_options')) || { optionGroup: 0, optionDistance: 25, optionTime: 10, optionLosses: false, optionMaxloot: true, optionNewbarbs: true };
            let checkboxSettings = [false, true, true, true, false];
            let checkboxError = $('#plunder_list_filters').find('input[type="checkbox"]').map((i, el) => {
                return ($(el).prop('checked') != checkboxSettings[i]);
            }).get().includes(true);
            let $templateRows = $('form[action*="action=edit_all"]').find('input[type="hidden"][name*="template"]').closest('tr');
            let templateError = $templateRows.first().find('td').last().text().toNumber() >= $templateRows.last().find('td').last().text().toNumber();

            return $.when(buildGroupSelect(options.optionGroup)).then((groupSelect) => {
                return `<style>#popup_box_FarmGod{text-align:center;width:550px;}</style>
                <h3>${t.options.title}</h3><br><div class="optionsContent">
                ${(checkboxError || templateError) ? `<div class="info_box" style="line-height: 15px;font-size:10px;text-align:left;"><p style="margin:0px 5px;">${t.options.warning}<br><img src="${t.options.filterImage}" style="width:100%;"></p></div><br>` : ``}
                <div style="width:90%;margin:auto;background: url(\'graphic/index/main_bg.jpg\') 100% 0% #E3D5B3;border: 1px solid #7D510F;border-collapse: separate !important;border-spacing: 0px !important;"><table class="vis" style="width:100%;text-align:left;font-size:11px;">
                  <tr><td>${t.options.group}</td><td>${groupSelect}</td></tr>
                  <tr><td>${t.options.distance}</td><td><input type="text" size="5" class="optionDistance" value="${options.optionDistance}"></td></tr>
                  <tr><td>${t.options.time}</td><td><input type="text" size="5" class="optionTime" value="${options.optionTime}"></td></tr>
                  <tr><td>${t.options.losses}</td><td><input type="checkbox" class="optionLosses" ${(options.optionLosses) ? 'checked' : ''}></td></tr>
                  <tr><td>${t.options.maxloot}</td><td><input type="checkbox" class="optionMaxloot" ${(options.optionMaxloot) ? 'checked' : ''}></td></tr>
                  ${(game_data.market == 'nl') ? `<tr><td>${t.options.newbarbs}</td><td><input type="checkbox" class="optionNewbarbs" ${(options.optionNewbarbs) ? 'checked' : ''}></td></tr>` : ''}
                </table></div><br><input type="button" class="btn optionButton" value="${t.options.button}"></div>`;
            });
        };

        const buildGroupSelect = function (id) {
            return $.get(TribalWars.buildURL('GET', 'groups', { 'ajax': 'load_group_menu' })).then((groups) => {
                let html = `<select class="optionGroup">`;

                groups.result.forEach((val) => {
                    if (val.type == 'separator') {
                        html += `<option disabled=""/>`;
                    } else {
                        html += `<option value="${val.group_id}" ${(val.group_id == id) ? 'selected' : ''}>${val.name}</option>`;
                    }
                });

                html += `</select>`;

                return html;
            });
        };

        const buildTable = function (plan) {
            let html = `<div class="vis farmGodContent"><h4>FarmGod</h4><table class="vis" width="100%">
                <tr><div id="FarmGodProgessbar" class="progress-bar live-progress-bar progress-bar-alive" style="width:98%;margin:5px auto;"><div style="background: rgb(146, 194, 0);"></div><span class="label" style="margin-top:0px;"></span></div></tr>
                <tr><th style="text-align:center;">${t.table.origin}</th><th style="text-align:center;">${t.table.target}</th><th style="text-align:center;">${t.table.fields}</th><th style="text-align:center;">${t.table.farm}</th></tr>`;

            if (!$.isEmptyObject(plan)) {
                for (let prop in plan) {
                    if (game_data.market == 'nl') {
                        html += `<tr><td colspan="4" style="background: #e7d098;"><input type="button" class="btn switchVillage" data-id="${plan[prop][0].origin.id}" value="${t.table.goTo} ${plan[prop][0].origin.name} (${plan[prop][0].origin.coord})" style="float:right;"></td></tr>`;
                    }

                    plan[prop].forEach((val, i) => {
                        html += `<tr class="farmRow row_${(i % 2 == 0) ? 'a' : 'b'}">
                    <td style="text-align:center;"><a href="${game_data.link_base_pure}info_village&id=${val.origin.id}">${val.origin.name} (${val.origin.coord})</a></td>
                    <td style="text-align:center;"><a href="${game_data.link_base_pure}info_village&id=${val.target.id}">${val.target.coord}</a></td>
                    <td style="text-align:center;">${val.fields.toFixed(2)}</td>
                    <td style="text-align:center;"><a href="#" data-origin="${val.origin.id}" data-target="${val.target.id}" data-template="${val.template.id}" class="farmGod_icon farm_icon farm_icon_${val.template.name}" style="margin:auto;"></a></td>
                  </tr>`;
                    });
                }
            } else {
                html += `<tr><td colspan="4" style="text-align: center;">${t.table.noFarmsPlanned}</td></tr>`;
            }

            html += `</table></div>`;

            return html;
        };

        const getData = function (group, newbarbs, losses) {
            let data = { villages: {}, commands: {}, farms: { templates: {}, farms: {} } };

            let villagesProcessor = ($html) => {
                let skipUnits = ['ram', 'catapult', 'snob', 'militia'];

                $html.find('#combined_table').find('.row_a, .row_b').filter((i, el) => {
                    return $(el).find('.bonus_icon_33').length == 0;
                }).map((i, el) => {
                    let $el = $(el);
                    let $qel = $el.find('.quickedit-label').first();
                    let units = [];

                    if ($('#mobileHeader').length) {
                        game_data.units.forEach((unit) => {
                            if (skipUnits.indexOf(unit) == -1) {
                                let $img = $el.find('img[src*="unit/unit_' + unit + '"]');
                                units.push(($img.length) ? $img.closest('tr').text().trim().toNumber() : 0);
                            }
                        });
                    } else {
                        units = $el.find('.unit-item').filter((index, element) => {
                            return skipUnits.indexOf(game_data.units[index]) == -1;
                        }).map((index, element) => {
                            return $(element).text().toNumber();
                        }).get();
                    }

                    return data.villages[$qel.text().toCoord()] = {
                        'name': $qel.data('text'),
                        'id': parseInt($el.find('.quickedit-vn').first().data('id')),
                        'units': units
                    }
                });

                return data;
            };

            let commandsProcessor = ($html) => {
                $html.find('#commands_table').find('.row_a, .row_ax, .row_b, .row_bx').map((i, el) => {
                    let $el = $(el);
                    let coord = $el.find('.quickedit-label').first().text().toCoord();

                    if (coord) {
                        if (!data.commands.hasOwnProperty(coord)) data.commands[coord] = [];
                        return data.commands[coord].push(Math.round(lib.timestampFromString($el.find('td').eq(2).text().trim()) / 1000));
                    }
                });

                return data;
            };

            let farmProcessor = ($html) => {
                if ($.isEmptyObject(data.farms.templates)) {
                    let unitSpeeds = lib.getUnitSpeeds();

                    $html.find('form[action*="action=edit_all"]').find('input[type="hidden"][name*="template"]').closest('tr').map((i, el) => {
                        let $el = $(el);

                        return data.farms.templates[$el.prev('tr').find('a.farm_icon').first().attr('class').match(/farm_icon_(.*)\s/)[1]] = {
                            'id': $el.find('input[type="hidden"][name*="template"][name*="[id]"]').first().val().toNumber(),
                            'units': $el.find('input[type="text"], input[type="number"]').map((index, element) => {
                                return $(element).val().toNumber();
                            }).get(),
                            'speed': Math.max(...$el.find('input[type="text"], input[type="number"]').map((index, element) => {
                                return ($(element).val().toNumber() > 0) ? unitSpeeds[$(element).attr('name').trim().split('[')[0]] : 0;
                            }).get())
                        };
                    });
                }

                $html.find('#plunder_list').find('tr[id^="village_"]').map((i, el) => {
                    let $el = $(el);

                    return data.farms.farms[$el.find('a[href*="screen=report&mode=all&view="]').first().text().toCoord()] = {
                        'id': $el.attr('id').split('_')[1].toNumber(),
                        'color': $el.find('img[src*="graphic/dots/"]').attr('src').match(/dots\/(green|yellow|red|blue|red_blue)/)[1],
                        'max_loot': $el.find('img[src*="max_loot/1"]').length > 0
                    }
                });

                return data;
            };

            let findNewbarbs = () => {
                if (newbarbs) {
                    return twLib.get('/map/village.txt').then((allVillages) => {
                        allVillages.match(/[^\r\n]+/g).forEach((villageData) => {
                            let [id, name, x, y, player_id] = villageData.split(',');
                            let coord = `${x}|${y}`;

                            if (player_id == 0 && !data.farms.farms.hasOwnProperty(coord)) {
                                data.farms.farms[coord] = {
                                    'id': id.toNumber()
                                }
                            }
                        });

                        return data;
                    });
                } else {
                    return data;
                }
            };

            let filterFarms = () => {
                data.farms.farms = Object.fromEntries(Object.entries(data.farms.farms).filter(([key, val]) => {
                    return (!val.hasOwnProperty('color')) || ((val.color != 'red') && (val.color != 'red_blue') && (val.color != 'yellow' || losses));
                }));

                return data;
            };

            return Promise.all([
                lib.processAllPages(TribalWars.buildURL('GET', 'overview_villages', { 'mode': 'combined', 'group': group }), villagesProcessor),
                lib.processAllPages(TribalWars.buildURL('GET', 'overview_villages', { 'mode': 'commands', 'type': 'attack' }), commandsProcessor),
                lib.processAllPages(TribalWars.buildURL('GET', 'am_farm'), farmProcessor),
                findNewbarbs()
            ]).then(filterFarms).then(() => {
                return data;
            });
        };

        const createPlanning = function (optionDistance, optionTime, optionMaxloot, data) {
            let plan = { counter: 0, farms: {} };
            let serverTime = Math.round(lib.getCurrentServerTime() / 1000);

            for (let prop in data.villages) {
                let orderedFarms = Object.keys(data.farms.farms).map((key) => {
                    return { 'coord': key, 'dis': lib.getDistance(prop, key) };
                }).sort((a, b) => (a.dis > b.dis) ? 1 : -1);

                orderedFarms.forEach((el) => {
                    let farmIndex = data.farms.farms[el.coord];
                    let template_name = (optionMaxloot && farmIndex.hasOwnProperty('max_loot') && farmIndex.max_loot) ? 'b' : 'a';
                    let template = data.farms.templates[template_name];
                    let unitsLeft = lib.subtractArrays(data.villages[prop].units, template.units);

                    let distance = lib.getDistance(prop, el.coord);
                    let arrival = Math.round(serverTime + ((distance * template.speed) * 60) + Math.round(plan.counter / 5));
                    let maxTimeDiff = Math.round(optionTime * 60);
                    let timeDiff = true;
                    if (data.commands.hasOwnProperty(el.coord)) {
                        if (!farmIndex.hasOwnProperty('color') && data.commands[el.coord].length > 0) timeDiff = false;
                        data.commands[el.coord].forEach((timestamp) => {
                            if (Math.abs(timestamp - arrival) < maxTimeDiff) timeDiff = false;
                        });
                    } else {
                        data.commands[el.coord] = [];
                    }

                    if (unitsLeft && timeDiff && (distance < optionDistance)) {
                        plan.counter++;
                        if (!plan.farms.hasOwnProperty(prop)) plan.farms[prop] = [];

                        plan.farms[prop].push({
                            'origin': { 'coord': prop, 'name': data.villages[prop].name, 'id': data.villages[prop].id },
                            'target': { 'coord': el.coord, 'id': farmIndex.id },
                            'fields': distance,
                            'template': { 'name': template_name, 'id': template.id }
                        });

                        data.villages[prop].units = unitsLeft;
                        data.commands[el.coord].push(arrival);
                    }
                });
            }

            return plan;
        };

        const sendFarm = function ($this) {
            let n = Timing.getElapsedTimeSinceLoad();
            if (!farmBusy && !(Accountmanager.farm.last_click && n - Accountmanager.farm.last_click < 200)) {
                farmBusy = true;
                Accountmanager.farm.last_click = n;
                let $pb = $('#FarmGodProgessbar');

                TribalWars.post(Accountmanager.send_units_link.replace(/village=(\d+)/, 'village=' + $this.data('origin')), null, {
                    target: $this.data('target'),
                    template_id: $this.data('template'),
                    source: $this.data('origin')
                }, function (r) {
                    UI.SuccessMessage(r.success);
                    $pb.data('current', $pb.data('current') + 1);
                    UI.updateProgressBar($pb, $pb.data('current'), $pb.data('max'));
                    $this.closest('.farmRow').remove();
                    farmBusy = false;
                }, function (r) {
                    UI.ErrorMessage(r || t.messages.sendError);
                    $pb.data('current', $pb.data('current') + 1);
                    UI.updateProgressBar($pb, $pb.data('current'), $pb.data('max'));
                    $this.closest('.farmRow').remove();
                    farmBusy = false;
                });
            }
        };

        return {
            init
        };
    })(window.FarmGod.Library, window.FarmGod.Translation);

    (() => {
        window.FarmGod.Main.init();
    })();

})();
