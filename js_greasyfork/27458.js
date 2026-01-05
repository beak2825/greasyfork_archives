// ==UserScript==
// @name         fix github
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  widens the page when viewing code
// @author       justrunmyscripts
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27458/fix%20github.user.js
// @updateURL https://update.greasyfork.org/scripts/27458/fix%20github.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    console.log('the script "fix github" is running! (don\'t forget to refresh the page! after ajax)');

    var theelement = $('.container.new-discussion-timeline.experiment-repo-nav');
    theelement.css('width','95%');
    theelement.css('margin','10px');
    theelement.css('display','block');
    theelement.css('flex', '1');
    $(theelement.parent()).css('display','flex');
    $(theelement.parent()).css('justify-content','center');
    $(theelement.parent()).css('align-items','center');
    $(theelement.parent()).css('flex-flow','nowrap column');

}).bind(this)(jQuery);