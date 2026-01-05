// ==UserScript==
// @name        Overview Ikariam Icon
// @namespace   Overview Ikariam Icon
// @description Report for Ikariam (table, etc.)
// @author	frapao
// @include     http://s*.ikariam.gameforge.*/*
// @exclude     http://support.*.ikariam.com/index.php?*
// @icon 	http://s3.amazonaws.com/uso_ss/icon/41051/large.jpg
// @grant		 GM_getValue
// @grant		 GM_setValue
// @grant		GM_deleteValue
// @grant		GM_listValues
// @grant		GM_log
// @grant		GM_xmlhttpRequest
// @grant	 	unsafeWindow

// @version     4.42a
// @downloadURL https://update.greasyfork.org/scripts/513/Overview%20Ikariam%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/513/Overview%20Ikariam%20Icon.meta.js
// ==/UserScript==


////GLOBAL VARIABLES////
////===============>>>>> SCRIPT VERSION  !!!!!!!!!!!!!!
var version='Ikariam Overview Icon - 4.42a</td>'

var nameArmy = new Array ();
var countArmy = new Array ();
var s = new XMLSerializer();
var myday=''
var myora=''
var mymin=''
var mysec=''
var balloon=getVar("varTip")
var focusTable=getVar("varFocus")
var giu=getVar("yFine")
var currentId=''
var currentI=''

var view='';
xview=''
viewOn=0

var id ='';

unsafeWindow.ajax.Responder.wtChangeHTML = unsafeWindow.ajax.Responder.changeHTML;

unsafeWindow.ajax.Responder.changeHTML = 
	function(params, replaceView) {
		var id = params[0];  
		unsafeWindow.ajax.Responder.wtChangeHTML(params, replaceView);  
		setTimeout( function() { testing(id);}, 0);  
	}

setInterval (function () {
	elfine=document.getElementsByClassName("footerleft")
	piede=elfine[0]
	yend=trovaY(piede)
	setVar ("yFine",yend)
	},2000)

 //Capacity of a ship
var cap = 500;

// list all buildings

var building = new Array(
"townHall","palace","palaceColony","tavern","museum","academy","workshop","temple",
"embassy","warehouse","dump","port","branchOffice","wall","safehouse","barracks",
"shipyard","forester","carpentering","winegrower","vineyard","stonemason","architect","glassblowing",
"optician","alchemist","fireworker","pirateFortress"
);
var LocalBuilding = new Array();
var IconBuilding = new Array();
var xArmy=new Array(			
	"skin/characters/military/x40_y40/y40_phalanx_faceright.png",
	"skin/characters/military/x40_y40/y40_steamgiant_faceright.png",	
	"skin/characters/military/x40_y40/y40_spearman_faceright.png",
	"skin/characters/military/x40_y40/y40_swordsman_faceright.png",
	"skin/characters/military/x40_y40/y40_slinger_faceright.png",
	"skin/characters/military/x40_y40/y40_archer_faceright.png",
	"skin/characters/military/x40_y40/y40_marksman_faceright.png",
	"skin/characters/military/x40_y40/y40_ram_faceright.png",
	"skin/characters/military/x40_y40/y40_catapult_faceright.png",
	"skin/characters/military/x40_y40/y40_mortar_faceright.png",
	"skin/characters/military/x40_y40/y40_gyrocopter_faceright.png",
	"skin/characters/military/x40_y40/y40_bombardier_faceright.png",
	"skin/characters/military/x40_y40/y40_cook_faceright.png",
	"skin/characters/military/x40_y40/y40_medic_faceright.png",
    "skin/characters/military/x40_y40/y40_spartan_faceright.png"
)

var xFleet=new Array(			
	"ship_flamethrower",
	"ship_steamboat",
	"ship_ram",
	"ship_catapult",
	"ship_ballista",
	"ship_mortar",
	"ship_rocketship",
	"ship_submarine",
	"ship_paddlespeedship",
	"ship_ballooncarrier",
	"ship_tender"
)
var xUnit=new Array(	
	"phalanx",
	"steamgiant",
	"spearman",
	"swordsman",
	"slinger",
	"archer",
	"marksman",
	"ram",
	"catapult",
	"mortar",
	"gyrocopter",
	"bombardier",
	"cook",
	"medic",
    "spartan",
	"ship_flamethrower",
	"ship_steamboat",
	"ship_ram",
	"ship_catapult",
	"ship_ballista",
	"ship_mortar",
	"ship_rocketship",
	"ship_submarine",
	"ship_paddlespeedship",
	"ship_ballooncarrier",
	"ship_tender"
)
	
var townHallSpaces = [0, 60, 96, 142, 200, 262, 332, 410, 492, 580, 672, 768, 870, 976, 1086, 1200, 1320, 1440, 1566, 1696, 1828, 1964, 2102, 2246, 2390, 2540,
		2690, 2845, 3003, 3163, 3326,3492, 3660, 3830, 4004, 4180, 4360, 4540, 4724, 4910, 5098, 5290, 5482, 5678, 5876, 6076, 6278, 6484, 6710];
var MaxInhabitants =[townHallSpaces];
 

//Maximum ships
var Max_ship=10;

var cityNombre = new Array();
var cityRec = new Array();
var islaId = new Array();
var busy=0;
var actionRequest = 0;
var currentCity;
var missCity=new Array () // citys not visited
var JSONcitys = new Array; // all citys (mine)
var othersCitys= new Array () // others city
var cityId = new Array(); //cityId's
var cityIdX = new Array(); //cityId's others army
var cityIdY = new Array(); //cityId's others transport
var cityName = new Array();//citynames (mine)
var cityNameX = new Array();//citynames others army
var cityNameY = new Array();//citynames others transport
var ocCityName=new Array() //citynames occupied
var ocCityId=new Array()
var ocCityCoords=new Array()
var cityRecId = new Array();//cityresourcenumber
var cityRecStr = new Array();//cityresourcestring
var cityCoords = new Array();//citycoords
var islandId = new Array();//islandID of city
var cityaction = new Array();//actionpoints of city
var citypopulation = new Array();//free workforce
var citycitizens = new Array();//total population
var citywood = new Array();//wood in city
var citywine = new Array();//wine in city
var citymarble = new Array();//marble in city
var cityglass = new Array();//glass in city
var citysulfur = new Array();//sulfur in city
var cityReduxUse = new Array(); // wineuse after reduction
var ind_cityId = 0;
var citybuildings;
var servertime;
var CompTime;
var completed;
var ErrorString= '';
var JSONcitydata ='';
var ResSeafaring='';  
var ResEco='';
var ResScience='';
var ResArmy='';
var ResSeafaringlevel=0;
var ResEcolevel=0;
var ResSciencelevel=0;
var ResArmylevel=0;

StyleBuilding = 'style="color:blue;font-weight:bold;text-align:center;background:'
StyleFinished = 'style="color:green;font-weight:bold;text-align:center;background:'



var baseURL = window.location.href.substring(0,window.location.href.indexOf(".php")+4);

//var server=location.href;
var server=window.location.href.substring(7,window.location.href.indexOf('.'))
view  = window.location.href.substring(window.location.href.indexOf(".php")+10,window.location.href.indexOf("&"));
ctry=window.location.href.substring(window.location.href.indexOf('.')+1,window.location.href.indexOf('.ik'))
if (server.indexOf("-")>0) {
    ctry=server.substr(server.indexOf("-")+1)
}
viewchk=window.location.href.indexOf("cityRight")
viewchk1=window.location.href.indexOf("view=city&cityRight=")

var numBuilding=28
var numPlace=18
/*
if (ctry=='it') {
	numBuilding=27
	numPlace=17
}
*/

var resourcetrad = new Array();
resourcetrad[0] = 'wood';
resourcetrad[1] = 'wine';
resourcetrad[2] = 'marble';
resourcetrad[3] = 'crystal';
resourcetrad[4] = 'sulfur';

////////////   bordi colonne e righe
var mark0='<td style="background:gold" width=1></td><td style="background:black" width=1></td>'
var mark= '<td style="background:maroon" width=2></td><td style="background:gold" width=1></td><td style="background:peru" width=0></td>'
var cola='<td style="background:maroon"height=2></td>'
var colb='<td style="background:gold"height=1></td>'
var colc='<td style="background:peru"height=0></td>'
col1=new Array ()
col2=new Array ()
col3=new Array ()
colrep= new Array ()
colrep[0]=56
colrep[1]=43
colrep[2]=41
for (k=0;k<3;k++) {
	col1[k]=''
	col2[k]=''
	col3[k]=''
	for(i=0;i<colrep[k];i++) {
		col1[k]+=cola
		col2[k]+=colb
		col3[k]+=colc
	}
}
var mark1='<tr>'+col1[0]+'</tr>'+'<tr>'+col2[0]+'</tr>'+'<tr>'+col3[0]+'</tr>'
var mark2='<tr>'+col1[1]+'</tr>'+'<tr>'+col2[1]+'</tr>'+'<tr>'+col3[1]+'</tr>'
var mark3='<tr>'+col1[2]+'</tr>'+'<tr>'+col2[2]+'</tr>'+'<tr>'+col3[2]+'</tr>'
///////////////////// 	 getcitysdata call
getcitysdata();
////////////////////////////////////////



var ocupado = 0;
var name;
var citydata = new Array();
for(i=0;i<12;i++){
citydata[i] = new Array(numPlace)
}

for ( i = 0 ; i<12 ; i++){
	for(j=0 ; j<numPlace ; j++){
	citydata[i][j]="0";
	}
}

///////////////////// 	 getcitydata call ////////////
getcitydata() // fill currentcitydata
//////////////////////////////////////////////////////


for(i=0;i<cityName.length;i++){
	var test = GM_getValue(document.location.host+"citybuildings"+cityName[i]);
	if(test) {
  		JSONcitys[i]=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[i]));
  		missCity [i]=' '
  	}else{
   		missCity [i]=cityName[i]
   		//GM_log(i+' '+cityName[i] +'Error! citydata not found , visit city to get data');
  	}
}


for (i=0;i<numBuilding;i++){
	LocalBuilding[i] ='.';
}

elMiss=''


for (i=0; i <cityName.length;i++) { 
	if (!JSONcitys[i] || JSONcitys[i] && JSONcitys[i].name!=cityName[i]) {
		JSONcitys[i]=''
		GM_deleteValue(document.location.host+"citybuildings"+cityName[i])
		ErrorString= trad(ctry,'YOU HAVE NOT VISITED ALL CITIES YET')+'!!!'
		elMiss+='\n'+trad(ctry,'city')+'  "'+missCity[i]+'"  '+trad(ctry,'not visited yet')+'!'
	}else{ 
		for(j=0;j<numPlace;j++){ //for all position in city
	 		for(k=0;k<numBuilding;k++){ // for all possible buildings
				if(JSONcitys[i].position[j].building){
					if(building[k] == JSONcitys[i].position[j].building.replace(' constructionSite','')){  // if building exists...

						LocalBuilding[k] = JSONcitys[i].position[j].name;  // put the local-name in the array
					}else{
					}
				}
			}	
		}
	}
}

if (ErrorString>' ') {
	warn=ErrorString+elMiss
	alert(warn)
}

//actionrequest = a0((document.getElementById("js_ChangeCityActionRequest").value));
//var data=baseURL+'?view=researchAdvisor&oldView=city&cityId=155877&backgroundView=city&currentCityId=155877&actionRequest='+actionrequest+'&backgroundView=city&currentCityId=155877&actionRequest='+actionrequest+'&ajax=1';



function testdata(text){
GetScienceData(text);
}
//ErrorString  = ResSeafaring+" "+ResEco+" "+ResScience+" "+ResArmy;



var body = document;
var text = document.body.innerHTML;


var p,h,n1,n2,n3;

/// ZONA TEST
// 1. aggiunta codice in coda alla sezione head
// 2. dichiarazione di una classe di stili "firma" (vedi http://www.web-link.it/css/4classi.htm)
// 3. il richiamo della classe firma può essere fatta ad es. come <td class="firma">.....</td> o per altri tag (tr, p, ecc.)
 
p=document.head
stile=''
stileh='<style type="text/css">'
stilef='<\style>'



stile1='a.tt1{position:relative;z-index:24;color:#000;'+ //->* Colore del testo che ha il tooltip 
	'font-weight:bold;text-decoration:xnone;}'
stile2='a.tt1 span{ display: none; }'
stile3='a.tt1:hover{ z-index:25; cursor:xhelp;}a.tt1:hover span.tooltip{display:block;position:absolute;top:0px; left:0;padding: 15px 0 0 0;width:200px;'+
	'color: darkred;'+  //->* Colore del testo della descrizione 
	'text-align: left;filter: alpha(opacity:90);KHTMLOpacity: 0.90;MozOpacity: 0.90;opacity: 0.90;}'

stile4='a.tt1:hover span.top{display: block;padding: 30px 8px 0;'+
	'background:url(https:lh6.googleusercontent.com/_nT13UtBmmiU/TY38DxCB58I/AAAAAAAASlM/hysOphmwRQA/bubble.gif) no-repeat top;}'

//// parte di testo
stile5='a.tt1:hover span.middle{display: block;padding: 0 8px;font-weight:bold;font-style:italic;font-family:verdana,Arial, sans-serif;;'+
	'background: url(https:lh3.googleusercontent.com/_nT13UtBmmiU/TY38PxK6qKI/AAAAAAAASlQ/SalZGy8YvoY/bubble_filler.gif) repeat bottom;text-decoration:none;}'

stile6='a.tt1:hover span.bottom{display: block;padding:3px 8px 10px;'+
	'background: url(https:lh6.googleusercontent.com/_nT13UtBmmiU/TY38DxCB58I/AAAAAAAASlM/hysOphmwRQA/bubble.gif) no-repeat bottom;}'

stile=stileh+stile1+stile2+stile3+stile4+stile5+stile6+stilef
p.innerHTML=p.innerHTML+stile


// Tooltip 1 con CSS
//----------------------------------------------- 
//La sintassi per inserire il tooltip è la seguente

//<a href="#" class="ttX">testo che ha il tooltip
//<span class="tooltip">
//<span class="top"></span>
//<span class="middle">Descrizione che sarà visualizzata dentro la finestra del tooltip</span>
//<span class="bottom"></span>
//</span></a>

//stili con le classi (inserire i tag style nella sez. head
//stile='<style type="text/css">'+
//    '.firma {font-family: Verdana, Arial, sans-serif;color: #ff0000;font-size: 9pt;text-align: center;font-style: italic;background:red;}'+
//    '</style>'

 
//p.innerHTML='<div id=questa una storia frapao></div>'
//h=document.createElement('div')
//h.id = "Div di frapao"
//p.appendChild(h)

///FINE ZONA TEST


if (!giu) {giu=780}
giu+=53


p = document.body;
h = document.createElement('div');
h.id = "ResourceDealer";
h.setAttribute('style','z-index:80;position:relative;top:'+giu+'px;margin:0px auto 0px;width:1074px;');
p.appendChild(h);


p = document.getElementById("ResourceDealer");
h = document.createElement('div');
h.id = "menu_dealer";
h.setAttribute('style','padding:7px 0px 7px 0px; position:relative;width:100%;auto 0px;clear:both;float:left;border-color:#C9A584 #5D4C2F #5D4C2F #C9A584;border-style:double;border-width:3px;'+
	'background-image: url(skin/input/button.png) ;text-decoration:none;color:#612d04;font:bold 12px Arial, Helvetica, sans-serif;text-align:left;');
h.innerHTML = '<table align="left" width="100%"><tr>'+
	'<td id="cel_menu_0" align="center" width="5%">'+
	'<td id="cel_menu_1" align="center" width="70%">'+version+
	'<td id="cel_menu_2" align="center" width="5%"></td>'+
	'<td id="cel_menu_3" align="center" width="5%"></td>'+
	'<td id="cel_menu_4" align="center" width="5%"></td>'+
	'<td id="cel_menu_5" align="center" width="5%"></td>'+
	'<td align="right"></td>'+
	//'<td "Ships" id="ships" align="center" width="10%"></td>'+
	'<td id="cel_menu_8" align="right" width="5%"></td>'+
	'</tr></table>';
p.appendChild(h);


p = document.getElementById("ResourceDealer");
h = document.createElement('div');
h.className = 'table1';
h.id = "resourcedealer5";
h.setAttribute('style','position:relative;clear:both;width:100%;float:left;border-color:#C9A584 #5D4C2F #5D4C2F #C9A584;border-style:double;border-width:3px;'+
	'text-decoration:none;color:#612d04;font:bold 12px Arial, Helvetica, sans-serif;');
p.appendChild(h);


p = document.getElementById("ResourceDealer");
h = document.createElement('div');
h.className = 'table2';
h.id = "resourcedealer5-2";
h.setAttribute('style',';position:relative;clear:both;width:100%;float:left;border-color:#C9A584 #5D4C2F #5D4C2F #C9A584;border-style:double;border-width:3px;background-image: url(skin/input/button.png) ;'+
	'text-decoration:none;color:#612d04;font:12px Arial, Helvetica, sans-serif;');
p.appendChild(h);

p = document.getElementById("ResourceDealer");
h = document.createElement('div');
h.className = 'table3';
h.id = "ArmyTable";
h.setAttribute('style',';position:relative;clear:both;width:100%;float:left;border-color:#C9A584 #5D4C2F #5D4C2F #C9A584;border-style:double;border-width:3px;'+
'background-image: url(skin/input/button.png) ;text-decoration:none;color:#612d04;font:bold 12px Arial, Helvetica, sans-serif;');
p.appendChild(h);


p = document.getElementById("ResourceDealer");
h = document.createElement('div');
h.id = "ResourceDealerFooter";
h.setAttribute('style','padding:7px 0px 7px 0px; position:relative;clear:both;float:left;border-color:#C9A584 #5D4C2F #5D4C2F #C9A584;border-style:double;border-width:3px;background-image: url(skin/input/button.png) ;'+
	'text-decoration:none;width:100%;color:#612d04;font:bold 12px Arial, Helvetica, sans-serif;text-align:left;');
h.innerHTML = '<table align="left" width="100%"><tr>'+
		'<td id="celtest" align="left" width="10%"></td>'+
		'<td id="cel_menu_9" align="center">'+
		'<td width="80%"> </td>'+
		'<td id="cel_menu_a" align="center"></tr></table>'
p.appendChild(h);


//ErrorString=''
p = document.getElementById("ResourceDealerFooter");
h = document.createElement('div');
h.id = "ResourceAlert";
h.setAttribute('style','padding:6px 0px 6px 0px; position:relative;clear:both;float:left;border-color:#C9A584 #5D4C2F #5D4C2F #C9A584;border-style:double;'+
	'text-decoration:none;width:100%;color:red;font:bold 14px Arial, Helvetica, sans-serif;text-align:center;');
h.innerHTML =ErrorString
p.appendChild(h);


p = document.body;
h = document.createElement('div');
h.id = "background";
h.setAttribute('style','z-index:-1000;position:relative;overflow:visible;left:0px;top:-110px;height:1200px;width:1200;background-size:1920,1200;background-position:center;'+
//h.setAttribute('style','z-index:-1;position:relative;overflow:visible;left:-8px;top:-110px;height:1200px;width:1920;background-size:1920,1200;background-position:center;'+
	'background-image: url(http://gf2.geo.gfsrv.net/cdn7d/6f875d52eb0d7fad05feca40164375.jpg) ;');
//	'background-image: url(http://gf2.geo.gfsrv.net/cdnaf/061a8c84d2d5c470a7d049f9d90cb8.jpg) ;');
h.innerHTML = ''
//h.innerHTML = 'testing' 
p.appendChild(h);

p = document.body;
h = document.createElement('div');
h.id = "background2";
h.setAttribute('style','z-index:-2000;overflow:visible;position:relative;top:-110px;height:600px;;width:1920;background-size:1920,700;background-position:center;'+
//h.setAttribute('style','z-index:-2;overflow:visible;position:relative;top:-110px;height:600px;;width:1920;background-size:1920,700;background-position:center;'+
'background-image: url(http://gf2.geo.gfsrv.net/cdn7d/6f875d52eb0d7fad05feca40164375.jpg) ;');
h.innerHTML = ''
p.appendChild(h);

//Aggiunto
p = document.body;
h = document.createElement('div');
h.id = "background3";
h.setAttribute('style','z-index:-6000;overflow:visible;position:relative;top:-110px;height:150px;;width:1920;background-size:1920,200;background-position:center;'+
'background-image: url(http://gf2.geo.gfsrv.net/cdn7d/6f875d52eb0d7fad05feca40164375.jpg) ;');
h.innerHTML = ''
p.appendChild(h)


//Navi mercantili
freenavy=document.getElementById("js_GlobalMenu_freeTransporters").innerHTML
totnavy=document.getElementById("js_GlobalMenu_maxTransporters").innerHTML
var dispnavy=freenavy+'/'+totnavy
//Oro totale
tgold=document.getElementById("js_GlobalMenu_gold").innerHTML

xSp1=String.fromCharCode('8192')
xSp=xSp1
for (i=0;i<5;i++) {
	xSp+=xSp
}
///////////////////// 	 cargar_dealers() call ////////////
cargar_dealers();
/////////////////////////////////////////////////////////

if (focusTable==1 && (view=='city' || view=='finances' || (view=='townHall' || view=='cityMilitary') && viewchk>0 
					|| view=='merchantNavy' || view=='militaryAdvisor')) {
	window.scrollBy(0,giu)
}

function cargar_dealers(){

	var d=new Date();
	CompTime = d.getTime();
	CompTime= CompTime/1000;
	cless='<img height="14" src="skin/resources/icon_time.png"> ' 
	scientist='<img height="20" src="/skin/resources/icon_scientist.png"> '
	research='<img height="17" src="/skin/resources/icon_research.png"> '
	magnify='<img height="17" src="/skin/img/magnifySmall.png">'
	rfmagn='<a title="'+trad(ctry,'Overview towns/finances')+'" href="?view=tradeAdvisor&oldView=city&cityId='+currentId+'"</a>'

//---------------------------------------------------------
//-------------------- TAVOLA LIVELLI EDIFICI
//---------------------------------------------------------

	focusCity()

if (focusTable==1 && (xview=='resource' || xview=='tradegood' || view=='city' && viewchk1>0 )) {
	window.scrollBy(0,-giu)
	xview=''
}

	for(k=0;k<numBuilding;k++){ // for all possible buildings
		IconBuilding[k]='';
		if (LocalBuilding[k]>'.') {
			IconBuilding[k]='<img height="30" hspace="0" src="skin/buildings/y100/' + building[k] + '.png" title="' + LocalBuilding[k]+ '">';
		}
	}
	
	////
	////  Accademia (build 5) - Tip su icona
	/////
	if (LocalBuilding[5]=='.') {
		 LocalBuilding[5]=building[5]
	}	
	tipAcc=getVar ("research")
	if (!tipAcc) {
		tipAcc='click !!'
	}else {
		
		ix1=tipAcc.indexOf(';',0)
		ix2=tipAcc.indexOf(': ',ix1)
		ix3=tipAcc.indexOf(';',ix2)
		ix4=tipAcc.indexOf(': ',ix3)
		pointRes=tipAcc.substring(ix2+2,ix3)
		// per i siti tedeschi il "decimal point is comma"
		comma=unsafeWindow.LocalizationStrings.thousandSeperator
		pdec=unsafeWindow.LocalizationStrings.decimalPoint
		pointHour=tipAcc.substring(ix4+2).replace(comma,'').replace(pdec,'.')
		timeRes=StrToNum(getVar("timeRes"))/1000
		pointResDin=formatNum(parseInt(StrToNum(pointRes)+pointHour*(CompTime-timeRes)/3600))
		tipAcc=tipAcc.replace(pointRes,pointResDin)
		pointDay=formatNum(Math.round(pointHour*24))+'/'+trad(ctry,'day')+'; '
		pointWeek=formatNum(Math.round(pointHour*24*7))+'/'+trad(ctry,'week')+')'
		tipAcc1='\n--------->>>>\n('+pointDay+pointWeek
		if (balloon==1) {
			ix=tipAcc.indexOf('-',0)
			iy=tipAcc.indexOf(':',0)
			sub=tipAcc.substring(ix+1,iy)
			tipAcc=tipAcc.replace(sub,scientist)
			ix=tipAcc.indexOf(';',0)
			iy=tipAcc.indexOf(':',ix)
			sub=tipAcc.substring(ix+2,iy)
			tipAcc=tipAcc.replace(sub,research)
		}
		tipAcc+=tipAcc1
	}

	xtitle='title="'+ LocalBuilding[5]+' -\n'+tipAcc+'" '
	fumetto=''
	if (balloon==1 && xtitle.length>20) {
		xtitle=''
		fumetto='<span class="tooltip"><span class="top"></span>'+
		'<span class="middle">'+LocalBuilding[5]+' -\n'+tipAcc+'</span><span class="bottom"></span>'
	}
	IconBuilding[5]='<a href="?view=researchAdvisor&backgroundView=city&cityId='+currentId+'" '+
		xtitle+'class="tt1"><img height="30" hspace="0" src="skin/buildings/y100/' + building[5] + '.png" >'+fumetto+'</a>';
	/////
	////Accademia ex
	////
	
	//"view=city&cityRight="  è parola chiave
	atitle='title="'+trad(ctry,'Show Town')+'" '
	aonclick='onclick="' + "window.open('http://"+document.location.host+"/index.php?view=city&cityRight=&cityId=" + cityId[currentI]+ "','_self')"+'"'
	ahref='  href="javascript:void(0)" </a>'
	link3='<a '+atitle+aonclick+ahref

	tabla=''	
	document.getElementById("resourcedealer5").innerHTML = '';	
	tabla += '<table border="3" bordercolor="#c69262" width="100%">';
	LineStyle = 'style="font-weight:bold;background-image: url(skin/input/button.png) "';
	tabla += '<tr style="max-height:15px;font-weight:bold;background-image:url(skin/input/button.png)"><td width=2% align="center">'+
	link3+'<img height=18 width=21 src="/skin/img/informations/flag_red.png" class="vertical_middle" /></td>'+mark0+
		'<td align="center">'+rfmagn+magnify+'<b>'+trad(ctry,'Towns')+'</td>'+mark

	
	var backgNCurrent = new Array ('#BFC287','#CDD4A6')
	var backgNNotCurrent = new Array ('#EFC287','#FDD4A6')
	
	for (i = 0 ; i < numBuilding ; i++){
		tabla += '<td  align="center" style="max-height:15px;min-width:1px;max-width:30px;overflow:xhidden;font-weight:bold;background-image:url(skin/input/button.png)">'+
			IconBuilding[i]+'</td>'
		if (i==2 || i==4 || i==8 || i==12 || i==16 || i==18 || i==20 || i==22 || i==24 || i==26 || i==27) {tabla+=mark0}
	}
	tabla += '</tr>'

	tabla+=mark1
	

	if (currentI<cityName.length) {
		islandID=parseInt(JSONcitys[currentI].islandId)
		link5='<a onclick="ajaxHandlerCall(this.href);return false;"  href="?view=tradegood&backgroundView=island&islandId='+ islandID+'" </a>'
	}
	xIcon=new Array ()

	for (var i = 0; i < cityName.length; i++) {

		if (cityName[i]==missCity[i]) {
			continue
		}
		
		xsize='font-size:9pt"'
		if (i==currentI) {
			xsize='font-size:10pt"'
		}
		var rem = i%2;		
		backgN=backgNNotCurrent[rem]
		if ( rem >0 )  {
			LineStyle = 'style= "text-align:left;background: #FDD4A6;font-weight:normal"'
		}else	{
			LineStyle = 'style="text-align:left;background: #EFC287;font-weight:normal"'
		}
		if(JSONcitydata){ //worldview
			if(JSONcitydata.name==cityName[i]){
				backgN=backgNCurrent[rem]
				if ( rem >0 ){  // split odd/even lines
					LineStyle = 'style="text-align:left;background: #CDD4A6;font-weight:bold;'+xsize
					LineStyleN = 'style="text-align:center;background: #CDD4A6;font-weight:bold;'+xsize						
				}	
				else	{
					LineStyle = 'style="text-align:left;background: #BFC287;font-weight:bold;'+xsize
					LineStyleN = 'style="text-align:center;background: #BFC287;font-weight:bold;'+xsize
				}
			}
		}
		
		xlink=''
		height1=14
		if (i==currentI) {
			xlink=link5
			height1=18
		}
		islCoord=JSONcitys[i].islandName+' ['+JSONcitys[i].islandXCoord+':'+JSONcitys[i].islandYCoord+']'
		xIcon[i]='<tr height="20"><td align="center" style="background: #eee0c0">'+xlink+'<b>'+
			'<img title="'+islCoord+'" height="'+height1+'" src="skin/resources/icon_'+cityRecStr[i]+'.png"/></td>';
		tabla+=xIcon[i]+mark0
		
		//<a href="#" class="ttX">testo che ha il tooltip
		//<span class="tooltip">
		//<span class="top"></span>
		//<span class="middle">Descrizione che sarà visualizzata all'interno della finestra del tooltip</span>
		//<span class="bottom"></span>
		//</span></a>
		
		titleOcc=''
		if (JSONcitys[i].occupierName) {
			LineStyle= 'style="text-align:left;background: coral;font-weight:bold"'
			titleOcc='title="'+trad(ctry,'City occupied by')+' --> ' +JSONcitys[i].occupierName+'" '
		}
		
		tabla += '<td nowrap '+titleOcc+LineStyle+'><a '+'href="/index.php?view=city&cityId='+cityId[i]+
			'" class="tt1" '+LineStyle+'>' +String.fromCharCode('8192')+cityName[i]+'</a></td>'+mark
			
		portOcc=0
		for (build=0; build<numBuilding ; build++){
			if ( rem >0 ) {
				LineStyle = 'style="text-align:center;font-weight:normal;background: #FDD4A6"'
			}else {
				LineStyle = 'style="text-align:center;font-weight:normal;background: #EFC287"'
			}
			if(JSONcitydata){ //worldview
				if(JSONcitydata.name==cityName[i]){
					if ( rem >0 ){ 
						LineStyle = 'style="text-align:center;background: #CDD4A6;font-weight:bold;'+xsize
						LineStyleN = 'style="text-align:center;background: #CDD4A6;font-weight:bold;'+xsize							
					}	
					else	{
						LineStyle = 'style="text-align:center;background: #BFC287;font-weight:bold;'+xsize
						LineStyleN = 'style="text-align:center;background: #BFC287;font-weight:bold;'+xsize
					}
				}
			}
			var pos=Findbuilding(i,building[build]); //find building position

			if (pos == -1){//--------------------------------------
				tabla += '<td '+ LineStyle +">"+"-"+'</td>';
			}
			else{
				tabla += '<td '+LineStyle+'>';
				tabdif= '<td '+LineStyle+'>'
				var Level = parseInt(JSONcitys[i].position[pos].level);
				lvActive=0
				
				//******** edifici multipli **********************
				if (build==9) {			//edifici multipli : magazzini
					var indMin=3;
					var indMax=numPlace;
				}
				if (build==11) {		//edifici multipli : porti
					var indMin=1;
					var indMax=3;
				}
				if (build==9 || build==11) {    //// magazzini o porti
					var Wlevel=0;
					var WCount = 0;
					for(Wpos=indMin;Wpos<indMax;Wpos++){
						LineStylex=LineStyle;
						var edificio=JSONcitys[i].position[Wpos].building;
						edificio=edificio.replace(' constructionSite','');
						if (build==9) {
							tip1=trad(ctry,'Safe goods')+'='+JSONcitys[i].xsafe
						}else {
							tip1=String.fromCharCode('425')+'  '+JSONcitys[i].chtime
							if (JSONcitys[i].portControllerName) {
								tip1+=',\n'+trad(ctry,'Port occupied by')+' --> '+JSONcitys[i].portControllerName
								portOcc++
								LineStylex= 'style="text-align:center;font-weight:bold;background: orange;'+xsize
							}
						}

						if(edificio==building[build]){
							WCount = WCount +1;
							if(WCount > 1){
								tabla += ' - ';
							}
							XXX=''
							Level = parseInt(JSONcitys[i].position[Wpos].level);
							if(JSONcitys[i].position[Wpos].completed){//--------------
								LineStylex = StyleBuilding+backgN+';'+xsize
								Level=Level+'=>'+(parseInt(Level)+1)

								XXX=tempoNorm(parseInt(JSONcitys[i].position[Wpos].completed-CompTime))
								YYY=Fecha(parseInt(JSONcitys[i].position[Wpos].completed*1000))
								XXX=XXX+'\n('+YYY+')'
								if (balloon==1) {
									XXX=cless+XXX
								}
								if (portOcc>0) {
									XXX+='\n'+trad(ctry,'Port occupied by')+' --> '+JSONcitys[i].portControllerName
								}

								if(JSONcitys[i].position[Wpos].completed < CompTime){
									LineStylex = StyleFinished+backgN+';'+xsize
									Level = parseInt(Level)+1
								}
							}
							if (build==11 && portOcc==1) {
								tabla=tabla.substring(0,tabla.length-tabdif.length)
								tabla+= '<td style="text-align:center;background: coral;font-weight:bold;'+xsize+'>'								
							}
								
							/////************** tip
							tipGen=tip1
							if (XXX>'') {
								tipGen+=' \n --------------->>>\n'+XXX
							}
							tipLv=tipLevel(i,Wpos)
							
							if (tipLv>'') {
								tipGen+=' \n --------------->>>\n'+tipLv
							}
							
							if (balloon==1) {
								xtitle=''
								tipGen=tipGen.replace(/.....\|/g,' /'+xSp1)
								fumetto='<span class="tooltip"><span class="top"></span>'+
								'<span class="middle">'+tipGen+'</span><span class="bottom"></span>'
							}
							else	{
								xtitle='title="'+tipGen+'" '
								fumetto=''
							}
							/////************ tip ex
							tabla += '<a '+LineStylex+xtitle+'href="/index.php?view='+edificio+
							'&cityId='+cityId[i]+'&position='+Wpos+'&oldView=city&backgroundView=city" class="tt1">'+Level+fumetto+'</a>';
						}
					}
					
				}else {      ////************ build != 9 && build != 11   (edifici diversi da magazzini e porti)
					
					tip1=''
					if (build==3 && JSONcitys[i].tavern) {  ////***  Taverna
						tip1=JSONcitys[i].tavern
					}

					if (build==4 && JSONcitys[i].museum) {   ///**** Museo
						tip1=JSONcitys[i].museum
					}

					if (build==5 && JSONcitys[i].scientists) {  ///*** Accademia
						tip1=JSONcitys[i].scientists
						if (balloon==1) {
							tip1=tip1.substring(tip1.indexOf(':'))
							tip1=scientist+tip1
							tip1=tip1.replace('Research',research)
						}
					}
					if (build==14 && JSONcitys[i].movespy) {   ///**** Nascondiglio
						tip1=JSONcitys[i].movespy
						appo=tip1+''
						start=0
						for (len=0;len<JSONcitys[i].movespy.length;len++) {
							ixT=appo.indexOf(': ',start)
							iyT=appo.indexOf(';',ixT) 
							subT=appo.substring(ixT+2,iyT)
							resTime=JSONcitys[i].arrspy[len]-CompTime
							subTnew=tempoNorm(resTime)
							appo=appo.replace(subT,subTnew)
							start=iyT
							if (parseInt(resTime)>0) {
								lvActive=1
							}else {
								lvActive=2
							}
						}
						if (balloon==1) {
							appo=appo.replace(/: /g,': '+cless)
						}
						tip1=appo.replace(/;/g,'').replace(/,/g,'')
					}
					
					if (build==6 && JSONcitys[i].Office) {  ///*** Officina
						tip1=JSONcitys[i].Office
						/// dynamic time
						appo=tip1
						ixT=appo.indexOf('==>',1)
						iyT=appo.indexOf(' (',ixT)
						subT=appo.substring(ixT+3,iyT)
						resTime=JSONcitys[i].OfficeT-CompTime
						subTnew=tempoNorm(resTime)
						appo=appo.replace(subT,subTnew)
						ixP=appo.indexOf('(',0)
						iyP=appo.indexOf('%',ixP)
						perc=appo.substring(ixP,iyP)
						progTime=JSONcitys[i].OfficeX*3600-resTime
						percNew=parseInt(progTime/JSONcitys[i].OfficeX/3600*100)
						if (percNew>100) {
							percNew=100
						}
						percNew='('+percNew
						appo=appo.replace(perc,percNew)
						if (parseInt(resTime)>0) {
							lvActive=1
						}else {
							lvActive=2
						}
						if (balloon==1) {
							appo=appo.replace(/==>/g,'==>'+cless+' : ')
						}
						tip1=appo
					}
					
					if (build==27 && JSONcitys[i].Piracy) {  ///*** Fortezza Pirata
						tip1=JSONcitys[i].Piracy
						/// dynamic time
						appo=tip1
						ixT=appo.indexOf('==>',1)
						iyT=appo.indexOf(';',ixT)
						subT=appo.substring(ixT+3,iyT)
						
						resTime=JSONcitys[i].PiracyT-CompTime
						subTnew=tempoNorm(resTime)
						appo=appo.replace(subT,subTnew)
						//progTime=JSONcitys[i].Piracy*3600-resTime

						if (balloon==1) {
							appo=appo.replace(/==>/g,'==>'+cless+' : ')
						}
						tip1=appo
					}
					
					if (build==15 && JSONcitys[i].upArmy || build==16 && JSONcitys[i].SupArmy) {  ///*** Caserma e Cantiere Navale
						upArmy=new Array()
						upArmyT=new Array()
						if (build==15 && JSONcitys[i].upArmy) {
							upArmy=JSONcitys[i].upArmy	
							upArmyT=JSONcitys[i].upArmyT	
							upArmyX=JSONcitys[i].upArmyX
						}else {
							upArmy=JSONcitys[i].SupArmy	
							upArmyT=JSONcitys[i].SupArmyT	
							upArmyX=JSONcitys[i].SupArmyX
						}
					
						tip1=upArmy
						/// dynamic time
						appo=tip1
						start=0
						for (len=0;len<upArmyT.length;len++) {
							ixT=appo.indexOf('==>',start)
							iyT=appo.indexOf(';',ixT)
							subT=appo.substring(ixT+3,iyT)
							resTime=upArmyT[len]-CompTime
							subTnew=tempoNorm(resTime)
							appo=appo.replace(subT,subTnew).replace('==>','==>\n')
							start=iyT
							if (parseInt(resTime)>0) {
								lvActive=1
							}else {
								lvActive=2
							}
						}
						if (balloon==1) {
							appo=appo.replace(/==>/g,'==>'+cless)
						}
						ixP=appo.indexOf('(',0)
						iyP=appo.indexOf('%',ixP)
						perc=appo.substring(ixP,iyP)
						resTime=upArmyT[0]-CompTime
						progTime=upArmyX-resTime
						percNew=parseInt(progTime/upArmyX*100)
						if (percNew>100) {
							percNew=100
						}
						percNew='('+percNew
						appo=appo.replace(perc,percNew)
						
						tip1=appo
					}

					edificio=JSONcitys[i].position[pos].building;
					edificio=edificio.replace(' constructionSite','');
					if(JSONcitys[i].position[pos].completed){//--------------
						LineStyle = 'style="color:blue;font-weight:bold;text-align:center;'+xsize

						Level=Level+'=>'+(parseInt(Level)+1)
						XXX=tempoNorm(parseInt(JSONcitys[i].position[pos].completed-CompTime))
						YYY=Fecha(parseInt(JSONcitys[i].position[pos].completed*1000))
						XXX=XXX+'\n('+YYY+')'
						if (balloon==1) {
							XXX=cless+XXX
						}

						if(JSONcitys[i].position[pos].completed < CompTime){
							LineStyle = 'style="color:green;font-weight:bold;text-align:center;'+xsize
							Level = parseInt(Level)+1;
						}
					}

					if (JSONcitys[i].position[pos].completed) {
						tipGen=XXX
						if (tip1>'') {
							tipGen=tip1+' \n ---------------->>>\n'+XXX
						}
					} else {
						tipGen=tip1
					}

					tipLv=tipLevel(i,pos)

					if (tipLv>'') {
						if (tipGen>'') {
							tipGen+=' \n ---------------->>>\n'+tipLv
						}else {
							tipGen=tipLv
						}
					}
					if (tipGen=='') {
						tipGen=Level
					}

					xtitle='title="'+tipGen+'" '
					fumetto=''
					if (balloon==1 && tipGen.length>15) {
						xtitle=''
						tipGen=tipGen.replace(/.....\|/g,' /'+xSp1)
						//tipGen=tipGen.replace(/:  /g,xSp1+':'+xSp1+xSp1)
						fumetto='<span class="tooltip"><span class="top"></span>'+
							'<span class="middle">'+tipGen+'</span><span class="bottom"></span>'
					}

					if (lvActive>0) {
						if (lvActive==1) {
							LineStyle = 'style="background:white;color:red;font-size=11pt;font-weight:bold;text-align:center;"'
						}else {
							LineStyle = 'style="background:maroon;color:yellow;font-size=12pt;font-weight:bold;text-align:center;"'
						}
						
					}
					tabla += '<a '+LineStyle+xtitle+'href="/index.php?view='+edificio+
					'&cityId='+cityId[i]+'&position='+pos+'&oldView=city&backgroundView=city" class="tt1">'+Level+fumetto+'</a>';
				}

			}	// chiude if (pos == -1)...else -------------------------

		if (build==2 || build==4 || build==8 || build==12 || build==16 || build==18 || build==20 || build==22 
			|| build==24 || build==26 || build==27) {tabla+=mark0}
		}		// chiude il for (build=0; build<numBuilding ---------------------------------
	}	// chiude il for (var i = 0; i < cityName.length -------------------------;

	tabla += mark1+'</table>';
	document.getElementById("resourcedealer5").innerHTML  = tabla;
	
//-------------------- FINE TAVOLA LIVELLI EDIFICI
		


//---------------------------------------------------------
//-------------------- TAVOLA RISORSE
//---------------------------------------------------------


	tabla ='';
	document.getElementById("resourcedealer5-2").innerHTML = '';
	
	var column=1   // if >0 activated
	tablx='<td align="center" title="'+trad(ctry,'Merchant ships overview and control'+
				'\n____________________________________'+
				'\nyellow=loading goods/troops'+
				'\nred=loading finished'+
				'\nblue=goods/troops in transit'+
				'\ngreen=goods/troops arrived')	+'" style="align=right">'+
	'<a href="/index.php?view=merchantNavy&backgroundView=city">'+
	'<img height="22" src="/skin/characters/fleet/40x40/ship_transport_r_40x40.png">'+
	'</a></td>'+mark

	tabla += '<table style="align:center;font-style:bold" border="3" bordercolor="#c69252" width="100%">';

	link1=''
	link2=''	
	link3=''
	link4=''
	
	islandID=''
	if (currentI<cityName.length) {
		islandID=parseInt(JSONcitys[currentI].islandId)
	}

	link1='<a href="?view=townHall&position=0&oldView=city&backgroundView=city&cityId='+currentId+'"</a>'
	link2='<a href="?view=finances&oldView=city&backgroundView=city"</a>'
	link3='<a title="'+trad(ctry,'Show Island')+'" href="?view=island&islandId=' +islandID+ '"</a>'
	
	///**************** Assegna risorse

	link4='<a onclick="ajaxHandlerCall(this.href);return false;"  href="?view=resource&type=resource&backgroundView=island&islandId='+ islandID+'" </a>'
	link51=link52=link53=link54=''
	height1=21
	height2=16
	height11=height12=height13=height14=18
	height21=height22=height23=height24=12
	txt4=txt5=txt51=txt52=txt53=txt54=''
	if (currentI<cityName.length && JSONcitys[currentI].resourceLevel) {
		txt4='<h style="font-size:8pt">('+JSONcitys[currentI].resourceLevel+')</h>'
		txt5='<h style="font-size:8pt">('+JSONcitys[currentI].tradegoodLevel+')</h>'
	}
	if (currentI<cityName.length) {
		if (cityRecId[currentI]==1) {
			link51=link5
			height11=height1
			height21=height2
			txt51=txt5
		}else {
			if (cityRecId[currentI]==2) {
				link52=link5
				height12=height1
				height22=height2
				txt52=txt5
			}else {
				if (cityRecId[currentI]==3) {
					link53=link5
					height13=height1
					height23=height2
					txt53=txt5
				}else {
					link54=link5
					height14=height1
					height24=height2
					txt54=txt5
				}
			}
		}
	}

	//************** Assegna risorse ex
	
	dwood0=unsafeWindow.LocalizationStrings.wood
	dwood1='<'+trad(ctry,'visit the forest')+'>'
	if (getVar('resource'+JSONcitys[currentI].islandId)) {
		dwood1=getVar('resource'+JSONcitys[currentI].islandId)
		dwood1=normal(dwood1)
	}
	dwood='*** '+dwood0+' ***'+'\n'+dwood1
	
	dwine0=unsafeWindow.LocalizationStrings.wine
	dwine1=''
	if (cityRecId[currentI]==1) {
		if (getVar('tradegood'+JSONcitys[currentI].islandId)) {
			dwine1=getVar('tradegood'+JSONcitys[currentI].islandId)
			dwine1=normal(dwine1)
		}else {
			dwine1='<'+trad(ctry,'visit the Vines')+'>'
		}
	}
	dwine='*** '+dwine0+' ***'+'\n'+dwine1
	
	dmarble0=unsafeWindow.LocalizationStrings.marble
	dmarble1=''
	if (cityRecId[currentI]==2) {
		if (getVar('tradegood'+JSONcitys[currentI].islandId)) {
			dmarble1=getVar('tradegood'+JSONcitys[currentI].islandId)
			dmarble1=normal(dmarble1)
		}else {
			dmarble1='<'+trad(ctry,'visit the Quarry')+'>'
		}
	}
	dmarble='*** '+dmarble0+' ***'+'\n'+dmarble1

	dglass0=unsafeWindow.LocalizationStrings.crystal
	dglass1=''
	if (cityRecId[currentI]==3) {
		if (getVar('tradegood'+JSONcitys[currentI].islandId)) {
			dglass1=getVar('tradegood'+JSONcitys[currentI].islandId)
			dglass1=normal(dglass1)
		}else {
			dglass1='<'+trad(ctry,'visit the Crystal mine')+'>'
		}
	}
	dglass='*** '+dglass0+' ***'+'\n'+dglass1
	
	dsulfur0=unsafeWindow.LocalizationStrings.sulfur
	dsulfur1=''
	if (cityRecId[currentI]==4) {
		if (getVar('tradegood'+JSONcitys[currentI].islandId)) {
			dsulfur1=getVar('tradegood'+JSONcitys[currentI].islandId)
			dsulfur1=normal(dsulfur1)
		}else {
			dsulfur1='<'+trad(ctry,'visit the Sulphur pit')+'>'
		}
	}
	dsulfur='*** '+dsulfur0+' ***'+'\n'+dsulfur1
	
	dgold=unsafeWindow.LocalizationStrings.gold
	dcitz=unsafeWindow.LocalizationStrings.citizens
	
	tabla += '<tr font-weight="bold" height="30"><td width=2%>'+
		link3+'<img width=24 height=23 src="skin/layout/icon-island.png" class="vertical_middle" /></td>'+mark0+
		'<td align="center">'+rfmagn+magnify+'<b>'+trad(ctry,'Towns')+'</td>'+mark+tablx+
		'<td title="'+trad(ctry,'citizens')+', '+trad(ctry,'current population')+'\n'+
		trad(ctry,'maximum population : growth')+'" align="center" colspan="3" >'+ 
	link1 +	'<img title="'+trad(ctry,'citizens')+', '+trad(ctry,'current population')+
	'" align="left" hspace=35 height="24" src="skin/characters/40h/citizen_r.png">'+
	'<img title="'+trad(ctry,'maximum population : growth')+'" height="20" src="skin/icons/growth_positive.png">'+mark0+'</td><td title="'+dgold+'" align="center"; colspan=3>'+
	link2 +	'<img title="'+dgold+'" height="20" src="skin/resources/icon_gold.png"><b></td>'+mark+
	
	'<td title="'+dwood+'" align="center">'+link4+'<b>'+'<img height="21" src="skin/resources/icon_wood.png">'+txt4+'</td>'+
	'<td title="'+dwood0+' ('+trad(ctry,'produced')+')" align="center">'+link4+'<b>'+'<img height="16" src="skin/resources/icon_wood.png"></td>'+mark0+
	'<td title="'+dwine+'" align="center">'+link51+'<b>'+'<img height="'+height11+'" src="skin/resources/icon_wine.png">'+txt51+'</td>'+
	'<td title="'+dwine0+' ('+trad(ctry,'consumption')+')" align="center">'+link51+'<b>'+'<img height="'+height21+'" src="skin/resources/icon_wine.png"></td>'+
	'<td title="'+dwine0+' ('+trad(ctry,'produced')+')" align="center">'+link51+'<b>'+'<img height="'+height21+'" src="skin/resources/icon_wine.png"></td>'+mark0+
	'<td title="'+dmarble+'" align="center">'+link52+'<b>'+'<img height="'+height12+'" src="skin/resources/icon_marble.png">'+txt52+'</td>'+
	'<td title="'+dmarble0+' ('+trad(ctry,'produced')+')" align="center">'+link52+'<b>'+'<img height="'+height22+'" src="skin/resources/icon_marble.png"></td>'+mark0+
	'<td title="'+dglass+'" align="center">'+link53+'<b>'+'<img height="'+height13+'" src="skin/resources/icon_crystal.png">'+txt53+'</td>'+
	'<td title="'+dglass0+' ('+trad(ctry,'produced')+')" align="center">'+link53+'<b>'+'<img height="'+height23+'" src="skin/resources/icon_crystal.png"></td>'+mark0+
	'<td title="'+dsulfur+'" align="center">'+link54+'<b>'+'<img height="'+height14+'" src="skin/resources/icon_sulfur.png">'+txt54+'</td>'+
	'<td title="'+dsulfur0+' ('+trad(ctry,'produced')+')" align="center">'+link54+'<b>'+'<img height="'+height24+'" src="skin/resources/icon_sulfur.png"></td>'+mark0+
	'</tr>'+mark2
	
//////  preleva eventuali altre citta'

	scanCityY ('navyout')
	
	for (var i = 0; i < cityName.length+cityNameY.length; i++) {
		if (i < cityName.length && cityName[i]==missCity[i]) {
			continue
		}
		
		if ( i < cityName.length) {
			wcityName=cityName[i]
			wcity=JSONcitys[i]
			wcityId=cityId[i]
		}else {
			wcityName=cityNameY[i-cityName.length]
			wcity=othersCitys[i-cityName.length]
			wcityId=othersCitys[i-cityName.length].cityIdX
		}
		
		xsize='font-size:9pt"'
		if (i==currentI) {
			xsize='font-size:10pt"'
		}
		
		rem = i%2

		if(!wcity){
			tabla += '<tr><td '+ LineStyle +'>'+(i+1)+'</td>'+mark0+'<td text-align:left;>'+wcityName+'</td>'+
			mark+'<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
		}else	{
			if ( rem >0 )  	{
				LineStyle = 'style="text-align:left;color:black;background: #FDD4A6;font-weight:normal"'
				LineStyleN = 'style="text-align:center;color:black;background: #FDD4A6;font-weight:normal"'
				backgN='#FDD4A6'
			}else	{
				LineStyle = 'style="text-align:left;color:black;background: #EFC287;font-weight:normal"'
				LineStyleN = 'style="text-align:center;color:black;background: #EFC287;font-weight:normal"'
				backgN='#EFC287'
			}

			if ( i < cityName.length) {
				tabla+=xIcon[i]+mark0
			}else {
				if (wcity.hostile) {
					tabla += '<tr><td align="center" style="background:tomato;font-weight:bold;color:white">X</td>'+mark0+'<td nowrap><a '+LineStyle+
						'href="/index.php?view=plunder&destinationCityId='+wcityId+
						'&backgroundView=island">'+String.fromCharCode('8192')+wcityName+'</a></td>'+mark
				}else {
					tabla+= '<tr><td align="center" style="background:green;font-weight:bold;color:white">O</td>'+mark0+'<td nowrap><a '+ LineStyle +
						'href="/index.php?view=defendPort&destinationCityId='+wcityId+
						'&backgroundView=island">'+String.fromCharCode('8192')+wcityName+'</a></td>'+mark
				}
			}

			if(JSONcitydata.name==cityName[i]){
				backgN=backgNCurrent[rem]
				if ( rem >0 ){  
					LineStyle = 'style="text-align:left;color:black;background: #CDD4A6;font-weight:bold;'+xsize
					LineStyleN ='style="text-align:center;color:black;background: #CDD4A6;font-weight:bold;'+xsize					
				}	
				else	{
					LineStyle = 'style="text-align:left;color:black;background: #BFC287;font-weight:bold;'+xsize
					LineStyleN = 'style="text-align:center;color:black;background: #BFC287;font-weight:bold;'+xsize
				}
			}
			Linestylewarning = 'style="color: Crimson;text-align:center;background: '+ backgN+';font-weight:bold;'+xsize
			Linestylewarning0 = 'style="color: purple;text-align:center;background: '+ backgN+';font-weight:bold;'+xsize

			var max0=(StrToNum(wcity.maxstorage));
			max=max0*.75;
			var Time = parseInt(CompTime); //time now
			var citytime=parseInt(wcity.servertime);
			var time = parseInt(Time-citytime)/3600; //time dif 
			var LineN = LineStyleN;
			var Line = LineStyle;
			
			titleOcc=''
			if (wcity.occupierName) {
				LineStyle= 'style="text-align:left;background: coral;font-weight:bold;'+xsize
				titleOcc='title="'+trad(ctry,'City occupied by')+' --> ' +wcity.occupierName+'" '
			}
			
			if (i<cityName.length) {
				tabla += '<td nowrap '+titleOcc+LineStyle +'><a '+ LineStyle +'href="/index.php?view=city&cityId='+wcityId+'">'+
					String.fromCharCode('8192')+wcityName+'</a></td>'+mark
			}

			woodcomp=0
			winecomp=0
			marblecomp=0
			crystalcomp=0
			sulfurcomp=0
			unitcomp=new Array()
			
			for (kk=0;kk<15;kk++) {
				unitcomp[kk]=0
			}
			
			if (i<cityName.length && !wcity.source) {
				LineStyleZ = 'style="text-align:center;background:url(skin/actions/transport.jpg) no-repeat;background-size:27px 52px;'
				filler=String.fromCharCode('8192')+String.fromCharCode('8192')+String.fromCharCode('8192')+String.fromCharCode('8192')
				if (i==currentI) {
						tabla+='<td title="'+trad(ctry,'no transport to the same city')+'"'+
							LineStyleZ +'background-position:50% 100%"'+'>'+filler+'</td>'+mark 
				}else {
					tabla+='<td title="'+trad(ctry,'click for transport goods/army from current city')+'"'+LineStyleZ +'background-position:50% 0%"'+
					'><a href="?view=transport&backgroundView=city&destinationCityId='+wcityId+
					'">'+filler+'</a></td>'+mark

				}
			}
			else {

				info=''
				inf1=''
				inf2=''
				iconstr=''
				green=0
				red=0
				yellow=0

				for (k=0;k<wcity.source.length;k++) {
					if (wcity.chargeSt[k]==1) {
						yellow=1
					}
					arrivo=tempoNorm(wcity.timeArr[k]-CompTime)
					if (arrivo==trad(ctry,'completed')) {
						if (wcity.chargeSt[k]==1) {
							red=1
						}else {
							green=1
						}
						if (wcity.chargeSt[k]==0) {
							/// scarico merci (unloading)
							if (wcity.tr_wood[k]>' ') {
								s_wood=estraiNum (wcity.tr_wood[k])
								wcity.wood=formatNum(parseInt(StrToNum(wcity.wood))+
									parseInt(s_wood))+'"'
							}
							if (wcity.tr_wine[k]>' ') { 
								s_wine=estraiNum (wcity.tr_wine[k])
								wcity.wine=formatNum(parseInt(StrToNum(wcity.wine))+
									parseInt(s_wine))+'"'
							}
							if (wcity.tr_marble[k]>' ') { 
								s_marble=estraiNum (wcity.tr_marble[k])
								wcity.marble=formatNum(parseInt(StrToNum(wcity.marble))+
									parseInt(s_marble))+'"'
							}
							if (wcity.tr_crystal[k]>' ') { 
								s_crystal=estraiNum (wcity.tr_crystal[k])
								wcity.crystal=formatNum(parseInt(StrToNum(wcity.crystal))+
									parseInt(s_crystal))+'"'
							}
							if (wcity.tr_sulfur[k]>' ') { 
								s_sulfur=estraiNum (wcity.tr_sulfur[k])
								wcity.sulfur=formatNum(parseInt(StrToNum(wcity.sulfur))+
									parseInt(s_sulfur))+'"'
							}

							wcity.chargeSt[k]=2
							myJSONText = JSON.stringify(wcity)
							if (i<cityName.length) {					
								nomevar='citybuildings'+wcityName
							}else {
								nomevar='navyout'+wcityName	
							}
							setVar(nomevar,myJSONText)
						}

						if (wcity.chargeSt[k]!=1) {
							if (wcity.tr_wood[k]>' ') {
								woodcomp=1
							}
							if (wcity.tr_wine[k]>' ') { 
								winecomp=1
							}
							if (wcity.tr_marble[k]>' ') { 
								marblecomp=1
							}
							if (wcity.tr_crystal[k]>' ') { 
								crystalcomp=1
							}
							if (wcity.tr_sulfur[k]>' ') { 
								sulfurcomp=1
							}
						}
					} else { 
						xxx=Fechar(parseInt(wcity.timeArr[k])*1000)
						arrivo=arrivo+' ('+trad(ctry,'at')+' '+xxx+')'
					}
					
					strwood=''
					strwine=''
					strmarble=''
					strcrystal=''
					strsulfur=''
					strunit=''
					iconstr=''
					if (wcity.tr_wood[k]>' ') {
						strwood='\n'+wcity.tr_wood[k]
						iconstr=iconstr+'<img height="14" src="skin/resources/icon_wood.png">'
					}
					if (wcity.tr_wine[k]>' ') {
						strwine='\n'+wcity.tr_wine[k]
						iconstr=iconstr+'<img height="14" src="skin/resources/icon_wine.png">'
					}
					if (wcity.tr_marble[k]>' ') {
						strmarble='\n'+wcity.tr_marble[k]
						iconstr=iconstr+'<img height="14" src="skin/resources/icon_marble.png">'
					}
					if (wcity.tr_crystal[k]>' ') {
						strcrystal='\n'+wcity.tr_crystal[k]
						iconstr=iconstr+'<img height="14" src="skin/resources/icon_crystal.png">'
					}
					if (wcity.tr_sulfur[k]>' ') {
						strsulfur='\n'+wcity.tr_sulfur[k]
						iconstr=iconstr+'<img height="14" src="skin/resources/icon_sulfur.png">'
					}


					for (kk=0;kk<15;kk++) {
						if (wcity.tr_unit[k][kk]>' ') {
							strunit=strunit+'\n'+wcity.tr_unit[k][kk]+' - '
							iconstr=iconstr+'<img height="26" src="'+xArmy[kk]+'">'
						}
					}

					infsource=' <== '+wcity.source[k]+' - '
					infmission=wcity.mission[k]+'\n'+' - '
					infgoods=strwood+strwine+strmarble+strcrystal+strsulfur+strunit+ ' - '
					infend=	'\n-----------------------------\n'
					
					infx=infsource+infmission+arrivo+infgoods+infend						

					inf1=iconstr+infsource+infgoods+infmission+cless+arrivo+infend
					inf2=inf2+infx // solo per tip tradizionali (vedi sotto)
					info=info+inf1
				}

				LineStyleNx='style="text-align:center;background:DodgerBlue;font-weight:bold"'
				if (yellow>0) {
					LineStyleNx='style="text-align:center;background:yellow;font-weight:bold"'
				}
				if (red>0) {
					LineStyleNx='style="text-align:center;background:Coral;font-weight:bold"'
				}
				if (green>0) {
				LineStyleNx='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
				}

				if (balloon==1) {
					xtitle=''
					fumetto='<span class="tooltip"><span class="top"></span>'+
						'<span class="middle">'+info+'</span><span class="bottom"></span>'
				}
				else	{
					xtitle='title="'+inf2+'" '
					fumetto=''
				}
				xhref='"?view=merchantNavy&backgroundView=city"'
				if (i!=currentI) {
					xhref='"?view=transport&backgroundView=city&destinationCityId='+wcityId+'"'
				}
				tabla+='<td '+xtitle+'" align="center" '+ LineStyleNx +
					'><a class="tt1" href='+xhref+'><img height="18" width="22" src="/skin/characters/fleet/40x40/ship_transport_r_40x40.png">'+
					fumetto+'</a></td>'+mark

			}


	////////////////////////
			if (!wcity.citizens) {
				wcity.citizens='-'
			}

			tabla += '<td  title="'+trad(ctry,'citizens')+'"'+ LineStyleN +">"+wcity.citizens+'</td>';

			if (StrToNum(wcity.population) >= (wcity.MaxInhabitants)){
				LineStyleN = 'style="color:FireBrick;text-align:center;background:'+backgN+';font-weight:bold;"'
			}
			if (!wcity.population) {
				wcity.population='-'
			}
			tabla += '<td title="'+trad(ctry,'population')+'"'+ LineStyleN +">"+wcity.population;
			LineStyleN = LineN;
			
/*//-----------------------------------------maxinhabitants and growth------

*///---------------------------------	
	///////////////////////////////////////////////////////////////
	// variazione crescita popolazione e soddisfazione (DINAMIC)
	///////////////////////////////////////////////////////////////
	// H = soddisfazione prodotta dalla citta (taverne, musei, accordi, bonus, ricerche)
	// h = soddisfazione corrente = H - p  (p=popolazione)
	// crescita (oraria) = G = dp/dt = h/50 
	//...===> equazione differenziale per separazione di variabili
	//...===> p-p0 = h0*{1-e^[-(t-t0)/50]} ------ h0=soddisfazione al tempo t0= 50*G0
	//...==>  G=G0*e^[-(t-t0)/50]
	////////////////////////////////////////////////////////////
	///// tempo di riempimento città (=tx)
	// pmax ==> popolazione massima
	// p ===> popolazione corrente
	// tx ==> 50*ln {50*G0/[50*G0-(pmax-p)]}
	
			var popGrowth=wcity.PopulationGrowth
			if (wcity.servertimeGrowth) {
				var exp0=-((parseInt(CompTime)-wcity.servertimeGrowth)/(50*3600))
				var exp=Math.pow(2.718281828, exp0)
				var popG0=exp*wcity.PopulationGrowth
				var popG1=Math.round(100*popG0)
				popGrowth=parseInt(popG1)/100
			}

			deltap=0
			if(!wcity.PopulationGrowth){
				popGrowth = '-';
				xGrow=0
			}else {
				deltap= wcity.MaxInhabitants-StrToNum(wcity.population) 
				xGrow=popGrowth
			}
			
			if(wcity.population && StrToNum(wcity.population) >= wcity.MaxInhabitants){
				popGrowth = '#';
			}
			
			if(popGrowth>0) {
				if(JSONcitydata.name==wcityName){
					backgN=backgNCurrent[rem]
				}				
				LineStyleN = 'style="color:darkgreen;text-align:center;background: '+ backgN+';font-weight:bold"'

			}else{
				if(popGrowth<0) {
					LineStyleN = 'style="color:Blue;text-align:center;background: '+ backgN+';font-weight:bold"'
				}
			}
			
			num=50*xGrow
			argo=num/(num-deltap)
			tx=50*Math.log(argo)
			tx1=parseInt(tx*100)/100
			tcomp=trad(ctry,'Full')+' '+trad(ctry,'within') +' : '+tx1+' '+trad(ctry,'hours')
			tcompf=Fecha(1000*(CompTime+tx1*3600))
			tcomp+='\n'+'('+tcompf+')'
			if (num<=deltap) {
				tcomp=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+trad(ctry,'never')
			}
			if (popGrowth=='#') {
				tcomp=trad(ctry,'Full')+' !!'
			}
			
			xtitle='title="'+tcomp+'" '
			fumetto=''
			if (tcomp.length>20&&balloon==1) {
				xtitle=''
				fumetto='<span class="tooltip"><span class="top"></span><span class="middle">'+tcomp+'</span><span class="bottom"></span>'
			}
			xhref='href=?view=townHall&position=0&oldView=city&backgroundView=city&cityId='+cityId[i]+'&cityRight= '
			
			if (!wcity.MaxInhabitants) {
				wcity.MaxInhabitants='-'
			}
			tabla += '<td '+ LineStyleN +'><a '+xhref+LineStyleN+xtitle+'class="tt1">'+
				wcity.MaxInhabitants+':'+popGrowth+fumetto+'</a></td>'+mark0

			
			LineStyleN = LineN;

			if(wcity.Bruto)	{
				tabla += '<td title="'+trad(ctry,'gold')+' '+trad(ctry,'produced')+'"'+ LineStyleN +'>'+wcity.Bruto;
			}else	{
				tabla += '<td title="'+trad(ctry,'gold')+' '+trad(ctry,'produced')+'"'+ LineStyleN +">-";
			}
			
			if(wcity.ScienceCost)	{
				tabla += '<td title="'+trad(ctry,'gold')+' '+trad(ctry,'spent')+' ('+trad(ctry,'scientists')+')"'+ 
					LineStyleN +'>'+wcity.ScienceCost;
			}else	{
			tabla += '<td title="gold spent (scientist)"'+ LineStyleN +">-";
			}
			
			if(wcity.Netto)	{
				tabla += '<td title="'+trad(ctry,'net earning')+'"'+ LineStyleN +'>'+wcity.Netto+mark
			}else	{
				tabla += '<td title="'+trad(ctry,'net earning')+'"'+ LineStyleN +">-"+mark
				}

			normalLine=LineStyleN;
			
//-----------------------------------wood---------------------

			citywood[i] = StrToNum(wcity.wood);			
			var production = parseInt(StrToNum(wcity.woodprod)); 
			production = parseInt(production*time);
			citywood[i]= citywood[i]+production;

			if(citywood[i] > max ){
				LineStyleN = Linestylewarning;
			}
			if(citywood[i] >= max0 ){
				citywood[i]=max0
				LineStyleN = Linestylewarning0;
			}
			if (StrToNum(wcity.woodprod)>0)  {
				secToFull=parseInt((max0-citywood[i])/StrToNum(wcity.woodprod)*3600)
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+tempoNorm(secToFull)
				xfull=Fecha((CompTime+secToFull)*1000)
				full=full+'\n('+xfull+')'
			}
			else {
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+trad(ctry,'never')
			}
			
			if (woodcomp==1) {
				LineStyleN='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
			}
			
			xtitle='title="'+full+'" '
			fumetto=''
			if (full.length>20&&balloon==1) {
				xtitle=''
				fumetto='<span class="tooltip"><span class="top"></span><span class="middle">'+full+'</span><span class="bottom"></span>'
			}
			
			xwood=formatNum(citywood[i])
			if (!citywood[i]) {
				xwood='-'
			}
			tabla += '<td '+ LineStyleN +'><a '+LineStyleN+xtitle+'class="tt1">'+xwood+fumetto+'</a></td>';
			

			LineStyleN=normalLine

			
			prodDay='Prod : '+formatNum(StrToNum(wcity.woodprod)*24)+' / '+trad(ctry,'day')
			if (!wcity.woodprod) {
				wcity.woodprod='-'
			}
			tabla += '<td '+ LineStyleN +'title="'+prodDay+'">'+wcity.woodprod+'</td>'+mark0


//-----------------------------   wine city   ---------------------------------------------------------------
			citywine[i] = StrToNum(wcity.wine);
			var Redux =1;  //start at 100%
			var pos = Findbuilding(i,building[20]);  //building 20 is winepress
			if(pos != -1){
				var Redux = (100-((wcity.position[pos].level)))/100;
			}
			
			production=0;
			if(cityRecId[i] == 1){
				LineStyleN=LineStyleN.substring(0,LineStyleN.length-1)+';color:mediumblue;font-weight:bold;font-style=italic"'
				if(wcity.tradegood) {
					production = StrToNum(wcity.tradegood); 
				}
			}
			prod36=parseInt(production*36)
			production=parseInt(production*time);
			var  HourUse = (wcity.winespending);
			var ReduxUse=Math.round(HourUse*Redux);
			cityReduxUse[i] = ReduxUse;
			var use=parseInt(ReduxUse*time);
			if((citywine[i]+production-use) > (max) ){     //  75% full
				LineStyleN = Linestylewarning;
			}
			warninguse = parseInt(ReduxUse*36)
			if((citywine[i]+prod36-warninguse) < (0) ){     //  empty in 36 hours
				LineStyleN =  Linestylewarning;
			}
			citywine[i]=(citywine[i]-use+production);
			
			if(citywine[i] >= max0 ){
				citywine[i]=max0
				LineStyleN = Linestylewarning0;
			}
			if (cityRecId[i] == 1 && StrToNum(wcity.tradegood)>parseInt(ReduxUse))  {
				secToFull=parseInt((max0-citywine[i])/(StrToNum(wcity.tradegood)-parseInt(ReduxUse))*3600)
				empty=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+tempoNorm(secToFull)
				xempty=Fecha((CompTime+secToFull)*1000)
				empty=empty+'\n('+xempty+')'
			}
			else {				
				wineprod=0
				if (cityRecId[i] == 1) {
					wineprod=StrToNum(wcity.tradegood)
				}
				if (parseInt(ReduxUse)>wineprod) {
					secToEmpty=parseInt(citywine[i]/(parseInt(ReduxUse)-wineprod)*3600)
					empty=trad(ctry,'Empty')+' '+trad(ctry,'within')+' : '+tempoNorm(secToEmpty)
					xempty=Fecha((CompTime+secToEmpty)*1000)
					empty=empty+'\n('+xempty+')'
				}else {
					if (cityRecId[i] == 1) {
						empty=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+trad(ctry,'never')
					}else {
						empty=trad(ctry,'Empty')+' '+trad(ctry,'within')+' : '+trad(ctry,'never')
					}					
				}
			}
			if (winecomp==1) {
				LineStyleN='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
			}
			xtitle='title="'+empty+'" '
			fumetto=''
			
			if (empty.length>20&&balloon==1) {
				xtitle=''
				fumetto='<span class="tooltip"><span class="top"></span><span class="middle">'+empty+'</span><span class="bottom"></span>'
			}
			
			xwine=formatNum(citywine[i])
			if (!citywine[i]) {
				xwine='-'
			}
			tabla += '<td '+ LineStyleN +'><a '+LineStyleN+xtitle+'class="tt1">'+xwine+fumetto+'</a></td>';
			
			LineStyleN=normalLine;
			
			useDay='Use : '+formatNum(parseInt(ReduxUse)*24)+' / '+trad(ctry,'day')
			xuse=parseInt(ReduxUse)
			if (!citywine[i]) {
				xuse='-'
			}
			tabla += '<td '+ LineStyleN +'title="'+useDay+'">'+xuse+'</td>'
			if(cityRecId[i] == 1){
				prodDay='Prod : '+formatNum(StrToNum(wcity.tradegood)*24)+' / '+trad(ctry,'day')
				tabla += '<td '+ LineStyleN +'title="'+prodDay+'">'+wcity.tradegood+'</td>'+mark0
			}else{
				if (i<cityName.length) {
					tabla += '<td '+ LineStyleN +'>#</td>'+mark0
				}else {
					tabla += '<td '+ LineStyleN +'>-</td>'+mark0
				}
			}
			
//-------------------------------marble--------------

			production=0;
			citymarble[i] = StrToNum(wcity.marble);
			if(cityRecId[i] == 2){
				LineStyleN=LineStyleN.substring(0,LineStyleN.length-1)+';color:mediumblue;font-weight:bold;font-style=italic"'
				var production = StrToNum(wcity.tradegood); 
				if(!production){
					production=0;
				}
				production=production*time;
			}
			if((citymarble[i]+production) > (max) ){
				LineStyleN =  Linestylewarning;
			}
			citymarble[i]=parseInt(citymarble[i]+production);
			if(citymarble[i] >= max0 ){
				citymarble[i]=max0
				LineStyleN = Linestylewarning0;
			}
			if (cityRecId[i] == 2 && StrToNum(wcity.tradegood)>0)  {
				secToFull=parseInt((max0-citymarble[i])/StrToNum(wcity.tradegood)*3600)
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+tempoNorm(secToFull)
				xfull=Fecha((CompTime+secToFull)*1000)
				full=full+'\n('+xfull+')'
			}
			else {
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+trad(ctry,'never')
			}
			
			if (marblecomp==1) {
				LineStyleN='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
			}
			xtitle='title="'+full+'" '
			fumetto=''
			if (full.length>20&&balloon==1) {
				xtitle=''
				fumetto='<span class="tooltip"><span class="top"></span><span class="middle">'+full+'</span><span class="bottom"></span>'
						}
			
			xmarble=formatNum(citymarble[i])
			if (!citymarble[i]) {
				xmarble='-'
			}
			tabla += '<td '+ LineStyleN +'><a '+LineStyleN+xtitle+'class="tt1">'+xmarble+fumetto+'</a></td>'
			LineStyleN=normalLine;
			
			if(cityRecId[i] == 2){
				prodDay='Prod : '+formatNum(StrToNum(wcity.tradegood)*24)+' / '+trad(ctry,'day')
				tabla += '<td '+ LineStyleN +'title="'+prodDay+'">'+((wcity.tradegood))+'</td>'+mark0
			}else{
				tabla += '<td '+ LineStyleN +'>#</td>'+mark0
			}

//-------------------crystal-----------------

			production=0;
			cityglass[i] = StrToNum(wcity.crystal);
			if(cityRecId[i] == 3){
				LineStyleN=LineStyleN.substring(0,LineStyleN.length-1)+';color:mediumblue;font-weight:bold;font-style=italic"'
				var production = StrToNum(wcity.tradegood); 
				if(!production){
					production=0;
				}
				production=parseInt(production*time);
			}
			if((cityglass[i]) > (max) ){
				LineStyleN = Linestylewarning;
			}
			cityglass[i]=parseInt(cityglass[i]+production);
			if(cityglass[i] >= max0 ){
				cityglass[i]=max0
				LineStyleN = Linestylewarning0;
			}
			if (cityRecId[i] == 3 && StrToNum(wcity.tradegood)>0)  {
				secToFull=parseInt((max0-cityglass[i])/StrToNum(wcity.tradegood)*3600)
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+tempoNorm(secToFull)
				xfull=Fecha((CompTime+secToFull)*1000)
				full=full+'\n('+xfull+')'
			}
			else {
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+trad(ctry,'never')
			}
			
			if (crystalcomp==1) {
				LineStyleN='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
			}
			xtitle='title="'+full+'" '
			fumetto=''
			//attiva il "tip esteso"
			if (full.length>20&&balloon==1) {
				xtitle=''
				fumetto='<span class="tooltip"><span class="top"></span><span class="middle">'+full+'</span><span class="bottom"></span>'
			}
			
			xglass=formatNum(cityglass[i])
			if (!cityglass[i]) {
				xglass='-'
			}
			tabla += '<td '+ LineStyleN +'><a '+LineStyleN+xtitle+'class="tt1">'+xglass+fumetto+'</a></td>'
			LineStyleN=normalLine
			LineStyle=normalLine;
			if(cityRecId[i] == 3){
				prodDay='Prod : '+formatNum(StrToNum(wcity.tradegood)*24)+' / '+trad(ctry,'day')
				tabla += '<td '+ LineStyleN +'title="'+prodDay+'">'+((wcity.tradegood))+'</td>'+mark0
			}else{
				tabla += '<td '+ LineStyleN +'>#</td>'+mark0
			}

//--------------sulfur---------------------------

			production=0;
			citysulfur[i] = StrToNum(wcity.sulfur);
			if(cityRecId[i] == 4){
				LineStyleN=LineStyleN.substring(0,LineStyleN.length-1)+';color:mediumblue;font-weight:bold;font-style=italic"'
				var production = StrToNum(wcity.tradegood); 
				if(!production){
					production=0;
				}
				production=parseInt(production*time);
			}
			if((citysulfur[i]+production) > (max) ){
				LineStyleN =  Linestylewarning;
			}
			citysulfur[i]=parseInt(citysulfur[i]+production);
			if(citysulfur[i] >= max0 ){
				citysulfur[i]=max0
				LineStyleN = Linestylewarning0;
			}
			if (cityRecId[i] == 4 && StrToNum(wcity.tradegood)>0)  {
				secToFull=parseInt((max0-citysulfur[i])/StrToNum(wcity.tradegood)*3600)
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+tempoNorm(secToFull)
				xfull=Fecha((CompTime+secToFull)*1000)
				full=full+'\n('+xfull+')'
			}
			else {
				full=trad(ctry,'Full')+' '+trad(ctry,'within')+' : '+trad(ctry,'never')
			}
			
			if (sulfurcomp==1) {
				LineStyleN='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
			}
			xtitle='title="'+full+'" '
			fumetto=''
			if (full.length>20&&balloon==1) {
				xtitle=''
				fumetto='<span class="tooltip"><span class="top"></span><span class="middle">'+full+'</span><span class="bottom"></span>'
			}
			
			xsulfur=formatNum(citysulfur[i])
			if (!citysulfur[i]) {
				xsulfur='-'
			}
			tabla += '<td '+ LineStyleN +'><a '+LineStyleN+xtitle+'class="tt1">'+xsulfur+fumetto+'</a></td>';
			
			LineStyleN=normalLine
			LineStyle=normalLine;
			if(cityRecId[i] == 4){
				prodDay='Prod : '+formatNum(StrToNum(wcity.tradegood)*24)+' / '+trad(ctry,'day')
				tabla += '<td '+ LineStyleN +'title="'+prodDay+'">'+((wcity.tradegood))+'</td>';
			}else{
				tabla += '<td '+LineStyleN +'>#</td>';
			}
			tabla +=mark0
		}
	tabla +='</tr>'
	}
////////// Fine FOR (-i-) sulle city

	tabla +=mark2

//---------------------- RIGHE DEI TOTALI RISORSE

	tabla +='<tr   style="color:black;font-family:times new roman,sans-serif;font-size:11pt;font-weight:bold"><td></td>'+mark0+
		'<td  >'+trad(ctry,'Total')+'</td>'+mark+'<td style="font-size:8pt" align="center" title="">'+dispnavy+'</td>'+mark
			
	var val=0;
	var sum=0;
	for(i = 0 ; i < cityName.length; i++){
		val=(StrToNum(JSONcitys[i].citizens));
		sum = sum+val;
	}
	tabla +='<td title="'+trad(ctry,'total citizens')+'" align="center">'+formatNum(sum);

	var val=0;
	var sum=0;
	var sum1=0
	for(i = 0 ; i < cityName.length; i++){
		val =(StrToNum(JSONcitys[i].population));
		sum = sum+val;
		sum1=sum1+(StrToNum(JSONcitys[i].MaxInhabitants))
	}
	tabla +='<td title="'+trad(ctry,'total population')+'" align="center">'+formatNum(sum);

	//tabla +='<td align="center">'+ '-+-';
	tabla +='<td title="'+trad(ctry,'population limit')+'" align="center">'+formatNum(sum1);

	var wstyle=''
	if (StrToNum(JSONcitys[0].goldHour)<0) {wstyle='style="color : red"'}
	tabla += mark0+'<td title="'+trad(ctry,'gold held')+'" align="center" >'+tgold+'</td><td></td><td '+
		wstyle+' align="center" title="'+trad(ctry,'net earning')+' / '+trad(ctry,'hour')+'">'+
		JSONcitys[0].goldHour+' *</td>'+mark

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		val=citywood[i];
		sum = sum+val;
	}
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Building material')+'" align="center">'+formatNum(sum);

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		val =(StrToNum(JSONcitys[i].woodprod));
		sum = sum+val;
	}
	var daywood=sum*24;
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Building material')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'hour')+'" align="center">'+formatNum(sum)+mark0

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		val=citywine[i];
		sum = sum+val;
	}
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Wine')+'" align="center">'+formatNum(sum);

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		val = cityReduxUse[i];
		sum = sum+val;
	}
	sum = parseInt(sum);
	var daywinespend=sum*24;
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Wine')+
		' '+trad(ctry,'consumed')+' / '+trad(ctry,'hour')+'" align="center">'+formatNum(sum)

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		if(cityRecId[i] == 1){
			val =(StrToNum(JSONcitys[i].tradegood));
			sum = sum+val;
		}
	}
	var daywine=sum*24;
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Wine')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'hour')+'" align="center">'+formatNum(sum)+mark0

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		val=citymarble[i];
		sum = sum+val;
	}
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Marble')+'" align="center">'+formatNum(sum);

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		if(cityRecId[i] == 2){
			val =(StrToNum(JSONcitys[i].tradegood));
			sum = sum+val;
		}
	}
	var daymarble=sum*24;
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Marble')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'hour')+'" align="center">'+formatNum(sum)+mark0

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		val=cityglass[i];
		sum = sum+val;
	}
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Crystal Glass')+'" align="center">'+formatNum(sum);

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		if(cityRecId[i] == 3){
			val =(StrToNum(JSONcitys[i].tradegood));
			sum = sum+val;
		}
	}
	var daycrystal=sum*24;
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Crystal Glass')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'hour')+'" align="center">'+formatNum(sum)+mark0
	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		val=citysulfur[i];
		sum = sum+val;
	}
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Sulphur')+'" align="center">'+formatNum(sum);

	var val =0;
	var sum =0;
	for(i = 0 ; i < cityName.length; i++){
		if(cityRecId[i] == 4){
			val =(StrToNum(JSONcitys[i].tradegood));
			sum = sum+val;
		}
	}
	var daysulfur=sum*24;
	tabla +='<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Sulphur')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'hour')+'" align="center">'+formatNum(sum)
	var goldD=StrToNum(JSONcitys[0].goldHour)*24
	if (goldD>0) { 
		var goldDay=formatNum(goldD)
	}else {  var goldDay='-'+formatNum(-goldD)
	}


	tabla += mark0+'<tr style="color:black;font-family:times new roman,sans-serif;font-size:11pt;font-weight:bold"><td ></td>'+
			mark0+'<td >'+trad(ctry,'Total/day')+'</td>'+mark+
		'<td title=""  style="color:black;font-family:verdana,Arial, sans-serif;font-size:9pt"></td>'+mark
////////////////////////

	tabla += '<td></td>';//cityname
	tabla += '<td></td>';//citizens
	tabla += '<td></td>'+mark0
	tabla += '<td></td>'
	tabla += '<td></td>';//money
	var wstyle=''
	if (goldD<0) {wstyle='style="color : red"'}
	tabla += '<td '+wstyle+' align="center" title="'+trad(ctry,'net earning')+' / '+trad(ctry,'day')+'">'+goldDay+'*</td>'+mark
	tabla += '<td></td>'
	tabla += '<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Building material')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'day')+'" align="center">'+formatNum(daywood)+'</td>'+mark0+'<td></td>'
	tabla += '<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Wine')+
		' '+trad(ctry,'consumed')+' / '+trad(ctry,'day')+'" align="center">'+formatNum(daywinespend)+'</td>'
	tabla += '<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Wine')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'day')+'" align="center">'+formatNum(daywine)+'</td>'+mark0
	tabla += '<td></td><td title="'+trad(ctry,'Total')+' '+trad(ctry,'Marble')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'day')+'" align="center">'+formatNum(daymarble)+'</td>'+mark0
	tabla += '<td></td><td title="'+trad(ctry,'Total')+' '+trad(ctry,'Crystal Glass')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'day')+'" align="center">'+formatNum(daycrystal)+'</td>'+mark0+'<td></td>'
	tabla += '<td title="'+trad(ctry,'Total')+' '+trad(ctry,'Sulphur')+
		' '+trad(ctry,'produced')+' / '+trad(ctry,'day')+'" align="center">'+formatNum(daysulfur)+'</td>'+mark0
	//-------------------------------------------------------------------------------
	

	tabla +='</tr></table>';
	
	document.getElementById("resourcedealer5-2").innerHTML  = tabla;

//-------------------- FINE TAVOLA RISORSE


//////////////////////////////////////////********************************/////////////////////////////////////////////
//---------------------------------------------------------
//-------------------- TAVOLA UNITA' MILITARI
//---------------------------------------------------------
///////////////////////////********************************************///////////////////////////////////////////////

	tabla ='';
	document.getElementById("ArmyTable").innerHTML = '';
	
	tablx='<td align="center" title="'+trad(ctry,'Military overview and control')+'">'+
	'<a href="/index.php?view=militaryAdvisor&backgroundView=city">'+
	'<table><tr><img height="14" width="25" src="skin/interface/mission_deployfleet.png">'+
	'<tr><img height="14" width="25" src="skin/interface/mission_deployarmy.png"></table></a></td>'+mark
///////////////////////////////
	

	apcurrentI=currentI
	if (currentI==cityName.length) {

		currentI=0
	}
	islX=cityCoords[currentI].substring(cityCoords[currentI].indexOf('[')+1,cityCoords[currentI].indexOf(':'))
	islY=cityCoords[currentI].substring(cityCoords[currentI].indexOf(':')+1,cityCoords[currentI].indexOf(']'))

	tabla += '<table align="center" border="3" bordercolor="#969262" width="100%">';
	tabla += '<tr font-weight="bold" height="30"><td width=2% align="center">'+ 
		'<a title="'+trad(ctry,'Show World')+'" href="?view=worldmap_iso&islandX='+islX+'&islandY='+islY+'">'+
		'<img src="skin/layout/icon-world.png" ></a></td>'+mark0+'<td align="center">'+
		rfmagn+magnify+'<b>'+trad(ctry,'Towns')+'</td>'+mark+tablx+
		'<td align="center";'

	currentI=apcurrentI
	LineStyle = '<td style="max-height:20px;min-width: 20px; max-width: 30px; overflow: hidden;font-weight:bold;background-image: url(skin/input/button.png)">';
	var imgHeight='<img height="30" src="';
	
	xnameArmy= new Array ()

	if (!JSONcitys[0].nameArmy) {
		for (k=0;k<26;k++) {
			xnameArmy[k]='Army'+k
		}
		JSONcitys[0].nameArmy=xnameArmy
	}
	
	
	var skinArmy=new Array (
	
	"skin/characters/military/x60_y60/y60_phalanx_faceright.png",		JSONcitys[0].nameArmy[0],
	"skin/characters/military/x60_y60/y60_steamgiant_faceright.png",	JSONcitys[0].nameArmy[1],	
	"skin/characters/military/x60_y60/y60_spearman_faceright.png",		JSONcitys[0].nameArmy[2],
	"skin/characters/military/x60_y60/y60_swordsman_faceright.png",		JSONcitys[0].nameArmy[3],
	"skin/characters/military/x60_y60/y60_slinger_faceright.png",		JSONcitys[0].nameArmy[4],
	"skin/characters/military/x60_y60/y60_archer_faceright.png",		JSONcitys[0].nameArmy[5],
	"skin/characters/military/x60_y60/y60_marksman_faceright.png",		JSONcitys[0].nameArmy[6],
	"skin/characters/military/x60_y60/y60_ram_faceright.png",		JSONcitys[0].nameArmy[7],
	"skin/characters/military/x60_y60/y60_catapult_faceright.png",		JSONcitys[0].nameArmy[8],
	"skin/characters/military/x60_y60/y60_mortar_faceright.png",		JSONcitys[0].nameArmy[9],
	"skin/characters/military/x60_y60/y60_gyrocopter_faceright.png",	JSONcitys[0].nameArmy[10],
	"skin/characters/military/x60_y60/y60_bombardier_faceright.png",	JSONcitys[0].nameArmy[11],
	"skin/characters/military/x60_y60/y60_cook_faceright.png",		JSONcitys[0].nameArmy[12],
	"skin/characters/military/x60_y60/y60_medic_faceright.png",		JSONcitys[0].nameArmy[13],
        "skin/characters/military/x60_y60/y60_spartan_faceright.png",		JSONcitys[0].nameArmy[14],
	"skin/characters/fleet/60x60/ship_flamethrower_faceright.png",		JSONcitys[0].nameArmy[15],
	"skin/characters/fleet/60x60/ship_steamboat_faceright.png",		JSONcitys[0].nameArmy[16],
	"skin/characters/fleet/60x60/ship_ram_faceright.png",			JSONcitys[0].nameArmy[17],
	"skin/characters/fleet/60x60/ship_catapult_faceright.png",		JSONcitys[0].nameArmy[18],
	"skin/characters/fleet/60x60/ship_ballista_faceright.png",		JSONcitys[0].nameArmy[19],
	"skin/characters/fleet/60x60/ship_mortar_faceright.png",		JSONcitys[0].nameArmy[20],
	"skin/characters/fleet/60x60/ship_rocketship_faceright.png",		JSONcitys[0].nameArmy[21],
	"skin/characters/fleet/60x60/ship_submarine_faceright.png",		JSONcitys[0].nameArmy[22],
	"skin/characters/fleet/60x60/ship_paddlespeedship_faceright.png",	JSONcitys[0].nameArmy[23],
	"skin/characters/fleet/60x60/ship_ballooncarrier_faceright.png",	JSONcitys[0].nameArmy[24],
	"skin/characters/fleet/60x60/ship_tender_faceright.png",		JSONcitys[0].nameArmy[25]
	
	);
	
	ulink=''
	ulink='<a href="/index.php?view=cityMilitary&activeTab=tabUnits&oldView=city&backgroundView=city&cityId='+currentId+'"</a>'

	for (k=0; k<52; k=k+2) {
		if (k>28) {
			ulink='<a href="/index.php?view=cityMilitary&activeTab=tabShips&oldView=city&backgroundView=city&cityId='+
				currentId+'"</a>'
		}
		tabla += LineStyle + ulink + 
		imgHeight + skinArmy[k] + '" title="' + skinArmy[k+1] + '"></td>';
		if (k==28) {
			tabla+=mark
		}
	}
	
	tabla +=mark0+'</tr>'+mark3

	var wcountArmy = new Array ();
	var sumArmy = new Array();
	for (var k = 0; k < 26; k++) {
		sumArmy[k]=0;
		wcountArmy[k]=0
	}
///////////////////**************************** INIZIO LOOP CITTA'
//////  preleva eventuali altre citta'
 

 scanCityX ('armyout')
	
	for (var i = 0; i < cityName.length+cityNameX.length+ocCityName.length; i++) {

		if (i < cityName.length && cityName[i]==missCity[i]) {
			continue
		}

		if ( i < cityName.length) {
			wcityName=cityName[i]
			wcity=JSONcitys[i]
			wcityId=cityId[i]
		}else {
			if (i < cityName.length+cityNameX.length) {
				wcityName=cityNameX[i-cityName.length]
				wcity=othersCitys[i-cityName.length]
				wcityId=cityIdX[i-cityName.length]
			}else {
				wcityName=ocCityName[i-cityName.length-cityNameX.length]
				wcityId=ocCityId[i-cityName.length-cityNameX.length]
				wcityCoords=ocCityCoords[i-cityName.length-cityNameX.length]
				wcity=new Object()
				wcity.sourceN=''
				wcity.hostile=1
			}
		}

		xsize='font-size:8pt'
		if (i==currentI) {
			xsize='font-size:10pt"'
		}
		var rem = i%2;
		
		if ( rem >0 ){  
			LineStyle = 'style=" height:20px;text-align:left;color:black;background: #FDD4A6;font-weight:normal"'
			LineStyleN = 'style="text-align:center;color:black;background: #FDD4A6;font-weight:normal"'
		}	
		else{
			LineStyle = 'style=" height:20px;text-align:left;color:black;background: #EFC287;font-weight:normal"'
			LineStyleN = 'style="text-align:center;color:black;background: #EFC287;font-weight:normal"'
		}
		if(JSONcitydata){ 
			if(JSONcitydata.name==cityName[i]){
				var rem = i%2;
				if ( rem >0 ){  // split odd/even lines
					LineStyle = 'style="text-align:left;color:black;background: #CDD4A6;font-weight:bold;'+xsize
					LineStyleN = 'style="text-align:center;color:black;background: #CDD4A6;font-weight:bold;'+xsize							
				}	
				else	{
					LineStyle = 'style="text-align:left;color:black;background: #BFC287;font-weight:bold;'+xsize
					LineStyleN = 'style="text-align:center;color:black;background: #BFC287;font-weight:bold;'+xsize
				}
			}
		}

		titleOcc=''
		if ( i < cityName.length && JSONcitys[i].occupierName) {
			LineStyle= 'style="text-align:left;background: coral;font-weight:bold"'
			titleOcc='title="'+trad(ctry,'City occupied by')+' --> ' +JSONcitys[i].occupierName+'" '
		}
		
		if ( i < cityName.length && !wcity.hostile) {
			tabla +=xIcon[i]+'</td>'+mark0+'<td nowrap '+titleOcc+LineStyle+
				'><a '+ LineStyle +'href="/index.php?view=cityMilitary&activeTab=tabUnits&oldView=city&backgroundView=city&cityId='+
			wcityId+'&cityRight=">'+String.fromCharCode('8192')+wcityName+'</a></td>'+mark
		}else {
			xref='href="/index.php?view=blockade&destinationCityId='
			if (i < cityName.length) {
				xref='href="/index.php?view=defendPort&destinationCityId='
			}
			if (wcity.hostile) {
				tabla += '<tr><td align="center" style="background:tomato;font-weight:bold;color:white">X</td>'+mark0+'<td nowrap><a '+ LineStyle +
					xref+wcityId+'&backgroundView=island">'+String.fromCharCode('8192')+wcityName+'</a></td>'+mark
			}else {
				xref='href="/index.php?view=defendPort&destinationCityId='
				tabla += '<tr><td align="center" style="background:green;font-weight:bold;color:white">O</td>'+mark0+'<td nowrap><a '+ LineStyle +
					xref+wcityId+'&backgroundView=island">'+String.fromCharCode('8192')+wcityName+'</a></td>'+mark
			}
		}

		unitcompN=new Array()

		for (kk=0;kk<26;kk++) {
			unitcompN[kk]=0
		}

		linkfleet='<a title="'+trad(ctry,'deploy fleet')+'" class="tt1" href="?view=deployment&deploymentType=fleet'+
			'&destinationCityId='+wcityId+'&backgroundView=island">'
		linkarmy='<a title="'+trad(ctry,'deploy army')+'" class="tt1" href="?view=deployment&deploymentType=army'+
			'&destinationCityId='+wcityId+'&backgroundView=island">'
		imgfleet='<img vspace=0 align="left" height=10 width=17 src="skin/interface/mission_deployfleet.png">'
		imgarmy='<img vspace=0 align="right" height=10 width=17 src="skin/interface/mission_deployarmy.png">'
		
 		if (i<cityName.length && !wcity.sourceN) {
			if (i==currentI) {
				tabla+='<td title="'+trad(ctry,'no fleet/army to the same city')+'"'+LineStyleN +'>--</td>'+mark
			}else {
				tabla+='<td width=35 '+LineStyleN+'>'+linkfleet+imgfleet+'</a>'+linkarmy+imgarmy+'</td>'+mark
			}
		}
		else {			

			info=''
			inf1=''
			inf2=''
			iconstr=''
			green=0
			red=0
			yellow=0
			purple=0
			for (k=0;k<wcity.sourceN.length;k++) {
			
				if (wcity.chargeStN[k]==1) {
					yellow=1
				}else {
					if (wcity.chargeStN[k]==3) {
						purple=1
					}
				}
				arrivo=tempoNorm(wcity.timeArrN[k]-CompTime)
				if (arrivo==trad(ctry,'completed')) {
					if (wcity.chargeStN[k]==1) {
						red=1
					}else {
					green=1
					}
					if (wcity.chargeStN[k]==0) {
						for (kk=0;kk<26;kk++) { 
							if (wcity.TipNavy[k][kk]>' ') {
								s_unit=wcity.NumNavy[k][kk]
								wcity.countArmy[kk]=parseInt(wcity.countArmy[kk])+parseInt(s_unit)+''
							}
						}
						wcity.chargeStN[k]=2
						myJSONText = JSON.stringify(wcity)
						if (i<cityName.length) {
							nomevar='citybuildings'
						}else {
							nomevar='armyout'
						}
						setVar(nomevar+wcity.name,myJSONText)
					}
				} else {
					xxx=Fechar(parseInt(wcity.timeArrN[k])*1000)
					arrivo=arrivo+' ('+trad(ctry,'at')+' '+xxx+')'
				}
				strunit=''
				iconstr=''
				if (wcity.NumShip && wcity.NumShip[k]>0) {
					strunit='\n'+wcity.NumShip[k]+' '+trad(ctry,'merchant ships')+' - '
					iconstr='<img height="26" src="/skin/characters/fleet/40x40/ship_transport_r_40x40.png">'
				}

				for (kk=0;kk<26;kk++) { 
					if (wcity.TipNavy[k][kk]>' ') {						
						strunit=strunit+'\n'+wcity.NumNavy[k][kk]+' '+JSONcitys[0].nameArmy[kk]+' - ' 
						if (kk>14) {
							iconstr=iconstr+'<img height="26" src="skin/characters/fleet/60x60/'+wcity.TipNavy[k][kk]+'_faceright.png">'
						}else {
							iconstr=iconstr+'<img height="26" src="skin/characters/military/x60_y60/y60_'+wcity.TipNavy[k][kk]+'_faceright.png">'
						}								
					}
				}
				infsource=' <== '+wcity.sourceN[k]+' - '
				infmission=wcity.missionN[k]+'\n'
				infunita=wcity.Units[k]+' = '+strunit
				infend='\n-----------------------------\n'
				infx=infsource+infunita+infmission+arrivo+infend

				inf1=iconstr+infsource+infunita+infmission+cless+arrivo+infend
				inf2=inf2+infx // solo per tip tradizionali (vedi sotto)
				info=info+inf1
			}

			LineStyleNx='style="text-align:center;background:DodgerBlue;font-weight:bold"'
			if (yellow>0) {
				LineStyleNx='style="text-align:center;background:yellow;font-weight:bold"'
			}
			if (red>0) {
				LineStyleNx='style="text-align:center;background:Coral;font-weight:bold"'
			}
			if (purple>0) {
			LineStyleNx='style="text-align:center;background:MEDIUMSLATEBLUE;font-weight:bold"'
			}
			if (green>0) {
			LineStyleNx='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
			}
			
			if (i>=cityName.length+cityNameX.length) {
				LineStyleNx='style="text-align:center;background:red;font-weight:bold"'
				info=trad(ctry,'island')+' : '+wcityCoords
			}
			
			if (balloon==1) {
				xtitle=''
				fumetto='<span class="tooltip"><span class="top"></span>'+
					'<span class="middle">'+info+'</span><span class="bottom"></span>'
			}
			else	{
				xtitle='title="'+inf2+'" '
				fumetto=''
			}
			
			xhref='"?view=militaryAdvisor&backgroundView=city"'
			if (i!=currentI) {
				if (i<cityName.length) {
					titlex='"'+trad(ctry,'deploy fleet')+'"'
					titley='"'+trad(ctry,'deploy army')+'"'
					if (wcity.sourceN) {
						titlex=''
						titley=''
					}
					linkfleet='<a title="'+titlex+'" class="tt1" href="?view=deployment&deploymentType=fleet'+
						'&destinationCityId='+wcityId+'&backgroundView=island">'
					linkarmy='<a title="'+titley+'" class="tt1" href="?view=deployment&deploymentType=army'+
						'&destinationCityId='+wcityId+'&backgroundView=island">'
				}else {
					if (!wcity.hostile) {					
						linkfleet='<a title="'+trad(ctry,'defend harbour')+'" class="tt1" href="?view=defendPort&destinationCityId='+
							wcityId+'&backgroundView=island">'
						linkarmy='<a title="'+trad(ctry,'defend city')+'" class="tt1" href="?view=defendCity&destinationCityId='+
							wcityId+'&backgroundView=island">'
					}else {
						linkfleet='<a title="'+trad(ctry,'blockade harbour')+'" class="tt1" href="?view=blockade&destinationCityId='+
							wcityId+'&backgroundView=island">'
						linkarmy='<a title="'+trad(ctry,'occupy city')+'" class="tt1" href="?view=occupy&destinationCityId='+
							wcityId+'&backgroundView=island">'
					
					}
				}
			}			

			tabla+='<td '+xtitle+'" align="center" '+ LineStyleNx +'>'+
				linkfleet+imgfleet+fumetto+'</a>'+linkarmy+imgarmy+fumetto+'</a>'+mark

		}
//////******************

		if (wcity.countArmy) {
			wcountArmy=wcity.countArmy
		}

//-------//

		lun=0
		for (k=0;k<26;k++) {
			unitcompN[k]=0
		}

		if (wcity.sourceN) {
			lun=wcity.sourceN.length
		}

		for (j=0;j<lun;j++) {
			if (wcity.chargeStN[j]==2) {
				for (k=0;k<26;k++) {
					if (wcity.TipNavy[j][k]>' ') {
						unitcompN[k]=1
					}
				}
			}
		}
	////
		for (var k = 0; k < 26; k++) {
			normalLine=LineStyleN
			if (unitcompN[k]==1) {
				LineStyleN='style="text-align:center;background:MediumSeaGreen;font-weight:bold"'
			}
			if (wcity.countArmy && wcountArmy[k]>0) {
				val=formatNum(wcountArmy[k]);
				sumArmy[k] = sumArmy[k] + StrToNum(wcountArmy[k]);
				tabla +='<td '+ LineStyleN +'>'+val+'</td>';
			}
			else  {
				tabla += '<td '+ LineStyleN +'>-</td>';
			}
			if (k==14) {
				tabla+=mark
			}
			LineStyleN=normalLine
		}
		tabla+=mark0
	}
////// FINE LOOP CITTA'

	
	tabla +='</tr>'+mark3
	
	//---------------------------------------
	//---------------- totali militari
	//----------------------------------------
	tabla += '<td '+ LineStyleN +'></td>';
	tabla +='<tr style="color:black;font-family:times new roman,sans-serif;font-size:11pt">'+
		'<td></td>'+mark0+'<td>'+trad(ctry,'Total')+'</td>'+mark+'<td></td>'+mark

	for (var k = 0; k < 26; k++) {
		tabla +='<td align="center">'+ formatNum(sumArmy[k]) +'</td>';
		if (k==14) {
			tabla+=mark
		}
	}	
	tabla +=mark0+mark3+'</table>'
	
	///test table
	//resto='&containerWidth=1206px&containerHeight=892px&worldviewWidth=1206px&worldviewHeight=846px&worldmap_isoTop=897px&worldmap_isoLeft=103px&worldmap_isoWorldviewScale=1&backgroundView=city'
	//click='<a style="font-size:15pt;color:black;font-weight:bold" onclick="ajaxHandlerCall(this.href);return false;" href="?view=tradeAdvisor&amp;oldView=city&amp;cityId='+cityId[currentI]+resto+'" title="Riepilogo delle città e delle finanze" class="normal">'
 	//tabla+='<table border="16" style="font-size:15pt;color:black;background:green"><tr><td rowspan="2">'+click+'Cella 1</a></td><td>Cella 2</td></tr><tr><td>Cella 3</td></tr><tr><td rowspan="2">Cella 4</td><td>Cella 5</td></tr><tr><td>Cella 6</td></tr></table>'

	document.getElementById("ArmyTable").innerHTML  = tabla;

		
//ErrorString='VISIT ALL YOURS CITYS !!!'
document.getElementById("ResourceAlert").innerHTML = ErrorString;		
}


/////////////////////////////////////////////////////
////////////////////////////////////////////////////
//***************   OTHERS FUNCTION  //////////////
//////////////////////////////////////////////////

//importata
/*
function insCSS(style) {
    var getHead = document.getElementsByTagName("HEAD")[0];
    var cssNode = window.document.createElement('style');
    var elementStyle = getHead.appendChild(cssNode);
    elementStyle.innerHTML = style;
    return elementStyle;
}
*/
//modificata
function addLink(url) {
    getHead = document.getElementsByTagName("HEAD")[0]
    linkNode = window.document.createElement('link')
    linkNode.type='text/css'
    linkNode.rel='stylesheet'
    linkNode.href=url
    elementLink = getHead.appendChild(linkNode)
    return elementLink
}
//

function normal (bigtip) {
	ix=bigtip.indexOf('finish=',bigtip.length-50)
	if (ix>0) {
		iy=bigtip.indexOf("|",ix)
		subT=bigtip.substring(ix+7,iy)
		if (subT=='0') {
			bigtip=bigtip.replace('finish=0|','')
			return bigtip
		}else { 
			resTime=subT-CompTime
			subTnew=tempoNorm(resTime)
			iz=bigtip.indexOf('[')
			iw=bigtip.indexOf("]")
			subX=bigtip.substring(iz+1,iw)
			bigtip=bigtip.replace(subX,subTnew)

			iv=bigtip.indexOf("%",ix)
			totime=bigtip.substring(iv+1)
			progTime=totime-resTime
			percNew=parseInt(progTime/totime*100)
			if (percNew>100) {
				percNew=100
			}
			ir=bigtip.indexOf(xSp1,0)
			it=bigtip.indexOf('%',ir)
			percOld=bigtip.substring(ir,it)
			percNew=xSp1+percNew
			bigtip=bigtip.replace(percOld,percNew)
			bigtip=bigtip.substring(0,ix-1)
			return bigtip
		}
	}else {
		return bigtip
	}
}

function reinit () {
	GMlista=GM_listValues ()
	strDel=document.location.host
	resp=confirm(trad(ctry,'After your confirmation, you must visit all the cities to refresh the data\n')+
			'************************'+'             '+trad(ctry,'Confirm')+' ?'+'          '+'***************************')
	if (!resp) {return}
	for (i=0;i<GMlista.length;i++) {
		if (GMlista[i].indexOf(strDel,0)>=0) {
			GM_deleteValue(GMlista[i])
		}
	}
	//alert ('Now you must visit all yours citys\n for refreshing data')
}

function scanCityX (stringa) {
	
		GMlista=GM_listValues ()
		strDel=document.location.host+stringa
		k=0
		for (i=0;i<GMlista.length;i++) {
			if (GMlista[i].indexOf(strDel,0)>=0) {
				othersCitys[k]=JSON.parse(GM_getValue(GMlista[i]))
				cityNameX[k]=othersCitys[k].name
				cityIdX[k]=othersCitys[k].cityIdX
				k++
			}
		}
}

function scanCityY (stringa) {
	
		GMlista=GM_listValues ()
		strDel=document.location.host+stringa
		k=0
		for (i=0;i<GMlista.length;i++) {
			if (GMlista[i].indexOf(strDel,0)>=0) {
				othersCitys[k]=JSON.parse(GM_getValue(GMlista[i]))
				cityNameY[k]=othersCitys[k].name
				cityIdY[k]=othersCitys[k].cityIdX
				k++
			}
		}
}

function num_to_func(num){
	switch(num){
		case "0": return "T"; break;
		case "1": return "S"; break;
		case "2": return "d"; break;
	}  
}


p = document.getElementById("cel_menu_3");
h = document.createElement('a');
h.setAttribute('class','button');
h.id = "b_s_h_deals";
if(getVar("s_h_deals")==0){
	h.innerHTML = trad(ctry,'Show Buildings');
	document.getElementById("resourcedealer5").style.display="none";
}else{
	h.innerHTML =  trad(ctry,'Hide Buildings');
	document.getElementById("resourcedealer5").style.display="inline";
}
h.addEventListener("click",function(){f_s_h_deals();},false);
p.appendChild(h);

function f_s_h_deals(){
	if(getVar("s_h_deals")==1){
		setVar("s_h_deals",0);
		document.getElementById("b_s_h_deals").innerHTML = trad(ctry,'Show Buildings');
		document.getElementById("resourcedealer5").style.display="none";
	}else{
		setVar("s_h_deals",1);
		document.getElementById("b_s_h_deals").innerHTML = trad(ctry,'Hide Buildings');
		document.getElementById("resourcedealer5").style.display="inline";
	}
}

p = document.getElementById("cel_menu_4");
h = document.createElement('a');
h.setAttribute('class','button');
h.id = "b_s_h_inform";
if(getVar("s_h_inform")==0){
	h.innerHTML =  trad(ctry,'Show Resources');
	document.getElementById("resourcedealer5-2").style.display="none";
}else{
	h.innerHTML =  trad(ctry,'Hide Resources');
	document.getElementById("resourcedealer5-2").style.display="inline";
}
h.addEventListener("click",function(){f_s_h_inform();},false);
p.appendChild(h);

function f_s_h_inform(){
	if(getVar("s_h_inform")==1){
		setVar("s_h_inform",0);
		document.getElementById("b_s_h_inform").innerHTML = trad(ctry,'Show Resources');
		document.getElementById("resourcedealer5-2").style.display="none";
	}else{
		setVar("s_h_inform",1);
		document.getElementById("b_s_h_inform").innerHTML = trad(ctry,'Hide Resources');
		document.getElementById("resourcedealer5-2").style.display="inline";
	}
}

//   spare button............
p = document.getElementById("cel_menu_5");
h = document.createElement('a');
h.setAttribute('class','button');
h.id = "b_s_h_Army";
if(getVar("s_h_Army")==0){
	h.innerHTML = trad(ctry,'Show Army');
	document.getElementById("ArmyTable").style.display="none";
}else{
	h.innerHTML = trad(ctry,'Hide Army');
	document.getElementById("ArmyTable").style.display="inline";
}
h.addEventListener("click",function(){f_s_h_Army();},false);
p.appendChild(h);

function f_s_h_Army(){
	if(getVar("s_h_Army")==1){
		setVar("s_h_Army",0);
		document.getElementById("b_s_h_Army").innerHTML = trad(ctry,'Show Army');
		document.getElementById("ArmyTable").style.display="none";
	}else{
		setVar("s_h_Army",1);
		document.getElementById("b_s_h_Army").innerHTML = trad(ctry,'Hide Army');
		document.getElementById("ArmyTable").style.display="inline";
	}
}

///////////////// Tip personalizzato
p = document.getElementById("cel_menu_8");
h = document.createElement('a');
h.setAttribute('class','button');
h.id = "balloonTip";
if(getVar("varTip")!=1){
	h.setAttribute('style','font:bold;color:red');
	h.innerHTML = 'Balloon Tip is Off';
}else{
	h.setAttribute('style','font:bold;color:blue');
	h.innerHTML = 'Balloon Tips On';
}
h.addEventListener("click",function(){funTip();},false);
p.appendChild(h);

function funTip(){
	if(getVar("varTip")==1){
		setVar("varTip",0);
		balloon=0
		document.getElementById("balloonTip").innerHTML = 'Balloon Tip\n Off';
	}else{
		setVar("varTip",1);
		balloon=1
		document.getElementById("balloonTip").innerHTML = 'Balloon Tip\n On';
	}
}

/*   //off
p = document.getElementById("cel_menu_9");
h = document.createElement('a');
h.setAttribute('class','button');
h.id = "brefresh";
h.innerHTML = 'Reload page';
h.addEventListener("click",function(){refresh();},false);
p.appendChild(h);
*/
 
function refresh(){
    window.location.reload()
    //window.scrollBy(0,350)
}

p = document.getElementById("cel_menu_a");
h = document.createElement('a');
h.setAttribute('class','button');
h.id = "breinit";
h.innerHTML = trad(ctry,'Reset Data');
h.addEventListener("click",function(){reinit();},false);
p.appendChild(h);

p = document.getElementById("cel_menu_0");
h = document.createElement('a');
h.setAttribute('class','button');
h.id = "bfocus";
if(getVar("varFocus")!=1){
	h.setAttribute('style','font:bold;color:red');
	h.innerHTML = 'Focus Table Off';
}else{
	h.setAttribute('style','font:bold;color:blue');
	h.innerHTML = 'Focus Table On';
}
h.addEventListener("click",function(){focus();},false);
p.appendChild(h);
 
function focus(){
	if(getVar("varFocus")==1){
		setVar("varFocus",0);
		focusTable=0
		document.getElementById("bfocus").innerHTML = 'Focus Table Off';
	}else{
		setVar("varFocus",1);
		focusTable=1
		document.getElementById("bfocus").innerHTML = 'Focus Table is On';
	}
}
//cella di test
p = document.getElementById("celtest");
h = document.createElement('a');
h.setAttribute('class','button');
h.setAttribute('style','font:bold;color:blue');
h.setAttribute('title','ikariam.wikia.com');
h.id = "btest";
h.innerHTML = 'Wiki Ikariam';
//h.addEventListener("click",function(){window.open("http://www.google.it","_self")});
//xref=trad(ctry,'"http://ikariam.wikia.com/wiki/Main_Page"')
xref=trad(ctry,'http://ikariam.wikia.com/wiki/Main_Page')
h.addEventListener("click",function(){window.open(xref,"_page")});

p.appendChild(h);
 
function test(){
    window.open("http:google.it",false)
}


function tipLevel (i,p) {
	////****** Tip upgrading
	tipLv=nst=nwo=nwi=nma=ngl=nsu=nti=''
	if (JSONcitys[i].tipLevel) {
		if (JSONcitys[i].tipLevel[p].upStr) {
			nst=JSONcitys[i].tipLevel[p].upStr
		}
		if (JSONcitys[i].tipLevel[p].upWood) {
			nwo=JSONcitys[i].tipLevel[p].upWood
			if (balloon==1) {
				nwo=nwo.substring(nwo.indexOf(' :'))
				nwo='<img height="14" src="skin/resources/icon_wood.png">'+nwo
			}
		}
		if (JSONcitys[i].tipLevel[p].upMarble) {
			nma=JSONcitys[i].tipLevel[p].upMarble
			if (balloon==1) {
				nma=nma.substring(nma.indexOf(' :'))
				nma='<img height="14" src="skin/resources/icon_marble.png">'+nma
			}
		}
		if (JSONcitys[i].tipLevel[p].upGlass) {
			ngl=JSONcitys[i].tipLevel[p].upGlass
			if (balloon==1) {
				ngl=ngl.substring(ngl.indexOf(' :'))
				ngl='<img height="14" src="skin/resources/icon_crystal.png">'+ngl
			}
		}
		if (JSONcitys[i].tipLevel[p].upSulfur) {
			nsu=JSONcitys[i].tipLevel[p].upSulfur
			if (balloon==1) {
				nsu=nsu.substring(nsu.indexOf(' :'))
				nsu='<img height="14" src="skin/resources/icon_sulfur.png">'+nsu
			}
		}
		if (JSONcitys[i].tipLevel[p].upWine) {
			nwi=JSONcitys[i].tipLevel[p].upWine
			if (balloon==1) {
				nwi=nwi.substring(nwi.indexOf(' :'))
				nwi='<img height="14" src="skin/resources/icon_wine.png">'+nwi
			}
		}
		if (JSONcitys[i].tipLevel[p].upTime) {
			nti=JSONcitys[i].tipLevel[p].upTime
			if (balloon==1) {
				nti=nti.substring(nti.indexOf(' :'))
				nti='<img height="14" src="skin/resources/icon_time.png">'+nti
			}
		}
		tipLv=nst+nwo+nwi+nma+ngl+nsu+nti
	}

	return tipLv
}
			
var momentoActual = new Date();
var m_ant = parseInt(momentoActual/(1000*60));

function trovaX (oggetto) {
	curleft=0
	if(piede.offsetParent) {
		while(1) {
	        	curleft += piede.offsetLeft
	          	if(!piede.offsetParent) {
	            		break
	            	}
	          	piede = piede.offsetParent
	        }
       	}
       	else {
       		if(piede.x) {
		        curleft += piede.x
	        }
	}
	return curleft
}

function trovaY (oggetto) {
	curtop=0
	if(piede.offsetParent) {
		while(1) {
	        	curtop += piede.offsetTop
	          	if(!piede.offsetParent) {
	            		break
	            	}
	          	piede = piede.offsetParent
	        }
       	}
       	else {
       		if(piede.y) {
		        curtop += piede.y
	        }
	}
	return curtop
}

function tempoNorm(sec){

	var gg=parseInt(sec/86400);
	var hh=parseInt((sec-gg*86400)/3600);
	var mm=parseInt((sec-gg*86400-hh*3600)/60);
	var ss=parseInt((sec-gg*86400-hh*3600-mm*60));
	var tempo='';
	if (gg>0) {
		tempo=gg+trad(ctry,'D')+' '
	}
	if (hh>0) {
		tempo+=hh+trad(ctry,'h')+' '
	}
	if (mm>0) {
		tempo+=mm+trad(ctry,'m')+' '
	}
	if (ss>1) {
		tempo+=ss+trad(ctry,'s')
	}else {
		tempo+='1'+trad(ctry,'s')
	}
	if (tempo=='1'+trad(ctry,'s')) {
		tempo=trad(ctry,'completed')
	}	
	return tempo;
}

function stringaTempo (str,xora,xmin,xsec) {
	ih=str.indexOf('h',0)
	if (ih>0) {
		xora=str.substr(0,ih)
		ix=str.indexOf(' ',ih)
		str=str.substr(ix+1,str.length-ix)
	}else{xora=0}
	im=str.indexOf('m',0)
	if (im>0) {
		xmin=str.substr(0,im)
		ix=str.indexOf(' ',im)
		str=str.substr(ix+1,str.length-ix)
	}else{xmin=0}
	is=str.indexOf('s',0)
	if (is>0) {
		xsec=str.substr(0,is)
		ix=str.indexOf(' ',is)
		str=str.substr(ix+1,str.length-ix)
	}else{xsec=0}
	myora=xora
	mymin=xmin
	mysec=xsec
}

function strTempoExt (str,xday,xora,xmin,xsec) {
	str=str.replace('G','g').replace('D','g').replace('d','g').replace('j','g').replace('T','g')
	id=str.indexOf('g',0)

	if (id>0) {
		xday=str.substr(0,id)
		ix=str.indexOf(' ',id)
		str=str.substr(ix+1,str.length-ix)
	}else{xday=0}

	ih=str.indexOf('h',0)
	if (ih>0) {
		xora=str.substr(0,ih)
		ix=str.indexOf(' ',ih)
		str=str.substr(ix+1,str.length-ix)
	}else{xora=0}

	im=str.indexOf('m',0)
	if (im>0) {
		xmin=str.substr(0,im)
		ix=str.indexOf(' ',im)
		str=str.substr(ix+1,str.length-ix)
	}else{xmin=0}

	is=str.indexOf('s',0)
	if (is>0) {
		xsec=str.substr(0,is)
		ix=str.indexOf(' ',is)
		str=str.substr(ix+1,str.length-ix)
	}else{xsec=0}
	

	myday=xday
	myora=xora
	mymin=xmin
	mysec=xsec
}

function estraiNum (wstring) {
	ix=wstring.indexOf(' ',0)
	wstring1=wstring.substr(0,ix)
	return wstring1
}

function tindex (unit) {
	for (j=0;j<26;j++) {
		if (unit==xUnit[j]) {  
			return j
		}
	}
}
 	

function StrToNum(str){
	if(!str){
		return 0;
	}else{
		//str = str.replace('.','');
		//str = str.replace(/,/g,'');		
		str = str.replace(unsafeWindow.LocalizationStrings.thousandSeperator,'')
		.replace(unsafeWindow.LocalizationStrings.thousandSeperator,'')
		.replace(unsafeWindow.LocalizationStrings.thousandSeperator,'');
		str = str.replace(unsafeWindow.LocalizationStrings.decimalPoint,'');
		
		if (str.indexOf('k',0) > 0)	{
			str = str.replace("k","");
			return parseInt(str) * 1000;
		}
		return parseInt(str);
	}
}

function formatNum(a){  // format back to m1,m2.m3
	var comma=unsafeWindow.LocalizationStrings.thousandSeperator
	var m3=a-parseInt(a/1000)*1000
	var m2=parseInt((a-parseInt(a/1000000)*1000000)/1000)
	var m1=parseInt(a/1000000)
	if (a>999) {
		var M3=m3
		if (m3<10)  {M3='0'+M3}
		if (m3<100) {M3='0'+M3}
	}
	if (a>999999) {
		var M2=m2
		if (m2<10)  {M2='0'+M2}
		if (m2<100) {M2='0'+M2}
		return(m1+comma+M2+comma+M3)
	}
	else {
		if (a>999) {
			return(m2+comma+M3)
		}
		else {
			return(m3)
		}
	}
}

function a0(str){
	var out = str.toString();
	if (out.length==1) {
		return "0"+out;
	}else{
		return str;
	}
}

function Fecha(time){
	var momentoActual = new Date();
	momentoActual.setTime(time)
	wday=new Array ()
	//wday=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	wday=[trad(ctry,'Sunday'),trad(ctry,'Monday'),trad(ctry,'Tuesday'),
		trad(ctry,'Wednesday'),trad(ctry,'Thursday'),trad(ctry,'Friday'),trad(ctry,'Saturday')]

	y = momentoActual.getFullYear()
	n = momentoActual.getMonth()+1
	d = momentoActual.getDate()
	h = momentoActual.getHours()
	m = momentoActual.getMinutes()
	g= momentoActual.getDay()
	
	return 	wday[g]+'  '+a0(d)+"/"+a0(n)+"/"+a0(y)+'  '+trad(ctry,'at')+'  '+a0(h)+":"+a0(m)
}

function Fechar(time){
	var momentoActual = new Date(time);
	h = momentoActual.getHours()
	m = momentoActual.getMinutes()
	
	return 	a0(h)+":"+a0(m)
}


function getVar(varname, vardefault) {
  var res = GM_getValue(document.location.host+varname);
  if (res == undefined) {
    return vardefault;
  }
  return res;
}

function setVar(varname, varvalue) {
  GM_setValue(document.location.host+varname, varvalue);
}


function Findbuilding(index,name){// find buildinglvl for building(name) for city(index)  
	for (i = 0 ; i<numPlace ; i++){
		if(JSONcitys[index]){	
			if(JSONcitys[index].position[i].building.replace(' constructionSite','') == name) {
				return i;	
			}
		}
	}
	return -1;  //building not found	
}

PT();   /////the big timerloop for dynamic-updating
function PT(){
	FechaActual();
	cargar_dealers();
	setTimeout(PT,6*1000); 	
}

function FechaActual(){
	var momentoActual = new Date();
	var y = momentoActual.getFullYear();
	var n = momentoActual.getMonth()+1;
	var d = momentoActual.getDate();
	var h = momentoActual.getHours();
	var m = momentoActual.getMinutes();
	return a0(d)+"/"+a0(n)+"/"+a0(y)+" "+a0(h)+":"+a0(m);
}


////////////////////////  getcitydata() /////////////////////////////
function getcitydata(){  // get all data from currentcity
////////////////////////////////////////////////////////////////////

	text=document.body.innerHTML; //first get data from page  and make it JSON
	var ini1 =  text.indexOf('updateBackgroundData"',0); // get citydatastring
	var ini2 =  text.indexOf('"updateTemplateData',ini1);     // find end
	var citystring = "{"+(text.substring(ini1+23,ini2-3))+""; // make substring of data


	if(citystring.length > 5){
		JSONcitydata = JSON.parse(citystring);  // make data JSON data
		if (view == "city"){
			for(i=0;i<cityName.length;i++){  //find current city
				if(JSONcitydata.name == cityName[i]){
					var test = GM_getValue(document.location.host+"citybuildings"+cityName[i]);
						if(test) {
							JSONcitys[i]=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[i]));
						}else{
							JSONcitys[i] = JSONcitydata;  /// può dare problemi col reinit (?)
						}
// data from string
					JSONcitys[i].name=JSONcitydata.name;
					JSONcitys[i].id=JSONcitydata.id;
					JSONcitys[i].phase=JSONcitydata.phase;
					JSONcitys[i].ownerId=JSONcitydata.ownerId;
					JSONcitys[i].ownerName=JSONcitydata.ownerName;
					JSONcitys[i].islandId=JSONcitydata.islandId;
					JSONcitys[i].islandName=JSONcitydata.islandName;
					JSONcitys[i].islandXCoord=JSONcitydata.islandXCoord;
					JSONcitys[i].islandYCoord=JSONcitydata.islandYCoord;
					JSONcitys[i].buildingSpeedupActive=JSONcitydata.buildingSpeedupActive;
					JSONcitys[i].underConstruction=JSONcitydata.underConstruction;
					JSONcitys[i].endUpgradeTime=JSONcitydata.endUpgradeTime;
					JSONcitys[i].startUpgradeTime=JSONcitydata.startUpgradeTime;
					JSONcitys[i].speedupState=JSONcitydata.speedupState;
					JSONcitys[i].position=JSONcitydata.position;
					JSONcitys[i].portControllerName=JSONcitydata.portControllerName
					JSONcitys[i].occupierName=JSONcitydata.occupierName

// data from screen
					JSONcitys[i].maxstorage=((document.getElementById("js_GlobalMenu_max_wood")).firstChild.nodeValue); //   max storage
					JSONcitys[i].servertime=(unsafeWindow.dataSetForView.serverTime)+'"'; //time of the update
					JSONcitys[i].action=((document.getElementById("js_GlobalMenu_maxActionPoints")).firstChild.nodeValue);
					JSONcitys[i].citizens=((document.getElementById("js_GlobalMenu_citizens")).firstChild.nodeValue);
					JSONcitys[i].population=((document.getElementById("js_GlobalMenu_population")).firstChild.nodeValue);//total in current city
					//JSONcitys[i].wood=((document.getElementById("js_GlobalMenu_wood")).firstChild.nodeValue);//wood in current city
                                	var aaa =unsafeWindow.dataSetForView.currentResources.resource
					JSONcitys[i].wood=aaa+'"'
				
///////////////// altre risorse
					txtin=text.indexOf('currentResources:')
					text1=text.substring(txtin,txtin+200)
					txtin1=text1.indexOf('resource')
					text2=text1.substring(txtin1,txtin1+120)
					inw=text2.indexOf('"1')
					fiw=text2.substring(inw,inw+20).indexOf(',')
					JSONcitys[i].wine=text2.substring(inw+5,inw+fiw)
					inw=text2.indexOf('"2')
					fiw=text2.substring(inw,inw+20).indexOf(',')
					JSONcitys[i].marble=text2.substring(inw+5,inw+fiw)
					inw=text2.indexOf('"3')
					fiw=text2.substring(inw,inw+20).indexOf('}')
					JSONcitys[i].crystal=text2.substring(inw+5,inw+fiw)
					inw=text2.indexOf('"4')
					fiw=text2.substring(inw,inw+20).indexOf(',')
					JSONcitys[i].sulfur=text2.substring(inw+5,inw+fiw)

////////////////////////
					JSONcitys[i].woodprod=((document.getElementById("js_GlobalMenu_resourceProduction")).firstChild.nodeValue);//wood in current city
					//JSONcitys[i].wine=((document.getElementById("js_GlobalMenu_wine")).firstChild.nodeValue);//wine in current city
					//JSONcitys[i].marble=((document.getElementById("js_GlobalMenu_marble")).firstChild.nodeValue);//marble in current city
					//JSONcitys[i].crystal=((document.getElementById("js_GlobalMenu_crystal")).firstChild.nodeValue);//cristal in current city
					//JSONcitys[i].sulfur=((document.getElementById("js_GlobalMenu_sulfur")).firstChild.nodeValue);//sulfur in current city

					var tradeName=new Array ("js_GlobalMenu_resourceProduction","js_GlobalMenu_production_wine",
								"js_GlobalMenu_production_marble","js_GlobalMenu_production_crystal","js_GlobalMenu_production_sulfur")
					var tradeg=document.getElementById(tradeName[cityRecId[i]]).firstChild.nodeValue
					if (tradeg>='0') {
						JSONcitys[i].tradegood=tradeg
					}
					if (!JSONcitys[i].tipLevel || JSONcitys[i].tipLevel.length<numPlace) {
						tipLevel=new Array ()
						for (k=0;k<numPlace;k++) {
							tipLevel[k]=new Object ()
						}
						JSONcitys[i].tipLevel=tipLevel
					}
					JSONcitys[i].winespending=(unsafeWindow.dataSetForView.wineSpendings);
					var myJSONText = JSON.stringify(JSONcitys[i]);  //convert back to string for storage
					var JSONcity = JSON.parse(myJSONText); // convert to JSON for use in program , If program fails here there is an error in the string
					setVar("citybuildings"+JSONcitys[i].name,myJSONText); // store the data for the current city
				}else{
				}
			var levelsdata=(levelsdata+")");
			}
		}
		if (view == "island"){
			if (JSONcitydata.isOwnCityOnIsland==true) {
				for(i=0;i<cityName.length;i++){ 
					citta=GM_getValue(document.location.host+"citybuildings"+cityName[i])
					if (citta) {
						jcitta=JSON.parse(citta)
						if (JSONcitydata.id==jcitta.islandId) {
							jcitta.resourceLevel=JSONcitydata.resourceLevel
							jcitta.tradegoodLevel=JSONcitydata.tradegoodLevel
							myJSONText=JSON.stringify(jcitta)
							setVar("citybuildings"+jcitta.name,myJSONText)
						}
					}
				}
			}
		}
		servertime  = unsafeWindow.dataSetForView.serverTime;  // get the servertime
	}
}




////////////////////////  getcitysdata() /////////////////////////////
function getcitysdata(){ // get all city's and rec,coords,id,relations
///////////////////////////////////////////////////////////////////////

	
	JSONcitydata = (unsafeWindow.dataSetForView.relatedCityData.selectedCity); // current cityId
	var elemx=document.getElementById("js_cityIdOnChange")
	if (elemx.value>'0') {
		JSONcitydata='city_'+elemx.value
	}
	ind_cityId = 0; 
	ind_ocCityId = 0;   

	for (var key in unsafeWindow.dataSetForView.relatedCityData) { 
		if ( unsafeWindow.dataSetForView.relatedCityData[key].relationship == 'ownCity'){
			cityId[ind_cityId] = unsafeWindow.dataSetForView.relatedCityData[key].id;
			cityCoords[ind_cityId] = unsafeWindow.dataSetForView.relatedCityData[key].coords;
			cityName[ind_cityId] = unsafeWindow.dataSetForView.relatedCityData[key].name;
			if (unsafeWindow.dataSetForView.relatedCityData[key].tradegood) {
				cityRecId[ind_cityId] = unsafeWindow.dataSetForView.relatedCityData[key].tradegood;
				cityRecStr[ind_cityId]=resourcetrad[(unsafeWindow.dataSetForView.relatedCityData[key].tradegood)].toLowerCase();
				if (cityRecStr[ind_cityId]=="crystal glass"){
					cityRecStr[ind_cityId] = "glass"; 
				}
				if (cityRecStr[ind_cityId]=="sulphur"){
					cityRecStr[ind_cityId] = "sulfur";
				}
				
			}
			ind_cityId++;
		}else {
			if ( unsafeWindow.dataSetForView.relatedCityData[key].relationship == 'occupiedCities') {
				ocCityId[ind_ocCityId] = unsafeWindow.dataSetForView.relatedCityData[key].id;
				ocCityCoords[ind_ocCityId] = unsafeWindow.dataSetForView.relatedCityData[key].coords
				ocCityName[ind_ocCityId] = unsafeWindow.dataSetForView.relatedCityData[key].name;
			}
			ind_ocCityId++
		}
	}
}


function focusCity () {
//// definisce la citta' selezionata / cambiata come corrente

	var cityId1 = (unsafeWindow.dataSetForView.relatedCityData.selectedCity);  // current city 
	var elemx=document.getElementById("js_cityIdOnChange")
	if (elemx.value>'0') {
		cityId1='city_'+elemx.value
	}
	currentCity=unsafeWindow.dataSetForView.relatedCityData[cityId1].name
	var test = GM_getValue(document.location.host+"citybuildings"+currentCity);
	if(test) {
		JSONcitydata=JSON.parse(GM_getValue(document.location.host+"citybuildings"+currentCity));
	}
	currentId=unsafeWindow.dataSetForView.relatedCityData.selectedCity.replace('city_','')
	
	
	currentI=cityName.length
	for (j=0;j<cityName.length;j++) {
		if (currentCity==cityName[j]) {
			currentI=j
			break
		}
	}
	
//////////////////////
}

//-----------------------------------------------
//------------------------TESTING VIEW ----------
//-----------------------------------------------
function testing(view) {
 
 	focusCity()

///************* aggiunge CSS island, necessarie per corretta form di assegnazione risorse					
	getHead = document.getElementsByTagName("HEAD")[0];
	xLink='/skin/compiled-'+ctry+'-island.css?rev=34893'
	//xLink='/skin/compiled-'+ctry+'-island-0.5.1.1.css'   //cambiano sempre ?
	addLink(xLink)
///******************************************************

	xview=view

/////////////////**************** TRANSPORT	************************/////////////////////////////
	if (view == 'merchantNavy') {
	
		var element=document.getElementById("merchantNavy")
		var elevent=element.getElementsByClassName("eventRow")
		var elpay=element.getElementsByClassName("payload")

///// Inizializza trasporti
		for(i=0;i<cityName.length;i++){
			appo=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[i]))
			appo.source=null
			appo.arrival=null
			appo.chargeSt=null
			appo.mission=null
			appo.tr_wood=null
			appo.tr_wine=null
			appo.tr_marble=null
			appo.tr_crystal=null
			appo.tr_sulfur=null
			appo.tr_unit=null
			appo.timeArr=null
			
	 		myJSONText = JSON.stringify(appo)
			setVar("citybuildings"+cityName[i],myJSONText)
		}
		
///// cancella le citta' non proprie
		GMlista=GM_listValues ()
		strDel=document.location.host+'navyout'

		for (i=0;i<GMlista.length;i++) {
			if (GMlista[i].indexOf(strDel,0)>=0) {
				GM_deleteValue(GMlista[i])
			}
		}
		
/////// Individua i trasporti correnti		
		/// Source & Target
	
		if (elevent.length>0) {	

			var source=new Array()
			var target=new Array()
			var cityNum=new Array()
			var tr_unit=new Array()
			var arrival=new Array()
			var chargeStatus=new Array()
			var mission=new Array()
			var ostile= new Array()

			/////****  missioni, tempi di arrivo e stati
			for (i=0; i<elevent.length; i++) {

				elmissionx=null
				elmission=null
				elmissiony=null
				elmissionz=null
				elmissionw=null
				elmissionv=null
				eltime=null
				eltime=elevent[i].getElementsByClassName("eta")
				elmissionx=elevent[i].getElementsByClassName("mission_icon deployarmy")
				elmission=elevent[i].getElementsByClassName("mission_icon transport")
				elmissiony=elevent[i].getElementsByClassName("mission_icon trade")
				elmissionz=elevent[i].getElementsByClassName("mission_icon plunder")
				elmissionw=elevent[i].getElementsByClassName("mission_icon defend")
				elmissionv=elevent[i].getElementsByClassName("mission_icon occupy")

				ostile[i]=0
				if (elmissionx[0]) {
					mission[i]=elmissionx[0].title
				}else {
					if (elmission[0]) {
						mission[i]=elmission[0].title
					}else { 
						if (elmissiony[0]) {
							mission[i]=elmissiony[0].title
						}else {
							if (elmissionz[0]) {
								ostile[i]=1
								mission[i]=elmissionz[0].title
							}else {
								if (elmissionw[0]) {
									mission[i]=elmissionw[0].title
								}else {
									ostile[i]=1
									mission[i]=elmissionv[0].title
								}
							}
						}
					}
				}
				sour=elevent[i].getElementsByClassName("source")
				taga=sour[0].getElementsByTagName("a")
				source[i]=taga[0].text
				targ=elevent[i].getElementsByClassName("target")
				tagb=targ[0].getElementsByTagName("a")
				target[i]=tagb[0].text
				cityNum[i]=tagb[0].href.substring(tagb[0].href.indexOf('cityId=')+7)

				tag1=eltime[0].getElementsByTagName("span")
				if (elmissionx[0] || elmissionz[0] || elmissionw[0] || elmissionv[0]) {
					arrival[i]=eltime[0].childNodes[0].nodeValue
				}else { 
					arrival[i]=tag1[0].innerHTML
				}
				chargeStatus[i]=0
				if (tag1[1]) {
					if (tag1[1].childNodes[0]) {
						chargeStatus[i]=1
					}
				}

				for (k=0;k<15;k++) {
					tr_unit[i]=new Array()
				}
			}
		///****  Payload (merci e truppe)
			var el2=new Array()
			var tr_wood=new Array()
			var tr_wine=new Array()
			var tr_marble=new Array()
			var tr_crystal=new Array()
			var tr_sulfur=new Array()

	 		for (i=0; i<elpay.length; i++) {
				tr_wood[i]=null
				tr_wine[i]=null
				tr_marble[i]=null
				tr_crystal[i]=null
				tr_sulfur[i]=null
				for (k=0;k<15;k++) {
					tr_unit[i][k]=''
	 			}

	 			el2[i]=s.serializeToString(elpay[i])
	 			iwood  =el2[i].indexOf(' src="skin/resources/icon_wood.png"',0)
	 			if (iwood>0) {
	 				wtr_wood=el2[i].substring(iwood-41,iwood-1)
	 				iiwood=wtr_wood.indexOf('title="',0)
	 				tr_wood[i]=wtr_wood.substring(iiwood+7,40)
	 			}
	 			
	 			iwine  =el2[i].indexOf(' src="skin/resources/icon_wine.png"',0)
	 			if (iwine>0) {
	 				wtr_wine=el2[i].substring(iwine-31,iwine-1)
					iiwine=wtr_wine.indexOf('title="',0)
	 				tr_wine[i]=wtr_wine.substring(iiwine+7,30)
	 			}
	 			
	 			imarble=el2[i].indexOf(' src="skin/resources/icon_marble.png"',0)
	 			if (imarble>0) {
					wtr_marble=el2[i].substring(imarble-31,imarble-1)
					iimarble=wtr_marble.indexOf('title="',0)
					tr_marble[i]=wtr_marble.substring(iimarble+7,30)
	 			}
	 			
	 			icrystal=el2[i].indexOf(' src="skin/resources/icon_glass.png"',0)
	 			if (icrystal>0) {
					wtr_crystal=el2[i].substring(icrystal-31,icrystal-1)
					iicrystal=wtr_crystal.indexOf('title="',0)
					tr_crystal[i]=wtr_crystal.substring(iicrystal+7,30)
	 			}
	 			
	 			isulfur  =el2[i].indexOf(' src="skin/resources/icon_sulfur.png"',0)
	 			if (isulfur>0) {
					wtr_sulfur=el2[i].substring(isulfur-31,isulfur-1)
					iisulfur=wtr_sulfur.indexOf('title="',0)
					tr_sulfur[i]=wtr_sulfur.substring(iisulfur+7,30)
	 			}
	 			//////////***********  payload unità
	 			for (k=0;k<15;k++) {
	 				iunit=el2[i].indexOf(' src="'+xArmy[k],0)
	 				if (iunit>0) {
	 					wtr_unit=el2[i].substring(iunit-41,iunit-1)
	 					iiunit=wtr_unit.indexOf('title="',0)
	 					tr_unit[i][k]=wtr_unit.substring(iiunit+7,40)
	 				}
	 			}
	 		}

//////////**************  Crea una tabella cityNamY (e cityNumY)  con le citta' non proprie

			cityNamX=new Array ()
			cityNumX=new Array ()
			cityNamY=new Array ()
			cityNumY=new Array ()
			k=-1
			for (i=0;i<target.length;i++) {
				trov=0
				for (j=0;j<cityName.length;j++) {
					if (target[i]==cityName[j]) {
						trov=1
						break
					}
				}
				if (trov==0) {
					k++
					cityNamX[k]=target[i]
					cityNumX[k]=cityNum[i]
				}
			}

			if (cityNamX.length>0) {
				cityNamY[0]=cityNamX[0]
				cityNumY[0]=cityNumX[0]				
				k=0
			}
			for (i=1;i<cityNamX.length;i++) {
				trov=0
				for (j=0;j<i;j++) {
					if (cityNamX[i]==cityNamX[j]) {
						trov=1
						break
					}
				}
				if (trov==0) {
					k++
					cityNamY[k]=cityNamX[i]
					cityNumY[k]=cityNumX[i]
				}
			}
				

////////////********* Crea cityNamY exit
			
		/////////////************ Loop (-j-) sulle città destinazione
		
			for(j=0;j<cityName.length+cityNamY.length;j++) {   
				if (j<cityName.length) {
					appo=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[j]))
				}else {
					appo=JSON.parse('{"name" : "'+cityNamY[j-cityName.length]+'"}')
					appo.name=cityNamY[j-cityName.length]
				}
				memSource=new Array ()
				memArrival=new Array ()
				memChargeSt=new Array ()
				memMission=new Array ()
				memWood=new Array ()
				memWine=new Array ()
				memMarble=new Array ()
				memCrystal=new Array ()
				memSulfur=new Array ()
				memTime=new Array ()
				memTimeArr=new Array ()
				memUnit=new Array ()
				flag=0
				kk=0
				
			/////////////********* Loop (-i-) sulle missioni
			
				for (i=0; i<elpay.length; i++) {
					for (k=0;k<15;k++) {
						memUnit[i]=new Array()
					}
					if  (target[i]==cityName[j]  || target[i]==cityNamY[j-cityName.length] ) {

						if (target[i]==cityName[j]) {
							flag=1
						}else  {
							flag=2
						}
						if (ostile[i]==1) {
							appo.hostile=1
						}
						memSource[kk]=source[i]
						memArrival[kk]=arrival[i]
						memChargeSt[kk]=chargeStatus[i]
						memMission[kk]=mission[i]
						memWood[kk]=tr_wood[i]
						memWine[kk]=tr_wine[i]
						memMarble[kk]=tr_marble[i]
						memCrystal[kk]=tr_crystal[i]
						memSulfur[kk]=tr_sulfur[i]
						stringaTempo (memArrival[kk],myora,mymin,mysec)
						memTime[kk]=parseInt(3600*myora)+parseInt(60*mymin)+parseInt(mysec)
						memTimeArr[kk]=parseInt(CompTime)+parseInt(memTime[kk])
						
						for (k=0;k<15;k++) {
							memUnit[kk][k]=tr_unit[i][k]
						}
						kk=kk+1
					}
				}
				if (flag>0) {
					if (flag==1) {					
						nomevar='citybuildings'+cityName[j]
					}else {
						nomevar='navyout'+cityNamY[j-cityName.length]	
						appo.cityIdX=cityNumY[j-cityName.length]
					}
					appo.source=memSource
					appo.arrival=memArrival
					appo.chargeSt=memChargeSt
					appo.mission=memMission
					appo.tr_wood=memWood
					appo.tr_wine=memWine
					appo.tr_marble=memMarble
					appo.tr_crystal=memCrystal
					appo.tr_sulfur=memSulfur
					appo.timeArr=memTimeArr
					appo.tr_unit=memUnit
					myJSONText = JSON.stringify(appo)
					setVar(nomevar,myJSONText)
				}
			}
		}

	 }
//////////////////////////////////////
	
//////////////**************************** OTHERS VIEWS	*********/////////////////////////////
	if (view != 'finances' && view != 'cityMilitary' && view != 'merchantNavy') {

       	JSONcitydata.wood=document.getElementById("js_GlobalMenu_wood").firstChild.nodeValue
       	JSONcitydata.wine=document.getElementById("js_GlobalMenu_wine").firstChild.nodeValue
       	JSONcitydata.marble=document.getElementById("js_GlobalMenu_marble").firstChild.nodeValue
		JSONcitydata.crystal=document.getElementById("js_GlobalMenu_crystal").firstChild.nodeValue
		JSONcitydata.sulfur=document.getElementById("js_GlobalMenu_sulfur").firstChild.nodeValue
		JSONcitydata.servertime=parseInt(CompTime)
		
		elupgr=document.getElementById("buildingUpgrade")
		if (elupgr) {
			elh4=elupgr.getElementsByTagName("h4")
			elres=elupgr.getElementsByClassName("resources")
			strNeed=''
			if (elres[0]) {
				strNeed=elh4[0].firstChild.nodeValue+'\n'
			}
			
			nMat=''
			nMarble=''
			nGlt=''
			nGlass=''
			nSut=''
			nSulfur=''
			nWit=''
			nWine=''
			upbutton=document.getElementById("js_buildingUpgradeButton")
			if (upbutton) {

				nWo=elres[0].getElementsByClassName("wood")
				nWot=nWo[0].title+' : '
				nWood=nWo[0].childNodes[1].nodeValue+		'.....|\n'

				nMa=elres[0].getElementsByClassName("marble")
				if (nMa[0]) {
					nMat=nMa[0].title+' : '
					nMarble=nMa[0].childNodes[1].nodeValue+	'.....|\n'
				}

				nGl=elres[0].getElementsByClassName("glass")
				if (nGl[0]) {
					nGlt=nGl[0].title+' : '
					nGlass=nGl[0].childNodes[1].nodeValue+	'.....|\n'
				}

				nSu=elres[0].getElementsByClassName("sulfur")
				if (nSu[0]) {
					nSut=nSu[0].title+' : '
					nSulfur=nSu[0].childNodes[1].nodeValue+	'.....|\n'
				}

				nWi=elres[0].getElementsByClassName("wine")
				if (nWi[0]) {
					nWit=nWi[0].title+' : '			
					nWine=nWi[0].childNodes[1].nodeValue+	'.....|\n'
				}

				nTi=elres[0].getElementsByClassName("time")
				if (nTi[0]) {
					nTit=nTi[0].title+' : '			
					nTime=nTi[0].childNodes[1].nodeValue+	'\n'
				}
			}else {
				strNeed='Max Level'
			}
			
			if (view=='townHall') {
				ipos=0
			}else {
				eldow=elupgr.getElementsByClassName("downgrade")
				elbut=eldow[0].getElementsByClassName("action_btn")
				ix=elbut[0].href.indexOf('position=',0)
				iy=elbut[0].href.indexOf('&',ix)
				ipos=elbut[0].href.substring(ix+9,iy)
			}
			
			if (JSONcitydata.tipLevel && upbutton) {
				JSONcitydata.tipLevel[ipos].upStr=strNeed
				JSONcitydata.tipLevel[ipos].upWood=nWot+nWood
				JSONcitydata.tipLevel[ipos].upMarble=nMat+nMarble
				JSONcitydata.tipLevel[ipos].upGlass=nGlt+nGlass
				JSONcitydata.tipLevel[ipos].upSulfur=nSut+nSulfur
				JSONcitydata.tipLevel[ipos].upWine=nWit+nWine
				JSONcitydata.tipLevel[ipos].upTime=nTit+nTime
			}else {
				JSONcitydata.tipLevel[ipos].upStr=strNeed
			}
		}
		
		////************** CENTRO CITTA' **************////
		if (view == 'townHall') {
			JSONcitydata.PopulationGrowth=document.getElementById("js_TownHallPopulationGrowthValue").firstChild.nodeValue
			JSONcitydata.servertimeGrowth=JSONcitydata.servertime
			JSONcitydata.MaxInhabitants=document.getElementById("js_TownHallMaxInhabitants").firstChild.nodeValue
		}	
		var myJSONText = JSON.stringify(JSONcitydata)
		var JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
////////////////////*********   MAGAZZINI *************///////////////////////////
	if (view=='warehouse'){
		xsafe=document.getElementsByClassName("capacitiesTableResult")
		JSONcitydata.xsafe=xsafe[0].childNodes[3].innerHTML
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
///////////////////**************  PORTI **************/////////////////////////////////////
	if (view=='port'){
		chtime=document.getElementById("js_loadingSpeedSumValue")
		JSONcitydata.chtime=chtime.childNodes[0].nodeValue
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
/////////////////////************* ACCADEMIA *******************///////////////////////////////
	if (view=='academy') {
		elmac=document.getElementsByClassName("scientists")
		elmac1=document.getElementById("valueWorkers")
		elmac2=document.getElementById("valueResearch")
		elmac3=document.getElementsByClassName("timeUnit")
		JSONcitydata.scientists=elmac[0].firstChild.nodeValue+' '+elmac1.firstChild.nodeValue+
			';\n'+trad(ctry,'Research')+': '+elmac2.firstChild.nodeValue+' '+elmac3[0].firstChild.nodeValue
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
//////////////////************** MUSEO ****************************////////////////////////////////
	if (view=='museum') {
		elmuse0=document.getElementsByClassName("goods")
		elmuse1=elmuse0[0].getElementsByTagName("p")
		strMus=s.serializeToString(elmuse1[0])
		ix=strMus.indexOf('>',0)
		iy=strMus.indexOf('<',ix)
		strMus1=strMus.substring(ix+1,iy).trim()
		ix=strMus.indexOf('/span>',0)
		iy=strMus.indexOf('/span>',ix+1)
		strMus2=strMus.substring(ix+6,iy-1).trim()
		JSONcitydata.museum=strMus1+' '+strMus2
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
//////////////////************** TAVERNA ****************************////////////////////////////////
	if (view=='tavern') {
		/*
		eltave0=document.getElementsByClassName("dropDownButton")
		strTave=eltave0[1]
		strTave1=strTave.getElementsByTagName("a")
		strTave2=strTave1[0].firstChild.nodeValue
		*/
		
		eltavm=document.getElementById("wineAmount")
		eltavm1=eltavm.getElementsByTagName("option")
		eltavm2=eltavm1[eltavm1.length-1]
		strTave3=eltavm2.firstChild.nodeValue
		strTave4='\n(max = '+strTave3+')'
		
		ix=strTave3.indexOf(' ',0)
		strTave2=cityReduxUse[currentI]+' '+strTave3.substring(ix+1,strTave3.length)
		
		JSONcitydata.tavern=strTave2+strTave4
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
//////////////////************** NASCONDIGLIO ****************************////////////////////////////////
	if (view=='safehouse') {
		JSONcitydata.movespy=null
		JSONcitydata.arrspy=null
		elspy=document.getElementsByClassName("spyinfo")
		if (elspy[0]) {
			tipspy=new Array()
			arrspy=new Array()
			sep=''
			for (i=0;i<elspy.length;i++) {
				if (i>0) {
					sep='\n---------------------------\n'
				}
				strspy1=elspy[i].getElementsByClassName("city")[0].innerHTML
				strspy2=elspy[i].getElementsByTagName("li")[1].innerHTML
				strspy3=elspy[i].getElementsByClassName("status")[0].innerHTML
				eltime=elspy[i].getElementsByClassName("time")[0].childNodes[2].nodeValue
				/// replace per trim
				tipspy[i]=sep+strspy2+' - '+strspy3+' - \n'+'==> '+strspy1.replace(/^\s+|\s+$/g,"")+' : '+eltime.replace(/^\s+|\s+$/g,"")+';'

				strTempoExt (eltime,myday,myora,mymin,mysec)
				aptime=parseInt(86400*myday)+parseInt(3600*myora)+parseInt(60*mymin)+parseInt(mysec)
				arrspy[i]=parseInt(CompTime)+parseInt(aptime)
			} 

			JSONcitydata.movespy=tipspy
			JSONcitydata.arrspy=arrspy

		}
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
	
//////////////////************** OFFICINA ****************************////////////////////////////////
	if (view=='workshop') {
		JSONcitydata.Office=null
		JSONcitydata.OfficeT=null
		JSONcitydata.OfficeX=null
		work0=document.getElementById("upgradeCountdown")
		
		if (work0) {
			work1=work0.parentNode.parentNode
			arma=work1.firstChild.nodeValue.trim()
			work2=work1.getElementsByTagName("p")
			upgr=work2[0].firstChild.nodeValue
			work3=s.serializeToString(document.getElementById("upgradeProgress"))
			xpos=work3.indexOf("width: ",1)
			ypos=work3.indexOf("%",xpos)
			perc=work3.substring(xpos+7,ypos)
			work4=work1.parentNode.parentNode.parentNode.parentNode
			ww=s.serializeToString(work4)
			//alert(ww)
			xpos=ww.indexOf('div title="',1)
			ypos=ww.indexOf('"',xpos+11)
			unit=ww.substring(xpos+11,ypos)
			ore=work4.getElementsByTagName("li")[2].innerHTML.replace('h','')
			restime=parseInt(3600*ore*(1-perc/100))
			artime=parseInt(CompTime)+restime
			restim=tempoNorm(restime)
			
			JSONcitydata.Office=unit+' : '+arma+'; '+upgr+'\n==> '+restim+' ('+parseInt(perc)+'%)'
			JSONcitydata.OfficeT=artime
			JSONcitydata.OfficeX=ore
		}

		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
//////////////////************** CASERMA o CANTIERE NAVALE ****************************///////////////
	if (view=='barracks' || view=='shipyard') {
		
		if (view=='barracks') {
			JSONcitydata.upArmy=null
			JSONcitydata.upArmyT=null
			JSONcitydata.upArmyX=null
		}else {
			JSONcitydata.SupArmy=null
			JSONcitydata.SupArmyT=null
			JSONcitydata.SupArmyX=null
		}

		elclist=document.getElementById("unitConstructionList")
		if (elclist) {
		
			elclist1=elclist.childNodes[1].innerHTML.replace(':','')   ///"In costruzione :"
			elcarmyT=elclist.getElementsByClassName("army_wrapper")
			elcarmyN=elclist.getElementsByClassName("unitcounttextlabel")
			elctime=document.getElementById("buildCountDown")
			elcbloc=elclist.getElementsByClassName("constructionBlock")
			elcperc=document.getElementById("buildProgress").title
			elclist1=elclist1+'('+elcperc+')'
			elcperc=1-elcperc.replace('%','')/100
			elctim=elctime.innerHTML
			strTempoExt (elctim,myday,myora,mymin,mysec)
			aptime=parseInt(86400*myday)+parseInt(3600*myora)+parseInt(60*mymin)+parseInt(mysec)
			totime=parseInt(aptime/elcperc)
			
			arTime=new Array()
			arTime[0]=parseInt(CompTime)+parseInt(aptime)
			
			lqueue=0
			if (elcbloc) {
				strbloc=''
				for (i=0;i<elcbloc.length;i++) {
				
					h4=elcbloc[i].getElementsByTagName("h4")
					xspan=h4[0].getElementsByTagName("span")
					qdes=h4[0].firstChild.nodeValue			//"In coda - n"
					qtime=xspan[0].firstChild.nodeValue  		//Tempo di coda
					strTempoExt (qtime,myday,myora,mymin,mysec)
					aptime=parseInt(86400*myday)+parseInt(3600*myora)+parseInt(60*mymin)+parseInt(mysec)
					arTime[i+1]=parseInt(CompTime)+parseInt(aptime)
					
					elbarmyT=elcbloc[i].getElementsByClassName("army_wrapper")
					elbarmyN=elcbloc[i].getElementsByClassName("unitcounttextlabel")
					strbarm=''
					for (j=0;j<elbarmyT.length;j++) {
						lqueue++
						elbarmT=elbarmyT[j].title
						elbarmN=elbarmyN[j].firstChild.nodeValue+';'
						strbarm+=elbarmT+' : '+elbarmN+'\n'
					}
					strbloc+='---------------------------\n'+qdes+'==>\n'+qtime+';\n'+strbarm
				}
			}
			
			strcarm=''
			for (i=0;i<elcarmyT.length-lqueue;i++) {
				elcarmT=elcarmyT[i].title
				elcarmN=elcarmyN[i].firstChild.nodeValue+';'
				strcarm+=elcarmT+' : '+elcarmN+'\n'
			}

			
			if (view=='barracks') {
				JSONcitydata.upArmy=elclist1+' ==> '+elctim+';\n'+strcarm+strbloc
				JSONcitydata.upArmyT=arTime
				JSONcitydata.upArmyX=totime
			}else {
				JSONcitydata.SupArmy=elclist1+' ==> '+elctim+';\n'+strcarm+strbloc
				JSONcitydata.SupArmyT=arTime
				JSONcitydata.SupArmyX=totime
			}

		}
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
////////////////////**************** FORTEZZA PIRATA **************///////////////////////////////	
	if (view=='pirateFortress') {
		JSONcitydata.Piracy=null
		JSONcitydata.PiracyT=null
	
		elpira=document.getElementsByClassName("pirateHeader")
		elpoint=elpira[0].getElementsByClassName("capturePoints")[0]
		tpoint=elpira[0].getElementsByClassName("textLabel")[0].innerHTML
		ppoint=elpira[0].getElementsByClassName("value")[0].innerHTML
		tequip=elpira[0].getElementsByClassName("textLabel")[1].innerHTML
		pequip=elpira[0].getElementsByClassName("value")[6].innerHTML
		ntime=elpira[0].getElementsByClassName("time")[0]
		ttime=ntime.getElementsByClassName("textLabel")[0].innerHTML
		ptime=ntime.getElementsByClassName("value")[0].innerHTML
		strTempoExt (ptime,myday,myora,mymin,mysec)
		aptime=parseInt(86400*myday)+parseInt(3600*myora)+parseInt(60*mymin)+parseInt(mysec)
		artime=parseInt(CompTime)+aptime
		restim=tempoNorm(aptime)
		JSONcitydata.Piracy=tpoint+' '+ppoint+'\n'+tequip+' '+pequip+'\n'+ttime+' ==> '+ptime+';'
		JSONcitydata.PiracyT=artime
		
		myJSONText = JSON.stringify(JSONcitydata)
		JSONcity = JSON.parse(myJSONText)
		setVar("citybuildings"+currentCity,myJSONText)
	}
////////////////////**************** RESEARCH ADVISOR **************///////////////////////////////	
	if (view=='researchAdvisor') {
		elrese=document.getElementById("js_researchAdvisorScientists")
		if (elrese) {
			elreset=document.getElementsByClassName("scientists")
			elrese1=document.getElementById("js_researchAdvisorPoints")
			elrese1t=document.getElementsByClassName("points")
			elrese2=document.getElementById("js_researchAdvisorTime")
			elrese2t=document.getElementsByClassName("time")
			resdata=elreset[0].firstChild.nodeValue+' '+elrese.firstChild.nodeValue+ ';\n'+
				elrese1t[0].firstChild.nodeValue+' '+elrese1.firstChild.nodeValue+ ';\n'+
				elrese2t[0].firstChild.nodeValue+' '+elrese2.firstChild.nodeValue
			setVar ("research",resdata)
			setVar ("timeRes",a0(CompTime)+'"')
		}
	}
////////////////////**************** FALEGNAMERIA e CAVE **************///////////////////////////////	
	if (view=='resource' || view=='tradegood') {
	
		elrich=document.getElementsByClassName("dynamic resUpgrade")
		elliv1=elrich[0].getElementsByTagName("p")[0].firstChild.nodeValue
		elliv2=elrich[0].getElementsByTagName("p")[1].firstChild.nodeValue
		elric1=elrich[0].getElementsByTagName("h4")[0].firstChild.nodeValue
		
		//quando è in upgrading
		/*
		<div class="headline bold center is_upgrading margin10">Wird ausgebaut!</div>
                <h4 class="bold center">Nächste Stufe:  6</h4>
                <div class="progressbar margin10center"><div class="bar" id="upgradeProgress" title="17%" style="width: 17%;"></div></div>
                <div class="center" id="upgradeCountDown">1h 16m</div>
                */
		finishx='0'
		elupd1=''
		totime=''
		if (elrich[0].getElementsByTagName("li")[0]) {
			elric2=elrich[0].getElementsByTagName("li")[0].firstChild.nodeValue
			eldis1=elrich[0].getElementsByTagName("h4")[1].firstChild.nodeValue
			eldis2=elrich[0].getElementsByTagName("li")[1].firstChild.nodeValue
			string0=elliv1+'==> '+elliv2+'\n'+elric1+'==> '+elric2+'\n'+eldis1+'==> '+eldis2+'\n'+'-----------------------------\n'
		}else { 
			elupd1=document.getElementById("upgradeProgress").title
			elupd2=document.getElementById("upgradeCountDown").firstChild.nodeValue
			strTempoExt (elupd2,myday,myora,mymin,mysec)
			aptime=parseInt(86400*myday)+parseInt(3600*myora)+parseInt(60*mymin)+parseInt(mysec)
			finishx=parseInt(CompTime)+parseInt(aptime)
			perc=1-elupd1.replace('%','')/100
			totime=parseInt(aptime/perc)
			string0=elliv1+'==> '+elliv2+'\n'+elric1+'\n'+xSp1+elupd1+' ==> '+'['+elupd2+']\n'+'-----------------------------\n'
		}

		elreso=document.getElementById("resourceUsers")
		eluser=elreso.getElementsByClassName("ownerName")
		inumb=eluser.length
		if (inumb>1) {
			eltown=elreso.getElementsByClassName("cityName")
			elleve=elreso.getElementsByClassName("cityLevel")
			elwork=elreso.getElementsByClassName("cityWorkers")
			eldona=elreso.getElementsByClassName("ownerDonation")
			user=new Array()
			town=new Array()
			leve=new Array()
			work=new Array()
			dona=new Array()
			umax=tmax=lmax=wmax=dmax=0
			//campo=new Array(20).join("0").concat('oiu')  //prova padding
			//alert (campo)
			for (i=0;i<inumb;i++) {
				user[i]=eluser[i].innerHTML
				if (user[i]=='&nbsp;') {
					user[i]=user[i-1]
				}
				town[i]=eltown[i].firstChild.nodeValue
				leve[i]=elleve[i].firstChild.nodeValue
			 	work[i]=elwork[i].firstChild.nodeValue
				if (eldona[i].firstChild) {
					dona[i]=eldona[i].firstChild.nodeValue
				}else {
					dona[i]='******'
				}
				if (umax<user[i].length) {umax=user[i].length}
				if (tmax<town[i].length) {tmax=town[i].length}
				if (lmax<leve[i].length) {lmax=leve[i].length}
				if (wmax<work[i].length) {wmax=work[i].length}
				if (dmax<dona[i].length) {dmax=dona[i].length}
			}
			string=string1=''
			for (i=0;i<inumb;i++) {
				string1+=user[i]+' -'+new Array(umax+1-user[i].length).join(xSp1)+
					town[i]+' -'+new Array(tmax+1-town[i].length).join(xSp1)+
					leve[i]+' -'+new Array(lmax+2-leve[i].length).join(xSp1)+
					work[i]+new Array(wmax+2-work[i].length).join(xSp1)+
					'==> '+dona[i]+'\n' //new Array(dmax+3-dona[i].length).join(xSp1)+'\n'
			}
			setVar(view+JSONcitys[currentI].islandId,string0+string1+'finish='+finishx+'|'+elupd1+totime)
		}
	}
//////////////////////////////////////******** MILITARY ADVISOR ***********/////////////////////////////	
	if (view=='militaryAdvisor') {

	
//////// Inizializza le missioni
		for(i=0;i<cityName.length;i++){
			appo=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[i]))
			appo.sourceN=null
			appo.arrivalN=null
			appo.missionN=null
			appo.chargeStN=null
			appo.Units=null
			appo.TipNavy=null
			appo.NumNavy=null
			appo.NumShip=null
			appo.timeArrN=null
			appo.friend=null
			appo.hostile=null

			myJSONText = JSON.stringify(appo)
			setVar("citybuildings"+cityName[i],myJSONText)
		}
///// cancella le citta' non proprie
		GMlista=GM_listValues ()
		strDel=document.location.host+'armyout'

		for (i=0;i<GMlista.length;i++) {
			if (GMlista[i].indexOf(strDel,0)>=0) {
				GM_deleteValue(GMlista[i])
			}
		}
		wcountArmy=new Array () 
		for (var k = 0; k < 26; k++) {
			wcountArmy[k]=0
		}
		
////////////////// check missioni
		elnavy=document.getElementsByClassName("mission_icon deployfleet")
		elarmy=document.getElementsByClassName("mission_icon deployarmy")
		eldefen=document.getElementsByClassName("mission_icon defend_port")
		eldefci=document.getElementsByClassName("mission_icon defend")
	        elblock=document.getElementsByClassName("mission_icon blockade")
	        elplund=document.getElementsByClassName("mission_icon plunder")
	        eloccup=document.getElementsByClassName("mission_icon occupy")
	        elpraid=document.getElementsByClassName("mission_icon piracyRaid")
	        

 	        if 	(elnavy && elnavy[0] != null	||
 	        	elarmy && elarmy[0] != null	|| 
			eldefen && eldefen[0] != null	||
			eldefci && eldefci[0] != null	||
			elblock && elblock[0] != null	|| 
			elplund && elplund[0] != null	||
			eloccup && eloccup[0] != null	
			||	elpraid && elpraid[0]
			)  {

			strNavy= new Array()
			arrival=new Array()
			chargeStN=new Array()
			units=new Array()
			source=new Array()
			cityNum=new Array()
			target=new Array()
			elMission=new Array()
			NumNavy=new Array()
			strN=new Array()
			
			len1=elnavy.length          //distribuisci flotta
			len2=len1+elarmy.length     //distribuisci esercito
			len3=len2+eldefen.length    //difendi porto
			len4=len3+eldefci.length    //difendi città
			len5=len4+elblock.length    //blocca porto
			len6=len5+elplund.length    //saccheggia
			len7=len6+eloccup.length    //occupa città
			len8=len7+elpraid.length    //raid pirata
			
			for (i=0;i<len8;i++) {
				chargeStN[i]=0
				if (i<len1) {
					elmiss=elnavy[i].parentNode.parentNode
				}else {
					if (i<len2) {
						elmiss=elarmy[i-len1].parentNode.parentNode
					}else {
						if (i<len3) {
							elmiss=eldefen[i-len2].parentNode.parentNode
						}else {
							if (i<len4) {
								elmiss=eldefci[i-len3].parentNode.parentNode
							}else {
								if (i<len5) {	
									elmiss=elblock[i-len4].parentNode.parentNode
								}else {
									if (i<len6) {
										elmiss=elplund[i-len5].parentNode.parentNode
									}else {
										if (i<len7) {	
											elmiss=eloccup[i-len6].parentNode.parentNode
										}else {
											elmiss=elpraid[i-len7].parentNode.parentNode
										}
									}
								}
							}
						}
					}
				}
				strNavy[i]=s.serializeToString(elmiss)
				
				/////////////////************************** tempo di arrivo (arrival)
				ix=strNavy[i].indexOf('ArrivalTime',0)
				iy=strNavy[i].indexOf('"',ix)
				ix=strNavy[i].indexOf('id="',ix-42)
				evid=strNavy[i].substring(ix+4,iy)
				arrival[i]=document.getElementById(evid).firstChild.nodeValue
				
				/////////////////************************** Unità generiche (units)
				ix=strNavy[i].indexOf('Units',0)
				if (ix==-1) {
					units[i]='------'
				}else {
					iy=strNavy[i].indexOf('</div>',ix)
					units[i]=strNavy[i].substring(ix+7,iy)
				}

				/////////////////************************** Città di partenza (source)
				ix=strNavy[i].indexOf('OriginLink',0)
				iy=strNavy[i].indexOf('>',ix)
				iz=strNavy[i].indexOf('<',iy)
				source[i]=strNavy[i].substring(iy+1,iz)
				
				////**************** Stato ("caricamento","in corso",o "annullato)
				arrow=elmiss.getElementsByClassName("mission arrow_right")
				if (arrow[0]) {
					chargeStN[i]=1
				}else {
					arrow=elmiss.getElementsByClassName("mission arrow_left_green")
					if (arrow[0]) {
						chargeStN[i]=3
					}
				}
				
				/////////////////************************** Città e Id di arrivo (target e cityNum)
				ix=strNavy[i].indexOf('TargetLink',0)
				if (ix==-1) {
					target[i]='?????'
					cityNum[i]='!!!!!'
				}else {					
					iy=strNavy[i].indexOf('>',ix)
					iz=strNavy[i].indexOf('<',iy)
					target[i]=strNavy[i].substring(iy+1,iz)

					ix=ix-70
					iy=strNavy[i].indexOf('cityId=',ix)
					iz=strNavy[i].indexOf('"',iy)
					cityNum[i]=strNavy[i].substring(iy+7,iz)
				}
				
				/////////////////************************** Nome missione (elMission)
				ix=strNavy[i].indexOf('Mission"',0)
				iy=strNavy[i].indexOf('OriginAvatar',0)
				iz=strNavy[i].indexOf('js_Military',iy)
				idMission=strNavy[i].substring(iz,ix+7)
				elMission[i]=document.getElementById(idMission).title
				
				/////////////////*********************** Nome e numero delle unità di dettaglio (strN e NumNavy)
				ix=strNavy[i].indexOf('UnitDetails',0)
				iy=strNavy[i].indexOf('Tooltip"',0)
				iz=strNavy[i].indexOf('js_Military',iy)
				idDetail=strNavy[i].substring(iz,ix+11)
				
				NumNavy[i]=new Array()
				strN[i]=new Array()
				
				elDetail=document.getElementById(idDetail)
				if (elDetail) {
					collection=elDetail.childNodes

					for (k=0;k<collection.length;k++) {
						strN0=s.serializeToString(elDetail.childNodes[k])
						ix=strN0.indexOf('class=',0)
						iy=strN0.indexOf('">',ix)
						strN[i][k]=strN0.substring(ix+7,iy)
						strN[i][k]=strN[i][k].replace('unit_detail_icon floatleft icon40 bold center ','')
						NumNavy[i][k]=elDetail.childNodes[k].innerHTML
					}
				}else {
					NumNavy[i]='??'
					strN[i]='?????'
				}
			}
			///////////////////////************ Fine loop sulle missioni


//////////**************  Crea una tabella cityNamY (e cityNumY)  con le citta' non proprie

			target0=new Array ()
			cityNum0=new Array ()
			cityNamX=new Array ()
			cityNumX=new Array ()
			cityNamY=new Array ()
			cityNumY=new Array ()
			
			/// il deployfleet può andare al contrario a partire da un porto occupato
			/// in quel caso un città non propria (target di ritorno) può ricadere prima di len2
			///pertanto si sostituiscono le istruzioni che seguono (tenere sotto controllo)
			/*
			for (i=0;i<len7-len2;i++) {
				target0[i]=target[i+len2]
				cityNum0[i]=cityNum[i+len2]
			}
			*/
			for (i=0;i<len8;i++) {
				target0[i]=target[i]
				cityNum0[i]=cityNum[i]
			}

			if (target0.length>0) {
				cityNamX[0]=target0[0]
				cityNumX[0]=cityNum0[0]				
				k=0
			}
			for (i=1;i<target0.length;i++) {
				trov=0
				for (j=0;j<i;j++) {
					if (target0[i]==cityNamX[j]) {
						trov=1
						break
					}
				}
				if (trov==0) {
					k++
					cityNamX[k]=target0[i]
					cityNumX[k]=cityNum[i]
				}
			}
			//// qualche città propria potrebbe trovarsi tra len2 e len4 :  la si elimina copiando da cityNamX a cityNamY
			k=-1
			for (i=0;i<cityNamX.length;i++) {
				trov=0
				for (j=0;j<cityName.length;j++) {
					if (cityNamX[i]==cityName[j]) {
						trov=1
						break
					}
				}
				if (trov==0) {
					k++
					cityNamY[k]=cityNamX[i]
					cityNumY[k]=cityNumX[i]
				}
			}

                ////////////********* Crea cityNamY exit

			////////////****** Loop (-j-) sulle città, proprie e non, di destinazione delle missioni

			
            for(j=0;j<cityName.length+cityNamY.length;j++) { 
				if (j<cityName.length) {
					appo=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[j]))
				}else {
					appo=JSON.parse('{"name" : "'+cityNamY[j-cityName.length]+'"}')
					appo.name=cityNamY[j-cityName.length]
				}
				memSource=new Array ()
				memUnits=new Array ()
				memNumUnit=new Array ()
				memTipUnit=new Array ()
				memNumShip=new Array ()
				memArrival=new Array ()
				memChargeStN=new Array ()
				memMission=new Array ()
				memTime=new Array ()
				memTimeArr=new Array ()
				flag=0
				kk=0
				////////////******** Loop (-i-) sulle missioni verso ciascuna città

				for (i=0; i<len8; i++) {
					for (k=0;k<26;k++) {
						memNumUnit[i]=new Array ()
						memTipUnit[i]=new Array ()
					}
					if  (target[i]==cityName[j]  || target[i]==cityNamY[j-cityName.length] ) {

						if (target[i]==cityName[j]) {
							flag=1
						}else  {
							flag=2
						}
						if (i<len4) {
							appo.friend=1     			/// attività amichevoli
						}else {
							appo.hostile=1				/// attività ostili
						}
						
						memSource[kk]=source[i]
						memUnits[kk]=units[i]
						memArrival[kk]=arrival[i]
						memChargeStN[kk]=chargeStN[i]
						memMission[kk]=elMission[i]
						stringaTempo (memArrival[kk],myora,mymin,mysec)
						memTime[kk]=parseInt(3600*myora)+parseInt(60*mymin)+parseInt(mysec)
						memTimeArr[kk]=parseInt(CompTime)+parseInt(memTime[kk])
						
						if (strN[i][0]=='ship_transport') {
							memNumShip[kk]=NumNavy[i][0]
						}
							
						////***** Loop (-k-) sulle unità di dettaglio di ciascuna missione
						for (k=0;k<26;k++) {	
						////  indice dell'unità in viaggio
							if (strN[i][k]>' ' && strN[i][k] !='ship_transport') {
								mm=tindex(strN[i][k])
								memNumUnit[kk][mm]=NumNavy[i][k]
								memTipUnit[kk][mm]=strN[i][k]
							}
						}
					kk=kk+1
					}
				}

				if (flag>0) {
					if (flag==1) {					
						nomevar='citybuildings'+cityName[j]
					}else {
						nomevar='armyout'+cityNamY[j-cityName.length]	
						appo.cityIdX=cityNumY[j-cityName.length]
						appo.countArmy=wcountArmy
					}
					appo.sourceN=memSource
					appo.Units=memUnits
					appo.arrivalN=memArrival
					appo.chargeStN=memChargeStN
					appo.missionN=memMission
					appo.timeArrN=memTimeArr
					appo.NumNavy=memNumUnit
					appo.NumShip=memNumShip
					appo.TipNavy=memTipUnit
					myJSONText = JSON.stringify(appo)
    				setVar(nomevar,myJSONText)
				}
       		}
  		}
	}

//////////////////////////////

/////////////******************************** FINANCES  ********************////////////////////////

	if (view =='finances') {

		var element=document.getElementById("finances");
		
		var el1=element.getElementsByClassName("table01 border upkeepReductionTable")
		var el2=el1[2]

		var el2Str = s.serializeToString(el2)
		var in1=el2Str.indexOf('"hidden bold"',0)
		var in2=el2Str.indexOf('<',in1)
		var goldHour=el2Str.substr(in1+14,in2-in1-14)
		if (!goldHour) {
			in2=el2Str.indexOf('<',in1+15)
			goldHour=el2Str.substr(in1+37,in2-in1-37)}

		// ZONA TEST
		/*
			xCSS='@import "http://' + document.location.host + '/skin/compiled-it-island-0.5.1.1.css"'
			insCSS(xCSS)
			getHead = document.getElementsByTagName("HEAD")[0];
			alert(s.serializeToString(getHead))
		//GM_log (JSON.stringify(JSONcitydata))
		//*** per i test su xmlhttpRequest
		//GM_xmlhttpRequest({
		//  method: "GET",
		//url: "http://s3.it.ikariam.com/index.php?view=city&oldBackgroundView=city&mainbox_x=274&mainbox_y=0&mainbox_z=5&sidebar_x=45&sidebar_y=0&sidebar_z=170&containerWidth=1037px&containerHeight=889px&worldviewWidth=1037px&worldviewHeight=843px&cityTop=-180px&cityLeft=-1933px&cityRight=&cityWorldviewScale=0.8/",
		//  onload: function(response) {
		//	GM_log(response.responseText)
		// alert(response.responseText);
		//	}
		//})


		//  per i test sul parser 
		var strXml= '<tr>aaaa</tr><tr>bbbbbbbbbbbbb</tr>'
		var parser = new DOMParser();
		var docu = parser.parseFromString(strXml, "application/xml")
		str=s.serializeToString(docu) //.childNodes[1].childNodes[2])
		alert (str)
       		*/
       		// FINE ZONA TEST
		
		
		
		banner =  (element.childNodes[1].childNodes[1].childNodes[0].childNodes[0]); //check for add_banner above table
		b=0;
		if(banner){  // if banner all nodes are shifted 2 up
			b=1;
		}    
		for(i=0;i<cityName.length;i++){    
			var test = GM_getValue(document.location.host+"citybuildings"+cityName[i]);
			if(test) {
				JSONcitys[i]=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[i]));
				j=i*2;
	           		JSONcitys[i].Bruto  = (element.childNodes[1].childNodes[1].childNodes[7+b].childNodes[1].childNodes[j+2].childNodes[3].innerHTML);
	      			JSONcitys[i].ScienceCost = (element.childNodes[1].childNodes[1].childNodes[7+b].childNodes[1].childNodes[j+2].childNodes[5].childNodes[0].innerHTML);
           	  		JSONcitys[i].Netto = (element.childNodes[1].childNodes[1].childNodes[7+b].childNodes[1].childNodes[j+2].childNodes[7].innerHTML);
				JSONcitys[i].goldHour=goldHour
				var myJSONText = JSON.stringify(JSONcitys[i]);  //convert back to string for storage
				var JSONcity = JSON.parse(myJSONText); // convert to JSON for use in program , If program fails here there is an error in the string
				setVar("citybuildings"+cityName[i],myJSONText); // store the data for the city
			}else{
			}
		}
	}
//////////////////////////////////////////////////

/////////////////////******************** CITYMILITARY  **********//////////////////////////////////////

	if (view == 'cityMilitary'){
	//window.location.reload()
	//window.parent.frames[1].location.reload()
		
	
		var element=document.getElementById("tabUnits");
		
		////////////////////////////////////////////////////////////////////////////////////////////////
		//*   blocco di istruzioni per reperire, in maniera alternativa, nomi e numero di unita' - xnome e xcont
		//
		xnome= new Array ()
		xcont=new Array()
		e=element.getElementsByClassName("table01")
		d0=e[0].getElementsByClassName("title_img_row")
		e0=e[0].getElementsByClassName("count")
		d00=d0[0].getElementsByTagName("th")
		e00=e0[0].getElementsByTagName("td")
		d1=e[1].getElementsByClassName("title_img_row")
		e1=e[1].getElementsByClassName("count")
		d10=d1[0].getElementsByTagName("th")
		e10=e1[0].getElementsByTagName("td")
        d2=e[2].getElementsByClassName("title_img_row")
		e2=e[2].getElementsByClassName("count")
		d20=d2[0].getElementsByTagName("th")
		e20=e2[0].getElementsByTagName("td")

		for (j=0; j<d00.length; j++) {
			xnome[j]=d00[j].title
			xcont[j]=e00[j].childNodes[0].nodeValue
		}
		k=j
		for (j=0; j<d10.length; j++) {
			xnome[k]=d10[j].title
			xcont[k]=e10[j].childNodes[0].nodeValue
			k=k+1
		}

        m=k
		for (j=0; j<d20.length; j++) {
			xnome[m]=d20[j].title
			xcont[m]=e20[j].childNodes[0].nodeValue
			m=m+1
		}

		var element=document.getElementById("tabShips");
				
		e=element.getElementsByClassName("table01")
		d0=e[0].getElementsByClassName("title_img_row")
		e0=e[0].getElementsByClassName("count")
		d00=d0[0].getElementsByTagName("th")
		e00=e0[0].getElementsByTagName("td")
		d1=e[1].getElementsByClassName("title_img_row")
		e1=e[1].getElementsByClassName("count")
		d10=d1[0].getElementsByTagName("th")
		e10=e1[0].getElementsByTagName("td")
        
		for (j=0; j<d00.length; j++) {
			xnome[m]=d00[j].title
			xcont[m]=e00[j].childNodes[0].nodeValue
			m=m+1
		}

        for (j=0; j<d10.length; j++) {
			xnome[m]=d10[j].title
			xcont[m]=e10[j].childNodes[0].nodeValue
			m=m+1
		}

		// fine blocco di istruzioni alternative
		///////////////////////////////////////////////////////////////////////////////////////////
		/*
		banner =  (element.childNodes[1].childNodes[1].childNodes[0].childNodes[0]); //check for add_banner above table
		b=0;
		if(banner){  // if banner all nodes are shifted 2 up
			b=2;	
		}    

		
///////////// Imposta e salva le unita' militari
		
		var elem= new Array(2);
		elem[0]=document.getElementById("tabUnits");
		elem[1]=document.getElementById("tabShips");
		var ind3=new Array (1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,3,3,3,3,3);
		var ind6=new Array (1,3,5,7,9,11,13,1,3,5,7,9,11,13,1,3,5,7,9,11,1,3,5,7,9);
		
		for (k=0; k<25; k++) {
			var j = parseInt(k/14);
			nameArmy[k] = elem[j].childNodes[1].childNodes[3].childNodes[ind3[k]].childNodes[1].childNodes[0].childNodes[ind6[k]].title;
			countArmy[k]=elem[j].childNodes[1].childNodes[3].childNodes[ind3[k]].childNodes[1].childNodes[2].childNodes[ind6[k]].firstChild.nodeValue;
		}
        */
        
        for (k=0; k<26; k++) {
			nameArmy[k] = xnome[k];
			countArmy[k]= xcont[k];
		}

		JSONcitydata.nameArmy=nameArmy;
		JSONcitydata.countArmy=countArmy;

		var myJSONText = JSON.stringify(JSONcitydata);  //convert back to string for storage
		var JSONcity = JSON.parse(myJSONText); // convert to JSON for use in program , If program fails here there is an error in the string
		setVar("citybuildings"+currentCity,myJSONText); // store the data for the city
		

	}
////////////////////////////////////////

//////////////////// ALL VIEWS
	///reload all on array
	for(i=0;i<cityName.length;i++){
		var test = GM_getValue(document.location.host+"citybuildings"+cityName[i]);
		if(test) {
			JSONcitys[i]=JSON.parse(GM_getValue(document.location.host+"citybuildings"+cityName[i]));
		}else{
			//GM_log(i+' '+cityName[i] +'Error! citydata not found , visit city to get data');
		}
	}
///////////////////////////////////////

	cargar_dealers(); // update display
}

///// TRADUZIONI IN ALTRE LINGUE
function trad(paese,stringa) {
	switch (stringa) {
		case 'http://ikariam.wikia.com/wiki/Main_Page' :
			switch (paese) {
				case 'it' :
					return 'http://it.ikariam.wikia.com/wiki/Ikariam_Wiki'
					break
				case 'fr' :
					return 'http://fr.ikariam.wikia.com/wiki/Accueil'
					break
				case 'de' :
					return 'http://de.ikariam.wikia.com/wiki/Ikariam-_Wiki'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'http://es.ikariam.wikia.com/wiki/Portada'
					break
				case 'br' :	
				case 'pt' :
					return 'http://pt.ikariam.wikia.com/wiki/Página_principal'
					break
				default :
					return stringa
					break
			}
		break
		case 'Towns' :
			switch (paese) {
				case 'it' :
					return 'Città'
					break
				case 'fr' :
					return 'Villes'
					break
				case 'de' :
					return 'Städte'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Ciudades'
					break
				case 'br' :
				case 'pt' :
					return 'Cidades'
					break
				default :
					return stringa
					break
			}
		case 'city' :
			switch (paese) {
				case 'it' :
					return 'città'
					break
				case 'fr' :
					return 'ville'
					break
				case 'de' :
					return 'städte'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' : 
				case 'es' :
					return 'ciudad'
					break
				case 'br' :
				case 'pt' :
					return 'cidade'
					break
				default :
					return stringa
					break
			}
		break
		case 'Total' :
			switch (paese) {
				case 'it' :
					return 'Totale'
					break
				case 'fr' :
					return 'Total'
					break
				case 'de' :
					return 'Gesamt'
					break
				default :
					return stringa
					break
			}
		break
		case 'Total/day' :
			switch (paese) {
				case 'it' :
					return 'Totale/giorno'
					break
				case 'fr' :
					return 'Total/jour'
					break
				case 'de' :
					return 'Gesamt/tag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' : 
				case 'es' :
					return 'Total/día'
					break
				case 'br' :
				case 'pt' :
					return 'Total/dia'
					break
				default :
					return stringa
					break
			}
		break
		case 'Show Buildings' :
			switch (paese) {
				case 'it' :
					return 'Mostra Edifici'
					break
				case 'fr' :
					return 'Montrer bâtiments'
					break
				case 'de' :
					return 'Zeige Gebäude'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' : 
				case 'es' :
					return 'Mostrar Edificios'
					break
				case 'br' :
				case 'pt' :
					return 'Mostrar Edifícios'
					break
				default :
					return stringa
					break
			}
		break
		case 'Hide Buildings' :
			switch (paese) {
				case 'it' :
					return 'Nascondi Edifici'
					break
				case 'fr' :
					return 'Cacher bâtiments'
					break
				case 'de' :
					return 'Verberge Gebäude'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' : 
				case 'es' :
					return 'Ocultar Edificios'
					break
				case 'br' :
				case 'pt' :
					return 'Esconder Edifícios'
					break
				default :
					return stringa
					break
			}
		break
		case 'Show Resources' :
			switch (paese) {
				case 'it' :
					return 'Mostra Risorse'
					break
				case 'fr' :
					return 'Montrer Ressources'
					break
				case 'de' :
					return 'Zeige Ressourcen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Mostrar Recursos'
					break
				case 'br' :
				case 'pt' :
					return 'Mostrar Recursos'
					break
				default :
					return stringa
					break
			}
		break
		case 'Hide Resources' :
			switch (paese) {
				case 'it' :
					return 'Nascondi Risorse'
					break
				case 'fr' :
					return 'Cacher Ressources'
					break
				case 'de' :
					return 'Verberge Ressourcen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Ocultar Recursos'
					break
				case 'br' :
				case 'pt' :
					return 'Esconder Recursos'
					break
				default :
					return stringa
					break
			}
		break
		case 'Show Army' :
			switch (paese) {
				case 'it' :
					return 'Mostra Armate'
					break
				case 'fr' :
					return 'Montrer Armée'
					break
				case 'de' :
					return 'Zeige Armee'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Mostrar Milicia'
					break
				case 'br' :
				case 'pt' :
					return 'Mostrar Exército'
					break
				default :
					return stringa
					break
			}
		break
		case 'Hide Army' :
			switch (paese) {
				case 'it' :
					return 'Nascondi Armate'
					break
				case 'fr' :
					return 'Cacher Armée'
					break
				case 'de' :
					return 'Verberge Armee'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Ocultar Milicia'
					break
				case 'br' :
				case 'pt' :
					return 'Esconder Exército'
					break
				default :
					return stringa
					break
			}
		break
		case 'Reset Data' :
			switch (paese) {
				case 'it' :
					return 'Reinizializzazione'
					break
				case 'fr' :
					return 'Réinitialiser'
					break
				case 'de' :
					return 'Daten zurücksetzen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Restablecer los datos'
					break
				case 'br' :
				case 'pt' :
					return 'Restaurar dados'
					break
				default :
					return stringa
					break
			}
		break
		case 'Show Town' :
			switch (paese) {
				case 'it' :
					return 'Mostra Città'
					break
				case 'fr' :
					return 'Montrer la ville'
					break
				case 'de' :
					return 'Zeige Stadt'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Mostrar Ciudad'
					break
				case 'br' :
				case 'pt' :
					return 'Mostrar Cidade'
					break
				default :
					return stringa
					break
			}
		break
		case 'Show Island' :
			switch (paese) {
				case 'it' :
					return "Mostra Isola"
					break
				case 'fr' :
					return "Montrer l'île"
					break
				case 'de' :
					return 'Zeige Insel'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Mostrar Isla'
					break
				case 'br' :
				case 'pt' :
					return 'Mostrar Ilha'
					break
				default :
					return stringa
					break
			}
		break
		case 'Show World' :
			switch (paese) {
				case 'it' :
					return 'Mostra Mondo'
					break
				case 'fr' :
					return 'Montrer le monde'
					break
				case 'de' :
					return 'Zeige Weltkarte'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Mostrar Mundo'
					break
				case 'br' :
				case 'pt' :
					return 'Mostrar Mundo'
					break
				default :
					return stringa
					break
			}
		break
		case 'Monday' :
			switch (paese) {
				case 'it' :
					return 'Lunedi'
					break
				case 'fr' :
					return 'Lundi'
					break
				case 'de' :
					return 'Montag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Lunes'
					break
				case 'br' :
				case 'pt' :
					return 'Segunda-feira'
					break
				default :
					return stringa
					break
			}
		break
		case 'Tuesday' :
			switch (paese) {
				case 'it' :
					return 'Martedi'
					break
				case 'fr' :
					return 'Mardi'
					break
				case 'de' :
					return 'Dienstag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Martes'
					break
				case 'br' :
				case 'pt' :
					return 'Terça-feira'
					break
				default :
					return stringa
					break
			}
		break
		case 'Wednesday' :
			switch (paese) {
				case 'it' :
					return 'Mercoledi'
					break
				case 'fr' :
					return 'Mercredi'
					break
				case 'de' :
					return 'Mittwoch'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Miércoles'
					break
				case 'br' :
				case 'pt' :
					return 'Quarta-feira'
					break
				default :
					return stringa
					break
			}
		break
		case 'Thursday' :
			switch (paese) {
				case 'it' :
					return 'Giovedi'
					break
				case 'fr' :
					return 'Jeudi'
					break
				case 'de' :
					return 'Donnerstag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Jueves'
					break
				case 'br' :
				case 'pt' :
					return 'Quinta-feira'
					break
				default :
					return stringa
					break
			}
		break
		case 'Friday' :
			switch (paese) {
				case 'it' :
					return 'Venerdi'
					break
				case 'fr' :
					return 'Vendredi'
					break
				case 'de' :
					return 'Freitag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Viernes'
					break
				case 'br' :
				case 'pt' :
					return 'Sexta-feira'
					break
				default :
					return stringa
					break
			}
		break
		case 'Saturday' :
			switch (paese) {
				case 'it' :
					return 'Sabato'
					break
				case 'fr' :
					return 'Samedi'
					break
				case 'de' :
					return 'Samstag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Sábado'
					break
				case 'br' :
				case 'pt' :
					return 'Sábado'
					break
				default :
					return stringa
					break
			}
		break
		case 'Sunday' :
			switch (paese) {
				case 'it' :
					return 'Domenica'
					break
				case 'fr' :
					return 'Dimanche'
					break
				case 'de' :
					return 'Sonntag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Domingo'
					break
				case 'br' :
				case 'pt' :
					return 'Domingo'
					break
				default :
					return stringa
					break
			}
		break
		case 'day' :
			switch (paese) {
				case 'it' :
					return 'giorno'
					break
				case 'fr' :
					return 'jour'
					break
				case 'de' :
					return 'tag'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'día'
					break
				case 'br' :
				case 'pt' :
					return 'dia'
					break
				default :
					return stringa
					break
			}
		break
		case 'week' :
			switch (paese) {
				case 'it' :
					return 'settimana'
					break
				case 'fr' :
					return 'semaine'
					break
				case 'de' :
					return 'woche'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'semana'
					break
				case 'br' :
				case 'pt' :
					return 'semana'
					break
				default :
					return stringa
					break
			}
		break
		case 'at' :
			switch (paese) {
				case 'it' :
					return 'alle'
					break
				case 'fr' :
					return 'à'
					break
				case 'de' :
					return 'um'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'a'
					break
				case 'br' :
				case 'pt' :
					return 'às'
					break
				default :
					return stringa
					break
			}
		break
		case 'D' :
			switch (paese) {
				case 'it' :
					return 'G'
					break
				case 'fr' :
					return 'J'
					break
				case 'de' :
					return 'T'
					break
				default :
					return stringa
					break
			}
		break
		case 'Merchant ships overview and control'+
				'\n____________________________________'+
				'\nyellow=loading goods/troops'+
				'\nred=loading finished'+
				'\nblue=goods/troops in transit'+
				'\ngreen=goods/troops arrived' :
			switch (paese) {
				case 'it' :
					return 'Riepilogo e controllo delle navi mercantili'+
				'\n________________________________________________'+
				'\ngiallo=carico merci/truppe'+
				'\nrosso=carico merci/truppe terminato'+
				'\nblu=merci/truppe in viaggio'+
				'\nverde=merci/truppe arrivate'
					break
				case 'fr' :
					return 'Vue et contrôle des navires marchands'+
				'\n__________________________________________'+
				'\njaune=chargement ressources/troupes'+
				'\nrouge=chargement terminé'+
				'\nbleu=ressources/troupes en transit'+
				'\nvert=ressources/troupes arrivées'
					break
				case 'de' :
					return 'Handelsschiffe Übersicht und Kontrolle'+
				'\n__________________________________________'+
				'\ngelb=belade Waren/Truppen'+
				'\nrot=beladen Waren/Truppen'+
				'\nblau=Waren/Truppen unterwegs'+
				'\ngrün=Waren/Truppen eingetroffen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Visión general y control de los barcos mercantes'+
				'\n__________________________________________'+
				'\namarillo=carga mercancías/tropas'+
				'\nrojo=carga mercancías/tropas completada'+
				'\nazul=Mercancias/tropas en tránsito'+
				'\nverde=Mercancias/tropas llegado'
					break
				case 'br' :
				case 'pt' :
					return 'Resumo e controle dos barcos de comércio'+
				'\n__________________________________________'+
				'\namarelo=carga mercadorias/tropas'+
				'\nvermelho=carga mercadorias/tropas concluída'+
				'\nazul=Mercadorias/tropas em trânsito'+
				'\nverde=Mercadorias/tropas chegaram'
					break
				default :
					return stringa
					break
			}
		break
		case 'Safe goods' :
			switch (paese) {
				case 'it' :
					return 'Merci protette'
					break
				case 'fr' :
					return 'Marchandises sécurisées'
					break
				case 'de' :
					return 'Plündersicher'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Bienes protegidos'
					break
				case 'br' :
				case 'pt' :
					return 'Bens protegidos'
					break
				default :
					return stringa
					break
			}
		break
		case 'Overview towns/finances' :
			switch (paese) {
				case 'it' :
					return 'Riepilogo città/finanze'
					break
				case 'fr' :
					return 'Vue villes/finances'
					break
				case 'de' :
					return 'Übersicht Städte/Finanzen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Informe sobre ciudades y finanzas'
					break
				case 'br' :
				case 'pt' :
					return 'Vista geral das cidades y finanças'
					break
				default :
					return stringa
					break
			}
		break
		case 'Military overview and control' :
			switch (paese) {
				case 'it' :
					return 'Riepilogo e controllo Forze Armate'
					break
				case 'fr' :
					return "Vue et contrôle de l'Armée"
					break
				case 'de' :
					return "Übersicht und Kontrolle Militär"
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return "Informe militar"
					break
				case 'br' :
				case 'pt' :
					return "Vista geral militar"
					break
				default :
					return stringa
					break
			}
		break
		case 'citizens' :
			switch (paese) {
				case 'it' :
					return 'cittadini'
					break
				case 'fr' :
					return 'citoyens'
					break
				case 'de' :
					return 'Bürger'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'ciudadanos'
					break
				case 'br' :
				case 'pt' :
					return 'cidadãos'
					break
				default :
					return stringa
					break
			}
		break
		case 'current population' :
			switch (paese) {
				case 'it' :
					return 'popolazione attuale'
					break
				case 'fr' :
					return 'population actuelle'
					break
				case 'de' :
					return 'derzeitige Bevölkerung'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'población actual'
					break
				case 'br' :
				case 'pt' :
					return 'população atual'
					break
				default :
					return stringa
					break
			}
		break
		case 'maximum population : growth' :
			switch (paese) {
				case 'it' :
					return 'popolazione massima : crescita'
					break
				case 'fr' :
					return 'population maximale : croissance'
					break
				case 'de' :
					return 'maximale Bevölkerung : Wachstum'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'población máxima : crecimiento'
					break
				case 'br' :
				case 'pt' :
					return 'população máxima: crescimento'
					break
				default :
					return stringa
					break
			}
		break
		case 'total citizens' :
			switch (paese) {
				case 'it' :
					return 'totale cittadini'
					break
				case 'fr' :
					return 'total de citoyens'
					break
				case 'de' :
					return 'Gesamt Bürger'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'total ciudadanos'
					break
				case 'br' :
				case 'pt' :
					return 'total cidadãos'
					break
				default :
					return stringa
					break
			}
		break
		case 'total population' :
			switch (paese) {
				case 'it' :
					return 'totale popolazione'
					break
				case 'fr' :
					return 'population totale'
					break
				case 'de' :
					return 'Gesamtbevölkerung'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'total población'
					break
				case 'br' :
				case 'pt' :
					return 'total população'
					break
				default :
					return stringa
					break
			}
		break
		case 'population limit' :
			switch (paese) {
				case 'it' :
					return 'popolazione limite'
					break
				case 'fr' :
					return 'limite de population'
					break
				case 'de' :
					return 'Bevölkerung Grenze'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'población límite'
					break
				case 'br' :
				case 'pt' :
					return 'limite de população'
					break
				default :
					return stringa
					break
			}
		break
		case 'population' :
			switch (paese) {
				case 'it' :
					return 'popolazione'
					break
				case 'fr' :
					return 'population'
					break
				case 'de' :
					return 'Bevölkerung'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'población'
					break
				case 'br' :
				case 'pt' :
					return 'população'
					break
				default :
					return stringa
					break
			}
		break
		case 'Full' :
			switch (paese) {
				case 'it' :
					return 'Pieno'
					break
				case 'fr' :
					return 'Complète'
					break
				case 'de' :
					return 'Voll'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Completo'
					break
				case 'br' :
				case 'pt' :
					return 'Completo'
					break
				default :
					return stringa
					break
			}
		break
		case 'Empty' :
			switch (paese) {
				case 'it' :
					return 'Vuoto'
					break
				case 'fr' :
					return 'Vide'
					break
				case 'de' :
					return 'Leer'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Vacío'
					break
				case 'br' :
				case 'pt' :
					return 'Vazio'
					break
				default :
					return stringa
					break
			}
		break
		case 'within' :
			switch (paese) {
				case 'it' :
					return 'entro'
					break
				case 'fr' :
					return 'dans'
					break
				case 'de' :
					return 'in'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'en'
					break
				case 'br' :
				case 'pt' :
					return 'em'
					break
				default :
					return stringa
					break
			}
		break
		case 'never' :
			switch (paese) {
				case 'it' :
					return 'mai'
					break
				case 'fr' :
					return 'jamais'
					break
				case 'de' :
					return 'nie'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'nunca'
					break
				case 'br' :
				case 'pt' :
					return 'nunca'
					break
				default :
					return stringa
					break
			}
		break
		case 'hours' :
			switch (paese) {
				case 'it' :
					return 'ore'
					break
				case 'fr' :
					return 'heures'
					break
				case 'de' :
					return 'Stunden'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'horas'
					break
				case 'br' :
				case 'pt' :
					return 'horas'
					break
				default :
					return stringa
					break
			}
		break
		case 'hour' :
			switch (paese) {
				case 'it' :
					return 'ora'
					break
				case 'fr' :
					return 'heure'
					break
				case 'de' :
					return 'Stunde'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'hora'
					break
				case 'br' :
				case 'pt' :
					return 'hora'
					break
				default :
					return stringa
					break
			}
		break
		case 'gold' :
			switch (paese) {
				case 'it' :
					return 'oro'
					break
				case 'fr' :
					return 'or'
					break
				case 'de' :
					return 'Gold'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'oro'
					break
				case 'br' :
				case 'pt' :
					return 'ouro'
					break
				default :
					return stringa
					break
			}
		break
		case 'produced' :
			switch (paese) {
				case 'it' :
					return 'prodotto'
					break
				case 'fr' :
					return 'produit'
					break
				case 'de' :
					return 'produziert'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'producido'
					break
				case 'br' :
				case 'pt' :
					return 'produzido'
					break
				default :
					return stringa
					break
			}
		break
		case 'scientists' :
			switch (paese) {
				case 'it' :
					return 'scienziati'
					break
				case 'fr' :
					return 'scientifiques'
					break
				case 'de' :
					return 'Wissenschaftler'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'científicos'
					break
				case 'br' :
				case 'pt' :
					return 'cientistas'
					break
				default :
					return stringa
					break
			}
		break
		case 'Research' :
			switch (paese) {
				case 'it' :
					return 'Ricerca'
					break
				case 'fr' :
					return 'Recherche'
					break
				case 'de' :
					return 'Forschungsleistung'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Investigación'
					break
				case 'br' :
				case 'pt' :
					return 'Pesquisa'
					break
				default :
					return stringa
					break
			}
		break
		case 'spent' :
			switch (paese) {
				case 'it' :
					return 'speso'
					break
				case 'fr' :
					return 'dépensé'
					break
				case 'de' :
					return 'verbraucht'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'gastado'
					break
				case 'br' :
				case 'pt' :
					return 'gasto'
					break
				default :
					return stringa
					break
			}
		break
		case 'net earning' :
			switch (paese) {
				case 'it' :
					return 'guadagno netto'
					break
				case 'fr' :
					return 'gain net'
					break
				case 'de' :
					return 'Nettoergebnis'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'ganancia neta'
					break
				case 'br' :
				case 'pt' :
					return 'ganho líquido'
					break
				default :
					return stringa
					break
			}
		break
		case 'gold held' :
			switch (paese) {
				case 'it' :
					return 'oro posseduto'
					break
				case 'fr' :
					return 'or détenu'
					break
				case 'de' :
					return 'Goldbestand'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'oro en su poder'
					break
				case 'br' :
				case 'pt' :
					return 'ouro mantido'
					break
				default :
					return stringa
					break
			}
		break
		case 'Building material' :
			switch (paese) {
				case 'it' :
					return 'Legno'
					break
				case 'fr' :
					return  'Matériau de construction'
					break
				case 'de' :
					return 'Baumaterial'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Madera'
					break
				case 'br' :
				case 'pt' :
					return 'Materiais de construção'
					break
				default :
					return stringa
					break
			}
		break
		case 'Wine' :
			switch (paese) {
				case 'it' :
					return 'Vino'
					break
				case 'fr' :
					return 'Vin'
					break
				case 'de' :
					return 'Wein'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Vino'
					break
				case 'br' :
				case 'pt' :
					return 'Vinho'
					break
				default :
					return stringa
					break
			}
		break
		case 'Marble' :
			switch (paese) {
				case 'it' :
					return 'Marmo'
					break
				case 'fr' :
					return 'Marbre'
					break
				case 'de' :
					return 'Marmor'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Mármol'
					break
				case 'br' :
				case 'pt' :
					return 'Mármore'
					break
				default :
					return stringa
					break
			}
		break
		case 'Crystal Glass' :
			switch (paese) {
				case 'it' :
					return 'Cristallo'
					break
				case 'fr' :
					return 'Verre de cristal'
					break
				case 'de' :
					return 'Kristallglas'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Cristal'
					break
				case 'br' :
				case 'pt' :
					return 'Cristal'
					break
				default :
					return stringa
					break
			}
		break
		case 'Sulphur' :
			switch (paese) {
				case 'it' :
					return 'Zolfo'
					break
				case 'fr' :
					return 'Soufre'
					break
				case 'de' :
					return 'Schwefel'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Azufre'
					break
				case 'br' :
				case 'es' :
					return 'Enxofre'
					break
				default :
					return stringa
					break
			}
		break
		case 'consumed' :
			switch (paese) {
				case 'it' :
					return 'consumato'
					break
				case 'fr' :
					return 'consommé'
					break
				case 'de' :
					return 'verbraucht'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'consumida'
					break
				case 'br' :
				case 'pt' :
					return 'consumida'
					break
				default :
					return stringa
					break
			}
		break
		case 'consumption' :
			switch (paese) {
				case 'it' :
					return 'consumo'
					break
				case 'fr' :
					return 'consommation'
					break
				case 'de' :
					return 'Verbrauch'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'consumo'
					break
				case 'br' :
				case 'pt' :
					return 'consumo'
					break
				default :
					return stringa
					break
			}
		break

		case 'After your confirmation, you must visit all the cities to refresh the data\n' :
			switch (paese) {
				case 'it' :
					return 'Dopo la conferma, è necessario visitare tutte le città per aggiornare i dati\n'
					break
				case 'fr' :
					return 'Après la confirmation, vous devez visiter toutes'+
						' les villes pour rafraîchir les données\n'
					break
				case 'de' :
					return 'Nach Ihrer Bestätigung, müssen Sie besuchen alle Städte, um die Daten zu aktualisieren\n'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Después de su confirmación, deberá visitar todas las ciudades para actualizar los datos\n'
					break
				case 'br' :
				case 'pt' :
					return 'Após a confirmação, você deve visitar todas as cidades para atualizar os dados\n'
					break
				default :
					return stringa
					break
			}
		break
		case 'Confirm' :
			switch (paese) {
				case 'it' :
					return 'Confermi'
					break
				case 'fr' :
					return 'Confirmer'
					break
				case 'de' :
					return 'Bestätigen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Confirmar'
					break
				case 'br' :
				case 'pt' :
					return 'Confirmar'
					break
				default :
					return stringa
					break
			}
		break
		case 'click for transport goods/army from current city' :
			switch (paese) {
				case 'it' :
					return 'clicca per il trasporto di merci/esercito dalla città corrente'
					break
				case 'fr' :
					return 'cliquez pour le transport de marchandises/armée de la ville actuelle'
					break
				case 'de' :
					return 'Klicken Sie für den Transport Waren/Armee aus aktuellen Stadt'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'clic para el transporte de mercancías/ejército de la ciudad actual'
					break
				case 'br' :
				case 'pt' :
					return 'clique para transporte de mercadorias/exército de cidade atual'
					break
				default :
					return stringa
					break
			}
		break
		case 'no transport to the same city' :
			switch (paese) {
				case 'it' :
					return 'nessun trasporto per la città stessa'
					break
				case 'fr' :
					return 'pas de transport dans la même ville'
					break
				case 'de' :
					return 'kein Transport aus der gleichen Stadt'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'no hay transporte a la misma ciudad'
					break
				case 'br' :
				case 'pt' :
					return 'nenhum transporte para a mesma cidade'
					break
				default :
					return stringa
					break
			}
		break
		case 'no fleet/army to the same city' :
			switch (paese) {
				case 'it' :
					return 'nessuna flotta/esercito per la città stessa'
					break
				case 'fr' :
					return 'pas de flotte/armée dans la même ville'
					break
				case 'de' :
					return 'kein Flotte/Armee aus der gleichen Stadt'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'no hay flota/ejército a la misma ciudad'
					break
				case 'br' :
				case 'pt' :
					return 'nenhum frota/exército para a mesma cidade'
					break
				default :
					return stringa
					break
			}
			'no fleet/army to the same city'
		break
		case 'Port occupied by' :
			switch (paese) {
				case 'it' :
					return 'Porto occupato da'
					break
				case 'fr' :
					return 'Port occupé par'
					break
				case 'de' :
					return 'Hafen besetzt durch'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Puerto ocupado por'
					break
				case 'br' :
				case 'pt' :
					return 'Porto ocupado pela'
					break
				default :
					return stringa
					break
			}
		break
		case 'City occupied by' :
			switch (paese) {
				case 'it' :
					return 'Città occupata da'
					break
				case 'fr' :
					return 'Ville occupée par'
					break
				case 'de' :
					return 'Stadt besetzt durch'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'Ciudad ocupada por'
					break
				case 'br' :
				case 'pt' :
					return 'Cidade ocupada pela'
					break
				default :
					return stringa
					break
			}
		break
		case 'deploy fleet' :
			switch (paese) {
				case 'it' :
					return 'dispiega flotta'
					break
				case 'fr' :
					return 'déployer flotte'
					break
				case 'de' :
					return 'stationiere Flotte'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'despliegue flota'
					break
				case 'br' :
				case 'pt' :
					return 'implantar frota'
					break
				default :
					return stringa
					break
			}
		break
		case 'deploy army' :
			switch (paese) {
				case 'it' :
					return 'dispiega esercito'
					break
				case 'fr' :
					return 'déployer armée'
					break
				case 'de' :
					return 'stationiere Armee'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'despliegue ejército'
					break
				case 'br' :
				case 'pt' :
					return 'implantar exército'
					break
				default :
					return stringa
					break
			}
		break
		case 'defend harbour' :
			switch (paese) {
				case 'it' :
					return 'difendi porto'
					break
				case 'fr' :
					return 'défendre port'
					break
				case 'de' :
					return 'verteidige Hafen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'defender puerto'
					break
				case 'br' :
				case 'pt' :
					return 'defender porto'
					break
				default :
					return stringa
					break
			}
		break
		case 'defend city' :
			switch (paese) {
				case 'it' :
					return 'difendi città'
					break
				case 'fr' :
					return 'défendre port'
					break
				case 'de' :
					return 'verteidige Stadt'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'defender ciudad'
					break
				case 'br' :
				case 'pt' :
					return 'defender cidade'
					break
				default :
					return stringa
					break
			}
		break
		case 'blockade harbour' :
			switch (paese) {
				case 'it' :
					return 'blocca porto'
					break
				case 'fr' :
					return 'bloquer port'
					break
				case 'de' :
					return 'blockade Hafen'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'bloquear puerto'
					break
				case 'br' :
				case 'pt' :
					return 'bloqueia porto'
					break
				default :
					return stringa
					break
			}
		break
		case 'occupy city' :
			switch (paese) {
				case 'it' :
					return 'occupa città'
					break
				case 'fr' :
					return 'occuper ville'
					break
				case 'de' :
					return 'besetzen Stadt'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'ocupar ciudad'
					break
				case 'br' :
				case 'pt' :
					return 'ocupar cidade'
					break
				default :
					return stringa
					break
			}
		break
		case 'completed' :
			switch (paese) {
				case 'it' :
					return 'completato'
					break
				case 'fr' :
					return 'terminé'
					break
				case 'de' :
					return 'fertiggestellt'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'terminado'
					break
				case 'br' :
				case 'pt' :
					return 'concluído'
					break
				default :
					return stringa
					break
			}
		break
		case 'merchant ships' :
			switch (paese) {
				case 'it' :
					return 'navi mercantili'
					break
				case 'fr' :
					return 'navires marchands'
					break
				case 'de' :
					return 'Handlsschiffe'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'barcos mercantes'
					break
				case 'br' :
				case 'pt' :
					return 'barcos de comércio'
					break
				default :
					return stringa
					break
			}
		break
		case 'visit the forest' :
			switch (paese) {
				case 'it' :
					return 'visitare la foresta'
					break
				case 'fr' :
					return 'visiter la forêt'
					break
				case 'de' :
					return 'besuchen Sie den Wald'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'visitar el bosque'
					break
				case 'br' :
				case 'pt' :
					return 'visitara floresta'
					break
				default :
					return stringa
					break
			}
		break
		case 'visit the Sulphur pit' :
			switch (paese) {
				case 'it' :
					return 'visitare la cava di Zolfo'
					break
				case 'fr' :
					return 'visiter la Soufrière'
					break
				case 'de' :
					return 'besuchen Sie den Schwefelgrube'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'visitar la mina de Azufre'
					break
				case 'br' :
				case 'pt' :
					return 'visitar o poço de Enxofre'
					break
				default :
					return stringa
					break
			}
		break
		case 'visit the Quarry' :
			switch (paese) {
				case 'it' :
					return 'visitare la Cava'
					break
				case 'fr' :
					return 'visiter la Carrière'
					break
				case 'de' :
					return 'besuchen Sie die Marmormine'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'visitar la Cantera'
					break
				case 'br' :
				case 'pt' :
					return 'visitar a Pedreira'
					break
				default :
					return stringa
					break
			}
		break
		case 'visit the Crystal mine' :
			switch (paese) {
				case 'it' :
					return 'visitare la miniera di Cristallo'
					break
				case 'fr' :
					return 'visiter la mine de Cristal'
					break
				case 'de' :
					return 'besuchen Sie die Kristalmine'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'visitar la mina de Cristal'
					break
				case 'br' :
				case 'pt' :
					return 'visitar a mina de Cristal'
					break
				default :
					return stringa
					break
			}
		break
		case 'visit the Vines' :
			switch (paese) {
				case 'it' :
					return 'visitare i Vigneti'
					break
				case 'fr' :
					return 'visiter les Vignes'
					break
				case 'de' :
					return 'besuchen Sie die Weinberge'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'visitar los Viñedos'
					break
				case 'br' :
				case 'pt' :
					return 'visitar as Vinhas'
					break
				default :
					return stringa
					break
			}
		break
		case 'not visited yet' :
			switch (paese) {
				case 'it' :
					return 'non ancora visitata'
					break
				case 'fr' :
					return 'pas encore visitée'
					break
				case 'de' :
					return 'nicht besucht'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'aún no visitados'
					break
				case 'br' :
				case 'pt' :
					return 'ainda não visitadas'
					break
				default :
					return stringa
					break
			}
		break
		case 'YOU HAVE NOT VISITED ALL CITIES YET' :
			switch (paese) {
				case 'it' :
					return 'NON HAI ANCORA VISITATO TUTTE LE CITTÀ'
					break
				case 'fr' :
					return "VOUS N'AVEZ PAS VISITÉ ENCORE TOUTES LES VILLES"
					break
				case 'de' :
					return 'SIE HABEN NOCH NICHT ALLE STÄDTE BESUCHT'
					break
				case 'ar' :
				case 'cl' :
				case 'co' :
				case 'mx' :
				case 'pe' :
				case 've' :
				case 'es' :
					return 'AÚN NO HA VISITADO TODAS LAS CIUDADES'
					break
				case 'br' :
				case 'pt' :
					return 'AINDA NÃO VISITOU TODAS AS CIDADES'
					break
				default :
					return stringa
					break
			}
		break
			
		default :
			return stringa
		break
	}
}


			
		
				
 
