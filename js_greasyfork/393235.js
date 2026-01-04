// ==UserScript==
// @name         卡特個人化功能
// @namespace    http://tampermonkey.net/
// @version      0.3.02
// @license      MIT
// @description  RT
// @author       SmallYue1
// @match        https://kater.me
// @match        https://kater.me/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/14208-datejs/code/Datejs.js?version=89671
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/393235/%E5%8D%A1%E7%89%B9%E5%80%8B%E4%BA%BA%E5%8C%96%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/393235/%E5%8D%A1%E7%89%B9%E5%80%8B%E4%BA%BA%E5%8C%96%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

var _自訂首頁,_收藏文章,_關圖;

var BlockList,FavoriteList,User_Settings;

function 覆寫樓層(PostStream_Item,Li_User)
{
    if(!PostStream_Item.getAttribute("haschild")) return;
    if($(Li_User.parentNode).find("#ClosePictures_Icon").length !== 0) return;

    var Li_ClosePictures = document.createElement('li');
    var Btn_ClosePictures = document.createElement('button');
    var Icon_ClosePictures = document.createElement('i');
    Li_ClosePictures.setAttribute("class","TextEditor-toolbar");
    Btn_ClosePictures.setAttribute("class","Button Button--icon Button--link hasIcon");
    Icon_ClosePictures.setAttribute("id","ClosePictures_Icon");
    Icon_ClosePictures.setAttribute("class","icon fas fa-eye-slash Button-icon");
    Li_User.parentNode.appendChild(Li_ClosePictures);
    Li_ClosePictures.appendChild(Btn_ClosePictures);
    Btn_ClosePictures.appendChild(Icon_ClosePictures);
    Li_ClosePictures.addEventListener("click",function(e) {
        var Iframes = $(PostStream_Item).find("iframe");
        var Imgs = $(PostStream_Item).find("img[class != 'Avatar PostUser-avatar']");
        var icon = this.firstElementChild.firstElementChild;
        if(icon.getAttribute("class") !== "icon fas fa-eye-slash Button-icon")
        {
            //關圖
            icon.setAttribute("class","icon fas fa-eye-slash Button-icon");
            for(var Iframe of Iframes)
            {
                Iframe.setAttribute("style_pre",Iframe.getAttribute("style"));
                Iframe.setAttribute("style","display:none");
                Iframe.setAttribute("src_pre",Iframe.getAttribute("src"));
                Iframe.setAttribute("src","");
            }
            for(var Img of Imgs)
            {
                Img.setAttribute("style_pre",Img.getAttribute("style"));
                Img.setAttribute("style","display:none");
                Img.setAttribute("src_pre",Img.getAttribute("src"));
                Img.setAttribute("src","");
            }
        }
        else
        {
            //開圖
            icon.setAttribute("class","icon fas fa-eye Button-icon");
            for(Iframe of Iframes)
            {
                Iframe.setAttribute("style",Iframe.getAttribute("style_pre"));
                Iframe.setAttribute("src",Iframe.getAttribute("src_pre"));
            }
            for(Img of Imgs)
            {
                Img.setAttribute("style",Img.getAttribute("style_pre"));
                Img.setAttribute("src",Img.getAttribute("src_pre"));
            }
        }
    },false);
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
    if($("ul.Header-controls").length>=2)
    {
        if($("#Script_Btn").length != 0) return;
        var Ul = $("ul.Header-controls")[1];
        var Li_Setting = document.createElement('li');
        Li_Setting.innerHTML = `<div id="custom-dropdown-div" class="ButtonGroup Dropdown dropdown SessionDropdown"><button class=\"Dropdown-toggle Button Button--flat\" data-toggle=\"dropdown\"><i class=\"icon fas fa-cogs Button-icon\"></i><span>腳本設定</span></button><ul class="Dropdown-menu dropdown-menu Dropdown-menu--right"></ul></div>`;
        Ul.appendChild(Li_Setting);
        新增功能(Li_Setting.firstElementChild.lastElementChild);
        Li_Setting.setAttribute("id","Script_Btn");
    }
    else
    {
        setTimeout(() => 新增腳本工具列按鈕(),25);
    }
}

function 新增功能(Ul)
{
    if(_自訂首頁)自訂首頁(Ul);
    if(_收藏文章)收藏文章(Ul);
    卡特個人化功能(Ul);
}

function 卡特個人化功能(Ul)
{
    var Li = document.createElement('li');
    Ul.setAttribute("id","custom-dropdown-ul1")
    Ul.appendChild(Li);
    Ul.addEventListener("click", (e) => {e.stopPropagation();});
    Li.innerHTML = `<button class=" hasIcon" type="button" title="卡特個人化功能"><i class="icon fas fa-cog Button-icon"></i><span class="Button-label">卡特個人化功能</span></button>`;
    Li.setAttribute("class","item-profile");
    Li.addEventListener("click",() => {document.getElementById('custom-dropdown-ul1').setAttribute("style","display:none");建立卡特個人化功能頁面();});
}

function 收藏文章(Ul)
{
    var Li = document.createElement('li');
    Ul.appendChild(Li);
    Li.innerHTML = `<button class=" hasIcon" type="button" title="收藏文章"><i class="icon fas fa-star Button-icon"></i><span class="Button-label">收藏文章</span></button>`;
    Li.setAttribute("class","item-profile");
    Li.addEventListener("click",() => {建立收藏頁面()});
}

function 自訂首頁(Ul)
{
    var Li = document.createElement('li');
    Ul.appendChild(Li);
    Li.innerHTML = `<button class=" hasIcon" type="button" title="自訂首頁"><i class="icon fas fa-user-edit Button-icon"></i><span class="Button-label">自訂首頁</span></button>`;
    Li.setAttribute("class","item-profile");
    Li.addEventListener("click",() => {取得Tag資料();document.getElementById('custom-dropdown-ul1').setAttribute("style","display:none");});
}

function 建立卡特個人化功能頁面()
{
    var Div = document.getElementById('custom-dropdown-div');
    var Tags = document.createElement('ul');
    Tags.setAttribute("id","custom-dropdown-ul2");
    Tags.setAttribute("class","Dropdown-menu dropdown-menu Dropdown-menu--right");
    Tags.addEventListener("click", (e) => {e.stopPropagation();});
    新增卡特個人化功能頁面中的按鈕(Tags,"返回","fas fa-chevron-left",true);
    新增卡特個人化功能頁面中的按鈕(Tags,"自訂首頁","fas fa-user-edit",_自訂首頁);
    新增卡特個人化功能頁面中的按鈕(Tags,"收藏文章","fas fa-star",_收藏文章);
    新增卡特個人化功能頁面中的按鈕(Tags,"關圖","fas fa-eye-slash",_關圖);
    新增卡特個人化功能頁面中的按鈕(Tags,"套用(重整頁面)","far fa-save",true);
    Div.appendChild(Tags);
    var Back_To_Kater = document.createElement('div');
    Back_To_Kater.setAttribute("style","text-align:center;width:100%;height:100%;");
    Back_To_Kater.innerHTML = `<div style="margin:0 auto;"><a href="https://kater.me/"><button class="Button Button--primary IndexPage-newDiscussion hasIcon" itemclassname="App-primaryControl" type="button" title="回到卡特"><i class="icon fas fa-edit Button-icon"></i><span class="Button-label">回到卡特</span></button></a></div>`;
}

function 新增卡特個人化功能頁面中的按鈕(Tags,Name,Icon,Value)
{
    var Tag_Iteam = document.createElement('li');
    Tag_Iteam.innerHTML = `<a class="TagLinkButton hasIcon" style="text-align:center;width:100%;color:${Value ? "" : "#7c7c7c"};"><i class="icon ${Icon} Button-icon" style="float:initial;color:${Value ? "" : "#7c7c7c"};"></i>${Name}</a>`;
    Tag_Iteam.setAttribute("name",Name);
    Tag_Iteam.setAttribute("value",Value);
    Tag_Iteam.setAttribute("class","item-profile");
    Name =="返回" ? Tag_Iteam.addEventListener("click",(e) => {document.getElementById('custom-dropdown-ul1').setAttribute("style","");document.getElementById('custom-dropdown-ul2').remove();},false) : Name == "套用(重整頁面)" ? Tag_Iteam.addEventListener("click",(e) => {location.reload();}) : Tag_Iteam.addEventListener("click",(e) => {個人化頁面按鈕點擊事件(e);},false);
    Tags.appendChild(Tag_Iteam);
}

function 個人化頁面按鈕點擊事件(e)
{
    var Target = $(e.target).parents("li")[0];
    var Name = Target.getAttribute("name");
    var Value = Target.getAttribute("value");
    var Text_Color,Icon_Color;
    if(Value === "true")
    {
        變更使用者設定(Name,Value)
        GM_setValue("Kater_User_Settings", [_自訂首頁,_收藏文章,_關圖]);
        Target.setAttribute("value",false);
        Icon_Color = "#7c7c7c";
        Text_Color = "#7c7c7c";
    }
    else
    {
        變更使用者設定(Name,Value)
        GM_setValue("Kater_User_Settings", [_自訂首頁,_收藏文章,_關圖]);
        Target.setAttribute("value",true);
        Icon_Color = "";
        Text_Color = "";
    }
    Target.firstElementChild.setAttribute("style",`text-align:center;width:100%;color:${Text_Color};`);
    Target.firstElementChild.firstElementChild.setAttribute("style",`float:initial;color:${Icon_Color};`);
}

function 變更使用者設定(Name,Value)
{
    switch (Name) {
        case "自訂首頁":
            if(Value === "true")
            {
                _自訂首頁 = false;
            }
            else
            {
                _自訂首頁 = true;
            }
            break;
        case "收藏文章":
            if(Value === "true")
            {
                _收藏文章 = false;
            }
            else
            {
                _收藏文章 = true;
            }
            break;
        case "關圖":
            if(Value === "true")
            {
                _關圖 = false;
            }
            else
            {
                _關圖 = true;
            }
            break;
        default:
            console.log("變更使用者設定失敗！");
            console.log(Name+Value);
    }
}

async function 建立收藏頁面()
{
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

async function 取得收藏資料(Favorite)
{
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

function 取得Tag資料()
{
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
            建立自訂首頁頁面(datas,datas_has_parent);
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

function 建立自訂首頁頁面(datas,datas_has_parent)
{
    var Div = document.getElementById('custom-dropdown-div');
    var Tags = document.createElement('ul');
    var Adjust_Tag_Iteam = document.createElement('li');
    var Return_Tag_Iteam = document.createElement('li');
    Tags.setAttribute("id","custom-dropdown-ul3");
    Tags.setAttribute("class","Dropdown-menu dropdown-menu Dropdown-menu--right");
    Tags.setAttribute("style","height:calc(80vh);overflow:auto;");
    Tags.addEventListener("click", (e) => {e.stopPropagation();});
    Return_Tag_Iteam.innerHTML = `<a class="TagLinkButton hasIcon" style="text-align:center;width:100%;"><i class="icon fas fa-chevron-left Button-icon" style="float:initial;"></i>返回</a>`;
    Return_Tag_Iteam.setAttribute("name","返回");
    Return_Tag_Iteam.setAttribute("class","item-profile");
    Return_Tag_Iteam.addEventListener("click",(e) => {document.getElementById('custom-dropdown-ul1').setAttribute("style","");document.getElementById('custom-dropdown-ul3').remove();},false)
    Tags.appendChild(Return_Tag_Iteam);

    datas.sort(function (a, b) {
        return a.position < b.position ? -1 : 1;
    });
    datas_has_parent.sort(function (a, b) {
        return a.position > b.position ? -1 : 1;
    });
    for(var data of datas)
    {
        var Tag_Iteam = document.createElement('li');
        Tag_Iteam.innerHTML = `<a class="TagLinkButton hasIcon" style="text-align:center;width:100%;color:${BlockList.indexOf(data.name) === -1 ? "" : "#7c7c7c"};"><i class="icon ${data.icon} Button-icon" style="float:initial;color:${BlockList.indexOf(data.name) === -1 ? data.color : "#7c7c7c"};"></i>${data.name}</a>`;
        Tag_Iteam.setAttribute("id",data.id);
        Tag_Iteam.setAttribute("name",data.name);
        Tag_Iteam.setAttribute("color",data.color);
        Tag_Iteam.setAttribute("class","item-profile");
        Tag_Iteam.addEventListener("click",(e) => {自訂首頁頁面按鈕點擊事件(e);},false);
        Tags.appendChild(Tag_Iteam);
    }
    Div.appendChild(Tags);
    for(data of datas_has_parent)
    {
        var Parent_Tag_Iteam = document.getElementById(data.parent_id);
        Tag_Iteam = document.createElement('li');
        Tag_Iteam.innerHTML = `<a class="TagLinkButton hasIcon child" style = "text-align:center;width:100%;color:${BlockList.indexOf(data.name) === -1 ? "" : "#7c7c7c"};max-width:100%;box-sizing:border-box;padding-left:50px;margin-left:0px;"><i class="icon ${data.icon} Button-icon" style="float:initial;color:${BlockList.indexOf(data.name) === -1 ? data.color : "#7c7c7c"};"></i>${data.name}</a>`;
        Tag_Iteam.setAttribute("id",data.id);
        Tag_Iteam.setAttribute("name",data.name);
        Tag_Iteam.setAttribute("color",data.color);
        Tag_Iteam.setAttribute("class","item-profile");
        Tag_Iteam.addEventListener("click",(e) => {自訂首頁頁面按鈕點擊事件(e);},false);
        insertAfter(Tag_Iteam,Parent_Tag_Iteam);
    }
    Adjust_Tag_Iteam.innerHTML = `<a class="TagLinkButton hasIcon" style="text-align:center;width:100%;"><i class="icon far fa-save Button-icon" style="float:initial;"></i>套用(重整頁面)</a>`;
    Adjust_Tag_Iteam.setAttribute("name","套用(重整頁面)");
    Adjust_Tag_Iteam.setAttribute("class","item-profile");
    Adjust_Tag_Iteam.addEventListener("click",(e) => {location.reload();},false)
    Tags.appendChild(Adjust_Tag_Iteam);
}

function 自訂首頁頁面按鈕點擊事件(e)
{
    var Target = $(e.target).parents("li")[0];
    var Block_Text = Target.getAttribute("name");
    var Text_Color,Icon_Color;
    if(BlockList.indexOf(Block_Text) === -1)
    {
        //新增屏蔽
        BlockList.push(Block_Text)
        GM_setValue("Kater_BlockList", BlockList);
        Icon_Color = "#7c7c7c";
        Text_Color = "#7c7c7c";
    }
    else
    {
        //解除屏蔽
        BlockList.splice(BlockList.indexOf(Block_Text), 1);
        GM_setValue("Kater_BlockList", BlockList);
        Icon_Color = Target.getAttribute("color");
        Text_Color = "";
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

if(!GM_getValue("Kater_User_Settings"))
{
    [_自訂首頁,_收藏文章,_關圖] = [true,true,true,false];
    GM_setValue("Kater_User_Settings", [true,true,true,false]);
    console.log("偵測到初次使用腳本 O_Ob");
}
else
{
    [_自訂首頁,_收藏文章,_關圖] = GM_getValue("Kater_User_Settings");
    console.log([_自訂首頁,_收藏文章,_關圖]);
}

if(_自訂首頁)
{
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
}

if(_收藏文章)
{
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
}

var callback = function (records){
    records.map(function(record){
        if(record.target.length == 0) return;
        if(record.addedNodes.length == 0) return;
        if(record.previousSibling != null) return;
        if(location.href.indexOf("/d/") !== -1)
        {
            var Article = $(record.target).find("article.CommentPost")[0];
            if(Article == undefined) return;
            var Ul = Article.firstElementChild.lastElementChild.previousSibling.firstElementChild.lastElementChild.firstElementChild.lastElementChild;
            var Li_User = Article.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            if(Ul == undefined || Li_User == undefined) return;
            if(_收藏文章)
            {
                if(Ul.firstElementChild.className !== "item-subscription")
                {
                    var Data_Id = Article.parentElement.getAttribute("data-id");
                    覆寫Ul(Ul,Data_Id)
                }
            }

            if(_關圖)
            {
                var PostStream_Item = $(Li_User).parents("div.PostStream-item")[0];
                var Iframes = $(PostStream_Item).find("iframe");
                var Imgs = $(PostStream_Item).find("img[class != 'Avatar PostUser-avatar']");
                for(var Iframe of Iframes)
                {
                    if(Iframe.getAttribute("style") !== "display:none")
                    {
                        PostStream_Item.setAttribute("haschild",true);
                        Iframe.setAttribute("style_pre",Iframe.getAttribute("style"));
                        Iframe.setAttribute("style","display:none");
                        Iframe.setAttribute("src_pre",Iframe.getAttribute("src"));
                        Iframe.setAttribute("src","");
                    }
                }
                for(var Img of Imgs)
                {
                    if((Img.getAttribute("style") !== "display:none") && (Img.className !== "emoji"))
                    {
                        PostStream_Item.setAttribute("haschild",true);
                        Img.setAttribute("style_pre",Img.getAttribute("style"));
                        Img.setAttribute("style","display:none");
                        Img.setAttribute("src_pre",Img.getAttribute("src"));
                        Img.setAttribute("src","");
                    }
                }
                覆寫樓層(PostStream_Item,Li_User);
            }
        }
        else
        {
            var Div = $(record.target).find("div.DiscussionListItem")[0];
            if(Div == undefined) return;
            if(!_自訂首頁) return;
            var Tags = $(Div).find("span.TagLabel-text");
            for(var Tag of Tags)
            {
                if(BlockList.indexOf(Tag.innerText.replace(/ /g,"")) == -1) return;
                Tag.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.setAttribute("style","display:none;");
            }

        }

    });
};

var mo = new MutationObserver(callback);

var option = {
    'childList': true,
    'subtree' : true
};

try{
    mo.observe(document.getElementById("content"), option);
}
catch(e){
}

新增腳本工具列按鈕();