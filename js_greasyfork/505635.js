// ==UserScript==
// @name         Rizz Your Waifu
// @version      1.7.0
// @author      kevoting
// @description  auto swiper/message swiper
// @match        https://old.character.ai/*
// @match        https://old.character.ai/chat?*
// @match        https://old.character.ai/chat?source=recent-chats&char=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @run-at      document-start
// @namespace https://greasyfork.org/users/1077492
// @downloadURL https://update.greasyfork.org/scripts/505635/Rizz%20Your%20Waifu.user.js
// @updateURL https://update.greasyfork.org/scripts/505635/Rizz%20Your%20Waifu.meta.js
// ==/UserScript==
(function() {
    const HIGHLIGHT_DEFAULT_COLOR = "red"; //Ex: red, #FFFFFF, rgba(255,255,255);
    const DEFAULT_STORAGE = "__RYW";

    //CAI has a lot of trackers now
    const NO_ERROR_REPORTING = false;
    const NO_TRACKING = true;
    const NO_MONITORING = true;

    const STREAMING_URL = "https://" + document.location.hostname + "/chat/streaming/";
    const CANCEL_URL = "https://" + document.location.hostname + "/chat/history/msgs/cancel/";

    const SENTRY_URL = "sentry.io";
    const EVENTS_URL = "events.character.ai";
    const CLOUD_MONITORING_NAME = "datadoghq";

    const E_VERSION = "1.7.0";
    const PROTOCOL_LEGACY = "LEGACY";
    const PROTOCOL_NEO = "NEO";
    const BETA = "BETA";
    const NEXT = "NEXT";
    const fetchFn = window.fetch;
    const sendSocketfn = window.WebSocket.prototype.send;

    //TODO: redo this shit
    var current_protocol = PROTOCOL_LEGACY;
    var readyqueue = [];
    var last_user_msg_uuid = null;
    var last_params = null;
    var mainelem = null;
    var lastheaders = null;
    var lastbody = null;
    var override_primary = null;
    var ishided = false;
    var allow_generating = true;
    var activerequests = 0;
    var req_version = 0;
    var okmessages = 0;
    var templates = {
        "msg": null
    };
    var last_chat_id = null;
    var current_state = null;
    var warned = false;
    var highlight_words_cache = [];
    var character_cache = [];

    /*Chat2 support*/
    var neo_socket = null;
    var neo_waiting_for_turn = false;
    var neo_waiting_for_delete = false;
    var neo_payload_origin = "";
    var neo_capture_next_request = false;
    var neo_captured_next_request = "";
    var neo_readyqueue = [];
    var neo_requests = new Map();
    var neo_last_request_id = "";
    var neo_last_candidate_id = "";
    var neo_last_turn = null;
    var neo_swiper = null;
    var neo_sended = false;
    var neo_ignore_delete_prompt = false;
    var custom_prompt = null;

    //*** CODE FROM CHARACTER SELECTOR, THIS WILL BREAK WHEN OLD SITE RIP ***
    var characters_in_chat_cache = [];
    var selected_character_id = "";
    var modal = null;
    var dropdown = null;
    var watchdog = null;

    class ProfilePhotoWatchdog {
        constructor() {
            this.dom = null;
            this.observer = null;
            this.initialized = false;
            this.firstcheck = false;
            this.nodes_to_analyze_later = [];
            setTimeout(this.tryInit, 1);
        }

        tryInit() {
            try {
                var self = this;
                this.dom = document.querySelector(".chat2");
                if (this.dom == undefined || this.dom == null) {
                    setTimeout(this.tryInit, 10);
                    return;
                }

                let thisElement = this.dom.querySelector(".inner-scroll-view");

                if (thisElement == null) {
                    setTimeout(this.tryInit, 10);
                    return;
                }

                this.dom = thisElement;

                this.observer = new MutationObserver(function (e) {
                    e.forEach(function(record) {
                        if (record.addedNodes.length > 0) {
                            for (let i = 0; i < record.addedNodes.length; i++) {
                                let item = record.addedNodes[i];
                                watchdog.analyzeNode(item);
                            }
                        }
                    });
                });

                this.observer.observe(thisElement, { childList: true });
                this.initialized = true;
                this.firstTreatment();
            } catch (ex) {
                setTimeout(this.tryInit, 3000);
            }
        }

        firstTreatment() {
            if (!this.firstcheck) {
                let nodes = this.dom.childNodes;
                for (let i = 0; i < nodes.addedNodes.length; i++) {
                    let node = nodes[i];
                    this.analyzeNode(node);
                }
                this.firstcheck = true;
            }
        }

        analyzeNode(node) {
            let img = node.querySelector("img");

            if (img !== null) {
                //so maybe this is a message, idk
                try {
                    let element = node.querySelector(".rounded");

                    if (element !== null) { //hmm
                        let result = characters_in_chat_cache.some(function(charData) {
                            if (element.parentElement.innerHTML.indexOf(charData.participant__name) != -1) {
                                img.src = "https://characterai.io/i/80/static/avatars/" + charData.avatar_file_name;
                                return true;
                            }
                            return false;
                        });

                        if (!result) {
                            this.nodes_to_analyze_later.push(node);
                        }
                    }
                } catch (ex) {
                }
            }
        }

        analyzePending() {
            try {
                let nodes = this.nodes_to_analyze_later;
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    this.analyzeNode(node);
                }
                this.nodes_to_analyze_later = [];
            } catch (ex) {
                this.nodes_to_analyze_later = [];
            }
        }
    }

    class FakeDropdownController {
        constructor() {
            this.dom = document.createElement("div");
            this.dom.innerHTML = '<div class="col-auto ps-2 dropdown dropup show"><span data-toggle="dropdown" aria-haspopup="listbox" class="" aria-expanded="true"> <div data-tag="currentChar" style="cursor: pointer;display: flex;justify-content: center;align-items: center;"><b data-tag="currentCharName">Loading...</b><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path> </svg></div> </span> <div data-tag="dropDownMenu" tabindex="-1" role="listbox" aria-hidden="false" class="dropdown-menu show" style="position: absolute;inset: auto 0px 0px auto;transform: translate(0px, -24px);display: none;"> <h6 tabindex="-1" class="dropdown-header">Select character to reply...<br><small>(press enter to not reply)</small></h6> <div tabindex="-1" class="dropdown-divider"></div><button type="button" data-tag="charBtn" tabindex="0" role="option" class="dropdown-item" style="display: flex; align-items: center;"> <div>Char</div> </button><button type="button" data-tag="newCharBtn" tabindex="0" role="option" class="dropdown-item" style="display: flex; align-items: center;"> <div><em>new character...</em></div> </button> </div> </div>';
            this.dom.style = "display: flex; justify-content: center; align-items: center; margin: 10px; user-select:none";
            this.charbtn = this.dom.querySelector("[data-tag=charBtn]");
            this.newcharbtn = this.dom.querySelector("[data-tag=newCharBtn]");
            this.dropdownmenu = this.dom.querySelector("[data-tag=dropDownMenu]");
            this.currentchar = this.dom.querySelector("[data-tag=currentChar]");
            this.isvisible = false;

            this.dom.addEventListener("click", this.onClick.bind(this));
            this.newcharbtn.addEventListener("click", this.onAddNewChar.bind(this));
            document.getElementById("user-input").parentElement.insertBefore(this.dom, null);
        }

        destroy() {
            this.isvisible = false;
            this.dom.parentNode.removeChild(this.this);
        }

        onClick(e) {
            var self = this;
            this.isvisible = !this.isvisible;
            this.dropdownmenu.style.display = this.isvisible ? "block" : "none";

            let buttons = this.dropdownmenu.querySelectorAll("button");

            for(var i = 0; i < buttons.length; i++) {
                let button = buttons[i];
                if (button.getAttribute("data-tag") === "newCharBtn") {
                    continue;
                }

               button.parentNode.removeChild(button);
            }

            characters_in_chat_cache.forEach(function(charData) {
                let newUiElement = self.charbtn.cloneNode(true);
                newUiElement.innerText = charData.participant__name;
                newUiElement.setAttribute("data-externalid", charData.external_id);
                newUiElement.addEventListener("click", function(e) {
                    selectCharacter(this.getAttribute("data-externalid"));
                });

                self.dropdownmenu.querySelector(".dropdown-divider").parentElement.insertBefore(newUiElement, self.newcharbtn);
            });
        }

        onAddNewChar(e) {
            modal = new FakeModalController();
        }
    }

    class FakeModalController {
        constructor() {
            this.dom = document.createElement("div");
            this.dom.innerHTML = '<div class=""> <div class="modal fade show" role="dialog" tabindex="-1" style="display: block;"> <div class="modal-dialog modal-dialog-centered" role="document" style="margin-top: 0px;"> <div class="modal-content"> <div class="modal-body"> <div data-tag="charList" style="user-select:none;max-height: 300px;overflow-y: scroll;overflow-x: hidden;display: flex;flex-direction: column;"> <div data-tag="charOption" style="width:100%"> <img src="https://characterai.io/i/80/static/avatars/uploaded/2023/3/22/WOUx3xnZRql_j1TsQfS1TcNCI30D6uoPQvlGlKdYxHg.webp" style="height: 45px;width: 45px;margin-right: 10px;border-radius: 45px;object-fit: contain;"><b style="pointer-events:none">charname</b> <span style="pointer-events:none">@charowner</span> </div> </div> <input data-tag="searchInput" placeholder="Search..." style="width: 100%;"> </div> <div class="modal-footer"><span>Missing character? Start a chat, then reload the page!</span><button data-tag="cancelButton" type="button" class="btn btn-secondary">Cancel</button><button data-tag="addButton" type="button" disabled="" class="btn btn-primary disabled">Add</button></div> </div> </div> </div> <div class="modal-backdrop fade show"></div> </div>';
            this.dom.style = "position: relative; z-index: 1050; display: block;";
            this.chartemplate = this.dom.querySelector('[data-tag="charOption"]');
            this.charlist = this.dom.querySelector('[data-tag="charList"]');
            this.addbtn = this.dom.querySelector('[data-tag="addButton"]');
            this.charlist.removeChild(this.chartemplate);
            this.selectedid = "";
            this.selected = null;

            this.dom.querySelector('[data-tag="cancelButton"]').addEventListener("click", this.onCancel.bind(this));
            this.addbtn.addEventListener("click", this.onAdd.bind(this));
            this.dom.querySelector('[data-tag="searchInput"]').addEventListener("keyup", this.onSearchInputKey.bind(this));

            document.body.appendChild(this.dom);
            this.onData(character_cache.slice(0, 100));
        }

        onCancel(e) {
            this.dom.parentNode.removeChild(this.dom);
        }

        onSearchInputKey(e) {
            let value = e.target.value.toLowerCase();

            let results = character_cache.filter(function (charData) {
                return charData.participant__name.toLowerCase().indexOf(value) != -1;
            });

            this.onData(results.slice(0, 100));
        }

        onData(data) {
            var self = this;
            this.charlist.innerHTML = "";
            data.forEach(function(each) {

                let newUiElement = self.chartemplate.cloneNode(true);
                newUiElement.querySelector("b").innerText = each.participant__name;
                newUiElement.querySelector("span").innerText = "@" + each.user__username;
                newUiElement.setAttribute("data-externalid", each.external_id);
                newUiElement.querySelector("img").src = (each.avatar_file_name.length > 1) ? ("https://characterai.io/i/80/static/avatars/" + each.avatar_file_name) : "https://characterai.io/i/80/static/avatars/uploaded/2022/12/6/j7C6apwVP7XPVkqssQH5VPlFQ6AGBZFBpJKT9NIKYlc.webp";

                //No css injected, so i need use this lol
                newUiElement.addEventListener("click", function(e) {
                    if (self.selected !== null) {
                        self.selected.style.backgroundColor = "";
                    }

                    self.selected = e.target;
                    self.selectedid = e.target.getAttribute("data-externalid");
                    e.target.style.backgroundColor = "rgb(68 114 175 / 58%)";

                    self.addbtn.classList.remove("disabled");
                    self.addbtn.removeAttribute("disabled");
                });

                self.charlist.appendChild(newUiElement);
            });
        }

        onAdd(e) {
            this.dom.parentNode.removeChild(this.dom);
            selectCharacter(this.selectedid);
        }
    }

    function tryGetCurrentCharacter() {
        let external_id = new URLSearchParams(document.location.search).get("char");
        if (external_id != null) {
            getCharacterInfo(external_id, function() {
                selectCharacter(external_id);
            });
        }
    }

    async function getCharacterInfo(external_id, callback) {
        let token = localStorage.getItem("char_token");
        let response = await fetch("https://" + document.location.hostname + "/chat/character/info/", {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + JSON.parse(token).value,
            },
            method: "POST",
            body : JSON.stringify({ "external_id" : external_id })
        });

        if (response.ok) {
            let json = await response.json();

            if (!character_cache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                character_cache.push(json.character);
            }

            if (callback) {
                callback();
            }
        } else {
            console.log("not ok");
        }
    }

    function addCharacterToChatCache(external_id) {
        if (external_id === undefined || external_id === "") return;

        let results = character_cache.filter(function (charData) {
            return charData.external_id == external_id;
        });

        if (results.length != 0) {
            let result = results[0];

            if (!characters_in_chat_cache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                characters_in_chat_cache.push(result);
            }
        }
    }

    function selectCharacter(external_id) {
        if (external_id === undefined || external_id === "") return;

        let results = character_cache.filter(function (charData) {
            return charData.external_id == external_id;
        });

        if (results.length != 0) {
            let result = results[0];

            if (!characters_in_chat_cache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                characters_in_chat_cache.push(result);
            }

            selected_character_id = external_id;
            dropdown.currentchar.querySelector('[data-tag="currentCharName"]').innerText = result.participant__name;
        } else {
            selected_character_id = "";
            alert("Error: No character data for: " + external_id);
        }
    }

    async function fetchInitialData() {

        let token = localStorage.getItem("char_token");
        let response = null;

        if (token !== null) {
            response = await fetch("https://" + document.location.hostname + "/chat/characters/recent/", {
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Authorization": "Token " + JSON.parse(token).value,
                }
            });

            if (response.ok) {
                let json = await response.json();
                character_cache = character_cache.concat(json.characters);
            } else {
                alert("Error fetching recent character data...");
            }

            response = await fetch("https://neo.character.ai/chats/recent/", {
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Authorization": "Token " + JSON.parse(token).value,
                }
            });

            if (response.ok) {
                let json = await response.json();
                json.chats.forEach(chat => {
                    //different from recent characters.... bruh
                    character_cache.push({
                        external_id : chat.character_id,
                        participant__name : chat.character_name,
                        avatar_file_name : chat.character_avatar_uri,
                        user__username : ""
                    });
                });
            } else {
                alert("Error fetching neo recent character data...");
            }
        }

        response = await fetch("https://" + document.location.hostname + "/chat/characters/public/", {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            let json = await response.json();
            character_cache = character_cache.concat(json.characters);
        } else {
            alert("Error fetching character data...");
        }

        response = await fetch("https://neo.character.ai/recommendation/v1/user", {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            let json = await response.json();
            character_cache = character_cache.concat(json.characters);
        } else {
            alert("Error fetching character data...");
        }
    }

    function addToPane() {
        dropdown = new FakeDropdownController();
        watchdog = new ProfilePhotoWatchdog();
    }
    /*End code character selector*/


    //Taken from https://gist.github.com/scwood/3bff42cc005cc20ab7ec98f0d8e1d59d
    function uuidV4() {
        const uuid = new Array(36);
        for (let i = 0; i < 36; i++) {
            uuid[i] = Math.floor(Math.random() * 16);
        }
        uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
        uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
        uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        return uuid.map((x) => x.toString(16)).join('');
    }

    window.WebSocket.prototype.send = function(...args) {
        if (this.url == "wss://neo.character.ai/ws/") {
            if (neo_socket == null || (neo_socket != null && neo_socket != this)) {
                if (neo_socket != null) {
                    neo_socket.removeEventListener("message", neoSocketMessage);
                    neo_socket.removeEventListener("close", neoSocketDeadLikeMeIn5Years);
                }

                neo_socket = this;
                neo_socket.addEventListener("message", neoSocketMessage);
                neo_socket.addEventListener("close", neoSocketDeadLikeMeIn5Years);
            }
        }

        try {
            var json = JSON.parse(args[0]);

            switch (json.command) {
                case "create_and_generate_turn":
                {
                    if (!neo_waiting_for_turn) {
                        sendAPrompt(json);
                        neo_payload_origin = json.origin_id;
                        neo_waiting_for_turn = true;
                        neo_sended = false;
                        let newver = ++req_version;
                        req_version = newver;
                        last_chat_id = json.payload.turn.turn_key.chat_id;
                        neo_last_request_id = json.request_id;
                    }

                    if (selected_character_id != "") {
                        json.payload.character_id = selected_character_id;
                    }

                    args[0] = JSON.stringify(json);

                    current_protocol = PROTOCOL_NEO;
                    setStatus(true, true);
                    break;
                }

                case "generate_turn_candidate": {
                    if (neo_capture_next_request) {
                        neo_capture_next_request = false;
                        neo_last_request_id = json.request_id;
                        neo_captured_next_request = json.request_id;
                        return;
                    }
                    break;
                }
            }

        } catch (ex) {
            //console.error("[RYW]",ex);
        }

        sendSocketfn.call(this, ...args);
    }

    function neoSocketMessage(e) {
        var json = JSON.parse(e.data);

        if (json.hasOwnProperty("command")) {
            switch (json.command) {
                case "add_turn": {
                    if (json.hasOwnProperty("turn") && (!json.turn.author.hasOwnProperty("is_human") || !json.turn.author.is_human)) {
                        if (neo_waiting_for_turn) {
                            neo_waiting_for_turn = false;
                            activerequests = 0;
                            okmessages = 1;
                            neo_requests = new Map();
                            neo_last_turn = json.turn;
                            neo_last_candidate_id = (json.turn.candidates.length > 0) ? json.turn.candidates[0].candidate_id : "";
                            neo_swiper = neoSwiperController();
                            var msgbox = mainelem.querySelector(".details");
                            msgbox.innerHTML = "";
                            setAllowGenerating(true);
                        }
                    }
                    break;
                }
                case "update_turn": {
                    let request = neo_requests.get(json.request_id);

                    if (request !== undefined) {
                        try {
                            if (json.hasOwnProperty("turn") && json.turn.candidates[0].hasOwnProperty("is_final")) {
                                okmessages++;
                                activerequests = Math.max(0, activerequests - 1);
                            }
                        } catch(e) {

                        }

                        request.bubble.websocketEvent(json.command, json);
                    } else {
                        console.log("no request id", json.request_id);
                    }

                    break;
                }

                case "neo_error": {
                    let request = neo_requests.get(json.request_id);

                    if (request !== undefined) {
                        request.bubble.neoError(json);
                    }
                    break;
                }

                case "remove_turns_response": {
                    if (neo_ignore_delete_prompt) {
                        neo_ignore_delete_prompt = false;
                        neo_waiting_for_delete = false;
                        break;
                    }
                    if (neo_waiting_for_delete) {
                        neo_waiting_for_delete = false;

                        try {
                            setTimeout(function() {
                                document.querySelector("textarea").dispatchEvent(
                                    new KeyboardEvent('keydown', {
                                        bubbles: true,
                                        cancelable: true,
                                        key: 'Enter',
                                        code: 'Enter',
                                        keyCode: 13,
                                        which: 13
                                    })
                                );
                            }, 100);
                        } catch (ex) {
                            console.log("no send button");
                        }
                    } else {
                        setAllowGenerating(false);
                        refreshNeoTurns(function() { });
                    }
                    break;
                }
            }
        }
    }

    function neoSocketDeadLikeMeIn5Years(e) {
        neo_socket = null;
        neo_requests.values().forEach(function(request) {
            request.bubble.informDisconnect(e.code);
        });
    }

    function neoSwiperController() {
        var version = req_version + 0;
        var state = 0;
        var data = null;

        setStatus(true, false);
        return new Promise((resolve, reject) => {
            var tmer = null;

            function check() {
                if (req_version != version) {
                    resolve(true);
                    return;
                }

                if (!neo_capture_next_request) {
                    if (activerequests < 2 && allow_generating) {
                        createNeoSwipe();
                    }

                    switch (state) {
                        case 0: {
                            if (neo_readyqueue.length > 0) {
                                data = neo_readyqueue.shift();
                                state = 1;
                            }
                            break;
                        }
                        case 1: {
                            state = 0;
                            data.request_id = neo_captured_next_request;
                            neo_socket.dispatchEvent(new MessageEvent("message", {
                                bubbles: true,
                                cancelable: false,
                                data: JSON.stringify(data)
                            }));
                            break;
                        }
                    }
                }

                tmer = setTimeout(check, 100);

            }
            tmer = setTimeout(check, 100);
        });
    }

    function createAnnotation(turn_key, candidate_id) {
        var arr = ["annotations_emotional_support", "annotations_friendship", "annotations_cooking", "annotations_interactive_story_telling", "annotations_story_telling", "annotations_comedy", "annotations_discussion", "annotations_gameplay"];
        fetch("https://neo.character.ai/annotation/create", {
            "headers": {
                "content-type": "application/json",
                "origin-id" : neo_payload_origin,
                "request-id" : uuidV4()
            },
            "body": JSON.stringify(
                {
                    "turn_key": turn_key,
                    "candidate_id": candidate_id,
                    "annotation": {
                        "annotation_type": arr[Math.floor(Math.random() * arr.length)],
                        "annotation_value": 1
                    }
                }
            ),
            "method": "POST",
            "credentials": "include"
        });
    }

     async function refreshNeoTurns(callback) {

        let response = await fetch("https://neo.character.ai/turns/" + last_chat_id + "/?candidate_filter=all", {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            let json = await response.json();
            var msgbox = mainelem.querySelector(".details");
            msgbox.innerHTML = "";
            okmessages = 0;

            if (json.turns.length > 0) {
                var turn = json.turns[0];
                neo_last_turn = turn;

                turn.candidates.forEach(function(candidate) {
                    okmessages++;
                    var bubble = new bubbleDOMController(0);
                    msgbox.appendChild(bubble.dom);
                    bubble.setTurnAndCandidate(turn, candidate);
                    bubble.status = 7;
                    bubble.updateBtnStatusses();
                    bubble.grow();
                });

                json.turns.forEach(function(turn) {

                    //tries to add cache, if avaiable.
                    addCharacterToChatCache(turn.author.author_id);

                    turn.candidates.forEach(function(candidate) {
                        if (candidate.raw_content.indexOf("###") === 0) {
                            //console.log(candidate.raw_content.indexOf("###"), turn);
                            custom_prompt = turn;
                        }
                    });
                });
            }

            callback();

            if (watchdog !== null) {
                watchdog.analyzePending();
            }
        } else {

        }
     }


    async function getRecentChatFrom(character_id, callback) {

        let response = await fetch("https://neo.character.ai/chats/recent/" + character_id, {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            let json = await response.json();
            if (json.hasOwnProperty("chats") && json.chats.length > 0) {
                last_chat_id = json.chats[0].chat_id;
                callback();
            }
        } else {

        }
    }

    function gotoSwipeNum(num) {
        for(let i = 0; i < 100; i++) {
            //Bruteforce method because i'm lazy
            try {
                var site = getCurrentSite();
                switch(site) {
                    case BETA:
                        {
                            let swiperbutton = document.querySelector('.swiper-button-prev');
                            if (swiperbutton != undefined) {
                                if (swiperbutton.classList.contains("swiper-button-disabled")) {
                                    break;
                                } else {
                                    swiperbutton.click();
                                }
                            }
                            break;
                        }
                    case NEXT: {
                        swipeBack();
                        break;
                    }
                }
            } catch (ex) {
            }
        }

        for(let i = 1; i < num; i++) {
            try {
                swipeNext()
            } catch (ex) {
            }
        }
    }

    function createNeoSwipe() {
        if (neo_last_turn == null) {
            return;
        }

        var char_id = neo_last_turn.author.author_id;

        if (selected_character_id != "") {
            char_id = selected_character_id;
        }

        var payload = {
            "command": "generate_turn_candidate",
            "request_id": uuidV4(),
            "payload": {
                "character_id": char_id,
                "turn_key": neo_last_turn.turn_key,
            },
            "origin_id": neo_payload_origin
        };

        var bubble = new bubbleDOMController(0);
        var msgbox = mainelem.querySelector(".details");
        msgbox.appendChild(bubble.dom);

        neo_requests.set(payload.request_id, {
            "payload": payload.payload,
            "bubble": bubble
        });
        sendSocketfn.call(neo_socket, JSON.stringify(payload));
        activerequests++;
    }

    function updatePrimaryCandidate(candidate_id) {
        if (neo_last_turn == null) {
            return;
        }

        console.log("updating primary", candidate_id);

        var payload = {
            "command": "update_primary_candidate",
            "payload": {
                "candidate_id": candidate_id,
                "turn_key": neo_last_turn.turn_key
            },
            "origin_id": neo_payload_origin
        };

        neo_socket.send(JSON.stringify(payload));
    }

    function createNeoSwipeEdit(bubble, newRaw) {
        if (neo_last_turn == null) {
            return;
        }

        var payload = {
            "command": "edit_turn_candidate",
            "request_id": uuidV4(),
            "payload": {
                "new_candidate_raw_content": newRaw,
                "turn_key": neo_last_turn.turn_key,
            },
            "origin_id": neo_payload_origin
        };

        neo_requests.set(payload.request_id, {
            "payload": payload.payload,
            "bubble": bubble
        });

        neo_socket.send(JSON.stringify(payload));
    }

    function removeTurns(turns, regenerateId = false) {
        var payload = {
            "command": "remove_turns",
            "request_id": (regenerateId ? uuidV4() : neo_last_request_id),
            "payload": {
                "chat_id": neo_last_turn.turn_key.chat_id,
                "turn_ids": turns
            },
            "origin_id": neo_payload_origin
        };

        neo_socket.send(JSON.stringify(payload));
        neo_waiting_for_delete = true;
    }

    async function handlefetch(...args) {
        if (args[0] == STREAMING_URL && (mainelem != null)) {
            current_protocol = PROTOCOL_LEGACY;

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
                        if (mode == "nsfw") { //Ahh, nsfw mode, it's literally just decoration now.
                            if (!warned) {
                                warned = true;
                                alert("Please note that if you swipe then submit the answer, it will become the chosen answer and if you choose the old one again it won't work. You should not use swipes like this with this extension.");
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
                alert("Dev fuck up, extension dead?");
                return constructAwaiter();
            }

            if (isClean) {
                var firstrequest = tryGetNewMessage(args[1], 0, mode);
                setStatus(true, true);
                setAllowGenerating(true);
                return constructAwaiter();
            }
        }
        else {
            if (((args[0].indexOf(SENTRY_URL) != -1) && NO_ERROR_REPORTING) || ((args[0].indexOf(EVENTS_URL) != -1) && NO_TRACKING) || ((args[0].indexOf(CLOUD_MONITORING_NAME) != -1) && NO_MONITORING)) {
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
            this.rawmsg = this.dom.querySelector(".rawmsg");
            this.reqstatus = this.dom.querySelector(".reqstatus");
            this.replyid = this.dom.querySelector(".replyid");
            this.streamcontroller = null;
            this.errored = false;
            this.sendedtoui = false;
            this.stopped = false;
            this.isediting = false;
            this.status = 0;
            this.num = 0;
            this.lastchunk = null;
            this.lastdata = null;

            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");

            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener("click", this.onBtnClick.bind(this));
            }

            btns = this.dom.querySelector(".bottombtns").getElementsByClassName("abtn");

            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener("click", this.onBtnClick.bind(this));
            }

            this.botname.innerText = "";
            this.botmsg.innerText = "";
            this.botmsg.style.display = "none";
            this.rawmsg.innerText = "";
            this.reqstatus.innerText = (attempt > 0) ? ("Got error, retry... x" + attempt) : "Waiting for the server...";
            this.dom.querySelector("textarea").addEventListener("input", this.grow.bind(this));
            this.updateBtnStatusses();
            this.grow();
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
                    self.botmsg.innerText = ((chunk.replies[0].text.indexOf("﻿") != -1 ) ? "(Zero width) " : "") + chunk.replies[0].text;
                    self.rawmsg.innerText = chunk.replies[0].text;
                    self.updateBtnStatusses();
                    self.grow();
                    self.highlight();
                }
            });

            controller.events.on("result", function(status) {
                if (self.dom == null) {
                    return;
                }
                switch (status.status) {
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
                            self.replyid.innerText = "#" + okmessages;
                        }
                        break;
                    }
                }

                self.updateBtnStatusses();
            });
        }

        websocketEvent(eventType, data) {
            var self = this;

            switch (eventType) {
                case "update_turn": {
                    if (data.hasOwnProperty("turn")) {
                        if (self.status == 0) {
                            self.status = 1;
                        }

                        self.lastdata = data;

                        var finished = false;

                        if (self.isediting) {
                            let result = data.turn.candidates.filter((candidate) => candidate.candidate_id == data.turn.primary_candidate_id);

                            if (result.length != 0) {
                                self.status = 3;
                                self.reqstatus.innerText = "Edited";
                                this.dom.classList.remove("warned");
                                self.updateBtnStatusses();
                                self.grow();

                                data.turn.candidates = result;
                                self.lastdata = data;
                            } else {
                                this.dom.classList.remove("warned");
                                this.dom.classList.add("errored");
                                self.reqstatus.innerText = "Script error: Failed";
                                self.errored = true;
                                self.status = 2;
                            }
                            return;
                        }

                        if (data.turn.candidates[0].hasOwnProperty("is_final")) {
                            //because the swipe, the primary candidate is other, so remind to the server
                            if (neo_last_candidate_id != "") {
                                updatePrimaryCandidate(neo_last_candidate_id);
                            }
                        }

                        self.setTurnAndCandidate(data.turn, data.turn.candidates[0]);
                        self.updateBtnStatusses();
                        self.grow();
                    }
                    break;
                }
            }
        }

        setTurnAndCandidate(turn, candidate) {
            this.botname.innerText = turn.author.name;

            if (candidate.hasOwnProperty("is_final")) {
                this.status = 3;
                this.reqstatus.innerText = "OK";
                this.replyid.innerText = "#" + okmessages;
                this.num = okmessages;
            }

            if (candidate.hasOwnProperty("safety_truncated")) {
                this.status = 3;
                this.reqstatus.innerText = "Filtered";
                this.dom.classList.add("warned");

                if (!neo_sended) {
                    neo_sended = true;
                    createAnnotation(neo_last_turn.turn_key, neo_last_candidate_id);
                }
            }

            if (candidate.hasOwnProperty("raw_content")) {
                this.botmsg.value = candidate.raw_content;
                this.rawmsg.innerText = candidate.raw_content;
            } else {
                this.dom.classList.remove("warned");
                this.dom.classList.add("errored");
                this.errored = true;
                this.status = 2;
            }

            this.highlight();
        }

        highlight() {
            let txt = this.botmsg.value;
            let split = txt.split(" ");

            split.forEach(function(word_orig) {
                let result = word_orig;
                highlight_words_cache.forEach(function (word) {
                    if (word_orig.toLowerCase().indexOf(word[0].toLowerCase()) == 0) {
                        var col = (word.length > 1) ? word[1] : HIGHLIGHT_DEFAULT_COLOR;
                        txt = txt.replaceAll(word_orig.toLowerCase(), "<span style='color:" + col + ";'>" + word_orig + "</span>");
                    }
                });
            });
            this.rawmsg.innerHTML = txt;
        }

        grow() {
            var elem = this.dom.querySelector("textarea");
            elem.style.height = "5px";
            elem.style.height = (elem.scrollHeight) + "px";
        }

        informHTTPError(code) {
            this.dom.classList.add("errored");
            this.reqstatus.innerText = "HTTP " + code;
        }

        informDisconnect(code) {
            if (this.status == 1 || this.status == 0) {
                this.dom.classList.add("errored");
                this.reqstatus.innerText = "Error: Ended by disconnect: " + code;
                this.status = 2;
                this.errored = true;

                activerequests = Math.max(0, activerequests - 1);
            }
        }

        neoError(neoErrorData) {
            if (this.status == 1 || this.status == 0) {
                this.dom.classList.add("errored");
                this.reqstatus.innerText = "Error from server: (" + neoErrorData.error_code + ") " + neoErrorData.comment;
                this.status = 2;
                this.errored = true;

                activerequests = Math.max(0, activerequests - 1);

                if (neoErrorData.error_code == 429) {
                    setAllowGenerating(false);
                    this.reqstatus.innerText = "Denied by server - Possible swipe limit reached (30)";
                    mainelem.querySelector("[data-tag=deleteresend]").style.display = "block";
                }
            }
        }

        updateBtnStatusses() {
            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = "none";
            }

            this.dom.querySelector(".bottombtns").style.display = "none";

            switch (this.status) {
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
                    this.rawmsg.style.display = "block";
                    this.botmsg.style.display = "none";

                    if (!this.sendedtoui) {
                        this.dom.querySelector("[data-tag=sendui]").style.display = "block";

                        if (!this.isediting && current_protocol == PROTOCOL_NEO) {
                            this.dom.querySelector("[data-tag=editcan]").style.display = "block";
                        }
                    }
                    break;
                }
                case 4: {
                    if (this.stopped) {
                        let btn = this.dom.querySelector("[data-tag=stopgen]");
                        btn.style.display = "block";
                        btn.innerText = "Stopped";
                    }
                    break;
                }
                case 5: {
                    if (!this.sendedtoui) {
                        this.dom.querySelector(".bottombtns").style.display = "flex";
                    }
                    break;
                }
                case 6: {
                    if (!this.sendedtoui) {
                        this.isediting = true;
                        this.dom.querySelector(".bottombtns").style.display = "flex";
                        let btn = this.dom.querySelector("[data-tag=editsave]");
                        btn.innerText = "Saving...";
                        btn = this.dom.querySelector("[data-tag=editcancel]");
                        btn.style.display = "none";
                        this.rawmsg.innerText = this.botmsg.value;

                        createNeoSwipeEdit(this, this.botmsg.value);
                    }
                    break;
                }

                case 7: {
                    let btn = this.dom.querySelector("[data-tag=gocan]");
                    btn.style.display = "block";
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

            if (neo_waiting_for_turn) {
                alert("You need to wait m8");
                return;
            }

            switch (e.target.getAttribute("data-tag")) {
                case "remove": {
                    self.selfDestroy();
                    break;
                }
                case "sendui": {
                    if (!self.sendedtoui) {
                        self.sendedtoui = true;
                        if (current_protocol == PROTOCOL_LEGACY) {
                            override_primary = self.lastchunk.replies[0].uuid;
                            readyqueue.push(self.streamcontroller.stream);
                        } else {
                            //200ms to give you time to capture the request
                            let newver = ++req_version;
                            req_version = newver;

                            setTimeout(function() {
                                neo_swiper = neoSwiperController();
                                neo_capture_next_request = false; //give up
                            }, 200);

                            neo_capture_next_request = true;
                            neo_readyqueue.push(self.lastdata);
                            var candidate_id = self.lastdata.turn.candidates[0].candidate_id;
                            neo_last_candidate_id = candidate_id
                            updatePrimaryCandidate(candidate_id);
                        }

                        swipeNext();
                    }
                    break;
                }
                case "stopgen": {
                    //Never finished
                    if (!self.stopped) {
                        cancelMessage(lastbody.history_external_id, self.lastchunk.replies[0].uuid, self.lastchunk.replies[0].text.length).then(function() {
                            self.status = 4;
                        });
                        self.stopped = true;
                    }
                    break;
                }
                case "editcan": {
                    self.status = 5;
                    self.rawmsg.style.display = "none";
                    self.botmsg.style.display = "flex";
                    self.dom.querySelector("textarea").removeAttribute("readonly");
                    self.grow();
                    break;
                }
                case "editcancel": {
                    self.status = 3;
                    self.dom.querySelector("textarea").setAttribute("readonly", "");
                    self.botmsg.value = self.lastdata.turn.candidates[0].raw_content;
                    self.grow();
                    break;
                }
                case "editsave": {
                    self.isediting = true;
                    self.status = 6;
                    self.dom.querySelector("textarea").setAttribute("readonly", "");
                    self.grow();
                    break;
                }
                case "gocan": {
                    var site = getCurrentSite();

                    switch(site) {
                        case NEXT: {
                            neo_capture_next_request = true;

                            setTimeout(function() {
                                 neo_capture_next_request = false;
                            }, 10);
                            break;
                        }
                    }
                    gotoSwipeNum(self.num);
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
            else {
                setStatus(false, false);
                setAllowGenerating(true);
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
        last_params = body;
        for (var i = 0; i < 5; i++) {
            setTimeout(function() {
                createAndRegister(body, version);
            }, 1000 + (i * 50));
        }
    }

    function swipeNext() {
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                key: 'ArrowRight',
            })
        );
    }

    function swipeBack() {
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                key: 'ArrowLeft',
            })
        );
    }

    function constructAwaiter() {

        return new Promise((resolve, reject) => {
            var tmer = null;

            function check() {
                if (readyqueue.length > 0) {
                    clearInterval(tmer);
                    let res = new Response(readyqueue.shift(), {
                        "status": 200
                    });
                    setStatus(false, false);
                    resolve(res);
                }
            }
            tmer = setInterval(check, 100);
        });
    }

    function setStatus(disableMode, disableControl) {
        try {
            if (disableMode) {
                mainelem.querySelector("#cmode").classList.add("modechanger_disabled");
            } else {
                mainelem.querySelector("#cmode").classList.remove("modechanger_disabled");
            }
            if (disableControl) {
                mainelem.querySelector("#ccontrol").classList.add("modechanger_disabled");
            } else {
                mainelem.querySelector("#ccontrol").classList.remove("modechanger_disabled");
            }
        } catch (ex) {}
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
                                emitter.dispatch("result", {
                                    "status": "errored",
                                    "error": "Empty response"
                                });
                            } else {
                                emitter.dispatch("result", {
                                    "status": "done"
                                });
                            }
                            return;
                        }

                        let text = new TextDecoder().decode(value);

                        if (chunkcount == 0 && ((text.length == 0) || (text.charCodeAt(0) == 60))) //<
                        {
                            controller.close();
                            emitter.dispatch("result", {
                                "status": "errored",
                                "error": "Unexpected response"
                            });
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
                                emitter.dispatch("result", {
                                    "status": "errored",
                                    "error": chunk.error,
                                    "last_user_msg_uuid": chunk.last_user_msg_uuid
                                });

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
                                    emitter.dispatch("result", {
                                        "status": "done"
                                    });
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

    function cancelMessage(history, uuid, letters) {
        let newopts = {};
        newopts.method = "POST";
        newopts.headers = lastheaders;
        newopts.body = JSON.stringify({
            "history_id": history,
            "msg_uuid": uuid,
            "num_letters": letters
        });
        var req = fetchFn(CANCEL_URL, newopts);
        return req;
    }

    function createAndRegister(params, version) {
        if (version == req_version) {
            if (activerequests >= 2 || !allow_generating) {
                return;
            }
            let max = 100;
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
            var url = STREAMING_URL;
            var mode = getCurrentMode();

            if (mode == "nsfw") {
                url = STREAMING_URL.replace("/streaming/", "/non-streaming/");
            }

            var req = fetchFn(url, params);
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
                        switch (result.status) {
                            case "errored": {
                                reject({
                                    "status": 200,
                                    "error": new Error(result.error)
                                });
                                break;
                            }
                            case "done": {
                                resolve(lastchunk);
                            }
                        }
                    });
                } else {
                    bubble.informHTTPError(res.status);
                    reject({
                        "status": res.status,
                        "error": null
                    });
                }
            });
            req.catch(function(error) {
                reject({
                    "status": 0,
                    "error": error
                });
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
                        resolve({
                            "chunk": chunk,
                            "req": req
                        });
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
                    switch (result.status) {
                        case "errored": {
                            reject(result);
                            break;
                        }
                        case "done": {
                            resolve({
                                "chunk": lastchunk,
                                "req": req
                            });
                        }
                    }
                });
            });
            req.catch(function(error) {
                reject(error);
            });
        });
    }

    function sendAPrompt(json) {
        try {
            if (custom_prompt != null) {
                neo_ignore_delete_prompt = true;
                removeTurns([custom_prompt.turn_key.turn_id], true);
                custom_prompt = null;
            }

            if (custom_prompt == null) {
                var promp_t = getLocalSettingSaved("ljailbreak", "");

                if (promp_t.length > 1) {
                    var objectcloned = JSON.parse(JSON.stringify(json));
                    objectcloned.request_id = uuidV4();
                    objectcloned.payload.turn.turn_key.turn_id = uuidV4();
                    objectcloned.payload.turn.candidates[0].candidate_id = uuidV4();
                    objectcloned.command = "create_turn";
                    objectcloned.payload.turn.candidates[0].raw_content = "###" + promp_t;
                    delete objectcloned.payload.turn.primary_candidate_id;
                    custom_prompt = objectcloned.payload.turn;
                    neo_socket.send(JSON.stringify(objectcloned));
                    return true;
                }
            }

            return false;
        } catch(ex) {
            console.warn(ex);
            return false;
        }
    }

    function getCurrentMode() {
        var value = mainelem.querySelector('input[name="drone"]:checked').value;
        return value;
    }

    function switchVisibility() {
        ishided = !ishided;
        var bound = getLocalSettingSaved("dock_pos", "right");

        var width = mainelem.clientWidth;

        if (bound === "left") {
            width *= -1;
        }

        if (!ishided) {
            mainelem.querySelector(".ptrk_hide").removeAttribute("hided");
            mainelem.style.transform = "";
        } else {
            mainelem.querySelector(".ptrk_hide").setAttribute("hided", "");
            mainelem.style.transform = "translateX(" + width + "px)";
        }
    }

    function onFunctionButton(e) {
        switch (e.target.getAttribute("data-tag")) {
            case "stop_gen": {
                setAllowGenerating(false);
                break;
            }
            case "resume_gen": {
                setAllowGenerating(true);
                if (last_params != null && current_protocol == PROTOCOL_LEGACY) {
                    requestSwipes(last_params, req_version);
                }
                break;
            }
            case "deleteresend": {
                setAllowGenerating(false);
                setStatus(true, true);
                removeTurns([neo_last_turn.turn_key.turn_id]);
                break;
            }
            case "settings": {
                let settings = mainelem.querySelector("#csettings");
                let ishided = settings.style.display === "none";
                mainelem.querySelector("#csettings").style.display = ishided ? "flex" : "none";
                mainelem.querySelector("#cresponses").style.display = ishided ? "none" : "flex";
                mainelem.querySelector("#ccontrol").style.display = ishided ? "none" : "flex";

                var cnf_highlight = getLocalSettingSaved("lhighlightwords", "");
                mainelem.querySelector('[name="lhighlightwords"]').value = cnf_highlight;

                var cnf_jailbreak = getLocalSettingSaved("ljailbreak", "");
                mainelem.querySelector('[name="ljailbreak"]').value = cnf_jailbreak;
                break;
            }
            case "save_settings": {
                var form = mainelem.querySelector("#csettings form");
                var formData = new FormData(form);
                var newConfig = {};

                for (var entry of formData.entries()) {
                    console.log(entry);

                    var valid = false;
                    switch(entry[0]) {
                        case "ljailbreak":
                        case "lhighlightwords":
                        case "characterselector":{
                            valid = true;
                            break;
                        }
                    }

                    if (valid) {
                        var cnf = {};
                        cnf[entry[0]] = entry[1];
                        Object.assign(newConfig, cnf);
                    }
                }

                saveToLocalStorage(newConfig);
                refreshHighlightConfig();
                break;
            }

            case "dockposition": {
                switch (e.target.getAttribute("value")) {
                    case "lleft": {
                        dockLeft();
                        saveToLocalStorage({ dock_pos : "left" });
                        break;
                    }
                    case "lright": {
                        dockRight();
                        saveToLocalStorage({ dock_pos : "right" });
                        break;
                    }
                }
                break;
            }

            case "characterselector": {
                switch (e.target.getAttribute("value")) {
                    case "lyes": {

                        if (dropdown !== null) {
                            break;
                        }

                        saveToLocalStorage({ characterselector : "lyes" });
                        appendCharacterSelector();
                        break;
                    }
                    case "lno": {
                        saveToLocalStorage({ characterselector : "lno" });
                        alert("Too lazy to remove the controller without bugging it all, reload the page to remove it");
                        break;
                    }
                }
                break;
            }
        }
    }

    function dockLeft() {
        mainelem.classList.add("ptrk_side_left");
        mainelem.querySelector(".ptrk_hide").classList.add("ptrk_hide_side_left");
    }

    function dockRight() {
        mainelem.classList.remove("ptrk_side_left");
        mainelem.querySelector(".ptrk_hide").classList.remove("ptrk_hide_side_left");
    }

    function refreshHighlightConfig() {
        highlight_words_cache = [];

        var str = getLocalSettingSaved("lhighlightwords", "");
        var split = str.split("\n");
        split.forEach(function(highlightCnf) {
            if (highlightCnf.length > 1) {
                highlight_words_cache.push(highlightCnf.split(";"));
            }
        });
    }

    function refreshCurrentState() {
        let path = document.location.pathname;

        if (path != current_state) {
            onStateChanged(path);
        }

        setTimeout(refreshCurrentState, 1000);
    }

    function onStateChanged(state) {
        current_state = state;
        let charId = null;

        switch(state) {
            case "/chat": {
                current_protocol = PROTOCOL_LEGACY;
                setStatus(false, true);
                break;
            }

            case "/chat2": {
                current_protocol = PROTOCOL_NEO;
                setStatus(true, false);

                let params = new URLSearchParams(document.location.search);

                if (params.get("hist") != null) {
                    last_chat_id = params.get("hist");
                }
                if (params.get("char") != null) {
                    charId = params.get("char");
                }

                //Character selector
                characters_in_chat_cache = [];
                selected_character_id = "";
                appendCharacterSelector();
                break;
            }

            default: {
                var site = getCurrentSite();
                switch(site) {
                    case NEXT: {
                        let path = document.location.pathname;
                        if (path.indexOf("/chat/") != -1) {
                            charId = document.location.pathname.substring(6);
                        }
                        break;
                    }
                }
                break;
            }
        }

        if (charId !== null) {
            getRecentChatFrom(charId, function() { refreshNeoTurns(function() { }) });
        }
    }

    function appendCharacterSelector() {
        var characterSelectorEnabled = getLocalSettingSaved("characterselector", "lyes");

        if (characterSelectorEnabled === "lyes")
        {
            var checkNeoChat = function() {
                if (document.querySelector(".chat2") === null) {
                    return false;
                }

                addToPane();
                tryGetCurrentCharacter();

                var x = new MutationObserver(function (e) {
                    e.forEach(function(record) {
                        if (record.addedNodes.length > 0) {
                            for (let i = 0; i < record.addedNodes.length; i++) {
                                let item = record.addedNodes[i];
                                if (item.className == "container-fluid chatbottom") {
                                    addToPane();
                                    selectCharacter(selected_character_id);
                                }
                            }
                        }
                    });
                });

                x.observe(document.querySelector(".chat2"), { childList: true });
                return true;
            }

            var infinitecheck = function() {
                if (!checkNeoChat()) {
                    setTimeout(infinitecheck, 10);
                }
            }

            infinitecheck();
        }
    }

    function getCurrentSite() {
        switch(document.location.hostname) {
            case "beta.character.ai":
            case "plus.character.ai":
            case "old.character.ai": {
                return BETA;
            }
            default: {
                return NEXT;
            }
        }
    }

    function setAllowGenerating(allow) {
        if (allow) {
            mainelem.querySelector("[data-tag=resume_gen]").style.display = "none";
            mainelem.querySelector("[data-tag=stop_gen]").style.display = "block";
            mainelem.querySelector("[data-tag=deleteresend]").style.display = "none";
            allow_generating = true;
        } else {
            mainelem.querySelector("[data-tag=deleteresend]").style.display = "none";
            mainelem.querySelector("[data-tag=stop_gen]").style.display = "none";
            mainelem.querySelector("[data-tag=resume_gen]").style.display = "block";
            allow_generating = false;
        }
    }

    function getLocalSettingSaved(param, defaultValue = undefined) {
        let existingData = localStorage.getItem(DEFAULT_STORAGE);

        if ((existingData !== null)) {
            var json = JSON.parse(existingData);

            if (json.hasOwnProperty(param)) {
                return json[param];
            }
        }

        return defaultValue;
    }

    function saveToLocalStorage(json) {
        let existingData = localStorage.getItem(DEFAULT_STORAGE);

        if (!existingData) {
            localStorage.setItem(DEFAULT_STORAGE, JSON.stringify(json));
            return;
        }

        let existingJSON = JSON.parse(existingData);

        for (let prop in json) {
            existingJSON[prop] = json[prop];
        }

        localStorage.setItem(DEFAULT_STORAGE, JSON.stringify(existingJSON));
    }

    let startX;
    let startWidth;
    let side;
    let resizableDiv;

    function initResize(e) {
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(resizableDiv).width, 10);
        side = e.target.classList.contains('left') ? 'left' : 'right';

        document.addEventListener('mousemove', doResize, false);
        document.addEventListener('mouseup', stopResize, false);
    }

    function doResize(e) {
        let newwidth = 0;
        if (side === 'left') {
            newwidth = startWidth - (e.clientX - startX);
        } else if (side === 'right') {
            newwidth = startWidth + (e.clientX - startX);
        }
        resizableDiv.style.width = `${newwidth}px`;
    }

    function stopResize() {
        document.removeEventListener('mousemove', doResize, false);
        document.removeEventListener('mouseup', stopResize, false);

        saveToLocalStorage({"width" : resizableDiv.style.width});
    }
    function createResizer(position) {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer', position);
        return resizer;
    }

    f.prototype = fetchFn.prototype;
    window.fetch = f;

    var timer = null;

    function init() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            try {
                var style = document.createElement('style');
                style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap') body {font-family: "Noto Sans", "__Inter_918210" !important; } * {font-family: "Noto Sans", "__Inter_918210" !important; } :root {--inter-font: 'Noto Sans'; } .resizer {width: 20px; height: 100%; position: absolute; top: 0; cursor: col-resize; } .resizer.left {left: -5px; } .resizer.right {right: -5px; } .ptrk_main {position: fixed; margin: 0; z-index: 9999; min-width: 300px !important; font-family: "Noto Sans", "__Inter_918210"; background-color: rgba(33, 37, 41, 0.85); right: 0px; top: 0px; height: 100%; padding: 18px; color: white; font-size: 13px; transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); user-select: none; width: 470px; box-sizing: border-box; } .ptrk_side_left {right: unset; left: 0; } .ptrk_main a {color: #1491f3; } .ptrk_settings_op span { min-width: 100px; }.ptrk_settings_op {flex-direction: row; display: flex; padding: 3px; align-items: center; } .ptrk_settings_op {gap: 0.5em; } .ptrk_hide {width: 30px; height: 150px; left: -30px; top: 60%; border-bottom-left-radius: 5px; border-top-left-radius: 5px; position: absolute; cursor: pointer; background-color: rgba(33, 37, 41, 0.85); transition: transform 1s ease; } .ptrk_hide_side_left {right: -30px; left: unset; border-bottom-left-radius: 0px; border-top-left-radius: 0px; border-bottom-right-radius: 5px; border-top-right-radius: 5px; } .ptrk_hide[hided]:after {transform: rotate(135deg); } .ptrk_hide:after {content: ''; width: 12px; height: 12px; top: 47%; left: 25%; position: absolute; transform: rotate(-45deg); border-right: 2px solid #5f6365; border-bottom: 2px solid #5f6365; } .ptrk_main .modechanger_disabled {opacity: 0.3; pointer-events: none; cursor: no-allowed; } .ptrk_main legend, fieldset {float: initial; line-height: initial; font-size: initial; margin-bottom: initial; padding: initial; width: initial; background: initial; border: initial; border-color: initial; background-color: initial; font-size: 12px; padding-inline-start: 5px; padding-inline-end: 5px; } .ptrk_main label {background: initial; background-color: initial; font-size: 12px; } .ptrk_main fieldset {display: flex; justify-content: center; margin-bottom: 10px; border: 1px solid rgb(59 59 63) !important; border-radius: 3px; font-size: 12px; } .ptrk_main textarea {display: block; width: 100%; color: white; padding: 10px; margin-bottom: 3px; margin-top: 3px; box-sizing: border-box; font-family: inherit; font-size: 12px; background: unset; overflow: hidden; border: 1px solid #8e8e8e !important; } .ptrk_main textarea[readonly] {padding: 0; border: 1px solid rgba(255, 255, 255, 0.1) !important; } .ptrk_main .details {display: relative; overflow-y: scroll; width: 100%; } .ptrk_main .details p {margin: 0; margin-top: 0.5em; font-size: 12px; user-select: text; } .ptrk_main .errored {background: #4f3432 !important; } .ptrk_main .warned {background: #48402e !important; } .ptrk_main .details .mbubble {padding: 10px; border-radius: 3px; margin: 6px; background: rgb(56 59 63); cursor: pointer; position: relative; } .ptrk_main .details .topbtns {position: absolute; width: 100%; right: 10px; display: flex; justify-content: flex-end; height: 30px; } .ptrk_main .bottombtns {width: 100%; height: 30px; right: 10px; display: flex; justify-content: flex-end; } .ptrk_main .midbtns {width: 100%; height: 30px; right: 10px; display: flex; justify-content: center; } .ptrk_main .abtn {cursor: pointer; padding: 6px; border-radius: 3px; font-weight: bold; z-index: 2; margin: 2px; overflow: hidden; text-overflow: ellipsis; background: rgb(95 99 101); } .ptrk_main .abtn:active {background: rgb(118 123 125); } .ptrk_main input[type=radio] {position: absolute; opacity: 0; width: 0; height: 0; } .ptrk_main input[type=radio]+label {filter: grayscale(1.0); background: rgb(56 59 63); border-radius: 2px; padding: 5px; cursor: pointer; display: flex; margin: 3px; min-width: 56px; font-size: 12px; align-items: center; justify-content: center; flex-direction: column; } .ptrk_main input[type=radio]:checked+label {filter: none; background: rgb(77 81 84); !important; } .ptrk_main small {font-size: 12px; } .ptrk_icon {height: 23px; position: absolute; z-index: 9999; background-color: #212529; font-family: 'Arial'; left: 20px; padding: 6px; top: 20px; border-radius: 5px; color: white; opacity: 0.5; transition: all 0.2s; } .ptrk_icon:hover {opacity: 1.0; cursor: pointer } @media (max-width:500px) {.ptrk_main {width: 80%; }
`;
                document.head.appendChild(style);

                var maindom = document.createElement('div');
                maindom.classList.add("ptrk_main");
                maindom.innerHTML = `
        <div class="ptrk_hide"></div> <fieldset id="cmode"> <legend>Mode</legend> <div> <input type="radio" id="sfw" name="drone" value="sfw" checked> <label for="sfw" title="Sends response and generates swipes"> <img src="data:image/png;base64,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"> <span>Puritian</span> </label> </div> <div> <input type="radio" id="nsfw" name="drone" value="nsfw"> <label for="nsfw" title="Waits for the user for selecting messages, also kills first response"> <img src="data:image/png;base64,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"> <span>NSFW</span> </label> </div> </fieldset> <fieldset id="cresponses" style="height:calc(100% - (85px + 60px + 60px));"> <legend>Responses</legend> <div class="details"> <div class="mbubble"> <div class="topbtns"> <div class="abtn" data-tag="editcan">Edit</div> <div class="abtn" data-tag="gocan">Go</div> <div class="abtn" data-tag="sendui">Send to UI</div> <div class="abtn" data-tag="remove">Remove</div> <div class="abtn" data-tag="stopgen">Stop gen</div> </div> <b class="botname">%botname</b> <span class="replyid"></span> <p class="rawmsg"></p><textarea readonly class="botmsg">%msg</textarea> <small class="reqstatus">%STATUS</small> <div class="bottombtns"> <div class="abtn" data-tag="editcancel">Cancel</div> <div class="abtn" data-tag="editsave">Save</div> </div> </div> </div> </fieldset> <fieldset id="csettings" style="height:calc(100% - (143px));justify-content: space-around;flex-direction: column;display:none"> <legend>Settings</legend> <form> <div class="ptrk_settings_op"> <span>User prompt</span> <textarea class="ljailbreak" name="ljailbreak" rows="5" cols="40" placeholder="(Neo, not legacy) Optional. It will be sent before your message and then auto deleted the next message. This is like a bot reminder or something."></textarea> </div> <div class="ptrk_settings_op"> <span>Highlight words</span> <textarea class="lhighlightwords" name="lhighlightwords" rows="5" cols="40" placeholder="(Neo, not legacy) Optional. Words here will be highlighted with an optional color. Example: devhate;red or devhate;#FFFFFF Use new line to add more"></textarea> </div> <div class="ptrk_settings_op"> <span>Dock position</span> <input type="radio" id="lleft" name="dockposition" value="lleft" data-tag="dockposition"/> <label for="lleft">Left</label> <input type="radio" id="lright" name="dockposition" value="lright" data-tag="dockposition"/> <label for="lright">Right</label> </div> <br><div class="ptrk_settings_op"> <div style="display:flex;flex-direction: column;"> <span>Character Selector Mod</span> <span style="font-size:9px">(only old site)</span> </div> <input type="radio" id="lyes" name="characterselector" value="lyes" data-tag="characterselector"/> <label for="lyes">Enable</label> <input type="radio" id="lno" name="characterselector" value="lno" data-tag="characterselector"/> <label for="lno">Disable</label> </div> <br> <div class="ptrk_settings_op" style="opacity: 0.3;cursor: not-allowed;pointer-events: none;"> <div style="display:flex;flex-direction: column;"> <span>Enable SKC</span> <span style="font-size:9px">(disables filter)</span> </div> <input type="radio" id="lskcyes" name="skcmode" value="lskcyes"/> <label for="lskcyes">Yes</label> <input type="radio" id="lskcno" name="skcmode" value="lskcno" checked/> <label for="lskcno">No</label> <img style="filter: grayscale(1);" src="data:image/png;base64,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"> </div> <br> <br> <center><span style="font-size:9px"><- Did you know you can resize this window? -></span></center> <div class="midbtns" style="flex-direction:row"> <div class="abtn" data-tag="save_settings">Save settings</div> </div> <br><center><a style="display:block" href="https://discord.com/invite/8ef4pbCSSC" target="_blank" style="font-size:9px;opacity:0.6;text-decoration:underline">Join CharacterAI Unofficial Discord</a></center> </form> <br> </fieldset> <fieldset id="ccontrol"> <div class="details" style="overflow:hidden;padding:10px"> <div class="midbtns"> <div class="abtn" data-tag="stop_gen" style="display:none">Stop generating</div> <div class="abtn" data-tag="deleteresend" style="display:none">Delete & resend</div> <div class="abtn" data-tag="resume_gen">Resume generating</div> </div> </div> </fieldset> <div style="position:relative"> <span id="eversion" style="font-size:10px;">0.9.0</span><br> <a href="https://greasyfork.org/scripts/474130-rizz-your-waifu" target="_blank" style="font-size:10px;opacity:0.6;text-decoration:underline">Updates</a> <div style="position:absolute;right:0;top:0;font-size:10px"> <div class="abtn" data-tag="settings">Settings</div> </div> </div>
`;

                mainelem = maindom;
                var msgtemplate = maindom.querySelector(".ptrk_main .details .mbubble");
                templates.msg = msgtemplate.cloneNode(true);
                msgtemplate.parentNode.removeChild(msgtemplate);

                let btns = mainelem.querySelectorAll(".abtn");

                for (let i = 0; i < btns.length; i++) {
                    btns[i].addEventListener("click", onFunctionButton);
                }

                btns = mainelem.querySelectorAll("[name='dockposition'], [name='characterselector']");

                for (let i = 0; i < btns.length; i++) {
                    btns[i].addEventListener("click", onFunctionButton);
                }

                mainelem.querySelector(".ptrk_hide").addEventListener("click", switchVisibility);
                mainelem.querySelector("#eversion").innerText = E_VERSION;
                document.body.appendChild(maindom);
                setStatus(false, true);

                var site = getCurrentSite();
                var bound = getLocalSettingSaved("dock_pos", "right");

                if (bound === "left") {
                    dockLeft();
                }

                switch(site) {
                    case BETA: {
                        //Character selector code
                        fetchInitialData();
                        break;
                    }

                    case NEXT: {
                        current_protocol = PROTOCOL_NEO; //rip legacy
                        setStatus(true, false);

                        try {
                            var json = JSON.parse(document.getElementById("__NEXT_DATA__").innerText);

                            if (json.hasOwnProperty("props")) {
                                if (json.props.hasOwnProperty("pageProps")) {
                                    if (json.props.pageProps.hasOwnProperty("characterId")) {
                                        getRecentChatFrom(json.props.pageProps.characterId, function() { refreshNeoTurns(function() { }) });
                                    }
                                }
                            }
                        } catch (ex) {
                            console.warn("huh", ex);
                        }
                        break;
                    }
                }

                refreshCurrentState();
                refreshHighlightConfig();

                resizableDiv = document.querySelector('.ptrk_main');
                var resizerLeft = createResizer('left');
                var resizerRight = createResizer('right');

                var w = getLocalSettingSaved("width", parseInt(document.defaultView.getComputedStyle(resizableDiv).width, 10) + "px");
                resizableDiv.style.width = w;

                resizableDiv.appendChild(resizerLeft);
                resizableDiv.appendChild(resizerRight);

                resizerLeft.addEventListener('mousedown', initResize, false);
                resizerRight.addEventListener('mousedown', initResize, false);
            } catch (ex) {
                alert("RYW failed to start, see console");
                console.error("[RYW]", ex);
            }
        }, 1);
    }

    //RYW 2.0 is a myth
    window.addEventListener("load", init, { once: true });
})();