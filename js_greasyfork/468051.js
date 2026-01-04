// ==UserScript==
// @name         NetStrEncryptor
// @namespace    https://ez118.github.io/
// @version      0.2
// @description  加密为需要远程链接字典的密文，即远程网页变化密文就不再能被解密
// @author       ZZY_WISU
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAAxdJREFUWEftlkFrU0EUhWtC0rSCP0FBbCouXHTR/yCITV2IuOhOTFWaWimEtm67NZGmcecvEKQLhTYqKE3dubUL265DEdOAQoh93m868xjfu0kKXdRFDxwY5k5y7tx7Zt4MnOG/xfla5XpmozI1VKtOXnlbvmCnQ1z79fni6M/6PcjYTofgN0vBbm7pcGdq4XBvzE73Bz/MvK9sDH94GTgO1qo/SMQsCIJEtrm1LOxcbX0JIGPmiLEE4fk/31vPgr3AcfFwd03bSAxRcY9tSWJ8pLn11AlHSYzd+sI+ScLK6KDsinDITG31tey0oYlDYoho4o4920HPNWGPbU3YZ7T0UeIJKxcHfVZEQ0r82+jBlioM8cJ8Z2dbE3bEH1YuDkyC4TRxmNlYLWYP6uuaOCS2GOwWNWFIdfoa0VahHRMXc176+CrDkdN8wBwx1kiZN7UEeu7eB27HcEPvyr8pOzvnj23Y3AEjzfrK5f1P+5CxfxewlkrQDnaNMY9/F8hZTpcLc6nnhcbgi9kAyng9U5oJBYZrqzdIzFXHjGXOhk2CtMP5hepwRN090ROp0syyE/ZJQiSBkN+afyixbi2yiSxbGR0IpEuFjpYAlORW/J1HSUxEqpo4lFjHb1UMqdKTu5qwY7oyt68J+8QTmrhjtlW/Y+XiOPUETtoCuUO+nqgF4FRNaBA5hlSk3zFk58zZcHgM2bEVbmSb9dljHUOQun9z7Fw+t5Z8lGslH9/eTuQnFvyLyLSqXKjiCUMZ+wmylsvLJtmWS+2NjMdtuDeS0xO55MPJIMrEg9ym+WMRctXRWsQaUxG/NUfkPXH0qOkGPhRm10oCMJHPFWlHVNzRtEp2rogb8qHr+THqtvuQ0g5N2BG/9Dolhp5XYkhM35pShR2lOpqwTz5gqrAljx4rFwfmU4UtMabWf0fjAzGcJuzIs8/K6TDuV8QhCXJENXFIDLeLUOw9AUnOynQHJoklgTHFH2aBnGUuK//GNHeFzLlzjtujLyvE+76GfLBb4wkR1n5ojqN8O6B/BzjwGwxHz/uW/Qynh4GBv0DJSVGh5ezOAAAAAElFTkSuQmCC
// @license      GNU GPLv3
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      *
// @require      https://greasyfork.org/scripts/456485-pops/code/pops.js?version=1187390
// @downloadURL https://update.greasyfork.org/scripts/468051/NetStrEncryptor.user.js
// @updateURL https://update.greasyfork.org/scripts/468051/NetStrEncryptor.meta.js
// ==/UserScript==




function GetAjax(func, url) {
    GM_xmlhttpRequest({
        method: "GET", url: url, data:"",
        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
        onload: function(response){func(response.responseText);}, onerror: function(response){alert("[错误]\n请求失败");}
    });
}
function jsprompt(text, func, default_text){
    if(default_text == null || default_text == undefined) { default_text = ""; }
    pops.prompt({
        position: "center",
        closeEnable: true,
        mask: true,
        only: true,
        title: {
            text: text,
            position: "center",
        },
        content: {
            placeholder: "Input Here...",
            text: default_text,
            row: true /* 多行 */,
            focus: true /* 输入框自动聚焦 */,
        },
        btn: {
            ok: {
                callback: (event) => {
                    event.close();
                    func(event)
                },
            }
        }
    });
}
function jsalert(title,text){
    pops.alert({
        mask: true,
        only: true,
        title: {
            text: title,
            position: "left",
            html: false,
            /* true是不添加p标签，false是添加p标签 */
        },
        content: {
            text: text,
            html: false,
            /* true是不添加p标签，false是添加p标签 */
        },
        btn: {
            position: "center",
            /* center、flex-start、flex-end、space-between、space-around、space-evenly */
            ok: {
                /* 是否启用 */
                enable: true,
                text: "OK",
                type: "primary" /* 按钮样式 */,
                callback: function (event) {
                    event.close();
                },
            }
        }
    });
}

var Current_Dict = "";
var DefaultDict = "asdf1234ghjk5678lqwe90-=rtyu[]\\;iopz',./xcvb`~!@nmMN#$%^BVCX&*()ZLKJ_+{}HGFD|:\"<SAQW>?ERTY UIOP";

function encode(st) {
    return btoa(encodeURIComponent(st));
}

function decode(st) {
    return decodeURIComponent(atob(st));
}

function hex2int(num) {
    return parseInt(num, 16);
}

function int2hex(num) {
    let ss = num.toString(16);
    if (ss.length < 2) {
        ss = "0" + ss;
    }
    return ss;
}

function CreateDict(url, func) {
    let dic = "";
    GetAjax(function(result){
        let codes = result.replace(/\\n/g,"");
        codes = codes.replace(/[\u4e00-\u9fa5]/g,'');
        codes = encode(url) + encode(codes) + DefaultDict;

        for (let i = 0; i < codes.length; i++) {
            if (dic.indexOf(codes.charAt(i)) >= 0) {
                continue;
            } else {
                dic += codes.charAt(i);
            }
        }
        Current_Dict = dic;
        func(dic)
    }, url);
}

function NetEncode(dic, txt) {
    let final_txt = "";
    const orig_txt = encode(txt);

    for (let i = 0; i < orig_txt.length; i++) {
        if (dic.indexOf(orig_txt.charAt(i)) >= 0) {
            final_txt += int2hex(dic.indexOf(orig_txt.charAt(i)));
        } else {
            final_txt += "**";
        }
    }

    final_txt = encode(final_txt);
    return final_txt;
}

function NetDecode(dic, txt) {
    let final_txt = "";
    const orig_txt = decode(txt).replace("**", "");

    for (let i = 1; i < orig_txt.length; i += 2) {
        try {
            final_txt += dic[hex2int(orig_txt.charAt(i - 1) + orig_txt.charAt(i))];
        } catch {
            continue;
        }
    }

    final_txt = decode(final_txt);
    return final_txt;
}


let menu1 = GM_registerMenuCommand('加密', function () {
    let branchURL = GM_getValue("branchURL"); /*prompt("URL: ");*/
    CreateDict(branchURL, function(){
        jsprompt("待加密文本", function(orig_txt){
            jsalert("加密结果", NetEncode(Current_Dict, orig_txt.text));
        });

    });
}, 'E');
let menu2 = GM_registerMenuCommand('解密', function () {
    let branchURL = GM_getValue("branchURL"); /*prompt("URL: ");*/
    CreateDict(branchURL, function(){
        jsprompt("待解密文本", function(orig_txt){
            jsalert("解密结果", NetDecode(Current_Dict, orig_txt.text));
        });
    });
}, 'D');
let menu3 = GM_registerMenuCommand('设定加解密字典链接', function () {
    jsprompt("设定加解密字典链接", function(orig_txt){
        GM_setValue("branchURL", orig_txt.text);
        console.log("字典链接设置成功");
    }, GM_getValue('branchURL'));
}, 'D');


(function() {
    'use strict';
    if(GM_getValue('branchURL') == null || GM_getValue('branchURL') == "" || GM_getValue('branchURL') == undefined){ GM_setValue('branchURL', "https://www.cnblogs.com/"); }
})();