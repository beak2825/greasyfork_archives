// ==UserScript==
// @name         Steam Free Licenses Cleaner
// @namespace    TypeNANA
// @version      0.2
// @description  批量自定义删除账号中的免费凭证
// @author       TypeNANA
// @match        https://store.steampowered.com/account/licenses/
// @downloadURL https://update.greasyfork.org/scripts/371137/Steam%20Free%20Licenses%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/371137/Steam%20Free%20Licenses%20Cleaner.meta.js
// ==/UserScript==
(function () {
    function RemoveChecked() {
        var checkedList = [];
        for (var i in document.getElementsByClassName("freeLicenses")) {
            if (document.getElementsByClassName("freeLicenses")[i].checked) checkedList.push(document.getElementsByClassName("freeLicenses")[i].id);
        }
        if (checkedList.length != 0) removePackageAndQueueNext(checkedList, 0);
    }
    function CheckAll() {
        var checked = document.getElementById('checkAll').checked;
        for (var i in document.getElementsByClassName("freeLicenses")) {
            document.getElementsByClassName("freeLicenses")[i].checked = checked;
        }
    }
    var modal;
    function removePackageAndQueueNext(packages, index) {
        if (index >= packages.length) {
            location.reload();
            return;
        };
        if (packages[index] == undefined) {
            removePackageAndQueueNext(packages, index + 1);
            return;
        }
        modal = ShowBlockingWaitDialog('请求中', '删除凭证中，已完成' + (index) + "/" + packages.length);
        $J.ajax({
            url: 'https://store.steampowered.com/account/removelicense',
            type: 'POST',
            data:
                {
                    sessionid: encodeURIComponent(g_sessionID),
                    packageid: encodeURIComponent(packages[index])
                },
            success: function (response) {
                if (response.success == 1) {
                    modal.Dismiss();
                    removePackageAndQueueNext(packages, index + 1);
                } else {
                    modal.Dismiss();
                    ShowAlertDialog('错误', '处理请求时遇到一个错误：' + response.success);
                }
            }
        });
    }
    var flag = false;
    function SetPage() {
        if (flag) return;
        var PACKAGE_ID_REGEX = /javascript:\s*RemoveFreeLicense\s*\(\s*(\d+)/;
        var rows;
        var licensesTable = document.getElementsByClassName("account_table")[0];
        rows = licensesTable.rows;
        rows[0].cells[1].innerHTML = '<input id="checkAll" type="checkbox" style="vertical-align: middle;"  checked/><label for="checkAll" style="margin-right:25px">全选</label>' + rows[0].cells[1].innerHTML;

        for (var i = 1, l = rows.length; i < l; i++) {
            if (rows[i].cells[1].textContent.indexOf("移除") == -1) {
                rows[i].style.display = 'none';
            } else {
                var packageId = PACKAGE_ID_REGEX.exec(rows[i].cells[1].innerHTML)[1];
                rows[i].cells[1].innerHTML = '<input class="freeLicenses" id="' + packageId + '" type="checkbox" style="vertical-align: middle;"  checked/>' + rows[i].cells[1].innerHTML;
            }
        }
        var target = document.getElementsByClassName("account_table_ctn")[0];
        target.innerHTML += '<div class="page_content" style="text-align: right;margin-top:20px;"><a id="removeAll" class="btn_darkblue_white_innerfade" style="padding: 0 15px;font-size: 15px;line-height: 30px;">移除选定游戏</a></div>'

        document.getElementById("removeAll").onclick = function () {
            RemoveChecked();
        };
        document.getElementById("checkAll").onchange = function () {
            CheckAll();
        };
        flag = true;
    }
    function SetBtn() {
        var page_content = document.getElementsByClassName("page_content")[0];
        page_content.innerHTML += '<div style="text-align: right;height: 30px;margin-top: -30px;"><a id="manageLicenses" class="btn_darkblue_white_innerfade" style="padding: 0 15px;font-size: 15px;line-height: 30px;">管理免费凭证</a></div>';
        document.getElementById("manageLicenses").onclick = function () {
            SetPage();
        };
    }
    SetBtn();
})();