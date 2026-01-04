// ==UserScript==
// @name         Zakop everywhere (https fix)
// @namespace    https://www.wykop.pl/
// @version      1.1.0s
// @description  dodaje możliwośc zakopania znalezisk sponsorowanych i na głównej
// @author       MirkoStats
// @match        https://www.wykop.pl/wykopalisko/*
// @match        https://www.wykop.pl/strona/*
// @match        https://www.wykop.pl/domena/*
// @match        https://www.wykop.pl/tag/znaleziska/*
// @match        https://www.wykop.pl/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/30925/Zakop%20everywhere%20%28https%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30925/Zakop%20everywhere%20%28https%20fix%29.meta.js
// ==/UserScript==

var main = function() {
    var hash = wykop.params.hash;
    var location = wykop.params.action;
    var highlightZakop = { color : '#FF6A00!important' };
    $("#itemsStream .diggbox:not(:has(.dropdown-show), .digout, .burried, :contains('+'))").each(function() {
        var $this = $(this);
        var id = $this.parent().data('id');
        $this.append($('<a class="dropdown-show sponsorowane" href="#">zakop&nbsp;</a><div class="dropdown fix-dropdown bodyClosable"><div><ul><li><a href="https://www.wykop.pl/ajax2/links/voteDown/'+ id +'/1/hash/'+ hash +'/" class="ajax">duplikat</a></li><li><a href="https://www.wykop.pl/ajax2/links/voteDown/'+ id +'/2/hash/'+ hash +'/" class="ajax">spam</a></li><li><a href="https://www.wykop.pl/ajax2/links/voteDown/'+ id +'/3/hash/'+ hash +'/" class="ajax">informacja nieprawdziwa</a></li><li><a href="https://www.wykop.pl/ajax2/links/voteDown/'+ id +'/4/hash/'+ hash +'/" class="ajax">treść nieodpowiednia</a></li><li><a href="https://www.wykop.pl/ajax2/links/voteDown/'+ id +'/5/hash/'+ hash +'/" class="ajax">nie nadaje się</a></li></ul></div></div>'));
        (location === 'upcoming' ? $('.sponsorowane').css(highlightZakop).html('zakop&nbsp;(s)') : false);
    });
};

var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);
