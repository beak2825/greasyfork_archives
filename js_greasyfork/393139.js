// ==UserScript==
// @name         卡特自訂首頁(含收藏文章)
// @namespace    http://tampermonkey.net/
// @version      0.2.00
// @description  RT
// @author       SmallYue1
// @match        https://kater.me*
// @match        https://kater.me/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/14208-datejs/code/Datejs.js?version=89671
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/393139/%E5%8D%A1%E7%89%B9%E8%87%AA%E8%A8%82%E9%A6%96%E9%A0%81%28%E5%90%AB%E6%94%B6%E8%97%8F%E6%96%87%E7%AB%A0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393139/%E5%8D%A1%E7%89%B9%E8%87%AA%E8%A8%82%E9%A6%96%E9%A0%81%28%E5%90%AB%E6%94%B6%E8%97%8F%E6%96%87%E7%AB%A0%29.meta.js
// ==/UserScript==

var BlockList,FavoriteList;

function 新增功能(ul)
{
    收藏文章(ul);
    自訂首頁(ul);
}

function 覆寫Ul(Ul,Data_Id)
{
    var Li = document.createElement('li');
    Li.innerHTML = `<button class=" hasIcon" type="button" title="收藏"><i></i><span class="Button-label">收藏</span></button>`;
    Li.setAttribute("class","item-subscription");
    Li.setAttribute("data-id",Data_Id);
    if(FavoriteList.indexOf(Data_Id) === -1)
    {
        Li.firstElementChild.firstElementChild.setAttribute("class","icon far fa-star Button-icon");
    }
    else if(FavoriteList.indexOf(Data_Id) !== -1)
    {
        Li.firstElementChild.firstElementChild.setAttribute("class","icon fas fa-star Button-icon");
    }
    Ul.insertBefore(Li,Ul.firstElementChild);
    Li.addEventListener("click",function(){
        var Data_Id = this.getAttribute("data-id");
        if(FavoriteList.indexOf(Data_Id) === -1)
        {
            //新增收藏
            FavoriteList.push(Data_Id)
            GM_setValue("Kater_FavoriteList", FavoriteList);
            this.firstElementChild.firstElementChild.setAttribute("class","icon fas fa-star Button-icon");
        }
        else if(FavoriteList.indexOf(Data_Id) !== -1)
        {
            //解除收藏
            FavoriteList.splice(FavoriteList.indexOf(Data_Id), 1);
            GM_setValue("Kater_FavoriteList", FavoriteList);
            this.firstElementChild.firstElementChild.setAttribute("class","icon far fa-star Button-icon");
        }
    },false);
}

function 新增腳本工具列按鈕()
{
    if($("#Script_Btn").length === 0)
    {
        var Ul = $("ul.Header-controls")[1];
        var Li_Setting = document.createElement('li');
        Li_Setting.innerHTML = `<div class="ButtonGroup Dropdown dropdown SessionDropdown itemCount2"><button class=\"Dropdown-toggle Button Button--flat\" data-toggle=\"dropdown\"><i class=\"icon fas fa-cogs Button-icon\"></i><span>腳本設定</span></button><ul class="Dropdown-menu dropdown-menu Dropdown-menu--right"></ul></div>`;
        Ul.appendChild(Li_Setting);
        新增功能(Li_Setting.firstElementChild.lastElementChild);
        Li_Setting.setAttribute("id","Script_Btn");
        Li_Setting.setAttribute("class","item-session");
    }
}

function 自訂首頁(Ul)
{
    var Li = document.createElement('li');
    Ul.appendChild(Li);
    Li.innerHTML = `<button class=" hasIcon" type="button" title="自訂首頁"><i class="icon fas fa-cog Button-icon"></i><span class="Button-label">自訂首頁</span></button>`;
    Li.setAttribute("class","item-profile");
    Li.addEventListener("click",() => {取得Tag資料()});
}

function 收藏文章(Ul)
{
    var Li = document.createElement('li');
    Ul.appendChild(Li);
    Li.innerHTML = `<button class=" hasIcon" type="button" title="收藏文章"><i class="icon fas fa-star Button-icon"></i><span class="Button-label">收藏文章</span></button>`;
    Li.setAttribute("class","item-profile");
    Li.addEventListener("click",() => {建立收藏頁面()});
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
    document.body.innerHTML = "<body></body>";
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
        Tag_Iteam.addEventListener("click",(e) => {Tag_Iteam_Onclick_Event(e);},false);
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
        Tag_Iteam.addEventListener("click",(e) => {Tag_Iteam_Onclick_Event(e);},false);
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


async function 建立收藏頁面(){
    var Ul,Data,Data_Id,Article_Card,Li_Display;
    document.body.innerHTML = "<body></body>";
    var Back_To_Kater = document.createElement('div');
    Back_To_Kater.setAttribute("style","text-align:center;width:100%;height:auto;position:fixed;display:block;z-index:5;");
    Back_To_Kater.innerHTML = `<div class="header-secondary" style="width:100%"><a href="https://kater.me/"><button itemclassname="App-primaryControl" type="button" title="回到卡特" style="width:100%" class="Button Button--primary IndexPage-newDiscussion hasIcon"><span class="Button-label">回到卡特</span></button></a></div>`;
    document.body.appendChild(Back_To_Kater);
    var Article_List = document.createElement('ul');
    document.body.appendChild(Article_List);
    Article_List.setAttribute("class","PostsUserPage-list");
    Article_List.setAttribute("style","width:80%;padding-top:45px;padding-bottom:45px;padding-left:20%;");
    for(var Favorite of FavoriteList)
    {
        Data = await 取得收藏資料(Favorite);
        Article_Card = document.createElement('li');
        Article_List.appendChild(Article_Card);
        Article_Card.innerHTML = `<div class="PostsUserPage-discussion">於 <a href="https://kater.me/d/${Data.discussions_id}/${Data.floor}">${Data.title}</a></div>
                                      <article class="Post  CommentPost">
                                              <div>
                                                  <header class="Post-header">
                                                      <ul>
                                                          <li class="item-user">
                                                              <div class="PostUser">
                                                                  <h3><a href="https://kater.me/u/${Data.uid}"><img class="Avatar PostUser-avatar" src="${Data.avatarUrl}"><span class="username">${Data.username}</span></a></h3>
                                                                  <ul class="badges">
                                                                  </ul>
                                                              </div>
                                                          </li>
                                                          <li class="item-meta">
                                                              <div class="Dropdown PostMeta">
                                                                  <a class="Dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                      <time pubdate="true" datetime="${Data.time}" title="${Date.parse(Data.time)}" data-humantime="true">${Date.parse(Data.time).toString("yyyy/M/d HH:mm:ss")}</time>
                                                                  </a>
                                                              </div>
                                                          </li>
                                                          <li class="TextEditor-toolbar">
                                                              <button class="Button Button--icon Button--link hasIcon">
                                                                  <i class="icon far fa-eye-slash Button-icon"></i>
                                                              </button>
                                                          </li>
                                                      </ul>
                                                  </header>
                                                  <div class="Post-body" style = "display:none;">${Data.contentHtml}</div>
                                                  <aside class="Post-actions">
                                                      <ul></ul>
                                                  </aside>
                                              </div>
                                          </article>`;
        Ul = Article_Card.lastElementChild.firstElementChild.lastElementChild.firstElementChild;
        Data_Id = Data.data_id;
        await 覆寫Ul(Ul,Data_Id);
        Ul.firstElementChild.removeAttribute("class");
        Ul.firstElementChild.firstElementChild.setAttribute("class","Dropdown-toggle Button Button--icon Button--flat");
        Ul.firstElementChild.addEventListener("click",function(){
            var Data_Id = this.getAttribute("data-id");
            $(this).parents("li")[0].setAttribute("style","display:none;");
        },false);
        Li_Display = Article_Card.lastElementChild.firstElementChild.firstElementChild.firstElementChild.lastElementChild;
        Li_Display.addEventListener("click",function() {
            var icon = this.firstElementChild.firstElementChild;
            if(icon.getAttribute("class") !== "icon far fa-eye-slash Button-icon")
            {
                this.parentNode.parentNode.parentNode.children[1].setAttribute("style","display:none;");
                icon.setAttribute("class","icon far fa-eye-slash Button-icon");
            }
            else
            {
                this.parentNode.parentNode.parentNode.children[1].setAttribute("style","");
                icon.setAttribute("class","icon far fa-eye Button-icon");
            }
        },false);
    }

}

async function 取得收藏資料(Favorite){
    try{
        return new Promise((resolve,reject) => {
            var settings = {
                "url":"https://kater.me/api/posts/"+Favorite,
                "method":"GET",
                "headers":{
                    "X-CSRF-TOKEN":app.data.session.csrfToken
                },
                success:function(e){
                    for(var item of e.included)
                    {
                        if(item.type === "discussions")
                        {
                            var title = item.attributes.title;
                            var discussions_id = item.id;
                        }
                    }
                    var Data = {
                        "data_id":e.data.id,
                        "floor":e.data.attributes.number,
                        "time":e.data.attributes.createdAt,
                        "contentHtml":e.data.attributes.contentHtml,
                        "username":e.included[0].attributes.username,
                        "avatarUrl":e.included[0].attributes.avatarUrl,
                        "uid":e.included[0].id,
                        "discussions_id":discussions_id,
                        "title":title
                    };
                    resolve(Data);
                },
                error:function(e){
                    console.log(e);
                    reject("Error");
                }
            }
            $.ajax(settings);
        });
    }
    catch(e)
    {

    }
}


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

if(!GM_getValue("Kater_FavoriteList"))
{
    FavoriteList = [];
    GM_setValue("Kater_FavoriteList", []);
    console.log("偵測到初次使用腳本 O_Ob");
}
else
{
    FavoriteList = GM_getValue("Kater_FavoriteList");
    console.log(FavoriteList);
}

var callback = function (records){
    records.map(function(record){
        if(record.addedNodes.length != 0)
        {
            setTimeout(() => {
                var Tag = $(record.addedNodes[0]).find("span.TagLabel-text")[0];
                if(Tag !== undefined)
                {
                    if(BlockList.indexOf(Tag.innerText.replace(/ /g,"")) !== -1)
                    {
                        $(Tag).parents("li")[1].setAttribute("style","display:none;");
                    }
                }
                var Ul = $(record.addedNodes[0]).find("aside.Post-actions ul.Dropdown-menu--right")[0];
                if(Ul !== undefined)
                {
                    if($(Ul).find("li.item-subscription").length === 0)
                    {
                        var Data_Id = $(Ul).parents("div.PostStream-item")[0].getAttribute("data-id");
                        覆寫Ul(Ul,Data_Id)
                    }
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
        setTimeout(() => 新增腳本工具列按鈕(),100);
        // Your code here...
    }
);