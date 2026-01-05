// ==UserScript==

// @name         Stickers FF Experts
// @version      0.1.7
// @description  Ajoute des Stickers FF
// @author       DieuAbsolu
// @match        http://www.jeuxvideo.com/forums/*
// @match        http://m.jeuxvideo.com/forums/*
// @match        http://jvforum.fr/*
// @require https://greasyfork.org/scripts/24514-fctpresentation/code/fctpresentation.js
// @require https://greasyfork.org/scripts/24448-bddplayer/code/bddplayer.js
// @require https://greasyfork.org/scripts/24450-bddteam/code/bddteam.js
// @require https://greasyfork.org/scripts/24460-bddstade/code/bddstade.js
// @require https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/simplemodal/jquery.simplemodal-1.4.4.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @grant	 none
// @namespace https://greasyfork.org/users/76701
// @downloadURL https://update.greasyfork.org/scripts/24456/Stickers%20FF%20Experts.user.js
// @updateURL https://update.greasyfork.org/scripts/24456/Stickers%20FF%20Experts.meta.js
// ==/UserScript==


var fond01 = "http://image.noelshack.com/fichiers/2016/44/1477968383-fond01.jpg"

var isChrome = !!window.chrome && !!window.chrome.webstore;

if(isChrome){
	var bGreasemonkeyServiceDefined     = false;

try {
    if (typeof Components.interfaces.gmIGreasemonkeyService === "object") {
        bGreasemonkeyServiceDefined = true;
    }
}
catch (err) {
    //Ignore.
}

if ( typeof unsafeWindow === "undefined"  ||  ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
}
}


unsafeWindow.add_txt = function(src){

	document.getElementById("message_topic").value += " "+src+" ";

};

unsafeWindow.add_affiche = function(){

	league_value = document.getElementById("leaguelist").options[document.getElementById('leaguelist').selectedIndex].value;
	hometeam_value = document.getElementById("hometeamlist").options[document.getElementById('hometeamlist').selectedIndex].value;
	awayteam_value = document.getElementById("awayteamlist").options[document.getElementById('awayteamlist').selectedIndex].value;
	tv_value = document.getElementById("tvlist").options[document.getElementById('tvlist').selectedIndex].value;
	officeer = document.getElementById("inputofficeer").value;
	matchtime = document.getElementById("inputtime").value;
	titrematchresume = document.getElementById("titremespre").value;
	matchresume = document.getElementById("mespre").value;
	addimgteam_value = document.getElementById("addimgteam").checked;
	playerhomerole_01_value = document.getElementById("playerhomerolelist_01").options[document.getElementById('playerhomerolelist_01').selectedIndex].value;
	playerhomerole_02_value = document.getElementById("playerhomerolelist_02").options[document.getElementById('playerhomerolelist_02').selectedIndex].value;
	playerhomerole_03_value = document.getElementById("playerhomerolelist_03").options[document.getElementById('playerhomerolelist_03').selectedIndex].value;
	playerhomerole_04_value = document.getElementById("playerhomerolelist_04").options[document.getElementById('playerhomerolelist_04').selectedIndex].value;
	playerhomerole_05_value = document.getElementById("playerhomerolelist_05").options[document.getElementById('playerhomerolelist_05').selectedIndex].value;
	playerhomerole_06_value = document.getElementById("playerhomerolelist_06").options[document.getElementById('playerhomerolelist_06').selectedIndex].value;
	playerhomerole_07_value = document.getElementById("playerhomerolelist_07").options[document.getElementById('playerhomerolelist_07').selectedIndex].value;
	playerhomerole_08_value = document.getElementById("playerhomerolelist_08").options[document.getElementById('playerhomerolelist_08').selectedIndex].value;
	playerhomerole_09_value = document.getElementById("playerhomerolelist_09").options[document.getElementById('playerhomerolelist_09').selectedIndex].value;
	playerhomerole_10_value = document.getElementById("playerhomerolelist_10").options[document.getElementById('playerhomerolelist_10').selectedIndex].value;
	playerhomerole_11_value = document.getElementById("playerhomerolelist_11").options[document.getElementById('playerhomerolelist_11').selectedIndex].value;
	playerhome_01_value = document.getElementById("playerhomelist_01").options[document.getElementById('playerhomelist_01').selectedIndex].text;
	playerhome_02_value = document.getElementById("playerhomelist_02").options[document.getElementById('playerhomelist_02').selectedIndex].text;
	playerhome_03_value = document.getElementById("playerhomelist_03").options[document.getElementById('playerhomelist_03').selectedIndex].text;
	playerhome_04_value = document.getElementById("playerhomelist_04").options[document.getElementById('playerhomelist_04').selectedIndex].text;
	playerhome_05_value = document.getElementById("playerhomelist_05").options[document.getElementById('playerhomelist_05').selectedIndex].text;
	playerhome_06_value = document.getElementById("playerhomelist_06").options[document.getElementById('playerhomelist_06').selectedIndex].text;
	playerhome_07_value = document.getElementById("playerhomelist_07").options[document.getElementById('playerhomelist_07').selectedIndex].text;
	playerhome_08_value = document.getElementById("playerhomelist_08").options[document.getElementById('playerhomelist_08').selectedIndex].text;
	playerhome_09_value = document.getElementById("playerhomelist_09").options[document.getElementById('playerhomelist_09').selectedIndex].text;
	playerhome_10_value = document.getElementById("playerhomelist_10").options[document.getElementById('playerhomelist_10').selectedIndex].text;
	playerhome_11_value = document.getElementById("playerhomelist_11").options[document.getElementById('playerhomelist_11').selectedIndex].text;
	playerhomecode_01_value = document.getElementById("playerhomelist_01").options[document.getElementById('playerhomelist_01').selectedIndex].value;
	playerhomecode_02_value = document.getElementById("playerhomelist_02").options[document.getElementById('playerhomelist_02').selectedIndex].value;
	playerhomecode_03_value = document.getElementById("playerhomelist_03").options[document.getElementById('playerhomelist_03').selectedIndex].value;
	playerhomecode_04_value = document.getElementById("playerhomelist_04").options[document.getElementById('playerhomelist_04').selectedIndex].value;
	playerhomecode_05_value = document.getElementById("playerhomelist_05").options[document.getElementById('playerhomelist_05').selectedIndex].value;
	playerhomecode_06_value = document.getElementById("playerhomelist_06").options[document.getElementById('playerhomelist_06').selectedIndex].value;
	playerhomecode_07_value = document.getElementById("playerhomelist_07").options[document.getElementById('playerhomelist_07').selectedIndex].value;
	playerhomecode_08_value = document.getElementById("playerhomelist_08").options[document.getElementById('playerhomelist_08').selectedIndex].value;
	playerhomecode_09_value = document.getElementById("playerhomelist_09").options[document.getElementById('playerhomelist_09').selectedIndex].value;
	playerhomecode_10_value = document.getElementById("playerhomelist_10").options[document.getElementById('playerhomelist_10').selectedIndex].value;
	playerhomecode_11_value = document.getElementById("playerhomelist_11").options[document.getElementById('playerhomelist_11').selectedIndex].value;

	playerawayrole_01_value = document.getElementById("playerawayrolelist_01").options[document.getElementById('playerawayrolelist_01').selectedIndex].value;
	playerawayrole_02_value = document.getElementById("playerawayrolelist_02").options[document.getElementById('playerawayrolelist_02').selectedIndex].value;
	playerawayrole_03_value = document.getElementById("playerawayrolelist_03").options[document.getElementById('playerawayrolelist_03').selectedIndex].value;
	playerawayrole_04_value = document.getElementById("playerawayrolelist_04").options[document.getElementById('playerawayrolelist_04').selectedIndex].value;
	playerawayrole_05_value = document.getElementById("playerawayrolelist_05").options[document.getElementById('playerawayrolelist_05').selectedIndex].value;
	playerawayrole_06_value = document.getElementById("playerawayrolelist_06").options[document.getElementById('playerawayrolelist_06').selectedIndex].value;
	playerawayrole_07_value = document.getElementById("playerawayrolelist_07").options[document.getElementById('playerawayrolelist_07').selectedIndex].value;
	playerawayrole_08_value = document.getElementById("playerawayrolelist_08").options[document.getElementById('playerawayrolelist_08').selectedIndex].value;
	playerawayrole_09_value = document.getElementById("playerawayrolelist_09").options[document.getElementById('playerawayrolelist_09').selectedIndex].value;
	playerawayrole_10_value = document.getElementById("playerawayrolelist_10").options[document.getElementById('playerawayrolelist_10').selectedIndex].value;
	playerawayrole_11_value = document.getElementById("playerawayrolelist_11").options[document.getElementById('playerawayrolelist_11').selectedIndex].value;
	playeraway_01_value = document.getElementById("playerawaylist_01").options[document.getElementById('playerawaylist_01').selectedIndex].text;
	playeraway_02_value = document.getElementById("playerawaylist_02").options[document.getElementById('playerawaylist_02').selectedIndex].text;
	playeraway_03_value = document.getElementById("playerawaylist_03").options[document.getElementById('playerawaylist_03').selectedIndex].text;
	playeraway_04_value = document.getElementById("playerawaylist_04").options[document.getElementById('playerawaylist_04').selectedIndex].text;
	playeraway_05_value = document.getElementById("playerawaylist_05").options[document.getElementById('playerawaylist_05').selectedIndex].text;
	playeraway_06_value = document.getElementById("playerawaylist_06").options[document.getElementById('playerawaylist_06').selectedIndex].text;
	playeraway_07_value = document.getElementById("playerawaylist_07").options[document.getElementById('playerawaylist_07').selectedIndex].text;
	playeraway_08_value = document.getElementById("playerawaylist_08").options[document.getElementById('playerawaylist_08').selectedIndex].text;
	playeraway_09_value = document.getElementById("playerawaylist_09").options[document.getElementById('playerawaylist_09').selectedIndex].text;
	playeraway_10_value = document.getElementById("playerawaylist_10").options[document.getElementById('playerawaylist_10').selectedIndex].text;
	playeraway_11_value = document.getElementById("playerawaylist_11").options[document.getElementById('playerawaylist_11').selectedIndex].text;
	playerawaycode_01_value = document.getElementById("playerawaylist_01").options[document.getElementById('playerawaylist_01').selectedIndex].value;
	playerawaycode_02_value = document.getElementById("playerawaylist_02").options[document.getElementById('playerawaylist_02').selectedIndex].value;
	playerawaycode_03_value = document.getElementById("playerawaylist_03").options[document.getElementById('playerawaylist_03').selectedIndex].value;
	playerawaycode_04_value = document.getElementById("playerawaylist_04").options[document.getElementById('playerawaylist_04').selectedIndex].value;
	playerawaycode_05_value = document.getElementById("playerawaylist_05").options[document.getElementById('playerawaylist_05').selectedIndex].value;
	playerawaycode_06_value = document.getElementById("playerawaylist_06").options[document.getElementById('playerawaylist_06').selectedIndex].value;
	playerawaycode_07_value = document.getElementById("playerawaylist_07").options[document.getElementById('playerawaylist_07').selectedIndex].value;
	playerawaycode_08_value = document.getElementById("playerawaylist_08").options[document.getElementById('playerawaylist_08').selectedIndex].value;
	playerawaycode_09_value = document.getElementById("playerawaylist_09").options[document.getElementById('playerawaylist_09').selectedIndex].value;
	playerawaycode_10_value = document.getElementById("playerawaylist_10").options[document.getElementById('playerawaylist_10').selectedIndex].value;
	playerawaycode_11_value = document.getElementById("playerawaylist_11").options[document.getElementById('playerawaylist_11').selectedIndex].value;
	
	for (var i = 0; i < tbl_league.length; i++) {
	var resultleague = tbl_league[i]['league_code'].indexOf(league_value);
if(resultleague > -1){
	src = tbl_league[i]['league_img'];
	document.getElementById("message_topic").value += " "+src+"\n\n ";
}};

	for (var i = 0; i < tbl_team.length; i++) {
	var resulthome = tbl_team[i]['team_code'].indexOf(hometeam_value);
if(resulthome > -1){
	src = tbl_team[i]['team_img'];
	document.getElementById("message_topic").value += " "+src+" '''V.''' ";
}};

	for (var i = 0; i < tbl_team.length; i++) {
	var resultaway = tbl_team[i]['team_code'].indexOf(awayteam_value);
if(resultaway > -1){
	src = tbl_team[i]['team_img'];
	document.getElementById("message_topic").value += " "+src+" '''au''' ";
}};

	for (var i = 0; i < tbl_team.length; i++) {
	var resultaway = tbl_team[i]['team_code'].indexOf(hometeam_value);
if(resultaway > -1){
	src = tbl_team[i]['stade_img'];
	document.getElementById("message_topic").value += " "+src+"\n\n ";
}};

	src5 = tbl_tv[tv_value]['tv_img'];
	document.getElementById("message_topic").value += "http://image.noelshack.com/fichiers/2016/43/1477390994-ico-tv.png "+src5+" '''à ''' "+matchtime+"\n\n";

	for (var i = 0; i < tbl_team.length; i++) {
	var resulthomeshirt = tbl_team[i]['team_code'].indexOf(hometeam_value);
if(resulthomeshirt > -1){
	src = tbl_team[i]['shirt1_img'];
	document.getElementById("message_topic").value += " "+src+" '''COMPOSITION :''' "+playerhome_01_value+", "+playerhome_02_value+", "+playerhome_03_value+", "+playerhome_04_value+", "+playerhome_05_value+", "+playerhome_06_value+", "+playerhome_07_value+", "+playerhome_08_value+", "+playerhome_09_value+", "+playerhome_10_value+", "+playerhome_11_value+" \n\n ";
}};

	for (var i = 0; i < tbl_team.length; i++) {
	var resultawayshirt = tbl_team[i]['team_code'].indexOf(awayteam_value);
if(resultawayshirt > -1){
	src = tbl_team[i]['shirt2_img'];
	document.getElementById("message_topic").value += " "+src+" '''COMPOSITION :''' "+playeraway_01_value+", "+playeraway_02_value+", "+playeraway_03_value+", "+playeraway_04_value+", "+playeraway_05_value+", "+playeraway_06_value+", "+playeraway_07_value+", "+playeraway_08_value+", "+playeraway_09_value+", "+playeraway_10_value+", "+playeraway_11_value+" \n\n ";
}};

  // affectation des joueurs du club home
if(document.getElementById("addimgteam").checked == true){

	src_01 = tbl_role[playerhomerole_01_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_01+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_01_value);
if(resultplayer > -1){
	src_01 = tbl_player[i]['player_img'];
    if(src_01=="")
        src_01 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_01+" \n ";
}};
	src = tbl_role[playerhomerole_02_value]['role_img'];
	document.getElementById("message_topic").value += " "+src+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_02_value);
if(resultplayer > -1){
	src_02 = tbl_player[i]['player_img'];
   if(src_02=="")
        src_02 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_02+" \n ";
}};
	src_03 = tbl_role[playerhomerole_03_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_03+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_03_value);
if(resultplayer > -1){
	src_03 = tbl_player[i]['player_img'];
   if(src_03=="")
        src_03 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_03+" \n ";
}};
	src_04 = tbl_role[playerhomerole_04_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_04+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_04_value);
if(resultplayer > -1){
	src_04 = tbl_player[i]['player_img'];
   if(src_04=="")
        src_04 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_04+" \n ";
}};
	src_05 = tbl_role[playerhomerole_05_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_05+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_05_value);
if(resultplayer > -1){
	src_05 = tbl_player[i]['player_img'];
   if(src_05=="")
        src_05 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_05+" \n ";
}};
	src_06 = tbl_role[playerhomerole_06_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_06+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_06_value);
if(resultplayer > -1){
	src_06 = tbl_player[i]['player_img'];
   if(src_06=="")
        src_06 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_06+" \n ";
}};
	src_07 = tbl_role[playerhomerole_07_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_07+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_07_value);
if(resultplayer > -1){
	src_07 = tbl_player[i]['player_img'];
   if(src_07=="")
        src_07 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_07+" \n ";
}};
	src_08 = tbl_role[playerhomerole_08_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_08+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_08_value);
if(resultplayer > -1){
	src_08 = tbl_player[i]['player_img'];
   if(src_08=="")
        src_08 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_08+" \n ";
}};
	src_09 = tbl_role[playerhomerole_09_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_09+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_09_value);
if(resultplayer > -1){
	src_09 = tbl_player[i]['player_img'];
   if(src_09=="")
        src_09 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_09+" \n ";
}};
	src_10 = tbl_role[playerhomerole_10_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_10+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_10_value);
if(resultplayer > -1){
	src_10 = tbl_player[i]['player_img'];
   if(src_10=="")
        src_10 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_10+" \n ";
}};
	src_11 = tbl_role[playerhomerole_11_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_11+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerhomecode_11_value);
if(resultplayer > -1){
	src_11 = tbl_player[i]['player_img'];
   if(src_11=="")
        src_11 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_11+" \n\n ";
}};

  // affectation des joueurs du club away
	src_01 = tbl_role[playerawayrole_01_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_01+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_01_value);
if(resultplayer > -1){
	src_01 = tbl_player[i]['player_img'];
   if(src_01=="")
        src_01 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_01+" \n ";
}};
	src = tbl_role[playerawayrole_02_value]['role_img'];
	document.getElementById("message_topic").value += " "+src+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_02_value);
if(resultplayer > -1){
	src_02 = tbl_player[i]['player_img'];
   if(src_02=="")
        src_02 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_02+" \n ";
}};
	src_03 = tbl_role[playerawayrole_03_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_03+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_03_value);
if(resultplayer > -1){
	src_03 = tbl_player[i]['player_img'];
   if(src_03=="")
        src_03 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_03+" \n ";
}};
	src_04 = tbl_role[playerawayrole_04_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_04+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_04_value);
if(resultplayer > -1){
	src_04 = tbl_player[i]['player_img'];
   if(src_04=="")
        src_04 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_04+" \n ";
}};
	src_05 = tbl_role[playerawayrole_05_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_05+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_05_value);
if(resultplayer > -1){
	src_05 = tbl_player[i]['player_img'];
   if(src_05=="")
        src_05 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_05+" \n ";
}};
	src_06 = tbl_role[playerawayrole_06_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_06+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_06_value);
if(resultplayer > -1){
	src_06 = tbl_player[i]['player_img'];
   if(src_06=="")
        src_06 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_06+" \n ";
}};
	src_07 = tbl_role[playerawayrole_07_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_07+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_07_value);
if(resultplayer > -1){
	src_07 = tbl_player[i]['player_img'];
   if(src_07=="")
        src_07 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_07+" \n ";
}};
	src_08 = tbl_role[playerawayrole_08_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_08+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_08_value);
if(resultplayer > -1){
	src_08 = tbl_player[i]['player_img'];
   if(src_08=="")
        src_08 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_08+" \n ";
}};
	src_09 = tbl_role[playerawayrole_09_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_09+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_09_value);
if(resultplayer > -1){
	src_09 = tbl_player[i]['player_img'];
   if(src_09=="")
        src_09 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_09+" \n ";
}};
	src_10 = tbl_role[playerawayrole_10_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_10+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_10_value);
if(resultplayer > -1){
	src_10 = tbl_player[i]['player_img'];
   if(src_10=="")
        src_10 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_10+" \n ";
}};
	src_11 = tbl_role[playerawayrole_11_value]['role_img'];
	document.getElementById("message_topic").value += " "+src_11+" ";

	for (var i = 0; i < tbl_player.length; i++) {
	var resultplayer = tbl_player[i]['player_code'].indexOf(playerawaycode_11_value);
if(resultplayer > -1){
	src_11 = tbl_player[i]['player_img'];
   if(src_11=="")
        src_11 = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src_11+" \n\n ";
}};

}

	document.getElementById("message_topic").value += "http://image.noelshack.com/fichiers/2016/43/1477395783-ico-tactique.png '''LES ENTRAINEURS :'''\n\n ";

	for (var i = 0; i < tbl_team.length; i++) {
	var resultcoachhome = tbl_team[i]['team_code'].indexOf(hometeam_value);
if(resultcoachhome > -1){
	src = tbl_team[i]['coach_img'];
   if(src=="")
        src = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src+"  '''V.''' ";
}};

	for (var i = 0; i < tbl_team.length; i++) {
	var resultcoachaway = tbl_team[i]['team_code'].indexOf(awayteam_value);
if(resultcoachaway > -1){
	src = tbl_team[i]['coach_img'];
   if(src=="")
        src = "http://image.noelshack.com/fichiers/2016/44/1478039066--.png";
	document.getElementById("message_topic").value += " "+src+"\n\n '''"+titrematchresume+"''' \n "+matchresume+"\n\n ";
}};

	document.getElementById("message_topic").value += " '''HOME TOP PLAYER :'''\n\n http://image.noelshack.com/fichiers/2016/43/1477392397-ico-arbitre.png arbitré par '''"+officeer+"''' \n\n '''BON MATCH !!!'''";

};


searchsticker  = [
	{"player_name": "Eric Cantona", "player_img": "http://image.noelshack.com/fichiers/2016/40/1475848010-ericcantona01.png"}, 
	{"player_name": "Edinson Cavani", "player_img": "http://image.noelshack.com/fichiers/2016/42/1477249739-cavani03.png"}, 
	{"player_name": "Kucka", "player_img": "http://image.noelshack.com/fichiers/2016/42/1477172903-kucka01.png"}, 
	{"player_name": "Edinson Cavani", "player_img": "http://image.noelshack.com/fichiers/2016/42/1477249739-cavani03.png"}, 
	{"player_name": "Mbaye Niang", "player_img": "http://image.noelshack.com/fichiers/2016/42/1477160503-mbayeniang01.png"}
];



var tbl_league = [
	{"league_code": "LC_01", "league_nom": "Bundesliga", "league_img": "http://image.noelshack.com/fichiers/2016/43/1477379148-logo-allemagne-bundesliga.png"},
	{"league_code": "LC_02", "league_nom": "LaLiga", "league_img": "http://image.noelshack.com/fichiers/2016/43/1477379163-logo-espagne-laliga.png"},
	{"league_code": "LC_03", "league_nom": "Liga Nos", "league_img": "http://image.noelshack.com/fichiers/2016/43/1477379194-logo-portugal-liganos.png"},
	{"league_code": "LC_04", "league_nom": "Ligue 1", "league_img": "http://image.noelshack.com/fichiers/2016/43/1477379158-logo-france-ligue1.png"},
	{"league_code": "LC_05", "league_nom": "Premier League", "league_img": "http://image.noelshack.com/fichiers/2016/43/1477379407-logo-grandebretagne-premierleague.png"},
	{"league_code": "LC_06", "league_nom": "Serie A", "league_img": "http://image.noelshack.com/fichiers/2016/43/1477379185-logo-italie-seriea.png"}
];

var tbl_tv = [
	{"tv_code": "--Non renseigné--", "tv_img": ""},
	{"tv_code": "Bein Sports", "tv_img": "http://image.noelshack.com/fichiers/2016/43/1477395017-logo-tv-beinsports.png"},
	{"tv_code": "Canal+", "tv_img": "http://image.noelshack.com/fichiers/2016/43/1477395021-logo-tv-canalplus.png"},
	{"tv_code": "SFR Sport", "tv_img": "http://image.noelshack.com/fichiers/2016/43/1477395026-logo-tv-sfrsport.png"}
];

var tbl_role = [
	{"role_code": "G", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389774-ico-position-g.png"},
	{"role_code": "D", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389729-ico-position-d.png"},
	{"role_code": "DC", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389735-ico-position-dc.png"},
	{"role_code": "LD", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389778-ico-position-ld.png"},
	{"role_code": "LG", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389787-ico-position-lg.png"},
	{"role_code": "MD", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389854-ico-position-md.png"},
	{"role_code": "TQ", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389870-ico-position-tq.png"},
	{"role_code": "M", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389791-ico-position-m.png"},
	{"role_code": "MR", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389862-ico-position-mr.png"},
	{"role_code": "MO", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389858-ico-position-mo.png"},
	{"role_code": "AD", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389720-ico-position-ad.png"},
	{"role_code": "AG", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389724-ico-position-ag.png"},
	{"role_code": "A", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389712-ico-position-a.png"},
	{"role_code": "R", "role_img": "http://image.noelshack.com/fichiers/2016/43/1477389866-ico-position-r.png"}
];

var tbl_formation  = [
	{"formation_code": "001", "formation_name": "3-2-2-3"},
	{"formation_code": "002", "formation_name": "3-2-3-2"},
	{"formation_code": "003", "formation_name": "3-3-3-1"},
	{"formation_code": "004", "formation_name": "3-4-1-2"},
	{"formation_code": "005", "formation_name": "3-4-2-1"},
	{"formation_code": "006", "formation_name": "3-4-3"},
	{"formation_code": "007", "formation_name": "3-5-1-1"},
	{"formation_code": "008", "formation_name": "3-5-2"},
	{"formation_code": "009", "formation_name": "4-1-2-3"},
	{"formation_code": "010", "formation_name": "4-1-3-2"},
	{"formation_code": "011", "formation_name": "4-1-4-1"},
	{"formation_code": "012", "formation_name": "4-2-1-3"},
	{"formation_code": "013", "formation_name": "4-2-2-2"},
	{"formation_code": "014", "formation_name": "4-2-3-1"},
	{"formation_code": "015", "formation_name": "4-3-1-2"}, 
	{"formation_code": "016", "formation_name": "4-3-2-1"}, 
	{"formation_code": "017", "formation_name": "4-3-3"},
	{"formation_code": "018", "formation_name": "4-4-1-1"},
	{"formation_code": "019", "formation_name": "4-4-2 à plat"},
	{"formation_code": "020", "formation_name": "4-4-2 diamant"},
	{"formation_code": "021", "formation_name": "4-5-1"},
	{"formation_code": "022", "formation_name": "5-3-2"},
	{"formation_code": "023", "formation_name": "5-4-1"}
];



var tbl_mosaique  = [
	{"mos_code": "001", "format": "Non"},
	{"mos_code": "002", "format": "Format 2x8"},
	{"mos_code": "003", "format": "Format 4x8"},
	{"mos_code": "004", "format": "Format 6x8"},
	{"mos_code": "005", "format": "Format 8x8"}
];




(function() {

    
    var maj = "(Dernière MàJ 25/10/16)";


	var ctn = "";

    addStickers("http://image.noelshack.com/fichiers/2016/42/1477160503-mbayeniang01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477239199-mbayeniang02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477172903-kucka01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477167547-bonaventura02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477165286-mattiadesciglio02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477164131-donnarumma01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477170496-manuellocatelli01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477173527-romagnoli02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477175843-andreapoli01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477176245-carlosbacca02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477166497-suso02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477171192-abate01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477267927-abate02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477267225-abate03.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477171994-gabrielpaletta02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477179291-gabrielpaletta03.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477244570-honda02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477174053-lapadula03.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477175299-gomez01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477182020-luizadriano06.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477245441-luizadriano08.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477263838-luizadriano09.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477262411-luizadriano10.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477247774-luizadriano11.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477246840-luizadriano12.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477264881-zapata01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477265612-zapata02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477250794-zapata03.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477240229-zapata05.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477254017-calabria02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477339702-calabria03.png");
    addStickers("http://image.noelshack.com/fichiers/2016/43/1477266152-vangioni01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/40/1475527396-monto-sad.png");
    addStickers("http://image.noelshack.com/fichiers/2016/40/1475845498-georgeweah1.png");
    addStickers("http://image.noelshack.com/fichiers/2016/40/1475527423-balo-rire.png");
    addStickers("http://image.noelshack.com/fichiers/2016/40/1475848010-ericcantona01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477177805-ericcantona02.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477244693-ericcantona03.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477177867-ericcantona05.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477176381-milanissou01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477177642-andreapoli02.png");

    addStickers("http://image.noelshack.com/fichiers/2016/42/1477249739-cavani03.png");

    addStickers("http://image.noelshack.com/fichiers/2016/42/1477251637-emery01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477252933-emery03.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477236218-montella01.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477232231-montella02.png");

    addStickers("http://image.noelshack.com/fichiers/2016/35/1472571618-nabil-djellit-generateur-de-rumeurs.png");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477178335-riolo01.jpg");
    addStickers("http://image.noelshack.com/fichiers/2016/42/1477229232-yohannriou01.jpg");

	insert('<div class="f-tab-ffs" style="width: 100%; height: 62px; line-height: 62px; font-size: 14px; data-flg-tt=""></div> <div class="f-tab-ffs2" style="width: 100%; height: 31px; line-height: 31px; font-size: 14px; data-flg-tt2=""></div> <div class="f-tab-ffs3" style="width: 100%; height: 31px; line-height: 31px; font-size: 14px; data-flg-tt2=""></div><form name="fff" id="auto-suggest"><input type="text" class="search" id="search" name="search" placeholder="Rechercher..." autocomplete="off" onkeypress="refuserToucheEntree(event);"/><input type="button" name="envoiRecherche" class="search" style="width: 25px" onClick="addsearch()"/></form><ul class="suggestions"></ul><div style="widht: 100%" height: 22.5px" id="boutons"><input type="button" class="simplemodal-open" name="presentation" value="AJOUTER UNE PRESENTATION" onClick="simplemodal-open" onMouseover= "" onMouseout= "" style="background-color: #7BA1D3; background-repeat: repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-size: auto auto; border-color: #618ECA; border: 1px solid; color: #FFFFFF; border-radius: 2px; padding-top: 5px; padding-right: 15px; padding-bottom: 5px; padding-left: 15px; font-size: 10px; line-height: 1em; text-transform: uppercase"></div></form> <div class="f-cont" style="widht: 100%; display: block; background-color: white; border: 1px solid #BEBECC; height: 110px; overflow-y: auto; position: relative;">'+ctn+'<br></div> <div id="simplemodal-container" class="simplemodal-container" style=" position: fixed; z-index: 1002; height: 300px; width: 355px; left: 654px; top: 187px; display: none"><a title="Close" class="modalCloseImg"/><div tabindex="-1" class="simplemodal-wrap" style="height: 100%; outline-color: -moz-use-text-color; outline-style: none; outline-width: 0px; width: 100%;"> <div style="" id="sample" class="simplemodal-data"><h2>Formulaire de présentation de match</h2> <div id="liste"> <div><p>Choisissez le championnat ou la coupe :<select id="leaguelist"></select></p></div> <div><p>Team Home :<select id="hometeamlist"></select></p></div> <div style="height:20px; font-size: 10px"><p>Formation :<select id="formationlisthome"></select></p></div> <div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_01"></select><select id="playerhomelist_01"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_02"></select><select id="playerhomelist_02"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_03"></select><select id="playerhomelist_03"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_04"></select><select id="playerhomelist_04"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_05"></select><select id="playerhomelist_05"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_06"></select><select id="playerhomelist_06"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_07"></select><select id="playerhomelist_07"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_08"></select><select id="playerhomelist_08"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_09"></select><select id="playerhomelist_09"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_10"></select><select id="playerhomelist_10"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerhomerolelist_11"></select><select id="playerhomelist_11"></select></p></div><br> <div><p>Team Away :<select id="awayteamlist"></select></p></div> <div style="height:20px; font-size: 10px"><p>Formation :<select id="formationlistaway"></select></p></div> <div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_01"></select><select id="playerawaylist_01"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_02"></select><select id="playerawaylist_02"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_03"></select><select id="playerawaylist_03"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_04"></select><select id="playerawaylist_04"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_05"></select><select id="playerawaylist_05"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_06"></select><select id="playerawaylist_06"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_07"></select><select id="playerawaylist_07"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_08"></select><select id="playerawaylist_08"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_09"></select><select id="playerawaylist_09"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_10"></select><select id="playerawaylist_10"></select></p></div><div style="height: 20px; font-size: 10px"><p><select id="playerawayrolelist_11"></select><select id="playerawaylist_11"></select></p></div></div><br> <div><p>Ajouter les photos <input type="checkbox" id="addimgteam">   Ajouter les postes <input type="checkbox" id="addimgrole"></p></div> <div><p>Home Top Player :<select id="hometopplayerlist"></select></p></div><div><p>Away Top Player :<select id="awaytopplayerlist"></select></p></div><div><p>Retransmission TV sur :<select id="tvlist"></select>Horaire :<input type="text" id="inputtime" VALUE=""></p></div><div><p>Match arbitré par :<input type="text" id="inputofficeer" VALUE=""></p></div> <div><p>Ajouter une mosaïque :<select id="addmosaique" ></select></p></div> <div id="blockmosaik" style="height: 20px; font-size: 10px"><p>Rangée n°1 :<input type="text" id="inputrow1_1" VALUE=""><input type="text" id="inputrow1_2" VALUE=""></p></div> <div style="height: 20px; font-size: 10px"><p>Rangée n°2 :<input type="text" id="inputrow2_1" VALUE=""></p></div> <div style="height: 20px; font-size: 10px"><p>Rangée n°3 :<input type="text" id="inputrow3_1" VALUE=""></p></div> <div style="height: 20px; font-size: 10px"><p>Rangée n°4 :<input type="text" id="inputrow4_1" VALUE=""></p></div> <div style="height: 20px; font-size: 10px"><p>Rangée n°5 :<input type="text" id="inputrow5_1" VALUE=""></p></div> <div style="height: 20px; font-size: 10px"><p>Rangée n°6 :<input type="text" id="inputrow6_1" VALUE=""></p></div> <div style="height: 20px; font-size: 10px"><p>Rangée n°7 :<input type="text" id="inputrow7_1" VALUE=""></p></div> <div style="height: 20px; font-size: 10px"><p>Rangée n°8 :<input type="text" id="inputrow8_1" VALUE=""></p></div> <br><p> <input style="width: 655px" type="text" id="titremespre" placeholder="Titre de présentation (facultatif)"></p><textarea id="mespre" placeholder="Message de présentation (facultatif)" rows=4 cols=100></textarea> <div class="outmodal"><input type="button" name="valider" class="simplemodal-close" value="VALIDER" onClick="add_affiche()"><input type="button" class="simplemodal-close" name="quitter" value="QUITTER" onClick="simplemodal-close"></div></div></div></div>');


chainSelect('init');

//Liste de la formation équipe domicile
for(var i = 0; i < tbl_formation.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_formation[i]['formation_name'];
	monOption.value = i;

	document.getElementById('formationlisthome').options[i] = monOption;
}
//Liste de la formation équipe extérieure
for(var i = 0; i < tbl_formation.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_formation[i]['formation_name'];
	monOption.value = i;

	document.getElementById('formationlistaway').options[i] = monOption;
}

//Charger la liste des chaines de télévision
for(var i = 0; i < tbl_tv.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_tv[i]['tv_code'];
	monOption.value = i;

	document.getElementById('tvlist').options[i] = monOption;
}
//Charger la liste des formats de la mosaïque
for(var i = 0; i < tbl_mosaique.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_mosaique[i]['format'];
	monOption.value = i;

	document.getElementById('addmosaique').options[i] = monOption;
}

for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_01').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_02').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_03').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_04').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_05').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_06').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_07').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_08').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_09').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_10').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerhomerolelist_11').options[i] = monOption;
}

for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_01').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_02').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_03').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_04').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_05').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_06').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_07').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_08').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_09').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_10').options[i] = monOption;
}
for(var i = 0; i < tbl_role.length; i++){
	var monOption = document.createElement('option');
	monOption.text = tbl_role[i]['role_code'];
	monOption.value = i;

	document.getElementById('playerawayrolelist_11').options[i] = monOption;
}

$('.simplemodal-open').click(function(){
// Opening animations
$("#sample").modal({onOpen: function (dialog) {
	dialog.overlay.fadeIn('slow', function () {
		dialog.data.hide();
		dialog.container.fadeIn('slow', function () {
			dialog.data.slideDown('slow');	 
		});
	});
}});

});

$('.simplemodal-close').click(function(){
				$.modal.close();
});

	var motsClefs =  [];
	var form = document.getElementById("auto-suggest");
	var input = form.search;
	var list = document.createElement("ul");
	list.className = "suggestions";
	list.style.display = "none";
	form.appendChild(list);

input.onkeyup = function(){
    var txt = this.value;

    if(!txt){
        list.style.display = "none";
	return;
    }
    
    var suggestions = 0;
    var frag = document.createDocumentFragment();
		
    for(var i = 0, c = motsClefs.length; i < c; i++){

	var reg = new RegExp("^"+txt, "i");
if(new RegExp("^"+txt,"i").test(motsClefs[i])){
    var word = document.createElement("li");
    frag.appendChild(word);
    word.innerHTML = motsClefs[i].replace(new RegExp("^("+txt+")","i"),"<strong>$1</strong>");
    word.mot = motsClefs[i];

    word.onmousedown = function(){	
	input.focus();
	input.value = this.mot;
	list.style.display = "none";

        return false;
    };		
    suggestions++;
}

    }

    if(suggestions){
        list.innerHTML = "";
	list.appendChild(frag);
	list.style.display = "block";
    }
    else {
	list.style.display = "none";			
    }	
};

input.onblur = function(){

	wordsearch = document.forms.fff.search.value;
    list.style.display = "none";	
    if(wordsearch=="")
        wordsearch = " ";

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		var j = 0;
		for (var i = 0; i < 50000; i++) {

	var resultplayer = tbl_player[i]['player_img'].indexOf(wordsearch);

if(resultplayer > -1){

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+tbl_player[i]['player_img']+'" title="'+wordsearch+'" onmouseover="ChangeText(this.title)">';
};

};

};

	$(".faux-stickers").click( function () {
        
	var src;

        src = $(this).attr('src');

        $("#message_topic").focus();

        $("#message_topic").val($("#message_topic").val() + " " + src + " ");

        $("#message_topic").focus();
    
    } );
    
    function encadre(lien)
    {
        return '<img style="cursor: pointer" width="68" height="51" src="'+lien+'" class="faux-stickers"> ';
    }
    
    function insert(contenue)
    {
        $('.jv-editor').after(contenue + "<br>");
    }
    
    function addStickers(image)
    {
        ctn += encadre(image);
    }
    
})();



function add_sticker(name,icone,img_array,img_array2){

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

	var tab = document.getElementsByClassName("f-tab-ffs")[0]
	var para = document.createElement("div");
	para.id = "sticker_"+name;
	para.innerHTML = name;
	para.style.cursor = "pointer";
	para.style.width = "62px";
	para.style.height = "62px";
	para.style.display = "inline-block";
	para.style.border = "1px solid #8A8A8A";
	para.style.borderRadius = "3px";
	para.style.backgroundImage = 'url('+ icone +')';
	tab.appendChild(para);
	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		for (var i = 0; i < img_array.length; i++) {

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+img_array[i]+'" title="'+img_array2[i]+'" onmouseover="ChangeText(this.title)">';

		}

	}, false);

};

function add_sticker_shirt(name,icone,img_array,img_array2){

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

	var tab = document.getElementsByClassName("f-tab-ffs")[0]
	var para = document.createElement("div");
	para.id = "sticker_"+name;
	para.innerHTML = name;
	para.style.cursor = "pointer";
	para.style.width = "62px";
	para.style.height = "62px";
	para.style.display = "inline-block";
	para.style.border = "1px solid #8A8A8A";
	para.style.borderRadius = "3px";
	para.style.backgroundImage = 'url('+ icone +')';
	tab.appendChild(para);
	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		for (var i = 0; i < tbl_team.length; i++) {

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+tbl_team[i]['shirt1_img']+'" title="'+tbl_team[i]['team_nom']+' Maillot Home" onmouseover="ChangeText(this.title)">';
		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+tbl_team[i]['shirt2_img']+'" title="'+tbl_team[i]['team_nom']+' Maillot Away" onmouseover="ChangeText(this.title)">';
if(tbl_team[i]['shirt3_img']!= ""){
		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+tbl_team[i]['shirt3_img']+'" title="'+tbl_team[i]['team_nom']+' Maillot Third" onmouseover="ChangeText(this.title)">';}

		}

	}, false);

};

function add_sticker_ecusson(name,icone,img_array,img_array2){

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

	var tab = document.getElementsByClassName("f-tab-ffs")[0]
	var para = document.createElement("div");
	para.id = "sticker_"+name;
	para.innerHTML = name;
	para.style.cursor = "pointer";
	para.style.width = "62px";
	para.style.height = "62px";
	para.style.display = "inline-block";
	para.style.border = "1px solid #8A8A8A";
	para.style.borderRadius = "3px";
	para.style.backgroundImage = 'url('+ icone +')';
	tab.appendChild(para);
	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		for (var i = 0; i < tbl_team.length; i++) {

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+tbl_team[i]['team_img']+'" title="'+tbl_team[i]['team_nom']+'" onmouseover="ChangeText(this.title)">';

		}

	}, false);

};

function add_sticker_stade(name,icone,img_array,img_array2){

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

	var tab = document.getElementsByClassName("f-tab-ffs")[0]
	var para = document.createElement("div");
	para.id = "sticker_"+name;
	para.innerHTML = name;
	para.style.cursor = "pointer";
	para.style.width = "62px";
	para.style.height = "62px";
	para.style.display = "inline-block";
	para.style.border = "1px solid #8A8A8A";
	para.style.borderRadius = "3px";
	para.style.backgroundImage = 'url('+ icone +')';
	tab.appendChild(para);
	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		for (var i = 0; i < tbl_team.length; i++) {

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+tbl_team[i]['stade_img']+'" title="'+tbl_team[i]['team_nom']+' : '+tbl_team[i]['stade_name']+'" onmouseover="ChangeText(this.title)">';

		}

	}, false);

};

function add_sticker_mini1(name,icone,img_array,img_array2){

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

	var tab = document.getElementsByClassName("f-tab-ffs2")[0]
	var para = document.createElement("div");
	para.id = "sticker_"+name;
	para.innerHTML = "";
	para.style.cursor = "pointer";
	para.style.width = "31px";
	para.style.height = "31px";
	para.style.display = "inline-block";
	para.style.border = "1px solid #8A8A8A";
	para.style.borderRadius = "3px";
	para.style.backgroundImage = 'url('+ icone +')';
	tab.appendChild(para);
	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		for (var i = 0; i < img_array.length; i++) {

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+img_array[i]+'" title="'+img_array2[i]+'" onmouseover="ChangeText(this.title)">';

		}

	}, false);

};

function add_sticker_mini2(name,icone,img_array,img_array2){

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

	var tab = document.getElementsByClassName("f-tab-ffs3")[0]
	var para = document.createElement("div");
	para.id = "sticker_"+name;
	para.innerHTML = "";
	para.style.cursor = "pointer";
	para.style.width = "31px";
	para.style.height = "31px";
	para.style.display = "inline-block";
	para.style.border = "1px solid #8A8A8A";
	para.style.borderRadius = "3px";
	para.style.backgroundImage = 'url('+ icone +')';
	tab.appendChild(para);
	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		for (var i = 0; i < img_array.length; i++) {

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+img_array[i]+'" title="'+img_array2[i]+'" onmouseover="ChangeText(this.title)">';

		}

	}, false);

};

add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477401135-ico-angers.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477401146-ico-bastia.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477401946-ico-bordeaux.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477401959-ico-caen.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403767-ico-dijon.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477401972-ico-guingamp.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477402456-ico-lille.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477402469-ico-lorient.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477402475-ico-lyon.png",[
	"http://image.noelshack.com/fichiers/2016/50/1482047585-cornetmaxwell01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482042238-dardersergi01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482057033-diakhabymouctar01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482023516-fekirnabil01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482047667-ferrijordan01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482042599-gasparjordy01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482021455-ghezzalrachid01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482057157-ghezzalrachid02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482045270-gonalonsmaxime01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482049406-grenierclement01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482055572-kalulualdo01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482028496-lacazettealexandre01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482028468-lacazettealexandre02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482045676-lopesanthony01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482049776-lopesanthony02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482048842-mammanaemanuel02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482088643-mbiwayanga01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482043864-moreljeremy01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482046234-nkoulounicolas01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482041234-rafael01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482045983-rybusmaciej01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482041607-tolissocorentin01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482056701-tousartlucas01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482025001-valbuenamathieu01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482027384-valbuenamathieu02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482026841-valbuenamathieu03.png",
	"http://image.noelshack.com/fichiers/2016/50/1482025549-valbuenamathieu04.png",
	"http://image.noelshack.com/fichiers/2016/50/1482026335-valbuenamathieu05.png",
	"http://image.noelshack.com/fichiers/2016/50/1482056165-genesiobruno01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482056185-genesiobruno02.png"
], [
	"Maxwell Cornet",
	"Sergi Darder",
	"Mouctar Diakhaby",
	"Nabil Fekir",
	"Jordan Ferri",
	"Jordy Gaspar",
	"Rachid Ghezzal, la bête humain",
	"Rachid Ghezzal, la bête humain",
	"Maxime Gonalons",
	"Clément Grenier",
	"Aldo Kalulu",
	"Alexandre Lacazette, Penalcazette",
	"Alexandre Lacazette, Penalcazette",
	"Anthony Lopes",
	"Anthony Lopes",
	"Emanuel Mammana",
	"Yanga Mbiwa",
	"Jérémy Morel",
	"Nicolas Nkoulou",
	"Rafael",
	"Maciej Rybus",
	"Corentin Tolisso",
	"Lucas Tousart",
	"Mathieu Valbuena, el émbolo",
	"Mathieu Valbuena, el émbolo",
	"Mathieu Valbuena, el émbolo",
	"Mathieu Valbuena, el émbolo",
	"Mathieu Valbuena, el émbolo",
	"Bruno Génésio",
	"Bruno Génésio"
]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477402552-ico-marseille.png",[
	"http://image.noelshack.com/fichiers/2016/50/1482088780-njieclinton01.png"
], [
	"Clinton Njié"
]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477402562-ico-metz.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477402569-ico-monaco.png",[
	"http://image.noelshack.com/fichiers/2016/50/1482031655-bakayokotiemoue01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482029135-boschiliagabriel01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482033645-carrilloguido01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482034081-dirarnabil01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482020232-germainvalere01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482020836-germainvalere02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482031220-kamilglik01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482015192-fabinho01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482019281-falcaoradamel01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482035847-falcaoradamel02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482053408-falcaoradamel03.png",
	"http://image.noelshack.com/fichiers/2016/50/1482053420-falcaoradamel04.png",
	"http://image.noelshack.com/fichiers/2016/50/1482031976-jemerson01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482052193-jemerson02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482050750-jemerson03.png",
	"http://image.noelshack.com/fichiers/2016/50/1482017390-lemarthomas01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482036865-mbappekylian01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482038378-mbappekylian02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482016987-mendybenjamin01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482053850-moutinhojoao01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482034792-moutinhojoao02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482051588-moutinhojoao03.png",
	"http://image.noelshack.com/fichiers/2016/50/1482033205-raggiandrea01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482032244-sidibedjibril01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482012732-silvabernardo01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482032566-subasicdanyjel01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482052001-subasicdanyjel02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482035341-tourealmany01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482013954-jardimleonardo01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482013954-jardimleonardo02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482050332-monacoissou.png"
], [
	"Tiémoué Bakayoko",
	"Gabriel Boschilia",
	"Guido Carrillo",
	"Nabil Dirar",
	"Valère Germain",
	"Valère Germain",
	"Kamil Glik",
	"Fabinho",
	"Radamel Falcao",
	"Radamel Falcao",
	"Radamel Falcao",
	"Radamel Falcao",
	"Jemerson",
	"Jemerson",
	"Jemerson",
	"Thoma Lemar",
	"Kylian Mbappé",
	"Kylian Mbappé",
	"Benjamin Mendy",
	"Joao Moutinho",
	"Joao Moutinho",
	"Joao Moutinho",
	"Andrea Raggi",
	"Djibril Sidibé",
	"Bernardo Silva",
	"Danyjel Subasic",
	"Danyjel Subasic",
	"Almany Touré",
	"Leonardo Jardim",
	"Leonardo Jardim",
	"Monaco Issou"
]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403194-ico-montpellier.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403223-ico-nancy.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403228-ico-nantes.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403236-ico-nice.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477402576-ico-paris.png",[
	"http://image.noelshack.com/fichiers/2017/02/1484374171-areolaalphonse01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374278-benarfahatem02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374296-benarfahatem03.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374300-benarfahatem04.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374314-benarfahatem05.png",
	"http://image.noelshack.com/fichiers/2016/42/1477249739-cavani03.png",
	"http://image.noelshack.com/fichiers/2017/02/1484375054-cavaniedinson04.png",
	"http://image.noelshack.com/fichiers/2017/02/1484375059-cavaniedinson05.jpg",
	"http://image.noelshack.com/fichiers/2017/02/1484374080-dimariaangel01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484269935-draxlerjulian01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374681-kimpembepresnel01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374554-krychowiakgrzegorz01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484268057-kurzawalayvin01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484269878-lucasmoura01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484274323-marquinhos01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484274274-matuidiblaise01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484375422-matuidiblaise02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374667-maxwell01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374871-meunierthomas01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484375084-nkunkuchristopher01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374491-nkunkuchristopher02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374850-pastorejavier01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484270701-rabiotadrien01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484271085-thiagomotta01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484268528-thiagosilva01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484374984-trappkevin01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484267727-verrattimarco01.png"
], [
	"Alphonse Areola",
	"Hatem Ben Arfa",
	"Hatem Ben Arfa",
	"Hatem Ben Arfa",
	"Hatem Ben Arfa",
	"Edinson Cavani",
	"Edinson Cavani",
	"Edinson Cavani",
	"Angèl Di Maria",
	"Julian Draxler",
	"Presnel Kimpembe",
	"Grzegorz Krychowiak",
	"Layvin Kurzawa",
	"Lucas Moura",
	"Marquinhos",
	"Blaise Matuidi",
	"Blaise Matuidi",
	"Maxwell",
	"Thomas Meunier",
	"Christopher Nkunku",
	"Christopher Nkunku",
	"Javier Pastore",
	"Adrien Rabiot",
	"Thiago Motta",
	"Thiago Silva",
	"Kevin Trapp",
	"Marco Verratti"
]);

add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403274-ico-rennes.png",[
	"http://image.noelshack.com/fichiers/2017/02/1484372864-armandsylvain01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373121-baalludovic01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373135-bensebainiramy01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373396-chantomeclement01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373472-chantomeclement02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373480-costilbenoit01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373484-danzeromain01-cr.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373675-erasmuskermit01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373698-fernandesgelson01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373707-fernandesgelson02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373724-gnagnonjoris01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373919-gourcuffyoann01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373926-grosickikamil01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484373534-siogiovanni01.png"
], [
	"Sylvain Armand",
	"Ludovic Baal",
	"Ramy Bensebaini",
	"Clément Chantôme",
	"Clément Chantôme",
	"Benoît Costil",
	"Romain Danzé",
	"Kermit Erasmus",
	"Gelson Fernandes",
	"Gelson Fernandes",
	"Joris Gnagnon",
	"Yoann Gourcuff",
	"Kamil Grosicki",
	"Giovanni Sio"
]);

add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403303-ico-saint-etienne.png",[

]);
add_sticker_mini1("","http://image.noelshack.com/fichiers/2016/43/1477403326-ico-toulouse.png",[

]);



add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405360-ico-arsenal.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405366-ico-atletico-de-madrid.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405374-ico-barcelonefc.png",[
	"http://image.noelshack.com/fichiers/2016/48/1480373049-uefalona01.png"
] , [
	"uefalona"
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405379-ico-bayern-munich.png",[
	"http://image.noelshack.com/fichiers/2016/48/1480371231-arjenrobben02.png",
	"http://image.noelshack.com/fichiers/2016/48/1480370205-arjenrobben03.png"
] , [
	"Arjen Robben",
	"Arjen Robben"
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405422-ico-benfica.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405427-ico-borussia-dortmund.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405434-ico-chelsea.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405441-ico-inter-milan.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405471-ico-juventus-turin.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405476-ico-liverpool.png",[
	"http://image.noelshack.com/fichiers/2017/02/1484494506-alexanderarnoldtrent.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466191-canemre01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466198-clynenathaniel01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484493880-coutinhophilippe01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484493886-firminoroberto01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466326-hendersonjordan01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466345-ingsdanny01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466486-kariusloris01.png",
	"http://image.noelshack.com/fichiers/2016/43/1477414307-lallanaadam01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466491-klavanragnar01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466502-leivalucas01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466619-lovrendejan01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484467372-lovrendejan02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466632-manesadio01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466678-matipjoel01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466682-mignoletsimon01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466688-milnerjames01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466878-morenoalberto01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466890-origidivock01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484466899-sturridgedaniel01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484467000-wijnaldumgeorginio01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484464753-kloppjurgen01.png"
], [
	"Trent Alexandre-Arnold",
	"Emre Can",
	"Nathaniel Clyne",
	"Philippe Coutinho",
	"Roberto Firmino",
	"Jordan Henderson",
	"Danny Ings",
	"Loris Karius",
	"Adam Lallana",
	"Ragnar Klavan",
	"Lucas Leiva",
	"Dejan Lovren",
	"Dejan Lovren",
	"Sadio Mané",
	"Joel Matip",
	"Simon Mignolet",
	"James Milner",
	"Alberto Moreno",
	"Divock Origi",
	"Daniel Sturridge",
	"Georginio Wijnaldum",
	"Jurgen Klopp"
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405481-ico-manchester-city.png",[
]);

add_sticker_mini2("Eric Cantona","http://image.noelshack.com/fichiers/2016/43/1477405486-ico-manchester-united.png",[
	"http://image.noelshack.com/fichiers/2017/02/1484467981-baillyeric01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445186-blinddaley01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445197-carrickmichael01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484467989-darmianmatteo01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445475-degeadavid01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468113-depaymemphis01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445214-fellainimarouane01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468120-fosumensahtimothy01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445547-herreraander01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468127-ibrahimoviczlatan01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482015924-ibrahimoviczlatan03.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468129-jonesphil01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468381-lingardjesse01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445557-lingardjesse02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468392-martialanthony01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445566-matajuan01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468407-mkhitaryanhenrikh01.png",
	"http://image.noelshack.com/fichiers/2016/50/1481994280-pogbapaul01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468422-rashfordmarcus01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445578-rojomarcos01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468689-romerosergio01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445898-rooneywayne01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468696-schweinsteigerbastian01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445905-shawluke01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484445911-smallingchris01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468705-valenciaantonio01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484468993-youngashley01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484464819-mourinhojose01.png",
	"http://image.noelshack.com/fichiers/2016/40/1475848010-ericcantona01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477177805-ericcantona02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477244693-ericcantona03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477177867-ericcantona05.png"
], [
	"Eric Bailly",
	"Daley Blind",
	"Michael Carrick",
	"Matteo Darmian",
	"David De Gea",
	"Depay Memphis",
	"Marouane Fellaini",
	"Timothy Fosu-Mensah",
	"Ander Herrera",
	"Zlatan Ibrahimovic",
	"Zlatan Ibrahimovic",
	"Phil Jones",
	"Jesse Lingard",
	"Jesse Lingard",
	"Anthony Martial",
	"Juan  Mata",
	"Henrikh Mkhitaryan",
	"Paul Pogba",
	"Marcus Rashford",
	"Marcos Rojo",
	"Sergio Romero",
	"Wayne Rooney",
	"Bastian Schweinsteiger",
	"Luke Shaw",
	"Chris Smalling",
	"Antonio Valencia",
	"Ashley Young",
	"José Mourinho",
	"Eric Cantona",
	"Eric Cantona",
	"Eric Cantona",
	"Eric Cantona"
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405518-ico-milan.png",[
	"http://image.noelshack.com/fichiers/2016/42/1477160503-mbayeniang01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477239199-mbayeniang02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477172903-kucka01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477167547-bonaventura02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477165286-mattiadesciglio02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477164131-donnarumma01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477170496-manuellocatelli01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477173527-romagnoli02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477175843-andreapoli01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477176245-carlosbacca02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477166497-suso02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477171192-abate01.png",
	"http://image.noelshack.com/fichiers/2016/43/1477267927-abate02.png",
	"http://image.noelshack.com/fichiers/2016/43/1477267225-abate03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477171994-gabrielpaletta02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477179291-gabrielpaletta03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477244570-honda02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477174053-lapadula03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477175299-gomez01.png",
	"http://image.noelshack.com/fichiers/2016/48/1480369108-luizadriano07.png",
	"http://image.noelshack.com/fichiers/2016/42/1477245441-luizadriano08.png",
	"http://image.noelshack.com/fichiers/2016/43/1477263838-luizadriano09.png",
	"http://image.noelshack.com/fichiers/2016/43/1477262411-luizadriano10.png",
	"http://image.noelshack.com/fichiers/2016/42/1477247774-luizadriano11.png",
	"http://image.noelshack.com/fichiers/2016/42/1477246840-luizadriano12.png",
	"http://image.noelshack.com/fichiers/2016/43/1477264881-zapata01.png",
	"http://image.noelshack.com/fichiers/2016/43/1477265612-zapata02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477250794-zapata03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477240229-zapata05.png",
	"http://image.noelshack.com/fichiers/2016/42/1477254017-calabria02.png",
	"http://image.noelshack.com/fichiers/2016/43/1477339702-calabria03.png",
	"http://image.noelshack.com/fichiers/2016/43/1477266152-vangioni01.png",
	"http://image.noelshack.com/fichiers/2016/40/1475527396-monto-sad.png",
	"http://image.noelshack.com/fichiers/2016/40/1475845498-georgeweah1.png",
	"http://image.noelshack.com/fichiers/2016/40/1475527423-balo-rire.png",
	"http://image.noelshack.com/fichiers/2016/42/1477176381-milanissou01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477177642-andreapoli02.png",
	"http://image.noelshack.com/fichiers/2016/50/1481953780-inzaghipippo01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482002697-crudelitiziano01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482003785-crudelitiziano02.png",
	"http://image.noelshack.com/fichiers/2016/50/1482005055-crudelitiziano03.png",
	"http://image.noelshack.com/fichiers/2016/50/1482001221-crudelitiziano04.png",
	"http://image.noelshack.com/fichiers/2016/50/1482005430-crudelitiziano05.png",
	"http://image.noelshack.com/fichiers/2016/50/1482000621-crudelitiziano06.png"
], [
	"Mbaye Niang",
	"Mbaye Niang",
	"Juraj Kucka",
	"Giacomo Bonaventura",
	"Mattia De Sciglio",
	"Gianluigi Donnarumma",
	"Manuel Locatelli",
	"Alessio Romagnoli",
	"Andrea Poli",
	"Carlos Bacca",
	"Suso",
	"Ignazio Abate",
	"Ignazio Abate",
	"Ignazio Abate",
	"Gabriel Paletta",
	"Gabriel Paletta",
	"Keisuke Honda",
	"Gianluca Lapadula",
	"Gustavo Gomez",
	"Luiz Adriano",
	"Luiz Adriano",
	"Luiz Adriano",
	"Luiz Adriano",
	"Luiz Adriano",
	"Luiz Adriano",
	"Cristian Zapata",
	"Cristian Zapata",
	"Cristian Zapata",
	"Cristian Zapata",
	"Davide Calabria",
	"Davide Calabria",
	"Leonel Vangioni",
	"Riccardo Montolivo",
	"George Weah",
	"Mario Balotelli",
	"Milan Team Issou",
	"Andrea Poli",
	"Pippo Inzaghi",
	"Tiziano Crudeli",
	"Tiziano Crudeli",
	"Tiziano Crudeli",
	"Tiziano Crudeli",
	"Tiziano Crudeli",
	"Tiziano Crudeli"
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405525-ico-porto.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405531-ico-real-madrid.png",[
	"http://image.noelshack.com/fichiers/2017/02/1484263827-asensiomarco01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264188-balegareth01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264204-benzemakarim01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264209-carvajaldani01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264209-casemiro01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264210-casillakiko01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264213-casillakiko02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264253-coentraofabio01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264259-coentraofabio02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264267-coentraofabio03.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264261-cristianoronaldo01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264275-danilo01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264266-isco01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264265-jamesrodriguez01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264274-kovacicmateo01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264337-kroostoni01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264344-marcelo01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264348-marcelo02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264346-marianodiaz01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264349-modriclucas01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264358-morataalvaro01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264367-nachofernandez01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264373-navaskeylor01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264426-pepe01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264436-ramossergio01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264425-ramossergio02.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264437-varanerafael01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264427-vazquezlucas01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264434-yanez01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484264438-zidaneenzo01.png",
	"http://image.noelshack.com/fichiers/2017/02/1484263603-zidanezinedine01.png"
], [
	"Marco Asensio",
	"Gareth Bale",
	"Karim Benzema",
	"Dani Carvajal",
	"Casemiro",
	"Kiko Casilla",
	"Kiko Casilla",
	"Fabio Coentrao",
	"Fabio Coentrao",
	"Fabio Coentrao",
	"Cristiano Ronaldo",
	"Danilo",
	"Isco",
	"James Rodriguez",
	"Mateo Kovacic",
	"Toni Kroos",
	"Marcelo",
	"Marcelo",
	"Mariano Diaz",
	"Lucas Modric",
	"Alvaro Morata",
	"Nacho Fernandez",
	"Keylor Navas",
	"Pepe",
	"Sergio Ramos",
	"Sergio Ramos",
	"Rafael Varane",
	"Lucas Vazquez",
	"Yanez",
	"Enzo Zidane",
	"Zinedine Zidane"
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405535-ico-roma.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405580-ico-schalke04.png",[
]);
add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405588-ico-sporting-portugal.png",[
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477405593-ico-tottenham-hotspur.png",[
	"http://image.noelshack.com/fichiers/2016/43/1477414316-eriksenchristian01.png"
], [
	"Christian Eriksen"
]);

add_sticker_mini2("","http://image.noelshack.com/fichiers/2016/43/1477410196-ico-fifaworld.png",[
	"http://image.noelshack.com/fichiers/2016/43/1477412339-pavolettileonardo01.png",
	"http://image.noelshack.com/fichiers/2016/43/1477419070-simeonegiovanni01.png"
], [
	"Leonardo Pavoletti",
	"Giovanni Simeone"
]);



add_sticker("","http://image.noelshack.com/fichiers/2016/43/1477398722-ico-france-ligue1.png",[
	"http://image.noelshack.com/fichiers/2016/42/1477249739-cavani03.png"
], [
	"Edinson Cavani"
]);

add_sticker("","http://image.noelshack.com/fichiers/2016/43/1477409662-ico-big5.png",[
	"http://image.noelshack.com/fichiers/2016/42/1477160503-mbayeniang01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477239199-mbayeniang02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477172903-kucka01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477167547-bonaventura02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477165286-mattiadesciglio02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477164131-donnarumma01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477170496-manuellocatelli01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477173527-romagnoli02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477175843-andreapoli01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477176245-carlosbacca02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477166497-suso02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477171192-abate01.png",
	"http://image.noelshack.com/fichiers/2016/43/1477267927-abate02.png",
	"http://image.noelshack.com/fichiers/2016/43/1477267225-abate03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477171994-gabrielpaletta02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477179291-gabrielpaletta03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477244570-honda02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477174053-lapadula03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477175299-gomez01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477245441-luizadriano08.png",
	"http://image.noelshack.com/fichiers/2016/43/1477263838-luizadriano09.png",
	"http://image.noelshack.com/fichiers/2016/43/1477262411-luizadriano10.png",
	"http://image.noelshack.com/fichiers/2016/42/1477247774-luizadriano11.png",
	"http://image.noelshack.com/fichiers/2016/42/1477246840-luizadriano12.png",
	"http://image.noelshack.com/fichiers/2016/43/1477264881-zapata01.png",
	"http://image.noelshack.com/fichiers/2016/43/1477265612-zapata02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477250794-zapata03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477240229-zapata05.png",
	"http://image.noelshack.com/fichiers/2016/42/1477254017-calabria02.png",
	"http://image.noelshack.com/fichiers/2016/43/1477339702-calabria03.png",
	"http://image.noelshack.com/fichiers/2016/43/1477266152-vangioni01.png",
	"http://image.noelshack.com/fichiers/2016/40/1475527396-monto-sad.png",
	"http://image.noelshack.com/fichiers/2016/40/1475845498-georgeweah1.png",
	"http://image.noelshack.com/fichiers/2016/40/1475527423-balo-rire.png",
	"http://image.noelshack.com/fichiers/2016/40/1475848010-ericcantona01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477177805-ericcantona02.png",
	"http://image.noelshack.com/fichiers/2016/42/1477244693-ericcantona03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477177867-ericcantona05.png",
	"http://image.noelshack.com/fichiers/2016/42/1477176381-milanissou01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477177642-andreapoli02.png",
	"http://image.noelshack.com/fichiers/2016/50/1481953780-inzaghipippo01.png"
], [
	"Mbaye Niang",
	"Mbaye Niang",
	"Juraj Kucka",
	"Giacomo Bonaventura",
	"Mattia De Sciglio",
	"Gianluigi Donnarumma",
	"Manuel Locatelli",
	"Alessio Romagnoli",
	"Andrea Poli",
	"Carlos Bacca",
	"Suso",
	"Ignazio Abate",
	"Ignazio Abate",
	"Ignazio Abate",
	"Gabriel Paletta",
	"Gabriel Paletta",
	"Keisuke Honda",
	"Gianluca Lapadula",
	"Gustavo Gomez",
	"Luiz Adriano",
	"Luiz Adriano",
	"Luiz Adriano",
	"Luiz Adriano",
	"Luiz Adriano",
	"Cristian Zapata",
	"Cristian Zapata",
	"Cristian Zapata",
	"Cristian Zapata",
	"Davide Calabria",
	"Davide Calabria",
	"Leonel Vangioni",
	"Riccardo Montolivo",
	"George Weah",
	"Mario Balotelli",
	"Milan Team Issou",
	"Andrea Poli",
	"Pippo Inzaghi"
]);

add_sticker("","http://image.noelshack.com/fichiers/2016/43/1477407279-ico-managers.png",[
	"http://image.noelshack.com/fichiers/2016/42/1477251637-emery01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477252933-emery03.png",
	"http://image.noelshack.com/fichiers/2016/42/1477236218-montella01.png",
	"http://image.noelshack.com/fichiers/2016/42/1477232231-montella02.png",
	"http://image.noelshack.com/fichiers/2016/43/1477418747-juricivan01.png",
	"http://image.noelshack.com/fichiers/2016/44/1478415649-sampaolijorge01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482013954-jardimleonardo01.png",
	"http://image.noelshack.com/fichiers/2016/50/1482013954-jardimleonardo02.png"
], [
	"Unai Emery",
	"Unai Emery",
	"Vincenzo Montella",
	"Vincenzo Montella",
	"Ivan Juric",
	"Jorge Sampaoli",
	"Leonardo Jardim",
	"Leonardo Jardim"
]);

add_sticker("","http://image.noelshack.com/fichiers/2016/43/1477406730-ico-presse.png",[
	"http://image.noelshack.com/fichiers/2016/35/1472571618-nabil-djellit-generateur-de-rumeurs.png",
	"http://image.noelshack.com/fichiers/2016/42/1477178335-riolo01.jpg",
	"http://image.noelshack.com/fichiers/2016/42/1477229232-yohannriou01.jpg"
], [
	"Nabil Djellit",
	"Daniel Riolo",
	"Yohann Riou"
]);

add_sticker_shirt("","http://image.noelshack.com/fichiers/2016/43/1477408411-ico-shirt.png",[], []);
add_sticker_ecusson("","http://image.noelshack.com/fichiers/2016/43/1477408586-ico-ecussons.png",[], []);
add_sticker_stade("","http://image.noelshack.com/fichiers/2016/43/1477407909-ico-stades.png",[], []);

add_sticker("","http://image.noelshack.com/fichiers/2016/43/1477407573-ico-tactique.png",[
	"http://image.noelshack.com/fichiers/2016/43/1477389659-ico-banc.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389667-ico-chasuble.png",
	"http://image.noelshack.com/fichiers/2016/43/1477395783-ico-tactique.png",
	"http://image.noelshack.com/fichiers/2016/43/1477393843-ico-brassard.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389712-ico-position-a.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389720-ico-position-ad.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389724-ico-position-ag.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389729-ico-position-d.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389735-ico-position-dc.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389774-ico-position-g.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389778-ico-position-ld.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389787-ico-position-lg.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389791-ico-position-m.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389854-ico-position-md.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389858-ico-position-mo.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389862-ico-position-mr.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389866-ico-position-r.png",
	"http://image.noelshack.com/fichiers/2016/43/1477389870-ico-position-tq.png"
], [
	"Banc","Chasuble","Tactique","Brassard","Attaquant","Ailier droit","Ailier gauche","Défenseur","Défenseur central","Gardien","Latéral droit","Latéral gauche","Milieu","Milieu défensif","Milieu offensif","Milieu relayeur","Remplaçant","Trequartista"
]);

add_sticker("","http://image.noelshack.com/fichiers/2016/43/1477407077-ico-training.png",[
	"http://image.noelshack.com/fichiers/2016/50/1482057628-brbapproved.png",
	"http://image.noelshack.com/fichiers/2016/50/1482057632-brbrejected.png",
	"http://image.noelshack.com/fichiers/2016/43/1477390839-ico-goal.png",
	"http://image.noelshack.com/fichiers/2016/43/1477391618-ico-offside.png",
	"http://image.noelshack.com/fichiers/2016/43/1477390970-ico-remplacement.png",
	"http://image.noelshack.com/fichiers/2016/43/1477391632-ico-blessure.png",
	"http://image.noelshack.com/fichiers/2016/43/1477391637-ico-cartejaune.png",
	"http://image.noelshack.com/fichiers/2016/43/1477391641-ico-carterouge.png",
	"http://image.noelshack.com/fichiers/2016/43/1477392397-ico-arbitre.png",
	"http://image.noelshack.com/fichiers/2016/43/1477390994-ico-tv.png",
	"http://image.noelshack.com/fichiers/2016/43/1477395017-logo-tv-beinsports.png",
	"http://image.noelshack.com/fichiers/2016/43/1477395021-logo-tv-canalplus.png",
	"http://image.noelshack.com/fichiers/2016/43/1477395026-logo-tv-sfrsport.png",
	"http://image.noelshack.com/fichiers/2017/03/1484786418-busdetruit.png",
	"http://image.noelshack.com/fichiers/2017/01/1483644859-aw01.png"
], [
	"BRB approuve le joueur","BRB refuse le joueur","But","Hors-jeu","Remplacement","Blessure","Carton jaune","Carton rouge","Arbitre","TV","Beinports","Canal Plus","SFR Sport","bus détruit","AW"
]);

add_sticker("","http://image.noelshack.com/fichiers/2016/43/1477406932-ico-divers.png",[
	"http://image.noelshack.com/fichiers/2016/43/1477379148-logo-allemagne-bundesliga.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379153-logo-france-coupedelaligue.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379158-logo-france-ligue1.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379163-logo-espagne-laliga.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379170-logo-espagne-laliga2.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379407-logo-grandebretagne-premierleague.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379180-logo-grandebretagne-efl.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379185-logo-italie-seriea.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379189-logo-italie-serieb.png",
	"http://image.noelshack.com/fichiers/2016/43/1477379194-logo-portugal-liganos.png"
], [
	"Bundesliga",
	"Coupe de la Ligue",
	"Ligue 1",
	"LaLiga",
	"LaLiga 2",
	"Premier League",
	"EFL",
	"Serie A",
	"Serie B",
	"Liga Nos"
]);



function getDataFromTable( condition, table) {
  // récupération de la clé et de la valeur
  var cde = condition.replace(/\s/g, '').split('='),
      key = cde[0],
      value = cde[1],
      result = [];
  
  // retour direct si *
  if (condition === '*') {
    return table.slice();
  }
  // retourne les éléments répondant à la condition
  result = table.filter( function(obj){
       return obj[key] === value;
    });
  return result;
}


function updateSelect( id_select, liste, valeur, texte){
  var oOption,
      oSelect = document.getElementById( id_select),
      i, nb = liste.length;
  // vide le select
  oSelect.options.length = 0;
  // désactive si aucune option disponible
  oSelect.disabled = nb ? false : true;
  // affiche info nombre options, facultatif
  setNombre( oSelect, nb);
  // ajoute 1st option
  if( nb){
    oSelect.add( new Option( '-- choisir --', ''));
    // focus sur le select
    oSelect.focus();
  }
  // création des options d'après la liste
  for (i = 0; i < nb; i += 1) {
    // création option
    oOption = new Option( liste[i][texte], liste[i][valeur]);
    // ajout de l'option en fin
    oSelect.add( oOption);
  }
  // si une seule option on la sélectionne
  oSelect.selectedIndex = nb === 1 ? 1 : 0;
  // on retourne la valeur pour le select suivant
  return oSelect.value;
}


function setNombre( obj, nb){
  var oElem = obj.parentNode.querySelector('.nombre');
  if( oElem){
    oElem.innerHTML = nb ? '(' +nb +')' :'';
  }
}


function chainSelect( param){
  // affectation par défaut
  param = param || 'init';
  var liste,
      id     = param.id || param,
      valeur = param.value || '';
      
  // test à faire pour récupération de la value
  if( typeof id === 'string'){
     param = document.getElementById( id);
     valeur = param ? param.value : '';
  }

  switch (id){
    case 'init':
      // récup. des données
      liste = getDataFromTable( '*', tbl_league);
      liste2 = getDataFromTable( '*', tbl_formation);
      liste3 = getDataFromTable( '*', tbl_mosaique);
      // mise à jour du select
      valeur = updateSelect( 'leaguelist', liste, 'league_code', 'league_nom');
      valeur = updateSelect( 'formationlisthome', liste2, 'formation_code', 'formation_name');
      valeur2 = updateSelect( 'formationlistaway', liste2, 'formation_code', 'formation_name');
      valeur3 = updateSelect( 'addmosaique', liste3, 'mos_code', 'format');
      // chainage sur le select lié
      chainSelect('leaguelist');
      chainSelect('formationlisthome')
      chainSelect('formationlistaway')
      chainSelect('addmosaique')
      break;
    case 'leaguelist':
      // récup. des données
      liste = getDataFromTable( 'league_code=' +valeur, tbl_team);
      // mise à jour du select
      valeur = updateSelect( 'hometeamlist', liste, 'team_code', 'team_nom');
      valeur = updateSelect( 'awayteamlist', liste, 'team_code', 'team_nom');
      // chainage sur le select lié
      chainSelect('hometeamlist');
      chainSelect('awayteamlist');
      break;
    case 'hometeamlist':
      // récup. des données
      liste = getDataFromTable( 'team_code=' +valeur, tbl_player);
      // mise à jour du select
      valeur = updateSelect( 'playerhomelist_01', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_02', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_03', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_04', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_05', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_06', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_07', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_08', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_09', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_10', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerhomelist_11', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'hometopplayerlist', liste, 'player_code', 'player_name');
      // chainage sur le select lié
      chainSelect('playerhomelist');
      chainSelect('hometopplayerlist');
      break;
    case 'awayteamlist':
      // récup. des données
      liste = getDataFromTable( 'team_code=' +valeur, tbl_player);
      // mise à jour du select
      valeur = updateSelect( 'playerawaylist_01', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_02', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_03', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_04', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_05', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_06', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_07', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_08', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_09', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_10', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'playerawaylist_11', liste, 'player_code', 'player_name');
      valeur = updateSelect( 'awaytopplayerlist', liste, 'player_code', 'player_name');
      // chainage sur le select lié
      chainSelect('playerawaylist');
      chainSelect('awaytopplayerlist');
      break;
    case 'formationlisthome':
	getformationhome(valeur);
      break;
    case 'formationlistaway':
	getformationaway(valeur);
      break;
    case 'addmosaique':
	document.getElementById("inputtime").value = valeur;
	clickmosaique(valeur);
      break;
  }
}



function addsearch(){

	wordsearch = document.forms.fff.search.value;
    list.style.display = "none";	
    if(wordsearch=="")
        wordsearch = " ";

	function ChangeText(text){
    		if(document.getElementById('text')){
        	document.getElementById('text').innerHTML = text;}}; 

		var body = document.getElementsByClassName("f-cont")[0];
		body.innerHTML = "";
		var j = 0;
		for (var i = 0; i < 50000; i++) {

	var result = tbl_player[i]['player_img'].indexOf(wordsearch);

if(result > -1){

		body.innerHTML += '<img style="cursor: pointer" width="68" height="51" onclick="add_txt(this.src)" src="'+tbl_player[i]['player_img']+'" title="'+wordsearch+'" onmouseover="ChangeText(this.title)">';
};
};

};



function clickmosaique(valeur){

if(valeur =="001"){
alert("Coucou!")
	document.getElementById("inputtime").value = "Bingo !";
}



}


function refuserToucheEntree(event)
{
    // Compatibilité IE / Firefox
    if(!event && window.event) {
        event = window.event;
    }
    // IE
    if(event.keyCode == 13) {
        event.returnValue = false;
        event.cancelBubble = true;
    }
    // DOM
    if(event.which == 13) {
        event.preventDefault();
        event.stopPropagation();
    }
}




// Initialisation après chargement du DOM
document.addEventListener("DOMContentLoaded", function() {
  var oSelects = document.querySelectorAll('#liste select'),
      i, nb = oSelects.length;
  // affectation de la fonction sur le onchange
  for( i = 0; i < nb; i += 1) {
    oSelects[i].onchange = function() {
        chainSelect(this);
      };
  }
  // init du 1st select
  if( nb){
    chainSelect('init');
  }
});

