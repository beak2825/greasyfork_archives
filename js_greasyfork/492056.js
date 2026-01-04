// ==UserScript==
// @name           bzzhr Link Resolver
// @name:ko        bzzhr 링크 변환기
// @namespace      BZZHR_RESOLVER_V1
// @run-at         document-end
// @version        1.0
// @description    remove bzzhr's ad link
// @description:ko bzzhr의 광고 링크를 제거하고 다운로드 링크를 바로 뱉어내도록 합니다.
// @author         Laria
// @match          https://bzzhr.co/f/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=bzzhr.co
// @license        MIT
// @encoding       utf-8
// @downloadURL https://update.greasyfork.org/scripts/492056/bzzhr%20Link%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/492056/bzzhr%20Link%20Resolver.meta.js
// ==/UserScript==

/*
 * == Change log ==
 * 1.0 - release
 */

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//https://stackoverflow.com/questions/5525071
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function linkShow() {
  //remove countdown btn
  document.getElementById('countdown').classList.add("hidden");
  //show all link
  for (let link of document.getElementsByClassName("dl")) link.classList.remove("hidden");

  //repeat all link to resolve original download link
  document.querySelector('div.dl').querySelectorAll('a').forEach((i) => {
    if (i.getAttribute('data-href')) {
        i.innerText = i.innerText + ' ®';
        i.href = i.getAttribute('data-href');
    }
  });
}

async function rootProcedure(){
  'use strict';
  //wait link available
  await waitForElm('div.dl');
  await linkShow();
}

window.addEventListener('load', () => setTimeout(rootProcedure, 100));