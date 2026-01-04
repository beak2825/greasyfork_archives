// ==UserScript==
// @name         Change External Dashboard Headers
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       cpatters(sam patterson)
// @match        https://aftlite-portal.amazon.com/ojs/OrchaJSFaaSTCoreProcess/OutboundDashboard
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381970/Change%20External%20Dashboard%20Headers.user.js
// @updateURL https://update.greasyfork.org/scripts/381970/Change%20External%20Dashboard%20Headers.meta.js
// ==/UserScript==

setTimeout(function(){

var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
if(m >= 15 && ((h == 1 || h == 3 || h == 5 || h== 7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19 || h == 21 || h == 23))){
    var a= "<75m To Slam<BR>1HR | 2HR"
    }else if( m < 30 && (h == 2 || h == 4 || h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20 || h == 22)){
        var b= "<75m To Slam<BR>1HR | 2HR"
        }else if( m < 45 && (h == 2 || h == 4 || h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20 || h == 22)){
        var f= "<60m To Slam<BR>1HR | 2HR"
        }else if( m <= 59 && (h == 2 || h == 4 || h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20 || h == 22)){
        var g= "<45m To Slam<BR>1HR | 2HR"
        }else if( m < 15 && ((h == 1 || h == 3 || h == 5 || h== 7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19 || h == 21 || h == 23))){
            var c= "<75m To Slam<BR>1HR | 2HR"
            }

if(m < 10 || m >= 30){
    setInterval(function(){ location.reload(); }, 300000);
    var y="<30m to Slam<BR>1HR | 2HR"
    }else if(m < 20){
        setInterval(function(){ location.reload(); }, 300000);
        var x="<20m to Slam<BR>1HR | 2HR"
        }else if(m < 25){
            setInterval(function(){ location.reload(); }, 300000);
            var z="<10m to Slam<BR>1HR | 2HR"
            }else if(m < 29){
                setInterval(function(){ location.reload(); }, 60000);
                var v="<5m to Slam<BR>1HR | 2HR"
                }else if(m == 29){
setInterval(function(){ location.reload(); }, 60000);
                    var q="Last Minute!!<BR>1HR | 2HR"
                    }

document.getElementById('orchajs_obd_heading_missed').innerHTML= "Late 1HR";
document.getElementById('orchajs_obd_heading_less5min').innerHTML= "<5m to Slam 1HR";
document.getElementById('orchajs_obd_heading_less15min').innerHTML= "<15m to Slam 1HR";
document.getElementById('orchajs_obd_heading_less45min').innerHTML= "We're Late!!!<BR>1HR | 2HR";
document.getElementById('orchajs_obd_heading_less75min').innerHTML= (y || x || z || v || q);
document.getElementById('orchajs_obd_heading_less2h').innerHTML= (a || b || c || f || g);
document.getElementById('orchajs_obd_heading_less4h').innerHTML= "Next Window<BR>1HR | 2HR";
document.getElementById('orchajs_obd_heading_more4h').innerHTML= "Futures<BR>1HR | 2HR";
document.getElementById('orchajs_obd_heading_total').innerHTML= "Total<BR>1HR | 2HR";


    var window;
if((h == 3) || (h == 4) || (h == 5 && m <=30)){
    window= "06:00-08:00";
}else if((h == 5 && m > 30 || h == 6 && m <= 30)){
    window= "07:00-9:00";
}else if((h == 6 && m > 30 || h == 7 && m <= 30)){
    window= "08:00-10:00";
}else if((h == 7 && m > 30 || h == 8 && m <= 30)){
    window= "09:00-11:00";
}else if((h == 8 && m > 30 || h == 9 && m <= 30)){
    window= "10:00-12:00";
}else if((h == 9 && m > 30 || h == 10 && m <= 30)){
    window= "11:00-13:00";
}else if((h == 10 && m > 30 || h == 11 && m <= 30)){
    window= "12:00-14:00";
}else if((h == 11 && m > 30 || h == 12 && m <= 30)){
    window= "13:00-15:00";
}else if((h == 12 && m > 30 || h == 13 && m <= 30)){
    window= "14:00-16:00";
}else if((h == 13 && m > 30 || h == 14 && m <= 30)){
    window= "15:00-17:00";
}else if((h == 14 && m > 30 || h == 15 && m <= 30)){
    window= "16:00-18:00";
}else if((h == 15 && m > 30 || h == 16 && m <= 30)){
    window= "17:00-19:00";
}else if((h == 16 && m > 30 || h == 17 && m <= 30)){
    window= "18:00-20:00";
}else if((h == 17 && m > 30 || h == 18 && m <= 30)){
    window= "19:00-21:00";
}else if((h == 18 && m > 30 || h == 19 && m <= 30)){
    window= "20:00-21:00";
}else if((h == 19 && m > 30 || h == 20 && m <= 30)){
    window= "21:00-23:00";
}else(window= "Overnight");

    document.getElementById('orchajs_obd_heading_process').innerHTML= "Current Window:";
    document.getElementById('orchajs_obd_heading_status').innerHTML= window;

}, 3000)

