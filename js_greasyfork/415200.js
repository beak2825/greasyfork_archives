// ==UserScript==
// @name         kana说说·屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在kana屏蔽他人说说
// @author       xiaolan16
// @match        https://kana.byha.top:444
// @match        https://kana.byha.top:444/user/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/415200/kana%E8%AF%B4%E8%AF%B4%C2%B7%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/415200/kana%E8%AF%B4%E8%AF%B4%C2%B7%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    function tmp1(){
        var x=window.location.href.match(/\d+(.\d+)?/g)[1];
        console.log(x);
        pingbi[x]=1;
        GM_setValue("kanapingbi",pingbi);
    }
    function tmp2() {
        var x=window.location.href.match(/\d+(.\d+)?/g)[1];
        pingbi[x]=0;
        GM_setValue("kanapingbi",pingbi);
	}
    var node = document.createElement('div');
    node.className = 'kana-item';
    if(window.location.href!="https://kana.byha.top:444/"&&window.location.href.startsWith("https://kana.byha.top:444/")){
        //document.getElementsByClassName("sidebar")[0].parentNode.appendChild(node);
    }
    var button1=document.createElement("button");
    button1.name = "pingbi";
    button1.id = "pingbi";
    button1.innerHTML = "屏蔽";
    button1.style="border-color: rgb(52, 152, 219); background-color: rgb(231, 76, 60)";
    button1.onclick = function(){tmp1();};

    var button2=document.createElement("button");
    button2.name = "jiechupingbi";
    button2.id = "jiechupingbi";
    button2.innerHTML = "解除";
    button2.style="border-color: rgb(52, 152, 219); background-color: rgb(82, 196, 26)";
    button2.onclick = function(){tmp2();};

    if(window.location.href!="https://kana.byha.top:444/"&&window.location.href.startsWith("https://kana.byha.top:444/")){
        document.getElementsByClassName("userinfo-name")[0].append(button1);
        document.getElementsByClassName("userinfo-name")[0].append(button2);
    }
})();
setInterval(function() {
    'use strict';
    var pingbi=[];
    for(let i=1;i<=100000;i++){
        pingbi[i]=0;
    }
    pingbi=GM_getValue("kanapingbi",pingbi);
    function getuid(name) { // 根据用户名反查 uid
		return new Promise((resolve, reject) => {
			$.get('/api/user/name2id?uname=' + name, function (resp) {
				resolve(resp.msg);
			});
		});
	}
    /*document.getElementsByClassName("kana-item rating")[0].parentNode.appendChild(node1);
    document.getElementsByClassName("text-input")[2].append(button1).append(tmp1).append(button2);*/
    for (var i = 0; i <= 100; i++) {
        var node2;
        try {
            node2=document.getElementsByClassName("shuoshuo kana-item preview")[i];
        }
        catch (error) {
            break;
        }
        try{
            var tmpx=node2.getElementsByClassName("post-info-author-username")[0].innerHTML.match(/\/user\/(\d+)/)[0];
            //console.log(x);
            var x=tmpx.match(/\d+(.\d+)?/g);
            if(pingbi[x])document.getElementsByClassName("shuoshuo kana-item preview")[i].innerHTML="";
        }
        catch (error) {
            ;
        }
    }
}, 2000);