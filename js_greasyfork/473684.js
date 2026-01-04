// ==UserScript==
// @name         Anilist Auto Set Start Date
// @namespace    https://anilist.co/
// @version      1.0.0
// @description  Auto set the start date when completing 1 episode/chapter anime/manga
// @author       Mashima
// @match        https://anilist.co/*
// @grant        none
// @license      GPL-3.0-or-later
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473684/Anilist%20Auto%20Set%20Start%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/473684/Anilist%20Auto%20Set%20Start%20Date.meta.js
// ==/UserScript==

function isNull(obj) {
    return obj && (obj?.day || obj?.month || obj?.year);
}

(function () {
    "use strict";
    window.Worker = ((Worker) => {
        return class extends Worker {
            constructor(url, ...args) {
                super(url, ...args);
            }
            get fetch() {
                return this._fetch;
            }
            set fetch(val) {
                this._fetch = function () {
                    const query = arguments[1];
                    if (
                        query ===
                        "mutation($id:Int $mediaId:Int $status:MediaListStatus $score:Float $progress:Int $progressVolumes:Int $repeat:Int $private:Boolean $notes:String $customLists:[String]$hiddenFromStatusLists:Boolean $advancedScores:[Float]$startedAt:FuzzyDateInput $completedAt:FuzzyDateInput){SaveMediaListEntry(id:$id mediaId:$mediaId status:$status score:$score progress:$progress progressVolumes:$progressVolumes repeat:$repeat private:$private notes:$notes customLists:$customLists hiddenFromStatusLists:$hiddenFromStatusLists advancedScores:$advancedScores startedAt:$startedAt completedAt:$completedAt){id mediaId status score advancedScores progress progressVolumes repeat priority private hiddenFromStatusLists customLists notes updatedAt startedAt{year month day}completedAt{year month day}user{id name}media{id title{userPreferred}coverImage{large}type format status episodes volumes chapters averageScore popularity isAdult startDate{year}}}}"
                    ) {
                        const variables = arguments[2];
                        if (variables.status === "COMPLETED") {
                            const vue = document.querySelector(".header-wrap")?.__vue__;
                            const listEntry = vue?.listEntry;
                            const media = vue?.media;
                            if (media?.chapters === 1 || media?.episodes === 1) {
                                if (!variables.startedAt && !isNull(listEntry?.startedAt)) {
                                    if (variables.completedAt) {
                                        variables.startedAt = variables.completedAt;
                                    } else if (isNull(listEntry?.completedAt)) {
                                        variables.startedAt = listEntry?.completedAt;
                                    } else {
                                        const date = new Date();
                                        variables.startedAt = {year: `${date.getFullYear()}`, month: `${date.getMonth() + 1}`.padStart(2,0), day: `${date.getDate()}`.padStart(2,0)};
                                    }
                                }
                            }
                        }
                    }
                    return val.apply(this, arguments);
                };
            }
        };
    })(window.Worker);
})();