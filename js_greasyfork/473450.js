// ==UserScript==
// @name         Sigmally Mod (Macros)
// @version      5.7
// @description  Mod for Sigmally.com | Macros, Custom Skins, Themes, Autorespawn and much more!
// @author       Cursed
// @match        *://sigmally.com/*
// @icon         https://i.ibb.co/Hn9qnjm/Sigmod-Logo.png
// @run-at       document-end
// @license      MIT
// @namespace    https://greasyfork.org/users/981958
// @downloadURL https://update.greasyfork.org/scripts/473450/Sigmally%20Mod%20%28Macros%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473450/Sigmally%20Mod%20%28Macros%29.meta.js
// ==/UserScript==

(function() {
    let version = 5;
    let logo = "https://i.ibb.co/Hn9qnjm/Sigmod-Logo.png";
    'use strict';
    if(localStorage.getItem("sig_modSettings")) localStorage.removeItem("sig_modSettings");

    let modSettings = localStorage.getItem("mod-Settings");
    if (!modSettings) {
        modSettings = {
            keyBindingsRapidFeed: "w",
            keyBindingsdoubleSplit: "d",
            keyBindingsTripleSplit: "f",
            keyBindingsQuadSplit: "g",
            keyBindingsFreezePlayer: "s",
            freezeType: "press",
            keyBindingsToggleMenu: "v",
            m1: null,
            m2: null,
            mapColor: null,
            nameColor: null,
            borderColor: null,
            mapImageURL: "",
            virusImage: "/assets/images/viruses/2.png",
            skinImage: {
                original: null,
                replaceImg: null,
            },
            Theme: "Dark",
            addedThemes: [],
            savedNames: [],
            AutoRespawn: false,
            visits: 0,
        };
        localStorage.setItem("mod-Settings", JSON.stringify(modSettings));
    } else {
        modSettings = JSON.parse(modSettings);
    }

    // * MESSAGEPACK-LITE (encoder, decoder) FOR WEBSOCKET MESSAGES 100% SAFE: https://www.npmjs.com/package/msgpack-lite * //
    const msgpacklite = document.createElement("script");
    msgpacklite.src = `https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js`
    document.body.append(msgpacklite);

    function updateStorage() {
        localStorage.setItem("mod-Settings", JSON.stringify(modSettings));
    }

    function keypress(key, keycode) {
        const keyDownEvent = new KeyboardEvent("keydown", { key: key, code: keycode });
        const keyUpEvent = new KeyboardEvent("keyup", { key: key, code: keycode });

        window.dispatchEvent(keyDownEvent);
        window.dispatchEvent(keyUpEvent);
    }
    function emitMouse(sx, sy) {
        const mouseMoveEvent = new MouseEvent("mousemove", { clientX: sx, clientY: sy });
        const canvas = document.getElementById("canvas");
        canvas.dispatchEvent(mouseMoveEvent);
    }

    function toHoursAndMinutes(totalSeconds) {
        const totalMinutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        return { hours, minutes, seconds }
    }

    function fixTimeStringWithZero(hours, minutes, seconds) {
        return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}${seconds ? seconds < 10 ? `:${seconds}` : `:${seconds}` : ":00"}`
    }

    class Client {
        constructor() {
            this.ws = new WebSocket("wss://sigmod.marco077x.repl.co")

            this.members = []
            this.needsMembers = false

            this.profileData = []
            this.needsProfiledata = false


            this.Username = "User";
            this.nick = document.getElementById("nick").value
            this.getUsername();

            this.init();
        }

        send(type, content) {
            const msg = msgpack.encode({
                type: type,
                content: content
            });
            this.ws.send(msg);
        }

        onconnect() {
            this.send("set-mail", uData.email)
            console.log("Connected to WebSocket")
        }

        onclose() {
            console.log("Closed WebSocket connection.")
        }
        onerror(e) {
            console.error(`Error in SigMod WebSocket: ${e}`)
        }
        onmessage(e) {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const data = msgpack.decode(new Uint8Array(arrayBuffer));

                this.handle(data);
            };
            reader.readAsArrayBuffer(e.data);
        }

        handle(data) {
            if (data.type == "success") {
                console.log("Received message successful!")
            }

            if (data.type == "request-create-account") {
                document.getElementById("friends").classList.add("hidden");

                const creating = document.createElement("div");
                creating.classList.add("createAcc");

                creating.innerHTML = `
                        <span class="text">Creating an Account for you...</span>
                        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                    `;
                document.querySelector(".body__inner").append(creating);

                const profileNickname = document.querySelector(".profile-name").textContent;
                const profileAvatarURL = document.querySelector(".profile-image-icon").src;

                this.send("create-account", {
                    nickname: profileNickname,
                    avatarURL: profileAvatarURL,
                });

            }
        }

        init() {
            this.ws.onopen = this.onconnect.bind(this);
            this.ws.onmessage = this.onmessage.bind(this);
            this.ws.onerror = this.onerror.bind(this);
            this.ws.onclose = this.onclose.bind(this);

            setTimeout(() => {
                this.friends();
            }, 50);
        }

        getUsername() {
            let nick;
            setTimeout(() => {
                if(this.nick == "") {
                    nick = "User"
                } else {
                    nick = this.nick;
                }
                this.Username = uData.fullName || nick;
                mods.welcomeUser.textContent = `Welcome ${this.Username}, to SigMod!`
            }, 1500);
        }
        sendProfileStats() {
            const level = document.getElementById("user-level").textContent
            const xp = document.getElementById("progress-next").textContent.split("/").map((xp) => +xp)
            const coins = document.querySelector(".coins-value").textContent
            const progress = document.getElementById("user-line-progress").style.width

            this.socket.send({
                type: "profile-stats",
                content: {
                    level: +level,
                    xp: xp,
                    coins: +coins,
                    progress: progress
                }
            })

            this.sendProfileStatsTime = Date.now()
        }

        friends() {
            const open = document.getElementById("friendsbtn");
            open.addEventListener("click", () => {
                this.send("check-auth-mail", {mail: uData.email})
                if (!uData.id) {
                    return alert("You need to be logged in to use this. | SigMod");
                }
                modal.classList.remove("hidden");
            });

            const modal = document.createElement("div");
            modal.id = "friends"
            document.querySelector(".body__inner").append(modal)

            modal.classList.add("friends-wrapper", "hidden")

            modal.innerHTML = `
                <div class="friends_header">
                    <span class="text">Friends | SigMod</span>
                    <button id="close_friends_modal" class="ctrl-modal__close">
                        <svg width="22" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>

                <div class="tabs_navigation friends_tab_select">
                    <button class="modButton tabbtn" id="myFriends_btn">Friends</button>
                    <button class="modButton tabbtn" id="myFriends_btn">Explore</button>
                    <button class="modButton tabbtn" id="myFriends_btn">Requests</button>
                </div>

                <div class="friends_content hidden" id="friends_list">

                </div>

                <div class="friends_content" id="members_menu">
                    <div class="members-list"></div>
                </div>
                <div class="friends_content hidden" id="requests_menu">

                </div>


                <style>
                    .friends-wrapper {
                        position: absolute;
                        z-index: 99999;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: #222;
                        border-radius: 10px;
                        display: flex;
                        flex-direction: column;
                        width: 500px;
                        height: 350px;
                        box-shadow: 5px 5px 10px #000;
                    }

                    .friends_header {
                        width: 100%;
                        background: rgba(0, 0, 0, .5);
                        border-radius: 10px 10px 0 0;
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 15px;
                        color: #fff;
                    }

                    .friends_header span {
                        font-size: 20px;
                    }

                    .friends_tab_select {
                        padding: 10px;
                        background: rgba(0, 0, 0, .6)
                    }
                    .friends_tab_select button {
                        width: 120px
                    }
                </style>
            `

            const close = document.getElementById("close_friends_modal");
            close.addEventListener("click", () => {
                modal.classList.add("hidden");
            });
        }

        getMemberCardLayout(profile) {
            const convertedOnlineTime = toHoursAndMinutes(profile.onlineTime)
            const onlineTime = fixTimeStringWithZero(convertedOnlineTime.hours, convertedOnlineTime.minutes, convertedOnlineTime.seconds)

            return `
            <div class="member-card-wrapper">
                <div class="member-card">
                    <div class="member-card-user">
                        <div class="avatar-area">
                            <div class="profile-image" style="width: 35px; height: 35px;">
                                <img class="profile-image-icon" src="${profile.avatarURL}" style="cursor: pointer;">
                            </div>
                        </div>

                        <span class="member-card-nickname">${profile.nickname}</span>
                    </div>

                    <div class="member-card-activity">
                        <span class="member-card-playserver">${profile.status === "online" ? profile.server : ""}</span>
                        <span class="member-card-status-circle status-${profile.status}"></span>
                    </div>
                </div>

                <div class="member-stats" style="display: none;">
                    <div class="stats-line justify-sb">
                         <div class="new-meter stats-slot">
                             <span id="stats-line-progress" style="width: ${profile.stats.progress}"></span>

                             <div id="stats-xp">${profile.stats.xp[0]}/${profile.stats.xp[1]}</div>

                             <div class="stats-star-level">
                                 <picture>
                                     <source srcset="./assets/images/agario-star.webp" type="image/webp">
                                     <source srcset="./assets/images/agario-star.jp2" type="image/jp2">
                                     <img width="30" height="30" src="./assets/images/agario-star.png" alt="Agario Star">
                                 </picture>

                                 <div class="stats-level">
                                     <div id="stats-level">${profile.stats.level}</div>
                                 </div>
                             </div>
                         </div>

                         <div class="coins">
                             <div class="stats-coins-num">
                                 <span class="stats-coins">${profile.stats.coins}</span>

                                 <img class="coins-num__coin" alt="" width="20" height="20" src="./assets/images/icon/coin.svg">
                             </div>
                         </div>
                    </div>

                    <div class="stats-line">
                        <div class="stats-info-wrapper">
                            <span class="stats-info-text">${profile.status === "offline" && profile.lastOnline ? `Last online: <span class="stats-result-text">${profile.lastOnline}</span>` : ""}</span>
                            <span class="stats-info-text">Online time: <span class="stats-result-text">${onlineTime}</span></span>
                            <span class="stats-info-text">Account created: <span class="stats-result-text">${profile.createdAt}</span></span>
                        </div>
                    </div>
                </div>
            <div>
            `
        }

        getMessageCardLayout(message) {
            function getCurrentTime() {
                const time = new Date()
                const hours = time.getHours()
                const minutes = time.getMinutes()

                return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
            }

            return `
            <div class="message-card-wrapper">
                <div class="message-card-info">
                    <div class="message-card-user">
                        <div class="avatar-area">
                            <div class="profile-image" style="width: 25px; height: 25px;">
                                <img class="profile-image-icon" src="${message.avatarURL}">
                            </div>
                        </div>

                        <span class="message-card-user-nickname">${message.nickname}</span>
                    </div>

                    <span class="message-card-time">${getCurrentTime()}</span>
                </div>

                <div class="message-card-content"></div>
            </div>
            `
        }

        getProfileLayout(profile) {
            const convertedOnlineTime = toHoursAndMinutes(profile.onlineTime)
            const onlineTime = fixTimeStringWithZero(convertedOnlineTime.hours, convertedOnlineTime.minutes, convertedOnlineTime.seconds)

            return `
            <div class="profile-card-user">
                <div class="avatar-area">
                    <div class="profile-image" style="width: 50px; height: 50px;">
                        <img class="profile-image-icon" src="${profile.avatarURL}">
                    </div>
                </div>

                <input class="profile-card-nickname" id="profile_nickname" value="${profile.nickname}" maxlength="15">
            </div>

            <div class="stats-line">
                <div class="stats-info-wrapper">
                    <span class="stats-info-text">Online time: <span class="stats-result-text">${onlineTime}</span></span>
                    <span class="stats-info-text">Account created: <span class="stats-result-text">${profile.createdAt}</span></span>
                </div>
            </div>

            <div class="stats-line">
                <div class="stats-info-wrapper">
                    <span class="stats-info-text">Mass amount: <span class="stats-result-text">${profile.massAmount}</span></span>
                    <span class="stats-info-text">Food eaten amount: <span class="stats-result-text">${profile.foodEatenAmount}</span></span>
                </div>
            </div>
            `
        }

        setMembers(profiles) {
            if (!profiles?.length) return

            this.members = profiles

            this.needsMembers = false
        }

        setProfileData(profiles) {
            if (!profiles?.length) return

            this.profileData = profiles

            this.needsProfileData = false
        }

        async updateProfileMenu() {
            const profileMenu = document.getElementById("profile_menu")

            profileMenu.querySelector(".profile-wrapper").innerHTML = `<div class="menu-loading">Loading...</div>`

            this.profileData = []

            this.needsProfileData = true

            this.send({
                type: "request-data",
                content: {
                    name: "my-profile-data"
                }
            })

            await this.waitWhileGotData("profileData")

            if (!this.profileData?.length) return

            profileMenu.querySelector(".profile-wrapper").innerHTML = ""

            const layout = this.getProfileLayout(this.profileData[0])

            profileMenu.querySelector(".profile-wrapper").insertAdjacentHTML("beforeend", layout)

            const profileNickname = document.getElementById("profile_nickname")

            profileNickname.addEventListener("blur", () => {
                if (this.profileData[0].nickname === profileNickname.value) return

                this.send({
                    type: "change-nickname",
                    content: profileNickname.value
                })
            })
        }

        async waitWhileGotData(dataName) {
            return new Promise((resolve, reject) => {
                const intervalID = setInterval(() => {
                    if (!this[dataName]?.length) return

                    resolve()

                    clearInterval(intervalID)
                })
                })
        }

        async updateMembersMenu() {
            const membersMenu = document.getElementById("members_menu")

            membersMenu.querySelector(".members-list").innerHTML = `<div class="menu-loading">Loading...</div>`

            this.members = []

            this.needsMembers = true

            this.send({
                type: "request-data",
                content: {
                    name: "all-profiles"
                }
            })

            await this.waitWhileGotData("members")

            if (!this.members?.length) return

            membersMenu.querySelector(".members-list").innerHTML = ""

            for (const member of this.members) {
                const layout = this.getMemberCardLayout(member)

                membersMenu.querySelector(".members-list").insertAdjacentHTML("beforeend", layout)

                const lastMemberCard = document.querySelector(".members-list").lastElementChild
                const memberUserBlock = lastMemberCard.querySelector(".member-card-user")

                memberUserBlock.addEventListener("click", () => {
                    const memberStats = lastMemberCard.querySelector(".member-stats")

                    memberStats.style.display = memberStats.style.display === "flex" ? "none" : "flex"
                })
            }
        }
    }

    const client = new Client();


    function loadVirusImage(img) {
        const replacementVirus = new Image();
        replacementVirus.src = img;
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

        CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
            if (image instanceof HTMLImageElement && image.src.includes("2.png")) {
                originalDrawImage.call(this, replacementVirus, ...args);
            } else {
                originalDrawImage.apply(this, arguments);
            }
        };
    }

    function loadSkinImage(skin, img) {
        const replacementSkin = new Image();
        replacementSkin.src = img;
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

        CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
            if (image instanceof HTMLImageElement && image.src.includes(`${skin}.png`)) {
                originalDrawImage.call(this, replacementSkin, ...args);
            } else {
                originalDrawImage.apply(this, arguments);
            }
        };
    }

    let cursorPosition = { x: -1, y: -1 };

    document.addEventListener('mousemove', (event) => {
        cursorPosition = { x: event.clientX, y: event.clientY };
    });



    function mod() {
        this.welcomeUser = document.createElement("span");
        this.splitKey = {
            keyCode: 32,
            code: "Space",
            cancelable: true,
            composed: true,
            isTrusted: true,
            which: 32,
        }
        this.createMenu();
    }

    mod.prototype = {
        get style() {
            return `
        :root {
             --default-mod-color: #2E2D80;
        }

        input[type=range] {
            -webkit-appearance: none;
            height: 22px;
            background: transparent;
            cursor: pointer;
        }

        input[type=range]::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            background: #542499;
            height: 4px;
            border-radius: 6px;
        }
        input[type=range]::-webkit-slider-thumb {
            appearance: none;
            background: #6B32BD;
            height: 16px;
            width: 16px;
            position: relative;
            top: -5px;
            border-radius: 50%;
        }

        input:focus, select:focus, button:focus{
             outline: none;
        }
         .flex {
             display: flex;
        }
         .centerX {
             display: flex;
             justify-content: center;
        }
         .centerY {
             display: flex;
             align-items: center;
        }
         .centerXY {
             display: flex;
             align-items: center;
             justify-content: center
        }
         .f-column {
             display: flex;
             flex-direction: column;
        }
         #sig-mod-settings {
             border-radius: 4px;
             border: 2px solid rgba(255,255,255,.5);
             width: 525px;
             height: 380px;
        }
         .tabs_navigation {
             display: flex;
             justify-content: space-around;
        }
         .keybinding {
             max-width: 20px;
             text-align: center;
             margin-right: 5px;
             outline: none;
             color: #fff;
             background-color: #111;
             border: 0px solid #fff;
             font-weight: 500;
             border-bottom: 2px solid var(--default-mod-color);
             position: relative;
             border-top-right-radius: 4px;
             border-top-left-radius: 4px;
             transition: all .3s ease;
        }
         .keybinding:hover {
             background-color: #333;
        }
         .hidden {
             display: none !important;
        }
         #text-block,#left_ad_block,#ad_bottom,.ad-block,.ad-block-left,.ad-block-right {
             display: none;
        }
         .SettingsTitle{
             font-size: 32px;
             color: #EEE;
             margin-left: 10px;
        }
         .CloseBtn{
             width: 46px;
             background-color: transparent;
        }
        .select-btn {
            padding: 15px 20px;
            background: #222;
            border-radius: 2px;
            position: relative;
        }

        .select-btn:active {
            scale: 0.95
        }

        .select-btn::before {
            content: "...";
            font-size: 20px;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
         .text {
             user-select: none;
             font-weight: 500;
             text-align: left;
        }
         .titleImg{
             width: 50px;
             height: 50px;
             border-radius: 20px;
             object-fit: cover;
        }
         .modContainer {
             display: flex;
             justify-content: space-between;
        }
         .modButton{
             background-color: #333;
             border-radius: 5px;
             color: #fff;
             transition: all .3s;
             outline: none;
             padding: 5px;
             font-size: 13px;
             border: none;
        }
         .modButton:hover {
             background-color: #222
        }
         .tabbtn {
             background-color: #111;
             border-bottom: 2px solid var(--default-mod-color);
             border-radius: 0;
             position: relative;
             border-top-right-radius: 2px;
             border-top-left-radius: 2px;
             box-shadow: 0 4px 10px -4px var(--default-mod-color);
        }
         .tabbtn::before {
             content: "";
             position: absolute;
             left: 0;
             bottom: 0;
             width: 100%;
             height: 0;
             background: linear-gradient(to top, var(--default-mod-color), transparent);
             transition: height 0.3s ease;
        }
         .tabbtn:hover::before {
             height: 30%;
        }
         .modInput {
             background-color: #111;
             border: none;
             border-bottom: 2px solid var(--default-mod-color);
             border-radius: 0;
             position: relative;
             border-top-right-radius: 4px;
             border-top-left-radius: 4px;
             font-family: arial;
             font-weight: 500;
             padding: 4px;
             box-shadow: 0 4px 10px -4px var(--default-mod-color);
             color: #fff;
        }

        .modCheckbox input[type="checkbox"] {
             display: none;
             visibility: hidden;
        }
        .modCheckbox label {
          display: inline-block;
        }

        .modCheckbox .cbx {
          position: relative;
          top: 1px;
          width: 17px;
          height: 17px;
          border: 1px solid #c8ccd4;
          border-radius: 3px;
          vertical-align: middle;
          transition: background 0.1s ease;
          cursor: pointer;
        }

        .modCheckbox .cbx:after {
          content: '';
          position: absolute;
          top: 1px;
          left: 5px;
          width: 5px;
          height: 11px;
          opacity: 0;
          transform: rotate(45deg) scale(0);
          border-right: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transition: all 0.3s ease;
          transition-delay: 0.15s;
        }

        .modCheckbox .lbl {
          margin-left: 5px;
          vertical-align: middle;
          cursor: pointer;
        }

        .modCheckbox input[type="checkbox"]:checked ~ .cbx {
          border-color: transparent;
          background: #6871f1;
          box-shadow: 0 0 10px var(--default-mod-color);
        }

        .modCheckbox input[type="checkbox"]:checked ~ .cbx:after {
          opacity: 1;
          transform: rotate(45deg) scale(1);
        }

         .SettingsButton{
             border: none;
             outline: none;
             margin-right: 10px;
             transition: all .3s ease;
        }
         .SettingsButton:hover {
             scale: 1.1;
        }
         .colorInput{
             background-color: transparent;
             width: 33px;
             height: 35px;
             border-radius: 50%;
             border: none;
        }
         .colorInput::-webkit-color-swatch {
             border-radius: 50%;
             border: 1px solid #000;
        }
        .whiteBorder_colorInput::-webkit-color-swatch {
            border-color: #fff;
        }
         #dclinkdiv {
             display: flex;
             flex-direction: row;
        }
         .dclinks {
             width: calc(50% - 5px);
             height: 36px;
             display: flex;
             justify-content: center;
             align-items: center;
             background-color: rgba(88, 101, 242, 1);
             border-radius: 6px;
             margin: 0 auto;
             color: #fff;
        }
         #settings {
             display: flex;
             flex-direction: column;
        }
         #cm_close__settings {
             width: 50px;
             transition: all .3s ease;
        }
         #cm_close__settings svg:hover {
             scale: 1.1;
        }
         #cm_close__settings svg {
             transition: all .3s ease;
        }
         .modTitleText {
             text-align: center;
             font-size: 16px;
        }
         #settings > .checkbox-grid {
             width: 232px;
        }
         .ModSettings {
             display: flex;
             justify-content: center;
        }
         .settingsTitle {
             margin-bottom: 6px;
             text-decoration: underline;
             font-size: 16px font-weight: 600
        }
         .tab {
             display: none;
        }
        .modItem {
             display: flex;
             justify-content: center;
             align-items: center;
             flex-direction: column;
        }
         .tab-content {
             width: 100%;
             margin: 10px;
             overflow: auto;
        }

        #Tab6 .tab-content {
             overflow-y: auto;
             max-height: 230px;
             display: flex;
             flex-direction: column;
             gap: 10px;
        }

         .w-100 {
             width: 100%
        }
         .btnRS {
             margin: 0 5px;
             width: 50%
        }

        #savedNames {
            background-color: #222;
            padding: 5px;
            border-top-left-radius: 5px;
            overflow-y: scroll;
            width: 200px;
            height: 170px;
            display: flex;
            border-bottom: 2px solid var(--default-mod-color);
            box-shadow: 0 4px 20px -4px var(--default-mod-color);
        }

        .scroll::-webkit-scrollbar {
            width: 7px;
        }
        .scroll::-webkit-scrollbar-track {
            background: #222;
            border-radius: 5px;
        }
        .scroll::-webkit-scrollbar-thumb {
            background-color: #555;
            border-radius: 5px;
        }
        .scroll::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        .themes {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 220px;
            background: #000;
            border-radius: 5px;
            overflow-y: scroll;
            gap: 10px;
            padding: 5px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .themeContent {
          width: 50px;
          height: 50px;
          border: 2px solid #222;
          border-radius: 50%;
          background-position: center;
        }


        .theme {
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
        }
         .delName {
             font-weight: 500;
             background: #e17e7e;
             height: 20px;
             border: none;
             border-radius: 5px;
             font-size: 10px;
             margin-left: 5px;
             color: #fff;
             display: flex;
             justify-content: center;
             align-items: center;
             width: 20px;
        }
         .NameDiv {
             display: flex;
             background: #151515;
             border-radius: 5px;
             margin: 5px;
             padding: 3px 8px;
             height: 34px;
             align-items: center;
             justify-content: space-between;
             cursor: pointer;
             box-shadow: 0 4px 10px -4px var(--default-mod-color);
        }
        .NameLabel {
            cursor: pointer;
            font-weight: 500;
            text-align: center;
            color: #fff;
        }
        .resetButton {
            width: 25px;
            height: 25px;
            background-image: url("https://raw.githubusercontent.com/Sigmally/SigMod/main/images/reset.svg");
            background-color: transparent;
            border: none;
        }
        .modAlert {
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99998;
            background: #57C876;
            padding: 10px;
            border-radius: 10px;
            text-align: center;
            transition: all .3s ease-out;
        }
        .modAlert > .text {
            color: #fff;
        }

        .donate {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99995;
            background: #3F3F3F;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            padding: 10px;
            color: #fff;
        }


        .themeEditor {
            z-index: 100000;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, .85);
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 0 10px #fff;
            width: 400px;
        }

        .theme_editor_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .theme-editor-tab {
            display: flex;
            justify-content: center;
            align-items: start;
            flex-direction: column;
            margin-top: 10px
        }

        .themes_preview {
            width: 50px;
            height: 50px;
            border: 2px solid #fff;
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modKeybindings {
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            max-height: 170px;
        }
        .modKeybindings > label {
            margin-right: 5px;
        }
        #signInBtn, #nick, #gamemode, #option_0, #option_1, #option_2, .form-control {
            background: rgba(0, 0, 0, 0.4);
            color: #fff;
        }
        .btn, .sign-in-out-btn {
            transition: all .2s ease;
        }

        #gallery-content, #gallery-tab-buttons, #gallery-tab-buttons::after, #skin-search, .skin {
            background: #151515;
        }
        #gallery-content {
            box-shadow: 0 0 10px rgba(255,255,255,.5)
        }

        .skin-select__icon-text {
            color: #fff;
        }

        .justify-sb {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .macro-extanded_input {
            width: 75px;
            text-align: center;
        }
        #gamemode option {
            background: #111;
        }

        .stats-line {
            width: 100%;
            user-select: none;
            margin-bottom: 5px;
            padding: 5px;
            background: #151515;
            border: 1px solid var(--default-mod);
            border-radius: 5px;
        }

        .setting-card-wrapper {
            margin-right: 10px;
            padding: 10px;
            background: #222;
            border: #252525;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
        }

        .setting-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .setting-card-action {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
        }

        .setting-card-action {
            width: 100%;
        }

        .setting-card-name {
            font-size: 16px;
            user-select: none;
            width: 100%;
        }

        .mod-small-modal {
            position: absolute;
            z-index: 99999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #191919;
            box-shadow: 0 5px 15px -2px #000;
            border: 2px solid var(--default-mod-color);
            padding: 10px;
            border-radius: 5px;
        }

        .mod-small-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .mod-small-modal-header h1 {
            font-size: 20px;
            font-weight: 500;
            margin: 0;
        }

        .mod-small-modal-content {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
        }

        .mod-small-modal-content_selectImage {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .previmg {
            width: 50px;
            height: 50px;
            border: 2px solid #ccc;
        }

        #clans_and_settings {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .createAcc {
            position: absolute;
            z-index: 99999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #222;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 20px;
            width: 300px;
            height: 200px;
            box-shadow: 5px 5px 10px #000;
        }

        .createAcc span {
            color: #fff;
            font-size: 18px;
        }

        .lds-ring {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        .lds-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 64px;
          height: 64px;
          margin: 8px;
          border: 8px solid #fff;
          border-radius: 50%;
          animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #fff transparent transparent transparent;
        }
        .lds-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .lds-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }
        .lds-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }
        @keyframes lds-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

            `
        },
        respawnTime: Date.now(),
        respawnCooldown: 1000,
        move(cx, cy) {
            const mouseMoveEvent = new MouseEvent("mousemove", { clientX: cx, clientY: cy });
            const canvas = document.querySelector("canvas");
            canvas.dispatchEvent(mouseMoveEvent);
        },

        getColors() {
            const mapColor = document.getElementById("mapColor");
            const mapImage = document.getElementById("mapImage");
            const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;

            function ChangeMapColor() {
                CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
                    if ((width + height) / 2 === (window.innerWidth + window.innerHeight) / 2) {
                        this.fillStyle = mapColor.value;
                    }
                    originalFillRect.apply(this, arguments);
                };
                modSettings.mapColor = mapColor.value;
                updateStorage();
            }
            mapColor.addEventListener("input", ChangeMapColor);

            function ChangeMapImage() {
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();

                img.onload = function () {
                    fillCanvas();
                };

                function fillCanvas() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }

                img.src = mapImage.value;
                modSettings.mapImageURL = mapImage.value;
                updateStorage();
            }


            document.getElementById("setMapImage").addEventListener("click", () => {
                if(mapImage.value == "") return

                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                let pattern;

                img.onload = function () {
                    const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
                    const newWidth = img.width * ratio;
                    const newHeight = img.height * ratio;

                    const offsetX = (canvas.width - newWidth) / 2;
                    const offsetY = (canvas.height - newHeight) / 2;

                    ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
                    pattern = ctx.createPattern(canvas, "no-repeat");
                    fillCanvas();
                };
                function fillCanvas() {
                    const fillRect = CanvasRenderingContext2D.prototype.fillRect;
                    CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
                        this.fillStyle = pattern;
                        fillRect.apply(this, arguments);
                    };
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                img.src = mapImage.value;
                modSettings.mapImageURL = mapImage.value;
                updateStorage();
            });

            const mapColorReset = document.getElementById("mapColorReset");
            mapColorReset.addEventListener("click", () => {
                modSettings.mapColor = null;
                updateStorage();

                const mapColor = document.getElementById("mapColor");
                mapColor.value = "";
            });

            const removeButton = document.getElementById("removeMapImage");

            removeButton.addEventListener("click", () => {
                if (mapImage.value == "" || modSettings.mapImageURL === "") return;
                if (confirm("You need to reload the page to remove the background image. Reload?")) {
                    modSettings.mapImageURL = "";
                    updateStorage();
                    location.reload();
                }
            });


            if (modSettings) {
                function ChangeMapColor() {
                    CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
                        if ((width + height) / 2 === (window.innerWidth + window.innerHeight) / 2) {
                            this.fillStyle = modSettings.mapColor;
                        }
                        originalFillRect.apply(this, arguments);
                    };
                }
                ChangeMapColor();

                function ChangeMapImage() {
                    const canvas = document.getElementById("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    let pattern;

                    img.onload = function () {
                        const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
                        const newWidth = img.width * ratio;
                        const newHeight = img.height * ratio;

                        const offsetX = (canvas.width - newWidth) / 2;
                        const offsetY = (canvas.height - newHeight) / 2;

                        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
                        pattern = ctx.createPattern(canvas, "no-repeat");
                        fillCanvas();
                    };
                    function fillCanvas() {
                        const fillRect = CanvasRenderingContext2D.prototype.fillRect;
                        CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
                            this.fillStyle = pattern;
                            fillRect.apply(this, arguments);
                        };
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    img.src = mapImage.value;
                }
                ChangeMapImage();
            }
            mapImage.value = modSettings.mapImageURL;

            loadVirusImage(modSettings.virusImage)
            if(modSettings.skinImage.original !== null) {
                loadSkinImage(modSettings.skinImage.original, modSettings.skinImage.replaceImg)
            }
        },

        setColors() {
            // - NAME - //
            const nameColorValue = document.getElementById("nameColor");
            const fillText = CanvasRenderingContext2D.prototype.fillText;

            nameColorValue.addEventListener("input", () => {
                CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
                    if (text === document.getElementById("nick").value && this.playerId == this.playerId) {
                        const width = this.measureText(text).width;

                        this.fillStyle = nameColorValue.value;
                    }

                    return fillText.apply(this, arguments);
                };
                modSettings.nameColor = nameColorValue.value
                updateStorage();
            })

            const nameColor = document.getElementById("nameColor");

            CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
                if (text === document.getElementById("nick").value) {
                    const width = this.measureText(text).width;

                    this.fillStyle = modSettings.nameColor;
                }

                return fillText.apply(this, arguments);
            };

            nameColor.value = modSettings.nameColor;

            const nameColorReset = document.getElementById("nameColorReset");
            nameColorReset.addEventListener("click", () => {
                CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
                    if (text === document.getElementById("nick").value) {
                        const width = this.measureText(text).width;
                        const fontSize = 8;

                        this.fillStyle = "#ffffff";
                    }

                    return fillText.apply(this, arguments);
                };
                nameColorValue.value = "#ffffff"
                modSettings.nameColor = null;
                updateStorage();
            });

            if(modSettings.nameColor == null) nameColorValue.value = "#ffffff";


            // - BORDER - //
            const borderColorinput = document.getElementById("borderColor");
            const borderColorReset = document.getElementById("borderColorReset");

            const moveTo = CanvasRenderingContext2D.prototype.moveTo;
            borderColorinput.addEventListener("input", () => {
                CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
                    this.strokeStyle = borderColorinput.value;
                    return moveTo.apply(this, arguments)
                }
                modSettings.borderColor = borderColorinput.value;
                updateStorage();
            })

            borderColorReset.addEventListener("click", () => {
                CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
                    this.strokeStyle = ""
                    return moveTo.apply(this, arguments)
                }
                modSettings.borderColor = "";
                updateStorage();
            })

            if(modSettings.borderColor !== null) {
                CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
                    this.strokeStyle = modSettings.borderColor;
                    return moveTo.apply(this, arguments)
                }
            }

            const virusPreview = document.getElementById("virus");
            const setVirus = document.getElementById("setVirus");
            const virusURL = document.getElementById("virusURL");
            const openVirusModal = document.getElementById("virusImageSelect");
            const virusModal = document.getElementById("virusModal");
            const resetVirus = document.getElementById("resetVirus");

            openVirusModal.addEventListener("click", () => {
                virusModal.style.display = "block";
            });

            setVirus.addEventListener("click", () => {
                modSettings.virusImage = virusURL.value;
                loadVirusImage(modSettings.virusImage)
                updateStorage();
                virusPreview.src = modSettings.virusImage;
            });

            resetVirus.addEventListener("click", () => {
                modSettings.virusImage = "/assets/images/viruses/2.png";
                updateStorage();
                if(confirm("Please Refresh the page to make it work. Reload?")) {
                    location.reload();
                }
            });

            const skinPreview = document.getElementById("skinPreview");
            const skinURL = document.getElementById("skinURL");
            const setSkin = document.getElementById("setSkin");
            const openSkinModal = document.getElementById("SkinReplaceSelect");
            const skinModal = document.getElementById("skinModal");
            const originalSkin = document.getElementById("originalSkinSelect");
            const resetSkin = document.getElementById("resetSkin");

            const menuSkin = document.getElementById("js-skin-select-icon");

            openSkinModal.addEventListener("click", () => {
                skinModal.style.display = "block";
            });

            setSkin.addEventListener("click", () => {
                modSettings.skinImage.original = originalSkin.value;
                modSettings.skinImage.replaceImg = skinURL.value;
                loadSkinImage(modSettings.skinImage.original, modSettings.skinImage.replaceImg)
                updateStorage();
                skinPreview.src = modSettings.skinImage.replaceImg;
                loadSkinToMenu();
            });

            resetSkin.addEventListener("click", () => {
                modSettings.skinImage.original = null;
                modSettings.skinImage.replaceImg = null;
                updateStorage();
                if(confirm("Please Refresh the page to make it work. Reload?")) {
                    location.reload();
                }
            });

            function loadSkinToMenu() {
                if(modSettings.skinImage.original && modSettings.skinImage.replaceImg) {
                    menuSkin.style.backgroundImage = `url(${modSettings.skinImage.replaceImg})`
                }
            }

            setTimeout(loadSkinToMenu, 1500);
            setTimeout(loadSkinToMenu, 2500);
            setTimeout(loadSkinToMenu, 3500);
        },

        menu() {
            let Tab1;
            let Tab2;
            let Tab3;
            let Tab4;
            let Tab5;
            let Tab6;
            const welcomeuser = this.welcomeUser;
            const ModSettings = document.createElement("div");
            const KeyBindings = document.createElement("div");
            function openTab(tab) {
                let tabSelected = document.getElementById(tab);
                let allTabs = document.getElementsByClassName("tab");

                for (let i = 0; i < allTabs.length; i++) {
                    allTabs[i].style.display = "none";
                }

                tabSelected.style.display = "flex";
            }


            const settings = document.querySelector("#cm_modal__settings > .ctrl-modal__overlay > .ctrl-modal__modal");
            const DefaultSettings = document.querySelector("#settings > .checkbox-grid");
            const settingsTitle = settings.querySelector(".ctrl-modal__header > .ctrl-modal__title");

            settingsTitle.innerHTML = `<img src="${logo}" style="border-radius: 5px" width="44"/> SigMod Settings`
            settingsTitle.style.textAlign = "left";
            settings.setAttribute("id", "sig-mod-settings");

            const settingsHeader = settings.querySelector(".ctrl-modal__header");
            const menuTabs = document.createElement("div");
            menuTabs.classList.add("tabs_navigation");
            menuTabs.innerHTML = `
                  <button class="modButton tabbtn" id="modHome">Home</button>
                  <button class="modButton tabbtn" id="macroSettings">Macros</button>
                  <button class="modButton tabbtn" id="GameOptions">Game Options</button>
                  <button class="modButton tabbtn" id="NameOptions">Name options</button>
                  <button class="modButton tabbtn" id="modThemes">Themes</button>
                  <button class="modButton tabbtn" id="modInfo">Info</button>
                `;
            settingsHeader.insertAdjacentElement("afterend", menuTabs);

            const gameSettings = document.querySelector("#settings");
            const defaultSettingsTitle = document.createElement("span");
            defaultSettingsTitle.textContent = "Basic Settings";
            defaultSettingsTitle.classList.add("text", "settingsTitle");
            gameSettings.insertAdjacentElement("afterbegin", defaultSettingsTitle);

            welcomeuser.textContent = `Welcome Guest, to SigMod!`;
            welcomeuser.classList.add("text");
            welcomeuser.style = "margin: 10px 0; text-align: center; font-size: 16px;";

            const bsettings = document.querySelector("#sig-mod-settings > .ctrl-modal__content > .menu__item");
            bsettings.classList.add("tab")
            bsettings.style = "display: flex; flex-direction: column; margin: 0";
            bsettings.insertAdjacentElement("afterbegin", welcomeuser);
            Tab1 = bsettings;
            Tab1.setAttribute("id", "Tab1")

            function virusImgVal() {
                if(modSettings.virusImage === "/assets/images/viruses/2.png" || modSettings.virusImage === "") return "";
                return modSettings.virusImage;
            }
            function skinImgVal() {
                if(modSettings.skinImage.replaceImg === "" || modSettings.skinImage.replaceImg === null) return "";
                return modSettings.skinImage.replaceImg;
            }

            Tab2 = document.createElement("div");
            Tab2.classList.add("centerX");
            Tab2.style.height = "180px";
            Tab2.innerHTML = `
                    <div class="tab-content f-column scroll" style="height: 100%">
                        <div class="flex" style="justify-content: space-evenly;">
                            <div class="modItem">
                                <span class="text">Map Color</span>
                                <div class="centerXY">
                                    <input type="color" value="#ffffff" id="mapColor" class="colorInput" />
                                    <button class="resetButton" id="mapColorReset"></button>
                                </div>
                            </div>
                            <div class="modItem">
                                <span class="text">Border Colors</span>
                                <div class="centerXY">
                                    <input type="color" value="#ffffff" id="borderColor" class="colorInput" />
                                    <button class="resetButton" id="borderColorReset"></button>
                                 </div>
                            </div>
                            <div class="modItem">
                                <span class="text">Virus Image</span>
                                <div class="centerXY" style="margin-top: 5px">
                                    <button class="btn select-btn" id="virusImageSelect"></button>
                                 </div>
                            </div>
                            <div class="modItem">
                                <span class="text">Replace Skins</span>
                                <div class="centerXY" style="margin-top: 5px">
                                    <button class="btn select-btn" id="SkinReplaceSelect"></button>
                                 </div>
                            </div>
                        </div>

                        <div class="centerXY f-column" style="margin-top: auto">
                            <span class="text">Map image:</span>
                            <div class="f-column" style="margin-top: 5px;">
                                <input type="text" placeholder="background Image URL" id="mapImage" class="modInput" value="" />
                                <div class="centerX" style="margin-top: 10px;">
                                    <button class="modButton btnRS" id="removeMapImage">Remove</button>
                                    <button class="modButton btnRS" id="setMapImage">Set</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mod-small-modal" id="virusModal" style="display: none;">
                        <div class="mod-small-modal-header">
                            <h1>Virus Image</h1>
                            <button class="ctrl-modal__close mod_small_modal_close">
                                <svg width="22" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                        <hr>
                        <div class="mod-small-modal-content">
                            <div class="mod-small-modal-content_selectImage">
                                <div class="flex" style="gap: 5px;">
                                    <input type="text" class="modInput" placeholder="Virus Image URL" id="virusURL" value="${virusImgVal()}" />
                                    <button class="modButton" id="setVirus">Apply</button>
                                </div>
                            </div>
                            <button class="modButton" id="resetVirus" style="align-self: start; margin-top: 5px;">Reset</button>
                            <img src="${modSettings.virusImage}" class="previmg" id="virus" draggable="false" >
                        </div>
                    </div>


                    <div class="mod-small-modal" id="skinModal" style="display: none;">
                        <div class="mod-small-modal-header">
                            <h1>Skin Replacement</h1>
                            <button class="ctrl-modal__close mod_small_modal_close">
                                <svg width="22" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                        <hr>
                        <div class="mod-small-modal-content">
                            <div class="mod-small-modal-content_selectImage">
                                <div class="centerXY" style="gap: 5px;">
                                    <span>Original Skin: </span>
                                    <select class="form-control" style="padding: 2px; text-align: left; width: fit-content" id="originalSkinSelect">
                                      <option value="Alexander">Alexander</option>
                                      <option value="Celia">Celia</option>
                                      <option value="Chet">Chet</option>
                                      <option value="Chip">Chip</option>
                                      <option value="Dale">Dale</option>
                                      <option value="Hardscrabble">Hardscrabble</option>
                                      <option value="Harley">Harley</option>
                                      <option value="Proctor">Proctor</option>
                                      <option value="Roz">Roz</option>
                                      <option value="Rocky">Rocky</option>
                                      <option value="Lenny">Lenny</option>
                                      <option value="Bullseye">Bullseye</option>
                                      <option value="Hamm">Hamm</option>
                                      <option value="Peep">Peep</option>
                                      <option value="Art">Art</option>
                                      <option value="Bile">Bile</option>
                                      <option value="Boo">Boo</option>
                                      <option value="Brandywine">Brandywine</option>
                                      <option value="Carlton">Carlton</option>
                                      <option value="Derek">Derek</option>
                                      <option value="Fungus">Fungus</option>
                                      <option value="George">George</option>
                                      <option value="Gesner">Gesner</option>
                                      <option value="Josh">Josh</option>
                                      <option value="Michael">Michael</option>
                                      <option value="Needleman">Needleman</option>
                                      <option value="Peterson">Peterson</option>
                                      <option value="Randall">Randall</option>
                                      <option value="Smitty">Smitty</option>
                                      <option value="Spike">Spike</option>
                                      <option value="Squibbles">Squibbles</option>
                                      <option value="Sulley">Sulley</option>
                                      <option value="Waternoose">Waternoose</option>
                                      <option value="Worthington">Worthington</option>
                                      <option value="Yeti">Yeti</option>
                                      <option value="Terri">Terri</option>
                                    </select>
                                </div>
                                <span style="text-align: center">Will be replaced with...</span>
                                <div class="flex" style="gap: 5px;">
                                    <input type="text" class="modInput" placeholder="Skin Image URL" id="skinURL" value="${skinImgVal()}"/>
                                    <button class="modButton" id="setSkin">Apply</button>
                                </div>
                            </div>
                            <button class="modButton" id="resetSkin" style="align-self: start; margin-top: 5px;">Reset</button>
                            <img src="" class="previmg" id="skinPreview" draggable="false" >
                        </div>
                    </div>
                `;
            Tab2.classList.add("tab", "hidden");
            Tab2.setAttribute("id", "Tab2");

            Tab3 = document.createElement("div");
            Tab3.innerHTML = `
                <div class="tab-content scroll">
                    <span class="text">Save names</span>
                    <div class="flex">
                        <div class="f-column" style="margin-top: 5px;">
                            <div>
                                <input placeholder="Name" class="modInput" style="width: 124px" id="saveNameValue" />
                                <button class="modButton" style="margin-left: 5px" id="saveName">Add</button>
                                <div class="modItem" style="margin-top: 35px;">
                                    <span class="text">Name Color</span>
                                    <div class="centerXY">
                                        <input type="color" value="#ffffff" id="nameColor" class="colorInput">
                                        <button class="resetButton" id="nameColorReset"></button>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 5px; align-items: center;">
                                <div>
                                    <button class="modButton" onclick="window.open('https://nickfinder.com', '_blank')">Nickfinder</button>
                                    <button class="modButton" onclick="window.open('https://www.stylishnamemaker.com', '_blank')">Stylish Name</button>
                                </div>
                                <button class="modButton" onclick="window.open('https://www.tell.wtf', '_blank')" style="width: 50%;">Tell.wtf</button>
                            </div>
                        </div>
                        <div class="f-column" style="margin-left: auto">
                            <span class="Sett">saved:</span>
                            <div class="modItem">
                                <div id="savedNames" class="f-column scroll"></div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            Tab3.classList.add("tab", "hidden", "centerX");
            Tab3.setAttribute("id", "Tab3");

            Tab4 = document.createElement("div");
            Tab4.innerHTML = `
                    <div class="tab-content themes scroll" id="themes">
                        <div class="theme" id="createTheme">
                            <div class="themeContent" style="background: url('https://sigmally.com/assets/images/icon/plus.svg'); background-size: 50% auto; background-repeat: no-repeat; background-position: center;"></div>
                            <div class="themeName text" style="color: #fff">Create</div>
                        </div>
                    </div>
                `;
            Tab4.classList.add("tab", "hidden", "centerX");
            Tab4.setAttribute("id", "Tab4");

            Tab5 = document.createElement("div");
            Tab5.innerHTML = `
            <ul>
                <li>
                    SigMod V${version} made by Cursed. Thanks to Ultra, Nudo, Dreamz, Xaris, Benzofury
                </li>
                <li>
                    <a href="https://youtube.com/@sigmallyCursed" target="_blank">Cursed YT</a>
                </li>
                <li>
                    <a href="https://youtube.com/@sigmally" target="_blank">Official Sigmally YT</a>
                </li>
            </ul>
            <img src="https://i.ibb.co/CPK4hM7/Sigmally-Modz-Logo2.png" width="100" style="cursor: pointer; border-radius: 10px;" onclick="window.open('https://discord.gg/gHmhpCaPfP')">
            `;
            Tab5.classList.add("tab", "hidden");
            Tab5.setAttribute("id", "Tab5");
            Tab5.style.margin = "20px 0"

            Tab6 = document.createElement("div");
            Tab6.innerHTML = `
                <div class="tab-content scroll">
                    <div class="setting-card-wrapper">
                        <div class="setting-card">
                            <div class="setting-card-action">
                                <span class="setting-card-name">Mouse macros</span>
                            </div>
                        </div>

                        <div class="setting-parameters" style="display: none;">
                            <div class="stats-line" style="border-radius: 0; border-top-right-radius: 10px; border-top-left-radius: 10px;">
                                <span class="stats-info-text" style="color: #d0d0d0;">Feed or Split with mouse buttons</span>
                            </div>

                            <div class="stats-line justify-sb">
                                <span class="stats-info-text">Mouse Button 1 (left)</span>
                                <select class="form-control macro-extanded_input" style="padding: 2px; text-align: left; width: 100px" id="m1_macroSelect">
                                    <option value="none">None</option>
                                    <option value="fastfeed">Fast Feed</option>
                                    <option value="split">Split (1)</option>
                                    <option value="split2">Double Split</option>
                                    <option value="split3">Triple Split</option>
                                    <option value="split4">Quad Split</option>
                                    <option value="freeze">Freeze Player</option>
                                </select>
                            </div>

                            <div class="stats-line justify-sb">
                                <span class="stats-info-text">Mouse Button 2 (right)</span>
                                <select class="form-control" style="padding: 2px; text-align: left; width: 100px" id="m2_macroSelect">
                                    <option value="none">None</option>
                                    <option value="split">Split (1)</option>
                                    <option value="split2">Double Split</option>
                                    <option value="split3">Triple Split</option>
                                    <option value="split4">Quad Split</option>
                                    <option value="freeze">Freeze Player</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="setting-card-wrapper">
                        <div class="setting-card">
                            <div class="setting-card-action">
                                <span class="setting-card-name">Freeze Player</span>
                            </div>
                        </div>

                        <div class="setting-parameters" style="display: none;">
                            <div class="stats-line">
                                <span class="stats-info-text" style="color: #d0d0d0;">Freeze your player on the Map</span>
                            </div>

                            <div class="stats-line justify-sb">
                                <span class="stats-info-text">Type of Freeze</span>
                                <select class="form-control" style="padding: 2px; text-align: left; width: 100px" id="freezeType">
                                    <option value="press">Press</option>
                                    <option value="hold">Hold</option>
                                </select>
                            </div>

                            <div class="stats-line justify-sb">
                                <span class="stats-info-text">Bind</span>
                                <input value="${modSettings.keyBindingsFreezePlayer}" readonly id="modinput7" name="keyBindingsFreezePlayer" class="form-control macro-extanded_input" onfocus="this.select();">
                            </div>
                        </div>
                    </div>
                    <span class="text" style="text-align: center;">More Options are coming soon...</span>
                </div>
            `;
            Tab6.classList.add("tab", "hidden", "scroll");
            Tab6.setAttribute("id", "Tab6");

            document.getElementById("modHome").addEventListener("click", () => {
                openTab("Tab1");
            });
            document.getElementById("GameOptions").addEventListener("click", () => {
                openTab("Tab2");
            });
            document.getElementById("NameOptions").addEventListener("click", () => {
                openTab("Tab3");
            });
            document.getElementById("modThemes").addEventListener("click", () => {
                openTab("Tab4");
            });
            document.getElementById("modInfo").addEventListener("click", () => {
                openTab("Tab5");
            });
            document.getElementById("macroSettings").addEventListener("click", () => {
                openTab("Tab6");
            });

            const tabContent = document.querySelector("#sig-mod-settings > .ctrl-modal__content");
            tabContent.append(Tab2)
            tabContent.append(Tab3)
            tabContent.append(Tab4)
            tabContent.append(Tab5)
            tabContent.append(Tab6)

            KeyBindings.classList.add("modKeybindings", "scroll")
            KeyBindings.innerHTML = `
                    <span class="text settingsTitle">KeyBindings</span>
                    <label class="flex">
                      <input type="text" name="keyBindingsRapidFeed" id="modinput1" class="keybinding" value="${modSettings.keyBindingsRapidFeed}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Rapid Feed</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsdoubleSplit" id="modinput2" class="keybinding" value="${modSettings.keyBindingsdoubleSplit}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Double Split</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsTripleSplit" id="modinput3" class="keybinding" value="${modSettings.keyBindingsTripleSplit}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Triple Split</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsQuadSplit" id="modinput4" class="keybinding" value="${modSettings.keyBindingsQuadSplit}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Quad Split</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsFreezePlayer" id="modinput5" class="keybinding" value="${modSettings.keyBindingsFreezePlayer}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Freeze Player</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsToggleMenu" id="modinput6" class="keybinding" value="${modSettings.keyBindingsToggleMenu}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Toggle Menu</span>
                    </label>
                `;

            bsettings.append(ModSettings);
            ModSettings.append(gameSettings)
            ModSettings.append(KeyBindings);

            ModSettings.classList.add("ModSettings")


            document.querySelector("#cm_close__settings svg").setAttribute("width", "22");
            document.querySelector("#cm_close__settings svg").setAttribute("height", "24");

            const closeModalButtons = document.querySelectorAll(".mod_small_modal_close");

            closeModalButtons.forEach((closeModalButton) => {
                closeModalButton.addEventListener("click", () => {
                    const modal = closeModalButton.closest(".mod-small-modal");
                    modal.style.display = "none";
                });
            });
        },

        Themes() {
            const elements = [
                "#menu",
                ".top-users__inner",
                "#left-menu",
                ".menu-links",
                ".menu--stats-mode",
                "#cm_modal__settings > .ctrl-modal__overlay > .ctrl-modal__modal"
            ];

            const themeEditor = document.createElement("div");
            themeEditor.classList.add("themeEditor", "hidden");

            themeEditor.innerHTML = `
                <div class="theme_editor_header">
                    <h3>Theme Editor</h3>
                    <button class="btn CloseBtn" id="closeThemeEditor">
                        <svg width="22" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
                <hr />
                <main class="theme_editor_content">
                    <div class="centerXY" style="justify-content: flex-end;gap: 10px">
                        <span class="text">Select Theme Type: </span>
                        <select class="form-control" style="background: #222; color: #fff; width: 150px" id="theme-type-select">
                            <option>Static Color</option>
                            <option>Gradient</option>
                            <option>Image / Gif</option>
                        </select>
                    </div>

                    <div id="theme_editor_color" class="theme-editor-tab">
                        <div class="centerXY">
                            <label for="theme-editor-bgcolorinput" class="text">Background color:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-bgcolorinput"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-colorinput" class="text">Text color:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-colorinput"/>
                        </div>
                        <div style="background-color: #000000" class="themes_preview" id="color_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" maxlength="15" placeholder="Theme name..." id="colorThemeName"/>
                            <button class="btn btn-success" id="saveColorTheme">Save</button>
                        </div>
                    </div>


                    <div id="theme_editor_gradient" class="theme-editor-tab" style="display: none;">
                        <div class="centerXY">
                            <label for="theme-editor-gcolor1" class="text">Color 1:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-gcolor1"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-g_color" class="text">Color 2:</label>
                            <input type="color" value="#ffffff" class="colorInput whiteBorder_colorInput" id="theme-editor-g_color"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-gcolor2" class="text">Text Color:</label>
                            <input type="color" value="#ffffff" class="colorInput whiteBorder_colorInput" id="theme-editor-gcolor2"/>
                        </div>

                        <div class="centerXY" style="gap: 10px">
                            <label for="gradient-type" class="text">Gradient Type:</label>
                            <select id="gradient-type" class="form-control" style="background: #222; color: #fff; width: 120px;">
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                            </select>
                        </div>

                        <div id="theme-editor-gradient_angle" class="centerY" style="gap: 10px; width: 100%">
                            <label for="g_angle" class="text" id="gradient_angle_text" style="width: 115px;">Angle (0deg):</label>
                            <input type="range" id="g_angle" value="0" min="0" max="360">
                        </div>

                        <div style="background: linear-gradient(0deg, #000, #fff)" class="themes_preview" id="gradient_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" placeholder="Theme name..." id="GradientThemeName"/>
                            <button class="btn btn-success" id="saveGradientTheme">Save</button>
                        </div>
                    </div>



                    <div id="theme_editor_image" class="theme-editor-tab" style="display: none">
                        <div class="centerXY">
                            <input type="text" id="theme-editor-imagelink" placeholder="Image / GIF URL (https://i.ibb.co/k6hn4v0/Galaxy-Example.png)" class="form-control" style="background: #222; color: #fff"/>
                        </div>
                        <div class="centerXY" style="margin: 5px; gap: 5px;">
                            <label for="theme-editor-textcolorImage" class="text">Text Color: </label>
                            <input type="color" class="colorInput whiteBorder_colorInput" value="#ffffff" id="theme-editor-textcolorImage"/>
                        </div>

                        <div style="background: url('https://i.ibb.co/k6hn4v0/Galaxy-Example.png'); background-position: center; background-size: cover;" class="themes_preview" id="image_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" placeholder="Theme name..." id="imageThemeName"/>
                            <button class="btn btn-success" id="saveImageTheme">Save</button>
                        </div>
                    </div>
                </main>
            `;

            document.body.append(themeEditor);

            setTimeout(() => {
                const themeTypeSelect = document.getElementById("theme-type-select");
                const colorTab = document.getElementById("theme_editor_color");
                const gradientTab = document.getElementById("theme_editor_gradient");
                const imageTab = document.getElementById("theme_editor_image");
                const gradientAngleDiv = document.getElementById("theme-editor-gradient_angle");

                themeTypeSelect.addEventListener("change", function() {
                    const selectedOption = themeTypeSelect.value;
                    switch (selectedOption) {
                        case "Static Color":
                            colorTab.style.display = "flex";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "none";
                            break;
                        case "Gradient":
                            colorTab.style.display = "none";
                            gradientTab.style.display = "flex";
                            imageTab.style.display = "none";
                            break;
                        case "Image / Gif":
                            colorTab.style.display = "none";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "flex";
                            break;
                        default:
                            colorTab.style.display = "flex";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "none";
                    }
                });

                const colorInputs = document.querySelectorAll("#theme_editor_color .colorInput");
                colorInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const bgColorInput = document.getElementById("theme-editor-bgcolorinput").value;
                        const textColorInput = document.getElementById("theme-editor-colorinput").value;

                        applyColorTheme(bgColorInput, textColorInput);
                    });
                });

                const gradientInputs = document.querySelectorAll("#theme_editor_gradient .colorInput");
                gradientInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                        const gColor2 = document.getElementById("theme-editor-g_color").value;
                        const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                        const gAngle = document.getElementById("g_angle").value;
                        const gradientType = document.getElementById("gradient-type").value;

                        applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType);
                    });
                });

                const imageInputs = document.querySelectorAll("#theme_editor_image .colorInput");
                imageInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const imageLinkInput = document.getElementById("theme-editor-imagelink").value;
                        const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                        let img;
                        if(imageLinkInput == "") {
                            img = "https://i.ibb.co/k6hn4v0/Galaxy-Example.png"
                        } else {
                            img = imageLinkInput;
                        }
                        applyImageTheme(img, textColorImageInput);
                    });
                });
                const image_preview = document.getElementById("image_preview");
                const image_link = document.getElementById("theme-editor-imagelink");

                let isWriting = false;
                let timeoutId;

                image_link.addEventListener("input", () => {
                    if (!isWriting) {
                        isWriting = true;
                    } else {
                        clearTimeout(timeoutId);
                    }

                    timeoutId = setTimeout(() => {
                        const imageLinkInput = image_link.value;
                        const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                        let img;
                        if (imageLinkInput === "") {
                            img = "https://i.ibb.co/k6hn4v0/Galaxy-Example.png";
                        } else {
                            img = imageLinkInput;
                        }

                        applyImageTheme(img, textColorImageInput);
                        isWriting = false;
                    }, 1000);
                });


                const gradientTypeSelect = document.getElementById("gradient-type");
                const angleInput = document.getElementById("g_angle");

                gradientTypeSelect.addEventListener("change", function() {
                    const selectedType = gradientTypeSelect.value;
                    gradientAngleDiv.style.display = selectedType === "linear" ? "flex" : "none";

                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;

                    applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, selectedType);
                });


                angleInput.addEventListener("input", function() {
                    const gradient_angle_text = document.getElementById("gradient_angle_text");
                    gradient_angle_text.innerText = `Angle (${angleInput.value}deg): `;
                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;
                    const gradientType = document.getElementById("gradient-type").value;

                    applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType);
                });

                function applyColorTheme(bgColor, textColor) {
                    const previewDivs = document.querySelectorAll("#theme_editor_color .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        previewDiv.style.backgroundColor = bgColor;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = textColor;
                    });
                }

                function applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType) {
                    const previewDivs = document.querySelectorAll("#theme_editor_gradient .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        const gradient = gradientType === "linear"
                        ? `linear-gradient(${gAngle}deg, ${gColor1}, ${gColor2})`
                        : `radial-gradient(circle, ${gColor1}, ${gColor2})`;
                        previewDiv.style.background = gradient;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = gTextColor;
                    });
                }

                function applyImageTheme(imageLink, textColor) {
                    const previewDivs = document.querySelectorAll("#theme_editor_image .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        previewDiv.style.backgroundImage = `url('${imageLink}')`;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = textColor;
                    });
                }



                const createTheme = document.getElementById("createTheme");
                createTheme.addEventListener("click", () => {
                    themeEditor.style.display = "block";
                });

                const closeThemeEditor = document.getElementById("closeThemeEditor");
                closeThemeEditor.addEventListener("click", () => {
                    themeEditor.style.display = "none";
                });

                let themesDiv = document.getElementById("themes")

                const saveColorThemeBtn = document.getElementById("saveColorTheme");
                const saveGradientThemeBtn = document.getElementById("saveGradientTheme");
                const saveImageThemeBtn = document.getElementById("saveImageTheme");

                saveColorThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("colorThemeName").value;
                    const bgColorInput = document.getElementById("theme-editor-bgcolorinput").value;
                    const textColorInput = document.getElementById("theme-editor-colorinput").value;

                    if(name == "") return

                    const theme = {
                        name: name,
                        background: bgColorInput,
                        text: textColorInput
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    updateStorage();

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });

                saveGradientThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("GradientThemeName").value;
                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;
                    const gradientType = document.getElementById("gradient-type").value;

                    if(name == "") return

                    let gradient_radial_linear = () => {
                        if(gradientType == "linear") {
                            return `${gradientType}-gradient(${gAngle}deg, ${gColor1}, ${gColor2})`
                        } else if (gradientType == "radial") {
                            return `${gradientType}-gradient(circle, ${gColor1}, ${gColor2})`
                        }
                    }
                    const theme = {
                        name: name,
                        background: gradient_radial_linear(),
                        text: gTextColor,
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    updateStorage();

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });

                saveImageThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("imageThemeName").value;
                    const imageLink = document.getElementById("theme-editor-imagelink").value;
                    const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                    if(name == "" || imageLink == "") return

                    const theme = {
                        name: name,
                        background: imageLink,
                        text: textColorImageInput
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    updateStorage();

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });
            });

            const b_inner = document.querySelector(".body__inner");
            let bodyColorElements = b_inner.querySelectorAll(
                ".body__inner > :not(.body__inner), #s-skin-select-icon-text"
            );

            const toggleColor = (element, background, text) => {
                let image = `url("${background}")`;
                if (background.includes("http")) {
                    element.style.background = image;
                    element.style.backgroundPosition = "center";
                    element.style.backgroundSize = "cover";
                    element.style.backgroundRepeat = "no-repeat";
                } else {
                    element.style.background = background;
                    element.style.backgroundRepeat = "no-repeat";
                }
                element.style.color = text;
            };

            const friendsButton = document.createElement("button");
            friendsButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="32" height="32">
              <path fill="#fff" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"/>
            </svg>
            `;

            friendsButton.id = "friendsbtn"


            document.getElementById("clans_and_settings").insertAdjacentHTML("afterbegin", friendsButton.outerHTML)


            const openSVG = document.querySelector("#clans_and_settings > Button:nth-child(2) > svg");
            const openSVGPath = document.querySelector("#clans_and_settings > Button:nth-child(2) > svg > path");
            const newPath = openSVG.setAttribute("fill", "#fff")
            const closeSVGPath = document.querySelector("#cm_close__settings > svg > path");
            openSVG.setAttribute("width", "36")
            openSVG.setAttribute("height", "36")

            const toggleTheme = (theme) => {
                if (theme.text === "#FFFFFF") {
                    openSVGPath.setAttribute("fill", "#fff")
                    closeSVGPath.setAttribute("stroke", "#fff")
                } else {
                    closeSVGPath.setAttribute("stroke", "#222");
                    openSVG.setAttribute("fill", "#222");
                }

                const backgroundColor = theme.background;
                const textColor = theme.text;

                elements.forEach((element) => {
                    const el = document.querySelector(element);
                    toggleColor(el, backgroundColor, textColor);
                });

                bodyColorElements.forEach((element) => {
                    element.style.color = textColor;
                });

                modSettings.Theme = theme.name;
                updateStorage();
            };

            const themes = {
                defaults: [
                    {
                        name: "Dark",
                        background: "#151515",
                        text: "#FFFFFF"
                    },
                    {
                        name: "White",
                        background: "#ffffff",
                        text: "#000000"
                    },
                ],
                orderly: [
                    {
                        name: "THC",
                        background: "linear-gradient(160deg, #9BEC7A, #117500)",
                        text: "#000000"
                    },
                    {
                        name: "4 AM",
                        background: "linear-gradient(160deg, #8B0AE1, #111)",
                        text: "#FFFFFF"
                    },
                    {
                        name: "OTO",
                        background: "linear-gradient(160deg, #A20000, #050505)",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Gaming",
                        background: "https://i.ibb.co/DwKkQfh/BG-1-lower-quality.jpg",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Shapes",
                        background: "https://i.ibb.co/h8TmVyM/BG-2.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Blue",
                        background: "https://i.ibb.co/9yQBfWj/BG-3.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Blue - 2",
                        background: "https://i.ibb.co/7RJvNCX/BG-4.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Purple",
                        background: "https://i.ibb.co/vxY15Tv/BG-5.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Orange Blue",
                        background: "https://i.ibb.co/99nfFBN/BG-6.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Gradient",
                        background: "https://i.ibb.co/hWMLwLS/BG-7.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Sky",
                        background: "https://i.ibb.co/P4XqDFw/BG-9.png",
                        text: "#000000"
                    },
                    {
                        name: "Sunset",
                        background: "https://i.ibb.co/0BVbYHC/BG-10.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Galaxy",
                        background: "https://i.ibb.co/MsssDKP/Galaxy.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Planet",
                        background: "https://i.ibb.co/KLqWM32/Planet.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "colorful",
                        background: "https://i.ibb.co/VqtB3TX/colorful.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Sunset - 2",
                        background: "https://i.ibb.co/TLp2nvv/Sunset.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Epic",
                        background: "https://i.ibb.co/kcv4tvn/Epic.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Galaxy - 2",
                        background: "https://i.ibb.co/smRs6V0/galaxy.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Cloudy",
                        background: "https://i.ibb.co/MCW7Bcd/cloudy.png",
                        text: "#000000"
                    },
                ]
            };

            function createThemeCard(theme) {
                const themeCard = document.createElement("div");
                themeCard.classList.add("theme");
                let themeBG;
                if (theme.background.includes("http")) {
                    themeBG = `background: url(${theme.background})`;
                } else {
                    themeBG = `background: ${theme.background}`;
                }
                themeCard.innerHTML = `
                  <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                  <div class="themeName text" style="color: #fff">${theme.name}</div>
                `;

                themeCard.addEventListener("click", () => {
                    toggleTheme(theme);
                });

                if (modSettings.addedThemes.includes(theme)) {
                    themeCard.addEventListener('contextmenu', function(ev) {
                        ev.preventDefault();
                        if (confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    }, false);
                }

                return themeCard;
            }

            const themesContainer = document.getElementById("themes");

            themes.defaults.forEach((theme) => {
                const themeCard = createThemeCard(theme);
                themesContainer.append(themeCard);
            });

            const orderlyThemes = [...themes.orderly, ...modSettings.addedThemes];
            orderlyThemes.sort((a, b) => a.name.localeCompare(b.name));
            orderlyThemes.forEach((theme) => {
                const themeCard = createThemeCard(theme);
                themesContainer.appendChild(themeCard);
            });


            const savedTheme = modSettings.Theme;
            if (savedTheme) {
                let selectedTheme;
                selectedTheme = themes.defaults.find((theme) => theme.name === savedTheme);
                if (!selectedTheme) {
                    selectedTheme = themes.orderly.find((theme) => theme.name === savedTheme) || modSettings.addedThemes.find((theme) => theme.name === savedTheme);
                }

                if (selectedTheme) {
                    toggleTheme(selectedTheme);
                }
            }
        },

        macroSettings() {
            const allSettingNames = document.querySelectorAll(".setting-card-name")

            for (const settingName of Object.values(allSettingNames)) {
                settingName.addEventListener("click", (event) => {
                    const settingCardWrappers = document.querySelectorAll(".setting-card-wrapper")
                    const currentWrapper = Object.values(settingCardWrappers).filter((wrapper) => wrapper.querySelector(".setting-card-name").textContent === settingName.textContent)[0]
                    const settingParameters = currentWrapper.querySelector(".setting-parameters")

                    settingParameters.style.display = settingParameters.style.display === "none" ? "block" : "none"
                })
            }
        },

        smallMods() {
            const welcomeuser = this.welcomeUser;

            const gameSettings = document.querySelector(".checkbox-grid");
            gameSettings.innerHTML += `
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="showNames">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Names</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="showSkins">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Skins</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="autoRespawn">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Auto Respawn</label>
                    </div>
                  </div>
                </li>
                `;

            let autoRespawn = document.getElementById("autoRespawn");
            let autoRespawnEnabled = false;
            autoRespawn.addEventListener("change", () => {
                if(!autoRespawnEnabled) {
                    modSettings.AutoRespawn = true;
                    updateStorage();
                    autoRespawnEnabled = true;
                } else {
                    modSettings.AutoRespawn = false;
                    updateStorage();
                    autoRespawnEnabled = false;
                }
            });

            if(modSettings.AutoRespawn) {
                autoRespawn.checked = true;
                autoRespawnEnabled = true;
            }

            const gameTitle = document.getElementById("title");
            gameTitle.innerHTML = 'Sigmally<span style="display: block; font-size: 14px; font-family: Comic Sans MS ">Mod by <a href="https://www.youtube.com/@sigmallyCursed/" target="_blank">Cursed</a></span>';

            const nickName = document.getElementById("nick");
            nickName.maxLength = 50;
        },

        credits() {
            console.log(`%c

░█▀▀▀█ ▀█▀ ░█▀▀█ ░█▀▄▀█ ░█▀▀▀█ ░█▀▀▄
─▀▀▀▄▄ ░█─ ░█─▄▄ ░█░█░█ ░█──░█ ░█─░█
░█▄▄▄█ ▄█▄ ░█▄▄█ ░█──░█ ░█▄▄▄█ ░█▄▄▀

██████╗░██╗░░░██╗  ░█████╗░██╗░░░██╗██████╗░░██████╗███████╗██████╗░
██╔══██╗╚██╗░██╔╝  ██╔══██╗██║░░░██║██╔══██╗██╔════╝██╔════╝██╔══██╗
██████╦╝░╚████╔╝░  ██║░░╚═╝██║░░░██║██████╔╝╚█████╗░█████╗░░██║░░██║
██╔══██╗░░╚██╔╝░░  ██║░░██╗██║░░░██║██╔══██╗░╚═══██╗██╔══╝░░██║░░██║
██████╦╝░░░██║░░░  ╚█████╔╝╚██████╔╝██║░░██║██████╔╝███████╗██████╔╝
╚═════╝░░░░╚═╝░░░  ░╚════╝░░╚═════╝░╚═╝░░╚═╝╚═════╝░╚══════╝╚═════╝░
`, 'background-color: black; color: green')
        },
        saveNames() {
            let savedNames = modSettings.savedNames;
            let savedNamesOutput = document.getElementById("savedNames");
            let saveNameBtn = document.getElementById("saveName");
            let saveNameInput = document.getElementById("saveNameValue");

            const createNameDiv = (name) => {
                let nameDiv = document.createElement("div");
                nameDiv.classList.add("NameDiv");

                let nameLabel = document.createElement("label");
                nameLabel.classList.add("NameLabel");
                nameLabel.innerText = name;

                let delName = document.createElement("button");
                delName.innerText = "X";
                delName.classList.add("delName");

                nameDiv.addEventListener("click", () => {
                    navigator.clipboard.writeText(nameLabel.innerText).then(() => {
                        const copiedAlert = document.createElement("div");
                        copiedAlert.innerHTML = `
                                <span class="text">Added Nickname to clipboard!</span>
                            `;
                        copiedAlert.classList.add("modAlert");
                        setTimeout(() => {
                            copiedAlert.style.opacity = 0;
                            setTimeout(() => {
                                copiedAlert.remove();
                            }, 300)
                        }, 500)
                        document.querySelector(".body__inner").append(copiedAlert)
                    });
                });

                delName.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete the name '" + nameLabel.innerText + "'?")) {
                        console.log("deleted name: " + nameLabel.innerText);
                        nameDiv.remove();
                        savedNames = savedNames.filter((n) => n !== nameLabel.innerText);
                        modSettings.savedNames = savedNames;
                        updateStorage();
                    }
                });

                nameDiv.appendChild(nameLabel);
                nameDiv.appendChild(delName);
                return nameDiv;
            };

            saveNameBtn.addEventListener("click", () => {
                if (saveNameInput.value == "") {
                    console.log("empty name");
                } else {
                    setTimeout(() => {
                        saveNameInput.value = "";
                    }, 10);

                    if (savedNames.includes(saveNameInput.value)) {
                        console.log("You already have this name saved!");
                        return;
                    }

                    let nameDiv = createNameDiv(saveNameInput.value);
                    savedNamesOutput.appendChild(nameDiv);

                    savedNames.push(saveNameInput.value);
                    modSettings.savedNames = savedNames;
                    updateStorage();
                }
            });

            if (savedNames.length > 0) {
                savedNames.forEach((name) => {
                    let nameDiv = createNameDiv(name);
                    savedNamesOutput.appendChild(nameDiv);
                });
            }
        },

        Macros() {
            const KEY_SPLIT = this.splitKey;
            let ff = null;
            let keydown = false;
            let open = false;
            const canvas = document.getElementById("canvas");
            const freezeType = document.getElementById("freezeType");
            let freezeKeyPressed = false;
            let freezeMouseClicked = false;
            let freezeOverlay = null;


            freezeType.value = modSettings.freezeType;
            freezeType.addEventListener("change", () => {
                modSettings.freezeType = freezeType.value;
                updateStorage();
            });

            var mfeeding = false;

            function fastMass() {
                mfeeding = true;
                let x = 15;
                while (x--) {
                    keypress("w", "KeyW");
                }
            }

            // SPLITS

            function split() {
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
            }

            function split2() {
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
            }

            function split3() {
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
            }

            function split4() {
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
            }

            function freezePlayer(type, mouse) {
                if(freezeType.value === "hold" && type === "hold") {
                    const CX = canvas.width / 2;
                    const CY = canvas.height / 2;

                    emitMouse(CX, CY);
                } else if(freezeType.value === "press" && type === "press") {
                    if(!freezeKeyPressed) {
                        const CX = canvas.width / 2;
                        const CY = canvas.height / 2;

                        emitMouse(CX, CY);


                        freezeOverlay = document.createElement("div");
                        freezeOverlay.innerHTML = `
                                <span style="position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); color: #fff; font-size: 26px; user-select: none;">Movement Stopped</span>
                            `;
                        freezeOverlay.style = "position: absolute; top: 0; left: 0; z-index: 99; width: 100%; height: 100vh; overflow: hidden;";

                        if(mouse && modSettings.m1 === "freeze" || modSettings.m2 === "freeze") {
                            freezeOverlay.addEventListener("click", () => {
                                if(freezeOverlay != null) freezeOverlay.remove();
                                freezeOverlay = null;
                                freezeKeyPressed = false;
                            });
                            freezeOverlay.addEventListener("contextmenu", (e) => {
                                e.preventDefault();
                                if(freezeOverlay != null) freezeOverlay.remove();
                                freezeOverlay = null;
                                freezeKeyPressed = false;
                            });
                        }

                        document.querySelector(".body__inner").append(freezeOverlay)

                        freezeKeyPressed = true;
                    } else {
                        if(freezeOverlay != null) freezeOverlay.remove();
                        freezeOverlay = null;
                        freezeKeyPressed = false;
                    }
                }
            }

            // KEYS:

            document.addEventListener("keyup", (e) => {
                if (e.key == modSettings.keyBindingsRapidFeed && keydown) {
                    clearInterval(ff);
                    keydown = false;
                }
            });
            document.addEventListener("keydown", (e) => {
                if (document.activeElement instanceof HTMLInputElement) return;

                if (e.key == "Tab") {
                    e.preventDefault();
                }

                if (e.key == modSettings.keyBindingsToggleMenu) {
                    if (!open) {
                        _cm_settings_open();
                        open = true;
                    } else {
                        document.querySelector("#cm_close__settings").click();
                        open = false;
                    }
                }

                if (e.key === modSettings.keyBindingsSwitchChat) {
                    if (modSettings.showClientChat) {
                        document.getElementById("mainBtn").click();
                    } else {
                        document.getElementById("partyBtn").click();
                    }
                }

                if (e.key == modSettings.keyBindingsFreezePlayer) {
                    freezePlayer(modSettings.freezeType, false);
                }

                if (e.key == modSettings.keyBindingsRapidFeed && !keydown) {
                    keydown = true;
                    ff = setInterval(fastMass, 50);
                }
                if (e.key == modSettings.keyBindingsdoubleSplit) {
                    split2();
                }

                if (e.key == modSettings.keyBindingsTripleSplit) {
                    split3();
                }

                if (e.key == modSettings.keyBindingsQuadSplit) {
                    split4();
                }
            });

            // MOUSE: (INFO: Fast feed for right mouse button [m2] does not work because it can't clear the interval when mouse is up on right mouse button)

            let mouseFastFeed;

            canvas.addEventListener("mousedown", () => {
                if(modSettings.m1 === "fastfeed") {
                    if (!mfeeding) {
                        mouseFastFeed = setInterval(fastMass, 15);
                    } else {
                        clearInterval(mouseFastFeed);
                    }
                } else if(modSettings.m1 === "split1") {
                    split();
                } else if(modSettings.m1 === "split2") {
                    split2();
                } else if(modSettings.m1 === "split3") {
                    split3();
                } else if(modSettings.m1 === "split4") {
                    split4();
                } else if(modSettings.m1 === "freeze") {
                    freezePlayer(modSettings.freezeType, true);
                }
            });

            canvas.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if(modSettings.m1 === "fastfeed") {
                    clearInterval(mouseFastFeed);
                }

                if(modSettings.m2 === "split1") {
                    split();
                } else if(modSettings.m2 === "split2") {
                    split2();
                } else if(modSettings.m2 === "split3") {
                    split3();
                } else if(modSettings.m2 === "split4") {
                    split4();
                } else if(modSettings.m2 === "freeze") {
                    freezePlayer(modSettings.freezeType, true);
                }
            });

            canvas.addEventListener("mouseup", () => {
                mfeeding = false;
                clearInterval(mouseFastFeed);
            });

            const m1_macroSelect = document.getElementById("m1_macroSelect");
            const m2_macroSelect = document.getElementById("m2_macroSelect");

            m1_macroSelect.value = modSettings.m1 || "none";
            m2_macroSelect.value = modSettings.m2 || "none";

            m1_macroSelect.addEventListener("change", () => {
                const selectedOption = m1_macroSelect.value;

                const optionActions = {
                    "none": () => {
                        modSettings.m1 = null;
                        updateStorage();
                    },
                    "fastfeed": () => {
                        modSettings.m1 = "fastfeed";
                        updateStorage();
                    },
                    "split": () => {
                        modSettings.m1 = "split";
                        updateStorage();
                    },
                    "split2": () => {
                        modSettings.m1 = "split2";
                        updateStorage();
                    },
                    "split3": () => {
                        modSettings.m1 = "split3";
                        updateStorage();
                    },
                    "split4": () => {
                        modSettings.m1 = "split4";
                        updateStorage();
                    },
                    "freeze": () => {
                        modSettings.m1 = "freeze";
                        updateStorage();
                    },
                };

                if (optionActions[selectedOption]) {
                    optionActions[selectedOption]();
                }
            });

            m2_macroSelect.addEventListener("change", () => {
                const selectedOption = m2_macroSelect.value;

                const optionActions = {
                    "none": () => {
                        modSettings.m2 = null;
                        updateStorage();
                    },
                    "fastfeed": () => {
                        modSettings.m2 = "fastfeed";
                        updateStorage();
                    },
                    "split": () => {
                        modSettings.m2 = "split";
                        updateStorage();
                    },
                    "split2": () => {
                        modSettings.m2 = "split2";
                        updateStorage();
                    },
                    "split3": () => {
                        modSettings.m2 = "split3";
                        updateStorage();
                    },
                    "split4": () => {
                        modSettings.m2 = "split4";
                        updateStorage();
                    },
                    "freeze": () => {
                        modSettings.m2 = "freeze";
                        updateStorage();
                    },
                };

                if (optionActions[selectedOption]) {
                    optionActions[selectedOption]();
                }
            });

        },

        setInputActions() {
            const macroInputs = ["modinput1", "modinput2", "modinput3", "modinput4", "modinput5", "modinput6", "modinput7"];

            macroInputs.forEach((modkey) => {
                const modInput = document.getElementById(modkey);

                document.addEventListener("keydown", (event) => {
                    if (document.activeElement !== modInput) return;

                    if (event.key === "Backspace") {
                        modInput.value = "";
                        let propertyName = modInput.name;
                        modSettings[propertyName] = "";
                        updateStorage();
                        return;
                    }

                    modInput.value = event.key.toLowerCase();

                    if (modInput.value !== "" && (macroInputs.filter((item) => item === modInput.value).length > 1 || macroInputs.some((otherKey) => {
                        const otherInput = document.getElementById(otherKey);
                        return otherInput !== modInput && otherInput.value === modInput.value;
                    }))) {
                        alert("You can't use 2 keybindings at the same time.");
                        setTimeout(() => {modInput.value = ""})
                        return;
                    }


                    let propertyName = modInput.name;
                    modSettings[propertyName] = modInput.value;

                    updateStorage();
                });
            });

        },

        mainMenu() {
            let menucontent = document.querySelector(".menu-center-content");
            menucontent.style.margin = "auto";

            const discordlinks = document.createElement("div");
            discordlinks.setAttribute("id", "dclinkdiv")
            discordlinks.innerHTML = `
                <a href="https://discord.gg/4j4Rc4dQTP" target="_blank" class="dclinks">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.4566 5.35132C21.7154 8.83814 22.8309 12.7712 22.4139 17.299C22.4121 17.3182 22.4026 17.3358 22.3876 17.3473C20.6771 18.666 19.0199 19.4663 17.3859 19.9971C17.3732 20.0011 17.3596 20.0009 17.347 19.9964C17.3344 19.992 17.3234 19.9835 17.3156 19.9721C16.9382 19.4207 16.5952 18.8393 16.2947 18.2287C16.2774 18.1928 16.2932 18.1495 16.3287 18.1353C16.8734 17.9198 17.3914 17.6615 17.8896 17.3557C17.9289 17.3316 17.9314 17.2725 17.8951 17.2442C17.7894 17.1617 17.6846 17.0751 17.5844 16.9885C17.5656 16.9725 17.5404 16.9693 17.5191 16.9801C14.2844 18.5484 10.7409 18.5484 7.46792 16.9801C7.44667 16.9701 7.42142 16.9735 7.40317 16.9893C7.30317 17.0759 7.19817 17.1617 7.09342 17.2442C7.05717 17.2725 7.06017 17.3316 7.09967 17.3557C7.59792 17.6557 8.11592 17.9198 8.65991 18.1363C8.69517 18.1505 8.71192 18.1928 8.69442 18.2287C8.40042 18.8401 8.05742 19.4215 7.67292 19.9729C7.65617 19.9952 7.62867 20.0055 7.60267 19.9971C5.97642 19.4663 4.31917 18.666 2.60868 17.3473C2.59443 17.3358 2.58418 17.3174 2.58268 17.2982C2.23418 13.3817 2.94442 9.41613 5.53717 5.35053C5.54342 5.33977 5.55292 5.33137 5.56392 5.32638C6.83967 4.71165 8.20642 4.25939 9.63491 4.00111C9.66091 3.99691 9.68691 4.00951 9.70041 4.03365C9.87691 4.36176 10.0787 4.78252 10.2152 5.12637C11.7209 4.88489 13.2502 4.88489 14.7874 5.12637C14.9239 4.78987 15.1187 4.36176 15.2944 4.03365C15.3007 4.02167 15.3104 4.01208 15.3221 4.00623C15.3339 4.00039 15.3471 3.99859 15.3599 4.00111C16.7892 4.26018 18.1559 4.71244 19.4306 5.32638C19.4419 5.33137 19.4511 5.33977 19.4566 5.35132ZM10.9807 12.798C10.9964 11.6401 10.1924 10.6821 9.18316 10.6821C8.18217 10.6821 7.38592 11.6317 7.38592 12.798C7.38592 13.9639 8.19792 14.9136 9.18316 14.9136C10.1844 14.9136 10.9807 13.9639 10.9807 12.798ZM17.6261 12.798C17.6419 11.6401 16.8379 10.6821 15.8289 10.6821C14.8277 10.6821 14.0314 11.6317 14.0314 12.798C14.0314 13.9639 14.8434 14.9136 15.8289 14.9136C16.8379 14.9136 17.6261 13.9639 17.6261 12.798Z" fill="white"></path>
                    </svg>
                    <span>Sigmally Discord</span>
                </a>
                <a href="https://discord.gg/gHmhpCaPfP" target="_blank" class="dclinks">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.4566 5.35132C21.7154 8.83814 22.8309 12.7712 22.4139 17.299C22.4121 17.3182 22.4026 17.3358 22.3876 17.3473C20.6771 18.666 19.0199 19.4663 17.3859 19.9971C17.3732 20.0011 17.3596 20.0009 17.347 19.9964C17.3344 19.992 17.3234 19.9835 17.3156 19.9721C16.9382 19.4207 16.5952 18.8393 16.2947 18.2287C16.2774 18.1928 16.2932 18.1495 16.3287 18.1353C16.8734 17.9198 17.3914 17.6615 17.8896 17.3557C17.9289 17.3316 17.9314 17.2725 17.8951 17.2442C17.7894 17.1617 17.6846 17.0751 17.5844 16.9885C17.5656 16.9725 17.5404 16.9693 17.5191 16.9801C14.2844 18.5484 10.7409 18.5484 7.46792 16.9801C7.44667 16.9701 7.42142 16.9735 7.40317 16.9893C7.30317 17.0759 7.19817 17.1617 7.09342 17.2442C7.05717 17.2725 7.06017 17.3316 7.09967 17.3557C7.59792 17.6557 8.11592 17.9198 8.65991 18.1363C8.69517 18.1505 8.71192 18.1928 8.69442 18.2287C8.40042 18.8401 8.05742 19.4215 7.67292 19.9729C7.65617 19.9952 7.62867 20.0055 7.60267 19.9971C5.97642 19.4663 4.31917 18.666 2.60868 17.3473C2.59443 17.3358 2.58418 17.3174 2.58268 17.2982C2.23418 13.3817 2.94442 9.41613 5.53717 5.35053C5.54342 5.33977 5.55292 5.33137 5.56392 5.32638C6.83967 4.71165 8.20642 4.25939 9.63491 4.00111C9.66091 3.99691 9.68691 4.00951 9.70041 4.03365C9.87691 4.36176 10.0787 4.78252 10.2152 5.12637C11.7209 4.88489 13.2502 4.88489 14.7874 5.12637C14.9239 4.78987 15.1187 4.36176 15.2944 4.03365C15.3007 4.02167 15.3104 4.01208 15.3221 4.00623C15.3339 4.00039 15.3471 3.99859 15.3599 4.00111C16.7892 4.26018 18.1559 4.71244 19.4306 5.32638C19.4419 5.33137 19.4511 5.33977 19.4566 5.35132ZM10.9807 12.798C10.9964 11.6401 10.1924 10.6821 9.18316 10.6821C8.18217 10.6821 7.38592 11.6317 7.38592 12.798C7.38592 13.9639 8.19792 14.9136 9.18316 14.9136C10.1844 14.9136 10.9807 13.9639 10.9807 12.798ZM17.6261 12.798C17.6419 11.6401 16.8379 10.6821 15.8289 10.6821C14.8277 10.6821 14.0314 11.6317 14.0314 12.798C14.0314 13.9639 14.8434 14.9136 15.8289 14.9136C16.8379 14.9136 17.6261 13.9639 17.6261 12.798Z" fill="white"></path>
                    </svg>
                    <span>SigModz Discord</span>
                </a>
                `;
            document.getElementById("discord_link").remove();
            document.getElementById("menu").appendChild(discordlinks)

            document.querySelector("#cm_modal__settings .ctrl-modal__modal").style.padding = "20px"
        },

        respawn() {
            const __line2 = document.getElementById("__line2")
            const c = document.getElementById("continue_button")
            const p = document.getElementById("play-btn")

            if (__line2.classList.contains("line--hidden")) return

            this.respawnTime = null

            setTimeout(() => {
                c.click()

                setTimeout(() => {
                    p.click()

                    this.respawnTime = Date.now()
                }, 200)
            }, 200)
        },

        donate() {
            const link = "https://Sigmally.sell.app/product/donation";

            modSettings.visits++;

            if (modSettings.visits % 5 === 0) {
                const Donate = document.createElement("div");
                Donate.classList.add("donate")
                Donate.innerHTML = `
                    <span class="text" style="text-align: center;">Donate to get a custom name color!</span>
                    <div style="margin-top: 5px;">
                        <button class="modButton" id="donateBtn" style="background: #3BE15E; width: 200px;">Donate</button>
                        <button class="modButton" id="closeDonate" style="background: #333;">Close</button>
                    </div>
                `;

                setTimeout(() => {
                    document.getElementById("closeDonate").addEventListener("click", () => {
                        Donate.remove();
                    });
                    document.getElementById("donateBtn").addEventListener("click", () => {
                        window.open(link);
                    })
                }, 10)

                document.body.append(Donate);
            }
        },
        createMenu() {
            this.smallMods();
            this.menu();
            this.donate();
            this.credits();

            const styleTag = document.createElement("style")
            styleTag.innerHTML = this.style;
            document.head.append(styleTag)

            setTimeout(() => {
                this.Macros();
                this.Themes();
                this.saveNames();
                this.setInputActions();
                this.getColors();
                this.setColors();
                this.mainMenu();
                this.macroSettings();

                setInterval(() => {
                    if (modSettings.AutoRespawn && this.respawnTime && Date.now() - this.respawnTime >= this.respawnCooldown) {
                        this.respawn();
                    }
                })
            })
        }
    }
    window.setInterval = new Proxy(setInterval, {
        apply(target, _this, args) {
            if (args[1] === (1000 / 7)) {
                args[1] = 0
            }

            return target.apply(_this, args)
        }
    });

    Math.delay = function(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms)
        })
    }
    const mods = new mod();
})();