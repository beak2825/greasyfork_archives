// ==UserScript==
// @name        rose-pine-moon discord.com Theme
// @namespace   https://rosepinetheme.com/
// @version     1.3
// @description Rosé Pine Moon Soho vibes for  Discord Web
// @author      https://github.com/purr
// @match       *://*.discord.com/*
// @icon        https://github.com/rose-pine/rose-pine-theme/raw/main/assets/icon.png
// @run-at      document-start
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455160/rose-pine-moon%20discordcom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/455160/rose-pine-moon%20discordcom%20Theme.meta.js
// ==/UserScript==


// if youre reading this, you probably want to look at the code
// i was too stupid and didnt add enough comments
// this was my first time writing a script and using all these css js stuff
// sorry for it being so unreadable, but the theme looks pretty decent tbh!!!!!!
// i tried to make the code look as readable as possible too


(function() {
    let css = `
  :root {
    --rose-pine-base: rgb(35, 33, 54) !important;
    --rose-pine-surface: rgb(42, 39, 63) !important;
    --rose-pine-overlay: rgb(57, 53, 82) !important;
    --rose-pine-muted: rgb(110, 106, 134) !important;
    --rose-pine-subtle: rgb(144, 140, 170) !important;
    --rose-pine-text: rgb(224, 222, 244) !important;
    --rose-pine-love: rgb(235, 111, 146) !important;
    --rose-pine-gold: rgb(246, 193, 119) !important;
    --rose-pine-rose: rgb(234, 154, 151) !important;
    --rose-pine-pine: rgb(62, 143, 176) !important;
    --rose-pine-foam: rgb(156, 207, 216) !important;
    --rose-pine-iris: rgb(196, 167, 231) !important;
    --rose-pine-highlight-low: rgb(42, 40, 62) !important;
    --rose-pine-highlight-med: rgb(68, 65, 90) !important;
    --rose-pine-highlight-high: rgb(86, 82, 110) !important;
    --color-white: rgba(255, 255, 255, 0.7) !important;
    --color-black: rgb(0, 0, 0) !important;
}

/* bot tag colors */

.botTagRegular-kpctgU {
    color: var(--color-white);
    background: var(--rose-pine-pine);
}

/* app */

.appMount-2yBXZl,
body {
    background-color: var(--rose-pine-base);
}

.app-2CXKsg {
    background-color: transparent;
}

.bg-1QIAus,
.container-2RRFHK {
    background-color: var(--rose-pine-base);
}

.anchor-1MIwyf {
    color: rgb(var(--rose-pine-pine));
}

.icon-2qL2MI {
    color: rgb(var(--rose-pine-pine));
}
.base-2jDfDU:after {
    background-color: var(--rose-pine-surface);
    box-shadow: 0 -1px 0 0 var(--rose-pine-highlight-low);
}

.appMount-3lHmkl {
    background-image: url("");
    background-color: var(--rose-pine-base);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.theme-dark {
    --background-primary: var(--rose-pine-overlay);
    --background-secondary: var(--rose-pine-surface);
    --background-secondary-alt: var(--rose-pine-overlay);
    --channeltextarea-background: var(--rose-pine-highlight-med);
    --deprecated-panel-background: var(--rose-pine-overlay);
    --background-tertiary: var(--rose-pine-base);
    --background-accent: var(--rose-pine-rose);
    --text-normal: var(--color-white);
    --text-spotify: var(--rose-pine-foam);
    --text-muted: var(--rose-pine-muted);
    --text-link: var(--rose-pine-pine);
    --background-floating: var(--rose-pine-surface);
    --header-primary: var(--rose-pine-text);
    --header-secondary: var(--rose-pine-foam);
    --header-spotify: var(--rose-pine-foam);
    --interactive-normal: var(--rose-pine-text);
    --interactive-hover: var(--rose-pine-iris);
    --interactive-active: var(--rose-pine-text);
    --ping: var(--rose-pine-love);
    --background-modifier-selected: var(--rose-pine-overlay);
    --scrollbar-thin-thumb: var(--rose-pine-base);
    --scrollbar-thin-track: transparent;
    --scrollbar-auto-thumb: var(--rose-pine-base);
    --scrollbar-auto-track: transparent;
}

.body-2wLx-E,
.bodyInnerWrapper-2bQs1k,
.footer-3naVBw,
.headerTop-3GPUSF {
    background-color: var(--background-tertiary);
}

.panels-3wFtMD {
    background-color: var(--background-secondary);
}

.content-2hZxGK,
.header-1zd7se,
.panels-j1Uci_,
.peopleColumn-1wMU14,
.peopleColumn-29fq28,
.peopleList-2VBrVI,
.root-g14mjS .small-23Atuv .fullscreenOnMobile-ixj0e3 {
    background-color: var(--background-secondary);
}

.lookBlank-3eh9lL,
.perksModalContentWrapper-3RHugb,
.scrollableContainer-2NUZem,
.textArea-12jD-V,
.theme-dark .footer-31IekZ,
.theme-light .footer-31IekZ,
.threadSidebar-1o3BTy {
    background-color: var(--background-tertiary);
}

.active-1SSsBb,
.bar-30k2ka,
.base-PmTxvP,
.baseShapeRound-1Mm1YW,
.disableButton-220a9y,
.mention-1f5kbO,
.numberBadge-2s8kKX,
.unreadMentionsBar-1Bu1dC {
    background-color: var(--ping);
}
.content-1gYQeQ:hover,
.layout-1qmrhw:hover {
    background-color: var(--background-modifier-selected);
}

.lookOutlined-3sRXeN.colorRed-1TFJan,
.lookOutlined-3sRXeN.colorRed-1TFJan {
    color: var(--ping);
}

.theme-dark .container-1D34oG {
    background-color: var(--rose-pine-secondary);
}

.theme-dark .inset-3sAvek {
    background-color: var(--rose-pine-overlay);
}
.theme-dark .outer-1AjyKL.active-1xchHY,
.theme-dark .outer-1AjyKL.interactive-3B9GmY:hover {
    background-color: var(--rose-pine-highlight-low);
}

.markup-eYLPri {
    color: var(--rose-pine-text);
}

.markup-eYLPri a {
    color: var(--rose-pine-iris);
    text-shadow: 0.05em 0 var(--rose-pine-highlight-high), 0 0.05em var(--rose-pine-highlight-high), -0.05em 0 var(--rose-pine-highlight-high), 0 -0.05em var(--rose-pine-highlight-high), -0.05em -0.05em var(--rose-pine-highlight-high), -0.05em 0.05em var(--rose-pine-highlight-high), 0.05em -0.05em var(--rose-pine-highlight-high), 0.05em 0.05em var(--rose-pine-highlight-high);
}

.markup-eYLPri code {
    background-color: var(--rose-pine-overlay);
    border: none;
    border-radius: 4px !important;
}

.wrapper-1ZcZW-.interactive {
    background-color: rgba(196, 167, 231, 0.3);
    color: rvar(--rose-pine-muted);
}
.wrapper-1ZcZW-.interactive:hover {
    background-color: rgba(196, 167, 231, 0.5) !important;
    color: var(--color-white);
}

.mentioned-Tre-dv {
    background-color: rgba(196, 167, 231, 0.3) !important;
}
.mentioned-Tre-dv:before {
    background-color: var(--rose-pine-iris);
}
.mentioned-Tre-dv:hover {
    background-color: rgba(196, 167, 231, 0.2) !important;
}

.anchor-1MIwyf {
    color: var(--rose-pine-iris);
}

.button-1kija8 {
    color: var(--rose-pine-iris);

}

.actionButton-3-B2x- {
    background-color: var(--rose-pine-surface);
    border: var(--rose-pine-muted);
}
.actionButton-3-B2x-:hover {
    border: 1px solid #fff;
    transform: scale(1.05);
}
.actionButton-3-B2x-:active:hover {
    transform: scale(1);
    opacity: 0.5 !important;
}
.homeIcon-r0w4ny {
    display: block;
    width: 50px;
    height: 50px;
}
.homeIcon-r0w4ny:hover {
    opacity: 0.9;
}
.svgnewicon {
    height: 50px;
    width: 50px;
}
.wrapper-3kah-n.selected-1Drb7Z .childWrapper-1j_1ub,
.wrapper-3kah-n:hover .childWrapper-1j_1ub {
    background-color: var(--rose-pine-base);
}

.cozy-VmLDNB .timestamp-p1Df1m {
    color: var(--rose-pine-foam);
}

.lookOutlined-3yKVGo.colorGreen-3y-Z79 {
    border-color: transparent;
    background-color: var(--rose-pine-pine);

}
.button-f2h6uQ.lookFilled-yCfaCM:not([disabled]):hover,
.button-f2h6uQ.lookInverted-2mDUMi:not([disabled]):hover,
.button-f2h6uQ.lookLink-15mFoz:not([disabled]):hover,
.button-f2h6uQ.lookOutlined-3yKVGo:not([disabled]):hover {
    background-color: var(--rose-pine-foam);
    color: var(--rose-pine-highlight-low);

}
.button-f2h6uQ.lookFilled-yCfaCM:not([disabled]):hover .contents-3ca1mk,
.button-f2h6uQ.lookInverted-2mDUMi:not([disabled]):hover .contents-3ca1mk,
.button-f2h6uQ.lookLink-15mFoz:not([disabled]):hover .contents-3ca1mk,
.button-f2h6uQ.lookOutlined-3yKVGo:not([disabled]):hover .contents-3ca1mk {
    background-color: none;
}

.button-f2h6uQ.lookFilled-yCfaCM.colorBrand-I6CyqQ,
.button-f2h6uQ.lookFilled-yCfaCM.colorGreen-29iAKY,
.button-f2h6uQ.lookFilled-yCfaCM.colorGrey-2iAG-B,
.button-f2h6uQ.lookFilled-yCfaCM.colorPrimary-2AuQVo,
.button-f2h6uQ.lookFilled-yCfaCM.colorTransparent-1ewNp9,
.button-f2h6uQ.lookFilled-yCfaCM.colorWhite-rEQuAQ,
.button-f2h6uQ.lookInverted-2mDUMi.colorBrand-I6CyqQ,
.button-f2h6uQ.lookInverted-2mDUMi.colorGreen-29iAKY,
.button-f2h6uQ.lookInverted-2mDUMi.colorGrey-2iAG-B,
.button-f2h6uQ.lookInverted-2mDUMi.colorPrimary-2AuQVo,
.button-f2h6uQ.lookInverted-2mDUMi.colorTransparent-1ewNp9,
.button-f2h6uQ.lookInverted-2mDUMi.colorWhite-rEQuAQ,
.button-f2h6uQ.lookOutlined-3yKVGo.colorBrand-I6CyqQ,
.button-f2h6uQ.lookOutlined-3yKVGo.colorGreen-29iAKY,
.button-f2h6uQ.lookOutlined-3yKVGo.colorGrey-2iAG-B,
.button-f2h6uQ.lookOutlined-3yKVGo.colorPrimary-2AuQVo,
.button-f2h6uQ.lookOutlined-3yKVGo.colorTransparent-1ewNp9,
.button-f2h6uQ.lookOutlined-3yKVGo.colorWhite-rEQuAQ {
    background-color: var(--rose-pine-pine);
    color: var(--color-white);

}
.button-f2h6uQ.lookFilled-yCfaCM.colorBrand-I6CyqQ,
.button-f2h6uQ.lookFilled-yCfaCM.colorGreen-29iAKY,
.button-f2h6uQ.lookInverted-2mDUMi.colorBrand-I6CyqQ,
.button-f2h6uQ.lookInverted-2mDUMi.colorGreen-29iAKY,
.button-f2h6uQ.lookOutlined-3yKVGo.colorBrand-I6CyqQ,
.button-f2h6uQ.lookOutlined-3yKVGo.colorGreen-29iAKY,
.lookFilled-yCfaCM.colorBrandNew-2-gGsS,
.selectorButton-1EQtQx:hover,
.selectorButtonSelected-1VZ6hz,
.tabBar-ra-EuL .addFriend-emTWY1.addFriend-emTWY1.addFriend-emTWY1,
.tabBar-ra-EuL .addFriend-emTWY1.addFriend-emTWY1.addFriend-emTWY1 {
    background-color: var(--rose-pine-pine);
    color: var(--color-white);
}
.button-f2h6uQ.lookFilled-yCfaCM.colorBrand-I6CyqQ:hover,
.button-f2h6uQ.lookFilled-yCfaCM.colorGreen-29iAKY:hover,
.button-f2h6uQ.lookInverted-2mDUMi.colorBrand-I6CyqQ:hover,
.button-f2h6uQ.lookInverted-2mDUMi.colorGreen-29iAKY:hover,
.button-f2h6uQ.lookOutlined-3yKVGo.colorBrand-I6CyqQ:hover,
.button-f2h6uQ.lookOutlined-3yKVGo.colorGreen-29iAKY:hover,
.tabBar-ra-EuL .addFriend-emTWY1.addFriend-emTWY1.addFriend-emTWY1:hover {
    background: var(--rose-pine-foam);
    color: var(--rose-pine-text);

}
.button-f2h6uQ.lookFilled-yCfaCM.colorBrand-I6CyqQ[disabled],
.button-f2h6uQ.lookFilled-yCfaCM.colorGreen-29iAKY[disabled],
.button-f2h6uQ.lookInverted-2mDUMi.colorBrand-I6CyqQ[disabled],
.button-f2h6uQ.lookInverted-2mDUMi.colorGreen-29iAKY[disabled],
.button-f2h6uQ.lookOutlined-3yKVGo.colorBrand-I6CyqQ[disabled],
.button-f2h6uQ.lookOutlined-3yKVGo.colorGreen-29iAKY[disabled] {
    background-color: var(--rose-pine-iris);

}
.button-f2h6uQ.lookFilled-yCfaCM.colorRed-rQXKgM,
.button-f2h6uQ.lookInverted-2mDUMi.colorRed-rQXKgM {
    background-color: var(--rose-pine-pine);
}
.button-f2h6uQ.lookFilled-yCfaCM.colorRed-rQXKgM:hover,
.button-f2h6uQ.lookInverted-2mDUMi.colorRed-rQXKgM:hover {
    background-color: var(--rose-pine-foam);
}

.button-f2h6uQ.lookLink-15mFoz {
    background-color: var(--rose-pine-pine);
}
.lookFilled-yCfaCM.colorGreen-3y-Z79 {
    background-color: var(--rose-pine-pine);
    color: var(--color-white);
}
.lookFilled-yCfaCM.colorGreen-3y-Z79:hover {
    color: var(--rose-pine-highlight-low);

}
.theme-dark .lookLink-15mFoz.colorPrimary-2AuQVo,
.theme-dark .lookLink-15mFoz.colorPrimary-2AuQVo:hover {
    background-color: transparent !important;
    color: var(--rose-pine-text);

}

.actionButton-3-B2x- {
    background-color: var(--rose-pine-pine);
}
.actionButton-3-B2x-:hover {
    transform: scale(1.05);
    background-color: var(--rose-pine-highlight-low);
    border-color: transparent !important;
}
.actionButton-3-B2x-:active:hover {
    transform: scale(1);
    opacity: 0.5 !important;
}

.container-q97qHp {
    color: var(--rose-pine-text);
}
.listRow-Y5zoF8:hover {
    color: var(--rose-pine-iris);
}

.userTagUsernameNoNickname-2e_xaO {
    color: var(--rose-pine-iris);

}
.username-u-ebrn {
    color: var(--rose-pine-subtle);
}

.textBadge-1fdDPJ {
    background-color: var(--rose-pine-pine) !important;
}
.button-f2h6uQ.lookOutlined-3yKVGo.colorRed-rQXKgM:hover {
    background-color: var(--rose-pine-love);
    border-color: transparent !important;
}

.button-f2h6uQ.lookOutlined-3yKVGo.colorRed-rQXKgM {
    background-color: var(--rose-pine-rose);
    border-color: transparent !important;
}
.card-2xlCYc:hover {
    background-color: var(--rose-pine-surface);

}

.pageActions-1crTQL,
.paymentRow-1HKOLu,
.paymentRowHeader-3WJnOv,
.theme-dark .codeRedemptionRedirect-2hYMSQ,
.theme-dark .summaryInfo-3hcuop,
.theme-dark .summaryInfo-3hcuop {
    background-color: var(--rose-pine-surface) !important;
}

.defaultValue-19SZ-q .markValue-2U_-UG {
    color: var(--rose-pine-foam);
}

.radioBar-3w9XY- {
    box-shadow: 0 -1px 0 0 var(--rose-pine-highlight-low);

}
.theme-dark .inviteRow-3vmB7i:hover {
    background-color: var(--rose-pine-overlay);
}

.scroller-3nFW5p,
.theme-dark .inviteRow-3vmB7i {
    background-color: var(--rose-pine-surface);
}

.button-f2h6uQ.lookLink-15mFoz,
.colorDanger-3n-KnP,
.colorDanger-3n-KnP .checkbox-hADx5o,
.colorDanger-3n-KnP .radioSelection-1UHp0b {
    color: var(--rose-pine-rose);
}
.button-f2h6uQ.lookLink-15mFoz:hover,
.colorDanger-3n-KnP.focused-3qFvc8 {
    background-color: var(--rose-pine-love) !important;
    color: var(--rose-pine-text) !important;
}

.colorBrand-3cPPsm {
    color: var(--rose-pine-pine);
}

.passthrough--fbdFR.selected-3jieYB {
    background-color: var(--rose-pine-surface);

}
.theme-dark .autocomplete-3NRXG8 {
    background-color: var(--rose-pine-base);
}

.clickable-2V8YKY[aria-disabled="false"] > .base-2v-uc0, .clickable-2V8YKY[aria-selected="true"] > .base-2v-uc0 {
    background-color: var(--rose-pine-surface);
}

.clickable-2V8YKY[aria-disabled="false"] > .base-2v-uc0:hover, .clickable-2V8YKY[aria-selected="true"] > .base-2v-uc0 {
    background-color: var(--rose-pine-overlay);
}
.emojiItem-277VFM.emojiItemSelected-2Lg50V {
    background-color: var(--rose-pine-overlay);
}
      `;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(
            styleNode
        );
    }
})();


console.log("starting in 5 seconds")
// code below adds rose pine logo
function xd() {
    var icons = document.getElementsByTagName('path');
    for (var n = icons.length; n-- > 0;) {
        //console.log("checking icons")
        var icon = icons[n];
        var parent = icon.parentNode
        var parentclass = parent.getAttributeNode("class")
        if (parentclass != null) {
            //console.log(parentclass.value)
            if (parentclass.value == "homeIcon-r0w4ny") {
                console.log("parent class matches")
                parent.removeChild(icon);
                parent.setAttribute("viewBox", "0 0 50 50");
                parent.setAttribute("width", "50");
                parent.setAttribute("height", "50");
                parent.innerHTML = `<g xmlns="http://www.w3.org/2000/svg" transform="matrix(0.10000001 0 0 0.10000001 0 0)">
  <path d="M249.983 307.358C 245.184 295.832 235.279 286.579 222.287 283.098L222.287 283.098L165.941 268C 158.794 294.673 174.623 322.09 201.296 329.237L201.296 329.237L241.543 340.021C 244.382 340.782 247.27 339.981 249.298 338.146C 251.3 340.672 254.679 341.909 257.99 341.021L257.99 341.021L298.237 330.237C 324.911 323.09 340.74 295.673 333.593 269L333.593 269L277.247 284.098C 264.632 287.478 254.928 296.298 249.983 307.358z" stroke="none" fill="#31748F" fill-rule="nonzero" fill-opacity="0.49803922"/>
  <path d="M250 333.001C 245.368 310.178 225.19 293 201 293L201 293L151 293C 151 320.614 173.386 343 201 343L201 343L249 343L251 343L299 343C 326.614 343 349 320.614 349 293L349 293L299 293C 274.81 293 254.632 310.178 250 333.001z" stroke="none" fill="#31748F" fill-rule="nonzero"/>
  <path d="M287 215.5C 287 225.85535 283.33887 234.69418 276.0165 242.01651C 268.6942 249.33884 259.85535 253 249.5 253C 239.14467 253 230.30583 249.33884 222.98349 242.01651C 215.66118 234.69418 212.00002 225.85535 212 215.5C 212.00002 205.14468 215.66118 196.30585 222.98349 188.98349C 230.30583 181.66116 239.14467 178 249.5 178C 259.85535 178 268.6942 181.66116 276.0165 188.98349C 283.33887 196.30585 287 205.14468 287 215.5C 287 215.9364 286.9924 216.37263 286.97717 216.80873" stroke="none" fill="#EFEFEF" fill-rule="nonzero"/>
  <path d="M246.918 156C 256.118 161.312 262.991 169.106 267.181 178.048C 279.154 168.575 295.298 164.686 311.178 168.941L311.178 168.941L298.237 217.237C 293.474 235.013 279.709 247.973 263.16 252.525L263.16 252.525L263.178 252.593C 258.805 253.765 254.411 254.319 250.09 254.309C 245.768 254.319 241.374 253.765 237 252.593L237 252.593L237.018 252.525C 220.47 247.973 206.704 235.013 201.941 217.237L201.941 217.237L189 168.941C 205.262 164.584 221.801 168.766 233.853 178.74C 234.217 178.036 234.599 177.336 235 176.642L235 176.642L246.918 156z" stroke="none" fill="#EBBCBA" fill-rule="nonzero"/>
</g>`
                console.log("succesfully replaced")
                return true
            }
        }
    }
};


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.homeIcon-r0w4ny').then((elm) => {
    xd()
});


const selectors = [
    ".message-2CShn3 img:not(.avatar-2e8lTP):not(.replyAvatar-sHd2sU)", // image embeds
    ".message-2CShn3 video", // video embeds
    ".message-2CShn3 .metadataDownload-3IY84h", // video download buttons
    ".message-2CShn3 .attachment-1PZZB2 a", // file download button and link
    ".message-24k8JL img:not(.avatar-2e8lTP):not(.replyAvatar-sHd2sU)", // images embeds in search
    ".message-24k8JL video", // video embeds in search
    ".originalLink-Azwuo9", // image links
    ".avatar-2e8lTP.clickable-31pE3P", //avatars
];
const selectorStr = selectors.join(", ");

var callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        for (const added of mutation.addedNodes) {
            if (added.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }
            if (added.matches(selectorStr)) {
                added.addEventListener(
                    "contextmenu",
                    function(event) {
                        event.stopImmediatePropagation();
                    },
                    true
                );
            }
            const elements = added.querySelectorAll(selectorStr);
            for (let i = 0; i < elements.length; i++) {
                let el = elements[i];
                el.addEventListener(
                    "contextmenu",
                    function(event) {
                        event.stopImmediatePropagation();
                    },
                    true
                );
            }
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// code above fixes the right click on images
// https://greasyfork.org/en/scripts/440110-discord-embed-right-click-enabler
