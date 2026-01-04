// ==UserScript==
// @name         BonkBarChanger
// @namespace    http://tampermonkey.net/
// @version      03
// @description  you can change the style in the script
// @author       emiya440
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @icon         https://th.bing.com/th/id/R.e588f8b82dacfdb99da9733090a76bbc?rik=qU8O3Po%2bxtZjbw&pid=ImgRaw&r=0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502641/BonkBarChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/502641/BonkBarChanger.meta.js
// ==/UserScript==
//ZONE YOU CAN CHANGE THE SCRIPT
//colorsBar
var MYcolor = "blue"; //put your color do you want
//ImagesSkinBar
var skinImage = "https://cdn.discordapp.com/attachments/932438729870676038/1269795342732361810/image.png?ex=66b15c91&is=66b00b11&hm=7d0dddfeff847a2e3bc06cc6257a04e3a4fc7c4949346c3f6108fbb098894c22&"; //HTTPS IMAGES
//NameBar
var Name_or_User = "FusseGG"; //CHANGE YOUR NAME
//////////////////////////////




//NOT THIS ZONE
var targeter = null;
var TargeterBgPrettyTopBar = null;
var TargeterSkinPrettySmallPreview = null;
var TargeterNamePrettyTopName = null;
//try to find the topbar
var top_bar = document.body.childNodes[1]
//
const repetement = setInterval(() => {
    if (top_bar) {
        //console.info("Taked 😗 1");
        if (top_bar.childNodes[1]) {
            //console.info("Taked 😲 2");
            if (top_bar.childNodes[1].childNodes[8]) {
                //console.info("Taked 😍 3");
                targeter = top_bar.childNodes[1].childNodes[8];
                //console.log(targeter);
                if (targeter.childNodes[1]) {
                    //console.info("Taked 🥰 4");
                    TargeterBgPrettyTopBar = targeter.childNodes[1];
                    //console.log(TargeterBgPrettyTopBar);
                    if (TargeterBgPrettyTopBar.childNodes[1].childNodes[2]) {
                        //console.info("Taked 🥵 5");
                        TargeterSkinPrettySmallPreview = TargeterBgPrettyTopBar.childNodes[1].childNodes[2];
                        //console.log(TargeterSkinPrettySmallPreview);
                        if (TargeterBgPrettyTopBar.childNodes[1].childNodes[3]) {
                            //console.info("Taked 😫 6");
                            TargeterNamePrettyTopName = TargeterBgPrettyTopBar.childNodes[1].childNodes[3];
                            //console.log(TargeterNamePrettyTopName);
                            if (TargeterBgPrettyTopBar && TargeterSkinPrettySmallPreview && TargeterNamePrettyTopName) {
                                TargeterNamePrettyTopName.childNodes[0].textContent = Name_or_User;
                                TargeterBgPrettyTopBar.childNodes[1].style.backgroundColor = 0xfff;
                                TargeterSkinPrettySmallPreview.previousSibling.childNodes[0].src = skinImage;
                                //console.info("Taked 💀 final");
                                //console.log(TargeterBgPrettyTopBar.childNodes[1].style.backgroundColor)
                                //console.log(TargeterSkinPrettySmallPreview.previousSibling.childNodes[0].src)
                                //console.log(TargeterNamePrettyTopName.childNodes[0].textContent)
                            }
                            else {
                                return;
                            }
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                }
                else {
                    return;
                }
            } else {
                return;
            }
        }
        else {
            return;
        }
    }
    else {
        return;
    }
},30)