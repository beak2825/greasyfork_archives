// ==UserScript==
// @name         Steam创意工坊下载
// @version      0.1
// @namespace    http://jackxhe.cn
// @description  在订阅按钮旁添加个下载按钮
// @author       JackXhE
// @include      *//steamcommunity.com/sharedfiles/filedetails/?id=*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32498/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/32498/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    var downUrl="";
    var isErr=0;
    var p = /[0-9]{2,15}/;
    var mid = p.exec(document.URL)[0];




    GM_xmlhttpRequest({
        method: "POST",
        ignoreCache: true,
        url: "http://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v0001/",
        data: 'itemcount=1&publishedfileids[0]=' + mid + '&format=json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function(res) {
            data=res.responseText;
            data=JSON.parse(data);
            downUrl = data.response.publishedfiledetails[0].file_url;
            
            console.log(data);
            
            if(downUrl!==''){
                go();
            }else{
                isErr=2;
                console.log('本物品无法获取下载地址');
                alert('本物品无法获取下载地址');
                //本物品无法获取下载地址
            }
        },
        onerror: function(res) {
            var msg = "An error occurred."+ "\nresponseText: " + res.responseText + "\nreadyState: " + res.readyState+ "\nresponseHeaders: " + res.responseHeaders+ "\nstatus: " + res.status+ "\nstatusText: " + res.statusText+ "\nfinalUrl: " + res.finalUrl;
            console.log(msg);
            alert("获取下载地址失败，请刷新页面重试");
            isErr=1;

        }
    });



    function go(){
        var downButtonPosition = document.getElementById("SubscribeItemBtn").offsetWidth + 20;
        var downButton = document.createElement('a');
        downButton.setAttribute('class', 'btn_green_white_innerfade btn_border_2px btn_medium ');
        downButton.setAttribute('style', 'right: ' + downButtonPosition + 'px;');
        downButton.innerHTML="<div class='subscribeIcon'></div><span class='subscribeText'><div class='subscribeOption subscribe selected'>下载</div></span>";
        downButton.id="subdown";
        downButton.href=downUrl;
        document.getElementById("SubscribeItemBtn").before(downButton);

    }

})();