// ==UserScript==
// @name         搶號碼
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @author       SmallYue1
// @match        https://forum.gamer.com.tw/post1.php?bsn=60076&type=1
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @description 測試版本
// @downloadURL https://update.greasyfork.org/scripts/375771/%E6%90%B6%E8%99%9F%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/375771/%E6%90%B6%E8%99%9F%E7%A2%BC.meta.js
// ==/UserScript==
var xmlHttp = new XMLHttpRequest();
var url = "https://forum.gamer.com.tw/C.php?bsn=60076&snA=";
var Matches_Span,Matches_Button;
var maininterval,interval;
//var index = 0;
var run =0;

/*function addPluginMenu() {
  const pluginMenu = $(`
                        <div class="beta beta-1 side_gray_box box-shadow__shallow">
                                <h3 id="title" style="display:inline-block;">搶文章數字</h3>
                            <div>
                                <div style="height:60%;">
                                    <input id="number" class="gsc-input" type="text" placeholder="請輸入要搶的數字" style="display:block;font-size:1.2vw;width:80%;margin:auto">
                                </div>
                                <div style="height:40%;">
                                    <a id="confirm" class="btn btn-primary float-right" href="#">預約</a>
                                </div>
                            </div>
                        </div>
                        <hr>
      `).insertAfter($(".post__template").last());
    pluginMenu.find("#confirm").on("click",ButtonClick);
}*/

/*function Clear()
{
    run=!run;
    clearInterval(maininterval);
    clearInterval(interval);
    document.getElementById("confirm").innerText="預約";
}*/

/*function ButtonClick()
{
    if(run==0)
    {
        run=!run;
        this.innerText="你預約的是:" + document.getElementById("number").value + "號．．．";
        url = url + document.getElementById("number").value;
        maininterval = setInterval(getrequest, 1000);
    }
    else if(run==1)
    {
        Clear();
    }
}*/

function CheckPostButton()
{
    for(var i = 0;i<Matches_Span.length;i++)
    {
        if(Matches_Span[i].innerText.indexOf("發佈文章")!=-1)
        {
            //console.log(Matches_Span[i]);
            Matches_Span[i].click();
            //console.log("點擊發佈文章");
            interval = setInterval(CheckConfirmButton,10);
            clearInterval(maininterval);
            break;
        }
    }
}

function CheckConfirmButton()
{
    Matches_Button = document.getElementsByTagName('button');
    for(var i = 0;i<Matches_Button.length;i++)
    {
        if(Matches_Button[i].innerText.indexOf("確定")!=-1)
        {
            Matches_Button[i].click();
            console.log("點擊確定");
            clearInterval(interval);
            break;
        }
    }
}

function httpGet(theUrl)
{
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getrequest()
{
    Matches_Span = document.getElementsByTagName('span');
    var isbaha = httpGet(url);
    //console.log(index+"確認文章是否已存在");
    //console.log(url);
    //console.log(document.getElementById("number"));
    if(isbaha.search("確定") == -1)
    {
        CheckPostButton();
        //console.log(index+"文章存在");
    }
    //index++;
}



(function() {
    'use strict';
    //addPluginMenu();
    maininterval = setInterval(getrequest, 1000);
    // Your code here...
})();