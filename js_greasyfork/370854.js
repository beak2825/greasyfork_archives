// ==UserScript==
// @name         ThreadsAtributesEditingTool
// @name:ru      Инструмент изменения атрибутов в нитках
// @version      2.3.2
// @description  The script allows you to bulk edit the attributes of embarcation and disembarcation at stops in the thread
// @description:ru Скрипт позволяет осуществлять групповое редактирование атрибутов посадки и высадки у остановок в нитках транспорта
// @author       Nikita Yushkov
// @match        https://n.maps.yandex.ru/*
// @namespace https://greasyfork.org/users/199854
// @downloadURL https://update.greasyfork.org/scripts/370854/ThreadsAtributesEditingTool.user.js
// @updateURL https://update.greasyfork.org/scripts/370854/ThreadsAtributesEditingTool.meta.js
// ==/UserScript==

(function() {
    var body = [];
    var a = [];
        window.onload = function(){
    var Interval = setInterval(function(){if(!((document.getElementsByClassName('nk-logo-view__img nk-logo-view__img_color_white')[0] === null) || (document.getElementsByClassName('nk-suggest_width_available')[0] === undefined)))f0();},10);
        function f0(){clearInterval(Interval);
                      body = document.getElementsByTagName('body');
                      if (document.getElementById('sk') === null){body[0].insertAdjacentHTML('beforeEnd','<style id="sk">a.button10 {display: inline-block; color: black; font-size: 110%; text-decoration: none; user-select: none; padding: .25em .5em; outline: none; border: 1px solid rgb(250,172,17); border-radius: 7px; background: rgb(255,212,3) linear-gradient(rgb(255,212,3), rgb(248,157,23)); box-shadow: inset 0 -2px 1px rgba(0,0,0,0), inset 0 1px 2px rgba(0,0,0,0), inset 0 0 0 60px rgba(255,255,0,0); transition: box-shadow .2s, border-color .2s;} a.button10:hover { box-shadow: inset 0 -1px 1px rgba(0,0,0,0), inset 0 1px 2px rgba(0,0,0,0), inset 0 0 0 60px rgba(255,255,0,.5);} a.button10:active { padding: calc(.25em + 1px) .5em calc(.25em - 1px); border-color: rgba(177,159,0,1); box-shadow: inset 0 -1px 1px rgba(0,0,0,.1), inset 0 1px 2px rgba(0,0,0,.3), inset 0 0 0 60px rgba(255,255,0,.45);}</style>');}
                      if (document.getElementById('but') === null){body[0].insertAdjacentHTML('beforeEnd','<a class="button10" style="position: fixed; z-index: 99999; top: 25px; right: 485px;" id="but">Атрибуты в нитках</a>');}
                      a = document.getElementsByClassName('nk-transport-thread-stop-editor-view__stop');
                      document.getElementById('but').onclick = f1;}
    }
    function f1(){
if((a[0] === null) || (a[0] === undefined))alert('Остановки не найдены');
else{document.getElementById('but').parentNode.removeChild(document.getElementById('but')); body[0].insertAdjacentHTML('beforeEnd','<div id="okoshko" style="position: fixed; z-index: 99999; right: 600px; top: 424px;  background: #fff"><form><fieldset><legend>Изменение атрибутов в нитке</legend><table><tr><td>Начальная ост.</td><td><input type="text" autocomplete="off" size="1" id="th1"></td></tr><tr><td>Конечная ост.</td><td><input type="text" autocomplete="off" size="1"  id="th2"></td></tr><tr>   <td><p><input type="radio" name="th3" value="0" checked>Нет посадки</p></td><td><p><input type="radio" name="th3" value="1">Нет высадки</p></td></tr></table><table><tr><td><a class="button10" id="ex">Выйти</a></td><td><a class="button10" id="jdi">Изменить атрибуты</a></td></tr></table></fieldset></form></div>');document.getElementById('ex').onclick = f2; document.getElementById('jdi').onclick = f3;
document.getElementById('th1').onkeypress=function(e){
    if(e.keyCode==13){
        f3();
    }
};
document.getElementById('th2').onkeypress=function(e){
    if(e.keyCode==13){
        f3();
    }
};
var th3 = document.getElementsByName('th3');
for (var i = 0; i<th3.length; i++) {
    th3[i].onkeypress=function(e){
    if(e.keyCode==13){
        f3();
    }
};}}
}
function f2(){
document.getElementById('okoshko').parentNode.removeChild(document.getElementById('okoshko'));
body[0].insertAdjacentHTML('beforeEnd','<a class="button10" style="position: fixed; z-index: 99999; top: 25px; right: 485px;" id="but">Атрибуты в нитках</a>'); document.getElementById('but').onclick = f1;
};
function f3(){
var v = [];
v[0] = parseInt(document.getElementById('th1').value);
v[1] = parseInt(document.getElementById('th2').value);
if (!((a[0] === null) || (a[0] === undefined))) {if(!((v[0] > v[1]) || (v[0] === undefined) || (v[1] === undefined) || (v[0] === null) || (v[1] === null) || (v[0] <= 0) || (v[1] > a.length) || (isNaN(v[0])) || (isNaN(v[1])))){
var r = document.getElementsByName('th3');
for(var i = 0; i < 2; i++){
    if(r[i].checked){
        v[2] = parseInt(r[i].value);
        break;
    }
}
document.getElementById('okoshko').parentNode.removeChild(document.getElementById('okoshko'));
for(var i = v[0]-1; i < v[1]; i++ ){
    var p = a[i].getElementsByClassName('nk-action_action_toggle-advanced-mode');
    p[0].click();
    var b = a[i].getElementsByClassName('nk-checkbox__box');
    b[v[2]].click();
    p[0].click();
}
body[0].insertAdjacentHTML('beforeEnd','<a class="button10" style="position: fixed; z-index: 99999; top: 25px; right: 485px;" id="but">Атрибуты в нитках</a>'); document.getElementById('but').onclick = f1;
}else {alert("Атрибуты заполнены некорректно. Попробуйте ещё раз."); document.getElementById('ex').onclick = f2; document.getElementById('jdi').onclick = f3; document.getElementById('th1').onkeypress=function(e){
    if(e.keyCode==13){
        f3();
    }
};
document.getElementById('th2').onkeypress=function(e){
    if(e.keyCode==13){
        f3();
    }
};
var th3 = document.getElementsByName('th3');
for (var i = 0; i<th3.length; i++) {
    th3[i].onkeypress=function(e){
    if(e.keyCode==13){
        f3();
    }
};}}}
else {alert('Остановки не найдены'); document.getElementById('okoshko').parentNode.removeChild(document.getElementById('okoshko')); body[0].insertAdjacentHTML('beforeEnd','<a class="button10" style="position: fixed; z-index: 99999; top: 25px; left: 600px;" id="but">Атрибуты в нитках</a>'); document.getElementById('but').onclick = f1;}}
})();