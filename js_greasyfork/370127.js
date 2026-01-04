// ==UserScript==
// @name         b站首页增加已追番入口
// @namespace    https://greasyfork.org/en/scripts/370127-b%E7%AB%99%E9%A6%96%E9%A1%B5%E5%A2%9E%E5%8A%A0%E5%B7%B2%E8%BF%BD%E7%95%AA%E5%85%A5%E5%8F%A3
// @version      1.7
// @description  在bilibili网页端上方菜单添加[已追番]的入口
// @author       franxx
// @match        *://www.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://t.bilibili.com/*
// @match        *://search.bilibili.com/*
// @match        *://account.bilibili.com/*
// @match        *://message.bilibili.com/*
// @grant        none
// @license      GPL-3.0-only
// @compatible   chrome 80+
// @downloadURL https://update.greasyfork.org/scripts/370127/b%E7%AB%99%E9%A6%96%E9%A1%B5%E5%A2%9E%E5%8A%A0%E5%B7%B2%E8%BF%BD%E7%95%AA%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/370127/b%E7%AB%99%E9%A6%96%E9%A1%B5%E5%A2%9E%E5%8A%A0%E5%B7%B2%E8%BF%BD%E7%95%AA%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {//首页增加追番入口
    var cookies = document.cookie;
    var id=cookies.match(/DedeUserID=(\d+)/)[1];
    var bangumiLink="https://space.bilibili.com/"+id+"/bangumi";

    oldTextModifier();
    newImageModifier();
    var timestamp=new Date().getTime();

    function getTextNode(){
        var newNode = document.createElement("div");
        newNode.setAttribute("class","item");
        newNode.innerHTML="<a href='"+bangumiLink+"' target='_blank'><span class='name'>追番</span></a>";
        return newNode;
    }

    function getImageNode(){
        var newNode = document.createElement("li");
        newNode.setAttribute("class","v-popover-wrap");
        var str='<a href="'+bangumiLink+'" target="_blank" class="right-entry__outside"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="right-entry-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z" fill="currentColor"></path></svg><span class="right-entry-text">追番</span></a>';
        newNode.innerHTML=str;
        return newNode;
    }

    function templateModifier(Obj,getNewNode,caller){
        if(Obj){
            Obj.parentNode.insertBefore(getNewNode(),Obj);
            timestamp=0;//crudely end
            console.log("B增追>"+caller.name+" applied");
        }else{
            //console.log(caller.name+" waiting");
            //console.log(document)
            var timestampDiff=new Date().getTime()-timestamp;
            if(timestampDiff>30*1000)return;
            setTimeout(caller,500);
        }
    }

    // https://www.bilibili.com/blackboard/activity-BV-PC.html
    function oldTextModifier(){
        var Obj=document.querySelector("#internationalHeader > div.mini-header.m-header > div > div.nav-user-center > div.user-con.signin > div:nth-child(5)");
        templateModifier(Obj,getTextNode,oldTextModifier);
    }

    // https://account.bilibili.com/
    // https://message.bilibili.com/
    // https://www.bilibili.com/opus/369825052444936486
    // main
    function newImageModifier(){
        var Obj=document.querySelector("ul.right-entry > li:nth-child(5)");
        templateModifier(Obj,getImageNode,newImageModifier);
    }

})();