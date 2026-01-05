// ==UserScript==
// @name         Damai Enable Ticket
// @namespace    https://greasyfork.org/zh-CN/scripts/10790-damai-enable-ticket
// @version      0.1
// @description  Enable disabled tickets in Damai.cn
// @icon         http://dui.damai.cn/dm_2015/goods/images/m-logo.png
// @license      GPL version 3
// @encoding     utf-8
// @date         07/05/2015
// @modified     07/05/2015
// @author       Myfreedom614 <openszone@gmail.com>
// @supportURL   http://openszone.com/
// @match        http://item.damai.cn/*
// @grant        none
// @copyright	 2015,Myfreedom614
// @downloadURL https://update.greasyfork.org/scripts/10790/Damai%20Enable%20Ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/10790/Damai%20Enable%20Ticket.meta.js
// ==/UserScript==

var siteurl = document.URL;

function doCrack()
{
    var lis = document.getElementsByClassName('lst')[1];
    var items = lis.getElementsByClassName('itm');
    //alert(items.length);
    for(i in items)
    {
        items[i].className = 'itm ';
        //var price = items[i].getElementsByClassName('price')[0].innerHTML;
        //alert(items[i].className);
        //alert(price);
    }
}

var div = document.getElementsByClassName('m-crm')[0];
div.innerHTML += "<span class='arrow'>&gt;</span><a id='btnEnableItem'><strong style='cursor: pointer; color: red !important; text-decoration: none !important;text-shadow: 0 0 15px #FF0000 !important;'>显示隐藏票<strong><a>";

div = document.getElementById('btnEnableItem');
div.onclick = doCrack;