// ==UserScript==
// @name         Pinning fave threads
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Закрепление тем в разделе "Закладки" (Мастхэв для закладчиков)
// @author       Nicky (https://zelenka.guru/members/2259792/)
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473193/Pinning%20fave%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/473193/Pinning%20fave%20threads.meta.js
// ==/UserScript==

async function main() {
    var savedThreads = GM_getValue('savedThreads', []);
    var uniqueThreads = [];

    function refreshButtons() {
        let controlsElements = document.querySelectorAll(".controls");
        let buttons = document.querySelectorAll(".pin");

        buttons.forEach(button => button.parentNode.removeChild(button));

        for (let controlEl of controlsElements) {
            let thread = controlEl.closest('.discussionListItem');
            let temp = thread.outerHTML;

            let pinBtn = document.createElement("a");
            pinBtn.classList.add('pin', 'far', 'fa-thumbtack', 'Tooltip', 'threadControl');
            if (thread.closest('.stickyThreads')) {
                pinBtn.style.color = 'rgb(0, 186, 120)';
                pinBtn.title = 'Открепить';
            } else {
                pinBtn.title = 'Закрепить';
            }
            if (screen.width < 610) {
                pinBtn.style.cssText += 'display: inline-block; position: absolute; right: 20px; bottom: 20px;'
            }
            pinBtn.addEventListener('click', function(event) {
                event.preventDefault();
                if (thread.closest('.stickyThreads')) {
                    unpinThread(temp, thread);
                } else {
                    pinThread(temp);
                }
            });

            if (screen.width < 610)
                thread.appendChild(pinBtn);
            else
                controlEl.appendChild(pinBtn);
            XenForo.Tooltip($(pinBtn));
        }
    }

    async function pinThread(element) {
        savedThreads.push(element);
        GM_setValue("savedThreads", savedThreads);
        refreshList();
        refreshButtons();
    }

    async function unpinThread(element, thread) {
        savedThreads = savedThreads.filter((string) => string !== element);
        GM_setValue("savedThreads", savedThreads);
        $(thread)[0].remove()
        refreshList();
        refreshButtons();
    }

    function refreshList() {
        let stickyListThreads = document.querySelector('.stickyThreads');

        if (!stickyListThreads) {
            $('.discussionListItems').prepend('<div class="stickyThreads">');
            stickyListThreads = document.querySelector('.stickyThreads');
        }

        let latestThreads = document.querySelector('.latestThreads._insertLoadedContent');

        for (let thread of savedThreads) {
            thread = $(thread);
            let temp = thread[0].outerHTML
            if (!uniqueThreads.includes(thread[0].outerHTML)) {
                uniqueThreads.push(temp);
                if (thread.closest('.stickyThreads').length == 0) {
                    stickyListThreads.insertBefore(thread[0], stickyListThreads.firstChild);
                }
            }

        }
        for (let thread of uniqueThreads) {
            if (!savedThreads.includes(thread)) {
                uniqueThreads = uniqueThreads.filter((string) => string !== thread);
                thread = $(thread);
                if (thread.closest('.stickyThreads')) {
                    latestThreads.insertBefore(thread[0], latestThreads.firstChild);
                }
            }
        }
        let threads = Array.from(document.getElementsByClassName('discussionListItem'));

        for (let thread of threads) {
            for (let savedThread of savedThreads) {
                if ($(savedThread)[0].id == $(thread)[0].id && $(thread).closest('.stickyThreads').length == 0) {
                    $(thread).remove();
                    break;
                }
            }
        }
    }

    window.addEventListener('scroll', function() {
        if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 100) {
            refreshList();
            refreshButtons();
        }
    });

    refreshList();
    refreshButtons();
};

if (window.location.href.startsWith('https://zelenka.guru/?tab=fave')) {
    main();
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.target.classList.contains('fave')) {
            main()
        }
    });
});

observer.observe($('body')[0], {attributes: true, attributeFilter: ['class']});