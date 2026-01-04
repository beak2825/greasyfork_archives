// ==UserScript==
// @name         Canvas Quiz Untracker
// @namespace    7549a111-af08-40ea-a952-539c6d8e2021
// @version      1.0.0
// @description  Stop Canvas from logging events such as the user leaving the page to cheat
// @author       PrimePlaya24
// @license      MIT
// @include      /^https:\/\/canvas\.[a-z0-9]*?\.[a-z]*?\/?(.*)?/
// @include      /^https:\/\/[a-z0-9]*?\.instructure\.com\/?(.*)?/
// @icon         https://canvas.instructure.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/434284/Canvas%20Quiz%20Untracker.user.js
// @updateURL https://update.greasyfork.org/scripts/434284/Canvas%20Quiz%20Untracker.meta.js
// ==/UserScript==

/*

Example:

{"url":"/api/v1/courses/261055/quizzes/300404/submissions/11199445/events","type":"POST","global":false,"headers":{"Accept":"application/json; charset=UTF-8","Content-Type":"application/json; charset=UTF-8"},"data":"{\"quiz_submission_events\":[]}"}

options - object
    data - stringified object
        quiz_submission_events - array
*/

const log = (str, ...data) => {
  if (isEmptyArray(data)) {
    console.log(`[CQU] - ${str}`);
  } else {
    console.log(`[CQU] - ${str}:`, data);
  }
};

const get = (selector) =>
  selector
    .replace(/\[([^\[\]]*)\]/g, ".$1.")
    .split(".")
    .filter((t) => t !== "")
    .reduce((prev, cur) => prev && prev[cur], window);

const isEmptyObject = (obj) => JSON.stringify(obj) === "{}";

const isEmptyArray = (arr) => !arr.length;

const waitUntil = (fn) => {
  return new Promise(async (resolve, reject) => {
    if (typeof fn !== "function") {
      reject();
    }
    while (Boolean(fn()) !== true) {
      await new Promise((r) => setTimeout(r, 10));
    }
    resolve(true);
  });
};

const main = () => {
  waitUntil(() => get("jQuery") !== undefined).then(() => {
    const ajaxOriginal = window.jQuery.ajax;
    window.jQuery.ajax = function () {
      const ID = (Math.random() * 1e18).toString(36).substring(0, 6);
      const ajaxOptions = arguments?.[0];
      //   log(`[${ID}] ajaxOptions`, ajaxOptions);
      if (
        ajaxOptions?.url?.search?.("events") > -1 ||
        ajaxOptions?.url?.search?.("page_views") > -1
      ) {
        const moddedData =
          typeof ajaxOptions?.data === "string" &&
          JSON.parse(ajaxOptions?.data ?? "{}");
        if (!isEmptyObject(moddedData)) {
          const unfiltered = moddedData.quiz_submission_events;
          moddedData.quiz_submission_events =
            moddedData?.quiz_submission_events?.filter?.(
              (e) => e.event_type.search("page") == -1
            );
          if (isEmptyArray(moddedData.quiz_submission_events)) {
            log(
              `[${ID}] Skipped sending an empty log, not sending!`,
              moddedData
            );
            return Promise.resolve();
          }
          log(
            `[${ID}] Cleaned AJAX request, [before, after]`,
            unfiltered,
            moddedData.quiz_submission_events
          );
          ajaxOptions.data = JSON.stringify(moddedData);
          return ajaxOriginal.apply(this, arguments);
        }
        log(`[${ID}] Not sending this AJAX request!`, ajaxOptions);
        return Promise.resolve();
      }
      log(`[${ID}] Sending unmodified`, ajaxOptions);
      return ajaxOriginal.apply(this, arguments);
    };
  });
};

if (["complete", "interactive"].indexOf(document.readyState) > -1) {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main, false);
}
