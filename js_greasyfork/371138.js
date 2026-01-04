// ==UserScript==
// @name         Steam WishList Cleaner
// @namespace    TypeNANA
// @version      0.3
// @description  批量自定义清除Steam愿望单
// @author       TypeNANA
// @match        https://store.steampowered.com/wishlist/*
// @downloadURL https://update.greasyfork.org/scripts/371138/Steam%20WishList%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/371138/Steam%20WishList%20Cleaner.meta.js
// ==/UserScript==
(function () {
    function checkAll() {
        var flag = document.getElementById("checkAll").checked;
        for (var i in g_Wishlist.rgElements) {
            var checkBox = g_Wishlist.rgElements[i][0].getElementsByClassName("gameCheck")[0];
            checkBox.checked = flag;
        }
    }
    function delGame() {
        var list = [];
        for (var i in g_Wishlist.rgElements) {
            var checkBox = g_Wishlist.rgElements[i][0].getElementsByClassName("gameCheck")[0];
            if (checkBox.checked) {
                list.push(checkBox.id);
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
        modal = ShowBlockingWaitDialog('请求中', '删除愿望单中，已完成' + (index) + "/" + packages.length);
        jQuery.post(g_strWishlistBaseURL + 'remove/', {
            appid: packages[index],
            sessionid: g_sessionID
        }).done(function (res) {
            modal.Dismiss();
            webRequest(packages, index + 1);
        });
    }
    var flag = false;
    function SetPage() {
       if(flag) return;
        for (var i in g_Wishlist.rgElements) {
           g_Wishlist.rgElements[i][0].childElements()[2].innerHTML += '<input class="gameCheck" id="' + i + '" type="checkbox" style="position:absolute;top:0;right:0;height:20px;width:20px"/>';
        }
        var page_content = document.getElementById("footer_spacer");
        page_content.innerHTML += '<div class="page_content" style="text-align: right;"><input id="checkAll" type="checkbox"  style="vertical-align:middle;height:20px;width:20px;"><label for="checkAll" style="margin-right:15px;">全选</label><a id="delGames" class="btn_darkblue_white_innerfade" style="padding: 0 15px;font-size: 15px;line-height: 30px;">移除选定游戏</a></div>';
        document.getElementById("delGames").onclick = function () {
            delGame();
        };
        document.getElementById("checkAll").onchange = function () {
            checkAll();
        };
        flag = true;
    }
    function SetBtn(){
        var page_content = document.getElementsByClassName("wishlist_header")[0];
        page_content.innerHTML += '<div style="position: absolute; right: 0; height: 30px; top: 18px;"><a id="manageLicenses" class="btn_darkblue_white_innerfade" style="padding: 0 15px;font-size: 15px;line-height: 30px;">自定义批量删除</a></div>';
        document.getElementById("manageLicenses").onclick = function () {
            SetPage();
        };
    }
    SetBtn();
})();