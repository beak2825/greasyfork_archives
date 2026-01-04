// ==UserScript==
// @name         LOLZ_Fast_Delete_el9in
// @namespace    LOLZ_Fast_Delete_el9in
// @version      0.5
// @description  LOLZ Fast Delete
// @author       el9in
// @match        https://zelenka.guru/?tab=mythreads*
// @match        https://lolz.guru/?tab=mythreads*
// @match        https://lolz.live/?tab=mythreads*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @license      el9in
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/476020/LOLZ_Fast_Delete_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/476020/LOLZ_Fast_Delete_el9in.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const ignoreThreads = [6118447, 1];

    const inputElement = document.querySelector('input[type="hidden"][name="_xfToken"]');
    const xfTokenValue = inputElement.value;

    const checker = {};
    const times = 2;

    function check(threadId) {
      if(!checker[threadId]) {
        checker[threadId] = 1;
        return false;
      }

      checker[threadId] ++;

      if(checker[threadId] >= times) return true;
    }
    async function init() {
        if(xfTokenValue) {
            const elements_threads = document.querySelectorAll('[id*="thread-"]');
            elements_threads.forEach(function(element) {
                const idValue = element.getAttribute('id');

                const parts = idValue.split('thread-');
                if (parts.length > 1) {
                    const thread_id = parts[1];
                    if(ignoreThreads.indexOf(parseInt(thread_id)) === -1) {
                        const Tooltip = element.querySelector('.controls');
                        if(Tooltip) {
                            const copyElement = document.createElement("a");
                            copyElement.setAttribute("class", "StarContent threadControl far fa-trash Tooltip");
                            copyElement.setAttribute("title", "Удалить тему");
                            Tooltip.appendChild(copyElement);
                            copyElement.addEventListener('click', function(event) {
                                event.preventDefault();

                                if(!check(thread_id)) {
                                    XenForo.alert('Нажмите ещё раз для удаления темы.', "Предупреждение", 2000);
                                    return;
                                }

                                var formData = new FormData();
                                formData.append('reason', '');
                                formData.append('hard_delete', '0');
                                formData.append('_xfConfirm', '1');
                                formData.append('_xfToken', xfTokenValue);
                                formData.append('_xfRequestUri', `/threads/${thread_id}/`);
                                formData.append('_xfNoRedirect', '1');
                                formData.append('_xfToken', xfTokenValue);
                                formData.append('_xfResponseType', 'json');

                                fetch(`https://zelenka.guru/threads/${thread_id}/delete`, {
                                    "body": formData,
                                    "method": "POST",
                                    "mode": "cors",
                                    "credentials": "include"
                                });

                                element.remove();
                            });
                        }
                    }
                }
            });
        }
    }

    async function ones(element) {
      if(xfTokenValue) {
        try {
          const idValue = element.getAttribute('id');
          if(idValue) {
            const parts = idValue.split('thread-');
            if (parts.length > 1) {
              const thread_id = parts[1];
                if(ignoreThreads.indexOf(parseInt(thread_id)) === -1) {
                    const Tooltip = element.querySelector('.controls');
                    if(Tooltip) {
                        const copyElement = document.createElement("a");
                        copyElement.setAttribute("class", "StarContent threadControl far fa-trash Tooltip");
                        copyElement.setAttribute("title", "Удалить тему");
                        Tooltip.appendChild(copyElement);
                        copyElement.addEventListener('click', function(event) {
                            if(!check(thread_id)) {
                                XenForo.alert('Нажмите ещё раз для удаления темы.', "Предупреждение", 2000);
                                return;
                            }

                            event.preventDefault();

                            var formData = new FormData();
                            formData.append('reason', '');
                            formData.append('hard_delete', '0');
                            formData.append('_xfConfirm', '1');
                            formData.append('_xfToken', xfTokenValue);
                            formData.append('_xfRequestUri', `/threads/${thread_id}/`);
                            formData.append('_xfNoRedirect', '1');
                            formData.append('_xfToken', xfTokenValue);
                            formData.append('_xfResponseType', 'json');

                            fetch(`https://zelenka.guru/threads/${thread_id}/delete`, {
                                "body": formData,
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            });

                            element.remove();
                        });
                    }
                }
            }
          }
        } catch(error) {};
      }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(addedNode => {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              ones(addedNode);
            }
          });
        }
      }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    init();
})();