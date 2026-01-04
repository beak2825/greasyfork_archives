// ==UserScript==
// @name         Scratch Toplam İzlenme Sayacı - @ygnJavascript
// @namespace    none
// @version      1.1
// @description  Türkçe Scratch istatistik gösterici.
// @author       YGN
// @match        *://scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423170/Scratch%20Toplam%20%C4%B0zlenme%20Sayac%C4%B1%20-%20%40ygnJavascript.user.js
// @updateURL https://update.greasyfork.org/scripts/423170/Scratch%20Toplam%20%C4%B0zlenme%20Sayac%C4%B1%20-%20%40ygnJavascript.meta.js
// ==/UserScript==

//Bir Scratch kullanıcısının profil sayfasına girmeniz yeterli.

var w=window,d=document,i,getstats,allview=0,url,duzenlisayi,name,xmlhttp,projects,ygn=(x)=>{return x[0] == "#"?document.querySelector(x):x.indexOf(" ")!=-1?document.getElementsByClassName(x.split(".")[1]):document.querySelectorAll(x)};
w.onload=()=>{
    xmlhttp=new XMLHttpRequest();
    name = document.querySelector("h2").innerText;
    console.log(name);
    url="https://api.scratch.mit.edu/users/"+name+"/projects";
    xmlhttp.onreadystatechange=function(){
        if(this.readyState==4&&this.status==200){
            projects=JSON.parse(this.responseText);
            for(i in projects){
                allview=allview+parseInt(projects[i].stats.views);
            }
            duzenlisayi = allview.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1.');
            document.querySelector("h2").innerHTML+='&nbsp;&nbsp; - &nbsp;&nbsp;<font style="color:lightblue;font-size:13px;font-weight:bold;">Toplam <font style="color:lightgreen;">'+duzenlisayi+'</font> izlenme</font>';
        }
    };
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}
//http://yazilimcity.net/ sitesine teşekkürler.