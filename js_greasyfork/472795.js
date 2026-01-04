// ==UserScript==
// @name         Clown Forum Helper
// @namespace    https://greasyfork.org/ru/scripts/472795-clown-forum-helper
// @homepage     https://greasyfork.org/ru/scripts/472795-clown-forum-helper
// @version      1.2.3
// @description  Помечайте игроков клоунами
// @author       achepta, nexterot
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @include      /^https{0,1}:\/\/((www|qrator|my)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/.+/
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/472795/Clown%20Forum%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/472795/Clown%20Forum%20Helper.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

    let clowns = get("clowns", {});
    let notes = get("notes", {});
    let clown_string = '🤡🐔🐓';
    let clan_string = '🤡';

    window.onload = (event) => {
        main();

        if (location.href.includes("frames.php") || location.href.includes("chat2020.php")) {
            var doc = document;
            if (location.href.includes("frames.php")) {
                doc = document.getElementById("chatwindow").contentDocument;
            }

            var x = new MutationObserver(function (e) {
                if (e[0].addedNodes) {
                    for (const [key, value] of Object.entries(clowns))
                    {
                        if (value == false)
                        {
                            continue;
                        }
                        try_add_clown_to_chat(doc, key);
                    }
                }
            });
            x.observe(doc.getElementById('chat_messages_container'), { childList: true });

            var x2 = new MutationObserver(function (e) {
                if (e[0].addedNodes) {
                    for (const [key, value] of Object.entries(clowns))
                    {
                        if (value == false)
                        {
                            continue;
                        }
                        try_add_clown_to_chat_members(doc, key);
                    }
                }
            });
            x2.observe(doc.getElementById('chat_user_list'), { childList: true });
        }
    };

    function try_add_clown_to_chat(doc, key) {
        var search_str = `chat_open_hero_info(${key})`;
        for (const elem of doc.getElementsByClassName('chat_txt')) {
            if (elem.children.length < 3)
            {
                continue;
            }
            var index = elem.children.length == 3 ? 0 : 1;

            if (elem.children[index+2].getAttribute('onclick').includes(search_str) && !elem.children[index+0].innerHTML.includes(clown_string)) {
                elem.children[index+0].innerHTML += clown_string;
            }
        }
    }

    function try_add_clown_to_chat_members(doc, key) {
        var search_str = `chat_open_hero_info(${key})`;
        for (const elem of doc.getElementsByClassName('chat_user_context')) {
            if (elem.children.length != 2)
            {
                continue;
            }
            if (elem.children[1].getAttribute('onclick').includes(search_str) && !elem.children[0].innerHTML.includes(clown_string)) {
                elem.children[0].innerHTML += clown_string;
            }
        }
    }

    function main() {
        var images = document.querySelectorAll('img');

        for (const [key, value] of Object.entries(clowns))
        {
            if (value == false)
            {
                continue;
            }

            for (const img of images)
            {
                if (img == undefined || img.src == null || !key.startsWith('clan_')) break;
                if (img.src.includes(`i_clans/l_${key.substring(5, key.length)}`))
                {
                    img.src = 'https://media.tenor.com/yRerDxua-F8AAAAi/clown.gif'
                    img.outerHTML = img.outerHTML;
                }
            }

            if (location.href.includes("frames.php") || location.href.includes("chat2020.php")) {
                var doc = document;
                if (document.getElementById("chatwindow") != null) {
                    doc = document.getElementById("chatwindow").contentDocument;
                }
                try_add_clown_to_chat(doc, key);
                try_add_clown_to_chat_members(doc, key);
            }

            if (location.href.includes("forum_messages")) {
                var footers = document.getElementsByClassName('message_footer');
                const size = "16px";
                for (const footer of footers)
                {
                    var ms;
                    ms = footer.querySelector("td:nth-child(1) > font:nth-child(3)");
                    if (ms)
                    {
                        ms.style.fontSize = size;
                    }
                    ms = footer.querySelector("td:nth-child(1) > font:nth-child(4)");
                    if (ms)
                    {
                        ms.style.fontSize = size;
                    }
                    ms = footer.querySelector("td:nth-child(1) > font:nth-child(3) > a > font");
                    if (ms)
                    {
                        ms.style.fontSize = size;
                    }
                    ms = footer.querySelector("td:nth-child(1) > font:nth-child(4) > a > font");
                    if (ms)
                    {
                        ms.style.fontSize = size;
                    }
                }
            }

            for (const elem of document.querySelectorAll("[href='pl_info.php?id=" + key + '\']'))
            {
                elem.innerHTML = elem.innerHTML + clown_string;

                if (location.href.includes("forum_messages")) {
                    let messageRow = elem.parentElement.parentElement.parentElement.parentElement.nextSibling;
                    if (messageRow != null)
                    {
                        try {
                            messageRow.getElementsByTagName('td')[0].style.color = '#DDDDDD';
                            messageRow.addEventListener("touchstart", function() {
                                messageRow.getElementsByTagName("td")[0].style.color = "#000000";
                            });
                            messageRow.addEventListener("touchover", function() {
                                messageRow.getElementsByTagName("td")[0].style.color = "#DDDDDD";
                            });
                            messageRow.addEventListener("touchmove", function() {
                                messageRow.getElementsByTagName("td")[0].style.color = "#DDDDDD";
                            });
                            messageRow.addEventListener("mouseover", function() {
                                messageRow.getElementsByTagName("td")[0].style.color = "#000000";
                            });
                            messageRow.addEventListener("mouseout", function() {
                                messageRow.getElementsByTagName("td")[0].style.color = "#DDDDDD";
                            });
                        } catch (err) {
                        }
                    }
                }

                if (location.href.includes("forum_thread")) {
                    let threadRow = elem.parentElement.parentElement;
                    if (elem.parentElement.cellIndex != 3)
                    {
                        continue;
                    }
                    let threadTitleA = threadRow.getElementsByTagName('td')[0].getElementsByTagName('a')[0];
                    if (threadTitleA != null)
                    {
                        try {
                            threadTitleA.style.color = '#DDDDDD';
                            threadRow.addEventListener("touchstart", function() {
                                threadTitleA.style.color = "#000000";
                            });
                            threadRow.addEventListener("touchover", function() {
                                threadTitleA.style.color = "#DDDDDD";
                            });
                            threadRow.addEventListener("touchmove", function() {
                                threadTitleA.style.color = "#DDDDDD";
                            });
                            threadRow.addEventListener("mouseover", function() {
                                threadTitleA.style.color = "#000000";
                            });
                            threadRow.addEventListener("mouseout", function() {
                                threadTitleA.style.color = "#DDDDDD";
                            });
                        } catch (err) {
                        }
                    }
                }
            }
        }

        if (location.href.includes("pl_info")) {
            let target = document.querySelectorAll("td[align=right]")[1].parentElement;
            let heroId = new URLSearchParams(window.location.search).get("id");
            target.insertAdjacentHTML('afterend', `<tr><td id="clown-target" colspan="2" style="text-align: center;"></td><td id="clown-note-row" class="wb" colspan="1" style="text-align: center;width: 100%;"><textarea id="clown-notes" style="width: 100%;" cols="40" rows="2"></textarea></td></tr>`);
            $('clown-notes').style.width; // ?
            $('clown-notes').addEventListener('change', e => {
                saveNote(heroId);
                set('notes', notes)
            });
            restoreNote(heroId);
            if (!clowns[heroId]) {
                setClown(heroId);
            } else {
                removeClown(heroId);
            }
        }

        if (location.href.includes("clan_info")) {
            let target = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1)");
            if (target == null)
            {
                target = document.querySelector("#android_container > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1)");
            }
            let id = new URLSearchParams(window.location.search).get("id");
            let span = document.createElement('span');
            span.id = 'clown-target';
            target.appendChild(span);
            if (!clowns[`clan_${id}`]) {
                setClan(id);
            } else {
                removeClan(id);
            }
        }
    }

    function restoreNote(heroId) {
        if (notes[heroId]) {
            $('clown-notes').value = notes[heroId];
        }
    }

    function saveNote(heroId) {
        notes[heroId] = $('clown-notes').value;
    }

    function setClown(heroId) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline">Пометить клоуном</span>`;
        $('clown-1').addEventListener('click', e => {
            clowns[heroId] = true
            set('clowns', clowns)
            removeClown(heroId)
        })
    }

    function removeClown(heroId) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline">Убрать из клоунов</span><span>${clown_string}</span>`
        $('clown-1').addEventListener('click', e => {
            clowns[heroId] = false
            set('clowns', clowns)
            setClown(heroId)
        })
    }

    function setClan(id) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline">Пометить клан клоуном</span>`;
        $('clown-1').addEventListener('click', e => {
            clowns[`clan_${id}`] = true;
            set('clowns', clowns);
            removeClan(id);
        });
    }

    function removeClan(id) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline;">Убрать клан из клоунов</span><span>${clan_string}</span>`
        $('clown-1').addEventListener('click', e => {
            clowns[`clan_${id}`] = false;
            set('clowns', clowns);
            setClan(id);
        })
    }


// helpers
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        } else {
            return null
        }
    }

    function doGet(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            onload: function (res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }

    function doPost(url, params, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: params,
            onload: callback,
        });
    }

    function removeElement(element) {
        element.parentNode.removeChild(element)
    }

    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }

    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;
    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
    }

    function getScrollHeight() {
        return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    }

    function getClientWidth() {
        return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
    }

    function findAll(regexPattern, sourceString) {
        let output = []
        let match
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
        while (match = regexPatternWithGlobal.exec(sourceString)) {
            delete match.input
            output.push(match)
        }
        return output
    }
})(window);