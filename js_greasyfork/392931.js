// ==UserScript==
// @name         卡特黑名單
// @namespace    http://tampermonkey.net/
// @version      0.2.02
// @description  RT
// @author       SmallYue1
// @match        https://kater.me*
// @match        https://kater.me/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/392931/%E5%8D%A1%E7%89%B9%E9%BB%91%E5%90%8D%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/392931/%E5%8D%A1%E7%89%B9%E9%BB%91%E5%90%8D%E5%96%AE.meta.js
// ==/UserScript==

var BlackList;

function 覆寫樓層(Li_User)
{
    if($(Li_User.parentNode).find("li.TextEditor-toolbar").length === 0)
    {
        var Li_BlackList = document.createElement('li');
        var Btn_BlackList = document.createElement('button');
        var Icon_BlackList = document.createElement('i');
        var href = Li_User.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild.href;
        Li_BlackList.setAttribute("class","TextEditor-toolbar");
        Btn_BlackList.setAttribute("class","Button Button--icon Button--link hasIcon");
        if(BlackList.indexOf(href) === -1)
        {
            Icon_BlackList.setAttribute("class","icon far fa-eye Button-icon");
            Li_User.parentNode.parentNode.parentNode.childNodes[2].setAttribute("style","");
        }
        else if(BlackList.indexOf(href) !== -1)
        {
            Icon_BlackList.setAttribute("class","icon far fa-eye-slash Button-icon");
            Li_User.parentNode.parentNode.parentNode.childNodes[2].setAttribute("style","display:none;");
        }
        Li_User.parentNode.appendChild(Li_BlackList);
        Li_BlackList.appendChild(Btn_BlackList);
        Btn_BlackList.appendChild(Icon_BlackList);
        Li_BlackList.addEventListener("click",function(e) {
            var icon = this.firstElementChild.firstElementChild;
            var href = this.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild.href;
            if(icon.getAttribute("class") !== "icon far fa-eye-slash Button-icon")
            {
                //新增黑名單
                if(BlackList.indexOf(href) === -1)
                {
                    BlackList.push(href)
                    GM_setValue("Kater_BlackList", BlackList);
                    this.parentNode.parentNode.parentNode.childNodes[2].setAttribute("style","display:none;");
                }
                icon.setAttribute("class","icon far fa-eye-slash Button-icon");
            }
            else
            {
                //解除黑名單
                if(BlackList.indexOf(href) !== -1)
                {
                    BlackList.splice(BlackList.indexOf(href), 1);
                    GM_setValue("Kater_BlackList", BlackList);
                    this.parentNode.parentNode.parentNode.childNodes[2].setAttribute("style","");
                }
                icon.setAttribute("class","icon far fa-eye Button-icon");
            }
        },false);
    }
}

var callback = function (records){
    records.map(function(record){
        if(record.addedNodes.length != 0)
        {
            setTimeout(() => {
                var User = $(record.addedNodes[0]).find("a.DiscussionListItem-author")[0];
                var Li_User = $(record.addedNodes[0]).find("li.item-user")[0];
                if(User !== undefined)
                {
                    if(BlackList.indexOf(User.href) !== -1)
                    {
                        User.parentElement.parentElement.parentElement.setAttribute("style","display:none;");
                    }
                }
                if(Li_User !== undefined)
                {
                    覆寫樓層(Li_User);
                }
            },50);
        }
    });
};

var mo = new MutationObserver(callback);

var option = {
    'childList': true,
    'subtree' : true
};

mo.observe($("main.App-content")[0], option);

$("document").ready(
    function()
    {
        'use strict';
        if(!GM_getValue("Kater_BlackList"))
        {
            GM_setValue("Kater_BlackList", []);
        }
        else
        {
            BlackList = GM_getValue("Kater_BlackList");
        }
        console.log("BlackList："+BlackList);
        // Your code here...
    }
);