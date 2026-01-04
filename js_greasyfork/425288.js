// ==UserScript==
// @name         Wall stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nomads wall
// @author       You
// @match        https://www.torn.com/factions.php?step=your
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425288/Wall%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/425288/Wall%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var xanax_taken = 500;



    window.onload = function() {
        var wall_stat = `Dune;100;3344;3763;2651;1564;0
TheDookieBaron;88;1688;2969;522;1463;0
matty_h;92;5836;2362;1153;1553;0
Titan;100;5570;2283;1140;1640;0
RealXT;85;3074;2127;1248;1485;2
JessicaBazaar;35;5477;1675;1010;1379;0
Muzzfather;76;5382;1647;1226;1530;0
Myers;72;1302;1636;664;886;0
PimpChu;56;4301;1598;679;1092;0
MrJenks657;61;4603;1469;451;1096;0
codenameseven7;75;3350;1456;999;979;0
_a77ILa_;39;552;1315;526;1378;0
Lyno;80;4979;1311;863;1266;0
Madolf;50;740;1148;303;1282;0
Winger;70;4715;1110;818;1263;0
m140;50;429;1065;364;1461;0
Jon;50;1602;879;244;1007;0
Jinx;75;5714;844;237;1338;0
kaeus;50;530;819;199;1146;0
Ixtumboxi420;20;499;813;208;1414;0
Caross;32;537;779;111;1376;0
Skunko3o;55;467;721;231;1347;0
MrNobodyHi;52;377;710;335;1230;0
Murenn;87;4445;659;1607;908;1
SBTRKT;46;3785;634;549;1266;0
Reaperhunt;45;5670;564;400;1324;0
Germ;60;2496;527;256;1279;0
Thesammy;50;4360;507;292;1253;0
Zahrim;15;2969;457;361;1380;0
regulator906;80;5780;449;483;1263;1
Huge_potat0;45;615;429;50;1380;0
craidle;40;301;414;130;1426;0
Tealy;61;1115;395;89;1195;0
ROOSTER_LIBRE;65;1071;337;28;1335;0
march;63;4353;280;233;1003;0
Lox;64;5784;273;416;927;1
RailroadKing;61;5890;227;278;1287;1
Dwaynos;44;1079;220;26;1248;1
sproutyrouty;75;4998;198;329;1350;1
Classic-King;48;2684;192;32;1169;0
Mishyyy;20;220;184;52;1135;0
MADDIRISH;52;1390;159;106;1238;0
Mardies;34;229;156;64;1294;0
Moll;57;5383;122;226;777;0
kristns;30;436;112;25;1301;0
BrianPotter;53;3299;109;101;962;0
Artturiez;12;439;109;44;1233;0
HomelessWino;40;677;96;137;1300;0
Sneakapeak;36;348;94;43;1294;0
Cringles;30;240;93;26;1487;0
ThumpiYT;21;515;91;15;1216;0
MangoDeMango;31;972;87;18;1173;0
Lex_Steel;21;187;86;97;1072;0
Costex90;29;256;78;153;1347;0
Demonic_Angel;33;5695;77;109;1025;0
-Danny;29;466;75;11;1068;0
breadmAKer47;15;84;74;7;1136;0
madhatter_;20;322;72;6;1200;0
PawnAddiction;38;3877;68;186;1230;0
stachet;33;4864;65;317;1321;0
LostProphet001;58;5767;64;367;1239;0
King_Kush;45;3544;62;45;1147;1
Jcsoccer10;47;3459;55;60;1320;0
hottubmolly;23;225;55;24;1172;0
Achingpanic;35;2063;46;112;1022;0
Diabloein;29;888;37;9;1100;0
HuntDaddy;42;908;36;44;1094;0
waitlist;27;484;35;9;1032;0
MdNgtF8;23;1458;33;78;1116;0
Stone;35;853;31;44;1183;0
s1990;25;3455;28;309;1272;0
PanRagon;40;2157;27;327;1180;0
Johnny__5;25;652;22;52;1118;0
BaronAaron;18;82;16;31;1037;0
Hunter986;6;5;12;0;1045;0
Jobbyhole;35;2427;7;295;1170;0
Moppetriu;13;55;7;0;1329;0
maraschino;55;5046;3;2004;1336;2
YoHoschi;54;1093;2;75;1251;0
badxeno;32;333;1;183;1166;0
-MoeR-;22;5661;1;14;1260;0
Phrobis;52;5125;0;1434;1313;0
Orimbaba;20;83;0;9;1223;0
ExoTopiC;20;261;0;8;1121;0
Decode1;17;78;0;18;1074;0`.split('\n');
        //console.log(wall_stat);
        var x={};
        setInterval(check,2000);
        function check(){
            wall_stat.forEach(function (stats){x[stats.split(';')[0]]='A:'+stats.split(';')[2]+' X:'+stats.split(';')[3]+' R:'+stats.split(';')[4]})
            //console.log(x)
            let b = document.querySelector("ul[class='members-list']").querySelectorAll("span[title*='[']").forEach(function (item){
                //console.log(item.innerText)
                if(!item.innerText.includes('X:') && x[item.innerText]) {
                    item.innerText=x[item.innerText];
                    if(parseInt(item.innerText.split(':')[2].replace(' R',''))<xanax_taken) item.style.color='green';
                }

                }
                );
            }


                                                                                                                    }

                                                                                                                    })();