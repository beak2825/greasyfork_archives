// ==UserScript==
// @name         premint-fetcher
// @namespace    premint
// @version      0.2
// @description  premint fetcer
// @author       fun
// @match        *://www.premint.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=premint.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/445278/premint-fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/445278/premint-fetcher.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
    const taskUrl = "https://defieye.postxiami.space/internal/premint/list?sort=-id&fetched=0&fields=slug,id&limit=3";
    const taskProcessUrl =
    "https://defieye.postxiami.space/internal/premint/update?token=0000001";

    async function loadTask() {
        const req = await fetch(taskUrl);
        return await req.json()
    }

    async function doTask(project)  {
        const { id, slug } = project
        const pageUrl = `https://www.premint.xyz/${slug}/`;
        const req = await fetch(pageUrl);
        const body = await req.text();
        // console.log(body);
        const parseReq = await fetch(taskProcessUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, body }),
        });
        const result = await parseReq.json();
        console.log(result);
    }

    async function fetchAndRun() {
        const projects = await loadTask();
        for (let index = 0; index < projects.length; index++) {
            const project = projects[index];
            try {
                await doTask(project);
            } catch(e) {
                console.log('error', e)
            }
            await new Promise((resolve) => {
                setTimeout(resolve, 10000);
            })
        }
        setTimeout(fetchAndRun, projects.length === 0 ? 60 * 1000 * 5 : 5000);
    }

    fetchAndRun();
})();