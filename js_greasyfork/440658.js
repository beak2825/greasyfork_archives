// ==UserScript==
// @name         byrpt北邮人一键复制直链
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  One click to copy the download link!
// @author       Wind
// @match        http://*/*
// @include      http*://byr.pt*/details.php*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440658/byrpt%E5%8C%97%E9%82%AE%E4%BA%BA%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/440658/byrpt%E5%8C%97%E9%82%AE%E4%BA%BA%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var download_php;
    $('#outer>table:nth-child(2)>tbody>tr:nth-child(5)> td.rowfollow> a:nth-child(1)').each(function () {
        var rowf=$(this);
        download_php=rowf.attr("href");
    });

    var final_download_link=download_php+"&passkey=手动替换成你的passkey" // 填写你的passkey
    var add_to_page = '&nbsp;|&nbsp;<a title="链接中包含个人秘钥Passkey，切勿泄露！" href="' + final_download_link + '" onclick="return false" id="direct_link" data-clipboard-text="' + 'https://byr.pt/' + final_download_link+'"><b>左键单击复制种子直链</b></a>';

    $('table.mainouter td.outer tr:eq(3) td.rowfollow a:eq(1)').after(add_to_page);

    $('#direct_link').click(function(){
        var dlink = document.getElementById("direct_link");
        var content=dlink.getAttribute('data-clipboard-text');
        var aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        if (message == null) {
            alert("复制成功");
        } else{
            alert("复制失败");
        }
    });
})();