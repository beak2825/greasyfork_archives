// ==UserScript==
// @name         圖片顯示、mp3播放、youtube播放、自動打開資料夾
// @description  總之功能變多了
// @namespace    http://tampermonkey.net/
// @version      2.9.1
// @author       SmallYue1
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40768/%E5%9C%96%E7%89%87%E9%A1%AF%E7%A4%BA%E3%80%81mp3%E6%92%AD%E6%94%BE%E3%80%81youtube%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8B%95%E6%89%93%E9%96%8B%E8%B3%87%E6%96%99%E5%A4%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/40768/%E5%9C%96%E7%89%87%E9%A1%AF%E7%A4%BA%E3%80%81mp3%E6%92%AD%E6%94%BE%E3%80%81youtube%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8B%95%E6%89%93%E9%96%8B%E8%B3%87%E6%96%99%E5%A4%BE.meta.js
// ==/UserScript==

//var Url=location.href;
var Matches_Url,Matches_Block,Matches_Floder;
/*function Onload()
{
    Matches_Url = document.getElementsByTagName('a');
    Matches_Block = document.getElementsByTagName('i');
    CreatPlayerAndImage();
}

function CheckUrlChange()
{
    var UrlNew=location.href;
    if(Url!=UrlNew)
    {
        Url=UrlNew;
        Matches_Url = document.getElementsByTagName('a');
        Matches_Block = document.getElementsByTagName('i');
        setTimeout(CreatPlayerAndImage,500); //等待0.5秒讓頁面載入
    }

}*/

function checkScriptUpdate() { //從SowftwareSing的腳本擷取
  var oReq = new XMLHttpRequest();
  var checkScriptVersion = function checkScriptVersion() {
    var obj = JSON.parse(oReq.responseText);
    var myVersion = GM_info.script.version; // eslint-disable-line camelcase
    console.log(obj.version.substr(0, 4) + ',' + myVersion.substr(0, 4) + ',' + (obj.version.substr(0, 4) > myVersion.substr(0, 4)));
    if (obj.version.substr(0, 4) > myVersion.substr(0, 4)) {
      var updateButton = $('\n        <li class=\'nav-item\'>\n          <a class=\'nav-link btn btn-primary\'\n          href=\'https://greasyfork.org/zh-TW/scripts/40768\'\n          name=\'updateAutoDownScript\'\n          target=\'Blank\'\n          > 更新圖片顯示腳本</a>\n        </li>\n      ');
      updateButton.insertAfter($('.nav-item')[$('.nav-item').length - 1]);
    } else {
      setTimeout(checkScriptUpdate, 600000);
    }
  };
  oReq.addEventListener('load', checkScriptVersion);
  oReq.open('GET', 'https://greasyfork.org/zh-TW/scripts/40768.json');
  oReq.send();
}

function CreatPlayerAndImage()
{
    Matches_Url = document.getElementsByTagName('a');
    Matches_Block = document.getElementsByTagName('i');
    Matches_Floder = Matches_Url;
    var vid;
    if((location.href!="https://acgn-stock.com/instantMessage")&&(location.href.indexOf("https://acgn-stock.com/productCenter/")==-1))
    {
        for(var i = 0;i<Matches_Url.length;i++)
        {
            if(document.getElementById(Matches_Url[i]) == null)
            {
                if(((Matches_Url[i].href.indexOf(".png")!=-1)||(Matches_Url[i].href.indexOf(".jpg")!=-1)||(Matches_Url[i].href.indexOf(".jpeg")!=-1)||(Matches_Url[i].href.indexOf(".gif")!=-1)))
                {

                    Matches_Url[i].outerHTML=Matches_Url[i].outerHTML+"<hr><div style='width: 100%;'><p class='badge badge-default' style='width:50%;height:auto;display:block;margin:auto;'><a id="+Matches_Url[i]+" href="+Matches_Url[i]+"><img id="+Matches_Url[i]+" style='width: 100%;height:auto;' src="+Matches_Url[i]+"></img></a></p></div><hr>";

                }
                else if(Matches_Url[i].href.indexOf(".mp3")!=-1)
                {

                    Matches_Url[i].outerHTML=Matches_Url[i].outerHTML+"<p><div class='badge badge-default'><audio id="+Matches_Url[i]+" controls><source src="+Matches_Url[i]+" type="+'"'+"audio/mp3"+'"'+"></audio></div></p><hr>";

                }
                else if((Matches_Url[i].href.indexOf("imgur")!=-1)&&(Matches_Url[i].href.indexOf("/a/")==-1))
                {

                    Matches_Url[i].outerHTML=Matches_Url[i].outerHTML+"<hr><div style='width: 100%;'><p class='badge badge-default' style='width:50%;height:auto;display:block;margin:auto;'><a id=https://i.imgur.com"+Matches_Url[i].pathname+".gif href=https://i.imgur.com"+Matches_Url[i].pathname+".gif><img id="+Matches_Url[i]+" style='width: 100%;height:auto;' src=https://i.imgur.com"+Matches_Url[i].pathname+".gif></img></a></p></div><hr>";

                }
                else if((Matches_Url[i].href.indexOf("youtube")!=-1)&&(Matches_Url[i].href.indexOf("channel")==-1))
                {
                    vid = Matches_Url[i].href.match('[\\?&]v=([^&#]*)')[1];
                    Matches_Url[i].outerHTML=Matches_Url[i].outerHTML+"<hr><div style='width: 100%;'><p class='badge badge-default' width='472' style='width:481.6px;height:272px;display:block;margin:auto;'><iframe id="+Matches_Url[i]+" width='472' height='266' src='https://www.youtube.com/embed/"+vid+"?controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&enablejsapi=1&origin=https%3A%2F%2Ftestplayerbot.wordpress.com&widgetid=1&widgetid=1' allowfullscreen='1' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe></p></div><hr>";
                }
                else if(Matches_Url[i].href.indexOf("youtu.be")!=-1)
                {
                    vid = Matches_Url[i].pathname;
                    Matches_Url[i].outerHTML=Matches_Url[i].outerHTML+"<hr><div style='width: 100%;'><p class='badge badge-default' width='472' style='width:481.6px;height:272px;display:block;margin:auto;'><iframe id="+Matches_Url[i]+" width='472' height='266' src='https://www.youtube.com/embed"+vid+"?controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&modestbranding=1&playsinline=1&rel=0&showinfo=0&enablejsapi=1&widgetid=1' allowfullscreen='1' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe></p></div><hr>";
                }
                else if(Matches_Url[i].href.indexOf("illust_id=")!=-1)
                {
                    var PixivId=Matches_Url[i].href.match(/\d+/g);
                    Matches_Url[i].outerHTML=Matches_Url[i].outerHTML+"<hr><div style='width: 100%;'><p style='width:390px;height:auto;margin:auto;'><iframe id="+Matches_Url[i]+" style='width:390px;height:375px;margin:auto;' src='https://embed.pixiv.net/embed_mk2.php?id="+PixivId+"&amp;size=medium&amp;data-border=on' scrolling='no' frameborder='0'></iframe></p></div><hr>";
                }
            }
        }
        CheckFloder();
    }

}

function CheckFloder()
{
    var Control=0;
    for(var i = 0;i<Matches_Block.length;i++)
    {
        if(Matches_Block[i].className=="fa fa-folder-open")
        {
            Control=1;
            break;
        }
    }

    if(Control==0)
    {
        OpenFolder();
    }
}

function OpenFolder()
{
    for(var i = 0;i<Matches_Floder.length;i++)
    {
        if(Matches_Floder[i].className=="d-block h4 my-1")
        {
            if(!((Matches_Floder[i].innerText.indexOf("最萌亂鬥大賽")!=-1)||(Matches_Floder[i].innerText.indexOf("挖礦機")!=-1)||(Matches_Floder[i].innerText.indexOf("石頭資訊")!=-1)||(Matches_Floder[i].innerText.indexOf("持股資訊總表")!=-1)||(Matches_Floder[i].innerText.indexOf("玩家紀錄")!=-1)||(Matches_Floder[i].innerText.indexOf("所有紀錄")!=-1)||(Matches_Floder[i].innerText.indexOf("大量紀錄")!=-1)))
            {
                Matches_Floder[i].click();
            }
        }
    }
}

(function() {
    'use strict';
    checkScriptUpdate();
    setInterval(CreatPlayerAndImage,100);//每0.1秒檢查一次
    // Your code here...
})();