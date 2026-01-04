// ==UserScript==
// @name         LOLZ_Fast_Close_el9in
// @namespace    LOLZ_Fast_Close_el9in
// @version      0.4
// @description  LOLZ Fast Close
// @author       el9in
// @match        https://zelenka.guru/?tab=mythreads*
// @match        https://lolz.guru/?tab=mythreads*
// @match        https://lolz.live/?tab=mythreads*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/475895/LOLZ_Fast_Close_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/475895/LOLZ_Fast_Close_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const inputElement = document.querySelector('input[type="hidden"][name="_xfToken"]');
    const xfTokenValue = inputElement.value;

    function init() {
        if(xfTokenValue) {
            const elements_threads = document.querySelectorAll('[id*="thread-"]');
            elements_threads.forEach(function(element) {
                const idValue = element.getAttribute('id');

                const parts = idValue.split('thread-');
                if (parts.length > 1) {
                    const thread_id = parts[1];
                    let _lockIcon = element.querySelector('.iconKey.fa.fa-lock.Tooltip');
                    const Tooltip = element.querySelector('.controls');
                    if(Tooltip) {
                        const copyElement = document.createElement("a");
                        copyElement.setAttribute("class", "StarContent threadControl far fa-lock Tooltip");
                        copyElement.setAttribute("title", !_lockIcon ? "Закрыть тему" : "Открыть тему");
                        Tooltip.appendChild(copyElement);
                        copyElement.addEventListener('click', function(event) {
                            event.preventDefault();

                            var formData = new FormData();
                            formData.append('discussion_open', !_lockIcon ? '0' : '1');
                            formData.append('set[discussion_open]', '1');
                            formData.append('_xfToken', xfTokenValue);
                            formData.append('_xfRequestUri', `/threads/${thread_id}/`);
                            formData.append('_xfNoRedirect', '1');
                            formData.append('_xfToken', xfTokenValue);
                            formData.append('_xfResponseType', 'json');

                            fetch(`https://zelenka.guru/threads/${thread_id}/quick-update`, {
                                "body": formData,
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            });
                            XenForo.alert(!_lockIcon ? 'Тема была закрыта.' : 'Тема была открыта.', "Оповещение", 2000);
                            _lockIcon = _lockIcon ? false : true;
                            copyElement.setAttribute("title", !_lockIcon ? "Закрыть тему" : "Открыть тему");
                            copyElement.setAttribute("class", !_lockIcon ? "StarContent threadControl far fa-lock Tooltip" : "StarContent threadControl far fa-unlock Tooltip");
                            //copyElement.remove();
                        });
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
                        let _lockIcon = element.querySelector('.iconKey.fa.fa-lock.Tooltip');
                        const Tooltip = element.querySelector('.controls');
                        if(Tooltip) {
                            const copyElement = document.createElement("a");
                            copyElement.setAttribute("class", "StarContent threadControl far fa-lock Tooltip");
                            copyElement.setAttribute("title", !_lockIcon ? "Закрыть тему" : "Открыть тему");
                            Tooltip.appendChild(copyElement);
                            copyElement.addEventListener('click', function(event) {
                                event.preventDefault();

                                var formData = new FormData();
                                formData.append('discussion_open', !_lockIcon ? '0' : '1');
                                formData.append('set[discussion_open]', '1');
                                formData.append('_xfToken', xfTokenValue);
                                formData.append('_xfRequestUri', `/threads/${thread_id}/`);
                                formData.append('_xfNoRedirect', '1');
                                formData.append('_xfToken', xfTokenValue);
                                formData.append('_xfResponseType', 'json');

                                fetch(`https://zelenka.guru/threads/${thread_id}/quick-update`, {
                                    "body": formData,
                                    "method": "POST",
                                    "mode": "cors",
                                    "credentials": "include"
                                });
                                XenForo.alert(!_lockIcon ? 'Тема была закрыта.' : 'Тема была открыта.', "Оповещение", 2000);
                                _lockIcon = _lockIcon ? false : true;
                                copyElement.setAttribute("title", !_lockIcon ? "Закрыть тему" : "Открыть тему");
                                copyElement.setAttribute("class", !_lockIcon ? "StarContent threadControl far fa-lock Tooltip" : "StarContent threadControl far fa-unlock Tooltip");
                                //copyElement.remove();
                            });
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