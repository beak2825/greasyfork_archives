// ==UserScript==
// @name         Steam Group Cleaner
// @namespace    TypeNANA
// @version      0.2
// @description  批量自定义取消关注Steam组
// @author       TypeNANA
// @match        https://steamcommunity.com/id/*/groups/
// @match        https://steamcommunity.com/profiles/*/groups/
// @downloadURL https://update.greasyfork.org/scripts/371134/Steam%20Group%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/371134/Steam%20Group%20Cleaner.meta.js
// ==/UserScript==
(function () {
    function delGroups() {
        var checkBoxs = document.getElementsByClassName("groupCheck");
        var list = [];
        for (var i in checkBoxs) {
            if (checkBoxs[i].checked) {
                list.push(checkBoxs[i].id);
            }
        }
        webRequest(list, 0);
    }
    var modal;

    function webRequest(packages, index) {
        if (index >= packages.length) {
            location.reload();
            return;
        };
        if (packages[index] == undefined) {
            webRequest(packages, index + 1);
            return;
        }
        modal = ShowBlockingWaitDialog('请求中', '退出选定组中，已完成' + (index) + "/" + packages.length);
        var url = window.location.href.replace("/groups/", "/friends/action");
        jQuery.post(url, {
            action: "leave_group",
            ajax: "1",
            sessionid: g_sessionID,
            steamid: g_steamID,
            "steamids[]": packages[index],
        }).done(function (res) {
            modal.Dismiss();
            webRequest(packages, index + 1);
        });
    }

    function checkAll() {
        var checkBoxs = document.getElementsByClassName("groupCheck");
        var flag = document.getElementById("checkAll").checked;
        for (var i in checkBoxs) {
            checkBoxs[i].checked = flag;
        }
    }

    function SetPage() {
        var reg = /ConfirmLeaveGroup\(\s*'(\d+)\s*'\s*/;
        var rows = document.getElementsByClassName("group_block");
        for (var i = 0, l = rows.length; i < l; i++) {
            var groupId = reg.exec(rows[i].innerHTML)[1];
            rows[i].innerHTML = '<input class="groupCheck" id="' + groupId + '" type="checkbox"  style="position:absolute;top:0;right:0;height:20px;width:20px"/>' + rows[i].innerHTML;
        }
        var page_content = document.getElementById("search_results");
        page_content.innerHTML += '<div style="text-align: right;width: 100%;margin-top:20px"><input id="checkAll" type="checkbox" style="vertical-align:middle;height:20px;width:20px;"><label for="checkAll" style="margin-right:15px;">全选</label><a id="delGroups" class="btn_darkblue_white_innerfade" style="padding: 0 15px;font-size: 15px;line-height: 30px;">退出选定组</a></div>';

        document.getElementById("delGroups").onclick = function () {
            delGroups();
        };
        document.getElementById("checkAll").onchange = function () {
            checkAll();
        };
    }
    SetPage();
})();