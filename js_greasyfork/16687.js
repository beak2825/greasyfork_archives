// ==UserScript==
// @name         justFun
// @version      0.4
// @match        http://www.heroeswm.ru/sms-create.php
// @match        http://www.heroeswm.ru/sms.php
// @grant        none
// @namespace https://greasyfork.org/users/13829
// @description none
// @downloadURL https://update.greasyfork.org/scripts/16687/justFun.user.js
// @updateURL https://update.greasyfork.org/scripts/16687/justFun.meta.js
// ==/UserScript==

var setMyTimerFrom = 21; //Установить интервал ожидания от           !!Отправка в игре возможна раз в 20 секунд
var setMyTimerTo = 29;   //Установить интервал ожидания до           !!Поступило сообщение, что после отправки некоторого количество сообщений
                                                                   //!!Задержка может возрастать до 80 секунд, решайте сами какой интервал выставлять
if(!localStorage.getItem('HWMsetupSMS'))
    localStorage.setItem('HWMsetupSMS', "0|0|0");

function stop(){
    localStorage.setItem("HWMsetupSMS", "0|0|0");
    localStorage.removeItem("HWMnamesSMS");
    localStorage.removeItem("HWMmsgSMS");
    localStorage.removeItem("HWMsubjectSMS");
}

if(location.href=="http://www.heroeswm.ru/sms.php" && localStorage.getItem('HWMsetupSMS').split('|')[1]==1){
        var time = Math.floor(Math.random() * (setMyTimerTo - setMyTimerFrom + 1)) + setMyTimerTo;
        var count = localStorage.getItem('HWMsetupSMS').split('|')[0];
        var least = localStorage.getItem('HWMsetupSMS').split('|')[2];
        var array = document.getElementsByTagName('a');
        for(var i=0; i<array.length; i++)
            if(/\u0411\u043B\u043E\u043A\u043D\u043E\u0442/.test(array[i].innerHTML))
            {
                array[i].outerHTML+="<br>Отправлено:"+count+" Осталось:"+least+"<br>Жду:"+time+" секунд<br><button id='stopBut'>Стоп!</button>";
                if(document.getElementById("stopBut")) document.getElementById("stopBut").addEventListener("click", function(){stop(); array[i].outerHTML = "Остановлено!"});
                break;
            }
     setTimeout( function(){document.location.href = "http://www.heroeswm.ru/sms-create.php";}, time*1000);
}

if(localStorage.getItem('HWMsetupSMS').split('|')[1]==1 && location.href=="http://www.heroeswm.ru/sms-create.php"){
    var names = localStorage.getItem("HWMnamesSMS").split(',');
    var name = names[0];
    var msg = localStorage.getItem("HWMmsgSMS");
    var subject = localStorage.getItem("HWMsubjectSMS");
    names = names.slice(1);
    var count = localStorage.getItem('HWMsetupSMS').split('|')[0];
    var least = localStorage.getItem('HWMsetupSMS').split('|')[2];
    least--;
    count++;
    if(names.length===0){
        stop();
    }
    else{
        localStorage.setItem("HWMsetupSMS", count+"|1|"+least);
        localStorage.setItem("HWMnamesSMS", names);
    }
    sendMsg(name, msg, subject);
}

function sendMsg(name, msg, subject)
{
   var time = Math.floor(Math.random() * (1 - 3 + 1)) + 3;
   document.getElementsByName("mailto")[0].value = name;
   document.getElementsByName("subject")[0].value = subject;
   document.getElementsByName("msg")[0].value = msg;
   setTimeout( function(){document.getElementsByName("fmail")[0].submit();}, time*1000);
}

sendInit = function(){
    var namest = document.getElementById("namesSMS").value.split('\n');
    var msgt = document.getElementsByName("msg")[0].value;
    var subjectt = document.getElementsByName("subject")[0].value;
    var countt = 1;
    localStorage.setItem("HWMnamesSMS", namest.slice(1));
    localStorage.setItem("HWMmsgSMS", msgt);
    localStorage.setItem("HWMsubjectSMS", subjectt);
    localStorage.setItem("HWMsetupSMS", countt+"|1|"+(namest.length-1));
    sendMsg(namest[0], msgt, subjectt);
};
if(localStorage.getItem('HWMsetupSMS').split('|')[1]==0 && location.href=="http://www.heroeswm.ru/sms-create.php"){
    var subm = getSnap("//input[@name='subm']").snapshotItem(0);
    var myEl = document.createElement('div');
    myEl.innerHTML = '<br><textarea id="namesSMS"></textarea><br><input type="button" value="Отправить всем" id="butSMS">' ;
    subm.parentNode.appendChild(myEl);
    document.getElementById("butSMS").addEventListener("click",sendInit,false);
}
function getSnap( xpath , elem )
{
	return document.evaluate( xpath, ( !elem ? document : elem ) , null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
}