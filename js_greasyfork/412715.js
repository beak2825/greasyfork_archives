// ==UserScript==
// @name         Keylol论坛显示Steam名称
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  在帖子楼层中显示Steam名称。
// @author       Android_KitKat
// @icon         https://keylol.com/favicon.ico
// @match        *://keylol.com/t*
// @match        *://keylol.com/forum.php?mod=viewthread&tid=*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      steamcommunity.com
// @connect      api.steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/412715/Keylol%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BASteam%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/412715/Keylol%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BASteam%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 是否使用WebAPI来获取数据，true为启用，false为禁用。
    var webapi = false;
    // 请在此处填写你的Steam网页API密钥。
    // 注册链接: https://steamcommunity.com/dev/apikey
    var apikey = '';
    // 缓存过期时间，默认一小时。
    var expire = 1000 * 60 * 60;

    var config = JSON.parse(localStorage.getItem('ksConfig')) || {};
    var menuid = [];

    function UpdateMenu() {
        menuid.forEach(GM_unregisterMenuCommand);
        var simple = GM_registerMenuCommand('切换样式: ' + (config.simple ? '简洁' : '完整'), function() {
            config.simple = config.simple ? !config.simple : true;
            localStorage.setItem('ksConfig', JSON.stringify(config));
            UpdateMenu();
        });
        menuid = [simple];
    }

    function AppendName(bar) {
        var friendlink = bar.querySelector('.steam_connect_user_bar_link_friend').href;
        var steamids = friendlink.split('friends/add/')[1];
        var cache = JSON.parse(localStorage.getItem('ksCache')) || {};
        if (cache[steamids] && (new Date().getTime() - cache[steamids].last) < expire) {
            SetBarName(bar, cache[steamids].name);
        } else {
            webapi ? AppendNameFromWebAPI(bar, steamids): AppendNameFromCommunity(bar, steamids);
        }
    }

    function AppendNameFromCommunity(bar, steamids) {
        GM_xmlhttpRequest({
            method: 'get',
            url: `https://steamcommunity.com/profiles/${steamids}/?xml=1`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            timeout: 3e5,
            onload: function(res) {
                var data = res.responseXML;
                var name = data.querySelector('steamID').textContent;
                CacheName(steamids, name);
                SetBarName(bar, name);
            }
        });
    }

    function AppendNameFromWebAPI(bar, steamids) {
        GM_xmlhttpRequest({
            method: 'get',
            url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apikey}&steamids=${steamids}`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            timeout: 3e5,
            onload: function(res) {
                var data = JSON.parse(res.responseText);
                var name = data.response.players[0].personaname;
                CacheName(steamids, name);
                SetBarName(bar, name);
            }
        });
    }

    function CacheName(steamids, name) {
        var cache = JSON.parse(localStorage.getItem('ksCache')) || {};
        cache[steamids] = {'name': name, 'last': new Date().getTime()};
        localStorage.setItem('ksCache', JSON.stringify(cache));
    }

    function SetBarName(bar, name) {
        bar.insertBefore(document.createTextNode((config.simple ? '' : '社区昵称: ') + name), bar.firstChild);
    }

    UpdateMenu();

    var bars = document.querySelectorAll('.steam_connect_user_bar');
    bars.forEach(AppendName);

    var postlist = document.getElementById("postlist");
    var observer = new MutationObserver(function(recs) {
        for(let rec of recs) {
            for(let node of rec.addedNodes) {
                if(node.querySelectorAll) {
                    let addedbars = node.querySelectorAll('.steam_connect_user_bar');
                    addedbars.forEach(AppendName);
                }
            }
        }
    });
    observer.observe(postlist, {childList: true, subtree: true});
})();