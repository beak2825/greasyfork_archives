// ==UserScript==
// @name            BSOJ tag 读取器
// @namespace       https://greasyfork.org/users/1265383
// @version         1.0.0.1
// @description     在 category 界面自动读取题目 note 里面的 tag，方便整理。
// @author          123asdf123(luogu 576074)
// @match           https://oj.bashu.com.cn/*/category.php
// @icon            https://oj.bashu.com.cn/favicon.ico
// @license         SATA
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/497420/BSOJ%20tag%20%E8%AF%BB%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/497420/BSOJ%20tag%20%E8%AF%BB%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==
let parser = new DOMParser(),cnt=1000,last=0,cat=document.querySelector(".problem-category"),bar=document.createElement("span"),ins=document.createElement("p"),tagname=[],tagdom=[];
function gettag(x){
    if(cnt<9999){
        cnt++;
        bar.style.width=(cnt-999)/9000*100+"%";
    }
    if(x=="Wrong Problem ID."){
        return;
    }
    let newdoc= parser.parseFromString(x, "text/html"),tag=newdoc.getElementById("user_tags");
    if(tag==null||tag.innerHTML.length==0){
        return;
    }
    console.log(tag.innerHTML);
    if(tagname[tag.innerHTML]==undefined){
        tagname[tag.innerHTML]=1;
        tagdom[tag.innerHTML]=document.createElement("a");
        tagdom[tag.innerHTML].setAttribute("href","search.php?q="+encodeURIComponent(tag.innerHTML));
        tagdom[tag.innerHTML].innerHTML="<span class=\"label label-info\">"+tag.innerHTML+"(1)</span>"
        ins.appendChild(tagdom[tag.innerHTML]);
    }
    else{
        tagname[tag.innerHTML]++;
        tagdom[tag.innerHTML].innerHTML="<span class=\"label label-info\">"+tag.innerHTML+"("+tagname[tag.innerHTML]+")</span>"
    }
}
let now=999;
function getans(){
    if(now==9999)
        return;
    now++;
    $.ajax({url:'problempage.php?problem_id='+now,success:function(a){gettag(a)}});
}
(function() {
    'use strict';
    bar.style="text-align: right;display:inline-block;width:0%;background-color:rgb(10,111,255);color:rgb(10,111,255)";
    bar.innerText="Loading...";
    cat.parentNode.appendChild(bar);
    ins.setAttribute("class","problem-category");
    bar.parentNode.appendChild(ins);
    setInterval(getans,1);
})();