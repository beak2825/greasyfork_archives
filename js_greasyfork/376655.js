// ==UserScript==
// @name         BetterGoodGame
// @description  Улучшает ГГ, добавляя смайлы лягушек
// @author       Oocrop
// @include      /https\:\/\/goodgame\.ru\/channel\/Pooreshqa\/?/
// @include      /https\:\/\/goodgame\.ru\/chat\/155961\/?/
// @run-at       document-body
// @version      0.8.5.8
// @namespace https://greasyfork.org/users/239292
// @downloadURL https://update.greasyfork.org/scripts/376655/BetterGoodGame.user.js
// @updateURL https://update.greasyfork.org/scripts/376655/BetterGoodGame.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const everCookieBlockText = `function blyaNeRabotaetVseVotIChinu() {
        if (!window.Utils) {
            setTimeout(blyaNeRabotaetVseVotIChinu, 50);
        } else {
            try {
                window.Utils.rootScope().Reklama = {
                    reloadBrand: () => {
                        console.info("ага, попавсь, гг :)");
                    }
                }; // удаляем рекламу
                window.Reklama = {
                    reloadBrand: () => {
                        console.info("ага, попавсь, гг :)");
                    }
                }; // ещё раз удаляем рекламу
                window.Utils.ecid = () => {
                    console.info("какой эверкук? не знаем таких :)");
                }; // вот теперь удаляем еверкук
                window.Utils.prototype.ecid = () => {
                    console.info("какой эверкук? не знаем таких :)");
                }; // и ещё раз...
                window.yandex_metrika_callbacks = []; // я.метрика тоже хуй сосёт
            } catch (e) {
                console.warn(e.message); // предупреждение о том, что что-то поломалось
                setTimeout(blyaNeRabotaetVseVotIChinu, 50);
            }
        }
    }
    blyaNeRabotaetVseVotIChinu();
    
    window.everCookieBlock_loadFunction = () => {
        // блокировщик эверкуков, так как слежка нам не нужна
        const allScripts = document.getElementsByTagName("script"); // так же, это всё писал не я, а человек с ником DarkGL3, ссылка на код, написанный им: https://github.com/DarkGL3/evercookieBlockade/ (как же нынче пиздить сложно)
    
        for (
            var currentPosition = 0;
            currentPosition < allScripts.length;
            currentPosition++
        ) {
            if (allScripts[currentPosition].src.indexOf("evercookie") > -1) {
                allScripts[currentPosition].parentNode.removeChild(
                    allScripts[currentPosition]
                );
            }
        }
    
        window.swfobject = null;
    
        var swfObject = document.getElementById("swfcontainer");
    
        if (swfObject) {
            swfObject.parentNode.removeChild(swfObject);
        }
    
        var swfObjects = document.querySelectorAll('[data="evercookie.swf"]');
    
        for (var iPosition = 0; iPosition < swfObjects.length; iPosition++) {
            swfObjects[iPosition].parentNode.removeChild(swfObjects[iPosition]);
        }
    
        localStorage.setItem("ecid", -1); // охуенная хуйня которая не даст тебя отслеживать (наверное)
    
        window.Evercookie = options => {
            console.info("какой эверкук? не знаем таких :)"); // и ещё раз еверкук нахуй идёт
        };
        window.evercookie = options => {
            console.info("какой эверкук? не знаем таких :)"); // и снова...
        };
    
        window.yandex_metrika_callbacks = []; // ну и я.метрику ещё раз удалим
    };
    
    window.everCookieBlock = () => {
        if (window.attachEvent) {
            window.attachEvent("onload", everCookieBlock_loadFunction);
        } else {
            if (window.onload) {
                var curronload = window.onload;
                var newonload = function () {
                    curronload();
                    loadFunction();
                };
                window.onload = newonload;
            } else {
                window.onload = everCookieBlock_loadFunction;
            }
        }
    
        window.Evercookie = options => {
            console.info("какой эверкук? не знаем таких :)"); // и снова...
        };
    
        window.yandex_metrika_callbacks = []; // ну, по традиции уже, заблочил еверкук - заблочил и я.метрику
    
        window.bgg_blocked.push("evercookie"); // говорим, что еверкук заблочен
    };
    
    window.bgg_blocked = []; // список заблоченной хуеты
    window.bgg_failed_attempts = {}; // список неудачных попыток
    
    function udalitNahuiReklamu() {
        // очень важная функция, без которой весь bettergg не будет работать
        try {
            var failed = window.bgg_failed_to_block || undefined;
            window.bgg_failed_to_block = [];
            window.bgg_blocked.indexOf("evercookie") === -1
                ? window.everCookieBlock()
                : false; // вызов функции, блокирующей еверкук
            window.everCookieBlock_loadFunction(); // второй
            (failed === undefined
                ? true
                : failed.indexOf(".outer-wrap>.wrapper.clearfix")) &&
            $(".outer-wrap>.wrapper.clearfix").length >= 1
                ? window.bgg_blocked.indexOf(".outer-wrap>.wrapper.clearfix") === -1
                    ? $(".outer-wrap>.wrapper.clearfix").css(
                          "background-image",
                          ""
                      ) && window.bgg_blocked.push(".outer-wrap>.wrapper.clearfix")
                    : false
                : window.bgg_blocked.indexOf(".outer-wrap>.wrapper.clearfix") === -1
                ? window.bgg_failed_to_block.push(".outer-wrap>.wrapper.clearfix")
                : false; // это всё блокировка рекламы вот отсюда...
            (failed === undefined
                ? true
                : failed.indexOf(".adv-block, gg-ads-block")) &&
            $(".adv-block, gg-ads-block").length >= 1
                ? $(".adv-block, gg-ads-block").remove() &&
                  window.bgg_blocked.push(".adv-block, gg-ads-block")
                : window.bgg_blocked.indexOf(".adv-block, gg-ads-block") === -1
                ? window.bgg_failed_to_block.push(".adv-block, gg-ads-block")
                : false;
            (failed === undefined ? true : failed.indexOf(".banner-block.head")) &&
            $(".banner-block.head").length >= 1
                ? $(".banner-block.head").parent().remove() &&
                  window.bgg_blocked.push(".banner-block.head")
                : window.bgg_blocked.indexOf(".banner-block.head") === -1
                ? window.bgg_failed_to_block.push(".banner-block.head")
                : false; // вот до сюда
            if (
                failed === undefined ||
                (failed.indexOf("#userdata_el") != -1 &&
                    window.bgg_blocked.indexOf("#userdata_el") === -1 &&
                    (window.bgg_failed_attempts["#userdata_el"] < 10 ||
                        window.bgg_failed_attempts["#userdata_el"] === undefined))
            ) {
                // а вот это уже блокировка еверкука снова
                if ($("#userdata_el").length >= 1) {
                    window.bgg_blocked.push("#userdata_el");
                    $("#userdata_el").remove();
                } else {
                    window.bgg_failed_to_block.push("#userdata_el");
                    window.bgg_failed_attempts["#userdata_el"] = window
                        .bgg_failed_attempts["#userdata_el"]
                        ? window.bgg_failed_attempts["#userdata_el"] + 1
                        : 1;
                }
            }
            if (
                failed === undefined ||
                (failed.indexOf("#frameLoader") != -1 &&
                    window.bgg_blocked.indexOf("#frameLoader") === -1 &&
                    (window.bgg_failed_attempts["#frameLoader"] < 10 ||
                        window.bgg_failed_attempts["#frameLoader"] === undefined))
            ) {
                if ($("#frameLoader").length >= 1) {
                    window.bgg_blocked.push("#frameLoader");
                    $("#frameLoader").remove();
                } else {
                    window.bgg_failed_to_block.push("#frameLoader");
                    window.bgg_failed_attempts["#frameLoader"] = window
                        .bgg_failed_attempts["#frameLoader"]
                        ? window.bgg_failed_attempts["#frameLoader"] + 1
                        : 1;
                }
            } // конец блокировки еверкуков, проверяем, если что-то не заблочилось
            if (window.bgg_failed_to_block.length != 0) {
                throw new Error("что-то не заблочилось, перезапускаю");
            }
        } catch (e) {
            console.warn(e.message);
            setTimeout(udalitNahuiReklamu, 1000);
        }
    }
    udalitNahuiReklamu();`; // хуйня для обхода сэндбокса tampermonkey
    $("head").append(
        $(`<script id="bgg__everCookieBlock">${everCookieBlockText}</script>`)
    ); // на самом деле, это очень важная функция, поэтому я переношу это сюда, чтобы как можно быстрее избавиться от рекламы и трекеров

    const bggPochtiApiText = `const toggleTemplate = \`<label class="toggle"><input id="{{id}}" type="checkbox"/><span class="toggle-s"></span><span class="toggle-name">{{toggle_name}}</span></label>\`; // всякие темплейты
    const inputTemplate = \`<label class="bgg-input"><span class="input-name">{{name}}</span><input id="{{id}}" class="bgg-input-s" type="{{type}}"></label>\`;
    const notificationTemplate = \`<div id="{{id}}" class="bgg-notification"><div class="bgg-notification_notification-container"><div class="bgg-notification_title">{{title}}<a class="icon icon-close2" onclick="$(this).parent().parent().parent().remove();"></a></div><div class="bgg-notification_body">{{body}}</div></div></div>\`;
    const chatMessageTemplate = \`<div class="message-block"><div class="user ng-scope"><chat-user class="ng-isolate-scope"><a class="nick streamer">{{nick}}</a></chat-user></div><div class="message ng-isolate-scope">{{text}}</div></div>\`;
    const commands = {
        help: {
            builtin: true,
            description: "помощь по командам",
            usage: "/help [команда1 [команда2 [...]]]",
            callback: (args, e, _arg0) => {
                e.preventDefault();
                if (args.length === 0) {
                    var string = "Команды в чате: ";
                    var i = 0;
                    var le = 0;
                    for (var _ in commands) {
                        le++;
                    }
                    for (var obj in commands) {
                        string += \`/\${obj}\` + (i + 1 === le ? "" : " ");
                        i++;
                    }
                    sendInChat(string);
                } else {
                    var string = "";
                    for (var k = 0; k < args.length; k++) {
                        if (commands[args[k]] != undefined) {
                            string += \`/\${args[k]} - \${
                                commands[args[k]].description
                            }, использование - \${commands[args[k]].usage}\${
                                k + 1 === args.length ? "." : ";<br/>"
                            }\`;
                        } else {
                            string += \`/\${args[k]} - команда не существует\${
                                k + 1 === args.length ? "." : ";<br/>"
                            }\`;
                        }
                    }
                    sendInChat(string);
                }
                $(".text-block>.textarea").text("");
            }
        },
        shrug: {
            builtin: true,
            description: "¯\\\\\\\\_(ツ)_/¯",
            usage: "/shrug [текст]",
            callback: (args, e, _arg0) => {
                if (args.length > 0) {
                    const message = args.join(" ");
                    e.sendMessageAsUser(message + " ¯\\\\\\\\_(ツ)_/¯");
                } else {
                    e.sendMessageAsUser("¯\\\\\\\\_(ツ)_/¯");
                }
            }
        },
        banned: {
            builtin: true,
            description: "смейтесь над ними, насмехайтесь над ними",
            usage: "/banned",
            callback: (_args, e, _arg0) => {
                e.preventDefault();
                Chat.room()
                    .getBannedList()
                    .then(val => {
                        var string = "PepeLaugh 👉 ";
                        for (var k in val) {
                            string += \` \${val[k].nickname} \`;
                        }
                        sendInChat(string);
                    });
            }
        }
    };
    
    /**
     * Штука для быстрого создания тогглов/вводов
     * @param {"toggle"||"input"||"input_number"} type Тип ввода
     * @param {boolean||string||number} value Значение
     * @param {string} id ID
     * @param {string} name Имя
     * @param {function} onChange При изменении
     * @param {boolean} dependsOnLocalStorage Зависимость от localStorage
     */
    function createSettingField(
        type,
        value,
        id,
        name,
        onChange,
        dependsOnLocalStorage
    ) {
        switch (type) {
            case "toggle":
                var t = $(
                    toggleTemplate
                        .replace(/\\{\\{id\\}\\}/g, id)
                        .replace(/\\{\\{toggle_name\\}\\}/g, name)
                );
                t.on("change", onChange);
                t.find("input").prop("checked", value);
                if (!window.localStorage && dependsOnLocalStorage) {
                    t.find("input").prop("disabled", true);
                }
                return t;
                break;
            case "input":
                var i = $(
                    inputTemplate
                        .replace(/\\{\\{type\\}\\}/g, "text")
                        .replace(/\\{\\{id\\}\\}/g, id)
                        .replace(/\\{\\{name\\}\\}/g, name)
                );
                i.on("change", onChange);
                i.on("focusout", onChange);
                i.find("input").val(value);
                if (!window.localStorage && dependsOnLocalStorage) {
                    i.find("input").prop("disabled", true);
                }
                return i;
                break;
            case "input_number":
                var i = $(
                    inputTemplate
                        .replace(/\\{\\{type\\}\\}/g, "number")
                        .replace(/\\{\\{id\\}\\}/g, id)
                        .replace(/\\{\\{name\\}\\}/g, name)
                );
                i.on("change", onChange);
                i.on("focusout", onChange);
                i.find("input").val(value);
                if (!window.localStorage && dependsOnLocalStorage) {
                    i.find("input").prop("disabled", true);
                }
                return i;
                break;
        }
    }
    
    /**
     * Создание уведомлений, синие такие, слева снизу есть
     */
    function createNotification(body, title = "", _id = "") {
        if (!NiceScroll.getjQuery()("#bgg-notification-container").getNiceScroll) {
            // если нету красивого скроллбара, перезапускаем функцию
            setTimeout(() => {
                createNotification(body, title, _id);
            }, 500);
            return;
        }
        $("#bgg-notification-container").append(
            notificationTemplate
                .replace(/\\{\\{title\\}\\}/g, title)
                .replace(/\\{\\{body\\}\\}/g, body)
                .replace(/\\{\\{id\\}\\}/g, _id)
        ); // добавление уведомления
        NiceScroll.getjQuery()("#bgg-notification-container")
            .getNiceScroll()
            .resize(); // сказать скроллбару, что размер элемента изменился
    }
    
    /**
     * Сообщить, что для применения настроек нужна перезагрузка
     */
    function reloadRequired() {
        // сообщить, что нужна перезагрузка (настройки)
        $("#reload_req").length >= 1 ? $("#reload_req").remove() : false;
        createNotification(
            'Настройки сохранены, но для того, чтобы они вступили в силу, нужно перезагрузить страницу<br/><button class="bgg-button" onclick="location.reload()">Перезагрузить</button>',
            "Изменение настроек",
            "reload_req"
        );
    }
    
    /**
     * Евент листенер на новые сообщения в чате
     * P.S. - Оказался слишком быстрым, если нужно модифицировать элемент, то надо заворачивать код в setTimeout
     * @param {function} callback Функция без параметров
     */
    function bggOnMessage(callback) {
        Chat.on("update", callback);
    }
    
    /**
     * Вызов функции fetch, при завершении вызывает функцию cb с единственным параметром - json объектом
     * @param {string} url Ссылка
     * @param {function} cb Функция, вызываемая при завершении
     */
    function jsonFetch(url, cb) {
        fetch(url).then(data => {
            data.json().then(cb);
        });
    }
    
    /**
     * Отобразить сообщение в чате
     * @param {string} text Содержание сообщения
     * @param {string} from От кого оно
     */
    function sendInChat(text, from = undefined) {
        const element = $(
            chatMessageTemplate
                .replace(/\\{\\{nick\\}\\}/g, from ? from : "")
                .replace(/\\{\\{text\\}\\}/g, text)
        );
        if (from === undefined) {
            element[0].classList.add("system");
        }
        element.insertAfter(
            $(
                ".content-window>.tse-scrollable .tse-scroll-content .chat-section>.message-block:last"
            )
        );
        Chat.emit("update");
        $(".tse-scroll-content .chat-section")
            .parent()
            .parent()
            .parent()
            .animate(
                {
                    scrollTop: $(".tse-scroll-content .chat-section")
                        .parent()
                        .parent()
                        .parent()[0].scrollHeight
                },
                500
            );
    }
    
    /**
     * Создать команду для чата
     * @param {string} name Название команды
     * @param {string} desc Описание
     * @param {string} usage Использование
     * @param {commandCallback} callback Когда пользователь использует
     */
    function addCommand(name, desc, usage, callback, override) {
        if (commands[name]) {
            if (commands[name].builtin) {
                console.error(
                    \`Кто-то попытался перезаписать встроенную команду, вызываю пользователя.\\nПерезапись команды "\${name}", с \${commands[name].callback} на \${callback}\`
                );
                createNotification(
                    'Какой-то плагин попытался перезаписать встроенную команду для чата. Это может означать (но не обязательно), что в плагине есть вредоносный код. Если не затруднит - можно скинуть мне в дискорд ссылки на все установленные плагины: "╣╖╗╠╖└╬#4420"',
                    "Внимание!",
                    "cm-bi-warning"
                );
                $("#cm-bi-warning").css({ "background-color": "red" });
                return;
            } else {
                if (override) {
                } else {
                    createNotification(
                        \`Какой-то плагин попытался перезаписать команду \${name}. Будьте осторожны, так как неизвестно, что может делать перезаписанная функция.<br/><button class="bgg-button" onclick="$('#cm-or-warning').find('a').click()">Оставить</button><button class="bgg-button" style="background-color: red;" onclick="$('#cm-or-warning').find('a').click();commands['\${name}'] = { description: '\${desc}', usage: '\${usage}', callback: \${\`\${callback}\`.replace(
                            /\\\\"/g,
                            "'"
                        )} };">Перезаписать</button>\`,
                        "Перезаписать команду",
                        "cm-or-warning"
                    );
                    return;
                }
            }
        }
        commands[name] = { description: desc, usage: usage, callback: callback };
    }
    
    /**
     * Колбек использования команды
     * @callback commandCallback
     * @param {string[]} args Аргументы, передающиеся команде
     * @param {Event} event Евент нажатия ентера, превент автоматически не производится
     * @param {Object} arg0 Объект данной команды
     */`;

    $("head").append(
        $(`<script id="bgg__chto-to-tipa-api">${bggPochtiApiText}</script>`)
    );

    const twitchEmoteURLTemplate = "https://static-cdn.jtvnw.net/emoticons/v1/"; // темплейт для смайлов твича и бттв
    const bttvEmoteURL = "https://cdn.betterttv.net/emote/";

    const defaultColors = [
        // твичовские цвета ника
        "ff0000",
        "0000ff",
        "008000",
        "b22222",
        "ff7f50",
        "9acd32",
        "ff4500",
        "2e8b57",
        "daa520",
        "d2691e",
        "5f9ea0",
        "1e90ff",
        "ff69b4",
        "8a2be2",
        "00ff7f"
    ];

    const settingsCategoryTemplate = `<div id="{{id}}" class="settings-block"><div class="title">{{name}}</div></div>`;
    const emoteMenuEmoteTemplate = `<div onclick='$(".chat-control-block>.text-block.ng-scope>.textarea").text($(".chat-control-block>.text-block.ng-scope>.textarea").text() + ($(".chat-control-block>.text-block.ng-scope>.textarea").text()?" ":"") + "{{code}} ")' class="bgg-emote-click smile-block"><img style="width:auto;height:36px;padding:2px;" src="{{image}}" title="{{code}}" class="bgg-emote smile"></div>`; // меню смайлов, часть первая
    const emoteMenuContainerTemplate = `<div id="bgg-{{name-raw}}"><div class="streamer-name">{{name}}</div></div>`;

    const css = `@import url('https://fonts.googleapis.com/css?family=Roboto&subset=cyrillic');.chat-control-block > .text-block > .icon-smilemenu-icon::before{display:none}.chat-control-block > .text-block > .icon-smilemenu-icon{width:40px;height:40px;font-family:"Segoe UI Emoji" !important;font-size:25px !important;filter: grayscale(100%);transition:all 250ms;text-align:center !important}.chat-control-block > .text-block > .icon-smilemenu-icon.bgg-pseudohover,.chat-control-block > .text-block > .icon-smilemenu-icon:hover{filter: grayscale(0%)}.chat-control-block > .text-block > .icon-smilemenu-icon > .bgg-emote_menu_emoji-trigger{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.emoji.bgg-emote_menu_emoji{font-family:"Segoe UI Emoji";font-size:25px}.bgg-emote-search{position:fixed;padding:10px;width:calc(100% - 40px);top:60px;display:flex !important;align-items:center;flex-direction:column;z-index:1;background:#52709c}#smiles .tse-content{margin-top:70px}.logo::before{content:"BETTER";color:#FFF;font-family:"Roboto";position:absolute;top:0;font-weight:1000;transform:rotateZ(-2.5deg);left:10px}a.nick > .icon.icon-ios::before{font-family:"Segoe UI Emoji" !important;content:"💩"}#bgg-settings.visible{display:inline}#bgg-settings > .tse-scroll-content > .tse-content{width:330px !important;height:90%}.settings-block{padding:5px}.settings-block > *{margin-bottom:5px}#bgg-settings-controls{margin-top:10px;padding:5px;display:flex;justify-content:space-between}.toggle{width:100%;cursor:pointer;display:inline-block}.toggle > input{display:block;opacity:0;position:absolute;width:60px;height:21px;z-index:1;cursor:pointer}.toggle > .toggle-s{width:60px;height:21px;margin-right:10px;background-color:#fff;border-radius:5px;transition:all 0.5s;float:left}.toggle > .toggle-s::before{content:"";position:absolute;width:19px;height:19px;background:#afafaf;border-radius:5px;transform:translate(5px, 1px);transition:all 0.5s}.toggle > input:disabled+.toggle-s{filter: brightness(30%)}.toggle > input:hover+.toggle-s::before{transform:translate(15px, 1px)}.toggle > input:hover+.toggle-s{background-color:#888}.toggle > input:checked+.toggle-s{background-color:#73adff}.toggle > input:checked+.toggle-s::before{transform:translate(36px, 1px)}.toggle > .toggle-name{display:inline}.toggle > *{display:inline-block}button.bgg-button{background-color:#4f98ff;border-radius:2px;color:#fff;min-width:25px;max-height:60px;font-family:"Roboto";font-size:17px;text-align:center;border:none;padding:3px;transition:all 0.05s linear;user-select:none;-moz-user-select:none}button.bgg-button:hover{filter: brightness(95%)}button.bgg-button:disabled{filter: brightness(30%) !important}.bgg-input{display:block}.bgg-input-s:disabled{box-shadow:none !important;background:#0d1221 !important;filter: brightness(30%)}.bgg-input > .description{font-size:11px}.bgg-tw-color{margin:1.5px;width:36px;height:31px;border-radius:5px;display:inline-block}input.bgg-input-s{max-width:200px;display:block;margin-right:10px}.bgg-input > span{display:block}.streamer-badge{background:linear-gradient(#e71818, #e71818);mask-image:url("https://cdn.frankerfacez.com/badges/twitch/broadcaster.svg");mask-size:16px 16px;width:16px;height:16px;float:left;margin-top:5px}.moder-badge{background:linear-gradient(#34ae0a, #34ae0a);mask-image:url("https://cdn.frankerfacez.com/badges/twitch/moderator.svg");mask-size:16px 16px;width:16px;height:16px;float:left;margin-top:5px}.control.settings > .settings-popup{width:180px !important}#bgg-notification-container{position:absolute;left:0;width:450px;min-height:80px;max-height:500px;bottom:0}.bgg-notification{width:440px;min-height:75px;margin-bottom:5px;margin-left:5px;background-color:#73adff;font-family:"Roboto" !important;border-radius:20px}.bgg-notification > .bgg-notification_notification-container{margin-left:10px;max-width:420px;padding-top:5px;padding-bottom:7px}.bgg-notification > .bgg-notification_notification-container > .bgg-notification_title{font-size:25px;min-height:5px}.bgg-notification > .bgg-notification_notification-container > .bgg-notification_title > a.icon-close2{color:white;font-size:16px;right:15px;transform:translateY(10px);position:absolute;z-index:1;cursor:pointer}.bgg-notification > .bgg-notification_notification-container > .bgg-notification_title > a.icon-close2:hover{background-color:hsla(0, 0%, 100%, .05);color:#4f98ff}.bgg-los-unav{background:red;height:auto;max-width:90%;border-radius:5px;margin-top:5px;margin-bottom:5px;padding:5px;user-select:none;-moz-user-select:none;font-family:"Roboto";font-size:16px}.ls-ua-title{font-size:20px;display:block}.ls-ua-content{display:block}.ls-ua-learnmore{display:block;margin-top:5px}.message-block.system{opacity:0.5}.message-block.system > .user{display:none}`; // наводим красоту
    const popupCss = `body #bgg-notification-container{position:absolute;width:100%;min-height:60px;max-height:240px;top:5px;display:flex;flex-direction:column;align-items:center}body .bgg-notification{width:90%;min-height:55px;margin-bottom:5px;background-color:#73adff;font-family:"Roboto" !important;border-radius:5px}body .bgg-notification > .bgg-notification_notification-container{margin-left:10px;width:100%;padding-top:5px;padding-bottom:7px}body .bgg-notification > .bgg-notification_notification-container > .bgg-notification_title{font-size:22px;min-height:5px}body .bgg-notification > .bgg-notification_notification-container > .bgg-notification_title > a.icon-close2{color:white;font-size:18px;right:45px;transform:translateY(5px);position:absolute;z-index:1;cursor:pointer}`;
    const chatFontCssTemplate = `<style id="bgg-chat-font">.chat>.chat-container>.content-window{font-family:{{family}},-apple-system,Open Sans,sans-serif; font-size:{{size}};}</style>`;
    const emotes = []; // массив со смайлами
    const bttvChannelEmotesContainerTemplate = emoteMenuContainerTemplate
        .replace(/\{\{name\}\}/g, "Olesha's BetterTTV Emotes")
        .replace(/\{\{name-raw\}\}/g, "bttv-channel"); // меню смайлов, часть вторая
    const bttvGlobalEmotesContainerTemplate = emoteMenuContainerTemplate
        .replace(/\{\{name\}\}/g, "BetterTTV Global Emotes")
        .replace(/\{\{name-raw\}\}/g, "bttv-global");
    const ffzChannelEmotesContainerTemplate = emoteMenuContainerTemplate
        .replace(/\{\{name\}\}/g, "Olesha's FrankerFaceZ Emotes")
        .replace(/\{\{name-raw\}\}/g, "ffz-channel");
    const ffzGlobalEmotesContainerTemplate = emoteMenuContainerTemplate
        .replace(/\{\{name\}\}/g, "FrankerFaceZ Global Emotes")
        .replace(/\{\{name-raw\}\}/g, "ffz-global");
    const twitchEmotesContainerTemplate = emoteMenuContainerTemplate
        .replace(/\{\{name\}\}/g, "Twitch Global Emotes")
        .replace(/\{\{name-raw\}\}/g, "twitch-global");
    let bttvGlobalEmotesContainer;
    let bttvChannelEmotesContainer;
    let ffzChannelEmotesContainer;
    let ffzGlobalEmotesContainer;
    let twitchEmotesContainer;
    window._bgg_loaded_ = false;
    RegExp.escape = function (s) {
        return String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
    };

    const emojiButtonList = [
        "😀",
        "😁",
        "😂",
        "🤣",
        "😃",
        "😄",
        "😅",
        "😆",
        "😉",
        "😊",
        "😋",
        "😎",
        "😍",
        "😘",
        "😗",
        "😙",
        "😚",
        "☺",
        "🙂",
        "🤗",
        "🤔",
        "😐",
        "😑",
        "😶",
        "🙄",
        "😏",
        "😣",
        "😥",
        "😮",
        "🤐",
        "😯",
        "😪",
        "😫",
        "😴",
        "😌",
        "😛",
        "😜",
        "😝",
        "🤤",
        "😒",
        "😓",
        "😔",
        "😕",
        "🙃",
        "🤑",
        "😲",
        "☹",
        "🙁",
        "😖",
        "😞",
        "😟",
        "😤",
        "😢",
        "😭",
        "😦",
        "😧",
        "😨",
        "😩",
        "😬",
        "😰",
        "😱",
        "😳",
        "😵",
        "😡",
        "😠",
        "😷",
        "🤒",
        "🤕",
        "🤢",
        "🤧",
        "😇",
        "🤠",
        "🤡",
        "🤥",
        "🤓",
        "😈",
        "👿",
        "👹",
        "👺",
        "💀",
        "👻",
        "👽",
        "🤖",
        "💩",
        "😺",
        "😸",
        "😹",
        "😻",
        "😼",
        "😽",
        "🙀",
        "😿",
        "😾",
        "👶",
        "👦",
        "👧",
        "👨",
        "👩",
        "👴",
        "👵",
        "👨‍⚕️",
        "👩‍⚕️",
        "👨‍🎓",
        "👩‍🎓",
        "👨‍⚖️",
        "👩‍⚖️",
        "👨‍🌾",
        "👩‍🌾",
        "👨‍🍳",
        "👩‍🍳",
        "👨‍🔧",
        "👩‍🔧",
        "👨‍🏭",
        "👩‍🏭",
        "👨‍💼",
        "👩‍💼",
        "👨‍🔬",
        "👩‍🔬",
        "👨‍💻",
        "👩‍💻",
        "👨‍🎤",
        "👩‍🎤",
        "👨‍🎨",
        "👩‍🎨",
        "👨‍✈️",
        "👩‍✈️",
        "👨‍🚀",
        "👩‍🚀",
        "👨‍🚒",
        "👩‍🚒",
        "👮",
        "👮‍♂️",
        "👮‍♀️",
        "🕵",
        "🕵️‍♂️",
        "🕵️‍♀️",
        "💂",
        "💂‍♂️",
        "💂‍♀️",
        "👷",
        "👷‍♂️",
        "👷‍♀️",
        "🤴",
        "👸",
        "👳",
        "👳‍♂️",
        "👳‍♀️",
        "👲",
        "👱",
        "👱‍♂️",
        "👱‍♀️",
        "🤵",
        "👰",
        "🤰",
        "👼",
        "🎅",
        "🤶",
        "🙍",
        "🙍‍♂️",
        "🙍‍♀️",
        "🙎",
        "🙎‍♂️",
        "🙎‍♀️",
        "🙅",
        "🙅‍♂️",
        "🙅‍♀️",
        "🙆",
        "🙆‍♂️",
        "🙆‍♀️",
        "💁",
        "💁‍♂️",
        "💁‍♀️",
        "🙋",
        "🙋‍♂️",
        "🙋‍♀️",
        "🙇",
        "🙇‍♂️",
        "🙇‍♀️",
        "🤦",
        "🤦‍♂️",
        "🤦‍♀️",
        "🤷",
        "🤷‍♂️",
        "🤷‍♀️",
        "💆",
        "💆‍♂️",
        "💆‍♀️",
        "💇",
        "💇‍♂️",
        "💇‍♀️",
        "🚶",
        "🚶‍♂️",
        "🚶‍♀️",
        "🏃",
        "🏃‍♂️",
        "🏃‍♀️",
        "💃",
        "🕺",
        "👯",
        "👯‍♂️",
        "👯‍♀️",
        "🕴",
        "🗣",
        "👤",
        "👥",
        "👫",
        "👬",
        "👭",
        "💏",
        "👨‍❤️‍💋‍👨",
        "👩‍❤️‍💋‍👩",
        "💑",
        "👨‍❤️‍👨",
        "👩‍❤️‍👩",
        "👪",
        "👨‍👩‍👦",
        "👨‍👩‍👧",
        "👨‍👩‍👧‍👦",
        "👨‍👩‍👦‍👦",
        "👨‍👩‍👧‍👧",
        "👨‍👨‍👦",
        "👨‍👨‍👧",
        "👨‍👨‍👧‍👦",
        "👨‍👨‍👦‍👦",
        "👨‍👨‍👧‍👧",
        "👩‍👩‍👦",
        "👩‍👩‍👧",
        "👩‍👩‍👧‍👦",
        "👩‍👩‍👦‍👦",
        "👩‍👩‍👧‍👧",
        "👨‍👦",
        "👨‍👦‍👦",
        "👨‍👧",
        "👨‍👧‍👦",
        "👨‍👧‍👧",
        "👩‍👦",
        "👩‍👦‍👦",
        "👩‍👧",
        "👩‍👧‍👦",
        "👩‍👧‍👧",
        "🤳",
        "💪",
        "👈",
        "👉",
        "☝",
        "👆",
        "🖕",
        "👇",
        "✌",
        "🤞",
        "🖖",
        "🤘",
        "🖐",
        "✋",
        "👌",
        "👍",
        "👎",
        "✊",
        "👊",
        "🤛",
        "🤜",
        "🤚",
        "👋",
        "✍",
        "👏",
        "👐",
        "🙌",
        "🙏",
        "🤝",
        "💅",
        "👂",
        "👃",
        "👣",
        "👀",
        "👁",
        "👅",
        "👄",
        "💋",
        "👓",
        "🕶",
        "👔",
        "👕",
        "👖",
        "👗",
        "👘",
        "👙",
        "👚",
        "👛",
        "👜",
        "👝",
        "🎒",
        "👞",
        "👟",
        "👠",
        "👡",
        "👢",
        "👑",
        "👒",
        "🎩",
        "🎓",
        "⛑",
        "💄",
        "💍",
        "🌂",
        "☂",
        "💼"
    ];

    const listener = {
        // небольшой недолистенер, так как я ничего лучше не придумал FeelsTastyMan
        reportReady: () => {
            listener.part = listener.part + 1;
            if (listener.part === 6) {
                listener.reportDone();
            }
        },
        reportDone: () => {
            listener.status = "DONE";
            listener.callback();
        },
        part: 0,
        status: ""
    };

    const emoteMenuSelector = "gg-smiles2>.smile-list"; // селектор списка смайлов

    $("head").append(
        $(`<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>`)
    ); // добавление jquery
    $("head").append(
        $(
            `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.nicescroll/3.7.6/jquery.nicescroll.min.js"></script>`
        )
    ); // скрипт на охуенный скроллбар 😎
    $("head").append(
        $(
            `<script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" crossorigin="anonymous"></script>`
        )
    ); // 👈😍🙂
    $("head").append($(`<style id="bgg_css">${css}</style>`)); // большой CSS

    let firstRun, settings, popupMode;

    if (window.localStorage) {
        // если доступен локалстораж
        const rawSettings = localStorage.getItem("bggsettings"); // получаем настройки, или делаем их
        if (rawSettings === null) {
            // если настроек нету, создаём
            settings = {
                gif: true,
                font: null,
                font_size: "14px",
                smiles_onload: true,
                color: "random"
            };
            firstRun = true;
            localStorage.setItem("bggsettings", JSON.stringify(settings));
        } else {
            settings = JSON.parse(rawSettings);
        }
    }

    if (location.href.match(/https\:\/\/goodgame\.ru\/chat\/155961\/?/)) {
        popupMode = true;
    }
    if (popupMode) {
        $("head").append($(`<style id="bgg_css">${popupCss}</style>`)); // исправления css для чата в окне
    }

    function saveSettings() {
        // сохранение настроек
        $("#settings_save").length >= 1 ? $("#settings_save").remove() : false;
        $("#bgg-chat-font").length >= 1 ? $("#bgg-chat-font").remove() : false;
        localStorage.setItem("bggsettings", JSON.stringify(settings));
        $("head").append(
            $(
                chatFontCssTemplate
                    .replace(
                        /{{family}}/g,
                        settings.font === null ? "undefined" : settings.font
                    )
                    .replace(/{{size}}/g, settings.font_size)
            )
        );
        createNotification(
            "Сохранено в лучшем виде!",
            "Настройки сохранены!",
            "settings_save"
        );
        setTimeout(() => {
            $("#settings_save").length >= 1
                ? $("#settings_save").remove()
                : false;
        }, 5000);
    }

    function randInt(min, max) {
        // random
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randColor = defaultColors[randInt(0, defaultColors.length - 1)]; // рандомный цвет для чата

    const invNums = {
        0: "​",
        1: "‌",
        2: "‍",
        3: "‎",
        4: "‏",
        5: "⁠",
        6: "⁡",
        7: "⁢",
        8: "‬",
        9: "‪",
        a: "⁥",
        b: "⁦",
        c: "⁨",
        d: "⁮",
        e: "⁤",
        f: "⁣"
    };

    function hexToInv(hex) {
        // HEX в Binary в невидимый (для цветных ников)
        var result = hex;
        for (var k in invNums) {
            result = result.replace(new RegExp(k, "g"), invNums[k]);
        }
        return result;
    }

    function invToHex(inv) {
        // невидимый в HEX (для расшифровки цветных ников)
        var result = inv;
        for (var k in invNums) {
            result = result.replace(new RegExp(invNums[k], "g"), k);
        }
        return result;
    }

    function smilesLoad() {
        // загрузка смайлов
        jsonFetch(
            "https://api.betterttv.net/3/cached/users/twitch/53815140",
            emotedata => {
                // всякие реквесты, чтобы получить смайлы; меню смайлов, часть вторая с половиной
                bttvChannelEmotesContainer = $(
                    bttvChannelEmotesContainerTemplate
                );
                emotedata = emotedata.sharedEmotes;
                for (var i = 0; i < emotedata.length; i++) {
                    emotes.push({
                        code: emotedata[i].code,
                        image: `${bttvEmoteURL}${emotedata[i].id}/2x`,
                        gif: emotedata[i].imageType === "gif"
                    });
                    if (emotedata[i].imageType === "gif" && settings.gif) {
                        bttvChannelEmotesContainer.append(
                            $(
                                emoteMenuEmoteTemplate
                                    .replace(/{{code}}/g, emotedata[i].code)
                                    .replace(
                                        /{{image}}/g,
                                        `${bttvEmoteURL}${emotedata[i].id}/2x`
                                    )
                            )
                        );
                    }
                }
                listener.reportReady();
            }
        );
        jsonFetch(
            "https://api.betterttv.net/3/cached/emotes/global",
            emotedata => {
                bttvGlobalEmotesContainer = $(
                    bttvGlobalEmotesContainerTemplate
                );
                for (var i = 0; i < emotedata.length; i++) {
                    emotes.push({
                        code: emotedata[i].code,
                        image: `${bttvEmoteURL}${emotedata[i].id}/2x`,
                        gif: emotedata[i].imageType === "gif"
                    });
                    if (emotedata[i].imageType === "gif" && settings.gif) {
                        bttvGlobalEmotesContainer.append(
                            $(
                                emoteMenuEmoteTemplate
                                    .replace(/{{code}}/g, emotedata[i].code)
                                    .replace(
                                        /{{image}}/g,
                                        `${bttvEmoteURL}${emotedata[i].id}/2x`
                                    )
                            )
                        );
                    }
                }
                listener.reportReady("ready");
            }
        );
        jsonFetch(
            "https://cors-anywhere.herokuapp.com/https://api.frankerfacez.com/v1/set/global",
            emotedata => {
                ffzGlobalEmotesContainer = $(ffzGlobalEmotesContainerTemplate);
                var emotedata =
                    emotedata.sets[emotedata.default_sets[0]].emoticons;
                for (var i = 0; i < emotedata.length; i++) {
                    emotes.push({
                        code: emotedata[i].name,
                        image: emotedata[i].urls[2]
                            ? emotedata[i].urls[2]
                            : emotedata[i].urls[1]
                    });
                    ffzGlobalEmotesContainer.append(
                        $(
                            emoteMenuEmoteTemplate
                                .replace(/{{code}}/g, emotedata[i].name)
                                .replace(
                                    /{{image}}/g,
                                    emotedata[i].urls[2]
                                        ? emotedata[i].urls[2]
                                        : emotedata[i].urls[1]
                                )
                        )
                    );
                }
                listener.reportReady("ready");
            }
        );
        jsonFetch(
            "https://cors-anywhere.herokuapp.com/https://api.frankerfacez.com/v1/room/olesha",
            emotedata => {
                ffzChannelEmotesContainer = $(
                    ffzChannelEmotesContainerTemplate
                );
                var emotedata = emotedata.sets[emotedata.room.set].emoticons;
                for (var i = 0; i < emotedata.length; i++) {
                    emotes.push({
                        code: emotedata[i].name,
                        image: emotedata[i].urls[2]
                            ? emotedata[i].urls[2]
                            : emotedata[i].urls[1]
                    });
                    ffzChannelEmotesContainer.append(
                        $(
                            emoteMenuEmoteTemplate
                                .replace(/{{code}}/g, emotedata[i].name)
                                .replace(
                                    /{{image}}/g,
                                    emotedata[i].urls[2]
                                        ? emotedata[i].urls[2]
                                        : emotedata[i].urls[1]
                                )
                        )
                    );
                }
                listener.reportReady("ready");
            }
        );
        jsonFetch(
            "https://api.twitchemotes.com/api/v4/channels/0",
            emotedata => {
                twitchEmotesContainer = $(twitchEmotesContainerTemplate);
                emotedata = emotedata.emotes;
                for (var i = 0; i < emotedata.length; i++) {
                    emotes.push({
                        code: emotedata[i].code,
                        image: `${twitchEmoteURLTemplate}${emotedata[i].id}/2.0`
                    });
                    twitchEmotesContainer.append(
                        $(
                            emoteMenuEmoteTemplate
                                .replace(/{{code}}/g, emotedata[i].code)
                                .replace(
                                    /{{image}}/g,
                                    `${twitchEmoteURLTemplate}${emotedata[i].id}/2.0`
                                )
                        )
                    );
                }
                listener.reportReady("ready");
            }
        );
    }

    if (!settings.smiles_onload) {
        smilesLoad();
    }

    const chatLoadInterval = setInterval(() => {
        if ($("div.chat-section.ng-scope>.message-block>.message").length > 1) {
            // проверка, прогрузился ли чат (раньше тут стояла проверка по кнопке с выпадающем меню настроек, но это оказалось неэффективно, сейчас стоит проверка по сообщениям), должно быть больше одного, так как одно "сообщение" - проверка в настройке чата
            listener.reportReady("ready");
            clearInterval(chatLoadInterval);
        }
    }, 200);

    window.addEventListener("load", () => {
        // когда окно загрузилось
        if (window._bgg_loaded_) {
            // защита от двойного запуска
            return;
        }
        window._bgg_loaded_ = true;
        if (!window.localStorage || settings.smiles_onload) {
            smilesLoad();
        }
        function notificationInit() {
            // охуенный скроллбар 😎
            try {
                NiceScroll.getjQuery()(
                    "#bgg-notification-container"
                ).niceScroll({
                    cursorcolor: "#343c54",
                    cursorwidth: "6px",
                    cursorborder: "none",
                    cursorborderradius: "6px",
                    hwacceleration: true,
                    boxzoom: false,
                    autohidemode: "scroll",
                    cursorminheight: 10,
                    disableoutline: true,
                    horizrailenabled: false,
                    railalign: "left"
                });
            } catch (e) {
                console.info(e);
                setTimeout(() => {
                    notificationInit();
                }, 500);
            }
        }
        listener.callback = () => {
            // когда загрузился чат
            console.info("BGG готов, запускаем...");
            udalitNahuiReklamu(); // удаляем нахуй рекламу
            $("head").append(
                $(
                    chatFontCssTemplate
                        .replace(
                            /{{family}}/g,
                            settings.font === null ? "undefined" : settings.font
                        )
                        .replace(/{{size}}/g, settings.font_size)
                )
            ); // шрифт в чате
            $("body").append($(`<div id="bgg-notification-container"></div>`)); // создание контейнера для уведомлений BGG
            notificationInit();
            if (firstRun) {
                createNotification(
                    'Вы можете настроить BGG под себя: загружать смайлы после загрузки страницы; изменять шрифт и его размер; отключать гиф-смайлы.<br/>Для этого, откройте выпадающее меню над полем ввода сообщения и выберите в нём "Настройки BGG".<br/>Приятного кидания смайликов лягушек в чат!',
                    "Похоже, это ваш первый запуск BetterGG"
                );
            } // при первом запуске BGG
            if (!window.localStorage) {
                createNotification(
                    'Ваш браузер не поддерживает localstorage, или он отключён, для сохранения настроек нужно будет его включить, либо пересесть на норм браузер</br><button class="bgg-button" onclick="window.open(\'https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage\');">Узнать больше</button>',
                    "Внимание!"
                );
            } // если недоступен localStorage
            $(".chat-control-block>.text-block>.icon-smilemenu-icon").append(
                $(`<span class="bgg-emote_menu_emoji-trigger"></span>`)
            ); // меняющийся смайл на кнопке меню смайлов
            $(
                ".chat-control-block>.text-block>.icon-smilemenu-icon>.bgg-emote_menu_emoji-trigger"
            ).text("😀");
            $(".chat-control-block>.text-block>.icon-smilemenu-icon").on(
                "mouseenter",
                () => {
                    $(
                        ".chat-control-block>.text-block>.icon-smilemenu-icon>.bgg-emote_menu_emoji-trigger"
                    ).text(
                        emojiButtonList[randInt(0, emojiButtonList.length - 1)]
                    );
                }
            );
            $(".chat-control-block>.text-block>.icon-smilemenu-icon").on(
                "click",
                () => {
                    setTimeout(() => {
                        if ($("gg-popup#smiles").css("display") !== "none") {
                            $(
                                ".chat-control-block>.text-block>.icon-smilemenu-icon"
                            )[0].classList.add("bgg-pseudohover");
                        } else {
                            $(
                                ".chat-control-block>.text-block>.icon-smilemenu-icon"
                            )[0].classList.remove("bgg-pseudohover");
                        }
                    }, 200);
                }
            );
            const bggSettingsPopup = $(
                `<gg-popup id="bgg-settings" class="popup-block scrollable bgg-settings ng-scope tse-scrollable"><div class="tse-scrollbar"><div class="drag-handle"></div></div><div class="tse-scroll-content"><div class="tse-content"><ng-transclude><div id="bgg-settings-content" class="ng-scope"><div class="title-block"><div class="title">Настройки BetterGG</div><div class="control-block"><a href="#" class="icon icon-close2"></a></div></div></div></ng-transclude></div></div></gg-popup>`
            ); // окно настроек
            $(".control.settings>.settings-popup").append(
                $(
                    `<a title="🐸" id="bgg-settings-button" href="#" class="element"><span class="icon">🛠</span>Настройки BetterGG</a>`
                )
            ); // кнопка открытия настроек
            $(".chat>.chat-container>.popup-wrap").append(bggSettingsPopup);
            $("#bgg-settings-button").on("click", () => {
                $("#bgg-settings")[0].classList.add("visible");
            });
            $("#bgg-settings-content>.title-block>.control-block>a").on(
                "click",
                () => {
                    $("#bgg-settings")[0].classList.remove("visible");
                }
            );
            setTimeout(() => {
                // настройки
                $("#bgg-settings-content").append(
                    $(
                        `<div id="bgg-settings-controls"><button class="bgg-button" id="bggs-save-button">Сохранить</button><button class="bgg-button" id="bggs-reset-button">По умолчанию</button></div>`
                    )
                );
                $("#bggs-save-button").on("click", () => {
                    settings.color = $("#color_input").val();
                    saveSettings();
                });
                $("#bggs-reset-button").on("click", () => {
                    localStorage.removeItem("bggsettings");
                    reloadRequired();
                });
                if (!window.localStorage) {
                    $("#bggs-reset-button").prop("disabled", true);
                    $("#bggs-save-button").prop("disabled", true);
                    $(
                        `<div class="bgg-los-unav"><span class="ls-ua-title">Внимание!</span><span class="ls-ua-content">Ваш браузер не поддерживает localStorage, а значит настройки BGG не будут сохраняться</span><button class="bgg-button ls-ua-learnmore" onclick="window.open('https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage')">Узнать больше</button></div>`
                    ).insertBefore("#bgg-settings-controls");
                }
                const bggChatSettingsCategory = $(
                    settingsCategoryTemplate
                        .replace(/\{\{id\}\}/g, "bgg-chat-settings")
                        .replace(/\{\{name\}\}/g, "Настройки чата")
                );
                bggChatSettingsCategory.insertBefore(
                    $("#bgg-settings-controls")
                );
                const bggFunctionalSettingsCategory = $(
                    settingsCategoryTemplate
                        .replace(/\{\{id\}\}/g, "bgg-func-settings")
                        .replace(/\{\{name\}\}/g, "Настройки функциональности")
                );
                bggFunctionalSettingsCategory.insertBefore(
                    $("#bgg-settings-controls")
                );
                bggFunctionalSettingsCategory.append(
                    createSettingField(
                        "toggle",
                        settings.smiles_onload ? true : false,
                        "smile_load",
                        "Загрузка смайлов после загрузки страницы",
                        event => {
                            settings.smiles_onload = $(event.target).prop(
                                "checked"
                            );
                            saveSettings();
                        }
                    )
                );
                bggChatSettingsCategory.append(
                    createSettingField(
                        "toggle",
                        settings.gif ? true : false,
                        "gif_toggle",
                        "Гиф смайлы",
                        event => {
                            settings.gif = $(event.target).prop("checked");
                            saveSettings();
                            reloadRequired();
                        }
                    )
                );
                bggChatSettingsCategory.append(
                    createSettingField(
                        "input",
                        settings.font || "",
                        "font_family",
                        "Шрифт",
                        event => {
                            settings.font = $(event.target).val();
                            saveSettings();
                        }
                    )
                );
                bggChatSettingsCategory.append(
                    createSettingField(
                        "input_number",
                        Number(settings.font_size.replace("px", "") || 0),
                        "font_size",
                        "Размер шрифта",
                        event => {
                            settings.font_size = !(
                                $(event.target).val() === "" ||
                                Number($(event.target).val()) > 25 ||
                                Number($(event.target).val()) < 14
                            )
                                ? $(event.target).val() + "px"
                                : "14px";
                            saveSettings();
                        }
                    )
                );
                bggChatSettingsCategory.append(
                    createSettingField(
                        "input",
                        settings.color || "",
                        "color_input",
                        "Цвет ника",
                        () => {
                            ".....................................";
                        }
                    )
                );
                const colorDescTemplate = `
                <div class="description">
                    Цвет должен быть в формате HEX<br>
                    Стандартные цвета твича:<br>
                    {{default_colors}}<br>
                    После выбора цвета, нажать Enter в поле ввода, либо нажать кнопку "Сохранить"
                </div>`;
                let colorBlocks = ``;
                for (var g = 0; g < defaultColors.length - 1; g++) {
                    var colorBlockTemplate = `<div class="bgg-tw-color" style="background: #{{color}}" onclick="$('#color_input').val('{{color}}')"></div>`;
                    colorBlocks += colorBlockTemplate.replace(
                        /{{color}}/g,
                        defaultColors[g].replace("#", "")
                    );
                }
                $(
                    colorDescTemplate.replace("{{default_colors}}", colorBlocks)
                ).insertBefore("#color_input");
                $("#color_input").on("keydown", e => {
                    if (e.key === "Enter") {
                        if (
                            $(e.target)
                                .val()
                                .match(/^[a-fA-F0-9]+$/) &&
                            $(e.target).val().length === 6
                        ) {
                            settings.color = $(e.target).val();
                            saveSettings();
                        } else {
                            $(e.target).css("border", "solid 2px red");
                        }
                    }
                });
            }, 500);
            $(emoteMenuSelector).append(twitchEmotesContainer[0]); // меню смайлов, часть третья
            $(emoteMenuSelector).append(bttvGlobalEmotesContainer[0]);
            $(emoteMenuSelector).append(bttvChannelEmotesContainer[0]);
            $(emoteMenuSelector).append(ffzGlobalEmotesContainer[0]);
            $(emoteMenuSelector).append(ffzChannelEmotesContainer[0]);
            const emoteSearch = createSettingField(
                "input",
                "",
                "emote_search",
                "Поиск смайлов",
                _this => {
                    ".......";
                }
            ); // поиск смайлов
            emoteSearch[0].classList.add("bgg-emote-search");
            emoteSearch.find("input").on("keyup", event => {
                $("gg-smiles2 div.smile-block").each((_, emoteElement, __) => {
                    $(emoteElement)
                        .find("img")
                        .attr("title")
                        .match(
                            new RegExp(
                                RegExp.escape($(event.target).val()),
                                "i"
                            )
                        )
                        ? $(emoteElement).css({ display: "" })
                        : $(emoteElement).css({ display: "none" });
                });
                setTimeout(() => {
                    $("gg-smiles2>.smile-list>*").each((_, category) => {
                        const smiles = $(category).find(".smile-block");
                        var count = 0;
                        smiles.each((_, emote) => {
                            if (emote.style.display === "none") {
                                count++;
                            }
                        });
                        if (count === smiles.length) {
                            $(category).css({ display: "none" });
                        } else {
                            $(category).css({ display: "" });
                        }
                    });
                }, 1);
            });
            $("#smiles .tse-content>ng-transclude").append(emoteSearch);
            $(".chat-control-block>.text-block>div.textarea").on(
                "keydown",
                e => {
                    // добавление цвета
                    if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        !$(".text-block>.textarea").text().startsWith("/")
                    ) {
                        if (settings.color === "random") {
                            $(
                                ".chat-control-block>.text-block>div.textarea"
                            ).text(
                                $(
                                    ".chat-control-block>.text-block>div.textarea"
                                ).text() + ` ${hexToInv(randColor)}`
                            );
                        } else {
                            $(
                                ".chat-control-block>.text-block>div.textarea"
                            ).text(
                                $(
                                    ".chat-control-block>.text-block>div.textarea"
                                ).text() +
                                    ` ${hexToInv(
                                        settings.color.match(/^[a-fA-F0-9]+$/)
                                            ? settings.color
                                            : randColor
                                    )}`
                            );
                        }
                    }
                    if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        $(".text-block>.textarea").text().startsWith("/")
                    ) {
                        e.sendMessageAsUser = text => {
                            if (!e.defaultPrevented) {
                                if (settings.color === "random") {
                                    $(
                                        ".chat-control-block>.text-block>div.textarea"
                                    ).text(text + ` ${hexToInv(randColor)}`);
                                } else {
                                    $(
                                        ".chat-control-block>.text-block>div.textarea"
                                    ).text(
                                        text +
                                            ` ${hexToInv(
                                                settings.color.match(
                                                    /^[a-fA-F0-9]+$/
                                                )
                                                    ? settings.color
                                                    : randColor
                                            )}`
                                    );
                                }
                            } else {
                                if (settings.color === "random") {
                                    Chat.room().sendMessage(
                                        text + ` ${hexToInv(randColor)}`,
                                        Chat.room().user
                                    );
                                } else {
                                    Chat.room().sendMessage(
                                        text +
                                            ` ${hexToInv(
                                                settings.color.match(
                                                    /^[a-fA-F0-9]+$/
                                                )
                                                    ? settings.color
                                                    : randColor
                                            )}`,
                                        Chat.room().user
                                    );
                                }
                            }
                        };
                        e.defaultPreventDefault = e.preventDefault;
                        e.preventDefault = () => {
                            $(e.target).text("");
                            e.defaultPreventDefault();
                        };
                        const args = $(".text-block>.textarea")
                            .text()
                            .split(" ");
                        if (commands[args[0].replace("/", "")] != undefined) {
                            const spliced = args;
                            const commandName = spliced.splice(0, 1);
                            commands[commandName].callback(
                                spliced,
                                e,
                                commands[commandName]
                            );
                        } else {
                            sendInChat(
                                `Неизвестная команда - ${args[0]}, поищите в /help`
                            );
                        }
                    }
                }
            );
            const onMessage = function () {
                // функция, которая заменяет текст на смайлы
                setTimeout(() => {
                    const messages = $(
                        "div.chat-section.ng-scope>.message-block>.message:not(.bgg-checked)"
                    ); // выделение всех непроверенных сообщений
                    messages.each((_, messageElement) => {
                        // для каждого элемента сообщения
                        twemoji.parse(messageElement, {
                            folder: "svg",
                            ext: ".svg"
                        });
                        $(messageElement)
                            .find(".emoji")
                            .each((_, emoji) => {
                                emoji.outerHTML = `<smile class="bgg-emote">${emoji.outerHTML.replace(
                                    'class="emoji"',
                                    'class="smile"'
                                )}</smile>`;
                            });
                        for (var x = 0; x < emotes.length; x++) {
                            // проверяем каждый смайл
                            if (emotes[x].code === ":'(") continue; // на него jquery ругается
                            if (emotes[x].gif && !settings.gif) {
                            } else {
                                $(messageElement).html(
                                    $(messageElement)
                                        .html()
                                        .replace(
                                            new RegExp(
                                                `^:?${emotes[x].code}:? | :?${emotes[x].code}:? | :?${emotes[x].code}:?$|^:?${emotes[x].code}:?$`,
                                                "g"
                                            ),
                                            match => {
                                                return `${
                                                    match.match(/^ /) ? " " : ""
                                                }<smile name="${
                                                    emotes[x].code
                                                }" title="${
                                                    emotes[x].code
                                                }" class="bgg-emote ng-scope ng-isolate-scope"><img src="${
                                                    emotes[x].image
                                                }" class="smile" title="${
                                                    emotes[x].code
                                                }" style="width:auto;height:36px;padding:2px;"><span class="smile-name ng-binding">${
                                                    emotes[x].code
                                                }</span></smile>${
                                                    match.match(/ $/) ? " " : ""
                                                }`;
                                            }
                                        )
                                ); // получаем html элемента сообщения, и заменяем все присутсвия смайла в сообщении, и приписываем результат в html этого элемента, чтобы появились смайлы
                            }
                            messageElement.classList.add("bgg-checked"); // ставим маркер, что сообщение проверено
                        }
                        const lastChar = $(messageElement).text()[
                            $(messageElement).text().length - 1
                        ];
                        if (
                            $(messageElement).text().length > 6 &&
                            Object.values(invNums).indexOf(lastChar) > -1
                        ) {
                            const colorRaw = $(messageElement)
                                .text()
                                .substr($(messageElement).text().length - 6);
                            const color = invToHex(colorRaw);
                            $(messageElement)
                                .parent()
                                .find(".nick")[0].style.color = `#${color}`;
                        } else {
                            $(messageElement)
                                .parent()
                                .find(".nick")
                                .css(
                                    "color",
                                    `#${
                                        defaultColors[
                                            randInt(0, defaultColors.length - 1)
                                        ]
                                    }`
                                );
                        }
                        if (
                            $(messageElement)
                                .parent()
                                .find(".nick.streamer")
                                .text() == "Pooreshqa"
                        ) {
                            // модерские и стримеровские значки
                            $(messageElement)
                                .parent()
                                .find(".nick.streamer")
                                .prepend(
                                    $(
                                        '<span title="Стример" class="streamer-badge"></span>'
                                    )
                                );
                        } else {
                            $(messageElement)
                                .parent()
                                .find(".nick.streamer")
                                .prepend(
                                    $(
                                        '<span title="Модератор" class="moder-badge"></span>'
                                    )
                                );
                        }
                    });
                }, 10);
            };
            onMessage();
            bggOnMessage(onMessage);
        };
        setInterval(() => {
            if (onmessage) {
                if ($("div.chat-section.ng-scope").length >= 1) {
                    if ($(".message.bgg-checked").length >= 1) {
                    } else {
                        if ($(".message:not(.bgg-checked)").length > 1) {
                            onMessage();
                            initMutant();
                            createNotification(
                                '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OHB4IiB2aWV3Ym94PSIwIDAgNDggNDgiIGZpbGw9Im5vbmUiPgogIDxwYXRoIHN0cm9rZT0iIzVmNjM2OCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBkPSJNMS41IDguNSB2MzQgaDQ1IHYtMjggbS0zLTMgaC0xMCB2LTMgbS0zLTMgaC0xMCBtMTUgNiBoLTE4IHYtMyBtLTMtMyBoLTEwIi8+CiAgPHBhdGggc3Ryb2tlPSIjNWY2MzY4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIGQ9Ik0xMiAzNSBoMiBtMi0yIGgxMiBtMiAyIGgzIG0yIDIgaDMgTTExIDIxIGwwIDAgbTAgNCBoMCBtNCAwIGgwIG0wLTQgaDAgbS0yIDIgaDAgTTMzIDIxIGwwIDAgbTAgNCBoMCBtNCAwIGgwIG0wLTQgaDAgbS0yIDIgaDAiLz4KPC9zdmc+Cg==" style="float:left;margin-right:5px" />Похоже, что размер окна был изменён (вполне возможна и другая причина: бездействие страницы), и панель чата перезагрузилась, а значит, что весь BGG пропал, пофиксить я это могу но мне пиздец лень, так что работают только смайлы в чате, для большего функционала нужна перезагрузка<br/><button class="bgg-button" onclick="location.reload()">Перезагрузить</button>',
                                "Aw, Snap!"
                            );
                        }
                    }
                } else {
                    if ($("#bgg-aw-snap").length === 0) {
                        createNotification(
                            '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OHB4IiB2aWV3Ym94PSIwIDAgNDggNDgiIGZpbGw9Im5vbmUiPgogIDxwYXRoIHN0cm9rZT0iIzVmNjM2OCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBkPSJNMS41IDguNSB2MzQgaDQ1IHYtMjggbS0zLTMgaC0xMCB2LTMgbS0zLTMgaC0xMCBtMTUgNiBoLTE4IHYtMyBtLTMtMyBoLTEwIi8+CiAgPHBhdGggc3Ryb2tlPSIjNWY2MzY4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIGQ9Ik0xMiAzNSBoMiBtMi0yIGgxMiBtMiAyIGgzIG0yIDIgaDMgTTExIDIxIGwwIDAgbTAgNCBoMCBtNCAwIGgwIG0wLTQgaDAgbS0yIDIgaDAgTTMzIDIxIGwwIDAgbTAgNCBoMCBtNCAwIGgwIG0wLTQgaDAgbS0yIDIgaDAiLz4KPC9zdmc+Cg==" style="float:left;margin-right:5px" />Похоже, что чат куда-то исчез, возможно, тут поможет перезагрузка<br/><button class="bgg-button" onclick="location.reload()">Перезагрузить</button>',
                            "Aw, Snap!",
                            "bgg-aw-snap"
                        );
                    }
                }
            }
        }, 25000);
    });
})();
