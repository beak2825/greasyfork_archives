// ==UserScript==
// @name         夢想天使_兌換團隊積分
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       伊恩Ian； LineID：bigcathaha
// @match        https://dreamangel.io/user/dashboard/d3_team_info*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/396978/%E5%A4%A2%E6%83%B3%E5%A4%A9%E4%BD%BF_%E5%85%8C%E6%8F%9B%E5%9C%98%E9%9A%8A%E7%A9%8D%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/396978/%E5%A4%A2%E6%83%B3%E5%A4%A9%E4%BD%BF_%E5%85%8C%E6%8F%9B%E5%9C%98%E9%9A%8A%E7%A9%8D%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var GetTeamPointsAngCountinput=document.createElement("input");
    GetTeamPointsAngCountinput.type="button";
    GetTeamPointsAngCountinput.value="比對可兌換的天使數量";
    GetTeamPointsAngCountinput.onclick = GetTeamPointsAngCount;
    GetTeamPointsAngCountinput.setAttribute("id", "TeamPointsAngCountButton");
    GetTeamPointsAngCountinput.setAttribute("style", "font-size:18px;position:absolute;top:40px;right:40px;");
    document.body.appendChild(GetTeamPointsAngCountinput);

    var ianinput=document.createElement("input");
    ianinput.type="button";
    var ianSwitchValue = GM_getValue('ianSwitchTeamPointsAngCount', 0);
    if (ianSwitchValue !=0)
    {
        ianinput.value="關閉 連續偵測";
        Auto_GetTeamPointsAngCount();
    }
    else
    {
        ianinput.value="啟用 連續偵測";
    }
    ianinput.onclick = ianswitch;
    ianinput.setAttribute("id", "ianSwitchTeamPointsAngCountButton");
    ianinput.setAttribute("style", "font-size:18px;position:absolute;top:80px;right:40px;");
    document.body.appendChild(ianinput);


})();

async function ianswitch()
{
    var ianSwitchValue = GM_getValue('ianSwitchTeamPointsAngCount', 0);
    var popo = document.getElementById('ianSwitchTeamPointsAngCountButton');
    if (ianSwitchValue !=0)
    {
        GM_setValue('ianSwitchTeamPointsAngCount', 0);
        popo.value="啟用 連續偵測";
    }
    else
    {
        GM_setValue('ianSwitchTeamPointsAngCount', 1);
        popo.value="關閉 連續偵測";
        Auto_GetTeamPointsAngCount();
    }
}
async function Auto_GetTeamPointsAngCount()
{
    var errorCount = 0;

    for (var i=0; i<5; i++)
    {
        await sleep(1000);
        var object = $('.bottom-box');
        if (object.length > 0)
        {
            await GetTeamPointsAngCount();
            await sleep(4000);
            myrefresh();
        }
        else
        {
            console.log('錯誤次數：' + errorCount);
            if (errorCount == 3)
            {
                GM_setValue('ianSwitchTeamPointsAngCount', 0);
                SendPOST('無法連線：團隊獎勵金兌換『夢想』');
                console.log('無法連線：團隊獎勵金兌換『夢想』');
            }
            errorCount++;
        }
    }
}
async function GetTeamPointsAngCount()
{
    var objectinfo = $('.modal.fade.show option');//免費兌換『夢想』下拉式選單內容
    var compareMessage = '';
    var errorCount = 0;
    //檢查選單是否開啟
    while(objectinfo.length <= 1)
    {
        do
        {
            await sleep(50);
            if(errorCount > 0)
            {
                await sleep(500);
                console.log("等待$('.bottom-box')\t" + (errorCount-1) + "次");
            }
            else if(errorCount >= 100)
            {
                GM_setValue('ianSwitchTeamPointsAngCount', 0);
                SendPOST('無法連線：團隊獎勵金兌換『夢想』');
                console.log('無法連線：團隊獎勵金兌換『夢想』');
                return;
            }
            errorCount++;
        }
        while($('.bottom-box').length < 1);

        errorCount = 0;
        $('.bottom-box')[0].firstElementChild.firstElementChild.firstElementChild.click();//開啟免費兌換『夢想』選單

        do
        {
            await sleep(300);
            if(errorCount > 0)
            {
                await sleep(200);
                console.log("等待$('.modal.fade.show option')\t" + (errorCount-1) + "次");
            }
            else if(errorCount >= 100)
            {
                GM_setValue('ianSwitchTeamPointsAngCount', 0);
                SendPOST('無法連線：團隊獎勵金兌換『夢想』');
                console.log('無法連線：團隊獎勵金兌換『夢想』');
                return;
            }
            errorCount++;
        }
        while($('.modal.fade.show option').length < 1);
        objectinfo = $('.modal.fade.show option');
        $('.bottom-box')[0].firstElementChild.firstElementChild.firstElementChild.click();//關閉免費兌換『夢想』選單
    }

    for (var i = 1; i<objectinfo.length; i++)//第一個為請選擇，所以跳過
    {
        compareMessage += objectinfo[i].innerText + '\t\n';
    }
    //$('.bottom-box')[0].firstElementChild.firstElementChild.firstElementChild.click();//關閉免費兌換『夢想』選單

    if(compareMessage == '')
    {
        //GM_setValue('ianSwitchTeamPointsAngCount', 0);
        SendPOST('\n' + objectinfo.length + '\n' + objectinfo[0].innerText + '\n' + compareMessage);
        console.log('\n' + objectinfo.length + '\n' + objectinfo[0].innerText + '\n' + compareMessage);
        console.log('\n' + objectinfo);
        return;
    }
    console.log('\n' + compareMessage);
    var message = GM_getValue('TeamPointsAngCount', '');
    if (compareMessage != message){
        var ianSwitchTeamPointsAngCount = GM_getValue('ianSwitchTeamPointsAngCount', 0);
        if (ianSwitchTeamPointsAngCount !=0)
        {
            SendPOST('\n' + compareMessage);
        }
        message = compareMessage;
        GM_setValue('TeamPointsAngCount', message);
    }
}









async function myrefresh()//畫面重新整理
{
    window.location.reload();
}
function SendPOST(message)//發送POST
{
    var url = 'https://script.google.com/macros/s/AKfycby3pJRLsuZewWkxxuLeDRFXJ0fQWkGVQkyyCvCENv5eSlLZhIUM/exec';

    $.post(url,
    {
      msg:message
    });
}
async function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}