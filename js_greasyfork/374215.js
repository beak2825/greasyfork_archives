// ==UserScript==
// @name         好友页面显示Steam空余好友位
// @namespace    http://blog.853lab.com/
// @version      0.1
// @description  Show Steam empty friend list.
// @author       Sonic853
// @include		*://steamcommunity.com/id/*
// @include		*://steamcommunity.com/profiles/*
// @exclude		*://steamcommunity.com/id/*/friends/
// @exclude		*://steamcommunity.com/profiles/*/friends/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374215/%E5%A5%BD%E5%8F%8B%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BASteam%E7%A9%BA%E4%BD%99%E5%A5%BD%E5%8F%8B%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/374215/%E5%A5%BD%E5%8F%8B%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BASteam%E7%A9%BA%E4%BD%99%E5%A5%BD%E5%8F%8B%E4%BD%8D.meta.js
// ==/UserScript==

var EdmundDZhang = document.getElementsByClassName("friendPlayerLevelNum")[0].innerText;
document.getElementsByClassName("profile_friend_links")[0].getElementsByClassName("profile_count_link_total")[0].innerHTML += ' / '+ (250 + (5 * EdmundDZhang)) +'<span style="font-size: 12px;">or ' + (300 + (5 * EdmundDZhang)) + '</span>';