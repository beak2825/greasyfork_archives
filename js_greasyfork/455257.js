// ==UserScript==
// @name         survey_helper
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  try to take over the world!
// @author       You
// @match        https://vscode.dev/liveshare/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455257/survey_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/455257/survey_helper.meta.js
// ==/UserScript==

setTimeout(() => {
    main();
}, 15000)

function main() {
    'use strict';

    var getTime = function () {
        return new Date().getTime();
    };

    var funDownload = function (content, filename) {
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };
    var status = false;
    var autocompleteInfo = "";
    var isAutocompleteOpen = false;
    var initTime = getTime();
    var keyStore = "";
    var majorKeys = ""; // Time Keycode Event_type: it is 1 2 3 4 corresponding to Keybindings to monitor
    var timeout = 3000000;// 15 mins in ms
    const config = {
        attributes: true
    };
    var curFilename = "";
    var targetNode;
    var observer;
    const callback = mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes') {
                if (mutation.attributeName == "aria-haspopup") {
                    if (isAutocompleteOpen != (mutation.target.ariaHasPopup === 'true')) {
                        isAutocompleteOpen = (mutation.target.ariaHasPopup === 'true')
                        let cur = getTime() - initTime;
                        autocompleteInfo += cur + " " + isAutocompleteOpen + "\n";
                        console.log(isAutocompleteOpen)
                    }
                }
            }
        });
    }

    console.log("here");

    var controlelement = document.createElement("div");
    controlelement.setAttribute("id", "controlPanel");
    controlelement.style.marginLeft = "5px"
    controlelement.style.marginRight = "5px"
    controlelement.style.fontSize = "16px";
    controlelement.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 5%;Right: 10%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(255, 255, 255,.7);font-size: 16px;";
    var inputStart = document.createElement("input")
    inputStart.type = "button";
    inputStart.value = "Start"
    inputStart.onclick = function () {
        if (document.getElementsByClassName("inputarea monaco-mouse-cursor-text").length != 0) {
            targetNode = document.getElementsByClassName("inputarea monaco-mouse-cursor-text")[0];

            observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        }

        if (document.getElementsByClassName("editor-instance").length != 0) {
            curFilename = document.getElementsByClassName("editor-instance")[0].ariaLabel.charAt(0)
        }
        status = true;
        initTime = getTime();
        let a = document.getElementById("controlPanel")
        a.parentElement.removeChild(a)

        setTimeout(async () => {
            status = false;
            let event = new KeyboardEvent('keydown', {
                key: "s",
                code: "KeyS",
                ctrlKey: true
            });

            document.dispatchEvent(event);

            Toast("Time is up, doing final submission now")
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (document.getElementsByClassName("editor-instance").length != 0) {
            }

            let p = document.createElement("h1")
            p.textContent = "Thank you for finishing this part, your contribution is recorded"
            p.style.fontSize = "60px"
            p.style.marginLeft = "5%"
            let p1 = document.createElement("p")
            p1.textContent = "Click the Download result button below to download monitoring data and send back to us. Please Ask monitor for the content of the next part."
            p1.style.fontSize = "20px"
            p1.style.marginLeft = "5%"
            let downloadContent = document.createElement("input")
            downloadContent.type = "button";
            downloadContent.value = "Download Result"
            downloadContent.style.marginLeft = "5%"
            if ('download' in document.createElement('a')) {
                downloadContent.addEventListener('click', function () {
                    let temp = "===Keystore\n" + keyStore + "\n===MajorKey\n" + majorKeys + "\n===Autocomplete\n" + autocompleteInfo;
                    funDownload(temp, 'run.txt');
                });
            } else {
                downloadContent.onclick = function () {
                    alert('Browser doesn\'t support!');
                };
            }
            document.body.innerHTML = window.trustedTypes.emptyHTML;
            document.body.style.backgroundColor = "white"
            document.body.appendChild(p)
            document.body.appendChild(p1)
            document.body.appendChild(downloadContent)

        }, timeout);

        setTimeout(() => {
            Toast((timeout / 180000).toFixed(0) + "mins left")
        }, (timeout - timeout / 3));

        setTimeout(() => {
            Toast((timeout / 900000).toFixed(0) + "mins left")
        }, (timeout - timeout / 15));
    }

    // var p = document.createElement("span")
    // p.id = "Time"
    // p.textContent = "10"
    // p.style = "color: white"
    // controlelement.appendChild(p)
    controlelement.appendChild(inputStart)
    // var showTime = document.createElement("input")
    // showTime.type = "button";
    // showTime.value = "Show"
    // showTime.onclick = function (){

    // }
    // var hideTime = document.createElement("input")
    // hideTime.type = "button";
    // hideTime.value = "Hide"
    // hideTime.onclick = function (){

    // }
    // controlelement.appendChild(showTime)
    // controlelement.appendChild(hideTime)

    document.body.appendChild(controlelement);


    document.addEventListener("keydown", (event) => {
        // console.log(event.code)
        if (status) {
            let cur = getTime() - initTime;
            keyStore += cur + " " + event.code + "\n";
            // event.key
            switch (event.code) {
                case "Space":
                    if (event.ctrlKey) // Ctrl + space
                        majorKeys += cur + " " + event.code + " 1 " + curFilename + "\n";
                    break;
                case "Escape":
                    if (isAutocompleteOpen) {
                        majorKeys += cur + " " + event.code + " 2 " + curFilename + "\n";
                    }
                    break;
                case "Enter":
                    if (isAutocompleteOpen) {
                        majorKeys += cur + " " + event.code + " 3 " + curFilename + "\n";
                    }
                    break;
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":// arrow key event
                    if (isAutocompleteOpen) {
                        majorKeys += cur + " " + event.code + " 4 " + curFilename + "\n";
                    } break;
                case "Tab":
                    if (isAutocompleteOpen) {
                        majorKeys += cur + " " + event.code + " 5 " + curFilename + "\n";
                    }
                    break;
            }
        }
        // event.code
    }, true);

    var mousedownEvent = function (event) {
        if (status) {
            // console.log(event);

            if (document.getElementsByClassName("inputarea monaco-mouse-cursor-text").length != 0) {
                targetNode = document.getElementsByClassName("inputarea monaco-mouse-cursor-text")[0];
                observer.disconnect();
                observer.observe(targetNode, config);
            }


            if (document.getElementsByClassName("editor-instance").length != 0) {
                curFilename = document.getElementsByClassName("editor-instance")[0].ariaLabel.charAt(0)
            }

            let cur = getTime() - initTime;
            majorKeys += cur + " leftClick 6 " + event.screenX + "," + event.screenY + "\n";
            console.log("MouseEvent")


        }
    }

    if (window.PointerEvent) {
        document.addEventListener('pointerdown', mousedownEvent);
    } else {
        document.addEventListener('mousedown', mousedownEvent);
    }
    // Your code here...
};


function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.textContent = msg;
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
}