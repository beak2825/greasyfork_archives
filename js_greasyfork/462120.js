// ==UserScript==
// @name         Youtube Enhanced tweakX ahkqq
// @namespace    https://github.com/MagTun/YoutubeEnhancedUserscript
// @version      0.1
// @description  Youtube enhanced
// @author       MagTun
// @match       https://www.youtube.com/*
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/462120/Youtube%20Enhanced%20tweakX%20ahkqq.user.js
// @updateURL https://update.greasyfork.org/scripts/462120/Youtube%20Enhanced%20tweakX%20ahkqq.meta.js
// ==/UserScript==

// This script adds several features:
// ● with a keyboard shortcut:
// - hide youtube control
// - save an HTML timestamps link in the clipboard as HTML
// - remove the video from all the playlists (open share...)
// - like/unlike a video
// ● every 10 sec save the current video timestamp which is use the next time the video is reloaded (the timestamp can also be save by clicking on the button)
// ● like a video after 10 seconds

var intervalID;

window.lastPathStr = location.pathname;
window.lastQueryStr = location.search;
window.lastHashStr = location.hash;

window.addEventListener("load", function () {
    addNoticeShareSave()
    window.addEventListener("keydown", dispatchkeyboard);
});

function addNoticeShareSave() {
    'use strict';
    var infoEE = document.createElement("div");
    infoEE.id = "infoEE";
    infoEE.fontSize = "15px;";
    infoEE.innerHTML = " 👍:!w ⮳:!s  💾:!x";
    infoEE.style.position = "fixed";
    infoEE.style.zIndex = "100000"
    infoEE.style.top = "140px";
    infoEE.style.left = "10px";
    infoEE.style.backgroundColor = 'white';
    document.body.appendChild(infoEE);

    // Add button to top left corner of YouTube video
    var button = document.createElement("button");
    button.id = "saveTimeEE";

    button.innerHTML = "Save time";
    button.style.position = "fixed";
    button.style.zIndex = "100000"
    button.style.top = "115px";
    button.style.left = "10px";
    document.body.appendChild(button);
    button.onclick = savetime

// Get current timestamp and save to localstorage
  function savetime() {
        var timestamp = document.getElementById("movie_player").getCurrentTime();
        var videoId = new URL(window.location.href).searchParams.get("v");
        localStorage.setItem("___" + videoId, timestamp);
        button.innerHTML = parseInt(timestamp / 60) + ":" + String(parseInt(timestamp % 60)).padStart(2, '0');
        button.style.backgroundColor = "red";
        setTimeout(function () {
            button.style.backgroundColor = "";
        }, 3000);
    };

    // Check if a timestamp has been saved for this video in localstorage
    var videoId = new URL(window.location.href).searchParams.get("v");
    var savedTimestamp = localStorage.getItem("___" + videoId);
    if (savedTimestamp) {
        // Load video at saved timestamp
        var player = document.getElementById("movie_player");
        player.seekTo(savedTimestamp);
      console.log("seekto")
        // var button = document.getElementById("saveTimeEE")
        button.innerHTML = "Reloaded at " + parseInt(savedTimestamp / 60) + ":" + String(parseInt(savedTimestamp % 60)).padStart(2, '0');
      console.log("button.innerHTML", button.innerHTML)
        button.style.backgroundColor = "green";
        // setTimeout(function(){ button.style.backgroundColor = ""; button.innerHTML = parseInt(savedTimestamp/60) + ":" + parseInt(savedTimestamp%60); }, 10000);
    }

    //like the video
    setTimeout(function () {
        if (document.getElementsByClassName("yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--segmented-start")[0].getAttribute("aria-pressed") == "true") {

            document.getElementById("infoEE").style.backgroundColor = "green"
        } else {
            document.getElementsByTagName("yt-animated-icon")[0].click() // like video
            document.getElementById("infoEE").style.backgroundColor = "rgb(220 112 235)"
        }
    }, 10000);
    intervalID = setInterval(function () {
       // document.getElementById("saveTimeEE").click()
          savetime()
    }, 10000)
};


var fireOnHashChangesToo = true;
var pageURLCheckTimer = setInterval(
    function () {
        if (window.lastPathStr !== location.pathname ||
            window.lastQueryStr !== location.search ||
            (fireOnHashChangesToo && window.lastHashStr !== location.hash)
        ) {
            window.lastPathStr = location.pathname;
            window.lastQueryStr = location.search;
            window.lastHashStr = location.hash;
           clearInterval(intervalID);
            gmMain();
        }
    }, 500
);

function gmMain() {


    setTimeout(function () {
        var saveTimeEE = document.getElementById("saveTimeEE")
        saveTimeEE.parentNode.removeChild(saveTimeEE)
        var infoEE = document.getElementById("infoEE")
        infoEE.parentNode.removeChild(infoEE)
        addNoticeShareSave()
        window.addEventListener("keydown", dispatchkeyboard);
    }, 1000);
}


//# ============================================================== ¤



function dispatchkeyboard(key) {

    //if (key.altKey){
    //  console.log("alt")
    //  }
    console.log(key.code)

    if (key.key.toLowerCase() == "x" && key.altKey) {
        https: //keycode.info/
            document.getElementById("saveTimeEE").click() // like video
    }
    if (key.key.toLowerCase() == "l" && key.altKey) { //        https: //keycode.info/
        likeVideo()
    }
    if (key.key.toLowerCase() == "w" && key.altKey) {
        https: //keycode.info/
            likeVideo()
    }


    // open save to (playlist) and remove video from all playlist and close - or if not in any playlist keep it open
    if (key.key.toLowerCase() == "s" && key.altKey) { //        https: //keycode.info/
        // remove from share

        // click on the more action button
        var moreActionsButton = document.querySelector('[aria-label="More actions"]');
        if (moreActionsButton) {
            moreActionsButton.click();

            // wait 500ms and click on save
            setTimeout(function () {
                var buttons = document.getElementsByClassName("yt-core-attributed-string")
                if (buttons) {
                    var stop = 0
                    for (let button of buttons) {
                        if (button.innerText == "Save" && stop == 0 && !button.classList.contains("yt-core-attributed-string--white-space-no-wrap")  ) {
                            stop = 1
                            button.click()

                            // every 500ms click on a playlist and close it when it's the last one, othewise do nothing
                            setTimeout(function () {

                              // get al the playlist checked
                                const checkboxes = document.querySelectorAll('.checked'); // we need a querySelectorAll to use "foreach" so that the timeout work
                                let delay = 500;
                                checkboxes.forEach((checkbox, index) => {
                                    setTimeout(() => {
                                        checkbox.click();
                                    }, delay);
                                    delay += 500;

                                  // close the shared popup after having unchecked all the playlist
                                    if (index === checkboxes.length - 1) {
                                        setTimeout(() => {
                                            document.getElementsByTagName("ytd-add-to-playlist-renderer")[0].querySelector('[aria-label="Cancel"]').click();
                                        }, delay);
                                    }

                                });
                            }, 700);
                        }
                    }
                }
            }, 700);
        }
    }




    if (key.keyCode == 65 && key.altKey) { // 65 = A   https://keycode.info/
        var classcss = ["ytp-gradient-bottom", "ytp-gradient-top", "ytp-chrome-top", "ytp-chrome-bottom"]
        classcss.forEach((classcss_element, index) => {
            var element = document.getElementsByClassName(classcss_element)[0];
            var hidden_or_display = element.style.display;
            element.style.display = hidden_or_display == "none" ? "block" : "none";
        });
    }


    if (key.key == "n" && key.altKey) {
        //https://stackoverflow.com/a/27728417/3154274
        var ytID, rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        ytID = window.location.href.match(rx)[1];
        var Url_href = "https://youtu.be/" + ytID + "?t=" + Math.round(parseFloat(document.getElementById("movie_player").getCurrentTime()))
        copyToClip(Url_href)
        // GM_notification(details, ondone), GM_notification(text, title, image, onclick) https://stackoverflow.com/a/51774547/1486850
        //GM_notification({
        // title: 'Ref copied',
        //  text: Url_href,
        // timeout: 200
        //});

        customNotif("URL copied", "red", 500)

    };

}


function likeVideo() {
    document.getElementsByTagName("yt-animated-icon")[0].click() // like video
    setTimeout(function () {
        if (document.getElementsByClassName("yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--segmented-start")[0].getAttribute("aria-pressed") == "true") {

            document.getElementById("infoEE").style.backgroundColor = "green"
        } else {
            document.getElementsByTagName("yt-animated-icon")[0].click() // like video
            document.getElementById("infoEE").style.backgroundColor = "red"
        }
    }, 3000);
}



function copyToClip(url) {
    function listener(e) {
        e.clipboardData.setData("text/plain", url);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
};

function customNotif(textNotif, colorNotif, delayNotif) {
    var div = document.createElement('div');
    div.innerHTML = '<div style="position: fixed;   left: 0;  right:0; margin:auto; top: 0; bottom:0; height:50px;   width: 300px; background-color:' + colorNotif + '; z-index:99999; text-align: center; vertical-align: middle; line-height: 50px; font-size:30px" id="notifViolCustom"><b>' + textNotif + '</b></div>'
    document.body.appendChild(div);
    var divElement = document.getElementById('notifViolCustom');

    setTimeout(function () {
        divElement.remove()
        // divElement.style.display = 'none'
    }, delayNotif);

}


// javascript: (function () {
//     var goaway = ".ytp-gradient-bottom,.ytp-gradient-top,.ytp-chrome-top,.ytp-chrome-bottom{display:none;}";
//     if ("\t" == "t") {
//         document.createStyleSheet().cssText = goaway
//     } else {
//         var tag = document.createElement("style");
//         tag.type = "text/css";
//         document.getElementsByTagName("head")[0].appendChild(tag);
//         tag[(typeof document.body.style.WebkitAppearance == "string") ? "innerText" : "innerHTML"] = goaway
//     }
// })();







// (function () {
//     console.log("start title date")

//     // https://stackoverflow.com/a/59471551
//     var old_url = '';
//     var old_title = '';
//     var mutationObserver = new MutationObserver(function (mutations) {
//         mutations.forEach(function (mutation) {
//             if (location.href != old_url) {
//                 console.log('URL was changed');
//                 old_url = location.href;
//                 try {
//                     var allTitleDate = document.getElementsByClassName("titleDate")
//                     for (var singleTitleDate of allTitleDate) {
//                         singleTitleDate.remove()
//                     }
//                 } catch (errora) {}

//                 var interval = 500;
//                 var timer = window.setInterval(function () {
//                     console.log("timer")

//                     try {
//                         var titleElement = document.getElementsByTagName("h1")[1]
//                         var title = titleElement.innerText
//                         if (title != old_title) {
//                             old_title = title
//                             var date = document.getElementById("info-strings").innerText
//                             if (date != "" && title != "") {
//                                 console.log("not empty")
//                                 var newDate = document.createElement("p");
//                                 newDate.innerHTML = "<h2 class='titleDate'>" + title + "<sup>((" + date + "))</sup></h2>"
//                                 titleElement.parentNode.insertBefore(newDate, titleElement);
//                                 titleElement.style.display = 'none';
//                                 window.clearInterval(timer);
//                             } else {
//                                 console.log("still empty")
//                             }
//                         }
//                     } catch (errorb) {
//                         console.log(errorb)
//                     }

//                 }, interval);

//             }
//         });
//     });

//     mutationObserver.observe(document.documentElement, {
//         childList: true,
//         subtree: true
//     });


//     // function addDate_in_Title() {
//     //   var alreadyChanged = 0;
//     //   console.log("start vio yt date ")
//     //   for (var i = 0; i < 40; i++) {
//     //     setTimeout(function () {
//     //       try {
//     //           var titleElement = document.getElementsByTagName("h1")[1]
//     //           var date = document.getElementById("info-strings").innerText
//     //           var newDate = document.createElement("span");
//     //           newDate.innerHTML = date
//     //           titleElement.parentNode.insertBefore(newNode, titleElement.nextSibling);


//     //         // var titleElement = document.getElementsByTagName("h1")[1]
//     //         // var title = titleElement.innerText
//     //         // var date = document.getElementById("info-strings").innerText
//     //         // // console.log("title:", title)
//     //         // // console.log("date", date)
//     //         // if (title != "" && !/\d{4}\)\)/.test(title) && date != "") {
//     //         //   // do not replace the title if empty or if it's still the title from the previous video (ex: in playlist the title didn't changed when the next video was loaded)
//     //         //   titleElement.innerHTML = title + "<sup>((" + date + "))</sup>"
//     //         //   // document.getElementsByTagName("h1")[1].innerHTML = title + "<sup>((" + date + "))</sup>"
//     //         //   alreadyChanged = 1;
//     //         // } else {
//     //         //   // console.log("youtube date false")
//     //         // }
//     //       } catch (e) {}
//     //     }, 500 * i);
//     //     if (alreadyChanged == 1) {
//     //       break;
//     //     }
//     //   }
//     // }



// })();
