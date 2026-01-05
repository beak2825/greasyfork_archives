// ==UserScript==
// @name Animemotes V2
// @namespace https://greasyfork.org/en/scripts/12849-animemotes
// @description  Emoticons for v4c and other synctube rooms by Bronard formatted by hunter2
// @version 1.7001
// @match *://instasync.com/r/v4c
// @match *://instasync.com/r/movie4chan
// @match *://instasync.com/r/*
// @grant none
// @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/12849/Animemotes%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/12849/Animemotes%20V2.meta.js
// ==/UserScript==


 //if (typeof(self.$animEmotes) === "undefined") self.$animEmotes = {};
var $animEmotes={

//Native Emotes

"dewbunker" : '<img src="http://i.imgur.com/BccrtS1.gif" width="32" height="46">',
"cool" : '<img src="https://i.imgur.com/oh9I5dq.png" width="53" height="49">',
'tails' : '<img src="https://i.imgur.com/WlTScSQ.png" width="40" height="40">',
"slav" : '<img src="https://i.imgur.com/DWp3VOQ.gif" width="45" height="46">',
 "stepfather" : '<img src="http://i.imgur.com/XrmtJZg.gif" width="43" height="69">',
"dolan" : '<img src="https://i.imgur.com/NF0yh.png" width="44" height="45">',
 "ameer" : '<img src="http://i.imgur.com/BYgVfc5.gif" width="50" height="58">',
 "jew" : '<img src="http://i.imgur.com/BYgVfc5.gif" width="50" height="58">',
'ready' : '<img src="https://i.imgur.com/oBAIjLy.png" width="43" height="59">',
"usa" : '<img src="https://i.imgur.com/tSXNh.gif" width="60" height="42">',
"#bump" : '<img src="https://i.imgur.com/d1odx.png" width="25" height="25">',
"birry" : '<img src="https://i.imgur.com/DduoO.gif" width="33" height="53">',
"dog" : '<img src="https://i.imgur.com/OcGfN.gif" width="53" height="53">',
"=/" : '<img src="https://i.imgur.com/d1odx.png" width="25" height="25">',
"gaben" : '<img src="https://i.imgur.com/T5SCh.gif" width="43" height="54">',
 "jimmies" : '<img src="http://i.imgur.com/SpPIGMm.png" width="35" height="38">',
'sanic' : '<img src="https://i.imgur.com/qpYdZhe.png" width="50" height="50">',
 "america" : '<img src="http://i.imgur.com/WsI3K8c.gif" width="36" height="56">',
"dilbert" : '<img src="https://i.imgur.com/WteuLYV.gif" width="56" height="55">',
"loading" : '<img src="https://i.imgur.com/LpBOu.gif" width="53" height="54">',
'van' : '<img src="https://i.imgur.com/2nevgyO.png" width="40" height="49">',
 "satan" : '<img src="http://i.imgur.com/Q8JfAQr.png" width="43" height="54">',
"bioware" : '<img src="https://i.imgur.com/1K4gw.gif" width="41" height="48">',
'shazbot' : '<img src="https://i.imgur.com/snoL3d4.png" width="36" height="47">',
'reddit' : '<img src="https://i.imgur.com/asSh8VE.png" width="80" height="16">',
'9gag' : '<img src="https://i.imgur.com/asSh8VE.png" width="80" height="16">',
"bestkorea" : '<img src="https://i.imgur.com/Kd2oh.gif" width="43" height="54">',
"assntitties" : '<img src="http://i.imgur.com/8K608pl.png" width="38" height="42">',
"hitoame" : '<img src="http://i.imgur.com/eSsjiYO.gif" width="55" height="50">',
"penis" : '<img src="http://i.imgur.com/cKbtIld.png" width="50" height="58">',
"duane" : '<img src="https://i.imgur.com/oCCMY.gif" width="70" height="47">',    
"plzgo" : '<img src="http://i.imgur.com/r8TbKqk.png" width="46" height="55">',
"no" : '<img src="https://i.imgur.com/nKa8o.png" width="41" height="30" onclick="script.fns.playSound(script.emoteSounds.no);">',
"keke" : '<img src="https://i.imgur.com/Pf0Xa.png" width="43" height="44">',
'uncle' : '<img src="https://i.imgur.com/voNzQU0.png" width="44" height="52">',
"reshiram" : '<img src="https://i.imgur.com/nrGTe.gif" width="44" height="50">',
"push" : '<img src="https://i.imgur.com/98R1p.gif" width="43" height="49">',
"ohshitimsorry" : '<img src="https://i.imgur.com/98R1p.gif" width="43" height="49">',
'autism' : '<img src="https://i.imgur.com/3FHPYB8.png" width="55" height="55">',
"juggalo" : '<img src="https://i.imgur.com/qZpT3.gif" width="43" height="49">',
"dewritos" : '<img src="http://i.imgur.com/Xug42Gd.png" width="39" height="57">',  
"stanza" : '<img src="https://i.imgur.com/1WRTO.png" width="41" height="58">',
"bestgames" : '<img src="https://i.imgur.com/ImyXj.png" width="48" height="54" onclick="script.fns.playSound(script.emoteSounds.chad);">',
"gamestop" : '<img src="https://i.imgur.com/kpJu4.gif" width="65" height="33">',    
'o': '<img src=" http://i.imgur.com/LbkolCC.gif" width="34" height="34";>',
"fothegrove" : '<img src="http://i.imgur.com/OxQABI6.png" width="35" height="38">',   
"aliens" : '<img src="http://i.imgur.com/K8iYcZk.png" width="50" height="57">',
"nogaems" : '<img src="https://i.imgur.com/envB9Jp.gif" width="47" height="57">',
"go" : '<img src="https://i.imgur.com/aqhrV.gif" width="50" height="38">',
'pomf' : '<img src="https://i.imgur.com/9u5HyPW.png" width="41" height="46">',
"kreayshawn" : '<img src="http://i.imgur.com/Ug0MUIW.png" width="41" height="51">',
"bodywash" : '<img src="https://i.imgur.com/eEGbx.png" width="41" height="51">',
'goblinu' : '<img src="https://i.imgur.com/QP3lELA.png" width="55" height="38">',
"alien" : '<img src="http://i.imgur.com/g1c23rO.gif" width="40" height="60">',
"bomb" : '<img src="https://i.imgur.com/1Ri01.png" width="30" height="44">',
"dreck" : '<img src="https://i.imgur.com/aj3bd.png" width="43" height="32">',
"skeleton" : '<img src="https://i.imgur.com/bDvOj.gif" width="50" height="38">',
"pumpkindance" : '<img src="https://i.imgur.com/sXZiA.gif" width="60" height="42">',
"2spooky" : '<img src="https://i.imgur.com/VN8Gn.gif" width="80" height="20">',
'gooby' : '<img src="https://i.imgur.com/zxLcdoz.png" width="54" height="54">',
"dosh" : '<img src="https://i.imgur.com/oL6u9.png" width="50" height="58">',
"8bitdose" : '<img src="https://i.imgur.com/n4sEL.gif" width="46" height="42">',
"costanza" : '<img src="https://i.imgur.com/7VYoq.png" width="41" height="58">',
"mysides" : '<img src="https://i.imgur.com/vETtK.png" width="39" height="58">',
"pikminu" : '<img src="https://i.imgur.com/VLgKCzM.png" width="43" height="55">',
"el" : '<img src="https://i.imgur.com/6H5Nu1u.gif" width="27" height="25">',
"ravi" : '<img src="https://i.imgur.com/Ogg9hCU.gif" width="43" height="31">',
"umirin" : '<img src="http://i.imgur.com/f3ADkXv.png" width="43" height="52">',
"bearfight" : '<img src="https://i.imgur.com/JVbAzkh.gif" width="35" height="58">',
"spurdance" : '<img src="https://i.imgur.com/9PZH4ZI.gif" width="35" height="61">',
"why" : '<img src="https://i.imgur.com/cV3YW2a.png" width="48" height="48">',
"chen" : '<img src="https://i.imgur.com/j55EMQt.png" width="50" height="46" onclick="script.fns.playSound(script.emoteSounds.chen);">',
'rip' : '<img src="https://i.imgur.com/Xa8Xb64.png" width="50" height="54">',
"dante" : '<img src="https://i.imgur.com/I0hWD8T.png" width="60" height="54">',
"rattle" : '<img src="https://i.imgur.com/Bp2hrVk.gif" width="55" height="39">',
"cat" : '<img src="https://i.imgur.com/YftOX.png" width="60" height="60">',
"spurdo" : '<img src="http://i.imgur.com/7tOBZa4.png" width="51" height="39">',
'rage' : '<img src="http://i.imgur.com/v9WwBhW.png" width="45" height="45">',
"thedick" : '<img src="http://i.imgur.com/pS5EXvc.png" width="50" height="50">',
"octagon" : '<img src="https://i.imgur.com/d3cA4Ul.png" width="50" height="47">',
"stop" : '<img src="https://i.imgur.com/d3cA4Ul.png" width="50" height="47">',
"brobill" : '<img src="https://i.imgur.com/nSZTUPc.gif" width="52" height="40">',
"miku" : '<img src="https://i.imgur.com/Dekl7gs.gif" width="45" height="41">',
"kitty" : '<img src="http://i.imgur.com/o1k8RRC.gif" width="50" height="50">',    
"o-o" : '<img src="https://i.imgur.com/rH7gBZ2.gif" width="45" height="45">',
"manboss" : '<img src="https://i.imgur.com/Pg9oejU.gif" width="55" height="38">',
"turkey" : '<img src="https://i.imgur.com/7kcpMQp.png" width="32" height="55">',
"fresh" : '<img src="https://i.imgur.com/mSDGeAp.gif" width="37" height="50">',
"morefags" : '<img src="https://i.imgur.com/fTFh4Ps.gif" width="35" height="50">',
"data" : '<img src="https://i.imgur.com/ItPkGqJ.gif" width="30" height="42">',
"obama" : '<img src="https://i.imgur.com/vyIEjLT.gif" width="60" height="46">',
"osama" : '<img src="https://i.imgur.com/zl65QTV.png" width="37" height="54">',
"ohlawd" : '<img src="https://i.imgur.com/K9s20pI.png" width="50" height="46">',
"slam" : '<img src="https://i.imgur.com/rh2bEhv.png" width="41" height="52">',
"happening" : '<img src="https://i.imgur.com/642PjCs.gif" width="78" height="53">',
'33' : '<img src="https://i.imgur.com/GAE6zXf.png" width="55" height="40">',
"mfw" : '<img src="https://i.imgur.com/jTX8drZ.png" width="45" height="51">',
"jaffa" : '<img src="https://i.imgur.com/lFZkgGf.png" width="40" length="47">',
"nice" : '<img src="https://i.imgur.com/UsUdb.png" width="45" length="45">',
"pekaface" : '<img src="https://i.imgur.com/0nDMlfQ.png" width="40" height="40">',
'haveaseat' : '<img src="https://i.imgur.com/I6D4foT.png" width="40" height="51">',
"bogs" : '<img src="https://i.imgur.com/0EDmrgA.png" width="40" height="59">',
"wut" : '<img src="https://i.imgur.com/HgIqmtS.png" width="46" height="50">',
"kfc" : '<img src="https://i.imgur.com/P5Dpoby.gif" width="60" height="47">',
"meeku" : '<img src="https://i.imgur.com/YQSESo6.png" width="45" height="60">',
"jii" : '<img src="https://i.imgur.com/zG59d7Q.png" width="52" height="40">',
"spherical" : '<img src="https://i.imgur.com/ejyx6KU.png" width="48" height="66">',
"?" : '<img src="http://i.imgur.com/BJ8PiPU.gif" width="70" height="47">',    
"nope" : '<img src=https://i.imgur.com/UMkAem5.gif" width="63" height="47">',
"whatastory" : '<img src="https://i.imgur.com/bysf1J5.png" width="45" height="53">',
"doot" : '<img src=https://i.imgur.com/WfUlQ5Q.gif" width="50" height="45" onclick="script.fns.playSound(script.emoteSounds.doot);">',
"twerk" : '<img src="https://i.imgur.com/zdSVyws.gif" width="53" height="67">',
'heero' : '<img src="http://i.imgur.com/D7JCR6j.png" width="60" height="55">',
'facepalm' : '<img src="https://i.imgur.com/fUU5XZu.png" width="50" height="46">',
'remove': '<img src="https://i.imgur.com/m1jhaWU.gif" width="35" height="53">',
'wow': '<img src="https://i.imgur.com/Gy1a6Xo.png" width="40" height="50">',
'praise': '<img src="https://i.imgur.com/hKNkmBa.png" width="48" height="49">',
'datass': '<img src="https://i.imgur.com/5XBU0Kv.gif" width="32" height="50">',
'burd2': '<img src="https://i.imgur.com/Hp3ypPj.gif" width="35" height="36">',
'burd3': '<img src="https://i.imgur.com/jSlcr.gif" width="35" height="36">',
"swerve" : '<img src="https://i.imgur.com/d0glWaV.png" width="50" height="44">',
'kek' : '<img src="http://i.imgur.com/xrw4paP.png" width="40" height="54">',
'nofun' : '<img src="https://i.imgur.com/m2fw5vq.png" width="50" height="53">','otter': '<img src="http://i.imgur.com/hIdOpSF.gif" width="35" height="55">',  
'gigaduane': '<img src="https://i.imgur.com/l3gSBDt.gif" width="70" height="47">',
'raw': '<img src="https://i.imgur.com/5naYhE8.png" width="48" height="65">',
'babyguitar': '<img src="https://i.imgur.com/qOCgzsL.gif" width="55" height="55">',
'science' : '<img src="https://i.imgur.com/v185ji3.gif" width="43" height="43">',
'yee' : '<img src="https://i.imgur.com/B4sh8aL.gif" width="50" height="50">',
    "miku2" : '<img src="http://i.imgur.com/GK0SoF4.gif" width="55" height="46">',
    "▲" : '<img src="http://i.imgur.com/BJ8PiPU.gif" width="70" height="47">',

        //anime

   //moeshit
'hibiki': '<img src="http://i.imgur.com/zELncnQ.gif" width="80" height="60";">',
'pomf2': '<img src="http://i.imgur.com/XHY7nBP.png" width="65" height="55";>',    
'pomf3': '<img src="http://i.imgur.com/Mjhxhef.png" width="55" height="55";>',
'illya': '<img src="https://38.media.tumblr.com/961a8b7582140768d50617450b928fa5/tumblr_ngh20fkbak1tl6vgyo1_250.gif" width="60" height="67.5";>',
'jam': '<img src="http://i.imgur.com/6R7qAKv.gif" width="50" height="64";>',
'haruhi': '<img src="http://i.imgur.com/IcHOs.gif" width="60" height="70";>',
'buttjuice': '<img src="http://i.imgur.com/S417M86.gif" width="54" height="55";>',
'ritsu': '<img src="http://i.imgur.com/QOKgx9B.gif" width="106" height="66";>',
'wop': '<img src="http://i.imgur.com/wAVQL4D.gif" width="60" height="47";>',
'wop2': '<img src="http://i.imgur.com/4qf8zh3.gif" width="45" height="70";>',
'brushie': '<img src="http://i.imgur.com/tGenRHO.gif" width="64" height="36";>',
'uguu': '<img src="http://i.imgur.com/yvW4UWK.gif" width="53" height="70";>',
'ree2': '<img src="http://i.imgur.com/h6M9I84.gif" width="75" height="50";>',
'penguin': '<img src="http://i.imgur.com/FBcmjnJ.gif" width="75" height="43";>',
'bikki': '<img src="http://i.imgur.com/Q5xWyWh.png" width="61" height="72";">',
'bikki2': '<img src="http://i.imgur.com/xxO2MrE.png" width="72" height="72";">',
'sakimori': '<img src="http://i.imgur.com/f6OMMal.png" width="62" height="59";">',
'chris': '<img src="http://i.imgur.com/HjgVrfe.png" width="54" height="60";">',
'wut2': '<img src="http://i.imgur.com/pfPLxk6.png" width="60" height="60";">',
'wut3': '<img src="https://i.imgur.com/kbj2AWs.gif" width="42" height="68";">',
'wut5': '<img src="https://i.imgur.com/PtBEFXY.gif" width="54" height="68";">',
'cry2': '<img src="http://i.imgur.com/ortVB2q.gif" width="60" height="49";">',
'shinji': '<img src=https://i.imgur.com/cMspHOh.png" width="51" height="63";">',
'tehrei': '<img src=http://i.imgur.com/Xj0jB1P.png" width="60" height="60";">', 
'usaka': '<img src=https://i.imgur.com/RIo0fL2.png" width="45" height="57";">', 
'gendo': '<img src=https://i.imgur.com/Lrjp8lGg.png" width="68" height="57";">', 

   //shounenshit
'ken': '<img src="http://i.imgur.com/r5T9ym7.gif" width="56" height="54";>',
'wry': '<img src="http://i.imgur.com/KlFkYTD.gif" width="60" height="60">',
'dio2': '<img src="http://i.imgur.com/RxxMWwY.png" width="68" height="56";>',
'nice2': '<img src="http://i.imgur.com/rfPPHhw.png" width="74" height="63";>',
'mfw2': '<img src="https://i.imgur.com/LbRWliY.gif" width="80" height="60">',
'joey': '<img src="http://s9.postimg.org/7jgdsbfe3/Joey_transparent.png" width="60" height="60";>',
'guts': '<img src="http://i.imgur.com/Vwq5J2n.png" width="65" height="60";>',
'ok': '<img src="http://i.imgur.com/NtQfokj.gif" width="67" height="55">',
'ok2': '<img src="http://i.imgur.com/ukL3Rh2.png" width="49" height="60">',
'vegeta': '<img src="http://i.imgur.com/iTqAwhm.gif" width="57" height="70";>',
'quattro': '<img src="http://i.imgur.com/N0r7bdL.png" width="50" height="55";">',
'brightslap': '<img src="http://i.imgur.com/erMkFra.png" width="67" height="55";">',


   //2hu
'reimu': '<img src="http://i.imgur.com/RRPNiqa.gif" width="50" height="60";>',
'reimu2': '<img src="http://i.imgur.com/U5NVxsR.gif" width="55" height="55";>',
'marissa': '<img src="http://i.imgur.com/kauEfnn.gif" width="60" height="60";>',
'getout': '<img src="http://i.imgur.com/i11Ca75.png" width="60" height="60";>',
'chen3': '<img src="http://i.imgur.com/MSoQrxX.gif" width="54" height="55" onclick="script.fns.playSound(script.emoteSounds.chen);">',
'chen4': '<img src="http://i.imgur.com/vRgXgKd.gif" width="60" height="60" onclick="script.fns.playSound(script.emoteSounds.chen);">',
'awoo': '<img src="http://i.imgur.com/zZzW3S2.gif" width="70,height:68";>',
'awoo2': '<img src="http://i.imgur.com/78w0OiM.gif" width="60" height="69";>',
'goblinu2': '<img src="http://i.imgur.com/ysnlbp2.gif" width="50" height="50";>',
'cirno': '<img src="http://i.imgur.com/NpUPZSn.gif" width="60" height="60";>',
'shrug3': '<img src="https://i.imgur.com/Po21wNG.png" width="60" height="57";>',

   //smug animes
'smuganime': '<img src="http://i.imgur.com/SCpPihV.gif" width="60" height="60";">',
'smuganime2': '<img src="http://i.imgur.com/mKfn1C2.gif" width="50" height="55";">',
'smuganime3': '<img src="http://i.imgur.com/GJSTjQj.png" width="52" height="65";">',
'smuganime4': '<img src="http://i.imgur.com/fG7E3Tq.png" width="80" height="55";">',
'nonon': '<img src="http://i.imgur.com/K5H6tns.png" width="54" height="55";">',


   //anime static
'doit3': '<img src="http://i.imgur.com/eIF1R2L.png" width="80" height="60";">',
'papi': '<img src="http://i.imgur.com/ZBRuxX6.png" width="63" height="57";">',
'assman': '<img src="http://i.imgur.com/3haIWH6.png" width="52" height="54";">',
'godzilla': '<img src="http://i.imgur.com/HbcCcHz.png" width="60" height="59";">',
'rustle': '<img src="http://i.imgur.com/W7cAfBL.png" width="55" height="56";">',
'suicide': '<img src="http://i.imgur.com/omaV2Sh.png" width="60" height="60";>',
'zawa': '<img src="https://i.imgur.com/dq51wdU.png" width="70" height="45";>',

   //anime gifs
'anime': '<img src="http://i.imgur.com/2OmBZZU.gif" width="60" height="60";>',
'rin': '<img src="http://i.imgur.com/PB3hHru.gif" width="54" height="60";>',
'teto': '<img src="http://i.imgur.com/CbBrDiz.gif" width="55" height="41";>',
'o2': '<img src="http://i.imgur.com/mJPnC0s.gif" width="84" height="63";>',
'spin1': '<img src="http://i.imgur.com/pd3vXcV.gif" width="72" height="64";>',
'sogoodnow': '<img src="http://i.imgur.com/uO7zf1l.gif" width="80" height="60">',
'mememe': '<img src="http://i.imgur.com/nzz8tK1.gif" width="60" height="70";>',
'mememe2': '<img src="https://i.imgur.com/kFTh1Eh.gif" width="48" height="70";>',
'moe': '<img src="http://i.imgur.com/A2sUtXo.gif" width="57" height="57";>',
'moe2': '<img src="https://i.imgur.com/IBsFH0E.gif" width="36" height="64";>',
'ecchi': '<img src=" https://i.imgur.com/i2SWp.gif" width="55" height="55">',
'laughinganime': '<img src="http://i.imgur.com/HOdSCiN.gif" width="54" height="55";>',
'laughinganime2': '<img src="http://i.imgur.com/jvJA4YE.gif" width="58" height="68";">',
'ae86': '<img src="http://i.imgur.com/WFHNOxP.gif" width="60" height="60";>',
'dubass': '<img src="http://i.imgur.com/Q029MEI.gif" width="62" height="50";>',
'hestia': '<img src="http://i.imgur.com/66Mb5ih.gif" width="70" height="74";>',
'miku3': '<img src="http://i.imgur.com/l1jmNIC.gif" width="60" height="47";>',
'hi': '<img src="http://i.imgur.com/0d9IpMK.gif" width="60" height="86.4";>',
'bye': '<img src="http://i.imgur.com/D2kvAo7.gif" width="88" height="65";>',
 'shy': '<img src="http://i.imgur.com/4JzoL6k.gif" width="53" height="60">',
'shy2': '<img src="https://i.imgur.com/4dS8PDT.gif" width="48" height="56">',
'drink': '<img src="https://cdn.discordapp.com/attachments/167060862341873664/167060930566422529/gif1_cropped.gif" width="50" height="50">',
'drink2': '<img src="http://i.imgur.com/HMzznPr.gif" width="90" height="60">',
'fam': 'senpai',
'tbh': 'desu',
'smh': 'baka',


//Vidya
        

   // Nintendo
'mario2': '<img src="http://i.imgur.com/A4eNPZW.gif" width="53" height="55";>',
'luigi': '<img src="http://i.imgur.com/kOdYV6Y.gif" width="46" height="60";>',
'm&l': '<img src="http://i.imgur.com/fHJThR6.gif" width="55" height="55";>',
'yoshi': '<img src="http://i.imgur.com/B6bBva0.gif" width="50" height="51";>',
'kabi': '<img src="http://i.imgur.com/F5qdDtE.gif" width="125" height="45";>',
'dk': '<img src="http://i.imgur.com/yLLNCsh.gif" width="80" height="50";>',
'expanddong': '<img src="http://i.imgur.com/RoQiAtP.png" width="43" height="52";>',
'diddy': '<img src="http://i.imgur.com/ZEE0jZF.gif" width="53" height="53";>',
'he': '<img src="http://i.imgur.com/ZUDYg30.png" width="33" height="60";>',
'fox': '<img src="http://i.imgur.com/u2JoaaP.gif" width="40" height="60";>',
'ness': '<img src="http://i.imgur.com/nALMPb7.png" width="50" height="55";>',
'metroid': '<img src="http://i.imgur.com/rRKU1.gif" width="39" height="45";>',
'ludicolo': '<img src="http://i.imgur.com/Ibjqkzi.gif" width="58" height="49";>',
'spinda': '<img src="https://i.imgur.com/QDxsmBT.gif" width="50" height="49";>',
'togepi': '<img src="http://i.imgur.com/XiBOfOD.gif" width="55" height="55";>',
'pika': '<img src="http://25.media.tumblr.com/tumblr_m4wqgofzSa1rs1aa4o8_250.gif" width="50" height="50";>',
'blastoise': '<img src="http://i.imgur.com/TPLKElK.gif" width="64" height="64";>',
'dj': '<img src="http://i.imgur.com/9gVht7Y.gif" width="60" height="60";>',
'hitmontop': '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/hitmontop.gif" width="76" height="61";">',
'fug': '<img src=https://i.imgur.com/lluUHFU.jpg" width="48" height="65";">', 
'wario': '<img src="http://i.imgur.com/TpFDOXv.gif" width="70" height="70";">',
'wario2': '<img src="https://i.imgur.com/3QDXIAP.gif" width="48" height="62";">',
'kek2': '<img src="http://i.imgur.com/87P6Xy6.gif" width="58" height="50";>',
'topkek': '<img src="http://i.imgur.com/LNkPkIn.png" width="52" height="52";>',
'n64': '<img src="http://i.imgur.com/AJv1S35.gif" width="60" height="60";>',  
'eba': '<img src="http://i.imgur.com/3KgYH6q.gif" width="70" height="60";>',  

   //Sega
'sanic2': '<img src="http://i.imgur.com/GI19OKs.png" width="41" height="45";>',
'snoic': '<img src="http://i.imgur.com/GI19OKs.png" width="41" height="45";>',
'sonic2': '<img src="http://i.imgur.com/EOW60AQ.gif" width="60" height="60";>',
'sonic3': '<img src="http://i.imgur.com/mwR0qnK.gif" width="60" height="60";>',
'chuckle': '<img src="http://i.imgur.com/8B0GAY0.gif" width="42" height="57";">',     
'pssh': '<img src="http://i.imgur.com/aSZqQt0.png" width="50" height="50";>',


   //Capcom
'jotaro': '<img src="http://i.imgur.com/67vdvMo.gif" width="83" height="65";>',
'jojo': '<img src="https://i.imgur.com/0yGb1lg.gif" width="53" height="65";>',
'joseph': '<img src="https://i.imgur.com/9GC5OgS.gif" width="53" height="65";>',
'dio': '<img src="http://i.imgur.com/x3Xw7V9.gif" width="120" height="70">',
'kakyoin': '<img src="http://i.imgur.com/AiqM7ep.gif" width="55" height="70";>',
'rero': '<img src="https://i.imgur.com/pp6OTp7.gif" width="35" height="65";>',
'megaman': '<img src="http://i.imgur.com/L5JCadl.gif" width="60" height="48";>',
'servbot': '<img src="http://i.imgur.com/Imolf.gif" width="50" height="50";">',
'monkey': '<img src="http://i.imgur.com/pKXZaQM.gif" width="67" height="50";>',
'pew': '<img src="http://i.imgur.com/mWAan6J.gif" width="120" height="54";">',
'sakura': '<img src="http://i.imgur.com/xv1O1si.gif" width="75" height="75";>',
'dhalsim': '<img src="http://i.imgur.com/DdcpChu.gif" width="53" height="55";>',
'yes': '<img src="http://i.imgur.com/TvtnuqI.gif" width="70" height="45";>',

   //Square Enix
'crono': '<img src="http://i.imgur.com/7XFNWrl.gif" width="36" height="72";">',
'frog': '<img src="http://i.imgur.com/JCVY8WY.gif"  width="36" height="72";">',
'robo': '<img src="http://i.imgur.com/FYbjRHx.gif" width="36" height="70";">',
'blackmage': '<img src="http://i.imgur.com/n7174B2.gif" width="50" height="50":>',
'pew2': '<img src="http://i.imgur.com/fb5r3Bw.gif" width="66" height="52";">',
'tidus': '<img src="http://i.imgur.com/1FENfoz.png" width="48" height="56";">',
'teedus': '<img src="http://i.imgur.com/2nSjY52.png" width="80" height="54";">',

   //Namco
'pac': '<img src="http://i.imgur.com/E7GuNSW.gif" width="62" height="50">',

   //SNK
'strut': '<img src="http://i.imgur.com/199ZHvl.gif" width="74" height="75";>',

   //Konami
'200mad': '<img src="https://i.imgur.com/Ks2Nyyx.jpg" width="49" height="70";">', 
'200glad': '<img src="http://i.imgur.com/kossA40.jpg" width="49" height="70";">', 
'bigboss': '<img src="http://i.imgur.com/uJrM3u0.png" width="70" height="40";">',
'kojima': '<img src="http://i.imgur.com/9M40dsy.png" width="60" height="60";>',
'!': '<img src="http://i.imgur.com/cvzg1zF.png" width="49" height="60";>',
'viper': '<img src="https://i.imgur.com/dTCwW3o.gif" width="90" height="30";">', 
    
   //vidya General
'mj': '<img src="http://i.imgur.com/WSYPYKm.gif" width="66" height="69";>',
'crash': '<img src="http://i.imgur.com/n87b7Ha.gif" width="60" height="60";>',
'doomguy': '<img src="http://i.imgur.com/9lfphNU.png" width="55" height="55";>',
'doomed': '<img src="http://i.imgur.com/avjCNLG.gif" width="45" height="45";>',
'cyrax': '<img src="http://i.imgur.com/8WGVGYh.gif" width="35" height="59";>',
'raiden': '<img src="http://i.imgur.com/zs8NHsQ.gif" width="70" height="80";>',
'kappa': '<img src="http://i.imgur.com/NiMJaW6.png" width="30" height="40";>',
'biblethump': '<img src="https://i.imgur.com/gzdyqCj.png" width="50" height="50";">',   
'gootecks': '<img src="https://i.imgur.com/UCK8FQE.png" width="55" height="55";">',   
'mettaton': '<img src="http://i.imgur.com/H52PrAI.gif"  width="59" height="61";">',
'sans': '<img src="http://i.imgur.com/h7ttyH4.gif" width="73" height="50";>',
'spiderdance': '<img src="http://orig07.deviantart.net/c3f0/f/2015/282/0/3/spiderdance_by_weegygreen2-d9ciry1.gif" width="55" height="48";>',
'xenomorph': '<img src="http://i.imgur.com/UQozZkR.gif" width="60" height="60";>',
'xenomorph2': '<img src="http://i.imgur.com/hC1fUu7.gif" width="60" height="60";>',
'rare': '<img src="http://i.imgur.com/FPf04tV.gif" width="60" height="60";>',
'ps': '<img src="http://i.imgur.com/FH5Y7Ni.gif" width="75" height="35";>',
'neofag': '<img src="http://i.imgur.com/bowvEWh.gif" width="76" height="51">',
'conker': '<img src="http://i.imgur.com/Hh9huYW.gif" width="70" height="66";>',
'shantae': '<img src="http://i.imgur.com/8tfoctn.gif" width="60" height=60";>',
'bridget': '<img src="http://i.imgur.com/mkoBhqm.gif" width="75" height="75";>',
'slut': '<img src="http://i.imgur.com/4wunBBM.png" width="60" height="52";>',
'todd': '<img src="http://i.imgur.com/vFRapSo.png" width="44" height="52";>',


    
//memes

   //bones
'skelestrut': '<img src="http://i.imgur.com/CMvONhr.gif" width="45" height="60";>',
'wakemeup': '<img src="http://i.imgur.com/rpFA4eT.png" width="38" height="54";>',
'cantwakeup': '<img src="http://i.imgur.com/gAqA8PP.png" width="60" height="64";">',
'calcium': '<img src="http://i.imgur.com/QZ4qCEE.gif" width="68" height="60";>',
'spooped': '<img src="http://i.imgur.com/N6dctIS.gif" width="45" height="50";>',
'skeletal': '<img src="http://i.imgur.com/EOJVmvF.gif" width="53" height="55";>',
'skeletal2': '<img src="http://i.imgur.com/LGpFvyw.gif" width="45" height"65";>',
'skelestrut2': '<img src="http://i.imgur.com/gHkrhwl.gif" width="30" height"52";>',
'skelejii': '<img src="http://i.imgur.com/ONTL0jO.gif" width="58" height="61";>',


   //seals
'333': '<img src="http://i.imgur.com/qzKaSUr.png" width="36" height="37";>',

   //Guns
'rekt': '<img src="http://i.imgur.com/hUvNXZS.gif" width="55" height="40";>',
'rekt2': '<img src="http://i.imgur.com/wMLPDk8.gif" width="60" height="60";>',
'rekt3': '<img src="http://i.imgur.com/YTX76GS.gif" width="100" height="55";>',
    
   //v4c
'illusory': '<img src="http://i.imgur.com/nfdzyCE.png" width="58" height="50";>',
'illurage': '<img src="http://i.imgur.com/YkWxFJh.gif" width= "70" height="50";>',
'ameer2': '<img src="http://i.imgur.com/NDyFwIB.png" width="60" height="60";>',
'demod': '<img src="http://i.imgur.com/vFkxij7.png" width="70" height="45";>',

   //co
'40keks': '<img src="http://i.imgur.com/WcPOe64.png" width="60" height="50">',
'dorks': '<img src="http://i.imgur.com/y7zOXCj.png" width="67" height="45">',
"devil" : '<img src="https://media.giphy.com/media/xGE1Nr8GE5Xag/giphy.gif" width="54" height="54">',
    
   //sp
'rasm': '<img src="http://i.imgur.com/rcyjkbW.png" width="55" height="50";>',
'bloos': '<img src="http://i.imgur.com/yYXebfx.png" width="55" height="50";>',
'why2': '<img src="http://i.imgur.com/iZks7ar.jpg" width="60" height="30";>',
'worry': '<img src="http://i.imgur.com/WTeyp1h.png" width="60" height="57";>',
'worry2': '<img src="http://i.imgur.com/fhmT48u.png" width="60" height="30";>',
'wut4': '<img src="http://i.imgur.com/zNDcxSk.gif" width="70" height="65";>',
    
   //tv
'4u': '<img src="http://i.imgur.com/cHKfWEJ.gif" width="70" height="53";>',
'cia': '<img src="http://i.imgur.com/CEuHLUK.gif" width="40" height="40";>',
'trashman': '<img src="http://i.imgur.com/27XBJyW.png" width="60" height="64";">',
'just': '<img src="http://i.imgur.com/OOXqit5.png" width="42" height="60";">',    
'doit': '<img src="http://i.imgur.com/2qCZE52.gif" width="60" height="60";>',
'solo': '<img src="http://i.imgur.com/2Jf8uho.gif" width="35" height="60";>',    
'nathan': '<img src=" http://i.imgur.com/ugUdaR3.png" width="41" height="59">',
'checkem': '<img src="http://i.imgur.com/5vrL5Ek.png" width="50" height="50">',
'bateman': '<img src="http://49.media.tumblr.com/30dd96ad20798e56d0f27cc6fe901922/tumblr_mvm4klop2Z1r9abxlo1_250.gif" width="40" height="62">',
'thanks': '<img src="http://i.imgur.com/ja1MyLv.png" width="62" height="58">',
'2smokes': '<img src="https://i.imgur.com/kYUwTdW.png" width="56" height="60">',
    
  //pol/int
'putin': '<img src="http://i.imgur.com/yDrpKH3.png" width="70" height="60";">',
'shieeet': '<img src="http://i.imgur.com/lArXmLg.png" width="53" height="53">',
'trump': '<img src="http://i.imgur.com/3XtKojW.png" width="57" height="60">',
'coolbama': '<img src="http://i.imgur.com/AxWLGC5.png" width="51" height="60";>',
'currentyear': '<img src="https://i.imgur.com/c1X7QLC.png" width="56" height="48";>',
    
   //WOOO
    
'swerve2': '<img src="https://i.imgur.com/3ZLaQXr.gif" width="67" height="50";>',    
'hulkamania': '<img src="https://media0.giphy.com/media/uKwa2KiBA0rTy/200.gif" width="65" height="50";>',

   //gachi 
'aniki': '<img src="http://i.imgur.com/tYTy13s.jpg" width="63" height="48" onclick="this.src = \'http://i.imgur.com/VRE07P7.png\'">',
'pull': '<img src="http://i.imgur.com/b3ex5cx.png" width="42" height="49";>',
'pull2': '<img src="http://i.imgur.com/jhuvqTo.gif" width="60" height="56";>',
'push2': '<img src="http://i.imgur.com/WMwbr7n.gif" width="60" height="56";>',
'yaranaika': '<img src="http://i.imgur.com/QZrm2LE.png" width="60" height="60";">',
'yaranaika2': '<img src="https://i.imgur.com/yjbPpbB.png" width="60" height="60";">',
'hardgay': '<img src="http://i.imgur.com/0pPWLLc.gif" width="35" height="70";">',

   //lewds
'lewd': '<img src="http://i.imgur.com/byEQnHn.png" width="62" height="70";>',
'lewd2': '<img src="http://i.imgur.com/d6lNkQR.gif" width="68" height="55";>',
'lewd3': '<img src=" http://i.imgur.com/ZhDI0dZ.png" width="45" height="50">',


   //several forms of mockery against a person
'mysides2': '<img src="http://i.imgur.com/DtINozi.gif" width="50" height="60";>',
'myminisides': '<img src="http://i.imgur.com/vETtK.png" width="17" height="24";>',
'mytinysides': '<img src="http://i.imgur.com/vETtK.png" width="17" height="24";>',
'myfuckingsides': '<img src="http://i.imgur.com/vETtK.png" width="58.5" height="85";>',
'john': '<img src="http://i.imgur.com/LXaCgmO.png" width="36" height="54";>',
'notbad': '<img src="http://i.imgur.com/09TQ5oP.png" width="33" height="54";>',
'stepup': '<img src="http://i.imgur.com/5WGZS.jpg" width="50" height="63";">',
'wow2': '<img src="http://i.imgur.com/Gx5wmqn.gif" width="67" height="50";>',

   //other static
'gookfood': '<img src="http://i.imgur.com/nfDwcil.png" width="40" height="56";>',
'mystery': '<img src="http://i.imgur.com/Zs6sciz.png" width="64" height="60";">',
'wew': '<img src="http://i.imgur.com/SvDjLlY.png" width="55" height="55";>',
'sweat': '<img src="http://i.imgur.com/DxlIunk.png" width="54" height="54";>',
'weeaboo': '<img src="http://i.imgur.com/ug1KSIr.png" width="55" height="55";>',
'disgusting': '<img src="http://i.imgur.com/4zsobUd.png" width="36" height="61";>',
'aesthetic': '<img src="http://i.imgur.com/3Vfz8mx.png" width="42" height="60">',
'triggered': '<img src="http://mercilesstruth.com/wp-content/uploads/2015/02/triggered.jpg" width="50" height="58";">',
'sluts': '<img src="http://i.imgur.com/pb6WX9n.png" width="55" height="68";>',
'whores': '<img src="http://i.imgur.com/EWhvuNJ.png" width="57" height="55";>',
'jimmies2': '<img src="http://i.imgur.com/cSB16FG.png" width="52" height="60";>',
'oyvey': '<img src="http://i.imgur.com/pv7twVO.png" width="50" height="58";>',
'comfy': '<img src="http://i.imgur.com/6Zt1jps.png" width="60" height="48";>',
'heresy': '<img src="http://i.imgur.com/JcFfHdv.png" width="60" height="60";>',
'percy': '<img src="https://i.imgur.com/o2HTlhb.png" width="57" height="60">',
'lyin': '<img src=https://i.imgur.com/A0lgij2.gif" width="45" height="60":>',
'tyrone' : '<img src="http://i.imgur.com/aXPWln0.png" width="48" height="60">',
'ironman' : '<img src="https://i.imgur.com/ZyPjygd.png" width="60" height="60">',
'neverfuckingever' : '<img src="http://i.imgur.com/X8wgq2k.png" width="72" height="75">',
        
   //other gifs
'freedum': '<img src="http://i.imgur.com/uDUO8Nw.gif" width="57" height="45";>',
'ravi2': '<img src="http://i.imgur.com/zy5MRSE.gif" width="85" height="58";>',
'doit2': '<img src="http://i.imgur.com/WlYMFRt.gif" width="60" height="60";">',
'suicide2': '<img src="http://i.imgur.com/WlYMFRt.gif" width="60" height="60";>',
 'killme': '<img src="http://i.imgur.com/iVNBNIT.gif" width="80" height="48";>',
'cory': '<img src="http://i.imgur.com/de9cG0t.gif" width="54" height="40";>',
'autism2': '<img src="http://i.imgur.com/yzJfjvg.gif" width="111" height="32";>',
'eey': '<img src="http://i.imgur.com/064jiZo.gif" width="62" height="43";>',
'neat': '<img src="http://i.imgur.com/34vCnqr.gif" width="67" height="45";>',
'bot': '<img src="http://i.imgur.com/JbTgsAa.gif" width="28" height="60";>',
'snab': '<img src="http://i.imgur.com/5pDD0HW.gif" width="55" height="55";>',
'arthur': '<img src="http://i.imgur.com/RDP8xDj.gif" width="49" height="70";>',
'slowgo': '<img src="http://i.imgur.com/IZOTrw6.gif" width="67" height="50";>',
'spam': '<img src="http://i.imgur.com/iFvF8q0.gif" width="60" height="55";>', 
'cry': '<img src="http://i.imgur.com/MMdhwkH.gif" width="40" height="60";>',
'shark': '<img src="http://i.imgur.com/mPYJxxt.gif" width="75" height="42";>',
'gigasnoop': '<img src="https://i.areyoucereal.com/HGbLpu.gif" width="33" height="50";>',
'saltyduane': '<img src="http://smashboards.com/attachments/salty-duane-gif.34388/" width="60" height="74";>',
'lean': '<img src="http://i.imgur.com/cIOR35M.gif" width="65" height="55";>',
'clippy': '<img src="http://i.imgur.com/A57Z837.gif" width="50" height="60";>',
'bustin': '<img src="http://i.imgur.com/x5EwROk.gif" width="67" height="50";>',
'duckgif': '<img src="http://i.imgur.com/7VcUcYJ.gif" width="54" height="55";>',
'thom': '<img src="http://i.imgur.com/Ivbeddf.gif" width="38" height="62";>',
'brody': '<img src="http://i.imgur.com/BqL1U8G.gif" width="50" height="50";>',
'kaboom': '<img src="http://i.imgur.com/AelHJCz.gif" width="50" height="70";>',
'taylor': '<img src="http://i.imgur.com/HAzJAwW.gif" width="50" height="50";>',
'alarm': '<img src="http://i.imgur.com/SA83zJ2.gif" width="50" height="50";>',  
"lolicatgirls1080p": '<img src="https://i.imgur.com/lwZ8K.gif" width="80" height="62">',
"lolicat": '<img src="https://i.imgur.com/lwZ8K.gif" width="80" height="62">',
"freshest": '<img src="http://i.imgur.com/KY2BoER.gif" width="53" height="74">',
"dog2": '<img src="https://i.imgur.com/pGgAjIz.gif" width="70" height="55">',
"stepup2": '<img src="https://i.imgur.com/IYIEEdZ.gif" width="66" height="50">',
"bean": '<img src="https://i.imgur.com/Qas4DTi.gif" width="64" height="62">',
"donnie" : '<img src="http://i.imgur.com/1BFgSJJ.gif" width="54" height="42">',
"damien" : '<img src="http://i.imgur.com/pJvCqUv.gif" width="56" height="42">',
"grounded" : '<img src="http://i.imgur.com/DwmDIUv.gif" width="45" height="54">',
"traitor" : '<img src="http://i1.kym-cdn.com/photos/images/newsfeed/001/059/271/8a8.gif" width="56" height="56">',    
"gigago" : '<img src="http://www.v4c.fathax.com/v4c/src/1462034272901.gif" width="50" height="38">',
"gigadoot" : '<img src=http://i.imgur.com/ky3Mltc.gif" width="50" height="45" onclick="script.fns.playSound(script.emoteSounds.doot);">',
    
  //dem froggy feels
'feel': '<img src="http://i.imgur.com/1MJdYMA.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/miFcyXz.png\'">',
'feelsbadman': '<img src="http://i.imgur.com/1MJdYMA.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/miFcyXz.png\'">',
'feelsgud': '<img src="http://i.imgur.com/miFcyXz.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/1MJdYMA.png\'">',
'feelsgoodman': '<img src="http://i.imgur.com/miFcyXz.png" width="50" height="50" onclick="this.src = \'http://i.imgur.com/1MJdYMA.png\'">',
'feelsmad': '<img src="http://i.imgur.com/zR8xP2G.png" width="50" height="50">',
'feelsmadman': '<img src="http://i.imgur.com/zR8xP2G.png" width="50" height="50">',
'feelssmug': '<img src="http://i.imgur.com/HrXSS44.png" width="50" height="50">',
'feelsscared': '<img src="http://i.imgur.com/uTUjZpq.png" width="50" height="50";>',
'feelseh': '<img src="http://i.imgur.com/FGYvkZq.png" width="50" height="50">',
'feelsehman': '<img src="http://i.imgur.com/FGYvkZq.png" width="50" height="50">',
'feelsgooddance': '<img src="http://i.imgur.com/20tobXF.gif" width="50" height="36";>',
'feelsguddance': '<img src="http://i.imgur.com/20tobXF.gif" width="50" height="36";>',
'feelssuicidal': '<img src="http://i.imgur.com/JIqXkac.png" width="50" height="50";>',
'grinched': '<img src="http://i.imgur.com/a5UGU8e.png" width="50" height="50";>',
'ree': '<img src="http://i.imgur.com/U1Trjzq.gif" width="50" height="50">',
'feelsjihad': '<img src="http://i.imgur.com/T6LHB0b.png" width="50" height="75";>',
'feek': '<img src="http://i.imgur.com/BeaCBjD.png" width="37" height="39";>',
'feeksbadman': '<img src="http://i.imgur.com/BeaCBjD.png" width="37" height="40";>',
'feels': '<img src="http://i.imgur.com/QZodT3T.png" width="43" height="50";">',
'madfeels': '<img src="http://i.imgur.com/8bcMaVf.png" width="43" height="50";">',
'nintendrone': '<img src="http://i.imgur.com/YYJeASE.png" width="43" height="50";">',
'sonygger': '<img src="http://i.imgur.com/mxJk9EG.png" width="43" height="50";">',
'xboner': '<img src="http://i.imgur.com/a6qunyQ.png" width="43" height="50";">',
'mustard': '<img src="http://i.imgur.com/VTVEX8E.png" width="43" height="50";">',

   //aliens
'alien2': '<img src="http://i.imgur.com/jBji5uc.gif" width="53" height="73";>',
'ayylien': '<img src="http://i.imgur.com/RgnpAPE.gif" width="45" height="59";>',
'ayylmao': '<img src="http://i.imgur.com/7AyGv1a.gif" width="60" height="74";>',
'gigalien': '<img src="http://i.imgur.com/kEBhRIy.gif" width="40" height="60";>',
'bongalien': '<img src="http://i.imgur.com/0JF6Nul.gif" width="51" height="51";>',

   //stock
'shrug': '<img src="http://i.imgur.com/AjSWflZ.png" width="86" height="62":>',
'shrug2': '<img src=https://i.imgur.com/LeocUKI.png" width="70" height="56":>',
'nothanks': '<img src="http://i.imgur.com/THkiZzu.png" width="65" height="65";>',

    
};
function applyEmotes(count) {
if (typeof(script) == "undefined") {
    if (count >= 20) {//prevents this from running too long in case script is never ever defined
        console.error('Animemotes ran for too long. Aborting.');
        return;
    }
    count++;
    setTimeout(function() {applyEmotes(count);}, 250);
}
else
    $.extend(script.$externalEmotes, $animEmotes);
}
applyEmotes(0);