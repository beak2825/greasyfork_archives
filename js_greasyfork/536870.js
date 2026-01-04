  // ==UserScript==
  // @name         Heimwaey Theme Fixed By ryz
  // @namespace    http://greasyfork.org/
  // @version      2.1
  // @description  A theme made by wewuwa and doc
  // @author       ryz
  // @match        https://shellshock.io/
  // @match        https://dev.shellshock.io/
  // @grant        none
  // ==/UserScript==

(function() {
  const css = document.createElement('style');

  document.body.appendChild(css).textContent = `
/*--------------DO NOT EDIT ANYTHING OR IT WILL BE UR PROBLEM--------------------------------------------------*/
  :root {
      --select-border: #777;
      --select-focus: blue;
      --select-arrow: var(--select-border);
      --ss-black: #000;
      --ss-adblocker-text: #000000;
      --ss-white: #32bf15;
      --ss-offwhite: #FFF3E4;
      --ss-yellow0: #F7FFC1;
      --ss-yellow: #FAF179;
      --ss-yolk0: #65ff60;
      --ss-yolk: var(--ss-lightoverlay);
      --ss-yolk2: var(--ss-blue4);
      --ss-red0: #000000;
      --ss-red: #3cc747;
      --ss-red2: #000000;
      --ss-egg-org: #ffffff;
      --ss-red-bright: #ffffff;
      --ss-pink: #EC008C;
      --ss-pink1: #b9006e;
      --ss-pink-light: #ff3aaf;
      --ss-pink-dark: #a7098c;
      --ss-brown: #000000
      --ss-blue00: #000;
      --ss-blue0: #9d9d9d;
      --ss-blue1: #000000;
      --ss-blue2: #000;
      --ss-blue3: #227d0f;
      --ss-blue4: #ffffff;   is teams color
      --ss-blue5: #ffffff;
      --ss-blue6: #2e2e2e;
      --ss-blue7: var(--ss-yolk2);
      --ss-blue8: #000000;
      --ss-green0: #000000;
      --ss-green1: #0e8030;
      --ss-green2: #000000;
      --ss-green-login: #a7a7a7;
      --ss-orange1: #F79520;
      --ss-vip-blue: #0E7FFF;
      --ss-vip-pink: #FF5AF5;
      --ss-vip-brown: #9F5600;
      --ss-vip-yellow: #FFFC00;
      --ss-vip-red: #EE2B2D;
      --ss-vip-purple: #40008F;
      --ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
      --ss-gold: #FED838;
      --ss-clear: rgba(255, 255, 255, 0);
      --ss-blue2clear: rgba(94, 186, 217, 0);
      --ss-blue2alpha7: rgba(94, 186, 217, .7);
      --ss-white-60: rgba(255,255,255,.6);
      --ss-white-90: rgba(255,255,255,.9);
      --ss-twitch: #ffffff00;
      --twitch-color: #6441a5;
      --twitch-yellow: var(--ss-white);
      --twitch-pink: #F00DC9;
      --twitch-dk-pink: #c00aa0;
      --twitch-lt-purple: #0000;
      --twitch-dk-purple: #40008F;
      --twitch-xtr-dk-purple: #1e0043;
      --ss-orange: #F7941D;
      --ss-brown-2: #894B00;
      --ss-vip: #FFF000;
      --ss-red-btn-fill: #ffffff;
      --ss-red-btn-outline: #000000;
      --ss-limited: #ffb3e8;
      --ss-limited-txt: #ff1bba;
      --ss-premium: #87ec4a;
      --ss-premium-txt: #204908;
      ----ss-vip: #fff000;
      --ss-vip-txt: #676000;
      --ss-darkoverlay: rgba(0, 0, 0, 0.6);
      --ss-darkoverlay2: rgba(0, 0, 0, 0.2);
      --ss-lightoverlay: url('https://i.pinimg.com/originals/c5/e0/23/c5e023959d0e977236e87523b13f6128.png');
      --ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2) );
      --ss-blueblend1: linear-gradient(#ffffff, #000000);
      --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), #0000);
      --ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #0000);
      --ss-fieldbg: linear-gradient(#000000, #000000, #ffffff, #ffffff, #ffffff);
      --ss-nugSecs: 3600s;
      --ss-me-player-bg: rgb(0, 0, 0);
  }

      --ss-team-blue-light: rgb(96, 192, 224);
      --ss-team-blue-light-trans: rgb(255 255 255 / 0%);
      --ss-team-blue-dark: rgb(255 255 255);
      --ss-team-blue-dark-trans: rgb(1 2 255 / 32%)
      --ss-team-red-light: rgb(255, 64, 48);
      --ss-team-red-light-trans: rgb(255 255 255 / 0%);
      --ss-team-red-dark: rgb(255 255 255);
      --ss-team-red-dark-trans: rgb(255 1 1 / 32%);
  }

      --ss-big-message-border-color: rgb(0, 0, 0);
      --ss-big-message-border-color: rgb(0, 0, 0);
      --ss-header-height: 10em;
      --ss-footer-height: 4em;
      --ss-main-width: 90em;
      --ss-min-width: 68em;
      --ss-space-xxxxl: calc(var(--ss-space-lg)*4);
      --ss-space-xxl: 2.3em;
      --ss-space-xl: 1.5em;
      --ss-space-lg: 1em;
      --ss-space-md: calc(var(--ss-space-lg)/2);
      --ss-space-sm: calc(var(--ss-space-md)/1.5);
      --ss-space-xs: calc(var(--ss-space-sm)/2);
      --ss-space-micro: calc(var(--ss-space-xs)/2);
      --border-radius: 0.4em;
      --ss-border-radius-sm: 0.2em;
      --ss-common-border-width: .2em;
      --ss-logo-width: calc(var(--ss-space-lg)*14);
      --ss-menu-width: calc(var(--ss-logo-width) - var(--ss-space-lg));
      --ss-main-sidebar-width: 16em;
      --ss-sidebar-width: calc(var(--ss-space-lg)*18.2);
      --ss-aside-panel-width: 20em;
      --ss-item-mask-height: calc(var(--ss-space-lg)*4);
      --ss-item-mask-width: calc(var(--ss-aside-panel-width) - 1.3em);
      --ss-item-box: calc(var(--ss-space-lg)*5.5);
      --ss-account-panel-height: calc(var(--ss-space-lg)*4);
      --ss-chat-wrapper-width: 14.5em;
      --ss--chat-height: 14.5em;
      --ss-media-social-width: 17.7em;
      --paused-ui-scale: .6;
      --paused-ui-vip-scale: .9;
      --chw-bubble-width: 9em;
      --chw-bubble-height: 3.3em;
      --home-screen-r-padding: .68em;
      --ss-box-shadow-1: .16em .16em 0 rgb(0 0 0 / 100%);
      --ss-box-shadow-2: .15em .15em 0 rgb(0 0 0 / 90%);
      --ss-box-shadow-3: .15em .15em 0 rgba(217,118,17,.9);
      --ss-text-shadow-1: .1em .1em 0 rgba(11, 147, 189,.8);
      --ss-shadow: rgba(0,0,0,.4);
      --ss-blueshadow: #00000087;
      --ss-btn-common-txt-shadow: .1em .1em 0 rgb(0 0 0 / 30%);
      --ss-btn-common-txt-shadow-blur: .1em .1em .5em rgb(0 0 0 / 30%);
      --ss-shadow-filter: drop-shadow(var(--ss-btn-common-txt-shadow));
      --ss-btn-light-bevel: inset 0 .15em .2em;
      --ss-btn-dark-bevel: inset -.1em -.15em .1em;
      --ss-border-blue5: var(--ss-common-border-width) solid var(--ss-blue5);
      --ss-type-icon-size: 2.8em;
      --ss-equip-icon-size: 4em;
      --ss-media-stats-height: 30.5em;
      --ss-alphaclear: #0000
  }

      /*--------HOME SCREEN TABS-------*/
  .load_screen {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      top: 0; left: 0;
      z-index: 20;
      width: 100%; height: 100%;
      background-image: var(--ss-lightoverlay);
      background-size: cover !important;
      background-position: centre !important;
  }
  .main-menu-button:hover .main-nav-item-bg, .current-screen .main-nav-item-bg {
      fill: var(--ss-blue8);
      stroke: var(--ss-white);
      color: var(--ss-white);
  }
  .ss_field, .firebaseui-input {
      border-radius: var(--ss-space-sm) !important;
      border: var(--ss-common-border-width) solid var(--ss-blue4) !important;
      margin: 0 0 var(--ss-space-md) 0 !important;
      padding: var(--ss-space-sm) var(--ss-space-md) !important;
      box-shadow: inset 0.3em 0.3em 0.03em rgb(0 0 0 / 50%) !important;
      background: var(--ss-white) !important;
      color: #000 !important;
      font-weight: bold !important;
      min-height: 2.45em !important;
  }
  .ss_smtab.selected, .ss_smtab:hover {
      background: #000000;
  }
  .bevel_yolk {
      box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) var(--ss-yolk2), var(--ss-btn-light-bevel) #8f0000;
  }

  /*-----------STATS-----------*/
  .stat-wrapper .stat:nth-child(even) > div {
      background-color: var(--ss-alphaclear);
  }
  .stat-wrapper .stat:nth-child(odd) > div {
      background-color: var(--ss-alphaclear);
  }


  /*------------INVENTORY-----------*/
  .weapon_img {
      box-sizing: border-box;
      background-color: #000;
      height: 4em;
      width: 4em;
      border: var(--ss-common-border-width) solid var(--ss-blue3);
      fill: var(--ss-white);
  }
  #weapon_select .weapon_selected {
      background-color: #000;
  }
  .weapon_img:hover, #weapon_select .weapon_selected {
      border: var(--ss-common-border-width) solid #ffffff;
      box-shadow: var(--ss-box-shadow-1);
  }
  .secondary .equip_icon, .primary .equip_icon {
      filter: drop-shadow(0 2mm 0 rgba(200, 0, 0, .3));
  }
  .ico_itemtype {
      border-width: var(--ss-common-border-width);
      border-style: solid;
      border-color: #000000;
      width: var(--ss-type-icon-size);
      height: var(--ss-type-icon-size);
      margin: 0 var(--ss-space-micro) 0.25em var(--ss-space-micro);
      background: rgb(0 0 0 / 20%);
      box-sizing: border-box;
  }
  .btn_green {
      background: radial-gradient(#ffffff, #000000, var(--ss-black));
      border-color: var(--ss-green2);
  }
  .bevel_green {
      box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(231 231 231), var(--ss-btn-light-bevel) var(--ss-green0);
  }
  .ss_bigtab {
      height: 3em;
      text-transform: uppercase;
      color: var(--ss-blue5);
      border: var(--ss-common-border-width) solid var(--ss-blue5);
      background: #000;
      min-width: 8em;
      padding: var(--ss-space-micro);
      cursor: pointer;
      /* box-shadow: none !important; */
      box-shadow: var(--ss-box-shadow-1) !important;
  }
  #equip_grid .grid-item:not(.morestuff) {
      background: var(--ss-lightoverlay);
      border: var(--ss-common-border-width) solid var(--ss-blue5);
  }
  .secondary .equip_icon, .primary .equip_icon {
      filter: drop-shadow(0 2mm 0 rgba(200, 0, 0, .0));
  }


  /*-----------------Random stuff that I found everywhere--------*/
  .main-menu-button .menu-icon.menu-icon-star, .icon-star {
      transform: rotate(35deg) !important;
      fill: #1f783a;
      stroke: var(--ss-yolk);
      stroke-width: 3px;
      right: -1em;
      height: 2em;
      width: 2em;
  }
  .popup_window {
      z-index: 2000;
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--ss-space-lg);
      color: var(--ss-white);
      background-image: var(--ss-lightoverlay);
      border: var(--ss-common-border-width) solid var(--ss-blue5);
  }
  .bevel_blue {
      box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(0 0 0), var(--ss-btn-light-bevel) rgb(0, 0, 0);
  }
  .btn_blue {
      background-color: #1f783a;
      border-color: #ffffff
  }
  .bevel_blue_light {
      box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(110 110 110), var(--ss-btn-light-bevel) rgb(0, 0, 0);
  }
  .text_blue1 {
      color: #000000 !important;
  }
  .text_blue4 {
      color: #ffffff !important;
  }
  .text_blue8 {
      color: #1f783a !important;
  }
  .bg_blue2 {
      background-color: var(--ss-alphaclear);
  }
  .bg_blue3 {
      background-color: #0000 !important;
  }
  .bg_blue6 {
      background-color: #0000 !important;
  }
  .option-box li:hover {
      background: rgb(241 241 241 / 50%);
  }
  .option-box {
      padding: var(--ss-space-md) 0;
      bottom: 4em;
      right: -50%;
      border: var(--ss-common-border-width) solid var(--ss-blue5);
      box-shadow: 0.26em 0.26em 0 rgb(0 0 0 / 50%);
  }
  .changelog_content {
      overflow-y: auto;
      height: 24em;
      padding: var(--ss-space-lg);
      color: var(--ss-white);
      font-weight: 600;
      background: var(--ss-alphaclear);
  }
  #feedback_panel p, #feedback_panel li {
      color: #1f783a;
      font-weight: 600;
  }
  .load_message {
      color: var(--ss-white);
      margin-top: 5em;
      margin-bottom: 3.5em;
  }


  /*----------SETTINGS WINDOW-------*/
  .ss_keybind {
      border-radius: var(--ss-space-md);
      border: none;
      margin: 0 0 var(--ss-space-sm) 0;
      padding: var(--ss-space-sm);
      color: #ffffff;
      background: var(--ss-alphaclear);
      font-weight: bold;
      width: 9em;
      text-align: center;
      text-transform: uppercase;
  }
  .label {
      display: inline;
      color: #858585;
      font-weight: bold;
      margin-left: var(--ss-space-md);
      font-size: 1em;
  }
  .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 1.9em;
      width: 1.9em;
      background-color: var(--ss-alphaclear);
      border-radius: var(--ss-space-md);
  }
  .ss_checkbox .checkmark:after {
      left: 0.55em;
      top: 0.2em;
      width: 0.4em;
      height: 1em;
      border: solid #000000;
      border-width: 0 0.4em 0.4em 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
  }
  .ss_select {
      border-radius: var(--ss-space-sm);
      border: var(--ss-common-border-width) solid var(--ss-blue4);
      margin: 0 0 var(--ss-space-md) 0;
      padding: var(--ss-space-sm);
      box-shadow: inset 3px 3px 10px var(--ss-blue1), 0.1em 0.1em 3px var(--ss-blue3);
      background: var(--ss-alphaclear);
      color: var(--ss-blue3);
      font-weight: bold;
      min-height: 2.45em;
  }
  /*---------PRIVATE GAMES-------------*/
  #joinPrivateGamePopup .inner-wrapper {
      background-color: var(--ss-alphaclear);
      padding: var(--ss-space-md) var(--ss-space-xxl) var(--ss-space-lg);
  }

  /*----------PLAY MENU------------*/
  .weapon-select--title h1 {
      color: var(--ss-alphaclear);
      font-size: 1.3em;
      background: none;
      margin-bottom: var(--ss-space-md);
  }
  .playerSlot--name {
    overflow: hidden;
      color: var(--ss-yolk2) !important;
  }
  .pause-screen-btn-spectate {
      position: absolute;
      bottom: var(--ss-space-lg);
      left: var(--ss-space-lg);
      margin: 0;
      min-width: auto;
      border-radius: 100%;
      width: 4em;
      height: 4em;
      text-align: center;
      padding: 0;
      box-shadow: 0.15em 0.15em 0 rgba(0, 0, 0,.3), var(--ss-btn-dark-bevel) var(--ss-black), var(--ss-btn-light-bevel) var(--ss-black) !important;
  }
  .btn-respawn.bevel_green {
      box-shadow: 0.15em 0.15em 0 rgba(0, 0, 0,.3), var(--ss-btn-dark-bevel) rgb(255 255 255), var(--ss-btn-light-bevel) var(--ss-green0);
  }

  /*-----------CHAT----------*/
  #chatIn {
      display: none;
      color: var(--ss-blue7);
      bottom: 1em;
      left: 1em;
      width: 100%;
      border: none;
      background: none;
  }
  #chatOut span {
      color: #0fb309 !important;
  }
  .chat {
      font-weight: bold;
      color: #000000;
      opacity: 0.7;
      z-index: 5;
  }
  .chat-player-name {
    font-weight: bolder;
    color: var(--ss-blue4) !important
  }
  .is-paused .pause-ui-element {
      background-color: #000000;
      border: var(--ss-common-border-width) solid var(--ss-blue5);
      bottom: 0;
      width: var(--ss-chat-wrapper-width);
      height: var(--ss--chat-height);
  }

  /*---------------READOUTS-------------*/
  #inGameUI {
      position: absolute;
      right: 0.5em;
      top: 4em;
      right: 1.5em;
      top: 5em;
      padding: 1em;
      background-color: #0000;
      border: var(--ss-common-border-width) solid #ffffff;
  }
  #inGameUI .title {
      font-size: .4em;
      color: #0000;
  }
  #tutorialPopup {
      background-image: var(--ss-lightoverlay);
  }

  /*------------CHICKN WINNER--------*/
  .chw-circular-timer-container-shadow {
      background: rgb(0 0 0 / 0%);
      opacity: 1;
      width: var(--chw-bubble-width);
      height: var(--chw-bubble-height);
      align-items: center;
      position: relative;
      border-radius: 0.5em;
      padding: 0.4em 1em;
      z-index: 2;
      position: absolute;
      left: 4.3em;
      bottom: 1.6em;
      z-index: 1;
  }
  .egg-chick-wrapper {
      background-color: var(--ss-alphaclear);
      margin: var(--ss-space-lg) auto;
      height: 15em;
      align-items: end;
      min-width: 51em;
  }

  /*------------TWITCH-----------*/
  #giveStuffPopup.twitchDrops .twitch-btn {
      font-size: 1em;
      background: var(--ss-black);
  }
  #giveStuffPopup.twitchDrops footer {
      padding-bottom: 1em;
      background-color: #00000000;
  }
  #giveStuffPopup.twitchDrops .egg-give-stuff, #giveStuffPopup.twitchDrops .grid-item {
      width: 9em;
      height: 9em;
      max-width: 9em;
      max-height: 9em;
      min-width: 9em;
      min-height: 9em;
      border: 0.5em solid;
      margin-bottom: 1em;
      border-radius: var(--ss-space-lg);
      background-color: #0000003b;
  }

  .crosshair {
    position: absolute;
    transform-origin: 50% top;
    top: 50%;
    border: solid 0.03em #03fc03;
    height: 0.8em;
    margin-bottom: 0.12em;
    opacity: 1;
  }

  .crosshair.normal {
    left: calc(50% - 0.15em);
    background: #03fc03;
    width: 0.3em;
      opacity: 0.4;
  }

  #maskmiddle {
    background: url('https://preview.redd.it/hi-my-new-post-v0-ke0pqoxrvexc1.png?width=1080&crop=smart&auto=webp&s=fd10cb8336b017b38e920fc8ab7117b553c4f941') center center no-repeat;
    background-size: contain;
      width: 100vh;
    height: 100vh;
  }

  #reticleDot {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background: #03fc03;
    border: solid 0.05em black;
    width: 0.3em;
    height: 0.3em;
    opacity: 0.7;
  }

  #healthContainer {
    position: absolute;
    left: 50%; bottom: 1em;
    transform: translateX(-50%);
    display: inline-block;
    width: 6em; height: 6em;
    background: #000000;
      opacity: 0.6;
    border-radius: 50%;
    text-align: center;
  }

  .healthYolk {
    fill: #0c911d;
      opacity: 0.6;
  }
  #best_streak_container h1 {
      margin: 0;
      padding: 0;
      display: inline;
      text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
      font-family: 'Nunito', sans-serif !important;
      font-size: 2.5em !important;
      color: var(--ss-white) !important;
      font-weight: bold !important;
      text-transform: lowercase;
      padding-left: 1.25em;
      padding-top: 0em;
      background-image: url('https://preview.redd.it/tmm8bs42xexc1.png?auto=webp&s=08be83332405d46f85357f5f9621c0f9db59e325');
      background-position: left center;
      background-size: contain;
      background-repeat: no-repeat;
  }

  #killBox::before{
      font-size: 1em;
      font-weight: 900;
      content: 'YOU CLIPPED '!important;
      color: #000000;
  }

  #killBox h3{
    display:none;
  }

  #deathBox::before{
      font-size: 1em;
      font-weight: 900;
      content: 'YOU WERE CLIPPED BY'!important;
      color: #000000;
  }

  #deathBox h3{
  display:none;
  }

  .hardBoiledShield {
      position: absolute;
      transform: translateX(-50%);
      height: 100%;
      content: url('https://shellshock.io/img/hardBoiledEmpty.png');
  }

  #hardBoiledShieldFill {
    content: url('https://preview.redd.it/2px2s3w10gxc1.png?auto=webp&s=b02462f00490c40e8e9925c2f2c6e38580902af6');
  }

  /* ----------------------------------------------------------------- Account -- */


  .egg_icon {
    height: 1.6em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url('https://i.gifer.com/origin/71/719ea2f44c791fc07e0e811940a0232b_w200.gif'); /*Modified: .egg_icon | Previously:'Blank, added extra line'*/
  }

  .egg_count {
    width: auto;
    font-size: 1.7em;
    font-weight: bold;
    color: var(--ss-white); /*Modified: .egg_count | Previously:'color: var(--ss-white);'*/
  }
             /*DOC ADDING STUFF*/
}
#eggBreakerTimer {
	position: absolute;
	content: url('https://cdn.discordapp.com/attachments/1112676599251353620/1237189824767725629/ico_eggBreaker_1.png?ex=663abe50&is=66396cd0&hm=cfeef5ce4d428a7ba07d5b63513bccc833da5cb48dc77056217ecc0017815105&')
	text-shadow: var(--ss-yolk) 0 0 0.1em, black 0 0.1em 0.2em;
	font-size: 2.5em;
	font-family: 'Nunito', sans-serif;
}


  /* ----------------------------------------------------------------- nade -- */

  #grenadeThrowContainer {
	position: absolute;
	display: flex;
	visibility: hidden;
	align-items: flex-end;
	top: 50%;
	left: 50%;
	transform: translate(-6em, -3em);
	width: 1em;
	height: 6em;
	background: #070707;
	border-radius: 0.3em;
	padding: 0.25em;
  }
  #grenadeThrow {
	width: 100%;
	height: 50%;
	border-radius: 0.05em;
	background: #0c911d;
  }
  /* ----------------------------------------------------------------- nade -- */
  .shotReticle {
	box-sizing: border-box;
	position: absolute;
	left: 50%;
	transform-origin: center;
	background: transparent;
	border: solid;
	border-radius: 30%;
  }

  .shotReticle:nth-child(odd) {
	transform: translate(-50%, 33%) rotate(0deg);
	width: 4em;
	height: 60%;
  }

  .shotReticle:nth-child(2n) {
	  transform: translateX(-50%) rotate(90deg);
	  width: 2.5em;
	  height: 100%;
  }

  .shotReticle.fill.normal {
	  border-color: #04d104;
	  border-left: solid transparent;
	  border-right: solid transparent;
	  border-width: 0.18em;
	  padding: 0.18em;
  }

  .shotReticle.fill.powerful {
	  border-color: green;
	  border-left: solid transparent;
	  border-right: solid transparent;
	  border-width: 0.3em;
	  padding: 0.1em;
  }

  .shotReticle.border.normal {
	  border-color: #04d104;
	  border-left: solid transparent;
	  border-right: solid transparent;
	  border-width: 0.2em;
  }

  .shotReticle.border.powerful {
	  border-color: black;
	  border-left: solid transparent;
	  border-right: solid transparent;
	  border-width: 0.4em;
  }

  /* ----------------------------------------------------------------- Settings Popup -- */


  #joinPrivateGamePopup .inner-wrapper {
    background-color: #000000; /*Modified: #joinPrivateGamePopup .inner-wrapper | Previously:'background-color: var(--ss-blue3);'*/
    padding: var(--ss-space-md) var(--ss-space-xxl) var(--ss-space-lg);
      border: var(--ss-common-border-width) solid #000000; /*Modified: #joinPrivateGamePopup .inner-wrapper | Previously:'border: var(--ss-common-border-width) solid var(--ss-blue5);'*/
  }

  .play-panel-panels {
    width: 38em;
    display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--ss-space-xl);
      color: var(--ss-white);
      background-image: url(https://preview.redd.it/6ix62nqcwexc1.png?width=1080&crop=smart&auto=webp&s=384f8e6037b9b1b127035e67fabf71df17c57e83); /*Modified: .play-panel-panels | Previously:'background-image: var(--ss-popupbackground);'*/
    background-size: cover; /*Modified: .play-panel-panels | Previously:'Blank, added extra line'*/
    background-position: center; /*Modified: .play-panel-panels | Previously:'Blank, added extra line'*/
      border: var(--ss-common-border-width) solid #2F2B22; /*Modified: .play-panel-panels | Previously:'border: var(--ss-common-border-width) solid var(--ss-blue5);'*/
  }

  .play-panel-panels .inner-wrapper {
      padding: var(--ss-space-xl);
      color: var(--ss-white);
      background-color: #000000; /*Modified: .play-panel-panels .inner-wrapper | Previously:'background-image: var(--ss-popupbackground);'*/
  }

  .play-panel-panels-join {
    margin-top: var(--ss-space-md);
      background-image: url(https://preview.redd.it/6ix62nqcwexc1.png?width=1080&crop=smart&auto=webp&s=384f8e6037b9b1b127035e67fabf71df17c57e83); /*Modified: .play-panel-panels-join | Previously:'background-image: var(--ss-popupbackground);'*/
    background-size: cover; /*Modified: .play-panel-panels-join | Previously:'Blank, added extra line'*/
    background-position: center; /*Modified: .play-panel-panels-join | Previously:'Blank, added extra line'*/
      border: var(--ss-common-border-width) solid #ffffff; /*Modified: .play-panel-panels-join | Previously:'border: var(--ss-common-border-width) solid var(--ss-blue5);'*/
  }
  .play-panel-panels-join h1, .create-game-header {
    font-size: 1.2em;
  }


  `;
})();