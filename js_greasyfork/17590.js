 // ==UserScript==
    // @name         Animemotes
    // @namespace    https://greasyfork.org/en/scripts/12849-animemotes
    // @version      1.1074
    // @description  Emoticons for v4c and other synctube rooms by Bronard formatted by hunter2
    // @match        *://instasync.com/r/v4c
    // @match        *://instasync.com/r/movie4chan
    // @match        *://instasync.com/r/*
    // @grant        animEmotes
    // @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/17590/Animemotes.user.js
// @updateURL https://update.greasyfork.org/scripts/17590/Animemotes.meta.js
    // ==/UserScript==
     
self.$externalEmotes = {};
 //if (typeof(self.$animEmotes) === "undefined") self.$animEmotes = {};
script.$animEmotes={
    
"dewbunker" : '<img src="http://i.imgur.com/BccrtS1.gif" width="32" height="46">',
"stepfather" : '<img src="http://i.imgur.com/XrmtJZg.gif" width="43" height="69">',
"ameer" : '<img src="http://i.imgur.com/BYgVfc5.gif" width="50" height="58">',
"jew" : '<img src="http://i.imgur.com/BYgVfc5.gif" width="50" height="58">',
"jimmies" : '<img src="http://i.imgur.com/SpPIGMm.png" width="35" height="38">',
"america" : '<img src="http://i.imgur.com/WsI3K8c.gif" width="36" height="56">',
"satan" : '<img src="http://i.imgur.com/Q8JfAQr.png" width="43" height="54">',
"assntitties" : '<img src="http://i.imgur.com/8K608pl.png" width="38" height="42">',
"hitoame" : '<img src="http://i.imgur.com/eSsjiYO.gif" width="55" height="50">',
"penis" : '<img src="http://i.imgur.com/cKbtIld.png" width="50" height="58">',
"plzgo" : '<img src="http://i.imgur.com/r8TbKqk.png" width="46" height="55">',
"dewritos" : '<img src="http://i.imgur.com/Xug42Gd.png" width="39" height="57">',    
'o': '<img src=" http://i.imgur.com/LbkolCC.gif" width="34" height="34";>',
"aliens" : '<img src="http://i.imgur.com/K8iYcZk.png" width="50" height="57">',
"nogaems" : '<img src="https://i.imgur.com/envB9Jp.gif" width="47" height="57">',
"kreayshawn" : '<img src="http://i.imgur.com/Ug0MUIW.png" width="41" height="51">',
"alien" : '<img src="http://i.imgur.com/g1c23rO.gif" width="40" height="60">',
"spurdo" : '<img src="http://i.imgur.com/7tOBZa4.png" width="51" height="39">',
'rage' : '<img src="http://i.imgur.com/v9WwBhW.png" width="45" height="45">',
"thedick" : '<img src="http://i.imgur.com/pS5EXvc.png" width="50" height="50">',
"miku2" : '<img src="http://i.imgur.com/GK0SoF4.gif" width="55" height="46">',    
"kitty" : '<img src="http://i.imgur.com/o1k8RRC.gif" width="50" height="50">',    
"▲" : '<img src="http://i.imgur.com/BJ8PiPU.gif" width="70" height="47">',
'otter': '<img src="http://i.imgur.com/hIdOpSF.gif" width="35" height="55">',  
"umirin" : '<img src="http://i.imgur.com/f3ADkXv.png" width="43" height="52">',
"fothegrove" : '<img src="http://i.imgur.com/OxQABI6.png" width="35" height="38">',
        //anime

   //moeshit
'rikka': '<img src="http://i.imgur.com/HrBC4jG.gif" width="54" height="53";">',
'hibiki': '<img src="http://i.imgur.com/zELncnQ.gif" width="80" height="60";">',
'pomf2': '<img src="http://i.imgur.com/XHY7nBP.png" width="65" height="55";>',    
'pomf3': '<img src="http://i.imgur.com/Mjhxhef.png" width="55" height="55";>',
'illya': '<img src="https://38.media.tumblr.com/961a8b7582140768d50617450b928fa5/tumblr_ngh20fkbak1tl6vgyo1_250.gif" width="60" height="67.5";>',
'jam': '<img src="http://i.imgur.com/6R7qAKv.gif" width="50" height="64";>',
'harahu': '<img src="http://i.imgur.com/IcHOs.gif" width="60" height="70";>',
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
'wut3': '<img src="http://i.imgur.com/GRTwulq.gif" width="42" height="68";">',
'cry2': '<img src="http://i.imgur.com/ortVB2q.gif" width="60" height="49";">',
'tehrei': '<img src=http://i.imgur.com/Xj0jB1P.png" width="60" height="60";">',    

   //shounenshit
'ken': '<img src="http://i.imgur.com/r5T9ym7.gif" width="56" height="54";>',
'wry': '<img src="http://i.imgur.com/KlFkYTD.gif" width="60" height="60">',
'nice2': '<img src="http://i.imgur.com/rfPPHhw.png" width="74" height="63";>',
'dio2': '<img src="http://i.imgur.com/RxxMWwY.png" width="68" height="56";>',
'joey': '<img src="http://s9.postimg.org/7jgdsbfe3/Joey_transparent.png" width="60" height="60";>',
'guts': '<img src="http://i.imgur.com/Vwq5J2n.png" width="65" height="60";>',
'ok': '<img src="http://i.imgur.com/ukL3Rh2.png" width="49" height="60">',
'vegeta': '<img src="http://i.imgur.com/iTqAwhm.gif" width="57" height="70";>',
'brightslap': '<img src="http://i.imgur.com/erMkFra.png" width="67" height="55";">',


   //2hu
'chen3': '<img src="http://i.imgur.com/MSoQrxX.gif" width="54" height="55" onclick="script.fns.playSound(script.emoteSounds.chen);">',
'chen4': '<img src="http://i.imgur.com/vRgXgKd.gif" width="60" height="60" onclick="script.fns.playSound(script.emoteSounds.chen);">',
'cirno': '<img src="http://i.imgur.com/NpUPZSn.gif" width="60" height="60";>',
'marissa': '<img src="http://i.imgur.com/kauEfnn.gif" width="60" height="60";>',
'getout': '<img src="http://i.imgur.com/i11Ca75.png" width="60" height="60";>',
'reimu': '<img src="http://i.imgur.com/RRPNiqa.gif" width="50" height="60";>',
'moe2': '<img src="http://i.imgur.com/U5NVxsR.gif" width="55" height="55";>',
'goblinu2': '<img src="http://i.imgur.com/ysnlbp2.gif" width="50" height="50";>',
'awoo': '<img src="http://i.imgur.com/zZzW3S2.gif" width="70,height:68";>',
'awoo2': '<img src="http://i.imgur.com/78w0OiM.gif" width="60" height="69";>',

   //smug animes
'smuganime': '<img src="http://i.imgur.com/SCpPihV.gif" width="60" height="60";">',
'smuganime2': '<img src="http://i.imgur.com/mKfn1C2.gif" width="50" height="55";">',
'smuganime3': '<img src="http://i.imgur.com/GJSTjQj.png" width="52" height="65";">',
'nonon': '<img src="http://i.imgur.com/K5H6tns.png" width="54" height="55";">',


   //anime static
'doit3': '<img src="http://i.imgur.com/eIF1R2L.png" width="80" height="60";">',
'papi': '<img src="http://i.imgur.com/ZBRuxX6.png" width="63" height="57";">',
'assman': '<img src="http://i.imgur.com/3haIWH6.png" width="52" height="54";">',
'gojira': '<img src="http://i.imgur.com/HbcCcHz.png" width="60" height="59";">',
'rustle': '<img src="http://i.imgur.com/W7cAfBL.png" width="55" height="56";">',
'suicide': '<img src="http://i.imgur.com/omaV2Sh.png" width="60" height="60";>',

   //anime gifs
'anime': '<img src="http://i.imgur.com/2OmBZZU.gif" width="60" height="60";>',
'rin': '<img src="http://i.imgur.com/PB3hHru.gif" width="54" height="60">',
'o2': '<img src="http://i.imgur.com/mJPnC0s.gif" width="84" height="63";>',
'spin': '<img src="http://i.imgur.com/pd3vXcV.gif" width="72" height="64";>',
'sogoodnow': '<img src="http://i.imgur.com/uO7zf1l.gif" width="80" height="60">',
'mememe': '<img src="http://i.imgur.com/nzz8tK1.gif" width="60" height="70";>',
'moe': '<img src="http://i.imgur.com/A2sUtXo.gif" width="57" height="57";>',
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




//Vidya
        

   // Nintendo
'mario2': '<img src="http://i.imgur.com/A4eNPZW.gif" width="53" height="55";>',
'm&l': '<img src="http://i.imgur.com/fHJThR6.gif" width="55" height="55";>',
'yoshi': '<img src="http://i.imgur.com/B6bBva0.gif" width="50" height="51";>',
'kabi': '<img src="http://i.imgur.com/F5qdDtE.gif" width="125" height="45";>',
'dk': '<img src="http://i.imgur.com/yLLNCsh.gif" width="80" height="50";>',
'expanddong': '<img src="http://i.imgur.com/RoQiAtP.png" width="43" height="52";>',
'diddy': '<img src="http://i.imgur.com/ZEE0jZF.gif" width="53" height="53";>',
'he': '<img src="http://i.imgur.com/ZUDYg30.png" width="33" height="60";>',
'ness': '<img src="http://i.imgur.com/nALMPb7.png" width="50" height="55";>',
'metroid': '<img src="http://i.imgur.com/rRKU1.gif" width="39" height="45";>',
'ludicolo': '<img src="http://i.imgur.com/Ibjqkzi.gif" width="55" height="45";>',
'togepi': '<img src="http://i.imgur.com/XiBOfOD.gif" width="55" height="55";>',
'blastoise': '<img src="http://i.imgur.com/TPLKElK.gif" width="64" height="64";>',
'dj': '<img src="http://i.imgur.com/9gVht7Y.gif" width="60" height="60";>',
'hitmontop': '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/hitmontop.gif" width="76" height="61";">',
'wario': '<img src="http://i.imgur.com/TpFDOXv.gif" width="70" height="70";">',
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
'dio': '<img src="http://i.imgur.com/x3Xw7V9.gif" width="120" height="70">',
'kakyoin': '<img src="http://i.imgur.com/AiqM7ep.gif" width="55" height="70";>',
'megaman': '<img src="http://i.imgur.com/L5JCadl.gif" width="60" height="48";>',
'servbot': '<img src="http://i.imgur.com/Imolf.gif" width="50" height="50";">',
'monkey': '<img src="http://i.imgur.com/pKXZaQM.gif" width="67" height="50";>',
'objection': '<img src="http://i.imgur.com/M89gYbG.gif" width="80" height="47">',
'pew2': '<img src="http://i.imgur.com/mWAan6J.gif" width="120" height="54";">',
'sakura': '<img src="http://i.imgur.com/xv1O1si.gif" width="55" height="55";>',
'dhalsim': '<img src="http://i.imgur.com/DdcpChu.gif" width="53" height="55";>',
'ohoho': '<img src="http://www.fightersgeneration.com/nz4/char/karin/karin-lol-taunt.gif" width="42" height="64";>',
'yes': '<img src="http://i.imgur.com/TvtnuqI.gif" width="70" height="45";>',

   //Square Enix
'crono': '<img src="http://i.imgur.com/7XFNWrl.gif" width="36" height="72";">',
'frog': '<img src="http://i.imgur.com/JCVY8WY.gif"  width="36" height="72";">',
'robo': '<img src="http://i.imgur.com/FYbjRHx.gif" width="36" height="70";">',
'blackmage': '<img src="http://i.imgur.com/n7174B2.gif" width="50" height="50":>',
'pew3': '<img src="http://i.imgur.com/fb5r3Bw.gif" width="66" height="52";">',
'ff6kappa': '<img src="http://i.imgur.com/6tqguge.gif" width="68" height="50";>',


   //Namco
'pac': '<img src="http://i.imgur.com/E7GuNSW.gif" width="62" height="50">',

   //SNK
'strut': '<img src="http://i.imgur.com/199ZHvl.gif" width="74" height="75";>',
'pew': '<img src="http://i.imgur.com/QWONFwf.gif" width="60" height="50";>',

   //Konami
'200mad': '<img src="https://i.imgur.com/Ks2Nyyx.jpg" width="49" height="70";">', 
'200glad': '<img src="http://i.imgur.com/kossA40.jpg" width="49" height="70";">', 
'bigboss': '<img src="http://i.imgur.com/uJrM3u0.png" width="70" height="40";">',
'kojima': '<img src="http://i.imgur.com/9M40dsy.png" width="60" height="60";>',
'!': '<img src="http://i.imgur.com/cvzg1zF.png" width="49" height="60";>',
    
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
'bot2': '<img src=http://i.imgur.com/H8KzzTn.gif"  width="77" height="60";">', 
'sans': '<img src="http://i.imgur.com/h7ttyH4.gif" width="73" height="50";>',
'spiderdance': '<img src="http://orig07.deviantart.net/c3f0/f/2015/282/0/3/spiderdance_by_weegygreen2-d9ciry1.gif" width="55" height="48";>',
'xenomorph': '<img src="http://i.imgur.com/UQozZkR.gif" width="60" height="60";>',
'xenomorph2': '<img src="http://i.imgur.com/hC1fUu7.gif" width="60" height="60";>',
'rare': '<img src="http://i.imgur.com/FPf04tV.gif" width="60" height="60";>',
'ps': '<img src="http://i.imgur.com/FH5Y7Ni.gif" width="75" height="35";>',
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
'spoopkd': '<img src="http://i.imgur.com/N6dctIS.gif" width="45" height="50";>',
'shrug': '<img src="http://i.imgur.com/AjSWflZ.png" width="86" height="62":>',
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

   //co
'40keks': '<img src="http://i.imgur.com/WcPOe64.png" width="60" height="50">',
    
   //sp
'rasm': '<img src="http://i.imgur.com/rcyjkbW.png" width="55" height="50";>',
'bloos': '<img src="http://i.imgur.com/yYXebfx.png" width="55" height="50";>',
'panths': '<img src="http://i.imgur.com/3xLfVaL.png" width="55" height="50";>',
'gnats': '<img src="http://i.imgur.com/ccCHWLO.png" width="55" height="50";>',
'why2': '<img src="http://i.imgur.com/iZks7ar.jpg" width="60" height="30";>',
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

  //pol/int
'putin': '<img src="http://i.imgur.com/yDrpKH3.png" width="70" height="60";">',
'shieeet': '<img src="http://i.imgur.com/lArXmLg.png" width="53" height="53">',
'trump': '<img src="http://i.imgur.com/3XtKojW.png" width="57" height="60">',
'coolbama': '<img src="http://i.imgur.com/AxWLGC5.png" width="51" height="60";>',

   //WOOO
    
'swerve2': '<img src="https://i.imgur.com/EwVd5.png" width="60" height="66";>',    
'hulkamania': '<img src="https://media0.giphy.com/media/uKwa2KiBA0rTy/200.gif" width="65" height="50";>',

   //gachi 
'aniki': '<img src="http://i.imgur.com/tYTy13s.jpg" width="63" height="48" onclick="this.src = \'http://i.imgur.com/VRE07P7.png\'">',
'riptheskin': '<img src="http://i.imgur.com/b3ex5cx.png" width="42" height="49";>',
'pull': '<img src="http://i.imgur.com/jhuvqTo.gif" width="60" height="56";>',
'push2': '<img src="http://i.imgur.com/WMwbr7n.gif" width="60" height="56";>',
'yaranaika': '<img src="http://i.imgur.com/QZrm2LE.png" width="60" height="60";">',
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
'thomas': '<img src="http://i.imgur.com/0SmW7TZ.png" width="59" height="51">',
'thomas2': '<img src="http://files.gamebanana.com/img/ico/sprays/552c1e5a37498.png" width="63" height="60">',
'dorks': '<img src="http://i.imgur.com/y7zOXCj.png" width="67" height="45">',

    
    
   //other gifs
'freedum': '<img src="http://i.imgur.com/uDUO8Nw.gif" width="57" height="45";>',
'babyguitar': '<img src="https://i.imgur.com/qOCgzsL.gif" width="55" height="55">',
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
'feels3d': '<img src="http://i.imgur.com/TWSedg5.gif" width="50" height="50";>',
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

   //aliens
'alien2': '<img src="http://i.imgur.com/jBji5uc.gif" width="53" height="73";>',
'ayylien': '<img src="http://i.imgur.com/RgnpAPE.gif" width="45" height="59";>',
'ayylmao': '<img src="http://i.imgur.com/7AyGv1a.gif" width="60" height="74";>',
'gigalien': '<img src="http://i.imgur.com/kEBhRIy.gif" width="40" height="60";>',
'bongalien': '<img src="http://i.imgur.com/0JF6Nul.gif" width="51" height="51";>',

   //stock
'nothanks': '<img src="http://i.imgur.com/THkiZzu.png" width="65" height="65";>',


};
$.extend(script.$externalEmotes, script.$animEmotes);