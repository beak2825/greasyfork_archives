// ==UserScript==
// @name         Rizz Your Waifu
// @version      1.0.0
// @author      kevoting
// @description  Views deleted messages and auto swipes
// @match        https://beta.character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @run-at      document-start
// @namespace https://greasyfork.org/users/1106518
// @downloadURL https://update.greasyfork.org/scripts/471628/Rizz%20Your%20Waifu.user.js
// @updateURL https://update.greasyfork.org/scripts/471628/Rizz%20Your%20Waifu.meta.js
// ==/UserScript==
(function() {
    const STREAMING_URL = "https://beta.character.ai/chat/streaming/";
    const CANCEL_URL = "https://beta.character.ai/chat/history/msgs/cancel/";
    const SENTRY_URL = "sentry.io";
    const E_VERSION = "1.0.0";
    const fetchFn = window.fetch;

    var readyqueue = [];
    var last_user_msg_uuid = null;
    var mainelem = null;
    var lastheaders = null;
    var lastbody = null;
    var override_primary = null;
    var ishided = false;
    var pending_select = false;
    var activerequests = 0;
    var req_version = 0;
    var okmessages = 0;
    var templates = {
        "msg" : null
    };

    async function handlefetch(...args) {
        if (args[0] == STREAMING_URL && (mainelem != null)) {
            var json = JSON.parse(args[1].body);
            var isClean = false;
            var mode = getCurrentMode();

            lastheaders = args[1].headers;
            lastbody = json;

            if (json.hasOwnProperty("parent_msg_uuid")) {
                if (json.parent_msg_uuid == null) {
                    isClean = true;
                } else {
                    if (json.parent_msg_uuid == last_user_msg_uuid) {
                        if (mode == "nsfw") {
                            alert("Please note that if you swipe then submit the answer, it will become the chosen answer and if you choose the old one again it won't work. You should not use swipes like this with this extension.");
                        } else {
                            if (activerequests == 0) {
                                okmessages = 0;
                                requestSwipes(args[1], req_version);
                            }
                        }
                        return constructAwaiter();
                    }
                }

                if (mode == "nsfw") { //Nothing to do in normal mode
                    if (json.primary_msg_uuid == null) {
                        if (override_primary != null) {
                            json.primary_msg_uuid = override_primary;
                            args[1].body = JSON.stringify(json);
                            override_primary = null;
                        }
                    }
                }
            } else { //Weird CAI bug, happens when swipe
                alert("Bruh, something's weird. Maybe you should update the extension");
                return constructAwaiter();
            }

            if (isClean) {
                var firstrequest = tryGetNewMessage(args[1], 0, mode);
                return constructAwaiter();
            }
        }
        else {
            if (args[0].indexOf(SENTRY_URL) != -1) {
                return new Promise((resolve, reject) => {
                    reject();
                });
            }
        }

        let response = fetchFn(...args);
        return response;
    }

    var f = async (...args) => {
        return handlefetch(...args);
    }

    class EventEmitter {
        on(name, callback) {
            var callbacks = this[name];
            if (!callbacks) this[name] = [callback];
            else callbacks.push(callback);
        }

        dispatch(name, event) {
            var callbacks = this[name];
            if (callbacks) callbacks.forEach(callback => callback(event));
        }
    }

    class bubbleDOMController {
        constructor(attempt = 0) {
            this.dom = templates.msg.cloneNode(true);
            this.botname = this.dom.querySelector(".botname");
            this.botmsg = this.dom.querySelector(".botmsg");
            this.reqstatus = this.dom.querySelector(".reqstatus");
            this.streamcontroller = null;
            this.errored = false;
            this.sendedtoui = false;
            this.stopped = false;
            this.status = 0;
            this.lastchunk = null;

            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");

            for(var i = 0; i < btns.length; i++) {
                btns[i].addEventListener("click", this.onBtnClick.bind(this));
            }

            this.botname.innerText = "";
            this.botmsg.innerText = "";
            this.reqstatus.innerText = (attempt > 0) ? ("Got error, retry... x" + attempt) : "Waiting for the server...";
            this.updateBtnStatusses();
        }

        assignController(controller) {
            var self = this;
            this.streamcontroller = controller;
            controller.events.on("chunk", function(chunk) {
                if (self.dom == null) {
                    return;
                }

                if (chunk.hasOwnProperty("src_char")) {
                    if (self.status == 0) {
                        self.status = 1;
                    }
                    self.lastchunk = chunk;
                    self.botname.innerText = chunk.src_char.participant.name;
                    self.botmsg.innerText = chunk.replies[0].text;
                    self.updateBtnStatusses();
                }
            });

            controller.events.on("result", function(status) {
                if (self.dom == null) {
                    return;
                }
                switch(status.status) {
                    case "errored": {
                        self.status = 2;
                        self.errored = true;
                        self.reqstatus.innerText = status.error;
                        break;
                    }
                    case "done": {
                        if (!self.errored) {
                            self.status = 3;
                            self.reqstatus.innerText = "OK";
                        }
                        break;
                    }
                }

                self.updateBtnStatusses();
            });
        }

        informHTTPError(code) {
            this.dom.classList.add("errored");
            this.reqstatus.innerText = "HTTP " + code;
        }

        updateBtnStatusses() {
            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");
             for(var i = 0; i < btns.length; i++) {
                btns[i].style.display = "none";
            }
            switch(this.status) {
                case 1: {
                    //this.dom.querySelector("[data-tag=stopgen]").style.display = "block";
                    break;
                }
                 case 2: {
                    this.dom.classList.add("errored");
                    this.dom.querySelector("[data-tag=remove]").style.display = "block";
                    break;
                }
                case 3: {
                    if (!this.sendedtoui) {
                        this.dom.querySelector("[data-tag=sendui]").style.display = "block";
                    }
                    break;
                }
                case 4: {
                    if (this.stopped) {
                        var btn = this.dom.querySelector("[data-tag=stopgen]");
                        btn.style.display = "block";
                        btn.innerText = "Stopped";
                    }
                    break;
                }
            }
        }

        selfDestroy() {
            if (this.dom != null) {
                this.dom.parentNode.removeChild(this.dom);
                this.dom = null;
            }
        }

        onBtnClick(e) {
            var self = this;
            e.stopImmediatePropagation();

            switch(e.target.getAttribute("data-tag")) {
                case "remove": {
                    self.selfDestroy();
                    break;
                }
                case "sendui": {
                    if (!self.sendedtoui) {
                        self.sendedtoui = true;
                        override_primary = self.lastchunk.replies[0].uuid;
                        readyqueue.push(self.streamcontroller.stream);

                        let newver = ++req_version;
                        req_version = newver;
                    }
                    break;
                }
                case "stopgen": {
                    if (!self.stopped) {
                        cancelMessage(lastbody.history_external_id, self.lastchunk.replies[0].uuid, self.lastchunk.replies[0].text.length).then(function() {
                            self.status = 4;
                        });
                        self.stopped = true;
                    }
                    break;
                }
            }

            self.updateBtnStatusses();
        }
    }

    function tryGetNewMessage(args, attempt, mode) {
        var bubble = new bubbleDOMController(attempt);
        var msgbox = mainelem.querySelector(".details");
        msgbox.innerHTML = "";
        msgbox.appendChild(bubble.dom);

        if (attempt == 0) {
            last_user_msg_uuid = null;
        } else {
            var json = JSON.parse(args.body);
            json.retry_last_user_msg_uuid = last_user_msg_uuid;
            args.body = JSON.stringify(json);
        }

        var req = createAndCancel(args, mode == "nsfw");
        let newver = ++req_version;
        req_version = newver;
        readyqueue = [];
        okmessages = 0;

        req.then(function(result) {
            bubble.selfDestroy();

            if (mode == "sfw") {
                result.req.then(function(response) {
                    readyqueue.push(response.body);
                });
            }

            var chunk = result.chunk;
            var modified = JSON.parse(JSON.stringify(args));

            if (!(chunk.last_user_msg_uuid == null) && !(chunk.last_user_msg_uuid == "")) {
                last_user_msg_uuid = chunk.last_user_msg_uuid;
            }

            var modifiedjson = JSON.parse(modified.body);
            modifiedjson.parent_msg_uuid = chunk.last_user_msg_uuid;

            modified.body = JSON.stringify(modifiedjson);

            requestSwipes(modified, newver);
        });
        req.catch(function(chunk) {
            bubble.selfDestroy();

            if (typeof(chunk) == "object" && chunk.hasOwnProperty("last_user_msg_uuid")) {
                last_user_msg_uuid = chunk.last_user_msg_uuid;

                setTimeout(function() {
                    tryGetNewMessage(args, attempt + 1, mode);
                }, Math.min(2000, 5 + (attempt * 10)));
            } else {
                alert("Unexpected fatal error. Please reload the page");
            }
        });
        return req;
    }

    function requestSwipes(body, version) {
        for(var i = 0; i < 5; i++) {
            setTimeout(function() {
                createAndRegister(body, version);
            }, 500 + (i * 50));
        }
    }

    function constructAwaiter() {
        try {
            mainelem.querySelector("#cmode").classList.add("modechanger_disabled");
        } catch (ex) {}
        return new Promise((resolve, reject) => {
            var tmer = null;
            function check() {
                if (readyqueue.length > 0) {
                    clearInterval(tmer);
                    let res = new Response(readyqueue.shift(), {
                        "status": 200
                    });
                    try {
                        mainelem.querySelector("#cmode").classList.remove("modechanger_disabled");
                    } catch (ex) {}
                    resolve(res);
                }
            }
            tmer = setInterval(check, 100);
        });
    }

    function constructStreamController(response) {
        let reader = response.body.getReader();
        let emitter = new EventEmitter();
        var lastchunk = null;
        var chunkcount = 0;
        let stream = new ReadableStream({
            start(controller) {
                function pump() {
                    reader.read().then(({
                        done,
                        value
                    }) => {
                        if (done) {
                            controller.close();
                            if (chunkcount == 0) {
                                emitter.dispatch("result", {"status" : "errored", "error" : "Empty response"});
                            } else {
                                emitter.dispatch("result", {"status" : "done"});
                            }
                            return;
                        }

                        let text = new TextDecoder().decode(value);

                        if (chunkcount == 0 && ((text.length == 0) || (text.charCodeAt(0) == 60))) //<
                        {
                            controller.close();
                            emitter.dispatch("result", {"status" : "errored", "error" : "Unexpected response"});
                            return;
                        }

                        let clean = text.split(String.fromCharCode(10));
                        let chunks = [];

                        for (var i = 0; i < clean.length; i++) {
                            try {
                                chunks.push(JSON.parse(clean[i]));
                                chunkcount++;
                            } catch (ex) {}
                        }

                        if (chunks.length != 0) {
                            let chunk = chunks[chunks.length - 1];

                            if (last_user_msg_uuid != null) {
                                chunk.last_user_msg_uuid = last_user_msg_uuid;
                            }

                            if (chunk.hasOwnProperty("abort")) {
                                emitter.dispatch("result", {"status" : "errored", "error" : chunk.error, "last_user_msg_uuid" : chunk.last_user_msg_uuid});

                                if (lastchunk != null) {
                                    lastchunk.is_final_chunk = true;
                                    value = new TextEncoder().encode(JSON.stringify(lastchunk) + String.fromCharCode(13, 10));
                                    emitter.dispatch("chunk", lastchunk);
                                }
                            } else {
                                lastchunk = chunk;

                                value = new TextEncoder().encode(JSON.stringify(lastchunk) + String.fromCharCode(13, 10));
                                emitter.dispatch("chunk", chunk);

                                if (chunk.is_final_chunk) {
                                    emitter.dispatch("result", {"status" : "done"});
                                }
                            }
                        }

                        controller.enqueue(value);
                        pump();
                    })
                }
                pump();
            }
        });

        return {
            "stream": stream,
            "events": emitter
        };
    }

    function cancelMessage(history,uuid,letters) {
        let newopts = {};
        newopts.method = "POST";
        newopts.headers = lastheaders;
        newopts.body = JSON.stringify({ "history_id" : history, "msg_uuid" : uuid, "num_letters" : letters});
        var req = fetchFn(CANCEL_URL, newopts);
        return req;
    }

    function createAndRegister(params, version) {
        if (version == req_version) {
            if (activerequests >= 3) {
                return;
            }
            let max = (getCurrentMode() == "nsfw") ? 50 : 5;
            if (okmessages >= max) {
                return;
            }
            activerequests++;
            var req = createAndBuild(params);
            req.then(function(chunk) {
                activerequests = Math.max(0, activerequests - 1);
                okmessages++;
                createAndRegister(params, version);
            });
            req.catch(function(err) {
                activerequests = Math.max(0, activerequests - 1);

                if (err.status != 429) {
                    createAndRegister(params, version);
                }
            });
        }
    }

    function createAndBuild(params) {
        return new Promise((resolve, reject) => {
            var req = fetchFn(STREAMING_URL, params);
            var lastchunk = null;
            var bubble = new bubbleDOMController();
            mainelem.querySelector(".details").appendChild(bubble.dom);

            req.then(function(res) {
                if (res.ok) {
                    let controller = constructStreamController(res);
                    bubble.assignController(controller);
                    controller.events.on("chunk", function(chunk) {
                        lastchunk = chunk;
                        if (chunk.is_final_chunk) {
                            resolve(chunk);
                        }
                    });
                    controller.events.on("result", function(result) {
                        switch(result.status) {
                            case "errored": {
                                reject({"status" : 200, "error" : new Error(result.error)});
                                break;
                            }
                            case "done": {
                                resolve(lastchunk);
                            }
                        }
                    });
                } else {
                    bubble.informHTTPError(res.status);
                    reject({"status": res.status, "error" : null});
                }
            });
            req.catch(function(error) {
                reject({"status": 0, "error" : error});
            });
        });
    }

    function createAndCancel(params, sendcancel) {
        return new Promise((resolve, reject) => {
            var req = fetchFn(STREAMING_URL, params);
            var lastchunk = null;
            var sendedcancel = !sendcancel;
            req.then(function(res) {
                let controller = constructStreamController(res.clone());
                controller.events.on("chunk", function(chunk) {
                    lastchunk = chunk;
                    if (chunk.is_final_chunk) {
                        resolve({"chunk": chunk, "req" : req});
                    } else {
                        if (!sendedcancel) {
                            cancelMessage(lastbody.history_external_id, chunk.replies[0].uuid, 1).catch(function(e) {
                                reject(new Error("Failed to cancel"));
                            }).then(function() {
                                sendedcancel = true
                            });
                        }
                    }
                });
                controller.events.on("result", function(result) {
                    switch(result.status) {
                        case "errored": {
                            reject(result);
                            break;
                        }
                        case "done": {
                            resolve({"chunk": lastchunk, "req" : req});
                        }
                    }
                });
            });
            req.catch(function(error) {
                reject(error);
            });
        });
    }

    function getCurrentMode() {
        var value = mainelem.querySelector('input[name="drone"]:checked').value;
        return value;
    }

    function switchVisibility() {
        ishided = !ishided;
        var width = mainelem.clientWidth;

        if (!ishided) {
            mainelem.style.transform = "";
        } else {
            mainelem.style.transform = "translateX(" + width + "px)";
        }
    }

    f.prototype = fetchFn.prototype;
    window.fetch = f;

    var timer = null;

    window.addEventListener("load", function() {
        timer = setTimeout(function() {
            try {
                var style = document.createElement('style');
                style.innerHTML = `
       .ptrk_main {position: fixed; margin: 0; z-index: 9999; background-color: rgba(33,37,41,0.85); right: 0px; top: 0px; height: 100%; padding: 18px; color: white; font-size: 13px; transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); user-select: none; } .ptrk_hide {width: 30px; height: 150px; left: -30px; top: 50%; border-bottom-left-radius: 5px; border-top-left-radius: 5px; position: absolute; cursor: pointer; background-color: rgba(33,37,41,0.85); } .ptrk_main .modechanger_disabled {opacity: 0.3; pointer-events: none; cursor: no-allowed; } .ptrk_main legend, fieldset {float: initial; line-height: initial; font-size: initial; margin-bottom: initial; padding: initial; width: initial; background: initial; border: initial; border-color: initial; background-color: initial; font-size: 12px; padding-inline-start: 5px; padding-inline-end: 5px; } .ptrk_main label {background: initial; background-color: initial; font-size: 12px; } .ptrk_main fieldset {display: flex; justify-content: center; margin-bottom: 10px; border: 1px solid rgb(59 59 63) !important; border-radius: 3px; font-size: 12px; } .ptrk_main .details {display: relative; overflow-y: scroll; min-width: 400px; max-width: 400px; min-height: 100px; } .ptrk_main .details p {margin: 0; margin-top: 0.5em; font-size: 12px; user-select: text; } .ptrk_main .errored {background: #4f3432 !important; } .ptrk_main .details .mbubble {padding: 10px; border-radius: 3px; margin: 6px; background: rgb(56 59 63); cursor: pointer; position: relative; } .ptrk_main .details .topbtns {position: absolute; width: 100%; right: 10px; display: flex; justify-content: flex-end; height: 30px; } .ptrk_main .details .abtn {padding: 6px; border-radius: 3px; font-weight: bold; z-index: 2; background: rgb(95 99 101); } .ptrk_main .details .abtn:active {background: rgb(118 123 125); } .ptrk_main input[type=radio] {position: absolute; opacity: 0; width: 0; height: 0; } .ptrk_main input[type=radio] + label {filter: grayscale(1.0); background: rgb(56 59 63); border-radius: 2px; padding: 5px; cursor: pointer; display: flex; margin: 3px; min-width: 56px; font-size: 12px; align-items: center; justify-content: center; flex-direction: column; } .ptrk_main input[type=radio]:checked + label {filter: none; background: rgb(77 81 84); !important; } .ptrk_main small {font-size: 12px; } .ptrk_icon {height: 23px; position: absolute; z-index: 9999; background-color: #212529; font-family: 'Arial'; left: 20px; padding: 6px; top: 20px; border-radius: 5px; color: white; opacity: 0.5; transition: all 0.2s; } .ptrk_icon:hover {opacity: 1.0; cursor: pointer } @media (max-width:500px) {.ptrk_main .details {max-width: 300px; min-width: 300px; } }
`;
                document.body.appendChild(style);

                var maindom = document.createElement('div');
                maindom.classList.add("ptrk_main");
                maindom.innerHTML = `
		<div class="ptrk_hide"></div> <fieldset id="cmode"> <legend>Mode</legend> <div> <input type="radio" id="sfw" name="drone" value="sfw" checked> <label for="sfw" title="Sends response and generates swipes"> <img src="data:image/png;base64,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"> <span>Puritian</span> </label> </div> <div> <input type="radio" id="nsfw" name="drone" value="nsfw"> <label for="nsfw" title="Waits for the user for selecting messages, also kills first response"> <img src="data:image/png;base64,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"> <span>NSFW</span> </label> </div> </fieldset> <fieldset style="height:calc(100% - (85px + 60px))"> <legend>Responses</legend> <div class="details"> <div class="mbubble"> <div class="topbtns"> <div class="abtn" data-tag="sendui">Send to UI</div> <div class="abtn" data-tag="remove">Remove</div> <div class="abtn" data-tag="stopgen">Stop gen</div> </div> <b class="botname">%botname</b> <p class="botmsg">%msg</p> <small class="reqstatus">%STATUS</small> </div> </div> </fieldset> <fieldset style="display:none"> <legend>Stadistics</legend> <div class="details"> <small class="msgcnt"><span>NaN</span> messages</small><br> <small class="filtercnt"><span>NaN</span> filter errors</small><br> <small class="date">Tracking since <span>%DATE%</span></small> </div> </fieldset> <span id="eversion">0.9.0</span>
`;

                mainelem = maindom;
                var msgtemplate = maindom.querySelector(".ptrk_main .details .mbubble");
                templates.msg = msgtemplate.cloneNode(true);
                msgtemplate.parentNode.removeChild(msgtemplate);

                mainelem.querySelector(".ptrk_hide").addEventListener("click", switchVisibility);
                mainelem.querySelector("#eversion").innerText = E_VERSION;
                document.body.appendChild(maindom);
            } catch (ex) {}
        }, 1);
    });
})();