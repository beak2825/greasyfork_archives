// ==UserScript==
// @name         diep.io recorder
// @version      2.4
// @description  read title
// @author       woold#2808
// @match        https://diep.io/*
// @run-at       document-start
// @grant		 unsafeWindow
// @grant		 GM_addStyle
// @namespace https://greasyfork.org/users/452524
// @downloadURL https://update.greasyfork.org/scripts/434695/diepio%20recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/434695/diepio%20recorder.meta.js
// ==/UserScript==

var gameScene = "menu";
const WebSocketProxy = new Proxy(unsafeWindow.WebSocket, {
    set: (target, key, value) => {
        return true;
    },
    get: (target, key) => {
        if (key !== "__isProxy") {
            return target[key];
        }

        return true;
    },

    construct(target, args) {
        if (args[0] === 'noProxy') {
            if (target.__isProxy) {
                return Reflect.construct(target, args);
            } else {
                return Reflect.construct(target, args.slice(1));
            }
        }

        const instance = Reflect.construct(...arguments);

        const instanceProxy = new Proxy(instance.send, {
            apply(target, thisArg, args) {
                if (args[0] instanceof Int8Array && args[0][0] === 1) {
                    if (args[0].length === 11) {
                        const array1 = [...args[0].slice(3, 11)];
                        const array2 = new Array(8).fill(0);
                        if (!array1.every((value, index) => value === array2[index]) && gameScene == "menu") {
                            gameScene = "playing";
                            updateElems();
                        }
                    } else if (args[0].length == 2 && args[0].every((value, index) => value === [1,0][index])) {
                        gameScene = "menu";
                        updateElems();
                    }
                }

                return Reflect.apply(...arguments);
            }
        });

        instance.send = instanceProxy;

        instance.addEventListener("close", function() {
            gameScene = "menu";
            updateElems();
        })

        return instance;
    }
});

unsafeWindow.WebSocket = WebSocketProxy;

const CVS = !!unsafeWindow.OffscreenCanvasRenderingContext2D?"OffscreenCanvasRenderingContext2D":!!unsafeWindow.CanvasRenderingContext2D?"CanvasRenderingContext2D":"";

if (!!CVS) {
    const fillTextProxy = new Proxy(unsafeWindow[CVS].prototype.fillText, {
        set: (target, key, value) => {
            return true;
        },
        get: (target, key) => {
            if (key !== "__isProxy") {
                return target[key];
            }

            return true;
        },
        apply(target, thisArg, args) {
            if (args[0] === 'noProxy') {
                if (target.__isProxy) {
                    return Reflect.apply(target, thisArg, args);
                } else {
                    return Reflect.apply(target, thisArg, args.slice(1));
                }
            }
            if (!args[0].includes("-")) {
                if (args[0].includes("Lvl ") && gameScene == "menu") {
                    gameScene = "playing";
                    updateElems();
                } else if (args[0].includes("Points: ") && args[0] != "Points: 0" && gameScene == "playing") {
                    gameScene = "death";
                    updateElems();
                }
            }
            return Reflect.apply(...arguments);
        }
    });
    unsafeWindow[CVS].prototype.fillText = fillTextProxy;
} else {
    alert(`Your browser doesn't support this script, try switching to Chrome or Firefox or uninstall the script nammed "${GM_info.script.name}"`)
}

var mediaRecorder;

function download(data, filename = 'untitled') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

GM_addStyle(`
.menu{
pointer-events: none; position: fixed; left:10px; color: rgba(255,255,255,0.5); font-style: normal; font-variant: normal;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;outline: 0;
}
* {
font-family: 'Ubuntu';
}
`)

var hasMenuDisp = false;
var noDwnld = false;

function updateElems() {
    if (!!mediaRecorder) {
        document.getElementById("recordBanner").innerHTML = `<p>•Press ${gameScene == "menu"?"[CTRL]+":""}[R] to ${mediaRecorder.state != "inactive"? "stop and save the recording or "+(gameScene == "menu"?"[CTRL]+":"")+"[P] to "+(mediaRecorder.state == "paused"?"resume":"pause")+" the recording or "+(gameScene == "menu"?"[CTRL]+":"")+"[Digit0] to cancel the recording":"start the recording"}</p>`;
    }
    if (!!document.getElementById("menuDisp") && hasMenuDisp) {
        document.getElementById("menuDisp").innerHTML = `<p>•Use ${gameScene == "menu"?"[CTRL]+":""}[Equal] key to toggle menu display</p>`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    try {
        var recIcon = document.createElement("a");
        document.body.appendChild(recIcon);
        recIcon.outerHTML = `<div id="recIcon" style="display: none;font-family: 'Ubuntu';-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;"><img id="recImg" src="https://i.imgur.com/d0lbnwr.png" style="position: fixed;right:43px;bottom:13px;width:12px;height:12px;"></img><a style="position: fixed;right:10px;bottom:10px;color:red;">REC</a></div>`
        var recOp = 1;
        var recOpDir = "down";
        setInterval(function(){
            if (!!mediaRecorder && mediaRecorder.state == "paused") {
                recOp = 1;
            } else {
                if (recOp >= 1) {
                    recOpDir = "down";
                } else if (recOp <= 0) {
                    recOpDir = "up";
                }
                if (recOpDir == "down") {
                    recOp -= 0.01;
                } else if (recOpDir == "up") {
                    recOp += 0.01;
                }
            }
            document.getElementById('recImg').style.opacity = recOp;
        },20)
        var videoStream = document.getElementById('canvas').captureStream(60);
        mediaRecorder = new MediaRecorder(videoStream);
        var chunks = [];
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };
        mediaRecorder.onstop = function(e) {
            if (!noDwnld) {
                var blob = new Blob(chunks, { 'type' : 'video/mp4' });
                download(URL.createObjectURL(blob),(localStorage.florrio_nickname||"Unnamed Flower")+' - florr.io.mp4');
            } else {
                noDwnld = false;
            }
            chunks = [];
        };
        if (!localStorage.noalert || localStorage.noalert == "false") {
            if (!localStorage.recDemo) {
                alert("Press [R] to start/stop the recording, an icon is displayed in the down left corner when recording is active, press [CTRL]+[R] to start the recording in the menu and [Digit0] to cancel a running recording.")
                localStorage.recDemo = true;
            }
        }
        var overlay = document.createElement("div");
        overlay.className = "menu";
        overlay.id = "recordBanner";
        overlay.innerHTML = `<p>•Press ${gameScene == "menu"?"[CTRL]+":""}[R] to ${mediaRecorder.state != "inactive"? "stop and save the recording or "+(gameScene == "menu"?"[CTRL]+":"")+"[P] to "+(mediaRecorder.state == "paused"?"resume":"pause")+" the recording or "+(gameScene == "menu"?"[CTRL]+":"")+"[Digit0] to cancel the recording":"start the recording"}</p>`;
        overlay.style.top = (30+document.getElementsByClassName("menu").length*20)+"px";
        document.body.appendChild(overlay);
        if (!document.getElementById('menuDisp')){
            hasMenuDisp = true;
            overlay = document.createElement("div");
            overlay.innerHTML = `<p>•Use ${gameScene == "menu"?"[CTRL]+":""}[Equal] key to toggle menu display</p>`;
            overlay.id = "menuDisp";
            overlay.style.display = "none";
            document.body.appendChild(overlay);
            setTimeout(function(){
                overlay.style.display = "block";
                overlay.style.top = (30+document.getElementsByClassName("menu").length*20)+"px";
                overlay.className = "menu";
            },100)
        }
        var menuDisp = document.getElementById('menuDisp');
        var observer = new MutationObserver(function(){
            for (var i = 0; i < document.getElementsByClassName("menu").length; i++) {
                document.getElementsByClassName("menu")[i].style.display = menuDisp.style.display;
            }
        });
        observer.observe(menuDisp, { attributes: true, childList: true });
    } catch (e) {
        if (!localStorage.heknows || localStorage.heknows == "false") {
            alert("sorry the recording feature isn't supported on your browser, you can uninstall this script :'( but hey maybe you can still take screenshots! press Enter to open a new tab with a script for that :D");
            window.open("https://greasyfork.org/en/scripts/405221-florr-io-take-high-quality-screenshots")
            localStorage.heknows = true;
        }
    }
    document.addEventListener("keydown", function (e) {
        if (!!mediaRecorder && (e.code == "KeyR" || e.code == "KeyP" || e.code == "Digit0") && (e.ctrlKey || gameScene != "menu")) {
            e.preventDefault();
            if (e.code == "KeyR") {
                mediaRecorder[mediaRecorder.state=="inactive"?"start":"stop"]();
                updateElems();
            } else if (e.code == "KeyP" && mediaRecorder.state != "inactive") {
                mediaRecorder[mediaRecorder.state != "paused"?"pause":"resume"]();
                updateElems();
            } else if (e.code == "Digit0" && mediaRecorder.state != "inactive") {
                e.preventDefault();
                e.stopPropagation();
                noDwnld = true;
                mediaRecorder.stop();
                updateElems();
            }
            document.getElementById('recIcon').style.display = mediaRecorder.state!="inactive"?"block":"none";
            document.querySelector('#recIcon > img').style.right = mediaRecorder.state=="paused"?"75px":"43px";
            document.querySelector('#recIcon > a').innerText = mediaRecorder.state=="paused"?"PAUSED":"REC";
        } else if (!!menuDisp && (e.code == "Equal" && (e.ctrlKey || gameScene != "menu") || e.code == "Equal" && menuDisp.style.display == "none") && hasMenuDisp) {
            e.preventDefault();
            menuDisp.style.display = menuDisp.style.display != "none"? "none" : "block";
        }
    })
})