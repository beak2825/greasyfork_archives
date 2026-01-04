// ==UserScript==
// @name        雙語翻譯Ver001
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/12/27 上午9:57:11
// @require http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @LiconMIT
// @downloadURL https://update.greasyfork.org/scripts/457294/%E9%9B%99%E8%AA%9E%E7%BF%BB%E8%AD%AFVer001.user.js
// @updateURL https://update.greasyfork.org/scripts/457294/%E9%9B%99%E8%AA%9E%E7%BF%BB%E8%AD%AFVer001.meta.js
// ==/UserScript==

//滑鼠放開時
var tempEve = null;
var selectionRange = "";
document.onmouseup = function (ev) {
    console.log('點擊放開');
    tempEve = ev;
    console.log(ev);
    console.log(keyCodeArry);
    selectionRange = "";
    if (document.getSelection) {
        console.log("選取文字:");
        selectionRange = document.getSelection().toString();
        console.log(selectionRange);
        console.log(keyCodeArry.includes(18));
        //同時按下左ALT時翻譯
        if (keyCodeArry.includes(18)) {
            getActiveText(ev);
        }
    }

    //getActiveText(ev);
};
// if (!document.all){
//   console.log('???');
//   document.captureEvents(Event.MOUSEUP);
// }
var keyCodeArry = [];
document.onkeydown = function (ev) {
    //鍵盤按下
    var oEvent = ev || event;
    keyCode = oEvent.keyCode;
    keyCodeArry = addKeyCodeArry(keyCode, keyCodeArry);
    //console.log(keyCodeArry);
}
document.onkeyup = function (ev) {
    //鍵盤放開
    var oEvent = ev || event;
    keyCode = oEvent.keyCode;
    keyCodeArry = deletKeyCodeArry(keyCode, keyCodeArry);
    //console.log(keyCodeArry);
}
function addKeyCodeArry(num, arr) {
    var check = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == num) {
            check = 1;
        }
    }
    if (check == 0) {
        arr.push(num);
    }
    return arr;
}
function deletKeyCodeArry(num, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == num) {
            arr.splice(i, 1);
        }
    }
    return arr;
}
function getActiveText(e) {
    console.log(e);
    //取得整行文字
    var text = document.getSelection();
    //document.theform.text.value = text;
    //console.log(text);
    var a = text.focusNode.data;
    console.log("取得整行文字:" + a);
    if (a == null) {
        console.log('沒有選擇文字');
        return;
    }
    //判斷是否翻譯過
    var endR = $(e.target).attr('dataTranslateOk');
    console.log(endR);
    if (endR == null || endR == '') {
        console.log('翻譯文字:' + a);
        $(e.target).attr('dataTranslateOk', 'Y');
        // $.ajax({
        //     url: 'https://api.interpreter.caiyunai.com/v1/translator',
        //     type: 'POST',
        //     beforeSend:function(xhr){
        //     xhr.setRequestHeader('X-Authorization','token lqkr1tfixq1wa9kmj9po');
        //     xhr.setRequestHeader('Authorization','Basic caiyun:appleapple');
        //     },
        //     data: {
        //     "cached": true,
        //     "dict": true,
        //     "media": "text",
        //     "os_type": "web",
        //     "replaced": true,
        //     "request_id": "web_fanyi",
        //     "source": a,
        //     "trans_type": "ja2zh"
        //     },
        //     cache: false,
        //     success: function (data) {
        //         var s = JSON.stringify(data);
        //         console.log(s);
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //       console.log(xhr);
        //     }
        // });
        let control = GM_xmlhttpRequest({
            method: "POST",
            url: 'https://api.interpreter.caiyunai.com/v1/translator',
            data: JSON.stringify({
                "cached": true,
                "dict": true,
                "media": "text",
                "os_type": "web",
                "replaced": true,
                "request_id": "web_fanyi",
                "source": a,
                "trans_type": "ja2zh"
            }),
            headers: {
                "X-Authorization": 'token lqkr1tfixq1wa9kmj9po',
                "Content-Type": 'application/json',
                "Authorization": 'Basic caiyun:appleapple',
                "Connection": 'keep-alive'
            },
            onload: function (r) {
                 console.log(r);
                if (r.status == "200") {
                    var rst = JSON.parse(r.responseText);
                    // console.log(rst);
                    console.log(rst.target);
                    // var str_s = unicode2string(rst.target);
                    // console.log(str_s);
                    // addItem.target.Text = "rst.target";
                    //複製目前目標
                    var targetElement = e.target;
                    //修改內容
                    clone = targetElement.cloneNode(true);
                    $(clone).css({
                        "background-color": "#333",
                        color: "#fff",
                    });
                    console.log(clone);
                    clone.innerHTML = rst.target;
                    //放入目前目標之下
                    targetElement.appendChild(clone);
                } else {
                    console.log("翻譯API錯誤");
                    $(e.target).attr('dataTranslateOk', '');
                }

            },
            onabort: function (r) {
                console.log(r);
                console.log("翻譯API錯誤");
                $(e.target).attr('dataTranslateOk', '');
            },
            onerror: function (r) {
                console.log(r);
                console.log("翻譯API錯誤");
                $(e.target).attr('dataTranslateOk', '');
            }
        });
    } else {
        console.log('已翻譯過跳過~');
    }

    // var addItem = e.srcElement.cloneNode();
    // console.log(addItem);
    // //複製目前目標
    // var targetElement = e.target;
    // clone = targetElement.cloneNode(true);
    // 放入目前目標之下
    // targetElement.appendChild(clone);
    // //   $(".labels").css({
    // //   "background-color": "#eeeeee",
    // //   color: "#333",
    // // });
    return true;
}

function string2unicode(str) {
    　　var ret = "";
    　　for(var i = 0; i < str.length; i++) {
        　　　　 //var code = str.charCodeAt(i);
        　　　　 //var code16 = code.toString(16);
        //var ustr = "\\u"+code16;
        //ret +=ustr;
        ret += "\\u" + str.charCodeAt(i).toString(16);
    }
    return ret;
}
function unicode2string(unicode) {
    　　return eval("'" + unicode + "'");
}
