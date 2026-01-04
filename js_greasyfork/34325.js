// ==UserScript==
// @version      17.06.2018
// @name         Sotierbare Pennergame Highscoresuche/liste 2018
// @author        http://sebastian1012.bplaced.net
// @copyright     Basti1012 alias Pennerhack
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @grant       GM_xmlhttpRequest
// @namespace    Eine highscore liste mit sortierfunktionen und extra suche
// @author       pennerhackisback früher basti1012 oder pennerhack
// @description  wer faul ist und klicks ersparen will nimmt dieses script
// @include      *pennergame.de/highscore/*
// @require	 https://code.jquery.com/jquery-3.2.1.min.js 

 
// @downloadURL https://update.greasyfork.org/scripts/34325/Sotierbare%20Pennergame%20Highscoresucheliste%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/34325/Sotierbare%20Pennergame%20Highscoresucheliste%202018.meta.js
 // ==/UserScript==
 function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('body')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}



$('#nav-2   li').eq(4).html(''+$('#nav-1 > li').html()+'<a style="padding:4px 0 4px 15px;" id="bastisuche">Highscoresuche 2018</a>')
   $('#bastisuche').click(function(){
        var url = document.location.href;
        if (url.indexOf("berlin.pennergame.de")>=0) {var link = "http://berlin.pennergame.de"}
        if (url.indexOf("http://www.pennergame")>=0) {var link = "http://www.pennergame.de";}
        if (url.indexOf("dossergame")>=0) {var link = "http://www.dossergame.co.uk";}
        if (url.indexOf("menelgame")>=0) {var link = "http://www.menelgame.pl";}
        if (url.indexOf("clodogame")>=0) {var link = "http://www.clodogame.fr"}
        if (url.indexOf("mendigogame.es")>=0) {var link = "http://www.mendigogame.es"}
        if (url.indexOf("serserionline.com")>=0) {var link = "http://www.serserionline.com"}
        if (url.indexOf("bumrise")>=0) {var link = "http://www.bumrise.com/"}
        if (url.indexOf("muenchen.pennergame")>=0) {var link = "http://muenchen.pennergame.de/"}
        link='https://www.pennergame.de';
        GM_xmlhttpRequest({
		    method: 'GET',
		    url: ''+link+'/city/',
		    onload: function( response ) {
				  var lf = response.responseText;
				  var stadtliste = lf.split('class="listshop">')[1].split('</tr>')[0];
				  var stadtliste1 = stadtliste.split('margin:3px; padding:1px;">')[1].split('</select>')[0];
 				  var meinepunkte = lf.split('class="el1">Punkte:</span><span')[1].split('span>')[0].split('>')[1].split('<')[0];
                  localStorage.setItem('meinepunkte', meinepunkte);
                  localStorage.setItem('stadtliste', stadtliste1);
            }
        });
	    GM_xmlhttpRequest({
		    method: 'GET',
		    url: ''+link+'/fight/overview/',
			        onload: function( response ) {
				          var lf = response.responseText;
				          var attmin = lf.match(/Dein Ziel muss ([0-9]+) bis ([0-9]+) Punkte haben/)[ 1 ];
				          var attmax = lf.match(/Dein Ziel muss ([0-9]+) bis ([0-9]+) Punkte haben/)[ 2 ];
        			      hs2 = Math.round(attmin*1.25/3);
                          localStorage.setItem('attmax', attmax);
	               	      localStorage.setItem('attmin', attmin);		
 					}
	      });
$('html').html('<span class="zur"><a href="javascript:window.history.back();">Zurück</a></span><h2 class="www">Pennergame Highscoresuche 2018</h2> <a class="tooltip" href="#">[Info]<span> <h2>Anleitung:</h2><br /> Die Eingegebene Punkte ist der Bereich wo du die Gegner angreifen kannst<br />Anzahl der durchsuchende Seiten ist dazu da um mehr als 25 Penner anzuzeigen. Lasse dir zb 10 Seiten anzeigen  ,dann hast du gleich 250 Penner die du durch der Sortierfunktion des Scriptes aufsteigen oder Absteigend nach Geld und Punkte anzeigen lassen kannst.Das extra Suchfeld (Erscheint nach den suchen) durchsucht die Gefundene Gegner nochmal.Zb du hast da 250 Penner uund gibst nur ein "H" Ein dann findet er alle Penner und Banden die ein "H" im Namen stehen haben. Probiert es einfach aus .Mfg Basti1012<br /><br /></span></a><div style="disla:flex">                              <input type="text" placeholder="Geld inEuro" value="" title="Cash"  id="search_penner" size="19" min="0" max="99999999" maxlength="8">                       <select name="district" id="search_stadtteil"><option value="">---</option><option value="72">Allermöhe</option>                                                <option value="41">Alsterdorf</option>  <option value="73">Altengamme</option>                                                <option value="85">Altenwerder</option><option value="12">Altona Altstadt</option><option value="13">Altona Nord</option>                   <option value="19">Altstadt</option> <option value="8">Bahrenfeld</option><option value="42">Barmbek-Nord</option>                                                <option value="43">Barmbek-Süd</option><option value="74">Bergedorf</option>                                                <option value="54">Bergstedt</option> <option value="20">Billbrook</option>                                                <option value="103">Billstedt</option> <option value="75">Billwerder</option>                                                <option value="3">Blankenese</option> <option value="21">Borgfelde</option>                                                <option value="55">Bramfeld</option> <option value="86">Cranz</option>                                                <option value="76">Curslack</option>    <option value="44">Dulsberg</option>                                                <option value="56">Duvenstedt</option>                            <option value="30">Eidelstedt</option>                                                <option value="57">Eilbek</option>                             <option value="33">Eimsbüttel</option>                                                <option value="87">Eißendorf</option>        <option value="45">Eppendorf</option>                                                <option value="58">Farmsen-Berne</option>                                <option value="14">Finkenwerder</option>                                                <option value="88">Francop</option>                                                <option value="46">Fuhlsbüttel</option>                                               <option value="47">Groß Borstel</option>                                                <option value="9">Groß Flottbek</option>                                                <option value="89">Gut Moor</option>                                                <option value="28">HafenCity</option>                                                <option value="23">Hamm-Mitte</option>                                                <option value="24">Hamm-Nord</option>                                                <option value="25">Hamm-Süd</option>                                               <option value="22">Hammerbrook</option>                                                <option value="90">Harburg</option>                                                <option value="34">Harvestehude</option>                                                <option value="91">Hausbruch</option>                                                <option value="92">Heimfeld</option>                                                <option value="48">Hoheluft-Ost</option>                                                <option value="35">Hoheluft-West</option>                                                <option value="49">Hohenfelde</option>                                                <option value="26">Horn</option>                                                <option value="59">Hummelsbuettel</option>                                                <option value="4">Iserbrook</option>                                                <option value="60">Jenfeld</option>                                                <option value="77">Kirchwerder</option>                                                <option value="27">Kleiner Grasbrook</option>                                                <option value="93">Langenbek</option>                                                <option value="50">Langenhorn</option>                                                <option value="61">Lemsahl-Mellingstedt</option>                                                <option value="78">Lohbrügge</option>                                                <option value="36">Lokstedt</option>                                                <option value="7">Lurup</option>                                                <option value="62">Marienthal</option>                                                <option value="94">Marmstorf</option>                                                <option value="95">Moorburg</option>                                                <option value="79">Moorfleet</option>                                                <option value="96">Neuenfelde</option>                                                <option value="80">Neuengamme</option>                                                <option value="98">Neugraben-Fischbek</option>                                                <option value="97">Neuland</option>                                                <option value="18">Neustadt</option>                                                <option value="37">Niendorf</option>                                               <option value="5">Nienstedten</option>                                                <option value="81">Ochsenwerder</option>                                                <option value="51">Ohlsdorf</option>                                                <option value="6">Osdorf</option>                                                <option value="10">Othmarschen</option>                                                <option value="11">Ottensen</option>                                                <option value="63">Poppenbuettel</option>                                                <option value="64">Rahlstedt</option>                                                <option value="82">Reitbrook</option>                                                <option value="1">Rissen</option>                                                <option value="99">Rönneburg</option>                                                <option value="29">Rothenburgsort</option>                                                <option value="38">Rotherbaum</option>                                                <option value="65">Sasel</option>                                                <option value="39">Schnelsen</option>  <option value="100">Sinstorf</option>                                               <option value="83">Spadenland</option>                                                <option value="31">St. Georg</option>                                                <option  value="17">St.Pauli</option>                                                <option value="66">Steilshoop</option>                                                <option value="16">Steinwerder</option>                        <option value="40">Stellingen</option><option value="2">Sülldorf</option><option value="84">Tatenberg</option><option value="67">Tonndorf</option>   <option value="52">Uhlenhorst</option><option value="32">Veddel</option><option value="68">Volksdorf</option><option value="15">Waltershof</option><option value="69">Wandsbek</option><option value="70">Wellingsbüttel</option><option value="101">Wilhelmsburg</option> <option value="102">Wilstorf</option><option value="53">Winterhude</option><option value="71">Wohldorf-Ohlstedt</option>                                                                                                                                                                  </select>        <span class="www">                         Min Punkte</span>     <input type="text" value="'+localStorage.getItem('attmin')+'" title="Min" name="min" id="search_min" size="3" maxlength="9">   <span class="www">   Max Punkte </span>  <input type="text" value="'+localStorage.getItem('attmax')+'" title="Max" name="max" id="search_max" size="3" maxlength="9"> <span class="www">Menge Seiten :</span><select id="menge"><option value="2">2</option>  <option value="3">3</option>                 <option value="5">5</option> <option value="7">7</option>            <option value="10">10</option>              <option value="12">12</option>               <option value="15">15</option>  <option value="20">20</option>               <option value="25">25</option>               <option value="30">30</option>                <option value="40">40</option>               <option value="50">50</option> </select>                                                                   <span class="www"> Go:</span><img id="suche" src="https://static.pennergame.de/img/pv4/icons/icon_search-go.png">              <span class="www"> Reset:</span><img id="stop" src="https://static.pennergame.de/img/pv4/icons/icon_search-cancel.png"></div><br>                                             <table id="example" class="display" cellspacing="0" width="100%"><thead><tr><td>Nr</td><td>Platz</td><td>Name</td><td>Bande</td><td>Status</td><td>Stadt</td><td>Reg</td><td> Punkte</td><td>Ranking</td><td>Cash</td><td>Pn/Fight</td></tr></thead><tbody id="rein"></div></tbody></table><footer><a href="http://sebastian1012.bplaced.net">Zur Webseite</a><a style="margin-left:40px" href="http://sebastian1012.bplaced.net/soforthilfe-forum/index.php">Zum Forum ( Suport Scripte )</a><span style="margin-left: 48px; white-space: nowrap;color:white;"> Copyright &copy; 2017 - 2018 <span style="color: #0b5fb4;">B</span>asti1012 &trade;</span><span id="server_clock"></span>   <a   onmouseover="mouseon();" onmouseout="mouseoff();" class="back-to-top">Nach oben</a>       </footer>');   



//https://www.pennergame.de/highscore/user/?name=sex&gang=arsch&district=0&min=1111&max=2222

 
var save='';
 
addGlobalStyle('.tooltip{background:grey;text-decoration:none;}');
addGlobalStyle('.tooltip:hover>span{display:block;}');
addGlobalStyle('.tooltip > span{margin:0;padding:0 20px 0 20px;display:none;width:300px;height:auto;background:black;color:white;    border:3px solid transparent;transition:all 1000ms;}');
addGlobalStyle('.tooltip >span >h2{text-align:center;margin:0;padding:0;width:100%;display:inline-block;border-bottom:3px solid transparent;  overflow:hidden;}');
addGlobalStyle('.tooltip >span:hover{border:3px solid red;transition:all 1000ms;}');
addGlobalStyle('.dataTables_wrapper .dataTables_paginate .paginate_button.disabled{color:white;}');
addGlobalStyle('tr:nth-child(1) >td{color:white;}#example_info{color:white;'); 
addGlobalStyle('tr>td{color:black;}#example_info{color:black;');
addGlobalStyle('h2{text-align:center;display:inlineblock;text-decoration:underline;}');
addGlobalStyle('body{background:#2c2c2c;text-align:center;}.www{color:white;}');
addGlobalStyle('.dataTables_wrapper .dataTables_paginate .paginate_button {color: black !important;}');
addGlobalStyle('footer{position:fixed;bottom:0;left:0;height:22px;border:2px solid white;color:black;background:black;width:100%;display:block;padding:3px;margin-top:40px;}');
addGlobalStyle('.zur{background:white;font-size:27px;padding:3px;color:black;border:3px solid grey;}');
addGlobalStyle('tbody  tr{background:white;}');
addGlobalStyle('table{margin-bottom:250px;}');              
addGlobalStyle('.dataTables_wrapper .dataTables_paginate {margin-bottom: 50px;}'); 
                
    $(".back-to-top").hide();
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) { // Wenn 100 Pixel gescrolled wurde
				$('.back-to-top').fadeIn();
			} else {
				$('.back-to-top').fadeOut();
			}
		});
		$('.back-to-top').click(function () { // Klick auf den Button
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});
    $(".back-to-top").css({'position':'fixed','display':'none','bottom':'10px','right':'20px','z-index':'99','border':'1px solid black','outline': 'none','background-color':' red','color':' white','cursor': 'pointer','padding': '15px','border-radius':' 10px'});
 
 
function mouseon(){
 $(".back-to-top").css('background','green');
}
 
function mouseoff(){
 $(".back-to-top").css('background','red');
}
 
$('#suche').click(function(){
    var d=1,g=0;
    var seiten=$('#menge').val();
    var menge=seiten*23; 
    go(g,menge,seiten,d);
    start2();

})
     
     
$('#stop').click(function(){
    $('#search_penner').val('');
    $('#search_min').val('');
    $('#search_max').val('');
    $('#search_stadtteil').val($('#search_stadtteil > option:first').val()) 
});

 
function go(g,menge,seiten,d){
   pen=$('#search_penner').val();
   std=$('#search_stadtteil').val();
   min=$('#search_min').val();
   max=$('#search_max').val();
  
 
  
   if(d<=seiten){
      GM_xmlhttpRequest({
		   method: 'GET',
		   url: 'https://www.pennergame.de/highscore/user/'+d+'/?name=&gang=&district=0&min='+min+'&max='+max+'',
		   onload: function( response ) {
              try{
			        var lf = response.responseText;
                    var table=lf.split('<tbody')[1].split('</tbody>')[0];
                    for(a=1;a<=24;a++){
                           var tr=table.split('<tr')[a].split('</tr>')[0]; 
                           var id=tr.split('/profil/id:')[1].split('/')[0];
                           var punkte = tr.split('col5" title="None">')[1].split('</td>')[0];
                           var stadt= tr.split('<td class="col4">')[1].split('</td')[0];
                           g++;
                           profil(g,menge,id,pen,punkte,stadt,std);
                    } 
                    end=setTimeout(function(){
                    d++;
                    go(g,menge,seiten,d);
                    },3000);
              }catch(e){
                    $('#test').remove();
                    clearTimeout(end);
              }
      }})
  }
  if(d>seiten){
    clearTimeout(end);
  }
}
 

function profil(g,menge,id,pen,punkte,stadt,std){

      GM_xmlhttpRequest({
    	   method: 'GET',
   		   url: ''+link+'/dev/api/user'+id+'.xml',
		     onload: function(responseDetails) {
        	   var parser = new DOMParser();
        	   var dom = parser.parseFromString(responseDetails.responseText, "application/xml");

			       try {
					         status = dom.getElementsByTagName('status')[0].textContent;
			       } catch (err) {
			                status = 0;
		           }
             		 if (status == 3){
  bandenstatus = '<img src="http://media.pennergame.de/img/bande/admin.gif"><font style=\"color:blue; font-size:100%;\"><b> Admin</b></font>';
			       } else if (status == 2) {
  bandenstatus = '<img src="http://media.pennergame.de/img/bande/coadmin.gif"><font style=\"color:orange; font-size:100%;\"><b>Co-Admin</b></font>';
			       } else if (status == 1) {
  bandenstatus = ' <img src="http://media.pennergame.de/img/bande/member.gif"><font style=\"color:grey; font-size:100%;\"><b>Member</b></font>';
		           } else {
			              bandenstatus = "--";
		           }
		         try {
			            cash = dom.getElementsByTagName('cash')[0].textContent/100;
 
			       } catch (err) {
			             cash = "-";
			       }

               
              var vv=cash/100;
 addGlobalStyle('.an{display:block;}.aus{display:none;}');
 addGlobalStyle('.geld{  width:100px;display:inline-block; overflow:hidden;}');

 addGlobalStyle('.geld>div{background:linear-gradient(to left,#000033,darkblue,red,green,yellow,white);width:10000px;  display:block;}');    

                  city = dom.getElementsByTagName('city')[0].textContent;

               
               
      if(std!=''){     
        if(std==city){
             table()
        }

       }else{
            if(pen!=''){
      
                 if(cash>=pen){
                       table()
                }
            
           } else{
                
                        table()
                
           }
       }      
               
               
               
  function table(){
               var now = dom.getElementsByTagName('points')[0].textContent;
               var status = dom.getElementsByTagName('status')[0].textContent;
               var join = dom.getElementsByTagName('joined')[0].textContent;
       
               var name = dom.getElementsByTagName('name')[0].textContent;
               var position = dom.getElementsByTagName('position')[0].textContent;
               var rank = dom.getElementsByTagName('rankingpoints')[0].textContent; 
     
            
               var reg = dom.getElementsByTagName('reg_since')[0].textContent;
         
               var bid = dom.getElementsByTagName('id')[1].textContent;
               var bname = dom.getElementsByTagName('name')[1].textContent;
 
               var bande='<a href="https://www.pennergame.de/profil/bande:'+bid+'/">'+bname+'</a>';
               var penne='<a href="https://www.pennergame.de/profil/id:'+id+'/">'+name+'</a>';
         var fight ='<a href="/fight/?to='+name+'"><img src="http://media.pennergame.de/de/img/att.png" width="16" height="16"</a>';
var sms ='<a href="/messages/write/?to='+id+'"><img src="http://media.pennergame.de/img/overview/new_msg.gif"</a>';
    
 save+='<tr><td>'+g+'</td><td>'+position+'</td><td>'+penne+'</td><td>'+bande+'</td><td>'+bandenstatus+'</td><td>'+stadt+'</td><td>'+reg+'</td><td>'+punkte+'</td><td>'+rank+'</td><td>'+cash+' &euro;</td><td>'+fight+sms+'</td></tr><br>';
    
  }
 
   if(menge==g){
        ende(save)
 
   } 
   else {
     dd=100/menge;
     m=g*dd;
     m1=m*3;
     m3=m.toFixed(2);
     $('#fortschritt1').css('width',''+m1+'px');
     $('#fortschritt1').html(m3+' %'); 
  }
          
}});
}

 
function ende(save){
// ja=$('#test').hasClass('an');
 // if(ja=='true'){
    $('#test').remove();
 //   $('#test').addClass('aus');
 // }
   
    
    document.getElementById('rein').innerHTML=save; 
    setTimeout(function(){
        $('#example').DataTable();
        var lnk = document.createElement('link');
        lnk.rel = 'stylesheet';
        lnk.type = 'text/css';
        lnk.href = 'https://cdn.datatables.net/1.10.9/css/jquery.dataTables.min.css';
        document.head.appendChild(lnk);
     g=0;
      d=0;
    },1500);
}



function start2(){
addGlobalStyle('div#ladebalken1  {height:15px; width:300px;border:1px solid red; margin:auto}')
addGlobalStyle('div#fortschritt1 {height:15px; width:1px; background-color:blue; border:none}')
 addGlobalStyle('#test {position:absolute;top:1px;left:1px;width:120%;height:500%;z-index:110;background:rgba(0,0,0,0.8);display:none;font-size:8pt;padding:0px;border-radius:0px;border:0px solid blue; transition: all 1s;}');  
 test = document.createElement("div");
 test.setAttribute("id", "test");
   test.setAttribute("class", "an");
 document.getElementsByTagName("body")[0].appendChild(test);
test.style.display="block";
  
 
 addGlobalStyle('#testa {position:absolute;top:202px;left:362px;width:350px;height:210px;z-index:111;background-color:black;display:block;font-size:8pt;color:yellow;padding:0px;border-radius:0px;border:2px solid red;Opacity:0.0;}');  
 testa = document.createElement("div");
 testa.setAttribute("id", "testa");
test.appendChild(testa);
 // testa.style.display="none";
 testa.innerHTML = '<img src="https://cdn.dribbble.com/users/90627/screenshots/1096260/loading.gif" width="300" height="180" alt=""></img><br><center><div id="ladebalken1"><div id="fortschritt1"></div> </div></center><b><center><span id="rein"></span></center></b>';
addGlobalStyle('#testa {transform:rotate(-720deg)scale(2.2);Opacity:1.0;transition: all 2s;'); 

}
 
   });