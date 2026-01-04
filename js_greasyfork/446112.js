// ==UserScript==
// @name         Camamba Forums Search Library
// @namespace    hoehleg.userscripts.private
// @version      0.0.3
// @description  fetches forums, threads and posts
// @author       Gerrit Höhle
// @license MIT
//
// @require      https://greasyfork.org/scripts/405144-httprequest/code/HttpRequest.js?version=1060129
//
// @grant        GM_xmlhttpRequest
//
// ==/UserScript==

/* jslint esversion: 9 */

/**
 * @typedef ForumDef
 * @property {number} id
 * @property {string} lng
 * @property {string} title
 */

/** 
 * @typedef ThreadDef
 * @property {string} title
 * @property {number} id 
 * @property {number} forumId
 * @property {number} postCount
 */

/** 
 * @typedef PostDef
 * @property {number} forumId
 * @property {number} threadId
 * @property {number} page
 * @property {number} id 
 * @property {Date} postDate
 * @property {string} text 
 * @property {string} uname 
 * @property {number} uid 
 */

/**
 * @typedef ThreadIdentifier
 * @property {number} forumId
 * @property {number} threadId
 */

class Post {
    /**
     * @param {PostDef} param0 
     */
    constructor({ forumId, threadId, page, id, postDate, text, uname, uid }) {
        /** @type {number} */
        this.forumId = forumId;
        /** @type {number} */
        this.threadId = threadId;
        /** @type {number} */
        this.page = page;
        /** @type {number} */
        this.id = id;
        /** @type {Date} */
        this.postDate = postDate;
        /** @type {string} */
        this.text = text;
        /** @type {string} */
        this.uname = uname;
        /** @type {number} */
        this.uid = uid;
    }

    async delete() {
        return await HttpRequest.send({
            method: 'GET', url: "https://www.camamba.com/forum_view.php", params: {
                thread: this.threadId,
                forum: this.forumId,
                delete: this.id,
                page: this.page,
            }
        });
    }
}

class Thread {

    /**
     * @param {ThreadDef} param0 
     */
    constructor({ title, id, forumId, postCount }) {
        /** @type {string} */
        this.title = title;
        /** @type {number} */
        this.id = id;
        /** @type {number} */
        this.forumId = forumId;
        /** @type {number} */
        this.postCount = postCount;
    }

    /**
     * @returns {Promise<Array<Post>>}
     */
    async getPosts(resultSizeLimit = 0) {
        return Thread.getPosts({ threadId: this.id, forumId: this.forumId, resultSizeLimit });
    }

    async delete() {
        for (const post of await this.getPosts()) {
            post.delete();
        }
    }

    /**
     * @param {ThreadIdentifier} param0 
     * @returns {Promise<Array<Post>>}
     */
    static async getPosts({ threadId, forumId, resultSizeLimit = 0 }) {
        return (await HttpRequestHtml.send({
            url: "https://www.camamba.com/forum_view.php",
            params: {
                thread: threadId,
                forum: forumId,
            },
            pageNr: 1,
            pagesMaxCount: resultSizeLimit ? Math.ceil(resultSizeLimit / 10) : 10000,
            paramsConfiguratorForPageNr: (params, pageNr) => ({ ...params, page: pageNr - 1 }),
            hasNextPage: (res, _req) => res.html.querySelectorAll("td.psmallbox").length >= 30,
            resultTransformer: (res, req) => {

                return [...res.html.querySelectorAll("td.psmallbox")].map(td => {
                    let postId = null, text = "", postDate = null;

                    const div = td.querySelector("div");
                    if (div) {
                        const deleteLink = div.querySelector('a[href^="javascript:deletePost"]');

                        if (deleteLink) {
                            const postIdMatch = /(?<=javascript:deletePost)\d+(?=\(\))/.exec(deleteLink.href);
                            postId = postIdMatch === null ? null : Number.parseInt(postIdMatch[0]);
                        }

                        text = [...div.childNodes]
                            .filter(el => el.tagName !== "SCRIPT")
                            .filter(el => el.tagName !== "A" || (!["javascript:deletePost", "javascript:parent.location", "javascript:var noop="].some(s => el.href.startsWith(s))))
                            .map(el => el.textContent).join("").trim();
                    }

                    let uname = "", uid = null;

                    const tdLeft = td.previousElementSibling;
                    if (tdLeft && [...tdLeft.classList].includes("psmallbox2")) {
                        const linkOpenProfile = tdLeft.querySelector('a[href^="javascript:openProfile("]');
                        if (linkOpenProfile) {
                            const unameMatch = /(?<=javascript:openProfile\(['"])\w+(?=['"]\))/.exec(linkOpenProfile.href);
                            if (unameMatch) {
                                uname = unameMatch[0];
                            }
                        }

                        const imgUserpic = tdLeft.querySelector('img[src^="/userpics"]');
                        if (imgUserpic) {
                            const uidMatch = /(?<=userpics\/)\d+(?=\.s\.jpg)/.exec(imgUserpic.src);
                            if (uidMatch) {
                                uid = uidMatch[0];
                            }
                        }

                        const divDate = tdLeft.querySelector('div.smalltext');
                        if (divDate) {
                            const postDateMatch = /(\d{2}).(\d{2}).(\d{4})\s(\d{1,2}):(\d{2}):(\d{2})/.exec(divDate.innerText.trim());
                            if (postDateMatch) {
                                const day = postDateMatch[1];
                                const month = postDateMatch[2];
                                const year = postDateMatch[3];
                                const hour = postDateMatch[4];
                                const minute = postDateMatch[5];
                                const second = postDateMatch[6];
                                postDate = new Date(year, month - 1, day, hour, minute, second);
                            }
                        }
                    }

                    let page = req.params.page;
                    return { forumId, threadId, page, id: postId, postDate, text, uname, uid };
                }).filter(p => p.id && p.text).map(p => new Post(p));
            },
        })).flat();
    }
}

const Forum = (() => {

    /**
     * @param {number} forumId
     * @param {number} [resultSizeLimit]
     * @returns {HttpRequestHtml}
     */
    const createRequest = (forumId, resultSizeLimit = 0) => new HttpRequestHtml({
        url: "https://www.camamba.com/forum_view.php",
        params: { forum: forumId },
        pageNr: 1,
        pagesMaxCount: resultSizeLimit ? Math.ceil(resultSizeLimit / 10) : 10000,
        paramsConfiguratorForPageNr: (params, pageNr) => ({ ...params, page: pageNr - 1 }),
        hasNextPage: (res, _req) => res.html.querySelectorAll('a[href^="?thread="]').length >= 10,
        resultTransformer: (res, _req) => {
            return [...res.html.querySelectorAll('a[href^="?thread="]')].map(a => {

                const matchThreadId = new RegExp(`(?<=\\?thread=)\\d+(?=&forum=${forumId})`).exec(a.href);
                const threadId = matchThreadId === null ? null : Number.parseInt(matchThreadId[0]);

                let postCount = (() => {

                    let postCountTD = a.parentElement;

                    while (postCountTD !== null && postCountTD.tagName !== 'TD') {
                        postCountTD = postCountTD.parentElement;
                    }

                    for (let i = 0; i < 2 && postCountTD !== null; i++) {
                        postCountTD = postCountTD.nextElementSibling;
                    }

                    if (postCountTD != null) {
                        let postCountMatch = /^\d+$/.exec(postCountTD.innerText.trim());
                        if (postCountMatch && postCountMatch.length) {
                            return Number.parseInt(postCountMatch[0]);
                        }
                    }

                    return 0;
                })();

                return { title: a.innerHTML, id: threadId, forumId, postCount };

            }).filter(t => t.id && t.forumId && t.postCount).map(t => new Thread(t));
        },
    });

    return class Forum {
        /** @param {ForumDef} param0 */
        constructor({ id, lng, title }) {
            /** @type {number} */
            this.id = id;
            /** @type {string} */
            this.lng = lng;
            /** @type {string} */
            this.title = title;
        }

        /**
         * @returns {Promise<Array<Thread>>}
         */
        async getThreads(resultSizeLimit = 0) {
            this.request = createRequest(this.id, resultSizeLimit);
            this.lastResults = (await this.request.send()).flat();
            return this.lastResults;
        }

        /**
         * @returns {Promise<Array<Thread>>}
         */
        async getNextThreads() {
            if (!(this.request && this.lastResults && this.lastResults.length)) {
                return [];
            }
            this.request.pageNr += (this.request.pagesMaxCount);
            return (await this.request.send()).flat();
        }

        /**
         * @param {number} forumId 
         * @returns {Promise<Array<Thread>>}
         */
        static async getThreads(forumId, resultSizeLimit = 0) {
            return (await createRequest(forumId, resultSizeLimit).send()).flat();
        }
    };
})();



const Foren = (() => {

    /**
     * @type {Promise<Array<Forum>>}
     */
    const foren = HttpRequestHtml.send({
        url: 'https://www.camamba.com/forum.php',
        params: { mode: 'all' },
        resultTransformer: (resp, _req) => [...resp.html.querySelectorAll('a[href^="/forum_view"]')].map(a => {

            const idMatch = /(?<=forum=)\d{1,2}$/.exec(a.href);
            const id = idMatch === null ? null : Number.parseInt(idMatch[0]);

            const lngMatch = /(?<=^\[)\D\D(?=\])/g.exec(a.textContent);
            const lng = lngMatch === null ? null : lngMatch[0].toLowerCase();

            const titleMatch = /(?<=^\[\D\D\]\s).+$/.exec(a.textContent);
            const title = titleMatch === null ? null : titleMatch[0];

            return { id, lng, title };

        }).filter(forum => forum.id && forum.lng).map(f => new Forum(f)),
    });

    return {
        /**
        * @returns {Promise<Array<Forum>>}
        */
        getAll: async () => await foren,

        /**
         * @param {string} lng 
         * @returns {Promise<Array<Forum>>}
         */
        byLanguage: async (lng) => (await foren).filter(f => f.lng.toUpperCase() === lng.toUpperCase()),

        /**
         * @param {number} id 
         * @returns {Promise<Forum>}
         */
        byId: async (id) => (await foren).find(f => f.id == id),
    };
})();