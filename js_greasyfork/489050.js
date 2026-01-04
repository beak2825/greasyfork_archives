// ==UserScript==
// @name         CC98 Tools - TreeView
// @version      0.0.1
// @description  View posts in tree view
// @icon         https://www.cc98.org/static/98icon.ico

// @author       ml98
// @namespace    https://www.cc98.org/user/name/ml98
// @license      MIT

// @match        https://www.cc98.org/*
// @match        http://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @match        https://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489050/CC98%20Tools%20-%20TreeView.user.js
// @updateURL https://update.greasyfork.org/scripts/489050/CC98%20Tools%20-%20TreeView.meta.js
// ==/UserScript==

const _all_posts = [];
const resolve = (url, data) => {
    if (/\/Topic\/\d+\/post/.test(url)) {
        const topic_id = url.match(/\/Topic\/(\d+)/)[1];
        (_all_posts[topic_id] ??= []).push(...data);
        const map = new Map(_all_posts[topic_id].map(i => [i.id, i]));
        _all_posts[topic_id] = [...map.values()];
        data = _all_posts[topic_id].sort((i,j)=>i.id-j.id);
    }
    return data;
};

const json = Response.prototype.json;
Response.prototype.json = function () {
    return json.call(this).then((data) => resolve(this.url, data));
};

const style = document.createElement('style');
document.head.append(style);

waitForElement(".center > .center", function(e) {
    const m = location.href.match(/\/topic\/(\d+)(?:\/(\d+)(?:#(\d+))?)?/);
    if(!m) {
        return;
    }
    const topic_id = m[1];
    const floor = ((m[2] || 1) - 1) * 10 + (m[3] || 1) % 10;
    const posts = _all_posts[topic_id];

    const children = {}, parent = {}, level = {}, order = {};
    posts.forEach(i => { parent[i.id] = i.parentId });
    posts.forEach(i => {
        const p = parent[i.parentId] >= 0 ? i.parentId : 0;
        (children[p] ??= []).push(i.id);
    });
    let index = 0;
    (function traverse(id, depth) {
        level[id] = depth;
        order[id] = index++;
        children[id]?.forEach(id => traverse(id, depth+1));
    })(0, -1);

    style.textContent = `
    .center > .center { ${posts.map(i => `
        --indent-${i.id}: calc(${level[i.id]} * var(--indent));
        --order-${i.id}: ${order[i.id]}; `).join('')}
        --indent: 4em;
    }
    .center > .center > .reply article > div[style^="background-color: rgb(245, 250, 255)"]:first-child {
        /* display: none; */
    }`;

    setTimeout(() => {
        [...e.children].find(i => React(i.querySelector('.reply-content')).props.floor >= floor)
            ?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }, 1000);
});

waitForElement(".center > .center > .reply", function(e) {
    const id = React(e.querySelector('.reply-content')).props.postId;
    e.style = `
        margin-left: var(--indent-${id}, 0);
        width: calc(100% - var(--indent-${id}, 0)) !important;
        order: var(--order-${id});
    `;
});

/* helper functions */
function React(dom) {
    const key = Object.keys(dom).find((key) => key.startsWith("__reactInternalInstance$"));
    const instance = dom[key];
    return (
        instance?._debugOwner?.stateNode ||
        instance?.return?.stateNode ||
        instance?._currentElement?._owner?._instance ||
        null
    );
}

function waitForElement(selector, callback, startNode = document) {
    const uid = "_" + Math.random().toString().slice(2);
    selector = `:is(${selector}):not([${uid}])`;
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType == 1) {
                    if (node.matches(selector)) {
                        node.setAttribute(uid, "");
                        callback(node);
                    }
                    node.querySelectorAll(selector).forEach(child => {
                        child.setAttribute(uid, "");
                        callback(child);
                    });
                }
            }
        }
    });
    observer.observe(startNode, {
        attributes: true,
        childList: true,
        subtree: true,
    });
}
