// ==UserScript==
// @name            AnimeBytes Forum Tag Notifications
// @author          sabs (like "sobs"), sabs@sobs.moe
// @namespace       sabs
// @version         22
// @description     Find out when someone tags you
// @match           https://animebytes.tv/*
// @homepageURL     https://animebytes.tv/forums.php?action=viewthread&threadid=27261
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_log
// @grant GM_registerMenuCommand
// @icon data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb2lDQ1BpY2MAACiRdZE7SwNBFIW/JEp8YqFFEIsUUSwiiIJop7FIEyTECEZtNutuIiTrspsgwVawsQhYiDa+Cv+BtoKtgiAogoiNf8BXI7LeMUJEdJbZ+3FmzmXmDPgTBb3oNgxC0So5qXgsPJuZCwcfaSaEnyBjmu7aE8lkgn/H2zU+Va8GVK//9/05WhcNVwdfk/CIbjsl4XHhxErJVrwh3KXntUXhPeGoIwcUPld6tsYPinM1flHspFOT4Fc9w7kfnP3Bet4pCvcLR4qFsv59HnWTNsOamZbaLbMHlxRxYoTJUmaJAiUGpFqS2d++wS/fFMvi0eVvU8ERR468eKOilqWrIdUU3ZCvQEXl/jtP1xweqnVvi0Hjvec990JwEz6qnve+73kfBxC4g1Or7l+WnEZfRa/WtcgudKzB8Vldy27ByTqEbm3N0b6kgEy/acLTEbRnoPMSWuZrWX2vc3gD6VV5ogvY3oE+2d+x8AnhZWf8PQBFKQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAbRJREFUOMudU00oRFEUPucOZjGpec+MorCzGIvZWtsgOz8rU8oCmWEjslAiJUkx4ydlyQpblFKWFsqkLCwpI8x7VmJ49zj3+enNNaQ5m9v97rnfOee730XQImvGG5Aw5veVJHNvTj2Bsw2I9wB4hKW4Ydyl0t584d1YRmIWJaWZ4CDwsJghdOYIIExEESKZoJxzyjnrFJksyyNQQDY4uMtJ44BizXhMHbunBGFvASbzcU6fdfOw/0XiEli32Qle2hHAYWj+6wICTn9gelCTnckuuDmWMVwL9HbJ7H5EODHt1UZvql05FKVXOcpjdHtxRUwCo9wBH/Llz4nSei0lmmmvxHwCuvRxWKsBodqBf0TQWt1BxC19FMFMdd9booq/aXBP66JOdSA9g7VQaKz8t+uEMpAPUECw0tdewJJP/b82ILFZhwQSHOQ1KeWMZQy16Yl2MN7DFTp+DOVal92nVM07YMGY/FAivxCRqtxeUJVPC6eUVaGIcJ1oVFWMqM9SNAFeTOXM6lArolgubN3vdl90L2Ch7ywk9JJ6UqAa1uGZAM+50hmhb8m0k1eWEd9kXTqVg98BpA+2IT/y+kMAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/453137/AnimeBytes%20Forum%20Tag%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/453137/AnimeBytes%20Forum%20Tag%20Notifications.meta.js
// ==/UserScript==
(function() {
    'use strict';

    unsafeWindow.abng = {
        alerts: JSON.parse(GM_getValue("alerts", "{}")),
        preference: GM_getValue("preference", "tag"),
        hidden: GM_getValue("hidden", false)
    }
    function getUsername() {
        return document.querySelector(".username").text
    }
    var bookmarks, header, text, a, linkbox, container
    GM_registerMenuCommand("Check for Mentions", () => {
        refresh()
    })
    function getUnreadAlerts() {
        return Object.values(unsafeWindow.abng.alerts).filter(a => !a.seen)
    }
    function extractPostsFromSearchPage(response) {
        var container = document.implementation.createHTMLDocument().documentElement;
        container.innerHTML = response.responseText;
        var fid, pid, date, clean;
        var ret = {};
        Array.from(container.querySelector(".colhead").parentNode.children).slice(1).forEach(row => {
            fid = row.children[0].children[0].href.split("=").slice(-1)[0];
            pid = row.children[1].children[0].href.split("t").slice(-1)[0];
            date = Date.parse(row.children[2].children[0].title.slice(0,-4))
            clean = new Date(date).toDateString()
            ret["" + fid + "-" + pid] = {
                row: row.outerHTML,
                date: date,
                fpid: "" + fid + "-" + pid,
                clean: clean,
                seen: false,
            }

        })
        return ret
    }

    function hourlyCheck() {
        let last_check = new Date(GM_getValue("last_check", 0))
        var t1 = last_check.getTime();
        var t2 = new Date().getTime();

        let hours = parseInt((t2-t1)/(3600*1000));
        if (hours >= 1) {
            refresh()
        } else {
            buildAlertsArea()
            buildAlertDisplay()
        }
    }
    hourlyCheck()

    function refresh() {
        buildAlertDisplay(true)
        getPosts((ret) => {
            reloadAlerts(ret)
            buildAlertsArea()
            buildAlertDisplay()
            GM_setValue("last_check", new Date().toString())
        })
    }

    function reloadAlerts(alerts) {
        let old_alerts = JSON.parse(GM_getValue("alerts", "{}"))
        unsafeWindow.abng.alerts = {...alerts, ...old_alerts}
        GM_setValue("alerts", JSON.stringify(unsafeWindow.abng.alerts))
    }

    function createLinkboxLink(text, callback) {
        a = document.createElement("a")
        a.addEventListener("click", callback, false)
        a.style = "cursor: pointer;"
        a.appendChild(document.createTextNode(text))
        return a
    }

    function markAlertRead(id) {
        unsafeWindow.abng.alerts = JSON.parse(GM_getValue("alerts", "{}"))
        unsafeWindow.abng.alerts[id].seen = true
        GM_setValue("alerts", JSON.stringify(unsafeWindow.abng.alerts))
    }

    function changeAlertOption(value) {
        unsafeWindow.abng.preference = value
        GM_setValue("preference", unsafeWindow.abng.preference)
    }

    function buildAlertDisplay(checking = false) {
        let alerts = getUnreadAlerts()
        let a = document.querySelector("#my_mentions")
        if (a !== null) {
            a.remove()
        }
        let light,dark,text
        a = createLinkboxLink(text, () => {
            let div = document.querySelector("#not_content")
            div.style.display = div.style.display === "none" ? "block" : "none";
        })
        if (checking) {
            a.text="checking..."
            dark="#f38080"
            light="#ed106a"
        } else if (alerts.length === 0) {
            if (unsafeWindow.abng.hidden) {
                dark="#f3808000"
            } else {
                dark="#f38080"
            }
            light="#ed106a"
            a.text="no mentions"
        } else {
            let s = alerts.length === 1 ? "" : "s"
            a.text = "" + alerts.length + " mention" + s
            dark="#ed106a"
            light="#f380af"
            a.style.fontWeight="bold"
        }
        a.id = "my_mentions"
        a.style.color=dark
        a.addEventListener("mouseenter", () => {
            a.style.color=light
        }, false)
        a.addEventListener("mouseleave", () => {
            a.style.color=dark
        }, false)
        let username_menu = document.querySelector("#username_menu")
        a.style.float = "left"
        a.style.lineHeight = "20px"
        a.style.verticalAlign = "middle"
        a.style.padding = "0 5px"
        username_menu.parentNode.insertBefore(a, username_menu)
    }

    function createCheckbox(id, checked, label_text, listener) {
        let checkbox;
        checkbox = document.createElement("input")
        checkbox.type = "checkbox";
        checkbox.name = "settings";
        checkbox.style = "display:inline-block;"
        checkbox.id = id;
        checkbox.checked=checked;
        checkbox.addEventListener('change', () => {
            listener(checkbox)
        })

        var label = document.createElement('label')
        label.htmlFor = id;
        label.style = "display:block;text-align:left"
        label.appendChild(checkbox)
        label.appendChild(document.createTextNode(" " + label_text));
        return label
    }

    function createRadiobox(id, checked, label_text, listener) {
        let checkbox;
        checkbox = document.createElement("input")
        checkbox.type = "radio";
        checkbox.name = "settings";
        checkbox.style = "display:inline-block;"
        checkbox.id = id;
        checkbox.checked=checked;
        checkbox.addEventListener('change', () => {
            listener(checkbox)
        })

        var label = document.createElement('label')
        label.htmlFor = id;
        label.style = "display:block;text-align:left"
        label.appendChild(checkbox)
        label.appendChild(document.createTextNode(" " + label_text));
        return label
    }

    function buildAlertsArea() {
        let ret = {}
        let data = []
        let div, table, body, row, text, td, options
        let should_display = "none"
        div = document.querySelector("#not_content")
        if (div !== null) {
            should_display = div.style.display
            div.remove()
        }

        div = document.createElement("div")
        div.id = "not_content"

        if (getUnreadAlerts().length !== 0) {
            div.innerHTML='<div><table cellpadding="6" cellspacing="1" border="0" class="border" width="100%"><tbody><tr class="colhead"><td>Forum</td><td>Topic</td><td>Time</td><td>Mark Read</td><tr></tbody></table>'
            table = div.querySelector("table")
            var idx = 0;
            Object.values(unsafeWindow.abng.alerts).sort((a,b) => a.date - b.date).forEach(alert => {
                if (alert.seen) {
                    return
                }
                row = table.insertRow(1)
                row.innerHTML = alert.row
                row.classList.add(idx++ % 2 == 0 ? "rowa" : "rowb")
                row.children[2].innerHTML = alert.clean
                td = document.createElement("td")
                td.width="12%"
                td.appendChild(createLinkboxLink("[ x ]", () => {
                    markAlertRead(alert.fpid)
                    buildAlertsArea()
                    buildAlertDisplay()
                }))
                row.appendChild(td)
            })
        } else {
            div.append("You don't have any new mentions!")
            div.append(document.createElement("br"))
            div.append("If you would like to see your previous mentions again, ", createLinkboxLink("click here to bring them all back.", ()=>{
                if (confirm("You will receive all your previous mentions again.")) {
                    unsafeWindow.abng.alerts = JSON.parse(GM_getValue("alerts", "{}"))
                    unsafeWindow.abng.alerts = {}
                    GM_setValue("alerts", JSON.stringify(unsafeWindow.abng.alerts))
                    refresh()
                }
            }))
        }
        options = document.createElement("div")
        options.append(createRadiobox("any", unsafeWindow.abng.preference === "any", "Notify me whenever a post contains my username", (checkbox)=>{
            if (checkbox.checked) {
                changeAlertOption("any")
                refresh()
            }
        }))
        options.append(createRadiobox("tag", unsafeWindow.abng.preference === "tag", "Only notify me when someone [user] tags me", (checkbox)=>{
            if (checkbox.checked) {
                changeAlertOption("tag")
                refresh()
            }
        }))
        options.append(createCheckbox("hidden", unsafeWindow.abng.hidden, "Hide the counter if I have zero mentions (it's still clickable)", (checkbox)=>{
            unsafeWindow.abng.hidden = checkbox.checked
            GM_setValue("hidden", unsafeWindow.abng.hidden)
            refresh()
        }))

        options.style.lineHeight = "22px"
        options.style.margin = "10px auto 20px"
        options.style.textAlign = "center"
        div.append(options)
        div.style.display = should_display
        document.querySelector("#content").prepend(div)
    }

    function getPosts(callback) {
        let query;
        if (unsafeWindow.abng.preference === "tag") {
            query = "%5D" + getUsername() + "%5B"
        } else {
            query = getUsername()
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://animebytes.tv/forums.php?action=search&type=body&search=" + query,
            onload: (r) => {
                callback(extractPostsFromSearchPage(r))
            }
        })
    }
})();
