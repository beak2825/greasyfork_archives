// ==UserScript==
// @name        LeetCode Turbo
// @description Replace monaco with vanilla textarea.
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.4
// @author      kkocdko
// @license     Unlicense
// @match       *://leetcode.com/problems/*
// @match       *://leetcode.cn/problems/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/479820/LeetCode%20Turbo.user.js
// @updateURL https://update.greasyfork.org/scripts/479820/LeetCode%20Turbo.meta.js
// ==/UserScript==
"use strict";

const globalThis = this.unsafeWindow || this;
const originFetch = globalThis.fetch;
const textarea = document.createElement("textarea");
textarea.style =
  "font-family: monospace; height: 100%; width: 100%; padding: 6px 10px; white-space: pre; outline: none;";
const replaceEditorTimer = setInterval(() => {
  const el = document.querySelector("#editor");
  if (el) el.replaceWith(textarea), clearInterval(replaceEditorTimer);
}, 500);
globalThis.fetch = (input, init) => {
  if (input?.includes("/lc-monaco/") || input?.includes("/monaco-tm/"))
    throw Error("Monaco editor blocked.");
  if (input?.endsWith("/submit") || input?.endsWith("/submit/"))
    init.body = JSON.stringify({
      ...JSON.parse(init.body),
      typed_code: textarea.value,
    });
  return originFetch(input, init);
};
fetch("https://leetcode.cn/graphql/", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    operationName: "questionEditorData",
    variables: { titleSlug: location.pathname.split("/")[2] },
    query:
      "query questionEditorData($titleSlug: String!) { question(titleSlug: $titleSlug) { codeSnippets { langSlug code } } }",
  }),
}).then(async (v) => {
  const snippets = (await v.json()).data.question.codeSnippets;
  textarea.value = snippets.find((v) => v.langSlug == "cpp").code;
});
globalThis.requestAnimationFrame = () => {}; // just ignore the requestAnimationFrame is ok?

// make a LRU cache for getComputedStyle
/*
const cache4gcs = new Map();
const originGetComputedStyle = globalThis.getComputedStyle;
globalThis.getComputedStyle = (elt, pseudoElt) => {
  if (pseudoElt !== undefined) return originGetComputedStyle(elt, pseudoElt);
  let pair = cache4gcs.get(elt);
  const now = Date.now();
  if (pair === undefined || pair[0] + 900 < now) {
    pair = [now, originGetComputedStyle(elt, pseudoElt)];
    console.log("miss " + now);
  }
  cache4gcs.delete(elt);
  cache4gcs.set(elt, pair);
  if (cache4gcs.size > 32) {
    const keys = cache4gcs.keys();
    for (let i = 0; i < 8; i++) cache4gcs.delete(keys.next().value);
  }
  return pair[1];
};
*/
// more conservative requestAnimationFrame
/*
const cache4raf = new Map();
const originRequestAnimationFrame = globalThis.requestAnimationFrame;
globalThis.requestAnimationFrame = (callback) => {
  const k = callback.toString();
  const now = Date.now();
  const interval = 200;
  if (cache4raf.get(k) > now - interval) {
    originRequestAnimationFrame(callback);
  } else {
    setTimeout(() => {
      originRequestAnimationFrame(callback);
    }, interval);
  }
  if (cache4raf.size > 32) {
    const keys = cache4raf.keys();
    for (let i = 0; i < 8; i++) cache4raf.delete(keys.next().value);
  }
};
*/

// https://leetcode.cn/problems/intersection-of-two-arrays-ii/description/

// ublock append ||static.leetcode.cn/lc-monaco/

/* 
fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionTitle($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    title\n    titleSlug\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    categoryTitle\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionTitle",
  }),
})
  .then((v) => v.text())
  .then((v) => console.log(v));

// 获取预设代码片段
fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionEditorData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    codeSnippets {\n      lang\n      langSlug\n      code\n    }\n    envInfo\n    enableRunCode\n    hasFrontendPreview\n    frontendPreviews\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionEditorData",
  }),
})
  .then((v) => v.json())
  .then((v) => console.log(v));

fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionContent($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    content\n    editorType\n    mysqlSchemas\n    dataSchemas\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionContent",
  }),
});

fetch("https://leetcode.cn/graphql/", {
  headers: { "content-type": "application/json" },
  method: "POST",
  body: JSON.stringify({
    query:
      "\n    query questionTranslations($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    translatedTitle\n    translatedContent\n  }\n}\n    ",
    variables: { titleSlug: "intersection-of-two-arrays-ii" },
    operationName: "questionTranslations",
  }),
});
*/