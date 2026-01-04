// ==UserScript==
// @name All the anime top buttons TEST VERS
// @namespace http://tampermonkey.net/
// @website https://animetopbtns.github.io/website/
// @version 2.4 Added Kuroiru support
// @description (THIS IS A TEST BUILD AND MAY BE BROKEN) All the anime top buttons (has MAL-Sync support)
// @author WhiteTapeti
// @license MIT
// @match *://vrv.co/*
// @match *://*.static.vrv.co/*
// @match *://*.crunchyroll.com/*
// @match *://*.static.crunchyroll.com/*
// @exclude *store.crunchyroll.com/*
// @match *://*.zoro.to/*
// @match *://*.aniwatch.to/*
// @match *://*.9anime.to/*
// @match *://*.9anime.pl/*
// @match *://*.9anime.ph/*
// @match *://*.9anime.id/*
// @match *://*.9anime.is/*
// @match *://*.9anime.ru/*
// @match *://*.9anime.ch/*
// @match *://*.9anime.nl/*
// @match *://*.9anime.live/*
// @match *://*.9anime.one/*
// @match *://*.9anime.page/*
// @match *://*.9anime.video/*
// @match *://*.9anime.life/*
// @match *://*.9anime.love/*
// @match *://*.9anime.tv/*
// @match *://*.9anime.me/*
// @match *://*.9anime.id/*
// @match *://*.9anime.club/*
// @match *://*.9anime.center/*
// @match *://*.9anime.gs/*
// @match *://*.9animehq.to/*
// @match *://*.9animeto.io/*
// @match *://*.aniwave.to/*
// @match *://*.aniwave.tv/*
// @match *://*.aniwave.bz/*
// @match *://*.aniwave.ws/*
// @match *://*.animepahe.ru/*
// @match *://*.animepahe.com/*
// @match *://*.animepahe.org/*
// @match *://*.kissanime.ru/*
// @match *://*.kissanime.pro/*
// @match *://www19.gogoanime.io/*
// @match *://www2.gogoanime.video/*
// @match *://gogoanime.sk/*
// @match *://gogoanime.tel/*
// @match *://gogoanime.news/*
// @match *://www1.gogoanime.bid/*
// @match *://gogoanime.ar/*
// @match *://gogoanimehd.io/*
// @match *://*.anilist.co/*
// @match *://*.anichart.net/*
// @match *://*.myanimelist.net/*
// @match *://*.kitsu.io/*
// @match *://*.kuroiru.co/*
// @match *://*.kissmanga.com/*
// @match *://*.mangadex.org/*
// @match *://*.mangareader.to/*
// @match *://*.readmanganato.com/*
// @match *://*.manganato.com/*
// @match *://*.animekisa.tv/*
// @match *://*.animeflv.net/*
// @match *://*.jkanime.net/*
// @match *://*.turkanime.net/*
// @match *://*.4anime.to/*
// @match *://*.animeultima.to/*
// @match *://*.animelab.com/*
// @match *://*.animesimple.com/*
// @match *://*.animesuge.to/*
// @match *://*.animeflix.live/*
// @match *://*.animeflix.icu/*
// @match *://*.hidive.com/*
// @match *://*.yugen.to/*
// @match *://*.animension.to/*
// @match *://*.funimation.com/*
// @match *://*.animixplay.to/*
// @match *://animethemes.moe/*
// @match *://theindex.moe/*
// @match *://everythingmoe.com/*
// @match *://*.livechart.me/*
// @match *://*.allanime.co/*
// @match *://*.allanime.to/*
// @match *://*.allanime.com/*
// @match *://chiaki.site/*
// @match *://comick.app/*
// @match *://*.anime-planet.com/*
// @match *://*.mangafire.to/*
// @grant none
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAMAAACJuGjuAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAdFQTFRFAAAAZ0n/Z0n/Zkj/aEr/Z0n/cFP/e2H/fmX/hGz/iXH/iHD/b1P/eV//kXz/o5H/pZP/////opD/jnj/d1z/fGL/m4f/mIP/blH/kHr/jXb/bE//a07/lYD/kn3/aUv/jHX/eF3/oY7/dFj/oI3/nIn/clb/blL/gGf/emD/dVn/cVX/a03/aEr/gmr/dlv/lH//hWz/fmT/c1f/oo//nYn/mYX/inP/loH/jXf/pJL/hW3/gWn/akz/nov/jnf/hm7/knz/dlr/k37/39j/8e7/nor/6eT/8/D/kXv/3df/5N//qpr/7Oj/s6T/iXL/wLP/8O3/9fL/yL3/2dH/+vn/+/r/3db/sqL/jHb/ppT/x7z/497/8/H//v7/39n/xrv/qpn/j3n/sKD/tab/uq3/v7L/w7f/wbX/wrb/wLT/wbT/uqz/r5//i3X/iHH/oY//nIj/+vj/+ff/3tj/3NX/vrH/n4z/6OT/5+L/u63//f3/z8X/zcP/mIT/1Mv/0sn/loL/vK7/6+f/t6j/tKX/i3T/187/4tz/6eX/5N7/4dv/qJb/9vT/9fT/2dL/rJz/taf/5uH/5eD/7uv/0cj/5+P/tKb/w7j/wrf/wrX/joebXwAAAJt0Uk5TAP/1wV39//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9Amw73AAAZhElEQVR4nO3dCZ8c1XXG4VklwFpq0IIFEkILQou1IFkqSQiBTAhWbKdwYpyQBWNHiSQMM1kc4sSOnBXbiZOQffm0qe6ent6qq29V3Xvfc859n58NSMim65w/Na2eO9NLSzRjuSH04yXJVprmVGUVfRUkhpegpq2gr4qAQhQ1CX2FFFn4pJhXYtbiNjWyhr5yCgbV1Ah6AuQdOqkR9CTIlyC/7euGv2lUD53QfOjJUGvodBZDT4gaW0U3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
// @downloadURL https://update.greasyfork.org/scripts/477434/All%20the%20anime%20top%20buttons%20TEST%20VERS.user.js
// @updateURL https://update.greasyfork.org/scripts/477434/All%20the%20anime%20top%20buttons%20TEST%20VERS.meta.js
// ==/UserScript==

var elemDivTopBtnMain = document.createElement('div');
elemDivTopBtnMain.id = "TopBtnMain";

document.body.append(elemDivTopBtnMain);


var elemDivTopBtnMainStyle = document.createElement('style');

elemDivTopBtnMainStyle.innerHTML = (`
#topBtnBoxThing {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 99;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}

#topBtnBoxThing svg {
	width: 43px !important;
	height: 43px !important;
	display: block;
	margin-left: auto;
	margin-right: auto;
}

#topBtn {
  min-height: 51px;
  min-width: 40.52px;
  -webkit-border-radius: 4px;
     -moz-border-radius: 4px;
          border-radius: 4px;
  font-size: 18px;
  border: none;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  font-family: "Open Sans", "Hiragino Sans", Arial, sans-serif;
  text-align: center;
  letter-spacing: 0px;
  padding: 0px;
}

#topBtnWithMal {
  display: none;
  position: fixed;
  bottom: 100px;
  right: 47px;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  font-family: "Open Sans", "Hiragino Sans", Arial, sans-serif;
  -webkit-border-radius: 4px;
     -moz-border-radius: 4px;
          border-radius: 4px;
  text-align: center;
  letter-spacing: 0px;
  padding: 0px;
}

#HideTopBtnButton {
  display: none;
  height: 40.52px;
  width: 51px;
  -webkit-border-radius: 4px;
     -moz-border-radius: 4px;
          border-radius: 4px;
  font-size: 18px;
  border: none;
  outline: none;
  cursor: pointer;
  background: rgba(158,158,158,.2);
  position: fixed;
  right: 26px;
  bottom: 70px;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  -moz-transition: 0.3s;
  transition: 0.3s;
  -webkit-filter: opacity(.4);
          filter: opacity(.4);
  letter-spacing: 0px;
  padding: 0px;
}

#HideTopBtnButton:hover {
	-webkit-filter: opacity(1);
	        filter: opacity(1);
}

#topBtnWithMal2 {
  display: none;
  height: 40.52px;
  width: 51px;
  -webkit-border-radius: 4px;
     -moz-border-radius: 4px;
          border-radius: 4px;
  font-size: 18px;
  border: none;
  outline: none;
  cursor: pointer;
  background: rgba(158,158,158,.2);
  position: fixed;
  right: 43px;
  bottom: 150px;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  -moz-transition: 0.3s;
  transition: 0.3s;
  -webkit-filter: opacity(.4);
          filter: opacity(.4);
  letter-spacing: 0px;
  padding: 0px;
}

#topBtnWithMal2:hover {
	-webkit-filter: opacity(1);
	        filter: opacity(1);
}

#HideTopBtnButton .hideTopBtnClr, #topBtnWithMal2 .hideTopBtnClr {
	width: 43px;
	height: 43px;
	margin-left: auto;
	margin-right: auto;
	display: block;
    fill: white;
}

#HideTopBtnButton svg, #topBtnWithMal2 svg {
  width: 43px;
  height: 43px;
}

#HideTopBtnButton:hover .hideTopBtnClr, #topBtnWithMal2:hover .hideTopBtnClr {
    fill: white;
}
`);
document.getElementById('TopBtnMain').append(elemDivTopBtnMainStyle);

var elemDivTopBtnMainBoxThingy = document.createElement('div');
elemDivTopBtnMainBoxThingy.id = "topBtnBoxThing";

elemDivTopBtnMainBoxThingy.innerHTML = (`
        <button id="HideTopBtnButton" onclick="HidetopBtn();">
        <svg width="43px" height="43px" version="1.1" viewBox="0 0 240 213.33" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
 <metadata>
  <rdf:RDF>
   <cc:Work rdf:about="">
    <dc:format>image/svg+xml</dc:format>
    <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
    <dc:title/>
   </cc:Work>
  </rdf:RDF>
 </metadata>
 <g transform="translate(-177.85 -81.809)">
  <path class="hideTopBtnClr" d="m193.23 292.53c-1.5085-1.6669-2.0814-3.7186-1.5822-5.6667 1.1768-4.5922 202.25-205.05 205.68-205.05 3.9762 0 7.6738 4.556 6.7196 8.2796-1.1768 4.5923-202.25 205.05-205.68 205.05-1.525 0-3.8368-1.1758-5.1374-2.6129zm83.951-28.186c-9.5246-2.1382-24.667-8.098-24.667-9.7086 0-0.86346 3.8223-5.3582 8.4939-9.9883l8.4939-8.4184 4.2943 2.2206c2.3618 1.2214 8.4491 3.087 13.527 4.1458 37.802 7.8819 72.525-26.842 64.643-64.643-1.0588-5.0782-2.9286-11.174-4.1552-13.545l-2.23-4.3124 11.391-11.391c10.624-10.624 11.612-11.29 14.678-9.8929 9.0474 4.1222 46.197 44.061 46.197 49.666 0 6.97-34.412 42.338-53.645 55.135-23.65 15.736-43.698 22.268-67.688 22.055-7.7-0.0685-16.4-0.66336-19.333-1.3219zm-56.898-28.762c-16.021-12.861-42.436-42.183-42.436-47.106 0-6.1439 31.676-39.697 49.333-52.256 12.225-8.6954 26.889-16.324 39.333-20.462 13.018-4.3286 37.057-5.9343 50.183-3.352 10.933 2.1509 26.484 7.9816 26.484 9.93 0 0.85289-3.8222 5.339-8.4939 9.9691l-8.4939 8.4184-4.2942-2.2206c-2.3618-1.2214-8.4491-3.087-13.527-4.1458-30.51-6.3616-60.289 14.852-65.178 46.431-1.535 9.9146 0.48901 23.633 4.6837 31.745l2.2235 4.2998-11.097 11.155c-6.1034 6.1352-11.814 11.155-12.691 11.155s-3.5898-1.6024-6.0294-3.5608zm71.231-14.713c-1.65-0.31781-3-1.2938-3-2.169 0-2.0394 37.526-39.557 39.566-39.557 2.848 0 3.446 10.129 1.0788 18.272-4.6606 16.032-21.549 26.554-37.645 23.454zm-26.245-27.726c-3.0656-16.341 10.052-34.042 27.579-37.216 6.0724-1.0994 14.333 0.27294 14.333 2.3812 0 1.9822-37.551 39.501-39.535 39.501-0.82587 0-1.8956-2.1-2.3771-4.6667z" fill="#0f0f0f" stroke-width="1.3333"/>
 </g>
</svg>
        </button>
        <button id="topBtn" title="Go to top" style="-ms-transform: rotate(90deg); /* IE 9 */-moz-transform: rotate(90deg); /* Firefox */-webkit-transform: rotate(90deg); /* Safari and Chrome */-o-transform: rotate(90deg); /* Opera */" oncontextmenu="return false" onselectstart="return false" ondragstart="return false">&lt;</button>
`);
document.getElementById('TopBtnMain').append(elemDivTopBtnMainBoxThingy);


var elemDivTopBtnMainScript = document.createElement('script');

elemDivTopBtnMainScript.innerHTML = (`
function scrollTop(el, value) {
    var win;
    if (el.window === el) {
        win = el;
    } else if (el.nodeType === 9) {
        win = el.defaultView;
    }

    if (value === undefined) {
        return win ? win.pageYOffset : el.scrollTop;
    }

    if (win) {
        win.scrollTo(win.pageXOffset, value);
    } else {
        el.scrollTop = value;
    }
}
//Get the button
var mybutton = document.getElementById("topBtnBoxThing");
var topBtn = document.getElementById("topBtn");
var HideTopBtnButton = document.getElementById("HideTopBtnButton");
var HideTopBtnButtonX = 0;
var HideTopBtnButtonXZ = "1400";

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() { scrollFunction() };
window.onclick = function() {
    HideTopBtnButtonXZ = (HideTopBtnButtonXZ == 1400) ? 1700 : 1400;
    window.setTimeout(scrollFunction, HideTopBtnButtonXZ);
};

function scrollFunction() {
    if (scrollTop(document) > 20 || scrollTop(document.documentElement) > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
    let x = document.getElementsByClassName("floatbutton floatHide")[0];
    let elementExists = document.getElementById("topBtnBoxThing");
    try {
        if ((!(document.getElementsByClassName("floatbutton floatHide").length == 0 || (document.getElementsByClassName("mobile-nav").length !== 0 && /anilist\.co/.test(location.hostname))) ^ ((!(document.getElementsByClassName("floatbutton")[0].style.display !== "") || !(document.getElementsByClassName("floatbutton")[0].style.display !== "none")) && document.getElementsByClassName("floatbutton").length !== "0")) == 0) {
            document.getElementById("topBtnBoxThing").id = "topBtnWithMal";
            document.getElementById("HideTopBtnButton").id = "topBtnWithMal2";
            if (HideTopBtnButtonX == 1) {
                document.getElementById("topBtnWithMal2").style.bottom = "100px";
            } else {
                document.getElementById("topBtnWithMal2").style.bottom = "150px";
            }
        } else {
            document.getElementById("topBtnWithMal").id = "topBtnBoxThing";
            document.getElementById("topBtnWithMal2").id = "HideTopBtnButton";
            if (HideTopBtnButtonX == 1) {
                document.getElementById("HideTopBtnButton").style.bottom = "25px";
            } else {
                document.getElementById("HideTopBtnButton").style.bottom = "70px";
            }
        }
    } catch (e) {
        //console.log(e);
    }
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementById("topBtn").addEventListener("contextmenu", (e) => {
            e.preventDefault();
            HidetopBtn('m');
        });

        document.getElementById("topBtn").addEventListener("onselectstart", (e) => {
            e.preventDefault();
            HidetopBtn('m');
        });

        document.getElementById("topBtn").addEventListener("ondragstart", (e) => {
            e.preventDefault();
            HidetopBtn('m');
        });

        if (elementExists !== null) {
            document.getElementById("HideTopBtnButton").style.right = "-2239px";
            if (document.getElementsByClassName("mobile-nav").length !== 0 && elementExists !== null) {
                document.getElementById("topBtnBoxThing").id = "topBtnWithMal";
                document.getElementById("HideTopBtnButton").id = "topBtnWithMal2";
                document.getElementById("topBtnWithMal").style.right = "24px";
                document.getElementById("topBtnWithMal").style.bottom = "79px";
            }
        } else {
            document.getElementById("topBtnWithMal2").style.right = "-2239px";
        }
    }

    if (/myanimelist\.net/.test(location.hostname)) {
        var topBtnn = document.getElementById("topBtn");
        document.getElementById("topBtn").style.backgroundColor = getComputedStyle(document.querySelector(".list-status-title"))["background-color"];
        let elementExistz = document.getElementById("elemScriptMalStlyeChange");
        if (elementExistz == null) {
            var elemScriptMalStlyeChange = document.createElement('style');
            elemScriptMalStlyeChange.id = "elemScriptMalStlyeChange";
            document.body.append(elemScriptMalStlyeChange);
            document.getElementById("elemScriptMalStlyeChange").innerHTML = ("#HideTopBtnButton:hover .hideTopBtnClr {	fill: " + getComputedStyle(document.querySelector(".list-status-title"))["background-color"] + "!important;}");
        }



        if (topBtnn.style.backgroundColor == "rgba(0, 0, 0, 0)") {
            topBtnn.style.backgroundColor = "#2e51a2";
        }
    }
    if (window.location.href.indexOf('https://anilist.co/user/') == 0) {
        document.getElementById("topBtn").style.backgroundColor = 'rgb(' + getComputedStyle(document.querySelector(".user-page-unscoped")).getPropertyValue("--color-blue") + ')';

        let elementExistz = document.getElementById("elemScriptAniStlyeChange");
        if (elementExistz == null) {
            var elemScriptAniStlyeChange = document.createElement('style');
            elemScriptAniStlyeChange.id = "elemScriptAniStlyeChange";
            document.body.append(elemScriptAniStlyeChange);
        }
        document.getElementById("elemScriptAniStlyeChange").innerHTML = ("#HideTopBtnButton:hover .hideTopBtnClr {	fill: rgb(" + getComputedStyle(document.querySelector('.user-page-unscoped')).getPropertyValue('--color-blue') + ")!important;}");

    } else if (window.location.href.indexOf('https://anilist.co/') == 0) {
        document.getElementById("topBtn").style.backgroundColor = '#3db4f2';

        let elementExistz = document.getElementById("elemScriptAniStlyeChange");
        if (elementExistz == null) {
            var elemScriptAniStlyeChange = document.createElement('style');
            elemScriptAniStlyeChange.id = "elemScriptAniStlyeChange";
            document.body.append(elemScriptAniStlyeChange);
        }
        document.getElementById("elemScriptAniStlyeChange").innerHTML = ("#HideTopBtnButton:hover .hideTopBtnClr {	fill: #3db4f2!important;}");

    }
    if (window.location.href.indexOf('https://readmanganato.com/') == 0 && $("body").css("backgroundColor") == "rgb(90, 84, 84)" || window.location.href.indexOf('https://manganato.com/') == 0 && $("body").css("backgroundColor") == "rgb(90, 84, 84)") {
        document.getElementById("topBtn").style.backgroundColor = '#2a524a';
    } else if (window.location.href.indexOf('https://readmanganato.com/') == 0 || window.location.href.indexOf('https://manganato.com/') == 0) {
        document.getElementById("topBtn").style.backgroundColor = '#ff530d';
    }
}

var topBtnTapTimes = 1;

const topBtnClickDelay = ms => new Promise(res => setTimeout(res, ms));

// When the user clicks on the button, scroll to the top of the document
document.getElementById("topBtn").addEventListener('click', (e) => {
    if (e.shiftKey) {
        window.scrollTo(0, document.body.scrollHeight + 99999)
    } else {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            let elementExistz = document.getElementById("elemScriptAniStlyeShiftChange");
            if (elementExistz == null) {
                var elemScriptAniStlyeShiftChange = document.createElement('style');
                elemScriptAniStlyeShiftChange.id = "elemScriptAniStlyeShiftChange";
                document.body.append(elemScriptAniStlyeShiftChange);
            }
            document.getElementById("elemScriptAniStlyeShiftChange").innerHTML = ("#topBtn { transform: rotate(270deg)!important}button#topBtn:after{content:'?';transform:rotate(90deg);position:absolute;right:16px;top:27px}");
            document.getElementById("topBtn").title = "Go to bottom"
            topBtnTap(e);
        } else {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0
        }

    }
}, false);

const topBtnTap = async(e) => {
    topBtnTapTimes = e.detail;
    if (e.detail === 1) {
        await topBtnClickDelay(300);
        if (topBtnTapTimes >= 2) {
            return false;
        } else {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            document.getElementById("elemScriptAniStlyeShiftChange").innerHTML = ("#topBtn { transform: rotate(90deg)!important}");
            document.getElementById("topBtn").title = "Go to top"

        }
    } else if (e.detail >= 2) {
        window.scrollTo(0, document.body.scrollHeight + 99999);
        document.getElementById("elemScriptAniStlyeShiftChange").innerHTML = ("#topBtn { transform: rotate(90deg)!important}");
        document.getElementById("topBtn").title = "Go to top"
    }
};

document.addEventListener("keydown", (e) => {
    if (e.shiftKey) {
        let elementExistz = document.getElementById("elemScriptAniStlyeShiftChange");
        if (elementExistz == null) {
            var elemScriptAniStlyeShiftChange = document.createElement('style');
            elemScriptAniStlyeShiftChange.id = "elemScriptAniStlyeShiftChange";
            document.body.append(elemScriptAniStlyeShiftChange);
        }
        document.getElementById("elemScriptAniStlyeShiftChange").innerHTML = ("#topBtn { transform: rotate(270deg)!important}");
        document.getElementById("topBtn").title = "Go to bottom"
    }

});

document.addEventListener("keyup", (e) => {
    if (e.shiftKey !== true) {
        document.getElementById("elemScriptAniStlyeShiftChange").innerHTML = ("#topBtn { transform: rotate(90deg)!important}");
        document.getElementById("topBtn").title = "Go to top"
    }
});


function HidetopBtn(e) {
    document.getElementById("topBtn").style.display = "none";
    HideTopBtnButtonX = (HideTopBtnButtonX == 0) ? 1 : 0;
    let elementExistz = document.getElementById("elemScriptAniStlyeHideChange");
    if (elementExistz == null) {
        var elemScriptAniStlyeHideChange = document.createElement('style');
        elemScriptAniStlyeHideChange.id = "elemScriptAniStlyeHideChange";
        document.body.append(elemScriptAniStlyeHideChange);
    }
    // if (e == 'm') {
    //     if (HideTopBtnButtonX == 1) {
    //         topBtn.style.display = "none";
    //         if (document.getElementById("HideTopBtnButton")) {
    //             document.getElementById("HideTopBtnButton").style.bottom = "25px";
    //             document.getElementById("HideTopBtnButton").setAttribute("onClick", "HidetopBtn('m');");
    //         } else if (document.getElementById("topBtnWithMal2")) {
    //             document.getElementById("elemScriptAniStlyeHideChange").innerHTML = ("#topBtnWithMal2{right:-2239px!important;display:none!important;bottom:79px!important}");
    //             document.getElementById("topBtnWithMal2").setAttribute("onClick", "HidetopBtn('m');");
    //         }
    //     } else if (HideTopBtnButtonX == 0) {
    //         topBtn.style.display = "none";
    //         if (document.getElementById("HideTopBtnButton")) {
    //             document.getElementById("HideTopBtnButton").style.bottom = "70px";
    //         } else if (document.getElementById("topBtnWithMal2")) {
    //             document.getElementById("elemScriptAniStlyeHideChange").innerHTML = ("#topBtnWithMal2{right:20px!important;display:block!important;bottom:79px!important}");
    //         }
    //         HideTopBtnButton.style.display = "none";
    //     }
    //     return false;
    // }
    if (HideTopBtnButtonX == 1) {
        topBtn.style.display = "none";
        if (document.getElementById("HideTopBtnButton")) {
            if (e == 'm' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.getElementById("elemScriptAniStlyeHideChange").innerHTML = ("#HideTopBtnButton{right:43px!important;display:block!important;bottom:25px!important}");
            }
            document.getElementById("HideTopBtnButton").style.bottom = "25px";
        } else if (document.getElementById("topBtnWithMal2")) {
            if (e == 'm' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                if (/anilist\.co/.test(location.hostname)) {
                    document.getElementById("elemScriptAniStlyeHideChange").innerHTML = ("#topBtnWithMal2{right:20px!important;display:block!important;bottom:79px!important}");
                } else {
                    document.getElementById("elemScriptAniStlyeHideChange").innerHTML = ("#topBtnWithMal2{right:43px!important;display:block!important;bottom:100px!important}");
                }
            } else {
                document.getElementById("topBtnWithMal2").style.bottom = "100px";
            }
        }
    } else if (HideTopBtnButtonX == 0) {
        topBtn.style.display = "none";
        if (document.getElementById("HideTopBtnButton")) {
            if (e == 'm' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.getElementById("elemScriptAniStlyeHideChange").innerHTML = ("#HideTopBtnButton{right:-2239px!important;display:none!important;bottom:70px!important}");
            }
            document.getElementById("HideTopBtnButton").style.bottom = "70px";
        } else if (document.getElementById("topBtnWithMal2")) {
            if (e == 'm' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.getElementById("elemScriptAniStlyeHideChange").innerHTML = ("#topBtnWithMal2{right:-2239px!important;display:none!important;bottom:150px!important}");
                topBtn.style.display = "block";
            } else {
                document.getElementById("topBtnWithMal2").style.bottom = "150px";
            }
        }
        HideTopBtnButton.style.display = "none";
    }
}

document.getElementById("topBtnBoxThing").addEventListener("mouseover", mouseOver);
document.getElementById("topBtnBoxThing").addEventListener("mouseout", mouseOut);

function mouseOver() {
    if (topBtn.style.display = "block") {
        HideTopBtnButton.style.display = "block";
    }

    if (HideTopBtnButtonX == 1) {
        topBtn.style.display = "none";
    }

}

function mouseOut() {
    if (topBtn.style.display = "block") {
        if (HideTopBtnButtonX == 0) {
            HideTopBtnButton.style.display = "none";
            topBtn.style.display = "block";
        }
    }
    if (HideTopBtnButtonX == 1) {
        topBtn.style.display = "none";
    }
}
`);
document.getElementById('TopBtnMain').append(elemDivTopBtnMainScript);

var elemDivTopBtn = document.createElement('div');

if (/vrv\.co/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #fd0;
color: #1b1a26;
}
#HideTopBtnButton .hideTopBtnClr {
fill: #1b1a26;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #fd0;
}
#HideTopBtnWithMal2 .hideTopBtnClr {
fill: #1b1a26;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #fd0;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/zoro\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #cae962;
color: #202125;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #cae962;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #cae962;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/aniwatch\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #ffdd95;
color: #202125;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #ffdd95;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #ffdd95;
}
#totop {
display: none !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/crunchyroll\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #df6300;
color: #ffffff;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #df6300;
}
#topBtnWithMal2:hover .hideTopBtnClr {
fill: #df6300;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/mangadex\.org/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #E6613E;
color: #ffffff;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #E6613E;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #E6613E;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/9anime\.ru/.test (location.hostname) || /9anime\.me/.test (location.hostname) || /9anime\.pl/.test (location.hostname) || /9anime\.ph/.test (location.hostname) || /9anime\.to/.test (location.hostname) || /9anime\.id/.test (location.hostname) || /9anime\.is/.test (location.hostname) || /9anime\.ch/.test (location.hostname) || /9anime\.nl/.test (location.hostname) || /9anime\.live/.test (location.hostname) || /9anime\.one/.test (location.hostname) || /9anime\.page/.test (location.hostname) || /9anime\.video/.test (location.hostname) || /9anime\.life/.test (location.hostname) || /9anime\.love/.test (location.hostname) || /9anime\.tv/.test (location.hostname) || /9anime\.id/.test (location.hostname) || /9anime\.club/.test (location.hostname) || /9anime\.center/.test (location.hostname) || /9anime\.gs/.test (location.hostname) || /9animehq\.to/.test (location.hostname) || /9animeto\.io/.test (location.hostname) || /aniwave\.to/.test (location.hostname) || /aniwave\.tv/.test (location.hostname) || /aniwave\.bz/.test (location.hostname) || /aniwave\.ws/.test (location.hostname) || /animelab\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #5a2e98;
color: #ddd;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #5a2e98;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #5a2e98;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animepahe\.ru/.test (location.hostname) || /animepahe\.com/.test (location.hostname) || /animepahe\.org/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #d5015b;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #d5015b;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #d5015b;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/kissmanga\.com/.test (location.hostname) || /anilist\.co/.test (location.hostname) || /anichart\.net/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #3db4f2;
color: black;
}
body.site-theme-dark #topBtn {
  color: white;
}
#HideTopBtnButton .hideTopBtnClr {
fill: #3db4f2;
}
#topBtnWithMal2 .hideTopBtnClr {
fill: #3db4f2;
}
#HideTopBtnButton:not(:hover) .hideTopBtnClr {
fill: black !important;
}
#HideTopBtnWithMal2:not(:hover) .hideTopBtnClr {
fill: black !important;
}
body.site-theme-dark #HideTopBtnButton .hideTopBtnClr {
fill: #3db4f2;
}
body.site-theme-dark #HideTopBtnWithMal2 .hideTopBtnClr {
fill: #3db4f2;
}
body.site-theme-dark #HideTopBtnButton:not(:hover) .hideTopBtnClr {
fill: white !important;
}
body.site-theme-dark #HideTopBtnWithMal2:not(:hover) .hideTopBtnClr {
fill: white !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/kitsu\.io/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
 background-color: #997d78;
 color: inherit;
 filter: contrast(5);
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #997d78;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #997d78;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/kuroiru\.co/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #222222;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: white;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: white;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/kissanime\.ru/.test (location.hostname) || /kissanime\.pro/.test (location.hostname) || /kissanime\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #81cc03;
color: #fff;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #81cc03;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #81cc03;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/myanimelist\.net/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #2e51a2;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #2e51a2;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #2e51a2;
}
html.dark-mode #topBtn {
background-color: #003f75;
}
html.dark-mode #HideTopBtnButton:hover .hideTopBtnClr {
fill: #003f75;
  background: rgb(136, 136, 136) !important;
}
html.dark-mode #HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #003f75;
}
html.dark-mode #HideTopBtnButton:hover {
  background: rgb(136, 136, 136);
}
html.dark-mode #HideTopBtnWithMal2:hover {
  background: rgb(136, 136, 136);
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/gogoanime\.io/.test (location.hostname) || /gogoanime\.video/.test (location.hostname) || /gogoanime\.sk/.test (location.hostname) || /gogoanime\.tel/.test (location.hostname) || /gogoanime\.news/.test (location.hostname) || /gogoanime\.bid/.test (location.hostname) || /gogoanime\.ar/.test (location.hostname) || /gogoanimehd\.io/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #ffc119;
color: #fdfcfc;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #ffc119;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #ffc119;
}

.icongec-backtop {
display: none;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animekisa\.tv/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #e61d2f;
color: white;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #e61d2f;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #e61d2f;
}

.css-1j77ejl{
right: 83px !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animesuge\.to/.test (location.hostname) || /animeflix\.live/.test (location.hostname) || /animeflix\.icu/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #ff0000;
color: white;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #ff0000;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #ff0000;
}

.css-1j77ejl{
right: 83px !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animeflv\.net/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #01cfff;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #01cfff;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #01cfff;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animension\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #2387bd;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #2387bd;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #2387bd;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/jkanime\.net/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #DF9700;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #DF9700;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #DF9700;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/turkanime\.net/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: black;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: black;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: black;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/4anime\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #e61d2f;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #e61d2f;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #e61d2f;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animeultima\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #3273dc;
color: white;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #3273dc;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #3273dc;
}

.css-1j77ejl {
right: 83px !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animesimple\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #4ecdc4;
color: black;
}

body.dark #topBtn {
background-color: #4ecdc4;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #4ecdc4;
}
#HideTopBtnButton .hideTopBtnClr {
fill: black;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #4ecdc4;
}
#HideTopBtnWithMal2 .hideTopBtnClr {
fill: black;
}
body.dark #HideTopBtnWithMal2 .hideTopBtnClr {
fill: white;
}
body.dark #HideTopBtnButton .hideTopBtnClr {
fill: white;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/yugen\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #07bf67;
color: white;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #07bf67;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #07bf67;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/hidive\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #00aef0;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #00aef0;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #00aef0;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/funimation\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #410099;
color: white;
border: solid white;
border-width: 0.1px;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #410099;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #410099;
}
.slider-control.prev, .slider-control.next {
z-index: 99 !IMPORTANT;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animixplay\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #178be6;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #178be6;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill #178be6;
}
#backtotopbtn {
display: none;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/mangareader\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #7b36ce;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #7b36ce;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #7b36ce;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/readmanganato\.com/.test (location.hostname) || /manganato\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #ff530d;
color: white;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #ff530d;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #ff530d;
}
#top {
display: none !IMPORTANT;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animethemes\.moe/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #2e293a;
color: #d1cae0;
outline: #1c1823 2.9px solid;
}

#HideTopBtnButton .hideTopBtnClr {
fill: #d1cae0;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #f5f2fa;
}

topBtnWithMal2 .hideTopBtnClr {
fill: #d1cae0;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #f5f2fa;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/theindex\.moe/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #1d1d1d;
color: #fff;
outline: #121212 2.9px solid;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/everythingmoe\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #1e1e1e;
color: #fff;
outline: #121212 2.9px solid;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/livechart\.me/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #3b97fc;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #3b97fc;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #3b97fc;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/allanime\.co/.test (location.hostname) || /allanime\.to/.test (location.hostname) || /allanime\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #0061a1;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #0061a1;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #0061a1;
}

.return-to-top {
display: none !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/chiaki\.site/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #fe78e4;
color: #1f1f1f;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #fe78e4;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #fe78e4;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/comick\.app/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
html.dark #topBtn {
background-color: #2563eb;
color: #fff;
}
#topBtn {
background-color: #3b82f6;
color: #fff;
}

html.dark #HideTopBtnButton:hover .hideTopBtnClr {
fill: #2563eb;
}

html.dark #topBtnWithMal2:hover .hideTopBtnClr {
fill: #2563eb;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #3b82f6;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #3b82f6;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/anime-planet\.com/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
html.darkmode #topBtn {
color: #fff;
}
#topBtn {
background-color: #ef5040;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #ef5040;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #ef5040;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/mangafire\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
html.darkmode #topBtn {
color: #fff;
}
#topBtn {
background-color: #0062d7;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #0062d7;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #0062d7;
}
</style>
`);
document.body.append(elemDivTopBtn);
}
