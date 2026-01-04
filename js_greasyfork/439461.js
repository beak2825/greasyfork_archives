// ==UserScript==
// @name         冒险岛纸娃娃收藏器 Maplestory Designer favourite Feature
// @version      1.1.2
// @description  Use this script to add favourite items and quick search for MapleStory Designer (maples.im)
// @author       CWBeta
// @license      MIT
// @include      *maples.im*
// @icon         https://www.google.com/s2/favicons?domain=maples.im
// @namespace    https://greasyfork.org/users/670174
// @downloadURL https://update.greasyfork.org/scripts/439461/%E5%86%92%E9%99%A9%E5%B2%9B%E7%BA%B8%E5%A8%83%E5%A8%83%E6%94%B6%E8%97%8F%E5%99%A8%20Maplestory%20Designer%20favourite%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/439461/%E5%86%92%E9%99%A9%E5%B2%9B%E7%BA%B8%E5%A8%83%E5%A8%83%E6%94%B6%E8%97%8F%E5%99%A8%20Maplestory%20Designer%20favourite%20Feature.meta.js
// ==/UserScript==

(function() {
    var isActive = false;
    function AddCSS()
    {
        console.log("[MapleStory Designer] Adding CSS...")
        // 添加CSS
        var style = document.createElement("style");
        style.type = "text/css";
        var cssString = "\
#like-wrapper\
{\
position: fixed; \
right:0.5rem; \
top:80px; \
width: 15%; \
height: 25%; \
min-width: 255px; \
overflow-y: auto; \
background: hsla(0,0%,100%,.75); \
box-shadow: 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 30%); \
border-radius: 0.25rem;\
display: none;\
}\
.deleteBtn\
{\
position: absolute; \
right:0; \
top:0; \
width: 12px; \
height: 12px; \
padding: 1px;\
line-height: 12px;\
font-size:10px;\
color: #fa5252;\
display: none;\
}\
.deleteBtn:hover\
{\
color:#ff0404;\
font-size:14px;\
text-shadow: 0 0 2px #9d0404;\
}\
.item-img-container:hover .deleteBtn{display: block;}\
"
        try
        {
            style.appendChild(document.createTextNode(cssString));
        }
        catch(ex)
        {
            style.styleSheet.cssText = cssString;//针对IE
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }

    function GetSingleBtnHTML(id, item)
    {
        var region = localStorage.getItem("region");
        var version = localStorage.getItem("version");
        return '<div class="item-img-container"><img src="https://maplestory.io/api/' + region + '/' + version + '/item/' + id + '/icon" alt="' + item['name'] + '" title="' + item['name'] + '" id="' + id + '"><div class="deleteBtn" id="' + id + '"><i class="fa fa-times"></i></div></div>';
    }

    function LikeItem(e)
    {
        e.stopPropagation();
        e.preventDefault();
        /*
        // 克隆道具清单中的物品
        var cloneNode = this.parentNode.cloneNode(true);
        var btns = cloneNode.getElementsByClassName("btn");
        //删除原有的按钮
        var count = btns.length;
        for (var i=count-1; i>=0; i--){
            //console.log(btns[i]);
            cloneNode.removeChild(btns[i]);
        }
         //链接
        var link = cloneNode.getElementsByClassName("a")[0];
        link.removeAttribute("href");
        link.removeAttribute("target");
        // 添加自动搜索关键词按钮*/
        var a = this.parentNode.getElementsByTagName("a")[0];
        var savedData = Load();
        var splitedLink = a.getAttribute("href").split('/');
        var id = splitedLink[splitedLink.length - 1];
        var item = {};
        item['name'] = a.innerText;
        if (savedData.hasOwnProperty(id))
        {
            return;
        }
        savedData[id] = item;
        Save(savedData);

        RefreshLikedPanel();
    }

    function Save(obj)
    {
        localStorage.setItem("CWBeta-maples.im-LikeItems", JSON.stringify(obj));
    }

    function Load()
    {
        //localStorage.removeItem("CWBeta-maples.im-LikeItems");
        var stringData = localStorage.getItem("CWBeta-maples.im-LikeItems");
        if (stringData == null)
        {
            var data = {};
            return data;
        }
        console.log(stringData);
        return JSON.parse(stringData);
    }

    /*
    function OnKeyPress(e)
    {
        console.log(e.code);
        if (e.code != 'KeyL')
        {
            return;
        }
        BindEvents();
        //CreateLikeBtns();
    }*/

    function CreateLikeBtns()
    {
        var equipedContainers = document.getElementsByClassName("equipped-items-listing");
        if (equipedContainers == null || equipedContainers.length <= 0)
        {
            setTimeout(CreateLikeBtns, 100);
            return;
        }
        var equipedContainer = equipedContainers[0];
        //删除原有的按钮
        var btnsToRemove = equipedContainer.getElementsByClassName("like-btn");
        var likeBtnCount = btnsToRemove.length;

        var befores = equipedContainer.getElementsByClassName("equipped-items-item-meta");
        var itemCount = befores.length;
        if (itemCount == likeBtnCount)
        {
            //console.log("收藏按鈕數量與物品數量一致。無需重新增加");
            setTimeout(CreateLikeBtns, 1000);
            return;
        }
        else
        {
            console.log("檢測到需要添加新的收藏按鈕：（收藏按鈕數："+likeBtnCount+"，裝備物品數："+itemCount+"）");
        }

        for (var i=likeBtnCount-1; i>=0; i--)
        {
            //console.log(btns[i]);
            btnsToRemove[i].parentNode.removeChild(btnsToRemove[i]);
        }

        for (i=0; i<itemCount; i++)
        {
            befores[i].outerHTML += '<span class="btn bg-green text-white right like-btn"><i class="fa fa-heart "></i></span>';
        }

        var likeBtns = equipedContainer.getElementsByClassName("like-btn");
        for (i=0; i<itemCount; i++)
        {
            likeBtns[i].addEventListener('click', LikeItem, false);
        }

        // 每隔1秒鐘自動嘗試再創建，因為如果換了衣服，新換進來的衣服邊上沒有收藏按鈕
        setTimeout(CreateLikeBtns, 1000);
    }

    function BindEvents()
    {
        console.log("[MapleStory Designer] Binding events...")
        var instances = document.getElementsByClassName("character-container")[0].children;
        var count = instances.length;
        for (var i=0; i< count; i++)
        {
            instances[i].addEventListener('click', function(){setTimeout(EnableFavouriteFeature,100);}, false);
        }
    }

    function EnableFavouriteFeature()
    {
        ShowFavouritePanel();
        if(!isActive)
        {
            CreateLikeBtns();
            isActive = true;
        }
    }

    function ShowFavouritePanel()
    {
        document.getElementById("like-wrapper").style["display"] = "block";
    }

    function CreateLikedPanel()
    {
        console.log("[MapleStory Designer] Creating like panel...")
        var likeWrapper = document.createElement('div');
        likeWrapper.setAttribute("id", "like-wrapper");
        document.body.appendChild(likeWrapper);
        RefreshLikedPanel();
    }

    function RefreshLikedPanel()
    {
        var likeWrapper = document.getElementById("like-wrapper");
        likeWrapper.innerHTML = '<div class="equipped-items-header"><span class="equipped-items-title">收藏清單</span></div>';
        var savedData = Load();
        // 创建图标列表
        for(var id in savedData)
        {
            var item = savedData[id];
            likeWrapper.innerHTML += GetSingleBtnHTML(id, item);
        }

        // 绑定自动搜索事件
        var likeBtns = likeWrapper.getElementsByClassName("item-img-container");
        var count = likeBtns.length;
        for (var i=0; i< count; i++)
        {
            likeBtns[i].addEventListener('click', OnClickLikedButton, false);
        }

        // 綁定刪除事件
        var deleteBtns = document.getElementsByClassName("deleteBtn");
        count = deleteBtns.length;
        for (i=0; i< count; i++)
        {
            deleteBtns[i].addEventListener('click', OnClickDeleteBtn, false);
        }
    }

    //點擊已收藏的物品，自動搜索同名物品
    function OnClickLikedButton(e)
    {
        e.stopPropagation();
        e.preventDefault();
        var id = this.getElementsByTagName("img")[0].getAttribute("id");
        var name = this.getElementsByTagName("img")[0].getAttribute("title");
        // 自動搜索
        console.log("[MapleStory Designer] Searching item (id:" + id + ", name:" + name +")");
        var input =  document.getElementsByClassName("item-search")[0];
        //input.focus();
        input.setAttribute("value", name);
        input.value = name;
        var ev = new Event('input', { bubbles: true});
        ev.simulated = true;
        input.dispatchEvent(ev);
        /*
        event = new UIEvent('change');
        // 触发input的change事件
        input.dispatchEvent(event);
        input.blur();*/

        //自動把滾動條滾到最上面
        document.getElementsByClassName("ReactVirtualized__Masonry")[0].scrollTop = 0
    }
    //刪除已收藏的物品
    function OnClickDeleteBtn(e)
    {
        e.stopPropagation();
        e.preventDefault();
        var id = this.getAttribute("id");

        var savedData = Load();
        if (!savedData.hasOwnProperty(id))
        {
            return;
        }
        delete(savedData[id]);
        Save(savedData);
        RefreshLikedPanel();
    }

    function Init()
    {
        console.log("[MapleStory Designer] Like widget running！")
        AddCSS();
        // window.onkeypress=OnKeyPress;
        CreateLikedPanel();
        BindEvents();
    }

    setTimeout(Init, 1000);
})();