// ==UserScript==
// @name         EasyJoin
// @namespace    https://mstudio45.com/
// @version      1.2.1
// @description  Join roblox job ids, games and private servers easily
// @author       mstudio45
// @license      MPL-2.0
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @icon         https://roblox.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507315/EasyJoin.user.js
// @updateURL https://update.greasyfork.org/scripts/507315/EasyJoin.meta.js
// ==/UserScript==

// DO NOT CHANGE ANYTHING BELOW //

const Roblox = globalThis.Roblox // this is useless but i want to remove stupid warnings
const jQuery = globalThis.jQuery // this is useless but i want to remove stupid warnings
const DataVersion = "v1"
const VERSION = "v1.2"

const pageUrl = window.location.href;
const pageInfo = {
    url: pageUrl,
    getPageName: function() {
        if (pageUrl.indexOf("roblox.com/games/") !== -1 || pageUrl.indexOf("roblox.com/private-server/") !== -1) return "games"
        if (pageUrl.indexOf("roblox.com/home")) return "home";
        if (pageUrl.indexOf("roblox.com/catalog")) return "catalog";
        return pageUrl.split("roblox.com/")[1];
    }
}

const menu = [document.getElementsByTagName('ul')[0], document.querySelector("#header > div > ul.nav.rbx-navbar.hidden-md.hidden-lg.col-xs-12")]
const html = `
<style>
    .privservercontainer { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }
    .privservercontainer::after, .privservercontainer::before { display:none !important; }
    .contentfix .modal-content { width: max-content; }

    .mstudio45JoinerMenuBody > li::hover {
        background: #191b1d;
    }
</style>

<li class='cursor-pointer bottomTooltip'>
    <a id="mstudio45JoinerMenuButton" style="color: green;" style="display: block;" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.open()'>EasyJoin</a>
</li>

<body>
    <div id="mstudio45JoinerMenuBody" style="display: none; margin: 0 auto; min-width: 200px; z-index: 10; background: #393b3d; border: solid #111214;">
        <!--
            Only visible on the games page. ↓
        -->

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;"><a style="color:gray;" class='font-header-2 nav-menu-title text-header'>Place:</a></li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(1)'>Job ID</a>
        </li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(99)'>Most Players</a>
        </li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(98)'>Least Players</a>
        </li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;"><a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header'></a></li>
        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;"><a style="color:gray;" class='font-header-2 nav-menu-title text-header'>Private Servers:</a></li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(2)'>Code</a>
        </li>
        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(3)'>Share URL Code</a>
        </li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(4)'>By User ID</a>
        </li>
        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(5)'>By Username</a>
        </li>
        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(6)'>By Display Name</a>
        </li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;"><a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header'></a></li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a id="mstudio45JoinerDropdownMenuButton" style="color:yellow;" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(101)'>Reload private servers</a>
        </li>

        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a id="mstudio45JoinerDropdownMenuButton" style="color:yellow;" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.cache.clear("all")'>Clear Cache</a>
        </li>
        <li class="cursor-pointer only-gamespage" style="margin: 0 auto;">
            <a id="mstudio45JoinerDropdownMenuButton" style="color:yellow;" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.cache.clear("servers")'>Clear Saved Servers</a>
        </li>

        <!--
            Visible all the time excpet on the games page. ↓
        -->

        <li class="cursor-pointer except-gamespage" style="margin: 0 auto;">
            <a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.setup(7)'>Join a Friend</a>
        </li>

        <!--
            Visible all the time. ↓
        -->
        <li class="cursor-pointer" style="margin: 0 auto;"><a style="/*color:green;*/" class='font-header-2 nav-menu-title text-header'></a></li>
        <li class="cursor-pointer" style="margin: 0 auto;">
            <a id="mstudio45JoinerDropdownMenuButton" style="color:red;" class='font-header-2 nav-menu-title text-header' onclick='window.mstudio45.toggle()'>Close</a>
        </li>
    </div>
</body>
`

// Required Functions //
function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Roblox Functions //
function generateProtocol(placeId = null, jobId = null, privServerId = null) {
    if (!placeId) return null;

    let protocol = "roblox://placeID=" + String(placeId);
    if (jobId && privServerId) {
        protocol += "&linkCode=" + String(privServerId);
    } else if (jobId && !privServerId) {
        protocol += "&gameInstanceId=" + jobId;
    }

    return protocol;
}

function join(placeId = null, jobId = null, privServerId = null, followUserId = null) {
    if (followUserId && !jobId && !privServerId) { // only works when placeId and followUserId is provided (placeId is not required either)
        window.mstudio45.close();
        Roblox.Dialog.close();
        Roblox.GameLauncher.followPlayerIntoGame(followUserId);
        return;
    }

    if (!placeId) return null;

    if (privServerId) {
        window.mstudio45.close();
        Roblox.Dialog.close();
        Roblox.GameLauncher.joinPrivateGame(placeId, privServerId, null);
        return;
    }

    if (jobId) {
        window.mstudio45.close();
        Roblox.Dialog.close();
        Roblox.GameLauncher.joinGameInstance(placeId, jobId);
        return;
    }

     Roblox.GameLauncher.joinGameInstance(placeId, null);
}

async function getAvatars(userIds) {
    const avatars = window.mstudio45.cache.get("avatars", true) || {}

    userIds = userIds.filter((id) => id in avatars ? avatars[id] == "placeholder" : true);
    try {
        for (let i = 0; i < userIds.length; i += 99) {
            const chunk = userIds.slice(i, i + 99);
            const img = await fetch("https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" + chunk.join(",") + "&size=150x150&format=png", { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then(r => r.json()).then((json) => { return json.data })

            img.forEach((x) => {
                avatars["" + x.targetId.toString()] = x.imageUrl || "placeholder"
            });
        }
    } catch (e) {
        window.mstudio45.console.log(e)
        userIds.forEach((x) => {
            avatars["" + x.toString()] = "placeholder"
        });
    }

    window.mstudio45.cache.set("avatars", avatars, true)
}

async function getServer(placeId, ownerId, type = 1, cursor = "") { // 1 = id, 2 = name, 3 = display name
    window.mstudio45.close();
    window.mstudio45.modals.loading("Trying to find the Private server(s)...");
    ownerId = ownerId == null ? "" : ownerId;

    const servers = window.mstudio45.cache.get("servers", true, true) || {}, privateServerData = window.mstudio45.cache.get("privateServer", true, true) || {},
          serverNameForInfo = DataVersion + "-" + ownerId.toString() + "-" + type.toString() + "-" + placeId.toString(),
          privateServerNameForInfo = DataVersion + "-" + placeId.toString();
    let finished = false, doLoop = false, reloadServerInfo = false;

    if (type == true && ownerId == "") {
        delete privateServerData[privateServerNameForInfo];
        delete servers[serverNameForInfo];

        doLoop = true;
        reloadServerInfo = true;
    }

    // Get Cache
    if (privateServerNameForInfo in privateServerData ? privateServerData[privateServerNameForInfo].length >= 1 : false) {
        window.mstudio45.console.log("Found '" + privateServerNameForInfo + "' private servers in cache!")
    } else {
        doLoop = true;
        reloadServerInfo = true;
        privateServerData[privateServerNameForInfo] = []
    }

    if (serverNameForInfo in servers ? servers[serverNameForInfo].length >= 1 : false) {
        window.mstudio45.console.log("Found '" + serverNameForInfo + "' in cache!")
    } else {
        reloadServerInfo = true;
        servers[serverNameForInfo] = [];
    }

    // Main
    function loop(placeId, ownerId, type, cursor) {
        window.mstudio45.modals.loading("Loading Private servers for this place... (" + privateServerData[privateServerNameForInfo].length + ")");

        fetch("https://games.roblox.com/v1/games/" + placeId + "/private-servers?cursor=" + cursor + "&sortOrder=Desc&excludeFullGames=false", {
            method: 'GET',
            mode: "cors",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "Cookie": document.cookie,
            }
        }).then(r => r.json()).then((json) => {
            json.data.forEach((x) => privateServerData[privateServerNameForInfo].push(x));

            if (json.nextPageCursor == null) {
                finished = true;
            } else {
                setTimeout(function() { loop(placeId, ownerId, type, json.nextPageCursor) }, 1500)
            }
        });
    }

    try {
        if (doLoop) {
            loop(placeId, ownerId, type, "")
            while (finished == false) await sleep(500);
        }

        if (reloadServerInfo) {
            // Find Private Server(s)
            privateServerData[privateServerNameForInfo].forEach((x) => {
                let check = x.owner.id;
                switch (type) {
                    case 3:
                        check = x.owner.displayName;
                        break;

                    case 2:
                        check = x.owner.name;
                        break;

                    case 1:
                    default:
                        check = x.owner.id;
                        break
                }

                if (type == 1 ? check == ownerId : check.toString().toLowerCase().indexOf(ownerId.toString().toLowerCase()) !== -1) {
                    servers[serverNameForInfo].push({
                        callbackName: x.vipServerId.toString(),

                        name: x.owner.name,
                        displayName: x.owner.displayName,
                        id: x.owner.id,

                        accessCode: x.accessCode,
                        placeId: placeId
                    });
                }
            })
        }

        if (type == true && ownerId == "") {
            setTimeout(function() { window.mstudio45.modals.info("Private Server successfully reloaded for this place.") }, 250)
        } else {

            // Load Modal
            if (servers[serverNameForInfo].length <= 0) {
                delete servers[serverNameForInfo];

                setTimeout(function() { window.mstudio45.modals.error("Couldn't find any Private Server for this place.") }, 250)
            } else if (servers[serverNameForInfo].length >= 1) {
                await getAvatars(servers[serverNameForInfo].map((x) => x.id));

                window.mstudio45.modals.servers("Found Private servers. (" + servers[serverNameForInfo].length + "/" + privateServerData[privateServerNameForInfo].length + ")", servers[serverNameForInfo])
            }
        }

        window.mstudio45.cache.set("servers", servers, true); window.mstudio45.cache.set("privateServer", privateServerData, true);
    } catch (e) { window.mstudio45.modals.error("Couldn't find any Private Server for this place or something has failed."); window.mstudio45.console.warn("[EasyJoin]", e); }
}

// Main Code //
window.mstudio45 = {
    // Data
    servers: {},
    toggled: false,
    cache: {
        get: function(name, isJson, clearOldVersionData) {
            let data = localStorage.getItem("EJ_" + name);

            if (data) {
                if (isJson) {
                    data = JSON.parse(data);
                    if (clearOldVersionData) {
                        // only works if the index starts with the version (V1-...)
                        for (var i in data) {
                            if (!i.toString().startsWith(DataVersion + "-")) {
                                delete data[i];
                            }
                        }
                    }
                } else {
                    if (!data.startsWith(DataVersion + "-")) {
                        data = null;
                    }
                }
            }

            return data ? data : null;
        },

        set: function(name, data, isJson) {
            localStorage.setItem("EJ_" + name, isJson ? JSON.stringify(data) : data);
        },

        clear: function(name = "all") {
            var keys = Object.keys(localStorage), i = 0, key;
            for (; key = keys[i]; i++) {
                if (name == "all" ? key.startsWith("EJ_") : key == "EJ_" + name) localStorage.removeItem(key);
            }

            window.mstudio45.modals.info("The specified cache has been cleared successfully.")
        },
    },

    // Modals
    modals: {
        info: function(message) {
            window.mstudio45.console.log(message)
            Roblox.Dialog.open({
                titleText: "EasyJoin",
                bodyContent: '<p class="text-center">' + message + '</p>',
                acceptText: "Ok",
                showDecline: false,
                xToCancel: true,
                allowHtmlContentInBody: true
            });
        },

        loading: function(message) {
            window.mstudio45.console.log("Loading:", message)
            Roblox.Dialog.open({
                titleText: "EasyJoin",
                bodyContent: '<span class="spinner spinner-default"></span><p class="text-center">' + message + '</p>',
                showAccept: false,
                showDecline: false,
                xToCancel: true,
                allowHtmlContentInBody: true
            });
        },

        error: function(message) {
            window.mstudio45.console.warn("Error:", message)
            Roblox.Dialog.open({
                titleText: "EasyJoin",
                bodyContent: '<p class="text-error" style="font-size: 16px;">' + message + '</p>',
                acceptText: "Ok",
                showDecline: false,
                xToCancel: true,
                allowHtmlContentInBody: true
            });
        },

        input: function(placeholder, footer, btnText, callback) {
            const modalName = randomString(10);
            Roblox.Dialog.close();
            setTimeout(function() {
                Roblox.Dialog.open({
                    titleText: "EasyJoin",
                    bodyContent: "<input type='text' class='form-control input-field' placeholder='" + placeholder + "' id='" + modalName + "-text'/>",
                    footerText: footer,
                    acceptText: btnText,

                    showDecline: false,
                    xToCancel: true,

                    allowHtmlContentInBody: true,
                    fieldValidationRequired: true,

                    onAccept: function() {
                        var validationText = jQuery("#" + modalName + "-text");
                        if (validationText && validationText.val()) {
                            callback(true, validationText.val())
                        } else {
                            callback(false, null)
                        }
                    },
                    onDecline: function() { callback(false, null) },
                    onCancel: function() { callback(false, null) }
                });
            }, 10);
        },

        servers: async function(message, servers) {
            const avatars = window.mstudio45.cache.get("avatars", true) || {}

            Roblox.Dialog.close();
            await sleep(10);
            Roblox.Dialog.open({
                titleText: "EasyJoin",
                bodyContent: '<p class="text-center">' + message + '</p><br></br><ul class="hlist game-cards privservercontainer">' + servers.map((item) => {
                    if (item.name && item.id && item.callbackName) {
                        window.mstudio45.servers[item.callbackName] = function() {
                            Roblox.Dialog.close();
                            join(item.placeId, null, item.accessCode);
                        }

                        const img = avatars["" + item.id];
                        const html = `<li class="list-item game-card game-tile">
    <div class="game-card-container">
      <div class="game-card-link">
        <a href="https://www.roblox.com/users/${item.id}/profile" class="game-card-link" alt="${item.displayName} (${item.name})" title="${item.displayName} (${item.name})">
            <div class="game-card-thumb-container">
                ${img == "placeholder" ? '<span class="avatar-card-image icon-placeholder-avatar-headshot"></span>' : '<span class="avatar-card-image"><img class="" src="' + img + '" alt="" title=""></span>'}
            </div>
            <div class="game-card-name game-name-title" ng-non-bindable="">${item.displayName} (${item.name})</div>
        </a>
        <div class="game-card-info" style="position: absolute;bottom: 0;height: 15%;">
          <button type="button" class="info-label btn-common-play-game-lg btn-primary-md btn-full-width" style=" height: 100%; display: flex; align-items: center; justify-content: center;" onclick='window.mstudio45.servers[${item.callbackName}]()'>
              <span class="icon-common-play" style="text-align: center; transform: scale(0.6);"></span>
          </button>
        </div>
      </div>
    </div>
</li>`
                        return html;
                    }

                    return "";
                }).join('') + '</ul>',
                showAccept: false,
                showDecline: false,
                xToCancel: true,
                allowHtmlContentInBody: true,
                cssClass: "contentfix"
            });

            while (document.querySelector(".contentfix") == null) await sleep(150);
            const contentfix = document.querySelector(".contentfix");

            // i love roblox
            contentfix.parentElement.style.overflow = ""
            contentfix.parentElement.parentElement.style = "z-index: 1942; position: absolute; transform: translate(-60%, 35%);"
            window.dispatchEvent(new Event('resize'));
            contentfix.parentElement.parentElement.style.transform = "translate(-60%, 50%);"
            window.dispatchEvent(new Event('resize'));
        }
    },

    // Console
    console: {
        log: function() {
            console.log("[EasyJoin]", ...arguments)
        },

        warn: function() {
            console.warn("[EasyJoin]", ...arguments)
        },

        error: function() {
            console.error("[EasyJoin]", ...arguments)
        },
    },

    // Custom functions
    update: function() {
        document.querySelectorAll("#mstudio45JoinerMenuButton").forEach(x => {
            x.style.display = window.mstudio45.toggled === false ? "block" : "none";
        })

        document.querySelectorAll("#mstudio45JoinerMenuBody").forEach(x => {
            x.style.display = window.mstudio45.toggled === false ? "none" : "block";
        })
    },
    toggle: function() {
        window.mstudio45.toggled = !window.mstudio45.toggled
        window.mstudio45.update();
    },
    close: function() {
        window.mstudio45.toggled = false
        window.mstudio45.update();
    },
    open: function() {
        window.mstudio45.toggled = true
        window.mstudio45.update();
    },

    setup: async function(type = 1, customPlaceId = false) { // 1 = jobid, 2 = priv, 3 = least plrs, 4 = most plrs
        let placeId = pageInfo.getPageName() == "games" ? window.location.pathname.match(/\/(\d+)\/.+?$/)[1] : -1;

        if (placeId == -1 && customPlaceId) {
            window.mstudio45.modals.input("Input the Place ID here.", "", "Ok", async function(suc, text) {
                if (suc && text) {
                    if (!parseInt(text)) {
                        Roblox.Dialog.close();
                        await sleep(10);
                        window.mstudio45.modals.error("Invalid Place ID.")
                        return;
                    }

                    placeId = parseInt(text);
                }
            });

            while (placeId == -1) await sleep(150);
            if (placeId <= -1) return window.mstudio45.console.warn("Action stopped");
        }

        if (type == 1) {
            window.mstudio45.modals.input("Input the Job ID here.", "", "Ok", function(suc, text) {
                if (suc && text) join(placeId, text);
            });
            return;
        }

        // Private Server
        if (type == 2) {
            window.mstudio45.modals.input("Input the Private Server Code here.", "", "Ok", function(suc, text) {
                if (suc && text) join(placeId, null, text);
            });
            return;
        }

        if (type == 3) {
            window.mstudio45.modals.input("Input the Private Server Share Code here.", "", "Ok", function(suc, text) {
                if (suc && text) window.location.href = "https://roblox.com/share?code=" + text + "&type=Server";
            });
            return;
        }

        if (type == 4) {
            window.mstudio45.modals.input("Input the User ID here.", "", "Ok", async function(suc, text) {
                if (suc && text) {
                    if (!parseInt(text)) {
                        Roblox.Dialog.close();
                        await sleep(10);
                        window.mstudio45.modals.error("Invalid User ID.")
                        return;
                    }

                    await getServer(placeId, parseInt(text), 1)
                }
            });
            return;
        }
        if (type == 5) {
            window.mstudio45.modals.input("Input the Username here.", "", "Ok", async function(suc, text) {
                if (suc && text) await getServer(placeId, text, 2)
            });
            return;
        }
        if (type == 6) {
            window.mstudio45.modals.input("Input the Display Name here.", "", "Ok", async function(suc, text) {
                if (suc && text) await getServer(placeId, text, 3)
            });
            return;
        }

        // Follow User
        if (type == 7) {
            window.mstudio45.modals.input("Input the User ID here.", "", "Ok", async function(suc, text) {
                if (suc && text) {
                    if (!parseInt(text)) {
                        await sleep(10);
                        window.mstudio45.modals.error("Invalid User ID.")
                        return;
                    }

                    await join(placeId, null, null, parseInt(text))
                }
            });
            return;
        }

        // API
        if (type == 98) {
            fetch("https://games.roblox.com/v1/games/" + placeId + "/servers/Public?sortOrder=Asc&excludeFullGames=true&limit=10&cursor=", { method: 'GET', headers: { 'Content-Type': 'application/json'} }).then(r => r.json()).then((json) =>{
                join(placeId, json.data[0].id)
            });
            return;
        }

        if (type == 99) {
            fetch("https://games.roblox.com/v1/games/" + placeId + "/servers/Public?sortOrder=Desc&excludeFullGames=true&limit=10&cursor=", { method: 'GET', headers: { 'Content-Type': 'application/json'} }).then(r => r.json()).then((json) =>{
                join(placeId, json.data[0].id)
            });
            return;
        }

        if (type == 101) {
            getServer(placeId, null, true)
            return;
        }
    },
}

// Insert HTML
menu.forEach(e => { e.innerHTML += html });
document.querySelectorAll("#mstudio45JoinerMenuBody").forEach((el) => {
    el.children.forEach((el) => {
        if (el.className.indexOf("only-gamespage") !== -1) el.style.display = pageInfo.getPageName() == "games" ? "" : "none";
        else if (el.className.indexOf("except-gamespage") !== -1) el.style.display = pageInfo.getPageName() == "games" ? "none" : "";
    });
});
window.mstudio45.console.log("Initialized! (" + VERSION + ") - Created by mstudio45");