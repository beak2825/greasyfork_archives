// ==UserScript==
// @name           WALLPAPER HDV DOWNLOAD
// @namespace      WALLPAPER HDV
// @description    WALLPAPER HDV
// @author         Nguyễn Văn Cao Kỳ
// @include        *steamcommunity.com/sharedfiles/filedetails/?id=*
// @version        1.0.1
// @downloadURL https://update.greasyfork.org/scripts/388289/WALLPAPER%20HDV%20DOWNLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/388289/WALLPAPER%20HDV%20DOWNLOAD.meta.js
// ==/UserScript==

var patt=new RegExp("[0-9]{2,15}");
var id = patt.exec(document.URL);

var realButton = document.getElementById("SubscribeItemBtn");

realButton.parentNode.getElementsByTagName("h1")[0].innerHTML = "Bấm Download để tải.";

var myButtonPosition = realButton.offsetWidth + 20;

var button = document.createElement('a');
button.setAttribute('class', 'btn_green_white_innerfade btn_border_2px btn_medium');
button.setAttribute('href', 'https://ani-vn.tech/ajax/hdv.php?item=' + id);
button.setAttribute('target', '_blank');
button.setAttribute('style', 'right: ' + myButtonPosition + 'px;');

button.innerHTML = '<div class="subscribeIcon"></div>' +
    '<span class="subscribeText">' +
    '<div class="subscribeOption subscribe selected" id="SubscribeItemOptionAdd">Download</div>' +
    '</span>';

if (realButton.nextSibling)
{
    realButton.parentNode.insertBefore(button, realButton.nextSibling);
}
else
{
    realButton.parentNode.appendChild(button);
}