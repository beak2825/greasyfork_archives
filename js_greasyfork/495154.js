// ==UserScript==
// @name         CC98 Tools - Politeee
// @version      0.0.1
// @description  Be politeee in CC98.
// @icon         https://www.cc98.org/static/98icon.ico

// @author       ml98
// @namespace    https://www.cc98.org/user/name/ml98
// @license      MIT

// @match        https://www.cc98.org/*
// @match        http://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @match        https://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495154/CC98%20Tools%20-%20Politeee.user.js
// @updateURL https://update.greasyfork.org/scripts/495154/CC98%20Tools%20-%20Politeee.meta.js
// ==/UserScript==


const log = () => {};

const postRegExp = new RegExp("/Topic/\\d+/(hot-)?post");
const isPostAPI = (url) => postRegExp.test(url);

const politeee = async (s) => {
    return await (await fetch("https://goblin.tools/api/Formalizer", {
        "headers": {
            "content-type": "application/json",
        },
        "referrer": "https://goblin.tools/Formalizer",
        "origin": "https://goblin.tools",
        "body": JSON.stringify({
            "Text": s,
            "Conversion": "polite",
            "Spiciness": "5"
        }),
        "method": "POST",
    })).text();
}

const resolve = async (url, data) => {
    if (isPostAPI(url)) {
        log(url);
        log('before', data);
        let contents = await Promise.allSettled(data.map(r => politeee(r.content)));
        contents = contents.map(r => r.status == 'fulfilled' ? {content: r.value} : {});
        data = data.map((r, i) => ({...r, ...contents[i]}));
        log('after', data);
    }
    return data;
};

const origResponseJSON = Response.prototype.json;
Response.prototype.json = function () {
  return origResponseJSON.call(this).then(async (data) => await resolve(this.url, data));
};
