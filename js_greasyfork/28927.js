// ==UserScript==
// @name        BetterFap - Fap Gauntlet
// @author      Goog
// @description Fap Gauntlet for BetterFap
// @namespace   https://aint-got-none.fap/
// @include     https://test.betterfap.com/*
// @include     https://betterfap.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js
// @grant       unsafeWindow
// @version 0.56
// @downloadURL https://update.greasyfork.org/scripts/28927/BetterFap%20-%20Fap%20Gauntlet.user.js
// @updateURL https://update.greasyfork.org/scripts/28927/BetterFap%20-%20Fap%20Gauntlet.meta.js
// ==/UserScript==

// Change/Add/Remove masturbation styles here

var masturbationStyle = [
    'Normal Grip',
    'Inverse Grip',
    'Only Down-Strokes',
    'Only Up-Strokes',
    //'Palm Circles',
    'Squeeze',
    'Top half only',
    'Bottom half only',
    //'spin'
];

var gripStrength = [
    'Loose',
    'Normal',
    'Tight'
    //'inverse',
    //'normal'
];

// Change/Add/Remove speeds as you like

var fapsPerSec = [
    0.1,
    0.2,
    0.33,
    0.5,
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5
];

// Change/Add/Remove dildo styles here

var dildoStyle = [
    'Rub outside',
    'Prod',
    'Normal Thrusts',
    'Deep thrusts',
    'All the way'
];

// Strict speeds with a dildo didn't make sense to me 
// so add any speeds you'd like with a dildo here

var dildoSpeed = [
    'Slow',
    'Moderate',
    'Fast'
];

// Below is non-user-friendly stuff. 
// Don't touch it if you dont want the script to break!

var FGisON = false;
var firstStart = true;
var isPlaying = false;
var currViewObj = null;
var lines = 0;
var currFPS = 0;
var denialMode = false;
var dildoMode = false;
var canCum = false;
var canCumNext = false;
var canCumPrev = false;
var currIntensity = null;
var currDilInt = null;
var currDilSpeed = null;
var randTime = 1000;
var changedNormally = null;
var dildoStuff = [];
var handsOffMode = false;
var visualGuideMode = false;
var autoOverride = false;
var currCurve;
var buttonsHidden = false;
var cumText;

// Don't touch this.
var visualCurve = [
    'linear',
    'ease',
    'ease-in',
    'ease-in-out',
    'ease-out'
];

var context = new AudioContext();
var o = context.createOscillator();
o.type = "sawtooth";
o.connect(context.destination);
o.frequency.value = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFPS() {

    // check bottom of script if you want to see the depths of autism

    //return cleanGauss(generateGaussianNoise(3 ,2));

    var rand = getRandomInt(0, fapsPerSec.length - 1);
    return fapsPerSec[rand];
}

function getCumState() { // 1 in 7 chance to be allowed to cum
    if (getRandomInt(1, 7) == 1) {
        //if (getRandomInt(1, 3) == 1) {
        canCum = canCumNext;
        canCumNext = true;
    } else {
        canCum = canCumNext;
        canCumNext = false;
    }

    return canCum;
}

function getCumText() {
    if (canCum === true) {
        cumText = "You can cum.";
    } else {
        cumText = "Do not cum.";
    }
    return cumText;
}

function getRandomIntensity() {
    var rand = getRandomInt(1, 75);
    var x = 2000;
    return masturbationStyle[getRandomInt(0, masturbationStyle.length - 1)];
}

function getRandTime(randFPS) {
    return getRandomInt(1, 4) * 10;
}

function getDildoSpeed() {
    var rand = getRandomInt(0, 2);
    return dildoSpeed[rand];
}

function getdildoStyle() {
    var rand = getRandomInt(0, 4);
    return dildoStyle[rand];
}

function getGripStrength(style) {
    var rand = getRandomInt(0, gripStrength.length - 1);
    if (style == 'Palm Circles') {
        return "";
    }
    return gripStrength[rand];
}

function getVisualCurve() {
    var rand = getRandomInt(0, visualCurve.length - 1);
    return visualCurve[rand];
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function getNewFapData(lastInten, lastFPS) { // sets the next image's fap data

    i = 0;
    currIntensity = getRandomIntensity();
    currFPS = getRandomFPS();
    randTime = getRandTime(currFPS) + 1;
    //randTime = 7;
    getCumState();
    currDilInt = getdildoStyle();
    currDilSpeed = getDildoSpeed();
    currCurve = getVisualCurve();
    currGripStrength = getGripStrength(currIntensity);

    // it's fucking hard to maintain a feather-light touch four or five times a second, so let's not.

    if (((currFPS >= 4) && currIntensity == 'Inverse Grip') ||
        ((currFPS >= 4) && currIntensity == 'Squeeze') ||
        ((currFPS > 3) && currIntensity == 'Palm Circles') ||
        ((currFPS > 3) && currIntensity == 'Only Up-Strokes') ||
        ((currFPS > 3) && currIntensity == 'Only Down-Strokes')
    ) {
        do {
            currIntensity = getRandomIntensity();
            currFPS = getRandomFPS();
            currGripStrength = getGripStrength(currIntensity);
        } while (((currFPS >= 4) && currIntensity == 'Inverse Grip') ||
            ((currFPS >= 4) && currIntensity == 'Squeeze') ||
            ((currFPS > 3) && currIntensity == 'Palm Circles') ||
            ((currFPS > 3) && currIntensity == 'Only Up-Strokes') ||
            ((currFPS > 3) && currIntensity == 'Only Down-Strokes'));
    }

    if (isPlaying) {
        o.frequency.value = currFPS;
    }

    if (visualGuideMode) {
        if (currFPS < 2) {
            $("#VisualGuide")[0].style.animation = "play 0s infinite " + currCurve;
            $("#VisualGuide")[0].style.animation = "play " + (1 / currFPS) + "s infinite " + currCurve;
        } else {
            $("#VisualGuide")[0].style.animation = "play 0s infinite " + currCurve;
            $("#VisualGuide")[0].style.animation = "play " + (1 / currFPS) + "s infinite linear";
        }
    }
}

function remakeDialog() {

    $("#FapDialog")[0].style.display = "block";

    document.querySelector('div[id="FapDialog"]').innerHTML = "Starting...";

    if (remakeDialog.interval) {
        clearInterval(remakeDialog.interval);
    }

    // set the first image's length, faps per sec, etc

    i = 0;
    currIntensity = getRandomIntensity();
    currFPS = getRandomFPS();
    randTime = getRandTime(currFPS); // every randtime after this has +1 so that the numbers show as multiples of ten on the first stroke instead of 10x + 9 which was annoying my autism greatly
    //randTime = 7;
    getCumState();
    currDilInt = getdildoStyle();
    currDilSpeed = getDildoSpeed();
    currCurve = getVisualCurve();
    currGripStrength = getGripStrength(currIntensity);

    // it's fucking hard to maintain a feather-light touch four or five times a second, so let's not.

    if (((currFPS >= 4) && currIntensity == 'Inverse Grip') ||
        ((currFPS >= 4) && currIntensity == 'Squeeze') ||
        ((currFPS > 3) && currIntensity == 'Palm Circles') ||
        ((currFPS > 3) && currIntensity == 'Only Up-Strokes') ||
        ((currFPS > 3) && currIntensity == 'Only Down-Strokes')
    ) {
        do {
            currIntensity = getRandomIntensity();
            currFPS = getRandomFPS();
        } while (((currFPS >= 4) && currIntensity == 'Inverse Grip') ||
            ((currFPS >= 4) && currIntensity == 'Squeeze') ||
            ((currFPS > 3) && currIntensity == 'Palm Circles') ||
            ((currFPS > 3) && currIntensity == 'Only Up-Strokes') ||
            ((currFPS > 3) && currIntensity == 'Only Down-Strokes'));
    }

    if (isPlaying) { // if the user has the audio helper enabled, change it to match current FPS
        o.frequency.value = currFPS;
    }

    if (visualGuideMode) {
        $("#VisualGuide")[0].style.display = "block";
        $("#VisualGuide")[0].style.animation = "play " + (1 / currFPS) + "s infinite " + currCurve;
    }

    currViewObj = unsafeWindow.AppState.viewing;

    remakeDialog.interval = setInterval(
        function oneSecTimer() {

            if (handsOffMode && !canCum) {
                document.querySelector('div[id="FapDialog"]').innerHTML = "Hands Off, " + (randTime - i);
            } else if (handsOffMode && canCum) {
                document.querySelector('div[id="FapDialog"]').innerHTML = "Hands Off, " + (randTime - i) + "<br> You could have cum.";
            } else if (denialMode === false && dildoMode === false) {
                document.querySelector('div[id="FapDialog"]').innerHTML = currIntensity + ", " + currGripStrength + "<br />" + currFPS + "/sec, " + (randTime - i);
            } else if (denialMode === true && dildoMode === false) {
                document.querySelector('div[id="FapDialog"]').innerHTML = currIntensity + ", " + currGripStrength + "<br />" + currFPS + "/sec, " + (randTime - i) + "<br />" + getCumText();
            } else if (denialMode === false && dildoMode === true) {
                document.querySelector('div[id="FapDialog"]').innerHTML = currDilInt + "<br />" + currDilSpeed + ", " + (randTime - i);
            } else if (denialMode === true && dildoMode === true) {
                document.querySelector('div[id="FapDialog"]').innerHTML = currDilInt + "<br />" + currDilSpeed + ", " + (randTime - i) + "<br />" + getCumText();
            }

            //if (visualGuideMode)
            //document.querySelector('div[id="FapDialog"]').innerHTML = document.querySelector('div[id="FapDialog"]').innerHTML + "<br />" + currCurve;

            if ((randTime - i <= 1) && !(autoOverride)) { // aka if the time ticked down normally to 0, go to next image and get new fap data

                handsOffMode = false;

                //document.querySelector('div[id="errordiv"]').innerHTML += "<br/> "+ (lines++) + "   t doesnt work right, <br />fav to rec breaks when start on fav or ue<br />thinks changed every slide";


                getNewFapData(currIntensity, currFPS);

                //****next image function****

                var $ = unsafeWindow.jQuery;

                window.top.postMessage({
                    action: 'next',
                    cr: $.cookie().cr
                }, window.top.location.protocol + window.top.location.host);

                if (denialMode) {

                    logit("now:" + canCum + "   next:" + canCumNext);
                    if (canCumNext && !canCum) {
                        logit("switched to favs");
                        window.top.postMessage({
                            action: 'mode',
                            mode: 'favorites',
                            sort: 'rand',
                            cr: $.cookie().cr
                        }, window.top.location.protocol + window.top.location.host);
                    } else if (!canCum && !canCumNext) {
                        try {
                            logit("switched to recs");
                            window.top.postMessage({
                                action: 'mode',
                                mode: 'recommend',
                                cr: $.cookie().cr
                            }, window.top.location.protocol + window.top.location.host);
                            unsafeWindow.AppState.tab.clear();
                        } catch (error) {
                            logit(error);
                        }
                    }

                }

                //****

                changedNormally = true;

                setTimeout(function () {
                    currViewObj = unsafeWindow.AppState.viewing;
                }, 1000);

            } else if ((currViewObj != unsafeWindow.AppState.viewing) && (!(changedNormally) && !(handsOffMode))) { // if the user skipped their current image (or hit backspace or the image changed literally at all)

                currViewObj = unsafeWindow.AppState.viewing;

                //getNewFapData(currIntensity, currFPS);

                //document.querySelector('div[id="errordiv"]').innerHTML += "<br/> "+ (lines++) + "   thought it was changed!";

            } else if (autoOverride && randTime - i <= 1) {
                getNewFapData(currIntensity, currFPS);
            }

            i = i + 1;

            if (i > 2) {
                changedNormally = false;
            }

        },
        1000);
}

function redrawOptions() {

    $("div#tippy-top").first().append('<div class="view-item-container" id="embed-container-copy" style="width: 200px; height: 300px, position: relative;">');

    $("div#tippy-top").first().append('<div id="FapDialog" style="font-size:400%; color: #00FF00"></div>');

    $("#embed-container-copy").append('<div id="dropdown" style="font-size:100%; color: white; width: 100px; position: fixed; left: -20px; top: 50px; z-index:81000 !important">▼ Hide</div>');
    $("#embed-container-copy").append('<div id="ToggleAutoAdvance" style="font-size:120%; color: white; width: 200px; position: fixed; left: -10px; top: 100px; z-index:81000 !important">Disable Auto-Advance</div>');
    $("#embed-container-copy").append('<div id="ToggleFG" style="font-size:120%; color: white; width: 200px; position: fixed; left: -10px; top: 70px; z-index:81000 !important">Enable Fap Gauntlet</div>');
    $("#embed-container-copy").append('<div id="ToggleDenial" style="font-size:120%; color: white; width: 200px; position: fixed; left: -10px; top: 190px; z-index:81000 !important">Enable Denial Mode</div>');
    $("#embed-container-copy").append('<div id="ToggleVG" style="font-size:120%; color: white; width: 200px; position: fixed; left: -10px; top: 130px; z-index:81000 !important">Enable Visual Guide</div>');
    $("#embed-container-copy").append('<div id="ToggleDildo" style="font-size:120%; color: white; width: 200px; position: fixed; left: -10px; top: 220px; z-index:81000 !important">Enable Dildo Mode</div>');
    $("#embed-container-copy").append('<div id="ToggleAH" style="font-size:120%; color: white; width: 200px; position: fixed; left: -10px; top: 160px; z-index:81000 !important">Enable Audio Helper</div>');
    $("#embed-container-copy").append('<div id="errordiv" style="font-size:100%; display:inline; color: white; width: 400px; position: fixed; right: -20px; top: 50px; z-index:81000 !important">ErrorLog:</div>');

    var visualguide = document.createElement('div');
    visualguide.innerHTML = '<div id="VisualGuide"></div>';
    $("#embed-container-copy")[0].appendChild(visualguide);

    var topBar = document.getElementsByClassName("top-bar-center top-bar-interact")[1];
    var edgedDiv = document.createElement('div');
    edgedDiv.innerHTML = "";
    edgedDiv.zIndex = 81000;
    edgedDiv.id = "EdgedButton";
    edgedDiv.style.width = "auto";
    edgedDiv.style.alignSelf = "left";
    topBar.prepend(edgedDiv);

    $("#VisualGuide")[0].style.backgroundImage = "url('https://www.dropbox.com/s/b4s8lyqexgg4app/sprite.png?raw=1')";
    $("#VisualGuide")[0].style.height = "600px";
    $("#VisualGuide")[0].style.width = "50px";
    $("#VisualGuide")[0].style.position = "fixed";
    $("#VisualGuide")[0].style.left = "10px";
    $("#VisualGuide")[0].style.top = "250px";
    $("#VisualGuide")[0].style.zIndex = "81000";
    $("#VisualGuide")[0].style.animation = "play 0s infinite linear";
    $("#VisualGuide")[0].style.display = "none";

    var style = document.createElement('style');
    style.type = 'text/css';
    var keyFrames = '\
		@keyframes play {\
		100% {\
		background-position: 100%;\
		}\
		}';
    style.innerHTML = keyFrames; //.replace(/A_DYNAMIC_VALUE/g, "180deg");
    document.getElementsByTagName('head')[0].appendChild(style);

    //--- Activate the dialog.

    $("#FapDialog")[0].style.position = "fixed";
    $("#FapDialog")[0].style.left = "200px";
    $("#FapDialog")[0].style.top = "50px";
    $("#FapDialog")[0].style.zIndex = "80000";
    $("#ToggleAutoAdvance")[0].style.zIndex = "81000";
    $("#ToggleAutoAdvance")[0].style.cursor = "pointer";
    $("#ToggleFG")[0].style.cursor = "pointer";
    $("#ToggleAH")[0].style.cursor = "pointer";
    $("#ToggleVG")[0].style.cursor = "pointer";
    $("#ToggleDenial")[0].style.cursor = "pointer";
    $("#ToggleDildo")[0].style.cursor = "pointer";
    $("#EdgedButton")[0].style.cursor = "pointer";
    $("#dropdown")[0].style.cursor = "pointer";



}

function logit(st) {

    document.querySelector('div[id="errordiv"]').innerHTML += "<br/> " + (lines++) + "   " + st;

    if (lines % 40 == 0) {

        document.querySelector('div[id="errordiv"]').innerHTML = "<br/> " + (lines++) + "   " + st;

    }

}


function reassignEventListeners() {

    $(document).keypress(function (e) {
        // if t pressed remake the dialog
        if (e.which == 116 || e.keyCode == 116) {
            randTime = 3;
        }
        //document.querySelector('div[id="errordiv"]').innerHTML += "<br/> "+ (lines++) + "   " + e.which;
        if (e.keyCode == 37 || e.which == 97) {
            getNewFapData();
        }
        if (e.keyCode == 39 || e.which == 100) {
            getNewFapData();
        }
    });

    $(document).keypress(function (e) {
        // if t pressed remake the dialog

    });

    $("#dropdown")[0].addEventListener("click", function (e) {
        if (buttonsHidden) {
            $("#dropdown")[0].innerHTML = "▼ Hide";
            $("#ToggleAutoAdvance")[0].style.display = "block";
            $("#ToggleFG")[0].style.display = "block";
            $("#ToggleAH")[0].style.display = "block";
            $("#ToggleVG")[0].style.display = "block";
            $("#ToggleDenial")[0].style.display = "block";
            $("#ToggleDildo")[0].style.display = "block";
            buttonsHidden = false;
        } else {
            $("#dropdown")[0].innerHTML = "▲ Unhide";
            $("#ToggleAutoAdvance")[0].style.display = "none";
            $("#ToggleFG")[0].style.display = "none";
            $("#ToggleAH")[0].style.display = "none";
            $("#ToggleVG")[0].style.display = "none";
            $("#ToggleDenial")[0].style.display = "none";
            $("#ToggleDildo")[0].style.display = "none";
            buttonsHidden = true;
        }
    }, false);

    $("#ToggleAutoAdvance")[0].addEventListener("click", function (e) {
        if (autoOverride) {
            alert('Automatic Page Cycling Re-enabled!');
            $("#ToggleAutoAdvance")[0].innerHTML = "Disable Auto-Advance";
            autoOverride = false;
        } else {
            alert('Automatic Page Cycling disabled!');
            $("#ToggleAutoAdvance")[0].innerHTML = "Enable Auto-Advance";
            autoOverride = true;
        }
    }, false);


    $("#ToggleFG")[0].addEventListener("click", function (e) {
        if (FGisON) {
            $("#ToggleFG")[0].innerHTML = "Enable Fap Gauntlet";
            clearInterval(remakeDialog.interval);
            o.frequency.value = 0;
            $("#VisualGuide")[0].style.animation = "play 0s infinite linear";
            $("#FapDialog")[0].style.display = "none";
            FGisON = false;
        } else {
            FGisON = true;
            $("#VisualGuide")[0].style.animation = "play " + (1 / currFPS) + "s infinite " + currCurve;
            $("#ToggleFG")[0].innerHTML = "Disable Fap Gauntlet";
            remakeDialog();
        }
    }, false);

    $("#ToggleVG")[0].addEventListener("click", function (e) {
        $ = unsafeWindow.jQuery;
        if (visualGuideMode) {
            $("#ToggleVG")[0].innerHTML = "Enable Visual Guide";
            $("#VisualGuide")[0].style.display = "none";
            visualGuideMode = false;
            $("#VisualGuide")[0].style.animation = "play 0s infinite linear";
        } else {
            $("#ToggleVG")[0].innerHTML = "Disable Visual Guide";
            $("#VisualGuide")[0].style.display = "block";
            visualGuideMode = true;
            $("#VisualGuide")[0].style.animation = "play " + (1 / currFPS) + "s infinite " + currCurve;
        }
    }, false);

    $("#ToggleDildo")[0].addEventListener("click", function (e) {
        if (dildoMode) {
            $("#ToggleDildo")[0].innerHTML = "Enable Dildo Mode";
            dildoMode = false;
        } else {
            $("#ToggleDildo")[0].innerHTML = "Disable Dildo Mode";
            dildoMode = true;
        }
    }, false);

    $("#ToggleAH")[0].addEventListener("click", function (e) {
        if (isPlaying) {
            $("#ToggleAH")[0].innerHTML = "Enable Audio Helper";
            o.frequency.value = 0;
            isPlaying = false;
        } else if (firstStart) {
            $("#ToggleAH")[0].innerHTML = "Disable Audio Helper";
            o.start();
            firstStart = false;
            o.frequency.value = currFPS;
            isPlaying = true;
        } else {
            $("#ToggleAH")[0].innerHTML = "Disable Audio Helper";
            o.frequency.value = currFPS;
            isPlaying = true;
        }
    }, false);

    $("#ToggleDenial")[0].addEventListener("click", function (e) {
        if (denialMode) {
            $("#ToggleDenial")[0].innerHTML = "Enable Denial Mode";
            $("#EdgedButton")[0].innerHTML = "";
            denialMode = false;
        } else {
            $("#ToggleDenial")[0].innerHTML = "Disable Denial Mode";
            $("#EdgedButton")[0].innerHTML = "I Edged!";
            denialMode = true;
        }
    }, false);

    $("#EdgedButton")[0].addEventListener("click", function (e) {
        if (denialMode) {
            handsOffMode = true;

            $ = unsafeWindow.jQuery;

            $("#VisualGuide")[0].style.animation = "play 0s infinite linear";

            //change image
            var $ = unsafeWindow.jQuery;

            window.top.postMessage({
                action: 'next',
                cr: $.cookie().cr
            }, window.top.location.protocol + window.top.location.host);
            setTimeout(function () {
                currViewObj = unsafeWindow.AppState.viewing;
            }, 1000);

            o.frequency.value = 0;
            randTime = 45;
            i = 0;
        }



    }, false);
}

$(window).bind('hashchange', function () {
    reassignEventListeners();
});

setTimeout(function () { // thanks for not having a sleep function js //update: using GM's built in wait until document loaded @thing breaks jquery on the site, weird

    redrawOptions();
    reassignEventListeners();

}, 2000);