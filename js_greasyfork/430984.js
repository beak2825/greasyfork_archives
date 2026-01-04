// ==UserScript==
// @name        巴哈文章快速預覽
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  方便刷廢文
// @author       You
// @match        https://forum.gamer.com.tw/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430984/%E5%B7%B4%E5%93%88%E6%96%87%E7%AB%A0%E5%BF%AB%E9%80%9F%E9%A0%90%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430984/%E5%B7%B4%E5%93%88%E6%96%87%E7%AB%A0%E5%BF%AB%E9%80%9F%E9%A0%90%E8%A6%BD.meta.js
// ==/UserScript==
//抓捲軸位置
        window.addEventListener("scroll", function(event) {
            var scroll_y = this.scrollY;
            var scroll_x = this.scrollX;place=scroll_y;
            console.log(scroll_x, scroll_y);
            + scroll_x + "Y-axis : " + scroll_y
        });
let place;
let c=document.createElement("input")
document.body.append(c)
c.setAttribute("style","width: 100%; padding: 0px; border: none; margin: -0.0625em 0px 0px; height: 1.25em; outline: none; background: text-indent: 48px;")
c.style.top="92%";
c.style.height="25px";
c.style.zIndex="9999";
c.style.position="fixed";
c.style.backgroundColor="black";
c.style.opacity="0.3";
c.style.left="395px";
c.style.width="150px";

let m=document.createElement("button");
document.body.append(m);
m.innerText="預覽文章";
m.style.top="96%";
m.style.position="fixed";
m.addEventListener('click', function() {g();});
m.style.left="395px";
m.style.opacity="0.5";
m.style.borderRadius="5px";
m.style.border="1px solid";
m.style.padding="3px";
m.style.width="150px";
//===============================
let z=document.querySelectorAll("#d");
let url;

function g(){if (c.value!=""){
url=c.value;z=document.querySelectorAll("#d");
url=url.split("/")[url.split("/").length-1];
c.value="";get();if (z!=undefined){for (let i=0;i<z.length;i++){
z[i].remove();}
}}}
//======================
function get(){
//上面要開始做網址
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {

let parser = new DOMParser();
var doc = parser.parseFromString(xhr.responseText, "text/html");
let a=doc.querySelector("#BH-wrapper").querySelectorAll("article");

let d=document.createElement("div");
d.id="d";
let dheader=document.createElement("div");
document.body.append(d);
dheader.id="dheader";
dheader.innerText="預覽模式(點此可移動)";
d.append(dheader);



for (let i=0;i<a.length;i++){
let l=new Array();
l[i]=document.createElement("li");
l[i].innerText=a[i].innerText;
d.append(l[i]);
}

d.style.height="550px";
d.style.fontSize="12.5px";
d.style.backgroundColor="black";
d.style.color="white";
d.style.opacity="0.75";d.style.top=place+76+"px";
d.style.position="absolute";d.style.left="500px";
d.style.zIndex="9999";
dheader.style.backgroundColor="red";
d.style.overflow="auto";
dheader.style.height="15px";
dheader.style.fontSize="15px";
dheader.style.textAlign="center";
d.style.fontFamily="Microsoft JhengHei"
dheader.style.fontFamily="Microsoft JhengHei"


dragElement(document.getElementById("d"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


    }
}
xhr.open('GET',url, true);
xhr.send(null);
}
//======================
//下面是把拖的把柄丟到左邊

/*
dheader.style.float="left"
;dheader.style.height="999999px";dheader.style.border="1px solid white";dheader.style.width="10px"
*/