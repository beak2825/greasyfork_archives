// ==UserScript==
// @name Discord 2009 youtube player alt
// @namespace legosavant
// @version 1.0.1
// @description Yeah I made another one
// @grant GM_addStyle
// @run-at document-start
// @match *://*.discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/431199/Discord%202009%20youtube%20player%20alt.user.js
// @updateURL https://update.greasyfork.org/scripts/431199/Discord%202009%20youtube%20player%20alt.meta.js
// ==/UserScript==

(function() {
let css = `
[class^="videoControls"] svg polygon, [class^="videoControls"] svg path {
    display:none
}
/*general*/
[class^="controlIcon"] {
    width: 29px;
    height: 23px;
    float: left;
    border: 0;
    border-left: 1px solid #eee;
    border-right: 1px solid #b1b1b1;
    background-image: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
    padding: 0;
    margin: 0;
    display: block;
}
[class^="videoControls"] div:first-child {
    order:0
}
[class^="videoControls"] div[class^="durationTimeWrapper"] ~ div[class^="horizontal"] {
    order:1
}
[class^="videoControls"] div[class^="durationTimeWrapper"] {
    order:2
}
[class^="videoControls"] div[class^="durationTimeWrapper"] ~ div[class^="flex"] {
    order:3
}
[class^="videoControls"] div:last-child {
    order:4
}
[class^="controlIcon"] {
    opacity:1
}
[class^="mediaBarWrapper"], [class^="mediaBarWrapper"]:after, [class^="mediaBarWrapper"]:before, [class^="mediaBarGrabber"], [class^="mediaBarProgress"], [class^="mediaBarProgress"]:after, [class^="mediaBarProgress"]:before, [class^="bubble"], [class^="bubble"]:before, [class^="mediaBarPreview"], [class^="mediaBarPreview"]:after, [class^="mediaBarPreview"]:before, [class^="buffer"], [class^="buffer"]:after, [class^="buffer"]:before {
    content:none
}
/*main*/
[class^="videoControls"] {
    height:23px;
    background: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
}
/*play*/
[class^="videoControls"] div[aria-label^="Play"] [class^="controlIcon"]  {
    background-position: 0 -67px;
}
[class^="videoControls"] div[aria-label^="Play"] [class^="controlIcon"]:hover  {
    background-position: -28px -67px;
}
[class^="videoControls"] div[aria-label^="Play"] [class^="controlIcon"]:active {
    background-position: -56px -67px;
}
/*PAUSE*/
[class^="videoControls"] div[aria-label="Pause"] [class^="controlIcon"]  {
    background-position: 0 -90px;
}
[class^="videoControls"] div[aria-label="Pause"] [class^="controlIcon"]:hover  {
    background-position: -28px -90px;
}
[class^="videoControls"] div[aria-label="Pause"] [class^="controlIcon"]:active {
    background-position: -56px -90px;
}
/*sound*/
[class^="volumeButton"] [class^="controlIcon"] {
    background-position: 0 -182px;
}
[class^="volumeButton"] [class^="controlIcon"]:hover {
    background-position: -30px -182px;
}
[class^="volumeButton"] [class^="controlIcon"]:active {
    background-position: -60px -182px;
}
[class^="volumeButton"] [class^="controlIcon"][fill="none"] {
    background-position: 0 -228px;
}
[class^="volumeButton"] [class^="controlIcon"][fill="none"]:hover {
    background-position: -30px -228px;
}
[class^="volumeButton"] div[tabindex="0"] [class^="controlIcon"][fill="none"]:active {
    background-position: -60px -228px;
}
/*vol setting*/
[class^="mediaBarInteractionVolume"] {
    background: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
    background-position: -0px -313px;
    height: 61px;
    width: 27px;
    padding:0;
    margin:0px;
    border-radius:0;
    border-top: 0;
    border:1px solid #fff
}
[class^="volumeSliderWrapper"], .volumeSliderWrapper__3c254 {
    bottom:23px;
    right:0;
    left:0;
    margin:0
}
[class^="volumeSliderWrapper"] > [class^="vertical"], .volumeSliderWrapper__3c254 > div {
    width:auto;
    height:auto;
    /*transform:none*/
}
[class^="vertical"] [class^="mediaBarInteractionVolume"] [class^=".mediaBarWrapper"] {
    transform:rotate(-90deg);
    height:6px;
    width:48px;
    margin-left:-10px;
    background:transparent
}
[class^="vertical"] [class^="mediaBarGrabber"], [class^="mediaBarProgress"], [class^="mediaBarProgress"]:after, [class^="mediaBarProgress"]:before {
    content:none!important
}
[class^="vertical"] [class^="mediaBarProgress"], [class^="mediaBarProgress"]:after, [class^="mediaBarProgress"]:before{
    background:transparent
}
[class^="vertical"] [class^="mediaBarGrabber"] {
    transform:scale(1)!important;
    background: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
    background-position: -44px -297px;
    border-radius:0;
    width:20px;
    transform:rotate(90deg)!important;
    margin-right:-10px;
    cursor:pointer
}
/*full*/
[aria-label="Full screen"] [class^="controlIcon"] {
    background-position: 0 -113px;
}
[aria-label="Full screen"] [class^="controlIcon"]:hover {
    background-position: -31px -113px;
}
[aria-label="Full screen"] [class^="controlIcon"]:active {
    background-position: -62px -113px;
}
/*time*/
[class^="durationTimeWrapper"] * {
    font-family: Lucida Grande, Lucida San Unicode, Helvetica, Arial, sans-serif;
    font-size: 10px!important;
    color:#000;
}
[class^="videoControls"] div[class^="durationTimeWrapper"] {
    margin:0;
    padding:4px;
    border-right: 1px solid #b1b1b1;
}
/*progress*/
[class^="mediaBarInteraction"]:hover [class^=".mediaBarWrapper"], [class^="mediaBarInteractionDragging"]:hover [class^=".mediaBarWrapper"] {
    box-shadow:none
}
[class^="horizontal"] {
    border-left: 1px solid #eee;
}
[class^="horizontal"] [class^=".mediaBarWrapper"] {
    background: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
    background-position: 0 -60px;
    height:7px
}
[class^="horizontal"] [class^="buffer"] {
    background: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
    background-position: 0 -53px;
}
[class^="horizontal"] [class^="mediaBarProgress"] {
    background: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
    background-position: 0 -46px;
}
[class^="horizontal"] [class^="mediaBarGrabber"] {
    background-position: 0 -297px;
    background-color:transparent!important;
    background-image: url(https://cdn.discordapp.com/attachments/336628093483614210/878446385211531325/sprite_player.png);
    transform:scale(1);
    height:16px;
    width:16px;
    top:0;
    margin-right:-10px
}
/*top*/
.metadata-13NcHb {
    padding:12px 4px;
    height:38px;
    background:none
}
.metadataName-14STf-, .metadataSize-2UOOLK{
    text-shadow: 1px 1px #000
}
.metadataDownload-1fk90V {
    opacity:1
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
