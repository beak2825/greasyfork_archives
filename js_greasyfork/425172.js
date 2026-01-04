// ==UserScript==
// @name         Pendoria - Safe For Work Theme
// @description  Gives Pendoria a Safe For Work theme
// @namespace    https://pendoria.net/
// @version      1.1.1
// @author       Kidel
// @contributor  Xortrox
// @contributor  Puls3
// @match        https://pendoria.net/*
// @match        https://www.pendoria.net/*
// @include      /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @run-at       document-start
// @icon         https://pendoria.net/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425172/Pendoria%20-%20Safe%20For%20Work%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/425172/Pendoria%20-%20Safe%20For%20Work%20Theme.meta.js
// ==/UserScript==

(function() {

    const moduleName = 'Pendoria Safe For Work';
    const version = '1.1.1';
  
    // This sets the url of the background image; can set your own
    const SFWBackgroundImageURL = 'https://i.imgur.com/n5cRcfO.jpg';

    async function waitForField(target, field) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (target[field] !== undefined) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    function appendCSS(css) {
        let head = document.head || document.getElementsByTagName('head')[0];
        let style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }

    async function changeStyles() {
        console.log(`[${moduleName} v${version}] Initialized.`);
        await waitForField(document, 'head');

        function loadSFWGeneralFixes() {
            let css = '' +
                'body:before{ background: rgba(0, 0, 0, 0.0); }' +
                '#chat-messages ul li{ font-size: 14px; }'
            ;
            appendCSS(css);
        }
      
        function loadSFWBackground() {
            let css = '' +
                /*'body{ color: #000000 !important; background-image: none !important; }'*/
                'body{ background: black url("' + SFWBackgroundImageURL + '") no-repeat fixed top !important; }'
            ;
            appendCSS(css);
        }
      
        function loadSFWBorders() {
            let css = '' +
                '#menu, #profile, #chat, #charity, #stats-hourly, #gameframe, #drop-statistics { border: 0 !important; border-image-source: none !important; }'
            ;
            appendCSS(css);
        }
        
        function loadSFWScraptownImages() {
            let css = '' +
                '.scraptown .buildings .building .icon img{ opacity: 0.3 !important; filter: grayscale(1) opacity(20%) brightness(1%) !important; background-color: white; }' +
                '.scraptown .buildings .building .icon img:hover{ opacity: 0.3 !important; filter: grayscale(1) opacity(20%) brightness(1%) !important; background-color: white; }' +
                '.scraptown .buildings .building.active{  box-shadow: 0 0 5px 2px white;  border-radius: 5px;  background-color: black; }' +
                '.scraptown .progress-bar-background{ background-color: gray; }' +
                
                // Will not work if Scraptown is open during script load
                '.scraptown .building-bar{ background-color: white; }'
            
            ;
            appendCSS(css);
        }

        function loadSFWProgressBars() {
            let css = '' +
                '#expwidth{ background-color: #FFFFFF !important; }' +
                '#exptext{ color: #000000 !important; }' +
                '#progressbar-wrapper{ background: #999999 !important; }' +
                '#progressbar-wrapper .progress-status{ color: #000000 !important; }' +
                '#progressbar-wrapper .progressbar{ background-color: #FFFFFF !important; }' +
                '#dungeon-progressbar-wrapper .progress-status{ color: #000000 !important; }' +
                '#dungeon-progressbar-wrapper .purple{ background-color: #FFFFFF !important; }' +
                '.profile-scraptown-building-bar{ background-color: #777777 !important; }' +
                '.profile-encampment-building-bar{ background-color: #777777 !important; }' +
                '#fight .red{ background-color: #777777 !important; }' +
                '#fight .yellow{ background-color: #777777 !important; }' +
                '#fight .green{ background-color: #777777 !important; }'
            ;
            appendCSS(css);
        }
      
        function loadSFWColors() {
            let css = '' +
                '#chat-messages font{ display: none !important; }' +
                '#ranking-table_wrapper font{ display: none !important; }' +
                '#quest_done{ color: #FFFFFF !important; }' +
                '#quest_prog{ color: #FFFFFF !important; }' +
                '#menu a{ color: #FFFFFF !important; }' +
                '#menu li.active a, #menu li:hover a { color: #999999 !important; text-decoration: none !important; }' +
                'button{ color: #FFFFFF !important; background-color: #000000 !important; }' +
                'button:hover{ color: #EEEEEE !important; background-color: #222222 !important; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px !important; }' +
                'button:disabled{ color: #717171 !important; background-color: #111111 !important; }' +
                '.timeshit{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '.timescrit{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '.hitstaken{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '.timesdodged{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '.actionexperience{ color: #FFFFFF !important; }' +
                '#gainedexp{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '#guild_exp{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '.actiongold{ color: #FFFFFF !important; }' +
                '#gainedgold{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '#gainedres{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '#gainedtype{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '#quint span{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '#guild_gold{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '#encampment_materials{ color: #FFFFFF !important; font-weight: bold !important; }' +
                '.achievements-text div{ color: #FFFFFF !important; }' +
                '.achievement-section td{ color: #FFFFFF !important; }' +
                '.display-item .item-row{ color: #FFFFFF !important; }' +
                '.display-item .item-row span{ color: #FFFFFF !important; }' +
                '.guild-name{ color: #FFFFFF !important; }' +
                '#fight .chat-username{ color: #FFFFFF !important; }' +
                '.monstername{ color: #FFFFFF !important; }' +
                '.activity-log-username{ color: #FFFFFF !important; }' +
                '.item-rarity-basic{ color: #FFFFFF !important; }' +
                '.item-rarity-normal{ color: #FFFFFF !important; }' +
                '.item-rarity-rare{ color: #FFFFFF !important; }' +
                '.item-rarity-epic{ color: #FFFFFF !important; }' +
                '.item-rarity-legendary{ color: #FFFFFF !important; }' +
                '.item-rarity-runic{ color: #FFFFFF !important; text-shadow: 0 0 0 #FFFFFF !important; }' +
                '.fa-hand-rock-o:before{ content: "\\f105" !important; }' +
                '.fa-user-circle:before{ content: "\\f105" !important; }' +
                '.fa-wrench:before{ content: "\\f105" !important; }' +
                '.fa-certificate:before{ content: "\\f105" !important; }' +
                '.fa-shopping-basket:before{ content: "\\f105" !important; }' +
                '.fa-shield-alt:before{ content: "\\f105" !important; }' +
                '.fa-cog:before{ content: "\\f105" !important; }' +
                '.fa-calendar:before{ content: "\\f105" !important; }' +
                '.fa-campground:before{ content: "\\f105" !important; }' +
                '.fa-gopuram:before{ content: "\\f105" !important; }' +
                '.fa-envelope:before{ content: "\\f105" !important; }' +
                '.fa-tasks:before{ content: "\\f105" !important; }' +
                '.fa-sign-out-alt:before{ content: "\\f105" !important; }' +
                '#materialsinfo{ color: #FFFFFF !important; }' +
                '#deploymentinfo{ color: #FFFFFF !important; }' +
                '#invasioninfo{ color: #FFFFFF !important; }' +
                '.scraptown .factory .machinery .machine.active{ box-shadow: 0 0 5px 2px rgba(87, 87, 87, 0.2) !important; background-color: rgba(87, 87, 87, 0.2) !important; }' +
                '.scraptown .factory .machinery .machine.info{ box-shadow: 0 0 5px 2px rgba(87, 87, 87, 0.2) !important; background-color: rgba(87, 87, 87, 0.2) !important; }' +
                '.scraptown .factory .machinery .machine .machine-content .machine-display{ opacity: 0.3 !important; filter: grayscale(1) !important; }'
            ;
            appendCSS(css);
        }

        loadSFWGeneralFixes();
        loadSFWBackground();
        loadSFWBorders();
        loadSFWProgressBars();
        loadSFWColors();
        loadSFWScraptownImages();

    }

    (function run() {
        changeStyles();
        console.log(`[${moduleName} v${version}] Loaded.`);
    })();

})();