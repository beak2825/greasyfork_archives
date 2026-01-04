// ==UserScript==
// @name         kana脚本整合
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在kana管理他人的大小号关系&在kana屏蔽他人说说
// @author       xiaolan16
// @match        https://kana.byha.top:444
// @match        https://kana.byha.top:444/user/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/411813/kana%E8%84%9A%E6%9C%AC%E6%95%B4%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/411813/kana%E8%84%9A%E6%9C%AC%E6%95%B4%E5%90%88.meta.js
// ==/UserScript==

var used1=1;
//0表示不用大小号管理脚本
//1表示用大小号管理脚本
var used2=1;
//0表示不用说说屏蔽器
//1表示用说说屏蔽器
(function() {
    'use strict';
    if(used2){
        var pingbi1=[];
        for(let i=1;i<=100000;i++)pingbi1[i]=0;
        pingbi1=GM_getValue("kanapingbi1",pingbi1);
        var pingbi2=[];
        for(let i=1;i<=100000;i++)pingbi2[i]=0;
        pingbi2=GM_getValue("kanapingbi2",pingbi2);
        function tmp1(){
            var x=window.location.href.match(/\d+(.\d+)?/g)[1];
            console.log(x);
            pingbi1[x]=1;
            GM_setValue("kanapingbi1",pingbi1);
        }
        function tmp2() {
            var x=window.location.href.match(/\d+(.\d+)?/g)[1];
            pingbi1[x]=pingbi2[x]=0;
            GM_setValue("kanapingbi1",pingbi1);
            GM_setValue("kanapingbi2",pingbi2);
        }
        function tmp3(){
            var x=window.location.href.match(/\d+(.\d+)?/g)[1];
            console.log(x);
            pingbi2[x]=1;
            GM_setValue("kanapingbi2",pingbi2);
        }
        var pingbibutton1=document.createElement("button");
        pingbibutton1.name = "pingbi";
        pingbibutton1.id = "pingbi";
        pingbibutton1.innerHTML = "屏蔽";
        pingbibutton1.style="border-color: rgb(231, 76, 60); background-color: rgb(231, 76, 60)";
        pingbibutton1.onclick = function(){tmp1();};

        var pingbibutton3=document.createElement("button");
        pingbibutton3.name = "lianhuanpingbi";
        pingbibutton3.id = "lianhuanpingbi";
        pingbibutton3.innerHTML = "连环屏蔽";
        pingbibutton3.style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219)";
        pingbibutton3.onclick = function(){tmp3();};

        var pingbibutton2=document.createElement("button");
        pingbibutton2.name = "jiechupingbi";
        pingbibutton2.id = "jiechupingbi";
        pingbibutton2.innerHTML = "解除";
        pingbibutton2.style="border-color: rgb(82, 196, 26); background-color: rgb(82, 196, 26)";
        pingbibutton2.onclick = function(){tmp2();};

        if(window.location.href!="https://kana.byha.top:444/"&&window.location.href.startsWith("https://kana.byha.top:444/")){
            document.getElementsByClassName("userinfo-name")[0].append(pingbibutton1);
            if(used1)document.getElementsByClassName("userinfo-name")[0].append(pingbibutton3);
            document.getElementsByClassName("userinfo-name")[0].append(pingbibutton2);
        }
    }
    if(used1){
        function find(x){
            if(x==fa[x])return x;
            //fa[x]=find(fa[x]);
            return find(fa[x]);
        }
        var id=[];
        for(let i=1;i<=100000;i++)id[i]=i;
        var fa=GM_getValue("edges",id);
        function querydahao(){
            var a;
            for(let i=0;i<=10;i++){
                if(document.getElementsByClassName("text-input")[i].id=='querydahaoinput'){
                    a=document.getElementsByClassName("text-input")[i].value;
                    break;
                }
            }
            var tmp="->"
            console.log(find(a));
            for(let i=1;i<=100;i++){
                if(document.getElementsByClassName("kana-item")[i].id=='showquery'){
                    document.getElementsByClassName("kana-item")[i].innerHTML+=
                        `
<h2><a href="/user/`+a+`">`+a+`</a>&nbsp;`+tmp+`&nbsp;<a href="/user/`+find(a)+`">`+find(a)+`</a><h2>
`
                }
            }
        }
        function addclick() {
            var a,b;
            for(let i=0;i<=10;i++){
                if(document.getElementsByClassName("text-input")[i].id=='editdahaofirst'){
                    a=document.getElementsByClassName("text-input")[i].value;
                    break;
                }
            }
            for(let i=0;i<=10;i++){
                if(document.getElementsByClassName("text-input")[i].id=='editdahaosecond'){
                    b=document.getElementsByClassName("text-input")[i].value;
                    break;
                }
            }
            fa[a]=b;
            GM_setValue("edges",fa);
            //console.log(a);
            //console.log(b);
        }
        var node1 = document.createElement('div');
        node1.className = 'kana-item';
        node1.id = 'addparent';
        node1.innerHTML =
            `
<div>
<textarea class="text-input" id="editdahaofirst" name="editdahaofirst" contenteditable="true"></textarea><br>
</div>
<textarea class="text-input" id="editdahaosecond" name="editdahaosecond" contenteditable="true"></textarea><br>
</div>
`
        var node2 = document.createElement('div');
        node2.className = 'kana-item';
        node2.id = 'queryparent';
        node2.innerHTML=
            `
<textarea class="text-input" id="querydahaoinput" name="querydahaoinput" contenteditable="true"></textarea><br>
</div>
`
        var node3 = document.createElement('div');
        node3.className = 'kana-item';
        node3.id = 'showquery';
        var button1=document.createElement("button");
        button1.name = "submiteditdahao";
        button1.id = "submiteditdahao";
        button1.innerHTML = "确认";
        button1.style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219)";
        button1.onclick = function(){addclick();};
        var button2=document.createElement("button");
        button2.name = "querydahao";
        button2.id = "querydahao";
        button2.innerHTML = "查询大号";
        button2.style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219)";
        button2.onclick = function(){querydahao();};
        if(window.location.href=="https://kana.byha.top:444/"){
            document.getElementsByClassName("kana-item rating")[0].parentNode.appendChild(node1);
            document.getElementsByClassName("kana-item rating")[0].parentNode.appendChild(node2);
            document.getElementsByClassName("kana-item rating")[0].parentNode.appendChild(node3);
            document.getElementsByClassName("text-input")[2].parentNode.appendChild(button1);
            document.getElementsByClassName("text-input")[3].parentNode.appendChild(button2);
        }
        /*document.getElementsByClassName("kana-item rating")[0].parentNode.appendChild(node1);
    document.getElementsByClassName("text-input")[2].append(button1).append(tmp1).append(button2);*/
    }
})();
setInterval(function() {
    if(used1){
        var id=[];
        for(let i=1;i<=100000;i++){
            id[i]=i;
        }
        var fa=GM_getValue("edges",id);
        function find(x){
            if(x==fa[x])return x;
            //fa[x]=find(fa[x]);
            return find(fa[x]);
        }
    }
    if(used2){
        var pingbi1=[];
        for(let i=1;i<=100000;i++)pingbi1[i]=0;
        pingbi1=GM_getValue("kanapingbi1",pingbi1);
        if(used1){
            var pingbi2=[];
            for(let i=1;i<=100000;i++)pingbi2[i]=0;
            pingbi2=GM_getValue("kanapingbi2",pingbi2);
            var pingbiuid2=[];
            pingbiuid2[0]=pingbiuid2[1]=[];
            for(let i=1;i<=100000;i++)pingbiuid2[0][i]=0;
            for(let i=1;i<=100000;i++){
                if(pingbiuid2[0][find(i)]==0&&pingbi2[i]==1){
                    pingbiuid2[0][find(i)]=pingbi2[i];
                    pingbiuid2[1][find(i)]=i;
                }
            }
        }
    }
    for (var i=0;i<=10000;i++) {
        var nodetmp;
        try {
            nodetmp=document.getElementsByClassName("shuoshuo kana-item preview")[i];
        }
        catch (error) {
            break;
        }
        try{
            var tmpx=nodetmp.getElementsByClassName("post-info-author-username")[0].innerHTML.match(/\/user\/(\d+)/)[0];
            //console.log(x);
            var x=tmpx.match(/\d+(.\d+)?/g);
            if(used2){
                if(pingbi1[x]||pingbiuid2[0][find(x)]){
                    document.getElementsByClassName("shuoshuo kana-item preview")[i].innerHTML="";
                    if(pingbi1[x]==0)document.getElementsByClassName("shuoshuo kana-item preview")[i].innerHTML="原因：屏蔽UID="+pingbiuid2[1][find(x)];
                    else document.getElementsByClassName("shuoshuo kana-item preview")[i].innerHTML="原因：屏蔽UID="+x;
                }
            }
            if(used1&&!nodetmp.getElementsByClassName("post-info-author-username")[0].innerHTML.match(`><span class="am-badge am-radius" style="background-color: #FF0000;">跳转大号</span></a>`)){
                //var xp=$.get('/api/user/info?uid=' +x, function (resp) {});
                nodetmp.getElementsByClassName("post-info-author-username")[0].innerHTML+=
                    `
&nbsp;&nbsp;&nbsp;
<a href="/user/`+find(x)+`"><span class="am-badge am-radius" style="background-color: #FF0000;">跳转大号</span></a>
`
                ;
            }
        }
        catch (error) {
            ;
        }
    }
}, 2000);