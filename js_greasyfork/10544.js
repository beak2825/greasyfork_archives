// ==UserScript==
// @name         Agario Mod V1
// @namespace   http://agar.io/
// @version      V1
// @description  A agario mod v1
// @author       Odyis
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10544/Agario%20Mod%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/10544/Agario%20Mod%20V1.meta.js
// ==/UserScript==

var ourskins = "Odyis;0chan;18-25;1up;8ball;UmguwJ0;ace;agariomods.com;al sahim;alaska;albania;algeria;anarchy;android;anonymous;aperture;apple;atari;avatar;awesome;awwmuffin;baka;bandaid;bane;baseball;basketball;batman;beats;belarus;belgium;bender;bert;bielarus;bitcoin;black widow;blobfish;bluh;bobross;bobsaget;boo;boogie2988;borg;bp;breakfast;breizh;buckballs;burgundy;butters;byzantium;c;catalonia;catalunya;catman;chaika;charmander;chechenya;checkpointplus;cheese;chickfila;chocolate;chrome;chucknorris;cirno;cj;cling on;coca cola;cokacola;colombia;colombiaa;controless;converse;cookie;coookie;cornella;cornellà;coruja;creeper;creepydoll;csfb;cuba;cyprus;czech;czechia;czechrepublic;darksideofmoon;deadpool;deal with it;deathly hallows;deathstar;demon;derp;desu;dhole;dickbutt;doge;doggie;dolan;domo;domokun;dong;donut;doraemon;dreamcast;drunken;ebin;egg;egoraptor;egypt;eksi;electrokitty;epicface;expand;eye;facebook;fast forward;fastforward;fbi;fidel;fiji;finn;firefox;fishies;flash;florida;fnatic;fnaticc;foe;forocoches;freeman;freemason;friesland;frogout;fuckfacebook;gaben;gabenn;garfield;gaston;generikb;getinmybelly;getinthebox;gimper;github;giygas;gnomechild;gonzo;grammar nazi;grayhat;grima;grumpy;hagrid;halflife;halflife3;halo;handicapped;hap;hatty;hawaii;hawkeye;hebrew;heisenburg;helix;hipsterwhale;hispachan;hitler;homestuck;honeycomb;hosokawa;hue;hydro;iceland;ie;illuminati;illuminatiii;imaqtpie;imgur;imperial japan;imperialists;imperialjapan;instagram;iron man;isaac;isis;isreal;itchyfeetleech;ivysaur;jahrein;james bond;java;jew;jewnose;jimmies;jupiter;kalmar union;kame;kappa;kenny;kingdomoffrance;kingjoffrey;kirby;kitty;klingon;knights templar;knightstemplar;knowyourmeme;kurdistan;kyle;ladle;le snake;lenny;lgbt;liberland;libertyy;liechtenstien;linux;llessur;loadingreadyrun;loki;love;luigi;macedonia;malta;mario;mars;maryland;masterball;mastercheif;mcdonalds;meatboy;meatwad;megamilk;mike tyson;mike;mlg;moldova;mortalkombat;mr burns;mr.bean;mr.popo;n64;naga;nasa;nauru;nazi;nick fury;nick;nickelodeon;nipple;northbrabant;northernlion;nosmoking;notch;nsa;obama;obey;osu;ouch;palau;pandaexpress;pedo;pedobear;peka;penguin;pepe;pepsi;pewdiepie;pi;pig;piggy;pika;pinkfloyd;pinkstylist;pirate;piratebay;pizza;pizzaa;playstation;poop;potato;pt;quantum leap;question;rageface;retard smile;rewind;rockstar;rolfharris;roomba;rss;ryukyu;s.h.e.i.l.d;samoa;satan;scream;seal;serbia;sharingan;shell;shine;shrek;sinistar;sir;skull;skype;skyrim;slack;slovakia;slovenia;slowpoke;smash;snafu;snapchat;soccer;soliare;solomid;somalia;space ace;space;spawn;spiderman;spongegar;spore;spqr;spy;squirtle;stalinjr;star wars rebel;starbucks;starchild;starrynight;stitch;stupid;summit1g;sunface;superman;taco;teamfortress;thor;tintin;tonga;transformer;transformers;triforce;trollface;tubbymcfatfuck;turkey;tv;twitch;twitter;uguu;ukip;uppercase;uruguay;utorrent;vatican;vietnam;virus;voat;voyager;wakawaka;wales;walrus;wazowski;wewlad;white  light;windows;wit my woes;wwf;wykop;xsk;ycm;yinyang;ylilauta;ylilautaa;yoba;yobaa;yobaaa;yourmom;youtube;zeon;zimbabwe;zoella;zoidberg";

var showsh = false;
var showt = localStorage.getItem("showt")=="true";

var ldown = false;

var showfps = false;
var showpio = false; //packets in/out per second


if(showt===null){localStorage.setItem("showt","true");showt=true;}

setInterval(function(){if(showsh)DrawStats(false);if(showt)count();},300);

var gamejs = "", modBlocking = true;
var tester = document.getElementsByTagName("script");
var i = 0, main_out_url = document.location.protocol+"//agar.io/main_out.js", discovered_mainouturl = 0;
var W = '';
var Ja = '';
var b = '';
var c3eg2 = '';
var in_game = false;
var pandb = '';		
/*bgm*/
var bgmusic = '';
$('#audiotemplate').clone()[0];
var tracks = ['BotB 17936 Isolation Tank.mp3','BotB 17934 bubblybubblebubblingbubbles.mp3','BotB 17935 bloblobloblboblbolboblboblbobolbloblob.mp3','BotB 17937 Woofytunes.mp3','BotB 17938 slowgrow.mp3'];
/*sfx*/
//sfx play on event (only one of each sfx can play - for sfx that won't overlap with itself)
var ssfxlist = [
    'spawn',
    'gameover'
];
var ssfxs = [];
for (i=0;i<ssfxlist.length;i++) {
	var newsfx = new Audio("//skins.agariomods.com/botb/sfx/" + ssfxlist[i] + ".mp3");
	newsfx.loop = false;
	ssfxs.push(newsfx);
}
function sfx_play(id) {
	if (document.getElementById("sfx").value==0) return;
	var event = ssfxs[id];
	event.volume = document.getElementById("sfx").value;
    event.play();
}

//sfx insertion on event (multiple of same sfx can be played simultaneously)
var sfxlist = [
    'pellet',
    'split',
    'eat',
    'bounce',
    'merge',
    'virusfeed',
    'virusshoot',
    'virushit'
];
var sfxs = [];
for (i=0;i<sfxlist.length;i++) {
	var newsfx = new Audio("//skins.agariomods.com/botb/sfx/" + sfxlist[i] + ".mp3");
	newsfx.loop = false;
	newsfx.onended = function() {
        $(this).remove();
    }
	sfxs.push(newsfx);
}
function sfx_event(id) {
    if (document.getElementById("sfx").value==0) return;
	var event = jQuery.clone(sfxs[id]);
	event.volume = document.getElementById("sfx").value;
	event.load();
    event.play();
}
/* lets start to deal with regressions */
var test = 0;
var passed = 0;
var failed = 0;

var chart_update_interval = 10;
var chart = null;
var chart_data = [];
var chart_counter = 0;
var chart_s = '';
var chart_m = '';
var chart_G = '';
var chart_Na= '';
var chart_k = '';

for (i=0; i<tester.length; i++ ){
	src = tester[i].src;
	if (src.substring(0, main_out_url.length ) == main_out_url) {
		discovered_mainouturl = src.replace("//agar.io/","");
	}
}

if(discovered_mainouturl != 0) {
	httpGet(discovered_mainouturl, function(data) {
		gamejs = "window.agariomods = " + data.replace("socket open","socket open (agariomods.com mod in place)");
		gamejs = gamejs.replace(/\n/g, "");
		offset = gamejs.search("..=\"poland;");
		Ja =  gamejs.substr(offset,2);
		offset = gamejs.search(".....src=\"skins");
		b = gamejs.substr(offset+2,1);
		offset = gamejs.search(".."+b+"..src");
		W = gamejs.substr(offset,1);
		//this.P&&b.strokeText
		var components = /this.(.)&&b.strokeText/.exec(gamejs);
		pandb = components[1];
		var components = /strokeText\((.{1,14})\);/.exec(gamejs);
		c3eg2 = components[1];
		var components = /\((.)\=..x,.\=..y\)/.exec(gamejs);		
		chart_s = components[1];
		var components = /\(.\=(.).x,.\=..y\)/.exec(gamejs);
		chart_m = components[1];
		var components = /(.)\=Math.max\(.,..\(\)\);/.exec(gamejs);
		chart_G = components[1];
		var components = /.\=Math.max\(.,(..)\(\)\);/.exec(gamejs);
		chart_Na = components[1];
		var components = /(.)\[0\]\.name\&\&\(/.exec(gamejs);
		chart_k = components[1];
		//console.log ("chartmod info: chart_m = "+chart_m+";  chart_s = "+chart_s+"; chart_G = "+chart_G+"; chart_Na = "+chart_Na+"; chart_k = "+chart_k);
		agariomodsRuntimeInjection();
	});
}

// XMLHttp, because apparently raven is doing funky stuff with jQuery
function httpGet(theUrl, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, true);
	xmlHttp.send(null);
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			callback(xmlHttp.responseText);
		}
	};
}
function agariomodsRuntimeInjection() {
	var script = document.createElement("script");
	script.src='//cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js';
        document.head.appendChild(script);
	var tester = document.getElementsByTagName("head");
	var oldhtml = tester[0].innerHTML;
	oldhtml = oldhtml.replace('width:350px;', '');
	oldhtml = oldhtml.replace('-webkit-transform:translate(-50%,-50%);', '');
	oldhtml = oldhtml.replace('-ms-transform:translate(-50%,-50%);', '');
	oldhtml = oldhtml.replace('transform:translate(-50%,-50%);', '');
	oldhtml = oldhtml.replace('top:50%;left:50%;','margin:10px;');
	tester[0].innerHTML = oldhtml;
	var script = document.createElement("script");
	agariomodsRuntimePatches();
	script.innerHTML = gamejs;
	document.head.appendChild(script);
	agariomodsRuntimeHacks();
	bgmusic = $('#audiotemplate').clone()[0];
    bgmusic.src = "//skins.agariomods.com/botb/" + tracks[Math.floor(Math.random() * tracks.length)];
    bgmusic.load();
    bgmusic.loop = false;
    bgmusic.onended = function() {
        var track = tracks[Math.floor(Math.random() * tracks.length)];
        bgmusic.src = "//skins.agariomods.com/botb/" + track;
        bgmusic.play();
    }
	window.onbeforeunload = function() {
		return 'Are you sure you want to quit agar.io?';
	};
	// as a trackpad user, this fix should reduce the frequency at which I am killed.
	$("#canvas").on('mousedown', function(event){
		event.preventDefault();
	});
	$("#chart-container").css("pointerEvents", "none");
	$("#chart-container-agariomods").css("pointerEvents", "none");
	$("#fps-agariomods").css("pointerEvents", "none");
	$("#pi-agariomods").css("pointerEvents", "none");

}
function agariomodsRuntimePatches() {
	gamejs_patch(")&&this",")&&(this","test");
	gamejs_patch(/\w>\w\/1\.1\?.*-50%\)"\);/,"","fixing menu on resize");
		gamejs_patch(';reddit;', ';reddit;'+ourskins+';', "add our skinlist to the original game skinlist.");
        gamejs_patch(b+'=this.name.toLowerCase();', b+'=this.name.toLowerCase();var agariomods="";var ourskins = "'+ourskins+'";if(('+b+'.length >0) && (ourskins.split(";").indexOf('+b+')>-1)) {agariomods="//skins.agariomods.com/i/"+'+b+'+".png";} else if ('+b+'.substring(0, 2) == "i/" && document.getElementById("imgur").checked) {agariomods="//i.imgur.com/"+this.name.substring(2)+".jpg";} else if (document.getElementById("imgur").checked) {agariomods="//agar.io/skins/" + this.name.toLowerCase() + ".png";}', "add check for which skin mode we are in. be it no skin, default skin, imgur skin, or an agariomods skin.");
		gamejs_patch('xa=!1', 'zz=!1,yq=!1,xx=!1,xz=!1,xa=!1', "adding variables");
        gamejs_patch(W +'['+b+'].src="skins/"+'+b+'+".png"', W+'['+b+'].src=agariomods', "check for agariomods img src variable");
        gamejs_patch("this."+pandb+"&&b.strokeText("+c3eg2+");b.fillText("+c3eg2+")", "if (String(c).substring(0, 2) != \"i/\") {this."+pandb+"&&b.strokeText("+c3eg2+");b.fillText("+c3eg2+")}", "add imgur check for hiding username when using imgur id aka c3eg2");
        gamejs_patch(b+"=this.name.toLowerCase();", b+"=this.name.toLowerCase(); if ("+b+".substring(0, 2) == \"i/\") {" +Ja+ "+="+b+";} ;", "add imgur check #2.");
    gamejs = addChartHooks(gamejs);
    gamejs = addOnCellEatenHook(gamejs);
	gamejs = addTeamMassHook(gamejs);
	gamejs = addCanvasBGHook(gamejs);
	gamejs = addVirusColorHook(gamejs);
	gamejs = addFunctions(gamejs);
    gamejs = addOnShowOverlayHook(gamejs);
    gamejs = addOnHideOverlayHook(gamejs); //Because I don't want to detect when we hide it, only when the game does.
    gamejs = addLeaderboardHook(gamejs);
	gamejs = addConnectHook(gamejs); 
	gamejs = addRecieveHook(gamejs);
	gamejs = addOnSendHook(gamejs);
    gamejs = addOnDrawHook(gamejs);
	//gamejs = gamejs.replace(/;/g, '\n');
	console.log("Testing complete, "+passed+" units passed and "+failed+" units failed.");
	if (failed) console.log(new Error("UNIT FAILED"));
}
function gamejs_patch(search, replace, purpose) {		
        gamejs = gamejs.replace(search,replace);		
        testCondition((-1 != gamejs.indexOf(replace)), test++, purpose);		
}
function testCondition (condition, id, comment) {
        if(condition) {
                console.log("test: #"+id+" PASSED - "+ comment);
                passed++;
        } else {
                console.error("test: #"+id+" FAILED - "+ comment);
		failed++;
        }
}


function agariomodsRuntimeHacks() {
	jQuery('#helloDialog').css({left: '5px'});
	jQuery('#helloDialog').css({top: '5px'});
	jQuery('#helloDialog').css({margin: '0px'});
	jQuery('#helloDialog').css({marginLeft: 'auto'});
	jQuery('#helloDialog').css({marginRight: 'auto'});
//   opacity: 0.5;
//

jQuery('#helloDialog').css({opacity: '0.85'});	
jQuery('#helloDialog').css({width: '450px'});
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
	document.body.style.backgroundAttachment = "fixed";
	
	var nodeDiv = document.createElement("div");
	$( document ).ready(function() {
		hd = document.getElementById("helloDialog");
		cachedhd = hd.innerHTML;
		hd.innerHTML = cachedhd.replace("<center>Agar.io</center>", "<a target=\"_blank\" style=\"position:absolute; padding-left:435px;top:-10px; z-index: -1; height:120px;\" href=\"https://www.reddit.com/r/Agario/\"><img src=\"//i.imgur.com/TkTWOrc.png\" height=\"120px\"/></a>");
	});
	document.getElementById("nick").placeholder = "agariomods.com";
	nodeDiv.id = "includedContent";
	nodeDiv.style.width = "400px"
	nodeDiv.style.backgroundColor = "#000000";
	nodeDiv.style.zIndex = 999;
	nodeDiv.style.position = "relative";
	nodeDiv.style.padding = "8px";
	nodeDiv.style.borderRadius = "5px";
	nodeDiv.style.color = "#dddddd";
	nodeDiv.style.margin = "10px";
	nodeDiv.style.marginTop = "0";
	nodeDiv.style.maxHeight = "250px"; //The settings and the ad are being pushed down too far on some screens (1366*768). ~Mevin1
	nodeDiv.style.overflow = "auto"; //add scroll bar
	nodeDiv.innerHTML += '1.9.5: Go catch up with the <a target="_blank" href="http://agariomods.com/documentation.html">Documentation</a><br><h4><a href="http://www.agariomods.com/help.html" target="_blank"><font color="pink">CLICK HERE FOR HELP</font></a></h4>\
        <div style="background-color: #ffffff; color: #000000; padding: 2px; margin: 0px;">\
                <small><b>Disable ad blockers</b>&nbsp;- They are breaking the game and our modifications in random and unexpected ways.</small>\
        </div>';
	jQuery('#region').parent().get(0).appendChild(nodeDiv);
	jQuery(".form-group:first").replaceWith('<br>');
	var selector = jQuery('#region');
	var playBtn = jQuery('#playBtn');
	var nodeInput = document.createElement("span");
	var nodeSpan = document.createElement("span");
	var nodeBr = document.createElement("br");
	var nodeLinks = document.createElement("div");
	nodeLinks.innerHTML = "<big><a href='http://skins.agariomods.com' target='_blank'>SKINS</a> - <a href='http://agariomods.com/chat.html' target='_blank'>CHAT</a> - <a href='http://agariomods.com' target='_blank'>WEBSITE</a> - <a href='http://agariomods.com/help.html' target='_blank'>HELP</a> - <a href onclick=\"alert('---HOTKEYS---\\nHold Z - Show Stats In-Game\\nSuicide - Alt+Q\\nToggle Benchmarker - T\\nClear Benchmarks - Alt+T\\nFPS Counter - Alt+1\\nPackets In/Out Per Second - Alt+2\\nTry Script Lag Recover - Alt+R');return false;\" target='_blank'>HOTKEYS</a></big>";
	nodeLinks.style.marginLeft='10px';
	nodeSpan.className = "glyphicon glyphicon-refresh btn btn-info";
	nodeSpan.style.fontSize = "1.5em";
	nodeSpan.style.cssFloat = "left";
	nodeSpan.style.paddingTop = "2px";
	nodeSpan.style.width = "15%";
	nodeSpan.style.height = "33px";
	nodeSpan.addEventListener("click", function (e) {
		document.getElementById("iphack").value=document.getElementById("iphack").value.replace(/\s+/g, '');
		var ip = document.getElementById("iphack").value.replace("ws://","");
		if(ip.length>8)connect("ws://"+ip);
	});
//	nodeInput.className = "form-control";
	nodeInput.id = "iphack"
	nodeInput.style.width = "85%";
	nodeInput.style.cssFloat = "left";
	nodeInput.style.cssClear = "right";
	nodeInput.style.padding = "5px;";
	nodeInput.style.margin = "5px;";	
	nodeInput.style.border = "2px solid green";
	nodeInput.innerHTML = "Zeach, the owner of Agar.io has told us to remove this particular feature, he has banned the ability to connect to a server directly by it's IP which breaks all mods. ";
	jQuery('#locationUnknown').prepend(nodeLinks);
	jQuery(playBtn).parent().get(0).appendChild(nodeInput);
	jQuery(playBtn).parent().get(0).appendChild(nodeSpan);
	jQuery(playBtn).parent().get(0).appendChild(nodeBr);
	jQuery(playBtn).parent().prepend("<b>Current Server IP: </b><span id='ip'></span>");
	var nodeAudio = document.createElement("audio");		
	nodeAudio.id = 'audiotemplate';		
	jQuery(playBtn).parent().get(0).appendChild(nodeAudio);
	jQuery('#playBtn').off();
	$('.btn-needs-server').prop('disabled', true);
	jQuery('#playBtn').click(function() {
		setNick(document.getElementById('nick').value);
		return false;
	});
	jQuery('.form-group:first').after( "<hr style='margin: 7px; border-width: 2px'>" );
	jQuery('.form-group:first').removeAttr("class");
}

	
			



/* begin mikeys new code */
var chart_update_interval = 10;

var chart = null;
var chart_data = [];
var chart_counter = 0;
var stat_canvas = null;

var stats = null;
var my_cells = null;
var my_color = "#ff8888";
var pie = null;
var stats_chart;

var display_chart = LS_getValue('display_chart', 'true') === 'true';
var display_stats = LS_getValue('display_stats', 'false') === 'true';

/////////////////////////////////////////////////////////

var g_stat_spacing = 0;
var g_display_width = 220;
var g_layout_width = g_display_width;

////////////////////////////////////////////////////////////////
function addChartHooks(script) {
    var match = script.match(/max\((\w+),(\w+)\(/);
    var high = match[1];
    var current = match[2];
    match = script.match(/1==(\w+)\.length&&\(/);
    var my_cells = match[1];
    var split = script.split(match[0]);
    script = split[0] + '1=='+my_cells+'.length&&(OnGameStart('+my_cells+'),' + split[1];
    split = script.split(script.match(/"Score: "\+~~\(\w+\/100\)/)[0]);
    match = split[1].match(/-(\d+)\)\);/);
    var subSplit = split[1].split(match[0]);
    split[1] = subSplit[0] + '-'+match[1]+'),('+my_cells+'&&'+my_cells+'[0]&&OnUpdateMass('+current+'())));' + subSplit[1];
    return split[0] + '"Current: "+~~('+current+'()/100)+"  High: "+~~('+high+'/100)' + split[1];
}

function addTeamMassHook(script) {
	var match = script.match(/1==(\w+)\.length&&\(/);
    var my_cells = match[1];
	var match = script.match(/;(\w+)\.(\w+)\(this\.name\)/);
	var split = script.split(match[0]);
	var avar = match[2];
	script = split[0]+";"+match[1]+'.'+match[2]+'(this.name);if(yq){if(p[0]&&N==":teams"&&'+my_cells+'.indexOf(this)==-1){if(this.color.substr(p[0].color.search("ff"),2)=="ff"){this.k.'+match[2]+'(this.name+" ["+~~(this.size*this.size/100)+"]");}}}'+split[1];
	var match = script.match(/indexOf\((\w+)\)\)\)\{/);
	var split = script.split(match[0]);
	return split[0]+'indexOf('+match[1]+')))||(this.size>=32&'+my_cells+'[0]&&N==":teams"&&!this.d)){if(yq){if(this.name==""){this.k=new ka(this.h(),"#FFFFFF",true,"#000000");this.k.'+avar+'(this.name);}};'+split[1];
	var split = script.split(match[0]);
}


function addFunctions(script) {
    var match = script.match(/((\w)\.setAcid)/);
	var split = script.split(match[0]);
	script = split[0]+match[2]+'.Suicide=function(){var b=new ArrayBuffer(1);(new DataView(b)).setUint8(0, 20);q.send(b)};'+match[2]+'.setVColors=function(a){zz=a};'+match[2]+'.setTeamMass=function(a){yq=a;if(a){jQuery(\'#names\').attr(\'checked\',false);check(document.getElementById(\'names\'));}};'+match[2]+'.setBG=function(a){xx=a;if(a){var url=localStorage.getItem("bgurl");if(url==null){url=""};var promp=prompt("Image URL",url);if(null==promp){jQuery("#bgimg").attr("checked",false);check(document.getElementById("bgimg"));xx=!a;return;}localStorage.setItem("bgurl",promp);jQuery("#acid").attr("checked",false);check(document.getElementById("acid"));document.body.style.backgroundImage=\'url("\'+promp+\'")\';xz=confirm("Show Grid Lines?");}};'+match[1]+split[1]
	var split = script.split("setNames=function(a){");
	return split[0]+"setNames=function(a){if(!a){jQuery(\'#tmass\').attr(\'checked\',false);check(document.getElementById(\'tmass\'));}"+split[1];
}

function addCanvasBGHook(script) {
    var match = script.match(/rRect\(0,0,(\w),(\w)\)/);
	var split = script.split(match[0]);
	script = split[0]+'rRect(0,0,'+match[1]+','+match[2]+');xx&&!xz?g.clearRect(0, 0, r, s):'+split[1].substr(1);
    var match = script.match(/BFF";/);
	var split = script.split(match[0]);
	return split[0]+'BFF";xx&&xz?g.clearRect(0,0,r,s):'+split[1];
}

function addVirusColorHook(script) {
    var match = script.match(/(\?\(\w\.fillStyle=")/);
    var split = script.split(match[0]);
    return split[0]+'||zz&&this.d'+match[1]+split[1]   
}

function addLeaderboardHook(script) {
    var match = script.match(/(fillStyle="#FFAAAA")(.+)(\w+)(\+1\+"\. ")/);
    var split = script.split(match[0]);
    return split[0]+match[1]+',OnLeaderboard('+match[3]+'+1)'+match[2]+match[3]+match[4]+split[1]   
}

function addOnCellEatenHook(script) {
			 //   null!=p&&p.T();
			   // l&&k&&(k.S()
//    var match = script.match(/(\w+)&&(\w+)&&\((\w+)\.S/);
	var match = script.match(/(\w+)&&(\w+)&&\((\w+)\.(\w+)/);
    var split = script.split(match[0]);
    return split[0] + match[1] + '&&' + match[2] + '&&(OnCellEaten('+match[1]+','+match[2]+'),' + match[3] + '.' + match[4] + split[1];
}

function addOnShowOverlayHook(script) {
    var match = script.match(/\w+\("#overlays"\)\.fadeIn\((\w+)\?\w+:\w+\);/);    
    var split = script.split(match[0]);
    return split[0] + match[0] + 'OnShowOverlay(' + match[1] + ');' + split[1];
}

function addConnectHook(script) {
    var match = script.match(/console\.log\("Connecting to "\+a\);/);
    var split = script.split(match[0]);
    return split[0] + match[0] + 'document.getElementById("ip").innerHTML=a.replace(/wss?:\\/\\//,"");' + split[1];
}

function addRecieveHook(script) {
//		  	     Za(new DataView(a.data))    
var match = script.match(/\w\(new DataView\(..data\)\)/);    

    var split = script.split(match[0]);
    return split[0] + match[0] + ';Recieve();' + split[1];
}

function addOnSendHook(script) {
    var match = script.match(/\w+\.send\(\w+\.buffer\)/);    
    var split = script.split(match[0]);
    return split[0] + match[0] + ';OnSend();' + split[1];
}

function addOnHideOverlayHook(script) {
    var match = script.match(/\w+\("#overlays"\)\.hide\(\)/);    
    var split = script.split(match[0]);
    return split[0] + match[0] + ';OnHideOverlay()' + split[1];
}

function addOnDrawHook(script) {
    var match = script.match(/\w+\.width&&(\w+)\.drawImage\(\w+,\w+-\w+\.width-10,10\);/);
    var split = script.split(match[0]);
    return split[0] + match[0] + 'OnDraw(' + match[1] + ');' + split[1];
}

var __STORAGE_PREFIX = "mikeyk730__";

function LS_getValue(aKey, aDefault) {
	var val = localStorage.getItem(__STORAGE_PREFIX + aKey);
	if (null === val && 'undefined' != typeof aDefault) return aDefault;
	return val;
}
 
function LS_setValue(aKey, aVal) {
	localStorage.setItem(__STORAGE_PREFIX + aKey, aVal);
}

function GetRgba(hex_color, opacity)
{
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hex_color);
    return "rgba("+parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16)+","+opacity+")";
}

function secondsToHms(d) 
{
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}
////////////////////////////////////////////////////////////////
jQuery(document).ready(function() 
{
    jQuery('body').append('<div id="chart-container" style="display:none; position:absolute; height:176px; width:300px; left:10px; bottom:44px"></div>\
			   <div id="chart-container-agariomods" style="opacity: 0.7; position:absolute; height:20px; width:300px; right:10px; bottom:10px;">&nbsp;agariomods.com - modding <b>without</b> cheating</div>\
			   <div id="debug" style="position:absolute; top:5px; left:10px;">\
			   <div id="fps-agariomods" style="color: white; display: none; background-color: rgba(0,0,0,.5); padding:0 4px;"><b>FPS: </b><span>0</span></div>\
			   <div id="pio-agariomods" style="color: white; display: none;  background-color: rgba(0,0,0,.5); padding:0 4px;"><b>PI/O/s: </b><span>0</span>/<span>0</span></div>\
			   </div>\
			   <img src="http://kelvin.gq/agariomods?'+Date.now()+'" style="display:none;">');
	jQuery('#instructions').remove();
	//jQuery('.glyphicon-cog').addClass("glyphicon-refresh")
	//jQuery('.glyphicon-cog').removeClass("glyphicon-cog");
	//jQuery('.btn-settings').attr('onclick','connect("ws://"+document.getElementById("ip").innerHTML);if(in_game)OnShowOverlay(false);');
	//jQuery('.btn-settings').attr('type','button');
	//jQuery('#gamemode').removeAttr('required');
	//jQuery('.btn-settings').removeClass("btn-settings");
	jQuery('.btn-settings').hide();
	jQuery('#settings').show();
  	var checkbox_div = jQuery('#settings input[type=checkbox]').closest('div');
    checkbox_div.append('<label><input type="checkbox" id="acid" onchange="setAcid($(this).is(\':checked\'));if($(this).is(\':checked\')){$(\'#bgimg\').attr(\'checked\',false);check(document.getElementById(\'bgimg\'));}">Acid</label>');
	checkbox_div.append('<label><input type="checkbox" onchange="if(this.checked){jQuery(\'#chart-container\').show()}else{jQuery(\'#chart-container\').hide()}">Show chart</label>');
	checkbox_div.append('<label><input type="checkbox" onchange="setVColors($(this).is(\':checked\'));">Colorless Viruses</label>');
	checkbox_div.append('<label><input id="imgur" type="checkbox">Imgur Skins</label>');
	checkbox_div.append('<label><input type="checkbox" id="tmass" onchange="setTeamMass($(this).is(\':checked\'));">Show Teamed Mass</label>');
	checkbox_div.append('<label><input id="bgimg" type="checkbox" onchange="setBG($(this).is(\':checked\'));">Set Background</label>');
	checkbox_div.append('<div id="sliders"><label>SFX<input id="sfx" type="range" value="0" step=".1" min="0" max="1"></label><label>BGM<input type="range" id="bgm" value="0" step=".1" min="0" max="1" oninput="volBGM(this.value);"></label></div>');    jQuery('#overlays').append('<div id="stats" style="opacity: 0.85; position: absolute; top:330px; left: 460px; width: 480px; display: none; background-color: #FFFFFF; border-radius: 15px; padding: 5px 15px 5px 15px; transform: translate(0,-50%); white-space: nowrap; overflow:hidden;"><div id="statArea" style="vertical-align:top; width:250px; display:inline-block;"></div><div id="pieArea" style="vertical-align: top; width:200px; height:150px; display:inline-block; vertical-align:top"> </div><div id="gainArea" style="width:500px;  vertical-align:top"></div><div id="lossArea" style="width:500px; "></div><div id="chartArea" style="width:450px; display:inline-block; vertical-align:top"></div></div>');
    jQuery('#stats').hide(0);   
	jQuery('#playBtn').width('74%');
});

function ResetChart() 
{
    chart = null;
    chart_data.length = 0;
    chart_counter = 0;
    jQuery('#chart-container').empty();    
}

function UpdateChartData(mass)
{
    chart_counter++;
    if (chart_counter%chart_update_interval > 0) 
		return false;
	
	chart_data.push({
        x: chart_counter,
        y: mass/100
    });
	return true;
}

function CreateChart(e, color, interactive)
{
    return new CanvasJS.Chart(e,{
        interactivityEnabled: interactive,
        title: null,
        axisX:{      
            valueFormatString: " ",
            lineThickness: 0,
            tickLength: 0
        },
        axisY:{
            lineThickness: 0,
            tickLength: 0,
            gridThickness: 2,
            gridColor: "white",
            labelFontColor: "white"
        },
        backgroundColor: "rgba(0,0,0,0.2)",
        data: [{
            type: "area",
            color: color,
            dataPoints: chart_data
        }]
    });
}

function UpdateChart(mass, color) 
{
	my_color = color;	
	if (chart === null)
		chart = CreateChart("chart-container", color, false);	
	if (UpdateChartData(mass) && display_chart)
		chart.render();     
	jQuery('.canvasjs-chart-credit').hide();
};

function ResetStats()
{
    stats = {
        pellets: {num:0, mass:0},
        w: {num:0, mass:0},
        cells: {num:0, mass:0},
        viruses: {num:0, mass:0},

        birthday: Date.now(),
        time_of_death: null,
        high_score: 0,
        top_slot: Number.POSITIVE_INFINITY,

        gains: {},
        losses: {},
    };
}

function OnGainMass(me, other)
{
    var mass = other.size * other.size;
    if (other.d){
        stats.viruses.num++;
        if (document.getElementById("gamemode").value!=":teams") stats.viruses.mass += mass; /*DONE: shouldn't add if game mode is teams. TODO: Find a better way of doing this. ~Mevin1*/
		sfx_event(7);
    }
    else if (Math.floor(mass) <= 400 && !other.name){
        stats.pellets.num++;
        stats.pellets.mass += mass;
		sfx_event(0);
    }
	/* heuristic to determine if mass is 'w', not perfect */
    else if (!other.name && mass <= 1444 && (mass >= 1369 || (other.x == other.ox && other.y == other.oy))){
		/*console.log('w', mass, other.name, other);*/
        if (other.color != me.color){ /*don't count own ejections, again not perfect*/
            stats.w.num++;
            stats.w.mass += mass;
        }
		sfx_event(2);
    }
    else { 
	    /*console.log('cell', mass, other.name, other);*/
        var key = other.name + ':' + other.color;
        stats.cells.num++;
        stats.cells.mass += mass;
        if (stats.gains[key] == undefined)
            stats.gains[key] = {num: 0, mass: 0};
        stats.gains[key].num++;
        stats.gains[key].mass += mass;
		sfx_event(2);
    }
}

function OnLoseMass(me, other)
{
    var mass = me.size * me.size;
    var key = other.name + ':' + other.color;
    if (stats.losses[key] == undefined)
        stats.losses[key] = {num: 0, mass: 0};;
    stats.losses[key].num++;
    stats.losses[key].mass += mass;
    sfx_event(2);
}

function DrawPie(pellet, w, cells, viruses)
{
    var total = pellet + w + cells + viruses;
    pie = new CanvasJS.Chart("pieArea", {
        title: null,
        animationEnabled: false,
        legend:{
            verticalAlign: "center",
            horizontalAlign: "left",
            fontSize: 12,
            fontFamily: "Helvetica"        
        },
        theme: "theme2",
        data: [{        
            type: "pie",       
            startAngle:-20,      
            showInLegend: true,
            toolTipContent:"{legendText} {y}%",
            dataPoints: [
                {  y: 100*pellet/total, legendText:"pellets"},
                {  y: 100*cells/total, legendText:"cells"},
                {  y: 100*w/total, legendText:"w"},
                {  y: 100*viruses/total, legendText:"viruses"},
            ]
        }]
    });
	pie.render();   
}

function GetTopN(n, p)
{
	var r = [];
	var a = Object.keys(stats[p]).sort(function(a, b) {return -(stats[p][a].mass - stats[p][b].mass)});
    for (var i = 0; i < n && i < a.length; ++i){
        var key = a[i];
        var mass = stats[p][key].mass;
        var name = key.slice(0,key.length-8);
        if (!name) name = "An unnamed cell";
        var color = key.slice(key.length-7);
		r.push({name:name, color:color, mass:Math.floor(mass/100)});
    }	
	return r;
}

function AppendTopN(n, p, list)
{
	var a = GetTopN(n,p);
    for (var i = 0; i < a.length; ++i){
        var text = '<bdi>'+a[i].name + '</bdi> (' + (p == 'gains' ? '+' : '-') + a[i].mass + ' mass)';
        list.append('<li style="font-size: 12px; "><div style="width: 10px; height: 10px; border-radius: 50%; margin-right:5px; background-color: ' + a[i].color + '; display: inline-block;"></div>' + text + '</li>');
    }
	return a.length > 0;
}

function DrawStats(game_over)
{
    if (!game_over != in_game) return;
            
	jQuery('#statArea').empty();
    jQuery('#pieArea').empty();
    jQuery('#gainArea').empty();
    jQuery('#lossArea').empty();
    jQuery('#chartArea').empty();
    jQuery('#stats').show();
    
    if (game_over){
        sfx_play(1);
		StopBGM();
	}
	stats.time_of_death = Date.now();
    var time = stats.time_of_death ? stats.time_of_death : Date.now();
    var seconds = (time - stats.birthday)/1000;
	
	var list = jQuery('<ul>');
    list.append('<li style="font-size: 12px; ">Game time: ' + secondsToHms(seconds) + '</li>');
    list.append('<li style="font-size: 12px; ">High score: ' + ~~(stats.high_score/100) + '</li>');
    if (stats.top_slot == Number.POSITIVE_INFINITY){
        list.append('<li style="font-size: 12px; ">You didn\'t make the leaderboard</li>');
    }
    else{
        list.append('<li style="font-size: 12px; ">Leaderboard max: ' + stats.top_slot + '</li>');
    }
    list.append('<li style="font-size: 12px; padding-top: 15px">' + stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 12px; ">' + stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 12px; ">' + stats.w.num + " masses eaten (" + ~~(stats.w.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 12px; ">' + stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ' mass)</li>');
    jQuery('#statArea').append('<b>Game Summary</b>');
    jQuery('#statArea').append(list);
	
    DrawPie(stats.pellets.mass, stats.w.mass, stats.cells.mass, stats.viruses.mass);

	jQuery('#gainArea').append('<b>Top Gains</b>');
	list = jQuery('<ol>');
    if (AppendTopN(5, 'gains', list))
		jQuery('#gainArea').append(list);
	else
		jQuery('#gainArea').append('<ul><li style="font-size: 12px; ">You have not eaten anybody</li></ul>');
	 
    jQuery('#lossArea').append('<b>Top Losses</b>');
	list = jQuery('<ol>');
	if (AppendTopN(5, 'losses', list))
		jQuery('#lossArea').append(list);
    else
		jQuery('#lossArea').append('<ul><li style="font-size: 12px; ">Nobody has eaten you</li></ul>');
	
	if (stats.time_of_death !== null){
		jQuery('#chartArea').width(450).height(150);
		stat_chart = CreateChart('chartArea', my_color, true);
		stat_chart.render();
	}
	else {
		jQuery('#chartArea').width(450).height(0);
	}
jQuery('.canvasjs-chart-credit').hide();
}

var styles = {
	heading: {font:"20px Ubuntu", spacing: 41, alpha: 1},
	subheading: {font:"18px Ubuntu", spacing: 31, alpha: 1},
	normal: {font:"12px Ubuntu", spacing: 21, alpha: 0.6}
}

function AppendText(text, context, style)
{
	context.globalAlpha = styles[style].alpha;
	context.font = styles[style].font;
	g_stat_spacing += styles[style].spacing;
    
    var width = context.measureText(text).width;
    g_layout_width = Math.max(g_layout_width, width);    
	context.fillText(text, g_layout_width/2 - width/2, g_stat_spacing);
}

function RenderStats(reset)
{
	if (reset) g_layout_width = g_display_width;
	if (!display_stats || !stats) return;
	g_stat_spacing = 0;	
	
	var gains = GetTopN(3, 'gains');
	var losses =  GetTopN(3, 'losses');
	var height = 30 + styles['heading'].spacing + styles['subheading'].spacing * 2 + styles['normal'].spacing * (4 + gains.length + losses.length);
		
	stat_canvas = document.createElement("canvas");
	var scale = Math.min(g_display_width, .3 * window.innerWidth) / g_layout_width;
	stat_canvas.width = g_layout_width * scale;
    stat_canvas.height = height * scale;
	var context = stat_canvas.getContext("2d");
	context.scale(scale, scale);
		
    context.globalAlpha = .4;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, g_layout_width, height);
        
    context.fillStyle = "#FFFFFF";
	AppendText("Stats", context, 'heading');
		
	var text = stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ")";
	AppendText(text, context,'normal');		
	text = stats.w.num + " mass eaten (" + ~~(stats.w.mass/100) + ")";
	AppendText(text, context,'normal');
    text = stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ")";
	AppendText(text, context,'normal');
	text = stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ")";
	AppendText(text, context,'normal');
		
	AppendText("Top Gains",context,'subheading');
	for (var j = 0; j < gains.length; ++j){
		text = (j+1) + ". " + gains[j].name + " (" + gains[j].mass + ")";
		context.fillStyle = gains[j].color;			
		AppendText(text, context,'normal');
	}
		
	context.fillStyle = "#FFFFFF";
	AppendText("Top Losses",context,'subheading');
	for (var j = 0; j < losses.length; ++j){
		text = (j+1) + ". " + losses[j].name + " (" + losses[j].mass + ")";
		context.fillStyle = losses[j].color;			
		AppendText(text, context,'normal');
	}
}  

jQuery(window).resize(function() {
    RenderStats(false);
});

window.OnGameStart = function(cells)
{
	initbench(false);
	in_game = true;
    my_cells = cells;
    ResetChart();
    ResetStats();
    RenderStats(true);
	DrawStats(false);
	if (kd == true) {
		showsh = false;
		document.getElementById("overlays").style.display = "none";
		document.getElementById("overlays").style.backgroundColor = "rgba(0,0,0,.498039)";
		document.getElementById("overlays").style.pointerEvents = "auto";
		document.getElementById("stats").style.opacity = 0.85;
		document.getElementById("helloDialog").style.display = "block";
		kd = false;
	}
	StartBGM();
	sfx_play(0);
}

window.StartBGM = function ()
{
    if (document.getElementById("bgm").value==0) return;
    if (bgmusic.src == "") bgmusic.src = "//skins.agariomods.com/botb/" + tracks[Math.floor(Math.random() * tracks.length)]; //i guess i'll leave this here ~mevin1
	bgmusic.volume = document.getElementById("bgm").value;
    bgmusic.play();
}

window.StopBGM = function ()
{
	if (document.getElementById("bgm").value==0) return;
	bgmusic.pause()
	bgmusic.src = "//skins.agariomods.com/botb/" + tracks[Math.floor(Math.random() * tracks.length)];
	bgmusic.load()
}

window.volBGM = function (vol)
{
    bgmusic.volume = document.getElementById("bgm").value;
}

window.OnShowOverlay = function(game_in_progress)
{
	bstyle(true);
	if (!game_in_progress) in_game = false;
    DrawStats(!game_in_progress);
	if (kd == true) {
		document.getElementById("overlays").style.display = "block";
		document.getElementById("overlays").style.backgroundColor = "rgba(0,0,0,.498039)";
		document.getElementById("overlays").style.pointerEvents = "auto";
		document.getElementById("stats").style.opacity = 1;
		document.getElementById("helloDialog").style.display = "block";
		kd = false;
	}
	if (in_game) {
		showsh = true;
		canvas.onmousedown(0,0);
	} 
	else
	{
		showsh = false;
		//document.getElementById("benchmarker").style.display = "none";
		//showt=false;
	}
}

var fired = false; //for some reason OnHideOverlay fires twice
window.OnHideOverlay = function()
{
	if (fired == true) {fired = false; return;} else {fired = true;} //Only continue on first fire
	bstyle(false);
	if (showsh == true) showsh = false;
}

window.OnUpdateMass = function(mass) 
{
    stats.high_score = Math.max(stats.high_score, mass);
    UpdateChart(mass, GetRgba(my_cells[0].color,0.4));
	benchcheck(mass);
}

window.OnCellEaten = function(predator, prey)
{
    if (!my_cells) return;

    if (my_cells.indexOf(predator) != -1){
        OnGainMass(predator, prey);
        RenderStats(false);
    }
    if (my_cells.indexOf(prey) != -1){
        OnLoseMass(prey, predator);
        RenderStats(false);
    }    
}

window.OnLeaderboard = function(position)
{
    stats.top_slot = Math.min(stats.top_slot, position);
}

window.OnDraw = function(context)
{
	if (showfps) document.getElementById("fps-agariomods").children[1].innerHTML = countFPS();
    display_stats && stat_canvas && context.drawImage(stat_canvas, 10, 10);   
}

window.Recieve = function()
{
	if (showpio) document.getElementById("pio-agariomods").children[1].innerHTML = countPI();
}

window.OnSend = function()
{
	if (showpio) document.getElementById("pio-agariomods").children[2].innerHTML = countPO();
}

window.countFPS = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var fps = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return fps;
  };
}());

window.countPI = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var packet = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      packet = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return packet;
  };
}());

window.countPO = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var packet = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      packet = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return packet;
  };
}());

window.onpageshow = function() {
	initbench(true);
	document.getElementById("bgimg").checked=false;
		jQuery('#helloDialog').css({transform: ''});
		jQuery('#helloDialog').css({scale: ''});
    $("div#settings label").change(function() {
        $("div#settings.checkbox input").each(function() {
			if (this.id=="bgimg")return;
            localStorage.setItem("setting"+$(this).parent().text().replace(" ","_"),this.checked);
        });
        $("div#settings input[type=range]").each(function() {
            localStorage.setItem("setting"+$(this).parent().text().replace(" ","_"),this.value);
        });
    });
	$("div#settings input").each(function() {
            check(this);
	});
}

window.check = function(elem){
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    elem.dispatchEvent(evt);
}

$(document).ready(function() {
	if (!localStorage.getItem("setting_Imgur Skins")) localStorage.setItem("settingImgur_Skins","true"); localStorage.setItem("settingShow_Chart","true");
	$("div#settings.checkbox input").each(function() {
		if (this.id=="bgimg")return;
		if ($(this).parent().text()==" No names")$(this).attr("id","names");
		$(this).attr("checked",(localStorage.getItem("setting"+$(this).parent().text().replace(" ","_")))=="true");
	});
	$("div#settings input[type=range]").each(function() {
		$(this).attr("value",(localStorage.getItem("setting"+$(this).parent().text().replace(" ","_"))));
	});
	});

var kd = false;
$(document).keydown(function(e) {
	//Stats Shortcut
	if (e.keyCode == 90) {
		if (kd == false && document.getElementById("overlays").style.display == 'none') {
			kd = true;
			document.getElementById("overlays").style.display = "block";
			document.getElementById("overlays").style.backgroundColor = "rgba(0,0,0,0)";
			document.getElementById("overlays").style.pointerEvents = "none";
			document.getElementById("stats").style.opacity = 1;
			document.getElementById("helloDialog").style.display = "none";
			showsh = true;
			DrawStats(false);
		}
	}
	//Benchmarker Shortcut
	if (e.keyCode == 84&&!e.altKey&&document.activeElement.type!="text") {
		showt = !showt;
		localStorage.setItem("showt",showt);
		document.getElementById("benchmarker").style.display = showt?"block":"none";
	}
	//Benchmarker Clear Shortcut
	if (e.keyCode == 84&&e.altKey) {
		deleteScores();
	}
	//FPS Hotkey
	if (e.altKey && e.keyCode == 49) {
		showfps = !showfps;
		document.getElementById("fps-agariomods").style.display = showfps?"block":"none";
	}
	//Packets In Per Second Hotkey
	if (e.altKey && e.keyCode == 50) {
		showpio = !showpio;
		document.getElementById("pio-agariomods").style.display = showpio?"block":"none";
	}
	//Suicide
	if (e.altKey && e.keyCode == 81 && in_game) {
		jQuery("#overlays").show()
		OnShowOverlay(false);
		Suicide();
	}
	//Firefox Fullscreen
	if (e.ctrlKey && e.keyCode === 70 && navigator.userAgent.match("Firefox")) {
		e.preventDefault();
		if (document.mozFullScreenElement)
		{
			document.mozCancelFullScreen();
		}
		else
		{
			document.getElementById("overlays").mozRequestFullScreen();
		}
	}
	//EXPERIMENTAL
	//Attempts to recover from lag by temporarily pausing Javascript
	//Alt+R
	if (e.keyCode == 82&&e.altKey) {
		if(ldown)return;
		ldown = true
		console.log("pausing");
		var currentTime = new Date().getTime();
		while (currentTime + 500 >= new Date().getTime()){} //0.5 Second Timeout
	}
});
$(document).keyup(function(e) {
	//Hide Stats
	if (e.keyCode == 90) {
		if (kd == true) {
			kd = false;
			document.getElementById("overlays").style.display = "none";
			document.getElementById("overlays").style.backgroundColor = "rgba(0,0,0,.498039)";
			document.getElementById("overlays").style.pointerEvents = "auto";
			document.getElementById("stats").style.opacity = 0.85;
			document.getElementById("helloDialog").style.display = "block";
			showsh = false;
		}
	}
	//EXPERIMENTAL
	//To prevent extreamly long pause times fron holding down Alt+R
	if (e.keyCode == 82&&e.altKey) {
		if(ldown)ldown=false;
	}
});


//Agar.io Benchmarker Mod
//Version 0.4 ~ Edited By Mevin1
/*
•Changes
-WTF? An entire other div just for background? nope
-using Date.now() instead of a benchmarker for timing
*/
//Create global vars
var m, benchmarker;
var benchmarks = ["250mass", "500mass", "1000mass", "2500mass", "5000mass"/*, "Rank10", "Rank1"*/];
var mass_benchmarks = [250, 500, 1000, 2500, 5000];
/*var rank_benchmarks = [10, 1];
var rankPrev = 11;//broken*/
var massPrev = 0;
//Create div
$("body").append('<div id="benchmarker"></div>');
function initbench(first) {
    //Style div
    $("div#benchmarker").css({
        "backgroundColor": "rgba(0,0,0,0.4)" /*"transparent"*/ ,
        "opacity": "1.0",
        "color": "white",
        "fontFamily": "Ubuntu,Arial,sans-serif",
        "position": "fixed",
        "padding": "10px",
        "text-align": "center",
		"pointer-events": "none"/*,
		"display": "none"*/
    });
	if(first){
		bstyle(true);
		showt?$("div#benchmarker").css({
			"display": "block"
		}):
		$("div#benchmarker").css({
			"display": "none"
		});
	}
    //Create HTML to be added to div
    var newHTML = '<table>' +
        '<h3>Benchmarker</h3>' +
        '<span>Time Elapsed: --:--</span>' +
        '<tr><th>Benchmark</th><th>Time</th><th>Best</th></tr>' + //Headers
        '<tr id="250mass"><td>250 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>' + //250 Mass
        '<tr id="500mass"><td>500 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>' + //500 Mass
        '<tr id="1000mass"><td>1000 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>' + //1000 Mass
        '<tr id="2500mass"><td>2500 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>' + //2500 Mass
        '<tr id="5000mass"><td>5000 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>' + //5000 Mass
        //'<tr id="Rank10"><td>Rank 10</td><td class="time">-----</td><td class="best">-----</td></tr>' + //Rank 10
        //'<tr id="Rank1"><td>Rank 1</td><td class="time">-----</td><td class="best">-----</td></tr>' + //Rank 1
        '</table>';


    //Add HTML to div
    $("div#benchmarker").html(newHTML);

    //Load local storage --- best times
    for (var i = 0; i < benchmarks.length; i++) {
        if (localStorage.getItem("best_" + benchmarks[i])) {
            $("#" + benchmarks[i] + " .best").html(localStorage.getItem("best_" + benchmarks[i]));
        }
    }
    //Style the table
    $("table").css({
        "margin": "8px",
        "padding": "8px"
    });
    //Centering
    $("div#benchmarker h3").css("text-align", "center");
    $("div#benchmarker span").css({
        "text-align": "center",
        "display": "inline-block"
    });
    //Cells
    $("td,th").css({
        "padding": "5px",
        "text-align": "left"
    });
    //Margins
    //$("div#benchmarker span").css({"margin":"0px","padding":"0px"});
    $("div#benchmarker h3").css({
        "margin-top": "4px"
    });
}
function bstyle(over){
	over?$("div#benchmarker").css({
        "left": "",
        "top": "",
        "right": "5px",
        "bottom": "5px",
		"z-index": "1000"
	}):$("div#benchmarker").css({
        "left": "5px",
        "top": "5px",
        "right": "",
        "bottom": "",
		"z-index": "1"
	});
}
function count() { //Occurs every second
	if (showt&&in_game){
    $("div#benchmarker span").html("Time Elapsed: " + mToMs(Date.now() - stats.birthday));
}}
function mToMs(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
function snp(y) { //Turns XX:XX to XXXX
    return y.replace(/[^0-9]+/g, '');
}
function logBenchmark(benchmark, time) {
    //Manuallly record benchmark.
    if ($("#" + benchmark + " .time").html() == "-----") { //Checks if the benchmark time is recorded yet
        console.log("Benchmark set: " + benchmark + " at " + time);
        $("#" + benchmark + " .time").html(time); //Record time
        if (($("#" + benchmark + " .best").html() == "-----") || (snp(time) < snp(localStorage.getItem('best_' + benchmark)))) { //Checks if best time is beaten or undefined
            console.log("Best time set: " + benchmark + " at " + time);
            $("#" + benchmark + " .best").html(time); //Record time
            localStorage.setItem("best_" + benchmark, time); //Save to local storage
        }
    }
}
function deleteScores() {
    var prompt = confirm("Are you sure you want to delete your best times?");
    if (prompt == true) {
        for (var i = 0; i < benchmarks.length; i++) {
            localStorage.removeItem("best_" + benchmarks[i]);
            $("#" + benchmarks[i] + " .best").html("-----");
        }
    }
}
function benchcheck(mass) {
    mass = Math.floor(mass / 100);
    for (var i = 0; i < mass_benchmarks.length; i++) {
        if ((massPrev < mass_benchmarks[i]) && (mass >= mass_benchmarks[i])) {
            //Check if mass has passed from below benchmark to above benchmark
            logBenchmark(mass_benchmarks[i] + "mass", mToMs(Date.now() - stats.birthday));
        }
    }
}