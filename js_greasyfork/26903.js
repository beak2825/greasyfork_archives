// ==UserScript==
// @name        Nice view MiniChat
// @namespace   https://greasyfork.org
// @include     http://trackeroc.ru/index.php*
// @include     http://*.trackeroc.ru/index.php*
// @version     1.01
// @grant       none
// @description Изменяет расположение и частично вид чата на главной странице сайта.
// @downloadURL https://update.greasyfork.org/scripts/26903/Nice%20view%20MiniChat.user.js
// @updateURL https://update.greasyfork.org/scripts/26903/Nice%20view%20MiniChat.meta.js
// ==/UserScript==

var latest_news = document.getElementById('latest_news');
var table1 = latest_news.children[0];
var t1_tr1 = table1.firstElementChild.firstElementChild;

var t1_td1 = t1_tr1.children[0];
var t1_td2 = t1_tr1.children[1];
var t1_td3 = t1_tr1.insertCell(2);

t1_td1.setAttribute('width', '31%');
t1_td2.setAttribute('width', '26%');

var br = latest_news.nextElementSibling
var script1 = br.nextElementSibling;
var style1 = script1.nextElementSibling;
var div1 = style1.nextElementSibling;
var div2 = div1.nextElementSibling;

var chat = document.getElementById('chat');
var message = document.getElementById('message');
var buttons1 = message.nextElementSibling;
var script2 = buttons1.nextElementSibling;
var div3 = script2.nextElementSibling;

var table2 = document.createElement('table');
var t2_tr1 = table2.insertRow(0);
var t2_td1 = t2_tr1.insertCell(0);
var t2_td2 = t2_tr1.insertCell(1);
t2_td1.insertBefore(buttons1, t2_td1.firstChild);
t2_td2.insertBefore(div3, t2_td2.firstChild);
t2_td2.insertBefore(script2, t2_td2.firstChild);

table2.setAttribute('width', '100%');
t2_td1.setAttribute('align', 'left');
t2_td2.setAttribute('align', 'right');

div3.style.verticalAlign = 'middle';

chat.parentElement.insertBefore(table2, message.nextElementSibling);

div1.style.padding = '0px';
div1.style.height = '20pt';

div2.style.position = 'absolute';
div2.style.backgroundColor = 'aliceblue';

chat.style.height = '100px';
chat.style.overflowX = 'hidden';

message.setAttribute('style', 'width:98% !important');

t1_td3.insertBefore(div2, t1_td3.firstChild);
t1_td3.insertBefore(div1, t1_td3.firstChild);
t1_td3.insertBefore(style1, t1_td3.firstChild);
t1_td3.insertBefore(script1, t1_td3.firstChild);

var table3 = document.createElement('table');
var t3_tr1 = table3.insertRow(0);
var t3_td1 = t3_tr1.insertCell(0);
var t3_td2 = t3_tr1.insertCell(1);

table3.setAttribute('width', '100%');
t3_td2.setAttribute('align', 'right');

div1.insertBefore(table3, div1.firstElementChild);
t3_td1.appendChild(table3.nextElementSibling);
t3_td2.appendChild(div3.lastElementChild);

t3_td2.firstElementChild.style.verticalAlign = 'middle';

var img1 = document.createElement('img');

img1.setAttribute('id', 'chatExpand');
img1.setAttribute('src', 'templates/default-1/images/menu_open.gif');
img1.setAttribute('expand', 'false');
img1.addEventListener('click', ChatResize);

img1.style.margin = '0 5px 0 10px';
img1.style.verticalAlign = 'middle';

t3_td2.appendChild(img1);

div3.lastElementChild.style.marginLeft = '5px';

div2.style.width = '' + div1.clientWidth + 'px';

t1_td1.firstElementChild.style.paddingBottom = '4px';
t1_td2.firstElementChild.style.paddingBottom = '4px';

t1_td1.firstElementChild.nextElementSibling.style.marginTop = '4px';
t1_td2.firstElementChild.nextElementSibling.style.marginTop = '4px';

document.getElementById('sidebar1-wrap').style.marginTop = '0px';


window.onresize = function(event) {
    div2.style.width = '' + div1.clientWidth + 'px';
};

function ChatResize() {
  var chatExpand = document.getElementById('chatExpand');
  if(chatExpand.getAttribute('expand') == 'false') {
    chatExpand.setAttribute('expand', 'true');
    
    chat.style.height = '500px';
  } else {
    chatExpand.setAttribute('expand', 'false');
    
    chat.style.height = '100px';
  }
}