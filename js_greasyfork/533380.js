// ==UserScript==
// @name         SteamPY owned
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Key站已拥有/进包次数/有卡提示
// @author       Cliencer
// @match        https://steampy.com/cdKey/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampy.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @resource     card https://bartervg.com/browse/cards/json/
// @resource     bundles https://bartervg.com/browse/bundles/json/
// @connect      steamcommunity.com
// @connect      store.steampowered.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533380/SteamPY%20owned.user.js
// @updateURL https://update.greasyfork.org/scripts/533380/SteamPY%20owned.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var localStorage = {
        "lastTime":null,
        "card":[],
        "bundles":[],
        "steamid":null,
        "personaname":null,
        "profileurl":null,
        "avatar":null,
        "own":null,
        "wish":null,
        "sub":null,
        "load": ()=>{
            for(let proto in localStorage){
                if(typeof localStorage[proto]!=="function"){
                    localStorage[proto] = GM_getValue(proto,null);
                }
            }
        },
        "save": ()=>{
            for(let proto in localStorage){
                if(typeof localStorage[proto]!=="function"){
                    GM_setValue(proto,localStorage[proto]);
                }
            }
        }
    }
    localStorage.load()

    //GM_registerMenuCommand('⚙设置', setting)
    if(localStorage.lastTime){
        var commandName = `同步Steam游戏列表（上次同步时间${localStorage.lastTime}）`;
    }else{
        var commandName = `同步Steam游戏列表（还未同步）`;
    }



    GM_registerMenuCommand(commandName, async () => {
        var nocache = '_=' + Math.floor(Math.random() * 100000);
        await load('https://steamcommunity.com/my/games?tab=all', 'own');
        await load('https://store.steampowered.com/dynamicstore/userdata/?' + nocache, 'userdata');
        localStorage.card = await json_card();
        localStorage.bundles = await json_bundles();
        localStorage.lastTime = getTimeNow();
        localStorage.save();
        alert(`同步完成，您拥有${localStorage.own.length}个游戏，${localStorage.sub.length}个SUB，${localStorage.wish.length}个愿望单游戏`)
        window.location.reload()
    })



    var proc_={
        "own": (str)=>{
            //var str_own = unescape($('#own').text());
            var str_own = str;
            var dom_own = (new DOMParser()).parseFromString(str, 'text/html');
            console.log(dom_own)
            function parse_data(id, attr) {
                var tmp = dom_own.getElementById(id);
                if (tmp) tmp = tmp.getAttribute(attr);
                if (tmp) tmp = JSON.parse(tmp);
                return tmp;
            }
            var match = parse_data('gameslist_config', 'data-profile-gameslist');
            console.log(match)
            if (match) {
                localStorage.steamid = match.strSteamId;
                localStorage.personaname = match.strProfileName;
                var tmp = parse_data('profile_config', 'data-config'); if (tmp) localStorage.profileurl = tmp.ProfileURL;
                tmp = dom_own.querySelector('.playerAvatar > img'); if (tmp) localStorage.avatar = tmp.getAttribute('src').replace('_medium.jpg', '.jpg');
                localStorage.save()

            } else {
                if (str_own.match(/global_action_link/)) {
                    alert("需要先在浏览器登录steam账号");
                }
            }
        },
        "userdata": (json)=>{
            var data = JSON.parse(json);
            if(data){
                var own = data.rgOwnedApps;
                var wish = data.rgWishlist;
                var sub = data.rgOwnedPackages;
                if(own||wish||sub){
                    localStorage.own = own;
                    localStorage.wish = wish;
                    localStorage.sub = sub;
                    localStorage.save()
                }
            }
        }
    }


    async function load(url, id) {
        try {
            await GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    proc_[id](response.responseText);
                }
            });
            return new Promise(resolve => {
                resolve(true)
            })
        } catch(e) {
            return new Promise(resolve => {
                resolve(false)
            })
        }
    }

    function addslashes(string) {
        return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
    }
    function getTimeNow() {
        return new Date().toLocaleString('se');
    }
    function json_card(){
        return new Promise(resolve => {
            resolve(JSON.parse(GM_getResourceText('card')))
        });
    };

    function json_bundles(){
        return new Promise(resolve => {
            resolve(JSON.parse(GM_getResourceText('bundles')))
        });
    };

    function processGameBlock(gameBlock,isChild) {

        if(isChild){
            gameBlock = gameBlock.parentElement;
        }
        // 查找目标元素
        const iconDiv = gameBlock.querySelector('.gameHead .cdkGameIcon');
        const nameDiv = gameBlock.querySelector('.gameName');
        if (!iconDiv) return;
        nameDiv.style.color='black';
        nameDiv.style.fontWeight = 'normal';
        gameBlock.style.background = '';

        // 提取游戏ID
        const src = iconDiv.dataset.src;
        const match = src.match(/\/(\d+)\/header/);
        var bundles=gameBlock.querySelector('.tag-bundles')
        if(!bundles){
            bundles=document.createElement('span');
            bundles.className='tag-bundles';
        }
        bundles.innerHTML=" "
        console.log(gameBlock)
        if (!match) return;

        const appId = parseInt(match[1], 10);


        // 检查并设置背景颜色
        if(localStorage.card.hasOwnProperty(appId)){
            bundles.innerHTML="🃏"+bundles.innerHTML;
            nameDiv.style.color='red';
            nameDiv.style.fontWeight = 'bolder';
        }



        if(localStorage.bundles.hasOwnProperty(appId)){
            bundles.innerHTML=`📦x${localStorage.bundles[appId].bundles}`+bundles.innerHTML;
        }else{
            bundles.innerHTML=`🥇`+bundles.innerHTML;
        }
        nameDiv.prepend(bundles); //在被选元素最前插入
        if (localStorage.own.includes(appId)) {
            gameBlock.style.background = 'green';
        }
    }

    // 批量处理现有区块
    function processAllBlocks(block) {
        block.querySelectorAll('.gameblock.c-point:not([data-processed])')
            .forEach(processGameBlock,false);
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
        //console.log(mutations)
        for (let mutation of mutations) {
            if (mutation.target.className =="flex-row") {
                processGameBlock(mutation.target,true)
            }else{
                break;
            }
        }
    });

    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })
    // 初始处理
    processAllBlocks(document.body);

})();