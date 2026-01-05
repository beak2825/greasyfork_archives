// ==UserScript==
// @name        新浪秀场自动回复
// @namespace   https://greasyfork.org/scripts/4552-新浪秀场自动回复
// @description 在新浪秀场自动回复指定对话。
// @author      softiger
// @version     1.0
// @include     http://ok.sina.com.cn/9*
// @grant       none
// @history     1.0 Initial release.
// @downloadURL https://update.greasyfork.org/scripts/4552/%E6%96%B0%E6%B5%AA%E7%A7%80%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/4552/%E6%96%B0%E6%B5%AA%E7%A7%80%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

var ul_i = 3;
var count = 15;
var reply_i = 0;
var chkqqh = false;
var myInterval = setInterval( function() {myTimer();}, 3000);
var flag = 1;
var diff = 2;
var el_privatelogs = document.getElementById("privatelogs");
var el_chkqqh = document.getElementById("chkqqh");

function myStopInterval() {
    clearInterval(myInterval);
}

function autoReply(ul_tag) {
    if (reply_i == 0) {
        reply_i = 1;
        if (el_chkqqh.checked) {
            el_chkqqh.click();
            chkqqh = true;
        }
        var replyInterval = setInterval( function() {
            ul_tag.getElementsByClassName("user")[0].click();
            document.getElementById("fsxx").click();
            document.getElementById("txtmsg").value = reply_i;
            document.getElementById("btnsend").click();
            reply_i++;
            if (reply_i > 5) {
                clearInterval(replyInterval);
                if (chkqqh) {
                    el_chkqqh.click();
                    chkqqh = false;
                }
                reply_i = 0;
            }
        }, 4000);
    }
    else
        setTimeout( function() {autoReply(ul_tag);}, 21000);
}

function simulateMouseOver(elem) {
    if (document.createEvent) {
        var evObj = document.createEvent("MouseEvents");
        evObj.initEvent("mouseover", true, false);
        elem.dispatchEvent(evObj);
    }
    else if (document.createEventObject) {
        elem.fireEvent("onmouseover");
    }
}

function myTimer() {
    var el_ul = el_privatelogs.getElementsByTagName("ul")[ul_i];
    if (el_ul) {
        var str_el_ul = el_ul.innerHTML;
        var n1 = str_el_ul.lastIndexOf("做任务");
        var n2 = str_el_ul.lastIndexOf("求回复");
        var n3 = str_el_ul.lastIndexOf("说：1234");
        if (n1 != -1 || n2 != -1 || n3 != -1) {
            autoReply(el_ul);
            if (flag == 4) {
                myStopInterval();
                myInterval = setInterval( function() {myTimer();}, 3000);
                flag = 1;
                diff = 2;
                count = 12;
            }
        }
        if (ul_i < 49)
            ul_i++;
        else {
            simulateMouseOver(el_privatelogs);
            document.getElementById("pmgd_config").getElementsByTagName("a")[0].click();
            if (!el_privatelogs.getElementsByTagName("ul")[ul_i])
                ul_i = 1;
        }
        if (count < 12) {
            count = count + flag + diff;
            if (count >= 12 && flag == 4) {
                myStopInterval();
                myInterval = setInterval( function() {myTimer();}, 3000);
                flag = 1;
                diff = 2;
            }
        }
    }
    else {
        if (count > 0) {
            count = count - flag;
            if (count <= 0 && flag == 1) {
                myStopInterval();
                myInterval = setInterval( function() {myTimer();}, 12000);
                flag = 4;
                diff = 0;
            }
        }
    }
}
