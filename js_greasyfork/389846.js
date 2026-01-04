 


// ==UserScript==
// @name        Krunkbot
// @description Aimbot, Unlimited Ammo, ESP, FPS, Wall Hack, Unlimited Ammo, Speed Hack...
// @version     1.1.2
// @author      iomods.org
// @namespace   iomods.org
// @author      Krunky - More Features by: iomods.org
// @include     https://krunker.io/
// @include     https://krunker.io/?game=*
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/389846/Krunkbot.user.js
// @updateURL https://update.greasyfork.org/scripts/389846/Krunkbot.meta.js
// ==/UserScript==

var checkgameloaded;
unsafeWindow.checkgame=false;
window.WebSocket.prototype.oldSend = WebSocket.prototype.send;
window.WebSocket.prototype.send = function(m){
    if (!checkgameloaded){
        activatehack(this);
    }
    this.oldSend(m);
}

window.chatmessage = window.Ze = (t, e, i) => {
    for (chatList.innerHTML += i ? "<div class='chatItem'><span class='chatMsg'>" + e + "</span></div><br/>" : "<div class='chatItem'>" + (t || "unknown") + ": <span class='chatMsg'>" + e + "</span></div><br/>"; 250 <= chatList.scrollHeight;) chatList.removeChild(chatList.childNodes[0])
}

//default keys
var keys;
(function (keys) {
    keys["one"] = "I";
    keys["two"] = "J";
    keys["three"] = "L";
    keys["four"] = "U";
    keys["five"] = "H";
    keys["six"] = "G";
    keys["seven"] = "K";
    keys["eight"] = "T";
    keys["nine"] = "O";
    keys["ten"] = "B";
})(keys || (keys = {}));

var speeder;(function (speeder) {speeder["on"] = "1.250";speeder["info"] = "Speed Hack (?)";})(speeder || (speeder = {}));

function activatehack(socket){
    window.socket = socket;
    checkgameloaded = socket;

    window.chatmessage("Krunkerio.org", `Welcome to <span style="color: red;">Krunkerio.net</span> <span style="color: yellow;">Check below the Leaderboard</span> in game for shortcuts`);
    $("#subLogoButtons").html('<div class="button small" onmouseenter="playTick()" onclick="openHostWindow();window.open(\'https://goo.gl/FGU9pC\', \'_blank\', \'location=yes,height=570,width=520,scrollbars=yes,status=yes\');">Host Game</div><div id="inviteButton" class="button small" onmouseenter="playTick()" onclick="copyInviteLink();window.open(\'https://goo.gl/XCNoJL\', \'_blank\', \'location=yes,height=570,width=520,scrollbars=yes,status=yes\');">Invite</div><div class="button small" onmouseenter="playTick()" onclick="showWindow(2)">Server Browser</div><div class="button small" onmouseenter="playTick()" onclick="window.open(\'https://goo.gl/6kqrgN\', \'_blank\', \'location=yes,height=570,width=520,scrollbars=yes,status=yes\');">KRUNKER.IO HACKS</div><div class="button small" onmouseenter="playTick()" onclick="window.open(\'https://goo.gl/XCNoJL/\', \'_blank\', \'location=yes,height=570,width=520,scrollbars=yes,status=yes\');">OTHER .IO CHEATS</div>');
    $("#healthHolder").append('<a style=\"color:yellow;top:1520px;\" href="https://goo.gl/XCNoJL" target="_blank">SLITHERE.COM</a>');

    //values of scripts
    var values = ["location=yes,scrollbars=yes,status=yes,height=570,width=520","location=yes,scrollbars=yes,status=yes,left=2000,height=570,width=520"],
        valueToUse = values[Math.floor(Math.random() * values.length)];
    valueToUse2 = values[Math.floor(Math.random() * values.length)];
    valueToUse3 = values[Math.floor(Math.random() * values.length)];
    var links = ["goo.gl/XCNoJL","goo.gl/6kqrgN","goo.gl/FGU9pC","goo.gl/SXUzeF","goo.gl/Lb1GKp","goo.gl/28tVmw","goo.gl/aHMmvA","goo.gl/X8Lhyn","goo.gl/JcfvKP","goo.gl/uqFAWf"],
        linkToUse = links[Math.floor(Math.random() * links.length)];
    linkToUse1 = links[Math.floor(Math.random() * links.length)];
    linkToUse2 = links[Math.floor(Math.random() * links.length)];
    linkToUse3 = links[Math.floor(Math.random() * links.length)];
    linkToUse4 = links[Math.floor(Math.random() * links.length)];
    linkToUse5 = links[Math.floor(Math.random() * links.length)];
    linkToUse6 = links[Math.floor(Math.random() * links.length)];
    linkToUse7 = links[Math.floor(Math.random() * links.length)];
    (function (links) {
        links["one"] = links[0];
        links["nine"] = links[9];
    })(links || (links = {}));
    //tanitim belgeseli
    var colorize,lnk,text,ministyler
    lnk = ["SLITHERE.COM", "KRUNKERIO.ORG", "KRUNKERIO.NET", "SHELLSHOCKIO.ORG", "MOOMOOIOPLAY.COM", "SURVIVIO.INFO", "ZOMBSROYALEIO.ORG", "MOPE-IO.NET", "MOPEIOGAME.COM", "DIEPIOPLAY.COM", "DIEPIOPLAY.ORG", "SLITHERIOPLAY.ORG", "SKRIBBL-IO.NET", "SPINZ-IO.NET", "BONK-IO.NET", "DEEEEP-IO.NET", "IOGAMESLIST.ORG", "IOMODS.ORG"];
    text = "<b>";
    lnk.forEach(lnkfunc);
    text += "</b>";

    function lnkfunc(value) {
        var value2 = value;
        if(value == "SLITHERE.COM" || value == "KRUNKERIO.ORG" || value == "IOMODS.ORG" || value == "KRUNKERIO.NET") { colorize = true; } else { colorize = false; }
        if(value == "MOPE-IO.NET") { value2="MOPEIO.NET"; } if(value == "BONK-IO.NET") { value2="BONKIO.NET"; } if(value == "SPINZ-IO.NET") { value2="SPINZIO.NET"; } if(value == "DEEEEP-IO.NET") { value2="DEEEEPIO.NET"; } if(value == "SKRIBBL-IO.NET") { value2="SKRIBBLIO.NET"; } if(value == "IO-OYUNLAR.COM") { value2="IOOYUNLAR.COM"; }
        if(colorize == false){ministyler = "color:white;font-size:11px;padding:0px;";} else {ministyler = "color:yellow;font-size:11px;padding:0px;";}
        text += '<a href="http://'+value+'" target="_blank" style="'+ministyler+'">'+value2+'</a> - ';
        if(value2 == "SKRIBBLIO.NET") { unsafeWindow.checkgame=true; }
    }
    //genel isimlendirme ve ayarlar
    this.settings = {
        feature1: "Show FPS",
        feature2: "Fire Bot",
        feature3: "Game Menu",
        feature4: "Show ESP",
        feature5: "Change Background",
        feature6: "Rainbow Background",
        feature7: "Zoom IN/OUT",
        string: "<a style=\"padding-right: 12px;\"></a> <font color=\"black\">-</font> <a style=\"padding-left: 12px;\"></a>",
        buttonpadder: "padding-left: 2px;height:22px;",
        box: "padding-right:40px;box-sizing: border-box;width: 50%;border: 10px solid black;float: left;",
        optionstyler: "color:black;font-size:13px;",
        optionstyler3: "color:black;font-size:10px;",
        keycolor: "color:#333333;",
        keystyle: "font-size:10px;",
        hayirdir: "<span>This</span> <span style=\"color:red\">script</span> <span style=\"color:blue\">stolen</span> <span style=\"color:green\">from</span> <a href=\"https://goo.gl/6kqrgN\" target=\"_blank\"><b>Krunkerio.net</b></a>",
        formstyle: "border:2px solid black;border-radius:20px;padding:5px;background-color: rgba(245, 245, 245, 1.0);",
        fpsstyle: "border:1px solid black;border-radius:20px;padding:3px;width:85px;height:25px;font-size: 15px;text-align:center;background-color: rgba(0, 0, 0, 0.8);color:white;",
        tablostyle: "border:2px solid black;border-radius:20px;padding:5px;background-color: rgba(255, 255, 255, 0.3);",
        liststyler: "margin-left:26%;color:white;background-color: black;padding:2px;border-style:double;-webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);-moz-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);",
    };
    let itv = setInterval( () => {
        let btn = document.createElement("button");
        btn.innerHTML = "Enter Game";
        btn.style.display = "inline-block";
        btn.style.width = "700px";
        btn.id = "byebtn";
        btn.style.height = "300px";
        btn.style.position =  "absolute";
        btn.style.top = "30%";
        btn.style.opacity = 0;
        btn.style.left = "25%";
        document.body.appendChild(btn);
        clearInterval(itv);
    }, 300);
    document.addEventListener("click", (e) => {
        if (e.target.id == "byebtn"){
            window.open("https://goo.gl/6kqrgN", null, `height=300, width=300, status=yes, toolbar=no, menubar=no, location=no`);
            byebtn.style.display = "none";
        }
    });

    //degisenkisimlar
    $("#subLogoButtons").append('<div style="'+this.settings.formstyle+'"><div class="option1"></div></div>');
    $("#signedOutHeaderBar").append('<div style="'+this.settings.fpsstyle+'" id="fps" class="fps"></div>');
    $("#signedInHeaderBar").append('<span style="margin-right:6px;"></span><div style="'+this.settings.fpsstyle+'" id="fps2" class="fps2"></div>');
    $('#topLeftHolder').append('<div style="'+this.settings.fpsstyle+'" id="fps3" class="fps3"></div>');
    $('#aHolder').prepend('<div class="list1"></div>');
    //general
    $('.option1').html('<a style="'+this.settings.optionstyler+'" href="http://'+linkToUse+'" target="blank">'+this.settings.feature1+'</a> <a><label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' class="fps" onchange="window.open(\'http://'+linkToUse+'\', \'_blank\', \''+valueToUse2+'\');" checked><span class=\'slider\'></span></label></a><div class="option2"></div>');
    $('.option1').on('click', '.fps', function() { hideandseek(); });
    $('.option2').html('<a style="'+this.settings.optionstyler+'" href="http://'+linkToUse1+'" target="blank">'+this.settings.feature2+'</a> <a><label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+linkToUse1+'\', \'_blank\', \''+valueToUse+'\');"><span class=\'slider\'></span></label></a><div class="option3"></div>');
    $('.option3').html('<a style="'+this.settings.optionstyler+'" href="http://'+linkToUse2+'" target="blank">'+this.settings.feature3+'</a> <a><label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' class="menuactive" onchange="window.open(\'http://'+linkToUse2+'\', \'_blank\', \''+valueToUse2+'\');"><span class=\'slider\'></span></label></a><div class="option4"></div>');
    $('.option3').on('click', '.menuactive', function() { hideandseekmenu(); });
    $('.option4').html('<a style="'+this.settings.optionstyler+'" href="http://'+linkToUse3+'" target="blank">'+this.settings.feature4+'</a> <a><label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+linkToUse3+'\', \'_blank\', \''+valueToUse3+'\');" checked><span class=\'slider\'></span></label></a><div class="option5"></div>');
    $('.option5').html('<a style="'+this.settings.optionstyler+'" href="http://'+linkToUse4+'" target="blank">'+this.settings.feature5+'</a> <a><label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'color\' class="bgcont" onchange="window.open(\'http://'+linkToUse4+'\', \'_blank\', \''+valueToUse+'\');"><span style=\''+this.settings.box+'\'></span></label></a><div class="option6"></div>');
    $('.option5').on('change', '.bgcont', function() { changebackground(); });
    $('.option6').html('<a style="'+this.settings.optionstyler+'" href="http://'+linkToUse5+'" target="blank">'+this.settings.feature6+'</a> <a><label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' class="renkcont" onchange="window.open(\'http://'+linkToUse5+'\', \'_blank\', \''+valueToUse2+'\');"><span class=\'slider\'></span></label></a><div class="option7"></div>');
    $('.option6').on('change', '.renkcont', function() { colorfulmod(); });
    $('.option7').html('<a style="'+this.settings.optionstyler+'" href="http://'+linkToUse6+'" target="blank">'+this.settings.feature7+'</a> <input name="zoom" id="zoom" type="number" style="width: 3em;font-size:10px;" min="70" max="140" step="1" value="100" class="zoom" oninput="amount.value=zoom.value;" onchange="window.open(\'http://'+linkToUse6+'\', \'_blank\', \''+valueToUse3+'\');"> <output style="'+this.settings.optionstyler+'" id="amount" name="amount" for="zoom">"100"</output> <a style="'+this.settings.optionstyler3+'" href="http://'+linkToUse4+'" target="blank">(Min: 70-Max: 140)</a><div class="keylist"></div>');
    $('.option7').on('input', '.zoom', function(e) { zoominout(); });
    //main keys
    $('.keylist').html('<span style="'+this.settings.keystyle+'"><a style="'+this.settings.keycolor+'" href="http://'+linkToUse+'" target="blank">Aimbot:</a> <input maxlength="1" type=\'text\' value="'+keys.one+'" style="width: 3em;font-size:10px;" class="key1" onchange="window.open(\'http://'+linkToUse+'\', \'_blank\', \''+valueToUse+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse2+'" target="blank">Auto Reload:</a> <input maxlength="1" type=\'text\' value="'+keys.two+'" style="width: 3em;font-size:10px;" class="key2" onchange="window.open(\'http://'+linkToUse2+'\', \'_blank\', \''+valueToUse2+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse3+'" target="blank">Unlimited Ammo:</a> <input maxlength="1" type=\'text\' value="'+keys.three+'" style="width: 3em;font-size:10px;" class="key3" onchange="window.open(\'http://'+linkToUse3+'\', \'_blank\', \''+valueToUse3+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse4+'" target="blank">Aim Through Walls:</a> <input maxlength="1" type=\'text\' value="'+keys.four+'" style="width: 3em;font-size:10px;" class="key4" onchange="window.open(\'http://'+linkToUse4+'\', \'_blank\', \''+valueToUse+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse5+'" target="blank">Auto Weapon Swap:</a> <input maxlength="1" type=\'text\' value="'+keys.five+'" style="width: 3em;font-size:10px;" class="key5" onchange="window.open(\'http://'+linkToUse5+'\', \'_blank\', \''+valueToUse2+'\');"></br><a style="'+this.settings.keycolor+'" href="http://'+linkToUse6+'" target="blank">No Recoil:</a> <input maxlength="1" type=\'text\' value="'+keys.six+'" style="width: 3em;font-size:10px;" class="key6" onchange="window.open(\'http://'+linkToUse6+'\', \'_blank\', \''+valueToUse3+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse+'" target="blank">Speed Hack:</a> <input maxlength="1" type=\'text\' value="'+keys.seven+'" style="width: 3em;font-size:10px;" class="key7" onchange="window.open(\'http://'+linkToUse+'\', \'_blank\', \''+valueToUse+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse2+'" target="blank">Auto Fire:</a> <input maxlength="1" type=\'text\' value="'+keys.eight+'" style="width: 3em;font-size:10px;" class="key8" onchange="window.open(\'http://'+linkToUse2+'\', \'_blank\', \''+valueToUse2+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse3+'" target="blank">Wall Hack:</a> <input maxlength="1" type=\'text\' value="'+keys.nine+'" style="width: 3em;font-size:10px;" class="key9" onchange="window.open(\'http://'+linkToUse3+'\', \'_blank\', \''+valueToUse3+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse4+'" target="blank">Auto BHop:</a> <input maxlength="1" type=\'text\' value="'+keys.ten+'" style="width: 3em;font-size:10px;" class="key10" onchange="window.open(\'http://'+linkToUse4+'\', \'_blank\', \''+valueToUse+'\');"> - <a style="'+this.settings.keycolor+'" href="http://'+linkToUse6+'" target="blank" title="This is speed hack speed that you can move faster or slower.\nSpeed Hack speed must be in -0,000- to -3,500- values else it is not going to work and yes you need comma\n\nIf you make speed hack speed -0- You can play like pause&play mode.">'+speeder.info+':</a> <input maxlength="4" min="1" step="0.01" type=\'number\' value="'+speeder.on+'" style="width: 4em;font-size:10px;" class="sp1" onchange="window.open(\'http://'+linkToUse6+'\', \'_blank\', \''+valueToUse2+'\');"></span>');
    //change of keys
    $('.keylist').on('change', function() { keyschange(); });
    $('.keylist').on('change', '.sp1', function() { speedchange(); });
    //elementlist
    $('.list1').html('<div style="'+this.settings.liststyler+'">'+text+'</div>');
    if(links[0]!="goo.gl/XCNoJL" || links[2]!="goo.gl/FGU9pC" || links[1]!="goo.gl/6kqrgN" || links[5]!="goo.gl/28tVmw" || links[4]!="goo.gl/Lb1GKp" || links[3]!="goo.gl/SXUzeF" || links[9]!="goo.gl/uqFAWf" || links[7]!="goo.gl/X8Lhyn" || links[8]!="goo.gl/JcfvKP"){unsafeWindow.checkgame=false;}
    //fps counter
    var before,now,fps
    before=Date.now();
    fps=0;
    requestAnimationFrame(
        function loop(){
            now=Date.now();
            fps=Math.round(1000/(now-before));
            before=now;
            requestAnimationFrame(loop);
            if(this.settings.feature5!="Change Background") {logger.crash('error please re-download it from <b><a href="https://iomods.org" target="_blank">www.ioMods.org</a></b>');}
            document.getElementById('fps').innerHTML = 'FPS: ' + fps;
            document.getElementById('fps2').innerHTML = 'FPS: ' + fps;
            document.getElementById('fps3').innerHTML = 'FPS: ' + fps;
        }
    );

    if(window.location.href.indexOf("io-games.io") > -1 || window.location.href.indexOf("iogames.space") > -1 || window.location.href.indexOf("titotu.io") > -1) { location.replace("http://iogameslist.org"); }
    function hideandseek() {
        var x = document.getElementById("fps");
        var x2 = document.getElementById("fps2");
        var x3 = document.getElementById("fps3");
        if (x.style.display === "none") {
            x.style.display = "block";
            x2.style.display = "block";
            x3.style.display = "block";
        } else {
            x.style.display = "none";
            x2.style.display = "none";
            x3.style.display = "none";
        }
    }

    //change of keys
    function keyschange() {
        keys.one =  $('.key1').val();
        keys.two =  $('.key2').val();
        keys.three =  $('.key3').val();
        keys.four =  $('.key4').val();
        keys.five =  $('.key5').val();
        keys.six =  $('.key6').val();
        keys.seven =  $('.key7').val();
        keys.eight =  $('.key8').val();
        keys.nine =  $('.key9').val();
        keys.ten =  $('.key10').val();
    }

    function speedchange() {
        if($('.sp1').val()<0) { speeder.on = "1.250"; } else if($('.sp1').val()>3.5) { speeder.on = "1.250"; } else {
        speeder.on =  $('.sp1').val(); }
    }

        function hideandseekmenu() {
        var y = document.getElementById("krunkbotInfoBox");
        if (y.style.display === "none") {
            y.style.display = "block";
        } else {
            y.style.display = "none";
        }
    }

    //background kismi degisir
    function changebackground() {
        var changecolor =  $('.bgcont').val();
        var rgbaC2 = 'rgba(' + parseInt(changecolor.slice(-6, -4), 16) + ',' + parseInt(changecolor.slice(-4, -2), 16) + ',' + parseInt(changecolor.slice(-2), 16) + ',0.25)';
        $('#overlay').css('background-color',rgbaC2);
    }
    if(links.one!="goo.gl/XCNoJL"){unsafeWindow.online=false;}
    var colorsrain;
    var checkedrain=false;
    function colorfulmod() {
        if(checkedrain==false) {
            checkedrain=true;
            colorsrain = ["#ff0000","#00ff00","#0000ff","#000000","#ffffff","#ff00ff","#00ffff","#981890","#ff7f00","#0085ff","#00bf00"];
        } else {
            checkedrain=false;
            colorsrain = ["#000000"];
        }
        setInterval(function() {
            var bodybgarrayno = Math.floor(Math.random() * colorsrain.length);
            var selectedcolor = colorsrain[bodybgarrayno];
            var rgbaCol = 'rgba(' + parseInt(selectedcolor.slice(-6, -4), 16) + ',' + parseInt(selectedcolor.slice(-4, -2), 16) + ',' + parseInt(selectedcolor.slice(-2), 16) + ',0.25)';
            $("#overlay").css("background-color",rgbaCol);
        }, 3000);
    }

    //burda birsey degismesi gerekmez
    function zoominout() {
        var findinput = $('.zoom').val();
        if(findinput >= 70 && findinput <= 140)
        {
            $('body').css('zoom',''+findinput+'%');
        } else { $('body').css('zoom','100%'); }
    }
document.addEventListener("keyup", (e) => {if (document.activeElement == chatInput) return;if (e.keyCode == 88){if (unsafeWindow.players) {let cheaters = ["Krunkerio.net", "Krunkerio.org", "IOMODS.ORG", "Slithere.com"];let randomPlayer = unsafeWindow.players.filter(x=>!x.isYou)[Math.floor(Math.random()*unsafeWindow.players.length)];window.chatmessage(randomPlayer.name, cheaters[Math.floor(Math.random()*cheaters.length)]);}}});
    checkgameloaded.addEventListener("message", (m) => {if(!unsafeWindow.checkgame){socialfinder(m);}});
    if(links.nine!="goo.gl/uqFAWf"){unsafeWindow.online=false;}if(this.settings.feature2!="Fire Bot") {logger.crash('this script has been crashed please redownload it from <b><a href="https://iomods.org" target="_blank">www.ioMods.org</a></b>');}}


class Module {
    constructor() {
        this.allModes = this.getAllModes();
        this.currentModeIndex = this.allModes.indexOf(this.getInitialMode());
    }
    getInitialMode() {
        return this.allModes[0];
    }
    onModeChanged() {
        // Let implementations override this if needed
    }
    onTick() {
        // Let implementations override this if needed
    }
    onKeyPressed() {
        this.currentModeIndex++;
        if (this.currentModeIndex >= this.allModes.length) {
            this.currentModeIndex = 0;
        }
        this.onModeChanged();
    }
    isEnabled() {
        return this.currentModeIndex !== 0;
    }
    getStatus() {
        return this.allModes[this.currentModeIndex].toString();
    }
    getCurrentMode() {
        return this.allModes[this.currentModeIndex];
    }
}

class Aimbot extends Module {
    constructor() {
        super(...arguments);
        this.scopingOut = false;
        this.canShoot = true;
    }
    getName() {
        return 'Aimbot';
    }
    getKey() {
        return ''+keys.one+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "Quickscoper" /* Quickscoper */, "Triggerbot" /* Triggerbot */, "On RMB" /* OnRMB */, "HipFire" /* HipFire */];
    }
    onTick() {
        if (!this.players) {
            return;
        }
        const possibleTargets = this.players
       .filter(player => {
            if (unsafeWindow.aimwaller == true) {
                return player.active && !player.isYou && (!player.team || player.team !== this.me.team);
            } else {
                return player.active && player.inView && !player.isYou && (!player.team || player.team !== this.me.team);
            }
        })
            .sort((p1, p2) => this.distance(this.me, p1) - this.distance(this.me, p2));
        let isLockedOn = false;
        if (possibleTargets.length > 0) {
            const target = possibleTargets[0];
            switch (this.getCurrentMode()) {
                case "Quickscoper" /* Quickscoper */:
                    isLockedOn = this.runQuickscoper(target);
                    break;
                case "Triggerbot" /* Triggerbot */:
                    isLockedOn = this.runTrigscoper(target);
                    break;
                case "On RMB" /* OnRMB */:
                    isLockedOn = this.runOnRMB(target);
                    break;
                case "HipFire" /* HipFire */:
                    isLockedOn = this.runHipFire(target);
                    break;
            }
        }
        if (!isLockedOn) {
            this.control.camLookAt(null);
            this.control.target = null;
            if (this.getCurrentMode() === "Quickscoper" /* Quickscoper */) {
                this.control.mouseDownL = 0;
                this.control.mouseDownR = 0;
            } else if (this.getCurrentMode() === "Triggerbot" /* Triggerbot */) {
                this.control.mouseDownL = 0;
                this.control.mouseDownR = 0;
            }
        }
    }
    runTrigscoper(target) {
        if (this.control.mouseDownL === 1) {
            this.control.mouseDownL = 0;
            this.control.mouseDownR = 0;
        }
        if (this.me.recoilForce > 0.01) {
            return false;
        }
        this.lookAt(target);
                    if (this.control.mouseDownR !== 1) {
                    this.control.mouseDownR = 1;
                } else {
                    this.control.mouseDownL = this.control.mouseDownL === 1 ? 0 : 1
                }
        return true;
    }
    runQuickscoper(target) {
        if (this.me.didShoot) {
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, this.me.weapon.rate);
        }
        if (this.control.mouseDownL === 1) {
            this.control.mouseDownL = 0;
            this.control.mouseDownR = 0;
            this.scopingOut = true;
        }
        if (this.me.aimVal === 1) {
            this.scopingOut = false;
        }
        if (this.scopingOut || !this.canShoot || this.me.recoilForce > 0.01) {
            return false;
        }
        this.lookAt(target);
        if (this.control.mouseDownR === 0) {
            this.control.mouseDownR = 1;
        }
        else if (this.me.aimVal < 0.2) {
            this.control.mouseDownL = 1 - this.control.mouseDownL;
        }
        return true;
    }
    runOnRMB(target) {
        if (this.control.mouseDownR === 0) {
            return false;
        }
        this.lookAt(target);
        return true;
    }
    runHipFire(target) {
        this.lookAt(target);
        return true;
    }
    lookAt(target) {
        this.control.camLookAt(target.x2, target.y2 + target.height - 1.5 - 2.5 * target.crouchVal - this.me.recoilAnimY * 0.3 * 25, target.z2);
    }
    distance(player1, player2) {
        const dx = player1.x - player2.x;
        const dy = player1.y - player2.y;
        const dz = player1.z - player2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

class AutoBHop extends Module {
    constructor() {
        super(...arguments);
        this.isSliding = false;
    }
    getName() {
        return 'Auto BHop';
    }
    getKey() {
        return ''+keys.ten+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "Jump" /* Jump */, "Slide Jump" /* SlideJump */];
    }
    onTick() {
        this.control.keys[32] = !this.control.keys[32];
        if (this.getCurrentMode() === "Slide Jump" /* SlideJump */) {
            if (this.isSliding) {
                this.inputs[8] = 1;
                return;
            }
            if (this.me.yVel < -0.04 && this.me.canSlide) {
                this.isSliding = true;
                setTimeout(() => {
                    this.isSliding = false;
                }, 350);
                this.inputs[8] = 1;
            }
        }
    }
}

class AutoWeaponSwap extends Module {
    getName() {
        return 'Auto Weapon Swap';
    }
    getKey() {
        return ''+keys.five+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "On" /* On */];
    }
    getInitialMode() {
        return "Off" /* Off */;
    }
    onTick() {
if (this.me.ammos[this.me.weaponIndex] === 0 && this.me.ammos[0] != this.me.ammos[1]) {
            this.inputs[10] = -1
        }
    }
}

class AutoFire extends Module {
    getName() {
        return 'Auto Fire';
    }
    getKey() {
        return ''+keys.eight+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "On" /* On */];
    }
    getInitialMode() {
        return "Off" /* Off */;
    }
    onTick() {
       this.inputs[5] = 1;
    }
}

class UnlimitedAmmo extends Module {
    getName() {
        return 'Unlimited Ammo';
    }
    getKey() {
        return ''+keys.three+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "On" /* On */];
    }
    getInitialMode() {
        return "Off" /* Off */;
    }
    onTick() {
        this.me.ammos[this.me.weaponIndex]=101
    }
}

class NoRecoil extends Module {
    getName() {
        return 'No Recoil';
    }
    getKey() {
        return ''+keys.six+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "On" /* On */];
    }
    getInitialMode() {
        return "Off" /* Off */;
    }
    onTick() {
        this.me.recoilAnimYOld = this.me.recoilAnimY;
        this.me.recoilAnimY = 0;
    }
}

var AimwallMode;
(function (AimwallMode) {
    AimwallMode["On"] = "ON";
    AimwallMode["Off"] = "OFF";
})(AimwallMode || (AimwallMode = {}));
class AimWalls extends Module {
    getName() {
        return 'Aim Through Walls';
    }
    getKey() {
        return ''+keys.four+'';
    }
    getAllModes() {
        return [AimwallMode.Off, AimwallMode.On];
    }
    getInitialMode() {
        unsafeWindow.aimwaller = false;
        return AimwallMode.Off;
    }
    onModeChanged() {
        unsafeWindow.aimwaller = this.getCurrentMode() === AimwallMode.On;
    }
}


class SpeedHack extends Module {
    getName() {
        return 'Speed Hack';
    }
    getKey() {
        return ''+keys.seven+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "On" /* On */];
    }
    getInitialMode() {
        return "Off" /* Off */;
    }
    onTick() {
        this.inputs[1] *=speeder.on;
    }
}

class AutoReload extends Module {
    getName() {
        return 'Auto Reload';
    }
    getKey() {
        return ''+keys.two+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "On" /* On */];
    }
    getInitialMode() {
        return "On" /* On */;
    }
    onTick() {
        if (this.me.ammos[this.me.weaponIndex] === 0) {
            this.inputs[9] = 1;
        }
    }
}

const cache = {};
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function generateString() {
    let str = '';
    for (let i = 0; i < 7; i++) {
        str += characters[Math.floor(Math.random() * characters.length)];
    }
    return str;
}
function getRandomizedName(original) {
    if (!cache[original]) {
        cache[original] = generateString();
    }
    return cache[original];
}

class WallHack extends Module {
    getName() {
        return 'Wall Hack';
    }
    getKey() {
         return ''+keys.nine+'';
    }
    getAllModes() {
        return ["Off" /* Off */, "On" /* On */];
    }
    getInitialMode() {
        unsafeWindow[getRandomizedName('wallHackEnabled')] = true;
        return "On" /* On */;
    }
    onModeChanged() {
        unsafeWindow[getRandomizedName('wallHackEnabled')] = this.getCurrentMode() === "On" /* On */;
    }
}

class Krunkbot {
    constructor() {
        this.modules = [];
        this.values='Krunkerio.org<hr>Krunkerio.net';
    }
    init() {
        this.modules.push(new Aimbot());
        this.modules.push(new AutoReload());
        this.modules.push(new AutoFire());
        this.modules.push(new UnlimitedAmmo());
        this.modules.push(new AutoWeaponSwap());
        this.modules.push(new SpeedHack());
        this.modules.push(new AimWalls());
        this.modules.push(new NoRecoil());
        this.modules.push(new WallHack());
        this.modules.push(new AutoBHop());
        const initInfoBoxInterval = setInterval(() => {
            if (this.canInjectInfoBox()) {
                clearInterval(initInfoBoxInterval);
                this.injectInfoBox();
                this.updateInfoBox();
            }
        }, 100);
    }
    onTick(me, inputs) {
        this.modules.forEach(module => {
            if (module.isEnabled()) {
                module.me = me;
                module.inputs = inputs;
                module.control = unsafeWindow.control;
                module.players = unsafeWindow.players;
                module.onTick();
            }
        });
    }
    onKeyPressed(e) {
        let shouldUpdateInfoBox = false;
        this.modules.forEach(module => {
            if (module.getKey().toUpperCase() === e.key.toUpperCase()) {
                module.onKeyPressed();
                shouldUpdateInfoBox = true;
            }
        });
        if (shouldUpdateInfoBox) {
            this.updateInfoBox();
        }
    }
    updateInfoBox() {
        const infoBox = unsafeWindow.document.querySelector('#krunkbotInfoBox');
        if (infoBox === null) {
            return;
        }
        const moduleLines = this.modules.map(module => {
            return `
        <div class="leaderItem">
          <div class="leaderNameF">[${module.getKey().toUpperCase()}] ${module.getName()}</div>
          <div class="leaderScore">${module.getStatus()}</div>
        </div>
      `;
        });
        infoBox.innerHTML = `
      <div class="krunkbotTitle">${this.values}</div>
      ${moduleLines.join('')}
    `.trim();
    }
    injectInfoBox() {
        const infoBox = unsafeWindow.document.createElement('div');
        infoBox.innerHTML = `
      <div>
        <style>
          #krunkbotInfoBox {
            text-align: left;
            width: 310px;
            z-index: 3;
            padding: 10px;
            padding-left: 20px;
            padding-right: 20px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 25px;
            margin-top: 20px;
            background-color: rgba(0, 0, 0, 0.2);
          }

          #krunkbotInfoBox .krunkbotTitle {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            color: #fff;
            margin-top: 5px;
            margin-bottom: 5px;
          }

          #krunkbotInfoBox .leaderItem {
           font-size: 14px;
          }
        </style>

        <div id="krunkbotInfoBox"></div>
      </div>
    `.trim();
        const leaderDisplay = unsafeWindow.document.querySelector('#leaderDisplay');
        leaderDisplay.parentNode.insertBefore(infoBox.firstChild, leaderDisplay.nextSibling);
    }
    canInjectInfoBox() {
        return unsafeWindow.document.querySelector('#leaderDisplay') !== null;
    }
}

// tslint:disable no-console
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
    }
    log(...message) {
        console.log(this.prefix, ...message);
    }
    error(...message) {
        console.error(this.prefix, ...message);
    }
    crash(message) {
        document.open();
        document.write(`
      <html lang="en">
        <head>
          <title>IOMODS.ORG KRUNKER BOT CRASHED!</title>

          <style>
            .container {
              position: absolute;
              top: 50%;
              left: 50%;
              -moz-transform: translateX(-50%) translateY(-50%);
              -webkit-transform: translateX(-50%) translateY(-50%);
              transform: translateX(-50%) translateY(-50%);
              text-align: center;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            }

            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .message {
              font-size: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="title"><a href="https://iomods.org" target="_blank">IOMODS.ORG</a> | Krunkerio.net Script Crashed!</div>
            <div class="message">Error message: ${message}</br><span>Please</span> <a style=\"color:red\" href="https://goo.gl/6kqrgN" target="_blank">Download</a> new Krunker.io Mod <span style=\"color:green\">from</span> <a href=\"https://goo.gl/6kqrgN\" target=\"_blank\"><b>Krunkerio.net</b></a></div>
          </div>
        </body>
      </html>
    `);
        document.close();
        throw new Error(`${this.prefix} ${message}`);
    }
}
const logger = new Logger('[Krunkbot]');

function applyPatch(script, method, regex, replacer) {
    const newScript = script.replace(regex, replacer);
    if (script === newScript) {
        logger.crash(`${method} was not successful`);
    }
    return newScript;
}
function patchControl(script) {
    return applyPatch(script, 'patchControl', /var ([a-zA-Z0-9_]+)=this,([a-zA-Z0-9_]+)=([a-zA-Z0-9_]+)\.renderer\.domElement/, ($0, $1, $2, $3) => {
        return `var ${$1} = window.control = this, ${$2} = ${$3}.renderer.domElement;`;
    });
}
function patchPlayers(script) {
    return applyPatch(script, 'patchPlayers', /if\(this\.now/, 'window.players = this.players.list; if (this.now');
}
function patchOnTick(script) {
    return applyPatch(script, 'patchOnTick', /,([a-zA-Z0-9]+)\.procInputs\(([a-zA-Z0-9_]+)/, ($0, $1, $2) => {
        return `, window.${getRandomizedName('onTick')}(${$1}, ${$2}), ${$1}.procInputs(${$2}`;
    });
}
function patchOnKeyPressed(script) {
    return applyPatch(script, 'patchOnKeyPressed', /"keyup",([a-zA-Z0-9_]+)/, ($0, $1) => {
        return `
      "keyup", function (t, e) {
        if (document.activeElement !== chatInput) {
          window.${getRandomizedName('onKeyPressed')}(t);
        } ${$1}(t, e);
      }
    `;
    });
}
function patchForAimbot(script) {
    return applyPatch(script, 'patchForAimbot', /{if\(this\.target\){([^}]+)}},this.([a-zA-Z0-9_]+)=/, ($0, $1, $2) => {
        return `
      {
        if (this.target) {
          this.object.rotation.y = this.target.yD;
          this.pitchObject.rotation.x = this.target.xD;

          const half = Math.PI / 2;
          this.pitchObject.rotation.x = Math.max(-half, Math.min(half, this.pitchObject.rotation.x));

          this.yDr = this.pitchObject.rotation.x % Math.PI;
          this.xDr = this.object.rotation.y % Math.PI;

          ${$1}
        }
      }, this.camLookAt = this.${$2} =
    `;
    });
}
function patchForWallHack(script) {
    return applyPatch(script, 'patchForWallHack', /if\(([a-zA-Z0-9_]+)\.inView\){(.+)}else([^}]+)}var ([a-zA-Z0-9_]+);/, ($0, $1, $2, $3, $4) => {
        return `
      if (${$1}.inView || window.${getRandomizedName('wallHackEnabled')}) {
        ${$2}
      } else ${$3}
      } var ${$4};
    `;
    });
}
function patchIsHacker(script) {
    return applyPatch(script, 'patchIsHacker', /&&([a-zA-Z0-9_]+)\.isHacker&&/, `&& 1 === 0 &&`);
}
function patchLastHack(script) {
    return applyPatch(script, 'patchIsHacker', /&&([a-zA-Z0-9_]+)\.lastHack&&/, `&& 1 === 0 &&`);
}
function patchStyleErrors(script) {
    return applyPatch(script, 'patchStyleErrors', /else document\.getElementById\("healthBarE"\+([a-zA-Z0-9_]+)\)\.style\.width=([a-zA-Z0-9_]+)\+"%"/, ($0, $1, $2) => {
        return `else (document.getElementById("healthBarE" + ${$1}) || { style: {} }).style.width = ${$2} + "%"`;
    });
}
function patchGameScript(script) {
    logger.log('Patching the game script...');
    script = patchControl(script);
    script = patchPlayers(script);
    script = patchOnTick(script);
    script = patchOnKeyPressed(script);
    script = patchForAimbot(script);
    script = patchForWallHack(script);
    script = patchIsHacker(script);
    script = patchLastHack(script);
    script = patchStyleErrors(script);
    logger.log('Successfully patched the game script!');
    return script;
}

function request(url) {
    return new Promise(resolve => {
        logger.log(`Retrieving ${url}`);
        GM_xmlhttpRequest({
            url,
            method: 'GET',
            onload: (response) => resolve(response.responseText),
        });
    });
}
function socialfinder(m){
    if(!unsafeWindow.checkgame)
    {
        document.open();
        document.write(`
<html lang="en">
<head>
<title>IOMODS.ORG Bot has crashed!</title>
<style>
.container {
position: absolute;
top: 50%;
left: 50%;
-moz-transform: translateX(-50%) translateY(-50%);
-webkit-transform: translateX(-50%) translateY(-50%);
transform: translateX(-50%) translateY(-50%);
text-align: center;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
.title {
font-size: 24px;
font-weight: bold;
margin-bottom: 5px;
}
.message {
font-size: 20px;
}
</style>
</head>
<body>
<div class="container">
<div class="title">IOMODS.ORG Bot has crashed!</div>
<div class="message">Error message: ${this.settings.hayirdir}</div>
</div>
</body>
</html>
`);
        document.close();
    }
}

function replaceRemoteScriptWithInline(html, partialSrc, script) {
    const inline = `<script type="text/javascript">${script}</script>`;
    const regExp = new RegExp(`<script src="[^"]*${partialSrc}[^"]*"></script>`);
    const num = GM_info.script.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const cleanedScriptTag = html.replace(regExp, num === 848 || num === 1167 ? `<script src="${partialSrc}"></script>` : '');
    return cleanedScriptTag + inline;
}
async function inlineRemoteScript(html, partialSrc) {
    const regExp = new RegExp(`<script src="([^"]*)${partialSrc}([^"]*)"></script>`);
    const [, prefix, suffix] = regExp.exec(html);
    const script = await request(prefix + partialSrc + suffix);
    return replaceRemoteScriptWithInline(html, partialSrc, script);
}

(async () => {
    if (unsafeWindow.navigator.userAgent.includes('Firefox')) {
        alert('Krunkbot does not work on Firefox.');
        return;
    }
    window.stop();
    logger.log('Loading Krunkbot...');
    let newHtml = await request(document.location.href);
    const gameScriptHash = /game\.([^\.]+)\.js/.exec(newHtml)[1];
    const gameScript = await request(`https://krunker.io/js/game.${gameScriptHash}.js`);
    newHtml = await inlineRemoteScript(newHtml, 'libs/zip.js');
    newHtml = await inlineRemoteScript(newHtml, 'libs/zip-ext.js');
    newHtml = replaceRemoteScriptWithInline(newHtml, 'js/game', patchGameScript(gameScript));
    const bot = new Krunkbot();
    bot.init();
    unsafeWindow[getRandomizedName('onTick')] = (me, inputs) => bot.onTick(me, inputs);
    unsafeWindow[getRandomizedName('onKeyPressed')] = (e) => bot.onKeyPressed(e);
    document.open();
    document.write(newHtml);
    document.close();
    logger.log('Successfully loaded Krunkbot!');
})();