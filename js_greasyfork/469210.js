// ==UserScript==
// @name         给哔哩网页添加推荐
// @namespace    https://palhube666.wodemo.com/
// @version      0.4
// @description  抛弃哔哩哔哩App的第二步~
// @author       呆毛飘啊飘2171802813
// @run-at       document-end
// @match        *.bilibili.com/*
// @exclude-match  *.bilibili.com/video*
// @exclude-match  *.bilibili.com/search*
// @grant        none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/469210/%E7%BB%99%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/469210/%E7%BB%99%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==


var a=document.getElementById('zhu');
if(a==null){
/*防止多次加载，比如在via时会加载两次...*/
/*添加按钮css样式*/
Vie_addStyle('#mian:before,#mian:after{ display: table; content: " "; clear: both;}#mian{width:100%;padding:0;margin-bottom: 50px;}#mian li{list-style:none;}#mian p{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;}#mian a{TEXT-DECORATION:none;font-size:12px;color:#000000;}.iteem{background-color: #FFFFFF;display: flex;flex-direction: column;padding-left: 20px;padding-right: 15px;padding-top: 6px;padding-bottom: 15px;}.iteem:active{background-color: #ededed;}.vieh3{display: -webkit-box!important;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;font-size: 15px;font-weight: 400;height:35px;line-height: 2;margin: 0;margin-top: 4px;}.viespan{font-size: 8px;height:16px;color: #999999;}.an,.an:hover{text-align:center;border:1px solid #000;color:#000;background:0 0;border-radius:2px;padding:8px 12px;margin:2px 10px 10px 2px;cursor:pointer;display:inline-block;font-size:14px;min-width:72px;text-decoration:none}.an:hover{background:rgba(0,0,0,.5)}');


/*添加推荐视频列表的底层布局*/
var a=document.getElementsByClassName('video-list-box')[0];
var divv = document.createElement('div');
divv.id = 'zhu';
divv.style = 'word-wrap:break-word;overflow:auto;background:white;position:fixed;left:0px;top:80.5px;z-index:999;width:100%;height:90%';
a.appendChild(divv);

var a=document.getElementById('zhu');
var pp = document.createElement('a');
pp.onclick = function(){Vie_getA()};
pp.innerHTML = '<p aria-hidden="true" class="an">随机推荐</p>';
a.appendChild(pp);

var a=document.getElementById('zhu');
var pp = document.createElement('a');
pp.onclick = function(){Vie_getB()};
pp.innerHTML = '<p aria-hidden="true" class="an">分类推荐</p>';
a.appendChild(pp);

var a=document.getElementById('zhu');
var pp = document.createElement('a');
pp.onclick = function(){Vie_close()};
pp.innerHTML = '<p aria-hidden="true" class="an">关闭</p>';
a.appendChild(pp);

var a=document.getElementById('zhu');
var divv = document.createElement('ul');
divv.id = 'mian';
a.appendChild(divv);

Vie_close();

/*添加推荐按钮*/
var b=document.getElementsByClassName('v-switcher__header__tabs__list')[0];
var bn=b.innerHTML;
var wyi=Number(Vie_cutText(bn,'translateX(','px'))+57.6;
var kwyi='translateX('+wyi.toString()+'px)';
var nwyi='translateX('+Vie_cutText(bn,'translateX(','px')+'px)';
bn='<a style="color:#00ffdd" href="javascript:Vie_ann();" class="v-switcher__header__tabs__item"><!----> <span>推荐</span></a>'+bn;
var nw='width: '+Vie_cutText(bn,'style="width: ','px')+'px';
bn=bn.replace(nwyi,kwyi).replace(nw,'width: 25px');
document.getElementsByClassName('v-switcher__header__tabs__list')[0].innerHTML = bn;
/*添加按钮到下拉菜单（似乎不奏效）*/
var c=document.getElementsByClassName('drawer-box')[0];
var cn='<a href="javascript:Vie_ann();" style="color:#00ffdd" class="link-item">推荐</a>'+c.innerHTML;
document.getElementsByClassName('drawer-box')[0].innerHTML=cn;
}
Vie_ann=()=>{
Vie_show();
}

console.log('over');


/*下面是内部函数，建议不要改动！*/

function Vie_addStyle(txt){
var viestyle=document.createElement('style');
viestyle.type='text/css';
viestyle.innerHTML=txt;
document.getElementsByTagName('head')[0].appendChild(viestyle);
return viestyle;
};

function Vie_cutText(obj,gjc,gc){
var res = obj.substring(obj.lastIndexOf(gjc)+gjc.length,obj.length);
res = res.substring(0,res.indexOf(gc));
return res;
}

function Vie_show(){
document.getElementById('zhu').hidden=false;
Vie_getA();
document.body.style.position = 'fixed';
/*移动指示器*/
var b=document.getElementsByClassName('v-switcher__header__tabs__list')[0];
var bn=b.innerHTML;
var kwyi='translateX(16px)';
window.localStorage.setItem('Vie_zhisq',Vie_cutText(bn,'translateX(','px'));
var nwyi='translateX('+Vie_cutText(bn,'translateX(','px')+'px)';
var nw='width: '+Vie_cutText(bn,'style="width: ','px')+'px';
bn=bn.replace(nwyi,kwyi).replace(nw,'width: 25px');
document.getElementsByClassName('v-switcher__header__tabs__list')[0].innerHTML = bn;
}

function Vie_close(){
document.getElementById('zhu').hidden=true;
document.body.style.position = 'static';
}

function Vie_getA(){
document.getElementById('mian').innerText='';
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.bilibili.com/x/web-interface/dynamic/region?ps=50&rid=1');
xhr.send(); 
xhr.onreadystatechange = function(){
var txt = xhr.responseText;
if(txt == null || txt == '' || txt == undefined)
{
}
else
{
if ( xhr.readyState == 4 && xhr.status == 200 )
{
var obj=JSON.parse(txt);
var nn=obj.data.archives;
for (var i = 0; i < nn.length; i++) {
var key=nn[i];
var div = document.createElement("li");
div.className = "tplb-sm-2";
div.style = 'width:45%;margin:2.5%;padding:0;border: 0;float:left;position:relative;min-height:1px;';

var spn = document.createElement("span");
spn.className = "viespan";
spn.innerText = key.short_link_v2;
spn.style.display="none";
div.appendChild(spn);

var pic = document.createElement("img");
pic.src=key.pic+'@480w_270h';
pic.style='height:100px;border-radius:10px;margin: 0;padding:0;border: 0;';
div.appendChild(pic);

div.className = "iteem";
var h3 = document.createElement("h3");
h3.innerText = key.title;
h3.className = "vieh3";

div.appendChild(h3);
var span = document.createElement("span");
span.className = "viespan";
span.innerText = '浏览:'+key.stat.view+';评论:'+key.stat.danmaku;
div.appendChild(span);
document.getElementById("mian").appendChild(div);

div.onclick=function(){ window.open(this.firstElementChild.innerText,"_blank"); };
}
var div = document.createElement("li");
div.className = "iteem";
var h3 = document.createElement("h3");
h3.innerText = '没有啦，嘤嘤嘤，点我刷新吧';
h3.className = "vieh3";
div.appendChild(h3);
var span = document.createElement("span");
span.className = "viespan";
span.innerText = '嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤';
div.appendChild(span);
document.getElementById("mian").appendChild(div);
div.onclick=function(){Vie_getB()};
}
}
}
}

function Vie_getB(){
document.getElementById('mian').innerText='';
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.bilibili.com/index/ding.json');
xhr.send(); 
xhr.onreadystatechange = function(){
var txt = xhr.responseText;
if(txt == null || txt == '' || txt == undefined)
{
}
else
{
if ( xhr.readyState == 4 && xhr.status == 200 )
{
var obj=JSON.parse(txt);

for (var key in obj) {
if(key=='list' || key=='results' || key=='pages' || key=='code'){
}
else{
for (var i in obj[key]) {
var div = document.createElement("li");
div.className = "tplb-sm-2";
div.style = 'width:45%;margin:2.5%;padding:0;border: 0;float:left;position:relative;min-height:1px;';

var spn = document.createElement("span");
spn.className = "viespan";
spn.innerText = obj[key][i].short_link_v2;
spn.style.display="none";
div.appendChild(spn);

var pic = document.createElement("img");
pic.src=obj[key][i].pic+'@480w_270h';
pic.style='height:100px;border-radius:10px;margin: 0;padding:0;border: 0;';
div.appendChild(pic);

div.className = "iteem";
var h3 = document.createElement("h3");
h3.innerText = obj[key][i].title;
h3.className = "vieh3";

div.appendChild(h3);
var span = document.createElement("span");
span.className = "viespan";
span.innerText = '浏览:'+obj[key][i].stat.view+';评论:'+obj[key][i].stat.danmaku+';分类:'+key;
div.appendChild(span);
document.getElementById("mian").appendChild(div);

div.onclick=function(){ window.open(this.firstElementChild.innerText,"_blank"); };
}
}
}
var div = document.createElement("li");
div.className = "iteem";
var h3 = document.createElement("h3");
h3.innerText = '没有啦，嘤嘤嘤，点我刷新吧';
h3.className = "vieh3";
div.appendChild(h3);
var span = document.createElement("span");
span.className = "viespan";
span.innerText = '呆毛飘啊飘~嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤嘤';
div.appendChild(span);
document.getElementById("mian").appendChild(div);
div.onclick=function(){Vie_getA()};
}
}
}
}