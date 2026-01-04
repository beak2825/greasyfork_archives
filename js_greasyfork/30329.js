// ==UserScript==
// @name         express jump
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID*
// @match        https://airindiaexpress.booksecure.net/Login.aspx
// @match        https://airindiaexpress.booksecure.net/Main.aspx?BookingID=*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30329/express%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/30329/express%20jump.meta.js
// ==/UserScript==

(function() {

    if (window.location.href.includes("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via") === true){ 
        if (!$('#Form1 > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > span:nth-child(1)').length) {


            localStorage.script = "on";
            if (window.location.href.includes("via2") === true){
                localStorage.two="on";
                localStorage.url2 = window.location.href;
            }
            else{

                localStorage.url = window.location.href; 
            }
            window.open('https://airindiaexpress.booksecure.net/Login.aspx','_self');   
        }
    }
    if (localStorage.script === "on" || localStorage.two==="on"){
        if (window.location.href.includes("https://airindiaexpress.booksecure.net/Main.aspx?BookingID=") === true){

            window.open(localStorage.url,'_self');
            localStorage.script = "off";

            if (localStorage.two === "on"){
                window.open(localStorage.url2);
                localStorage.two="off";
            }

        }
    }
    function doc_keyDown(e) {

        var month = [];
        month[01] = "Jan";
        month[02] = "Feb";
        month[03] = "Mar";
        month[04] = "Apr";
        month[05] = "May";
        month[06] = "Jun";
        month[07] = "Jul";
        month[08] = "Aug";
        month[09] = "Sep";
        month[10] = "Oct";
        month[11] = "Nov";
        month[12] = "Dec";
        var st = window.location.href;
        var str = st.split('&adults=');
        var adult = str[1].split("&children="); 
        var child = adult[1].split("&infants=");
        var inf = child[1].split("&seniors=0&subwebfaretype=1&isavailforpackages=False&origin=");
        var ori = inf[1].split("&dest=");
        var dest = ori[1].split("&depday=");
        var day = dest[1].split("&depmon=");
        var mon = day[1].split("&depyear=");
        var year;
        ori=ori[0];
        var des = dest[0];
        var yea;
        var ryea;
        var dep;
        inf=inf[0];
        day = day[0];
        var adt = adult[0];
        var chd = child[0];


        if (window.location.href.includes("&retday") === false){
            year = mon[1].split("&internal=true");
            mon= mon[0];
            yea = year[0];
            dep= yea+"-"+mon+"-"+day;
            //oneway
            if (e.altKey && e.keyCode == 71) {
                //g google
                if (adult>0 & child>0){
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+yea+"-"+mon+"-"+day+";r=2017-06-12;tt=o;px="+adt+","+chd);
                }
                else if (adult>0){
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+yea+"-"+mon+"-"+day+";r=2017-06-12;tt=o;px="+adt);
                }
                else{
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+yea+"-"+mon+"-"+day+";r=2017-06-12;tt=o;");
                }
            }
            else if (e.altKey && e.keyCode == 87) {
                //w wego

                window.open("https://om.wego.com/en/flights/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep);
            }
            else if (e.altKey && e.keyCode == 73) {
                //i indigo
                window.open("https://book.goindigo.in/Agent/MyBookings#book-flight/track/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+day+" "+month[ parseInt(mon)]+" "+yea);
            }else if (e.altKey && e.keyCode == 65) {
                //e express
                window.open("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via&triptype=rOneWay&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+day+"&depmon="+mon+"&depyear="+yea+"&internal=true");

            }else if (e.altKey && e.keyCode == 67) {
                //c cleartrip
                window.open("https://om.cleartrip.com/flights/international/results?from="+ori+"&to="+des+"&depart_date="+day+"/"+mon+"/"+yea+"&adults="+adt+"&childs="+chd+"&infants="+inf+"&class=Economy&airline=&carrier=&intl=y&sd=1494437055860&page=loaded");
            }else if (e.altKey && e.keyCode == 77) {
                //m makemytrip
                window.open("https://www.makemytrip.com/air/search?tripType=O&itinerary="+ori+"-"+des+"-D-"+day+""+month[ parseInt(mon)]+""+yea+"&paxType=A-1&cabinClass=E");

            }else if (e.altKey && e.keyCode == 50) {
                //2 vconsumer
                viac = window.location.href.replace('https://omb2b.via.com','https://om.via.com');
                window.open(viac);
            }
        }

        else{
            year = mon[1].split("&retday=");
            var rday = year[1].split("&retmon=");
            var rmon = rday[1].split("&retyear=");
            var ryear = rmon[1].split("&internal=true");
            yea = year[0];
            rday = rday[0];
            rmon = rmon[0];
            ryea = ryear[0];
            mon= mon[0];
            var arr;
            arr= ryea+"-"+rmon+"-"+rday;
            //return
            if (e.altKey && e.keyCode == 71) {
                //g google
                if (adult>0 & child>0){
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+yea+"-"+mon+"-"+day+";r="+ryea+"-"+rmon+"-"+rday+";px="+adt+","+chd);
                }
                else if (adult>0){
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+yea+"-"+mon+"-"+day+";r="+ryea+"-"+rmon+"-"+rday+";px="+adt);
                }
                else{
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+yea+"-"+mon+"-"+day+";r="+ryea+"-"+rmon+"-"+rday);
                }

            }
            else if (e.altKey && e.keyCode == 87) {
                //w wego
                window.open("https://om.wego.com/en/flights/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 73) {
                //i indigo
                window.open("https://book.goindigo.in/Agent/MyBookings#book-flight/track/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+day+" "+month[ parseInt(mon)]+" "+yea+";"+rday+" "+month[ parseInt(rmon)]+" "+ryea);

            }else if (e.altKey && e.keyCode == 65) {
                //e express
                window.open("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via&triptype=rRoundTrip&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+day+"&depmon="+mon+"&depyear="+yea+"&retday="+rday+"&retmon="+rmon+"&retyear="+ryea+"&internal=true");

            }else if (e.altKey && e.keyCode == 67) {
                //c cleartrip
                window.open("https://om.cleartrip.com/flights/international/results?from="+ori+"&to="+des+"&depart_date="+day+"/"+mon+"/"+yea+"&return_date="+rday+"/"+rmon+"/"+ryea+"&adults="+adt+"&childs="+chd+"&infants="+inf+"&class=Economy&airline=&carrier=&intl=y&sd=1494437597706");

            }else if (e.altKey && e.keyCode == 77) {
                //m makemytrip
                window.open("https://www.makemytrip.com/air/search?tripType=R&itinerary="+ori+"-"+des+"-D-"+day+""+month[ parseInt(mon)]+""+yea+"_"+des+"-"+ori+"-D-"+rday+""+month[ parseInt(rmon)]+""+ryea+"&paxType=A-1&cabinClass=E&sTime=1495378644000");
            }else if (e.altKey && e.keyCode == 50) {
                //2 vconsumer
                viac = window.location.href.replace('https://omb2b.via.com','https://om.via.com');
                window.open(viac);
            }

        }


    }
    // register the handler
    document.addEventListener('keydown', doc_keyDown , false);

    // Your code here...
})();