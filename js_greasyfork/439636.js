// ==UserScript==
// @name Better Icons for Invidious
// @namespace -
// @version 0.5.1
// @description using css icon alternatives instead of font variant.
// @author NotYou
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*.invidious.snopyta.org/*
// @match *://*.yewtu.be/*
// @match *://*.invidious.kavin.rocks/*
// @match *://*.vid.puffyan.us/*
// @match *://*.invidious.namazso.eu/*
// @match *://*.inv.riverside.rocks/*
// @match *://*.invidious.osi.kr/*
// @match *://*.youtube.076.ne.jp/*
// @match *://*.yt.artemislena.eu/*
// @match *://*.tube.cthd.icu/*
// @match *://*.invidious.flokinet.to/*
// @match *://*.invidious.privacy.gd/*
// @match *://*.invidious.weblibre.org/*
// @match *://*.invidious.esmailelbob.xyz/*
// @match *://*.invidious.lunar.icu/*
// @match *://*.invidious.mutahar.rocks/*
// @match *://*.y.com.sb/*
// @match *://*.invidious.sethforprivacy.com/*
// @match *://*.c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion/*
// @match *://*.w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion/*
// @match *://*.kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad.onion/*
// @match *://*.grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad.onion/*
// @match *://*.hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid.onion/*
// @match *://*.osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd.onion/*
// @match *://*.u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad.onion/*
// @match *://*.2rorw2w54tr7jkasn53l5swbjnbvz3ubebhswscnc54yac6gmkxaeeqd.onion/*
// @match *://*.euxxcnhsynwmfidvhjf6uzptsmh4dipkmgdmcmxxuo7tunp3ad2jrwyd.onion/*
// @downloadURL https://update.greasyfork.org/scripts/439636/Better%20Icons%20for%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/439636/Better%20Icons%20for%20Invidious.meta.js
// ==/UserScript==

(function() {
let css = `

[class*="icon"]::before {
    content: '' !important;
}

.creator-heart-background-hearted {
    border-radius: 50%;
}

.ion-ios-cog {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 10px;
    height: 2px;
    box-shadow: -3px 4px 0 0, 3px -4px 0 0;
}

.ion-ios-cog::after, .ion-ios-cog::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    border: 2px solid;
    border-radius: 100%;
}

.ion-ios-cog::before {
    top: -7px;
    left: -4px;
}

.ion-ios-cog::after {
    bottom: -7px;
    right: -4px;
}

.ion-ios-notifications-outline, .ion-ios-notifications-outline::before {
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
}

.ion-ios-notifications-outline {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    border: 2px solid;
    border-bottom: 0;
    width: 14px;
    height: 14px;
}

.ion-ios-notifications-outline::after, .ion-ios-notifications-outline::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.ion-ios-notifications-outline::before {
    background: currentColor;
    width: 4px;
    height: 4px;
    top: -4px;
    left: 3px;
}

.ion-ios-notifications-outline::after {
    width: 16px;
    height: 10px;
    border: 6px solid transparent;
    border-top: 1px solid transparent;
    box-shadow: inset 0 0 0 4px, 0 -2px 0 0;
    top: 14px;
    left: -3px;
    border-radius: 0px 0px 20px 20px;
}

.ion-ios-notifications, .ion-ios-notifications::before {
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
}

.ion-ios-notifications {
    background: currentcolor none repeat scroll 0% 0%;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1));
    border: 2px solid;
    border-bottom: 0;
    width: 14px;
    height: 14px;
}

.ion-ios-notifications::after, .ion-ios-notifications::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.ion-ios-notifications::before {
    background: currentColor;
    width: 4px;
    height: 4px;
    top: -4px;
    left: 3px;
}

.ion-ios-notifications::after {
    width: 16px;
    height: 10px;
    border: 6px solid transparent;
    border-top: 1px solid transparent;
    box-shadow: inset 0 0 0 4px, 0 -2px 0 0;
    top: 14px;
    left: -3px;
    border-radius: 0px 0px 20px 20px;
}

.ion-ios-moon {
    background: white;
    height: 18px;
    width: 18px;
    display: inline-block;
    border-radius: 10px;
    box-shadow: currentcolor -6px 2px 0px;
    margin-right: -8px;
}

.ion-ios-moon::before {
    content: "";
}

.ion-ios-sunny::before {
    content: "";
}

.ion-ios-sunny::after {
    transform: rotate(45deg);
}

.ion-ios-sunny::after, .ion-ios-sunny::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 24px;
    height: 2px;
    border-right: 4px solid;
    border-left: 4px solid;
    left: -6px;
    top: 5px;
}

.ion-ios-sunny::before {
    transform: rotate(-45deg);
}

.ion-ios-sunny {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 24px;
    height: 24px;
    background: linear-gradient(currentcolor 4px, #f000 0px) no-repeat scroll 5px -6px / 2px 6px, linear-gradient(currentcolor 4px, transparent 0px) no-repeat scroll 5px 14px / 2px 6px, linear-gradient(currentcolor 4px, transparent 0px) no-repeat scroll -8px 5px / 6px 2px, rgba(0, 0, 0, 0) linear-gradient(currentcolor 4px, transparent 0px) no-repeat scroll 14px 5px / 6px 2px;
    border-radius: 100px;
    box-shadow: 0px 0px 26px 2px inset;
    border: 6px solid #f000;
}

.ion-ios-paper {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1));
    width: 14px;
    height: 16px;
    border: 2px solid transparent;
    border-right: 0;
    border-top: 0;
    box-shadow: 0 0 0 2px;
    border-radius: 1px;
    border-top-right-radius: 4px;
    overflow: hidden;
}

.ion-ios-paper::after, .ion-ios-paper::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.ion-ios-paper::before {
    content: "";
    background: currentColor;
    box-shadow: 0 4px 0, -6px -4px 0;
    left: 0;
    width: 10px;
    height: 2px;
    top: 8px;
}

.ion-ios-paper::after {
    width: 6px;
    height: 6px;
    border-left: 2px solid;
    border-bottom: 2px solid;
    right: -1px;
    top: -1px;
}

.ion-logo-javascript::before {
    content: "JS" !important;
    background: #fded00;
    color: rgb(0, 0, 0);
    padding: 8px 2px 1px 6px;
    font-weight: 700;
    font-family: "Segoe UI"
}

.ion-ios-wallet {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,0.8));
    width: 2px;
    height: 20px;
    background: currentColor;
    margin-bottom: -4px;
    margin-right: 2px;
}

.ion-ios-wallet::after, .ion-ios-wallet::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 12px;
    height: 8px;
    border: 2px solid;
}

.ion-ios-wallet::before {
    border-right: 0;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    top: 3px;
    left: -6px;
    box-shadow: 4px -2px 0 -2px;
}

.ion-ios-wallet::after {
    border-left: 0;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
    bottom: 3px;
    right: -6px;
    box-shadow: -4px 2px 0 -2px;
}

.ion-logo-github {
    transform: scale(var(--ggs,1));
    margin-bottom: -3px;
    padding-right: 10px;
}

.ion-logo-github, .ion-logo-github::after, .ion-logo-github::before {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    width: 8px;
    height: 20px
}

.ion-logo-github::after, .ion-logo-github::before {
    content: "";
    position: absolute;
    height: 8px;
    border-left: 2px solid;
    border-bottom: 2px solid;
    transform: rotate(45deg) scaleY(1);
    left: -4px;
    top: 6px
}

.ion-logo-github::after {
    transform: rotate(-45deg) scaleX(-1);
    left: 4px
}

.ion-md-jet::before {
    content: "";
}

.ion-md-jet {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1));
    border-radius: 40px;
    border: 2px solid;
    margin-bottom: -2px;
    border-left-color: transparent;
    border-right-color: transparent;
    width: 18px;
    height: 18px;
}

.ion-md-jet::after, .ion-md-jet::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    transform: rotate(-45deg);
}

.ion-md-jet::before {
    border-left: 6px solid;
    bottom: -1px;
    right: -3px;
}

.ion-md-jet::after {
    border-right: 6px solid;
    top: -1px;
    left: -3px;
}

.ion-md-headset::before {
    content: "";
}

.ion-md-headset {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1));
    width: 18px;
    height: 16px;
    border-top-left-radius: 120px;
    border-top-right-radius: 120px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    border: 2px solid;
    border-bottom: 0;
}

.ion-md-headset::after, .ion-md-headset::before {
    background: currentColor;
    border-radius: 8px;
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    border: 2px solid;
    width: 6px;
    height: 8px;
    top: 8px;
}

.ion-md-headset::before {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    left: -2px;
}

.ion-md-headset::after {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    left: 10px;
}

.ion-ios-videocam {
    background: currentColor;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1.1));
    border: 2px solid;
    border-radius: 4px;
    width: 18px;
    height: 15px;
    perspective: 24px;
    margin-bottom: 4px;
}

.ion-ios-videocam::after, .ion-ios-videocam::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    margin-right: -4px;
}

.ion-ios-videocam::before {
    background: currentColor;
    border: 4px solid;
    border-left-color: transparent;
    transform: rotateY(-70deg);
    width: 8px;
    height: 8px;
    right: -7px;
    top: 1px;
}

.ion-ios-videocam::after {
    border-right: 2px solid;
    top: -5px;
    right: 2px;
    border-top-right-radius: 2px;
}


.ion-logo-youtube {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1));
    width: 18px;
    height: 12px;
    border-radius: 3px 3px 3px 3px;
    background: red;
    color: rgb(255, 255, 255) !important;
}
.ion-logo-youtube::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    left: 8px;
    top: 3px;
    border-left: 4px solid currentColor;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
}

.ion-ios-eye {
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1));
    width: 24px;
    height: 18px;
    border-bottom-right-radius: 100px;
    border-bottom-left-radius: 100px;
    overflow: hidden;
    box-sizing: border-box;
}

.ion-ios-eye::after, .ion-ios-eye::before {
    content: "";
    display: block;
    border-radius: 100px;
    position: absolute;
    box-sizing: border-box;
}

.ion-ios-eye::after {
    top: 2px;
    box-shadow: inset 0 -8px 0 2px, inset 0 0 0 2px;
    width: 24px;
    height: 24px;
}

.ion-ios-eye::before {
    width: 8px;
    height: 8px;
    border: 2px solid transparent;
    box-shadow: inset 0 0 0 6px, 0 0 0 4px, 6px 0 0 0, -6px 0 0 0 ;
    bottom: 4px;
    left: 8px;
}

.ion-md-trash {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1));
    width: 10px;
    height: 12px;
    border: 2px solid transparent;
    box-shadow: 0 0 0 2px, inset -2px 0 0, inset 2px 0 0;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    margin-top: 4px;
    color: rgb(224, 224, 224);
}

.ion-md-trash:hover {
    color: rgb(255, 255, 255);
}

.ion-md-trash::after, .ion-md-trash::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.ion-md-trash::after {
    background: currentColor;
    border-radius: 3px;
    width: 16px;
    height: 2px;
    top: -4px;
    left: -5px;
}

.ion-md-trash::before {
    width: 10px;
    height: 4px;
    border: 2px solid;
    border-bottom: transparent;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    top: -7px;
    left: -2px;
}

.ion-md-add::before {
    content: "";
}

.ion-md-add, .ion-md-add::after {
    display: block;
    box-sizing: border-box;
    background: currentColor;
    border-radius: 10px;
}

.ion-md-add {
    margin-top: -2px;
    position: relative;
    transform: scale(var(--ggs,1));
    width: 16px;
    height: 2px;
}

.ion-md-add::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 16px;
    top: -7px;
    left: 7px;
}

.ion-logo-rss::after {
    width: 4px !important;
    height: 4px !important;
    border-style: solid !important;
    border-width: 2px !important;
    border-color: transparent currentcolor transparent transparent !important;
    border-image: none 100% / 1 0 stretch !important;
    bottom: -2px !important;
    left: -2px !important;
}

.ion-logo-rss::after, .ion-logo-rss::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 20px;
    height: 20px;
    border-style: double;
    border-width: 6px;
    border-color: transparent currentcolor transparent transparent;
    border-image: none 100% / 1 0 stretch;
    border-radius: 50%;
    transform: rotate(-45deg);
    bottom: -10px;
    left: -10px;
}

.ion-logo-rss {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1.4));
    width: 20px;
    height: 16px;
    border-radius: 2px;
}

#descexpansionbutton:checked ~ label > a::after {
    content: "↑ Show less";
}

#descexpansionbutton ~ label > a::after {
    content: "↓ Show more";
}

.pure-u-1-24 {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    width: 0px;
    height: 0px;
    color: currentColor;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid;
    transform: rotate(180deg);
    margin-top: 22px;
    margin-right: 4px;
}

.pure-u-1-24:active {
    transform: rotate(0deg);
}

.ion-ios-heart::after {
    right: -9px;
    transform: rotate(90deg);
    top: 5px;
}

.ion-ios-heart::after, .ion-ios-heart::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.ion-ios-heart::before {
    width: 10px;
    height: 11px;
    border-left: 2px solid;
    border-bottom: 2px solid;
    left: -2px;
    top: 3px;
}

.ion-ios-heart, .ion-ios-heart::after, .ion-ios-heart::before {
    background: currentColor;
}

.ion-ios-heart {
    box-sizing: border-box;
    position: relative;
    transform: translate(calc(-10px / 2 * var(--ggs,1)),calc(-6px / 2 * var(--ggs,1)))rotate(-46deg)scale(var(--ggs,0.8));
    display: inline-block;
}

.ion-ios-heart, .ion-ios-heart::after {
    border-color: currentcolor;
    border-style: solid solid none;
    border-width: 2px 2px 0px;
    border-image: none 100% / 1 0 stretch;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    width: 10px;
    height: 8px;
}

.ion-ios-thumbs-up::after {
    right: -9px;
    transform: rotate(90deg);
    top: 5px;
}

.icon.ion-ios-thumbs-up:active {
    color: red;
    transition: 4s;
}

.ion-ios-thumbs-up::after, .ion-ios-thumbs-up::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.ion-ios-thumbs-up::before {
    width: 10px;
    height: 11px;
    border-left: 2px solid;
    border-bottom: 2px solid;
    left: -2px;
    top: 3px;
}

.ion-ios-thumbs-up, .ion-ios-thumbs-up::after, .ion-ios-thumbs-up::before {
    background: currentColor;
}

.ion-ios-thumbs-up {
    box-sizing: border-box;
    position: relative;
    transform: translate(calc(-10px / 2 * var(--ggs,1)),calc(-6px / 2 * var(--ggs,1)))rotate(-46deg)scale(var(--ggs,1));
    display: inline-block;
}

.ion-ios-thumbs-up, .ion-ios-thumbs-up::after {
    border-color: currentcolor;
    border-style: solid solid none;
    border-width: 2px 2px 0px;
    border-image: none 100% / 1 0 stretch;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    width: 10px;
    height: 8px;
}

.ion-ios-thumbs-down, .ion-ios-thumbs-down::after {
    border: 2px solid;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    width: 10px;
    height: 8px;
    border-bottom: 0;
}

.ion-ios-thumbs-down {
    box-sizing: border-box;
    position: relative;
    transform: translate(calc(-10px / 2 * var(--ggs,1)), calc(-6px / 2 * var(--ggs,1)))rotate(-45deg)scale(var(--ggs,1));
    display: inline-block;
}

.ion-ios-thumbs-down::after, .ion-ios-thumbs-down::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.ion-ios-thumbs-down::after {
    right: -9px;
    transform: rotate(90deg);
    top: 5px;
}

.ion-ios-thumbs-down::before {
    width: 11px;
    height: 11px;
    border-left: 2px solid;
    border-bottom: 2px solid;
    left: -2px;
    top: 3px;
}

.icon.ion-ios-thumbs-up, .icon.ion-ios-thumbs-down {
    margin-right: 2px;
    margin-bottom: 2px;
}

.loading {
  animation: 0s !important;
}

@keyframes loadbar {
    0%,to { left: 0;  right: 80% }
    25%,75% { left: 0; right: 0 }
    50% { left: 80%; right: 0 }
}

.icon.ion-ios-refresh, .icon.ion-ios-refresh::before {
    display: inline-block;
    box-sizing: border-box;
    height: 4px;
}

.icon.ion-ios-refresh {
    position: relative;
    transform: scale(var(--ggs,2));
    width: 18px;
}

.icon.ion-ios-refresh::before {
    content: "";
    position: absolute;
    border-radius: 4px;
    background: currentColor;
    animation: loadbar 2s cubic-bezier(0,0,.58,1) infinite !important;
}

.icon.ion-md-checkmark-circle::after {
    content: "";
    position: absolute;
    top: -1px;
    width: 6px;
    height: 10px;
    transform-origin: left bottom 0px;
    transform: rotate(45deg);
    display: block;
    box-sizing: border-box;
    left: 3px;
    border-width: 0px 2px 2px 0px;
    border-style: solid;
    border-color: rgb(255, 255, 255);
}

.icon.ion-md-checkmark-circle {
    box-sizing: border-box;
    position: relative;
    width: 22px;
    height: 22px;
    border: 2px solid;
    border-radius: 100px;
    background-color: currentcolor;
    transform: scale(0.7);
}

.icon.ion-md-checkmark-circle::before {
    content: "";
}

.vjs-icon-pause::before, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder::before {
  content: "";
}

[title="Pause"] {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transform: scale(var(--ggs,1.9));
    width: 8px !important;
    height: 10px !important;
    border-left: 3px solid !important;
    border-right: 3px solid !important;
    margin-top: 11px !important;
    margin-left: 11px !important;
    margin-right: 11px !important;
}

.vjs-icon-volume-high::before, .video-js .vjs-mute-control .vjs-icon-placeholder::before, .vjs-icon-volume-mid::before, .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder::before, .vjs-icon-volume-low::before, .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder::before, .vjs-icon-volume-mute::before, .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder::before {
    content: "";
}

.video-js .vjs-volume-panel > *:not(.video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-horizontal) {
    transform: scale(1.9);
}

.vjs-vol-3::before {
    content: "🔊";
}

.vjs-vol-2::before {
    content: "🔉";
}

.vjs-vol-1::before {
    content: "🔈";
}

.vjs-vol-0::before {
    content: "🔇";
}

.vjs-icon-play::before, .video-js .vjs-play-control .vjs-icon-placeholder::before, .video-js .vjs-big-play-button .vjs-icon-placeholder::before {
    content: "";
}

.vjs-big-play-button, .vjs-paused {
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    margin-right: 5px !important;
    width: 22px;
    height: 22px;
}

.vjs-quality-selector > .vjs-menu {
    margin-bottom: 4px;
}

.vjs-quality-selector::after {
    width: 8px;
    height: 1px;
    background: currentcolor none repeat scroll 0% 0%;
    border-radius: 10px;
    bottom: -4px;
    right: 2px;
}

.vjs-quality-selector::after, .vjs-quality-selector::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
}

.vjs-quality-selector {
    box-sizing: border-box;
    position: relative !important;
    display: block;
    transform: scale(var(--ggs,1));
    width: 16px !important;
    height: 11px !important;
    border: 2px solid;
    border-radius: 2px;
    margin-top: 10px !important;
    margin-left: 8px !important;
}

.vjs-quality-selector .vjs-icon-placeholder::before {
  content: "";
}

.vjs-big-play-button::before {
    top: 16px !important;
    left: 40px !important;
}

.vjs-big-play-button::before, .vjs-paused::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 0;
    height: 10px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid;
    top: 12px;
    left: 25px;
    transform: scale(var(--ggs,1.8));
}

.vjs-icon-share {
    box-sizing: border-box;
    position: relative !important;
    display: inline-block !important;
    transform: scale(var(--ggs,1));
    width: 6px !important;
    height: 6px !important;
    background: currentColor !important;
    border-radius: 100px;
    box-shadow: 10px -6px 0, 10px 6px 0;
    margin-top: 10px !important;
    margin-right: 10px !important;
}

.vjs-icon-share::after, .vjs-icon-share::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    border-radius: 3px;
    width: 10px;
    height: 2px;
    background: currentColor;
    left: 2px;
}

.vjs-icon-share::before {
    top: 0;
    transform: rotate(-35deg);
}

.vjs-icon-share::after {
    bottom: 0;
    transform: rotate(35deg);
}

.vjs-icon-captions::before, .video-js:lang(en) .vjs-subs-caps-button .vjs-icon-placeholder::before, .video-js:lang(fr-CA) .vjs-subs-caps-button .vjs-icon-placeholder::before, .video-js .vjs-captions-button .vjs-icon-placeholder::before {
    content: "";
}

.vjs-captions-button > .vjs-menu {
    margin-bottom: 5px;
}

.vjs-captions-button {
    border-radius: 1px;
    transform: scale(var(--ggs,1));
}

.vjs-captions-button, .vjs-captions-button::after, .vjs-captions-button::before {
    box-sizing: border-box;
    position: relative;
    display: block !important;
    width: 20px !important;
    height: 16px !important;
    border: 2px solid;
    margin-top: -6px;
    top: 6px;
}

.vjs-captions-button::after, .vjs-captions-button::before {
    content: "";
    position: absolute;
    width: 5px !important;
    height: 8px !important;
    border-right: transparent;
    top: 8px;
    left: 2px;
}

.vjs-captions-button::before {
    left: 9px;
}

.vjs-icon-fullscreen-enter::before, .video-js .vjs-fullscreen-control .vjs-icon-placeholder::before {
    content: "";
}

.vjs-icon-circle::before, .vjs-seek-to-live-control .vjs-icon-placeholder::before, .video-js .vjs-volume-level::before, .video-js .vjs-play-progress::before {
    content: "︱";
}

.vjs-close-button {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 40px;
}

.vjs-close-button::after, .vjs-close-button::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 16px;
    height: 2px;
    background: currentColor;
    transform: rotate(45deg);
    border-radius: 5px;
    left: 8px;
}

.vjs-close-button::after {
    transform: rotate(-45deg);
}

.vjs-icon-cancel::before, .video-js .vjs-control.vjs-close-button .vjs-icon-placeholder::before {
  content: "";
}

[title="Fullscreen"] {
    box-sizing: border-box;
    position: relative !important;
    display: block !important;
    transform: scale(var(--ggs,1));
    width: 14px !important;
    height: 14px !important;
    box-shadow: -6px -6px 0 -4px, 6px 6px 0 -4px, 6px -6px 0 -4px, -6px 6px 0 -4px;
    margin-top: 7px !important;
    margin-left: 8px !important;
    margin-right: 10px !important;
}

.vjs-icon-fullscreen-exit::before, .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder::before {
    content: "";
}

[title="Non-Fullscreen"] {
    box-sizing: border-box;
    position: relative !important;
    display: block !important;
    transform: scale(var(--ggs,1));
    width: 4px !important;
    height: 4px !important;
    box-shadow: -8px -4px 0 -1px, -6px -4px 0 -1px, 8px 4px 0 -1px, 6px 4px 0 -1px, 8px -4px 0 -1px, 6px -4px 0 -1px, -8px 4px 0 -1px, -6px 4px 0 -1px;
    margin-top: 13px !important;
    margin-left: 12px !important;
    margin-right: 13px !important;
}

[title="Non-Fullscreen"]::after, [title="Non-Fullscreen"]::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 2px;
    height: 18px;
    border-top: 6px solid;
    border-bottom: 6px solid;
    box-shadow: 18px 0 0 -2px;
    top: -7px;
}

[title="Non-Fullscreen"]::after {
    left: -3px;
}

[title="Non-Fullscreen"]::before {
    right: -3px;
}

.dark-theme a {
    color: rgb(223, 223, 223);
}

#contents > .h-box > h3 {
  display: none !important;
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
