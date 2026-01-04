// ==UserScript==
// @name         XZ Script
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  a new look for venge.io
// @author       Moka
// @match        https://venge.io/*
// @icon         https://i.postimg.cc/CMm2Tk4T/logo-1.png
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524484/XZ%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/524484/XZ%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(`
#menu-bar {
  background: transparent !important;
  background-size: cover !important;
  border-bottom: none !important;
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  height: 100% !important;
  width: 320px !important;
  padding: 20px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
}

#menu {
  position: absolute !important;
  width: 100%;
  height: 100%;
}

#menu-items li {
  border-left: none !important;
}

.big-button.attention {
    transition: 0.5s, color 0.5s;
}

.big-button.attention:hover {
    color: black;
}

#play-section {
  background: transparent !important;
}

#logo {
  visibility: visible;
  position: relative !important;
  left: 400px;
  zoom: 1.5;
  cursor: default !important;
}

#reward-ads {
    display: none;
    visibility: hidden;
}

#menu-items-old {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: fixed;
    top: 0;
    left: -37px;
    margin: 0;
}

#menu-items li {
    border-radius: 1.8vh;
}

#loadout-selection-button img {
    position: absolute;
    right: 38vh;
}

#map-selection-button img {
    position: absolute;
    right: 15vh;
}

#map-selection-button span {
    position: absolute;
    right: 3vh;
    top: 0.7vh;
}

.big-button {
  width: 300px !important;
  height: 112px !important;
  background: linear-gradient(red, black) !important;
  background-size: cover !important;
  border-left: none !important;
  text-shadow: none !important;
  margin-bottom: 0px !important;
  position: relative !important;
  top: -18.7vh !important;
  border: #000000 0.5vh solid !important;
  border-radius: 10px !important;
  text-align: center !important;
}

.invite-button {
    background: linear-gradient(#2856ad, #2885ad) !important;
    font-size: 25px;
    border-radius: 7px !important;
    border: #000000 0.5vh solid !important;
    cursor: pointer;
    position: absolute;
    top: 3vh;
    right: 3vh;
}

.invite-button:hover {
    opacity: 0.9;
    color: black;
}

.game-options {
  border-bottom: none !important;
  position: absolute;
  top: 14.6vh;
  right: 2vh;
}

#loadout-selection-button {
border-right: none !important;
}

#loadout-selection-button img {
    background-color: transparent !important;
}

.options {
    border-top: none !important;
}

.options > a {
    border-right: none !important;
    border-radius: 1vh;
}

.options > a:hover {
    background-color: #242e5d;
    color: black;
}

.big-button span::before {
  content: "Start";
  letter-spacing: 4px;
  font-size: 3rem;
  text-align: center !important;
  margin: 22px;
  color: black;
}

.big-button span {
  -webkit-text-fill-color: #fff !important;
  visibility: hidden;
}

.big-button span::before {
  visibility: visible;
}

#home-banner-horizontal,
#news-area {
  display: none;
  visibility: hidden;
}

.invite-button {
    background: linear-gradient(#2856ad, #2885ad) !important;
    font-size: 25px;
    border-radius: 7px !important;
    border: #000000 0.5vh solid !important;
    cursor: pointer;
    font-size: 25px;
    text-shadow: 0px 1px 2px rgb(60, 75, 82);
    padding: 10px 30px;
    width: 89% !important;
    cursor: pointer;
    margin-top: 10px;
    text-transform: uppercase;
}

.popup-header {
    background-color: #260606 !important;
}

.group-input .side-button {
    background: #f54a4a !important;
    border-left: solid 5px #d14c4c !important;
}

.table-list-style ul.table-list-header {
    background: #330d0d !important;
}

.table-list-style ul.table-list-content li:nth-child(odd) {
    background: #531d1d !important;
}

.table-list-style ul.table-list-content li:nth-child(even) {
    background: #3f0b0b !important;
}

#header {
    background: #260606 !important;
}

#content-banner-area{
    display: none;
    visibility: hidden;
}

#content-banner-area {
    background-color: #260606 !important;
}

.profile-details-wrapper.Shin, .profile-details-wrapper.shin {
    background: rgb(27 28 34) !important;
}

.stats-wrapper {
    background: rgb(45 13 13 / 89%) !important;
}

.clan-header {
    background: #531d1d !Important;
}

.subtab {
    background: #3f0b0b !important;
}
`)

})();