// ==UserScript==
// @name         巴哈姆特之一鍵自推自刪
// @description  點一下就能自推文章後自刪，適合實況文自推之類的場合。細節請見homepage內的介紹文。
// @namespace    nathan60107
// @version      1.6
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      https://forum.gamer.com.tw/C.php*
// @downloadURL https://update.greasyfork.org/scripts/377964/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E4%B8%80%E9%8D%B5%E8%87%AA%E6%8E%A8%E8%87%AA%E5%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/377964/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E4%B8%80%E9%8D%B5%E8%87%AA%E6%8E%A8%E8%87%AA%E5%88%AA.meta.js
// ==/UserScript==

//=====================以下內容可修改====================

var content = "自推";//自推文的內文，使用者可以自由把自推二字改成其他文字內容(雙引號請勿刪除)。
var selfDel = true;//控制自推後是否自刪的參數，如果不需要自刪請將true改成false。
var goBackToList = true;//控制流程結束後是否回到B頁文章列表(以供使用者檢查自推是否成功)。

//=====================以上內容可修改====================

function getVal(input) {
	return document.getElementsByName(input)[0].value;
}

function goback(){//回到B頁文章列表
    if(goBackToList==true){
        location.href = document.getElementsByClassName("goback")[0].href;
    }
}

function showErrorMsg(input){//顯示錯誤訊息用
    var msg = input.match(`訊息</h1>
<p>.*</p>`)[0];
    msg = msg.slice(11, msg.length-4);
    toastr.warning(msg);
}

function delPost(input){//刪除自推文章
    var ma = input.match(/&sn=\d+/g);//開始解析刪文網址
    var sn = ma[ma.length-1].slice(4);

    var S = pdel.toString();
    var start = S.match(/'bsn/), end = S.match(/';\ndel/);
    S = S.slice(start.index, end.index+1);
    S = S.replace("+ sn +", "+ "+sn+" +");
    var params = eval(S);

    jQuery.ajax({
        type: "GET",
        url: "post2.php?"+params,
        success: function (rt) {
            if(rt.match(`訊息`)!=null){//處理自刪失敗
                showErrorMsg(rt);
                return;
            }
            goback();
        },
        error: function (errMsg) {
            toastr.warning("自刪失敗，未知的錯誤。");
        },
    });
}

function selfPush(){//自推文章
    jQuery.ajax({
        type: "POST",
        data: {
            rtecontent: "[div]"+content+"[/div]",
            pwd: getVal("pwd"),
            type: getVal("type"),
            code: getVal("code"),
            subbsn: getVal("subbsn"),
            title: getVal("title"),
            sign: getVal("sign"),
            ptype: getVal("ptype"),
            bbsign: getVal("bbsign"),
            ccsign: getVal("ccsign"),
        },
        url: document.frm.action,
        success: function (rt) {
            if(rt.match(`系統訊息`)!=null){//處理發文失敗
                showErrorMsg(rt);
                return;
            }else if(selfDel==false){//若不自刪則直接返回
                goback();
                return;
            }else{
                delPost(rt);//執行刪文動作
            }
        },
        error: function (errMsg) {
            toastr.warning("自推失敗，未知的錯誤。");
        },
    });
}


(function() {
    'use strict';
    //建立按鈕
    jQuery(".BH-menu-forumA-right").parent().append("<li class=\"BH-menu-forumA-right material-icons selfPush\"><a><i>speaker_notes_off</i></a></li>");
    jQuery(".selfPush").click(selfPush);
})();