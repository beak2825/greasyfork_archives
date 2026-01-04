// ==UserScript==
// @name         Gplex - Old Google Frontend
// @namespace    http://tampermonkey.net/
// @version      0.7.2.1
// @description  2011-2019 Google frontend (public beta release)
// @author       lightbeam24
// @match        *://www.google.com/search*
// @match        *://www.google.com/
// @match        *://www.google.com/webhp*
// @match        *://www.google.com/gplex
// @match        *://www.google.com/Gplex
// @exclude      *://*/*!!!*
// @exclude      *://www.google.com/maps*
// @exclude      *://www.google.com/preferences
// @exclude      *://www.google.com/advanced
// @exclude      *://www.google.com/sorry
// @exclude      *://www.google.com/recaptcha
// @exclude      *://www.google.com/finance
// @exclude      *://www.google.com/imghp
// @exclude      *://www.google.com/videohp
// @exclude      *://*/*&gplex=false
// @exclude      *://*/*?gplex=false
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/492193/Gplex%20-%20Old%20Google%20Frontend.user.js
// @updateURL https://update.greasyfork.org/scripts/492193/Gplex%20-%20Old%20Google%20Frontend.meta.js
// ==/UserScript==
function showMenu(){
    window.location = "https://www.google.com/gplex";
}
function loadWithoutGplex(){
    if(window.location.href=="https://www.google.com/"){
        window.location.href="https://www.google.com/?gplex=false";
    }else{
        window.location.href+="&gplex=false";
    }
}
GM_registerMenuCommand("Go to Gplex settings page",showMenu);
GM_registerMenuCommand("Load page without Gplex",loadWithoutGplex);
(function() {
    'use strict';
    document.querySelector("html").setAttribute("gplex","loading");
    window["trusted_policy"] = window["trustedTypes"] ? (window["trustedTypes"].createPolicy("gplex-policy", {
        createHTML: function(a){
            return a;
        }
    })) : {
        createHTML: function(a){
            return a;
        }
    };
    let styleHTML = `
        <style>
        [layout^="2018"] svg[style="display: none"],
        [layout="2016C"] svg[style="display: none"],
        [layout="2019"] svg[style="display: none"] {
  display: block !important;
}
        @keyframes roll {
 100% {
  transform:rotate(360deg)
 }
}
        .ugf-x4link {
  background: green;
}
html:not([disabled]) body > c-wiz,
html:not([disabled]) body > span:not(#ugf),
html:not([disabled]) body > div:not(#ugf):not(#sZmt3b) {
  display: none;
}
html {
  font-family: arial;
}
[layout="2012"],
[layout="2013"] {
  --topbar-height-total: 72px;
}
[layout="2013L"],
[layout="2015L"],
[layout="2016L"],
[layout="2019"] {
  --topbar-height-total: 72px;
}
[layout="2014"],
[layout="2015"],
[layout="2016"] {
  --topbar-height-total: 59px;
}
[layout="2016C"],
[layout^="2018"] {
  --topbar-height-total: 64px;
}
/*#ugf-top {
  position: fixed;
  top: 0;
  width: 100%;
}
#ugf-content {
  display: flex;
  margin-top: 80px;
}
#ugf-top {
  position: fixed;
  width: 100%;
  top: 0;
}
#ugf-content {
  margin-top: 120px;
}*/
html body {
  font-family: arial !important;
}
[layout="2016C"] body {
  background: #f9f9f9 !important;
}
#ugf-topbar {
  padding: 8px;
  padding: 10px 8px 8px;
  background: #f1f1f1;
  border-bottom: 1px solid #e5e5e5;
  height: 43px;
  height: 41px;
  min-width: 980px;
}
[layout="2012"] #ugf-topbar,
[layout="2013"] #ugf-topbar,
[layout="2013L"] #ugf-topbar,
[layout="2015L"] #ugf-topbar,
[layout="2016L"] #ugf-topbar {
  height: 51px;
  padding: 14px 8px 6px;
}
[layout^="2018"] #ugf-topbar {
  background: #fafafa;
  border-bottom: none;
  padding: 20px 8px 3px;
}
[layout="2016C"] #ugf-topbar {
  background: #f9f9f9;
  border-bottom: none;
  padding: 20px 8px 3px;
}
[layout="2019"] #ugf-topbar {
  background: #fff;
  border-bottom: none;
  padding: 24px 8px 3px;
}
.flex {
  display: flex;
}
#ugf-topbar-inner,
#ugf-search,
#ugf-navbar-inner,
#ugf-navbar-middle,
.ugf-tab,
.ugf-tab-inner,
.flex-bar {
  display: flex;
  align-items: center;
}
#ugf-navbar {
  min-width: 1000px;
}
[layout="2013L"] #ugf-navbar-middle,
[layout="2012"]:not([location="gplex"]) #ugf-navbar {
  display: none;
}
#ugf-navbar-inner {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  height: 59px;
}
[layout="2013"] #ugf-navbar-inner {
  height: 40px;
}
[layout="2016C"] #ugf-navbar-inner {
  background: #f9f9f9;
  border-bottom: none;
}
[layout^="2018"] #ugf-navbar-inner {
  background: #fafafa;
  border-bottom: 1px solid #ebebeb;
}
[layout="2019"] #ugf-navbar-inner {
  height: 54px;
}
[location="gplex"] #ugf-navbar-inner {
  border-bottom: 1px solid #e5e5e5 !important;
  height: 59px !important;
}
#ugf-navbar-left {
  width: 120px;
  opacity: 0;
}
[location="gplex"] #ugf-navbar-left {
  width: 150px;
  opacity: 1;
  padding-left: 18px;
  color: #dd4b39;
  font: 20px "Arial";
  white-space: nowrap;
}
[layout="2013L"] #ugf-navbar-left {
  opacity: 1;
  padding-left: 18px;
  color: #dd4b39;
  font: 20px "Arial";
}
[layout="2016C"] #ugf-navbar-left,
[layout^="2018"] #ugf-navbar-left {
  width: 150px;
}
[layout="2019"] #ugf-navbar-left {
  width: 154px;
}
#ugf-navbar-middle {
  height: 100%;
  width: 629px;
}
[location="gplex"] #ugf-top-right,
[location="gplex"] #ugf-navbar-middle,
[location="gplex"] #ugf-navbar-right {
  display: none;
}
.ugf-tab {
  margin: 0 8px;
  padding: 3px 8px 0 8px;
  color: #777 !important;
  text-decoration: none !important;
  font-size: 13px;
  border-bottom: 3px solid transparent;
  height: 53px;
  cursor: pointer;
}
.ugf-tab:hover {
  color: #222 !important;
}
.ugf-tab.active {
  border-bottom: 3px solid #4285f4;
  color: #4285f4 !important;
  font-weight: bold;
}
[layout="2013"] .ugf-tab.active,
[layout="2014"] .ugf-tab.active,
[layout="2015"] .ugf-tab.active,
[layout="2015L"] .ugf-tab.active,
[layout="2016L"] .ugf-tab.active {
  color: #dd4b39 !important;
  border-bottom-color: #dd4b39;
}
.ugf-sidebar-tab {
  padding: 5px 0 5px 15px;
  color: #333 !important;
  text-decoration: none !important;
  font-size: 15px;
  cursor: pointer;
  display: block;
}
[layout="2012"] .ugf-sidebar-tab {
  widthL 160px;
}
[layout="2013L"] .ugf-sidebar-tab {
  padding: 6px 0 6px 11px;
  font-size: 13px;
  color: #222 !important;
  border-left: 5px solid transparent;
}
[layout="2012"] .ugf-sidebar-tab:hover {
  background: #eee;
}
.ugf-sidebar-tab:not(.active):hover {
  background: #eee;
}
.ugf-sidebar-tab.active {
  color: #dd4b39 !important;
  border-left-color: #dd4b39;
}
[layout="2013L"] .ugf-sidebar-tab.active {
  border-left: 5px solid #dd4b39;
}
.ugf-sidebar-tab .ugf-tab-icon {
  background: url(https://www.google.com/images/nav_logo124.png);
  width: 20px;
  height: 20px;
  background-position: 0 -131px;
  margin-right: 9px;
}
[layout="2013L"] .ugf-sidebar-tab .ugf-tab-icon {
  display: none;
}
#ugf-all-item .ugf-tab-icon {
  background-position: 0 -131px;
}
#ugf-all-item.active .ugf-tab-icon {
  background-position: -20px -131px;
}
#ugf-images-item .ugf-tab-icon {
  background-position: -40px -131px;
}
#ugf-images-item.active .ugf-tab-icon {
  background-position: -60px -131px;
}
#ugf-videos-item .ugf-tab-icon {
  background-position: -80px -131px;
}
#ugf-videos-item.active .ugf-tab-icon {
  background-position: -100px -131px;
}
#ugf-news-item .ugf-tab-icon {
  background-position: -120px -131px;
}
#ugf-news-item.active .ugf-tab-icon {
  background-position: -140px -131px;
}
#ugf-maps-item .ugf-tab-icon {
  background-position: -80px -151px;
}
#ugf-maps-item.active .ugf-tab-icon {
  background-position: -100px -151px;
}
html:not([layout="2013"]):not([layout="2013L"]):not([layout="2014"]):not([layout="2015"]):not([layout="2015L"]) #ugf-web-text {
  display: none;
}
html:not([layout="2012"]) #ugf-everything-text {
  display: none;
}
html:not([layout="2016"]):not([layout="2016C"]):not([layout="2016L"]):not([layout^="2018"]):not([layout="2019"]):not([layout="retro"]) #ugf-all-text {
  display: none;
}
[layout="2013"] .ugf-tab {
  height: 35px;
  margin: 0 8px;
  padding: 2px 8px 0;
}
[layout="2016C"] .ugf-tab,
[layout^="2018"] .ugf-tab {
  height: 40px;
  margin: 16px 0 0;
  padding: 0 16px;
}
[layout="2019"] .ugf-tab {
  height: 40px;
  margin: 11px 0 0;
  padding: 0 16px;
}
[layout^="2018"] .ugf-tab.active,
[layout="2019"] .ugf-tab.active {
  color: #1A73E8 !important;
  border-bottom-color: #1A73E8;
}
[layout="2016C"] .ugf-tab {
  border-bottom-color: transparent !important;
}
[layout="retro"] .ugf-tab {
  color: #00f !important;
  text-decoration: underline !important;
  font-size: 18px;
  border-bottom: none !important;
}
[layout="retro"] .ugf-tab.active {
  color: #000 !important;
  text-decoration: none !important;
}
#ugf-settings-item,
#ugf-settings-tab {
  margin-left: auto;
  display: none;
}
[layout="2016C"] #ugf-settings-tab,
[layout^="2018"] #ugf-settings-tab,
[layout="2019"] #ugf-settings-tab {
  display: flex;
}
[layout="2013L"] #ugf-settings-button,
[layout="2015L"] #ugf-settings-button,
[layout="2016L"] #ugf-settings-button,
[layout="2016C"] #ugf-settings-button,
[layout^="2018"] #ugf-settings-button,
[layout="2019"] #ugf-settings-button {
  display: none;
}
[legacy-gbar] .ugf-hide-on-legacy {
  display: none !important;
}
#ugf-navbar-right {
  margin-left: auto;
  margin-right: 30px;
}
#ugf-personal-buttons {
  margin-right: 16px;
}
html:not([logged-in="true"]) #ugf-personal-buttons,
[legacy-gbar] #ugf-personal-buttons,
html[layout="2016C"] #ugf-personal-buttons,
html[layout^="2018"] #ugf-personal-buttons,
html[layout="2019"] #ugf-personal-buttons {
  display: none;
}
#ugf-personal-button {
  border-radius: 2px 0 0 2px !important;
}
#ugf-non-personal-button {
  border-radius: 0 2px 2px 0 !important;
}
.ugf-button-active,
.ugf-button-active:hover,
.ugf-button-active:active,
.ugf-button-active:focus {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1) !important;
  border: 1px solid #ccc !important;
  background: linear-gradient(to bottom,#eee,#e0e0e0) !important;
}
#ugf-personal-buttons .ugf-button-icon {
  background-position: -26px -328px;
  height: 14px;
  width: 14px;
  background-image: url(https://www.google.com/images/nav_logo114.png);
}
#ugf-non-personal-button .ugf-button-icon {
  background-position: -40px -328px;
}
#ugf-personal-buttons .ugf-button,
#ugf-settings-button,
[layout="2012"] #ugf-hp-buttons a,
[layout="2013"] #ugf-hp-buttons a,
[layout="2014"] #ugf-hp-buttons a,
[layout="2015"] #ugf-hp-buttons a {
  background-image: linear-gradient(to bottom,#f5f5f5,#f1f1f1);
  border: 1px solid rgba(0,0,0,0.1);
  color: #444;
  padding: 0 8px;
  min-width: 54px;
  border-radius: 2px;
  cursor: default;
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: bold;
  height: 27px;
  line-height: 27px;
  width: fit-content;
  /*transition: all 0.218s;*/
}
#ugf-personal-buttons .ugf-button:hover,
#ugf-settings-button:hover,
[layout="2012"] #ugf-hp-buttons a:hover,
[layout="2013"] #ugf-hp-buttons a:hover,
[layout="2014"] #ugf-hp-buttons a:hover,
[layout="2015"] #ugf-hp-buttons a:hover {
  border: 1px solid #c6c6c6;
  background: linear-gradient(to bottom,#f8f8f8,#f1f1f1);
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  color: #222;
}
#ugf-personal-buttons .ugf-button:active,
#ugf-settings-button:active,
[layout="2012"] #ugf-hp-buttons a:active,
[layout="2013"] #ugf-hp-buttons a:active,
[layout="2014"] #ugf-hp-buttons a:active,
[layout="2015"] #ugf-hp-buttons a:active {
  background: linear-gradient(to bottom,#f6f6f6,#f1f1f1);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  color: #333;
}
#ugf-personal-buttons .ugf-buttofn:focus,
#ugf-settings-button:focus,
[layout="2012"] #ugf-hp-buttons a:active,
[layout="2013"] #ugf-hp-buttons a:active,
[layout="2014"] #ugf-hp-buttons a:active,
[layout="2015"] #ugf-hp-buttons a:active {
  border: 1px solid #4d90fe;
}
#ugf-personal-buttons .ugf-button {
  min-width: 26px;
}
#ugf-personal-buttons .ugf-button-icon {
  display: block;
}
#ugf-personal-buttons .ugf-button-inner,
#ugf-settings-button .ugf-button-inner {
  margin: 0 auto;
}
#ugf-settings-button .ugf-button-icon {
  background: url(https://www.google.com/images/nav_logo242.png) no-repeat;
  opacity: 0.667;
  vertical-align: middle;
  display: block;
  background-position: -42px -259px;
  width: 17px;
  height: 17px;
  margin: 0 auto;
}
#ugf-settings-button:hover .ugf-button-icon {
  opacity: 0.9;
}
#ugf-content {
  display: flex;
}
html:not([location="images"]) #ugf-left {
  width: 130px;
  min-width: 130px;
}
[layout="retro"]:not([location="images"]) #ugf-left {
  width: 0;
  min-width: 0;
}
[layout="2013"] #ugf-left,
[layout="2013L"] #ugf-left,
[layout="2015L"] #ugf-left,
[layout="2016L"] #ugf-left {
  width: 130px;
  min-width: 130px;
}
[layout="2012"] #ugf-left {
  width: 175px !important;
  min-width: 175px !important;
  padding-left: 28px;
  margin-right: 18px;
}
html[layout="2016C"] #ugf-left,
html[layout^="2018"]:not([location="images"]) #ugf-left {
  width: 150px;
  min-width: 150px;
}
html[layout="2019"]:not([location="images"]) #ugf-left {
  width: 158px;
  min-width: 158px;
}
[layout="2015L"] #ugf-sidebar,
[layout="2016L"] #ugf-sidebar {
  padding-top: 43px;
  padding-left: 16px;
}
[layout="2012"] #ugf-sidebar,
[layout="2013L"] #ugf-sidebar {
  padding-top: 20px;
}
html:not([layout="2010"]):not([layout="2011"]):not([layout="2012"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]) .ugf-sidebar-tools,
html:not([layout="2010"]):not([layout="2011"]):not([layout="2012"]):not([layout="2013L"]) #ugf-sidebar-nav {
  display: none;
}
.ugf-sidebar-section {
  margin-bottom: 13px;
}
.ugf-sidebar-tool {
  font-size: 13px;
  padding-bottom: 3px;
}
.ugf-sidebar-tool a {
  color: #222;
}
.ugf-sidebar-tool.active {
  cursor: text;
  font-weight: bold;
}
[layout="2012"] .ugf-sidebar-tool a {
  color: #777;
}
.ugf-sidebar-tool.active a {
  pointer-events: none;
  color: #dd4b39;
}
[layout="2012"] .ugf-sidebar-tools {
  padding: 0 24px;
}
[layout="2013L"] .ugf-sidebar-tools {
  padding: 0 16px;
}

#ugf-search-results {
  max-width: 512px;
}
[layout="retro"] #ugf-search-results {
  max-width: 100vw;
}
[layout="2016C"] #ugf-search-results {
  max-width: 638px;
}
[layout="2012"] #ugf-search-results,
[layout="2013L"] #ugf-search-results {
  margin-top: 20px;
}
#ugf-search-results-header {
  color: #808080;
  padding-left: 8px;
  padding-top: 2px;
  padding-bottom: 0;
  padding-right: 8px;
  font-size: 13px;
  height: 43px;
}
[layout="2012"] #ugf-search-results-header {
  position: absolute;
  top: 66px;
  color: #000;
  font-size: 11px;
  margin-left: 2px;
}
[layout="2013L"] #ugf-search-results-header {
  position: absolute;
  top: 113px;
}
[layout="2013L"] #ugf-search-results-header,
[layout="2015L"] #ugf-search-results-header,
[layout="2016L"] #ugf-search-results-header {
  padding-top: 0;
}
#ugf-search-results-container {
  padding: 0 8px;
}
[layout="2019"] #ugf-search-results-container {
  padding: 0 12px;
}
#ugf-search-results-neuro-playground,
#ugf-search-results-reserved-top {
  padding: 0 8px;
}
#ugf-search-results-reserved-fake-iframe {
  padding: 0 8px;
  margin-bottom: 20px;
  display: none;
}
[has-fake-iframe] #ugf-search-results-reserved-fake-iframe {
  display: block;
}
#ugf-search-results-reserved-fake-iframe block-component > div > div  {
  border-radius: 2px;
}
block-component > div {
  display: block;
  max-width: 550px;
}
.ugf-search-result {
  padding: 8px 0;
}
[layout="2012"] .ugf-search-result,
[layout="2013L"] .ugf-search-result,
[layout="2015L"] .ugf-search-result,
[layout="2016L"] .ugf-search-result {
  padding: 0;
  margin-bottom: 23px;
}
[layout="2019"] .ugf-search-result {
  padding: 0;
  margin-bottom: 26px;
}
[layout="2019"] .ugf-search-result:first-of-type {
  margin-top: 6px;
}
[layout="2016C"] .ugf-search-result {
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.2);
  background: #fff;
}
.ugf-search-result-inner {
  display: flex;
  flex-direction: column;
}
.ugf-search-result-title {
  color: #1a0dab;
  font-size: 18px;
  line-height: 22px;
}
[layout="2012"] .ugf-search-result-title,
[layout="2013"] .ugf-search-result-title,
[layout="2013L"] .ugf-search-result-title {
  color: #12c;
  font-size: 16px;
  text-decoration: underline;
}
[layout="2015L"] .ugf-search-result-title,
[layout="2016L"] .ugf-search-result-title {
  font-size: 16px;
  text-decoration: underline;
}
[layout="retro"] .ugf-search-result-title {
  font-size: 14px;
  text-decoration: underline;
  color: #00f;
}
.ugf-search-result-title:visited {
  color: #681da8;
}
[layout="retro"]  .ugf-search-result-title:visited {
  color: #f00;
}
[layout="2012"] .ugf-keyword,
[layout="2013"] .ugf-keyword,
[layout="2013L"] .ugf-keyword,
[layout="2014"] .ugf-keyword,
[layout="2015L"] .ugf-keyword,
[layout="2016L"] .ugf-keyword {
  font-weight: bold;
}
.ugf-search-result-link {
  color: #006621 !important;
  font-size: 13px;
  margin: 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
[layout="2012"] .ugf-search-result-link,
[layout="2013"] .ugf-search-result-link,
[layout="2013L"] .ugf-search-result-link {
  color: #093 !important;
}
[layout="2019"] .ugf-search-result-link {
  font-size: 14px;
  margin: 3px 0;
}
.ugf-search-result-desc,
.ugf-search-result-desc span,
.ugf-search-result-desc div,
.ugf-search-result-desc div > span:nth-of-type(2),
.ugf-search-result-desc em {
  font-size: 13px !important;
  color: #545454 !important;
}
[layout="2012"] .ugf-search-result-desc div > span:nth-of-type(2),
[layout="2012"] .ugf-search-result-desc em,
[layout="2013"] .ugf-search-result-desc div > span:nth-of-type(2),
[layout="2013"] .ugf-search-result-desc em,
[layout="2013L"] .ugf-search-result-desc div > span:nth-of-type(2),
[layout="2013L"] .ugf-search-result-desc em {
  color: #222 !important;
}
#ugf-logo-cont {
  padding-left: 5px;
  padding-right: 18px;
  margin-top: -2px;
  padding-top: 2px;
  margin-top: -4px;
}
[layout="2016C"] #ugf-logo-cont,
[layout^="2018"] #ugf-logo-cont {
  padding-left: 5px;
  padding-right: 17px;
  margin-top: 2px;
}
[layout="2019"] #ugf-logo-cont {
  padding-left: 22px;
  padding-right: 25px;
  padding-top: 7px;
}
[layout="2012"] #ugf-logo-cont {
  padding-right: 78px;
  padding-left: 27px;
  padding-right: 54px;
  padding-left: 36px;
  padding-right: 62px;
  padding-top: 3px;
}
[layout="2013L"] #ugf-logo-cont {
  padding-right: 21px;
  padding-left: 10px;
}
#ugf-logo {
  display: block;
  height: 37px;
  width: 95px;
  overflow: hidden;
  position: relative;
}
[layout="2012"] #ugf-logo-cont,
[layout="2013"] #ugf-logo-cont,
[layout="2013L"] #ugf-logo-cont,
[layout="2014"] #ugf-logo-cont,
[layout="2015"] #ugf-logo-cont,
[layout="2015L"] #ugf-logo-cont {
  margin-top: 0px;
}
[layout="2016C"] #ugf-logo,
[layout^="2018"] #ugf-logo {
  display: block;
  height: 44px;
  width: 120px;
  overflow: hidden;
  position: relative;
}
[layout="2012"] #ugf-logo {
  display: block;
  height: 41px;
  width: 114px;
}
[layout="retro"] #ugf-logo {
  display: block;
  height: 41px;
  width: 300px;
}
[layout="2012"] #ugf-logo img,
[layout="2013"] #ugf-logo img,
[layout="2013L"] #ugf-logo img,
[layout="2014"] #ugf-logo img,
[layout="2015"] #ugf-logo img,
[layout="2015L"] #ugf-logo img,
[layout="2016"] #ugf-logo img,
[layout="2016L"] #ugf-logo img {
  border: 0;
  left: 0;
  position: absolute;
  top: -41px;
}
html:not([layout="retro"]) #retro-logo,
html:not([layout="2012"]) #jfk-logo,
html:not([layout="2012"]):not([layout="2013"]):not([layout="2013L"]) #melvin-hp-logo,
html:not([layout="2013"]):not([layout="2013L"]) #melvin-logo,
html:not([layout="2014"]):not([layout="2015"]):not([layout="2015L"]) #chopper-old-logo,
html:not([layout="2016"]):not([layout="2016L"]) #chopper-logo,
html:not([layout="2016"]):not([layout="2016L"]):not([layout="2016C"]):not([layout^="2018"]):not([layout="2017"]):not([layout="2019"]) #modern-logo,
html:not([layout="2016C"]):not([layout^="2018"]):not([layout="2017"]) #shira-logo,
html:not([layout="2019"]) #mazira-logo {
  display: none;
}
#ugf-search {
  margin-top: -1px;
  position: relative;
}
[layout="2013"] #ugf-search,
[layout="2013L"] #ugf-search,
[layout="2014"] #ugf-search,
[layout="2015"] #ugf-search,
[layout="2015L"] #ugf-search,
[layout="2016L"] #ugf-search {
  margin-top: 1px;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]) #ugf-searchbar {
  border: 1px solid rgb(217, 217, 217);
  background: #fff;
  height: 38px;
  font-size: 16px;
  width: 577px;
  width: 588px;
  margin-top: 1px;
  margin-top: 0;
  height: 38.25px;
  transition-duration: 0.3s;
  transition-duration: 0s;
}
html:not([layout="2012"]):not([layout="2013"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]):not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]):not([location="home"]) #ugf-searchbar {
  border-right: none !important;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]) #ugf-searchbar:hover {
  border: 1px solid rgb(180,180,180);
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"])[search-focus="hard"] #ugf-searchbar {
  border: 1px solid #08c;
  border: 1px solid #4d90fe;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
  box-shadow: none;
}
html:not([layout="2012"]):not([layout="2013"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]):not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"])[search-focus="hard"]:has(.ugf-search-prediction) #ugf-searchbar {
  border-bottom: 1px solid transparent;
  transition: all 0.3s, border-bottom 0s;
}
#ugf-searchbar,
#ugf-search-btn {
  position: relative;
  z-index: 51;
}
[layout="2016C"] #ugf-search,
[layout^="2018"] #ugf-search {
  background: #fff;
  height: 44px;
  width: 632px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16),0 0 0 1px rgba(0,0,0,0.08);
  border-radius: 2px;
  margin-top: -4px;
}
[layout="2019"] #ugf-search {
  background: #fff;
  height: 44px;
  width: 632px;
  border-radius: 24px;
  margin-top: -4px;
  border: 1px solid #dfe1e5;
}
[layout="2016C"][search-focus] #ugf-search,
[layout^="2018"][search-focus] #ugf-search {
  box-shadow: 0 2.35px 5px 0 rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.08);
}
[layout="2016C"] #ugf-search:hover,
[layout^="2018"] #ugf-search:hover {
  box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.08);
}
[layout="2019"][search-focus="hard"] #ugf-search,
[layout="2019"] #ugf-search:hover,
[layout="retro"] #ugf-search:hover {
  box-shadow: 0 1px 6px 0 rgba(32,33,36,0.28);
  border-color: transparent;
}
[layout="2019"][search-focus]:has(.ugf-search-prediction) #ugf-search {
  border-radius: 24px 24px 0 0;
}
[layout="2016C"] #ugf-searchbar,
[layout^="2018"] #ugf-searchbar,
[layout="2019"] #ugf-searchbar {
  width: 588px;
  height: 42px;
  margin-top: -2px;
}
[layout="2012"] #ugf-searchbar,
[layout="2013"] #ugf-searchbar,
[layout="2013L"]:not([location="home"]) #ugf-searchbar,
[layout="2014"] #ugf-searchbar,
[layout="2015"] #ugf-searchbar,
[layout="2015L"]:not([location="home"]) #ugf-searchbar,
[layout="2016L"]:not([location="home"]) #ugf-searchbar {
  height: 28px !important;
}
[layout="2012"]:not([location="home"]):not([search-focus="hard"]) #ugf-searchbar:not(:hover),
[layout="2013"]:not([location="home"]):not([search-focus="hard"]) #ugf-searchbar:not(:hover),
[layout="2013L"]:not([location="home"]):not([search-focus="hard"]) #ugf-searchbar:not(:hover),
[layout="2014"]:not([location="home"]):not([search-focus="hard"]) #ugf-searchbar:not(:hover),
[layout="2015"]:not([location="home"]):not([search-focus="hard"]) #ugf-searchbar:not(:hover),
[layout="2015L"]:not([location="home"]):not([search-focus="hard"]) #ugf-searchbar:not(:hover),
[layout="2016L"]:not([location="home"]):not([search-focus="hard"]) #ugf-searchbar:not(:hover) {
  border-color: 1px solid #d9d9d9 !important;
  border-top-color: #c0c0c0 !important;
}
#ugf-search-value {
  height: 100%;
  width: 97%;
  outline: none;
  border: none;
  background: none;
  font-size: 16px;
  padding-left: 9px;
}
[layout="2016C"] #ugf-search-value,
[layout^="2018"] #ugf-search-value {
  padding-left: 16px;
}
[layout="2019"] #ugf-search-value {
  padding-left: 20px;
}
[layout="2012"] #ugf-search-value {
  font-size: 18px;
}
#ugf-search-btn {
  cursor: pointer;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]):not([layout="retro"]) #ugf-search-btn {
    background-color: #4285f4 !important;
    background-image: none !important;
    height: 40px !important;
    width: 40px !important;
    margin-right: 0 !important;
    border-radius: 0 2px 2px 0;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]) #ugf-search-btn:hover {
  background-color: #3b78e7 !important;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]) #ugf-search-btn:active {
  background-color: #3367d6 !important;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]) #ugf-search-btn::after {
    content: "";
    /*background-image: url(https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fwww.google.ie%2Fimages%2Fnav_logo242.png&sp=1696043460Tea6a03ff1af40fa838a22e88fa1f9ce69dad31290a7013d531dd22b762bc4d28) !important;*/
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAAGaCAYAAABqhVMrAABBWUlEQVR4AeybBXDqaBeGT7e67u7uVkivrEASrq67u7u7sFOg8ru7u/u/Rtfd3d2BOoErFbLvmQ53vpwJ2kKv0Jmnhp+8OR5anr6OC9pNeru1p96RWqhHrOP1SPLoQCh5oNkxvCGgVYsa0/4G5n8702xErFP9keSdIG1EUnYOXoVg7zDC6S0B1chN65+OPTeL50/Hng5oRWTaXjgYtFczwqlz/eHkZyy+YoGAl+qh1Nd8wfhagAQ1gPdPx9jL+MNRQ4BWRKblRQ8Kpzb3h1L3s9jKJpR6x2y39gbkpEZNnGWitw/v6g8lP3L3iqlhhPj/GeHkV+FVb8Hv7fCSv0U4f9/1/vC6M7+eWR3QMmrUxFkOga5F2yAsfypFpkdSb3Pe6QvaLYAkZNt1ZseiWZyXLhNmyEoZkeRBgBzUqImzVLgSh+GekcKEh/wOF0WACsEiRSV/GkJ6oibMmjinDHjHW6Uwwc2ASuXQoL0GIFdq1MRZCgdGkhvLNhHyyF+yJwRUY2pZqcUJ8XSBH4I6QFPA7aLSTgS6BtYFVGPqWc7FKbU2AzwHtpK6cRNSlyKkgwFNGrR93MN59Yn7tM16De9hvab3fCZhaofGjBmbAioX+wHabLSn6bCRaOP5zGi0/tBMD20KaDLooaEdzZB1AiZlFyHSnOzrGNoJUCFKEecHPl9LQtcOThht58RN7aKYoR2VmNe6OaBqwMIENnhXCjSfMC8CNFnMzsU7yFxzOqY8sYBmxk3v/RCjLYmZWiZheHp6TY8fULGM3ltvLr238f7RnkZbgv9nlvY09kCofkClYHakDhXFo8pD6GzsMxGNkh8q7FFKQTQ0d+YGEOM3Y7pn2M0eMcP7vz6jbQ9AlYQFycJ0E2hFhcmgF3mMalw0398CVC3s4/Zogih/ykYvDu8PbY+nEVBO/kJNENFPWYRFEW38of0sNQLKx8QoN/nrwgOI5CLY9Wn1f75waj9AoKA4+wxPGzzk5wVtoWtLEgHteECVJJdAKypMBmHpaqfXtP4NqBB4nJ9n6aUAj6IDymIfd1w9vMO/CwtSYGh/t4O0GiAJhFk/Em34d0FBCkZ6GnI/JzjuL3Y926a8iVnx4oyZrXvHTE+yWFvEdG08YXgXAKokbgKtqDDdiiGe+AAqCMRW6gHyR6wfAsoC497qErKei+ve0/oCM3bnsBU3tDMTpudFeb+40XY9IAmEeasUHsL7c2P3NZ625N6m3Zf0NO2BcH4mPOuLLgK9HpAbbq02eP6X0Ac+0xex9mLxQbxXwrN+Xq44J6KI5zXnZ/UsRmQJf6Fre35qahvGAm0zcUL/Qdij9zOfZyNAlUQKtBrivF4Y8m+FH1OGOIXwOannsOQQnKn9yPb5GgCpcBhHmPu5CGnpz+fvtzGgLJm7aHMIb4lTmI0/QkHUAEiFw/hoT/3P1fvisenMnbQxIJVAd3oLjHSXyFYbpmMNgJwkN4JAXyhHnFz0iBN1EGnM/oAkbCvnyap9A1AlcRNnhQVqneowejj5PKBClCFOYP0cEINQcbNTbJ7HOcwDcgWijZneZ9XH9BraNYCywMPdLLzh4xzmAbkC0SLffFZ4z2sAqcA7Bp2pT/JZz4/tRkBucBWPvHOkZHGa2mOOz2dqJwNSgQ12wG1fjeuefqeQPcm4b4+1AFWAnGG9wgK19nGGquRYMT1Orj7BsXkJp74hvE0XIMBGftgpNO9hgPIRD3iPFt4zCigLvOTDTnE2HQYoL/c2HS28ZxSQiixuuIgElA9Ehz+WIs4v5uyzJuePSjiPKSdrPbfU4EnvBBmXVGgkbnh/X6EWU8GCqGIC5b1NbroLL3cOoMkCEYadXjl1NiAGnrJPNTAfHED5GAh41lUfwxUtoCwQUp8qtMw9tCagfNhRWleI83NAWXhKxtW3+jnmB/vWAZQP5KjnlSJOLoREJLmL0xaE0xsg1A/4fy58iHz0pi/mzNoEUCVwE2Z1m/BY7hDifFOGrVLhg4oD9LJDnLjEAxDDZ7tiZAtQUah5KvJOQFnQuxxR+pgWoKJAnqrmnYCy8EKMWKZOAyoEereHlSJOFIGzVeFx2I7r2lK3Hie4kz2pSIMqQcEmvGTKx5e4HGMXGHR8CqdECG2peSKkv6/O6jnZV9shb8/fqRlQPjincnoXbxxQFghtUBHZOIqZZkD5QN65lvCccek51fyR7VTMlpbM5QuJE5OsffL3NDnSeLs55wRUJQqOL6sCxPNTmXvy2Q+oVHiRhKciYif0RkBZYPAnVePzhAhQPnCAFooi4CFAWVDcPClaSCagvNxXv1A05B8CpIK05xVR2OmA8pP6fini5BMvm3PKQhHToFN5jAloeaJqLzQ3OLSBXDRmj4FR3RmAimVOaPH26P+9Jjbo4zJPQwIfEpOfe2yiOkCuoEGOvPJBcfBuBZQF4go5vGC08R7bpjpAruA5cb8H1cdwnxSQCl8TJar1/+fb2OKrUWGDoclW6wj1XweUi97Zs9f+wt86A9B0UM0Xg+HSM2XyD4D1LzVfdIMvx/CHrcsnLuWQl2ukjwCkgGS7bXvMjceckx9vMIdA6zAV6pAVav9c79aAsiy+p3l7hOIx0RoK5hBoHW7vEPP2kczdLVsDUsiZ9rgINHu16v/K6XPywEH2crH8ogGSfDxz5uqwwf9BBkXR1/hvQNWEv1UVeL/57gJlrCcwBQnh54l8PxYd0oHL4El+g9A3IO8vw7mEG8cyjPFCAy94fHaoZw2u4Dncs1eV94OQOwFJILJvAFvkkf/jBQ/7P7QGV/Ac7tmryvuBTkBucNHodtLyxj8vV3Nk4IUQiPi5sidE6OXyNEwKlCME2IVDO1fm+JwnykkSTt5XZN5eafhbtYFA05rIGUtmwtNYVwDKBRtbhrJi4FyTR32AJChwWtDvfKzU2TrnmrwwAsgNjgw4MZ+s9Gy9d65nNxQiAyXbxNAuBFRN+Nu04AsOrsdJPRdGZRyMN4u9hqhvfts6HJ6KPQi8KFJoEoIqfB14xv8XK0xeFOGqHVA+2Cbw+NGCJyZsxnl3uVtJcb1tX7SRPirKHtxuwtgTULXhb9MK73vypAeh+4vCouSwnzqz1B4pFyZxs+105KBv5/aW2psY350ic9J8BdRYtPF0zM/flmJUqvk3cZ9TRE6ah+x2UvpC2OOTXNfr6yHLwO/fVv/PyyGAQEFxMoO+fdfjMSWwcu248okqdzqrCX9bLuDknw3M/Tve0NHDVjeIIOe8inMtbh8BmgwThU9rKxL8i7kAYnj7m5cfpCiLBsJDztkK73gxF0DMyL0NF8Gz7l9AlIVFiujAn5/twAs0SGV8/H/Aa4W/UMU5N7Roa0Clwrk3bDCft7C4z4nf7+CTtDew/xaAphP+VmNaUQAHdg6tP7u7d21A+VA35XmjSdlgWmlYTt5IDaQrrfCQP+NOBiLH1wHlItD+JXtnAR7FnYbxD0sluFOJ1FMFNgkcpE+83p4AdXc39K7udord1d3diztUInV3IzS9QgQPmXvfMhO+/m82M7uZDdll53l+bOa/k2XyzLvf39+vNstY9zkfSKKx+W8iieOEskFNTjSyeQPEhAZmbHtrcXL8F0ii0UZuJInrOCfHd9HupPEZB+q5movWPebsmG4GJBJt5EaSRDXOiQirZ8cSjTZ0M0k4zoloOc23T+mN9acASVTa2A0l4eJsik5V3wa167GY+km1Tz1haaM3loTjvlwMgy3Sx3F9wcaV73WlW5KNjzpJZJIkxZkkSVKcSZLiTJIkKc4kOEJgvE0IRH30GFWWAs4Hc8FaG/7MshQgkVL+lWXd/FjrwP8LCP/TzUwSHCXgZnA74c8si1KY24NKMAnkgxSbfLus0r5GIgGiifnxS12D9cWyRuv4mz4lIvgnyWYEx062GMkoos53iiJivgsuU8I6GBSp88vsa1ISRZyOd+T+sEI5l94+WEFzDcffuPA1+gQCSXCMV8J0Dkeg4yMU5/lgEhBFBZhnlE3itXEvTia14p5zrMCubc7MlItfS66t2RVIopH72B/3Cz32x5kKCQgtTl2Nl0QpzgUgD4gHeWBB3IqTNik0xopojw+dK5B5jVNwQBKF0KMjCvTWByABoYVIQkSdl0QozrUu1fWFYLJRlsJr41KcXIDABayuERKe5PTBpD0081cyk5pb4isgiUIsxQl09NSwTAIQ56PgfaOsM6iLO3Fy6Za5mJVOHczwW3pbYyoQDa+nu5uT/Zd5LenKASRRaAVxhlQvndwOQlGIczH4nQ9x8prFQYvz++9XxlacaDveYVqj+FlswGhL81bupgSSOMRYnO7Rc3yUw0gXgX/6EOc/eW3Q4kxLe9OaMqXKamhoDF6cJdfV5hnbUGey7QlkS6aVxFkCbie6rRnAUNLh4NzWGErq3n2J1aXLW9awYR9YixfXBStOtCNfU+JcXnpVXV8gWzqtIU6iIqc+ohmEp/j+CfKNHjrL3o3VIHyPHktAmdWtGwCnnPKFtXTpupaLM//mlTtw2b8S55VAYgkzpy0ryTmQuW74GqmDLrOkwbjgwIbpnY7kK3yK+gLxgWOIVVh4/coz2Z4Gg8M4u/kSJ/e9Vxdm715VlPsHmEWMqi7JyY7QfNWJnkQCmL68CMwFls0ClqmIGTNxOnTt+haq+gpr4sQqa926xujFSSeN3zhI3LQ6A0gsoMsujA1mublM0Ifdy3Zv3ayOw2BaMCtM1rQZ62Z3HALEDQ5zbfRYqq8Globe7Mx/xOEzhZc4bS/50Psunkvf44t3hl/DBurKps0d0YiTOJGUVf28ebVRi/Pv6iH9ACQW0FmCIvRKzITXS4GYMJcPRahFaULXYThwXApEQxsb/J1Pe+zNWWmUhRUnRaed7MKBL+JdKkFWHNIycQK0R8usXr3KrDPO+NL64Ye1kYmTY5c6gniJjNf5gBaFDwEhjCJGZFlP43zmvIHt3mumnybKTwLiAFGeYUTK9RDiq8wFhNfXTO9M+BSdBMQB22j/8dsOX91XG8vqrsX5LKfcrzhxzxcbX6oVeL0Hti43m3k2mRgASJzSMnEqttnmTau4+EPrp5/W+Rcn90irTVRvAQmPf3FyNyEQti9RZddrv8dl+YN2AeLANhuq/A+da5g0lFnFgLB9CfHVbxJfh/dWz9lqFyAOa2al7I7yD1UErWmcIb2AMOWMblMj19F95kgE08ewKvcjTmaioLelio6znXt1YFZinUfy5/zcHYDEI0FEzj59yq1rr/3eqq/fEGm1Xnubzofulag/Ah/NV4BAjJfphEs/Fw3dHojJj4WD0o2HPhawOr9MRczaxpnbbA/k/5i1dTozVij7wbFAmHpQRfMPwznVMX2MH3GijXmJzunDNDFACDtCzHvE2sDNkDYOaZE42TEaMeJT65NPVkfZ5jSzM9xQuweQsMAWJRw6OQEjFBDDb30yEHdYjYTuUNdOB6K91WHEOhlIOBA971BCng5Eb7VlslggbjDVnx9x6oSvtKUGwmiKUYcJzN/j4nM556fi3EOBBA2eazF4GvwENtivT4ECIEEQjThTU9+y9t77XeuFF36xGnVnPQpx9tN+PTi/FUg0MKGo8znYgz0GCNpj3zoPil6ZQMJh5Gj8HDByfqvakicCCQci52nKI/NzIDqdCkRYAiQctHjxjJxFoUrVRJmC1wfNvD52dt5JMfK4pGg6grtBc8ftvK41xcmB+P79K6yrr/7eqoPgAhqEhwe5WuQRzXASxwt15OE5YKqU75Qv+/FAwoF25ykqFcmXQOB5+V2TOGd2Oh5IONbO6nSKapt+CYIXp0umYdW+fLe6KHRWLHNFEiXMevAXkAbag3RwGVipBBpzcXKGiOL805+MKjwQcVJI6DTojpFdVYsf2MHAKqXFqm33rtN2RXRZ6DfFCKON7mgAVtcLVU/8b0DCgWsnqWp9NmA0/0SlIRwLxA24Cm8fUbWu80MiFfSy0tBwPa4ZM1CVK2FmA3EhRwk0P9bi3GefcuvFF5fHcuGH6hgRmEtx9ghIc9D01Jj+hDhr/wQE8GFeo1PbhcvfzV49h2TMXEAQ3DWqF/5feKj3BmLg9OpXmHl/ILzJ6t4+hyfm1kAM9N/vUa1nX6TFGS41NJ2DkSCgBEiQ2G1MHn/xENYVgMeTsRbn8uWrY7sqib1Y00yKuX/wcK9gVAGi4WokepibSeo5bqp7/Mzpo/NKMpKa05XL8nP6q8xrILTKyVTL/D06hyQjqTldCXH211nWEDFXMUc6EBqu6jY1tpk8q6wDnVyaZ7Dm8CPOFQcM7ck2pRLoIpYBcaDvOsdx7VSF963Iy+sBJAjsTg+PNA9hZQIeVUCipc0sNuaeIN3+NA3zwUxUk9Nx/r4aF9TR9nm3/I3MX84HpccxOWgNEB1D9xoPm1xozA6NNmaCapD/5x5GR7zeyyEmI4vFhUAc8DfdaDgC/4y/5WEI9T/sxEU6CM9xTDN/pJ1E/3IMXN/OcyO6ngokCOxeOY/2HsLqAHg0JIQ4CeegOeSiVrp7QqFynNAx1TdwMqXd6ivtCsYEjbabkxXtVmD54CZebyYB0Eb/YaiOZPpSNVe8uAJIQOjIme4hrJ0Aj2UJIU5N/q31/Tdmtaj9NvzeofpaPnRWnUC8YLpkfPvfcX+IobchzIOBhANR8jAMD73jJkq89zZ65wcDcYPVN4a2TmCWYZfZrJeRAjHbjzg1zEYRtveOcuT9OQBIkNjjmDwu8xDWlYDHEy0VJ8QTS6LfGsyHSutnzKuPgFDPgRjPxwM+lg8zmtzpjDo/lwzJ4rASHu4F6KWfwHOW+02xsmZ6ShaHlVBlX9Awq9MJPPebXoU1AxNL4W84Em3mPxZetyodCP9GvaYViB943xzP5N/B5gjHcpcW5uwVq567PcDOYyXIAeLCELAK8MhrqTg/+m5N1HzI1++9r4NAt0xTBX7BuIaTXyggbvALt6kjWPcGkLYKxy+VQK8AmaAD2AlcqYT5GJCWAGcSCqZV2OLsaDjw7qTk49y6mQKbcJxWJz5F7XATkLYKZ36UQMMdTmvxa9U+jQv0SUJDl2BaVqsJhkrumWL1zojKKl7nneS18bJZzx5gfxJUgQawDDyhqnIKk8dXID3ayBmNGZdN0sjLC+brcd2LD3SZ3qaSCFCQtjB5fAnSYtlb150aEPXvbnHGWfR6Yjo+LUQTOp3oCYQEwBHol1qgm1OcavVSUpwaVtfMusv5di4IIZzSZHo/Z6FKImII9AuQFq0499vvE+ueh6qT4gyOJLYgv2yJOLW4Lhj/nfX1dxuS4gyUpECJtFScwIminuLEtV4kxRk5SZoRpxZoUpytT5Jk5EzSZtksbc7LLrss69lnn935rLPO4rRXOyAB0o6fy88/4MADs4DEJ0k2S28dRxbZf//9s/7+97/v+Ne//S0lAJG24+fw8/i5IuLgeRxw3aodMf99NIY+xnMgHD+fhynF4Vil3hFIEkvOPPPMrUE5uANIa7BZxjmPPuaYrN12261JQIcfcUTW6DFjBowfPz4V1xKJgFT+Hn+fn+N8Jj8f/w+RcGAhQzGW3s0Nv1a0vgrTixPUIua4IPvRERMHP/LHj22kpUAo/cB0YIEaEGotcUI4vtHijPZ3KagBt91664BQdnb6kCFDmgQ1bNiwrKn//nfWM8880wvXdPUQZVdex+v5e85n8PP4ufx8XEPEhHt5aDobgb3Nu/FkUDv40RFPBWWdCJH0BG8ACzTYr5+AVCCxJMJVSebcestWJbEqvvvuu3sffMghGVqk+fn5WbfcemvWiy+91BvXdAGi6MJyvs/rtCj5Ofy85poIjILc7qFX0tNbqfjG+sN+3ZbMhc43rQxh/9KfaS7mJMHH+wcBiQOCFme5EuYGJdB7gCQaZgFF0/G6667rho7MLvvss89vRHrqaaftMWv27F+jIF95rkXJ6/l7/H0/G/m1RQxNtYpvqh8ExA1uUWaERVv0YCDxQbDiVMLU4mwEFigG0hYJfFUSxJNy/AknpI4ePXqPAQMGNAkwlJOTNXLkSL42lfF9Xsfr+XtAvGAnR7cnS25elQYkwQhanDOBZQtzPbBs7gW9gbRBYrcq6Ycffuh06ejR206cODFr+x12oBib4DnL+T6vA+IXRMGXlOXiCCAJSNDi3B0sA402r4E8IK1Fj53KTgbLwUAgBixbzmtUWeyXzNXV1XVYMH9+15tvueVXUfJ1Ps5ZDiQSmJ2D7Utnq3FAy9M2Wl8Xhwq4LRfbjOeRX7fqlmTnA3GDe46wKa4Am99ux573eYR+n7C/yQfiBu+XK+uxtO5efMkWwajsVe6pYhuarwCszAXNirO6KLcQBmd3cw8/nZ7B9dUlg7YDEg4IZKKKmPxZWhNbfJaLQAfq94ISZ6vDfTzKsGESkJZCXyLsdHymma25Ty4t3TcViANMGDpjc9wz4bYXQ4hPwqwhFYgD9/Sjg/akc/+mO4paE3o1cBWnFQp1wi7S+8O4Oq+oKgqVAnEDAtkB1AMLrAO5rSxOU4QD3coCE2fPjPKDemRUftEjvXJB790XdgHih8GDBx8UCoW+AAuGDx/eBYgfEHWO82NHyHFPGh+Eg1EXCC2tsdV4mvItWo7zJwgftip/Rdlft4ev/DTlDrIcQn2CaDsblDf9DiMmDSP07kz8/4/Tylvt7/cUJ4Q5ddM9Zf9CQwk6gvC+WUZ/0uoDQnsAcQMiuVhFz/dB6mYWaFhhgujn1ntmVpb2yKhoABbpmVF5LxAvsrOzSyHKBmDZ3AvED9zhaFokukDforc9cm02AuH2Yu2DqWxfbNuY7PnKleMYINxSrJxD5lgLpAcQ0via9ETVPt95H9uOjwFC52O1V38u/aGAEPpJofxjL3FWFQ/eZ5PbXugt7RlF41xa8NhfpJeBhAMimaYE+hLoBMSgGyiNuUANYQYmTgiyEliabunlRUCaAyKrBJYGkbQIiBc6GReNZoG4cn3dLRj3fMyEY55q/48ypg2tcksXQ7+lJp+motBM0GRGSz8l1xQx8FhyvJnwOhPIpg1wtavpZwpEw7/LS5xoX97oiNPx7aQrMs4vhD3PJ9q1jqZmQNywe+efK4G+6BJB7wcWuAt0iT9xplesN8S5AdX7IUCaA2Jcb4hzA6LpIUC8YL5MPmD7Qf8YqSkDotZ79hDUB4AOInVe0YYpZBx/JiAQZR2Fh6r9ZSCuIG2M48kEhIZmtlvzq0BMWO3Tsrw5cfIenTQwNF1gFa+88kFoKTpxV3t1jAhEsgv4Vgn0PdV7H6h69Rb4COS2XrUeQJuTbU0lzMYe6eXHAfGCbU0lzEZExOOA+IUzQcoq8RwgvkD+d+W+fDsQOzUMrRUfAuIGqtDHbXE2AApvA4UHc7CHgIThcVucDUDoUmdmCDHhvqTmxOlk2TDT3UCgC9BGPsoatWcKEL9ALLuBj5VAG8Ak8Ko6JxaoB3fGTYeoR2blZCXOD4D4ARFwshLnB0AiARFzT2cfOTsTfjaWcWWS3lvOahQoS+/sd4CYcIhJZen4Wtt403MJiAmHmJzMHOi1fw14z1/bnkpvAzFhT547O5sTJ+25tcUjxHrnstKcgUCixFkM8gqwDNaDDUQJ9J24GUrqnlE5UIlzhcgTHYB4kZOTM1CJc8UoZJAAEgkQ3GVqlmgFOxzhxjzzbqjtQ6MtbboFhPABOw+cWSyAaPD+CJUP6HZAM7A7KTwAUg4HosD7KSOUdfftgPc7ddPEQf2hQDR0TPZqc9JDSbk2Xw9Es7Q0N5PeUdEk1YJ4xoBaHUUVFpgFtm79QfgoVyXhH1btsx2BsvcOxA8Q5WxgEfbegUQC3TbYIXJJ8XcpeusHMDLSaIuiYHtPe4TqpLF40Ls5yQLsNDEXsjNBM9qNiaxCq51cQE7uozUzUnZDVb3WrrZX0suTrsg0oEVUvRht0tX2e2ucfEdcDeW0lZnpjWtNeR/MwMEvGqt9L3F+lZ+/NX3uVaa6y5n2hiMM/BI53vkclLfy8zsCiQQIaEfwD/AdaFTCXAT6AWllWrYqqUdaWR7bm8ACi0WsdkC8gCjzQKMtTvyetJPIDttcq34cVxv5WzZXt4RiAKKhuxsfdnMpC6uLc44D4kBnOqft6QbfQ3aO44A4cCG0FqGJhzgd09kcbZTrTugSINECUewBpoFG8AboHrerktD2fKipes8sHwvEDxDmQ2ooaSyQaCi8bsXO7ODoCGnwPjP8NrcintOBrj6ZKOO0JhATVNeF9PR08/kEBUAMcK91RTQDM63J6fupsohc1dyqJA6yc1jLRZifM/MwkC2dph8671LRB8Jc6vTae6ZXjN4UQed07JX5Vq5be3TQoEF9IMylTq8djHYiaEFBQUdE1NwI2qNO8tTBTHbAwXq05Q5UCRM8afLJLAqNJL48P+n1OTNlT7Q1RxI/Pp+M+FzihybIUVzGR395oiLnJUC8WJo/JAPjtH9kT726cEjIT1sTRzvQD+wNcon9M8rwXiIe3dIqitVsEaichtcJ4EP7/GEgJhBosTFbNA1MAB8CCzwMJN6hIOHhOZTrAdy2i7CT5IgzVguicaSAPcFQd/Aer0nEo0d62bkUYji6Z1acCMQED+9cYIUDEfREIHEMPTFHqdGCB7RAuWqfVb0z8sBhJSBBwqjoIszdwE4gVws0HiKoml0SN1wLu2dUXOh0kEzwXhUQNyDCC50OkgtVQOIZtne5RE5NHsAnv/Z+/PwUffFVp200kKCxq+2hBqmAxyCjvF9CipNAiGfrKl7xApBw4CGeDRpcIucLQOIdeMb3am6XKMY6/8khMiBBw3alizj3s8uHGOV7J644AZbSDcU8+osQXQ3alh/3yCgfJ6GyTkCaA73voRDki6AGfIyHOg6vnYAkAhQfV+9DjI/YazjnsR3qLDCOFbrqVvT+H3t2oNFQGIZx/OUcIFoAia4gEEYRWBt0H7uHsY1NsdU1BWCB0BSLFruIUOP0jAfHRBval+2PH59zzoA/r++d7Mnp0vPqVseJf8VxrjzWq38a1O9iybq/dZzW7XYvZSRFp9MpfK5LIDmP9ZXjPNmKOB3mQJ7lWs7lQm787E4CSe3ehchhDuVFDiTk3kIqfjeUSAc7t0ry2H5vt9v7Ejrn8mW5xOLd4htpSCSDtEv4BHE+Sk+i5MiipOdvIykk+PsyUZy++NQkLJNXyySsJoXEBgCO0+PacvmwPFGcwI9jPZdPy1OOdRBnQ6alC1EmT5aVLkTTTV6IgPDhVsZSkVhSkXGqXSeIs7yE70vN+smX8CBOq8tICntIP8pBnABxAsQJ4gSIE8QJECdAnCBOgDhBnABxAsQJ4gSIc3cQZ7PZPJSWTGRuMxnIscQ63q7ODqUlE5nbTAbyza4dQEQThAEY/lCq6goJSA6BCkFVwOEAoEBUCghgKUAACUogFCgJRQQCSVwFFFARcRBIKElE3//iQ8Zes7t75O5fPFZz0tzue9PsVi+kHvBe1YjRpGN23tSI0QRj7vwCCIKEX7vzCyAIEn4tPj/fQD9uoOYdb1DzhNEYYfbjBmre8QY1TxhNGEMA/UUAiejHCaso8MeZOlAxaWMMjzM9d35piY/Y5DtwCbUgjzCPaezhBYpH5CNc7A5cQi3II8xjGnt4geIR+UQrlZ9EleJkVjNQqXKgdRPnLBQfWIY4pvAJxVaEiz0LxQeWIY4pfEKxFeHCF1CGJlBGwZlfAWVoAmUU3Pml5swvLc+2IzJPnBJf/DhPoDhHOyTEHhQltHriPIHiHO2QEHtQlNDqiTMszBKKyEHsWLTxsEDFSIUwSygiB7Fj0cbVUa6llanWV84rKFYhFcxA8YAhT5xXUKxCKpiB4gFDnjjDwsyjDyt4tmMf8j8CDYzv5JaQRx9W8GzHPuR/BBqYmrr4tb5ylqDYgFQwB8UdBj1xlqDYgFQwB8UdBmPGWbQQX53xVxsvxoyzaCG+OuOvNl6MGGcQl+fiB3HV48p5AMUlOiGOJpxCcYZmT5wHUFyiE+JowikUZ2iOGWcOK1CXjedintwcVqAuG8+54zW6chYq0IQfnkIYzwcrdpwT+DY76EAjGtCKNXvtC4sRbogm8G120IFGNKAVa/baFxYT3J0LnqEuG5eYF1/wDHXZuPxdnFmcLdiHmntsYh3XUPOCOXR64mzBPtTcYxPruIaaF8yhM1s5szh/ewjfgyO8QR0feMA3FMcY9gTagyO8QR0feMA3FMcYrv6e01Rhz1nvcXrEj9NPfMJCmMEhznCBAyxgALdQc4exCL/iZ3CIM1zgAAsYwC3U3GGsynfrJv3d+h/Gma2cLttrdjmxLUGNWqwjEB/ba3Y5P2cJatRiHfHH6XvO6b/4KZ5z/kGcWZxettfcgjr7015IXLbX3II6+9Ne/0N4P99D+BTK2fzSz88nyT9dtIUEOglJGGhbSKCTNfbnyyDl/AJnfkHK+QU1ML+qxukGug3FLrohKQPdhmIX3ZDM/y3xN9qD+HFnX5qYPYgfd/elmSzOTCaLM5P5x94dQMhxhXEAf6eEcMcKqkm0jouGUlauoEpHUdE0546raAJbRxrV6lLhAqSKQiKh17CCLSRacKXlpLBHCMfUpgHVo72GplGSPUq4CF//+GN8ZvZ7b96cu7lu+Bn39jFfdv/3Zt6bmT1ftTxhVvt3sdT+q3p043lYgO9gjdsFtpep8XlYgO9gjdsFtu/pcD4EifBQvZEPQSI8tEPpJbFCGSjxDOYZ+AtEY/uZwGCegb9ANLafAbfX1Op+vzKjesXh3PAI5gcgNvTzC+YHIBb2cztvFM7Eg5BPOBNbcV3q/oTHIBb2Q3/z/oTHICb0Y3+3V9Tg8lutwnkeJOM6TMEYt9fV6+eN+s6DZFyHKRjj9rp6Hf3Nkf1giflF23j8O3R+0QZnqdW119hfmvjDuhnOW2rfU2qfU+r1W0Z9t9S+p9Q+p9Trt4z6xuF2VadHfD7sdhWnR9sfzlE4U7XvMbXPMfV6atSXqn2PqX2OqddTo74uSEl59XVByqhfOOsfzm7gyNk16usGjpzdIbXNB65yiKJrmwfxlMSF0xYUTsNeDed84DnnvFHffOA553xBXYfhUcDnnFDRnOIwPAr4nBMajZw7GM798AuICf3Y33rc5RcQC/vt9xzRHRWNmm3dbozojopGzfbosL7D4WSNr8NTo6an7Oezzvk6PDVqesp+Li6cevSMDye1I0bOGtyMWpNwss5zRk3nAq8QnTNqOgeOYg/rCbUrOqwn+aNnja+t1zmcrPUrEI3tZa6tfwWisd1Z6jgh8g2AKyviA657OCfgvqrlPkyUfB8n4L6q5T7bnaGmS0l2AFyM+GDW69q6qndR1bMY+V4uqnoWwRlquwhfq9vReD16o8K7kh4Hnn4kJWq+CcJtFe/nTRBuna2Oly/tcLoqRASztvdzqlo/AuG2ilo/AuHW1VVMOF3F4XT/43C+BsJtFbW+BsKt28vq+gcCloDbSj7wJeC28loPQJvbKmqdhDa3o3COjIzCqdT5SwE4GbsKq7BJq2ybLDFiJnAVVmGTVtk2OQrnDol8xmmj4mecNuDhkFob8L1R0yZc9AxlA743atqEi7oWo8ZlGEAPWmxzZbDGZRhAD1rQ2PZwYuf74EU4Bm/BCW6PsX1f4H9kH7wIx+AtOMHtMbbvK7G+6Sq+U9+vTw4rmEoL3DBWMJWWZzgTEOUPaJYMZwKi/AHN7Xw0+Gf4AhJ6F96DTsaHMOV52PwZvoCE3oX3oJPxIUx5hDMpCGdSMpxJQTiTgMdIZkGUNjQZxA09ghof+iyI0oYmg7ihR9Ay4VSS2HAqSRWPBus37je4AIlyHDrKp3BQHTb1G/cbXIBEOQ4d5VM4aIQzL4hJ5MiZGD9b4byq9vkNuIwWiFI4WvF8UjK+UftsgShNz4AOQHL0So6eA5Acve14wK0LSYFOjpPGh9+FpEAnx0mo2wN4q8YoNAuiNIZ84KvGKDQLojSGBLIJV3QtWkAgm3BF16JtRzg/CQznBePD/yQwnBeGhLNNYrzmG842ScBrLgRDeFdP1iInIXd9r1lzheCKejykaxzarfXWK+rxkK5xaK8snG8HhvNrI5xvB4bz67qNnMaItQmizJYMZhM2QZTZIcEcQJcEetBgDX1V1wBaRjAH0CWBHjRYQ1/VNYDWnh85lSX9c2Q4l4yfs1zk5KNV1cyYWkN+MdqZUHYzI2hfnVZMqqC2C34x2plQdjMjaF+dVkyqoLb/L+ecS0HtdjiX7PZS4dQTzbuhi/DGUwZ3YXLI/pdB9KiZae+rfTRUQLtq/8sgetTMtPdVDQ3oqxy40o9pGLP1d8zZunoDjdn6O/ZsvZ6HdYZQn2M2Iq+r63PMhnWumzdqKs4IaI9tDFvuqJnljID2oBGyzikVr3NKheuctXjGyT6k66tC0Yf0iyXugu9b4aQGLINQv+Au+L4VTmrAMgj17XDad8HrK0QdZTzwLnh9haijjFd6bR2qvLZO7YCR82JGEn9HEgJJobNgPWrqQ7emZvQD/ZoeNa1Dt5rRD2LC6YqocEbfJ6nC6bzU4NknTnouZrQia2qpcLZK1tSjZc+AtqE5pKYeLXsGtA3NsuF0tqBwOktsOHfL80/GovxqZD16UX4VXAyGUvTsvSyGUvTsvYzYu+B9wukCdOp1l3z9w6nnHBUFtK0DOrrZeBc8B1WzcOrDfdwdSvpwr+5QGoWTKgsn1f+c08arRQM1AYqpdxYGINyWD+fICEfMAblYHDEHo3CO7Cl74Td9Ai7BZzBRwW/6BFyCz2ACtrv+o/ATCKxXUP9R+AkE1kfh3JlQTkMHUqUD0yU+1GnoQKp0YHqb/g9vwL8g9HtkMN+Af0Hod2PfayCGNfb12fcaiGGNfYOXko7DHdji9jg4xe5DvMv9DmxxexycYvbReJNJajgZ8KGehNRwcjuDSV9WFUz6ElweI5jamrV/I5jaWlA4+eCa5JgHR3Yf4oNrkmMeHNh9iq9Xp54Sz+vVqafE+A7M23AVTvFnlys/mH0YV9+BeRuuwin+7HLlB7MP4xV+KZq9mhEmKJz3QDS2OzD7qGLvgWhsd2D20VjnDwHhRF/zTf3BN5zs63yeH6I/4Vv4GF7JBPNJTjAPGM8PCfwJ38LH8EommE9ygnmgorXg0HA6Q6lwboFobHdk9yEepkVjuyOzj3pDD+WGkP90Ox0a8oYeKgjhWUpzHCqobSEndNojn2CytoWc0GmPjGDWJZz1Hzk50UlzOEpzTBuToDSHozTH9JAP/CW4AeJJB1PX9xLcADEYwax/OGeM80mzjyp2xjifNPrUL5xqstM3grmug2lMdvpGMNcZzKpn5kJVzcyFgmfrc3AHhNs5VajVR7+pc3AHhNs5cIrZR61ppjlepjTHhLGmmeZ4mVIt8GuuF+BvkBy/ggvBQ/3fIDl+3aaZuVAlM/PYr91+Fc5y63JYffQb+iqc5dYVsPsQF9xTpUOpgr5mfZcgVTqUKpcCl4veNM5DXwgM55vGeegLVc/MK3rMJfqwPg4rqsgVtjuy+xCXMVZUkStsd2D3KZ4U9TzC2ctOhoxJUc8KJ/scqiqYdLqqYNLpis4vtbW488v4dc7Lxp8msfroN/Oy/adJ7D55eAjvDQlnj32cDx7Ce0PC2WOfonpm4AQchqJg3stZ27xWUM8MnIDDUBTMezlrm9cqDyfPQ2PDaZyHmuH8B0RjuwOrj36D/wHR2O7I7GOcf97U4eR2ouQ19Zs6nNxOGH9S8Jl6L4qWixY9Vjn2wzP1XhQtFy3qwNZ1Zm6FU4ZwZPchz3OQ2Edvz+pwss2VwfNeHU60mV8ReQ22rOUi9l0HoWc5i+/74BpsWctF7LsOQs/gwCicuyOc7+twsq1sON/X4WSbTy1H4IbHcpG+BDxTUMsRuOGxXKQvAc+Mwrk7wjkJDyClBxV8acEDSOkBNAJn6HMeN0z8CEKfGzXNeUwkfgShz0fh3B3hTECUJCKcSUV/GGsFBJ7Ac+CUI5nz1Mseda2AwBN4DpxyJHOeerlWdyAZ4ayB2oWzmQnfUXA5TsFp70cdGD44Ci7HKTj9H/t2ABFnGMdx/A8AOACGHTCYuSrXaquutZUMDgBwQIBaVJTqQhnDAoA5AMAFyKDQBm7dkK66WhlswIGEsf9+bn+cv6t/1/vcPI898fH0Pt7HI76e9z260P53M/w4jUAVMhmBKkm+D17XcSb8PngdHsWvaUShinFWKhUW5BEWFIUvUQRXV1cM5BGOgfrt2+Tz/Pnks/LZq8Hd+suB0ul4NgfUjp4wtYYpP+QRjoH663JqpHQxNcwIlM8mBhlx8umLLJ+M9ReANDVxOx2mj3HGQP2EIDMXkwgTcHIyTs5mnCeI8zjX16iN9qSAWskvNh2mz3HGQP1zPjFURJQMODWHEOZTxpMYcfYjzl5GYzk7TjvMIOKMgfoFJ2URGCRMOTXH+hBmLx+NZApArUhPaCrMoOKMgfqjPj5QwGOcESVkJcx+ruV6EWYPZDJGnEaYAcYZA/UDYkxBAxifX5onZjPM0WaYu0BagjDDiTMG6gd88MlDM8ra3yiFnJpKgjDDijMG6gc8wssSJIsiUDt2mOHHGQP1CBpLA4sGpIw4jTADijOIQGOgZWB4D3QTI8zw4gwi0Bhnod27pmaEGXKcMdAAHu10Gx1m8HEGE2gMNH/nOK+vr//LOPF3xzg9Jb8YgQYaZ/hhxjiNQMOPM/wwY5w60PDjdBvmHtA9FID+lR9vHuwBddPi4mIFpoHaKMIOUFJ6QgcafpxuwswDy9hJKHlQ69zT+8nYzTAZjhYWFvqAWoxj/gJ+Q8V5nCrQwONMHqbYApaxk1i2QK1zT+8nY7finIbvwIjx68rKShYIJnB9LOEeyn3u49SBhh+nHabhEljGTmK5BLXOPb2fjNTFQEegPj8/z4jyYHNz8wPGGq4Z818g6/SxbgQaTpzJwyxAA9gi9xUkjAI0gJVb192X3s/QkPvJFZySo8vLy58RJWPk1dVVxvgR81kgF6wbVKCBxJn8xMxA1QizChkVTAaqRpxqXeeM/bSq3Eeura+vv0OcPDc314xzbW1tDsiVO91kBEoecfkoT0EJWJP51A3BpKAELOx1Caj9tBKkuvRof42T8gBxMjTjXFpa2sd8DsgF+yb7EU8eSRqmlgZuI20EkwYW9roE1H5aulthwqW8c+5vbGy8xViVd85DyDmNM0Gg5AuXYYpZ4DZmjVhmgYW9LgG1nzbbhTCL8FM+rX9ClE+AYBjXVcwznEGx+3HagZIvXIYptoGhDGkZGbaNWLaBoQwP9TrX1H5pGVnmXce5AwwVxPgYqMUQ5mvwS+5LHmeSQIF84TjMFDDMqPkZYOOdk2EGSFjrOmfsJ9d/2DtjEMeNKAxPX21fubpasD2or9JX7otl+0p949qVy5SqAwHBBpJ0zhJI674IghRXbOB0T/A4zOOerX1ecTPj78GHhUf/amA/5JmRkCZtL/YKUYg7eJBX682q9fuNI0vrzY5tLo57PEtjxp1FoRsAyAmAnICcAMgJyAmAnADICcgJgJyAnACVyQmAnICcAMgJgJyAnADIKXUQpjP6VF9RT09PjXDSz2Rw2nz2+30jnPQzGUxbDKnByDmk+opS+SZhtBL6bT4q3ySMVkK/zUfqQWj1c65nYTRyjvq92b/sCjyCsfiMbgiCSjc6EvptDird6EjotzlIHc4EPOm2x+lMXMmVW7FHMJaf0Y38BdUz4BRH8oVW7BGM5Wd0I39BpXpHul7YCEk//f0KrdgjGMvP6Eb+gkr9JIwLhbOCjprPviKPYKwv48hpBN0Kk3IywvltvqBbYVJORkC/TZFqjHSb9P3amP0kV04FHsFYYaaAM6fFSOeXlbiwCjyCsbpMQWLWf+a0FXgEY1WZgsSsf8xpK/AIxqoyGYvJbD3wCMZqMlbOjK4Qsc4ZeARjVRkrZ0bX1rlCFHgEY3UZ3SiC4q6tUxR3JeVZ3EIn1XM/532KOTpXgPy2RTN3cwXIbwMl+DbgojPf+zKzJSUIvg24+AxiFkDwbcDFZxCzAIJvAy4+g5iZEXkbcH0ZK6deAVK2RjbbtvjqkLIVknK5DSJvA64mw5mzAIJvAy4/w5izDIJvAy4+w2y9AIJvAy4+wzpnAQTeBlxVxvsjXCH6wQTeBlxVxsppKeDaer0E3gZcXUY3MgCgOjkBOaU+KZEiT361+vTy8vLzzLxNnnxWYn7WOusgefJ5iPn29jbNmA6SJ5+HmE4HyZPPQEyng+TJZyCm30Hy5FeV0u/Y4g6Sv9O8kD6abxuvr6+/zCzumOkg+fvOS6WPZvGO/HNuzJNP72XxjvysBfPk15eTCUEwT359OVlKCebJry8ni9DhPPn15eTyXTxPftXZOjc+3JInH1/nXAC3jEXz5AOZ1W82JU+eoqhGIU8+q2p+/+3XP2bmbfLksxLz7fO/X2bOOkiefB5iTv//N82YDpInn4eYTgfJk89ATKeD5MlnIKbfQfLk16zG79jiDpK/07yQPppvG3//9ec/M4s7ZjpI/r7zQvpoFu/IP+fGPPn0XhbvyM9aME9+fTmZEATz5NeXk6WUYJ78+nKyCB3Ok19fTi7fxfPkV52tc+PDLXny8XXORXDLWDxPnpuNyd/NzcYURe33+1bohcnQa1vyeHx8bIVemAy9tqUyAfvF/A9/EAZhUgb9Ll1D8g/CIEzKoN8lD8kdrJTKUeiEUdg5xztYKZWj0AmjsBNSDSCnimkYFsmpYhqGgJgzvZCERkXdLRFT6fUYjXCsR1DknBzSNTxZHDFb5zgHoRM29sWtmpnzrXOcg9AJGyEpjTDW/ROPnJuonCqLPU6vwk0Gb4zZaWbO9yrcZPAE7DST4Cr8rOvf3ZozZnthfLvR/ZL+3a05Y7YXxrcb5wwOTIhcOZMwGDlnGiFZjJxJGIycM42QLMhZtpzrY+Q0E57J0F2S00x4JkOHnMgZxoxjH4SDM5Swk6JkxrEPwsEZSthJUYIC5VRRdsLRX3NUmQwqyk44Xlhz3NgJkT07mjHoSeiUxk6I7NnRjEFPQqc0BU+IkNNIcY2tEVOlWMTWLCWNdnx5Yc3TLiWNdnzprXmWvZSEnNP7sMtHyzFnz51wNII+O8e0i/A74WgEfXaOuXwRHpDTCDqeDRvaa2IaQcezYUOLmDeBnAbvxo/xhhs/Rm78YLYOgJxf2aVz24gBIAiCG57yT+COL/gDjGCVxggqo/w2GnPGgHrftxOBOTEnmBNzgjkxJ5gTzIk5wZz8N/U8TweC3Dmh7vvuRFDXdXUiqPM8OxHUcRydCGrf904EtW1bJ4Ja17UTQS3L0omg5nnuRFDTNHUiqHEcOxHUMAydCOr7/XYiqM/n04HAnNnMGQn+bjzm/Pll1x7jHNfCMIC/g/XutW07zeiizckOrm3bNgdJr21b365VXNu2WQyTjGea+5wPbU+R3cysu/nwn6jK7zx5z5tOb0pNYkFj+4BunMR0q1nRzVYlaJ6qaCbbpdmeCjQveDyOB5S2ng0RwnuYZhksaNlFaUYf0837Z7b1rA9Uaqqe3HNL6ck9IwLyzD8FO/ZtticilFcGNGPEMZSFIR1CVb24udkuByoV0hN7B3xP7m0LyDP/5Gz4m7uWCmjWm8UqJJZvKJr1CKb4h/CYVwOaaRU8TrduBioRC0s4vXDWXJeawoLme2LYAkHjbwzSMfXXpKYBifjjFd06Cr3oP/yxqLR/1Gv9awOViIUlnF440TvenVsFjRdmXtm5JNCs8GqLUN+nXtG/DlDpWCjC6YVzpmZslzuNWxHeewItxhaGcHrhRB/5shDOrvpmcwWgxZ0XzgWL/Ff2rsY0IyWE8zKgeSnGqleMz5QbEzPl/fjyv/raFYDcSkVoxeFQReNIaMJ+fJl6hVYAcoN/o6C2mZsrQWMvFuzdQ9H61gQqwlU4baKypOLbMMaq9kiwqn2TM2Wfve++FUCeOcPvSo8Qp3T/Ff1rAc0LccVXF1d90YQq26KYKqcSihz+L7BNNZCToWhl3WB4QnQ4MsEWDYYmpAYjE8JDr1ZWAxVDtl2maubBOMefwc678XtRuaJXwvJvwWzDGZ/p2yuhSl8Xno/0Ny68Y3lwgTzjw8N5fWaQcOcNNC/EWdV5PIR88JzEFHkUy7OA8g1FKs/jIeRhdIKAjg6FK88CEvFqmb7hc6RZnXn7HMPJQxdn8vVO55GGC/Feu5nKgcbOQ/y7SyGcHwLNCn+cG0rQehSI41Ukr7IMJxTppbgq35lgvpdjijSSO6jy4UBpCOWxeZVyGEF8aTg04U4sX4YR8fhIeMLhQGlK0GzJqZSa1c7PGxfm7Vj/QjjmKpz4zGfkXVTdWN6fUH1XIpCviscQ4vOBxs5DTDcezg6I8RGQM7fhBN14BYj3l5iyrcyAMfmruH/r9YDSeM+GKf/b7GBLPX+r8rJAvL9E+Kxs+Cq+6n9t0npAaQPRiRti/7dCBe1JhWlZIPXyng1y/tulm8/UXZWcAcTx6Z7pvSfwvttNOP9t2mp5nE+vUB1fTX/WtKTqOy59HI8daPdXrQY0Nh4ezmuEqS3BBwvIgetw8j4OCGG8WKiYRjurWRUo37/K1mvmDfq5wKfzi4WKaaQiU1YFKhCdvCZC2Zt+LKbzc4EU3boxe37mb04/VuGPcxNO9JhnZiujFOucKS0JxPEboSTz7cpnA7F6YvsKoLHxIGzmITk3REFjIyBHzfHpTvgPRTLTum48CKic8uvCQN0K5CTOpLuFx4aAELTXM1UzPOFWIEeRiruFIIeAcMF9J7QaFwAVhbt2N+FEm/GMcAFdC8SraXymfAH2/V7Qdyryawm1amegsfHwcK6ICjeaHRTzaqDxEPs35XLrHCD0Y39mB7PqMCAnCVZ1tDCwPwOvnH8KveRhQE5QOY/OBDlU8TMQzm1Q+EwNQE7wmORsKyeTPhNalNuwfAQBHMzrqQ0sb2lnVZsAjY+H/+HBelr8kcd4vk5iurWNWHn4NhAG6q/MoDHfIUBO0Hceme3VpF+BhkKVf2XCGZlwCJCTweiEI4Xe9FfgffJwJpyayYCcoMX5z8W0/rnjHboif5lk0vFx/ybTgUrV/+2bA6ycQRSFb21bUYNau6+2bdt249p2UNuxatuOahvPdbfnpPn7bv/1Fk+T5FtrMnfv3HPuzP+CF8JAoiDQwojLNJBAYKsTu5ROq+XzulW7IrucjFvinAuBeIPZRgsNwOX6pFLiC4F4A69drpb1w0Dwu+6qVWEUEE+wKxbMsq482s94bNvLBo5qxtf8m6gbljBSqvYsu0dAfFF9dngO3f4k7L4AIZi4qXHB6Xj7tJYjNxA7VPW0ZNTETwAMuKlKhb91HZHcQGxYqj5cCaIJQHQdDG46VrrSALHDzlhAgqiuc5T6jcBZHoidp80dGV/Uc9YHEhqGXzc4abR/flfc0RFQsRNhtRQCouFuJFowCMxn+j30D7Xif9vQWYR2iqrTTtrblS9rheXHc2eVCo591ahCASDf96YvgqD7qETRSXu7EsGZH4+fVVkz9vseKQA8lBtR63j0BIhF7RkxrbhhOpDgDG9YOSdrShWgp/gYEIv3tcpmp4/7c6l3bgivXj0HkOAw6DtCm0XXn7YOym1wEKJnPzOQ9g61h2ifePK6btg4TpT2MWlaA2RHx3rbZJORtu7QOFsnKOLLgVTrmB1xvZ4Wk34ej48EYkGzXf9OWkq4XorfO51jCtaE1z4mQSC+YUOB44F5vJL3bdm1L5DgMLg9wFYfetBj1U53vzBQsXzO6LDLlQqIHdZiyJjzvAkJuyfoVru5JAWCbh5wBcBsvh6IBWti/nH8tC8jg2lfqnLFHxOBBI/B6xO15kXnx0nLmagbH/ma0J8H3CKLA/EHPrc5/gDXPE+i4yoCswkQbyBLNoc9dM1TUOK5q1DnTYB4gn8c/ulQqrx1bxhEnaszPbJmIMGpQYA29qre8fjLOhUbAgkNg/8XcDcPW4AzItshUIcgGIcjS3atNSPGqcRFwDDrvKlfqThtJUzuCKj0HrwfsNJFVvy4P21x2kpYskd8PZSmB+/bsqVXak12pUeQ1udRZ7gKA7gbiWOsMz28qK61gQQCfzf9TI6D5Qi93Od1wkr+uXI3JJuBcg8nxFsJIF5or1qvl4DEL4YkP0AeQfl1onRG5EVmTiAaLvnIoieUT7sQSPxiSPIDZPlh23F0TO8faDg9tgge26U6ZN9Vho1HDMlkoNpg18eeIx9b903WNJkzXqDgYYCqDS4egTuxBst8aiDxjyE5DRZn0aPLw/7aqu0k1KPhbDxQwQNJOBiS56CRSRtPfpOVqFZrAsPwr7/AYDDBaTDBaTCY4DQYfgCNFaK3RZ57ygAAAABJRU5ErkJggg==");
    background-position: -106px -53.5px !important;
    background-size: auto;
    margin-right: 0;
    height: 26px;
    width: 26px;
    margin-top: 6px;
    margin-left: 7px;
    border-radius: 0 2px 2px 0;
    display: block;
}
[layout="2012"] #ugf-search #ugf-search-btn::after {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNEUwNzM4OTY0MTFFMEE0MDNEODlCOThCNUNBOTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNEUwNzQ4OTY0MTFFMEE0MDNEODlCOThCNUNBOTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MkI0RTA3MTg5NjQxMUUwQTQwM0Q4OUI5OEI1Q0E5OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MkI0RTA3Mjg5NjQxMUUwQTQwM0Q4OUI5OEI1Q0E5OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po7ONFMAAADISURBVHjanFJBCsIwEFzrF7z04h9E/Efx5MEHePHmr4T6hFLwF6G/sKW0lLixEwh1AtGB6SaZne22G7HWCrhT1sqXneHiE+fC6BcX5Wg5RujU7CoPSDTKs3KLaHA+sA7co0JCE2mvgV4xcwuxiJgL6C0zTxDziDmHPi21TER6mbEXDn/efykYT8o316ztQzAm93dPyg2iCUZ2/WfOIe7M7DtwN6pDYof9LVZAYldvwZIVSDXTApmk46h8BPv16vP631D6Ym8BBgAsamp63yCdlAAAAABJRU5ErkJggg==") !important;
  background-position: 0 0 !important;
  width: 15px;
  height: 15px;
  margin-top: 7px;
  margin-left: 26px;
}
[layout="2014"] #ugf-search #ugf-search-btn::after,
[layout="2015"] #ugf-search #ugf-search-btn::after {
  background: url(https://www.google.com/images/nav_logo225.png) no-repeat -113px -61px !important;
  background-position: -113px -61px !important;
  color: transparent;
  display: inline-block;
  height: 18px !important;
  margin-top: 5px !important;
  margin-left: 20px !important;
  width: 18px !important;
}
[layout="retro"] #ugf-search #ugf-search-btn::after,
[layout="2013"] #ugf-search #ugf-search-btn::after,
[layout="2013L"] #ugf-search #ugf-search-btn::after,
[layout="2015L"] #ugf-search #ugf-search-btn::after,
[layout="2016L"] #ugf-search #ugf-search-btn::after {
  background: url(http://www.google.com/images/nav_logo124.png) no-repeat -36px -111px !important;
  background-position: -36px -111px !important;
  height: 14px;
  width: 13px;
  margin-top: 9px !important;
  margin-left: 27px !important;
}
[layout="retro"] #ugf-program #ugf-search #ugf-search-btn,
[layout="2012"] #ugf-program #ugf-search #ugf-search-btn,
[layout="2013"] #ugf-program #ugf-search #ugf-search-btn,
[layout="2013L"] #ugf-program #ugf-search #ugf-search-btn,
[layout="2015L"] #ugf-program #ugf-search #ugf-search-btn,
[layout="2016L"] #ugf-program #ugf-search #ugf-search-btn {
  background-image: linear-gradient(to bottom,#4d90fe,#4787ed) !important;
  border: 1px solid #3079ed;
  height: 28px !important;
  width: 68px !important;
  margin-left: 17px;
  border-radius: 2px;
}
[layout="2014"] #ugf-program #ugf-search #ugf-search-btn,
[layout="2015"] #ugf-program #ugf-search #ugf-search-btn {
  background-image: linear-gradient(to bottom,#4d90fe,#4787ed) !important;
  border: 1px solid #3079ed;
  height: 28px !important;
  width: 58px !important;
}
[layout="2012"] #ugf-program #ugf-search #ugf-search-btn:hover,
[layout="2013"] #ugf-program #ugf-search #ugf-search-btn:hover,
[layout="2013L"] #ugf-program #ugf-search #ugf-search-btn:hover,
[layout="2014"] #ugf-program #ugf-search #ugf-search-btn:hover,
[layout="2015"] #ugf-program #ugf-search #ugf-search-btn:hover,
[layout="2015L"] #ugf-program #ugf-search #ugf-search-btn:hover,
[layout="2016L"] #ugf-program #ugf-search #ugf-search-btn:hover {
  background-image: linear-gradient(to bottom,#4d90fe,#357ae8);
  border: 1px solid #2f5bb7;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
}
[layout="2012"] #ugf-program #ugf-search #ugf-search-btn:active,
[layout="2013"] #ugf-program #ugf-search #ugf-search-btn:active,
[layout="2013L"] #ugf-program #ugf-search #ugf-search-btn:active,
[layout="2014"] #ugf-program #ugf-search #ugf-search-btn:active,
[layout="2015"] #ugf-program #ugf-search #ugf-search-btn:active,
[layout="2015L"] #ugf-program #ugf-search #ugf-search-btn:active,
[layout="2016L"] #ugf-program #ugf-search #ugf-search-btn:active {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
}
[layout="2016C"] #ugf-search-btn,
[layout^="2018"] #ugf-search-btn,
[layout="2019"] #ugf-search-btn {
  height: 44px;
  width: 31px;
  border-radius: 0 2px 2px 0;
  display: flex;
  align-items: center;
  padding-right: 13px;
}
[layout="2016C"] #ugf-search-btn-inner,
[layout^="2018"] #ugf-search-btn-inner,
[layout="2019"] #ugf-search-btn-inner {
  width: 24px;
  height: 24px;
  margin: 0 auto;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"]) #ugf-search-btn svg {
  display: none;
}
#ugf-search-btn svg {
  width: 100%;
  height: 100%;
  fill: #4285f4;
}
[layout="2016C"] #ugf-search-btn svg {
  width: 100%;
  height: 100%;
  fill: #777;
}
#ugf-search-predictions-container {
  position: absolute;
  top: 30px;
  width: 589px;
  z-index: 50;
}
[layout="2010"] #ugf-search-predictions-container,
[layout="2011"] #ugf-search-predictions-container,
[layout="2012"] #ugf-search-predictions-container,
[layout="2013"] #ugf-search-predictions-container,
[layout="2013L"] #ugf-search-predictions-container,
[layout="2015L"] #ugf-search-predictions-container,
[layout="2016L"] #ugf-search-predictions-container {
  top: 34px;
  width: 589px;
}
[layout="2016"] #ugf-search-predictions-container {
  top: 39px;
  width: 589px;
  z-index: 50;
}
[layout="2016C"] #ugf-search-predictions-container,
[layout^="2018"] #ugf-search-predictions-container {
  top: 42px;
  width: 632px;
}
[layout="2019"] #ugf-search-predictions-container {
  top: 42px;
  width: 634px;
  margin-left: -1px;
}
[location="home"][layout="2012"] #ugf-search-predictions-container,
[location="home"][layout="2013"] #ugf-search-predictions-container,
[location="home"][layout="2014"] #ugf-search-predictions-container,
[location="home"][layout="2015"] #ugf-search-predictions-container {
  width: 568px;
}
[location="home"][layout="2010"] #ugf-search-predictions-container,
[location="home"][layout="2011"] #ugf-search-predictions-container,
[location="home"][layout="2013L"] #ugf-search-predictions-container,
[location="home"][layout="2015L"] #ugf-search-predictions-container,
[location="home"][layout="2016L"] #ugf-search-predictions-container {
  width: 516px;
}
[location="home"][layout="2016C"] #ugf-search-predictions-container,
[location="home"][layout^="2018"] #ugf-search-predictions-container,
[location="home"][layout="2019"] #ugf-search-predictions-container {
  width: 584px;
}
html:not([search-focus]) #ugf-search-predictions-container {
  display: none;
}
#ugf-search-predictions {
  background: #fff;
}
[layout="2010"] #ugf-search-predictions,
[layout="2011"] #ugf-search-predictions,
[layout="2012"] #ugf-search-predictions,
[layout="2013"] #ugf-search-predictions,
[layout="2013L"] #ugf-search-predictions,
[layout="2015L"] #ugf-search-predictions,
[layout="2016L"] #ugf-search-predictions {
  border: 1px solid #ccc !important;
  border-top-color: #d9d9d9 !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
[layout="2014"] #ugf-search-predictions,
[layout="2015"] #ugf-search-predictions {
  border: 1px solid #ccc;
  border-top-color: transparent;
  box-shadow: 0px 2px 4px rgba(0,0,0,.2);
}
[layout="2016"] #ugf-search-predictions {
  border: 1px solid rgba(0,0,0,.2);
  box-shadow: 0px 2px 4px rgba(0,0,0,.2);
}
[layout="2016C"] #ugf-search-predictions,
[layout^="2018"] #ugf-search-predictions {
  box-shadow: 0 4px 6px rgba(32,33,36,.28);
  border-radius: 0 0 2px 2px;
  padding: 0 0 8px;
}
[layout="2019"] #ugf-search-predictions {
  box-shadow: 0 4px 6px rgba(32,33,36,.28);
  border-radius: 0 0 24px 24px;
  padding: 0 0 16px;
}
#ugf-search-predictions-inner {
  position: relative;
  z-index: 51;
}
.ugf-search-prediction {
  padding: 2px 8px;
  font-size: 16px;
  line-height: 20px;
  display: block;
  color: #222;
  text-decoration: none !important;
}
.ugf-search-prediction:hover {
  background: #c6dafc;
}
[layout="2010"] .ugf-search-prediction,
[layout="2011"] .ugf-search-prediction,
[layout="2012"] .ugf-search-prediction,
[layout="2013"] .ugf-search-prediction,
[layout="2013L"] .ugf-search-prediction,
[layout="2015L"] .ugf-search-prediction,
[layout="2016L"] .ugf-search-prediction {
  padding: 1px 10px;
  font-weight: bold;
}
[layout="2010"] .ugf-search-prediction b,
[layout="2011"] .ugf-search-prediction b,
[layout="2012"] .ugf-search-prediction b,
[layout="2013"] .ugf-search-prediction b,
[layout="2013L"] .ugf-search-prediction b,
[layout="2015L"] .ugf-search-prediction b,
[layout="2016L"] .ugf-search-prediction b {
  font-weight: 700;
}
[layout="2016C"] .ugf-search-prediction,
[layout^="2018"] .ugf-search-prediction {
  padding: 3px 16px;
}
[layout="2019"] .ugf-search-prediction {
  padding: 3px 22px;
}
[layout="2019"] .ugf-search-prediction:first-of-type {
  padding-top: 0;
}
[layout="2019"] .ugf-search-prediction:first-of-type .ugf-search-prediction-inner {
  border-top: 1px solid #e8eaed;
  padding-top: 3px;
}
[layout="2016C"] .ugf-search-prediction:not(:visited),
[layout^="2018"] .ugf-search-prediction:not(:visited),
[layout="2019"] .ugf-search-prediction:not(:visited) {
  color: #000;
}
[layout="2013"] .ugf-search-prediction:hover {
  background: #eee;
}
[layout="2016C"] .ugf-search-prediction:hover,
[layout^="2018"] .ugf-search-prediction:hover,
[layout="2019"] .ugf-search-prediction:hover {
  background: #f7f8f9;
}
[layout^="2018M"] .ugf-search-prediction:hover{
  background:#93bcff;
}
#ugf-search-predictions-fence {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 50;
}


[present="false"] {
  display: none;
}
#ugf-page-multistate[state="images"] [state-id="all"] {
  display: none;
}
#ugf-page-multistate:not([state="images"]) [state-id="images"] {
  display: none;
}
[logged-in="true"] #ugf-sign-in,
[logged-in="false"] #ugf-account-button {
  display: none;
}


#ugf-top {
  position: relative;
}
#ugf-top-right {
  margin-left: auto;
  margin-right: 22px;
}
#ugf-sign-in {
  border: 1px solid #4285f4;
  font-weight: bold;
  outline: none;
  background: #4285f4;
  background: linear-gradient(to bottom,#4387fd,#4683ea);
  text-decoration: none !important;
  display: inline-block;
  line-height: 28px;
  padding: 0 12px;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}
#ugf-sign-in:hover {
  box-shadow: 0 1px 0 rgba(0,0,0,.15);
}
#ugf-sign-in:active {
  box-shadow: inset 0 2px 0 rgba(0,0,0,.15);
  background: -webkit-linear-gradient(top,#3c7ae4,#3f76d3);
}
[layout="2013"] #ugf-sign-in {
  background: linear-gradient(to bottom,#dd4b39,#d14836);
  text-transform: uppercase;
  border-color: transparent;
  font-size: 11px;
  box-shadow: 0 1px rgba(0,0,0,0.1);
  padding: 0 16px;
}
[layout="2013"] #ugf-sign-in:hover {
  box-shadow: 0 1px 1px rgba(0,0,0,0.2);
  background-image: linear-gradient(to bottom,#dd4b39,#c53727);
  border: 1px solid #b0281a;
  border-bottom-color: #af301f;
}
[layout="2013"] #ugf-sign-in:active {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
  background-image: linear-gradient(to bottom,#dd4b39,#b0281a);
  border: 1px solid #992a1b;
  border-top: 1px solid #992a1b;
}


#ugf-side-info {
  width: 454px;
  background: #fff;
  box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.2);
  margin-top: 50px;
  margin-left: 61px;
}
[layout="2019"] #ugf-side-info {
  box-shadow: none;
  border: 1px solid #dfe1e5;
  border-radius: 8px;
}
[layout="2010"] #ugf-side-info,
[layout="2011"] #ugf-side-info,
[layout="2013L"] #ugf-side-info,
[layout="2015L"] #ugf-side-info,
[layout="2016L"] #ugf-side-info {
  width: 280px;
  box-shadow: none;
  border: 1px solid #e0e0e0;
}
[layout="2016C"] #ugf-side-info {
  margin-top: 45px;
}
#ugf-side-info-top {
  display: flex;
  align-items: center;
  padding: 15px;
}
[layout="2010"] #ugf-side-info-top,
[layout="2011"] #ugf-side-info-top,
[layout="2013L"] #ugf-side-info-top,
[layout="2015L"] #ugf-side-info-top,
[layout="2016L"] #ugf-side-info-top {
  padding: 10px 10px 0;
}
#ugf-side-info-title {
  color: rgba(0,0,0,.87);
  font-size: 30px;
  max-width: 292px;
}
[layout="2010"] #ugf-side-info-title,
[layout="2011"] #ugf-side-info-title,
[layout="2013L"] #ugf-side-info-title,
[layout="2015L"] #ugf-side-info-title,
[layout="2016L"] #ugf-side-info-title {
  font-size: 22px;
  max-width: 270px;
}
#ugf-side-info-subtitle {
  color: #777;
  font-size: 13px;
}
[layout="2010"] #ugf-side-info-image img,
[layout="2011"] #ugf-side-info-image img,
[layout="2013L"] #ugf-side-info-image img,
[layout="2015L"] #ugf-side-info-image img,
[layout="2016L"] #ugf-side-info-image img {
  max-width: 100px;
}
#ugf-side-info-body {
  font-size: 13px;
  border-top: 1px solid #EBEBEB;
  padding: 15px;
}
[layout="2010"] #ugf-side-info-body,
[layout="2011"] #ugf-side-info-body,
[layout="2013L"] #ugf-side-info-body,
[layout="2015L"] #ugf-side-info-body,
[layout="2016L"] #ugf-side-info-body {
  font-size: 15px;
  border-top: none;
  padding: 10px;
}
#ugf-side-info-kay-sees-and-ess-esses,
#ugf-side-info-kay-sees-and-ess-esses a {
  font-size: 13px;
}
#ugf-side-info-kay-sees-and-ess-esses div {
  white-space: normal;
}
[layout="2010"] #ugf-side-info-kay-sees-and-ess-esses,
[layout="2011"] #ugf-side-info-kay-sees-and-ess-esses,
[layout="2013L"] #ugf-side-info-kay-sees-and-ess-esses,
[layout="2015L"] #ugf-side-info-kay-sees-and-ess-esses,
[layout="2016L"] #ugf-side-info-kay-sees-and-ess-esses {
  padding-bottom: 10px;
}
#ugf-side-info-top-right {
  margin-left: auto;
}

#ugf-image-results {
  padding-top: 13px;
  background: #f1f1f1;
}
[layout="2019"] #ugf-image-results {
  background: #fff;
}
[noton-images][location="images"] #ugf-main-inner {
  display: none;
}
[noton-images][location="images"] #main,
[noton-images][location="images"] .T1diZc.KWE8qe,
[noton-images][location="images"] #TWfxFb {
  display: block !important;
}
[noton-images][location="images"] body > div > c-wiz > div:not(.mJxzWe),
[noton-images][location="images"] #main > div > div:not(#rcnt) {
  display: none;
}
[noton-images] .WaWKOe.RfPPs {
  height: 100vh !important;
}
[noton-images][location="images"][layout="2012"] #main div,
[noton-images][location="images"][layout="2013L"] #main div,
[noton-images][location="images"][layout="2015L"] #main div,
[noton-images][location="images"][layout="2016L"] #main div {
  background-color: transparent;
  max-width: calc(100vw - 180px) !important;
  min-width: unset !important;
}
[noton-images][location="images"] #main div {
  background-color: transparent;
}
[noton-images][location="images"][layout="2012"] #main div {
  background-color: transparent;
  max-width: calc(100vw - 230px) !important;
  min-width: unset !important;
}
/* image border radius noton style */
.F0uyec,
.eA0Zlc.mkpRId {
  border-radius: 0 !important;
}
[noton-images][layout="2012"] #rcnt,
[noton-images][layout="2013L"] #rcnt,
[noton-images][layout="2015L"] #rcnt,
[noton-images][layout="2016L"] #rcnt {
  width: calc(100% - 130px) !important;
  right: unset !important;
  left: 130px;
  position: absolute;
  top: 176px;
}
[noton-images][layout="2012"] #rcnt {
  width: calc(100% - 210px) !important;
  right: unset !important;
  left: 210px;
  position: absolute;
  top: 110px;
}
[noton-images][layout="2012"] .islrc,
[noton-images][layout="2013L"] .islrc,
[noton-images][layout="2015L"] .islrc,
[noton-images][layout="2016L"] .islrc {
  max-width: calc(100vw - 130px);
  margin-left: 110px;
  width: auto !important;
  min-width: 0 !important;
}
[noton-images][layout="2012"] .islrc {
  max-width: calc(100vw - 170px);
  margin-left: 150px;
}
[noton-images][location="images"] #ugf-left {
  position: absolute;
  z-index: 99;
}
[layout="2012"] #ugf-image-results,
[layout="2013"] #ugf-image-results,
[layout="2013L"] #ugf-image-results,
[layout="2015L"] #ugf-image-results,
[layout="2016L"] #ugf-image-results {
  background: #fff;
  width: 827px;
}
#ugf-image-results-container {
  display: flex;
  flex-wrap: wrap;
}
/*
#ugf-side-info-kay-sees-and-ess-esses g-img {
  display: none;
}
*/
#ugf-side-info-kay-sees-and-ess-esses > span {
  margin-top: 7px;
  display: block;
}
[layout="2013L"] .ugf-kc,
[layout="2015L"] .ugf-kc,
[layout="2016L"] .ugf-kc {
  margin-top: -13px;
}
#ugf-side-info-kay-sees-and-ess-esses #ugf-kc1 {
  margin-top: 13px;
}
#ugf-side-info-kay-sees-and-ess-esses div > span:first-of-type a {
  font-weight: bold;
  color: #222;
}



.ugf-image-result {
  margin: 0 10px 10px;
  padding: 0 4px;
  max-width: 250px;
  width: fit-content;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.ugf-image-result:not(:nth-last-child(1)):not(:nth-last-child(2)):not(:nth-last-child(3)):not(:nth-last-child(4)):not(:nth-last-child(5)):not(:nth-last-child(6)):not(:nth-last-child(7)):not(:nth-last-child(8)) {
  margin: 0 auto 10px;
}
[layout="2012"] .ugf-image-result,
[layout="2013"] .ugf-image-result,
[layout="2013L"] .ugf-image-result,
[layout="2015L"] .ugf-image-result,
[layout="2016L"] .ugf-image-result {
  width: 204px !important;
  padding: 0 !important;
  margin: 0 0 10px 0 !important;
}
.ugf-image-result img {
  margin: 0 auto;
  max-width: 250px;
  max-height: 205px;
  height: auto;
  width: auto;
  display: block;
}
[layout="2012"] .ugf-image-result img,
[layout="2013"] .ugf-image-result img,
[layout="2013L"] .ugf-image-result img,
[layout="2015L"] .ugf-image-result img,
[layout="2016L"] .ugf-image-result img {
  border: 1px solid #ccc;
  padding: 1px;
  max-width: 150px !important;
  max-height: 150px !important;
  margin: 0;
}
.ugf-image-result-inner {
  position: relative;
}
[layout="2012"] .ugf-image-result-inner,
[layout="2013"] .ugf-image-result-inner,
[layout="2013L"] .ugf-image-result-inner,
[layout="2015L"] .ugf-image-result-inner,
[layout="2016L"] .ugf-image-result-inner {
  text-decoration: none !important;
  width: 100%;
}
[layout="2012"] .ugf-image-result-hoverstats,
[layout="2013"] .ugf-image-result-hoverstats,
[layout="2013L"] .ugf-image-result-hoverstats,
[layout="2015L"] .ugf-image-result-hoverstats,
[layout="2016L"] .ugf-image-result-hoverstats {
  font-size: 13px;
  color: #000;
  max-width: 90%;
}
html:not([layout="2012"]):not([layout="2013"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]) .ugf-image-result-hoverstats {
  opacity: 0;
  position: absolute;
  bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  font-size: 11px;
  color: #fff;
  width: calc(100% - 8px);
  background: rgba(51,51,51,0.8);
  padding: 2px 4px;
}
.ugf-image-result-inner:hover .ugf-image-result-hoverstats {
  opacity: 1 !important;
}
[layout="2012"] .ugf-image-result-domain,
[layout="2013"] .ugf-image-result-domain,
[layout="2013L"] .ugf-image-result-domain,
[layout="2015L"] .ugf-image-result-domain,
[layout="2016L"] .ugf-image-result-domain {
  color: #006621;
  display: block;
  margin: 2px 0 0;
}
[layout="2012"] .ugf-image-result-size-first,
[layout="2013"] .ugf-image-result-size-first,
[layout="2013L"] .ugf-image-result-size-first,
[layout="2015L"] .ugf-image-result-size-first,
[layout="2016L"] .ugf-image-result-size-first,
html:not([layout="2012"]):not([layout="2013"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]) .ugf-image-result-size-second {
  display: none;
}
.ugf-image-result-size-second {
  display: block;
}
#ugf-image-viewer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
}
#ugf-image-viewer-inner {
  background: #222;
  height: 500px;
  width: 100%;
  pointer-events: all;
}
#ugf-image-iframe {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: -1;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
}
#ugf-image-iframe iframe {
  width: 100%;
  height: 500px;
  border: none;
  pointer-events: all !important;
}

.ugf-video-result:not([thumb-url="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="]) .ugf-video-result-thumbnail img {
  width: 118px;
  height: 67px;
}
.ugf-video-result-thumbnail {
  margin-top: 4px;
  margin-right: 8px;
  position: relative;
}
[thumb-url="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="] .ugf-video-result-thumbnail {
  display: none;
}
.ugf-search-result-duration {
  background-color: rgba(0,0,0,.7);
  color: #fff;
  padding: 1px 3px;
  font-size: 11px;
  font-weight: bold;
  position: absolute;
  bottom: 3px;
  right: 0;
  line-height: 20px;
}

html:not([legacy-neuro]) .ugf-neuro-playground,
.ugf-instant-answer {
  box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.2);
  padding: 20px;
  margin-bottom: 10px;
}
[lizard] .ugf-instant-answer:not(.ugf-easter-egg),
[lizard] .ugf-instant-answer-list {
  display: none;
}
.ugf-instant-answer-supertext {
  font-size: 13px;
  color: #777;
}
.ugf-instant-answer-supertext {
  margin-bottom: 10px;
}
.ugf-instant-answer-heading {
  color: rgba(0,0,0,.87);
  font-size: 30px;
  margin-bottom: 10px;
}
.ugf-instant-answer .ugf-search-result {
  padding-bottom: 0;
  padding-top: 10px;
  margin-bottom: 0;
}
.ugf-instant-answer-list {
  padding: 15px 20px 0;
}


.ugf-correction {
  font-weight: bold !important;
  font-size: 16px;
  margin-bottom: 10px;
  color: #c00;
}
.ugf-correction span {
  color: #c00;
}
.ugf-correction a {
  color: #1a0dab !important;
  font-weight: bold;
  font-style: italic;
  font-size: 16px;
}
.ugf-correction-blue {
  margin-bottom: 10px;
}
.ugf-correction-blue .ugf-correction-inner {
  font-size: 16px;
}

html:not([layout-dd-open]) #ugf-layout-dd,
html:not([layout-dd-open]) #ugf-layout-fence,
html:not([noton-dd-open]) #ugf-noton-dd,
html:not([noton-dd-open]) #ugf-noton-fence,
html:not([neuro-dd-open]) #ugf-neuro-dd,
html:not([neuro-dd-open]) #ugf-neuro-fence,
html:not([forceload-dd-open]) #ugf-forceload-dd,
html:not([forceload-dd-open]) #ugf-forceload-fence,
html:not([settings-display-dd-open]) #ugf-settings-display-dd,
html:not([settings-display-dd-open]) #ugf-settings-display-fence,
html:not([name-email-dd-open]) #ugf-name-email-dd,
html:not([name-email-dd-open]) #ugf-name-email-fence,
html:not([apps-dd-open]) #gp-apps-dd,
html:not([apps-dd-open]) #beyond-the-fence,
html:not([account-dd-open]) #ugf-account-dd,
html:not([account-dd-open]) #beyond-the-fence-2,
html:not([notifs-dd-open]) #ugf-notifs-dd,
html:not([notifs-dd-open]) #beyond-the-fence-3 {
  z-index: -1;
  pointer-events: none;
  opacity: 0;
}
#gp-apps-dd {
  position: absolute;
  z-index: 1918;
  margin-left: -212px;
  margin-left: -129px;
  margin-left: -143px;
  margin-top: 44px;
  margin-top: 15px;
  margin-left: -190px;
  cursor: auto;
  opacity: 1;
}
[logged-in="true"] #gp-apps-dd {
  margin-left: -224px;
}
[apps-dd-open] #gp-apps-dd {
  transition-duration: 0.2s;
}
#triangle {
  border-color: transparent;
    border-bottom-color: transparent;
  border-bottom-color: transparent;
  border-style: dashed dashed solid;
  border-width: 0 8.5px 8.5px;
  position: absolute;
  right: 72px;
  right: 94px;
  z-index: 1921;
  height: 0;
  width: 0;
  -webkit-animation: gb__a .2s;
  animation: gb__a .2s;
  border-bottom-color: #ccc;
  border-bottom-color: rgba(0,0,0,.2);
  top: -8px;
  right: 109px;
}
#triangle-2 {
  border-color: transparent;
    border-bottom-color: transparent;
  border-bottom-color: transparent;
  border-style: dashed dashed solid;
  border-width: 0 8.5px 8.5px;
  position: absolute;
  right: 72px;
  right: 94px;
  z-index: 1921;
  height: 0;
  width: 0;
  -webkit-animation: gb__a .2s;
  animation: gb__a .2s;
  border-bottom-color: #fff;
  top: -7px;
  right: 109px;
}
[logged-in="true"] #triangle,
[logged-in="true"] #triangle-2 {
  right: 75px;
}
[not-gecko] #triangle,
[not-gecko] #triangle-2 {
  right: 84px;
}
#triangle-5 {
  position: absolute;
  top: -22px;
  right: 23px;
  left: auto;
  bottom: auto;
  width: 0;
  height: 0;
  vertical-align: top;
  background: none repeat scroll 0 0 transparent;
  border: 12px solid transparent;
    border-bottom-color: transparent;
  right: 62px;
  border-bottom-color: #e5e5e5;
}
#gp-apps-dd-card {
  scrollbar-width: none;
  background: #fff;
  padding: 28px;
  padding-bottom: 12px;
  border: 1px solid rgba(0,0,0,.2);
  box-shadow: 0 2px 10px rgba(0,0,0,.2);
  cursor: auto;
  overflow-y: scroll;
  overscroll-behavior: contain;
  width: 320px;
  width: 264px;
  height: 442px;
}
[not-gecko] #gp-apps-dd-card {
  width: 332px;
}
.ugf-fence,
#beyond-the-fence,
#beyond-the-fence-2,
#beyond-the-fence-3 {
  position: fixed;
  z-index: 1917;
  width: 100vw;
  height: 100vh;
  background: transparent;
  top: 0;
  left: 0;
}
/*
#gp-apps-dd-inner {
  display: flex;
  flex-wrap: wrap;
}
*/
.sector {
  display: flex;
  flex-wrap: wrap;
}
.sector:nth-child(1) {
  padding-bottom: 28px;
  border-bottom: 1px solid #ebebeb;
}
.sector:nth-child(2),
.sector:nth-child(3) {
  padding-top: 28px;
}
#even-more {
  color: #737373 !important;
  font-size: 13px;
  font-family: arial, sans-serif !important;
  text-decoration: none !important;
  margin: 0 auto;
}
#even-more:hover {
  text-decoration: underline !important;
}
.gp-app {
  width: 86px;
  height: 100px;
  font-size: 13px;
  font-family: arial, sans-serif !important;
  padding: 1px;
}
.gp-app-inner {
  text-decoration: none !important;
  margin: 7px 0;
  height: 86px;
  display: block;
  border: 1px solid transparent;
  border-radius: 2px;
}
.gp-app:hover .gp-app-inner {
  border: 1px solid #e5e5e5;
  background: rgba(255,255,255,.9);
}
.gp-app-icon {
   background-image: url(https://ssl.gstatic.com/gb/images/v1_76783e20.png);
   -webkit-background-size: 92px 2541px;
  background-size: 92px 2541px;
}
#myaccount .gp-app-icon {
  background-position: 0 -1451px;
}
#google-search .gp-app-icon {
  background-position: -17px -207px;
}
#maps .gp-app-icon {
  background-position: 0 -450px;
}
#youtube .gp-app-icon {
  background-position: 0 0;
}
#play .gp-app-icon {
  background-position: 0 -1779px;
}
#news .gp-app-icon {
  background-position: 0 -1990px;
}
#envelope .gp-app-icon {
  background-position: 0 -1710px;
}
#drive .gp-app-icon {
  background-position: 0 -138px;
}
#calendar .gp-app-icon {
  background-position: 0 -2059px;
}
#plus .gp-app-icon {
  background-position: 0 -938px;
}
#translate .gp-app-icon {
  background-position: 0 -693px;
}
#photos .gp-app-icon {
  background-position: 0 -1145px;
}
#shopping .gp-app-icon {
  background-position: 0 -1352px;
}
#wallet .gp-app-icon,
#finance .gp-app-icon {
  background-image: url(https://ssl.gstatic.com/gb/images/p1_a4541be8.png);
  -webkit-background-size: 64px 2065px;
  background-size: 64px 2065px;
  background-position: 0 -966px;
}
#finance .gp-app-icon {
  background-position: 0 -1725px;
}
#docs .gp-app-icon {
  background-position: 0 -1214px;
}
#books .gp-app-icon {
  background-position: 0 -554px;
}
#blogger .gp-app-icon {
  background-position: 0 -1007px;
}
#contacts .gp-app-icon {
  background-position: 0 -69px;
}
#hangouts .gp-app-icon {
  background-position: 0 -2335px;
}
#firefox .gp-app-icon {
  background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Mozilla_Firefox_logo_2013.svg/1200px-Mozilla_Firefox_logo_2013.svg.png);
  background-size: 56px 56px;
  margin-top: 8px;
  width: 56px !important;
  height: 56px !important;
}
.gp-app-icon {
  margin: 0 auto;
  height: 64px;
  width: 64px;
}
.gp-app-title {
  width: fit-content;
  margin: 0 auto;
  color: #404040 !important;
  text-decoration: none !important;
}
html:not([settings-display]) #ugf-gplex-settings-btn {
  display: none;
}
#ugf-gplex-settings-btn {
  height: 30px;
  display: flex;
  align-items: center;
  padding-left: 15px;
}
html[settings-display="topbar-hover"] #ugf-gplex-settings-btn a {
  opacity: 0;
  transition-duration: 0.2s;
}
html[settings-display="topbar-hover"] #ugf-gplex-settings-btn:hover a {
  opacity: 1;
  transition-duration: 0s !important;
}
#waffle {
  height: 30px;
  display: flex;
  padding: 0 15px 0 0;
}
[layout="2010"] #ugf-apps,
[layout="2011"] #ugf-apps,
[layout="2012"] #ugf-apps,
[layout="2013"] #ugf-apps,
[layout="2013L"] #ugf-apps,
[layout="2015L"] #ugf-apps,
[layout="2016L"] #ugf-apps {
  display: none;
}
        #waffle .gp-icon {
background-image: url('https://ssl.gstatic.com/gb/images/i1_1967ca6a.png');
background-size: 528px 68px;
background-position: -132px -38px;
  opacity: .55;
  width: 30px;
        }
        #waffle:hover .gp-icon {
  opacity: .85;
        }

[logged-in="tbd"] .ugf-logged-in-out {
  display: none !important;
}
html:not([logged-in="true"]) .ugf-plus-buttons,
html:not([layout="2013"]):not([layout="2014"]) .ugf-plus-buttons {
  display: none;
}
.ugf-plus-buttons {
  position: relative;
}
.ugf-plus-buttons a,
.ugf-plus-button {
  margin-right: 15px;
  color: #666;
  font-size: 13px;
}
[name-email="email"] #ugf-username-button,
[name-email="name"] #ugf-email-button {
  display: none;
}
html:not([layout="2014"]) #ugf-fake-notifs-button,
#ugf-fake-share-button {
  background: linear-gradient(to bottom,#f8f8f8,#ececec);
  border: 1px solid #c6c6c6;
  font-size: 14px;
  font-weight: bold;
  color: #999;
  padding: 0 10px;
  height: 27px;
  border-radius: 2px;
  cursor: pointer;
}
html:not([layout="2014"]) #ugf-fake-notifs-button:hover,
#ugf-fake-share-button:hover {
  background: linear-gradient(to bottom,#ffffff,#ececec);
  border: 1px solid #bbb;
}
html:not([layout="2014"]) #ugf-fake-notifs-button:active,
#ugf-fake-share-button:active {
  background: linear-gradient(to bottom,#ffffff,#ececec);
  border: 1px solid #b6b6b6;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.2);
}
#ugf-fake-notifs-button .ugf-plus-button-icon {
  background-image: url('https://ssl.gstatic.com/gb/images/i1_3d265689.png');
  background-size: 333px 147px;
  opacity: .55;
  height: 30px;
  width: 30px;
  background-position: 0 -70px; /* -257px -47px filled */
}
html[layout="2014"] #ugf-fake-notifs-button .ugf-plus-button-text,
html:not([layout="2014"]) #ugf-fake-notifs-button .ugf-plus-button-icon {
  display: none;
}
#ugf-fake-notifs-button:hover .ugf-plus-button-icon {
  opacity: .7;
}
#ugf-fake-share-button {
  font-weight: normal;
  font-size: 13px;
  color: #666;
  position: relative;
}
[layout="2014"] #ugf-fake-share-button {
  background: rgba(0,0,0,.04);
  border: none;
  width: 60px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  text-align: center;
  border-radius: 0;
  color: #404040;
  box-shadow: none;
}
[layout="2014"] #ugf-fake-share-button:hover {
  background: rgba(0,0,0,.08);
}
[layout="2014"] #ugf-fake-share-button .ugf-plus-button-text {
  width: fit-content;
  margin: 0 auto;
}
#ugf-account-button,
#ugf-account-button img {
  width: 32px;
  height: 32px;
  position: relative;
}
[layout="2013"] #ugf-account-button,
[layout="2013"] #ugf-account-button img {
  width: 27px;
  height: 27px;
}
[layout="2013"] #ugf-account-button {
  border: 1px solid #c6c6c6;
  border-radius: 2px;
  margin-right: 15px;
}
[layout="2013"] #ugf-account-button::after {
  content: "";
  background-image: url('https://ssl.gstatic.com/gb/images/k1_a31af7ac.png');
  background-size: 294px 45px;
  background-position: -163px -40px;
  opacity: .8;
  height: 4px;
  width: 7px;
  display: block;
  position: absolute;
  right: -13px;
  top: 13px;
}
[layout="2013"] #ugf-fake-share-button::before {
  content: "";
  background-image: url('https://ssl.gstatic.com/gb/images/k1_a31af7ac.png');
  background-size: 294px 45px;
  background-position: -163px 0;
  opacity: .8;
  height: 10px;
  width: 10px;
  display: block;
  margin-right: 8px;
  margin-top: -2px;
}
[layout="2013"] #ugf-fake-share-button::after {
  content: "";
  background-image: url('https://ssl.gstatic.com/gb/images/k1_a31af7ac.png');
  background-size: 294px 45px;
  background-position: -163px -15px;
  opacity: .8;
  height: 11px;
  width: 10px;
  display: block;
  position: absolute;
  right: -10px;
  top: 8px;
}
[layout="2013"] #ugf-account-button:hover::after,
[layout="2013"] #ugf-fake-share-button:hover::before,
[layout="2013"] #ugf-fake-share-button:hover::after {
  opacity: 1;
}
html:not([layout="2013"]):not([layout="retro"]) #ugf-account-button img {
  border-radius: 50%;
}
#ugf-notifs-dd {
  position: absolute;
  top: var(--topbar-height-total);
  right: 120px;
  background-color: #e5e5e5;
  box-shadow: 0 2px 1px #aaa;
  z-index: 2000;
  right: 45px;
  top: 53px;
}
[layout="2014"] #ugf-notifs-dd {
  right: 34px;
  top: 45px;
}
#ugf-notifs-dd-card {
  width: 400px;
  box-shadow: 0 0 5px #bbb;
  border: 1px solid #bbb;
}
#ugf-notifs-dd-top {
  height: 40px;
  padding: 4px 20px;
}
#ugf-notifs-dd-top-left {
  display: inline-block;
  line-height: 40px;
  margin-left: 40px;
  text-align: center;
  width: 280px;
  vertical-align: top;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
#ugf-notifs-dd-top-left a {
  color: #404040;
  margin-left: 14px;
}
#ugf-notifs-dd-read-button {
  padding: 12px;
  opacity: 0.27;
  cursor: pointer;
}
#ugf-notifs-dd-read-button:hover {
  opacity: 0.55;
}
#ugf-notifs-dd-read-button-icon {
  background: no-repeat url(https://ssl.gstatic.com/s2/oz/images/sprites/notsg-eb27f5870940f5aacf4b28805c7d5ad3.png) -18px -82px;
  height: 16px;
  width: 16px;
}
#ugf-notifs-dd-jingles {
  width: fit-content;
  margin: 0 auto;
  padding-bottom: 20px;
  min-height: 256px;
}
#ugf-notifs-dd-caught-up {
  -webkit-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  background-color: white;
  color: #aaa;
  display: inline-block;
  font-size: 13px;
  padding: 15px 20px;
  position: relative;
  text-align: center;
  margin-top: 50px;
}
html:not([notifs-dd-open]) #ugf-mr-jingles {
  display: none;
}
#ugf-mr-jingles {
  margin: 0 auto;
  width: fit-content;
}
[gplus-notif-status="loading"] #ugf-notifs-dd-prev {
  visibility: hidden;
}
#ugf-notifs-dd-prev {
  border-radius: 3px 3px 0 0;
  background: #ebebeb;
  cursor: pointer;
  line-height: 14px;
  margin: 0 0 0 20px;
  padding: 17px 0;
  text-align: center;
  width: 360px;
  outline: none;
  color: #737373;
  font-size: 13px;
}
#ugf-notifs-dd-prev:hover {
  background: #f1f1f1;
}
#ugf-notifs-dd-prev-text {
  margin-left: auto;
  width: fit-content;
}
#ugf-notifs-dd-prev-icon {
  background: no-repeat url(https://ssl.gstatic.com/s2/oz/images/sprites/notsg-eb27f5870940f5aacf4b28805c7d5ad3.png) -82px -100px;
  height: 12px;
  width: 12px;
  opacity: .55;
  display: inline-block;
  margin: 0 auto 0 10px;
  vertical-align: bottom;
}
#ugf-notifs-dd-prev:hover #ugf-notifs-dd-prev-icon {
  opacity: 0.7;
}
#ugf-notifs-opening {
  padding-top: 90px;
  min-height: 186px;
}
#ugf-notifs-circle {
  height: 32px;
  width: 32px;
  margin: 0 auto;
  background-image: url(https://ssl.gstatic.com/s2/oz/images/notifications/spinner_32_041dcfce66a2d43215abb96b38313ba0.gif);
}
#ugf-notifs-opening-text {
  color: #aaa;
  font: 16px Arial,sans-serif;
  padding: 40px 0;
  position: relative;
  width: fit-content;
  margin: 0 auto;
}
html[gplus-notif-status="failed"] #ugf-notifs-dd-loading,
html[gplus-notif-status="loading"] #ugf-notifs-dd-cant,
html[gplus-notif-status="none"] #ugf-notifs-dd-banner,
html[gplus-notif-status="none"] #ugf-notifs-opening,
html[gplus-notif-status="none"] #ugf-notifs-dd-banner,
html[gplus-notif-status="loading"] #ugf-notifs-dd-jingles,
html[gplus-notif-status="failed"] #ugf-notifs-opening {
  display: none;
}
#ugf-notifs-dd-banner {
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
  font-size: 13px;
  height: 24px;
  min-width: 200px;
  padding: 9px 15px 0 15px;
}
#ugf-notifs-dd-banner {
  background: #fff1a8;
  border-color: #fff1a8;
  color: #000;
}
#ugf-notifs-dd-banner {
  font-weight: bold;
  text-align: center;
  width: 236px;
  position: absolute;
  left: 65px;
}
#ugf-notifs-dd-banner {
  border: 3px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  border-radius: 3px;
  -webkit-border-radius: 3px;
}
#ugf-account-dd {
  position: absolute;
  top: var(--topbar-height-total);
  right: 7px;
  background: #f5f5f5;
  box-shadow: 0 2px 4px rgba(0,0,0,.2);
  border: 1px solid #bebebe;
  z-index: 2000;
}
#ugf-account-dd-account {
  background: #fff;
  border-bottom: 1px solid #bebebe;
  box-shadow: 0 2px 4px rgba(0,0,0,.12);
  padding: 20px;
}
#ugf-account-dd-account a {
  display: block;
}
#ugf-account-pfp {
  text-decoration: none !important;
  position: relative;
  height: 96px;
}
#ugf-account-normal-pfp {
  display: none;
}
#ugf-account-pfp-change {
  display: flex;
  align-items: center;
  text-decoration: none !important;
  position: absolute;
  bottom: 0;
  opacity: 0;
  width: 100%;
}
#ugf-account-pfp-change span {
  color: #fff;
  font-size: 9px;
  font-weight: bold;
  width: fit-content;
  display: block;
  margin: 0 auto;
  padding: 6px 0;
  opacity: 0;
  transition: opacity .218s ease-in-out;
}
#ugf-account-dd:hover #ugf-account-pfp-change {
  background: #4d90fe;
  opacity: 0.8;
}
#ugf-account-dd:hover #ugf-account-pfp-change span {
  background: #4d90fe;
  opacity: 1;
}
#ugf-account-right {
  margin-left: 20px;
  font-size: 13px;
  padding-right: 50px;
  color: #666;
}
#ugf-account-username {
  color: #000;
  font-weight: bold;
  margin-bottom: 2px;
}
#ugf-account-links {
  color: #ccc;
  margin: 6px 0 9px;
}
#ugf-account-links a {
  color: #36c !important;
}
#ugf-account-links span {
  margin: 0 10px;
}
#ugf-account-profile {
  border: 1px solid #3079ed;
  color: #fff !important;
  width: fit-content;
  background: linear-gradient(to bottom,#4d90fe,#4787ed);
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  cursor: default !important;
  display: inline-block;
  font-weight: bold;
  height: 29px;
  line-height: 29px;
  min-width: 54px;
  *min-width: 70px;
  padding: 0 8px;
  text-align: center;
  text-decoration: none !important;
  -moz-user-select: none;
  -webkit-user-select: none;
}
#ugf-account-profile:hover {
  border-color: #2f5bb7;
  background: linear-gradient(to bottom,#4d90fe,#357ae8);
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
#ugf-account-profile:focus {
  background: linear-gradient(to bottom,#4d90fe,#357ae8);
  border-color: #2f5bb7;
  box-shadow: inset 0 0 0 1px #fff,0 1px 1px rgba(0,0,0,.1);
}
#ugf-account-profile:active {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}
#ugf-account-dd-bottom {
  padding: 10px 0;
}
.ugf-account-dd-button {
-moz-border-radius: 2px;
-webkit-border-radius: 2px;
border-radius: 2px;
cursor: default !important;
display: inline-block;
font-weight: bold;
height: 29px;
line-height: 29px;
min-width: 54px;
*min-width: 70px;
padding: 0 8px;
text-align: center;
text-decoration: none !important;
-moz-user-select: none;
-webkit-user-select: none;
border: 1px solid #dcdcdc;
border-color: rgba(0,0,0,.1);
color: #444 !important;
font-size: 11px;
background: linear-gradient(to bottom,#fff,#fbfbfb);
margin: 0 20px;
}
.ugf-account-dd-button:hover {
  border-color: #c6c6c6;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
  color: #222 !important;
  background: linear-gradient(to bottom,#fff,#f8f8f8);
}
.ugf-account-dd-button:focus {
  box-shadow: inset 0 0 0 1px #fff,0 1px 1px rgba(0,0,0,.1);
  border: 1px solid #4d90fe;
}
.ugf-account-dd-button:active {
border-color: #c6c6c6;
box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
color: #222 !important;
background: linear-gradient(to bottom,#fff,#f8f8f8);
}
#ugf-sign-out {
  margin-left: auto;
}



[location="structured-home"]::after {
  background: #f4f4f4;
  content: "";
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
#ugf-structured-hp-cards {
  width: 100vw;
}
.ugf-hp-card-double-list {
  width: 1000px;
  padding-top: 15px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
}
.ugf-hp-card {
  height: 150px;
  background: #fff;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16),0 0 0 1px rgba(0,0,0,0.08);
  width: 490px;
  margin-bottom: 20px;
  text-decoration: none !important;
}
.ugf-hp-card:nth-child(2n - 1) {
  margin-right: auto;
}
.ugf-hp-card:nth-child(2n) {
  margin-left: auto;
}
.ugf-hp-card-left {
  padding: 4px;
  background: #f1f1f1;
  height: 142px;
  display: flex;
  align-items: center;
  border-right: 1px solid #ddd;
  width: 140px;
  min-width: 140px;
}
.ugf-hp-card img {
  width: 120px;
  margin: 0 auto;
}
#ugf-photos img {
  width: 135px;
  margin: 0 auto 0 0;
}
#ugf-drive img {
  width: 135px;
  margin: 0 auto;
}
.ugf-hp-card-right {
  padding: 10px 15px;
  height: 129px;
  width: 312px;
  display: flex;
  align-items: center;
}
.ugf-hp-card:hover .ugf-hp-card-right {
  box-shadow: inset 8px 0 16px rgba(0,0,0,0.1);
}
.ugf-hp-card:active .ugf-hp-card-right {
  box-shadow: inset 16px 0 32px rgba(0,0,0,0.15);
}
.ugf-hp-card-title {
  font-size: 26px;
  margin-bottom: 4px;
  color: #222;
  width: fit-content;
}
.ugf-hp-card-sub {
  color: #777;
  font-size: 13px;
}

#ugf-hp-footer,
#ugf-structured-hp-footer {
  margin-top: 20px;
  background: #f2f2f2;
  border-top: 1px solid #e4e4e4;
  width: 100%;
  line-height: 40px;
}
#ugf-structured-hp-footer-right {
  margin-left: auto;
  margin-right: 30px;
}
.ugf-structured-hp-footer-link {
  padding-left: 31px;
  color: #666 !important;
  font-size: 13px;
}
@media only screen and (min-height: 850px) {
  #ugf-structured-hp-footer {
    position: fixed;
    bottom: 0;
  }
}
#ugf-hp-footer {
  position: fixed;
  bottom: 0;
}

[location="home"] #ugf-topbar,
[layout="2016"][location="home"] #ugf-topbar,
[layout="2016C"][location="home"] #ugf-topbar,
[layout^="2018"][location="home"] #ugf-topbar,
[layout="2019"][location="home"] #ugf-topbar {
  background: none;
  height: 30px;
  padding: 12px 3px;
  border-bottom: none;
}
[location="home"] #ugf-navbar {
  display: none;
}
[location="home"] #ugf-logo-cont {
  display: none;
}
html:not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]) #ugf-hp-search-links,
[layout="2012"] #ugf-homepage-links,
[layout="2013"] #ugf-homepage-links,
[layout="2013L"] #ugf-homepage-links,
[layout="2015L"] #ugf-homepage-links,
[layout="2016L"] #ugf-homepage-links,
html:not([location="home"]) #ugf-homepage-links {
  display: none;
}
.ugf-homepage-link {
  color: rgba(0,0,0,0.87) !important;
  font-size: 13px;
  margin-right: 15px;
}
.ugf-homepage-link:hover {
  opacity: .85;
  text-decoration: underline;
}
#ugf-hp {
  width: 584px;
  margin: 0 auto;
}
html:not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]) #ugf-hp-inner {
  margin-top: 144px;
}
[layout="2016C"] #ugf-hp #ugf-search,
[layout^="2018"] #ugf-hp #ugf-search,
[layout="2019"] #ugf-hp #ugf-search {
  width: 584px;
}
#ugf-hp-logo {
  width: 272px;
  height: 92px;
  margin: 0 auto;
}
#ugf-hp-logo img {
  width: 272px;
  height: 92px;
}
[layout="2012"] #ugf-hp-logo img,
[layout="2013"] #ugf-hp-logo img,
[layout="2014"] #ugf-hp-logo img,
[layout="2015"] #ugf-hp-logo img {
  width: 269px;
  height: 95px;
}
#ugf-hp-search {
  margin-top: 31px;
  margin-left: 6px;
}
[layout="2013L"] #ugf-hp-search,
[layout="2015L"] #ugf-hp-search,
[layout="2016L"] #ugf-hp-search {
  margin-top: 36px;
  margin-left: 36px;
}
[layout="2012"] #ugf-hp-search,
[layout="2013"] #ugf-hp-search,
[layout="2014"] #ugf-hp-search,
[layout="2015"] #ugf-hp-search {
  margin-top: 23px;
  max-width: 568px;
}
[layout="2012"] #ugf-hp-search #ugf-search,
[layout="2013"] #ugf-hp-search #ugf-search,
[layout="2014"] #ugf-hp-search #ugf-search,
[layout="2015"] #ugf-hp-search #ugf-search {
  max-width: 568px;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"])[location="home"] #ugf-search-btn {
  display: none;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"])[location="home"] #ugf-searchbar {
  border-right: 1px solid rgb(217, 217, 217) !important;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"])[location="home"][search-focus="soft"] #ugf-searchbar {
  border: 1px solid rgb(217, 217, 217) !important;
  box-shadow: none;
}
html:not([layout="2016C"]):not([layout="2017"]):not([layout^="2018"]):not([layout="2019"])[location="home"][search-focus="hard"] #ugf-searchbar {
  border-right: 1px solid #08c !important;
  border-right: 1px solid #4d90fe !important;
}
[layout="2013L"][location="home"] #ugf-search #ugf-searchbar,
[layout="2015L"][location="home"] #ugf-search #ugf-searchbar,
[layout="2016L"][location="home"] #ugf-search #ugf-searchbar {
  height: 32px;
  width: 514px;
  border: 1px solid #8f8f9d !important;
  border-radius: 2px;
}
[layout="2013L"][location="home"] #ugf-search #ugf-searchbar:hover,
[layout="2015L"][location="home"] #ugf-search #ugf-searchbar:hover,
[layout="2016L"][location="home"] #ugf-search #ugf-searchbar:hover {
  border: 1px solid #676774 !important;
}
[layout="2013L"][location="home"][search-focus="hard"] #ugf-search #ugf-searchbar,
[layout="2015L"][location="home"][search-focus="hard"] #ugf-search #ugf-searchbar,
[layout="2016L"][location="home"][search-focus="hard"] #ugf-search #ugf-searchbar {
  border: 1px solid #484851 !important;
}
.ugf-hp-search-link {
  color: #36c !important;
  display: block;
  margin: 2px 0;
  margin-left: 0px;
  margin-left: 13px;
  font-size: 11px;
  width: 106px;
}
#ugf-hp-buttons-row {
  margin-top: 20px;
}
[layout="2012"] #ugf-hp-buttons-row,
[layout="2013"] #ugf-hp-buttons-row,
[layout="2014"] #ugf-hp-buttons-row,
[layout="2015"] #ugf-hp-buttons-row {
  margin-top: 5px;
}
[layout="2013L"] #ugf-hp-buttons-row,
[layout="2015L"] #ugf-hp-buttons-row,
[layout="2016L"] #ugf-hp-buttons-row {
  margin-top: 6px;
}
#ugf-hp-buttons {
  width: fit-content;
  margin: 0 auto;
}
#ugf-hp-buttons a {
  background: -webkit-linear-gradient(top,#f5f5f5,#f1f1f1);
  -webkit-user-select: none;
  background-color: #f2f2f2;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  color: #757575;
  cursor: default;
  font-family: arial,sans-serif;
  font-size: 13px;
  font-weight: bold;
  margin: 11px 4px;
  min-width: 54px;
  padding: 0 16px;
  text-align: center;
  height: 36px;
  line-height: 27px;
  display: flex;
  align-items: center;
  text-decoration: none !important;
}
#ugf-hp-buttons a:hover {
  background-image: -webkit-linear-gradient(top,#f8f8f8,#f1f1f1);
  border: 1px solid #c6c6c6;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  color: #222;
}
#ugf-hp-buttons a:active,
#ugf-hp-buttons a:focus {
  border: 1px solid #4d90fe;
  outline: none;
}
[layout="2013L"] #ugf-hp-buttons a,
[layout="2015L"] #ugf-hp-buttons a,
[layout="2016L"] #ugf-hp-buttons a {
  background: url(https://www.google.com/images/srpr/nav_logo80.png) 0 -258px repeat-x;
  color: #000;
  cursor: pointer;
  height: 30px;
  margin: 0 0 0 4px;
  outline: 0;
  font: 15px arial,sans-serif;
  border: 1px solid;
  border-color: #ccc #999 #999 #ccc;
  padding: 0 4px;
}
[layout="2013L"] #ugf-hp-buttons a:hover,
[layout="2015L"] #ugf-hp-buttons a:hover,
[layout="2016L"] #ugf-hp-buttons a:hover {
  border-color: #ddd #aaa #aaa #ddd;
}
[layout="2013L"] #ugf-hp-buttons a:active,
[layout="2015L"] #ugf-hp-buttons a:active,
[layout="2016L"] #ugf-hp-buttons a:active {
  background: #ccc;
}
[layout="2012"] #ugf-hp-buttons a,
[layout="2013"] #ugf-hp-buttons a,
[layout="2014"] #ugf-hp-buttons a,
[layout="2015"] #ugf-hp-buttons a {
  margin: 11px 8px;
}

html[fake-spa] #ugf-main-inner {
  transition: opacity 0.1s linear;
}
html[fake-spa]:not([results-arrived]) #ugf-main-inner {
  opacity: 0;
}
html[fake-spa][results-arrived][hide-results="true"] #ugf-main-inner {
  opacity: 0;
}


#ugf-footer {
  margin-bottom: 40px;
}
html:not([legacy-footer]) #ugf-footer-links {
  display: none;
}
.ugf-footer-links {
  width: fit-content;
  margin: 0 auto;
}
#ugf-footer-links-upper,
#ugf-footer-links-middle {
  margin-top: 19px;
}
.ugf-footer-link {
  margin: 0 12px;
  color: #12c !important;
  text-decoration: none !important;
  font-size: 13px;
}



#ugf-load-now-container {
  margin-top: 10px;
  display: flex;
}
#ugf-load-now {
  margin-left: 5px;
  color: #12c;
  cursor: pointer;
}
[noton-images][location="images"] #ugf-load-now-container,
[results-arrived] #ugf-load-now-container {
  display: none;
}
#ugf-load-now:hover {
  text-decoration: underline;
}

[location="images"]:not([layout="2010"]):not([layout="2011"]):not([layout="2012"]):not([layout="2013"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]):not([layout="2019"]) body {
  background: #f1f1f1;
}



.ugf-gplex-section:not(:first-of-type) {
  border-top: 1px solid #ebebeb;
}
.ugf-gplex-section {
  max-width: 1140px;
  min-width: 200px;
  width: 96%;
  padding: 18px 0;
  margin-left: 20px;
}
.ugf-gplex-section-title {
  font-size: 16px;
  min-height: 42px;
  font-weight: 500;
  color: #333;
}
.ugf-gplex-option {
  position: relative;
}
.ugf-dropdown-button {
  background: linear-gradient(to bottom,#f5f5f5,#f1f1f1);
  border: 1px solid #dcdcdc;
  color: #444;
  cursor: default;
  font-size: 11px;
  font-weight: bold;
  line-height: 27px;
  list-style: none;
  margin: 0 2px;
  border-radius: 2px;
  display: block;
  white-space: nowrap;
  padding: 0 8px;
  position: relative;
  width: 554px;
  -webkit-user-select: none;
  max-height: 27px;
  cursor: pointer;
}
.ugf-dropdown-button::after {
  content: "";
  display: inline-block;
  border-color: #777 transparent;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  height: 0;
  width: 0;
  position: absolute;
  right: 5px;
  top: 12px;
}
[layout-dd-open] #ugf-layout-dd-btn::after,
[noton-dd-open] #ugf-noton-dd-btn::after,
.ugf-dropdown-button:hover::after {
  border-color: #595959 transparent;
}
.ugf-dropdown-button:hover {
  background-image: linear-gradient(to bottom,#f8f8f8,#f1f1f1);
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
  border-color: #c6c6c6;
  color: #333;
}
[layout-dd-open] #ugf-layout-dd-btn,
[noton-dd-open] #ugf-noton-dd-btn,
.ugf-dropdown-button:active {
  background-image: linear-gradient(to bottom,#eee,#e0e0e0);
  box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
  border-color: #ccc;
  color: #333;
}
.ugf-dropdown-button:focus {
  border-color: #4d90f3;
}
.ugf-dropdown {
  position: absolute;
  z-index: 1918;
  top: 29px;
  box-shadow: 0 2px 4px rgba(0,0,0,.2);
  border: 1px solid rgba(0,0,0,.2);
  width: 570px;
  background: #fff;
  padding: 6px 0;
  font-size: 13px;
  left: 2px;
}
.ugf-dropdown-item {
  display: block;
  padding: 6px 104px 6px 30px;
  padding: 6px 20px 6px 20px;
  color: #333;
  -webkit-user-select: none;
  cursor: pointer;
}
.ugf-dropdown-item:hover {
  background: #eee;
}
.ugf-gplex-text {
  color: #555;
  font-size: 11px;
  margin-left: 8px;
  max-width: 550px;
}
.ugf-input input {
  width: 552px;
  height: 29px;
  padding: 0 8px;
  background: #fff;
  border: 1px solid #ccc;
  border-top: 1px solid #c0c0c0;
  border-radius: 0;
  outline: none;
}
.ugf-input input:focus {
  box-shadow: inset 0 1px 2px rgba(0,0,0,.3);
  border: 1px solid #4d90fe;
}
[unsaved="error"] .ugf-input input {
  background: #fcc;
}
.ugf-input .ugf-input-below {
  font-size: 13px;
  color: #c00;
  margin-top: 2px;
}
.ugf-input .ugf-input-unsaved,
.ugf-input .ugf-input-error {
  display: none;
}
[unsaved="error"] .ugf-input .ugf-input-error {
  display: block;
}
[unsaved="true"] .ugf-input .ugf-input-unsaved {
  display: block;
}

[neuro-expand] .ugf-neuro-show-more,
html:not([neuro-expand]) .ugf-neuro-show-less,
[legacy-neuro] .ugf-neuro-expander,
[neuro-status^="h"] #ugf-right-neuro-playground,
[neuro-status^="h"] #ugf-search-results-neuro-playground,
[neuro-status^="r"] .ugf-generating-text,
[neuro-status^="r"] .ugf-neuro-title,
[neuro-status^="r"] .ugf-neuro-expander,
[neuro-status^="d"] .ugf-generating-text,
[neuro-status^="g"] .ugf-neuro-title,
[neuro-status^="g"] .ugf-neuro-expander,
html:not([legacy-neuro]) #ugf-right-neuro-playground,
[legacy-neuro] #ugf-search-results-neuro-playground,
html:not([neuro-status]) #ugf-right-neuro-playground,
html:not([neuro-status]) #ugf-search-results-neuro-playground{
  display:none
}
html:not([legacy-neuro])[neuro-status^="d"] .ugf-neuro-content{
  animation:0.3s neuroFade 1;
}
#ugf-search-results-neuro-playground{
  margin-bottom:20px
}
.ugf-neuro-playground .ugf-generating-text svg,
.ugf-neuro-playground .ugf-neuro-title svg{
  margin-right:6px;
  fill:#3179ed
}
@keyframes goUp{
0%{
  transform:translateY(100%);
  opacity:0
}
100%{
  transform:translateY(0%);
  opacity:1
}
}
@keyframes neuroFade{
0%{

  opacity:0
}
100%{
  opacity:1
}
}
#ugf-main .ugf-neuro-playground .ugf-generating-text span,
#ugf-main .ugf-neuro-playground .ugf-neuro-title span{
  animation:0.3s goUp 1;
}
.ugf-neuro-content *{
  animation:none!important
}
.ugf-neuro-content{
  margin-top:10px
}
html:not([layout^="2016C"]):not([layout^="2018"]):not([layout^="2019"]) .ugf-neuro-content *{
  font-size:14px;
  line-height:20px!important
}
#ugf-main .ugf-neuro-content *{
  font-size:16px;
  line-height:20px!important;
  border-radius:0
}
#ugf-right-neuro-playground .ugf-neuro-content *{
  font-size:13px;
  line-height:17px!important;
  border-radius:0
}
.ugf-neuro-content div:not([class]):not([jscontroller]):not([data-ved]) > div:first-child,
.ugf-neuro-content div:not([class]):not([jscontroller]):not([data-ved]){
  max-width:456px
}
#ugf-right-neuro-playground .ugf-neuro-content div:not([class]):not([jscontroller]):not([data-ved]){
  max-width:260px
}
.ugf-neuro-content > div{
  padding-bottom:0;
  margin-bottom:-15px
}
.ugf-neuro-playground{
  position:relative
}
[neuro-expand] #ugf-main .ugf-neuro-content{
  margin-bottom:40px
}
html:not([neuro-expand]):not([legacy-neuro]) .ugf-neuro-content{
  margin-bottom:-10px;
  min-height:200px
}
#ugf-right-neuro-playground .ugf-neuro-playground{
  width:260px;
  border:1px solid #dedede;
  padding:10px 10px 0!important
}
#ugf-right-neuro-playground{
  margin:20px 0 0 60px
}
html:not([neuro-expand]):not([legacy-neuro]) .ugf-neuro-content{
  max-height:200px;
  overflow-y:hidden
}
[neuro-status^="r"] .ugf-neuro-content{
  min-height:30px!important;
  margin-top:0
}
[legacy-neuro] .ugf-neuro-content,
[neuro-status^="r"][legacy-neuro] .ugf-neuro-content{
  min-height:40px!important
}
.ugf-neuro-expander{
  z-index:19911919;
  position:absolute;
  width:100%;
  display:flex;
  align-items:center;
  margin-left:-20px;
  height:54px;
  top:210px;
  background:linear-gradient(to top,#fffe 50%, #fffa, #fff0);
  cursor:pointer;
  font-size:16px;
  color:#444
}
.ugf-neuro-expander:hover{
  color:#222
}
[neuro-expand] .ugf-neuro-expander{
  top:unset;
  bottom:0
}
.ugf-neuro-expander div{
  margin:0 auto
}
.ugf-neuro-dismiss{
  cursor:pointer;
  color:#666;
  font-size:12px;
  display:block;
  margin-left:auto;
  width:fit-content;
  position:relative;
  z-index:1
}
#ugf-main .ugf-neuro-dismiss{
  margin-top:-5px;
  margin-bottom:-10px
}


[layout="2018M"]:not([location="home"]) #ugf-navbar-inner,
[layout="2018M"]:not([location="home"]) #ugf-topbar{
  background:#4285f4!important
}
[layout="2018M"]:not([location="home"]) #ugf-navbar-inner{
  box-shadow:0 5px 5px #0004;
  border-bottom:none
}
[layout="2018M"]:not([location="home"]) #ugf-logo{
  filter:brightness(290)
}
[layout="2018M"]:not([location="home"]) .ugf-tab{
  color:#eee!important;
  text-transform:uppercase;
  font-size:14px;
  font-weight:600;
  opacity:0.7;
  letter-spacing:0.2px
}
[layout="2018M"]:not([location="home"]) .ugf-tab:hover,
[layout="2018M"]:not([location="home"]) .ugf-tab.active{
  color:#fff!important;
  opacity:1
}
[layout="2018M"]:not([location="home"]) .ugf-tab.active{
  border-bottom-color:#fff!important
}
[layout="2018M"]:not([location="home"])  #ugf-search,
[layout="2018M"]:not([location="home"]) [search-focus] #ugf-search{
  background:#71a7ff;
  box-shadow:none;
}
[layout="2018M"]:not([location="home"]) #ugf-search-value{
  color:#fff!important
}
[layout="2018M"]:not([location="home"]) #ugf-search-btn svg{
  fill:#fff
}

[layout="2018M"]:not([location="home"]) .ugf-homepage-link{
  color:#fff!important
}
[layout="2018M"]:not([location="home"]) #waffle{
  filter:invert(1)
}


[layout="2018M"] .ugf-search-result-title{
  font-size:20px;
  line-height:24px;
  /*color:#000*/
}
[layout="2018M"] .ugf-search-result-link{
  font-size:14px;
  color:#666!important
}
[layout="2018M"] .ugf-search-result-desc,
[layout="2018M"] .ugf-search-result-desc span,
[layout="2018M"] .ugf-search-result-desc div,
[layout="2018M"] .ugf-search-result-desc div > span:nth-of-type(2),
[layout="2018M"] .ugf-search-result-desc em{
  color:#333!important;
  font-size:14px!important;
  margin-top:2px
}
[layout="2018M"]:not([location="home"]) #ugf-search-predictions{
  background:#71a7ff
}
[layout="2018M"]:not([location="home"]) .ugf-search-prediction:not(:visited){
  color:#fff
}


[layout="2015"] #ugf-account-pfp img,
[layout="2016"] #ugf-account-pfp img,
[layout="2016C"] #ugf-account-pfp img,
[layout^="2018"] #ugf-account-pfp img,
[layout="2019"] #ugf-account-pfp img{
  border-radius:50%
}
[layout="2015"] #ugf-account-profile,
[layout="2016"] #ugf-account-profile,
[layout="2016C"] #ugf-account-profile,
[layout^="2018"] #ugf-account-profile,
[layout="2019"] #ugf-account-profile{
  background:#4d90fe;
  border: 1px solid rgba(0,0,0,.1);
  border-radius: 3px;
  height:27px;
  line-height:27px;
  font-size:11px
}
[layout="2015"] #ugf-account-profile:hover,
[layout="2016"] #ugf-account-profile:hover,
[layout="2016C"] #ugf-account-profile:hover,
[layout^="2018"] #ugf-account-profile:hover,
[layout="2019"] #ugf-account-profile:hover{
  background:#3983fe
}
[layout="2015"] #ugf-account-profile:active,
[layout="2016"] #ugf-account-profile:active,
[layout="2016C"] #ugf-account-profile:active,
[layout^="2018"] #ugf-account-profile:active,
[layout="2019"] #ugf-account-profile:active{
  background:#357ae8
}
[layout="2015"] .ugf-account-dd-button,
[layout="2016"] .ugf-account-dd-button,
[layout="2016C"] .ugf-account-dd-button,
[layout^="2018"] .ugf-account-dd-button,
[layout="2019"] .ugf-account-dd-button{
  padding: 0 8px;
  color: #444;
  border: 1px solid rgba(0,0,0,.1);
  border-radius: 3px;
  background:#f5f5f5;
  font-size:13px;
  line-height:27px;
  height:27px;
  font-weight:normal
}
[layout="2015"] .ugf-account-dd-button:hover,
[layout="2016"] .ugf-account-dd-button:hover,
[layout="2016C"] .ugf-account-dd-button:hover,
[layout^="2018"] .ugf-account-dd-button:hover,
[layout="2019"] .ugf-account-dd-button:hover{
  color: #222;
  border-color: rgba(0,0,0,.2);
  background:#f8f8f8;
}
[layout="2015"] .ugf-account-dd-button:active,
[layout="2016"] .ugf-account-dd-button:active,
[layout="2016C"] .ugf-account-dd-button:active,
[layout^="2018"] .ugf-account-dd-button:active,
[layout="2019"] .ugf-account-dd-button:active{
  background:#f1f1f1;
}
[layout="2015"] #ugf-account-dd-bottom,
[layout="2016"] #ugf-account-dd-bottom,
[layout="2016C"] #ugf-account-dd-bottom,
[layout^="2018"] #ugf-account-dd-bottom,
[layout="2019"] #ugf-account-dd-bottom{
  background:#fff
}
[layout="2015"] #ugf-account-right,
[layout="2016"] #ugf-account-right,
[layout="2016C"] #ugf-account-right,
[layout^="2018"] #ugf-account-right,
[layout="2019"] #ugf-account-right{
  padding-right:0
}
[layout="2015"] #ugf-account-dd,
[layout="2016"] #ugf-account-dd,
[layout="2016C"] #ugf-account-dd,
[layout^="2018"] #ugf-account-dd,
[layout="2019"] #ugf-account-dd{
  right:25px
}
[location="gplex"][layout="2018M"] #ugf-navbar-left{
  color:#fff
}
[layout="2018M"] #ugf-sign-in{
  text-transform:uppercase;
  font-size:14px;
  box-shadow:none!important;
  background:#4285f4!important;
  height:36px;
  line-height:36px;
  padding:0 16px;
  border-radius:2px
}


.LT6XE{
  min-width:500px!important
}
.kLMmLc{
  display:flex!important
}
.UxeQfc{
  display:flex!important;
  flex-direction:column!important
}
#folsrch-ghost,
li.tg2Kqf{
  display:none!important
}
.v8MW6c.mWcf0e, /* feedback on block */
.x2qcTc /* neuro rating */ {
  display:none!important
}
        </style>
        `;
        class SearchResultAPI {
        href;
        title;
        unmoddedTitle;
        itemNo;
        description;
        src;
        width;
        height;
        iframeUrl;
        doc;
        refdoc;
        heading;
        medium;
        link;
        domain;
        bigSrc;
        list;
        thumbnail;
        duration;
        constructor(item, type) {
            if (type == "result") {
                this.href = item.href;
                this.title = item.title;
                this.unmoddedTitle = item.unmoddedTitle;
                this.itemNo = item.itemNo;
                this.description = item.description;
            }
            if (type == "video") {
                this.href = item.href;
                this.title = item.title;
                this.unmoddedTitle = item.unmoddedTitle;
                this.itemNo = item.itemNo;
                this.description = item.description;
                this.thumbnail = item.thumbnail;
                this.duration = item.duration;
            }
            if (type == "image") {
                this.itemNo = item.itemNo;
                this.src = item.src;
                this.width = item.width;
                this.height = item.height;
                this.iframeUrl = item.iframeUrl;
                this.refdoc = item.refdocid;
                this.doc = item.docid;
                this.link = item.link;
                this.title = item.title;
                this.domain = item.domain;
                this.bigSrc = item.bigSrc;
            }
            if (type == "block") {
                this.itemNo = item.itemNo;
                if (item.title) {
                    this.title = item.title;
                }
                if (item.heading) {
                    this.heading = item.heading;
                }
                if (item.medium) {
                    this.medium = item.medium;
                }
                if (item.list) {
                    this.list = item.list;
                }
            }
        }
    }
    class SearchSidebarAPI {
        title;
        sub;
        img;
        desc;
        kc1;
        kc2;
        kc3;
        kc4;
        kc5;
        kc6;
        kc7;
        kc8;
        kc9;
        kc10;
        kc11;
        kc12;
        constructor(tit, subtit, img, desc, kc1, kc2, kc3, kc4, kc5, kc6, kc7, kc8, kc9, kc10, kc11, kc12) {
            if (tit != null) {
                this.title = tit;
                this.sub = subtit;
                this.img = img;
                this.desc = desc;
                this.kc1 = kc1;
                this.kc2 = kc2;
                this.kc3 = kc3;
                this.kc4 = kc4;
                this.kc5 = kc5;
                this.kc6 = kc6;
                this.kc7 = kc7;
                this.kc8 = kc8;
                this.kc9 = kc9;
                this.kc10 = kc10;
                this.kc11 = kc11;
                this.kc12 = kc12;
            }
        }
    }
    let UImessages = {
        "l2019": "2019",
        "l2018M": "2017-2018 (Custom material version)",
        "l2018": "2017-2018",
        "l2016": "2016",
        "l2016C": "2016 (Cardified experiment)",
        "l2016L": "2016 (Legacy/old browser version)",
        "l2015": "2015",
        "l2015L": "2014-2015 (Legacy/old browser version)",
        "l2014": "2014",
        "l2013": "Late 2012-2013",
        "l2013L": "2013 (Legacy/old browser version)",
        "l2012": "Late 2011-Early 2012",
        "notonOn": "On",
        "notonOff": "Off (compatible with the Google Images Restored extension)",
        "forceLoadMsgOn": "On",
        "forceLoadMsgOff": "Off",
        "forceLoadMsgFast": "Off (experimental fast mode, not recommended)",
        "NEname": "Username",
        "NEemail": "Email",
        "NEnone": 'None (it will say "account" instead)',
        "SDnone": "Never show",
        "SDtopbar": "Always show",
        "SDtopbarHover": "Show on hover",
        "NRtrue": "On",
        "NRfalse": "Off"
    };
    let linkList = [];
    let searchValue;
    let searchValueV;
    let hasSidebar = false;
    let sidebarInfoList = [];
    let SB = new SearchSidebarAPI(null);
    let loggedIn = "tbd";
    let pfp;
    let pfp96;
    let username;
    let email;
    let tempSidebarList = [];
    let tempUpbarList;
    let firstLinkBelongsToBlock = false;
    let hasCorrection = false;
    let correction;
    let insteadLink;
    let resultCount;
    let url = window.location.href;
    let tbs;
    let page = 1;
    let navbarText = "Search";
    let tempQuery = window.location.href.split("q=");
    let location = "all";
    let layout = localStorage.getItem("UGF_LAYOUT");
    let structuredHP = localStorage.getItem("UGF_STRUCTURED_HOMEPAGE");
    let notOnImages = localStorage.getItem("UGF_NOTON_IMAGES");
    let forceLoadMsg = localStorage.getItem("UGF_FORCE_LOAD_MSG");
    let nameEmail = localStorage.getItem("UGF_NAME_EMAIL");
    let neuro = localStorage.getItem("UGF_NEURO");
    let settingsDisplay = localStorage.getItem("UGF_SETTINGS_DISPLAY");
    let gPlusLink = localStorage.getItem("UGF_PLUS_LINK");
    if (url.includes("&tbs=")) {
        tbs = window.location.href.split("&tbs=")[1];
        if (tbs.includes("&")) {
            tbs = tbs.split("&")[0];
        }
    }
    switch (layout) {
        case '2010':
            document.querySelector("html").setAttribute("layout","2010");
            break;
        case '2011':
            document.querySelector("html").setAttribute("layout","2011");
            break;
        case '2012':
            document.querySelector("html").setAttribute("layout","2012");
            document.querySelector("html").setAttribute("legacy-images","");
            document.querySelector("html").setAttribute("legacy-gbar","");
            document.querySelector("html").setAttribute("legacy-footer","");
            break;
        case '2013':
            document.querySelector("html").setAttribute("layout","2013");
            document.querySelector("html").setAttribute("legacy-footer","");
            //document.querySelector("html").setAttribute("fake-spa","");
            break;
        case '2013L':
            document.querySelector("html").setAttribute("layout","2013L");
            document.querySelector("html").setAttribute("legacy-images","");
            document.querySelector("html").setAttribute("legacy-gbar","");
            document.querySelector("html").setAttribute("legacy-footer","");
            document.querySelector("html").setAttribute("legacy-neuro","");
            break;
        case '2014':
            document.querySelector("html").setAttribute("layout","2014");
            //document.querySelector("html").setAttribute("fake-spa","");
            break;
        case '2015':
            document.querySelector("html").setAttribute("layout","2015");
            //document.querySelector("html").setAttribute("fake-spa","");
            break;
        case '2015L':
            document.querySelector("html").setAttribute("layout","2015L");
            document.querySelector("html").setAttribute("legacy-images","");
            document.querySelector("html").setAttribute("legacy-gbar","");
            document.querySelector("html").setAttribute("legacy-footer","");
            document.querySelector("html").setAttribute("legacy-neuro","");
            break;
        case '2016':
            document.querySelector("html").setAttribute("layout","2016");
            //document.querySelector("html").setAttribute("fake-spa","");
            break;
        case "2016C":
            document.querySelector("html").setAttribute("layout","2016C");
            break;
        case '2016L':
            document.querySelector("html").setAttribute("layout","2016L");
            document.querySelector("html").setAttribute("legacy-images","");
            document.querySelector("html").setAttribute("legacy-gbar","");
            document.querySelector("html").setAttribute("legacy-footer","");
            document.querySelector("html").setAttribute("legacy-neuro","");
            break;
        case "2018":
            document.querySelector("html").setAttribute("layout","2018");
            break;
        case "2018M":
            document.querySelector("html").setAttribute("layout","2018M");
            break;
        case "2019":
            document.querySelector("html").setAttribute("layout","2019");
            break;
        default:
            document.querySelector("html").setAttribute("layout","2015");
            localStorage.setItem("UGF_LAYOUT","2015");
    }
    if (structuredHP == null) {
        localStorage.setItem("UGF_STRUCTURED_HOMEPAGE","false");
        structuredHP = "false";
    }
    if (notOnImages == null) {
        localStorage.setItem("UGF_NOTON_IMAGES","true");
        notOnImages = "true";
    }
    if (forceLoadMsg == null) {
        localStorage.setItem("UGF_FORCE_LOAD_MSG","true");
        forceLoadMsg = "true";
    }
    if (nameEmail == null) {
        localStorage.setItem("UGF_NAME_EMAIL","name");
        nameEmail = "name";
    }
    if (settingsDisplay == null) {
        localStorage.setItem("UGF_SETTINGS_DISPLAY","topbar");
        settingsDisplay = "topbar";
    }
    if (gPlusLink == null) {
        localStorage.setItem("UGF_PLUS_LINK","https://plus.google.com/");
        gPlusLink = "https://plus.google.com/";
    }
    if (neuro == null) {
        localStorage.setItem("UGF_NEURO","true");
        neuro = "true";
    }
    switch (notOnImages) {
        case "false":
            break;
        case 'true':
            document.querySelector("html").setAttribute("noton-images","");
            break;
    }
    switch (nameEmail) {
        case "name":
            document.querySelector("html").setAttribute("name-email","name");
            break;
        case 'email':
            document.querySelector("html").setAttribute("name-email","email");
            break;
    }
    switch (settingsDisplay) {
        case "none":
            break;
        case "topbar":
            document.querySelector("html").setAttribute("settings-display","topbar");
            break;
        case 'topbar-hover':
            document.querySelector("html").setAttribute("settings-display","topbar-hover");
            break;
    }
    switch (neuro) {
        case "true":
            document.querySelector("html").setAttribute("neuro","true");
            break;
        case 'false':
            document.querySelector("html").setAttribute("neuro","false");
            break;
    }
    document.querySelector("html").setAttribute("location","all");
    if (
        url.includes("tbm=isch") ||
        url.includes("udm=2")
    ) {
        location = "images";
        document.querySelector("html").setAttribute("location","images");
    }
    if (
        url.includes("tbm=vid")||
        url.includes("udm=7")
    ) {
        location = "videos";
        document.querySelector("html").setAttribute("location","videos");
    }
    if (
        url.includes("tbm=bks") ||
        url.includes("tbm=shop") ||
        url.includes("tbm=nws")
    ) {
        location = "news";
        document.querySelector("html").setAttribute("location","news");
        document.querySelector("html").setAttribute("disabled","");
    }
    if (
        url.includes("https://www.google.com/gplex") ||
        url.includes("https://www.google.com/Gplex")
    ) {
        location = "gplex";
        document.querySelector("html").setAttribute("location","gplex");
    }
    if (structuredHP == "false") {
        if (
            url.includes("www.google.com/webhp") ||
            url == "https://www.google.com/"
        ) {

            location = "home";
            document.querySelector("html").setAttribute("location","home");
        }
    } else {
        if (
            url.includes("www.google.com/webhp") ||
            url.includes("www.google.com/imghp") ||
            url.includes("www.google.com/videohp") ||
            url == "https://www.google.com/"
        ) {

            location = "structured-home";
            document.querySelector("html").setAttribute("location","structured-home");
        }
    }

    if (
        url.includes("&start=10")
    ) {
        page = 2;
    }
    if (
        url.includes("&start=20") ||
        url.includes("&start=11")
       ) {
        page = 3;
    }
    if (
        url.includes("&start=30") ||
        url.includes("&start=21")
       ) {
        page = 4;
    }
    if (
        url.includes("&start=40") ||
        url.includes("&start=31")
    ) {
        page = 5;
    }
    if (
        url.includes("&start=50") ||
        url.includes("&start=41")
    ) {
        page = 6;
    }
    if (
        url.includes("&start=60") ||
        url.includes("&start=51")
    ) {
        page = 7;
    }
    if (
        url.includes("&start=70") ||
        url.includes("&start=61")
    ) {
        page = 8;
    }
    if (
        url.includes("&start=80") ||
        url.includes("&start=71")
    ) {
        page = 9;
    }
    if (
        url.includes("&start=90") ||
        url.includes("&start=81")
    ) {
        page = 10;
    }
    if (
        url.includes("do") &&
        url.includes("a") &&
        url.includes("barrel") &&
        url.includes("roll") &&
        url.includes("x") ||
        url.includes("%20times")
    ) {
        let times;
        if (url.includes("%20times")) {
            times = url.split("times")[0];
            times = times.split("roll%20")[1];
            times = times.split("%20")[0];
        } else {
            times = url.split("x")[1];
        }
        if (times.includes("&")) {
            times = times.split("&")[0];
        }
        if (times.includes("#")) {
            times = times.split("#")[0];
        }
        document.querySelector("body").style.animationDuration = "2s";
        if (times >= 10) {
            document.querySelector("body").style.animationTimingFunction = "linear";
        }
        if (times >= 50) {
            document.querySelector("body").style.animationDuration = "1s";
        }
        if (times >= 500) {
            document.querySelector("body").style.animationDuration = "0.5s";
        }
        document.querySelector("body").style.animationName = "roll";
        document.querySelector("body").style.animationIterationCount = times;
        document.querySelector("body").style.animationTimingFunction = "linear";
        if (
            url.includes("%20reverse") ||
            url.includes("%20backwards")
        ) {
            document.querySelector("body").style.animationDirection = "reverse";
        }
    }
    if (location == "gplex") {
        navbarText = "Gplex Settings";
    }
    var canGo = false;
    function timeout(durationMs) {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve();
            }, durationMs);
        });
    }
    async function waitForElem(elm,time) {
        while (null == document.querySelector(elm)) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(time).then(function() {
            canGo = true;
            return document.querySelector(elm);
        });
    }
    async function waitForElement(elm) {
        while (null == document.querySelector(elm)) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(300).then(function() {
            canGo = true;
            return document.querySelector(elm);
        });
    }
    async function waitForElement500(elm) {
        while (null == document.querySelector(elm)) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(500).then(function() {
            canGo = true;
            return document.querySelector(elm);
        });
    }
    async function waitForElement10(elm) {
        while (null == document.querySelector(elm)) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(10).then(function() {
            canGo = true;
            return document.querySelector(elm);
        });
    }
    async function waitForElement10M(elm, parent) {
        while (null == elm) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(10).then(function() {
            canGo = true;
            return parent.querySelector(elm);
        });
    }
    async function waitForElement1000M(elm, parent) {
        while (null == elm) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(100).then(function() {
            canGo = true;
            return parent.querySelector(elm);
        });
    }
    async function waitForElement100(elm) {
        while (null == document.querySelector(elm)) {
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(10).then(function() {
            canGo = true;
            return document.querySelector(elm);
        });
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    let gPlexHTML = `
     <div id="ugf-program">
            <div id="ugf-layout-fence" class="ugf-fence">
            </div>
            <div id="ugf-noton-fence" class="ugf-fence">
            </div>
            <div id="ugf-forceload-fence" class="ugf-fence">
            </div>
            <div id="ugf-settings-display-fence" class="ugf-fence">
            </div>
            <div id="ugf-name-email-fence" class="ugf-fence">
            </div>
            <div id="ugf-neuro-fence" class="ugf-fence">
            </div>
            <div id="ugf-gplex-settings">
                <div id="ugf-top-container">
                </div>
                <div id="ugf-gplex">
                    <div id="ugf-gplex-inner">
                        <div class="ugf-gplex-section">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-title">
                                    <span>Layout</span>
                                </div>
                                <div class="ugf-gplex-section-content">
                                    <div id="ugf-option-layout" class="ugf-gplex-option flex-bar" value="${layout}">
                                        <a class="ugf-dropdown-button" id="ugf-layout-dd-btn">
                                            <span>${UImessages.l2018}</span>
                                        </a>
                                        <div class="ugf-gplex-text">
                                            <span>You can also change this setting by searching for "Google in [year]".</span>
                                        </div>
                                        <div class="ugf-dropdown" id="ugf-layout-dd">
                                            <div class="ugf-dropdown-inner">
                                                <a id="UGF_SET_LAYOUT_2019" class="ugf-dropdown-item" value="2019">
                                                    <span>${UImessages.l2019}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2018M" class="ugf-dropdown-item" value="2018M">
                                                    <span>${UImessages.l2018M}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2018" class="ugf-dropdown-item" value="2018">
                                                    <span>${UImessages.l2018}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2016L" class="ugf-dropdown-item" value="2016L">
                                                    <span>${UImessages.l2016L}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2016C" class="ugf-dropdown-item" value="2016C">
                                                    <span>${UImessages.l2016C}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2016" class="ugf-dropdown-item" value="2016">
                                                    <span>${UImessages.l2016}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2015L" class="ugf-dropdown-item" value="2015L">
                                                    <span>${UImessages.l2015L}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2015" class="ugf-dropdown-item" value="2015">
                                                    <span>${UImessages.l2015}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2014" class="ugf-dropdown-item" value="2014">
                                                    <span>${UImessages.l2014}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2013L" class="ugf-dropdown-item" value="2013L">
                                                    <span>${UImessages.l2013L}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2013" class="ugf-dropdown-item" value="2013">
                                                    <span>${UImessages.l2013}</span>
                                                </a>
                                                <a id="UGF_SET_LAYOUT_2012" class="ugf-dropdown-item" value="2012">
                                                    <span>${UImessages.l2012}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ugf-gplex-section">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-title">
                                    <span>Custom Image Page</span>
                                </div>
                                <div class="ugf-gplex-section-content">
                                    <div id="ugf-option-noton" class="ugf-gplex-option flex" value="${notOnImages}">
                                        <a class="ugf-dropdown-button" id="ugf-noton-dd-btn">
                                            <span>${UImessages.notonOn}</span>
                                        </a>
                                        <div class="ugf-gplex-text">
                                            <span><b>On:</b> Gplex creates it's own image page, which can have some bugs.</span>
                                            <br>
                                            <span><b>Off:</b> Gplex uses the regular Google image page, which has better functionality, but isn't styled according to the layout.</span>
                                        </div>
                                        <div class="ugf-dropdown" id="ugf-noton-dd">
                                            <div class="ugf-dropdown-inner">
                                                <a id="" class="ugf-dropdown-item" value="false">
                                                    <span>${UImessages.notonOn}</span>
                                                </a>
                                                <a id="" class="ugf-dropdown-item" value="true">
                                                    <span>${UImessages.notonOff}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ugf-gplex-section">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-title">
                                    <span>"Force load results" message</span>
                                </div>
                                <div class="ugf-gplex-section-content">
                                    <div id="ugf-option-forceload" class="ugf-gplex-option flex" value="${forceLoadMsg}">
                                        <a class="ugf-dropdown-button" id="ugf-forceload-dd-btn">
                                            <span>${UImessages.forceLoadMsgOn}</span>
                                        </a>
                                        <div class="ugf-gplex-text">
                                            <span><b>On:</b> When Gplex can't find enough results in the page, it will stall for a few seconds in hopes of finding more results, and show a message with an option to force load the results early. Theoretically more reliable on slow connections.</span>
                                            <br>
                                            <span><b>Off:</b> When Gplex would normally show the message, it will instead force load the results automatically.</span>
                                        </div>
                                        <div class="ugf-dropdown" id="ugf-forceload-dd">
                                            <div class="ugf-dropdown-inner">
                                                <a id="" class="ugf-dropdown-item" value="true">
                                                    <span>${UImessages.forceLoadMsgOn}</span>
                                                </a>
                                                <a id="" class="ugf-dropdown-item" value="false">
                                                    <span>${UImessages.forceLoadMsgOff}</span>
                                                </a>
                                                <a id="" style="display: none" class="ugf-dropdown-item" value="fast">
                                                    <span>${UImessages.forceLoadMsgFast}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ugf-gplex-section">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-title">
                                    <span>Gplex Settings button</span>
                                </div>
                                <div class="ugf-gplex-section-content">
                                    <div id="ugf-option-settings-display" class="ugf-gplex-option flex" value="${settingsDisplay}">
                                        <a class="ugf-dropdown-button" id="ugf-settings-display-dd-btn">
                                            <span>${UImessages.SDtopbar}</span>
                                        </a>
                                        <div class="ugf-gplex-text">
                                            <span>Choose whether or not to display a link to this page on the topbar.</span>
                                        </div>
                                        <div class="ugf-dropdown" id="ugf-settings-display-dd">
                                            <div class="ugf-dropdown-inner">
                                                <a id="" class="ugf-dropdown-item" value="topbar">
                                                    <span>${UImessages.SDtopbar}</span>
                                                </a>
                                                <a id="" class="ugf-dropdown-item" value="topbar-hover">
                                                    <span>${UImessages.SDtopbarHover}</span>
                                                </a>
                                                <a id="" class="ugf-dropdown-item" value="none">
                                                    <span>${UImessages.SDnone}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ugf-gplex-section">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-title">
                                    <span>Display name</span>
                                </div>
                                <div class="ugf-gplex-section-content">
                                    <div id="ugf-option-name-email" class="ugf-gplex-option flex" value="${nameEmail}">
                                        <a class="ugf-dropdown-button" id="ugf-name-email-dd-btn">
                                            <span>${UImessages.NEname}</span>
                                        </a>
                                        <div class="ugf-gplex-text">
                                            <span>Some layouts have a display name (older layouts generally speaking). Your email address was originally displayed, but you can choose to display your username instead. This will not affect account menus.</span>
                                        </div>
                                        <div class="ugf-dropdown" id="ugf-name-email-dd">
                                            <div class="ugf-dropdown-inner">
                                                <a id="" class="ugf-dropdown-item" value="name">
                                                    <span>${UImessages.NEname}</span>
                                                </a>
                                                <a id="" class="ugf-dropdown-item" value="email">
                                                    <span>${UImessages.NEemail}</span>
                                                </a>
                                                <!--a id="" class="ugf-dropdown-item" value="none">
                                                    <span>${UImessages.NEnone}</span>
                                                </a-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ugf-gplex-section">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-title">
                                    <span>Google+ custom link</span>
                                </div>
                                <div class="ugf-gplex-section-content">
                                    <div id="ugf-option-plus-link" class="ugf-gplex-option flex">
                                        <div class="ugf-input">
                                            <input value="${gPlusLink}"></input>
                                            <div class="ugf-input-below">
                                                <span class="ugf-input-error">Invalid URL.</span>
                                                <span class="ugf-input-unsaved">You have unsaved changes. Press enter to save.</span>
                                            </div>
                                        </div>
                                        <div class="ugf-gplex-text">
                                            <span>Custom link for Google+ buttons, such as the +You on the gbar, or the topbar on certain layouts. Defaults to <b>https://plus.google.com/</b>, which redirects to a notice that Google+ has been discontinued.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ugf-gplex-section">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-title">
                                    <span>AI Overviews</span>
                                </div>
                                <div class="ugf-gplex-section-content">
                                    <div id="ugf-option-neuro" class="ugf-gplex-option flex" value="${neuro}">
                                        <a class="ugf-dropdown-button" id="ugf-neuro-dd-btn">
                                            <span>${UImessages.NRtrue}</span>
                                        </a>
                                        <div class="ugf-gplex-text">
                                            <span>Choose whether or not to show AI overviews in search results.</span>
                                        </div>
                                        <div class="ugf-dropdown" id="ugf-neuro-dd">
                                            <div class="ugf-dropdown-inner">
                                                <a id="" class="ugf-dropdown-item" value="true">
                                                    <span>${UImessages.NRtrue}</span>
                                                </a>
                                                <a id="" class="ugf-dropdown-item" value="false">
                                                    <span>${UImessages.NRfalse}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ugf-gplex-section" style="display: none">
                            <div class="ugf-gplex-section-inner">
                                <div class="ugf-gplex-section-content">
                                    <div class="ugf-fake-save-button" title="Settings are automatically saved. There is no need to manually save.">
                                        <span>Save Settings</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    let normalHTML = `				<div id="ugf-program">
                    <div id="ugf-top-container">
                    </div>
					<div id="ugf-page-multistate" state="all">
						<div id="ugf-content">
							<div id="ugf-left">
								<div id="ugf-left-inner">
                                    <div id="ugf-sidebar">
                                        <div id="ugf-sidebar-nav" class="ugf-sidebar-section">
                                            <a class="ugf-sidebar-tab active" id="ugf-all-item">
									        	<div class="ugf-tab-inner">
                                                    <div class="ugf-tab-icon">
                                                    </div>
									         		<span id="ugf-everything-text">Everything</span>
                                                    <span id="ugf-web-text">Web</span>
								        		</div>
								         	</a>
							           		<a class="ugf-sidebar-tab" id="ugf-images-item">
							          			<div class="ugf-tab-inner">
                                                    <div class="ugf-tab-icon">
                                                    </div>
							    	    			<span>Images</span>
							    	    		</div>
							          		</a>
							        		<a class="ugf-sidebar-tab" id="ugf-videos-item">
							         			<div class="ugf-tab-inner">
                                                    <div class="ugf-tab-icon">
                                                    </div>
								         			<span>Videos</span>
								        		</div>
								        	</a>
							        		<a class="ugf-sidebar-tab" id="ugf-news-item">
								        		<div class="ugf-tab-inner">
                                                    <div class="ugf-tab-icon">
                                                    </div>
								        			<span>News</span>
								         		</div>
								        	</a>
                                            <a class="ugf-sidebar-tab" id="ugf-maps-item">
							    	    		<div class="ugf-tab-inner">
                                                    <div class="ugf-tab-icon">
                                                    </div>
							    	    			<span>Maps</span>
							    	    		</div>
							    	    	</a>
                                            <a class="ugf-sidebar-tab" id="ugf-settings-item" href="https://www.google.com/preferences">
							        			<div class="ugf-tab-inner">
                                                    <div class="ugf-tab-icon">
                                                    </div>
							         				<span>Settings</span>
							        			</div>
							        		</a>
							        	</div>
                                        <div id="ugf-sidebar-range-tools" class="ugf-sidebar-section ugf-sidebar-tools">
                                            <div id="ugf-any-time-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME">
                                                    <span>Any time</span>
                                                </a>
                                            </div>
                                            <div id="ugf-hour-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME&tbs=qdr:h">
                                                    <span>Past hour</span>
                                                </a>
                                            </div>
                                            <div id="ugf-day-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME&tbs=qdr:d">
                                                    <span>Past day</span>
                                                </a>
                                            </div>
                                            <div id="ugf-week-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME&tbs=qdr:w">
                                                    <span>Past week</span>
                                                </a>
                                            </div>
                                            <div id="ugf-month-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME&tbs=qdr:m">
                                                    <span>Past month</span>
                                                </a>
                                            </div>
                                            <div id="ugf-year-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME&tbs=qdr:y">
                                                    <span>Past year</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div id="ugf-sidebar-specifity-tools" class="ugf-sidebar-section ugf-sidebar-tools">
                                            <div id="ugf-all-results-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME">
                                                    <span>All results</span>
                                                </a>
                                            </div>
                                            <div id="ugf-verbatim-tool" class="ugf-sidebar-tool">
                                                <a class="ugf-sidebar-tool-inner" href="https://www.google.com/search?q=TEMP_REPLACEME&tbs=li:1">
                                                    <span>Verbatim</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
								</div>
							</div>
							<div id="ugf-main">
								<div id="ugf-main-inner">
                                   <div id="ugf-search-results" state-id="all">
										<div id="ugf-search-results-header" class="flex-bar">
											<span>
                                                <span title="You have an experiment that gets rid of Google result counts. This is just here for decoration.">About 1,000,000 results (0.5 seconds)</span>
                                            </span>
										</div>
                                        <div id="ugf-search-results-neuro-playground">
                                            <div class="ugf-neuro-playground">
                                                <div class="ugf-neuro-title flex-bar">
                                                    <svg class="fWWlmf JzISke" height="24" width="24" aria-hidden="true" viewBox="0 0 471 471" xmlns="http://www.w3.org/2000/svg"><path fill="var(--m3c23)" d="M235.5 471C235.5 438.423 229.22 407.807 216.66 379.155C204.492 350.503 187.811 325.579 166.616 304.384C145.421 283.189 120.498 266.508 91.845 254.34C63.1925 241.78 32.5775 235.5 0 235.5C32.5775 235.5 63.1925 229.416 91.845 217.249C120.498 204.689 145.421 187.811 166.616 166.616C187.811 145.421 204.492 120.497 216.66 91.845C229.22 63.1925 235.5 32.5775 235.5 0C235.5 32.5775 241.584 63.1925 253.751 91.845C266.311 120.497 283.189 145.421 304.384 166.616C325.579 187.811 350.503 204.689 379.155 217.249C407.807 229.416 438.423 235.5 471 235.5C438.423 235.5 407.807 241.78 379.155 254.34C350.503 266.508 325.579 283.189 304.384 304.384C283.189 325.579 266.311 350.503 253.751 379.155C241.584 407.807 235.5 438.423 235.5 471Z"></path></svg>
                                                    <span>AI Overview</span>
                                                </div>
                                                <div class="ugf-generating-text flex-bar">
                                                    <svg class="fWWlmf JzISke" height="24" width="24" aria-hidden="true" viewBox="0 0 471 471" xmlns="http://www.w3.org/2000/svg"><path fill="var(--m3c23)" d="M235.5 471C235.5 438.423 229.22 407.807 216.66 379.155C204.492 350.503 187.811 325.579 166.616 304.384C145.421 283.189 120.498 266.508 91.845 254.34C63.1925 241.78 32.5775 235.5 0 235.5C32.5775 235.5 63.1925 229.416 91.845 217.249C120.498 204.689 145.421 187.811 166.616 166.616C187.811 145.421 204.492 120.497 216.66 91.845C229.22 63.1925 235.5 32.5775 235.5 0C235.5 32.5775 241.584 63.1925 253.751 91.845C266.311 120.497 283.189 145.421 304.384 166.616C325.579 187.811 350.503 204.689 379.155 217.249C407.807 229.416 438.423 235.5 471 235.5C438.423 235.5 407.807 241.78 379.155 254.34C350.503 266.508 325.579 283.189 304.384 304.384C283.189 325.579 266.311 350.503 253.751 379.155C241.584 407.807 235.5 438.423 235.5 471Z"></path></svg>
                                                    <span>Generating...</span>
                                                </div>
                                                <div class="ugf-neuro-content">
                                                    <div class="ugf-neuro-content-inner">
                                                    </div>
                                                </div>
                                                <div class="ugf-neuro-expander">
                                                <div class="ugf-neuro-show-more">
                                                    <span>Show more</span>
                                                </div>
                                                <div class="ugf-neuro-show-less">
                                                    <span>Show less</span>
                                                </div>
                                                </div>
                                            </div>
                                            <a class="ugf-neuro-dismiss">
                                                <span>Dismiss</span>
                                            </a>
										</div>
                                        <div id="ugf-search-results-reserved-fake-iframe">
										</div>
                                        <div id="ugf-search-results-reserved-top">
										</div>
										<div id="ugf-search-results-container">
										</div>
									</div>
									<div id="ugf-image-results" state-id="images">
										<div id="ugf-image-results-container">
										</div>
                                        <div id="ugf-image-viewer">
                                        </div>
                                        <div id="ugf-image-iframe">
                                            <iframe></iframe>
                                        </div>
									</div>
                                    <div id="ugf-footer">
                                    		<style>
        #gp-pagination {
          margin: 0 auto;
          position: relative;
          width: fit-content;
        }
        html:not([layout="2015L"]):not([layout="2016L"]) #gp-pagination {
          margin-top: 15px;
        }
        #gp-pagination-inner,
        #gp-page-numbers {
          display: flex;
        }
        .gp-pagination {
          cursor: pointer;
          font-size: 13px;
          text-decoration: none;
          text-align: center;
          color: #4285f4;
        }
        [layout="2014"] .gp-pagination,
        [layout="2015"] .gp-pagination,
        [layout="2015L"] .gp-pagination,
        [layout="2016L"] .gp-pagination {
          color: #1a0dab;
        }
        [layout="2010"] .gp-pagination,
        [layout="2011"] .gp-pagination,
        [layout="2012"] .gp-pagination,
        [layout="2013L"] .gp-pagination {
          color: #12c;
        }
        .gp-pagination:not(.active):hover span {
          text-decoration: underline;
        }
        [layout="2013L"] .gp-pagination-np,
        [layout="2015L"] .gp-pagination-np,
        [layout="2016L"] .gp-pagination-np {
          text-decoration: underline;
        }
        .gp-pagination.active {
          color: rgba(0,0,0,0.87);
          cursor: default;
        }
        .gp-pagination .gp-image {
          background: url(https://www.google.com/images/nav_logo242.png);
          width: 20px;
          height: 40px;
          background-position: -74px 0;
        }
        [layout="2014"] .gp-pagination .gp-image,
        [layout="2015"] .gp-pagination .gp-image,
        [layout="2015L"] .gp-pagination .gp-image {
          background: no-repeat url("https://www.google.com/images/nav_logo225.png");
          width: 20px;
          height: 40px;
          background-position: -74px 0;
        }
        [layout="2010"] .gp-pagination .gp-image,
        [layout="2011"] .gp-pagination .gp-image,
        [layout="2012"] .gp-pagination .gp-image,
        [layout="2013"] .gp-pagination .gp-image,
        [layout="2013L"] .gp-pagination .gp-image {
          background: no-repeat url("https://www.google.com/images/nav_logo124.png");
          width: 20px;
          height: 40px;
          background-position: -74px 0;
        }
        .gp-pagination.active .gp-image {
          background-position: -53px 0;
        }
        #gp-pagination-prev .gp-image {
          width: 28px;
          height: 40px;
          background-position: -24px 0;
        }
        #gp-pagination-prev.has-prev .gp-image {
          width: 53px;
          background-position: 0 0;
        }
        #gp-pagination-prev:not(.has-prev) {
          cursor: default;
          pointer-events: none;
        }
        #gp-pagination-prev:not(.has-prev) span {
          display: none;
        }
        #gp-pagination-next .gp-image {
          width: 71px;
          background-position: -96px 0;
        }
        #gp-pagination-prev span {
          display: block;
          position: absolute;
          left: -8px;
        }
        #gp-pagination-next span {
          display: block;
          margin-left: 53px;
        }
        [layout="2012"] .gp-pagination-np span,
        [layout="2013"] .gp-pagination-np span,
        [layout="2013L"] .gp-pagination-np span,
        [layout="2014"] .gp-pagination-np span,
        [layout="2015"] .gp-pagination-np span,
        [layout="2015L"] .gp-pagination-np span,
        [layout="2016L"] .gp-pagination-np span {
          font-weight: bold;
        }
		</style>
        <div id="gp-pagination">
        <div id="gp-pagination-inner">
           <a id="gp-pagination-prev" class="gp-pagination gp-pagination-np" href="https://www.google.com/search?q=TEMP_REPLACEME">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>Prev</span>
                </div>
            </a>
            <div id="gp-page-numbers">
	        <a id="gp-pagination-1" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>1</span>
                </div>
            </a>
            <a id="gp-pagination-2" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=10">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>2</span>
                </div>
            </a>
            <a id="gp-pagination-3" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=20">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>3</span>
                </div>
            </a>
            <a id="gp-pagination-4" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=30">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>4</span>
                </div>
            </a>
            <a id="gp-pagination-5" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=40">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>5</span>
                </div>
            </a>
            <a id="gp-pagination-6" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=50">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>6</span>
                </div>
            </a>
            <a id="gp-pagination-7" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=60">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>7</span>
                </div>
            </a>
            <a id="gp-pagination-8" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=70">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>8</span>
                </div>
            </a>
            <a id="gp-pagination-9" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=80">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>9</span>
                </div>
            </a>
            <a id="gp-pagination-10" class="gp-pagination" href="https://www.google.com/search?q=TEMP_REPLACEME&start=90">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>10</span>
                </div>
            </a>
            </div>
            <a id="gp-pagination-next" class="gp-pagination gp-pagination-np" href="https://www.google.com/search?q=TEMP_REPLACEME&start=10">
                <div class="gp-pagination-inner">
                    <div class="gp-image"></div>
                    <span>Next</span>
                </div>
            </a>
        </div>
        </div>
        <div id="ugf-footer-links">
            <div id="ugf-footer-links-upper" class="flex-bar ugf-footer-links">
                <a class="ugf-footer-link" href="https://www.google.com/advanced_search">Advanced search</a>
                <a class="ugf-footer-link" href="https://support.google.com/websearch/answer/134479">Search Help</a>
                <a class="ugf-footer-link" href="https://www.google.com/tools/feedback/survey/html?productId=196">Send feedback</a>
            </div>
            <div id="ugf-footer-links-middle" class="flex-bar ugf-footer-links">
                <a class="ugf-footer-link" href="https://www.google.com/">Google Home</a>
                <a class="ugf-footer-link" href="https://www.google.com/intl/en/ads">Advertising Programs</a>
                <a class="ugf-footer-link" href="https://www.google.com/services">Business Solutions</a>
                <a class="ugf-footer-link" href="https://www.google.com/intl/en/policies/">Privacy & Terms</a>
            </div>
            <div id="ugf-footer-links-lower" class="flex-bar ugf-footer-links">
                <a class="ugf-footer-link" href="https://www.google.com/intl/en/about.html">About Google</a>
            </div>
        </div>
                                    </div>
								</div>
							</div>
							<div id="ugf-right">
								<div id="ugf-right-inner">
                                    <div id="ugf-right-neuro-playground">
                                        <div class="ugf-neuro-playground">
                                            <div class="ugf-neuro-title flex-bar">
                                                <svg class="fWWlmf JzISke" height="24" width="24" aria-hidden="true" viewBox="0 0 471 471" xmlns="http://www.w3.org/2000/svg"><path fill="var(--m3c23)" d="M235.5 471C235.5 438.423 229.22 407.807 216.66 379.155C204.492 350.503 187.811 325.579 166.616 304.384C145.421 283.189 120.498 266.508 91.845 254.34C63.1925 241.78 32.5775 235.5 0 235.5C32.5775 235.5 63.1925 229.416 91.845 217.249C120.498 204.689 145.421 187.811 166.616 166.616C187.811 145.421 204.492 120.497 216.66 91.845C229.22 63.1925 235.5 32.5775 235.5 0C235.5 32.5775 241.584 63.1925 253.751 91.845C266.311 120.497 283.189 145.421 304.384 166.616C325.579 187.811 350.503 204.689 379.155 217.249C407.807 229.416 438.423 235.5 471 235.5C438.423 235.5 407.807 241.78 379.155 254.34C350.503 266.508 325.579 283.189 304.384 304.384C283.189 325.579 266.311 350.503 253.751 379.155C241.584 407.807 235.5 438.423 235.5 471Z"></path></svg>
                                                <span>AI Overview</span>
                                            </div>
                                            <div class="ugf-generating-text flex-bar">
                                                <svg class="fWWlmf JzISke" height="24" width="24" aria-hidden="true" viewBox="0 0 471 471" xmlns="http://www.w3.org/2000/svg"><path fill="var(--m3c23)" d="M235.5 471C235.5 438.423 229.22 407.807 216.66 379.155C204.492 350.503 187.811 325.579 166.616 304.384C145.421 283.189 120.498 266.508 91.845 254.34C63.1925 241.78 32.5775 235.5 0 235.5C32.5775 235.5 63.1925 229.416 91.845 217.249C120.498 204.689 145.421 187.811 166.616 166.616C187.811 145.421 204.492 120.497 216.66 91.845C229.22 63.1925 235.5 32.5775 235.5 0C235.5 32.5775 241.584 63.1925 253.751 91.845C266.311 120.497 283.189 145.421 304.384 166.616C325.579 187.811 350.503 204.689 379.155 217.249C407.807 229.416 438.423 235.5 471 235.5C438.423 235.5 407.807 241.78 379.155 254.34C350.503 266.508 325.579 283.189 304.384 304.384C283.189 325.579 266.311 350.503 253.751 379.155C241.584 407.807 235.5 438.423 235.5 471Z"></path></svg>
                                                <span>Generating...</span>
                                            </div>
                                            <div class="ugf-neuro-content">
                                                <div class="ugf-neuro-content-inner">
                                                </div>
                                            </div>
                                            <div class="ugf-neuro-expander">
                                                <div class="ugf-neuro-show-more">
                                                    <span>Show more</span>
                                                </div>
                                                <div class="ugf-neuro-show-less">
                                                    <span>Show less</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a class="ugf-neuro-dismiss">
                                            <span>Dismiss</span>
                                        </a>
                                    </div>
								</div>
							</div>
						</div>
					</div>
				</div>
				`;
    let homepageHTML = `
    <div id="ugf-program">
            <div id="ugf-homepage">
                <div id="ugf-top-container">
                    </div>
                <div id="ugf-hp">
                    <div id="ugf-hp-inner">
                        <div id="ugf-hp-logo">
                            <div id="ugf-hp-logo-inner">
                                <img id="melvin-hp-logo" src="data:image/png;base64,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"></img>
                                <img id="chopper-old-logo" src="https://www.google.com/images/srpr/logo11w.png"></img>
                                <img id="modern-logo" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"></img>
                            </div>
                            <div id="ugf-hp-logo-companion">
                            </div>
                        </div>
                        <div id="ugf-hp-search" class="flex">
                            <div id="ugf-search-outer">
							    <div id="ugf-search">
								    <div id="ugf-searchbar">
							    		<input id="ugf-search-value" autocomplete="off" autofocus></input>
							    	</div>
							    	<a id="ugf-search-btn">
							    		<div id="ugf-search-btn-inner">
							    			<span></span>
                                        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
						    		</div>
							    	</a>
                                    <div id="ugf-search-predictions-container">
                                    </div>
							    </div>
                            </div>
                            <div id="ugf-hp-search-links">
                                <a class="ugf-hp-search-link" href="https://www.google.com/advanced_search">
                                    <span>Advanced search</span>
                                </a>
                                <a class="ugf-hp-search-link" href="https://www.google.com/language-tools">
                                    <span>Language tools</span>
                                </a>
                            </div>
                        </div>
                        <div id="ugf-hp-buttons-row">
                            <div id="ugf-hp-buttons" class="flex-bar">
                                <a id="ugf-search-btn-2">
                                    <span>Google Search</span>
                                </a>
                                <a id="ugf-lucky-btn">
                                    <span>I'm Feeling Lucky</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="ugf-hp-footer" class="flex">
                    <div id="ugf-structured-hp-footer-left" class="flex-bar">
                        <a class="ugf-structured-hp-footer-link" href="https://www.google.com/intl/en/ads/">Advertising</a>
                        <a class="ugf-structured-hp-footer-link" href="https://www.google.com/services/">Business</a>
                        <a class="ugf-structured-hp-footer-link" href="https://www.about.google/">About</a>
                    </div>
                    <div id="ugf-structured-hp-footer-right" class="flex-bar">
                        <a class="ugf-structured-hp-footer-link" href="https://www.google.com/intl/en/policies/privacy/">Privacy</a>
                        <a class="ugf-structured-hp-footer-link" href="https://www.google.com/intl/en/policies/terms/">Terms</a>
                        <a class="ugf-structured-hp-footer-link" href="https://www.google.com/preferences">Settings</a>
                    </div>
                </div>
            </div>
        </div>
        `;
    let topHTML = `
            <div id="ugf-ultratop">
        <div id="gp-gbar" class="ugf-gbar">
        <!-- GPGBAR Version 3.0 -->
                <style>
#gp-gbar:not(.ugf-gbar) {
  display: none;
}
[location="ads"] #gp-gbar,
[location="image-viewer"] #gp-gbar,
[layout="google-2015"] #gp-gbar,
[layout="google-2016"] #gp-gbar,
[layout="google-2017"] #gp-gbar,
[layout="google-2018"] #gp-gbar,
[layout="google-2019"] #gp-gbar {
  display: none;
}
#gp-gbar {
  position: relative;
  z-index: 999;
  font-family: arial !important;
}
html:not([gbar-dd-open]) #gp-gbar {
  z-index: unset;
}
#gp-gbar-inner {
  display: flex;
  align-items: center;
  height: 29px;
  background: #2d2d2d;
}
.gp-gbar-link {
  text-decoration: none !important;
  color: #bbb !important;
  font-weight: bold;
  font-size: 13px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.gp-gbar-link-inner {
  padding: 0 9px;
  height: 100%;
  display: flex;
  align-items: center;
}
.gp-gbar-link:hover,
.gp-gbar-link.active {
  color: #fff !important;
}
html:not([gbar-dd-open]) #gp-gbar-dd-fence,
html:not([gbar-dd-open]) #gp-gbar-dd {
  display: none;
}
#gp-gbar-dd-fence {
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  position: fixed;
}
[options-dd-open] #gp-gbar {
  pointer-events: none;
  opacity: 0.33;
}
#gp-gbar-more {
  position: relative;
}
#gp-gbar-more .arrow {
  content: "";
  position: relative;
  top: 2px;
  border-style: solid dashed dashed;
  border-color: transparent;;
  display: inline-block;
  font-size: 0;
  height: 0;
  line-height: 0;
  width: 0;
  border-width: 3px 3px 0;
  padding-top: 3px;
  left: 4px;
  border-top-color: #aaa;
}
#gp-gbar-more:hover .arrow {
  border-top-color: #fff;
}
[gbar-dd-open] #gp-gbar-more .gp-gbar-link-inner {
  background: #fff;
  border: 1px solid #bebebe;
  color: #000;
  position: relative;
  z-index: 111029;
  border-bottom: none;
}
[gbar-dd-open] #gp-gbar-more .arrow {
  border-top-color: #000;
}
#gp-gbar-dd {
  left: 580px;
  top: 27px;
  left: 0;
  position: absolute;
  background: #fff;
  border: 1px solid #bebebe;
  box-shadow: 0 2px 4px rgba(0,0,0,.2);
  z-index: 300;
  white-space: nowrap;
  cursor: default;
}
[not-gecko] #gp-gbar-dd {
  left: 571px;
}
.gbar-dd-section {
  padding: 10px 0;
}
.gbar-dd-section-link {
  padding: 5px 20px;
  line-height: 17px;
  display: block;
  color: #000 !important;
  font-weight: bold;
  text-decoration: none !important;
  cursor: pointer;
}
.gbar-dd-section-link:hover {
  background: #eee;
}
.gbar-dd-section:last-of-type {
  border-top: 1px solid #bebebe;
}
#gp-gbar-right {
  margin-left: auto;
  margin-right: 4px;
}
#gp-gbar-account,
#gp-gbar-sign-in {
  font-weight: bold;
}
[name-email="name"] #gp-gbar-email,
[name-email="email"] #gp-gbar-account,
html[logged-in="false"] #gp-gbar-account,
html[logged-in="true"] #gp-gbar-sign-in {
  display: none;
}
#gp-gbar-settings-button {
  margin-right: 4px;
  padding: 0 5px;
}
html:not([layout="2010"]):not([layout="2011"]):not([layout="2012"]):not([layout="2013"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]) #gp-gbar,
html:not([layout="2010"]):not([layout="2011"]):not([layout="2012"]):not([layout="2013L"]):not([layout="2015L"]):not([layout="2016L"]) #gp-gbar-right {
  display: none;
}
#gp-gbar-settings-icon {
  background: url(https://ssl.gstatic.com/gb/images/b_8d5afc09.png);
  background-position: 0 0;
  display: block;
  font-size: 0;
  height: 17px;
  width: 16px;
}
[layout="2010"] #gp-gbar-inner,
[layout="2011"] #gp-gbar-inner,
[layout="2012"] #gp-gbar-inner,
[layout="2013L"] #gp-gbar-inner,
[layout="2015L"] #gp-gbar-inner,
[layout="2016L"] #gp-gbar-inner {
  background: #2d2d2d;
  padding-left: 4px;
}
[layout="2010"] .gp-gbar-link,
[layout="2011"] .gp-gbar-link,
[layout="2012"] .gp-gbar-link,
[layout="2013L"] .gp-gbar-link,
[layout="2015L"] .gp-gbar-link,
[layout="2016L"] .gp-gbar-link {
  border-top: 2px solid transparent !important;
  font-weight: normal;
  padding-bottom: 1px;
  height: 26px;
}
[layout="2010"] .gp-gbar-link-inner,
[layout="2011"] .gp-gbar-link-inner,
[layout="2012"] .gp-gbar-link-inner,
[layout="2013L"] .gp-gbar-link-inner,
[layout="2015L"] .gp-gbar-link-inner,
[layout="2016L"] .gp-gbar-link-inner {
  padding: 0 5px;
}
[layout="2010"] .gp-gbar-link:not(.active):hover,
[layout="2011"] .gp-gbar-link:not(.active):hover,
[layout="2012"] .gp-gbar-link:not(.active):hover,
[layout="2013L"] .gp-gbar-link:not(.active):hover,
[layout="2015L"] .gp-gbar-link:not(.active):hover,
[layout="2016L"] .gp-gbar-link:not(.active):hover {
  background: #4c4c4c;
}
[layout="2010"] .gp-gbar-link.active,
[layout="2011"] .gp-gbar-link.active,
[layout="2012"] .gp-gbar-link.active,
[layout="2013L"] .gp-gbar-link.active,
[layout="2015L"] .gp-gbar-link.active,
[layout="2016L"] .gp-gbar-link.active {
  border-top: 2px solid #dd4b39 !important;
  font-weight: bold;
}
[layout="2010"] #gp-gbar-plusyou,
[layout="2011"] #gp-gbar-plusyou,
[layout="2012"] #gp-gbar-plusyou,
[layout="2013L"] #gp-gbar-plusyou,
[layout="2015L"] #gp-gbar-plusyou,
[layout="2016L"] #gp-gbar-plusyou {
  display: none;
}
        </style>
        <div id="gp-gbar-inner">
            <a id="gp-gbar-plusyou" class="gp-gbar-link" href="${gPlusLink}">
                <div class="gp-gbar-link-inner">
                    <span>+You</span>
                </div>
            </a>
            <a id="gp-gbar-search" class="gp-gbar-link active" href="https://www.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Search</span>
                </div>
            </a>
            <a id="gp-gbar-images" class="gp-gbar-link" href="https://images.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Images</span>
                </div>
            </a>
            <a id="gp-gbar-maps" class="gp-gbar-link" href="https://maps.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Maps</span>
                </div>
            </a>
            <a id="gp-gbar-play" class="gp-gbar-link" href="https://play.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Play</span>
                </div>
            </a>
            <a id="gp-gbar-youtube" class="gp-gbar-link" href="https://www.youtube.com">
                <div class="gp-gbar-link-inner">
                    <span>YouTube</span>
                </div>
            </a>
            <a id="gp-gbar-news" class="gp-gbar-link" href="https://news.google.com">
                <div class="gp-gbar-link-inner">
                    <span>News</span>
                </div>
            </a>
            <a id="gp-gbar-gmail" class="gp-gbar-link" href="https://mail.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Gmail</span>
                </div>
            </a>
            <a id="gp-gbar-drive" class="gp-gbar-link" href="https://drive.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Drive</span>
                </div>
            </a>
            <a id="gp-gbar-calendar" class="gp-gbar-link" href="https://calendar.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Calendar</span>
                </div>
            </a>
            <div id="gp-gbar-more" class="gp-gbar-link" onclick='document.querySelector("html").setAttribute("gbar-dd-open","");'>
                <div class="gp-gbar-link-inner">
                    <span>More</span>
                    <span class="arrow"></span>
                </div>
                    <div id="gp-gbar-dd">
                        <div id="gp-gbar-dd-inner">
                            <div class="gbar-dd-section">
                                <a class="gbar-dd-section-link" href="https://translate.google.com">
                                    <span>Translate</span>
                                </a>
                            </div>
                            <div class="gbar-dd-section">
                                <a class="gbar-dd-section-link" href="https://www.google.com/intl/en/options">
                                    <span>Even More</span>
                                </a>
                            </div>
                        </div>
                    </div>
            </div>
            <div id="gp-gbar-right" class="flex-bar">
            <a id="gp-gbar-sign-in" class="gp-gbar-link ugf-logged-in-out" href="https://accounts.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Sign in</span>
                </div>
            </a>
            <a id="gp-gbar-account" class="gp-gbar-link ugf-logged-in-out" href="https://accounts.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Account</span>
                </div>
            </a>
            <a id="gp-gbar-email" class="gp-gbar-link ugf-logged-in-out" href="https://accounts.google.com">
                <div class="gp-gbar-link-inner">
                    <span>Email</span>
                </div>
            </a>
            <a id="gp-gbar-settings-button" class="gp-gbar-link" href="https://www.google.com/preferences" title="options">
                <div id="gp-gbar-settings-icon">
                </div>
            </a>
            </div>
        </div>
        <div id="gp-gbar-dd-fence" onclick='document.querySelector("html").removeAttribute("gbar-dd-open");'>
        </div>
        </div>
        </div>
        					<div id="ugf-top">
						<div id="ugf-topbar">
							<div id="ugf-topbar-inner">
								<div id="ugf-logo-cont">
									<a id="ugf-logo" href="https://www.google.com">
                                        <img id="retro-logo" src="https://static.wikia.nocookie.net/logopedia/images/a/a0/Google_1997.svg/revision/latest?cb=20240216165247" height="30"></img>
                                        <img id="jfk-logo" src="https://www.google.com/images/nav_logo82.png"></img>
                                        <img id="melvin-logo" src="https://www.google.com/images/nav_logo124.png"></img>
                                        <img id="chopper-old-logo" src="https://www.google.com/images/nav_logo225.png"></img>
							 			<img id="chopper-logo" src="https://www.google.com/images/nav_logo242.png"></img>
                                        <img id="shira-logo" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png" width="120" height="44"></img>
                                        <img id="mazira-logo" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" width="92" height="30"></img>
									</a>
								</div>
                                <div id="ugf-search-outer">
								    <div id="ugf-search">
									    <div id="ugf-searchbar">
								    		<input id="ugf-search-value" autocomplete="off"></input>
								    	</div>
								    	<a id="ugf-search-btn">
								    		<div id="ugf-search-btn-inner">
								    			<span></span>
                                                <svg style="display: none" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
								    		</div>
								     	</a>
                                        <div id="ugf-search-predictions-container">
                                        </div>
								    </div>
                                </div>
								<div id="ugf-top-right" class="flex-bar">
                                <div id="beyond-the-fence-2" onclick="document.querySelector('html').removeAttribute('options-dd-open');">
										</div>
                                        <div id="beyond-the-fence-3">
										</div>
                                    <div id="ugf-gplex-settings-btn">
                                        <a class="ugf-homepage-link" href="https://www.google.com/gplex">
                                            <span>Gplex Settings</span>
                                        </a>
                                    </div>
                                    <div class="ugf-plus-buttons flex-bar ugf-logged-in-out ugf-hide-on-legacy">
                                        <a id="ugf-email-button" href="${gPlusLink}">
                                            <div class="ugf-plus-button-text">
                                                <span>Account</span>
                                            </div>
                                        </a>
                                        <a id="ugf-username-button" href="${gPlusLink}">
                                            <div class="ugf-plus-button-text">
                                                <span>Account</span>
                                            </div>
                                        </a>
                                    </div>
                                    <div id="ugf-homepage-links" class="flex-bar ugf-hide-on-legacy">
                                        <a class="ugf-homepage-link" href="https://mail.google.com">
                                            <span>Gmail</span>
                                        </a>
                                        <a class="ugf-homepage-link" href="https://www.google.com/imghp">
                                            <span>Images</span>
                                        </a>
                                    </div>
									<div id="ugf-apps" class="ugf-hide-on-legacy">
                                        <div id="waffle">
                                            <div class="gp-icon"></div>
                                        </div>
                                    <div id="beyond-the-fence" onclick="document.querySelector('html').removeAttribute('apps-dd-open');">
									</div>
										<div id="gp-apps-dd">
											<div id="triangle"></div>
											<div id="triangle-2"></div>
											<div id="gp-apps-dd-card">
												<div id="gp-apps-dd-inner">
												   <div class="sector">
													  <div class="gp-app" id="myaccount">
															<a class="gp-app-inner" href="https://www.myaccount.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  My Account
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="google-search">
															<a class="gp-app-inner" href="https://www.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Search
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="maps">
															<a class="gp-app-inner" href="https://maps.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Maps
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="youtube">
															<a class="gp-app-inner" href="https://youtube.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  YouTube
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="play">
															<a class="gp-app-inner" href="https://translate.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Play
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="news">
															<a class="gp-app-inner" href="https://news.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  News
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="envelope">
															<a class="gp-app-inner" href="https://mail.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Gmail
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="drive">
															<a class="gp-app-inner" href="https://drive.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Drive
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="calendar">
															<a class="gp-app-inner" href="https://google.com/calendar">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Calendar
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="plus">
															<a class="gp-app-inner" href="https://plus.google.com/">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Google+
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="translate">
															<a class="gp-app-inner" href="https://translate.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Translate
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="photos">
															<a class="gp-app-inner" href="https://photos.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Photos
																  </div>
															</a>
													  </div>
												   </div>
												   <div class="sector">
													  <div class="gp-app" id="shopping">
															<a class="gp-app-inner" href="https://www.google.com/shopping">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Shopping
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="wallet">
															<a class="gp-app-inner" href="https://wallet.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Wallet
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="finance">
															<a class="gp-app-inner" href="https://www.google.com/finance">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Finance
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="docs">
															<a class="gp-app-inner" href="https://docs.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Docs
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="books">
															<a class="gp-app-inner" href="https://books.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Books
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="blogger">
															<a class="gp-app-inner" href="https://www.blogger.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Blogger
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="contacts">
															<a class="gp-app-inner" href="https://www.google.com/contacts">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Contacts
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="hangouts">
															<a class="gp-app-inner" href="https://hangouts.google.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Hangouts
																  </div>
															</a>
													  </div>
													  <div class="gp-app" id="firefox">
															<a class="gp-app-inner" href="https://firefox.com">
																  <div class="gp-app-icon">
																  </div>
																  <div class="gp-app-title">
																  Firefox
																  </div>
															</a>
													  </div>
												   </div>
												   <div class="sector">
														 <a id="even-more" href="https://www.google.com/intl/en/options">Even more from Google</a>
												   </div>
												</div>
											</div>
										</div>
									</div>
                                    <div class="ugf-plus-buttons flex-bar ugf-logged-in-out ugf-hide-on-legacy">
                                        <div id="ugf-fake-notifs-button" class="ugf-plus-button flex-bar" title="All caught up!">
                                            <div class="ugf-plus-button-text">
                                                <span>0</span>
                                            </div>
                                            <div class="ugf-plus-button-icon">
                                            </div>
                                        </div>
                                        <div id="ugf-notifs-dd" class="ugf-hide-on-legacy">
									        <div id="triangle-5"></div>
										    <div id="ugf-notifs-dd-card">
                                                <div id="ugf-notifs-dd-inner">
                                                    <div id="ugf-notifs-dd-banner">
                                                        <div id="ugf-notifs-dd-loading">
                                                            <span>Loading...</span>
                                                        </div>
                                                        <div id="ugf-notifs-dd-cant">
                                                            <span>Cannot connect to Google+.</span>
                                                        </div>
                                                    </div>
                                                    <div id="ugf-notifs-dd-top" class="flex-bar">
                                                        <div id="ugf-notifs-dd-top-left">
                                                            <a href="${gPlusLink}">Google+ notifications</a>
                                                        </div>
                                                        <div id="ugf-notifs-dd-top-right">
                                                            <div id="ugf-notifs-dd-read-button">
                                                                <div id="ugf-notifs-dd-read-button-icon">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="ugf-notifs-dd-middle">
                                                        <div id="ugf-notifs-opening">
                                                            <div id="ugf-notifs-circle">
                                                            </div>
                                                            <div id="ugf-notifs-opening-text">
                                                                <span>Opening...</span>
                                                            </div>
                                                        </div>
                                                        <div id="ugf-notifs-dd-jingles">
                                                            <div id="ugf-notifs-dd-caught-up">
                                                                <span>All caught up!</span>
                                                            </div>
                                                            <div id="ugf-mr-jingles">
                                                                <div id="ugf-mr-jingles-gif" class="ugf-jingles-img">
                                                                    <img src="https://ssl.gstatic.com/s2/oz/images/notifications/jingles_gif_2x_f3cc6d214824b9711a0e8c1a75d285ff.gif" width="96">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="ugf-notifs-dd-bottom">
                                                        <div id="ugf-notifs-dd-prev" class="flex-bar">
                                                            <div id="ugf-notifs-dd-prev-text">
                                                                <span>Previously read</span>
                                                            </div>
                                                            <div id="ugf-notifs-dd-prev-icon">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="ugf-fake-share-button" class="ugf-plus-button flex-bar">
                                            <div class="ugf-plus-button-icon">
                                            </div>
                                            <div class="ugf-plus-button-text">
                                                <span>Share</span>
                                            </div>
                                        </div>
                                    </div>
									<a id="ugf-sign-in" class="ugf-logged-in-out ugf-hide-on-legacy" href="https://accounts.google.com">Sign in</a>
									<div id="ugf-account-button" class="ugf-logged-in-out ugf-hide-on-legacy">
								        <img src="${pfp}"></img>
									</div>
                                    <div id="ugf-account-dd" class="ugf-hide-on-legacy">
									    <div id="triangle-3"></div>
										<div id="triangle-4"></div>
										<div id="ugf-account-dd-card">
                                            <div id="ugf-account-dd-account" class="flex">
                                                <div id="ugf-account-left">
                                                    <a id="ugf-account-pfp" href="https://myaccount.google.com">
                                                        <img src="${pfp96}"></img>
                                                        <div id="ugf-account-pfp-change">
                                                            <span>Change photo</span>
                                                        </div>
                                                    </a>
                                                    <div id="ugf-account-normal-pfp">
                                                        <img src="${pfp96}"></img>
                                                    </div>
                                                </div>
                                                <div id="ugf-account-right">
                                                    <div id="ugf-account-username">
                                                        <span>Account</span>
                                                    </div>
                                                    <div id="ugf-account-email">
                                                        <span>Email</span>
                                                    </div>
                                                    <div id="ugf-account-links" class="flex-bar">
                                                        <a href="https://myaccount.google.com">Account</a>
                                                        <span>–</span>
                                                        <a href="/preferences">Privacy</a>
                                                    </div>
                                                    <a id="ugf-account-profile" href="${gPlusLink}">Your profile</a>
                                                </div>
                                            </div>
                                            <div id="ugf-account-dd-bottom" class="flex-bar">
                                                <a id="ugf-add-account" class="ugf-account-dd-button" href="https://accounts.google.com/AddSession">Add account</a>
                                                <a id="ugf-sign-out" class="ugf-account-dd-button" href="https://accounts.google.com/Logout">Sign out</a>
                                            </div>
                                        </div>
                                    </div>
								</div>
							</div>
						</div>
						<div id="ugf-navbar">
							<div id="ugf-navbar-inner">
								<div id="ugf-navbar-left">
                                    <span>${navbarText}</span>
								</div>
								<div id="ugf-navbar-middle">
									<a class="ugf-tab active" id="ugf-all-tab">
										<div class="ugf-tab-inner">
											<span id="ugf-all-text">All</span>
                                            <span id="ugf-web-text">Web</span>
										</div>
									</a>
									<a class="ugf-tab" id="ugf-images-tab">
										<div class="ugf-tab-inner">
											<span>Images</span>
										</div>
									</a>
									<a class="ugf-tab" id="ugf-videos-tab">
										<div class="ugf-tab-inner">
											<span>Videos</span>
										</div>
									</a>
									<a class="ugf-tab" id="ugf-news-tab">
										<div class="ugf-tab-inner">
											<span>News</span>
										</div>
									</a>
                                    <a class="ugf-tab" id="ugf-maps-tab">
										<div class="ugf-tab-inner">
											<span>Maps</span>
										</div>
									</a>
                                    <a class="ugf-tab" id="ugf-settings-tab" href="https://www.google.com/preferences">
										<div class="ugf-tab-inner">
											<span>Settings</span>
										</div>
									</a>
								</div>
                                <div id="ugf-navbar-right" class="flex-bar">
                                    <div class="flex-bar" id="ugf-personal-buttons">
                                        <a class="ugf-button ugf-adaptive-button-style ugf-button-active" id="ugf-personal-button" title="Currently showing personal results">
                                            <div class="ugf-button-inner">
									        	<span class="ugf-button-icon"></span>
                                            </div>
									    </a>
                                        <a class="ugf-button ugf-adaptive-button-style" id="ugf-non-personal-button" title="Hide personal results">
                                            <div class="ugf-button-inner">
								     	    	<span class="ugf-button-icon"></span>
                                            </div>
									    </a>
									</div>
                                    <a class="ugf-button ugf-adaptive-button-style" id="ugf-settings-button" href="https://www.google.com/preferences">
										<div class="ugf-button-inner">
											<span class="ugf-button-icon"></span>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>`;
    if (
        !window.location.href.includes("https://www.google.com/sorry") &&
        !window.location.href.includes("https://www.google.com/recaptcha") &&
        !window.location.href.includes("imgres") &&
        !window.location.href.includes("tbm=nws") &&
        !window.location.href.includes("tbm=shop") &&
        !window.location.href.includes("tbm=bks")
    ) {
        doSetup(location);
    }
    if (location == "gplex") {
        createCSS();
        setTimeout(function() {
            createCSS();
        }, 100);
        setTimeout(function() {
            createCSS();
        }, 500);
        setTimeout(function() {
            createCSS();
        }, 3000);
        setTimeout(function() {
            createCSS();
        }, 10000);
    } else {
        createCSS();
    }
    async function putThroughPaces(item) {
        return new Promise((resolve, reject) => {
            if (item.tagName == "BLOCK-COMPONENT") {
                resolve("block");
            }
            let i = 0;
            // for (i = 0; i < 9; i++) {
            if (item.parentNode) {
                if (item.parentNode.tagName == "SPAN") {
                    if (item.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.class = ".MjjYud") {
                        resolve(item);
                    } else {
                        resolve(item);
                    }
                } else {
                    resolve("Nope");
                }
            } else {
                resolve("Nope");
            }
            //   }
        }
                          )};
    let asArray;
    let started = false;
    let timeoutNumber = 1204;
    document.querySelector("html").setAttribute("logged-in","tbd");
    function doSetup(location) {
        createPageShell(location).then(function(result) {
            if (forceLoadMsg == "fast") {
                timeoutNumber = 150;
            }
            if (document.querySelector("body[data-dt='1']")) {
                /*alert("Please disable dark theme in Google Search settings to use Gplex.");
                window.location = "https://www.google.com/preferences#tabVal=1";*/
            }
            if (location == "images" && notOnImages == "true") {
                parseHTMLNeo(location);
            }
            else if (location == "images") {
                let doInterval1 = setInterval(function() {
                    let scripts = document.querySelectorAll("script");
                    //console.log(scripts);
                    scripts.forEach(itemRoot => {
                        if (itemRoot.innerHTML.includes("AF_initDataCallback({key: 'ds:1',")) {
                            itemRoot.id = "the-script";
                            clearInterval(doInterval1);
                        }
                    });
                }, 10);
            }
            let doInterval = setInterval(function() {
                asArray = document.querySelectorAll("#rso span > a");
                if (location != "images") {
                    if (asArray.length >= 10) {
                        parseHTMLNeo(location);
                        clearInterval(doInterval);
                    }
                    if (
                        asArray.length >= 8 &&
                        url.includes("barrel")
                    ) {
                        parseHTMLNeo(location);
                        clearInterval(doInterval);
                    }
                } else if (location == "images") {
                    if (asArray.length >= 30) {
                        parseHTMLNeo(location);
                        clearInterval(doInterval);
                    }
                } else {
                    clearInterval(doInterval);
                }
            }, 10);
            setTimeout(function() {
                if (forceLoadMsg == "true") {
                    if (
                        started == false &&
                        location !== "gplex" &&
                        location !== "home"
                    ) {
                        let container = document.querySelector("#ugf-main");
                        let newElem = document.createElement("div");
                        newElem.id = "ugf-load-now-container";
                        newElem.innerHTML = `
                    <span>Not enough results found. Results will load in a few seconds...</span>
                    <div id="ugf-load-now">
                        Force-load results now
                    </div>
                    `;
                        container.insertBefore(newElem, container.children[0]);
                        newElem.querySelector("#ugf-load-now").addEventListener("click", function() {
                            parseHTMLNeo(location);
                            clearInterval(doInterval);
                            newElem.remove();
                        });
                    }
                } else {
                    clearInterval(doInterval);
                    if (
                        started == false &&
                        location !== "home" &&
                        location !== "gplex"
                    ) {
                        parseHTMLNeo(location);
                    }
                }
            }, timeoutNumber);
            setTimeout(function() {
                clearInterval(doInterval);
                if (
                    started == false &&
                    location !== "home" &&
                    location !== "gplex"
                ) {
                    parseHTMLNeo(location);
                }
            }, 5000);
        });
    }
    function parseHTMLNeo(location) {
        if (started == false) {
            started = true;
            if (location == "images") {
                let newImagesExp = false;
                let tempImageList;
                if (document.querySelector("body > c-wiz")) {
                    newImagesExp = true;
                    tempImageList = document.querySelectorAll("a > div > img");
                } else {
                    tempImageList = document.querySelectorAll("h3 img");
                }
                let check = 0;
                let itemNo = 0;
                tempImageList.forEach(itemRoot => {
                    let alt = itemRoot.getAttribute('alt');
                    itemRoot.classList.add("ugf-image-parse");
                    if (alt === null) {
                        // not there
                    } else if (alt === '') {
                        // empty
                        // check if it is height 12 for favicon later on
                    } else if (alt === 'Google') {
                        // google, ignore
                    } else if (itemRoot.getAttribute("src") == "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==") {
                        // pixel, ignore
                    } else {
                        let forIframe;
                        if (newImagesExp) {
                            if (document.querySelector("#the-script")) {
                                // setTimeout(function() {
                                let topdog = itemRoot.parentNode.parentNode.parentNode;
                                //  topdog.querySelector("a").click();
                                //  var imgved = topdog.getAttribute("data-ved");*/
                                var imgdoc = topdog.getAttribute("data-id");
                                // search script
                                var imgfind = document.querySelector("#the-script").innerHTML.split(imgdoc)[1];
                                //alert(imgfind);
                                imgfind = imgfind.split('"2008": ')[0];
                                //console.log(imgfind);
                                imgfind = imgfind.split('"2003":[null,"')[1];
                                //alert(imgfind);
                                imgfind = imgfind.split('"')[0];
                                //console.log(imgfind);
                                var mera = topdog.querySelector("a:nth-of-type(2)");
                                var domain;
                                if (mera.querySelector("div")) {
                                    var link = mera.getAttribute("href");
                                    var title = mera.querySelector("div:nth-child(2)").textContent;
                                    domain = link.split("//")[1];
                                    domain = domain.split("/")[0];
                                    if (domain.includes("www.")) {
                                        domain = domain.split("www.")[1];
                                    }
                                }
                                forIframe = "https://www.google.com/imgres?q=" + searchValue + "&docid=" + imgfind + "&tbnid=" + imgdoc;
                                linkList.push({imageResult: {
                                    itemNo: itemNo,
                                    type: "image",
                                    iframeUrl: forIframe,
                                    width: itemRoot.getAttribute("width"),
                                    height: itemRoot.getAttribute("height"),
                                    refdocid: imgfind,
                                    docid: imgdoc,
                                    link: link,
                                    title: title,
                                    domain: domain,
                                    src: itemRoot.getAttribute("src")
                                }});
                                //console.log(linkList);
                                createItem(linkList[itemNo], "imageResult");
                                itemNo++;
                            } else {
                                var elm = "#the-script";
                                waitForElement10(elm).then(function(elm) {
                                    if (canGo != false) {
                                        // setTimeout(function() {
                                        let topdog = itemRoot.parentNode.parentNode.parentNode;
                                        //  topdog.querySelector("a").click();
                                        //  var imgved = topdog.getAttribute("data-ved");*/
                                        var imgdoc = topdog.getAttribute("data-id");
                                        // search script
                                        var imgfind = document.querySelector("#the-script").innerHTML.split(imgdoc)[1];
                                        //alert(imgfind);
                                        imgfind = imgfind.split('"2008": ')[0];
                                        //console.log(imgfind);
                                        imgfind = imgfind.split('"2003":[null,"')[1];
                                        //alert(imgfind);
                                        imgfind = imgfind.split('"')[0];
                                        //console.log(imgfind);
                                        var mera = topdog.querySelector("a:nth-of-type(2)");
                                        var domain;
                                        if (mera.querySelector("div")) {
                                            var link = mera.getAttribute("href");
                                            var title = mera.querySelector("div:nth-child(2)").textContent;
                                            domain = link.split("//")[1];
                                            domain = domain.split("/")[0];
                                            if (domain.includes("www.")) {
                                                domain = domain.split("www.")[1];
                                            }
                                        }
                                        forIframe = "https://www.google.com/imgres?q=" + searchValue + "&docid=" + imgfind + "&tbnid=" + imgdoc;
                                        linkList.push({imageResult: {
                                            itemNo: itemNo,
                                            type: "image",
                                            iframeUrl: forIframe,
                                            width: itemRoot.getAttribute("width"),
                                            height: itemRoot.getAttribute("height"),
                                            refdocid: imgfind,
                                            docid: imgdoc,
                                            link: link,
                                            title: title,
                                            domain: domain,
                                            src: itemRoot.getAttribute("src")
                                        }});
                                        //console.log(linkList);
                                        createItem(linkList[itemNo], "imageResult");
                                        itemNo++;
                                    }
                                });
                            }
                        } else {
                            var refdoc = itemRoot.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-ref-docid");
                            var imgdoc = itemRoot.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-docid");
                            var mera = itemRoot.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("div:nth-child(3)");
                            var domain;
                            if (mera.querySelector("a")) {
                                var link = mera.querySelector("a").getAttribute("href");
                                var title = mera.querySelector("a").textContent;
                                domain = link.split("//")[1];
                                domain = domain.split("/")[0];
                                if (domain.includes("www.")) {
                                    domain = domain.split("www.")[1];
                                }
                            } else {
                                //var elm = document.querySelectorAll(".ugf-image-parse")[itemNo];
                                var elm = mera.querySelector("a");
                                waitForElement10M(elm).then(function(elm) {
                                    if (canGo != false) {
                                        var link = mera.querySelector("a").getAttribute("href");
                                        var title = mera.querySelector("a > div:nth-of-type(2)").textContent;
                                        domain = link.split("//")[1];
                                        domain = domain.split("/")[0];
                                        if (domain.includes("www.")) {
                                            domain = domain.split("www.")[1];
                                        }
                                    }
                                });
                            }
                            forIframe = "https://www.google.com/imgres?q=" + searchValue + "&docid=" + refdoc + "&tbnid=" + imgdoc;
                            linkList.push({imageResult: {
                                itemNo: itemNo,
                                type: "image",
                                iframeUrl: forIframe,
                                width: itemRoot.getAttribute("width"),
                                height: itemRoot.getAttribute("height"),
                                refdocid: refdoc,
                                docid: imgdoc,
                                link: link,
                                title: title,
                                domain: domain,
                                src: itemRoot.getAttribute("src")
                            }});
                            createItem(linkList[itemNo], "imageResult");
                            itemNo++;
                        }
                    }
                    check++;
                });
                // document.querySelector("html").setAttribute("disabled","");
            }
            else {
                let searchValueArray = searchValue.split(" ");
                let tempLinkList = document.querySelectorAll("a");
                let tempBCList = document.querySelectorAll("block-component");
                let check = 0;
                let itemNo = 0;
                tempLinkList.forEach(itemRoot => {
                    itemRoot.classList.add("ugf-parse-item"); // [role="heading"].parentNode x4
                });
                tempBCList.forEach(itemRoot => {
                    itemRoot.classList.add("ugf-parse-item"); // [role="heading"].parentNode x4
                });
                tempLinkList = document.querySelectorAll(".ugf-parse-item");
                tempLinkList.forEach(itemRoot => {
                    putThroughPaces(itemRoot).then(function(result) {
                        if (result == "Nope") {
                        } else if (result == "block") {
                            if(document.querySelector('[data-md="132"]')){
                                let newISHHome = document.querySelector("#ugf-search-results-reserved-top");
                                let toBeMoved = document.querySelector('block-component');
                                newISHHome.appendChild(toBeMoved);
                                document.querySelector("html").setAttribute("has-fake-iframe","");
                            }else{
                                let title;
                                let heading;
                                let medium;
                                let list;
                                if (itemRoot.querySelector('[role="heading"][aria-level="2"]')) {
                                    title = itemRoot.querySelector('[role="heading"]').innerHTML;
                                    title.style.background = "red";
                                    let nextElem = itemRoot.querySelector('[role="heading"]').parentNode.nextSibling;
                                    nextElem.style.background = "blue";
                                    heading = nextElem.textContent;
                                } else if (itemRoot.querySelector('[data-attrid="wa:/description"]') == null) {
                                    medium = itemRoot.querySelector('[role="heading"]').innerHTML;
                                    if (itemRoot.querySelector('[role="heading"]').nextSibling) {
                                        list = itemRoot.querySelector('[role="heading"]').nextSibling.innerHTML;
                                    }
                                }
                                if (itemRoot.querySelector('[data-attrid="wa:/description"]')) {
                                    medium = itemRoot.querySelector('[data-attrid="wa:/description"]').innerHTML;
                                }
                                if (itemRoot.querySelector("a")) {
                                    firstLinkBelongsToBlock = true;
                                }
                                if (heading && medium && heading.textContent == medium.textContent) {
                                    //...
                                    heading = title;
                                    title = "";
                                }
                                linkList.push({searchInfoBlock: {
                                    itemNo: itemNo,
                                    type: "block",
                                    title: title,
                                    heading: heading,
                                    medium: medium,
                                    list: list
                                }});
                                createItem(linkList[itemNo], "searchBlock");
                                itemNo++;
                            }
                        } else {
                            let link = result.href;
                            let title;
                            let unmoddedTitle;
                            let description = "<i></i>";
                            if (result.querySelector("h3")) {
                                title = result.querySelector("h3").innerHTML;
                                unmoddedTitle = result.querySelector("h3").textContent;
                                searchValueArray.forEach(itemRoot => {
                                    if (
                                        itemRoot == "to" ||
                                        itemRoot == "in" ||
                                        itemRoot == "the" ||
                                        itemRoot == "a" ||
                                        itemRoot == "of" ||
                                        itemRoot == "an" ||
                                        itemRoot == "span" ||
                                        itemRoot == "class" ||
                                        itemRoot == "=" ||
                                        itemRoot == "-" ||
                                        itemRoot == "or" ||
                                        itemRoot == "pan" ||
                                        itemRoot == "sp" ||
                                        itemRoot == "spa" ||
                                        itemRoot == "cl" ||
                                        itemRoot == "cla" ||
                                        itemRoot == "clas" ||
                                        itemRoot == "as" ||
                                        itemRoot == "ass" ||
                                        itemRoot == "lass" ||
                                        itemRoot == "las" ||
                                        itemRoot == "ugf" ||
                                        itemRoot == "ugf-keyword" ||
                                        itemRoot == "keyword" ||
                                        itemRoot == "rd" ||
                                        itemRoot == "ord" ||
                                        itemRoot == "word" ||
                                        itemRoot == "yword" ||
                                        itemRoot == "eyword" ||
                                        itemRoot == "ey" ||
                                        itemRoot == "ke" ||
                                        itemRoot == "key" ||
                                        itemRoot == "keyw" ||
                                        itemRoot == "keywo" ||
                                        itemRoot == "keywor" ||
                                        itemRoot == "a" ||
                                        itemRoot == "A" ||
                                        itemRoot == "b" ||
                                        itemRoot == "B" ||
                                        itemRoot == "c" ||
                                        itemRoot == "C" ||
                                        itemRoot == "d" ||
                                        itemRoot == "D" ||
                                        itemRoot == "e" ||
                                        itemRoot == "E" ||
                                        itemRoot == "f" ||
                                        itemRoot == "F" ||
                                        itemRoot == "g" ||
                                        itemRoot == "G" ||
                                        itemRoot == "h" ||
                                        itemRoot == "H" ||
                                        itemRoot == "i" ||
                                        itemRoot == "I" ||
                                        itemRoot == "j" ||
                                        itemRoot == "J" ||
                                        itemRoot == "k" ||
                                        itemRoot == "K" ||
                                        itemRoot == "l" ||
                                        itemRoot == "L" ||
                                        itemRoot == "m" ||
                                        itemRoot == "M" ||
                                        itemRoot == "n" ||
                                        itemRoot == "N" ||
                                        itemRoot == "o" ||
                                        itemRoot == "O" ||
                                        itemRoot == "p" ||
                                        itemRoot == "p" ||
                                        itemRoot == "q" ||
                                        itemRoot == "Q" ||
                                        itemRoot == "r" ||
                                        itemRoot == "R" ||
                                        itemRoot == "s" ||
                                        itemRoot == "S" ||
                                        itemRoot == "t" ||
                                        itemRoot == "T" ||
                                        itemRoot == "u" ||
                                        itemRoot == "U" ||
                                        itemRoot == "v" ||
                                        itemRoot == "V" ||
                                        itemRoot == "w" ||
                                        itemRoot == "W" ||
                                        itemRoot == "x" ||
                                        itemRoot == "X" ||
                                        itemRoot == "y" ||
                                        itemRoot == "Y" ||
                                        itemRoot == "z" ||
                                        itemRoot == "Z"
                                    ) {
                                    } else {
                                        title = title.replaceAll(itemRoot,"<span class='ugf-keyword'>" + itemRoot + "</span>");
                                        let lowerCaseValue = itemRoot.toLowerCase();
                                        title = title.replaceAll(lowerCaseValue,"<span class='ugf-keyword'>" + lowerCaseValue + "</span>");
                                        let upperCaseValue = itemRoot.toUpperCase();
                                        title = title.replaceAll(upperCaseValue,"<span class='ugf-keyword'>" + upperCaseValue + "</span>");
                                        let normalCaseValue = capitalizeFirstLetter(itemRoot);
                                        title = title.replaceAll(normalCaseValue,"<span class='ugf-keyword'>" + normalCaseValue + "</span>");
                                    }
                                });
                            }
                            if (result.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-sncf="1"]')) {
                                description = result.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-sncf="1"]').innerHTML;
                            } else if (result.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-sncf="2"]')) {
                                description = result.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-sncf="2"]').innerHTML;
                            } else if (result.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-sncf="3"]')) {
                                description = result.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-sncf="3"]').innerHTML;
                            }
                            let isVideo = false;
                            if (
                                result.parentNode.parentNode.parentNode.parentNode.nextSibling &&
                                result.parentNode.parentNode.parentNode.parentNode.nextSibling.querySelector("img")
                            ) {
                                isVideo = true;
                            } else if (
                                location == "videos" &&
                                result.parentNode.parentNode.parentNode.parentNode.nextSibling &&
                                result.parentNode.parentNode.parentNode.parentNode.nextSibling.querySelector("img")
                            ) {
                                isVideo = true;
                            }
                            if (
                                isVideo == true &&
                                //result.parentNode.parentNode.parentNode.parentNode.nextSibling.querySelector("[role='presentation'] span")
                                result.parentNode.parentNode.parentNode.parentNode.nextSibling.querySelector("a + div")
                            ) {
                                let nextElem = result.parentNode.parentNode.parentNode.parentNode.nextSibling;
                                let thumbnail = nextElem.querySelector("img").src;
                                let duration = "361:97";
                                if (nextElem.querySelector("[role='presentation'] span")) {
                                    duration = nextElem.querySelector("[role='presentation'] span").textContent;
                                }
                                if (nextElem.querySelector("a div div div:last-child span")) {
                                    duration = nextElem.querySelector("a div div div:last-child span").textContent;
                                }
                                if (nextElem.querySelector("a + div > div")) {
                                    description = nextElem.querySelector("a + div > div").innerHTML;
                                }
                                linkList.push({videoResult: {
                                    itemNo: itemNo,
                                    type: "video",
                                    href: link,
                                    title: title,
                                    unmoddedTitle: unmoddedTitle,
                                    description: description,
                                    thumbnail: thumbnail,
                                    duration: duration
                                }});
                                createItem(linkList[itemNo], "videoResult");
                                document.querySelector("html").setAttribute("results-arrived","");
                                itemNo++;
                            } else if (title != null) {
                                linkList.push({searchResult: {
                                    itemNo: itemNo,
                                    type: "result",
                                    href: link,
                                    title: title,
                                    unmoddedTitle: unmoddedTitle,
                                    description: description
                                }});
                                createItem(linkList[itemNo], "searchResult");
                                document.querySelector("html").setAttribute("results-arrived","");
                                itemNo++;
                            }
                        }
                    });
                    check++;
                });
                if (
                    document.querySelector('[role="complementary"]') &&
                    document.querySelector('body > div > div > div [data-attrid]')
                ) {
                    hasSidebar = true;
                    if (document.querySelector('body > div > div > div > div[data-hveid]:not([role="complementary"]) [data-attrid]')) {
                        tempUpbarList = document.querySelector('body > div > div > div> div[data-hveid]').querySelectorAll("[data-attrid]");
                        var elm = "[data-attrid='description']";
                        waitForElement(elm).then(function(elm) {
                            if (canGo != false) {
                                doSidebar(2);
                            }
                        });
                    } else {
                        doSidebar(1);
                    }
                }
                function showNeuro(){
                    document.querySelector("html").setAttribute("neuro-status","generating");
                    var elm = "[data-mcpr] [data-ve-view]";
                    waitForElem(elm,100).then(function(elm) {
                        if (canGo != false) {
                            let conta=document.querySelector(".ugf-neuro-content-inner");
                            conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                            conta=document.querySelector("#ugf-right .ugf-neuro-content-inner");
                            conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                            document.querySelector("html").setAttribute("neuro-status","done");
                            document.querySelector("#ugf-main .ugf-neuro-expander").addEventListener("click",function(){
                                if(document.querySelector("[neuro-expand]")==null){
                                    document.querySelector("html").setAttribute("neuro-expand","true");
                                }else{
                                    document.querySelector("html").removeAttribute("neuro-expand");
                                }
                            });
                            document.querySelector("#ugf-right .ugf-neuro-expander").addEventListener("click",function(){
                                if(document.querySelector("[neuro-expand]")==null){
                                    document.querySelector("html").setAttribute("neuro-expand","true");
                                }else{
                                    document.querySelector("html").removeAttribute("neuro-expand");
                                }
                            });
                        }
                    });
                    var elm = "[data-mcpr] [role='heading']";
                    waitForElem(elm,1000).then(function(elm) {
                        if (canGo != false) {
                            // terrible code; I should probably find a better way to do this
                            setTimeout(function(){
                                let conta=document.querySelector(".ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                                conta=document.querySelector("#ugf-right .ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                            },500);
                            setTimeout(function(){
                                let conta=document.querySelector(".ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                                conta=document.querySelector("#ugf-right .ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                            },1000);
                            setTimeout(function(){
                                let conta=document.querySelector(".ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                                conta=document.querySelector("#ugf-right .ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                            },2000);
                            setTimeout(function(){
                                let conta=document.querySelector(".ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                                conta=document.querySelector("#ugf-right .ugf-neuro-content-inner");
                                conta.innerHTML=document.querySelector("[data-mcpr] [data-ve-view]").innerHTML;
                            },3000);
                        }
                    });
                    setTimeout(function(){
                        if(document.querySelector(".ugf-neuro-content span")==null){
                            let conta=document.querySelector(".ugf-neuro-content-inner");
                            conta.innerHTML=`<span>An AI Overview is not available for this search</span>`;
                            conta=document.querySelector("#ugf-right .ugf-neuro-content-inner");
                            conta.innerHTML=`<span>An AI Overview is not available for this search</span>`;
                            document.querySelector("html").setAttribute("neuro-status","rejected");
                        }
                    },1000);
                    document.querySelector("#ugf-main .ugf-neuro-dismiss").addEventListener("click",function(){
                        document.querySelector("html").setAttribute("neuro-status","hidden");
                    });
                    document.querySelector("#ugf-right .ugf-neuro-dismiss").addEventListener("click",function(){
                        document.querySelector("html").setAttribute("neuro-status","hidden");
                    });
                }
                if(document.querySelector("[data-mcpr]")){
                    if(neuro=="true"){
                        showNeuro();
                    }
                }
                if (document.querySelector("dynamic-visibility-control")) {
                    if (
                        document.querySelector("dynamic-visibility-control location-permission-button") ||
                        document.querySelector("dynamic-visibility-control g-dialog")
                    ) {
                    } else if (document.querySelector("dynamic-visibility-control div") == null) {
                        if (document.querySelectorAll("dynamic-visibility-control a")[1] == null) {
                            hasCorrection = "type1legacy";
                            correction = document.querySelector("dynamic-visibility-control a").outerHTML;
                        } else {
                            hasCorrection = "type2legacy";
                            correction = document.querySelector("dynamic-visibility-control a").outerHTML;
                            insteadLink = document.querySelectorAll("dynamic-visibility-control a")[1].outerHTML;
                        }
                    } else {
                        if (document.querySelector("dynamic-visibility-control span span:nth-of-type(3)")) {
                            hasCorrection = "type2";
                            insteadLink = document.querySelector("dynamic-visibility-control span span:nth-of-type(3)").querySelector("a").getAttribute("href");
                        } else {
                            hasCorrection = "type1";
                        }
                        correction = document.querySelector("dynamic-visibility-control span span:nth-of-type(2)").innerHTML;
                    }
                }
                if (document.querySelector('#rso .card-section')) {
                    let newISHHome = document.querySelector("#ugf-search-results-reserved-fake-iframe");
                    let toBeMoved;
                    if (
                        searchValue.includes(" to ") ||
                        searchValue.includes("unit") ||
                        searchValue.includes("converter")
                    ) {
                        toBeMoved = document.querySelector('#rso .card-section').parentNode.parentNode;
                    } else {
                        toBeMoved = document.querySelector('#rso .card-section');
                    }
                    newISHHome.appendChild(toBeMoved);
                    document.querySelector("html").setAttribute("has-fake-iframe","");
                }
                if (
                    document.querySelector('#rso g-lightbox') &&
                    document.querySelector('#rso block-component')
                   ) {
                    let newISHHome = document.querySelector("#ugf-search-results-reserved-fake-iframe");
                    let toBeMoved = document.querySelector('#rso block-component');
                    newISHHome.appendChild(toBeMoved);
                    document.querySelector("html").setAttribute("has-fake-iframe","");
                }
                if (
                    document.querySelector('#rso [data-md="2"]')
                   ) {
                    let newISHHome = document.querySelector("#ugf-search-results-reserved-fake-iframe");
                    let toBeMoved = document.querySelector('#rso [data-md="2"]');
                    newISHHome.appendChild(toBeMoved);
                    document.querySelector("html").setAttribute("has-fake-iframe","");
                }
                if (hasCorrection == "type1") {
                    createCorrection(correction);
                }
                if (hasCorrection == "type2") {
                    createCorrection2(correction);
                }
                if (hasCorrection == "type1legacy") {
                    createCorrection1l(correction);
                }
                if (hasCorrection == "type2legacy") {
                    createCorrection2l(correction);
                }
                if (
                    location == "all" &&
                    !searchValue.includes(" x ") &&
                    !searchValue.includes(" X ") &&
                    searchValue.includes("twitter") ||
                    searchValue.includes("Twitter") ||
                    searchValue.includes("TWITTER")
                ) {
                    bringForthJustice();
                }
                if (
                    searchValue == "Is Mark Zuckerberg a lizard" ||
                    searchValue == "Is mark zuckerberg a lizard" ||
                    searchValue == "is mark zuckerberg a lizard" ||
                    searchValue == "is Mark Zuckerberg a lizard"
                ) {
                    createItem("zucc");
                    document.querySelector("html").setAttribute("lizard","");
                }
            }
        }
    }
    function doSidebar(mode) {
        if (
            mode == 2 &&
            document.querySelectorAll('[role="complementary"]')[2]
        ) {
            tempSidebarList = document.querySelectorAll('[role="complementary"]')[2].querySelectorAll("[data-attrid]");
        } else {
            tempSidebarList = document.querySelector('[role="complementary"]').querySelectorAll("[data-attrid]");
        }
        let sidebarTitle;
        let sidebarSubtitle = "";
        let sbImg = "";
        let sbDesc = "";
        let sbKc1 = "";
        let sbKc2 = "";
        let sbKc3 = "";
        let sbKc4 = "";
        let sbKc5 = "";
        let sbKc6 = "";
        let sbKc7 = "";
        let sbKc8 = "";
        let sbKc9 = "";
        let sbKc10 = "";
        let sbKc11 = "";
        let sbKc12 = "";
        tempSidebarList.forEach(itemRoot => {
            var itemId = itemRoot.getAttribute("data-attrid");
            if (itemId == "title") {
                sidebarTitle = itemRoot.innerHTML;
            }
            if (itemId == "subtitle") {
                sidebarSubtitle = itemRoot.innerHTML;
            }
            if (itemId == "image") {
                sbImg = itemRoot.querySelector("img").getAttribute("src");
            }
            if (
                itemId == "description"
            ) {
                sbDesc = itemRoot.innerHTML;
            }
            /*if (
                document.querySelector("[data-attrid='description']")
               ) {
                sbDesc = document.querySelector("[data-attrid='description']").innerHTML;
            }*/
            if (
                !itemId.includes("kc:/ugc:user_reviews") &&
                !itemId.includes("kc:/film/film:media_actions_wholepage") &&
                !itemId.includes("kc:/ugc:thumbs_up") &&
                itemId.includes("kc:/") ||
                itemId.includes("ss:/")
            ) {
                if (sbKc1 === "") {
                    sbKc1 = itemRoot.innerHTML;
                } else if (sbKc2 === "") {
                    sbKc2 = itemRoot.innerHTML;
                } else if (sbKc3 === "") {
                    sbKc3 = itemRoot.innerHTML;
                } else if (sbKc4 === "") {
                    sbKc4 = itemRoot.innerHTML;
                } else if (sbKc5 === "") {
                    sbKc5 = itemRoot.innerHTML;
                } else if (sbKc6 === "") {
                    sbKc6 = itemRoot.innerHTML;
                } else if (sbKc7 === "") {
                    sbKc7 = itemRoot.innerHTML;
                } else if (sbKc8 === "") {
                    sbKc8 = itemRoot.innerHTML;
                } else if (sbKc9 === "") {
                    sbKc9 = itemRoot.innerHTML;
                } else if (sbKc10 === "") {
                    sbKc10 = itemRoot.innerHTML;
                } else if (sbKc11 === "") {
                    sbKc11 = itemRoot.innerHTML;
                } else if (sbKc12 === "") {
                    sbKc12 = itemRoot.innerHTML;
                }
            }
        });
        if (mode == 2) {
            tempUpbarList.forEach(itemRoot => {
                var itemId = itemRoot.getAttribute("data-attrid");
                if (itemId == "title") {
                    sidebarTitle = itemRoot.textContent;
                }
                if (itemId == "subtitle") {
                    sidebarSubtitle = itemRoot.textContent;
                }
            });
        }
        if (sidebarTitle.includes("See results about")) {

        } else {
            SB = new SearchSidebarAPI(sidebarTitle, sidebarSubtitle, sbImg, sbDesc, sbKc1, sbKc2, sbKc3, sbKc4, sbKc5, sbKc6, sbKc7, sbKc8, sbKc9, sbKc10, sbKc11, sbKc12);
            if (document.querySelector("#ugf-right-inner")) {
                createSidebar();
            } else {
                var elm = "#ugf-right-inner";
                waitForElement10(elm).then(function(elm) {
                    if (canGo != false) {
                        createSidebar();
                    }
                });
            }
        }
    }
    function createCSS() {
        if (document.querySelector("#ugf-styles")) {
        } else {
        let container = document.querySelector("body");
        let newElem = document.createElement("div");
        newElem.id = "ugf-styles";
        newElem.innerHTML = trusted_policy.createHTML(styleHTML);
        container.insertBefore(newElem, container.children[0]);
        }
    }
    async function createPageShell(location) {
        document.querySelector("html").setAttribute("gplex","");
        return new Promise((resolve, reject) => {
        let container = document.querySelector("body");
        let newElem = document.createElement("div");
        newElem.id = "ugf";
            if (location == "gplex") {
            container = document.querySelector("html");
            container.setAttribute("confirmed-sv","");
            container.innerHTML = ``;
            newElem.innerHTML = trusted_policy.createHTML(gPlexHTML);
        } else if (location !== "home") {
            newElem.innerHTML = trusted_policy.createHTML(normalHTML);
        } else {
            newElem.innerHTML = trusted_policy.createHTML(homepageHTML);
        }
            container.insertBefore(newElem, container.children[0]);
            if (location == "home") {
                document.querySelector("#ugf-hp-search input").focus();
                document.querySelector("html").setAttribute("search-focus","hard");
            }
            if (location == "gplex") {
                document.title = "Gplex Settings";
                document.querySelector("#ugf-layout-dd-btn").addEventListener("click",function() {
                    document.querySelector("html").setAttribute("layout-dd-open","");
                    document.title = "Gplex Settings";
                });
                document.querySelector("#ugf-noton-dd-btn").addEventListener("click",function() {
                    document.querySelector("html").setAttribute("noton-dd-open","");
                    document.title = "Gplex Settings";
                });
                document.querySelector("#ugf-forceload-dd-btn").addEventListener("click",function() {
                    document.querySelector("html").setAttribute("forceload-dd-open","");
                    document.title = "Gplex Settings";
                });
                document.querySelector("#ugf-settings-display-dd-btn").addEventListener("click",function() {
                    document.querySelector("html").setAttribute("settings-display-dd-open","");
                    document.title = "Gplex Settings";
                });
                document.querySelector("#ugf-name-email-dd-btn").addEventListener("click",function() {
                    document.querySelector("html").setAttribute("name-email-dd-open","");
                    document.title = "Gplex Settings";
                });
                document.querySelector("#ugf-neuro-dd-btn").addEventListener("click",function() {
                    document.querySelector("html").setAttribute("neuro-dd-open","");
                    document.title = "Gplex Settings";
                });
                document.querySelector("#ugf-layout-fence").addEventListener("click",function() {
                    document.querySelector("html").removeAttribute("layout-dd-open");
                });
                document.querySelector("#ugf-noton-fence").addEventListener("click",function() {
                    document.querySelector("html").removeAttribute("noton-dd-open");
                });
                document.querySelector("#ugf-forceload-fence").addEventListener("click",function() {
                    document.querySelector("html").removeAttribute("forceload-dd-open");
                });
                document.querySelector("#ugf-settings-display-fence").addEventListener("click",function() {
                    document.querySelector("html").removeAttribute("settings-display-dd-open");
                });
                document.querySelector("#ugf-name-email-fence").addEventListener("click",function() {
                    document.querySelector("html").removeAttribute("name-email-dd-open");
                });
                document.querySelector("#ugf-neuro-fence").addEventListener("click",function() {
                    document.querySelector("html").removeAttribute("neuro-dd-open");
                });
                let layoutBtns = document.querySelectorAll("#ugf-option-layout .ugf-dropdown-item");
                layoutBtns.forEach(itemRoot => {
                    itemRoot.addEventListener("click",function() {
                        let value = itemRoot.getAttribute("value");
                        document.querySelector("html").setAttribute("layout",value);
                        localStorage.setItem("UGF_LAYOUT",value);
                        layout = value;
                        doGplexDropdowns("layout");
                        document.querySelector("html").removeAttribute("layout-dd-open");
                    });
                });
                let notonBtns = document.querySelectorAll("#ugf-option-noton .ugf-dropdown-item");
                notonBtns.forEach(itemRoot => {
                    itemRoot.addEventListener("click",function() {
                        let value = itemRoot.getAttribute("value");
                        localStorage.setItem("UGF_NOTON_IMAGES",value);
                        notOnImages = value;
                        doGplexDropdowns("noton");
                        document.querySelector("html").removeAttribute("noton-dd-open");
                    });
                });
                let forceloadBtns = document.querySelectorAll("#ugf-option-forceload .ugf-dropdown-item");
                forceloadBtns.forEach(itemRoot => {
                    itemRoot.addEventListener("click",function() {
                        let value = itemRoot.getAttribute("value");
                        localStorage.setItem("UGF_FORCE_LOAD_MSG",value);
                        forceLoadMsg = value;
                        doGplexDropdowns("forceload");
                        document.querySelector("html").removeAttribute("forceload-dd-open");
                    });
                });
                let settingsDisplayBtns = document.querySelectorAll("#ugf-option-settings-display .ugf-dropdown-item");
                settingsDisplayBtns.forEach(itemRoot => {
                    itemRoot.addEventListener("click",function() {
                        let value = itemRoot.getAttribute("value");
                        localStorage.setItem("UGF_SETTINGS_DISPLAY",value);
                        settingsDisplay = value;
                        doGplexDropdowns("settings-display");
                        document.querySelector("html").removeAttribute("settings-display-dd-open");
                    });
                });
                let nameEmailBtns = document.querySelectorAll("#ugf-option-name-email .ugf-dropdown-item");
                nameEmailBtns.forEach(itemRoot => {
                    itemRoot.addEventListener("click",function() {
                        let value = itemRoot.getAttribute("value");
                        localStorage.setItem("UGF_NAME_EMAIL",value);
                        nameEmail = value;
                        doGplexDropdowns("name-email");
                        document.querySelector("html").removeAttribute("name-email-dd-open");
                    });
                });
                let neuroBtns = document.querySelectorAll("#ugf-option-neuro .ugf-dropdown-item");
                neuroBtns.forEach(itemRoot => {
                    itemRoot.addEventListener("click",function() {
                        let value = itemRoot.getAttribute("value");
                        localStorage.setItem("UGF_NEURO",value);
                        neuro = value;
                        doGplexDropdowns("neuro");
                        document.querySelector("html").removeAttribute("neuro-dd-open");
                    });
                });
                document.querySelector("#ugf-option-plus-link input").addEventListener("keydown", function() {
                    let key = event.key;
                    if (key == "Enter") {
                        var value = document.querySelector("#ugf-option-plus-link input").value;
                        localStorage.setItem("UGF_PLUS_LINK",value);
                        gPlusLink = value;
                        document.querySelector("#ugf-option-plus-link").setAttribute("unsaved","false");
                    } else {
                        setTimeout(function() {
                        var value = document.querySelector("#ugf-option-plus-link input").value;
                            /*if (
                                !value.includes("http") ||
                                !value.includes("://")
                            ) {
                                //document.querySelector("#ugf-option-plus-link").setAttribute("unsaved","error");
                            } else*/ if (value == gPlusLink) {
                                document.querySelector("#ugf-option-plus-link").setAttribute("unsaved","false");
                            } else {
                                document.querySelector("#ugf-option-plus-link").setAttribute("unsaved","true");
                            }
                        }, 10);
                    }
                });
                doGplexDropdowns("all");
            }
            if (document.querySelector("textarea")) {
                searchValue = document.querySelector("textarea").value;
                document.querySelector("html").setAttribute("confirmed-sv","");
            } else if (document.querySelector("input")) {
                searchValue = document.querySelector("input").getAttribute("value");
                document.querySelector("html").setAttribute("confirmed-sv","");
            /*} else if (location == "images") {
                var elm = "input";
                waitForElement10(elm).then(function(elm) {
                    if (canGo != false) {
                        searchValue = document.querySelector("input").getAttribute("value");
                        document.querySelector("html").setAttribute("confirmed-sv","");
                    }
                });*/
            } else {
                var elm = "textarea";
                waitForElement10(elm).then(function(elm) {
                    if (canGo != false) {
                        searchValue = document.querySelector("textarea").value;
                        document.querySelector("html").setAttribute("confirmed-sv","");
                    }
                });
            }
            var elm = "[confirmed-sv]";
            waitForElement10(elm).then(function(elm) {
                if (canGo != false) {
                    doSearchValueStuff();
                    resolve("done");
                }
            });
            if (document.querySelector("#result-stats nobr")) {
                resultCount = document.querySelector("#result-stats").innerHTML;
                document.querySelector("#ugf-search-results-header span").innerHTML = resultCount;
            } else {
                var elm = "#result-stats";
                waitForElement10(elm).then(function(elm) {
                    if (canGo != false) {
                        if (document.querySelector("#result-stats nobr")) {
                            resultCount = document.querySelector("#result-stats").innerHTML;
                            document.querySelector("#ugf-search-results-header span").innerHTML = resultCount;
                        }
                    }
                });
            }
        });
    }
    function doGplexDropdowns(setting) {
        if (setting == "layout" || setting == "all") {
            let layoutBtnSpan = document.querySelector("#ugf-option-layout .ugf-dropdown-button span");
            switch (layout) {
                case '2010':
                    layoutBtnSpan.textContent = UImessages.l2012;
                    break;
                case '2011':
                    layoutBtnSpan.textContent = UImessages.l2012;
                    break;
                case '2012':
                    layoutBtnSpan.textContent = UImessages.l2012;
                    break;
                case '2013':
                    layoutBtnSpan.textContent = UImessages.l2013;
                    break;
                case '2013L':
                    layoutBtnSpan.textContent = UImessages.l2013L;
                    break;
                case '2014':
                    layoutBtnSpan.textContent = UImessages.l2014;
                    break;
                case '2015':
                    layoutBtnSpan.textContent = UImessages.l2015;
                    break;
                case '2015L':
                    layoutBtnSpan.textContent = UImessages.l2015L;
                    break;
                case '2016':
                    layoutBtnSpan.textContent = UImessages.l2016;
                    break;
                case "2016C":
                    layoutBtnSpan.textContent = UImessages.l2016C;
                    break;
                case '2016L':
                    layoutBtnSpan.textContent = UImessages.l2016L;
                    break;
                case "2018":
                    layoutBtnSpan.textContent = UImessages.l2018;
                    break;
                case "2018M":
                    layoutBtnSpan.textContent = UImessages.l2018M;
                    break;
                case "2019":
                    layoutBtnSpan.textContent = UImessages.l2019;
                    break;
            }
        }
        if (setting == "noton" || setting == "all") {
            let notonBtnSpan = document.querySelector("#ugf-option-noton .ugf-dropdown-button span");
            switch (notOnImages) {
                case 'false':
                    notonBtnSpan.textContent = UImessages.notonOn;
                    break;
                case 'true':
                    notonBtnSpan.textContent = UImessages.notonOff;
                    break;
            }
        }
        if (setting == "forceload" || setting == "all") {
            let forceloadBtnSpan = document.querySelector("#ugf-option-forceload .ugf-dropdown-button span");
            switch (forceLoadMsg) {
                case 'false':
                    forceloadBtnSpan.textContent = UImessages.forceLoadMsgOff;
                    break;
                case 'true':
                    forceloadBtnSpan.textContent = UImessages.forceLoadMsgOn;
                    break;
                case 'fast':
                    forceloadBtnSpan.textContent = UImessages.forceLoadMsgFast;
                    break;
            }
        }
        if (setting == "settings-display" || setting == "all") {
            let settingsDisplayBtnSpan = document.querySelector("#ugf-option-settings-display .ugf-dropdown-button span");
            switch (settingsDisplay) {
                case 'topbar':
                    settingsDisplayBtnSpan.textContent = UImessages.SDtopbar;
                    break;
                case 'topbar-hover':
                    settingsDisplayBtnSpan.textContent = UImessages.SDtopbarHover;
                    break;
                case 'none':
                    settingsDisplayBtnSpan.textContent = UImessages.SDnone;
                    break;
            }
        }
        if (setting == "name-email" || setting == "all") {
            let nameEmailBtnSpan = document.querySelector("#ugf-option-name-email .ugf-dropdown-button span");
            switch (nameEmail) {
                case 'name':
                    nameEmailBtnSpan.textContent = UImessages.NEname;
                    break;
                case 'email':
                    nameEmailBtnSpan.textContent = UImessages.NEemail;
                    break;
                case 'none':
                    nameEmailBtnSpan.textContent = UImessages.NEnone;
                    break;
            }
        }
        if (setting == "neuro" || setting == "all") {
            let neuroBtnSpan = document.querySelector("#ugf-option-neuro .ugf-dropdown-button span");
            switch (neuro) {
                case 'true':
                    neuroBtnSpan.textContent = UImessages.NRtrue;
                    break;
                case 'false':
                    neuroBtnSpan.textContent = UImessages.NRfalse;
                    break;
            }
        }
    }
    function doSearchValueStuff() {
        if (
            location !== "home" &&
            location !== "gplex"
        ) {
            fixSidebar();
        }
        setLayout();
        createTop();
    }
    function fixSidebar() {
        let sidebarTools = document.querySelectorAll(".ugf-sidebar-tool-inner");
        sidebarTools.forEach(itemRoot => {
            let newHref = itemRoot.getAttribute("href").replaceAll("TEMP_REPLACEME",searchValue);
            itemRoot.setAttribute("href",newHref);
        });
    }
    function fixPagination() {
        let pages = document.querySelectorAll(".gp-pagination");
        let PRcheck = 0;
        /*if (loggedIn == true) {
            let href = document.querySelector("#gp-pagination-2").getAttribute("href");
            document.querySelector("#gp-pagination-2").setAttribute("href",href.replaceAll("&start=10","&start=10"));
            href = document.querySelector("#gp-pagination-3").getAttribute("href");
            document.querySelector("#gp-pagination-3").setAttribute("href",href.replaceAll("&start=20","&start=110"));
            href = document.querySelector("#gp-pagination-4").getAttribute("href");
            document.querySelector("#gp-pagination-4").setAttribute("href",href.replaceAll("&start=30","&start=210"));
            href = document.querySelector("#gp-pagination-5").getAttribute("href");
            document.querySelector("#gp-pagination-5").setAttribute("href",href.replaceAll("&start=40","&start=310"));
            href = document.querySelector("#gp-pagination-6").getAttribute("href");
            document.querySelector("#gp-pagination-6").setAttribute("href",href.replaceAll("&start=50","&start=410"));
            href = document.querySelector("#gp-pagination-7").getAttribute("href");
            document.querySelector("#gp-pagination-7").setAttribute("href",href.replaceAll("&start=60","&start=510"));
            href = document.querySelector("#gp-pagination-8").getAttribute("href");
            document.querySelector("#gp-pagination-8").setAttribute("href",href.replaceAll("&start=70","&start=610"));
            href = document.querySelector("#gp-pagination-9").getAttribute("href");
            document.querySelector("#gp-pagination-9").setAttribute("href",href.replaceAll("&start=80","&start=710"));
            href = document.querySelector("#gp-pagination-10").getAttribute("href");
            document.querySelector("#gp-pagination-10").setAttribute("href",href.replaceAll("&start=90","&start=810"));
        }*/
        pages.forEach(itemRoot => {
            let newHref;
            if (location == "images") {
                newHref = itemRoot.getAttribute("href").replaceAll("TEMP_REPLACEME",searchValue + "&udm=2");
            } else if (location == "videos") {
                newHref = itemRoot.getAttribute("href").replaceAll("TEMP_REPLACEME",searchValue + "&udm=7");
            } else {
                newHref = itemRoot.getAttribute("href").replaceAll("TEMP_REPLACEME",searchValue);
            }
            itemRoot.setAttribute("href",newHref);
            PRcheck++;
        });
        let newPrevHref;
        let newNextHref;
        let prevNumb = page - 2;
        let currNumb = page - 1;
        document.querySelectorAll("#gp-page-numbers .gp-pagination")[currNumb].classList.add("active");
        if (document.querySelectorAll("#gp-page-numbers .gp-pagination")[prevNumb]) {
            newPrevHref = document.querySelectorAll("#gp-page-numbers .gp-pagination")[prevNumb].getAttribute("href");
        }
        if (document.querySelectorAll("#gp-page-numbers .gp-pagination")[page]) {
            newNextHref = document.querySelectorAll("#gp-page-numbers .gp-pagination")[page].getAttribute("href");
        }
        document.querySelector("#gp-pagination-prev").setAttribute("href",newPrevHref);
        document.querySelector("#gp-pagination-next").setAttribute("href",newNextHref);
        if (page != 1) {
            document.querySelector("#gp-pagination-prev").classList.add("has-prev");
        }
    }
    function setLayout() {
        if (searchValue == null) {
            searchValue = "";
        }
        if (
            searchValue.includes("SO RETRO")
        ) {
            document.querySelector("html").setAttribute("layout","retro");
            checkProperty("legacy-neuro",true);
        }
        if (
            searchValue.toLowerCase()=="google in 2019"
        ) {
            document.querySelector("html").setAttribute("layout","2019");
            localStorage.setItem("UGF_LAYOUT","2019");
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",false);
                checkProperty("legacy-neuro",false);
            }, 1000);
        }
        if (
            searchValue.toLowerCase()=="google in 2017"||
            searchValue.toLowerCase()=="google in 2018"
        ) {
            document.querySelector("html").setAttribute("layout","2018");
            localStorage.setItem("UGF_LAYOUT","2018");
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",false);
                checkProperty("legacy-neuro",false);
            }, 1000);
        }
        if (
            searchValue.toLowerCase()=="google in 2018m"||
            searchValue.toLowerCase()=="google in 2017m"
        ) {
            document.querySelector("html").setAttribute("layout","2018M");
            localStorage.setItem("UGF_LAYOUT","2018M");
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",false);
                checkProperty("legacy-neuro",false);
            }, 1000);
        }
        if (
            searchValue.toLowerCase()=="google in 2016"
        ) {
            document.querySelector("html").setAttribute("layout","2016");
            localStorage.setItem("UGF_LAYOUT","2016");
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",false);
                checkProperty("legacy-neuro",false);
            }, 1000);
            //document.querySelector("html").setAttribute("fake-spa","");
        }
        if (
            searchValue.toLowerCase()=="google in 2016c"
        ) {
            document.querySelector("html").setAttribute("layout","2016C");
            localStorage.setItem("UGF_LAYOUT","2016C");
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",false);
                checkProperty("legacy-neuro",false);
            }, 1000);
        }
        if (
            searchValue.toLowerCase()=="google in 2016l"
        ) {
            document.querySelector("html").setAttribute("layout","2016L");
            localStorage.setItem("UGF_LAYOUT","2016L");
            setTimeout(function() {
                checkProperty("legacy-gbar",true);
                checkProperty("legacy-footer",true);
                checkProperty("legacy-neuro",true);
            }, 1000);
        }
        if (
            searchValue.toLowerCase()=="google in 2015"
        ) {
            document.querySelector("html").setAttribute("layout","2015");
            localStorage.setItem("UGF_LAYOUT","2015");
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",false);
                checkProperty("legacy-neuro",false);
            }, 1000);
            //document.querySelector("html").setAttribute("fake-spa","");
        }
        if (
            searchValue.toLowerCase()=="google in 2015l"
        ) {
            document.querySelector("html").setAttribute("layout","2015L");
            localStorage.setItem("UGF_LAYOUT","2015L");
            setTimeout(function() {
                checkProperty("legacy-gbar",true);
                checkProperty("legacy-footer",true);
                checkProperty("legacy-neuro",true);
            }, 1000);
        }
        if (
            searchValue.toLowerCase()=="google in 2014"
        ) {
            document.querySelector("html").setAttribute("layout","2014");
            localStorage.setItem("UGF_LAYOUT","2014");
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",false);
                checkProperty("legacy-neuro",false);
            }, 1000);
            //document.querySelector("html").setAttribute("fake-spa","");
        }
        if (
            searchValue.toLowerCase()=="google in 2013"
        ) {
            document.querySelector("html").setAttribute("layout","2013");
            localStorage.setItem("UGF_LAYOUT","2013");
            // timeouts are bad. fix this later.
            setTimeout(function() {
                checkProperty("legacy-gbar",false);
                checkProperty("legacy-footer",true);
                checkProperty("legacy-neuro",false);
            }, 1000);
            //document.querySelector("html").setAttribute("fake-spa","");
        }
        if (
            searchValue.toLowerCase()=="google in 2013l"
        ) {
            document.querySelector("html").setAttribute("layout","2013L");
            localStorage.setItem("UGF_LAYOUT","2013L");
            setTimeout(function() {
                checkProperty("legacy-gbar",true);
                checkProperty("legacy-footer",true);
                checkProperty("legacy-neuro",true);
            }, 1000);
        }
        if (
            searchValue.toLowerCase()=="google in 2012"||
            searchValue.toLowerCase()=="google in 2011"
        ) {
            document.querySelector("html").setAttribute("layout","2012");
            localStorage.setItem("UGF_LAYOUT","2012");
            setTimeout(function() {
                checkProperty("legacy-gbar",true);
                checkProperty("legacy-footer",true);
                checkProperty("legacy-neuro",false);
            }, 1000);
        }
        /*if (
            searchValue == "Google in 2011" ||
            searchValue == "google in 2011"
        ) {
            document.querySelector("html").setAttribute("layout","2011");
            localStorage.setItem("UGF_LAYOUT","2011");
        }
        if (
            searchValue == "Google in 2010" ||
            searchValue == "google in 2010"
        ) {
            document.querySelector("html").setAttribute("layout","2010");
            localStorage.setItem("UGF_LAYOUT","2010");
        }*/
    }
    function checkProperty(property, shouldHave) {
        if (document.querySelector("[" + property + "]")) {
            if (shouldHave == false) {
                document.querySelector("html").removeAttribute(property);
            }
        } else if (shouldHave == true) {
            document.querySelector("html").setAttribute(property,"");
        }
    }
    function bringForthJustice() {
        let xValue = searchValue.replaceAll("twitter","<i>x</i>");
        let safeXValue = searchValue.replaceAll("twitter","x");
        xValue = xValue.replaceAll("Twitter","<i>X</i>");
        safeXValue = safeXValue.replaceAll("Twitter","X");
        xValue = xValue.replaceAll("TWITTER","<i>𝕏</i>");
        safeXValue = safeXValue.replaceAll("TWITTER","𝕏");
        let container = document.querySelector("#ugf-search-results-reserved-top");
        let newElem = document.createElement("div");
        newElem.classList.add("ugf-correction");
        newElem.classList.add("ugf-easter-egg");
        newElem.innerHTML = `
					<div class="ugf-correction-inner">
						<span>Did you mean: </span>
                        <a href="https://www.google.com/search?q=${safeXValue}">${xValue}</a>
					</div>
					`;
        container.insertBefore(newElem, container.children[0]);
    }
    function createCorrection(value) {
        let container = document.querySelector("#ugf-search-results-reserved-top");
        let newElem = document.createElement("div");
        newElem.classList.add("ugf-correction");
        newElem.innerHTML = `
					<div class="ugf-correction-inner">${value}</div>
					`;
        container.insertBefore(newElem, container.children[0]);
    }
    function createCorrection1l(value) {
        let container = document.querySelector("#ugf-search-results-reserved-top");
        let newElem = document.createElement("div");
        newElem.classList.add("ugf-correction");
        newElem.innerHTML = `
					<div class="ugf-correction-inner">
                        <span>Did you mean:</span>
                        <span>${value}</span>
                    </div>
					`;
        container.insertBefore(newElem, container.children[0]);
    }
    function createCorrection2(value) {
        let container = document.querySelector("#ugf-search-results-reserved-top");
        let newElem = document.createElement("div");
        newElem.classList.add("ugf-correction-blue");
        newElem.innerHTML = `
					<div class="ugf-correction-inner">${value}</div>
                    <div class="ugf-correction-instead">
                         <span>Search instead for </span>
                         <a href='${insteadLink}'>"${searchValue}"</a>
                    </div>
					`;
        container.insertBefore(newElem, container.children[0]);
    }
    function createCorrection2l(value) {
        let container = document.querySelector("#ugf-search-results-reserved-top");
        let newElem = document.createElement("div");
        newElem.classList.add("ugf-correction-blue");
        newElem.innerHTML = `
                    <div class="ugf-correction-inner">
                        <span>Showing results for</span>
                        <span>${value}</span>
                    </div>
                    <div class="ugf-correction-instead">
                         <span>Search instead for </span>
                         <span>"${insteadLink}"</span>
                    </div>
					`;
        container.insertBefore(newElem, container.children[0]);
    }
    function createSidebar() {
        let container = document.querySelector("#ugf-right-inner");
        let newElem = document.createElement("div");
        newElem.id = "ugf-side-info-container";
        newElem.innerHTML = `
		<div id="ugf-side-info" present="${hasSidebar}">
			<div id="ugf-side-info-top" class="flex-bar">
				<div id="ugf-side-info-top-left">
					<div id="ugf-side-info-title">
						<span>${SB.title}</span>
					</div>
					<div id="ugf-side-info-subtitle">
						<span>${SB.sub}</span>
					</div>
				</div>
				<div id="ugf-side-info-top-right">
					<div id="ugf-side-info-image">
						<img src='${SB.img}'></img>
					</div>
				</div>
			</div>
			<div id="ugf-side-info-body">
				<div id="ugf-side-info-desc">
					<span>${SB.desc}</span>
				</div>
				<div id="ugf-side-info-kay-sees-and-ess-esses">
					<span id="ugf-kc1" class="ugf-kc">${SB.kc1}</span>
					<span id="ugf-kc2" class="ugf-kc">${SB.kc2}</span>
					<span id="ugf-kc3" class="ugf-kc">${SB.kc3}</span>
					<span id="ugf-kc4" class="ugf-kc">${SB.kc4}</span>
					<span id="ugf-kc5" class="ugf-kc">${SB.kc5}</span>
					<span id="ugf-kc6" class="ugf-kc">${SB.kc6}</span>
					<span id="ugf-kc7" class="ugf-kc">${SB.kc7}</span>
					<span id="ugf-kc8" class="ugf-kc">${SB.kc8}</span>
					<span id="ugf-kc9" class="ugf-kc">${SB.kc9}</span>
					<span id="ugf-kc10" class="ugf-kc">${SB.kc10}</span>
					<span id="ugf-kc11" class="ugf-kc">${SB.kc11}</span>
					<span id="ugf-kc12" class="ugf-kc">${SB.kc12}</span>
				</div>
			</div>
		</div>
        `;
        container.insertBefore(newElem, container.children[0]);
    }
    let searchPredictsAPI = [];
    function fetchPredicts(value) {
        fetch("https://www.google.com/complete/search?q=" + value + "&cp=" + value + "&client=gws-wiz&xssi=t&gs_pcrt=undefined&hl=en-CA&authuser=0&dpr=1", {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "connection": "keep-alive",
            "host": "www.google.com",
            "referrer": "https://www.google.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "method": "GET"
        }).then(response => response.text()).then(data => {
            var cutString1 = data.split(")]}'");
            var used = cutString1[1];
            data = JSON.parse(used);
            var list = data[0];
            parsePredicts(list);
        });
    }
    function parsePredicts(list) {
        //API
        searchPredictsAPI = [];
        let itemNo = 0;
        list.forEach(itemRoot => {
            let text = itemRoot[0];
            searchPredictsAPI.push({searchPrediction: {
                content: text,
                itemNo: itemNo
            }});
            itemNo++;
        });
        createPredicts(searchPredictsAPI);
    }
    function createPredicts(SPAPI) {
        if (document.querySelector("#ugf-search-predictions")) {
            document.querySelector("#ugf-search-predictions").remove();
        }
        let container = document.querySelector("#ugf-search-predictions-container");
        let newElem = document.createElement("div");
        newElem.id = "ugf-search-predictions";
        newElem.innerHTML = `
		<div id="ugf-search-predictions-inner">
		</div>
        <div id="ugf-search-predictions-fence">
        </div>
        `;
        container.insertBefore(newElem, container.children[0]);
        document.querySelector("#ugf-search-predictions-fence").addEventListener("click", function() {
            document.querySelector("html").removeAttribute("search-focus");
        });
        SPAPI.forEach(itemRoot => {
            createPrediction(itemRoot.searchPrediction);
        });
    }
    function createPrediction(item) {
        let container = document.querySelector("#ugf-search-predictions-inner");
        let newElem = document.createElement("a");
        newElem.classList.add("ugf-search-prediction");
        newElem.innerHTML = `
		<div class="ugf-search-prediction-inner">
             <div class="ugf-search-prediction-left">
             </div>
             <div class="ugf-search-prediction-right">
                  <span>${item.content}</span>
             </div>
		</div>
        `;
        container.insertBefore(newElem, container.children[item.itemNo]);
        let a = newElem.textContent;
        a = a.trim();
        if (location == "images") {
            newElem.setAttribute("href","https://www.google.com/search?q=" + a + "&udm=2");
        } else {
            newElem.setAttribute("href","https://www.google.com/search?q=" + a);
        }
        /*newElem.addEventListener("click", function() {
            var value = newElem.textContent;
            if (location == "images") {
                window.location = "https://www.google.com/search?q=" + value + "&udm=2";
            } else {
                window.location = "https://www.google.com/search?q=" + value;
            }
        });*/
    }
    function doImageViewer(item) {
        document.querySelector("#ugf-image-viewer").innerHTML = ``;
        let container = document.querySelector("#ugf-image-viewer");
        let newElem = document.createElement("div");
        newElem.id = "ugf-image-viewer-inner";
        newElem.innerHTML = `
                                                <div id="ugf-image-viewer-top">
                                                </div>
                                                <div id="ugf-image-viewer-content" class="flex">
                                                    <div id="ugf-image-viewer-left">
                                                        <div id="ugf-image-viewer-image">
                                                            <img src="${item.querySelector('img').getAttribute('src')}"></img>
                                                        </div>
                                                    </div>
                                                    <div id="ugf-image-viewer-right">
                                                        <a id="ugf-image-viewer-title">
                                                            <span></span>
                                                        </a>
                                                    </div>
                                                </div>
        `;
        container.insertBefore(newElem, container.children[0]);
    }
    function createTop() {
        let container = document.querySelector("#ugf-top-container");
        let newElem = document.createElement("div");
        newElem.id = "ugf-top-container-inner";
        newElem.innerHTML = trusted_policy.createHTML(topHTML);
        container.insertBefore(newElem, container.children[0]);
        document.querySelector("#gp-gbar-more").addEventListener("click", function() {
            document.querySelector("html").setAttribute("gbar-dd-open","");
        });
        document.querySelector("#gp-gbar-dd-fence").addEventListener("click", function() {
            document.querySelector("html").removeAttribute("gbar-dd-open");
        });
        if (location == "home") {
            document.querySelector("#ugf-top #ugf-search").remove();
            document.querySelector("#ugf-search-btn-2").addEventListener("click", function() {
                document.querySelector("#ugf-search-btn").click();
            });
            document.querySelector("#ugf-lucky-btn").addEventListener("click", function() {
                var value = document.querySelector("#ugf-search-value").value;
                value = value.replaceAll("(","%28");
                value = value.replaceAll(")","%29");
                value = value.replaceAll("+","%2B");
                value = value.replaceAll("-","%2D");
                value = value.replaceAll("/","%2F");
                window.location = "https://www.google.com/search?q=" + value + "&btnI=I%27m+Feeling+Lucky&iflsig=ANes7DEAAAAAZhR3OR8bkupN1D63NUfgJj5erQigfDUN";
            });
        }
        var elm = "[href^='https://accounts.google.com/S']";
        waitForElement10(elm).then(function(elm) {
            if (canGo != false) {
                if (document.querySelector("[href^='https://accounts.google.com/ServiceLogin']")) {
                    loggedIn = false;
                    document.querySelector("html").setAttribute("logged-in","false");
                }
                if (document.querySelector("[href^='https://accounts.google.com/SignOutOptions']")) {
                    loggedIn = true;
                    document.querySelector("html").setAttribute("logged-in","true");
                    pfp = document.querySelector("[href^='https://accounts.google.com/SignOutOptions'] img").getAttribute("src");
                    pfp96 = pfp.replace("s32","s96");
                    let cutIt = document.querySelector("[href^='https://accounts.google.com/SignOutOptions']").getAttribute("aria-label").split(": ");
                    cutIt = cutIt[1];
                    cutIt = cutIt.split(" \n");
                    username = cutIt[0];
                    let firstName = username.split(" ")[0];
                    email = cutIt[1];
                    email = email.split("(");
                    email = email[1];
                    email = email.split(")");
                    email = email[0];
                    document.querySelector("#gp-gbar-account span").textContent = firstName;
                    document.querySelector("#gp-gbar-email span").textContent = email;
                    document.querySelector("#ugf-account-username span").textContent = username;
                    document.querySelector("#ugf-account-email span").textContent = email;
                    document.querySelector("#ugf-username-button span").textContent = "+" + firstName;
                    document.querySelector("#ugf-email-button span").textContent = email;
                    document.querySelector("#ugf-account-button img").src = pfp;
                    document.querySelector("#ugf-account-pfp img").src = pfp96;
                    document.querySelector("#ugf-account-normal-pfp img").src = pfp96;
                    document.querySelector("#gp-gbar-plusyou span").textContent = "+" + firstName;
                }
                fixPagination();
            }
        });
        if (location == "images") {
            document.querySelector("#ugf-all-tab").classList.remove("active");
            document.querySelector("#ugf-images-tab").classList.add("active");
            document.querySelector("#ugf-page-multistate").setAttribute("state","images");
            document.querySelector("#ugf-all-item").classList.remove("active");
            document.querySelector("#ugf-images-item").classList.add("active");
            document.querySelector("#gp-gbar-search").classList.remove("active");
            document.querySelector("#gp-gbar-images").classList.add("active");
        }
        if (location == "videos") {
            document.querySelector("#ugf-all-tab").classList.remove("active");
            document.querySelector("#ugf-videos-tab").classList.add("active");
            document.querySelector("#ugf-all-item").classList.remove("active");
            document.querySelector("#ugf-videos-item").classList.add("active");
        }
        if (
            location !== "home" &&
            location !== "gplex"
        ) {
            switch (tbs) {
                case 'qdr:h':
                    document.querySelector("#ugf-hour-tool").classList.add("active");
                    document.querySelector("#ugf-all-results-tool").classList.add("active");
                    break;
                case 'qdr:d':
                    document.querySelector("#ugf-day-tool").classList.add("active");
                    document.querySelector("#ugf-all-results-tool").classList.add("active");
                    break;
                case 'qdr:w':
                    document.querySelector("#ugf-week-tool").classList.add("active");
                    document.querySelector("#ugf-all-results-tool").classList.add("active");
                    break;
                case 'qdr:m':
                    document.querySelector("#ugf-month-tool").classList.add("active");
                    document.querySelector("#ugf-all-results-tool").classList.add("active");
                    break;
                case 'qdr:y':
                    document.querySelector("#ugf-year-tool").classList.add("active");
                    document.querySelector("#ugf-all-results-tool").classList.add("active");
                    break;
                case 'li:1':
                    document.querySelector("#ugf-any-time-tool").classList.add("active");
                    document.querySelector("#ugf-verbatim-tool").classList.add("active");
                    break;
                default:
                    document.querySelector("#ugf-any-time-tool").classList.add("active");
                    document.querySelector("#ugf-all-results-tool").classList.add("active");
            }
            document.querySelector("#ugf-search-value").value = searchValue;
            document.querySelector("#ugf-all-tab").href = "https://www.google.com/search?q=" + searchValue;
            document.querySelector("#ugf-images-tab").href = "https://www.google.com/search?q=" + searchValue + "&udm=2";
            document.querySelector("#ugf-videos-tab").href = "https://www.google.com/search?q=" + searchValue + "&udm=7";
            document.querySelector("#ugf-news-tab").href = "https://www.google.com/search?q=" + searchValue + "&tbm=nws";
            document.querySelector("#ugf-maps-tab").href = "https://maps.google.com/maps?q=" + searchValue;
            document.querySelector("#ugf-all-item").href = "https://www.google.com/search?q=" + searchValue;
            document.querySelector("#ugf-images-item").href = "https://www.google.com/search?q=" + searchValue + "&udm=2";
            document.querySelector("#ugf-videos-item").href = "https://www.google.com/search?q=" + searchValue + "&udm=7";
            document.querySelector("#ugf-news-item").href = "https://www.google.com/search?q=" + searchValue + "&tbm=nws";
            document.querySelector("#ugf-maps-item").href = "https://maps.google.com/maps?q=" + searchValue;
            linkList.forEach(itemRoot => {
                if (itemRoot.searchResult) {
                    createItem(itemRoot, "searchResult");
                }
                if (itemRoot.videoResult) {
                    createItem(itemRoot, "videoResult");
                }
                if (itemRoot.imageResult) {
                    createItem(itemRoot, "imageResult");
                }
                if (itemRoot.searchInfoBlock) {
                    createItem(itemRoot, "searchBlock");
                }
            });
        }
                document.querySelector("#waffle").addEventListener("click", function() {
                    document.querySelector("html").setAttribute("apps-dd-open","");
                });
                document.querySelector("#ugf-account-button").addEventListener("click", function() {
                    document.querySelector("html").setAttribute("account-dd-open","");
                });
                document.querySelector("#ugf-fake-notifs-button").addEventListener("click", function() {
                    document.querySelector("html").setAttribute("notifs-dd-open","");
                    document.querySelector("html").setAttribute("gplus-notif-status","none");
                    setTimeout(function() {
                        document.querySelector("#ugf-mr-jingles img").setAttribute("src","https://ssl.gstatic.com/s2/oz/images/notifications/jingles_gif_2x_f3cc6d214824b9711a0e8c1a75d285ff.gif");
                    }, 250);
                });
                /*document.querySelector("#ugf-mr-jingles").addEventListener("click", function() {
                    document.querySelector("#ugf-mr-jingles img").setAttribute("src","https://ssl.gstatic.com/s2/oz/images/notifications/jingles_gif_2x_f3cc6d214824b9711a0e8c1a75d285ff.gif");
                });*/
                document.querySelector("#ugf-notifs-dd-prev").addEventListener("click", function() {
                    document.querySelector("html").setAttribute("gplus-notif-status","loading");
                    setTimeout(function() {
                        document.querySelector("html").setAttribute("gplus-notif-status","failed");
                    }, 1000);
                });
                document.querySelector("#beyond-the-fence").addEventListener("click", function() {
                    document.querySelector("html").removeAttribute("apps-dd-open");
                });
                document.querySelector("#beyond-the-fence-2").addEventListener("click", function() {
                    document.querySelector("html").removeAttribute("account-dd-open");
                });
                document.querySelector("#beyond-the-fence-3").addEventListener("click", function() {
                    document.querySelector("html").removeAttribute("notifs-dd-open");
                    document.querySelector("html").setAttribute("gplus-notif-status","none");
                });
                document.querySelector("#ugf-search-value").addEventListener("focus", function() {
                    document.querySelector("html").setAttribute("search-focus","hard");
                });
                document.querySelector("#ugf-search-value").addEventListener("blur", function() {
                    document.querySelector("html").setAttribute("search-focus","soft");
                    document.querySelector("html").setAttribute("hide-results","false");
                });
                document.querySelector("#ugf-search-btn").addEventListener("click", function() {
                    var value = document.querySelector("#ugf-search-value").value;
                    value = value.replaceAll("(","%28");
                    value = value.replaceAll(")","%29");
                    value = value.replaceAll("+","%2B");
                    value = value.replaceAll("-","%2D");
                    value = value.replaceAll("/","%2F");
                    if (value == "StructuredHomepageOn") {
                        localStorage.setItem("UGF_STRUCTURED_HOMEPAGE","true");
                        window.location.replace("https://www.google.com/");
                    } else if (value == "StructuredHomepageOff") {
                        localStorage.setItem("UGF_STRUCTURED_HOMEPAGE","false");
                        window.location.replace("https://www.google.com/");
                    }
                    if (value == "CustomImagePageOn") {
                        localStorage.setItem("UGF_NOTON_IMAGES","false");
                        alert("Command accepted");
                        window.location.replace("https://www.google.com/");
                    } else if (value == "CustomImagePageOff") {
                        localStorage.setItem("UGF_NOTON_IMAGES","true");
                        alert("Command accepted");
                        window.location.replace("https://www.google.com/");
                    }
                    else {
                        window.location = "https://www.google.com/search?q=" + value;
                        if (location == "images") {
                            window.location = "https://www.google.com/search?q=" + value + "&udm=2";
                        } else if (location == "videos") {
                            window.location = "https://www.google.com/search?q=" + value + "&udm=7";
                        } else if (location == "news") {
                            window.location = "https://www.google.com/search?q=" + value + "&tbm=nws";
                        } else if (location == "maps") {
                            window.location = "https://maps.google.com/maps?q=" + value;
                        } else {
                            window.location = "https://www.google.com/search?q=" + value;
                        }
                    }
                });
                document.querySelector("#ugf-search-value").addEventListener("keydown", function() {
                    document.querySelector("html").setAttribute("hide-results","true");
                    let key = event.key;
                    if (key == "Enter") {
                        var value = document.querySelector("#ugf-search-value").value;
                        value = value.replaceAll("(","%28");
                        value = value.replaceAll(")","%29");
                        value = value.replaceAll("+","%2B");
                        value = value.replaceAll("-","%2D");
                        value = value.replaceAll("/","%2F");
                        if (value == "StructuredHomepageOn") {
                            localStorage.setItem("UGF_STRUCTURED_HOMEPAGE","true");
                            window.location.replace("https://www.google.com/");
                        } else if (value == "StructuredHomepageOff") {
                            localStorage.setItem("UGF_STRUCTURED_HOMEPAGE","false");
                            window.location.replace("https://www.google.com/");
                        }
                        if (value == "CustomImagePageOn") {
                            localStorage.setItem("UGF_NOTON_IMAGES","false");
                            alert("Command accepted");
                            window.location.replace("https://www.google.com/");
                        } else if (value == "CustomImagePageOff") {
                            localStorage.setItem("UGF_NOTON_IMAGES","true");
                            alert("Command accepted");
                            window.location.replace("https://www.google.com/");
                        }
                        else {
                            window.location = "https://www.google.com/search?q=" + value;
                            if (location == "images") {
                                window.location = "https://www.google.com/search?q=" + value + "&udm=2";
                            } else if (location == "videos") {
                                window.location = "https://www.google.com/search?q=" + value + "&udm=7";
                            } else if (location == "news") {
                                window.location = "https://www.google.com/search?q=" + value + "&tbm=nws";
                            } else if (location == "maps") {
                                window.location = "https://maps.google.com/maps?q=" + value;
                            } else {
                                window.location = "https://www.google.com/search?q=" + value;
                            }
                        }
                    } else {
                        setTimeout(function() { // delay so it gets updated value
                            var value = document.querySelector("#ugf-search-value").value;
                            fetchPredicts(value);
                        }, 50);
                    }
                });
    }
    function createItem(itemGet, itemType) {
        let item;
        let type;
        let SRA;
        if (itemGet == "zucc") {
            type = "block";
        }
        if (itemType == "searchResult") {
            item = itemGet.searchResult;
            type = item.type;
            SRA = new SearchResultAPI(item, type);
        }
        if (itemType == "videoResult") {
            item = itemGet.videoResult;
            type = item.type;
            SRA = new SearchResultAPI(item, type);
        }
        if (itemType == "imageResult") {
            item = itemGet.imageResult;
            type = item.type;
            SRA = new SearchResultAPI(item, type);
        }
        if (itemType == "searchBlock") {
            item = itemGet.searchInfoBlock;
            type = item.type;
            SRA = new SearchResultAPI(item, type);
        }
        if (type == "result") {
            let container = document.querySelector("#ugf-search-results-container");
            let newElem = document.createElement("div");
            newElem.classList.add("ugf-search-result");
            newElem.innerHTML = `
					<div class="ugf-search-result-inner">
						<a class="ugf-search-result-title" title='${SRA.unmoddedTitle}' href="${SRA.href}">
							<span>${SRA.title}</span>
						</a>
						<a class="ugf-search-result-link" title="${SRA.href}" href="${SRA.href}">
							<span>${SRA.href}</span>
						</a>
						<div class="ugf-search-result-desc">
							<span>${SRA.description}</span>
						</div>
					</div>
					`;
            container.insertBefore(newElem, container.children[SRA.itemNo]);
        }
        if (type == "video") {
            let container = document.querySelector("#ugf-search-results-container");
            let newElem = document.createElement("div");
            newElem.classList.add("ugf-search-result");
            newElem.classList.add("ugf-video-result");
            newElem.setAttribute("thumb-url",SRA.thumbnail);
            newElem.innerHTML = `
					<div class="ugf-search-result-inner">
						<a class="ugf-search-result-title" title='${SRA.unmoddedTitle}' href="${SRA.href}">
							<span>${SRA.title}</span>
						</a>
                        <div class="ugf-video-result-details flex">
                            <a class="ugf-video-result-thumbnail" href="${SRA.href}">
                                <div class="ugf-video-result-thumbnail-inner">
					     	    	<img src="${SRA.thumbnail}">
                                </div>
                                <div class="ugf-search-result-duration">
                                    <span>▶ ${SRA.duration}</span>
                                </div>
				     		</a>
                            <div class="ugf-video-result-right">
                                <a class="ugf-search-result-link" title="${SRA.href}" href="${SRA.href}">
						        	<span>${SRA.href}</span>
					    	    </a>
					    	    <div class="ugf-search-result-desc">
					        		<span>${SRA.description}</span>
				     		    </div>
                            </div>
                        </div>
					</div>
					`;
            container.insertBefore(newElem, container.children[SRA.itemNo]);
        }
        if (type == "image") {
            let container = document.querySelector("#ugf-image-results-container");
            let newElem = document.createElement("div");
            newElem.classList.add("ugf-image-result");
            newElem.setAttribute("iframe-url",SRA.iframeUrl);
            newElem.setAttribute("href",SRA.iframeUrl);
            newElem.innerHTML = `
					<a class="ugf-image-result-inner" href="${SRA.iframeUrl}">
						<img src="${SRA.src}" width="${SRA.width}" height="${SRA.height}"></img>
                        <div class="ugf-image-result-hoverstats">
                            <!--span>${SRA.width}</span>
                            <span class="ugf-image-result-x">x</span>
                            <span>${SRA.height}</span-->
                            <span class="ugf-image-result-size-first" title="Size of the preview image. Actual image size may be larger.">
                                <span>${SRA.width}</span>
                                <span class="ugf-image-result-x">x</span>
                                <span>${SRA.height}</span>
                            </span>
                            <span class="ugf-image-result-domain">${SRA.domain}</span>
                            <span class="ugf-image-result-title">${SRA.title}</span>
                            <span class="ugf-image-result-size-second" title="Size of the preview image. Actual image size may be larger.">
                                <span>${SRA.width}</span>
                                <span class="ugf-image-result-x">x</span>
                                <span>${SRA.height}</span>
                            </span>
                        </div>
					</a>
					`;
            container.insertBefore(newElem, container.children[SRA.itemNo]);
            newElem.addEventListener("click", function() {
                var iurl = newElem.getAttribute('iframe-url');
                document.querySelector("#ugf-image-iframe iframe").setAttribute("src",iurl);
                //doImageViewer(newElem);
            });
            if (newElem.querySelector("img").getAttribute("src") == "null") {
                newElem.remove();
            }
        }
        if (type == "block") {
            let container = document.querySelector("#ugf-search-results-reserved-top");
            let newElem = document.createElement("div");
            newElem.classList.add("ugf-instant-answer");
            let blockTitle;
            let blockHeading;
            let blockMedium;
            let blockList;
            if (itemGet == "zucc") {
                newElem.classList.add("ugf-easter-egg");
                blockTitle = "";
                blockHeading = "Yes";
                blockMedium = "";
                blockList = "";
            } else {
                blockTitle = SRA.title;
                blockHeading = SRA.heading;
                blockMedium = SRA.medium;
                blockList = SRA.list;
            }
            newElem.innerHTML = `
					<div class="ugf-instant-answer-inner">
						<div class="ugf-instant-answer-supertext">
                            <span>${blockTitle}</span>
                        </div>
                        <div class="ugf-instant-answer-heading">
                            <span>${blockHeading}</span>
                        </div>
                        <div class="ugf-instant-answer-medium">
                            <span>${blockMedium}</span>
                        </div>
                        <div class="ugf-instant-answer-list">
                            <span>${blockList}</span>
                        </div>
                        <div class="ugf-instant-answer-link">
                        </div>
					</div>
					`;
            container.insertBefore(newElem, container.children[0]);
            if (blockTitle == null) {
                newElem.querySelector(".ugf-instant-answer-supertext").remove();
            }
            if (blockHeading == null) {
                newElem.querySelector(".ugf-instant-answer-heading").remove();
            }
            if (blockMedium == null) {
                newElem.querySelector(".ugf-instant-answer-medium").remove();
            }
            if (blockList == null) {
                newElem.querySelector(".ugf-instant-answer-list").remove();
            }
            if (firstLinkBelongsToBlock == true) {
                var elm = ".ugf-search-result";
                waitForElement10(elm).then(function(elm) {
                    if (canGo != false) {
                        newElem.appendChild(document.querySelector(".ugf-search-result"));
                    }
                });
            }
        }
    }
})();