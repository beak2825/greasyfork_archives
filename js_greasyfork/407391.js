// ==UserScript==
// @name         AFTLite OB Dashboard Every Hour T-60
// @namespace    https://aftlite-na.amazon.com/outbound_dashboard
// @version      2.0
// @description  changes aftlite outbound dashboard to make it easier for assoicates to understand the board and align with slam time
// @author       cpatters
// @match        https://aftlite-na.amazon.com/outbound_dashboard*
// @downloadURL https://update.greasyfork.org/scripts/407391/AFTLite%20OB%20Dashboard%20Every%20Hour%20T-60.user.js
// @updateURL https://update.greasyfork.org/scripts/407391/AFTLite%20OB%20Dashboard%20Every%20Hour%20T-60.meta.js
// ==/UserScript==

var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
if( m <= 15 && ( h == 1 || h == 2 || h == 3 || h == 4 || h == 5 || h == 6 || h == 7 || h == 8 || h == 9 || h == 10 || h == 11 || h == 12 || h == 13 || h == 14 || h == 15 || h == 16 || h == 17 || h == 18 || h == 19 || h == 20 || h == 21 || h == 22 || h == 23)){
        var a= "<60m to Slam";
        }else if( m < 30 && ( h == 1 || h == 2 || h == 3 || h == 4 || h == 5 || h == 6 || h == 7 || h == 8 || h == 9 || h == 10 || h == 11 || h == 12 || h == 13 || h == 14 || h == 15 || h == 16 || h == 17 || h == 18 || h == 19 || h == 20 || h == 21 || h == 22 || h == 23)){
        var b= "<45m To Slam";
        }else if( m < 45 && (h == 1 || h == 2 || h == 3 || h == 4 || h == 5 || h == 6 || h == 7 || h == 8 || h == 9 || h == 10 || h == 11 || h == 12 || h == 13 || h == 14 || h == 15 || h == 16 || h == 17 || h == 18 || h == 19 || h == 20 || h == 21 || h == 22 || h == 23)){
        var f= "<30m To Slam";
        }else if( m < 50 && (h == 1 || h == 2 || h == 3 || h == 4 || h == 5 || h == 6 || h == 7 || h == 8 || h == 9 || h == 10 || h == 11 || h == 12 || h == 13 || h == 14 || h == 15 || h == 16 || h == 17 || h == 18 || h == 19 || h == 20 || h == 21 || h == 22 || h == 23)){
        var g= "<15m To Slam";
        }else if( m < 55 && (h == 1 || h == 2 || h == 3 || h == 4 || h == 5 || h == 6 || h == 7 || h == 8 || h == 9 || h == 10 || h == 11 || h == 12 || h == 13 || h == 14 || h == 15 || h == 16 || h == 17 || h == 18 || h == 19 || h == 20 || h == 21 || h == 22 || h == 23)){
        var i= "<10m To Slam";
        }else if( m <= 59 && (h == 1 || h == 2 || h == 3 || h == 4 || h == 5 || h == 6 || h == 7 || h == 8 || h == 9 || h == 10 || h == 11 || h == 12 || h == 13 || h == 14 || h == 15 || h == 16 || h == 17 || h == 18 || h == 19 || h == 20 || h == 21 || h == 22 || h == 23)){
        var n= "<5m To Slam";
        }

if(m < 10 || m >= 30){
    setInterval(function(){ location.reload(); }, 300000);
    var y="We're Late!!!";
    }else if(m < 20){
        setInterval(function(){ location.reload(); }, 300000);
        var x="We're Late!!!";
        }else if(m < 25){
            setInterval(function(){ location.reload(); }, 300000);
            var z="We're Late!!!";
            }else if(m < 29){
                setInterval(function(){ location.reload(); }, 60000);
                var v="We're Late!!!";
                }else if(m == 29){
setInterval(function(){ location.reload(); }, 60000);
                    var q="We're Late!!!";
                    }

var window;
if((h == 3) || (h == 4) || (h == 4 && m <=59)){
    window= "06:00-08:00";
}else if((h == 5)){
    window= "07:00-9:00";
}else if((h == 6)){
    window= "08:00-10:00";
}else if((h == 7)){
    window= "09:00-11:00";
}else if((h == 8)){
    window= "10:00-12:00";
}else if((h == 9)){
    window= "11:00-13:00";
}else if((h == 10)){
    window= "12:00-14:00";
}else if((h == 11)){
    window= "13:00-15:00";
}else if((h == 12)){
    window= "14:00-16:00";
}else if((h == 13)){
    window= "15:00-17:00";
}else if((h == 14)){
    window= "16:00-18:00";
}else if((h == 15)){
    window= "17:00-19:00";
}else if((h == 16)){
    window= "18:00-20:00";
}else if((h == 17)){
    window= "19:00-21:00";
}else if((h == 18)){
    window= "20:00-21:00";
}else if((h == 19)){
    window= "21:00-23:00";}

document.getElementById("cpt_table").rows[0].cells[3].innerHTML= "Late 1HR";
document.getElementById("cpt_table").rows[0].cells[4].innerHTML= "<5m to Slam 1HR";
document.getElementById("cpt_table").rows[0].cells[5].innerHTML= "<15m to Slam 1HR";
document.getElementById("cpt_table").rows[0].cells[6].innerHTML= "We're Super Late!!!";
document.getElementById("cpt_table").rows[0].cells[7].innerHTML= (y || x || z || v || q);
document.getElementById("cpt_table").rows[0].cells[8].innerHTML= (a || b || f || g || i || n);
document.getElementById("cpt_table").rows[0].cells[9].innerHTML= "Next Window";
document.getElementById("cpt_table").rows[0].cells[10].innerHTML= "Futures";
document.getElementById("cpt_table").rows[0].cells[0].innerHTML= "Current Window:";
document.getElementById("cpt_table").rows[0].cells[1].innerHTML= window;

var body= document.getElementsByTagName("body")[0];
var title= document.createElement("H1");
title.innerText= "Page Last Refreshed " + h + ":" + m + ":" + s + "!" ;
title.style.color= '#4256f4';
body.appendChild(title);





