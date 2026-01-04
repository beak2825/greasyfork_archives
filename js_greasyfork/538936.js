// ==UserScript==
// @name         Block Pragmatic Drops & Wins Popups
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Analyzes game code to block Drops & Wins (Prize Drops/Tournaments) popups from opening, based on logo_info.js analysis.
// @author       Sharkytank
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538936/Block%20Pragmatic%20Drops%20%20Wins%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/538936/Block%20Pragmatic%20Drops%20%20Wins%20Popups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Block Drops & Wins script is running...");

    /**
     * A helper function to apply patches once the game's code is ready.
     * It periodically checks if the required components are loaded before applying the patch.
     * @param {object} info - The patch information object {name, ready(), apply(), interval}.
     */
    function UHTPatch(info) {
        if (info._UHT_timer) {
            clearInterval(info._UHT_timer);
        }

        info._UHT_timer = setInterval(function() {
            try {
                if (info.ready()) {
                    clearInterval(info._UHT_timer);
                    info.apply();
                    console.log('[DW-Blocker] Patch applied: ' + info.name);
                }
            } catch (e) {
                // Game might not be fully initialized, just wait for the next interval
            }
        }, info.interval || 500);
    }

    /**
     * PATCH 1: Block the "You Won a Prize" Popup.
     * This is the most intrusive popup. We check the promotion type when a win is announced.
     * If it's a "WD" (Wheel Drop / Drops & Wins) type, we block the function from running.
     */
    UHTPatch({
        name: "BlockDropsAndWinsPrizePopup",
        ready: function() {
            return (typeof window.PromotionsAnnouncer !== 'undefined' &&
                    typeof window.PromotionsAnnouncer.prototype.OnShowWin !== 'undefined' &&
                    typeof window.PromotionsHelper !== 'undefined' &&
                    typeof window.PromotionsHelper.FindDetails !== 'undefined' &&
                    typeof window.XT !== 'undefined' &&
                    typeof window.TournamentVars !== 'undefined' &&
                    typeof window.TournamentVars.Promotion_WinID !== 'undefined');
        },
        apply: function() {
            const originalOnShowWin = window.PromotionsAnnouncer.prototype.OnShowWin;

            window.PromotionsAnnouncer.prototype.OnShowWin = function() {
                try {
                    const details = window.PromotionsHelper.FindDetails(window.XT.GetString(window.TournamentVars.Promotion_WinID));
                    // "WD" is the type for "Drops & Wins" / "Prize Drop" promotions.
                    if (details && details.type === "WD") {
                        console.log("[DW-Blocker] Drops & Wins prize window blocked.");
                        if (this.gameObject && typeof this.gameObject.SetActive === 'function') {
                            this.gameObject.SetActive(false); // Attempt to hide the parent object
                        }
                        return; // Prevent the original function from running
                    }
                } catch (e) {
                    console.error("[DW-Blocker] Error in BlockDropsAndWinsPrizePopup patch:", e);
                }
                // If it's not a Drops & Wins promo, let it run as usual.
                return originalOnShowWin.apply(this, arguments);
            };
        }
    });

    /**
     * PATCH 2: Block the "A New Promotion Has Started" Popup.
     * This patch prevents the initial announcements for Drops & Wins races.
     */
    UHTPatch({
        name: "BlockDropsAndWinsAnnouncements",
        ready: function() {
            return (typeof window.TournamentAnnouncementDisplayer !== 'undefined' &&
                    typeof window.TournamentAnnouncementDisplayer.prototype.OnShowAnnouncement !== 'undefined' &&
                    typeof window.XT !== 'undefined' &&
                    typeof window.AnnouncementVars !== 'undefined' &&
                    typeof window.TournamentProtocol !== 'undefined');
        },
        apply: function() {
            const originalOnShowAnnouncement = window.TournamentAnnouncementDisplayer.prototype.OnShowAnnouncement;

            window.TournamentAnnouncementDisplayer.prototype.OnShowAnnouncement = function() {
                try {
                    const announcement = window.XT.GetObject(window.AnnouncementVars.Announcement);
                    // `this.type` distinguishes between tournament and race announcers.
                    // Races are the type used for Drops & Wins.
                    if (announcement && this.type === window.TournamentProtocol.PromoType.Race) {
                        console.log("[DW-Blocker] Drops & Wins start-of-promo announcement blocked.");
                        if (this.announcerWindow && typeof this.announcerWindow.SetActive === 'function') {
                            this.announcerWindow.SetActive(false);
                        }
                        return; // Prevent the original function from running
                    }
                } catch (e) {
                    console.error("[DW-Blocker] Error in BlockDropsAndWinsAnnouncements patch:", e);
                }
                return originalOnShowAnnouncement.apply(this, arguments);
            };
        }
    });

    /**
     * PATCH 3: Block the "Ear" Icon Notification.
     * This prevents the little notification icon from appearing on the side of the screen
     * for Drops & Wins promotions.
     */
    UHTPatch({
        name: "BlockDropsAndWinsEarIcon",
        ready: function() {
            return (typeof window.NotificationsManager !== 'undefined' &&
                    typeof window.NotificationsManager.prototype.OnAddNotification !== 'undefined' &&
                    typeof window.PromotionsHelper !== 'undefined' &&
                    typeof window.TournamentProtocol !== 'undefined');
        },
        apply: function() {
            const originalOnAddNotification = window.NotificationsManager.prototype.OnAddNotification;

            window.NotificationsManager.prototype.OnAddNotification = function(notification) {
                try {
                    if (notification && notification.uid) {
                        const promo = window.PromotionsHelper.FindPromotion(notification.uid);
                        // Block if the promotion type is a Race (Drops & Wins).
                        if (promo && promo.type === window.TournamentProtocol.PromoType.Race) {
                            console.log("[DW-Blocker] Drops & Wins ear notification blocked for promo: " + promo.name);
                            return; // Don't add the notification
                        }
                    }
                } catch (e) {
                    console.error("[DW-Blocker] Error in BlockDropsAndWinsEarIcon patch:", e);
                }
                return originalOnAddNotification.apply(this, arguments);
            };
        }
    });

})();