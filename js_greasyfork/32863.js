// ==UserScript==
// @name			Pennergame Highscore 2017  by pennerhackisback
// @namespace		pennerhackisback früher basti1012 oderpennerhack
// @description		Erzeugtmehrere spalten it einigen informationen für alle penner
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @include     	http://*.pennergame.de/highscore/user/*
// @include     	http://*.pennergame.de/highscore/joindate/*
// @icon			http://javan.de/tools/live/favicon.png
// @version			09.2017
// @downloadURL https://update.greasyfork.org/scripts/32863/Pennergame%20Highscore%202017%20%20by%20pennerhackisback.user.js
// @updateURL https://update.greasyfork.org/scripts/32863/Pennergame%20Highscore%202017%20%20by%20pennerhackisback.meta.js
// ==/UserScript==


	var head =document.getElementsByTagName('head')[0];
	head.innerHTML += '<link rel="icon" type="image/x-icon" href="http://media.pennergame.de/de/img/att.png" />';
var eins = document.getElementById('content');
var zwei = eins.getElementsByTagName('h2')[0];
zwei.innerHTML ='Highscoreanzeige 2017';
document.title = 'Highscoreanzeige 2017 copyright by pennerhackis back früher basti1012 oder pennerhackc';







function ungenaueMillionenWegMachen(differenz, punktefaktor) {

    if (punktefaktor != '')
        differenz = differenz.toString().substring(0, differenz.toString().length - punktefaktor.length) + punktefaktor;
    if (differenz.toString() == '' || differenz.toString() == punktefaktor)
        differenz = 0;

    return differenz;
}

function errechnePunktefaktor(punkte) {
    if (punkte.toString().search("Millionen") != -1)
        punktefaktor = '000';
    else if (punkte.toString().search("Milliarden") != -1)
        punktefaktor = '000000';
	else if (punkte.toString().search("Mrd") != -1)
        punktefaktor = '000000';
    else if (punkte.toString().search("Billionen") != -1)
        punktefaktor = '000000000';
	else if (punkte.toString().search("Billiarden") != -1)
        punktefaktor = '000000000000';
    else
        punktefaktor = '';

    return punktefaktor;
}

function MillionenWegMachen(punkte, punktefaktor) {
    punkte = punkte.replace(/[,€$.]/g, '');
    punkte = punkte.replace(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]/g, '');
    punkte = punkte.replace(/[ ]/g, '');
    punkte = punkte + punktefaktor;
    punkte = parseInt(punkte);

    return punkte;
}






    var ausgabebereich = document.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
    ausgabebereich.innerHTML += '<table class="list" border="1" width="1490"><tbody><tr bgcolor="#272727">'
            +'<th align="center" width="80">Geld </th>'
            +'<th align="center" width="80">Differenz </th>'
            +'<th align="center" width="80">Reg </th>'
            +'<th align="center" width="80">Ranking </th>'
            +'<th align="center" width="80">Status </th>'
            +'<th align="center" width="80">sms </th>'
            +'<th align="center" width="80">Bandeninfos>>>>>> </th>'
            +'<th align="center" width="80">Bande </th>'
            +'<th align="center" width="80">Punkte </th>'
            +'<th align="center" width="80">Position </th>'
            +'<th align="center" width="80">Members </th></tr></tbody></table>';
         //   +'<th class="col7 flag" id="punkte"><div>Sms</div></th>';
                    


    function add(i) {

        var punkte = document.getElementsByTagName('body')[0].innerHTML.split('class="col5')[i + 1].split('">')[1].split('</td>')[0];





        punktefaktor = errechnePunktefaktor(punkte);
        punkte = MillionenWegMachen(punkte, punktefaktor);



        var name = document.getElementsByTagName('body')[0].innerHTML.split('class="username')[i].split('">')[1].split('</a>')[0].split('<')[0];

	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.pennergame.de/dev/api/user.getname.xml?name='+name+'',
		onload: function(responseDetails) {
			var parser = new DOMParser();
            try{
			var dom = parser.parseFromString(responseDetails.responseText, "application/xml");
			var nam = dom.getElementsByTagName('name')[0].textContent;
			var id = dom.getElementsByTagName('id')[0].textContent;
			//var platz = dom.getElementsByTagName('position')[0].textContent;
			var punktenow = dom.getElementsByTagName('points')[0].textContent;
			var reg = dom.getElementsByTagName('reg_since')[0].textContent;
			var rankingpoints = dom.getElementsByTagName('rankingpoints')[0].textContent;
            }catch(e){
            var nam = '---';
			var id =  '---';
			//var platz =  '---';
			var punktenow =  '0';
			var reg =  '---';
			var rankingpoints =  '---';
                
                
                
                
            }
            
				try{
					var bande = dom.getElementsByTagName('name')[1].textContent;
					var bandeid = dom.getElementsByTagName('id')[1].textContent;
		var status = dom.getElementsByTagName('status')[0].textContent;
					var joined = dom.getElementsByTagName('joined')[0].textContent;
					var bandeergebniss = '<a href="/profil/bande:'+bandeid+'/" style="text-decoration: none;">'+bande+'</a>';

                
                

                
                
                    }catch(e){
                        
                        
				var bandeergebniss = '- - -';
                    var bande='--';
                    var bandeid ='---';
                    var joined = '---';
                    var status ='---';
    
        if (status==3) {
       	var statu = '<img src="http://media.pennergame.de/img/bande/admin.gif"><font style=\"color:blue; font-size:100%;\"><b> Admin</b></font>';
        }
        else if (status==2) {
        var statu = '<img src="http://media.pennergame.de/img/bande/coadmin.gif"><font style=\"color:orange; font-size:100%;\"><b> Co-Admin</font>';
        }
        else if (status==1) {
        var statu = '<img src="http://media.pennergame.de/img/bande/member.gif"><font style=\"color:grey; font-size:100%;\"><b> Mitglied</font>';
        }
        else if (status==0) {
        var statu = 'No Bande';
}
                    }
	try{
		var cash = dom.getElementsByTagName('cash')[0].textContent/100;
	}catch(e){
		var cash = '- - -';
	}



var sms ='<a href="/messages/write/?to='+id+'"><img src="http://media.pennergame.de/img/overview/new_msg.gif"</a>';

if (cash >= 500000){
var farbe1 = "black";}
if (cash <= 400000){
var farbe1 = "gray";}
if (cash <= 300000){
farbe1 = "blue";}
if (cash <= 200000){
var farbe1 = "cyan";}
if (cash <= 100000){
farbe1 = "red";}
if (cash <= 50000){
var farbe1 = "green";}
if (cash <= 40000){
farbe1 = "magenta";}
if (cash <= 30000){
farbe1 = "orange";}
if (cash <= 20000){
var farbe1 = "yellow";}
if (cash <= 10000){
var farbe1 = "white";}



                    var differenz = punktenow - punkte;

                    differenz = ungenaueMillionenWegMachen(differenz, punktefaktor);


                    if (differenz > 0) {
                        var color = '00ff00';
                    } else if (differenz == 0) {
                        var color = 'ffc000';
                    } else {
                        var color = 'ff0000';
                    }
bande1(bande,bandeid,name,id,punktenow,reg,rankingpoints,status,cash,joined,farbe1,color,differenz,sms,i)

				//alert(document.getElementsByTagName('table')[i].getElementsByTagName('tr')[i].getElementsByTagName('td')[0].innerHTML);

            }
        });
    }







function bande1(bande,bandeid,name,id,punktenow,reg,rankingpoints,status,cash,joined,farbe1,color,differenz,sms,i) {
    
    	GM_xmlhttpRequest({
    	method: 'GET',
   		url: 'http://www.pennergame.de/dev/api/gang.'+bandeid+'.xml',
		onload: function(responseDetails) {
        	var parser = new DOMParser();
            try{
        	var dom = parser.parseFromString(responseDetails.responseText, "application/xml");
		    var founder = dom.getElementsByTagName('founder')[0].textContent;
		    var pun = dom.getElementsByTagName('points')[0].textContent;
             var pos = dom.getElementsByTagName('position')[0].textContent;
             var mem = dom.getElementsByTagName('member_count')[0].textContent;
                         var namee= dom.getElementsByTagName('name')[0].textContent;
                var blink ='<a href="/profil/bande:'+bandeid+'/">'+namee+'</a>';
            }catch(e){
                var founder = '---';
                var pun = '---';
                var pos  = '---';
                var mem = '---';
                var blink ='---';
                
                
            }
                        document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].innerHTML += ''
                            +'<table class="list" border="1" width="1490"><tbody><tr bgcolor="#272727">'
                        +'<td class="col7"><span style="color:' + farbe1 + '">' + cash + '</span></td>'
                                        +'<td class="col7"><span style="color:#' + color+ '">' + differenz + ' </td>'
                                            +'<td align="center" width="80"> ' + reg + '     </td>'
                                            +'<td align="center" width="80"> ' + rankingpoints + ' </td>'
                                            +'<td align="center" width="80"> ' + status + ' </td>'
                                            +'<td align="center" width="80"> ' + sms + ' </td>'
                                            +'<td align="center" width="80">Bandeninfo>>>>>>>>>>>>>></td>'
                                            +'<td align="center" width="80">'+blink+'</td>'
                                            +'<td align="center" width="80"> ' + pun + ' </td>'
                                            +'<td align="center" width="80"> ' + pos + ' </td>'
                                            +'<td align="center" width="80"> ' + mem + ' </td></tr></tbod></table>';
                        
                           





                var next = i + 1;
                if (next <= 25)
                    add(next);
        }});
}





    add(1);





// Copyright (c) by Javan_xD
// Dieses Werk ist durch eine Creative Commons by-nc-sa Lizenz geschuetzt.
// Bearbeiten oder Vervielfaeltigen ist nur nach Absrache mit dem Autor gestattet.
// Bei Nichtbeachtung werden rechtliche Schritte eingeleitet.