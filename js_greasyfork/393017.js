// ==UserScript==
// @name         Historia Sily a obyvatelov zemky
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.darkelf.cz/login.asp*
// @match        https://www.darkelf.cz/l.asp*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/393017/Historia%20Sily%20a%20obyvatelov%20zemky.user.js
// @updateURL https://update.greasyfork.org/scripts/393017/Historia%20Sily%20a%20obyvatelov%20zemky.meta.js
// ==/UserScript==
var den;
var liga;
var thiswin = window;


'use strict';

// START OF LOGIN PAGE
function onReady() {
    if (this.readyState == 4 && this.status == 200) {
        var id = this.responseURL.substring(this.responseURL.search("=")+1);
        var a = new FileReader();
        a.readAsText(this.response,'windows-1250');
        a.onloadend = function(){
            var response = a.result;
            var pos = response.search("<tr><th class=\"br2\" colspan=\"2\">Ci");
            var dom = new DOMParser().parseFromString(response, 'text/html');
            var tds = dom.getElementsByTagName('td');
            if(tds.length==0)
            {
            return;
            }
            if(dom.getElementsByTagName('td')[1].childNodes.length == 1)
            {
            vladca = ""; //neutralka
            }else
            {
            var vladca = dom.getElementsByTagName('td')[1].childNodes[1].innerText;
            }
            var meno_zeme = response.substring(pos+47,pos+70);
            var end_pos = meno_zeme.search("<");
            meno_zeme = meno_zeme.substring(0,end_pos);


            if(id==512)
            {
                thiswin.alert("Skoncil som pravdepodobne");
            }

            if(meno_zeme){

                pos = response.search("vojska")+58;
                var vojsko = parseInt(response.substr(pos,6));

                if(isNaN(vojsko))
                {
                    vojsko = dom.getElementsByTagName('td')[9].childNodes[3].innerText;
                }
                //console.log(vojsko);



                var string_od_vojska = response.substring(pos);

                pos = string_od_vojska.search("span")+27;
                var string_od_obyvatelstva = string_od_vojska.substring(pos);
                end_pos = string_od_obyvatelstva.search("<");
                var obyv = string_od_obyvatelstva.substr(0,end_pos);
                if(obyv.length>5)
                {
                    obyv="?";
                }
                console.log(obyv);


                pos = response.search("tok o s");

                var potrebny_utok;
                if(pos!=-1)
                {
                    var string_od_tokos = response.substring(pos);
                    pos = string_od_tokos.search(">")+1;

                    var treba_utok = parseInt(string_od_tokos.substring(pos));

                    potrebny_utok=", "+treba_utok+ " potrebny utok";
                }
                else
                {
                    potrebny_utok="";
                }





                var info =den+". den, "+ vojsko + " vojsko,"+obyv+" obyvatelstva"+potrebny_utok+" "+ vladca;


                var key = id+"do"+liga;
                var old_info = GM_getValue(key);
                var new_info = old_info? info+"<br>"+old_info:info;

                GM_setValue(key, new_info);
            }
        }}
}
//START OF SCRIPT
if(document.URL.match("https://www.darkelf.cz/login.asp.*"))
    //if(document.URL == "https://www.darkelf.cz/login.asp")
{
    var zNode = document.createElement ('div');
    document.getElementsByTagName('body')[0].appendChild(zNode);
    var ulozAktualnyDenButton = document.createElement('button');
    ulozAktualnyDenButton.innerHTML='Uloz aktualny den';
    ulozAktualnyDenButton.onclick=function(){
        for (var i = 1; i < 513; i++) {//513 predtym
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = onReady;
            var url = "https://www.darkelf.cz/l.asp?id="+i;
            xhttp.open("GET",url);
            xhttp.responseType = 'blob';
            xhttp.send();

        }
    }
    var zmazLiguButton= document.createElement('button');
    zmazLiguButton.innerHTML='Zmaz zadanu ligu';
    zmazLiguButton.onclick=function(){
        for (var i = 1; i < 513; i++) {//513 predtym
            var key = i+"do"+inputNaMazanieLigy.value;
            GM_setValue(key, "");
            if(i==512)
            {
                thiswin.alert("Skoncil som urcite");
            }
        }
    }

    var inputNaMazanieLigy=document.createElement('input');
    inputNaMazanieLigy.setAttribute("type","text")
    inputNaMazanieLigy.setAttribute("placeholder","Meno ligy na zmazanie")
    zNode.appendChild(inputNaMazanieLigy);

    zNode.appendChild(ulozAktualnyDenButton);
    zNode.appendChild(zmazLiguButton);

    var spans = document.getElementsByTagName("span");
    den = spans[3].innerHTML;
    liga = spans[2].innerHTML;
    GM_setValue("aktualnyDen",den);
    GM_setValue("aktualnaLiga",liga);


}
//END OF LOGIN PAGE
//START OF showing data
else
{
    var id = document.URL.substring(document.URL.search("=")+1);
    liga = GM_getValue("aktualnaLiga",true);
    var key = id+"do"+liga;
    var value = GM_getValue(key);
    if(value!=undefined)
    {
        console.log(value);
        var tdNode = document.createElement('td');
        tdNode.innerHTML=value;
        document.getElementsByTagName('body')[0].appendChild(tdNode);
    }
}

















