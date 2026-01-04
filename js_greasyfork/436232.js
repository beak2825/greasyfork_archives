// ==UserScript==
// @name         MailDumper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get all mails from someone
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/sms\.php/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/436232/MailDumper.user.js
// @updateURL https://update.greasyfork.org/scripts/436232/MailDumper.meta.js
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

    unsafeWindow.initDump = initDump

    let pl_id = getCookie("pl_id")
    let targetId;
    let host = location.host;
    document.body.insertAdjacentHTML("beforeend", getMailDumpMenuTemplate())

    function getMailDumpMenuTemplate() {
        return `
        <div style="width: 100%; display:flex; flex-direction:column; justify-content: center; align-items: center;" id="dump_container">
            <div>
                <label for="dump_id">target id:</label>
                <input type="number" id="dump_id">
                <button onclick="initDump()">Go</button>
            </div>
        </div>
        `
    }
    function initDump() {
        targetId = $("dump_id").value
        $("dump_container").innerHTML = `
            <div>Просмотр страниц</div>
            <div><span>Входящие:</span><span id="dump_in_count"></span></div>
            <div><span>Исходящие:</span><span id="dump_out_count"></span></div>
        `
        getResources(targetId)
    }

    async function getResources(targetId) {
        await Promise.all([doDump(targetId, "in"), doDump(targetId, "out")]).then((result) => {
            $("dump_container").innerHTML = `
                <div>Просмотр сообщений</div>
                <div><span>Входящие:</span><span id="dump_in_count">0</span><span>/${result[0].length}</span></div>
                <div><span>Исходящие:</span><span id="dump_out_count">0</span><span>/${result[1].length}</span></div>
            `
            Promise.all([processIds(result[0], "in"), processIds(result[1], "out")]).then((result) => {
                saveDump(result.flatMap(x=>x))
            })
        })
    }
    function doDump(targetId, type) {
        return new Promise(((resolve, reject) => {
            let mailIds = []
            let prevResult = ""
            let pageCounter = 0
            function getPage(pageId, type, targetId) {
                doGet(`https://${host}/sms.php?box=${type}&by_pl_id=${targetId}&page=${pageId}`, doc => {
                    $(`dump_${type}_count`).innerText = pageCounter
                    pageCounter++
                    let ids = Array.from(doc.querySelectorAll("input[name^='id']")).map(item => item.value)
                    let newResult = JSON.stringify(ids)
                    if (newResult === prevResult) {
                        resolve(mailIds)
                    } else {
                        mailIds.push(...ids)
                        prevResult = newResult
                        getPage(pageCounter, type, targetId)
                    }
                })
            }
            getPage(pageCounter, type, targetId)
        }))
    }

    class Mail {
        constructor(date, from, fromId, to, toId, subject, text) {
            this.date = date;
            this.from = from;
            this.fromId = fromId;
            this.to = to;
            this.toId = toId;
            this.subject = subject;
            this.text = text;
        }
    }

    function processIds(ids, type) {
        return new Promise(((resolve, reject) => {
            let mails = []
            let counter = 0

            function getMail(counter, type) {
                doGet(`https://${host}/sms.php?sms_id=${ids[counter]}&box=${type}`, doc => {
                    counter++
                    $(`dump_${type}_count`).innerText = counter
                    let mailTrs = doc.querySelector("table[width='98%']").getElementsByTagName("tr")
                    let date = Date.parse(mailTrs[0].innerText.split(": ")[1]+"Z+3");
                    let from = mailTrs[1].innerText.split(": ")[1];
                    let fromId = mailTrs[1].innerHTML.match(/id=(\d{1,10})/)[1];
                    let to = mailTrs[2].innerText.split(": ")[1];
                    let toId = mailTrs[2].innerHTML.match(/id=(\d{1,10})/)[1];
                    let subject = mailTrs[3].innerText.split(": ").slice(1,).join(": ").trim();
                    let text = mailTrs[5].innerText.trim();

                    mails.push(new Mail(date, from, fromId, to, toId, subject, text))
                    if (counter === ids.length) {
                        resolve(mails)
                    } else {
                        getMail(counter, type)
                    }
                })
            }

            getMail(counter, type)
        }))
    }

    function saveDump(allMails) {
        allMails.sort((a, b) => a.date-b.date)
        let dumpTemplate = getDumpTemplate(allMails)
        download(`${targetId}_hwm_mails.html`, dumpTemplate)
    }

    function download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function getDumpTemplate(allMails) {
        return `
        <style>
            body {
                background-image: url("https://media.istockphoto.com/vectors/seamless-pattern-with-social-media-elements-vector-id1216688115?k=20&m=1216688115&s=612x612&w=0&h=3sseE8vq-XIPRsv55mVU3kq4Rv1T5hhBWxQ0UogyG0w=");
                font-family: sans-serif;
            }
            .mails_container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                max-width: 800px;
                margin: auto;
            }
            .mail {
                display: flex;
                flex-direction: column;
                filter: drop-shadow(2px 4px 6px black);
                margin: 4px;
                padding: 8px;
                border-radius: 20px;
                max-width: 500px;
                min-width: 200px;
            }
            .right_mail {
                align-self: flex-end;
                background-color: #e8ffeb;;
            }
            .left_mail {
                align-self: flex-start;
                background-color: floralwhite;
            }
            .nickname {}
            .hero_link {
                color: black;
                text-decoration: none;
                font-weight: bold;
            }
            .subject {
                font-size: x-small;
                opacity: 0.7;
            }
            .body {}
            .date {
                align-self: flex-end;
                font-size: small;
                opacity: 0.7;
            }

        </style>
        <div class="mails_container">${allMails.reduce((prev, curr, index) => {
            return prev+= getDumpMailTemplate(curr)
        }, "")}</div>
        `
    }
    function getDumpMailTemplate(mail) {
        return `
            <div class="mail ${pl_id === mail.fromId ? "right_mail" : "left_mail"}">
                <div class="nickname"><a class="hero_link" href="https://${host}/pl_info.php?id=${mail.fromId}" target="_blank">${mail.from}</a></div>
                <div class="subject">${mail.subject}</div>
                <div class="body">${mail.text}</div>
                <div class="date">${new Date(mail.date).toLocaleString()}</div>
            </div>
        `
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