// ==UserScript==
// @name         LZTThreadTypingUniq
// @namespace    MeloniuM/LZT
// @version      1.2
// @description  Уник в статусе печатания в темах
// @author       MeloniuM
// @license      MIT
// @match        https://lolz.live/threads/*
// @match        https://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479553/LZTThreadTypingUniq.user.js
// @updateURL https://update.greasyfork.org/scripts/479553/LZTThreadTypingUniq.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //строка для вырезания ников из фраз
    let str = (XenForo.phrases.users_are_typing + ' ' + XenForo.phrases.count_more + ' ' + XenForo.phrases.user_is_typing).replaceAll(/{{(user[12]?|count)}}/g, ' ').replace(/\s+/g, ' ').trim();
    //удаляем дубликаты
    str = [...new Set(str.split(" "))];
    //массив уников
    let prioritizedACUsers;
    function getPrioritizedACUsers(){
        if (prioritizedACUsers) return prioritizedACUsers;

        prioritizedACUsers = $('textarea.LolzteamEditorSimple').data('options').prioritizedACUsers.reduce((acc, cur) => {
            if (cur.username == "Mellorium") return acc;
            acc[cur.username] = {
                avatar: cur.avatar,
                username: cur.usernameHtml,
                user: cur.username
            };
            return acc;
    }, {});
        return prioritizedACUsers;
    }

    let findProcess = [];

    const config = {
        subtree: true,
        childList: true
    };

    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type !== "childList") return;

            $.each(mutation.addedNodes, function(index, node) {
                if ($(node).is('span.username') || $(node.parentElement).is('span.username')) return;

                //текст тайпинга
                let typing = node.textContent;
                //получаем ники
                let users = typing.trim().split(' ').filter(x => !str.includes(x));
                if (!users.length) return;
                let pUsers = getPrioritizedACUsers();
                $.each(users, function(index, user) {
                    if (pUsers[user]){
                        typing = typing.replace(user, pUsers[user].username);
                        return;
                    }
                    //чтобы дважды не запрашивало
                    if (findProcess.includes(user)) return;
                    findProcess.push(user);
                    XenForo.ajax('/members/find', {q: user}, resp => {
                        if (!XenForo.hasResponseError(resp)) {
                            let result = resp.results[user];
                            console.log(prioritizedACUsers)
                            prioritizedACUsers[user] = result;
                            delete findProcess[findProcess.indexOf(user)]
                            $.each($('#LiveTypingUsers .Users')[0].childNodes, function(index, node) {
                                if (node.nodeType !== Node.TEXT_NODE) return;
                                if (!node.textContent.includes(user)) return;
                                if ($(node).closest('.username').length) return;
                                $(node).replaceWith(node.textContent.replace(user, result.username));
                            });
                        }
                    })
                });
                if (node.textContent === typing) return;

                $(node).replaceWith(typing);
            })
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe($('#LiveTypingUsers')[0], config);

})();