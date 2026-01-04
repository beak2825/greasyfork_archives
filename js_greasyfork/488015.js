// ==UserScript==
// @name     彩色AC
// @name:en  Colorful AC
// @description    一些编程网站的 AC 记录都会变成彩色！
// @description:en Some computer programming website's AC are in color!
// @author   123asdf123(洛谷576074)
// @license SATA
// @icon https://asdf123asdf123asdf123.github.io/sample.gif
// @version  4.2.10.8
// @match    *://*.bashu.com.cn/*
// @match    *://www.luogu.com.cn/record/*
// @match    *://www.luogu.com.cn/problem/*
// @match    *://*.codeforces.com/*
// @match    *://*.codeforc.es/*
// @match    *://*.vjudge.net/*
// @match    *://*.atcoder.jp/*
// @match    *://acm.hdu.edu.cn/*
// @match    *://*.loj.ac/*
// @match    *://*.spoj.com/*
// @match    *://uoj.ac/*
// @match    *://119.27.163.117/*
// @match    *://hydro.ac/*
// @match    *://acm.sdut.edu.cn/onlinejudge3/solutions/*
// @match    *://poj.org/*
// @namespace https://greasyfork.org/users/1265383
// @downloadURL https://update.greasyfork.org/scripts/488015/%E5%BD%A9%E8%89%B2AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488015/%E5%BD%A9%E8%89%B2AC.meta.js
// ==/UserScript==
let c=Math.round(Math.random()*360);
function hsvToRgb(x) {
    var h = x, s = 100, v =100;
    s = s / 100;
    v = v / 100;
    var r = 0, g = 0, b = 0;
    var i = parseInt((h / 60) % 6);
    var f = h / 60 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i) {
        case 0:
            r = v; g = t; b = p;
            break;
        case 1:
            r = q; g = v; b = p;
            break;
        case 2:
            r = p; g = v; b = t;
            break;
        case 3:
            r = p; g = q; b = v;
            break;
        case 4:
            r = t; g = p; b = v;
            break;
        case 5:
            r = v; g = p; b = q;
            break;
        default:
            break;
    }
    r = parseInt(r * 255.0)
    g = parseInt(g * 255.0)
    b = parseInt(b * 255.0)
    return [r, g, b];
}
var front=[],afront=[],back=[],nb=[];
function get(now){
    if(now.innerHTML=='AC'&&now.className=="status")
        if(back.includes(now.parentNode)==false)
            back.push(now.parentNode);
    if(now.innerHTML=='Correct')
        if(back.includes(now.parentNode)==false)
            back.push(now.parentNode);
    if(now.innerHTML=='\n        Accepted\n      ')
        if(front.includes(now)==false){
            front.push(now);
            if(now.parentNode.parentNode.parentNode.children.length>=4)
                if(front.includes(now.parentNode.parentNode.parentNode.children[2].children[1].children[0].children[0])==false)
                    front.push(now.parentNode.parentNode.parentNode.children[2].children[1].children[0].children[0]);
        }
    if(now.innerHTML=='\n  Accepted\n')
        if(back.includes(now)==false){
            back.push(now);
            if(now.parentNode.children.length>=2)
                if(front.includes(now.parentNode.children[1])==false)
                    front.push(now.parentNode.children[1]);
        }
    if(now.innerHTML=='<i class="icon-ok icon-white"></i> Congratulation !')
       if(back.includes(now)==false)
            back.push(now);
    if(now.innerHTML=='<i class="fa fa-check"></i> Submit'){
       if(back.includes(now)==false)
            back.push(now);
       if(nb.includes(now)==false)
            nb.push(now);
    }
    if(now.innerHTML=='Accepted'&&now.className=="label label-success")
       if(back.includes(now)==false)
            back.push(now);
	if(now.innerHTML=='AC'&&now.className=="label label-success")
		if(back.includes(now)==false)
		   back.push(now);
	if(now.innerHTML=='Accepted'&&now.className=="lcolor--green-3")
		if(front.includes(now)==false)
		   front.push(now);
	if(now.innerHTML=='Accepted'&&now.className=="accepted")
		if(front.includes(now)==false)
		   front.push(now);
	if(now.innerHTML=='Accepted'&&now.className=="status")
		if(front.includes(now)==false)
		   front.push(now);
    if(now.innerHTML==' Accepted'&&now.className=="view-solution")
       if(front.includes(now)==false)
            front.push(now);
    if(now.innerHTML=='Accepted'&&now.tagName=="FONT")
       if(front.includes(now)==false)
            front.push(now);
    if(now.className=="verdict-accepted")
       if(front.includes(now)==false)
            front.push(now);
    if(typeof now.className=="string"&&now.className.includes("record-status--text pass")){
       if(front.includes(now)==false)
            front.push(now);
       if(now.children.length>=1&&front.includes(now.children[0])==false)
            front.push(now.children[0]);
        if(now.previousElementSibling!=null&&now.previousElementSibling.style.color=="rgb(37, 173, 64)")
            if(afront.includes(now.previousElementSibling)==false)
                afront.push(now.previousElementSibling);
    }
    if(now.innerHTML=='\n  AC\n')
       if(back.includes(now)==false)
            back.push(now);
    if(now.className=="result bg-green cursor-pointer")
       if(back.includes(now)==false)
            back.push(now);
    if(now.className=="tag tag-success"&&now.innerText=="Solved")
       if(back.includes(now)==false)
            back.push(now);
    if(now.className=="text-white bg-green")
       if(back.includes(now)==false)
            back.push(now);
    if(now.style.color=="rgb(0, 204, 0)")
       if(afront.includes(now)==false)
            afront.push(now);
    var x=now.children;
    for(var i=0;i<now.children.length;i++)
        get(x[i]);
}
function rep(){
    c+=1;
    if(c==360){
        c=0;
    }
    let xxx=hsvToRgb(c),col='rgb('+xxx[0]+','+xxx[1]+','+xxx[2]+')';
    if(document.documentElement.getAttribute("data-app")=="Hydro")//too slow!!!
        css.innerText='.record-status--icon.pass:before{color:'+col+'!important}.record-status--border.pass{border-left: .1875rem solid '+col+';}';
    for(let i=0;i<front.length;i++)
        front[i].style.setProperty('color',col,'important');
    for(let i=0;i<afront.length;i++)
        afront[i].style.setProperty('color',col,'important');
    for(let i=0;i<back.length;i++)
        back[i].style.setProperty('background',col,'important');
    for(let i=0;i<nb.length;i++)
        nb[i].style.setProperty('border','0px','important');
}
function getac(s){
    var x;
    x=document.getElementsByClassName(s);
    for(let i=0;i<x.length;i++)
        get(x[i]);
}
function getallac(s){
    var x;
    x=document.getElementsByClassName(s);
    for(let i=0;i<x.length;i++)
       if(front.includes(x[i])==false)
            front.push(x[i]);
}
function getuojac(s){
    var x;
    x=document.getElementsByClassName(s);
    for(let i=0;i<x.length;i++){
       if(back.includes(x[i].children[0])==false)
            back.push(x[i].children[0]);
       if(nb.includes(x[i])==false)
            nb.push(x[i]);
    }
}
function gethduac(){
    var x;
    x=document.querySelectorAll("font");
    for(let i=0;i<x.length;i++)
        get(x[i]);
}
const lock = document.createElement('meta');
lock.name = 'darkreader-lock';
document.head.appendChild(lock);
var css=document.createElement('style');
document.head.appendChild(css);
(() => {
let a = setInterval(() =>{
    front=[];
    back=[];
    getac("status-link color-none");
    getac("res-good");
    getac("label label-success");
    getac("gradient-green center");
    getac("status");
    getac("info-rows");
    getac("l-flex-info-row");
    getac("verdict-accepted");
    getac("record-status--text pass");
    getac("accepted");
    getac("btn btn-success");
    getac("tag tag-success");
    getac("view-solution");
    getac("result-bar");
    getac("ant-col-xs-12 ant-col-md-4");
    getac("uoj-status");
    getac("uoj-score");
    getuojac("panel panel-uoj-accepted");
    gethduac();
    getallac("statuscolor _Accepted_127b4_43");
    getallac("_score_10_1lqan_31");
    var x;
    x=document.getElementsByClassName("kol3 ");
    for(let i=0;i<x.length;i++)
        for(var j=0;j<x[i].children.length;j++)
            if(back.includes(x[i].children[j])==false)
                back.push(x[i].children[j]);
    rep();
},5)
})();