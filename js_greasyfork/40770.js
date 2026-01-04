// ==UserScript==
// @name         圖片顯示及mp3播放
// @description  終於有圖片了
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @author       SmallYue1
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40770/%E5%9C%96%E7%89%87%E9%A1%AF%E7%A4%BA%E5%8F%8Amp3%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/40770/%E5%9C%96%E7%89%87%E9%A1%AF%E7%A4%BA%E5%8F%8Amp3%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
var Url=location.href;

function CheckUrlChange()
{
    var UrlNew=location.href;
    if(Url!=UrlNew)
    {
        Url=UrlNew;
        setTimeout(CreatPlayerAndImage,500); //等待0.5秒讓頁面載入
    }

}

function CreatPlayerAndImage()
{
    if(location.href!="https://acgn-stock.com/instantMessage")
    {
        var LoadText = $(".d-block.h4").text();
        if (LoadText == "")
        {
            setTimeout(CreatPlayerAndImage,10);
        }
        else
        {
            var Matches = document.getElementsByTagName('a');
            for(var i = 0;i<Matches.length;i++)
            {
                if(document.getElementById(Matches[i]) == null)
                {
                    if(((Matches[i].href.indexOf(".png")!=-1)||(Matches[i].href.indexOf(".jpg")!=-1)||(Matches[i].href.indexOf(".jpeg")!=-1)||(Matches[i].href.indexOf(".gif")!=-1)))
                    {

                        Matches[i].outerHTML=Matches[i].outerHTML+"<img id="+Matches[i]+" width=680 src="+Matches[i]+"></img>";

                    }
                    else if(Matches[i].href.indexOf(".mp3")!=-1)
                    {

                        Matches[i].outerHTML=Matches[i].outerHTML+"<br><audio id="+Matches[i]+" controls><source src="+Matches[i]+" type="+'"'+"audio/mp3"+'"'+"></audio><hr>";

                    }
                }
            }
        }
    }
}

(function() {
    'use strict';
    onload=CreatPlayerAndImage();
    setInterval(CheckUrlChange,100);//每0.1秒檢查一次連結變動
    // Your code here...
})();