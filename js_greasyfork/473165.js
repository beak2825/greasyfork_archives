// ==UserScript==
// @name         Anilist Full Airing Preview
// @namespace    https://anilist.co/
// @version      1.0.1
// @description  Show full list for anime/manga on home page
// @author       Mashima
// @match        https://anilist.co/*
// @grant        none
// @license      GPL-3.0-or-later
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473165/Anilist%20Full%20Airing%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/473165/Anilist%20Full%20Airing%20Preview.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const previewLimit = null; // Limits how many anime/manga are shown
    // Site default is 40, anything above 50 will load slower because max results per page from api is 50
    // Set to null or undefined to display everything
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
                        "query($userId:Int,$type:MediaType,$perPage:Int){Page(perPage:$perPage){mediaList(userId:$userId,type:$type,status_in:[CURRENT,REPEATING],sort:UPDATED_TIME_DESC){id status score progress progressVolumes media{id type status(version:2)format episodes bannerImage title{userPreferred}coverImage{large}nextAiringEpisode{airingAt timeUntilAiring episode}}}}}"
                    ) {
                        const variables = arguments[2];
                        if (
                            variables.type === "ANIME" &&
                            (variables.perPage === 40 || previewLimit <= 20)
                        ) {
                            delete variables.perPage;
                            variables.page = 1;
                            arguments[1] =
                                "query($userId:Int,$type:MediaType,$page:Int){Page(page:$page){pageInfo{total currentPage lastPage hasNextPage perPage}mediaList(userId:$userId,type:$type,status_in:[CURRENT,REPEATING],sort:UPDATED_TIME_DESC){id status score progress progressVolumes media{id type status(version:2)format episodes bannerImage title{userPreferred}coverImage{large}nextAiringEpisode{airingAt timeUntilAiring episode}}}}}";
                        }
                        if (
                            variables.type === "MANGA" &&
                            (variables.perPage === 40 || previewLimit <= 20)
                        ) {
                            delete variables.perPage;
                            variables.page = 1;
                            arguments[1] =
                                "query($userId:Int,$type:MediaType,$page:Int){Page(page:$page){pageInfo{total currentPage lastPage hasNextPage perPage}mediaList(userId:$userId,type:$type,status_in:[CURRENT,REPEATING],sort:UPDATED_TIME_DESC){id status score progress progressVolumes media{id type status(version:2)format episodes bannerImage title{userPreferred}coverImage{large}nextAiringEpisode{airingAt timeUntilAiring episode}}}}}";
                        }
                        const response = val.apply(this, arguments).then(async (data) => {
                            const entities = data.entities;
                            let pageInfo = entities.page?.[data.result]?.pageInfo;
                            if (pageInfo) {
                                while (pageInfo && pageInfo.hasNextPage) {
                                    variables.page++;
                                    const extraData = await val.apply(this, arguments);
                                    const extraEntities = extraData.entities;
                                    pageInfo = extraEntities.page?.[extraData.result]?.pageInfo;
                                    entities.listEntry = {
                                        ...entities.listEntry,
                                        ...extraEntities.listEntry,
                                    };
                                    entities.media = {
                                        ...entities.media,
                                        ...extraEntities.media,
                                    };
                                    entities.page[data.result].pageData = [
                                        ...entities.page[data.result].pageData,
                                        ...extraEntities.page[extraData.result].pageData,
                                    ];
                                    if (
                                        previewLimit &&
                                        entities.page[data.result].pageData.length > previewLimit
                                    ) {
                                        break;
                                    }
                                }
                                if (previewLimit != null) {
                                    entities.page[data.result].pageData = entities.page[
                                        data.result
                                    ].pageData.slice(0, previewLimit);
                                }
                            }
                            return data;
                        });
                        return response;
                    }
                    return val.apply(this, arguments);
                };
            }
        };
    })(window.Worker);
})();