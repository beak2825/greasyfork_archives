// ==UserScript==
// @name		relanium
// @namespace		http://www.wykop.pl/ludzie/wytrzzeszcz/
// @description		usuniecie tagow
// @author		wytrzeszcz
// @version		0.9
// @grant		none
// @include		http://www.wykop.pl/*
// @include		https://www.wykop.pl/*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/39849/relanium.user.js
// @updateURL https://update.greasyfork.org/scripts/39849/relanium.meta.js
// ==/UserScript==
(function() {
 var inWork=false;
 const relanium_run= function()
 {
     inWork=true;
     console.log("Reaniyum:run");
     if(localStorage.getItem("relanium")==1)relanium_hide();
     else relanium_show();
     inWork=false;
 };



const relanium_hide= function()
{
    var pat=new RegExp("wykop.pl/tag/");
	var entrys=document.getElementsByClassName("entry");
    Array.prototype.forEach.call(entrys, function(el){
    if (pat.test(el.getElementsByTagName("div")[0].innerHTML)) el.style.display="none";});
};

const relanium_show= function()
{
    var pat=new RegExp("wykop.pl/tag/");
	var entrys=document.getElementsByClassName("entry");
    Array.prototype.forEach.call(entrys, function(el){
    if (pat.test(el.getElementsByTagName("div")[0].innerHTML)) el.style.display="block";});
};


const relanium_preper= function(){

var relanium_active="https://www.wykop.pl/cdn/c3201142/comment_8e9RZcTxgyltQnqjuW23rASgR7IkIzyd.jpg";
var relanium_pasive="https://www.wykop.pl/cdn/c3201142/comment_aKehHX4vBJPPtjWnQDYStHE7ZXthb6fI.jpg";
var relanium=document.createElement("img");
var relanium_li=document.createElement("li");
relanium_li.appendChild(relanium);
relanium.id="relanium";
if(localStorage.getItem("relanium")==1) relanium.src=relanium_active;
else relanium.src=relanium_pasive;

relanium.onclick =function(){
var pat=new RegExp("wykop.pl/tag/");
var entrys=document.getElementsByClassName("entry");
if(localStorage.getItem("relanium")==1) 
{
	localStorage.setItem("relanium", 0);
	var img=document.getElementById("relanium");
	img.src=relanium_pasive;
	relanium_show();
}
else 
{
	localStorage.setItem("relanium", 1);
	img=document.getElementById("relanium");
	img.src=relanium_active;
	relanium_hide();
}
};

$('#nav .mainnav .d-logout').before(relanium_li);
};
       var observer = new MutationObserver(function(mutation){
          var sum=0;
       mutation.forEach(function(el,index){sum=sum+el.addedNodes.length;});
            if(sum>0)relanium_run();});
	$(document).ready(function(){
	  relanium_preper();

        var config = { attributes: true, childList: true,subtree:true };
        console.log(document.getElementById("itemsStream"));//content
      observer.observe(document.getElementById("itemsStream"),config);
      relanium_run();
	});



})();