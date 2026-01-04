// ==UserScript==
// @name         AutoGetDLC
// @namespace    Violentmonkey Scripts
// @version      1.0
// @license      MIT
// @author       kiwi4814
// @description  2022/5/11 20:39:47
// @match        https://pterclub.com/detailsgame.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/444852/AutoGetDLC.user.js
// @updateURL https://update.greasyfork.org/scripts/444852/AutoGetDLC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $("b:contains('DLC (下载内容)')").after(
        "&nbsp;&nbsp;&nbsp;&nbsp;<button id= 'download-btn'>批量下载</button>"
    );
    var pterUrl = "https://pterclub.com/";
    var _dlc_tr = $("b:contains('DLC (下载内容)')").closest("tr");
    var _dlc_name = "[b]已整合以下DLC：[/b]" + "\n";
    var dlArray = new Array();
    _dlc_tr.nextAll().each(function (index) {
        //$( this ).find('a[title="下载本种"]').find("font").click();
        var hrefHtml = $(this).find('a[title="下载本种"]').attr('href');
        if (hrefHtml !== undefined && hrefHtml != '') {
            dlArray[index] = pterUrl + hrefHtml;
        }
        //var name = $( this ).find('a[title="点击查看此种子详细资料"]');
        var name = $(this).find('div[id="kdescr"]').find("b:eq(0)");
        // if ( name.text() != undefined && name.text() != ''){
        if ( name.text() ){
          _dlc_name += (index + 1) + ". " + name.text() + "\n";
        }
    });
    console.log(_dlc_name);
    
    
    // noty({
    //     text: 'DLC信息已复制！',
    //     timeout: 3500
    // });
    var btn = document.getElementById('download-btn');

    function download(name, href) {
        var a = document.createElement("a"),
            e = document.createEvent("MouseEvents");
        e.initEvent("click", false, false);
        a.href = href;
        a.download = name;
        a.dispatchEvent(e);
    }
    
    function sleep(millisecond) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, millisecond)
        })
    }

    btn.onclick = async function name(params) {
        for (let index = 0; index < dlArray.length; index++) {
            download('第' + index + '个文件', dlArray[index]);
            await sleep(200);
        }
        GM_setClipboard(_dlc_name, 'text');
        btn.after("  DLC信息已复制！");
    }


})();





























