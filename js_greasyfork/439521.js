// ==UserScript==
// @name         MyKirito Achievement Stats
// @namespace    https://github.com/JCxYIS/mykirito_achievement_stats
// @version      1.2
// @description  祝你早日衝上成就榜
// @author       JCxYIS
// @match        https://mykirito.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439521/MyKirito%20Achievement%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/439521/MyKirito%20Achievement%20Stats.meta.js
// ==/UserScript==

(function()
{
    'use strict';


    // 參數
    /** 123 */
    const BUTTON_AVAILABLE_CLASSNAME = "sc-AxgMl llLWDd";
    const BUTTON_DISABLED_CLASSNAME = "sc-AxgMl kPlkaT";
    const H3_CLASSNAME = "sc-fznyAO CWQMf";
    const CONTAINER_CLASSNAME = "sc-fzokOt hLgJkJ";
    const BATTLE_CONTAINER_CLASSNAME = "sc-fzplWN hRBsWH";
    const INJECTION_CLASSNAME = "sc-fzplWN hRBsWH";

    let lastPath = "";




    // 進入點
    setInterval ( function ()
        {
            if ( lastPath != location.pathname )
            {
                lastPath = location.pathname;
                console.log("switch!："+location.pathname);
                main ();
            }
        }
        , 1000
    );


    // 主函式
    function main()
    {
        // 先決定我們在哪個頁面
        if (location.pathname !== "/achievements")
        {
            // 不是就滾
            return;
        }

        // 目標 dict，key 為角色名，value 為 {win: Str, lose: Str, pt: Int}
        let dict = {}


        // 拿到所有成就
        let achi = document.getElementsByTagName("tr");
        let overrideChara = ""; // 同名角色複寫 (現只支援 2 個同名)
        for(let i = 0; i < achi.length; i++)
        {
            let achiStr = achi[i].children[1].innerHTML; // 成就名稱
            let achiPt = Number.parseInt(achi[i].children[2].innerHTML); // 獲得點數

            // 獲取當前使用角色
            let m = "";
            if(m = achiStr.match("挑戰勝利達 [0-9]+ 場") ||
               achiStr.match("挑戰失敗達 [0-9]+ 場") )
            {
                let chara = achiStr.substring(0, m.index); // 使用角色
                let isWin = achiStr.indexOf("勝利") > -1; // 請支援輸贏！
                let num = Number(m[0].match("[0-9]+")[0]); // 場數\

                // add this to dict
                let targetVal = dict[chara] ?? {win:null, lose:null, pt:0}; // {win, lose, pt}

                // 判斷同名角
                if(num <= targetVal[isWin?"win":"lose"]) // check existed key >= num, if true, that might me 同名角色 AKA 同素異構物
                {
                    overrideChara = chara;
                    //console.log(`同名角色 ${chara} ${num} / ${targetVal[isWin?"win":"lose"]}`);
                }
                if(overrideChara === chara)
                {
                    chara = chara + "(新)";
                }
                else
                {
                    overrideChara = "";
                }
                targetVal = dict[chara] ?? {win:null, lose:null, pt:0}; // {win, lose, pt}

                //console.log(`${chara} ${isWin?"勝":"敗"} ${num} pt=${achiPt}`);
                targetVal[isWin?"win":"lose"] = num;
                targetVal["pt"] += achiPt;
                dict[chara] = targetVal;
            }
            else
            {
                //console.log(achiStr + " " + achiPt)
                continue;
            }
        }
        //console.log(dict);


        /** 要注入的主東西 */
        let container = document.getElementsByClassName("sc-fzplWN hRBsWH")[0];
        let div = document.createElement('div');
        div.style.backgroundColor = "#B4F8C811";

        let h = document.createElement('b');
        h.innerHTML = "被我抓在你在玩 mykirito，好色喔";
        div.appendChild(h);

        let table = document.createElement('table');
        div.appendChild(table);

        //div.appendChild(document.createTextNode('標有 (新) 的角色表示該角色有兩個型態，而 (新) 的是出現在成就榜第二個'))

        container.insertBefore(div, container.children[2]);

        /** 注入的元素 */
        // 表頭
        let tr = document.createElement('tr');
        let arr = ["#", "我的角色", "累積勝場", "累積敗場", "累積成就"];
        for(let i = 0; i < arr.length; i++)
        {
            let th = document.createElement('th');
            th.innerHTML = arr[i];
            tr.appendChild(th);
        }
        table.appendChild(tr);

        // 表內容
        // 先換成 array 再 sort; array: [ (name, {win,lose,pt}) ]
        let array = Object.keys(dict).map((key)=>[key, dict[key]]);
        //console.log(array)
        array.sort((a,b)=> b[1].pt - a[1].pt);

        // 印表
        for(let i = 0; i < array.length; i++)
        {
            let a = array[i];

            let name = a[0];
            let win = a[1].win
            let lose = a[1].lose
            let pt = a[1].pt

            //console.log(key, value);
            tr = document.createElement('tr');
            let arr = [i+1+". ", name, win??0, lose??0, pt];
            for(let i = 0; i < arr.length; i++)
            {
                let td = document.createElement('td');
                td.innerHTML = arr[i];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

    }

})();
