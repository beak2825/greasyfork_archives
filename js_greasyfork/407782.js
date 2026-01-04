// ==UserScript==
// @name        KissCaptchaDestroyer
// @description:en  Solves KissAnime/KissManga captchas with database integration
// @match       *://kissanime.ru/*
// @match       *://kissmanga.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlhttpRequest
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @version     2.0
// @author      henrik9999
// @run-at      document-start
// @namespace   https://greasyfork.org/users/412318
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @connect     kisscaptchadestroyer.firebaseio.com
// @description Solves KissAnime/KissManga captchas with database integration
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/407782/KissCaptchaDestroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/407782/KissCaptchaDestroyer.meta.js
// ==/UserScript==
var imageElements = [];
var imageObj = {};
var imageBaseObj = {};
let words = [];
let unknownWords = [];
let helpForWord;
const api = {};

this.$ = this.jQuery = jQuery.noConflict(true);

$(window).on("load", async function () {
    main();
});

async function main() {
    if (typeof GM_xmlhttpRequest !== 'undefined') {
        api.GM_xmlhttpRequest = GM_xmlhttpRequest;
    } else if (
        typeof GM !== 'undefined' &&
        typeof GM.xmlHttpRequest !== 'undefined'
    ) {
        api.GM_xmlhttpRequest = GM.xmlHttpRequest;
    }

    if (typeof GM_setValue !== 'undefined') {
        api.GM_setValue = GM_setValue;
    } else if (
        typeof GM !== 'undefined' &&
        typeof GM.setValue !== 'undefined'
    ) {
        api.GM_setValue = GM.setValue;
    }

    if (typeof GM_getValue !== 'undefined') {
        api.GM_getValue = GM_getValue;
    } else if (
        typeof GM !== 'undefined' &&
        typeof GM.getValue !== 'undefined'
    ) {
        api.GM_getValue = GM.getValue;
    }

    let url = window.location.href;
    let urlParts = url.split("/")
    if (urlParts.length >= 4 && urlParts[3] === "Special" && urlParts[4].startsWith("AreYouHuman2")) {
        var formVerify = document.getElementById("formVerify1");

        await api.GM_setValue("answers", "");

        //if on retry page
        if (formVerify === null) {
            console.log("retry page");
            var link = document.getElementsByTagName("a");
            link[0].click()
        }
        //if on captcha page
        if (formVerify != null) {
            console.log("captcha page")

            $("#formVerify1 > div:nth-child(2)").hide();

            customHTML()

            //Image onclick events
            imageElements = $("#formVerify1").find("img").toArray();
            imageElements.forEach(function(currentImage, imageIndex) {
                currentImage.onclick = function() {
                    onClickEvents("image", currentImage, imageIndex);
                }
            });


            await api.GM_setValue("reUrl", $("#formVerify1 input[type=hidden][name=reUrl]").attr("value"));
            wordGrabber();
            imageGrabber();
            await checkDatabase();
            if (unknownWords.length) { //Ask for help with the first unknown word
                $("#formVerify1 > div:nth-child(2)").show();
                askForHelp(unknownWords[0]);
            }

        }
    } else {
        console.log("not captcha page")
        let reUrl = await api.GM_getValue("reUrl");
        if (reUrl && reUrl.length && url.endsWith(reUrl)) {
            console.log("correct answer")
            let answers = await api.GM_getValue("answers")
            if (answers && answers.length) {
                answers = JSON.parse(answers);
                console.log(answers)
                for (const answer of answers) {
                    await new Promise((resolve, reject) => {
                        api.GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://kisscaptchadestroyer.firebaseio.com/kissrequest.json",
                            data: JSON.stringify(answer),
                            onload: function(response) {
                                resolve();
                            }
                        });
                    })
                }
            }
        }
        await api.GM_setValue("answers", "")
        await api.GM_setValue("reUrl", "")
    }
}


function askForHelp(word) {
    helpForWord = word;
    unknownWords = unknownWords.slice(1, unknownWords.length)
    alertBoxText.innerText = "Please select image: " + word.replace(/,/g, ", ");
}


async function checkDatabase() {
    for (const word of words) {
        let found = false;
        let images = await new Promise((resolve, reject) => {
            api.GM_xmlhttpRequest({
                method: "GET",
                url: "https://kisscaptchadestroyer.firebaseio.com/kiss/" + word + ".json",
                onload: function(response) {
                    if (response.status === 200 && response.responseText) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        resolve("");
                    }
                }
            });
        })
        console.log("images", word, images)
        if (images) {
            for (const val of Object.values(images)) {
                if (Object.values(imageObj).includes(val)) {
                    $("[indexValue='" + Object.values(imageObj).indexOf(val) + "']").click();
                    found = true;
                    break;
                }
            }
        }
        if (!found) unknownWords.push(word);
    }
}

function wordGrabber() { //Grabs span elements that are children of the "formVerify" form.  This will include the two sections saying what to select.  Ex: "cat, glasses, 0"
    var pElements = $("#formVerify1").find("p").toArray();
    var wordElements;

    pElements.forEach(function(pElement) { //Grabs the p element that contains 2 span elements in it.
        if ($(pElement).find("span").toArray().length === 2) {
            wordElements = $(pElement).find("span").toArray();
        }
    });
    for (var i = 0; i < wordElements.length; i++) {
        let word = wordElements[i].innerText.toLowerCase();
        wordElements[i] = word.replace(/\s*/g, "").split(",").sort().join(",")
    }

    words = wordElements;
    console.log(words)
}

function imageGrabber() {
    console.log(imageElements)
    imageElements.forEach(function(image, index) {
        var imageData = convertToDataUrl(image);
        imageObj[index] = CryptoJS.MD5(imageData).toString();
        imageBaseObj[index] = imageData;
    });
    console.log(imageObj)
}


function convertToDataUrl(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

async function onClickEvents(clickedItem, clickedImage, imageIndexValue) {
    switch (clickedItem) {
        case "image":
            if ($(clickedImage).attr("class") === "imgCapSelect" && helpForWord) {
                let data = {
                    "image": imageBaseObj[imageIndexValue],
                    "word": helpForWord
                }
                let answers = await api.GM_getValue("answers");
                if (answers && answers.length) {
                    answers = JSON.parse(answers);
                    answers.push(data);
                } else {
                    answers = [data]
                }
                await api.GM_setValue("answers", JSON.stringify(answers))
                helpForWord = "";
                if (unknownWords.length) {
                    askForHelp(unknownWords[0]);
                }
            }
    }
}


function customHTML() {
    //Message box
    firstDiv = $("#formVerify1").find("div").toArray()[0];
    firstDiv.style.cssText = "width:100%;"; //The box holding the information at the top was not wide enough originally

    PElements = $(firstDiv).find("p").toArray();
    if (PElements.length === 2) {
        PElements[0].style.cssText = "opacity:0; height:0px; width:100%; line-height:0px; font-size:0px;";
    }
    if (PElements.length === 3) {
        PElements[0].style.cssText = "display: none;";
        PElements[1].style.cssText = "opacity:0; height:0px; width:100%; line-height:0px; font-size:0px;";
    }

    thirdPElement = PElements[PElements.length - 1];
    thirdPElement.style.cssText = "opacity:0; height:0px; width:100%; line-height:0px; font-size:0px;"; //Hides where it lists both selection choices.  This is to insure users select the images in the correct order.

    alertBoxDiv = document.createElement("div"); //Creation of div element which will contain the below text element
    alertBoxDiv.style.cssText = "background:#518203; color:white; height:30px; width:100%; line-height:30px; text-align:center;";

    alertBoxText = document.createElement("h3"); //Creation of text element which will say the descriptions of images the script doesn't know the answer to
    alertBoxText.innerText = "Checking data. . . .";
    alertBoxText.style.cssText = "background:#518203; color:white; height:100%; width:100%; text-align:center; font-size: 20px; margin-top:0px;";

    alertBoxDiv.insertAdjacentElement("afterbegin", alertBoxText); //Inserting "alertBoxText" into "alertBoxDiv" at the top
    thirdPElement.insertAdjacentElement("afterend", alertBoxDiv); //Placing "alertBoxDiv" at the end of "mainBlock"

}