// ==UserScript==
// @name         google jump
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/flights/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30328/google%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/30328/google%20jump.meta.js
// ==/UserScript==

(function() {


    function doc_keyDown(e) {
        var st ;
        var str;
        var Dest ;
        var Date;
        var Mon ;
        var ori ; 
        var adult;
        var child=0;
        var stop = -1;
        var date2;
        var pas;
        var pad;
        var rsplit;
        var pass;
        var inf=0;    
        var spl;
        var date;
        var per;

        var des ;
        var dep ;
        var arr;
        var depsplt ;
        var arrsplt;
        var day;
        var mon ;
        var yea ;
        var rday;
        var rmon ;
        var ryea ;
        var adt;
        var chd;
        var ori2;
        var des2;
        var mul=0;

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
        var viac;        
        var airport = [];
        airport.MCT = "Muscat";
        airport.BZL = "Barisal";
        airport.CCU = "Kolkata";
        airport.CGP = "Chittagong";
        airport.DAC = "Dhaka";
        airport.KTM = "Kathmandu";
        airport.KUL = "Kuala Lumpur";
        airport.SIN = "Singapore";
        airport.ZYL = "Sylhet";




        st = window.location.href;
        st = st.replace(/;c.*;/, ';');
        str = st.split('#search;f=');
        ori = str[1].split(";t=");
        Dest = ori[1].split(";d=");
        Date = Dest[1].split(";r=");
        Mon = Date[0].split("-");

        if (window.location.href.includes(";tt=o") === true){

            date2 = Date[1].split(";tt=o");

            if (date2[1].includes(";s=") && date2[1].includes(";px=") === true){ 
                pass=date2[1].split(";s=");
                stop=pass[1];
                pad = pass[0].split(";px=");
                pass[1] = pad[1];
                //alert(pass[1]);
                if (pass[1].includes(",")===true){
                    pas = pass[1].split(",");
                    adult = pas[0];
                    if (pas[1] !== ""){
                        child= pas[1];
                    }
                    else{
                        child= 0;
                    } 
                    if (typeof pas[3]!== "undefined"){
                        inf = pas[3];
                    }   
                }  
                else { 
                    adult = pass[1];
                }

            }

            else if (date2[1].includes(";px=") === true){
                pass = date2[1].split(";px="); 
                if (pass[1].includes(",")===true){
                    pas = pass[1].split(",");
                    adult = pas[0];
                    if (pas[1] !== ""){
                        child= pas[1];
                    }
                    else{
                        child= 0;
                    }
                    if (typeof pas[3]!== "undefined"){
                        inf = pas[3];
                    } 
                }
                else { 
                    adult = pass[1];
                }  
            }
            else if (Date[1].includes(";s=") === true){
                pass = Date[1].split(";s=");
                stop=pass[1];
                adult =1;

            }
            else{
                adult = 1;
                child=0;
            }
            ori = ori[0];
            des = Dest[0];
            adt= adult;
            chd = child;
            dep = Date[0];   
            depsplt = Date[0].split("-");
            day = depsplt[2];
            mon = depsplt[1];
            yea = depsplt[0];
            ori2=ori;
            des2=des;
            if (ori.includes(",")===true){
                mul=1;
                ori=ori.split(",");
                ori2=ori[1];
                ori=ori[0];

            }
            if (des.includes(",")===true){
                mul=1;
                des=des.split(",");
                des2=des[1];
                des=des[0];
            }

            if (e.altKey && e.keyCode == 65) {
                //e express
                //alert("http://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via&triptype=rOneWay&adults="+adult+"&children="+child+"&infants=0&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori[0]+"&dest="+dest[0]+"&depday="+mon[2]+"&depmon="+mon[1]+"&depyear="+mon[0]+"&internal=true");
                window.open("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via&triptype=rOneWay&adults="+adt+"&children="+chd+"&infants=0&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+Mon[2]+"&depmon="+Mon[1]+"&depyear="+Mon[0]+"&internal=true");
                if (mul===1){
                    window.open("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via2&triptype=rOneWay&adults="+adt+"&children="+chd+"&infants=0&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori2+"&dest="+des2+"&depday="+Mon[2]+"&depmon="+Mon[1]+"&depyear="+Mon[0]+"&internal=true");
                }            
            }
            else if (e.altKey && e.keyCode == 86) {
                //v via
                window.open("https://omb2b.via.com/flight/results/"+ori+"_"+des+"_"+dep+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////;"+stop); 
                if (mul===1){
                    window.open("https://omb2b.via.com/flight/results/"+ori2+"_"+des2+"_"+dep+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////;"+stop); 
                }
            }
            else if (e.altKey && e.keyCode == 87) {
                //w wego
                window.open("https://om.wego.com/en/flights/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep);
            }
            else if (e.altKey && e.keyCode == 73) {
                //i indigo
                window.open("https://book.goindigo.in/Agent/MyBookings#book-flight/track/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+day+" "+month[ parseInt(mon)]+" "+yea);
                if (mul===1){
                    window.open("https://book.goindigo.in/Agent/MyBookings#book-flight/track/"+ori2+";"+des2+"222;"+adt+";"+chd+";"+inf+";"+day+" "+month[ parseInt(mon)]+" "+yea);
                }
            }
            else if (e.altKey && e.keyCode == 67) {
                //c cleartrip
                window.open("https://om.cleartrip.com/flights/international/results?from="+ori+"&to="+des+"&depart_date="+day+"/"+mon+"/"+yea+"&adults="+adt+"&childs="+chd+"&infants="+inf+"&class=Economy&airline=&carrier=&intl=y&sd=1494437055860&page=loaded");
            }else if (e.altKey && e.keyCode == 77) {
                //m makemytrip
                window.open("https://www.makemytrip.com/air/search?tripType=O&itinerary="+ori+"-"+des+"-D-"+day+""+month[ parseInt(mon)]+""+yea+"&paxType=A-1&cabinClass=E");

            }else if (e.altKey && e.keyCode == 50) {
                //2 vconsumer

                window.open("https://om.via.com/flight/results/"+ori[0]+"_"+Dest[0]+"_"+Date[0]+"/"+adult+"-"+child+"-"+inf+"/ALL/ALL////;"+stop); 
                if (mul===1){
                    window.open("https://om.via.com/flight/results/"+ori2+"_"+des2+"_"+Date[0]+"/"+adult+"-"+child+"-"+inf+"/ALL/ALL////;"+stop); 
                }
            }
            else if (e.altKey && e.keyCode == 83) {
                //s shaheen
                window.open("https://eticket.shaheenair.com/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep);
                if (mul===1){
                    window.open("https://eticket.shaheenair.com/track"+ori2+";"+des2+"2;"+adt+";"+chd+";"+inf+";"+dep);
                }
            }
            else if (e.altKey && e.keyCode == 85) {
                //u us bangla
                window.open("https://apac.ttinteractive.com/newUI/index.asp/"+airport[ori]+";"+airport[des]+";"+adt+";"+chd+";"+inf+";"+dep);
            }
            else if (e.altKey && e.keyCode == 89) {
                //f flydubai
                window.open("https://ta.flydubai.com/en/user/makebooking/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep);
                if (mul===1){
                    window.open("https://ta.flydubai.com/en/user/makebooking/track"+ori2+";"+des2+";"+adt+";"+chd+";"+inf+";"+dep);
                }
            }
            else if (e.altKey && e.keyCode == 76) {
                //l salam air
                window.open("https://salamair.booksecure.net/avail.aspx?lang=en-US&BookingID=via&triptype=rOneWay&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+Mon[2]+"&depmon="+Mon[1]+"&depyear="+Mon[0]+"&internal=true");
            }
        }
        else{
            adult=1;
            child=0;


            if (Date[1].includes(";s=") && Date[1].includes(";px=") === true){ 
                pass=Date[1].split(";s=");
                stop=pass[1];
                pad = pass[0].split(";px=");
                pass[1] = pad[1];
                //alert(pass[1]);
                if (pass[1].includes(",")===true){
                    pas = pass[1].split(",");
                    adult = pas[0];
                    if (pas[1] !== ""){
                        child= pas[1];
                    }
                    else{
                        child= 0;
                    }
                    if (typeof pas[3]!== "undefined"){
                        inf = pas[3];
                    } 
                    rsplit = pad[0].split("-");
                }

                else { 
                    adult = pass[1];

                    rsplit = pad[0].split("-");
                }
            }

            else if (Date[1].includes(";px=") === true){

                pass = Date[1].split(";px=");
                if (pass[1].includes(",")===true){
                    // alert(pass[1]);
                    pas = pass[1].split(",");
                    adult = pas[0];
                    if (pas[1] !== ""){
                        child= pas[1];
                    }
                    else{
                        child= 0;
                    }
                    if (typeof pas[3]!== "undefined"){
                        inf = pas[3];
                    } 
                    rsplit = pass[0].split("-");
                }
                else { 
                    adult = pass[1];

                    rsplit = pass[0].split("-");
                }
            }
            else if (Date[1].includes(";s=") === true){
                pass = Date[1].split(";s=");
                rsplit = pass[0].split("-");
                stop=pass[1];

            }
            else{
                adult = 1;
                child=0;

                //pass[0]=date[1];
                rsplit = Date[1].split("-");
            }
            /*
if (pass[0].includes(";")==true){
 pass = pass[0].split(";"); 
}
*/
            ori = ori[0];
            des = Dest[0];
            adt= adult;
            chd = child;
            dep = Date[0];
            arr = rsplit[0]+"-"+rsplit[1]+"-"+rsplit[2];
            depsplt = Date[0].split("-");
            day = depsplt[2];
            mon = depsplt[1];
            yea = depsplt[0];
            rday = rsplit[2];
            rmon = rsplit[1];
            ryea = rsplit[0];
            ori2=ori;
            des2=des;
            if (ori.includes(",")===true){
                mul=1;
                ori=ori.split(",");
                ori2=ori[1];
                ori=ori[0];

            }
            if (des.includes(",")===true){
                mul=1;
                des=des.split(",");
                des2=des[1];
                des=des[0];
            }
            if (e.altKey && e.keyCode == 65) {
                //e express
                //alert("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via&triptype=rRoundTrip&adults="+adult+"&children="+child+"&infants=0&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori[0]+"&dest="+dest[0]+"&depday="+mon[2]+"&depmon="+mon[1]+"&depyear="+mon[0]+"&retday="+rsplit[2]+"&retmon="+rsplit[1]+"&retyear="+rsplit[0]+"&internal=true");  
                window.open("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via&triptype=rRoundTrip&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+Mon[2]+"&depmon="+Mon[1]+"&depyear="+Mon[0]+"&retday="+rsplit[2]+"&retmon="+rsplit[1]+"&retyear="+rsplit[0]+"&internal=true");  
                if (mul===1){
                    window.open("https://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=via2&triptype=rRoundTrip&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori2+"&dest="+des2+"&depday="+Mon[2]+"&depmon="+Mon[1]+"&depyear="+Mon[0]+"&retday="+rsplit[2]+"&retmon="+rsplit[1]+"&retyear="+rsplit[0]+"&internal=true");  
                }
            }
            else if (e.altKey && e.keyCode == 86) {
                //v via
                window.open("https://omb2b.via.com/flight/results/"+ori+"_"+des+"_"+dep+","+des+"_"+ori+"_"+rsplit[0]+"-"+rsplit[1]+"-"+rsplit[2]+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////;"+stop);  
                if (mul===1){
                    window.open("https://omb2b.via.com/flight/results/"+ori2+"_"+des2+"_"+dep+","+des+"_"+ori+"_"+rsplit[0]+"-"+rsplit[1]+"-"+rsplit[2]+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////;"+stop);  
                }
            }
            else if (e.altKey && e.keyCode == 87) {
                //w wego
                window.open("https://om.wego.com/en/flights/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 73) {
                //i indigo
                window.open("https://book.goindigo.in/Agent/MyBookings#book-flight/track/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+day+" "+month[ parseInt(mon)]+" "+yea+";"+rday+" "+month[ parseInt(rmon)]+" "+ryea);
                if (mul===1){
                    window.open("https://book.goindigo.in/Agent/MyBookings#book-flight/track/"+ori2+";"+des2+"222;"+adt+";"+chd+";"+inf+";"+day+" "+month[ parseInt(mon)]+" "+yea+";"+rday+" "+month[ parseInt(rmon)]+" "+ryea);
                }
            }
            else if (e.altKey && e.keyCode == 67) {
                //c cleartrip
                window.open("https://om.cleartrip.com/flights/international/results?from="+ori+"&to="+des+"&depart_date="+day+"/"+mon+"/"+yea+"&return_date="+rday+"/"+rmon+"/"+ryea+"&adults="+adt+"&childs="+chd+"&infants="+inf+"&class=Economy&airline=&carrier=&intl=y&sd=1494437597706");
                if (mul===1){
                    window.open("https://om.cleartrip.com/flights/international/results?from="+ori2+"&to="+des2+"&depart_date="+day+"/"+mon+"/"+yea+"&return_date="+rday+"/"+rmon+"/"+ryea+"&adults="+adt+"&childs="+chd+"&infants="+inf+"&class=Economy&airline=&carrier=&intl=y&sd=1494437597706");
                }
            }else if (e.altKey && e.keyCode == 77) {
                //m makemytrip
                window.open("https://www.makemytrip.com/air/search?tripType=R&itinerary="+ori+"-"+des+"-D-"+day+""+month[ parseInt(mon)]+""+yea+"_"+des+"-"+ori+"-D-"+rday+""+month[ parseInt(rmon)]+""+ryea+"&paxType=A-1&cabinClass=E&sTime=1495378644000");
                if (mul===1){
                    window.open("https://www.makemytrip.com/air/search?tripType=R&itinerary="+ori2+"-"+des2+"-D-"+day+""+month[ parseInt(mon)]+""+yea+"_"+des+"-"+ori+"-D-"+rday+""+month[ parseInt(rmon)]+""+ryea+"&paxType=A-1&cabinClass=E&sTime=1495378644000");
                }

            }else if (e.altKey && e.keyCode == 50) {
                //2 vconsumer

                window.open("https://om.via.com/flight/results/"+ori[0]+"_"+Dest[0]+"_"+Date[0]+","+Dest[0]+"_"+ori[0]+"_"+rsplit[0]+"-"+rsplit[1]+"-"+rsplit[2]+"/"+adult+"-"+child+"-"+inf+"/ALL/ALL////;"+stop);  
            if (mul===1){
                    window.open("https://om.via.com/flight/results/"+ori2+"_"+des2+"_"+Date[0]+","+Dest[0]+"_"+ori[0]+"_"+rsplit[0]+"-"+rsplit[1]+"-"+rsplit[2]+"/"+adult+"-"+child+"-"+inf+"/ALL/ALL////;"+stop);  
                }
            
            }
            else if (e.altKey && e.keyCode == 83) {
                //s shaheen
                window.open("https://eticket.shaheenair.com/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
                if (mul===1){
                    window.open("https://eticket.shaheenair.com/track"+ori2+";"+des2+"2;"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
                }
            }
            else if (e.altKey && e.keyCode == 85) {
                //u us bangla
                window.open("https://apac.ttinteractive.com/newUI/index.asp/"+airport[ori]+";"+airport[des]+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 89) {
                //f flydubai
                window.open("https://ta.flydubai.com/en/user/makebooking/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 76) {
                //l salam air
                window.open("https://salamair.booksecure.net/avail.aspx?lang=en-US&BookingID=via&triptype=rRoundTrip&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+Mon[2]+"&depmon="+Mon[1]+"&depyear="+Mon[0]+"&retday="+rday+"&retmon="+rmon+"&retyear="+ryea+"&internal=true");
            }
        }

        // Your code here...
    }
    document.addEventListener('keydown', doc_keyDown , false);
})();