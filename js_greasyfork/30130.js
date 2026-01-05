// ==UserScript==
// @include      *read*tid*
// @include      *thread*
// @include      *forum*fid*
// @include      *tieba.baidu.com/p/*
// @exclude      *.google.*
// @name BBS NoWater
// @author tumuyan
// @version 0.2
// @namespace   http://userscripts.org/users/tumuyan
// @description 吃掉纯图和纯表情回复,支持百度贴吧和phpwind/discuz的某些版本

// @downloadURL https://update.greasyfork.org/scripts/30130/BBS%20NoWater.user.js
// @updateURL https://update.greasyfork.org/scripts/30130/BBS%20NoWater.meta.js
// ==/UserScript==
var posttext=document.querySelectorAll(".l_post")

i=posttext.length
if (i)
{
    for (i=i-1;i>0;i--)
    {
    	try {if (posttext[i].querySelectorAll(".d_post_content")[0].innerText.match(/^\s*$/)) {posttext[i].innerHTML='' }}catch(err){}     
     }
}


var posttext=document.querySelectorAll("div[id^='post_']")

i=posttext.length
if (i)
{
    for (i=i-1;i>0;i--)
    {
        try {if (posttext[i].querySelectorAll("div[id^='postmessage_']")[0].innerText.match(/^\s*$/)) {posttext[i].innerHTML='' } }catch(err){}     

    }
}



var posttext=document.querySelectorAll('div[class="mainbox viewthread"]')

i=posttext.length
if (i)
{
    for (i=i-1;i>0;i--)
    {
        try {if (posttext[i].querySelectorAll("div[id^='postmessage_']")[0].innerText.match(/^\s*$/)) {posttext[i].innerHTML='' } }catch(err){}     

    }
}


var posttext=document.querySelectorAll(".read_t")

i=posttext.length
if (i)
{
    for (i=i-1;i>0;i--)
    {
        try {if (posttext[i].querySelectorAll(".tpc_content")[0].innerText.match(/^\s*$/i)) {posttext[i].innerHTML='' } }catch(err){}     
     }
}