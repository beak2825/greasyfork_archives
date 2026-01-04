// ==UserScript==
// @name         卡特自訂首頁
// @namespace    http://tampermonkey.net/
// @version      0.1.04
// @description  RT
// @author       SmallYue1
// @match        https://kater.me*
// @match        https://kater.me/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/393100/%E5%8D%A1%E7%89%B9%E8%87%AA%E8%A8%82%E9%A6%96%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/393100/%E5%8D%A1%E7%89%B9%E8%87%AA%E8%A8%82%E9%A6%96%E9%A0%81.meta.js
// ==/UserScript==

var 定時偵測Path變化,Pre_Href,BlockList;

function 偵測Path變化()
{
    var Href = location.href;
    var a = Href.split("/");
    if((Href !== Pre_Href) && (a.length < 6))
    {
        if(Href === "https://kater.me/")
        {
            console.log("偵測到進入首頁:"+Pre_Href+"->"+Href);
            setTimeout(() => 首頁屏蔽(),500);
            setTimeout(() => 偵測新增節點(),500);
        }
        if(Href.indexOf("/t/") !== -1)
        {
            console.log("偵測到進入新版塊:"+Pre_Href+"->"+Href);
            setTimeout(() => 首頁屏蔽(),500);
            setTimeout(() => 偵測新增節點(),500);
        }
        else if(Href.indexOf("/d/") !== -1)
        {
            console.log("偵測到進入新討論串:"+Pre_Href+"->"+Href);
        }
        Pre_Href = Href;
    }
    else if(Href !== Pre_Href)
    {
        a.pop();
        if(a.join("/") !== Pre_Href)
        {
            if(Href.indexOf("/t/") !== -1)
            {
                console.log("偵測到進入新版塊:"+Pre_Href+"->"+Href);
                setTimeout(() => 首頁屏蔽(),500);
                setTimeout(() => 偵測新增節點(),500);
            }
            else if(Href.indexOf("/d/") !== -1)
            {
                console.log("偵測到進入新討論串:"+Pre_Href+"->"+Href);
            }
            Pre_Href = a.join("/");
        }
    }
}

function 偵測新增節點()
{
    var DiscussionList = $(".DiscussionList-discussions");
    if(DiscussionList.length !== 0)
    {
        var callback = function (records){
            records.map(function(record){
                if(record.addedNodes.length != 0)
                {
                    setTimeout(() => {
                        var Tags = $(record.addedNodes[0]).find("span.TagsLabel span.TagLabel-text")
                        for(var Tag of Tags)
                        {
                            if(BlockList.indexOf(Tag.innerText.replace(/ /g,"")) !== -1)
                            {
                                $(Tag).parents("li")[1].setAttribute("style","display:none;");
                            }
                        }
                    },100);
                }
            });
        };

        var mo = new MutationObserver(callback);

        var option = {
            'childList': true
        };
        mo.observe(DiscussionList[0], option);
    }
}

function 首頁屏蔽()
{
    var Tags = $("span.TagsLabel span.TagLabel-text");
    for(var Tag of Tags)
    {
        if(BlockList.indexOf(Tag.innerText.replace(/ /g,"")) !== -1)
        {
            $(Tag).parents("li")[1].setAttribute("style","display:none;");
        }
    }
}

function 新增按鈕()
{
    if($("#Script_Btn").length === 0)
    {
        var Ul = $("ul.Header-controls")[1];
        var Li_Setting = document.createElement('li');
        Li_Setting.innerHTML = `<div class=\"ButtonGroup Dropdown dropdown SessionDropdown itemCount5\"><button class=\"Dropdown-toggle Button Button--flat\"><i class=\"icon fas fa-cogs Button-icon\"></i><span>自訂首頁</span></button></div>`;
        Ul.appendChild(Li_Setting);
        Li_Setting.setAttribute("id","Script_Btn");
        Li_Setting.setAttribute("class","item-session");
        Li_Setting.addEventListener("click",() => {取得Tag資料()});
    }
}


function 取得Tag資料() {
    var datas = [],datas_has_parent = [];
    var settings = {
        "url":"https://kater.me/api/tags",
        "method":"GET",
        "headers":{
            "X-CSRF-TOKEN":app.data.session.csrfToken
        },
        success:function(e){
            for(var data of e.data)
            {
                try{
                    if(data.relationships.parent.data.id !== "")
                    {
                        var Tempt2 = {
                            "id":data.id,
                            "position":data.attributes.position,
                            "name":data.attributes.name,
                            "icon":data.attributes.icon,
                            "color":data.attributes.color,
                            "parent_id":data.relationships.parent.data.id
                        };
                        datas_has_parent.push(Tempt2);
                    }
                }
                catch(d)
                {
                    var Tempt = {
                        "id":data.id,
                        "position":data.attributes.position,
                        "name":data.attributes.name,
                        "icon":data.attributes.icon,
                        "color":data.attributes.color,
                        "parent_id":""
                    };
                    datas.push(Tempt);
                }
            }
            建立設定頁面(datas,datas_has_parent);
        },
        error:function(e){
            console.log(e);
        }
    }
    try{
        $.ajax(settings);
    }
    catch(e)
    {

    }
}

function 建立設定頁面(datas,datas_has_parent)
{
    document.body.innerHTML = "<body></body>"
    var Div = document.createElement('div');
    var Tags = document.createElement('ul');
    var Text_Color,Icon_Color;
    Div.setAttribute("style","max-width:100%;height:100%;");
    Tags.setAttribute("class","Dropdown-menu dropdown-menu");
    Tags.setAttribute("style","width:;display:block;position:static;");
    datas.sort(function (a, b) {
        return a.position < b.position ? -1 : 1;
    });
    datas_has_parent.sort(function (a, b) {
        return a.position < b.position ? -1 : 1;
    });
    for(var data of datas)
    {
        var Tag_Iteam = document.createElement('li');
        if(BlockList.indexOf(data.name) === -1)
        {
            Icon_Color = data.color;
            Text_Color = "#111";
        }
        else if(BlockList.indexOf(data.name) !== -1)
        {

            Icon_Color = "#b7b7b7";
            Text_Color = "#b7b7b7";
        }
        Tag_Iteam.innerHTML = `<a class="TagLinkButton hasIcon" style="text-align:center;width:100%;color:${Text_Color};"><i class="icon ${data.icon} Button-icon" style="float:initial;color:${Icon_Color};"></i>${data.name}</a>`;
        Tag_Iteam.setAttribute("id",data.id);
        Tag_Iteam.setAttribute("name",data.name);
        Tag_Iteam.setAttribute("color",data.color);
        Tag_Iteam.setAttribute("style","max-width:100%;height:100%;");
        Tag_Iteam.addEventListener("click",(e) => Tag_Iteam_Onclick_Event(e),false);
        Tags.appendChild(Tag_Iteam);
    }
    document.body.appendChild(Div);
    Div.appendChild(Tags);
    for(data of datas_has_parent)
    {
        var Parent_Tag_Iteam = document.getElementById(data.parent_id);
        Tag_Iteam = document.createElement('li');
        if(BlockList.indexOf(data.name) === -1)
        {
            Icon_Color = data.color;
            Text_Color = "#111";
        }
        else if(BlockList.indexOf(data.name) !== -1)
        {

            Icon_Color = "#b7b7b7";
            Text_Color = "#b7b7b7";
        }
        Tag_Iteam.innerHTML = `<a class="TagLinkButton hasIcon child" style = "text-align:center;width:100%;color:${Text_Color};max-width:100%;box-sizing:border-box;padding-left:50px;margin-left:0px;"><i class="icon ${data.icon} Button-icon" style="float:initial;color:${Icon_Color};"></i>${data.name}</a>`;
        Tag_Iteam.setAttribute("id",data.id);
        Tag_Iteam.setAttribute("name",data.name);
        Tag_Iteam.setAttribute("color",data.color);
        Tag_Iteam.setAttribute("style","max-width:100%;height:100%;");
        Tag_Iteam.addEventListener("click",(e) => Tag_Iteam_Onclick_Event(e),false);
        insertAfter(Tag_Iteam,Parent_Tag_Iteam);
    }
    var Back_To_Kater = document.createElement('div');
    Back_To_Kater.setAttribute("style","text-align:center;width:100%;height:100%;");
    Back_To_Kater.innerHTML = `<div style="margin:0 auto;"><a href="https://kater.me/"><button class="Button Button--primary IndexPage-newDiscussion hasIcon" itemclassname="App-primaryControl" type="button" title="回到卡特"><i class="icon fas fa-edit Button-icon"></i><span class="Button-label">回到卡特</span></button></a></div>`;
    document.body.appendChild(Back_To_Kater);
}

function Tag_Iteam_Onclick_Event(e) {
    var Target = $(e.target).parents("li")[0];
    var Block_Text = Target.getAttribute("name");
    var Text_Color,Icon_Color;
    if(BlockList.indexOf(Block_Text) === -1)
    {
        //新增屏蔽
        BlockList.push(Block_Text)
        GM_setValue("Kater_BlockList", BlockList);
        Icon_Color = "#b7b7b7";
        Text_Color = "#b7b7b7";
    }
    else if(BlockList.indexOf(Block_Text) !== -1)
    {
        //解除屏蔽
        BlockList.splice(BlockList.indexOf(Block_Text), 1);
        GM_setValue("Kater_BlockList", BlockList);
        Icon_Color = Target.getAttribute("color");
        Text_Color = "#111";
    }
    Target.firstElementChild.setAttribute("style",`text-align:center;width:100%;color:${Text_Color};`);
    Target.firstElementChild.firstElementChild.setAttribute("style",`float:initial;color:${Icon_Color};`);
}

function insertAfter(newE,targetE)
{
    var parentE = targetE.parentNode;

    if(parentE.lastChild == targetE)
    {
        parentE.appendChild(newE);
    }else
    {
        parentE.insertBefore(newE,targetE.nextSibling);
    }
}

$("document").ready(
    function()
    {
        'use strict';
        if(!GM_getValue("Kater_BlockList"))
        {
            BlockList = [];
            GM_setValue("Kater_BlockList", []);
            console.log("偵測到初次使用腳本 O_Ob");
        }
        else
        {
            BlockList = GM_getValue("Kater_BlockList");
            console.log(BlockList);
        }
        定時偵測Path變化 = setInterval(() => 偵測Path變化(),100);
        setTimeout(() => 新增按鈕(),100);
        // Your code here...
    }
);