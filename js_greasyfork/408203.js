// ==UserScript==
// @name         GPFilter
// @namespace    http://tampermonkey.net/
// @version      2.8
// @license MIT
// @description  filter for search on gdepapa.ru
// @author       scurra_ru
// @match        https://gdepapa.ru/poisk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408203/GPFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/408203/GPFilter.meta.js
// ==/UserScript==

var ahref = '';
var filterOn = localStorage.getItem("GP_filteron");
var elemsf = 0;
var acceptURL = "";
var xhr = createXRO();
var next20 = 0;
var anext20 = 0;
var cityid = 0;
var regexc1 = /(<div class=\"userslist_line pm10\">)(.+)(?=<div class=\"mb3 pm10\">)/gsm;
var regexc0 = /(<div class=\"userslist_line pm10\">)(.+)(?=<div>\s*<div class=\"pm10 mb3\">)/gsm;
var bgfavf = "#fff8f8";
var bgfavm = "#e0ffff";

function createXRO(){
    var xmlHttp;
    try{
	    xmlHttp = new XMLHttpRequest();
    }
    catch(e){
	    var XmlHttpVersions = new Array("MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP");
	    for (var i=0; i<XmlHttpVersions.length && !xmlHttp; i++){
            try{
		        xmlHttp = new ActiveXObject(XmlHttpVersions[i]);
            }
            catch(e){
            }
        }
    }
    if (!xmlHttp){
        alert("Ошибка создания объекта XMLHttpRequest.");
    }
    else{
        return xmlHttp;
    }
}

function qqq(){
    if (xhr){
        if (xhr.readyState == 4 || xhr.readyState === 0){
            xhr.open("GET", ahref.slice(7), true);
		    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Content-Type", "no-cache");
		    xhr.onreadystatechange = xhrAccept();
		    xhr.send();
        }
    }
}

function xhrAccept(){
    if (xhr.readyState == 4){
	    if (xhr.status == 200){
            readlist();
        }
        else{
            setTimeout(xhrAccept, 1000);
        }
    }
    else{
        setTimeout(xhrAccept, 1000);
    }
}
function ссс(){
    var usrId = this.getAttribute("title");
    localStorage.setItem("GP_user_"+usrId, "0");
    localStorage.setItem("GP_user_fav_"+usrId, "0");
    this.setAttribute("style", "cursor: pointer; background: url(/images8/like.svg) no-repeat 5px 6px / 18px 18px;");
    this.removeChild(this.firstChild);
    let elemText = document.createTextNode("В Избранное");
    this.appendChild(elemText);
    this.onclick = ggg;
    this.parentNode.parentNode.style.backgroundColor = "#ffffff";
    return 0;
}

function bbb(){
    var usrId = this.getAttribute("title");
    localStorage.setItem("GP_user_"+usrId, "1");
    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    return 0;
}

function aaa(){
    var fstate = localStorage.getItem("GP_filteron");
    if (fstate == 1) {
        localStorage.setItem("GP_filteron", "0");
        this.removeAttribute("checked");
    }
    else {
        localStorage.setItem("GP_filteron", "1");
        this.setAttribute("checked", true);
    }
    return 0;
}

function hhh(){
    var usrId = this.getAttribute("title");
    localStorage.setItem("GP_user_fav_"+usrId, "0");
    this.setAttribute("style", "cursor: pointer; background: url(/images8/like.svg) no-repeat 5px 6px / 18px 18px;");
    this.removeChild(this.firstChild);
    let elemText = document.createTextNode("В Избранное");
    this.appendChild(elemText);
    this.onclick = ggg;
    this.parentNode.parentNode.style.backgroundColor = "#ffffff";
    return 0;
}

function ggg(){
    var usrId = this.getAttribute("title");
    localStorage.setItem("GP_user_fav_"+usrId, "1");
    this.setAttribute("style", "cursor: pointer; background: url(/images8/delete.svg) no-repeat 5px 6px / 18px 18px;");
    this.removeChild(this.firstChild);
    let elemText = document.createTextNode("Удалить");
    this.appendChild(elemText);
    this.onclick = hhh;
    if (document.location.search.includes("category=1")){
        this.parentNode.parentNode.style.backgroundColor = bgfavf;
    }
    if (document.location.search.includes("category=2")){
        this.parentNode.parentNode.style.backgroundColor = bgfavm;
    }
    return 0;
}


function readlist(){
    next20 = document.querySelector(".next_page.pm10");
    var response = xhr.responseText;
    var append = "";
    if (cityid == 1){
        append = response.match(regexc1);
    }
    else{
        append = response.match(regexc0);
    }
    next20.insertAdjacentHTML("beforebegin",append);
    next20.remove();
    var pages = document.querySelectorAll(".pages.pm10");
    var pages2 = pages[1].cloneNode(true);
    pages[0].before(pages2);
    pages[0].remove();
    pages[2].remove();
    change_href();
    recreate();
}

function recreate(){
    var usrID = [];
    var uID;
    var state;
    var elem;
    var elem1;
    var elem2;
    var elemText;
    var elements = document.querySelectorAll(".userslist_line.pm10");
    if (filterOn === null || filterOn === "0") {
        elements.forEach( function(lasttdTd){
            if (lasttdTd.querySelector("span") !== null) return;
            elem = lasttdTd.querySelector("a.sendmsg_lst");
            uID = elem.getAttribute('href');
            usrID = uID.split("=");
            elem = lasttdTd.parentNode;
            state = localStorage.getItem("GP_user_"+usrID[1]);
            if (state == 1) {
                elem1 = document.createElement("span");
                elem1.classList.add("sendmsg_lst");
                elem1.setAttribute("style", "cursor: pointer; background: url(/images8/arrow-up.svg) no-repeat 0 4px / 18px 18px;");
                elem1.setAttribute("title", usrID[1]);
                elemText = document.createTextNode("Восстановить");
                elem1.appendChild(elemText);
                lasttdTd.lastElementChild.appendChild(elem1);
                elem1.onclick = ссс;
            }
        });
    }
    else {
        elements.forEach( function(lasttdTd){
            if (lasttdTd.querySelector("span") !== null) return;
            elem = lasttdTd.querySelector("a.sendmsg_lst");
            uID = elem.getAttribute('href');
            usrID = uID.split("=");
            elem = lasttdTd;
            state = localStorage.getItem("GP_user_"+usrID[1]);
            if (state == 1) {
                elem.parentNode.removeChild(elem);
            }
            else {
                elem1 = document.createElement("span");
                elem1.classList.add("sendmsg_lst");
                elem1.setAttribute("style", "cursor: pointer; background: url(/images8/stop.svg) no-repeat 5px 6px / 18px 18px;");
                elem1.setAttribute("title", usrID[1]);
                elemText = document.createTextNode("Скрыть");
                elem1.appendChild(elemText);
                lasttdTd.lastElementChild.appendChild(elem1);
                elem1.onclick = bbb;
            }
        });
    }
    elements.forEach( function(lasttdTd){
        elem = lasttdTd.querySelector("a.sendmsg_lst");
        uID = elem.getAttribute('href');
        usrID = uID.split("=");
        elem = lasttdTd;
        state = localStorage.getItem("GP_user_fav_"+usrID[1]);
        elem2 = lasttdTd.querySelectorAll("span.sendmsg_lst");
        if ((elem2.length > 1 && filterOn === "1") || (elem2.length > 0 && (filterOn === null || filterOn === "0"))) return;
        if (state == 1) {
            elem1 = document.createElement("span");
            elem1.classList.add("sendmsg_lst");
            elem1.setAttribute("style", "cursor: pointer; background: url(/images8/delete.svg) no-repeat 5px 6px / 18px 18px;");
            elem1.setAttribute("title", usrID[1]);
            elemText = document.createTextNode("Удалить");
            elem1.appendChild(elemText);
            lasttdTd.lastElementChild.appendChild(elem1);
            elem1.onclick = hhh;
            if (document.location.search.includes("category=1")){
                elem1.parentNode.parentNode.style.backgroundColor = bgfavf;
            }
            if (document.location.search.includes("category=2")){
                elem1.parentNode.parentNode.style.backgroundColor = bgfavm;
            }
        }
        else {
            elem1 = document.createElement("span");
            elem1.classList.add("sendmsg_lst");
            elem1.setAttribute("style", "cursor: pointer; background: url(/images8/like.svg) no-repeat 5px 6px / 18px 18px;");
            elem1.setAttribute("title", usrID[1]);
            elemText = document.createTextNode("В Избранное");
            elem1.appendChild(elemText);
            lasttdTd.lastElementChild.appendChild(elem1);
            elem1.onclick = ggg;
        }
    });
}

function change_href(){
    if ((next20 = document.querySelector(".next_page.pm10")) !== null){
        anext20 = next20.firstElementChild;
        ahref = anext20.getAttribute('href');
        if (ahref.includes("int_city_id=0")){
            cityid = 0;
        }
        else{
            cityid = 1;
        }
        anext20.removeAttribute('href');
        anext20.onclick=qqq;
    }
}

window.onload = function() {
    change_href();
    var elemf = document.getElementById("hdn_search");
    if (elemf === null) elemf = document.querySelector(".mb2");
    var elemff = elemf.firstElementChild.firstElementChild.childNodes[elemf.firstElementChild.firstElementChild.childNodes.length - 6].cloneNode(true);
    elemsf = elemff.querySelector("input");
    elemsf.setAttribute("name", "filter");
    var elemsl = elemff.querySelector("label");
    elemsl.innerHTML = " Фильтр";
    elemsl.insertBefore(elemsf, elemsl.firstChild);
    elemf.firstElementChild.firstElementChild.lastElementChild.after(elemff);
        if (filterOn === null || filterOn === "0") {
            filterOn = "0";
            localStorage.setItem("GP_filteron", "0");
            elemsf.removeAttribute("checked");
        }
        else {
            filterOn = "1";
            localStorage.setItem("GP_filteron", "1");
            elemsf.setAttribute("checked", "true");
        }
    elemsf.onclick = aaa;
    recreate();
}