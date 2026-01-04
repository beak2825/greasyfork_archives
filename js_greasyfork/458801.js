// ==UserScript==
// @name IdlePixelMobile
// @namespace com.evolsoulx.idlepixel.mobile
// @version 1.0.7
// @description A plugin to add mobile styling to idle-pixel.com
// @author evolsoulx
// @license MIT
// @grant GM_addStyle
// @match *://idle-pixel.com/login/play*
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/458801/IdlePixelMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/458801/IdlePixelMobile.meta.js
// ==/UserScript==
(function() {
        'use strict';
var viewport = document.querySelector("meta[name=viewport]");
    if(viewport){viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');}
    else{var metaTag=document.createElement('meta');
metaTag.name = "viewport"
metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
document.getElementsByTagName('head')[0].appendChild(metaTag);
}


   var mobileCSS = `
@media only screen and (max-width: 1000px) {

    body {}

    /*reworking panel grid layout to be vertical*/
    #panels {
        background-color: lightblue !important;
    }

    .top-bar {
        grid-column-start: 1 !important;
        grid-column-end: span 2 !important;
        grid-row-start: 1 !important;
        grid-row-end: span 1 !important;
    }

    #menu-bar {
        grid-column-start: 1 !important;
        grid-column-end: span 2 !important;
        grid-row-start: 2 !important;
        grid-row-end: span 1 !important;
    }

    #panels {
        grid-column-start: 1 !important;
        grid-column-end: span 2 !important;
        grid-row-start: 3 !important;
        grid-row-end: span 1 !important;
    }

    /*Menu rework*/
    .left-menu-item {
        margin-bottom: 3px;
        display: inline-block;
    }

    .hover.hover-menu-bar-item.left-menu-item {
        width: 90px;
        height: 90px;
        display: inline-block;
        border: 1px solid rgb(66, 66, 66);
        background-color: #54bcce;
        border-radius: 5pt;
        color: #F1F8F0;
        margin-bottom: 15px;
        text-align;
        center;
    }

    .hover.hover-menu-bar-item.left-menu-item img {
        width: 100%;
        height: 100%;
    }

    .color-light-red,
    .color-yellow,
    .color-silver {
        display: block;
        text-align: center;
        font-size: .9em;
    }

    div[data-tooltip*=menu-bar-oil] .color-silver,
    #menu-bar-oil-in,
    #menu-bar-oil-out {
        display: inline;
    }

    #menu-bar-buttons u {
        color: #F1F8F0;
        display: block;
        width: 100%;
        background-color: #0099A2;
        padding: 0px 10px;
        margin: 5px 0px;
        font-weight: bold;
        text-decoration: none;
        border: 1px none rgb(66, 66, 66);
        border-radius: 5pt;
    }

    .hover.hover-menu-bar-item.left-menu-item span:nth-of-type(1),
    #menu-bar-buttons hr,
    #menu-bar-buttons br {
        white-space: nowrap;
        overflow: hidden;
        display: none;
    }

    #menu-bar-buttons>hr:nth-child(26) {
        display: block;
    }

    .hover.hover-menu-bar-item.left-menu-item[onclick*=quests],
    .hover.hover-menu-bar-item.left-menu-item[onclick*=shop],
    .hover.hover-menu-bar-item.left-menu-item[onclick*=player-market],
    .hover.hover-menu-bar-item.left-menu-item[onclick*=donor-shop],
    .hover.hover-menu-bar-item.left-menu-item[onclick*=achievements] {
        white-space: nowrap;
        overflow: hidden;
    }


    /*rework notifications*/
    #notifications-area div[id*=notification] {
        width: 100%;
    }

    #ui-tweaks-notification-oil-full span {
        display: inline-block;
    }

    #panels {
        padding: 3px 0px;
    }

    .notifications-area {
        margin: 0px;
        padding: 0px;
    }

    /*quick fix for modals*/
    .modal
    {
    top:0px !important;
        overflow-x: hidden;
overflow-y: auto;
    }

}
`;
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(mobileCSS);
    console.log('gm_addstyle');
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(mobileCSS);
    console.log('PRO_addStyle');
} else if (typeof addStyle != "undefined") {
    addStyle(mobileCSS);
    console.log('addStyle');
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(mobileCSS));
    var heads = document.getElementsByTagName("head");

    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
    }
    console.log('oldschool');

}


        class MobilePlugin extends IdlePixelPlusPlugin {
            constructor() {
                super("mobile", {
                    about: {
                        name: GM_info.script.name,
                        version: GM_info.script.version,
                        author: GM_info.script.author,
                        description: GM_info.script.description,
                        grant: GM_info.script.grant
                    },
                    config: [{
                        type: "label",
                        label: "Is this a mobile script?"
                    },
                             {
                                 id: "MyCheckbox",
                                 label: "Yes / No",
                                 type: "boolean",
                                 default: true
                             }
                            ]
                });
            }

            onConfigsChanged() {
            }

            onLogin() {
                console.log("MobilePlugin.onLogin " + mobileCSS);
            }

            onMessageReceived(data) {
                // Will spam the console, uncomment if you want to see it
                //console.log("SamplePlugin.onMessageReceived: ", data);
            }

            onVariableSet(key, valueBefore, valueAfter) {
                // Will spam the console, uncomment if you want to see it
                //console.log("SamplePlugin.onVariableSet", key, valueBefore, valueAfter);
            }

            onChat(data) {
                // Could spam the console, uncomment if you want to see it
                //console.log("SamplePlugin.onChat", data);
            }

            onPanelChanged(panelBefore, panelAfter) {
                console.log("MobilePlugin.onPanelChanged", panelBefore, panelAfter);
            }

            onCombatStart() {
                console.log("MobilePlugin.onCombatStart");
            }

            onCombatEnd() {
                console.log("MobilePlugin.onCombatEnd");
            }

        }

        const plugin = new MobilePlugin();
        IdlePixelPlus.registerPlugin(plugin);

    })();

