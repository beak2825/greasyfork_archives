// ==UserScript==
// @name        GN_BattleLogAnalyzer&faction
// @namespace   Gradient
// @description Анализатор протокола боев
// @match       https://www.heroeswm.ru/*
// @match       https://my.lordswm.com/*
// @match       https://www.lordswm.com/*
// @license     Gradient licensing agency
// @exclude     /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php
// @version     1.0.15.2
// @downloadURL https://update.greasyfork.org/scripts/542408/GN_BattleLogAnalyzerfaction.user.js
// @updateURL https://update.greasyfork.org/scripts/542408/GN_BattleLogAnalyzerfaction.meta.js
// ==/UserScript==
let NICKNAME;
const parser = new DOMParser();
let factions = {
    "1": { "0": "Рыцарь", "1": "Рыцарь света" },
    "2": { "0": "Некромант", "1": "Некромант - повелитель смерти" },
    "3": { "0": "Маг", "1": "Маг - разрушитель" },
    "4": { "0": "Эльф", "1": "Эльф - заклинатель" },
    "5": { "0": "Варвар", "1": "Варвар крови", "2": "Варвар - шаман" },
    "6": { "0": "Темный эльф", "1": "Темный эльф - укротитель" },
    "7": { "0": "Демон", "1": "Демон тьмы" },
    "8": { "0": "Гном", "1": "Гном огня" },
    "9": { "0": "Степной варвар", "1": "Степной варвар ярости" },
    "10": { "0": "Фараон" }
}

let temp123 = `// @exclude     /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php.*/`
"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_BattleLogAnalyzer'; // Enter your script name here

//----------------------------------------------------------------------------//

(function() {
    try { // wrapper start

        //----------------------------------------------------------------------------//
        // UnifiedLibrary 1.7.0 start
        //----------------------------------------------------------------------------//

        //----------------------------------------------------------------------------//
        // SysUtils
        //----------------------------------------------------------------------------//

        var GN_SysUtils = new SysUtils(script_name);
        var SU = GN_SysUtils;

        //----------------------------------------------------------------------------//

        function SysUtils(name) { // wrapper start

            //----------------------------------------------------------------------------//

            this.show_error = function(error_string, use_alert) {
                if (use_alert)
                    alert(error_string);

                throw new Error(error_string);
            };

            if (arguments.length != 1)
                this.show_error('Wrong SysUtils arguments');

            if (!arguments[0])
                this.show_error('Empty SysUtils argument');

            //----------------------------------------------------------------------------//

            this.compare = function(a, b) {
                return (a == b) ? 0 : (a > b ? 1 : -1);
            };

            //----------------------------------------------------------------------------//

            this.send_get = function(url) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.overrideMimeType('text/plain; charset=windows-1251');
                xhr.send(null);

                if (xhr.status == 200)
                    return xhr.responseText;

                return null;
            };

            //----------------------------------------------------------------------------//

            this.save_value = function(desc, value) {
                var div = document.getElementById('GN_GM_Handler');
                div.setAttribute('desc', desc);
                div.setAttribute('value', value);
                div.setAttribute('operation', 'save');

                div.click();

                if (div.getAttribute('state') != 'complete')
                    this.show_error('Ошибка при сохранении значения');
            };

            //----------------------------------------------------------------------------//

            this.load_value = function(value, def) {
                var div = document.getElementById('GN_GM_Handler');
                div.setAttribute('desc', value);
                div.setAttribute('operation', 'load');

                div.click();

                if (div.getAttribute('state') != 'complete')
                    this.show_error('Ошибка при загрузке значения');

                return (div.getAttribute('is_null') == 'true' ? def : div.getAttribute('value'));
            };

            //----------------------------------------------------------------------------//

            this.remove_value = function(value) {
                var div = document.getElementById('GN_GM_Handler');
                div.setAttribute('desc', value);
                div.setAttribute('operation', 'remove');

                div.click();

                if (div.getAttribute('state') != 'complete')
                    this.show_error('Ошибка при удалении значения');
            };

            //----------------------------------------------------------------------------//

            var current_id = null;
            //----------------------------------------------------------------------------//

            //----------------------------------------------------------------------------//

            //----------------------------------------------------------------------------//

            function check_mandatory_scripts(alerter) {
                var persistent_storage_sign = document.getElementById('GN_GM_Handler');
                var common_values_sign = document.getElementById('GN_CommonValuesSign');
                var alert_sign = document.getElementById('GN_AlertSign');

                if (!alert_sign) {
                    alert_sign = document.createElement('div');
                    alert_sign.id = 'GN_AlertSign';
                    alert_sign.setAttribute('alerted', 'false');
                    document.body.appendChild(alert_sign);
                }

                var alerted = alert_sign.getAttribute('alerted') != 'false';

                if (!persistent_storage_sign) {
                    alert_sign.setAttribute('alerted', 'true');
                    alerter('Скрипт ' + name + ' требует для своей работы скрипт управления данными (GN_PersistentStorage), который должен стоять первым в порядке выполнения скриптов.\n' +
                        'Подробнее здесь: "https://greasyfork.org/ru/scripts/14049-Как-устанавливать-скрипты-читать-здесь"', !alerted);
                }

                if (!common_values_sign) {
                    alert_sign.setAttribute('alerted', 'true');
                    alerter('Скрипт ' + name + ' требует для своей работы скрипт, хранящий данные (GN_CommonValuesFiller), который должен стоять вторым в порядке выполнения скриптов.\n' +
                        'Подробнее здесь: "https://greasyfork.org/ru/scripts/14049-Как-устанавливать-скрипты-читать-здесь"', !alerted);
                }
            }

            this.check_login = function() {
                var re = /.*?pl_id=(\d+)[^\d]*?/gmi;
                var matches = re.exec(document.cookie.toString());

                if (matches) {
                    current_id = +matches[1];

                    check_mandatory_scripts(this.show_error);
                }
            };

            //----------------------------------------------------------------------------//

            this.save_file = function(text, info) {
                var res = 'data:text/csv;charset=utf-8,' + encodeURI(text);

                if (info)
                    alert(info);

                window.open(res);
            };

            //----------------------------------------------------------------------------//

            this.string_to_date = function(str) {
                var matches = /(\d{2})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})/.exec(str);

                return new Date(2000 + +matches[3], +matches[2] - 1, +matches[1], +matches[4], +matches[5]);
            };

            //----------------------------------------------------------------------------//

            function get_char(e) {
                if (e.which && e.charCode) {
                    if (e.which < 32)
                        return null;

                    return String.fromCharCode(+e.which)
                }

                return null;
            }

            this.number_input = function(e) {
                if (e.ctrlKey || e.altKey || e.metaKey)
                    return false;

                var chr = get_char(e);

                return chr == null || (chr >= '0' && chr <= '9');
            };

            //----------------------------------------------------------------------------//

            this.check_login();

            //----------------------------------------------------------------------------//

        } // wrapper end

        //----------------------------------------------------------------------------//
        // CommonValues
        //----------------------------------------------------------------------------//

        var GN_CommonValues = new CommonValues();

        //----------------------------------------------------------------------------//

        function CommonValues() { // wrapper start

            //----------------------------------------------------------------------------//
            // Battle types
            //----------------------------------------------------------------------------//

            this.enum_sbt = { // sync?
                pvp: 0,
                hunter: 1,
                mercenary: 2,
                thief: 3,
                ranger: 4,
                war: 5,
                event: 6,
                instance: 7,
                other: 8,
                guardian: 9,
                campaign: 10,
                leader: 11,
                unknown: 12
            };

            this.sorted_battle_types = JSON.parse(SU.load_value('GN_CommonValues_SortedBattleTypes', '[]'));
            this.battle_types = JSON.parse(SU.load_value('GN_CommonValues_BattleTypes', '[]'));

            //----------------------------------------------------------------------------//

            this.get_battle_type = function(id) {
                for (var i = 0; i < this.battle_types.length; ++i)
                    if (this.battle_types[i].id == id)
                        return this.battle_types[i];

                var new_type = { id: id, sbt: this.enum_sbt.unknown, name: id }; // sync?
                this.battle_types.push(new_type);

                return new_type;
            };

            //----------------------------------------------------------------------------//

        } // wrapper end

        //----------------------------------------------------------------------------//
        // GUIController
        //----------------------------------------------------------------------------//

        var GN_GUIController = new GUIController();

        //----------------------------------------------------------------------------//

        function GUIController() { // wrapper start

            //----------------------------------------------------------------------------//

            clear_flash_z_index();

            //----------------------------------------------------------------------------//

            var script_name = 'GN_GUIController';
            this.script_name = function() {
                return script_name;
            };

            //----------------------------------------------------------------------------//

            this.registerObject = function(object) {
                root_div = document.getElementById(root.div.id);

                if (!root_div)
                    root_div = create_node(root, document.body);
                else {
                    var custom = root_div.getAttribute('custom').split('|');
                    root.div.top = +custom[0];
                    root.div.left = +custom[1];
                    root.div.width = +custom[2];
                    root.div.height = +custom[3];
                }

                object.div.left = root.div.left + left;
                object.div.top = top;

                var childs = root_div.childNodes;

                for (var i = 0; i < childs.length; ++i)
                    if (childs[i].nodeName.toLowerCase() == 'div') {
                        var height = +childs[i].getAttribute('custom').split('|')[3];
                        object.div.top += height;
                    }

                create_node(object, root_div);
                align_childs(root_div);
                collapse_childs(root_div);
            };

            //----------------------------------------------------------------------------//

            this.hide_all = function() {
                if (!root_div)
                    return;

                var childs = root_div.childNodes;
                for (var i = 0; i < childs.length; ++i)
                    if (childs[i].nodeName.toLowerCase() == 'div')
                        childs[i].style.top = +childs[i].getAttribute('custom').split('|')[0];

                align_childs(root_div);
                collapse_childs(root_div);
            };

            var hide_all = this.hide_all;

            //----------------------------------------------------------------------------//

            const left = 10;
            const top = 10;

            var root = {
                div: {
                    id: script_name + 'MainDiv',
                    top: top,
                    left: left,
                    width: 0,
                    height: 0
                },

                input: {
                    id: script_name + 'MainInput',
                    value: 'Скрипты',
                    title: 'Конфигурация и запуск скриптов, не относящихся к определенной странице'
                },

                child_divs: []
            };

            var root_div = document.getElementById(root.div.id);

            //----------------------------------------------------------------------------//

            function create_node(object, parent) {
                var div_ = div(object.div);
                div_.setAttribute('expanded', 'false');
                parent.appendChild(div_);

                set_div_style(object.div);

                var input_ = input(object.input);
                div_.appendChild(input_);

                set_input_style(object.input);

                object.div.left += div_.clientWidth;
                object.div.width = div_.clientWidth;
                object.div.height = div_.clientHeight;

                var custom = [object.div.top, object.div.left, object.div.width, object.div.height];
                div_.setAttribute('custom', custom.join('|'));

                if (object.child_divs.length || object.div.id == root.div.id) {
                    input_.addEventListener('click', function() {
                        expand_childs(div_);
                    });

                    create_child_nodes(object, div_);
                }

                return div_;
            }

            //----------------------------------------------------------------------------//

            function create_child_nodes(object, parent) {
                var childs = object.child_divs;

                for (var i = 0; i < childs.length; ++i) {
                    var child = childs[i];
                    child.div.top = top;
                    child.div.left = left;

                    if (i) {
                        var total_height = 0;

                        for (var j = 0; j < i; ++j) {
                            var sibling = childs[j];
                            var sibling_div = document.getElementById(sibling.div.id);

                            total_height += sibling_div.clientHeight;
                        }

                        child.div.top += total_height;
                    }

                    child.div.left += object.div.left;

                    create_node(child, parent);
                }
            }

            //----------------------------------------------------------------------------//

            function expand_childs(el) {
                var now_expanded = (el.getAttribute('expanded') == 'true');

                if (now_expanded && el == root_div) {
                    hide_all();
                    return;
                }

                var childs = el.childNodes;

                for (var i = 0; i < childs.length; ++i)
                    if (childs[i].nodeName.toLowerCase() == 'div')
                        childs[i].style.display = !now_expanded ? 'block' : 'none';

                if (now_expanded) {
                    collapse_childs(el);

                    if (el.parentNode == root_div) {
                        childs = root_div.childNodes;

                        for (i = 0; i < childs.length; ++i)
                            if (childs[i].nodeName.toLowerCase() == 'div' && childs[i] != el)
                                childs[i].style.display = 'block';

                        el.style.top = +el.getAttribute('custom').split('|')[0];
                        el.style.width = +el.getAttribute('custom').split('|')[2];

                        align_childs(root_div);
                    }
                }

                if (!now_expanded && el.parentNode == root_div) {
                    childs = root_div.childNodes;

                    for (i = 0; i < childs.length; ++i) {
                        if (childs[i].nodeName.toLowerCase() == 'div' && childs[i] != el)
                            childs[i].style.display = 'none';
                    }

                    el.style.top = top;
                    el.style.width = +el.getAttribute('custom').split('|')[2];
                }

                el.setAttribute('expanded', now_expanded ? 'false' : 'true');
            }

            //----------------------------------------------------------------------------//

            function align_childs(el) {
                var max_width = 0;
                var childs = el.childNodes;

                for (var i = 0; i < childs.length; ++i)
                    if (childs[i].nodeName.toLowerCase() == 'div') {
                        var width = +childs[i].getAttribute('custom').split('|')[2];

                        if (width >= max_width)
                            max_width = width;
                    }

                for (i = 0; i < childs.length; ++i)
                    if (childs[i].nodeName.toLowerCase() == 'div')
                        childs[i].style.width = max_width;
            }

            //----------------------------------------------------------------------------//

            function collapse_childs(el) {
                var divs = el.querySelectorAll('div');

                for (var i = 0; i < divs.length; ++i) {
                    divs[i].setAttribute('expanded', 'false');
                    divs[i].style.display = 'none';
                }

                el.setAttribute('expanded', 'false');
            }

            //----------------------------------------------------------------------------//

            function div(object) {
                var div = document.createElement('div');
                div.id = object.id;

                return div;
            }

            //----------------------------------------------------------------------------//

            function set_div_style(object) {
                var div = document.getElementById(object.id);
                var style = div.style;

                style.position = 'fixed';
                style.top = object.top + 'px';
                style.left = object.left + 'px';
                style.zIndex = 100;
            }

            //----------------------------------------------------------------------------//

            function input(object) {
                var input = document.createElement('input');
                input.type = 'button';
                input.id = object.id;
                input.value = object.value;
                input.title = object.title;

                return input;
            }

            //----------------------------------------------------------------------------//

            function set_input_style(object) {
                var input = document.getElementById(object.id);
                var style = input.style;

                style.display = 'block';
                style.width = '95%';
                style.border = '1px solid rgb(153, 153, 153)';
                style.padding = '1px';
                style.margin = '2px';
                style.background = 'none repeat scroll 0% 0% rgb(204, 204, 204)';
                style.fontSize = '12px';
                style.cursor = 'pointer';
                style.zIndex = 100;
            }

            //----------------------------------------------------------------------------//

            function clear_flash_z_index() {
                var objects = document.querySelectorAll('object');

                for (var i = 0; i < objects.length; ++i) {
                    var o = objects[i];

                    if (!o.querySelector('param[name="wmode"]')) {
                        var param = document.createElement('param');
                        param.setAttribute('name', 'wmode');
                        param.setAttribute('value', 'opaque');

                        o.insertBefore(param, o.firstChild);
                    }
                }
            }

            //----------------------------------------------------------------------------//

        } // wrapper end

        //----------------------------------------------------------------------------//
        // UnifiedLibrary end
        //----------------------------------------------------------------------------//

        var compare = SU.compare;
        var load_value = SU.load_value;
        var save_value = SU.save_value;
        var remove_value = SU.remove_value;
        var send_get = SU.send_get;
        var number_input = SU.number_input;
        var string_to_date = SU.string_to_date;
        var save_file = SU.save_file;

        var CV = GN_CommonValues;

        var sorted_battle_types = CV.sorted_battle_types;
        sorted_battle_types.sort(function(a, b) {
            return compare(a.name, b.name);
        });

        var battle_types = CV.battle_types;
        battle_types.sort(function(a, b) {
            return compare(a.name, b.name);
        });

        var is_parser_running = false;
        var searched = [];
        var colspan = '4';
        var empty_option = 'all_values';
        var count_counter = 0;
        var mercenaries = [];
        var hunters = [];
        var settings = load_settings();
        var save_to_file = false;

        var enum_exodus = {
            win: 0,
            draw: 1,
            loss: 2
        };

        var GC = GN_GUIController;
        GC.registerObject({
            div: { id: GC.script_name() + '_' + script_name + 'Div' },

            input: {
                id: GC.script_name() + '_' + script_name + 'Input',
                value: 'Анализатор протокола боев',
                title: 'Анализатор протокола боев'
            },

            child_divs: []
        });

        var start_button = document.getElementById(GC.script_name() + '_' + script_name + 'Input');

        start_button.addEventListener('click', function(e) {
            draw_div(document.body);
        });

        //----------------------------------------------------------------------------//

        function draw_div(parent) {
            var div = document.createElement('div');
            div.id = script_name + 'Div';
            div.style.position = 'fixed';
            div.style.display = 'block';
            div.style.top = '50px';
            div.style.zIndex = 100;
            div.style.overflowX = 'hidden';

            var width = 700;
            div.style.width = width + 'px';
            div.style.left = (document.body.clientWidth - width) / 2;
            div.style.background = start_button.style.backgroundColor;

            parent.appendChild(div);

            draw_content(div);
            set_settings();
        }

        //----------------------------------------------------------------------------//

        function draw_content(parent) {
            var table = document.createElement('table');
            table.style.width = '100%';
            table.style.border = 'medium none';

            parent.appendChild(table);

            draw_header(table);
            draw_first_row(table);
            draw_second_row(table);
            draw_third_row(table);
            draw_fourth_row(table);
            draw_fifth_row(table);

            var tr = document.createElement('tr');
            table.appendChild(tr);

            var td = document.createElement('td');
            td.setAttribute('align', 'center');
            td.setAttribute('colspan', '5');
            tr.appendChild(td);

            var input = document.createElement('input');
            input.id = script_name + 'StartInput';
            input.type = 'button';
            input.value = 'Начать поиск';
            input.addEventListener('click', function(e) {
                e.preventDefault();
                const victimValue = document.querySelector("#GN_BattleLogAnalyzerIDInput").value;
                let victimID;
                if (isNaN(parseInt(victimValue))) {
                    const victimURL = `search.php?key=${encodeURIComponent(victimValue)}`;
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", victimURL, false);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            victimID = xhr.responseURL.split("id=")[1];
                            document.querySelector("#GN_BattleLogAnalyzerIDInput").value = victimID;
                            console.log(victimURL, redirectURL);
                        }
                    };

                    xhr.send();
                } else {
                    victimID = document.querySelector("#GN_BattleLogAnalyzerIDInput").value;
                }
                if (!save_settings())
                    return;

                save_to_file = settings.save_file;
                searched = [];
                enable_settings(false);
                draw_search_table(parent);
                recheck_rect();
                const victimPage = send_get("/pl_info.php?id=" + victimID);
                const doc = parser.parseFromString(victimPage, "text/html");
                NICKNAME = doc.querySelector("h1").textContent.replace(/\u00A0/g, " ");
                console.log(NICKNAME);
                parse_data();
            });
            td.appendChild(input);
        }

        //----------------------------------------------------------------------------//

        function draw_header(parent) {
            var tr = document.createElement('tr');
            parent.appendChild(tr);

            var td = document.createElement('td');
            td.setAttribute('colspan', '5');
            tr.appendChild(td);

            var table = document.createElement('table');
            table.style.width = '100%';
            td.appendChild(table);

            tr = document.createElement('tr');
            table.appendChild(tr);

            td = document.createElement('td');
            td.setAttribute('align', 'center');
            td.textContent = 'Панель настроек';
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('align', 'center');
            td.style.width = '100px';

            var a = document.createElement('a');
            a.href = '';
            a.textContent = '(очистить все)';
            a.addEventListener('click', function(e) {
                e.preventDefault();
                clear_settings();
            });
            td.appendChild(a);
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('align', 'center');
            td.style.width = '25px';
            td.textContent = 'x';
            td.style.backgroundColor = 'red';
            td.style.fontSize = '16';
            td.title = 'Закрыть окно';
            td.addEventListener('click', function(e) {
                remove_div();
            });
            tr.appendChild(td);
        }

        //----------------------------------------------------------------------------//

        function draw_first_row(parent) {
            var tr = document.createElement('tr');
            parent.appendChild(tr);

            var td = document.createElement('td');
            tr.appendChild(td);

            td.appendChild(document.createTextNode('ID/ник персонажа:'));

            td = document.createElement('td');
            tr.appendChild(td);

            var input = document.createElement('input');
            input.id = script_name + 'IDInput';
            input.type = 'text';
            input.style.width = '150px';
            input.title = 'Идентификатор персонажа, по чьему протоколу будет вестись поиск';
            td.appendChild(input);

            td = document.createElement('td');
            tr.appendChild(td);

            td.appendChild(document.createTextNode('Что ищем:'));

            td = document.createElement('td');
            tr.appendChild(td);

            input = document.createElement('input');
            input.id = script_name + 'SearchInput';
            input.type = 'text';
            input.style.width = '150px';
            input.title = 'Фраза для поиска. Может не указываться, если включен поиск и фильтр по всем боям';
            td.appendChild(input);

            td = document.createElement('td');
            tr.appendChild(td);

            var chb = document.createElement('input');
            chb.type = 'checkbox';
            chb.title = 'Поиск будет осуществляться без учета регистра';
            chb.id = script_name + 'CIChb';
            td.appendChild(chb);

            td.appendChild(document.createTextNode('без учета регистра'));
        }

        //----------------------------------------------------------------------------//

        function draw_second_row(parent) {
            var tr = document.createElement('tr');
            parent.appendChild(tr);

            var td = document.createElement('td');
            tr.appendChild(td);

            td.appendChild(document.createTextNode('Тип боя:'));

            td = document.createElement('td');
            tr.appendChild(td);

            var select = document.createElement('select');
            select.id = script_name + 'SBTSelect';
            select.style.width = '150px';
            select.title = 'Поиск по общему типу боя';
            select.addEventListener('change', function(e) {
                reload_battle_types();
            });
            td.appendChild(select);

            var option = document.createElement('option');
            option.setAttribute('value', empty_option);
            select.appendChild(option);

            sorted_battle_types.forEach(function(current) {
                option = document.createElement('option');
                option.setAttribute('value', current.id);
                option.appendChild(document.createTextNode(current.name));

                select.appendChild(option);
            });

            td = document.createElement('td');
            tr.appendChild(td);

            td.appendChild(document.createTextNode('Вид боя:'));

            td = document.createElement('td');
            tr.appendChild(td);

            select = document.createElement('select');
            select.id = script_name + 'BTSelect';
            select.style.width = '150px';
            select.title = 'Поиск по конкретному виду боя';
            td.appendChild(select);

            option = document.createElement('option');
            option.setAttribute('value', empty_option);
            select.appendChild(option);

            battle_types.forEach(function(current) {
                option = document.createElement('option');
                option.setAttribute('value', current.id);
                option.appendChild(document.createTextNode(current.name));

                select.appendChild(option);
            });

            td = document.createElement('td');
            tr.appendChild(td);

            var chb = document.createElement('input');
            chb.type = 'checkbox';
            chb.title = 'При включении будет использоваться фильтр по типу и/или виду боя';
            chb.id = script_name + 'BTChb';
            td.appendChild(chb);

            td.appendChild(document.createTextNode('использовать фильтр'));
        }

        //----------------------------------------------------------------------------//

        function draw_third_row(parent) {
            var tr = document.createElement('tr');
            parent.appendChild(tr);

            var td = document.createElement('td');
            tr.appendChild(td);

            td.appendChild(document.createTextNode('До Х дней:'));

            td = document.createElement('td');
            tr.appendChild(td);

            var input = document.createElement('input');
            input.id = script_name + 'DaysInput';
            input.type = 'text';
            input.style.width = '150px';
            input.onkeypress = number_input;
            input.title = 'Поиск по количеству дней от текущей даты';
            td.appendChild(input);

            td = document.createElement('td');
            tr.appendChild(td);

            td.appendChild(document.createTextNode('До Y боев:'));

            td = document.createElement('td');
            tr.appendChild(td);

            input = document.createElement('input');
            input.id = script_name + 'CountInput';
            input.type = 'text';
            input.style.width = '150px';
            input.onkeypress = number_input;
            input.title = 'Поиск по количеству боев';
            td.appendChild(input);

            td = document.createElement('td');
            tr.appendChild(td);

            var chb = document.createElement('input');
            chb.type = 'checkbox';
            chb.title = 'При включении будет использоваться фильтр по количеству дней от текущей даты и/или числу боев. Если указан 0 или пусто, поиск осуществляться не будет';
            chb.id = script_name + 'DCChb';
            td.appendChild(chb);

            td.appendChild(document.createTextNode('использовать фильтр'));
        }

        //----------------------------------------------------------------------------//

        function draw_fourth_row(parent) {
            var tr = document.createElement('tr');
            parent.appendChild(tr);

            var td = document.createElement('td');
            td.setAttribute('colspan', '2');
            td.setAttribute('align', 'left');
            tr.appendChild(td);

            var chb = document.createElement('input');
            chb.type = 'checkbox';
            chb.title = 'Искать только максимальный результат в боях (только для ГО/ГН). Например: армия(макс) будет показана, армия(макс-1) уже проигнорируется';
            chb.id = script_name + 'MaxBTChb';
            td.appendChild(chb);

            td.appendChild(document.createTextNode('только максимальные бои(ГН/ГО)'));

            td = document.createElement('td');
            td.setAttribute('colspan', '3');
            td.setAttribute('align', 'left');
            tr.appendChild(td);

            chb = document.createElement('input');
            chb.setAttribute('disabled', ''); // NB: future
            chb.type = 'checkbox';
            chb.title = 'Зарезервировано на будущее';
            chb.id = script_name + 'MaxWinBTChb';
            td.appendChild(chb);

            td.appendChild(document.createTextNode('только выигрышные макс. бои(ГН/ГО)'));
        }

        //----------------------------------------------------------------------------//

        function draw_fifth_row(parent) {
            var tr = document.createElement('tr');
            parent.appendChild(tr);

            var td = document.createElement('td');
            td.setAttribute('colspan', '5');
            td.setAttribute('align', 'left');
            tr.appendChild(td);

            var chb = document.createElement('input');
            chb.type = 'checkbox';
            chb.title = 'Сохранение результатов поиска в файл (если что-то нашлось)';
            chb.id = script_name + 'SaveFileChb';
            td.appendChild(chb);

            td.appendChild(document.createTextNode('сохранять результаты поиска'));
        }

        //----------------------------------------------------------------------------//

        function remove_div() {
            var div = document.getElementById(script_name + 'Div');
            div.parentNode.removeChild(div);
        }

        //----------------------------------------------------------------------------//

        function draw_search_table(parent) {
            var table = document.getElementById(script_name + 'SearchTable');

            if (table) {
                set_search_info();

                var trs = table.querySelectorAll('tr:not([id])');
                for (var i = 0; i < trs.length; ++i)
                    table.removeChild(trs[i]);

                var el = document.getElementById(script_name + 'Stopper');
                el.removeAttribute('disabled');
            } else {
                table = document.createElement('table');
                table.style.width = '100%';
                table.id = script_name + 'SearchTable';
                parent.appendChild(table);

                draw_search_header(table);
                set_search_info();
            }
        }

        //----------------------------------------------------------------------------//

        function set_search_info() {
            var el = document.getElementById(script_name + 'SearchInfo');
            while (el.firstChild)
                el.removeChild(el.firstChild);

            if (!is_parser_running) {
                el.textContent = '';
                return;
            }

            var chapters = [];
            chapters.push('Идет поиск по протоколу игрока [ID = ' + settings.id + ']');
            chapters.push('Фраза для поиска: "' + settings.search + (settings.ci_c ? '" (без учета регистра)' : '" (с учетом регистра)'));

            if (settings.bt_c) {
                var str = '';
                if (settings.sbt != empty_option) {
                    var select = document.getElementById(script_name + 'SBTSelect');
                    str = 'Тип боя: ' + select.options[select.selectedIndex].text;
                }

                if (settings.bt != empty_option) {
                    var select = document.getElementById(script_name + 'BTSelect');
                    str += (str.length ? ', вид боя: ' : 'Вид боя: ') + select.options[select.selectedIndex].text;
                }

                if (str.length)
                    chapters.push(str);
            }

            if (settings.dc_c)
                chapters.push('До ' + settings.days + ' дней, до ' + settings.count + ' боев');

            chapters.forEach(function(current) {
                el.appendChild(document.createTextNode(current));
                el.appendChild(document.createElement('br'));
            });
        }

        //----------------------------------------------------------------------------//

        function set_progress_info(counter) {
            var el = document.getElementById(script_name + 'ProgressInfo');
            while (el.firstChild)
                el.removeChild(el.firstChild);

            var wins = searched.filter(function(current) {
                return current.exodus == enum_exodus.win;
            });

            var b_str = 'Найдено записей: ' + searched.length;
            if (searched.length)
                b_str += ', побед: ' + wins.length + ', процент побед: ' + (100 * wins.length / searched.length).toFixed(2) + '%';

            if (!is_parser_running) {
                el.textContent = 'Поиск завершен. ' + b_str;
                return;
            }

            var p_str = 'Обработано ' + counter.current + '/' + counter.last + ' страниц(' + (100 * counter.current / counter.last).toFixed(2) + '%)';

            el.appendChild(document.createTextNode(p_str));
            el.appendChild(document.createElement('br'));
            el.appendChild(document.createTextNode(b_str));
        }

        //----------------------------------------------------------------------------//

        function draw_search_header(parent) {
            var tr = document.createElement('tr');
            tr.id = script_name + 'SearchInfoTR';
            parent.appendChild(tr);

            var td = document.createElement('td');
            td.id = script_name + 'SearchInfo';
            td.setAttribute('colspan', colspan);
            td.setAttribute('align', 'center');
            tr.appendChild(td);

            tr = document.createElement('tr');
            tr.id = script_name + 'ProgressInfoTR';
            parent.appendChild(tr);

            td = document.createElement('td');
            td.id = script_name + 'ProgressInfo';
            td.setAttribute('colspan', colspan);
            td.setAttribute('align', 'center');
            tr.appendChild(td);

            tr = document.createElement('tr');
            tr.id = script_name + 'StopperTR';
            parent.appendChild(tr);

            td = document.createElement('td');
            td.setAttribute('colspan', colspan);
            td.setAttribute('align', 'center');
            tr.appendChild(td);

            var input = document.createElement('input');
            input.id = script_name + 'Stopper';
            input.type = 'button';
            input.value = 'Окончить поиск';
            input.addEventListener('click', function(e) {
                on_stop();
            });
            td.appendChild(input);

            tr = document.createElement('tr');
            tr.setAttribute('bgColor', '#DCDCDC');
            tr.id = script_name + 'SearchHeaderTR';
            parent.appendChild(tr);

            ['ID боя', 'Дата', 'Описание', 'Исход', "Фракция"].forEach(function(current) {
                td = document.createElement('td');
                td.textContent = current;
                tr.appendChild(td);
            });
        }

        //----------------------------------------------------------------------------//
        function get_faction(string, id, altNo) {
            let ids = {}
            for (let i = 1; i < 7; i++) {
                let selector = `plid${i}|`
                if (!string.includes(selector)) continue;
                ids[i] = string.split(selector)[1].split("|")[0]
            }
            let umka = string.split("umka|")[1].split("|")[0]
            let tail = 0
            while (true) {
                let head = tail + 14
                if (head > umka.length) {
                    return false
                }
                let info = umka.slice(tail, head)
                if (ids[info.slice(0, 1)] === id.toString()) return factions[info.slice(1, 2)][altNo];
                tail = head;
            }
        }

        function getAltNo(html, nickname) {
            const matches = [...html.matchAll(/M\d+[\s\S]*?;/g)];
            for (const match of matches) {
                const info = match[0];
                if (!info.includes("|hero|")) continue;
                const infoNickname = info.split("|")[10];
                if (infoNickname !== nickname) continue;
                const altMatch = info.match(/cls(\d)/);
                if (altMatch) {
                    return altMatch[1];
                }
            }
            return 0;
        }

        function draw_search_row(parent, obj) {
            let battleHTML;
            fetch(`/war.php?lt=-1&warid=${obj.id}`)
                .then(response => response.text())
                .then(data => {
                    battleHTML = data;
                    return fetch(`battle.php?lastturn=-1&warid=${obj.id}`);
                })
                .then(response => response.text())
                .then(resultText => {
                    const altNo = getAltNo(resultText, NICKNAME);
                    const faction = get_faction(battleHTML, settings.id, altNo);
                    let tr = document.createElement('tr');
                    parent.appendChild(tr);

                    let td = document.createElement('td');
                    let a = document.createElement('a');
                    a.href = '/war.php?lt=-1&warid=' + obj.id + (obj.id_append ? obj.id_append : '');
                    a.textContent = obj.id;
                    td.appendChild(a);
                    td.style.width = '90px';
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = obj.date.toLocaleString();
                    td.style.width = '90px';
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = obj.desc;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.setAttribute('align', 'center');
                    td.style.width = '25px';
                    td.textContent = obj.exodus == enum_exodus.draw ? 'Н' : (obj.exodus == enum_exodus.win ? 'В' : 'П');
                    td.style.backgroundColor = obj.exodus == enum_exodus.draw ? 'grey' : (obj.exodus == enum_exodus.win ? 'green' : 'red');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.setAttribute('align', 'center');
                    td.style.width = '25px';
                    td.textContent = faction;
                    tr.appendChild(td);

                    recheck_rect();
                })
                .catch(error => {
                    console.error("Error fetching battle data:", error);
                });
        }

        //----------------------------------------------------------------------------//

        function on_stop() {
            is_parser_running = false;
            enable_settings(true);
            set_search_info();
            set_progress_info(null);
            recheck_rect();
            count_counter = 0;
            mercenaries = [];
            hunters = [];

            document.body.style.cursor = 'default';

            var el = document.getElementById(script_name + 'Stopper');
            el.setAttribute('disabled', '');

            if (save_to_file) {
                save_to_file = false;
                export_to_file();
            }
        }

        //----------------------------------------------------------------------------//

        function parse_data() {
            if (is_parser_running)
                return;

            document.body.style.cursor = 'wait';
            is_parser_running = true;

            var counter = {
                current: 0,
                last: get_last_page()
            };

            search_next(counter);
        }

        //----------------------------------------------------------------------------//

        function search_next(counter) {
            if (!is_parser_running) {
                on_stop();
                return;
            }

            set_progress_info(counter);

            var url = '/pl_warlog.php?id=' + settings.id + '&page=' + counter.current;
            send_async_get(url, counter);
        }

        //----------------------------------------------------------------------------//

        function send_async_get(url, counter) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.overrideMimeType('text/plain; charset=windows-1251');
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        ++counter.current;
                        search_value(xhr.response);

                        if (counter.current <= counter.last)
                            search_next(counter);
                        else
                            on_stop();
                    }
                }
            };

            xhr.send(null);
        }

        //----------------------------------------------------------------------------//

        function search_value(response_) {
            var re = /.*?<a href="warlog\.php\?warid=(\d+)(&show_for_all=[^"]+)*">(\d{2}-\d{2}-\d{2}\s\d{2}:\d{2})(.+?)<!--(\d+?)--><br>.*?/gmi;

            var raw_data = [],
                matches = [];

            while (matches = re.exec(response_))
                raw_data.push({ id: +matches[1], id_append: matches[2], battle_date: string_to_date(matches[3]), battle_str: matches[4], battle_type: +matches[5] });

            raw_data.sort(function(a, b) {
                return compare(b.id, a.id);
            });

            var table = document.getElementById(script_name + 'SearchTable');

            raw_data.forEach(function(current) {
                //any specific cases
                var battle_type = current.battle_type;

                switch (battle_type) {
                    case 0:
                        var hunt_re = /<i>.+?\(\d+\)(<\/b>)?<\/i>/gmi;
                        battle_type = hunt_re.test(current.battle_str) ? 0 : -1; // from CommonValuesFiller - hunt or old battles
                        break;

                    case 40: // from CommonValuesFiller - tactic guild
                        var ai_re = /<i>(<b>)?\*.+?\*(<\/b>)?<\//gmi;
                        var count = 0;

                        while (ai_re.test(current.battle_str))
                            ++count;

                        if (count)
                            battle_type = count == 3 ? -3 : -4; // from CommonValuesFiller - 3 ai or 2 ai
                        else {
                            var splitted = split_pvp_helper(current.battle_str);
                            var levels_before = splitted[0],
                                levels_after = splitted[1];

                            if (levels_before.length == 1 && levels_after.length == 1)
                                battle_type = -5; // from CommonValuesFiller - duel
                            else if (JSON.stringify(levels_before) == JSON.stringify(levels_after))
                                battle_type = -6; // from CommonValuesFiller - pair vs pair
                            else
                                battle_type = -7; // from CommonValuesFiller - mixed
                        }

                        break;

                    case 61: // from CommonValuesFiller - ranger guild
                        var pvp_re = /.*?pl_info\.php\?id=.*?/gmi;
                        var count = 0;

                        while (pvp_re.test(current.battle_str))
                            ++count;

                        battle_type = count == 1 ? 61 : -2; // from CommonValuesFiller - ai or pvp
                        break;

                    case 89: // from CommonValuesFiller - KBO
                        var splitted = split_pvp_helper(current.battle_str);
                        var levels_before = splitted[0],
                            levels_after = splitted[1];
                        var hero_on_left_side = splitted[2];

                        if (levels_before.length == levels_after.length)
                            if (levels_before.length == 1)
                                battle_type = hero_on_left_side ? -12 : -13; // from CommonValuesFiller - attack or defence vs solo player
                            else
                                battle_type = hero_on_left_side ? -8 : -9; // from CommonValuesFiller - attack or defence
                        else {
                            if (levels_before.length > levels_after.length)
                                battle_type = hero_on_left_side ? -12 : -11; // from CommonValuesFiller - attack or defence vs solo player
                            else
                                battle_type = hero_on_left_side ? -10 : -13; // from CommonValuesFiller - solo attack or defence
                        }

                        break;

                    case 104: // from CommonValuesFiller - tax battles
                        var splitted = split_pvp_helper(current.battle_str);
                        var levels_before = splitted[0],
                            levels_after = splitted[1];
                        var hero_on_left_side = splitted[2];

                        if (levels_before.length == levels_after.length)
                            battle_type = hero_on_left_side ? -14 : -15; // from CommonValuesFiller - attack or defence
                        else
                            battle_type = hero_on_left_side ? -16 : -17; // from CommonValuesFiller - attack or defence vs/as solo player

                        break;
                }

                var win_re = /<b>(.+?)<\/b>/gmi;
                var win_matches = win_re.exec(current.battle_str);

                var exodus = enum_exodus.win;

                if (!win_matches)
                    exodus = enum_exodus.draw;
                else {
                    var win = win_matches[1].indexOf(settings.id) != -1;

                    while (win_matches = win_re.exec(current.battle_str))
                        if (!win)
                            win = win_matches[1].indexOf(settings.id) != -1;

                    exodus = win ? enum_exodus.win : enum_exodus.loss;
                }

                var text_re = /.*?>([^<]+?)<.*?/gmi;
                var desc = '';
                var text_matches = [];

                while (text_matches = text_re.exec(current.battle_str))
                    desc += text_matches[1];

                var obj = { id: current.id, id_append: current.id_append, date: current.battle_date, desc: clear_specific_symbols(desc), exodus: exodus, bt: battle_type, original_bt: current.battle_type, raw_desc: current.battle_str };

                var is_suit = is_suitable(obj);
                if (is_parser_running && is_suit) {
                    const ids = searched.map(obj => obj.id);
                    searched.push(obj);
                    if (ids.includes(obj.id)) return;
                    draw_search_row(table, obj);
                }

                if (settings.dc_c) {
                    if (settings.count && is_suit && settings.count <= ++count_counter)
                        is_parser_running = false;

                    var date = new Date();
                    date.setDate(date.getDate() - settings.days);
                    if (settings.days && obj.date <= date)
                        is_parser_running = false;
                }
            });
        }

        //----------------------------------------------------------------------------//

        function split_pvp_helper(text) {
            var splitter = text.split('> vs <');
            if (splitter.length != 2)
                throw new Error('Incorrect splitter length');

            var levels_before = [],
                levels_after = [];
            var pvp_re = /.*?pl_info\.php\?id=.*?>.+?\[(\d+)]/gmi;

            var pvp_matches = [];
            while (pvp_matches = pvp_re.exec(splitter[0]))
                levels_before.push(pvp_matches[1]);

            while (pvp_matches = pvp_re.exec(splitter[1]))
                levels_after.push(pvp_matches[1]);

            if (!(levels_before.length && levels_after.length))
                throw new Error('Incorrect levels length');

            var hero_on_left = splitter[0].indexOf('font color=red') != -1;

            return [levels_before, levels_after, hero_on_left];
        }

        //----------------------------------------------------------------------------//

        function clear_specific_symbols(str) {
            var res = str;

            [': ', '• ', '&omega;&nbsp;', '&pi;&nbsp;', '&tau;&nbsp;', '&deg;&nbsp;', '•• ', '&#9674;&nbsp;'].forEach(function(current) {
                if (!res.indexOf(current))
                    res = res.substring(current.length);
            });

            return res;
        }

        //----------------------------------------------------------------------------//

        function is_suitable(obj) {
            if (settings.search.length) {
                var desc = settings.ci_c ? obj.desc.toLowerCase() : obj.desc;
                var search = settings.ci_c ? settings.search.toLowerCase() : settings.search;

                if (desc.indexOf(search) == -1)
                    return false;
            }

            var bt = CV.get_battle_type(obj.bt);

            if (settings.bt_c) {
                if (settings.sbt != empty_option)
                    if (bt.sbt != +settings.sbt)
                        return false;

                if (settings.bt != empty_option && +settings.bt != obj.bt && +settings.bt != obj.original_bt)
                    return false;
            }

            if (settings.dc_c) {
                if (settings.count && settings.count <= count_counter)
                    return false;

                var date = new Date();
                date.setDate(date.getDate() - settings.days);
                if (settings.days && obj.date <= date)
                    return false;
            }

            var max_choosed = (settings.max_bt_c || settings.max_win_bt_c),
                suitable_type = (bt.sbt == CV.enum_sbt.hunter || bt.sbt == CV.enum_sbt.mercenary);

            if (max_choosed && suitable_type) {
                if (bt.sbt == CV.enum_sbt.mercenary) {
                    var re = obj.exodus == enum_exodus.loss ? /<i><b>(.+?)\s{(\d+)}<\/b><\/i>/gmi : /<i>(.+?)\s{(\d+)}<\/i>/gmi;
                    var matches = re.exec(obj.raw_desc);

                    if (!matches) {
                        re = obj.exodus == enum_exodus.loss ? /<b><i>(.+?)\s{(\d+)}<\/i><\/b>/gmi : /<i>(.+?)\s{(\d+)}<\/i>/gmi;
                        matches = re.exec(obj.raw_desc);
                    }

                    if (!matches && obj.exodus == enum_exodus.draw) {
                        re = /<i>(.+?)\s{(\d+)}<\/i>/gmi;
                        matches = re.exec(obj.raw_desc);
                    }

                    var merc = get_mercenary(matches[1]);

                    if (merc)
                        return false;

                    mercenaries.push({ str: matches[1], lvl: +matches[2], exodus: obj.exodus });
                } else if (bt.sbt == CV.enum_sbt.hunter) {
                    var re = obj.exodus == enum_exodus.loss ? /<i><b>(.+?)\s\((\d+)\)<\/b><\/i>/gmi : /<i>(.+?)\s\((\d+)\)<\/i>/gmi;
                    var matches = re.exec(obj.raw_desc);

                    if (!matches) {
                        re = obj.exodus == enum_exodus.loss ? /<b><i>(.+?)\s\((\d+)\)<\/i><\/b>/gmi : /<i>(.+?)\s\((\d+)\)<\/i>/gmi;
                        matches = re.exec(obj.raw_desc);
                    }

                    if (!matches && obj.exodus == enum_exodus.draw) {
                        re = /<i>(.+?)\s\((\d+)\)<\/i>/gmi;
                        matches = re.exec(obj.raw_desc);
                    }

                    var hunt = get_hunter(matches[1]);

                    if (hunt)
                        return false;

                    hunters.push({ str: matches[1], count: +matches[2], exodus: obj.exodus });
                }
            }

            return true;
        }

        //----------------------------------------------------------------------------//

        function get_mercenary(str) {
            for (var i = 0; i < mercenaries.length; ++i)
                if (mercenaries[i].str == str)
                    return mercenaries[i];

            return null;
        }

        //----------------------------------------------------------------------------//

        function get_hunter(str) {
            for (var i = 0; i < hunters.length; ++i)
                if (hunters[i].str == str)
                    return hunters[i];

            return null;
        }

        //----------------------------------------------------------------------------//

        function enable_settings(enable) {
            ['IDInput', 'SearchInput', 'CIChb', 'SBTSelect', 'BTSelect', 'BTChb', 'DaysInput',
                'CountInput', 'DCChb', 'MaxBTChb', /*'MaxWinBTChb', */ 'StartInput', 'SaveFileChb'
            ].forEach(function(current) {
                var el = document.getElementById(script_name + current);
                enable ? el.removeAttribute('disabled') : el.setAttribute('disabled', '');
            });
        }

        //----------------------------------------------------------------------------//

        function reload_battle_types() {
            var el = document.getElementById(script_name + 'SBTSelect');
            var val = el.options[el.selectedIndex].value;

            el = document.getElementById(script_name + 'BTSelect');
            while (el.options.length)
                el.removeChild(el.options[0]);

            var tmp_bt = battle_types;

            if (val != empty_option)
                tmp_bt = tmp_bt.filter(function(current) {
                    return current.sbt == val;
                });

            var option = document.createElement('option');
            option.setAttribute('value', empty_option);
            el.appendChild(option);

            tmp_bt.forEach(function(current) {
                option = document.createElement('option');
                option.setAttribute('value', current.id);

                var text = document.createTextNode(current.name);
                option.appendChild(text);

                el.appendChild(option);
            });
        }

        //----------------------------------------------------------------------------//

        function load_settings() {
            var settings_ = load_value(script_name + 'Settings');

            if (settings_)
                return JSON.parse(settings_);

            settings_ = {
                id: '',
                search: '',
                sbt: empty_option,
                bt: empty_option,
                days: '',
                count: '',
                ci_c: false,
                bt_c: false,
                dc_c: false,
                max_bt_c: false,
                max_win_bt_c: false
            };

            return settings_;
        }

        //----------------------------------------------------------------------------//

        function save_settings() {
            var errors = [];

            var id = +document.getElementById(script_name + 'IDInput').value;
            if (isNaN(id) || id < 1)
                errors.push('Идентификатор игрока выражается положительным числом');

            var search = document.getElementById(script_name + 'SearchInput').value.trim();
            var bt_c = document.getElementById(script_name + 'BTChb').checked;

            if (!bt_c && !search.length)
                errors.push('Не указаны условия поиска');

            var dc_c = document.getElementById(script_name + 'DCChb').checked;
            var days = +document.getElementById(script_name + 'DaysInput').value;
            var count = +document.getElementById(script_name + 'CountInput').value;

            if (dc_c) {
                var days_correct = !isNaN(days) && days >= 1;
                var count_correct = !isNaN(count) && count >= 1;

                if (!days_correct && !count_correct)
                    errors.push('Не указано количество дней и/или боев поиска');
            }

            var max_bt_c = document.getElementById(script_name + 'MaxBTChb').checked;
            var max_win_bt_c = document.getElementById(script_name + 'MaxWinBTChb').checked;

            if (max_bt_c && max_win_bt_c)
                errors.push('Поиск макс. и макс. выигрышных боев не может осуществляться одновременно');

            if (errors.length) {
                alert('Ошибки при сохранении:\n\n' + errors.join('\n'));
                return false;
            }

            var select = document.getElementById(script_name + 'SBTSelect');
            settings.sbt = select.options[select.selectedIndex].value;

            select = document.getElementById(script_name + 'BTSelect');
            settings.bt = select.options[select.selectedIndex].value;

            settings.id = id;
            settings.search = search;
            settings.days = days;
            settings.count = count;

            settings.ci_c = document.getElementById(script_name + 'CIChb').checked;
            settings.bt_c = bt_c;
            settings.dc_c = dc_c;
            settings.max_bt_c = max_bt_c;
            settings.max_win_bt_c = max_win_bt_c;

            settings.save_file = document.getElementById(script_name + 'SaveFileChb').checked;

            save_value(script_name + 'Settings', JSON.stringify(settings));
            return true;
        }

        //----------------------------------------------------------------------------//

        function set_settings() {
            var el = document.getElementById(script_name + 'IDInput');
            el.value = settings.id;

            el = document.getElementById(script_name + 'SearchInput');
            el.value = settings.search;

            el = document.getElementById(script_name + 'CIChb');
            el.checked = settings.ci_c;

            el = document.getElementById(script_name + 'SBTSelect');

            for (var i = 0; i < el.options.length; ++i)
                if (el.options[i].value == settings.sbt) {
                    el.options[i].selected = true;
                    break;
                }

            reload_battle_types();

            el = document.getElementById(script_name + 'BTSelect');

            for (var i = 0; i < el.options.length; ++i)
                if (el.options[i].value == settings.bt) {
                    el.options[i].selected = true;
                    break;
                }

            el = document.getElementById(script_name + 'BTChb');
            el.checked = settings.bt_c;

            el = document.getElementById(script_name + 'DaysInput');
            el.value = settings.days;

            el = document.getElementById(script_name + 'CountInput');
            el.value = settings.count;

            el = document.getElementById(script_name + 'DCChb');
            el.checked = settings.dc_c;

            el = document.getElementById(script_name + 'MaxBTChb');
            el.checked = settings.max_bt_c;

            el = document.getElementById(script_name + 'MaxWinBTChb');
            el.checked = settings.max_win_bt_c;

            el = document.getElementById(script_name + 'SaveFileChb');
            el.checked = settings.save_file;
        }

        //----------------------------------------------------------------------------//

        function clear_settings() {
            if (is_parser_running)
                return;

            remove_value(script_name + 'Settings');
            settings = load_settings();
            set_settings();
        }

        //----------------------------------------------------------------------------//

        function get_last_page() {
            var url = '/pl_warlog.php?id=' + settings.id + '&page=999999';
            var response = send_get(url);
            var page = /a class="active" href="#">(\d+?)</gmi.exec(response);

            return page ? (+page[1] - 1) : 0;
        }

        //----------------------------------------------------------------------------//

        function recheck_rect() {
            var div = document.getElementById(script_name + 'Div');
            var trs = div.querySelectorAll('tr');

            var height = 40;
            for (var i = 0; i < trs.length; ++i)
                height += trs[i].clientHeight;

            div.style.height = height > 700 ? 700 : height;
            div.style.overflowY = height > 700 ? 'scroll' : 'hidden';
        }

        //----------------------------------------------------------------------------//

        function export_to_file() {
            if (!searched.length)
                return;

            var linebreak = '\n';
            var res = ['ID боя', 'Описание', 'Результат'].join(';') + linebreak;

            searched.forEach(function(current) {
                res += [current.id + (current.id_append ? current.id_append : ''), current.desc, current.exodus].join(';') + linebreak;
            });

            save_file(res, 'Сейчас будет предложено сохранить файл с результатами. Переименуйте его в формат .csv, разделитель - ";"');
        }

        //----------------------------------------------------------------------------//

    } catch (e) {
        alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
        throw e;
    }
}()); // wrapper end

//----------------------------------------------------------------------------//