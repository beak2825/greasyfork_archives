// ==UserScript==
// @name         百度广告强力屏蔽
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.1
// @description  在搜索结果页面全程护眼。若有误判，多刷新几次试试。若误判率高请在讨论区或issue区反馈。紧急情况请用我的网站上的QQ临时会话。
// @author       LEORChn
// @include      *://www.baidu.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372550/%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E5%BC%BA%E5%8A%9B%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/372550/%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E5%BC%BA%E5%8A%9B%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
var inited=false;
(function(){
    recheck();
})();
function recheck(){
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    if(inited) return;
    if(ft('body').length==0) return;
    // write code here
    block();
    //inited=true;
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        // write code here
        protector10sec();
        return true;
    }
}
function block(){ // 这里面做规则
    if(location.pathname != '/s') return; //暂时只支持搜索页面好吧
    var a=fv('content_left');//要做大量的容错，因此会有相当多的判断
    if(!a) return;
    a=a.childNodes;
    for(var i=a.length-1;i>=0;i--){
        if(!a[i]) continue;
        if(a[i].nodeName != 'DIV') continue;
        var s=a[i].innerText;
        s=s.substr(s.length-2);
        if(s==w())
            removed(a[i]);
        else{
            var sp=a[i].getElementsByTagName('span');
            for(var i2=0;i2<sp.length;i2++){
                if(sp[i2].innerText.includes(w()))
                    removed(a[i]);
            }
        }
    }
}
function removed(d){ // 这里面可以做例外
    try{
        pl('已屏蔽广告\n======\n'+d.innerText);
        if(d.innerText.includes('baike.')) return; //百科不知道为啥被屏蔽了
        d.remove();
    }catch(e){}
}
var countdown=100;
function protector10sec(){
    block();
    pl('protecting');
    //if(countdown-->0) //取消倒计时，持续护眼。谷歌浏览器不用担心，虽然页面前台1秒10次，但后台时自动降低为1秒1次
        setTimeout(protector10sec,100);
}
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function w(){
var a=[5,15,1,7,10,0,2,12,8,14,4,3,11,9,13,6,117,37],b=[17,16,0,9,3,1,17,16,0,10,10,4],c='',d='';
for(var e=0;e<12;e++){
c+=a[b[e]]>20?String.fromCharCode(a[b[e]]):a[b[e]].toString(16);
if((e+1)%6==0){d+=unescape(c);c='';}
}return d;
}