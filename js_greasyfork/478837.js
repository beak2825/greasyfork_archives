// ==UserScript==
// @name         WK Move a Lesson To Review
// @namespace    wanikani
// @version      0.2.1
// @description  Selectively move a Lesson to Review
// @author       polv
// @match        *://www.wanikani.com/*
// @match        *://preview.wanikani.com/*
// @license      MIT
// @connect      api.wanikani.com
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1276163
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/478837/WK%20Move%20a%20Lesson%20To%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/478837/WK%20Move%20a%20Lesson%20To%20Review.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const localStorageKey = 'MOVE_TO_REVIEW_API_KEY';
  let apikey = localStorage.getItem(localStorageKey);

  let lessons = null;

  const injector = wkItemInfo.on('itemPage').appendAtTop('', (o) => {
    if (!lessons) return;

    const assignment = lessons.find((r) => r.data.subject_id === o.id);
    if (!assignment) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.onclick = () => {
      send_api_request(
        'https://api.wanikani.com/v2/assignments/' + assignment.id + '/start',
        'PUT',
      ).then((r) => {
        if (r) {
          location.reload();
        }
      });
    };
    button.className = 'wk-button wk-button--default';
    button.innerText = 'Move to Review';
    return button;
  });

  send_api_request(
    'https://api.wanikani.com/v2/assignments?immediately_available_for_lessons=true',
    'GET',
  ).then((result) => {
    if (result) {
      lessons = result.data;
      console.log(lessons);
      injector.renew();
    }
  });

  async function send_api_request(url, method) {
    return new Promise((resolve, reject) => {
      // not sure if `fetch` with @connect can already bypass CORS, but just to be sure
      GM_xmlhttpRequest({
        method,
        url,
        headers: {
          Authorization: 'Bearer ' + apikey,
          'Wanikani-Revision': '20170710',
        },
        onload: function (response) {
          if (response.status != 200) {
            if (
              confirm(
                'WK API answered : ' +
                  response.status +
                  ' ' +
                  response.statusText +
                  '\nDo you want to enter a different API key?',
              )
            ) {
              if (add_key()) {
                return resolve(send_api_request(url, method));
              }
              return resolve(false);
            }
          }

          try {
            const result = JSON.parse(response.responseText);
            console.log(result);
            resolve(result);
          } catch (e) {
            reject(e);
          }

          return reject();
        },
        onerror: reject,
      });
    });
  }

  function add_key() {
    apikey = prompt(
      "Please enter an API key with 'assignment start' permission",
    );
    if (apikey != null) {
      localStorage.setItem(localStorageKey, apikey);
      return true;
    }
  }
})();
