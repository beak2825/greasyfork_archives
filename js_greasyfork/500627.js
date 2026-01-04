// ==UserScript==
// @name         Mazyar_DaysModify
// @namespace    http://tampermonkey.net/
// @version      2.50
// @description  Swiss Army knife for managerzone.com
// @copyright    z7z from managerzone.com
// @author       z7z from managerzone.com
// @license      MIT
// @run-at       document-idle
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      self
// @require      https://unpkg.com/dexie@4.0.8/dist/dexie.min.js
// @match        https://www.managerzone.com/*
// @match        https://test.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @supportURL   https://github.com/mz-ir/mazyar
// @downloadURL https://update.greasyfork.org/scripts/500627/Mazyar_DaysModify.user.js
// @updateURL https://update.greasyfork.org/scripts/500627/Mazyar_DaysModify.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    const DEADLINE_INTERVAL_SECONDS = 30; // in seconds

    let mazyar = null;

    /* *********************** Changelogs ********************************** */

    const currentVersion = GM_info.script.version;
    const changelogs = {
        "2.50": ["<b>[new]</b> Players Profile: add transfer fee."],
        "2.49": ["<b>[fix]</b> Transfer Market: wrong camp status in test domain"],
        "2.48": ["<b>[fix]</b> download and update urls for userscript were missing."],
        "2.47": ["<b>[fix]</b> some features were not compatible with test version of the site (test.managerzone.com)."],
        "2.46": [
            "<b>[new]</b> if 'deadline alert' is enabled from MZY Settings, it adds a section to Transfer Monitor to display players you added to monitor their deadline.</b>.",
            "<b>[fix]</b> clean install was broken."
        ],
        "2.45": ["<b>[new]</b> Market: add optional feature to show training camp status of players. It is disabled by default. To enable it, please select 'Check if player is sent to camp' option from <b>MZY Settings</b>."],
        "2.44": ["<b>[fix]</b> Tables: fix not adding top players to friendly league tables."],
        "2.43": ["<b>[new]</b> Manager Ranking: add value and average top players for each team. You can sort them by this two columns too."],
        "2.42": ["<b>[improve]</b> Squad Summary: add share and market icon for your own players too."],
        "2.41": ["<b>[new]</b> Notebook: add a note icon to MZY Toolbar to open/hide a notebook. It stores your note and you can stick it to a corner to be always be available and visible."],
        "2.40": ["<b>[fix]</b> Transfer: change Fee font color to blue."],
        "2.39": ["<b>[new]</b> Transfer: for non one-club players, the price that current club paid for the player is added next to 'Days at this club'."],
        "2.38": ["<b>[fix]</b> Transfer Filters: delete icon was missing in 'MZY Transfer Filters' modal."],
        "2.37": ["<b>[new]</b> support Managerzone Test Site (test.managerzone.com). It is not fully tested. Please report any issues you encounter in Test site too."],
        "2.36": [
            "<b>[new]</b> Deadline Alert: add 'Timeout' option in <b>MZY Settings</b> to set deadline timeout. Its value must be between 1 and 360 minutes.",
            "<b>[new]</b> Deadline Alert: add 'Sound Notification' option to play a bell sound when deadline of at least one of monitored players is less than timeout.",
            "<b>[fix]</b> Deadline Alert: trash icon was missing in 'MZY Transfer Deadlines' modal when 'van.mz.playerAdvanced' script is enabled.",
            "<b>[fix]</b> MZY Settings: 'Mark maxed skills' option was missing."
        ],
        "2.35": ["<b>[new]</b> Days at this club: add to player profiles in training report. It is optional and disabled by default. You can enable it from MZY Settings."],
        "2.34": ["<b>[new]</b> <b>(Experimental)</b> Transfer: add deadline alert."],
        "2.33": ["<b>[fix]</b> Federation Front Page: add top players when current federation is changed."],
        "2.32": ["<b>[improve]</b> Federation: first team member sort"],
        "2.31": ["<b>[new]</b> Clash: add average age of top players and teams senior league for each team. this feature is not supported in mobile view."],
        "2.30": ["<b>[fix]</b> Transfer Filters: reset selected H & L checkboxes when Transfer filter is not enabled."],
        "2.29": ["<b>[fix]</b> Hide Players: fixed an issue about hide icon when transfer scout filters are used."],
        "2.28": ["<b>[fix]</b> Days at this club: after v2.27, it was broken in players page."],
        "2.27": ["<b>[new]</b> Transfer Market: it adds a trash icon next to player ID in search result. click on the icon to <b>hide the player. To remove players from hide list, use 'MZY Hide' button."],
        "2.26": [
            "<b>[improve]</b> Days at this club: it is optional. It is disabled by default. You can enable it from MZY Settings.",
            "<b>[improve]</b> Player Profile: it stores player profiles in local database to reduce number of requests.",
            "<b>[improve]</b> Local Database: it deletes outdated local data to reduce the size of database.",
            "<b>[improve]</b> Transfer: it uses less ajax requests now.",
        ],
        "2.25": ["<b>[new]</b> Training Report: click on player's camp package icon to open its camp report."],
        "2.24": ["<b>[fix]</b> Player Profile: fix Days at this club for injured or suspended players."],
        "2.23": [
            "<b>[new]</b> Squad Profile: add 'days at this club' to each player profile.",
            "<b>[fix]</b> Player Comment: show comment icon for players when selected tab changes.",
            "<b>[fix]</b> Player Comment: change color of comment icon to lightskyblue when player has no comment. (previous color was the same as loyal players background)",
        ],
        "2.22": ["<b>[new]</b> Hire Coaches: adds salary range of each coach. Thanks to <a href=\"https://www.managerzone.com/?p=profile&uid=8577497\">@douglaskampl</a> for suggesting the idea and sharing his implementation."],
        "2.21": ["<b>[new]</b> Club Page: adds total trophy count."],
        "2.20": ["<b>[new]</b> Player Profile: add 'Days at this club' counter."],
        "2.19": ["<b>[new]</b> Squad Summary: it marks players whose skills are shared. click on share icon to see the player in place.",
            "<b>[new]</b> Squad Summary: it marks players that are in transfer market. click on transfer icon to see the player in market."],
        "2.18": ["<b>[new]</b> show changelog after script update.",
            "<b>[improve]</b> change icon style of player's comment."],
        "2.17": ["<b>[fix]</b> fixed total skill balls"],
    }

    /* *********************** Styles ********************************** */

    const styles = `
    #mazyar-modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }

    #mazyar-modal-content {
        width: fit-content;
        background-color: beige;
        border-radius: 5px;
        max-height: 100%;
    }

    .mazyar-notebook-plain {
        z-index: 9990;
        position: absolute;
        left: 0;
        top: 0;
        flex-wrap: nowrap;
    }

    .mazyar-notebook-modal {
        position: fixed;
        top: 0;
        left: 0;
        background-color: beige;
        border-radius: 5px;
        min-width: 200px;
        min-height: 250px;
        max-width: 95vw;
        max-height: 99vh;
        flex-wrap: nowrap;
    }

    .mazyar-notebook-textarea {
        padding: 5px;
        min-width: 180px;
        resize: none;
        width: 90%;
        flex: 1;
    }

    .mazyar-scrollable-vertical {
        overflow-x: clip;
        overflow-y: auto;
    }

    .mazyar-resizable {
        resize: both;
    }

    .mazyar-flex-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        max-height: 100%;
    }

    .mazyar-flex-container-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    .mazyar-donut {
        width: 1.7em;
        height: 1.7em;
        margin-right: 5px;
        border-radius: 50%;
        text-align: center;
        font-size: 1.2em;
        padding: 3px;
        background-color: yellow;
        color: yellow;
    }

    .mazyar-final-donut {
        border: rgb(213, 232, 44) solid 2px;
        color: inherit;
        padding:0;
    }

    .mazyar-loading-donut {
        border-bottom-color: rgb(213, 232, 44);
        animation: 1.5s mazyar-donut-spin infinite linear;
    }

    @keyframes mazyar-donut-spin {
        to {
            transform: rotate(360deg);
        }
    }

    table.mazyar-table {
        border-spacing: 0;
        width: auto;
    }

    table.mazyar-table tbody td, table.mazyar-table thead th {
        padding: 0.3em 0.5em;
        vertical-align: middle;
    }

    @media only screen and (max-device-width: 1020px) {
        thead.responsive-show.mazyar-responsive-show {
            display: table-header-group !important;
        }
        tbody tr.responsive-show.mazyar-responsive-show {
          display: table-row !important;
      }
    }

    a.mazyar-in-progress-result {
        animation: mazyar-change-result-background 3s infinite;
    }

    @keyframes mazyar-change-result-background {
        0%   {background-color: inherit;}
        50%  {background-color: lightgreen;}
        100%  {background-color: inherit;}
    }

    .mazyar-deadline-throb-lightgreen {
        animation: mazyar-throb-deadline-icon 3s infinite;
    }

    @keyframes mazyar-throb-deadline-icon {
        0%   {color: yellow;}
        50%  {color: crimson;}
        100%  {color: yellow;}
    }

    .mazyar-deadline-monitor-throb {
        animation: mazyar-throb-deadline-monitor 3s infinite;
    }

    @keyframes mazyar-throb-deadline-monitor {
        0%   {background-color: inherit;}
        50%  {background-color: yellow;}
        100%  {background-color: inherit;}
    }

    span.mazyar-icon-delete {
        display: inline-block;
        cursor: pointer;
        background-image: url("nocache-869/img/player/discard.png");
        width: 21px;
        height: 20px;
    }

    button.mazyar-button {
        cursor: pointer;
    }

    div.mazyar-transfer-control-area {
        width: 50%;
    }

    .mazyar-dim-50 {
        opacity: 50%;
    }

    .mazyar-dim-60 {
        opacity: 60%;
    }

    .mazyar-hide {
        display: none;
    }

    .mazyar-scout-h {
        font-weight: bold;
    }

    .mazyar-scout-1 {
        color: red;
    }

    .mazyar-scout-2 {
        color: darkgoldenrod;
    }

    .mazyar-scout-3 {
        color: blue;
    }

    .mazyar-scout-4 {
        color: fuchsia;
    }

    .mazyar-player-comment-icon-www {
        vertical-align: top;
    }

    .mazyar-player-comment-icon-www span.player_icon_wrapper {
        text-align: center;
    }

    .mazyar-player-comment-icon-inactive {
        color: lightskyblue;
    }

    .mazyar-player-comment-icon-active {
        color: blue;
    }

    .mazyar-player-comment-textarea {
        margin: 0.5rem;
        min-width: 220px;
        min-height: 100px;
    }

    .mazyar-days-at-this-club {
        margin: 5px;
        padding: 3px;
        background-color: azure;
        border-radius: 5px;
        border: 1px solid black;
        text-align: center;
    }

    .mazyar-days-at-this-club-entire {
        margin: 5px;
        padding: 3px;
        background-color: greenyellow;
        border-radius: 5px;
        border: 1px solid black;
        text-align: center;
    }
    `;

    /* ********************** Constants ******************************** */

    const TRANSFER_INTERVALS = {
        always: {
            value: "0",
            label: "always",
        },
        onceMinute: {
            value: "1",
            label: "once a minute",
        },
        onceHour: {
            value: "2",
            label: "once an hour",
        },
        onceDay: {
            value: "3",
            label: "once a day",
        },
        never: {
            value: "4",
            label: "never",
        },
    };

    const deadlineAlertSound =
        "data:audio/mpeg;base64,//OExAAAAAAAAAAAAFhpbmcAAAAPAAAAKAAADbAAAQEfHy4uLjMzOTk5Pz9CQkJISE9PT2ZmbW1tc"
        + "3N2dnZ6eoCAgImJlJSUo6OoqKiurrOzs7m5v7+/xMTKysrNzdHR0dXV2dnZ3Nzg4ODk5Ofn5+vr7+/v8/P09PT4+P7+/v//AAAAC"
        + "kxBTUUzLjEwMARIAAAAAAAAAAAVCCQCzCEAAZoAAA2wXtypYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//MUxAAAAAP8AUAAAACAS"
        + "QCQRgCASLq7//PExAsjqwbDH4dpIB1CMEAD6dTAceIh3ZSwkBKkv/gDUEnGWPf6boppjjHOHIAuAsH0EGMjxmOcpE8OeRA5gmYKe"
        + "CRoflaB40QTHmHMOl8RgYoXMFb3/SOjwUaLL7HAtYywQgSgviYEoaEv/+ipSKZcVTMDRMe5THoShocHAPApjgHgX///Wp//5fNwu"
        + "g2EuseMh+mJdpVnl7fQKJA0AAMYlm5M3efLtmZ5pmpiPi+lPeGNDVo8maLthyIjQOnQUKcHBPHPC86JxSY1y6Sw0DATakZLSWQIZ"
        + "YrmIrUZwslwgRZJ4umKZVMiKmpDSdZIgIBAhGatZYC1Qad7A3THKNEBeA2MjtLpeOEy8bhJn18nSyH7D0ntaktEyNiZI4eiqY/0r"
        + "M9ev67OOoMGn//2MgAZP//KICzT1ZkAcAABn2BbgANQeBkFvylb//5MjaS/orSRpfqp7X5xHv//0SZJEBsJ1NH+y1f//rMP/Q9PS"
        + "/WuqqizrYvGxSFbDjHaBBgs//OExO8p2wbjH5iYJOJ4qtwAAAd9gqwA9A7N6hlx3f+r/3X3TQsZD0l/+v9Y6gWlEMNm/6///zpn/"
        + "6f////uxsMqBiwYUAn2Az3CwB8FkFDf/6cw4y2nY4bOvdP/6hugHgOmr/3dL//+r//////1qGuBiuQGmggAAcDXgDv+Bjf///+kg"
        + "MUn//+cCbu//t//+pf//////RckRrGsX2oAAe4DfcOQAHqcv9fkAZ/czPTqellTejNNGFToMr//UZgJ//M0xPoSaqa7H8WYAWMG/"
        + "+v//6lf/////+pZEAHgTqoCCS0j+oDQP7J9Z/WgggdSUibTXdaisMiHVLL5RFjRIJ5fJFCmuQia//M0xOsOAqqqXhAoNIjQjPrPZ"
        + "tFdxg1xmTp2p1L9loLFCAD1Fbn2/TVe3//rX//////9h1hQxQa/b/YDeAGgAbtBQEACJhTQ//M0xO4LYqKkXAKm9bUQ42ig/jRkF"
        + "GZrOMIGC5Uy5EcPBywwRQCBzKjyEcTDDAixkUZIQOi5NK44/C80mmu3+all2fQkIUl+//MkxPsJ4qa0ngCa1JahVCjRgAozJgDMA"
        + "DFqTAkDYJjBnxYEAm4GADplB4wwhBKn//M0xPYNEqKmXgHanFFkGsGPGjp43yQxM06JcvIrQ+ymjPH5fNiEEwM7kzJIfjzAGoI3p"
        + "Jx8CiROuscgABwRW9uTOUAYgIky//NExPwUwqaaXGsnKAZAVClUdJKAsGRoAo1NgctjDQLeMvpImtYyhIBIWl+y1A4UFfQwYSOBB"
        + "2wQhH1NY0OHIgtYEIlcnRD5aili8Qh1QNoLjuAo6DhsYZKimsAqNyKF//OkxPxF4r6SXtY1yOh5Ibl8ELEVQSAMJyWB0vRoAJmRa"
        + "djNIAg6X9rrqYbUqwACcACOKgICPYPFjrprgWaVimlY1hv/Q9/rak6Ojdf/Wyklo//9JLRBSDdH7KU6P0bfo+pKjrbUl/baLmzJc"
        + "dCUUxFiSk1Ke1W0ucxEp0lH4CBHgS2HCIAfDygAfu3m0N//+NDP/9BFT///rH4DXzA+3+rf//1f//////TLgucLoi3oKuAAAMH4t"
        + "wAcPx1Dt////d/WpPf//6A6wgwi3/V///U3/r////6KKRdJcJgEDNUAB4H41wA+MHfXtVs3/s6e79///TLgBEldf/Z///1t///+v"
        + "9/61GZIBjhxagAB/gAOB5QAdxon18ix/////fqT//NExPcWaqLW/kNZHXV///Y3AVROK+rfu3//W///////sfJYMjDEertpfgd8w"
        + "JQAm4tHEMMSAc3UyVhQDjgIr6DEEHtN76ziJmkpTE2keNzhVQLpsYLJsyQTL5F5MIUN//M0xPALiqa2niglJP7/0CYIIFYFMpk+n"
        + "/X//qdWgimhQ3Qp7skymNzA0mCBoX01WW3QroHSkSwFHjIn15mIeoCQeFVAB/4y//MkxPwLWqauPggmGLeAVAP5OT0hhleGHOcFi"
        + "RHPH/hue6ablgXIlIcVqxnx7UeG//MkxPEK2qasngCk8OjfX/4zZwQDHQS1a02UyClKYcwgh4gAyhU6ygHJAsb2Bvcc//M0xOgLo"
        + "qaqXgBiiMGYIoeJguglEKFN1K/GZSLyOvDAAnAQUEoFQToRQ0Of///oMpBkNi+bm+sjD//84Mgaf/dhYAbnil3e//NUxPQZ+qqeX"
        + "0OYAIu5vYnYhYa3/hgUkTQAAbuDis9Wrqkaa0nWrVZfTbyuBdVBAYa4thFy0MsiUiSFmg3QYjY+i1I0L1B6pRLBsYECGuXSDEWJ8"
        + "mVlhFjInjcZkbw7gxidcxJJAmtaisRtFFSY5A7kbpKDEY+k//NkxPciswbDHZiYALnQacNMNyVK5FzE1dFSJiYjicnnyRMhBUiJ4"
        + "umubGJkmXVHUCmVRzjL/qXW31LQe51ILsHK//qFv//zMFgbqpiAgAAAi2g8gAGDweFyK1e1f//izCfb6m7f9TPq3WWTZ1Kb6/+iT"
        + "IfqARgypBTX/t//9ZgNd2/rUr////1E0MsDdxEc//OExO8qiwbjH5iIBLXgADug8APN6h3CZv///0evsmeZbt//1JkwBR5JJ/q1f"
        + "//zhKf/////+s4NcEEyfUoADa8GwAfCYHif/r9+6PW93Z0BsoHGa739f1oEPADIiCv+p///zIa7f9v////RSNSBAIgQM1UADUYDb"
        + "8OQAEwxD8wNP1CnjSf9Jbf9TKSOo2QSSL5QJl1s3qfo/uaA8hPo/60av//pkx//////7JmAmZk6/G//E3AF6vW/xXAiV21P//M0x"
        + "PcRGqa3H8WQATzz36up5+nn0lSILaN16NRv5kAD88l/6///yse///6000EKqy+9mXb2UakuJCoAD4ULfcH8AGIQif4h//M0xO0L2"
        + "qap/BAmGAvjGjs/WtkUdlooUlIsnZ9svkk6ls7qd2R/6hugVhw8//b/+ikkk5iPD//r3U/UlMS6zJLWpJKroF8X//M0xPgNSqagf"
        + "gKk4CBsw8PVHAtgA+DeGjf///+hglki///0x0Adjk2/1UF///5gO7//////qWZD5CRy6pUQwH/AHzxCf/////M0xP0PKqaiXgBmb"
        + "P6mLX///SBHjD/mMp1//+UFn/////+k04lAOAoDqgwHA9wA+JQd////+gUC6h///ogjgm2+1f///UZf//M0xPsPEp6sfgKavP///"
        + "+3+mOgWUaUCBwBoAPkoPP////qW5SHf///0gFWXH////+o9//////+gvB1VABkBgPsAPjgAKd3///M0xPkTCqaqXgBibP//1NF3/"
        + "//KwLhNv1N///1mX//////2L5MdEOBLSB8Ihf////+oHjZ///6zAIG/9////O///////j5K//M0xOcK0qakHgKm8MeVIOAMyB8aD"
        + "P////6KEn///WAzlf////qMv//////zo7Ug4HoQHyYz////+g8GW///zAD1O/7f//9S//MkxPYJ2qK0PgRU+P//////+VOqCQcCw"
        + "ID5dHr///9/Uw1C7///0gGSMP9v///J//MkxPEJqqKsXgHk5P//////x2oAQDgCBAfEIFv///1N8qobf///QA4mf////9f///Mkx"
        + "O0JIqKwXgRU+P/////MagFwOBvIB8zGA/////Wohf//84FOh/p///1J//////MkxOsJcqK4ngHa8P//oCoDBwLQwPhQsf////xXO"
        + "///6gEF93/p///6ajDAD5MG//MkxOgIkqKsPgHg8H////6GCz///nASdX/////9dRwH8uDah////7IJic///8vg//MkxOgH8p6wP"
        + "gHa8MBn7/////9SAD0AoVepE/8XwqrChgzJftMv/NjGih/1PRZI//MkxOsICqK0PgHa8MieM/YCokdCCEqCkwFm4UeF46akNIKKG"
        + "HJb/b/IqYF0EhE3//MkxO0IYqKoXgSE+P//pkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MkxO4IUp6sfgHa8Kqqq"
        + "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MkxO8IIp64fgNE+Kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
        + "qqqqqqq//MkxPEGUW60XgCU4Kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MUxPoFmW6oOAHa8Kqqqqqqqqqqq"
        + "qqq//MkxO4GKW6gGUBoAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//M0xPgQMcqoeYCgAKqqqqqqqqqqqqqqq"
        + "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MUxPIAAAP8AYAAAKqqqqqqqqqqqqqq";

    /* *********************** Utils ********************************** */

    function parseMzDate(dateString) {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function parseMzDateTime(dateTimeString) {
        const [date, time] = dateTimeString.split(' ');
        const [day, month, year] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }

    function generateUuidV4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    function filterHitsIsValid(hits) {
        return typeof hits === "number" && hits >= 0;
    }

    function hasDuplicates(array) {
        return new Set(array).size !== array.length;
    }

    function getSportType(doc = document) {
        const zone = doc.querySelector("a#shortcut_link_thezone");
        if (zone) {
            return zone.href.indexOf("hockey") > -1 ? "hockey" : "soccer";
        }
        return "soccer";
    }

    function getClubCurrency(doc) {
        const players = doc.getElementById("playerAltViewTable")?.querySelectorAll("tbody tr");
        if (players && players.length > 0) {
            const parts = players[0].querySelector("td:nth-child(3)")?.innerText.split(" ");
            return parts[parts.length - 1].trim();
        }
        return "";
    }

    function getNationalCurrency(doc) {
        // works for both domestic and foreign countries
        const playerNode = doc.getElementById("thePlayers_0")?.querySelector("table tbody tr:nth-child(6)");
        if (playerNode) {
            const parts = playerNode.innerText.split(" ");
            return parts[parts.length - 1].trim();
        }
        return "";
    }

    function extractTeamId(link) {
        const regex = /tid=(\d+)/;
        const match = regex.exec(link);
        return match ? match[1] : null;
    }

    function extractPlayerID(link) {
        const regex = /pid=(\d+)/;
        const match = regex.exec(link);
        return match ? match[1] : null;
    }

    function extractMatchID(link) {
        const regex = /mid=(\d+)/;
        const match = regex.exec(link);
        return match ? match[1] : null;
    }

    function extractPlayerIDFromTransferMonitor(link) {
        const regex = /u=(\d+)/;
        const match = regex.exec(link);
        return match ? match[1] : null;
    }

    function getPlayerIdFromContainer(player) {
        return player?.querySelector("h2 span.player_id_span")?.innerText;
    }

    function isMatchInProgress(resultText) {
        const scoreRegex = /\b(X|0|[1-9]\d*) - (X|0|[1-9]\d*)\b/;
        return !scoreRegex.test(resultText);
    }

    function getSquadSummaryLink(tid) {
        return `https://${location.hostname}/?p=players&sub=alt&tid=${tid}`;
    }

    function formatBigNumber(n, sep = " ") {
        if (n) {
            const numberString = n.toString();
            let formattedParts = [];
            for (let i = numberString.length - 1; i >= 0; i -= 3) {
                let part = numberString.substring(Math.max(i - 2, 0), i + 1);
                formattedParts.unshift(part);
            }
            return formattedParts.join(sep);
        }
        return "0";
    }

    function formatAverageAge(age, fractionDigits = 1) {
        if (age) {
            return age.toFixed(fractionDigits);
        }
        return "0.0";
    }

    function formatFileSize(b) {
        const s = 1024;
        let u = 0;
        while (b >= s || -b >= s) {
            b /= s;
            u++;
        }
        return (u ? b.toFixed(1) + " " : b) + " KMGTPEZY"[u] + "B";
    }

    function getClubPlayers(doc, currency) {
        const players = [];
        const playerNodes = doc.querySelectorAll("table#playerAltViewTable tr");
        for (const playerNode of playerNodes) {
            const age = playerNode.querySelector("td:nth-child(5)")?.innerText.replace(/\s/g, "");
            if (age) {
                const value = playerNode.querySelector("td:nth-child(3)")?.innerText.replaceAll(currency, "").replace(/\s/g, "");
                const shirtNumber = playerNode.querySelector("td:nth-child(0)")?.innerText.replace(/\s/g, "");
                const pid = playerNode.querySelector("a")?.href;
                players.push({
                    shirtNumber,
                    age: parseInt(age, 10),
                    value: parseInt(value, 10),
                    id: extractPlayerID(pid),
                });
            }
        }
        return players;
    }

    function getNumberOfFlags(infoTable) {
        const images = infoTable.getElementsByTagName("img");
        return images ? [...images].filter((img) => img.src.indexOf("/flags/") > -1).length : 0;
    }

    function isDomesticPlayer(infoTable) {
        return getNumberOfFlags(infoTable) === 1;
    }

    function getNationalPlayers(doc, currency) {
        const players = [];
        const playerNodes = doc.querySelectorAll("div.playerContainer");
        for (const playerNode of playerNodes) {
            const id = extractPlayerID(playerNode.querySelector("h2 a")?.href);
            const infoTable = playerNode.querySelector("div.dg_playerview_info table");
            const age = infoTable.querySelector("tbody tr:nth-child(1) td strong").innerText;
            const selector = isDomesticPlayer(infoTable) ? "tbody tr:nth-child(5) td span" : "tbody tr:nth-child(6) td span";
            const value = infoTable.querySelector(selector)?.innerText.replaceAll(currency, "").replace(/\s/g, "");
            players.push({
                age: parseInt(age, 10),
                value: parseInt(value, 10),
                id,
            });
        }
        return players;
    }

    function getNumberOfPlayers(players, ageLow = 0, ageHigh = 99) {
        return players.filter((player) => player.age <= ageHigh && player.age >= ageLow).length;
    }

    function filterPlayers(players, count = 0, ageLow = 0, ageHigh = 99) {
        if (players.length === 0) {
            return { values: 0, avgAge: 0.0 };
        }

        const n = count === 0 ? players.length : count;
        const filtered = players
            .filter((player) => player.age <= ageHigh && player.age >= ageLow)
            .sort((a, b) => b.value - a.value)
            .slice(0, n);
        if (filtered.length === 0) {
            return { values: 0, avgAge: 0.0 };
        }
        const values = filtered.map((player) => player.value).reduce((a, b) => a + b, 0);
        const avgAge = filtered.map((player) => player.age).reduce((a, b) => a + b, 0) / filtered.length;
        return { values, avgAge };
    }

    async function getNationalPlayersAndCurrency(tid, sport) {
        const url = `https://${location.hostname}/ajax.php?p=nationalTeams&sub=players&ntid=${tid}&sport=${sport}`;
        let players = [];
        let currency = '';
        await fetch(url)
            .then((resp) => resp.text())
            .then((content) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, "text/html");
                currency = getNationalCurrency(doc);
                players = getNationalPlayers(doc, currency);
            })
            .catch((error) => {
                console.warn(error);
            });
        return { players, currency };
    }

    async function getClubPlayersAndCurrency(tid) {
        const url = getSquadSummaryLink(tid);
        let players = [];
        let currency = '';
        await fetch(url)
            .then((resp) => resp.text())
            .then((content) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, "text/html");
                currency = getClubCurrency(doc);
                players = getClubPlayers(doc, currency);
            })
            .catch((error) => {
                console.warn(error);
            });
        return { players, currency };
    }

    async function getPlayersAndCurrency(tid, sport) {
        const url = getSquadSummaryLink(tid);
        const isNational = await fetch(url, { method: "HEAD" })
            .then((resp) => (resp.url.search("p=national_teams") > -1));
        return isNational ? await getNationalPlayersAndCurrency(tid, sport) : await getClubPlayersAndCurrency(tid);
    }

    function getClubTopPlyers(doc) {
        const currency = getClubCurrency(doc);
        const players = getClubPlayers(doc, currency);
        const sport = getSportType(doc);
        const count = sport === "soccer" ? 11 : 21;
        return players ? filterPlayers(players, count) : { values: 0, avgAge: 0 };
    }

    async function fetchPlayersProfileSummary(teamId) {
        const url = `https://${location.hostname}/?p=players&tid=${teamId}`;
        return await fetch(url)
            .then((resp) => {
                return resp.text();
            }).then((content) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, "text/html");
                const players = doc.getElementById("players_container")?.querySelectorAll("div.playerContainer");
                const info = {};
                for (const player of players) {
                    const playerId = player.querySelector("span.player_id_span")?.innerText;
                    const inMarket = [...player.querySelectorAll("a")].find((el) => el.href?.indexOf("p=transfer&sub") > -1);
                    info[playerId] = {
                        detail: player,
                        shared: !!player.querySelector("i.special_player.fa-share-alt"),
                        market: !!inMarket,
                        marketLink: inMarket?.href,
                    }
                }
                return info;
            }).catch((error) => {
                console.warn(error);
                return null;
            });
    }

    function squadGetPlayersInfo(players, sport = "soccer") {
        if (!players) {
            return [];
        }
        const rows = [];
        if (sport === "hockey") {
            {
                const all = filterPlayers(players);
                const top21 = filterPlayers(players, 21);
                rows.push({
                    title: "All",
                    count: players.length,
                    all: all.values,
                    allAge: all.avgAge,
                    top21: top21.values,
                    top21Age: top21.avgAge,
                });
            }
            {
                const all = filterPlayers(players, 0, 0, 23);
                const top21 = filterPlayers(players, 21, 0, 23);
                rows.push({
                    title: "U23",
                    count: getNumberOfPlayers(players, 0, 23),
                    all: all.values,
                    allAge: all.avgAge,
                    top21: top21.values,
                    top21Age: top21.avgAge,
                });
            }
            {
                const all = filterPlayers(players, 0, 0, 21);
                const top21 = filterPlayers(players, 21, 0, 21);
                rows.push({
                    title: "U21",
                    count: getNumberOfPlayers(players, 0, 21),
                    all: all.values,
                    allAge: all.avgAge,
                    top21: top21.values,
                    top21Age: top21.avgAge,
                });
            }
            {
                const all = filterPlayers(players, 0, 0, 18);
                const top21 = filterPlayers(players, 21, 0, 18);
                rows.push({
                    title: "U18",
                    count: getNumberOfPlayers(players, 0, 18),
                    all: all.values,
                    allAge: all.avgAge,
                    top21: top21.values,
                    top21Age: top21.avgAge,
                });
            }
        } else {
            {
                const all = filterPlayers(players);
                const top16 = filterPlayers(players, 16);
                const top11 = filterPlayers(players, 11);
                rows.push({
                    title: "All",
                    count: players.length,
                    all: all.values,
                    allAge: all.avgAge,
                    top16: top16.values,
                    top16Age: top16.avgAge,
                    top11: top11.values,
                    top11Age: top11.avgAge,
                });
            }
            {
                const all = filterPlayers(players, 0, 0, 23);
                const top16 = filterPlayers(players, 16, 0, 23);
                const top11 = filterPlayers(players, 11, 0, 23);
                rows.push({
                    title: "U23",
                    count: getNumberOfPlayers(players, 0, 23),
                    all: all.values,
                    allAge: all.avgAge,
                    top16: top16.values,
                    top16Age: top16.avgAge,
                    top11: top11.values,
                    top11Age: top11.avgAge,
                });
            }
            {
                const all = filterPlayers(players, 0, 0, 21);
                const top16 = filterPlayers(players, 16, 0, 21);
                const top11 = filterPlayers(players, 11, 0, 21);
                rows.push({
                    title: "U21",
                    count: getNumberOfPlayers(players, 0, 21),
                    all: all.values,
                    allAge: all.avgAge,
                    top16: top16.values,
                    top16Age: top16.avgAge,
                    top11: top11.values,
                    top11Age: top11.avgAge,
                });
            }
            {
                const all = filterPlayers(players, 0, 0, 18);
                const top16 = filterPlayers(players, 16, 0, 18);
                const top11 = filterPlayers(players, 11, 0, 18);
                rows.push({
                    title: "U18",
                    count: getNumberOfPlayers(players, 0, 18),
                    all: all.values,
                    allAge: all.avgAge,
                    top16: top16.values,
                    top16Age: top16.avgAge,
                    top11: top11.values,
                    top11Age: top11.avgAge,
                });
            }
        }
        return rows;
    }

    async function fetchDocument(url) {
        return await fetch(url)
            .then((resp) => resp.text())
            .then((content) => {
                const parser = new DOMParser();
                return parser.parseFromString(content, "text/html");
            })
            .catch((error) => {
                console.warn(error);
                return null;
            });
    }

    async function fetchJson(url) {
        return await fetch(url)
            .then((resp) => resp.json())
            .catch((error) => {
                console.warn(error);
                return null;
            });
    }

    async function fetchPlayerProfileDocument(playerId) {
        const url = `https://${location.hostname}/?p=players&pid=${playerId}`;
        return await fetchDocument(url);
    }

    async function fetchTransferMonitorData(sport = "soccer") {
        const url = `https://${location.hostname}/ajax.php?p=transfer&sub=your-bids&sport=${sport}`;
        return await fetchJson(url);
    }

    async function fetchSquadSummaryDocument(teamId) {
        const url = getSquadSummaryLink(teamId);
        return await fetchDocument(url);
    }

    /* *********************** DOM Utils ********************************** */

    function makeElementDraggable(element, dragHandleElement, dragEndCallback = null) {
        let deltaX = 0, deltaY = 0, lastX = 0, lastY = 0;

        dragHandleElement.style.cursor = "move";
        dragHandleElement.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            lastX = e.clientX;
            lastY = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // calculate the new cursor position:
            deltaX = lastX - e.clientX;
            deltaY = lastY - e.clientY;
            lastX = e.clientX;
            lastY = e.clientY;

            // set the element's new position:
            let newTop = Math.max(0, element.offsetTop - deltaY);
            let newLeft = Math.max(0, element.offsetLeft - deltaX);

            const { right, bottom, width, height } = element.getBoundingClientRect();
            if (right > window.innerWidth) {
                newLeft = window.innerWidth - width;
            }
            if (bottom > window.innerHeight) {
                newTop = window.innerHeight - height;
            }

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            if (dragEndCallback) {
                dragEndCallback();
            }
        }
    }

    function getMzButtonColorClass(color) {
        if (color) {
            if (color === "red") {
                return "button_red";
            } else if (color === "blue") {
                return "button_blue";
            } else if (color === "grey") {
                return "buttondiv_disabled";
            }
        }
        // green or other values
        return "button_account";
    }

    function createMzStyledButton(title, color = "", floatDirection = null) {
        const div = document.createElement("div");
        div.style.margin = "0.3rem";
        if (floatDirection) {
            // floatDirection: floatRight, floatLeft
            div.classList.add(floatDirection);
        }

        const button = document.createElement("div");
        button.classList.add("mzbtn", "buttondiv", getMzButtonColorClass(color));
        button.innerHTML = `<span class="buttonClassMiddle"><span style="white-space: nowrap">${title}</span></span><span class="buttonClassRight">&nbsp;</span>`;

        div.appendChild(button);
        return div;
    }

    function createMzStyledTitle(text = "") {
        const div = document.createElement("div");
        div.classList.add("win_bg");

        const title = document.createElement("h3");
        title.innerText = text;
        title.style.margin = "0.4rem auto";
        title.style.padding = "0 0.6rem";

        div.appendChild(title);
        return div;
    }

    function createSuggestionList(items) {
        const datalist = document.createElement("datalist");
        datalist.id = generateUuidV4();
        for (const item of items) {
            const option = document.createElement("option");
            option.value = item.toString();
            datalist.appendChild(option);
        }
        return datalist;
    }

    function createMenuTextInput(title = "input", placeholder = "example", datalistId = "") {
        const div = document.createElement("div");
        div.classList.add("mazyar-flex-container-row");
        div.style.justifyItems = "space-between";
        div.innerHTML = `
            <label style="margin: 0.5rem; font-weight: bold;">${title}: </label>
            <input list="${datalistId}" style="margin: 0.5rem;" type="text" value="" placeholder="${placeholder}">
        `;
        return div;
    }

    function createSubMenuTextInput(title = "input", placeholder = "example", initialValue = 0, style = {
        margin: "0.1rem 2.2rem",
        inputSize: "5px"
    }) {
        const div = document.createElement("div");
        div.classList.add("mazyar-flex-container-row");
        div.style.justifyItems = "space-between";
        div.style.margin = style?.margin ?? "0.1rem 2.2rem";
        div.innerHTML = `
            <label style="margin-left: 0.5rem;">${title}: </label>
            <input style="margin-left: 0.5rem;" type="text" size="${style?.inputSize ?? "5px"}" placeholder="${placeholder}", value="${initialValue}">
        `;
        return div;
    }

    function createMenuCheckBox(
        label,
        initialValue = true,
        style = {
            alignSelf: "flex-start",
            margin: "0.3rem 0.7rem",
        }
    ) {
        const id = generateUuidV4();

        const div = document.createElement("div");
        div.style.alignSelf = style?.alignSelf ?? "flex-start";
        div.style.margin = style?.margin ?? "0.3rem 0.7rem";

        const checkbox = document.createElement("input");
        checkbox.id = id;
        checkbox.type = "checkbox";
        checkbox.checked = initialValue;

        const labelElement = document.createElement("label");
        labelElement.htmlFor = id;
        labelElement.innerHTML = label;

        div.appendChild(checkbox);
        div.appendChild(labelElement);
        return div;
    }

    function createMenuGroup(title = "") {
        const group = document.createElement("div");
        group.classList.add("mazyar-flex-container");
        group.style.alignSelf = "flex-start";
        group.style.alignItems = "flex-start";
        group.style.margin = "0.2rem 0.6rem";
        const header = document.createElement("h4");
        header.innerText = title;
        header.style.margin = "0.3rem 0rem";
        group.appendChild(header);
        return group;
    }

    function appendOptionList(parent, options, selected) {
        // options = a object full of 'key: {value, label}'
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                const child = document.createElement("option");
                child.value = options[key].value;
                child.innerText = options[key].label;
                if (child.value === selected) {
                    child.selected = true;
                }
                parent.appendChild(child);
            }
        }
    }

    function createMenuDropDown(label, options, initialValue) {
        // options = a object full of 'key: {value, label}'
        // initialValue = one of the options.value

        const div = document.createElement("div");
        const labelElement = document.createElement("label");
        const dropdown = document.createElement("select");

        div.style.alignSelf = "flex-start";
        div.style.margin = "0.3rem 0.7rem";

        labelElement.innerText = label;
        labelElement.style.paddingRight = "0.5rem";

        appendOptionList(dropdown, options, initialValue);

        div.appendChild(labelElement);
        div.appendChild(dropdown);
        return div;
    }

    function createDeleteIcon(title) {
        const icon = document.createElement("span");
        icon.classList.add("mazyar-icon-delete");
        if (title) {
            icon.title = title;
        }
        return icon;
    }

    function createAddToDeadlineIcon(title, color) {
        const icon = createLegalIcon();
        icon.style.verticalAlign = "unset";
        icon.style.borderRadius = "50%";
        icon.style.border = "solid 1px";
        icon.style.padding = "3px";

        const span = document.createElement("span");
        span.style.color = color;
        span.classList.add("floatRight");
        if (title) {
            span.title = title;
        }
        span.appendChild(icon);
        return span;
    }

    function createDeleteButtonWithTrashIcon(title = "Delete") {
        const icon = createDeleteIcon();

        const text = document.createElement("span");
        text.innerText = title;

        const button = document.createElement("button");
        button.classList.add("mazyar-flex-container-row", "mazyar-button");
        button.style.margin = "0.6rem 0 0";

        button.appendChild(icon);
        button.appendChild(text);
        return button;
    }

    function filtersViewCreateTableHeader() {
        const tr = document.createElement("tr");

        const name = document.createElement("th");
        name.classList.add("header");
        name.innerText = "Name";
        name.title = "Filter' name";
        name.style.textAlign = "left";
        name.style.textDecoration = "none";
        name.style.width = "11rem";

        const totalHits = document.createElement("th");
        totalHits.classList.add("header");
        totalHits.innerText = "Total";
        totalHits.title = "Total hits founds for this filter";
        totalHits.style.textAlign = "center";
        totalHits.style.textDecoration = "none";

        const scoutHits = document.createElement("th");
        scoutHits.classList.add("header");
        scoutHits.innerText = "Scout";
        scoutHits.title = "Hits found after applying scout filters";
        scoutHits.style.textAlign = "center";
        scoutHits.style.textDecoration = "none";

        const tools = document.createElement("th");
        tools.classList.add("header");
        tools.innerHTML = " ";
        tools.style.textAlign = "center";
        tools.style.textDecoration = "none";

        tr.appendChild(tools);
        tr.appendChild(name);
        tr.appendChild(totalHits);
        tr.appendChild(scoutHits);

        const thead = document.createElement("thead");
        thead.appendChild(tr);
        return thead;
    }

    function startSpinning(element) {
        element.classList.add("fa-spin");
    }

    function stopSpinning(element) {
        element.classList.remove("fa-spin");
    }

    function filtersViewCreateTableBody(filters = []) {
        const tbody = document.createElement("tbody");

        for (const filter of filters) {
            const tr = document.createElement("tr");

            const filterName = filter.name.length > 32 ? filter.name.substring(0, 29) + "..." : filter.name;

            const name = document.createElement("td");
            name.innerHTML = `<a target="_blank" href="https://${location.hostname}/?p=transfer&mzy_filter_name=${filter.name}">${filterName}</a>`;
            name.title = filter.name.length > 32 ? `Filter's full name: ${filter.name}` : "Filter's name";

            const total = document.createElement("td");
            const scout = document.createElement("td");
            total.style.textAlign = "center";
            scout.style.textAlign = "center";

            mazyar.getFilterHitsFromIndexedDb(filter.id).then(({ totalHits, scoutHits }) => {
                total.innerText = filterHitsIsValid(totalHits) ? totalHits.toString() : "n/a";
                if (filter.scout) {
                    scout.innerHTML = `<a style="cursor: pointer;">${filterHitsIsValid(scoutHits) ? scoutHits.toString() : "n/a"}</a>`;
                } else {
                    scout.innerHTML = "X";
                }
            });

            if (filter.scout) {
                scout.onclick = () => {
                    const info = { name: filter.name, scout: filter.scout, count: scout.innerText };
                    mazyar.displayFilterResults(filter.id, info);
                };
            }

            const del = createDeleteIcon("Delete the filter permanently.");
            del.style.verticalAlign = "bottom";
            del.onclick = () => {
                mazyar.deleteFilter(filter.id);
                tbody.removeChild(tr);
                if (tbody.children.length === 0) {
                    tbody.parentNode.dispatchEvent(new Event("destroy"));
                }
            };

            const refresh = createRefreshIcon("Refresh filter hits.");
            refresh.style.fontSize = "1.1rem";
            refresh.onclick = async () => {
                startSpinning(refresh);
                total.replaceChildren(createLoadingIcon());
                scout.replaceChildren(createLoadingIcon());
                const { totalHits, scoutHits } = await mazyar.refreshFilterHits(filter.id);
                total.innerText = filterHitsIsValid(totalHits) ? totalHits.toString() : "n/a";
                if (filter.scout) {
                    scout.innerHTML = `<a style="cursor: pointer;">${filterHitsIsValid(scoutHits) ? scoutHits.toString() : "n/a"}</a>`;
                } else {
                    scout.innerHTML = "X";
                }
                stopSpinning(refresh);
            };

            const tools = document.createElement("td");
            tools.appendChild(del);
            tools.appendChild(refresh);

            tr.appendChild(tools);
            tr.appendChild(name);
            tr.appendChild(total);
            tr.appendChild(scout);
            tbody.appendChild(tr);
        }
        return tbody;
    }

    function filtersViewCreateTable(filters) {
        const table = document.createElement("table");
        const thead = filtersViewCreateTableHeader();
        const tbody = filtersViewCreateTableBody(filters);

        table.classList.add("mazyar-table", "tablesorter", "hitlist", "marker");
        table.style.margin = "0.5rem";

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    function createIconFromFontAwesomeClass(classes = [], title = "") {
        const icon = document.createElement("i");
        icon.classList.add(...classes);
        icon.setAttribute("aria-hidden", "true");
        icon.style.cursor = "pointer";
        if (title) {
            icon.title = title;
        }
        return icon;
    }

    function createMoveIcon(title) {
        return createIconFromFontAwesomeClass(["fa-solid", "fa-up-down-left-right"], title);
    }

    function createSharedIcon(title) {
        return createIconFromFontAwesomeClass(["fa", "fa-share-alt"], title);
    }

    function createMarketIcon(title) {
        return createIconFromFontAwesomeClass(["fa", "fa-legal"], title);
    }

    function createCogIcon(title = "") {
        return createIconFromFontAwesomeClass(["fa", "fa-cog"], title);
    }

    function createCommentIcon(title = "") {
        return createIconFromFontAwesomeClass(["fa-solid", "fa-comment"], title);
    }

    function createSearchIcon(title = "") {
        return createIconFromFontAwesomeClass(["fa", "fa-search"], title);
    }

    function createNoteIcon(title = "") {
        return createIconFromFontAwesomeClass(["fa-solid", "fa-note-sticky"], title);
    }

    function createRefreshIcon(title = "") {
        return createIconFromFontAwesomeClass(["fa", "fa-refresh"], title);
    }

    function createLegalIcon(title = "") {
        return createIconFromFontAwesomeClass(["fa", "fa-legal"], title);
    }

    function createTrashIcon(title = "") {
        return createIconFromFontAwesomeClass(["fas", "fa-trash"], title);
    }

    function createLoadingIcon(title = "") {
        const icon = createIconFromFontAwesomeClass(["fa", "fa-spinner", "fa-spin"], title);
        icon.style.cursor = "unset";
        return icon;
    }

    function createLoadingIcon2(title = "") {
        const icon = createIconFromFontAwesomeClass(["fa-solid", "fa-loader", "fa-pulse", "fa-fw"], title);
        icon.style.cursor = "unset";
        return icon;
    }

    function createToolbar() {
        const toolbar = document.createElement("div");
        const logo = document.createElement("span");
        const menu = createCogIcon("Settings");
        const note = createNoteIcon("Notebook");
        const separator = document.createElement("span");
        const transfer = document.createElement("div");
        const transferIcon = createSearchIcon("Transfer");
        const transferCount = document.createElement("span");

        toolbar.classList.add("mazyar-flex-container");
        toolbar.style.position = "fixed";
        toolbar.style.zIndex = "9998";
        toolbar.style.top = "40%";
        toolbar.style.right = "5px";
        toolbar.style.background = "black";
        toolbar.style.color = "white";
        toolbar.style.textAlign = "center";

        logo.innerText = "MZY";
        logo.style.fontSize = "0.6rem";
        logo.style.fontWeight = "bold";
        logo.style.margin = "2px";
        logo.style.padding = "1px";

        menu.style.fontSize = "large";
        transferIcon.style.fontSize = "large";
        note.style.fontSize = "large";
        note.style.marginTop = "5px";

        separator.innerText = "-------";
        separator.style.textAlign = "center";
        separator.style.fontSize = "0.6rem";
        separator.style.fontWeight = "bolder";
        separator.style.margin = "0";
        separator.style.padding = "0";

        transfer.classList.add("mazyar-flex-container");
        transfer.style.cursor = "pointer";

        transferCount.id = "mazyar-transfer-filter-hits";
        transferCount.innerText = "0";
        transferCount.style.fontSize = "0.6rem";
        transferCount.style.fontWeight = "bold";
        transferCount.style.margin = "1px 0";
        transferCount.style.padding = "1px";

        transfer.appendChild(transferIcon);
        transfer.appendChild(transferCount);

        toolbar.appendChild(logo);
        toolbar.appendChild(menu);
        toolbar.appendChild(note);
        toolbar.appendChild(separator);
        toolbar.appendChild(transfer);

        return { toolbar, menu, transfer, note };
    }

    function createDeadlineIndicator() {
        const div = document.createElement("div");
        const transferIcon = createLegalIcon();

        div.classList.add("mazyar-flex-container");
        div.style.position = "fixed";
        div.style.zIndex = "9997";
        div.style.top = "48%";
        div.style.right = "35px";
        div.style.color = "white";
        div.style.textAlign = "center";

        transferIcon.style.fontSize = "2rem";

        div.appendChild(transferIcon);

        return div;
    }

    /* *********************** Squad - Icons (Shared Skills & Transfer) ********************************** */

    function squadAddIconsHeaderToSummaryTable(table, ownView = false) {
        if (ownView) {
            const age = table.querySelector("thead tr th:nth-child(5) a");
            age.innerText = age.innerText[0];
            const born = table.querySelector("thead tr th:nth-child(6) a");
            born.innerText = born.innerText[0];
        }
        const th = document.createElement("th");
        th.style.width = "0px";
        const target = table.querySelector("thead tr th:nth-child(2)");
        target.parentNode.insertBefore(th, target);
    }

    function squadAddIconsBodyToSummaryTable(player, info) {
        const td = document.createElement("td");
        if (info.shared) {
            const icon = createSharedIcon("Click to see player profile.");
            icon.style.fontSize = "13px";
            icon.classList.add("special_player");
            icon.addEventListener("click", () => {
                mazyar.showPlayerInModal(info.detail);
            })
            td.appendChild(icon);
        }
        if (info.market) {
            const icon = createMarketIcon("Player is in Transfer Market.");
            icon.style.fontSize = "13px";
            icon.classList.add("special_player");
            const link = document.createElement("a");
            link.href = info.marketLink;
            link.target = "_blank";
            link.appendChild(icon);
            td.appendChild(link);
        }
        const target = player.querySelector("td:nth-child(2)");
        target.parentNode.insertBefore(td, target);
    }

    async function squadInjectIconsToSummaryTable(table) {
        const players = table?.querySelectorAll("tbody tr");
        const ownView = players?.[0]?.children?.length > 6;
        const text = document.createElement("div");
        text.innerHTML = `<b>MZY:</b> fetching players' info ...`;
        table.parentNode.insertBefore(text, table);

        const teamId = extractTeamId(document.baseURI);
        const playersInfo = await fetchPlayersProfileSummary(teamId);
        if (!playersInfo) {
            text.innerHTML = `<b>MZY:</b> fetching players' info ...<span style="color: red;"> failed</span>.`;
            return;
        }
        text.innerHTML = `<b>MZY:</b> fetching players' info ...<span style="color: green;"> done</span>.`;
        squadAddIconsHeaderToSummaryTable(table, ownView);
        for (const player of players) {
            const name = player.querySelector("a");
            const playerId = extractPlayerID(name?.href);
            squadAddIconsBodyToSummaryTable(player, playersInfo[playerId]);
        }
    }

    /* *********************** Squad - Residency ********************************** */

    function squadExtractResidencyDaysAndPrice(doc = document) {
        if (!doc) {
            return { days: 0, price: -1 };
        }
        const transfers = doc?.querySelector("div.baz > div > div.win_back > table.hitlist");
        const history = transfers?.querySelector("tbody");
        if (history?.children.length > 0) {
            const arrived = history?.lastChild?.querySelector("td")?.innerText;
            const days = Math.floor((new Date() - parseMzDate(arrived)) / 86_400_000);
            const price = history.lastChild?.querySelector("td:last-child")?.innerText;
            const currency = transfers?.querySelector("thead tr td:last-child")?.innerText?.match(/.*\((.*)\)/)?.[1];
            return { days, price: price + ' ' + currency };
        }
        return { days: -1, price: -1 };
    }

    function squadAddDaysAtThisClubToPlayerProfile() {
        if (mazyar.isDaysAtThisClubEnabledForPlayerProfiles()) {
            const { days } = squadExtractResidencyDaysAndPrice(document);
            const daysSpan = document.createElement("span");
            if (days >= 0) {
                const text = days === 0 ? 'N/A' : `≤ ${days}`;
                let dayColor = "black";
                if (days <= 28) {
                    dayColor = "red";
                } else if (days <= 70) {
                    dayColor = "darkgoldenrod";
                } else {
                    dayColor = "#FF00FF";
                }
                daysSpan.innerHTML = `<span style = "color: ${dayColor};font-size:14px">到队: <strong>${text}天</strong></span>`;
            }
            var regex = /player_id_(\d+)/;
            var allSpans = document.querySelectorAll('span.floatRight');
            allSpans.forEach(function(span) {
                if (regex.test(span.id)) {
                    span.before(daysSpan);
                }
            });
        }
    }


    /* *********************** Squad - Total Balls ********************************** */

    function squadSortPlayersByTotalSkillBalls(th) {
        const table = document.getElementById("playerAltViewTable");
        const players = table?.querySelectorAll("tbody tr");
        if (table.ascending) {
            table.ascending = false;
            const icon = th.querySelector("i");
            icon.classList.value = '';
            icon.classList.add("fa-solid", "fa-sort-down");
            icon.style.color = "#000";
            const rows = [...players].sort((a, b) => a.skillBalls - b.skillBalls);
            table.querySelector("tbody").replaceChildren(...rows);
        } else {
            table.ascending = true;
            const icon = th.querySelector("i");
            icon.classList.value = '';
            icon.classList.add("fa-solid", "fa-sort-up");
            icon.style.color = "#000";
            const rows = [...players].sort((a, b) => b.skillBalls - a.skillBalls);
            table.querySelector("tbody").replaceChildren(...rows);
        }
    }

    function squadAddTotalSkillBallsHeaderToSummaryTable(table) {
        const th = document.createElement("th");
        th.title = "Total Skill Balls";
        th.innerHTML = `<i aria-hidden="true" style="display: inline; font-size: 11px; color: #555;" class="fa-solid fa-sort"></i><span style="font-size: 11px;">T</span>`;
        th.style.textDecoration = "none";
        th.style.textAlign = "right";
        const target = table.querySelector("thead tr th:last-child");
        target.parentNode.insertBefore(th, target);

        th.addEventListener("click", () => {
            squadSortPlayersByTotalSkillBalls(th);
        });
    }

    function squadAddPlayerTotalSkillBallsToSummaryTable(player, sport) {
        let sum = 0;
        const start = sport === "soccer" ? 6 : 7;
        const end = 17;
        for (const skill of [...player.children].slice(start, end)) {
            sum += Number(skill.innerText);
        }
        const td = document.createElement("td");
        td.innerText = sum.toString();
        td.style.fontWeight = `${Math.ceil(900 * sum / 110)}`
        td.style.textAlign = "right";
        const target = player.querySelector("td:last-child");
        target.parentNode.insertBefore(td, target);
        player.skillBalls = sum;
    }

    function squadAddTotalSkillBallsToSummaryTable(table) {
        const sport = getSportType();
        const players = table?.querySelectorAll("tbody tr");
        if (players?.[0]?.children?.length > 6) {
            squadAddTotalSkillBallsHeaderToSummaryTable(table);
            for (const player of players) {
                squadAddPlayerTotalSkillBallsToSummaryTable(player, sport);
            }
        }
    }

    /* *********************** Squad - Top Players ********************************** */

    function squadCreateCompactElement(title, value) {
        const dd = document.createElement("dd");
        dd.innerHTML = `<span class="listHeadColor">${title}</span><span class="clippable">${value}</span>`;
        return dd;
    }

    function squadSummaryCreateCompactRow(row, currency = "USD", sport = "soccer") {
        const dl = document.createElement("dl");
        dl.classList.add("hitlist-compact-list", "columns");

        dl.appendChild(squadCreateCompactElement("Count", row.count));
        dl.appendChild(squadCreateCompactElement("Total", `${formatBigNumber(row.all)} ${currency}`));
        if (sport == "soccer") {
            dl.appendChild(squadCreateCompactElement("Top 16", `${formatBigNumber(row.top16)} ${currency}`));
            dl.appendChild(squadCreateCompactElement("Top 11", `${formatBigNumber(row.top11)} ${currency}`));
        } else {
            dl.appendChild(squadCreateCompactElement("Top 21", `${formatBigNumber(row.top21)} ${currency}`));
        }
        return dl;
    }

    function squadCreateTopPlayersTable(rows, currency = "USD", sport = "soccer") {
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");

        const titleHeader = document.createElement("th");
        titleHeader.classList.add("header");
        titleHeader.innerText = "Group";
        titleHeader.style.textAlign = "center";
        titleHeader.style.textDecoration = "none";

        const countHeader = document.createElement("th");
        countHeader.classList.add("header");
        countHeader.innerText = "Count";
        countHeader.title = "Number of Players";
        countHeader.style.textAlign = "center";
        countHeader.style.textDecoration = "none";

        const totalHeader = document.createElement("th");
        totalHeader.classList.add("header");
        totalHeader.innerHTML = "Total";
        totalHeader.title = "Total Value of Players";
        totalHeader.style.textAlign = "center";
        totalHeader.style.textDecoration = "none";

        tr.appendChild(titleHeader);
        tr.appendChild(countHeader);
        tr.appendChild(totalHeader);

        if (sport === "soccer") {
            const top16Header = document.createElement("th");
            top16Header.classList.add("header");
            top16Header.innerHTML = "Top 16";
            top16Header.title = "Value of Top 16 Players";
            top16Header.style.textAlign = "center";
            top16Header.style.textDecoration = "none";

            const top11Header = document.createElement("th");
            top11Header.classList.add("header");
            top11Header.innerHTML = "Top 11";
            top11Header.title = "Value of Top 11 Players";
            top11Header.style.textAlign = "center";
            top11Header.style.textDecoration = "none";

            tr.appendChild(top16Header);
            tr.appendChild(top11Header);
        } else {
            const top21Header = document.createElement("th");
            top21Header.classList.add("header");
            top21Header.innerHTML = "Top 21";
            top21Header.title = "Value of Top 21 Players";
            top21Header.style.textAlign = "center";
            top21Header.style.textDecoration = "none";

            tr.appendChild(top21Header);
        }
        thead.appendChild(tr);

        const tbody = document.createElement("tbody");
        for (const row of rows) {
            const title = document.createElement("td");
            title.innerHTML = `${row.title}`;
            title.classList.add("hitlist-compact-list-column");
            const compact = squadSummaryCreateCompactRow(row, currency, sport);

            title.appendChild(compact);

            const count = document.createElement("td");
            count.innerHTML = `${row.count}`;
            count.style.textAlign = "center";

            const all = document.createElement("td");
            all.innerText = `${formatBigNumber(row.all)} ${currency}`;
            all.style.textAlign = "end";

            const tr = document.createElement("tr");
            tr.appendChild(title);
            tr.appendChild(count);
            tr.appendChild(all);
            tbody.appendChild(tr);

            if (sport === "soccer") {
                const top16 = document.createElement("td");
                top16.innerText = `${formatBigNumber(row.top16)} ${currency}`;
                top16.style.textAlign = "end";

                const top11 = document.createElement("td");
                top11.innerText = `${formatBigNumber(row.top11)} ${currency}`;
                top11.style.textAlign = "end";

                tr.appendChild(top16);
                tr.appendChild(top11);
            } else {
                const top21 = document.createElement("td");
                top21.innerText = `${formatBigNumber(row.top21)} ${currency}`;
                top21.style.textAlign = "end";

                tr.appendChild(top21);
            }
        }

        const table = document.createElement("table");
        table.classList.add("mazyar-table", "tablesorter", "hitlist", "marker", "hitlist-compact-list-included");

        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    }

    function squadInjectTopPlayersTable(table) {
        const sport = getSportType(document);
        const currency = getClubCurrency(document);
        const players = getClubPlayers(document, currency);
        const summary = squadGetPlayersInfo(players, sport);
        const topPlayers = squadCreateTopPlayersTable(summary, currency, sport);
        topPlayers.style.marginBottom = "10px";

        const div = document.createElement("div");
        div.classList.add("mazyar-flex-container");
        div.appendChild(topPlayers);

        table.parentNode.insertBefore(div, table);
    }

    function squadInjectInformation(table) {
        squadAddTotalSkillBallsToSummaryTable(table);
        squadInjectIconsToSummaryTable(table);
        squadInjectTopPlayersTable(table);
    }

    function squadInjectInformationToSummary() {
        const target = document.getElementById('squad_summary');
        if (target) {
            if (target.style.display !== 'none') {
                // visiting squad summary directly
                const table = document.querySelector("table#playerAltViewTable");
                if (table && !table.injecting) {
                    table.injecting = true;
                    squadInjectInformation(table);
                }
            }

            // add observer if user changes from other tabs to squad summary tab
            const callback = () => {
                const table = document.querySelector("table#playerAltViewTable");
                if (table && !table.injecting) {
                    table.injecting = true;
                    squadInjectInformation(table);
                }
            };
            const observer = new MutationObserver(callback);
            const config = { childList: true, subtree: true };
            observer.observe(target, config);
        }
    }

    function squadInjectInformationToProfiles() {
        if (document.baseURI.search("/?players&pid=") > -1) {
            squadAddDaysAtThisClubToPlayerProfile();
            mazyar.addPlayerComment();
        } else {
            const target = document.getElementById('squad_profiles');
            if (target) {
                if (target.style.display !== 'none') {
                    // visiting profiles directly
                    const container = document.getElementById('players_container');
                    if (container && !container.injecting) {
                        container.injecting = true;
                        mazyar.squadAddDaysAtThisClubToAllPlayers(container);
                        mazyar.addPlayerComment();
                    }
                }

                // add observer if user changes from other tabs to squad profiles tab
                const callback = () => {
                    const container = document.getElementById('players_container');
                    if (container && !container.injecting) {
                        container.injecting = true;
                        mazyar.squadAddDaysAtThisClubToAllPlayers(container);
                        mazyar.addPlayerComment();
                    }
                };
                const observer = new MutationObserver(callback);
                const config = { childList: true, subtree: true };
                observer.observe(target, config);
            }
        }
    }

    /* *********************** Rankings ********************************** */

    function createSortableHeaderCell(cellText = "", options = { title: "", textAlign: "", marginBetween: "" }) {
        const cell = document.createElement("th");
        const sortIcon = document.createElement("i");
        const text = document.createElement("span");
        cell.appendChild(sortIcon);
        cell.appendChild(text);

        cell.style.textDecoration = "none";

        sortIcon.style.display = "inline";
        sortIcon.style.fontSize = "11px";
        sortIcon.style.color = "#555";
        sortIcon.classList.add("fa-solid", "fa-sort", "mazyar-sort-icon");
        sortIcon.setAttribute("aria-hidden", "true");

        text.style.fontSize = "11px";
        text.innerText = cellText;
        if (options?.marginBetween) {
            text.style.marginLeft = options.marginBetween;
        }

        if (options?.title) {
            cell.title = options.title;
        }
        if (options?.textAlign) {
            cell.style.textAlign = options.textAlign;
        }
        return cell;
    }

    function resetMazyarSortIcons(table) {
        const sortIcons = table.querySelectorAll("thead th i.mazyar-sort-icon");
        for (const icon of sortIcons) {
            icon.classList.value = '';
            icon.classList.add("fa-solid", "fa-sort", "mazyar-sort-icon");
        }
    }

    function rankingSortTeamsByKey(table, th, key) {
        resetMazyarSortIcons(table);
        const teams = table?.querySelectorAll("tbody tr");
        if (table.ascending) {
            table.ascending = false;
            const icon = th.querySelector("i");
            icon.classList.value = '';
            icon.classList.add("fa-solid", "fa-sort-down", "mazyar-sort-icon");
            icon.style.color = "#000";
            const rows = [...teams].sort((a, b) => a[key] - b[key]);
            table.querySelector("tbody").replaceChildren(...rows);
        } else {
            table.ascending = true;
            const icon = th.querySelector("i");
            icon.classList.value = '';
            icon.classList.add("fa-solid", "fa-sort-up", "mazyar-sort-icon");
            icon.style.color = "#000";
            const rows = [...teams].sort((a, b) => b[key] - a[key]);
            table.querySelector("tbody").replaceChildren(...rows);
        }
    }

    function rankingAddSquadHeaders(table) {
        const header = table.querySelector("thead tr");
        const value = createSortableHeaderCell("Value", { textAlign: "center", marginBetween: "3px" });
        const age = createSortableHeaderCell("Age", { textAlign: "center", marginBetween: "2px" });
        header.appendChild(value);
        header.appendChild(age);

        value.addEventListener("click", () => {
            rankingSortTeamsByKey(table, value, "topPlayersValue");
        });

        age.addEventListener("click", () => {
            rankingSortTeamsByKey(table, age, "topPlayersAge");
        });
    }

    async function rankingInjectTeamInfo(team) {
        const value = document.createElement("td");
        value.style.whiteSpace = "nowrap";
        value.style.textAlign = "center";
        value.replaceChildren(createLoadingIcon2());

        const age = document.createElement("td");
        age.style.whiteSpace = "nowrap";
        age.style.textAlign = "center";
        age.replaceChildren(createLoadingIcon2());

        team.appendChild(value);
        team.appendChild(age);

        team.topPlayersValue = 0;
        team.topPlayersAge = 0;

        const link = team.querySelector("td:nth-child(4) a");
        const teamId = extractTeamId(link?.href);
        const doc = await fetchSquadSummaryDocument(teamId);
        if (doc) {
            const currency = getClubCurrency(doc);
            ({ values: team.topPlayersValue, avgAge: team.topPlayersAge } = getClubTopPlyers(doc));
            value.innerHTML = `<strong>${formatBigNumber(team.topPlayersValue, ",")}</strong> ${currency}`;
            age.innerHTML = `<strong>${formatAverageAge(team.topPlayersAge)}</strong>`;
        }
    }

    async function rankingInjectSquadValue() {
        const table = document.getElementById("userRankTable");
        const teams = table.querySelectorAll("tbody tr");
        if (teams[0]?.childElementCount > 1) {
            rankingAddSquadHeaders(table);
            const jobs = [];
            for (const team of teams) {
                jobs.push(rankingInjectTeamInfo(team));
            }
            await Promise.all(jobs);
        }
    }

    /* *********************** Clash ********************************** */

    async function clashFetchAndTeamLeagueAndFlag(team) {
        const url = `https://${location.hostname}/?p=team&tid=${team.teamId}`;
        await fetch(url)
            .then((resp) => resp.text())
            .then((content) => {
                const parser = new DOMParser();
                return parser.parseFromString(content, "text/html");
            }).then((doc) => {
                const leagueRow = doc.querySelector("#infoAboutTeam > dd:nth-child(6)");
                const flag = leagueRow.querySelector("img");
                const seriesName = leagueRow.querySelector("span:last-child");
                team.querySelector("td.flag").appendChild(flag);
                team.querySelector("td.league").appendChild(seriesName);
            })
            .catch((error) => {
                console.warn(error);
            });
    }

    async function clashFetchAndUpdateTeamsInfo(team, mobileView) {
        if (!mobileView) {
            clashFetchAndTeamLeagueAndFlag(team);
        }

        const info = {
            currency: "",
            averageAge: 0,
        };
        const successful = await fetch(team.url)
            .then((resp) => resp.text())
            .then((content) => {
                const parser = new DOMParser();
                return parser.parseFromString(content, "text/html");
            }).then((doc) => {
                info.currency = getClubCurrency(doc);
                ({ values: team.topPlayersValue, avgAge: info.averageAge } = getClubTopPlyers(doc));
                return true;
            })
            .catch((error) => {
                console.warn(error);
                team.topPlayersAverageAge = 0;
                return false;
            });

        team.querySelector("td.value").innerHTML = successful
            ? `${formatBigNumber(team.topPlayersValue, ",")} ${info.currency}`
            : 'N/A';

        if (!mobileView) {
            team.querySelector("td.age").innerHTML = successful
                ? `<strong>${formatAverageAge(info.averageAge)}</strong>` :
                'N/A';
        }
        return successful;
    }

    function clashSortTeams(teams) {
        teams.sort((a, b) => b.topPlayersValue - a.topPlayersValue);
        let rank = 0;
        for (const team of teams) {
            rank++;
            team.className = rank % 2 ? "odd" : "even";
            const target = team.querySelector("button.mazyar-donut.rank");
            if (target) {
                target.classList.remove("mazyar-loading-donut");
                target.classList.add("mazyar-final-donut");
                target.innerText = `${rank}`;
            }
        }
        const newOrderWithPlayedMatches = [];
        for (const row of teams) {
            newOrderWithPlayedMatches.push(row);
            for (const playedMatch of row.playedMatches) {
                playedMatch.className = row.className;
                newOrderWithPlayedMatches.push(playedMatch);
            }
        }
        const tbody = document.querySelector("div.panel-2 table tbody");
        tbody.replaceChildren(...newOrderWithPlayedMatches);
    }

    async function clashCalculateRankOfTeams(teams, mobileView) {
        const jobs = [];
        for (const team of teams) {
            jobs.push(clashFetchAndUpdateTeamsInfo(team, mobileView));
        }
        const results = await Promise.all(jobs);
        if (results.every(Boolean)) {
            // data for all teams are fetched successfully
            clashSortTeams(teams);
        } else {
            // data for some teams are not fetched
            for (const team of teams) {
                const target = team.querySelector("button.mazyar-donut.rank");
                target.classList.remove("mazyar-loading-donut");
                target.classList.add("mazyar-final-donut");
                target.innerText = `-`;
            }
        }
    }

    function clashAddRankElements(team, mobileView) {
        if (!mobileView) {
            const league = document.createElement("td");
            league.style.whiteSpace = "collapse";
            league.style.width = "max-content";
            league.innerText = "";
            league.classList.add("league");
            league.style.textAlign = "center";
            team.insertBefore(league, team.firstChild);

            const flag = document.createElement("td");
            flag.style.width = "max-content";
            flag.innerText = "";
            flag.classList.add("flag");
            flag.style.textAlign = "center";
            team.insertBefore(flag, team.firstChild);

            const age = document.createElement("td");
            age.style.width = "max-content";
            age.innerText = "";
            age.classList.add("age");
            age.style.textAlign = "center";
            team.insertBefore(age, team.firstChild);
        }

        const value = document.createElement("td");
        value.style.width = "max-content";
        value.innerText = "";
        value.classList.add("value");
        value.style.textAlign = "right";
        team.insertBefore(value, team.firstChild);

        const rank = document.createElement("td");
        rank.style.width = "max-content";
        team.insertBefore(rank, team.firstChild);

        const button = document.createElement("button");
        button.innerText = "_";
        button.classList.add("mazyar-donut", "mazyar-loading-donut", "rank", "fix-width");
        button.title = "Click to see squad summary";
        rank.appendChild(button);
        button.onclick = () => {
            mazyar.displaySquadSummary(team.url);
        };
    }

    function clashInjectRanks() {
        const table = document.querySelector("table.hitlist.challenges-list");

        const headers = table.querySelector("thead tr");
        const mobileView = !headers;
        // mobile view has not headers section
        if (headers) {
            const league = document.createElement("th");
            league.style.textAlign = "center";
            league.innerText = "League";
            league.style.whiteSpace = "collapse";
            league.style.width = "11%";
            headers.insertBefore(league, headers.firstChild);

            const flag = document.createElement("th");
            flag.style.textAlign = "center";
            flag.innerText = "";
            flag.style.width = "2%";
            headers.insertBefore(flag, headers.firstChild);

            const age = document.createElement("th");
            age.style.textAlign = "center";
            age.innerText = "Age";
            age.title = "Average Age of Top Players";
            age.style.width = "4%";
            headers.insertBefore(age, headers.firstChild);

            const values = document.createElement("th");
            values.style.textAlign = "center";
            values.innerText = "Values";
            values.title = "Top Players Total Values";
            values.style.width = "13%";
            headers.insertBefore(values, headers.firstChild);

            const rank = document.createElement("th");
            rank.style.textAlign = "center";
            rank.innerText = "Rank";
            rank.title = "Team Rank in This Federation";
            rank.style.width = "3%";
            headers.insertBefore(rank, headers.firstChild);
        }

        const rows = table.querySelectorAll("tbody tr");
        for (const row of rows) {
            // in mobile view played challenges are also <tr> and for this rows, the team name is not a hyperlink
            const name = row.querySelector("a.team-name");
            if (name?.href) {
                // this is info row
                row.teamId = extractTeamId(name.href);
                row.url = getSquadSummaryLink(row.teamId);
                clashAddRankElements(row, mobileView);
                row.playedMatches = [];
            } else {
                // this is match row (in mobile view)
                // expand to match the previous row
                row.querySelector("td").colSpan = mobileView ? "3" : "6";
                row.previousSibling.playedMatches?.push(row);
            }
        }
        const teams = [...rows].filter((team) => team.url?.length > 0);
        clashCalculateRankOfTeams(teams, mobileView);
    }

    /* *********************** Federation Page ********************************** */

    function federationGetUsername(node) {
        return node?.querySelector("a")?.innerText;
    }

    async function federationUpdateMemberInfo(member, username, sport) {
        let values = 0;
        let currency = "";
        const teamXmlUrl = `https://${location.hostname}/xml/manager_data.php?username=${username}`;
        const { teamId, teamName } = await fetch(teamXmlUrl)
            .then((resp) => resp.text())
            .then((content) => {
                const parser = new DOMParser();
                return parser.parseFromString(content, "text/xml");
            }).then((doc) => {
                const teamId = doc.querySelector(`Team[sport="${sport}"]`).getAttribute("teamId");
                const teamName = doc.querySelector(`Team[sport="${sport}"]`).getAttribute("teamName");
                return { teamId, teamName };
            })
            .catch((error) => {
                console.warn(error);
                return { teamId: null, teamName: null };
            });
        if (teamId) {
            const squadUrl = getSquadSummaryLink(teamId);
            await fetch(squadUrl)
                .then((resp) => resp.text())
                .then((content) => {
                    const parser = new DOMParser();
                    return parser.parseFromString(content, "text/html");
                }).then((doc) => {
                    currency = getClubCurrency(doc);
                    values = getClubTopPlyers(doc).values;
                })
                .catch((error) => {
                    console.warn(error);
                });
        }

        const name = document.createElement("div");
        name.style.color = "blue";
        name.style.width = "100%";
        name.style.marginTop = "0.5em";
        name.title = teamName;
        name.innerHTML = `<strong style="color:black;">Team: </strong>${teamName.length > 20 ? teamName.substring(0, 16) + " >>>" : teamName}`;
        member.querySelector("td").appendChild(name);

        const value = document.createElement("div");
        value.style.color = "blue";
        value.style.width = "100%";
        value.style.marginTop = "0.5em";
        value.innerHTML = `<strong style="color:black;">Top${sport === "soccer" ? 11 : 21}: </strong>${formatBigNumber(values, ",")} ${currency}`;
        member.querySelector("td").appendChild(value);

        const separator = document.createElement("hr");
        separator.style.marginBottom = "-3px";
        member.querySelector("td").appendChild(separator);

        return {
            member,
            values,
            currency
        };
    }

    function federationGetTableHeader(target) {
        const thead = target.querySelector("thead td");
        return thead.innerText;
    }

    function federationSetTableHeader(target, text) {
        const thead = target.querySelector("thead td");
        thead.innerText = text;
    }

    async function federationSortTeamsByTopPlayers(target) {
        const sport = getSportType();
        const jobs = [];
        const tbody = target?.querySelector(" tbody");
        for (const member of tbody.children) {
            const username = federationGetUsername(member);
            if (username) {
                jobs.push(federationUpdateMemberInfo(member, username, sport));
            }
        }
        if (jobs.length > 0) {
            const tableHeader = federationGetTableHeader(target);
            let dots = 0;
            const loadingInterval = setInterval(() => {
                federationSetTableHeader(target, tableHeader + " " + ".".repeat(1 + (dots % 3)));
                dots++;
            }, 1000);
            const members = await Promise.all(jobs);
            clearInterval(loadingInterval);
            federationSetTableHeader(target, tableHeader + " ▼");

            members.sort((a, b) => b.values - a.values);
            const newOrder = members.map((t) => t.member);
            let rank = 0;
            for (const row of newOrder) {
                rank++;
                row.className = rank % 2 ? "odd" : "even";
            }
            tbody.replaceChildren(...newOrder);

            let totalValue = 0;
            for (const member of members) {
                totalValue += member.values;
            }
            const total = document.createElement("tr");
            total.style.color = "blue";
            total.style.textAlign = "center";
            total.style.width = "100%";
            total.innerHTML = `<td><strong style="color:black;">Total: </strong>${formatBigNumber(totalValue, ",")} ${members[0].currency}</td>`;
            tbody.appendChild(total);
        }
    }

    function federationFrontPage() {
        const content = document.getElementById('federation-content');
        if (content) {
            const target = document.getElementById("federation_clash_members_list");
            if (target && !target.topPlayersInjected) {
                target.topPlayersInjected = true;
                federationSortTeamsByTopPlayers(target);
            }

            const callback = () => {
                const target = document.getElementById("federation_clash_members_list");
                if (target && !target.topPlayersInjected) {
                    target.topPlayersInjected = true;
                    federationSortTeamsByTopPlayers(target);
                }
            };
            const observer = new MutationObserver(callback);
            const config = { childList: true, subtree: true };
            observer.observe(content, config);
        }
    }

    /* *********************** Match ********************************** */

    // ---------------- Top Players -------------

    function matchCreateTopPlayersHeader(sport = "soccer") {
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        const title = document.createElement("th");
        const count = document.createElement("th");
        const tops = document.createElement("th");
        const age = document.createElement("th");

        const playerCount = sport === "soccer" ? 11 : 21;

        title.classList.add("header");
        title.innerText = "Group";
        title.style.textAlign = "center";
        title.style.textDecoration = "none";

        count.classList.add("header");
        count.innerText = "Count";
        count.title = "Number of Players";
        count.style.textAlign = "center";
        count.style.textDecoration = "none";

        tops.classList.add("header");
        tops.innerHTML = `Top ${playerCount}`;
        tops.title = "Value of Top 11 Players";
        tops.style.textAlign = "center";
        tops.style.textDecoration = "none";

        age.classList.add("header");
        age.innerHTML = "Average Age";
        age.title = `Average Age of Top ${playerCount} Players`;
        age.style.textAlign = "center";
        age.style.textDecoration = "none";

        tr.appendChild(title);
        tr.appendChild(count);
        tr.appendChild(tops);
        tr.appendChild(age);
        thead.appendChild(tr);
        return thead;
    }

    function matchCreateTopPlayersBody(rows, currency = "USD", sport = "soccer") {
        const tbody = document.createElement("tbody");
        for (const row of rows) {
            const tr = document.createElement("tr");
            const title = document.createElement("td");
            const count = document.createElement("td");
            const top = document.createElement("td");
            const age = document.createElement("td");

            title.innerHTML = `${row.title}`;
            title.classList.add("hitlist-compact-list-column");

            count.innerHTML = `${row.count}`;
            count.style.textAlign = "center";

            top.style.textAlign = "end";

            age.style.textAlign = "center";

            if (sport === "soccer") {
                top.innerText = `${formatBigNumber(row.top11)} ${currency}`;
                age.innerText = `${formatAverageAge(row.top11Age)}`;
            } else {
                top.innerText = `${formatBigNumber(row.top21)} ${currency}`;
                age.innerText = `${formatAverageAge(row.top21Age)}`;
            }

            tr.appendChild(title);
            tr.appendChild(count);
            tr.appendChild(top);
            tr.appendChild(age);
            tbody.appendChild(tr);
        }
        return tbody;
    }

    function matchCreateSummaryTable(rows, currency = "USD", sport = "soccer") {
        const table = document.createElement("table");
        const thead = matchCreateTopPlayersHeader(sport);
        const tbody = matchCreateTopPlayersBody(rows, currency, sport);

        table.classList.add("mazyar-table", "tablesorter", "hitlist", "marker", "hitlist-compact-list-included");
        table.style.marginBottom = "10px";
        table.style.marginTop = "2em";

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    function matchInjectTopPlayersValues(players, team, currency, sport) {
        const summary = squadGetPlayersInfo(players, sport);
        const table = matchCreateSummaryTable(summary, currency, sport);

        const div = document.createElement("div");
        div.classList.add("mazyar-flex-container");

        div.appendChild(table);
        team.appendChild(div);
    }

    // ---------------- Lineup --------------------

    function matchGetLineupPlayers(teamNode, teamPlayers, sport) {
        const lineup = [];
        const teamPlayerIDs = teamPlayers.map((p) => p.id);
        const lineupPlayers = teamNode.querySelectorAll("tbody tr");

        for (const playerNode of lineupPlayers) {
            const pos = playerNode.querySelector("td:nth-child(2)");
            const order = Number(pos.querySelector("span").innerText);
            const pid = extractPlayerID(playerNode.querySelector("a").href);
            const playerInfo = {
                id: pid,
                order,
                exPlayer: !teamPlayerIDs.includes(pid),
                starting: sport === "hockey" || order < 12,
                value: teamPlayers.find((p) => p.id === pid)?.value ?? 0,
                age: teamPlayers.find((p) => p.id === pid)?.age,
            };

            const shirtNumber = playerNode.querySelector("td");
            if (playerInfo.starting) {
                shirtNumber.style.background = "lightgreen";
            }
            if (playerInfo.exPlayer) {
                shirtNumber.style.background = "#DD0000";
            }

            const value = document.createElement("td");
            value.innerText = `${playerInfo.value ? formatBigNumber(playerInfo.value, ",") : "N/A"}`;
            playerNode.appendChild(value);

            const age = document.createElement("td");
            age.innerText = `${playerInfo.age ?? "N/A"}`;
            playerNode.appendChild(age);

            lineup.push(playerInfo);
        }
        return lineup;
    }

    function matchInjectLineupValues(players, team, currency, sport) {
        const valueHeader = document.createElement("td");
        valueHeader.innerText = `Value`;
        valueHeader.title = `Player Value (in ${currency})`;
        team.querySelector("table thead tr:nth-child(2)").appendChild(valueHeader);
        team.querySelector("table tfoot tr td").colSpan += 1;

        const ageHeader = document.createElement("td");
        ageHeader.innerText = `Age`;
        ageHeader.title = `Player Age`;
        team.querySelector("table thead tr:nth-child(2)").appendChild(ageHeader);
        team.querySelector("table tfoot tr td").colSpan += 1;
        team.querySelector("table thead tr td").colSpan += 1;

        const lineupPlayers = matchGetLineupPlayers(team, players, sport).filter((player) => player.starting && !player.exPlayer);
        const value = lineupPlayers?.map((player) => player.value).reduce((a, b) => a + b, 0);
        let averageAge = lineupPlayers?.map((player) => player.age).reduce((a, b) => a + b, 0);
        if (averageAge) {
            averageAge /= lineupPlayers.length;
        }

        const div = document.createElement("div");
        div.innerHTML =
            `${sport === "soccer" ? "Starting " : ""}Lineup` +
            `<br>Value: <b>${formatBigNumber(value, ",")}</b> ${currency}` +
            `<br>Average Age: <b>${formatAverageAge(averageAge)}</b>` +
            `<br><br>Note: <span style="background:lightgreen">YYY</span>` +
            ` are ${sport === "soccer" ? "starting " : "current"} players and ` +
            `<span style="background:#DD0000">NNN</span> are ex-players.` +
            `<br>ex-player's value is N/A and not included in Lineup Value calculation.`;

        div.style.margin = "10px";
        div.style.padding = "5px";
        div.style.border = "2px solid green";
        div.style.borderRadius = "10px";
        const place = team.querySelector("table");
        team.insertBefore(div, place);
    }

    async function matchAddTopPlayersValue(team, sport) {
        const teamLink = team.querySelector("a").href;
        const tid = extractTeamId(teamLink);
        const { players, currency } = await getPlayersAndCurrency(tid, sport);
        matchInjectTopPlayersValues(players, team, currency, sport);
    }

    async function matchAddLineupValues(team, sport) {
        const teamLink = team.querySelector("a").href;
        const tid = extractTeamId(teamLink);
        const { players, currency } = await getPlayersAndCurrency(tid, sport);
        matchInjectLineupValues(players, team, currency, sport);
    }

    function matchInjectTeamValues() {
        const sport = getSportType();
        const teams = document.querySelectorAll("div.team-table");
        for (const team of teams) {
            if (team.querySelector("table")) {
                matchAddLineupValues(team, sport);
            } else {
                matchAddTopPlayersValue(team, sport);
            }
        }
    }

    /* ******************** In Progress Results ************************* */

    function matchGetWinner(context) {
        const h = Number(context.homeGoals);
        const a = Number(context.awayGoals);
        if (h > a) {
            return context.homeId;
        } else if (h < a) {
            return context.awayId;
        }
        return null;
    }

    function matchUpdateResult(result, context) {
        result.innerText = context.homeGoals + " - " + context.awayGoals;
        if ([context.homeId, context.awayId].includes(context.targetId)) {
            const winnerId = matchGetWinner(context);
            if (winnerId) {
                result.style.background = winnerId === context.targetId ? "#5D7F13" : "#930000";
                result.style.color = "#fff";
            } else {
                // equal
                result.style.background = "#F2D624";
                result.style.color = "#000";
            }
        } else {
            result.style.background = "coral";
            result.style.color = "#fff";
        }
    }

    function matchGetPossiblyInProgressMatches(section) {
        let days = 0;
        const possiblyInProgress = [];
        for (const child of [...section.children]) {
            const classes = [...child.classList];
            if (classes?.includes("odd")) {
                if (!child.updated) {
                    possiblyInProgress.push(child);
                }
            } else if (classes?.includes("group")) {
                days += 1;
                if (days == 3) {
                    break;
                }
            }
        }
        return possiblyInProgress;
    }

    function matchWaitAndInjectInProgressResults(timeout = 32000) {
        const step = 500;
        const interval = setInterval(() => {
            const matchesSection = document.getElementById("fixtures-results-list");
            if (matchesSection) {
                const games = matchesSection.querySelectorAll("dd.group");
                if (games.length > 0) {
                    matchAddInProgressResults(matchesSection);
                    clearInterval(interval);
                }
            } else {
                timeout -= step;
                if (timeout < 0) {
                    clearInterval(interval);
                }
            }
        }, step);
    }

    function matchAttachChangeEventToFilterForm() {
        const filterForm = document.getElementById("matchListForm");
        if (filterForm && !filterForm.eventAttached) {
            filterForm.eventAttached = true;
            // Note: when this event is fired, it is removed from the element or element is changed somehow.
            // so for now we will attach it again after each change event.
            filterForm.addEventListener("change", matchWaitAndInjectInProgressResults);
        }
    }

    function matchAddInProgressResults(section) {
        matchAttachChangeEventToFilterForm();
        const sport = getSportType();
        const matches = matchGetPossiblyInProgressMatches(section);
        // when you visit someone else fixture, this return its id
        let teamId = extractTeamId(document.baseURI);
        for (const match of matches) {
            const result = match.querySelector("dd.teams-wrapper a.score-shown");
            if (!isMatchInProgress(result.innerText)) {
                match.updated = true;
                continue;
            }
            const mid = extractMatchID(result.href);
            // this always returns your id
            const visitorId = extractTeamId(result.href);
            const url = `http://${location.hostname}/xml/match_info.php?sport_id=${sport === "soccer" ? 1 : 2}&match_id=${mid}`;
            GM_xmlhttpRequest({
                method: "GET",
                url,
                context: { match, result, teamId: teamId ?? visitorId },
                onload: function (resp) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(resp.responseText, "text/xml");
                    if (!xmlDoc.querySelector("ManagerZone_Error")) {
                        const home = xmlDoc.querySelector(`Team[field="home"]`);
                        const away = xmlDoc.querySelector(`Team[field="away"]`);
                        const context = {
                            homeGoals: home.getAttribute("goals"),
                            homeId: home.getAttribute("id"),
                            awayGoals: away.getAttribute("goals"),
                            awayId: away.getAttribute("id"),
                            targetId: resp.context.teamId,
                        };
                        matchUpdateResult(resp.context.result, context);
                    }
                    resp.context.match.updated = true;
                },
            });
        }
    }

    function matchInjectInProgressResults() {
        if (mazyar.mustDisplayInProgressResults()) {
            const fixturesLink = document.getElementById("matches_sub_nav")?.querySelector("div.flex-grow-0 span a");
            if (fixturesLink) {
                fixturesLink.addEventListener("click", matchWaitAndInjectInProgressResults);
                if ([...fixturesLink.classList].includes("selected")) {
                    const matchesSection = document.getElementById("fixtures-results-list");
                    if (matchesSection) {
                        matchAddInProgressResults(matchesSection);
                    }
                }
            }
        }
    }

    /* *********************** League ********************************** */

    function tableGetAgeLimit(url) {
        if (url.search("type=u23") > -1) {
            return 23;
        } else if (url.search("type=u21") > -1) {
            return 21;
        } else if (url.search("type=u18") > -1) {
            return 18;
        }
        return 99;
    }

    function tableGetValeTitle(sport = "soccer", age = 99) {
        const count = sport === "soccer" ? 11 : 21;
        if ([18, 21, 23].includes(age)) {
            return `Top ${count} - U${age}`;
        }
        return `Top ${count} - All`;
    }

    function tableGetAgeClass(age = 99) {
        if ([18, 21, 23].includes(age)) {
            return `values-u${age}`;
        }
        return "values-all";
    }

    function tableGetNextAge(age = 99) {
        if (age === 99) {
            return 23;
        } else if (age === 23) {
            return 21;
        } else if (age === 21) {
            return 18;
        }
        return 99;
    }

    function tableDisplayAgeInfo(team, ageLimit) {
        const target = team ?? document;
        target.querySelectorAll("td.mazyar-injected span")?.forEach((el) => {
            el.style.display = "none";
        });
        const ageClass = tableGetAgeClass(ageLimit);
        target.querySelectorAll("td.mazyar-injected span." + ageClass)?.forEach((el) => {
            el.style.display = "unset";
        });
    }

    function tableGetSquadSummaryUrl(team) {
        const teamLink = team.querySelector("td:nth-child(2) a:last-child")?.href;
        const tid = extractTeamId(teamLink);
        return getSquadSummaryLink(tid);
    }

    function tableModifyTeamInBodyForPcView(team, url) {
        const teamValue = document.createElement("td");
        team.appendChild(teamValue);
        const ageValue = document.createElement("td");
        team.appendChild(ageValue);

        teamValue.replaceChildren(createLoadingIcon2());
        teamValue.classList.add("mazyar-injected", "team-value");
        teamValue.title = "Click to see squad summary";
        teamValue.style.textAlign = "center";
        teamValue.style.whiteSpace = "nowrap";
        teamValue.style.padding = "auto 3px";
        teamValue.onclick = () => {
            mazyar.displaySquadSummary(url);
        };

        ageValue.replaceChildren(createLoadingIcon2());
        ageValue.classList.add("mazyar-injected", "age-value");
        ageValue.style.textAlign = "center";
        ageValue.style.whiteSpace = "nowrap";
        ageValue.style.padding = "auto 3px";
    }

    function tableAddTeamToBodyForMobileView(team, url) {
        const firstRow = team.cloneNode(true);
        team.parentNode.insertBefore(firstRow, team.nextSibling);

        const secondRow = document.createElement("tr");
        firstRow.parentNode.insertBefore(secondRow, firstRow.nextSibling);
        const value = document.createElement("td");
        const age = document.createElement("td");
        secondRow.appendChild(value);
        secondRow.appendChild(age);

        firstRow.children[0].rowSpan = "2";
        firstRow.children[1].rowSpan = "2";

        firstRow.classList.add("responsive-show", "mazyar-responsive-show");
        secondRow.classList.add("responsive-show", "mazyar-responsive-show");

        value.colSpan = "6";
        value.replaceChildren(createLoadingIcon2());
        value.classList.add("mazyar-injected", "team-value");
        value.title = "Click to see squad summary";
        value.style.textAlign = "center";
        value.style.whiteSpace = "nowrap";
        value.style.padding = "auto 3px";
        value.style.backgroundColor = "aquamarine";
        value.onclick = () => {
            mazyar.displaySquadSummary(url);
        };

        age.colSpan = "2";
        age.replaceChildren(createLoadingIcon2());
        age.classList.add("mazyar-injected", "age-value");
        age.style.textAlign = "center";
        age.style.whiteSpace = "nowrap";
        age.style.padding = "auto 3px";
        age.style.backgroundColor = "aqua";

        // modify borders to match the original view
        firstRow.style.borderBottom = "inherit";
        secondRow.style.borderBottom = team.style.borderBottom;

        return secondRow;
    }

    async function tableAddTeamTopPlayersInfo(team, ageLimit, sport) {
        const url = tableGetSquadSummaryUrl(team);

        // for mobile
        const mobileView = tableAddTeamToBodyForMobileView(team, url);

        // for pc
        team.classList.add("responsive-hide");
        tableModifyTeamInBodyForPcView(team, url);
        const pcView = team;

        const tid = extractTeamId(url);
        const { players, currency } = await getPlayersAndCurrency(tid, sport);

        const playersOfSport = sport === "soccer" ? 11 : 21;
        const all = filterPlayers(players, playersOfSport, 0, 99);
        const u23 = filterPlayers(players, playersOfSport, 0, 23);
        const u21 = filterPlayers(players, playersOfSport, 0, 21);
        const u18 = filterPlayers(players, playersOfSport, 0, 18);

        for (const view of [pcView, mobileView]) {
            const valueElement = view.querySelector("td.team-value");
            // prettier-ignore
            valueElement.innerHTML =
                `<span class="values-all" style="display:none">${formatBigNumber(all?.values)} ${currency}</span>` +
                `<span class="values-u23" style="display:none">${formatBigNumber(u23?.values)} ${currency}</span>` +
                `<span class="values-u21" style="display:none">${formatBigNumber(u21?.values)} ${currency}</span>` +
                `<span class="values-u18" style="display:none">${formatBigNumber(u18?.values)} ${currency}</span>`;
            valueElement.style.textAlign = "right";

            const ageElement = view.querySelector("td.age-value");
            // prettier-ignore
            ageElement.innerHTML =
                `<span class="values-all" style="display:none;">${formatAverageAge(all?.avgAge)}</span>` +
                `<span class="values-u23" style="display:none;">${formatAverageAge(u23?.avgAge)}</span>` +
                `<span class="values-u21" style="display:none;">${formatAverageAge(u21?.avgAge)}</span>` +
                `<span class="values-u18" style="display:none;">${formatAverageAge(u18?.avgAge)}</span>`;

            tableDisplayAgeInfo(view, ageLimit);
        }

    }

    function tableDisplayNextAgeInfo() {
        const headers = document.querySelectorAll("th.team-value-header");
        let changed = false;
        for (const header of headers) {
            header.age = tableGetNextAge(header.age);
            header.innerText = tableGetValeTitle(header.sport, header.age);
            if (!changed) {
                changed = true;
                tableDisplayAgeInfo(null, header.age);
            }
        }
    }

    function tableModifyHeaderForPcView(header, sport = "soccer", ageLimit = 99) {
        const firstRow = header.querySelector("tr");
        const value = document.createElement("th");
        firstRow.appendChild(value);
        const age = document.createElement("th");
        firstRow.appendChild(age);

        value.classList.add("responsive-hide", "team-value-header");
        value.style.textAlign = "center";
        value.innerText = tableGetValeTitle(sport, ageLimit);
        value.title = "Click to see other age limits";
        value.age = ageLimit;
        value.sport = sport;
        value.onclick = tableDisplayNextAgeInfo;

        age.classList.add("responsive-hide");
        age.style.textAlign = "center";
        age.innerText = `Age`;
        age.title = "Average Age Of the Top Players";
    }

    function tableAddHeaderForMobileView(mainHeader, sport = "soccer", ageLimit = 99) {
        const mobileHeader = mainHeader.cloneNode(true);
        mainHeader.parentNode.insertBefore(mobileHeader, mainHeader.nextSibling);
        const secondRow = document.createElement("tr");
        mobileHeader.appendChild(secondRow);
        const value = document.createElement("th");
        const age = document.createElement("th");
        secondRow.appendChild(value);
        secondRow.appendChild(age);

        mobileHeader.classList.add("responsive-show", "mazyar-responsive-show");

        const firstRow = mobileHeader.querySelector("tr");
        firstRow.children[0].rowSpan = "2";
        firstRow.children[1].rowSpan = "2";

        value.classList.add("team-value-header");
        value.colSpan = "6";
        value.style.textAlign = "center";
        value.innerText = tableGetValeTitle(sport, ageLimit);
        value.title = "Click to see other age limits";
        value.age = ageLimit;
        value.sport = sport;
        value.onclick = tableDisplayNextAgeInfo;
        value.style.backgroundColor = "aquamarine";

        age.colSpan = "2";
        age.style.textAlign = "center";
        age.innerText = `Age`;
        age.title = "Average Age Of the Top Players";
        age.style.backgroundColor = "aqua";
    }

    function tableInjectInProgressResults() {
        const sport = getSportType();
        const matches = document.querySelectorAll("table.hitlist.marker td > a");
        const inProgressMatches = [...matches].filter((match) => isMatchInProgress(match.innerText));
        for (const match of inProgressMatches) {
            const mid = extractMatchID(match.href);
            const url = `http://${location.hostname}/xml/match_info.php?sport_id=${sport === "soccer" ? 1 : 2}&match_id=${mid}`;
            GM_xmlhttpRequest({
                method: "GET",
                url,
                context: { match },
                onload: function (resp) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(resp.responseText, "text/xml");
                    if (!xmlDoc.querySelector("ManagerZone_Error")) {
                        const home = xmlDoc.querySelector(`Team[field="home"]`).getAttribute("goals");
                        const away = xmlDoc.querySelector(`Team[field="away"]`).getAttribute("goals");
                        resp.context.match.innerText = home + " - " + away;
                        resp.context.match.classList.add("mazyar-in-progress-result");
                    }
                },
            });
        }
    }

    function tableAddTopPlayersInfo(table) {
        const ageLimit = tableGetAgeLimit(document.baseURI);
        const sport = getSportType(document);
        const mainHeader = table.querySelector("thead");

        // for mobile
        tableAddHeaderForMobileView(mainHeader, sport, ageLimit);

        // for PC
        mainHeader.classList.add("responsive-hide");
        tableModifyHeaderForPcView(mainHeader, sport, ageLimit);

        const teams = table.querySelectorAll("tbody tr");
        for (const team of teams) {
            tableAddTeamTopPlayersInfo(team, ageLimit, sport);
        }
    }

    function tableWaitAndInjectTopPlayersInfo(timeout = 16000) {
        const step = 500;
        const interval = setInterval(() => {
            const table = document.querySelector("table.nice_table");
            if (table) {
                clearInterval(interval);
                if (!table.TopPlayersInfoInjected) {
                    table.TopPlayersInfoInjected = true;
                    if (mazyar.mustDisplayTopPlayersInTables()) {
                        tableAddTopPlayersInfo(table);
                    }
                    if (mazyar.mustDisplayInProgressResults()) {
                        tableInjectInProgressResults();
                    }
                }
            } else {
                timeout -= step;
                if (timeout < 0) {
                    clearInterval(interval);
                }
            }
        }, step);
    }

    function tableInjectTopPlayersToOfficialLeague() {
        // default sub-page (or tab) for leagues is Table. so try to inject team value after table is loaded
        tableWaitAndInjectTopPlayersInfo();

        // also add 'onclick' handler to Table tab
        const links = document.getElementsByTagName("a");
        for (const link of links) {
            if (["p=league", "sub=table"].every((text) => link.href.indexOf(text) > -1)) {
                link.onclick = tableWaitAndInjectTopPlayersInfo;
            }
        }
    }

    function tableInjectTopPlayersInfoToFriendlyLeague() {
        tableWaitAndInjectTopPlayersInfo();

        const links = document.getElementsByTagName("a");
        for (const link of links) {
            if (["p=friendlySeries", "sub=standings"].every((text) => link.href.indexOf(text) > -1)) {
                link.onclick = tableWaitAndInjectTopPlayersInfo;
            }
        }
    }

    function tableInjectTopPlayersInfoToCup() {
        tableWaitAndInjectTopPlayersInfo();

        const links = document.getElementsByTagName("a");
        for (const link of links) {
            if (["p=cups", "sub=groupplay"].every((text) => link.href.indexOf(text) > -1)) {
                link.onclick = tableWaitAndInjectTopPlayersInfo;
            }
        }
    }

    /* *********************** Schedule ********************************** */

    function scheduleClearAllColorings(teams) {
        teams.forEach((team) => {
            team.style.backgroundColor = team.originalColor;
        });
    }

    function scheduleResultColors(result) {
        if (result.length < 2) {
            return ["cyan", "cyan"];
        }
        if (result[0] === "X") {
            return ["cyan", "cyan"];
        }
        if (result[0] < result[1]) {
            return ["orangered", "lime"];
        } else if (result[0] > result[1]) {
            return ["lime", "orangered"];
        }
        return ["yellow", "yellow"];
    }

    function scheduleColorizeThisTeam(teams, selected) {
        teams.forEach((team) => {
            if (team.innerText === selected) {
                const tr = team.parentNode;
                const opponents = tr.querySelectorAll("td:nth-child(odd)");
                const result = tr.querySelector("td:nth-child(2)").innerText.split(" - ");
                const colors = scheduleResultColors(result);
                if (opponents[0].innerText === selected) {
                    opponents[0].style.setProperty("background-color", colors[0], "important");
                }
                if (opponents[1].innerText === selected) {
                    opponents[1].style.setProperty("background-color", colors[1], "important");
                }
            }
        });
    }

    function scheduleInjectColoring(tab) {
        let selected = "";
        const teams = tab.querySelectorAll("div.mainContent td:nth-child(odd)");
        for (const team of teams) {
            team.originalColor = team.style.backgroundColor;
            team.onclick = null;
            team.addEventListener("click", function (evt) {
                if (selected && selected !== this.innerText) {
                    // new team is selected
                    scheduleClearAllColorings(teams);
                    selected = "";
                }
                if (selected === this.innerText) {
                    // de-colorize
                    selected = "";
                    scheduleClearAllColorings(teams);
                } else {
                    // colorize
                    selected = this.innerText;
                    scheduleColorizeThisTeam(teams, selected);
                }
            });
        }
    }

    function scheduleHasDuplicateName(round) {
        const teams = round.querySelectorAll("td:nth-child(odd)");
        const names = [...teams].map((t) => t.innerText);
        return hasDuplicates(names);
    }

    function scheduleWaitAndInjectColoring(timeout = 16000) {
        const step = 500;
        const interval = setInterval(() => {
            const firstRound = document.querySelector("div[aria-labelledby='league_tab_schedule'] div.mainContent");
            if (firstRound) {
                const schedule = firstRound.parentNode;
                if (scheduleHasDuplicateName(firstRound)) {
                    const note = document.createElement("p");
                    note.innerHTML = `<b style="color: red;">Note: </b><span>Some teams have similar names. Coloring will not work as expected.</span>`;
                    note.style.fontSize = "1.2em";
                    schedule.insertBefore(note, schedule.firstChild);
                }
                clearInterval(interval);
                scheduleInjectColoring(schedule);
            } else {
                timeout -= step;
                if (timeout < 0) {
                    clearInterval(interval);
                }
            }
        }, step);
    }

    function scheduleInjectColoringToOfficialLeague() {
        const link = document.getElementById("league_tab_schedule");
        if (link) {
            const tab = link.parentNode;
            if (!tab.coloringInjected) {
                tab.coloringInjected = true;
                tab.onclick = scheduleWaitAndInjectColoring;
            }
        }
    }

    /* *********************** Transfer Agent ********************************** */

    function transferGetInputValue(el) {
        if (el.type == "checkbox") {
            return el.checked ? 1 : 0;
        }
        return el.value;
    }

    function transferGetSearchParams() {
        const inputs = document.getElementById("searchform")?.querySelectorAll("input,select");
        return [...inputs].map((el) => `&${el.name}=${transferGetInputValue(el)}`).join("");
    }

    function transferGetFilterNameFromUrl() {
        const url = new URL(document.URL);
        const params = new URLSearchParams(url.search);
        if (params.has("mzy_filter_name")) {
            return params.get("mzy_filter_name");
        }
        return null;
    }

    function transferLoadFilter(filterParams) {
        const url = new URL(`https://${location.hostname}/?${filterParams}`);
        const params = new URLSearchParams(url.search);
        for (const param of params) {
            const element = document.getElementById(param[0]);
            if (element) {
                if (element.type === "text") {
                    element.value = param[1];
                    element.dispatchEvent(new Event("blur"));
                } else if (element.type === "checkbox") {
                    element.checked = param[1] === "1";
                } else if (element.tagName === "SELECT") {
                    element.value = param[1];
                }
            }
        }
    }

    function transferInjectButtons(form) {
        const target = form.querySelector("div.buttons-wrapper.clearfix");
        if (target) {
            const filterButton = createMzStyledButton("MZY Filters", "red", "floatLeft");
            filterButton.style.margin = "0";
            filterButton.onclick = () => {
                document.getElementById("mazyar-transfer-filter-hits")?.click();
            };

            const saveButton = createMzStyledButton("MZY Save Filter", "blue", "floatLeft");
            saveButton.style.margin = "0";
            saveButton.onclick = () => {
                const params = transferGetSearchParams();
                mazyar.displayFilterSaveMenu(params);
            };

            target.appendChild(filterButton);
            target.appendChild(saveButton);
        }
    }

    function transferCreateScoutOptions() {
        const div = document.createElement("div");
        div.classList.add("mazyar-flex-container-row");
        div.style.justifyContent = "left";
        div.style.marginTop = "6px";

        const highs = document.createElement("div");
        highs.classList.add("mazyar-flex-container-row");
        highs.style.justifyContent = "left";
        highs.style.border = "1px inset black";
        highs.style.marginRight = "2rem";

        const lows = document.createElement("div");
        lows.classList.add("mazyar-flex-container-row");
        lows.style.justifyContent = "left";
        lows.style.border = "1px outset black";
        lows.style.marginRight = "2rem";

        const transferOptions = mazyar.getTransferOptions();
        const H4 = createMenuCheckBox("H4", transferOptions.H4, { margin: "auto 4px auto 1px" });
        const H3 = createMenuCheckBox("H3", transferOptions.H3, { margin: "auto 4px auto 1px" });
        const L2 = createMenuCheckBox("L2", transferOptions.L2, { margin: "auto 4px auto 1px" });
        const L1 = createMenuCheckBox("L1", transferOptions.L1, { margin: "auto 4px auto 1px" });
        const hide = createMenuCheckBox("Hide Others", transferOptions.hide, { margin: "auto 4px auto 1px" });

        H4.onclick = () => {
            mazyar.updateTransferOptions("H4", H4.querySelector("input[type=checkbox]").checked);
            mazyar.updateDisplayForTransferSearchResults(true);
        };

        H3.onclick = () => {
            mazyar.updateTransferOptions("H3", H3.querySelector("input[type=checkbox]").checked);
            mazyar.updateDisplayForTransferSearchResults(true);
        };

        L2.onclick = () => {
            mazyar.updateTransferOptions("L2", L2.querySelector("input[type=checkbox]").checked);
            mazyar.updateDisplayForTransferSearchResults(true);
        };

        L1.onclick = () => {
            mazyar.updateTransferOptions("L1", L1.querySelector("input[type=checkbox]").checked);
            mazyar.updateDisplayForTransferSearchResults(true);
        };

        hide.onclick = () => {
            mazyar.updateTransferOptions("hide", hide.querySelector("input[type=checkbox]").checked);
            mazyar.updateDisplayForTransferSearchResults(true);
        };

        highs.appendChild(H4);
        highs.appendChild(H3);
        lows.appendChild(L2);
        lows.appendChild(L1);
        div.appendChild(highs);
        div.appendChild(lows);
        div.appendChild(hide);
        div.appendChild(hide);
        return div;
    }

    function transferInject() {
        const form = document.getElementById("searchform");
        if (form) {
            const scoutOptions = transferCreateScoutOptions();
            form.parentNode.appendChild(scoutOptions);
            transferInjectButtons(form);
            const filterName = transferGetFilterNameFromUrl();
            if (filterName) {
                const filterParams = mazyar.getFilterParams(filterName);
                if (filterParams) {
                    setTimeout(() => {
                        transferLoadFilter(filterParams);
                        document.getElementById("searchb")?.click();
                    }, 5000);
                }
            }
        }
    }

    /* *********************** Monitor ********************************** */

    function monitorCreateSectionSeparator() {
        const tr = document.createElement("tr");
        tr.style.height = "10px";
        tr.innerHTML = '<td></td>';
        return tr;
    }

    function monitorCreateRowSeparator(color) {
        const tr = document.createElement("tr");
        tr.classList.add("mazyar-monitor-player-row");
        tr.style.height = "1px";
        tr.style.backgroundColor = color;
        tr.innerHTML = '<td></td>';
        return tr;
    }

    function monitorAddRowSeparator() {
        return [
            monitorCreateRowSeparator("#999999"),
            monitorCreateRowSeparator("#FFFFFF")
        ];
    }

    function monitorCreateSection(title, id) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><div id="${id}">
            <table width="100%" cellpadding="0" cellspacing="0">
            <tbody><tr>
            <td style="background-image: url(img/subheader_right.gif);">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody><tr>
                    <td class="subheader" valign="bottom">${title}</td>
                </tr></tbody>
                </table>
            </td>
            </tr></tbody>
            </table>
            </div></td>`;
        return tr;
    }

    function monitorClearPlayerRows(tbody) {
        const players = tbody.querySelectorAll(".mazyar-monitor-player-row");
        for (const player of players) {
            tbody.removeChild(player);
        }
    }

    function monitorCreatePlayerRow(
        player = { pid: "", name: "", deadline: 0, deadlineFull: "", latestBid: "", flag: "" },
        timeout = 0) {
        const tr = document.createElement("tr");
        tr.classList.add("mazyar-monitor-player-row");
        if (player.deadline <= timeout) {
            tr.classList.add("mazyar-deadline-monitor-throb");
        }
        tr.innerHTML = `
            <td valign="top" style="" width="100%">
            <table width="100%" border="0">
                <tbody>
                <tr style="height: 25px;">
                    <td colspan="2">
                    <table cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                        <tr>
                            <td width="220">
                            <table>
                                <tbody>
                                <tr>
                                    <td><img src="${player.flag}"></td>
                                    <td><a target="_blank", href="/?p=transfer&sub=players&u=${player.pid}">${player.name}</a></td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>
                            </td>
                            <td>
                            <table class="deadline-table">
                                <tbody>
                                <tr>
                                    <td><img src="img/icon_deadline.gif" width="13" height="15"></td>
                                    <td>${player.deadlineFull}</td>
                                </tr>
                                </tbody>
                            </table>
                            </td>
                            <td align="right">
                            <table border="0">
                                <tbody>
                                <tr>
                                    <td>Latest bid:</td>
                                    <td align="right" style="font-size: 11px; font-weight: bold;">${player.latestBid}</td>
                                    <td>&nbsp;</td>
                                </tr>
                                </tbody>
                            </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </td>
                </tr>
                </tbody>
            </table>
            </td>
       `;
        return tr;
    }

    /* *********************** Predictor ********************************** */

    async function getNationalRankings() {
        const rankings = [];
        const url = `https://${location.hostname}/?p=rank&sub=countryrank`;
        const resp = await fetch(url).catch((error) => {
            console.warn(error);
        });
        if (resp) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(await resp.text(), "text/html");
            const teams = doc.querySelectorAll("table#countryRankTable tbody tr");
            for (const team of teams) {
                const columns = team.querySelectorAll("td");
                let name = columns[2].innerText;
                if (name === 'United States') {
                    name = 'USA';
                }
                rankings.push({
                    name,
                    rank: Number(columns[0].innerText),
                })
            }
        }
        return rankings;
    }

    function predictorAttachInfo(match, teams, rankings) {
        teams[0].rank = rankings.find((t) => t.name.trim() === teams[0].name.trim())?.rank;
        teams[1].rank = rankings.find((t) => t.name.trim() === teams[1].name.trim())?.rank;
        teams[0].valueColor = (teams[0].value > teams[1].value) ? "blue" : "unset";
        teams[1].valueColor = (teams[1].value > teams[0].value) ? "blue" : "unset";
        teams[0].rankColor = (teams[0].rank < teams[1].rank) ? "blue" : "unset";
        teams[1].rankColor = (teams[1].rank < teams[0].rank) ? "blue" : "unset";

        const tbody = document.createElement("tbody");
        for (const team of teams) {
            tbody.innerHTML += `
            <td style="text-align:left;padding: 0; width: 100px;"><b>${team.name}</b></td>
            <td style="text-align:left;padding: 0;">[Rank: <b style="display:inline-block; width: 1.1rem; text-align:right; color: ${team.rankColor};">${team.rank ?? 'xx'}</b>]</td>
            <td style="text-align:right;padding: 0 4px;">[Value: <b style="color: ${team.valueColor};">${formatBigNumber(team.value)}</b> ${team.currency}]</td>
            `;
        }

        const table = document.createElement("table");
        table.appendChild(tbody);
        table.classList.add("mazyar-table");
        const div = document.createElement("div");
        div.appendChild(table);
        const target = match.querySelector("td");
        target.appendChild(div);
    }

    async function predictorInjectRecommendation(match, rankings) {
        const href = match.querySelector("td > a")?.href;
        const url = href.replace("&play=2d", "").replace("&type=2d", "");

        const sport = getSportType();
        const resp = await fetch(url).catch((error) => {
            console.warn(error);
        });
        if (resp) {
            const results = [];
            const parser = new DOMParser();
            const doc = parser.parseFromString(await resp.text(), "text/html");
            const teams = doc.querySelectorAll("div.team-table");
            for (const team of teams) {
                const link = team.querySelector("a");
                const name = link.innerText;
                const tid = extractTeamId(link.href);
                const { players, currency } = await getPlayersAndCurrency(tid, sport);
                const playersOfSport = sport === "soccer" ? 11 : 21;
                const all = filterPlayers(players, playersOfSport, 0, 99);
                results.push({
                    name,
                    value: all?.values,
                    currency: currency,
                })
            }
            predictorAttachInfo(match, results, rankings);
        }
    }

    async function predictorInject() {
        const rankings = await getNationalRankings();
        const matches = document.querySelectorAll("#match-predictor-container table.match-list tbody tr");
        const jobs = [];
        for (const match of matches) {
            jobs.push(predictorInjectRecommendation(match, rankings));
        }
        Promise.all(jobs);
    }

    /* *********************** Club Page ********************************** */

    function countTrophies(doc) {
        const trophies = doc.querySelectorAll("div.trophy-wrapper:not(.icon)");
        return [...trophies].map((el) => {
            const text = el.innerText.trim();
            return text ? Number(text) : 1;
        }).reduce((a, b) => a + b, 0);
    }

    async function getTrophiesCount(url) {
        const resp = await fetch(url).catch((error) => {
            console.warn(error);
            return 'N/A';
        });
        if (resp?.status === 200) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(await resp.text(), "text/html");
            return countTrophies(doc);
        }
        return 'N/A'
    }

    function getTrophiesSection() {
        const items = document.querySelectorAll("dl#trophies-achievements-lists dd");
        for (const item of items) {
            const link = item.querySelector("a");
            if (link?.href.search("awards") > -1) {
                return { trophies: item, url: link.href };
            }
        }
        return { trophies: null, url: null };
    }

    async function addTrophyCountToClubPage() {
        const { trophies, url } = getTrophiesSection();
        if (trophies) {
            const el = document.createTextNode(` (Total: ?)`);
            trophies.querySelector("span")?.appendChild(el);
            const count = await getTrophiesCount(url);
            el.nodeValue = ` (Total: ${count})`;
        }
    }

    /* *********************** Trainers ********************************** */

    function trainersAddColumns(table) {
        const headerRow = table.querySelector('thead tr');
        const thSalary = document.createElement('th');
        thSalary.textContent = 'Salary Range';
        thSalary.style.textAlign = 'center';
        thSalary.style.textDecoration = 'none';
        headerRow?.appendChild(thSalary);

        const thBonus = document.createElement('th');
        thBonus.textContent = 'Bonus';
        thBonus.style.textAlign = 'center';
        thBonus.style.textDecoration = 'none';
        headerRow?.appendChild(thBonus);

        const thWeeks = document.createElement('th');
        thWeeks.textContent = 'Weeks';
        thWeeks.style.textAlign = 'center';
        thWeeks.style.textDecoration = 'none';
        headerRow?.appendChild(thWeeks);

        const rows = table.querySelectorAll('tbody tr:not(.minified-view)');
        rows.forEach(row => {
            const salaryCell = row.insertCell(-1);
            salaryCell.style.textAlign = 'center';
            salaryCell.replaceChildren(createLoadingIcon2());

            const bonusCell = row.insertCell(-1);
            bonusCell.style.textAlign = 'center';
            bonusCell.replaceChildren(createLoadingIcon2());

            const weeksCell = row.insertCell(-1);
            weeksCell.style.textAlign = 'center';
            weeksCell.replaceChildren(createLoadingIcon2());
        });
    }

    function trainersFetchSalaryAndWeeks(coachId, salaryCell, bonusCell, weeksCell) {
        const url = `https://${location.hostname}/?p=trainers&sub=offer&extra=freeagent&cid=${coachId}`;
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: function (response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const salaryElement = doc.querySelector('td#salary_range nobr');
                const weeksElement = doc.querySelector('td#weeks_range nobr');
                const bonusElement = doc.querySelector("div#paper-content-wrapper > table  td.contract_paper:nth-child(2)");

                const salaryText = salaryElement?.innerText?.trim()?.match(/\d+(.*?\d+)* -(.*?\d+)+/g)?.[0];
                salaryCell.textContent = salaryText ?? 'N/A';
                salaryCell.style.fontStyle = 'normal';

                const weeksText = weeksElement?.innerText?.trim()?.match(/\d+(.*?\d+)* -(.*?\d+)+/g)?.[0];
                weeksCell.textContent = weeksText ?? 'N/A';
                weeksCell.style.fontStyle = 'normal';

                const bonusText = bonusElement?.innerText?.trim()?.match(/\d+(.*?\d+)*/g)?.[0];
                bonusCell.textContent = bonusText ?? 'N/A';
                bonusCell.style.fontStyle = 'normal';
            }
        });
    }

    function trainersUpdateSalariesAndWeeks(table) {
        trainersAddColumns(table);
        const rows = table?.querySelectorAll('tbody tr:not(.minified-view)');
        rows.forEach(row => {
            const linkElement = row.querySelector('td a[href*="cid="]');
            if (linkElement) {
                const urlParams = new URLSearchParams(linkElement.search);
                const coachId = urlParams.get('cid');
                const salaryCell = row.cells[row.cells.length - 3];
                const bonusCell = row.cells[row.cells.length - 2];
                const weeksCell = row.cells[row.cells.length - 1];
                trainersFetchSalaryAndWeeks(coachId, salaryCell, bonusCell, weeksCell);
            }
        });
    }

    function trainersAddRequestedSalaries() {
        const callback = () => {
            const table = document.getElementById("coaches_list");
            if (table && !table.injecting) {
                table.injecting = true;
                trainersUpdateSalariesAndWeeks(table);
            }
        };
        const target = document.querySelector('div.in_page_navigation_top');
        if (target) {
            const observer = new MutationObserver(callback);
            const config = { childList: true, subtree: true };
            observer.observe(target, config);
        }
    }

    /* *********************** Training Report ********************************** */

    function trainingOpenPlayerTrainingCamp(player) {
        player.querySelector('td.playerColumn a')?.click();
        const interval = setInterval(() => {
            const modal = document.querySelector("#lightbox_player_profile #players_container div.playerContainer");
            if (modal) {
                clearInterval(interval);
                modal.querySelector('div.box_dark.player_tc_package_information a')?.click();
            }
        }, 300);
    }

    function trainingInjectCampOpener(table) {
        const players = table.querySelectorAll("tbody tr");
        for (const player of players) {
            const campIcon = player.querySelector("td.dailyReportRightColumn img.content_middle");
            if (campIcon) {
                campIcon.style.cursor = "pointer";
                campIcon.addEventListener("click", () => {
                    trainingOpenPlayerTrainingCamp(player);
                });
            }
        }
    }

    function trainingAddCampOpenerToReport() {
        const callback = () => {
            const tables = document.querySelectorAll('#training_report > table');
            for (const table of tables) {
                if (!table.injecting) {
                    table.injecting = true;
                    trainingInjectCampOpener(table);
                }
            }
        };
        const target = document.getElementById('training_report');
        if (target) {
            const observer = new MutationObserver(callback);
            const config = { childList: true, subtree: true };
            observer.observe(target, config);
        }
    }

    function trainingAddDays() {
        const cssSelector = '#lightboxContent_player_profile #players_container';
        const callback = () => {
            const profile = document.querySelector(cssSelector);
            if (profile && !profile.daysInjected) {
                profile.daysInjected = true;
                mazyar.trainingAddDaysAtThisClubToPlayerProfile(profile);
            }
        }
        const target = document.body;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(callback);
        observer.observe(target, config);
    }

    /* *********************** Class ********************************** */

    class Mazyar {
        #modal = null; // dom element
        #content = null; // dom element
        #notebook = {
            element: null,
            text: "",
            style: {
                hide: true,
                top: 0,
                left: 0,
                width: 200,
                height: 250,
            }
        }
        #settings = {
            in_progress_results: true,
            top_players_in_tables: true,
            transfer: false,
            transfer_maxed: false,
            transfer_camp: false,
            mz_predictor: false,
            player_comment: false,
            coach_salary: false,
            deadline: {
                enabled: false,
                play_bell: false,
                timeout: 30,// minutes,
            },
            days: {
                display_in_profiles: false,
                display_in_transfer: false,
                display_in_training: false,
                display_for_one_clubs: false,
            }
        };
        #transferOptions = {
            hide: true,
            H4: false,
            H3: false,
            L2: false,
            L1: false,
        };
        #filters = { soccer: [], hockey: [] }; // each key is like [{id, name, params, scout, interval}]
        #sport = "soccer";
        #deadlines = {}; // {pid1: {name, deadline}, ...}
        #db;
        #deadlineLockAcquired;

        constructor() {
            this.#initializeIndexedDb("Mazyar");
            this.#fetchSettings();
            this.#fetchTransferOptions();
            this.#fetchFilters();

            this.#sport = getSportType();

            this.#createNotebook();
            this.#addToolbar();
            this.#createModal();

            this.#showChangelog();

            if (!this.isTransferFiltersEnabled()) {
                this.#resetTransferOptions();
            }
        }

        // -------------------------------- Settings -------------------------------------

        #fetchSettings() {
            this.#settings.in_progress_results = GM_getValue("display_in_progress_results", true);
            this.#settings.top_players_in_tables = GM_getValue("display_top_players_in_tables", true);
            this.#settings.transfer = GM_getValue("enable_transfer_filters", false);
            this.#settings.transfer_maxed = GM_getValue("display_maxed_in_transfer", false);
            this.#settings.transfer_camp = GM_getValue("display_camp_in_transfer", false);
            this.#settings.mz_predictor = GM_getValue("mz_predictor", false);
            this.#settings.player_comment = GM_getValue("player_comment", false);
            this.#settings.coach_salary = GM_getValue("coach_salary", true);
            this.#settings.deadline.enabled = GM_getValue("deadline", true);
            this.#settings.deadline.play_bell = GM_getValue("deadline_play_bell", false);
            this.#settings.deadline.timeout = GM_getValue("deadline_timeout", 30);
            this.#settings.days.display_in_profiles = GM_getValue("display_days_in_profiles", false);
            this.#settings.days.display_in_transfer = GM_getValue("display_days_in_transfer", false);
            this.#settings.days.display_in_training = GM_getValue("display_days_in_training", false);
            this.#settings.days.display_for_one_clubs = GM_getValue("display_days_for_one_clubs", false);
        }

        #saveSettings() {
            GM_setValue("display_in_progress_results", this.#settings.in_progress_results);
            GM_setValue("display_top_players_in_tables", this.#settings.top_players_in_tables);
            GM_setValue("enable_transfer_filters", this.#settings.transfer);
            GM_setValue("display_maxed_in_transfer", this.#settings.transfer_maxed);
            GM_setValue("display_camp_in_transfer", this.#settings.transfer_camp);
            GM_setValue("mz_predictor", this.#settings.mz_predictor);
            GM_setValue("player_comment", this.#settings.player_comment);
            GM_setValue("coach_salary", this.#settings.coach_salary);
            GM_setValue("deadline", this.#settings.deadline.enabled);
            GM_setValue("deadline_play_bell", this.#settings.deadline.play_bell);
            GM_setValue("deadline_timeout", this.#settings.deadline.timeout);
            GM_setValue("display_days_in_profiles", this.#settings.days.display_in_profiles);
            GM_setValue("display_days_in_transfer", this.#settings.days.display_in_transfer);
            GM_setValue("display_days_in_training", this.#settings.days.display_in_training);
            GM_setValue("display_days_for_one_clubs", this.#settings.days.display_for_one_clubs);
        }

        updateSettings(settings) {
            this.#settings = settings;
            this.#saveSettings();
            this.#resetTransferOptions();
            if (this.isTransferFiltersEnabled()) {
                this.#checkAllFilters(true);
            } else {
                this.#setFilterHitsInToolbar(0);
            }
        }

        mustDisplayInProgressResults() {
            return this.#settings.in_progress_results;
        }

        mustDisplayTopPlayersInTables() {
            return this.#settings.top_players_in_tables;
        }

        isTransferFiltersEnabled() {
            return this.#settings.transfer;
        }

        #isTransferCampEnabled() {
            return this.#settings.transfer_camp;
        }

        isDaysAtThisClubEnabledForPlayerProfiles() {
            return this.#settings.days.display_in_profiles;
        }

        #isDaysAtThisClubEnabledForTraining() {
            return this.#settings.days.display_in_training;
        }

        #isDaysAtThisClubEnabledForTransferMarket() {
            return this.#settings.days.display_in_transfer;
        }

        isDaysAtThisClubEnabledForOneClubPlayers() {
            return this.#settings.days.display_for_one_clubs;
        }

        mustHelpWithPredictor() {
            return this.#settings.mz_predictor;
        }

        #mustAddPlayerComment() {
            return this.#settings.player_comment;
        }

        mustAddCoachSalaries() {
            return this.#settings.coach_salary;
        }

        #isTransferDeadlineAlertEnabled() {
            return this.#settings.deadline.enabled;
        }

        #mustMarkMaxedSkills() {
            return this.#settings.transfer_maxed;
        }

        // -------------------------------- Database -------------------------------------

        async #initializeIndexedDb(name = "db") {
            this.#db = new Dexie(name);
            this.#db.version(1).stores({
                comment: "[sport+pid]",
                scout: "[sport+pid]",
                hit: "[fid+pid],deadline",
                filter: "&fid,totalHits,scoutHits,lastCheck",
            });
            this.#db.version(2).stores({
                scout: "[sport+pid],ts",
                player: "[sport+pid],ts,maxed,days,camp",
                hide: "[sport+pid],ts",
                deadline: "[sport+pid],ts,deadline,name,deadlineFull,latestBid,source,flag",
            }).upgrade(trans => {
                return trans.table("scout").toCollection().modify(report => {
                    report.ts = 0;
                });
            });
            this.#db.open();
            await this.#cleanOutdatedDataFromIndexedDb();
            const info = await navigator?.storage?.estimate();
            if (info) {
                console.log("ManagerZone IndexedDB size: " + formatFileSize(info.usage));
            }
        }

        async #cleanOutdatedDataFromIndexedDb() {
            const scoutOutdate = Date.now() - 7 * 24 * 60 * 60 * 1000;
            await this.#db.scout.where("ts").below(scoutOutdate).delete().then((deleteCount) => {
                console.log("Deleted " + deleteCount + " outdated scout reports");
            }).catch((error) => {
                console.warn(error);
            });

            const startOfDay = Date.now() - Date.now() % (24 * 60 * 60 * 1000);
            await this.#db.player.where("ts").below(startOfDay).delete().then((deleteCount) => {
                console.log("Deleted " + deleteCount + " outdated player profile.");
            }).catch((error) => {
                console.warn(error);
            });
        }

        async #clearIndexedDb() {
            // TODO: clear comments?
            await this.#db.scout.clear();
            await this.#db.hit.clear();
            await this.#db.filter.clear();
            await this.#db.player.clear();
            await this.#db.hide.clear();
            await this.#db.deadline.clear();
        }


        async #isPlayerInHideListInIndexDb(pid) {
            const player = await this.#db.hide.get({ pid, sport: this.#sport });
            return player?.ts > 0;
        }

        async #addPlayerToHideListInIndexDb(pid) {
            if (pid) {
                await this.#db.hide.put({ pid, sport: this.#sport, ts: Date.now() });
            }
        }

        async #addPlayerToDeadlineListInIndexDb(player = {
            pid: "",
            deadline: 0,
            name: "",
            deadlineFull: "",
            latestBid: "",
            source: "monitor",
            flag: "",
        }) {
            if (player?.pid) {
                this.#deadlines[player.pid] = { ...player };
                await this.#db.deadline.put({
                    sport: this.#sport,
                    ts: Date.now(),
                    pid: player.pid,
                    deadline: player.deadline,
                    name: player.name,
                    deadlineFull: player.deadlineFull,
                    latestBid: player.latestBid,
                    source: player.source,
                    flag: player.flag,
                });
            }
        }

        async #removePlayerFromDeadlineList(pid) {
            if (pid) {
                delete this.#deadlines[pid];
                await this.#db.deadline.delete([this.#sport, pid])
                    .catch((err) => console.warn(err));
            }
        }

        async #fetchDeadlinePlayersFromIndexedDb() {
            if (!this.#isTransferDeadlineAlertEnabled()) {
                return [];
            }
            return await this.#db.deadline.toArray()
                .then((players) => {
                    return players?.filter((player) => player.sport === this.#sport);
                }
                ).catch((err) => {
                    console.warn(err);
                    return [];
                });
        }

        async #deletePlayersFromHideListInIndexDb(days = 0) {
            const outdate = Date.now() - days * 24 * 60 * 60 * 1000;
            return await this.#db.hide.where("ts").below(outdate).delete().then((deleteCount) => {
                return deleteCount;
            }).catch((error) => {
                console.warn(error);
                return 0;
            });
        }

        async #countPlayersOfHideListInIndexDb() {
            return await this.#db.hide.where("ts").above(0).count();
        }

        async #fetchPlayerCommentFromIndexedDb(pid) {
            const player = await this.#db.comment.get({ pid, sport: this.#sport });
            return player?.comment ?? "";
        }

        async #setPlayerCommentInIndexedDb(pid, comment) {
            if (pid) {
                await this.#db.comment.put({ pid, sport: this.#sport, comment: comment ?? "" });
            }
        }

        async #fetchScoutReportFromIndexedDb(pid) {
            return await this.#db.scout.get({ pid, sport: this.#sport });
        }

        async #setScoutReportInIndexedDb(report) {
            if (report) {
                report.sport = this.#sport;
                report.ts = Date.now();
                await this.#db.scout.put(report);
            }
        }

        async #setHitInIndexedDb(filterId = "", playerId = "") {
            if (filterId && playerId) {
                await this.#db.hit.put({ fid: filterId, pid: playerId });
            }
        }

        async #removeHitFromIndexedDb(filterId = "", playerId = "") {
            if (filterId && playerId) {
                await this.#db.hit.delete([filterId, playerId]);
            }
        }

        async #removeAllHitsOfFilterFromIndexedDb(filterId = "") {
            if (filterId) {
                await this.#db.hit.where("fid").equals(filterId).delete();
            }
        }

        async #getHitsFromIndexedDb(filterId = "") {
            if (filterId) {
                return this.#db.hit.filter((hit) => hit.fid === filterId).toArray();
            }
            return [];
        }

        async #setFilterHitsInIndexedDb(filterId = "", totalHits = 0, scoutHits = -1) {
            if (filterId) {
                const item = {
                    fid: filterId,
                    totalHits,
                    scoutHits,
                    lastCheck: Date.now(),
                };
                await this.#db.filter.put(item);
            }
        }

        async getFilterHitsFromIndexedDb(filterId = "") {
            if (filterId) {
                const filter = await this.#db.filter.get(filterId);
                if (filter) {
                    return { totalHits: filter.totalHits, scoutHits: filter.scoutHits, lastCheck: filter.lastCheck };
                }
            }
            return { totalHits: -1, scoutHits: -1, lastCheck: Date.now() };
        }

        async #removeFilterFromIndexedDb(filterId = "") {
            await this.#db.filter.delete(filterId);
            await this.#removeAllHitsOfFilterFromIndexedDb(filterId);
        }

        async #removeAllFilterFromIndexedDb() {
            await this.#db.filter.clear();
            await this.#db.hit.clear();
        }

        #extractSkillNamesFromPlayerInfo(player) {
            const skills = player?.querySelectorAll("table.player_skills > tbody > tr > td > span.clippable");
            return [...skills].map((el) => el.innerText);
        }

        #extractStarsFromScoutReport(section) {
            return section.querySelectorAll(".stars i.lit")?.length;
        }

        #extractSkillsFromScoutReport(section, skillList) {
            const skills = section.querySelectorAll("div.flex-grow-1 ul li.blurred span");
            return [...skills].map((el) => skillList.indexOf(el.innerText));
        }


        async #fetchPlayerProfileFromIndexedDb(pid) {
            return await this.#db.player.get({ pid, sport: this.#sport });
        }

        async #setPlayerProfileInIndexedDb(profile) {
            if (profile) {
                profile.sport = this.#sport;
                profile.ts = Date.now();
                await this.#db.player.put(profile);
            }
        }

        #isSentToCamp(doc) {
            if (location.hostname.startsWith("test")) {
                return !!doc.querySelector(`#thePlayers_0 span.player_icon_wrapper i.fa-traffic-cone.tc-status-icon:not(.tc-status-icon--disabled)`);
            }
            return !!doc.querySelector(`#thePlayers_0 span.player_icon_image[style*="icon_trainingcamp_dg"]`);
        }

        async #extractPlayerProfile(playerId) {
            const doc = await fetchPlayerProfileDocument(playerId);
            if (doc) {
                const { days, price } = squadExtractResidencyDaysAndPrice(doc);
                const camp = this.#isSentToCamp(doc);
                const skills = doc.querySelectorAll("#thePlayers_0 table.player_skills tbody tr");
                let i = 0;
                const maxed = [];
                for (const skill of skills) {
                    if (skill.querySelector(".maxed")) {
                        maxed.push(i);
                    }
                    i++;
                }
                return {
                    pid: playerId,
                    maxed,
                    days,
                    price,
                    camp,
                };
            }
            return null;
        }

        async #fetchOrExtractPlayerProfile(playerId) {
            let profile = await this.#fetchPlayerProfileFromIndexedDb(playerId);
            if (!profile || (profile.days > 0 && !profile.price) || (profile.camp === undefined)) {
                profile = await this.#extractPlayerProfile(playerId);
                this.#setPlayerProfileInIndexedDb(profile);
            }
            return profile;
        }

        async #extractPlayerScoutReport(pid, skills) {
            const url = `https://${location.hostname}/ajax.php?p=players&sub=scout_report&pid=${pid}&sport=${this.#sport}`;
            const resp = await fetch(url).catch((error) => {
                console.warn(error);
            });
            if (resp) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(await resp.text(), "text/html");
                const report = doc.querySelectorAll(".paper-content.clearfix dl dd");
                if (report.length == 3) {
                    const high = this.#extractStarsFromScoutReport(report[0]);
                    const highSkills = this.#extractSkillsFromScoutReport(report[0], skills);
                    const low = this.#extractStarsFromScoutReport(report[1]);
                    const lowSkills = this.#extractSkillsFromScoutReport(report[1], skills);
                    const trainingSpeed = this.#extractStarsFromScoutReport(report[2]);
                    return {
                        pid,
                        H: high,
                        HS: highSkills,
                        L: low,
                        LS: lowSkills,
                        S: trainingSpeed,
                    };
                }
            }
            return null;
        }

        #colorizeMaxedSkills(player, maxed = []) {
            if (maxed) {
                const playerSkills = player.querySelectorAll("table.player_skills tr td.skillval span");
                for (const skill of maxed) {
                    playerSkills[skill].classList.add("maxed");
                }
            }
        }

        #colorizeSkills(player, report) {
            if (report) {
                const playerSkills = player.querySelectorAll("table.player_skills tr td:nth-child(1)");
                playerSkills[report.HS[0]]?.classList.add("mazyar-scout-h", `mazyar-scout-${report.H}`);
                playerSkills[report.HS[1]]?.classList.add("mazyar-scout-h", `mazyar-scout-${report.H}`);
                playerSkills[report.LS[0]]?.classList.add(`mazyar-scout-${report.L}`);
                playerSkills[report.LS[1]]?.classList.add(`mazyar-scout-${report.L}`);
            }
        }

        async #fetchOrExtractPlayerScoutReport(player) {
            const playerId = player.querySelector("h2 a")?.href?.match(/pid=(\d+)/)?.[1];
            let report = await this.#fetchScoutReportFromIndexedDb(playerId);
            if (!report) {
                const skills = this.#extractSkillNamesFromPlayerInfo(player);
                report = await this.#extractPlayerScoutReport(playerId, skills);
                if (report) {
                    this.#setScoutReportInIndexedDb(report);
                }
            }
            return report;
        }

        async #getPlayerScoutReportForSearchResult(players) {
            const jobs = [];
            for (const player of [...players.children]) {
                if (player.classList.contains("playerContainer") && player.querySelector("span.scout_report > a")) {
                    jobs.push(this.#fetchOrExtractPlayerScoutReport(player));
                }
            }
            const reports = await Promise.all(jobs);
            return reports.filter((report) => report != null);
        }


        #isQualifiedForTransferScoutFilter(report, lows = [], highs = []) {
            return highs.includes(report.H) && lows.includes(report.L);
        }

        #areTransferLowOptionsSelected() {
            return this.#transferOptions.L2 || this.#transferOptions.L1;
        }

        #areTransferHighOptionsSelected() {
            return this.#transferOptions.H4 || this.#transferOptions.H3;
        }

        #areTransferScoutOptionsSelected() {
            return this.#areTransferLowOptionsSelected() || this.#areTransferHighOptionsSelected();
        }

        #getAcceptableHighsAndLows() {
            let lows = [];
            let highs = [];

            if (this.#areTransferLowOptionsSelected()) {
                if (this.#transferOptions.L2) {
                    lows.push(2);
                }
                if (this.#transferOptions.L1) {
                    lows.push(1);
                }
            } else {
                lows = [1, 2, 3];
            }

            if (this.#areTransferHighOptionsSelected()) {
                if (this.#transferOptions.H4) {
                    highs.push(4);
                }
                if (this.#transferOptions.H3) {
                    highs.push(3);
                }
            } else {
                highs = [1, 2, 3, 4];
            }

            return { lows, highs };
        }

        #applyTransferFilters(report, lows, highs) {
            if (!this.#isQualifiedForTransferScoutFilter(report, lows, highs)) {
                const player = document.getElementById(`player_id_${report.pid}`);
                if (player) {
                    const playerContainer = player.parentNode.parentNode.parentNode;
                    if (this.#transferOptionsMustHide()) {
                        playerContainer.classList.add("mazyar-hide");
                    } else {
                        playerContainer.classList.add("mazyar-dim-60");
                    }
                }
            }
        }

        #clearTransferFilters() {
            document.querySelectorAll(".mazyar-hide")?.forEach((el) => {
                el.classList.remove("mazyar-hide");
            });
            document.querySelectorAll(".mazyar-dim-50")?.forEach((el) => el.classList.remove("mazyar-dim-50"));
            document.querySelectorAll(".mazyar-dim-60")?.forEach((el) => el.classList.remove("mazyar-dim-60"));
        }

        #doesTransferNeedPlayerProfile() {
            return this.#isDaysAtThisClubEnabledForTransferMarket() || this.#mustMarkMaxedSkills() || this.#isTransferCampEnabled();
        }

        #addCampIconToTransferProfile(player, isSent) {
            if (player.campInjected) {
                return;
            }
            player.campInjected = true;
            const camp = document.createElement("tr");

            const label = document.createElement("td");
            label.innerText = "Camp Status:";

            const status = document.createElement("td");
            status.innerHTML = `<img style="height:1rem; border: solid 1px;" src="nocache-904/img/player/icon_trainingcamp_${isSent ? "dg" : "bw"}.png">`

            camp.appendChild(label);
            camp.appendChild(status);

            const target = player.querySelector("div.floatLeft table td:nth-child(2) > table tbody");
            target?.appendChild(camp);
        }

        async #updateProfileRelatedFieldsInTransfer(player) {
            const playerId = getPlayerIdFromContainer(player);
            await this.#fetchOrExtractPlayerProfile(playerId).then((profile) => {
                if (this.#isDaysAtThisClubEnabledForTransferMarket()) {
                    this.#squadAddDaysAtThisClubForSinglePlayer(player, profile, true);
                }
                if (this.#mustMarkMaxedSkills()) {
                    this.#colorizeMaxedSkills(player, profile?.maxed);
                }
                if (this.#isTransferCampEnabled()) {
                    this.#addCampIconToTransferProfile(player, profile?.camp);
                }
            });
        };

        async #hidePlayerAccordingToHideList(player) {
            const playerId = getPlayerIdFromContainer(player);
            if (await this.#isPlayerInHideListInIndexDb(playerId)) {
                player.style.display = 'none';
            }
        }

        #addHideButtonToPlayerInTransferMarket(player) {
            if (player.hideButtonInjected) {
                return;
            }
            player.hideButtonInjected = true;
            const playerId = getPlayerIdFromContainer(player);
            const hideIcon = createDeleteIcon("Hide player from search result.");
            hideIcon.classList.add("floatRight");
            hideIcon.style.marginTop = "0.2rem";
            player.querySelector("h2.clearfix div")?.appendChild(hideIcon);

            hideIcon.addEventListener("click", () => {
                this.#addPlayerToHideListInIndexDb(playerId);
                player.style.display = 'none';
            });
        }

        async #processTransferSearchResults(results) {
            const { lows, highs } = this.#getAcceptableHighsAndLows();
            const players = [...results.children].filter((player) => player.classList.contains("playerContainer"));
            const deadlines = await this.#fetchDeadlinePlayersFromIndexedDb();
            const jobs = [];
            for (const player of players) {
                this.#addHideButtonToPlayerInTransferMarket(player);
                if (this.#isTransferDeadlineAlertEnabled()) {
                    this.#addDeadlineButtonToPlayerInTransferMarket(player, deadlines);
                }
                jobs.push(this.#hidePlayerAccordingToHideList(player));
                if (this.#doesTransferNeedPlayerProfile()) {
                    jobs.push(this.#updateProfileRelatedFieldsInTransfer(player));
                }
                if (this.#areTransferScoutOptionsSelected()) {
                    if (player.querySelector("span.scout_report > a")) {
                        jobs.push(this.#fetchOrExtractPlayerScoutReport(player).then((report) => {
                            this.#colorizeSkills(player, report);
                            this.#applyTransferFilters(report, lows, highs);
                        }));
                    } else {
                        const className = this.#transferOptionsMustHide() ? "mazyar-hide" : "mazyar-dim-50";
                        player.classList.add(className);
                    }
                }
            }
            await Promise.all(jobs);
        }

        #mustUpdateDisplayForTransferSearchResults() {
            return this.#areTransferScoutOptionsSelected() || this.#doesTransferNeedPlayerProfile();
        }

        async updateDisplayForTransferSearchResults(clear = false) {
            if (clear) {
                this.#clearTransferFilters();
            }
            if (this.#mustUpdateDisplayForTransferSearchResults()) {
                const results = document.getElementById("players_container");
                if (results) {
                    await this.#processTransferSearchResults(results);
                }
            }
        }

        #injectHideButtonToTransferMarket() {
            const target = document.querySelector("#searchform div.buttons-wrapper.clearfix");
            if (target) {
                const hideButton = createMzStyledButton("MZY Hide", "red", "floatLeft");
                hideButton.style.margin = "0";
                hideButton.onclick = () => {
                    this.#displayTransferHideMenu();
                };
                target.appendChild(hideButton);
            }
        }

        async executeTransferTasks() {
            this.#injectHideButtonToTransferMarket();
            this.updateDisplayForTransferSearchResults();

            const callback = (mutationsList) => {
                if (mutationsList.find(mutation => mutation.type == "childList")) {
                    this.updateDisplayForTransferSearchResults();
                }
            };
            const target = document.getElementById("players_container");
            if (target) {
                const observer = new MutationObserver(callback);
                const config = { childList: true };
                observer.observe(target, config);
            }
        }

        #getSelectedScoutsOptionText() {
            const texts = [];
            const options = this.getTransferOptions();
            if (options.H4) {
                texts.push('<span class="mazyar-scout-4">H4<span>');
            }
            if (options.H3) {
                texts.push('<span class="mazyar-scout-3">H3<span>');
            }
            if (options.L2) {
                texts.push('<span class="mazyar-scout-2">L2<span>');
            }
            if (options.L1) {
                texts.push('<span class="mazyar-scout-1">L1<span>');
            }
            return texts.join(", ");
        }

        #getSelectedScoutsOptionTextForFilter(scout) {
            const texts = [];
            if (scout.high.includes(4)) {
                texts.push('<span class="mazyar-scout-4">H4<span>');
            }
            if (scout.high.includes(3)) {
                texts.push('<span class="mazyar-scout-3">H3<span>');
            }
            if (scout.low.includes(2)) {
                texts.push('<span class="mazyar-scout-2">L2<span>');
            }
            if (scout.low.includes(1)) {
                texts.push('<span class="mazyar-scout-1">L1<span>');
            }
            return texts.join(", ");
        }

        #monitorCreateNoPlayerWarning() {
            const warning = document.createElement("div");
            warning.classList.add("mazyar-monitor-player-row");
            warning.innerText = "No players have been added to the MZY Deadline Monitor.";
            warning.style.padding = "1rem 0.5rem 0";
            return warning;
        }

        #monitorAddPlayers(tbody, players) {
            monitorClearPlayerRows(tbody);
            if (players.length === 0) {
                const warning = this.#monitorCreateNoPlayerWarning();
                tbody.appendChild(warning);
                return;
            }

            for (const player of players) {
                const row = monitorCreatePlayerRow(player, this.#settings.deadline.timeout);
                const removeIcon = createAddToDeadlineIcon("Remove player from MZY Deadline Monitor", "red");
                removeIcon.style.fontSize = "11px";
                row.querySelector("table.deadline-table tbody tr").appendChild(removeIcon);
                tbody.appendChild(row);
                const separators = monitorAddRowSeparator();
                separators?.forEach((sep) => tbody.appendChild(sep));

                removeIcon.addEventListener("click", async () => {
                    await this.#removePlayerFromDeadlineList(player.pid);
                    this.#deadlineUpdateIconStyle();
                    tbody.removeChild(row);
                    separators.forEach((sep) => tbody.removeChild(sep));
                    if (!tbody.querySelector(".mazyar-monitor-player-row")) {
                        const warning = this.#monitorCreateNoPlayerWarning();
                        tbody.appendChild(warning);
                    }
                });
            }
        }

        monitorInject() {
            if (this.#isTransferDeadlineAlertEnabled()) {
                const target = document.querySelector('div.baz.bazCenter >div > div.win_back > table');
                if (target) {
                    const monitor = monitorCreateSection("MZY Monitor", "mazyar-monitor-section");
                    target.appendChild(monitor);
                    target.appendChild(monitorCreateSectionSeparator());

                    const tbody = monitor.querySelector("td > div > table > tbody");
                    document.body.addEventListener("deadlines-updated", () => {
                        const players = Object.values(this.#deadlines)
                            .filter((player) => player.source === "mzy")
                            .sort((a, b) => a.deadline - b.deadline);
                        this.#monitorAddPlayers(tbody, players);
                    });
                }
            }
        }

        // -------------------------------- Player Options -------------------------------------

        async #addPlayerCommentIcon(player) {
            const playerId = getPlayerIdFromContainer(player);

            const parent = document.createElement("span");
            parent.classList.add("player_icon_placeholder");

            const a = document.createElement("a");
            a.classList.add("player_icon");
            parent.appendChild(a);

            const iconSpan = document.createElement("span");
            iconSpan.classList.add("player_icon_wrapper");
            a.appendChild(iconSpan);

            const commentIcon = createCommentIcon("MZY Comment");
            commentIcon.style.fontSize = "1.2rem";
            iconSpan.appendChild(commentIcon);

            if (location.hostname === 'www.managerzone.com') {
                parent.classList.add("mazyar-player-comment-icon-www");
            }

            if (await this.#fetchPlayerCommentFromIndexedDb(playerId)) {
                commentIcon.classList.add("mazyar-player-comment-icon-active");
            } else {
                commentIcon.classList.add("mazyar-player-comment-icon-inactive");
            }

            commentIcon.addEventListener("click", (event) => {
                this.#displayPlayerComment(event?.target, playerId);
            });

            const whitespace = document.createTextNode(" ");
            player.querySelector(".p_links")?.appendChild(whitespace);
            player.querySelector(".p_links")?.appendChild(parent);
        }

        async addPlayerComment() {
            if (this.#mustAddPlayerComment()) {
                const jobs = [];
                const players = document.querySelectorAll(".playerContainer");
                for (const player of players) {
                    jobs.push(this.#addPlayerCommentIcon(player));
                }
                Promise.all(jobs);
            }
        }

        async #squadAddDaysAtThisClubForSinglePlayer(player, profile, addPrice = false) {
            if (player.daysInjected) {
                return;
            }
            player.daysInjected = true;
            const daysSpan = document.createElement("span");
            const daysDiv = document.createElement("div");
            if (profile?.days >= 0) {
                const text = profile?.days === 0 ? 'N/A' : `≤ ${profile?.days}`;
                let dayColor = "black";
                if (profile?.days <= 28) {
                    dayColor = "red";
                } else if (profile?.days <= 70) {
                    dayColor = "darkgoldenrod";
                } else {
                    dayColor = "#FF00FF";
                }
                daysSpan.innerHTML = `<span style = "color:${dayColor};font-size:14px">到队: <strong>${text}天</strong></span>`;
                if (addPrice && profile?.price !== null) {
                    daysDiv.innerHTML = ` <span style="margin-left: 25px;">进货价: <strong style="color: blue;">${profile?.price}</strong><span>`;
                    daysDiv.classList.add("mazyar-days-at-this-club");
                }
            }
            player.querySelector(`span#player_id_${profile.pid}.floatRight`)?.before(daysSpan);
            player.querySelector("div.mainContent")?.appendChild(daysDiv);
        }

        async squadAddDaysAtThisClubToAllPlayers(container) {
            if (this.isDaysAtThisClubEnabledForPlayerProfiles()) {
                const jobs = [];
                const players = container.querySelectorAll("div.playerContainer");
                for (const player of players) {
                    jobs.push((async (player) => {
                        const playerId = getPlayerIdFromContainer(player);
                        await this.#fetchOrExtractPlayerProfile(playerId).then((profile) => {
                            this.#squadAddDaysAtThisClubForSinglePlayer(player, profile, true);
                        });
                    })(player));
                }
                Promise.all(jobs);
            }
        }

        async trainingAddDaysAtThisClubToPlayerProfile(container) {
            if (this.#isDaysAtThisClubEnabledForTraining()) {
                const player = container.querySelector("div.playerContainer");
                const playerId = getPlayerIdFromContainer(player);
                await this.#fetchOrExtractPlayerProfile(playerId).then((profile) => {
                    this.#squadAddDaysAtThisClubForSinglePlayer(player, profile);
                });
            }
        }

        // -------------------------------- Transfer Options -------------------------------------

        #fetchTransferOptions() {
            this.#transferOptions.hide = GM_getValue("transfer_options_hide", true);
            this.#transferOptions.H4 = GM_getValue("transfer_options_H4", false);
            this.#transferOptions.H3 = GM_getValue("transfer_options_H3", false);
            this.#transferOptions.L2 = GM_getValue("transfer_options_L2", false);
            this.#transferOptions.L1 = GM_getValue("transfer_options_L1", false);
        }

        #saveTransferOptions() {
            GM_setValue("transfer_options_hide", this.#transferOptions.hide);
            GM_setValue("transfer_options_H4", this.#transferOptions.H4);
            GM_setValue("transfer_options_H3", this.#transferOptions.H3);
            GM_setValue("transfer_options_L2", this.#transferOptions.L2);
            GM_setValue("transfer_options_L1", this.#transferOptions.L1);
        }

        #transferOptionsMustHide() {
            return this.#transferOptions.hide;
        }

        getTransferOptions() {
            return this.#transferOptions;
        }

        updateTransferOptions(key, value) {
            this.#transferOptions[key] = value;
            this.#saveTransferOptions();
        }

        #resetTransferOptions() {
            this.#transferOptions.hide = false;
            this.#transferOptions.H4 = false;
            this.#transferOptions.H3 = false;
            this.#transferOptions.L2 = false;
            this.#transferOptions.L1 = false;
            this.#saveTransferOptions();
        }

        // -------------------------------- Filters -------------------------------------

        #fetchFilters() {
            this.#filters = GM_getValue("transfer_filters", { soccer: [], hockey: [] });
        }

        #saveFilters() {
            GM_setValue("transfer_filters", {
                soccer: this.#filters.soccer.map(({ id, name, params, scout, interval }) => ({
                    id,
                    name,
                    params,
                    scout,
                    interval,
                })),
                hockey: this.#filters.hockey.map(({ id, name, params, scout, interval }) => ({
                    id,
                    name,
                    params,
                    scout,
                    interval,
                })),
            });
        }

        #getCurrentFilters() {
            return this.#filters[this.#sport];
        }

        deleteFilter(id = "") {
            const filterIndex = this.#getCurrentFilters().findIndex((f) => f.id === id);
            if (filterIndex > -1) {
                this.#removeFilterFromIndexedDb(id);
                this.#getCurrentFilters().splice(filterIndex, 1);
                this.#checkAllFilters(true);
                this.#saveFilters();
            }
        }

        deleteAllFilters() {
            this.#removeAllFilterFromIndexedDb();
            this.#getCurrentFilters().length = 0;
            this.#checkAllFilters(true);
            this.#saveFilters();
        }

        getFilterParams(name = "") {
            return this.#getCurrentFilters().find((f) => f.name === name)?.params;
        }

        async #updateFilterDetails(name, params, scout, interval) {
            const filters = this.#getCurrentFilters();
            let filter = filters.find((f) => f.name === name);
            if (filter) {
                filter.params = params;
                filter.scout = scout;
                filter.interval = interval;
            } else {
                // create a new filter if name does not exist
                filter = {
                    name,
                    params,
                    scout,
                    interval,
                    id: generateUuidV4(),
                };
                filters.push(filter);
            }
            this.#saveFilters();
            const { totalHits, scoutHits } = await this.#getFilterTotalHits(filter);
            if (totalHits >= 0) {
                await this.#setFilterHitsInIndexedDb(filter.id, totalHits, scoutHits);
                this.#checkAllFilters(true);
            }
        }

        #itsTimeToCheckFilter(filter, lastCheck) {
            const passed = Date.now() - lastCheck;
            if (filter.interval === TRANSFER_INTERVALS.never.value) {
                return false;
            } else if (filter.interval === TRANSFER_INTERVALS.onceDay.value) {
                return passed > 24 * 60 * 60 * 1000;
            } else if (filter.interval === TRANSFER_INTERVALS.onceHour.value) {
                return passed > 1 * 60 * 60 * 1000;
            } else if (filter.interval === TRANSFER_INTERVALS.onceMinute.value) {
                return passed > 1 * 60 * 1000;
            }
            // 'always' or any invalid value means always
            return true;
        }

        #getAcceptableHighsAndLowsForFilter(scout) {
            const lows = scout.low.length > 0 ? scout.low : [1, 2, 3];
            const highs = scout.high.length > 0 ? scout.high : [1, 2, 3, 4];
            return { lows, highs };
        }

        async #getFilterHitsByOffset(filter, offset = 0) {
            let totalHits = -1;
            let scoutHits = -1;
            const url = `https://${location.hostname}/ajax.php?p=transfer&sub=transfer-search&sport=${this.#sport}${filter.params}&o=${offset}`;
            const response = await fetch(url).catch((error) => {
                console.warn(error);
            });
            if (response) {
                const data = await response.json();
                totalHits = Number(data?.totalHits);
                const searchResults = document.createElement("div");
                searchResults.innerHTML = data.players;
                if (filter.scout) {
                    const playersReport = await this.#getPlayerScoutReportForSearchResult(searchResults);
                    const { lows, highs } = this.#getAcceptableHighsAndLowsForFilter(filter.scout);
                    const scouted = playersReport.filter((report) => this.#isQualifiedForTransferScoutFilter(report, lows, highs));
                    scoutHits = scouted.length;
                    // save scout hits in indexed db
                    const jobs = [];
                    for (const player of scouted) {
                        jobs.push(this.#setHitInIndexedDb(filter.id, player.pid));
                    }
                    await Promise.all(jobs);
                }
            }
            return { totalHits, scoutHits };
        }

        async #getFilterTotalHits(filter) {
            // get first page of the results
            await this.#removeAllHitsOfFilterFromIndexedDb(filter.id);
            let { totalHits, scoutHits } = await this.#getFilterHitsByOffset(filter);
            if (totalHits >= 0) {
                if (filter.scout) {
                    const pages = Math.min(Math.ceil(totalHits / 20), 26);
                    const jobs = [];
                    // when filter uses scout report, get next pages too
                    for (let i = 1; i < pages; i++) {
                        jobs.push(this.#getFilterHitsByOffset(filter, 20 * i));
                    }
                    const results = await Promise.all(jobs);
                    for (const result of results) {
                        scoutHits += result.scoutHits;
                    }
                }
            }
            return { totalHits, scoutHits };
        }

        async refreshFilterHits(id = "") {
            const filter = this.#getCurrentFilters().find((filter) => filter.id === id);
            if (filter) {
                const { totalHits, scoutHits } = await this.#getFilterTotalHits(filter);
                if (totalHits >= 0) {
                    this.#setFilterHitsInIndexedDb(filter.id, totalHits, scoutHits);
                    this.#checkAllFilters(false);
                    return { totalHits, scoutHits };
                }
            }
            return { totalHits: -1, scoutHits: -1 };
        }

        // -------------------------------- Display -------------------------------------

        #createModal() {
            this.#modal = document.createElement("div");
            this.#modal.id = "mazyar-modal";
            this.#modal.classList.add("mazyar-flex-container");

            this.#content = document.createElement("div");
            this.#content.id = "mazyar-modal-content";
            this.#content.classList.add("mazyar-flex-container", "mazyar-scrollable-vertical");

            this.#modal.appendChild(this.#content);
            this.#hideModal();
            document.body?.appendChild(this.#modal);
        }

        #addToolbar() {
            const { toolbar, menu, transfer, note } = createToolbar();
            menu.addEventListener("click", () => {
                this.#displaySettingsMenu();
            });
            transfer.addEventListener("click", () => {
                this.#displayTransferFilters();
            });
            note.addEventListener("click", () => {
                if (this.#notebook.style.hide) {
                    this.#showNotebook();
                    this.#saveNotebookStyle();
                } else {
                    this.#hideNotebook();
                    this.#saveNotebookStyle();
                }
            });
            document.body?.appendChild(toolbar);
        }

        #displayModal() {
            this.#modal.style.display = "flex";
        }

        #clearModalContent() {
            this.#content.innerText = "";
        }

        #replaceModalContent(elements = []) {
            this.#clearModalContent();
            for (const element of elements) {
                if (element) {
                    this.#content.appendChild(element);
                }
            }
            this.#displayModal();
        }

        #displayLoading(title = "MZY") {
            const header = createMzStyledTitle(title);

            const loading = document.createElement("p");
            loading.innerText = "Loading...";
            loading.style.padding = "1rem";

            this.#replaceModalContent([header, loading]);
        }

        async cleanInstall() {
            this.updateSettings({
                in_progress_results: false,
                top_players_in_tables: false,
                transfer: false,
                transfer_maxed: false,
                transfer_camp: false,
                mz_predictor: false,
                player_comment: false,
                coach_salary: false,
                deadline: {
                    enabled: false,
                    play_bell: false,
                    timeout: 30,// minutes,
                },
                days: {
                    display_in_profiles: false,
                    display_in_transfer: false,
                    display_in_training: false,
                    display_for_one_clubs: false,
                }
            });
            this.deleteAllFilters();
            await this.#clearIndexedDb();
            this.#resetTransferOptions();
        }

        #displayCleanMenu() {
            const div = document.createElement("div");
            const title = createMzStyledTitle("MZY Settings");
            const notice = document.createElement("div");
            const buttons = document.createElement("div");
            const cancel = createMzStyledButton("Cancel", "red");
            const clean = createMzStyledButton("Clean", "blue");

            div.classList.add("mazyar-flex-container");

            buttons.classList.add("mazyar-flex-container-row");

            notice.innerHTML = "All Settings, Filters, Scout Reports and ... will be deleted.<br>Are you sure?";
            notice.style.padding = "1rem";

            clean.addEventListener("click", async () => {
                await this.cleanInstall();
                this.#hideModal();
                this.#displaySettingsMenu();
            });

            cancel.addEventListener("click", () => {
                this.#hideModal();
                this.#displaySettingsMenu();
            });

            div.appendChild(title);
            div.appendChild(notice);
            buttons.appendChild(cancel);
            buttons.appendChild(clean);
            div.appendChild(buttons);

            this.#replaceModalContent([div]);
        }

        // --------------------------- Notebook ------------------------------------

        #fetchNotebookStyle() {
            const defaultStyle = {
                hide: true,
                top: 0,
                left: 0,
                width: 200,
                height: 250,
            };
            this.#notebook.style = GM_getValue("notebook_style", defaultStyle);

            // reject invalid data
            if (this.#notebook.style.top < 0
                || this.#notebook.style.left < 0
                || this.#notebook.style.left > window.innerWidth
                || this.#notebook.style.top > window.innerHeight) {
                this.#notebook.style.top = 0;
                this.#notebook.style.left = 0;
                this.#saveNotebookStyle();
            }
        }

        #saveNotebookStyle() {
            GM_setValue("notebook_style", this.#notebook.style);
        }

        #fetchNotebookText() {
            this.#notebook.text = GM_getValue("notebook_text", "");
        }

        #saveNotebookText() {
            GM_setValue("notebook_text", this.#notebook.text);
        }

        #updateNotebookDisplay(content, text) {
            this.#fetchNotebookStyle();
            this.#fetchNotebookText();

            if (this.#notebook.style.hide) {
                this.#notebook.element.style.display = "none";
            } else {
                this.#notebook.element.style.display = "flex";
            }
            text.value = this.#notebook.text;
            content.style.width = this.#notebook.style.width + "px";
            content.style.height = this.#notebook.style.height + "px";
            content.style.top = this.#notebook.style.top + "px";
            content.style.left = this.#notebook.style.left + "px";
        }

        #updateNotebookLocation(content) {
            const { top, left, width, height } = content.getBoundingClientRect();
            this.#notebook.style.top = top;
            this.#notebook.style.left = left;
            this.#notebook.style.width = width;
            this.#notebook.style.height = height;
        }

        #hideNotebook() {
            this.#notebook.element.style.display = "none";
            this.#notebook.style.hide = true;
        }

        #showNotebook() {
            this.#notebook.element.style.display = "flex";
            this.#notebook.style.hide = false;
        }

        #createNotebook() {
            this.#notebook.element = document.createElement("div");
            const content = document.createElement("div");

            const contentHeader = createMzStyledTitle("MZY Notebook");
            const text = document.createElement("textarea");
            const hide = createMzStyledButton("Hide", "blue");
            const save = createMzStyledButton("Save", "green");
            const warning = document.createElement("div");
            const discard = createMzStyledButton("Discard", "red");
            const buttons = document.createElement("div");

            this.#notebook.element.classList.add("mazyar-flex-container", "mazyar-notebook-plain", "mazyar-scrollable-vertical");
            content.classList.add("mazyar-flex-container", "mazyar-resizable", "mazyar-scrollable-vertical", "mazyar-notebook-modal");
            text.classList.add("mazyar-notebook-textarea");
            buttons.classList.add("mazyar-flex-container-row");

            warning.innerText = "You have unsaved changes!";
            warning.style.color = "red";
            warning.style.display = "none";
            warning.style.marginTop = "5px";
            save.style.display = "none";
            discard.style.display = "none";

            this.#updateNotebookDisplay(content, text);
            document.addEventListener("focus", () => {
                this.#updateNotebookDisplay(content, text);
                save.style.display = "none";
                warning.style.display = "none";
                discard.style.display = "none";
            });

            makeElementDraggable(content, contentHeader, () => {
                this.#updateNotebookLocation(content);
                this.#saveNotebookStyle();
            });

            content.addEventListener("mouseup", () => {
                this.#updateNotebookLocation(content);
                this.#saveNotebookStyle();
            })

            text.addEventListener("input", () => {
                if (text.value !== this.#notebook.text) {
                    save.style.display = "unset";
                    warning.style.display = "unset";
                    discard.style.display = "unset";
                } else {
                    save.style.display = "none";
                    warning.style.display = "none";
                    discard.style.display = "none";
                }
            })

            discard.addEventListener("click", () => {
                text.value = this.#notebook.text;
                save.style.display = "none";
                warning.style.display = "none";
                discard.style.display = "none";
            });

            hide.addEventListener("click", () => {
                this.#hideNotebook();
                this.#saveNotebookStyle();
            });

            save.addEventListener("click", () => {
                this.#notebook.text = text.value;
                this.#saveNotebookText();
                save.style.display = "none";
                warning.style.display = "none";
                discard.style.display = "none";
            });

            buttons.appendChild(hide);
            buttons.appendChild(discard);
            buttons.appendChild(save);
            content.appendChild(contentHeader);
            content.appendChild(text);
            content.appendChild(warning);
            content.appendChild(buttons);
            this.#notebook.element.appendChild(content);
            document.body?.appendChild(this.#notebook.element);
        }

        // ----------------------------------------------------------------------------------

        #createDeadlineOptions(submenuStyle) {
            const div = document.createElement("div");
            div.classList.add("mazyar-flex-container");

            const enabled = createMenuCheckBox("Enable deadline alert", this.#settings.deadline.enabled, submenuStyle);
            const playBell = createMenuCheckBox("Sound Notification", this.#settings.deadline.play_bell, { margin: "0.1rem 2.2rem" });
            const timeout = createSubMenuTextInput("Timeout", "30", this.#settings.deadline.timeout);
            const unit = document.createTextNode("minute(s)");
            timeout.appendChild(unit);

            timeout.style.display = this.#settings.deadline.enabled ? "unset" : "none";
            playBell.style.display = this.#settings.deadline.enabled ? "unset" : "none";

            div.appendChild(enabled); // child node 0
            div.appendChild(timeout); // child node 1
            div.appendChild(playBell); // child node 2

            enabled.addEventListener("input", () => {
                timeout.style.display = enabled.querySelector("input[type='checkbox']").checked ? "unset" : "none";
                playBell.style.display = enabled.querySelector("input[type='checkbox']").checked ? "unset" : "none";
            });

            timeout.addEventListener("input", () => {
                const minutes = timeout.querySelector("input[type='text']");
                if (minutes?.value?.match(/^\d+$/)) {
                    const value = Number(minutes?.value)
                    if (value < 1) {
                        minutes.value = "1";
                    } else if (value > 360) {
                        minutes.value = "360";
                    }
                } else {
                    minutes.value = "";
                }
            });

            return div;
        }

        #displaySettingsMenu() {
            const submenuStyle = { margin: "0.1rem 1.2rem" };

            const div = document.createElement("div");
            const title = createMzStyledTitle(`MZY Settings (v${currentVersion})`);

            const miscellaneousGroup = createMenuGroup("Miscellaneous:");
            const playerComment = createMenuCheckBox("Enable player comment", this.#settings.player_comment, submenuStyle);
            const inProgress = createMenuCheckBox("Display in progress results", this.#settings.in_progress_results, submenuStyle);
            const tableInjection = createMenuCheckBox("Display teams' top players in tables", this.#settings.top_players_in_tables, submenuStyle);
            const mzPredictor = createMenuCheckBox("Help with World Cup Predictor", this.#settings.mz_predictor, submenuStyle);
            mzPredictor.style.display = 'none';
            miscellaneousGroup.appendChild(playerComment);
            miscellaneousGroup.appendChild(inProgress);
            miscellaneousGroup.appendChild(tableInjection);
            miscellaneousGroup.appendChild(mzPredictor);

            const coachesGroup = createMenuGroup("Coaches:");
            const coachSalaries = createMenuCheckBox("Display salaries in search results", this.#settings.coach_salary, submenuStyle);
            coachesGroup.appendChild(coachSalaries);

            const transferGroup = createMenuGroup("Transfer Market:");
            const transferFilters = createMenuCheckBox("Enable transfer filters", this.#settings.transfer, submenuStyle);
            const transferMaxed = createMenuCheckBox("Mark maxed skills", this.#settings.transfer_maxed, submenuStyle);
            const transferCamp = createMenuCheckBox("Check if player is sent to camp", this.#settings.transfer_camp, submenuStyle);
            const transferDeadline = this.#createDeadlineOptions(submenuStyle);
            transferGroup.appendChild(transferFilters);
            transferGroup.appendChild(transferMaxed);
            transferGroup.appendChild(transferCamp);
            transferGroup.appendChild(transferDeadline);

            const daysGroup = createMenuGroup("Days at this club:");
            const daysInProfiles = createMenuCheckBox("Display in player profiles", this.#settings.days.display_in_profiles, submenuStyle);
            const daysInTransfer = createMenuCheckBox("Display in transfer market", this.#settings.days.display_in_transfer, submenuStyle);
            const daysInTraining = createMenuCheckBox("Display in training report", this.#settings.days.display_in_training, submenuStyle);
            const daysForOneClubs = createMenuCheckBox("Display for One-Club players", this.#settings.days.display_for_one_clubs, submenuStyle);
            daysGroup.appendChild(daysInProfiles);
            daysGroup.appendChild(daysInTransfer);
            daysGroup.appendChild(daysInTraining);
            daysGroup.appendChild(daysForOneClubs);

            const buttons = document.createElement("div");
            const clean = createMzStyledButton(`<i class="fa fa-exclamation-triangle" style="font-size: 0.9rem;"></i> Clean Install`, "blue");
            const cancel = createMzStyledButton("Cancel", "red");
            const save = createMzStyledButton("Save", "green");

            div.classList.add("mazyar-flex-container");

            buttons.classList.add("mazyar-flex-container-row");

            cancel.addEventListener("click", () => {
                this.#hideModal();
            });

            save.onclick = () => {
                const deadlineTimeout = Number(transferDeadline.childNodes[1].querySelector("input[type=text]")?.value);
                this.updateSettings({
                    in_progress_results: inProgress.querySelector("input[type=checkbox]").checked,
                    top_players_in_tables: tableInjection.querySelector("input[type=checkbox]").checked,
                    transfer: transferFilters.querySelector("input[type=checkbox]").checked,
                    transfer_maxed: transferMaxed.querySelector("input[type=checkbox]").checked,
                    transfer_camp: transferCamp.querySelector("input[type=checkbox]").checked,
                    deadline: {
                        enabled: transferDeadline.childNodes[0].querySelector("input[type=checkbox]")?.checked,
                        play_bell: transferDeadline.childNodes[2].querySelector("input[type=checkbox]")?.checked,
                        timeout: deadlineTimeout > 0 && deadlineTimeout <= 360 ? deadlineTimeout : 30,
                    },
                    mz_predictor: mzPredictor.querySelector("input[type=checkbox]").checked,
                    player_comment: playerComment.querySelector("input[type=checkbox]").checked,
                    coach_salary: coachSalaries.querySelector("input[type=checkbox]").checked,
                    days: {
                        display_in_profiles: daysInProfiles.querySelector("input[type=checkbox]").checked,
                        display_in_transfer: daysInTransfer.querySelector("input[type=checkbox]").checked,
                        display_in_training: daysInTraining.querySelector("input[type=checkbox]").checked,
                        display_for_one_clubs: daysForOneClubs.querySelector("input[type=checkbox]").checked,
                    }
                });
                this.#hideModal();
            };

            clean.style.marginBottom = "0";
            clean.addEventListener("click", () => {
                this.#hideModal();
                this.#displayCleanMenu();
            });

            div.appendChild(title);
            div.appendChild(transferGroup);
            div.appendChild(daysGroup);
            div.appendChild(coachesGroup);
            div.appendChild(miscellaneousGroup);
            div.appendChild(clean);
            buttons.appendChild(cancel);
            buttons.appendChild(save);
            div.appendChild(buttons);

            this.#replaceModalContent([div]);
        }

        #getSelectedHighLows(useScout) {
            const high = [];
            const low = [];
            if (useScout.querySelector("input[type=checkbox]").checked) {
                const options = this.getTransferOptions();
                if (options.H4) {
                    high.push(4);
                }
                if (options.H3) {
                    high.push(3);
                }
                if (options.L2) {
                    low.push(2);
                }
                if (options.L1) {
                    low.push(1);
                }
            }
            return { low, high };
        }

        displayFilterSaveMenu(params) {
            const filters = this.#getCurrentFilters();

            const scoutText = this.#getSelectedScoutsOptionText();

            const title = createMzStyledTitle("MZY Transfer Filter");
            const div = document.createElement("div");
            const datalist = createSuggestionList(filters.map((f) => f.name));
            const filterName = createMenuTextInput("Filter Name", "U21 K-10 ST-10", datalist.id);
            const useScout = createMenuCheckBox(`Use scout reports too (${scoutText})`);
            const checkInterval = createMenuDropDown("Check Interval", TRANSFER_INTERVALS, TRANSFER_INTERVALS.onceHour.value);

            const validation = document.createElement("div");
            const buttons = document.createElement("div");
            const cancel = createMzStyledButton("Cancel", "red");
            const save = createMzStyledButton("Save", "green");

            div.classList.add("mazyar-flex-container");

            validation.innerText = "Error: Name is empty.";
            validation.style.color = "red";
            validation.style.display = "none";
            validation.style.alignSelf = "flex-start";
            validation.style.margin = "auto 0.5rem";

            filterName.oninput = () => {
                const name = filterName.querySelector("input[type='text']").value;
                if (name) {
                    validation.style.display = "none";
                    save.classList.remove(getMzButtonColorClass("grey"));
                } else {
                    validation.style.display = "unset";
                    save.classList.add(getMzButtonColorClass("grey"));
                }
            };

            buttons.classList.add("mazyar-flex-container-row");

            cancel.addEventListener("click", () => {
                this.#hideModal();
            });

            save.addEventListener("click", () => {
                // save then close
                const name = filterName.querySelector("input[type=text]").value;
                if (name) {
                    const { low, high } = this.#getSelectedHighLows(useScout);
                    const scout = high.length === 0 && low.length === 0 ? null : { high, low };
                    const interval = checkInterval.querySelector("select").value;
                    this.#updateFilterDetails(name, params, scout, interval);
                    this.#hideModal();
                } else {
                    validation.style.display = "unset";
                    save.classList.add(getMzButtonColorClass("grey"));
                }
            });

            buttons.appendChild(cancel);
            buttons.appendChild(save);

            div.appendChild(title);
            div.appendChild(filterName);
            div.appendChild(checkInterval);
            if (scoutText) {
                div.appendChild(useScout);
            }
            div.appendChild(datalist);
            div.appendChild(validation);
            div.appendChild(buttons);

            this.#replaceModalContent([div]);
        }

        #setFilterHitsInToolbar(total = -1) {
            // pass negative to create loading animation.
            const hits = document.getElementById("mazyar-transfer-filter-hits");
            if (hits) {
                if (total < 0) {
                    hits.replaceChildren(createLoadingIcon());
                } else {
                    hits.innerText = total > 100 ? "+100" : total.toString();
                    hits.style.color = total > 0 ? "cyan" : "white";
                }
            }
        }

        async #checkAllFilters(forced = false) {
            this.#setFilterHitsInToolbar(-1);
            const filters = this.#getCurrentFilters();
            let total = 0;
            for (const filter of filters) {
                let { totalHits: hits, lastCheck } = await this.getFilterHitsFromIndexedDb(filter.id);
                const needRefresh = this.#itsTimeToCheckFilter(filter, lastCheck);
                if (!filterHitsIsValid(hits) || forced || needRefresh) {
                    const { totalHits, scoutHits } = await this.#getFilterTotalHits(filter);
                    if (totalHits >= 0) {
                        hits = filter.scout ? scoutHits : totalHits;
                        await this.#setFilterHitsInIndexedDb(filter.id, totalHits, scoutHits);
                    }
                }
                total += hits;
            }
            this.#setFilterHitsInToolbar(total);
            return total;
        }

        async setInitialFiltersHitInToolbar() {
            await this.#checkAllFilters(false);
        }

        async #displayTransferHideMenu() {
            const div = document.createElement("div");
            div.classList.add("mazyar-flex-container");

            const title = createMzStyledTitle("MZY Transfer Hide List");
            await this.#countPlayersOfHideListInIndexDb();
            const body = document.createElement("div");
            const description = document.createElement("div");
            const dayClearDiv = document.createElement("div");
            const daysInput = createMenuTextInput("Days", "0", "");
            const clear = createMzStyledButton("Remove", "red", "floatRight");
            const validation = document.createElement("div");
            const result = document.createElement("div");
            dayClearDiv.appendChild(daysInput);
            dayClearDiv.appendChild(clear);
            body.appendChild(description);
            body.appendChild(dayClearDiv);
            body.appendChild(validation);
            body.appendChild(result);

            body.classList.add("mazyar-flex-container");
            body.style.maxWidth = "320px";
            dayClearDiv.classList.add("mazyar-flex-container-row");
            daysInput.querySelector("input[type='text']").style.width = "2rem";

            const close = createMzStyledButton("Close", "green");

            description.innerHTML = `<p>There are <strong style="color:red;">${await this.#countPlayersOfHideListInIndexDb()}</strong> player(s) hidden from transfer market.</p>
            <p>You can remove players from hide list.</p>
            <p>Enter the number of days to remove players hidden before this period.<br>Enter 0 to remove all.</p>`;
            description.style.paddingLeft = "0.7rem";

            validation.innerText = "Error: Invalid value for days.";
            validation.style.color = "red";
            validation.style.display = "none";
            validation.style.margin = "auto 0.5rem";

            result.style.display = "none";
            result.style.margin = "auto 0.5rem";
            result.innerHTML = `Removed <strong style="color:blue;">0</strong> player(s) from hide list.</p>`

            daysInput.addEventListener("input", () => {
                result.style.display = "none";
                const days = daysInput.querySelector("input[type='text']").value;
                if (days.match(/^\d+$/)) {
                    validation.style.display = "none";
                    clear.classList.remove(getMzButtonColorClass("grey"));
                } else {
                    validation.style.display = "unset";
                    clear.classList.add(getMzButtonColorClass("grey"));
                }
            });

            clear.addEventListener("click", async () => {
                const days = daysInput.querySelector("input[type='text']").value
                if (days.match(/\d+/)) {
                    const deleteCount = await this.#deletePlayersFromHideListInIndexDb(days);
                    result.querySelector("strong").innerText = deleteCount;
                    result.style.display = "unset";
                    description.querySelector("strong").innerText = await this.#countPlayersOfHideListInIndexDb();
                } else {
                    validation.style.display = "unset";
                    clear.classList.add(getMzButtonColorClass("grey"));
                }
            });

            close.addEventListener("click", () => {
                this.#hideModal();
            });

            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(close);

            this.#replaceModalContent([div]);
        }

        async #displayTransferFilters() {
            const div = document.createElement("div");
            div.classList.add("mazyar-flex-container");

            const title = createMzStyledTitle("MZY Transfer Filters");

            const filtersView = document.createElement("div");
            filtersView.classList.add("mazyar-flex-container");

            const noFilterView = document.createElement("span");
            noFilterView.innerText = "There is no filter to display";
            noFilterView.style.display = "none";
            noFilterView.style.margin = "1rem";

            const filters = this.#getCurrentFilters();
            if (filters.length > 0) {
                const deleteAll = createDeleteButtonWithTrashIcon("Delete all filters");
                deleteAll.addEventListener("click", () => {
                    this.deleteAllFilters();
                    filtersView.style.display = "none";
                    noFilterView.style.display = "unset";
                });
                const table = filtersViewCreateTable(filters);
                table.addEventListener("destroy", () => {
                    // remove 'delete all' button if no filter is left
                    filtersView.style.display = "none";
                    noFilterView.style.display = "unset";
                });
                filtersView.appendChild(deleteAll);
                filtersView.appendChild(table);
            } else {
                noFilterView.style.display = "unset";
            }

            const close = createMzStyledButton("Close", "green");
            close.addEventListener("click", () => {
                this.#hideModal();
            });

            div.appendChild(title);
            div.appendChild(filtersView);
            div.appendChild(noFilterView);
            div.appendChild(close);

            this.#replaceModalContent([div]);
        }

        async displaySquadSummary(url) {
            this.#displayLoading("MZY Squad Summary");
            await fetch(url)
                .then((resp) => resp.text())
                .then((content) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, "text/html");
                    const sport = getSportType(doc);
                    const currency = getClubCurrency(doc);
                    const players = getClubPlayers(doc, currency);
                    const summary = squadGetPlayersInfo(players, sport);
                    const topPlayers = squadCreateTopPlayersTable(summary, currency, sport);
                    topPlayers.style.margin = "2px 5px";
                    topPlayers.style.padding = "0";

                    const header = createMzStyledTitle("MZY Squad Summary");
                    const button = createMzStyledButton("Close", "red");
                    button.addEventListener("click", () => {
                        this.#hideModal();
                    });
                    this.#replaceModalContent([header, topPlayers, button]);
                })
                .catch((error) => {
                    console.warn(error);
                });
        }

        async #displayTransferDeadlines() {
            const div = document.createElement("div");
            div.classList.add("mazyar-flex-container");

            const title = createMzStyledTitle("MZY Transfer Deadlines");

            const middle = document.createElement("div");
            middle.classList.add("mazyar-scrollable-vertical");

            middle.style.flex = "1";
            middle.style.margin = "5px 2px";

            const bids = document.createElement("table");
            bids.style.margin = "5px 2px";
            middle.appendChild(bids);

            const thead = document.createElement("thead");
            thead.innerHTML = `<tr><th style="width: 15px;"></th><th style="text-align: left;"><strong>Player</strong></th><th><strong>Deadline</strong></th></tr>`;
            bids.appendChild(thead);

            const sortedBids = Object.values(this.#deadlines)?.sort((a, b) => a.deadline - b.deadline);
            const tbody = document.createElement("tbody");
            bids.appendChild(tbody);
            for (const bid of sortedBids) {
                const row = document.createElement("tr");

                const deleteButton = document.createElement("td");
                deleteButton.addEventListener("click", async () => {
                    await this.#removePlayerFromDeadlineList(bid.pid);
                    row.remove();
                    if (tbody.childElementCount === 0) {
                        this.#deadlineUpdateIconStyle();
                        this.#hideModal();
                    }
                });

                const trashIcon = createTrashIcon("Remove from deadline list");
                deleteButton.appendChild(trashIcon);

                const name = document.createElement("td");
                name.innerHTML = `<a href="/?p=transfer&sub=players&u=${bid.pid}" target="_blank">${bid.name}</a>`;
                name.style.paddingRight = "15px";

                const deadline = document.createElement("td");
                deadline.innerHTML = `<strong>${bid.deadline}</strong> minutes`;
                deadline.style.paddingRight = "15px";
                if (bid.deadline <= this.#settings.deadline.timeout) {
                    deadline.style.color = "red";
                }

                row.appendChild(deleteButton);
                row.appendChild(name);
                row.appendChild(deadline);
                tbody.appendChild(row);
            }

            const close = createMzStyledButton("Close", "green");
            close.addEventListener("click", () => {
                this.#hideModal();
            });

            div.appendChild(title);
            div.appendChild(middle);
            div.appendChild(close);

            this.#replaceModalContent([div]);
        }

        #addDeadlineIndicator() {
            const deadline = createDeadlineIndicator();
            deadline.id = "mazyar-deadline";
            deadline.style.display = "none";
            deadline.style.border = "1px solid black";
            deadline.style.borderRadius = "50%";
            deadline.style.padding = "0.5rem";
            document.body?.appendChild(deadline);
            deadline.addEventListener("click", () => {
                this.#displayTransferDeadlines();
            });
            return deadline;
        }

        async #monitorFetchAndProcessYourBidsPlayers() {
            const response = await fetchTransferMonitorData();
            if (response) {
                const yourBids = document.createElement("div");
                yourBids.innerHTML = response.content;
                const bids = yourBids.querySelectorAll(`table[cellpadding="0"][border="0"] table img[src*="/flags/"]`);
                const rows = [...bids].map((element) => element.parentNode.parentNode.parentNode.parentNode.parentElement.parentNode);
                return rows.map((row) => {
                    const sections = [...row.childNodes].filter((el) => el.tagName === "TD");
                    // sections are: [0: player name], [1:deadline], [2:latest bid]
                    const deadlineFull = sections[1].innerText?.trim();
                    return {
                        name: sections[0].innerText.trim(),
                        pid: extractPlayerIDFromTransferMonitor(sections[0].querySelector(`a:not([class="player_icon"]`).href),
                        deadline: 1 + Math.ceil((parseMzDateTime(deadlineFull) - new Date()) / 60_000),
                        deadlineFull,
                        latestBid: sections[2].querySelector(`td[align="right"]`).innerText,
                    }
                });
            }
            return [];
        }

        async #updatePlayerDeadlineFromMarket(pid) {
            const url = `https://${location.hostname}/ajax.php?p=transfer&sub=transfer-search&sport=${this.#sport}&u=${pid}`;
            const result = await fetch(url)
                .then((resp) => resp.json())
                .catch((err) => {
                    console.warn(err);
                    return null;
                });
            if (result) {
                if (result.totalHits > 0) {
                    const parser = new DOMParser();
                    const playerDiv = parser.parseFromString(result?.players, "text/html").body.firstChild;
                    const deadline = playerDiv.querySelector(".transfer-control-area div.box_dark:nth-child(1) table:nth-child(1) tr:nth-child(3) strong")?.innerText;
                    const latestBid = playerDiv.querySelector("span:is(.bid_button, .semi_transparent).player_icon_placeholder").parentNode.previousElementSibling.querySelector("strong").innerText;
                    const flag = playerDiv.querySelector(`img[src*="/flags/"]`)?.src;
                    const player = {
                        name: playerDiv.querySelector(".player_name")?.innerText,
                        pid,
                        deadline: 1 + Math.ceil((parseMzDateTime(deadline.trim()) - new Date()) / 60_000),
                        deadlineFull: deadline.trim(),
                        latestBid,
                        source: "mzy",
                        flag,
                    };
                    await this.#addPlayerToDeadlineListInIndexDb(player);
                } else {
                    await this.#removePlayerFromDeadlineList(pid);
                }
            }
        }

        async #deadlineProcessPlayersInIndexedDb() {
            const players = await this.#fetchDeadlinePlayersFromIndexedDb();
            const jobs = [];
            for (const player of players) {
                if (this.#deadlineLockAcquired) {
                    jobs.push(this.#updatePlayerDeadlineFromMarket(player.pid));
                } else if (player.deadline > 0) {
                    this.#deadlines[player.pid] = player;
                } else {
                    delete this.#deadlines[player.pid];
                }
            }
            await Promise.all(jobs);
        }

        #deadlineIsLockerTabDead() {
            return Date.now() - Number(GM_getValue("deadline_locker_last_call", 0)) > (2 * DEADLINE_INTERVAL_SECONDS * 1000);
        }

        #deadlineUpdateLockStatus() {
            if (this.#deadlineLockAcquired) {
                // we have the lock
                GM_setValue("deadline_locker_last_call", Date.now());
            } else {
                // check whether if lock is available to acquire
                const isLocked = GM_getValue("deadline_is_locked", false);
                if (isLocked) {
                    // other instance of mazyar is already required the lock
                    this.#deadlineLockAcquired = false;
                    if (this.#deadlineIsLockerTabDead()) {
                        // it seems locker tab is not alive. make it available for other tabs
                        console.warn("locker tab is dead. release the lock.");
                        GM_setValue("deadline_is_locked", false);
                    }
                } else {
                    // we can acquire the lock
                    GM_setValue("deadline_is_locked", true);
                    GM_setValue("deadline_locker_last_call", Date.now());
                    this.#deadlineLockAcquired = true;
                    window.onbeforeunload = () => {
                        // release lock
                        GM_setValue("deadline_is_locked", false);
                        this.#deadlineLockAcquired = false;
                    }
                }
            }
        }

        #playDeadlineAlert() {
            if (this.#settings.deadline.play_bell) {
                const ding = new Audio(deadlineAlertSound);
                ding.play();
            }
        }

        #deadlineUpdateIconStyle() {
            const deadlineIcon = document.getElementById("mazyar-deadline");
            const strobe = Object.values(this.#deadlines).filter((player) => player.deadline <= this.#settings.deadline.timeout).length > 0;
            if (strobe && deadlineIcon) {
                deadlineIcon.style.display = 'unset';
                deadlineIcon.classList.add("mazyar-deadline-throb-lightgreen");
                this.#playDeadlineAlert();
            } else {
                deadlineIcon.style.display = 'none';
                deadlineIcon.classList.remove("mazyar-deadline-throb-lightgreen");
            }
        }

        async #updateDeadlines() {
            this.#deadlineUpdateLockStatus();
            // remove old data
            this.#deadlines = {};
            await this.#deadlineProcessPlayersInIndexedDb();
            if (this.#deadlineLockAcquired) {
                const players = await this.#monitorFetchAndProcessYourBidsPlayers();
                for (const player of players) {
                    if (player.deadline > 0) {
                        player.source = "monitor";
                        await this.#addPlayerToDeadlineListInIndexDb(player);
                    } else {
                        await this.#removePlayerFromDeadlineList(player.pid);
                    }
                }
            }
            this.#deadlineUpdateIconStyle();
            document.body.dispatchEvent(new Event("deadlines-updated"));
        }

        async injectTransferDeadlineAlert() {
            if (this.#isTransferDeadlineAlertEnabled()) {
                this.#addDeadlineIndicator();
                await this.#updateDeadlines();
                setInterval(() => {
                    this.#updateDeadlines();
                }, 1000 * DEADLINE_INTERVAL_SECONDS);
            }
        }

        #addDeadlineButtonToPlayerInTransferMarket(player, deadlines) {
            if (player.deadlineIconInjected) {
                return;
            }
            player.deadlineIconInjected = true;
            const playerId = getPlayerIdFromContainer(player);
            let alreadyAdded = deadlines.find((player) => player.pid == playerId);
            const addButton = createAddToDeadlineIcon("Deadline Monitor Add/Remove", alreadyAdded ? "red" : "green")
            player.querySelector("h2.clearfix div")?.appendChild(addButton);

            addButton.addEventListener("click", async () => {
                if (alreadyAdded) {
                    alreadyAdded = false;
                    addButton.style.color = "green";
                    await this.#removePlayerFromDeadlineList(playerId);
                } else {
                    alreadyAdded = true;
                    addButton.style.color = "red";
                    await this.#updatePlayerDeadlineFromMarket(playerId);
                }
                this.#deadlineUpdateIconStyle();
            });
        }

        #createFilterInfo(data = { name: "", scout: { high: [], low: [] }, count: "" }) {
            const info = document.createElement("div");
            const nameSpan = document.createElement("span");
            const scoutSpan = document.createElement("span");
            const countSpan = document.createElement("span");

            info.style.margin = "3px";
            info.style.padding = "3px";
            info.style.alignSelf = "flex-start";

            nameSpan.innerHTML = `<strong>Filter Name: </strong>${data.name}<br>`;
            scoutSpan.innerHTML = `<strong>Selected: ${this.#getSelectedScoutsOptionTextForFilter(data.scout)}<strong><br>`;
            countSpan.innerHTML = `<strong>Hit Count: </strong><span class="filter-count-span">${data.count}<span>`;

            info.appendChild(nameSpan);
            info.appendChild(scoutSpan);
            info.appendChild(countSpan);
            return info;
        }

        async #appendFilterResultToModal(middle, searchResults, filterId) {
            for (const result of searchResults) {
                const parser = new DOMParser();
                const player = parser.parseFromString(result.content.players, "text/html").body.firstChild;
                if (this.#doesTransferNeedPlayerProfile()) {
                    this.#updateProfileRelatedFieldsInTransfer(player);
                }
                player.id = "";
                this.#fetchOrExtractPlayerScoutReport(player).then(report => {
                    this.#colorizeSkills(player, report);
                });
                const a = player.querySelector("h2>div>a.subheader");
                if (a) {
                    a.href = `https://${location.hostname}/?p=transfer&u=${result.playerId}`;
                    a.target = "_blank";
                    const tools = player.querySelector("td span.player_icon_placeholder.bid_button")?.parentNode;
                    if (tools) {
                        tools.style.display = "none";
                    }
                    player.querySelector("div.floatRight.transfer-control-area")?.classList.add("mazyar-transfer-control-area");
                    middle.appendChild(player);
                } else {
                    this.#removeHitFromIndexedDb(filterId, result.playerId);
                }
            }
        }

        async displayFilterResults(filterId, filterInfo) {
            const div = document.createElement("div");

            const header = createMzStyledTitle("MZY Filter Results");
            const info = this.#createFilterInfo(filterInfo);
            const middle = document.createElement("div");
            const close = createMzStyledButton("Close", "red");

            div.classList.add("mazyar-flex-container");

            middle.classList.add("mazyar-scrollable-vertical");
            middle.style.flex = "1";
            middle.style.margin = "5px 2px";

            close.style.marginBottom = "1px";
            close.addEventListener("click", () => {
                this.#hideModal();
                this.#displayTransferFilters();
            });

            const players = await this.#getHitsFromIndexedDb(filterId);
            this.#displayLoading("MZY Filter Results");
            const jobs = [];
            for (const player of players) {
                const url = `https://${location.hostname}/ajax.php?p=transfer&sub=transfer-search&sport=${this.#sport}&u=${player.pid}`;
                jobs.push(
                    fetch(url)
                        .then((resp) => resp.json())
                        .then((content) => {
                            return { playerId: player.pid, content };
                        })
                );
            }
            const searchResults = await Promise.all(jobs);
            this.#appendFilterResultToModal(middle, searchResults, filterId);

            const noResult = middle.childNodes.length === 0;
            if (noResult) {
                middle.innerHTML = "<h3>No Players To Display</h3><span>Please refresh the filter to update hits.</span>";
                middle.style.padding = "10px";
                middle.style.textAlign = "center";
            } else {
                info.querySelector(".filter-count-span").innerText = middle.childNodes.length.toString();
            }

            div.appendChild(header);
            if (noResult) {
                div.appendChild(middle);
                div.appendChild(close);
            } else {
                div.appendChild(close);
                div.appendChild(info);
                div.appendChild(middle);
            }
            this.#replaceModalContent([div]);
        }

        async #displayPlayerComment(target, playerId) {
            this.#displayLoading("MZY Player Note");
            const header = createMzStyledTitle("MZY Player Note");
            const text = document.createElement("textarea");
            const cancel = createMzStyledButton("Cancel", "red");
            const save = createMzStyledButton("Save", "green");
            const buttons = document.createElement("div");

            buttons.classList.add("mazyar-flex-container-row");

            text.value = await this.#fetchPlayerCommentFromIndexedDb(playerId);
            text.classList.add("mazyar-player-comment-textarea");

            cancel.addEventListener("click", () => {
                this.#hideModal();
            });

            save.addEventListener("click", async () => {
                await this.#setPlayerCommentInIndexedDb(playerId, text.value);
                if (text.value) {
                    target?.classList.remove("mazyar-player-comment-icon-inactive");
                    target?.classList.add("mazyar-player-comment-icon-active");
                } else {
                    target?.classList.add("mazyar-player-comment-icon-inactive");
                    target?.classList.remove("mazyar-player-comment-icon-active");
                }
                this.#hideModal();
            });

            buttons.appendChild(cancel);
            buttons.appendChild(save);

            this.#replaceModalContent([header, text, buttons]);
        }

        #getVersionNumbers(v) {
            return v.split('.').map((i) => Number(i));
        }

        #getVersionsOfChangelog(changelogs) {
            return Object.keys(changelogs).map((v) => this.#getVersionNumbers(v));
        }

        #isVersionLesserThan(version = [0, 0], base = [0, 0]) {
            return version[0] < base[0] ||
                (version[0] === base[0] && version[1] < base[1]);
        }

        #isVersionGreaterThan(version = [0, 0], base = [0, 0]) {
            return version[0] > base[0] ||
                (version[0] === base[0] && version[1] > base[1]);
        }

        #showChangelog() {
            const previousVersion = GM_getValue("previous_version", "");
            if (!previousVersion) {
                GM_setValue("previous_version", currentVersion);
                return;
            }
            const previous = this.#getVersionNumbers(previousVersion);
            const current = this.#getVersionNumbers(currentVersion);
            if (!this.#isVersionLesserThan(previous, current)) {
                return;
            }

            const headHTML = `<b>Mazyar</b> is updated<br>` +
                `from <b style="color: red;">v${previousVersion}</b><span> to </span><b style="color: blue;">v${currentVersion}</b>`;
            const head = document.createElement("div");
            head.innerHTML = headHTML;
            head.style.textAlign = "center";

            const changesTitle = document.createElement("div");
            changesTitle.innerHTML = `<b>Changelog:</b>`;
            changesTitle.style.margin = "5px";
            changesTitle.style.width = "100%";
            changesTitle.style.width = "100%";
            changesTitle.style.textAlign = "left";

            let changesHTML = '';
            const versions = this.#getVersionsOfChangelog(changelogs);
            for (const version of versions) {
                if (this.#isVersionGreaterThan(version, current)) {
                    continue;
                }
                if (this.#isVersionGreaterThan(version, previous)) {
                    const v = version.join('.');
                    changesHTML += `<div style="margin-bottom: 1rem;"><b>v${v}</b><ul style="margin: 0px 5px 5px;"><li>`
                        + changelogs[v]?.join("</li><li>") + "</li></ul></div>";
                }
            }
            const changes = document.createElement("div");
            changes.innerHTML = changesHTML;
            changes.style.maxHeight = "320px";
            changes.style.maxWidth = "320px";
            changes.style.paddingRight = "30px";
            changes.style.backgroundColor = "khaki";
            changes.style.padding = "5px";
            changes.style.flex = "1";
            changes.classList.add("mazyar-scrollable-vertical");

            const text = document.createElement("div");
            text.classList.add("mazyar-flex-container");
            text.style.margin = "10px";
            text.style.padding = "5px";
            text.appendChild(head);
            text.appendChild(changesTitle);
            text.appendChild(changes);

            const header = createMzStyledTitle("MZY Notice");
            const close = createMzStyledButton("close", "green");

            close.addEventListener("click", () => {
                GM_setValue("previous_version", currentVersion);
                this.#hideModal();
            });

            this.#replaceModalContent([header, text, close]);
        }

        showPlayerInModal(playerView) {
            const player = document.createElement("div");
            player.style.margin = "5px";
            player.style.padding = "0px";
            player.style.backgroundColor = "wheat";
            player.appendChild(playerView);

            const header = createMzStyledTitle("MZY Player View");
            const close = createMzStyledButton("close", "green");

            close.addEventListener("click", () => {
                this.#hideModal();
            });

            this.#replaceModalContent([header, player, close]);
        }

        #hideModal() {
            this.#modal.style.display = "none";
            this.#clearModalContent();
        }
    }

    /* *********************** Inject ********************************** */

    function isVisitingTeamPage() {
        const regex = /^\?((p=team)|(p=team&tid=\d+))$/g;
        return regex.test(document.location.search);
    }

    async function inject() {
        GM_addStyle(styles);

        mazyar = new Mazyar();
        if (mazyar.isTransferFiltersEnabled()) {
            mazyar.setInitialFiltersHitInToolbar();
        }
        mazyar.injectTransferDeadlineAlert();

        const uri = document.baseURI;
        if (uri.search("/?p=federations") > -1) {
            if (uri.search("&sub=clash") > -1) {
                clashInjectRanks();
            } else if (uri.search("&fid=") > -1 || uri.endsWith("p=federations")) {
                federationFrontPage();
            }
        } else if (uri.search("/?p=players") > -1) {
            squadInjectInformationToSummary();
            squadInjectInformationToProfiles();
        } else if (uri.search("mid=") > -1) {
            matchInjectTeamValues();
        } else if (uri.search("/?p=match") > -1 && !uri.search("&sub=result") > -1) {
            matchInjectInProgressResults();
        } else if (uri.search("/?p=league") > -1) {
            tableInjectTopPlayersToOfficialLeague();
            scheduleInjectColoringToOfficialLeague();
        } else if (uri.search("/?p=friendlyseries") > -1) {
            tableInjectTopPlayersInfoToFriendlyLeague();
        } else if (uri.search("/?p=cup&") > -1 || uri.search("/?p=private_cup&") > -1) {
            tableInjectTopPlayersInfoToCup();
        } else if (uri.search("/?p=transfer") > -1) {
            if (uri.search("/?p=transfer&sub=yourplayers") > -1) {
                mazyar.monitorInject();
            } else {
                if (mazyar.isTransferFiltersEnabled()) {
                    transferInject();
                }
                mazyar.executeTransferTasks();
            }
        } else if (uri.search("/?p=clubhouse") > -1) {
            if (mazyar.mustHelpWithPredictor()) {
                predictorInject();
            }
        } else if (isVisitingTeamPage()) {
            addTrophyCountToClubPage();
        } else if (uri.search("/?p=trainers") > -1) {
            if (mazyar.mustAddCoachSalaries()) {
                trainersAddRequestedSalaries();
            }
        } else if (uri.search("/?p=training_report") > -1) {
            trainingAddCampOpenerToReport();
            trainingAddDays();
        } else if (uri.search("/?p=rank&sub=userrank") > -1) {
            rankingInjectSquadValue();
        }
    }

    if (document.readyState === "loading") {
        // Loading hasn't finished yet
        document.addEventListener("DOMContentLoaded", () => {
            inject();
        });
    } else {
        // `DOMContentLoaded` has already fired
        inject();
    }

})();
