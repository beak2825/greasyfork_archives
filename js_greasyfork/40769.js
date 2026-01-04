// ==UserScript==
// @name         自動打開資料夾
// @description  不用再一個一個點開了
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       SmallYue1
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40769/%E8%87%AA%E5%8B%95%E6%89%93%E9%96%8B%E8%B3%87%E6%96%99%E5%A4%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/40769/%E8%87%AA%E5%8B%95%E6%89%93%E9%96%8B%E8%B3%87%E6%96%99%E5%A4%BE.meta.js
// ==/UserScript==

var Matches_Block,Matches_Floder,Control;

function checkScriptUpdate() { //從SowftwareSing的腳本擷取
  var oReq = new XMLHttpRequest();
  var checkScriptVersion = function checkScriptVersion() {
    var obj = JSON.parse(oReq.responseText);
    var myVersion = GM_info.script.version; // eslint-disable-line camelcase
    console.log(obj.version.substr(0, 4) + ',' + myVersion.substr(0, 4) + ',' + (obj.version.substr(0, 4) > myVersion.substr(0, 4)));
    if (obj.version.substr(0, 4) > myVersion.substr(0, 4)) {
      var updateButton = $('\n        <li class=\'nav-item\'>\n          <a class=\'nav-link btn btn-primary\'\n          href=\'https://greasyfork.org/zh-TW/scripts/40769\'\n          name=\'updateAutoDownScript\'\n          target=\'Blank\'\n          > 更新自動打開資料夾腳本</a>\n        </li>\n      ');
      updateButton.insertAfter($('.nav-item')[$('.nav-item').length - 1]);
    } else {
      setTimeout(checkScriptUpdate, 600000);
    }
  };
  oReq.addEventListener('load', checkScriptVersion);
  oReq.open('GET', 'https://greasyfork.org/zh-TW/scripts/40769.json');
  oReq.send();
}

function CheckFloder()
{
    Matches_Block = document.getElementsByTagName('i');
    Matches_Floder = document.getElementsByTagName('a');
    Control=0;
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
        console.log("開啟資料夾");
        OpenFolder();
    }
}

function OpenFolder()
{
    for(var i = 0;i<Matches_Floder.length;i++)
    {
        if(Matches_Floder[i].className=="d-block h4 my-1")
        {
            if(
                (Matches_Floder[i].innerText.indexOf("數據資訊")!=-1)||(Matches_Floder[i].innerText.indexOf("交易訂單")!=-1)||(Matches_Floder[i].innerText.indexOf("董事會")!=-1)||(Matches_Floder[i].innerText.indexOf("所有紀錄")!=-1)||(Matches_Floder[i].innerText.indexOf("稅務資訊")!=-1)||((Matches_Floder[i].innerText.indexOf("持股資訊")!=-1)&&((Matches_Floder[i].innerText.indexOf("總表")==-1)))||(Matches_Floder[i].innerText.indexOf("玩家紀錄")!=-1)
            )
            {

                Matches_Floder[i].click();
            }
        }
    }
}

/*var Url=location.href;

function CheckUrlChange()
{
    var UrlNew=location.href;
    if(Url!=UrlNew)
    {
        Url=UrlNew;
        setTimeout(CheckFloder,300); //等待0.3秒讓頁面載入
    }

}

function CheckFloder()
{
    var Control=0;
    var Matches = document.getElementsByTagName('i');
    for(var i = 0;i<Matches.length;i++)
    {
        if(Matches[i].className=="fa fa-folder-open")
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
    if($(".fa.fa-folder-open")!=null)
    {
    var LoadText = $(".d-block.h4").text();
    if (LoadText == "")
    {
        setTimeout(OpenFolder,10);
    }
    else
    {
        var Matches = $(".d-block.h4");
        for(var i = 0;i<Matches.length;i++)
        {
            //if(!((Matches[i].innerText.indexOf("最萌亂鬥大賽")!=-1)||(Matches[i].innerText.indexOf("挖礦機")!=-1)||(Matches[i].innerText.indexOf("石頭資訊")!=-1)||(Matches[i].innerText.indexOf("持有產品")!=-1)||(Matches[i].innerText.indexOf("持股資訊總表")!=-1)||(Matches[i].innerText.indexOf("大量紀錄")!=-1)))
            if(
                (Matches[i].innerText.indexOf("數據資訊")!=-1)||(Matches[i].innerText.indexOf("交易訂單")!=-1)||(Matches[i].innerText.indexOf("董事會")!=-1)||(Matches[i].innerText.indexOf("所有紀錄")!=-1)||(Matches[i].innerText.indexOf("稅務資訊")!=-1)||((Matches[i].innerText.indexOf("持股資訊")!=-1)&&((Matches[i].innerText.indexOf("總表")==-1)))||(Matches[i].innerText.indexOf("玩家紀錄")!=-1)
            )
            {
                Matches[i].click();
            }
        }
    }
    }
}*/



(function() {
    'use strict';
    checkScriptUpdate();
    setInterval(CheckFloder,100);//每0.1秒檢查一次資料夾有沒有打開
    // Your code here...
})();