// ==UserScript==
// @name         Workforce Rate
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       NOWARATN
// @match        https://ktw1-portal.amazon.com/gp/picking/workforce*
// @match        https://ktw1-portal.amazon.com/gp/picking/reports/byPicker.html*
// @match        https://picking-nexus.dub.amazon.com/KTW1/Workforce*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/374255/Workforce%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/374255/Workforce%20Rate.meta.js
// ==/UserScript==

var picker = {};
var rate2 = {};
var str;
var str2;
var i = 0;
var j = 0;
var z = 0;
var l = 0;
var a = 0;
var rate = "0";
var lista;
var q = 0;
var rejtu;
var tempu = "";
var jakdlugalista = 0;
GM.setValue("rate","");
var $ = window.jQuery;

function prepareFrame() {
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", "http://google.com/");
    ifrm.setAttribute("id", "frejm");
    ifrm.style.width = "800px";
    ifrm.style.height = "400px";
    document.body.appendChild(ifrm);
}

var temp2;
var temp3;

// Strona z konkretnym pickerem
    if(window.location.href.indexOf("https://ktw1-portal.amazon.com/gp/picking/reports/byPicker.html?emplId=") > -1)
    {
        temp2 = document.getElementsByClassName("sorttop");
        temp3 = temp2[0].innerHTML.split("<td>");
        rate = temp3[6].replace(/\s/g,'');
        rate = rate.replace("</td>","");
    //    console.log(rate);
        if(rate.length >3) rate = "x";
        GM.setValue("rate", window.location.href + ";" + rate + ";");
    }

setTimeout(function() {


    // iFrame lista pickerów
if(window.location.href.indexOf("picking-nexus.dub.amazon.com/KTW1/Workforce") > -1)
        {
            prepareFrame(); // Tworzymy na końcu frame z pojedynczym pickerem

            lista = document.getElementsByClassName("sorting_1");
           // jakdlugalista = lista.length;

            console.log(document.getElementById("ajaxTable"));
            setInterval(function(){
                var temp = lista[z].innerHTML;
                console.log(lista[z]);
                picker[z] = temp.substring(temp.indexOf('href="')+6,temp.indexOf('">'));
             //   console.log(picker[z]);
                document.getElementById("frejm").setAttribute("src",picker[z]);
                z=z+1;
            },2000);
        }



// Dodanie rejtów na strone główną
if(window.location.href.indexOf("picking-nexus.dub.amazon.com/KTW1/Workforce") > -1)
{
//     setTimeout(async function(){
//         for(var a = 0;a< lista.length;a++)
//         {
//             rate2[a] = await GM.getValue("rate"+a);
//         }

//         for(a = 0;a< lista.length;a++)
//         {
//             console.log(rate[a]);
//         }
//     },4000);


document.getElementById("ajaxTable").innerHTML = document.getElementById("ajaxTable").innerHTML.replace("User ID<b> </b></th>"," User ID<b> </b></th><th id=\"rate\" class=\"sorting\" tabindex=\"0\" aria-controls=\"ajaxTable\" rowspan=\"1\" colspan=\"1\" style=\"width: 50px;\" >Rate<b> </b></th>");

    setInterval(async function() {
        var tempu3 = "";
        var tempu4 = "";
        var n = 0;
        var login = "";
        if(!tempu.includes(await GM.getValue("rate")))
        {
        tempu = tempu + await GM.getValue("rate");

            ///
            tempu3 = await GM.getValue("rate");
            tempu4 = tempu3.split(";");
            n = tempu4[0].indexOf("=");
            login = tempu4[0].slice(n+1,tempu4[0].length);


            // User ID<b> </b></th>

            document.getElementById("ajaxTable").innerHTML = document.getElementById("ajaxTable").innerHTML.replace(login + "</a></td>", login + "</a></td><td>" + tempu4[1] + "</td>");

                //aleksmaj</a></td>
//             if(lista[a].innerHTML.includes(login))
//                {
//                    lista[a].innerHTML = "<a href=\"" + tempu4[0] + "\">" + login + "</a></td><td>" + tempu4[1] + "</td>";
//                }

//                 if(lista[a+1].innerHTML.includes(login))
//                 {
//                     a=a+1;
//                     lista[a].innerHTML = "<a href=\"" + tempu4[0] + "\">" + login + "</a> " + tempu4[1] + "</td>";
//                 }
//             else
//             {
//                 lista[a].innerHTML = "<a href=\"" + tempu4[0] + "\">" + login + "</a> " + tempu4[1] + "</td>";
//             }

            a=a+1;
//         var temp2 = lista[a].innerHTML;
//         lista[a].innerHTML = temp2 + await GM.getValue("rate");

       // console.log(tempu);

//             if(z>=jakdlugalista)
//             {
//                var tempu2 = tempu.split(";");
//                 for(a = 0;a<=tempu2.length;a++)
//                 {
//                  lista[a].innerHTML = "<a href=\"" + tempu2[a] + "\">" + tempu2[a+1];
//                 }
//             }
        }
    },50);




//     setInterval(async function() {
//         for (j ; j < lista.length ; j++)
//         {
//           //  var rejt = await GM.getValue("rate");
//             var temp = lista[j].innerHTML;
//           //  console.log("temp: " + temp);
//          //   console.log("rejt: " + rejt);
//             if(temp.includes(rejt.substr(0,rejt.length-3)))
//             {
//             lista[j].innerHTML = temp + " " + rejt;
//             //GM.setValue("rate"+j, "x");
//             }
//         }
//     },500);
}
},5000);