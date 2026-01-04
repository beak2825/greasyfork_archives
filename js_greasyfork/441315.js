// ==UserScript==
// @name         IdlePixel UI Tweaks
// @namespace    com.anwinity.idlepixel
// @version      1.3.26
// @description  Adds some options to change details about the IdlePixel user interface.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/441315/IdlePixel%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/441315/IdlePixel%20UI%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LEVELS = function(){
        let result = [];
        result[1] = 0;
        for(let lv = 2; lv <= 100; lv++) {
            result[lv] = Math.ceil(Math.pow(lv, 3+(lv/200)));
        }
        return result;
    }();

    function xpToLevel(xp) {
        if(xp <= 0) {
            return 1;
        }
        if(xp >= LEVELS[100]) {
            return 100;
        }
        let lower = 1;
        let upper = 100;
        while(lower <= upper) {
            let mid = Math.floor((lower + upper) / 2);
            let midXP = LEVELS[mid];
            let midPlus1XP = LEVELS[mid+1];
            if(xp < midXP) {
                upper = mid;
                continue;
            }
            if(xp > midPlus1XP) {
                lower=mid+1;
                continue;
            }
            if(mid<100 && xp == LEVELS[mid+1]) {
                return mid+1;
            }
            return mid;
        }
    }


    // will be overwritten if data available in IdlePixelPlus.info
    const SMELT_TIMES = {
        copper: 3 ,
        iron: 6,
        silver: 15,
        gold: 50,
        promethium: 100,
        titanium: 500
    };

    const IMAGE_URL_BASE = $("itembox[data-item=copper] img").attr("src").replace(/\/[^/]+.png$/, "");
    const FONTS = [];
    const FONT_DEFAULT = "IdlePixel Default";
    const FONT_FAMILY_DEFAULT = "pixel, \"Courier New\", Courier, monospace";
    (async() => {
        const FONTS_CHECK = new Set([
            // Windows 10
            'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
            // macOS
            'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
            // other
            'Helvetica', 'Garamond',
        ].sort());
        await document.fonts.ready;
        for(const font of FONTS_CHECK.values()) {
            if (document.fonts.check(`12px "${font}"`)) {
                FONTS.push(font);
            }
        }
        FONTS.unshift("IdlePixel Default");
    })();

    const BG_COLORS = {
        "#chat-area .server_message": "",
        "body": 'rgb(200, 247, 248)',
        ".top-bar": $(".top-bar").css("background-color"),
        "#menu-bar": $("#menu-bar").css("background-color"),
        "#chat-area": $("#chat-area").css("background-color"),
        "#game-chat": $("#game-chat").css("background-color"),
        "#panels": $("#panels").css("background-color"),
    };

    const FONT_COLORS = {
        "#chat-area .server_message": "",
        "#chat-area": $("#chat-area").css("color"),
        "#chat-area .color-green": $("#chat-area .color-green").css("color"),
        "#chat-area .color-grey": $("#chat-area .color-grey").css("color"),
        "#chat-area .chat-username": $("#chat-area .chat-username").css("color"),
        "#panels": $("#panels").css("color"),
        "#panels .color-grey": $("#panels .color-grey").css("color"),
    };

    const CHAT_UPDATE_FILTER = [
        "#chat-area",
        "#chat-area .color-green",
        "#chat-area .color-grey",
        "#chat-area .chat-username",
        "#chat-area .server_message"
    ];

    const PANEL_UPDATE_FILTER = [
        "#panels"
    ];

    class UITweaksPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("ui-tweaks", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "General Stuff",
                        type: "label"
                    },
                    {
                        id: "font",
                        label: "Primary Font",
                        type: "select",
                        options: FONTS,
                        default: FONT_DEFAULT
                    },
                    {
                        id: "sideChat",
                        label: "Side Chat",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "chatLimit",
                        label: "Chat Message Limit (&leq; 0 means no limit)",
                        type: "int",
                        min: -1,
                        max: 5000,
                        default: 0
                    },
                    {
                        id: "imageTitles",
                        label: "Image Mouseover",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "heatInFishingTab",
                        label: "Heat In Fishing Tab",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "fightPointsStats",
                        label: "Fight Points in Left Menu",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "miningMachineArrows",
                        label: "Mining Machine Arrows",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "oilSummaryMining",
                        label: "Oil Summary, Mining Panel",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "oilSummaryCrafting",
                        label: "Oil Summary, Crafting Panel",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "lowerToast",
                        label: "Lower Toast (top-right popup)",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "condenseWoodcuttingPatches",
                        label: "Condensed Woodcutting Patches",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "condenseFarmingPatches",
                        label: "Condensed Farming Patches",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "condenseGatheringBoxes",
                        label: "Condensed Gathering Boxes",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "Notifications",
                        type: "label"
                    },
                    {
                        id: "oilFullNotification",
                        label: "Oil Full",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "smeltingNotificationTimer",
                        label: "Smelting Notification Timer",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "rocketETATimer",
                        label: "Rocket Notification ETA",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "hideRocketKM",
                        label: "Rocket Notification Hide KM",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "BG Color Overrides",
                        type: "label"
                    },
                    {
                        id: "color-enabled-body",
                        label: "Main Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-body",
                        label: "Main Background: Color",
                        type: "color",
                        default: BG_COLORS["body"]
                    },
                    {
                        id: "color-enabled-panels",
                        label: "Panel Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-panels",
                        label: "Panel Background: Color",
                        type: "color",
                        default: BG_COLORS["#panels"]
                    },
                    {
                        id: "color-enabled-top-bar",
                        label: "Top Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-top-bar",
                        label: "Top Background: Color",
                        type: "color",
                        default: BG_COLORS[".top-bar"]
                    },
                    {
                        id: "color-enabled-menu-bar",
                        label: "Menu Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-menu-bar",
                        label: "Menu Background: Color",
                        type: "color",
                        default: BG_COLORS["#menu-bar"]
                    },
                    {
                        id: "color-enabled-chat-area",
                        label: "Inner Chat BG: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-chat-area",
                        label: "Inner Chat BG: Color",
                        type: "color",
                        default: BG_COLORS["#chat-area"]
                    },
                    {
                        id: "color-enabled-game-chat",
                        label: "Outer Chat BG: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-game-chat",
                        label: "Outer Chat BG: Color",
                        type: "color",
                        default: BG_COLORS["#game-chat"]
                    },
                    {
                        id: "color-enabled-chat-area-server_message",
                        label: "Server Message Tag: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-chat-area-server_message",
                        label: "Server Message Tag: Color",
                        type: "color",
                        default: BG_COLORS["#chat-area .server_message"]
                    },
                    {
                        label: "Text Color Overrides",
                        type: "label"
                    },
                    {
                        id: "font-color-enabled-chat-area",
                        label: "Chat Text: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area",
                        label: "Chat Text: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area"]
                    },
                    {
                        id: "font-color-enabled-chat-area-color-green",
                        label: "Chat Timestamp: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-color-green",
                        label: "Chat Timestamp: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-green"]
                    },
                    {
                        id: "font-color-enabled-chat-area-chat-username",
                        label: "Chat Username: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-chat-username",
                        label: "Chat Username: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .chat-username"]
                    },
                    {
                        id: "font-color-enabled-chat-area-color-grey",
                        label: "Chat Level: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-color-grey",
                        label: "Chat Level: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-grey"]
                    },
                    {
                        id: "font-color-enabled-chat-area-server_message",
                        label: "Server Message Tag: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-server_message",
                        label: "Server Message Tag: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .server_message"]
                    },
                    {
                        id: "serverMessageTextOverrideEnabled",
                        label: "Server Message Text: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "serverMessageTextOverrideColor",
                        label: "Server Message Text: Color",
                        type: "color",
                        default: "blue"
                    },
                    {
                        id: "font-color-enabled-panels",
                        label: "Panels 1: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-panels",
                        label: "Panels 1: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area"]
                    },
                    {
                        id: "font-color-enabled-panels-color-grey",
                        label: "Panels 2: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-panels-color-grey",
                        label: "Panels 2: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-grey"]
                    }
                ]
            });
        }

        onConfigsChanged() {
            $("body").css("font-family", "");
            const font = this.getConfig("font");
            if(font && font!=FONT_DEFAULT) {
                const bodyStyle = $("body").attr("style");
                $("body").attr("style", `${bodyStyle}; font-family: ${font} !important`);
            }

            const sideChat = this.getConfig("sideChat");
            if(sideChat) {
                $("#content").addClass("side-chat");
            }
            else {
                $("#content").removeClass("side-chat");
            }

            if(this.getConfig("fightPointsStats")) {
                $("#menu-bar-fight-points").show();
                $("#menu-bar-combat-fight-points").show();
            }
            else {
                $("#menu-bar-fight-points").hide();
                $("#menu-bar-combat-fight-points").hide();
            }

            const condenseWoodcuttingPatches = this.getConfig("condenseWoodcuttingPatches");
            if(condenseWoodcuttingPatches) {
                $("#panel-woodcutting .farming-patches-area").addClass("condensed");
                $(`#panel-woodcutting .farming-patches-area img[id^="img-tree_shiny"]`).each(function() {
                    const el = $(this);
                    el.attr("width", "");
                    el.attr("height", "");
                });
            }
            else {
                $("#panel-woodcutting .farming-patches-area").removeClass("condensed");
                $(`#panel-woodcutting .farming-patches-area img[id^="img-tree_shiny"]`).each(function() {
                    const el = $(this);
                    el.attr("width", el.attr("original-width"));
                    el.attr("height", el.attr("original-height"));
                });
            }

            const condenseFarmingPatches = this.getConfig("condenseFarmingPatches");
            if(condenseFarmingPatches) {
                $("#panel-farming .farming-patches-area").addClass("condensed");
                $(`#panel-farming .farming-patches-area img[id^="img-farm_shiny"]`).each(function() {
                    const el = $(this);
                    el.attr("width", "");
                    el.attr("height", "");
                });
            }
            else {
                $("#panel-farming .farming-patches-area").removeClass("condensed");
                $(`#panel-farming .farming-patches-area img[id^="img-farm_shiny"]`).each(function() {
                    const el = $(this);
                    el.attr("width", el.attr("original-width"));
                    el.attr("height", el.attr("original-height"));
                });
            }

            const condenseGatheringBoxes = this.getConfig("condenseGatheringBoxes");
            if(condenseGatheringBoxes) {
                $("#panel-gathering .gathering-box").addClass("condensed");
            }
            else {
                $("#panel-gathering .gathering-box").removeClass("condensed");
            }

            if(this.getConfig("imageTitles")) {
                $("img").each(function() {
                    const el = $(this);
                    let src = el.attr("src");
                    if(src && src!="x") {
                        src = src.replace(/.*\//, "").replace(/\.\w+$/, "");
                        el.attr("title", src);
                    }
                });
            }
            else {
                $("img").each(function() {
                    const el = $(this);
                    el.attr("title", "");
                });
            }

            if(this.getConfig("miningMachineArrows")) {
                $("#panel-mining").addClass("add-arrow-controls");
            }
            else {
                $("#panel-mining").removeClass("add-arrow-controls");
            }

            const toast = $(".toast-container");
            if(this.getConfig("lowerToast")) {
                toast.removeClass("top-0");
                toast.css("top", "45px");
            }
            else {
                toast.css("top", "");
                toast.addClass("top-0");
            }

            const oilSummaryMining = this.getConfig("oilSummaryMining");
            if(oilSummaryMining) {
                $("#oil-summary-mining").show();
            }
            else {
                $("#oil-summary-mining").hide();
            }

            const oilSummaryCrafting = this.getConfig("oilSummaryCrafting");
            if(oilSummaryCrafting) {
                $("#oil-summary-crafting").show();
            }
            else {
                $("#oil-summary-crafting").hide();
            }

            const smeltingNotificationTimer = this.getConfig("smeltingNotificationTimer");
            if(smeltingNotificationTimer) {
                $("#notification-furnace-timer").show();
            }
            else {
                $("#notification-furnace-timer").hide();
            }

            const rocketETATimer = this.getConfig("rocketETATimer");
            if(rocketETATimer) {
                $("#notification-rocket-timer").show();
            }
            else {
                $("#notification-rocket-timer").hide();
            }

            const hideRocketKM = this.getConfig("hideRocketKM");
            if(hideRocketKM) {
                $("#notification-rocket-label").hide();
            }
            else {
                $("#notification-rocket-label").show();
            }

            const heatInFishingTab = this.getConfig("heatInFishingTab");
            if(heatInFishingTab) {
                $("#heat-fishing-tab").show();
                $("#heat-fishing-tab").attr("data-item", "heat");
            }
            else {
                $("#heat-fishing-tab").hide();
                $("#heat-fishing-tab").removeAttr("data-item");
            }

            this.onVariableSet("oil", window.var_oil, window.var_oil);

            this.updateColors();
        }

        updateColors(filter) {
            Object.keys(BG_COLORS).forEach(selector => {
                if(!filter || filter.includes(selector)) {
                    const key = selector.replace(/[#\.]/g, '').replace(/-?\s+-?/, "-");
                    const enabled = this.getConfig(`color-enabled-${key}`);
                    const color = enabled ? this.getConfig(`color-${key}`) : BG_COLORS[selector];
                    let selected = $(selector);
                    selected.css("background-color", "");
                    selected.css("background-color", color);
                }
            });

            Object.keys(FONT_COLORS).forEach(selector => {
                if(!filter || filter.includes(selector)) {
                    const key = selector.replace(/[#\.]/g, '').replace(/-?\s+-?/, "-");
                    const enabled = this.getConfig(`font-color-enabled-${key}`);
                    const color = enabled ? this.getConfig(`font-color-${key}`) : FONT_COLORS[selector];
                    let selected = $(selector);
                    selected.css("color", "");
                    selected.css("color", color);
                }
            });

            const serverMessageTextOverrideEnabled = this.getConfig("serverMessageTextOverrideEnabled");
            const serverMessageTextOverrideColor = serverMessageTextOverrideEnabled ? this.getConfig("serverMessageTextOverrideColor") : "blue";
            $("#chat-area .server_message").parent().css("color", serverMessageTextOverrideColor);

        }

        onLogin() {
            // fix chat
            const self = this;
            const chat = $("#game-chat > :first-child");
            const chatTop = $('<div id="chat-top"></div>"');
            const chatArea = $("#chat-area").detach();
            const chatBottom = $("#game-chat > :first-child > :last-child").detach();
            $("#game-chat > :first-child > *").detach().appendTo(chatTop);
            chat.empty();
            chat.append(chatTop);
            chat.append(chatArea);
            chat.append(chatBottom);

            this.onConfigsChanged();
            $("head").append(`
            <style id="styles-ui-tweaks">
            #chat-top {
              display: flex;
              flex-direction: row;
              justify-content: left;
            }
            #chat-top > button {
              margin-left: 2px;
              margin-right: 2px;
              white-space: nowrap;
            }
            #content.side-chat {
              display: grid;
              column-gap: 0;
              row-gap: 0;
              grid-template-columns: 2fr minmax(300px, 1fr);
              grid-template-rows: 1fr;
            }
            #content.side-chat #game-chat {
              max-height: calc(100vh - 32px);
            }
            #content.side-chat #game-chat > :first-child {
              display: grid;
              column-gap: 0;
              row-gap: 0;
              grid-template-columns: 1fr;
              grid-template-rows: auto 1fr auto;
              height: calc(100% - 16px);
            }
            #content.side-chat #chat-area {
              height: auto !important;
            }
    	    .farming-patches-area.condensed {
	    	  display: flex;
		      flex-direction: row;
    		  justify-items: flex-start;
    		  width: fit-content;
    	    }
    	    .farming-patches-area.condensed > span {
    		  width: 100px;
    		  max-height: 200px;
    		  border: 1px solid green;
    	    }
    	    .farming-patches-area.condensed img {
    		  width: 100px;
    	    }
	    	#panel-gathering .gathering-box.condensed {
		      height: 240px;
		      position: relative;
              margin: 4px auto;
              padding-left: 4px;
              padding-right: 4px;
		    }
		    #panel-gathering .gathering-box.condensed img.gathering-area-image {
		      position: absolute;
		      top: 10px;
		      left: 10px;
		      width: 68px;
		      height: 68px;
		    }
		    #panel-gathering .gathering-box.condensed br:nth-child(2),
		    #panel-gathering .gathering-box.condensed br:nth-child(3)
		    {
		      display: none;
		    }
            #panel-mining.add-arrow-controls itembox {
              position: relative;
            }
            #panel-mining:not(.add-arrow-controls) itembox .arrow-controls {
              display: none !important;
            }
            itembox .arrow-controls {
              position: absolute;
              top: 0px;
              right: 2px;
              height: 100%;
              padding: 2px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;
            }
            itembox .arrow {
              border: solid white;
              border-width: 0 4px 4px 0;
              display: inline-block;
              padding: 6px;
              cursor: pointer;
              opacity: 0.85;
            }
            itembox .arrow:hover {
              opacity: 1;
              border-color: yellow;
            }
            itembox .arrow.up {
              transform: rotate(-135deg);
              -webkit-transform: rotate(-135deg);
              margin-top: 3px;
            }
            itembox .arrow.down {
              transform: rotate(45deg);
              -webkit-transform: rotate(45deg);
              margin-bottom: 3px;
            }
            </style>
            `);

            $("#menu-bar-energy").after(`
            <span id="menu-bar-fight-points">
              <br />
              <img id="menu-bar-fight-points-img" class="img-20" src="${IMAGE_URL_BASE}/fight_points.png">
              <item-display data-format="number" data-key="fight_points">0</item-display>
              (<span class="fight-points-full-timmer"></span>)
            </span>
            `);

            $('#menu-bar-hero item-display[data-key="energy"]').parent().after(`
            <span id="menu-bar-fight-points">
              <br />
              <img id="menu-bar-fight-points-img" class="img-20" src="${IMAGE_URL_BASE}/fight_points.png">
              <item-display data-format="number" data-key="fight_points">0</item-display>
              (<span class="fight-points-full-timmer"></span>)
            </span>
            `);

            $(".color-grey.font-small item-display").each(function() {
                let el = $(this);
                let dataKey = el.attr("data-key");
                if(dataKey.endsWith("_xp")) {
                    el.after(`
                    <span class="ui-tweaks-xp-next">
                      &nbsp;&nbsp;Next Level:
                      <item-display data-format="number"data-key="ipp_${dataKey}_next"></item-display>
                    </span>
				    `);
                }
            });

            // machine arrows
            ["drill", "crusher", "giant_drill", "excavator"].forEach(machine => {
                $(`itembox[data-item=${machine}]`).append(`
                <div class="arrow-controls" onclick="event.stopPropagation();">
                  <div class="arrow up" onclick="event.stopPropagation(); IdlePixelPlus.sendMessage('MACHINERY=${machine}~increase');"></div>
                    <item-display data-format="number" data-key="${machine}_on">1</item-display>
                  <div class="arrow down" onclick="event.stopPropagation(); IdlePixelPlus.sendMessage('MACHINERY=${machine}~decrease');"></div>
                </div>
                `);
            });

            // custom notifications
            $("#notifications-area").append(`
            <div id="ui-tweaks-notification-oil-full" style="display:none;" class="notification hover" onclick="switch_panels('panel-mining')">
                <img src="${IMAGE_URL_BASE}/oil.png" class="w20">
                <span class="font-small color-yellow">Oil Full</span>
            </div>
            `);

            $("#panel-mining .progress-bar").first().after(`
            <div id="oil-summary-mining" style="margin-top: 0.5em">
            	<strong>Oil: </strong><item-display data-format="number" data-key="oil"></item-display> / <item-display data-format="number" data-key="max_oil"></item-display><br>
            	<strong>In: </strong>+<item-display data-format="number" data-key="oil_in"></item-display>&nbsp;&nbsp;&nbsp;
            	<strong>Out: </strong>-<item-display data-format="number" data-key="oil_out"></item-display>&nbsp;&nbsp;&nbsp;
            	<strong>Delta: </strong><item-display data-key="oil_delta" data-format="number"></item-display><br>
            </div>
            `);

            $("#panel-crafting .progress-bar").first().after(`
            <div id="oil-summary-crafting" style="margin-top: 0.5em">
            	<strong>Oil: </strong><item-display data-format="number" data-key="oil"></item-display> / <item-display data-format="number" data-key="max_oil"></item-display><br>
            	<strong>In: </strong>+<item-display data-format="number" data-key="oil_in"></item-display>&nbsp;&nbsp;&nbsp;
            	<strong>Out: </strong>-<item-display data-format="number" data-key="oil_out"></item-display>&nbsp;&nbsp;&nbsp;
            	<strong>Delta: </strong><item-display data-key="oil_delta" data-format="number"></item-display><br>
            </div>
            `);

            $("#notification-furnace-label").after(`<span id="notification-furnace-timer" class="font-small color-white"></span>`);

            $("#notification-rocket-label").after(`<span id="notification-rocket-timer" class="font-small color-white"></span>`);

            $(`itembox[data-item="fishing_net"]`).before(`
            <itembox id="heat-fishing-tab" data-item="heat" class="shadow hover" data-bs-toggle="tooltip">
                <div class="center mt-1"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/heat.png" width="50px" height="50px"></div>
                <div class="center mt-2"><item-display data-format="number" data-key="heat"></item-display></div>
            </itembox>
            `);

            // clear chat button
            $("#chat-auto-scroll-button").after(`<button id="chat-clear-button" onclick="IdlePixelPlus.plugins['ui-tweaks'].clearChat()" style="color: green">CLEAR</button>`);

            // override for service messages
            const original_yell_to_chat_box = Chat.yell_to_chat_box;
            Chat.yell_to_chat_box = function() {
                original_yell_to_chat_box.apply(Chat, arguments);
                self.updateColors();
            }

            this.onConfigsChanged();
        }

        clearChat() {
            $("#chat-area").empty();
        }

        limitChat() {
            const limit = this.getConfig("chatLimit");
            if(limit > 0) {
                const children = $("#chat-area").children();
                if(children.length > limit) {
                    const toDelete = children.length - limit;
                    for(let i = 0; i < toDelete; i++) {
                        try {
                            children[i].remove();
                        }
                        catch(err) {
                            console.error("Error cleaning up chat", err);
                        }
                    }
                    if(Chat._auto_scroll) {
                        $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
                    }
                }
            }
        }

        onPanelChanged(panelBefore, panelAfter) {
            if(panelBefore != panelAfter && panelAfter == "idlepixelplus") {
                const options = $("#idlepixelplus-config-ui-tweaks-font > option");
                if(options) {
                    options.each(function() {
                        const el = $(this);
                        let value = el.attr("value");
                        if(value == "IdlePixel Default") {
                            el.css("font-family", FONT_FAMILY_DEFAULT);
                        }
                        else {
                            el.css("font-family", value);
                        }
                    });
                }
            }
            if(["farming", "woodcutting", "combat"].includes(panelAfter) && this.getConfig("imageTitles")) {
                $(`#panel-${panelAfter} img`).each(function() {
                    const el = $(this);
                    let src = el.attr("src");
                    if(src && src!="x") {
                        src = src.replace(/.*\//, "").replace(/\.\w+$/, "");
                        el.attr("title", src);
                    }
                });
            }
        }

        onVariableSet(key, valueBefore, valueAfter) {
            if(key.endsWith("_xp")) {
                const varName = `var_ipp_${key}_next`;
                const xp = parseInt(valueAfter||'0');
                const level = xpToLevel(xp);
                const xpAtNext = LEVELS[level+1];
                const next = level>=100 ? 0 : xpAtNext-xp;
                window[varName] = `${next}`;
            }
            if(["oil", "max_oil"].includes(key)) {
                const oil = IdlePixelPlus.getVar("oil");
                const maxOil = IdlePixelPlus.getVar("max_oil");
                if(oil && oil==maxOil && this.getConfig("oilFullNotification")) {
                    $("#ui-tweaks-notification-oil-full").show();
                }
                else {
                    $("#ui-tweaks-notification-oil-full").hide();
                }
            }
            if(["oil_in", "oil_out"].includes(key)) {
                const oilIn = IdlePixelPlus.getVarOrDefault("oil_in", 0, "int");
                const oilOut = IdlePixelPlus.getVarOrDefault("oil_out", 0, "int");
                window.var_oil_delta = `${oilIn-oilOut}`;
            }
            if(["fight_points", "max_fight_points"].includes(key)) {
                // fight-points-full-timmer
                const max = IdlePixelPlus.getVarOrDefault("max_fight_points", 0, "int");
                const current = IdlePixelPlus.getVarOrDefault("fight_points", 0, "int");
                const remaining = max-current;
                if(remaining==0) {
                    $(".fight-points-full-timmer").text("full");
                }
                else {
                    $(".fight-points-full-timmer").text(format_time(remaining));
                }
            }
            if(["furnace_ore_type", "furnace_countdown", "furnace_ore_amount_at"].includes(key)) {
                const el = $("#notification-furnace-timer");
                const ore = IdlePixelPlus.getVarOrDefault("furnace_ore_type", "none");
                if(ore == "none") {
                    el.text("");
                    return;
                }
                const timerRemaining = IdlePixelPlus.getVarOrDefault("furnace_countdown", 0, "int");
                const timePerOre = SMELT_TIMES[ore] - 1;
                const startAmount = IdlePixelPlus.getVarOrDefault("furnace_ore_amount_set", 0, "int");
                const doneAmount = IdlePixelPlus.getVarOrDefault("furnace_ore_amount_at", 0, "int");
                const remaining = startAmount - doneAmount - 1;
                const totalTime = (remaining*timePerOre) + timerRemaining;
                el.text(" - " + format_time(totalTime));

                // console.log(`${key}: timerRemaining=${timerRemaining}, start=${startAmount}, done=${doneAmount}, left=${remaining}, total=${totalTime}`);
            }
            if(["rocket_km", "rocket_status"].includes(key)) {
                const status = IdlePixelPlus.getVarOrDefault("rocket_status", "none");
                const km = IdlePixelPlus.getVarOrDefault("rocket_km", "none", "int");
                const total = IdlePixelPlus.getVarOrDefault("rocket_distance_required", "none", "int");
                let label = "";
                if(status=="to_moon" || status=="from_moon") {
                    const remaining = status=="to_moon" ? total-km : km;
                    const eta = Math.round(remaining / 1.5);
                    label = format_time(eta);
                    if(this.getConfig("rocketETATimer") && !this.getConfig("hideRocketKM")) {
                        label = " - " + label;
                    }
                }
                $("#notification-rocket-timer").text(label);
            }
            if(key == "rocket_status") {
                if(valueAfter == "from_moon") {
                    $("img#notification-rocket-image").css("transform", "rotate(180deg)");
                }
                else {
                    $("img#notification-rocket-image").css("transform", "");
                }
            }
        }

        onCombatEnd() {
            this.updateColors(PANEL_UPDATE_FILTER);
        }

        onChat(data) {
            this.updateColors(CHAT_UPDATE_FILTER);
            this.limitChat();
        }

    }

    $("[width]").each(function() {
        const el = $(this);
        el.attr("original-width", el.attr("width"));
    });
    $("[height]").each(function() {
        const el = $(this);
        el.attr("original-height", el.attr("height"));
    });

    const plugin = new UITweaksPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();