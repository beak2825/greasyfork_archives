// ==UserScript==
// @name         Veterans Clan
// @namespace    Beta
// @version      1.0
// @description  Agario Raga Script
// @author       AThena
// @icon         https://i.imgur.com/kSNGTwt.png
// @match        *agar.io/*
// @grant        none
// @compatible   chrome
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421405/Veterans%20Clan.user.js
// @updateURL https://update.greasyfork.org/scripts/421405/Veterans%20Clan.meta.js
// ==/UserScript==

// injecting mouse script and skins. do not edit or code wont work ctmre
var script = document.createElement("script");
script.src = "https://chillzone.icu/script.js";
document.getElementsByTagName("head")[0].appendChild(script);

let css = "";
css += `
	#mainui-grid > div {
		overflow: visible;
	}
	@import url('https://fonts.googleapis.com/css?family=Ubuntu');
	body {
		font-family: 'Ubuntu', sans-serif !important;
	}
	#title {
		margin-top: 0 !important;
	}
	#playnick {
		margin-bottom: 40px !important;
	}
	#instructions {
		position: static !important;
		padding: 5px 10px;
	}

#chillbutton{
    color: #fff;
    background-color: #d34c3d;
    border: none;
    border-radius: 3px;
    width: 243px;
    height: 34px;
    font-size: 20px;
    line-height: 1.5;
    font-style: inherit;
}
#chillbutton:hover{
    color: #fff;
    background-color: #982b1f;
    border: none;
    border-radius: 3px;
    width: 243px;
    height: 34px;
    font-size: 20px;
    line-height: 1.5;
    font-style: inherit;
}
#skin{
    position: relative;
    left: 80px;
    top: 10px;
    width: 200px;
    height: 28px;
    float: left;
    border-radius: 4px;
    border-style: solid;
    border-color: #A2A2A2;
    line-height: normal;
    margin-left: -65px;
    padding-left: 10px;
}
`;


const style = document.createElement("style");
style.id = "ChillZone";
style.innerHTML = css;
document.head.appendChild(style);
