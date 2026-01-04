// ==UserScript==
// @name         Character Selector
// @description  Summon  any character in a normal chat
// @version      1.0.3
// @match        https://old.character.ai/*
// @match        https://plus.character.ai/chat2*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @namespace https://greasyfork.org/users/1077492
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/491455/Character%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/491455/Character%20Selector.meta.js
// ==/UserScript==
(function() {
    var func = window.WebSocket.prototype.send;
    var neo_socket = null;
    var initialized = false;
    var charDataCache = [];
    var chatCharDataCache = [];
    var selectedCharExternalId = "";
    var dropdown = null;
    var modal = null;
    var watchdog = null;

    class ProfilePhotoWatchdog {
        constructor() {
            this.dom = null;
            this.observer = null;
            this.initialized = false;
            this.firstcheck = false;
            this.tryInit();

            setTimeout(this.tryInit, 3000);
        }

        tryInit() {
            try {
                var self = this;
                this.dom = document.querySelector(".chat2");
                if (this.initialized || this.dom == undefined || this.dom == null) {
                    setTimeout(this.tryInit, 3000);
                    return;
                }

                let thisElement = this.dom.childNodes[1];

                if (thisElement.className.indexOf("react-scroll") == -1) {
                    setTimeout(this.tryInit, 3000);
                    return;
                }

                thisElement = thisElement.childNodes[0];
                this.dom = thisElement;

                this.observer = new MutationObserver(function (e) {
                    e.forEach(function(record) {
                        if (record.addedNodes.length > 0) {
                            for (let i = 0; i < record.addedNodes.length; i++) {
                                let item = record.addedNodes[i];
                                console.log(item);
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
            let p = node.querySelector("p");

            if (img !== null && p !== null) {
                //so maybe this is a message, idk
                try {
                    let element = node.querySelector(".rounded");

                    if (element !== null) { //hmm
                        //lazy method to find out who the message is from
                        //console.log("element", element, "elementParent", element.parentElement);

                        chatCharDataCache.forEach(function(charData) {
                            if (element.parentElement.innerHTML.indexOf(charData.participant__name) != -1) {
                                img.src = "https://characterai.io/i/80/static/avatars/" + charData.avatar_file_name;
                            }
                        });
                    }
                } catch (ex) {
                    //nope, it was not.
                }
            }
        }
    }

    class FakeDropdownController {
        constructor() {
            this.dom = document.createElement("div");
            this.dom.innerHTML = '<div class="col-auto ps-2 dropdown dropup show"><span data-toggle="dropdown" aria-haspopup="listbox" class="" aria-expanded="true"> <div data-tag="currentChar" style="cursor: pointer;display: flex;justify-content: center;align-items: center;"><b data-tag="currentCharName">Switch</b><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path> </svg></div> </span> <div data-tag="dropDownMenu" tabindex="-1" role="listbox" aria-hidden="false" class="dropdown-menu show" style="position: absolute;inset: auto 0px 0px auto;transform: translate(0px, -24px);display: none;"> <h6 tabindex="-1" class="dropdown-header">Select character...</h6> <div tabindex="-1" class="dropdown-divider"></div><button type="button" data-tag="charBtn" tabindex="0" role="option" class="dropdown-item" style="display: flex; align-items: center;"> <div>Char</div> </button><button type="button" data-tag="newCharBtn" tabindex="0" role="option" class="dropdown-item" style="display: flex; align-items: center;"> <div><em>new character...</em></div> </button> </div> </div>';
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

            chatCharDataCache.forEach(function(charData) {
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
            this.dom.innerHTML = '<div class=""> <div class="modal fade show" role="dialog" tabindex="-1" style="display: block;"> <div class="modal-dialog modal-dialog-centered" role="document" style="margin-top: 0px;"> <div class="modal-content"> <div class="modal-body"> <div data-tag="charList" style="user-select:none;max-height: 300px;overflow-y: scroll;overflow-x: hidden;display: flex;flex-direction: column;"> <div data-tag="charOption" style="width:100%"> <img src="https://characterai.io/i/80/static/avatars/uploaded/2023/3/22/WOUx3xnZRql_j1TsQfS1TcNCI30D6uoPQvlGlKdYxHg.webp" style="height: 45px;width: 45px;margin-right: 10px;border-radius: 45px;object-fit: contain;"><b style="pointer-events:none">charname</b> <span style="pointer-events:none">@charowner</span> </div> </div> <input data-tag="searchInput" placeholder="Search..." style="width: 100%;"> </div> <div class="modal-footer"><button data-tag="cancelButton" type="button" class="btn btn-secondary">Cancel</button><button data-tag="addButton" type="button" disabled="" class="btn btn-primary disabled">Add</button></div> </div> </div> </div> <div class="modal-backdrop fade show"></div> </div>';
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
            this.onData(charDataCache.slice(0, 100));
        }

        onCancel(e) {
            this.dom.parentNode.removeChild(this.dom);
        }

        onSearchInputKey(e) {
            let value = e.target.value.toLowerCase();

            let results = charDataCache.filter(function (charData) {
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
                newUiElement.querySelector("img").src = "https://characterai.io/i/80/static/avatars/" + each.avatar_file_name;

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

            if (!charDataCache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                charDataCache.push(json.character);
            }

            if (callback) {
                callback();
            }
        } else {
            console.log("not ok");
        }
    }

    function selectCharacter(external_id) {
        let results = charDataCache.filter(function (charData) {
            return charData.external_id == external_id;
        });

        if (results.length != 0) {
            let result = results[0];

            if (!chatCharDataCache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                chatCharDataCache.push(result);
            }

            selectedCharExternalId = external_id;
            dropdown.currentchar.querySelector('[data-tag="currentCharName"]').innerText = result.participant__name;
        } else {
            selectedCharExternalId = "";
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
                charDataCache = charDataCache.concat(json.characters);
            } else {
                alert("Error fetching recent character data...");
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
            charDataCache = charDataCache.concat(json.characters);
        } else {
            alert("Error fetching character data...");
        }

        tryGetCurrentCharacter();
    }

    function addToPane() {
        dropdown = new FakeDropdownController();
        watchdog = new ProfilePhotoWatchdog();
    }

    window.addEventListener("load", function() {

        fetchInitialData();

        var checkInit = function() {
            if (document.querySelector(".chat2") === null) {
                return false;
            }

            addToPane();

            var x = new MutationObserver(function (e) {
                e.forEach(function(record) {
                    if (record.addedNodes.length > 0) {
                        for (let i = 0; i < record.addedNodes.length; i++) {
                            let item = record.addedNodes[i];
                            if (item.className == "container-fluid chatbottom") {
                                addToPane();
                            }
                        }
                    }
                });
            });

            x.observe(document.querySelector(".chat2"), { childList: true });
            return true;
        }

        var infinitecheck = function() {
            if (!checkInit()) {
                setTimeout(infinitecheck, 10);
            }
        }

        infinitecheck();
    });

    function onMessage(message) {
        var json = JSON.parse(message.data);

        if (json.hasOwnProperty("command")) {
            switch(json.command) {
                case "add_turn": {

                    break;
                }
            }
        }
    }

    window.WebSocket.prototype.send = function(...args) {
        try {
            var json = JSON.parse(args[0]);

            if (json.command == "create_and_generate_turn" || json.command == "generate_turn_candidate")
            {
                if (selectedCharExternalId != "") {
                    json.payload.character_id = selectedCharExternalId;
                }
                args[0] = JSON.stringify(json);
            }
        } catch (ex) {
            alert(ex);
        }

        if (neo_socket != this) {
            neo_socket = this;
            neo_socket.addEventListener("message", onMessage);
        }

        func.call(this, ...args);
    }
})();