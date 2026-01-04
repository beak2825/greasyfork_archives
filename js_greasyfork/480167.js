// ==UserScript==
// @name        4chan-restore-deadlinks
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/thread/*
// @match       https://boards.4channel.org/*/thread/*
// @version     1.0
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description restores dead links pointing to deleted posts
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/480167/4chan-restore-deadlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/480167/4chan-restore-deadlinks.meta.js
// ==/UserScript==

const turnObjectInsideOut = (obj) => Object.fromEntries(Object.entries(obj).flatMap(([k, vs]) => vs.map((v) => [v, k])));

const archives = turnObjectInsideOut({
  "desuarchive.org": ["a", "aco", "an", "c", "cgl", "co", "d", "fit", "g", "his", "int", "k", "m", "mlp", "mu", "q", "qa", "r9k", "tg", "trash", "vr", "wsg"],
  "archive.4plebs.org": ["adv", "f", "hr", "o", "pol", "s4s", "sp", "tg", "trv", "tv", "x"],
  "archived.moe": ["3", "a", "aco", "adv", "an", "asp", "b", "bant", "biz", "c", "can", "cgl", "ck", "cm", "co", "cock", "con", "d", "diy", "e", "f", "fa", "fap", "fit", "fitlit", "g", "gd", "gif", "h", "hc", "his", "hm", "hr", "i", "ic", "int", "jp", "k", "lgbt", "lit", "m", "mlp", "mlpol", "mo", "mtv", "mu", "n", "news", "o", "out", "outsoc", "p", "po", "pol", "pw", "q", "qa", "qb", "qst", "r", "r9k", "s", "s4s", "sci", "soc", "sp", "spa", "t", "tg", "toy", "trash", "trv", "tv", "u", "v", "vg", "vint", "vip", "vm", "vmg", "vp", "vr", "vrpg", "vst", "vt", "w", "wg", "wsg", "wsr", "x", "xs", "y"],
  "warosu.org": ["3", "biz", "cgl", "ck", "diy", "fa", "ic", "jp", "lit", "sci", "vr", "vt"]
});

const urlParts = window.location.pathname.split("/").filter((s) => s !== "");
const boardId = urlParts[0];
const threadId = urlParts[2];
const archive = archives[boardId];

const addLinkToArchive = (deadlink) => {
  let quoteId = deadlink.textContent.split(">>").pop();

  let archiveLink = `https://${archive}/${boardId}/thread/${threadId}/#q${quoteId}`;
  if (archive === "warosu.org") archiveLink = `https://${archive}/${boardId}/thread/${quoteId}`;

  let deadLinkAnchor = document.createElement('a');
  deadLinkAnchor.textContent = deadlink.textContent + " (DEAD)";
  deadLinkAnchor.href = archiveLink;
  deadLinkAnchor.classList.add("quotelink");
  deadLinkAnchor.setAttribute("target", "_blank");

  deadlink.textContent = "";
  deadlink.appendChild(deadLinkAnchor);
};

const main = () => {
  let deadlinks = document.querySelectorAll(".thread .deadlink");

  Array
    .from(deadlinks)
    .forEach(addLinkToArchive);
};

main();
