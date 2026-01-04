// ==UserScript==
// @name         BlacketUtils
// @namespace    https://blacket.org
// @version      1.0.7
// @description  A router for Blacket to improve loading times with a darker theme included!
// @author       Piotr
// @icon         https://blacket.org/content/logo.png
// @grant        none
// @match        https://blacket.org/*
// @downloadURL https://update.greasyfork.org/scripts/479145/BlacketUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/479145/BlacketUtils.meta.js
// ==/UserScript==

(async function() {
	'use strict';

    let wait = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };

while (!document.querySelector('a[href="/settings"]')) {
    await wait(250);
}

blacket.blacketUtils = {};

localStorage.blacketUtilsVersion = "1.0.0";

blacket.blacketUtils.variables = {
    "selectedPack": "",
    "autoOpeningLogs": {},
}

blacket.blacketUtils.functions = {
    SelectPack: (pack) => {
        blacket.blacketUtils.variables.selectedPack = pack;
        document.querySelector('#selectAPack').innerHTML = pack;
    },
    AutoOpen: () => {
        $("body").append(`<div class="arts__modal___VpEAD-camelCase">
            <div class="styles__container___3St5B-camelCase" style="height: 50%;
            max-width: 95%;
            width: 40%;">
            <div style="text-align: center;font-size: 2.083vw;color: white;width: 100%;">Auto Open v${localStorage.blacketUtilsVersion}</div>
            
            <div style="width: 100%; height: 57.5%; display: flex; align-items: center; justify-content: center; flex-direction: column; margin-top: 1.5vw; gap: 2.5vw; padding: 1vw 0; border-radius: 0.5vw; background: rgba(0,0,0,0.1);">
                <div class="styles__profileContainer___CSuIE-camelCase" style="margin: 0;
                width: fit-content;
                padding: 1.5vw 1.5vw 2vw 1.5vw;
                background: #242424;
                border-radius: 0.5vw;">
                    <p id="selectAPack" style="font-size: 1.75vw;">Select a Pack</p>
                    <div class="styles__profileDropdownMenu___2jUAA-camelCase" style="z-index: 100;">
                        ${Object.keys(blacket.packs).map(x => `
                        <div class="styles__profileDropdownOption___ljZXD-camelCase" onclick="blacket.blacketUtils.functions.SelectPack('${x}')">
                            ${x}
                        </div>
                        `).join("")} 
                    </div>
                </div>

                <input class="styles__input___2vJSW-camelCase" style="width: 40%; border-radius: 5px; text-align: center;" id="packOpenAmount" placeholder="Amount to Open" />
            </div>

            <div onclick="blacket.blacketUtils.functions.StartPackOpening();" style="position: absolute; width: calc(100% - 1vw); bottom: 1vw;" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #4a4a4a;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #595959;">Start Opener</div></div>

            <div id="closeButton" style="top: 1vw;right: 0.8vw;position: absolute; z-index: 15;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #1f1f1f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #1f1f1f;"><i class="fas fa-times" aria-hidden="true"></i></div><div></div></div></div>`);
        $("#closeButton").click(() => {
            $(".arts__modal___VpEAD-camelCase").remove();
        });
    },
    StartPackOpening: async () => {
        let opening = true;
        blacket.blacketUtils.variables.autoOpeningLogs = {};
        let amount = parseInt($("#packOpenAmount").val());
        $(".arts__modal___VpEAD-camelCase").remove();
        if ($("#logOutputPack").innerHTML) return alert("Please close the current auto opener before starting a new one.");
        if (!amount) return alert("Please enter a valid amount to open.");
        if (!blacket.blacketUtils.variables.selectedPack) return alert("Please select a pack to open.");
        $("html").append(`<div style="position: fixed; text-shadow: none; bottom: 0; right: 0; background: #3f3f3f; padding: 0.5vw; border-top-left-radius: 0.2vw; z-index: 100; color: white; display: flex; flex-direction: column; width: 15vw; height: 30vh; overflow-y: auto; text-align: center;" id="logOutputPack">
            <div id="stopautoopener" style="position: fixed; bottom: 0; right: 0; padding: 0.4vw; border-top-left-radius: 0.2vw; background: black; cursor: pointer;">❌</div>
            <h2 style="font-family: Titan One; text-shadow: none; font-weight: 100; text-decoration: underline;" id="logs-autoopen-info">Logs</h2>
        </div>`);
        blacket.packs[blacket.blacketUtils.variables.selectedPack].blooks.forEach(async (blook) => {
            blacket.blacketUtils.variables.autoOpeningLogs[blook] = 0;
            $("#logOutputPack").append(`<div style="display: flex; gap: 1vw; align-items: center;">
                <img style="height: 2vw; width: auto;" src="${blacket.blooks[blook].image}" />
                <p id="open${blook.replaceAll(' ', '-')}auto" style="color: ${blacket.rarities[blacket.blooks[blook].rarity].color}">${blook} (${blacket.blacketUtils.variables.autoOpeningLogs[blook].toLocaleString()}x)</p>
            </div>`);
        });
        $('#stopautoopener').click(() => {
            opening = false;
            $('#logOutputPack').remove();
        });
        for (let i = 0; i < amount; i++) {
            if (!opening) return;
            await blacket.requests.post('/worker/open', {"pack":blacket.blacketUtils.variables.selectedPack}, (data) => {
                console.log(data)
                if (!data.error) {
                    blacket.user.tokens -= blacket.packs[blacket.blacketUtils.variables.selectedPack].price;
                    try {$("#tokenBalance > div").html(`${blacket.user.tokens.toLocaleString()}`)} catch {}
                    blacket.blacketUtils.variables.autoOpeningLogs[data.blook] = blacket.blacketUtils.variables.autoOpeningLogs[data.blook] + 1;
                    if (!blacket.user.blooks[data.blook]) blacket.user.blooks[data.blook] = 1;
                    else blacket.user.blooks[data.blook] += 1;
                    console.log(data.blook);
                    document.getElementById(`open${data.blook.replaceAll(' ', '-')}auto`).innerHTML = `${data.blook} (${blacket.blacketUtils.variables.autoOpeningLogs[data.blook].toLocaleString()}x)`
                }
                $("#logs-autoopen-info").html(`Logs (${(i + 1).toLocaleString()}/${amount.toLocaleString()})`);
            })
            await wait(1100);
        }
    },
}

blacket.blacketUtils.sidebar = `<div class="styles__sidebar___1XqWi-camelCase" style="background-color: #212121">
        <a href="/" id="big-name" class="styles__blooketText___1pMBG-camelCase">Blacket</a>
        <div class="styles__leftRow___4jCaB-camelCase"><a class="styles__pageButton___1wFuu-camelCase" href="/stats"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-chart-column" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Stats</div>
            </a><a class="styles__pageButton___1wFuu-camelCase" href="/leaderboard"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-trophy" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Leaderboard</div>
            </a><a id="pycsyivp" class="styles__pageButton___1wFuu-camelCase"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-comments" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Chat</div>
                <div id="chatNotificationIndicator" style="display: none;"
                    class="styles__chatNotificationIndicator___o0a2a-camelCase">0</div>
            </a><a class="styles__pageButton___1wFuu-camelCase" href="/clans"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-swords" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Clans</div>
            </a><a class="styles__pageButton___1wFuu-camelCase" href="/market"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-store" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Market</div>
            </a><a class="styles__pageButton___1wFuu-camelCase" href="/blooks"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-suitcase" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Blooks</div>
            </a><a class="styles__pageButton___1wFuu-camelCase" href="/bazaar"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-gavel" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Bazaar</div>
            </a><a class="styles__pageButton___1wFuu-camelCase" href="/inventory"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-box" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Inventory</div>
            </a><a class="styles__pageButton___1wFuu-camelCase" href="/settings"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-cog" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">Settings</div>
            </a><a id="hwyyknbi" class="styles__pageButton___1wFuu-camelCase"><i
                    class="styles__pageIcon___3OSy9-camelCase fas fa-newspaper" aria-hidden="true"></i>
                <div class="styles__pageText___1eo7q-camelCase">News</div>
            </a>
        </div>
        <div class="styles__bottomRow___3OozA-camelCase">
            <a data-tip="Credits" class="styles__smallButton___sQuq8-camelCase" href="/credits" currentitem="false"><i
                    class="styles__bottomIcon___3Fswk-camelCase fas fa-user" aria-hidden="true"></i></a><a
                data-tip="Discord" class="styles__smallButton___sQuq8-camelCase" href="/discord" currentitem="false"><i
                    class="styles__bottomIcon___3Fswk-camelCase fab fa-discord" aria-hidden="true"></i></a><a
                data-tip="GitHub" class="styles__smallButton___sQuq8-camelCase" href="https://github.com/XOTlC/Blacket"
                currentitem="false"><i class="styles__bottomIcon___3Fswk-camelCase fab fa-github"
                    aria-hidden="true"></i></a><a data-tip="YouTube" class="styles__smallButton___sQuq8-camelCase"
                href="https://www.youtube.com/channel/UCgiSMBsgq954SX5JT7_Lm2g" currentitem="false"><i
                    class="styles__bottomIcon___3Fswk-camelCase fab fa-youtube" aria-hidden="true"></i></a><a
                data-tip="Twitter" class="styles__smallButton___sQuq8-camelCase" href="https://twitter.com/XoticBlacket"
                currentitem="false"><i class="styles__bottomIcon___3Fswk-camelCase fab fa-x-twitter"
                    aria-hidden="true"></i></a>
        </div>
        <a class="styles__plusButton___2dH73-camelCase" href="/store"><i
                class="fas fa-dollar-sign styles__plusIcon___3DQkg-camelCase" aria-hidden="true"></i>Visit the Store</a>
    </div>`

blacket.blacketUtils.pages = {
    "stats": `
<div class="arts__profileBody___eNPbH-camelCase">
    <div class="styles__fullContainer___3Wl6C-camelCase">
        <div class="styles__headerRow___3mqZi-camelCase">
            <div class="styles__headerLeft___1Hu3N-camelCase">
                <div class="styles__headerLeftRow___8vTJL-camelCase">
                    <div class="styles__headerBlookContainer___36zY5-camelCase" role="button" tabindex="0">
                        <div class="styles__blookContainer___36LK2-camelCase styles__headerBlook___DdSHd-camelCase">
                        </div>
                    </div>
                    <div class="styles__headerInfo___1oWlb-camelCase">
                        <div class="styles__headerBanner___3Uuuk-camelCase">
                            <img loading="lazy" src="/content/banners/Default.png"
                                class="styles__headerBg___12ogR-camelCase" draggable="false">
                            <div class="styles__headerName___1GBcl-camelCase">username</div>
                            <div class="styles__headerTitle___24Ox2-camelCase">role</div>
                        </div>
                        <div class="styles__headerBadges___ffKa4-camelCase"
                            style="position: absolute;margin-left: 15.104vw;display: inline-block;padding: 0.130vw;">
                        </div>
                        <div class="styles__levelBarContainer___1xi-9-camelCase">
                            <div class="styles__levelBar___2SU0x-camelCase">
                                <div class="styles__levelBarInside___3FLAG-camelCase" style="transform: scaleX(0);">
                                </div>
                            </div>
                            <div class="styles__levelStarContainer___7ABEf-camelCase">
                                <img loading="lazy" src="/content/levelStar.png" alt="Star"
                                    class="styles__levelStar___LHq_y-camelCase" draggable="false">
                                <div class="styles__levelStarText___2Myxg-camelCase">0</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="styles__headerLeftButtons___3zGk0-camelCase" style="flex-flow: row;">
                    <a id="viewStatsButton"
                        class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase" role="button"
                        tabindex="0">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #eb6234;">
                        </div>
                        <div class="styles__front___vcvuy-camelCase" style="background-color: #eb6234;">
                            <div class="styles__headerButtonInside___26e_U-camelCase"><i
                                    class="styles__headerButtonIcon___1pOun-camelCase fas fa-search"
                                    aria-hidden="true"></i>View Stats</div>
                        </div>
                    </a>
                    <a id="tradeButton" class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase"
                        role="button" tabindex="0">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #01c774;">
                        </div>
                        <div class="styles__front___vcvuy-camelCase" style="background-color: #01c774;">
                            <div class="styles__headerButtonInside___26e_U-camelCase"><i
                                    class="styles__headerButtonIcon___1pOun-camelCase fas fa-handshake"
                                    aria-hidden="true"></i>Trade</div>
                        </div>
                    </a>
                    <a id="claimButton" class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase"
                        role="button" tabindex="0">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #00c20c;">
                        </div>
                        <div class="styles__front___vcvuy-camelCase" style="background-color: #00c20c;">
                            <div class="styles__headerButtonInside___26e_U-camelCase"><i aria-hidden="true"
                                    class="styles__headerButtonIcon___1pOun-camelCase fas fa-star"></i>Claim
                                Tokens</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div class="styles__bottomContainer___3kOrb-camelCase">
            <div class="styles__right___13qxc-camelCase">
                <div class="styles__statsContainer___QnrRB-camelCase">
                    <div class="styles__containerHeader___3xghM-camelCase">
                        <div class="styles__containerHeaderInside___2omQm-camelCase">Stats</div>
                    </div>
                    <div class="styles__topStats___3qffP-camelCase">
                        <div class="styles__statContainer___QKuOF-camelCase" currentitem="false">
                            <div class="styles__statTitle___z4wSV-camelCase">Tokens</div>
                            <div id="tokens" class="styles__statNum___5RYSd-camelCase">tokens</div>
                            <img loading="lazy" src="/content/tokenIcon.png" class="styles__tokenImg___a08fY-camelCase"
                                draggable="false">
                        </div>
                        <div class="styles__statContainer___QKuOF-camelCase" currentitem="false">
                            <div class="styles__statTitle___z4wSV-camelCase">Blooks Unlocked</div>
                            <div id="blooks" class="styles__statNum___5RYSd-camelCase">blooks</div>
                            <img loading="lazy" src="/content/unlockIcon.png" class="styles__statImg___3DBXt-camelCase"
                                draggable="false">
                        </div>
                        <div class="styles__statContainer___QKuOF-camelCase" currentitem="false">
                            <div class="styles__statTitle___z4wSV-camelCase">Packs Opened</div>
                            <div id="opened" class="styles__statNum___5RYSd-camelCase">opened</div>
                            <img loading="lazy" src="/content/openedIcon.png" class="styles__statImg___3DBXt-camelCase"
                                draggable="false">
                        </div>
                        <div class="styles__statContainer___QKuOF-camelCase" currentitem="false">
                            <div class="styles__statTitle___z4wSV-camelCase">Messages Sent</div>
                            <div id="messages" class="styles__statNum___5RYSd-camelCase">messages</div>
                            <img loading="lazy" src="/content/messagesIcon.png"
                                class="styles__statImg___3DBXt-camelCase" draggable="false">
                        </div>
                    </div>
                </div>
                <div class="styles__statsContainer___QnrRB-camelCase">
                    <div class="styles__containerHeader___3xghM-camelCase">
                        <div class="styles__containerHeaderInside___2omQm-camelCase">Friends</div>
                    </div>
                    <div id="requestsButton"
                        class="styles__containerHeaderRight___3xghM-camelCase styles__containerHeaderRightFriends___3xghM-camelCase">
                        <div class="styles__containerHeaderInside___2omQm-camelCase">Requests</div>
                        <div id="requestsNotificationIndicator" style="display: none;"
                            class="styles__notificationIndicator___4kvmA-camelCase">0</div>
                    </div>
                    <div class="styles__topStats___3qffP-camelCase" style="min-height: 3.229vw">
                        <div class="styles__friendsContainer___kRk3a-camelCase"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
    "leaderboard": `
<div class="arts__profileBody___eNPbH-camelCase">
                <div class="styles__fullContainer___3Wl6C-camelCase">
                    <div class="styles__bottomContainer___3kOrb-camelCase">
                        <div class="styles__statsContainer___QnrRB-camelCase" style="display: flex; justify-content: space-between; padding: 2vw;">
                            <div class="styles__containerHeader___3xghM-camelCase">
                                <div class="styles__containerHeaderInside___2omQm-camelCase">Tokens</div>
                            </div>
                            <div class="styles__containerHeaderRight___3xghM-camelCase">
                                <div class="styles__containerHeaderInside___2omQm-camelCase">EXP</div>
                            </div>
                            <div>
                                <div class="styles__topStats___3qffP-camelCase" style="text-align: center;font-size: 1.7vw;margin-top: 0.521vw;display:block;">
                                    Loading leaderboard, please wait...
                                </div>
                            </div>
                            <div>
                                <div class="styles__topStats___3qffP-camelCase" style="text-align: center;font-size: 1.7vw;margin-top: 0.521vw;display:block;">
                                    Loading leaderboard, please wait...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`,
    "blooks": `
    <div class="arts__profileBody___eNPbH-camelCase">
        <div class="styles__left___9beun-camelCase">
            <div class="styles__numRow___xh98F-camelCase">
                <input id="searchInput" autocomplete="off" style="border: none;height: 2.083vw;line-height: 2.083vw;font-size: 1.458vw;text-align: center;font-weight: 700;font-family: Nunito, sans-serif;color: #ffffff;background-color: #3f3f3f;outline: none;width: 100%;border-radius: 0.365vw;" placeholder="Search">
            </div>
            <div class="styles__blooksHolder___3qZR1-camelCase">
            </div>
        </div>
    </div>
    `,
    "bazaar": `<div class="arts__profileBody___eNPbH-camelCase" style="
    width: calc(100% - 11.458vw - 40px);
    height: calc(100% - 40px);
    padding: 20px;
">
<div>
                <div class="styles__topRightRow___dQvxc-camelCase">
                    <div id="tokenBalance" class="styles__tokenBalance___1FHgT-camelCase"><img loading="lazy"
                            src="/content/tokenIcon.png" class="styles__tokenBalanceIcon___3MGhs-camelCase"
                            draggable="false">tokens
                    </div>
                </div>
            </div>
    <div style="display: flex; align-items: center; gap: 3vw; margin: 0 0 1vh 0">
        <div class="styles__header___153FZ-camelCase" style="font-size: 2.4vw; margin: 0;">Bazaar</div>
        <div style="display: flex; align-items: center;">
            <input id="bazaarInput" style="border: none;
                        height: 2.604vw;
                        line-height: 2.083vw;
                        font-size: 1.458vw;
                        text-align: center;
                        font-weight: 700;
                        font-family: Nunito, sans-serif;
                        color: #ffffff;
                        background-color: #1c1c1c;
                        width: 18.5vw;
                        border-radius: 0.365vw;
                        outline: none;" placeholder="Search" value=""
                        oninput="this.value.length >= 4 ? blacket.getBazaar(this.value) : null"
            >
            <div id="clearBazaar" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__rightButton___2_ZIX-camelCase" style="position: relative; width: 7.2vw;">
                <div class="styles__shadow___3GMdH-camelCase"></div>
                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2c2c2c;"></div>
                    <div class="styles__front___vcvuy-camelCase" style="background-color: #2c2c2c;">
                        <div class="styles__rightButtonInside___14imT-camelCase" style="font-family: Nunito;">Clear
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex; gap: 2.5vw;">
            <div class="styles__bazaarItems___KmNa2-camelCase" style="height: 85vh; position: unset; display: flex;align-items: center;gap: 3vw;margin: 0 0 1vh 0; width: 70%;">
                <div class="styles__bazaarItemsContainer___GkAC2-camelCase" style="height: 95%; align-items: normal; align-content: flex-start; flex-wrap: wrap;">
                </div>
            </div>
            <div class="styles__bazaarItems___KmNa2-camelCase" style="height: 85vh; position: unset; display: flex;flex-direction: column; center;gap: 3vw;margin: 0 0 1vh 0; width: 30%;">
                <h2 style="
                    font-size: 1.8vw;
                    color: white;
                    text-align: center;
                    text-decoration: underline;
                    margin-bottom: -2.5vw;
                ">Your Listings</h2>
                <div id="myListings"></div>
            </div>
        </div>
    </div>
</div>`,
    "market": `
<div class="arts__profileBody___eNPbH-camelCase">
<div>
                <div class="styles__topRightRow___dQvxc-camelCase">
                    <div id="tokenBalance" class="styles__tokenBalance___1FHgT-camelCase"><img loading="lazy"
                            src="/content/tokenIcon.png" class="styles__tokenBalanceIcon___3MGhs-camelCase"
                            draggable="false">tokens
                    </div>
                </div>
            </div>
<div class="styles__header___153FZ-camelCase">Market</div>
<div style="margin: 0 0 0 5%; display: flex; gap: 0.8vw;">
    <button onclick="blacket.blacketUtils.functions.AutoOpen()" style="
    padding: 0.2vw 0.5vw;
    border-radius: 5px;
    background-color: #2f2f2f;
    border: none;
    color: white;
    filter: drop-shadow(0px 0px 3px white);
    font-size: 0.9vw;
    cursor: pointer;
    ">Auto Open</button>

    <div style="
    padding: 0.2vw 0.5vw;
    border-radius: 5px;
    background-color: #2f2f2f;
    border: none;
    color: white;
    position: unset;
    transform: none;
    height: unset;
    font-size: 0.9vw;
    filter: drop-shadow(0px 0px 3px white);" class="styles__instantButton___2ezEk-camelCase" role="button" tabindex="0">Instant Open: Off</div>
</div>
<div class="styles__storeContainer___FgOVv-camelCase"><img loading="lazy" src="/content/mark.png"
        alt="Mark the Cashier" class="styles__cashierBlook___iI1UH-camelCase" draggable="false"><img
        loading="lazy" src="/content/marketStore.png" alt="Store"
        class="styles__storeImg___2c3cG-camelCase" draggable="false">
</div>
<div class="styles__leftColumn___2MTgv-camelCase">
    <div class="styles__packsWrapper___2hBF4-camelCase">
    </div>
    <div class="styles__subheader___GVBz_-camelCase">Weekly Shop</div>
    <div id="weeklyShop" class="styles__itemShopWrapper___1N5wN-camelCase"></div>
    <div class="styles__subheader___GVBz_-camelCase">Item Shop</div>
    <div id="itemShop" class="styles__itemShopWrapper___1N5wN-camelCase">
        <div id="stealthDisguiseKitItemButton" class="styles__itemShopContainer___I6YST-camelCase"
            role="button" tabindex="0">
            <div class="styles__itemShopName___1-QhF-camelCase">Stealth Disguise Kit</div><img
                src="/content/items/Stealth Disguise Kit.png"
                class="styles__itemShopImage___318lh-camelCase" draggable="false">
            <div class="styles__itemShopBottom___2Xhbw-camelCase">
                <img src="/content/tokenIcon.png" class="styles__packPriceImg___1FaDF-camelCase">
                250,000
            </div>
        </div>
        <div id="fragmentGrenadeItemButton" class="styles__itemShopContainer___I6YST-camelCase"
            role="button" tabindex="0">
            <div class="styles__itemShopName___1-QhF-camelCase">Fragment Grenade</div><img
                src="/content/items/Fragment Grenade.png"
                class="styles__itemShopImage___318lh-camelCase" draggable="false">
            <div class="styles__itemShopBottom___2Xhbw-camelCase">
                <img src="/content/tokenIcon.png" class="styles__packPriceImg___1FaDF-camelCase">
                100,000
            </div>
        </div>
        <div id="clanShieldItemButton" class="styles__itemShopContainer___I6YST-camelCase" role="button"
            tabindex="0">
            <div class="styles__itemShopName___1-QhF-camelCase">Clan Shield</div><img
                src="/content/items/Clan Shield.png" class="styles__itemShopImage___318lh-camelCase"
                draggable="false">
            <div class="styles__itemShopBottom___2Xhbw-camelCase">
                <img src="/content/tokenIcon.png" class="styles__packPriceImg___1FaDF-camelCase">
                100,000
            </div>
        </div>
    </div>
</div>
</div>
`,
    "settings": `
<div class="arts__profileBody___eNPbH-camelCase">
                <div class="styles__header___WE435-camelCase">Settings</div>
                <div class="styles__mainContainer___4TLvi-camelCase">
                    <div class="styles__infoContainer___2uI-S-camelCase">
                        <div class="styles__headerRow___1tdPa-camelCase">
                            <i class="fas fa-user styles__headerIcon___1ykdN-camelCase" aria-hidden="true"></i>
                            <div class="styles__infoHeader___1lsZY-camelCase">Profile</div>
                        </div>
                        <div class="styles__text___1x37n-camelCase">
                            <b>Username:</b> <text>username</text>
                        </div>
                        <div class="styles__text___1x37n-camelCase">
                            <b>Role:</b> <text>role</text>
                        </div>
                        <div class="styles__text___1x37n-camelCase">
                            <b>Joined:</b> <text>created</text>
                        </div>
                    </div>
                    <div class="styles__infoContainer___2uI-S-camelCase">
                        <div class="styles__headerRow___1tdPa-camelCase">
                            <i class="fas fa-clipboard-list styles__headerIcon___1ykdN-camelCase" aria-hidden="true"></i>
                            <div class="styles__infoHeader___1lsZY-camelCase">Plan</div>
                        </div>
                        <div class="styles__subscriptionText___2BvF7-camelCase">
                            <div class="styles__blooketText___QMe9h-camelCase">name</div>
                            <div class="styles__planText___1m0nS-camelCase" style="color: #ffffff;">Basic
                            </div>
                        </div>
                        <a href="/store" style="text-decoration: none;">
                            </a><div class="styles__button___1_E-G-camelCase styles__upgradeButton___3UQMv-camelCase" role="button" tabindex="0"><a href="/store" style="text-decoration: none;">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #3052d6;">
                                </div>
                                <div class="styles__front___vcvuy-camelCase styles__upgradeButtonInside___396BT-camelCase" style="background-color: #3052d6;">Upgrade Now!</div>
                        </a>
                    </div>
                </div>
                <div class="styles__infoContainer___2uI-S-camelCase">
                    <div class="styles__headerRow___1tdPa-camelCase">
                        <i class="fas fa-pencil-alt styles__headerIcon___1ykdN-camelCase" aria-hidden="true"></i>
                        <div class="styles__infoHeader___1lsZY-camelCase">Edit Info</div>
                    </div>
                    <div>
                        <a id="changeUsernameButton" class="styles__link___5UR6_-camelCase">Change Username</a>
                    </div>
                    <div>
                        <a id="changePasswordButton" class="styles__link___5UR6_-camelCase">Change Password</a>
                    </div>
                    <div>
                        <a id="otpButton" class="styles__link___5UR6_-camelCase">Enable OTP / 2FA</a>
                    </div>
                </div>
                <div class="styles__infoContainer___2uI-S-camelCase">
                    <div class="styles__headerRow___1tdPa-camelCase">
                        <i class="fas fa-cog styles__headerIcon___1ykdN-camelCase" aria-hidden="true"></i>
                        <div class="styles__infoHeader___1lsZY-camelCase">General</div>
                    </div>
                    <div>
                        <a id="tradeRequestsButton" class="styles__link___5UR6_-camelCase">Trade Requests: requests</a>
                    </div>
                    <div>
                        <a id="friendRequestsButton" class="styles__link___5UR6_-camelCase">Friend Requests: friends</a>
                    </div>
                </div>
            </div>`,
    "inventory": `
            <div class="arts__profileBody___eNPbH-camelCase">
                <div class="styles__header___153FZ-camelCase">Inventory</div>
                <div class="styles__leftColumn___2MTgv-camelCase" style="width: 95%;">
                    <div class="styles__packsWrapper___2hBF4-camelCase">
                    </div>
                </div>
            </div>`,
            "my-clan": `
            <div>
            <div>
                <div class="styles__topRightRow___dQvxc-camelCase">
                    <div id="clanLeaveButton" style="
                    margin-top: 0.3vw;
                    margin-right: 0.35vw;
                " class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                        <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase"
                            style="background-color: #2f2f2f;"><i class="fas fa-door-open" aria-hidden="true"></i></div>
                    </div>
                    <div id="clanInvestmentsButton" class="styles__tokenBalance___1FHgT-camelCase"
                        style="cursor: pointer;">
                        <img loading="lazy" src="/content/tokenIconClan.png" alt="Token"
                            class="styles__tokenBalanceIcon___3MGhs-camelCase" draggable="false">
                        <div id="clanInvestments">investments</div>
                    </div>
                </div>
                <div class="styles__topLeftRow___49mfa-camelCase">
                    <div id="clanBackButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                        <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase"
                            style="background-color: #2f2f2f;"><i class="fas fa-reply" aria-hidden="true"></i></div>
                    </div>
                    <div id="clanSettingsButton"
                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase"
                        style="display: none;">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                        <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase"
                            style="background-color: #2f2f2f;"><i class="fas fa-cog" aria-hidden="true"></i></div>
                    </div>
                    <div id="clanRequestsButton"
                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase"
                        style="display: none;">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                        <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase"
                            style="background-color: #2f2f2f;"><i class="fas fa-memo-pad" aria-hidden="true"></i></div>
                    </div>
                </div>
            </div>
            <div class="styles__background___2J-JA-camelCase">
                <div class="styles__blooksBackground___3oQ7Y-camelCase"
                    style="background-image: url('/content/background.png');"></div>
            </div>
            <div id="clanMainBody" class="arts__profileBody___eNPbH-camelCase">
                <div class="styles__mainClanContainer___fWY9c-camelCase">
                    <div id="myclanName" class="styles__header___153FZ-camelCase" style="text-align: center;">name</div>
                    <div class="styles__clanBody___kJQZS-camelCase">
                        <div class="styles__leftClanContainer___3rfUA-camelCase">
                            <div id="clanShield" class="styles__clanContainers___8ZQ8c-camelCase">
                                <div class="styles__clanShield___49jVa-camelCase" style="transform: scale(1.25);"></div>
                                <div class="styles__clanShieldedText___4j89C-camelCase">shielded</div>
                            </div>
                            <div id="clanDisguise" class="styles__clanContainers___8ZQ8c-camelCase">
                                <img src="/content/icons/clans/disguised.png" style="width: 10vw;">
                                <div class="styles__clanDisguisedText___gj83a-camelCase">disguised</div>
                            </div>
                            <div id="clanInventoryButton" class="styles__clanContainers___8ZQ8c-camelCase"
                                style="cursor: pointer; transition: 0.2s">
                                <img src="/content/icons/clans/inventory.png" style="width: 10vw;">
                                <div class="styles__clanInventoryText___49mCa-camelCase">Inventory</div>
                            </div>
                            <style>
                                #clanInventoryButton:hover {
                                    transform: scale(0.95);
                                }
                            </style>
                        </div>
                        <div class="styles__rightClanContainer___m7Q8S-camelCase">
                            <div class="styles__clanTopCotainer___o9Q8S-camelCase">
                                <div style="padding: unset; background-color: unset; box-shadow: unset;"
                                    class="styles__clanInfoContainer___4Bx5z-camelCase">
                                    <a id="clanInformation" style="width: 100%; height: 100%; max-height: unset;"
                                        class="styles__clansDiscoveryClanContainer___cbA4a-camelCase">
                                        <div class="styles__clansDiscoveryClanImageFiller___vbA3a-camelCase"><img
                                                id="clanInformationImage" loading="lazy"
                                                class="styles__coverImage___3ahFy-camelCase" src=""></div>
                                        <div class="styles__clansDiscoveryClanTotalMembersContainer___hjvmA-camelCase">
                                            <div id="clanInformationMembers"
                                                class="styles__clansDiscoveryClanTotalMembersText___fjmCa-camelCase">
                                                members</div>
                                        </div>
                                        <div id="clanInformationName" style="color: #ffffff;"
                                            class="styles__clanDiscoveryClanName___gnV49-camelCase">name</div>
                                        <div id="clanInformationLevel"
                                            style="margin-left: 1.4vw; filter: unset; font-size: 1vw;"
                                            class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">level</div>
                                        <div id="clanInformationEXP" style="margin-left: 1.4vw"
                                            class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">exp</div>
                                        <div id="clanInformationDescription"
                                            class="styles__clanDiscoveryClanDescription___lkb3a-camelCase">description
                                        </div>
                                        <div class="styles__clanDiscoveryClanSpacer___49anv-camelCase"></div>
                                        <div style="margin: 0 4% 0.365vw;"
                                            class="styles__clanDiscoveryClanAuthorContainer___28amc-camelCase"><i
                                                class="styles__authorIcon___-Y2-E-camelCase fas fa-user"
                                                aria-hidden="true"></i>
                                            <div id="clanInformationOwner"
                                                class="styles__clanDiscoveryClanAuthorText___38NVa-camelCase">owner
                                            </div>
                                            <div id="clanInformationStatuses" style="left: 24vw;"
                                                class="styles__clanDiscoveryClanStatusesContainer___59mXC-camelCase">
                                                <div>
                                                    <div
                                                        class="styles__clanDiscoveryClanStatusOnline___fjm2a-camelCase">
                                                    </div> online
                                                </div>
                                                <div>
                                                    <div
                                                        class="styles__clanDiscoveryClanStatusOffline___fjm2a-camelCase">
                                                    </div> offline
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div id="clanMembers" class="styles__clanInfoContainer___4Bx5z-camelCase"
                                    style="gap: 0.25vw;">
                                    <div class="styles__clanMembersText___gk94a-camelCase">Clan Members</div>
                                    <div class="styles__clanMembersContainer___4j8Ca-camelCase"></div>
                                </div>
                            </div>
                            <div class="styles__clanBottomContainer__m7Q8S-camelCase">
                                <div style="animation: unset;" class="styles__clanBottomInfo___h7Q8S-camelCase">
                                    <div id="chatContainer" class="styles__chatContainer___iA8ZU-camelCase"
                                        style="overflow-y: scroll;height: 33vh;overflow-x: hidden;width: 68.5vw;">
                                    </div>
                                    <div style="position: absolute;bottom: 0;width: 70vw;left: 1.3vw;">
                                        <div class="styles__chatInputContainer___gkR4A-camelCase">
                                            <div style="display: none;"
                                                class="styles__chatUploadButton___g39Ac-camelCase">
                                                <i style="font-size: 1.563vw;" class="fas fa-upload"
                                                    aria-hidden="true"></i>
                                            </div>
                                            <textarea id="chatBox" class="styles__chatInputBox___fvMA4-camelCase"
                                                value="" placeholder="Message" rows="1"></textarea>
                                            <div class="styles__chatEmojiButton___8RFa2-camelCase">
                                                <i style="font-size: 1.563vw;" class="fas fa-smile"
                                                    aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display: none;"
                                        class="styles__chatEmojiPickerContainer___KR4aN-camelCase">
                                        <div class="styles__chatEmojiPickerHeader___FK4Ac-camelCase"><text
                                                style="margin-bottom: 0.521vw;">Emoji Picker</text></div>
                                        <div id="emojiPicker" class="styles__chatEmojiPickerBody___KR4aN-camelCase">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="clanInventoryBody" style="display: none;" class="arts__profileBody___eNPbH-camelCase">
                <div class="styles__header___153FZ-camelCase" style="text-align: center;">Clan Inventory</div>
                <div class="styles__leftColumn___2MTgv-camelCase" style="width: 95%;">
                    <div id="clanInventoryItems" class="styles__packsWrapper___2hBF4-camelCase">
                        <div id="clanInventoryAddItemButton" class="styles__packContainer___3RwSU-camelCase"
                            role="button" tabindex="0"
                            style="background: linear-gradient(320deg, #2f2f2f, #3f3f3f 50%, #2f2f2f); cursor: pointer;">
                            <div class="styles__packImgContainer___3NABW-camelCase"><img
                                    style="transform: translate(-50%, -50%);" loading="lazy"
                                    src="/content/items/Add.png" class="styles__packImg___3to1S-camelCase"
                                    draggable="false"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="clanSettingsBody" style="display: none;" class="arts__profileBody___eNPbH-camelCase">
                <div class="styles__header___WE435-camelCase" style="text-align: center;">Clan Settings</div>
                <div class="styles__mainContainer___4TLvi-camelCase">
                    <div class="styles__infoContainer___2uI-S-camelCase">
                        <div class="styles__headerRow___1tdPa-camelCase">
                            <i class="fas fa-pencil-alt styles__headerIcon___1ykdN-camelCase" aria-hidden="true"></i>
                            <div class="styles__infoHeader___1lsZY-camelCase">Edit Info</div>
                        </div>
                        <div>
                            <a id="clanSettingsChangeNameButton" class="styles__link___5UR6_-camelCase">Change Name</a>
                        </div>
                        <div>
                            <a id="clanSettingsChangeDescriptionButton" class="styles__link___5UR6_-camelCase">Change
                                Description</a>
                        </div>
                        <div>
                            <a id="clanSettingsChangeImageButton" class="styles__link___5UR6_-camelCase">Change
                                Image</a>
                        </div>
                        <div>
                            <a id="clanSettingsResetColorButton" class="styles__link___5UR6_-camelCase">Reset Color</a>
                        </div>
                    </div>
                    <div class="styles__infoContainer___2uI-S-camelCase">
                        <div class="styles__headerRow___1tdPa-camelCase">
                            <i class="fas fa-cog styles__headerIcon___1ykdN-camelCase" aria-hidden="true"></i>
                            <div class="styles__infoHeader___1lsZY-camelCase">General</div>
                        </div>
                        <div>
                            <a id="clanSettingsSafeModeButton" class="styles__link___5UR6_-camelCase">Safe Mode:
                                safe</a>
                        </div>
                        <div>
                            <a id="clanSettingsJoinRequestsButton" class="styles__link___5UR6_-camelCase">Join Requests:
                                requests</a>
                        </div>
                        <div>
                            <a id="clanSettingsTransferOwnershipButton" class="styles__link___5UR6_-camelCase">Transfer
                                Ownership</a>
                        </div>
                        <div>
                            <a id="clanSettingsDisbandClanButton" class="styles__link___5UR6_-camelCase">Disband
                                Clan</a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="clanRequestsBody" class="arts__profileBody___eNPbH-camelCase" style="display: none;">
                <div class="styles__header___WE435-camelCase" style="text-align: center;">Clan Requests</div>
                <div class="styles__subheaderRow___3pRLb-camelCase">
                    <div class="styles__subheader___26-hK-camelCase">Requests<span
                            class="styles__subheaderSmall___3vlET-camelCase">(Click to Accept or Reject)</span></div>
                </div>
                <div id="clanRequests" class="styles__membersHolder___20Rea-camelCase"></div>
            </div>
        </div>`,
        "clan-discover": `
        <div>
            <div>
                <div class="styles__topRightRow___dQvxc-camelCase">
                    <div id="pendingRequestsButton" style="margin-bottom: 0.182vw;margin-right: 0.521vw;" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                        <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #2f2f2f;"><i class="fas fa-memo-pad" aria-hidden="true"></i></div>
                    </div>
                    <div id="createClanButton" style="margin-bottom: 0.182vw;" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                        <div class="styles__shadow___3GMdH-camelCase"></div>
                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                        <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #2f2f2f;"><i class="fas fa-plus" aria-hidden="true"></i></div>
                    </div>
                </div>
            </div>
            <div class="styles__background___2J-JA-camelCase">
                <div class="styles__blooksBackground___3oQ7Y-camelCase" style="background-image: url('/content/background.png');"></div>
            </div>
            <div class="arts__profileBody___eNPbH-camelCase">
                <div id="backToDiscoveryButton" style="margin-top: 1.302vw;margin-left: 1.302vw;left: 0;position: absolute; z-index: 13; display: none;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                    <div class="styles__shadow___3GMdH-camelCase"></div>
                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                    <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #2f2f2f;"><i class="fas fa-reply" aria-hidden="true"></i></div>
                </div>
                <div id="clanDiscoveryPage">
                    <div class="styles__header___153FZ-camelCase" style="text-align: center;">Discover Clans</div>
                    <div class="styles__searchBoxHolder___1uLEf-camelCase">
                        <div class="styles__searchContainer___1WB5F-camelCase">
                            <input class="styles__searchInput___sVM-G-camelCase" type="search" placeholder="Search for a clan..." maxlength="24">
                            <i class="styles__searchIcon___3mM7Z-camelCase fas fa-search" role="button" tabindex="0" aria-hidden="true"></i>
                            <i class="styles__searchIcon___3mM7Z-camelCase fas fa-times" role="button" tabindex="0" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="styles__fullContainer___3Wl6C-camelCase">
                        <div id="clansDiscoveryContainer" class="styles__clansDiscoveryContainer___mA3va-camelCase">
                        </div>
                        <div id="pageNumber" style="position: absolute;width: 50%;text-align: center;color: white;font-size: 1.823vw;bottom: 2vw;">
                            Page currentPage/maxPage</div>
                        <div id="backPageButton" style="position: absolute; z-index: 15;left: 2vw;bottom: 2vw;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                            <div class="styles__shadow___3GMdH-camelCase"></div>
                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                            <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #2f2f2f;"><i class="fas fa-reply" aria-hidden="true"></i></div>
                        </div>
                        <div id="forwardPageButton" style="position: absolute; z-index: 15;right: 2vw;bottom: 2vw;" role="button" tabindex="0" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase">
                            <div class="styles__shadow___3GMdH-camelCase"></div>
                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                            <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #2f2f2f;"><i class="fas fa-reply" aria-hidden="true" style="transform: scaleX(-1);"></i></div>
                        </div>
                    </div>
                </div>
                <div id="clanRequestsPage" style="display: none;">
                    <div class="styles__header___153FZ-camelCase" style="text-align: center;">Clan Requests</div>
                    <div class="styles__fullContainer___3Wl6C-camelCase">
                        <div id="clanRequestsContainer" class="styles__clansDiscoveryContainer___mA3va-camelCase" style="max-height: 44.271vw;">
                        </div>
                    </div>
                </div>
                <div id="clanInfoPage" style="display: none;">
                    <div id="clanInfoName" class="styles__header___153FZ-camelCase" style="text-align: center;">name
                    </div>
                    <div class="styles__clanDiscoveryClanInformationLeft___4mxA4-camelCase">
                        <img loading="lazy" id="clanInfoImage" class="styles__coverImage___1sSHa-camelCase" style="border-radius: 0.365vw;" src="">
                        <div id="clanInfoDescription" class="styles__clanDiscoveryClanInformationDescription___3nXam-camelCase">description</div>
                        <div class="styles__clanDiscoveryClanInformationStatsContainer___4jVma-camelCase">
                            <div id="clanInfoLevel" class="styles__clanDiscoveryClanInformationBigStat___mvmA4-camelCase">level
                            </div>
                            <div id="clanInfoEXP" class="styles__clanDiscoveryClanInformationLittleStat___anxb5-camelCase">exp
                            </div>
                        </div>
                        <div class="styles__clanDiscoveryClanInformationButtonContainer___XxX59-camelCase">
                            <div id="requestToJoinButton" role="button" tabindex="0" class="styles__button___1_E-G-camelCase" style="margin-right: 0.521vw;">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #3f3f3f;"></div>
                                <div class="styles__front___vcvuy-camelCase" style="background-color: #3f3f3f;">
                                    <div class="styles__headerButtonInside___1A20f-camelCase" style="width: 100%;">
                                        <i aria-hidden="true" class="styles__hostIcon___3BjGq-camelCase fas fa-swords"></i>
                                        <div>Request to Join</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="styles__clanDiscoveryClanInformationCreatedContainer___cn92a-camelCase">
                            <div id="clanInfoCreated" class="styles__clanDiscoveryClanInformationCreatedText___4jmxA-camelCase">created</div>
                        </div>
                    </div>
                    <div id="clanInfoClanOwnerContainer" class="styles__clanDiscoveryClanInformationClanMemberContainer___c9290-camelCase">
                        <img loading="lazy" id="clanInfoClanOwnerAvatar" class="styles__clanDiscoveryClanInformationClanMemberAvatar___4jmCA-camelCase" src="">
                        <div id="clanInfoClanOwnerUsername" class="styles__clanDiscoveryClanInformationClanMemberUsername___jn39A-camelCase">username
                        </div>
                        <div class="styles__clanDiscoveryClanInformationClanMemberDescription___28jDx-camelCase">Clan
                            Owner</div>
                    </div>
                    <div id="clanInfoClanMembers" class="styles__clanDiscoveryClanInformationClanMembersContainer___49jfA-camelCase"></div>
                </div>
            </div>
        </div>`

}

blacket.createToast = (toast) => {
    toast.time = 10000000;
    if (!toast.icon) toast.icon = "/content/blooks/Info.png";
    new Audio("/content/notification.ogg").play();
    let randNum = Math.floor(Math.random() * 100000000);
    $("#notificationCenter").append(`<div id="toast-${randNum}" style="
        width: 20vw;
        height: revert-layer;
        padding-bottom: 0.4vw;
        background-color: #2f2f2f;
        border-radius: 0.5vw;
        box-shadow: inset 0 -0.26vw rgba(0, 0, 0, 0.3);
        display: flex;
        cursor: pointer;
        position: unset;
    "class="styles__toastContainer___o4pCa-camelCase" style="position: unset !important;"><img loading="lazy" style="width: auto; height: 100%; margin-right: 0.25vw;" class="styles__toastIcon___vna3A-camelCase" src="${toast.icon}"><div style="display: flex; flex-direction: column; align-items: flex-start;">
    <div style="position: unset; margin: 0; margin-bottom: -2.5vw; margin-left: 0.3vw;" class="styles__toastTitle___39Rac-camelCase">${toast.title}</div>
    <div style="margin: 0;" class="styles__toastMessage___xar43-camelCase">${toast.message}</div>
    </div></div>`);
    let toastTimeout = setTimeout(() => {
        document.querySelector(".styles__toastContainer___o4pCa-camelCase").style.animation = 'none';
        document.querySelector(".styles__toastContainer___o4pCa-camelCase").offsetHeight;
        document.querySelector(".styles__toastContainer___o4pCa-camelCase").style.animation = "styles__toastContainer___o4pCa-camelCase 0.25s linear reverse";
        setTimeout(() => {
            $(".styles__toastContainer___o4pCa-camelCase").remove();
        }, 245);
    }, toast.time);
    $(`#toast-${randNum}`).click(() => {
        clearTimeout(toastTimeout);
        $(`#toast-${randNum}`).remove();
    });
}


document.body.innerHTML = `
    <style>
        ::-webkit-scrollbar-thumb:horizontal {
            background: #000;
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar {
            height: 8px;
            width: 8px;
            background: gray;
        }
        
        ::-webkit-scrollbar-thumb:vertical {
            background: #000;
            border-radius: 10px;
        }
    </style>
`;
document.body.innerHTML += `<div id="notificationCenter" style="position: fixed; z-index: 1000; top: 5vh; right: 5vh; gap: 0.5vw; display: flex; flex-direction: column;"></div>`
document.body.innerHTML += `<div class="styles__background___2J-JA-camelCase" style="background-color: #343434"><div class="styles__blooksBackground___3oQ7Y-camelCase" style="background-image:url('/content/background.png');"></div></div>`
document.body.innerHTML += `${blacket.blacketUtils.sidebar}<div id="app"></div><div class="styles__container___3LSgB-camelCase" style="transform: translateX(0.000vw); opacity: 0;"></div>
<div style="display: none;" class="arts__chatModal___4JFsa-camelCase" id="chatModal">
<div class="styles__chatContainerBackground___gR4Ab-camelCase"></div>
<div class="styles__background___2J-JA-camelCase" style="z-index: -2;">
    <div class="styles__blooksBackground___3oQ7Y-camelCase"
        style="background-image: url('/content/background.png');"></div>
</div>
<div id="chatContainer" class="styles__chatContainer___iA8ZU-camelCase"></div>
<div style="position: absolute;bottom: 0;width: 100%;">
    <div class="styles__chatInputContainer___gkR4A-camelCase">
        <div style="" class="styles__chatUploadButton___g39Ac-camelCase">
            <i style="font-size: 1.563vw;" class="fas fa-upload" aria-hidden="true"></i>
        </div>
        <textarea id="chatBox" class="styles__chatInputBox___fvMA4-camelCase" value="" placeholder="Message"
            rows="1"></textarea>
        <div class="styles__chatEmojiButton___8RFa2-camelCase">
            <i style="font-size: 1.563vw;" class="fas fa-smile" aria-hidden="true"></i>
        </div>
    </div>
    <div style="display: none;" class="styles__chatEmojiPickerContainer___KR4aN-camelCase">
        <div class="styles__chatEmojiPickerHeader___FK4Ac-camelCase"><text style="margin-bottom: 0.521vw;">Emoji
                Picker</text></div>
        <div id="emojiPicker" class="styles__chatEmojiPickerBody___KR4aN-camelCase">
            <img loading="lazy" id="12MonthVeteranBadge" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/12 Month Veteran.png"><img loading="lazy" id="18MonthVeteranBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/18 Month Veteran.png"><img loading="lazy" id="24MonthVeteranBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/24 Month Veteran.png"><img loading="lazy" id="6MonthVeteranBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/6 Month Veteran.png"><img loading="lazy" id="artistBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/badges/Artist.png"><img
                loading="lazy" id="beanTroll" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/beanTroll.png"><img loading="lazy" id="trolling"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/trolling.gif"><img
                loading="lazy" id="ben" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/ben.gif"><img loading="lazy" id="bigSpenderBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/badges/Big Spender.png"><img
                loading="lazy" id="blacketA" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketA.png"><img loading="lazy" id="blacketB"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketB.png"><img
                loading="lazy" id="blacketC" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketC.png"><img loading="lazy" id="blacketD"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketD.png"><img
                loading="lazy" id="blacketE" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketE.png"><img loading="lazy" id="blacketF"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketF.png"><img
                loading="lazy" id="blacketG" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketG.png"><img loading="lazy" id="blacketH"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketH.png"><img
                loading="lazy" id="blacketI" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketI.png"><img loading="lazy" id="blacketJ"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketJ.png"><img
                loading="lazy" id="blacketK" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketK.png"><img loading="lazy" id="blacketL"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketL.png"><img
                loading="lazy" id="blacketM" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketM.png"><img loading="lazy" id="blacketN"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketN.png"><img
                loading="lazy" id="blacketO" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketO.png"><img loading="lazy" id="blacketP"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketP.png"><img
                loading="lazy" id="blacketQ" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketQ.png"><img loading="lazy" id="blacketR"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketR.png"><img
                loading="lazy" id="blacketS" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketS.png"><img loading="lazy" id="blacketSpace"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketSpace.png"><img
                loading="lazy" id="blacketT" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketT.png"><img loading="lazy" id="blacketU"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketU.png"><img
                loading="lazy" id="blacketV" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketV.png"><img loading="lazy" id="blacketW"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketW.png"><img
                loading="lazy" id="blacketX" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketX.png"><img loading="lazy" id="blacketY"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/blacketY.png"><img
                loading="lazy" id="blacketZ" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/blacketZ.png"><img loading="lazy" id="blacktuberBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="https://blacket.org/content/badges/Blacktuber.png"><img loading="lazy" id="boosterBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/badges/Booster.png"><img
                loading="lazy" id="bozoClown" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/bozoClown.gif"><img loading="lazy" id="bozoNerd"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/bozoNerd.gif"><img
                loading="lazy" id="ceruleanHype" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/ceruleanHype.gif"><img loading="lazy" id="chroma"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/blooks/Light Blue Blook.png"><img loading="lazy" id="clownBozo"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/clownBozo.gif"><img
                loading="lazy" id="clueless" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/clueless.png"><img loading="lazy" id="code"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/code.png"><img
                loading="lazy" id="common" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/blooks/White Blook.png"><img loading="lazy" id="crazy"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/crazy.png"><img
                loading="lazy" id="cringe" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/cringe.png"><img loading="lazy" id="disappointed"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/disappointed.png"><img
                loading="lazy" id="disaster" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/disaster.png"><img loading="lazy" id="epic"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/blooks/Red Blook.png"><img
                loading="lazy" id="error" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/blooks/Error.png"><img loading="lazy" id="exp"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/expIcon.png"><img
                loading="lazy" id="glizTalk" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/glizTalk.gif"><img loading="lazy" id="glizWalk"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/glizWalk.gif"><img
                loading="lazy" id="ice" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/ice.png"><img loading="lazy" id="info"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/blooks/Info.png"><img
                loading="lazy" id="innocent" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/innocent.png"><img loading="lazy" id="iridescent"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/blooks/Rainbow Blook.gif"><img
                loading="lazy" id="laughAtThisUser" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/laughAtThisUser.png"><img loading="lazy" id="legacyAnkhBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/badges/Legacy Ankh.png"><img
                loading="lazy" id="legendary" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/blooks/Orange Blook.png"><img loading="lazy" id="level"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/levelStar.png"><img
                loading="lazy" id="lmfao" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/lmfao.png"><img loading="lazy" id="messagesIcon"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/messagesIcon.png"><img
                loading="lazy" id="monkeySpin" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/monkeySpin.gif"><img loading="lazy" id="mystical"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/blooks/Purple Blook.png"><img
                loading="lazy" id="ogBadge" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/OG.png"><img loading="lazy" id="openedIcon"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/openedIcon.png"><img
                loading="lazy" id="ownerBadge" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/Owner.png"><img loading="lazy" id="plusBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/badges/Plus.png"><img
                loading="lazy" id="rare" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/blooks/Blue Blook.png"><img loading="lazy" id="shrug"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/shrug.png"><img
                loading="lazy" id="skullSpin" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/skullSpin.gif"><img loading="lazy" id="staffBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/badges/Staff.png"><img
                loading="lazy" id="success" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/blooks/Success.png"><img loading="lazy" id="sunglas"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/sunglas.png"><img
                loading="lazy" id="testerBadge" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/Tester.png"><img loading="lazy" id="token"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/tokenIcon.png"><img
                loading="lazy" id="trole" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/trole.png"><img loading="lazy" id="troll"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/troll.png"><img
                loading="lazy" id="trollSmile" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/trollSmile.png"><img loading="lazy" id="uncommon"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/blooks/Green Blook.png"><img
                loading="lazy" id="uwu" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/uwu.png"><img loading="lazy" id="verifiedBadge"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/badges/Verified.png"><img
                loading="lazy" id="verifiedBotBadge" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/badges/Verified Bot.png"><img loading="lazy" id="warn"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/blooks/Warn.png"><img
                loading="lazy" id="wow" class="styles__chatEmojiPickerEmoji___UWUGR-camelCase"
                src="/content/emojis/wow.png"><img loading="lazy" id="trolly"
                class="styles__chatEmojiPickerEmoji___UWUGR-camelCase" src="/content/emojis/trolly.png">
        </div>
    </div>
</div>
</div>`;

new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = "https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js";
    document.querySelector('head').appendChild(script);
});

$(".styles__chatUploadButton___g39Ac-camelCase").click(() => {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _this => {
        let files = Array.from(input.files);
        blacket.askForUpload(files[0]);
    }
    input.click();
});

document.querySelector('input[placeholder="Message"]')

document.querySelectorAll('a').forEach(e => {
    if (e.href) {
        e.onclick = () => {
            event.preventDefault();
            window.history.pushState({}, document.title, e.href);
            document.title = `${location.pathname.split('/')[1].split('?')[0][0].toUpperCase() + location.pathname.split('/')[1].split('?')[0].slice(1, location.pathname.split('/')[1].split('?')[0].length)} | Blacket`
            loadPage();
        };
    } else {
        e.onclick = () => {
            if (e.innerHTML.includes(`<div class="styles__pageText___1eo7q-camelCase">Chat</div>`)) {
                blacket.toggleChat();
            } else if (e.innerHTML.includes(`<div class="styles__pageText___1eo7q-camelCase">News</div>`)) {
                $(".styles__container___3LSgB-camelCase").attr("style", `transform: translateX(-100%); opacity: 1;`);
                $("#app > div:nth-child(1) > div:nth-child(1)").append(`<div class="arts__modal___VpEAD-camelCase" role="button" tabindex="0" style="outline: currentcolor none medium; opacity: 0.8;"></div>`);
                $(".arts__modal___VpEAD-camelCase").click(() => {
                    $(".arts__modal___VpEAD-camelCase").remove();
                    $(".styles__container___3LSgB-camelCase").attr("style", `transform: translateX(0.000vw); opacity: 0;`);
                });
            }
        };
    }
});

loadPage();

async function loadPage() {
    document.getElementById('app').innerHTML = blacket.blacketUtils.pages[location.pathname.split('/')[1].split('?')[0]]
    if (location.pathname.split('/')[1].split('?')[0] == 'stats') {
        $(function reset() {
            if (blacket.user && blacket.friends) {
                if (blacket.getParameter("plus") == "") {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Congratulations!<br><br>You now have access to all ${blacket.config.name} Plus features!<br><br>Thank you for supporting ${blacket.config.name}!</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                    $("#closeButton").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    window.history.replaceState({}, document.title, "/stats");
                }
                if (blacket.getParameter("1hBooster") == "") {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Congratulations!<br><br>You have received a 1 Hour Booster.<br><br>Thank you for supporting ${blacket.config.name}!</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                    $("#closeButton").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    window.history.replaceState({}, document.title, "/stats");
                }
                if (blacket.getParameter("3hBooster") == "") {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Congratulations!<br><br>You have received a 3 Hour Booster.<br><br>Thank you for supporting ${blacket.config.name}!</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                    $("#closeButton").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    window.history.replaceState({}, document.title, "/stats");
                }
                if (new Date(blacket.user.claimed * 1000).toLocaleDateString('en-US', {
                        timeZone: "UTC"
                    }) == new Date(Date.now()).toLocaleDateString('en-US', {
                        timeZone: "UTC"
                    }))
                    $("#claimButton").remove();
                else {
                    $("#claimButton").click(() => {
                        if (blacket.user.username !== blacket.user.current) {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>You must be viewing your account to continue.</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                            $("#closeButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            return;
                        }
                        blacket.startLoading();
                        blacket.requests.get("/worker/claim", (data) => {
                            if (!data.error) {
                                blacket.stopLoading();
                                blacket.user.tokens += blacket.config.rewards[data.reward - 1];
                                $("body").append(`
                                <div class="arts__modal___VpEAD-camelCase">
                                <div class="styles__tokenContainer___3yBv--camelCase">
                                    <div class="styles__modalBigHeaderText___1s9HL-camelCase">Spin the Daily Wheel!</div>
                                    <div class="styles__wheelWrapper___1Jp5W-camelCase" role="button" tabindex="0"><img loading="lazy"
                                            src="/content/wheelBase.png" class="styles__wheelStand___16jjf-camelCase" alt="Wheel Stand"
                                            draggable="false">
                                        <div class="styles__wheelContainer___1xNs_-camelCase" style="transform: rotate(-337.5deg);">
                                            <div class="styles__wheelContainerInside___3YXNR-camelCase"><img loading="lazy" src="/content/wheel.png"
                                                    class="styles__wheelImg___ZjYhV-camelCase" alt="Wheel" draggable="false">
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(22.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(67.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(112.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(157.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(202.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(247.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(292.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                                <div class="styles__prizeContainer___WfrVd-camelCase" style="transform: rotate(337.5deg);"><img loading="lazy"
                                                        src="/content/tokenIcon.png" class="styles__wheelToken___1V7iP-camelCase" alt="Token"
                                                        draggable="false">
                                                    <div class="styles__prizeText___uuQ2U-camelCase">+ token</div>
                                                </div>
                                            </div>
                                        </div><img loading="lazy" src="/content/wheelArrow.png" class="styles__wheelArrow___10epf-camelCase" alt="Arrow"
                                            draggable="false">
                                    </div>
                                </div>
                            </div>`);
                                let degrees = [-247.5, -292.5, -337.5, -382.5, -427.5, -472.5, -517.5, -562.5, ];
                                $(".styles__wheelContainer___1xNs_-camelCase").attr("style", `transform: rotate(${degrees[data.reward - 1]}deg);`);
                                $(".styles__prizeContainer___WfrVd-camelCase").each((i, e) => {
                                    let format = (num) => {
                                        if (num >= 1000000000000)
                                            return (num / 1000000000000).toFixed(1) + "t";
                                        if (num >= 1000000000)
                                            return (num / 1000000000).toFixed(1) + "b";
                                        if (num >= 1000000)
                                            return (num / 1000000).toFixed(1) + "m";
                                        if (num >= 1000)
                                            return (num / 1000).toFixed(1) + "k";
                                        return num;
                                    }
                                    $(e).children(".styles__prizeText___uuQ2U-camelCase").html(`+ ${format(blacket.config.rewards[i])}`);
                                });
                                $(".styles__wheelWrapper___1Jp5W-camelCase").click(() => {
                                    $(".styles__wheelWrapper___1Jp5W-camelCase").off("click");
                                    document.querySelector(".styles__wheelContainerInside___3YXNR-camelCase").classList.add("styles__wheelSpin1___1jvqn-camelCase");
                                    setTimeout(() => {
                                        $(".styles__tokenContainer___3yBv--camelCase").append(`<div class="styles__buttonRow___3rXut-camelCase"><div id="claimTokensButton" style="margin-top: 0.781vw; margin-right: 0.391vw;" class="styles__button___1_E-G-camelCase styles__nextButton___1yLeh-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__nextButtonInside___1KB5H-camelCase" style="background-color: #2f2f2f;">Claim</div></div></div>`);
                                        $("#claimTokensButton").click(() => {
                                            $("#tokens").html(`${blacket.user.tokens.toLocaleString()}`);
                                            $(".arts__modal___VpEAD-camelCase").remove();
                                        });
                                    }, 4000);
                                });
                                $("#claimButton").remove();
                            } else {
                                blacket.stopLoading();
                                $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                $("#closeButton").click(() => {
                                    $("#errorModal").remove();
                                });
                            }
                        });
                    });
                }
                $("#viewStatsButton").click(() => {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <form class="styles__container___1BPm9-camelCase">
                        <div class="styles__text___KSL4--camelCase">Enter their username.</div>
                        <div class="styles__holder___3CEfN-camelCase">
                            <div class="styles__numRow___xh98F-camelCase">
                                <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                border-radius: 0.313vw;
                                width: 90%;
                                height: 2.604vw;
                                margin: 0.000vw;
                                display: flex;
                                flex-direction: row;
                                align-items: center;"><input style="  border: none;
                                height: 2.083vw;
                                line-height: 2.083vw;
                                font-size: 1.458vw;
                                text-align: center;
                                font-weight: 700;
                                font-family: Nunito, sans-serif;
                                color: #ffffff;
                                background-color: #3f3f3f;
                                outline: none;
                                width: 100%;
                              " placeholder="Username" maxlength="16" value="" style="width: 3.125vw;"/></div>
                            </div>
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">View</div>
                                </div>
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                </div>
                            </div>
                        </div>
                        <input type="submit" style="opacity: 0; display: none;" />
                    </form>
                            </div>`);
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").focus();
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                        event.preventDefault();
                        blacket.getUser($(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val());
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                        blacket.getUser($(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val());
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                });
                $("#tradeButton").click(() => {
                    if (blacket.user.current !== blacket.user.username)
                        return blacket.tradeUser(blacket.user.current);
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <form class="styles__container___1BPm9-camelCase">
                        <div class="styles__text___KSL4--camelCase">Who would you like to trade with?</div>
                        <div class="styles__holder___3CEfN-camelCase">
                            <div class="styles__numRow___xh98F-camelCase">
                                <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                border-radius: 0.313vw;
                                width: 90%;
                                height: 2.604vw;
                                margin: 0.000vw;
                                display: flex;
                                flex-direction: row;
                                align-items: center;"><input style="  border: none;
                                height: 2.083vw;
                                line-height: 2.083vw;
                                font-size: 1.458vw;
                                text-align: center;
                                font-weight: 700;
                                font-family: Nunito, sans-serif;
                                color: #ffffff;
                                background-color: #3f3f3f;
                                outline: none;
                                width: 100%;
                              " placeholder="Username" maxlength="16" value="" style="width: 3.125vw;"/></div>
                            </div>
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Trade</div>
                                </div>
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                </div>
                            </div>
                        </div>
                        <input type="submit" style="opacity: 0; display: none;" />
                    </form>
                            </div>`);
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").focus();
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                        event.preventDefault();
                        blacket.tradeUser($(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val());
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                        blacket.tradeUser($(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val());
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                });
                let rainbow = false;
                blacket.getUser = (user) => {
                    $(".arts__modal___VpEAD-camelCase").remove();
                    blacket.startLoading();
                    blacket.requests.get(`/worker/user/${user}`, (data) => {
                        if (data.error) {
                            $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                            $("#closeButton").click(() => {
                                $("#errorModal").remove();
                            });
                            blacket.stopLoading();
                            return;
                        }
                        if (data.user.username !== blacket.user.username)
                            history.pushState(null, null, `/stats?name=${data.user.username}`);
                        else
                            history.pushState(null, null, `/stats`);
                        blacket.setUser(data.user);
                        blacket.stopLoading();
                    });
                }
                blacket.setUser = (user) => {
                    blacket.user.current = user.username;
                    user.level = 0;
                    for (let i = 0; i <= 27915; i++) {
                        user.needed = 5 * Math.pow(user.level, blacket.config.exp.difficulty) * user.level;
                        if (user.exp >= user.needed) {
                            user.exp -= user.needed;
                            user.level++;
                        }
                    }
                    $(".styles__headerBlook___DdSHd-camelCase").html(``);
                    $(".styles__headerName___1GBcl-camelCase").html(`${user.username} `);
                    if (user.badges.length > 0)
                        $(".styles__headerBadges___ffKa4-camelCase").html(`<div class="styles__headerBadgeBg___12ogR-camelCase"></div>`);
                    else
                        $(".styles__headerBadges___ffKa4-camelCase").html(``);
                    Object.keys(blacket.badges).forEach((badge) => {
                        if (user.badges.includes(badge) || user.badges.includes("*")) {
                            $(".styles__headerBadges___ffKa4-camelCase").append(`<div id="${badge.replaceAll(" ", "-")}" style="display: inline-block; cursor: pointer; margin-right: 0.104vw;"><img loading="lazy"src="${blacket.badges[badge].image}" style="width: 1.563vw;display: inline-block; margin-left: 0.130vw; z-index: 1; position: relative;"></div>`);
                            $(`#${badge.replaceAll(" ", "-")}`).click(() => {
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>${badge} Badge<br><br>${blacket.badges[badge].description}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                $("#closeButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                });
                            });
                        }
                    });
                    $(".styles__headerName___1GBcl-camelCase").attr("style", `color: ${user.color.split(';')[0]}`);
                    if (user.color.toLowerCase() == "rainbow")
                        $(".styles__headerName___1GBcl-camelCase").attr("class", `styles__headerName___1GBcl-camelCase rainbow`);
                    else
                        $(".styles__headerName___1GBcl-camelCase").attr("class", `styles__headerName___1GBcl-camelCase`);
                    $(".styles__headerTitle___24Ox2-camelCase").html(`${user.role}`);
                    let onlineColor = "red";
                    if (user.modified * 1000 > Date.now() - 60000)
                        onlineColor = "green";
                    $(".styles__headerBlook___DdSHd-camelCase").append(`<img loading="lazy" src="${user.avatar}" style="filter: drop-shadow(0.000vw 0.000vw 0.260vw ${onlineColor});" draggable="false" class="styles__blook___1R6So-camelCase" />`);
                    $(".styles__headerBg___12ogR-camelCase").attr("src", user.banner);
                    $("#tokens").html(`${user.tokens.toLocaleString()}`);
                    let blookLength = 0;
                    let maxBlooks = 0;
                    Object.keys(blacket.packs).forEach((pack) => {
                        Object.keys(blacket.packs[pack].blooks).forEach(blook => {
                            maxBlooks++;
                        });
                    });
                    Object.keys(user.blooks).forEach((blook) => {
                        if (blacket.blooks[blook])
                            blookLength++;
                    });
                    $("#blooks").html(`${blookLength.toLocaleString()} / ${maxBlooks.toLocaleString()}`);
                    $("#opened").html(`${user.misc.opened.toLocaleString()}`);
                    $("#messages").html(`${user.misc.messages.toLocaleString()}`);
                    if (user.level >= 100) {
                        if (!rainbow)
                            $("body").append(`<style id="rainbow">.styles__levelBarInside___3FLAG-camelCase {background: linear-gradient(#fcd843, #fcd843 50%, #feb31a 50.01%, #feb31a);height: 100%;width: 100%;transform-origin: left center;animation: styles__levelBarRainbow___3FLAG-camelCase 2s linear infinite;}</style>`);
                        rainbow = true;
                    } else {
                        $("#rainbow").remove();
                        rainbow = false;
                    }
                    $(".styles__levelStarText___2Myxg-camelCase").html(user.level.toLocaleString());
                    $(".styles__levelBarInside___3FLAG-camelCase").css("transform", `scaleX(${user.exp / user.needed})`);
                    if (user.username !== blacket.user.username) {
                        $("#goBackButton").remove();
                        $("#friendButton").remove();
                        $("#pendingButton").remove();
                        $("#unfriendButton").remove();
                        $("#blockButton").remove();
                        $("#unblockButton").remove();
                        $("#reportButton").remove();
                        $("#requestsButton").attr("style", "display: none;");
                        $(".styles__headerLeftButtons___3zGk0-camelCase").append(`<a id="goBackButton" class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #7e29fc;"></div><div class="styles__front___vcvuy-camelCase" style="background-color: #7e29fc;"><div class="styles__headerButtonInside___26e_U-camelCase"><i class="styles__headerButtonIcon___1pOun-camelCase fas fa-reply" aria-hidden="true"></i>Go Back</div></div></a>`);
                        if (!blacket.user.friends.includes(user.id)) {
                            $("#goBackButton").before(`<a id="friendButton" class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #31bbae;"></div><div class="styles__front___vcvuy-camelCase" style="background-color: #31bbae;"><div class="styles__headerButtonInside___26e_U-camelCase"><i class="styles__headerButtonIcon___1pOun-camelCase fas fa-user-plus" aria-hidden="true"></i>Friend</div></div></a>`);
                            Object.keys(blacket.friends.sending).forEach((request) => {
                                if (blacket.friends.sending[request].id == user.id) {
                                    $("#friendButton div:nth-child(3) > div:nth-child(1)").html("<i class='styles__headerButtonIcon___1pOun-camelCase fas fa-user-clock' aria-hidden='true'></i>Pending");
                                    $("#friendButton").attr("id", "pendingButton");
                                }
                            });
                            $("#friendButton").click(() => {
                                blacket.requests.post(`/worker/friends/request`, {
                                    user: user.username
                                }, (data) => {
                                    if (data.error) {
                                        $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                        $("#closeButton").click(() => {
                                            $("#errorModal").remove();
                                        });
                                        blacket.stopLoading();
                                        return;
                                    }
                                    blacket.friends.sending.push({
                                        id: user.id,
                                        username: user.username,
                                        role: user.role,
                                        color: user.color,
                                        avatar: user.avatar,
                                        banner: user.banner,
                                        modified: user.modified
                                    });
                                    blacket.getUser(user.username);
                                });
                            });
                        } else {
                            $("#goBackButton").before(`<a id="unfriendButton" class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #f44336;"></div><div class="styles__front___vcvuy-camelCase" style="background-color: #f44336;"><div class="styles__headerButtonInside___26e_U-camelCase"><i class="styles__headerButtonIcon___1pOun-camelCase fas fa-user-minus" aria-hidden="true"></i>Unfriend</div></div></a>`);
                            $("#unfriendButton").click(() => {
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Are you sure you want to unfriend ${user.username}?</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div></div><div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0" id="noButton"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div></div></div></div><input type="submit" style="opacity: 0; display: none;"></form></div>`);
                                $("#yesButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                    blacket.startLoading();
                                    blacket.requests.post(`/worker/friends/remove`, {
                                        user: user.username
                                    }, (data) => {
                                        if (data.error) {
                                            $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                            $("#closeButton").click(() => {
                                                $("#errorModal").remove();
                                            });
                                            return blacket.stopLoading();
                                        }
                                        blacket.user.friends.splice(blacket.user.friends.indexOf(user.id), 1);
                                        blacket.friends.friends.forEach((friend, index) => {
                                            if (friend.id == user.id)
                                                delete blacket.friends.friends[index];
                                        });
                                        blacket.friends.friends = blacket.friends.friends.filter((n) => {
                                            return n != undefined
                                        });
                                        blacket.stopLoading();
                                        blacket.getUser(user.username);
                                    });
                                });
                                $("#noButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                });
                            });
                        }
                        if (!blacket.user.blocks.includes(user.id)) {
                            $("#goBackButton").before(`<a id="blockButton" class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #ea1607;"></div><div class="styles__front___vcvuy-camelCase" style="background-color: #ea1607;"><div class="styles__headerButtonInside___26e_U-camelCase"><i class="styles__headerButtonIcon___1pOun-camelCase fas fa-user-slash" aria-hidden="true"></i>Block</div></div></a>`);
                            $("#blockButton").click(() => {
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Are you sure you want to block ${user.username}?</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div></div><div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0" id="noButton"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div></div></div></div><input type="submit" style="opacity: 0; display: none;"></form></div>`);
                                $("#yesButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                    blacket.startLoading();
                                    blacket.requests.post(`/worker/friends/block`, {
                                        user: user.username
                                    }, (data) => {
                                        if (data.error) {
                                            $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                            $("#closeButton").click(() => {
                                                $("#errorModal").remove();
                                            });
                                            return blacket.stopLoading();
                                        }
                                        blacket.user.blocks.push(user.id);
                                        blacket.friends.sending.forEach((friend, index) => {
                                            if (friend.id == user.id)
                                                delete blacket.friends.sending[index];
                                        });
                                        blacket.friends.sending = blacket.friends.sending.filter((n) => {
                                            return n != undefined
                                        });
                                        blacket.friends.receiving.forEach((friend, index) => {
                                            if (friend.id == user.id)
                                                delete blacket.friends.receiving[index];
                                        });
                                        blacket.friends.receiving = blacket.friends.receiving.filter((n) => {
                                            return n != undefined
                                        });
                                        blacket.friends.friends.forEach((friend, index) => {
                                            if (friend.id == user.id)
                                                delete blacket.friends.friends[index];
                                        });
                                        blacket.friends.friends = blacket.friends.friends.filter((n) => {
                                            return n != undefined
                                        });
                                        blacket.user.friends.splice(blacket.user.friends.indexOf(user.id), 1);
                                        blacket.stopLoading();
                                        blacket.getUser(user.username);
                                    });
                                });
                                $("#noButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                });
                            });
                        } else {
                            $("#goBackButton").before(`<a id="unblockButton" class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #ea1607;"></div><div class="styles__front___vcvuy-camelCase" style="background-color: #ea1607;"><div class="styles__headerButtonInside___26e_U-camelCase"><i class="styles__headerButtonIcon___1pOun-camelCase fas fa-user-check" aria-hidden="true"></i>Unblock</div></div></a>`);
                            $("#unblockButton").click(() => {
                                blacket.requests.post(`/worker/friends/unblock`, {
                                    user: user.username
                                }, (data) => {
                                    if (data.error) {
                                        $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                        $("#closeButton").click(() => {
                                            $("#errorModal").remove();
                                        });
                                        blacket.stopLoading();
                                        return;
                                    }
                                    blacket.user.blocks.splice(blacket.user.blocks.indexOf(user.id), 1);
                                    blacket.getUser(user.username);
                                });
                            });
                        }
                        $(".styles__friendsContainer___kRk3a-camelCase").html(``);
                        Object.keys(blacket.friends.friends).forEach((friend) => {
                            if (!user.friends.includes(blacket.friends.friends[friend].id))
                                return;
                            $(".styles__friendsContainer___kRk3a-camelCase").append(`
                                    <div id="${blacket.friends.friends[friend].id}" class="styles__friendsFriend___rj42a-camelCase">
                                        <img loading="lazy" src="${blacket.friends.friends[friend].banner}">
                                                    <div class="styles__friendsUsername___904Ca-camelCase ${blacket.friends.friends[friend].color == "rainbow" ? " rainbow" : ""}" style="color: ${blacket.friends.friends[friend].color}">${blacket.friends.friends[friend].username}</div>
                                                    <div class="styles__friendsRole___vma3A-camelCase">${blacket.friends.friends[friend].role}</div>
                                                    <img loading="lazy" class="styles__friendsAvatar___mvaW3-camelCase"
                                                        src="${blacket.friends.friends[friend].avatar}">
                                                </div>`);
                            $(`#${blacket.friends.friends[friend].id}`).click(() => {
                                blacket.getUser(blacket.friends.friends[friend].username);
                            });
                        });
                        $("#goBackButton").click(() => {
                            blacket.getUser(``);
                            history.pushState(null, null, `/stats`);
                            $("#goBackButton").remove();
                        });
                        $("#goBackButton").before(`
                                <a class="styles__button___1_E-G-camelCase styles__headerButton___36TRh-camelCase" role="button" tabindex="0" id="reportButton">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #ea1607;"></div>
                                    <div class="styles__front___vcvuy-camelCase" style="background-color: #ea1607;">
                                        <div class="styles__headerButtonInside___26e_U-camelCase">
                                            <i aria-hidden="true" class="styles__headerButtonIcon___1pOun-camelCase fas fa-flag"></i>
                                            Report
                                        </div>
                                    </div>
                                </a>
                                `);
                        $("#reportButton").click(() => blacket.showReportModal("user", {
                            id: user.id,
                            username: user.username,
                            role: user.role,
                        }));
                    } else {
                        $("#goBackButton").remove();
                        $("#friendButton").remove();
                        $("#pendingButton").remove();
                        $("#unfriendButton").remove();
                        $("#blockButton").remove();
                        $("#unblockButton").remove();
                        $("#reportButton").remove();
                        $("#requestsButton").attr("style", "display: block;");
                        $("#requestsButton").unbind("click");
                        $("#requestsButton").click(() => {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                                    <div class="styles__editHeaderContainer___2G1ji-camelCase">
                                    <div class="styles__editHeaderRow___2ekWR-camelCase">
        
                                    <div id="sendingButton" style="margin-left: 0; width: 7.813vw;" class="styles__button___1_E-G-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #4f4f4f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__editHeaderButtonInside___23gJo-camelCase" style="background-color: #4f4f4f; width: 7.292vw;">Sending</div></div>
                                    
                                    <div id="receivingButton" style="margin-left: 0; width: 7.813vw;" class="styles__button___1_E-G-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #4f4f4f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__editHeaderButtonInside___23gJo-camelCase" style="background-color: #4f4f4f; width: 7.292vw;">Receiving<div id="receivingNotificationIndicator" style="display: block;" class="styles__notificationIndicator___4kvmA-camelCase">${blacket.friends.receiving.length}</div></div></div></div>
                                    <div class="styles__editHeaderColumn___2ye6v-camelCase">
                                    <div id="requestsFriendsContainer" class="styles__friendsContainer___kRk3a-camelCase" style="max-height: 100%;">
                                    </div></div></div>`);
                            if (blacket.friends.receiving.length == 0)
                                $("#receivingNotificationIndicator").attr("style", "display: none;");
                            else
                                $("#receivingNotificationIndicator").attr("style", "display: block;");
                            let refresh = false;
                            blacket.appendSendingFriends = () => {
                                $("#requestsFriendsContainer").html(``);
                                if (blacket.friends.sending.length == 0)
                                    $("#requestsFriendsContainer").html(`<div style="color: white;display: flex;justify-content: center;align-content: center;align-items: center;margin-bottom: 0.260vw; font-size: 0.9vw; text-align: center;">You don't have any pending friend requests.</div>`);
                                else
                                    Object.keys(blacket.friends.sending).forEach((friend) => {
                                        $("#requestsFriendsContainer").append(`<div id="${blacket.friends.sending[friend].id}" class="styles__friendsFriendNoHover___rj42a-camelCase">
                                                <img loading="lazy" src="${blacket.friends.sending[friend].banner}">
                                                            <div class="styles__friendsUsername___904Ca-camelCase ${blacket.friends.sending[friend].color == "rainbow" ? " rainbow" : ""}" style="color: ${blacket.friends.sending[friend].color}; margin-right: 2.604vw;">${blacket.friends.sending[friend].username}</div>
                                                            <div class="styles__friendsRole___vma3A-camelCase" style="margin-right: 2.604vw;">${blacket.friends.sending[friend].role}</div>
                                                            <img loading="lazy" class="styles__friendsAvatar___mvaW3-camelCase" src="${blacket.friends.sending[friend].avatar}">
                                                            <div id="${blacket.friends.sending[friend].id}-decline" class="styles__friendButton___gj4Ac-camelCase" style="margin-left: 1.042vw;">X</div>
                                                        </div>`);
                                        $(`#${blacket.friends.sending[friend].id}-decline`).click(() => {
                                            blacket.startLoading();
                                            blacket.requests.post("/worker/friends/cancel", {
                                                user: blacket.friends.sending[friend].username
                                            }, (data) => {
                                                blacket.stopLoading();
                                                if (data.error) {
                                                    $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Close</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                                    $("#closeButton").click(() => {
                                                        $("#errorModal").remove();
                                                    });
                                                    return;
                                                }
                                                delete blacket.friends.sending[friend];
                                                blacket.friends.sending = blacket.friends.sending.filter((n) => {
                                                    return n != undefined
                                                });
                                                blacket.appendSendingFriends();
                                            });
                                        });
                                    });
                            }
                            blacket.appendReceivingFriends = () => {
                                $("#requestsFriendsContainer").html(``);
                                if (blacket.friends.receiving.length == 0)
                                    $("#requestsFriendsContainer").html(`<div style="color: white;display: flex;justify-content: center;align-content: center;align-items: center;margin-bottom: 0.260vw; font-size: 1vw;">You don't have any friend requests.</div>`);
                                else
                                    Object.keys(blacket.friends.receiving).forEach((friend) => {
                                        $("#requestsFriendsContainer").append(`<div id="${blacket.friends.receiving[friend].id}" class="styles__friendsFriendNoHover___rj42a-camelCase">
                                                <img loading="lazy" src="${blacket.friends.receiving[friend].banner}">
                                                            <div class="styles__friendsUsername___904Ca-camelCase ${blacket.friends.receiving[friend].color == "rainbow" ? " rainbow" : ""}" style="color: ${blacket.friends.receiving[friend].color}; margin-right: 5.208vw;">${blacket.friends.receiving[friend].username}</div>
                                                            <div class="styles__friendsRole___vma3A-camelCase" style="margin-right: 5.208vw;">${blacket.friends.receiving[friend].role}</div>
                                                            <img loading="lazy" class="styles__friendsAvatar___mvaW3-camelCase" src="${blacket.friends.receiving[friend].avatar}">
                                                            <div id="${blacket.friends.receiving[friend].id}-accept" class="styles__friendButton___gj4Ac-camelCase" style="margin-left: 0.260vw;"><i class="fas fa-check" style="font-size: 1.953vw;margin-top: 0.260vw;transform: scale(0.95);"></i></div>
                                                            <div id="${blacket.friends.receiving[friend].id}-decline" class="styles__friendButton___gj4Ac-camelCase" style="margin-left: 0.260vw;">X</div>
                                                        </div>`);
                                        $(`#${blacket.friends.receiving[friend].id}-accept`).click(() => {
                                            blacket.startLoading();
                                            blacket.requests.post("/worker/friends/accept", {
                                                user: blacket.friends.receiving[friend].username
                                            }, (data) => {
                                                blacket.stopLoading();
                                                if (data.error) {
                                                    $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Close</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                                    $("#closeButton").click(() => {
                                                        $("#errorModal").remove();
                                                    });
                                                    return;
                                                }
                                                blacket.user.friends.push(blacket.friends.receiving[friend].id);
                                                blacket.friends.friends.push(blacket.friends.receiving[friend]);
                                                delete blacket.friends.receiving[friend];
                                                blacket.friends.receiving = blacket.friends.receiving.filter((n) => {
                                                    return n != undefined
                                                });
                                                $("#receivingNotificationIndicator").html(blacket.friends.receiving.length);
                                                $("#requestsNotificationIndicator").html(blacket.friends.receiving.length);
                                                if (blacket.friends.receiving.length == 0)
                                                    $("#receivingNotificationIndicator").attr("style", "display: none;");
                                                else
                                                    $("#receivingNotificationIndicator").attr("style", "display: block;");
                                                if (blacket.friends.receiving.length == 0)
                                                    $("#requestsNotificationIndicator").attr("style", "display: none;");
                                                else
                                                    $("#requestsNotificationIndicator").attr("style", "display: block;");
                                                blacket.appendReceivingFriends();
                                                refresh = true;
                                            });
                                        });
                                        $(`#${blacket.friends.receiving[friend].id}-decline`).click(() => {
                                            blacket.startLoading();
                                            blacket.requests.post("/worker/friends/decline", {
                                                user: blacket.friends.receiving[friend].username
                                            }, (data) => {
                                                blacket.stopLoading();
                                                if (data.error) {
                                                    $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Close</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                                    $("#closeButton").click(() => {
                                                        $("#errorModal").remove();
                                                    });
                                                    return;
                                                }
                                                delete blacket.friends.receiving[friend];
                                                blacket.friends.receiving = blacket.friends.receiving.filter((n) => {
                                                    return n != undefined
                                                });
                                                $("#receivingNotificationIndicator").html(blacket.friends.receiving.length);
                                                $("#requestsNotificationIndicator").html(blacket.friends.receiving.length);
                                                if (blacket.friends.receiving.length == 0)
                                                    $("#receivingNotificationIndicator").attr("style", "display: none;");
                                                else
                                                    $("#receivingNotificationIndicator").attr("style", "display: block;");
                                                if (blacket.friends.receiving.length == 0)
                                                    $("#requestsNotificationIndicator").attr("style", "display: none;");
                                                else
                                                    $("#requestsNotificationIndicator").attr("style", "display: block;");
                                                blacket.appendReceivingFriends();
                                            });
                                        });
                                    });
                            }
                            blacket.appendSendingFriends();
                            $("#sendingButton").click(() => {
                                blacket.appendSendingFriends();
                            });
                            $("#receivingButton").click(() => {
                                blacket.appendReceivingFriends();
                            });
                            $(".arts__modal___VpEAD-camelCase").mousedown((e) => {
                                if (!$(e.target).closest(".styles__editHeaderContainer___2G1ji-camelCase").length) {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                    if (refresh)
                                        blacket.getUser(``);
                                }
                            });
                        });
                        $(".styles__friendsContainer___kRk3a-camelCase").html(``);
                        if (typeof blacket.friends.friends == "undefined")
                            blacket.friends.friends = [];
                        if (typeof blacket.friends.sending == "undefined")
                            blacket.friends.sending = [];
                        if (typeof blacket.friends.receiving == "undefined")
                            blacket.friends.receiving = [];
                        if (blacket.friends.receiving.length == 0)
                            $(".styles__notificationIndicator___4kvmA-camelCase").attr("style", "display: none;");
                        else {
                            $(".styles__notificationIndicator___4kvmA-camelCase").attr("style", "display: block;");
                            $(".styles__notificationIndicator___4kvmA-camelCase").html(`${blacket.friends.receiving.length}`);
                        }
                        if (blacket.friends.friends.length == 0)
                            $(".styles__friendsContainer___kRk3a-camelCase").html(`<div style="display: flex;justify-content: center;align-content: center;align-items: center;margin-bottom: 0.260vw;">You haven't friended anyone yet.</div>`);
                        else
                            Object.keys(blacket.friends.friends).forEach((friend) => {
                                $(".styles__friendsContainer___kRk3a-camelCase").append(`
                                    <div id="${blacket.friends.friends[friend].id}" class="styles__friendsFriend___rj42a-camelCase">
                                        <img loading="lazy" src="${blacket.friends.friends[friend].banner}">
                                                    <div class="styles__friendsUsername___904Ca-camelCase ${blacket.friends.friends[friend].color == "rainbow" ? " rainbow" : ""}" style="color: ${blacket.friends.friends[friend].color}">${blacket.friends.friends[friend].username}</div>
                                                    <div class="styles__friendsRole___vma3A-camelCase">${blacket.friends.friends[friend].role}</div>
                                                    <img loading="lazy" class="styles__friendsAvatar___mvaW3-camelCase"
                                                        src="${blacket.friends.friends[friend].avatar}">
                                                </div>`);
                                $(`#${blacket.friends.friends[friend].id}`).click(() => {
                                    blacket.getUser(blacket.friends.friends[friend].username);
                                });
                            });
                    }
                    blacket.stopLoading();
                }

                blacket.setUser(blacket.user);
                if (blacket.getParameter("name"))
                    blacket.getUser(blacket.getParameter("name"));

                blacket.setBlook = (blook) => {
                    blacket.startLoading();
                    blacket.requests.post("/worker/cosmetics/avatar", {
                        blook: blook
                    }, (data) => {
                        blacket.stopLoading();
                        if (data.error) {
                            $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                            $("#closeButton").click(() => {
                                $("#errorModal").remove();
                            });
                            return;
                        }
                        if (blook == "Default")
                            blacket.user.avatar = "/content/blooks/Default.png";
                        else
                            blacket.user.avatar = blacket.blooks[blook].image;
                        $(".styles__headerBlook___DdSHd-camelCase > img:nth-child(1)").attr("src", blacket.user.avatar);
                        $(".styles__profileBlook___37mfP-camelCase > img:nth-child(1)").attr("src", blacket.user.avatar);
                    });
                }
                blacket.appendBlooks = (search) => {
                    $(".styles__blooksHolder___1skET-camelCase").html(`<div id="defaultBlook" class="styles__blookContainer___hvHJM-camelCase" role="button" tabindex="0"><div class="styles__blookContainer___36LK2-camelCase styles__blook___3FnM0-camelCase"><img loading="lazy" src="/content/blooks/Default.png" draggable="false" class="styles__blook___1R6So-camelCase"></div></div>`);
                    $("#defaultBlook").click(() => {
                        blacket.setBlook("Default");
                    });
                    if (!search)
                        search = "";
                    Object.keys(blacket.user.blooks).forEach((blook) => {
                        if (!blacket.blooks[blook])
                            return;
                        if (blook.toLowerCase().startsWith(search.toLowerCase()) || blook.toLowerCase().includes(search.toLowerCase()) || search == "") {
                            let id = Math.random().toString(36).substring(2, 15);
                            $(".styles__blooksHolder___1skET-camelCase").append(`
                            <div id="${id}" class="styles__blookContainer___hvHJM-camelCase" role="button" tabindex="0"><div class="styles__blookContainer___36LK2-camelCase styles__blook___3FnM0-camelCase"><img loading="lazy" src="${blacket.blooks[blook].image}" alt="${blook}" draggable="false" class="styles__blook___1R6So-camelCase"></div></div>`);
                            $(`#${id}`).click(() => {
                                blacket.setBlook(blook);
                            });
                        }
                    });
                }
                $(".styles__headerBlookContainer___36zY5-camelCase").click(() => {
                    if (blacket.user.username !== blacket.user.current) {
                        $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>You must be viewing your account to continue.</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                        $("#closeButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                        });
                        return;
                    }
                    $("#app > div").append(`<div class="arts__modal___VpEAD-camelCase"><div class="styles__container___3St5B-camelCase"><div class="styles__numRow___xh98F-camelCase"><input id="searchInput" autocomplete="off" style="border: none;height: 2.083vw;line-height: 2.083vw;font-size: 1.458vw;text-align: center;font-weight: 700;font-family: Nunito, sans-serif;color: #ffffff;background-color: #3f3f3f;outline: none;width: 100%;border-radius: 0.365vw;" placeholder="Search"></div><div class="styles__blooksHolder___1skET-camelCase"></div></div></div>`);
                    $("#searchInput").on('input', () => {
                        blacket.appendBlooks($("#searchInput").val());
                    });
                    $(".arts__modal___VpEAD-camelCase").mousedown((e) => {
                        if ($(e.target).closest(".styles__container___3St5B-camelCase").length === 0)
                            $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    blacket.appendBlooks();
                });

                blacket.setBanner = (banner) => {
                    blacket.startLoading();
                    blacket.requests.post("/worker/cosmetics/banner", {
                        banner: banner
                    }, (data) => {
                        blacket.stopLoading();
                        if (data.error) {
                            $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                            $("#closeButton").click(() => {
                                $("#errorModal").remove();
                            });
                            return;
                        }
                        blacket.user.banner = blacket.banners[banner].image;
                        $(".styles__headerBg___12ogR-camelCase").attr("src", blacket.banners[banner].image);
                    });
                }
                blacket.appendBanners = (search) => {
                    $(".styles__editHeaderColumn___2ye6v-camelCase").html("");
                    if (!search)
                        search = "";
                    Object.keys(blacket.banners).forEach((banner) => {
                        if (banner.toLowerCase().startsWith(search.toLowerCase()) || banner.toLowerCase().includes(search.toLowerCase()) || search == "") {
                            $(".styles__editHeaderColumn___2ye6v-camelCase").append(`<div id="${banner.replaceAll(" ", "-").replaceAll("'", "_")}" class="styles__editBanner___vkKiZ-camelCase" role="button" tabindex="0"><img loading="lazy" src="${blacket.banners[banner].image}" class="styles__editBannerImg___2eCH9-camelCase" draggable="false"></div>`);
                            $(`#${banner.replaceAll(" ", "-").replaceAll("'", "_")}`).click(() => {
                                blacket.setBanner(banner);
                            });
                        }
                    });
                }
                $(".styles__headerBanner___3Uuuk-camelCase").click(() => {
                    if (blacket.user.username !== blacket.user.current) {
                        $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>You must be viewing your account to continue.</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                        $("#closeButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                        });
                        return;
                    }
                    if (!blacket.user.perms.includes("change_banner") && !blacket.user.perms.includes("*")) {
                        $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>You need ${blacket.config.name} Plus to change your banner.</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                        $("#closeButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                        });
                        return;
                    }
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase"><div class="styles__editHeaderContainer___2G1ji-camelCase"><div class="styles__numRow___xh98F-camelCase"><input id="searchInput" autocomplete="off" style="border: none;height: 2.083vw;line-height: 2.083vw;font-size: 1.458vw;text-align: center;font-weight: 700;font-family: Nunito, sans-serif;color: #ffffff;background-color: #3f3f3f;outline: none;width: 100%;border-radius: 0.365vw;" placeholder="Search"></div><div class="styles__editHeaderColumn___2ye6v-camelCase"></div></div></div>`);
                    $("#searchInput").on('input', () => {
                        blacket.appendBanners($("#searchInput").val());
                    });
                    $(".arts__modal___VpEAD-camelCase").mousedown((e) => {
                        if ($(e.target).closest(".styles__editHeaderContainer___2G1ji-camelCase").length === 0)
                            $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    blacket.appendBanners();
                });
            } else
                setTimeout(reset, 1);
        });
    } else if (location.pathname.split('/')[1].split('?')[0] == 'leaderboard') {
        $(function reset() {
            if (blacket.user) {
                blacket.requests.get("/worker/leaderboard", (data) => {
                    document.querySelectorAll('.styles__topStats___3qffP-camelCase').forEach(t => t.innerHTML = '');
                    let textClassMe = "styles__leaderboardPosition___2Z8ZU-camelCase";
                    if (blacket.user.color.toLowerCase() == "rainbow")
                        textClassMe = "styles__leaderboardPosition___2Z8ZU-camelCase rainbow";
                    Object.keys(data.tokens).forEach(position => {
                        let textClass = "styles__leaderboardPosition___2Z8ZU-camelCase";
                        if (data.tokens[position].color.toLowerCase() == "rainbow")
                            textClass = "styles__leaderboardPosition___2Z8ZU-camelCase rainbow";
                        $(".styles__statsContainer___QnrRB-camelCase > div:nth-child(3) > div:nth-child(1)").append(`${parseInt(position) + 1}. <a href="/stats?name=${data.tokens[position].username}" class="${textClass}" style="color: ${data.tokens[position].color};">[${data.tokens[position].role}] ${data.tokens[position].username}</a> - ${data.tokens[position].tokens.toLocaleString()} <img loading="lazy" src="/content/tokenIcon.png" style="width: 1.7vw;"><br>`);
                    });
                    $(".styles__statsContainer___QnrRB-camelCase > div:nth-child(3) > div:nth-child(1)").append(`${data.me.tokens.position.tokens.toLocaleString()}. <a href="/stats?name=${blacket.user.username}" class="${textClassMe}" style="color: ${blacket.user.color};">[${blacket.user.role}] ${blacket.user.username}</a> - ${blacket.user.tokens.toLocaleString()} <img loading="lazy" src="/content/tokenIcon.png" style="width: 1.7vw;"><br>`)
                    Object.keys(data.exp).forEach(position => {
                        let textClass = "styles__leaderboardPosition___2Z8ZU-camelCase";
                        if (data.exp[position].color.toLowerCase() == "rainbow")
                            textClass = "styles__leaderboardPosition___2Z8ZU-camelCase rainbow";
                        $(".styles__statsContainer___QnrRB-camelCase > div:nth-child(4) > div:nth-child(1)").append(`${parseInt(position) + 1}. <a href="/stats?name=${data.exp[position].username}" class="${textClass}" style="color: ${data.exp[position].color};">[${data.exp[position].role}] ${data.exp[position].username}</a> - <img style="width: 1.7vw;" loading="lazy" src="/content/levelStar.png"> <text>${data.exp[position].level.toLocaleString()}</text> (${data.exp[position].exp.toLocaleString()} <img loading="lazy" src="/content/expIcon.png" width=1.7vw>)<br>`);
                    });
                    $(".styles__statsContainer___QnrRB-camelCase > div:nth-child(4) > div:nth-child(1)").append(`${data.me.exp.position.exp.toLocaleString()}. <a href="/stats?name=${blacket.user.username}" class="${textClassMe}" style="color: ${blacket.user.color};">[${blacket.user.role}] ${blacket.user.username}</a> - <img loading="lazy" src="/content/levelStar.png" style="width: 1.7vw;"> <text>${data.me.exp.level.toLocaleString()}</text> (${data.me.exp.exp.toLocaleString()} <img loading="lazy" src="/content/expIcon.png" width=1.7vw>)<br>`);
                    blacket.stopLoading();
                });
            } else setTimeout(reset, 1);
        });
    } else if (location.pathname.split('/')[1].split('?')[0] == 'bazaar') {
        let items = [ // hello piotr
            "1 Hour Booster",
            "3 Hour Booster",
            "Stealth Disguise Kit (Item)",
            "Fragment Grenade (Item)",
            "Clan Shield",
            "Red Paint Bucket",
            "Orange Paint Bucket",
            "Yellow Paint Bucket",
            "Green Paint Bucket",
            "Lime Paint Bucket",
            "Blue Paint Bucket",
            "Cyan Paint Bucket",
            "Purple Paint Bucket",
            "Magenta Paint Bucket",
            "Pink Paint Bucket",
            "Brown Paint Bucket",
            "Black Paint Bucket",
            "Rainbow Paint Bucket"
        ];

        $("#clearBazaar").click(() => {
            $("#bazaarInput").val("");
            blacket.getBazaar("");
        });

        $(function reset() {
            if (blacket.user) {
                $("#tokenBalance").html(`<img loading="lazy" src="/content/tokenIcon.png" alt="Token" class="styles__tokenBalanceIcon___3MGhs-camelCase" draggable="false"><div>${blacket.user.tokens.toLocaleString()}</div>`);
                $("div.styles__button___1_E-G-camelCase:nth-child(3)").click(() => {
                    if ($("div.styles__button___1_E-G-camelCase:nth-child(3) > div:nth-child(3) > div:nth-child(1)").html() == "Blooks") {
                        $("div.styles__button___1_E-G-camelCase:nth-child(3) > div:nth-child(3) > div:nth-child(1)").html("Items")
                        blookSelector.style.display = "none";
                        itemSelector.style.display = "flex";
                    } else {
                        $("div.styles__button___1_E-G-camelCase:nth-child(3) > div:nth-child(3) > div:nth-child(1)").html("Blooks");
                        blookSelector.style.display = "flex";
                        itemSelector.style.display = "none";
                    }
                });

                for (const item in blacket.items) {
                    const itemId = Math.random().toString(36).substring(2, 15);
                    $("#itemSelector").append(`<div id="${itemId}" class="styles__bazaarSelectorItem___Meg69-camelCase">
                                <img loading="lazy" class="styles__bazaarSelectorItemImage___KriA4-camelCase"
                                    src="/content/items/${item.replaceAll(" (Item)", "")}.png" draggable="false">
                            </div>`);
                    $(`#${itemId}`).click(() => {
                        blacket.startLoading();
                        blacket.getBazaar(item);
                        $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val(item);
                    });
                }

                blacket.requests.get(`/worker/bazaar?item=${blacket.user.id}`, (data) => {
                    $(".loader").remove();
                    if (data.bazaar.length == 0) return $("#myListings").append(`<div style="text-align: center;font-size: 1.302vw;color: white;">You have no listings.</div>`);
                    data.bazaar.forEach((listing) => {
                        $("#myListings").append(`
                        <div id="${listing.id}" class="styles__bazaarItem___Meg69-camelCase" style="
                            width: calc(100% - 2vw);
                            justify-content: space-between;
                        ">
                            <img loading="lazy" style="position: unset; margin-left: 1vw;height: 70%; width: auto;" class="styles__bazaarItemImage___KriA4-camelCase" src="${items.includes(listing.item) ? `/content/items/${listing.item.replaceAll(" (Item)", "")}.png` : blacket.blooks[listing.item] ? blacket.blooks[listing.item].image : "/content/blooks/Error.png"}">
                            <div style="margin-right: 2vw; font-size: large;">
                                <div style="position: unset; font-size: 1.45vw;" class="styles__bazaarItemAuthor___Fk3A1-camelCase">${listing.item}</div>
                                <div style="position: unset; font-size: 1.3vw; display: flex; justify-content: flex-end; gap: 0.3vw;" class="styles__bazaarItemPrice___KG4aZ-camelCase">${listing.price.toLocaleString()} <img loading="lazy" style="height: 1.5vw; width: auto;position: relative;top: 0.130vw;" src="/content/tokenIcon.png"></div>
                            </div>
                        </div>`);
                        if (items.includes(listing.item)) {
                            $(`#${listing.id}`).attr("style", `background: ${blacket.items[listing.item].color};`);
                        }
                        $(`#${listing.id}`).click(() => {
                            blacket.startLoading();
                            blacket.requests.post(`/worker/bazaar/remove`, {
                                id: listing.id
                            }, (data) => {
                                let findItem = items.find(x => x == '1 Hour Booster');
                                !findItem ? blacket.user.blooks[listing.item] = blacket.user.blooks[listing.item] + 1 || 1 : null
                                if (data.error) {
                                    blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    });
                                    return blacket.stopLoading();
                                }
                                $(`#${listing.id}`).remove();
                                blacket.stopLoading();
                            });
                        });
                    });
                });
                blacket.getBazaar = (search) => {
                    blacket.requests.get(`/worker/bazaar${search ? `?item=${search}` : ""}`, (data) => {
                        $(".styles__bazaarItemsContainer___GkAC2-camelCase").html("");
                        blacket.stopLoading();
                        data.bazaar.forEach((listing) => {
                            if (listing.seller == blacket.user.username) return;
                            $(".styles__bazaarItemsContainer___GkAC2-camelCase").append(`
                            <div id="${listing.id}" class="styles__bazaarItem___Meg69-camelCase">
                                <img loading="lazy" class="styles__bazaarItemImage___KriA4-camelCase" src="${items.includes(listing.item) ? `/content/items/${listing.item.replaceAll(" (Item)", "")}.png` : blacket.blooks[listing.item] ? blacket.blooks[listing.item].image : "/content/blooks/Error.png"}">
                                <div class="styles__bazaarItemAuthor___Fk3A1-camelCase">${listing.seller}</div>
                                <div class="styles__bazaarItemPrice___KG4aZ-camelCase">${listing.price.toLocaleString()} <img loading="lazy" style="width: 10%;position: relative;top: 0.130vw;" src="/content/tokenIcon.png"></div>
                            </div>`);
                            if (items.includes(listing.item)) {
                                $(`#${listing.id}`).attr("style", `background: ${blacket.items[listing.item].color};`);
                            }
                            $(`#${listing.id}`).click(() => {
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"> <div class="styles__text___KSL4--camelCase"> <div> Buy ${listing.item} ${items.includes(listing.item) ? "item" : "Blook"} for ${listing.price.toLocaleString()} tokens? </div></div><div class="styles__holder___3CEfN-camelCase"> <div class="styles__buttonContainer___2EaVD-camelCase"> <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div></div><div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div></div></div></div><input type="submit" style="opacity: 0; display: none;"/> </form> </div>`);
                                $(".styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                });
                                if (blacket.user.tokens < listing.price) {
                                    $("div.styles__button___1_E-G-camelCase:nth-child(2) > div:nth-child(3)").html(`Not Enough Tokens`);
                                    $(".styles__button___1_E-G-camelCase:nth-child(1)").remove();
                                } else $(".styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                    blacket.startLoading();
                                    blacket.requests.post("/worker/bazaar/buy", {
                                        id: listing.id
                                    }, (data) => {
                                        if (data.error) {
                                            blacket.createToast({
                                                title: "Error",
                                                message: data.reason,
                                                icon: "/content/blooks/Error.png",
                                                time: 5000
                                            });
                                            return blacket.stopLoading();
                                        }
                                        blacket.user.tokens -= listing.price;
                                        $("#tokenBalance > div:nth-child(2)").html(blacket.user.tokens.toLocaleString());
                                        $(`#${listing.id}`).remove();
                                        blacket.stopLoading();
                                    });
                                });
                            });
                        });
                    });
                }
                $(".styles__numRow___xh98F-camelCase").on("keydown", (e) => {
                    if (e.key == "Enter") {
                        blacket.startLoading();
                        blacket.getBazaar(`${$(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val()}`);
                    }
                });
                let packBlooks = [];
                Object.keys(blacket.packs).forEach((pack) => {
                    blacket.packs[pack].blooks.forEach((blook) => {
                        packBlooks.push(blook);
                    });
                });
                let miscBlooks = [];
                Object.keys(blacket.blooks).forEach((blook) => {
                    if (!packBlooks.includes(blook)) miscBlooks.push(blook);
                });
                Object.keys(blacket.packs).forEach((pack) => {
                    let packId = Math.random().toString(36).substring(2, 15);
                    $("#miscellaneousPack").before(`<div id="${packId}" class="styles__bazaarSelectorItem___Meg69-camelCase">
                            <img loading="lazy" class="styles__bazaarSelectorItemImage___KriA4-camelCase"
                                src="${blacket.packs[pack].image}" draggable="false"></div>`);
                    $(`#${packId}`).click(() => {
                        $("#blookSelector").html("");
                        blookSelector.style.display = "flex";
                        itemSelector.style.display = "none";
                        $("div.styles__button___1_E-G-camelCase:nth-child(3) > div:nth-child(3) > div:nth-child(1)").html("Blooks");
                        blacket.packs[pack].blooks.forEach((blook) => {
                            let blookId = Math.random().toString(36).substring(2, 15);
                            $("#blookSelector").append(`<div id="${blookId}" class="styles__bazaarSelectorItem___Meg69-camelCase">
                                    <img loading="lazy" class="styles__bazaarSelectorItemImage___KriA4-camelCase" src="${blacket.blooks[blook] ? blacket.blooks[blook].image : "/content/blooks/Error.png"}" draggable="false"></div>`);
                            $(`#${blookId}`).click(() => {
                                blacket.startLoading();
                                blacket.getBazaar(blook);
                                $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val(blook);
                            });
                        });
                    });
                });
                $("#miscellaneousPack").click(() => {
                    $("#blookSelector").html("");
                    blookSelector.style.display = "flex";
                    itemSelector.style.display = "none";
                    $("div.styles__button___1_E-G-camelCase:nth-child(3) > div:nth-child(3) > div:nth-child(1)").html("Blooks");
                    miscBlooks.forEach((blook) => {
                        let blookId = Math.random().toString(36).substring(2, 15);
                        $("#blookSelector").append(`<div id="${blookId}" class="styles__bazaarSelectorItem___Meg69-camelCase">
                                    <img loading="lazy" class="styles__bazaarSelectorItemImage___KriA4-camelCase" src="${blacket.blooks[blook] ? blacket.blooks[blook].image : "/content/blooks/Error.png"}" draggable="false"></div>`);
                        $(`#${blookId}`).click(() => {
                            blacket.startLoading();
                            blacket.getBazaar(blook);
                            $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val(blook);
                        });
                    });
                });
                $("div.styles__button___1_E-G-camelCase:nth-child(5)").click(() => {
                    blacket.startLoading();
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val("");
                    blacket.getBazaar();
                });
                blacket.getBazaar();
            } else setTimeout(reset, 1);
        });
    } else if (location.pathname.split('/')[1].split('?')[0] == 'blooks') {
        $(function reset() {
            if (blacket.user) {
                blacket.selectBlook = (blook) => {
                    if (!blacket.blooks[blook]) return;
                    $(`.styles__rightBackground___36mp5-camelCase`).attr(`src`, blacket.blooks[blook].art || `/content/packs/art/Default.png`)
                    $(`.styles__highlightedName___2wOtf-camelCase > div:nth-child(1)`).text(blook.length > 14 ? $(`.styles__highlightedName___2wOtf-camelCase > div:nth-child(1)`).attr(`style`, `font-size: 1.719vw; font-family: Titan One;`) && blook : $(`.styles__highlightedName___2wOtf-camelCase > div:nth-child(1)`).attr(`style`, `font-size: 2.083vw; font-family: Titan One;`) && blook);
                    $(`div.styles__blookContainer___36LK2-camelCase:nth-child(3) > img:nth-child(1)`).attr(`src`, blacket.blooks[blook].image);
                    $(`.styles__highlightedRarity___1EXx_-camelCase`).html(blacket.blooks[blook].rarity);
                    if (blacket.rarities[blacket.blooks[blook].rarity] ? blacket.rarities[blacket.blooks[blook].rarity].color == "rainbow" : false) {
                        $(`.styles__highlightedRarity___1EXx_-camelCase`).attr(`class`, `styles__highlightedRarity___1EXx_-camelCase rainbow`);
                        $(`.styles__highlightedRarity___1EXx_-camelCase`).attr(`style`, `color: ${blacket.rarities[blacket.blooks[blook].rarity].color}; text-shadow: 0.000vw 0.000vw 52.083vw black;`);
                    } else {
                        $(`.styles__highlightedRarity___1EXx_-camelCase`).attr(`class`, `styles__highlightedRarity___1EXx_-camelCase`);
                        $(`.styles__highlightedRarity___1EXx_-camelCase`).attr(`style`, `color: ${blacket.rarities[blacket.blooks[blook].rarity] ? blacket.rarities[blacket.blooks[blook].rarity].color : "#ffffff"};`);
                    }
                    $(`.styles__highlightedBottom___QmY2Y-camelCase`).html(`${blacket.user.blooks[blook].toLocaleString()} Owned`);
                    blacket.blooks.selected = blook;
                }
                setTimeout(() => {
                    blacket.selectBlook(Object.keys(blacket.user.blooks)[Math.floor(Math.random() * Object.keys(blacket.user.blooks).length)])
                }, 250);
                blacket.sellBlook = (quantity) => {
                    if (quantity == `` || quantity == 0) return;
                    $(`.arts__modal___VpEAD-camelCase`).remove();
                    blacket.startLoading();
                    blacket.requests.post("/worker/sell", {
                        blook: blacket.blooks.selected,
                        quantity: quantity
                    }, (data) => {
                        blacket.stopLoading();
                        if (data.error) {
                            blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            return blacket.stopLoading();
                        }
                        blacket.user.tokens += blacket.blooks[blacket.blooks.selected].price * quantity;
                        blacket.user.blooks[blacket.blooks.selected] -= quantity;
                        if (blacket.user.blooks[blacket.blooks.selected] < 1) {
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(2)`).remove();
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")}`).append(`<i class="fas fa-lock styles__blookLock___3Kgua-camelCase" aria-hidden="true"></i>`);
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")}`).attr("style", "cursor: auto;");
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(1)`).attr("class", "styles__blookContainer___36LK2-camelCase styles__blook___bNr_t-camelCase styles__lockedBlook___3oGaX-camelCase");
                            delete blacket.user.blooks[blacket.blooks.selected];
                            blacket.blooks.selected = Object.keys(blacket.user.blooks)[Math.floor(Math.random() * Object.keys(blacket.user.blooks).length)];
                        } else $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(2)`).html(blacket.user.blooks[blacket.blooks.selected].toLocaleString());
                        blacket.selectBlook(blacket.blooks.selected);
                    });
                }
                blacket.listBlook = (price) => {
                    if (price == `` || price == 0) return;
                    $(`.arts__modal___VpEAD-camelCase`).remove();
                    blacket.startLoading();
                    blacket.requests.post("/worker/bazaar/list", {
                        item: blacket.blooks.selected,
                        price: price
                    }, (data) => {
                        blacket.stopLoading();
                        if (data.error) {
                            blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            return blacket.stopLoading();
                        }
                        blacket.user.blooks[blacket.blooks.selected] -= 1;
                        if (blacket.user.blooks[blacket.blooks.selected] < 1) {
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(2)`).remove();
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")}`).append(`<i class="fas fa-lock styles__blookLock___3Kgua-camelCase" aria-hidden="true"></i>`);
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")}`).attr("style", "cursor: auto;");
                            $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(1)`).attr("class", "styles__blookContainer___36LK2-camelCase styles__blook___bNr_t-camelCase styles__lockedBlook___3oGaX-camelCase");
                            delete blacket.user.blooks[blacket.blooks.selected];
                            blacket.blooks.selected = Object.keys(blacket.user.blooks)[Math.floor(Math.random() * Object.keys(blacket.user.blooks).length)];
                        } else $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(2)`).html(blacket.user.blooks[blacket.blooks.selected].toLocaleString());
                        blacket.selectBlook(blacket.blooks.selected);
                    });
                }
                blacket.appendBlooks = (search) => {
                    let packBlooks = [];
                    $(".styles__blooksHolder___3qZR1-camelCase").html("");
                    if (!search) search = "";
                    Object.keys(blacket.packs).reverse().forEach((pack) => {
                        if (blacket.packs[pack].hidden) return;
                        let packId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
                        $(".styles__blooksHolder___3qZR1-camelCase").append(`<div class="styles__setHolder___rVq3Z-camelCase"><div class="styles__setTop___wIaVS-camelCase"><div class="styles__setTopBackground___342Wr-camelCase" style="background-image: url('/content/blookTile.png');"></div><div class="styles__setText___1PQLQ-camelCase">${pack} Pack</div><div class="styles__setDivider___3da0c-camelCase"></div></div><div id="${packId}" class="styles__setBlooks___3xamH-camelCase"></div></div>`);
                        Object.entries(blacket.packs[pack].blooks).forEach((blook) => {
                            packBlooks.push(blook[1]);
                            let locked;
                            if (!blacket.user.blooks[blook[1]]) locked = {
                                class: `styles__lockedBlook___3oGaX-camelCase`,
                                i: `<i class="fas fa-lock styles__blookLock___3Kgua-camelCase" aria-hidden="true"></i>`,
                                quantity: ``,
                                cursor: 'auto'
                            }
                            else {
                                let quantity;
                                if (!blacket.blooks[blook[1]]) blacket.blooks[blook[1]] = {
                                    rarity: "Unknown",
                                    image: "/content/blooks/Error.png",
                                    price: 0
                                };
                                if (!blacket.rarities[blacket.blooks[blook[1]].rarity]) blacket.rarities[blacket.blooks[blook[1]].rarity] = {
                                    animation: "none",
                                    color: "#ffffff",
                                    exp: 0,
                                    wait: 750
                                };
                                if (blacket.rarities[blacket.blooks[blook[1]].rarity].color == "rainbow") quantity = `<div class="styles__blookText___3AMdK-camelCase" style="background-image: url('/content/rainbow.gif');">${blacket.user.blooks[blook[1]].toLocaleString()}</div></div>`;
                                else quantity = `<div class="styles__blookText___3AMdK-camelCase" style="background-color: ${blacket.rarities[blacket.blooks[blook[1]].rarity].color};">${blacket.user.blooks[blook[1]].toLocaleString()}</div></div>`;
                                locked = {
                                    class: ``,
                                    i: ``,

                                    quantity: quantity,
                                    cursor: 'pointer'
                                }
                            }
                            if (blook[1].toLowerCase().startsWith(search.toLowerCase()) || blook[1].toLowerCase().includes(search.toLowerCase()) || search == "") {
                                $(`#${packId}`).append(`<div id="${blook[1].replaceAll(' ', '-').replaceAll("'", "_")}" class="styles__blookContainer___3JrKb-camelCase" style="cursor: ${locked.cursor}" role="button" tabindex="0"><div class="styles__blookContainer___36LK2-camelCase styles__blook___bNr_t-camelCase ${locked.class}"><img loading="lazy" src="${blacket.blooks[blook[1]].image}" draggable="false" class="styles__blook___1R6So-camelCase" /></div>${locked.i}${locked.quantity}`);
                                $(`#${blook[1].replaceAll(' ', '-').replaceAll("'", "_")}`).click(function() {
                                    if (this.children[0].classList.contains(`styles__lockedBlook___3oGaX-camelCase`)) return;
                                    blacket.selectBlook(blook[1]);
                                });
                            }
                        });
                    });
                    let uncatogorizedBlooks = [];
                    Object.keys(blacket.user.blooks).forEach(blook => {
                        if (!packBlooks.includes(blook)) uncatogorizedBlooks.push(blook);
                    });
                    if (uncatogorizedBlooks.length > 0) {
                        let packId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
                        $(".styles__blooksHolder___3qZR1-camelCase").append(`<div class="styles__setHolder___rVq3Z-camelCase"><div class="styles__setTop___wIaVS-camelCase"><div class="styles__setTopBackground___342Wr-camelCase" style="background-image: url('/content/blookTile.png');"></div><div class="styles__setText___1PQLQ-camelCase">Miscellaneous</div><div class="styles__setDivider___3da0c-camelCase"></div></div><div id="${packId}" class="styles__setBlooks___3xamH-camelCase"></div></div>`);
                        uncatogorizedBlooks.forEach(blook => {
                            if (!blacket.blooks[blook]) blacket.blooks[blook] = {
                                rarity: "Unknown",
                                image: "/content/blooks/Error.png",
                                price: 0
                            }
                            let quantity;
                            if (blacket.rarities[blacket.blooks[blook].rarity] && blacket.rarities[blacket.blooks[blook].rarity].color == "rainbow") quantity = `<div class="styles__blookText___3AMdK-camelCase" style="background-image: url('/content/rainbow.gif');">${blacket.user.blooks[blook].toLocaleString()}</div></div>`;
                            else quantity = `<div class="styles__blookText___3AMdK-camelCase" style="background-color: ${blacket.rarities[blacket.blooks[blook].rarity] ? blacket.rarities[blacket.blooks[blook].rarity].color : "#ffffff"};">${blacket.user.blooks[blook].toLocaleString()}</div></div>`;
                            if (blook.toLowerCase().startsWith(search.toLowerCase()) || blook.toLowerCase().includes(search.toLowerCase()) || search == "") {
                                $(`#${packId}`).append(`<div id="${blook.replaceAll(' ', '-').replaceAll("'", "_")}" class="styles__blookContainer___3JrKb-camelCase" style="cursor: pointer" role="button" tabindex="0"><div class="styles__blookContainer___36LK2-camelCase styles__blook___bNr_t-camelCase"><img loading="lazy" src="${blacket.blooks[blook].image}" draggable="false" class="styles__blook___1R6So-camelCase" /></div>${quantity}`);
                                $(`#${blook.replaceAll(' ', '-').replaceAll("'", "_")}`).click(function() {
                                    blacket.selectBlook(blook);
                                });
                            }
                        });
                    }
                    $(".styles__setHolder___rVq3Z-camelCase").each(function() {
                        if ($(this).children()[1].childNodes.length == 0) $(this).remove();
                    });
                }

                $(`#sellButton`).click(() => {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <form class="styles__container___1BPm9-camelCase">
                    <div class="styles__text___KSL4--camelCase">Sell ${blacket.blooks.selected} Blooks for ${blacket.blooks[blacket.blooks.selected].price.toLocaleString()} tokens each:</div>
                    <div class="styles__holder___3CEfN-camelCase">
                        <div class="styles__numRow___xh98F-camelCase">
                            <div class="styles__inputContainer___2Fn7J-camelCase" style="width: 4.167vw; margin: 0.000vw;"><input class="styles__input___2vJSW-camelCase" placeholder="" type="tel" value="" style="width: 3.125vw;"/></div>
                            <div class="styles__numTotal___3LQaw-camelCase">/ ${blacket.user.blooks[blacket.blooks.selected].toLocaleString()}</div>
                        </div>
                        <div class="styles__buttonContainer___2EaVD-camelCase">
                            <div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div>
                            </div>
                            <div id="noButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div>
                            </div>
                        </div>
                    </div>
                    <input type="submit" style="opacity: 0; display: none;" />
                </form>
                        </div>`);
                    $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                        event.preventDefault();
                        blacket.sellBlook($(`.styles__input___2vJSW-camelCase`).val());
                    });
                    $(`.styles__input___2vJSW-camelCase`).focus();
                    $(`#yesButton`).click(() => {
                        blacket.sellBlook($(`.styles__input___2vJSW-camelCase`).val());
                    });
                    $(`#noButton`).click(() => {
                        $(`.arts__modal___VpEAD-camelCase`).remove();
                    });
                    $(`.styles__input___2vJSW-camelCase`).on('input', () => {
                        if (/[^0-9]/.test($(`.styles__input___2vJSW-camelCase`).val())) {
                            $(`.styles__input___2vJSW-camelCase`).val($(`.styles__input___2vJSW-camelCase`).val().replace(/[^0-9]/g, ''));
                        }
                        if ($(`.styles__input___2vJSW-camelCase`).val() > blacket.user.blooks[blacket.blooks.selected]) {
                            $(`.styles__input___2vJSW-camelCase`).val(blacket.user.blooks[blacket.blooks.selected]);
                        }
                    });
                });
                $(`#listButton`).click(() => {
                    blacket.startLoading();
                    blacket.requests.get(`/worker/bazaar?item=${blacket.blooks.selected}`, (data) => {
                        let value;
                        if (data.bazaar[0]) {
                            if (data.bazaar[0].price > blacket.blooks[blacket.blooks.selected].bazaarMinimumListingPrice) value = data.bazaar[0].price - 1;
                            else value = blacket.blooks[blacket.blooks.selected].bazaarMinimumListingPrice;
                        } else value = blacket.blooks[blacket.blooks.selected].bazaarMinimumListingPrice;
                        $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                <form class="styles__container___1BPm9-camelCase">
                    <div class="styles__text___KSL4--camelCase">List ${blacket.blooks.selected} Blook for how many tokens?</div>
                    <div style="color: white; margin-bottom: 0.6vw; padding: 0.5vw; width: calc(100% - 1vw); background: rgba(0,0,0,0.1);">${data.bazaar.map(l => { return `<b>${l.price}</b>` }).join(', ')}</div>
                    <div class="styles__holder___3CEfN-camelCase">
                    <div class="styles__numRow___xh98F-camelCase">
                    <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                    border-radius: 0.313vw;
                    width: 90%;
                    height: 2.604vw;
                    margin: 0.000vw;
                    display: flex;
                    flex-direction: row;
                    align-items: center;"><input style="  border: none;
                    height: 2.083vw;
                    line-height: 2.083vw;
                    font-size: 1.458vw;
                    text-align: center;
                    font-weight: 700;
                    font-family: Nunito, sans-serif;
                    color: #ffffff;
                    background-color: #3f3f3f;
                    outline: none;
                    width: 100%;
                  " placeholder="Price" maxlength="9" value="${value}"></div>
                </div>
                        <div class="styles__buttonContainer___2EaVD-camelCase">
                            <div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">List</div>
                            </div>
                            <div id="noButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                            </div>
                        </div>
                    </div>
                    <input type="submit" style="opacity: 0; display: none;" />
                </form>
                        </div>`);
                        $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                            event.preventDefault();
                            blacket.listBlook($(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val());
                        });
                        $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).focus();
                        $(`#yesButton`).click(() => {
                            blacket.listBlook($(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val());
                        });
                        $(`#noButton`).click(() => {
                            $(`.arts__modal___VpEAD-camelCase`).remove();
                        });
                        $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).on('input', () => {
                            if (/[^0-9]/.test($(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val())) {
                                $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val($(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val().replace(/[^0-9]/g, ''));
                            }
                        });
                        blacket.stopLoading();
                    });
                });
                $("#searchInput").on('input', () => {
                    blacket.appendBlooks($("#searchInput").val());
                });
                blacket.appendBlooks();
                blacket.stopLoading();
            } else setTimeout(reset, 1);
        });
        document.querySelector('#app').innerHTML += `<div class="styles__right___385mx-camelCase">
        <img loading="lazy" src="/content/packs/art/Default.png" alt="Background" class="styles__rightBackground___36mp5-camelCase" draggable="false">
        <div class="styles__rightTopText___2VrKK-camelCase">
            <div class="styles__highlightedName___2wOtf-camelCase" style="font-size: 2.083vw;">
                <div style="display: block; white-space: nowrap; font-family: Titan One;">name</div>
            </div>
            <div class="styles__highlightedRarity___1EXx_-camelCase" style="color: #ffffff;">
                rarity</div>
        </div>
        <div class="styles__blookContainer___36LK2-camelCase styles__rightBlook___1JkY7-camelCase">
            <img loading="lazy" src="/content/blooks/Default.png" draggable="false" class="styles__blook___1R6So-camelCase">
        </div>
        <div class="styles__highlightedBottom___QmY2Y-camelCase">owned</div>
        <div class="styles__rightBottom___F7qsO-camelCase"></div>
    </div>

    <div class="styles__rightButtonRow___3a0GF-camelCase">
        <div id="sellButton" class="styles__button___1_E-G-camelCase styles__rightButton___2_ZIX-camelCase" role="button" tabindex="0">
            <div class="styles__shadow___3GMdH-camelCase"></div>
            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
            <div class="styles__front___vcvuy-camelCase" style="background-color: #2f2f2f;">
                <div class="styles__rightButtonInside___14imT-camelCase">
                    <img loading="lazy" src="/content/tokenIcon.png" alt="Token" class="styles__rightButtonImg___1WJdo-camelCase" draggable="false">
                    Sell
                </div>
            </div>
        </div>
        <div id="listButton" class="styles__button___1_E-G-camelCase styles__rightButton___2_ZIX-camelCase" role="button" tabindex="0">
            <div class="styles__shadow___3GMdH-camelCase"></div>
            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
            <div class="styles__front___vcvuy-camelCase" style="background-color: #2f2f2f;">
                <div class="styles__rightButtonInside___14imT-camelCase">
                    <i class="styles__rightButtonImg___1WJdo-camelCase fas fa-gavel"></i>
                    List
                </div>
            </div>
        </div>
    </div>`
    } else if (location.pathname.split('/')[1].split('?')[0] == 'market') {
        $(function reset() {
            if (blacket.user) {
                if (Math.random() * 100 <= 1) $(".styles__cashierBlook___iI1UH-camelCase").attr("src", `/content/ankha.png`);
                if (localStorage.getItem('instantOpen')) $(".styles__instantButton___2ezEk-camelCase").html(`Instant Open: On`);
                else $(".styles__instantButton___2ezEk-camelCase").html(`Instant Open: Off`);
                blacket.setInstantButton = (on) => {
                    c = on == true ? "On" : "Off";
                    $(".styles__instantButton___2ezEk-camelCase").html(`Instant Open: ${c}`);

                    if (on) localStorage.setItem('instantOpen', true);
                    else localStorage.removeItem('instantOpen');
                }
                $(".styles__instantButton___2ezEk-camelCase").click(() => {
                    blacket.setInstantButton(localStorage.getItem('instantOpen') ? false : true);
                });
                if (!blacket.booster.active) {
                    $("#boosterText").html(`There is no booster active.`);
                } else {
                    blacket.requests.get(`/worker/user/${blacket.booster.user}`, (user) => {
                        $("#boosterText").html(`${user.user.username} is currently boosting the chances by ${blacket.booster.multiplier}x! The booster will end at ${new Date(blacket.booster.time * 1000).toLocaleTimeString()}.`);
                    });
                }
                blacket.openPack = (pack) => {
                    blacket.user.tokens = blacket.user.tokens - blacket.packs[pack].price;
                    $("#tokenBalance > div:nth-child(2)").html(blacket.user.tokens.toLocaleString());
                    $(".arts__modal___VpEAD-camelCase").remove();
                    blacket.startLoading();
                    blacket.requests.post("/worker/open", {
                        pack: pack
                    }, (data) => {
                        if (data.error) {
                            blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            blacket.user.tokens = blacket.user.tokens + blacket.packs[pack].price;
                            $("#tokenBalance > div:nth-child(2)").html(blacket.user.tokens.toLocaleString());
                            return blacket.stopLoading();
                        }

                        let chance;
                        if (blacket.booster.active && blacket.blooks[data.blook].chance <= 10) chance = Math.floor((blacket.blooks[data.blook].chance * blacket.booster.multiplier) * 10000) / 10000;
                        else chance = Math.floor((blacket.blooks[data.blook].chance) * 10000) / 10000;
                        if (!blacket.user.blooks[data.blook]) {
                            let blookName = `${chance}% - NEW!`;
                            blacket.user.blooks[data.blook] = 1;
                        } else {
                            let blookName = `${chance}%`;
                            blacket.user.blooks[data.blook]++;
                        }

                        if (blacket.blooks[data.blook].art) {
                            let blookArt = blacket.blooks[data.blook].art;
                        } else {
                            let blookArt = "/content/packs/art/Default.png";
                        }

                        let backgroundId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);

                        $("body").attr("style", "overflow: hidden;");
                        $("body").append(`<div id="${backgroundId}" class="styles__openBackground___-U4oX-camelCase" style="background: radial-gradient(circle, ${blacket.packs[pack].color1} 0%, ${blacket.packs[pack].color2} 100%);">
                        <div class="styles__openContainer___3paFG-camelCase">
                        <img loading="lazy" src="${blookArt}" class="styles__blookBackground___3rt4N-camelCase" draggable="false">
                            <div class="styles__blookContainer___36LK2-camelCase styles__unlockedBlookImage___wC4gr-camelCase">
                                <img loading="lazy" src="${blacket.blooks[data.blook].image}" draggable="false" class="styles__blook___1R6So-camelCase" />
                            </div>
                            <div class="styles__unlockedText___1diat-camelCase">
                                <div class="styles__unlockedBlook___2pr1Z-camelCase" style="font-size: 2.031vw;"><div style="display: block; white-space: nowrap;font-family: Titan One;">${data.blook}</div></div>
                                <div class="styles__rarityText___1PfSA-camelCase" style="color: ${blacket.rarities[blacket.blooks[data.blook].rarity].color};">${blacket.blooks[data.blook].rarity}</div>
                            </div>
                            <div class="styles__bottomText___3_k10-camelCase">${blookName}</div>
                            <div class="styles__bottomShadow___10ZLG-camelCase"></div>
                        </div>
                        <div class="styles__openPackContainer___2m4Yf-camelCase" role="button" tabindex="0">
                        <div style="transform: rotate(0deg);">
                            <img loading="lazy" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);min-width: 16.406vw;object-fit: cover;height: 15.625vw;object-position: bottom; margin-top:1.094vw;" src="${blacket.packs[pack].image}">
                            <div class="styles__openPack___3QxCP-camelCase" style="background-image: url('/content/packSeelOpen.png');transform: scale(0.99);"></div>
                            </div>
                        </div>
                        <div class="styles__openBigButton___3KmDM-camelCase styles__canOpen___2znG2-camelCase" role="button" tabindex="0"></div>
                    </div>
                    `);
                        blacket.stopLoading();
                        $(".styles__openBigButton___3KmDM-camelCase").click(() => {
                            $(".styles__openBigButton___3KmDM-camelCase").unbind("click");
                            $(".styles__openPackContainer___2m4Yf-camelCase").attr("class", "styles__openingPackContainer___1ZQzY-camelCase");
                            $(".styles__openPack___3QxCP-camelCase").attr("class", "styles__openPack___3QxCP-camelCase styles__isOpeningPack___1qY5t-camelCase")
                            $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainer___2OmG9-camelCase");
                            if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "epic") $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainerEpic___3TzCR-camelCase");
                            else if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "legendary") $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainerLegendary___RbJZ_-camelCase");
                            else if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "chroma" || blacket.rarities[blacket.blooks[data.blook].rarity].animation == "mystical") $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainerChroma___3VBd5-camelCase");
                            setTimeout(() => {
                                $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(1deg);");
                            }, 270);
                            setTimeout(() => {
                                $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(2deg);");
                            }, 300);
                            setTimeout(() => {
                                $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(2.5deg);");
                            }, 330);
                            setTimeout(() => {
                                $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(0deg);");
                            }, 410);
                            setTimeout(() => {
                                $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1) > img:nth-child(1)").remove();
                            }, 650);
                            if (blacket.rarities[blacket.blooks[data.blook].rarity].color == "rainbow") {
                                $(".styles__rarityText___1PfSA-camelCase").attr("class", "styles__rarityText___1PfSA-camelCase rainbow");
                                $(".styles__rarityText___1PfSA-camelCase").attr("style", `color: ${blacket.rarities[blacket.blooks[data.blook].rarity].color}; text-shadow: 0 0 52.083vw black;`);
                            }

                            setTimeout(() => {
                                if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "uncommon") {
                                    var config = {
                                        type: Phaser.WEBGL,
                                        width: window.innerWidth,
                                        height: window.innerHeight,
                                        parent: document.getElementById(backgroundId),
                                        render: {
                                            transparent: true
                                        },
                                        scene: {
                                            preload: preload,
                                            create: create
                                        }
                                    };

                                    game = new Phaser.Game(config);

                                    function preload() {
                                        this.load.image('1', '/content/particles/1.png');
                                        this.load.image('2', '/content/particles/2.png');
                                        this.load.image('3', '/content/particles/3.png');
                                        this.load.image('4', '/content/particles/4.png');
                                        this.load.image('5', 'content/particles/5.png');
                                        this.load.image('6', 'content/particles/6.png');
                                        this.load.image('7', '/content/particles/7.png');
                                    }

                                    function create() {
                                        particle1 = this.add.particles('1');
                                        particle2 = this.add.particles('2');
                                        particle3 = this.add.particles('3');
                                        particle4 = this.add.particles('4');
                                        particle5 = this.add.particles('5');
                                        particle6 = this.add.particles('6');
                                        particle7 = this.add.particles('7');

                                        let emitter1 = particle1.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 800
                                            },
                                            angle: {
                                                min: -115,
                                                max: -65
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            velocityFromRotation: true,
                                            gravityY: 700,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth / 2 - 25,
                                                max: window.innerWidth / 2 + 25
                                            },
                                            y: window.innerHeight / 2 + 25,
                                        });

                                        let emitter2 = particle2.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 800
                                            },
                                            angle: {
                                                min: -115,
                                                max: -65
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            velocityFromRotation: true,
                                            gravityY: 700,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth / 2 - 25,
                                                max: window.innerWidth / 2 + 25
                                            },
                                            y: window.innerHeight / 2 + 25,
                                        });

                                        let emitter3 = particle3.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 800
                                            },
                                            angle: {
                                                min: -115,
                                                max: -65
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            velocityFromRotation: true,
                                            gravityY: 700,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth / 2 - 25,
                                                max: window.innerWidth / 2 + 25
                                            },
                                            y: window.innerHeight / 2 + 25,
                                        });

                                        let emitter4 = particle4.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 800
                                            },
                                            angle: {
                                                min: -115,
                                                max: -65
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            velocityFromRotation: true,
                                            gravityY: 700,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth / 2 - 25,
                                                max: window.innerWidth / 2 + 25
                                            },
                                            y: window.innerHeight / 2 + 25,
                                        });

                                        let emitter5 = particle5.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 800
                                            },
                                            angle: {
                                                min: -115,
                                                max: -65
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            velocityFromRotation: true,
                                            gravityY: 700,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth / 2 - 25,
                                                max: window.innerWidth / 2 + 25
                                            },
                                            y: window.innerHeight / 2 + 25,
                                        });

                                        let emitter6 = particle6.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 800
                                            },
                                            angle: {
                                                min: -115,
                                                max: -65
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            velocityFromRotation: true,
                                            gravityY: 700,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth / 2 - 25,
                                                max: window.innerWidth / 2 + 25
                                            },
                                            y: window.innerHeight / 2 + 25,
                                        });

                                        let emitter7 = particle7.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 800
                                            },
                                            angle: {
                                                min: -115,
                                                max: -65
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            velocityFromRotation: true,
                                            gravityY: 700,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth / 2 - 25,
                                                max: window.innerWidth / 2 + 25
                                            },
                                            y: window.innerHeight / 2 + 25,
                                        });

                                        setTimeout(() => {
                                            emitter1.stop();
                                            emitter2.stop();
                                            emitter3.stop();
                                            emitter4.stop();
                                            emitter5.stop();
                                            emitter6.stop();
                                            emitter7.stop();
                                        }, 1500);
                                    }
                                } else if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "rare") {
                                    var config = {
                                        type: Phaser.WEBGL,
                                        width: window.innerWidth,
                                        height: window.innerHeight,
                                        parent: document.getElementById(backgroundId),
                                        render: {
                                            transparent: true
                                        },
                                        scene: {
                                            preload: preload,
                                            create: create
                                        }
                                    };

                                    game = new Phaser.Game(config);

                                    function preload() {
                                        this.load.image('1', '/content/particles/1.png');
                                        this.load.image('2', '/content/particles/2.png');
                                        this.load.image('3', '/content/particles/3.png');
                                        this.load.image('4', '/content/particles/4.png');
                                        this.load.image('5', 'content/particles/5.png');
                                        this.load.image('6', 'content/particles/6.png');
                                        this.load.image('7', '/content/particles/7.png');
                                    }

                                    function create() {
                                        particle1 = this.add.particles('1');
                                        particle2 = this.add.particles('2');
                                        particle3 = this.add.particles('3');
                                        particle4 = this.add.particles('4');
                                        particle5 = this.add.particles('5');
                                        particle6 = this.add.particles('6');
                                        particle7 = this.add.particles('7');

                                        let emitter1 = particle1.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -70,
                                                max: -20
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: -25,
                                                max: 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter2 = particle2.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -70,
                                                max: -20
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: -25,
                                                max: 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter3 = particle3.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -70,
                                                max: -20
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: -25,
                                                max: 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter4 = particle4.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -70,
                                                max: -20
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: -25,
                                                max: 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter5 = particle5.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -70,
                                                max: -20
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: -25,
                                                max: 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter6 = particle6.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -70,
                                                max: -20
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: -25,
                                                max: 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter7 = particle7.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -70,
                                                max: -20
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: -25,
                                                max: 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter8 = particle1.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -160,
                                                max: -110
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth - 25,
                                                max: window.innerWidth + 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter9 = particle2.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -160,
                                                max: -110
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth - 25,
                                                max: window.innerWidth + 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter10 = particle3.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -160,
                                                max: -110
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth - 25,
                                                max: window.innerWidth + 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter11 = particle4.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -160,
                                                max: -110
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth - 25,
                                                max: window.innerWidth + 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter12 = particle5.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -160,
                                                max: -110
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth - 25,
                                                max: window.innerWidth + 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter13 = particle6.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -160,
                                                max: -110
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth - 25,
                                                max: window.innerWidth + 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        let emitter14 = particle7.createEmitter({
                                            scale: 0.25,
                                            speed: {
                                                min: 700,
                                                max: 750
                                            },
                                            angle: {
                                                min: -160,
                                                max: -110
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            gravityY: 500,
                                            frequency: 75,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: window.innerWidth - 25,
                                                max: window.innerWidth + 25
                                            },
                                            y: window.innerHeight,
                                        });

                                        setTimeout(() => {
                                            emitter1.stop();
                                            emitter2.stop();
                                            emitter3.stop();
                                            emitter4.stop();
                                            emitter5.stop();
                                            emitter6.stop();
                                            emitter7.stop();
                                            emitter8.stop();
                                            emitter9.stop();
                                            emitter10.stop();
                                            emitter11.stop();
                                            emitter12.stop();
                                            emitter13.stop();
                                            emitter14.stop();
                                        }, 1500);
                                    }
                                } else if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "epic") {
                                    var config = {
                                        type: Phaser.WEBGL,
                                        width: window.innerWidth,
                                        height: window.innerHeight,
                                        parent: document.getElementById(backgroundId),
                                        render: {
                                            transparent: true
                                        },
                                        scene: {
                                            preload: preload,
                                            create: create
                                        }
                                    };

                                    game = new Phaser.Game(config);

                                    function preload() {
                                        this.load.image('1', '/content/particles/1.png');
                                        this.load.image('2', '/content/particles/2.png');
                                        this.load.image('3', '/content/particles/3.png');
                                        this.load.image('4', '/content/particles/4.png');
                                        this.load.image('5', 'content/particles/5.png');
                                        this.load.image('6', 'content/particles/6.png');
                                        this.load.image('7', '/content/particles/7.png');
                                    }

                                    function create() {
                                        particle1 = this.add.particles('1');
                                        particle2 = this.add.particles('2');
                                        particle3 = this.add.particles('3');
                                        particle4 = this.add.particles('4');
                                        particle5 = this.add.particles('5');
                                        particle6 = this.add.particles('6');
                                        particle7 = this.add.particles('7');

                                        particle1.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -50,
                                                max: 0
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: 0,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle2.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -50,
                                                max: 0
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: 0,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle3.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -50,
                                                max: 0
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: 0,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle4.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -50,
                                                max: 0
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: 0,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle5.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -50,
                                                max: 0
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: 0,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle6.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -50,
                                                max: 0
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: 0,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle7.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -50,
                                                max: 0
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: 0,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle1.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -180,
                                                max: -130
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: game.config.width,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle2.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -180,
                                                max: -130
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: game.config.width,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle3.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -180,
                                                max: -130
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: game.config.width,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle4.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -180,
                                                max: -130
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: game.config.width,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle5.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -180,
                                                max: -130
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: game.config.width,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle6.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -180,
                                                max: -130
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: game.config.width,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });

                                        particle7.createEmitter({
                                            scale: 0.25,
                                            speed: 650,
                                            angle: {
                                                min: -180,
                                                max: -130
                                            },
                                            velocity: {
                                                min: 600,
                                                max: 750
                                            },
                                            gravityY: 400,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: game.config.width,
                                            y: {
                                                min: 0,
                                                max: game.config.width
                                            }
                                        });
                                    }
                                } else if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "legendary") {
                                    var config = {
                                        type: Phaser.WEBGL,
                                        width: window.innerWidth,
                                        height: window.innerHeight,
                                        parent: document.getElementById(backgroundId),
                                        render: {
                                            transparent: true
                                        },
                                        scene: {
                                            preload: preload,
                                            create: create
                                        }
                                    };

                                    game = new Phaser.Game(config);

                                    function preload() {
                                        this.load.image('1', '/content/particles/1.png');
                                        this.load.image('2', '/content/particles/2.png');
                                        this.load.image('3', '/content/particles/3.png');
                                        this.load.image('4', '/content/particles/4.png');
                                        this.load.image('5', 'content/particles/5.png');
                                        this.load.image('6', 'content/particles/6.png');
                                        this.load.image('7', '/content/particles/7.png');
                                    }

                                    function create() {
                                        particle1 = this.add.particles('1');
                                        particle2 = this.add.particles('2');
                                        particle3 = this.add.particles('3');
                                        particle4 = this.add.particles('4');
                                        particle5 = this.add.particles('5');
                                        particle6 = this.add.particles('6');
                                        particle7 = this.add.particles('7');

                                        particle1.createEmitter({
                                            scale: 0.25,
                                            speed: 500,
                                            angle: 90,
                                            velocity: 180,
                                            gravityY: 300,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: 0,
                                                max: game.config.width
                                            },
                                            y: -50
                                        });

                                        particle2.createEmitter({
                                            scale: 0.25,
                                            angle: 90,
                                            speed: 500,
                                            velocity: 180,
                                            gravityY: 300,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: 0,
                                                max: game.config.width
                                            },
                                            y: -50
                                        });

                                        particle3.createEmitter({
                                            scale: 0.25,
                                            angle: 90,
                                            speed: 500,
                                            velocity: 180,
                                            gravityY: 300,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: 0,
                                                max: game.config.width
                                            },
                                            y: -50
                                        });

                                        particle4.createEmitter({
                                            scale: 0.25,
                                            angle: 90,
                                            speed: 500,
                                            velocity: 180,
                                            gravityY: 300,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: 0,
                                                max: game.config.width
                                            },
                                            y: -50
                                        });

                                        particle5.createEmitter({
                                            scale: 0.25,
                                            angle: 90,
                                            speed: 500,
                                            velocity: 180,
                                            gravityY: 300,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: 0,
                                                max: game.config.width
                                            },
                                            y: -50
                                        });

                                        particle6.createEmitter({
                                            scale: 0.25,
                                            angle: 90,
                                            speed: 500,
                                            velocity: 180,
                                            gravityY: 300,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: 0,
                                                max: game.config.width
                                            },
                                            y: -50
                                        });

                                        particle7.createEmitter({
                                            scale: 0.25,
                                            angle: 90,
                                            speed: 500,
                                            velocity: 180,
                                            gravityY: 300,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 65,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: 5000,
                                            x: {
                                                min: 0,
                                                max: game.config.width
                                            },
                                            y: -50
                                        });
                                    }
                                } else if (blacket.rarities[blacket.blooks[data.blook].rarity].animation == "chroma" || blacket.rarities[blacket.blooks[data.blook].rarity].animation == "mystical") {
                                    var config = {
                                        type: Phaser.WEBGL,
                                        width: window.innerWidth,
                                        height: window.innerHeight,
                                        parent: document.getElementById(backgroundId),
                                        render: {
                                            transparent: true
                                        },
                                        scene: {
                                            preload: preload,
                                            create: create
                                        }
                                    };

                                    game = new Phaser.Game(config);

                                    function preload() {
                                        this.load.image('1', '/content/particles/1.png');
                                        this.load.image('2', '/content/particles/2.png');
                                        this.load.image('3', '/content/particles/3.png');
                                        this.load.image('4', '/content/particles/4.png');
                                        this.load.image('5', '/content/particles/5.png');
                                        this.load.image('6', '/content/particles/6.png');
                                        this.load.image('7', '/content/particles/7.png');
                                    }

                                    function create() {
                                        particle1 = this.add.particles('1');
                                        particle2 = this.add.particles('2');
                                        particle3 = this.add.particles('3');
                                        particle4 = this.add.particles('4');
                                        particle5 = this.add.particles('5');
                                        particle6 = this.add.particles('6');
                                        particle7 = this.add.particles('7');
                                        randomy1 = game.config.height - 651
                                        randomy2 = game.config.height - 652
                                        randomy3 = game.config.height - 653
                                        randomy4 = game.config.height - 654
                                        randomy5 = game.config.height - 655
                                        randomy6 = game.config.height - 656
                                        randomy7 = game.config.height - 657
                                        particle1.createEmitter({
                                            speed: 700,
                                            angle: -30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy1,
                                                max: game.config.height
                                            },
                                            x: 0
                                        });

                                        particle2.createEmitter({
                                            speed: 700,
                                            angle: -30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy2,
                                                max: game.config.height
                                            },
                                            x: 0
                                        });

                                        particle3.createEmitter({
                                            speed: 700,
                                            angle: -30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy3,
                                                max: game.config.height
                                            },
                                            x: 0
                                        });

                                        particle4.createEmitter({
                                            speed: 700,
                                            angle: -30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy4,
                                                max: game.config.height
                                            },
                                            x: 0
                                        });

                                        particle5.createEmitter({
                                            speed: 700,
                                            angle: -30,
                                            velocity: 650,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy5,
                                                max: game.config.height
                                            },
                                            x: 0
                                        });

                                        particle6.createEmitter({
                                            speed: 700,
                                            angle: -30,
                                            velocity: 750,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 200,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy6,
                                                max: game.config.height
                                            },
                                            x: 0
                                        });

                                        particle7.createEmitter({
                                            speed: 700,
                                            angle: -30,
                                            velocity: 450,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy7,
                                                max: game.config.height
                                            },
                                            x: 0
                                        });
                                        particle1.createEmitter({
                                            speed: 700,
                                            angle: -150,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy1,
                                                max: game.config.height
                                            },
                                            x: game.config.width
                                        });

                                        particle2.createEmitter({
                                            speed: 700,
                                            angle: -150,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy2,
                                                max: game.config.height
                                            },
                                            x: game.config.width
                                        });

                                        particle3.createEmitter({
                                            speed: 700,
                                            angle: -150,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy3,
                                                max: game.config.height
                                            },
                                            x: game.config.width
                                        });

                                        particle4.createEmitter({
                                            speed: 700,
                                            angle: -150,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy4,
                                                max: game.config.height
                                            },
                                            x: game.config.width
                                        });

                                        particle5.createEmitter({
                                            speed: 700,
                                            angle: -150,
                                            velocity: 650,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy5,
                                                max: game.config.height
                                            },
                                            x: game.config.width
                                        });

                                        particle6.createEmitter({
                                            speed: 700,
                                            angle: -150,
                                            velocity: 750,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 200,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy6,
                                                max: game.config.height
                                            },
                                            x: game.config.width
                                        });

                                        particle7.createEmitter({
                                            speed: 700,
                                            angle: -150,
                                            velocity: 450,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: randomy7,
                                                max: game.config.height
                                            },
                                            x: game.config.width
                                        });
                                        particle1.createEmitter({
                                            speed: 700,
                                            angle: 30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 601
                                            },
                                            x: 0
                                        });

                                        particle2.createEmitter({
                                            speed: 700,
                                            angle: 30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 602
                                            },
                                            x: 0
                                        });

                                        particle3.createEmitter({
                                            speed: 700,
                                            angle: 30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 603
                                            },
                                            x: 0
                                        });

                                        particle4.createEmitter({
                                            speed: 700,
                                            angle: 30,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 604
                                            },
                                            x: 0
                                        });

                                        particle5.createEmitter({
                                            speed: 700,
                                            angle: 30,
                                            velocity: 650,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 605
                                            },
                                            x: 0
                                        });

                                        particle6.createEmitter({
                                            speed: 700,
                                            angle: 30,
                                            velocity: 750,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 200,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 606
                                            },
                                            x: 0
                                        });

                                        particle7.createEmitter({
                                            speed: 700,
                                            angle: 30,
                                            velocity: 450,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 607
                                            },
                                            x: 0
                                        });
                                        particle1.createEmitter({
                                            speed: 700,
                                            angle: -210,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 601
                                            },
                                            x: game.config.width
                                        });

                                        particle2.createEmitter({
                                            speed: 700,
                                            angle: -210,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 602
                                            },
                                            x: game.config.width
                                        });

                                        particle3.createEmitter({
                                            speed: 700,
                                            angle: -210,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 603
                                            },
                                            x: game.config.width
                                        });

                                        particle4.createEmitter({
                                            speed: 700,
                                            angle: -210,
                                            velocity: 700,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 350,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 604
                                            },
                                            x: game.config.width
                                        });

                                        particle5.createEmitter({
                                            speed: 700,
                                            angle: -210,
                                            velocity: 650,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 400,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 605
                                            },
                                            x: game.config.width
                                        });

                                        particle6.createEmitter({
                                            speed: 700,
                                            angle: -210,
                                            velocity: 750,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 200,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 606
                                            },
                                            x: game.config.width
                                        });

                                        particle7.createEmitter({
                                            speed: 700,
                                            angle: -210,
                                            velocity: 450,
                                            gravityY: 0,
                                            rotate: {
                                                onEmit: (particle) => {
                                                    return 0
                                                },
                                                onUpdate: (particle) => {
                                                    return particle.angle + 1
                                                },
                                            },
                                            frequency: 300,
                                            scale: 0.25,
                                            tint: parseInt(blacket.rarities[blacket.blooks[data.blook].rarity].color.replace("#", "").substring(0, 6), 16),
                                            lifespan: {
                                                min: 3000,
                                                max: 2500
                                            },
                                            y: {
                                                min: 0,
                                                max: 607
                                            },
                                            x: game.config.width
                                        });
                                    }
                                }
                            }, 240);

                            setTimeout(() => {
                                $(`#${backgroundId}`).click(() => {
                                    $(`#${backgroundId}`).remove()
                                    $(`#${backgroundId}`).unbind("click");
                                    $("body").attr("style", "");
                                });
                            }, blacket.rarities[blacket.blooks[data.blook].rarity].wait);
                        });
                    });
                }
                $("#tokenBalance").html(`<img loading="lazy" src="/content/tokenIcon.png" alt="Token" class="styles__tokenBalanceIcon___3MGhs-camelCase" draggable="false"><div>${blacket.user.tokens.toLocaleString()}</div>`);

                Object.keys(blacket.packs).forEach((pack) => {
                    if (blacket.packs[pack].hidden) return;
                    let packId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
                    $(`.styles__packsWrapper___2hBF4-camelCase`).append(`<div id="${packId}" class="styles__packContainer___3RwSU-camelCase" role="button" tabindex="0" style="background: radial-gradient(circle, ${blacket.packs[pack].color1} 0%, ${blacket.packs[pack].color2} 100%);"><div class="styles__packImgContainer___3NABW-camelCase"><img loading="lazy" src="${blacket.packs[pack].image}" class="styles__packShadow___2TA17-camelCase" draggable="false"><img loading="lazy" src="${blacket.packs[pack].image}" class="styles__packImg___3to1S-camelCase" draggable="false"></div><div class="styles__packBottom___37drt-camelCase"><img loading="lazy" src="/content/tokenIcon.png" alt="Token" class="styles__packPriceImg___1FaDF-camelCase" draggable="false">${blacket.packs[pack].price.toLocaleString()}</div></div>`);
                    $(`#${packId}`).click(() => {
                        if (localStorage.getItem('instantOpen')) {
                            if (blacket.user.tokens >= blacket.packs[pack].price) blacket.openPack(pack);
                        } else {
                            $("body").attr("style", "overflow: hidden;");
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"> <div class="styles__text___KSL4--camelCase"> <div> Purchase the ${pack} Pack <i class="styles__rateIcon___11Qwv-camelCase far fa-question-circle" currentitem="false" aria-hidden="true" ></i> for ${blacket.packs[pack].price.toLocaleString()} tokens? </div></div><div class="styles__holder___3CEfN-camelCase"> <div class="styles__buttonContainer___2EaVD-camelCase"> <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div></div><div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div></div></div></div><input type="submit" style="opacity: 0; display: none;"/> </form> </div>`);
                        }
                        $(".styles__rateIcon___11Qwv-camelCase").click(() => {
                            let packRates = "";
                            Object.entries(blacket.packs[pack].blooks).forEach((blook) => {
                                let chance;
                                if (blacket.booster.active && blacket.blooks[blook[1]].chance <= 10) chance = Math.floor((blacket.blooks[blook[1]].chance * blacket.booster.multiplier) * 10000) / 10000;
                                else chance = Math.floor(blacket.blooks[blook[1]].chance * 10000) / 10000;
                                packRates = packRates + `<div>${blook[1]}: <text style="${blacket.booster.active && blacket.blooks[blook[1]].chance <= 10 ? "animation: styles__boostedOddsText___Rkd3a-camelCase 0.5s infinite alternate linear;" : ""}">${chance}%</text></div>`;
                            });
                            $("body").append(`<div id="thisBetterFuckingFixThisIssue" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Pack Rates: <br><div style="max-height: 28.646vw; overflow-y: auto;">${packRates}</div></div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                            $("#closeButton").click(() => {
                                $("#thisBetterFuckingFixThisIssue").remove();
                            });
                        });
                        if (blacket.user.tokens < blacket.packs[pack].price) {
                            $("div.styles__button___1_E-G-camelCase:nth-child(1)").remove();
                            $(".styles__front___vcvuy-camelCase").html("Not Enough Tokens");
                            $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                        } else {
                            $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                                $("body").attr("style", "overflow: auto;");
                            });
                            $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                                blacket.openPack(pack);
                            });
                        }
                    });
                });

                blacket.showBuyItemModal = (item, price) => {
                    $("body").attr("style", "overflow: hidden;");
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"> <div class="styles__text___KSL4--camelCase"> <div> Purchase the ${item} item <i class="styles__rateIcon___11Qwv-camelCase far fa-question-circle" currentitem="false" aria-hidden="true" ></i> for ${price.toLocaleString()} tokens? </div></div><div class="styles__holder___3CEfN-camelCase"> <div class="styles__buttonContainer___2EaVD-camelCase"> <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div></div><div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div></div></div></div><input type="submit" style="opacity: 0; display: none;"/> </form> </div>`);
                    $(".styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                        $("body").attr("style", "overflow: auto;");
                    });
                    $(".styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                        blacket.startLoading();
                        $(".arts__modal___VpEAD-camelCase").remove();
                        blacket.requests.post("/worker/shop/buy", {
                            item
                        }, (data) => {
                            blacket.stopLoading();
                            if (data.error) return blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            blacket.user.tokens -= price;
                            $("#tokenBalance").html(`<img loading="lazy" src="/content/tokenIcon.png" alt="Token" class="styles__tokenBalanceIcon___3MGhs-camelCase" draggable="false"><div>${blacket.user.tokens.toLocaleString()}</div>`);
                        });
                    });
                    $(".styles__rateIcon___11Qwv-camelCase").click(() => {
                        $("body").append(`<div id="thisBetterFuckingFixThisIssue" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Item Description: <br><div style="max-height: 28.646vw; overflow-y: auto;">${blacket.items[item].description}</div></div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                        $("#closeButton").click(() => {
                            $("#thisBetterFuckingFixThisIssue").remove();
                        });
                    });
                    if (blacket.user.tokens < price) {
                        $(".styles__button___1_E-G-camelCase:nth-child(2) .styles__front___vcvuy-camelCase").html("Not Enough Tokens");
                        $(".styles__button___1_E-G-camelCase:nth-child(1)").remove();
                    }
                }

                $("#stealthDisguiseKitItemButton").click(() => blacket.showBuyItemModal("Stealth Disguise Kit (Item)", 250000));
                $("#fragmentGrenadeItemButton").click(() => blacket.showBuyItemModal("Fragment Grenade (Item)", 100000));
                $("#clanShieldItemButton").click(() => blacket.showBuyItemModal("Clan Shield", 100000));

                for (const item in blacket.weekly_shop) {
                    const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
                    $("#weeklyShop").append(`
                    <div id="${id}" class="styles__itemShopContainer___I6YST-camelCase" style="${blacket.weekly_shop[item].glow ? "filter: drop-shadow(0px 0px 20px white);" : ""}">
                    <div class="styles__itemShopName___1-QhF-camelCase">${item}</div><img
                        src="/content/items/${item}.png"
                        class="styles__itemShopImage___318lh-camelCase" draggable="false">
                    <div class="styles__itemShopBottom___2Xhbw-camelCase">
                        <img src="/content/tokenIcon.png" class="styles__packPriceImg___1FaDF-camelCase">
                        ${blacket.weekly_shop[item].price.toLocaleString()}
                    </div>
                </div>
                    `);
                    $(`#${id}`).click(() => blacket.showBuyItemModal(item, blacket.weekly_shop[item].price));
                }
                blacket.stopLoading();
            } else setTimeout(reset, 1);
        });
    } else if (location.pathname.split('/')[1].split('?')[0] == 'settings') {
        $(function reset() {
            if (blacket.user) {
                $(".styles__blooketText___QMe9h-camelCase").html(blacket.config.name)
                if (blacket.user.perms.includes("change_banner") && blacket.user.perms.includes("change_color") && blacket.user.perms.includes("early_access") || blacket.user.perms.includes("*")) {
                    $(".styles__planText___1m0nS-camelCase").html("Plus");
                    $(".styles__planText___1m0nS-camelCase").css("color", "#3052d6");
                    $(".styles__button___1_E-G-camelCase").remove();
                    $(".styles__mainContainer___4TLvi-camelCase").append(`<div class="styles__infoContainer___2uI-S-camelCase">
                        <div class="styles__headerRow___1tdPa-camelCase">
                            <i aria-hidden="true" class="fas fa-star styles__headerIcon___1ykdN-camelCase"></i>
                            <div class="styles__infoHeader___1lsZY-camelCase">Plus Settings</div>
                        </div>
                        <div>
                            <a id="changeUsernameColorButton" class="styles__link___5UR6_-camelCase">Change Username Color</a><br>
                            <a id="changeDefaultChatColorButton" class="styles__link___5UR6_-camelCase">Change Default Chat Color</a>
                        </div>
                        
                    </div>`);
                }
                if (blacket.user.settings.requests == "on") $("#tradeRequestsButton").html(`Trade Requests: On`);
                else if (blacket.user.settings.requests == "friends") $("#tradeRequestsButton").html(`Trade Requests: Friends`);
                else if (blacket.user.settings.requests == "off") $("#tradeRequestsButton").html(`Trade Requests: Off`);
                if (blacket.user.settings.friends == "on") $("#friendRequestsButton").html(`Friend Requests: On`);
                else if (blacket.user.settings.friends == "mutual") $("#friendRequestsButton").html(`Friend Requests: Mutual`);
                else if (blacket.user.settings.friends == "off") $("#friendRequestsButton").html(`Friend Requests: Off`);
                if (blacket.user.otp) $("#otpButton").html(`Disable OTP / 2FA`)
                else $("#otpButton").html(`Enable OTP / 2FA`)
                $("#tradeRequestsButton").click(() => {
                    blacket.startLoading();
                    let value;
                    if (blacket.user.settings.requests == "on") value = "friends";
                    else if (blacket.user.settings.requests == "friends") value = "off";
                    else if (blacket.user.settings.requests == "off") value = "on";
                    blacket.requests.post(`/worker/settings/requests`, {
                        value: value
                    }, (data) => {
                        if (data.error) {
                            $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                            $("#closeButton").click(() => {
                                $("#errorModal").remove();
                            });
                            blacket.stopLoading();
                            return;
                        }
                        blacket.user.settings.requests = value;
                        if (blacket.user.settings.requests == "on") $("#tradeRequestsButton").html(`Trade Requests: On`);
                        else if (blacket.user.settings.requests == "friends") $("#tradeRequestsButton").html(`Trade Requests: Friends`);
                        else if (blacket.user.settings.requests == "off") $("#tradeRequestsButton").html(`Trade Requests: Off`);
                        blacket.stopLoading();
                    });
                });
                $("#friendRequestsButton").click(() => {
                    blacket.startLoading();
                    let value;
                    if (blacket.user.settings.friends == "on") value = "mutual";
                    else if (blacket.user.settings.friends == "mutual") value = "off";
                    else if (blacket.user.settings.friends == "off") value = "on";
                    blacket.requests.post(`/worker/settings/friends`, {
                        value: value
                    }, (data) => {
                        if (data.error) {
                            $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                            $("#closeButton").click(() => {
                                $("#errorModal").remove();
                            });
                            blacket.stopLoading();
                            return;
                        }
                        blacket.user.settings.friends = value;
                        if (blacket.user.settings.friends == "on") $("#friendRequestsButton").html(`Friend Requests: On`);
                        else if (blacket.user.settings.friends == "mutual") $("#friendRequestsButton").html(`Friend Requests: Mutual`);
                        else if (blacket.user.settings.friends == "off") $("#friendRequestsButton").html(`Friend Requests: Off`);
                        blacket.stopLoading();
                    });
                });
                $("div.styles__text___1x37n-camelCase:nth-child(2) > text:nth-child(2)").html(blacket.user.username);
                $("div.styles__text___1x37n-camelCase:nth-child(3) > text:nth-child(2)").html(blacket.user.role);
                $("div.styles__text___1x37n-camelCase:nth-child(4) > text:nth-child(2)").html(`${new Date(blacket.user.created * 1000).toLocaleDateString()} ${new Date(blacket.user.created * 1000).toLocaleTimeString()}`)
                $("#changeUsernameButton").click(() => {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <form class="styles__container___1BPm9-camelCase">
                        <div class="styles__text___KSL4--camelCase">Enter new username.</div>
                        <div class="styles__holder___3CEfN-camelCase">
                            <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                border-radius: 0.313vw;
                                width: 90%;
                                height: 2.604vw;
                                margin: 0.000vw;
                                display: flex;
                                flex-direction: row;
                                align-items: center;"><input style="  border: none;
                                height: 2.083vw;
                                line-height: 2.083vw;
                                font-size: 1.458vw;
                                text-align: center;
                                font-weight: 700;
                                font-family: Nunito, sans-serif;
                                color: #ffffff;
                                background-color: #3f3f3f;
                                outline: none;
                                width: 100%;
                              " placeholder="Username" maxlength="16" type="text" value="" style="width: 3.125vw;"/></div>
                              <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                              border-radius: 0.313vw;
                              width: 90%;
                              height: 2.604vw;
                              margin: 0.000vw;
                              display: flex;
                              flex-direction: row;
                              align-items: center;"><input style="  border: none;
                              height: 2.083vw;
                              line-height: 2.083vw;
                              font-size: 1.458vw;
                              text-align: center;
                              font-weight: 700;
                              font-family: Nunito, sans-serif;
                              color: #ffffff;
                              background-color: #3f3f3f;
                              outline: none;
                              width: 100%;
                            " placeholder="Password" type="password" value="" style="width: 3.125vw;"/></div>
                            </div>
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Change</div>
                                </div>
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                </div>
                            </div>
                            <div style="font-size: 1.042vw; line-height: 1.042vw;" class="styles__text___KSL4--camelCase">This will allow anyone to take your old username! Take caution while performing this action!</div>
                        </div>
                        <input type="submit" style="opacity: 0; display: none;" />
                    </form>
                            </div>`);
                    $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                        event.preventDefault();
                    });
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").focus();
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                        blacket.startLoading();
                        let username = $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val();
                        let password = $(".styles__numRow___xh98F-camelCase > div:nth-child(2) > input:nth-child(1)").val();
                        $(".arts__modal___VpEAD-camelCase").remove();
                        blacket.requests.post(`/worker/settings/username`, {
                            username: username,
                            password: password
                        }, (data) => {
                            if (data.error) {
                                $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                $("#closeButton").click(() => {
                                    $("#errorModal").remove();
                                });
                                blacket.stopLoading();
                                return;
                            } else location.href = "/logout";
                        });
                    });
                });
                $("#changePasswordButton").click(() => {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <form class="styles__container___1BPm9-camelCase">
                        <div class="styles__text___KSL4--camelCase">Enter new password.</div>
                        <div class="styles__holder___3CEfN-camelCase">
                            <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                border-radius: 0.313vw;
                                width: 90%;
                                height: 2.604vw;
                                margin: 0.000vw;
                                display: flex;
                                flex-direction: row;
                                align-items: center;"><input style="  border: none;
                                height: 2.083vw;
                                line-height: 2.083vw;
                                font-size: 1.458vw;
                                text-align: center;
                                font-weight: 700;
                                font-family: Nunito, sans-serif;
                                color: #ffffff;
                                background-color: #3f3f3f;
                                outline: none;
                                width: 100%;
                              " placeholder="Old Password" type="password" value="" style="width: 3.125vw;"/></div>
                              <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                              border-radius: 0.313vw;
                              width: 90%;
                              height: 2.604vw;
                              margin: 0.000vw;
                              display: flex;
                              flex-direction: row;
                              align-items: center;"><input style="  border: none;
                              height: 2.083vw;
                              line-height: 2.083vw;
                              font-size: 1.458vw;
                              text-align: center;
                              font-weight: 700;
                              font-family: Nunito, sans-serif;
                              color: #ffffff;
                              background-color: #3f3f3f;
                              outline: none;
                              width: 100%;
                            " placeholder="New Password" type="password" value="" style="width: 3.125vw;"/></div>
                            </div>
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Change</div>
                                </div>
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                </div>
                            </div>
                            <div style="font-size: 1.042vw; line-height: 1.042vw;" class="styles__text___KSL4--camelCase">This will change your password and immediately and log you out! Take caution while performing this action!</div>
                        </div>
                        <input type="submit" style="opacity: 0; display: none;" />
                    </form>
                            </div>`);
                    $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                        event.preventDefault();
                    });
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").focus();
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                        blacket.startLoading();
                        let oldPassword = $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val();
                        let newPassword = $(".styles__numRow___xh98F-camelCase > div:nth-child(2) > input:nth-child(1)").val();
                        $(".arts__modal___VpEAD-camelCase").remove();
                        blacket.requests.post(`/worker/settings/password`, {
                            oldPassword: oldPassword,
                            newPassword: newPassword
                        }, (data) => {
                            if (data.error) {
                                $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                $("#closeButton").click(() => {
                                    $("#errorModal").remove();
                                });
                                blacket.stopLoading();
                                return;
                            } else location.href = "/logout";
                        });
                    });
                });
                $("#otpButton").click(() => {
                    if (blacket.user.otp) {
                        $("body").append(`
                        <div class="arts__modal___VpEAD-camelCase">
                    <div class="styles__container___1BPm9-camelCase">
                        <div class="styles__text___KSL4--camelCase">Enter OTP / 2FA code.</div>
                        <div class="styles__holder___3CEfN-camelCase">
                            <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                border-radius: 0.313vw;
                                width: 90%;
                                height: 2.604vw;
                                margin: 0.000vw;
                                display: flex;
                                flex-direction: row;
                                align-items: center;"><input style="  border: none;
                                height: 2.083vw;
                                line-height: 2.083vw;
                                font-size: 1.458vw;
                                text-align: center;
                                font-weight: 700;
                                font-family: Nunito, sans-serif;
                                color: #ffffff;
                                background-color: #3f3f3f;
                                outline: none;
                                width: 100%;
                              " type="tel" value="" maxlength="7" placeholder="OTP / 2FA Code"></div>
                              
                            </div>
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Disable</div>
                                </div>
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                </div>
                            </div>
                            
                        <div style="font-size: 1.042vw; line-height: 1.042vw;" class="styles__text___KSL4--camelCase">This will disable OTP / 2FA on your account. Take caution while performing this action!</div></div>
                        <input type="submit" style="opacity: 0; display: none;">
                    </div>
                            </div>`)
                        $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                        });
                        $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                            blacket.startLoading();
                            let code = $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val().replace(/ /g, "");
                            $(".arts__modal___VpEAD-camelCase").remove();
                            blacket.requests.post(`/worker/otp/disable`, {
                                code: code
                            }, (data) => {
                                if (data.error) {
                                    $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                    $("#closeButton").click(() => {
                                        $("#errorModal").remove();
                                    });
                                    blacket.stopLoading();
                                    return;
                                }
                                $("#otpButton").text("Enable OTP / 2FA");
                                blacket.user.otp = false;
                                blacket.stopLoading();
                            });
                        });
                    } else {
                        blacket.startLoading();
                        blacket.requests.get(`/worker/otp/generate`, (data) => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                            blacket.stopLoading();
                            if (data.error) {
                                $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                $("#closeButton").click(() => {
                                    $("#errorModal").remove();
                                });
                                return;
                            }
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase">
                                <div class="styles__text___KSL4--camelCase">Scan the QR code.</div>
                                <img loading="lazy" src="${data.qr}" style="width: 10.417vw; height: 10.417vw; margin: 0.000vw 0.000vw -0.260vw 0.000vw;border-radius: 0.521vw;">
                                <div style="font-size: 1.042vw; line-height: 1.042vw;" class="styles__text___KSL4--camelCase">After scanning the QR code, please enter the OTP / 2FA code you get from it below. If the code doesn't work, try rescanning the QR code.</div>
                                <div class="styles__holder___3CEfN-camelCase">
                                    <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                        <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                        border-radius: 0.313vw;
                                        width: 90%;
                                        height: 2.604vw;
                                        margin: 0.000vw;
                                        display: flex;
                                        flex-direction: row;
                                        align-items: center;"><input style="  border: none;
                                        height: 2.083vw;
                                        line-height: 2.083vw;
                                        font-size: 1.458vw;
                                        text-align: center;
                                        font-weight: 700;
                                        font-family: Nunito, sans-serif;
                                        color: #ffffff;
                                        background-color: #3f3f3f;
                                        outline: none;
                                        width: 100%;
                                      " type="tel" value="" maxlength="7" placeholder="OTP / 2FA Code"></div>
                                    </div>
                                    <div class="styles__buttonContainer___2EaVD-camelCase">
                                        <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Enable</div>
                                        </div>
                                        <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <input type="submit" style="opacity: 0; display: none;">
                            </div>
                                    </div>`)
                            $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                                blacket.startLoading();
                                let code = $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val().replace(/ /g, "");
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.requests.post(`/worker/otp/enable`, {
                                    code: code
                                }, (data) => {
                                    if (data.error) {
                                        $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                        $("#closeButton").click(() => {
                                            $("#errorModal").remove();
                                        });
                                        blacket.stopLoading();
                                        return;
                                    }
                                    blacket.stopLoading();
                                    $("#otpButton").text("Disable OTP / 2FA");
                                    blacket.user.otp = true;
                                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                            <form class="styles__container___1BPm9-camelCase">
                                <div class="styles__text___KSL4--camelCase">OTP / 2FA has been enabled!</div>
                                <div class="styles__holder___3CEfN-camelCase">
                                    <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div>
                                        </div></div>
                                </div><input type="submit" style="opacity: 0; display: none;">
                            </form></div>`);
                                    $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                                        $(".arts__modal___VpEAD-camelCase").remove();
                                    });
                                });
                            });
                        });
                    }
                });
                $("#changeUsernameColorButton").click(() => {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                        <form class="styles__container___1BPm9-camelCase">
                            <div class="styles__text___KSL4--camelCase">Enter color value.</div>
                            <div class="styles__holder___3CEfN-camelCase">
                                <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                    <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                    border-radius: 0.313vw;
                                    width: 90%;
                                    height: 2.604vw;
                                    margin: 0.000vw;
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: center;">
                                    <input style="border: none;
                                    height: 2.083vw;
                                    line-height: 2.083vw;
                                    font-size: 1.458vw;
                                    text-align: center;
                                    font-weight: 700;
                                    font-family: Nunito, sans-serif;
                                    color: #ffffff;
                                    background-color: #3f3f3f;
                                    outline: none;
                                    width: 7.813vw;
                                    align-self: center;
                                    text-shadow: 0.000vw 0.000vw 0.260vw #000000;
                                    border-radius: 0.260vw;
                                    filter: drop-shadow(0.000vw 0.000vw 0.260vw #4f4f4f);
                                  " placeholder="Color" value="${blacket.user.color}" max-length="7" style="width: 3.125vw;"/></div>
                                </div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Change</div>
                                    </div>
                                    <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                    </div>
                                </div>
                                <div style="font-size: 1.172vw; line-height: 1.823vw;" class="styles__text___KSL4--camelCase">Your username will look like this:<br><text>${blacket.user.username}</text></div>
                            </div>
                            <input type="submit" style="opacity: 0; display: none;" />
                        </form>
                                </div>`);
                    $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                        event.preventDefault();
                    });
                    new jscolor($(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)")[0], {
                        preset: "dark",
                        format: "hex",
                        borderColor: "#2f2f2f",
                        backgroundColor: "#2f2f2f",
                        insetColor: "#2f2f2f",
                        previewSize: 0,
                        previewPadding: 0,
                        shadow: true
                    })
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").focus();
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").on("input", () => $("div.styles__text___KSL4--camelCase:nth-child(3) > text:nth-child(2)").css("color", $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val()));
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                        blacket.startLoading();
                        let color = $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val();
                        $(".arts__modal___VpEAD-camelCase").remove();
                        blacket.requests.post(`/worker/settings/color`, {
                            color: color
                        }, (data) => {
                            if (data.error) {
                                $("body").append(`<div id="errorModal" class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>Error<br><br>${data.reason}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                $("#closeButton").click(() => {
                                    $("#errorModal").remove();
                                });
                                blacket.stopLoading();
                                return;
                            }
                            blacket.stopLoading();
                            $(".styles__profileRow___cJa4E-camelCase > text:nth-child(2)").attr("style", `color: ${color};`);
                            $(".styles__profileRow___cJa4E-camelCase > text:nth-child(2)").attr("class", ``);
                            blacket.user.color = color;
                        });
                    });
                });
                $("#changeDefaultChatColorButton").click(() => {
                    $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                        <form class="styles__container___1BPm9-camelCase">
                            <div class="styles__text___KSL4--camelCase">Enter color value.</div>
                            <div class="styles__holder___3CEfN-camelCase">
                                <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                    <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                    border-radius: 0.313vw;
                                    width: 90%;
                                    height: 2.604vw;
                                    margin: 0.000vw;
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: center;"><input style="border: none;
                                    height: 2.083vw;
                                    line-height: 2.083vw;
                                    font-size: 1.458vw;
                                    text-align: center;
                                    font-weight: 700;
                                    font-family: Nunito, sans-serif;
                                    color: #ffffff;
                                    background-color: #3f3f3f;
                                    outline: none;
                                    width: 7.813vw;
                                    align-self: center;
                                    text-shadow: 0.000vw 0.000vw 0.260vw #000000;
                                    border-radius: 0.260vw;
                                    filter: drop-shadow(0.000vw 0.000vw 0.260vw #4f4f4f);
                                  " placeholder="Color" value="${localStorage.getItem("chatColor")}" max-length="7" style="width: 3.125vw;"/></div>
                                </div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Change</div>
                                    </div>
                                    <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                    </div>
                                </div>
                                <div style="font-size: 1.172vw; line-height: 1.823vw;" class="styles__text___KSL4--camelCase">Your messages will look like this:<br><text>Hello World!</text></div>
                            </div>
                            <input type="submit" style="opacity: 0; display: none;" />
                        </form>
                                </div>`);
                    $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                        event.preventDefault();
                    });
                    new jscolor($(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)")[0], {
                        preset: "dark",
                        format: "hex",
                        borderColor: "#2f2f2f",
                        backgroundColor: "#2f2f2f",
                        insetColor: "#2f2f2f",
                        previewSize: 0,
                        previewPadding: 0,
                        shadow: true
                    })
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").focus();
                    $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").on("input", () => $("div.styles__text___KSL4--camelCase:nth-child(3) > text:nth-child(2)").css("color", $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val()));
                    $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                    $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                        localStorage.setItem("chatColor", $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val());
                        $(".arts__modal___VpEAD-camelCase").remove();
                    });
                });
                blacket.stopLoading();
            } else setTimeout(reset, 1);
        });
    } else if (location.pathname.split('/')[1].split('?')[0] == 'inventory') {
        $(function reset() {
            if (blacket.user) {
                blacket.listItem = (item, itemId, price) => {
                    if (price == `` || price == 0) return;
                    $(`.arts__modal___VpEAD-camelCase`).remove();
                    blacket.startLoading();
                    blacket.requests.post("/worker/bazaar/list", {
                        item: item,
                        price: price
                    }, (data) => {
                        blacket.stopLoading();
                        if (data.error) {
                            blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            return blacket.stopLoading();
                        }
                        blacket.user.inventory[item]--;
                        $(`#${itemId}`).remove();
                    });
                }
                let validItems = 0;
                Object.values(blacket.user.inventory).forEach((item) => {
                    if (blacket.items[item]) validItems++;
                });
                if (validItems == 0) {
                    $(`.styles__packsWrapper___2hBF4-camelCase`).append(`<div style="color: #ffffff; width: 26.042vw; font-size: 1.302vw;">You do not have any items in your inventory.</div>`);
                    blacket.stopLoading();
                    return;
                } else Object.values(blacket.user.inventory).forEach((item) => {
                    if (!blacket.items[item]) return;
                    let itemId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
                    $(`.styles__packsWrapper___2hBF4-camelCase`).append(`<div id="${itemId}" class="styles__packContainer___3RwSU-camelCase" role="button" tabindex="0" style="background: ${blacket.items[item].color};"><div class="styles__packImgContainer___3NABW-camelCase"><img loading="lazy" src="${blacket.items[item].image}" class="styles__packImg___3to1S-camelCase" draggable="false"></div></div>`);
                    $(`#${itemId}`).click(() => {
                        $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                        <form class="styles__container___1BPm9-camelCase">
                        <div class="styles__text___KSL4--camelCase">
                        ${item}
                        <div style="font-size: 0.911vw;margin: 0;line-height: 1.5;margin-top: 0.521vw;opacity: 0.5;" class="styles__text___KSL4--camelCase">
                            ${blacket.items[item].description}
                        </div>
                        <div style="margin-top: 1vw;">What would you like to do with this item?</div>
                    </div>
                           <div class="styles__holder___3CEfN-camelCase">
                              <div class="styles__buttonContainer___2EaVD-camelCase">
                                 <div id="useButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Use</div>
                                 </div>
                                 <div id="listButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">List</div>
                                 </div>
                                 <div id="cancelButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                 </div>
                              </div>
                           </div>
                           <input type="submit" style="opacity: 0; display: none;"> 
                        </form>
                     </div>
                     `)
                        $("#useButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                            if (item == "Fragment Grenade (Item)") return blacket.startLoading(), window.location.href = "/clans/discover";
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"> <div class="styles__text___KSL4--camelCase"> <div> Are you sure you want to use your ${item}? </div></div><div class="styles__holder___3CEfN-camelCase"> <div class="styles__buttonContainer___2EaVD-camelCase"> <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div></div><div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"> <div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div></div></div></div><input type="submit" style="opacity: 0; display: none;"/> </form> </div>`);
                            $("div.styles__button___1_E-G-camelCase:nth-child(1)").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.startLoading();
                                blacket.requests.post("/worker/use", {
                                    item: item
                                }, (data) => {
                                    if (data.error) {
                                        blacket.createToast({
                                            title: "Error",
                                            message: data.reason,
                                            icon: "/content/blooks/Error.png",
                                            time: 5000
                                        });
                                        return blacket.stopLoading();
                                    }
                                    if (!item.includes("Paint")) {
                                        blacket.user.inventory[item]--;
                                        $(`#${itemId}`).remove();
                                    }
                                    blacket.stopLoading();
                                    $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>${data.message}</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;" /></form></div>`);
                                    $("#closeButton").click(() => {
                                        $(".arts__modal___VpEAD-camelCase").remove();
                                    });
                                });
                            });
                            $("div.styles__button___1_E-G-camelCase:nth-child(2)").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                        });
                        $("#listButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                            blacket.startLoading();
                            blacket.requests.get(`/worker/bazaar?item=${item}`, (data) => {
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                <form class="styles__container___1BPm9-camelCase">
                    <div class="styles__text___KSL4--camelCase">List ${item} item for how many tokens?</div>
                    <div class="styles__holder___3CEfN-camelCase">
                    <div class="styles__numRow___xh98F-camelCase">
                    <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                    border-radius: 0.313vw;
                    width: 90%;
                    height: 2.604vw;
                    margin: 0.000vw;
                    display: flex;
                    flex-direction: row;
                    align-items: center;"><input style="  border: none;
                    height: 2.083vw;
                    line-height: 2.083vw;
                    font-size: 1.458vw;
                    text-align: center;
                    font-weight: 700;
                    font-family: Nunito, sans-serif;
                    color: #ffffff;
                    background-color: #3f3f3f;
                    outline: none;
                    width: 100%;
                  " placeholder="Price" maxlength="9" value="${data.bazaar[0] ? (data.bazaar[0].price - 1) == 0 ? data.bazaar[0].price : data.bazaar[0].price - 1 : blacket.items[item].price}"></div>
                </div>
                        <div class="styles__buttonContainer___2EaVD-camelCase">
                            <div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">List</div>
                            </div>
                            <div id="noButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                            </div>
                        </div>
                    </div>
                    <input type="submit" style="opacity: 0; display: none;" />
                </form>
                        </div>`);
                                $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                                    event.preventDefault();
                                    blacket.listItem(item, itemId, $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val());
                                });
                                $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).focus();
                                $(`#yesButton`).click(() => {
                                    blacket.listItem(item, itemId, $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val());
                                });
                                $(`#noButton`).click(() => {
                                    $(`.arts__modal___VpEAD-camelCase`).remove();
                                });
                                $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).on('input', () => {
                                    if (/[^0-9]/.test($(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val())) {
                                        $(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val($(`.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)`).val().replace(/[^0-9]/g, ''));
                                    }
                                });
                                blacket.stopLoading();
                            });
                        });
                        $("#cancelButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                        });
                    });
                });
                blacket.stopLoading();
            } else setTimeout(reset, 1);
        });
    } else if (location.pathname.split('/')[1].split('?')[0] == 'clans') {
        if (blacket.user.clan.id && !location.pathname.split('/')[2]) {
            history.pushState(null, null, "/clans/my-clan");
            document.getElementById('app').innerHTML = blacket.blacketUtils.pages['my-clan'];
            let upgradePrices = [
                25000,
                100000,
                250000,
                500000
            ];
            
            $(async function reset() {
                if (blacket.user) {
                    $("#clanBackButton").click(() => {
                        if ($("#clanMainBody").css("display") == "block") location.href = "/clans/discover";
                        else if ($("#clanInventoryBody").css("display") == "block") {
                            $("#clanMainBody").show();
                            $("#clanInventoryBody").hide();
                        } else if ($("#clanSettingsBody").css("display") == "block") {
                            $("#clanMainBody").show();
                            $("#clanSettingsBody").hide();
                        } else if ($("#clanRequestsBody").css("display") == "block") {
                            $("#clanMainBody").show();
                            $("#clanRequestsBody").hide();
                        }
                    });
            
                    $("#clanLeaveButton").click(() => {
                        $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <div class="styles__container___1BPm9-camelCase" style="width: 35vw;">
                    <div class="styles__text___KSL4--camelCase">Are you sure you want to leave your clan? This action cannot be undone.</div>
                    <div class="styles__holder___3CEfN-camelCase">
                        <div class="styles__buttonContainer___2EaVD-camelCase">
                            <div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div>
                            </div>
                            <div id="noButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div>
                            </div>
                        </div>
                    </div>
                </div>
                        </div>`);
                        $("#noButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                        });
                        $("#yesButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                        <div class="styles__container___1BPm9-camelCase">
                            <div class="styles__text___KSL4--camelCase">Please enter your password to confirm.
                            </div>
                            <div class="styles__holder___3CEfN-camelCase">
                            <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                            <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                            border-radius: 0.313vw;
                            width: 90%;
                            height: 2.604vw;
                            margin: 0.000vw;
                            display: flex;
                            flex-direction: row;
                            align-items: center;"><input id="passwordInput" style="  border: none;
                            height: 2.083vw;
                            line-height: 2.083vw;
                            font-size: 1.458vw;
                            text-align: center;
                            font-weight: 700;
                            font-family: Nunito, sans-serif;
                            color: #ffffff;
                            background-color: #3f3f3f;
                            outline: none;
                            width: 100%;
                          " placeholder="Password" type="password" style="width: 3.125vw;"/></div>
                          ${blacket.user.otp ? `<div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                          border-radius: 0.313vw;
                          width: 90%;
                          height: 2.604vw;
                          margin: 0.000vw;
                          display: flex;
                          flex-direction: row;
                          align-items: center;"><input id="otpInput" style="  border: none;
                          height: 2.083vw;
                          line-height: 2.083vw;
                          font-size: 1.458vw;
                          text-align: center;
                          font-weight: 700;
                          font-family: Nunito, sans-serif;
                          color: #ffffff;
                          background-color: #3f3f3f;
                          outline: none;
                          width: 100%;
                        " placeholder="2FA Code" type="text" style="width: 3.125vw;"/></div>
                        ` : ""}
                        </div>
                            </div>
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div id="leaveButton"
                                    class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                    tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                        style="background-color: #2f2f2f;">Leave</div>
                                </div>
                                <div id="cancelButton"
                                    class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                    tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                        style="background-color: #2f2f2f;">Cancel</div>
                                </div>
                            </div>
                        </div>
                    </div>`);
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#leaveButton").click(() => {
                                blacket.startLoading();
                                const password = $("#passwordInput").val();
                                const otp = $("#otpInput").val();
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.requests.post("/worker/clans/leave", {
                                    password,
                                    code: otp
                                }, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.href = "/clans/discover";
                                });
                            });
                        });
                    });
            
                    $("#clanInvestmentsButton").click(() => {
                        if (blacket.clan.safe) return blacket.createToast({
                            title: "Error",
                            message: "You cannot invest while your clan is in safe mode.",
                            icon: "/content/blooks/Error.png",
                            time: 5000
                        });
                        $("body").append(`
                        <div class="arts__modal___VpEAD-camelCase">
                        <div class="styles__container___1BPm9-camelCase" style="width: 35vw;">
                        <div class="styles__text___KSL4--camelCase">
                            Investments
                            <div style="font-size: 0.911vw;margin: 0;line-height: 1.5;margin-top: 0.521vw;margin-bottom: 0.521vw;opacity: 0.5;" class="styles__text___KSL4--camelCase">
                                You are currently investing ${blacket.clan.investments.users[blacket.user.id] ? blacket.clan.investments.users[blacket.user.id].toLocaleString() : 0} tokens.
                            </div>
                            What would you like to do to your clan investments?
                        </div>
                        <div class="styles__holder___3CEfN-camelCase">
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div id="addButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Add</div>
                                </div>
                                <div id="removeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Remove</div>
                                </div>
                                <div id="upgradeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Upgrade</div>
                                </div>
                                <div id="cancelButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 1vw;margin: 0;line-height: 1.5;margin-top: 0.521vw;margin-bottom: 0.521vw;" class="styles__text___KSL4--camelCase">
                            Your clan investment level is currently level ${blacket.clan.investments.level}.
                            <br>
                            Every hour your investments will increase by ${blacket.clan.investments.level == 1 ? "0.05%" :
                                blacket.clan.investments.level == 2 ? "0.10%" :
                                    blacket.clan.investments.level == 3 ? "0.15%" :
                                        blacket.clan.investments.level == 4 ? "0.20%" :
                                            blacket.clan.investments.level == 5 ? "0.25%" : "0.00%"
                            }.
                        </div>
                    </div>
                            </div>
                        `);
                        $("#cancelButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                        });
                        $("#upgradeButton").click(() => {
                            if (blacket.clan.investments.level >= 5) return blacket.createToast({
                                title: "Error",
                                message: "You have reached the maximum investment level.",
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            $(".arts__modal___VpEAD-camelCase").remove();
                            $("body").append(`
                        <div class="arts__modal___VpEAD-camelCase">
                        <div class="styles__container___1BPm9-camelCase" style="width: 35vw;">
                        <div class="styles__text___KSL4--camelCase">
                            Investments
                            <br>
                            <br>
                            Are you sure you want to upgrade your clan investment level to level ${blacket.clan.investments.level + 1} for ${upgradePrices[blacket.clan.investments.level - 1].toLocaleString()} tokens?
                        </div>
                        <div class="styles__holder___3CEfN-camelCase">
                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                <div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div>
                                </div>
                                <div id="noButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div>
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 1vw;margin: 0;line-height: 1.5;margin-top: 0.521vw;margin-bottom: 0.521vw;" class="styles__text___KSL4--camelCase">
                            You will receive 0.05% more investments every hour.
                        </div>
                    </div>
                            </div>
                        `);
                            $("#noButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#yesButton").click(() => {
                                blacket.startLoading();
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.requests.post("/worker/clans/investments/upgrade", {}, (data) => {
                                    blacket.stopLoading();
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    });
                                    blacket.user.tokens -= upgradePrices[blacket.clan.investments.level - 1];
                                    blacket.clan.investments.level++;
                                    blacket.createToast({
                                        title: "Success",
                                        message: "Your clan investment level has been upgraded.",
                                        icon: "/content/blooks/Success.png",
                                        time: 5000
                                    });
                                });
                            });
                        });
                        $("#removeButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <div class="styles__container___1BPm9-camelCase" style="width: 35vw;">
                    <div class="styles__text___KSL4--camelCase">How many tokens would you like to remove from your clan investments?</div>
                    <div class="styles__holder___3CEfN-camelCase">
                        <div class="styles__numRow___xh98F-camelCase">
                            <div class="styles__inputContainer___2Fn7J-camelCase" style="width: 4.167vw; margin: 0.000vw;"><input id="removeTokenInput" class="styles__input___2vJSW-camelCase" placeholder="" type="tel" value="" style="width: 3.125vw;"/></div>
                            <div class="styles__numTotal___3LQaw-camelCase">/${blacket.clan.investments.users[blacket.user.id] ? blacket.clan.investments.users[blacket.user.id].toLocaleString() : 0}</div>
                        </div>
                        <div class="styles__buttonContainer___2EaVD-camelCase">
                            <div id="removeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Remove</div>
                            </div>
                            <div id="cancelButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                            </div>
                        </div>
                    </div>
                </div>
                        </div>`);
                            $(`#removeTokenInput`).on('input', () => {
                                if (/[^0-9]/.test($(`#removeTokenInput`).val())) $(`#removeTokenInput`).val($(`#removeTokenInput`).val().replace(/[^0-9]/g, ''));
                                if (parseInt($(`#removeTokenInput`).val()) > (blacket.clan.investments.users[blacket.user.id] ? blacket.clan.investments.users[blacket.user.id] : 0)) $(`#removeTokenInput`).val((blacket.clan.investments.users[blacket.user.id] ? blacket.clan.investments.users[blacket.user.id] : 0));
                            });
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#removeButton").click(() => {
                                const tokens = parseInt($(`#removeTokenInput`).val());
                                if (!tokens) return blacket.createToast({
                                    title: "Error",
                                    message: "You must specify an amount of tokens.",
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.startLoading();
                                blacket.requests.post("/worker/clans/investments/remove", {
                                    tokens: tokens
                                }, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.reload();
                                });
                            });
                        });
                        $("#addButton").click(() => {
                            $(".arts__modal___VpEAD-camelCase").remove();
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                    <div class="styles__container___1BPm9-camelCase" style="width: 35vw;">
                    <div class="styles__text___KSL4--camelCase">How many tokens would you like to add to your clan investments?</div>
                    <div class="styles__holder___3CEfN-camelCase">
                        <div class="styles__numRow___xh98F-camelCase">
                            <div class="styles__inputContainer___2Fn7J-camelCase" style="width: 4.167vw; margin: 0.000vw;"><input id="addTokenInput" class="styles__input___2vJSW-camelCase" placeholder="" type="tel" value="" style="width: 3.125vw;"/></div>
                            <div class="styles__numTotal___3LQaw-camelCase">/ ${blacket.user.tokens.toLocaleString()}</div>
                        </div>
                        <div class="styles__buttonContainer___2EaVD-camelCase">
                            <div id="addButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Add</div>
                            </div>
                            <div id="cancelButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                            </div>
                        </div>
                    </div>
                </div>
                        </div>`);
                            $(`#addTokenInput`).on('input', () => {
                                if (/[^0-9]/.test($(`#addTokenInput`).val())) $(`#addTokenInput`).val($(`#addTokenInput`).val().replace(/[^0-9]/g, ''));
                                if (parseInt($(`#addTokenInput`).val()) > blacket.user.tokens) $(`#addTokenInput`).val(blacket.user.tokens);
                            });
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#addButton").click(() => {
                                const tokens = parseInt($(`#addTokenInput`).val());
                                if (!tokens) return blacket.createToast({
                                    title: "Error",
                                    message: "You must specify an amount of tokens.",
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.startLoading();
                                blacket.requests.post("/worker/clans/investments/add", {
                                    tokens: tokens
                                }, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.reload();
                                });
                            });
                        });
                    });
            
                    blacket.appendMember = (member) => {
                        $("#clanMembers").find("div.styles__clanMembersContainer___4j8Ca-camelCase").append(`
                            <a id="${member.id}" style="" class="styles__clanMemberContainer___kld92-camelCase" href="/stats?name=${member.username}">
                                <img loading="lazy" class="styles__clanDiscoveryClanInformationClanMemberAvatar___4jmCA-camelCase" src="${member.avatar}">
                                ${blacket.clan.owner.id == blacket.user.id && member.id !== blacket.user.id ? `<div id="kick-${member.id}" class="styles__clanMemberKickButton___49DCk-camelCase">
                                    <i class="styles__clanMemberKickButtonInside___kcoA9-camelCase fas fa-hammer-crash"></i>
                                </div>` : ""}
                                <div style="color: ${member.color};" class="styles__clanDiscoveryClanInformationClanMemberUsername___jn39A-camelCase ${member.color == "rainbow" ? "rainbow" : ""}">${member.username}</div>
                                <div class="styles__clanDiscoveryClanInformationClanMemberDescription___28jDx-camelCase">Clan ${blacket.clan.owner.id == member.id ? "Owner" : "Member"}</div>
                                <div class="styles__clanDiscoveryClanInformationClanMemberDescription___28jDx-camelCase" ${blacket.clan.owner.id !== blacket.user.id ? `style="font-size: 0.65vw;position: relative;left: -0.5vw;bottom: 5.5vw;opacity: unset;text-align: right;"` : ""}>
                                    <img src="/content/tokenIconClan.png" width=2% style="position: relative; top: 0.05vw;"> ${blacket.clan.investments.users[member.id] ? blacket.clan.investments.users[member.id].toLocaleString() : 0} investments
                                </div>
                            </a>
                        `);
            
                        $(`#kick-${member.id}`).hover(() => {
                            $(`#${member.id}`).attr("href", "#");
                        }, () => {
                            $(`#${member.id}`).attr("href", `/stats?name=${member.username}`);
                        });
                        $(`#kick-${member.id}`).click(() => {
                            blacket.startLoading();
                            blacket.requests.post("/worker/clans/kick", {
                                user: member.id
                            }, (data) => {
                                if (data.error) return blacket.createToast({
                                    title: "Error",
                                    message: data.reason,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                }), blacket.stopLoading();
                                location.reload();
                            });
                        });
                    }
            
                    blacket.appendInventoryItems = () => {
                        $(".styles__packContainer___3RwSU-camelCase").each((index, element) => {
                            if (element.id !== "clanInventoryAddItemButton") element.remove();
                        });
                        Object.values(blacket.clan.inventory).forEach((item) => {
                            if (!blacket.items[item.item]) return;
                            $(`#clanInventoryAddItemButton`).before(`
                                <div id="${item.id}" class="styles__packContainer___3RwSU-camelCase" role="button" tabindex="0" style="background: ${blacket.items[item.item].color}; overflow: unset;">
                                    <div class="styles__packImgContainer___3NABW-camelCase"><img loading="lazy" src="${blacket.items[item.item].image}" class="styles__packImg___3to1S-camelCase" draggable="false"></div>
                                    <img id="${item.id}-${item.user}" src="${blacket.clan.members.find(member => member.id == item.user).avatar}" style="position: absolute; left: 0; bottom: 0; width: 20%; margin: -0.25vw;">
                                </div>`);
                            $(`#${item.id}-${item.user}`).hover(() => {
                                const position = $(`#${item.id}-${item.user}`).offset();
                                $("body").append(`
                                    <div id="tooltip" style="position: absolute; left: ${position.left + 30}px; top: ${position.top - 15}px; background: #2f2f2f; padding: 0.5vw; border-radius: 0.5vw; font-size: 0.8vw; color: white; z-index: 100000; content: '🤓'">
                                        ${blacket.clan.members.find(member => member.id == item.user).username}
                                    </div>
                                `);
                            }, () => {
                                $("#tooltip").remove();
                            });
                            if (item.user !== blacket.user.id) $(`#${item.id}`).click(() => {
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                                <form class="styles__container___1BPm9-camelCase">
                                <div class="styles__text___KSL4--camelCase">
                                    You do not own this item.
                                </div>
                            
                                   <div class="styles__holder___3CEfN-camelCase">
                                      <div class="styles__buttonContainer___2EaVD-camelCase">
                                         <div id="okayButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div>
                                         </div>
                                      </div>
                                   </div>
                                   <input type="submit" style="opacity: 0; display: none;"> 
                                </form>
                             </div>
                             `)
                                $("#okayButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                });
                            });
                            else $(`#${item.id}`).click(() => {
                                blacket.startLoading();
                                blacket.requests.post("/worker/clans/inventory/remove", {
                                    item: item.id
                                }, (data) => {
                                    blacket.stopLoading();
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    });
                                    blacket.clan.inventory = blacket.clan.inventory.filter(inv => inv.id !== item.id);
                                    blacket.user.inventory.push(item.item);
                                    $(`#${item.id}`).remove();
                                });
                            });
                        });
                    }
            
                    blacket.requests.get("/worker/clans", (data) => {
                        blacket.clan = data.clan;
            
                        if (blacket.clan.owner.id == blacket.user.id) {
                            $("#clanSettingsButton").show();
                            $("#clanRequestsButton").show();
                            $("#clanLeaveButton").hide();
                        }
            
                        $("#myclanName").html(`${blacket.clan.safe ? `<i class="fas fa-shield"></i>` : ""} ${blacket.clan.name}`);
                        if (blacket.clan.color == "rainbow") $("#myclanName").addClass("rainbow");
                        else $("#myclanName").css("color", blacket.clan.color);
            
                        $("#clanShield").find("div.styles__clanShield___49jVa-camelCase").attr("class", blacket.clan.shielded ? "styles__clanShield___49jVa-camelCase" : "styles__clanShieldCracking___k4Cam-camelCase");
                        $("#clanShield").find("div.styles__clanShieldedText___4j89C-camelCase").html(blacket.clan.shielded ? "Shielded" : "Not Shielded");
                        $("#clanShield").attr("style", `justify-content: ${blacket.clan.shielded ? "unset" : "center"}`);
            
                        $("#clanDisguise").find("div.styles__clanDisguisedText___gj83a-camelCase").html(blacket.clan.disguised ? "Disguised" : "Not Disguised");
                        $("#clanDisguise").find("img").attr("src", blacket.clan.disguised ? "/content/icons/clans/disguised.png" : "/content/icons/clans/not-disguised.png");
            
                        blacket.appendMember(blacket.clan.owner);
                        for (const member of blacket.clan.members) member.id !== blacket.clan.owner.id ? blacket.appendMember(member) : null;
            
                        $("#clanInformation").attr("href", `/clans/discover?name=${blacket.clan.name}`);
                        $("#clanInformationName").html(blacket.htmlEncode(blacket.clan.name));
                        $("#clanInformationDescription").html(blacket.htmlEncode(blacket.clan.description));
                        $("#clanInformationMembers").html(`${blacket.clan.members.length} Members`);
            
                        let ext = blacket.clan.image.split('.')[blacket.clan.image.split('.').length - 1];
                        let queryIndex = ext.indexOf('?');
                        if (queryIndex !== -1) ext = ext.slice(0, queryIndex), blacket.clan.image = blacket.clan.image.slice(0, blacket.clan.image.indexOf('?'));
                        let src = `/worker/proxy/${btoa(`${blacket.clan.image}`)}`;
            
                        $("#clanInformationImage").attr("src", src);
            
                        blacket.clan.level = 0;
                        blacket.clan.originalEXP = blacket.clan.exp;
                        let needed;
                        for (let i = 0; i <= 27915; i++) {
                            needed = 5 * Math.pow(blacket.clan.level, blacket.config.exp.difficulty) * blacket.clan.level;
                            if (blacket.clan.exp >= needed) {
                                blacket.clan.exp -= needed;
                                blacket.clan.level++;
                            }
                        }
            
                        $("#clanInformationLevel").html(`Level ${blacket.clan.level}`);
                        $("#clanInformationEXP").html(`EXP ${blacket.clan.originalEXP.toLocaleString()}`);
            
                        $("#clanInformationOwner").html(blacket.clan.owner.username);
            
                        $("#clanInformationStatuses").html(`
                            <div>
                                <div id="clanInformationOnline" class="styles__clanDiscoveryClanStatusOnline___fjm2a-camelCase"></div> ${blacket.clan.online} Online
                            </div>
                            <div>
                                <div id="clanInformationOffline" class="styles__clanDiscoveryClanStatusOffline___fjm2a-camelCase"></div> ${blacket.clan.offline} Offline
                            </div>
                        `);
            
                        let investments = 0;
            
                        for (const user in blacket.clan.investments.users) investments += blacket.clan.investments.users[user];
            
                        $("#clanInvestments").html(investments.toLocaleString());
            
                        $("#clanInventoryButton").click(() => {
                            /*if (blacket.clan.safe) return blacket.createToast({
                                title: "Error",
                                message: "Your cannot access your clan inventory while your clan is in safe mode.",
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });*/
                            $("#clanMainBody").hide();
                            $("#clanInventoryBody").show();
                        });
            
                        $("#clanSettingsSafeModeButton").html(`Safe Mode: ${blacket.clan.safe ? "On" : "Off"}`);
                        $("#clanSettingsJoinRequestsButton").html(`Join Requests: ${blacket.clan.settings.requests ? "On" : "Off"}`);
            
                        $("#clanSettingsButton").click(() => {
                            $("#clanMainBody").hide();
                            $("#clanInventoryBody").hide();
                            $("#clanRequestsBody").hide();
                            $("#clanSettingsBody").show();
                        });
            
                        $("#clanRequestsButton").click(() => {
                            $("#clanMainBody").hide();
                            $("#clanInventoryBody").hide();
                            $("#clanSettingsBody").hide();
                            blacket.startLoading();
                            blacket.requests.get("/worker/clans/requests/pending", (data) => {
                                blacket.stopLoading();
                                if (data.error) return blacket.createToast({
                                    title: "Error",
                                    message: data.reason,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                }), $("#clanMainBody").show();
                                $("#clanRequestsBody").show();
                                $("#clanRequests").html("");
                                if (data.requests.length == 0) return $("#clanRequests").html(`<div style="font-size: 1.042vw; line-height: 1.042vw; color: white;">There are no pending requests.</div>`);
                                for (const request of data.requests) {
                                    $("#clanRequests").append(`
                                    <div id="${request.id}-request" class="styles__memberContainer___3V0Ei-camelCase" role="button" tabindex="0">
                                        <img loading="lazy" src="${request.avatar}" class="styles__memberAvatar___1Z3Xu-camelCase">
                                        <div style="color: ${request.color};" class="styles__memberUsername___1Z3Xu-camelCase ${request.color == "rainbow" ? "rainbow" : ""}">${request.username}</div>
                                    </div>
                                    `);
                                    $(`#${request.id}-request`).click(() => {
                                        $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                                <div class="styles__container___1BPm9-camelCase">
                                    <div class="styles__text___KSL4--camelCase">Are you sure you want to accept ${request.username}'s request to join your clan?</div>
                                        <div class="styles__buttonContainer___2EaVD-camelCase">
                                            <div id="acceptButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Accept</div>
                                            </div>
                                            <div id="rejectButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Reject</div>
                                            </div>
                                            <div id="cancelButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                        </div>`);
                                        $("#cancelButton").click(() => {
                                            $(".arts__modal___VpEAD-camelCase").remove();
                                        });
                                        $("#acceptButton").click(() => {
                                            blacket.startLoading();
                                            $(".arts__modal___VpEAD-camelCase").remove();
                                            blacket.requests.post("/worker/clans/requests/accept", {
                                                user: request.id
                                            }, (data) => {
                                                blacket.stopLoading();
                                                if (data.error) return blacket.createToast({
                                                    title: "Error",
                                                    message: data.reason,
                                                    icon: "/content/blooks/Error.png",
                                                    time: 5000
                                                });
                                                $(`#${request.id}-request`).remove();
                                                blacket.createToast({
                                                    title: "Success",
                                                    message: `You have accepted ${request.username}'s request to join your clan.`,
                                                    icon: "/content/blooks/Success.png",
                                                    time: 5000
                                                });
                                            });
                                        });
                                        $("#rejectButton").click(() => {
                                            blacket.startLoading();
                                            $(".arts__modal___VpEAD-camelCase").remove();
                                            blacket.requests.post("/worker/clans/requests/reject", {
                                                user: request.id
                                            }, (data) => {
                                                blacket.stopLoading();
                                                if (data.error) return blacket.createToast({
                                                    title: "Error",
                                                    message: data.reason,
                                                    icon: "/content/blooks/Error.png",
                                                    time: 5000
                                                });
                                                blacket.createToast({
                                                    title: "Success",
                                                    message: `You have rejected ${request.username}'s request to join your clan.`,
                                                    icon: "/content/blooks/Success.png",
                                                    time: 5000
                                                });
                                                $(`#${request.id}-request`).remove();
                                            });
                                        });
                                    });
                                }
                            });
                        });
            
                        $("#clanSettingsChangeNameButton").click(() => {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                                <div class="styles__container___1BPm9-camelCase">
                                    <div class="styles__text___KSL4--camelCase">Enter new clan name.</div>
                                    <div class="styles__holder___3CEfN-camelCase">
                                        <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                            <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                            border-radius: 0.313vw;
                                            width: 90%;
                                            height: 2.604vw;
                                            margin: 0.000vw;
                                            display: flex;
                                            flex-direction: row;
                                            align-items: center;"><input style="  border: none;
                                            height: 2.083vw;
                                            line-height: 2.083vw;
                                            font-size: 1.458vw;
                                            text-align: center;
                                            font-weight: 700;
                                            font-family: Nunito, sans-serif;
                                            color: #ffffff;
                                            background-color: #3f3f3f;
                                            outline: none;
                                            width: 100%;
                                          " placeholder="Name" maxlength="24" type="text" value="${blacket.clan.name}" style="width: 3.125vw;"/></div>
                                        </div>
                                        <div class="styles__buttonContainer___2EaVD-camelCase">
                                            <div id="changeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Change</div>
                                            </div>
                                            <div id="cancelButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                            </div>
                                        </div>
                                        <div style="font-size: 1.042vw; line-height: 1.042vw;" class="styles__text___KSL4--camelCase">This will allow anyone to take your old clan name! Take caution while performing this action!</div>
                                    </div>
                                </div>
                                        </div>`);
                            $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").focus();
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#changeButton").click(() => {
                                blacket.startLoading();
                                const name = $(".styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)").val();
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.requests.post("/worker/clans/settings/name", {
                                    name: name
                                }, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.reload();
                                });
                            });
                        });
            
                        $("#clanSettingsChangeDescriptionButton").click(() => {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                                <div class="styles__container___1BPm9-camelCase">
                                    <div class="styles__text___KSL4--camelCase">Enter new clan description.</div>
                                    <div class="styles__holder___3CEfN-camelCase">
                                        <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                        <div
                                        style="border: 0.156vw solid rgba(0, 0, 0, 0.17); border-radius: 0.313vw;width: 90%;height: 10.417vw;margin: 0.000vw;display: flex;flex-direction: row;align-items: center;">
                                        <textarea id="clanInputDescription"
                                            style="border: none;height: 10.417vw;line-height: 2.083vw;font-size: 1.458vw;text-align: center;font-weight: 700;font-family: Nunito, sans-serif;color: #ffffff;background-color: #3f3f3f;outline: none;width: 100%; resize:none;"
                                            placeholder="Description" maxlength=168></textarea>
                                    </div>
                                        </div>
                                        <div class="styles__buttonContainer___2EaVD-camelCase">
                                            <div id="changeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Change</div>
                                            </div>
                                            <div id="cancelButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Cancel</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                        </div>`);
                            $("#clanInputDescription").val(blacket.clan.description);
                            $("#clanInputDescription").focus();
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#changeButton").click(() => {
                                blacket.startLoading();
                                const description = $("#clanInputDescription").val();
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.requests.post("/worker/clans/settings/description", {
                                    description: description
                                }, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.reload();
                                });
                            });
                        });
            
                        $("#clanSettingsChangeImageButton").click(() => {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase" style="width: 39.063vw;">
                                <div class="styles__text___KSL4--camelCase">Change clan image.</div>
                                <div class="styles__holder___3CEfN-camelCase">
                                    <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                        <div id="uploadButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0" style="margin: 0.521vw; width: 91%;">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Upload a Cover Image</div>
                                    </div>
                                        <img id="previewImage" src="" style="width: 25%; margin: 0.521vw;" onerror="this.style.display='none'" onload="this.style.display='block'">
                                    </div>
                                </div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div id="changeButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Change</div>
                                    </div>
                                    <div id="cancelButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Cancel</div>
                                    </div>
                                </div>
                            </div>
                        </div>`);
                            $(`.styles__container___1BPm9-camelCase`).submit((event) => {
                                event.preventDefault();
                            });
                            $("#previewImage").attr("src", blacket.clan.image);
                            $("#uploadButton").click(() => {
                                let input = document.createElement('input');
                                input.type = 'file';
                                input.onchange = _this => {
                                    blacket.startLoading();
                                    let files = Array.from(input.files);
                                    if (!files[0].name.match(/\.(png|jpg|jpeg|gif|webp)$/i)) return blacket.stopLoading(), blacket.createToast({
                                        title: "Error",
                                        message: `File type is not supported.`,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    });
                                    if (files[0].size > 8 * 1024 * 1024) return blacket.stopLoading(), blacket.createToast({
                                        title: "Error",
                                        message: `File size is too large. (Max 8 MB)`,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    });
                                    let formData = new FormData();
                                    formData.append("file", files[0]);
                                    blacket.requests.upload("/worker/upload", formData, (data) => {
                                        blacket.stopLoading();
                                        if (data.error) return blacket.createToast({
                                            title: "Error",
                                            message: data.reason,
                                            icon: "/content/blooks/Error.png",
                                            time: 5000
                                        });
                                        $("#previewImage").attr("src", `${location.protocol}//${location.host}${data.path.replaceAll(" ", "%20")}`);
                                    });
                                }
                                input.click();
                            });
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#changeButton").click(() => {
                                blacket.startLoading();
                                const image = $("#previewImage").attr("src");
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.requests.post("/worker/clans/settings/image", {
                                    image: image
                                }, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.reload();
                                });
                            });
                        });
            
                        $("#clanSettingsResetColorButton").click(() => {
                            blacket.startLoading();
                            blacket.requests.post("/worker/clans/settings/reset-color", {}, (data) => {
                                if (data.error) return blacket.createToast({
                                    title: "Error",
                                    message: data.reason,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                }), blacket.stopLoading();
                                location.reload();
                            });
                        });
            
                        $("#clanSettingsSafeModeButton").click(() => {
                            if (blacket.clan.safe_cooldown > Date.now()) return $("body").append(`
                            <div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase" style="width: 39.063vw;">
                                <div class="styles__text___KSL4--camelCase">You are able to toggle safe mode again &lt;t:${Math.floor(blacket.clan.safe_cooldown / 1000)}:R&gt;.</div>
                                <div class="styles__holder___3CEfN-camelCase" style="display: flex;gap: 1vw;flex-wrap: wrap;">
                                </div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div id="okayButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Okay</div>
                                    </div>
                                </div>
                            </div>
                        </div>`), $("#okayButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("body").append(`
                            <div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase" style="width: 39.063vw;">
                                <div class="styles__text___KSL4--camelCase">
                                ${blacket.clan.safe ? "Are you sure you want to disable safe mode?" : "Are you sure you want to enable safe mode?"}
                                <br>
                                <br>
                                ${blacket.clan.safe ? `
                                    Disabling safe mode will allow your clan members to invest, but will also let others attack your clan.
                                ` : `
                                    Enabling safe mode will prevent others from attacking your clan, but will also prevent your clan members from investing.
                                `}
                                </div>
                                <div class="styles__holder___3CEfN-camelCase" style="display: flex;gap: 1vw;flex-wrap: wrap;">
                                </div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div id="yesButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Yes</div>
                                    </div>
                                    <div id="noButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">No</div>
                                    </div>
                                </div>
                            </div>
                        </div>`);
                            $("#yesButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.startLoading();
                                blacket.requests.post("/worker/clans/settings/safe-mode", {}, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.reload();
                                });
                            });
                            $("#noButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                        });
            
                        $("#clanSettingsJoinRequestsButton").click(() => {
                            blacket.startLoading();
                            blacket.requests.post("/worker/clans/settings/requests", {}, (data) => {
                                blacket.stopLoading();
                                if (data.error) return blacket.createToast({
                                    title: "Error",
                                    message: data.reason,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                blacket.clan.settings.requests = !blacket.clan.settings.requests;
                                $("#clanSettingsJoinRequestsButton").html(`Join Requests: ${blacket.clan.settings.requests ? "On" : "Off"}`);
                            });
                        });
            
                        $("#clanSettingsTransferOwnershipButton").click(() => {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase" style="width: 39.063vw;">
                                <div class="styles__text___KSL4--camelCase">Select a member to transfer ownership to.</div>
                                <div id="clanMembersSettings" class="styles__holder___3CEfN-camelCase" style="display: flex;gap: 1vw;flex-wrap: wrap;">
                                </div>
                                <div class="styles__text___KSL4--camelCase">Member selected: <b id="selectedMember">None</b></div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div id="transferButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Transfer</div>
                                    </div>
                                    <div id="cancelButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Cancel</div>
                                    </div>
                                </div>
                                <style>
                                    @keyframes warning {
                                        0% {
                                            opacity: 1;
                                        }
                                        50% {
                                            opacity: 0.5;
                                        }
                                        100% {
                                            opacity: 1;
                                        }
                                    }
                                </style>
                                <div style="font-size: 1.042vw; line-height: 1.042vw; color: red;animation: warning 1s infinite linear;" class="styles__text___KSL4--camelCase">This will transfer ownership of the clan to the selected member. <b>Take caution while performing this action!</b></div>
                            </div>
                        </div>`);
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            for (const member of blacket.clan.members) {
                                if (member.id == blacket.clan.owner.id) continue;
                                $("#clanMembersSettings").append(`
                                <div id="${member.id}-settings"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">${member.username}</div>
                                </div>`);
                                $(`#${member.id}-settings`).click(() => {
                                    $("#selectedMember").html(member.username);
                                });
                            }
                            $("#transferButton").click(() => {
                                if ($("#selectedMember").html() == "None") return blacket.createToast({
                                    title: "Error",
                                    message: "Please select a member.",
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                const member = blacket.clan.members.find(member => member.username == $("#selectedMember").html());
                                $(".arts__modal___VpEAD-camelCase").remove();
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase">
                                <div class="styles__text___KSL4--camelCase">Please enter your password to confirm.
                                <div style="font-size: 1.25vw; opacity: 0.5;margin-top: 0.5vw;">Member selected: <b>${member.username}</b></div>
                                </div>
                                <div class="styles__holder___3CEfN-camelCase">
                                <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                border-radius: 0.313vw;
                                width: 90%;
                                height: 2.604vw;
                                margin: 0.000vw;
                                display: flex;
                                flex-direction: row;
                                align-items: center;"><input id="passwordInput" style="  border: none;
                                height: 2.083vw;
                                line-height: 2.083vw;
                                font-size: 1.458vw;
                                text-align: center;
                                font-weight: 700;
                                font-family: Nunito, sans-serif;
                                color: #ffffff;
                                background-color: #3f3f3f;
                                outline: none;
                                width: 100%;
                              " placeholder="Password" type="password" style="width: 3.125vw;"/></div>
                              ${blacket.user.otp ? `<div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                              border-radius: 0.313vw;
                              width: 90%;
                              height: 2.604vw;
                              margin: 0.000vw;
                              display: flex;
                              flex-direction: row;
                              align-items: center;"><input id="otpInput" style="  border: none;
                              height: 2.083vw;
                              line-height: 2.083vw;
                              font-size: 1.458vw;
                              text-align: center;
                              font-weight: 700;
                              font-family: Nunito, sans-serif;
                              color: #ffffff;
                              background-color: #3f3f3f;
                              outline: none;
                              width: 100%;
                            " placeholder="2FA Code" type="text" style="width: 3.125vw;"/></div>
                            ` : ""}
                            </div>
                                </div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div id="transferButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Transfer</div>
                                    </div>
                                    <div id="cancelButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Cancel</div>
                                    </div>
                                </div>
                                <style>
                                    @keyframes warning {
                                        0% {
                                            opacity: 1;
                                        }
                                        50% {
                                            opacity: 0.5;
                                        }
                                        100% {
                                            opacity: 1;
                                        }
                                    }
                                </style>
                                <div style="font-size: 1.042vw; line-height: 1.042vw; color: red;animation: warning 1s infinite linear;" class="styles__text___KSL4--camelCase">This will transfer ownership of the clan to the selected member. <b>Take caution while performing this action!</b></div>
                            </div>
                        </div>`);
                                $("#cancelButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                });
                                $("#transferButton").click(() => {
                                    blacket.startLoading();
                                    const password = $("#passwordInput").val();
                                    const otp = $("#otpInput").val();
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                    blacket.requests.post("/worker/clans/settings/transfer-ownership", {
                                        password: password,
                                        code: otp,
                                        user: member.id
                                    }, (data) => {
                                        if (data.error) return blacket.createToast({
                                            title: "Error",
                                            message: data.reason,
                                            icon: "/content/blooks/Error.png",
                                            time: 5000
                                        }), blacket.stopLoading();
                                        location.reload();
                                    });
                                });
                            });
                        });
            
                        $("#clanSettingsDisbandClanButton").click(() => {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase">
                                <div class="styles__text___KSL4--camelCase">Please enter your password to confirm.</div>
                                <div class="styles__holder___3CEfN-camelCase">
                                <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                <div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                                border-radius: 0.313vw;
                                width: 90%;
                                height: 2.604vw;
                                margin: 0.000vw;
                                display: flex;
                                flex-direction: row;
                                align-items: center;"><input id="passwordInput" style="  border: none;
                                height: 2.083vw;
                                line-height: 2.083vw;
                                font-size: 1.458vw;
                                text-align: center;
                                font-weight: 700;
                                font-family: Nunito, sans-serif;
                                color: #ffffff;
                                background-color: #3f3f3f;
                                outline: none;
                                width: 100%;
                              " placeholder="Password" type="password" style="width: 3.125vw;"/></div>
                              ${blacket.user.otp ? `<div style="border: 0.156vw solid rgba(0, 0, 0, 0.17);
                              border-radius: 0.313vw;
                              width: 90%;
                              height: 2.604vw;
                              margin: 0.000vw;
                              display: flex;
                              flex-direction: row;
                              align-items: center;"><input id="otpInput" style="  border: none;
                              height: 2.083vw;
                              line-height: 2.083vw;
                              font-size: 1.458vw;
                              text-align: center;
                              font-weight: 700;
                              font-family: Nunito, sans-serif;
                              color: #ffffff;
                              background-color: #3f3f3f;
                              outline: none;
                              width: 100%;
                            " placeholder="2FA Code" type="text" style="width: 3.125vw;"/></div>
                            ` : ""}
                            </div>
                                </div>
                                <div class="styles__buttonContainer___2EaVD-camelCase">
                                    <div id="disbandButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Disband</div>
                                    </div>
                                    <div id="cancelButton"
                                        class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                        tabindex="0">
                                        <div class="styles__shadow___3GMdH-camelCase"></div>
                                        <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                        <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                            style="background-color: #2f2f2f;">Cancel</div>
                                    </div>
                                </div>
                                <style>
                                    @keyframes warning {
                                        0% {
                                            opacity: 1;
                                        }
                                        50% {
                                            opacity: 0.5;
                                        }
                                        100% {
                                            opacity: 1;
                                        }
                                    }
                                </style>
                                <div style="font-size: 1.042vw; line-height: 1.042vw; color: red;animation: warning 1s infinite linear;" class="styles__text___KSL4--camelCase">This will disband the clan causing it to be deleted. <b>There is no way to undo this action. Take caution while performing this action!</b></div>
                            </div>
                        </div>`);
                            $("#cancelButton").click(() => {
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            $("#disbandButton").click(() => {
                                blacket.startLoading();
                                const password = $("#passwordInput").val();
                                const otp = $("#otpInput").val();
                                $(".arts__modal___VpEAD-camelCase").remove();
                                blacket.requests.post("/worker/clans/settings/disband", {
                                    password: password,
                                    code: otp
                                }, (data) => {
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), blacket.stopLoading();
                                    location.reload();
                                });
                            });
                        });
            
                        blacket.appendInventoryItems();
            
                        $("#clanInventoryAddItemButton").click(() => {
                            $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                            <div class="styles__container___1BPm9-camelCase" style="width: 25.3vw;">
                            <div class="styles__text___KSL4--camelCase">
                                Please select an item.
                            </div>
                               <div class="styles__holder___3CEfN-camelCase" style="margin: 1vw;">
                                   <div id="itemHolder" class="styles__packsWrapper___2hBF4-camelCase" style="height: fit-content;max-height:30vw;overflow-y: scroll;"></div> 
                               </div>
                            </div>
                         </div>
                         </div>
                         `)
                            $(".arts__modal___VpEAD-camelCase").click(function (e) {
                                if (e.target !== this) return;
                                $(".arts__modal___VpEAD-camelCase").remove();
                            });
                            blacket.user.inventory.forEach((item) => {
                                if (!blacket.items[item]) return;
                                const id = Math.random().toString(36).substring(2, 15);
                                $(`#itemHolder`).append(`
                                    <div id="${id}" class="styles__packContainer___3RwSU-camelCase" role="button" tabindex="0" style="background: ${blacket.items[item].color}; overflow: unset;">
                                        <div class="styles__packImgContainer___3NABW-camelCase"><img loading="lazy" src="${blacket.items[item].image}" class="styles__packImg___3to1S-camelCase" draggable="false"></div>
                                    </div>`);
                                $(`#${id}`).click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                    blacket.startLoading();
                                    blacket.requests.post("/worker/clans/inventory/add", {
                                        item: item
                                    }, (data) => {
                                        blacket.stopLoading();
                                        if (data.error) return blacket.createToast({
                                            title: "Error",
                                            message: data.reason,
                                            icon: "/content/blooks/Error.png",
                                            time: 5000
                                        });
                                        blacket.clan.inventory.push({
                                            id: data.item,
                                            item: item,
                                            user: blacket.user.id
                                        });
                                        blacket.user.inventory.splice(blacket.user.inventory.indexOf(item), 1);
                                        blacket.appendInventoryItems();
                                    });
                                });
                            });
                        });
            
                        blacket.stopLoading();
                    });
                } else setTimeout(reset, 1);
            });
        } else {
            history.pushState(null, null, "/clans/discover");
            document.getElementById('app').innerHTML = blacket.blacketUtils.pages['clan-discover'];

            $(async function reset() {
                if (blacket.user) {
                    $("#clanPreviewOwner").text(blacket.user.userdata);
                    $("#clanPreviewOwner").css("color", blacket.user.color);
            
                    $("#backToDiscoveryButton").click(() => {
                        $("#clanDiscoveryPage").show();
                        $("#backToDiscoveryButton").hide();
                        $("#clanInfoPage").hide();
                        $("#clanRequestsPage").hide();
                        blacket.discoverClans("page", blacket.currentPage);
                        history.pushState(null, null, `/clans/discover`);
                    });
            
                    blacket.currentPage = 1;
                    blacket.maxPages = 1;
            
                    blacket.discoverClans = async (type, clan) => {
                        if (type == "page") {
                            blacket.currentPage = clan;
                            blacket.startLoading();
                            blacket.requests.get(`/worker/clans/discover/page/${clan}`, (data) => {
                                if (data.error) return blacket.stopLoading(), blacket.createToast({
                                    title: "Error",
                                    message: data.reason,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                blacket.maxPages = data.pages;
                                if (blacket.currentPage == 1) $("#backPageButton").css("display", "none");
                                else $("#backPageButton").css("display", "block");
                                if (blacket.currentPage == blacket.maxPages) $("#forwardPageButton").css("display", "none");
                                else $("#forwardPageButton").css("display", "block");
                                $("#pageNumber").html(`Page ${blacket.currentPage}/${blacket.maxPages}`);
                                $("#clansDiscoveryContainer").html("");
                                data.clans.forEach(clan => {
                                    clan.level = 0;
                                    clan.originalEXP = clan.exp;
                                    let needed;
                                    for (let i = 0; i <= 27915; i++) {
                                        needed = 5 * Math.pow(clan.level, blacket.config.exp.difficulty) * clan.level;
                                        if (clan.exp >= needed) {
                                            clan.exp -= needed;
                                            clan.level++;
                                        }
                                    }
                                    let id = Math.random().toString(36).substring(2, 10);
                                    let ext = clan.image.split('.')[clan.image.split('.').length - 1];
                                    let queryIndex = ext.indexOf('?');
                                    if (queryIndex !== -1) ext = ext.slice(0, queryIndex), clan.image = clan.image.slice(0, clan.image.indexOf('?'));
                                    let src = `/worker/proxy/${btoa(`${clan.image}`)}`;
                                    $("#clansDiscoveryContainer").append(`
                                    <div id="${id}" class="styles__clansDiscoveryClanContainer___cbA4a-camelCase">
                                    <div class="styles__clansDiscoveryClanImageFiller___vbA3a-camelCase"><img loading="lazy"
                                            class="styles__coverImage___3ahFy-camelCase" src="${src}"></div>
                                    <div class="styles__clansDiscoveryClanTotalMembersContainer___hjvmA-camelCase">
                                        <div class="styles__clansDiscoveryClanTotalMembersText___fjmCa-camelCase">${clan.members.length == 1 ? "1 Member" : `${clan.members.length} Members`}</div>
                                    </div>
                                    <div style="color: ${clan.color};${clan.color == "rainbow" ? " font-size: 1.042vw;" : ""}" class="styles__clanDiscoveryClanName___gnV49-camelCase${clan.color == "rainbow" ? " rainbow" : ""}">
                                        ${clan.safe ? `<i class="fas fa-shield"></i>` : ""} ${clan.name}
                                    </div>
                                    <div class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">Level ${clan.level}</div>
                                    <div class="styles__clanDiscoveryClanDescription___lkb3a-camelCase">${blacket.htmlEncode(clan.description)}</div>
                                    <div class="styles__clanDiscoveryClanSpacer___49anv-camelCase"></div>
                                    <div class="styles__clanDiscoveryClanAuthorContainer___28amc-camelCase"><i
                                            class="styles__authorIcon___-Y2-E-camelCase fas fa-user" aria-hidden="true"></i>
                                        <div class="styles__clanDiscoveryClanAuthorText___38NVa-camelCase">${clan.owner.username}</div>
                                        <div class="styles__clanDiscoveryClanStatusesContainer___59mXC-camelCase">
                                                        <div>
                                                            <div class="styles__clanDiscoveryClanStatusOnline___fjm2a-camelCase"></div> ${clan.online} Online
                                                        </div>
                                                        <div>
                                                            <div class="styles__clanDiscoveryClanStatusOffline___fjm2a-camelCase"></div> ${clan.offline} Offline
                                                        </div>
                                                    </div>
                                    </div>
                                </div>`);
                                    $(`#${id}`).click(() => {
                                        blacket.getClan(clan);
                                    });
                                });
                                $("#backToDiscoveryButton").hide();
                                blacket.stopLoading();
                                return data.clans;
                            });
                        } else if (type == "search") {
                            if (!clan) return blacket.discoverClans("page", 1);
                            blacket.startLoading();
                            blacket.requests.get(`/worker/clans/discover/name/${clan}`, (data) => {
                                if (data.error) return blacket.stopLoading(), blacket.createToast({
                                    title: "Error",
                                    message: data.reason,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                blacket.currentPage = 1;
                                blacket.maxPages = data.pages;
                                if (blacket.currentPage == 1) $("#backPageButton").css("display", "none");
                                else $("#backPageButton").css("display", "block");
                                if (blacket.currentPage == blacket.maxPages) $("#forwardPageButton").css("display", "none");
                                else $("#forwardPageButton").css("display", "block");
                                $("#pageNumber").html(`Page ${blacket.currentPage}/${blacket.maxPages}`);
                                $("#clansDiscoveryContainer").html("");
                                data.clans.forEach(clan => {
                                    clan.level = 0;
                                    clan.originalEXP = clan.exp;
                                    let needed;
                                    for (let i = 0; i <= 27915; i++) {
                                        needed = 5 * Math.pow(clan.level, blacket.config.exp.difficulty) * clan.level;
                                        if (clan.exp >= needed) {
                                            clan.exp -= needed;
                                            clan.level++;
                                        }
                                    }
                                    let id = Math.random().toString(36).substring(2, 10);
                                    let ext = clan.image.split('.')[clan.image.split('.').length - 1];
                                    let queryIndex = ext.indexOf('?');
                                    if (queryIndex !== -1) ext = ext.slice(0, queryIndex), clan.image = clan.image.slice(0, clan.image.indexOf('?'));
                                    let src = `/worker/proxy/${btoa(`${clan.image}`)}`;
                                    $("#clansDiscoveryContainer").append(`
                                    <div id="${id}" class="styles__clansDiscoveryClanContainer___cbA4a-camelCase">
                                    <div class="styles__clansDiscoveryClanImageFiller___vbA3a-camelCase"><img loading="lazy"
                                            class="styles__coverImage___3ahFy-camelCase" src="${src}"></div>
                                    <div class="styles__clansDiscoveryClanTotalMembersContainer___hjvmA-camelCase">
                                        <div class="styles__clansDiscoveryClanTotalMembersText___fjmCa-camelCase">${clan.members.length == 1 ? "1 Member" : `${clan.members.length} Members`}</div>
                                    </div>
                                    <div style="color: ${clan.color};${clan.color == "rainbow" ? " font-size: 1.042vw;" : ""}" class="styles__clanDiscoveryClanName___gnV49-camelCase${clan.color == "rainbow" ? " rainbow" : ""}">
                                        ${clan.safe ? `<i class="fas fa-shield"></i>` : ""} ${clan.name}
                                    </div>
                                    <div class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">Level ${clan.level}</div>
                                    <div class="styles__clanDiscoveryClanDescription___lkb3a-camelCase">${blacket.htmlEncode(clan.description)}</div>
                                    <div class="styles__clanDiscoveryClanSpacer___49anv-camelCase"></div>
                                    <div class="styles__clanDiscoveryClanAuthorContainer___28amc-camelCase"><i
                                            class="styles__authorIcon___-Y2-E-camelCase fas fa-user" aria-hidden="true"></i>
                                        <div class="styles__clanDiscoveryClanAuthorText___38NVa-camelCase">${clan.owner.username}</div>
                                        <div class="styles__clanDiscoveryClanStatusesContainer___59mXC-camelCase">
                                                        <div>
                                                            <div class="styles__clanDiscoveryClanStatusOnline___fjm2a-camelCase"></div> ${clan.online} Online
                                                        </div>
                                                        <div>
                                                            <div class="styles__clanDiscoveryClanStatusOffline___fjm2a-camelCase"></div> ${clan.offline} Offline
                                                        </div>
                                                    </div>
                                    </div>
                                </div>`);
                                    $(`#${id}`).click(() => {
                                        blacket.getClan(clan);
                                    });
                                });
                                blacket.stopLoading();
                                return data.clans;
                            });
                        }
                    }
            
                    blacket.getClan = (clan) => {
                        blacket.startLoading();
                        $("#clanDiscoveryPage").hide();
                        $("#backToDiscoveryButton").show();
                        $("#clanInfoPage").show();
                        $("#clanInfoName").html(`${clan.safe ? `<i class="fas fa-shield"></i>` : ""} ${clan.name}`);
                        if (clan.color == "rainbow") $("#clanInfoName").addClass("rainbow");
                        else $("#clanInfoName").css("color", clan.color);
                        let ext = clan.image.split('.')[clan.image.split('.').length - 1];
                        let queryIndex = ext.indexOf('?');
                        if (queryIndex !== -1) ext = ext.slice(0, queryIndex), clan.image = clan.image.slice(0, clan.image.indexOf('?'));
                        let src = `/worker/proxy/${btoa(`${clan.image}`)}`;
                        $("#clanInfoImage").attr("src", src);
                        $("#clanInfoDescription").html(`
                        ${blacket.htmlEncode(clan.description)}
                        <div style="opacity: 0.5; font-size: 0.8vw;">This clan is ${clan.safe ? "in safe mode." : "not in safe mode."
                            }</div>
                        `);
                        $("#clanInfoLevel").html(`Level ${clan.level.toLocaleString()}`);
                        $("#clanInfoEXP").html(`EXP ${clan.originalEXP.toLocaleString()}`);
                        $("#clanInfoCreated").html(`Created at ${new Date(clan.created * 1000).toLocaleDateString()} ${new Date(clan.created * 1000).toLocaleTimeString()}`);
                        blacket.requests.get("/worker/clans/requests/pending/me", (data) => {
                            blacket.stopLoading();
                            if (data.error) return blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            if (data.clans.find(c => c.id == clan.id)) clan.accepted = data.clans.find(c => c.id == clan.id).accepted;
                            $("#requestToJoinButton")[0].children[2].children[0].children[1].innerHTML = clan.sent ? "Request Pending" : "Request to Join";
                            $("#requestToJoinButton")[0].children[2].children[0].children[0].className = clan.sent ? "styles__hostIcon___3BjGq-camelCase fas fa-clock" : "styles__hostIcon___3BjGq-camelCase fas fa-swords";
                            if (!blacket.user.clan) {
                                $("#requestToJoinButton").css("opacity", clan.sent ? "0.6" : "1");
                                $("#requestToJoinButton").css("pointer-events", clan.sent ? "none" : "all");
                                if (!clan.accepted) $("#requestToJoinButton").css("display", clan.members.find(member => member.id == blacket.user.id) ? "none" : "block");
                                else $("#requestToJoinButton").css("display", clan.accepted ? "none" : "block");
                            }
                            if (blacket.user.clan) {
                                if (blacket.user.clan.id == clan.id) $("#requestToJoinButton").css("display", "none");
                                else {
                                    $("#requestToJoinButton").css("opacity", "unset");
                                    $("#requestToJoinButton").css("pointer-events", "unset");
                                    $("#requestToJoinButton").css("display", "block");
                                    $("#requestToJoinButton")[0].children[2].children[0].children[1].innerHTML = "Attack"
                                    $("#requestToJoinButton")[0].children[2].children[0].children[0].className = "styles__hostIcon___3BjGq-camelCase fas fa-bomb";
                                    if (clan.safe) {
                                        $("#requestToJoinButton").css("opacity", "0.6");
                                        $("#requestToJoinButton").css("pointer-events", "none");
                                    }
                                }
                            }
            
                            $("#requestToJoinButton").off("click");
                            if (!blacket.user.clan) $("#requestToJoinButton").click(() => {
                                blacket.startLoading();
                                blacket.requests.post("/worker/clans/requests/send", {
                                    clan: clan.id
                                }, (data) => {
                                    blacket.stopLoading();
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    });
                                    blacket.createToast({
                                        title: "Success",
                                        message: `You have sent a request to join ${clan.safe ? `<i class="fas fa-shield"></i>` : ""} ${clan.name}.`,
                                        icon: "/content/blooks/Success.png",
                                        time: 5000
                                    });
                                    $("#requestToJoinButton")[0].children[2].children[0].children[1].innerHTML = "Request Pending";
                                    $("#requestToJoinButton")[0].children[2].children[0].children[0].className = "styles__hostIcon___3BjGq-camelCase fas fa-clock";
                                    $("#requestToJoinButton").css("opacity", "0.6");
                                    $("#requestToJoinButton").css("pointer-events", "none");
                                });
                            });
                            else $("#requestToJoinButton").click(() => {
                                if (blacket.user.inventory.filter(item => item == "Fragment Grenade (Item)").length == 0) return blacket.createToast({
                                    title: "Error",
                                    message: `You do not have any Fragment Grenades.`,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                                <div class="styles__container___1BPm9-camelCase" style="width: 38vw;">
                                <div class="styles__text___KSL4--camelCase">
                                    Are you sure you want to attack this clan? This will cost you a Fragment Grenade.
                                </div>
                                <div class="styles__holder___3CEfN-camelCase">
                                    <div class="styles__buttonContainer___2EaVD-camelCase">
                                        <div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Yes</div>
                                        </div>
                                        <div id="noButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">No</div>
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size: 0.8vw;margin: 0;line-height: 1.5;margin-top: 0.521vw;margin-bottom: 0.521vw;opacity:0.5;" class="styles__text___KSL4--camelCase">
                                    Note that if a clan is shielded and you attack the clan, you will lose your Fragment Grenade but destroy the clan's shield.
                                </div>
                            </div>
                                    </div>`);
            
                                $("#noButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                });
            
                                $("#yesButton").click(() => {
                                    $(".arts__modal___VpEAD-camelCase").remove();
                                    blacket.startLoading();
                                    blacket.requests.post("/worker/use", {
                                        item: "Fragment Grenade (Item)",
                                        clan: clan.id
                                    }, (data) => {
                                        if (data.error) return blacket.createToast({
                                            title: "Error",
                                            message: data.reason,
                                            icon: "/content/blooks/Error.png",
                                            time: 5000
                                        }), blacket.stopLoading();
                                        if (data.message.toLowerCase().startsWith("unfortunately")) return $("body").append(`<div class="arts__modal___VpEAD-camelCase">
                                        <div class="styles__container___1BPm9-camelCase" style="width: 38vw;">
                                        <div class="styles__text___KSL4--camelCase">
                                            ${data.message}
                                        </div>
                                        <div class="styles__holder___3CEfN-camelCase">
                                            <div class="styles__buttonContainer___2EaVD-camelCase">
                                                <div id="okayButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                            </div>`), $("#okayButton").click(() => {
                                            $(".arts__modal___VpEAD-camelCase").remove();
                                        }), blacket.stopLoading(), blacket.user.inventory.splice(blacket.user.inventory.indexOf("Fragment Grenade (Item)"), 1);
                                        else location = `/clans/events`;
                                    });
                                });
                            });
            
                            $("#clanInfoClanOwnerAvatar").attr("src", clan.owner.avatar);
                            $("#clanInfoClanOwnerUsername").html(clan.owner.username);
                            if (clan.owner.color == "rainbow") $("#clanInfoClanOwnerUsername").addClass("rainbow");
                            else $("#clanInfoClanOwnerUsername").css("color", clan.owner.color);
            
                            $("#clanInfoClanOwnerContainer").click(() => {
                                location = `/stats?name=${clan.owner.username}`;
                            });
            
                            $("#clanInfoClanMembers").html("");
                            clan.members.forEach(member => {
                                $("#clanInfoClanMembers").append(`
                            <div id="${member.id}" style="width: 95%;margin-left: 2.083vw;" class="styles__clanDiscoveryClanInformationClanMemberContainer___c9290-camelCase">
                            <img loading="lazy" class="styles__clanDiscoveryClanInformationClanMemberAvatar___4jmCA-camelCase" src="${member.avatar}">
                            <div style="color: ${member.color};" class="styles__clanDiscoveryClanInformationClanMemberUsername___jn39A-camelCase${member.color == "rainbow" ? " rainbow" : ""}">${member.username}
                            </div>
                            <div class="styles__clanDiscoveryClanInformationClanMemberDescription___28jDx-camelCase">Clan ${clan.owner.id === member.id ? 'Owner' : 'Member'}</div>
                            </div>
                        `);
                                $(`#${member.id}`).click(() => {
                                    location = `/stats?name=${member.username}`;
                                });
                            });
                        });
                        history.pushState(null, null, `/clans/discover?name=${clan.name}`);
                    }
            
                    blacket.loadPage = (page) => {
                        $("#clansDiscoveryContainer").html("");
                        blacket.discoverClans("page", page);
                    }
            
                    $(".styles__searchInput___sVM-G-camelCase").keydown((key) => {
                        if (key.keyCode == 13) blacket.discoverClans("search", $(".styles__searchInput___sVM-G-camelCase").val());
                    });
            
                    $("i.styles__searchIcon___3mM7Z-camelCase:nth-child(2)").click(() => {
                        blacket.discoverClans("search", $(".styles__searchInput___sVM-G-camelCase").val());
                    });
            
                    $("i.styles__searchIcon___3mM7Z-camelCase:nth-child(3)").click(() => {
                        $(".styles__searchInput___sVM-G-camelCase").val("");
                        blacket.discoverClans("page", 1);
                    });
            
                    $("#backPageButton").click(() => {
                        blacket.loadPage(blacket.currentPage - 1);
                    });
            
                    $("#forwardPageButton").click(() => {
                        blacket.loadPage(blacket.currentPage + 1);
                    });
            
                    if (!blacket.user.clan) $("#pendingRequestsButton").click(() => {
                        $("#clanDiscoveryPage").hide();
                        $("#backToDiscoveryButton").show();
                        $("#clanInfoPage").hide();
                        $("#clanRequestsPage").show();
                        blacket.startLoading();
                        blacket.requests.get(`/worker/clans/requests/pending/me`, (data) => {
                            if (data.error) return blacket.stopLoading(), blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            $("#clanRequestsContainer").html("");
                            if (data.clans.length > 0) data.clans.forEach(clan => {
                                clan.level = 0;
                                clan.originalEXP = clan.exp;
                                let needed;
                                for (let i = 0; i <= 27915; i++) {
                                    needed = 5 * Math.pow(clan.level, blacket.config.exp.difficulty) * clan.level;
                                    if (clan.exp >= needed) {
                                        clan.exp -= needed;
                                        clan.level++;
                                    }
                                }
                                let id = Math.random().toString(36).substring(2, 10);
                                let ext = clan.image.split('.')[clan.image.split('.').length - 1];
                                let queryIndex = ext.indexOf('?');
                                if (queryIndex !== -1) ext = ext.slice(0, queryIndex), clan.image = clan.image.slice(0, clan.image.indexOf('?'));
                                let src = `/worker/proxy/${btoa(`${clan.image}`)}`;
                                $("#clanRequestsContainer").append(`
                                    <div id="${id}" class="styles__clansDiscoveryClanContainer___cbA4a-camelCase">
                                    <div class="styles__clansDiscoveryClanImageFiller___vbA3a-camelCase"><img
                                            class="styles__coverImage___3ahFy-camelCase" src="${src}"></div>
                                    <div style="color: ${clan.color};${clan.color == "rainbow" ? " font-size: 1.042vw;" : ""}" class="styles__clanDiscoveryClanName___gnV49-camelCase${clan.color == "rainbow" ? " rainbow" : ""}">
                                        ${clan.safe ? `<i class="fas fa-shield"></i>` : ""} ${clan.name}
                                    </div>
                                    <div class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">Level ${clan.level}</div>
                                    <div class="styles__clanDiscoveryClanDescription___lkb3a-camelCase">${blacket.htmlEncode(clan.description)}</div>
                                    <div class="styles__clanDiscoveryClanSpacer___49anv-camelCase"></div>
                                    <div class="styles__clanDiscoveryClanAuthorContainer___28amc-camelCase" style="color: ${clan.accepted ? "lime" : "yellow"};"><i
                                            class="styles__authorIcon___-Y2-E-camelCase fas ${clan.accepted ? "fa-check" : "fa-clock"}"></i>
                                        <div class="styles__clanDiscoveryClanAuthorText___38NVa-camelCase">${clan.accepted ? "Accepted" : "Pending"}</div>
                                </div>`);
                                $(`#${id}`).click(() => {
                                    if (clan.accepted) {
                                        $("body").append(`<div class=arts__modal___VpEAD-camelCase><div class=styles__container___1BPm9-camelCase style=width:52.083vw><div class=styles__text___KSL4--camelCase>Are you sure you want to join this clan? You will not be able to join any other clans unless you leave this clan.</div><div class=styles__holder___3CEfN-camelCase><div class=styles__buttonContainer___2EaVD-camelCase><div id="yesButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase"role=button tabindex=0><div class=styles__shadow___3GMdH-camelCase></div><div class=styles__edge___3eWfq-camelCase style=background-color:#2f2f2f></div><div class="styles__buttonInside___39vdp-camelCase styles__front___vcvuy-camelCase"style=background-color:#2f2f2f>Yes</div></div><div id="noButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase"role=button tabindex=0><div class=styles__shadow___3GMdH-camelCase></div><div class=styles__edge___3eWfq-camelCase style=background-color:#2f2f2f></div><div class="styles__buttonInside___39vdp-camelCase styles__front___vcvuy-camelCase"style=background-color:#2f2f2f>No</div></div></div></div></div></div>`);;
                                        $("#yesButton").click(() => {
                                            $(".arts__modal___VpEAD-camelCase").remove();
                                            blacket.startLoading();
                                            blacket.requests.post(`/worker/clans/join`, {
                                                clan: clan.id
                                            }, (data) => {
                                                blacket.stopLoading();
                                                if (data.error) return blacket.createToast({
                                                    title: "Error",
                                                    message: data.reason,
                                                    icon: "/content/blooks/Error.png",
                                                    time: 5000
                                                });
            
                                                $(`#${id}`).remove();
                                                blacket.stopLoading();
                                                $("body").append(`<div class="arts__modal___VpEAD-camelCase"> <div id="container" style="display: flex;height: 100vh;justify-content: center;align-items: center;flex-direction: column; display: none;"> <div style="font-size: 2.344vw;color: white;margin-bottom: 1.302vw;">Welcome to your new clan!</div><div class="styles__clansDiscoveryClanContainer___cbA4a-camelCase" style="pointer-events: none;"> <div class="styles__clansDiscoveryClanImageFiller___vbA3a-camelCase"><img loading="lazy" class="styles__coverImage___3ahFy-camelCase" src="${src}"></div><div class="styles__clansDiscoveryClanTotalMembersContainer___hjvmA-camelCase"> <div class="styles__clansDiscoveryClanTotalMembersText___fjmCa-camelCase">${clan.members.length == 1 ? "1 Member" : `${clan.members.length} Members`}</div></div><div style="color: ${clan.color};${clan.color == "rainbow" ? " font-size: 1.042vw;" : ""}" class="styles__clanDiscoveryClanName___gnV49-camelCase${clan.color == "rainbow" ? " rainbow" : ""}">
                                                    ${clan.safe ? `<i class="fas fa-shield"></i>` : ""} ${clan.name}
                                                </div><div class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">Level ${clan.level}</div><div class="styles__clanDiscoveryClanDescription___lkb3a-camelCase">${blacket.htmlEncode(clan.description)}</div><div class="styles__clanDiscoveryClanSpacer___49anv-camelCase"></div><div class="styles__clanDiscoveryClanAuthorContainer___28amc-camelCase"><i class="styles__authorIcon___-Y2-E-camelCase fas fa-user" aria-hidden="true"></i> <div class="styles__clanDiscoveryClanAuthorText___38NVa-camelCase">${clan.owner.username}</div><div class="styles__clanDiscoveryClanStatusesContainer___59mXC-camelCase"> <div> <div class="styles__clanDiscoveryClanStatusOnline___fjm2a-camelCase"></div> ${clan.online} Online</div><div> <div class="styles__clanDiscoveryClanStatusOffline___fjm2a-camelCase"></div> ${clan.offline} Offline</div></div></div></div></div></div>`);
            
                                                new Audio("/content/joinedClan.ogg").play();
            
                                                $("#container").fadeIn();
                                                $("#container").css("display", "flex");
            
                                                setTimeout(() => {
                                                    $("#container").fadeOut();
                                                    setTimeout(() => {
                                                        $(".arts__modal___VpEAD-camelCase").remove();
                                                        blacket.startLoading();
                                                        location = `/clans/my-clan`;
                                                    }, 1000);
                                                }, 5000);
                                            });
                                        });
                                        $("#noButton").click(() => $(".arts__modal___VpEAD-camelCase").remove());
                                    } else $("body").append(`<div class=arts__modal___VpEAD-camelCase><div class=styles__container___1BPm9-camelCase><div class=styles__text___KSL4--camelCase>This clan request is still pending to be accepted.</div><div class=styles__holder___3CEfN-camelCase><div class=styles__buttonContainer___2EaVD-camelCase><div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase"id=okayButton role=button tabindex=0><div class=styles__shadow___3GMdH-camelCase></div><div class=styles__edge___3eWfq-camelCase style=background-color:#2f2f2f></div><div class="styles__buttonInside___39vdp-camelCase styles__front___vcvuy-camelCase"style=background-color:#2f2f2f>Okay</div></div></div></div></div></div>`), $("#okayButton").click(() => $(".arts__modal___VpEAD-camelCase").remove());
                                });
                            });
                            else $("#clanRequestsContainer").html(`<div style="font-size: 1.302vw;color: white;width: 26.042vw;">You have no pending requests to join a clan.</div>`);
                            blacket.stopLoading();
                        });
                    });
                    else $("#pendingRequestsButton").hide();
            
                    if (!blacket.user.perms.includes("create_clans") && !blacket.user.perms.includes("*")) $("#createClanButton").click(() => {
                        $("body").append(`<div class="arts__modal___VpEAD-camelCase"><form class="styles__container___1BPm9-camelCase"><div class="styles__text___KSL4--camelCase"><div>You need ${blacket.config.name} Plus to create a clan.</div></div><div class="styles__holder___3CEfN-camelCase"><div class="styles__buttonContainer___2EaVD-camelCase"><div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0"><div class="styles__shadow___3GMdH-camelCase"></div><div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div><div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Okay</div></div></div></div><input type="submit" style="opacity: 0; display: none;"></form></div>`)
                        $("#closeButton").click(() => $(".arts__modal___VpEAD-camelCase").remove());
                    });
                    else if (!blacket.user.clan) $("#createClanButton").click(() => {
                        $("body").append(`
                        <div id="clanCreationModalPage1" class="arts__modal___VpEAD-camelCase">
                                <div class="styles__container___1BPm9-camelCase" style="width: 39.063vw;">
                                    <div class="styles__text___KSL4--camelCase">Customize your Clan<div style="font-size: 0.911vw;margin: 0;line-height: 1.5;margin-top: 0.521vw;opacity: 0.5;" class="styles__text___KSL4--camelCase">Give your clan a personality with a name, description, and cover image. You can always change this later.</div></div>
                                    <div class="styles__holder___3CEfN-camelCase">
                                        <div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                                            <div
                                                style="border: 0.156vw solid rgba(0, 0, 0, 0.17); border-radius: 0.313vw;width: 90%;height: 2.604vw;margin: 0.000vw;display: flex;flex-direction: row;align-items: center;">
                                                <input id="clanName"
                                                    style="border: none;height: 2.083vw;line-height: 2.083vw;font-size: 1.458vw;text-align: center;font-weight: 700;font-family: Nunito, sans-serif;color: #ffffff;background-color: #3f3f3f;outline: none;width: 100%;"
                                                    placeholder="Name" maxlength=24 value="">
                                            </div>
                                            <div id="uploadButton"
                                            class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                            tabindex="0" style="margin: 0.521vw; width: 91%;">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                                style="background-color: #2f2f2f;">Upload a Cover Image</div>
                                        </div>
                                            <img id="previewImage" src="" style="width: 25%; margin: 0.521vw;" onerror="this.style.display='none'" onload="this.style.display='block'">
                                            <div
                                                style="border: 0.156vw solid rgba(0, 0, 0, 0.17); border-radius: 0.313vw;width: 90%;height: 10.417vw;margin: 0.000vw;display: flex;flex-direction: row;align-items: center;">
                                                <textarea id="clanInputDescription"
                                                    style="border: none;height: 10.417vw;line-height: 2.083vw;font-size: 1.458vw;text-align: center;font-weight: 700;font-family: Nunito, sans-serif;color: #ffffff;background-color: #3f3f3f;outline: none;width: 100%; resize:none;"
                                                    placeholder="Description" maxlength=168></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="styles__buttonContainer___2EaVD-camelCase">
                                        <div id="nextButton"
                                            class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                            tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                                style="background-color: #2f2f2f;">Next</div>
                                        </div>
                                        <div id="cancelButton"
                                            class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button"
                                            tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase"
                                                style="background-color: #2f2f2f;">Cancel</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`);
                        $("#clanName").on("input", () => {
                            $("#clanName").val($("#clanName").val().replace(/[^a-zA-Z0-9"'!.:; ]/g, ""));
                        });
                        $("#uploadButton").click(() => {
                            let input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = _this => {
                                blacket.startLoading();
                                let files = Array.from(input.files);
                                if (!files[0].name.match(/\.(png|jpg|jpeg|gif|webp)$/i)) return blacket.stopLoading(), blacket.createToast({
                                    title: "Error",
                                    message: `File type is not supported.`,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                if (files[0].size > 8 * 1024 * 1024) return blacket.stopLoading(), blacket.createToast({
                                    title: "Error",
                                    message: `File size is too large. (Max 8 MB)`,
                                    icon: "/content/blooks/Error.png",
                                    time: 5000
                                });
                                let formData = new FormData();
                                formData.append("file", files[0]);
                                blacket.requests.upload("/worker/upload", formData, (data) => {
                                    blacket.stopLoading();
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    });
                                    $("#previewImage").attr("src", `${location.protocol}//${location.host}${data.path.replaceAll(" ", "%20")}`);
                                });
                            }
                            input.click();
                        });
                        $("#nextButton").click(() => {
                            if ($("#clanName").val().length < 1) return blacket.createToast({
                                title: "Error",
                                message: `Clan name is too short.`,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            if ($("#previewImage").attr("src").length < 1) return blacket.createToast({
                                title: "Error",
                                message: `Clan cover image is required.`,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            if ($("#clanInputDescription").val().length < 1) return blacket.createToast({
                                title: "Error",
                                message: `Clan description is too short.`,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            let name = $("#clanName").val();
                            let image = $("#previewImage").attr("src");
                            let description = $("#clanInputDescription").val();
                            $("#clanCreationModalPage1").hide();
                            $("body").append(`
                            <div id="clanCreationModalPage2" class="arts__modal___VpEAD-camelCase">
                                <div class="styles__container___1BPm9-camelCase" style="width: 39.063vw;">
                                    <div class="styles__text___KSL4--camelCase">Finalize your Clan<div style="font-size: 0.911vw;margin: 0;line-height: 1.5;margin-top: 0.521vw;opacity: 0.5;" class="styles__text___KSL4--camelCase">Is this what you want your clan to look like? You can always click the back button to add some changes.</div></div>
                                    <div class="styles__holder___3CEfN-camelCase" style="display: flex;justify-content: center;">
                                        <div style="pointer-events: none;" class="styles__clansDiscoveryClanContainer___cbA4a-camelCase">
                                    <div class="styles__clansDiscoveryClanImageFiller___vbA3a-camelCase"><img loading="lazy" class="styles__coverImage___3ahFy-camelCase" src="${image}"></div>
                                    <div class="styles__clansDiscoveryClanTotalMembersContainer___hjvmA-camelCase">
                                        <div class="styles__clansDiscoveryClanTotalMembersText___fjmCa-camelCase">1 Member</div>
                                    </div>
                                    <div style="color: #ffffff;" class="styles__clanDiscoveryClanName___gnV49-camelCase">${name}</div>
                                    <div class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">Level 1</div>
                                    <div class="styles__clanDiscoveryClanDescription___lkb3a-camelCase">${blacket.htmlEncode(description)}</div>
                                    <div class="styles__clanDiscoveryClanSpacer___49anv-camelCase"></div>
                                    <div class="styles__clanDiscoveryClanAuthorContainer___28amc-camelCase"><i class="styles__authorIcon___-Y2-E-camelCase fas fa-user" aria-hidden="true"></i>
                                        <div class="styles__clanDiscoveryClanAuthorText___38NVa-camelCase">${blacket.user.username}</div>
                                        <div class="styles__clanDiscoveryClanStatusesContainer___59mXC-camelCase">
                                                        <div>
                                                            <div class="styles__clanDiscoveryClanStatusOnline___fjm2a-camelCase"></div> 1 Online
                                                        </div>
                                                        <div>
                                                            <div class="styles__clanDiscoveryClanStatusOffline___fjm2a-camelCase"></div> 0 Offline
                                                        </div>
                                                    </div>
                                    </div>
                                </div>
                                    </div>
                                    <div class="styles__buttonContainer___2EaVD-camelCase">
                                        <div id="createButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Create</div>
                                        </div>
                                        <div id="backButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                            <div class="styles__shadow___3GMdH-camelCase"></div>
                                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Back</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`)
                            $("#backButton").click(() => {
                                $("#clanCreationModalPage2").remove();
                                $("#clanCreationModalPage1").show();
                            });
                            $("#createButton").click(() => {
                                blacket.startLoading();
                                $("#clanCreationModalPage2").remove();
                                blacket.requests.post("/worker/clans/create", {
                                    name: name,
                                    image: image,
                                    description: description
                                }, (data) => {
                                    blacket.stopLoading();
                                    if (data.error) return blacket.createToast({
                                        title: "Error",
                                        message: data.reason,
                                        icon: "/content/blooks/Error.png",
                                        time: 5000
                                    }), $("#clanCreationModalPage1").show();
            
                                    $("body").append(`<div class="arts__modal___VpEAD-camelCase"> <div id="container" style="display: flex;height: 100vh;justify-content: center;align-items: center;flex-direction: column; display: none;"> <div style="font-size: 2.344vw;color: white;margin-bottom: 1.302vw;">Welcome to your new clan!</div><div class="styles__clansDiscoveryClanContainer___cbA4a-camelCase" style="pointer-events: none;"> <div class="styles__clansDiscoveryClanImageFiller___vbA3a-camelCase"><img loading="lazy" class="styles__coverImage___3ahFy-camelCase" src="${image}"></div><div class="styles__clansDiscoveryClanTotalMembersContainer___hjvmA-camelCase"> <div class="styles__clansDiscoveryClanTotalMembersText___fjmCa-camelCase">1 Member</div></div><div class="styles__clanDiscoveryClanName___gnV49-camelCase">${name}</div><div class="styles__clanDiscoveryClanLevel___ncnA3-camelCase">Level 1</div><div class="styles__clanDiscoveryClanDescription___lkb3a-camelCase">${blacket.htmlEncode(description)}</div><div class="styles__clanDiscoveryClanSpacer___49anv-camelCase"></div><div class="styles__clanDiscoveryClanAuthorContainer___28amc-camelCase"><i class="styles__authorIcon___-Y2-E-camelCase fas fa-user" aria-hidden="true"></i> <div class="styles__clanDiscoveryClanAuthorText___38NVa-camelCase">${blacket.user.username}</div><div class="styles__clanDiscoveryClanStatusesContainer___59mXC-camelCase"> <div> <div class="styles__clanDiscoveryClanStatusOnline___fjm2a-camelCase"></div> 1 Online</div><div> <div class="styles__clanDiscoveryClanStatusOffline___fjm2a-camelCase"></div> 0 Offline</div></div></div></div></div></div>`);
            
                                    new Audio("/content/joinedClan.ogg").play();
            
                                    $("#container").fadeIn();
                                    $("#container").css("display", "flex");
            
                                    setTimeout(() => {
                                        $("#container").fadeOut();
                                        setTimeout(() => {
                                            $(".arts__modal___VpEAD-camelCase").remove();
                                            blacket.startLoading();
                                            location = `/clans/my-clan`;
                                        }, 1000);
                                    }, 5000);
                                });
                            });
                        });
                        $("#cancelButton").click(() => {
                            $('.arts__modal___VpEAD-camelCase').remove();
                        });
                    });
                    else $("#createClanButton").remove();
            
                    blacket.stopLoading();
            
                    if (blacket.getParameter("name")) {
                        blacket.discoverClans("search", blacket.getParameter("name"));
                        blacket.requests.get(`/worker/clans/discover/name/${blacket.getParameter("name")}`, (data) => {
                            if (data.error) return blacket.createToast({
                                title: "Error",
                                message: data.reason,
                                icon: "/content/blooks/Error.png",
                                time: 5000
                            });
                            data.clans[0].level = 0;
                            data.clans[0].originalEXP = data.clans[0].exp;
                            let needed;
                            for (let i = 0; i <= 27915; i++) {
                                needed = 5 * Math.pow(data.clans[0].level, blacket.config.exp.difficulty) * data.clans[0].level;
                                if (data.clans[0].exp >= needed) {
                                    data.clans[0].exp -= needed;
                                    data.clans[0].level++;
                                }
                            }
                            blacket.getClan(data.clans[0]);
                        });
                    } else blacket.discoverClans("page", 1);
            
                } else setTimeout(reset, 1);
            });            
        }
    }

    let delay = 0;
    $("#chatBox").on("keypress", function (e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            if (!$(this).val()) return;
            if (delay > Date.now()) return;
            if ($(this).val().replace(/\n/g, "").replace(/ /g, "") == "") return;
            let message = $("#chatBox").val();
            if (!blacket.user.perms.includes("use_chat_colors") && !blacket.user.perms.includes("*")) localStorage.removeItem("chatColor");
            let mentions = Array.from(message.matchAll(/\B@\w+/g)).map(x => x[0]);
            for (let mention of mentions) {
                mention = mention.substring(1);
                let user = Object.values(blacket.chat.cached.users).find(x => x.username.toLowerCase() == mention.toLowerCase());
                if (user) message = message.replaceAll(`@${mention}`, `<@${user.id}>`);
            }
            blacket.sendMessage(blacket.chat.room, localStorage.getItem("chatColor") !== null ? `<${localStorage.getItem("chatColor")}>${message}</${localStorage.getItem("chatColor")}>` : message);
            $("#chatBox").val("");
            $("#chatBox").css("height", "2.5vw");
        }
    });
}
})();