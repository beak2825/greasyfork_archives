// ==UserScript==
// @name         via jump
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://omb2b.via.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30334/via%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/30334/via%20jump.meta.js
// ==/UserScript==

(function() {
    if (window.location.href.includes(";") === true){
        var stop = window.location.href.split(";");
        var checkExist = setInterval(function() {

            if ($('.loadPercent:contains(100%)').length) {

                if (stop[1]=="0"){
                    $('#filterBody > div.filt_typ.stopsFilter > div.filtDataCont > div:nth-child(2) > div.customCBox > label').click();
                    $('#filterBody > div.filt_typ.stopsFilter > div.filtDataCont > div:nth-child(3) > div.customCBox > label').click();
                    $('#filterBody > div.filt_typ.stopsFilter > div.filtDataCont > div:nth-child(4) > div.customCBox > label').click();

                }
                else if (stop[1] =="1"){
                    $('#filterBody > div.filt_typ.stopsFilter > div.filtDataCont > div:nth-child(3) > div.customCBox > label').click();
                    $('#filterBody > div.filt_typ.stopsFilter > div.filtDataCont > div:nth-child(4) > div.customCBox > label').click();
                }
                else if (stop[1] =="2"){
                    $('#filterBody > div.filt_typ.stopsFilter > div.filtDataCont > div:nth-child(4) > div.customCBox > label').click();
                }

                clearInterval(checkExist);
            }
        }, 100);
    }
    else if(window.location.href.includes("https://omb2b.via.com/_login?refURL=") === true){

        setTimeout(function() {
            $('#loginValidate').click();
        }, 100);
    }
    else if(window.location.href.includes("https://omb2b.via.com/itinerary/") === true){

        $('body > div.header.onlyPrint > div > div.productsNav > div.logoCont > a').remove();
    }
    function doc_keyDown(e) {

        // this would test for whichever key is 40 and the ctrl key at the same time


        var str = window.location.href.replace('https://omb2b.via.com/flight/results/','');
        var comma = str.split(",");
        var spl;
        var date;
        var per;
        var ori;
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
        var inf;
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

        if (comma[0]==str){
            spl = str.split("_");
            date = spl[2].split("/");


            yea = date[4].split("/");
            per = date[1].split("-");
            //e47e55-f655-473f-a36d-35757093513a
            ori = spl[0];
            des = spl[1];
            dep = date[0];
            depsplt = dep.split("-");
            day = depsplt[2];
            mon = depsplt[1];
            yea = depsplt[0];
            adt = per[0];
            chd = per[1];
            inf = per[2];


        }

        else{
            spl = comma[1].split("_");
            date = spl[2].split("/");
            var spl1 = comma[0].split("_");
            per = date[1].split("-");
            ori = spl[1];
            des = spl[0];
            dep = spl1[2];
            arr = date[0];
            arrsplt = arr.split("-");
            depsplt = dep.split("-");
            day = depsplt[2];
            mon = depsplt[1];
            yea = depsplt[0];
            rday= arrsplt[2];
            rmon= arrsplt[1];
            ryea= arrsplt[0];
            adt = per[0];
            chd = per[1];
            inf = per[2];

        }


        if (comma[0]==str){
            //oneway
            if (e.altKey && e.keyCode == 71) {
                //g google
                if (per[0]>0 & per[1]>0){
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+dep+";r=2017-06-15;tt=o;px="+adt+","+chd);  }
                else if (per[0]>0){
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+dep+";r=2017-06-15;tt=o;px="+adt);
                }
                else{
                    //alert(adult);
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+dep+";r=2017-06-15;tt=o");
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

            else if (e.altKey && e.keyCode == 85) {
                //u us bangla
                window.open("https://apac.ttinteractive.com/newUI/index.asp/"+$('#source').attr("data-city")+";"+$('#destination').attr("data-city")+";"+adt+";"+chd+";"+inf+";"+dep);
            }
            else if (e.altKey && e.keyCode == 83) {
                //s shaheen
                window.open("https://eticket.shaheenair.com/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep);
            }
            else if (e.altKey && e.keyCode == 89) {
                //y flydubai
                window.open("https://ta.flydubai.com/en/user/makebooking/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep);
            }
            else if (e.altKey && e.keyCode == 82) {
                //r air arabia
                window.open("https://reservations.airarabia.com/agents/private/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep);
            }
            else if (e.altKey && e.keyCode == 76) {
                //l salam air
                window.open("https://salamair.booksecure.net/avail.aspx?lang=en-US&BookingID=via&triptype=rOneWay&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+day+"&depmon="+mon+"&depyear="+yea+"&internal=true");
            }
            else if (e.altKey && e.keyCode == 189) {
                //- minus day
                if (parseInt(day)>1){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-"+(parseInt(day)-1)+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(mon)>1){
                    if (parseInt(mon)===2 || parseInt(mon)===4|| parseInt(mon)===6|| parseInt(mon)===8|| parseInt(mon)===9|| parseInt(mon)===11|| parseInt(mon)===1){
                        window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-31/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                    }
                    else if(parseInt(mon)===3){
                        if (parseInt(yea)% 4 === 0){
                            window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-29/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                        }
                        else {
                            window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-28/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                        }
                    }
                    else{
                        window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-30/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                    }
                }
                else{
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+(parseInt(yea)-1)+"-12-31/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
            }
            else if (e.altKey && e.keyCode == 187) {
                //+ plus day
                if (parseInt(day)==31 && parseInt(mon)!==12){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)+1)+"-01/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(day)==30 && (parseInt(mon)===4|| parseInt(mon)===6|| parseInt(mon)===8|| parseInt(mon)===9|| parseInt(mon)===11|| parseInt(mon)===1)){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)+1)+"-01/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if ( (parseInt(day)==29 && parseInt(mon)==2) || (parseInt(yea)% 4 !== 0 && parseInt(day)==28) ){
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)+1)+"-01/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(day)===31 && parseInt(mon)===12){
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+(parseInt(yea)+1)+"-01-01/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else{
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-"+(parseInt(day)+1)+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }


            }
        }
        else{
            //return
            if (e.altKey && e.keyCode == 71) {
                //g google
                if (per[0]>0 & per[1]>0){
                    //alert(hi);
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+dep+";r="+arr+";px="+adt+","+chd);
                }
                else if (per[0]>0){
                    //alert(hi);
                    window.open("https://www.google.com/flights/?curr=SAR#search;f="+ori+";t="+des+";d="+dep+";r="+arr+";px="+adt);
                }
                else{
                    //alert(hi);
                    window.open("https://www.google.com/flights/#search;f="+ori+";t="+des+";d="+dep+";r="+arr);
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
            else if (e.altKey && e.keyCode == 83) {
                //s shaheen
                window.open("https://eticket.shaheenair.com/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 85) {
                //u us bangla
                window.open("https://apac.ttinteractive.com/newUI/index.asp/"+$('#source').attr("data-city")+";"+$('#destination').attr("data-city")+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 89) {
                //f flydubai
                window.open("https://ta.flydubai.com/en/user/makebooking/track"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 82) {
                //r air arabia
                window.open("https://reservations.airarabia.com/agents/private/"+ori+";"+des+";"+adt+";"+chd+";"+inf+";"+dep+";"+arr);
            }
            else if (e.altKey && e.keyCode == 76) {
                //l salam air
                window.open("https://salamair.booksecure.net/avail.aspx?lang=en-US&BookingID=via&triptype=rRoundTrip&adults="+adt+"&children="+chd+"&infants="+inf+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+ori+"&dest="+des+"&depday="+day+"&depmon="+mon+"&depyear="+yea+"&retday="+rday+"&retmon="+rmon+"&retyear="+ryea+"&internal=true");
            }
            else if (e.altKey && e.keyCode == 189) {
                //- minus day
                if (parseInt(day)>1){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-"+(parseInt(day)-1)+","+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(mon)>1){
                    if (parseInt(mon)===2 || parseInt(mon)===4|| parseInt(mon)===6|| parseInt(mon)===8|| parseInt(mon)===9|| parseInt(mon)===11|| parseInt(mon)===1){
                        window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-31,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                    }
                    else if(parseInt(mon)===3){
                        if (parseInt(yea)% 4 === 0){
                            window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-29,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                        }
                        else {
                            window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-28,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                        }
                    }
                    else{
                        window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)-1)+"-30,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                    }
                }
                else{
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+(parseInt(yea)-1)+"-12-31,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
            }
            else if (e.altKey && e.keyCode == 187) {
                //+ plus day
                if (parseInt(day)==31 && parseInt(mon)!==12){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)+1)+"-01,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(day)==30 && (parseInt(mon)===4|| parseInt(mon)===6|| parseInt(mon)===8|| parseInt(mon)===9|| parseInt(mon)===11|| parseInt(mon)===1)){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)+1)+"-01,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if ( (parseInt(day)==29 && parseInt(mon)==2) || (parseInt(yea)% 4 !== 0 && parseInt(day)==28) ){
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+(parseInt(mon)+1)+"-01,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(day)===31 && parseInt(mon)===12){
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+(parseInt(yea)+1)+"-01-01,"+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else{
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-"+(parseInt(day)+1)+","+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }


            }
            else if (e.altKey && e.keyCode == 109) {
                //- minus day
                if (parseInt(rday)>1){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-"+day+","+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+(parseInt(rday)-1)+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(rmon)>1){
                    if (parseInt(rmon)===2 || parseInt(rmon)===4|| parseInt(rmon)===6|| parseInt(rmon)===8|| parseInt(rmon)===9|| parseInt(rmon)===11|| parseInt(rmon)===1){
                        window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-31,"+des+"_"+ori+"_"+ryea+"-"+(parseInt(rmon)-1)+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                    }
                    else if(parseInt(rmon)===3){
                        if (parseInt(ryea)% 4 === 0){
                            window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-29,"+des+"_"+ori+"_"+ryea+"-"+(parseInt(rmon)-1)+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                        }
                        else {
                            window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-28,"+des+"_"+ori+"_"+ryea+"-"+(parseInt(rmon)-1)+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                        }
                    }
                    else{
                        window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-30,"+des+"_"+ori+"_"+ryea+"-"+(parseInt(rmon)-1)+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                    }
                }
                else{
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-12-31,"+des+"_"+ori+"_"+(parseInt(ryea)-1)+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
            }
            else if (e.altKey && e.keyCode == 107) {
                //+ plus day
                if (parseInt(rday)==31 && parseInt(rmon)!==12){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-01,"+des+"_"+ori+"_"+ryea+"-"+(parseInt(rmon)+1)+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(rday)==30 && (parseInt(rmon)===4|| parseInt(rmon)===6|| parseInt(rmon)===8|| parseInt(rmon)===9|| parseInt(rmon)===11|| parseInt(rmon)===1)){

                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-01,"+des+"_"+ori+"_"+ryea+"-"+(parseInt(rmon)+1)+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if ( (parseInt(rday)==29 && parseInt(rmon)==2) || (parseInt(ryea)% 4 !== 0 && parseInt(rday)==28) ){
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-01,"+des+"_"+ori+"_"+ryea+"-"+(parseInt(rmon)+1)+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else if (parseInt(rday)===31 && parseInt(rmon)===12){
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-01-01,"+des+"_"+ori+"_"+(parseInt(ryea)+1)+"-"+rmon+"-"+rday+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }
                else{
                    window.open('https://omb2b.via.com/flight/results/'+ori+"_"+des+"_"+yea+"-"+mon+"-"+day+","+des+"_"+ori+"_"+ryea+"-"+rmon+"-"+(parseInt(rday)+1)+"/"+adt+"-"+chd+"-"+inf+"/ALL/ALL////");
                }


            }
        }
    }
    // register the handler
    document.addEventListener('keydown', doc_keyDown , false);
    // Your code here...
})();