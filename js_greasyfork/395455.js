// ==UserScript==
// @name         [app.intercom.io] Поиск заданий
// @namespace    tuxuuman:intercon.io:ac
// @version      0.2.0
// @description  Автоматический поиск и принятия заданий
// @author       tuxuuman<tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://app.intercom.com/a/apps/aurbos2n*
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/395455/%5Bappintercomio%5D%20%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/395455/%5Bappintercomio%5D%20%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // задержка принятия тикета, в миллсекундах
    const TICKET_DELAY = 0;

    // максимальное кол-во минут после истечения которых тикет уже не считается новым
    const MAX_TICKET_TIME = 4;

    const DEBUG = false;

    let searchEnabled = false;

    function log(...args) {
        if (DEBUG) console.log(...args);
    }

    async function getTicketsInfo(ids) {
        let res = await EmberApplicationInstance.application.$.ajax(`https://app.intercom.com/ember/conversations.json?app_id=aurbos2n&ids%5B%5D=${ids.join('&ids[]=')}&include_total_count=false`);
        return res.conversations ? res.conversations : [];
    }

    function acceptTicket(ticket) {
        log("Принимаем тикет", ticket);

        if (!DEBUG) {
            return EmberApplicationInstance.application.$.ajax('https://app.intercom.com/ember/conversation_parts', {
                method: "POST",
                data: {
                    "app_id": "aurbos2n",
                    "conversation_id": ticket.id,
                    "blocks":[],
                    //"admin_id": "3304508", // пока хз что это, но это значение встречается в localStorage. ну да хрен с ним, и так работает
                    "assignee_id": intercomSettings.user_id, // id того кому назначается данный тикет. 0 - unsigned, "3304508" - id юзера
                    "type": "assignment",
                    "sub_type": "assignment",
                    "lightweight_reply_type": null,
                    "passive": false,
                    "created_at": ticket.created_at,
                    "text_direction": "ltr",
                    //"client_assigned_uuid": "ba5769f1-2bf6-4a37-b080-df6e73d41e90", // хз что это но и без этого работает
                    "admin_only": false,
                    "taggings": [],
                    "uploads": []
                }
            });
        } else {
            return new Promise((res, rej) => res({
                id: "tiker id"
            }));
        }
    }

    function startSearch() {
        searchEnabled = true;
        log("Поиск задаинй активирован");
    }

    function stopSearch() {
        searchEnabled = false;
        log("Поиск задаинй отключен");
    }

    function onUnassigned({count, sync_data}) {
        if (searchEnabled && count) {
            log("Получен списко заданий", sync_data);
            stopSearch();
            setTimeout(async () => {
                let now = new Date();

                let ticketsList = await getTicketsInfo(sync_data.map(d => d[0]));

                let ticket = ticketsList.find((t) => {
                    let createdAt = new Date(t.created_at);
                    if ( ( (now - createdAt) / 60000) < MAX_TICKET_TIME) return true;
                    else return false;
                });

                if (ticket) {
                    let acceptResult = await acceptTicket(ticket);
                    if (acceptResult.id) {
                        stopSearch();
                        GM_notification({
                            text: "Найдено задание",
                            silent: false,
                            highlight: true,
                            onclick: function() {
                                usafeWindow.location.href = `https://app.intercom.com/a/apps/aurbos2n/inbox/inbox/unassigned/conversations/${sync_data[0][0]}`
                            }
                        });
                    } else {
                        startSearch();
                    }
                } else {
                    startSearch();
                }
            }, TICKET_DELAY);
        }
    }

    GM_registerMenuCommand("Начать поиск задания", function() {
        startSearch();
    }, "F")

    setInterval(() => {
        EmberApplicationInstance.application.$.ajax('https://app.intercom.com/ember/conversations/for_inbox?app_id=aurbos2n&state=open&sort_key=sorting_updated_at&sort_direction=desc&count=10&assignee_id=0')
            .then((data, success) => {
            if (success) onUnassigned(data);
            else log("не удалось получить список заданий", success, data);
        })
            .catch(err => log("не удалось получить список заданий", err));
    }, 5000);
})();