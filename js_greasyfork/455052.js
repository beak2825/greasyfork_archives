// ==UserScript==
// @name            DIO closes complete modules
// @namespace       http://tampermonkey.net/
// @version         1.9
// @description     closes all modules complete in DIO
// @author          chad
// @license         MIT
// @match           https://web.dio.me/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=dio.me
// @grant           none
// @namespace       https://greasyfork.org/en/users/984840-jhonata
// @downloadURL https://update.greasyfork.org/scripts/455052/DIO%20closes%20complete%20modules.user.js
// @updateURL https://update.greasyfork.org/scripts/455052/DIO%20closes%20complete%20modules.meta.js
// ==/UserScript==

const pathWithoutReload = ["users", "articles"];

const conditions = pathWithoutReload.every((el) => !window.location.href.includes(el));

if(window.location.hash !== '#loaded' && conditions) {
  window.location.hash = '#loaded';
  window.location.reload();
}

const getElements = ((idOrClass) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(document.querySelectorAll(idOrClass));
    }, 1000);
  });
});

const closeModules = () => {
  getElements('.lesson-title')
    .then((done) => {
      done.forEach((el) => {
        const statusModule = el.firstChild.firstChild.firstChild;

        if(statusModule.tagName === 'I' && statusModule.style.color === 'rgb(3, 171, 24)' && el.getAttribute('aria-expanded') === 'true') {
          el.click();
        }
      });
    });
};

let mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    const isLoading = document.querySelectorAll('.loading');

    if(window.location.href.includes('/course/') && ((mutation.target.getAttribute('id') === 'track-lessons' || '') || isLoading.length)) {
      closeModules();
    }
  });
});

const mutationConfig = {
  childList: true,
  subtree: true
};

getElements('#root')
  .then((done) => {
    mutationObserver.observe(done[0], mutationConfig);
});

if(window.location.href.includes('/course/')) closeModules();
