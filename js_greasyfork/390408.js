// ==UserScript==
// @id             chone
// @name           rarbt.cc显示BT下载按钮
// @description    rarbt.cc详细页面直接显示BT下载按钮
// @version        0.2
// @include        *rarbt.cc/subject/*
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/374638
// @downloadURL https://update.greasyfork.org/scripts/390408/rarbtcc%E6%98%BE%E7%A4%BABT%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/390408/rarbtcc%E6%98%BE%E7%A4%BABT%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
var items = document.querySelectorAll('a[href*="dow/index.html?id="]');
for (var i = 0; i < items.length; i++) {
    var aLink = items[i].getAttribute('href');
    items[i].parentNode.innerHTML += '<iframe id="myiframe_' + i + '"style="display:none;" src="' + aLink + '" width="140" height="55" frameborder="0" scrolling="no" overflow: hidden;></iframe>';
    document.querySelector('#myiframe_'+ i).onload = callback_iframe.bind({},i)}
function callback_iframe(num){document.querySelector('#myiframe_'+ num).style.display="";
                              document.querySelector('#myiframe_'+ num).contentWindow.scrollTo(240,228);}