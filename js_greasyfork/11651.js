// ==UserScript==
// @name		HWM_map_patrol
// @version		0.43
// @description		HWM_map_patrol (2021.11.18)
// @include		http://178.248.235.15/war.php*
// @include		http://178.248.235.15/map.php*
// @include		http://178.248.235.15/move_sector.php*
// @include        	https://www.heroeswm.*/war.php*
// @include        	https://www.heroeswm.*/map.php*
// @include        	https://www.heroeswm.*/move_sector.php*
// @grant		GM_getValue
// @grant		GM_setValue
// @icon           	https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @namespace 		https://greasyfork.org/users/14188
// @license       	GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/11651/HWM_map_patrol.user.js
// @updateURL https://update.greasyfork.org/scripts/11651/HWM_map_patrol.meta.js
// ==/UserScript==

// ========================================================
(function () {
var version		= "0.43";
var url_cur		= location.href;
var url_prot		= location.protocol;
var url_base		= url_prot+'//'+location.hostname+'/';
var url_1		= "www.heroeswm.ru";
var url_2		= "178.248.235.15";
var patrolMaxDelaySec 	= 15; // max delay in seconds
// ==================================================================
if (url_cur.indexOf("war.php") != -1) {
	var sound_enable = GM_getValue("sound_enbl",true); 
	if (sound_enable && (document.URL.toString().indexOf('lt=-1') == -1)) {
		if (document.body.innerHTML.indexOf("btype|26") != -1) {
//			new Audio("https://sound-pack.net/download/Sound_03017.wav").play();
			new Audio("https://sound-pack.net/download/Sound_16538.mp3").play();
		}
	}
	return;
} 
// ==================================================================
var sectors = []; // map sectors
sectors.push( [0,0,"E"] ); 			//0
sectors.push( [50,50,"Empire Capital"] );   	//1
sectors.push( [51,50,"East River"] );       	//2
sectors.push( [50,49,"Tiger Lake"] );		//3
sectors.push( [51,49,"Rogue Wood"] );		//4
sectors.push( [50,51,"Wolf Dale"] );		//5
sectors.push( [50,48,"Peaceful Camp"] );	//6
sectors.push( [49,51,"Lizard Lowland"] );	//7
sectors.push( [49,50,"Green Wood"] );		//8
sectors.push( [49,48,"Eagle Nest"] );		//9
sectors.push( [50,52,"Portal Ruins"] );		//10
sectors.push( [51,51,"Dragon Caves"] );		//11
sectors.push( [49,49,"Shining Spring"] );	//12
sectors.push( [48,49,"Sunny Sity"] );		//13
sectors.push( [52,50,"Magma Mines"] );		//14
sectors.push( [52,49,"Bear' Mountain"] );	//15
sectors.push( [52,48,"Fairy Trees"] );		//16
sectors.push( [53,50,"Harbour City"] );		//17
sectors.push( [53,49,"Mithril Coast"] );	//18
sectors.push( [51,52,"GreatWall"] );		//19
sectors.push( [51,53,"Titan's Valley"] );	//20
sectors.push( [52,53,"Fishing Village"] );	//21
sectors.push( [52,54,"Kingdom Capital"] );	//22
sectors.push( [48,48,"Ungovernable Steppe"] );	//23
sectors.push( [51,48,"Crystal Garden"] );	//24
sectors.push( [53,52,"East Island"] );		//25
sectors.push( [49,52,"Wilderness"] );		//26
sectors.push( [48,50,"Sublime Arbor"] );	//27
// ==================================================================
var available_directions = [0]; //
available_directions.push( [10,3,2,4,5,7,11,8,12,22] );	//1
available_directions.push( [6,16,21,3,1,4,14,15,11,5,22,8,23] );//2
available_directions.push( [1,2,4,8,12,9,6,24] );	//3
available_directions.push( [11,15,2,1,3,6,24] );	//4
available_directions.push( [1,2,11,10,7,8,26] );	//5
available_directions.push( [2,16,21,4,3,12,9,24,22] );	//6
available_directions.push( [8,1,5,10,26] );		//7
available_directions.push( [2,13,12,3,1,5,7] );		//8
available_directions.push( [13,12,3,6,23] );		//9
available_directions.push( [1,7,5,11,19,26] );		//10
available_directions.push( [4,19,10,5,1,2,14] );	//11
available_directions.push( [9,6,3,1,8,13,23] );		//12
available_directions.push( [9,12,8,23] );		//13
available_directions.push( [2,11,15,17] );		//14
available_directions.push( [16,18,17,14,2,4,24] );	//15
available_directions.push( [2,6,21,15,17] );		//16
available_directions.push( [14,18,15] );		//17
available_directions.push( [17,16,15] );		//18
available_directions.push( [10,11,21,22] );		//19
available_directions.push( [19,21,22] );		//20
available_directions.push( [2,6,16,19,20,22] );		//21
available_directions.push( [2,6,1,20,21,23] );		//22
available_directions.push( [9,12,13,22,2] );		//23
available_directions.push( [3,4,6,15] );		//24
available_directions.push( [] );			//25
available_directions.push( [5,7,10] );			//26
available_directions.push( [7,8,12,13] );		//27
// ==================================================================
if(url_cur.indexOf(url_1) != -1) { var sect1 = GM_getValue( "sector1_1" , 1);}
if(url_cur.indexOf(url_2) != -1) { var sect1 = GM_getValue( "sector1_2" , 1);}
if(url_cur.indexOf(url_1) != -1) { var sect2 = GM_getValue( "sector2_1" , 1);}
if(url_cur.indexOf(url_2) != -1) { var sect2 = GM_getValue( "sector2_2" , 1);}
if(url_cur.indexOf(url_1) != -1) { var doPatrol = GM_getValue( "hwm_map_patrol_1" , false);}
if(url_cur.indexOf(url_2) != -1) { var doPatrol = GM_getValue( "hwm_map_patrol_2" , false);}

var ems = document.querySelector("a[href*='plstats_hunters.php?level']");
var pl =  0;
//==================================================================
var curSector = Number(getCurSector() );
var myDelta = getDelta();
var in_move=true;

var eco=document.getElementsByTagName('a');
	for(var i=eco.length-1;i>0;i--)
		{
		if(eco[i].href.indexOf('ecostat.php')>-1)
			{
			in_move=false;
			var d_init = document.createElement( 'div' );
			var dd_init = document.createElement( 'div' );
			var ddh_init = document.createElement( 'div' );
			d_init.id = "hwmMapPatrol_menu";
			dd_init.id = "hwmMapPatrol_directions";
			d_init.style.display = "none";
			dd_init.style.display = "none";
			eco[i].parentNode.appendChild( d_init ) ;
			eco[i].parentNode.appendChild( dd_init ) ;
			eco[i].parentNode.appendChild( ddh_init ) ;
			//®бв ­®ўЄ  ЇаЁ ®е®вҐ
			ddh_init.innerHTML= '<br><label style="cursor: pointer;" for="check_hunt"><input type="checkbox" id="check_hunt"> \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u043f\u0440\u0438 \u043e\u0445\u043e\u0442\u0435</label>'+
			'<br><label style="cursor: pointer;" for="sound_enbl"><input type="checkbox" id="sound_enbl"> \u0417\u0432\u0443\u043a \u043f\u0440\u0438 \u043f\u043e\u043f\u0430\u0434\u0430\u043d\u0438\u0438 \u0432 \u0437\u0430\u0441\u0430\u0434\u0443 \u0432\u043e\u0440\u0430\u002e</label>';
			d_init.innerHTML = '<br><div id="begin_1" style="border:2px solid #999; background-color:#f5f3ea; width:320; cursor: pointer" >'+
			'<table width="300" border="0" cellpadding=5" cellspacing="0" background="none">'+
			'<tr>'+
			'<td style="font-weight:bold; font-size:18px; vertical-align:center" align="center"><b>\u041D\u0430\u0447\u0430\u0442\u044C \u043F\u0430\u0442\u0440\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435</b></td></tr>'+
			'</table>'+
			'</div>';
			dd_init.innerHTML='<br><div id="begin_2" style="border:2px solid #999; background-color:#f5f3ea; width:320" ><b>\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F:</b><span style="vertical-align: top; float: right; cursor: pointer" id="close_menu_panel"><b>X</b></span><br></div>'
			generate_direction();
			document.getElementById('begin_1').addEventListener( "click",function(){d_init.style.display='none';dd_init.style.display='block';} , false );
			document.getElementById('close_menu_panel').addEventListener( "click", function(){d_init.style.display='block';dd_init.style.display='none';} , false );
			document.getElementById('check_hunt').checked = ( GM_getValue( "check_hunt" )  == 1 ) ? 'checked' : '' ;
			document.getElementById('check_hunt').addEventListener( "click", setCheckHunt , false );			
			document.getElementById('sound_enbl').checked = ( GM_getValue( "sound_enbl" )  == 1 ) ? 'checked' : '' ;
			document.getElementById('sound_enbl').addEventListener( "click", setSound_enbl , false );			
			if ((ems != null) && (GM_getValue( "check_hunt" )  == 1)) pl =1;
			break;
			}
	}
init_patrol_button();
checkPatrol();


// ====================================================================================


function planMyPatrol(){	
	var dt = 10000; 			//Math.floor(Math.random() * patrolMaxDelaySec * 1000); // random delay
	if(curSector==sect1){
		setTimeout(function(){ go2loc(sect2); }, dt);
	}else if(curSector==sect2){
		setTimeout(function(){ go2loc(sect1); }, dt);
	}else{ alert("planMyPatrol,  Strange ERROR"); }
}

function checkPatrol(){
	if(doPatrol && curSector!=sect1 && curSector!=sect2){
		doPatrol = false;
		if(url_cur.indexOf(url_1) != -1) {GM_setValue( "hwm_map_patrol_1" , doPatrol );}
		if(url_cur.indexOf(url_2) != -1) {GM_setValue( "hwm_map_patrol_2" , doPatrol );}
		return;
	}
	//
	if(!myDelta && doPatrol){
		planMyPatrol();
	}
	//
	if(doPatrol){
		showPanel();
	}else{
		hidePanel();
	}
	//
}

function menuSetPatrol(e){	// callback for menu command
	doPatrol = !doPatrol;
	var wrong_sector_alert = "\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435!\n\u0427\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u043F\u0430\u0442\u0440\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\n"+sectors[sect1][2]+" <-> "+sectors[sect2][2]+",\n\u043D\u0443\u0436\u043D\u043E \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C\u0441\u044F \u0432 \u043E\u0434\u043D\u043E\u043C \u0438\u0437 \u044D\u0442\u0438\u0445 \u0440\u0430\u0439\u043E\u043D\u043E\u0432";
	//
	if(doPatrol && curSector!=p1 && curSector!=p2){
		alert(wrong_sector_alert);
		doPatrol = false;
	}
	if(url_cur.indexOf(url_1) != -1) {GM_setValue( "hwm_map_patrol_1" , doPatrol );}
	if(url_cur.indexOf(url_2) != -1) {GM_setValue( "hwm_map_patrol_2" , doPatrol );}
	//
	checkPatrol();
	//
}

function go2loc(n){	
	if(!pl)
	window.location.href = url_base + "move_sector.php?id=" + n ;
}
//
function getDelta(){
	var all_scripts = document.getElementsByTagName('script');
	var myDelta = "";
	if(all_scripts.length && all_scripts[0].innerHTML.indexOf("Delta=")!=-1 ){
		myDelta = all_scripts[0].innerHTML.split("\n")[1].replace(/.*Delta=(\d+).*/, "$1");
	}
	return myDelta;
}
//
function getCurSector(){
	var sect = "0";
	var ems = document.querySelector("object > param[value*='map.swf']");
	if ( ems ) {   // Flash
		ems = ems.parentNode.querySelector("param[name='FlashVars']");
		el = ems.getAttribute('value');
		sect = el.split('=')[1].split(':')[0] ;
		if (sect.indexOf('*') != -1) { var tt = sect.split('*'); sect = tt[tt.length-1];}
	} else {       // HTML5
		ems = document.querySelectorAll("script");
		for (var k = 0; k < ems.length; k++) {
			if (ems[k].text.indexOf("show_map") != -1) {
				var s = ems[k].text.split(",");
				if (s.length > 7) {
				        s = s[5].split("*");
				        s = s[s.length-1].replace(/[\"\s]/g, '').split(":");
					if (s.length > 1) sect = s[0];
				}
			}
		}
	}
//console.warn(sect);
	return sect;
}
//
function showPanel(){
	//alert("showPanel");
	var cancelLink = '<a href="javascript:void(0);" id="mapPatrol_cancel" style="color:#c33; font-size:14;">\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C</a>';
	var panelText = "\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435!<br>\u0418\u0434\u0435\u0442 \u043F\u0430\u0442\u0440\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435<br>"+sectors[sect1][2]+" <-> "+sectors[sect2][2]+"<br>"+cancelLink;
	//
	var d = document.createElement( 'div' );
	d.id = "hwmMapPatrol_div";
	d.style.display = "block";
	d.innerHTML = '<div style="border:2px solid #999; background-color:#f5f3ea; width:320; height:100; '+
	'position:absolute; top:250px; left:200px;" >'+
	'<table width="300" border="0" cellpadding=5" cellspacing="0" background="none">'+
	'<tr><td><img src="i/forum/14_1.png" border=0 width=50 height=50 alt=""></td>'+
	'<td style="font-weight:bold; font-size:14;" align="center">'+panelText+'</td></tr>'+
	'</table>'+
	'</div>';
	
	document.body.appendChild( d ) ;
	
	document.getElementById('mapPatrol_cancel').addEventListener( "click", clickMapPatrolCancel , false );
	//	
}

function init_patrol_button(){
if(!doPatrol&&!in_move)
	{
		d_init.style.display = "block";
		dd_init.style.display = "none";
		
	} else if(!in_move){
		d_init.style.display = "none";
		dd_init.style.display = "none";
	}
}

function generate_direction(){
var sect;
d_init.style.display = "none";
dd_init.style.display = "block";
for(var t=0;t<available_directions[curSector].length;t++){
	var dd = document.createElement( 'div' );
		dd.id = "direct_"+t;
		dd.setAttribute("style","border:2px solid #999; background-color:#e5e3da; width:300; margin: 4px; padding: 2px; cursor: pointer; text-align: left");
		sect = available_directions[curSector][t];
		if ((sect == 2) || (sect == 6) || (sect == 16) || (sect == 21)) {
			dd.innerHTML='<b>'+sectors[curSector][2]+'&nbsp <->&nbsp;'+'<font style="color:#EE0000;">'+sectors[available_directions[curSector][t]][2]+'</font></b>';
		} else {
			dd.innerHTML='<b>'+sectors[curSector][2]+'&nbsp <->&nbsp;'+'<font style="color:#0070FF;">'+sectors[available_directions[curSector][t]][2]+'</font></b>';
		}
		dd.addEventListener('click',function(){begin_patrol(this.id)},false);
		document.getElementById('begin_2').appendChild( dd ) ;
	}
}

function begin_patrol(m){
d_init.innerHTML='';
if(url_cur.indexOf(url_1) != -1) {GM_setValue("sector1_1" , available_directions[curSector][m.split('_')[1]]);}
if(url_cur.indexOf(url_2) != -1) {GM_setValue("sector1_2" , available_directions[curSector][m.split('_')[1]]);}
if(url_cur.indexOf(url_1) != -1) {GM_setValue("sector2_1" , curSector);}
if(url_cur.indexOf(url_2) != -1) {GM_setValue("sector2_2" , curSector);}
if(url_cur.indexOf(url_1) != -1) {GM_setValue("hwm_map_patrol_1" , true);}
if(url_cur.indexOf(url_2) != -1) {GM_setValue("hwm_map_patrol_2" , true);}
checkPatrol();
location.href=location.href;
}

function hidePanel(){
	var d = document.getElementById('hwmMapPatrol_div');
	if(d){
		d.style.display = "none";
		document.body.removeChild( d ) ;
	}
}

function clickMapPatrolCancel(){
	doPatrol = false;
	if(url_cur.indexOf(url_1) != -1) {GM_setValue("sector1_1" , 0);}
	if(url_cur.indexOf(url_2) != -1) {GM_setValue("sector1_2" , 0);}
	if(url_cur.indexOf(url_1) != -1) {GM_setValue("sector2_1" , 0);}
	if(url_cur.indexOf(url_2) != -1) {GM_setValue("sector2_2" , 0);}
	if(url_cur.indexOf(url_1) != -1) {GM_setValue("hwm_map_patrol_1" , doPatrol);}
	if(url_cur.indexOf(url_2) != -1) {GM_setValue("hwm_map_patrol_2" , doPatrol);}
	hidePanel();
	checkPatrol();
	location.href=location.href;
}

function setCheckHunt(){
pl=0;
if( GM_getValue( "check_hunt" ) == 1 )
	{
	GM_setValue( "check_hunt" , 0 );
	} else
	{
	GM_setValue( "check_hunt" , 1 );
	if ((ems != null) && (GM_getValue( "check_hunt" )  == 1)) pl = 1;
	}
}                                                                                                               
// ========================================================
function setSound_enbl(){
	if( GM_getValue( "sound_enbl" ) == 1 )	{
		GM_setValue( "sound_enbl" , 0 );
	} else  {
		GM_setValue( "sound_enbl" , 1 );
	}
}                                                                                                               
// ========================================================

})();