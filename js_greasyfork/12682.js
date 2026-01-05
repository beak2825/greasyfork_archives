// ==UserScript==
// @name        Agar-Mod, EDIT OLEG VORONOV
// @namespace   Agar.io
// @description ItsVoid
// @include     http://agar.io/*
// @version     1.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12682/Agar-Mod%2C%20EDIT%20OLEG%20VORONOV.user.js
// @updateURL https://update.greasyfork.org/scripts/12682/Agar-Mod%2C%20EDIT%20OLEG%20VORONOV.meta.js
// ==/UserScript==


// Configuration
// Auto-enabled settings

setShowMass(true); // Show your mass
setDarkTheme(true); // Enable Dark theme by default
setNames(true); // Show player names
$("#nick").val("YOU NICKNAME ;)"); // Set username

// ------------------------------------------------------

// Userscript code, please do not touch unless you know what you're doing.
// Add custom css function

function addStyleSheet(style){
    var getHead = document.getElementsByTagName("HEAD")[0];
    var cssNode = window.document.createElement( 'style' );
    var elementStyle= getHead.appendChild(cssNode)
    elementStyle.innerHTML = style;
    return elementStyle;
}

// Import Bootstrap Paper and Fontawesome using custom css function

addStyleSheet('@import "http://bootswatch.com/paper/bootstrap.css"; @import "http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"; html * { font-family: Raleway, sans-serif; }'); 

// At first time opening agar.io with this userscript, alert user.

var alerted = localStorage.getItem('alerted') || '';
if (alerted != 'yes') {
    alert("Make sure you have the Charts & Stats userscript installed for ingame statistics! Check the description on Greasyfork for more info.");
    localStorage.setItem('alerted','yes');
}

// Connect to IP & Reconnect
$(document).ready(function() {
    var region = $("#region");
    if (region.length) {
        $("<br/><div class=\"input-group\"><div class=\"form-group\"><input id=\"serverInput\" class=\"form-control\" placeholder=\"255.255.255.255:443\" maxlength=\"20\"><span class=\"input-group-btn\"> &<button id=\"connectBtn\" class=\"btn-needs-server btn btn-warning\" style=\"width: 80px\" onclick=\"connect('ws://' + $('#serverInput').val());\" type=\"button\">Join</button><button id=\"connectBtn\" class=\"btn-needs-server btn btn-info\" style=\"width: 80px\" onclick=\"connect('ws://' + $('#serverInput').val());\" type=\"button\"><span class=\"fa fa-lg fa-refresh\"></span></button>  </input></div>").insertAfter("#helloDialog > form > div:nth-child(3)");
    }
});

// Remove instructions text 

var elmDeleted = document.getElementById("instructions");
elmDeleted.parentNode.removeChild(elmDeleted);


// Import Raleway font from Google Fonts

WebFontConfig = {
    google: { families: [ 'Raleway::latin' ] }
};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})(); 

window.debug=window.localStorage.debug?window.localStorage.debug=="true":!1;window.onerror=function(a,b,c,d){if(!!~a.indexOf("RangeError"))return;else if(c==1)window.onmoderror("["+c+":"+d+"] '"+a+"'");}
window.onmoderror=function(a){if(window.debug=="true"||window.location.search.substr(0,9)=="?fallback")return;if(!window.ignore&&confirm("An error was detected!\n\n"+a+"\n\nFallback to Vanilla Agar.io?")){window.extToggled=true;window.onbeforeunload=function(){};window.location='http://agar.io/?fallback'+window.location.hash;}else{window.ignore=!0}};try{(function(){if(typeof window.jQuery=="undefined")return;var iframe=document.createElement('iframe');iframe.style.display="none";iframe.src='http://kelvin.tk/agario/';document.body.appendChild(iframe);$("body").append('<div id="toolbar" style="font-weight: bold; position:absolute; z-index: 10000; right: 7px; width: 205px; text-align: center; height: 22px; line-height: 16px; bottom: 25px; font-size: 14px; color: #ffffff; background-color: rgba(0,0,0,.3); padding: 3px;"><a target="_blank" href="https://docs.google.com/forms/d/1LQwFtsGYP1guBxAIgORnQGRdmngOIXii8DNtrWgFC7A/viewform" style="font-size: 14px; color: #ffffff;">Feedback</a> | <a href="javascript:window.showreportcacheui();" style="font-size: 14px; color: #ffffff;">Report Skin</a></div><div id="reportCacheBrowser" class="overlay" style="display:none"><div class="valign"><div class="popupbox"><div class="popheader"><h3>Report Skin</h3></div><div class="scrollable"><div id="reportSkinList" style="width:100%">begin</div></div><div class="popupbuttons"><button onclick="hidereportcacheui()" type="button" style="margin:4px" class="btn btn-danger">Back</button></div></div></div>');window.amreportcachestore=[];window.amreportcacheadd=function(url){if(url.match(/connect.agariomods.com\/img_/)){var r=url.match(/img_(.*).png/);if(r){window.amreportcachestore.push(r[1]);}}}
window.showreportcacheui=function(){jQuery('#reportCacheBrowser').fadeIn();if(window.amreportcachestore.length==0){generatedReportCacheUiSkinsMarkup="<h3>Sorry, because you haven't encountered any *connect custom skins during this game play session, I am unable to list any skins for reporting.</h3>";$('#reportSkinList').html(generatedReportCacheUiSkinsMarkup);return;}else{$('#reportSkinList').html('<h3>*connect skins seen during this gaming session.</h3><p>Click on a skin to report.</p>');}
                                    var skin_index=0;window.amreportcachestore.map(function(skin){skin_index++;var canvas=jQuery('<canvas/>',{'id':"amrscanvas_"+ skin_index}).css({zIndex:1,border:"1px solid",margin:"10px",cursor:"pointer"}).prop({username:skin,'width':150,'height':175}).hover(function(){$(this).css({opacity:'0.7'});},function(){$(this).css({opacity:'1'});}).click(function(){if(confirm("Are you SURE you want to report this skin?")){$(this).css({'background-color':'#ff2222'});$.post("//connect.agariomods.com/json/report.php",{username:this.username}).done(function(data){alert("Thank you !");console.log(data);});}});$('#reportSkinList').append(canvas);var image=jQuery(new Image()).prop({'id':"amrsimg_"+ skin_index,'src':"//connect.agariomods.com/img_"+skin+".png",'username':skin,'nickname':skin}).load(function(){var canvas=document.getElementById(this.id.replace("amrsimg_","amrscanvas_"));var ctx=canvas.getContext('2d');ctx.drawImage(this,0,0,150,150);ctx.font="14px serif";ctx.fillText(this.username,2,165);});});}
window.hidereportcacheui=function(){jQuery('#reportCacheBrowser').fadeOut();}
window.addEventListener('message',function(e){if(e.data=="ScriptDisable"){window.extToggled=true;window.location=window.location;}},false);var handledHash=handleHash();if(handledHash&&window.debug!=="true"){history.replaceState2=history.replaceState;history.replaceState=function(a,b,c){history.replaceState2(a,b,"/?fallback"+c.substr(1));}
window.onhashchange=function(){history.replaceState2({},document.title,'/?fallback'+window.location.hash)};jQuery('#agario-main-buttons').append('<button type="button" id="opnBrowser" onclick="openServerbrowser();" style="margin-top:4px;width:100%" class="btn btn-success">Agariomods Private Servers</button>');addsbui(true);window.openServerbrowser=openServerbrowser;window.closeServerbrowser=closeServerbrowser;window.getServers=getServers;window.serverinfo=serverinfo;window.directserverinfo=directserverinfo;window.hgm=hgm;window.connectPrivate=function(a,b){connect("ws://"+a.toLowerCase().replace(/ /g,"")+'.iomods.com:'+150+b,"")};window.onbeforeunload=function(){if(!window.extToggled)return'Are you sure you want to quit agar.io?'};return;}else if(handledHash===false){window.onload=handleHash;}
                                                                                                                                                                                                                                                                                                                                                                                var sty=document.createElement("style");sty.id="loadercss";sty.innerHTML='#load{z-index:3000;position:absolute;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,0.4);color:#fff;font-family:"Segoe UI","Microsoft YaHei"}.le *{padding:0;margin:0 auto;list-style:none;box-sizing:border-box;outline:none;font-weight:400}.le{text-align:center;margin:50vh auto;transform:translateY(-50%);position:relative;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;width:100px;height:100px}.le > span,.le > span:before,.le > span:after{content:"";display:block;border-radius:50%;border:2px solid #fff;position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.le > span{width:100%;height:100%;top:0;left:0;border-left-color:transparent;-webkit-animation:effect-2 2s infinite linear;-moz-animation:effect-2 2s infinite linear;-ms-animation:effect-2 2s infinite linear;-o-animation:effect-2 2s infinite linear;animation:effect-2 2s infinite linear}.le > span:before{width:75%;height:75%;border-right-color:transparent}.le > span:after{width:50%;height:50%;border-bottom-color:transparent}@-webkit-keyframes effect-2{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes effect-2{from{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}';document.head.appendChild(sty);$("body").append('<div id="load"><div class="le"><span></span></div></div>');document.getElementById("overlays").style.display='none';document.getElementById("connecting").style.display='none';var ourskins="в„ќ;гЂЉв„ќгЂ‹;0chan;18-25;1up;360nati0n;8ball;UmguwJ0;aa9skillz;ace;adamzonetopmarks;advertisingmz;agar youtube;agariomods.com;al sahim;alaska;albania;alchestbreach;alexelcapo;algeria;am3nlc;amoodiesqueezie;amway921wot;amyleethirty3;anarchy;android;angrybirdsnest;angryjoeshow;animebromii;anonymous;antvenom;aperture;apple;arcadego;assassinscreed;atari;athenewins;authenticgames;avatar;aviatorgaming;awesome;awwmuffin;aypierre;baka;balenaproductions;bandaid;bane;baseball;bashurverse;basketball;bateson87;batman;battlefield;bdoubleo100;beats;bebopvox;belarus;belgium;bender;benderchat;bereghostgames;bert;bestcodcomedy;bielarus;bitcoin;bjacau1;bjacau2;black widow;blackiegonth;blitzwinger;blobfish;bluexephos;bluh;blunty3000;bobross;bobsaget;bodil30;bodil40;bohemianeagle;boo;boogie2988;borg;bowserbikejustdance;bp;breakfast;breizh;brksedu;buckballs;burgundy;butters;buzzbean11;bystaxx;byzantium;calfreezy;callofduty;captainsparklez;casaldenerd;catalonia;catalunya;catman;cavemanfilms;celopand;chaboyyhd;chaika;chaosxsilencer;chaoticmonki;charlie615119;charmander;chechenya;checkpointplus;cheese;chickfila;chimneyswift11;chocolate;chrisandthemike;chrisarchieprods;chrome;chucknorris;chuggaaconroy;cicciogamer89;cinnamontoastken;cirno;cj;ckaikd0021;clanlec;clashofclansstrats;cling on;cobanermani456;coca cola;codqg;coisadenerd;cokacola;colombia;colombiaa;commanderkrieger;communitygame;concrafter;consolesejogosbrasil;controless ;converse;cookie;coolifegame;coookie;cornella;cornella;coruja;craftbattleduty;creeper;creepydoll;criken2;criousgamers;crispyconcords;cristian4games;csfb;cuba;cubex55;cyberman65;cypriengaming;cyprus;czech;czechia;czechrepublic;d7297ut;d7oomy999;dagelijkshaadee;daithidenogla;darduinmymenlon;darksideofmoon;darksydephil;darkzerotv;dashiegames;day9tv;deadloxmc;deadpool;deal with it;deathly hallows;deathstar;debitorlp;deigamer;demon;derp;desu;dhole;diabl0x9;dickbutt;dilleron;dilleronplay;direwolf20;dissidiuswastaken;dnb;dnermc;doge;doggie;dolan;domo;domokun;donald;dong;donut;doraemon;dotacinema;douglby;dpjsc08;dreamcast;drift0r;drunken;dspgaming;dusdavidgames;dykgaming;ea;easports;easportsfootball;eatmydiction1;eavision;ebin;eeoneguy;egg;egoraptor;eguri89games;egypt;eksi;electrokitty;electronicartsde;elementanimation;elezwarface;eligorko;elrubiusomg;enzoknol;eowjdfudshrghk;epicface;ethoslab;exetrizegamer;expand;eye;facebook;fantabobgames;fast forward;fastforward;favijtv;fazeclan;fbi;fer0m0nas;fernanfloo;fgteev;fidel;fiji;finn;fir4sgamer;firefox;fishies;flash;florida;fnatic;fnaticc;foe;folagor03;forcesc2strategy;forocoches;frankieonpcin1080p;freeman;freemason;friesland;frigiel;frogout;fuckfacebook;fullhdvideos4me;funkyblackcat;gaben;gabenn;gagatunfeed;gamebombru;gamefails;gamegrumps;gamehelper;gameloft;gamenewsofficial;gameplayrj;gamerspawn;games;gameshqmedia;gamespot;gamestarde;gametrailers;gametube;gamexplain;garenavietnam;garfield;gassymexican;gaston;geilkind;generikb;germanletsfail;getinmybelly;getinthebox;ghostrobo;giancarloparimango11;gimper;gimperr;github;giygas;gizzy14gazza;gnomechild;gocalibergaming;godsoncoc;gogomantv;gokoutv;goldglovetv;gommehd;gona89;gonzo;gonzossm;grammar nazi;grayhat;grima;gronkh;grumpy;gtamissions;gtaseriesvideos;guccinoheya;guilhermegamer;guilhermeoss;gurren lagann;h2odelirious;haatfilms;hagrid;halflife;halflife3;halo;handicapped;hap;hassanalhajry;hatty;hawaii;hawkeye;hdluh;hdstarcraft;heartrockerchannel;hebrew;heisenburg;helix;helldogmadness;hikakingames;hikeplays;hipsterwhale;hispachan;hitler;homestuck;honeycomb;hosokawa;hue;huskymudkipz;huskystarcraft;hydro;iballisticsquid;iceland;ie;igameplay1337;ignentertainment;ihascupquake;illuminati;illuminatiii;ilvostrocarodexter;imaqtpie;imgur;immortalhdfilms;imperial japan;imperialists;imperialjapan;imvuinc;insanegaz;insidegaming;insidersnetwork;instagram;instalok;inthelittlewood;ipodmail;iron man;isaac;isamuxpompa;isis;isreal;itchyfeetleech;itsjerryandharry;itsonbtv;iulitm;ivysaur;izuniy;jackfrags;jacksepticeye;jahovaswitniss;jahrein;jaidefinichon;james bond;jamesnintendonerd;jamonymow;java;jellyyt;jeromeasf;jew;jewnose;jibanyan;jimmies;jjayjoker;joeygraceffagames;johnsju;jontronshow;josemicod5;joueurdugrenier;juegagerman;jumpinthepack;jupiter;kalmar union;kame;kappa;karamba728;kenny;keralis;kiloomobile;kingdomoffrance;kingjoffrey;kinnpatuhikaru;kirby;kitty;kjragaming;klingon;knekrogamer;knights templar;knightstemplar;knowyourmeme;kootra;kripparrian;ksiolajidebt;ksiolajidebthd;kuplinovplay;kurdistan;kwebbelkop;kyle;kyokushin4;kyrsp33dy;ladle;laggerfeed;lazuritnyignom;ldshadowlady;le snake;lenny;letsplay;letsplayshik;letstaddl;level5ch;levelcapgaming;lgbt;liberland;libertyy;liechtenstien;lifesimmer;linux;lisbug;littlelizardgaming;llessur;loadingreadyrun;loki;lolchampseries;lonniedos;love;lpmitkev;luigi;luke4316;m3rkmus1c;macedonia;machinimarealm;machinimarespawn;magdalenamariamonika;mahalovideogames;malena010102;malta;mario;mario11168;markiplier;markipliergame;mars;maryland;masterball;mastercheif;mateiformiga;matroix;matthdgamer;matthewpatrick13;mattshea;maxmoefoegames;mcdonalds;meatboy;meatwad;meatwagon22;megamilk;messyourself;mickey;mike tyson;mike;miles923;minecraftblow;minecraftfinest;minecraftuniverse;miniladdd;miniminter;minnesotaburns;minnie;mkiceandfire;mlg;mm7games;mmohut;mmoxreview;mod3rnst3pny;moldova;morealia;mortalkombat;mr burns;mr.bean;mr.popo;mrchesterccj;mrdalekjd;mredxwx;mrlev12;mrlololoshka;mrvertez;mrwoofless;multirawen;munchingorange;n64;naga;namcobandaigameseu;nasa;natusvinceretv;nauru;nazi;nbgi;needforspeed;nepenthez;nextgentactics;nextgenwalkthroughs;ngtzombies;nick fury;nick;nickelodeon;niichts;nintendo;nintendocaprisun;nintendowiimovies;nipple;nislt;nobodyepic;node;noobfromua;northbrabant;northernlion;norunine;nosmoking;notch;nsa;obama;obey;officialclashofclans;officialnerdcubed;oficialmundocanibal;olafvids;omfgcata;onlyvgvids;opticnade;osu;ouch;outsidexbox;p3rvduxa;packattack04082;palau;paluten;pandaexpress;paulsoaresjr;pauseunpause;pazudoraya;pdkfilms;peanutbuttergamer;pedo;pedobear;peinto1008;peka;penguin;penguinz0;pepe;pepsi;perpetuumworld;pewdiepie;pi;pietsmittie;pig;piggy;pika;pimpnite;pinkfloyd;pinkstylist;pirate;piratebay;pizza;pizzaa;plagasrz;plantsvszombies;playclashofclans;playcomedyclub;playscopetrailers;playstation;playstation3gaminghd;pockysweets;poketlwewt;pooh;poop;popularmmos;potato;prestonplayz;protatomonster;prowrestlingshibatar;pt;pur3pamaj;quantum leap;question;rageface;rajmangaminghd;retard smile;rewind;rewinside;rezendeevil;reziplaygamesagain;rfm767;riffer333;robbaz;rockalone2k;rockbandprincess1;rockstar;rockstargames;rojov13;rolfharris;roomba;roosterteeth;roviomobile;rspproductionz;rss;rusgametactics;ryukyu;s.h.e.i.l.d;sah4rshow;samoa;sara12031986;sarazarlp;satan;saudi arabia;scream;screwattack;seal;seananners;serbia;serbiangamesbl;sethbling;sharingan;shell;shine;shofu;shrek;shufflelp;shurikworld;shuuya007;sinistar;siphano13;sir;skillgaming;skinspotlights;skkf;skull;skydoesminecraft;skylandersgame;skype;skyrim;slack;slovakia;slovenia;slowpoke;smash;smikesmike05;smoothmcgroove;smoove7182954;smoshgames;snafu;snapchat;snoop dogg;soccer;soliare;solomid;somalia;sp4zie;space ace;space;sparklesproduction;sparkofphoenix;spawn;speedyw03;speirstheamazinghd;spiderman;spongegar;spore;spqr;spy;squareenix;squirtle;ssohpkc;sssniperwolf;ssundee;stalinjr;stampylonghead;star wars rebel;starbucks;starchild;starrynight;staxxcraft;stitch;stupid;summit1g;sunface;superevgexa;superman;superskarmory;swiftor;swimmingbird941;syria;t3ddygames;tackle4826;taco;taltigolt;tasselfoot;tazercraft;tbnrfrags;tctngaming;teamfortress;teamgarrymoviethai;teammojang;terrorgamesbionic;tetraninja;tgn;the8bittheater;thealvaro845;theatlanticcraft;thebajancanadian;thebraindit;thecraftanos;thedanirep;thedeluxe4;thediamondminecart;theescapistmagazine;thefantasio974;thegaminglemon;thegrefg;thejoves;thejwittz;themasterov;themaxmurai;themediacows;themrsark;thepolishpenguinpl;theradbrad;therelaxingend;therpgminx;therunawayguys;thesims;theskylanderboy;thesw1tcher;thesyndicateproject;theuselessmouth;thewillyrex;thnxcya;thor;tintin;tmartn;tmartn2;tobygames;tomo0723sw;tonga;topbestappsforkids;totalhalibut;touchgameplay;transformer;transformers;trickshotting;triforce;trollarchoffice;trollface;trumpsc;tubbymcfatfuck;turkey;tv;tvddotty;tvongamenet;twitch;twitter;twosyncfifa;typicalgamer;uberdanger;uberhaxornova;ubisoft;uguu;ukip;ungespielt;uppercase;uruguay;utorrent;vanossgaming;vatican;venomextreme;venturiantale;videogamedunkey;videogames;vietnam;vikkstar123;vikkstar123hd;vintagebeef;virus;vladnext3;voat;voyager;vsauce3;w1ldc4t43;wakawaka;wales;walrus;wazowski;wewlad;white  light;whiteboy7thst;whoyourenemy;wiiriketopray;willyrex;windows;wingsofredemption;wit my woes;woodysgamertag;worldgamingshows;worldoftanks;worldofwarcraft;wowcrendor;wqlfy;wroetoshaw;wwf;wykop;xalexby11;xbox;xboxviewtv;xbulletgtx;xcalizorz;xcvii007r1;xjawz;xmandzio;xpertthief;xrpmx13;xsk;yamimash;yarikpawgames;ycm;yfrosta;yinyang;ylilauta;ylilautaa;yoba;yobaa;yobaaa;yogscast2;yogscastlalna;yogscastsips;yogscastsjin;yoteslaya;youalwayswin;yourheroes;yourmom;youtube;zackscottgames;zangado;zazinombies;zeecrazyatheist;zeon;zerkaahd;zerkaaplays;zexyzek;zimbabwe;zng;zoella;zoidberg;zombey;zoomingames";var version=202;if(version!=localStorage.getItem("version")){localStorage.setItem("version",version);var benchmarks=["250mass","500mass","1000mass","2500mass","5000mass"];var removed=[];for(var i=0;i<benchmarks.length;i++){var a="best_"+ benchmarks[i];if(localStorage.getItem(a)!=null){if(isNaN(localStorage.getItem(a))){localStorage.removeItem(a);removed.push(a);}else if(i!=0&&removed.length>0){for(var j=0;j<removed.length;j++){localStorage.setItem(removed[j],localStorage.getItem(a));}
                                                                                                                                                                                                                                                                                                                                                                                removed=[];};}}};function preset(s,v){if(null==localStorage.getItem(s))localStorage.setItem(s,v)}
                                                                                                                                                                                                                                                                                                                                                                    preset("chatEnabled","true");preset("settingShow_chart","true");preset("showt","true");preset("nick","");var showsh=false;var showt=localStorage.getItem("showt")=="true";var chatEnabled=localStorage.getItem("chatEnabled")=="true";window.extToggled=false;window.server={ip:"",i:"",location:""};var ldown=false;var pload=0;var ptime=false;var showfps=false;var showpio=false;var showbio=false;if(showt===null){localStorage.setItem("showt","true");showt=true;}
                                                                                                                                                                                                                                                                                                                                                                    setInterval(function(){if(showsh)DrawStats(false);if(showt&&in_game)count();if(ptime)time(Date.now());if(Date.now()-clearfps>=1000)document.getElementById("fps").children[1].innerHTML="0";},1000);var gamejs="",modBlocking=true;var tester=document.getElementsByTagName("script");var i=0;var W='';var b='';var sk='';var c3eg2='';var in_game=false;var pandb='';var bgmusic=new Audio();var tracks=['BotB 17936 Isolation Tank.mp3','BotB 17934 bubblybubblebubblingbubbles.mp3','BotB 17935 bloblobloblboblbolboblboblbobolbloblob.mp3','BotB 17937 Woofytunes.mp3','BotB 17938 slowgrow.mp3','BotB 18549 a blob\'s life.mp3','BotB 18550 war of the orbs.mp3','BotB 18551 blob tower.mp3','BotB 19119 blazeon called he wants his ship back.mp3','BotB 19120 SOME GAME!!!!!!!!!!!!!!!!!!!!!!!!!!!.mp3','BotB 19122 FTS -Faster Than Scrap-.mp3','BotB 19123 Entry for BOTB\'s OHB contest_ song name is Blidia Sman.mp3','BotB 19124 litty litty.mp3','BotB 19125 feel_nothing.mp3','BotB 19126 The Unknown - DEMO.mp3','BotB 19127 warinspace.mp3'];var ssfxlist=['spawn','gameover'];var ssfxs=[];for(var i=0;i<ssfxlist.length;i++){var newsfx=new Audio("//skins.agariomods.com/botb/sfx/"+ ssfxlist[i]+".mp3");newsfx.loop=false;ssfxs.push(newsfx);}
                                                                                                                                                                                                                                                                                                                                                                    var mysfxlist=['cntdwn','end'];for(var i=0;i<ssfxlist.length;i++){var newsfx=new Audio("//skins.agariomods.com/mevin1/"+ mysfxlist[i]+".mp3");newsfx.loop=false;ssfxs.push(newsfx);}
                                                                                                                                                                                                                                                                                                                                                                    function sfx_play(id){if(document.getElementById("sfx").value==0)return;var event=ssfxs[id];event.volume=document.getElementById("sfx").value;event.play();}
                                                                                                                                                                                                                                                                                                                                                                    var pellets=[];var pellet=0;for(var i=0;i<50;i++){newsfx=new Audio('data:audio/mp3;base64,SUQzAwAAAAAAIlRSQ0sAAAACAAAAOFRJVDIAAAAMAAAAQXVkaW8gVHJhY2v/8yTEAAcAQph5SRAAAMuAAnOc5z/mwmFwBgDA2TvWD4PyjpQ5vlHcH+9/fK8aWTj/8yTEBwlocqgBmtAA0HYmGCTgm37MUrTnLZjRhwJ0wNQRg5EY8gXae+xVQhZevYv/8yTEBAewXpghzwABX2fMStQ1DTRLaQUW0QkTU6o7CyvRX4gpvwQWTEFNRTMuOTn/8yTECAAAA0gAAAAALjOqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=');newsfx.loop=false;pellets.push(newsfx);}
                                                                                                                                                                                                                                                                                                                                                                    function play_pellet(){if(document.getElementById("sfx").value==0)return;pellet++
                                                                                                                                                                                                                                                                                                                                                                    if(pellet>49)pellet=0;pellets[pellet].volume=document.getElementById("sfx").value;pellets[pellet].play()}
                                                                                                                                                                                                                                                                                                                                                                    var sfxlist=['split','eat','bounce','merge','virusfeed','virusshoot','virushit'];var sfxs=[];for(var i=0;i<sfxlist.length;i++){var newsfx=new Audio("//skins.agariomods.com/botb/sfx/"+ sfxlist[i]+".mp3");newsfx.loop=false;newsfx.onended=function(){$(this).remove();}
                                                                                                                                                                                                                                                                                                                                                                    sfxs.push(newsfx);}
                                                                                                                                                                                                                                                                                                                                                                    function sfx_event(id){if(document.getElementById("sfx").value==0)return;var event=jQuery.clone(sfxs[id]);event.volume=document.getElementById("sfx").value;event.load();event.play();}
                                                                                                                                                                                                                                                                                                                                                                    var test=1;var passed=0;var failed=0;var chart_update_interval=10;var chart=null;var chart_data=[];var chart_counter=0;var chart_s='';var chart_m='';var chart_G='';var chart_Na='';var chart_k='';var sd='';var mainout="//agar.io/main_out.js";httpGet(mainout,function(data){winvar=data.substr(10,1);gamejs=data.replace("socket open","socket open (agariomods.com mod in place)");gamejs=gamejs.replace(/\n/g,"");sd=gamejs.substr(gamejs.search(/\w.send/),1);offset=gamejs.match(/,(\w+)\[(\w+)\]\.src="skins/);W=offset[1];b=offset[2];v=gamejs.match(/(\w)\?"m/)[1];h=gamejs.match(/=this,(\w)/)[1];offset=gamejs.search(/\w+\.indexOf\(.\)\?/);sk=gamejs.substr(offset,2);mycells=gamejs.match(/1==(\w+)\.length&&\(/)[1];var c=/this\.(.)&&.\.strokeText/.exec(gamejs);pandb=c[1];var c=/(\w)\.strokeText\((.{1,14})\);/.exec(gamejs);c3eg2=c[2];bdot=c[1];var c=/\((.)\=..x,.\=..y,/.exec(gamejs);chart_s=c[1];var c=/\(.\=(.).x,.\=..y,/.exec(gamejs);chart_m=c[1];var c=/(.)\=Math.max\(.,..\(\)\);/.exec(gamejs);chart_G=c[1];var c=/.\=Math.max\(.,(..)\(\)\);/.exec(gamejs);chart_Na=c[1];var c=/(.)\[0\]\.name\&\&\(/.exec(gamejs);chart_k=c[1];agariomodsRuntimeInjection();});function httpGet(theUrl,callback){var xmlHttp=new XMLHttpRequest();xmlHttp.open("GET",theUrl,true);xmlHttp.send(null);xmlHttp.onreadystatechange=function(){if(xmlHttp.readyState==4&&xmlHttp.status==200){callback(xmlHttp.responseText);}};}
                                                                                                                                                                                                                                                                                                                                                                    window.connect2=(window.connect?window.connect:function(){return});function agariomodsRuntimeInjection(){var script=document.createElement("script");script.src='//cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js';document.head.appendChild(script);var tester=document.getElementsByTagName("head");var oldhtml=tester[0].innerHTML;oldhtml=oldhtml.replace('#helloContainer,.connecting-panel{','#helloContainer{left:-2px;top:-6px;width:682px;');oldhtml=oldhtml.replace('width:94px;','margin-right:10px;');oldhtml=oldhtml.replace('#locationKnown','#locationKnown{height:40px}#locationKnown');oldhtml=oldhtml.replace('#region{width:100%','.region{width:300px;float:left');oldhtml=oldhtml.replace('.btn-spectate{','.btn-spectate{width:110px;');oldhtml=oldhtml.replace('margin-left:5px;width:275px','width:357px');oldhtml=oldhtml.replace('-webkit-transform:translate(-50%,-50%);','');oldhtml=oldhtml.replace('-ms-transform:translate(-50%,-50%);','');oldhtml=oldhtml.replace('transform:translate(-50%,-50%);','');oldhtml=oldhtml.replace('top:50%;left:50%;','margin:10px;');oldhtml=oldhtml.replace('width:100%;height:100%;','');oldhtml=oldhtml.replace('#FFFFFF;m','rgba(255,255,255,0.9);opacity:0.93;m');oldhtml=oldhtml.replace('581px','600px;left:100px');oldhtml=oldhtml.replace('#statsContinue{','#statsContinue{margin-bottom:30px;')
                                                                                                                                                                                                                                                                                                                                                                    oldhtml=oldhtml.replace('.agario-panel{','#atstats table{margin-bottom:15px}#atMass table{width:100%}#atstats td,#atstats th{padding:0 15px;border-bottom: 1px #bbb solid;}#atstats td:not(*:first-child),#atstats th:not(*:first-child){border-left:1px;text-align:center}#egstats>.nav-tabs{transform:rotate(90deg);position:absolute;right:-74px;top:73px;z-index:1000;}#helloContainer #egstats{top:155px;left:468px;background-color:rgba(255,255,255,0.93);}#overlays{background-color: rgba(0,0,0,0)}#overlays>#egstats .nav-tabs{display:none}#overlays>#egstats{left:20vw;background-color:rgba(255,255,255,0.6);}#egstats{position:fixed;width:566px;border-radius:15px;padding:5px 15px;padding-right:50px;overflow:hidden;}#helloContainer[data-gamemode=":party"][data-logged-in="1"] #egstats{left:696px;}#respawn{position:absolute;left:25px;right:25px;width:300px;bottom:285px;}.agario-profile-name-container{pointer-events: none;}#stats>canvas{margin-bottom:20px}#stats hr:first-of-type{margin-bottom:8px !important}#stats hr:last-of-type{margin-bottom:8px !important}br[clear="both"]{display:none}#mainPanel hr{margin:0 -15px 20px -15px}hr{height:12px;border:0;box-shadow:inset 0 12px 12px -12px rgba(0, 0, 0, 0.5)}.tosBox{display:none}.agario-panel.agario-side-panel.agario-profile-panel{overflow:hidden}.ribbon{margin-bottom:-100px;transform:rotate(26deg);background-color:#a00;overflow:hidden;white-space:nowrap;box-shadow:0 0 10px #888;right:-55px;top:-11px;position:relative;}.ribbon a {border:1px solid #faa;color:#fff;display:block;font:bold 11px "Helvetica Neue", Helvetica, Arial, sans-serif;margin:1px 0;padding:2px;text-align:center;text-decoration:none;text-shadow:0 0 5px #444;}.agario-promo{display:none !important;}body>#chart-container{pointer-events:none}.connecting-panel{margin:0 0 !important;position:absolute;top:5px;right:5px;z-index:2000}.ui{pointer-events:none}br+div:not([style]){height:35px;}#helloContainer>.agario-panel{float:left}#helloContainer>.side-container{float:right}.agario-panel{transform:none !important;');tester[0].innerHTML=oldhtml;var script=document.createElement("script");script.id="agariomods";agariomodsRuntimePatches();if(document.getElementById("agariomods")){alert("You are currently running multiple instances of Agariomods simultaneously!\nCheck that you dont have Tampermonkey Script and the Chrome Extension running at the same time if you're on Chrome;\nYou will see visual glicthes until YOU fix this.");}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                             script.innerHTML=gamejs;var oc=document.getElementById("canvas");var nc=document.createElement("canvas");nc.id="canvas";nc.width=oc.width;nc.height=oc.height;oc.parentNode.replaceChild(nc,oc);jQuery("#region").removeAttr("id").attr("onchange","setRegion($('.region').val());").addClass("region").children().each(function(){this.innerHTML=this.innerHTML.replace(/ \(.*$/,"");});;document.head.appendChild(script);agariomodsRuntimeHacks();bgmusic.src="//skins.agariomods.com/botb/"+ tracks[Math.floor(Math.random()*tracks.length)];bgmusic.load();bgmusic.loop=false;bgmusic.onended=function(){var track=tracks[Math.floor(Math.random()*tracks.length)];bgmusic.src="//skins.agariomods.com/botb/"+ track;bgmusic.play();}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                             window.onbeforeunload=function(){if(!window.extToggled)return'Are you sure you want to quit agar.io?';};$("#canvas").on('mousedown',function(event){event.preventDefault();});var tempa=document.getElementById("connecting").style;tempa.zIndex="99";tempa.display="block";document.getElementById("a300x250").style.backgroundImage="none";}
                                                                                                                                                                                                                                                                                                                                                                    window.countdown=function(a,b){if(b!="Game starting in")return;if(0<a&&a<=10){window.countdown.a=false;sfx_play(2);}else if(a==0&&window.countdown.a==false){window.countdown.a=true;ResetStats(Date.now());sfx_play(3);}};window.countdown.a=false;window.log=function(stuff){console.log(stuff);}
                                                                                                                                                                                                                                                                                                                                                                    function agariomodsRuntimePatches(){gamejs_patch("console.log(b);","","remove console spam");gamejs_patch(/(setNick=.{12})/,"$1saveNick(a);");gamejs_patch("(17),",'(17),document.activeElement.type!="text",',"");gamejs_patch("(18),",'(18),document.activeElement.type!="text",',"");gamejs_patch(/\?\((\w+\[0\])\.name/,"?($1&&$1.name","Error prevention for some error not caused by mod");gamejs_patch(/(.{21}{\w\(\{\w:\w,\w:(\w),\w:\w\})/,'jQuery("#xpg").text(Math.max($2-Math.min(JSON.parse(window.localStorage.loginCache3).xp,JSON.parse(window.localStorage.loginCache3).xpNeeded,jQuery(".progress-bar-text").text().split("/")[0]),0)).parent().show();$1',"xp earned");gamejs_patch('3333FF"]','3333FF","#33FFFF","#FF33FF","#FFFF33"]',"Add more team colors, CMY");gamejs_patch("(a,b){i","(a,b){if(!b){jQuery('#helloContainer').attr('data-party-state')!=0&&cancelParty(true);jQuery('#gps').fadeOut();window.nav(0,0,!1);var b=''};i","Kill parties and gps on private server connect");gamejs_patch("())};",'()||jQuery("#gps").fadeOut()&&window.nav&&window.nav(0,0,!1))};',"Toggle gps on gamemode change.");gamejs_patch('console.warn("Skipping draw"),','(console.warn("Skipping draw"),OnDrop()),','log dropped frames');gamejs_patch(/\((\w+\?)\(/,'(OnDeath(),$1(','add ondeath hook');gamejs=gamejs.split("#region").join(".region");gamejs_patch('attr("data-party-state","1")','attr("data-party-state","1");jQuery("#gps").fadeIn()',"party hook");gamejs_patch('attr("data-party-state","5");','attr("data-party-state","5");jQuery("#gps").fadeIn();',"party hook");gamejs_patch('attr("data-party-state","0");','attr("data-party-state","0");jQuery("#gps").fadeOut();(window.nav&&window.nav(0,0,!1));',"party hook");gamejs_patch('attr("data-party-state","0"),','attr("data-party-state","0")&&jQuery("#gps").fadeOut()&&window.nav&&window.nav(0,0,!1),',"party hook");gamejs_patch("location.hash)",'location.hash)&&jQuery("#gps").fadeIn()',"Gps on on start from party.");gamejs_patch('console.log("socket close");','onwsclose();console.log("socket close");',"Simulate player death on unexpected socket close");gamejs_patch('.onclose=null;','.onclose=onwsclose;',"Simulate player death on intentional socket close.")
                                                                                                                                                                                                                                                                                                                                                                    gamejs_patch(/\w>\w\/1\.1\?.*-50%\)"\);/,'',"fixing menu on resize");gamejs_patch("cancelParty=function(){",'cancelParty=function(a){if(jQuery("#stats").is(":visible")){return};',"Leave party when connecting to private server - add funct var");gamejs_patch(/""\);(\w+\(\))/,'"");jQuery("#gps").fadeOut();window.nav&&window.nav(0,0,!1);!a&&$1',"Leave party when connecting to private server - handle");gamejs_patch("else for","stillOnLeaderboard(ilead)}else for","adding function call for leaderboard checking")
                                                                                                                                                                                                                                                                                                                                                                    gamejs_patch(/(for\(\w\.f)/,"{var ilead=!1;$1","Preset veriable to check if on leaderboard",!0)
                                                                                                                                                                                                                                                                                                                                                                    gamejs_patch('split(";"),',"split(\";\"),ourskins='"+ourskins+"'.split(';'),","");gamejs_patch(';reddit;',';reddit;'+ourskins+';',"add our skinlist to the original game skinlist.");gamejs_patch(b+'=this.name.toLowerCase();',b+'=(this.name.substr(0,2)=="i/"?this.name:this.name.toLowerCase());var b0='+b+'.match(/^[[гЂЉ](.+)[гЂ‹\\]]/);if(b0){'+b+'=b0[1]};'+"if ((("+b+".substring(0, 2) == \"i/\"&&("+b+".length==7||"+b+".length==9))||"+b+"[0] == \"*\"||("+b+"[0] == \"+\"&&"+b+".length>6)&&!custom&&"+sk+".indexOf("+b+")==-1) {"+sk+'.push('+b+')};var agariomods="";if(pcs&&'+mycells+'.indexOf(this)!=-1){agariomods=pcsrc}else if(('+b+'.length >0)&&(ourskins.indexOf('+b+')>-1)){agariomods="//skins.agariomods.com/i/"+'+b+'+".png";}else if('+b+'[0]=="*"){if(!custom){agariomods="//connect.agariomods.com/img_"+'+b+'.substr(1)+".png";}}else if('+b+'.substring(0,2)=="i/"&&('+b+'.length==7||'+b+'.length==9)){if(!custom){agariomods="//i.imgur.com/"+'+b+'.substring(2)+".jpg";}}else if('+b+'.substring(0,1)=="+"&&'+b+'.length>6){agariomods="http://kelvin.tk/yt/icon.php?"+'+b+'.substring(1).toLowerCase();}else if('+sk+'.indexOf('+b+')>-1){agariomods="//agar.io/skins/"+'+b+'.toLowerCase()+".png";}',"add check for which skin mode we are in. be it no skin, default skin, custom skin, or an agariomods skin.");gamejs_patch(/(\w+)\.toDataURL\("image\/png"\)/,"(function(){try{var p=$1.toDataURL('image/png');return p}catch(e){return ''}})()","FU FAVICON!.");gamejs_patch('=1E4,','=1E4,'+'zz=!1,yq=!1,xx=!1,xz=!1,ts=!1,custom=!1,opv=!1,pcs=!1,pcsrc=""'+',',"adding variables");gamejs_patch(W+'['+b+'].src="skins/"+'+b+'+".png"','(pcs||agariomods.substr(0,1)=="+"&&('+W+'['+b+'].crossOrigin="Anonymous")),'+W+'['+b+'].src=agariomods,window.amreportcacheadd(agariomods)',"check for agariomods img src variable");gamejs_patch("this."+pandb+"&&"+bdot+".strokeText("+c3eg2+");"+bdot+".fillText("+c3eg2+")","if (String("+c3eg2.substr(0,1)+").substring(0, 2) != \"i/\" || custom) {this."+pandb+"&&"+bdot+".strokeText("+c3eg2+");"+bdot+".fillText("+c3eg2+")}","add imgur skins check for hiding username when using imgur id aka c3eg2");gamejs_patch(".googletag.pubads&&",".googletag.pubads&&window.googletag.pubads.clear&&","Fix for users with Ghostery");gamejs=addKeyboardHook(gamejs);gamejs=addSkinHook(gamejs);gamejs=addChartHooks(gamejs);gamejs=addOnCellEatenHook(gamejs);gamejs=addTeamMassHook(gamejs);gamejs=addTeamSkinsHook(gamejs);gamejs=addCanvasBGHook(gamejs);gamejs=addVirusColorHook(gamejs);gamejs=addFunctions(gamejs);gamejs=addOnShowOverlayHook(gamejs);gamejs=addOnHideOverlayHook(gamejs);gamejs=addLeaderboardHook(gamejs);gamejs=addConnectHook(gamejs);gamejs=addRecieveHook(gamejs);gamejs=addPCSHook(gamejs);gamejs=addOnSendHook(gamejs);gamejs=addOnDrawHook(gamejs);gamejs_patch(/=1\*\w\.innerHeight/g,'=opv&&'+winvar+'.innerHeight/'+winvar+'.innerWidth>=0.5625?('+winvar+'.innerWidth*0.5625):('+winvar+'.innerHeight)',"set height to 16:9");gamejs_patch(/=1\*\w\.innerWidth/g,'=opv&&'+winvar+'.innerHeight/'+winvar+'.innerWidth<=0.5625?('+winvar+'.innerHeight/0.5625):('+winvar+'.innerWidth)',"set width to 16:9");console.log("Testing complete, "+passed+" units passed and "+failed+" units failed.");if(failed){if(window.debug)console.log(new Error("UNIT FAILED"));else window.onmoderror()};}
                                                                                                                                                                                                                                                                                                                                                                    function gamejs_patch(search,replace,purpose){testCondition(typeof search=="string"?~gamejs.indexOf(search):search.test(gamejs),test++,purpose,search);gamejs=gamejs.replace(search,replace);}
                                                                                                                                                                                                                                                                                                                                                                    function testCondition(condition,id,comment,search){if(condition){window.debug&&console.log("test: #"+id+" PASSED - "+ comment);passed++;}else{console.error("test: #"+id+" FAILED - "+ comment+"\n Could not find: "+ search.toString());failed++;}}
                                                                                                                                                                                                                                                                                                                                                                    function agariomodsRuntimeHacks(){jQuery('div.agario-panel:has(#locationUnknown)').css({width:'450px'});jQuery('div#settings div:has(#locationKnown)').css({float:'none'});var bg=document.getElementById("canvas");bg.style.backgroundSize='cover';bg.style.backgroundRepeat='no-repeat';bg.style.backgroundAttachment="fixed";document.body.style.backgroundColor="grey";var nodeDiv=document.createElement("div");var nodeDiv2=document.createElement("div");nodeDiv.id="includedContent";nodeDiv.style.width="calc(100% + 10px)"
                                                                                                                                                                                                                                                                                                                                                                    nodeDiv.style.backgroundColor="#000000";nodeDiv.style.zIndex=999;nodeDiv.style.position="relative";nodeDiv2.style.padding="8px";nodeDiv.style.borderRadius="5px";nodeDiv.style.color="#dddddd";nodeDiv2.style.color="#dddddd";nodeDiv.style.margin="3px -5px 8px";nodeDiv2.style.maxHeight="200px";nodeDiv2.style.width="calc(100% - 5px)";nodeDiv.style.overflow="none";nodeDiv2.style.overflow="auto";nodeDiv2.innerHTML+=': <small><a href="https://chrome.google.com/webstore/detail/agariomods-evergreen-scri/nhjgdbihpkphlammdaeicdemggagfbdo/reviews?hl=en&gl=GB&authuser=1" target="_blank"> &lt;3</a></small><br><a href="http://connect.agariomods.com/" target="_blank"><h3></h3></a><hr><h3><a href="https://redd.it/3k0ax7"</a></h3></hr><p></p><b></b><p><a href="http://connect.agariomods.com/cskin.html" target="_blank"></a></p><b></b><br><p><a target="_blank" href="http://agari-o-clock.me"><font color="#ffaaaa"></font></a><br><a href="https://www.youtube.com/watch?v=VpmWnunOClU" target="_blank"></a></p><div style="color:#ffffff;background: url(\'http://i.imgur.com/EHjkX3F.gif\') center center;background-repeat: no-repeat;background-size: auto 94%;padding-top: 10px;height: 57px;"><a href="http://agariomods.com/warinspace.html" target="_blank" style="color:#ffffff;font-size: 22px;background-color: rgba(0,0,0,0.4);line-height: 25px;"></a><p style="background-color: rgba(0,0,0,0.5);float:  right;font-size: 10px;"></p></div><br> \
<b></b><br><a href="http://connect.agariomods.com/" target="_blank"><font color="pink"></font></a><br>\
<a target="_blank" href="http://agariomods.com/documentation.html"></a><br>\
<a href="" target="_blank" style="background:url(\'\');height:100px;display:block;"></a>\
</div>';nodeDiv.appendChild(nodeDiv2);jQuery(".form-group:first").replaceWith('<br>');var selector=jQuery('.region');var playBtn=jQuery('#playBtn');var nodeInput=document.createElement("span");var nodeSpan=document.createElement("span");var nodeBr=document.createElement("br");var nodeLinks=document.createElement("div");nodeLinks.innerHTML="<ul style='position:relative;left:-25px;width:450px;background-color:#428bca;text-align:center;font:16px bold,sans-serif;list-style-type:none;margin:6px 0 3px;padding:0;overflow:hidden;'><li style='float:left;'><a class='link' style='width:70px;' href='http://skins.agariomods.com' target='_blank'>SKINS</a><li style='float:left;'><a style='width:70px;' class='link' href='http://agariomods.com/chat.html' target='_blank'>CHAT</a><li style='float:left;'><a style='width:100px;' class='link' href='http://agariomods.com' target='_blank'>WEBSITE</a><li style='float:left;'><a style='width:110px;' class='link' href='http://agariomods.com/documentation.html' target='_blank'>FEATURES</a></li><li style='float:left;'><a style='width:100px;' class='link' style='border-right:0 !important' href onclick=\"alert('---HOTKEYS---\\nHold Z - Show Stats In-Game\\nConnect To Private Server - Alt+C\\nToggle Chat - C\\nInput Chat - Enter OR \\'/\\'\\nToggle Benchmarker - T\\nClear Benchmarks - Alt+T\\nTime On Page - Alt+1\\nFPS Counter - Alt+2\\nPackets In/Out Per Second - Alt+3\\nBytes In/Out Per Second - Alt+4\\nAttempt Lag Recovery - Alt+R'+(navigator.userAgent.match('Firefox')?'\\nTrue Fullscreen for Firefox - Ctrl+F\\nShow Menu - Delete':''));return false;\" target='_blank'>HOTKEYS</a></li></ul>";nodeLinks.style.marginLeft='10px';nodeSpan.className="glyphicon glyphicon-refresh btn btn-info";nodeSpan.style.fontSize="1.5em";nodeSpan.style.cssFloat="left";nodeSpan.style.paddingTop="2px";nodeSpan.style.width="15%";nodeSpan.style.height="33px";nodeInput.id="iphack"
nodeInput.style.width="85%";nodeInput.style.cssFloat="left";nodeInput.style.cssClear="right";nodeInput.style.padding="5px;";nodeInput.style.margin="5px;";nodeInput.style.border="2px solid green";jQuery('#locationUnknown').prepend(nodeLinks);jQuery('#locationUnknown').append(nodeDiv);$("#includedContent>div").scrollTop($("#includedContent>div")[0].scrollHeight);$('.link').css({'display':'block','border-right':'1px solid #0077CC','padding':'4px 0','background-color':'#428bca','color':'white'});$('.link').hover(function(){$(this).css('background-color','#529bda');$(this).removeClass("active");},function(){$(this).css('background-color','#428bca');$(this).removeClass("active");});window.saveNick=function(nick){var saved=localStorage.getItem("nick");if(nick==saved){return;}else if(nick.toUpperCase()==saved.toUpperCase()){localStorage.setItem("nick",nick);}else{localStorage.setItem("nick","");}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            if(nick[0]=='*'&&nick[1]){var name=nick.substr(1).toUpperCase();jQuery.ajax({url:"http://connect.agariomods.com/json/nodechatcheck.php?u="+getCookie("apikey"),dataType:'json',success:function(data){if(data.username.toUpperCase()==name){localStorage.setItem("nick",nick);}else{localStorage.setItem("nick","");}},error:function(a){}});}};jQuery('.form-group:first').removeAttr("class");jQuery('.btn-play-guest').addClass("btn-danger").removeClass("btn-success").css({'margin-left':'0','width':"208px"});jQuery('.btn-login').css("margin-right","4px");jQuery('.btn-login').css("width","140px");jQuery('#settings div:has(#locationKnown)').css("width","100%");var oldc=jQuery("#settings div:has(.btn-spectate)");jQuery(".btn-spectate").insertAfter($(".region"));oldc.remove();jQuery("#statsContinue").html("Menu");jQuery("#statsContinue").clone().addClass("btn-info").removeClass("btn-primary").prop("id","respawn").attr("onclick","closeStats();setNick(document.getElementById('nick').value);return false;").removeProp("date-itr").html("Respawn").insertAfter($("#statsContinue"));}
                                                                                                                                                                                                                                                                                                                                                                    var chart_update_interval=10;var chart=null;var chart_data=[];var chart_counter=0;var stat_canvas=null;var stats=null;var my_cells=null;var my_color="#ff8888";var pie=null;var stats_chart;var display_chart=LS_getValue('display_chart','true')==='true';var display_stats=LS_getValue('display_stats','false')==='true';var g_stat_spacing=0;var g_display_width=220;var g_layout_width=g_display_width;function addPCSHook(script){var match=script.match(/-1!=\w+\.indexOf\((\w+)\)\?/);var split=script.split(match[0]);script=split[0]+'(pcs&&-1!='+mycells+'.indexOf(this))||'+ match[0]+ split[1];match=script.match(/\|\|\((\w+)\[(\w+)/);split=script.split(match[0]);var ta=match[1];var tb=match[2];return split[0]+'&&!(pcs&&pcsrc!='+ta+'['+tb+']))'+ match[0]+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addKeyboardHook(script){var match=script.match(/onkeydown=function\(\w\){/);var split=script.split(match[0]);return split[0]+ match[0]+' if(isVisible()) return;'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addSkinHook(script){var match=script.match(/(\w+)=null\)\):\w+=null;/);var split=script.split(match[0]);return split[0]+ match[1]+'=null)):'+ match[1]+'=null;if(custom&&('+b+'.substring(0,2).match(/^(i\\/|\\*.)$/))){'+ match[1]+'=null;}'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addChartHooks(script){match=script.match(/max\((\w+),(\w+)\(/);var high=match[1];var current=match[2];match=script.match(/1==(\w+)\.length&&\(/);var split=script.split(match[0]);script=split[0]+'1=='+mycells+'.length&&(OnGameStart('+mycells+',Date.now()),'+ split[1];split=script.split(script.match(/\w+\("score"\)\+": "\+~~\(\w+\/100\)/)[0]);match=split[1].match(/-(\d+)\)\);/);var subSplit=split[1].split(match[0]);split[1]=subSplit[0]+'-'+match[1]+'),('+mycells+'&&'+mycells+'[0]&&OnUpdateMass('+current+'())));'+ subSplit[1];return split[0]+'"Score: "+~~('+current+'()/100)+"  High: "+~~('+high+'/100)+(((["1","5"].indexOf(jQuery("#helloContainer").attr("data-party-state"))!=-1)&&'+mycells+'[0])?("  |  X:"+Math.round(~~('+mycells+'[0].x)*.01)+" Y:"+Math.round(~~('+mycells+'[0].y)*.01)):(""))'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addTeamSkinsHook(script){var match=script.match(/":teams"!=(\w)/);var split=script.split(match[0]);return split[0]+'(window.teams==false||ts)'+split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addTeamMassHook(script){match=script.match(/this\.id&&(\w+)/);var split=script.split(match[0]);var c=match[1];var d=script.match(/\(!this\.\w\|\|this\.\w\)/);match=script.match(/(\w)=-1!=(\w)\.indexOf\(this\);/);var a=match[1];var z=match[2];script=split[0]+"this.id&&("+c+"||(yq&&"+z+"[0]&&window.teams))"+split[1];split=script.split('}0');return split[0]+"}if(-1!="+z+".indexOf(this)){"+a+"="+c+"}else if(yq&&"+z+"[0]&&window.teams&&this.size>20&&"+d+"&&this.color.replace(/[^f#]{2}/g,'--')=="+z+"[0].color.replace(/[^f#]{2}/g,'--')){"+a+"=true};0"+split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addFunctions(script){match=script.match(/(\(\w+=)!0(,\w+=(\w+),\w+=(\w+)\))/);var m0=match[1];var m1=match[2];var m2=match[3];var m3=match[4];match=script.match(/(\w+)\("#connecting"\)\.show\(\),(\w+)\(\)/);var one=match[1];var two=match[2];var match=script.match(/((\w)\.setAcid)/);var split=script.split(match[0]);return split[0]+match[2]+".nav=function(a,b,c){"+m2+"=Math.round(a*100);"+m3+"=Math.round(b*100);"+m0+"c"+m1+"};"+match[2]+'.setPCS=function(a){pcs=a;if(a){var url=localStorage.getItem("pcsrc");if(url==null){url=""};var promp=prompt("Input Skin URL\\nRemember ONLY YOU will see this skin.",url);if(null==promp){jQuery("#pcson").attr("checked",false);check(document.getElementById("bgimg"));pcs=!a;return;}localStorage.setItem("pcsrc",promp);pcsrc=promp;}};'+match[2]+'.setR=function(){'+one+'("#connecting").show(),'+two+'()};'+match[2]+'.setMVR=function(a){opv=a;'+winvar+'.onresize()};'+match[2]+'.setTskins=function(a){ts=a};'+match[2]+'.setCustom=function(a){custom=a;};'+match[2]+'.setVColors=function(a){zz=a};'+match[2]+'.setTeamMass=function(a){yq=a};'+match[2]+'.setBG=function(a){xx=a;if(a){var url=localStorage.getItem("bgurl");if(url==null){url=""};var promp=prompt("Image URL",url);if(null==promp){jQuery("#bgimg").attr("checked",false);check(document.getElementById("bgimg"));xx=!a;return;}localStorage.setItem("bgurl",promp);jQuery("#acid").attr("checked",false);check(document.getElementById("acid"));document.getElementById("canvas").style.backgroundImage=\'url("\'+promp+\'")\';xz=confirm("Show Grid Lines?");}};Object.defineProperty('+match[2]+',"teams",{get:function(){return '+script.match(/case 50:(\w+)/)[1]+'!=null}});'+match[1]+split[1]}
                                                                                                                                                                                                                                                                                                                                                                    function addCanvasBGHook(script){var match=script.match(/(\w)\.clearRect\(0,0,(\w),(\w)\)/);var split=script.split(match[0]);script=split[0]+match[1]+'.clearRect(0,0,'+match[2]+','+match[3]+');xx&&!xz?'+match[1]+'.clearRect(0,0,'+match[2]+','+match[3]+'):'+split[1].substr(1);var match2=script.match(/BFF";/);var split=script.split(match2[0]);return split[0]+'BFF";xx&&xz?'+match[1]+'.clearRect(0,0,'+match[2]+','+match[3]+'):'+split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addVirusColorHook(script){var match=script.match(/(\?\(\w\.fillStyle=")/);var split=script.split(match[0]);return split[0]+'||zz&&this.'+v+match[1]+split[1]}
                                                                                                                                                                                                                                                                                                                                                                    function addLeaderboardHook(script){var match=script.match(/4;(\w+)=\[\]/)[1];var split=script.split("for(a.font");script=split[0]+'if('+match+'[2]&&'+match+'[2].id==1&&10>='+match+'[2].name&&'+match+'[2].name>=0){countdown('+match+'[2].name,'+match+'[1].name)};for(a.font'+split[1];match=script.match(/(fillStyle="#FFAAAA")(.+)(\w+)(\+1\+"\. ")/);split=script.split(match[0]);return split[0]+match[1]+',OnLeaderboard('+match[3]+'+1),ilead=true'+match[2]+match[3]+match[4]+split[1]}
                                                                                                                                                                                                                                                                                                                                                                    function addOnCellEatenHook(script){var match=script.match(/(\w+)&&(\w+)&&\((\w+)\.(\w+)/);var split=script.split(match[0]);return split[0]+ match[1]+'&&'+ match[2]+'&&(OnCellEaten('+match[1]+','+match[2]+'),'+ match[3]+'.'+ match[4]+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addOnShowOverlayHook(script){var match=script.match(/:e\("#overlays"\)\.show\(\)/);var split=script.split(match[0]);return split[0]+ match[0]+',OnShowOverlay('+')'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addConnectHook(script){var match=script.match(/console\.log\("Connecting to "\+a\);/);var split=script.split(match[0]);return split[0]+('try{connect2("...")}catch(a){};')+ match[0]+'if(a.indexOf(window.server.ip)==-1){window.server = {ip:"",i:"",location:""};closeChat();}'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addRecieveHook(script){var match=script.match(/\w+\(new DataView\(..data\)\)/);var split=script.split(match[0]);return split[0]+ match[0]+';Recieve(a.data.byteLength);'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addOnSendHook(script){var match=script.match(/\w+\.send\(\w+\.buffer\)/);var split=script.split(match[0]);return split[0]+ match[0]+';OnSend(a.byteLength);'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addOnHideOverlayHook(script){var match=script.match(/\w+\("#overlays"\)\.hide\(\)/);var split=script.split(match[0]);return split[0]+ match[0]+';OnHideOverlay()'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    function addOnDrawHook(script){var match=script.match(/\w+\.width&&(\w+)\.drawImage\(\w+,\w+-\w+\.width-10,10\);/);var split=script.split(match[0]);return split[0]+ match[0]+'setTimeout(function(){OnDraw('+ match[1]+')},0);'+ split[1];}
                                                                                                                                                                                                                                                                                                                                                                    var __STORAGE_PREFIX="mikeyk730__";function LS_getValue(aKey,aDefault){var val=localStorage.getItem(__STORAGE_PREFIX+ aKey);if(null===val&&'undefined'!=typeof aDefault)return aDefault;return val;}
                                                                                                                                                                                                                                                                                                                                                                    function LS_setValue(aKey,aVal){localStorage.setItem(__STORAGE_PREFIX+ aKey,aVal);}
                                                                                                                                                                                                                                                                                                                                                                    function GetRgba(hex_color,opacity)
                                                                                                                                                                                                                                                                                                                                                                    {var patt=/^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;var matches=patt.exec(hex_color);return"rgba("+parseInt(matches[1],16)+","+parseInt(matches[2],16)+","+parseInt(matches[3],16)+","+opacity+")";}
                                                                                                                                                                                                                                                                                                                                                                    function secondsToHms(d)
                                                                                                                                                                                                                                                                                                                                                                    {d=Number(d);var h=Math.floor(d/3600);var m=Math.floor(d%3600/60);var s=Math.floor(d%3600%60);return(h>=1?h+':':'')+(h>=1&&m<10?'0':'')+ m+":"+(s<10?'0':'')+ s;}
                                                                                                                                                                                                                                                                                                                                                                    function tst(a){a?$("#chart-container-agariomods").css({"bottom":"5px","right":"5px","top":"","left":""}):$("#chart-container-agariomods").css({"bottom":"","right":"","top":"3px","left":"5px"});a?($("div#benchmarker").css({"bottom":"25px"}),$("div#toolbar").css({"bottom":"25px"})):($("div#benchmarker").css({"bottom":"10px"}),$("div#toolbar").css({"bottom":"10px"}));}
                                                                                                                                                                                                                                                                                                                                                                    jQuery(document).ready(function()
                                                                                                                                                                                                                                                                                                                                                                                           {if(localStorage.getItem("nick"))document.getElementById("nick").value=localStorage.getItem("nick");jQuery('body').append('<div id="chart-container" class="ui" style="display:none; position:absolute; height:176px; width:300px; left:10px; bottom:44px"></div>\
<div id="chart-container-agariomods" class="ui" style="position:absolute; font-size:17px; right:5px; bottom:5px; /* -webkit-filter: invert(100%); filter: invert(100%); */">&nbsp;VK.COM/DYZAIN_OLEG <b>EDIT</b> OLEG VORONOV ;3</div>\
<div id="debug" class="ui" style="position:absolute; top:5px; left:10px;">\
<div id="time-agariomods" style="color: white; display: none; background-color: rgba(0,0,0,.5); padding:0 4px;"><b>Page Time: </b><span>0</span></div>\
<div id="fps" class="fps-agariomods" style="color: white; display: none; background-color: rgba(0,0,0,.5); padding:0 4px;"><b>Frame Rate: </b><span>0</span>/s</div>\
<div id="dfps" class="fps-agariomods" style="color: white; display: none; background-color: rgba(0,0,0,.5); padding:0 4px;"><b>Dropped Frames: </b><span>0</span>/s</div>\
<div id="pi" class="pio-agariomods" style="color: white; display: none;  background-color: rgba(0,0,0,.5); padding:0 4px;"><b>Packets In: </b><span>0</span>/s</div>\
<div id="po" class="pio-agariomods" style="color: white; display: none;  background-color: rgba(0,0,0,.5); padding:0 4px;"><b>Packets Out: </b><span>0</span>/s</div>\
<div id="bi" class="bio-agariomods" style="color: white; display: none;  background-color: rgba(0,0,0,.5); padding:0 4px;"><b>Download: </b><span>0</span> Bps</div>\
<div id="bo" class="bio-agariomods" style="color: white; display: none;  background-color: rgba(0,0,0,.5); padding:0 4px;"><b>Upload: </b><span>0</span> Bps</div>\
</div>\
');jQuery('#instructions').remove();jQuery('.glyphicon-cog').addClass("glyphicon-refresh")
                                                                                                                                                                                                                                                                                                                                                                                           jQuery('.glyphicon-cog').removeClass("glyphicon-cog");jQuery('.btn-settings').attr('onclick','setR()');jQuery('.btn-login').attr('type','button');jQuery('.btn-settings').attr('type','button');jQuery('.btn-settings').css({'width':'15%','height':'35px'});jQuery('.btn-settings').removeClass("btn-settings");jQuery('#settings').show();var checkbox_div=jQuery('#settings input[type=checkbox]').closest('div');checkbox_div.append('<label><input type="checkbox" id="acid" onchange="setAcid($(this).is(\':checked\'));if($(this).is(\':checked\')){$(\'#bgimg\').attr(\'checked\',false);check(document.getElementById(\'bgimg\'));}">Acid</label>');checkbox_div.append('<label><input type="checkbox" onchange="if(this.checked){jQuery(\'#chart-container\').show()}else{jQuery(\'#chart-container\').hide()}">Show chart</label>');checkbox_div.append('<label><input type="checkbox" onchange="setVColors($(this).is(\':checked\'));">Colorless Viruses</label>');checkbox_div.append('<label><input id="custom" type="checkbox" onchange="setCustom($(this).is(\':checked\'));">No Custom Skins</label>');checkbox_div.append('\
<label nosave><input id="pcson" type="checkbox" onchange="setPCS($(this).is(\':checked\'));">Set Client Skin</label>\
<label nosave><input id="setChat" type="checkbox" onchange="toggleChat()">Ogar Chat Enabled</label>\
<label nosave><input id="bgimg" type="checkbox" onchange="setBG($(this).is(\':checked\'));">Set Background</label>\
<label nosave><input id="toggleTimer" type="checkbox" onchange="setTimer()">Show Benchmarker</label>\
');checkbox_div.append('<label><input type="checkbox" onchange="setTeamMass($(this).is(\':checked\'));">Show Teamed Mass</label>');checkbox_div.append('<label><input id="tskins" type="checkbox" onchange="setTskins($(this).is(\':checked\'));">Team Skins</label>');checkbox_div.append('<label><input type="checkbox" onchange="setMVR($(this).is(\':checked\'));">Maximize View</label>');checkbox_div.append('<div id="sliders" style="white-space:nowrap;display:inline;"><label>SFX<input id="sfx" type="range" value="0" step=".1" min="0" max="1"></label><label>BGM<input type="range" id="bgm" value="0" step=".1" min="0" max="1" oninput="volBGM(this.value);"></label></div>');jQuery('#helloContainer').append('<div id="egstats" style="display:none;"><ul id="stattab" class="nav nav-tabs"><li class="active" data-toggle="tab"><a href="#">Last Game</a></li><li data-toggle="tab" class=""><a href="#">All Time</a></li></ul><div id="lgstats"><div id="statArea" style="vertical-align:top; width:250px; display:inline-block;"></div><div id="pieArea" style="vertical-align: top; float:right;width:248px; height:186px; display:inline-block; vertical-align:top;"> </div><div id="gainArea" style="width:250px;  vertical-align:top;float:left"></div><div id="lossArea" style="width:250px; float:right;"></div><div id="chartArea" style="float:left;width:500px; display:inline-block; vertical-align:top"></div></div><div id="atstats" style="display:none"><div id="atTable" style="vertical-align:top; width:100%; display:inline-block;"></div><br><div id="atList" style="width:250px;  vertical-align:top;float:left"></div><div id="atMass" style="width:250px; float:right;"></div></div></div>');jQuery('#egstats').hide(0);jQuery("#stattab>li:first-child>a").on("click",function(){jQuery("#lgstats").show();jQuery("#atstats").hide()});jQuery("#stattab>li:last-child>a").on("click",function(){jQuery("#atstats").show();jQuery("#lgstats").hide()});var q=$(".agario-profile-name-container");q[0].outerHTML='<div class="ribbon"><a href onclick="confirm(\'You sure you want to log out?\')&&logout(); return false;">Logout</a></div>'+q[0].outerHTML;document.getElementById("options").style.fontSize="14px";document.getElementById("setChat").checked=chatEnabled;document.getElementById("toggleTimer").checked=showt;});window.setTimer=function(){showt=!showt;localStorage.setItem("showt",showt);document.getElementById("toggleTimer").checked=showt;document.getElementById("benchmarker").style.display=showt?"block":"none";}
                                                                                                                                                                                                                                                                                                                                                                    window.toggleChat=function(){chatEnabled=!chatEnabled;document.getElementById("setChat").checked=chatEnabled;localStorage.setItem("chatEnabled",chatEnabled);if(server.ip.substr(-11)==".iomods.com")chatEnabled?openChat():closeChat()};function ResetChart()
                                                                                                                                                                                                                                                                                                                                                                    {chart=null;chart_data.length=0;chart_counter=0;jQuery('#chart-container').empty();}
                                                                                                                                                                                                                                                                                                                                                                    function UpdateChartData(mass)
                                                                                                                                                                                                                                                                                                                                                                    {chart_counter++;if(chart_counter%chart_update_interval>0)
                                                                                                                                                                                                                                                                                                                                                                        return false;chart_data.push({x:chart_counter,y:mass/100});return true;}
                                                                                                                                                                                                                                                                                                                                                                    function CreateChart(e,color,interactive,a,b)
                                                                                                                                                                                                                                                                                                                                                                    {var c={interactivityEnabled:interactive,title:null,axisX:{valueFormatString:" ",lineThickness:0,tickLength:0},axisY:{lineThickness:0,tickLength:0,gridThickness:2,gridColor:"white",labelFontColor:"white"},backgroundColor:"rgba(0,0,0,0.2)",data:[{type:"area",color:color,dataPoints:chart_data}]};if(a){c.width=a;c.height=b;};return new CanvasJS.Chart(e,c);}
                                                                                                                                                                                                                                                                                                                                                                    function UpdateChart(mass,color)
                                                                                                                                                                                                                                                                                                                                                                    {var diff=window.innerHeight-document.getElementById("canvas").height;if(diff!=0)jQuery("div:not(#chartArea)>.canvasjs-chart-container>.canvasjs-chart-canvas").css('bottom',-176+diff);my_color=color;if(chart===null)
                                                                                                                                                                                                                                                                                                                                                                        chart=CreateChart("chart-container",color,false);if(UpdateChartData(mass)&&document.getElementsByClassName(""))
                                                                                                                                                                                                                                                                                                                                                                            chart.render();jQuery('.canvasjs-chart-credit').hide();};function ResetStats(start)
                                                                                                                                                                                                                                                                                                                                                                    {stats={pellets:{num:0,mass:0},w:{num:0,mass:0},cells:{num:0,mass:0},viruses:{num:0,mass:0},birthday:start,time_of_death:null,high_score:0,leader_time:0,top_slot:Number.POSITIVE_INFINITY,gains:{},losses:{},};}
                                                                                                                                                                                                                                                                                                                                                                    function OnGainMass(me,other)
                                                                                                                                                                                                                                                                                                                                                                    {var mass=other.size*other.size;if(other.color=='#ce6363')other.name="Mother Cell";if(other[v]){stats.viruses.num++;if(!window.teams)stats.viruses.mass+=mass;sfx_event(6);}
                                                                                                                                                                                                                                                                                                                                                                     else if(Math.floor(mass)<=400&&!other.name){stats.pellets.num++;stats.pellets.mass+=mass;play_pellet();}
                                                                                                                                                                                                                                                                                                                                                                     else if(!other.name&&mass<=1444&&(mass>=1369||(other.x==other.ox&&other.y==other.oy))){if(other.color!=me.color){stats.w.num++;stats.w.mass+=mass;}
                                                                                                                                                                                                                                                                                                                                                                                                                                                            sfx_event(1);}
                                                                                                                                                                                                                                                                                                                                                                     else{var key=other.name+':'+ other.color;stats.cells.num++;stats.cells.mass+=mass;if(stats.gains[key]==undefined)
                                                                                                                                                                                                                                                                                                                                                                         stats.gains[key]={num:0,mass:0};stats.gains[key].num++;stats.gains[key].mass+=mass;sfx_event(1);}}
                                                                                                                                                                                                                                                                                                                                                                    function OnLoseMass(me,other)
                                                                                                                                                                                                                                                                                                                                                                    {var mass=me.size*me.size;if(other.color=='#ce6363')other.name="Mother Cell";var key=other.name+':'+ other.color;if(stats.losses[key]==undefined)
                                                                                                                                                                                                                                                                                                                                                                        stats.losses[key]={num:0,mass:0};;stats.losses[key].num++;stats.losses[key].mass+=mass;sfx_event(1);}
                                                                                                                                                                                                                                                                                                                                                                    function DrawPie(pellet,w,cells,viruses)
                                                                                                                                                                                                                                                                                                                                                                    {var total=pellet+ w+ cells+ viruses;pie=new CanvasJS.Chart("pieArea",{title:null,animationEnabled:false,legend:{verticalAlign:"center",horizontalAlign:"left",fontSize:12,fontFamily:"Helvetica"},theme:"theme2",height:186,width:248,data:[{type:"pie",startAngle:-20,showInLegend:true,toolTipContent:"{legendText} {y}%",dataPoints:[{y:100*pellet/total,legendText:"pellets"},{y:100*cells/total,legendText:"cells"},{y:100*w/total,legendText:"w"},{y:100*viruses/total,legendText:"viruses"},]}]});pie.render();}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 function GetTopN(n,p)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 {var r=[];var a=Object.keys(stats[p]).sort(function(a,b){return-(stats[p][a].mass- stats[p][b].mass)});for(var i=0;i<n&&i<a.length;++i){var key=a[i];var mass=stats[p][key].mass;var name=key.slice(0,key.length-8);if(!name)name="An unnamed cell";var color=key.slice(key.length-7);r.push({name:name,color:color,mass:Math.floor(mass/100)});}
                                                                                                                                                                                                                                                                                                                                                                     return r;}
                                                                                                                                                                                                                                                                                                                                                                    function AppendTopN(n,p,list)
                                                                                                                                                                                                                                                                                                                                                                    {var a=GetTopN(n,p);for(var i=0;i<a.length;++i){var text='<bdi>'+a[i].name+'</bdi> ('+(p=='gains'?'+':'-')+ a[i].mass+' mass)';list.append('<li style="font-size: 12px; "><div style="width: 10px; height: 10px; border-radius: 50%; margin-right:5px; background-color: '+ a[i].color+'; display: inline-block;"></div>'+ text+'</li>');}
                                                                                                                                                                                                                                                                                                                                                                     return a.length>0;}
                                                                                                                                                                                                                                                                                                                                                                    function DrawStats(game_over)
                                                                                                                                                                                                                                                                                                                                                                    {if(!game_over!=in_game)return;jQuery('#statArea').empty();jQuery('#pieArea').empty();jQuery('#gainArea').empty();jQuery('#lossArea').empty();jQuery('#chartArea').empty();jQuery('#egstats').show();var time=stats.time_of_death==null?Date.now():stats.time_of_death;var seconds=time- stats.birthday;count(seconds);var list=jQuery('<ul>');list.append('<li style="font-size: 12px; ">Game time: '+ mToHms(seconds)+'</li>');list.append('<li style="font-size: 12px; ">High score: '+~~(stats.high_score/100)+'</li>');if(stats.top_slot==Number.POSITIVE_INFINITY){list.append('<li style="font-size: 12px; ">You didn\'t make the leaderboard.</li>');}
                                                                                                                                                                                                                                                                                                                                                                     else{list.append('<li style="font-size: 12px; ">Top Position: '+ stats.top_slot+'</li>');list.append('<li style="font-size: 12px; ">Leaderboard Time: '+ mToHms(stats.leader_time)+'</li>');}
                                                                                                                                                                                                                                                                                                                                                                     list.append('<li style="font-size: 12px; display:none;">XP: <span id="xpg"></span></li>');list.append('<li style="font-size: 12px; padding-top: 15px">'+ stats.pellets.num+" pellets eaten ("+~~(stats.pellets.mass/100)+' mass)</li>');list.append('<li style="font-size: 12px; ">'+ stats.cells.num+" cells eaten ("+~~(stats.cells.mass/100)+' mass)</li>');list.append('<li style="font-size: 12px; ">'+ stats.w.num+" masses eaten ("+~~(stats.w.mass/100)+' mass)</li>');list.append('<li style="font-size: 12px; ">'+ stats.viruses.num+" viruses eaten ("+~~(stats.viruses.mass/100)+' mass)</li>');var totalMass=(~~(stats.pellets.mass/100)+~~(stats.cells.mass/100)+~~(stats.w.mass/100)+~~(stats.viruses.mass/100));list.append('<li style="font-size: 12px; ">Total mass eaten: '+ totalMass+'</li>');jQuery('#statArea').append('<b>Game Summary</b>');jQuery('#statArea').append(list);if(stats.time_of_death!=null){jQuery('#atTable').empty();jQuery('#atList').empty();jQuery('#atMass').empty();localStorage.started||localStorage.setItem("started",Date.now());var attab=jQuery('<table>');var atlist=jQuery('<ul>');var atmass=jQuery('<table>');attab.append('<tr><th>Stat</th><th>Cumulative</th><th>Best</th></tr>');attab.append('<tr><td>Game Time</td><td>'+ mToHms(alltime("alltime",seconds))+'</td><td>'+mToHms(best("time",seconds))+'</td><td></td></tr>');attab.append('<tr><td>Score</td><td>'+ alltime("allscore",~~(stats.high_score/100))+'</td><td>'+ best("highscore",~~(stats.high_score/100))+'</td><td></td></tr>');attab.append('<tr><td>Leaderboard Time</td><td>'+ mToHms(alltime("leaderboard",stats.leader_time))+'</td><td>'+ mToHms(best("leaderboard",stats.leader_time))+'</td><td></td></tr>');attab.append('<tr><td>Players Eaten</td><td>'+ alltime("cells",stats.cells.num)+'</td><td>'+ best("celleat",stats.cells.num)+'</td><td></td></tr>');atlist.append('<li>Games played: '+alltime("played",1)+'</li>')
                                                                                                                                                                                                                                                                                                                                                                     atmass.append('<tr><th>Type</th><th>Number</th><th>Mass</th></tr>');atmass.append('<tr><td>Pellets</td><td>'+ alltime("pellets",stats.pellets.num)+"</td><td>"+ best("pellets",~~(stats.pellets.mass/100))+'</td></tr>');atmass.append('<tr><td>Cells</td><td>'+ alltime("cells")+"</td><td>"+ best("cells",~~(stats.cells.mass/100))+'</td></tr>');atmass.append('<tr><td>W\'s</td><td>'+ alltime("ws",stats.w.num)+"</td><td>"+ best("ws",~~(stats.w.mass/100))+'</td></tr>');atmass.append('<tr><td>Viruses</td><td>'+ alltime("viruses",stats.viruses.num)+"</td><td>"+ best("viruses",~~(stats.viruses.mass/100))+'</td></tr>');jQuery('#atTable').append('<big><b>Summary (Experimental)</b></big>');jQuery('#atTable').append(attab);jQuery('#atList').append(atlist);jQuery('#atMass').append('<b>Mass</b>');jQuery('#atMass').append(atmass);}
                                                                                                                                                                                                                                                                                                                                                                     DrawPie(stats.pellets.mass,stats.w.mass,stats.cells.mass,stats.viruses.mass);jQuery('#gainArea').append('<b>Top Gains</b>');list=jQuery('<ol>');if(AppendTopN(5,'gains',list))
                                                                                                                                                                                                                                                                                                                                                                         jQuery('#gainArea').append(list);else
                                                                                                                                                                                                                                                                                                                                                                             jQuery('#gainArea').append('<ul><li style="font-size: 12px; ">You have not eaten anybody</li></ul>');jQuery('#lossArea').append('<b>Top Losses</b>');list=jQuery('<ol>');if(AppendTopN(5,'losses',list))
                                                                                                                                                                                                                                                                                                                                                                                 jQuery('#lossArea').append(list);else
                                                                                                                                                                                                                                                                                                                                                                                     jQuery('#lossArea').append('<ul><li style="font-size: 12px; ">Nobody has eaten you</li></ul>');if(jQuery('#chart-container').is(':visible')==false&&in_game||!in_game){jQuery('#chartArea').width(500).height(150);stat_chart=CreateChart('chartArea',my_color,true,500,150);stat_chart.render();}
                                                                                                                                                                                                                                                                                                                                                                     else{jQuery('#chartArea').width(500).height(0);}
                                                                                                                                                                                                                                                                                                                                                                     jQuery('.canvasjs-chart-credit').hide();}
                                                                                                                                                                                                                                                                                                                                                                    var styles={heading:{font:"20px Ubuntu",spacing:41,alpha:1},subheading:{font:"18px Ubuntu",spacing:31,alpha:1},normal:{font:"12px Ubuntu",spacing:21,alpha:0.6}}
                                                                                                                                                                                                                                                                                                                                                                    function AppendText(text,context,style)
                                                                                                                                                                                                                                                                                                                                                                    {context.globalAlpha=styles[style].alpha;context.font=styles[style].font;g_stat_spacing+=styles[style].spacing;var width=context.measureText(text).width;g_layout_width=Math.max(g_layout_width,width);context.fillText(text,g_layout_width/2- width/2,g_stat_spacing);}
                                                                                                                                                                                                                                                                                                                                                                    function RenderStats(reset)
                                                                                                                                                                                                                                                                                                                                                                    {if(!stats)return;if(reset)g_layout_width=g_display_width;g_stat_spacing=0;var gains=GetTopN(3,'gains');var losses=GetTopN(3,'losses');var height=30+ styles['heading'].spacing+ styles['subheading'].spacing*2+ styles['normal'].spacing*(4+ gains.length+ losses.length);stat_canvas=document.createElement("canvas");var scale=Math.min(g_display_width,.3*window.innerWidth)/ g_layout_width;
                                                                                                                                                                                                                                                                                                                                                                     stat_canvas.width=g_layout_width*scale;stat_canvas.height=height*scale;var context=stat_canvas.getContext("2d");context.scale(scale,scale);context.globalAlpha=.4;context.fillStyle="#000000";context.fillRect(0,0,g_layout_width,height);context.fillStyle="#FFFFFF";AppendText("Stats",context,'heading');var text=stats.pellets.num+" pellets eaten ("+~~(stats.pellets.mass/100)+")";AppendText(text,context,'normal');text=stats.w.num+" mass eaten ("+~~(stats.w.mass/100)+")";AppendText(text,context,'normal');text=stats.cells.num+" cells eaten ("+~~(stats.cells.mass/100)+")";AppendText(text,context,'normal');text=stats.viruses.num+" viruses eaten ("+~~(stats.viruses.mass/100)+")";AppendText(text,context,'normal');AppendText("Top Gains",context,'subheading');for(var j=0;j<gains.length;++j){text=(j+1)+". "+ gains[j].name+" ("+ gains[j].mass+")";context.fillStyle=gains[j].color;AppendText(text,context,'normal');}
                                                                                                                                                                                                                                                                                                                                                                     context.fillStyle="#FFFFFF";AppendText("Top Losses",context,'subheading');for(var j=0;j<losses.length;++j){text=(j+1)+". "+ losses[j].name+" ("+ losses[j].mass+")";context.fillStyle=losses[j].color;AppendText(text,context,'normal');}}
                                                                                                                                                                                                                                                                                                                                                                    jQuery(window).resize(function(){in_game&&RenderStats(false);});window.OnGameStart=function(cells,start)
                                                                                                                                                                                                                                                                                                                                                                    {jQuery("#lgstats").show();jQuery("#statTab>li:first-child").attr("class","active");jQuery("#atstats").hide();jQuery("#statTab>li:last-child").attr("class","");onwsclose(false);initbench(false);in_game=true;my_cells=cells;ResetChart();ResetStats(start);RenderStats(true);DrawStats(false);if(kd==true){showsh=false;document.getElementById("overlays").style.display="none";document.getElementById("overlays").style.pointerEvents="auto";jQuery("#egstats").appendTo($("#helloContainer"));$("#helloContainer").hide();kd=false;}
                                                                                                                                                                                                                                                                                                                                                                     StartBGM();sfx_play(0);if(localStorage.getItem("played")===null){localStorage.setItem("played",0);}}
                                                                                                                                                                                                                                                                                                                                                                    window.StartBGM=function()
                                                                                                                                                                                                                                                                                                                                                                    {if(document.getElementById("bgm").value==0)return;if(bgmusic.src=="")bgmusic.src="//skins.agariomods.com/botb/"+ tracks[Math.floor(Math.random()*tracks.length)];bgmusic.volume=document.getElementById("bgm").value;bgmusic.play();}
                                                                                                                                                                                                                                                                                                                                                                    window.StopBGM=function()
                                                                                                                                                                                                                                                                                                                                                                    {if(document.getElementById("bgm").value==0)return;bgmusic.pause()
                                                                                                                                                                                                                                                                                                                                                                    bgmusic.src="skins.agariomods.com/botb/"+ tracks[Math.floor(Math.random()*tracks.length)];bgmusic.load()}
                                                                                                                                                                                                                                                                                                                                                                    window.volBGM=function(vol)
                                                                                                                                                                                                                                                                                                                                                                    {bgmusic.volume=document.getElementById("bgm").value;}
                                                                                                                                                                                                                                                                                                                                                                    window.onwsclose=function(a){in_game&&OnDeath(false);window.nav(0,0,false);if(a!==false&&document.getElementById("overlays").style.display=="none")$(document).trigger(jQuery.Event('keydown',{keyCode:'27',which:'27'}));}
                                                                                                                                                                                                                                                                                                                                                                    window.OnDeath=function(){sfx_play(1);StopBGM();if(localStorage.getItem("nick"))document.getElementById("nick").value=localStorage.getItem("nick");stats.time_of_death=Date.now();showsh=false;tst(true);document.getElementById("benchmarker").style.bottom="25px";in_game=false;DrawStats(true);if(kd==true){document.getElementById("overlays").style.display="block";document.getElementById("overlays").style.pointerEvents="auto";jQuery("#egstats").appendTo($("#helloContainer"));$("#helloContainer").show();document.getElementById("helloContainer").style.display="block";kd=false;}}
                                                                                                                                                                                                                                                                                                                                                                    window.OnShowOverlay=function(game_in_progress)
                                                                                                                                                                                                                                                                                                                                                                    {canvas.onmousedown(0,0);tst(true);document.getElementById("benchmarker").style.bottom="25px";DrawStats(false);if(kd==true){document.getElementById("overlays").style.display="block";document.getElementById("overlays").style.pointerEvents="auto";jQuery("#egstats").appendTo($("#helloContainer"));$("#helloContainer").show();kd=false;}
                                                                                                                                                                                                                                                                                                                                                                     if(in_game){showsh=true;}
                                                                                                                                                                                                                                                                                                                                                                     else
                                                                                                                                                                                                                                                                                                                                                                     {showsh=false;}}
                                                                                                                                                                                                                                                                                                                                                                    var fired=false;window.OnHideOverlay=function()
                                                                                                                                                                                                                                                                                                                                                                    {if(fired==true){fired=false;return;}else{fired=true;}
                                                                                                                                                                                                                                                                                                                                                                     if(showsh==true)showsh=false;tst(showfps+showpio+showbio+ptime>0);}
                                                                                                                                                                                                                                                                                                                                                                    window.OnUpdateMass=function(mass)
                                                                                                                                                                                                                                                                                                                                                                    {stats.high_score=Math.max(stats.high_score,mass);UpdateChart(mass,GetRgba(my_cells[0].color,0.4));benchcheck(mass);}
                                                                                                                                                                                                                                                                                                                                                                    window.OnCellEaten=function(predator,prey)
                                                                                                                                                                                                                                                                                                                                                                    {if(!my_cells)return;if(my_cells.indexOf(predator)!=-1){OnGainMass(predator,prey);RenderStats(false);}
                                                                                                                                                                                                                                                                                                                                                                     if(my_cells.indexOf(prey)!=-1){OnLoseMass(prey,predator);RenderStats(false);if(my_cells.length==1&&in_game&&document.getElementById("overlays").style.display!="none"){OnDeath()}}}
                                                                                                                                                                                                                                                                                                                                                                    window.OnLeaderboard=function(position)
                                                                                                                                                                                                                                                                                                                                                                    {stats.top_slot=Math.min(stats.top_slot,position);}
                                                                                                                                                                                                                                                                                                                                                                    window.stillOnLeaderboard=function(a)
                                                                                                                                                                                                                                                                                                                                                                    {if(a!=window.stillOnLeaderboard.leading){window.stillOnLeaderboard.leading=a;if(a)window.stillOnLeaderboard.time=Date.now();return;}else if(!a)return;stats.leader_time+=(Date.now()-window.stillOnLeaderboard.time);window.stillOnLeaderboard.time=Date.now();}
                                                                                                                                                                                                                                                                                                                                                                    window.stillOnLeaderboard.leading=false;var clearfps=Date.now();window.OnDraw=function(context)
                                                                                                                                                                                                                                                                                                                                                                    {if(showfps)document.getElementById("fps").children[1].innerHTML=rate('FPS');display_stats&&stat_canvas&&context.drawImage(stat_canvas,10,10);clearfps=Date.now();}
                                                                                                                                                                                                                                                                                                                                                                    var cleardfps=setTimeout(function(){},1000);window.OnDrop=function()
                                                                                                                                                                                                                                                                                                                                                                    {if(showfps)document.getElementById("dfps").children[1].innerHTML=rate('DFPS');clearTimeout(cleardfps);cleardfps=setTimeout(function(){document.getElementById("dfps").children[1].innerHTML="0"},1000);}
                                                                                                                                                                                                                                                                                                                                                                    window.Recieve=function(a)
                                                                                                                                                                                                                                                                                                                                                                    {if(showbio)document.getElementById("bi").children[1].innerHTML=Math.floor(multirate('BI',a));if(showpio)document.getElementById("pi").children[1].innerHTML=rate('PI');}
                                                                                                                                                                                                                                                                                                                                                                    window.OnSend=function(a)
                                                                                                                                                                                                                                                                                                                                                                    {if(showbio)document.getElementById("bo").children[1].innerHTML=Math.floor(multirate('BO',a))
                                                                                                                                                                                                                                                                                                                                                                    if(showpio)document.getElementById("po").children[1].innerHTML=rate('PO');}
                                                                                                                                                                                                                                                                                                                                                                    function time(a)
                                                                                                                                                                                                                                                                                                                                                                    {document.getElementById("time-agariomods").children[1].innerHTML=mToHms(a-pload);}
                                                                                                                                                                                                                                                                                                                                                                    function rate(z){if(!rate[z]){rate[z]={};rate[z].lastLoop=(new Date()).getMilliseconds();rate[z].count=1;rate[z].packet=0;}
                                                                                                                                                                                                                                                                                                                                                                                     var currentLoop=(new Date()).getMilliseconds();if(rate[z].lastLoop>currentLoop){rate[z].packet=rate[z].count;rate[z].count=1;}else{rate[z].count+=1;}
                                                                                                                                                                                                                                                                                                                                                                                     rate[z].lastLoop=currentLoop;return rate[z].packet;};function multirate(z,v){if(!multirate[z]){multirate[z]={};multirate[z].lastLoop=(new Date()).getMilliseconds();multirate[z].count=v;multirate[z].packet=0;}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  var currentLoop=(new Date()).getMilliseconds();if(multirate[z].lastLoop>currentLoop){multirate[z].packet=multirate[z].count;multirate[z].count=0;}else{multirate[z].count+=v;}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  multirate[z].lastLoop=currentLoop;return multirate[z].packet;};window.onpageshow=function(){pload=Date.now();initbench(true);document.getElementById("bgimg").checked=false;$("div#options label:not([nosave])").change(function(){$("div#options input:checkbox").each(function(){localStorage.setItem("setting"+$(this).parent().text().replace(" ","_"),this.checked);});$("div#options input[type=range]").each(function(){localStorage.setItem("setting"+$(this).parent().text().replace(" ","_"),this.value);});});$("div#options label:not([nosave]) input").each(function(){check(this);});if(localStorage.getItem("nick"))document.getElementById("nick").value=localStorage.getItem("nick");history.replaceState({},document.title,'/');document.getElementById("load").style.display='none';document.getElementById("load").remove();document.getElementById("loadercss").remove();document.getElementById("overlays").style.display='block';document.getElementsByClassName("coord")[0].onkeypress=function(e){var a=!1;if(e.keyCode==(44||13)){e.preventDefault();$(".coord")[1].focus()}else if((48>e.keyCode||e.keyCode>57)&&e.keyCode!=45){e.preventDefault();a=!0}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             if(this.value.length>4){e.preventDefault();$(".coord")[1].focus()}};document.getElementsByClassName("coord")[1].onkeypress=function(e){if((48>e.keyCode||e.keyCode>57)&&e.keyCode!=45){e.preventDefault();a=!0}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    if((48<e.keyCode&&e.keyCode<57)&&(this.value.length==5&&this.value.substr(0,1)=="-"||this.value.length==4)){var a=document.getElementsByClassName("coord");var b=String.fromCharCode(e.charCode!=null?e.charCode:e.keyCode);window.nav(Math.floor(a[0].value),Math.floor(a[1].value),true);$(".coord").blur();}};setTimeout(function(){$("#includedContent>div").animate({scrollTop:$("#includedContent>div").position().top},1500);},750);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  window.check=function(elem){var evt=document.createEvent("HTMLEvents");evt.initEvent("change",false,true);elem.dispatchEvent(evt);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  $(document).ready(function(){$("div#options label:not([nosave]) input:checkbox").each(function(){$(this).attr("checked",(localStorage.getItem("setting"+$(this).parent().text().replace(" ","_")))=="true");});$("div#options label:not([nosave]) input[type=range]").each(function(){$(this).attr("value",(localStorage.getItem("setting"+$(this).parent().text().replace(" ","_"))));});addsbui();});var kd=false;var click
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  $(document).keydown(function(e){if(e.keyCode==90&&!jQuery('#chatinput').is(':visible')){if(kd==false&&document.getElementById("overlays").style.display=='none'){kd=true;document.getElementById("overlays").style.display="block";document.getElementById("overlays").style.pointerEvents="none";jQuery("#egstats").appendTo($("#overlays"));$("#helloContainer").hide();showsh=true;DrawStats(false);}}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.keyCode==84&&!e.altKey&&document.activeElement.type!="text"){setTimer()}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.keyCode==84&&e.altKey){if(confirm("Are you sure you want to delete your saved data on agar.io?\nThis will delete your all of your 'Best' stats, saved settings, and your saved API Key, and also log you out of Facebook from Agar.io.")){localStorage.clear();document.cookie="apikey=";logout();extToggled=!0;window.location=window.location};}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.keyCode==67&&!e.altKey&&document.activeElement.type!="text"){toggleChat()}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.keyCode==67&&e.altKey){var a=localStorage.getItem("ip");var b=prompt("Ogar Connect - Connect to a Private Ogar Server\nEnter IP or URL",(a==null?"":a));if(b==null){return;}else if(b==""){alert("No IP/URL inputed")};b=b.split("ws://").join("").trim();if(b.indexOf("/")==-1&&b.search(/:\d/)!==-1&&b.search(/[a-zA-Z0-9]\.[a-zA-Z0-9]/)!==-1&&encodeURI(b)==b){b="ws://"+b}else{alert("Invalid IP/URL");return;};try{connect(b)}catch(e){alert("Illegal IP/URL");return;};localStorage.setItem("ip",b);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.altKey&&e.keyCode==49){ptime=!ptime;document.getElementById("time-agariomods").style.display=ptime?"block":"none";ptime?time(Date.now()):document.getElementById("time-agariomods").children[1].innerHTML="";tst(showfps+showpio+showbio+ptime>0);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.altKey&&e.keyCode==50){showfps=!showfps;$(".fps-agariomods").css("display",showfps?"block":"none");tst(showfps+showpio+showbio+ptime>0);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.altKey&&e.keyCode==51){showpio=!showpio;$(".pio-agariomods").css("display",showpio?"block":"none");tst(showfps+showpio+showbio+ptime>0);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.altKey&&e.keyCode==52){showbio=!showbio;$(".bio-agariomods").css("display",showbio?"block":"none");tst(showfps+showpio+showbio+ptime>0);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.altKey&&e.keyCode==81&&in_game){return;jQuery("#overlays").show()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  OnDeath(false);Suicide();}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.ctrlKey&&e.keyCode===70&&navigator.userAgent.match("Firefox")){e.preventDefault();if(document.mozFullScreenElement)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  {document.mozCancelFullScreen();}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      else
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      {document.getElementById("overlays").mozRequestFullScreen();}}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.keyCode===46&&navigator.userAgent.match("Firefox")&&document.activeElement.type!="text"){$(document).trigger(jQuery.Event('keydown',{keyCode:'27',which:'27'}));}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  if(e.keyCode==82&&e.altKey){if(ldown)return;ldown=true
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  console.log("pausing");var currentTime=new Date().getTime();while(currentTime+ 500>=new Date().getTime()){}}});$(document).keyup(function(e){if(e.keyCode==90){if(kd==true){kd=false;document.getElementById("overlays").style.display="none";document.getElementById("overlays").style.pointerEvents="auto";jQuery("#egstats").appendTo($("#helloContainer"));$("#helloContainer").show();showsh=false;}}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               if(e.keyCode===27){if(window.dblESC==true){jQuery("#overlays").show();jQuery("#helloContainer").show();jQuery("#mainPanel").show();}else window.dblESC=true;}else window.dblESC=false;if(e.keyCode==82&&e.altKey){if(ldown)ldown=false;}});var m,benchmarker;var benchmarks=["250mass","500mass","1000mass","2500mass","5000mass"];var mass_benchmarks=[250,500,1000,2500,5000];var massPrev=0;$("body").append('<div id="benchmarker"></div>');function initbench(first){$("div#benchmarker").css({"right":"7px","bottom":"25px","backgroundColor":"rgba(0,0,0,0.4)","opacity":"1.0","color":"white","fontFamily":"Ubuntu,Arial,sans-serif","position":"fixed","padding":"10px","padding-bottom":"15px","text-align":"center","pointer-events":"none","z-index":"1000"});if(first){showt?$("div#benchmarker").css({"display":"block"}):$("div#benchmarker").css({"display":"none"});}else{tst(showfps+showpio+showbio+ptime>0);}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         var newHTML='<table>'+'<h3>Benchmarker</h3>'+'<span>Time Elapsed: --:--</span>'+'<tr><th>Benchmark</th><th>Time</th><th>Best</th></tr>'+'<tr id="250mass"><td>250 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>'+'<tr id="500mass"><td>500 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>'+'<tr id="1000mass"><td>1000 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>'+'<tr id="2500mass"><td>2500 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>'+'<tr id="5000mass"><td>5000 Mass</td><td class="time">-----</td><td class="best">-----</td></tr>'+'</table>';$("div#benchmarker").html(newHTML);for(var i=0;i<benchmarks.length;i++){if(localStorage.getItem("best_"+ benchmarks[i])){$("#"+ benchmarks[i]+" .best").html(mToMs(localStorage.getItem("best_"+ benchmarks[i])));}}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $("table").css({"margin":"8px","padding":"8px"});$("div#benchmarker h3").css("text-align","center");$("div#benchmarker span").css({"text-align":"center","display":"inline-block"});$("td,th").css({"padding":"5px","text-align":"left"});$("div#benchmarker h3").css({"margin-top":"4px"});}
                                                                                                                                                                                                                                                                                                                                                                    function count(alt){$("div#benchmarker span").html("Time Elapsed: "+ mToMs(alt?alt:(Date.now()- stats.birthday)));}
                                                                                                                                                                                                                                                                                                                                                                    function mToHms(millis){millis=Math.floor(millis*0.001);var hours=Math.floor(millis/3600);var minutes=Math.floor(millis%3600/60);var seconds=Math.floor(millis%60);return(hours?hours+':':'')+(minutes<10&&hours?'0':'')+ minutes+":"+(seconds<10?'0':'')+ seconds;}
                                                                                                                                                                                                                                                                                                                                                                    function mToMs(millis){millis=Math.floor(millis*0.001);var minutes=Math.floor(millis/60);var seconds=Math.floor(millis%60);return minutes+":"+(seconds<10?'0':'')+ seconds;}
                                                                                                                                                                                                                                                                                                                                                                    function logBenchmark(benchmark,time){if($("#"+ benchmark+" .time").html()=="-----"){flash("#"+benchmark+" .time");console.log("Benchmark set: "+ benchmark+" at "+ mToMs(time));$("#"+ benchmark+" .time").html(mToMs(time));if(localStorage.getItem('best_'+ benchmark)==null||(time<localStorage.getItem('best_'+ benchmark))){console.log("Best time set: "+ benchmark+" at "+ mToMs(time));$("#"+ benchmark+" .best").html(mToMs(time));$("#"+ benchmark+" .best").css({"color":"lime"});localStorage.setItem("best_"+ benchmark,time);}}}
                                                                                                                                                                                                                                                                                                                                                                    function benchcheck(mass){mass=Math.floor(mass/100);for(var i=0;i<mass_benchmarks.length;i++){if((massPrev<mass_benchmarks[i])&&(mass>=mass_benchmarks[i])){logBenchmark(mass_benchmarks[i]+"mass",Date.now()- stats.birthday);}}}
                                                                                                                                                                                                                                                                                                                                                                    var socketscript=document.createElement('script');socketscript.setAttribute("type","text/javascript");socketscript.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js");(document.body||document.head||document.documentElement).appendChild(socketscript);var socket;jQuery(document).keydown(function(e){if(e.keyCode==13||e.keyCode==191){if(jQuery('#chatinput').is(':visible')&&e.keyCode!=191){sendMSG();}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          else if(document.activeElement.type!="text"){e.preventDefault();tChat();jQuery('#chatinputfield').focus();}}});window.connectPrivate=function(location,i,gm){var ip=location.toLowerCase().replace(/ /g,"")+'.iomods.com';var port=(1500+parseInt(i));server.ip=ip;server.i=i;server.location=location;connect("ws://"+ ip+":"+ port);openChat();}
                                                                                                                                                                                                                                                                                                                                                                    function openChat(){apikey=getCookie("apikey");if(chatEnabled){var i=server.i;var ip=server.ip;var location=server.location;socket=io.connect("http://"+ip+":"+(12040+parseInt(i)),{forceNew:true,reconnection:false});socket.on('disconnect',function(){});socket.on('connect',function(){socket.emit("auth",{key:apikey});});socket.on('init',function(){jQuery('#chat').fadeIn();jQuery('#chatlines').empty();addServer("<b>You are now connected to: "+ location+' #'+ i+"</b>");});socket.on('chat',function(data){addLine(data);});socket.on('info',function(data){addServer(data.msg);});}}
                                                                                                                                                                                                                                                                                                                                                                    function getCookie(cname){var name=cname+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1);if(c.indexOf(name)==0)return c.substring(name.length,c.length);}
                                                                                                                                                                                                                                                                                                                                                                                              return"";}
                                                                                                                                                                                                                                                                                                                                                                    window.closeChat=function(){jQuery('#chat').fadeOut();socket&&socket.disconnect();}
                                                                                                                                                                                                                                                                                                                                                                    function addServer(msg){jQuery('#chatlines').append(' *** '+ msg+'<br>');jQuery("#chatlines").animate({scrollTop:$("#chatlines")[0].scrollHeight});}
                                                                                                                                                                                                                                                                                                                                                                    function addLine(data){if(data.name=="")
                                                                                                                                                                                                                                                                                                                                                                        data.name="Unnamed";var escapedname=$("<div>").text(data.name).html();var escapedmsg=$("<div>").text(data.text).html();jQuery('#chatlines').append('<b><a href="#">'+ escapedname+'</a>:</b> <span>'+escapedmsg+'</span><br>');jQuery("#chatlines").animate({scrollTop:$("#chatlines")[0].scrollHeight});}
                                                                                                                                                                                                                                                                                                                                                                    window.sendMSG=function(){if($('#chatinputfield').val().trim()==""){tChat(!0);return}
                                                                                                                                                                                                                                                                                                                                                                                              var msg=jQuery('#chatinputfield').val();jQuery('#chatinputfield').val('');socket.emit('chat',{text:msg});tChat(!0);}
                                                                                                                                                                                                                                                                                                                                                                    window.tChat=function(a){a?jQuery('#chatinput').fadeOut("fast"):jQuery('#chatinput').fadeIn("fast")};window.isVisible=function(){if(jQuery('#chatinput').is(':visible'))
                                                                                                                                                                                                                                                                                                                                                                        return true;else
                                                                                                                                                                                                                                                                                                                                                                            return false;}
                                                                                                                                                                                                                                                                                                                                                                    function handleHash(){if(~window.location.href.indexOf("?")){var q=window.location.search;if(q.substr(0,4)=="?ip="||q.length<7){return};var query=q.substr(1);if(query.substr(0,8)=="fallback"){return true;}else if(document.readyState!=="complete"){return false;}
                                                                                                                                                                                                                                                                                                                                                                                                                                 if(query.indexOf("/")==-1&&query.search(/:\d/)!==-1&&query.search(/[a-zA-Z0-9]\.[a-zA-Z0-9]/)!==-1&&encodeURI(query)==query){try{connect("ws://"+query);alert("Connecting to: "+query);return;}catch(e){alert("Illegal IP/URL");return;}}else{alert("Invalid IP/URL");return;};}else
                                                                                                                                                                                                                                                                                                                                                                                                                                     if(window.location.hash=='#'||window.location.hash==''||window.location.hash.length==6)return;var api=decodeURIComponent(window.location.hash.substr(1)).trim();if(api.indexOf("/")==-1&&api.search(/:\d/)!==-1&&api.search(/[a-zA-Z0-9]\.[a-zA-Z0-9]/)!==-1&&encodeURI(api)==api){window.onload=function(){try{connect("ws://"+api);alert("Joined: "+api);}catch(e){alert("Illegal IP/URL");}};return;};history.replaceState({},document.title,'/');if(getCookie("apikey")==api){alert("You already have this account linked with Agariomods.");return;}
                                                                                                                                                                                                                                                                                                                                                                                          if(api.search(/^{agariomods.com:\d+:[a-f0-9]{8}:[a-zA-Z0-9=]+:[a-zA-Z0-9=]+}$/)==0){var userid=api.split(":")[1];jQuery.ajax({url:"http://connect.agariomods.com/json/nodechatcheck.php?u="+api,dataType:'json',success:function(data){if(getCookie("apikey")!==""){if(!confirm("You already have an account account linked with Agariomods!\nLinking this account will unlink the currently linked account.\nDo you want to continue?"))return;}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 if(data.error!='0'){alert("A Server Error Occured! Error Code: "+(data.error===null?"-1":data.error));}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 else if(data.user_id==userid){document.cookie="apikey="+api;alert("Welcome "+data.username+", you can now chat in our private servers, press C to bring up chat, and press Enter to start typing.\nThe page will now reload.");extToggled=true;window.location=window.location;}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 else{alert("Error: Incorrect API Key");}},error:function(){alert("Error: Failed to establish connection to connect.agariomods.com");}});}else{alert("Error: Invalid API Key/Server Location")}}
                                                                                                                                                                                                                                                                                                                                                                    function openServerbrowser(a){var b=window.openServerbrowser.loading;if(b)return;b=true;jQuery("#rsb").prop("disabled",true);a||jQuery('#serverBrowser').fadeIn();getServers();}
                                                                                                                                                                                                                                                                                                                                                                    window.openServerbrowser=openServerbrowser;function closeServerbrowser(){jQuery('#serverBrowser').fadeOut();}
                                                                                                                                                                                                                                                                                                                                                                    window.closeServerbrowser=closeServerbrowser;function getServers(){var locations=["London Beta","Silicon Valley Beta","Amsterdam","Atlanta Beta","Frankfurt","London","Quebec","Paris","Atlanta","Chicago","Dallas","Los Angeles","Miami","New Jersey","Seattle","Silicon Valley","Sydney","Sydney Beta","Tokyo"].sort();;var lut=["Amsterdam","Frankfurt","London","Quebec","Paris","Atlanta","Chicago","Dallas","Los Angeles","Miami","New Jersey","Seattle","Silicon Valley","Sydney","Tokyo"].sort();;jQuery('#serverlist').empty();var serverlist=Array();var snippet="";snippet='<div class="serverrow"><div  class="servername serveritem" style="display:table-cell"><b style="color: #222">'+ locations[0]+'</b></div><div class="serverrower"><div class="serverrow">';for(var x=l=0;l<lut.length&&x<locations.length;x++){if(locations[x].substring(0,lut[l+1].length)==lut[l+1]){snippet+='</div></div></div><div class="serverrow"><div  class="servername serveritem" style="display:table-cell"><b style="color: #222">'+ locations[x]+'</b></div><div class="serverrower"><div class="serverrow">';l++};for(var i=1;i<=2;i++){serverid=locations[x].toLowerCase().replace(/ /g,"")+ i;snippet+='<a title="'+locations[x]+' #'+i+'" href="#" style="color: black" class="serveritem" id="'+ serverid+'" onclick="connectPrivate(\''+locations[x]+'\', \''+i+'\');closeServerbrowser();return false;">\
<i><span id="player">fetching data...</span> <i class="glyphicon glyphicon-user" /><br id="br"><span id="game" style="font-style:normal;font-weight:bold"></span></i></a>';serverlist.push((locations[x].toLowerCase().replace(/ /g,"")+i));};}
                                                                                                                                                                                                                                                                                                                                                                                                                                       $('#serverlist').append(snippet+="</div></div></div>");jQuery.ajax({url:"http://connect.agariomods.com/json/ogar.json",dataType:'json',timeout:10000,success:function(data){serverinfo(data.games);},error:function(data){directserverinfo(serverlist,0);}});}
                                                                                                                                                                                                                                                                                                                                                                    function serverinfo(games){var errored=[];for(var name in games){if(games.hasOwnProperty(name)){for(var i=0;i<2;i++){var value=name.slice(0,-11)+(i+1);var data=games[name][i];if(!data.hasOwnProperty("error")&&!data.hasOwnProperty("current_players")){jQuery('#'+ value+' #player').css("display","none");jQuery('#'+ value+' .glyphicon-user').css("display","none");jQuery('#'+ value).css({'border':"1px inset #ccc",'border-right':"1px outset #ccc",'border-bottom':"1px outset #ccc","opacity":"0.75","pointerEvents":"none"});jQuery('#'+ value+' #br').css("display","none");jQuery('#'+ value+' #game').css({color:"#f00",display:"block",textShadow:"-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"});jQuery('#'+ value+' #game').text("Connection Failed");}else if(data.error!=null){errored.push(value);}else{$('#'+ value+' #player').text(data.current_players+"/"+ data.max_players);var gm=data.gamemode;gm=hgm(gm,value);$('#'+ value+' #game').text(gm);}}}}
                                                                                                                                                                                                                                                                                                                                                                                               if(errored.length==0){window.openServerbrowser.loading=false;jQuery("#rsb").prop("disabled",false);}else{directserverinfo(errored,0)};}
                                                                                                                                                                                                                                                                                                                                                                    function directserverinfo(list,index){if(index>=list.length){window.openServerbrowser.loading=false;jQuery("#rsb").prop("disabled",false);return;}
                                                                                                                                                                                                                                                                                                                                                                                                          var value=[list[index].slice(0,-1),list[index].substr(-1)];statsurl='http://'+ value[0]+'.iomods.com:'+('808'+ value[1]);jQuery.ajax({url:statsurl,dataType:'json',timeout:5000,success:function(data){$('#'+ list[index]+' #player').text(data.current_players+"/"+ data.max_players);var gm=data.gamemode;gm=hgm(gm,list[index]);$('#'+ list[index]+' #game').text(gm);},error:function(data,err,ngut){jQuery('#'+ list[index]+' #player').css("display","none");jQuery('#'+ list[index]+' .glyphicon-user').css("display","none");jQuery('#'+ list[index]).css({'border':"1px inset #ccc",'border-right':"1px outset #ccc",'border-bottom':"1px outset #ccc","opacity":"0.75","pointerEvents":"none"});jQuery('#'+ list[index]+' #br').css("display","none");jQuery('#'+ list[index]+' #game').css({color:"#f00",display:"block",textShadow:" -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"});var errc='';if(err=="error"){errc="Connection Failed"}else if(err=="timeout"){errc="Connection Timed Out"}else{"Error: "+err.charAt(0).toUpperCase()+err.substr(1)};jQuery('#'+ list[index]+' #game').text(errc);},complete:function(data){document.getElementById("serverBrowser").style.display=="none"||directserverinfo(list,index+1);}});}
                                                                                                                                                                                                                                                                                                                                                                    function hgm(gm,value){if(gm=="Hardcore Free For All"){$('#'+ value).on("click",function(){if(localStorage.getItem("hcffa1")==null){alert("Welcome to Hardcore Free For All!\nThis gamemode is still in testing; differences from FFA are:\n1. Instead of gaining mass fom eating viruses, you'll lose twice the mass.\n2. W's don't have any mass, they only work on viruses.\n3. Most of all, you only gain 2/3 of the mass of cells you eat!\n(and you only need to be 10% bigger than a cell to eat it)\n\nThis gamemode was designed to make the game more challenging.");localStorage.setItem("hcffa1","");}})}else if(gm=="Anonymous Free For All"){$('#'+ value).on("click",function(){if(localStorage.getItem("affa2")==null){alert("Welcome to Anonymous Free For All!\nThis gamemode is just like FFA, except:\n1. There are no names! The leaderboard is just there so you can see if you're on it.\n2. Everyone's color changes every minute! This makes it much harder to identify players by color.\n3. W's don't have any mass, they only work on viruses.\n\nThis gamemode was designed specifically to discourage any organized teaming, if you dont like that kind of stuff.");localStorage.setItem("affa2","");}})}else if(gm=="Developmental Free For All"){$('#'+ value).on("click",function(){if(localStorage.getItem("dffa")==null){alert("Welcome to Developmental Free For All!\nThis gamemode is built to add new ways of playing FFA.\n(And, is still in development, you can give us feedback with that button in the bottom right of your screen)\n\nCurrently, this is the same as FFA, but with the sprint mechanic from Hide and Seek added to it.\n(Also testing anti-team mechanics)\n\nWe'll be adding things like power-ups later on.");localStorage.setItem("dffa","");}})}else if(gm=="Enhanced Teams"){$('#'+ value).on("click",function(){if(localStorage.getItem("eteams2")==null){if(localStorage.getItem("eteams")==null){alert("Welcome to Enhanced Teams!\nThis gamemode is different from Teams in two ways\n1. Pressing Q will toggle allowing yourself to be eaten by teammates\n2. Small cells will not push as much against larger cells");localStorage.setItem("eteams","");}else{alert("Added: 100% ejected mass efficency for teammates");}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 localStorage.setItem("eteams2","");}});}else if(gm=="Hide and Seek"){$('#'+ value).on("click",function(){if(localStorage.getItem("has")==null){alert("Welcome to Hide and Seek!\nWhen the game starts\nA random player is selected as the seeker\nThe other players will have a few seconds to hide\nThen the seeker is released\n\nSeekers are red, Hiders are blue\nWhen a Seeker touches a Hider, they become a Seeker\nWhen you are in a Virus, you can see inside it\nHold Q to sprint\n\nSeeker win when no hiders are left\nHiders win once time runs out");gm="Hide and Seek Beta";localStorage.setItem("has","");}});}
                                                                                                                                                                                                                                                                                                                                                                                           return gm.replace(" Free For All"," FFA").replace("[Arenas] ","");}
                                                                                                                                                                                                                                                                                                                                                                    function addsbui(a){var st=document.createElement("style");st.innerHTML="#pieArea .canvasjs-chart-canvas{bottom:initial !important}#gps span{float:left;background-color:transparent;border:0;font:24px Ubuntu;font-weight:bold;color:#fff;outline:none;box-shadow:none;background-color:rgba(0,0,0,0)}#gps>span{margin-top:3px;font:20px Ubuntu;font-weight:bold}div#gps{position:absolute;top:0;left:50%;transform:translateX(-50%);padding:6px 10px;float:left;color:#fff;font-weight:700;background-color:rgba(0,0,0,0.3);white-space:nowrap}div#coords{padding:2px;float:left;color:#fff;white-space:nowrap;background-color:rgba(0,0,0,0.3)}input.coord{font:23px Ubuntu;float:left;width:70px;margin:0 2px;color:#fff;background:transparent;font-weight:normal;white-space:nowrap;outline:none}.serverrower{table-layout: fixed;display:table;height:40px;width:100%}.serverrow{display:table-row;height:40px;}.serveritem{vertical-align:middle;text-decoration:none;display:table-cell;width:40px;height:40px;border:1px solid #ccc;padding:4px;}.servername{width:100px}.serveritem:not(.servername):hover{text-decoration:none;background-color:#E9FCFF;}.overlay{line-height:1.2;margin:0;font-family:sans-serif;text-align:center;position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;background-color:rgba(0,0,0,0.2)}.popupbox{position:absolute;height:100%;width:60%;left:20%;background-color:rgba(255,255,255,0.95);box-shadow:0 0 20px #000}.popheader{position:absolute;top:0;width:100%;height:50px;background-color:rgba(200,200,200,0.5)}.browserfilter{position:absolute;padding:5px;top:50px;width:100%;height:60px;background-color:rgba(200,200,200,0.5)}.scrollable{position:absolute;width:100%;top:50px;bottom:50px;overflow:auto;overflow-x:hidden;}.popupbuttons{background-color:rgba(200,200,200,0.4);height:50px;position:absolute;bottom:0;width:100%}.popupbox td,.popupbox th{padding:5px}.popupbox tbody tr{border-top:#ccc solid 1px}#tooltip{display:inline;position:relative}#tooltip:hover:after{background:#333;background:rgba(0,0,0,.8);border-radius:5px;bottom:26px;color:#fff;content:attr(title);left:20%;padding:5px 15px;position:absolute;z-index:98;width:220px}#chat{z-index:2000;width:500px;position:absolute;right:15px;bottom:25px}#chatinput{bottom:0;position:absolute;opacity:.8}#chatlines a{color:#086A87}#chatlines{pointer-events:none;position:absolute;bottom:40px;width:500px;color:#333;word-wrap:break-word;box-shadow:0 0 10px #111;background-color:rgba(0,0,0,0.1);border-radius:5px;padding:5px;height:200px;overflow:auto}.listing>span{display:block;font-size:11px;font-weight:400;color:#999}.list{padding:0 0;list-style:none;display:block;font:12px/20px 'Lucida Grande',Verdana,sans-serif}.listing{border-bottom:1px solid #e8e8e8;display:block;padding:10px 12px;font-weight:700;color:#555;text-decoration:none;cursor:pointer;line-height:18px}li:last-child > .listing{border-radius:0 0 3px 3px}.listing:hover{background:#e5e5e5}";document.head.appendChild(st);jQuery('body').append('<div id="serverBrowser" class="overlay" style="display:none;"><div class="valign"><div class="popupbox"><div class="popheader"><h3>PRIVATE</h3></div>\
<div class="scrollable"><div id="serverlist" style="width:100%;"></div></div><div class="popupbuttons"><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style=" display: block; float: left; "> <input type="hidden" name="cmd" value="_s-xclick"> <input type="hidden" name="hosted_button_id" value="TJBQTYEC9NWZS">  <img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1"> </form><button onclick="closeServerbrowser()" type="button" style="transform:translateX(-74%);margin:4px"\
class="btn btn-danger">Back</button><button id="rsb" onclick="openServerbrowser(true)" class="btn btn-info" type="button" style="float:right;margin:4px;">Refresh <i class="glyphicon glyphicon-refresh"></i></button></div></div></div></div>');if(a)return;jQuery('#settings').prepend('<button type="button" id="opnBrowser" onclick="openServerbrowser();" style="position:relative;top:-8px;width:100%" class="btn btn-success">PRIVATE SERVERS</button><br>');jQuery('body').append('<div id="chat" style="display:none"><div id="chatlines"></div><div id="chatinput" style="display:none" class="input-group">\
<input type="text" id="chatinputfield" class="form-control" maxlength="120" onblur="tChat(!0)"><span class="input-group-btn">\
<button onclick="sendMSG()" class="btn btn-default" type="button">Send</button></span></div></div><div id="gps" style="display:none"><span>GPS (X,Y):&nbsp</span><div id="coords"><span>(</span><input min="0" type="text" class="coord" maxlength="5"/><span>,</span><input min="0" type="text" class="coord"  maxlength="5"/><span>)</span></div><button style="margin-left:5px" class="btn btn-info" onclick="var a=document.getElementsByClassName(\'coord\');window.nav(Math.floor(a[0].value),Math.floor(a[1].value),true);$(\'.coord\').blur()">Go</button><button style="margin-left:5px" class="btn btn-danger" onclick="nav(0,0,false)">Stop</button></div>');};function best(name,data){if(data){var oldData=localStorage.getItem("best_"+name);if(typeof localStorage.getItem("best_"+name)==undefined){oldData=0;}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            if(data>oldData){localStorage.setItem("best_"+name,data);}}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   if(localStorage.getItem("best_"+name)!=null){return localStorage.getItem("best_"+name)}else{return'0'};}
                                                                                                                                                                                                                                                                                                                                                                    function alltime(name,data){data*=1;var a=localStorage.getItem("total_"+name);if(a==null){a=0;}else a=parseFloat(a);if(data){a+=data;localStorage.setItem("total_"+name,a);}
                                                                                                                                                                                                                                                                                                                                                                                                return a;}
                                                                                                                                                                                                                                                                                                                                                                    var flashms=725;function flash(item){$(item).css({"background-color":"white","color":"black"});setTimeout(function(){$(item).css({"background-color":"transparent","color":"white"})},flashms);setTimeout(function(){$(item).css({"background-color":"white","color":"black"})},flashms*2);setTimeout(function(){$(item).css({"background-color":"transparent","color":"white"})},flashms*3);setTimeout(function(){$(item).css({"background-color":"white","color":"black"})},flashms*4);setTimeout(function(){$(item).css({"background-color":"transparent","color":"white"})},flashms*5);}})();}catch(e){window.onmoderror()}

i18n_lang = 'en';
i18n_dict = {
    'en': {
        'connecting': 'Connecting',
        'connect_help': 'If you cannot connect to the servers, check if you have some anti virus or firewall blocking the connection.',
        'play': 'ORC',
        'spectate': 'Spectate',
        'login_and_play': 'Login and play',
        'play_as_guest': 'Play as guest',
        'share': 'Share',
        'advertisement': 'VK.COM/DYZAIN_OLEG',
        'privacy_policy': 'Privacy Policy',
        'terms_of_service': 'Terms of Service',
        'changelog': 'Changelog',
        'instructions_mouse': 'Move your mouse to control your cell',
        'instructions_space': 'Press <b>Space</b> to split',
        'instructions_w': 'Press <b>W</b> to eject some mass',
        'gamemode_ffa': 'FFA',
        'gamemode_teams': 'Teams',
        'gamemode_experimental': 'Experimental',
        'region_select': ' -- Select a Region -- ',
        'region_us_east': 'US East',
        'region_us_west': 'US West',
        'region_north_america': 'North America',
        'region_south_america': 'South America',
        'region_europe': 'Europe',
        'region_turkey': 'Turkey',
        'region_poland': 'Poland',
        'region_east_asia': 'East Asia',
        'region_russia': 'Russia',
        'region_china': 'China',
        'region_oceania': 'Oceania',
        'region_australia': 'Australia',
        'region_players': 'players',
        'option_no_skins': 'No skins',
        'option_no_names': 'No names',
        'option_dark_theme': 'Dark theme',
        'option_no_colors': 'No colors',
        'option_show_mass': 'Show mass',
        'leaderboard': 'TOP',
        'unnamed_cell': 'An unnamed cell',
        'last_match_results': 'Last match results',
        'score': 'Score',
        'leaderboard_time': 'Leaderboard Time',
        'mass_eaten': 'Mass Eaten',
        'top_position': 'Top Position',
        'position_1': 'First',
        'position_2': 'Second',
        'position_3': 'Third',
        'position_4': 'Fourth',
        'position_5': 'Fifth',
        'position_6': 'Sixth',
        'position_7': 'Seventh',
        'position_8': 'Eighth',
        'position_9': 'Ninth',
        'position_10': 'Tenth',
        'player_cells_eaten': 'Player Cells Eaten',
        'survival_time': 'Survival Time',
        'games_played': 'Games played',
        'highest_mass': 'Highest mass',
        'total_cells_eaten': 'Total cells eaten',
        'total_mass_eaten': 'Total mass eaten',
        'longest_survival': 'Longest survival',
        'logout': 'Logout',
        'stats': 'Stats',
        'shop': 'Shop',
        'party': 'Party',
        'party_description': 'Play with your friends in the same map',
        'create_party': 'Creates',
        'creating_party': 'Creating party...',
        'join_party': 'Join',
        'back_button': 'Back',
        'joining_party': 'Joining party...',
        'joined_party_instructions': 'You are now playing with this party:',
        'party_join_error': 'There was a problem joining that party, please make sure the code is correct, or try creating another party',
        'login_tooltip': 'Login with Facebook and get:<br\xA0/><br /><br />Start the game with more mass!<br />Level up to get even more starting mass!',
        'create_party_instructions': 'Give this link to your friends:',
        'join_party_instructions': 'Your friend should have given you a code, type it here:',
        'continue': 'Continue',
        'option_skip_stats': 'Skip stats',
        'stats_food_eaten': 'food eaten',
        'stats_highest_mass': 'highest mass',
        'stats_time_alive': 'time alive',
        'stats_leaderboard_time': 'leaderboard time',
        'stats_cells_eaten': 'cells eaten',
        'stats_top_position': 'top position',
        '': ''
    },
    '?': {}
};
i18n_lang = (window.navigator.userLanguage || window.navigator.language || 'en').split('-')[0];
if (!i18n_dict.hasOwnProperty(i18n_lang)) {
    i18n_lang = 'en';
}
i18n = i18n_dict[i18n_lang];

jQuery("#canvas").remove();
jQuery("#connecting").after('<canvas id="canvas" width="800" height="600"></canvas>');

(function(window, $) {
    function Init() {
        g_drawLines = true;
        PlayerStats();
        setInterval(PlayerStats, 180000);
        g_canvas = g_canvas_ = document.getElementById('canvas');
        g_context = g_canvas.getContext('2d');
        g_canvas.onmousedown = function(event) {
            if (g_touchCapable) {
                var deltaX = event.clientX - (5 + g_ready / 5 / 2);
                var deltaY = event.clientY - (5 + g_ready / 5 / 2);
                if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= g_ready / 5 / 2) {
                    SendPos();
                    SendCmd(17);
                    return;
                }
            }
            g_mouseX = 1 * event.clientX;
            g_mouseY = 1 * event.clientY;
            UpdatePos();
            SendPos();
        };
        g_canvas.onmousemove = function(event) {
            g_mouseX = 1 * event.clientX;
            g_mouseY = 1 * event.clientY;
            UpdatePos();
        };
        g_canvas.onmouseup = function() {};
        if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener('DOMMouseScroll', WheelHandler, false);
        } else {
            document.body.onmousewheel = WheelHandler;
        }
        var spaceDown = false;
        var cachedSkin = false;
        var wkeyDown = false;
        var gkeyDown = false;
        var ekeyDown = false;

        function handleQuickFeed() {
            if (ekeyDown) {
                SendPos();
                SendCmd(21);            
                setTimeout(handleQuickFeed, 142);
            }
        }

        window.onkeydown = function(event) {
            if (!(32 != event.keyCode || spaceDown)) {
                SendPos();
                SendCmd(17);
                spaceDown = true;
            }
            if (!(81 != event.keyCode || cachedSkin)) {
                SendCmd(18);
                cachedSkin = true;
            }
            if (!(87 != event.keyCode || wkeyDown)) {
                SendPos();
                SendCmd(21);
                wkeyDown = true;
            }
            if (!(71 != event.keyCode || gkeyDown)) {
                showGrid = window.localStorage.showGrid = !showGrid;
                gkeyDown = true;
            }
            if (!(69 != event.keyCode || gkeyDown)) {
                ekeyDown = true;
                handleQuickFeed();
            }
            if (27 == event.keyCode) {
                __unmatched_10(300);
            }
        };
        window.onkeyup = function(event) {
            if (32 == event.keyCode) {
                spaceDown = false;
            }
            if (87 == event.keyCode) {
                wkeyDown = false;
            }
            if (71 == event.keyCode) {
                gkeyDown = false;
            }
            if (69 == event.keyCode) {
                ekeyDown = false;
            }
            if (81 == event.keyCode && cachedSkin) {
                SendCmd(19);
                cachedSkin = false;
            }
        };
        window.onblur = function() {
            SendCmd(19);
            wkeyDown = gkeyDown = ekeyDown = cachedSkin = spaceDown = false;
        };
        window.onresize = ResizeHandler;
        window.requestAnimationFrame(__unmatched_135);
        setInterval(SendPos, 40);
        if (g_region) {
            $('#region').val(g_region);
        }
        SyncRegion();
        SetRegion($('#region').val());
        if (0 == __unmatched_114 && g_region) {
            Start();
        }
        __unmatched_10(0);
        ResizeHandler();
        if (window.location.hash && 6 <= window.location.hash.length) {
            RenderLoop(window.location.hash);
        }
    }
    function WheelHandler(event) {
        g_zoom *= Math.pow(0.9, event.wheelDelta / -120 || event.detail || 0);
    }
    function UpdateTree() {
        if (0.4 > g_scale) {
            g_pointTree = null;
        } else {
            for (var minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, i = 0; i < g_cells.length; i++) {
                var cell = g_cells[i];
                if (!(!cell.H() || cell.L || 20 >= cell.size * g_scale)) {
                    minX = Math.min(cell.x - cell.size, minX);
                    minY = Math.min(cell.y - cell.size, minY);
                    maxY = Math.max(cell.x + cell.size, maxY);
                    maxX = Math.max(cell.y + cell.size, maxX);
                }
            }
            g_pointTree = QTreeFactory.X({
                ba: minX - 10,
                ca: minY - 10,
                Z: maxY + 10,
                $: maxX + 10,
                fa: 2,
                ha: 4
            });
            for (i = 0; i < g_cells.length; i++) {
                if (cell = g_cells[i], cell.H() && !(20 >= cell.size * g_scale)) {
                    for (minX = 0; minX < cell.a.length; ++minX) {
                        minY = cell.a[minX].x;
                        maxY = cell.a[minX].y;
                        if (!(minY < g_viewX - g_ready / 2 / g_scale || maxY < g_viewY - noClip / 2 / g_scale || minY > g_viewX + g_ready / 2 / g_scale || maxY > g_viewY + noClip / 2 / g_scale)) {
                            g_pointTree.Y(cell.a[minX]);
                        }
                    }
                }
            }
        }
    }
    function UpdatePos() {
        g_moveX = (g_mouseX - g_ready / 2) / g_scale + g_viewX;
        g_moveY = (g_mouseY - noClip / 2) / g_scale + g_viewY;
    }
    function PlayerStats() {
        if (null == g_regionLabels) {
            g_regionLabels = {};
            $('#region').children().each(function() {
                var $this = $(this);
                var val = $this.val();
                if (val) {
                    g_regionLabels[val] = $this.text();
                }
            });
        }
        $.get(g_protocol + 'info', function(data) {
            var regionNumPlayers = {};
            var region;
            for (region in data.regions) {
                var region_ = region.split(':')[0];
                regionNumPlayers[region_] = regionNumPlayers[region_] || 0;
                regionNumPlayers[region_] += data.regions[region].numPlayers;
            }
            for (region in regionNumPlayers) {
                $('#region option[value="' + region + '"]').text(g_regionLabels[region] + ' (' + regionNumPlayers[region] + ' players)');
            }
        }, 'json');
    }
    function HideOverlay() {
        $('#adsBottom').hide();
        $('#overlays').hide();
        $('#stats').hide();
        $('#mainPanel').hide();
        __unmatched_147 = g_playerCellDestroyed = false;
        SyncRegion();
        __unmatched_14(window.aa.concat(window.ac));
    }
    function SetRegion(val) {
        if (val && val != g_region) {
            if ($('#region').val() != val) {
                $('#region').val(val);
            }
            g_region = window.localStorage.location = val;
            $('.region-message').hide();
            $('.region-message.' + val).show();
            $('.btn-needs-server').prop('disabled', false);
            if (g_drawLines) {
                Start();
            }
        }
    }
    function __unmatched_10(char) {
        if (!(g_playerCellDestroyed || __unmatched_147)) {
            g_nick = null;
            if (!__unmatched_122) {
                $('#adsBottom').show();
                $('#g300x250').hide();
                $('#a300x250').show();
            }
            __unmatched_13(__unmatched_122 ? window.ac : window.aa);
            __unmatched_122 = false;
            if (1000 > char) {
                qkeyDown = 1;
            }
            g_playerCellDestroyed = true;
            $('#mainPanel').show();
            if (0 < char) {
                $('#overlays').fadeIn(char);
            } else {
                $('#overlays').show();
            }
        }
    }
    function n(rect) {
        $('#helloContainer').attr('data-gamemode', rect);
        __unmatched_97 = rect;
        $('#gamemode').val(rect);
    }
    function SyncRegion() {
        if ($('#region').val()) {
            window.localStorage.location = $('#region').val();
        } else if (window.localStorage.location) {
            $('#region').val(window.localStorage.location);
        }
        if ($('#region').val()) {
            $('#locationKnown').append($('#region'));
        } else {
            $('#locationUnknown').append($('#region'));
        }
    }
    function __unmatched_13(__unmatched_180) {
        if (window.googletag) {
            window.googletag.cmd.push(function() {
                if (g_canRefreshAds) {
                    g_canRefreshAds = false;
                    setTimeout(function() {
                        g_canRefreshAds = true;
                    }, 60000 * g_refreshAdsCooldown);
                    if (window.googletag && window.googletag.pubads && window.googletag.pubads().refresh) {
                        window.googletag.pubads().refresh(__unmatched_180);
                    }
                }
            });
        }
    }
    function __unmatched_14(__unmatched_181) {
        if (window.googletag && window.googletag.pubads && window.googletag.pubads().clear) {
            window.googletag.pubads().clear(__unmatched_181);
        }
    }
    function Render(i) {
        return window.i18n[i] || window.i18n_dict.en[i] || i;
    }
    function FindGame() {
        var __unmatched_183 = ++__unmatched_114;
        console.log('Find ' + g_region + __unmatched_97);
        $.ajax(g_protocol + 'findServer', {
            error: function() {
                setTimeout(FindGame, 1000);
            },
            success: function(point) {
                if (__unmatched_183 == __unmatched_114) {
                    if (point.alert) {
                        alert(point.alert);
                    }
                    Connect('ws://' + point.ip, point.token);
                }
            },
            dataType: 'json',
            method: 'POST',
            cache: false,
            crossDomain: true,
            data: (g_region + __unmatched_97 || '?') + '\n154669603'
        });
    }
    function Start() {
        if (g_drawLines && g_region) {
            $('#connecting').show();
            FindGame();
        }
    }
    function Connect(address, ticket) {
        if (g_socket) {
            g_socket.onopen = null;
            g_socket.onmessage = null;
            g_socket.onclose = null;
            try {
                g_socket.close();
            } catch (exception) {}
            g_socket = null;
        }
        if (__unmatched_116.ip) {
            address = 'ws://' + __unmatched_116.ip;
        }
        if (null != __unmatched_126) {
            var __unmatched_187 = __unmatched_126;
            __unmatched_126 = function() {
                __unmatched_187(ticket);
            };
        }
        if (g_secure) {
            var parts = address.split(':');
            address = parts[0] + 's://ip-' + parts[1].replace(/\./g, '-').replace(/\//g, '') + '.tech.agar.io:' + +parts[2];
        }
        g_playerCellIds = [];
        g_playerCells = [];
        g_cellsById = {};
        g_cells = [];
        g_destroyedCells = [];
        g_scoreEntries = [];
        g_leaderboardCanvas = g_scorePartitions = null;
        g_maxScore = 0;
        g_connectSuccessful = false;
        console.log('Connecting to ' + address);
        g_socket = new WebSocket(address);
        g_socket.binaryType = 'arraybuffer';
        g_socket.onopen = function() {
            var data;
            console.log('socket open');
            data = GetBuffer(5);
            data.setUint8(0, 254);
            data.setUint32(1, 5, true);
            SendBuffer(data);
            data = GetBuffer(5);
            data.setUint8(0, 255);
            data.setUint32(1, 154669603, true);
            SendBuffer(data);
            data = GetBuffer(1 + ticket.length);
            data.setUint8(0, 80);
            for (var i = 0; i < ticket.length; ++i) {
                data.setUint8(i + 1, ticket.charCodeAt(i));
            }
            SendBuffer(data);
            RefreshAds();
        };
        g_socket.onmessage = MessageHandler;
        g_socket.onclose = CloseHandler;
        g_socket.onerror = function() {
            console.log('socket error');
        };
    }
    function GetBuffer(size) {
        return new DataView(new ArrayBuffer(size));
    }
    function SendBuffer(data) {
        g_socket.send(data.buffer);
    }
    function CloseHandler() {
        if (g_connectSuccessful) {
            g_retryTimeout = 500;
        }
        console.log('socket close');
        setTimeout(Start, g_retryTimeout);
        g_retryTimeout *= 2;
    }
    function MessageHandler(data) {
        Receive(new DataView(data.data));
    }
    function Receive(data) {
        function __unmatched_196() {
            for (var string = '';;) {
                var char = data.getUint16(pos, true);
                pos += 2;
                if (0 == char) {
                    break;
                }
                string += String.fromCharCode(char);
            }
            return string;
        }
        var pos = 0;
        if (240 == data.getUint8(pos)) {
            pos += 5;
        }
        switch (data.getUint8(pos++)) {
            case 16:
                ParseCellUpdates(data, pos);
                break;
            case 17:
                g_viewX_ = data.getFloat32(pos, true);
                pos += 4;
                g_viewY_ = data.getFloat32(pos, true);
                pos += 4;
                g_scale_ = data.getFloat32(pos, true);
                pos += 4;
                break;
            case 20:
                g_playerCells = [];
                g_playerCellIds = [];
                break;
            case 21:
                g_linesY_ = data.getInt16(pos, true);
                pos += 2;
                g_linesX_ = data.getInt16(pos, true);
                pos += 2;
                if (!__unmatched_100) {
                    __unmatched_100 = true;
                    g_linesX = g_linesY_;
                    g_linesY = g_linesX_;
                }
                break;
            case 32:
                g_playerCellIds.push(data.getUint32(pos, true));
                pos += 4;
                break;
            case 49:
                if (null != g_scorePartitions) {
                    break;
                }
                var num = data.getUint32(pos, true);
                var pos = pos + 4;
                g_scoreEntries = [];
                for (var i = 0; i < num; ++i) {
                    var id = data.getUint32(pos, true);
                    var pos = pos + 4;
                    g_scoreEntries.push({
                        id: id,
                        name: __unmatched_196()
                    });
                }
                UpdateLeaderboard();
                break;
            case 50:
                g_scorePartitions = [];
                num = data.getUint32(pos, true);
                pos += 4;
                for (i = 0; i < num; ++i) {
                    g_scorePartitions.push(data.getFloat32(pos, true));
                    pos += 4;
                }
                UpdateLeaderboard();
                break;
            case 64:
                g_minX = data.getFloat64(pos, true);
                pos += 8;
                g_minY = data.getFloat64(pos, true);
                pos += 8;
                g_maxX = data.getFloat64(pos, true);
                pos += 8;
                g_maxY = data.getFloat64(pos, true);
                pos += 8;
                g_viewX_ = (g_maxX + g_minX) / 2;
                g_viewY_ = (g_maxY + g_minY) / 2;
                g_scale_ = 1;
                if (0 == g_playerCells.length) {
                    g_viewX = g_viewX_;
                    g_viewY = g_viewY_;
                    g_scale = g_scale_;
                }
                break;
            case 81:
                var x = data.getUint32(pos, true);
                var pos = pos + 4;
                var __unmatched_202 = data.getUint32(pos, true);
                var pos = pos + 4;
                var __unmatched_203 = data.getUint32(pos, true);
                var pos = pos + 4;
                setTimeout(function() {
                    __unmatched_44({
                        d: x,
                        e: __unmatched_202,
                        c: __unmatched_203
                    });
                }, 1200);
        }
    }
    function ParseCellUpdates(data, pos) {
        function __unmatched_208() {
            for (var string = '';;) {
                var id = data.getUint16(pos, true);
                pos += 2;
                if (0 == id) {
                    break;
                }
                string += String.fromCharCode(id);
            }
            return string;
        }
        function __unmatched_209() {
            for (var __unmatched_224 = '';;) {
                var r = data.getUint8(pos++);
                if (0 == r) {
                    break;
                }
                __unmatched_224 += String.fromCharCode(r);
            }
            return __unmatched_224;
        }
        __unmatched_109 = g_time = Date.now();
        if (!g_connectSuccessful) {
            g_connectSuccessful = true;
            __unmatched_25();
        }
        __unmatched_90 = false;
        var num = data.getUint16(pos, true);
        pos += 2;
        for (var i = 0; i < num; ++i) {
            var cellA = g_cellsById[data.getUint32(pos, true)];
            var cellB = g_cellsById[data.getUint32(pos + 4, true)];
            pos += 8;
            if (cellA && cellB) {
                cellB.R();
                cellB.o = cellB.x;
                cellB.p = cellB.y;
                cellB.n = cellB.size;
                cellB.C = cellA.x;
                cellB.D = cellA.y;
                cellB.m = cellB.size;
                cellB.K = g_time;
                __unmatched_50(cellA, cellB);
            }
        }
        for (i = 0;;) {
            num = data.getUint32(pos, true);
            pos += 4;
            if (0 == num) {
                break;
            }
            ++i;
            var size;
            var cellA = data.getInt32(pos, true);
            pos += 4;
            cellB = data.getInt32(pos, true);
            pos += 4;
            size = data.getInt16(pos, true);
            pos += 2;
            var flags = data.getUint8(pos++);
            var y = data.getUint8(pos++);
            var b = data.getUint8(pos++);
            var y = __unmatched_41(flags << 16 | y << 8 | b);
            var b = data.getUint8(pos++);
            var isVirus = !!(b & 1);
            var isAgitated = !!(b & 16);
            var __unmatched_220 = null;
            if (b & 2) {
                pos += 4 + data.getUint32(pos, true);
            }
            if (b & 4) {
                __unmatched_220 = __unmatched_209();
            }
            var name = __unmatched_208();
            var flags = null;
            if (g_cellsById.hasOwnProperty(num)) {
                flags = g_cellsById[num];
                flags.J();
                flags.o = flags.x;
                flags.p = flags.y;
                flags.n = flags.size;
                flags.color = y;
            } else {
                flags = new Cell(num, cellA, cellB, size, y, name);
                g_cells.push(flags);
                g_cellsById[num] = flags;
                flags.ia = cellA;
                flags.ja = cellB;
            }
            flags.f = isVirus;
            flags.j = isAgitated;
            flags.C = cellA;
            flags.D = cellB;
            flags.m = size;
            flags.K = g_time;
            flags.T = b;
            if (__unmatched_220) {
                flags.V = __unmatched_220;
            }
            if (name) {
                flags.t(name);
            }
            if (-1 != g_playerCellIds.indexOf(num) && -1 == g_playerCells.indexOf(flags)) {
                g_playerCells.push(flags);
                if (1 == g_playerCells.length) {
                    g_viewX = flags.x;
                    g_viewY = flags.y;
                    __unmatched_141();
                    document.getElementById('overlays').style.display = 'none';
                    points = [];
                    __unmatched_145 = 0;
                    __unmatched_146 = g_playerCells[0].color;
                    __unmatched_148 = true;
                    __unmatched_149 = Date.now();
                    g_mode = __unmatched_152 = __unmatched_151 = 0;
                }
            }
        }
        cellA = data.getUint32(pos, true);
        pos += 4;
        for (i = 0; i < cellA; i++) {
            num = data.getUint32(pos, true);
            pos += 4;
            flags = g_cellsById[num];
            if (null != flags) {
                flags.R();
            }
        }
        if (__unmatched_90 && 0 == g_playerCells.length) {
            __unmatched_150 = Date.now();
            __unmatched_148 = false;
            if (!(g_playerCellDestroyed || __unmatched_147)) {
                if (__unmatched_154) {
                    __unmatched_13(window.ab);
                    ShowOverlay();
                    __unmatched_147 = true;
                    $('#overlays').fadeIn(3000);
                    $('#stats').show();
                } else {
                    __unmatched_10(3000);
                }
            }
        }
    }
    function __unmatched_25() {
        $('#connecting').hide();
        SendNick();
        if (__unmatched_126) {
            __unmatched_126();
            __unmatched_126 = null;
        }
        if (null != __unmatched_128) {
            clearTimeout(__unmatched_128);
        }
        __unmatched_128 = setTimeout(function() {
            if (window.ga) {
                ++__unmatched_129;
                window.ga('set', 'dimension2', __unmatched_129);
            }
        }, 10000);
    }
    function SendPos() {
        if (IsConnected()) {
            var deltaY = g_mouseX - g_ready / 2;
            var delta = g_mouseY - noClip / 2;
            if (!(64 > deltaY * deltaY + delta * delta || 0.01 > Math.abs(g_lastMoveY - g_moveX) && 0.01 > Math.abs(g_lastMoveX - g_moveY))) {
                g_lastMoveY = g_moveX;
                g_lastMoveX = g_moveY;
                deltaY = GetBuffer(13);
                deltaY.setUint8(0, 16);
                deltaY.setInt32(1, g_moveX, true);
                deltaY.setInt32(5, g_moveY, true);
                deltaY.setUint32(9, 0, true);
                SendBuffer(deltaY);
            }
        }
    }
    function SendNick() {
        if (IsConnected() && g_connectSuccessful && null != g_nick) {
            var data = GetBuffer(1 + 2 * g_nick.length);
            data.setUint8(0, 0);
            for (var i = 0; i < g_nick.length; ++i) {
                data.setUint16(1 + 2 * i, g_nick.charCodeAt(i), true);
            }
            SendBuffer(data);
            g_nick = null;
        }
    }
    function IsConnected() {
        return null != g_socket && g_socket.readyState == g_socket.OPEN;
    }
    function SendCmd(cmd) {
        if (IsConnected()) {
            var data = GetBuffer(1);
            data.setUint8(0, cmd);
            SendBuffer(data);
        }
    }
    function RefreshAds() {
        if (IsConnected() && null != __unmatched_110) {
            var __unmatched_232 = GetBuffer(1 + __unmatched_110.length);
            __unmatched_232.setUint8(0, 81);
            for (var y = 0; y < __unmatched_110.length; ++y) {
                __unmatched_232.setUint8(y + 1, __unmatched_110.charCodeAt(y));
            }
            SendBuffer(__unmatched_232);
        }
    }
    function ResizeHandler() {
        g_ready = 1 * window.innerWidth;
        noClip = 1 * window.innerHeight;
        g_canvas_.width = g_canvas.width = g_ready;
        g_canvas_.height = g_canvas.height = noClip;
        var $dialog = $('#helloContainer');
        $dialog.css('transform', 'none');
        var dialogHeight = $dialog.height();
        var height = window.innerHeight;
        if (dialogHeight > height / 1.1) {
            $dialog.css('transform', 'translate(-50%, -50%) scale(' + height / dialogHeight / 1.1 + ')');
        } else {
            $dialog.css('transform', 'translate(-50%, -50%)');
        }
        GetScore();
    }
    function ScaleModifier() {
        var scale;
        scale = 1 * Math.max(noClip / 1080, g_ready / 1920);
        return scale *= g_zoom;
    }
    function __unmatched_33() {
        if (0 != g_playerCells.length) {
            for (var scale = 0, i = 0; i < g_playerCells.length; i++) {
                scale += g_playerCells[i].size;
            }
            scale = Math.pow(Math.min(64 / scale, 1), 0.4) * ScaleModifier();
            g_scale = (9 * g_scale + scale) / 10;
        }
    }

    var showGrid = window.localStorage.showGrid || false;

    function renderBackground(context, x1, x0, y1, y0) {
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        var gridWidth = 5;
        var gridHeight = 7;

        var xMax = Math.round(x1);
        var xMin = Math.round(x0);
        var yMax = Math.round(y1);
        var yMin = Math.round(y0);

        var xLength = xMax - xMin;
        var yLength = yMax - yMin;

        context.save();

        if (showGrid) {
            var xPart = xLength / gridWidth;
            var yPart = yLength / gridHeight;

            context.beginPath();
            context.lineWidth = 20;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = (0.6 * xPart) + 'px Ubuntu';

            context.fillStyle = g_showMass ? '#1A1A1A' : '#e5e5e5';

            for (var j = 0; j < gridHeight; j++) {
                for (var i = 0; i < gridWidth; i++) {
                    context.fillText(letters[j] + (i + 1), (xMin + xPart * i) + (xPart / 2), (yMin + yPart * j) + (yPart / 2));
                }
            }

            context.lineWidth = 160;
            context.strokeStyle = g_showMass ? '#1A1A1A' : '#e5e5e5';

            for (var j = 0; j < gridHeight; j++) {
                for (var i = 0; i < gridWidth; i++) {
                    context.strokeRect(xMin + xPart * i, yMin + yPart * j, xPart, yPart);
                }
            }

            context.stroke();
        }

        context.beginPath();
        context.strokeStyle = "#F44336";
        context.lineWidth = 90;
        context.strokeRect(x0 - 90, y0 - 90, xLength + 180, yLength + 180);
        context.restore();
    }    

    function GetScore() {
        var x;
        var time = Date.now();
        ++__unmatched_77;
        g_time = time;
        if (0 < g_playerCells.length) {
            __unmatched_33();
            for (var y = x = 0, i = 0; i < g_playerCells.length; i++) {
                g_playerCells[i].J();
                x += g_playerCells[i].x / g_playerCells.length;
                y += g_playerCells[i].y / g_playerCells.length;
            }
            g_viewX_ = x;
            g_viewY_ = y;
            g_scale_ = g_scale;
            g_viewX = (g_viewX + x) / 2;
            g_viewY = (g_viewY + y) / 2;
        } else {
            g_viewX = (29 * g_viewX + g_viewX_) / 30;
            g_viewY = (29 * g_viewY + g_viewY_) / 30;
            g_scale = (9 * g_scale + g_scale_ * ScaleModifier()) / 10;
        }
        UpdateTree();
        UpdatePos();
        if (!g_showTrails) {
            g_context.clearRect(0, 0, g_ready, noClip);
        }
        if (g_showTrails) {
            g_context.fillStyle = g_showMass ? '#111111' : '#F2FBFF';
            g_context.globalAlpha = 0.05;
            g_context.fillRect(0, 0, g_ready, noClip);
            g_context.globalAlpha = 1;
        } else {
            if (showGrid) {
                g_context.fillStyle = g_showMass ? '#000000' : '#F2FBFF';
                g_context.fillRect(0, 0, g_ready, noClip);
            } else {
                DrawGrid();
            }
        }
        g_cells.sort(function(A, B) {
            return A.size == B.size ? A.id - B.id : A.size - B.size;
        });
        g_context.save();
        g_context.translate(g_ready / 2, noClip / 2);
        g_context.scale(g_scale, g_scale);
        g_context.translate(-g_viewX, -g_viewY);

        renderBackground(g_context, g_maxX, g_minX, g_maxY, g_minY);

        for (i = 0; i < g_destroyedCells.length; i++) {
            g_destroyedCells[i].s(g_context);
        }
        for (i = 0; i < g_cells.length; i++) {
            g_cells[i].s(g_context);
        }
        if (__unmatched_100) {
            g_linesX = (3 * g_linesX + g_linesY_) / 4;
            g_linesY = (3 * g_linesY + g_linesX_) / 4;
            g_context.save();
            g_context.strokeStyle = '#FFAAAA';
            g_context.lineWidth = 10;
            g_context.lineCap = 'round';
            g_context.lineJoin = 'round';
            g_context.globalAlpha = 0.5;
            g_context.beginPath();
            for (i = 0; i < g_playerCells.length; i++) {
                g_context.moveTo(g_playerCells[i].x, g_playerCells[i].y);
                g_context.lineTo(g_linesX, g_linesY);
            }
            g_context.stroke();
            g_context.restore();
        }
        g_context.restore();
        if (g_leaderboardCanvas && g_leaderboardCanvas.width) {
            g_context.drawImage(g_leaderboardCanvas, g_ready - g_leaderboardCanvas.width - 10, 10);
        }
        g_maxScore = Math.max(g_maxScore, __unmatched_37());
        if (0 != g_maxScore) {
            if (null == g_cachedScore) {
                g_cachedScore = new CachedCanvas(24, '#FFFFFF');
            }
            g_cachedScore.u(Render('score') + ': ' + ~~(g_maxScore / 100));
            y = g_cachedScore.F();
            x = y.width;
            g_context.globalAlpha = 0.2;
            g_context.fillStyle = '#000000';
            g_context.fillRect(10, noClip - 10 - 24 - 10, x + 10, 34);
            g_context.globalAlpha = 1;
            g_context.drawImage(y, 15, noClip - 10 - 24 - 5);
        }
        DrawSplitImage();
        time = Date.now() - time;
        if (time > 1000 / 60) {
            g_pointNumScale -= 0.01;
        } else if (time < 1000 / 65) {
            g_pointNumScale += 0.01;
        }
        if (0.4 > g_pointNumScale) {
            g_pointNumScale = 0.4;
        }
        if (1 < g_pointNumScale) {
            g_pointNumScale = 1;
        }
        time = g_time - __unmatched_79;
        if (!IsConnected() || g_playerCellDestroyed || __unmatched_147) {
            qkeyDown += time / 2000;
            if (1 < qkeyDown) {
                qkeyDown = 1;
            }
        } else {
            qkeyDown -= time / 300;
            if (0 > qkeyDown) {
                qkeyDown = 0;
            }
        }
        if (0 < qkeyDown) {
            g_context.fillStyle = '#000000';
            if (__unmatched_115) {
                g_context.globalAlpha = qkeyDown;
                g_context.fillRect(0, 0, g_ready, noClip);
                if (canvas.complete && canvas.width) {
                    if (canvas.width / canvas.height < g_ready / noClip) {
                        time = g_ready;
                        x = canvas.height * g_ready / canvas.width;
                    } else {
                        time = canvas.width * noClip / canvas.height;
                        x = noClip;
                    }
                    g_context.drawImage(canvas, (g_ready - time) / 2, (noClip - x) / 2, time, x);
                    g_context.globalAlpha = 0.5 * qkeyDown;
                    g_context.fillRect(0, 0, g_ready, noClip);
                }
            } else {
                g_context.globalAlpha = 0.5 * qkeyDown;
                g_context.fillRect(0, 0, g_ready, noClip);
            }
            g_context.globalAlpha = 1;
        } else {
            __unmatched_115 = false;
        }
        __unmatched_79 = g_time;
    }
    function DrawGrid() {
        g_context.fillStyle = g_showMass ? '#111111' : '#F2FBFF';
        g_context.fillRect(0, 0, g_ready, noClip);
        g_context.save();
        g_context.strokeStyle = g_showMass ? '#AAAAAA' : '#000000';
        g_context.globalAlpha = 0.2 * g_scale;
        for (var width = g_ready / g_scale, height = noClip / g_scale, g_width = (-g_viewX + width / 2) % 50; g_width < width; g_width += 50) {
            g_context.beginPath();
            g_context.moveTo(g_width * g_scale - 0.5, 0);
            g_context.lineTo(g_width * g_scale - 0.5, height * g_scale);
            g_context.stroke();
        }
        for (g_width = (-g_viewY + height / 2) % 50; g_width < height; g_width += 50) {
            g_context.beginPath();
            g_context.moveTo(0, g_width * g_scale - 0.5);
            g_context.lineTo(width * g_scale, g_width * g_scale - 0.5);
            g_context.stroke();
        }
        g_context.restore();
    }
    function DrawSplitImage() {
        if (g_touchCapable && g_splitImage.width) {
            var size = g_ready / 5;
            g_context.drawImage(g_splitImage, 5, 5, size, size);
        }
    }
    function __unmatched_37() {
        for (var score = 0, i = 0; i < g_playerCells.length; i++) {
            score += g_playerCells[i].m * g_playerCells[i].m;
        }
        return score;
    }
    function UpdateLeaderboard() {
        g_leaderboardCanvas = null;
        if (null != g_scorePartitions || 0 != g_scoreEntries.length) {
            if (null != g_scorePartitions || g_showNames) {
                g_leaderboardCanvas = document.createElement('canvas');
                var context = g_leaderboardCanvas.getContext('2d');
                var height = 60;
                var height = null == g_scorePartitions ? height + 24 * g_scoreEntries.length : height + 180;
                var scale = Math.min(200, 0.3 * g_ready) / 200;
                g_leaderboardCanvas.width = 200 * scale;
                g_leaderboardCanvas.height = height * scale;
                context.scale(scale, scale);
                context.globalAlpha = 0.4;
                context.fillStyle = '#000000';
                context.fillRect(0, 0, 200, height);
                context.globalAlpha = 1;
                context.fillStyle = '#FFFFFF';
                scale = null;
                scale = Render('leaderboard');
                context.font = '30px Ubuntu';
                context.fillText(scale, 100 - context.measureText(scale).width / 2, 40);
                if (null == g_scorePartitions) {
                    for (context.font = '20px Ubuntu', height = 0; height < g_scoreEntries.length; ++height) {
                        scale = g_scoreEntries[height].name || Render('unnamed_cell');
                        if (!g_showNames) {
                            scale = Render('unnamed_cell');
                        }
                        if (-1 != g_playerCellIds.indexOf(g_scoreEntries[height].id)) {
                            if (g_playerCells[0].name) {
                                scale = g_playerCells[0].name;
                            }
                            context.fillStyle = '#FFAAAA';
                        } else {
                            context.fillStyle = '#FFFFFF';
                        }
                        scale = height + 1 + '. ' + scale;
                        context.fillText(scale, 100 - context.measureText(scale).width / 2, 70 + 24 * height);
                    }
                } else {
                    for (height = scale = 0; height < g_scorePartitions.length; ++height) {
                        var end = scale + g_scorePartitions[height] * Math.PI * 2;
                        context.fillStyle = g_teamColors[height + 1];
                        context.beginPath();
                        context.moveTo(100, 140);
                        context.arc(100, 140, 80, scale, end, false);
                        context.fill();
                        scale = end;
                    }
                }
            }
        }
    }
    function Node(left, top, width, height, depth) {
        this.P = left;
        this.x = top;
        this.y = width;
        this.g = height;
        this.b = depth;
    }
    function Cell(id, x, y, size, color, name) {
        this.id = id;
        this.o = this.x = x;
        this.p = this.y = y;
        this.n = this.size = size;
        this.color = color;
        this.a = [];
        this.Q();
        this.t(name);
    }
    function __unmatched_41(__unmatched_267) {
        for (__unmatched_267 = __unmatched_267.toString(16); 6 > __unmatched_267.length;) {
            __unmatched_267 = '0' + __unmatched_267;
        }
        return '#' + __unmatched_267;
    }
    function CachedCanvas(size, color, stroke, strokeColor) {
        if (size) {
            this.q = size;
        }
        if (color) {
            this.M = color;
        }
        this.O = !!stroke;
        if (strokeColor) {
            this.r = strokeColor;
        }
    }
    function __unmatched_43(params) {
        for (var size_ = params.length, __unmatched_274, __unmatched_275; 0 < size_;) {
            __unmatched_275 = Math.floor(Math.random() * size_);
            size_--;
            __unmatched_274 = params[size_];
            params[size_] = params[__unmatched_275];
            params[__unmatched_275] = __unmatched_274;
        }
    }
    function __unmatched_44(rect, callback) {
        var __unmatched_278 = '1' == $('#helloContainer').attr('data-has-account-data');
        $('#helloContainer').attr('data-has-account-data', '1');
        if (null == callback && window.localStorage[i_]) {
            var rand = JSON.parse(window.localStorage[i_]);
            rand.xp = rect.e;
            rand.xpNeeded = rect.c;
            rand.level = rect.d;
            window.localStorage[i_] = JSON.stringify(rand);
        }
        if (__unmatched_278) {
            var width = +$('.agario-exp-bar .progress-bar-text').first().text().split('/')[0];
            var __unmatched_278 = +$('.agario-exp-bar .progress-bar-text').first().text().split('/')[1].split(' ')[0];
            var rand = $('.agario-profile-panel .progress-bar-star').first().text();
            if (rand != rect.d) {
                __unmatched_44({
                    e: __unmatched_278,
                    c: __unmatched_278,
                    d: rand
                }, function() {
                    $('.agario-profile-panel .progress-bar-star').text(rect.d);
                    $('.agario-exp-bar .progress-bar').css('width', '100%');
                    $('.progress-bar-star').addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                        $('.progress-bar-star').removeClass('animated tada');
                    });
                    setTimeout(function() {
                        $('.agario-exp-bar .progress-bar-text').text(rect.c + '/' + rect.c + ' XP');
                        __unmatched_44({
                            e: 0,
                            c: rect.c,
                            d: rect.d
                        }, function() {
                            __unmatched_44(rect, callback);
                        });
                    }, 1000);
                });
            } else {
                var __unmatched_281 = Date.now();
                var name = function() {
                    var deltaX;
                    deltaX = (Date.now() - __unmatched_281) / 1000;
                    deltaX = 0 > deltaX ? 0 : 1 < deltaX ? 1 : deltaX;
                    deltaX = deltaX * deltaX * (3 - 2 * deltaX);
                    $('.agario-exp-bar .progress-bar-text').text(~~(width + (rect.e - width) * deltaX) + '/' + rect.c + ' XP');
                    $('.agario-exp-bar .progress-bar').css('width', (88 * (width + (rect.e - width) * deltaX) / rect.c).toFixed(2) + '%');
                    if (1 > deltaX) {
                        window.requestAnimationFrame(name);
                    } else if (callback) {
                        callback();
                    }
                };
                window.requestAnimationFrame(name);
            }
        } else {
            $('.agario-profile-panel .progress-bar-star').text(rect.d);
            $('.agario-exp-bar .progress-bar-text').text(rect.e + '/' + rect.c + ' XP');
            $('.agario-exp-bar .progress-bar').css('width', (88 * rect.e / rect.c).toFixed(2) + '%');
            if (callback) {
                callback();
            }
        }
    }
    function __unmatched_45(__unmatched_284) {
        if ('string' == typeof __unmatched_284) {
            __unmatched_284 = JSON.parse(__unmatched_284);
        }
        if (Date.now() + 1800000 > __unmatched_284.expires) {
            $('#helloContainer').attr('data-logged-in', '0');
        } else {
            window.localStorage[i_] = JSON.stringify(__unmatched_284);
            __unmatched_110 = __unmatched_284.authToken;
            $('.agario-profile-name').text(__unmatched_284.name);
            RefreshAds();
            __unmatched_44({
                e: __unmatched_284.xp,
                c: __unmatched_284.xpNeeded,
                d: __unmatched_284.level
            });
            $('#helloContainer').attr('data-logged-in', '1');
        }
    }
    function __unmatched_46(data) {
        data = data.split('\n');
        __unmatched_45({
            name: data[0],
            fbid: data[1],
            authToken: data[2],
            expires: 1000 * +data[3],
            level: +data[4],
            xp: +data[5],
            xpNeeded: +data[6]
        });
    }
    function UpdateScale(__unmatched_286) {
        if ('connected' == __unmatched_286.status) {
            var y = __unmatched_286.authResponse.accessToken;
            console.log(y);
            window.FB.api('/me/picture?width=180&height=180', function(__unmatched_288) {
                window.localStorage.fbPictureCache = __unmatched_288.data.url;
                $('.agario-profile-picture').attr('src', __unmatched_288.data.url);
            });
            $('#helloContainer').attr('data-logged-in', '1');
            if (null != __unmatched_110) {
                $.ajax(g_protocol + 'checkToken', {
                    error: function() {
                        __unmatched_110 = null;
                        UpdateScale(__unmatched_286);
                    },
                    success: function(__unmatched_289) {
                        __unmatched_289 = __unmatched_289.split('\n');
                        __unmatched_44({
                            d: +__unmatched_289[0],
                            e: +__unmatched_289[1],
                            c: +__unmatched_289[2]
                        });
                    },
                    dataType: 'text',
                    method: 'POST',
                    cache: false,
                    crossDomain: true,
                    data: __unmatched_110
                });
            } else {
                $.ajax(g_protocol + 'facebookLogin', {
                    error: function() {
                        __unmatched_110 = null;
                        $('#helloContainer').attr('data-logged-in', '0');
                    },
                    success: __unmatched_46,
                    dataType: 'text',
                    method: 'POST',
                    cache: false,
                    crossDomain: true,
                    data: y
                });
            }
        }
    }
    function RenderLoop(x) {
        n(':party');
        $('#helloContainer').attr('data-party-state', '4');
        x = decodeURIComponent(x).replace(/.*#/gim, '');
        __unmatched_49('#' + window.encodeURIComponent(x));
        $.ajax(g_protocol + 'getToken', {
            error: function() {
                $('#helloContainer').attr('data-party-state', '6');
            },
            success: function(quick) {
                quick = quick.split('\n');
                $('.partyToken').val('agar.io/#' + window.encodeURIComponent(x));
                $('#helloContainer').attr('data-party-state', '5');
                n(':party');
                Connect('ws://' + quick[0], x);
            },
            dataType: 'text',
            method: 'POST',
            cache: false,
            crossDomain: true,
            data: x
        });
    }
    function __unmatched_49(item) {
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, window.document.title, item);
        }
    }
    function __unmatched_50(__unmatched_293, __unmatched_294) {
        var playerOwned = -1 != g_playerCellIds.indexOf(__unmatched_293.id);
        var __unmatched_296 = -1 != g_playerCellIds.indexOf(__unmatched_294.id);
        var __unmatched_297 = 30 > __unmatched_294.size;
        if (playerOwned && __unmatched_297) {
            ++__unmatched_145;
        }
        if (!(__unmatched_297 || !playerOwned || __unmatched_296)) {
            ++__unmatched_152;
        }
    }
    function __unmatched_51(__unmatched_298) {
        __unmatched_298 = ~~__unmatched_298;
        var color = (__unmatched_298 % 60).toString();
        __unmatched_298 = (~~(__unmatched_298 / 60)).toString();
        if (2 > color.length) {
            color = '0' + color;
        }
        return __unmatched_298 + ':' + color;
    }
    function __unmatched_52() {
        if (null == g_scoreEntries) {
            return 0;
        }
        for (var i = 0; i < g_scoreEntries.length; ++i) {
            if (-1 != g_playerCellIds.indexOf(g_scoreEntries[i].id)) {
                return i + 1;
            }
        }
        return 0;
    }
    function ShowOverlay() {
        $('.stats-food-eaten').text(__unmatched_145);
        $('.stats-time-alive').text(__unmatched_51((__unmatched_150 - __unmatched_149) / 1000));
        $('.stats-leaderboard-time').text(__unmatched_51(__unmatched_151));
        $('.stats-highest-mass').text(~~(g_maxScore / 100));
        $('.stats-cells-eaten').text(__unmatched_152);
        $('.stats-top-position').text(0 == g_mode ? ':(' : g_mode);
        var g_height = document.getElementById('statsGraph');
        if (g_height) {
            var pointsAcc = g_height.getContext('2d');
            var scale = g_height.width;
            var g_height = g_height.height;
            pointsAcc.clearRect(0, 0, scale, g_height);
            if (2 < points.length) {
                for (var maxSize = 200, i = 0; i < points.length; i++) {
                    maxSize = Math.max(points[i], maxSize);
                }
                pointsAcc.lineWidth = 3;
                pointsAcc.lineCap = 'round';
                pointsAcc.lineJoin = 'round';
                pointsAcc.strokeStyle = __unmatched_146;
                pointsAcc.fillStyle = __unmatched_146;
                pointsAcc.beginPath();
                pointsAcc.moveTo(0, g_height - points[0] / maxSize * (g_height - 10) + 10);
                for (i = 1; i < points.length; i += Math.max(~~(points.length / scale), 1)) {
                    for (var __unmatched_306 = i / (points.length - 1) * scale, thisNode = [], __unmatched_308 = -20; 20 >= __unmatched_308; ++__unmatched_308) {
                        if (!(0 > i + __unmatched_308 || i + __unmatched_308 >= points.length)) {
                            thisNode.push(points[i + __unmatched_308]);
                        }
                    }
                    thisNode = thisNode.reduce(function(__unmatched_309, __unmatched_310) {
                        return __unmatched_309 + __unmatched_310;
                    }) / thisNode.length / maxSize;
                    pointsAcc.lineTo(__unmatched_306, g_height - thisNode * (g_height - 10) + 10);
                }
                pointsAcc.stroke();
                pointsAcc.globalAlpha = 0.5;
                pointsAcc.lineTo(scale, g_height);
                pointsAcc.lineTo(0, g_height);
                pointsAcc.fill();
                pointsAcc.globalAlpha = 1;
            }
        }
    }
    if (!window.agarioNoInit) {
        var __unmatched_54 = window.location.protocol;
        var g_secure = 'https:' == __unmatched_54;
        var g_protocol = __unmatched_54 + '//m.agar.io/';
        var __unmatched_57 = window.navigator.userAgent;
        if (-1 != __unmatched_57.indexOf('Android')) {
            if (window.ga) {
                window.ga('send', 'event', 'MobileRedirect', 'PlayStore');
            }
            setTimeout(function() {
                window.location.href = 'https://play.google.com/store/apps/details?id=com.miniclip.agar.io';
            }, 1000);
        } else if (-1 != __unmatched_57.indexOf('iPhone') || -1 != __unmatched_57.indexOf('iPad') || -1 != __unmatched_57.indexOf('iPod')) {
            if (window.ga) {
                window.ga('send', 'event', 'MobileRedirect', 'AppStore');
            }
            setTimeout(function() {
                window.location.href = 'https://itunes.apple.com/app/agar.io/id995999703?mt=8&at=1l3vajp';
            }, 1000);
        } else {
            var g_canvas_;
            var g_context;
            var g_canvas;
            var g_ready;
            var noClip;
            var g_pointTree = null;
            var g_socket = null;
            var g_viewX = 0;
            var g_viewY = 0;
            var g_playerCellIds = [];
            var g_playerCells = [];
            var g_cellsById = {};
            var g_cells = [];
            var g_destroyedCells = [];
            var g_scoreEntries = [];
            var g_mouseX = 0;
            var g_mouseY = 0;
            var g_moveX = -1;
            var g_moveY = -1;
            var __unmatched_77 = 0;
            var g_time = 0;
            var __unmatched_79 = 0;
            var g_nick = null;
            var g_minX = 0;
            var g_minY = 0;
            var g_maxX = 10000;
            var g_maxY = 10000;
            var g_scale = 1;
            var g_region = null;
            var g_showSkins = true;
            var g_showNames = true;
            var g_noColors = false;
            var __unmatched_90 = false;
            var g_maxScore = 0;
            var g_showMass = true;
            var g_darkTheme = true;
            var g_viewX_ = g_viewX = ~~((g_minX + g_maxX) / 2);
            var g_viewY_ = g_viewY = ~~((g_minY + g_maxY) / 2);
            var g_scale_ = 1;
            var __unmatched_97 = '';
            var g_scorePartitions = null;
            var g_drawLines = false;
            var __unmatched_100 = false;
            var g_linesY_ = 0;
            var g_linesX_ = 0;
            var g_linesX = 0;
            var g_linesY = 0;
            var g_ABGroup = 0;
            var g_teamColors = [
                '#333333',
                '#FF3333',
                '#33FF33',
                '#3333FF'
            ];
            var g_showTrails = false;
            var g_connectSuccessful = false;
            var __unmatched_109 = 0;
            var __unmatched_110 = null;
            var g_zoom = 1;
            var qkeyDown = 1;
            var g_playerCellDestroyed = false;
            var __unmatched_114 = 0;
            var __unmatched_115 = true;
            var __unmatched_116 = {};
            (function() {
                var cached = window.location.search;
                if ('?' == cached.charAt(0)) {
                    cached = cached.slice(1);
                }
                for (var cached = cached.split('&'), i = 0; i < cached.length; i++) {
                    var parts = cached[i].split('=');
                    __unmatched_116[parts[0]] = parts[1];
                }
            }());
            var canvas = new Image();
            canvas.src = 'img/background.png';
            var g_touchCapable = 'ontouchstart' in window && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
            var g_splitImage = new Image();
            g_splitImage.src = 'img/split.png';
            var canvasTest = document.createElement('canvas');
            if ('undefined' == typeof console || 'undefined' == typeof DataView || 'undefined' == typeof WebSocket || null == canvasTest || null == canvasTest.getContext || null == window.localStorage) {
                alert('You browser does not support this game, we recommend you to use Firefox to play this');
            } else {
                var g_regionLabels = null;
                window.setNick = function(__unmatched_314) {
                    if (window.ga) {
                        window.ga('send', 'event', 'Nick', __unmatched_314.toLowerCase());
                    }
                    HideOverlay();
                    g_nick = __unmatched_314;
                    SendNick();
                    g_maxScore = 0;
                };
                window.setRegion = SetRegion;
                var __unmatched_122 = true;
                window.setSkins = function(val) {
                    g_showSkins = val;
                };
                window.setNames = function(val) {
                    g_showNames = val;
                };
                window.setDarkTheme = function(val) {
                    g_showMass = val;
                };
                window.setColors = function(val) {
                    g_noColors = val;
                };
                window.setShowMass = function(val) {
                    g_darkTheme = val;
                };
                window.spectate = function() {
                    g_nick = null;
                    SendCmd(1);
                    HideOverlay();
                };
                window.setGameMode = function(__unmatched_320) {
                    if (__unmatched_320 != __unmatched_97) {
                        if (':party' == __unmatched_97) {
                            $('#helloContainer').attr('data-party-state', '0');
                        }
                        n(__unmatched_320);
                        if (':party' != __unmatched_320) {
                            Start();
                        }
                    }
                };
                window.setAcid = function(val) {
                    g_showTrails = val;
                };
                if (null != window.localStorage) {
                    if (null == window.localStorage.AB9) {
                        window.localStorage.AB9 = 0 + ~~(100 * Math.random());
                    }
                    g_ABGroup = +window.localStorage.AB9;
                    window.ABGroup = g_ABGroup;
                }
                $.get(__unmatched_54 + '//gc.agar.io', function(code) {
                    var __unmatched_323 = code.split(' ');
                    code = __unmatched_323[0];
                    __unmatched_323 = __unmatched_323[1] || '';
                    if (-1 == ['UA'].indexOf(code)) {
                        g_skinNamesA.push('ussr');
                    }
                    if (g_regionsByCC.hasOwnProperty(code)) {
                        if ('string' == typeof g_regionsByCC[code]) {
                            if (!g_region) {
                                SetRegion(g_regionsByCC[code]);
                            } else if (g_regionsByCC[code].hasOwnProperty(__unmatched_323)) {
                                if (!g_region) {
                                    SetRegion(g_regionsByCC[code][__unmatched_323]);
                                }
                            }
                        }
                    }
                }, 'text');
                var g_canRefreshAds = true;
                var g_refreshAdsCooldown = 0;
                var g_regionsByCC = {
                    AF: 'JP-Tokyo',
                    AX: 'EU-London',
                    AL: 'EU-London',
                    DZ: 'EU-London',
                    AS: 'SG-Singapore',
                    AD: 'EU-London',
                    AO: 'EU-London',
                    AI: 'US-Atlanta',
                    AG: 'US-Atlanta',
                    AR: 'BR-Brazil',
                    AM: 'JP-Tokyo',
                    AW: 'US-Atlanta',
                    AU: 'SG-Singapore',
                    AT: 'EU-London',
                    AZ: 'JP-Tokyo',
                    BS: 'US-Atlanta',
                    BH: 'JP-Tokyo',
                    BD: 'JP-Tokyo',
                    BB: 'US-Atlanta',
                    BY: 'EU-London',
                    BE: 'EU-London',
                    BZ: 'US-Atlanta',
                    BJ: 'EU-London',
                    BM: 'US-Atlanta',
                    BT: 'JP-Tokyo',
                    BO: 'BR-Brazil',
                    BQ: 'US-Atlanta',
                    BA: 'EU-London',
                    BW: 'EU-London',
                    BR: 'BR-Brazil',
                    IO: 'JP-Tokyo',
                    VG: 'US-Atlanta',
                    BN: 'JP-Tokyo',
                    BG: 'EU-London',
                    BF: 'EU-London',
                    BI: 'EU-London',
                    KH: 'JP-Tokyo',
                    CM: 'EU-London',
                    CA: 'US-Atlanta',
                    CV: 'EU-London',
                    KY: 'US-Atlanta',
                    CF: 'EU-London',
                    TD: 'EU-London',
                    CL: 'BR-Brazil',
                    CN: 'CN-China',
                    CX: 'JP-Tokyo',
                    CC: 'JP-Tokyo',
                    CO: 'BR-Brazil',
                    KM: 'EU-London',
                    CD: 'EU-London',
                    CG: 'EU-London',
                    CK: 'SG-Singapore',
                    CR: 'US-Atlanta',
                    CI: 'EU-London',
                    HR: 'EU-London',
                    CU: 'US-Atlanta',
                    CW: 'US-Atlanta',
                    CY: 'JP-Tokyo',
                    CZ: 'EU-London',
                    DK: 'EU-London',
                    DJ: 'EU-London',
                    DM: 'US-Atlanta',
                    DO: 'US-Atlanta',
                    EC: 'BR-Brazil',
                    EG: 'EU-London',
                    SV: 'US-Atlanta',
                    GQ: 'EU-London',
                    ER: 'EU-London',
                    EE: 'EU-London',
                    ET: 'EU-London',
                    FO: 'EU-London',
                    FK: 'BR-Brazil',
                    FJ: 'SG-Singapore',
                    FI: 'EU-London',
                    FR: 'EU-London',
                    GF: 'BR-Brazil',
                    PF: 'SG-Singapore',
                    GA: 'EU-London',
                    GM: 'EU-London',
                    GE: 'JP-Tokyo',
                    DE: 'EU-London',
                    GH: 'EU-London',
                    GI: 'EU-London',
                    GR: 'EU-London',
                    GL: 'US-Atlanta',
                    GD: 'US-Atlanta',
                    GP: 'US-Atlanta',
                    GU: 'SG-Singapore',
                    GT: 'US-Atlanta',
                    GG: 'EU-London',
                    GN: 'EU-London',
                    GW: 'EU-London',
                    GY: 'BR-Brazil',
                    HT: 'US-Atlanta',
                    VA: 'EU-London',
                    HN: 'US-Atlanta',
                    HK: 'JP-Tokyo',
                    HU: 'EU-London',
                    IS: 'EU-London',
                    IN: 'JP-Tokyo',
                    ID: 'JP-Tokyo',
                    IR: 'JP-Tokyo',
                    IQ: 'JP-Tokyo',
                    IE: 'EU-London',
                    IM: 'EU-London',
                    IL: 'JP-Tokyo',
                    IT: 'EU-London',
                    JM: 'US-Atlanta',
                    JP: 'JP-Tokyo',
                    JE: 'EU-London',
                    JO: 'JP-Tokyo',
                    KZ: 'JP-Tokyo',
                    KE: 'EU-London',
                    KI: 'SG-Singapore',
                    KP: 'JP-Tokyo',
                    KR: 'JP-Tokyo',
                    KW: 'JP-Tokyo',
                    KG: 'JP-Tokyo',
                    LA: 'JP-Tokyo',
                    LV: 'EU-London',
                    LB: 'JP-Tokyo',
                    LS: 'EU-London',
                    LR: 'EU-London',
                    LY: 'EU-London',
                    LI: 'EU-London',
                    LT: 'EU-London',
                    LU: 'EU-London',
                    MO: 'JP-Tokyo',
                    MK: 'EU-London',
                    MG: 'EU-London',
                    MW: 'EU-London',
                    MY: 'JP-Tokyo',
                    MV: 'JP-Tokyo',
                    ML: 'EU-London',
                    MT: 'EU-London',
                    MH: 'SG-Singapore',
                    MQ: 'US-Atlanta',
                    MR: 'EU-London',
                    MU: 'EU-London',
                    YT: 'EU-London',
                    MX: 'US-Atlanta',
                    FM: 'SG-Singapore',
                    MD: 'EU-London',
                    MC: 'EU-London',
                    MN: 'JP-Tokyo',
                    ME: 'EU-London',
                    MS: 'US-Atlanta',
                    MA: 'EU-London',
                    MZ: 'EU-London',
                    MM: 'JP-Tokyo',
                    NA: 'EU-London',
                    NR: 'SG-Singapore',
                    NP: 'JP-Tokyo',
                    NL: 'EU-London',
                    NC: 'SG-Singapore',
                    NZ: 'SG-Singapore',
                    NI: 'US-Atlanta',
                    NE: 'EU-London',
                    NG: 'EU-London',
                    NU: 'SG-Singapore',
                    NF: 'SG-Singapore',
                    MP: 'SG-Singapore',
                    NO: 'EU-London',
                    OM: 'JP-Tokyo',
                    PK: 'JP-Tokyo',
                    PW: 'SG-Singapore',
                    PS: 'JP-Tokyo',
                    PA: 'US-Atlanta',
                    PG: 'SG-Singapore',
                    PY: 'BR-Brazil',
                    PE: 'BR-Brazil',
                    PH: 'JP-Tokyo',
                    PN: 'SG-Singapore',
                    PL: 'EU-London',
                    PT: 'EU-London',
                    PR: 'US-Atlanta',
                    QA: 'JP-Tokyo',
                    RE: 'EU-London',
                    RO: 'EU-London',
                    RU: 'RU-Russia',
                    RW: 'EU-London',
                    BL: 'US-Atlanta',
                    SH: 'EU-London',
                    KN: 'US-Atlanta',
                    LC: 'US-Atlanta',
                    MF: 'US-Atlanta',
                    PM: 'US-Atlanta',
                    VC: 'US-Atlanta',
                    WS: 'SG-Singapore',
                    SM: 'EU-London',
                    ST: 'EU-London',
                    SA: 'EU-London',
                    SN: 'EU-London',
                    RS: 'EU-London',
                    SC: 'EU-London',
                    SL: 'EU-London',
                    SG: 'JP-Tokyo',
                    SX: 'US-Atlanta',
                    SK: 'EU-London',
                    SI: 'EU-London',
                    SB: 'SG-Singapore',
                    SO: 'EU-London',
                    ZA: 'EU-London',
                    SS: 'EU-London',
                    ES: 'EU-London',
                    LK: 'JP-Tokyo',
                    SD: 'EU-London',
                    SR: 'BR-Brazil',
                    SJ: 'EU-London',
                    SZ: 'EU-London',
                    SE: 'EU-London',
                    CH: 'EU-London',
                    SY: 'EU-London',
                    TW: 'JP-Tokyo',
                    TJ: 'JP-Tokyo',
                    TZ: 'EU-London',
                    TH: 'JP-Tokyo',
                    TL: 'JP-Tokyo',
                    TG: 'EU-London',
                    TK: 'SG-Singapore',
                    TO: 'SG-Singapore',
                    TT: 'US-Atlanta',
                    TN: 'EU-London',
                    TR: 'TK-Turkey',
                    TM: 'JP-Tokyo',
                    TC: 'US-Atlanta',
                    TV: 'SG-Singapore',
                    UG: 'EU-London',
                    UA: 'EU-London',
                    AE: 'EU-London',
                    GB: 'EU-London',
                    US: 'US-Atlanta',
                    UM: 'SG-Singapore',
                    VI: 'US-Atlanta',
                    UY: 'BR-Brazil',
                    UZ: 'JP-Tokyo',
                    VU: 'SG-Singapore',
                    VE: 'BR-Brazil',
                    VN: 'JP-Tokyo',
                    WF: 'SG-Singapore',
                    EH: 'EU-London',
                    YE: 'JP-Tokyo',
                    ZM: 'EU-London',
                    ZW: 'EU-London'
                };
                var __unmatched_126 = null;
                window.connect = Connect;
                var g_retryTimeout = 500;
                var __unmatched_128 = null;
                var __unmatched_129 = 0;
                var g_lastMoveY = -1;
                var g_lastMoveX = -1;
                window.refreshPlayerInfo = function() {
                    SendCmd(253);
                };
                var g_leaderboardCanvas = null;
                var g_pointNumScale = 1;
                var g_cachedScore = null;
                var __unmatched_135 = function() {
                    var sizeRatio = Date.now();
                    var maxItems = 1000 / 60;
                    return function() {
                        window.requestAnimationFrame(__unmatched_135);
                        var x = Date.now();
                        var step = x - sizeRatio;
                        if (step > maxItems) {
                            sizeRatio = x - step % maxItems;
                            if (!IsConnected() || 240 > Date.now() - __unmatched_109) {
                                GetScore();
                            } else {
                                console.warn('Skipping draw');
                            }
                            __unmatched_143();
                        }
                    };
                }();
                var g_skinCache = {};
                var g_skinNamesA = 'poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;venezuela;blatter;chavez;cuba;fidel;merkel;palin;queen;boris;bush;trump'.split(';');
                var __unmatched_138 = '8;nasa;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;blatter;chavez;fidel;merkel;palin;queen;boris;bush;trump'.split(';');
                var node = {};
                Node.prototype = {
                    P: null,
                    x: 0,
                    y: 0,
                    g: 0,
                    b: 0
                };
                Cell.prototype = {
                    id: 0,
                    a: null,
                    name: null,
                    k: null,
                    I: null,
                    x: 0,
                    y: 0,
                    size: 0,
                    o: 0,
                    p: 0,
                    n: 0,
                    C: 0,
                    D: 0,
                    m: 0,
                    T: 0,
                    K: 0,
                    W: 0,
                    A: false,
                    f: false,
                    j: false,
                    L: true,
                    S: 0,
                    V: null,
                    R: function() {
                        var i;
                        for (i = 0; i < g_cells.length; i++) {
                            if (g_cells[i] == this) {
                                g_cells.splice(i, 1);
                                break;
                            }
                        }
                        delete g_cellsById[this.id];
                        i = g_playerCells.indexOf(this);
                        if (-1 != i) {
                            __unmatched_90 = true;
                            g_playerCells.splice(i, 1);
                        }
                        i = g_playerCellIds.indexOf(this.id);
                        if (-1 != i) {
                            g_playerCellIds.splice(i, 1);
                        }
                        this.A = true;
                        if (0 < this.S) {
                            g_destroyedCells.push(this);
                        }
                    },
                    i: function() {
                        return Math.max(~~(0.3 * this.size), 24);
                    },
                    t: function(val) {
                        if (this.name = val) {
                            if (null == this.k) {
                                this.k = new CachedCanvas(this.i(), '#FFFFFF', true, '#000000');
                            } else {
                                this.k.G(this.i());
                            }
                            this.k.u(this.name);
                        }
                    },
                    Q: function() {
                        for (var num = this.B(); this.a.length > num;) {
                            var i = ~~(Math.random() * this.a.length);
                            this.a.splice(i, 1);
                        }
                        for (0 == this.a.length && 0 < num && this.a.push(new Node(this, this.x, this.y, this.size, Math.random() - 0.5)); this.a.length < num;) {
                            i = ~~(Math.random() * this.a.length);
                            i = this.a[i];
                            this.a.push(new Node(this, i.x, i.y, i.g, i.b));
                        }
                    },
                    B: function() {
                        var num = 10;
                        if (20 > this.size) {
                            num = 0;
                        }
                        if (this.f) {
                            num = 30;
                        }
                        var size = this.size;
                        if (!this.f) {
                            size *= g_scale;
                        }
                        size *= g_pointNumScale;
                        if (this.T & 32) {
                            size *= 0.25;
                        }
                        return ~~Math.max(size, num);
                    },
                    da: function() {
                        this.Q();
                        for (var cell = this.a, num = cell.length, i = 0; i < num; ++i) {
                            var prevAcc = cell[(i - 1 + num) % num].b;
                            var nextAcc = cell[(i + 1) % num].b;
                            cell[i].b += (Math.random() - 0.5) * (this.j ? 3 : 1);
                            cell[i].b *= 0.7;
                            if (10 < cell[i].b) {
                                cell[i].b = 10;
                            }
                            if (-10 > cell[i].b) {
                                cell[i].b = -10;
                            }
                            cell[i].b = (prevAcc + nextAcc + 8 * cell[i].b) / 10;
                        }
                        for (var thisCell = this, roll = this.f ? 0 : (this.id / 1000 + g_time / 10000) % (2 * Math.PI), i = 0; i < num; ++i) {
                            var size = cell[i].g;
                            var prevAcc = cell[(i - 1 + num) % num].g;
                            var nextAcc = cell[(i + 1) % num].g;
                            if (15 < this.size && null != g_pointTree && 20 < this.size * g_scale && 0 < this.id) {
                                var reduce = false;
                                var x = cell[i].x;
                                var y = cell[i].y;
                                g_pointTree.ea(x - 5, y - 5, 10, 10, function(rect) {
                                    if (rect.P != thisCell && 25 > (x - rect.x) * (x - rect.x) + (y - rect.y) * (y - rect.y)) {
                                        reduce = true;
                                    }
                                });
                                if (!reduce && (cell[i].x < g_minX || cell[i].y < g_minY || cell[i].x > g_maxX || cell[i].y > g_maxY)) {
                                    reduce = true;
                                }
                                if (reduce) {
                                    if (0 < cell[i].b) {
                                        cell[i].b = 0;
                                    }
                                    cell[i].b -= 1;
                                }
                            }
                            size += cell[i].b;
                            if (0 > size) {
                                size = 0;
                            }
                            size = this.j ? (19 * size + this.size) / 20 : (12 * size + this.size) / 13;
                            cell[i].g = (prevAcc + nextAcc + 8 * size) / 10;
                            prevAcc = 2 * Math.PI / num;
                            nextAcc = this.a[i].g;
                            if (this.f && 0 == i % 2) {
                                nextAcc += 5;
                            }
                            cell[i].x = this.x + Math.cos(prevAcc * i + roll) * nextAcc;
                            cell[i].y = this.y + Math.sin(prevAcc * i + roll) * nextAcc;
                        }
                    },
                    J: function() {
                        if (0 >= this.id) {
                            return 1;
                        }
                        var posRatio;
                        posRatio = (g_time - this.K) / 120;
                        posRatio = 0 > posRatio ? 0 : 1 < posRatio ? 1 : posRatio;
                        var sizeRatio = 0 > posRatio ? 0 : 1 < posRatio ? 1 : posRatio;
                        this.i();
                        if (this.A && 1 <= sizeRatio) {
                            var i = g_destroyedCells.indexOf(this);
                            if (-1 != i) {
                                g_destroyedCells.splice(i, 1);
                            }
                        }
                        this.x = posRatio * (this.C - this.o) + this.o;
                        this.y = posRatio * (this.D - this.p) + this.p;
                        this.size = sizeRatio * (this.m - this.n) + this.n;
                        return sizeRatio;
                    },
                    H: function() {
                        return 0 >= this.id ? true : this.x + this.size + 40 < g_viewX - g_ready / 2 / g_scale || this.y + this.size + 40 < g_viewY - noClip / 2 / g_scale || this.x - this.size - 40 > g_viewX + g_ready / 2 / g_scale || this.y - this.size - 40 > g_viewY + noClip / 2 / g_scale ? false : true;
                    },
                    s: function(context) {
                        if (this.H()) {
                            ++this.S;
                            var isSimpleDrawing = 0 < this.id && !this.f && !this.j && 0.4 > g_scale;
                            if (5 > this.B() && 0 < this.id) {
                                isSimpleDrawing = true;
                            }
                            if (this.L && !isSimpleDrawing) {
                                for (var text = 0; text < this.a.length; text++) {
                                    this.a[text].g = this.size;
                                }
                            }
                            this.L = isSimpleDrawing;
                            context.save();
                            this.W = g_time;
                            text = this.J();
                            if (this.A) {
                                context.globalAlpha *= 1 - text;
                            }
                            context.lineWidth = 10;
                            context.lineCap = 'round';
                            context.lineJoin = this.f ? 'miter' : 'round';
                            if (g_noColors) {
                                context.fillStyle = '#FFFFFF';
                                context.strokeStyle = '#AAAAAA';
                            } else {
                                context.fillStyle = this.color;
                                context.strokeStyle = this.color;
                            }
                            if (isSimpleDrawing) {
                                context.beginPath();
                                context.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI, false);
                            } else {
                                this.da();
                                context.beginPath();
                                var num = this.B();
                                context.moveTo(this.a[0].x, this.a[0].y);
                                for (text = 1; text <= num; ++text) {
                                    var skin = text % num;
                                    context.lineTo(this.a[skin].x, this.a[skin].y);
                                }
                            }
                            context.closePath();
                            text = this.name.toLowerCase();
                            if (!this.j && g_showSkins && ':teams' != __unmatched_97) {
                                num = this.V;
                                if (null == num) {
                                    num = null;
                                } else if (':' == num[0]) {
                                    if (!node.hasOwnProperty(num)) {
                                        node[num] = new Image();
                                        node[num].src = num.slice(1);
                                    }
                                    num = 0 != node[num].width && node[num].complete ? node[num] : null;
                                } else {
                                    num = null;
                                }
                                if (!num) {
                                    if (-1 != g_skinNamesA.indexOf(text)) {
                                        if (!g_skinCache.hasOwnProperty(text)) {
                                            g_skinCache[text] = new Image();
                                            g_skinCache[text].src = 'skins/' + text + '.png';
                                        }
                                        num = 0 != g_skinCache[text].width && g_skinCache[text].complete ? g_skinCache[text] : null;
                                    } else {
                                        num = null;
                                    }
                                }
                            } else {
                                num = null;
                            }
                            skin = num;
                            if (!isSimpleDrawing) {
                                context.stroke();
                            }
                            context.fill();
                            if (null != skin) {
                                context.save();
                                context.clip();
                                context.drawImage(skin, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                                context.restore();
                            }
                            if ((g_noColors || 15 < this.size) && !isSimpleDrawing) {
                                context.strokeStyle = '#000000';
                                context.globalAlpha *= 0.1;
                                context.stroke();
                            }
                            context.globalAlpha = 1;
                            num = -1 != g_playerCells.indexOf(this);
                            isSimpleDrawing = ~~this.y;
                            if (0 != this.id && (g_showNames || num) && this.name && this.k && (null == skin || -1 == __unmatched_138.indexOf(text))) {
                                skin = this.k;
                                skin.u(this.name);
                                skin.G(this.i());
                                text = 0 >= this.id ? 1 : Math.ceil(10 * g_scale) / 10;
                                skin.U(text);
                                var skin = skin.F();
                                var g_width = ~~(skin.width / text);
                                var g_height = ~~(skin.height / text);
                                context.drawImage(skin, ~~this.x - ~~(g_width / 2), isSimpleDrawing - ~~(g_height / 2), g_width, g_height);
                                isSimpleDrawing += skin.height / 2 / text + 4;
                            }
                            if (40 < this.size) {
                                if (null == this.I) {
                                    this.I = new CachedCanvas(this.i() / 2, '#FFFFFF', true, '#000000');
                                }
                                num = this.I;
                                num.G(this.i() / 1.2);
                                num.u(~~(this.size * this.size / 100));
                                text = Math.ceil(10 * g_scale) / 10;
                                num.U(text);
                                skin = num.F();
                                g_width = ~~(skin.width / text);
                                g_height = ~~(skin.height / text);
                                context.drawImage(skin, ~~this.x - ~~(g_width / 2), isSimpleDrawing - ~~(g_height / 2), g_width, g_height);
                            }
                            context.restore();
                        }
                    }
                };
                CachedCanvas.prototype = {
                    w: '',
                    M: '#000000',
                    O: false,
                    r: '#000000',
                    q: 16,
                    l: null,
                    N: null,
                    h: false,
                    v: 1,
                    G: function(val) {
                        if (this.q != val) {
                            this.q = val;
                            this.h = true;
                        }
                    },
                    U: function(val) {
                        if (this.v != val) {
                            this.v = val;
                            this.h = true;
                        }
                    },
                    setStrokeColor: function(val) {
                        if (this.r != val) {
                            this.r = val;
                            this.h = true;
                        }
                    },
                    u: function(val) {
                        if (val != this.w) {
                            this.w = val;
                            this.h = true;
                        }
                    },
                    F: function() {
                        if (null == this.l) {
                            this.l = document.createElement('canvas');
                            this.N = this.l.getContext('2d');
                        }
                        if (this.h) {
                            this.h = false;
                            var items = this.l;
                            var context = this.N;
                            var value = this.w;
                            var scale = this.v;
                            var size = this.q;
                            var font = size + 'px Ubuntu';
                            context.font = font;
                            var extra = ~~(0.2 * size);
                            items.width = (context.measureText(value).width + 6) * scale;
                            items.height = (size + extra) * scale;
                            context.font = font;
                            context.scale(scale, scale);
                            context.globalAlpha = 1;
                            context.lineWidth = 3;
                            context.strokeStyle = this.r;
                            context.fillStyle = this.M;
                            if (this.O) {
                                context.strokeText(value, 3, size - extra / 2);
                            }
                            context.fillText(value, 3, size - extra / 2);
                        }
                        return this.l;
                    }
                };
                if (!Date.now) {
                    Date.now = function() {
                        return new Date().getTime();
                    };
                }
                (function() {
                    for (var g_skinNamesB = [
                        'ms',
                        'moz',
                        'webkit',
                        'o'
                    ], i = 0; i < g_skinNamesB.length && !window.requestAnimationFrame; ++i) {
                        window.requestAnimationFrame = window[g_skinNamesB[i] + 'RequestAnimationFrame'];
                        window.cancelAnimationFrame = window[g_skinNamesB[i] + 'CancelAnimationFrame'] || window[g_skinNamesB[i] + 'CancelRequestAnimationFrame'];
                    }
                    if (!window.requestAnimationFrame) {
                        window.requestAnimationFrame = function(rect) {
                            return setTimeout(rect, 1000 / 60);
                        };
                        window.cancelAnimationFrame = function(item) {
                            clearTimeout(item);
                        };
                    }
                }());
                var QTreeFactory = {
                    X: function(item) {
                        function __unmatched_372(val) {
                            if (val < __unmatched_374) {
                                val = __unmatched_374;
                            }
                            if (val > __unmatched_376) {
                                val = __unmatched_376;
                            }
                            return ~~((val - __unmatched_374) / 32);
                        }
                        function __unmatched_373(__unmatched_382) {
                            if (__unmatched_382 < __unmatched_375) {
                                __unmatched_382 = __unmatched_375;
                            }
                            if (__unmatched_382 > __unmatched_377) {
                                __unmatched_382 = __unmatched_377;
                            }
                            return ~~((__unmatched_382 - __unmatched_375) / 32);
                        }
                        var __unmatched_374 = item.ba;
                        var __unmatched_375 = item.ca;
                        var __unmatched_376 = item.Z;
                        var __unmatched_377 = item.$;
                        var depth = ~~((__unmatched_376 - __unmatched_374) / 32) + 1;
                        var maxDepth = ~~((__unmatched_377 - __unmatched_375) / 32) + 1;
                        var point = Array(depth * maxDepth);
                        return {
                            Y: function(__unmatched_383) {
                                var __unmatched_384 = __unmatched_372(__unmatched_383.x) + __unmatched_373(__unmatched_383.y) * depth;
                                if (null == point[__unmatched_384]) {
                                    point[__unmatched_384] = __unmatched_383;
                                } else if (Array.isArray(point[__unmatched_384])) {
                                    point[__unmatched_384].push(__unmatched_383);
                                } else {
                                    point[__unmatched_384] = [
                                        point[__unmatched_384],
                                        __unmatched_383
                                    ];
                                }
                            },
                            ea: function(__unmatched_385, __unmatched_386, val, __unmatched_388, callback) {
                                var __unmatched_390 = __unmatched_372(__unmatched_385);
                                var __unmatched_391 = __unmatched_373(__unmatched_386);
                                __unmatched_385 = __unmatched_372(__unmatched_385 + val);
                                __unmatched_386 = __unmatched_373(__unmatched_386 + __unmatched_388);
                                if (0 > __unmatched_390 || __unmatched_390 >= depth || 0 > __unmatched_391 || __unmatched_391 >= maxDepth) {
                                    debugger;
                                }
                                for (; __unmatched_391 <= __unmatched_386; ++__unmatched_391) {
                                    for (__unmatched_388 = __unmatched_390; __unmatched_388 <= __unmatched_385; ++__unmatched_388) {
                                        if (val = point[__unmatched_388 + __unmatched_391 * depth], null != val) {
                                            if (Array.isArray(val)) {
                                                for (var i = 0; i < val.length; i++) {
                                                    callback(val[i]);
                                                }
                                            } else {
                                                callback(val);
                                            }
                                        }
                                    }
                                }
                            }
                        };
                    }
                };
                var __unmatched_141 = function() {
                    var __unmatched_393 = new Cell(0, 0, 0, 32, '#ED1C24', '');
                    var __unmatched_394 = document.createElement('canvas');
                    __unmatched_394.width = 32;
                    __unmatched_394.height = 32;
                    var rect = __unmatched_394.getContext('2d');
                    return function() {
                        if (0 < g_playerCells.length) {
                            __unmatched_393.color = g_playerCells[0].color;
                            __unmatched_393.t(g_playerCells[0].name);
                        }
                        rect.clearRect(0, 0, 32, 32);
                        rect.save();
                        rect.translate(16, 16);
                        rect.scale(0.4, 0.4);
                        __unmatched_393.s(rect);
                        rect.restore();
                        var __unmatched_396 = document.getElementById('favicon');
                        var __unmatched_397 = __unmatched_396.cloneNode(true);
                        __unmatched_397.setAttribute('href', __unmatched_394.toDataURL('image/png'));
                        __unmatched_396.parentNode.replaceChild(__unmatched_397, __unmatched_396);
                    };
                }();
                $(function() {
                    __unmatched_141();
                });
                var i_ = 'loginCache3';
                $(function() {
                    if (+window.localStorage.wannaLogin) {
                        if (window.localStorage[i_]) {
                            __unmatched_45(window.localStorage[i_]);
                        }
                        if (window.localStorage.fbPictureCache) {
                            $('.agario-profile-picture').attr('src', window.localStorage.fbPictureCache);
                        }
                    }
                });
                window.facebookLogin = function() {
                    window.localStorage.wannaLogin = 1;
                };
                window.fbAsyncInit = function() {
                    function __unmatched_398() {
                        window.localStorage.wannaLogin = 1;
                        if (null == window.FB) {
                            alert('You seem to have something blocking Facebook on your browser, please check for any extensions');
                        } else {
                            window.FB.login(function(callback) {
                                UpdateScale(callback);
                            }, {
                                scope: 'public_profile, email'
                            });
                        }
                    }
                    window.FB.init({
                        appId: '677505792353827',
                        cookie: true,
                        xfbml: true,
                        status: true,
                        version: 'v2.2'
                    });
                    window.FB.Event.subscribe('auth.statusChange', function(__unmatched_400) {
                        if (+window.localStorage.wannaLogin) {
                            if ('connected' == __unmatched_400.status) {
                                UpdateScale(__unmatched_400);
                            } else {
                                __unmatched_398();
                            }
                        }
                    });
                    window.facebookLogin = __unmatched_398;
                };
                window.logout = function() {
                    __unmatched_110 = null;
                    $('#helloContainer').attr('data-logged-in', '0');
                    $('#helloContainer').attr('data-has-account-data', '0');
                    delete window.localStorage.wannaLogin;
                    delete window.localStorage[i_];
                    delete window.localStorage.fbPictureCache;
                    Start();
                };
                var __unmatched_143 = function() {
                    function ParseString(width, top, callback, height, left) {
                        var __unmatched_415 = top.getContext('2d');
                        var __unmatched_416 = top.width;
                        top = top.height;
                        width.color = left;
                        width.t(callback);
                        width.size = height;
                        __unmatched_415.save();
                        __unmatched_415.translate(__unmatched_416 / 2, top / 2);
                        width.s(__unmatched_415);
                        __unmatched_415.restore();
                    }
                    for (var __unmatched_402 = new Cell(-1, 0, 0, 32, '#5bc0de', ''), __unmatched_403 = new Cell(-1, 0, 0, 32, '#5bc0de', ''), __unmatched_404 = '#0791ff #5a07ff #ff07fe #ffa507 #ff0774 #077fff #3aff07 #ff07ed #07a8ff #ff076e #3fff07 #ff0734 #07ff20 #ff07a2 #ff8207 #07ff0e'.split(' '), g_skinNamesC = [], j = 0; j < __unmatched_404.length; ++j) {
                        var sub = j / __unmatched_404.length * 12;
                        var __unmatched_408 = 30 * Math.sqrt(j / __unmatched_404.length);
                        g_skinNamesC.push(new Cell(-1, Math.cos(sub) * __unmatched_408, Math.sin(sub) * __unmatched_408, 10, __unmatched_404[j], ''));
                    }
                    __unmatched_43(g_skinNamesC);
                    var data = document.createElement('canvas');
                    data.getContext('2d');
                    data.width = data.height = 70;
                    ParseString(__unmatched_403, data, '', 26, '#ebc0de');
                    return function() {
                        $('.cell-spinner').filter(':visible').each(function() {
                            var __unmatched_417 = $(this);
                            var g = Date.now();
                            var width = this.width;
                            var __unmatched_420 = this.height;
                            var item = this.getContext('2d');
                            item.clearRect(0, 0, width, __unmatched_420);
                            item.save();
                            item.translate(width / 2, __unmatched_420 / 2);
                            for (var g_numFrames = 0; 10 > g_numFrames; ++g_numFrames) {
                                item.drawImage(data, (0.1 * g + 80 * g_numFrames) % (width + 140) - width / 2 - 70 - 35, __unmatched_420 / 2 * Math.sin((0.001 * g + g_numFrames) % Math.PI * 2) - 35, 70, 70);
                            }
                            item.restore();
                            if (__unmatched_417 = __unmatched_417.attr('data-itr')) {
                                __unmatched_417 = Render(__unmatched_417);
                            }
                            ParseString(__unmatched_402, this, __unmatched_417 || '', +$(this).attr('data-size'), '#5bc0de');
                        });
                        $('#statsPellets').filter(':visible').each(function() {
                            $(this);
                            var height = this.width;
                            var __unmatched_424 = this.height;
                            this.getContext('2d').clearRect(0, 0, height, __unmatched_424);
                            for (height = 0; height < g_skinNamesC.length; height++) {
                                ParseString(g_skinNamesC[height], this, '', g_skinNamesC[height].size, g_skinNamesC[height].color);
                            }
                        });
                    };
                }();
                window.createParty = function() {
                    n(':party');
                    __unmatched_126 = function(rect) {
                        __unmatched_49('/#' + window.encodeURIComponent(rect));
                        $('.partyToken').val('agar.io/#' + window.encodeURIComponent(rect));
                        $('#helloContainer').attr('data-party-state', '1');
                    };
                    Start();
                };
                window.joinParty = RenderLoop;
                window.cancelParty = function() {
                    __unmatched_49('/');
                    $('#helloContainer').attr('data-party-state', '0');
                    n('');
                    Start();
                };
                var points = [];
                var __unmatched_145 = 0;
                var __unmatched_146 = '#000000';
                var __unmatched_147 = false;
                var __unmatched_148 = false;
                var __unmatched_149 = 0;
                var __unmatched_150 = 0;
                var __unmatched_151 = 0;
                var __unmatched_152 = 0;
                var g_mode = 0;
                var __unmatched_154 = true;
                setInterval(function() {
                    if (__unmatched_148) {
                        points.push(__unmatched_37() / 100);
                    }
                }, 1000 / 60);
                setInterval(function() {
                    var start = __unmatched_52();
                    if (0 != start) {
                        ++__unmatched_151;
                        if (0 == g_mode) {
                            g_mode = start;
                        }
                        g_mode = Math.min(g_mode, start);
                    }
                }, 1000);
                window.closeStats = function() {
                    __unmatched_147 = false;
                    $('#stats').hide();
                    __unmatched_14(window.ab);
                    __unmatched_10(0);
                };
                window.setSkipStats = function(__unmatched_427) {
                    __unmatched_154 = !__unmatched_427;
                };
                $(function() {
                    $(Init);
                });
            }
        }
    }
}(unsafeWindow, unsafeWindow.jQuery));

window.msgpack = this.msgpack;

(function() {
    var _WebSocket = window._WebSocket = window.WebSocket;
    var $ = window.jQuery;
    var msgpack = window.msgpack;
    var options = {
        enableMultiCells: true,
        enablePosition: true,
        enableAxes: false,
        enableCross: true
    };

    // game states
    var agar_server = null;
    var map_server = null;
    var player_name = [];
    var players = [];
    var id_players = [];
    var cells = [];
    var current_cell_ids = [];
    var start_x = -7000,
        start_y = -7000,
        end_x = 7000,
        end_y = 7000,
        length_x = 14000,
        length_y = 14000;
    var render_timer = null;

    function miniMapSendRawData(data) {
        if (map_server !== null && map_server.readyState === window._WebSocket.OPEN) {
            var array = new Uint8Array(data);
            map_server.send(array.buffer);
        }
    }

    function miniMapConnectToServer(address, onOpen, onClose) {
        try {
            var ws = new window._WebSocket(address);
        } catch (ex) {
            onClose();
            console.error(ex);
            return false;
        }
        ws.binaryType = "arraybuffer";

        ws.onopen = function() {
            onOpen();
            console.log(address + ' connected');
        }

        ws.onmessage = function(event) {
            var buffer = new Uint8Array(event.data);
            var packet = msgpack.unpack(buffer);
            switch(packet.type) {
                case 128:
                    for (var i=0; i < packet.data.addition.length; ++i) {
                        var cell = packet.data.addition[i];
                        if (! miniMapIsRegisteredToken(cell.id))
                        {
                            miniMapRegisterToken(
                                cell.id,
                                miniMapCreateToken(cell.id, cell.color)
                            );
                        }

                        var size_n = cell.size/length_x;
                        miniMapUpdateToken(cell.id, (cell.x - start_x)/length_x, (cell.y - start_y)/length_y, size_n);
                    }

                    for (var i=0; i < packet.data.deletion.length; ++i) {
                        var id = packet.data.deletion[i];
                        miniMapUnregisterToken(id);
                    }
                    break;
                case 129:
                    players = packet.data;
                    for (var p in players) {
                        var player = players[p];
                        var ids = player.ids;
                        for (var i in ids) {
                            id_players[ids[i]] = player.no;
                        }
                    }
                    mini_map_party.trigger('update-list');
                    break;
                case 130:
                    if (agar_server != packet.data.url) {
                        var region_name = $('#region > option[value="' + packet.data.region + '"]').text();
                        var gamemode_name = $('#gamemode > option[value="' + packet.data.gamemode + '"]').text();
                        var title = 'Agar Server Mismatched';
                        var content = ('You are now at: <strong>' + agar_server
                                       + '</strong><br>Your team members are all at: <strong>' + packet.data.url + ', ' + region_name + ':' + gamemode_name + packet.data.party
                                       + '</strong>.<br>The minimap server has disconnected automatically.');

                        $('#mini-map-connect-btn').popover('destroy').popover({
                            animation: false,
                            placement: 'top',
                            title: title,
                            content: content,
                            container: document.body,
                            html: true
                        }).popover('show');
                    } else {
                        $('#mini-map-content-btn').popover('hide');
                    }
                    break;
            }
        }

        ws.onerror = function() {
            onClose();
            console.error('failed to connect to map server');
        }

        ws.onclose = function() {
            onClose();
            map_server = null;
            console.log('map server disconnected');
        }

        map_server = ws;
    }

    function miniMapRender() {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var id in window.mini_map_tokens) {
            var token = window.mini_map_tokens[id];
            var x = token.x * canvas.width;
            var y = token.y * canvas.height;
            var size = token.size * canvas.width;

            ctx.beginPath();
            ctx.arc(
                x,
                y,
                size,
                0,
                2 * Math.PI,
                false
            );
            ctx.closePath();
            ctx.fillStyle = token.color;
            ctx.fill();

            if (options.enableCross && -1 != current_cell_ids.indexOf(token.id))
                miniMapDrawCross(token.x, token.y, token.color);

            if (options.enableAxes && -1 != current_cell_ids.indexOf(token.id))
                miniMapDrawMiddleCross()

                if (id_players[id] !== undefined) {
                    // Draw you party member's crosshair
                    if (options.enableCross) {
                        miniMapDrawCross(token.x, token.y, token.color);
                    }

                    ctx.font = size * 2 + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(id_players[id] + 1, x, y);
                }
        };
    }

    function miniMapDrawCross(x, y, color) {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y * canvas.height);
        ctx.lineTo(canvas.width, y * canvas.height);
        ctx.moveTo(x * canvas.width, 0);
        ctx.lineTo(x * canvas.width, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = color || '#FFFFFF';
        ctx.stroke();
    }

    function miniMapDrawMiddleCross() {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }

    function miniMapCreateToken(id, color) {
        var mini_map_token = {
            id: id,
            color: color,
            x: 0,
            y: 0,
            size: 0
        };
        return mini_map_token;
    }

    function miniMapRegisterToken(id, token) {
        if (window.mini_map_tokens[id] === undefined) {
            // window.mini_map.append(token);
            window.mini_map_tokens[id] = token;
        }
    }

    function miniMapUnregisterToken(id) {
        if (window.mini_map_tokens[id] !== undefined) {
            // window.mini_map_tokens[id].detach();
            delete window.mini_map_tokens[id];
        }
    }

    function miniMapIsRegisteredToken(id) {
        return window.mini_map_tokens[id] !== undefined;
    }

    function miniMapUpdateToken(id, x, y, size) {
        if (window.mini_map_tokens[id] !== undefined) {

            window.mini_map_tokens[id].x = x;
            window.mini_map_tokens[id].y = y;
            window.mini_map_tokens[id].size = size;

            return true;
        } else {
            return false;
        }
    }

    function miniMapUpdatePos(x, y) {
        window.mini_map_pos.text('x: ' + x.toFixed(0) + ', y: ' + y.toFixed(0));
    }

    function miniMapReset() {
        cells = [];
        window.mini_map_tokens = [];
    }

    function miniMapInit() {
        window.mini_map_tokens = [];

        cells = [];
        current_cell_ids = [];
        start_x = -7000;
        start_y = -7000;
        end_x = 7000;
        end_y = 7000;
        length_x = 14000;
        length_y = 14000;

        // minimap dom
        if ($('#mini-map-wrapper').length === 0) {
            var wrapper = $('<div>').attr('id', 'mini-map-wrapper').css({
                position: 'fixed',
                bottom: 10,
                right: 10,
                width: 300,
                height: 300,
                background: 'rgba(128, 128, 128, 0.58)'
            });

            var mini_map = $('<canvas>').attr({
                id: 'mini-map',
                width: 300,
                height: 300
            }).css({
                width: '100%',
                height: '100%',
                position: 'relative'
            });

            wrapper.append(mini_map).appendTo(document.body);

            window.mini_map = mini_map[0];
        }

        // minimap renderer
        if (render_timer === null)
            render_timer = setInterval(miniMapRender, 1000 / 30);

        // minimap location
        if ($('#mini-map-pos').length === 0) {
            window.mini_map_pos = $('<div>').attr('id', 'mini-map-pos').css({
                bottom: 10,
                right: 10,
                color: 'white',
                fontSize: 15,
                fontWeight: 800,
                position: 'fixed'
            }).appendTo(document.body);
        }

        // minimap options
        if ($('#mini-map-options').length === 0) {
            window.mini_map_options = $('<div>').attr('id', 'mini-map-options').css({
                bottom: 315,
                right: 10,
                color: '#666',
                fontSize: 14,
                position: 'fixed',
                fontWeight: 400,
                zIndex: 1000
            }).appendTo(document.body);

            var container = $('<div>')
            .css({
                background: 'rgba(200, 200, 200, 0.58)',
                padding: 5,
                borderRadius: 5
            })
            .hide();

            for (var name in options) {

                var label = $('<label>').css({
                    display: 'block'
                });

                var checkbox = $('<input>').attr({
                    type: 'checkbox'
                }).prop({
                    checked: options[name]
                });

                label.append(checkbox);
                label.append(' ' + camel2cap(name));

                checkbox.click(function(options, name) { return function(evt) {
                    options[name] = evt.target.checked;
                    console.log(name, evt.target.checked);
                }}(options, name));

                label.appendTo(container);
            }

            container.appendTo(window.mini_map_options);
            var form = $('<div>')
            .addClass('form-inline')
            .css({
                opacity: 0.7,
                marginTop: 2
            })
            .appendTo(window.mini_map_options);

            var form_group = $('<div>')
            .addClass('form-group')
            .appendTo(form);

            var setting_btn = $('<button>')
            .addClass('btn')
            .css({
                float: 'right',
                fontWeight: 800,
                marginLeft: 2
            })
            .on('click', function() {
                container.toggle();
                setting_btn.blur();
                return false;
            })
            .append($('<i>').addClass('glyphicon glyphicon-cog'))
            .appendTo(form_group);

            var help_btn = $('<button>')
            .addClass('btn')
            .text('?')
            .on('click', function(e) {
                window.open('https://github.com/dimotsai/agar-mini-map/#minimap-server');
                help_btn.blur();
                return false;
            })
            .appendTo(form_group);

            var addressInput = $('<input>')
            .css({
                marginLeft: 2
            })
            .attr('placeholder', 'ws://127.0.0.1:34343')
            .attr('type', 'text')
            .addClass('form-control')
            .val('ws://127.0.0.1:34343')
            .appendTo(form_group);

            var connect = function (evt) {
                var address = addressInput.val();

                connectBtn.popover('destroy');
                connectBtn.text('Disconnect');
                miniMapConnectToServer(address, function onOpen() {
                    miniMapSendRawData(msgpack.pack({
                        type: 0,
                        data: player_name
                    }));
                    for (var i in current_cell_ids) {
                        miniMapSendRawData(msgpack.pack({
                            type: 32,
                            data: current_cell_ids[i]
                        }));
                    }
                    miniMapSendRawData(msgpack.pack({
                        type: 100,
                        data: {url: agar_server, region: $('#region').val(), gamemode: $('#gamemode').val(), party: location.hash}
                    }));
                    window.mini_map_party.show();
                }, function onClose() {
                    players = [];
                    id_players = [];
                    window.mini_map_party.hide();
                    disconnect();
                });

                connectBtn.off('click');
                connectBtn.on('click', disconnect);

                miniMapReset();

                connectBtn.blur();
            };

            var disconnect = function() {
                connectBtn.text('Connect');
                connectBtn.off('click');
                connectBtn.on('click', connect);
                connectBtn.blur();
                if (map_server)
                    map_server.close();

                miniMapReset();
            };

            var connectBtn = $('<button>')
            .attr('id', 'mini-map-connect-btn')
            .css({
                marginLeft: 2
            })
            .text('Connect')
            .click(connect)
            .addClass('btn')
            .appendTo(form_group);
        }

        // minimap party
        if ($('#mini-map-party').length === 0) {
            var mini_map_party = window.mini_map_party = $('<div>')
            .css({
                top: 50,
                left: 10,
                width: 200,
                color: '#FFF',
                fontSize: 20,
                position: 'fixed',
                fontWeight: 600,
                background: 'rgba(128, 128, 128, 0.58)',
                textAlign: 'center',
                padding: 10
            })
            .attr('id', 'mini-map-party')
            .appendTo(window.document.body)
            .append(
                $('<h3>').css({
                    margin: 0,
                    padding: 0
                }).text('Party')
            );

            var mini_map_party_list = $('<ol>')
            .attr('id', 'mini-map-party-list')
            .css({
                listStyle: 'none',
                padding: 0,
                margin: 0
            })
            .appendTo(mini_map_party);

            mini_map_party.on('update-list', function(e) {
                mini_map_party_list.empty();

                for (var p in players) {
                    var player = players[p];
                    var name = String.fromCharCode.apply(null, player.name);
                    name = (name == '' ? 'anonymous' : name);
                    $('<li>')
                    .text(player.no + 1 + '. ' + name)
                    .appendTo(mini_map_party_list);
                }
            });

            mini_map_party.hide();
        }
    }

    // cell constructor
    function Cell(id, x, y, size, color, name) {
        cells[id] = this;
        this.id = id;
        this.ox = this.x = x;
        this.oy = this.y = y;
        this.oSize = this.size = size;
        this.color = color;
        this.points = [];
        this.pointsAcc = [];
        this.setName(name);
    }

    Cell.prototype = {
        id: 0,
        points: null,
        pointsAcc: null,
        name: null,
        nameCache: null,
        sizeCache: null,
        x: 0,
        y: 0,
        size: 0,
        ox: 0,
        oy: 0,
        oSize: 0,
        nx: 0,
        ny: 0,
        nSize: 0,
        updateTime: 0,
        updateCode: 0,
        drawTime: 0,
        destroyed: false,
        isVirus: false,
        isAgitated: false,
        wasSimpleDrawing: true,

        destroy: function() {
            delete cells[this.id];
            id = current_cell_ids.indexOf(this.id);
            -1 != id && current_cell_ids.splice(id, 1);
            this.destroyed = true;
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                miniMapUnregisterToken(this.id);
            }
        },
        setName: function(name) {
            this.name = name;
        },
        updatePos: function() {
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                if (options.enableMultiCells || -1 != current_cell_ids.indexOf(this.id)) {
                    if (! miniMapIsRegisteredToken(this.id))
                    {
                        miniMapRegisterToken(
                            this.id,
                            miniMapCreateToken(this.id, this.color)
                        );
                    }

                    var size_n = this.nSize/length_x;
                    miniMapUpdateToken(this.id, (this.nx - start_x)/length_x, (this.ny - start_y)/length_y, size_n);
                }
            }

            if (options.enablePosition && -1 != current_cell_ids.indexOf(this.id)) {
                window.mini_map_pos.show();
                miniMapUpdatePos(this.nx, this.ny);
            } else {
                window.mini_map_pos.hide();
            }

        }
    };

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function camel2cap(str) {
        return str.replace(/([A-Z])/g, function(s){return ' ' + s.toLowerCase();}).capitalize();
    };

    // create a linked property from slave object
    // whenever master[prop] update, slave[prop] update
    function refer(master, slave, prop) {
        Object.defineProperty(master, prop, {
            get: function(){
                return slave[prop];
            },
            set: function(val) {
                slave[prop] = val;
            },
            enumerable: true,
            configurable: true
        });
    };

    // extract a websocket packet which contains the information of cells
    function extractCellPacket(data, offset) {
        ////
        var dataToSend = {
            destroyQueue : [],
            nodes : [],
            nonVisibleNodes : []
        };
        ////

        var I = +new Date;
        var qa = false;
        var b = Math.random(), c = offset;
        var size = data.getUint16(c, true);
        c = c + 2;

        // Nodes to be destroyed (killed)
        for (var e = 0; e < size; ++e) {
            var p = cells[data.getUint32(c, true)],
                f = cells[data.getUint32(c + 4, true)],
                c = c + 8;
            p && f && (
                f.destroy(),
                f.ox = f.x,
                f.oy = f.y,
                f.oSize = f.size,
                f.nx = p.x,
                f.ny = p.y,
                f.nSize = f.size,
                f.updateTime = I,
                dataToSend.destroyQueue.push(f.id));

        }

        // Nodes to be updated
        for (e = 0; ; ) {
            var d = data.getUint32(c, true);
            c += 4;
            if (0 == d) {
                break;
            }
            ++e;
            var p = data.getInt32(c, true),
                c = c + 4,
                f = data.getInt32(c, true),
                c = c + 4;
            g = data.getInt16(c, true);
            c = c + 2;
            for (var h = data.getUint8(c++), m = data.getUint8(c++), q = data.getUint8(c++), h = (h << 16 | m << 8 | q).toString(16); 6 > h.length; )
                h = "0" + h;

            var h = "#" + h,
                k = data.getUint8(c++),
                m = !!(k & 1),
                q = !!(k & 16);

            k & 2 && (c += 4);
            k & 4 && (c += 8);
            k & 8 && (c += 16);

            for (var n, k = ""; ; ) {
                n = data.getUint16(c, true);
                c += 2;
                if (0 == n)
                    break;
                k += String.fromCharCode(n)
            }

            n = k;
            k = null;

            var updated = false;
            // if d in cells then modify it, otherwise create a new cell
            cells.hasOwnProperty(d)
            ? (k = cells[d],
               k.updatePos(),
               k.ox = k.x,
               k.oy = k.y,
               k.oSize = k.size,
               k.color = h,
               updated = true)
            : (k = new Cell(d, p, f, g, h, n),
               k.pX = p,
               k.pY = f);

            k.isVirus = m;
            k.isAgitated = q;
            k.nx = p;
            k.ny = f;
            k.nSize = g;
            k.updateCode = b;
            k.updateTime = I;
            n && k.setName(n);

            // ignore food creation
            if (updated) {
                dataToSend.nodes.push({
                    id: k.id,
                    x: k.nx,
                    y: k.ny,
                    size: k.nSize,
                    color: k.color
                });
            }
        }

        // Destroy queue + nonvisible nodes
        b = data.getUint32(c, true);
        c += 4;
        for (e = 0; e < b; e++) {
            d = data.getUint32(c, true);
            c += 4, k = cells[d];
            null != k && k.destroy();
            dataToSend.nonVisibleNodes.push(d);
        }

        var packet = {
            type: 16,
            data: dataToSend
        }

        miniMapSendRawData(msgpack.pack(packet));
    }

    // extract the type of packet and dispatch it to a corresponding extractor
    function extractPacket(event) {
        var c = 0;
        var data = new DataView(event.data);
        240 == data.getUint8(c) && (c += 5);
        var opcode = data.getUint8(c);
        c++;
        switch (opcode) {
            case 16: // cells data
                extractCellPacket(data, c);
                break;
            case 20: // cleanup ids
                current_cell_ids = [];
                break;
            case 32: // cell id belongs me
                var id = data.getUint32(c, true);

                if (current_cell_ids.indexOf(id) === -1)
                    current_cell_ids.push(id);

                miniMapSendRawData(msgpack.pack({
                    type: 32,
                    data: id
                }));
                break;
            case 64: // get borders
                start_x = data.getFloat64(c, !0), c += 8,
                    start_y = data.getFloat64(c, !0), c += 8,
                    end_x = data.getFloat64(c, !0), c += 8,
                    end_y = data.getFloat64(c, !0), c += 8,
                    center_x = (start_x + end_x) / 2,
                    center_y = (start_y + end_y) / 2,
                    length_x = Math.abs(start_x - end_x),
                    length_y = Math.abs(start_y - end_y);
        }
    };

    function extractSendPacket(data) {
        var view = new DataView(data);
        switch (view.getUint8(0, true)) {
            case 0:
                player_name = [];
                for (var i=1; i < data.byteLength; i+=2) {
                    player_name.push(view.getUint16(i, true));
                }

                miniMapSendRawData(msgpack.pack({
                    type: 0,
                    data: player_name
                }));
                break;
        }
    }

    // the injected point, overwriting the WebSocket constructor
    window.WebSocket = function(url, protocols) {
        console.log('Listen');

        if (protocols === undefined) {
            protocols = [];
        }

        var ws = new _WebSocket(url, protocols);

        refer(this, ws, 'binaryType');
        refer(this, ws, 'bufferedAmount');
        refer(this, ws, 'extensions');
        refer(this, ws, 'protocol');
        refer(this, ws, 'readyState');
        refer(this, ws, 'url');

        this.send = function(data){
            extractSendPacket(data);
            return ws.send.call(ws, data);
        };

        this.close = function(){
            return ws.close.call(ws);
        };

        this.onopen = function(event){};
        this.onclose = function(event){};
        this.onerror = function(event){};
        this.onmessage = function(event){};

        ws.onopen = function(event) {
            miniMapInit();
            agar_server = url;
            miniMapSendRawData(msgpack.pack({
                type: 100,
                data: {url: url, region: $('#region').val(), gamemode: $('#gamemode').val(), party: location.hash}
            }));
            if (this.onopen)
                return this.onopen.call(ws, event);
        }.bind(this);

        ws.onmessage = function(event) {
            extractPacket(event);
            if (this.onmessage)
                return this.onmessage.call(ws, event);
        }.bind(this);

        ws.onclose = function(event) {
            if (this.onclose)
                return this.onclose.call(ws, event);
        }.bind(this);

        ws.onerror = function(event) {
            if (this.onerror)
                return this.onerror.call(ws, event);
        }.bind(this);
    };

    window.WebSocket.prototype = _WebSocket;

    $(window.document).ready(function() {
        miniMapInit();
    });

    $(window).load(function() {
        var main_canvas = document.getElementById('canvas');
        if (main_canvas && main_canvas.onmousemove) {
            document.onmousemove = main_canvas.onmousemove;
            main_canvas.onmousemove = null;
        }
    });
})();
//v1
//Press a will fire upto 8 feeds
/*$(document).on('keydown',function(e){
if(e.keyCode == 81){
for(var i = 0; i<8; i++){
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}
}
})
*/

//v2
//Press a will fire upto 8 feeds
/*$(document).on('keyup',function(e){
if(e.keyCode == 81){
var count = 0;
var interval = setInterval(function() {
if(count > 7){
clearInterval(interval);
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}, 50);
}
})*/

//v3
//Press Q will fire upto 20 feeds
/*var interval;
var theSwitch = false;
$(document).on('keyup',function(e){
if(e.keyCode == 81){
var count = 0;
if(theSwitch){
theSwitch = false;
clearInterval(interval);
return;
}
theSwitch = true;
interval = setInterval(function() {
if(count > 20){ //Change this number if you want more
theSwitch = false;
clearInterval(interval);
return;
}
count++
console.log('firing')
$("body").trigger($.Event("keydown", { keyCode: 87}));
$("body").trigger($.Event("keyup", { keyCode: 87}));
}, 10);//increase this number to make it fire them out slower
}
})*/

//v4
//Hold a down and it will keep firing untill you take your finger off!
console.log('called');
var interval;
var switchy = false;
$(document).on('keydown',function(e){
    console.log('keydown e.keyCode="'+e.keyCode+'"');
    if(e.keyCode == 81){
        console.log('keydown 81, switchy '+switchy);
        if(switchy){
            return;
        }
        switchy = true;
        interval = setInterval(function() {
            console.log('firing');
            $("body").trigger($.Event("keydown", { keyCode: 87}));
            $("body").trigger($.Event("keyup", { keyCode: 87}));
        }, 10);//increase this number to make it fire them out slower
    }
})

$(document).on('keyup',function(e){
    console.log('keyup e.keyCode="'+e.keyCode+'"');
    if(e.keyCode == 81){
        console.log('stop firing');
        switchy = false;
        clearInterval(interval);
        return;
    }
})



