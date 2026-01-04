// ==UserScript==
// @name         Invite
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Invite players
// @author       Sweag
// @include      https://www.heroeswm.ru/pl_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33735/Invite.user.js
// @updateURL https://update.greasyfork.org/scripts/33735/Invite.meta.js
// ==/UserScript==

var NameHeroes, a, Place, win1;
var _MAIL_MEMO_ = "Hello!\nBye!";

if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}

(function() {
    'use strict';

    a = document.getElementsByTagName('a');
    for (var i=0; i<a.length; i++){
        if(a[i].innerHTML.indexOf('Написать письмо') > -1){
            Place = i;
            var str = a[i].parentNode.parentNode.childNodes[0].innerHTML;
            NameHeroes = str.split('mailto_id=')[1].split('>')[0].slice(0, -1);
            if(GM_getValue(NameHeroes)){
                str = str + '&nbsp;&nbsp; <font color=red>Завербован&nbsp;&nbsp;<a style="text-decoration:none;" href="#" id=clear_to1>&nbsp;&nbsp;Очистить</a>';
                a[i].parentNode.parentNode.childNodes[0].innerHTML = str;
                document.getElementById('clear_to1').onclick = function(){clear_to1();};
            }else {
                str = str + '<a style="text-decoration:none;" href="#" id=mail_to1>&nbsp;&nbsp;Вербовка</a>';
                a[i].parentNode.parentNode.childNodes[0].innerHTML = str;
                document.getElementById('mail_to1').onclick = function(){mail_to1();};
            }
            break;
        }
    }
})();
function clear_to1()
{
    if(GM_getValue(NameHeroes))GM_deleteValue(NameHeroes);
    var str = a[Place].parentNode.parentNode.childNodes[0].innerHTML.slice(0,99);
    str = str + '<a style="text-decoration:none;" href="#" id=mail_to1>&nbsp;&nbsp;Вербовка</a>';
    a[Place].parentNode.parentNode.childNodes[0].innerHTML = str;
    document.getElementById('mail_to1').onclick = function(){mail_to1();};
}
function mail_to1()
{
    var href = 'sms-create.php?mailto_id=' + NameHeroes;
    win1 = window.open(href);
    win1.focus();
    win1.onload = function() {
        var at = win1.document.getElementsByName('subject');
        at[0].setAttribute("value", "Hello");
        at = win1.document.getElementsByName('msg');
        at[0].value = _MAIL_MEMO_;
        at = win1.document.getElementsByName('fmail');
        at[0].submit();
        GM_setValue(NameHeroes, 1);
        var str = a[Place].parentNode.parentNode.childNodes[0].innerHTML.slice(0,99);
        str = str + '&nbsp;&nbsp; <font color=red>Завербован&nbsp;&nbsp;<a style="text-decoration:none;" href="#" id=clear_to1>&nbsp;&nbsp;Очистить</a>';
        a[Place].parentNode.parentNode.childNodes[0].innerHTML = str;
        document.getElementById('clear_to1').onclick = function(){clear_to1();};
    };
}