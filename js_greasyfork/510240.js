// ==UserScript==
// @name         FMP Fast Match Info
// @description  快速获取比赛信息
// @version      1.6
// @match        https://footballmanagerproject.com/Matches/Match*
// @match        https://www.footballmanagerproject.com/Matches/Match*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/510240/FMP%20Fast%20Match%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/510240/FMP%20Fast%20Match%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        try{
            if (window.LiveMatch && typeof window.LiveMatch.BtnAction === 'function' && typeof window.updateLiveScore === 'function' && ((MTime.NowUtc() >= MTime.End.Utc) || LiveMatch.liveScores || LiveMatch.ajaxResult.matchType==11 || LiveMatch.ajaxResult.matchType==14 || LiveMatch.ajaxResult.matchType==18)) {//友谊赛国家赛特殊情况
                MTime.NowUtc = function () {
                    return MTime.End.Utc + 1000;
                }
                window.LiveMatch.BtnAction('ToEnd');
                updateLiveScore();
                observer.disconnect(); // 成功后断开观察
            }
        }catch(error){
            observer.disconnect(); // 失败后断开观察
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
