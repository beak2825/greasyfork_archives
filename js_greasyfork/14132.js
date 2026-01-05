// ==UserScript==
// @name         LifeCLIPS page title Chenger
// @namespace    https://lifeclips.jp/users/1174
// @version      1.8
// @description  Chenge page title in LifeCLIPS. / LifeCLIPSのページタイトルをわかりやすく。
// @author       nightjar
// @grant        none
// @homepage    https://greasyfork.org/scripts/14132
// @include    https://lifeclips.jp*
// @downloadURL https://update.greasyfork.org/scripts/14132/LifeCLIPS%20page%20title%20Chenger.user.js
// @updateURL https://update.greasyfork.org/scripts/14132/LifeCLIPS%20page%20title%20Chenger.meta.js
// ==/UserScript==

(function(){
    var title = document.getElementById("article-title");
    var user = document.getElementsByClassName("new_name");
    var clipper = document.getElementsByClassName("name");
    var feed = document.getElementById("new1");
    var newest = document.getElementsByClassName("current");
    var hot = document.getElementById("hot1");
    var label = document.getElementsByClassName("lbl-title");
    var post = document.getElementById("post_clips");
    var edit = document.getElementById("title_write");

    if(document.URL.match("/edit")){
        document.title =("edit | " + edit.innerHTML);}
    if(document.URL.match(/clips\/\d+/)){
        document.title =(title.innerHTML+' | '+clipper[0].innerHTML);}
    if(document.URL.match(/clips\/new/)){
        document.title =(post.innerHTML);}
    if(document.URL.match("users")){
        document.title =(getText(getTd(0,0,0)));}
    if(document.URL.match(/lifeclips\.jp.$/)){
        document.title = (feed.innerHTML);}  
    if(document.URL.match("newest")){
        document.title = (newest[0].innerHTML);}
    if(document.URL.match("ranking")){
        document.title = (hot.innerHTML);}
    else{
        document.title = (label[0].innerHTML);}
})();
function getTd(i,j,k){
    var table=document.getElementsByTagName("TABLE").item(i);
    var tbody=table.getElementsByTagName("TBODY").item(0);
    var tr=tbody.getElementsByTagName("TR").item(j);
    return tr.getElementsByTagName("TD").item(k);}
function getText(e){
    if(e===null)return e;
    if(e.nodeName=="#text")return e.nodeValue;
    return getText(e.firstChild);}

