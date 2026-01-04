// ==UserScript==
// @name        MH Auto KR Solver REVAMP
// @author      NobodyRandom, Kevin Kwok, CnN
// @version    	1.0.6
// @namespace   https://greasyfork.org/users/6398, https://devcnn.wordpress.com/, https://antimatter15.com/
// @description This is an auto MH KR Solver.
// @icon        https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @license 	GPL-3.0+; http://www.gnu.org/copyleft/gpl.html
// @include		http://*/puzzleimage.php*
// @include		https://*/puzzleimage.php*
// @include		http://*.dropbox.com/*
// @include		https://*.dropbox.com/*
// @grant		unsafeWindow
// @grant		GM_info
// @run-at		document-end
// ==/UserScript==

//if (window.top == window.self)  //don't run on the top window
//return;

var debug = true;

function receiveMessage(event) {
    console.debug("Event origin: " + event.origin);
    console.debug("Event data: " + event.data);
    if (event.origin.indexOf("mousehunt") > -1) {
        try {
            event.source.postMessage(KingsRewardSolver(), event.origin);
        }
        catch (e) {
            console.debug("Error postMessage: " + e.message);
            event.source.postMessage("", event.origin);
        }
    }
}

function run() {
    var krResult = KingsRewardSolver();
    console.log(krResult);
    try {
        window.parent.postMessage(krResult, "https://www.mousehuntgame.com/");
    }
    catch (e) {
        console.debug("Error run(): " + e.message);
    }
}

function KingsRewardSolver() {
    var canvas = document.createElement('canvas');
    var img = document.getElementsByTagName('img')[0];
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var thresholdImgData = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i + 3] == 0)
            thresholdImgData.data[i] = 255;
        else
            thresholdImgData.data[i] = imgData.data[i];

        thresholdImgData.data[i] = (imgData.data[i] >= 190) ? 255 : 0;
        thresholdImgData.data[i + 1] = thresholdImgData.data[i];
        thresholdImgData.data[i + 2] = thresholdImgData.data[i];
        thresholdImgData.data[i + 3] = 255;
    }

    var dilateImgData = context.createImageData(canvas.width, canvas.height);
    var erodeImgData = context.createImageData(canvas.width, canvas.height);
    var isFirstRow, isLastRow;
    var abovePixel, belowPixel;
    for (var i = 0; i < thresholdImgData.data.length; i += 4) {
        if (thresholdImgData.data[i + 3] == 0) {
            dilateImgData.data[i] = 255;
            dilateImgData.data[i + 1] = 255;
            dilateImgData.data[i + 2] = 255;
        }
        else {
            dilateImgData.data[i] = thresholdImgData.data[i];
            dilateImgData.data[i + 1] = thresholdImgData.data[i + 1];
            dilateImgData.data[i + 2] = thresholdImgData.data[i + 2];
        }
        dilateImgData.data[i + 3] = 255;
        if (thresholdImgData.data[i] != 255) {
            abovePixel = i - canvas.width * 4;
            belowPixel = i + canvas.width * 4;
            isFirstRow = (abovePixel < 0);
            isLastRow = (belowPixel > thresholdImgData.data.length);
            if (isFirstRow)
                dilateImgData.data[i] |= thresholdImgData.data[belowPixel];
            else if (isLastRow)
                dilateImgData.data[i] |= thresholdImgData.data[abovePixel];
            else
                dilateImgData.data[i] |= thresholdImgData.data[abovePixel] | thresholdImgData.data[belowPixel];

            dilateImgData.data[i + 1] = dilateImgData.data[i];
            dilateImgData.data[i + 2] = dilateImgData.data[i];
        }
    }

    for (var i = 0; i < dilateImgData.data.length; i += 4) {
        if (dilateImgData.data[i + 3] == 0) {
            erodeImgData.data[i] = 255;
            erodeImgData.data[i + 1] = 255;
            erodeImgData.data[i + 2] = 255;
        }
        else {
            erodeImgData.data[i] = dilateImgData.data[i];
            erodeImgData.data[i + 1] = dilateImgData.data[i + 1];
            erodeImgData.data[i + 2] = dilateImgData.data[i + 2];
        }
        erodeImgData.data[i + 3] = 255;
        if (dilateImgData.data[i] != 0) {
            abovePixel = i - canvas.width * 4;
            belowPixel = i + canvas.width * 4;
            isFirstRow = (abovePixel < 0);
            isLastRow = (belowPixel > dilateImgData.data.length);
            if (isFirstRow)
                erodeImgData.data[i] &= dilateImgData.data[belowPixel];
            else if (isLastRow)
                erodeImgData.data[i] &= dilateImgData.data[abovePixel];
            else
                erodeImgData.data[i] &= dilateImgData.data[abovePixel] & dilateImgData.data[belowPixel];

            erodeImgData.data[i + 1] = erodeImgData.data[i];
            erodeImgData.data[i + 2] = erodeImgData.data[i];
        }
    }

    var dilateFinalImgData = context.createImageData(canvas.width, canvas.height);
    var erodeFinalImgData = context.createImageData(canvas.width, canvas.height);
    var isFirstCol, isLastCol;
    var leftPixel, rightPixel;
    for (var i = 0; i < erodeImgData.data.length; i += 4) {
        if (erodeImgData.data[i + 3] == 0) {
            erodeFinalImgData.data[i] = 255;
            erodeFinalImgData.data[i + 1] = 255;
            erodeFinalImgData.data[i + 2] = 255;
        }
        else {
            erodeFinalImgData.data[i] = erodeImgData.data[i];
            erodeFinalImgData.data[i + 1] = erodeImgData.data[i + 1];
            erodeFinalImgData.data[i + 2] = erodeImgData.data[i + 2];
        }
        erodeFinalImgData.data[i + 3] = 255;
        if (erodeImgData.data[i] != 0) {
            leftPixel = i - 4;
            rightPixel = i + 4;
            isFirstCol = (leftPixel < 0);
            isLastCol = (rightPixel > erodeImgData.data.length);
            if (isFirstCol)
                erodeFinalImgData.data[i] &= erodeImgData.data[rightPixel];
            else if (isLastCol)
                erodeFinalImgData.data[i] &= erodeImgData.data[leftPixel];
            else
                erodeFinalImgData.data[i] &= erodeImgData.data[leftPixel] & erodeImgData.data[rightPixel];

            erodeFinalImgData.data[i + 1] = erodeFinalImgData.data[i];
            erodeFinalImgData.data[i + 2] = erodeFinalImgData.data[i];
        }
    }

    for (var i = 0; i < erodeFinalImgData.data.length; i += 4) {
        if (erodeFinalImgData.data[i + 3] == 0) {
            dilateFinalImgData.data[i] = 255;
            dilateFinalImgData.data[i + 1] = 255;
            dilateFinalImgData.data[i + 2] = 255;
        }
        else {
            dilateFinalImgData.data[i] = erodeFinalImgData.data[i];
            dilateFinalImgData.data[i + 1] = erodeFinalImgData.data[i + 1];
            dilateFinalImgData.data[i + 2] = erodeFinalImgData.data[i + 2];
        }
        dilateFinalImgData.data[i + 3] = 255;
        if (erodeFinalImgData.data[i] != 255) {
            leftPixel = i - 4;
            rightPixel = i + 4;
            isFirstCol = (leftPixel < 0);
            isLastCol = (rightPixel > erodeFinalImgData.data.length);
            if (isFirstCol)
                dilateFinalImgData.data[i] |= erodeFinalImgData.data[leftPixel];
            else if (isLastCol)
                dilateFinalImgData.data[i] |= erodeFinalImgData.data[rightPixel];
            else
                dilateFinalImgData.data[i] |= erodeFinalImgData.data[rightPixel] | erodeFinalImgData.data[leftPixel];

            dilateFinalImgData.data[i + 1] = dilateFinalImgData.data[i];
            dilateFinalImgData.data[i + 2] = dilateFinalImgData.data[i];
        }
    }

    // REMOVE CnN's OCRAD, using require to link it in
    /*if (typeof OCRAD !== 'undefined') {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "//greasyfork.org/scripts/16046-ocrad/code/OCRAD.js?version=100053";
        document.getElementsByTagName('head')[0].appendChild(script);
     }*/

    // Opening = erode -> dilate
    // Closing = dilate -> erode
    var resultClosing1 = OCRAD(dilateImgData);
    var resultClosing2 = OCRAD(erodeImgData);
    var resultOpening1 = OCRAD(erodeFinalImgData);
    var resultOpening2 = OCRAD(dilateFinalImgData);

    resultClosing1 = FilterResult(resultClosing1);
    resultClosing2 = FilterResult(resultClosing2);
    resultOpening1 = FilterResult(resultOpening1);
    resultOpening2 = FilterResult(resultOpening2);

    var resultFinalList = [resultClosing1, resultClosing2, resultOpening1, resultOpening2];
    var resultFinal = CheckResult(resultFinalList);

    return resultFinal + "~" + CombineAllImageData(imgData, thresholdImgData, dilateImgData, erodeImgData, erodeFinalImgData, dilateFinalImgData);
}

function FilterResult(result) {
    var regexp = /^[a-zA-Z0-9]+$/;
    var newResult = "";
    for (var i = 0; i < result.length; ++i) {
        if (result.charAt(i).search(regexp) != -1)
            newResult = newResult.concat(result.charAt(i));
    }
    return newResult.toLowerCase();
}

function CheckResult(resultList) {
    var hit = [0, 0, 0, 0];
    var max = -1;
    var maxIndex = 0;
    var sum = 0;
    var strDebug = "";
    for (var i = 0; i < resultList.length; ++i) {
        for (var j = 0; j < resultList.length; ++j) {
            if (i != j) {
                if (resultList[i] == resultList[j])
                    ++hit[i];
            }
        }
        if (hit[i] > max) {
            max = hit[i];
            maxIndex = i;
        }
        sum += hit[i];
        strDebug += resultList[i] + ": " + hit[i] + " ";
    }
    console.debug(strDebug);
    if ((sum / 4) == hit[maxIndex])
        return resultList[resultList.length - 1];
    else
        return resultList[maxIndex];
}

function CombineAllImageData(ori, threshold, dilate, erode, erodeFinal, dilateFinal) {
    var canvasAll = document.createElement('canvas');
    canvasAll.width = ori.width * 2;
    canvasAll.height = ori.height * 3;
    var contextAll = canvasAll.getContext('2d');
    var imgOri = new Image();
    imgOri.src = getBaseImage(ori);
    var imgThres = new Image();
    imgThres.src = getBaseImage(threshold);
    var imgDilate = new Image();
    imgDilate.src = getBaseImage(dilate);
    var imgErode = new Image();
    imgErode.src = getBaseImage(erode);
    var imgErodeFinal = new Image();
    imgErodeFinal.src = getBaseImage(erodeFinal);
    var imgDilateFinal = new Image();
    imgDilateFinal.src = getBaseImage(dilateFinal);
    contextAll.drawImage(imgOri, 0, 0);
    contextAll.drawImage(imgThres, ori.width, 0);
    contextAll.drawImage(imgDilate, 0, ori.height);
    contextAll.drawImage(imgErode, ori.width, ori.height);
    contextAll.drawImage(imgErodeFinal, 0, ori.height * 2);
    contextAll.drawImage(imgDilateFinal, ori.width, ori.height * 2);
    return canvasAll.toDataURL('image/png');
}

function getBaseImage(imgData) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    var img = new Image();
    img.width = imgData.width;
    img.height = imgData.height;
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.putImageData(imgData, 0, 0);

    return canvas.toDataURL("image/png");
}

if (window.location.href.indexOf("puzzleimage.php") > -1 || window.location.href.indexOf("newpuzzzle") > -1) {
    if (debug) console.log("RUN KR OCR SCRIPT");

    window.addEventListener("message", receiveMessage, false);
    var ocrDelayMin = 1;
    var ocrDelayMax = 3;
    var ocrDelay = ocrDelayMin + Math.floor(Math.random() * (ocrDelayMax - ocrDelayMin));
    window.setTimeout(function () {
        run();
    }, ocrDelay * 1000);
}

