// ==UserScript==
// @name Filter 1pbtID on 4chan /pol/
// @namespace Violentmonkey Scripts
// @match https://boards.4chan.org/*
// @match https://boards.4channel.org/*
// @grant none
// @license MIT
// @version 1.0
// @run-at document-start
// @author Anons on /g/ https://desuarchive.org/g/thread/85972536/
// @description Filter 1pbtID on /pol/ and /biz/ (Requires 4chanX Catalog)
// @downloadURL https://update.greasyfork.org/scripts/442568/Filter%201pbtID%20on%204chan%20pol.user.js
// @updateURL https://update.greasyfork.org/scripts/442568/Filter%201pbtID%20on%204chan%20pol.meta.js
// ==/UserScript==

const postlimit = 20; // if 1pbtid and replies > postlimit, filtered

const shiftclick = new MouseEvent("click", {
 shiftKey: true,
 bubbles: true,
 cancelable: true,
 view: window
});

const filterThread = elem => elem.dispatchEvent(shiftclick);

const startup = async () => {
 const m = location.href.match(/https:\/\/boards\.4chan(?:nel)?\.org\/(.*)\//);
 if (!m) return;
 const board = m[1];
 if (!['pol', 'biz'].includes(board)) return;
 const isCatalog = !!document.querySelector('.catalog-small');
 if (!isCatalog) return;
if (document.getElementById('hidden-toggle').innerText == "[Hide]") return;
 const getThread = async pnum => await (await fetch(`https://a.4cdn.org/${board}/thread/${pnum}.json`)).json();
 await Promise.all([...document.querySelectorAll('.thread.catalog-thread')].map(async e => {
 const {posts} = await getThread(e.id.substr(1));
 const opid = posts[0].id;
 const pbtid = posts.filter(e => e.id == opid).length;
 if (pbtid != 1)
 return;
 if (posts.length < postlimit)
 return;
 console.log(`Filtering >>${e.id.substr(1)}`);
 filterThread(e);
 }));
 console.log('Processing finished');
};

document.addEventListener('IndexRefresh', () => startup());