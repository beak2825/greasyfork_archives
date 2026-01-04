// ==UserScript==
// @name         View Copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.com/*/product-reviews/*
// @match        https://www.amazon.com/product-reviews/*
//@require https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412042/View%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/412042/View%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".review .review-date").click(function(){

 getReviwData(this.parentNode)
});  ;



    // Your code here...
})();

function execCoy(text) {

    const input = document.createElement('INPUT');
    input.style.opacity  = 0;
    input.style.position = 'absolute';
    input.style.left = '-100000px';
    document.body.appendChild(input);

    input.value = text;
    input.select();
    input.setSelectionRange(0, text.length);
    document.execCommand('copy');
    document.body.removeChild(input);
    return true;
}
function getReviwData(node){

let name=node.querySelector(".a-profile-name").innerText;
    console.log(name)
let title=node.querySelector(".review-title").innerText;
     console.log(title)
let content=node.querySelector(".review-text-content").innerText;
       console.log(content)
let review_link=window.location.host+node.querySelector(".review-title").getAttribute("href");
     console.log(review_link)
let profile=window.location.host+node.querySelector(".a-profile").getAttribute("href");
     console.log( profile)

    let all=name+'\t'+title+'\t'+content+'\t'+profile+'\t'+review_link;
     execCoy(all)
    console.log("copyed")
     toast()



}

function  Creat(){
    var tips='<div id="'+"myid"+'" style="width: 100px;height: 40px;background-color: rgb(76, 76, 76);border-radius: 2px;position: fixed;left: 50%;top:300px;transform:-50%;text-align:center;line-height:40px;color:white; z-index: 9999;"><div style="opacity: 1;">'+"复制完成"+'</div></div>';
    $('body').append(tips);

}
function  Remove(){
    var a=  $('body')[0];
    a.removeChild(document.getElementById("myid"));


}
function  toast(){
    Creat();
    setTimeout(Remove,800);
}