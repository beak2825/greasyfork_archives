// ==UserScript==
// @name         USAD Training Center BetterUI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Makes UI slightly more comfortable
// @author       bob4koolest
// @match        https://usad.enlyght.com/tc/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432301/USAD%20Training%20Center%20BetterUI.user.js
// @updateURL https://update.greasyfork.org/scripts/432301/USAD%20Training%20Center%20BetterUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("%cAcaDec TC BetterUI | Written by bob4koolest", "background: #0090ff; font-size: 14px; color: #ffffff; padding: 10px; font-family: Verdana; border-radius: 5px;");
    console.log("%cNotice any glitches or things that need improved? DM me through Discord at bob4koolest#3622", "font-size: 14px;");
    console.log("%c---Script Init---", "font-size: 14px;");

    function customlog(text) {
        console.log("%c[Acadec TC BetterUI]", "color: #0090ff", text);
    }

    function customCSS(name, customcss) {
        var css = customcss,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
        customlog("Injected CSS: " + name);
    }

    function prepareResources() {
        var openSans = document.createElement("link");
        openSans.type = "text/css";
        openSans.rel = "stylesheet";
        openSans.href = "https://fonts.googleapis.com/css?family=Open+Sans:400,300,700";
        document.getElementsByTagName('head')[0].appendChild(openSans);

        //custom radio input css
        customCSS("hide radio input", '[type="radio"]{opacity:0;}');
        customCSS("custom style fake radio input", '[type="radio"] + label{ position:relative; padding-left:30px; cursor:pointer; display:inline-block; color:#666; line-height:25px; } [type="radio"] + label::before{ content:""; position:absolute; left:0; top:0; width:15px; height:15px; border-radius: 100%; border:2px solid #337ece; background:#fff; } [type="radio"]:checked + label::after{ content:""; position:absolute; left:4px; top:4px; width:11px; height:11px; border-radius:100%; background:#337ece; transform:scale(1); opacity:1; transition:all .3s ease; } [type="radio"]:not(:checked) + label::after{ content:""; position:absolute; left:4px; top:4px; width:14px; height:14px; border-radius:100%; background:#337ece; transform:scale(0); opacity:0; } }');

    }

    function change () {
        document.body.style.fontFamily = "Open Sans";
        document.getElementsByClassName("topMenu")[0].style.width = "-webkit-calc(100% - 10px)";
        document.getElementsByClassName("centerDiv")[0].style.width = "-webkit-calc(100% - 470px)";
        document.getElementById("container").style.width = "100%";
        document.getElementById("container").style.background = "#ffffff";
        document.getElementsByClassName("topDiv")[0].style.background = "#104e93";
        document.body.style.background = "#ffffff";
        document.getElementsByClassName("topDiv")[0].style.height = "40px"; //80px with image
        document.body.style.overflowX = "hidden";

        //topbar
        var element = document.getElementById("ctl00_PnlLogin");
        if (typeof(element) != "undefined" && element != null) {
          //not logged in
          document.getElementsByClassName("topDiv")[0].style.marginTop = "-25px"; //placeholder in case of future updates
          document.getElementsByClassName("topDiv")[0].style.marginRight = "-20px";
          document.getElementsByClassName("topDiv")[0].innerHTML='<div style="position: relative; font-size: 25px; color: #ffffff; padding: 5px; font-family: Tahoma">AcaDec Training Center</div><DIV ID="logindropdown" ONCLICK="if (document.getElementById(`ctl00_PnlLogin`).style.display === `none`) { document.getElementById(`ctl00_PnlLogin`).style.display = `block`; } else { document.getElementById(`ctl00_PnlLogin`).style.display = `none`; }" STYLE="position: relative; margin-top: -21px; margin-right: 10px; bottom: 10px; font-size: 15px; font-family: Tahoma; background: #104e93; -webkit-box-shadow: 0px 0px 13px -5px #000000; box-shadow: 0px 0px 13px -5px #000000; padding: 7px; border-radius: 10px; cursor: pointer; float: right;">Login ▽</DIV><div id="ctl00_PnlLogin" onkeypress="javascript:return WebForm_FireDefaultButton(event, `ctl00_BtnLogin`)" style="position: absolute; display: block; float: right; top: 35px; padding: 10px !important; right: 0px; height: 80px; margin-top: 5px; display: none"> <table style="border-collapse: collapse; background: white; color: #104e93 !important; width: 100px;"><tbody><tr><td>Username<input name="ctl00$TbxUsername" type="text" id="ctl00_TbxUsername" class="loginTbx" tabindex="0"></td> </tr> <tr> <td>Password<input name="ctl00$TbxPassword" type="password" maxlength="10" id="ctl00_TbxPassword" class="loginTbx" tabindex="0"></td> </tr> <tr> <td style="text-align: left"><a href="javascript:void(0);" style="color: #acf;" onclick="showForgotPassword()" tabindex="0">Forgot your password?</a></td></tr><tr><td><input type="submit" name="ctl00$BtnLogin" value="Login" id="ctl00_BtnLogin" class="blueBtn" style="width: 100px;" tabindex="0"></td></tr></tbody></table></div>';
        } else {
          //is logged in
          document.getElementsByClassName("topDiv")[0].style.marginTop = "-25px";
          document.getElementsByClassName("topDiv")[0].style.marginRight = "-10px";
          document.getElementById("ctl00_ImgAvatar").style.borderRadius = "100%";
          document.getElementById("ctl00_ImgAvatar").style.height = "45px";
          document.getElementById("ctl00_ImgAvatar").style.width = "45px";
          document.getElementById("ctl00_ImgAvatar").style.objectFit = "cover";
          var imageu = document.getElementById("ctl00_ImgAvatar").src;
          var usernameu = document.getElementById("ctl00_PnlAvatar").getElementsByTagName('div')[0].innerText;
          document.getElementById("ctl00_PnlAvatar").style.background = "#ffffff";
          document.getElementById("ctl00_PnlAvatar").style.border = "none";
          document.getElementById("ctl00_PnlAvatar").innerHTML = "<DIV STYLE='width: -webkit-calc(100% - 15px); border-radius: 10px; background: #ffffff; -webkit-box-shadow: 0px 0px 13px -5px #000000; box-shadow: 0px 0px 13px -5px #000000; padding: 5px;'><TABLE STYLE='border-collapse: collapse'><TR><TD><IMG SRC='" + imageu + "' STYLE='padding: 5px; border-radius: 100%; height: 45px; width: 45px; object-fit: cover; display: inline;'></IMG></TD><TD><DIV STYLE='display: inline; font-family: tahoma; font-size: 20px;'>" + usernameu + "</DIV></TD></TR></TABLE></DIV>";

          document.getElementsByClassName("topDiv")[0].innerHTML="<div style='font-size: 25px; color: #ffffff; padding: 5px; font-family: Tahoma'>AcaDec Training Center</div>";
        }

        //bottom bar
        var anchors = document.getElementsByTagName('div');
        for(var i=0;i<anchors.length;i++) {
            if(anchors[i].innerHTML.includes("©" + new Date().getFullYear() + " Norsoft Software. All rights reserved.") == true) {
                customlog("Added divider line to div #" + i);
                document.getElementsByTagName('div')[i].style.maxHeight = "30px";
                document.getElementsByTagName('div')[i].style.display = "absolute";
                document.getElementsByTagName('div')[i].style.bottom = "0";
                document.getElementsByTagName('div')[i].style.width = "-webkit-calc(100% - 10px)";
                document.getElementsByTagName('div')[i].style.borderTop = "1px solid #cccccc";
                document.getElementsByTagName('div')[i].style.marginTop = "25px";
            }

        }

        //set minimum font size
        var indexdiv = document.getElementsByTagName("*");
        for(var j=0; j<indexdiv.length; j++) {
            if(indexdiv[j].style.fontSize === "8pt" || indexdiv[j].style.fontSize === "6pt" || indexdiv[j].style.fontSize === "9px") {
                indexdiv[j].style.fontSize = "12px";
            }

        }

        document.body.style.fontSize = "12px";

    }

    function pkage() {
        prepareResources();
        change();
    }

    pkage();
})();