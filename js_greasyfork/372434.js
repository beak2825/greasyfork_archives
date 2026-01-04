// ==UserScript==
// @name         Hearthpwn_Pack_Opener
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This is a automation tool for opening card packs on hearthpwn.com pack opener simulator.
// @author       IllusiveMan
// @match        https://www.hearthpwn.com/packs/simulator/1-hearthpwn-wild-pack
// @match        https://www.hearthpwn.com/packs/simulator/9-kobolds-and-catacombs
// @match        https://www.hearthpwn.com/packs/simulator/10-the-witchwood
// @match        https://www.hearthpwn.com/packs/simulator/12-boomsday
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @icon        https://www.google.com/s2/favicons?domain=www.hearthpwn.com

// BASED ON THE WORK OF zurfyx => https://gist.github.com/zurfyx/2b92f6eba7e51b2f30fd879e99a293b1

// @downloadURL https://update.greasyfork.org/scripts/372434/Hearthpwn_Pack_Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/372434/Hearthpwn_Pack_Opener.meta.js
// ==/UserScript==
var $ = window.jQuery;
console.log("Hearthpwn_Pack_Opener loaded !");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

function CardOpener(craft_cost, pack_title) {
    this.url = window.location.href;
    this.craft_cost = craft_cost || 6000;
    this.pack_title = pack_title || 'OMG THIS PACK';
};

CardOpener.prototype.open = function() {
    var cards = $('.card-back');
    cards.each(function(i, x) {
        var targetNode = x;
        if (targetNode) {
            triggerMouseEvent (targetNode, "mouseup");
        }
        else {
            console.log ("Target node not found!");
        }
    });
};

CardOpener.prototype.save = function(err) {
    var self = this;
    $("#field-title").val(this.pack_title);
    setTimeout(function() {
        var current_cost = parseInt($($('.craft-cost')[0]).text());
        if (current_cost >= self.craft_cost) {
            $("#pack-save").click();
        } else { // pack's not good enough
            $("#field-title").val("");
            err('Pack didn\'t reach the minimum dust requirement');
        }
    },3000); // You can edit the time before reload but do not go to low or else hearthpwn will block you from opening packs again !
};

CardOpener.prototype.verify_url = function() {
    if (window.location.href !== this.url) {
        window.location.href = this.url;
    }
};

CardOpener.prototype.start = function() {
    var self = this;
    self.verify_url();
    self.open();
    self.save(function(msg) {
        window.location.href = self.url;
    });
};

var co = new CardOpener(5000, 'Ez'); // Arguments : (Minimum CRAFTING cost of cards to reach, Saved pack name)
co.start();