// ==UserScript==
// @name         Torn Faction War Helper with Battle Stats
// @namespace    Torn_Faction_War_Helper
// @version      2.0.9
// @description  Formats war/wall/profile lists, adds BS & Status columns/headers for BOTH factions, sorts BOTH lists (TW: Faction > Status > BS; Ranked/Profile: Status > BS), click status/row to attack, shows timer/last action. Now with FF Scouter fallback and a settings menu.
// @author       GNS-C4 [3960752]
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      api.torn.com
// @connect      www.tornstats.com
// @connect      ffscouter.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/534101/Torn%20Faction%20War%20Helper%20with%20Battle%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/534101/Torn%20Faction%20War%20Helper%20with%20Battle%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DEBUG = true; // Set to true to enable detailed console logs
    const API_KEY_CONFIG_KEY = 'tornWarHelperApiKey';
    const TORNSTATS_API_KEY_CONFIG_KEY = 'tornStatsWarHelperApiKey';
    const FFSCOUTER_API_KEY_CONFIG_KEY = 'tornFFScouterApiKey';
    const FFSCOUTER_ENABLED_CONFIG_KEY = 'tornFFScouterEnabled';
    const SORTING_PREFERENCE_CONFIG_KEY = 'tornWarHelperSortingPref';


    let API_KEY = GM_getValue(API_KEY_CONFIG_KEY, ''); // Initialize with stored key
    let TORNSTATS_API_KEY = GM_getValue(TORNSTATS_API_KEY_CONFIG_KEY, ''); // Initialize with stored TornStats key
    let FFSCOUTER_API_KEY = GM_getValue(FFSCOUTER_API_KEY_CONFIG_KEY, ''); // Initialize with stored FFScouter key
    let FFSCOUTER_ENABLED = GM_getValue(FFSCOUTER_ENABLED_CONFIG_KEY, false); // Initialize with stored FFScouter enabled state
    let SORTING_PREFERENCE = GM_getValue(SORTING_PREFERENCE_CONFIG_KEY, 'default');

    let currentEnemyFactionId = null; // Track the ID of the enemy/defender/profile faction
    let currentYourFactionId = null; // Track the ID of your/attacker faction (only relevant on step=your)
    let isProcessing = false; // Flag to prevent concurrent processing runs
    let refreshApiIntervalId = null; // Holds the interval ID for the API refresh
    const REFRESH_INTERVAL_MS = 5000; // Refresh data every 5 seconds
    const API_COMMENT = "War%20Helper%20BS%20Sort%20Both%20Profile"; // URL encoded comment
    const CACHE_PREFIX = 'tornWarHelperCache_'; // Prefix for cache keys
    const TORNSTATS_CACHE_PREFIX = 'tornStatsWarHelperCache_';
    const FFSCOUTER_CACHE_PREFIX = 'ffScouterWarHelperCache_';
    const CACHE_MAX_AGE_MS = 60 * 1000; // Cache data for 1 minute
    const TORNSTATS_CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000; // Cache TornStats data for 12 hours
    const FFSCOUTER_CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000; // Cache FFScouter data for 12 hours

    // Store fetched data separately
    let currentEnemyTornStatsData = null;
    let currentYourTornStatsData = null;
    let currentPageType = null; // 'faction_war_old', 'territory_war', 'ranked_war', or 'profile_page'

    // Store separate timer interval IDs for each list
    const liveTimerIntervals = new Map();

    // --- NEW: Real-time data store from intercepted fetch/websockets ---
    const hospTime = {}; // { userId: releaseTimestamp, ... }

    // Initial log - always show this
    console.log("Torn Faction War Helper (Faction API + TornStats + FFScouter v2.0.9) starting.");
    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Initial API Key loaded: ${API_KEY ? 'Exists' : 'Missing'}`);
    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Initial TornStats API Key loaded: ${TORNSTATS_API_KEY ? 'Exists' : 'Missing'}`);
    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Initial FFScouter Enabled: ${FFSCOUTER_ENABLED}, Key loaded: ${FFSCOUTER_API_KEY ? 'Exists' : 'Missing'}`);
    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Initial Sorting Preference: ${SORTING_PREFERENCE}`);


    // --- Styling ---
    GM_addStyle(`
        /* Make faction names container relative for positioning the settings button */
        .faction-names, .members-list .table-header, .white-grad.c-pointer {
            position: relative; /* Added .white-grad... */
        }

        /* Settings button style */
        .war-helper-settings-btn {
            position: absolute;
            top: 2px;
            right: 5px;
            background-color: rgba(68, 68, 68, 0.8);
            border: 1px solid #666;
            color: #ccc;
            border-radius: 5px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 18px; /* Slightly larger for the gear icon */
            line-height: 1;
            z-index: 100;
            font-family: 'Segoe UI Symbol', sans-serif; /* For better gear icon rendering */
        }
        .war-helper-settings-btn:hover {
            background-color: #555;
            color: #fff;
        }
        /* Prevent Faction selectors from wraping */
        .d .faction-tabs {
    margin-top: 8px;
    border-radius: 5px;
    box-shadow: 0 0 2px #00000040;
    box-shadow: var(--default-tabs-box-shadow);
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
    }

    /* Apply only to old faction wall view (faction_war_old), not ranked/territory war views */
    body.war-helper-page-type-faction_war_old .d .f-war-list.war-new {
    font-family: "Fjalla One";
    font-weight: normal;
    display: flex;
    flex-wrap: nowrap;
    }
        /* Modal Styles */
        .apiKeyModal {
            position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
            background-color: #333; color: #fff; padding: 20px; border: 1px solid #555;
            border-radius: 8px; z-index: 10001; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            font-family: 'Inter', sans-serif; width: 400px; max-width: 90vw;
        }
        .apiKeyModal h3 { margin-top: 0; margin-bottom: 20px; text-align: center; border-bottom: 1px solid #555; padding-bottom: 10px; }
        .apiKeyModal h4 { margin-top: 15px; margin-bottom: 8px; color: #ddd; border-bottom: 1px solid #444; padding-bottom: 4px; }
        .apiKeyModal label { display: block; margin-bottom: 5px; font-weight: bold; }
        .apiKeyModal input[type="text"], .apiKeyModal select { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #555; background-color: #444; color: #fff; border-radius: 4px; box-sizing: border-box; }
        .apiKeyModal .ffscouter-enable-label { display: flex; align-items: center; margin-top: 10px; font-weight: normal; cursor: pointer; }
        .apiKeyModal .ffscouter-enable-label input { margin-right: 10px; width: auto; }
        .apiKeyModal .button-group { display: flex; justify-content: flex-end; margin-top: 20px; }
        .apiKeyModal button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; background-color: #555; color: #fff; margin-left: 10px; }
        .apiKeyModal button:hover { background-color: #666; }
        .apiKeyModal .saveApiKey { background-color: #4CAF50; }
        .apiKeyModal .saveApiKey:hover { background-color: #45a049; }
        .apiKeyModal p { font-size: 0.8em; margin: 8px 0; color: #bbb; line-height: 1.3; }
        .apiKeyModal hr { border: none; border-top: 1px solid #555; margin: 15px 0; }

        /* FF Color Coding */
        .bs.bs-ff-green { color: #32CD32 !important; font-weight: bold; }
        .bs.bs-ff-yellow { color: #FFD700 !important; }
        .bs.bs-ff-red { color: #FF4500 !important; }

        /* --- Layout Adjustments for Faction War Old / Ranked War / Profile --- */
        /* Expand the main content container when the body has the specific class */
         body.war-helper-expanded-view div#mainContainer {
             width: auto !important; /* NEW: unset fixed width */
             max-width: min-content !important;
             margin-left: 0 !important;
         }
         /* Ensure the #factions container fills the expanded wrapper */
         body.war-helper-expanded-view #factions {
              display: inline-block; !important;
         }
         /* Fix for profile page content wrapper */
         body.war-helper-expanded-view div#mainContainer .content-wrapper {
             margin: 10px !important;
         }

        /* Original rules for the member list container */
        .faction-war.membersWrap___NbYLx {
             display: flex !important;
             flex-wrap: wrap !important;
             justify-content: space-between !important;
             gap: 1% !important; /* Keep a small gap */
             width: 100% !important;
             flex-direction: row !important;
        }
        /* Make both columns wider in the old/ranked war layout */
        .faction-war.membersWrap___NbYLx > .enemy-faction.tab-menu-cont,
        .faction-war.membersWrap___NbYLx > .your-faction.tab-menu-cont {
             flex-basis: 49.5% !important; /* Distribute space more evenly */
             flex-grow: 0 !important;
             flex-shrink: 0 !important;
             width: 49.5% !important;
             box-sizing: border-box !important;
             order: initial !important; /* Reset order if needed */
        }
         /* Ensure faction names span full width above columns */
        .faction-war.membersWrap___NbYLx .faction-names {
             width: 100% !important;
             box-sizing: border-box !important;
             flex-basis: 100% !important;
             margin-bottom: 5px !important;
             order: -1; /* Place above the columns */
        }
         /* Hide any clear floats that might interfere */
        .faction-war.membersWrap___NbYLx > .clear {
             display: none !important;
        }
        /* --- End Layout Adjustments --- */


        /* Column Styling (Applies to all page types where relevant) */
        .enemy-faction .white-grad, .your-faction .white-grad, .faction-war .tab-menu-cont .title.white-grad.clearfix, .members-list .table-header { display: flex !important; flex-wrap: nowrap !important; align-items: center !important; width: 100% !important; padding: 0 5px; box-sizing: border-box; }
        .enemy-faction li.enemy, .your-faction li.your, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ, .members-list .table-body .table-row { display: flex !important; flex-wrap: nowrap !important; align-items: center !important; width: 100% !important; padding: 5px !important; box-sizing: border-box; } /* REVERTED to align-items: center */

        /* Column Widths - Old Wall / Ranked War */
        .enemy-faction .white-grad .member, .your-faction .white-grad .member { flex: 1 1 auto; min-width: 80px; padding-left: 5px; }
        .enemy-faction .white-grad .level, .your-faction .white-grad .level { width: 35px !important; flex: 0 0 35px; text-align: center; }
        .enemy-faction .white-grad .points, .your-faction .white-grad .points { width: 40px !important; flex: 0 0 40px; text-align: center; }
        .enemy-faction .white-grad .bs, .your-faction .white-grad .bs { width: 65px !important; flex: 0 0 65px; text-align: center; font-weight: bold; cursor: help; }
        .enemy-faction .white-grad .status, .your-faction .white-grad .status { width: 90px !important; flex: 0 0 90px; text-align: center; } /* Status header on old wall */
        .enemy-faction .white-grad .status.left, .your-faction .white-grad .status.left { width: 90px !important; flex: 0 0 90px; text-align: center; } /* Status header on ranked wall (might have .left) */
        .enemy-faction .white-grad .attack, .your-faction .white-grad .attack { width: 40px !important; flex: 0 0 40px; text-align: center; padding-right: 5px; }
        .enemy-faction .white-grad .clear, .your-faction .white-grad .clear { display: none !important; }

        /* Column Widths - Territory War Header*/
        .faction-war .tab-menu-cont .title.white-grad.clearfix .members { flex: 1 1 auto; min-width: 80px; padding-left: 5px; }
        .faction-war .tab-menu-cont .title.white-grad.clearfix .level { width: 35px !important; flex: 0 0 35px; text-align: center; }
        .faction-war .tab-menu-cont .title.white-grad.clearfix .points { width: 40px !important; flex: 0 0 40px; text-align: center; }
        .faction-war .tab-menu-cont .title.white-grad.clearfix .bs { width: 65px !important; flex: 0 0 65px; text-align: center; font-weight: bold; cursor: help; }
        .faction-war .tab-menu-cont .title.white-grad.clearfix .status.left { width: 90px !important; flex: 0 0 90px; text-align: center; } /* Status header TW */
        .faction-war .tab-menu-cont .title.white-grad.clearfix .attack { width: 40px !important; flex: 0 0 40px; text-align: center; padding-right: 5px; }
        .faction-war .tab-menu-cont .title.white-grad.clearfix .clear { display: none !important; }
        .faction-war .tab-menu-cont .title.white-grad.clearfix .id { width: 30px !important; flex: 0 0 30px; text-align: center;}
        .faction-war .tab-menu-cont .title.white-grad.clearfix .user-icons { display: none !important; }

        /* Column Widths - Profile Page Header */
        .members-list .table-header .member { flex: 1 1 auto; min-width: 80px; padding-left: 5px; }
        .members-list .table-header .lvl { width: 35px !important; flex: 0 0 35px; text-align: center; }
        .members-list .table-header .member-icons { display: none !important; }
        .members-list .table-header .position { width: 100px !important; flex: 0 0 100px; text-align: center; }
        .members-list .table-header .days { width: 40px !important; flex: 0 0 40px; text-align: center; }
        .members-list .table-header .bs { width: 65px !important; flex: 0 0 65px; text-align: center; font-weight: bold; cursor: help; }
        .members-list .table-header .status { width: 90px !important; flex: 0 0 90px; text-align: center; } /* Status header profile */
        .members-list .table-header .attack { width: 40px !important; flex: 0 0 40px; text-align: center; padding-right: 5px; }

        /* Row Content Styling - Old Wall / Ranked War */
        .enemy-faction li.enemy .member, .your-faction li.your .member { flex: 1 1 auto; } /* REMOVED min-width */
        .enemy-faction li.enemy .level, .your-faction li.your .level { width: 35px !important; flex: 0 0 35px; text-align: center; }
        .enemy-faction li.enemy .points, .your-faction li.your .points { width: 40px !important; flex: 0 0 40px; text-align: center; }
        .enemy-faction li.enemy .bs, .your-faction li.your .bs { width: 65px !important; flex: 0 0 65px; text-align: center; font-size: 0.9em; color: #ccc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: help; }
        .enemy-faction li.enemy .status.left, .your-faction li.your .status.left { width: 90px !important; min-width: 90px !important; flex: 0 0 90px; padding: 3px 2px !important; vertical-align: top !important; line-height: 1.2; height: auto !important; cursor: pointer !important; box-sizing: border-box !important; text-align: left; } /* Status content old/ranked */
        .enemy-faction li.enemy .attack, .your-faction li.your .attack { width: 40px !important; flex: 0 0 40px; text-align: center; }
        .enemy-faction li.enemy .clear, .your-faction li.your .clear { display: none !important; }

        /* Row Content Styling - Territory War */
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .member, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .member { flex: 1 1 auto; padding-right: 3px; } /* REMOVED min-width */
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .level, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .level { width: 35px !important; flex: 0 0 35px; text-align: center; flex-shrink: 0; }
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .points, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .points { width: 40px !important; flex: 0 0 40px; text-align: center; flex-shrink: 0; }
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .bs, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .bs { width: 65px !important; flex: 0 0 65px; text-align: center; font-size: 0.9em; color: #ccc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: help; flex-shrink: 0; }
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .status.left, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .status.left { width: 90px !important; min-width: 90px !important; flex: 0 0 90px; padding: 3px 2px !important; vertical-align: top !important; line-height: 1.2; height: auto !important; cursor: pointer !important; box-sizing: border-box !important; text-align: left; flex-shrink: 0; } /* Status content TW */
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .attack, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .attack { width: 40px !important; flex: 0 0 40px; text-align: center; flex-shrink: 0; }
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .clear, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .clear { display: none !important; }
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .id, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .id { width: 30px !important; flex: 0 0 30px; text-align: center; flex-shrink: 0; }
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .user-icons, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .user-icons { display: none !important; }
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.join .text-center { flex-grow: 1; text-align: center; } /* Special case for 'Join War' row in TW */
        .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.join > *:not(.text-center):not(.id) { display: none; }

        /* Row Content Styling - Profile Page */
        .members-list .table-body .table-row .member { flex: 1 1 auto; } /* REMOVED min-width */
        .members-list .table-body .table-row .lvl { width: 35px !important; flex: 0 0 35px; text-align: center; }
        .members-list .table-body .table-row .member-icons { display: none !important; }
        .members-list .table-body .table-row .position { width: 100px !important; flex: 0 0 100px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .members-list .table-body .table-row .days { width: 40px !important; flex: 0 0 40px; text-align: center; }
        .members-list .table-body .table-row .bs { width: 65px !important; flex: 0 0 65px; text-align: center; font-size: 0.9em; color: #ccc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: help; }
        .members-list .table-body .table-row .status { width: 90px !important; min-width: 90px !important; flex: 0 0 90px; padding: 3px 2px !important; vertical-align: top !important; line-height: 1.2; height: auto !important; cursor: pointer !important; box-sizing: border-box !important; text-align: left; } /* Status content profile */
        .members-list .table-body .table-row .attack { width: 40px !important; flex: 0 0 40px; text-align: center; padding-right: 5px; }
        .members-list .table-body .table-row .attack a { display: none; } /* Hide default attack link on profile */
        .members-list .table-body .table-row .status:hover { background-color: rgba(255, 255, 255, 0.05); }

        /* --- Hide Attack Column for Enemy Faction Only --- */
        .enemy-faction .white-grad .attack, /* Header */
        .enemy-faction li.enemy .attack, /* Row - Old/Ranked War */
        .faction-war .tab-menu-cont.enemy .title.white-grad.clearfix .attack, /* Row Header - Territory War */
        .faction-war .tab-menu-cont.enemy li.memberRowWp___cr9pQ .attack /* Row - Territory War */
        {
             display: none !important;
        }

        /* --- Adjust Member Column Width for Enemy Faction --- */
        .enemy-faction .white-grad .member, /* Header - Old/Ranked War */
        .enemy-faction li.enemy .member, /* Row - Old/Ranked War */
        .faction-war .tab-menu-cont.enemy .title.white-grad.clearfix .members, /* Row Header - Territory War */
        .faction-war .tab-menu-cont.enemy li.memberRowWp___cr9pQ .member /* Row - Territory War */
         {
            flex-grow: 1.2 !important; /* Give it slightly more space */
         }
        /* --- End Attack Column Hiding --- */

        /* General Status/BS Display */
        .bs.loading { color: #888; font-style: italic; }
        .bs.error { color: #f00; font-weight: bold; }
        .status-content-wrapper { display: flex; flex-direction: column; justify-content: flex-start; height: 100%; width: 100%; overflow: hidden; text-align: left; pointer-events: none; }
        .original-status-text { margin-bottom: 1px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; order: 1; }
        .status-content-wrapper .original-status-text.is-hospital { font-size: 0; height: 0; margin-bottom: 0; overflow: hidden; } /* Hide original text when timer shown */
        .hospital-timer { color: #e53e3e; font-size: 0.9em; margin-bottom: 1px; white-space: nowrap; order: 2; }
        .hospital-timer.timer-finished { color: #50a72c; } /* Green when done */
        .last-action-info { font-size: 0.8em; color: #909090; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; line-height: 1.1; order: 3; }
        .api-error-indicator { color: orange; font-weight: bold; margin-left: 3px; cursor: help; display: inline; font-size: 0.9em; }

        /* Fallback layout for non-flexbox containers (shouldn't be needed much now) */
        #factions .faction-war:not(.membersWrap___NbYLx) { display: flex !important; flex-direction: column !important; }
        #factions .faction-war:not(.membersWrap___NbYLx) > .tab-menu-cont.enemy { order: 1 !important; margin-bottom: 10px !important; }
        #factions .faction-war:not(.membersWrap___NbYLx) > .tab-menu-cont.your { order: 2 !important; }

        /* Responsive adjustments */
        @media (max-width: 800px) {
            /* Stack columns on small screens */
            .faction-war.membersWrap___NbYLx > .enemy-faction.tab-menu-cont,
            .faction-war.membersWrap___NbYLx > .your-faction.tab-menu-cont {
                 width: 100% !important; flex-basis: 100% !important; max-width: 100% !important; margin-bottom: 10px !important;
            }
            #factions .faction-war:not(.membersWrap___NbYLx) > .tab-menu-cont.enemy,
            #factions .faction-war:not(.membersWrap___NbYLx) > .tab-menu-cont.your {
                 width: 100% !important; flex-basis: auto !important; margin-bottom: 10px !important;
            }
             /* Don't expand content wrapper on small screens */
             body.war-helper-expanded-view div#mainContainer {
                 max-width: none !important;
                 margin: 10px !important; /* Adjust default margin if needed */
             }
             body.war-helper-expanded-view #factions {
                  width: auto !important; /* Revert */
             }

            /* Adjust padding and wrap for headers/rows */
            .enemy-faction .white-grad, .enemy-faction li.enemy, .your-faction .white-grad, .your-faction li.your,
            .members-list .table-header, .members-list .table-body .table-row,
            .faction-war .tab-menu-cont .title.white-grad.clearfix, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your {
                 padding: 0 3px !important; flex-wrap: nowrap !important;
            }

            /* Adjust column widths and visibility for smaller screens */
            .enemy-faction .white-grad .member, .enemy-faction li.enemy .member, .your-faction .white-grad .member, .your-faction li.your .member,
            .members-list .table-header .member, .members-list .table-body .table-row .member,
            .faction-war .tab-menu-cont .title.white-grad.clearfix .members, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .member, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .member {
                 flex: 1 1 60px; min-width: 60px !important; font-size: 0.9em; flex-shrink: 1 !important;
            }

            .enemy-faction .white-grad .level, .enemy-faction li.enemy .level, .your-faction .white-grad .level, .your-faction li.your .level,
            .members-list .table-header .lvl, .members-list .table-body .table-row .lvl,
            .faction-war .tab-menu-cont .title.white-grad.clearfix .level, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .level, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .level {
                 width: 30px !important; flex: 0 0 30px !important; font-size: 0.8em; flex-shrink: 0 !important; text-align: center;
            }

            .enemy-faction .white-grad .points, .enemy-faction li.enemy .points, .your-faction .white-grad .points, .your-faction li.your .points,
            .faction-war .tab-menu-cont .title.white-grad.clearfix .points, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .points, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .points {
                 width: 30px !important; flex: 0 0 30px !important; font-size: 0.8em; flex-shrink: 0 !important; text-align: center;
            }

            .members-list .table-header .position, .members-list .table-body .table-row .position {
                 width: 70px !important; flex: 0 0 70px !important; font-size: 0.8em; flex-shrink: 0;
            }
            .members-list .table-header .days, .members-list .table-body .table-row .days {
                 width: 30px !important; flex: 0 0 30px !important; font-size: 0.8em; flex-shrink: 0;
            }

            .enemy-faction .white-grad .bs, .enemy-faction li.enemy .bs, .your-faction .white-grad .bs, .your-faction li.your .bs,
            .members-list .table-header .bs, .members-list .table-body .table-row .bs,
             .faction-war .tab-menu-cont .title.white-grad.clearfix .bs, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.enemy .bs, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ.your .bs {
                 width: 45px !important; flex: 0 0 45px !important; font-size: 0.75em; flex-shrink: 0 !important; text-align: center;
            }

             .enemy-faction .white-grad .status, .enemy-faction li.enemy .status, .your-faction .white-grad .status, .your-faction li.your .status,
            .members-list .table-header .status, .members-list .table-body .table-row .status,
            .faction-war .tab-menu-cont .title.white-grad.clearfix .status, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ .status {
                 width: 70px !important; flex: 0 0 70px !important; min-width: 65px !important; font-size: 0.8em; flex-shrink: 0 !important; display: flex !important; visibility: visible !important; opacity: 1 !important; text-align: left;
            }

            .enemy-faction .white-grad .attack, .enemy-faction li.enemy .attack, .your-faction .white-grad .attack, .your-faction li.your .attack,
            .members-list .table-header .attack, .members-list .table-body .table-row .attack,
            .faction-war .tab-menu-cont .title.white-grad.clearfix .attack, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ .attack {
                 width: 30px !important; flex: 0 0 30px !important; flex-shrink: 0 !important; text-align: center;
                 /* Explicitly show attack for your faction on mobile, hide for enemy still */
                 display: flex !important;
            }
             .enemy-faction .white-grad .attack, /* Header */
            .enemy-faction li.enemy .attack, /* Row - Old/Ranked War */
            .faction-war .tab-menu-cont.enemy .title.white-grad.clearfix .attack, /* Row Header - Territory War */
            .faction-war .tab-menu-cont.enemy li.memberRowWp___cr9pQ .attack /* Row - Territory War */
            {
                 display: none !important; /* Ensure enemy attack is hidden on mobile */
            }


            /* Hide Territory War specific ID column on small screens */
            .faction-war .tab-menu-cont .title.white-grad.clearfix .id, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ .id { display: none !important; }

             /* Hide icons on small screens */
            .faction-war .tab-menu-cont .title.white-grad.clearfix .user-icons, .faction-war .tab-menu-cont li.memberRowWp___cr9pQ .user-icons { display: none !important; }


            /* Allow status text to wrap */
            .status-content-wrapper .original-status-text, .status-content-wrapper .hospital-timer {
                 white-space: normal; overflow: visible; text-overflow: clip; font-size: 1.0em; line-height: 1.1;
            }
            .status-content-wrapper .last-action-info {
                 font-size: 0.9em; line-height: 1.1; white-space: normal; overflow: visible; text-overflow: clip;
            }
        }
    `);
    if (DEBUG) console.log("Torn War Helper [DEBUG]: Styles added.");

    // --- Helper Functions ---
    /** Formats seconds into HH:MM:SS or MM:SS or SSs format. */
    function formatTime(totalSeconds) {
        if (totalSeconds <= 0) return "0s";
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        let timeString = '';
        if (hours > 0) timeString += `${hours.toString().padStart(2, '0')}:`;
        if (minutes > 0 || hours > 0) timeString += `${minutes.toString().padStart(2, '0')}:`;
        timeString += `${seconds.toString().padStart(2, '0')}`;
        if (hours === 0 && minutes === 0) timeString += 's';
        return timeString;
    }

    /** Abbreviates country names. */
    function abbreviateCountry(countryName) {
        const abbreviations = { "Argentina": "ARG", "Canada": "CAN", "Cayman Islands": "CYM", "China": "CHN", "Hawaii": "HI", "Japan": "JPN", "Mexico": "MEX", "South Africa": "ZAF", "Switzerland": "CHE", "UAE": "ARE", "United Kingdom": "UK" };
        return abbreviations[countryName] || countryName;
    }

    /** Formats large numbers with suffixes (k, M, B). */
    function formatNumber(num) {
        if (num === null || num === undefined || isNaN(num)) return '-';
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        return (num / 1000000000).toFixed(1) + 'B';
    }

    /** Parses formatted numbers (e.g., '1.2k', '3.5M') back into numbers. */
    function parseFormattedNumber(str) {
        if (typeof str !== 'string' || !str || str === '-' || str === '...' || str.includes('ERR') || str.includes('KEY?')) return -1;
        const lowerStr = str.toLowerCase().replace('~', '');
        const numPart = parseFloat(lowerStr);
        if (isNaN(numPart)) return -1;
        if (lowerStr.endsWith('k')) return numPart * 1000;
        if (lowerStr.endsWith('m')) return numPart * 1000000;
        if (lowerStr.endsWith('b')) return numPart * 1000000000;
        return numPart;
    }

    /** Safely parses a JSON string. */
    function JSONparse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.error("Torn War Helper: JSON parse error.", e);
            return null;
        }
    }

    /** Fetches faction data from Torn API. */
    function fetchFactionData(factionId, factionType) {
        return new Promise((resolve, reject) => {
            const cacheKey = CACHE_PREFIX + factionId;
            if (DEBUG) console.log(`Torn War Helper [DEBUG] (${factionType}): fetchFactionData called for Faction ID: ${factionId}.`);
            if (!API_KEY) {
                console.warn(`Torn War Helper (${factionType}): Torn API Key missing.`);
                openSettingsModal();
                reject({ error: "Torn API Key missing", code: -1, type: 'torn' });
                return;
            }
            const cachedDataStr = GM_getValue(cacheKey, null);
            if (cachedDataStr) {
                try {
                    const cachedData = JSON.parse(cachedDataStr);
                    if (cachedData && cachedData.timestamp && (Date.now() - cachedData.timestamp < CACHE_MAX_AGE_MS)) {
                        if (DEBUG) console.log(`Torn War Helper [DEBUG] (${factionType}): Using fresh Torn API cache for faction ${factionId}.`);
                        resolve(cachedData.members);
                        return;
                    }
                } catch (e) {
                    console.error(`Torn War Helper (${factionType}): Error parsing Torn API cached data.`, e);
                }
            }
            const apiUrl = `https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${API_KEY}&comment=${API_COMMENT}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            console.error(`Torn War Helper (${factionType}): Torn API Error for faction ${factionId}: Code ${data.error.code}, ${data.error.error}`);
                            if (data.error.code === 2) {
                                console.error(`Torn War Helper (${factionType}): Invalid Torn API Key detected. Clearing stored key.`);
                                GM_setValue(API_KEY_CONFIG_KEY, '');
                                API_KEY = '';
                                openSettingsModal();
                            }
                            reject({ error: data.error.error, code: data.error.code, type: 'torn' });
                        } else if (data.members && Array.isArray(data.members)) {
                            const cacheData = { timestamp: Date.now(), members: data.members };
                            GM_setValue(cacheKey, JSON.stringify(cacheData));
                            resolve(data.members);
                        } else {
                            console.warn(`Torn War Helper (${factionType}): Torn API response for faction ${factionId} missing 'members' array.`);
                             if (typeof data.members === 'object' && Object.keys(data.members).length === 0) {
                                  resolve([]);
                             } else {
                                reject({ error: "Unexpected API response structure", code: -2, type: 'torn' });
                             }
                        }
                    } catch (e) {
                        console.error(`Torn War Helper (${factionType}): Error parsing Torn API response for faction ${factionId}:`, e);
                        reject({ error: "Parse error", code: -3, type: 'torn' });
                    }
                },
                onerror: function(response) {
                    console.error(`Torn War Helper (${factionType}): Network error fetching Torn API data for faction ${factionId}:`, response);
                    reject({ error: "Network error", code: -4, type: 'torn' });
                }
            });
        });
    }

    /** Fetches faction spy data from TornStats API. */
    function fetchTornStatsData(factionId, factionType) {
        return new Promise((resolve) => {
            const cacheKey = TORNSTATS_CACHE_PREFIX + factionId;
            if (DEBUG) console.log(`Torn War Helper [DEBUG] (${factionType}): fetchTornStatsData called for Faction ID: ${factionId}.`);
            if (!TORNSTATS_API_KEY) {
                resolve({ status: 'NO_KEY' });
                return;
            }
            const cachedDataStr = GM_getValue(cacheKey, null);
            if (cachedDataStr) {
                try {
                    const cachedData = JSON.parse(cachedDataStr);
                    if (cachedData && cachedData.timestamp && (Date.now() - cachedData.timestamp < TORNSTATS_CACHE_MAX_AGE_MS)) {
                        if (DEBUG) console.log(`Torn War Helper [DEBUG] (${factionType}): Using fresh TornStats cache for faction ${factionId}.`);
                        resolve(cachedData.data);
                        return;
                    }
                } catch (e) {
                    console.error(`Torn War Helper (${factionType}): Error parsing TornStats cached data.`, e);
                }
            }
            const apiUrl = `https://www.tornstats.com/api/v2/${TORNSTATS_API_KEY}/spy/faction/${factionId}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        let resultData;
                        if (data.status === false) {
                            console.error(`Torn War Helper (${factionType}): TornStats API Error for faction ${factionId}: ${data.message}`);
                            resultData = { error: data.message, code: data.code || -10, type: 'tornstats' };
                            if (data.message && data.message.toLowerCase().includes("invalid api key")) {
                                console.error(`Torn War Helper (${factionType}): Invalid TornStats API Key detected.`);
                                resultData.status = 'INVALID_KEY';
                            }
                        } else if (data.faction && typeof data.faction.members === 'object') {
                            resultData = data.faction.members;
                        } else {
                            console.warn(`Torn War Helper (${factionType}): TornStats response for faction ${factionId} has unexpected structure.`);
                            resultData = { error: "Unexpected TornStats response structure", code: -11, type: 'tornstats' };
                        }
                        const cacheData = { timestamp: Date.now(), data: resultData };
                        GM_setValue(cacheKey, JSON.stringify(cacheData));
                        resolve(resultData);
                    } catch (e) {
                        console.error(`Torn War Helper (${factionType}): Error parsing TornStats API response for faction ${factionId}:`, e);
                        resolve({ error: "Parse error", code: -12, type: 'tornstats' });
                    }
                },
                onerror: function(response) {
                    console.error(`Torn War Helper (${factionType}): Network error fetching TornStats API data for faction ${factionId}:`, response);
                    resolve({ error: "Network error", code: -13, type: 'tornstats' });
                }
            });
        });
    }

    /** Fetches user stats from FFScouter in a batch. */
    function fetchFFScouterDataBatch(userIds, factionType) {
        return new Promise((resolve) => {
            if (!FFSCOUTER_ENABLED || userIds.length === 0) {
                return resolve({});
            }
            if (!FFSCOUTER_API_KEY) {
                console.warn(`Torn War Helper (${factionType}): FFScouter is enabled but API Key is missing.`);
                // Return an object where each user ID has a NO_KEY status, so it can be displayed per-user
                const result = {};
                userIds.forEach(id => { result[id] = { status: 'NO_KEY' }; });
                return resolve(result);
            }

            // Caching logic: check cache for each user ID first.
            const targetsToFetch = [];
            const finalResults = {};
            const now = Date.now();

            userIds.forEach(id => {
                const cacheKey = FFSCOUTER_CACHE_PREFIX + id;
                const cachedDataStr = GM_getValue(cacheKey, null);
                if (cachedDataStr) {
                    try {
                        const cachedData = JSON.parse(cachedDataStr);
                        if (cachedData && cachedData.timestamp && (now - cachedData.timestamp < FFSCOUTER_CACHE_MAX_AGE_MS)) {
                            finalResults[id] = cachedData.data;
                        } else {
                            targetsToFetch.push(id);
                        }
                    } catch (e) {
                        targetsToFetch.push(id);
                    }
                } else {
                    targetsToFetch.push(id);
                }
            });

            if (targetsToFetch.length === 0) {
                if (DEBUG) console.log(`Torn War Helper [DEBUG] (${factionType}): All FFScouter targets were found in cache.`);
                return resolve(finalResults);
            }

            const apiUrl = `https://ffscouter.com/api/v1/get-stats?key=${FFSCOUTER_API_KEY}&targets=${targetsToFetch.join(',')}`;
            if (DEBUG) console.log(`Torn War Helper [DEBUG] (${factionType}): Fetching FFScouter URL for ${targetsToFetch.length} users: ${apiUrl}`);

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        // Case 1: API returns an error object, e.g., { status: false, message: '...' }
                        if (typeof data === 'object' && !Array.isArray(data) && data.status === false) {
                            console.error(`Torn War Helper (${factionType}): FFScouter API Error for batch: ${data.message || 'Unknown error'}`);
                            const isInvalidKey = data.message && data.message.toLowerCase().includes("invalid api key");
                            targetsToFetch.forEach(id => {
                                finalResults[id] = {
                                    error: data.message || 'Batch API Error',
                                    status: isInvalidKey ? 'INVALID_KEY' : undefined
                                };
                            });
                        }
                        // Case 2: API returns a success array of player data
                        else if (Array.isArray(data)) {
                            if (DEBUG) console.log(`Torn War Helper [DEBUG] (${factionType}): Successfully parsed FFScouter batch data (array response).`);

                            // Create a map from the returned array for easy lookup
                            const resultMap = new Map(data.map(item => [item.player_id.toString(), item]));

                            // Process all targets that were supposed to be fetched
                            targetsToFetch.forEach(id => {
                                const playerData = resultMap.get(id);
                                if (playerData) {
                                    // Found data for this user
                                    finalResults[id] = playerData;
                                    const cacheKey = FFSCOUTER_CACHE_PREFIX + id;
                                    const cacheData = { timestamp: Date.now(), data: playerData };
                                    GM_setValue(cacheKey, JSON.stringify(cacheData));
                                } else {
                                    // API did not return data for this specific user in the batch
                                    finalResults[id] = { error: "No data in response" }; // Or just leave it empty
                                }
                            });
                        }
                        // Case 3: Unexpected response format
                        else {
                             console.error(`Torn War Helper (${factionType}): Unexpected FFScouter batch response structure.`);
                             targetsToFetch.forEach(id => { finalResults[id] = { error: "Unexpected response" }; });
                        }
                        resolve(finalResults);
                    } catch (e) {
                        console.error(`Torn War Helper (${factionType}): Error parsing FFScouter batch response:`, e);
                        console.error(`Torn War Helper (${factionType}): Response Text:`, response.responseText);
                        targetsToFetch.forEach(id => { finalResults[id] = { error: "Parse error" }; });
                        resolve(finalResults);
                    }
                },
                onerror: function(response) {
                    console.error(`Torn War Helper (${factionType}): Network error fetching FFScouter batch data:`, response);
                    targetsToFetch.forEach(id => { finalResults[id] = { error: "Network error" }; });
                    resolve(finalResults);
                }
            });
        });
    }

    /** Prompts the user for all API settings in a unified modal. */
    function openSettingsModal() {
        if (DEBUG) console.log("Torn War Helper [DEBUG]: openSettingsModal called.");
        if (document.querySelector('.apiKeyModal')) return;
        stopAllIntervals();

        const modal = document.createElement('div');
        modal.className = 'apiKeyModal';
        modal.innerHTML = `
            <h3>War Helper Settings</h3>

             <h4>Preferences</h4>
            <label for="sortingPreferenceSelect">Sorting Preference:</label>
            <select id="sortingPreferenceSelect">
                <option value="default" ${SORTING_PREFERENCE === 'default' ? 'selected' : ''}>Default (Status > BS)</option>
                <option value="fair_fight" ${SORTING_PREFERENCE === 'fair_fight' ? 'selected' : ''}>Fair Fight Priority</option>
            </select>
            <p>Choose how to sort 'Okay' players.</p>
            <hr>

            <h4>Torn API</h4>
            <label for="apiKeyInput">Torn API Key:</label>
            <input type="text" id="apiKeyInput" placeholder="Required for script to function" value="${API_KEY}">
            <p>Get from Torn Settings → API Key (needs 'Public profile data').</p>
            <hr>

            <h4>TornStats API (Primary)</h4>
            <label for="tornStatsApiKeyInput">TornStats API Key:</label>
            <input type="text" id="tornStatsApiKeyInput" placeholder="Your TornStats API Key" value="${TORNSTATS_API_KEY}">
            <p>Provides accurate battle stats for the 'BS' column.</p>
            <hr>

            <h4>FFScouter API (Secondary)</h4>
            <label class="ffscouter-enable-label">
                <input type="checkbox" id="ffscouterEnableCheckbox" ${FFSCOUTER_ENABLED ? 'checked' : ''}>
                Enable FFScouter
            </label>
            <label for="ffscouterApiKeyInput">FFScouter API Key:</label>
            <input type="text" id="ffscouterApiKeyInput" placeholder="Your FFScouter API Key" value="${FFSCOUTER_API_KEY}">
            <p>Provides <strong>Fair Fight & BS estimates</strong>.</p>

            <div class="button-group">
                <button id="cancelApiModal">Cancel</button>
                <button id="saveApiModal" class="saveApiKey">Save & Close</button>
            </div>`;
        document.body.appendChild(modal);

        modal.querySelector('#saveApiModal').addEventListener('click', () => {
             const oldSortingPref = SORTING_PREFERENCE;

            // Save Sorting Preference
            const sortingPref = modal.querySelector('#sortingPreferenceSelect').value;
            GM_setValue(SORTING_PREFERENCE_CONFIG_KEY, sortingPref);
            SORTING_PREFERENCE = sortingPref;

            // Save Torn API Key
            const tornKey = modal.querySelector('#apiKeyInput').value.trim();
            GM_setValue(API_KEY_CONFIG_KEY, tornKey);
            API_KEY = tornKey;

            // Save TornStats API Key
            const tornStatsKey = modal.querySelector('#tornStatsApiKeyInput').value.trim();
            GM_setValue(TORNSTATS_API_KEY_CONFIG_KEY, tornStatsKey);
            TORNSTATS_API_KEY = tornStatsKey;

            // Save FFScouter Settings
            const ffScouterEnabled = modal.querySelector('#ffscouterEnableCheckbox').checked;
            const ffScouterKey = modal.querySelector('#ffscouterApiKeyInput').value.trim();
            GM_setValue(FFSCOUTER_ENABLED_CONFIG_KEY, ffScouterEnabled);
            FFSCOUTER_ENABLED = ffScouterEnabled;
            GM_setValue(FFSCOUTER_API_KEY_CONFIG_KEY, ffScouterKey);
            FFSCOUTER_API_KEY = ffScouterKey;

            if (DEBUG) console.log("Torn War Helper [DEBUG]: All settings saved.");
            modal.remove();

            const needsResort = oldSortingPref !== SORTING_PREFERENCE;
            // Force a refresh and a resort if the sorting preference changed
            scheduleProcessFactionList(50, true, needsResort);
        });

        modal.querySelector('#cancelApiModal').addEventListener('click', () => {
            modal.remove();
            scheduleProcessFactionList(50);
        });
    }

    // --- Core Logic ---
    function getOrCreateElement(parent, selector, tag, className) {
        let element = parent.querySelector(selector);
        if (!element) {
            element = document.createElement(tag);
            element.className = className;
            parent.appendChild(element);
        }
        return element;
    }

    /** Adds the BS and Status column headers if they don't exist */
    function ensureColumnsAndHeaders(headerRow) {
        if (!headerRow) {
             if (DEBUG) console.log("Torn War Helper [DEBUG]: ensureColumnsAndHeaders called with null headerRow.");
             return;
        }
        if (DEBUG) console.log("Torn War Helper [DEBUG]: Ensuring headers for:", headerRow);


        // BS Header
        if (!headerRow.querySelector('.bs')) {
            const insertAfter = headerRow.querySelector('.points') || headerRow.querySelector('.days') || headerRow.querySelector('.level, .lvl');
            if (insertAfter) {
                const bsHeader = document.createElement('div');
                bsHeader.className = 'bs';
                bsHeader.textContent = 'BS';
                bsHeader.title = 'Battle Stats (TornStats / FFScouter)';
                insertAfter.parentNode.insertBefore(bsHeader, insertAfter.nextSibling);
                 if (DEBUG) console.log("Torn War Helper [DEBUG]: Inserted BS header.");
            } else if (DEBUG) {
                 console.log("Torn War Helper [DEBUG]: Could not find insertion point for BS header.");
            }
        } else if (DEBUG) {
            console.log("Torn War Helper [DEBUG]: BS header already exists.");
        }


        // Status Header
        if (!headerRow.querySelector('.status')) {
            const insertBefore = headerRow.querySelector('.attack');
            const insertAfter = headerRow.querySelector('.bs') || headerRow.querySelector('.days') || headerRow.querySelector('.position');
            const statusHeader = document.createElement('div');
            // Status alignment adjustment: Needs 'left' class on territory war AND ranked/old war, but not on profile
            statusHeader.className = (currentPageType === 'territory_war' || currentPageType === 'ranked_war' || currentPageType === 'faction_war_old') ? 'status left' : 'status';
            statusHeader.textContent = 'Status';
            if (insertBefore) {
                insertBefore.parentNode.insertBefore(statusHeader, insertBefore);
                 if (DEBUG) console.log("Torn War Helper [DEBUG]: Inserted Status header before attack.");
            } else if (insertAfter) {
                insertAfter.parentNode.insertBefore(statusHeader, insertAfter.nextSibling);
                 if (DEBUG) console.log("Torn War Helper [DEBUG]: Inserted Status header after BS/days/pos.");
            } else if (DEBUG) {
                 console.log("Torn War Helper [DEBUG]: Could not find insertion point for Status header.");
            }
        } else if (DEBUG) {
             console.log("Torn War Helper [DEBUG]: Status header already exists.");
        }
    }

    /** Processes a single member list item (LI element). */
    function processMemberWithData(memberLi, memberApiData, memberTornStatsData, memberFFScouterData) {
        const userId = memberApiData?.id?.toString();
        if (!userId) return false;

        memberLi.dataset.playerId = userId;

        if (memberFFScouterData?.fair_fight) {
            memberLi.dataset.ffValue = memberFFScouterData.fair_fight;
        } else {
            delete memberLi.dataset.ffValue;
        }


        const isEnemyMember = memberLi.closest('.enemy-faction') || memberLi.classList.contains('enemy');
        let sel = { status: '.status', points: '.points', level: '.level', attack: '.attack', name: '.member a[href*="/profiles.php?XID="]', days: null, pos: null };
        if (currentPageType === 'territory_war') { sel = { ...sel, status: '.status.left', points: '.points.left', level: '.level.left', attack: '.attack.left', name: 'a.user.name[href*="/profiles.php?XID="]' }; }
        else if (currentPageType === 'profile_page') { sel = { ...sel, status: '.table-cell.status', points: null, level: '.table-cell.lvl', attack: '.table-cell.attack', name: '.table-cell.member a[href*="/profiles.php?XID="]', days: '.table-cell.days', pos: '.table-cell.position' }; }
        // For ranked_war/faction_war_old, the default sel is mostly correct, but status needs 'left' class.
        else if (currentPageType === 'ranked_war' || currentPageType === 'faction_war_old') { sel.status = '.status.left'; }


        let statusDiv = memberLi.querySelector(sel.status);

        // Click-to-Attack
        const clickTarget = (currentPageType === 'territory_war') ? memberLi : (statusDiv || memberLi);
        if (isEnemyMember || currentPageType === 'profile_page') {
            clickTarget.dataset.userId = userId;
            clickTarget.style.cursor = 'pointer';
            if (!clickTarget.onclick) {
                clickTarget.onclick = (e) => {
                    if (e.target.closest('a, button, input')) return;
                    window.open(`https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${e.currentTarget.dataset.userId}`, '_blank');
                };
            }
        } else {
            clickTarget.style.cursor = 'default';
            clickTarget.onclick = null;
        }

        // BS Column
        const insertAfterBS = (sel.points ? memberLi.querySelector(sel.points) : null) || (sel.days ? memberLi.querySelector(sel.days) : null) || memberLi.querySelector(sel.level);
        let bsDiv = memberLi.querySelector('div.bs');
        if (insertAfterBS && !bsDiv) {
            bsDiv = document.createElement('div');
            bsDiv.className = 'bs loading';
            insertAfterBS.parentNode.insertBefore(bsDiv, insertAfterBS.nextSibling);
             // if (DEBUG) console.log(`Torn War Helper [DEBUG]: Created BS div for ${userId}`);
        }
        if (bsDiv) {
            bsDiv.style.cursor = 'help';
            bsDiv.onclick = null;
            bsDiv.className = 'bs';
            let bsDisplayValue = '-', tooltipHTML = 'No battle stat data available.', bsSortValue = '-';

            if (memberTornStatsData?.spy?.total !== undefined) {
                bsDisplayValue = formatNumber(memberTornStatsData.spy.total);

                let tempTooltipHTML = 'TornStats:<br>';
                if (memberTornStatsData.spy.strength) tempTooltipHTML += `Str: ${memberTornStatsData.spy.strength.toLocaleString()}<br>`;
                if (memberTornStatsData.spy.speed) tempTooltipHTML += `Spd: ${memberTornStatsData.spy.speed.toLocaleString()}<br>`;
                if (memberTornStatsData.spy.dexterity) tempTooltipHTML += `Dex: ${memberTornStatsData.spy.dexterity.toLocaleString()}<br>`;
                if (memberTornStatsData.spy.defense) tempTooltipHTML += `Def: ${memberTornStatsData.spy.defense.toLocaleString()}<br>`;
                tempTooltipHTML += `Total: ${memberTornStatsData.spy.total.toLocaleString()}`;

                if (memberTornStatsData.spy && memberTornStatsData.spy.timestamp) {
                    const spyDate = new Date(memberTornStatsData.spy.timestamp * 1000);
                    const now = new Date();
                    const diffMs = now - spyDate;
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffHours / 24);
                    let ageString = '';
                    if (diffDays > 0) {
                        ageString = `${diffDays}d ago`;
                    } else if (diffHours > 0) {
                        ageString = `${diffHours}h ago`;
                    } else {
                        const diffMins = Math.floor(diffMs / (1000 * 60));
                        ageString = `${diffMins}m ago`;
                    }
                    tempTooltipHTML += `<br>Spy Age: ${ageString}`;
                }

                if (memberFFScouterData?.fair_fight) {
                    tempTooltipHTML += `<br>FF Estimate: ${memberFFScouterData.fair_fight.toLocaleString()}`;
                }
                tooltipHTML = tempTooltipHTML;

            } else if (FFSCOUTER_ENABLED && memberFFScouterData?.bs_estimate) {
                bsDisplayValue = `~${formatNumber(memberFFScouterData.bs_estimate)}`;
                tooltipHTML = `FFScouter (Estimate):<br>Total: ${memberFFScouterData.bs_estimate.toLocaleString()}`;

                if (memberFFScouterData.fair_fight) {
                    tooltipHTML += `<br>FF Estimate: ${memberFFScouterData.fair_fight.toLocaleString()}`;
                }

                if (memberFFScouterData.last_updated) {
                    const spyDate = new Date(memberFFScouterData.last_updated * 1000);
                    const now = new Date();
                    const diffMs = now - spyDate;
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffHours / 24);
                    let ageString = '';
                    if (diffDays > 0) {
                        ageString = `${diffDays}d ago`;
                    } else if (diffHours > 0) {
                        ageString = `${diffHours}h ago`;
                    } else {
                        const diffMins = Math.floor(diffMs / (1000 * 60));
                        ageString = `${diffMins}m ago`;
                    }
                    tooltipHTML += `<br>Updated: ${ageString}`;
                }
            } else {
                bsDiv.style.cursor = 'pointer';
                bsDiv.onclick = (e) => { e.stopPropagation(); openSettingsModal(); };
                if (memberTornStatsData === 'LOADING' || memberFFScouterData === 'LOADING') { bsDiv.classList.add('loading'); bsDisplayValue = '...'; tooltipHTML = 'Loading...';}
                else if (memberTornStatsData?.status === 'NO_KEY') { bsDiv.classList.add('error'); bsDisplayValue = 'TS KEY?'; tooltipHTML = 'TornStats API Key missing. Click to configure.'; }
                else if (FFSCOUTER_ENABLED && memberFFScouterData?.status === 'NO_KEY') { bsDiv.classList.add('error'); bsDisplayValue = 'FF KEY?'; tooltipHTML = 'FFScouter key missing. Click to configure.'; }
                else if (memberTornStatsData?.status === 'INVALID_KEY') { bsDiv.classList.add('error'); bsDisplayValue = 'TS BAD?'; tooltipHTML = 'Invalid TornStats API Key. Click to configure.'; }
                else if (FFSCOUTER_ENABLED && memberFFScouterData?.status === 'INVALID_KEY') { bsDiv.classList.add('error'); bsDisplayValue = 'FF BAD?'; tooltipHTML = 'Invalid FFScouter API Key. Click to configure.'; }
                else if (memberTornStatsData?.error) { bsDiv.classList.add('error'); bsDisplayValue = 'TS ERR'; tooltipHTML = `TornStats Error: ${memberTornStatsData.error}`; }
                else if (FFSCOUTER_ENABLED && memberFFScouterData?.error) { bsDiv.classList.add('error'); bsDisplayValue = 'FF ERR'; tooltipHTML = `FFScouter Error: ${memberFFScouterData.error}`; }
                else { tooltipHTML = 'No data. Click to configure APIs.'; }
            }

            // Color coding based on FF
            const ffValue = parseFloat(memberLi.dataset.ffValue);
            bsDiv.classList.remove('bs-ff-green', 'bs-ff-yellow', 'bs-ff-red');
            if (!isNaN(ffValue)) {
                if (ffValue >= 2.5 && ffValue < 5.0) {
                    bsDiv.classList.add('bs-ff-green');
                } else if (ffValue >= 0 && ffValue < 2.5) {
                    bsDiv.classList.add('bs-ff-yellow');
                } else if (ffValue >= 5.0) {
                    bsDiv.classList.add('bs-ff-red');
                }
            }


            bsDiv.textContent = bsDisplayValue;
            bsDiv.title = tooltipHTML;
            memberLi.dataset.bsValue = bsDisplayValue;
        }


        // Status Column
        if (!statusDiv) {
             statusDiv = document.createElement('div');
             // Status alignment adjustment: Needs 'left' class on territory war AND ranked/old war, but not on profile
             statusDiv.className = (currentPageType === 'territory_war' || currentPageType === 'ranked_war' || currentPageType === 'faction_war_old') ? 'status left' : 'status';
             const insertBefore = sel.attack ? memberLi.querySelector(sel.attack) : null;
             const insertAfter = bsDiv || (sel.pos ? memberLi.querySelector(sel.pos) : null) || (sel.days ? memberLi.querySelector(sel.days) : null);
             if(insertBefore) insertBefore.parentNode.insertBefore(statusDiv, insertBefore);
             else if(insertAfter) insertAfter.parentNode.insertBefore(statusDiv, insertAfter.nextSibling);
             else memberLi.appendChild(statusDiv);
             // if (DEBUG) console.log(`Torn War Helper [DEBUG]: Created Status div for ${userId}`);
        }

        // Check for our wrapper. If it doesn't exist, this is the first run for this element, so we clear the original content.
        let wrapper = statusDiv.querySelector('.status-content-wrapper');
        if (!wrapper) {
            statusDiv.innerHTML = '';
            wrapper = document.createElement('div');
            wrapper.className = 'status-content-wrapper';
            statusDiv.appendChild(wrapper);
        }
        const statusTextSpan = getOrCreateElement(wrapper, '.original-status-text', 'span', 'original-status-text');
        const lastActionSpan = getOrCreateElement(wrapper, '.last-action-info', 'span', 'last-action-info');


        const previousState = memberLi.dataset.apiStatusState;
        const statusData = memberApiData.status;
        let finalStatus = statusData?.state || 'Unknown';
        let hospitalTimestamp = (finalStatus === 'Hospital' && statusData?.until) ? statusData.until : 0;
        if (hospTime[userId] !== undefined) {
             const now = Math.floor(Date.now() / 1000);
             if (hospTime[userId] > now) { finalStatus = 'Hospital'; hospitalTimestamp = hospTime[userId]; }
             else if (finalStatus === 'Hospital') { finalStatus = 'Okay'; hospitalTimestamp = 0; }
        }
        memberLi.dataset.apiStatusState = finalStatus;

        if (finalStatus === 'Hospital' && hospitalTimestamp > 0) {
            const remaining = Math.max(0, hospitalTimestamp - Math.floor(Date.now() / 1000));
            memberLi.dataset.hospitalTimestamp = hospitalTimestamp;
            memberLi.dataset.hospitalRemaining = remaining;
            statusTextSpan.classList.add('is-hospital');
            let timerSpan = getOrCreateElement(wrapper, '.hospital-timer', 'span', 'hospital-timer');
            timerSpan.textContent = formatTime(remaining);
            timerSpan.classList.remove('timer-finished');
            timerSpan.style.display = 'block';
        } else {
            let displayText = (finalStatus === 'Okay') ? 'Okay' : statusData?.description || 'Unknown';
            if (finalStatus === 'Traveling' && statusData?.description) {
                const description = statusData.description;
                if (description.startsWith('Traveling to ')) {
                    const country = description.substring('Traveling to '.length);
                    displayText = `🛫 ${abbreviateCountry(country)}`;
                } else if (description.startsWith('Returning to Torn')) {
                    displayText = '🛬 Torn';
                }
            } else if (finalStatus === 'Abroad' && statusData?.description) {
                displayText = `🌍 ${abbreviateCountry(statusData.description)}`;
            }
            statusTextSpan.textContent = displayText;
            statusTextSpan.classList.remove('is-hospital');
            let timerSpan = wrapper.querySelector('.hospital-timer');
            if (timerSpan) timerSpan.style.display = 'none';
        }

        if (memberApiData.last_action?.relative) {
            lastActionSpan.textContent = memberApiData.last_action.relative;
            lastActionSpan.style.display = 'block';
        } else {
            lastActionSpan.style.display = 'none';
        }

        return finalStatus !== previousState;
    }

    /** Sorts the member list. */
    function sortMemberList(memberListUl, isEnemyList) {
        if (!memberListUl || !document.body.contains(memberListUl)) return;

        // Determine list item selector based on refined page types
        let listItemSelector = '.table-body .table-row'; // Default for profile
        if (currentPageType === 'territory_war') listItemSelector = 'li.memberRowWp___cr9pQ';
        else if (currentPageType === 'ranked_war' || currentPageType === 'faction_war_old') listItemSelector = isEnemyList ? 'li.enemy' : 'li.your';

        const members = Array.from(memberListUl.querySelectorAll(listItemSelector));
        if (members.length === 0) return;

        const getStatusPriority = (s) => ({'okay':0, 'hospital':1, 'traveling':2, 'abroad':2, 'jail':2, 'fallen':3}[s?.toLowerCase()] ?? 2);

        const getFFPriority = (ff) => {
            if (ff >= 2.5 && ff < 5.0) return 0; // Green, optimal
            if (ff >= 0 && ff < 2.5) return 1; // Yellow, less optimal
            if (ff >= 5.0) return 2; // Red, not optimal
            return 3; // No data
        };


        members.sort((a, b) => {
            if (currentPageType === 'territory_war') {
                if (a.classList.contains('join') && !b.classList.contains('join')) return 1;
                if (!a.classList.contains('join') && b.classList.contains('join')) return -1;
            }
            const stateA = a.dataset.apiStatusState, stateB = b.dataset.apiStatusState;
            const priorityA = getStatusPriority(stateA), priorityB = getStatusPriority(stateB);
            if (priorityA !== priorityB) return priorityA - priorityB;

            // If statuses are the same, sort within the group
            if (stateA === 'Hospital') return (a.dataset.hospitalRemaining || 0) - (b.dataset.hospitalRemaining || 0);

            if (stateA === 'Okay') {
                if (SORTING_PREFERENCE === 'fair_fight') {
                    const ffA = parseFloat(a.dataset.ffValue || '-1');
                    const ffB = parseFloat(b.dataset.ffValue || '-1');
                    const ffPriorityA = getFFPriority(ffA);
                    const ffPriorityB = getFFPriority(ffB);

                    if (ffPriorityA !== ffPriorityB) {
                        return ffPriorityA - ffPriorityB;
                    }

                    switch(ffPriorityA) {
                        case 0: return ffB - ffA; // Optimal, sort highest first
                        case 1: return ffB - ffA; // Sub-optimal, sort highest first
                        case 2: return ffA - ffB; // Avoid, sort lowest first
                        default: // Fallback for no FF data
                             const bsA = parseFormattedNumber(a.dataset.bsValue || '-');
                             const bsB = parseFormattedNumber(b.dataset.bsValue || '-');
                             if(bsA !== bsB) return bsA - bsB;
                             return 0;
                    }
                } else { // Default sorting
                    const bsA = parseFormattedNumber(a.dataset.bsValue || '-');
                    const bsB = parseFormattedNumber(b.dataset.bsValue || '-');
                    if (bsA !== -1 && bsB !== -1 && bsA !== bsB) return bsA - bsB;
                    if (bsA !== -1 && bsB === -1) return -1;
                    if (bsA === -1 && bsB !== -1) return 1;
                }
            }
            return 0; // Fallback for other statuses
        });
        members.forEach(m => memberListUl.appendChild(m));
    }


    /** Processes member list using provided data. */
    function processFactionListFromData(tornMembersData, factionTornStatsData, factionFFScouterData, memberListUl, memberLiMap, isInitialLoad = false, isEnemyList = false) {
        if (!tornMembersData || !Array.isArray(tornMembersData) || !memberListUl) return;

        // Find header relative to the UL more robustly
        let headerRow = null;
        if (currentPageType === 'ranked_war' || currentPageType === 'faction_war_old') {
            // Find the <ul>, go up to .members-cont, find the .white-grad sibling
            headerRow = memberListUl.previousElementSibling;
            if (headerRow && !headerRow.classList.contains('white-grad')) headerRow = null; // Basic check
        } else if (currentPageType === 'profile_page') {
             headerRow = memberListUl.closest('.table-body')?.previousElementSibling;
        } else if (currentPageType === 'territory_war') {
             headerRow = memberListUl.closest('.tab-menu-cont')?.querySelector('.title.white-grad');
        }

        if(DEBUG && !headerRow) console.log(`Torn War Helper [DEBUG]: Could not find headerRow in processFactionListFromData for page type ${currentPageType}.`);
        else if (DEBUG) console.log(`Torn War Helper [DEBUG]: Found headerRow for ensuring columns:`, headerRow);


        ensureColumnsAndHeaders(headerRow); // Ensure headers exist before processing rows
        let sortNeeded = false;
        tornMembersData.forEach(memberApiData => {
            const userId = memberApiData?.id?.toString();
            const memberLi = memberLiMap.get(userId);
            if (memberLi) {
                const userTornStatsData = factionTornStatsData?.[userId] || factionTornStatsData;
                const userFFScouterData = factionFFScouterData?.[userId] || factionFFScouterData;
                const stateChanged = processMemberWithData(memberLi, memberApiData, userTornStatsData, userFFScouterData);
                if (stateChanged && !isInitialLoad) sortNeeded = true;
            }
        });
        if (sortNeeded || isInitialLoad) sortMemberList(memberListUl, isEnemyList);
        startLiveTimerInterval(memberListUl, isEnemyList);
    }

    /** Main processing function. */
    async function processFactionList(isRefresh = false, forceResort = false) {
        if (isProcessing && !isRefresh) return;
        isProcessing = true;
        if (DEBUG) console.log("Torn War Helper [DEBUG]: processFactionList START");

        // --- Variable Declarations ---
        let enemyListSelector, yourListSelector, potentialPageType;
        let enemyLinkSelector, yourLinkSelector;
        let detectedProfileId = null; // Initialize here
        let detectedEnemyFactionId = null; // Initialize here
        let detectedYourFactionId = null; // Initialize here
        const url = window.location.href, hash = window.location.hash;
        const hasWarList = document.getElementById('faction_war_list_id'); // Check if the new war list exists
        // --- End Variable Declarations ---


        // --- Page Type and Selector Logic ---
        if (url.includes('step=profile&ID=')) {
            potentialPageType = 'profile_page';
            detectedProfileId = url.match(/step=profile&ID=(\d+)/)?.[1];
            enemyListSelector = '.members-list .table-body';
            yourListSelector = null; // No 'your' list on profile pages
            enemyLinkSelector = null; // ID comes from URL
            yourLinkSelector = null;
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: Page type detected: 'profile_page'. Faction ID: ${detectedProfileId}`);
        } else if (url.includes('step=your')) {
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: Checking hash: '${hash}' and hasWarList: ${!!hasWarList}`); // MODIFIED DEBUGGING

            if (hasWarList) {
                // New War UI (Ranked or Territory)
                if (hash.includes('/war/rank')) {
                    potentialPageType = 'ranked_war';
                    const activeWarItemSelector = '#faction_war_list_id li.active___SyFLN'; // Selector for the active war SUMMARY item
                    const descriptionSelector = '#faction_war_list_id li.descriptions'; // Selector for the EXPANDED details item
                    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Page type detected: 'ranked_war'`);
                    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Using 'ranked_war' selectors targeting li.descriptions.`);
                    // Selectors target elements *within* the expanded description list item
                    enemyListSelector = `${descriptionSelector} .enemy-faction .members-cont ul.members-list`;
                    yourListSelector = `${descriptionSelector} .your-faction .members-cont ul.members-list`;
                    enemyLinkSelector = `${activeWarItemSelector} a.opponentFactionName___vhESM[href*="ID="]`; // Get ID from the summary item
                    yourLinkSelector = `${activeWarItemSelector} a.currentFactionName___eq7n8[href*="ID="]`; // Get ID from the summary item
                } else if (hash.includes('/war/')) {
                    potentialPageType = 'territory_war';
                    const descriptionSelector = '#faction_war_list_id li.descriptions'; // Selector for the EXPANDED details item
                    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Page type detected: 'territory_war'`);
                    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Using 'territory_war' selectors targeting li.descriptions.`);
                    enemyListSelector = `${descriptionSelector} .faction-war .tab-menu-cont.enemy ul.members-list`;
                    yourListSelector = `${descriptionSelector} .faction-war .tab-menu-cont.your ul.members-list`;
                    enemyLinkSelector = `${descriptionSelector} .opponentFactionName___vhESM[href*="ID="]`; // Get ID from the description item
                    yourLinkSelector = `${descriptionSelector} .currentFactionName___eq7n8[href*="ID="]`; // Get ID from the description item
                } else {
                    // On new war UI, but no specific war hash (e.g., just '#/')
                    // This is the list view, NOT old wall.
                    potentialPageType = 'war_list_page'; // Give it a distinct type
                    if (DEBUG) console.log(`Torn War Helper [DEBUG]: Page type detected: 'war_list_page' (New war UI, no war selected)`);
                    // We don't want to run the script here, so we'll set selectors to null
                    enemyListSelector = null;
                    yourListSelector = null;
                }
            } else {
                // No hasWarList, this is the old wall view
                potentialPageType = 'faction_war_old';
                if (DEBUG) console.log(`Torn War Helper [DEBUG]: Page type detected: 'faction_war_old' (old wall view)`);
                if (DEBUG) console.log(`Torn War Helper [DEBUG]: Using 'faction_war_old' selectors.`);
                enemyListSelector = '.enemy-faction .members-cont ul.members-list';
                yourListSelector = '.your-faction .members-cont ul.members-list';
                enemyLinkSelector = '.faction-names .enemy a[href*="ID="]'; // Top-level faction names
                yourLinkSelector = '.faction-names .your a[href*="ID="]'; // Top-level faction names
            }
        } else {
            if (DEBUG) console.log("Torn War Helper [DEBUG]: Not a recognized page. Exiting.");
            isProcessing = false;
            return;
        }

        // --- Apply/Remove Body Class for Width Adjustment ---
        if (potentialPageType === 'profile_page' || potentialPageType === 'ranked_war' || potentialPageType === 'faction_war_old') {
            document.body.classList.add('war-helper-expanded-view');
            if (DEBUG) console.log("Torn War Helper [DEBUG]: Added body class for expanded view.");
        } else {
            document.body.classList.remove('war-helper-expanded-view');
            if (DEBUG) console.log("Torn War Helper [DEBUG]: Removed body class for expanded view.");
        }
        // --- End Body Class Logic ---

        // --- Apply Page-Specific Body Class ---
        // Remove any existing page type classes
        if (DEBUG) console.log(`Torn War Helper [DEBUG]: Removing old page type classes...`);
        document.body.classList.remove('war-helper-page-type-profile_page', 'war-helper-page-type-ranked_war', 'war-helper-page-type-territory_war', 'war-helper-page-type-faction_war_old', 'war-helper-page-type-war_list_page'); // Added new type
        // Add the current page type class
        if (potentialPageType) {
            document.body.classList.add(`war-helper-page-type-${potentialPageType}`);
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: Added body class for page type: war-helper-page-type-${potentialPageType}`);
        }
        // --- End Page-Specific Body Class ---


        // --- Find Member Lists ---
        const enemyMemberListUl = enemyListSelector ? document.querySelector(enemyListSelector) : null; // Added check
        const yourMemberListUl = yourListSelector ? document.querySelector(yourListSelector) : null;

        if (!enemyMemberListUl) {
            if (DEBUG) console.log("Torn War Helper [DEBUG]: Could not find enemy member list UL (or page type doesn't have one). Exiting.", enemyListSelector);
            isProcessing = false;
            return;
        }
        if (DEBUG) console.log("Torn War Helper [DEBUG]: Found enemy member list UL.", enemyMemberListUl);
        if (yourListSelector) {
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: ${yourMemberListUl ? 'Found' : 'Could not find'} your member list UL.`, yourListSelector);
        }
        // --- End Find Member Lists ---


        // Inject settings button (More robust header finding)
        let header = null;
        if (enemyMemberListUl) {
            if (potentialPageType === 'profile_page') {
                 header = enemyMemberListUl.closest('.table-body')?.previousElementSibling;
            } else if (potentialPageType === 'ranked_war' || potentialPageType === 'faction_war_old') {
                 header = enemyMemberListUl.previousElementSibling; // The .white-grad element
            } else if (potentialPageType === 'territory_war') {
                 header = enemyMemberListUl.closest('.tab-menu-cont')?.querySelector('.title.white-grad');
            }
            if (header && !(header.classList.contains('white-grad') || header.classList.contains('table-header'))) header = null; // Check it's a header
        }

        if (header && !header.querySelector('.war-helper-settings-btn')) {
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'war-helper-settings-btn';
            settingsBtn.innerHTML = '&#9881;'; // Gear icon
            settingsBtn.title = 'War Helper Settings';
            settingsBtn.onclick = openSettingsModal;
            header.style.position = 'relative'; // Ensure parent is relative
            header.appendChild(settingsBtn);
            if (DEBUG) console.log("Torn War Helper [DEBUG]: Settings button injected into:", header);
        } else if (DEBUG && header && header.querySelector('.war-helper-settings-btn')) {
             if (DEBUG) console.log("Torn War Helper [DEBUG]: Settings button already exists.");
        } else if (DEBUG && !header) {
             console.log("Torn War Helper [DEBUG]: Could not find a suitable header to inject settings button.");
        }

        // --- Detect Faction IDs ---
        // Initialize with profile ID if available, otherwise start as null
        detectedEnemyFactionId = detectedProfileId;

        if (!detectedEnemyFactionId && enemyLinkSelector) {
             const enemyLink = document.querySelector(enemyLinkSelector);
             if(enemyLink) {
                 detectedEnemyFactionId = enemyLink.href.match(/ID=(\d+)/)?.[1];
                 if (DEBUG) console.log(`Torn War Helper [DEBUG]: Detected Enemy Faction ID using selector "${enemyLinkSelector}": ${detectedEnemyFactionId}`);
             } else if (DEBUG) {
                 console.log(`Torn War Helper [DEBUG]: Failed to find enemy link using selector "${enemyLinkSelector}"`);
             }
        }

        if(yourLinkSelector) { // Check if we should even look for 'your' faction ID
            const yourNameLink = document.querySelector(yourLinkSelector);
            if(yourNameLink) {
                detectedYourFactionId = yourNameLink.href.match(/ID=(\d+)/)?.[1];
                if (DEBUG) console.log(`Torn War Helper [DEBUG]: Detected Your Faction ID using selector "${yourLinkSelector}": ${detectedYourFactionId}`);
            } else if (DEBUG) {
                 console.log(`Torn War Helper [DEBUG]: Failed to find your link using selector "${yourLinkSelector}"`);
            }
        }
        // --- End Detect Faction IDs ---


        // --- Check if Faction ID was found ---
        if (!detectedEnemyFactionId) {
            if (DEBUG) console.log("Torn War Helper [DEBUG]: Could not detect Enemy Faction ID. Exiting.");
            isProcessing = false;
            return;
        }
        // --- End Check ---


        // Check if context changed (initial load or page type/faction change)
        let isInitialLoad = false;
        if (currentEnemyFactionId !== detectedEnemyFactionId || currentYourFactionId !== detectedYourFactionId || currentPageType !== potentialPageType) {
            currentEnemyFactionId = detectedEnemyFactionId;
            currentYourFactionId = detectedYourFactionId;
            currentPageType = potentialPageType; // Update the global page type
            isInitialLoad = true;
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: Initial load or context change detected. Page: ${currentPageType}, Enemy: ${currentEnemyFactionId}, Your: ${currentYourFactionId}`);
        }

        // Map current members in the list
        const enemyMemberLiMap = new Map();
        enemyMemberListUl.querySelectorAll('li.enemy, li.memberRowWp___cr9pQ, .table-row').forEach(li => { // More general selector for rows
            const link = li.querySelector('a[href*="XID="]');
            const id = link?.href.match(/XID=(\d+)/)?.[1];
            if (id) enemyMemberLiMap.set(id, li);
        });
        if (DEBUG) console.log(`Torn War Helper [DEBUG]: Mapped ${enemyMemberLiMap.size} enemy members.`);

        const yourMemberLiMap = new Map();
        if(yourMemberListUl){
             yourMemberListUl.querySelectorAll('li.your, li.memberRowWp___cr9pQ, .table-row').forEach(li => { // More general selector for rows
                const link = li.querySelector('a[href*="XID="]');
                const id = link?.href.match(/XID=(\d+)/)?.[1];
                if (id) yourMemberLiMap.set(id, li);
            });
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: Mapped ${yourMemberLiMap.size} your members.`);
        }


        // Fetch and process data
        try {
            const promises = [
                fetchFactionData(currentEnemyFactionId, 'Enemy'),
                fetchTornStatsData(currentEnemyFactionId, 'Enemy')
            ];

            if (currentYourFactionId) { // Only fetch 'your' data if an ID was found
                promises.push(fetchFactionData(currentYourFactionId, 'Your'));
                promises.push(fetchTornStatsData(currentYourFactionId, 'Your'));
            } else {
                 if (DEBUG && yourListSelector) console.log("Torn War Helper [DEBUG]: 'Your' Faction ID not detected, skipping API calls for 'Your' faction.");
            }

            const results = await Promise.all(promises);
            const enemyTornMembers = results[0];
            const enemyTornStats = results[1];
            // Adjust indices based on whether 'your' data was fetched
            const yourTornMembers = currentYourFactionId ? results[2] : [];
            const yourTornStats = currentYourFactionId ? results[3] : {};


            let enemyFFScouterTargets = [];
            if (FFSCOUTER_ENABLED && Array.isArray(enemyTornMembers)) {
                enemyTornMembers.forEach(member => {
                   if(member?.id) enemyFFScouterTargets.push(member.id.toString());
                });
            }
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: Fetching FFScouter for ${enemyFFScouterTargets.length} enemies.`);
            const enemyFFScouterData = await fetchFFScouterDataBatch(enemyFFScouterTargets, 'Enemy');
            if (DEBUG && Array.isArray(enemyTornMembers)) console.log(`Torn War Helper [DEBUG]: Processing ${enemyTornMembers.length} enemy members from API.`);
            processFactionListFromData(enemyTornMembers, enemyTornStats, enemyFFScouterData, enemyMemberListUl, enemyMemberLiMap, isInitialLoad || forceResort, true);

            if(currentYourFactionId && yourMemberListUl) {
                 let yourFFScouterTargets = [];
                 if (FFSCOUTER_ENABLED && Array.isArray(yourTornMembers)) {
                     yourTornMembers.forEach(member => {
                         if(member?.id) yourFFScouterTargets.push(member.id.toString());
                     });
                 }
                if (DEBUG) console.log(`Torn War Helper [DEBUG]: Fetching FFScouter for ${yourFFScouterTargets.length} your members.`);
                const yourFFScouterData = await fetchFFScouterDataBatch(yourFFScouterTargets, 'Your');
                if (DEBUG && Array.isArray(yourTornMembers)) console.log(`Torn War Helper [DEBUG]: Processing ${yourTornMembers.length} your members from API.`);
                processFactionListFromData(yourTornMembers, yourTornStats, yourFFScouterData, yourMemberListUl, yourMemberLiMap, isInitialLoad || forceResort, false);
            }


        } catch (error) {
            console.error("War Helper: Main processing failed.", error);
            // Add API error indicators if specific API failed
             if (error?.type === 'torn') {
                 [...enemyMemberLiMap.values(), ...yourMemberLiMap.values()].forEach(li => {
                     // Determine correct status div selector based on current page type
                     let statusSelector = '.status';
                     if (currentPageType === 'profile_page') statusSelector = '.table-cell.status';
                     else if (currentPageType === 'territory_war' || currentPageType === 'ranked_war' || currentPageType === 'faction_war_old') statusSelector = '.status.left';

                     const statusDiv = li.querySelector(statusSelector);
                     if (statusDiv && !statusDiv.querySelector('.api-error-indicator')) {
                         const errorSpan = document.createElement('span');
                         errorSpan.className = 'api-error-indicator';
                         errorSpan.textContent = ' T!'; // Add space
                         errorSpan.title = `Torn API Error: ${error.error} (Code: ${error.code})`;
                         // Append error indicator within the status content wrapper if possible
                         const wrapper = statusDiv.querySelector('.status-content-wrapper') || statusDiv;
                         wrapper.appendChild(errorSpan);
                     }
                 });
             } // Add similar blocks for tornstats/ffscouter if needed
        } finally {
            isProcessing = false;
            if (DEBUG) console.log("Torn War Helper [DEBUG]: processFactionList END");
        }
    }

    /** Updates timers every second. */
    function updateLiveTimers(memberListUl) {
        if (!memberListUl || !document.body.contains(memberListUl)) return;
        let resortNeeded = false;
        memberListUl.querySelectorAll('[data-hospital-timestamp]').forEach(li => {
            const end = parseInt(li.dataset.hospitalTimestamp, 10);
            const remaining = Math.max(0, end - Math.floor(Date.now() / 1000));
            li.dataset.hospitalRemaining = remaining;
            const timerSpan = li.querySelector('.hospital-timer');
            if (timerSpan) {
                if (remaining <= 0 && !timerSpan.classList.contains('timer-finished')) {
                    timerSpan.textContent = "Okay";
                    timerSpan.classList.add('timer-finished');
                     // Update status text directly if timer finishes
                    const statusTextSpan = li.querySelector('.original-status-text');
                    if (statusTextSpan) {
                         statusTextSpan.textContent = 'Okay';
                         statusTextSpan.classList.remove('is-hospital');
                    }
                    timerSpan.style.display = 'none'; // Hide timer
                    li.dataset.apiStatusState = 'Okay'; // Update state for sorting
                    resortNeeded = true;
                } else if (remaining > 0) {
                    timerSpan.textContent = formatTime(remaining);
                }
            }
        });
        if (resortNeeded) sortMemberList(memberListUl, memberListUl.closest('.enemy-faction')); // Use closest to determine enemy/your
    }

    // Interval Management
    function startLiveTimerInterval(ul, isEnemy) {
        // Use a more unique ID based on parent structure if possible
        const parentCont = ul.closest('.tab-menu-cont, .members-list');
        const listSide = isEnemy ? 'enemy' : 'your';
        // Try to generate a unique ID based on classes or fall back to simple side
        let idBase = ul.className.split(' ')[0]; // Use first class of UL
        if (parentCont) {
            idBase = parentCont.className.split(' ')[0]; // Use first class of parent container
        }
        const id = `${idBase}_${listSide}`;

        ul.dataset.listId = id;
        stopLiveTimerInterval(id);
         if (DEBUG) console.log(`Torn War Helper [DEBUG]: Starting live timer interval with ID: ${id}`);
        const intervalId = setInterval(() => updateLiveTimers(ul), 1000);
        liveTimerIntervals.set(id, intervalId);
    }
    function stopLiveTimerInterval(id) {
        if (liveTimerIntervals.has(id)) {
            if (DEBUG) console.log(`Torn War Helper [DEBUG]: Stopping live timer interval with ID: ${id}`);
            clearInterval(liveTimerIntervals.get(id));
            liveTimerIntervals.delete(id);
        }
     }
    function stopAllIntervals() {
        if (DEBUG) console.log(`Torn War Helper [DEBUG]: Stopping ALL intervals.`);
        liveTimerIntervals.forEach(clearInterval);
        liveTimerIntervals.clear();
        if(refreshApiIntervalId) {
            clearInterval(refreshApiIntervalId);
            refreshApiIntervalId = null;
        }
     }

    // Debounced Processing Trigger
    let processTimeoutId = null;
    function scheduleProcessFactionList(debounceMs = 300, isRefresh = false, forceResort = false) {
        clearTimeout(processTimeoutId);
        processTimeoutId = setTimeout(() => processFactionList(isRefresh, forceResort), debounceMs);
    }

    // Main Observer
    const mainObserver = new MutationObserver((mutations) => {
         // Optionally check mutations here to be more specific, but debouncing helps
         scheduleProcessFactionList();
    });
    const targetNode = document.getElementById('factions') || document.body;
    mainObserver.observe(targetNode, { childList: true, subtree: true });
    window.addEventListener('hashchange', () => {
        if (DEBUG) console.log("Torn War Helper [DEBUG]: Hash changed, scheduling process.");
        // Clear old intervals immediately on hash change to prevent multiple timers running
        stopAllIntervals();
        scheduleProcessFactionList(100, false, true); // Force resort on hash change
    });

    // Real-time event interception
    try {
        const origFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async (...args) => {
            const url = args[0]?.url || args[0] || '';
            const res = await origFetch(...args);
            // Added check for ranked war specific endpoint
            if (url.includes("step=getwarusers") || url.includes("step=getProcessBarRefreshData") || url.includes("step=rankedwarreport")) {
                const clone = res.clone();
                clone.json().then(json => {
                    // Adapt to different structures: warDesc, userStatuses, rankedWarReport.users
                    const members = json?.warDesc?.members || json?.userStatuses || json?.rankedWarReport?.users;
                    if (members) {
                         if (DEBUG) console.log(`Torn War Helper [DEBUG]: Intercepted member data from ${url}`);
                        Object.entries(members).forEach(([id, data]) => {
                            const status = data.status || data; // userStatuses uses root object, warDesc has status object, rankedWarReport.users has status object
                            const userId = data.userID || id; // warDesc uses userID, others use key/id
                            // Extract timestamp correctly based on structure
                            let timestamp = 0;
                            if (status.text === "Hospital" || status.state === "Hospital") { // rankedWarReport uses state
                                timestamp = status.updateAt || status.until; // warDesc uses updateAt, API uses until
                            }
                            hospTime[userId] = timestamp;
                        });
                        scheduleProcessFactionList(50);
                    }
                }).catch(e => console.error(`Torn War Helper [DEBUG]: Error parsing intercepted JSON from ${url}`, e));
            }
            return res;
        };
        const origWebSocket = unsafeWindow.WebSocket;
        unsafeWindow.WebSocket = function(...args) {
            const socket = new origWebSocket(...args);
            socket.addEventListener('message', (event) => {
                const json = JSONparse(event.data);
                const update = json?.push?.pub?.data?.message?.namespaces?.users?.actions?.updateStatus;
                if (update?.status) {
                    hospTime[update.userId] = update.status.text === "Hospital" ? update.status.updateAt : 0;
                    scheduleProcessFactionList(50);
                }
            });
            return socket;
        };
         if (DEBUG) console.log("Torn War Helper [DEBUG]: Fetch & WebSocket interceptors set up.");
    } catch (e) { console.error("War Helper: Failed to set up interceptors.", e); }

    // Initial run after a delay
    scheduleProcessFactionList(1500, false, true); // Force resort on initial load
})();

