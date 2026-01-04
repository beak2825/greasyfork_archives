/*jshint esversion: 6, multistr: true */
/* globals waitForKeyElements, OLCore, OnlineligaFriendlyHelper, OnlineligaTrainingsIntense,
   OnlineligaTransferHelper, OnlineligaTrainingHelper, OnlineligaNLZHelper, OnlineligaBaseHelper,
   OnlineligaMatchdayHelper, OnlineligaLineupHelper, OnlineligaOfficeHelper */

// ==UserScript==
// @name           Onlineliga Toolbox (RWK Edition)
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.9.0
// @license        LGPLv3
// @description    Sammlung von Tools for www.onlineliga.de (OFA)
// @author         KnutEdelbert (Unser Ahntracht)
// @match          https://www.onlineliga.de
// @match          https://www.onlineliga.at
// @match          https://www.onlineliga.ch
// @match          https://www.onlineleague.co.uk
// @icon           https://www.google.com/s2/favicons?domain=onlineliga.de
// @require        https://greasyfork.org/scripts/439467-oli18n/code/OLi18n.user.js
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @require        https://greasyfork.org/scripts/434618-olsettings/code/OLSettings.user.js
// @require        https://greasyfork.org/scripts/425292-onlineligafriendlyhelper/code/OnlineligaFriendlyHelper.user.js
// @require        https://greasyfork.org/scripts/425296-onlineligatransferhelper/code/OnlineligaTransferHelper.user.js
// @require        https://greasyfork.org/scripts/427987-onlineligamatchdayhelper/code/OnlineligaMatchdayHelper.user.js
// @require        https://greasyfork.org/scripts/425413-onlineligatraininghelper/code/OnlineligaTrainingHelper.user.js
// @require        https://greasyfork.org/scripts/444356-onlineligalineuphelper-rwk/code/OnlineligaLineupHelper_RWK.user.js
// @require        https://greasyfork.org/scripts/425709-onlineliganlzhelper/code/OnlineligaNLZHelper.user.js
// @require        https://greasyfork.org/scripts/425710-onlineligabasehelper/code/OnlineligaBaseHelper.user.js
// @require        https://greasyfork.org/scripts/426354-onlineligaofficehelper/code/OnlineligaOfficeHelper.user.js
// @require        https://greasyfork.org/scripts/434619-onlineligastadiumhelper/code/OnlineligaStadiumHelper.user.js
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/444357/Onlineliga%20Toolbox%20%28RWK%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444357/Onlineliga%20Toolbox%20%28RWK%20Edition%29.meta.js
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
 *********************************************/
(function(){

})();