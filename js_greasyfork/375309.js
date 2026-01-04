// ==UserScript==
// @name         rarbg maglink 115离线
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  rarbg添加磁力链接和115离线按钮
// @author       lxh
// @match       https://rarbg.to/threat_defence.php*
// @match       https://rarbg.to/torrents.php*
// @match       https://rarbgmirror.com/torrents.php*
// @match       https://rarbgmirror.org/torrents.php*
// @match       http*://proxyrarbg.org/*
// @match       http*://*.115.com/*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @grant GM_log
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_notification
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375309/rarbg%20maglink%20115%E7%A6%BB%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/375309/rarbg%20maglink%20115%E7%A6%BB%E7%BA%BF.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var newLink;
    function tdMousseoverChange() {
        newLink="";
        var arrayimg=new Array();
        var i=0;
        $('tr.lista2 td+td.lista a[onmouseover~=return]').each(function () {
            var oldFunction=$(this).attr("onmouseover");
            var linkStartNum=oldFunction.indexOf("src=")+6;
            var linkEndNum=oldFunction.indexOf("jpg")+3;
            var newFunction1=oldFunction.substr(0,linkStartNum);
            var newFunction2=oldFunction.substr(linkEndNum,999);
            var link=oldFunction.substr(linkStartNum,linkEndNum-linkStartNum);
            var newFunction3=changeLink(link);
            //console.log(newFunction1+"|"+newFunction3+"|"+newFunction2);
            $(this).attr("onmouseover",newFunction1+newFunction3+newFunction2);

            //preLoad(arrayimg,i,newFunction3);
        });

    }
function changeLink(link) /*修改链接*/{
    /*
     * 三种链接形式
     * */
    //console.log(link);
    var isTvdb=link.indexOf("tvdb");
    var isChangeTvdb=link.indexOf("banner_optimized");
    var checkoldlink=link.indexOf("static");
    if(checkoldlink!=-1&&isTvdb==-1)
    {

        //普通图片将要修改
        var imgLink1=link.substr(0, checkoldlink);
        var imgLink2="posters2";
        var lastGNum=link.lastIndexOf("/");
        var imgLink3=link.substr(lastGNum,999);
        var imgLink4=link.substr(lastGNum+1,1);
        newLink=imgLink1+imgLink2+"/"+imgLink4+imgLink3;
        //console.log("1改为"+newLink);
    }
    else if(isTvdb!=-1&&checkoldlink!=-1) {
        var tvdbLink1 = link.substr(0, link.indexOf("small"));
        var tvdbLink2 = "banner_optimized.jpg";
        newLink = tvdbLink1 + tvdbLink2;
        //console.log("2改为"+newLink);
    }
    else if (isTvdb==-1&&checkoldlink==-1)
    {
        newLink=link.replace("over","poster");
        //console.log("3改为"+newLink);
    }

    return newLink;
}
//预加载图片
function preLoad(arrayimg,i,newFunction3) {
    setTimeout(function () {
        arrayimg[i]=new Image();
        arrayimg[i].src="https:"+newFunction3;
        i++;
    },0);
}

function newPos() {
    var pop = document.getElementById("overlib");//获取div
    var xoffset = 15;
    var el = "";
    document.onmousemove = function(k) {
        var h;
        h = k.pageX;//当前坐标x
        h += xoffset;
        pop.style.top = window.scrollY+10 + "px";
        pop.style.left = h + "px";
    };
}

    setTimeout(function () {
        newPos();
    },0);
    tdMousseoverChange();


    function focusInput() {
  var solve = document.getElementById('solve_string');
	if (solve) solve.focus();
  else if (document.URL.indexOf('defence=nojc') > 0) document.getElementsByTagName('a')[0].click();
  else setTimeout(focusInput, 500);
}
//and magnet
//GM_notification("115还没有登录");
//if (document.URL.indexOf('threat_defence.php') > 0)	return window.load = focusInput();

var torrentImgData = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCIgWwoJPCFFTlRJVFkgc3QwICJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiMzMzMzMzM7Ij4KCTwhRU5USVRZIHN0MSAiZmlsbDojMzMzMzMzOyI+Cl0+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojMzMzMzMzOyIgZD0iTTAuNzc2LDEyLjAzN2MwLTYuMTksNS4wMTktMTEuMjA5LDExLjIxLTExLjIwOWM2LjE4OSwwLDExLjIwNiw1LjAyLDExLjIwNiwxMS4yMDkgIGMwLDYuMTkyLTUuMDE3LDExLjIwOS0xMS4yMDYsMTEuMjA5QzUuNzk1LDIzLjI0NiwwLjc3NiwxOC4yMjksMC43NzYsMTIuMDM3eiBNMjEuNDQsMTIuMDM3YzAtNS4yMi00LjIzLTkuNDU0LTkuNDU0LTkuNDU0ICBjLTUuMjIyLDAtOS40NTQsNC4yMzQtOS40NTQsOS40NTRjMCw1LjIyMSw0LjIzMiw5LjQ1NCw5LjQ1NCw5LjQ1NEMxNy4yMSwyMS40OTEsMjEuNDQsMTcuMjU4LDIxLjQ0LDEyLjAzN3oiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiMzMzMzMzM7IiBkPSJNMTQuOTk1LDExLjkwMmwtMy42ODQsMy42ODNjLTAuMTgyLDAuMTgtMC4yNzgsMC40MTgtMC4yNzgsMC42NzZjMCwwLjI1MywwLjA5NiwwLjQ5LDAuMjc4LDAuNjcxICBjMC4zNywwLjM3NCwwLjk3NSwwLjM3MiwxLjM0NywwbDMuNjg0LTMuNjgxYzAuMTgtMC4xODIsMC4yNzktMC40MiwwLjI3OS0wLjY3NGMtMC4wMDEtMC4yNTUtMC4xLTAuNDk2LTAuMjc5LTAuNjc1ICBDMTUuOTcsMTEuNTM0LDE1LjM2OCwxMS41MjksMTQuOTk1LDExLjkwMnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiMzMzMzMzM7IiBkPSJNNy42MjYsMTMuMjUybDMuNjg1LDMuNjgxYzAuMTc4LDAuMTgxLDAuNDE4LDAuMjc5LDAuNjczLDAuMjgyYzAuMjU1LTAuMDAzLDAuNDk1LTAuMSwwLjY3NC0wLjI4MiAgYzAuMzcyLTAuMzcsMC4zNzEtMC45NzYsMC0xLjM0N2wtMy42ODQtMy42ODNjLTAuMTgyLTAuMTgtMC40Mi0wLjI4LTAuNjc0LTAuMjhjLTAuMjUzLDAtMC40OTMsMC4xMDEtMC42NzQsMC4yOCAgQzcuMjU2LDEyLjI3Myw3LjI1NSwxMi44NzgsNy42MjYsMTMuMjUyeiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzMzMzMzMzsiIGQ9Ik0xMS4wMzMsNy44NzZ2Ni4yMzJjMCwwLjI1NSwwLjA5OSwwLjQ5NCwwLjI3OSwwLjY3NGMwLjE4MSwwLjE4MSwwLjQxOCwwLjI4MSwwLjY3MywwLjI3OCAgYzAuNTI2LDAuMDAzLDAuOTUyLTAuNDI2LDAuOTUyLTAuOTUybDAuMDAxLTYuMjMyYzAuMDAyLTAuMjU0LTAuMDk3LTAuNDk0LTAuMjc4LTAuNjc0Yy0wLjE4MS0wLjE3OC0wLjQyLTAuMjc5LTAuNjc1LTAuMjggIEMxMS40Niw2LjkyMywxMS4wMzMsNy4zNSwxMS4wMzMsNy44NzZ6Ii8+DQo8L3N2Zz4=';

var head115 = document.createElement('td');
head115.innerHTML = '离线';
head115.classList.add('header6');
head115.classList.add('header40');
document.querySelector('.lista2t tr:first-child td:nth-child(2)').parentNode.insertBefore(head115, document.querySelector('.lista2t tr:first-child td:nth-child(2)'));


var headCell = document.createElement('td');
headCell.innerHTML = 'magnet';
headCell.classList.add('header6');
headCell.classList.add('header40');
document.querySelector('.lista2t tr:first-child td:nth-child(2)').parentNode.insertBefore(headCell, document.querySelector('.lista2t tr:first-child td:nth-child(2)'));

    var magnets=new Array();
    var index=0;
     $('tr.lista2 td+td.lista a[onmouseover~=return]').each(function () {
        var oldFunction=$(this).attr("onmouseover");
        var linkStartNum=oldFunction.indexOf("src=")+6;
        var linkEndNum=oldFunction.indexOf("jpg")+3;
        var newFunction1=oldFunction.substr(0,linkStartNum);
        var newFunction2=oldFunction.substr(linkEndNum,999);
        var link=oldFunction.substr(linkStartNum,linkEndNum-linkStartNum);
        //console.log('link='+link.split('/')[5]);
         magnets[index++]=link;
        // magnets.append(link);
        //preLoad(arrayimg,i,newFunction3);
    });


   
var torrents = document.querySelectorAll('.lista2 td:nth-child(2) [href^="/torrent/"]');

for (var i = 0; i < torrents.length; i++) {
    var magurl="magnet:?xt=urn:btih:"+magnets[i].split('/')[5].split('.')[0];
    //console.log('torrentURL='+torrents[i].parentNode.parentNode);
	//var id = torrents[i].href.split('/')[4];
	//var torrentFile = torrents[i].title;
	//var torrentURL = 'http://rarbg.to/download.php?id=' + id + '&f=' + torrentFile + '-[rarbg.com].torrent';

	var torrentCell = document.createElement('td');
	torrentCell.classList.add('torrent-cell');
	torrentCell.setAttribute('onclick', 'location.href="' + magurl +'"');
    var span = document.createElement('span');
    var strLink='<a style=\'color:#ff8000;font-size:20px;\' href=\"'+magurl+'\">磁力</a>';
    span.innerHTML = strLink;
    torrentCell.appendChild(span);

   // torrentCell.appendChild(span1);

    
	var torrentImg = document.createElement('img');
	//torrentImg.src = magnets[i];//
    torrentImg.src =torrentImgData;
	//torrentCell.appendChild(torrentImg);
    
    var td115 = document.createElement('td');
    //td115.innerHTML='<button">Click me</button>';
    td115.setAttribute('id',magurl);
	 td115.addEventListener ("click", OnClick115(magurl) , false);
    var span1 = document.createElement('span');
    td115.innerHTML='<button class="btn115" style="margin:0px !important;color:#ff0000;font-size:20px;" >115</button>';//'<a style=\'color:#ff0000;font-size:20px;\'>115</a>';
    //span1.onclick =OnClick115(magurl);
    //td115.appendChild(span1);

	torrents[i].parentNode.parentNode.insertBefore(torrentCell, torrents[i].parentNode);
    torrents[i].parentNode.parentNode.insertBefore(td115, torrents[i].parentNode);
    //torrents[i].parentNode.parentNode.insertBefore(torrentCell, torrents[i].parentNode);
    //mag115s[i].parentNode.parentNode.insertBefore(torrentCell, mag115s[i].parentNode);

}

    var prompt = function (message, style, time)
{
    style = (style === undefined) ? 'alert-success' : style;
    time = (time === undefined) ? 1200 : time;
    $('<div>')
        .appendTo('body')
        .addClass('alert ' + style)
        .html(message)
        .show()
        .delay(time)
        .fadeOut();
};


    function OnClick115(maglink){
        return function(){
            console.log('OnClick115:'+maglink);
            var token_url = 'http://115.com/?ct=offline&ac=space&_='; //获取115 token接口
            GM_xmlhttpRequest({
                method: 'GET',
                url: token_url + new Date().getTime(),
                onload: function (responseDetails) {
                    if (responseDetails.responseText.indexOf('html') >= 0) {
                        //未登录处理
                        alert("115还没有登录");
                        return false;
                    }
                    console.log("115已登录");
                    //console.log(responseDetails.responseText);
                    var sign115 = JSON.parse(responseDetails.response).sign;
                    var time115 = JSON.parse(responseDetails.response).time;
                    //console.log("sign:" + sign115 + " time:" + time115);
                    //console.log("rsp:" + responseDetails.response);
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'http://115.com/web/lixian/?ct=lixian&ac=add_task_url', //添加115离线任务接口
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: "url=" + encodeURIComponent(maglink) + "&sign=" + sign115 + "&time=" + time115, //uid=1034119 ,hobby的
                        onload: function (responseDetails) {
                            var lxRs = JSON.parse(responseDetails.responseText); //离线结果
                            if (lxRs.state) {
                                //离线任务添加成功
                                //GM_notification("离线任务添加成功");
                                GM_notification("离线任务添加成功");
                            }
                            else {
                                //离线任务添加失败
                                GM_notification("离线任务添加失败:"+lxRs.errcode);

                            }
                            //console.log("sign:" + sign115 + " time:" + time115);
                            //console.log("磁链:" + maglink + " 下载结果:" + lxRs.state + " 原因:" + lxRs.error_msg);
                            //console.log("rsp:" + responseDetails.response);
                        }
                    });

                }
            });

        }

    }



})();


