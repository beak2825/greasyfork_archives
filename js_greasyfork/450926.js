// ==UserScript==
// @name         Platinmods Tweaks
// @namespace    https://platinmods.com/members/erucix.2957120/
// @version      4.3
// @description  Update your platinmods UI with this awesome buggy script
// @author       erucix
// @match        https://platinmods.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=platinmods.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450926/Platinmods%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/450926/Platinmods%20Tweaks.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var myProfileLink = getItem("profileLink") != "" ? getItem("profileLink") : "https://platinmods.com/members/erucix.2957120/"; // Replace with your current profile URL
    var spoofName = getItem("fakeUsername"); // Spoof id account number (Try to keep it correct)
    var spoofId = getItem("fakeId"); // Username to prevent your second id being identified (should not be your account here)
    var reloadCodeInterval = 300 // In milliseconds. Kepp less for slower cpu.
    var card_1 = "Fancy Hacker";
    var card_2 = "Beast Modder";
    var card_3 = "Elite Member";
    var card_4 = "VIP Bastard";
    var snowNumber = 20; // 0 for no snow
    var popupHtml = `<div class="modalPopup">
    <div class="popup"> <span class="header"> <span><span class="title">Platinmods Tweaks</span>&nbsp;<span
                    class="version">v4.0</span></span>
            <ion-icon name="close-outline" id="closePopup"></ion-icon>
        </span><br>
        <hr>
        <div class="popupBody"> <span class="settings">
                <center><i>(scroll for more)</i></center><br>

                <span class="list">
                    <span class="name">
                        <ion-icon name="id-card-outline"></ion-icon>Profile Link
                    </span>
                    <input type="text" id="profileLink" placeholder="Place your profile link here">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="person-outline"></ion-icon> Fake Name
                    </span>
                    <input type="text" id="fakeUsername" placeholder="Place fake username here">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="id-card-outline"></ion-icon> Fake Id
                    </span>
                    <input type="number" id="fakeId" placeholder="Place fake id here">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="shield-checkmark-outline"></ion-icon> Spoof Name
                    </span>
                    <input type="checkbox" id="spoofUsername">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="bulb-outline"></ion-icon> Neon Lightening - Navigations
                    </span>
                    <input type="checkbox" id="nNavigations">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="bulb-outline"></ion-icon> Neon Lightening - Blocks
                    </span>
                    <input type="checkbox" id="nBlocks">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="bag-add-outline"></ion-icon> Add Tooltip Badges
                    </span>
                    <input type="checkbox" id="addBadges">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="chatbox-outline"></ion-icon> Change Tooltip Pop-Up
                    </span>
                    <input type="checkbox" id="tooltipPop">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="arrow-down-circle-outline"></ion-icon> Reveal Download Links
                    </span>
                    <input type="checkbox" id="downloadLinks">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="snow-outline"></ion-icon> Add Snowfall Theme
                    </span>
                    <input type="checkbox" id="snowfallTheme">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="person-outline"></ion-icon> Fancy Username
                    </span>
                    <input type="checkbox" id="fancyUsername">
                </span>

                <span class="list">
                    <span class="name">
                        <ion-icon name="bulb-outline"></ion-icon> Neon Lightening - QucikLink
                    </span>
                    <input type="checkbox" id="nQuicklink">
                </span> <br><br>
            </span> </div>
        </div>
    </div>`
    var popupCss = `@import url(https://fonts.googleapis.com/css2?family=Raleway:wght@500&display=swap);

.modalPopup {
    font-size: 1.3rem;
    color: black;
    display: none;
    position: fixed;
    z-index: 1000000;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, .4)
}

.popup {
    position: absolute;
    top: 50%;
    left: 50%;
    -moz-transform: translateX(-50%) translateY(-70%);
    -webkit-transform: translateX(-50%) translateY(-70%);
    transform: translateX(-50%) translateY(-70%);
    z-index: 10000000;
    background-color: #fff;
    border-radius: 10px;
    padding: 2rem;
    height: 300px;
    width: 300px;
    overflow: hidden
}

.popupBody::-webkit-scrollbar {
    display: none
}

.popup * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Raleway, sans-serif
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between
}

.title {
    font-weight: bolder;
    font-size: larger
}

.version {
    font-size: smaller;
    font-weight: 900;
    color: #9acd32
}

.header ion-icon,
.settingIcon {
    text-deccoration: none;
    cursor: pointer;
    border-radius: 50%;
    color: black;
    background-color: #ffffff;
    font-size: 2.1rem;
    padding: .5rem;
    transition: transform .2s ease-out
}

.header ion-icon:hover,
.settingIcon:hover {
    transform: scale(1.2) rotate(90deg)
}

.popupBody {
    width: 100%;
    height: 100%;
    padding: 10px 10px 10px 0;
    display: flex;
    overflow-y: scroll;
    flex-direction: column
}

.popupBody .settings {
    display: flex;
    flex-direction: column
}

.settings .list {
    display: flex;
    width: 100%;
    justify-content: space-between;
    border-bottom: 1px solid grey;
    padding: 4px 0;
}

.list .name {
    display: flex;
    align-items: center
}

.list ion-icon {
    padding: .5rem;
    font-size: 2rem
}

.popup input[type=text] {
    margin-top: 10px;
    width: 170px;
    height: 20px;
    outline: 0
    }

@keyframes hue {

    0%,
    100% {
        filter: hue-rotate(0deg);
    }

    50% {
        filter: hue-rotate(360deg);
    }
}

.menu-content:before {
    content: '';
    background: linear-gradient(70deg, #2ff252 0%, #00bdff 100%);
    left: 0;
    right: 0;
    top: 0;
    height: 4px;
    display: block;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    position: absolute;
}

.snow {
    z-index: 10000000000000;
}

@keyframes fall {
    0% {
        transform: translateY(-100px)
    }

    100% {
        transform: translateY(calc(100vh + 100px))
    }
}`


    /* ----------DO_NOT_TOUCH_HERE----------*/


    function injectCss(code) {
        let styleScript = document.createElement("style");
        styleScript.innerHTML = code;
        document.head.appendChild(styleScript)
    }

    function injectHtml(code) {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = code;
        document.body.appendChild(tempDiv)
    }

    function setItem(cname, value, exp = 50) {
        localStorage.setItem(cname, value);
    }

    function getItem(cname) {
        return localStorage.getItem(cname);
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function spoofUser() {
        let encodedCookie = encodeURIComponent('{"' + spoofId + '":"' + spoofName + '"}')
        setCookie("EWRmember_mad", encodedCookie, 100);
    }

    function changeQuickSearch() {
        let container = document.querySelectorAll(".quicksearch");
        let inputBar = document.querySelectorAll(".quicksearch input");
        container.forEach((node, index) => {
            Object.assign(node.style, {
                width: "100%",
                borderRadius: "5px"
            })
        })
        inputBar.forEach((node, index) => {
            if (!node.classList.contains("injected")) {
                Object.assign(node.style, {
                    width: "100%",
                    backgroundColor: "rgba(110, 82, 204, 0.2)",
                    borderRadius: "5px",
                    border: "2px solid rgb(255,255,255)",
                    //animation: "hue 8s linear infinite",
                    boxShadow: "0 0 10px tomato,0 0 10px tomato,0 0 10px tomato inset",
                    padding: "10px",
                    fontSize: "20px",
                    color: "white"
                })
            }
        })

    }

    function changeNavbar() {
        let navBar = document.querySelectorAll(".p-nav");
        navBar.forEach((node, index) => {
            if (!node.classList.contains("injected")) {
                Object.assign(node.style, {
                    width: "100%",
                    backgroundColor: "rgba(110, 82, 204, 0.2)",
                    //  borderRadius: "10px",
                    border: "2px solid rgb(255,255,255)",
                    animation: "hue 8s linear infinite",
                    boxShadow: "0 0 20px tomato,0 0 10px tomato,0 0 30px tomato inset",
                    backdropFilter: "blur(10px)"
                })
                node.classList.add("injected");
            }
        })

        let navBarSecond = document.querySelectorAll(".p-sectionLinks");
        navBarSecond.forEach((node, index) => {
            if (!node.classList.contains("injected")) {
                Object.assign(node.style, {
                    width: "100%",
                    backgroundColor: "rgba(110, 82, 204, 0.2)",
                    //  borderRadius: "10px",
                    borderBottom: "2px solid rgb(255,255,255)",
                    animation: "hue 8s linear infinite",
                    backdropFilter: "blur(10px)"
                    //  boxShadow: "0 0 20px tomato,0 0 10px tomato,0 0 30px tomato inset",
                })
                node.classList.add("injected");
            }
        })
    }

    function changeTooltip() {
        let tooltipContainer = document.querySelectorAll(".tooltip-content");
        let tooltipHeader = document.querySelectorAll(".memberTooltip-header");
        tooltipContainer.forEach((node, index) => {
            if (!node.classList.contains("injected")) {
                Object.assign(node.style, {
                    borderRadius: "10px",
                    border: "2px solid rgb(255,255,255)",
                    boxShadow: "0 0 20px rgb(110, 82, 204),0 0 10px rgb(110, 82, 204),0 0 30px rgb(144, 85, 221) inset, 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                    padding: "10px",
                    overflow: "hidden",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: 'url("https://i0.wp.com/wallpapersfortech.com/wp-content/uploads/2022/04/HEROSCREEN.CC-13042022-RED-BLOCKS@3x.png")',
                    backdropFilter: "blur(4px)"
                })
                node.classList.add("injected");
            }
        })
        tooltipHeader.forEach((node, index) => {
            if (!node.classList.contains("injected")) {
                node.style.backgroundColor = "transparent";
                node.classList.add("injected");
            }
        })
    }

    function changeTooltipBadges() {
        let tooltipName = document.querySelectorAll(".memberTooltip-name");
        tooltipName.forEach((node, index) => {
            if ((node.innerHTML.toString().includes(myProfileLink.substr(myProfileLink.indexOf(".com/") + 4)) || node.innerHTML.toString().includes("erucix")) && !tooltipName[index].classList.contains("injected")) {
                let tooltip = document.createElement("div");
                tooltip.innerHTML = `<div class="memberTooltip-banners">
						        <em class="userBanner userBanner--staff" dir="auto"><span class="userBanner-before"></span><strong>${card_1}</strong><span class="userBanner-after"></span></em>
                                <em class="userBanner userBanner userBanner--skyBlue"><span class="userBanner-before"></span><strong>${card_2}</strong><span class="userBanner-after"></span></em>
                                <em class="userBanner userBanner userBanner--red"><span class="userBanner-before"></span><strong>${card_3}</strong><span class="userBanner-after"></span></em>
                                <em class="userBanner userBanner userBanner--yellow"><span class="userBanner-before"></span><strong>${card_4}</strong><span class="userBanner-after"></span></em>
            					</div>`
                tooltipName[index].after(tooltip)
                tooltipName[index].classList.add("injected");
            }
        });
    }

    function changeBlock() {
        let block = document.querySelectorAll("ul.block-body");
        let chat = document.querySelectorAll("#siropuChat");
        let chatNotice = document.getElementById("siropuChatNotice");
        block.forEach((node, index) => {
            let random = 0 //Math.random()*5;
            if (!node.classList.contains("injected")) {
                Object.assign(node.style, {
                    backgroundColor: "rgba(110, 82, 204, 0.2)",
                    borderRadius: "10px",
                    border: "2px solid rgb(255,255,255)",
                    animation: "hue 8s linear infinite",
                    boxShadow: "0 0 20px rgb(110, 82, 204),0 0 10px rgb(110, 82, 204),0 0 30px rgb(144, 85, 221) inset",
                    padding: "10px"
                })
                node.classList.add("injected");
            }
        })
    }

    function changeUsername() {
        let a = document.querySelectorAll(".username ");
        a.forEach((node, index) => {
            if ((node.href == myProfileLink || node.href == "https://platinmods.com/members/erucix.2957120/") && !node.classList.contains("username--style24") && !node.classList.contains("username--staff")) {
                node.classList.add("username--style24", "username--staff");
            }
        })
    }

    function changeMenuPopups() {
        console.log("HELLO")
        let popup = document.querySelectorAll(".menu--structural");
        popup.forEach((node, index) => {
            if (!node.classList.contains("injected")) {
                Object.assign(node.style, {
                    borderRadius: "10px",
                    border: "2px solid rgb(255,255,255)",
                    boxShadow: "0 0 20px rgb(110, 82, 204),0 0 10px rgb(110, 82, 204),0 0 30px rgb(144, 85, 221) inset, 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                    padding: "10px",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                    //  height: "450px",
                    //    padding: "0px",
                    //  margin: "10px"
                })
            }
        })
    }

    function applySnowfall() {
        function spawnSnow() {
            let snow = document.createElement("div");
            let radius = Math.floor((Math.random() * 10)) + "px";
            let posX = Math.floor(Math.random() * window.innerWidth) + "px";
            let posY = Math.floor(Math.random() * window.innerHeight) + "px";
            Object.assign(snow.style, {
                height: radius,
                position: "fixed",
                left: posX,
                width: radius,
                animation: "fall 10s linear infinite",
                borderRadius: "50%",
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,1) 20%, rgba(255,255,255,${Math.random() - .3}) 80%)`,
                animationDelay: Math.random() * - 20 + "s",
                animationDuration: 2 + (Math.random() * 40) + "s"
            })
            snow.setAttribute("class", "snow");
            let topMostPart = document.querySelectorAll(".p-pageWrapper")[0];
            topMostPart.appendChild(snow);
        }
        for (let i = 0; i <= snowNumber; i++) {
            spawnSnow();
        }
    }

    function applyDownload() {
        if (location.href.includes("threads") && (document.body.innerHTML.includes("Free Download") || document.body.innerHTML.includes("*Special Features*"))) {
            console.log("Download thread detected.")
            let allAnchorTags = document.querySelectorAll(".actionBar-set a");
            let found = false;
            allAnchorTags.forEach((node) => {
                if (node.href.includes("react?reaction") && !found) {
                    allAnchorTags = node;
                    found = true;
                }
            })
            allAnchorTags.classList.contains("has-reaction") || allAnchorTags.click();

            var urls = [];

            setTimeout(function () {
                console.log("Line 245 Timeout Started")

                let hiddenContent = document.querySelectorAll(".bbCodeBlock-content");

                hiddenContent.forEach((node, index) => {
                    console.log("Line 250 For Each started")
                    let nodeHtml = node.innerHTML;
                    node = nodeHtml.toString();
                    console.log(node)
                    console.log(!node.includes("https://platinmods.com/register/"), node.includes("https://"), node.includes("threads"))
                    if ((!node.includes("https://platinmods.com/register/") && node.includes("https://")) || node.includes("threads")) {
                        console.log("Line 254 if started")
                        allAnchorTags.classList.contains("has-reaction") && allAnchorTags.click();
                        urls = node.match(/\bhttps?:\/\/\S+/gi);
                        //  node.classList.add("injected");
                        console.log(urls)
                        let downloadHoldingTemplate = document.querySelectorAll(".uix_messageContent")[0];
                        let buttonDiv = document.createElement("div")
                        console.log(urls)
                        var buttons = "";
                        for (let i = 0; i < urls.length; i++) {
                            buttons += `<a href="${urls[i]}" title="${urls[i]}" class="button--cta uix_quickReply--button button button--icon button--icon--download rippleButton"><span class="button-text">Download Link ${i + 1}</span><div class="ripple-container"></div></a><br><br>`;
                        }
                        console.log(buttons)
                        buttonDiv.innerHTML = buttons;
                        downloadHoldingTemplate.prepend(buttonDiv);
                        setInterval(function () { document.querySelectorAll(".bbCodeBlock-content")[index].innerHTML = node; allAnchorTags.classList.contains("has-reaction") && allAnchorTags.click(); }, 300);
                    }
                })
            }, 2000)
            //    setInterval(function(){document.querySelectorAll(".bbCodeBlock-content")[index].innerHTML = globalNode;console.log(globalNode)}, 100);


        }
    }

    function libLoadIonicon() {
        let script = document.createElement("script");
        script.src = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
        script.setAttribute("type", "module")
        document.head.appendChild(script);
        script.removeAttribute("type", "module");
        script.src = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";
        script.setAttribute("nomodule", "")
        document.head.appendChild(script);
    }

    function libAttatchSetting() {
        let liLists = document.querySelectorAll(".p-navgroup--member")[0];
        let modal = document.getElementsByClassName("modalPopup")[0];
        let settingIcon = document.createElement("ion-icon");
        settingIcon.classList.add("settingIcon")
        settingIcon.setAttribute("name", "settings-outline") //<ion-icon name="settings-outline"></ion-icon>
        liLists.appendChild(settingIcon);

        document.getElementsByClassName("settingIcon")[0].onclick = function () {
            modal.style.display = "block";
        }

        document.getElementById("closePopup").onclick = function () {
            modal.style.display = "none";
        }
    }

    //  (myProfileLink.includes("erucix")) && console.log("%c You haven't added your profile link in the code",'font-size:20px')

    injectHtml(popupHtml)
    injectCss(popupCss);

    window.onload = function () {

        libLoadIonicon();

        libAttatchSetting();

        var input_profileLink = document.getElementById("profileLink");
        var input_fakeUsername = document.getElementById("fakeUsername");
        var input_fakeId = document.getElementById("fakeId");
        var checkbox_spoofUsername = document.getElementById("spoofUsername");
        var checkbox_nNavigations = document.getElementById("nNavigations");
        var checkbox_nBlocks = document.getElementById("nBlocks");
        var checkbox_addBadges = document.getElementById("addBadges");
        var checkbox_tooltipPop = document.getElementById("tooltipPop");
        var checkbox_downloadLinks = document.getElementById("downloadLinks");
        var checkbox_snowfallTheme = document.getElementById("snowfallTheme");
        var checkbox_fancyUsername = document.getElementById("fancyUsername");
        var checkbox_nQuicklink = document.getElementById("nQuicklink");

        input_profileLink.value = getItem("profileLink");
        input_fakeUsername.value = getItem("fakeUsername");
        input_fakeId.value = getItem("fakeId");
        checkbox_spoofUsername.checked = getItem("spoofUsername") == "true" ? true : false;
        checkbox_nNavigations.checked = getItem("nNavigations") == "true" ? true : false;
        checkbox_nBlocks.checked = getItem("nBlocks") == "true" ? true : false;
        checkbox_addBadges.checked = getItem("addBadges") == "true" ? true : false;
        checkbox_tooltipPop.checked = getItem("tooltipPop") == "true" ? true : false;
        checkbox_downloadLinks.checked = getItem("downloadLinks") == "true" ? true : false;
        checkbox_snowfallTheme.checked = getItem("snowfallTheme") == "true" ? true : false;
        checkbox_fancyUsername.checked = getItem("fancyUsername") == "true" ? true : false;
        checkbox_nQuicklink.checked = getItem("nQuicklink") == "true" ? true : false;

        getItem("spoofUsername") == "true" && spoofUser()
        getItem("nNavigations") == "true" && changeNavbar()
        getItem("nQuicklink") == "true" && changeQuickSearch()
        getItem("downloadLinks") == "true" && applyDownload()
        getItem("snowfallTheme") == "true" && applySnowfall()

        setInterval(function () {
            changeMenuPopups()
            getItem("nBlocks") == "true" && changeBlock()
            getItem("addBadges") == "true" && changeTooltipBadges()
            getItem("tooltipPop") == "true" && changeTooltip()
            getItem("fancyUsername") == "true" && changeUsername()
        }, reloadCodeInterval)

        var modal = document.getElementsByClassName("modalPopup")[0];

        document.getElementsByClassName("settingIcon")[0].onclick = function () {
            modal.style.display = "block";
        }

        document.getElementById("closePopup").onclick = function () {
            modal.style.display = "none";
            input_profileLink.value != "" && setItem("profileLink", input_profileLink.value)
            input_fakeUsername.value != "" && setItem("fakeUsername", input_fakeUsername.value) || setItem("fakeUsername", "g-bo")
            if (input_fakeId.value != "") { setItem("fakeId", input_fakeId.value) } else { setItem("fakeId", "1") }
            setItem("spoofUsername", checkbox_spoofUsername.checked)
            setItem("nNavigations", checkbox_nNavigations.checked)
            setItem("nBlocks", checkbox_nBlocks.checked)
            setItem("addBadges", checkbox_addBadges.checked)
            setItem("tooltipPop", checkbox_tooltipPop.checked)
            setItem("downloadLinks", checkbox_downloadLinks.checked)
            setItem("snowfallTheme", checkbox_snowfallTheme.checked)
            setItem("nQuicklink", checkbox_nQuicklink.checked)
            setItem("fancyUsername", checkbox_fancyUsername.checked)
        }
    }

})();

