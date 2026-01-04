// ==UserScript==
// @name           Sorryops
// @name:ru        Сориупс
// @namespace      https://git.disroot.org/electromagneticcyclone/sorryops
// @version        20240503.2
// @description    Collect and reuse ORIOKS test answers
// @description:ru Скрипт для сбора и переиспользования ответов на тесты ОРИОКС
// @icon           https://sorryops.ru/favicon.ico
// @author         electromagneticcyclone & angelbeautifull
// @license        GPL-3.0-or-later
// @supportURL     https://git.disroot.org/electromagneticcyclone/sorryops
// @match          https://orioks.miet.ru/student/student/test*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @connect        sorryops.ru
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/481036/Sorryops.user.js
// @updateURL https://update.greasyfork.org/scripts/481036/Sorryops.meta.js
// ==/UserScript==

/* Version */
const VERSION = "20240503.2";
/* End Version */

/* Charset */
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
/* End Charset */

/* Labels */

const all_labels = {
    en: {
        l: "English",
        settings_title: "Settings",
        script_language: "Language",
        show_user_id: "Show user ID",
        user_id: "User ID (keep private)",
        server: "Sync answers with server (leave blank to disable)",
        wait_server_response: "Wait server response",
        auto_answer: "Auto answer",
        auto_answer_no: "No",
        auto_answer_first: "First",
        auto_answer_random: "Random",
        auto_answer_not_greedy: "Choose a known answer if there are more wrong answers than that number",
        auto_answer_greed_level: "Number of randomly answered questions",
        display_values: "Answers variant",
        display_values_ori: "ORIOKS",
        display_values_sorry: "Sorry",
        display_values_both: "Both",
        display_answer: "Display answer near variant",
        stop_timer: "Freeze and hide timer",
        register_keyboard_keys: "Register hotkeys",
        copy_answers: "Copy results to the clipboard",
        append_question_number: "Show question numbers in the final report",
        accumulator_enable: "Accumulate test results in one field",
        auto_continue: "Auto continue (DANGEROUS!!! Will be disabled after an hour. Press `d` to disable)",
        auto_restart: "Auto restart (DANGEROUS!!! Will be disabled after an hour. Press `d` to disable. Make sure you have infinite attempts)",
    },
    ru: {
        l: "Русский",
        settings_title: "Настройки",
        script_language: "Язык",
        show_user_id: "Показать индетификатор пользователя",
        user_id: "Индетификатор (держать в секрете)",
        server: "Синхронизировать ответы с сервером (оставить пустым для отключения)",
        wait_server_response: "Ждать ответа сервера",
        auto_answer: "Автовыбор ответа",
        auto_answer_no: "Нет",
        auto_answer_first: "Первый",
        auto_answer_random: "Случайный",
        auto_answer_not_greedy: "Выбирать известный ответ, если неправильных больше этого числа",
        auto_answer_greed_level: "Количество вопросов, на которые будет случайный ответ",
        display_values: "Вариант отображения ответов",
        display_values_ori: "ОРИОКС",
        display_values_sorry: "Сори",
        display_values_both: "Оба",
        display_answer: "Отображать ответ рядом с вариантом",
        stop_timer: "Заморозить и скрыть таймер",
        register_keyboard_keys: "Горячие клавиши",
        copy_answers: "Копировать результаты в буфер обмена",
        append_question_number: "Отображать номер вопроса в финальном отчёте",
        accumulator_enable: "Собирать отчёты в одно поле",
        auto_continue: "Автопродолжение (ОПАСНО!!! Отключается через час. Нажмите `d`, чтобы остановить)",
        auto_restart: "Автоперезапуск (ОПАСНО!!! Отключается через час. Нажмите `d`, чтобы остановить. Убедитесь, что количество попыток неограничено)",
    },
};

var labels = all_labels[(() => {
    var lang = GM_getValue('language', "-");
    if (!lang || (lang == "-")) {
        lang = navigator.language || navigator.userLanguage;
    }
    for (var l in all_labels) {
        if (lang.includes(l)) {
            return l;
        }
    }
})()];
if (labels == undefined) {
    labels = all_labels.ru;
}

/* End Labels */

/* Config */

var config = new GM_config({
    id: 'config',
    title: labels.settings_title,
    fields: {
        script_language: {
            label: labels.script_language,
            type: 'select',
            options: [
                '-',
                all_labels.en.l,
                all_labels.ru.l,
            ],
            default: '-',
        },
        show_user_id: {
            label: labels.show_user_id,
            type: 'checkbox',
            default: false,
        },
        user_id: {
            label: labels.user_id + (GM_getValue("show_user_id", false) ? "" : "<input readonly value='******'>"),
            type: GM_getValue("show_user_id", false) ? 'text' : 'hidden',
            save: false,
            default: '',
        },
        valid_user_id: {
            type: 'hidden',
            default: '',
        },
        server: {
            label: labels.server,
            type: 'text',
            default: '',
        },
        wait_server_response: {
            label: labels.wait_server_response,
            type: 'checkbox',
            default: true,
        },
        auto_answer: {
            label: labels.auto_answer,
            type: 'select',
            options: [
                labels.auto_answer_no,
                labels.auto_answer_first,
                labels.auto_answer_random,
            ],
            default: labels.auto_answer_no,
        },
        auto_answer_not_greedy: {
            label: labels.auto_answer_not_greedy,
            type: 'number',
            default: -1,
        },
        auto_answer_greed_level: {
            label: labels.auto_answer_greed_level,
            type: 'number',
            default: -1,
        },
        display_values: {
            label: labels.display_values,
            type: 'select',
            options: [
                labels.display_values_ori,
                labels.display_values_sorry,
                labels.display_values_both,
            ],
            default: labels.display_values_ori,
        },
        display_answer: {
            label: labels.display_answer,
            type: 'checkbox',
            default: true,
        },
        stop_timer: {
            label: labels.stop_timer,
            type: 'checkbox',
            default: false,
        },
        register_keyboard_keys: {
            label: labels.register_keyboard_keys,
            type: 'checkbox',
            default: true,
        },
        copy_answers: {
            label: labels.copy_answers,
            type: 'checkbox',
            default: false,
        },
        append_question_number: {
            label: labels.append_question_number,
            type: 'checkbox',
            default: true,
        },
        accumulator_enable: {
            label: labels.accumulator_enable,
            type: 'checkbox',
            default: false,
        },
        auto_continue: {
            label: labels.auto_continue,
            type: 'checkbox',
            default: false,
        },
        auto_continue_time: {
            type: 'hidden',
            default: 0,
        },
        auto_restart: {
            label: labels.auto_restart,
            type: 'checkbox',
            default: false,
        },
        auto_restart_time: {
            type: 'hidden',
            default: 0,
        },
    },
    events: {
        init: function() {
            var valid_user_id = this.get('valid_user_id');
            if (!validate_user_id(valid_user_id)) {
                valid_user_id = generate_user_id();
            }
            this.set('user_id', valid_user_id);
            this.set('valid_user_id', valid_user_id);
            GM_setValue('show_user_id', this.get('show_user_id'));
            GM_setValue('stop_timer', this.get('stop_timer'));
            if (this.get('auto_continue') && (this.get('auto_answer') == "No")) {
                this.set('auto_continue', false);
            }
            if (this.get('accumulator_enable') == false) {
                GM_setValue('accumulated_answers', "");
            }
            switch (this.get('script_language')) {
                case all_labels.en.l:
                    GM_setValue('language', "en");
                    break;
                case all_labels.ru.l:
                    GM_setValue('language', "ru");
                    break;
                default:
                    GM_setValue('language', "-");
                    break;
            }
        },
        save: function(forgotten) {
            this.set('auto_continue_time', Date.now());
            this.set('auto_restart_time', Date.now());
            if (this.isOpen && this.get('auto_continue') && (this.get('auto_answer') == "No")) {
                this.set('auto_continue', false);
                alert("Can't automatically continue without answer.");
            }
            if (!validate_user_id(forgotten['user_id'])) {
                this.set('user_id', this.get('valid_user_id'))
                alert('User ID is invalid!');
            } else {
                this.set('valid_user_id', forgotten['user_id'])
            }
            this.init();
        },
    },
});

GM_registerMenuCommand(labels.settings_title, () => {
    config.open();
});

/* End Config */

/* Server */

function send_to_server(results) {
    var server = config.get('server');
    if (server != '') {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://' + server,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(results),
        });
    }
}

function fetch_from_server(path, func) {
    var server = config.get('server');
    var fetched_data = GM_getValue('fetched_data');
    if ((fetched_data == undefined) || (fetched_data.forbidden == true)) {
        fetched_data = {};
    }
    if ((server != '') && (Object.keys(fetched_data).length == 0)) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://' + server + '/' + path + '?uid=' + config.get('user_id') + "&sid=" + student_name,
            timeout: 1000,
            onload: function (response) {
                var text = response.responseText;
                if (response.status == 404) {
                    fetched_data = {version: VERSION};
                    GM_setValue('fetched_data', fetched_data);
                    func(fetched_data);
                } else if (response.status == 403) {
                    fetched_data = {version: VERSION, forbidden: true};
                    forbidden = true;
                    GM_setValue('fetched_data', fetched_data);
                    func(fetched_data);
                } else if (!text.includes("{")) {
                    func({});
                } else {
                    fetched_data = JSON.parse(text);
                    GM_setValue('fetched_data', fetched_data);
                    func(fetched_data);
                }
            },
            onerror: function (e) {
                func({});
            },
            onabort: function (e) {
                func({});
            },
            ontimeout: function (e) {
                func({});
            }
        });
    } else {
        func(fetched_data);
    }
}

/* End Server */

/* Stop timer */

if (GM_getValue('stop_timer', true)) {
    var i, pbox;
    var pboxes = document.getElementsByTagName('p');
    for (i = 0; i < pboxes.length; i++) {
        pbox = pboxes[i];
        if (pbox.textContent.includes("Осталось:")) {
            pbox.parentNode.remove();
            document.getElementsByTagName('hr')[0].remove();
            var injectFakeTimer = function(window) {
                window.setInterval = (f, t, its_me = false) => {
                    return window.setInterval(f, its_me ? t : 10^999);
                };
            }
            var scriptFakeTimer = document.createElement('script');
            scriptFakeTimer.setAttribute("type", "application/javascript");
            scriptFakeTimer.textContent = '(' + injectFakeTimer + ')(window);';
            document.body.appendChild(scriptFakeTimer);
            break;
        }
    }
}

/* End Stop timer */

/* Events */

window.addEventListener('load', main);
window.onkeydown = (e) => {
    if ((e.key == "Enter") && config.get('register_keyboard_keys')) {
        press_continue_btn();
    }
    if (e.key == "d") {
        config.set('auto_continue', false);
        config.set('auto_restart', false);
        config.save();
    }
};

/* End Events */

/* Page properties */

// const success = -1487162948;
var answers = [];
var sorted_objects_value = [];
var variant, hash, type, correct, incorrect, version;
var student_name = "";
var forbidden = false;
var prev_new_answer_f = false;
var new_answer_f = false;
var testID = (() => {
    var url = document.URL;
    url = url.slice(url.indexOf("idKM=") + 5);
    url = url.slice(0, url.indexOf("&"));
    return url;
})();

/* End properties */

/* Functions */

function comb(s, blacklist = []) {
    var result = [];
    for (var i = 1; i < (1 << s.length); i++) {
        var temp = '';
        for (var j = 0; j < s.length; j++) {
            if (i & Math.pow(2, j)) {
                temp += s[j];
            }
        }
        temp = "{" + temp + "}";
        if (!blacklist.includes(temp)) {
            result.push(temp);
        }
    }
    return result;
}

// https://github.com/ajayyy/maze-utils/blob/036086403f675b8fea0e22065f26ba534e351562/src/setup.ts
function generate_user_id(length = 36) {
    var i;
    var result = "";
    const cryptoFuncs = typeof window === "undefined" ? crypto : window.crypto;
    if (cryptoFuncs && cryptoFuncs.getRandomValues) {
        const values = new Uint32Array(length);
        cryptoFuncs.getRandomValues(values);
        for (i = 0; i < length; i++) {
            result += charset[values[i] % charset.length];
        }
    } else {
        for (i = 0; i < length; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
    }
    return result;
}

function validate_user_id(uid, length = 36) {
    var i;
    if (uid.length != length) {
        return false;
    }
    for (i = 0; i < length; i++) {
        if (!charset.includes(uid[i])) {
            return false;
        }
    }
    return true;
}

// https://stackoverflow.com/a/15710692
function hashCode(s, return_num = false) {
    var result = "";
    var h = s.split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    if (return_num) {
        return h;
    }
    while (h != 0) {
        result += charset[((h % charset.length) + charset.length) % charset.length];
        h = Math.floor(Math.abs(h) / charset.length) * (h / Math.abs(h));
    }
    return result;
}

function set_to_clear(id, exec_if_not_cleared) {
    var clear = GM_getValue('clear_tests', new Object());
    if (!clear[id]) {
        exec_if_not_cleared();
    }
    clear[id] = true;
    GM_setValue('clear_tests', clear);
}

function DB_cleaner() {
    var clear = GM_getValue('clear_tests', new Object());
    var tests = GM_getValue('tests', new Object());
    for (var test in clear) {
        delete tests[test];
    }
    GM_setValue('tests', tests);
    GM_setValue('clear_tests', new Object());
}

function press_continue_btn() {
    var i;
    var buttons = document.getElementsByTagName('button');
    var button = undefined;
    for (i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        if (btn.textContent.includes("Пройти") || btn.textContent.includes("Продолжить")) {
            button = btn;
            break;
        }
    }
    if (button === undefined) {
        return;
    }
    if (button.textContent.includes("Пройти")) {
        window.location.replace(button.parentNode.href);
    } else if (button.textContent.includes("Продолжить")) {
        button.click();
    }
}

function calculate_variant_hash() {
    variant = document.getElementById('w0').parentNode.textContent;
    variant = variant.slice(variant.indexOf("Вопрос:"));
    hash = hashCode(variant);
}

function update_variant() {
    var i, pbox;
    var status = "Неизвестен";
    var chosen_answer = "";
    switch (type) {
        case 'checkbox':
        case 'radio': {
            for (i = 0; i < answers.length; i++) {
                chosen_answer += answers[i].checked ? answers[i].sorry_value : "";
            }
            chosen_answer = chosen_answer.split('').sort().join('');
            if (type == 'checkbox') {
                chosen_answer = "{" + chosen_answer + "}";
            }
        } break;
        case 'text': {
            for (i = 0; i < answers.length; i++) {
                chosen_answer += "[" + answers[i].value + "]";
            }
        }
    }
    new_answer_f = true;
    if ((version != VERSION) && (version !== undefined)) {
        status = "<span style='color: red;'>Скрипт устарел</span>";
        GM_setValue('fetched_data', {});
    } else if (version === undefined) {
        if (config.get('wait_server_response')) {
            status = "<span style='color: blue;'>Ожидание ответа</span>";
        } else {
            status = "<span style='color: red;'>Нет соединения</span>";
        }
    } else if (forbidden) {
        status = "<span style='color: red;'>Доступ запрещён</span>";
    } else if (chosen_answer == correct) {
        status = "<span style='color: green;'>Верно</span>";
        new_answer_f = false;
    } else if (incorrect.includes(chosen_answer)) {
        status = "<span style='color: red;'>Неверно</span>";
        new_answer_f = false;
    }
    GM_setValue('new_answer_f', prev_new_answer_f || new_answer_f);
    var pboxes = document.getElementsByTagName('p');
    const display_answer = config.get('display_answer');
    for (i = 0; i < pboxes.length; i++) {
        pbox = pboxes[i];
        if (pbox.textContent.includes("Вопрос:")) {
            pbox.innerHTML = "<i>(Вариант <input onfocus='this.select();' id='variant' value='" + hash + (display_answer == true ? (" " + chosen_answer) : "") + "' readonly>)</i>";
            if (config.get('server') != '') {
                pbox.innerHTML += "<br>Статус: " + status;
            }
            pbox.innerHTML += "<br>Вопрос:";
            break;
        }
    }
    var question_num = undefined;
    for (i = 0; i < pboxes.length; i++) {
        pbox = pboxes[i];
        if (pbox.textContent.includes("Текущий вопрос: ")) {
            question_num = pbox.textContent.slice(variant.indexOf("Текущий вопрос: ") + 16).trim();
            break;
        }
    }
    if (hash !== undefined) {
        var tests = GM_getValue('tests', new Object());
        if (tests[testID] === undefined) {
            tests[testID] = new Object();
        }
        tests[testID][hash] = [question_num, chosen_answer, answers.length];
        GM_setValue('tests', tests);
    }
}

function color_answers() {
    var answer, correct_element, incorrect_element, sorry_val;
    switch (type) {
        case 'radio': {
            for (answer in answers) {
                if (answers[answer].sorry_value == correct) {
                    if (!answers[answer].sorry_colored && (version !== undefined)) {
                        correct_element = answers[answer].parentNode;
                        sorry_val = answers[answer].sorry_value;
                        correct_element.innerHTML = "<span style='color: green;'>" + correct_element.innerHTML + "</span>";
                        answers[answer] = correct_element.getElementsByTagName('input')[0];
                        answers[answer].sorry_value = sorry_val;
                        answers[answer].sorry_colored = true;
                    }
                }
                if (incorrect.includes(answers[answer].sorry_value)) {
                    if (!answers[answer].sorry_colored && (version !== undefined)) {
                        incorrect_element = answers[answer].parentNode;
                        sorry_val = answers[answer].sorry_value;
                        incorrect_element.innerHTML = "<span style='color: red;'>" + incorrect_element.innerHTML + "</span>";
                        answers[answer] = incorrect_element.getElementsByTagName('input')[0];
                        answers[answer].sorry_value = sorry_val;
                        answers[answer].sorry_colored = true;
                    }
                }
            }
        } break;
        case 'checkbox': {
            for (answer in answers) {
                if (correct != undefined) {
                    if (correct.includes(answers[answer].sorry_value)) {
                        if (!answers[answer].sorry_colored && (version !== undefined)) {
                            correct_element = answers[answer].parentNode;
                            sorry_val = answers[answer].sorry_value;
                            correct_element.innerHTML = "<span style='color: green;'>" + correct_element.innerHTML + "</span>";
                            answers[answer] = correct_element.getElementsByTagName('input')[0];
                            answers[answer].sorry_value = sorry_val;
                            answers[answer].sorry_colored = true;
                        }
                    }
                }
            }
        } break;
    }
}

function auto_answer() {
    var answer, chosen_answer, sorry_val, correct_element, incorrect_element;
    const auto_answer = config.get('auto_answer');
    function pick_answer(picked) {
        switch (type) {
            case 'radio': {
                for (answer in answers) {
                    if (answers[answer].sorry_value == picked) {
                        answers[answer].click();
                    }
                }
            } break;
            case 'checkbox': {
                for (answer in answers) {
                    if (picked.includes(answers[answer].sorry_value)) {
                        answers[answer].click();
                    }
                }
            } break;
            case 'text': {
                var corr = picked.slice(1, picked.length - 1).split('][');
                for (i = 0; (i < answers.leght) && (i < corr.length); i++) {
                    answers[i].placeholder = corr[i];
                }
            } break;
        }
    }
    var greed = GM_getValue('greed');
    if (greed === undefined) {
        greed = 99999;
    }
    if (correct != undefined) {
        pick_answer(correct);
    } else if (auto_answer == labels.auto_answer_random) {
        if ((incorrect.length >= Math.max(config.get('auto_answer_not_greedy'), 1)) &&
           ((config.get('auto_answer_not_greedy') > 0) || (greed <= 0))) {
            chosen_answer = Math.floor(Math.random() * incorrect.length);
            pick_answer(incorrect[chosen_answer]);
        } else {
            GM_setValue('greed', greed - 1);
            switch (type) {
                case 'radio': {
                    var possible_answers = [];
                    for (answer in answers) {
                        if (incorrect.includes(answers[answer].sorry_value) == false) {
                            possible_answers.push(answer);
                        }
                    }
                    chosen_answer = Math.floor(Math.random() * possible_answers.length);
                    answers[possible_answers[chosen_answer]].click();
                } break;
                case 'checkbox': {
                    var combs = comb(charset.slice(0, answers.length), incorrect);
                    var pick = combs[Math.floor(Math.random() * combs.length)];
                    for (i = 0; i < answers.length; i++) {
                        if(pick.includes(answers[i].sorry_value)) {
                            answers[i].click();
                        }
                    }
                } break;
            }
        }
    } else if (auto_answer == labels.auto_answer_first) {
        Object.values(sorted_objects_value)[0].click();
    }
}

function parse_server_data(server_data) {
    version = server_data.version;
    if ((version !== VERSION) && (version !== undefined)) {
        console.warn("Sorryops is outdated");
        server_data = {};
        GM_openInTab("https://greasyfork.org/en/scripts/481036-sorryops");
        config.set('auto_continue', false);
    }
    if (server_data.hasOwnProperty('correct')) {
        correct = server_data.correct;
        if (correct === undefined) {
            correct = undefined;
        } else if (correct.hasOwnProperty(hash)) {
            correct = correct[hash];
        } else {
            correct = undefined;
        }
    } else {
        correct = undefined;
    }
    if (server_data.hasOwnProperty('incorrect')) {
        incorrect = server_data.incorrect;
        if (incorrect === undefined) {
            incorrect = [];
        } else if (incorrect.hasOwnProperty(hash)) {
            incorrect = incorrect[hash];
        } else {
            incorrect = [];
        }
    } else {
        incorrect = [];
    }
}

function auto_continue() {
    var old_time, cur_time;
    if (config.get('auto_continue')) {
        old_time = config.get('auto_continue_time');
        cur_time = Date.now();
        if (cur_time - old_time > 60 * 60 * 1000) {
            config.set('auto_continue', false);
        } else {
            press_continue_btn();
        }
    }
}

function auto_restart() {
    var old_time, cur_time;
    if (config.get('auto_restart')) {
        old_time = config.get('auto_restart_time');
        cur_time = Date.now();
        if (cur_time - old_time > 60 * 60 * 1000) {
            config.set('auto_restart', false);
        } else {
            press_continue_btn();
        }
    }
}

/* End Functions */

/* Handlers */

function test_form_handler(server_response) {
    var i, key, answer, sorry_val;
    var complicated_hash_f = false;
    var boxes = [];
    var sorted_objects;
    var objects_hash = new Object();
    var objects_value = new Object();
    var form = document.getElementById('testform-answer');
    var manual_form = document.getElementById('testform-answer-0');
    if (form != null) {
        boxes = form.getElementsByTagName('input');
    } else if (manual_form != null) {
        i = 1;
        while (manual_form != null) {
            boxes.push(manual_form);
            manual_form = document.getElementById('testform-answer-' + i++);
        }
    }
    type = boxes[0].type;
    for (i = 0; i < boxes.length; i++) {
        if (boxes[i].parentNode.innerHTML.includes("<img")) {
            complicated_hash_f = true;
            break;
        }
    }
    switch (type) {
        case 'checkbox':
        case 'radio': {
            for (i = 0; i < boxes.length; i++) {
                boxes[i].hash = hashCode(complicated_hash_f ? boxes[i].parentNode.innerHTML : boxes[i].parentNode.innerText, true);
                objects_hash[boxes[i].hash] = boxes[i];
                objects_value[boxes[i].value] = boxes[i];
            }
            const sorted_objects_hash = Object.keys(objects_hash).sort().reduce(
                (obj, key) => {
                    obj[key] = objects_hash[key];
                    return obj;
                }, {}
            );
            sorted_objects_value = Object.keys(objects_value).sort().reduce(
                (obj, key) => {
                    obj[key] = objects_value[key];
                    return obj;
                }, {}
            );
            i = 0;
            sorted_objects = sorted_objects_hash;
            for (key in sorted_objects) {
                sorted_objects[key].parentNode.remove();
                form.appendChild(sorted_objects[key].parentNode);
            }
            calculate_variant_hash();
            parse_server_data(server_response);
            for (key in sorted_objects) {
                sorted_objects[key].sorry_value = charset[i++];
                var span = document.createElement('span');
                var disp_val;
                switch (config.get('display_values')) {
                    case labels.display_values_ori:
                        disp_val = sorted_objects[key].value;
                        break;
                    case labels.display_values_sorry:
                        disp_val = sorted_objects[key].sorry_value;
                        break;
                    case labels.display_values_both:
                        disp_val = sorted_objects[key].value + ":" + sorted_objects[key].sorry_value;
                        break;
                }
                span.innerHTML = disp_val + ") ";
                sorted_objects[key].parentNode.insertBefore(span, sorted_objects[key]);
                answers.push(sorted_objects[key]);
            }
            if (config.get('display_values') == labels.display_values_ori) {
                for (key in sorted_objects_value) {
                    sorted_objects_value[key].parentNode.remove();
                    form.appendChild(sorted_objects_value[key].parentNode);
                }
            }
        } break;
        case 'text': {
            answers = boxes;
            calculate_variant_hash();
        } break;
    }
    color_answers();
    auto_answer();
    update_variant();
    for (i = 0; i < answers.length; i++) {
        answers[i].addEventListener('change', update_variant);
    }
}

function result_page_handler() {
    var i;
    var correct_num = variant.slice(variant.indexOf("Число верных ответов: ") + 22);
    var all_num = variant.slice(variant.indexOf("Число неверных ответов: ") + 24);
    correct_num = correct_num.slice(0, correct_num.indexOf("\n")).trim();
    all_num = all_num.slice(0, all_num.indexOf("\n")).trim();
    all_num = (parseInt(all_num) + parseInt(correct_num)).toString();
    var test = GM_getValue('tests', new Object())[testID];
    if (test === undefined) {
        return;
    }
    var printer = "";
    var sorted_test = [];
    for (var hash in test) {
        sorted_test.push([hash].concat(test[hash]));
    }
    sorted_test.sort((a, b) => {return a[1] - b[1]});
    for (i = 0; i < sorted_test.length; i++) {
        printer += (config.get('append_question_number') ? (sorted_test[i][1] + ") ") : "") + sorted_test[i][0] + " " + sorted_test[i][2] + "\n";
    }
    printer += correct_num;
    if (config.get('copy_answers')) {
        GM_setClipboard(printer);
    }
    if (config.get('accumulator_enable')) {
        var acc = GM_getValue('accumulated_answers', "");
        if (acc != "") {
            acc += "\n\n";
        }
        var prefix = testID;
        if (prefix != "") {
            acc += prefix + "\n";
        }
        acc += printer;
        GM_setValue('accumulated_answers', acc);
        printer = acc;
    }
    printer = "<textarea readonly style='resize:none; width:fit-content; height:fit-content' rows='" + String(Object.keys(test).length + 1) + "' cols='50' onfocus='this.select();' id='answers'>" + printer + "</textarea>";
    var pboxes = document.getElementsByTagName('p');
    for (i = 0; i < pboxes.length; i++) {
        var pbox = pboxes[i];
        if (pbox.textContent.includes("Попытка ")) {
            pbox.outerHTML += printer;
            break;
        }
    }
    set_to_clear(testID, () => {
        if (GM_getValue('new_answer_f')) {
            send_to_server({
                type: "test_results",
                uid: config.get('user_id'),
                sid: student_name,
                id: testID,
                answers: sorted_test,
                correct: correct_num,
                all: all_num,
            });
        }
        GM_setValue('fetched_data', {});
        GM_setValue('new_answer_f', false);
        var greed = config.get('auto_answer_greed_level');
        if (greed < 0) {
            greed = 99999;
        }
        GM_setValue('greed', greed);
    });
}

/* End Handlers */

function main() {
    var abox;
    var aboxes = document.getElementsByTagName('a');
    for (abox in aboxes) {
        if ((aboxes[abox].className == 'dropdown-toggle') && aboxes[abox].href.endsWith('#') && !(aboxes[abox].title == 'Уведомления и объявления')) {
            student_name = hashCode(aboxes[abox].innerText);
            break;
        }
    }
    variant = document.getElementById('w0').parentNode.textContent;
    prev_new_answer_f = !!GM_getValue('new_answer_f');
    if (variant.includes("Вопрос:")) {
        fetch_from_server(testID, (server_response) => {
            DB_cleaner();
            test_form_handler(server_response);
            if (config.get('wait_server_response') && (version === undefined)) {
                window.setInterval(() => {fetch_from_server(testID, (server_response) => {
                    if (version === undefined) {
                        parse_server_data(server_response);
                        color_answers();
                        if (config.get('auto_continue')) {
                            auto_answer();
                        }
                        update_variant();
                        if (version === VERSION) {
                            auto_continue();
                        }
                    }
                })}, 1000, true);
            } else {
                auto_continue();
            }
        });
    } else if (variant.includes("Результат прохождения теста:")) {
        result_page_handler();
        auto_restart();
    }
}