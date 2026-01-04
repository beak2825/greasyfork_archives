// ==UserScript==
// @name Pendorian Elite UI
// @namespace http://pendoria.net/
// @version 3.1
// @author Puls3
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @homepage https://xpuls3.github.io/Pendorian-Elite-UI
// @supportURL https://github.com/xPuls3/Pendorian-Elite-UI/issues
// @icon https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/master/favicon.ico
// @grant none
// @run-at document-start
// @description Changes a large portion of the text and UI to 'Elite' blue and makes small changes to the UI.
// @downloadURL https://update.greasyfork.org/scripts/374637/Pendorian%20Elite%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/374637/Pendorian%20Elite%20UI.meta.js
// ==/UserScript==

// Pendorian Elite UI is only officially distributed on GitHub!
// - https://github.com/xPuls3/Pendorian-Elite-UI/

// Pendorian Elite UI also has an official website!
// - https://xpuls3.github.io/Pendorian-Elite-UI/

// This script was created by Puls3!
// - Puls3 on Pendoria

const version = "3.1";
window.eliteUI = version;
let modules = register();
define();

// [Options]

// Toggle Script Debugging
const isDebug = false;

(function () {

    // Recolor Module
    // Changes the color of almost everything
    modules.recolor.options = {

        // Enable / Disable
        status: true,

        // Changes cyan titles to match the new chat username color
        titleSwap: true,

        // Colors
        color: "rgb(0, 153, 255)",
        darkColor: "rgb(0, 123, 235)",
        buttonColor: "rgba(0, 153, 255, 0.5)",
        buttonHoverColor: "rgba(0, 153, 255, 0.8)",
        progressBackgroundColor: "rgb(51, 71, 113)",
        profileLinkColor: "rgb(0, 123, 235)",
        mentionColor: "rgb(0, 219, 255)",
        mentionTabColor: "rgb(0, 153, 255)",
        chatUsernameColor: "rgb(0, 153, 255)"

    };

    // Background Module
    // Changes the background to the link below
    modules.background.options = {

        // Enable / Disable
        status: true,

        // Standard Image: 'Stellar Collision' by KuldarLeement
        // Original Link: https://www.deviantart.com/kuldarleement/art/Stellar-collision-397866757
        // Hosted Link: https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/dev/background.jpg

        // Background link
        link: "https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/dev/background.jpg"

    };

    // Favicon Module
    // Changes the favicon to the link below
    modules.favicon.options = {

        // Enable / Disable
        status: true,

        // Favicon link
        link: "https://raw.githubusercontent.com/xpuls3/Pendorian-Elite-UI/master/favicon.ico"

    };

    // Edits Module
    // Changes that used to be included with the recolor
    modules.edits.options = {

        // Enable / Disable
        status: true

    };

    // Frameless Mode Module
    // Removes all of the frames
    modules.frameless.options = {

        // Enable / Disable
        status: true

    };

    // Dungeon Sidebar Module
    // Removes the Dungeon tab and adds a link on the sidebar
    modules.dungeonSidebar.options = {

        // Enable / Disable
        status: true

    };

    // Dual View Module
    // Forces both the action and content pages to always show next to each other vertically
    // Requires Dungeon Sidebar to work correctly
    modules.dualView.options = {

        // Enable / Disable
        status: false,

        // How far down the frame (in pixels) the line between content and actions is
        line: 220

    };

    // Legacy Sidebar Module
    // Makes the sidebar look almost like the original sidebar designed by Zampa
    modules.legacySidebar.options = {

        // Enable / Disable
        status: true

    };

    // Rounded Borders Module
    // Makes most of the game's main area corners round.
    // Requires Frameless Mode to work correctly
    modules.roundedBorders.options = {

        // Enable / Disable
        status: false,

        // Changes how round the corners are with CSS values
        amount: "16px"

    };

    // Extended Header Module
    // Extends the header above chat in side-by-side mode
    modules.extendedHeader.options = {

        // Enable / Disable
        status: true

    };

    // Areas Included Module
    // Removes the Areas tab and adds the content to the battle tab
    modules.areasIncluded.options = {

        // Enable / Disable
        status: true

    };

    // Extra Footer Links Module
    // Adds more links to the bottom of the screen
    modules.extraFooterLinks.options = {

        // Enable / Disable
        status: true,

        // Add more links below
        // Use the existing ones as examples
        links: [
            [
                "Karubo's ROI",
                "http://pendcalc.karubo.de/"
            ],
            [
                "Puls3's Calcs",
                "https://xpuls3.github.io/calculators/"
            ],
            [
                "Impulsive Updates",
                "https://xpuls3.github.io/blog/"
            ]
        ]

    };

    // Remove Battle Stats Module
    // Removes the battle stats in the header
    modules.removeBattleStats.options = {

        // Enable / Disable
        status: false

    };

    // Remove Gold & Stat Module
    // Removes Gold Boost & Stat Drop Boost from Rhodium Boosts
    modules.removeGoldStat.options = {

        // Enable / Disable
        status: false

    };

    // Remove Logo Module
    // Removes the 'Pendoria Logo' and moves the left side upwards to reduce clutter
    modules.removeLogo.options = {

        // Enable / Disable
        status: true

    };

    // Pace Hider Module
    // Removes the loading bar at the top of the screen
    modules.paceHider.options = {

        // Enable / Disable
        status: false

    };

    // Remove Tabs Module
    // Removes the tabs on the actions page
    // Requires Dungeon Sidebar to work correctly
    // Requires Areas Included to work correctly
    modules.removeTabs.options = {

        // Enable / Disable
        status: false

    };

    // Remove Tradeskill Selection Module
    // Removes the Tradeskill Selection dropdown and the work button
    // Ensure that you are already doing the TS that you want to continue doing
    // Click the action bar to refresh after turning this on
    modules.removeTradeskillSelection.options = {

        // Enable / Disable
        status: false,

        // Adds a small amount of space above the action text
        // Without this it will look awkward
        addSpace: true

    };

    // Version Check Module
    // Checks for updates
    modules.versionCheck.options = {

        // Enable / Disable
        status: true,

        // Only check once every 24 hours
        dailyLimit: true

    };

})();

// [Functions]

(function () {

    window.addEventListener("load", origin);

    function origin () {

        logDo(`Initiating Pendorian Elite UI v${version}`, 0);

        const k = Object.keys(modules);

        let promiseList = [];
        let isGame = checkIsPath("/game");
        let isLogin = checkIsPath("/");

        for (let i = 0; i < k.length; i++) {

            modules[k[i]].id = String(k[i]);

            if (typeof (modules[k[i]].name) === "undefined") modules[k[i]].name = modules[k[i]].id;

            if (isGame || (isLogin && modules[k[i]].runLogin)) activateModule(modules[k[i]]);

        }

        Promise.all(promiseList).then(function () {

            if (isDebug) logDo("Script completely loaded", 0);

        });

        function activateModule(module) {
            if (typeof (module.options) !== "undefined") {
                if (module.options.status) {
                    if (typeof (module.code) !== "undefined") {
                        promiseList.push(new Promise(function (resolve) {
                            module.code(resolve);
                        }).then(function (result) {
                            moduleEnabled(module, result)
                        }));
                    } else {
                        logDo(`${module.name} Module does not contain code`, 1);
                    }
                }
            } else {
                logDo(`${module.name} Module does not contain options`, 1);
            }
        }

    }

    function moduleEnabled (module, result) {

        if (result) {
            module.style = result;
            applyStyle(module);
        }

        if (isDebug) {
            logDo(`${module.name} Module enabled`, 0);
        }

    }

    function applyStyle (module) {
        let matches = $(`.Elite-UI-Style[Elite-UI-Module="${module.id}"]`);
        if (matches.length !== 0) matches.remove();
        $("head").append(`<style class="Pendorian-Elite-UI Elite-UI-Style" Elite-UI-Module="${module.id}">${module.style}</style>`);
    }

    function checkIsPath (x) {
        return (window.location.pathname === x);
    }

})();

function register () {
    return {
        "recolor": {
            "name": "Recolor",
            "runLogin": true
        },
        "background": {
            "name": "Background",
            "runLogin": true
        },
        "favicon": {
            "name": "Favicon",
            "runLogin": true
        },
        "edits": {
            "name": "Edits"
        },
        "frameless": {
            "name": "Frameless Mode",
            "runLogin": true
        },
        "dungeonSidebar": {
            "name": "Dungeon Sidebar"
        },
        "dualView": {
            "name": "Dual View"
        },
        "legacySidebar": {
            "name": "Legacy Sidebar"
        },
        "roundedBorders": {
            "name": "Rounded Borders",
            "runLogin": true
        },
        "extendedHeader": {
            "name": "Extended Header"
        },
        "areasIncluded": {
            "name": "Areas Included"
        },
        "extraFooterLinks": {
            "name": "Extra Footer Links"
        },
        "removeBattleStats": {
            "name": "Remove Battle Stats"
        },
        "removeGoldStat": {
            "name": "Remove Gold & Stat"
        },
        "removeLogo": {
            "name": "Remove Logo"
        },
        "paceHider": {
            "name": "Pace Hider",
            "runLogin": true
        },
        "removeTabs": {
            "name": "Remove Tabs"
        },
        "removeTradeskillSelection": {
            "name": "Remove Tradeskill Selection"
        },
        "versionCheck": {
            "name": "Version Check",
            "runLogin": true
        }
    };
}

function define () {

    modules.recolor.code = function (resolve) {
        const t = `
            html {
                --Elite-Color: ${modules.recolor.options.color};
                --Elite-Dark-Color: ${modules.recolor.options.darkColor};
                --Elite-Mention-Color: ${modules.recolor.options.mentionColor};
                --Elite-Mention-Tab-Color: ${modules.recolor.options.mentionTabColor};
                --Elite-Button-Color: ${modules.recolor.options.buttonColor};
                --Elite-Button-Hover-Color: ${modules.recolor.options.buttonHoverColor};
                --Elite-Profile-Link-Color: ${modules.recolor.options.profileLinkColor};
                --Elite-Progress-Background-Color: ${modules.recolor.options.progressBackgroundColor};
                --Elite-Chat-Color: ${modules.recolor.options.chatUsernameColor};
            }

    		/* Chat Color CSS */

                .chat-username {
                    color: var(--Elite-Chat-Color) !important;
                }

    		    #chat-messages > ul > li > font[color="#00ffff"] {
    		        color: var(--Elite-Chat-Color) !important;
    		    }

                .chat-local-error, #chat-messages ul li span[style*="color: #ea907b;"] {
                    color: var(--Elite-Color) !important;
                }

                .username-hilighted {
                    color: var(--Elite-Mention-Color) !important;
                }

                .chat-hilighted {
                    color: var(--Elite-Mention-Tab-Color) !important;
                }

    		/* UI CSS Below */

                #invinfo, #scraptowninfo, #invasioninfo, .activity-log-username, .guild-section [style*="color: rgb(29, 166, 87);"], .guild-section [style*="color: #1da657;"], #event[style="color:red;"], #mailcount, #action-info, a[style="color: rgb(255, 0, 0);"] {
                    color: var(--Elite-Color) !important;
                }
                #header-stats, #quest_done, #quest_prog {
                    color: var(--Elite-Color);
                }
                .green, #expwidth, #building-progress, #profile-scraptown-building-progress, #profile-encampment-building-progress, #chat-composer input[type="submit"], .toast-success {
                    background-color: var(--Elite-Color) !important;
                }
                button {
                    background: var(--Elite-Button-Color) !important;
                }
                button:hover {
                    background: var(--Elite-Button-Hover-Color) !important;
                }
                .item-rarity-runic {
                    color: var(--Elite-Color) !important;
                    text-shadow: 0 0 1px blue !important;
                }
                .display-item [style*="color: rgb(29, 166, 87);"], .display-item [style*="color: green;"], #rerollCost, #rerollCost + span[style="color: #1da657;"] {
                    color: var(--Elite-Color) !important;
                }
                .display-item [style*="color: #98bda1; padding-top: 5px;"], #lockedStatsForm span[style="color: green;"], #lockedStatsForm div[style="color: #98bda1; padding-top: 5px;"]{
                    color: var(--Elite-Dark-Color) !important;
                }
                ::selection {
                    color: white;
                    background: var(--Elite-Color);
                }
                .guild-name {
                    font-weight: bold;
                    color: var(--Elite-Profile-Link-Color);
                }
                .chat-command {
                    color: var(--Elite-Color);
                }
                progress {
                    color: var(--Elite-Color);
                }
                progress::-webkit-progress-value {
                    background: var(--Elite-Color);
                }
                progress::-moz-progress-bar {
                    background: var(--Elite-Color);
                }
                progress::-webkit-progress-bar {
                    background: var(--Elite-Color);
                }
                #progressbar-wrapper {
                    background: var(--Elite-Progress-Background-Color);
                }
                #exp {
                    background: var(--Elite-Progress-Background-Color) !important;
                }
                .tab-game-content [style*="width: 100%; border-radius: 10px; overflow: hidden; background-color: #31453a;"] {
                    background: var(--Elite-Progress-Background-Color) !important;
                }
                .terms-section-header, .question {
                    color: var(--Elite-Color) !important;
                }

                #dungeon-progressbar-wrapper {
                    background-color: var(--Elite-Progress-Background-Color);
                }
                #dungeon-progressbar-wrapper .progressbar, #encampment-building-progress  {
                    background-color: var(--Elite-Color) !important;
                }

                [data-player-id*="334"] .chat-username {
                    color: rgb(0, 153, 255) !important;
                }

                #quint span, .actionexperience, .actionexperience span, #double_tradeskill span, #guild_amount, #guild_currency, #gainedtype, #gainedres, #actionencampmentax {
                    color: var(--Elite-Color) !important;
                }

                .timeshit, .timescrit, .timesdodged, .hitstaken, #gainedgold, .actiongold, #guild_gold, #double_battle span {
                    color: var(--Elite-Color) !important;
                }

                .pace .pace-progress {
                    background: var(--Elite-Color) !important;
                }`;
        resolve(t);
    };

    modules.background.code = function (resolve) {
        const t = `
    		body {
    			background: #171d1d url(${modules.background.options.link}) no-repeat scroll center center;
                background-attachment: fixed;
                -webkit-background-size: cover;
                -moz-background-size: cover;
                -o-background-size: cover;
                background-size: cover;
    		}`;
        resolve(t);
    };

    modules.favicon.code = function (resolve) {
        const t = `<link rel="icon" href="${modules.favicon.options.link}"/>`;
        $("head").append(t);
        resolve();
    };

    modules.edits.code = function (resolve) {
        const t = `
    		#dungeon-dialogue {
    			display: none;
    		}`;
        resolve(t);
    };

    modules.frameless.code = function (resolve) {
        const t = `
            #menu, #profile, #chat, #charity, #stats-hourly, #gameframe, #drop-statistics {
              border: none !important;
            }
    		#gameframe-status-wrapper:after, #progressbar-wrapper::after {
    			background: none;
    		}
    		#progressbar-wrapper {
    			bottom: 0px;
    		}
    		#progressbar-wrapper .progressbar {
    			top: 0px;
    		}
    		#gameframe-status-wrapper {
    			line-height: 15px;
    			top: 0px;
    			left: 0px;
    			right: 0px;
    		}`;
        resolve(t);
    };

    modules.dungeonSidebar.code = function (resolve) {
        const t = `
    		#gameframe-battle > ul > li:nth-child(4) {
    			display: none;
    		}
    		#dungeon-content, #dungeon-tools-content {
    			color: white;
    		}`;
        $("#scraptown-button").parent().after(`<li><a href="" id="elite-dungeon-button" class="Pendorian-Elite-UI"><i class="fas fa-dungeon"></i>Dungeons</a></li>`);

        // Function Below Grabbed From Pendoria And Modified
        // Heavily modified, as this code is less than awesome.
        $("#elite-dungeon-button").click(function (event) {
            event.preventDefault();
            ajaxPost("/action/dungeons", function (data) {
                $("#gameframe-content").html(data).show();
                $("#gameframe-battle").hide();
                $("#dungeon-tools-content [tooltip-title]").each(function () {
                    $(this).qtip({
                        content: {
                            title: $(this).attr("tooltip-title"),
                            text: $(this).attr("tooltip-text")
                        },
                        style: { classes: "qtip-dark" },
                        position: {
                            target: "mouse"
                        }
                    });
                });
                ajaxPost("/dungeons/in-progress", function (inProgress) {
                    $progressbarWrapper = $("#dungeon-progressbar-wrapper");
                    $startButton = $(".dungeon-button-start");
                    if (inProgress) {
                        $progressbarWrapper.attr("hidden", false);
                        $startButton.attr("hidden", true);
                        setDungeonDialogueText(dungeonTextInProgress);
                    } else {
                        $progressbarWrapper.attr("hidden", true);
                        $startButton.attr("hidden", false);
                        setDungeonDialogueText(dungeonTextDone);
                    }
                    $dungeonDialogue = $("#dungeon-dialogue");
                    $dungeonDialogue.attr("hidden", false);
                    $dungeonControls = $(".dungeon-controls");
                    $dungeonControls.attr("hidden", false);
                    updateDungeonActivatorCount();
                    updateProfileDungeonActivatorCount();
                });
                ajaxPost("/dungeons/boosts", function (dungeonBoosts) {
                    dungeonTools.updateBoostPrices(dungeonBoosts);
                });
            });
        });
        resolve(t);
    };

    modules.dualView.code = function (resolve) {
        const t = `
    		html {
    			--DualViewLine: ${modules.dualView.options.line}px;
    		}
    		#gameframe-battle {
    		  display: block !important;
    		  height: var(--DualViewLine);
    		}
    		#gameframe-content {
    		  display: block !important;
    		  height: calc(100% - var(--DualViewLine) - 80px);
    		  top: calc(70px + var(--DualViewLine));
    		}
    		#menu ul li:first-child {
    		  display: none !important;
    		}`;
        resolve(t);
    };

    modules.legacySidebar.code = function (resolve) {
        const t = `
    		#menu .frame {
    			display: none;
    			width: 0px;
    		}
    		#menu {
    			padding: 0px;
    			background: none !important;
    			height: auto !important;
    			overflow: hidden;
    		}
    		#menu li a {
    			font-family: "Open Sans", helvetica, arial;
    			color: #969696;
    			padding: 5px 0;
    			text-decoration: none;
    			font-size: 15px;
    			padding-left: 15px;
    		}
    		#menu li.active a, #menu li:hover a{
    			color: #FFFFFF;
    			text-decoration: none !important;
    		}`;
        resolve(t);
    };

    modules.roundedBorders.code = function (resolve) {
        const l = modules.roundedBorders.options.amount;
        const t = `
    		#profile, #menu, #stats-hourly, #ether-resources-sidebar,
                #gameframe-battle, #gameframe-content, #drop-statistics,
                #gameframe-status-wrapper, #chat, #chat-form {
    			border-radius: ${l} !important;
    		}
    		.nav-tabs > li > a {
    			border-radius: ${l} ${l} 0px 0px !important;
    		}`;
        resolve(t);
    };

    modules.extendedHeader.code = function (resolve) {
        let t = `
            #header-content {
                width: calc(100% - 260px) !important
            }`;
        resolve(t);
    };

    modules.areasIncluded.code = function (resolve) {
        const t = `
            #gameframe-battle > ul > li:nth-child(3) {
    			display: none;
    		}`;
        setTimeout(function () {
            let $battleNav = $("#gameframe-battle .nav-tabs li");
            $battleNav.off("click");

            // Function Below Grabbed From Pendoria And Modified
            $battleNav.on("click", "a", function (e) {
                let url;
                if (e.currentTarget.textContent === "Battle") {
                    url = "battle";
                } else if (e.currentTarget.textContent === "Tradeskill") {
                    url = "tradeskill";
                } else if (e.currentTarget.textContent === "Dungeons") {
                    // Open dungeons instead
                    url = "dungeons";
                } else if (e.currentTarget.textContent === "Area") {
                    // Open dungeons instead
                    url = "area";
                }
                ajaxPost("/action/" + url, function (data) {
                    $("#actioncontent").html(data);
                    if (url === "dungeons") {
                        ajaxPost("/action/dungeons", function (data) {
                            $("#gameframe-battle").html(data).show();
                            $("#dungeon-tools-content [tooltip-title]").each(function () {
                                $(this).qtip({
                                    content: {
                                        title: $(this).attr("tooltip-title"),
                                        text: $(this).attr("tooltip-text")
                                    },
                                    style: { classes: "qtip-dark" },
                                    position: {
                                        target: "mouse"
                                    }
                                });
                            });
                            ajaxPost("/dungeons/in-progress",
                                function (inProgress) {
                                    $progressbarWrapper = $("#dungeon-progressbar-wrapper");
                                    $startButton = $(".dungeon-button-start");
                                    if (inProgress) {
                                        $progressbarWrapper.attr("hidden", false);
                                        $startButton.attr("hidden", true);
                                        setDungeonDialogueText(dungeonTextInProgress);
                                    } else {
                                        $progressbarWrapper.attr("hidden", true);
                                        $startButton.attr("hidden", false);
                                        setDungeonDialogueText(dungeonTextDone);
                                    }
                                    $dungeonDialogue = $("#dungeon-dialogue");
                                    $dungeonDialogue.attr("hidden", false);
                                    $dungeonControls = $(".dungeon-controls");
                                    $dungeonControls.attr("hidden", false);
                                    updateDungeonActivatorCount();
                                    updateProfileDungeonActivatorCount();
                                });
                            ajaxPost("/dungeons/boosts",
                                function (dungeonBoosts) {
                                    dungeonTools.updateBoostPrices(dungeonBoosts);
                                });
                        });
                    }
                    if (url === "tradeskill") {
                        $("#stats-hourly-tab-battle").attr("hidden", true);
                        $("#stats-hourly-tab-tradeskill").attr("hidden", false);
                    }
                    if (url === "battle") {
                        $("#stats-hourly-tab-battle").attr("hidden", false);
                        $("#stats-hourly-tab-tradeskill").attr("hidden", true);
                        if (!$("#AreasIncluded").first.length) {
                            $("#nofight").after("<div id='AreasIncluded' class=\"Pendorian-Elite-UI\"></div>");
                            $("#gameframe-battle > ul > li:contains('Area')").hide();
                        }
                        $.ajax({
                            type: "POST",
                            url: "/action/area",
                            success: function (data) {
                                $("#AreasIncluded").html(data.replace(`<div style="text-align: center; margin-top: 10px; margin-bottom: 15px;">Exploring the lands? Watch out for strangers.</div>`, ""));
                            }
                        });
                    }
                });
            });
            if (!$("#AreasIncluded").first.length) {
                $("#nofight").after("<div id='AreasIncluded'></div>");
            }
            $.ajax({
                type: "POST",
                url: "/action/area",
                success: function (data) {
                    $("#AreasIncluded").html(data.replace(`<div style="text-align: center; margin-top: 10px; margin-bottom: 15px;">Exploring the lands? Watch out for strangers.</div>`, ""));
                }
            });
        }, 10000);
        resolve(t);
    };

    modules.extraFooterLinks.code = function (resolve) {
        const links = modules.extraFooterLinks.options.links;
        let e = $("#gameframe-menu #togglechat").parent();
        for (let i = 0; i < links.length; i++) {
            e.after(`<li class="Pendorian-Elite-UI Elite-UI-Extra-Footer-Link" style="vertical-align: top;"><a href="${links[i][1]}" target="_blank">${links[i][0]}</a></li>`);
        }
        resolve();
    };

    modules.removeBattleStats.code = function (resolve) {
        const t = `
            #rhodium-boosts-actions + div + div > table > tbody > tr:nth-of-type(3),
            #rhodium-boosts-actions + div + div > table > tbody > tr:nth-of-type(2),
    		#rhodium-boosts-actions + div + div > table > tbody > tr:nth-of-type(1),
            #rhodium-boosts-actions + div + div + div > table > tbody > tr:nth-of-type(3),
            #rhodium-boosts-actions + div + div + div > table > tbody > tr:nth-of-type(2),
    		#rhodium-boosts-actions + div + div + div > table > tbody > tr:nth-of-type(1) {
    			display: none;
    		}`;
        resolve(t);
    };

    modules.removeGoldStat.code = function (resolve) {
        let t = `
            #header-content {
                width: calc(100% - 260px) !important
            }`;
        resolve(t);
    };

    modules.removeLogo.code = function (resolve) {
        const t = `
    		#content > div.wrapper > aside > * {
    			top: -50px;
    		}
    		#logo {
    			display: none;
    		}
    		#content > .wrapper:first-child > header:first-child {
    			pointer-events: none;
    		}
    		#header-stats {
    			pointer-events: auto;
    		}`;
        resolve(t);
    };

    modules.paceHider.code = function (resolve) {
        const t = `.pace{ display: none !important }`;
        resolve(t);
    };

    modules.removeTabs.code = function (resolve) {
        const t = `
    		#gameframe-battle > ul {
    			display: none;
    		}`;
        resolve(t);
    };

    modules.removeTradeskillSelection.code = function (resolve) {
        let t = `
    		#actioncontent > div:nth-child(2) {
                display: none !important;
            }`;
        if (modules.removeTradeskillSelection.options.addSpace === true) {
            t = t + `
                #actioncontent {
                    margin-top: 15px;
                }`;
        }
        resolve(t);
    };

    modules.versionCheck.code = function (resolve) {
        let t = `
            .elite-version-window {
                z-index: 999999999;
                width: 100vw;
                height: 100vh;
                max-width: max-content;
                background: rgba(0, 0, 0, 0.70);
            }

            .elite-version-window h1 {
                text-align: center;
                padding-top: 10px;
            }

            .elite-version-window button {
                text-align: center;
                margin-right: 10px;
            }

            .elite-version-content {
                width: 30%;
                min-width: max-content;
                height: 135px;
                background: black;
                color: white;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                position: absolute;
                padding: 0px 50px 0px;
            }

            .elite-version-border {
                border: 10px solid transparent !important;
                border-image-source: url(/images/frame.png) !important;
                border-image-slice: 10 8 !important;
                border-image-repeat: round !important;
            }`;
        let hasls = (function () {
            let test = "test";
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        });
        if (hasls || !modules.versionCheck.options.dailyLimit) {
            let lastCheck = new Date(localStorage.getItem("Last Elite UI Version Check"));
            if ((new Date().getTime() - lastCheck.getTime()) > (60 * 60 * 24 * 1000) || !modules.versionCheck.options.dailyLimit) {
                localStorage.setItem("Last Elite UI Version Check", String(new Date()));
                new Promise(function (resolve) {
                    $.get("https://api.github.com/repos/xpuls3/Pendorian-Elite-UI/releases/latest", function (data) {
                        if (version.includes("-") && version.split("-")[0] === data.tag_name) {
                            resolve(data.tag_name);
                        } else if (version.split("-")[0] !== data.tag_name) {
                            resolve(data.tag_name);
                        } else {
                            resolve(false);
                        }
                    });
                }).then(function (newVer) {
                    if (newVer !== false) {
                        logDo(`Pendorian Elite UI v${newVer} has been released, you are currently running outdated version ${version}`, 1);

                        const eliteVersionWindowBackground = document.createElement("div");
                        eliteVersionWindowBackground.setAttribute("class", "elite-version-window");
                        eliteVersionWindowBackground.setAttribute("id", "elite-version-window");

                        const eliteVersionWindowContent = document.createElement("div");
                        eliteVersionWindowContent.setAttribute("class", "elite-version-content elite-version-border");
                        eliteVersionWindowContent.innerHTML = `<h1>Outdated Elite UI Version!</h1><p>Pendorian Elite UI v${newVer} has been released, you are currently running outdated version ${version}!</p>`;

                        const eliteVersionDownloadButton = document.createElement("button");
                        eliteVersionDownloadButton.innerText = "Download";
                        eliteVersionDownloadButton.setAttribute("onclick", "window.open('https://github.com/xPuls3/Pendorian-Elite-UI/raw/master/script.user.js', '_blank');");

                        const eliteVersionNotesButton = document.createElement("button");
                        eliteVersionNotesButton.innerText = "Release Notes";
                        eliteVersionNotesButton.setAttribute("onclick", "window.open('https://github.com/xPuls3/Pendorian-Elite-UI/releases/latest', '_blank');");

                        const eliteVersionCloseButton = document.createElement("button");
                        eliteVersionCloseButton.innerText = "Close";
                        eliteVersionCloseButton.setAttribute("onclick", `$("#elite-version-window").remove();`);

                        eliteVersionWindowContent.appendChild(eliteVersionDownloadButton);
                        eliteVersionWindowContent.appendChild(eliteVersionNotesButton);
                        eliteVersionWindowContent.appendChild(eliteVersionCloseButton);
                        eliteVersionWindowBackground.appendChild(eliteVersionWindowContent);
                        document.body.appendChild(eliteVersionWindowBackground);
                    }
                });
            }
        }
        resolve(t);
    };

}

function logDo (i, t) {
    const logType = {
        0: ["OKAY", "color: rgb(0,148,255);"],
        1: ["ERROR", "color:red;"]
    };
    let logArray = [`%c[%cElite UI%c] [%c${logType[t][0]}%c] ${i}`, "color: none;", "color: rgb(0,148,255);", "color: none;", logType[t][1], "color: none;"];
    console.log.apply(null, logArray);
}