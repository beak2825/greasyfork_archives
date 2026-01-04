// ==UserScript==
// @name All the anime top buttons
// @namespace http://tampermonkey.net/
// @website https://animetopbtns.github.io/website/
// @version 2.4.1
// @description All the anime top buttons (has MAL-Sync support)
// @author WhiteTapeti
// @license MIT
// @icon data:image/png;base64,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
// @match *://vrv.co/*
// @match *://*.static.vrv.co/*
// @match *://*.crunchyroll.com/*
// @match *://*.static.crunchyroll.com/*
// @exclude *store.crunchyroll.com/*
// @match *://*.zoro.to/*
// @match *://*.aniwatch.to/*
// @match *://*.kaido.to/*
// @match *://*.9animetv.to/*
// @match *://*.4anime.gg/*
// @match *://*.4anime.is/*
// @match *://*.animebee.is/*
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
// @match *://*.kickassanimes.info/*
// @match *://*.kickassanime.am/*
// @match *://*.kickassanime.to/*
// @match *://*.kickassanime.ro/*
// @match *://*.kaas.am/*
// @match *://*.kaas.to/*
// @match *://*.kaas.ro/*
// @match *://*.anix.to/*
// @match *://*.gogoanimex.to/*
// @match *://*.zorox.to/*
// @match *://*.zorohd.to/*
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
// @match *://*.gogotaku.info/*
// @match *://*.gogoanime3.net/*
// @match *://*.animeseries.so/*
// @match *://*.animedao.bz/*
// @match *://*.watchcartoononline.cc/*
// @match *://*.wcofun.tv/*
// @match *://*.wcostream.tv/*
// @match *://*.wcoanimedub.tv/*
// @match *://*.wco.tv/*
// @match *://*.wcoforever.tv/*
// @match *://*.wcoanimesub.tv/*
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
// @match *://*.yugenanime.tv/*
// @match *://*.animeplyx.eu/*
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
// @match *://*.animegg.org/*
// @match *://*.animeonsen.xyz/*
// @match *://*.animeheaven.me/*
// @match *://*.aniworld.to/*
// @match *://chiaki.site/*
// @match *://comick.app/*
// @match *://comick.ink/*
// @match *://*.anime-planet.com/*
// @match *://*.mangafire.to/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/404760/All%20the%20anime%20top%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/404760/All%20the%20anime%20top%20buttons.meta.js
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
        <button id="topBtn" title="Go to top" style="-ms-transform: rotate(90deg); /* IE 9 */-moz-transform: rotate(90deg); /* Firefox */-webkit-transform: rotate(90deg); /* Safari and Chrome */-o-transform: rotate(90deg); /* Opera */">&lt;</button>
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
} else if (/kaido\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #53ff86;
color: #111;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #53ff86;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #53ff86;
}
#totop {
display: none !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/9animetv\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #5a2e98;
color: #fff;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #5a2e98;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #5a2e98;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/4anime\.gg/.test (location.hostname) || /4anime\.is/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #df1e34;
color: #fff;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #df1e34;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #df1e34;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animebee\.is/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #faa300;
color: #111;
}
#HideTopBtnButton:hover .hideTopBtnClr {
fill: #faa300;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #faa300;
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
} else if (/kickassanimes\.info/.test (location.hostname) || /kickassanime\.am/.test (location.hostname) || /kickassanime\.to/.test (location.hostname) || /kickassanime\.ro/.test (location.hostname) || /kaas\.am/.test (location.hostname) || /kaas\.to/.test (location.hostname) || /kaas\.ro/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
.back-to-top {
display: none !important
}

#topBtn {
background-color: #fdd835;
color: #000;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #fdd835;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #fdd835;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/anix\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #95b6d0;
color: #202020;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #95b6d0;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #95b6d0;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/gogoanimex\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #ffc119;
color: #202020;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #ffc119;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #ffc119;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/zorox\.to/.test (location.hostname) || /zorohd\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #cae962;
color: #292b30;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #cae962;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #cae962;
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
} else if (/gogoanime\.io/.test (location.hostname) || /gogoanime\.video/.test (location.hostname) || /gogoanime\.sk/.test (location.hostname) || /gogoanime\.tel/.test (location.hostname) || /gogoanime\.news/.test (location.hostname) || /gogoanime\.bid/.test (location.hostname) || /gogoanime\.ar/.test (location.hostname) || /gogoanimehd\.io/.test (location.hostname) || /gogotaku\.info/.test (location.hostname) || /gogoanime3\.net/.test (location.hostname) ) {
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
} else if (/watchcartoononline\.cc/.test (location.hostname) || /wcostream\.tv/.test (location.hostname) || /wco\.tv/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #d94707;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #d94707;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #d94707;
}

#btnTopPage {
display: none!important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/wcofun\.tv/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #ff7c00;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #ff7c00;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #ff7c00;
}

#btnTopPage {
display: none!important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/wcoanimedub\.tv/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #994e96;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #994e96;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #994e96;
}

#btnTopPage {
display: none!important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/wcoforever\.tv/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #f26723;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #f26723;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #f26723;
}

#btnTopPage {
display: none!important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/wcoanimesub\.tv/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #3da1d2;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #3da1d2;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #3da1d2;
}

#btnTopPage {
display: none!important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animeseries\.so/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #009bc3;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #009bc3;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #009bc3;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animedao\.bz/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #0bb0f7;
color: #eee;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #0bb0f7;
}

#topBtnWithMal2:hover .hideTopBtnClr {
fill: #0bb0f7;
}

#topBtnBoxThing {
z-index: 9999;
}

#scroll-top {
display: none !important;
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
} else if (/yugen\.to/.test (location.hostname) || /yugenanime\.tv/.test (location.hostname) ) {
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
} else if (/animeplyx\.eu/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #408bea;
color: white;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #408bea;
}
#HideTopBtnWithMal2:hover .hideTopBtnClr {
fill: #408bea;
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

#toTopBtn {
display: none !important;
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
} else if (/animegg\.org/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #eb7d06;
color: #fff;
}

#HideTopBtnButton .hideTopBtnClr {
fill: grey;
}

topBtnWithMal2 .hideTopBtnClr {
fill: grey;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #eb7d06;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #eb7d06;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animeonsen\.xyz/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #2a2a2a;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #fff;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #fff;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/animeheaven\.me/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #dd0021;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #dd0021;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #dd0021;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/aniworld\.to/.test (location.hostname) ) {
  elemDivTopBtn.innerHTML = ( `
      <style>
#topBtn {
background-color: #637cf9;
color: #fff;
}

#HideTopBtnButton:hover .hideTopBtnClr {
fill: #637cf9;
}

topBtnWithMal2:hover .hideTopBtnClr {
fill: #637cf9;
}

.shoutbox {
right: 84px;
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

#topBtnBoxThing {
bottom: 51px !important;
}
</style>
`);
document.body.append(elemDivTopBtn);
} else if (/comick\.app/.test (location.hostname) || /comick\.ink/.test (location.hostname) ) {
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
