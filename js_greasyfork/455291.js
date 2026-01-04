// ==UserScript==
// @name         MyKirito Auto Action
// @namespace    https://github.com/JCxYIS/mykirito_autoscript
// @version      2.4
// @description  自動點擊行動與PVP；使用腳本有風險，小心被茅場大大抓
// @author       JCxYIS
// @match        https://mykirito.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455291/MyKirito%20Auto%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/455291/MyKirito%20Auto%20Action.meta.js
// ==/UserScript==

(function()
{
    'use strict';


    // 參數
    const ACTION_NAME_LIST = ["狩獵兔肉", "自主訓練", "外出野餐", "汁妹", "做善事", "坐下休息", "釣魚"];
    const BATTLE_NAME_LIST = ["友好切磋", "認真對決", "決一死戰", "我要超渡你"];
    const BOSS_NAME_LIST = ["挑戰"];
    const BUTTON_AVAILABLE_CLASSNAME = "sc-AxgMl llLWDd";
    const BUTTON_DISABLED_CLASSNAME = "sc-AxgMl kPlkaT";
    const H3_CLASSNAME = "sc-fznyAO CWQMf";
    const CONTAINER_CLASSNAME = "sc-fzokOt hLgJkJ";
    const BATTLE_CONTAINER_CLASSNAME = "sc-fzplWN hRBsWH";
    const INJECTION_CLASSNAME = "sc-fzplWN hRBsWH";


    // 變數
    var subtitle2; // 副標
    var myFunctionButtons = []; // 按鈕s
    var loopInput; // 連續點擊數 (-1 表示無限連擊)

    // 進入點 小夫
    setInterval ( function ()
        {
            if ( this.lastPath != location.pathname )
            {
                this.lastPath = location.pathname;
                console.log("SWITCH!："+location.pathname);
                EndRecursive();
                main ();
            }
        }
        , 1000
    );



    // 主函式
    function main()
    {
        // 先決定我們在哪個頁面
        let usingActionList = [];
        let usingInjectionPos;
        let usingInjectionOrder;
        if(location.pathname == "/")
        {
            usingActionList = ACTION_NAME_LIST;
            usingInjectionPos = document.getElementsByClassName(BATTLE_CONTAINER_CLASSNAME)[0].parentNode;
            usingInjectionOrder = 4;
        }
        else if (location.pathname.startsWith("/profile/"))
        {
            usingActionList = BATTLE_NAME_LIST;
            usingInjectionPos = document.getElementsByClassName(BATTLE_CONTAINER_CLASSNAME)[0].parentNode;
            usingInjectionOrder = 2;
        }
        else if (location.pathname.startsWith("/boss"))
        {
            usingActionList = BOSS_NAME_LIST;
            usingInjectionPos = document.getElementsByClassName(BATTLE_CONTAINER_CLASSNAME)[0].parentNode;
            usingInjectionOrder = 1;
        }
        else
        {
            // 不是可以自動的地方就滾
            return;
        }

        // 綁定按紐們
        let allbuttons = document.getElementsByTagName('button');
        let actionButtons = [];
        myFunctionButtons = [];
        for(let i = 0; i < allbuttons.length; i++)
        {
            for(let j = 0; j < usingActionList.length; j++)
            {
                if(allbuttons[i].innerText == usingActionList[j] && allbuttons[i].offsetParent !== null) /*.parentElement.style.display != "none"*/
                {
                    actionButtons.push(allbuttons[i]);
                    continue;
                }
            }
        }

        // 製作選單
        var inject;
        var title, subtitle1, loopInputInfo;
        inject = document.createElement('div');
        title = document.createElement("h3");
        subtitle1 = document.createElement('p');
        subtitle2 = document.createElement('p');
        loopInputInfo = document.createElement('span');
        loopInput = document.createElement('input');

        inject.classList = INJECTION_CLASSNAME;
        inject.style.backgroundColor = "#f9555511"
        title.classList = H3_CLASSNAME;
        title.innerHTML = "誰還在玩這破遊";
        subtitle1.innerHTML = "大家都應該去抽 <a href='https://ourfloatingcastle.com' style='color:yellow'>甘雨滿命滿精</a>！！";
        subtitle2.innerHTML = "<span style='color:cyan'>甘雨真香。</span>";
        loopInputInfo.innerHTML = "連續點擊數 (-1 表示無限連擊)：";
        loopInput.classList = "sc-AxheI fniENO";
        loopInput.min = 1; loopInput.value = -1;

        usingInjectionPos.insertBefore(inject, usingInjectionPos.childNodes[usingInjectionOrder])//.appendChild(inject);
        inject.appendChild(title);
        inject.appendChild(subtitle1);
        inject.appendChild(loopInputInfo);
        inject.appendChild(loopInput);
        inject.appendChild(subtitle2);
        //inject.appendChild(document.createElement('br'));

        // 創建剛綁好的按鈕
        for(let i = 0; i < actionButtons.length; i++)
        {
            //console.log("按鈕名稱："+buttons[i].innerHTML);

            let newButt = document.createElement('button');
            newButt.classList = BUTTON_AVAILABLE_CLASSNAME;
            newButt.innerHTML = ""+actionButtons[i].innerHTML;
            newButt.onclick = ()=>{ StartRecursive(actionButtons[i]); }
            inject.appendChild(newButt);
            myFunctionButtons.push(newButt);
        }
        inject.appendChild(document.createElement('br'));
        // 止，吾止也
        let newButt = document.createElement('button');
        newButt.innerHTML = "停止";
        newButt.classList = BUTTON_AVAILABLE_CLASSNAME;
        newButt.onclick = ()=>{ EndRecursive(); }
        inject.appendChild(newButt);
    }



    // 以下是功能
    var recursiveTimerId;
    var clickCombo = 0;
    var clickComboTotal = 0;
    var continuousInvalidClick = 0;
    var isLastActionClick = false;

    function StartRecursive(butt)
    {
        EndRecursive();
        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].classList = BUTTON_DISABLED_CLASSNAME;
        }

        let recurCount = loopInput.value
        Recursive(butt, recurCount);
        console.log("開始遞迴！按鈕 "+butt.innerHTML+" "+recurCount+"次");
        //alert("記得去支持 團長最新力作【我們的浮游城】！")
    }
    function Recursive(butt, maxCombo)
    {
        // Random: 15~30秒檢查一次
        let nextTime = 15000+Math.random()*15000;


        if(butt.disabled || butt.classList == BUTTON_DISABLED_CLASSNAME)
        {
            // 仍在鎖，不能按
            isLastActionClick = false;
            continuousInvalidClick = 0;

            //console.log("按鈕不能按！ 下次檢查時間(n秒後)："+nextTime/1000);
        }
        else
        {
            // 按下去！
            butt.click();
            clickCombo++;
            clickComboTotal++;
            if(isLastActionClick)
            {
                continuousInvalidClick++;
            }
            isLastActionClick = true;

            //console.log(clickCombo+"("+clickComboTotal+") combo!! "+butt.innerHTML + "\n下次檢查時間(n秒後)："+nextTime/1000);
            //console.log(butt);
        }

        if(continuousInvalidClick >= 5)
        {
            EndRecursive();
            subtitle2.innerHTML = "<span style='color:yellow'>無效點擊達 5 次。請重新執行！</span>";
            return;
        }
        else if( clickCombo >= maxCombo && maxCombo != -1)
        {
            EndRecursive();
            subtitle2.innerHTML = "<span style='color:green'>自律行動執行完成！</span>";
            return;
        }
        else
        {
            recursiveTimerId = setTimeout( ()=>{Recursive(butt, maxCombo)} , nextTime);
            subtitle2.innerHTML = "<span style='color:cyan'>自律行動執行中！</span>";
        }

        subtitle2.innerHTML += "點擊【"+butt.innerHTML+"】，已點擊了 "+clickCombo+" ("+clickComboTotal+") 次！";
        if(continuousInvalidClick > 0)
            subtitle2.innerHTML += "<br><span style='color:yellow'>連續點擊次數( 5 次將會暫停腳本)："+continuousInvalidClick+" / 5";
    }
    function EndRecursive()
    {
        window.clearTimeout(recursiveTimerId);
        clickCombo = 0;
        continuousInvalidClick = 0;
        isLastActionClick = false;
        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].classList = BUTTON_AVAILABLE_CLASSNAME;
        }
        if(subtitle2)
            subtitle2.innerHTML = "";
        console.log("停止遞迴；清除參數。");
    }
}
)();
