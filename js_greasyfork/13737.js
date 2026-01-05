// ==UserScript==
// @id             feedly.com-8087b396-c928-4cb8-80f2-fd4a19b6533b@scriptish
// @name           Feedly Wide
// @name:de           Feedly Breitbild
// @version        1.1
// @namespace      http://feedly.com/
// @author         Jack T.
// @description    Makes Feedly work better on Wide Screens
// @description:de Verbessert Feedly auf Breitbildschirmen
// @include        http://feedly.com/*
// @include        https://feedly.com/*
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13737/Feedly%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/13737/Feedly%20Wide.meta.js
// ==/UserScript==

GM_addStyle(".feedIndexTitleHolder.nonEmpty.emptyAware {font-weight: bold !important; }");
GM_addStyle("#feedlyTabsHolder .nonEmpty {color: white !important; }");
GM_addStyle(".feedUnreadCount.staticSimpleUnreadCount {color: white !important; }");
GM_addStyle(".feedIndex.target.selected {border-left: 4px solid #DD4B39 !important;}");
GM_addStyle("#feedlyTabs {overflow-y: auto;padding-left: 10px !important;padding-right: 27px;width: 240px !important;}");
GM_addStyle("#feedlyProBar {display: none !important;}");
GM_addStyle("#feedlyTabs > div:first-child {display: none !important;}");
GM_addStyle("#aboutArea {display: none !important;}");
GM_addStyle("#feedlyPart0.area {padding: 0 0 0 33px !important;}");
GM_addStyle("#mainBar {width: auto !important; }");
GM_addStyle("#feedlyPage {width: auto !important; }");
GM_addStyle(".u100Entry {max-width: none !important; }");
GM_addStyle(".entryBody {max-width: none !important; }");
GM_addStyle(".entryholder {padding-bottom: 0px !important; }");
GM_addStyle(".websiteCallForAction {display: none !important; }");