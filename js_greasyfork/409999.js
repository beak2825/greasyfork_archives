// ==UserScript==
// @name         Update U2 passkey
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通过API批量更新qBittorrent上U2种子的passkey
// @author       Sion
// @match        https://u2.dmhy.org/privatetorrents.php
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/409999/Update%20U2%20passkey.user.js
// @updateURL https://update.greasyfork.org/scripts/409999/Update%20U2%20passkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

var para = '<h2 align="left">批量更新passkey</h2>\
<table width="100%" border="1" cellspacing="0" cellpadding="10"><tbody><tr><td class="text">\
该脚本仅适用于qBitorrent，只在Chrome以及非Chromium内核的Edge浏览器上测试过<br>\
请先在qBittorrent选单中开启WebUI，并且勾选无需本地验证<br>\
请仔细阅读上方说明。如果你已经了解相关风险，请点击上方按钮，并将API URL复制到下方的文本框中<br>\
API URL:<input type="text" style="width:90%" id="APIK"><br>\
<button id="getSeedList">获取种子列表</button><button id="getNewPassKey">获取新PassKey</button><button id="updateSeedPassKey">更新种子PassKey</button>\
<div id="output"></div>\
<table id="SeedList"></table>\
</td></tr></tbody></table>'



var createFrame = function()
{
    var table = document.getElementsByClassName('embedded');

    var p = document.createElement("p");
    p.innerHTML = para;
    table[1].appendChild(p);
}


var isU2Seed = function(tracker){
    return (tracker.indexOf("daydream.dmhy.best") != -1)
}

var getURLParameter = function(url, paramName) {
    var urlParams = url.split("?")[1];//或者url.search获取参数字符串
    var paramArray = urlParams.split("&");
    var len = paramArray.length;
    var paramObj = {};//json对象
    var arr = [];//数组对象
    for (var i = 0; i < len; i++) {
        arr = paramArray[i].split("=");
        paramObj[arr[0]] = arr[1];
    }
    for (var key in paramObj) {
        if (key == paramName) {
            return paramObj[paramName];
            break;
        }
    }

}

var updateTrackerUrl = function(infoHash,origUrl,newUrl)
{
    var fd =new FormData()
    fd.append('hash',infoHash)
    fd.append('origUrl',origUrl)
    fd.append('newUrl',newUrl)

    GM_xmlhttpRequest({
        method: "post",
        url: 'http://127.0.0.1:8080/api/v2/torrents/editTracker',
        data: fd,
        onload: function(xhr){
            if (xhr.readyState==4)
            {
                if (xhr.status==200)
                {// 200 = OK
                    console.log('ok')
                    completecount++;
                        if(SeedInfo.length != completecount)
                        document.getElementById("output").innerText = `共计${SeedInfo.length}个种子，有${completecount}个种子更新passkey成功`;
                        else document.getElementById("output").innerText = `共计${SeedInfo.length}个种子，passkey已全部更新`
                }
                else{
                    console.log('Network error')
                    console.log(xhr.status)
                }
            }
        }
    });
}



var SeedInfo = [];

var parseSeedList = function(responsetext)
{
    var json = JSON.parse(responsetext);
    SeedInfo.length = 0;
    for(var infoHash in json.torrents)
    {
        if(isU2Seed(json.torrents[infoHash].tracker))
        {
            var seed = [];
            seed['name'] = json.torrents[infoHash].name;
            seed['infoHash'] = infoHash;
            seed['passkey'] = getURLParameter(json.torrents[infoHash].tracker,'secure');
            seed['newpasskey'] = '';
            seed['tracker'] = json.torrents[infoHash].tracker;
            SeedInfo.push(seed);
        }
    }
}

var getSeedList = function()
{
    GM_xmlhttpRequest({
        method: "get",
        url: 'http://127.0.0.1:8080/api/v2/sync/maindata',

        onload: function(xhr){
            if (xhr.readyState==4)
            {
                if (xhr.status==200)
                {// 200 = OK
                    parseSeedList(xhr.response);
                    showSeeds();
                }
                else{
                    console.log('Network error')
                    console.log(xhr.status)
                }
            }
        }
    });
}

var showSeeds = function()
{
    var table = document.getElementById('SeedList');
    table.innerHTML = '<tbody><tr><td>种子名称</td><td>infoHash</td><td>新Passkey</td></tr></tbody'
    for(var i = 0; i < SeedInfo.length; i++)
    {
        var tr = document.createElement('tr');
        tr.innerHTML = `<td>${SeedInfo[i]['name']}</td><td>${SeedInfo[i]['infoHash']}</td><td></td>`
        table.lastChild.appendChild(tr);
    }
}

var errmsg = [];
var createRequestPayload = function(arr)
{
    var requestPayload = []
    for(var i = 0; i < arr.length; i++)
    {
        var json = {}
        json["jsonrpc"] = "2.0";
        json["method"] = "query";
        json["params"] = SeedInfo[arr[i]].infoHash;
        json["id"] = 1;
        requestPayload.push(json);
    }
    return JSON.stringify(requestPayload);
}

var parseResponse = function(responsetext,arr)
{
    var json = JSON.parse(responsetext);

    for(var i = 0; i < arr.length; i++)
    {
        if(typeof json[i].error == "undefined")
        {
            SeedInfo[arr[i]]['newpasskey'] = json[i].result;
        }
        else
        {
            errmsg.push(json[i].error);
        }
    }
    return 1;
}

var getApiUrl = function()
{
    var url = document.getElementById("APIK").value;
    if(url != '')
        return url
    else alert('请输入API URL地址')
    return 0
}


var performRequest = function(arr)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4)
        {
            if (xhr.status==200)
            {// 200 = OK
                console.log(xhr.response)
                if(parseResponse(xhr.response,arr) == 0)
                {
                    console.log('parse err')
                    return 0;
                }
            }
            else{
                console.log('Network error')
                console.log(xhr.status)
                return 0;
            }
        }
    }
    xhr.open('post',getApiUrl(),false);
    xhr.send(createRequestPayload(arr));
    return 1;
}

//又到了👴最喜欢的同步阻塞时间，不要问👴为什么在JS上用阻塞，工地还有50方混凝土要打，👴去扛水泥
function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}

var getNewPassKey = function()
{
    var i;
    var emptylist = [];
    if(getApiUrl() == 0)return;
    for(i = 0; i < SeedInfo.length; i++)
    {
        if(SeedInfo[i].newpasskey == '')
        emptylist.push(i);
    }
    console.log(emptylist);
    i = 0;
    if(parseInt(emptylist.length / 100) >0)
    {
        for(i = 0; i < parseInt(emptylist.length / 100); i++)
        {
            if(performRequest(emptylist.slice(100*i, 100*i + 100)) == 0)
            {
                document.getElementById("output").innerText = errmsg;
                return;
            }
            sleep(2200);
        }
    }
    if(emptylist.length % 100 >0)
    {
        if(performRequest(emptylist.slice(100*i, 100*i + emptylist.length % 100)) == 0)
        {
            document.getElementById("output").innerText = errmsg;
            document.getElementById("output").innerText = '完成';
            return;
        }
    }


    emptylist.length = 0;
    for(i = 0; i < SeedInfo.length; i++)
    {
        if(SeedInfo[i].newpasskey == '')
        emptylist.push(i);
    }


    if(emptylist.length != 0)document.getElementById("output").innerText = `共计${SeedInfo.length}个种子，有${emptylist.length}个种子未获取到新passkey，请再点一次获取passkey按钮`;
    else document.getElementById("output").innerText = `共计${SeedInfo.length}个种子，passkey已全部获取到，请点击更新passkey按钮`
    var table = document.getElementById('SeedList');
    for(i = 0; i< SeedInfo.length; i++)
    {
        table.rows[i + 1].cells[2].innerText = SeedInfo[i].newpasskey;
    }

}


var completecount;
var updateSeedPassKey = function()
{
    var i;
    completecount = 0;
    for(i = 0; i < SeedInfo.length; i++)
    {
        if(SeedInfo[i].newpasskey != '')
        {
            updateTrackerUrl(SeedInfo[i].infoHash,SeedInfo[i].tracker,'http://daydream.dmhy.best/announce?secure='+SeedInfo[i].newpasskey)
        }
    }

}


createFrame()
var btn = document.getElementById("getSeedList");
btn.onclick = getSeedList;

var btn = document.getElementById("getNewPassKey");
btn.onclick = getNewPassKey;

var btn = document.getElementById("updateSeedPassKey");
btn.onclick = updateSeedPassKey;

    // Your code here...
})();