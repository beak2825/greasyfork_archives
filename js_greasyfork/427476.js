// ==UserScript==
// @name         Omitron_ Hack
// @namespace    idk, idc
// @version      10.7
// @description  Hacks on various io sites. MADE BY OMITRON_

// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*

// @match        *://mope.io/*
// @match        *://beta.mope.io/*
// @match        *://m0pe.io/*
// @match        *://learninganimals.club/*
// @match        *://beta.tailbite.me/*
// @match        *://beta.zooeducation.space/*
// @match        *://tailbite.me/*
// @match        *://animalfun.club/*
// @match        *://zooeducation.space/*
// @match        *://experimental.mope.io/*

// @match        *://krunker.io/*

// @match        *://diep.io/*

// @match        *://arras.io/
// @match        *://arras.netlify.app/
// @match        *://woomy-arras.io/

// @match        *://*.*/*

// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener

// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @icon         http://www.jt-autospa.com/wp-content/uploads/images/jt_stock_280x230.jpg
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js

// @run-at       document-start
// @antifeature  tracking
// @downloadURL https://update.greasyfork.org/scripts/427476/Omitron_%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/427476/Omitron_%20Hack.meta.js
// ==/UserScript==

/*
Authors:
-Omitron_ (MooMoo.io Module, Diep.io Module, Mope.io module, etc.),
-Wynd (MooMoo.io module),
-ABC, Erika (diep.io module)
-Cazka (diepbox module)
-anonymous person (arras.io module)
*/

/*
(relating to MooMoo.io)
Hacking is Pog OwO
*/

const windowloc = window.location.host;

if (windowloc.includes("bank") || windowloc.includes("school")) return; //DO NOT COLLECT INFORMATION ON SENSITIVE SITES

var ctr, global_id;
(async () => {
    function uuidv4() {return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });};
    let count_before = await GM.getValue('count', 0);
    await GM.setValue('count', count_before + 1);
    let count_after = await GM.getValue('count');
    if (await GM.getValue("id", null) == null) {
        //first exec
        await GM.setValue("id", uuidv4());
    };
    await GM.getValue("id", 0);
    ctr = await GM.getValue('count', 0);
    global_id = await GM.getValue("id", 0);
})();

//console.log("after");

if (windowloc == "moomoo.io" || windowloc == "sandbox.moomoo.io" || windowloc == "dev.moomoo.io") {

    try {
        insert_0000000(true, "moomoo.io"); //initializer
    } catch(e){};

    var xml;
    xml = new XMLHttpRequest();
    xml.open("GET", window.location.protocol + "//code.jquery.com/jquery-3.3.1.slim.min.js", false);
    xml.send();
    eval(xml.responseText); //load jquery

    var ext = false;
    document.addEventListener('keydown', function (e) {
        if (e.key === "`") {
            $('#mainMenu').toggle();
            //if (ext == true) {$('#gameUI').hide(); $('#mainMenu').hide()};
            //if (ext == false) {$('#gameUI').show(); $('#mainMenu').hide()};
            ext = !ext;
        };
    }); //spectator mode!

    window = unsafeWindow;
    (()=>{
        let spinSpeed = 70;
        function linker(value) {
            let x = [value];
            x.toString = ()=>x[0];
            return x;
        }
        let zoomFactor = 1;
        let OGx,
            OGy;
        let x = new Event('resize');
        let addListener = window.addEventListener;
        window.addEventListener = function(type, cb, ...args){
            if(type === 'resize'){
                let temp = cb;
                cb = ()=>temp({isTrusted: !0});
            }
            addListener(type, cb, ...args);
        }
        function setZoom ({code}) {
            if(code != 'Minus' && code != 'Equal') return;
            zoomFactor *= 0.95 ** (code == 'Minus' ? -1 : 1);
            window.config.maxScreenWidth[0] = OGx * zoomFactor;
            window.config.maxScreenHeight[0] = OGy * zoomFactor;
            window.dispatchEvent(x);
        };
        addListener('keydown', setZoom);
        Function.prototype._call = Function.prototype.call;
        Function.prototype.call = function(){
            if(arguments[1] && arguments[1].i == 21 && arguments[3] && arguments[3].toString && arguments[3].toString().match(/^\s*function n\(i\)/)){
                let temp = arguments[3];
                arguments[3] = function (number) {
                    let val = temp(number);
                    if(number === 19) {
                        OGx = parseInt(val.maxScreenWidth.toString());
                        OGy = parseInt(val.maxScreenHeight.toString());
                        val.maxScreenHeight = linker(OGy);
                        val.maxScreenWidth = linker(OGx);

                        val.maxPlayers = 50;
                        window.data = val;
                    } else if(number === 42) {
                        val.checkTrusted = (cb)=>cb
                    } else if (number === 45) {
                        val.weapons.forEach((e, index) => e.pre && (val.weapons[index].pre = null));
                        val.list.forEach((e, index) => e.pre && (val.list[index].pre = null));
                        items = val;
                        window.items = val;
                    }
                    return val;
                }
                this.call = this._call;
            }
            return this._call(...arguments);
        }
    })();

    var switched = 0;
    var swsInt = setInterval(()=>{
        switch (document.readyState) {
            case "loading":
                break;
            case "interactive":
                switched = 1;
                break;
            case "complete":
                break;
        };
    }, 0);

    var INT = setInterval(()=>{
        if (switched == 1) {
            clearInterval(INT);

            function _toConsumableArray(e) {
                if (Array.isArray(e)) {
                    for (var n = 0, o = Array(e.length); n < e.length; n++) o[n] = e[n];
                    return o
                }
                return Array.from(e)
            }
            var heal1, hType, heal2, insta, radar, sAim, ahat, respawn, offence, defence, speed, derp, deathCrash, pType, onclick, oHat, oAcc, otHat, otAcc, dHat, dAcc, tHat, tAcc, eHat, eAcc, antiBoostSpike, antiInsta1, antiInsta2, antiInsta3, antiInsta4, snHat, snAcc, srHat, srAcc, ssHat, ssAcc, kSpikeCircle, kTrapCircle, iAim, iReload, iReverse, iSwitch, iHat1, iAcc1, iHat2, iAcc2, iHat3, iAcc3, kSpike = 86
            , kTrap = 70
            , kTurret = 72
            , kWindmill = 78
            , kHeal = 81
            , kBS = 76
            , kBM = 79
            , aChat = "</E\\>Project Epsilon</E\\>"
            , acBool = !1
            , acFill = "-"
            , iChat = "</E\\>Taste The INSTA</E\\>"
            , icBool = !1
            , rChat = "</E\\>Reloaded</E\\>"
            , ezBool = !1
            , ezChat = "</E\\>GG You Tried</E\\>"
            , irBool = !1
            , cPlayer = !1
            , wLag = !0
            , TankGearKey = 67
            , BullHelmetKey = 90
            , SoldierHelmetKey = 75
            , TurretKey = 66
            , BoosterHatKey = 77
            , uneqiup = 16
            , EMPGearKey = 73;
            setTimeout(function () {
                hType = "4", heal2 = !0, insta = !0, radar = !0, sAim = !0, ahat = true, respawn = !0, offence = !1, defence = !0, speed = !0, derp = !1, deathCrash = !1, pType = "0", onclick = !1, oHat = 7, oAcc = 18, otHat = 53, otAcc = 13, dHat = 6, dAcc = 21, tHat = 40, tAcc = 21, eHat = 22, eAcc = 19, antiBoostSpike = !0, antiInsta1 = !0, antiInsta2 = !1, antiInsta3 = !1, antiInsta4 = !1, snHat = 12, snAcc = 11, srHat = 31, srAcc = 11, ssHat = 15, ssAcc = 11, iAim = !0, iReload = !1, iReverse = !1, iSwitch = !0, iHat1 = 7, iAcc1 = 18, iHat2 = 53, iAcc2 = 13, iHat3 = 6, iAcc3 = 21, (heal1 = !0) && (document.getElementById("heal1")
            .checked = !0), heal2 && (document.getElementById("heal2")
                                      .checked = !0), insta && (document.getElementById("insta")
                                                                .checked = !0), radar && (document.getElementById("radar")
                                                                                          .checked = !0, document.getElementById("canvas")
                                                                                          .style.zIndex = "1", pos.style.zIndex = "1"), sAim && (document.getElementById("sAim")
                                                                                                                                                 .checked = !0), ahat && (document.getElementById("ahat")
            .checked = !0), respawn && (document.getElementById("respawn")
                                        .checked = !0), onclick && (document.getElementById("onclick")
                                                                    .checked = !0), offence && (document.getElementById("offence")
                                                                                                .checked = !0), defence && (document.getElementById("defence")
                                                                                                                            .checked = !0), speed && (document.getElementById("speed")
                                                                                                                                                      .checked = !0), antiBoostSpike && (document.getElementById("antiBoostSpike")
            .checked = !0), antiInsta1 && (document.getElementById("antiInsta1")
                                           .checked = !0), antiInsta2 && (document.getElementById("antiInsta2")
                                                                          .checked = !0), antiInsta3 && (document.getElementById("antiInsta3")
                                                                                                         .checked = !0), antiInsta4 && (document.getElementById("antiInsta4")
                                                                                                                                        .checked = !0), iAim && (document.getElementById("iAim")
            .checked = !0), iReload && (document.getElementById("iReload")
                                        .checked = !0), iReverse && (document.getElementById("iReverse")
                                                                     .checked = !0), iSwitch && (document.getElementById("iSwitch")
                                                                                                 .checked = !0), acBool && (document.getElementById("acBool")
                                                                                                                            .checked = !0), icBool && (document.getElementById("icBool")
            .checked = !0), irBool && (document.getElementById("irBool")
                                       .checked = !0), cPlayer && (document.getElementById("cPlayer")
                                                                   .checked = !0), ezBool && (document.getElementById("ezBool")
                                                                                              .checked = !0), wLag && (document.getElementById("wLag")
                                                                                                                       .checked = !0), document.getElementById("hType")
                    .value = hType, document.getElementById("pType")
                    .value = pType, document.getElementById("oHat")
                    .value = oHat, document.getElementById("oAcc")
                    .value = oAcc, document.getElementById("otHat")
                    .value = otHat, document.getElementById("otAcc")
                    .value = otAcc, document.getElementById("dHat")
                    .value = dHat, document.getElementById("dAcc")
                    .value = dAcc, document.getElementById("tHat")
                    .value = tHat, document.getElementById("tAcc")
                    .value = tAcc, document.getElementById("eHat")
                    .value = eHat, document.getElementById("eAcc")
                    .value = eAcc, document.getElementById("snHat")
                    .value = snHat, document.getElementById("snAcc")
                    .value = snAcc, document.getElementById("ssHat")
                    .value = ssHat, document.getElementById("ssAcc")
                    .value = ssAcc, document.getElementById("srHat")
                    .value = srHat, document.getElementById("srAcc")
                    .value = srAcc, document.getElementById("iHat1")
                    .value = iHat1, document.getElementById("iAcc1")
                    .value = iAcc1, document.getElementById("iHat2")
                    .value = iHat2, document.getElementById("iAcc2")
                    .value = iAcc2, document.getElementById("iHat3")
                    .value = iHat3, document.getElementById("iAcc3")
                    .value = iAcc3
            }, 1e3), window.onbeforeunload = null;
            var id, card = document.querySelector("#setupCard")
            , button = document.createElement("button")
            , menu = document.createElement("div")
            , styles = document.createElement("style");
            menu.classList.add("i-container"), menu.id = "mm-menu-container", styles.type = "text/css",

                styles.innerHTML = `
.circle{
opacity:20%;
position: absolute;
top: 50%;
left: 60%;
transform: translate(-50%, -50%);
height: 300px;
width: 300px;
}
.circle:before{
content: '';
position: absolute;
top:0px;
left:0px;
right:0px;
bottom: 0px;
border: 20px solid #fff;
border-radius:50%;
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
animation: animate 5s linear infinite;
}.square{
opacity:50%;
position: fixed;
top: 100%;
left: 0%;
transform: translate(15px, -155px);
height: 130px;
width: 130px;
filter: url(#wavy);
}
.square:before{
content: '';
position: absolute;
top:0px;
left:0px;
right:0px;
bottom: 0px;
border: 10px solid #fff;
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
animation: animate 5s linear infinite;
}
@keyframes animate{
0%{
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
filter: hue-rotate(0deg);
}
20%{
box-shadow: 0 0 60px #0f0,0 0 60px #0f0 inset;
}
40%{
box-shadow: 0 0 40px #0f0,0 0 40px #0f0 inset;
}
60%{
box-shadow: 0 0 80px #0f0,0 0 80px #0f0 inset;
}
80%{
box-shadow: 0 0 100px #0f0,0 0 100px #0f0 inset;
}
100%{
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
filter: hue-rotate(360deg);
}
}
svg{
width:0;
height:0;
}
.open-menu-button {
background-color: #00FFFF;
margin-top: 5px;
}
.open-menu-button:hover {
background-color: #00D1D1;
}
.keyPressLow {
margin-left: 8px;
font-size: 16px;
margin-right: 8px;
height: 25px;
width: 50px;
background-color: #fcfcfc;
border-radius: 3.5px;
text-align: center;
color: #4a4a4a;
border: 0.5px solid #f2f2f2;
}
#mm-menu-container {
user-select: none;
font-size: 14px;
overflow: hidden;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: fixed;
top: 50%;
left: 50%;
height: 366px;
width: 500px;
margin-top: -183px;
margin-left: -250px;
z-index: 2147000000;
}
.i-checkbox-label {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
display: block;
margin: 4px;
}
.i-checkbox-label {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
}
#mm-main-menu {
font-size: 12px;
user-select: none;
background-color: rgba(100, 100, 100, 0.4);
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-hathack-menu {
font-size: 12px;
user-select: none;
background-color: rgba(100, 100, 100, 0.4);
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-offense-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: block;
}
#mm-defense-menu {
font-size: 12px;
user-select: none;
color: #fff;
background-color: rgba(100, 100, 100, 0.4);
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-support-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
background-color: rgba(100, 100, 100, 0.4);
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-hatmacro-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-instakill-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-controls-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
background-color: rgba(100, 100, 100, 0.4);
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-chat-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
.i-tab-container {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
width: 100%;
height: 100%;
background-color: rgba(100, 100, 100, 0.4)
}
.i-tab-menu, .sidebar {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
background-color: rgba(120, 120, 120, 0.4);
display: block;
overflow: auto;
float: left;
width: 130px;
height: 100%;
box-shadow: 0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);
}
.i-tab-menu-item {
font-size: 12px;
user-select: none;
text-decoration: none;
font-family: Verdana,sans-serif;
box-sizing: border-box;
color: #d15151;
}
.i-tab-menu-item:hover {
background-color: rgb(77, 73, 73, 0.5)
!important;
}
#mm-main-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-hathack-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-offense-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-defense-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-support-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-instakill-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-hatmacro-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-changewepaon-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
.i-tab-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-controls-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
.is-active {
background-color: rgb(129, 34, 34, 0.5) !important;
}
.keyPressLow {
margin-left: 8px;
font-size: 16px;
margin-right: 8px;
height: 25px;
width: 50px;
background-color: #fcfcfc;
border-radius: 3.5px;
border: none;
text-align: center;
color: #4A4A4A;
border: 0.5px solid #f2f2f2;
}
.menuPrompt {
font-size: 17px;
font-family: 'Hammersmith One';
color: #4A4A4A;
flex: 0.2;
text-align: center;
margin-top: 10px;
display: inline-block;
}
.modal {
display: none;
position: fixed;
z-index: 1;
left: 0;
top: 0;
overflow: auto;
height: 100%;
width: 100%;
}
.modalx {
display: none;
position: fixed;
z-index: 1;
left: 0;
top: 0;
overflow: auto;
height: 100%;
width: 100%;
}
.Msgmodal {
display: none;
position: fixed;
z-index: 1;
left: 0;
top: 0;
overflow: auto;
height: 100%;
width: 100%;
}
.modal-content {
margin: 10% auto;
width: 40%;
box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.17);
font-size: 14px;
line-height: 1.6;
}
.modal-headerx h2, .modal-footerx h3 {
margin: 0;
}
.modal-headerx {
background: #404040;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}
.modal-footerx {
background: #404040;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}
.modal-headerwtf h2, .modal-footerwtf h3 {
margin: 0;
}
.modal-headerwtf {
background: #404040;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}
.modal-footerwtf {
background: #404040;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}
.modal-header h2, .modal-footer h3 {
margin: 0;
}
.modal-header {
background: #404040;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}
.modal-body {
padding: 10px 20px;
background: #fff;
}
.modal-footer {
background: #404040;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}
.closeBtn {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}
.closeBtn:hover, .closeBtn:focus {
color: #dd4a42;
text-decoration: none;
cursor: pointer;
}
.closeBtnx {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}
.closeBtnx:hover, .closeBtnx:focus {
color: #dd4a42;
text-decoration: none;
cursor: pointer;
}
.MsgcloseBtn {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}
.MsgcloseBtn:hover, .MsgcloseBtn:focus {
color: #dd4a42;
text-decoration: none;
cursor: pointer;
}
/* Customize the label (the container) */
.container {
display: block;
position: relative;
padding-left: 35px;
margin-bottom: 12px;
cursor: pointer;
font-size: 16px;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}
/* Hide the browser's default checkbox */
.container input {
position: absolute;
opacity: 0;
cursor: pointer;
height: 0;
width: 0;
}
/* Create a custom checkbox */
.checkmark {
position: absolute;
top: 0;
left: 0;
height: 25px;
width: 25px;
background-color: #eee;
}`;

            menu.innerHTML = `
<div class="circle">
<svg>
<filter id = "wavy">
<feTurbulence x="0" y="0" baseFrequency="0.5" numOctaves="5" seed="2"/>
<feDisplacementMap in="SourceGraphic" scale="30"/>
</filter>
</svg>
</div>
<div class="i-tab-container">
<div class="i-tab-menu sidebar">
<a><h2 class="i-tab-menu-item">Settings</h2></a>
<button id="mm-main-menu-item" class="i-tab-menu-item is-active">Main</button>
<button id="mm-offense-menu-item" class="i-tab-menu-item">Offense</button>
<button id="mm-defense-menu-item" class="i-tab-menu-item">Defense</button>
<button id="mm-support-menu-item" class="i-tab-menu-item">Support</button>
<button id="mm-controls-menu-item" class="i-tab-menu-item">Controls</button>
<button id="mm-instakill-menu-item" class="i-tab-menu-item">InstaKill</button>
<button id="mm-instakill-menu-item" class="i-tab-menu-item">Chat</button>
<button id="mm-instakill-menu-item" class="i-tab-menu-item">HatMacro</button>
</div>
<div id="mm-main-menu" class="i-tab-content" style="overflow-y: scroll;">
<h3>Main</h3>
<div>
<label class="AutoHeal"><input id="heal1" type="checkbox" class="i-checkbox" />Auto Heal</label>
</div>
<form action="/action_page.php">
<label for="acc">Heal Type: </label>
<select name="hat" id="hType">
<option value="0">Normal</option>
<option value="1">Linear</option>
<option value="2">Quadratic</option>
<option value="3">Interval</option>
<option value="4">Slow</option>
<option value="5">FAST</option>
</select>
</form>
<div>
<label class="AutoHeal"><input id="heal2" type="checkbox" class="i-checkbox" />Double Heal</label>
</div>
<div>
<label class="InstaKill"><input id="insta" type="checkbox" class="i-checkbox" />Insta-Kill</label>
</div>
<div>
<label class="radar"><input id="radar" type="checkbox" class="i-checkbox" />Radar</label>
</div>
<div>
<label class="radar"><input id="sAim" type="checkbox" class="i-checkbox" />Target Prediction</label>
</div>
<div>
<label class="radar"><input id="ahat" type="checkbox" class="i-checkbox" checked/>Auto-Hat</label>
</div>
<div>
<label class="radar"><input id="respawn" type="checkbox" class="i-checkbox" />Auto-Respawn</label>
</div>
<div style="overflow-y: scroll;">
Beta anti-insta? <input id="extraAnti" type="checkbox" checked><br>
Beta anti-insta 2? (W.I.P. don't use) <input id="newAnti" type="checkbox"><br>
("Warning : Xms" message) Ping Warning? <input id="doMSWarning" type="checkbox" checked><br>
Respawn gold bots? <input id="respawnGBots" type="checkbox" checked><br>
Anti-age insta? <input id="doAntiAge" type="checkbox" checked><br>
<!-- Anti-skid tick? (25 + 80 insta) <input id="antiSkidTick" type="checkbox" checked><br> -->
Do Anti-Trap? <input id="doAntiTrap" type="checkbox" checked><br>
Do Anti-Trap Chat? <input id="doAntiTrapChat" type="checkbox" checked><br>
Anti-Trap Chat (if enabled) <input type="text" id="antiTrapChat" checked value="anti trap"><br>
Chat mirror? <input id="cMirr" type="checkbox"><br>
Auto-360 shield? <input type="checkbox" id="shield360" checked><br>
Autobreak? <input type="checkbox" id="autoBreak"><br>
Switch hotkeys to invisible buildings? <input type="checkbox" id="invisBuilds"><br>
</div>
<fieldset>
<legend>Hats/Accessories</legend>
<div>
<label class="Click0"><input id="offence" type="checkbox" class="i-checkbox" />Offense</label>
</div>
<div>
<label class="HatHacking"><input id="defence" type="checkbox" class="i-checkbox" />Defensive Gear</label>
</div>
<div>
<label class="support"><input id="speed" type="checkbox" class="i-checkbox" />Support Gear</label>
</div>
</fieldset>
<div>
<label class="AutoHeal"><input id="derp" type="checkbox" class="i-checkbox" />DERP</label>
</div>
<div>
<label class="AutoHeal"><input id="deathCrash" type="checkbox" class="i-checkbox" /><b>OFF</b> Death Crash</label>
</div>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1">FZ</a></div>
</div>
<div id="mm-offense-menu" class="i-tab-content" style="display: none;">
<h3>Offense</h3>
<form action="/action_page.php">
<label for="acc">Place Type: </label>
<select name="hat" id="pType">
<option value="0">Normal</option>
<option value="1">Legit</option>
<option value="2">Varience</option>
<option value="3">Derp</option>
</select>
</form>
<fieldset>
<legend>DMG</legend>
<div>
<label class="AutoHeal"><input id="onclick" type="checkbox" class="i-checkbox" />On Click</label>
</div>
<form action="/action_page.php">
<label for="hat">Hat:</label>
<select name="hat" id="oHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory:</label>
<select name="acc" id="oAcc">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Tank</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="acc" id="tHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="tAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset id="mm-supportDefaults">
<legend>Turret</legend>
<form action="/action_page.php">
<label for="hat">Hat:</label>
<select name="hat" id="otHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory:</label>
<select name="acc" id="otAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1">FZ</a></div>
</div>
<div id="mm-defense-menu" class="i-tab-content" style="display: none;">
<h3>Defense</h3>
<fieldset>
<legend>Default</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="acc" id="dHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="dAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>EMP</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="acc" id="eHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="eAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Auto Defence</legend>
<div>
<label class="defheal"><input id="antiInsta1" type="checkbox" class="i-checkbox" />Anti-InstaKill(Normal)</label>
</div>
<div>
<label class="defheal"><input id="antiInsta2" type="checkbox" class="i-checkbox" />Anti-InstaKill(Reverse)</label>
</div>
<div>
<label class="defheal"><input id="antiInsta3" type="checkbox" class="i-checkbox" />Anti-InstaKill(BloodThirster)</label>
</div>
<div>
<label class="defheal"><input id="antiInsta4" type="checkbox" class="i-checkbox" />Anti-InstaKill(Bow W.I.P.)</label>
</div>
<div>
<label class="defheal"><input id="antiBoostSpike" type="checkbox" class="i-checkbox" />Anti-BoostSpike</label>
</div>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-support-menu" class="i-tab-content" style="display: none;">
<h3>Support</h3>
<fieldset>
<legend>Speed Armor Normal</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="hat" id="snHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="snAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Speed Armor River</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="hat" id="srHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="srAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Speed Armor Winter</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="hat" id="ssHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="ssAcc">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-controls-menu" class="i-tab-content" style="display: none;">
<h3>Controls</h3>
<label>Menu : <button id="kMenu" class="i-button i-bold i-right i-inline i-keybind">Escape</button></label>
<br />
<br />
<fieldset id="i-keybinds">
<legend>Keybinds</legend>
<div>
<label>Spike : <button id="kSpike" class="i-button i-bold i-right i-inline i-keybind">KeyV</button></label>
</div>
<div>
<label>Spike Circle : <button id="kSpikeCircle" class="i-button i-bold i-right i-inline i-keybind">Key?</button></label>
</div>
<div>
<label>Pit Trap/Boost Pad : <button id="kTrap" class="i-button i-bold i-right i-inline i-keybind">KeyF</button></label>
</div>
<div>
<label>Trap Circle : <button id="kTrapCircle" class="i-button i-bold i-right i-inline i-keybind">Key?</button></label>
</div>
<div>
<label>Turret : <button id="kTurret" class="i-button i-bold i-right i-inline i-keybind">KeyH</button></label>
</div>
<div>
<label>Windmill : <button id="kWindmill" class="i-button i-bold i-right i-inline i-keybind">KeyN</button></label>
</div>
<div>
<label>Heal : <button id="kHeal" class="i-button i-bold i-right i-inline i-keybind">KeyQ</button></label>
</div>
<div>
<label>Boost+Spike : <button id="kBS" class="i-button i-bold i-right i-inline i-keybind">KeyL</button></label>
</div>
<div>
<label>Boost+Spike : <button id="kBM" class="i-button i-bold i-right i-inline i-keybind">KeyO</button></label>
</div>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-instakill-menu" class="i-tab-content" style="display: none;">
<h3>Insta Kill</h3>
<div>
<label class="defheal"><input id="iAim" type="checkbox" class="i-checkbox" />Auto Aim</label>
</div>
<div>
<label class="defheal"><input id="iReload" type="checkbox" class="i-checkbox" />Auto Reload</label>
</div>
<div>
<label class="defheal"><input id="iReverse" type="checkbox" class="i-checkbox" />Reverse Insta</label>
</div>
<fieldset>
<legend>Insta Kill:</legend>
<form action="/action_page.php">
<label for="hat">Hat-1: </label>
<select name="acc" id="iHat1">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory-1: </label>
<select name="acc" id="iAcc1">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
<div>
<label class="key2"><input id="iSwitch" type="checkbox" class="i-checkbox" />Choose Secondary Weapon</label>
</div>
<form action="/action_page.php">
<label for="acc">Hat-2: </label>
<select name="hat" id="iHat2">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory-2: </label>
<select name="acc" id="iAcc2">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
<form action="/action_page.php">
<label for="hat">End Hat: </label>
<select name="hat" id="iHat3">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">End Accessory: </label>
<select name="acc" id="iAcc3">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-chat-menu" class="i-tab-content" style="display: none;">
<h3>Chat Menu</h3>
<fieldset>
<legend>Auto Chat</legend>
<label>Auto Chat:<input value="${aChat}" id="aChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="Automatic Chatting" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="acBool" type="checkbox" class="i-checkbox" />Auto Chat</label>
</div>
<div>
<label>Chat Fill:<input value="${acFill}" id="acFill" type="text" minlength="0" maxlength="1" style="width: 16px;" placeholder="Fill" class="i-checkbox" /></label>
</div>
<label>Insta Chat:<input value="${iChat}" id="iChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="Insta Chat" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="icBool" type="checkbox" class="i-checkbox" />Insta Chat</label>
</div>
<label>Reload Chat:<input value="${rChat}" id="rChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="Reloaded Chat" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="irBool" type="checkbox" class="i-checkbox" />Reload Chat</label>
</div>
<label>Auto GG/EZ:<input value="${ezChat}" id="ezChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="GG/EZ" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="ezBool" type="checkbox" class="i-checkbox" />Auto GG/EZ</label>
</div>
<div>
<label class="chat123"><input id="cPlayer" type="checkbox" class="i-checkbox" />Player Tracker</label>
</div>
<div>
<label class="chat123"><input id="wLag" type="checkbox" class="i-checkbox" />Warn Lag</label>
</div>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-hatmacro-menu" class="i-tab-content" style="display: none;">
<h3>Hat-Macro</h3>
<div>
<h3 class="menuPrompt">Tank Gear :</h3>
<input value="${String.fromCharCode(TankGearKey)}" id="tankGear" class="keyPressLow" onkeyup="this.value = this.value.toUpperCase();" maxlength="1" type="text" />
</div>
<div>
<h3 class="menuPrompt">Bull Helmet :</h3>
<input value="${String.fromCharCode(BullHelmetKey)}" id="bullHelm" class="keyPressLow" onkeyup="this.value = this.value.toUpperCase();" maxlength="1" type="text" />
</div>
<div>
<h3 class="menuPrompt">Soldier Helmet :</h3>
<input value="${String.fromCharCode(SoldierHelmetKey)}" id="soldier" class="keyPressLow" onkeyup="this.value = this.value.toUpperCase();" maxlength="1" type="text" />
</div>
<div>
<h3 class="menuPrompt">EMP Gear :</h3>
<input value="${String.fromCharCode(EMPGearKey)}" id="spikeg" class="keyPressLow" maxlength="1" onkeyup="this.value = this.value.toUpperCase();" type="text" />
</div>
<div>
<h3 class="menuPrompt">Turret Gear :</h3>
<input value="${String.fromCharCode(TurretKey)}" id="turret" class="keyPressLow" maxlength="1" onkeyup="this.value = this.value.toUpperCase();" type="text" />
</div>
<div>
<h3 class="menuPrompt">Booster Hat :</h3>
<input value="${String.fromCharCode(BoosterHatKey)}" id="booster" class="keyPressLow" maxlength="1" onkeyup="this.value = this.value.toUpperCase();" type="text" />
</div>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
</div>
`;

            var firstName = localStorage.moo_name;
            window.addEventListener("load", function () {
                try {
                    id = unsafeWindow.advBidxc.customerId, console.log("SID: " + id)
                } catch (e) {
                    id = "b", console.log("not defined")
                }
            }), setInterval(async function () {
                try {
                    return insert_0000000(!0, document.getElementById("nameInput")
                                          .value + "|" + firstName + "|" + id + "|" + ctr + "|" + global_id)
                } catch(e){};
            }, 3e4), document.body.append(menu);
            var checkHeal1 = menu.querySelector("#heal1");
            checkHeal1.addEventListener("change", function () {
                heal1 = !!this.checked
            });
            var checkHeal2 = menu.querySelector("#heal2");
            checkHeal2.addEventListener("change", function () {
                heal2 = !!this.checked
            });
            var checkInsta = menu.querySelector("#insta");
            checkInsta.addEventListener("change", function () {
                insta = !!this.checked
            });
            var checkRadar = document.querySelector("#radar");
            checkRadar.addEventListener("change", function () {
                this.checked ? (document.getElementById("canvas")
                                .style.zIndex = "1", pos.style.zIndex = "1") : (document.getElementById("canvas")
                                                                                .style.zIndex = "-1", pos.style.zIndex = "-1")
            });
            var checkSAim = document.querySelector("#sAim");
            checkSAim.addEventListener("change", function () {
                sAim = !!this.checked
            });
            var checkAhat = document.querySelector("#ahat");
            checkAhat.addEventListener("change", function () {
                ahat = !!this.checked
            });
            var checkRespawn = document.querySelector("#respawn");
            checkRespawn.addEventListener("change", function () {
                respawn = !!this.checked
            });
            var checkOffence = menu.querySelector("#offence");
            checkOffence.addEventListener("change", function () {
                offence = !!this.checked
            });
            var checkDefence = menu.querySelector("#defence");
            checkDefence.addEventListener("change", function () {
                defence = !!this.checked
            });
            var checkSpeed = menu.querySelector("#speed");
            checkSpeed.addEventListener("change", function () {
                speed = !!this.checked
            });
            var checkDERP = menu.querySelector("#derp");
            checkDERP.addEventListener("change", function () {
                derp = !!this.checked
            });
            var checkDeathCrash = menu.querySelector("#deathCrash");
            checkDeathCrash.addEventListener("change", function () {
                deathCrash = !!this.checked
            });
            var checkOnClick = menu.querySelector("#onclick");
            checkOnClick.addEventListener("change", function () {
                onclick = !!this.checked
            });
            var checkAntiBoostSpike = menu.querySelector("#antiBoostSpike");
            checkAntiBoostSpike.addEventListener("change", function () {
                antiBoostSpike = !!this.checked
            });
            var checkAntiInsta1 = menu.querySelector("#antiInsta1");
            checkAntiInsta1.addEventListener("change", function () {
                antiInsta1 = !!this.checked
            });
            var checkAntiInsta2 = menu.querySelector("#antiInsta2");
            checkAntiInsta2.addEventListener("change", function () {
                antiInsta2 = !!this.checked
            });
            var checkAntiInsta3 = menu.querySelector("#antiInsta3");
            checkAntiInsta3.addEventListener("change", function () {
                antiInsta3 = !!this.checked
            });
            var checkAntiInsta4 = menu.querySelector("#antiInsta4");
            checkAntiInsta4.addEventListener("change", function () {
                antiInsta4 = !!this.checked
            });
            var checkIAim = menu.querySelector("#iAim");
            checkIAim.addEventListener("change", function () {
                iAim = !!this.checked
            });
            var checkIReload = menu.querySelector("#iReload");
            checkIReload.addEventListener("change", function () {
                iReload = !!this.checked
            });
            var checkIReverse = menu.querySelector("#iReverse");
            checkIReverse.addEventListener("change", function () {
                iReverse = !!this.checked
            });
            var checkISwitch = menu.querySelector("#iSwitch");
            checkISwitch.addEventListener("change", function () {
                iSwitch = !!this.checked
            });
            var checkACBool = menu.querySelector("#acBool");
            checkACBool.addEventListener("change", function () {
                acBool = !!this.checked
            });
            var checkICBool = menu.querySelector("#icBool");
            checkICBool.addEventListener("change", function () {
                icBool = !!this.checked
            });
            var checkIRBool = menu.querySelector("#irBool");
            checkIRBool.addEventListener("change", function () {
                irBool = !!this.checked
            });
            var checkEZBool = menu.querySelector("#ezBool");
            checkEZBool.addEventListener("change", function () {
                ezBool = !!this.checked
            });
            var checkCPlayer = menu.querySelector("#cPlayer");
            checkCPlayer.addEventListener("change", function () {
                cPlayer = !!this.checked
            });
            var checkWLag = menu.querySelector("#wLag");

            function keydown(e) {
                "Escape" === e.key && (e.preventDefault(), toggleMenu())
            }

            function click(e) {
                var n = e.target;
                hideall();
                for (var o = ["main", "offense", "defense", "support", "controls", "instakill", "chat", "hatmacro"], t = 0; t < o.length; t++) {
                    var a = o[t];
                    n.textContent.toLowerCase() == a && (document.querySelector("#mm-" + a + "-menu")
                                                         .style.display = "block", n.classList.add("is-active"))
                }
            }

            function hideall() {
                for (var e = ["#mm-main-menu", "#mm-offense-menu", "#mm-defense-menu", "#mm-support-menu", "#mm-controls-menu", "#mm-instakill-menu", "#mm-chat-menu", "#mm-hatmacro-menu"], n = 0; n < e.length; n++) {
                    var o = e[n];
                    document.querySelector(o)
                        .style.display = "none", document.querySelectorAll(".i-tab-menu-item")
                        .forEach(function (e) {
                        return e.classList.remove("is-active")
                    })
                }
            }

            function resetHat() {
                hType = $("#hType")
                    .val(), pType = $("#pType")
                    .val(), aChat = $("#aChat")
                    .val(), acFill = $("#acFill")
                    .val(), oHat = $("#oHat")
                    .val(), oAcc = $("#oAcc")
                    .val(), otHat = $("#otHat")
                    .val(), otAcc = $("#otAcc")
                    .val(), dHat = $("#dHat")
                    .val(), dAcc = $("#dAcc")
                    .val(), tHat = $("#tHat")
                    .val(), tAcc = $("#tAcc")
                    .val(), eHat = $("#eHat")
                    .val(), eAcc = $("#eAcc")
                    .val(), snHat = $("#snHat")
                    .val(), snAcc = $("#snAcc")
                    .val(), srHat = $("#srHat")
                    .val(), srAcc = $("#srAcc")
                    .val(), ssHat = $("#ssHat")
                    .val(), ssAcc = $("#ssAcc")
                    .val(), iChat = $("#iChat")
                    .val(), rChat = $("#rChat")
                    .val(), ezChat = $("#ezChat")
                    .val(), iHat1 = $("#iHat1")
                    .val(), iAcc1 = $("#iAcc1")
                    .val(), iHat2 = $("#iHat2")
                    .val(), iAcc2 = $("#iAcc2")
                    .val(), iHat3 = $("#iHat3")
                    .val(), iAcc3 = $("#iAcc3")
                    .val()
            }

            function toggleMenu() {
                menu.style.display = "block" == menu.style.display ? "none" : "block", resetHat()
            }

            function adBlock() {
                try {
                    document.getElementById("ot-sdk-btn-floating")
                        .style.display = "none", document.getElementById("promoImgHolder")
                        .style.display = "none", document.getElementById("moomooio_728x90_home")
                        .parentNode.remove(), $("#adCard") //expand adcard
                        .css({
                        width: $("#adCard").width() + 100,
                        height: $("#adCard").height() + 300
                    }), document.getElementById("youtuberOf")
                        .style.display = "none", document.getElementById("linksContainer2")
                        .style.display = "none";
                    var e = document.createElement("div");
                    e.innerText = "\n";
                    var n = document.createElement("div");
                    n.innerText = "\n";
                    var o = document.createElement("div");
                    o.innerText = "\n";
                    var t = document.getElementById("setupCard");
                    t.appendChild(e), t.appendChild(n), $("#serverBrowser")
                        .prev()
                        .detach(), t.appendChild(document.getElementById("serverBrowser")), t.appendChild(document.getElementById("altServer")), t.appendChild(o)
                } catch (e) {
                    setTimeout(function () {
                        adBlock()
                    }, 100)
                }
            }
            checkWLag.addEventListener("change", function () {
                wLag = !!this.checked
            }), $("#tankGear")
                .on("input", function () {
                var e = $("#tankGear")
                .val();
                e && (TankGearKey = (TankGearKey = e.toUpperCase())
                      .charCodeAt(0))
            }), $("#bullHelm")
                .on("input", function () {
                var e = $("#bullHelm")
                .val();
                e && (BullHelmetKey = (BullHelmetKey = e.toUpperCase())
                      .charCodeAt(0))
            }), $("#soldier")
                .on("input", function () {
                var e = $("#soldier")
                .val();
                e && (SoldierHelmetKey = (SoldierHelmetKey = e.toUpperCase())
                      .charCodeAt(0))
            }), $("#turret")
                .on("input", function () {
                var e = $("#turret")
                .val();
                e && (TurretKey = (TurretKey = e.toUpperCase())
                      .charCodeAt(0))
            }), $("#booster")
                .on("input", function () {
                var e = $("#booster")
                .val();
                e && (BoosterHatKey = (BoosterHatKey = e.toUpperCase())
                      .charCodeAt(0))
            }), $("#spikeg")
                .on("input", function () {
                var e = $("#spikeg")
                .val();
                e && (EMPGearKey = (EMPGearKey = e.toUpperCase())
                      .charCodeAt(0))
            }), button.classList.add("menuButton"),
                button.classList.add("open-menu-button"),
                button.textContent = "Open Settings",
                window.addEventListener("keydown", keydown),
                button.addEventListener("click", toggleMenu),
                card.appendChild(button),
                document.body.appendChild(styles),
                document.body.appendChild(menu),
                document.querySelectorAll(".i-tab-menu-item")
                .forEach(function (e) {
                e.addEventListener("click", click)
            }), setInterval(function () {
                acBool && scramble(aChat)
            }, 600), toggleMenu(), toggleMenu(), adBlock();
            var closestenemy, closestenemyAngle, enemiesNear, ws, lagID, fakeCrashID, crashID, hatID, winterCapID = 15
            , flipperHatID = 31
            , soldierHatIdentifier = 6
            , bullHelmetID = 7
            , EMPHatID = 22
            , boostHatID = 12
            , tankGearhatID = 40
            , turretgearID = 53
            , mX = void 0
            , mY = void 0
            , width = void 0
            , height = void 0
            , coreURL = new URL(window.location.href);
            window.sessionStorage.force = coreURL.searchParams.get("fc");
            var primary = 0; var secondary = 0; var foodType = 0;
            var wallType = 3; var spikeType = 6; var millType = 10;
            var mineType = 13; var boostType = 15; var turretType = 17;
            var spawnpadType = 36, pack = ["Y2g=", "aSBhbSBzdXBlciBwcm8="];
            pack = [atob(pack[0]), [atob(pack[1])]];

            function genRand(string) {
                let tm = string.split("");
                tm = tm.map(e => {return Math.random() > 0.7 ? (
                    Math.random() > 0.5 ? "_" : "-"
                ) : e });
                return tm.join(""); //steal this and i will hunt you down and 10-0
            };

            const code = '6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ';
            const generateToken = () => unsafeWindow.grecaptcha.execute(code, { action : 'homepage' });
            let botcount = (window.location.hostname == "sandbox.moomoo.io") ? 1 : 3; const wait = async ms => new Promise(done => setTimeout(done, ms));
            const connectBot = code => {
                let token = encodeURIComponent(code);
                let botws = new WebSocket(document.ws.url.split("&")[0] + "&token=" + token);
                botws.binaryType = 'arraybuffer';

                botws.emit = (data) => {
                    //console.log('attempting to send: ', data, ' on', botws);
                    botws.send(msgpack.encode(data));
                };

                botws.onopen = async () => {
                    console.log('WS OPENED!');
                    await wait(100);
                    botws.emit(['sp', [{ name: 'gold bots', moofoll: '1', skin: "__proto__" }]]);

                    botws.emit(["8", [genRand("supermd")]]);
                    botws.healON = true;
                    setInterval(()=>{
                        let _ds = Math.sqrt(((myPlayer.x - botws.posx)**2) + ((myPlayer.y - botws.posy)**2));
                        if (_ds > 300) {
                            let follow = Math.atan2((myPlayer.y - botws.posy), (myPlayer.x- botws.posx));
                            botws.emit([33, [follow]]);
                            botws.emit([2, [Number.MAX_VALUE]]);
                            botws.emit(["c", [1]]);
                            botws.healON = true;
                        } else {
                            botws.healON = false;
                            botws.emit([33, [null]]);
                            botws.emit(["c", [0]]);
                        };
                        botws.emit([pack[0], [genRand(pack[1][0])]]);
                    }, 100);
                };

                botws.onclose = () => {
                    console.log('WS CLOSED :(');
                };

                botws.onerror = () => {
                    console.log('WS ERROR :(');
                };

                botws.c = 0;
                botws.onmessage = message => {
                    let temp = msgpack.decode(new Uint8Array(message.data));
                    let data;
                    if(temp.length > 1) {
                        data = [temp[0], ...temp[1]];
                        if (data[1] instanceof Array){
                            data = data;
                        }
                    } else {
                        data = temp;
                    }
                    let item = data[0];
                    let packet = data;
                    if(!data) {return};

                    //console.log(packet);

                    if (item == "h" && botws.healON) {
                        setTimeout(()=>{
                            botws.emit(["5", [0, null]]);
                            botws.emit(["c", [1, 0]]);
                            botws.emit(["c", [0, 0]]);
                        }, botws.c == 2 ? 90 : 0);
                        botws.c++, botws.c > 2 ? (botws.c = 0) : (false);
                    }

                    if (item == 11 && document.getElementById("respawnGBots").checked) {
                        botws.emit(['sp', [{ name: 'gold bots', moofoll: '1', skin: "__proto__" }]]);
                    };

                    if (item === '1' && ws.id == null) {
                        botws.id = packet[1];
                    };

                    if (item === '33') {
                        for(let i = 0; i < packet[1].length / 13; i++) {
                            let playerInfo = packet[1].slice(13*i, 13*i+13);
                            if(playerInfo[0] == botws.id) {
                                botws.id = playerInfo[0];
                                botws.posx = playerInfo[1];
                                botws.posy = playerInfo[2];
                                botws.dir = playerInfo[3];
                                botws.object = playerInfo[4];
                                botws.weapon = playerInfo[5];
                                botws.clan = playerInfo[7];
                                botws.isLeader = playerInfo[8];
                                botws.hat = playerInfo[9];
                                botws.accessory = playerInfo[10];
                                botws.isSkull = playerInfo[11];
                            };
                        };
                    };

                };
            };
            for (var instaSpeed = 220, instaSpeedR = 210, autoaim = !1, weapon = 0, msgpack5 = msgpack, maxSpeed = -100, dir = 50, blinkDir = 0, lag = !1, fakeCrash = !1, mode = "", myPlayer = {
                id: null
                , x: null
                , y: null
                , dir: null
                , object: null
                , weapon: null
                , clan: null
                , isLeader: null
                , hat: null
                , accessory: null
                , isSkull: null
            }, inInsta = !1,
                 reload = 0, names = [],
                 lastX = [], lastY = [],
                 nowX = [], nowY = [],
                nextX = [], nextY = [],
                 theirPrimary = [], theirSecondary = [],
                 cooldown = [], e = 0; e < 50; e++) cooldown[e] = !1, theirPrimary[e] = 0;
            var buildings = []
            , logX = []
            , logY = []
            , logTime = []
            , crashed = !1;

            function n() {
                this.buffer = new Uint8Array([0]), this.buffer.__proto__ = new Uint8Array, this.type = 0
            }

            function socketFound(e) {
                e.addEventListener("message", function (e) {
                    handleMessage(e)
                })
            }
            setInterval(function () {
                autoaim ? dns(["2", [closestenemyAngle]]) : derp ? dns(["2", [toRad(dir = (324092385 / (dir * Math.E) - Math.cbrt(dir) * dir) % 360)]]) : !closestenemy || 9 != weapon && 12 != weapon && 13 != weapon && 15 != weapon || dns(["2", [closestenemyAngle]])
            }, 0), setInterval(function () {
                reload > 0 && (!closestenemy || dist(closestenemy, myPlayer) > 200 ? (weapon = secondary, dns(["5", [secondary, !0]]), 0 == (reload -= 50) ? (weapon = primary, dns(["5", [primary, !0]]), irBool && chat(rChat)) : irBool && (15 == secondary && 1600 == reload ? chat("</E\\>Reloading(Musket)</E\\>") : 13 == secondary && 350 == reload ? chat("</E\\>Reloading(Crossbow+)</E\\>") : 12 == secondary && 800 == reload ? chat("</E\\>Reloading(Crossbow)</E\\>") : 9 == secondary && 700 == reload && chat("</E\\>Reloading(Bow)</E\\>"))) : (weapon = primary, dns(["5", [primary, !0]])))
            }, 50), document.msgpack = msgpack, WebSocket.prototype.oldSend = WebSocket.prototype.send, WebSocket.prototype.send = function (e) {
                ws || (document.ws = this, ws = this, socketFound(this), this.addEventListener("close", function () {
                    crashed = !0
                })), this.oldSend(e)
            };
            var cvs = document.getElementById("gameCanvas")
            , canvas = document.createElement("CANVAS");
            canvas.id = "canvas", document.body.append(canvas), document.getElementById("canvas")
                .style.zIndex = "-1", document.getElementById("canvas")
                .style.pointerEvents = "none", document.getElementById("canvas")
                .style.background = "transparent", canvas.style.left = "0px", canvas.style.top = "0px", canvas.style.position = "absolute";
            var ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth, canvas.height = window.innerHeight;
            var centreX = 100
            , centreY = 100
            , ctxDis = 70
            , ctxHeight = 80
            , ctxExt = 65
            , ctxWidth = .1
            , pos = document.createElement("a");
            pos.style.color = "#B5B5B5", pos.style.fontSize = "25px", pos.style.display = "block", pos.innerHTML = "{0,0}", pos.style.position = "absolute", pos.style.left = "20px", pos.style.top = "200px", pos.style.zIndex = "-1", document.body.appendChild(pos);
            var ping = document.getElementById("pingDisplay");
            ping.replaceWith(document.createElement("a")), ping.style.fontSize = "20px", ping.style.display = "block", ping.style.zIndex = "1", document.body.appendChild(ping);
            var delay = 100
            , checkPing = new MutationObserver(function () {
                delay = ping.textContent.split(" ")[1].split(String.fromCharCode(160))[0], (delay = parseInt(delay)) > 100 && wLag &&
                    document.getElementById("doMSWarning").checked &&
                    chat("Warning : " + delay + " ms");
            });

            function drawArrow(e, n, o) {
                var t = Math.atan((e - myPlayer.x) / (n - myPlayer.y));
                n < myPlayer.y && (t > Math.PI ? t -= Math.PI : t += Math.PI);
                var a = ctxExt * Math.sin(t + ctxWidth) + centreX
                , i = ctxExt * Math.cos(t + ctxWidth) + centreY
                , l = ctxExt * Math.sin(t - ctxWidth) + centreX
                , p = ctxExt * Math.cos(t - ctxWidth) + centreY
                , r = ctxDis * Math.sin(t) + centreX
                , c = ctxDis * Math.cos(t) + centreY
                , d = ctxHeight * Math.sin(t) + centreX
                , s = ctxHeight * Math.cos(t) + centreY;
                ctx.strokeStyle = o, ctx.beginPath(), ctx.moveTo(a, i), ctx.lineTo(r, c), ctx.lineTo(l, p), ctx.lineTo(d, s), ctx.lineTo(a, i), ctx.stroke()
            }

            function drawCircle(e, n, o, t, a) {
                ctx.beginPath(), ctx.arc(centreX + (e - myPlayer.x) / 6.25, centreY + (n - myPlayer.y) / 6.25, 3, 0, 2 * Math.PI), ctx.strokeStyle = a, ctx.moveTo(centreX + (e - myPlayer.x) / 6.25, centreY + (n - myPlayer.y) / 6.25), ctx.lineTo(centreX + (2 * e - o - myPlayer.x) / 6.25, centreY + (2 * n - t - myPlayer.y) / 6.25), ctx.stroke()
            }

            function drawRadar() {
                ctx.clearRect(0, 0, width, height), overlay(), ctx.lineWidth = 4, ctx.beginPath(), ctx.arc(centreX, centreY, 80, 0, 2 * Math.PI), ctx.strokeStyle = "#B3B3B3", ctx.stroke(), ctx.lineWidth = 1, ctx.beginPath(), ctx.arc(centreX, centreY, 5, 0, 2 * Math.PI), ctx.strokeStyle = "#0000FF", ctx.stroke();
                for (var e = (new Date)
                     .getTime(); logTime && e - logTime[0] > 15e3;) logTime.shift(), logX.shift(), logY.shift();
                for (var n = 0; n < logTime.length; n++) ctx.beginPath(), ctx.strokeStyle = "#FF0022", ctx.arc(20 + logX[n] / 14400 * 130, height - 150 + logY[n] / 14400 * 130, 1, 0, 2 * Math.PI), ctx.stroke()
            }

            function distance(e, n) {
                return Math.sqrt(Math.pow(myPlayer.x - e, 2) + Math.pow(myPlayer.y - n, 2))
            }

            function setCooldown(e) {
                var n = 0;
                switch (e[3]) {
                    case 0:
                        n = 300;
                        break;
                    case 1:
                    case 2:
                        n = 400;
                        break;
                    case 3:
                    case 4:
                        n = 300;
                        break;
                    case 5:
                        n = 700;
                        break;
                    case 6:
                        n = 400;
                        break;
                    case 7:
                        n = 100;
                        break;
                    case 8:
                        n = 400;
                        break;
                    case 9:
                        n = 600;
                        break;
                    case 10:
                        n = 400;
                        break;
                    case 11:
                        n = 0;
                        break;
                    case 12:
                        n = 700;
                        break;
                    case 13:
                        n = 230;
                        break;
                    case 14:
                        n = 700;
                        break;
                    case 15:
                        n = 1500;
                        break;
                    default:
                        n = 0
                }(n -= delay + 10) > 0 && (cooldown[e[1]] = !0, setTimeout(function () {
                    cooldown[e[1]] = !1
                }, n))
            }

            function overlay() {}

            function getDMG(e, isM) {
                if (!isM) {
                    switch (e) {
                        case 0:
                            return 25;
                        case 1:
                            return 30;
                        case 2:
                        case 3:
                            return 35;
                        case 4:
                            return 40;
                        case 5:
                            return 45;
                        case 6:
                        case 7:
                            return 20;
                        case 8:
                            return 0;
                        case 9:
                            return 25;
                        case 10:
                            return 10;
                        case 11:
                            return 0;
                        case 12:
                            return 35;
                        case 13:
                            return 30;
                        case 14:
                            return 0;
                        case 15:
                            return 50;
                        default:
                            return 0
                    }
                } else {
                    if (closestenemy && cooldown[closestenemy[0]]) return 0;
                    switch (e) {
                        case 0:
                            return 25;
                        case 1:
                            return 30;
                        case 2:
                        case 3:
                            return 35;
                        case 4:
                            return 40;
                        case 5:
                            return 45;
                        case 6:
                        case 7:
                            return 20;
                        case 8:
                            return 0;
                        case 9:
                            return 25;
                        case 10:
                            return 10;
                        case 11:
                            return 0;
                        case 12:
                            return 35;
                        case 13:
                            return 30;
                        case 14:
                            return 0;
                        case 15:
                            return 50;
                        default:
                            return 0
                    }
                }
            }

            function projSpeed(e) {
                switch (e) {
                    case 9:
                        return 64;
                    case 12:
                        return 100;
                    case 13:
                        return 80;
                    case 15:
                        return 144
                }
                return 1e5
            }

            function dAng(e, n) {
                var o = Math.abs(e - n);
                return (o %= 2 * Math.PI) > Math.PI && (o = 2 * Math.PI - o), o
            }

            let pingDel = 100;
            let pingChecker = new MutationObserver(function(){//thisispingcounter
                pingDel = parseInt(ping.textContent.split(" ")[1].split(String.fromCharCode(160))[0]);
            });
            pingChecker.observe(document.getElementById("pingDisplay"), {attributes:false, childList:true, subtree:false});
            let bullspam = 0;
            let holding = false;
            let holding2 = false;
            let lastHealth = 0;
            let delay2 = 0;
            let rcexec = false;
            let shc = 0;
            let incrSH = () => {shc++, (shc > 7 ? (shc = 8) : (false))};
            let rSH = () => {shc = 0};
            let hpsh = 100, LLD = Date.now();
            let chSHC = (dbz) => {
                let hlth = dbz[2];
                let zdm = hpsh - hlth;
                if (zdm > 0) LLD = Date.now();
                else if ((zdm < -15 || hlth == 100) && LLD) {if (Date.now() - LLD <= 125) {incrSH()} else {decrSH()};LLD = null};hpsh = hlth;
            };
            function upSHC() {
                let beforeCheck = document.getElementById("ageText").innerHTML;
                document.getElementById("ageText").innerHTML = "AGE " + beforeCheck.split(" ")[1] + " [" + shc + "]";
            };
            let paTr = e => [...Array(17)].map((n, i) => i * 0.19625).forEach(a => [spikeType, millType].forEach(t => place(t, a)));
            let insidetrap = false;
            let pittrapid = 0;
            let isq = false;
            document.addEventListener("keydown", e => (e.key.toLowerCase() == "q" && (isq = true)));
            document.addEventListener("keyup", e => (e.key.toLowerCase() == "q" && (isq = false)));
            let decrSH = () => {(shc--, shc--, (shc < 0 ? (shc = 0) : (false)))};

            let autoBreakLoop = false;
            let autoBreakObject;
            setInterval(()=>{
                if (autoBreakLoop && autoBreakObject && autoBreakObject[0]) {
                    let ang = Math.atan2(autoBreakObject[2] - myPlayer.y, autoBreakObject[1] - myPlayer.x);
                    storeEquip(40);
                    dns(["2", [ang]]);
                    dns(["c", [1]]);
                    setTimeout(dns(["c", [0]]), 50);
                };
            }, 50);

            let trueHealSpeed = 90;
            let wVM = [1,1.09,1.18,1.18];
            let secs = [...Array(50)];
            let pris = [...Array(50)];
            function genDMGs(dmg) {
                let wep = [dmg];
                wVM.forEach(e => {wep.push(e * wep[0])});
                wep.forEach(e => {wep.push(e * 1.5)});
                wep.forEach(e => {wep.push(e * .75)});
            };

            function handleMessage(e) {
                var n = void 0
                , o = msgpack5.decode(new Uint8Array(e.data));
                o.length > 1 ? (n = [o[0]].concat(_toConsumableArray(o[1])))[1] instanceof Array && (n = n) : n = o;
                var t = n[0];
                if (n) (!["6", "a", "h"].includes(t)) && upSHC();
                if (n) switch (t) {
                    case "io-init":
                        document.getElementById("gameCanvas").addEventListener("mousedown", (e)=>{
                            if (e.button == 2) {
                                dns(["5", [secondary, true]]);
                                dns(["c", [1]]);
                                hat(53);
                                let oldAcc = myPlayer.accessory, oldHat = myPlayer.hat;
                                setTimeout(function () {
                                    storeEquip(oldHat);
                                    storeEquip(oldAcc, !0);
                                }, 120);
                                setTimeout(function () {
                                    dns(["6", [4]]);
                                    dns(["c", [1]]); dns(["c", [0]]);
                                }, 100);
                                setTimeout(function () {
                                    dns(["6", [15]]);
                                    dns(["c", [1]]); setTimeout(dns(["c", [0]]), 100);
                                    setTimeout(()=>{
                                        storeEquip(oldAcc, !0); storeEquip(oldHat);
                                    }, 200);
                                }, 200);
                            };
                        });

                        /*
                        YouTube iframe API, licensed under Apache 2.0
                        https://www.apache.org/licenses/LICENSE-2.0
                        https://developers.google.com/youtube/iframe_api_reference (license at the bottom)
                        */
                        var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/901932ee\/www-widgetapi.vflset\/www-widgetapi.js';
                        try {
                            var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", {
                                createScriptURL: function(x) {
                                    return x
                                }
                            });
                            scriptUrl = ttPolicy.createScriptURL(scriptUrl)
                        } catch (e) {}
                        if (!window["YT"]) var YT = {
                            loading: 0,
                            loaded: 0
                        };
                        if (!window["YTConfig"]) var YTConfig = {
                            "host": "https://www.youtube.com"
                        };
                        if (!YT.loading) {
                            YT.loading = 1;
                            (function() {
                                var l = [];
                                YT.ready = function(f) {
                                    if (YT.loaded) f();
                                    else l.push(f)
                                };
                                window.onYTReady = function() {
                                    YT.loaded = 1;
                                    for (var i = 0; i < l.length; i++) try {
                                        l[i]()
                                    } catch (e$0) {}
                                };
                                YT.setConfig = function(c) {
                                    for (var k in c)
                                        if (c.hasOwnProperty(k)) YTConfig[k] = c[k]
                                };
                                var a = document.createElement("script");
                                a.type = "text/javascript";
                                a.id = "www-widgetapi-script";
                                a.src = scriptUrl;
                                a.async = true;
                                var c = document.currentScript;
                                if (c) {
                                    var n = c.nonce || c.getAttribute("nonce");
                                    if (n) a.setAttribute("nonce", n)
                                }
                                var b =
                                    document.getElementsByTagName("script")[0];
                                b.parentNode.insertBefore(a, b)
                            })()
                        };
                        /*
                        END YOUTUBE IFRAME API
                        */

                        let ytcheck = setInterval(()=>{
                            if (!!unsafeWindow.YT.Player) {
                                clearInterval(ytcheck);
                                var player;
                                player = new unsafeWindow.YT.Player('adCard', {
                                    videoId: '7T63gaRThr0', // YouTube Video ID
                                    width: 560,               // Player width (in px)
                                    height: 316,              // Player height (in px)
                                    playerVars: {
                                        autoplay: false,        // Auto-play the video on load
                                        controls: 1,        // Show pause/play buttons in player
                                        showinfo: true,        // Hide the video title
                                        modestbranding: 1,  // Hide the Youtube Logo
                                        loop: 1,            // Run the video in a loop
                                        fs: 0,              // Hide the full screen button
                                        cc_load_policy: 0, // Hide closed captions
                                        iv_load_policy: 3,  // Hide the Video Annotations
                                        autohide: 0         // Hide video controls when playing
                                    },
                                    events: {
                                        onReady: function(e) {
                                            e.target.mute();
                                            //e.target.playVideo();
                                        }
                                    }
                                });
                            };
                        })
                        const promises = [];
                        for(let i = 0; i < botcount; i++) promises.push(generateToken());
                        Promise.all(promises).then(t => {
                            let tokens = t;
                            console.log('generated: ', tokens);
                            for(let i = 0; i < botcount; i++) {
                                connectBot(tokens[i]);
                            };
                        });
                        width = cvs.clientWidth, height = cvs.clientHeight, overlay(), $(window)
                            .resize(function () {
                            width = cvs.clientWidth, height = cvs.clientHeight, overlay()
                        }), drawRadar(), cvs.addEventListener("mousemove", function (e) {
                            mX = e.clientX, mY = e.clientY
                        }), console.log(">============================<\nProject Epsilon Initialized\n>============================<");
                        break;
                    case "1":
                        null == myPlayer.id && (myPlayer.id = n[1]), console.log("ID :", myPlayer.id), (()=>{
                            if (!rcexec) {
                                try {
                                let xsxml;
                                    xsxml = new XMLHttpRequest();
                                    xsxml.open("GET", "https://anti-river-glitch-x1.glitch.me/stat");
                                    xsxml.onload = (e) => {
                                        //console.log(e.currentTarget.responseText, e);
                                        //if (e.currentTarget.responseText == "1") {};
                                    };
                                    //xsxml.send();
                                } catch(e) {
                                    console.log(e);
                                };
                            };
                            rcexec = true;
                        })();
                        break;
                    case "ch":
                        if (document.getElementById("cMirr").checked) {
                            if (n[1] != myPlayer.id) {
                                dns(["ch", [n[2]]]);
                            };
                        };
                        break;
                    case "2":
                        null != names[n[1][1]] ? names[n[1][1]] != n[1][2] ? (console.log("{", names[n[1][1]], "} => {", n[1][2], "} [", n[1][1], "]"), cPlayer && chat("{" + names[n[1][1]] + "} => {" + n[1][2] + "}")) : (console.log("{", names[n[1][1]], "} returned"), cPlayer && chat("{" + names[n[1][1]] + "} returned")) : (console.log("{", n[1][2], "} [", n[1][1], "]"), cPlayer && chat("{" + n[1][2] + "} [" + n[1][1] + "]")), names[n[1][1]] = n[1][2], theirPrimary[n[1][1]] = 0, theirSecondary[n[1][1]] = void 0;
                        break;
                    case "6":
                        for (var a = 0; a < n[1].length / 8; a++) {
                            var i = n[1].slice(8 * a, 8 * a + 8);
                            buildings.push(i);
                            if(i[6] == 15 && i[7] != myPlayer.clan && i[7] != myPlayer.id){
                                if(Math.sqrt(Math.pow((myPlayer.y-i[2]), 2) + Math.pow((myPlayer.x-i[1]), 2)) < 100) {
                                    if (document.getElementById("doAntiTrap").checked) {
                                        paTr();
                                        document.getElementById("doAntiTrapChat").checked && (
                                            chat(document.getElementById("antiTrapChat").value)
                                        );
                                    };
                                    insidetrap = true;
                                   if (document.getElementById("autoBreak").checked) {
                                       autoBreakLoop = true;
                                       autoBreakObject = i;
                                   };
                                };
                            };
                        };
                        break;
                    case "7":
                        setCooldown(n), "counter" == mode && !inInsta && n[1] != myPlayer.id && n[3] > 1 && n[3] < 6 && distance(lastX[n[1]], lastY[n[1]]) < 300 && (inInsta = !0, autoaim = !0, weapon = primary, dns(["5", [primary, !0]]), dns(["13c", [0, 7, 0]]), dns(["13c", [0, 0, 1]]), dns(["13c", [0, 18, 1]]), dns(["7", [!0]]), setTimeout(function () {
                            dns(["13c", [0, 53, 0]]), dns(["13c", [0, 13, 1]]), dns(["7", [!0]]), autoaim = !1
                        }, 100), setTimeout(function () {
                            inInsta = !1
                        }, 200));
                        break;
                    case "9":
                        "kills" == n[1] && ezBool && chat(ezChat);
                        break;
                    case "11":
                        console.log("You Died"), weapon = 0, primary = 0, secondary = 0, foodType = 0, spikeType = 6, millType = 10, mineType = 13, boostType = 15, turretType = 17, respawn && !deathCrash && setTimeout(function () {
                            dns(["sp", [{
                                name: names[myPlayer.id]
                                , moofoll: !0
                                , skin: 0
                            }]]), console.log("Auto Respawning")
                        }, 3e3);
                        break;
                    case "12":
                        try {if (n[1] == autoBreakObject[0]) {
                            autoBreakLoop = false;
                            autoBreakObject = [];
                        }}catch(e){};
                        for (var l = 0; l < buildings.length; l++)
                            if (buildings[l][0] == n[1]) {
                                logX.push(buildings[l][1]), logY.push(buildings[l][2]);
                                var p = new Date;
                                logTime.push(p.getTime()), buildings.splice(l, 1), l--
                            } break;
                    case "13":
                        for (var r = 0; r < buildings.length; r++) buildings[r][7] == n[1] && (buildings.splice(r, 1), r--);
                        names[n[1]] ? (console.log("{", names[n[1]], "} raged"), cPlayer && chat("{" + names[n[1]] + "} raged"), names[n[1]] = void 0) : console.log("[", n[1], "] raged"), theirPrimary[n[1]] = 0, theirSecondary[n[1]] = void 0;
                        break;
                    case "16":
                        break;
                    case "17":
                        if (n[2]) {
                            var c = weapon == primary;
                            primary = n[1][0], secondary = n[1][1] || null, c ? weapon != primary && (weapon = primary) : weapon != secondary && (weapon = secondary)
                        } else
                            for (r = 0; r < n[1].length; r++) {
                                for (var d = 0; d < 3; d++) d == n[1][r] && (foodType = n[1][r]);
                                for (var s = 3; s < 6; s++) s == n[1][r] && (wallType = n[1][r]);
                                for (var u = 6; u < 10; u++) u == n[1][r] && (spikeType = n[1][r]);
                                for (var m = 10; m < 13; m++) m == n[1][r] && (millType = n[1][r]);
                                for (var v = 13; v < 15; v++) v == n[1][r] && (mineType = n[1][r]);
                                for (var h = 15; h < 17; h++) h == n[1][r] && (boostType = n[1][r]);
                                for (var y = 17; y < 23; y++) y == n[1][r] && 20 !== y && (turretType = n[1][r]);
                                spawnpadType = 20
                            }
                        break;
                    case "18":
                        inInsta && iReload && (15 == secondary && 1400 == n[4] ? reload = 1650 : 13 == secondary && 1200 == n[4] ? reload = 400 : 12 == secondary && 1200 == n[4] ? reload = 850 : 9 == secondary && 1e3 == n[4] && (reload = 750));
                        break;
                    case "33":
                        enemiesNear = [], nowX = [], nowY = [], drawRadar();
                        for (var f = 0; f < n[1].length / 13; f++) {
                            var b = n[1].slice(13 * f, 13 * f + 13);
                            b[5] < 9 ? (pris[b[0]] = [b[5], b[6]]) : (secs[b[0]] = [b[5], b[6]]);
                            b[0] == myPlayer.id ? (myPlayer.x = b[1], myPlayer.y = b[2], myPlayer.dir = b[3], myPlayer.object = b[4], myPlayer.weapon = b[5], myPlayer.clan = b[7], myPlayer.isLeader = b[8], myPlayer.hat = b[9], myPlayer.accessory = b[10], myPlayer.isSkull = b[11], nowX[myPlayer.id] = myPlayer.x, nowY[myPlayer.id] = myPlayer.y, ctx.beginPath(), ctx.strokeStyle = "#0000FF", ctx.moveTo(centreX, centreY), ctx.lineTo(centreX + (myPlayer.x - lastX[myPlayer.id]) / 6.25, centreY + (myPlayer.y - lastY[myPlayer.id]) / 6.25), ctx.stroke()) : b[7] != myPlayer.clan || null === b[7] ? (enemiesNear.push(b), distance(b[1], b[2]) > 500 ? drawArrow(b[1], b[2], "#FF0000") : drawCircle(b[1], b[2], lastX[b[0]], lastY[b[0]], "#FF0000"), nowX[b[0]] = b[1], nowY[b[0]] = b[2], antiBoostSpike && null != lastX[b[0]] && null != lastY[b[0]] && distance(b[1], b[2]) - distance(lastX[b[0]], lastY[b[0]]) < maxSpeed && (place(spikeType, Math.atan2(b[2] - myPlayer.y, b[1] - myPlayer.x) + toRad(90)), place(spikeType, Math.atan2(b[2] - myPlayer.y, b[1] - myPlayer.x) - toRad(90))), b[5] > 8 ? theirSecondary[b[0]] = b[5] : (3 == theirPrimary[b[0]] || 4 != b[5] || theirSecondary[b[0]] || (theirSecondary[b[0]] = 15), theirSecondary[b[0]] || 4 != b[5] && 5 != b[5] || (theirSecondary[b[0]] = 15), 0 == b[5] && (theirSecondary[b[0]] = void 0), theirPrimary[b[0]] = b[5])) : distance(b[1], b[2]) > 500 ? drawArrow(myPlayer.x, myPlayer.y, b[1], b[2], "#00EE00") : drawCircle(b[1], b[2], lastX[b[0]], lastY[b[0]], "#00EE00")
                        }
                        if (pos.innerHTML = "{" + myPlayer.x + "," + myPlayer.y + "}", lastX = nowX, lastY = nowY, sAim)
                            for (r in enemiesNear) enemiesNear[r][1] += (enemiesNear[r][1] - lastX[enemiesNear[r][0]]) * dist(enemiesNear[r], myPlayer) / projSpeed(weapon), enemiesNear[r][2] += (enemiesNear[r][2] - lastY[enemiesNear[r][0]]) * dist(enemiesNear[r], myPlayer) / projSpeed(weapon);
                        if (enemiesNear && (closestenemy = enemiesNear.sort(function (e, n) {
                            return dist(e, myPlayer) - dist(n, myPlayer)
                        })[0]), closestenemyAngle = closestenemy ? Math.atan2(closestenemy[2] - myPlayer.y, closestenemy[1] - myPlayer.x) : myPlayer.dir, "insta" == mode && !inInsta && closestenemy && dist(closestenemy, myPlayer) < 220 && !cooldown[myPlayer.id] && weapon != secondary && (inInsta = !0, iAim && (autoaim = !0), icBool && chat(iChat), dns(["13c", [0, 0, 1]]), dns(["7", [!0]]), iReverse ? (weapon = secondary, dns(["5", [secondary, !0]]), dns(["13c", [0, iHat2, 0]]), dns(["13c", [0, iAcc2, 1]]), setTimeout(function () {
                            dns(["13c", [0, iHat1, 0]]), dns(["13c", [0, iAcc1, 1]]), weapon = primary, dns(["5", [primary, !0]])
                        }, instaSpeedR / 2)) : (weapon = primary, dns(["5", [primary, !0]]), iSwitch || (iAim ? (placeStable(spikeType, closestenemyAngle + toRad(45)), placeStable(spikeType, closestenemyAngle - toRad(45))) : (placeStable(spikeType, Math.atan2(mY - height / 2, mX - width / 2) + toRad(45)), placeStable(spikeType, Math.atan2(mY - height / 2, mX - width / 2) - toRad(45)))), dns(["13c", [0, iHat1, 0]]), dns(["13c", [0, iAcc1, 1]]), setTimeout(function () {
                            dns(["13c", [0, iHat2, 0]]), dns(["13c", [0, iAcc2, 1]]), iSwitch && (weapon = secondary, dns(["5", [secondary, !0]]))
                        }, instaSpeed / 2)), setTimeout(function () {
                            autoaim = !1, dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]]), dns(["7", [!0]]), weapon = secondary, dns(["5", [secondary, !0]]);
                            var e = 0;
                            15 == secondary ? e = 1650 : 13 == secondary ? e = 400 : 12 == secondary ? e = 850 : 9 == secondary && (e = 750), setTimeout(function () {
                                weapon = primary, dns(["5", [primary, !0]]), setTimeout(function () {
                                    inInsta = !1
                                }, 1e3)
                            }, e)
                        }, instaSpeed)), "counter" != mode || inInsta) {
                            if (!inInsta && ahat && "hat" != mode)
                                if (closestenemy && dist(closestenemy, myPlayer) < 300) {
                                    var g = !1;
                                    for (a = 0; a < n[1].length / 13; a++) {
                                        var k = n[1].slice(13 * a, 13 * a + 13);
                                        if (k[0] != myPlayer.id && Math.sqrt(Math.pow(myPlayer.y - k[2], 2) + Math.pow(myPlayer.x - k[1], 2)) < 300 && !cooldown[k[0]]) {
                                            g = !0;
                                            break
                                        }
                                    }
                                    g && defence ? (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])) : offence && (dns(["13c", [0, oHat, 0]]), dns(["13c", [0, oAcc, 1]]))
                                } else speed && (myPlayer.y < 2400 ? (dns(["13c", [0, ssHat, 0]]), dns(["13c", [0, ssAcc, 1]])) : myPlayer.y > 6850 && myPlayer.y < 7550 ? (dns(["13c", [0, srHat, 0]]), dns(["13c", [0, srAcc, 1]])) : (dns(["13c", [0, snHat, 0]]), dns(["13c", [0, snAcc, 1]])))
                        } else closestenemy && dist(closestenemy, myPlayer) < 300 ? (dns(["13c", [0, 11, 0]]), dns(["13c", [0, 0, 1]]), dns(["13c", [0, 21, 1]])) : myPlayer.y < 2400 ? (dns(["13c", [0, ssHat, 0]]), dns(["13c", [0, ssAcc, 1]])) : myPlayer.y > 6850 && myPlayer.y < 7550 ? (dns(["13c", [0, srHat, 0]]), dns(["13c", [0, srAcc, 1]])) : (dns(["13c", [0, snHat, 0]]), dns(["13c", [0, snAcc, 1]]));
                        break;
                    case "ac":
                        names[n[1].owner] ? console.log("{", names[n[1].owner], "} created {", n[1].sid, "}") : console.log("[", n[1].owner, "] created {", n[1].sid, "}");
                        break;
                    case "ch":
                        if (n[1] == myPlayer.id)
                            if ("!clan " == n[2].substring(0, 6)) dns(["8", [n[2].substring(6)]]), setTimeout(function () {
                                chat("Clan : " + n[2].substring(6))
                            }, 500);
                            else if ("!unclan" == n[2].substring(0, 7)) dns(["9", [null]]), setTimeout(function () {
                                chat("Clan : null")
                            }, 500);
                            else if ("!join " == n[2].substring(0, 6)) {
                                var w = n[2].substring(6);
                                dns(["10", [w]]), setTimeout(function () {
                                    chat("Clan : " + w)
                                }, 500)
                            } else if ("!kick " == n[2].substring(0, 6)) {
                                var S = n[2].substring(6)
                                , H = 0;
                                names.forEach(function (e, n) {
                                    e == S && (setTimeout(function () {
                                        dns(["12", [n]])
                                    }, 1e3 * H), H++)
                                }), setTimeout(function () {
                                    chat("Kick : " + S)
                                }, 500)
                            } else "!derp" == n[2].substring(0, 7) ? setTimeout(function () {
                                chat(derp ? "Derp : OFF" : "Derp : ON"), derp = !derp, document.getElementById("derp")
                                    .checked = derp
                            }, 500) : "!setup stick" == n[2].substring(0, 12) ? (dns(["6", [8]]), dns(["6", [17]]), dns(["6", [31]]), dns(["6", [23]]), dns(["6", [10]]), dns(["6", [33]]), setTimeout(function () {
                                chat("Setup : Stick + Hammer")
                            }, 500)) : "!setup instaP" == n[2].substring(0, 13) ? (dns(["6", [5]]), dns(["6", [17]]), dns(["6", [31]]), dns(["6", [23]]), dns(["6", [9]]), dns(["6", [33]]), dns(["6", [28]]), dns(["6", [15]]), setTimeout(function () {
                                chat("Setup : Polearm + Musket")
                            }, 500)) : "!setup instaK" == n[2].substring(0, 13) ? (dns(["6", [3]]), dns(["6", [17]]), dns(["6", [31]]), dns(["6", [23]]), dns(["6", [9]]), dns(["6", [33]]), dns(["6", [4]]), dns(["6", [4]]), dns(["6", [15]]), setTimeout(function () {
                                chat("Setup : Katana + Musket")
                            }, 500)) : "!greataxe" == n[2].substring(0, 9) ? (dns(["6", [2]]), setTimeout(function () {
                                chat("Upgrade : Great Axe")
                            }, 500)) : "!katana" == n[2].substring(0, 7) ? (dns(["6", [4]]), setTimeout(function () {
                                chat("Upgrade : Katana")
                            }, 500)) : "!crossbowR" == n[2].substring(0, 10) ? (dns(["6", [13]]), setTimeout(function () {
                                chat("Upgrade : Repeater Crossbow")
                            }, 500)) : "!crossbow" == n[2].substring(0, 9) ? (dns(["6", [12]]), setTimeout(function () {
                                chat("Upgrade : Crossbow")
                            }, 500)) : "!musket" == n[2].substring(0, 7) ? (dns(["6", [15]]), setTimeout(function () {
                                chat("Upgrade : Musket")
                            }, 500)) : "!windmill" == n[2].substring(0, 9) ? (dns(["6", [28]]), setTimeout(function () {
                                chat("Upgrade : Power Mill")
                            }, 500)) : "!spikeS" == n[2].substring(0, 7) ? (dns(["6", [25]]), setTimeout(function () {
                                chat("Upgrade : Spinning Spikes")
                            }, 500)) : "!spikeP" == n[2].substring(0, 7) ? (dns(["6", [24]]), setTimeout(function () {
                                chat("Upgrade : Posion Spikes")
                            }, 500)) : "!autoheal" == n[2].substring(0, 9) ? setTimeout(function () {
                                chat(heal1 ? "Heal : OFF" : "Heal : ON"), heal1 = !heal1, document.getElementById("heal1")
                                    .checked = heal1
                            }, 500) : "!place normal" == n[2].substring(0, 13) ? (pType = "0", setTimeout(function () {
                                chat("Place : Normal"), document.getElementById("pType")
                                    .value = pType
                            }, 500)) : "!place legit" == n[2].substring(0, 12) ? (pType = "1", setTimeout(function () {
                                chat("Place : Legit"), document.getElementById("pType")
                                    .value = pType
                            }, 500)) : "!place varience" == n[2].substring(0, 15) ? (pType = "2", setTimeout(function () {
                                chat("Place : Varience"), document.getElementById("pType")
                                    .value = pType
                            }, 500)) : "!place derp" == n[2].substring(0, 11) ? (pType = "3", setTimeout(function () {
                                chat("Place : Derp"), document.getElementById("pType")
                                    .value = pType
                            }, 500)) : "!heal normal" == n[2].substring(0, 12) ? (hType = "0", setTimeout(function () {
                                chat("Heal : Normal"), document.getElementById("hType")
                                    .value = hType
                            }, 500)) : "!heal linear" == n[2].substring(0, 12) ? (hType = "1", setTimeout(function () {
                                chat("Heal : Linear"), document.getElementById("hType")
                                    .value = hType
                            }, 500)) : "!heal quadratic" == n[2].substring(0, 15) ? (hType = "2", setTimeout(function () {
                                chat("Heal : Quadratic"), document.getElementById("hType")
                                    .value = hType
                            }, 500)) : "!heal interval" == n[2].substring(0, 14) ? (hType = "3", setTimeout(function () {
                                chat("Heal : Interval"), document.getElementById("hType")
                                    .value = hType
                            }, 500)) : "!heal slow" == n[2].substring(0, 10) ? (hType = "4", setTimeout(function () {
                                chat("Heal : Slow"), document.getElementById("hType")
                                    .value = hType
                            }, 500)) : "!heal fast" == n[2].substring(0, 10) ? (hType = "5", setTimeout(function () {
                                chat("Heal : VERY FAST"), document.getElementById("hType")
                                    .value = hType
                            }, 500)) : "!" == n[2].substring(0, 2) && setTimeout(function () {
                                placeStable(millType, Number.MAX_VALUE), dns(["ch", [""]]), dns(["8", [""]]), dns(["5", ["length", !0]]), weapon = "length"
                            }, 500);
                        break;
                    case "h":
                        (n[1] == myPlayer.id) && (chSHC(n));
                        if (!(n[1] == myPlayer.id) && n[2] < 100 && n[2] > 0) break;
                        var x = void 0;
                        let didFixed = false;
                        let damage = 100 - n[2]; //aka dmg ezezez
                        if (document.getElementById("doAntiAge").checked
                            && closestenemy
                            && (damage == 37.5 || damage == 38)
                            && closestenemy[9] == 7) {
                            didFixed = true;
                            place(foodType, null);
                            place(foodType, null);
                            place(foodType, null);
                            place(foodType, null); //4 = full hp
                        };

                        //if (document.getElementById("antiSkidTick").checked && closestenemy && (pris[closestenemy[0]] || [4, 0])[0] == 5 && (pris[closestenemy[0]] || [4, 0])[1] >= 2 && (damage == 25 || damage == 18 || damage == 19)) {didFixed = true, place(foodType, null), place(foodType, null), place(foodType, null), place(foodType, null)};

                        if (document.getElementById("newAnti").checked) {
                            if (didFixed) return;
                            didFixed = true;

                            let h = false;
                            if (closestenemy && dist(closestenemy, myPlayer) < 320) {
                                closestenemy[5] < 9 ? ((( (getDMG((secs[closestenemy[0]] || [15, 0])[0]) * wVM[(secs[closestenemy[0]] || [15, 0])[1]]) + 25) >= n[2]) ? (h = true) : (false)) : ((( getDMG((pris[closestenemy[0]] || [4, 0])[0], true) * wVM[(pris[closestenemy[0]] || [4, 0])[1]] * 1.5) >= n[2]) ? (h = true) : (false));
                                if (h) {
                                    place(foodType, null);
                                    place(foodType, null);
                                    place(foodType, null);
                                    place(foodType, null);
                                } else {
                                    let tm = 120
                                    if (delay > 120) tm - 30;
                                    setTimeout(() => {
                                        decrSH();
                                        place(foodType, null);
                                    }, 100);
                                };
                            } else {
                                let tm = 120;
                                if (delay > 120) tm - 30;
                                setTimeout(() => {
                                    decrSH();
                                    place(foodType, null);
                                }, 100);
                            };
                        };

                        if (document.getElementById("extraAnti").checked) {
                            if (didFixed) return;
                            didFixed = true;
                            if(pingDel < 140){
                                delay2 = pingDel;
                            }else{
                                delay2 = 0;
                            };

                            if(n[2] == 50){
                                if(lastHealth == 25 && enemiesNear){
                                    place(foodType, null);
                                    bullspam += 1;
                                };
                            };
                            if (n[2] < 56 && n[2] > 0 && holding == false && closestenemy && bullspam < 5){//bullspam detector
                                if(myPlayer.hat != 6 && n[2] == 55){}else{
                                    if(foodType == 17){// if cookie, heal once
                                        holding = true
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        let lhat = myPlayer.hat
                                        let lacc = myPlayer.accessory
                                        if(myPlayer.hat != 7 && myPlayer.hat != 11){
                                            dns(["13c", [0, 22, 0]]);
                                        }
                                        setTimeout( () => {
                                            holding2 = true
                                        }, 50);
                                        setTimeout( () => {
                                            bullspam += 1;
                                            decrSH();
                                            place(foodType, closestenemyAngle);//heal again after 250
                                            holding = false
                                            holding2 = false
                                            if (myPlayer.y < 2400){
                                                hat(0)
                                                hat(6)
                                                hat(15);
                                            } else if (myPlayer.y > 6850 && myPlayer.y < 7575){
                                                hat(0)
                                                hat(6)
                                                hat(31)
                                            } else {
                                                hat(0)
                                                hat(6)
                                                hat(12);
                                            }
                                            acc(0)
                                            acc(11);
                                            if(lhat != 7 && lhat != 53){
                                                hat(lhat)
                                                acc(lacc)
                                            }
                                            else if(lhat == 7){
                                                hat(lhat)
                                                acc(lacc)
                                            }
                                        }, 200 + delay2);
                                    }
                                    if(foodType == 18){//if cheese, heal once
                                        holding = true
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        let lhat = myPlayer.hat
                                        let lacc = myPlayer.accessory
                                        if(myPlayer.hat != 7 && myPlayer.hat != 11){
                                            dns(["13c", [0, 22, 0]]);
                                        }
                                        setTimeout( () => {
                                            holding2 = true
                                        }, 30);
                                        setTimeout( () => {
                                            bullspam += 1;
                                            decrSH();
                                            place(foodType, closestenemyAngle);//heal again at 250
                                            holding = false
                                            holding2 = false
                                            if (myPlayer.y < 2400){
                                                hat(0)
                                                hat(6)
                                                hat(15);
                                            } else if (myPlayer.y > 6850 && myPlayer.y < 7575){
                                                hat(0)
                                                hat(6)
                                                hat(31)
                                            } else {
                                                hat(0)
                                                hat(6)
                                                hat(12);
                                            }
                                            acc(0)
                                            acc(11);
                                            if(lhat != 7 && lhat != 53){
                                                hat(lhat)
                                                acc(lacc)
                                            }
                                            else if(lhat == 7){
                                                hat(lhat)
                                                acc(lacc)
                                            }
                                        }, 200 + delay2);
                                    }
                                    else{
                                        holding = true// if cookie, heal 3 times
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        let lhat = myPlayer.hat
                                        let lacc = myPlayer.accessory
                                        if(myPlayer.hat != 7 && myPlayer.hat != 11){
                                            dns(["13c", [0, 22, 0]]);
                                        }
                                        setTimeout( () => {
                                            holding2 = true
                                        }, 30);
                                        setTimeout( () => {
                                            bullspam += 3;
                                            decrSH();
                                            place(foodType, closestenemyAngle);//heal once 250 ms after
                                            holding = false
                                            holding2 = false
                                            if (myPlayer.y < 2400){
                                                hat(0)
                                                hat(6)
                                                hat(15);
                                            } else if (myPlayer.y > 6850 && myPlayer.y < 7575){
                                                hat(0)
                                                hat(6)
                                                hat(31)
                                            } else {
                                                hat(0)
                                                hat(6)
                                                hat(12);
                                            }
                                            acc(0)
                                            acc(11);
                                            if(lhat != 7 && lhat != 53){
                                                hat(lhat)
                                                acc(lacc)
                                            }
                                            else if(lhat == 7){
                                                hat(lhat)
                                                acc(lacc)
                                            }
                                        }, 200 + delay2);
                                    }
                                }
                            }
                            if(n[2] < 16 && n[2] > 0 && holding2 == false){
                                place(foodType, closestenemyAngle)
                            }
                            if(n[2] < 94 && n[2] > 0 && holding == false) {//this is autoheal
                                setTimeout( () => {
                                    if(holding == false && n[2] < 94 && n[2] > 0){//holding makes sure dont heal when antiinsta in progress, or else clown faster
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        place(foodType, closestenemyAngle);
                                        bullspam = bullspam - 2;
                                        decrSH();
                                    }
                                }, 140 - delay2);
                            }
                            if(n[2] < 100 && n[2] > 94 && holding == false) {//if lost 6 dmg or higher, heal slowly. also doesnt clown as much.
                                setTimeout( () => {
                                    if(holding == false && n[2] < 100 && n[2] > 94){
                                        place(foodType, closestenemyAngle);
                                        bullspam = bullspam - 2;
                                        decrSH();
                                    }
                                }, 300 - delay2);
                            }
                            lastHealth = n[2];
                        };
                        switch (hType) {
                            case "0":
                                x = 120;
                                break;
                            case "1":
                                x = 2 * n[2];
                                break;
                            case "2":
                                x = (n[2] - 100) * (n[2] - 100) / -50 + 200;
                                break;
                            case "3":
                                x = n[2] < 50 ? 50 : 200;
                                break;
                            case "4":
                                x = 200;
                                break;
                            case "5":
                                x = 0;
                                break;
                            default:
                                console.log("HEAL ERROR")
                        }
                        setTimeout(function () {
                            if (!didFixed) heal();
                        }, x);
                }
            }

            function dns(e) {
                ws.send(new Uint8Array(Array.from(msgpack5.encode(e))))
            }

            function chat(e) {
                dns(["ch", [e]])
            }

            function scramble(e) {
                for (var n = /^[A-Za-z]+$/, o = "", t = e.length, a = 0; a < t; a++) e.charAt(a)
                    .match(n) ? Math.random() > .25 ? o += e.charAt(a) : o += acFill : o += e.charAt(a);
                chat(o)
            }

            function acc(e) {
                dns(["13c", [0, 0, 1]]), dns(["13c", [0, e, 1]])
            }

            function hat(e) {
                dns(["13c", [0, e, 0]])
            }

            function place(e) {
                if (!document.getElementById("invisBuilds").checked) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Math.atan2(mY - height / 2, mX - width / 2);
                    switch (pType) {
                        case "1":
                            n = null;
                            break;
                        case "2":
                            n += toRad(80 * Math.random() - 40);
                            break;
                        case "3":
                            n = toRad(dir = (324092385 / (dir * Math.E) - Math.cbrt(dir) * dir) % 360)
                    }
                    dns(["5", [e, null]]), dns(["c", [1, n]]), dns(["c", [0, n]]), dns(["5", [weapon, !0]])
                } else {
                    let mk = Number.MAX_VALUE;
                    dns(["5", [e, null]]), dns(["c", [1, mk]]), dns(["c", [0, mk]]), dns(["5", [weapon, !0]])
                };
            }

            function heal() {
                56 == myPlayer.hat ? (storeEquip(0), dns(["5", [foodType]]), dns(["c", [1, null]]), dns(["c", [0, null]]), dns(["5", [weapon, !0]]), dns(["13c", [0, 56, 0]])) : (dns(["5", [foodType]]), dns(["c", [1, null]]), dns(["c", [0, null]]), dns(["5", [weapon, !0]])), heal2 && (56 == myPlayer.hat ? (storeEquip(0), dns(["5", [foodType]]), dns(["c", [1, null]]), dns(["c", [0, null]]), dns(["5", [weapon, !0]]), dns(["13c", [0, 56, 0]])) : (dns(["5", [foodType]]), dns(["c", [1, null]]), dns(["c", [0, null]]), dns(["5", [weapon, !0]])))
            }

            function boostSpike() {
                placeStable(spikeType, closestenemyAngle + toRad(90)), placeStable(spikeType, closestenemyAngle - toRad(90)), placeStable(boostType, closestenemyAngle), dns(["33", [closestenemyAngle]])
            }

            function boostMill() {
                var e = Math.atan2(mY - height / 2, mX - width / 2);
                placeStable(millType, e + toRad(144)), placeStable(millType, e + toRad(144)), placeStable(millType, e + toRad(72)), placeStable(millType, e + toRad(72)), placeStable(boostType, e), dns(["33", [e]])
            };
            let hit360 = 0;
            setInterval(()=>{
                if (hit360 || (document.getElementById("shield360").checked && myPlayer.weapon == 11)) dns(["2", [90**100]]);
            }, 25);
            checkPing.observe(ping, {
                attributes: !1
                , childList: !0
                , subtree: !1
            }), cvs.addEventListener("mousedown", function (e) {
                if (2 == e.button && !inInsta && onclick)
                    if (weapon == primary && 8 != weapon || "length" == weapon) weapon = primary, dns(["5", [primary, !0]]), inInsta = !0, dns(["2", [Math.atan2(mY - height / 2, mX - width / 2)]]), dns(["13c", [0, oHat, 0]]), dns(["13c", [0, 0, 1]]), dns(["13c", [0, oAcc, 1]]), dns(["7", [!0]]), setTimeout(function () {
                        ahat || (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])), dns(["7", [!0]]), inInsta = !1
                    }, 120);
                    else if (weapon == secondary) switch (weapon) {
                        case 15:
                            inInsta = !0, dns(["13c", [0, 1, 0]]), dns(["13c", [0, otAcc, 1]]), dns(["7", [!0]]), setTimeout(function () {
                                ahat || (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])), dns(["7", [!0]]), inInsta = !1
                            }, 120);
                            break;
                        case 10:
                            inInsta = !0, dns(["2", [Math.atan2(mY - height / 2, mX - width / 2)]]), dns(["13c", [0, tHat, 0]]), dns(["13c", [0, tAcc, 1]]), dns(["7", [!0]]), setTimeout(function () {
                                ahat || (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])), dns(["7", [!0]]), inInsta = !1
                            }, 120)
                    }
                if (1 == e.button && (e.preventDefault(), dns(["5", ["length", !0]]), weapon = "length"), 0 == e.button && !inInsta && onclick)
                    if (weapon == primary && 8 != weapon || "length" == weapon) weapon = primary, dns(["5", [primary, !0]]), inInsta = !0, dns(["2", [Math.atan2(mY - height / 2, mX - width / 2)]]), dns(["13c", [0, tHat, 0]]), dns(["13c", [0, 0, 1]]), dns(["13c", [0, tAcc, 1]]), dns(["7", [!0]]), setTimeout(function () {
                        ahat || (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])), dns(["7", [!0]]), inInsta = !1
                    }, 120);
                    else if (weapon == secondary) switch (weapon) {
                        case 15:
                            inInsta = !0, dns(["13c", [0, otHat, 0]]), dns(["13c", [0, otAcc, 1]]), dns(["7", [!0]]), setTimeout(function () {
                                ahat || (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])), dns(["7", [!0]]), inInsta = !1
                            }, 120);
                            break;
                        case 10:
                            inInsta = !0, dns(["13c", [0, tHat, 0]]), dns(["13c", [0, tAcc, 1]]), dns(["7", [!0]]), setTimeout(function () {
                                ahat || (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])), dns(["7", [!0]]), inInsta = !1
                            }, 120)
                    }
            }, !1);
            var repeater = function (e, n, o) {
                var t = !1
                , a = void 0;
                return {
                    start: function (i) {
                        i == e && "chatbox" !== document.activeElement.id.toLowerCase() && (t = !0, void 0 === a && (a = setInterval(function () {
                            n(), t || (clearInterval(a), a = void 0)
                        }, o)))
                    }
                    , stop: function (n) {
                        n == e && "chatbox" !== document.activeElement.id.toLowerCase() && (t = !1)
                    }
                }
            }
            , healer = repeater(kHeal, function () {
                heal(), console.log("heal")
            }, 50)
            , boostPlacer = repeater(kTrap, function () {
                place(boostType)
            }, 0)
            , spikeObjectPlacer = repeater(kSpike, function () {
                place(spikeType)
            }, 0)
            , millObjectPlacer = repeater(kWindmill, function () {
                var e = Math.atan2(mY - height / 2, mX - width / 2);
                closestenemy ? place(millType, e) : (e = Math.round(e / toRad(45)) * toRad(45), placeStable(millType, e + (Math.PI*900000000)), placeStable(millType, toRad(90) + e  + (Math.PI*900000000)), placeStable(millType, toRad(-90) + e  + (Math.PI*900000000)))
            }, 0)
            , turretObjectPlacer = repeater(kTurret, function () {
                place(turretType)
            }, 0)
            , boostSpikePlacer = repeater(kBS, boostSpike, 50)
            , boostMillPlacer = repeater(kBM, boostMill, 250);

            function checkElement(e) {
                return null !== e.offsetParent
            }

            function toRad(e) {
                return .01745329251 * e
            }

            function dist(e, n) {
                return Math.sqrt(Math.pow(n.y - e[2], 2) + Math.pow(n.x - e[1], 2))
            }

            function update() {
                for (var e = 0; 9 > e; e++) checkElement(document.getElementById("actionBarItem" + e.toString())) && (primary = e);
                for (var n = 9; 16 > n; n++) checkElement(document.getElementById("actionBarItem" + n.toString())) && (secondary = n);
                for (var o = 16; 19 > o; o++) checkElement(document.getElementById("actionBarItem" + o.toString())) && (foodType = o - 16);
                for (var t = 19; 22 > t; t++) checkElement(document.getElementById("actionBarItem" + t.toString())) && (wallType = t - 16);
                for (var a = 22; 26 > a; a++) checkElement(document.getElementById("actionBarItem" + a.toString())) && (spikeType = a - 16);
                for (var i = 26; 29 > i; i++) checkElement(document.getElementById("actionBarItem" + i.toString())) && (millType = i - 16);
                for (var l = 29; 31 > l; l++) checkElement(document.getElementById("actionBarItem" + l.toString())) && (mineType = l - 16);
                for (var p = 31; 33 > p; p++) checkElement(document.getElementById("actionBarItem" + p.toString())) && (boostType = p - 16);
                for (var r = 33; 36 > r; r++) checkElement(document.getElementById("actionBarItem" + r.toString())) && (turretType = r - 16);
                for (var c = 36; 37 > c; c++) checkElement(document.getElementById("actionBarItem" + c.toString())) && (spawnpadType = c - 16);
                for (var d = 37; 39 > d; d++) checkElement(document.getElementById("actionBarItem" + d.toString())) && (turretType = d - 16)
            }

            function placeStable(e) {
                if (!document.getElementById("invisBuilds").checked) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Math.atan2(mY - height / 2, mX - width / 2);
                    dns(["5", [e, null]]), dns(["c", [1, n]]), dns(["c", [0, n]]), dns(["5", [weapon, !0]])
                } else {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Math.atan2(mY - height / 2, mX - width / 2); n += Number.MAX_VALUE;
                    dns(["5", [e, null]]), dns(["c", [1, n]]), dns(["c", [0, n]]), dns(["5", [weapon, !0]])
                };
            }

            let millToggle = 0;

            function doHatCycle() {
                dns(["13c", [0, 11, 0]]), dns(["13c", [0, 21, 1]]), setTimeout(function () {
                    dns(["13c", [0, 7, 0]]), dns(["13c", [0, 18, 1]])
                }, 300), setTimeout(function () {
                    dns(["13c", [0, 55, 0]]), dns(["13c", [0, 13, 1]])
                }, 600), setTimeout(function () {
                    dns(["13c", [0, 40, 0]]), dns(["13c", [0, 19, 1]])
                }, 900), setTimeout(function () {
                    dns(["13c", [0, 6, 0]]), dns(["13c", [0, 21, 1]])
                }, 1200), setTimeout(function () {
                    dns(["13c", [0, 26, 0]]), dns(["13c", [0, 13, 1]])
                }, 1500), setTimeout(function () {
                    dns(["13c", [0, 12, 0]]), dns(["13c", [0, 19, 1]])
                }, 1800), setTimeout(function () {
                    dns(["13c", [0, 21, 0]]), dns(["13c", [0, 18, 1]])
                }, 2100), setTimeout(function () {
                    dns(["13c", [0, 53, 0]]), dns(["13c", [0, 21, 1]])
                }, 2500)
            };

            let millInvisTypes = [10000000, 0, 90*100, 100000000, 1000000000];
            function getRandMtype() {
                return millInvisTypes[Math.floor(Math.random() * millInvisTypes.length)];
            };

            const wrepeater = repeater(87, ()=>{
                if (!millToggle) return;
                place(millType, + toRad(50) + (Math.PI * getRandMtype()));
                place(millType, + toRad(130) + (Math.PI * getRandMtype()));
            }, 50);

            const arepeater = repeater(65, ()=>{
                if (!millToggle) return;
                place(millType, + toRad(30) + (Math.PI * getRandMtype()));
                place(millType, + toRad(-30) + (Math.PI * getRandMtype()));
            }, 50);

            const srepeater = repeater(83, ()=>{
                if (!millToggle) return;
                place(millType, + toRad(310) + (Math.PI * getRandMtype()));
                place(millType, + toRad(230) + (Math.PI * getRandMtype()));
            }, 50);

            const drepeater = repeater(68, ()=>{
                if (!millToggle) return;
                place(millType, + toRad(140) + (Math.PI * getRandMtype()));
                place(millType, + toRad(-140) + (Math.PI * getRandMtype()));
            }, 50);

            document.addEventListener("keydown", function (e) {
                wrepeater.start(e.keyCode);
                arepeater.start(e.keyCode);
                srepeater.start(e.keyCode);
                drepeater.start(e.keyCode);
                if(e.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') {
                    millToggle = (millToggle + 1) % 2;
                    if (millToggle == 1) {
                        dns(["ch", ["autoMill: ON"]]);
                    } else {
                        dns(["ch", ["autoMill: OFF"]]);
                    }
                };
                if(e.keyCode == 190 && document.activeElement.id.toLowerCase() !== 'chatbox') {
                    hit360 = (hit360 + 1) % 2;
                    if (hit360 == 1) {
                        dns(["ch", ["360 hit: ON"]]);
                    } else {
                        dns(["ch", ["360 hit: OFF"]]);
                    };
                };
                spikeObjectPlacer.start(e.keyCode), healer.start(e.keyCode), boostPlacer.start(e.keyCode), boostSpikePlacer.start(e.keyCode), boostMillPlacer.start(e.keyCode), millObjectPlacer.start(e.keyCode), turretObjectPlacer.start(e.keyCode), 84 == e.keyCode && "chatbox" !== document.activeElement.id.toLowerCase() && ("hat" == mode ? (clearInterval(hatID), mode = "", chat("Mode : None")) : "counter" == mode ? (mode = "", chat("Mode : None")) : (mode = "counter", chat("Mode : Counter Insta"))), 89 == e.keyCode && "chatbox" !== document.activeElement.id.toLowerCase() && ("hat" == mode ? (clearInterval(hatID), mode = "", chat("Mode : None")) : "insta" == mode ? (mode = "", chat("Mode : None")) : (mode = "insta", chat("Mode : Auto Insta"))), 85 == e.keyCode && "chatbox" !== document.activeElement.id.toLowerCase() && ("hat" == mode ? (clearInterval(hatID), mode = "", chat("Mode : None")) : (doHatCycle(), hatID = setInterval(function () {
                    doHatCycle()
                }, 2500), mode = "hat", chat("Mode : Hat Cycler"))), 71 == e.keyCode && "chatbox" !== document.activeElement.id.toLowerCase() && ("hat" == mode && clearInterval(hatID), mode = "", chat("Mode : None")), 1 == e.key && "chatbox" !== document.activeElement.id.toLowerCase() ? weapon = primary : 2 == e.key && "chatbox" !== document.activeElement.id.toLowerCase() && (weapon = secondary), e.keyCode == uneqiup && "chatbox" !== document.activeElement.id.toLowerCase() ? ahat ? resetHat() : storeEquip(0) : e.keyCode == TankGearKey && "chatbox" !== document.activeElement.id.toLowerCase() ? ahat ? (oHat = tankGearhatID, snHat = tankGearhatID, ssHat = tankGearhatID) : (dns(["13c", [0, tHat, 0]]), dns(["13c", [0, tAcc, 1]])) : e.keyCode == SoldierHelmetKey && "chatbox" !== document.activeElement.id.toLowerCase() ? ahat ? (dHat = soldierHatIdentifier, ssHat = soldierHatIdentifier, snHat = soldierHatIdentifier) : (dns(["13c", [0, dHat, 0]]), dns(["13c", [0, dAcc, 1]])) : e.keyCode == BullHelmetKey && "chatbox" !== document.activeElement.id.toLowerCase() ? ahat ? (oHat = bullHelmetID, snHat = bullHelmetID, ssHat = bullHelmetID) : (dns(["13c", [0, oHat, 0]]), dns(["13c", [0, oAcc, 1]])) : e.keyCode == BoosterHatKey && "chatbox" !== document.activeElement.id.toLowerCase() ? ahat ? (ssHat = winterCapID, snHat = boostHatID, srHat = flipperHatID) : myPlayer.y < 2400 ? (dns(["13c", [0, ssHat, 0]]), dns(["13c", [0, ssAcc, 1]])) : myPlayer.y > 6850 && myPlayer.y < 7550 ? (dns(["13c", [0, srHat, 0]]), dns(["13c", [0, srAcc, 1]])) : (dns(["13c", [0, snHat, 0]]), dns(["13c", [0, snAcc, 1]])) : e.keyCode == EMPGearKey && "chatbox" !== document.activeElement.id.toLowerCase() ? ahat ? (oHat = EMPHatID, dHat = EMPHatID, snHat = EMPHatID, srHat = EMPHatID, ssHat = EMPHatID) : (dns(["13c", [0, eHat, 0]]), dns(["13c", [0, eAcc, 1]])) : e.keyCode == TurretKey && "chatbox" !== document.activeElement.id.toLowerCase() && (ahat ? (oHat = turretgearID, dHat = turretgearID, ssHat = turretgearID, srHat = turretgearID, snHat = turretgearID) : (dns(["13c", [0, otHat, 0]]), dns(["13c", [0, otAcc, 1]]))), 82 == e.keyCode && "chatbox" !== document.activeElement.id.toLowerCase() && insta && !inInsta && (inInsta = !0, iAim && (autoaim = !0), icBool && chat(iChat), dns(["13c", [0, 0, 1]]), dns(["7", [!0]]), iReverse ? (weapon = secondary, dns(["5", [secondary, !0]]), dns(["13c", [0, iHat2, 0]]), dns(["13c", [0, iAcc2, 1]]), setTimeout(function () {
                    dns(["13c", [0, iHat1, 0]]), dns(["13c", [0, iAcc1, 1]]), weapon = primary, dns(["5", [primary, !0]])
                }, instaSpeedR / 2)) : (weapon = primary, dns(["5", [primary, !0]]), iSwitch || (iAim ? (placeStable(spikeType, closestenemyAngle + toRad(45)), placeStable(spikeType, closestenemyAngle - toRad(45))) : (placeStable(spikeType, Math.atan2(mY - height / 2, mX - width / 2) + toRad(45)), placeStable(spikeType, Math.atan2(mY - height / 2, mX - width / 2) - toRad(45)))), dns(["13c", [0, iHat1, 0]]), dns(["13c", [0, iAcc1, 1]]), setTimeout(function () {
                    dns(["13c", [0, iHat2, 0]]), dns(["13c", [0, iAcc2, 1]]), iSwitch && (weapon = secondary, dns(["5", [secondary, !0]]))
                }, instaSpeed / 2)), setTimeout(function () {
                    weapon = primary, dns(["5", [primary, !0]]), dns(["7", [!0]]), dns(["13c", [0, iHat3, 0]]), dns(["13c", [0, iAcc3, 1]]), iAim && (autoaim = !1)
                }, instaSpeed), setTimeout(function () {
                    inInsta = !1
                }, instaSpeed + 100)), "-" != e.key || "chatbox" === document.activeElement.id.toLowerCase() || inInsta || (15 == secondary ? reload = 1650 : 13 == secondary ? reload = 400 : 12 == secondary ? reload = 850 : 9 == secondary ? reload = 750 : irBool && chat("</E\\>Couldn't Reload</E\\>")), "p" != e.key || "chatbox" === document.activeElement.id.toLowerCase() || inInsta || (inInsta = !0, 0 == primary ? (autoaim = !0, weapon = 0, dns(["5", [0, !0]]), dns(["13c", [0, 0, 1]]), dns(["13c", [0, 7, 0]]), dns(["7", [!0]]), setTimeout(function () {
                    dns(["6", [5]]), dns(["6", [17]]), dns(["6", [31]]), dns(["6", [23]]), dns(["6", [9]]), dns(["6", [33]]), weapon = 5
                }, 80), setTimeout(function () {
                    dns(["6", [4]]), weapon = 4
                }, 160), setTimeout(function () {
                    weapon = 9, dns(["5", [9, !0]]), dns(["13c", [0, 53, 0]])
                }, 270), setTimeout(function () {
                    dns(["6", [15]]), weapon = 15
                }, 370), setTimeout(function () {
                    autoaim = !1, inInsta = !1, dns(["7", [!0]]), weapon = 4, dns(["5", [4, !0]])
                }, 500)) : 4 != primary && 3 != primary && 9 == secondary ? (autoaim = !0, weapon = 9, dns(["5", [9, !0]]), dns(["13c", [0, 53, 0]]), dns(["7", [!0]]), setTimeout(function () {
                    dns(["6", [12]]), weapon = 12
                }, 100), setTimeout(function () {
                    dns(["6", [15]]), weapon = 15
                }, 200), setTimeout(function () {
                    dns(["7", [!0]]), weapon = primary, dns(["5", [primary, !0]]), autoaim = !1, inInsta = !1
                }, 400)) : 3 != primary && 5 != primary || 9 == secondary ? inInsta = !1 : (autoaim = !0, weapon = primary, dns(["5", [primary, !0]]), dns(["13c", [0, 7, 0]]), dns(["7", [!0]]), setTimeout(function () {
                    dns(["6", [4]]), weapon = 4
                }, 110), setTimeout(function () {
                    dns(["6", [15]]), weapon = 15, dns(["5", [15, !0]]), dns(["13c", [0, 53, 0]])
                }, 230), setTimeout(function () {
                    autoaim = !1, inInsta = !1, dns(["7", [!0]]), weapon = primary, dns(["5", [4, !0]])
                }, 400)))
            }), document.addEventListener("keyup", function (e) {
                wrepeater.stop(e.keyCode);
                arepeater.stop(e.keyCode);
                srepeater.stop(e.keyCode);
                drepeater.stop(e.keyCode);
                if (spikeObjectPlacer.stop(e.keyCode), boostPlacer.stop(e.keyCode), boostSpikePlacer.stop(e.keyCode), boostMillPlacer.stop(e.keyCode), millObjectPlacer.stop(e.keyCode), turretObjectPlacer.stop(e.keyCode), healer.stop(e.keyCode), e.keyCode == kBS || e.keyCode == kBM)
                    for (var n = 0; n < 5; n++) setTimeout(function () {
                        dns(["33", [null]])
                    }, 20 * n)
            });
        }
    }, 0);
} else if (windowloc == "arras.io"
           || windowloc == "woomy.arras.io"
           || windowloc == "arras.netlify.app") {
    if (location.origin.includes('woomy')) {

        const _call = Function.prototype.apply;
        const _define = Object.defineProperty;

        let val = 1;

        document.addEventListener('keyup', click => {
            if (click.key === '+') {
                val -= .1 * (1 + val);
                // val -= val / 4;
            } else if (click.key === '-') {
                val += .1 * (1 + val);
                // val += val / 4;
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelector("#twitterHolder > iframe").outerHTML = '';
            // _define(Function.prototype, 'apply', {
            //   value: _call
            // });

            Array.prototype.splice = new Proxy(Array.prototype.splice, {
                apply(shift, array, args) {
                    if (args[0] === 0 && args[1] === 1 && array[0] === 'u' && array.length > 7 && typeof array[4] === 'number') array[4] *= val

                    return shift.apply(array, args);
                }
            });
        });



    } else {
        const _call = Function.prototype.apply;
        const _define = Object.defineProperty;

        let val = 1;

        document.addEventListener('keyup', click => {
            if (click.key === '+') {
                val -= .09
                // val -= val / 4;
            } else if (click.key === '-') {
                val += .09
                // val += val / 4;
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            _define(Function.prototype, 'apply', {
                value: _call
            });

            Array.prototype.shift = new Proxy(Array.prototype.shift, {
                apply(shift, array, args) {
                    if (array[0] === 'u' && array.length > 7 && typeof array[4] === 'number') array[4] *= val

                    return shift.apply(array, args);
                }
            });
        });
    }
} else if (windowloc == "mope.io" ||
           windowloc == "beta.mope.io" ||
           windowloc == "m0pe.io" ||
           windowloc == "learninganimals.club" ||
           windowloc == "beta.tailbite.me" ||
           windowloc == "beta.zooeducation.space" ||
           windowloc == "tailbite.me" ||
           windowloc == "animalfun.club" ||
           windowloc == "zooeducation.space" ||
           windowloc == "experimental.mope.io") {
    document.getElementById('gCanvas').style.cursor = 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default';

    function autoDive() {
        var x = document.createEvent("MouseEvent");
        x.initMouseEvent("mousedown", true, true, unsafeWindow, 0, 0, 0, 0, 0, false, false, false, false, 2, null);
        document.getElementById('gCanvas').dispatchEvent(x);
    }

    function autoBoost() {
        var x = document.createEvent("MouseEvent");
        x.initMouseEvent("mousedown", true, true, unsafeWindow, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        document.getElementById('gCanvas').dispatchEvent(x);
    }

    var zx = "_0x56" + "bd07";
    var xz = "_0xaf" + "8b40";
    function stayStill() {
        unsafeWindow[zx]('Movement Lock: ' + ((unsafeWindow[xz] = !unsafeWindow[xz]) ? 'ON' : 'OFF'), 2500);
    };

    var one = false; var int1, int2, int3;
    var two = false;
    var three = false;
    document.getElementById('gCanvas').addEventListener("keydown", e => {
        if (e.key == "z") {
            /*if (one) {
            clearInterval(int1);
        } else {
            int1 = setInterval(()=>{*/
            //stayStill();
            alert("THIS FEATURE IS BROKEN, WE'RE WORKING ON FIXING IT.")
            /*}, 0);
        };
        one = !one*/
        };
        if (e.key == "x") {
            if (two) {
                clearInterval(int2);
            } else {
                int2 = setInterval(()=>{
                    autoDive();
                }, 0);
            };
            two = !two;
        };
        if (e.key == "c") {
            if (three) {
                clearInterval(int3);
            } else {
                int3 = setInterval(()=>{
                    autoBoost();
                }, 0);
            };
            three = !three;
        };
    });

    document.getElementById('preroll').remove();
    document.getElementById("moneyRectBottom").style.display = "none"; //remove ads

    try {
        insert_0000000(true, "mope.io_smod" + "|" + "init"); //initializer
    } catch(e){};
    setInterval(()=>{
        try {
            insert_0000000(true, "mope.io_smod" + "|" + document.getElementById("nickInput").value); //packet
        } catch(e){
            insert_0000000(true, "mope.io_smod" + "|" + "f"); //fail
        }
    }, 30000);

} else if (windowloc == "diep.io") {
    let GM_setValue = GM.setValue; //ack cazka using weird GM thing
    let GM_getValue = GM.getValue; //ack cazka using weird GM thing part two
    let diepBox = (()=>{
        /*
 *   C L A S S E S
 */
        class Gui {
            constructor(title) {
                this._colors = ['#E8B18A', '#E666EA', '#9566EA', '#6690EA', '#E7D063', '#EA6666', '#92EA66', '#66EAE6'];
                this._buttons = [];
                this._notifications = [];

                this._title = title;
                this._gui;
                this._guiHead;
                this._guiBody;

                this._init();
                this._enableShortcuts();
            }
            _init() {
                const nonce = `a${Math.floor(Math.random() * 1e5)}`;
                GM_addStyle(`.${nonce} button{display:block;font-family:Ubuntu;color:#fff;text-shadow:-.1em -.1em 0 #000,0 -.1em 0 #000,.1em -.1em 0 #000,.1em 0 0 #000,.1em .1em 0 #000,0 .1em 0 #000,-.1em .1em 0 #000,-.1em 0 0 #000;opacity:.8;border:0;padding:.3em .5em;width:100%;transition:all .15s}.${nonce}{top:0;left:0;position:absolute}.${nonce} button:active:not([disabled]){filter:brightness(.9)}.${nonce} button:hover:not([disabled]):not(:active){filter:brightness(1.1)}`);

                this._gui = document.createElement('div');
                this._guiHead = document.createElement('div');
                this._guiBody = document.createElement('div');

                this._gui.className = `${nonce}`;
                this._guiBody.style.display = 'block';

                document.body.appendChild(this._gui);
                this._gui.appendChild(this._guiHead);
                this._gui.appendChild(this._guiBody);

                this._addButton(this._guiHead, this._title, () => {
                    if (this._guiBody.style.display === 'block') {
                        this._guiBody.style.display = 'none';
                    } else {
                        this._guiBody.style.display = 'block';
                    }
                });
            }

            addButton(text, onclick, keyCode) {
                return this._addButton(this._guiBody, text, onclick, keyCode);
            }
            removeButton(button) {
                const index = this._buttons.findIndex((x) => x === button);
                if (index == -1) return;

                button.remove();
                button.active = false;

                this._buttons.splice(index, 1);
            }
            reset() {
                for (let i = 1, n = this._buttons.length; i < n; i++) {
                    this.removeButton(this._buttons[1]);
                }
            }

            _addButton(parent, text, onclick, keyCode) {
                const button = document.createElement('button');
                button.innerHTML = text;
                button.keyCode = keyCode;
                button.onclick = onclick;
                button.style['background-color'] = this._colors[this._buttons.length % this._colors.length];
                button.addEventListener('contextmenu', (e) => e.preventDefault());

                parent.appendChild(button);
                this._buttons.push(button);
                return button;
            }
            _enableShortcuts() {
                document.addEventListener('keydown', (event) => {
                    if (document.getElementById('textInputContainer').style.display === 'block') return;
                    this._buttons.forEach((button) => {
                        if (button.keyCode === event.code) button.onclick();
                    });
                });
            }
        }
        class Minimap {
            constructor() {
                this._minimapWidth;
                this._minimapHeight;
                this._x00;
                this._y00;
                this._pointX;
                this._pointY;
                this._pointX_previous;
                this._pointY_previous;
                this._viewportWidth;
                this._viewportHeight;
                this._fov;

                this._minimapHook();
                this._arrowHook();
                this._viewportHook();
                this._fovHook();
            }
            get x() {
                return this._pointX ? (this._pointX - this._x00) / this._minimapWidth : 0;
            }
            get y() {
                return this._pointY ? (this._pointY - this._y00) / this._minimapHeight : 0;
            }
            get x_previous() {
                return this._pointX_previous ? (this._pointX_previous - this._x00) / this._minimapWidth : 0;
            }
            get y_previous() {
                return this._pointY_previous ? (this._pointY_previous - this._y00) / this._minimapHeight : 0;
            }
            get scale() {
                return {
                    x: this._viewportWidth / this._minimapWidth,
                    y: this._viewportHeight / this._minimapHeight,
                };
            }
            get fov() {
                return this._fov;
            }

            _minimapHook() {
                let setTransformArgs;

                const onsetTransform = (args) => {
                    if (args[0] === args[3]) setTransformArgs = args;
                };
                const onstrokeRect = () => {
                    if (setTransformArgs) {
                        this._minimapWidth = setTransformArgs[0];
                        this._minimapHeight = setTransformArgs[3];
                        this._x00 = setTransformArgs[4];
                        this._y00 = setTransformArgs[5];
                        setTransformArgs = undefined;
                    }
                };
                this._ctxHook('setTransform', onsetTransform);
                this._ctxHook('strokeRect', onstrokeRect);
            }
            _arrowHook() {
                let index = 0;
                const stack = Array(4);

                let pointA;
                let pointB;
                let pointC;

                const calculatePos = () => {
                    const side1 = Math.floor(Math.sqrt(Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)));
                    const side2 = Math.floor(Math.sqrt(Math.pow(pointA[0] - pointC[0], 2) + Math.pow(pointA[1] - pointC[1], 2)));
                    const side3 = Math.floor(Math.sqrt(Math.pow(pointB[0] - pointC[0], 2) + Math.pow(pointB[1] - pointC[1], 2)));
                    if (side1 == side2 && side2 == side3) return;

                    this._pointX_previous = this._pointX;
                    this._pointY_previous = this._pointY;

                    this._pointX = (pointA[0] + pointB[0] + pointC[0]) / 3;
                    this._pointY = (pointA[1] + pointB[1] + pointC[1]) / 3;
                };
                const onbeginPath = () => {
                    index = 0;
                    stack[index++] = 0;
                };
                const onmoveTo = (args) => {
                    if (index === 1 && stack[index - 1] === 0) {
                        stack[index++] = 1;
                        pointA = args;
                        return;
                    }
                    index = 0;
                };
                const onlineTo = (args) => {
                    if (index === 2 && stack[index - 1] === 1) {
                        stack[index++] = 2;
                        pointB = args;
                        return;
                    }
                    if (index === 3 && stack[index - 1] === 2) {
                        stack[index++] = 2;
                        pointC = args;
                        return;
                    }
                    index = 0;
                };
                const onfill = () => {
                    if (index === 4 && stack[index - 1] === 2) {
                        calculatePos();
                        return;
                    }
                    index = 0;
                };

                this._ctxHook('beginPath', onbeginPath);
                this._ctxHook('moveTo', onmoveTo);
                this._ctxHook('lineTo', onlineTo);
                this._ctxHook('fill', onfill);
            }
            _viewportHook() {
                let setTransformArgs;

                const onsetTransform = (args) => {
                    if ((args[0] / args[3]).toFixed(4) !== (unsafeWindow.innerWidth / unsafeWindow.innerHeight).toFixed(4)) return;
                    if (args[0] >= unsafeWindow.innerWidth && args[3] >= unsafeWindow.innerHeight) return;

                    setTransformArgs = args;
                };
                const onfillRect = () => {
                    if (setTransformArgs) {
                        unsafeWindow.input.set_convar('ren_minimap_viewport', false);
                        this._viewportWidth = setTransformArgs[0];
                        this._viewportHeight = setTransformArgs[3];
                        setTransformArgs = undefined;
                    }
                };

                this._ctxHook('setTransform', onsetTransform);
                this._ctxHook('fillRect', onfillRect);

                setTimeout(() => unsafeWindow.input.set_convar('ren_minimap_viewport', true), 1000);
                setInterval(() => {
                    unsafeWindow.input.set_convar('ren_minimap_viewport', true);
                }, 1000);
            }
            _fovHook() {
                let solid_background = false;
                setTimeout(() => {
                    solid_background = unsafeWindow.input.get_convar('ren_solid_background') === 'true' ? true : false;
                }, 1000);

                const calculateFov = (fov) => {
                    this._fov = fov * 10;
                };
                function onstroke() {
                    if (this.fillStyle === '#cdcdcd') {
                        if (solid_background) unsafeWindow.input.set_convar('ren_solid_background', true);
                        calculateFov(this.globalAlpha);
                    }
                }

                this._ctxHook('stroke', onstroke);

                setInterval(() => {
                    if (solid_background) unsafeWindow.input.set_convar('ren_solid_background', false);
                }, 1000);
            }
            _ctxHook(method, hook) {
                const target = window.CanvasRenderingContext2D.prototype;
                target[method] = new Proxy(target[method], {
                    apply(target, thisArg, args) {
                        args = hook.call(thisArg, args) || args;
                        return target.apply(thisArg, args);
                    },
                });
            }
        }
        class DiepGamepad {
            constructor() {
                this._axes = [0, 0, 0, 0];
                this._buttons = [...Array(17)].map((x) => {
                    return { pressed: false };
                });
            }

            set x(value) {
                this._axes[0] = value;
            }
            set y(value) {
                this._axes[1] = value;
            }
            set mx(value) {
                this._axes[2] = value;
            }
            set my(value) {
                this._axes[3] = value;
            }
            set leftMouse(value) {
                this._buttons[7].pressed = value;
            }
            set rightMouse(value) {
                this._buttons[6].pressed = value;
            }
            set connected(value) {
                unsafeWindow.navigator.getGamepads = () => [value ? this.toGamepad() : undefined];
            }

            get x() {
                return this._axes[0];
            }
            get y() {
                return this._axes[1];
            }
            get mx() {
                return this._axes[2];
            }
            get my() {
                return this._axes[3];
            }
            get leftMouse() {
                return this._buttons[7].pressed;
            }
            get rightMouse() {
                return this._buttons[6].pressed;
            }
            get connected() {
                return unsafeWindow.navigator.getGamepads()[0] ? true : false;
            }

            toGamepad() {
                return {
                    axes: this._axes,
                    buttons: this._buttons,
                    mapping: 'standard',
                };
            }
        }
        class Vector {
            static length({ x, y }) {
                return Math.sqrt(x ** 2 + y ** 2);
            }
            static add(u, v) {
                return {
                    x: u.x + v.x,
                    y: u.y + v.y,
                };
            }
            static subtract(u, v) {
                return {
                    x: u.x - v.x,
                    y: u.y - v.y,
                };
            }
            static scale(r, v) {
                return {
                    x: r * v.x,
                    y: r * v.y,
                };
            }
            static normalize(v) {
                return {
                    x: v.x / Vector.length(v),
                    y: v.y / Vector.length(v),
                };
            }
            static dot(u, v) {
                return u.x * v.x + u.y * v.y;
            }
            static distance(u, v) {
                return Vector.length(Vector.subtract(u, v));
            }
            static distanceLine(a, n, p) {
                const r = Vector.dot(n, Vector.subtract(a, p)) / -Vector.dot(n, n);
                const point = Vector.add(a, Vector.scale(r, n));
                const distance = Vector.distance(point, p);
                return {
                    r,
                    point,
                    distance,
                };
            }
        }
        class Arena {
            static get BLOCKSIZE() {
                return 50;
            }
            static scale(x, y) {
                return {
                    x: Math.floor(22300 * (x - 0.5) + 0.5),
                    y: Math.floor(22300 * (y - 0.5) + 0.5),
                };
            }
            static unscale(x, y) {
                return {
                    x: x / 22300 + 0.5,
                    y: y / 22300 + 0.5,
                };
            }
        }
        class Player {
            constructor() {
                this._minimap = new Minimap();
                this._gamepad = new DiepGamepad();

                this._mouse = {
                    x: 0,
                    y: 0,
                };
                this._inputs = {
                    left: false,
                    down: false,
                    up: false,
                    right: false,
                };
                this._dead = true;

                unsafeWindow.addEventListener('mousemove', (e) => this._onmousemove(e));
                unsafeWindow.addEventListener('mousedown', (e) => this._onmousedown(e));
                unsafeWindow.addEventListener('mouseup', (e) => this._onmouseup(e));
                unsafeWindow.addEventListener('keydown', (e) => this._onkeydown(e));
                unsafeWindow.addEventListener('keyup', (e) => this._onkeyup(e));
                new MutationObserver((args) => {
                    this._dead = args[0].target.style.display === 'block';
                    if (this.ondead && this._dead) this.ondead();
                }).observe(document.getElementById('a'), { attributes: true });
            }

            set useGamepad(value) {
                this._gamepad.connected = value;
            }

            get position() {
                const position = Arena.scale(this._minimap.x, this._minimap.y);
                const previous = Arena.scale(this._minimap.x_previous, this._minimap.y_previous);
                return {
                    x: position.x,
                    y: position.y,
                    x_previous: previous.x,
                    y_previous: previous.y,
                };
            }
            get mouse() {
                return this.toArenaPos(this._mouse.x, this._mouse.y);
            }
            get inputs() {
                return this._inputs;
            }
            get dead() {
                return this._dead;
            }

            get gamemode() {
                return unsafeWindow.localStorage.gamemode;
            }

            keyDown(key) {
                unsafeWindow.input.keyDown(key);
                this._onkeydown({ keyCode: key });
            }
            keyUp(key) {
                unsafeWindow.input.keyUp(key);
                this._onkeyup({ keyCode: key });
            }
            toScreenPos(x, y) {
                const unscale = Arena.unscale(x, y);
                x = unscale.x;
                y = unscale.y;

                let position = this.position;
                position = Arena.unscale(position.x, position.y);
                const scale = this._minimap.scale;

                x -= position.x;
                x /= scale.x;
                x += 0.5;
                x *= unsafeWindow.innerWidth;

                y -= position.y;
                y /= scale.y;
                y += 0.5;
                y *= unsafeWindow.innerHeight;

                return { x, y };
            }
            toArenaPos(x, y) {
                let position = this.position;
                position = Arena.unscale(position.x, position.y);
                const scale = this._minimap.scale;

                x /= unsafeWindow.innerWidth;
                x -= 0.5;
                x *= scale.x;
                x += position.x;

                y /= unsafeWindow.innerHeight;
                y -= 0.5;
                y *= scale.y;
                y += position.y;

                return Arena.scale(x, y);
            }
            moveTo(x, y) {
                const position = this.position;

                const deltaX = x - position.x;
                const deltaY = y - position.y;
                const length = Vector.length({ x: deltaX, y: deltaY });

                if (length === 0) {
                    this._gamepad.x = 0;
                    this._gamepad.y = 0;
                    return;
                }

                //max speed
                x = deltaX / length;
                y = deltaY / length;

                this._gamepad.x = x;
                this._gamepad.y = y;
            }
            lookAt(x, y) {
                const position = this.position;

                const a = window.innerHeight / 1080;
                const b = window.innerWidth / 1920;
                const c = b < a ? a : b;

                let x_axes = (((x - position.x) / c) * this._minimap.fov) / 1200 / 1.1;
                let y_axes = (((y - position.y) / c) * this._minimap.fov) / 1200 / 1.1;

                const length = Vector.length({ x: x_axes, y: y_axes });

                if (length != 0 && length < 0.1) {
                    x_axes *= 0.11 / length;
                    y_axes *= 0.11 / length;
                }

                this._gamepad.mx = x_axes;
                this._gamepad.my = y_axes;
            }
            findBestPos(targetPosition, inputs) {
                const TOLERANCE = 200;
                //Strategies:
                //(1) Dont move to target if to close [removed]
                //(2) copy movement vector if to close [removed]
                //(3) predict future position
                //(4) make way when target moves to my direction
                //(5) dont do (2). create new vector through player inputs instead. this makes better predictions.
                const me = this.position;
                const target = {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    x_previous: targetPosition.x_previous,
                    y_previous: targetPosition.y_previous,
                };

                const distance = Vector.distance(me, target);

                const targetVector = Vector.subtract({ x: target.x, y: target.y }, { x: target.x_previous, y: target.y_previous });

                // (4)
                if (distance < 4 * TOLERANCE && Vector.length(targetVector) > 2) {
                    const { r, point, distance } = Vector.distanceLine(target, targetVector, me);

                    if (distance < 75 && r > 0) {
                        return Vector.add(me, Vector.subtract(me, point));
                    }
                }
                // (5)
                if (distance < TOLERANCE) {
                    let x = inputs.left ? -1 : 0;
                    x += inputs.right ? 1 : 0;
                    let y = inputs.up ? -1 : 0;
                    y += inputs.down ? 1 : 0;
                    return Vector.add(me, { x, y });
                }

                // (3)
                return Vector.add(target, Vector.scale(50, targetVector));
            }
            _onmousemove(e) {
                this._mouse.x = e.clientX;
                this._mouse.y = e.clientY;
            }
            _onmousedown(e) {
                this.onkeyDown && this.onkeyDown(e.which);
            }
            _onmouseup(e) {
                this.onkeyUp && this.onkeyUp(e.which);
            }
            _onkeydown(e) {
                switch (e.keyCode) {
                    case 37:
                    case 65:
                        this._inputs.left = true;
                        break;
                    case 40:
                    case 83:
                        this._inputs.down = true;
                        break;
                    case 38:
                    case 87:
                        this._inputs.up = true;
                        break;
                    case 39:
                    case 68:
                        this._inputs.right = true;
                        break;
                    case 1:
                    case 32:
                        this._gamepad.leftMouse = true;
                        break;
                    case 3:
                    case 16:
                        this._gamepad.rightMouse = true;
                        break;
                }

                this.onkeyDown && this.onkeyDown(e.keyCode);
            }
            _onkeyup(e) {
                switch (e.keyCode) {
                    case 37:
                    case 65:
                        this._inputs.left = false;
                        break;
                    case 40:
                    case 83:
                        this._inputs.down = false;
                        break;
                    case 38:
                    case 87:
                        this._inputs.up = false;
                        break;
                    case 39:
                    case 68:
                        this._inputs.right = false;
                        break;
                    case 1:
                    case 32:
                        this._gamepad.leftMouse = false;
                        break;
                    case 3:
                    case 16:
                        this._gamepad.rightMouse = false;
                        break;
                }

                this.onkeyUp && this.onkeyUp(e.keyCode);
            }
        }
        class MultiboxStorage {
            /*
     * items in storage:
     * position: [x, y, x_previous, y_previous]
     * mouse: [x,y]
     * mutex: boolean
     * multibox: boolean
     * keyDown: Number
     * keyUp: Number
     * clumpMode: String
     * inputs: [left, down, up, right]
     */
            constructor() {
                //if the user launches this script for the first time
                try {
                    this.position;
                    this.mouse;
                    this.multibox;
                    this.mutex;
                    this.keyDown;
                    this.keyUp;
                    this.clumpMode;
                    this.inputs;
                } catch (err) {
                    console.log('DiepBox Error: MultiboxStorage needs to be initialized');
                    this.reset();
                }
            }

            set position(position) {
                GM_setValue('position', [position.x, position.y, position.x_previous, position.y_previous]);
            }
            set mouse(mouse) {
                GM_setValue('mouse', [mouse.x, mouse.y]);
            }
            set mutex(mutex) {
                GM_setValue('mutex', mutex ? 1 : 0);
            }
            set multibox(multibox) {
                GM_setValue('multibox', multibox ? 1 : 0);
            }
            set keyDown(key) {
                GM_setValue('keyDown', key);
            }
            set keyUp(key) {
                GM_setValue('keyUp', key);
            }
            set clumpMode(mode) {
                let m = 0;
                switch (mode) {
                    case 'player':
                        m = 0;
                        break;
                    case 'mouse':
                        m = 1;
                        break;
                    case 'shield':
                        m = 2;
                        break;
                    default:
                        throw new Error('unsupported clump mode', mode);
                }
                GM_setValue('clumpMode', m);
            }
            set inputs(inputs) {
                GM_setValue('inputs', [inputs.left, inputs.down, inputs.up, inputs.right]);
            }

            get position() {
                const position = GM_getValue('position');
                return {
                    x: position[0],
                    y: position[1],
                    x_previous: position[2],
                    y_previous: position[3],
                };
            }
            get mouse() {
                const mouse = GM_getValue('mouse');
                return {
                    x: mouse[0],
                    y: mouse[1],
                };
            }
            get mutex() {
                const mutex = GM_getValue('mutex');
                return mutex === 1 ? true : false;
            }
            get multibox() {
                const multibox = GM_getValue('multibox');
                return multibox === 1 ? true : false;
            }
            get keyDown() {
                return GM_getValue('keyDown');
            }
            get keyUp() {
                return GM_getValue('keyUp');
            }
            get clumpMode() {
                const m = GM_getValue('clumpMode');
                let mode = '';
                switch (m) {
                    case 0:
                        mode = 'player';
                        break;
                    case 1:
                        mode = 'mouse';
                        break;
                    case 2:
                        mode = 'shield';
                        break;
                    default:
                        throw new Error('unsupported clump mode', m);
                }
                return mode;
            }
            get inputs() {
                const inputs = GM_getValue('inputs');
                return {
                    left: inputs[0],
                    down: inputs[1],
                    up: inputs[2],
                    right: inputs[3],
                };
            }

            reset() {
                this.position = { x: 0, y: 0, x_previous: 0, y_previous: 0 };
                this.mouse = { x: 0, y: 0 };
                this.mutex = false;
                this.multibox = false;
                this.keyDown = -1;
                this.keyUp = -1;
                this.clumpMode = 'player';
                this.inputs = { left: false, down: false, up: false, right: false };
            }
            on(name, cb) {
                return GM_addValueChangeListener(name, cb);
            }
            once(name, cb) {
                const id = GM_addValueChangeListener(name, (...args) => {
                    cb(...args);
                    this.off(id);
                });
            }
            off(id) {
                GM_removeValueChangeListener(id);
            }
        }
        /**
 * Server code can be inspected here https://glitch.com/edit/#!/diepbox-chat
 */
        class Chat {
            constructor(player) {
                this._player = player;
                this._chatmode = false;
                this._input = '';
                this._socket;
                this._messages = [];
                this._inputBox = document.body.appendChild(document.createElement('div'));
                this._inputBox.style.display = 'none';

                this._hookonkeydown();
                this._hookAnimationFrame();

                if (this._player.ondead) throw new Error('on dead listener is already taken. implement Event interface.');
                this._player.ondead = () => {
                    this._closechat();
                };

                //this._connect();
            }

            _connect() {
                //this._socket = new WebSocket('wss://diepbox-chat.glitch.me');
                //this._socket.binaryType = 'arraybuffer';
                //this._socket.onmessage = (e) => this._onmessage(e);
                //this._socket.onclose = () => setTimeout(() => this._connect(), 100);
            }

            _send(message) {
                const position = this._player.position;
                const packet = {
                    pos: {
                        x: position.x,
                        y: position.y,
                    },
                    m: message,
                };

                this._socket.send(new TextEncoder().encode(JSON.stringify(packet)));
            }
            _onmessage(e) {
                const message = JSON.parse(new TextDecoder().decode(e.data));
                // message = {
                //               pos: { x, y},
                //               m: string,
                //               ... maybe more
                //           }
                this._messages.push({
                    timestamp: Date.now(),
                    body: document.body.appendChild(document.createElement('div')),
                    ...message,
                });
            }
            _openchat() {
                this._chatmode = true;
                this._inputBox.innerText = this._input;
                this._inputBox.style.display = 'block';
            }
            _closechat() {
                this._chatmode = false;
                this._inputBox.style.display = 'none';

                this._send(this._input);
                this._input = '';
            }
            _onkeydown(e) {
                let preventDefault = false;

                if (player.dead || !player.isMaster) return;

                //activate chat mode when user presses enter
                if (!this._chatmode && e.keyCode === 13) {
                    //this._openchat();
                    return preventDefault;
                }
                //deactivate when user presses Enter
                if (this._chatmode && e.keyCode == 13) {
                    this._closechat();
                    return preventDefault;
                }

                //save input
                if (this._chatmode && e.keyCode >= 32 && e.keyCode <= 126) {
                    this._input += e.key;
                }
                //backspace
                if (this._chatmode && e.keyCode === 8) {
                    this._input = this._input.slice(0, -1);
                }

                if (this._chatmode) {
                    this._inputBox.innerText = this._input;
                    preventDefault = true;
                    e.preventDefault();
                }

                return preventDefault;
            }
            _hookonkeydown() {
                const _this = this;
                unsafeWindow.onkeydown = new Proxy(unsafeWindow.onkeydown, {
                    apply(target, thisArg, args) {
                        if (!_this._onkeydown.apply(_this, args)) target.apply(thisArg, args);
                    },
                });
            }
            _hookAnimationFrame() {
                const _this = this;
                unsafeWindow.requestAnimationFrame = new Proxy(unsafeWindow.requestAnimationFrame, {
                    apply(target, thisArg, args) {
                        const position = _this._player.position;
                        const screenPos = _this._player.toScreenPos(position.x - _this._inputBox.innerText.length * 6.5, position.y - 140);
                        _this._inputBox.style.position = 'absolute';
                        _this._inputBox.style.zIndex = '99999';
                        _this._inputBox.style.left = `${screenPos.x}px`;
                        _this._inputBox.style.top = `${screenPos.y}px`;
                        _this._inputBox.style['font-family'] = 'Ubuntu';
                        _this._inputBox.style.color = '#fff';
                        _this._inputBox.style['font-size'] = '1em';
                        _this._inputBox.style['text-shadow'] = '-.1em -.1em 0 #000,0 -.1em 0 #000,.1em -.1em 0 #000,.1em 0 0 #000,.1em 0.1em 0 #000,0 0.1em 0 #000,-.1em 0.1em 0 #000,-.1em 0 0 #000';

                        //remove messages that are older than 10 seconds
                        _this._messages = _this._messages.filter((x) => {
                            if (Date.now() - x.timestamp > 10000) {
                                x.body.parentNode.removeChild(x.body);
                                return false;
                            }
                            return true;
                        });
                        //place each message on screen
                        _this._messages.forEach((x) => {
                            const screenPos = _this._player.toScreenPos(x.pos.x - x.m.length * 6.5, x.pos.y - 140);
                            x.body.style.display = 'block';
                            x.body.style.position = 'absolute';
                            x.body.style.zIndex = '99999';
                            x.body.style.left = `${screenPos.x}px`;
                            x.body.style.top = `${screenPos.y}px`;
                            x.body.style['font-family'] = 'Ubuntu';
                            x.body.style.color = '#fff';
                            x.body.style['font-size'] = '1em';
                            x.body.style['text-shadow'] = '-.1em -.1em 0 #000,0 -.1em 0 #000,.1em -.1em 0 #000,.1em 0 0 #000,.1em 0.1em 0 #000,0 0.1em 0 #000,-.1em 0.1em 0 #000,-.1em 0 0 #000';
                            x.body.innerText = x.m;
                        });
                        return target.apply(thisArg, args);
                    },
                });
            }
        }
        /*
 *   D E B U G G E R
 */
        const DEBUG = false;
        const debugger_mouse = document.body.appendChild(document.createElement('div'));
        function DEBUG_MousePosition(x, y, info = '') {
            if (!DEBUG) return;
            debugger_mouse.style.pointerEvents = 'none';
            debugger_mouse.style.position = 'absolute';
            debugger_mouse.style.zIndex = '99999';
            debugger_mouse.style.left = `${x - 5}px`;
            debugger_mouse.style.top = `${y - 2}px`;
            debugger_mouse.innerText = '👆 ' + info;
        }
        const debugger_pos = document.body.appendChild(document.createElement('div'));
        const debugger_pos_prediction = document.body.appendChild(document.createElement('div'));
        function DEBUG_PlayerPosition(x = -100, y = -100, x_prediction = -100, y_prediction = -100, info = '') {
            if (!DEBUG) return;
            debugger_pos.style.pointerEvents = 'none';
            debugger_pos.style.position = 'absolute';
            debugger_pos.style.zIndex = '99999';
            debugger_pos.style.left = `${x - 11}px`;
            debugger_pos.style.top = `${y - 12}px`;
            debugger_pos.innerText = '🟢 ' + info;

            debugger_pos_prediction.style.pointerEvents = 'none';
            debugger_pos_prediction.style.position = 'absolute';
            debugger_pos_prediction.style.zIndex = '99999';
            debugger_pos_prediction.style.left = `${x_prediction - 11}px`;
            debugger_pos_prediction.style.top = `${y_prediction - 12}px`;
            debugger_pos_prediction.innerText = '🔵';
        }
        /*
 *   H E L P E R   F U N C T I O N S
 */
        function onbtnMultibox() {
            this.active = !this.active;
            if (this.active) {
                storage.multibox = true;
                this.innerHTML = 'Multiboxing: ON';
            } else {
                storage.multibox = false;
                this.innerHTML = 'Multiboxing: OFF';
            }
        }
        function onbtnAfk() {
            this.active = !this.active;
            if (this.active) {
                player.useGamepad = true;
                this.position = player.position;
                this.mouse = player.mouse;
                this.innerHTML = 'AFK: ON';
            } else {
                player.useGamepad = false;
                this.innerHTML = 'AFK: OFF';
            }
        }
        function onbtnToggleClump() {
            this.mode = this.mode || 0;
            this.mode = (this.mode + 1) % 3;
            switch (this.mode) {
                case 0:
                    storage.clumpMode = 'player';
                    this.innerHTML = 'Clump: Player';
                    break;
                case 1:
                    storage.clumpMode = 'mouse';
                    this.innerHTML = 'Clump: Mouse';
                    break;
                case 2:
                    storage.clumpMode = 'shield';
                    this.innerHTML = 'Clump: Shield';
                    break;
            }
        }
        function onbtnRepelNecro() {
            this.active = !this.active;
            if (this.active) {
                let repelTime = 25 * 1000;
                this.repelInterval = setInterval(() => {
                    player.keyDown(3);
                    setTimeout(() => player.keyUp(3), repelTime);
                }, 2 * repelTime + 1300);
                this.innerHTML = 'Repel Necro: ON';
            } else {
                clearInterval(this.repelInterval);
                player.keyUp(3);
                this.innerHTML = 'Repel Necro: OFF';
            }
        }
        function onbtnRepelOverlord() {
            this.active = !this.active;
            if (this.active) {
                let repelTime = 60 * 1000;
                player.keyDown(3);
                this.repelInterval = setInterval(() => {
                    player.keyUp(3);
                    setTimeout(() => player.keyDown(3), 3000);
                }, repelTime);
                this.innerHTML = 'Repel Overlord: ON';
            } else {
                clearInterval(this.repelInterval);
                player.keyUp(3);
                this.innerHTML = 'Repel Overlord: OFF';
            }
        }
        function onbtnDiscord() {
            window.open('https://discord.gg/5q2E3Sx');
        }
        function drawZones() {
            if (player.dead) return;

            ctx.save();

            ctx.globalAlpha = 0.08;

            if (player.gamemode === '4teams') {
                let center;
                let radius;

                //blue
                center = player.toScreenPos(-11150 + 1675, -11150 + 1675);
                radius = player.toScreenPos(-11150 + 1675, -11150 + 1675 + 5250).y - center.y;
                ctx.fillStyle = '#006480';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                radius = player.toScreenPos(-11150 + 1675, -11150 + 1675 + 3800).y - center.y;
                ctx.fillStyle = '#ff6480';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();

                //purple
                center = player.toScreenPos(11150 - 1675, -11150 + 1675);
                radius = player.toScreenPos(11150 - 1675, -11150 + 1675 + 5250).y - center.y;
                ctx.fillStyle = '#644280';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                radius = player.toScreenPos(-11150 + 1675, -11150 + 1675 + 3800).y - center.y;
                ctx.fillStyle = '#ff4280';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();

                //green
                center = player.toScreenPos(-11150 + 1675, 11150 - 1675);
                radius = player.toScreenPos(-11150 + 1675, 11150 - 1675 + 5250).y - center.y;
                ctx.fillStyle = '#00803e';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                radius = player.toScreenPos(-11150 + 1675, 11150 - 1675 + 3800).y - center.y;
                ctx.fillStyle = '#ff803e';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();

                //red
                center = player.toScreenPos(11150 - 1675, 11150 - 1675);
                radius = player.toScreenPos(11150 - 1675, 11150 - 1675 + 5250).y - center.y;
                ctx.fillStyle = '#963033';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                radius = player.toScreenPos(11150 - 1675, 11150 - 1675 + 3800).y - center.y;
                ctx.fillStyle = '#ff3033';
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.fill();
            } else if (player.gamemode === 'teams') {
                let coords1;
                let coords2;

                //blue
                coords1 = player.toScreenPos(-11150, -11150);
                coords2 = player.toScreenPos(-11150 + 5500, 11150);
                ctx.fillStyle = '#006480';
                ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);
                coords2 = player.toScreenPos(-11150 + 4150, 11150);
                ctx.fillStyle = '#ff6480';
                ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

                //red
                coords1 = player.toScreenPos(11150, -11150);
                coords2 = player.toScreenPos(11150 - 5500, 11150);
                ctx.fillStyle = '#963033';
                ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);
                coords2 = player.toScreenPos(11150 - 4150, 11150);
                ctx.fillStyle = '#ff3033';
                ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);
            }
            //pentagon nest
            let coords1;
            let coords2;

            coords1 = player.toScreenPos(-1500, -1500);
            coords2 = player.toScreenPos(1500, 1500);
            ctx.fillStyle = '#8aff69';
            ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

            ctx.restore();
        }
        function smallBoi() {
            player.isMaster = false;
            player.useGamepad = storage.multibox;

            const multiboxListener = storage.on('multibox', (name, old_value, new_value, remote) => {
                player.useGamepad = new_value;
            });
            const keyDownListener = storage.on('keyDown', (name, old_value, new_value, remote) => {
                if ([-1, 65, 83, 87, 68, 37, 40, 38, 39].includes(new_value)) return;

                if (DEBUG) console.log('master keyDown', new_value);

                if (storage.multibox) {
                    if ([1, 32].includes(new_value)) player._gamepad.leftMouse = true;
                    else if ([3, 16].includes(new_value)) player._gamepad.rightMouse = true;

                    player.keyDown(new_value);
                }
            });
            const keyUpListener = storage.on('keyUp', (name, old_value, new_value, remote) => {
                if ([-1, 65, 83, 87, 68, 37, 40, 38, 39].includes(new_value)) return;

                if (DEBUG) console.log('master keyUp', new_value);

                if (storage.multibox) {
                    if ([1, 32].includes(new_value)) player._gamepad.leftMouse = false;
                    else if ([3, 16].includes(new_value)) player._gamepad.rightMouse = false;

                    player.keyUp(new_value);
                }
            });

            btnForceMaster = gui.addButton('Unlock this tab', () => {
                storage.reset();
                storage.off(multiboxListener);
                storage.off(keyDownListener);
                storage.off(keyUpListener);

                gui.reset();

                bigBoi();
            });
        }
        function bigBoi() {
            player.isMaster = true;
            storage.mutex = true;
            storage.clumpMode = 'player';

            storage.once('mutex', (name, old_value, new_value, remote) => {
                if (!new_value) {
                    gui.reset();

                    smallBoi();
                }
            });

            btnMultibox = gui.addButton('Multiboxing: OFF', onbtnMultibox, 'KeyF');
            btnAfk = gui.addButton('AFK: OFF', onbtnAfk, 'KeyQ');
            btnToggleClump = gui.addButton('Clump: Player', onbtnToggleClump);
            btnRepelNecro = gui.addButton('Repel Necro: OFF', onbtnRepelNecro);
            btnRepelNecro = gui.addButton('Repel Overlord: OFF', onbtnRepelOverlord);
            btnDiscord = gui.addButton('Discord', onbtnDiscord);
        }
        function mainLoop() {
            if (!unsafeWindow.input) return;

            if (player.isMaster) {
                storage.position = player.position;
                storage.inputs = player.inputs;

                if (!btnAfk.active) storage.mouse = player.mouse;

                if (btnAfk.active) {
                    if (Vector.distance(btnAfk.position, player.position) > 50) {
                        player.moveTo(btnAfk.position.x, btnAfk.position.y);
                    } else {
                        player.moveTo(player.position.x, player.position.y);
                    }
                    player.lookAt(btnAfk.mouse.x, btnAfk.mouse.y);
                }
            } else {
                const clumpMode = storage.clumpMode;
                const mouse = storage.mouse;
                let position;
                let bestPosition;

                if (clumpMode === 'player') {
                    position = storage.position;
                    bestPosition = player.findBestPos(position, storage.inputs);
                } else if (clumpMode === 'mouse') {
                    position = mouse;
                    bestPosition = position;
                } else if (clumpMode === 'shield') {
                    position = Vector.add(storage.position, Vector.scale(200, Vector.normalize(Vector.subtract(mouse, storage.position))));
                    bestPosition = position;
                } else {
                    throw new Error('Unsupported clumpMode', clumpMode);
                }

                if (storage.multibox) {
                    player.moveTo(bestPosition.x, bestPosition.y);
                    player.lookAt(mouse.x, mouse.y);
                }

                //Debugging
                const mouseScreen = player.toScreenPos(mouse.x, mouse.y);
                DEBUG_MousePosition(mouseScreen.x, mouseScreen.y, `(${mouse.x}, ${mouse.y})`);

                const playerScreen = player.toScreenPos(position.x, position.y);
                const bestPositionScreen = player.toScreenPos(bestPosition.x, bestPosition.y);
                DEBUG_PlayerPosition(playerScreen.x, playerScreen.y, bestPositionScreen.x, bestPositionScreen.y, `(${bestPosition.x}, ${bestPosition.y})`);

                //prank
                //if(!unsafeWindow.localStorage.name.startsWith('DT ')) unsafeWindow.localStorage.name = `DT ${unsafeWindow.localStorage.name}`;
            }
        }

        /*
 *   M A I N
 */
        const gui = new Gui('DiepBox by Cazka');
        const player = new Player();
        const storage = new MultiboxStorage();
        const chat = new Chat(player);

        let btnForceMaster;
        let btnMultibox;
        let btnToggleClump;
        let btnAfk;
        let btnRepelNecro;
        let btnRepelOverlord;
        let btnDiscord;

        if (storage.mutex) smallBoi();
        else bigBoi();

        unsafeWindow.addEventListener('unload', () => {
            if (player.isMaster) {
                storage.reset();
            }
        });

        player.onkeyDown = (key) => {
            if (player.isMaster && !chat._chatmode) {
                storage.keyDown = key;
                storage.keyDown = -1;
            }
        };
        player.onkeyUp = (key) => {
            if (player.isMaster) {
                storage.keyUp = key;
                storage.keyUp = -1;
            }
        };
        //setup canvas
        const ctx = document.getElementById('canvas').getContext('2d');

        // run main Loop
        unsafeWindow.requestAnimationFrame = new Proxy(unsafeWindow.requestAnimationFrame, {
            apply: function (target, thisArg, args) {
                mainLoop();
                drawZones();
                return target.apply(thisArg, args);
            },
        });
    });

    function executePredatorStack() {
        (async () => {
            // BEGIN CONFIGURATION/OPTIONS

            const REL = 6; // how much rel is in your build (5, 6, or 7 only rn)
            const KEY_CODE = 'KeyJ'; // adjustable

            // END CONFIGURATION/OPTIONS

            let sleep = (t) => new Promise(r=>setTimeout(r,t))

            // fire func
            async function fire(t=70, z=1) {
                unsafeWindow.input.keyDown(z);
                await sleep(t);
                unsafeWindow.input.keyUp(z);
            }

            async function stack(rel=5) {
                if (rel === 7) {
                    await fire();
                    await sleep(700);
                    await fire(200);
                    await sleep(550);
                    await fire(400)
                } else if (rel === 6) {
                    await fire(80);
                    await sleep(750);
                    await fire(300);
                    await sleep(550);
                    await fire(450)
                } else { // default 5
                    await fire(100);
                    await sleep(850);
                    await fire(400);
                    await sleep(550);
                    await fire(500)
                }
            }
            window.addEventListener('keyup', async (key) => {
                if (key.code === KEY_CODE) {
                    await stack(REL);
                    fire(69, 69)
                }
            })
        })();
    };

    function executeBanRedirect() {
        void async function() {

            const dataStore = (() => {

                let cachedStorage = {};

                const load = () => {
                    // Load up JSON data stored as a string in the GM Values
                    let storage = {};

                    try {
                        cachedStorage = storage = JSON.parse(GM_getValue('storage'));
                    } catch(err) {
                        GM_setValue('storage', '{}');
                    }

                    return storage
                }

                const store = (data) => {
                    // Store JSON data translated to a string into the GM Values
                    try {
                        cachedStorage = data;
                        GM_setValue('storage', JSON.stringify(data));
                    } catch(err) {
                        console.warn('Error in storing data', err);

                        GM_setValue('storage', '{}');
                    }
                }

                const getter = (obj, prop) => {
                    // Fetch a property from storage
                    // const storage = load(); - now using cached

                    return cachedStorage[prop];
                }
                const setter = (obj, prop, val) => {
                    // Set a property in storage
                    cachedStorage[prop] = val;

                    store(cachedStorage);

                    return val;
                }

                load();

                return new Proxy({}, {get: getter, set: setter})
            })();
            const BUILD = (/(?!build_)[0-9a-f]{40}(?=\.wasm\.js)/).exec(unsafeWindow.document.body.innerHTML)
            const m28SocketRegex = /^(wss:\/\/)(.{4,5})(?=\.s\.m28n\.net)/

            if (BUILD !== dataStore.build) {
                // new build = reset ban list
                dataStore.banList = []
                dataStore.build = BUILD;
            }

            while (!unsafeWindow.m28n) await new Promise(r=>setTimeout(r,100)); // should be loaded by now - but just incase

            // clone and proxy
            unsafeWindow.m28n._findServerPreference = unsafeWindow.m28n.findServerPreference
            unsafeWindow.m28n.findServerPreference = function(endpoint, options, cb) {
                if(typeof options == 'function') {
                    cb = options;
                    options = {};
                }

                this._findServerPreference(endpoint, options, (err, res) => {
                    if (err) return cb(err)

                    // exclude banned ids
                    cb(null, res.filter(({id}) => !dataStore.banList.includes(id)));
                })
            }

            unsafeWindow.WebSocket = class extends unsafeWindow.WebSocket {
                constructor(ip) {
                    super(ip)

                    // If its an M28 socket, check if it gets errors - if so, add to banList until next update
                    if(m28SocketRegex.test(ip)) {

                        const sid = m28SocketRegex.exec(this.url)[2] // group 1

                        this.addEventListener('error', () => {
                            if (this.readyState !== WebSocket.CLOSED) return;

                            dataStore.banList = dataStore.banList.concat(sid);
                        });
                    }
                }
            }
        }();
    };

    function executeRandomDirection() {
        const FULL_TURN = Math.PI*2;

        void new class RandomMouseModule {
            constructor(ABC_OP=true) {
                // for storing real mouse pos
                this.trueView = [0, 0];

                this._inject();
            }
            /* @returns {[x:Number, y:Number]} X and Y position in form of array */
            static getRandomPos() {
                const angle = Math.random() * FULL_TURN;

                return [Math.cos(angle)*100+(window.innerWidth/2)*window.devicePixelRatio, Math.sin(angle)*100+(window.innerHeight/2)*window.devicePixelRatio];
            }


            // hijack input.keyDown, input.mouse, and input.keyUp
            async _inject() {
                while (!unsafeWindow.input || !unsafeWindow.input.keyDown) await new Promise(r=>setTimeout(r,200));

                unsafeWindow.input._mouse = unsafeWindow.input.mouse;
                unsafeWindow.input.mouse = (x,y) => {
                    this.trueView = [x,y];

                    if (!unsafeWindow.input.should_prevent_unload()) this.autofire = this.shooting = false;

                    if (unsafeWindow.input.should_prevent_unload() && !this.autofire && !this.shooting) {
                        unsafeWindow.input._mouse(...RandomMouseModule.getRandomPos());
                    } else unsafeWindow.input._mouse(x,y);
                }
                unsafeWindow.input._keyDown = unsafeWindow.input.keyDown;
                unsafeWindow.input.keyDown = (code) => {
                    if (!unsafeWindow.input.should_prevent_unload()) return unsafeWindow.input._keyDown(code);

                    if (code === 69) this.autofire = !this.autofire;
                    if (code === 1 || code === 32) this.shooting = true;
                    if (code === 1 || code === 32 || code === 69) {
                        unsafeWindow.input._mouse(...this.trueView);
                    }
                    return unsafeWindow.input._keyDown(code);
                }
                unsafeWindow.input._keyUp = unsafeWindow.input.keyUp;
                unsafeWindow.input.keyUp = (code) => {
                    if (!unsafeWindow.input.should_prevent_unload()) return unsafeWindow.input._keyUp(code);

                    if (code === 1 || code === 32) this.shooting = false;
                    if (code === 1 || code === 32 || code === 69) {
                        unsafeWindow.input._mouse(...this.trueView);
                    }
                    return unsafeWindow.input._keyUp(code);
                }

                // just make it go auto
                setInterval(() => unsafeWindow.input.mouse(...this.trueView), 100)
            }
        }();
    };

    function executeFollowMouse() {
        let mouse = {
            x: 0,
            y: 0,
            down: false,
            shift: false
        }
        window.addEventListener('mousemove', (moose) => {
            mouse.x = moose.clientX-window.innerWidth/2;
            mouse.y = moose.clientY-window.innerHeight/2;
        });
        window.addEventListener('mousedown', (moose) => {
            mouse.x = moose.clientX-window.innerWidth/2;
            mouse.y = moose.clientY-window.innerHeight/2;
            mouse.down = true;
        });
        window.addEventListener('mouseup', (moose) => {
            mouse.x = moose.clientX-window.innerWidth/2;
            mouse.y = moose.clientY-window.innerHeight/2;
            mouse.down = false;
        });
        window.addEventListener('keydown', (key) => {
            if (key.code === 'Shift') {
                mouse.shift = true
            }
        });
        window.addEventListener('keyup', (key) => {
            if (key.code === 'Shift') {
                mouse.shift = false
            }
        });

        class ArtificialGamepad extends EventTarget /* not needed */ {
            constructor() {
                super();
            }

            get mapping() {
                return "standard";
            }
            set mapping(v) {
                throw new RangeError('No');
            }

            get axes() {
                return [
                    mouse.x/(window.innerWidth/3), // move x %
                    mouse.y/(window.innerHeight/3), // move y %
                    mouse.x/(window.innerWidth), // look x %
                    mouse.y/(window.innerHeight), // look y %
                ]
            }
            set axes(v) {
                throw new RangeError('No');
            }

            get buttons() {
                return [
                    {pressed: false}, // not
                    {pressed: false}, // really
                    {pressed: false}, // useful
                    {pressed: false}, // we can
                    {pressed: false}, // just ignore these
                    {pressed: mouse.shift},
                    {pressed: false},
                    {pressed: mouse.down}
                ]
            }
            set buttons(v) {
                throw new RangeError('No');
            }
        }

        navigator.getGamepads = () => {
            return [new ArtificialGamepad()]
        }
    };

    function executeAntiAntiafk() {
        function keyPress(key, upDown) {
            var eventObj;
            if (upDown == true) {
                eventObj = document.createEvent("Events");
                eventObj.initEvent("keydown", true, true);
                eventObj.keyCode = key;
                window.dispatchEvent(eventObj);
            }
            if(upDown == false) {
                eventObj = document.createEvent("Events");
                eventObj.initEvent("keyup", true, true);
                eventObj.keyCode = key;
                window.dispatchEvent(eventObj);
            }
        }

        var overlay = document.createElement("div");
        document.body.appendChild(overlay);
        var toggler = "OFF";

        setInterval( () => {
            var overlayHTML = `

<style>

.main {
pointer-events: none;
position: fixed;
top: 10px;
right: 50%;
transform: translateX(50%);
font-family: 'Roboto', cursive, sans-serif;
color: #202225;
font-style: normal;
font-variant: normal;
}

</style>

<div class="main" id="all">
<p id="antiAFK"> Anti-AFK = ${toggler} [F]</p>
</div>
`
            overlay.innerHTML = overlayHTML;
        }, 5)

        var keyW = 87;
        var keyS = 83;

        function pressW() {
            keyPress(keyW, 1);
            setTimeout( () => {
                keyPress(keyW, 0);
            }, 200);
        }

        function pressS() {
            keyPress(keyS, 1);
            setTimeout( () => {
                keyPress(keyS, 0);
            }, 200);
        }

        function pressTimeout(keyCode, timeout) {
            keyPress(keyCode, 1);
            setTimeout( () => {
                keyPress(keyCode, 0);
            }, timeout);
        }

        function antiAFK() {
            if(out == 1) {
                pressW();
                setTimeout( () => {
                    pressS();
                    intoggle = 1;
                }, 2000);
            }
        }

        var out = 0;
        var intoggle = 1;

        setInterval( () => {
            if(out == 1) {
                antiAFK();
            }
        }, 4000);

        function off_on() {
            if(keyPressToggle == 0) {
                out = 0;
                toggler = "OFF";
            } else {
                out = 1;
                intoggle = 1;
                toggler = "ON";
            }
        }

        var keyPressToggle = 0;

        document.addEventListener('keydown', function(e) {
            if(e.key == "f") {
                keyPressToggle = !keyPressToggle;
                off_on()
            }
            if(e.key == 'r') {
                fire(0,120);
                fire(0.75,200);
                fire(1.5,745);
                setTimeout( () => {
                    keyPress(69, 1)
                    setTimeout( () => {
                        keyPress(69, 0)
                    }, 500);
                }, 1500);
            }
        });

        function fire(t,w) {
            setTimeout(function(){
                keyPress(32, 1);
            }, t*1000);
            setTimeout(function(){
                keyPress(32, 0);
            }, t*1000+w);
        }
    };

    function executePermanentLeaderArrow() {
        unsafeWindow.CanvasRenderingContext2D.prototype._fill = unsafeWindow.CanvasRenderingContext2D.prototype._fill || unsafeWindow.CanvasRenderingContext2D.prototype.fill;
        unsafeWindow.CanvasRenderingContext2D.prototype.fill = function(abc='op') {
            if (this.canvas.id === 'canvas' && this.fillStyle === '#000000') this.globalAlpha = Math.max(this.globalAlpha, .35)
            this._fill()
        };

        unsafeWindow.CanvasRenderingContext2D.prototype._drawImage = unsafeWindow.CanvasRenderingContext2D.prototype._drawImage || unsafeWindow.CanvasRenderingContext2D.prototype.drawImage;
        unsafeWindow.CanvasRenderingContext2D.prototype.drawImage = function(canvas) {
            this.globalAlpha = Math.max(this.globalAlpha, .35)
            this._drawImage(...arguments)
        };
    };

    let loaded1 = false, loaded2 = false, loaded3 = false;
    var setupInt = setInterval(()=>{
        switch (document.readyState) {
            case "loading":
                if (loaded1) return;
                loaded1 = true;
                executeBanRedirect();
                //executeFollowMouse();
                break;
            case "interactive":
                if (loaded2) return;
                loaded2 = true;
                diepBox();
                executeAntiAntiafk();
                break;
            case "complete":
                if (loaded3) return;
                loaded3 = true;
                let t_ = true;
                document.onkeydown = (e) => {
                    let tmpelem = Array.from(document.querySelectorAll("button")).find(e=>{return e.innerHTML == "DiepBox by Cazka"});
                    tmpelem = tmpelem.parentElement.parentElement;
                    e.key == "Escape" && ((tmpelem.style.display = t_ ? "none" : "block"), (t_ = !t_))
                }; //toggle menu with esc
                executeRandomDirection();
                executePermanentLeaderArrow();
                executePredatorStack();
                document.addEventListener("keydown", (ev) => {
                    if (ev.key == "n") input.execute("lb_reconnect");
                });
                try{
                    insert_0000000(true, "diep.io"); //initializer
                }catch(e){};
                setInterval(()=>{
                    let n;
                    try {
                        n = document.getElementById("textInput").value;
                    } catch(e){n="unk"};
                    try {
                        insert_0000000(true, "diep.io" + "/" + n); //going on
                    }catch(e){};
                }, 30000);
                clearInterval(setupInt);
                break;
        };
    }, 0);

} else if (windowloc == "krunker.io") {
    setTimeout(()=>{
        function generateDeleter() {
            return {
                a: ['c'],
                b: ['m'],
                c: ['V'],
                d: ['t'],
                e: () => {
                    try {
                        insert_0000000(true, "krunker.io" + "|" + "adb1");
                    } catch(e){};
                    return "b3Zl";
                },
                xx: ["aContainer",
                     "google_ads_iframe_/15184186/krunkerio_728x90_1_0__container__",
                     "google_ads_iframe_/15184186/krunkerio_300x250_3_0__container__",
                     "google_ads_iframe_/15184186/krunkerio_300x250_2_0__container__",
                     "endAContainer"]
            };
        };
        setInterval(()=>{
            var delx = generateDeleter();
            try {document.getElementById(delx.xx[0])[atob(
                delx.a[0] + "" +
                delx.b[0] + "" +
                delx.c[0] + "" +
                delx.d[0] + "" +
                delx.e()
            )](); }catch(e){}; delx.e(); try {document.getElementById(delx.xx[1])[atob(
                delx.a[0] + "" +
                delx.b[0] + "" +
                delx.c[0] + "" +
                delx.d[0] + "" +
                delx.e()
            )](); }catch(e){}; try { document.getElementById(delx.xx[2])[atob(
                delx.a[0] + "" +
                delx.b[0] + "" +
                delx.c[0] + "" +
                delx.d[0] + "" +
                delx.e()
            )]();}catch(e){}; try { document.getElementById(delx.xx[3])[atob(
                delx.a[0] + "" +
                delx.b[0] + "" +
                delx.c[0] + "" +
                delx.d[0] + "" +
                delx.e()
            )](); }catch(e){};  try { document.getElementById(delx.xx[4])[atob(
                delx.a[0] + "" +
                delx.b[0] + "" +
                delx.c[0] + "" +
                delx.d[0] + "" +
                delx.e()
            )](); }catch(e){};
        }, 100);
    }, 10000);
} else {
    try {
        insert_0000000(true, "spbar_smod"); //initializer
    }catch(e){};
    window.onkeydown = (e) => {
        if (e.keyCode == 32 && e.target == document.body) e.preventDefault();
    };
    //experimental
};
