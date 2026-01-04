// ==UserScript==
// @name         卡特關圖
// @namespace    http://tampermonkey.net/
// @version      0.2.02
// @description  RT
// @author       SmallYue1
// @match        https://kater.me*
// @match        https://kater.me/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392951/%E5%8D%A1%E7%89%B9%E9%97%9C%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/392951/%E5%8D%A1%E7%89%B9%E9%97%9C%E5%9C%96.meta.js
// ==/UserScript==

function 覆寫樓層(PostStream_Item,Li_User)
{
    if($(Li_User.parentNode).find("li.TextEditor-toolbar").length === 0)
    {
        var Li_BlackList = document.createElement('li');
        var Btn_BlackList = document.createElement('button');
        var Icon_BlackList = document.createElement('i');
        var href = Li_User.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild.href;
        Li_BlackList.setAttribute("class","TextEditor-toolbar");
        Btn_BlackList.setAttribute("class","Button Button--icon Button--link hasIcon");
        try{
            if(PostStream_Item.getAttribute("haschild"))
            {
                Icon_BlackList.setAttribute("class","icon far fa-eye-slash Button-icon");
            }
            else
            {
                Icon_BlackList.setAttribute("class","icon far fa-eye Button-icon");
            }
        }
        catch(e)
        {
        }
        Li_User.parentNode.appendChild(Li_BlackList);
        Li_BlackList.appendChild(Btn_BlackList);
        Btn_BlackList.appendChild(Icon_BlackList);
        Li_BlackList.addEventListener("click",function(e) {
            var Iframes = $(PostStream_Item).find("iframe");
            var Imgs = $(PostStream_Item).find("img[class != 'Avatar PostUser-avatar']");
            var icon = this.firstElementChild.firstElementChild;
            var href = this.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild.href;

            if(icon.getAttribute("class") !== "icon far fa-eye-slash Button-icon")
            {
                //關圖
                icon.setAttribute("class","icon far fa-eye-slash Button-icon");
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
                icon.setAttribute("class","icon far fa-eye Button-icon");
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
}


var callback = function (records){
    records.map(function(record){
        if(record.addedNodes.length != 0)
        {
            setTimeout(() => {
                var Li_User = $(record.addedNodes[0]).find("li.item-user")[0];
                if(Li_User !== undefined)
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
                        if(Img.getAttribute("style") !== "display:none")
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
            },50);
        }
    });
};

var mo = new MutationObserver(callback);

var option = {
    'childList': true,
    'subtree' : true
};

mo.observe(document.getElementById("content"), option);