// ==UserScript==
// @name        Shoutbox
// @namespace   Happy
// @description Der Forenchat für RPG-City
// @include     *rpg-city.de/index.php?page=Index*
// @include     *rpg-city.de
// @include     *rpg-city.de
// @include     *rpg-city.de/
// @include     *rpg-city.de/?s=*
// @include     *rpg-city.de/index.php
// @include     *rpg-city.de*BoardList*
// @exclude     *cp.rpg-city.de*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/10497/Shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/10497/Shoutbox.meta.js
// ==/UserScript==


if(localStorage.getItem("hide") == null) localStorage.setItem("hide", 0);
var hide = localStorage.getItem("hide") == 1;
var username = document.getElementsByClassName("userAvatarImage")[0].parentNode;
username.href.search(/User\/(\d+)/);
var uid = RegExp.$1;
var framediv = document.createElement("div");
framediv.innerHTML="<img style='cursor:pointer;margin-right:10px;' src='http://david97.php-friends.de/Sonstiges/RPG-Chat/"+(hide ? "plus.png" : "minus.png")+"' onclick=\"this.src='http://david97.php-friends.de/Sonstiges/RPG-Chat/minus.png';if(document.getElementById('chatframe').style.display==''){document.getElementById('chatframe').style.display = 'none';this.src='http://david97.php-friends.de/Sonstiges/RPG-Chat/plus.png';localStorage.setItem('hide', 1);}else document.getElementById('chatframe').style.display = '';localStorage.setItem('hide', 0);\"> <b>Chat</b>";
framediv.setAttribute("style", "padding:10px;margin-bottom:10px;border:1px black solid;border-radius:5px;background-color:#e5e9ed;");
var frame = document.createElement("iframe");
frame.src = "http://david97.php-friends.de/Sonstiges/RPG-Chat/index.php?uid="+uid+"&name="+username.getElementsByTagName("span")[0].innerHTML+"&ver=1.2";
frame.setAttribute("frameborder", "0");
frame.setAttribute("scrolling", "no");
frame.setAttribute("style", "width:100%;height:300px;"+(hide ? "style: display:none;" : ""));
frame.id = "chatframe";
framediv.appendChild(frame);
document.getElementsByClassName("contentNavigation")[0].appendChild(framediv);