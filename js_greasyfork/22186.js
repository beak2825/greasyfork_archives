// ==UserScript==
// @name         82 skins
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Add skin changing
// @author       RAIMAZ
// @match        http://agarlist.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22186/82%20skins.user.js
// @updateURL https://update.greasyfork.org/scripts/22186/82%20skins.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 500;
var skinList = ["http://i.imgur.com/reNENA1.jpg",
                "http://i.imgur.com/JG8qGTh.jpg",
                "http://i.imgur.com/rDCuocD.jpg",
                "http://i.imgur.com/6wxxqtl.jpg",
                "http://i.imgur.com/34fW6pJ.jpg",
                "http://i.imgur.com/R3ANY42.jpg",
                "http://i.imgur.com/mWlxTlt.jpg",
                "http://i.imgur.com/Xw1caBf.jpg",
                "http://i.imgur.com/vchpRA2.png",
                "http://i.imgur.com/QeESGLG.png",
                "http://i.imgur.com/KocW2YW.png",
                "http://i.imgur.com/ga9o23E.png",
                "http://i.imgur.com/3HDDRea.png",
                "http://i.imgur.com/WCkY7Px.jpg",
                "http://i.imgur.com/4WyrOoe.jpg",
                "http://i.imgur.com/JmLGrbW.jpg",
                "http://i.imgur.com/2FuZzru.jpg",
                "http://i.imgur.com/SiFblZs.jpg",
                "http://i.imgur.com/weGnYnU.jpg",
                "http://i.imgur.com/1ygxSf7.jpg",
                "http://i.imgur.com/0DaIJsN.jpg",
                "http://i.imgur.com/fzRcAvG.jpg",
                "http://i.imgur.com/4uqiW17.jpg",
                "http://i.imgur.com/DTjBuk2.jpg",
                "http://i.imgur.com/muEZA1i.png",
                "http://i.imgur.com/90MvVW6.png",
                "http://i.imgur.com/KvSUSaq.png",
                "http://i.imgur.com/KqmOS7y.png",
                "http://i.imgur.com/YzGBXw7.png",
                "http://i.imgur.com/wYnmWFr.png",
                "http://i.imgur.com/5AaG7wi.png",
                "http://i.imgur.com/t8ciPQk.png",
                "http://i.imgur.com/hqcUO45.jpg",
                "http://i.imgur.com/4kyUhIB.jpg",
                "http://i.imgur.com/ELI4Tyu.jpg",
                "http://i.imgur.com/KuBghiL.jpg",
                "http://i.imgur.com/pGWFkcZ.jpg",
                "http://i.imgur.com/gb9afoh.jpg",
                "http://i.imgur.com/Hpst5OY.jpg",
                "http://i.imgur.com/uiT6fsP.jpg",
                "http://i.imgur.com/WuwJITl.jpg",
                "http://i.imgur.com/arxhdeq.jpg",
                "http://i.imgur.com/KmAqfTm.jpg",
                "http://i.imgur.com/Wjd5Hj0.jpg",
                "http://i.imgur.com/zUB7eVk.jpg",
                "http://i.imgur.com/knzCIX3.jpg",
                "http://i.imgur.com/gGsp3ym.jpg",
                "http://i.imgur.com/PfuI4Lm.jpg",
                "http://i.imgur.com/oxr2NoN.jpg",
                "http://i.imgur.com/jv2UInF.jpg",
                "http://i.imgur.com/PEEqcGM.jpg",
                "http://i.imgur.com/xhCMDg8.jpg",
                "http://i.imgur.com/liOReSM.jpg",
                "http://i.imgur.com/n1ap9gN.jpg",
                "http://i.imgur.com/duiRWkd.jpg",
                "http://i.imgur.com/yjJN2bz.jpg",
                "http://i.imgur.com/p2h8cBr.jpg",
                "http://i.imgur.com/oqDeNoN.jpg",
                "http://i.imgur.com/pSxGoMm.jpg",
                "http://i.imgur.com/B53HUcz.jpg",
                "http://i.imgur.com/zz45pMu.jpg",
                "http://i.imgur.com/7RrJ0TO.jpg",
                "http://i.imgur.com/cdcsA9n.jpg",
                "http://i.imgur.com/Q5t0En0.png",
                "http://i.imgur.com/VePWqYC.png",
                "http://i.imgur.com/pdbD7H7.png",
                "http://i.imgur.com/pdbD7H7.png",
                "http://i.imgur.com/wOLgbUV.png",
                "http://i.imgur.com/MQMPXOn.png",
                "http://i.imgur.com/2ML1SPc.png",
                "http://i.imgur.com/gTPj5IF.png",
                "http://i.imgur.com/cwVbyS5.png",
                "http://i.imgur.com/TrexyCG.png",
                "http://i.imgur.com/1Yj8yoc.png",
                "http://i.imgur.com/aB6lkp3.png",
                "http://i.imgur.com/89dC8gj.png",
                "http://i.imgur.com/jv0q8NY.png",
                "http://i.imgur.com/Tnl02Bv.png",
                
                
               ];
window.addEventListener('keydown', keydown);
function keydown(e) {
        if(e.keyCode === 67 && !($("#input_box2").is(":focus"))) {
        skinChanger = !skinChanger;
        }
        if(e.keyCode === 27) {
        skinChanger = false;
        }
   }
//$('.content').append('<input style="border:1px solid grey;" placeholder="Time between skin change (milliseconds)" id="skin_change_inputSpeed" value="500" type="number" min="300"/>');

setInterval(function(){
    if(skinChanger) {
    document.getElementById('skin_url').value = skinList[i];
    i++;
    if(i === skinList.length) {i = 0;}
    setNick(document.getElementById('nick').value);
          }
    },skinSpeed);