// ==UserScript==
// @name         keyjoker更新
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       HCLonely
// @match        https://www.keyjoker.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @compatible   chrome 没有测试其他浏览器的兼容性
// @downloadURL https://update.greasyfork.org/scripts/383323/keyjoker%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/383323/keyjoker%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldGameList="";
    //GM_setValue("gameList",0);
    if(GM_getValue("gameList")){
        oldGameList=GM_getValue("gameList");
    }else{
        oldGameList=["Uganda know de way","DEATHS MAZE","Quest For Wartorn Brotherhood","Run!","Gift of Life: Key of Solomon","The Orion Suns","Suicideville","Mission: Escape from Island 3","Underground Gossip","Life At Space","Psychical Madness","Space Shock 3","Ambers BOOM","Skyfall","AfterTime","Best Time Kill","Manipulator of Figure 3","Infinitely up 2","Ecchi Girls","Noise","Infinitely up","Lost Moon","- Arcane RERaise -","- Occult RERaise -","- Arcane preRaise -","- Occult preRaise -","ISIS Simulator","Project Defense","Gangsta Sniper","Finder","Lock Parsing 2","Fruitlockers Reborn! 2","Heaven & Hell 2","The Warrior Of Treasures 2: Skull Hunter","Save President From Rebels","Dangerous Ground","Dodge Bubble","Inferno Puzzle","Glitch Simulator 2018","Protect your planet","- Occult Raise -","Lopp","Ghost Killer","Athopiu - The Final Rebirth of Hopeless Incarnate","The Battle for the Hut","Asset Flip Simulator","Anime Fight in the Arena of Death","ZAMBI 2 KIL","Triggering Simulator","School of Horror","Ritter","Crazy Road","Polaris","Plane War","Christmas Mission","Zombow","MoonDigger","Knights of Hearts","Jungle Jorney","The path to domination","The Old Kazulka","Hungry Shadows","Hell in Paradise","Griefer","Flow:The Sliding","Finger Ninja","Fast Rolling","Eon Fleet","Cyber Fight","Clergyman","Bunny Hop","Bubble Strike","Boat Adventure","Beach Restaurant","Airbo","Air Guardians","9 Balls","Walls in Dead","TARGET","Stunt Hill","StepX","SHARK","Goat Life","!4RC4N01D! 4: KOHBEEP edition","Grav Grav Gravity","Running Man 3D","FYD","Guess who ?","Last Fort","Oh, you touch my balls ( ͡° ͜ʖ ͡°)","Baikonur Space","Weird Dungeon Explorer: Run Away","The mutton horn - Jump jump!","Color Cingdom","Seems good archery game","Ochkarik","80's style","In The Fighting","Cab Driver Commander","V nekotorom tsarstve","Underwater hunting"];
        GM_setValue("gameList",oldGameList);
    }

    let game="";
    let gameArray=[];
    let newGame=[];
    let keyArray=[];
    function keyJoker(i,sum){
        if(i<sum){
            i++;
            $.ajax({
                url:"https://www.keyjoker.com/?page="+i,
                type:"get",
                success:(data)=>{
                    gameArray=gameArray.concat(data.match(/\<h5 class=\"card-header\">[\w\W]+?\<\/h5\>[\w\W]+?https:\/\/www.keyjoker.com\/giveaways\/.*?\"/gim));
                    keyJoker(i,sum);
                }
            });
        }else{
            for(let i=0;i<gameArray.length;i++){
                let gameName=HTMLDecode(gameArray[i].match(/\>[\w\W]+?\</gim)[0].replace(/\<|\>/g,""));
                let gameUrl=gameArray[i].match(/\"https:\/\/www.keyjoker.com\/giveaways\/.*?\"/gim)[0].replace(/\"/g,"");
                newGame.push(gameName);
                let keyObj={
                    "name":gameName,
                    "url":gameUrl
                }
                keyArray.push(keyObj);
            }
            //let addGame=[];
            let addKey=[];
            for(let i=0;i<newGame.length;i++){
                let index=oldGameList.indexOf(newGame[i]);
                if(index<0){
                    //addGame.push(newGame[i]);
                    addKey.push(keyArray[i]);
                    //console.log(oldGameList);
                    //console.log(newGame[i]);
                }else{
                    oldGameList.splice(index,1);
                }
            }
            GM_setValue("gameList",newGame);
            console.log("已删游戏：");
            console.log(oldGameList);
            getGame(addKey,0);
            console.log("游戏列表：");
            console.log('["'+newGame.join('","')+'"]');
        }
    }

    function getGame(keyArray,i){
        if(i<keyArray.length){
            $.ajax({
                url:keyArray[i]["url"],
                type:"get",
                success:(data)=>{
                    game=game+"[url="+data.match(/https:\/\/store.steampowered.com\/app\/[\d]+/gim)[0]+"]"+keyArray[i]["name"]+"[/url]    [url="+keyArray[i]["url"]+"]keyjoker兑换链接[/url] \n";
                    i++;
                    getGame(keyArray,i);
                },
                error:()=>{
                    getGame(keyArray,i);
                }
            });
        }else{
            console.log("新增游戏"+keyArray.length+"：");
            console.log(game);
        }
    }
    function HTMLDecode ( input )
    {
        var converter = document.createElement("DIV");
        converter.innerHTML = input;
        var output = converter.innerText;
        converter = null;
        return output;
    }
    GM_registerMenuCommand("keyjoker",()=>{keyJoker(0,$("li.page-item").length-2)});
})();