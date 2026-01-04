// ==UserScript==
// @name         mentionNotification
// @namespace https://greasyfork.org/users/694598
// @version      0.3
// @description  Notifies about the mention in the chat
// @author       Phobos
// @match        https://anichat.ru/
// @icon         https://anichat.ru/default_images/icon.png?v=1528136794
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449313/mentionNotification.user.js
// @updateURL https://update.greasyfork.org/scripts/449313/mentionNotification.meta.js
// ==/UserScript==
 
const mentionNotification = async () => {
 
    if ("granted" !== await Notification.requestPermission()) return !1;
    const t = {
            title: "Новое уведомление!",
            body: "%username% упомянул Вас в чате!",
            icon: "https://anichat.ru/default_images/icon.png?v=1528136794",
            sound: "https://anichat.ru/sounds/username.mp3",
            volume: 50,
            timeout: 6
        },
        e = JSON.parse(window.localStorage.getItem("notificationOptions")) || t;
      
 
 return document.getElementById("chat_left_menu").innerHTML += '<div class="list_element left_item"><div id="notificationOptions" class="left_item_in"><i id="notificationOptionsIcon" class="fa fa-bell menui"></i> Уведомления</div></div>', new MutationObserver(t => {
        for (const i of t)
            if ("childList" === i.type)
                for (const t of i.addedNodes) {
                    if (t.querySelector(".my_text .chat_message .my_notice") && !document.hasFocus()) {
 
                        const {
                            innerHTML: i
                        } = t.querySelector(".my_text .username"), n = new Notification(e.title.replace(/%username%/gu, i), {
 
                            body: e.body.replace(/%username%/gu, i),
                            icon: e.icon,
                            tag: i
                        }), o = new Audio(e.sound);
                      if (i!=="Лакей" && i!=="MafiaBot" && i!=="AstralBot"&& i!=="AstralBro") o.volume = e.volume / 100, o.play(), setTimeout(n.close.bind(n), 1e3 * e.timeout), n.addEventListener("click", () => {
                            window.focus()
                        })
                    }
                }
    }).observe(document.getElementById("chat_logs_container"), {
        childList: !0
    }), document.addEventListener("click", i => {
        if (["notificationOptions", "notificationOptionsIcon"].indexOf(i.target.id) > -1) {
            const i = document.getElementById("small_modal");
            document.getElementById("small_modal_content").innerHTML = `<div class="pad_box"><div class="boom_form"><div class="chat_settings"><p class="label">Заголовок</p><input id="notificationTitle" name="title" class="full_input" type="text" placeholder="${t.title}" value="${e.title}"></div><div class="chat_settings"><p class="label">Текст</p><input id="notificationBody" name="body" class="full_input" type="text" placeholder="${t.body}" value="${e.body}"></div><div class="chat_settings"><p class="label">Иконка</p><input id="notificationIcon" name="icon" class="full_input" type="text" placeholder="${t.icon}" value="${e.icon}"></div><div class="chat_settings"><p class="label">Звук</p><input id="notificationSound" name="sound" class="full_input" type="text" placeholder="${t.sound}" value="${e.sound}"></div><div class="chat_settings"><p class="label">Громкость уведомления (<span id="notificationVolumeSpan">${e.volume}</span>%)</p><input id="notificationVolume" type="range" min="0" max="100" name="volume" value="${e.volume}" style="width:100%"></div><div class="chat_settings"><p class="label">Таймаут (s)</p><input id="notificationTimeout" name="timeout" class="full_input" type="number" placeholder="${t.timeout}" value="${e.timeout}"></div></div><button id="saveNotificationOptions" class="reg_button theme_btn" style="margin-right:5px">Сохранить</button><button id="previewNotification" class="reg_button theme_btn">Предпросмотр</button></div>`;
            const n = document.getElementById("notificationTitle"),
                o = document.getElementById("notificationBody"),
                a = document.getElementById("notificationIcon"),
                l = document.getElementById("notificationSound"),
                c = document.getElementById("notificationVolume"),
                s = document.getElementById("notificationVolumeSpan"),
                d = document.getElementById("notificationTimeout"),
                u = document.getElementById("saveNotificationOptions"),
                m = document.getElementById("previewNotification");
            i.style.display = "block", u.addEventListener("click", () => {
                const e = [n, o, a, l, c, d],
                    s = {};
                for (const i of e) s[i.name] = i.value || t[i.name];
                if (window.localStorage.setItem("notificationOptions", JSON.stringify(s)), window.localStorage.getItem("notificationOptions")) {
                    confirm("Настройки были успешно сохранены!\nДля того, чтобы изменения вступили в силу, необходимо перезагрузить страницу.\nХотите перезагрузить сейчас?") && location.reload(!0), i.style.display = "none"
                }
            }), c.addEventListener("input", t => {
                ({
                    target: {
                        value: s.innerHTML
                    }
                } = t)
            }), m.addEventListener("click", () => {
                const t = new Notification(document.getElementById("notificationTitle").value.replace(/%username%/gu, "Никнейм"), {
                        body: document.getElementById("notificationBody").value.replace(/%username%/gu, "Никнейм"),
                        icon: document.getElementById("notificationIcon").value
                    }),
                    e = new Audio(document.getElementById("notificationSound").value);
                e.volume = document.getElementById("notificationVolume").value / 100, e.play(), setTimeout(t.close.bind(t), 1e3 * document.getElementById("notificationTimeout").value)
            })
        }
    }), !1
};
 document.addEventListener("DOMContentLoaded", mentionNotification(), !1);