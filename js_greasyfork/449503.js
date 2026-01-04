// ==UserScript==
// @name         hipda-cue
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接@用户
// @author       屋大维
// @license      MIT
// @match        https://www.4d4y.com/*
// @icon         https://icons.iconarchive.com/icons/ampeross/qetto-2/48/mail-icon.png
// @resource     IMPORTED_CSS https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.13.0/jquery-ui.js
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/449503/hipda-cue.user.js
// @updateURL https://update.greasyfork.org/scripts/449503/hipda-cue.meta.js
// ==/UserScript==
(function() {
    'use strict';


    // Your code here...
    // CSS
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    GM_addStyle(".no-close .ui-dialog-titlebar-close{display:none} textarea{height:100%;width:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box} .card{box-shadow:0 4px 8px 0 rgba(0,0,0,.2);transition:.3s;width:100%;overflow-y: scroll;}.card:hover{box-shadow:0 8px 16px 0 rgba(0,0,0,.2)}.container{padding:2px 16px}");
    GM_addStyle(".flex-container{display:flex;flex-wrap: wrap;}.flex-container>div{background-color:#f1f1f1;width:500px;max-height:500px;margin:15px; padding:5px;text-align:left;}");

    // consts
    const StorageId = "hipda-cue";
    const HistoryId = "hipda-cue-history";


    // This script is like a recursion function
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('cue')) {
        let cue = searchParams.get('cue')
        $("body").find("#pmsendmessage").val(cue);
        $("body").find("#sendpm_submit").click(); // will redirect to https://www.4d4y.com/forum/pm.php?action=send&pmsubmit=yes&infloat=yes&sendnew=yes
        alert("已经通过短消息@了他！");
    } else if (!searchParams.has("pmsubmit")) {
        // do not mount iframe after message submission
        main();
    }


    // helpers
    function getThreadTitle() {
        let l = $('#nav').text().split(" » ");
        return l[l.length - 1];
    }
    // ID collector
    async function collectIds() {
        // {uid: name}
        let dict = {};
        $('#postlist > div').get().forEach(div => {
            let name = $(div).find("div.postinfo > a").first().text();
            let uid = parseInt($(div).find("div.postinfo > a").first().attr("href").split("uid=")[1]);
            dict[uid] = name;
        });
        let data = await GM.getValue(StorageId, null);
        data = data ? JSON.parse(data) : {}
        data = {
            ...data,
            ...dict
        };
        await GM.setValue(StorageId, JSON.stringify(data));
    }
    async function getIds() {
        // return: [[uid, name],]
        let data = await GM.getValue(StorageId, null);
        data = data ? JSON.parse(data) : {};
        return Object.entries(data);
    }
    async function getHistoryIds() {
        // return: [[uid, name],]
        let data = await GM.getValue(HistoryId, null);
        return data ? JSON.parse(data).data : [];
    }
    async function insertHistoryId(uid, name) {
        // keep up to 5 recent cues
        let data = await getHistoryIds();
        data = [
            [uid, name], ...data
        ];
        data = data.slice(0, Math.min(5, data.length));
        await GM.setValue(HistoryId, JSON.stringify({
            data
        }));
    }

    // message tools
    function send_message(uid, message) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute("src", `https://www.4d4y.com/forum/pm.php?action=new&uid=${uid}&cue=${encodeURIComponent(message)}`);
        iframe.setAttribute("id", "hpcue");
        iframe.setAttribute("width", "0");
        iframe.setAttribute("height", "0");
        document.body.appendChild(iframe);
    }

    function cue(uid) {
        let title = getThreadTitle();
        let message = `我在《${title}》@了你：${location.href}`;
        send_message(uid, message);
    }
    // UI tools
    function updateHpCueList(userIds, userinput) {
        userIds.filter(ele => {
            return ele[1].indexOf(userinput) !== -1
        }).forEach(ele => {
            let uid = ele[0];
            let name = ele[1];
            let btn = $(`<button style="margin: 5px;">@${name}</button>`)
            btn.on("click", function() {
                let oldVal = $("#fastpostmessage").val();
                oldVal = oldVal[oldVal.length - 1] === "@" ? oldVal.slice(0, oldVal.length - 1) : oldVal;
                let quoteString = `[url=https://www.4d4y.com/forum/space.php?uid=${uid}]@${name}[/url]`
                $("#fastpostmessage").val(oldVal + quoteString);
                // close the dialog
                $(`#hpcue_selector`).dialog("close");
                $("#hpcue_filter").val("");
                $("#hpcue_filter").blur();
                cue(uid);
            });
            $("#hpcue_list").append(btn);
        });
    }
    async function mountUI() {
        // mount user selector
        let userIds = await getIds();
        let historyIds = await getHistoryIds();
        $("body").append(`
              <div id="hpcue_selector" style="display: none;">
                <input id="hpcue_filter" placeholder="搜索用户名"/>
                <div id="hpcue_list"></div>
              </div>
        `);
        updateHpCueList(userIds, "");
        $("#hpcue_filter").on("input", function() {
            // clean existing btns
            $("#hpcue_list").empty();
            // create btns
            let userinput = $(this).val();
            updateHpCueList(userIds, userinput);
        })

        // mount listener on inputs
        $("#fastpostmessage").on("input", function() {
            let userinput = $(this).val();
            if (userinput && userinput[userinput.length - 1] === "@") {
                $(`#hpcue_selector`).dialog({
                    title: `hipda-cue`,
                    dialogClass: "no-close",
                    closeText: "hide",
                    closeOnEscape: true,
                    height: Math.max(parseInt($(window).height() * 0.4), 350),
                    width: Math.max(parseInt($(window).width() * 0.4), 600),
                    buttons: [{
                        text: "取消",
                        click: function() {
                            $(this).dialog("close");
                        }
                    }]
                });
            }
        });


    }

    // main
    async function main() {
        try {
            await collectIds();
        } catch (err) {
            console.log(err);
        }
        mountUI();
    }

})();