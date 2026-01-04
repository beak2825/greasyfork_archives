// ==UserScript==
// @name         LZTRANDOMTHREAD
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      0.1
// @description  Открываем случайную тему в разделе
// @author       llimonix
// @match        https://zelenka.guru/*
// @icon         https://cdn-icons-png.flaticon.com/512/7601/7601730.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472526/LZTRANDOMTHREAD.user.js
// @updateURL https://update.greasyfork.org/scripts/472526/LZTRANDOMTHREAD.meta.js
// ==/UserScript==

(function() {
    function check(){
        let currentPage = window.location.href;

        if (currentPage.startsWith('https://zelenka.guru/forums/')) {

            let RandomThread = $('.RandomThread');
            if (RandomThread.length == 0) {
                $('.linkGroup').prepend(`<a class="button RandomThread">Случайная тема</a>`);
                $('.RandomThread').click(function() {
                    let lastPage = $('.PageNav a:last').text();
                    let lastPageNumber = parseInt(lastPage);
                    let randomNum = Math.floor(Math.random() * lastPageNumber) + 1;
                    if (randomNum > 500) {
                        randomNum = Math.floor(Math.random() * 500) + 1;
                    }
                    let forumID = $('form.DiscussionListOptions').attr('action');
                    if (lastPage.length > 0) {
                        XenForo.ajax(`https://zelenka.guru/${forumID}page-${randomNum}`, {}).then(data => {
                            infoPage = data.templateHtml;
                            let parser = new DOMParser();

                            infoPage = parser.parseFromString(infoPage, 'text/html');

                            let threadIds = $(infoPage).find("[id^='thread-']").toArray();
                            let threads = [];

                            threadIds.forEach(function(threadId) {
                                let thread = threadId.id.match(/\d+/)[0];
                                threads.push(thread);
                            });

                            let randomThreadId = threads[Math.floor(Math.random() * threads.length)];

                            window.location.href = "https://zelenka.guru/threads/" + randomThreadId;
                        });
                    } else {
                        XenForo.ajax(`https://zelenka.guru/${forumID}`, {}).then(data => {
                            infoPage = data.templateHtml;
                            let parser = new DOMParser();

                            infoPage = parser.parseFromString(infoPage, 'text/html');

                            let threadIds = $(infoPage).find("[id^='thread-']").toArray();
                            let threads = [];

                            threadIds.forEach(function(threadId) {
                                let thread = threadId.id.match(/\d+/)[0];
                                threads.push(thread);
                            });

                            let randomThreadId = threads[Math.floor(Math.random() * threads.length)];

                            window.location.href = "https://zelenka.guru/threads/" + randomThreadId;
                        });
                    };
                });
            };
        };
        requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
})();