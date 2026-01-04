// ==UserScript==
// @name         [LZT] UP Threads with Hundle
// @namespace    [LZT] UP Threads with Hundle
// @version      0.1
// @description  Поднятие темы без задержки
// @author       molihan
// @match        https://zelenka.guru/?tab=mythreads*
// @match        https://lolz.guru/?tab=mythreads*
// @icon         https://zelenka.guru/favicon.ico
// @grant        Не украл, а спиздил
// @license      molihan
// @downloadURL https://update.greasyfork.org/scripts/480122/%5BLZT%5D%20UP%20Threads%20with%20Hundle.user.js
// @updateURL https://update.greasyfork.org/scripts/480122/%5BLZT%5D%20UP%20Threads%20with%20Hundle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const inputElement = document.querySelector('input[type="hidden"][name="_xfToken"]');
    const xfTokenValue = inputElement.value;
    let _unixTime = Math.floor(Date.now() / 1000);
    function init() {
        if(xfTokenValue) {
            const elements_threads = document.querySelectorAll('[id*="thread-"]');
            elements_threads.forEach(function(element) {
                const idValue = element.getAttribute('id');
                const parts = idValue.split('thread-');
                if (parts.length > 1) {
                    const deleteIcon = element.querySelector(".fa-arrow-to-top");
                    if(deleteIcon) {
                        deleteIcon.remove();
                        const thread_id = parts[1];
                        let _lockIcon = element.querySelector('.iconKey.fa.fa-lock.Tooltip');
                        const Tooltip = element.querySelector('.controls');
                        if(Tooltip) {
                            const copyElement = document.createElement("a");
                            copyElement.setAttribute("class", "StarContent threadControl far fa-arrow-to-top Tooltip");
                            copyElement.setAttribute("title", "Поднять тему");
                            Tooltip.appendChild(copyElement);
                            copyElement.addEventListener('click', function(event) {
                                event.preventDefault();
                                const currentUnixtime = Math.floor(Date.now() / 1000);
                                const time = (_unixTime >= currentUnixtime) ? (_unixTime - currentUnixtime) * 1000 : 0;
                                console.log(_unixTime, currentUnixtime, time);
                                setTimeout(function(thread_id, xfToken) {
                                    fetch("https://zelenka.guru/threads/" + thread_id + "/bump?from_list=1&&_xfRequestUri=%2F%3Ftab%3Dmythreads&_xfNoRedirect=1&_xfToken=" + xfToken + "&_xfResponseType=json", {
                                        "headers": {
                                            "accept": "application/json, text/javascript, */*; q=0.01",
                                            "cache-control": "no-cache",
                                            "pragma": "no-cache",
                                            "x-ajax-referer": "https://zelenka.guru/?tab=mythreads&order=last_post_date&direction=desc",
                                            "x-requested-with": "XMLHttpRequest",
                                            "Referer": "https://zelenka.guru/?tab=mythreads&order=last_post_date&direction=desc",
                                            "Referrer-Policy": "strict-origin-when-cross-origin"
                                        },
                                        "body": null,
                                        "method": "GET"
                                    });
                                    XenForo.alert("Запрос на поднятие темы был отправлен.", "Оповещение", 2000);
                                }, time, thread_id, xfTokenValue);
                                if(_unixTime >= currentUnixtime) _unixTime += 6;
                                else _unixTime = Math.floor(Date.now() / 1000) + 6;
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
                        const deleteIcon = element.querySelector(".fa-arrow-to-top");
                        if(deleteIcon) {
                            deleteIcon.remove();
                            const thread_id = parts[1];
                            let _lockIcon = element.querySelector('.iconKey.fa.fa-lock.Tooltip');
                            const Tooltip = element.querySelector('.controls');
                            if(Tooltip) {
                                const copyElement = document.createElement("a");
                                copyElement.setAttribute("class", "StarContent threadControl far fa-arrow-to-top Tooltip");
                                copyElement.setAttribute("title", "Поднять тему");
                                Tooltip.appendChild(copyElement);
                                copyElement.addEventListener('click', function(event) {
                                    event.preventDefault();
                                    const currentUnixtime = Math.floor(Date.now() / 1000);
                                    const time = (_unixTime >= currentUnixtime) ? (_unixTime - currentUnixtime) * 1000 : 0;
                                    setTimeout(function(thread_id, xfToken) {
                                        fetch("https://zelenka.guru/threads/" + thread_id + "/bump?from_list=1&&_xfRequestUri=%2F%3Ftab%3Dmythreads&_xfNoRedirect=1&_xfToken=" + xfToken + "&_xfResponseType=json", {
                                            "headers": {
                                                "accept": "application/json, text/javascript, */*; q=0.01",
                                                "cache-control": "no-cache",
                                                "pragma": "no-cache",
                                                "x-ajax-referer": "https://zelenka.guru/?tab=mythreads&order=last_post_date&direction=desc",
                                                "x-requested-with": "XMLHttpRequest",
                                                "Referer": "https://zelenka.guru/?tab=mythreads&order=last_post_date&direction=desc",
                                                "Referrer-Policy": "strict-origin-when-cross-origin"
                                            },
                                            "body": null,
                                            "method": "GET"
                                        });
                                        XenForo.alert("Запрос на поднятие темы был отправлен.", "Оповещение", 2000);
                                    }, time, thread_id, xfTokenValue);
                                    if(_unixTime >= currentUnixtime) _unixTime += 6;
                                    else _unixTime = Math.floor(Date.now() / 1000) + 6;
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