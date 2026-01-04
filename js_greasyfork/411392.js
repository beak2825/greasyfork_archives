// ==UserScript==
// @name		   Highscore Anzeige aus letzten HS Stand mit WB anzeige
// @namespace   T Kanal
// @author			T Kanal
// @description    Highscore Anzeige aus letzten Hs stand + Genaue Server zeit + Wb auslesen + Geld
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @include     	https://*.pennergame.de/profil/*/
// @include     	https://*.pennergame.de/highscore/user/*
// @include      http://*.pennergame.de/profil/*
// @include      https://*.pennergame.de/fight/?status*
// @include      https://*.pennergame.de/highscore/joindate*
// @include      https://*.pennergame.de/highscore/rank*
// @include      https://*.pennergame.de/highscore/user*
// @include      https://*.pennergame.de/profil/id:*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @version			1.8.0
// @downloadURL https://update.greasyfork.org/scripts/411392/Highscore%20Anzeige%20aus%20letzten%20HS%20Stand%20mit%20WB%20anzeige.user.js
// @updateURL https://update.greasyfork.org/scripts/411392/Highscore%20Anzeige%20aus%20letzten%20HS%20Stand%20mit%20WB%20anzeige.meta.js
// ==/UserScript==
var link = 'https://' + window.location.host;
var url = window.location.href;
var aaa = "<b id='server_clock'></b><br />";
var zbig = "25";
var hinterfarbe ="blue";
var zahlfarbe ="black";
var bordera ="10";
var borrad ="100"
var borderf = 'blue';
var VonOben ="115";
var vonseite ="-300";
var fest = "absolute";
var rightleft = "left";
var sichtbar = "2.0";
var time_karton = document.createElement("div");
time_karton.setAttribute('style', 'position:'+fest+';top:'+VonOben+'px;'+rightleft+':'+vonseite+'px; background:'+hinterfarbe+'; -moz-border-radius:'+borrad+'px;-moz-opacity:'+sichtbar+';opacity:'+sichtbar+';border:'+bordera+'px solid '+borderf+';  font:'+zbig+'px arial; z-index:99999;');
document.body.insertBefore(time_karton, document.body.firstChild);
var navigation = document.getElementById("header");
navigation.append(time_karton);
time_karton.innerHTML='<span style=\"color:'+zahlfarbe+'; font-size:2000\">'+aaa+'</span>';




function errechnePunktefaktor(punkte) {
  if (punkte.search("Millionen") != -1){
        punktefaktor = '000';
    }else if  (punkte.search("Milliarden") != -1){
        punktefaktor = '000000';
    }else if (punkte.search("Mrd") != -1){
        punktefaktor = '000000';
    }else if (punkte.search("Billionen") != -1){
        punktefaktor = '000000000';
    }else if (punkte.search("Billiarden") != -1){
        punktefaktor = '000000000000';
    } else
        punktefaktor = '';

    return punktefaktor;
}

function MillionenWegMachen(punkte, punktefaktor) {
    punkte = punkte.replace(/[,€$.]/g, '');
    punkte = punkte.replace(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]/g, '');
    punkte = punkte.replace(/[ ]/g, '');
    punkte = punkte + punktefaktor + ungenaueMillionenWegMachen;
    punkte = parseInt(punkte);

    return punkte;
    }



function ungenaueMillionenWegMachen(differenz, punktefaktor) {

    if (punktefaktor !='000')
        differenz = differenz.toString().substring(0, differenz.toString().length - punktefaktor.length) + punktefaktor;
    if (differenz.toString() == '' || differenz.toString() == punktefaktor)
        differenz = 0;

    return differenz;


    }
function add(i) {


if (url.toString().search("profil") != -1) {

    var name = document.getElementsByTagName('body')[0].innerHTML.split('id="f_name" value="')[1].split('"')[0];
    var punktenow = document.getElementsByTagName('body')[0].innerHTML.split('Punkte</strong></td>')[1].split('" style="')[0];
   var punktenow = parseInt(punktenow.split('323">')[1].split('</td>')[0]);

    var neuerdiv = document.createElement("tr");
    var ausgabebereich = document.getElementsByTagName('table')[6];
   ausgabebereich.appendChild(neuerdiv);



    GM_xmlhttpRequest({
        method: 'GET',
        url:  '/highscore/user/?name='+name+'',
        onload: function (responseDetails) {

            var content = responseDetails.responseText;
            if (content.search(name) != -1) {
                var punkte = content.split('col5" title="None">')[1].split('</td>')[0];
               punktefaktor = errechnePunktefaktor(punkte);
                 punkte = MillionenWegMachen(punkte, punktefaktor);


                var differenz =  punktenow - punkte;
                 differenz = (ungenaueMillionenWegMachen(differenz, punktefaktor));


                if (differenz > 0) {
                    var color = '00ff00';
                } else if (differenz == 0) {
                    var color = 'ffc000';
                } else {
                    var color = 'ff0000';
                }




                //////////////////////////////////////////////////
                function skillhistory(){alert("Test");}
                if   (Math.floor=  differenz > 0 && differenz < 500000 && differenz % 500 == 0  && differenz - 500 == 0 && differenz + 500 !=0     ) {
                    if (true) {
                        var text = "Skill Abschluss !Angaben ohne Gewähr!"
                    }
                } else if (true ) {
                    var text =  "Kein Skill Abgeschlossen !Angaben ohne Gewähr" ;

 //("Tag: " + tag + " Std: " + std + " Min: " + min + " Sec: " + sec )


  //                   var today = new Date();
  //                      var akt = new Date();
  //                     var myVar = setInterval(function(){time()},1);
  //                      var tag =  today.getDate(Math.floor(differenz / 1000*60*60*24));
  //                      var std =  today.getHours(Math.floor(differenz / 1000*60*60));
  //                       differenz =  differenz % (1000*60*60);
  //                      var min =  today.getMinutes(Math.floor(differenz / 1000*60));
  //                      differenz = differenz % (1000*60);
  //                      var sec =  today.getSeconds(Math.floor(differenz / 1000));
                    }

                function Zeit(){alert("Aktuelle Zeit");}
                 var today = new Date();
              //   if (tag =  today.getDate){
                 var tag =  today.getDate();
             //    if (std =  today.getHours){
                 var std =  today.getHours();
             //    if (min =  today.getMinutes) {
                 var min =  today.getMinutes();
             //    if (sec =  today.getSeconds) {
                  var sec =  today.getSeconds();
                     var zeit = ( tag + "(Tag) "   + std + "(Stunde) "   + min + "(Minute) " + sec + "(Sekunde) "  );

                     }


         //////////////////////////////////////////////////
    var urlname2 = url.split('/profil/id:')[1];
var urlname3 = urlname2.split('/')[0];
var id = urlname3;
    var tr = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[3];
var td = tr.getElementsByTagName('td');
 var siglink = 'https://inodes.pennergame.de/de_DE/signaturen/';
td[2].style.fontWeight= "bold";
td[2].innerHTML='Geld:';
 var highlightit0 = 5000;
var highlightit1 = 10000;
var highlightit2 = 20000;
var highlightit3 = 50000;
var highlightit4 = 75000;
var highlightit5 = 125000;
                GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://www.pennergame.de/dev/api/user.' + id  + '.xml',

    onload: function(responseDetails) {
        var parser = new DOMParser();
        var dom = parser.parseFromString(responseDetails.responseText, "application/xml");
		var id = dom.getElementsByTagName('id')[0].textContent;
		var bandenid = dom.getElementsByTagName('id')[1].textContent;

		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://www.pennergame.de/dev/api/gang.'+bandenid+'.xml',
			onload: function(responseDetails) {
                }
						  });


		try {
			var cash = dom.getElementsByTagName('cash')[0].textContent/100;
		} catch(err) {
			var cash = '---';

		}
		var pskript = '<br /> <div style="overflow: hidden; width: 40px; height: 15px;"><img style="position: relative; top: -40px; left: -120px;" src="'+ siglink + id + '.jpg"></div>';


			if (cash >= highlightit0){
			  td[3].style.color = "#25ab22";
				td[3].style.fontWeight = "bold";
			}
			if (cash >= highlightit1){
  	    td[3].style.color = "#84C618";
				td[3].style.fontWeight = "bold";
			}
			if (cash >= highlightit2){
  	    td[3].style.color = "#dfde18";
				td[3].style.fontWeight = "bold";
			}
			if (cash >= highlightit3){
  	    td[3].style.color = "#DE5A18";
				td[3].style.fontWeight = "bold";
			}
			if (cash >= highlightit4){
  	    td[3].style.color = "#df3918";
				td[3].style.fontWeight = "bold";
			}
			if (cash >= highlightit5){
  	    td[3].style.color = "#df1818";
				td[3].style.fontWeight = "bold";
			}
			td[3].innerHTML = ''+cash+'&euro; '+pskript+'';

    }
});
            neuerdiv.innerHTML +='<td colspan="4" bgcolor="#1b1b1b"  rowspan"=13" class="row13";font-size:13px;color:#ffffff">Punktedifferenz aus dem letzten HS-Stand:' + '<br />Punkte: ' + punkte + '<br />Aktuelle Punkte: ' + punktenow +  '<br />Differenz: <span style="color:#' + color + '">' + differenz  +
 '<br /> WB/skill: <span style="color:#FA58F4">' + text  +  '<br /> <span style="color:#00FFFF">Zeit:'   + zeit +'<br /></span></td>';
 //'<br />Aktuelle Zeit:' +  tag   + std  + min  +  '<br />


        }
            });

    function Higscore(){alert("Test");}
} else if (url.toString().search("highscore") != -1) {
    }

///
var ausgabebereich = document.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];

        //////////Errinerung Highscore Tabele
  var punkte = document.getElementsByTagName('body')[0].innerHTML.split('class="col5')[i +1].split('">')[1].split('</td>')[0];
        punktefaktor = errechnePunktefaktor(punkte);
        punkte = MillionenWegMachen(punkte, punktefaktor);
   var name = document.getElementsByTagName('body')[0].innerHTML.split('class="username')[i].split('">')[1].split('</a>')[0].split('<')[0];
    GM_xmlhttpRequest({
            method: 'GET',
            url:  '/dev/api/user.getname.xml?name=' + name,
            onload: function (responseDetails) {
                var content = responseDetails.responseText;
                if (content.search("<points>") != -1) {


                    var punktenow = parseInt(content.split('<points>')[1].split('</points>')[0]);

                    var differenz = punktenow - punkte;

                     differenz = (ungenaueMillionenWegMachen(differenz, punktefaktor));



                    if (differenz > 0) {
                      var color = '00ff00';
                 } else if (differenz == 0) {
                        var color = 'ffc000';
                    } else {
                        var color = 'ff0000';
                    }
// var newtr = document.getElementsByTagName('td')[5];
// newtr.setAttribute("id", "preprogress");
 var newtd = document.getElementsByTagName('table')[0];
 newtd.setAttribute('style',   ' "colspan1",  l; ;font-size: 12px; "width:"5px" target="_blank" ' );
// var newdiv =  document.getElementsByTagName('table')[0]("div");
document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].getElementsByTagName('td')[5].innerHTML+= '<colgroup class="col1"    id="tabnav" color:#000000;"><span  style="color:#' + color  + '"> ' + differenz + '</span></colgroup>';

   //                document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].innerHTML
 // +='<td class="grunge odd" target="_blank" id="fightsearchid:1000002802_1_done" style="cursor: pointer;"   text-align="left"   span style="color:#0000FF" >' + differenz + ' </span></td>';
 //                     += '<a href class="zrelative sitdown" cursor: pointer"  type="checkbox" id="fname" name="fname" bgcolor="#0000FF" value="#0000FF"  text-align="left" style="font-family: Times, serif; font-size: 30px; color:#000000;" ;" ><span" > ' + differenz  + ' </span></a>';

                    }
                function next(){alert("Test");}
                  if (next = i + 1 ) {
                 if (next <= 25) {
                add(next);

                     }
}
            }
        });
    }
    add(1);

