// ==UserScript==
// @name         Steam Workshop Item Remover
// @namespace    http://snakeeyed777.weebly.com
// @version      1.0
// @description  Automaticlly deletes all of your add-ons by page
// @author       SnakeEyed
// @note         PLEASE DISABLE THIS EXTENSION WHEN YOUR NOT USING IT.
// @note2         --------->REPLACE AND PUT YOUR USERNAME BELOW<---------
// @match        http://steamcommunity.com/id/[PUT YOUR USERNAME HERE]/myworkshopfiles/?browsesort=mysubscriptions&browsefilter=mysubscriptions&p=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31321/Steam%20Workshop%20Item%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/31321/Steam%20Workshop%20Item%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery ("[id^='UnsubscribeItemBtn']").children().trigger('click'); setTimeout(function(){location.reload();},500);
})();