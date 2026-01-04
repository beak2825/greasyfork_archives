// ==UserScript==
// @name Discord made to look like steam
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 0.1
// @description Steam looks pretty cool, so discord now can look like it. Mostly modeled after "current" VGUI screens (old friends, old library). Radial status and settings modal come prepackaged
// @author legosavant
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/458570/Discord%20made%20to%20look%20like%20steam.user.js
// @updateURL https://update.greasyfork.org/scripts/458570/Discord%20made%20to%20look%20like%20steam.meta.js
// ==/UserScript==

(function() {
let css = `
.theme-dark {
    --background-primary:rgb(48,53,59);
    --background-secondary:#16191C;
    --font-primary:arial;
    --font-display:arial;
    --scrollbar-auto-scrollbar-color-track:red;
    --scrollbar-auto-scrollbar-color-thumb:blue;
    --scrollbar-auto-track:rgb(22,25,28);
    --scrollbar-auto-thumb:rgb(35,39,43); /*linear-gradient(rgb(57,63,70),rgb(28,32,35));*/
    --scrollbar-thin-track:rgb(22,25,28);
    --scrollbar-thin-thumb:rgb(35,39,43);
    --status-red-530:rgb(173 69 71)
}
.auto-2K3UW5::-webkit-scrollbar {
    width:13px
}
.auto-2K3UW5::-webkit-scrollbar-thumb, .auto-2K3UW5::-webkit-scrollbar-track, .thin-31rlnD::-webkit-scrollbar-track, .thin-31rlnD::-webkit-scrollbar-thumb {
    border-radius:0;
    border-width:0;
}
.auto-2K3UW5::-webkit-scrollbar-thumb, .thin-31rlnD::-webkit-scrollbar-thumb {
    background:rgb(35,39,43) url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAIAAABLMMCEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVBhXY7h29YqUnCIayQCkMBHD2TNngBQaiUPt4UOHgBSMPAghcajdsWO7tJwihNwJIXdsAwAPlDDEXMDtswAAAABJRU5ErkJggg==') no-repeat center;
}
.auto-2K3UW5::-webkit-scrollbar-thumb:hover, .thin-31rlnD::-webkit-scrollbar-thumb:hover {
    background:rgb(82,89,101) url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAIAAABLMMCEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVBhXY7h29YqUnCIayQCkMBHD2TNngBQaiUPt4UOHgBSMPAghcajdsWO7tJwihNwJIXdsAwAPlDDEXMDtswAAAABJRU5ErkJggg==') no-repeat center
}
body {
    font-size:13px
}
/************************************** SECTION1 buttons*/
.sizeSmall-wU2dO-, .lookOutlined-3yKVGo.colorBrand-I6CyqQ, .lookFilled-yCfaCM.colorBrandNew-2-gGsS, .lookFilled-1GseHa.select-1Ia3hD, .sizeMedium-2bFIHr.grow-2sR_-F, .lookBlank-21BCro.sizeMin-DfpWCE, .theme-light .lookLink-15mFoz.colorPrimary-2AuQVo, .copyInputDefault-3jiMHw.copyInput-3AbKWB button.button-3M8h3F { /*base*/
    padding:0 6px;
    min-height:25px;
    text-transform:uppercase;
    font-size:10px;
    height:25px;
    border-radius:0;
    border:0
}
.lookFilled-yCfaCM.colorBrand-I6CyqQ, .lookOutlined-3yKVGo.colorBrand-I6CyqQ, .lookFilled-yCfaCM.colorBrandNew-2-gGsS, .lookFilled-1GseHa.select-1Ia3hD, .lookFilled-yCfaCM.colorGreen-3y-Z79, .theme-dark .lookLink-15mFoz.colorPrimary-2AuQVo, #overview-tab .sizeMedium-2bFIHr.grow-2sR_-F, .sizeMedium-2bFIHr.grow-2sR_-F, .copyInputDefault-3jiMHw.copyInput-3AbKWB button.button-3M8h3F {
    background:linear-gradient(rgb(66,72,82),rgb(51,56,62))
}
.lookFilled-yCfaCM.colorBrand-I6CyqQ:hover, .lookOutlined-3yKVGo.colorBrand-I6CyqQ:hover, .lookFilled-yCfaCM.colorBrandNew-2-gGsS:hover, .lookFilled-1GseHa.select-1Ia3hD:hover, .lookFilled-yCfaCM.colorGreen-3y-Z79:hover, .theme-dark .lookLink-15mFoz.colorPrimary-2AuQVo:hover, #overview-tab .sizeMedium-2bFIHr.grow-2sR_-F:hover, .sizeMedium-2bFIHr.grow-2sR_-F,  .copyInputDefault-3jiMHw.copyInput-3AbKWB button.button-3M8h3F:hover {
     background:linear-gradient(rgb(83,89,102),rgb(51,57,63));
    text-decoration:none
}
.lookFilled-yCfaCM.colorBrand-I6CyqQ:active, .lookOutlined-3yKVGo.colorBrand-I6CyqQ:active, .lookFilled-yCfaCM.colorBrandNew-2-gGsS:active, .lookFilled-1GseHa.select-1Ia3hD:active, .lookFilled-yCfaCM.colorGreen-3y-Z79:active, .theme-dark .lookLink-15mFoz.colorPrimary-2AuQVo:active, #overview-tab .sizeMedium-2bFIHr.grow-2sR_-F:active, .sizeMedium-2bFIHr.grow-2sR_-F:active,  .copyInputDefault-3jiMHw.copyInput-3AbKWB button.button-3M8h3F:active {
     background:linear-gradient(rgb(43,47,52),rgb(50,55,61))
}
.tabBar-ra-EuL .addFriend-emTWY1.addFriend-emTWY1.addFriend-emTWY1 { /*blue*/
    background:linear-gradient(rgb(83 172 204),rgb(54 125 153))
}
.container-ZMc96U.themed-Hp1KC_ .tabBar-ra-EuL .addFriend-emTWY1.addFriend-emTWY1.addFriend-emTWY1:hover {
    background:linear-gradient(rgb(119 215 250),rgb(54 125 153))!important
}
.container-ZMc96U.themed-Hp1KC_ .tabBar-ra-EuL .addFriend-emTWY1.addFriend-emTWY1.addFriend-emTWY1:active {
    background:linear-gradient(rgb(25 55 84),rgb(54 125 153))!important
}
.lookFilled-1GseHa.select-1Ia3hD {
    text-transform:none;
    font-size:11px
}
.copyInputDefault-3jiMHw.copyInput-3AbKWB .button-3M8h3F { /*copybox*/
    margin:0
}
/*specifics*/
.tabBar-ra-EuL .addFriend-emTWY1.addFriend-emTWY1.addFriend-emTWY1 { /*add friend*/
    border-radius:0
}
/*pin it*/
.theme-dark .lookLink-15mFoz.colorPrimary-2AuQVo:hover .contents-3ca1mk {
    --button--underline-color:none
}
.sizeMedium-2bFIHr.grow-2sR_-F div {
    margin:0!important;
    text-decoration:none!important
}
.sizeMedium-2bFIHr.grow-2sR_-F {
    text-align:left;
    justify-content:start;
    margin-left:10px;
    min-height:24px;
    max-height:24px
}
.lookFilled-1GseHa.select-1Ia3hD .icons-2dXYop { /*dropdown*/
    border-left:1px solid rgb(112,120,137);
    height:16px;
    width:14px;
}
.lookFilled-1GseHa.select-1Ia3hD .icons-2dXYop svg {
    border-color:rgb(228,227,219) transparent;
    border-width:5px 4px 0;
    border-style:solid;
    width:0;
    height:0;
    margin-left:5px;
    margin-top:2px
}
.popout-1KHNAq {
    border:0;
    border-top:1px solid transparent;
    background:linear-gradient(rgb(56,60,68),rgb(41,45,51));
    border-radius:0
}
.option-2eIyOn {
    padding:0 6px;
    font:400 11px arial;
    height:25px
}
.selectedIcon-19TbzU  {
    color:#444
}
/************************************** SECTION2 sidebar and channel info... reset stuff*/
/*guild*/
.tree-3agP2X, .header-3OsQeK, .container-ZMc96U.themed-Hp1KC_ {
    background:linear-gradient(rgb(27,34,56),rgb(33,34,35) 73px, rgb(42,46,51) 163px)
}
.scroller-3X7KbA {
    background:none;
    position:relative;
    z-index:4
}
.svg-2zuE5p mask {
    display:none
}
.wrapperSimple-Js2rIO {
    border-radius:0;
}
.wrapper-28eC3z, .listItemWrapper-3d87LP {
    min-width:48px;
    width:auto
}
.expandedFolderBackground-1kSAf6 {
    background:rgba(27,34,56,.5)
}
.unreadMentionsIndicatorBottom-3RJMnQ {
    bottom:36px
}
.bar-2eAyLE {
    border-radius:0;
    background:#282828;
    box-shadow:none;
    border:1px solid #4d4d4d;
    height:20px
}
.bar-2eAyLE:active {
    background:#444
}
.text-md-semibold-3xVVGu { /*above channel*/
    font:400 20px arial;
    text-transform:uppercase;
    color:rgb(197 203 216)
}
.header-3OsQeK:hover .text-md-semibold-3xVVGu {
    text-shadow:1px -1px 5px rgb(100 110 125);
}
.header-3OsQeK:active .text-md-semibold-3xVVGu {
    text-shadow:1px -1px 4px white;
    color:#fff
}
.header-3OsQeK {
    padding-left:4px;
    padding-right:4px
}
.header-3OsQeK .headerChildren-2qV9P8 {
    display:none
}
.scroller-3X7KbA > div[aria-label] {
    overflow:hidden scroll;
    height:calc(100% - 69px);
    scrollbar-width:0;
    --sillyheight:56px
}
.scroller-3X7KbA > div[style] ~ div[aria-label] { /*i hope someone finds a better way to do this*/
    height:calc(100% - 69px - (var(--sillyheight)*1))
}
.scroller-3X7KbA > div[style] ~ div[style] ~ div[aria-label] {
    height:calc(100% - 69px - (var(--sillyheight)*2))
}
.scroller-3X7KbA > div[style] ~ div[style] ~ div[style] ~ div[aria-label] {
    height:calc(100% - 69px - (var(--sillyheight)*3))
}
.scroller-3X7KbA > div[style] ~ div[style] ~ div[style] ~ div[style] ~ div[aria-label] {
    height:calc(100% - 69px - (var(--sillyheight)*4))
}
.scroller-3X7KbA > div[style] ~ div[style] ~ div[style] ~ div[style] ~ div[style] ~ div[aria-label] {
    height:calc(100% - 69px - (var(--sillyheight)*5))
}
.scroller-3X7KbA .guildSeparator-a4uisj {
    display:none
}
.scroller-3X7KbA > div[aria-label]::-webkit-scrollbar {
    width:0
}
.tutorialContainer-2jwoiB { /*add server*/
    position:absolute;
    bottom:0;
    background:#2A2E33;
    height:68px;
    /*z-index:2222;*/
    overflow:visible;
    width:312px
}
.tutorialContainer-2jwoiB .listItemWrapper-3d87LP, .tutorialContainer-2jwoiB+.listItem-3SmSlK, .tutorialContainer-2jwoiB+.listItem-3SmSlK .listItemWrapper-3d87LP {
    width:112px
}
.guilds-2JjMmN, .tree-3agP2X, .scroller-3X7KbA {
    overflow:visible!important
}
.tutorialContainer-2jwoiB .circleIconButton-1VxDrg {
    width:100%;
    background:none;
    height:68px;
}
.tutorialContainer-2jwoiB .circleIconButton-1VxDrg:before { 
    content:"";
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAABHNCSVQICAgIfAhkiAAAARpJREFUOI1jrKiu+29uaszw798/BkoBMzMzw5mz5xlYLEyNGWrqmxn+/f9PsaEMDAwMLY21DEw/f/2imoEMDAwMv3//ZmCimmlIgCaGshCjSFVFmYGfn4/h48dPDLfv3CWoniiXBgX6MaQmxTMEBfoRo3yoh6m6miqDj5cHnC8hLganiwty4eJbtu1guHnrNnGGCgkKMqipKmOIc3FyoogLCQoS79KPnz4xPHr8FM4XExNh4GBnZ/jx8yfDq1dvUNQRbei16zcYrl2/AeeXlxYyKCnIMzx7/oKhs7sfq0HIYIjHPjpYt34TPEdRzVBisiYyGDphysTOxsbAxMhINQNZWVkZGCuq6/5bmBoz/KVCHcXIyMhw7sJFBgD+jVQjpiSSGgAAAABJRU5ErkJggg==') no-repeat center;
    color:transparent;
    width:100%;
    height:100%;
    min-width:22px;
    margin-left:10px
}
.tutorialContainer-2jwoiB .circleIconButton-1VxDrg svg {
    display:none
}
.tutorialContainer-2jwoiB .circleIconButton-1VxDrg:after {
    content:"Add a Server";
    font:400 11px arial;
    color:#fff;
    display:inline-block;
    line-height:60px;
    white-space:nowrap;
    margin:0 6px;
    text-transform:uppercase
}
.tutorialContainer-2jwoiB .wrapper-28eC3z foreignObject {
    width:110px
}
.tutorialContainer-2jwoiB .listItem-3SmSlK {
    width:auto;
    height:100%;
    justify-content:start;
    padding-left:20px
}
.tutorialContainer-2jwoiB+.listItem-3SmSlK { /*explore*/
    position:absolute;
    bottom:2px;
    /*z-index:2;*/
    left:140px
}
.tutorialContainer-2jwoiB+.listItem-3SmSlK .svg-2zuE5p foreignObject, .tutorialContainer-2jwoiB+.listItem-3SmSlK .svg-2zuE5p .circleIconButton-1VxDrg {
    width:100px;
    background:none;
    color:rgb(195,195,195)
}
.tutorialContainer-2jwoiB+.listItem-3SmSlK .svg-2zuE5p .circleIconButton-1VxDrg:after {
    content:"Explore";
    font:400 11px arial;
    color:#fff;
    display:inline-block;
    line-height:60px;
    white-space:nowrap;
    margin:0 6px;
    text-transform:uppercase
}
.tutorialContainer-2jwoiB+.listItem-3SmSlK .svg-2zuE5p .circleIconButton-1VxDrg svg {
    border:1px solid rgb(195,195,195);
    width:21px;
    height:21px;
    padding:2px;
    box-sizing:border-box
}
.tutorialContainer-1pL9QS { /*DM*/
    position:absolute;
    z-index:14;
    left:88vw;
    bottom:4px;
    width:130px;
    background:rgba(42,46,51,.5)
}
.tutorialContainer-1pL9QS .selected-3a1QGn {
    display:none
}
.tutorialContainer-1pL9QS > .listItem-3SmSlK, .tutorialContainer-1pL9QS .wrapper-28eC3z, .tutorialContainer-1pL9QS svg, .tutorialContainer-1pL9QS foreignObject {
    width:148px
}
.tutorialContainer-2jwoiB ~ .listItem-3SmSlK .pill-1NRFie, .tutorialContainer-1pL9QS .pill-L_aLMQ {
    display:none
}
.userProfileInner-3F03PX {
    border-radius:0
}
.listItem-3SmSlK:has(.guildSeparator-a4uisj) ~ .listItem-3SmSlK:has(.guildSeparator-a4uisj) ~ .listItem-3SmSlK, .listItem-3SmSlK:has(.guildSeparator-a4uisj) { /*browser*/
    display:none
}

.childWrapper-1j_1ub {
    background:none!important
}
[data-list-item-id="guildsnav___home"] svg {
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAABHNCSVQICAgIfAhkiAAAAx9JREFUOI2tk91Pk2cYxn/v0/atrbYLA5SPUkCT0VaoMGSIxY8Ts5hsI36BsP0FS5aYLFtMtmQeL2pcMBzsZHNMDTEuOzFgNCZgKV/C8GMTWtBBAZdRV9fxGirtWw+M73xpu7DE6+y+rvu+7ud+nueWPN7aFBlQXlbGnt2NlDodCCEQQmAwGEgkEszMhvH3DzAZDGUqRVptunFjPm0tRzDJJvz+AcbGbxOPxzXdLMvU1r5NQ30dQkh0XfqJ2fBcdlNvVSWHDzZx6fLP3L33a8ZTvAqP20XzoQP0XLvO4NCIxhvyNxWdANjqcXP4YBOnzrQTXtU5GxYjEQaHb/Fhawuqqmp1AiAvN5ejzYc42/Etsdg/azJ8ieXlZb5p72D/u/twljj+NW1rbeZK91Uijx9nLKyp3sbePbvwuF0Z9SVF4VznBVqPHgHAWFRYgN22QXcnq/HBe/spKizg/kSQ3+5PZMwJTU0Tjz/D5apA+HwNDA7fWvu8/4Gb/gC+hnrElvJyRsfGX4vpnbv3KCkuxmi1WohGozrR43ZxoOl9Lc7LfROAslInXxz/TOO/O9fJwqM/tHhlZQVJSBjVpJrW8Q27HWdJcRpvsazT8VarNS1HSBJGYRBpwl/RKMHQtBY7nQ7Wmc0sLSm6ky0pSlqtmkphVBSF/Lw8FiMRTZgMhnR7/dWXxykqLCA8N8+Z9o40o5cwmUyk1BTiwcMZaqq9WRP/D6q3VTE7N4fo7fOzo77utZjuatxJnz+A8c/FRZ78HeOduu0Mj2T+r9//cB6LxUIsFstq6Kp4C9lkYmpq+sWa9vb58VZuzVowMxtmYjKoe6RXYbPZ+Kithc4LXQAY4cVuTwSDaxxSD7vdxrFPPqb76jXm5xcAEBvWr2fL5jICA0MA5OTkUOJwrMnQ7arg80+Pcf1GL/2BQY2Xvj55OqU8fUoykaSq0kMikSAef4Ysm+gfGGJ09BfdfzSbzdRUe/E17MBgMPDjxS4WFh7pmkndPT2paPQJo2Pj3PQHNAOHo5jdjT42l5ciyzKqqiJJEsmkSmhqmqHhER48/D3jBM8BDncgTnD0cGYAAAAASUVORK5CYII=') no-repeat;
    color:transparent;
    width:24px;
    height:24px
}
[data-list-item-id="guildsnav___home"] {
    width:120px
}
[data-list-item-id="guildsnav___home"] .childWrapper-1j_1ub {
    width:100%
}
[data-list-item-id="guildsnav___home"] .childWrapper-1j_1ub:before {
    content:"Friends & chat";
    max-width:56px;
    text-transform:uppercase;
    margin-right:2px;
    font:400 11px arial
}
.listItem-3SmSlK:has(.pill-1eBbnB ~ div:not([class])) { /*starred*/
    position:absolute;
    bottom:4px;
    z-index:4;
    left:85vw
}
.listItem-3SmSlK:has(.pill-1eBbnB ~ div:not([class])) .item-2LIpTv {
    margin:0;
    border:1px solid gray;
    height:20px!important;
    width:20px;
    background:none
}
.listItem-3SmSlK:has(.pill-1eBbnB ~ div:not([class])) .item-2LIpTv[style] {
    border-color:yellow
}
.listItem-3SmSlK:has(.pill-1eBbnB ~ div:not([class])) .pill-1eBbnB {
    left:25px;
    width:22px
}
/*user thing on bottom left*/
.container-1NXEtd {
    margin-bottom:68px
}
.panels-3wFtMD {
    position:absolute;
    z-index:101;
    right:0;
    background:none
}
.withTagAsButton-OsgQ9L:hover, .withTagless-10ooWt:hover {
    background:none
}
.container-YkUktl {
    background:none;
    height:40px
}
.avatarWrapper-1B9FTW {
    margin:0;
    width:130px
}
.container-YkUktl .avatar-1EWyVD, .container-YkUktl .avatar-1EWyVD foreignobject {
    width:24px!important;
    height:24px!important;
    background:#000
}
.container-YkUktl .avatar-1EWyVD, .container-YkUktl .avatar-1EWyVD rect {
    width:24px!important;
    height:24px!important;
    clip-path:inset(1px -1px 1px 1px)
}
.nameTag-sc-gpq {
    padding:0!important;
    background:rgb(27,44,61);
}
.nameTag-sc-gpq:hover {
    background:rgb(35,55,75)
}
.nameTag-sc-gpq .text-xs-normal-3SiVjE, .nameTag-sc-gpq .subtext-2HDqJ7 {
    display:none
}
.nameTag-sc-gpq .text-sm-normal-3Zj3Iv .title-338goq {
    font:400 13px arial;
    line-height:24px;
    padding:0 10px;
    color:rgb(85,165,196)
}
.usernameContainer-3PPkWq {
    padding-left:2px
}
.button-12Fmur {
    height:24px;
    width:24px;
    border-radius:0;
    margin-left:8px;
    background:none!important;
    color:rgb(175,173,173)
}
.button-12Fmur.enabled-9OeuTA:hover:hover {
    color:white
}
/*upper stuff*/
.container-ZMc96U.themed-Hp1KC_ { 
    padding-left:0;
    border-bottom:8px solid rgb(42,46,51);
    
}
.content-1SgpWY > div:last-child .container-ZMc96U.themed-Hp1KC_, .content-1SgpWY > div:nth-last-child(2) .container-ZMc96U.themed-Hp1KC_, [aria-label="Friends"] .container-ZMc96U.themed-Hp1KC_ {
    padding-right:244px
}
.children-3xh0VB { 
    height:100%;
    align-items:end
}
.children-3xh0VB .iconWrapper-2awDjA, .channelName-3aS_Eg  { 
    background:linear-gradient(rgb(75,82,91),rgb(42,46,51));
    margin:0;
    padding-left:0px;
    padding-right:0px;
    height:24px;
    margin-bottom:-1px
}
.heading-md-semibold-3sznX7, .channelName-3aS_Eg .input-1nrc5P {
    font:400 12px arial;
    line-height:24px;
    color:rgb(200 208 220);
    border-radius:0
}
.channelName-3aS_Eg input.input-1nrc5P {
    height:24px
}
.children-3xh0VB .iconWrapper-2awDjA svg {
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAABHNCSVQICAgIfAhkiAAAAMFJREFUKJGVkc8KAWEUxc9hlL0a1jZeieyI15CHsJcS34q1WY2NxjsoeQUlfePeazXC+Hvq1u2cfnVul/1ed9dstev4QW4+PTCKIgMAMwPJr1CQpumDkUFmlvPNLA98Esn/AAAIvPe3Cu9uuM8C7/2t733/ZzjzitWw0gmrNVPVsohARKCqeN5VFdtks3vRYVAYjcIzyRIAjGeLerJe7bO0kAeGqqonEYFzrpSsV3uSls0LACB5nLhlI47jC8mHh1wB4p5v2tVifMsAAAAASUVORK5CYII=') no-repeat center 6px;
    color:transparent;
}
.children-3xh0VB .titleWrapper-24Kyzc {
    background:linear-gradient(rgb(75,82,91),rgb(45,49,54));
    padding-right:6px;
    height:24px;
    font:400 12px arial;
    margin-bottom:-1px
}
.guildBreadcrumbContainer-3LUtHj {
    background:linear-gradient(rgb(75,82,91),rgb(45,49,54));
}
.iconSizeSmaller-3mXaSo {
    border-radius:0;
}
.guildBreadcrumbContainer-3LUtHj .iconSizeSmaller-3mXaSo {
    width:18px;
    height:18px
}
.children-3xh0VB .titleWrapper-24Kyzc h1:after {
    content:"";
    width:8px;
    height:7px; background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAIAAABxZ0isAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACQSURBVBhXY5g8ceL+vXtrKisd3f2BKDM9beeOHQvmz2ewd/Pt6ercv3dPZUV5aVHhnl27Zk6fChRksHPxBqK6mup9e/bs2bUbaABEhMHG2QuI6mtr9u3Zu3vnTqAERITB2tGjr7f74P79leVl+Xk5QKPmz50DFGTo6WxfvXJlTlamlb0bEKUmJ65Yvqy/twcAjgNFMjTQ3r8AAAAASUVORK5CYII=') no-repeat;
    display:inline-block;
    margin-left:20px
}
.children-3xh0VB .divider-q3P9HC {
    display:none
}
.theme-dark .children-3xh0VB:after, .content-1jQy2l:before {
    content:none
}
.topic-11NuQZ {
    font-size:12px;
    height:21px
}
.toolbar-3_r2xA .iconWrapper-2awDjA {
    background:rgb(27,44,61);
    padding:0 4px;
    margin:0 4px;
    width:32px;
    justify-content:center;
    align-items:center;
    display:flex
}
.toolbar-3_r2xA .iconWrapper-2awDjA:hover {
    background:rgb(35,55,75)
}
.toolbar-3_r2xA .iconWrapper-2awDjA.selected-29KTGM {
    background:rgb(61,146,175)
}
.toolbar-3_r2xA .iconWrapper-2awDjA svg {
    width:18px;
}
/*channel*/
.mainContent-20q_Hp:before {
    content:none
}
.modeSelected-3DmyhH .content-1gYQeQ, .modeSelected-3DmyhH:hover .content-1gYQeQ {
    border-radius:0;
}
.children-1MGS9G {
    margin-right:9px
}
.content-1gYQeQ {
    margin-left:2px;
    padding:0
}
.name-28HaxV, .container-q97qHp {
    font-size:12px;
    font-family:arial;
    font-weight:400;
    line-height:18px;
    letter-spacing:0;
}
.container-q97qHp {
    font-size:11px;
    line-height:11px;
    letter-spacing:0
}
.iconItem-1EjiK0 {
    padding:0
}
.communityInfoVisible-3zc5_s .communityInfoContainer-1dMVpU {
    display:none
}
/*editing this too much breaks stuff*/
.mainContent-20q_Hp {
    padding:5px 0
}
.icon-2W8DHg { /*hash icon*/
    width:16px;
    height:16px;
}
.iconContainer-21RCa3 {
    margin-left:4px;
    margin-right:3px
}
.wrapper-NhbLHG {
    padding:0
}
.wrapper-NhbLHG .content-1gYQeQ { /*standard*/
    background:none
}
.wrapper-NhbLHG .content-1gYQeQ .name-28HaxV {
    color:rgb(200 208 220)
}
.wrapper-NhbLHG:hover .content-1gYQeQ { /*standard hover*/
    background:none;
}
.wrapper-NhbLHG:hover .content-1gYQeQ .name-28HaxV, .wrapper-NhbLHG:hover .content-1gYQeQ .iconContainer-21RCa3 svg {
    color:white
}
.modeSelected-3DmyhH .content-1gYQeQ, .modeSelected-3DmyhH:hover .content-1gYQeQ { /*select standard*/
    background:#193754;
}
.modeMuted-2T4MDZ.wrapper-NhbLHG .content-1gYQeQ .name-28HaxV, .modeMuted-2T4MDZ.wrapper-NhbLHG .content-1gYQeQ .iconContainer-21RCa3 svg { /*muted*/
    color:rgb(102 106 112)
}
.modeMuted-2T4MDZ.wrapper-NhbLHG:hover .content-1gYQeQ .name-28HaxV, .modeMuted-2T4MDZ.wrapper-NhbLHG:hover .content-1gYQeQ .iconContainer-21RCa3 svg {
    color:rgb(168 172 179)
}
.wrapper-NhbLHG [aria-label*="mention"] .name-28HaxV, .wrapper-NhbLHG [aria-label*="mention"] .iconContainer-21RCa3 svg { /*ping*/
    color:rgb(58,148,191)
}
.wrapper-NhbLHG:hover [aria-label*="mention"] .name-28HaxV, .wrapper-NhbLHG:hover [aria-label*="mention"] .iconContainer-21RCa3 svg {
    color:rgb(85,186,235)
}
.wrapper-NhbLHG .unreadRelevant-2f-VSK {
    background:rgb(58,148,191)
}
.wrapper-NhbLHG:hover .unreadRelevant-2f-VSK {
    background:rgb(85,186,235)
}
.wrapper-NhbLHG .numberBadge-37OJ3S {
    background:none!important;
    font-size:12px;
}
.modeSelected-3DmyhH .content-1gYQeQ .name-28HaxV, .modeSelected-3DmyhH .content-1gYQeQ .iconContainer-21RCa3 svg { 
    color:white
}
.wrapperCommon-I1TMDb { /*headers*/
    background:linear-gradient(90deg, rgb(50 55 61),transparent);
    height:19px;
    margin-left:2px;
    margin-bottom:1px;
    padding-left:23px;
    cursor:default
}
.containerDefault-3TQ5YN, .containerDragAfter-1J_-1V, .containerDragBefore-ei4h1m, .containerUserOver-3woq86 {
    padding:0
}
.arrow-2HswgU.icon-3zI3d2 {
    visibility:hidden;
}
.mainContent-uDGa6R:before {
    content:"_";
    line-height:6px;
    margin-left:7px;
    color:rgb(169,167,167);
    font-size:18px;
    font-weight:bold;
}
.mainContent-uDGa6R:hover:before {
    color:#fff;
}
.mainContent-uDGa6R[aria-expanded="false"]:before {
    content:"+";
    line-height:18px;
    font-size:20px;
    font-weight:500
}
.list-2x9Cl9 { /*vc*/
    padding-bottom:10px;
    padding-left:25px
}
.listDefault-2F-w65 .clickable-1ctZ-H:hover .content-1Tgc42 {
    background:none
}
.listDefault-2F-w65 .clickable-1ctZ-H .content-1Tgc42 {
    margin:0
}
.avatarSmall-3qwAkA {
    width:16px;
    height:16px;
    border-radius:0;
    margin:0 3px 0 0
}
.usernameFont-2oJxoI {
    font-size:12px;
    line-height:18px
}
.avatar-3TrM7c, .size24-9rrwDS .moreUsers-_v6T-L {
    border-radius:0
}
.userSmall-1Raexx, .draggable-S2aEx4 { /*editing this too much causes bugs*/
    height:26px
}
.wrapper-2fEmwW {
    border-radius:0;
    background:none;
    font-size:10px;
    line-height:18px;
    height:18px
}
.users-2JoyGL {
    background:none;
    color:#999
}
.total-1c5KCN {
    background:none;
    color:#666
}
.total-1c5KCN:after {
    content:"/";
    border:0;
    color:#999;
    left:-6px
}

/************************************** SECTION3 USER LIST*/
.mulitplePlaceholderUsername-2T3DCI, .placeholderAvatar-1qAcRZ, .placeholderUsername-3iQi_D {
    background:none!important
}
.layout-1qmrhw {
    align-items:start
}
.selected-1-Z6gm .layout-1qmrhw {
    background:none
}
.avatar-6qzftW {
    margin-right:10px;
    margin-top:4px
}
.name-3Vmqxm {
    font-weight:400;
    font-size:14px;
}
.activity-2EQDZv {
    color:rgb(82,161,193)
}
.members-3WRCEx {
    background:linear-gradient(rgb(46,51,56),rgb(22,25,28) 163px);
    border-bottom:68px solid rgb(42,46,51)
}
.member-48YF_l, .clickable-28SzVr:hover .layout-1qmrhw {
    background:none;
}
.clickable-28SzVr:hover .layout-1qmrhw .activity-2EQDZv {
    color:rgb(75,186,242)
}
/*DM list*/
.channel-1Shao0 {
    border-radius:0
}
.channel-1Shao0 .selected-3veCBZ, .channel-1Shao0 .interactive-iyXY_x:hover {
    background:none
}
.channel-1Shao0 .layout-1LjVue {
    border-radius:0;
    align-items:start;
    padding-top:5px;
    height:37px
}
.selected-26oxtA {
    background:#000;
}
.channel-1Shao0 .layout-1LjVue .nameAndDecorators-2A8Bbk {
    align-items:start
}
.channel-1Shao0 .name-2m3Cms, .channel-1Shao0 .subtext-14b69p {
    font-size:11px;
    line-height:16px
}
.searchBar-3TnChZ {
    background:linear-gradient(rgb(27,34,56),rgb(33,34,35) 73px, rgb(42,46,51) 163px)
}
.searchBar-3TnChZ .searchBarComponent-3N7dCG {
    background:rgb(40,46,54);
    border-radius:0;
    font-style:italic;
    color:rgb(103,109,103);
    font-size:12px
}
.tabBar-ra-EuL.topPill-3DJJNV {
    height:36px
}
/* THIS WOULD BE REALLY COOL IF IT LET ME
.channel-1Shao0[aria-posinset="1"], .channel-1Shao0[aria-posinset="2"], .channel-1Shao0[aria-posinset="3"] {
    margin:0;
    display:inline-block;
    margin-right:2px
}
.channel-1Shao0[aria-posinset="1"] .layout-1LjVue,
.channel-1Shao0[aria-posinset="2"] .layout-1LjVue,
.channel-1Shao0[aria-posinset="3"] .layout-1LjVue {
    height:24px;
    padding:0 4px 0 6px;
    align-items:start
}
.channel-1Shao0[aria-posinset="1"] .linkButton-2NshQj,
.channel-1Shao0[aria-posinset="2"] .linkButton-2NshQj,
.channel-1Shao0[aria-posinset="3"] .linkButton-2NshQj {
    background:linear-gradient(rgb(50,55,61) 20px, transparent 20px)
}
.channel-1Shao0[aria-posinset="1"] .selected-3veCBZ,
.channel-1Shao0[aria-posinset="2"] .selected-3veCBZ,
.channel-1Shao0[aria-posinset="3"] .selected-3veCBZ {
    background:linear-gradient(rgb(76,84,93),rgb(59,65,72),rgb(42,46,51))
}
.channel-1Shao0[aria-posinset="1"] .avatar-1HDIsL,
.channel-1Shao0[aria-posinset="2"] .avatar-1HDIsL,
.channel-1Shao0[aria-posinset="3"] .avatar-1HDIsL {
    display:none
}
.channel-1Shao0[aria-posinset="1"] .name-2m3Cms,
.channel-1Shao0[aria-posinset="2"] .name-2m3Cms,
.channel-1Shao0[aria-posinset="3"] .name-2m3Cms {
    text-transform:uppercase;
    font-size:10px;
    line-height:21px
}
.privateChannelsHeaderContainer-1UWASm {
    background:linear-gradient(90deg, rgb(50 55 61),rgb(40,44,49));
    height:20px;
    padding:4px 6px;
    margin-left:1px;
    margin-bottom:1px;
    cursor:default;
    z-index:22;
    position:relative;
    top:3px
}
.content-2a4AW9[aria-label="Direct Messages"] > div[aria-hidden="true"] {
    position:absolute;
    background:linear-gradient(rgb(37,38,40) 24px,rgb(42,46,51) 24px,rgb(40,44,40));
    width:100%;
    height:40px!important;
    top:1px
}
.content-2a4AW9[aria-label="Direct Messages"] > div[aria-hidden="true"]:after {
    content:"";
    width:100%;
    height:1px;
    background:rgb(76,84,93);
    position:absolute;
    top:22px
}
*/
/************************************** SECTION4 modals*/
.tooltipPrimary-3qLMbS.tooltip-14MtrL {
    background: #c2c2c2;
	color: #3d3d3f;
	font-size: 11px;
	border-radius: 3px;
	padding: 0px;
	max-width: 225px;
	white-space: normal;
	box-shadow: 0 0 3px #000000;
}
.tooltipPrimary-3qLMbS.tooltip-14MtrL > * {
    padding:4px
}
.tooltipPrimary-3qLMbS.tooltip-14MtrL * {
    color: #3d3d3f;
}
.numberBadge-37OJ3S {
    border-radius:2px;
    background:rgb(61,146,175)!important
}
/*right click*/
.scroller-1bVxF5 {
    padding:0;
    background:linear-gradient(rgb(56,60,68),rgb(41,45,51));
    scrollbar-width:0;
    padding-bottom:3px;
    padding-top:1px
}
.scroller-1bVxF5::-webkit-scrollbar {
    width:0
}
.scroller-1bVxF5 .separator-1So4YB {
    border-color:rgb(76,84,93);
    margin:2px 3px 0 3px
}
.scroller-1bVxF5 .labelContainer-2vJzYL {
    font-size:11px;
    padding:5px 8px;
    min-height:0;
    margin:0;
    line-height:12px;
    color:rgb(168,172,179);
    background:none;
    cursor:Default;
}
.button-1zW0-r {
    border-radius:0;
    background:none
}
.scroller-1bVxF5 .labelContainer-2vJzYL:hover {
    color:#fff;
    background:none
}
.scroller-1bVxF5 .iconContainer-1-SsTR {
    height:11px;
    width:11px
}
.icon-E4cW1l {
    height:13px;
    width:13px;
    margin-left:-1px
}
.scroller-1bVxF5 .colorDefault-CDqZdO .subtext-2GlkbE { /*subtext of main right clicky stuff*/
    font-size:10px;
    line-height:1;
}
.flexible-1UoeVa {
    min-width:160px
}
#guild-header-popout .scroller-1bVxF5 {
    background:linear-gradient(rgb(32,33,34),rgb(44,46,49))
}
#guild-header-popout .scroller-1bVxF5 .labelContainer-2vJzYL {
    text-transform:uppercase
}
#guild-header-popout .scroller-1bVxF5 .separator-1So4YB {
    border-color:rgb(66,72,80);
    margin-left:6px;
    margin-right:6px;
    margin-bottom:2px
}
/*add role*/
.container-2O1UgZ {
    border-radius:0;
    background:rgb(33,35,38)
}
.container-2oNtJn {
    border-radius:0;
    background:rgb(40,46,54)
}
.list-3cyRKU {
    background:#000;
    padding:2px
}
.item-1BCeuB {
    font-weight:400;
    padding:4px;
    border-radius:0
}
.item-1BCeuB:hover:not(.disabled-Mmpvl7) {
    background:rgb(25,55,84)
}
/*user settings mneu*/
.side-2ur1Qk .item-3XjbnG, .side-2ur1Qk .item-3XjbnG:hover {
    color:rgb(178 186 196);
    border-radius:0;
    margin:0;
    padding:5px 6px;
    font:400 16px arial;
    background:none;
    line-height:1;
    cursor:default;
    letter-spacing:0
}
.side-2ur1Qk .themed-2-lozF.item-3XjbnG:hover:not(.disabled-1nofHP), .topPill-3DJJNV .themed-2-lozF.item-3XjbnG:hover:not(.disabled-1nofHP) {
    background:none
}
.side-2ur1Qk .themed-2-lozF.selected-g-kMVV.item-3XjbnG, .topPill-3DJJNV .themed-2-lozF.selected-g-kMVV.item-3XjbnG {
    background:rgb(25,55,84)!important;
    color:#fff
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .sidebar-nqHbhN {
    background:linear-gradient(rgb(22,29,42) 24px, rgb(40,44,49) 48px, rgb(38,42,46) 163px, rgb(24,27,30) 500px);
    height:100%
}
.side-2ur1Qk .header-2Kx1US {
    background:linear-gradient(90deg,rgb(50,54,60),rgb(29,35,46));
    padding:0 6px;
    letter-spacing:0
}
.side-2ur1Qk .separator-2wx7h6 {
    opacity:0;
    margin:4px 0
}
.textBadge-1fdDPJ {
    background:none!important;
    color:rgb(178 186 196)
}
.sidebarRegionScroller-FXiQOh {
    padding:0;
    scrollbar-width:0;
    border-top:1px solid #000;
    margin-left:10px
}
.sidebarRegionScroller-FXiQOh::-webkit-scrollbar {
    width:0
}
.sidebarRegionScroller-FXiQOh {
    background:none
}
.sidebarRegion-1VBisG {
    background:linear-gradient(rgb(33,41,52),rgb(42,46,51) 54px);
    flex:1 0 195px;
    border-radius:0;
    padding-top:32px;
    padding-bottom:10px
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .contentColumnDefault-3eyv5o .sectionTitle-3j2YI1 h2, .h3-2Gh4ka.title-3hptVQ, h3.h1-34Txb0 { /*section titles*/
    font:400 11px arial;
    color:rgb(202 208 220);
    text-transform:none;
    margin-bottom:8px
}
.description-30xx7u {
    font:400 11px arial
}
.eyebrow-I4BG42 {
    text-transform:none;
    letter-spacing:0;
    font:400 11px arial;
    color:rgb(202 208 220);
}
.marginTop40-Q4o1tS {
    margin-top:20px
}
.marginBottom40-fvAlAV {
    margin-bottom:20px
}
.marginBottom20-315RVT {
    margin-bottom:8px
}
.dependentSetting-2ewJ4W {
    padding:unset
}
.title-2dsDLn:has(.dependentSetting-2ewJ4W) ~ .control-1fl03- {
    margin-left:20px
}
/*checkbox*/
.labelRow-2jl9gK {
    flex-direction:row-reverse
}
.labelRow-2jl9gK ~ .note-2C4pGr {
    position:absolute;
    margin:0 46px;
    margin-top:18px;
    background:rgb(56,60,68);
    padding:4px;
    font-size:10px;
    opacity:0;
}
.labelRow-2jl9gK ~ .note-2C4pGr ~ .dividerDefault-3C2-ws {
    display:none
}
.labelRow-2jl9gK ~ .divider-_0um2u.dividerDefault-3C2-ws {
    display:none
}
.container-1zDvAE.marginTop8-24uXGp.marginBottom20-315RVT {
    margin-top:0;
    margin-bottom:20px
}
.container-1zDvAE:hover .labelRow-2jl9gK ~ .note-2C4pGr {
    opacity:1
}
.control-1fl03- {
    margin-right:9px
}
.title-2dsDLn {
    font:400 11px arial;
    line-height:15px;
    color:rgb(168,172,179)
}
.input-2XRLou {
    border-radius:0;
    position:static;
}
.container-2nx-BQ svg {
    display:none
}
.container-2nx-BQ {
    border-radius:0;
    width:15px;
    height:15px;
    background-color:transparent!important;
    background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVChTY0xLS2MgGoBUnzx7GcrDC8yNdZmgTEZCCAzAqmEcfACsBmY2cWBUNSYYPKpJSYMMDAAWcga/GW5cOwAAAABJRU5ErkJggg==')
    
}
.container-2nx-BQ.checked-25WXMf {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACdSURBVChTY0gjBYBU6xtbEoPIU21iiR/19E8EkoRV2zi67j9wEIiAbITqlIyciJgEuCIIAio9c/bcx48fsah+8uQpsgYvv6AbN28BlWJXDRQFSgMVoSkFAqAsFtVAALQaYg+EC2RAlKKoBiKIE5EBmttQVMP9BAFwV8ERimoggjsXUykQoasGIqDVwBAA2oMsCEFYVONBUNXEgrQ0ALIMAwyjuS0PAAAAAElFTkSuQmCC')
}
/*huge radio*/
.radioBar-3w9XY-.radioPositionLeft-28JJUE {
    border:0;
    background:none;
    padding:0!important;
    gap:4px
}
.itemFilled-1cPbtg, .itemFilled-1cPbtg:hover:not([aria-checked=true]):not(.disabled-3tqE8r) {
    background:none
}
.text-md-medium-2avxhQ {
    font:400 11px arial;
    color:rgb(168,172,179)
}
.text-md-medium-2avxhQ ~ .text-sm-normal-3Zj3Iv {
    font:400 10px arial;
    color:rgb(148,152,159);
    padding-left:4px
}
.itemFilled-1cPbtg[aria-checked=true] {
    background:none
}
.radioBar-3w9XY-.radioPositionLeft-28JJUE svg {
    transform:scale(.8);
    margin-left:-5px
}
/*slider*/
.grabber-2GQyvM {
    background:rgb(168,172,179);
    border:0;
    border-radius:0;
    width:8px;
    height:16px;
    margin-top:-8px;
    margin-left:-4px
}
.barFill-2Bh7CX {
    background:none
}
.theme-dark .bar-1Bhnl9 {
    background: repeating-linear-gradient(90deg,rgb(200,208,220), rgb(200,208,220) 1px, transparent 1px, transparent 9px);
    border-radius:0
}
/*write box, copy box*/
.copyInputDefault-3jiMHw.copyInput-3AbKWB {
    border:0;
    background:none;
    border-radius:0;
    height:25px
}
.input-2g-os5, .input-2g-os5:hover, .copyInputDefault-3jiMHw.copyInput-3AbKWB input {
    border:1px solid rgb(75,84,102);
    background:none;
    border-radius:0;
    padding:2px 6px;
    font-size:13px;
    min-height:25px;
    height:auto;
    line-height:16px;
    color:rgb(200,208,220)
}
.input-2g-os5:focus-within, .input-2g-os5:focus, .copyInputDefault-3jiMHw.copyInput-3AbKWB:focus-within input {
    border-color:rgb(125,133,148)
}
.noticeRegion-qjyUVg {
    padding:0;
    right:0;
    max-width:none
}
.noticeRegion-qjyUVg > .container-20TyK0 {
    border-radius:0;
    box-shadow:none;
    background:rgb(42,46,51)!important
}
.noticeRegion-qjyUVg > .container-20TyK0[style^="background-color: rgb(21"], .noticeRegion-qjyUVg > .container-20TyK0[style^="background-color: rgb(22"], .noticeRegion-qjyUVg > .container-20TyK0[style^="background-color: rgb(23"] {
    background:red!important
}
/*server boost*/
#nitro-server-boost-tab .divider-1wnNcY{
    display:none
}
#nitro-server-boost-tab .heading-lg-bold-3uwrwG, #nitro-server-boost-tab .heading-lg-semibold-2Z_RS3, #nitro-server-boost-tab .text-md-medium-2avxhQ, #nitro-server-boost-tab .text-md-normal-304U3g, .feature-LzXyUM div {
    font:400 11px arial
}
/*notifications*/
#notifications-tab .children-1xdcWE .children-1xdcWE {
    display:grid;
    grid-template-columns:33% 33% 33%;
}
#notifications-tab .children-1xdcWE .children-1xdcWE > div:not(.soundRow-2Vsfbg) {
    grid-column:1/4
}
#notifications-tab .children-1xdcWE .children-1xdcWE > div {
    margin-bottom:10px
}
#notifications-tab .children-1xdcWE .children-1xdcWE > div.soundRow-2Vsfbg {
    margin-bottom:2px
}
/*individual headers*/

#my-account-tab > div > div:first-child > div h2, /*my account*/
#profile-customization-tab >h2, /*profile*/ 
#app-mount .layer-86YKbF ~ .layer-86YKbF .contentColumnDefault-3eyv5o > div > div > h2,
.contentRegionScroller-2_GT_N.customScroller-m1-jZn > .content-2a4AW9 > div:nth-child(2) > h2, /*roles*/
.emojiUploadContainer-1tS7L7 ~ div > div:first-child h2 /*emoji*/
{ 
    position:fixed;
    height:33px;
    background: linear-gradient(rgb(33,41,52),rgb(42,46,51) 54px);
    margin-top:-38px;
    margin-left:-205px;
    z-index:4;
    width:950px;
    border-bottom:1px solid #000;
    line-height:32px!important;
    color:rgb(213,217,234)!important;
    font-size:11px
}
.contentColumnWide-2CgNjO {
    padding:38px 20px 20px 20px
}
.contentRegionScroller-2_GT_N.customScroller-m1-jZn > .content-2a4AW9 { /*roles menu*/
    margin-left:20px;
    margin-right:20px;
    max-width:none
}
.contentRegionScroller-2_GT_N.customScroller-m1-jZn > .content-2a4AW9 > div:nth-child(2) > h2 { /*role*/
    margin-top:-60px
}
#keybinds-tab .marginTop60-38vAjL h2 {
    display:none
}
/*server settings:*/
.settingCard-xZSDjS { /*over emphasized box*/
    border-radius:0;
    background:none
}
.settingCard-xZSDjS .cardContent-1-5hym {
    padding:0
}
.lookFilled-1GseHa.select-1Ia3hD .text-md-normal-304U3g, .popout-1KHNAq .text-md-normal-304U3g, .popout-1KHNAq .subtitle-2SfoOV {
    font-size:inherit
}
.avatarUploader-2S1mwW .avatarUploaderInner-1Cp1oP {
    border-radius:0;
    box-shadow:none
}
.children-1xdcWE .divider--oiTeJ {
    padding-top:12px;
    margin-top:12px
}
/*roles inner page*/
.row-LoqnA5 .text-sm-medium-3Pz3rB {
    color:inherit!important
}
.titleContainer-3fPic2 {
    padding:4px;
    background: linear-gradient(rgb(33,41,52),rgb(42,46,51) 54px);
    margin:0;
    overflow:visible
}
.titleContainer-3fPic2 .text-md-semibold-3xVVGu {
    font:400 11px arial
}
.contentWidth-3aWel5 {
    padding:0 24px;
    margin:0;
    max-width:none;
    width:auto;
}
.scroller-39BnzZ, .scroller-14hecM {
    background:linear-gradient(rgb(36,37,40) 79px, rgb(42,46,51) 79px,rgb(32,35,39) 155px)
}
.header-JUTO-g {
    background:rgb(36,37,40) 
}
.contentWidth-3aWel5 .searchContainer-2kJ46v {
    width:200px;
    margin-left:auto;
    margin-top:-32px;
}
.contentWidth-3aWel5 .noticeContainer-3aVs4G:empty {
    display:none;
    margin:0
}
.searchContainer-2kJ46v .container-2oNtJn {
    border-radius:0;
    background:rgb(42,46,51)
}
.searchContainer-2kJ46v .input-2m5SfJ {
    font:400 14px arial;
    height:24px;
}
.medium-2NClDM.iconLayout-3Bjizv {
    height:24px;
    width:24px;
}
.searchContainer-2kJ46v .inner-2pOSmK {
    flex-direction:row-reverse
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .sidebar-3K3Z4C {
    border:0;
    max-width:210px;
    flex:auto!important;
    border-bottom:10px solid rgb(42,46,51);
}
.list-1AJFv_ {
    background: linear-gradient(rgb(22,29,42) 24px, rgb(40,44,49) 48px, rgb(38,42,46) 163px, rgb(24,27,30) 500px);
    border-left:8px solid rgb(42,46,51);
    border-right:8px solid rgb(42,46,51)
}
.row-LoqnA5 {
    height:auto
}
.lock-4DarK4 {
    height:15px
}
.row-LoqnA5 .text-sm-medium-3Pz3rB {
    line-height:15px;
    font-weight:400
}
.contentContainer-3hXFtK {
    left:210px
}
.contentContainer-3hXFtK .modeDefault-2fEh7a {
    font:400 11px arial;
    color:rgb(168,172,179)
}
.list-1AJFv_ {
    padding:0!important
}
.list-1AJFv_::-webkit-scrollbar-track {
    background:none
}
.stickyHeader-1Sunlx {
    padding:0;
    margin-left:-24px;
    margin-right:-24px
}
.stickyHeader-1Sunlx .titleContainer-16mFj2 {
    padding:4px 10px;
    background: linear-gradient(rgb(33,41,52),rgb(42,46,51) 54px);
    font:400 11px arial;
}
.stickyHeader-1Sunlx .titleContainer-16mFj2 .text-md-semibold-3xVVGu {
    font-size:11px;
    text-transform:none;
    vertical-align:middle;
    line-height:24px;
    height:auto
}
.tabBar-3DfKkN {
    border-bottom:1px solid rgb(76,84,93)
}
.tabBarItem-3nPo4Z {
    background:linear-gradient(rgb(50,55,61) 20px, transparent 20px);
    margin-right:2px;
    padding-left:6px;
    padding-right:14px;
    padding-bottom:5px;
    font-size:10px;
    text-transform:uppercase;
    border-bottom:0!important;
    margin-bottom:-3px;
    line-height:22px;
    height:25px
}
.tabBarItem-3nPo4Z:hover {
    background:linear-gradient(rgb(81,88,100) 20px, transparent 20px);
}
.selected-g-kMVV.item-3XjbnG {
    background:linear-gradient(rgb(76,84,93),rgb(59,65,72),rgb(42,46,51))
}
.contentContainer-3hXFtK .divider-5Xhahz {
    display:none
}
.colorPickerSwatch-RTUGRR.custom-1Up2lr, .colorPickerSwatch-RTUGRR.default-3ISV7m, .colorPickerSwatch-RTUGRR {
    border-radius:0
}
.contentContainer-3hXFtK .previewContainer-1GxmBJ {
    width:24px;
    height:24px;
    border-radius:0;
    min-width:0
}
.container-1JgYx7 h2, .container-1JgYx7 > div { /*view server as role*/
    display:none
}
.permissionsForm-xrzuUy {
    display:grid;
    grid-template-columns:33% 33% 33%
}
.permissionsForm-xrzuUy h2 {
    grid-column:1/4
}
/*emoji*/
.content-17YpH6 {
    background:linear-gradient(rgb(41,45,50),rgb(22,25,28) 95px)
}
.content-17YpH6 .emojiTable-17v9Y6 {
    background:rgb(50,55,61);
    height:20px;
    line-height:20px;
    align-items:center;
}
.content-17YpH6 .emojiTable-17v9Y6 .description-30xx7u {
    line-height:normal;
    padding-left:5px;
    border-left:1px solid rgb(42,46,51)
}
.card-2ART2V:before {
    content:none
}
.emojiRow-1aPaM- {
    height:auto;
    box-shadow:none!important
}
.emojiRow-1aPaM- .column-2uxjpN, .emojiRow-1aPaM- .emojiColumn-2P3Fj1 {
    margin-left:4px
}
.emojiRow-1aPaM- .emojiAliasPlaceholder-3oShSx {
    font-size:13px;
    padding-top:4px;
    padding-left:7px
}
.content-17YpH6 .emojiTable-17v9Y6 .description-30xx7u:first-child {
    border-color:transparent
}
/*standard modal*/
.root-g14mjS.small-23Atuv {
    background:linear-gradient(rgb(33,41,52),rgb(42,46,51) 55px);
    border-radius:0;
    border:1px solid rgb(33,41,53);
    border-color:rgb(33,41,53), rgb(22,41,63), rgb(18,27,44), rgb(22,41,63)
}
.root-g14mjS.small-23Atuv .header-1zd7se {
    padding:10px;
    align-items:start
}
.subtitle-3m-md1, .title-1_TkpU {
    text-align:left;
}
.root-g14mjS.small-23Atuv .header-1zd7se h1 {
    font:400 11px arial;
    color:rgb(213,217,234);
    margin:0
}
.root-g14mjS.small-23Atuv .content-2hZxGK {
    padding:0 16px 4px 16px;
    background:linear-gradient(transparent,rgb(50,55,61));
    margin:0 8px
}
.root-g14mjS.small-23Atuv .footerSeparator-VzAYwb {
    background:none;
    padding:12px 8px 11px
}
.root-g14mjS.small-23Atuv .spacing-2kYqCu, .root-g14mjS.small-23Atuv .description-2pRfjZ { /*reg text*/
    font:400 11px arial;
    color:rgb(168,172,179)
}
.root-g14mjS.small-23Atuv .thin-31rlnD::-webkit-scrollbar-track {
    background:none
}
.block-3Xiiq7 .pro-3GwLMX, .block-3Xiiq7 .tip-Jl__cG, .tip-Jl__cG {
    font-size:11px
}
.closeButton-2ygCkj, .closeButton-15_aIJ, .closeButton-1diDVp {
    color:#fff;
    padding:0;
    top:7px;
    right:7px;
    height:14px
}
.closeButton-2ygCkj:hover, .closeButton-15_aIJ:hover, .closeButton-1diDVp:hover {
    color:#fff;
}
.closeButton-2ygCkj svg, .closeButton-15_aIJ svg, .closeButton-1diDVp svg {
    width:14px;
    height:14px
}
.lookLink-15mFoz.colorLink-1Md3RZ .contents-3ca1mk {
    color:rgb(168,172,179);
    text-decoration:underline;
    font-size:11px
}
/*server create*/
.theme-light .small-23Atuv .container-x8Y1ix {
    background:rgb(27,44,61);
    border:0;
    padding:0;
    border-radius:0;
    margin:10px;
    text-align:center;
    width:auto;
    justify-content:center;
    height:40px;
    text-transform:uppercase
}
.theme-light .small-23Atuv .templatesList-uohY49 .container-x8Y1ix:first-of-type, .templatesList-uohY49 ~ div .sizeMedium-2bFIHr.grow-2sR_-F {
    background:rgb(61,146,175)
}
.theme-light .small-23Atuv .optionHeader-27AHfD {
    display:none
}
.theme-light .input-2g-os5 {
    color:#fff
}
.templatesList-uohY49 {
    display:grid;
    grid-template-columns:50% 50%
}
.theme-light .root-g14mjS.small-23Atuv .subtitle-3m-md1, .theme-light .root-g14mjS.small-23Atuv .text-PdAsFQ {
    font:400 11px arial;
    color:#fff;
    padding:0 10px
}
.theme-light .root-g14mjS.small-23Atuv .text-md-normal-304U3g {
    font:400 11px arial;
}
.theme-light .root-g14mjS.small-23Atuv img {
    display:none
}
.theme-light .templatesList-uohY49 ~ .footerSeparator-VzAYwb {
    box-shadow:none
}
.theme-light .templatesList-uohY49 ~ .footerSeparator-VzAYwb h2 {
    color:#fff;
    font-weight:400;
    font-size:12px
}
.theme-light .root-g14mjS.small-23Atuv .content-2hZxGK .rowContainer-3t7486 {
    display:none
}
/*pin*/
.messageGroupWrapper-1jf_7C {
    background:none;
    border-radius:0;
    border:0
}
/*thread sidebar*/
.resizeHandle-PBRzPC {
    background:linear-gradient(rgb(29,34,50) 40px,rgb(42,46,51) 40px)
}
.container-3XgAHv {
    border-radius:0;
    background:rgb(42,46,51)
}
.channelTextArea-3TZH74 {
    margin-bottom:12px;
}
.scroller-oTbAWP {
    background:rgb(28,32,36)
}
.container-1RZJZM .toolbar-3_r2xA {
    position:absolute;
    left:90px;
    top:16px;
    opacity:0
}
/*sticker popup*/
.contentWrapper-3vHNP2 {
    background:linear-gradient(rgb(56,60,68),rgb(42,46,51));
    border-radius:0;
    box-shadow:none;
}
.navButton-1XuvI- {
    border-radius:0
}
.positionLayer-1cndvf.theme-dark.layer-2aCOJ3 {
    bottom:68px!important
}
.header-uVCAlo, .emojiPickerInExpressionPicker-2nOwH8 .header-11eigE {
    padding:0 9px;
    border-radius:0;
    box-shadow:none;
    padding-bottom:4px
}
.categoryListWithSearch-2jrzH6, .emojiPickerInExpressionPicker-2nOwH8 .categoryList-2qRrlj {
    top:29px;
    border:0
}
.emojiItem-277VFM.emojiItemSelected-2Lg50V {
    background:none
}
.container-1SX9VC {
    border-radius:0;
    height:26px;
    overflow:hidden;
    background:rgb(40,46,54)
}
.sticker-H2HhJD {
    border-radius:0
}
#emoji-picker-tab-panel .medium-13kyaW .input-2FSSDe, #emoji-picker-tab-panel .medium-13kyaW .tag-15zcD_ {
    line-height:24px;
    height:24px;
    font-size:14px
}
#emoji-picker-tab-panel .medium-13kyaW.iconLayout-SqV3nb {
    height:24px;
    width:24px
}
#emoji-picker-tab-panel .inner-1NoIT5 {
    padding:0 0 0 1px;
    overflow:hidden!important
}
#emoji-picker-tab-panel .text-md-semibold-3xVVGu {
    text-transform:none;
}
.wrapper-1NNaWG {
    background:linear-gradient(90deg, rgb(50 55 61),transparent);
    height:20px
}
.emojiItem-277VFM {
    background:none;
    border-radius:0
}
.stickerCategory-2f6iSo {
    border-radius:0
}
.stickerCategory-2f6iSo foreignObject, .assetWrapper-2hzITV, .assetWrapperMasked-1iw9lV {
    mask:none
}
.inspectedIndicator-27zwNZ, .error-3CkqkL, .loadingIndicator-3fKdTZ {
    display:none
}
/**********************section5 chat*/

.animatedContainer-2laTjx {
    overflow:visible;
    height:400px;
    background:none;
    width:600px;
    transform:none!important;
    opacity:1!important
}
.bannerImage-ubW8K-, .bannerImage-ubW8K- img {
    --height:60vh;
    width:auto;
    height:var(--height);
    opacity:.5;
    left:100px;
    top:50px;
    transform:none!important
}
.bannerImage-ubW8K-:before {
    width:8px;
    height:100%;
    background:rgba(0,0,0,.8);
    margin-left:140px;
    z-index:2
}
.base-2jDfDU {
    background:#000
}
.scroller-1ox3I2 {
    background:linear-gradient(90deg, rgba(22,25,28,1) 30%,rgba(22,25,28,.82))
}
.container-1NXEtd:after {
    content:"";
    background:linear-gradient(rgba(22,25,28,.0) 40%,rgba(22,25,28,1) 600px );
    width:100%;
    position:absolute;
    top:0;
    height:100%;
}
.chatContent-3KubbW {
    background:rgba(28,31,36,1);
    background:rgba(14,16,22,.5);
    margin-right:8px;
    margin-left:8px
}
.chat-2ZfjoI {
    background:linear-gradient(rgba(83,91,102,.5),rgba(42,46,51,1) 68%)
}
.bannerImage-ubW8K-:after {
    --height:60vh;
    content:"";
    width:55%;
    height:var(--height);
    position:absolute;
    background:linear-gradient(90deg,rgba(0,0,0,.01),rgba(0,0,0,1));
    right:-50px;
}
.theme-dark .form-3gdLxP:before {
    content:none
}
.scrollerInner-2PPAp2 > .wrapper-3HVHpV[style] {
    opacity:0
}
.form-3gdLxP {
    background:rgb(42,46,51);
    padding:0 4px
}
.scroller-1ox3I2 [style="height: 84px;"] {
    display:none
}
.channelTextArea-1FufC0, .scrollableContainer-15eg7h { /*chat box*/
    background:none;
    border-radius:0;
    margin-bottom:16px
}
.textArea-2CLwUE {
    border:1px solid rgb(112,120,136);
    min-height:40px
}
.fontSize16Padding-XoMpjI {
    font-size:13px;
    line-height:1.2;
    padding-left:6px;
    padding-right:6px;
    padding-top:3px;
    padding-bottom:1px;
    min-height:40px;
}
.attachWrapper-3slhXI {
    border:1px solid rgb(112,120,136);
    height:42px;
    margin-right:5px
}
.sansAttachButton-1ERHue {
    padding:0;
    border-radius:0;
    overflow:hidden;
    padding-top:8px
}
.attachButton-_ACFSu {
    padding-right:8px;
    padding-left:8px;
    margin:0
}
.expression-picker-chat-input-button {
    border:1px solid rgb(112,120,136);
    height:42px;
    margin-left:5px
}
.buttons-uaqb-5 > button {
    display:none
}
.root-g14mjS, .userProfileOuterThemed-3EfHmv.userProfileOuter-1K_BYU {
    background:none
}
.webkit-QgSAqd .buttons-uaqb-5 {
    margin-right:0
}
.typing-2J1mQU {
    font-size:12px;
    color:#aaa;
    line-height:1;
    height:14px
}
.imageWrapper-oMkQl4, .avatar-2e8lTP, .executedCommandAvatar-3oOnb1, .replyAvatar-sHd2sU, .replyBadge-LMm_Ic, .threadMessageAccessoryAvatar-17qE_g {
    border-radius:0
}
.cozy-VmLDNB .messageContent-2t3eCI {
    color:rgb(200,208,200)
}
.cozy-VmLDNB .timestamp-p1Df1m {
    color:#535354
}
.content-3spvdd {
    background:none
}
.wrapper-2vIMkT {
    border-radius:0;
    background:linear-gradient(rgb(56,60,68),rgb(41,45,51));
}
.wrapper-2vIMkT .button-3bklZh.selected-69H4ua {
    background:rgb(41,45,51)
}
.newMessagesBar-1hF-9G {
    border-radius:0;
    left:0;
    right:0;
    background:rgb(50 55 61);
    margin:1px
}
/*freinds tab*/
.searchBar-2aylmZ {
    margin:8px;
    background:rgb(40,46,54);
    border-radius:0
}
.container-2cd8Mz[aria-label="Friends"] {
    background:#000
}
.container-2cd8Mz[aria-label="Friends"] .container-ZMc96U.themed-Hp1KC_ {
    border-bottom-color:transparent
}
.container-2cd8Mz[aria-label="Friends"] .children-3xh0VB > div:not(:last-child) {
    display:none
}
.container-2cd8Mz[aria-label="Friends"] .tabBar-ra-EuL .item-3mHhwr {
    font:400 20px arial;
    text-transform:uppercase;
    color:rgb(197 203 216)
}
.container-2cd8Mz[aria-label="Friends"] .tabBar-ra-EuL .item-3mHhwr:hover {
    text-shadow:1px -1px 5px rgb(100 110 125);
}
.container-2cd8Mz[aria-label="Friends"] .tabBar-ra-EuL .item-3mHhwr:active, .container-2cd8Mz[aria-label="Friends"] .topPill-3DJJNV.tabBar-ra-EuL .item-3mHhwr.selected-g-kMVV {
    text-shadow:1px -1px 4px white;
    color:#fff;
    background:none!important
}
.peopleListItem-u6dGxF {
    background:none!important;
    border-radius:0;
    padding:0!important;
    margin:0 21px!important;
    max-height:50px;
    border:0
}
.avatar-2MSPKk ~ div .discordTag-3HiQI9, .avatar-2MSPKk ~ div .subtext-xfubwR, .avatar-2MSPKk ~ div .subtext-xfubwR .text-MPIeXO {
    font:400 12px arial;
}
.avatar-2MSPKk[aria-label*="Offline"] ~ div div, .avatar-2MSPKk[aria-label*="Offline"] ~ div span {
    color:rgb(127,127,127)
}
.peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Offline"] ~ div div, .peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Offline"] ~ div span {
    color:rgb(185,185,185)
}
.avatar-2MSPKk[aria-label*="Online"] ~ div div, .avatar-2MSPKk[aria-label*="Online"] ~ div span {
    color:rgb(144,186,58)
}
.peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Online"] ~ div div, .peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Online"] ~ div span {
    color:rgb(182,235,72)
}
.avatar-2MSPKk[aria-label*="Idle"] ~ div div, .avatar-2MSPKk[aria-label*="Idle"] ~ div span, .avatar-2MSPKk[aria-label*="Do Not Disturb"] ~ div div, .avatar-2MSPKk[aria-label*="Do Not Disturb"] ~ div span {
    color:rgb(65,153,196)
}
.peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Idle"] ~ div div, .peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Idle"] ~ div span, .peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Do Not Disturb"] ~ div div, .peopleListItem-u6dGxF:hover .avatar-2MSPKk[aria-label*="Do Not Disturb"] ~ div span {
    color:rgb(75,186,242)
}
.userInfo-2WpsYG {
    align-items:start
}
.actionButton-3-B2x- {
    background:none!important;
    width:30px;
    height:30px
}
.scroller-hE2gWq { /*active now*/
    background:#000;
    border:0
}
.scroller-hE2gWq .wrapper-2RrXDg {
    background:none;
    border:0;
    border-radius:0;
    padding:6px
}
.scroller-hE2gWq .wrapper-2RrXDg .textContent-TsKzji {
    font:400 12px arial;
    text-transform:none;
    color:rgb(143,185,59)!important
}
.scroller-hE2gWq .wrapper-2RrXDg header .textContent-TsKzji:first-of-type:after {
    content:"";
    border-color:rgb(228,227,219) transparent;
    border-width:5px 4px 0;
    border-style:solid;
    width:0;
    height:0;
    margin-left:6px
}
.scroller-hE2gWq .wrapper-2RrXDg .header-3jUeHi {
    align-items:start
}
.theme-dark .inset-SbsSFp, .section-3G9aLW {
    background:none;
    border-radius:0
}
.inset-SbsSFp .section-3G9aLW {
    padding:0
}
.inset-SbsSFp .activitySection-20iylG, .inset-SbsSFp .activitySection-20iylG div {
    display:inline-block;
    margin-right:6px;
    white-space:nowrap;
}
.inset-SbsSFp .activitySection-20iylG .activitySectionAssets-1wpe42 {
    display:none
}
.theme-dark .inset-SbsSFp.body-16rSsp {
    margin-top:-7px;
    margin-left:44px;
    max-width:300px;
    overflow:hidden;
    text-overflow:ellipsis
}
h2.header-Imy05m {
    background:linear-gradient(90deg, rgb(50 55 61),transparent);
    height:19px;
    margin-bottom:1px;
    padding-left:6px;
    cursor:default;
    font:400 10px arial;
    text-transform:uppercase;
    line-height:19px
}

/**************************************SECTION6 user profile*/
.root-2uUafN, .userProfileOuterThemed-3EfHmv.userProfileOuter-1K_BYU {
    border-radius:0;
    padding:0
}
.userProfileModalInner-3fh3QA:before {
    content:none
}

.header-1_vWwx {
    position:absolute;
    top:0;
    width:100%;
}
.userProfileInnerThemedWithBanner-2624Yx .avatar-1YsFQ1 {
    top:20px;
    width:160px!important;
    height:160px!important;
}
.userProfileInnerThemedWithBanner-2624Yx .avatar-1YsFQ1 > svg {
    width:164px!important;
    height:190px!important;
}
.userProfileInnerThemedWithBanner-2624Yx, .overlayBackground-1KgwVi {
    margin:0;
    border-radius:0;
    overflow:visible
}
.body-_QAKrE, .roundedBanner-TdlJGa {
    border-radius:0
}
.userProfileInnerThemedWithBanner-2624Yx .container-1U-qVy {
    position:absolute;
    top:-196px;
    z-index:4;
    left:166px
}
.container-1U-qVy .nameTag-2ysfG3 {
    line-height: 40px;
    font-size: 24px;
    font-family: 'Motiva Sans Thin',Arial,Helvetica,Verdana,sans-serif;
}
.topSection-1Khgkv {
    margin:0;
    max-height:212px
}
.bannerSVGWrapper-qc0szY circle {
    display:none
}
.badgeList-2pMvZX {
    flex-direction:row;
    background:none;
    border-radius:0;
    padding:0;
    flex-wrap:nowrap
}
.userProfileInnerThemedWithBanner-2624Yx .headerTop-212g15 {
    left:auto;
    right:0;
    top:150px
}

.tabBarContainer-2UG0vy {
    margin:0 8px
}
.tabBar-2StdUa {
    gap:2px;
    margin-top:4px
}
.tabBarContainer-2UG0vy .tabBarItem-3VvT2z.item-3XjbnG {
    background:linear-gradient(var(--profile-role-pill-background-color) 20px, transparent 20px);
    border:0;
    height:23px;
    margin-bottom:-1px;
    font:400 11px arial;
    text-transform:uppercase;
    line-height:20px;
    padding:0 14px 0 6px
}
.tabBarContainer-2UG0vy .selected-g-kMVV.item-3XjbnG {
    background:linear-gradient(var(--profile-body-background-hover),var(--profile-body-background-color));
    z-index:2
}
.infoScroller-3MqKC5, .listScroller-XCVa1H {
    margin:0 8px;
    background:var(--profile-body-background-color);
    width:auto
}
.userInfoSection-1gptv0 > h1:first-child, .scroller-1jBQYo .section-3FmfOT:first-child h2:first-child {
    display:none
}
.userInfoText-3GOMzH .text-sm-normal-3Zj3Iv, .lineClamp2Plus-2SCQmH {
    font:400 13px arial;
    color:#8F98A0
}
.userInfoSectionHeader-48g5Qj, .userPopoutOverlayBackground-dKOOda .title-1r9MQ6, .userPopoutOverlayBackground-dKOOda .headerText-3g1XK9 {
    border-radius: 3px;
    background-color: #141414;
    font-size: 20px;
    font-family: 'Motiva Sans Thin',Arial,Helvetica,Verdana,sans-serif;
    padding:6px 10px;
    line-height:26px;
    color:#8F98A0;
    text-transform:none;
    font-weight:200
}
.theme-light .userInfoSectionHeader-48g5Qj, .theme-light .userPopoutOverlayBackground-dKOOda .title-1r9MQ6, .theme-light .userPopoutOverlayBackground-dKOOda .headerText-3g1XK9  {
    background-color:#ddd
}
.memberSinceContainer-3biwiY, .note-3TX9O7 textarea.input-2g-os5, .userPopoutInner-1hXSeY .input-2g-os5, .userPopoutInner-1hXSeY .input-2g-os5:hover, .connectedAccountContainer-2TWiXT, .root-jbEB5E {
    padding:8px 10px;
    background-color: #141414;
    border-radius: 5px;
    margin-bottom:6px;
    font-size:13px;
    line-height:normal;
    border:0;
    color:#fff
}
.theme-light .memberSinceContainer-3biwiY, .theme-light .note-3TX9O7 textarea, .theme-light .input-2g-os5, .theme-light .input-2g-os5:hover, .theme-light .connectedAccountContainer-2TWiXT, .theme-light .root-jbEB5E {
    background-color:#ddd
}
.note-3TX9O7 {
    margin:0
}
.userPopoutInner-1hXSeY:before {
    right:0;
    width:100%
}
/*small profile premium*/
.rolePillBorder-RiRiuN {
    border-radius:0
}
.profileBadges-31rDHI {
    top:1px;
    background:none
}
.userProfileInnerThemedWithBanner-2624Yx .profileBadges-31rDHI {
    background:none;
    position:absolute;
    top:80px
}
.userProfileInnerThemedWithBanner-2624Yx  .avatarPositionPremiumBanner-2nq2Fy {
    top:20px
}
.userProfileInnerThemedWithBanner-2624Yx  .usernameSection-2d814A {
    position:absolute;
    top:-116px;
    left:100px
}
.nickname-2rimyL {
    padding-right:0
}
.divider-1gzPrC {
    display:none
}
/*small profile poor*/
.userProfileInnerThemedNonPremium-1gT-zY {
        background: url(http://steamcommunity-a.akamaihd.net/public/images/profile/profile_content_bg.png);
    background-position: center;
    background-repeat: repeat-y;
}
.userProfileInnerThemedNonPremium-1gT-zY .bannerSVGWrapper-qc0szY {
    background:url(https://steamcommunity-a.akamaihd.net/public/images/profile/profile_header_bg_texture.jpg) center 0;
    border-radius:0;
    height:120px
}
.userProfileInnerThemedNonPremium-1gT-zY .bannerSVGWrapper-qc0szY foreignObject {
    display:none
}
.userProfileInnerThemedNonPremium-1gT-zY .profileBadges-31rDHI {
    position:absolute;
    top:85px
}
.userProfileInnerThemedNonPremium-1gT-zY .avatarPositionNormal-V4Mjtq {
    top:20px
}

.userProfileInnerThemedNonPremium-1gT-zY .overlayBackground-1KgwVi {
    background:none
}
.usernameSection-2d814A {
    position:absolute;
    top:-96px;
    left:100px;
    min-height:54px;
}
.nickname-2rimyL {
    font-weight:300
}
.userProfileInnerThemedNonPremium-1gT-zY .avatar-1YsFQ1 {
    top:00px
}


/*radial status*/

#app-mount .wrapper-1VLyxH {
  border-radius: var(--rs-avatar-shape);
}
#app-mount .wrapper-1VLyxH svg:not(:root) {
  overflow: visible;
}
#app-mount .wrapper-1VLyxH foreignObject {
  -webkit-mask: none;
          mask: none;
}
#app-mount .wrapper-1VLyxH .dots-1BwzZQ circle {
  cy: -8 !important;
}
#app-mount .wrapper-1VLyxH .dots-1BwzZQ circle:nth-child(1) {
  cx: -8.5 !important;
}
#app-mount .wrapper-1VLyxH .dots-1BwzZQ circle:nth-child(2) {
  cx: -2.25 !important;
}
#app-mount .wrapper-1VLyxH .dots-1BwzZQ circle:nth-child(3) {
  cx: 4 !important;
}
#app-mount .wrapper-1VLyxH .mask-1FEkla > rect[x="22"] {
  x: 0;
  y: 0;
}
#app-mount .wrapper-1VLyxH .mask-1FEkla > circle {
  opacity: 0 !important;
  width: 100%;
  height: 100%;
  cx: 43%;
  cy: 20;
}
#app-mount .wrapper-1VLyxH .pointerEvents-9SZWKj[x="14.5"] {
  fill: rgba(0, 0, 0, 0.5) !important;
  width: 30px;
  height: 30px;
  x: 1;
  y: 1;
}
#app-mount .wrapper-1VLyxH img, #app-mount .wrapper-1VLyxH.avatar-AvHqJA {
  border-radius: var(--rs-avatar-shape);
}
#app-mount .wrapper-1VLyxH svg[width="25"][height="15"] > rect {
  rx: calc(var(--rs-avatar-shape) * 2) !important;
  ry: calc(var(--rs-avatar-shape) * 2) !important;
}
#app-mount .wrapper-1VLyxH[style*="80px"] svg.cursorDefault--wfhy5 rect, #app-mount .wrapper-1VLyxH[style*="120px"] svg.cursorDefault--wfhy5 rect {
  ry: calc(var(--rs-avatar-shape) * 3.3);
  rx: calc(var(--rs-avatar-shape) * 3.3);
}
#app-mount .wrapper-1VLyxH rect {
  x: 0;
  y: 0;
  width: 100%;
  height: 100%;
  -webkit-mask: none;
          mask: none;
  display: block;
  rx: var(--rs-avatar-shape);
  ry: var(--rs-avatar-shape);
  fill: transparent !important;
  stroke-width: var(--rs-small-width);
}
#app-mount .wrapper-1VLyxH rect[fill="#43b581"], #app-mount .wrapper-1VLyxH rect[fill="#3ba55c"], #app-mount .wrapper-1VLyxH rect[fill="rgba(67, 181, 129, 1)"], #app-mount .wrapper-1VLyxH rect[mask*=online], #app-mount .wrapper-1VLyxH rect[fill*="hsl(139"], #app-mount .wrapper-1VLyxH rect[fill*="var(--status-green"] {
  stroke: var(--rs-online-color);
}
#app-mount .wrapper-1VLyxH rect[fill="#faa61a"], #app-mount .wrapper-1VLyxH rect[fill="rgba(250, 166, 26, 1)"], #app-mount .wrapper-1VLyxH rect[mask*=idle], #app-mount .wrapper-1VLyxH rect[fill*="hsl(38"], #app-mount .wrapper-1VLyxH rect[fill*="var(--status-yellow"] {
  stroke: var(--rs-idle-color);
}
#app-mount .wrapper-1VLyxH rect[fill="#f04747"], #app-mount .wrapper-1VLyxH rect[fill="rgba(240, 71, 71, 1)"], #app-mount .wrapper-1VLyxH rect[fill="#ed4245"], #app-mount .wrapper-1VLyxH rect[mask*=dnd], #app-mount .wrapper-1VLyxH rect[fill*="hsl(359"], #app-mount .wrapper-1VLyxH rect[fill*="var(--status-red"] {
  stroke: var(--rs-dnd-color);
}
#app-mount .wrapper-1VLyxH rect[fill="#593695"], #app-mount .wrapper-1VLyxH rect[mask*=streaming], #app-mount .wrapper-1VLyxH rect[fill*="var(--status-purple"] {
  stroke: var(--rs-streaming-color);
}
#app-mount .wrapper-1VLyxH rect[fill="#747f8d"], #app-mount .wrapper-1VLyxH rect[mask*=offline], #app-mount .wrapper-1VLyxH rect[fill=NaN] {
  stroke: var(--rs-offline-color);
}
#app-mount .wrapper-1VLyxH rect[fill="#747f8d"], #app-mount .wrapper-1VLyxH rect[mask*=invisible], #app-mount .wrapper-1VLyxH rect[fill="rgba(116, 127, 141, 1)"], #app-mount .wrapper-1VLyxH rect[fill*="hsl(214"], #app-mount .wrapper-1VLyxH rect[fill="var(--status-grey-500)"] {
  stroke: var(--rs-invisible-color);
}
#app-mount .wrapper-1VLyxH rect[x="16"] {
  width: 24px;
  height: 24px;
}
#app-mount .wrapper-1VLyxH rect[x="28"] {
  width: 40px;
  height: 40px;
  overflow: visible;
}
#app-mount .wrapper-1VLyxH[style*="32px"] rect {
  width: 32px;
  height: 32px;
  x: -14.5;
  y: -17;
  position: relative;
  z-index: 0;
}
#app-mount .wrapper-1VLyxH[style*="40px"] > svg > svg rect {
  width: 40px;
  height: 40px;
  x: -19;
  y: -20;
  ry: calc(var(--rs-avatar-shape) * 3.3);
  rx: calc(var(--rs-avatar-shape) * 3.3);
}
#app-mount .wrapper-1VLyxH[style*="40px"] foreignObject[mask*=mobile] img {
  width: calc(100% - 12px);
}
#app-mount .wrapper-1VLyxH[style*="80px"] svg.cursorDefault--wfhy5 rect {
  x: -48;
  y: -52;
}
#app-mount .wrapper-1VLyxH[style*="80px"] rect {
  width: 80px;
  height: 80px;
  stroke-width: var(--rs-medium-width);
}
#app-mount .wrapper-1VLyxH[style*="80px"] img {
  -webkit-clip-path: inset(calc(var(--rs-medium-spacing) + 1px) calc(var(--rs-medium-spacing) + 1px) round var(--rs-avatar-shape));
          clip-path: inset(calc(var(--rs-medium-spacing) + 1px) calc(var(--rs-medium-spacing) + 1px) round var(--rs-avatar-shape));
}
#app-mount .wrapper-1VLyxH[style*="120px"] svg.cursorDefault--wfhy5 rect {
  x: -70;
  y: -76;
}
#app-mount .wrapper-1VLyxH[style*="120px"] rect {
  width: 120px;
  height: 120px;
  stroke-width: var(--rs-large-width);
}
#app-mount .wrapper-1VLyxH[style*="120px"] img {
  -webkit-clip-path: inset(calc(var(--rs-large-spacing) + 1px) calc(var(--rs-large-spacing) + 1px) round var(--rs-avatar-shape));
          clip-path: inset(calc(var(--rs-large-spacing) + 1px) calc(var(--rs-large-spacing) + 1px) round var(--rs-avatar-shape));
}
#app-mount .wrapper-1VLyxH:not([style*="80px;"]):not([style*="120px;"]):not([style*="16px"]) > svg > foreignObject:not(:only-child) img {
  -webkit-clip-path: inset(calc(var(--rs-small-spacing) + 1px) calc(var(--rs-small-spacing) + 1px) round var(--rs-avatar-shape));
          clip-path: inset(calc(var(--rs-small-spacing) + 1px) calc(var(--rs-small-spacing) + 1px) round var(--rs-avatar-shape));
}
#app-mount .wrapper-1VLyxH[style="width: 16px; height: 16px;"] rect {
  display: none;
}
#app-mount .wrapper-1VLyxH[style="width: 16px; height: 16px;"] img {
  -webkit-clip-path: none;
          clip-path: none;
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile] {
  width: calc(100% + 4px);
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile][width="32"] img {
  width: calc(100% - 12px);
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile][width="80"] img {
  width: calc(100% - 16px);
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile][width="80"]:after {
  width: 14px;
  height: 18px;
  top: 75%;
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile][width="120"] img {
  width: calc(100% - 22px);
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile][width="120"]:after {
  width: 24px;
  height: 20px;
  top: 75%;
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile]:after {
  content: "";
  display: var(--rs-phone-visible, block);
  -webkit-mask: url('data:image/svg+xml; utf-8,<svg aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z"></path></svg>') center no-repeat;
          mask: url('data:image/svg+xml; utf-8,<svg aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z"></path></svg>') center no-repeat;
  position: absolute;
  width: 10px;
  height: 14px;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  background: var(--rs-phone-color, var(--rs-online-color));
  z-index: 1;
}
#app-mount .wrapper-1VLyxH foreignObject[mask*=mobile] + rect {
  stroke: var(--rs-phone-color, var(--rs-online-color));
}
#app-mount .avatarStack-3vfSFa {
  position: relative;
}
#app-mount .avatarSpeaking-33RRJU {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-radius: var(--rs-avatar-shape);
  box-shadow: inset 0 0 0 2px var(--rs-self-speaking-colour, #57d39b), inset 0 0 0 3px var(--background-secondary);
}
#app-mount .message-2CShn3 .wrapper-1VLyxH foreignObject[mask*=mobile] {
  width: calc(100% + 3px);
}
#app-mount .message-2CShn3 .wrapper-1VLyxH rect[mask*=typing] {
  width: calc(100% - 9px);
}
#app-mount .avatarHint-2g3Mcd foreignObject {
  -webkit-mask: none;
          mask: none;
}
#app-mount .avatarHintInner-3gk_Yx {
  border-radius: var(--rs-avatar-shape) !important;
  padding-top: 0;
  width: calc(100% - var(--rs-medium-width) - var(--rs-medium-spacing) + 2px);
  height: calc(100% - var(--rs-medium-width) - var(--rs-medium-spacing) + 2px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: relative;
}
#app-mount .memberOffline-2lN7gt img {
  -webkit-clip-path: none !important;
          clip-path: none !important;
}
#app-mount .offline-22aM7E img {
  -webkit-clip-path: none !important;
          clip-path: none !important;
}
#app-mount .avatarWrapperNonUserBot-3fzpUZ .wrapper-1VLyxH img {
  -webkit-clip-path: none !important;
          clip-path: none !important;
}
#app-mount .userInfo-2WpsYG .wrapper-1VLyxH {
  margin-top: 1px;
  margin-left: 1px;
}
:root {
  --rs-small-spacing: 0px; /* Gap between avatar and status for members list/dms | MUST end in px */
  --rs-medium-spacing: 0px; /* Gap between avatar and status for User popout | MUST end in px */
  --rs-large-spacing: 0px; /* Gap between avatar and status for User profiles | MUST end in px */

  --rs-small-width: 2px; /* Thickness of status border for members list/dms | MUST end in px */
  --rs-medium-width: 3px; /* Thickness of status border for User popout | MUST end in px */
  --rs-large-width: 4px; /* Thickness of status border for User profile | MUST end in px */

  --rs-avatar-shape: 0%; /* 50% for round - 0% for square */

  --rs-online-color: rgb(141,181,59); /* Colour for online status */
  --rs-idle-color: #faa61a; /* Colour for idle status */
  --rs-dnd-color: #f04747; /* Colour for dnd status */
  --rs-offline-color: #636b75; /* Colour for offline status */
  --rs-streaming-color: #643da7; /* Colour for streaming status */
  --rs-invisible-color: #747f8d; /* Colour for invisible status */
  --rs-phone-color: var(--rs-online-color); /* Colour of the ring and phone icon when a user is on their phone |  */

  --rs-phone-visible: block; /* Visibility of the phone icon next to a users avatar. | block = visible | none = hidden */
}



/*settings modal*/

:root {
	--settingsmodalbackground: transparent;
	--settingsmodalwidth: 960px;
	--settingsmodalheight: 80vh;
}

#app-mount .baseLayer-W6S8cY {
	opacity: 1 !important;
	transform: unset !important;
	will-change: unset !important;
}
#app-mount .stop-animations * {
	transition-property: inherit !important;
	animation: inherit !important;
}
#app-mount .layer-86YKbF.stop-animations:first-child::after {
	content: "" !important;
	position: fixed !important;
	background: rgb(0, 0, 0) !important;
	top: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	left: 0 !important;
	margin: 0 !important;
	padding: 0 !important;
	opacity: 0.85 !important;
	z-index: 999 !important;
	pointer-events: none !important;
}

#app-mount .layer-86YKbF ~ .layer-86YKbF {
	position: absolute !important;
	top: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	left: 0 !important;
	background: var(--settingsmodalbackground) !important;
	border-radius: 0px !important;
	box-shadow: var(--elevation-high) !important;
	width: var(--settingsmodalwidth) !important;
	height: var(--settingsmodalheight) !important;
	margin: auto !important;
	padding: 0 !important;
	overflow: hidden !important;
	contain: unset !important;
	z-index: 1000 !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF > div,
#app-mount .layer-86YKbF ~ .layer-86YKbF .standardSidebarView-E9Pc3j {
	position: static !important;
	border-radius: unset !important;
	width: 100% !important;
	height: 100% !important;
	margin: unset !important;
	padding: unset !important;
	overflow: hidden !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .sidebar-nqHbhN {
	width: 185px !important;
	padding:0;
    border-radius:0
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .contentColumnDefault-3eyv5o {
	padding: 38px 20px 20px 20px!important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .repoHeader-2KfNvH {
	padding-bottom: 0 !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .repoScroller-9JnAPs {
	padding-top: 0 !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .sidebar-3K3Z4C {
	height: var(--settingsmodalheight) !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .standardSidebarView-E9Pc3j .editor {
	height: calc(var(--settingsmodalheight) - 120px) !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .toolsContainer-25FL6V,
#app-mount .layer-86YKbF ~ .layer-86YKbF .toolsContainer-25FL6V .tools-kIrEGr,
#app-mount .layer-86YKbF ~ .layer-86YKbF .toolsContainer-25FL6V .container-O54IuJ,
#app-mount .layer-86YKbF ~ .layer-86YKbF .toolsContainer-25FL6V .closeButton-PCZcma {
	position: absolute !important;
	top: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	left: 0 !important;
	background: transparent !important;
	border: none !important;
	border-radius: 0 !important;
	width: 100% !important;
	max-width: unset !important;
	height: 100% !important;
	max-height: unset !important;
	margin: 0 !important;
	padding: 0 !important;
	opacity: 0 !important;
	cursor: default !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .toolsContainer-25FL6V {
	position: fixed !important;
	top: 22px !important;
	z-index: -1 !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .settingsToolbar-wu4yfQ {
	display: none !important;
}
#app-mount .layer-86YKbF ~ .layer-86YKbF .header-2Kx1US {
	max-width: calc(var(--settingsmodalwidth) - 730px) !important;
}

#app-mount .root-2zfUH6 {
	position: fixed !important;
	top: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	left: 0 !important;
	background: var(--settingsmodalbackground) !important;
	border-radius: 5px !important;
	box-shadow: var(--elevation-high) !important;
	width: var(--settingsmodalwidth) !important;
	height: var(--settingsmodalheight) !important;
	margin: auto !important;
	padding: 0 !important;
	overflow: hidden !important;
	contain: unset !important;
	z-index: 1000 !important;
}
#app-mount .root-2zfUH6.enterDone-menWZ8 {
	transform: unset !important;
}
#app-mount .perksModal-CLcR1c {
	position: static !important;
	border-radius: unset !important;
	width: 100% !important;
	height: 100% !important;
	margin: unset !important;
	padding: unset !important;
}
#app-mount .perksModal-CLcR1c::before {
	width: var(--settingsmodalwidth) !important;
	height: var(--settingsmodalheight) !important;
	margin: auto !important;
}
#app-mount .perksModalContentWrapper-3RHugb {
	padding: 10px 0 10px !important;
}
#app-mount .root-2zfUH6 .perksModal-CLcR1c .carousel-3dvee9 {
	margin-left: calc(-0.5 * (100vw - var(--settingsmodalwidth))) !important;
}
#app-mount .root-2zfUH6 .closeWrapper-1aVqeP,
#app-mount .root-2zfUH6 .closeWrapper-1aVqeP .closeContent-1uXQiy,
#app-mount .root-2zfUH6 .closeWrapper-1aVqeP .container-O54IuJ,
#app-mount .root-2zfUH6 .closeWrapper-1aVqeP .closeButton-PCZcma {
	position: absolute !important;
	top: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	left: 0 !important;
	background: transparent !important;
	border: none !important;
	border-radius: 0 !important;
	width: 100% !important;
	max-width: unset !important;
	height: 100% !important;
	max-height: unset !important;
	margin: 0 !important;
	padding: 0 !important;
	opacity: 0 !important;
	cursor: default !important;
}
#app-mount .root-2zfUH6 .closeWrapper-1aVqeP {
	position: fixed !important;
	top: 22px !important;
	z-index: -1 !important;
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
