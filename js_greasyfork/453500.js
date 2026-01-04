// ==UserScript==
// @name         Gitlab monkey copy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  simple copy to cliboard formatted commit message
// @author       You
// @match        http*://www.gitlab.com/*
// @match      	 http*://*.gitlab.com/*
// @match      	 http*://gitlab.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/453500/Gitlab%20monkey%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/453500/Gitlab%20monkey%20copy.meta.js
// ==/UserScript==

const GIT_COPY_BUTTON_CLASS = 'superbutton';
const GIT_COPY_BUTTON_MSG = 'Copy as Git commit message 🚀';
const GIT_COPY_BUTTON_MSG_SUCCESS = 'Copied. Great work and happy commit! 🎉';
const ISSUE_NUMBER_SELECTOR = '[data-qa-selector="breadcrumb_current_link"] a';
const ISSUE_TITLE_SELECTOR = '[data-testid="issue-title"]';

void new class {
    constructor() {
        this.init();
        this.addStyles();
    }

    init() {
        let gitlabDetailPageEl = document.querySelector('.js-detail-page-description');
        if (!gitlabDetailPageEl) return;

        this.createGitCopyButton(gitlabDetailPageEl);

        let gitCopyButtonEl = document.querySelector(`.${GIT_COPY_BUTTON_CLASS}`);

        this.events(gitCopyButtonEl);
    }

    events(gitCopyButtonEl) {
        gitCopyButtonEl.addEventListener('click', (e) => {
            e.preventDefault();

            let commitMessage = this.createCommitMessage();

            commitMessage && this.copyTextToClipboard(commitMessage).then(() => {
                e.target.textContent = GIT_COPY_BUTTON_MSG_SUCCESS;
            });
        });
    }

    async copyTextToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    createCommitMessage() {
        let issueNum = document.querySelector(`${ISSUE_NUMBER_SELECTOR}`);
        let issueTitle = document.querySelector(`${ISSUE_TITLE_SELECTOR}`);

        return 'textContent' in issueNum && issueTitle && `FIX:${issueNum.textContent.replace('#','')} - ${issueTitle.textContent}`
    }

    createGitCopyButton(parentEl) {
        parentEl.insertAdjacentHTML('afterbegin', `<button class="${GIT_COPY_BUTTON_CLASS}">${GIT_COPY_BUTTON_MSG}</button>`);
    }

    addStyles() {
        GM_addStyle(`
            .${GIT_COPY_BUTTON_CLASS} {
                display: inline-block;
                outline: 0;
                cursor: pointer;
                border: 1px solid #000;
                border-radius: 6px;
                color: #000;
                background: #fff;
                font-size: 16px;
                font-weight: 500;
                line-height: 1.6;
                padding: 8px 20px;
                margin: 20px 0 30px;
                text-align:center;
                transition-duration: .15s;
                transition-property: all;
                transition-timing-function: cubic-bezier(.4,0,.2,1);
            }
            .${GIT_COPY_BUTTON_CLASS}:hover{
                background: rgb(251, 193, 245);
            }
        `);
    }
}