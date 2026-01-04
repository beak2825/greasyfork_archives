// ==UserScript==
// @name         UOJ 博客黑名单
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  有一些人没有意识到它们的博客会被挂上首页让所有人看到
// @author       iotang
// @match        http://uoj.ac/blogs*
// @match        https://uoj.ac/blogs*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/388709/UOJ%20%E5%8D%9A%E5%AE%A2%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/388709/UOJ%20%E5%8D%9A%E5%AE%A2%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

"use strict";

function getSettings()
{
    var temp = GM_getValue("settings");

    if(temp === undefined)
    {
        GM_setValue("settings", {"isBanning": 1});
        temp = GM_getValue("settings");
    }

    return temp;
}

function getIsBan()
{
    var temp = getSettings();

    return temp.isBanning === 1;
}

function switchIsBan()
{
    var temp = getSettings();

    temp.isBanning = 1 - temp.isBanning;

    GM_setValue("settings",temp);

    window.location.reload();
}

function getBanList()
{
    var temp = GM_getValue("userBanList");

    if(temp === undefined)
    {
        GM_setValue("userBanList", {"zuxianyouming": "zuxianyouming"});
        temp = GM_getValue("userBanList");
    }

    return temp;
}

function addUserBan(who)
{
    var temp = getBanList();

    temp[who] = who;
    GM_setValue("userBanList", temp);

    alert("用户 `" + who + "` 被屏蔽");
}

function delUserBan(who)
{
    var temp = getBanList();

    if(temp[who] != who)
    {
        alert("用户 `" + who + "` 不在黑名单中");
        return;
    }

    temp[who] = undefined;

    GM_setValue("userBanList", temp);

    alert("用户 `" + who + "` 被取消屏蔽（刷新来查看）");
}

function cls()
{
    if(!getIsBan())return;


    var nowlist = getBanList();

    var tbody = document.getElementsByTagName("tbody")[0];

    var tnodes = tbody.childNodes;

    for(var i = 0; i < tnodes.length; i++)
    {
        var node = tnodes[i];

        var what = node.childNodes[0].childNodes[0].innerHTML;
        var who = node.childNodes[1].childNodes[0].innerHTML;

        if(what === "新博客" || nowlist[who] === who)
        {
            tbody.removeChild(node);
            i--;
            continue;
        }
    }
}

function confirmUserBan()
{
    var who = prompt("输入将被屏蔽的用户 ID");

    if(who === null || who === undefined || who.length <= 0)return;

    addUserBan(who);
    cls();
}

function undoUserBan()
{
    var who = prompt("输入将被取消屏蔽的用户 ID");

    if(who === null || who === undefined || who.length <= 0)return;

    delUserBan(who);
}

var uojContent = document.getElementsByClassName("uoj-content")[0];

var buttonSwitchBan = document.createElement("button");
buttonSwitchBan.name = "undoBanUser";
buttonSwitchBan.id = "undoBanUser";
if(getIsBan())
{
    buttonSwitchBan.innerHTML = "已开启";
    buttonSwitchBan.style = "background: rgb(212,212,255); border: none;";
}
else
{
    buttonSwitchBan.innerHTML = "已关闭";
    buttonSwitchBan.style = "background: rgb(212,212,212); border: none;";
}
buttonSwitchBan.onclick = function(){switchIsBan();};

var buttonBanUser = document.createElement("button");
buttonBanUser.style = "background: rgb(255,212,212); border: none;";
buttonBanUser.name = "banUser";
buttonBanUser.id = "banUser";
buttonBanUser.innerHTML = "黑名单";
buttonBanUser.onclick = function(){confirmUserBan();};

var buttonUndoBanUser = document.createElement("button");
buttonUndoBanUser.style = "background: rgb(212,255,212); border: none;";
buttonUndoBanUser.name = "undoBanUser";
buttonUndoBanUser.id = "undoBanUser";
buttonUndoBanUser.innerHTML = "白名单";
buttonUndoBanUser.onclick = function(){undoUserBan();};


uojContent.appendChild(buttonSwitchBan);
uojContent.appendChild(buttonBanUser);
uojContent.appendChild(buttonUndoBanUser);

cls();
