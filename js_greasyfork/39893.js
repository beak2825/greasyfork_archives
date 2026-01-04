// ==UserScript==
// @name         Discord Custom CSS
// @namespace    https://discord.gg/BwqMNRn
// @version      2.0
// @description  Allows you to set a custom background for Discord and other cool effects!
// @author       Lucario
// @include      https://discordapp.com/*
// @include      http://discordapp.com/*
// @exclude      https://discordapp.com/invite/*
// @exclude      http://discordapp.com/invite/*
// @exclude      https://discordapp.com/oauth2/*
// @exclude      http://discordapp.com/oauth2/*
// @exclude      https://discordapp.com/developers/*
// @exclude      http://discordapp.com/developers/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

var alpha = 0;
var popoutAlpha = 0.5;
var hoverAlpha = 0.2;
var backgroundImage = "https://cdn.discordapp.com/attachments/424742013410476035/427152919607902228/albert.png";
var stretchImage = false; //BUG (MAYBE) FIXED!!!

const divWhitelistIDs = [
    "user-profile-modal"
];

const divWhitelistClasses = [
    "inner-1_1f7b",
    "tab-bar-container",
    "tab-bar",
    "tab-bar-item",
    "avatar-wrapper",
    "avatar-profile",
    "status",
    "header-info",
    "header-info-inner",
    "discord-tag",
    "activity",
    "scroller-wrap fade",
    "guilds scroller",
    "additional-actions-icon",
    "section",
    "section-header",
    "note",
    "guild",
    "avatar-large",
    "guild-name",
    "guild-nick",
    "guild-inner",
    "avatar-large",
    "context-menu",
    "item",
    "badge",
    "new-messages-indicator-guild",
    "popout-menu",
    "popout-menu-item",
    "popout-menu-item-label",
    "popout-menu-icon",
    "wrapper-2xO9RX",
    "user-popout",
    "nickname",
    "username-wrapper",
    "label",
    "inner-1_1f7b",
    "upload-modal",
    "filename",
    "description",
    "footer",
    "comment",
    "uploadInput-3oaE4N",
    "emojiButtonNormal-2yO7yT emojiButton-3c_qrT emojiButton-38mF6t",
    "spriteNormal-3BYqCK sprite-3pvJkd",
    "innerEnabled-gLHeOL inner-3if5cm flex-3B1Tl4 innerNoAutocomplete-kaUXJZ",
    "channelTextAreaEnabled-c05Zpy channelTextArea-1HTP3C channel-text-area-upload margin-top-8",
    "emojiButtonHovered-2DiAsP emojiButton-3c_qrT emojiButton-38mF6t",
    "spriteHovered-2ymMOw sprite-3pvJkd",
    "emoji-picker",
    "header",
    "dimmer",
    "category",
    "sprite-item",
    "diversity-selector",
    "scrollerWrap-2uBjct",
    "row",
    "sticky-header",
    "emoji-item",
    "popout",
    "categories",
    "update-notice",
    "protip",
    "tip",
    "modal-3HOjGZ",
    "header-3sp3cE",
    "inner-tqJwAU",
    "selectable-prgIYK",
    "form-inner",
    "switchWrapper-3sSQdm",
    "switch-3lyafC",
    "track-1h2wOF",
    "flexChild-1KGW5q",
    "date-1aJe8-",
    "small-3-03j1 size12-1IGJl9 height16-1qXrGy primary-2giqSn",
    "bar-2cFRGz",
    "embed",
    "embed-color-pill",
    "actions",
    "action create",
    "action join",
    "action-header",
    "action-body",
    "action-icon",
    "unread-23Kvxk",
    "or",
    "form-actions",
    "control-group",
    "instructions",
    "region-select",
    "region-select-inner",
    "region-select-flag",
    "region-select-name",
    "help-text",
    "avatar-uploader",
    "avatar-uploader-inner",
    "avatar-uploader-acronym",
    "avatar-uploader-hint",
    "rtc-connection-popout",
    "sparkline",
    "popout-bottom",
    "avatar-hint",
    "avatar-popout",
    "quick-message-wrapper",
    "channel-name",
    "icon-friends",
    "connected-accounts",
    "connected-account",
    "connected-account-name",
    "connected-account-name-inner",
    "connected-account-open-icon",
    "friend",
    "title",
    "subtitle",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStart-pnSyE6 noWrap-v6g9vO",
    "flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2",
    "flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2 disabled-2c1Mfv",
    "description-3MVziF formText-1L-zZB description-3Ijq-M marginBottom20-2Ifj-2 modeDefault-389VjU primary-2giqSn",
    "ui-form-item",
    "title-1M-Ras",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO",
    "info-1Z508c",
    "contentsDefault-nt2Ym5 contents-4L4hQM contentsFilled-3M8HCx contents-4L4hQM",
    "instant-invite-modal",
    "expire-text",
    "checkbox",
    "checkbox-inner",
    "blurb",
    "form-header",
    "control-groups",
    "Select has-value",
    "Select-control",
    "Select-placeholder",
    "Select-input",
    "settings-right",
    "settings-inner",
    "radio",
    "radio-inner",
    "radio-container",
    "radio-button",
    "notification-settings-modal-channel-settings-header",
    "notification-settings-modal-channel-settings-list",
    "channel-notification-settings",
    "flex-horizontal flex-spacer content",
    "flex-horizontal flex-spacer content-inner",
    "flex-vertical flex-spacer",
    "scroller-wrap",
    "contentsDefault-nt2Ym5 contents-4L4hQM contentsLink-2ScJ_P contents-4L4hQM",
    "medium-2KnC-N size16-3IvaX_ height20-165WbF primary-2giqSn",
    "embed-author",
    "embed-content",
    "embed-content-inner",
    "embed-field",
    "embed-field-name",
    "embed-field-value",
    "embed-fields",
    "spacing-3XGYwJ marginBottom20-2Ifj-2 medium-2KnC-N size16-3IvaX_ height20-165WbF primary-2giqSn",
    "slider",
    "item-slider",
    "slider-handle",
    "slider-handle-track",
    "Select-value",
    "emoji-alias-input",
    "emoji-row-text",
    "emoji-uploader",
    "description-3MVziF",
    "connection-status",
    "connecting",
    "connecting-inner",
    "quote",
    "attribution",
    "connecting-problems",
    "connecting-problems-text",
    "connecting-problems-buttons",
    "wrapperHoveredText-1PA_Uk",
    "upload-modal-in",
    "upload-drop-modal",
    "upload-area",
    "bgScale",
    "autocomplete-1TnWNR",
    "typing",
    "file",
    "settings-actions",
    "toolbar-badge",
    "results-group",
    "history",
    "search-option",
    "option",
    "empty"
];

const recursiveWhitelistClasses = {
    "body": ["section roles", "section notes"],
    "scroller-fzNley": ["sticky-header"],
    "icons": ["wrap-one"]
};

const zeroAlphaClasses = [
    "member-inner",
    "member-username",
    "member-activity",
    "message",
    "message-text",
    "markup",
    "body",
    "titlebar",
    "titlebar-edge",
    "accessory",
    "content-1orzGj",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO td z-index-boost",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyEnd-1ceqOU alignCenter-3VxkQP noWrap-v6g9vO td z-index-boost",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO",
    "avatar-xsmall",
    "code-1RiHF2",
    "countdown-column",
    "username",
    "flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO name-and-tag",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO ui-role-list",
    "overflow-button",
    "default-3bB32Y formText-1L-zZB tag modeDefault-389VjU primary-2giqSn",
    "default-3bB32Y formText-1L-zZB name modeDefault-389VjU primary-2giqSn",
    "role-wrapper",
    "member",
    "nameDefault-Lnjrwm",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO margin-reset",
    "nameDefaultText-QoumjC",
    "scroller-fzNley scroller-NXV0-d",
    "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStart-pnSyE6 noWrap-v6g9vO wrapperDefault-1Dl4SS",
    "marginReset-1YolDJ",
    "content-2mSKOj",
    "wrapper-fDmxzK",
    "containerDefault-7RImuF",
    "nameUnreadText-1pxldj",
    "iconSpacing-5GIHkT",
    "nameSelectedText-32NDX5",
    "modal-image",
    "accountDetails-15i-_e",
    "button-1aU9q1",
    "nameDefaultVoice-1swZoh",
    "nameHoveredVoice-TIoHRJ",
    "wrapper-2ldvyE",
    "header-toolbar",
    "search",
    "attachment-image",
    "DraftEditor-root",
    "public-DraftEditorPlaceholder-root",
    "public-DraftEditorPlaceholder-inner",
    "DraftEditor-editorContainer",
    "public-DraftEditor-content",
    "public-DraftStyleDefault-block public-DraftStyleDefault-ltr",
    "nameHoveredText-2FFqiz",
    "search-bar-icon",
    "nameHovered-1YFSWq",
    "nameMutedText-1YDcP-",
    "nameDefault-Lnjrwm",
    "topic",
    "messages",
    "status-text",
    "status-icon-text",
    "helper",
    "message-group",
    "avatar-small",
    "friends-column",
    "friends-row",
    "friends-table",
    "friends-table-header",
    "channel-activity",
    "channel private",
    "scroller-fzNley",
    "filename",
    "speed",
    "progress",
    "attachment",
    "icon-file",
    "upload",
    "wrap-one",
    "wrap-two",
    "wrap-three",
    "icon one",
    "icon two",
    "icon three",
    "autocompleteInner-N7OQf1",
    "autocompleteRowVertical-3_UxVA",
    "xsmall-2rXiD4",
    "avatarStatus-3VdB8Y",
    "selector-nbyEfM",
    "descriptionUsername-1quCGz",
    "descriptionDiscriminator-3KCIMj",
    "marginLeft8-34JoM2",
    "contentTitle-sL6DrN",
    "nameDefault-1I0lx8",
    "userDefault-2_cnT0",
    "draggable-3SphXU",
    "avatarContainer-303pFz",
    "avatarDefault-3jtQoc",
    "iconSpacing-1WJZFe",
    "nameLockedVoice-wNOMNa",
    "content-249Pr9",
    "description-YnaVYa",
    "edit-message",
    "edit-container-outer",
    "edit-container-inner",
    "edit-operation",
    "spacing-CsDO_x",
    "btn-option",
    "btn-reaction",
    "search-learn-more",
    "search-clear-history",
    "header-tab-bar-wrapper",
    "mention-filter",
    "value",
    "channel-separator",
    "action-buttons",
    "jump-button",
    "text",
    "search-for",
    "keybind-shortcut-dim",
    "embed-inner",
    "empty-icon-guilds",
    "empty-text",
    "empty-icon-friends",
    "system-message-content",
    "system-message",
    "system-message-icon",
    "attachment-inner",
    "metadata"
];

function hasWhitelistedClass(div){
    var classes = div.className.split(" ");
    for (const w of divWhitelistClasses){
        if (div.className == w){
            return true;
        }
        for (const c of classes){
            if (c == w){
                return true;
            }
        }
    }
    return false;
}

function hasZeroAlphaClass(div){
    var classes = div.className.split(" ");
    for (const w of zeroAlphaClasses){
        if (div.className == w){
            return true;
        }
        for (const c of classes){
            if (c == w){
                return true;
            }
        }
    }
    return false;
}

function recursivelyWalk(nodes, cb) {
    for (const node of nodes){
        var ret = cb(node);
        if (ret) {
            return ret;
        }
        if (node.childNodes && node.childNodes.length) {
            var ret = recursivelyWalk(node.childNodes, cb);
            if (ret) {
                return ret;
            }
        }
    }
}

function checkAllRecursiveWalks(d){
    var returnData = false;
    Object.keys(recursiveWhitelistClasses).forEach((k) => {
        d.className.split(" ").forEach((n) => {
            if (k == n) {
                recursiveWhitelistClasses[k].some((cc) => {
                    if (recursivelyWalk(d.childNodes, (node) => node.className == cc)){
                        returnData = true;
                        return true;
                    }
                });
            }
        });
        if (returnData === true) return;
    });
    return returnData;
}

var observer = new MutationObserver((mutations) => {
    mutations = mutations.map(m => m.target).filter(m => m.tagName && m.tagName.toUpperCase() == "DIV");
    //console.log(mutations);
    if (mutations.length < 1) return;
    [].forEach.call(document.getElementsByTagName("div"), d => {
        if (d.style.backgroundColor == `rgba(0,0,0,${alpha})` || d.style.backgroundColor == `rgba(0,0,0,${popoutAlpha})`) return;
        if (d.className == "connecting"){
            Object.assign(d.style,{backgroundColor: `#888`, backgroundImage: `url("${backgroundImage}")`, backgroundRepeat: `no-repeat`, webkitBackgroundSize: `${stretchImage ? "100vw 100vh" : "cover"}`, mozBackroundSize: `${stretchImage ? "100vw 100vh" : "cover"}`, oBackgroundSize: `${stretchImage ? "100vw 100vh" : "cover"}`, backgroundSize: `${stretchImage ? "100vw 100vh" : "cover"}`});
            return;
        }
        if (d.className == "search" && d.parent){
            if (d.parent.className == "theme-dark" || d.parent.className == "theme-light"){
                d.parent.style.backgroundColor = "rgb(0,0,0,0)";
            }
        }
        if (d.className == "channel private"){
            d.style.opacity = 0.7;
        }
        if (!d.className && !d.id) return;
        if (checkAllRecursiveWalks(d)){
            return;
        }
        if (d.className == "messages-popout scroller"){
            d.style.backgroundColor = `rgba(0,0,0,${popoutAlpha})`;
            return;
        }
        if (hasZeroAlphaClass(d)){
            d.style.backgroundColor = "rgba(0,0,0,0)";
        }else if ((divWhitelistIDs.indexOf(d.id) < 0) && !hasWhitelistedClass(d)){
            d.style.backgroundColor = `rgba(0,0,0,${alpha})`;
        }
    });
    [].forEach.call(document.getElementsByTagName("a"), a => {
        if (!a.href) return;
        if (a.href.endsWith("/channels/@me") && a.draggable !== false && a.style.backgroundColor !== `rgba(0,0,0,${alpha})`){
            a.style.backgroundColor = `rgba(0,0,0,${alpha})`;
        }
    });
});
observer.observe(document.getElementsByTagName("body")[0], {attributes: true, childList: true, characterData: true, subtree: true});

var css = `
.message-group-blocked {display:none;}
body {background-color:#888;background-image: url("${backgroundImage}");background-repeat: no-repeat;-webkit-background-size: ${stretchImage ? "100vw 100vh" : "cover"};-moz-background-size: ${stretchImage ? "100vw 100vh" : "cover"};-o-background-size: ${stretchImage ? "100vw 100vh" : "cover"};background-size: ${stretchImage ? "100vw 100vh" : "cover"};}
.theme-dark .selectorSelected-2M0IGv {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(16,16,16,${hoverAlpha})),to(rgba(20,20,20,${hoverAlpha})));background:linear-gradient(90deg,rgba(16,16,16,${hoverAlpha}) 85%,rgba(20,20,20,${hoverAlpha}));}
.theme-light .selectorSelected-2M0IGv {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(162,162,162,${hoverAlpha})),to(rgba(166,166,166,${hoverAlpha})));background:linear-gradient(90deg,rgba(162,162,162,${hoverAlpha}) 85%,rgba(166,166,166,${hoverAlpha}));}
.theme-dark .autocomplete-1TnWNR {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(16,16,16,${popoutAlpha})),to(rgba(20,20,20,${popoutAlpha})));background:linear-gradient(90deg,rgba(16,16,16,${popoutAlpha}) 85%,rgba(20,20,20,${popoutAlpha}));}
.theme-light .autocomplete-1TnWNR {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(162,162,162,${popoutAlpha})),to(rgba(166,166,166,${popoutAlpha})));background:linear-gradient(90deg,rgba(162,162,162,${popoutAlpha}) 85%,rgba(166,166,166,${popoutAlpha}));}
.theme-dark .channel-members .member.popout-open, .theme-dark .channel-members .member:hover {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(16,16,16,${hoverAlpha})),to(rgba(20,20,20,${hoverAlpha})));background:linear-gradient(90deg,rgba(16,16,16,${hoverAlpha}) 85%,rgba(20,20,20,${hoverAlpha}));}
.theme-light .channel-members .member.popout-open, .theme-light .channel-members .member:hover {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(162,162,162,${hoverAlpha})),to(rgba(166,166,166,${hoverAlpha})));background:linear-gradient(90deg,rgba(162,162,162,${hoverAlpha}) 85%,rgba(166,166,166,${hoverAlpha}));}
.theme-dark .channel-members .member:hover .member-username{color:#fff;}
.theme-light .channel-members .member:hover .member-username{color:#222;}
.theme-dark .channel-members .member.popout-open .status,.theme-dark .channel-members .member:hover .status{border-color:rgba(16,16,16,${hoverAlpha});}
.theme-light .channel-members .member.popout-open .status,.theme-light .channel-members .member:hover .status{border-color:rgba(162,162,162,${hoverAlpha});}
.theme-dark .channel-members-loading, .theme-light .channel-members-loading{background-color:rgba(0,0,0,0);}
.theme-dark .channel-members-loading .background, .theme-light .channel-members-loading .background{background-image:none;background-color:rgba(0,0,0,0);}
.theme-dark .channel-members-loading .heading, .theme-light .channel-members-loading .heading{background-image:none;background-color:rgba(0,0,0,0);}
.theme-dark .channel-members-loading .member, .theme-light .channel-members-loading .member{background-image:none;background-color:rgba(0,0,0,0);}
.theme-dark .channel-members-loading .member:nth-child(2n-4),.theme-dark .channel-members-loading .member:nth-child(7n-1), .theme-light .channel-members-loading .member:nth-child(2n-4),.theme-light .channel-members-loading .member:nth-child(7n-1){background-image:none;background-color:rgba(0,0,0,0);}
.theme-dark .channel-members-loading .member:nth-child(3n+2),.theme-dark .channel-members-loading .member:nth-child(7n+4), .theme-light .channel-members-loading .member:nth-child(3n+2),.theme-light .channel-members-loading .member:nth-child(7n+4){background-image:none;background-color:rgba(0,0,0,0);}
.channel-members .member{display:-webkit-box;display:-ms-flexbox;display:flex;color:rgba(16,16,16,${hoverAlpha});padding:5px 16px 5px 30px;font-weight:500;cursor:pointer;line-height:30px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow:hidden;}
.theme-dark .wrapperHoveredText-1PA_Uk:hover {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(16,16,16,${hoverAlpha})),to(rgba(20,20,20,${hoverAlpha})));background:linear-gradient(90deg,rgba(16,16,16,${hoverAlpha}) 85%,rgba(20,20,20,${hoverAlpha}));}
.theme-light .wrapperHoveredText-1PA_Uk:hover {background:-webkit-gradient(linear,left top,right top,color-stop(85%,rgba(162,162,162,${hoverAlpha})),to(rgba(166,166,166,${hoverAlpha})));background:linear-gradient(90deg,rgba(162,162,162,${hoverAlpha}) 85%,rgba(166,166,166,${hoverAlpha}));}
.theme-dark .chat form .typing {background-color:rgba(0,0,0,0);}
.theme-light .chat form .typing {background-color:rgba(0,0,0,0);}
.theme-dark .chat>.content{background-color:rgba(0,0,0,0);}
.theme-light .chat>.content{background-color:rgba(0,0,0,0);}
.scroller-wrap .scroller::-webkit-scrollbar-track-piece {visibility: hidden;}
.theme-dark .scroller-wrap .scroller::-webkit-scrollbar-thumb {border: 0px;background-color: rgba(0,0,0,0.4)!important;}
.theme-light .scroller-wrap .scroller::-webkit-scrollbar-thumb {border: 0px;background-color: rgba(255,255,255,0.4)!important;}
.scroller-wrap .scroller::-webkit-scrollbar {width: 10px;}
.theme-dark .popout-bottom {background: rgba(0,0,0,${popoutAlpha});}
.theme-light .popout-bottom {background: rgba(255,255,255,${popoutAlpha});}
.results-group .option:after {background: none;}
.theme-dark .results-group .user, .theme-dark .results-group .option, .theme-dark .search-popout .search-option, .theme-dark .option.search-query.selected {background: rgba(0,0,0,${popoutAlpha * 0.5});}
.theme-light .results-group .user, .theme-light .results-group .option, .theme-light .search-popout .search-option, .theme-light .option.search-query.selected {background: rgba(0,0,0,${popoutAlpha * 0.5});}
.theme-dark .results-group .user.selected, .theme-dark .results-group .option.selected, .theme-dark .search-popout .search-option.selected {background: rgba(0,0,0,${popoutAlpha * 0.75});}
.theme-light .results-group .user.selected, .theme-light .results-group .option.selected, .theme-light .search-popout .search-option.selected {background: rgba(0,0,0,${popoutAlpha * 0.75});}
`;
var head = document.head || document.getElementsByTagName('head')[0];
var style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  style.styleSheet.cssText = css;
}else{
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);