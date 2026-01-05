// ==UserScript==
// @name        Mahnem+
// @description Adds link "messages" (in gold) to the profile of each user
// @namespace   http://vk.com/e_gold
// @include     http://*.mahnem.*/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25260/Mahnem%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/25260/Mahnem%2B.meta.js
// ==/UserScript==

//alert("GM Script is active!");

function RemoveElementById(id) {
  var elm = document.getElementById(id);
  if(elm) {
    elm.parentNode.removeChild(elm);
    return 1;
  }
  return 0;
}

function RemoveElementBySel(sel) {
  
  var elm = document.querySelector(sel);
  if(elm) {
    elm.parentNode.removeChild(elm);
    //elm.style.display="none";
    return 1;
  }
  else {
    ;//alert(sel + " not found");
  }
  return 0;
}

function ReRemoveElmBySel(sel) {
  var elm = document.querySelector(sel);
  var cnt = 0;
  while(elm) {
    elm.parentNode.removeChild(elm);
    cnt++;
    elm = document.querySelector(sel)
  }
  //alert(cnt+" elements with sel="+sel+"removed.");
}

//////////////////////////
var tr = document.querySelector("table.umenu tbody tr");
if(tr) {
  //find id of the current person
  var url=tr.children[0].children[0].href;
  var a=url.split("/");
  var id=a[a.length-1];
  //insert link
  var newtd=document.createElement("td");
  newtd.className="umenuoff";
  var newa=document.createElement("a");
  newa.className="umenuoff";
  newa.href="messages/"+id;
  newa.innerHTML="Messages";
  newa.style="background: gold;";
  newtd.appendChild(newa);
  //tr.appendChild(newtd);//at the end
  tr.insertBefore(newtd, tr.children[3]);
}
