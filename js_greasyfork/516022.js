// ==UserScript==
// @name         Hide Gerrit CI Messages
// @version      0.0.5
// @author       yupnano(https://github.com/yupnano)
// @description  add Hide Gerrit CI Messages Button
// @description:zh-CN 支持隐藏 CI 相关的评论
// @license      MIT
// @include      https://gerrit*/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwXHfuMiyPYhXPv2J5H1gkRAvoZvLcjrBKTigr2e_X8A&s
// @grant        none
// @namespace https://greasyfork.org/users/1115435
// @downloadURL https://update.greasyfork.org/scripts/516022/Hide%20Gerrit%20CI%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/516022/Hide%20Gerrit%20CI%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var commentHide = true;
    var grMessageList;
    var hideCiMessagesButton;

    function findMessageList() {
        grMessageList = document.getElementById('app')?.shadowRoot
            ?.getElementById('app-element')?.shadowRoot
            ?.querySelector('main')
            ?.querySelector('gr-change-view')?.shadowRoot
            ?.getElementById('mainContent')
            ?.querySelector('gr-messages-list');
        return grMessageList;
    }

    function addCiMsgButton() {
        console.log('Hide Gerrit CI comment: addCiMsgButton');
        grMessageList = findMessageList();

        var collapseMessagesButton = grMessageList?.shadowRoot?.getElementById('collapse-messages')
        if (!collapseMessagesButton) {
            console.log('collapseMessagesButton not found!');
            return;
        }
        hideCiMessagesButton = grMessageList?.shadowRoot?.getElementById('hide-ci-messages');
        if (!!hideCiMessagesButton) {
            console.log('hideCiMessagesButton already exists!');
            return;
        }


        var buttonsSpan = document.createElement("span");
        buttonsSpan.innerHTML =`
        <gr-button id="reverse-messages" link="" title="reverse messages" role="button" tabindex="0">
           Reverse Order
        </gr-button>
        <gr-button id="hide-ci-messages" link="" title="Hide/Show CI messages (shortcut: h)" role="button" tabindex="0">
           Hide CI
        </gr-button>
        `;

        hideCiMessagesButton = buttonsSpan.querySelector('#hide-ci-messages');
        hideCiMessagesButton.onclick = () => {
            toggleCiMessages();
        };

        var reverseMessagesButton = buttonsSpan.querySelector('#reverse-messages');
        reverseMessagesButton.onclick = () => {
            reverseMessages();
        };

        collapseMessagesButton.insertAdjacentElement('beforebegin', buttonsSpan);
        buttonsSpan.appendChild(collapseMessagesButton);
    }

    function handleOldMsgsBtn() {
        // 展开折叠消息的时候，重新处理消息列表
        findMessageList()?.shadowRoot?.getElementById('oldMessagesBtn')?.addEventListener('click', refreshMessages);
    }

    function refreshMessages() {
        grMessageList = findMessageList();
        if (!grMessageList) {
            return
        }
        console.log("refresh Messages list")
        if (commentHide) {
            // 如果隐藏 CI message，则先展开被折叠的评论
            if (grMessageList?._visibleMessages?.length < grMessageList?._processedMessages?.length) {
                grMessageList._handleShowAllTap(); //点击 "SHOW ALL xx MESSAGES"
            }
        }

        processMessageList(commentHide)
        setTimeout(() => processMessageList(commentHide), 50); // 隐藏 CI messages
        setTimeout(() => processMessageList(commentHide), 100); // 隐藏 CI messages
        setTimeout(() => processMessageList(commentHide), 200); // 隐藏 CI messages
        setTimeout(() => processMessageList(commentHide), 300); // 隐藏 CI messages
        setTimeout(() => processMessageList(commentHide), 500); // 隐藏 CI messages
    }

    function toggleCiMessages() {
        commentHide = !commentHide;
        processMessageList(commentHide);
    }

    function processMessageList(hide) {
        console.log('Hide gerrit CI messages: ' + hide);
        if (!hideCiMessagesButton) {
            return
        }

        hideCiMessagesButton.innerText = hide ? 'Show CI' : 'Hide CI';

        var messages = findMessageList()?.shadowRoot?.querySelectorAll('gr-message');
        messages?.forEach(msg => {
            var isFenbi = !!msg.shadowRoot.querySelector('gr-account-label').shadowRoot.childNodes.values().find(i => i?.innerText?.includes('粉笔网'))
            if (isFenbi) {
                msg.style.display=(hide ? 'none' : '');
            } else {
                // "SHOW ALL 23 MESSAGES" 之后再 hide 不会展示之前折叠的用户 MESSAGE，所以这里改为展示
                msg.style.display='';
            }
        })
    }

    function reverseMessages() {
        console.log('reverse gerrit messages: ');
        if (!grMessageList) {
            return
        }
        var msgList = document.getElementById('app')?.shadowRoot
            ?.getElementById('app-element')?.shadowRoot
            ?.querySelector('main')
            ?.querySelector('gr-change-view')?.shadowRoot
            ?.getElementById('mainContent')
            ?.querySelector('gr-messages-list')?.shadowRoot
        var messages = msgList?.querySelectorAll('gr-message');
        Array.from(messages).reverse().forEach(msg => msgList.appendChild(msg));
    }


    document.addEventListener('timing-report', (e) => {
        if (event.detail.name?.includes('ChangeFullyLoaded')) {
            addCiMsgButton();
            handleOldMsgsBtn();
            refreshMessages();
        }
    });

    window.addEventListener('keydown', function (event) {
        console.log("ToogleCommentScript: keydown event:" + event.key);
        if (!grMessageList) {
            return
        }

        // https://github.com/GerritCodeReview/gerrit/blob/f42b24c0dcab10bd9b8d823dbab5bc6bea4a0b4e/polygerrit-ui/app/utils/dom-util.ts#L445
        //if (grMessageList.shouldSuppressKeyboardShortcut(event)) {
        //    return;
        //}

        if (event.key == 'h') {
            toggleCiMessages();
        }
    })

})();