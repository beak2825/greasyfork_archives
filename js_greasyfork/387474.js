// ==UserScript==
// @name         thz
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://thz28.com/*
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387474/thz.user.js
// @updateURL https://update.greasyfork.org/scripts/387474/thz.meta.js
// ==/UserScript==

(function() {
    var url=window.location.href;
    if(url.indexOf("thz6")>1){
        ad();
 var str=$('#content')[0].innerText;
var strs= new Array(); //定义一数组
strs=str.split('发表于'); //字符分割

var s=strs[1];
var s1= new Array(); //定义一数组
s1=s.split('jpg'); //字符分割

console.log(s1.length);

for (i=0;i<=s1.length;i++)
{
   console.log(s1[i]+'jpg');

document.write('<center><img src='+s1[i]+'jpg'+'></img>'+'<p></center>'); //
}
    }




function ad(){
var str=$('center img');
for(i=0;i<str.length;i++){
str[i].outerHTML='';
}


var str=$('li.txt');
for(i=0;i<str.length;i++){
str[i].outerHTML='';
}

var str=$('table tr td a span');
for(i=0;i<str.length;i++){
str[i].outerHTML='';
}

var str=$('div.it618_firstad_flex');
for(i=0;i<str.length;i++){
str[i].outerHTML='';
}

var str=$("[style='text-align:center;']");
for(i=0;i<str.length;i++){
str[i].outerHTML='';
}

$("[src='static/image/common/ad_close.gif']").click();

$('p.attnm a')[0].outerHTML=$('p.attnm a')[0].outerHTML.replace('imc_attachad-ad.html?','forum.php?mod=attachment&');

//$('img.ex1').hide();
//$('#ad_corner_close').click();

}

})();