// ==UserScript==
// @name         卡特工具
// @namespace    http://tampermonkey.net/
// @version      0.1.07
// @description  RT
// @author       SmallYue1
// @match        https://kater.me
// @match        https://kater.me/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/392928/%E5%8D%A1%E7%89%B9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/392928/%E5%8D%A1%E7%89%B9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

var 定時偵測Textarea變化,定時偵測Path變化,Pre_Path;

function 自訂功能(Textarea)
{
    批量上傳圖片(Textarea);
    Pixiv轉pixivcat代理(Textarea);
    圖片網址自動轉換(Textarea);
}

function 偵測Path變化()
{
    var Textarea;
    if(location.pathname === "/")
    {
        if(location.pathname !== Pre_Path)
        {
            console.log("偵測到網址變化:"+Pre_Path+"->"+location.pathname);
            Pre_Path = location.pathname;
            Textarea = document.getElementsByTagName("textarea")[0];
            if (Textarea !== undefined)
            {
                註冊監聽事件(Textarea);
            }
        }
    }
    else
    {
        var Path = "/"+location.pathname.split("/")[1]+"/" + location.pathname.split("/")[2];
        if(Path !== Pre_Path)
        {
            console.log("偵測到網址變化:"+Pre_Path+"->"+Path);
            Pre_Path = Path;
            Textarea = document.getElementsByTagName("textarea")[0];
            if (Textarea !== undefined)
            {
                註冊監聽事件(Textarea);
            }
        }
    }
}

function 偵測Textarea出現()
{
    try {
        var Textarea = document.getElementsByTagName("textarea")[0];
        if (Textarea !== undefined)
        {
            註冊監聽事件(Textarea);
            clearInterval(定時偵測Textarea變化);
            if(location.pathname === "/")
            {
                Pre_Path = location.pathname;
            }
            else
            {
                Pre_Path = "/"+location.pathname.split("/")[1]+"/" + location.pathname.split("/")[2];
            }
            定時偵測Textarea變化 = setInterval(() => 偵測Textarea消失(),100);
            定時偵測Path變化 = setInterval(() => 偵測Path變化(),100);
        }
    }
    catch (e) {
    }
}

function 偵測Textarea消失()
{
    try {
        var Textarea = document.getElementsByTagName("textarea")[0];
        if (Textarea === undefined)
        {
            clearInterval(定時偵測Textarea變化);
            clearInterval(定時偵測Path變化);
            定時偵測Textarea變化 = setInterval(() => 偵測Textarea出現(),100);
        }
    }
    catch (e) {
    }
}

function 註冊監聽事件(Textarea)
{
    console.log("監聽對象：");
    console.log(Textarea);
    自訂功能(Textarea);
}

function 批量上傳圖片(Textarea)
{
    $("i[class = 'icon far fa-image Button-icon']")[0].setAttribute("class","icon far fa-images Button-icon");
    document.getElementById("imgur-upload-form").firstElementChild.setAttribute("multiple","multiple");
    document.getElementById("imgur-upload-form").firstElementChild.addEventListener("change",function(e){
        var Files = [];
        for (var i = 0; i < this.files.length; i++)
        {
            var Type = this.files.item(i).name.split(".");
            Files.push(new File([this.files.item(i)],i+"."+Type[Type.length-1]));
        }
        var Composer_footer = document.getElementsByClassName("Composer-footer")[0];
        var Count = 1;
        var Goal = Files.length;
        var Loss = 0;
        var Li = document.createElement('li');
        var Counter = document.createElement('p');
        var apiUrl = 'https://api.imgur.com/3/image';
        var apiKey = app.forum.attribute("imgur-upload.client-id");
        Composer_footer.appendChild(Li);
        Li.appendChild(Counter);
        等待第一張圖片上傳完成(Files,apiUrl,apiKey,Count,Counter,Goal,Loss,Textarea);
    });
}

function 等待第一張圖片上傳完成(Files,apiUrl,apiKey,Count,Counter,Goal,Loss,Textarea)
{
    var h = function(){
        Counter.innerText = `批量上傳進度:(${Count}/${Goal-Loss})`;
        上傳圖片(Files,apiUrl,apiKey,Count,Counter,Goal,Loss,Textarea);
        Textarea.removeEventListener('input',h,false);
    }
    Textarea.addEventListener('input',h,false);
}


function 上傳圖片(Files,apiUrl,apiKey,Count,Counter,Goal,Loss,Textarea)
{
    if(Goal !== 1)
    {
        var value = Files[Count];
        var formData = new FormData();
        formData.append("image", value);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiUrl,
            "method": "POST",
            "datatype": "json",
            "headers": {
                "Authorization": "Client-ID " + apiKey
            },
            "processData": false,
            "contentType": false,
            "data": formData,
            success: function (res) {
                Count = Count + 1;
                Textarea.value = Textarea.value+"[![]("+res.data.link+")]("+res.data.link+")\n";
                Textarea.dispatchEvent(new Event('input'));
                Counter.innerText = `批量上傳進度:(${Count}/${Goal-Loss})`;
                if(Count < Goal-Loss)
                {
                    setTimeout(上傳圖片(Files,apiUrl,apiKey,Count,Counter,Goal,Loss,Textarea),100);
                }
                else if(Count === Goal-Loss)
                {
                    alert("上傳完成");
                    Counter.parentNode.outerHTML = "";
                }
            },
            error: function (e) {
                console.log("上傳失敗：");
                console.log(e.responseJSON.data.error.message);
                Loss = Loss + 1;
                Counter.innerText =`批量上傳進度:(${Count}/${Goal-Loss})`;
                if(Count < Goal-Loss)
                {
                    上傳圖片(Files,apiUrl,apiKey,Count,Counter,Goal,Loss,Textarea);
                }
                else if(Count === Goal-Loss)
                {
                    alert("上傳完成");
                    Counter.parentNode.outerHTML = "";
                }
            }
        }
        $.ajax(settings).done(function (res) {
        });
    }
}

function Pixiv轉pixivcat代理(Textarea)
{
    Textarea.addEventListener('paste', function(e){
        var paste = e.clipboardData.getData("text/plain");
        this.paste = paste;
        if(paste.indexOf("pixiv.cat") === -1)
        {
            if(paste.indexOf("pximg.net") !== -1)
            {
                setTimeout(() => {
                    var Replace = "pximg.net";
                    var Img = this.paste.replace(Replace,"pixiv.cat");
                    var Url = this.paste.split("/");
                    var Path = Url[Url.length-1].split("_")[0];
                    Textarea.value = Textarea.value.replace(this.paste,"[![]("+Img+")](https://www.pixiv.net/artworks/"+Path+")\n");
                    Textarea.dispatchEvent(new Event('input'));
                },10);
            }
            else if(paste.indexOf("www.pixiv.net/artworks") !== -1)
            {
                setTimeout(() => {
                    if(Textarea.value.indexOf("("+this.paste+")") === -1)
                    {
                        var Replace = "www.pixiv.net/artworks";
                        var Img = this.paste.replace(Replace,"pixiv.cat");
                        var Jpg = ".jpg";
                        var Img_Href = Img+Jpg;
                        Textarea.value = Textarea.value.replace(this.paste,"[![]("+Img_Href+")]("+this.paste+")\n");
                        Textarea.dispatchEvent(new Event('input'));
                        isHasImg(Img,0,Jpg,Textarea,Img_Href);
                    }
                },10);
            }
        }
    }, false);
}

async function isHasImg(Img,Index,Suffix,Textarea,Img_Href){
    var ImgObj=new Image();
    var Result;
    if(Index === 0)
    {
        ImgObj.src= Img+Suffix;
    }
    else
    {
        ImgObj.src= Img+"-"+Index+Suffix;
    }
    ImgObj.onload = new Promise(async function(resolve){
        setTimeout(async function(){
            if(ImgObj.width>0)
            {
                if(Index !== 0)
                {
                    Textarea.value = Textarea.value.replace(Img_Href,ImgObj.src);
                    Textarea.dispatchEvent(new Event('input'));
                }
                Result = true;
            }
            else
            {
                console.log(ImgObj)
                if(Index < 5)
                {
                    await isHasImg(Img,Index+1,Suffix,Textarea,Img_Href);
                    Result = false;
                }
                Result = false;
            }
            resolve();
        },500);
    });
    await ImgObj.onload;
    return Result;
}
function 圖片網址自動轉換(Textarea)
{
    Textarea.addEventListener('paste',async function(e){
        var paste = e.clipboardData.getData("text/plain");
        this.paste = paste;
        if(((paste.indexOf("pximg.net") === -1) && (paste.indexOf("www.pixiv.net/artworks") === -1)) && ((paste.toLowerCase().indexOf(".jpg") !== -1) || (paste.toLowerCase().indexOf(".png") !== -1) || (paste.toLowerCase().indexOf(".gif") !== -1) || (paste.toLowerCase().indexOf(".jpeg") !== -1)))
        {
            //await isHasImg(paste,0,"",Textarea,paste);
            if(await isHasImg(paste,0,"",Textarea,paste))
            {
                setTimeout(() => {
                    if(Textarea.value.indexOf("("+this.paste+")") === -1)
                    {
                        Textarea.value = Textarea.value.replace(this.paste,"[![]("+this.paste+")]("+this.paste+")\n");
                        Textarea.dispatchEvent(new Event('input'));
                    }
                },10);
            }
        }
    }, false);
}

$("document").ready(
    function()
    {
        'use strict';
        定時偵測Textarea變化 = setInterval(() => 偵測Textarea出現(),100);
        // Your code here...
    }
);