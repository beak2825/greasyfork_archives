// ==UserScript==
// @name         HWM Forum Helper
// @namespace    https://greasyfork.org/ru/scripts/419124-hwm-forum-helper
// @version      0.2
// @description  Отслеживает посещенные темы, новые сообщения
// @author       achepta
// @include        https://www.heroeswm.ru/forum.php
// @include        https://www.heroeswm.ru/forum_thread.php*
// @include        https://www.heroeswm.ru/forum_messages.php*
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/419124/HWM%20Forum%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/419124/HWM%20Forum%20Helper.meta.js
// ==/UserScript==

/*
KNOWN BUGS:
1. F5 saves the document.referrer record and updates the message count
2. If navigating to forum.php from the topic directly the message count does not updating (referrer doesn't match the thread link)

BEHAVIOUR:
1. Ignores closed topics
2. Follows only visited topics
2. Stores only TOPIC_COUNT last visited topics
*/

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

// CONSTANTS
    let TOPIC_COUNT = 200;
//----------------------
    let keys;// = new Array(TOPIC_COUNT);
    let values;// = new Array(TOPIC_COUNT);
    let index = 0;

//----------------------

    function getVar(key) {
        for (let i = 0; i < TOPIC_COUNT; i++) {
            if (keys[i] === key) {
                return values[i];
            }
        }
    }

    function setVar(key, value) {
        for (let i = 0; i < TOPIC_COUNT; i++) {
            if (keys[i] === key) {
                values[i] = value;
                return;
            }
        }
        keys[index] = key;
        values[index] = value;
        index++;
        if (index >= TOPIC_COUNT) {
            index = 0;
        }
    }

    function dropPage(url) {
        return url.split("&")[0];
    }

    function readData() {
        keys = get("forum_keys", undefined);//
        if (keys === undefined) {
            keys = new Array(TOPIC_COUNT);
            set("forum_keys", keys.join('|'));
        } else {
            keys = keys.split('|');
        }
        values = get("forum_values", undefined);//.split('|');
        if (values === undefined) {
            values = new Array(TOPIC_COUNT);
            set("forum_values", values.join('|'));
        } else {
            values = values.split('|');
        }
        index = get("forum_index", undefined);
        if (index === undefined) {
            index = 0;
            set("forum_index", index);
        }
        if (index >= TOPIC_COUNT) {
            index = 0;
        }
    }

// Handle 'forum.php'
    function forum_php() {
        let forumData = get("forum_forum.php", {})
        Array
            .from(document.getElementsByClassName("table3 forum c_darker")[0].childNodes[1].childNodes)
            .filter(node => node.childNodes.length > 3 && node.childNodes[0].tagName === "TD")
            .forEach(thread => {
                let img = thread.childNodes[0].childNodes[0].childNodes[0];
                let thread_id = thread.childNodes[1].childNodes[0].href;
                let msg_count = thread.childNodes[3].innerText;
                let last_topic_id = thread.childNodes[2].childNodes[0].href;
                // write data
                if (document.referrer === thread_id) {
                    forumData[thread_id] = msg_count + "," + msg_count
                    set("forum_forum.php", forumData);
                }

                // init setting
                let data = get("forum_forum.php", {})[thread_id];
                if (data === undefined) {
                    forumData[thread_id] = msg_count + "," + msg_count
                    set("forum_forum.php", forumData);
                    data = msg_count + "," + msg_count;
                }
                let old_msg_count = data.split(',')[0];

                // check
                let msg_delta = msg_count - old_msg_count;//GM_getValue(thread_id).split(',')[0];
                if (msg_delta > 0) {
                    img.src = "https://www.heroeswm.ru/i/clans/online.gif";
                    img.title = msg_delta + " new messages";

                    forumData[thread_id] = (msg_count - msg_delta) + "," + msg_count
                    set("forum_forum.php", forumData);
                } else {
                    img.src = "https://www.heroeswm.ru/i/clans/offline.gif";
                    img.title = "No new messages";
                }
                img.width = 15;
                img.height = 15;

                let value = getVar("forum_" + last_topic_id);
                if (value !== undefined) {
                    console.log(value)
                    let link = document.createElement('a');
                    link.href = value.split(',')[1];
                    link.innerHTML = " >>";
                    link.style.cssText = "text-decoration: none;" + ((msg_delta > 0) ? "color: green;" : "");
                    thread.childNodes[2].insertBefore(link, thread.childNodes[2].childNodes[1]);
                }
            })

    }

    function forum_thread() {
        let cur_topics;
        let thread_id = dropPage(document.URL);


        let tables = document.getElementsByTagName("table");
        for (let i = 0; i < tables.length; i++) {
            if (tables[i].className === "table3 forum c_darker td_bordered") {
                cur_topics = tables[i].childNodes[1].childNodes;
                break;
            }
        }

        for (let i = 2; i < cur_topics.length; i++) {
            let j = 0;
            let cont = 0;
            while (cur_topics[i].childNodes[0].childNodes[j].tagName !== 'A') {
                if (cur_topics[i].childNodes[0].childNodes[j].src === "https://www.heroeswm.ru/i/lock.gif") cont = 1;
                j++;
            }
            if (cont === 1) continue;
            let topic_id = cur_topics[i].childNodes[0].childNodes[j].href;
            let msg_count = cur_topics[i].childNodes[2].innerHTML;

            // init setting
            let value = getVar("forum_" + topic_id);//GM_getValue(topic_id);
            if (value === undefined) {
                let txt = document.createElement("font");
                txt.innerHTML = "- ";
                txt.style.cssText = "color: #FF0000;"
                cur_topics[i].childNodes[0].insertBefore(txt, cur_topics[i].childNodes[0].childNodes[0]);
                continue;
            }

            let old_msg_count = value.split(',')[0];
            let href = value.split(',')[1];

            // check
            let msg_delta = msg_count - old_msg_count;
            if (msg_delta > 0) {
                let link = document.createElement('a');
                link.href = href;
                link.innerHTML = "(new) ";
                link.style.cssText = "color: green;";
                cur_topics[i].childNodes[0].insertBefore(link, cur_topics[i].childNodes[0].childNodes[0]);
            } else {
                let link = document.createElement('a');
                link.href = href;
                link.innerHTML = "» ";
                link.style.cssText = "text-decoration: none;";
                cur_topics[i].childNodes[0].insertBefore(link, cur_topics[i].childNodes[0].childNodes[0]);
            }
        }
    }

    function forum_messages() {
        let messages;
        let tables = document.getElementsByTagName("table");
        for (let i = 0; i < tables.length; i++) {
            if (tables[i].className === "table3 forum c_darker td_bordered") {
                messages = tables[i].childNodes[1].childNodes;
                break;
            }
        }

        let link = messages[messages.length - 2].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1];
        let topic_id = link.href.split('&')[0];
        let old = getVar("forum_" + topic_id);
        if (old !== undefined) {
            old = old.split(",")[0];
            if (old - link.innerHTML > 0) {
                return;
            }
        }
        setVar("forum_" + topic_id, link.innerHTML + "," + link.href)
        set("forum_keys", keys.join('|'));
        set("forum_values", values.join('|'));
        set("forum_index", index);
    }

    readData();
    if (document.URL.indexOf('forum.php') >= 0) {
        forum_php();
    }
    if (document.URL.indexOf('forum_thread.php') >= 0) {
        forum_thread();
    }
    if (document.URL.indexOf('forum_messages.php') >= 0) {
        forum_messages();
    }


    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;

    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
    }
})(window);