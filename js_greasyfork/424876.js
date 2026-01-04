/*jshint esversion: 6, multistr: true */
/* globals waitForKeyElements, OLCore, OnlineligaFriendlyHelper, OnlineligaTrainingsIntense,
   OnlineligaTransferHelper, OnlineligaTrainingHelper, OnlineligaNLZHelper, OnlineligaBaseHelper,
   OnlineligaMatchdayHelper, OnlineligaLineupHelper, OnlineligaOfficeHelper, OnlineligaStadiumHelper */

// ==UserScript==
// @name           Onlineliga Toolbox
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.12.7
// @license        LGPLv3
// @description    Sammlung von Tools for www.onlineliga.de (OFA)
// @author         KnutEdelbert (Unser Ahntracht)
// @match          https://www.onlineliga.de/*
// @match          https://www.onlineliga.at/*
// @match          https://www.onlineliga.ch/*
// @match          https://www.onlineleague.co.uk/*
// @icon           https://www.google.com/s2/favicons?domain=onlineliga.de
// @require        https://greasyfork.org/scripts/439467-oli18n/code/OLi18n.user.js?000202
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js?000704
// @require        https://greasyfork.org/scripts/434618-olsettings/code/OLSettings.user.js?000406
// @require        https://greasyfork.org/scripts/425292-onlineligafriendlyhelper/code/OnlineligaFriendlyHelper.user.js?000401
// @require        https://greasyfork.org/scripts/425296-onlineligatransferhelper/code/OnlineligaTransferHelper.user.js?000301
// @require        https://greasyfork.org/scripts/427987-onlineligamatchdayhelper/code/OnlineligaMatchdayHelper.user.js?000403
// @require        https://greasyfork.org/scripts/425413-onlineligatraininghelper/code/OnlineligaTrainingHelper.user.js?000401
// @require        https://greasyfork.org/scripts/429614-onlineligalineuphelper/code/OnlineligaLineupHelper.user.js?000506
// @require        https://greasyfork.org/scripts/425709-onlineliganlzhelper/code/OnlineligaNLZHelper.user.js?000300
// @require        https://greasyfork.org/scripts/425710-onlineligabasehelper/code/OnlineligaBaseHelper.user.js?000403
// @require        https://greasyfork.org/scripts/426354-onlineligaofficehelper/code/OnlineligaOfficeHelper.user.js?000300
// @require        https://greasyfork.org/scripts/434619-onlineligastadiumhelper/code/OnlineligaStadiumHelper.user.js?000404
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/424876/Onlineliga%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/424876/Onlineliga%20Toolbox.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 11.04.2021 Release
 * 0.2.0 12.04.2021 + OnlineligaTopPlayer
 * 0.3.0 12.04.2021 + TrainingsIntense
 * 0.4.0 25.04.2021 + OnlineligaFriendlyHelper
                    + OnlineligaTransferHelper
                    + OnlineligaTrainingHelper
 * 0.5.0 29.04.2021 + OnlineligaNLZHelper
                    + OnlineligaBaseHelper
                    + OnlineligaTransferHelper - Zusatzinfos
 * 0.5.1 09.05.2021 Hotfix OLCore
 * 0.5.2 09.05.2021 YouthPlayer revelation
 * 0.5.3 24.06.2021 add support for *.at and *.ch
 * 0.5.4 04.07.2021 + OnlineligaMatchdayHelper (replaces OnlineligaTopPlayer)
 * 0.6.0 21.07.2021 + OnlineligaLineupHelper
 * 0.6.1 10.08.2021 + OnlineligaOfficeHelper
 * 0.7.0 05.09.2021 use gitlab as require source
 * 0.8.0 13.10.2021 + OLSettings
 * 0.8.1 27.10.2021 + OnlineligaStadiumHelper
 * 0.9.0 24.01.2021 + OLi18n
 * 0.9.1 07.06.2022 Hotfix new page navigation
 * 0.9.2 19.07.2022 + Match statistics export
                    + Display ranking for matchreport header
                    + Alternative formats for exporting player data
                    + bugfixes
 * 0.9.3 27.07.2022 bugfixes (show wrong matchday, export player from offer)
 * 0.9.4 10.08.2022 copy Transferdata, middle mouse click navigation
 * 0.9.5 16.08.2022 Hotfix for OL Update
 * 0.9.6 19.10.2022 Hotfix for youth player unboxing
 * 0.9.7 29.10.2022 + show Dates for SeasonWeeks for friendlies and transferoffers.
                    + middle mouse click for main navigation
                    + copy transfer data on watchlist/offerlist
 * 0.9.8 02.11.2022 + it Training from Rot
 * 0.9.9 12.12.2022 Hotfix LeagueSchedule
 * 0.10.0 13.01.2023 + save/load ticket prices
                     + saveBar
 * 0.10.1 08.07.2023 Hotfix offer renewal
 * 0.11.0 23.08.2023 + Quicklinks
                     + Link to lineup after training
                     + age on lineup       
                     + icons for bank balance
 * 0.11.1 23.08.2023 + add version to require url to prevent caching
 * 0.12.0 22.11.2024 OL 2.0 Migrations
 * 0.12.1 23.11.2024 OL 2.0 
 * 0.12.2 26.11.2024 OL 2.0 
 * 0.12.3 26.11.2024 OL 2.0 Transferhelper/base/Bugfix
 * 0.12.4 15.12.2024 OL 2.0 NLZ/transfer data
 * 0.12.5 29.12.2024 fixes and OL 2.0 adjustments
 * 0.12.6 30.10.2024 minor fixes (stadium export, opponent preview)
 * 0.12.7 30.10.2024 Hotfix stadium opponent preview
 *********************************************/
(function(){

})();