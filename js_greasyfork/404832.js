// ==UserScript==
// @name         ManagerTest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://monolife.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404832/ManagerTest.user.js
// @updateURL https://update.greasyfork.org/scripts/404832/ManagerTest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var IsPlayBisiness = false;
    var IsPlay2 = false;
    var IsPlay4 = false;
    var IsPlayCheckWarTime = false;
    let timerBissiness;
    let timer2;
    let timer4
    let timerCheckWar;
    var Nbisiness = 12;

    // CreateBTN

    var btnBissines = document.createElement('button');
    var btn2 = document.createElement('button');
    var btn4 = document.createElement('button');
    var btnCheckWarTime = document.createElement('button');

    btnBissines.innerText = 'Запуск поиска бизнеса';
    document.body.appendChild(btnBissines);
    btnBissines.style.color = 'white';

    btn2.innerText = 'Запуск поиска игр 2х';
    document.body.appendChild(btn2);
    btn2.style.color = 'white';

    btn4.innerText = 'Запуск поиска Леди';
    document.body.appendChild(btn4);
    btn4.style.color = 'white';

    btnCheckWarTime.innerText = 'Запуск записи времени нападения';
    document.body.appendChild(btnCheckWarTime);
    btnCheckWarTime.style.color = 'white';

    btnBissines.onclick = function(){
        if(!IsPlayBisiness)
        {
            if(!IsPlay2 && !IsPlay4 && !IsPlayCheckWarTime){
            btnBissines.style.color = 'red';
            timerBissiness = setInterval(TheardBisines,50);
            IsPlayBisiness = true;

            }else{ alert('отключите другие скрипты')}

        }else{
            IsPlayBisiness = false;
            btnBissines.style.color = 'white';
            clearInterval(timerBissiness);
        }


    }

    btn2.onclick = function(){
        if(!IsPlay2)
        {
            if(!IsPlayBisiness && !IsPlay4 && !IsPlayCheckWarTime){
                IsPlay2 = true;
                btn2.style.color = 'red';
                timer2 = setInterval(Theard2,50);
            }else{ alert('отключите другие скрипты')}

        }else{
            IsPlay2 = false;
            btn2.style.color = 'white';
            clearInterval(timer2);
        }

    }

    btn4.onclick = function(){
        if(!IsPlay4)
        {
            if(!IsPlayBisiness && !IsPlay2 && !IsPlayCheckWarTime){
                IsPlay4 = true;
                btn4.style.color = 'red';
                timer4 = setInterval(Theard4,50);
            }else{ alert('отключите другие скрипты')}

        }else{
            IsPlay4 = false;
            btn4.style.color = 'white';
            clearInterval(timer4);
        }


    }

    btnCheckWarTime.onclick = function(){
        if(!IsPlayCheckWarTime)
        {
            if(!IsPlayBisiness && !IsPlay2 && !IsPlay4){
                IsPlayCheckWarTime = true;
                btnCheckWarTime.style.color = 'red';
                Nbisiness = prompt("Номер бизнеса",1);
                timerCheckWar = setInterval(GetoneBissinesBtn,50);
            }else{ alert('отключите другие скрипты')}

        }else{
            clearInterval(timerCheckWar);
            IsPlayCheckWarTime = false;
            btnCheckWarTime.style.color = 'white';
        }


    }

/*

Работа с клановым бизнесом

*/

    // главный цикл
    function TheardBisines()
    {
        var btn = GetAllBissinesBtn();
        //console.log(btn.length);
        for(let i =0; i<btn.length;i++)
        {
            ParseBtn(btn[i]);
        }

    }
    function ParseBtn(item)
    {
/*
Если кнопка есть в массиве(не null), то проверяем по первой букве,
если "С" значит смотреть, если "Н" Напасть
*/

            if(item.textContent[0] == "Н")
            {
                //alert("Напасть");
                item.click();
                //GetBtnExit();
            }
    }
    //полчение кнопок всех бизнесов
    function GetAllBissinesBtn()
    {
        var XpathStringBissines = '/html/body/div[2]/div/div/div[1]/div/div[3]/div[1]/div[4]/div[2]/div/div[4]/div/div/div[';
        var XpathStringBtnEnd = ']/div[3]/button'
        var BissinesData = [];
        var BissinesDataTestString;
        for (let i = 0;i<25;i++)
        {
            var xpathData = XpathStringBissines+i+XpathStringBtnEnd;
            var btnxpath = document.evaluate (xpathData, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if( btnxpath != null)
            {
            BissinesData.push(btnxpath);
            }
        }
        return BissinesData;
    }
    // проверка на наличие кнопки выйти
    function GetBtnExit()
    {
        var XpathStringBissines = '/html/body/div[2]/div/div/div[1]/div/div[3]/div[1]/div[4]/div[2]/div/div[4]/div/div/div[';
        var XpathStringBtnEnd = ']/div[3]/button'
        var BissinesDataTestString;
        for (let i = 0;i<25;i++)
        {
            var xpathData = XpathStringBissines+i+XpathStringBtnEnd;
            var btnxpath = document.evaluate (xpathData, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if(btnxpath != null )
            {
            btnBissines.style.color = 'white';
            clearInterval(timerBissiness);
            }
        }
    }
/*

работа с играми 2х

*/
        function Theard2()
    {
        if(IsPlay2){
        var btnGame = GetGameBtn();
        var btnConfirm = GetConfirmBtn();
        if(btnGame != null)
        {
            btnGame.click();
        }
        if(btnConfirm != null)
        {
            btnConfirm.click();
            IsPlay2 = false;
            btn2.style.color = 'white';
            clearInterval(timer2);
        }
        }

    }


    function GetGameBtn()
    {
        var btnxpath = document.evaluate ('//html/body/div[2]/div/div/div[1]/div/div[3]/div[1]/div[1]/div[2]/span/div/div[5]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return btnxpath;
    }
function GetConfirmBtn()
    {
        var btnxpath = document.evaluate ('/html/body/div[2]/div/div/div[4]/div/div/div/div/div/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return btnxpath;
    }
/*

работа с играми на  леди

*/
        function Theard4()
    {
        if(IsPlay4){
        var btnGame4 = GetGameBtn();
        var btnConfirm4 = GetConfirmBtn();
        if(btnGame4 != null)
        {
            btnGame4.click();
        }
        if(btnConfirm4 != null)
        {
            btnConfirm4.click();
            btn4.style.color = 'white';
            clearInterval(timer4);
            IsPlay4 = false;
        }
        }

    }


    function GetGameBtn4()
    {
        var btnxpath = document.evaluate ('/html/body/div[2]/div/div/div[1]/div/div[3]/div[1]/div[1]/div[2]/span/div/div[2]/div/div[5]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return btnxpath;
    }
function GetConfirmBtn4()
    {
        var btnxpath = document.evaluate ('/html/body/div[2]/div/div/div[4]/div/div/div/div/div/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return btnxpath;
    }
/*

работа с записью нападений

*/

 function GetoneBissinesBtn()
    {
        var XpathStringBissines = '/html/body/div[2]/div/div/div[1]/div/div[3]/div[1]/div[4]/div[2]/div/div[4]/div/div/div[';
        var XpathStringBtnEnd = ']/div[3]/button'
        var BissinesDataTestString;
            var xpathData = XpathStringBissines+Nbisiness+XpathStringBtnEnd;
            var btnxpath = document.evaluate (xpathData, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if( btnxpath != null)
            {
                if(btnxpath.textContent[0] == "Н")
                {
                btnxpath.click();
                }
            }

    }


})();