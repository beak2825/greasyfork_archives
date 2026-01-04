// ==UserScript==
// @name         讨论区->备份站
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  讨论区封锁？懒得转备份站？不妨试试这个~
// @author       mygr
// @match        https://www.luogu.com.cn/discuss*
// @icon         https://my9r.github.io/img/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530801/%E8%AE%A8%E8%AE%BA%E5%8C%BA-%3E%E5%A4%87%E4%BB%BD%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/530801/%E8%AE%A8%E8%AE%BA%E5%8C%BA-%3E%E5%A4%87%E4%BB%BD%E7%AB%99.meta.js
// ==/UserScript==

function To_url()
{
    var url = window.location.href;
    var url2=null;
    for(var i=2;i<=url.length-1;i++)
    {
        if(url.substring(i-2,i+1)=="com")
        {
            url2=url.substring(0,i-2)+"me"+url.substring(i+4,url.length);
            break;
        }
    }
    if(url2==null)
        return 0;
    //window.alert(url2);
    window.location.assign(url2);
}

(function() {
    'use strict';

    var button = document.createElement('button');
    button.innerHTML = '点击我跳转至备份站';
    button.setAttribute('id', 'myButton');
    //button.style.backgroundColor = '';
    button.style.color = 'black';
    var pls=document.getElementsByClassName("full-container")[0];
    //window.alert(pls);
    pls.appendChild(button);

    button.addEventListener('click', To_url );

})()