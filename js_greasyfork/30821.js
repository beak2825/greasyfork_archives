// ==UserScript==
// @name         Twitch Prime Reminder
// @namespace    http://fugiman.com
// @version      1.1
// @description  Adds a reminder of who you used your Twitch Prime sub on and when it expires to the Subscribe button modal
// @match        https://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/30821/Twitch%20Prime%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/30821/Twitch%20Prime%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If this somehow runs on a non-Twitch page, or non-Ember page, abort
    if(!Twitch || !App) return;

    // Get the current user's subscriptions
    Twitch.api.get("/api/users/:login/tickets").then(function(d) {
        // Find the Twitch Prime sub
        var t = _.find(d.tickets, function(t) {
            return t.purchase_profile.payment_provider == "samus"; // "samus" is the codename for Twitch Prime
        });

        // Maybe it isn't used, or you don't have Twitch Prime?
        if(!t) return;

        // Look up the display name for the partner
        Twitch.api.get("/api/channels/"+t.product.partner_login+"/ember").then(function(u) {
            // Some nicely formatted text
            var supportHTML = 'Currently supporting <b>'+u.display_name+'</b> until <b>'+moment(t.access_end).format('MMMM Do')+'</b>';

            // Override Twitch's application to inject our string
            App.__deprecatedInstance__.registry.resolve("component:subscribe-button/prime-section").reopen({
                didInsertElement: function() {
                    this._super();

                    var span = document.createElement("span");
                    span.innerHTML = supportHTML;
                    this.get('element').appendChild(span);
                },
            });
            App.__deprecatedInstance__.registry.resolve("component:subscribe-button/upgrade-modal").reopen({
                didInsertElement: function() {
                    this._super();

                    $("button:contains('Not yet')", this.get('element')).each(function(i, button) {
                        var span = document.createElement("span");
                        span.innerHTML = supportHTML;
                        button.parentNode.appendChild(span);
                    });
                },
            });
        });
    });
})();