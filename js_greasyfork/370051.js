// ==UserScript==
// @name         New Userscript5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       kuzya
// @match        http://www.heroeswm.ru/bselect.php?all=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370051/New%20Userscript5.user.js
// @updateURL https://update.greasyfork.org/scripts/370051/New%20Userscript5.meta.js
// ==/UserScript==

var per1="";
var per2="";
var per3="",per4="",per5="",per6="",per7="",per8="",per9="",per10="",per11="",per12="",per13="",per14="",per15="";
var ray="";
var ray2="";
var str2 = "";
var str3="";
var elements = document.getElementsByTagName('td');
var str = elements[elements.length-1].innerHTML;
var ish = str;
var plId = document.querySelector("li > a[href^='pl_hunter_stat.php']").getAttribute("href").split("id=")[1];
elements[elements.length-2].innerHTML += "<label><input type='checkbox' id='but'/> Перехваты</label>";
var but = document.getElementById("but");

function sendGETRequest(url, mimeType, callback){ // Универсалка для отправки GET-запроса к url с выставлением заданного MIME Type и исполнением функции callback при получении ответа
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        if (typeof mimeType === "string"){
            xhr.overrideMimeType(mimeType);
        }

        if (typeof callback === "function"){
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    callback.apply(xhr);
                }
            };
        }

        xhr.send();
    }


function pliz(i,b){
        sendGETRequest("pl_info.php?id=" + i, "text/html; charset=windows-1251", function(){
  var
                taskNumberArr = this.responseText.match(/Район:<\/b>\s<a\shref=\Smap\.php\?cx=\d\d&cy=\d\d\S>(\S*\s\w*)</),
                taskNumber = (taskNumberArr !== null) ? taskNumberArr[1] : "";
                ray += b + taskNumber + " " + i + "<br>";

                 if (b == 1) {per1 += taskNumber + "<br>";}
                 if (b == 2) {per2 += taskNumber + "<br>";}
                 if (b == 3) {per3 += taskNumber + "<br>";}
                 if (b == 4) {per4 += taskNumber + "<br>";}
                 if (b == 5) {per5 += taskNumber + "<br>";}
                 if (b == 6) {per6 += taskNumber + "<br>";}
                 if (b == 7) {per7 += taskNumber + "<br>";}
                 if (b == 8) {per8 += taskNumber + "<br>";}
                 if (b == 9) {per9 += taskNumber + "<br>";}
                             if (b == 10) {per10 += taskNumber + "<br>";}
                             if (b == 11) {per11 += taskNumber + "<br>";}
                             if (b == 12) {per12 += taskNumber + "<br>";}
                             if (b == 13) {per13 += taskNumber + "<br>";}
                             if (b == 14) {per14 += taskNumber + "<br>";}
                             if (b == 15) {per15 += taskNumber + "<br>";}
});
}


function symma(a,b){
     //a += b;
    ray2 = per1+per2+per3+per4+per5+per6+per7+per8+per9+per10+per11+per12+per13+per14+per15;
    var arr = a.split('<br>');
    var arr2 = ray2.split('<br>');
    elements[elements.length-1].innerHTML = "";
for (var i = 0; i < arr.length-1; i++) {
      //alert(arr[i] + arr[i+(arr.length-1)/2]);

      elements[elements.length-1].innerHTML += (arr[i]) + " — <b>" + (arr2[i]) + "</b><br>";

      //elements[elements.length-1].innerHTML (arr[i] + " — <b>" + arr2[i] + "</b><br>";
}


}

var result;
var result2;
var result3;
var regexp = /τ/gi;
var regexp2 = /<br>/gi;
var regexp3 = /class/gi;
var id="";
while (result = regexp.exec(str)) {

regexp2.lastIndex = result.index;
regexp3.lastIndex = result.index;
result2 = regexp2.exec(str)
result3 = regexp3.exec(str)


    for (i = result.index+35; i < result3.index-2; i++)
    {

    id += str[i];

    }



    for (var i = result.index-51; i < result2.index+4; i++)
    {

    str2+=str[i];

    }
    //str2+=id +"<br>";
    //pliz(id);


    id+=" ";





}


var iarr;
iarr = id.split(" ");
for (i=0;i<iarr.length-1;i++)
{
pliz(iarr[i],i+1+" ");
}

but.onclick = function() {

    if (but.checked == true) {

symma(str2,ray);

    }

else
{
elements[elements.length-1].innerHTML = ish;
}

}


