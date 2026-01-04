// ==UserScript==
// @name         MMOLODA　オートページ
// @name:en      Mmoloda Autopager
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動で次のページの内容を表示
// @description:en Automatically load subsequent pages and append their contents
// @author       You
// @match        http://mmoloda.com/*/*
// @match        http://*.mmoloda.com/*
// @include      http://mmoloda-*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407572/MMOLODA%E3%80%80%E3%82%AA%E3%83%BC%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/407572/MMOLODA%E3%80%80%E3%82%AA%E3%83%BC%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8.meta.js
// ==/UserScript==

if(document.URL.indexOf('image')>-1){
    throw '';
}

var superfluous;
var sftoggle = false;
var contentoffset = 0; //calculate space above content; used for rescrolling after zoom
var posts = getcontainer(document);
while (posts) {
    contentoffset += posts.offsetTop;
    posts = posts.offsetParent;
}

// == buttons ==
var buttontoggle = makebutton('buttontoggle',togglesupflu,'Hide','10%','0%');
var buttonpause = makebutton('buttonpause',buttpause,'Pause','12.5%','0%');
var buttonreverse = makebutton('buttonreverse',buttreverse,'Reverse','15%','0%');

var buttonminus = makebutton("myButtonminus",buttminus," - ","5%","0px");
var buttonplus = makebutton("myButtonplus",buttplus," + ","5%","30px");
var buttonreset = makebutton("myButtonreset",buttreset," 1x","5%","90px");
var buttondouble = makebutton("myButtondouble",buttdouble," 2x","5%","120px");


function togglesupflu(){
    sftoggle = !sftoggle;
    superfluous = superfluous || (coc == 'contents' ? Array.from(document.getElementById(coc).querySelectorAll("#"+coc+">div")) : (Array.from(document.querySelectorAll('#main > div')).slice(1))); //element structure differs depending on domain
    for (let i = superfluous.length-1; i > 0; i--){
        superfluous[i].style.display = sftoggle ? 'none' : '';
    }
    buttontoggle.style.color = sftoggle ? 'red' : '';
}

function buttpause(){
    pause = !pause;
    buttonpause.style.color = pause ? 'red' : '';
}

function buttreverse(){
    direction *= -1;
    buttonreverse.style.color = (direction != 1) ? 'red' : '';
}

function buttminus(){
    magnifylist(0.8);
}
function buttplus(){
    magnifylist(1.25);
}
function buttreset(){
    var reset = 1 / (getcontainer(document).style.zoom || 1);
    magnifylist(reset);
}
function buttdouble(){
    var double = 2 / (getcontainer(document).style.zoom || 1);
    magnifylist(double);
}

function magnifylist(mag){
    var oldtop = window.pageYOffset || document.documentElement.scrollTop;
    var oldbody = document.body.scrollHeight;
    var oldscrollpct = (oldtop - contentoffset) / (oldbody - contentoffset);
    var magtarget = getcontainer(document);
    magtarget.style.zoom = (magtarget.style.zoom || 1) * mag;
    magtarget.style.maxWidth = (magtarget.style.zoom != 1) ? '90%' : ''; //custom mmo addition
    var newbody = document.body.scrollHeight;
    var newtop = (newbody - contentoffset) * oldscrollpct + contentoffset;
    var left = window.pageXOffset || document.documentElement.scrollLeft;
    window.scrollTo(left,newtop);
}

// == auto pager customization ==

var pagename = 'page'; //string used in url for page counter
var firstpage = 1; //earliest page possible: usually 1, but sometimes 0
var apclocation = document.getElementById('listOffIndex'); //where to append auto page content

var coc = document.getElementById("contents") ? 'contents' : 'content'; //contents or content (different class name depending on domain)

function getlast(){ //obtain last page possible
    var saiko = document.querySelector('[title="最古"]');
    var output = getparam(saiko.href,pagename) || firstpage;
    return output;
}

function getcontainer(parent){ //obtain zooming target, container for posts&pager
    var output = parent.querySelector('#main');
    return output;
}

function getposts(parent){ //get posts
    if(coc=='contents'){
        var output = parent.querySelector('#'+coc).querySelector('ul');
    } else {
        var output = parent.querySelector('#'+coc).querySelector('table');
    }
    return output;
}

function getindex(parent){ //get index (page markers)
    var output = parent.querySelector('#listOffIndex');
    return output;
}

// == auto pager ==

var start = (getparam(document.URL,pagename)*1) || firstpage;
var initialstart = start;
var last = getlast();
var direction = 1;
var actionqueue = [];
var pagequeue = [];
var pause = false;

var autopagecontent = document.createElement('section');
autopagecontent.id = 'autopagecontent';
insertAfter(autopagecontent, apclocation);
var sessionname = document.URL;
var prevsessiondata = (JSON.parse(sessionStorage.getItem(sessionname)))||false;
if(prevsessiondata){
    autopagecontent.innerHTML += prevsessiondata[0];
    start = prevsessiondata[1];
    prevsessiondata = ""
}
var currentloaded = start;

console.log({start},{initialstart},{last},{currentloaded},{direction},{pause});

window.onbeforeunload = function() {
    if (autopagecontent.innerHTML){
        var data = [autopagecontent.innerHTML, currentloaded];
        sessionStorage.setItem(sessionname,JSON.stringify(data));
    }
}

document.onreadystatechange = function () {
    if (getparam(document.URL,pagename)){togglesupflu();}else{buttpause();}; //custom for mmo
    if (document.readyState == "complete" && document.body.scrollHeight <= window.innerHeight) {
        setTimeout(whattodo,50);
    }
}

window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 100) {
        setTimeout(whattodo,50);
    }
};

// == auto pager functions ==

function whattodo() {
    if (pause){
        return
    }
    playqueue();
    addtoqueue();
}

function addtoqueue(){
    start = start+direction;
    if( (start <= last) && (start >= firstpage) ){
        loadnewpage(start);
    } else {
        start = Math.min(last, Math.max(1,start));
    }
}

function loadnewpage(newstart) {
    if (newstart > last){return;}
    var nextpageurl = setparam(document.URL,pagename,newstart);
    console.log("nextpageurl: " +nextpageurl);
    var output = getHTML( nextpageurl, function( nextpagehtml ) {
        var htmldiv = document.createElement('div');
        htmldiv.innerHTML = nextpagehtml;
        var nextpageimages = getposts(htmldiv);
        var nextpageindex = getindex(htmldiv);
        nextpageimages.removeAttribute('id');
        nextpageindex.removeAttribute('id');
        nextpageimages.className = 'autoposts';
        nextpageindex.className = 'autoindex';
        var tempdiv = document.createElement("div");
        tempdiv.className = "autopage";
        tempdiv.appendChild(nextpageimages);
        tempdiv.appendChild(nextpageindex);
        actionqueue[(newstart-currentloaded)*direction-1] = tempdiv;
        pagequeue[(newstart-currentloaded)*direction-1] = newstart;
        console.log('page added to queue: ' + newstart);
        if((newstart-currentloaded)*direction-1 == 0)playqueue();
    },'html');
}

function playqueue(){
    var changedpage;
    while (actionqueue[0]){
        autopagecontent.appendChild(actionqueue.shift());
        currentloaded = pagequeue.shift();
        console.log("currentloaded: " + currentloaded);
        changedpage = true;
    }
}

// == general functions ==

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getHTML(link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

function getparam(url,param) {
    var tempArray = url.split("?");
    var additionalURL = tempArray[1];
    var paramvalue = "";
    if(additionalURL) {
        tempArray = additionalURL.split("&");
        for ( var i = 0; i < tempArray.length; i++ ){
            if(tempArray[i].indexOf(param) !== -1){
                paramvalue = tempArray[i].substr(param.length+1);
            }
        }
    }
    return paramvalue;
}

function setparam(url,param,newvalue) {
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    var present = false;
    if(additionalURL) {
        tempArray = additionalURL.split("&");
        for ( var i = 0; i < tempArray.length; i++ ){
            if(tempArray[i].indexOf(param) !== -1){
                tempArray[i] = param + "=" + newvalue;
                present = true;
            }
            newAdditionalURL += temp+tempArray[i];
            temp = "&";
        }
    }
    var finalURL = baseURL+"?"+newAdditionalURL;
    if (!present) {
        finalURL += temp + param + "=" +newvalue;
    }
    return finalURL;
}

function makebutton(buttonname,event,text,bottom,left){
    text = text || "";
    bottom = bottom || "0";
    left = left || "0";
    var tempbutton = document.createElement("input");
    tempbutton.type = "button";
    tempbutton.id = buttonname;
    tempbutton.value = text;
    tempbutton.style.position = "fixed";
    tempbutton.style.bottom = bottom;
    tempbutton.style.left = left;
    tempbutton.addEventListener("click",event);
    tempbutton.style.zIndex = 9999;
    document.body.appendChild(tempbutton);
    return tempbutton;
}