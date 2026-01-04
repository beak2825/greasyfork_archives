// ==UserScript==
// @name         css-巴哈姆特開關廣場聊天室
// @namespace    minorainy
// @version      1.0.1
// @author       minorainy(MinoRaiNy)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=r831113
// @match        https://forum.gamer.com.tw/B.php*
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @grant        none
// @description  BAHA Chatroom Switch
// @downloadURL https://update.greasyfork.org/scripts/373521/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%96%8B%E9%97%9C%E5%BB%A3%E5%A0%B4%E8%81%8A%E5%A4%A9%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/373521/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%96%8B%E9%97%9C%E5%BB%A3%E5%A0%B4%E8%81%8A%E5%A4%A9%E5%AE%A4.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var _defaultmode = "hide";
    var _ShowBlackList = [];
    var _HideWhiteList = [];
    var _HideSideChat = false;
    var _searchpart = location.search.split("&");
    var _searchpart2 = _searchpart[0].split("=");
    var _bsn = _searchpart2[1];

    if(location.pathname == "/B.php" && _defaultmode == "hide" && _HideWhiteList.indexOf(_bsn) == -1 || location.pathname == "/B.php" && _defaultmode == "show" && _ShowBlackList.indexOf(_bsn) != -1) {
        var _creatediv = document.createElement("div");
        _creatediv.id ="toggle_button";
        _creatediv.setAttribute("align", "center");
        document.getElementById("chatRoom").insertAdjacentHTML('beforebegin',_creatediv.outerHTML);
        let changed = false
        let interval = setInterval(() => {
            console.log(document.getElementById('chatRoom'))
            if (document.getElementById('chatRoom').style.height != "0px") {
                changed = true
                document.getElementById("chatRoom").style.height = "0px";   
            }
        }, 500)
        _createButton("show_chat_button", "開啟廣場聊天室", "toggle_button");
        let button = document.getElementById("show_chat_button")
        document.getElementById("show_chat_button").onclick = function() {
            clearInterval(interval)
            if(document.getElementById("chatRoom").style.height =="0px") {
                button.innerHTML = "關閉廣場聊天室";
                var _removechatroom = document.getElementById("chatRoom").style.height = "450px";
                var _removeaccogrouplist = document.getElementsByClassName("BH-rbox BH-list1 FM-rbox16");
                for(var x=_removeaccogrouplist.length-1;x>=0;x--) {
                    if(_removeaccogrouplist[x] && _removeaccogrouplist[x].parentElement) {
                    }
                }
                var _removeaccogroup = document.getElementsByTagName("h5");
                for(var i=_removeaccogroup.length-1;i>=0;i--) {
                    if(_removeaccogroup[i] && _removeaccogroup[i].parentElement && _removeaccogroup[i].innerHTML == "相關群組") {
                        _removeaccogroup[i].parentElement.removeChild(_removeaccogroup[i]);
                    }
                }
            } else {
                var _createchatroom = document.createElement("div");
                _createchatroom.id ="chatRoom";
                _createchatroom.setAttribute("style", "margin-bottom:10px;");
                document.getElementById("chatRoom").style.height = "0px";
                button.innerHTML = "開啟廣場聊天室";

                var im_forum = new BAHA_IM_FORUM('forum',{bsn:_bsn});
            }
        };
    }

    if(_HideSideChat === true) {
        var element = document.getElementById("btn_quick");
    }
})();
function _createButton(_id, _text, _place) {
    var _create = document.createElement("BUTTON");
    _create.id = _id;
    _create.appendChild(document.createTextNode(_text));
    document.getElementById(_place).appendChild(_create);
}