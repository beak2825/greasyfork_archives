// ==UserScript==
// @name         AFTLite OB Dashboard
// @namespace    https://aftlite-na.amazon.com/outbound_dashboard
// @version      1.9
// @description  changes aftlite outbound dashboard to make it easier for assoicates to understand the board and align with slam time
// @author       cpatters
// @match        https://aftlite-na.amazon.com/outbound_dashboard*
// @downloadURL https://update.greasyfork.org/scripts/391469/AFTLite%20OB%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/391469/AFTLite%20OB%20Dashboard.meta.js
// ==/UserScript==

var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
if(m >= 15 && ((h == 1 || h == 3 || h == 5 || h== 7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19 || h == 21 || h == 23))){
    var a= "Scheduled 1HR Orders";
    }else if( m < 30 && (h == 2 || h == 4 || h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20 || h == 22)){
        var b= "<75m To Slam";
        }else if( m < 45 && (h == 2 || h == 4 || h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20 || h == 22)){
        var f= "<60m To Slam";
        }else if( m <= 59 && (h == 2 || h == 4 || h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20 || h == 22)){
        var g= "<45m To Slam";
        }else if( m < 15 && ((h == 1 || h == 3 || h == 5 || h== 7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19 || h == 21 || h == 23))){
            var c= "<75m To Slam";
            }

if(m < 10 || m >= 30){
    setInterval(function(){ location.reload(); }, 300000);
    var y="<30m to Slam";
    }else if(m < 20){
        setInterval(function(){ location.reload(); }, 300000);
        var x="<20m to Slam";
        }else if(m < 25){
            setInterval(function(){ location.reload(); }, 300000);
            var z="<10m to Slam";
            }else if(m < 29){
                setInterval(function(){ location.reload(); }, 60000);
                var v="<5m to Slam";
                }else if(m == 29){
setInterval(function(){ location.reload(); }, 60000);
                    var q="Last Minute!!";
                    }

var window;
if((h == 3) || (h == 4) || (h == 5 && m <=30)){
    window= "06:00-08:00";
}else if((h == 5 && m > 30) || (h == 6) || (h == 7 && m <= 30)){
    window= "08:00-10:00";
}else if( (h == 7 && m > 30) || (h == 8) || ( h ==9 && m <=30)){
    window= "10:00-12:00";
}else if((h == 9 && m > 30) || (h == 10) || ( h == 11 && m <=30)){
    window= "12:00-14:00";
}else if((h == 11 && m > 30) || (h == 12) || ( h == 13 && m <=30)){
    window= "14:00-16:00";
}else if((h == 13 && m > 30) || (h == 14) || (h == 15 && m <=30)){
    window= "16:00-18:00";
}else if((h == 15 && m > 30) || (h == 16) || (h == 17 && m <=30)){
    window= "18:00-20:00";
}else if(( h == 17 && m > 30) || (h == 18) || ( h == 19 && m <= 30)){
    window= "20:00-22:00";
}else if((h == 19 && m > 30) || (h == 20) || ( h == 21)){
    window= "22:00-00:00";}

document.getElementById("cpt_table").rows[0].cells[3].innerHTML= "Late 1HR";
document.getElementById("cpt_table").rows[0].cells[4].innerHTML= "<5m to Slam 1HR";
document.getElementById("cpt_table").rows[0].cells[5].innerHTML= "<15m to Slam 1HR";
document.getElementById("cpt_table").rows[0].cells[6].innerHTML= "We're Late!!!";
document.getElementById("cpt_table").rows[0].cells[7].innerHTML= (y || x || z || v || q);
document.getElementById("cpt_table").rows[0].cells[8].innerHTML= (a || b || c || f || g);
document.getElementById("cpt_table").rows[0].cells[9].innerHTML= "Next Window";
document.getElementById("cpt_table").rows[0].cells[10].innerHTML= "Futures";
document.getElementById("cpt_table").rows[0].cells[0].innerHTML= "Current Window:";
document.getElementById("cpt_table").rows[0].cells[1].innerHTML= window;

var body= document.getElementsByTagName("body")[0];
var title= document.createElement("H1");
title.innerText= "Page Last Refreshed " + h + ":" + m + ":" + s + "!" ;
title.style.color= '#4256f4';
body.appendChild(title);





