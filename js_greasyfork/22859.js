// ==UserScript==
// @name         Darker Minds
// @namespace    darker minds stylings
// @version      1.0
// @description  Dark theme for minds.com
// @author       Drew Sommer
// @match        http*://www.minds.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22859/Darker%20Minds.user.js
// @updateURL https://update.greasyfork.org/scripts/22859/Darker%20Minds.meta.js
// ==/UserScript==

GM_addStyle("\
a{\
color: #d0d0d0;\
}\
.mdl-color--white{\
background-color: #4c4c4c !important;\
color: #d1d1d1 !important;\
}\
.mdl-textfield__input{\
border: 1px solid rgba(255, 255, 255, 0.25) !important;\
color: #d1d1d1;\
}\
.minds-logo{\
background-color: rgba(255, 255, 255, 0.25);\
border-radius: 5px;\
}\
.mdl-color-text--blue-grey-500{\
color: #8DB7CC !important;\
}\
.mdl-color--grey-100{\
background-color: #808080 !important;\
}\
.mdl-color--blue-grey-400{\
background-color: #9DBCCC important;\
}\
.post{\
background-color: #545454;\
}\
.minds-avatar{\
background-color: transparent;\
}\
.mdl-card__supporting-text{\
color: rgba(212, 212, 212, 0.75);\
}\
.mdl-card__supporting-text > p{\
color: #d8d8d8 !important;\
}\
.mdl-button.mdl-button--colored{\
color: rgb(154, 203, 226);\
}\
.mdl-color-text--blue-grey-400{\
color: #b7ceda !important;\
}\
.mdl-card{\
background-color: #828282;\
}\
.m-owner-block{\
background-color: #828282 !important;\
}\
.mdl-color--blue-grey-50{\
background-color: #828282 !important;\
}\
minds-activity.mdl-card .is-boosted, minds-activity .is-boosted{\
color: #c5c5c5;\
}\
minds-activity.mdl-card .is-boosted a, minds-activity .is-boosted a{\
color: #c5c5c5;\
}\
.m-owner-block span{\
color: #c5c5c5;\
}\
.mdl-color--amber .mdl-color-text--white{\
color: #656565 !important;\
}\
.mdl-color-text--blue-grey-500{\
color: #b7b7b7 !important;\
}\
.mdl-color-text--blue-grey-300{\
color: #dce1e4 !important;\
}\
.m-discovery-suggested .mdl-cell minds-card-user .minds-usercard-block .body > span{\
color: #b9c3c7;\
}\
minds-button-subscribe > button, minds-groups-join-button > button, minds-button-edit > button, minds-button-feature > button, minds-button-user-dropdown > button, .m-button > button{\
border: 1px solid #b0c5d0;\
color: #b0c5d0;\
}\
.mdl-color-text--blue-grey-500{\
color: #3e3e3e !important;\
}\
.mce-content-body{\
color: black;\
}\
.m-form-select, select.m-form-select{\
background-color: #353535;\
}\
minds-search-bar-suggestions .m-search-bar-suggestions-list{\
background-color: #696969;\
border 1px solid #696969;\
}\
minds-search-bar-suggestions .m-search-bar-suggestions-list .m-search-bar-suggestions-suggestion{\
border-bottom: 1px solid #696969;\
}\
.m-title-block, .m-title-block-fixed{\
background-color: #212121;\
}\
.m-merchant-legal > p > a{\
color: #757575;\
}\
");