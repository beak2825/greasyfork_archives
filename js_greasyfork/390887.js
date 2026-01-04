// ==UserScript==
// @name         keepfrds种子清理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       YW
// @match        https://pt.keepfrds.com/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390887/keepfrds%E7%A7%8D%E5%AD%90%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/390887/keepfrds%E7%A7%8D%E5%AD%90%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $script = document.createElement('script')
    $script.className = 'bachdl'
    $script.setAttribute('type', 'text/javascript')
    $script.appendChild(document.createTextNode(`
;function deleteParentRow(child,parentLevel){
var target = child;
while(parentLevel!=0)
{
target = target.parentNode;
parentLevel --;
}
target.parentNode.deleteRow(target.rowIndex);
}
function rinsetorrents(){
var t_rows= document.querySelector("#form_torrent > table > tbody ").rows;
while(t_rows[1].cells[5].innerText == 0){
t_rows[1].parentElement.deleteRow(1);
}
document.querySelectorAll(".torrentname > tbody > tr > td:nth-child(1) > div").forEach(function(e){
if(e.childNodes[3].style.backgroundColor=="rgb(119, 119, 255)"){
deleteParentRow(e,6)
}
});
}
`));
    document.head.appendChild($script)
    document.querySelector(".torrents > tbody > tr:nth-child(1) > td:nth-child(2) > div:nth-child(2)").innerHTML+='&nbsp&nbsp&nbsp<a title="清理本页种子" href="javascript:rinsetorrents()">☢️</a>';
})();