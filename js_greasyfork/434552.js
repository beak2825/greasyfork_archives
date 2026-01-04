// ==UserScript==
// @name                /r/forsen emotes for old reddit
// @namespace           ur mom
// @version             0.32
// @description         shows new subreddit emotes on the old reddit version of /r/forsen
// @author              DEDZET, g7eternal
// @match               https://www.reddit.com/r/forsen/*
// @match               https://old.reddit.com/r/forsen/*
// @exclude             https://new.reddit.com/r/forsen/*
// @icon                data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant               none
// @license             MIT

// @downloadURL https://update.greasyfork.org/scripts/434552/rforsen%20emotes%20for%20old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/434552/rforsen%20emotes%20for%20old%20reddit.meta.js
// ==/UserScript==


// DISCLAIMER:
//g7exernal optimised the code for readability and fixed the issue where colons get missing so thank u <3 <3


(function () {
        // 9666 = Clueless
        // 9667 = Okayeg
        // 9668 = cmonBruh
        // 9669 = forsenCope / Copesen
        // 9670 = forsenLevel
        // 9671 = BatChest
        // 9672 = forsenCD
        // 9673 = forsenDespair
        // 9674 = forsenE
        // 9675 = :tf: / Trollface
        // 9676 = FeelsOkayMan
        // 9677 = gachiBass
        // 9678 = monkaOMEGA
        // 9679 = Sadeg
        // 9680 = pepeLaugh
        // 9681 = LULE
	    // 9682 = OMEGALUL
	    // 9683 = WutFace
        // 9684 = PagMan
        // 9685 = forsenBased
        // 5359 = docsen | EMOTE REMOVED BUT STILL VISIBLE
        // 5322 = megaLUL | EMOTE REMOVED BUT STILL VISIBLE
        // 10257 = amongE

        var emotes = {

	   //old identifiers before april fools
          ":5317:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/AT7s0VNX3k.png",
          ":5318:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/N1uNvdt8mE.png",
          ":5319:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/JkRLd1GD0M.png",
          ":5320:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/aijGxtIyEV.png",
          ":5321:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/GGA6rMukok.png",
          ":5322:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/LfACFCRsyF.png",
          ":5323:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/35Audg7pV4.png",
          ":5324:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/nt3zWVpGJ7.png",
          ":5325:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/7ANDFqjzP8.png",
          ":5326:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/ScWFd9i7i6.png",
          ":5327:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/VT4IT5qAe7.png",
          ":5330:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/PTrCpQCrjL.png",
          ":5331:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/jdnwperoG3.png",
          ":5332:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/mX7y3QIkIM.png",
          ":5333:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/YDbIwq5JwL.png",
          ":5334:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/k1Kw1IJ74c.png",
          ":5335:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/Ju377CAoCs.png",
          ":5336:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/ewJfbbjh3q.png",
          ":5359:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/Ew1Hvr691G.png",
          ":5360:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/4ymLKqesZ3.png",
          ":9391:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/4utA9oAccZ.png",
          ":9392:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/v3kH6HW0PJ.png",
	   //new identifiers
	      ":9674:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/AT7s0VNX3k.png",
          ":9677:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/N1uNvdt8mE.png",
          ":9673:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/JkRLd1GD0M.png",
          ":9685:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/aijGxtIyEV.png",
          ":9682:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/GGA6rMukok.png",
          ":9669:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/35Audg7pV4.png",
          ":9684:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/nt3zWVpGJ7.png",
          ":9679:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/7ANDFqjzP8.png",
          ":9672:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/ScWFd9i7i6.png",
          ":9671:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/VT4IT5qAe7.png",
          ":9675:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/PTrCpQCrjL.png",
          ":9666:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/jdnwperoG3.png",
          ":9678:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/mX7y3QIkIM.png",
          ":9683:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/YDbIwq5JwL.png",
          ":9668:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/k1Kw1IJ74c.png",
          ":9680:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/Ju377CAoCs.png",
          ":9676:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/ewJfbbjh3q.png",
          ":9681:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/4ymLKqesZ3.png",
          ":9670:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/4utA9oAccZ.png",
          ":9667:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/v3kH6HW0PJ.png",
          ":10257:": "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_33td5/yz8RCXxqKj.png"
        // add your emotes here
        };
        var emoteMatcher = Object.keys(emotes).join('|');

        var emoteSize = 20; //change these if you want the emotes to be bigger or smaller, it's 20 on new reddit so i just used that

        Array.from(document.getElementsByTagName("p")).forEach(function (elem) {
            var html = elem.innerHTML;
            var emoteMatches = html.match(new RegExp(emoteMatcher, 'g'));
            if (emoteMatches) {
                emoteMatches.forEach(function (possibleEmote) {
                    if (emotes.hasOwnProperty(possibleEmote))
                        html = html.replace(possibleEmote, `<img src="${emotes[possibleEmote]}" width="${emoteSize} height="${emoteSize}">`);
                });
                elem.innerHTML = html;
            }
        });
    })();