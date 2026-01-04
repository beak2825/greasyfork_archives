// ==UserScript==
// @name         Infinite Scroll VOZ
// @namespace    https://voz.vn
// @version      3.3.1846240259
// @description  Infinite Scroll VOZ - Lướt voz.vn nhanh gọn như lướt facebook. https://github.com/ReeganExE/voz-infinite-scroll
// @author       Ninh Pham (ReeganExE), Nguyen Duy Tiep (green-leaves)
// @match        https://voz.vn/t/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38414/Infinite%20Scroll%20VOZ.user.js
// @updateURL https://update.greasyfork.org/scripts/38414/Infinite%20Scroll%20VOZ.meta.js
// ==/UserScript==

GM_addStyle(`
.hide {display: none} .show{display: block}
.fixed-page {
    position: fixed;
    left: 13px;
    bottom: 20px;
}

.reply-form.hide .message-cell--main {
  display: none;
}
.reply-form {
    position: fixed;
    bottom: -800px;
    z-index: 100;
    border: solid 1px #616161;
    box-shadow: 1px 1px 10px 4px #585858;
    border-radius: 2px;
    -webkit-transition: bottom .2s ease-in-out;
    -moz-transition: bottom .2s ease-in-out;
    -o-transition: bottom .2s ease-in-out;
    transition: bottom .2s ease-in-out;
}

.reply-form .block-body {
  margin: 0;
  border: solid 1px #a5a5a5!important;
}

.reply-button {
  position: fixed;
  bottom: 30px;
  z-index: 100;
  right: 70px;
}
`);
(function () {
    const PAGE_WRAPPER_SELECTOR = '.pageNav-main';
    const POST_BODY_SELECTOR = '.js-replyNewMessageContainer';
    const parser = new DOMParser();
    const posts = document.querySelector(POST_BODY_SELECTOR);
    let currentPage = +getCurrentPage();
    let lastPage = +getLastPage();
    let isLoading = false;
    let threadId = '';
    const PAGE_REG = /Page \d+/;
    const BUFFER_HEIGHT = 400; // Magic number, to load next page before reach the end.
    const loadingSpinHTML = 
    '<div class="" style="width: 160px;margin: 0 auto;padding: 20px;text-align: center;color: white;">Loading... <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/></div>';
    const loadingSpin = document.createElement('div');
    loadingSpin.innerHTML = loadingSpinHTML;
    loadingSpin.className = 'hide';
    main({
        getThreadId() {
            return location.pathname.match(/\/t\/.*\.(\d+)\/?/)[1];
        }
    });
    function main({ getThreadId }) {
        const pageNavWrappers = document.querySelectorAll(PAGE_WRAPPER_SELECTOR);
        if (pageNavWrappers.length) {
            pageNavWrappers[pageNavWrappers.length - 1].classList.add('fixed-page');
        }
        // Reply form
        handleReplyForm();
        function handleReplyForm() {
            const repyForm = document.querySelector('form.js-quickReply');
            if (repyForm) {
                repyForm.classList.add('reply-form');
                // Reply button
                const replyButton = htmlToElement(`
      <button type="button" class="button--primary button button--icon button--icon--reply reply-button">
        <span class="button-text">
          Ẩn/Hiện Reply
        </span>
      </button>
    `);
                const post = document.querySelector('.message.message--post.js-post.js-inlineModContainer');
                repyForm.style.width = `${post.clientWidth}px`;
                let show = false;
                function hideReplyForm() {
                    show = false;
                    repyForm.style.bottom = '-800px';
                }
                function showReplyForm() {
                    show = true;
                    repyForm.style.bottom = '40px';
                }
                repyForm.addEventListener('keydown', (e) => {
                    if (e.keyCode === 27) {
                        hideReplyForm();
                        show = false;
                    }
                });
                replyButton.addEventListener('click', () => {
                    show = !show;
                    if (show) {
                        showReplyForm();
                    }
                    else {
                        hideReplyForm();
                    }
                });
                document.body.appendChild(replyButton);
                setTimeout(() => {
                    jQuery(document).on('xf-click:before-click.XFQuoteClick', showReplyForm);
                }, 1000);
            }
        }
        if (posts) {
            const postsOffsetTop = getCoords(posts).top;
            threadId = getThreadId();
            insertAfter(posts, loadingSpin);
            window.addEventListener('scroll', () => {
                if (window.scrollY + window.innerHeight + BUFFER_HEIGHT >=
                    posts.offsetHeight + postsOffsetTop) {
                    if (isLoadable()) {
                        loadingSpin.className = 'show';
                        isLoading = true;
                        loadThreadPage(threadId, ++currentPage, (loadedDoc) => {
                            pushState(currentPage);
                            posts.innerHTML += loadedDoc.querySelector(POST_BODY_SELECTOR).innerHTML;
                            updatePageNavigator(loadedDoc);
                            lastPage = getLastPage(loadedDoc);
                            isLoading = false;
                            loadingSpin.className = 'hide';
                            // Reintialize the events handler for quotes, reply, report, reaction
                            XF.activate(posts);
                        });
                    }
                }
            });
        }
    }
    function pushState(currentPage) {
        let { title } = document;
        if (PAGE_REG.test(title)) {
            title = title.replace(PAGE_REG, `Page ${currentPage}`);
        }
        else {
            title = `${title} Page ${currentPage}`;
        }
        let [root] = location.href.split('/page-');
        if (!root.endsWith('/')) {
            root += '/';
        }
        root += `page-${currentPage}`;
        history.pushState({}, title, root + location.search);
        document.title = title;
    }
    function isLoadable() {
        return !isLoading && currentPage < lastPage;
    }
    function getCurrentPage() {
        const page = document.querySelector('.pageNav-main .pageNav-page--current');
        return page ? Number(page.textContent.trim()) : 1;
    }
    function getLastPage(doc) {
        if (!doc)
            doc = document;
        const page = doc.querySelector('.pageNav-page:last-child a');
        return page ? Number(page.textContent.trim()) : 1;
    }
    function updatePageNavigator(loadedDoc) {
        const pageNavs = document.querySelectorAll(PAGE_WRAPPER_SELECTOR);
        const newHtmlNav = loadedDoc.querySelector(PAGE_WRAPPER_SELECTOR).innerHTML;
        for (let i = 0; i < pageNavs.length; i++) {
            pageNavs[i].innerHTML = newHtmlNav;
        }
    }
    function getCoords(elem) {
        // crossbrowser version
        const box = elem.getBoundingClientRect();
        const { body } = document;
        const docEl = document.documentElement;
        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        const clientTop = docEl.clientTop || body.clientTop || 0;
        const clientLeft = docEl.clientLeft || body.clientLeft || 0;
        const top = box.top + scrollTop - clientTop;
        const left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }
    function loadThreadPage(threadId, pageNo, callback) {
        ajax('GET', `/t/ok.${threadId}/page-${pageNo}`, (xhr) => callback(parser.parseFromString(xhr.responseText, 'text/html')));
    }
    function ajax(method, url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            const DONE = 4; // readyState 4 means the request is done.
            const OK = 200; // status 200 is a successful return.
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    callback(xhr);
                }
                else {
                    console.log(`Error: ${xhr.status}`); // An error occurred during the request.
                }
            }
        };
    }
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    /**
     * @param {String} HTML representing a single element
     * @return {Element}
     * @author https://stackoverflow.com/a/35385518/1099314
     */
    function htmlToElement(html) {
        const template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
})();
