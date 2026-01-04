// ==UserScript==
// @name      Nekto.me - Быстрый переход к новому диалогу
// @namespace    http://nekto.me
// @version      0.35
// @description   Nekto.me: добавляет кнопки для быстрого перехода к новому диалогу
// @author       Krita
// @match        http://nekto.me/chat*
// @match        https://nekto.me/chat*
// @grant       GM_addStyle
// @grant       GM_getResourceText

// @downloadURL https://update.greasyfork.org/scripts/373921/Nektome%20-%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%20%D0%BA%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%D1%83%20%D0%B4%D0%B8%D0%B0%D0%BB%D0%BE%D0%B3%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/373921/Nektome%20-%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%20%D0%BA%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%D1%83%20%D0%B4%D0%B8%D0%B0%D0%BB%D0%BE%D0%B3%D1%83.meta.js
// ==/UserScript==


GM_addStyle ( `
.checkbox, .checkbox input[type="checkbox"]{
margin: 0
}
.checkbox label{
padding: 0;
margin-left: 20px
}
.night_theme .dropdown-menu{
background-color: #101417;
}
.night_theme .dropdown-menu > li > a {
color: #e2e3e7;
}
.dropdown-menu li.checkbox{
display: inline-flex;
margin: 0px 6px;
align-items: center;
}
.right_block_hc.main_chat_but{
display: flex;
}
button.btn.btn-md.btn-my1{
border-radius: 50px !important;
}
.btn-group {
    margin-left: 6px;
}

.progress-countdown{
  height: 8px;
  margin-bottom: -8px;
  position: relative;
  background-color: transparent;
}

.progress-countdown .progress-bar{
  animation: progressbar-countdown;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: paused;
  animation-timing-function: linear;
}
@keyframes progressbar-countdown {
  0% {
    width: 100%;
    background: #3bb93b;
  }
  100% {
    width: 0%;
    background: #1e94d4;
  }
}

`);

//------------------------------------//

const options = {
    autoDialog: true,   // Автоматически переходить к новому диалогу
    skipNoAnswer: true, // Пропускать собеседников, которые не отвечают
    skipFilter: false,  // Пропускать сообщения, совпадающие с фиильтром
    skipDelay: 20,      // Задержка в секундах перед пропуском
    filterCount: 2,     // Количество сообщений, проверяемых фильтром
    maxNoSkipCount: 50, // Количество сообщений, после которых все галочки снимаются
    // Удалите знак комментария "//" перед нужными вам фильтрами
    // Фильтры задаются в виде регулярных выражений
    filter: [
        {
            name: "Нецензурная лексика",
            regexp: /(?<=(^|[^а-я]))((у|[нз]а|(хитро|не)?вз?[ыьъ]|с[ьъ]|(и|ра)[зс]ъ?|(о[тб]|под)[ьъ]?|(.\B)+?[оаеи])?-?([её]б(?!о[рй])|и[пб][ае][тц]).*?|(н[иеа]|([дп]|верт)о|ра[зс]|з?а|с(ме)?|о(т|дно)?|апч)?-?ху([яйиеёю]|ли(?!ган)).*?|(в[зы]|(три|два|четыре)жды|(н|сук)а)?-?бл(я(?!(х|ш[кн]|мб)[ауеыио]).*?|[еэ][дт]ь?)|(ра[сз]|[зн]а|[со]|вы?|п(ере|р[оие]|од)|и[зс]ъ?|[ао]т)?п[иеё]зд.*?|(за)?п[ие]д[аое]?р(ну.*?|[оа]м|(ас)?(и(ли)?[нщктл]ь?)?|(о(ч[еи])?|ас)?к(ой)|юг)[ауеы]?|манд([ауеыи](л(и[сзщ])?[ауеиы])?|ой|[ао]вошь?(е?к[ауе])?|юк(ов|[ауи])?)|муд([яаио].*?|е?н([ьюия]|ей))|мля([тд]ь)?|лять|([нз]а|по)х|м[ао]л[ао]фь([яию]|[еёо]й))(?=($|[^а-я]))/img
        },
        //{
        //    name: "Только строчные или прописные",
        //    regexp: /^[А-Я\s]+$|^[а-я\s]+$/gm
        //},
        //{
        //    name: "Предложения перейти в месседжеры",
        //    regexp: /.{0,10}(ватсап|вайбер|видеозвонок|скайп|телега).{0,20}/gmi
        //},
        //{
        //    name: "М/ж, ск лет...",
        //    regexp: /.{0,10}(м\/ж|ск.{0,11}лет|м или ж).{0,10}|^[А-Яа-я][?\d\s]{0,3}$|^.{0,3}(парень|девушка|пол|обмен|кто|ж\B|д\B|п\B).{0,1}$/gmi
        //},
        //{
        //    name: "Больше 1200 символов",
        //    regexp: /.{1200}/m
        //}
    ],
    debug: true,        // Отладочные сообщения в консоли
    lastAction: '#newDialog',
    lastPhrase: "",
    messagesCount: 0,
    messageLog: [],
    timerType: 0 // 0 - отключение по таймеру, 1 - отключение по фильтру
}

//------------------------------------//

// Вызывает callback(), если элемент el был удалён
function onRemove(el, callback) {
    new MutationObserver((mutations, observer) => {
        if (!document.body.contains(el)) {
            observer.disconnect();
            callback();
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Вспомогательная функиця для querySelectorNG
function querySelectorNG_Callback(query, callback) {
    let el = document.querySelector(query);

    if (el) {
        console.log("Element found:" + query)
        callback(el);
        //onRemove(el, () => querySelectorNG(query, callback))
    }

    return el;
}

// Выбирает первый элемент с селесктором query и вызывает для него callback
// Если элемент был удалён и создан заного - вызывает callback заного
// Если элемент ещё не создан - дожидается его создания
function querySelectorNG(query, callback) {
    let el = querySelectorNG_Callback(query, callback);
    if (!el)
        new MutationObserver((mutations, observer) => {
            if (querySelectorNG_Callback(query, callback))
                observer.disconnect();
        }).observe(document.body, {childList: true, subtree: true});
    return el;
}

// Срабатывает, каждый раз, когда появляется новый потомок у родительского элемента
function onChildAdd(element, query, callback) {
    new MutationObserver((mutations, observer) => {
        for (const {addedNodes} of mutations) {
            for (const node of addedNodes) {
                if (node.matches(query))
                    callback(node, observer);
            }
        }
    }).observe(element, {childList: true, subtree: true});
}

// Срабатывает, каждый раз, когда меняется видимость элемента
function onVisibilityChanged(el, callback) {
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            callback(el, entry.intersectionRatio > 0, observer);
        });
    }, {root: document.documentElement});

    observer.observe(el);
}

// Альтернатива onVisibilityChanged
function onVisibilityChangedNG(el, callback) {
    new MutationObserver(function (mutations, observer) {
        let visible = el.style.visibility !== "hidden" && el.style.visibility !== "hidden";
        callback(el, visible, observer);
    }).observe(el, {attributes: true});
}

// Срабатывает один раз, когда элемент становится видимым
function onVisible(el, callback) {
    onVisibilityChanged(el, (el, vis, obs) => {
        if (vis) {
            callback(el);
            obs.disconnect();
        }
    })
}

// Bootstrap Dropdown без JQuery
function initBsDropDown() {
    let dropdowns = document.querySelectorAll('[data-toggle=dropdown]');
    for (let dropdown of dropdowns) {
        dropdown.onclick = function (event) {
            let menu_div = dropdown.parentElement;
            if (menu_div.classList.contains("open"))
                return;

            event.stopPropagation();
            menu_div.classList.add("open");

            let menu_list = menu_div.querySelector(".dropdown-menu");
            document.addEventListener('click', function handler(event) {
                if (!menu_list.contains(event.target)) {
                    menu_div.classList.remove("open");
                    this.removeEventListener('click', handler);
                }
            })
        }
    }
}

// Создание полосы загрузки
function createProgressbar(element, duration, callback) {

    element.classList.add('progress');
    element.classList.add('progress-countdown');
    element.innerHTML = "";

    let progressbar_inner = document.createElement('div');
    progressbar_inner.className = 'progress-bar';

    progressbar_inner.style.animationDuration = duration;

    if (typeof (callback) === 'function') {
        progressbar_inner.addEventListener('animationend', callback);
    }

    element.appendChild(progressbar_inner);

    progressbar_inner.style.animationPlayState = 'running';
}

// Возвращает только текст из элемента
function getTextOnly(el) {
    let elClone = el.cloneNode(true);
    let images = elClone.querySelectorAll('img');
    for (let image of images)
        image.outerHTML = image.alt;
    elClone.innerHTML = elClone.innerHTML.replace("<div></div>", "\n");
    return elClone.textContent;
}


//------------------------------------//

function createDropdown() {
    let chat_btn = document.querySelector(".main_chat_but")
    chat_btn.insertAdjacentHTML("beforeend", `
<div class="btn-group">
<button type="button" data-toggle="dropdown" class="btn btn-md btn-my1">Начать новый <span class="caret"></span></button>
<ul class="dropdown-menu dropdown-menu-right">
<li><a id="newDialog" href="#">Новый диалог</a></li>
<li><a id="newDialogPhrase" href="#">С той же фразы</a></li>
<li><a id="newDialogSettings" href="#">Открыть настройки</a></li>

<li class="divider"></li>

<li class="checkbox">
<input id="autoDialog" type="checkbox" >
<label class="checkbox">
Автоматически
</label>
</li>

<li class="divider"></li>

<li class="checkbox">
<input id="skipNoAnswer" type="checkbox" >
<label class="checkbox">
Пропускать, если нет ответа <abbr id="skipDelay" title="Изменить значение можно в коде скрипта">1000</abbr> сек.
</label>
</li>

<li class="divider"></li>

<li class="checkbox">
<input id="skipFilter" type="checkbox">
<label class="checkbox">
Пропускать нежелательные сообщения 
<abbr title="Пропускает сообщения, в соответствии с заданными фильтрами
(например, содержащие нецезурную лексику). 
Отредактировать фильтры можно в коде скрипта.">(?)</abbr>
</label>
</li>

<li class="divider"></li>
<li><a id="saveCurrentDialog" href="#">Показать диалог</a></li>
<li><a id="saveAllDialog" href="#">Показать историю</a></li>
</ul>
</div>
`);

    initBsDropDown();

    readSettings();

    document.getElementById("autoDialog").onclick = function (ev) {
        options.autoDialog = ev.target.checked;
        readSettings();

        stopTimer(1);
    }

    document.getElementById("skipNoAnswer").onclick = function (ev) {
        options.skipNoAnswer = ev.target.checked;
        readSettings();

        stopTimer();
    }

    document.getElementById("skipFilter").onclick = function (ev) {
        options.skipFilter = ev.target.checked;
        readSettings();
    }

    document.getElementById("newDialog").onclick = newDialogClick;
    document.getElementById("newDialogPhrase").onclick = newDialogClick;
    document.getElementById("newDialogSettings").onclick = newDialogClick;
    document.getElementById("saveCurrentDialog").onclick = saveCurrentDialogClick;
    document.getElementById("saveAllDialog").onclick = saveCurrentDialogClick;

    let header_div = document.querySelector(".header_chat");
    let progress_div = document.createElement("div");
    progress_div.id = "progressbar_countdown";
    header_div.parentNode.insertBefore(progress_div, header_div.nextSibling);
}

function readSettings() {
    if (!options.autoDialog) {
        options.skipNoAnswer = false
        options.skipFilter = false;
    }

    let autoDialog = document.getElementById("autoDialog");
    autoDialog.checked = options.autoDialog;

    let skipNoAnswer = document.getElementById("skipNoAnswer");
    skipNoAnswer.checked = options.skipNoAnswer;
    skipNoAnswer.disabled = !options.autoDialog;

    let skipFilter = document.getElementById("skipFilter");
    skipFilter.checked = options.skipFilter;
    skipFilter.disabled = !options.autoDialog;

    document.getElementById("skipDelay").innerText = options.skipDelay;
}

//------------------------------------//

document.addEventListener("DOMContentLoaded", function(event) {
    checkContainer();
}, { once: true });


function checkContainer() {
    if (document.querySelector('.talk_over')) {
        nektoScript();
    } else {
        setTimeout(checkContainer, 50);
    }
}

// Обработчик нажатий на кнопки перехода к новому диалогу
function newDialogClick(ev) {
    if (ev) {
        ev.preventDefault();
        options.lastAction = ev.target.id;
    }

    // Проверка активности кнопки "Отключиться". Если на неё нельзя нажать, значит диалог уже завершён.
    let disconnect_btn = document.querySelector('.main_chat_but > button.btn');
    if (!disconnect_btn.classList.contains('disabled')) {
        // Нажатие на кнопку "Отключиться"
        disconnect_btn.click();
        // Подтверждение завершения диалога
        querySelectorNG('.swal2-confirm', (el) => el.click());
    } else
        newDialog(true);

    onVisible(document.querySelector('.talk_over_button'), () => newDialog(true));
}

// Обработчик нажатий на кнопки сохранения диалога в виде текста
function saveCurrentDialogClick(ev) {
    let tab = window.open('about:blank', '_blank');
    let content = getCurrentDialog();
    if (ev.target.id === 'saveAllDialog')
        content = [...options.messageLog, ...content];
    content = "<pre style='font-size: 1.2em;white-space: pre-wrap;'>" + content.join('\n') + "</pre>";
    tab.document.write(content);
    tab.document.close();
}

// Возвращает массив, состоящий из строк текущего диалога
function getCurrentDialog() {
    let messages = document.querySelectorAll('.mess_block');
    let content = [];
    for (let message of messages) {
        let txt_message = message.classList.contains('self') ? "Вы" : "Собеседник";
        let txt_time = getTextOnly(message.querySelector('.window_chat_dialog_time'));
        txt_message += " (" + txt_time + ")";
        txt_message += ": ";
        txt_message += getTextOnly(message.querySelector('.window_chat_dialog_text'));
        content.push(txt_message);
    }

    return content;
}


// Выполнеие действий, после отключения собеседника
// force - действие выполняется принудительно по кнопке
function newDialog(force = false) {
    stopTimer(1);

    let over_text = document.querySelector('.talk_over_text').textContent;
    let over_by_nekto = over_text.indexOf('Собеседник') !== -1;

    if (options.autoDialog && over_by_nekto || force) {

        if (options.lastAction === "newDialogPhrase") {
            let first_message = document.querySelector('.self .window_chat_dialog_text');
            if (first_message)
                options.lastPhrase = first_message.innerHTML;
        } else
            options.lastPhrase = "";

        // Запись диалога в историю
        let current_dialog = getCurrentDialog();
        options.messageLog.push(...current_dialog);
        options.messageLog.push("------------------");

        if (options.lastAction === "newDialogSettings")
            document.querySelector(".talk_over_button.blue_bg").click();
        else
            document.querySelector(".talk_over_button:not(.blue_bg)").click();
    }
}

// Запуск таймера. lv = 1 - таймер запускается из-за срабатывания фильтра
function startTimer(lv) {
    options.timerType = parseInt(lv) || 0;
    let progress_div = document.getElementById("progressbar_countdown");
    createProgressbar(progress_div, (lv ? 5 : options.skipDelay) + "s", () => newDialogClick());
}

// Остановка таймера
function stopTimer(lv) {
    lv = parseInt(lv) || 0;
    if (lv >= options.timerType) {
        document.getElementById("progressbar_countdown").innerHTML = "";
        options.timerType = 0;
    }

}

// Выполняется, при появлении нового сообщения в диалоге
function newMessage(el) {
    options.messagesCount++;

    if (options.messagesCount)
        stopTimer();

    // Отключить автоматический переход к новому диалогу, если сообщений больше maxNoSkipCount
    if (options.messagesCount > options.maxNoSkipCount) {
        options.autoDialog = false;
        readSettings();
    }

    // Фильтруем сообщения
    if (options.messagesCount <= options.filterCount) {
        let txt_msg = el.querySelector('.window_chat_dialog_text').innerText;
        for (let filter of options.filter)
            if (filter.regexp.test(txt_msg))
                startTimer(1);
    }
}

function nektoScript() {
    createDropdown();

    // Событие начала нового диалога, каждый раз, когда создаётся поле ввода текста
    // Происходит также и при измененении размеров окна!
    querySelectorNG('.emojionearea-editor', function editorCreate(el) {
        options.messagesCount = getCurrentDialog().length;

        // Обработка нового сообщения в диалоге
        onChildAdd(document.querySelector('.window_chat_block'), '.mess_block:not([style])', newMessage);

        // Отправка фразы, с которой начался предыдущий диалог
        if (options.lastAction === "newDialogPhrase" && options.messagesCount === 0) {

            el.innerHTML = options.lastPhrase;
            if (el.innerText.length) {
                options.messagesCount--; // Исправляем ситуацию, когда таймер не запускается
                document.querySelector('.sendMessageBtn').click();
            }
        }

        // Запуск таймера, если такая опция установлена
        if (options.skipNoAnswer && options.messagesCount < 1) {
            startTimer();
            // Запуск/остановка таймера при появлении сообщения "собеседник набирает сообщение"
            onVisibilityChangedNG(document.querySelector('.window_chat_dialog_write span'),
                (el, vis, obs) => {
                    // Остановить таймер, если есть хотя бы одно сообщение
                    if (options.messagesCount > 0) {
                        obs.disconnect();
                        return;
                    }

                    if (vis)
                        stopTimer();
                    else
                        startTimer();
                });

            // Остановка таймера, если я начинаю печатать
            el.addEventListener('input', () => stopTimer(1));
        }

        // Автоматическое выполнение действия, если собеседник отключился
        onVisible(document.querySelector('.talk_over_button'), () => newDialog());

        // Вызывать эту же функцию, после удаления и создания новго поля ввода
        onRemove(el, () => querySelectorNG('.emojionearea-editor', editorCreate));
    })
}