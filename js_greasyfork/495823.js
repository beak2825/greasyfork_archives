// ==UserScript==
// @name Tiktok for discord users
// @namespace greasyfork.org/legosavant
// @version 1.0.0
// @description Removes all the bloat and most of the tiktok interface
// @author rlego
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.tiktok.com/*
// @downloadURL https://update.greasyfork.org/scripts/495823/Tiktok%20for%20discord%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/495823/Tiktok%20for%20discord%20users.meta.js
// ==/UserScript==

(function() {
let css = `
    /*you def dont need this*/
    [class*='DivSideNavContainer '],
    [class*='DivContentContainer'] > [class*='DivVideoList'],
    [class*='DivHeaderRightContainer'],
    [class*='DivHeaderLeftContainer'],
    [data-e2e="browse-follow"],
    [class*='DivCommentBarContainer'],
    [class*='DivVideoSwitchWrapper'],
    [class*='SpanReplyButton'],
    [data-e2e="browse-share-group"],
    [class*='DivVideoFeedTab'],
    [class*='DivShareFollowContainer'],
    [data-e2e="user-bio"] ~ [class*='DivButtonsContainer'],
    [class*='DivSearchBarContainer'],
    #browser-mode-report-btn,
    [class*='DivBottomCommentContainer'],
    [class*='DivPromotionContainer'],
    [class*='DivBlurBackgroundWrapper'] {
        display:none
    }
    /*possibly useful*/
    [class*='DivFlexCenterRow'],
    [class*='DivCopyLinkContainer'],
    [class*='DivActionBarWrapper'] {
        display:none
    }
    [class*='DivShareLayoutHeader-StyledDivShareLayoutHeaderV2'] {
        max-width:1000px!important;
        min-height:0!important;
        flex-direction:row!important;
        flex-wrap:wrap!important;
        gap:0 10px
    }
    [shape="circle"] {
        border-radius:0;
    }
    [data-e2e="user-bio"] {
        min-width:350px;
    }
    [class*='DivInfoContainer'] {
        position:fixed;
        top:6px;
        z-index:2233;
        right:24px;
        width:auto
    }
    div > [class*='DivPlayerContainer'] {
        position:static;
        display:flex;
    }
    [class*='DivLeftContainer'],
    [class*='StyledLink-StyledLink'] {
        margin:0
    }
    [class*='DivDescriptionContentWrapper'] {
        background:none;
        padding:32px 0 0 0;
    }
    [class*='DivDescriptionContentWrapper-StyledDetailContentWrapper'] {
        background:none;
        padding:0 8px
    }
    
    [class*='DivVideoContainer'] {
        width:80vw;
        height:calc(80vw * (9/16))
    }
    /*vid icons*/
    [class*='DivVideoControlsWrapper'] {
        margin:2px 0;
        height:auto;
        padding:0;
    }
    
    [class*='DivRightControlsWrapper'] > div, [class*='DivRightControlsWrapper'] > div > div, [class*='DivPlayIconContainer'] {
        min-width:30px;
        min-height:30px;
        line-height:30px;
        margin:0;
        padding:0 5px;
        box-sizing:content-box
    }
    [class*='DivPlayIconContainer'] > svg {
        margin-top:3px;
    }
    [class*='DivRightControlsWrapper'] > div:last-child { /*3 dots*/
        display:none
    }
    [class*='DivRightControlsWrapper'] > div:nth-last-child(4) { /*empty space*/
        display:none
    }
    [class*='DivVoiceControlContainer'] {
        position:static
    }
    [class*='DivVolumeControlContainer'] {
        position:absolute;
        top:-100px
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
