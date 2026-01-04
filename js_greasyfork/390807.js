// ==UserScript==
// @name Pull request
// @namespace GitHub Scripts
// @description Add extra copy buttons into pull request pages.
// @icon https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
// @run-at document-start
// @match *://github.com/*
// @grant none
// @version 1.1.5
// @downloadURL https://update.greasyfork.org/scripts/390807/Pull%20request.user.js
// @updateURL https://update.greasyfork.org/scripts/390807/Pull%20request.meta.js
// ==/UserScript==

function appendFetchBranchName() {
    var remoteBranchEl = document.getElementsByClassName('gh-header-meta')[0];
    if (!document.getElementById('pr_reset_fetch') && remoteBranchEl) {
        var childRemoteNodes = remoteBranchEl.querySelectorAll('span:not(.d-inline-block)');
        var lastChildRemoteNode = childRemoteNodes[childRemoteNodes.length - 1];
        var cpSpanEl = lastChildRemoteNode.cloneNode(true);
        var cpResetSpanEl = lastChildRemoteNode.cloneNode(true);
        var cpEl = cpSpanEl.firstElementChild;
        var remoteBranchName = cpEl.getAttribute('value');
        var branchName = remoteBranchName.split(':')[1] ?? remoteBranchName.split(':')[0];
        var pullNumber = document.getElementsByClassName('js-issue-title')[0].nextElementSibling.textContent.substr(1);
        var pullName = 'pull/' + pullNumber + '/head:' + branchName;
        cpEl.setAttribute('value', branchName);

        var branchNameEl = document.createElement('span');
        branchNameEl.innerText = branchName;
        branchNameEl.setAttribute('class', 'commit-ref');

        var remoteRefEl = document.querySelector('[data-pjax="#repo-content-pjax-container"]');
        var remoteUrl = 'git@github.com:' + remoteRefEl.href.replace(/^.*\/\/[^\/]+/, '').substr(1); + '.git';
        var gitCommands = 'git stash';
        gitCommands += ' && git fetch ' + remoteUrl + ' +refs/pull/' + pullNumber + '/head';
        gitCommands += ' && git checkout FETCH_HEAD && git log --oneline -n 2';
        cpResetSpanEl.firstElementChild.setAttribute('value', gitCommands);

        var resetFetchEl = document.createElement('span');
        resetFetchEl.innerText = 'Fetch and pull PR\'s branch commands';
        resetFetchEl.setAttribute('class', 'commit-ref');
        resetFetchEl.setAttribute('id', 'pr_reset_fetch');

        var appendedEl = remoteBranchEl.querySelector('.flex-auto');
        appendedEl.appendChild(document.createElement('br'));
        if (remoteBranchName.split(':')[1]) {
          appendedEl.appendChild(branchNameEl);
          appendedEl.appendChild(cpSpanEl);
          appendedEl.appendChild(document.createTextNode('\u00A0\u00A0\u00A0'));
        }
        appendedEl.appendChild(resetFetchEl);
        appendedEl.appendChild(cpResetSpanEl);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    appendFetchBranchName();
    var targetNode = document.documentElement || document.body;
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function (mutations) {
        var count = 0;
        for (var i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];
            if (!count && mutation.type === 'attributes' && mutation.attributeName === 'tabindex') {
                count++;
                appendFetchBranchName();
                document.getElementById('files') && targetNode.children[1] && targetNode.children[1].classList.remove('container-lg');
            }
        }
    };
    var observer = new MutationObserver(callback);
    (targetNode instanceof Element || targetNode instanceof HTMLDocument) && observer.observe(targetNode, config);
});