// ==UserScript==
// @name         MyKirito Auto Action
// @namespace    https://github.com/JCxYIS/mykirito_autoscript
// @version      3.1
// @description  自動點擊行動與PVP；使用腳本有風險，小心被茅場大大抓
// @author       JCxYIS
// @match        https://mykirito.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413368/MyKirito%20Auto%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/413368/MyKirito%20Auto%20Action.meta.js
// ==/UserScript==

(function()
{
    'use strict';


    // 參數
    /** haha8 */
    const ACTION_NAME_LIST = ["狩獵兔肉", "自主訓練", "外出野餐", "汁妹", "做善事", "坐下休息", "釣魚"];
    const AWARD_NAME_LIST = ["修行1小時","修行2小時","修行4小時","修行8小時","領取獎勵"];
    const BOSS_NAME_LIST = ["挑戰"];
    const BATTLE_NAME_LIST = ["友好切磋", "認真對決", "決一死戰", "我要超渡你"];

    const BUTTON_AVAILABLE_CLASSNAME = "sc-AxgMl llLWDd";
    const BUTTON_DISABLED_CLASSNAME = "sc-AxgMl kPlkaT";
    const H3_CLASSNAME = "sc-fznyAO CWQMf";
    const CONTAINER_CLASSNAME = "sc-fzokOt hLgJkJ";
    const BATTLE_CONTAINER_CLASSNAME = "sc-fzplWN hRBsWH";
    const INJECTION_CLASSNAME = "sc-fzplWN hRBsWH";


    // class
    class RecursiveAction
    {
        constructor(butt, clicktimes)
        {
            this.butt = butt
            this.clicktimes = clicktimes
            this.hasClicked = 0
        }
    }

    // 變數
    /** 要做出的行動 是 RecursiveAction 的 List*/
    var actionList = [];

    /** 樓層獎勵按鈕 */
    var floorAwardButt;

    /** 所有我們建立的遞迴按鈕 */
    var myFunctionButtons = [];

    /** 注入網頁的元素  */
    var text_title;
    var text_subtitle1;
    var text_subtitle2;
    var text_subtitle3;
    var text_loopInputInfo;
    var input_loopInput;
    var butt_start;
    var butt_stop;
    var butt_removelast;
    var butt_shuffle;
    var checkbox_autoFloorReward;


    // 進入點
    setInterval ( function ()
        {
            if ( this.lastPath != location.pathname )
            {
                this.lastPath = location.pathname;
                console.log("SWITCH!："+location.pathname);
                EndREALRecursive();
                main ();
            }
        }
        , 1000
    );


    // 主函式
    function main()
    {
        // 先決定我們在哪個頁面
        /** */
        let usingActionList = [];
        /** 要插入功能表的地方*/
        let usingInjectionPos;
        /** 要插入功能表的地方的順位 */
        let usingInjectionOrder;

        if(location.pathname == "/") // 跟目錄
        {
            usingActionList = ACTION_NAME_LIST.concat(AWARD_NAME_LIST);
            usingInjectionPos = document.getElementsByClassName(BATTLE_CONTAINER_CLASSNAME)[0].parentNode;
            usingInjectionOrder = 4;
        }
        else if (location.pathname.startsWith("/profile/")) // 準備戰鬥
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


        // 拿到可點的按紐們
        /** 所有按鈕，包含不被遞迴的 */
        let allbuttons = document.getElementsByTagName('button');
        /** 所有被我們標示可遞迴的按鈕 */
        let actionButtons = [];
        floorAwardButt = undefined;
        console.log(usingActionList);
        for(let i = 0; i < allbuttons.length; i++)
        {
            if(allbuttons[i].offsetParent !== null) /*.parentElement.style.display != "none"*/
            {
                for(let j = 0; j < usingActionList.length; j++)
                {
                    if(allbuttons[i].innerText == usingActionList[j])
                    {
                        actionButtons.push(allbuttons[i]);
                        // console.log(allbuttons[i]);
                        continue;
                    }
                }

                if(allbuttons[i].innerText == "領取獎勵")
                {
                    floorAwardButt = allbuttons[i];
                    console.log(allbuttons[i]);
                    continue;
                }
            }
        }

        // 製作選單
        /** 要注入的主東西 */
        var inject             = document.createElement('div');
        usingInjectionPos.insertBefore(inject, usingInjectionPos.childNodes[usingInjectionOrder])//.appendChild(inject);

        /** 注入的元素 */
        text_title         = document.createElement("h3");
        text_subtitle1     = document.createElement('p');
        text_subtitle2     = document.createElement('p');
        text_subtitle3     = document.createElement('p');
        text_loopInputInfo = document.createElement('span');
        input_loopInput    = document.createElement('input');

        inject.classList = INJECTION_CLASSNAME;
        inject.style.backgroundColor = "#2868B011"

        text_title.classList = H3_CLASSNAME;
        text_title.innerHTML = "自律行動";
        text_subtitle1.innerHTML = "大家都應該去玩 <a href='https://pmotschmann.github.io/Evolve/' target='_blank'>進化 Evolve</a>";
        text_subtitle2.innerHTML =
            "<a href='https://greasyfork.org/zh-TW/scripts/413368-mykirito-auto-action' target='_blank'>腳本網址</a> | " +
            "<a href='https://github.com/JCxYIS/mykirito_autoscript' target='_blank'>腳本原始碼</a> | " +
            "<a href='https://tinyl.io/mykiritowiki' target='_blank'>攻略網</a>";
        text_subtitle3.innerHTML = "";

        //loopInput.classList = "sc-AxheI fniENO";
        text_loopInputInfo.innerHTML = "連續點擊數：";
        input_loopInput.type = "number";
        input_loopInput.min = 1;
        input_loopInput.max = 48763;
        input_loopInput.step = 1;
        input_loopInput.value = 1;


        // 新增剛綁好的按鈕
        myFunctionButtons = [];
        for(let i = 0; i < actionButtons.length; i++)
        {
            //console.log("按鈕名稱："+buttons[i].innerHTML);
            let newButt = document.createElement('button');
            newButt.classList = BUTTON_AVAILABLE_CLASSNAME;
            newButt.innerHTML = ""+actionButtons[i].innerHTML;
            newButt.onclick = ()=>{ AddAction( actionButtons[i] ); }
            myFunctionButtons.push(newButt);
        }

        // remove last
        butt_removelast = document.createElement('button');
        butt_removelast.innerHTML = "刪除最後";
        butt_removelast.classList = BUTTON_AVAILABLE_CLASSNAME;
        butt_removelast.onclick = ()=>{ RemoveLastAction(); }

        // random
        butt_shuffle = document.createElement('button');
        butt_shuffle.innerHTML = "隨機排列";
        butt_shuffle.classList = BUTTON_AVAILABLE_CLASSNAME;
        butt_shuffle.onclick = ()=>{ ShuffleAction(); }


        // 往，吾往也
        butt_start = document.createElement('button');
        butt_start.innerHTML = "開始";
        butt_start.classList = BUTTON_AVAILABLE_CLASSNAME;
        butt_start.onclick = ()=>{ StartREALRecursive(); }

        // 止，吾止也
        butt_stop = document.createElement('button');
        butt_stop.innerHTML = "停止/清除";
        butt_stop.classList = BUTTON_AVAILABLE_CLASSNAME;
        butt_stop.onclick = ()=>{ EndREALRecursive(); }

        // 自動樓層
        checkbox_autoFloorReward = document.createElement("input");
        checkbox_autoFloorReward.type = "checkbox";
        checkbox_autoFloorReward.id = "checkbox_autoFloorReward";
        let checkbox_autoFloorReward_label = document.createElement("label");
        checkbox_autoFloorReward_label.htmlFor = "checkbox_autoFloorReward";
        checkbox_autoFloorReward_label.innerHTML = "自動領取樓層獎勵";
        // checkbox_autoFloorReward.classList = BUTTON_AVAILABLE_CLASSNAME;


        // 把所有東西渲染上網頁！
        inject.appendChild(text_title);
        inject.appendChild(text_subtitle1);
        inject.appendChild(text_subtitle2);
        for(let i = 0; i < myFunctionButtons.length; i++)
        {
            inject.appendChild(myFunctionButtons[i]);
        }
        inject.appendChild(document.createElement('br'));
        inject.appendChild(text_loopInputInfo);
        inject.appendChild(input_loopInput);
        inject.appendChild(document.createElement('br'));
        inject.appendChild(butt_shuffle);
        inject.appendChild(butt_removelast);
        inject.appendChild(document.createElement('br'));
        if(floorAwardButt) {
            inject.appendChild(checkbox_autoFloorReward);
            inject.appendChild(checkbox_autoFloorReward_label);
            inject.appendChild(document.createElement('br'));
        }
        inject.appendChild(butt_start);
        inject.appendChild(butt_stop);
        inject.appendChild(document.createElement('br'));
        inject.appendChild(text_subtitle3);


    } // end main



    // 以下是功能
    var recursiveTimerId;
    var clickCombo = 0;
    var clickComboTotal = 0;
    var continuousInvalidClick = 0;
    var isLastActionClick = false;

    function AddAction(butt)
    {
        let newAction = new RecursiveAction(butt, input_loopInput.value);
        actionList.push(newAction);
        console.log("加入action: "+butt.innerHTML+"：要按"+input_loopInput.value+"次");
        PrintAction();
    }

    function RemoveLastAction()
    {
        // let newAction = new RecursiveAction(butt, input_loopInput.value);
        actionList.pop();
        console.log("刪除 action");
        PrintAction();
    }

    function ShuffleAction()
    {
        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        var currentIndex = actionList.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex)
        {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = actionList[currentIndex];
            actionList[currentIndex] = actionList[randomIndex];
            actionList[randomIndex] = temporaryValue;
        }

        console.log("shuffle action");
        PrintAction();
    }

    function PrintAction()
    {
        let str = "<b>行動清單：</b><br>";
        actionList.forEach(element => {
            let addstr = ""+element.butt.innerHTML+" "+element.clicktimes+" 次";

            if(element.hasClicked == element.clicktimes)
            {
                addstr = "<span style='color:green'>"+addstr+"："+element.hasClicked+" "+"</span><br>";
            }
            else if(element.hasClicked != 0)
            {
                addstr = "<span style='color:orange'>"+addstr+"："+element.hasClicked+" "+"</span><br>";
            }
            else
            {
                addstr = ""+addstr+"："+element.hasClicked+" "+"<br>";
            }

            str += addstr;
        });

        if(text_subtitle3)
            text_subtitle3.innerHTML = str;
    }

    function StartREALRecursive()
    {
        // EndRecursive();
        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].classList = BUTTON_DISABLED_CLASSNAME;
        }
        butt_start.classList = BUTTON_DISABLED_CLASSNAME;
        butt_shuffle.classList = BUTTON_DISABLED_CLASSNAME;
        butt_removelast.classList = BUTTON_DISABLED_CLASSNAME;
        checkbox_autoFloorReward.disabled = true;

        if(recursiveTimerId)
        {
            console.warn("已經開始過了！");
        }
        else
        {
            REALRecursive();
            console.log("讓我們開始吧！");
        }
    }



    function REALRecursive()
    {
        // TODO
        /** Random: 20~50秒檢查一次 */
        let nextTime = 20000+Math.random()*30000;

        /**本次行動的目標 */
        let action = null;
        for(let i = 0; i < actionList.length; i++)
        {
            if(actionList[i].hasClicked < actionList[i].clicktimes)
            {
                action = actionList[i];
                break;
            }
        }
        if(action == null)
        {
            text_subtitle2.innerHTML = "<span style='color:green'>自律行動執行完成！</span>";
            return;
        }

        /**本次行動的目標按鈕 */
        let butt = action.butt;


        // start!
        if(butt.disabled || butt.classList == BUTTON_DISABLED_CLASSNAME)
        {
            // 仍在鎖，不能按
            isLastActionClick = false;
            continuousInvalidClick = 0;
            //console.log("按鈕不能按！ 下次檢查時間(n秒後)："+nextTime/1000);

            // 那去檢查樓層獎勵吧
            if(checkbox_autoFloorReward.checked && floorAwardButt && !floorAwardButt.disabled)
            {
                floorAwardButt.click();
                console.log("按樓層獎勵");
            }
        }
        else
        {
            // 按下去！
            butt.click();
            clickCombo++;
            clickComboTotal++;
            action.hasClicked += 1;

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
            text_subtitle2.innerHTML = "<span style='color:yellow'>無效點擊達 5 次。請重新執行！</span>";
            return;
        }
        else
        {
            text_subtitle2.innerHTML = "<span style='color:cyan'>自律行動執行中！</span>";
            if(continuousInvalidClick > 0)
            {
                text_subtitle2.innerHTML += "<br><span style='color:yellow'>連續點擊次數( 5 次將會暫停腳本)："+continuousInvalidClick+" / 5";
            }
            recursiveTimerId = setTimeout( ()=>{REALRecursive()} , nextTime);
        }

        PrintAction();
        //text_subtitle2.innerHTML += "點擊【"+butt.innerHTML+"】，已點擊了 "+clickCombo+" ("+clickComboTotal+") 次！";
    }
    function EndREALRecursive()
    {
        window.clearTimeout(recursiveTimerId);
        recursiveTimerId = null;

        clickCombo = 0;
        continuousInvalidClick = 0;
        isLastActionClick = false;

        actionList = []
        PrintAction();

        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].classList = BUTTON_AVAILABLE_CLASSNAME;
        }

        if(butt_start)
        {
            butt_start.classList = BUTTON_AVAILABLE_CLASSNAME;
            butt_shuffle.classList = BUTTON_AVAILABLE_CLASSNAME;
            butt_removelast.classList = BUTTON_AVAILABLE_CLASSNAME;
            checkbox_autoFloorReward.disabled = false;
        }

        if(text_subtitle2)
            text_subtitle2.innerHTML = "謝謝您的惠顧，敬祝您健康愉快，萬事如意，再見。";
        console.log("停止遞迴；清除參數。");
    }
}
)();
