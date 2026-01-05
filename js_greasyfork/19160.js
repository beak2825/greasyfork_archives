// ==UserScript==
// @name         MyMHScheduler
// @namespace    https://greasyfork.org/en/users/39779
// @version      1.0.5.3.1
// @description  my mh scheduler
// @author       Elie
// @match        https://www.mousehuntgame.com/*
// @match        https://elie2201.github.io/mh/mhReloader.html*
// @icon         https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @license      GPL-3.0+; http://www.gnu.org/copyleft/gpl.html
// @grant        unsafeWindow
// @grant        GM_info
// @run-at  document-end

// @downloadURL https://update.greasyfork.org/scripts/19160/MyMHScheduler.user.js
// @updateURL https://update.greasyfork.org/scripts/19160/MyMHScheduler.meta.js
// ==/UserScript==

const schedulerInterval = parseInt(
  localStorage.schedulerInterval ? localStorage.schedulerInterval : 60000
);
(function () {
  'use strict';

  // Your code here...

  const Utils = (function () {
    const utils = {
      availableRequestMethods: ['GET', 'POST'],
      /** keep VPN alive && run jobs */
      runJobs() {
        /* 
        // eslint-disable-next-line no-undef
        $.get(
          'https://elie2201.github.io/mh/jobs.txt',
          (data) => {
            console.log(data);
            if (!data) return;
            const d = JSON.parse(data);
            for (const key in d) {
              if (Object.prototype.hasOwnProperty.call(d, key)) {
                const job = d[key];
                const jobContent = job['content'];
                const effected = 'effected';
                const expried = 'expried';
                if (
                  (!job[effected] || Date.now() > job[effected]) &&
                  (!job[expried] || Date.now() < job[expried]) &&
                  Utils[jobContent]
                ) {
                  Utils[jobContent]();
                }
              }
            }
          },
          'text'
        ).fail(() => {
          console.log('error');
        });
         */
        this.ajax(
          'get',
          'https://elie2201.github.io/mh/jobs.txt',
          (data) => {
            console.log(data);
            if (!data) return;
            const d = JSON.parse(data);
            for (const key in d) {
              if (Object.prototype.hasOwnProperty.call(d, key)) {
                const job = d[key];
                const jobContent = job['content'];
                const jobArgs = job['args'];
                const effected = 'effected';
                const expried = 'expried';
                if (
                  (!job[effected] || Date.now() > job[effected]) &&
                  (!job[expried] || Date.now() < job[expried]) &&
                  Utils[jobContent]
                ) {
                  Utils[jobContent](...jobArgs);
                }
              }
            }
          },
          'text',
          (error) => {
            console.log('error:', error);
          }
        );
      },
      ajax(method, url, successCallback, dataType, failureCallback) {
        if (!method || method === '') {
          console.log('request method required');
          return;
        }
        const upperMethod = method.toUpperCase();
        if (this.availableRequestMethods.indexOf(upperMethod) < 0) {
          console.log('request method unknown');
          return;
        }
        if (!url || url === '') {
          console.log('url required');
          return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url);
        xhr.onload = function () {
          const data = xhr.responseText;
          if (successCallback) {
            let resolved = null;
            if (dataType === 'text') {
              resolved = data;
            } else if (dataType === 'json') {
              resolved = JSON.parse(data);
            } else if (dataType === 'html') {
              const parser = new DOMParser();
              resolved = parser.parseFromString(data, 'text/html');
            }
            successCallback(resolved);
          }
        };
        xhr.onerror = function () {
          console.error(xhr.statusText);
          if (failureCallback) failureCallback(xhr.statusText);
        };
        xhr.send();
      },
      run(params) {
        setTimeout(() => {
          utils.runJobs();
        }, 0);
        if (schedulerInterval && schedulerInterval > 29999)
          setTimeout(() => {
            this.run();
          }, schedulerInterval);
      }
    };
    return utils;
  })();
  Utils.run();
})();
