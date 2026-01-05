// ==UserScript==
// @name         open.hiwifi app version edit button
// @namespace    http://note.yurenchen.com/archives/js_snippets.html
// @version      0.1
// @description  open.hiwifi.com version page add "edit" button
// @author       yurenchen
// @match        https://open.hiwifi.com/open.php?m=version&a=show&sid=*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27878/openhiwifi%20app%20version%20edit%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/27878/openhiwifi%20app%20version%20edit%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //删除旧按钮
    $('td:nth-child(8) > a.btn-info').each(function(i,o){
        console.log(i,o.href);
        if(o.innerText.indexOf('修改版本信息')>-1){
            o.remove();
        }
    });
    $('td:nth-child(8) span a.btn-info').each(function(i,o){
        console.log(i,o.href);
        // 发布范围
        o.innerText=o.innerText.replace('更新','');
        // 编辑版本
        var a=document.createElement('a');
        a.href=o.href.replace('mlevel','uploadform');
        a.className='btn btn-info chen';
        a.innerText='edit';
        //a.style.marginRight='5px';
        //a.style.marginLeft='1px';
        a.style.float='right';
        o.parentElement.insertBefore(a,o);
    });
        $('td:nth-child(4) span.status_1').each(function(i,o){
        console.log(i,o.href);
        o.style.width='1em';
        o.style.display='inline-block';
    });


})();