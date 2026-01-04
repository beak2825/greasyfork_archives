// ==UserScript==
// @name         GitLab PR 优化
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  PR信息复制按钮
// @author       SkyChen
// @match        https://gitlab.anta.cn/*
// @match        http://10.211.136.42:8080/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anta.cn
// @grant        none
// @require      https://unpkg.com/clipboard@2/dist/clipboard.min.js
// @require      https://unpkg.com/dayjs@1.11.10/dayjs.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445280/GitLab%20PR%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/445280/GitLab%20PR%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function copyPRTitle() {
        let clip = new ClipboardJS('[data-qa-selector="title_content"],.qa-title', {
            text: function(trigger) {
                return `【${trigger.innerText}】\n---------------------\n${window.location.href}`;
            }
        });
        clip.on('success', function (evt) {
            const trigger = evt.trigger;
            console.log(trigger);
            const title = trigger.innerText;
            trigger.innerText = '😍复制成功';
            setTimeout(() => { trigger.innerText = title }, 1000);
        })
        clip = null;
    })();

    (function defaultPRToRelease() {
        const button = document.querySelector('[data-qa-selector="create_merge_request_button"]');
        console.log(button);
        if (button) {
            button.onClick = function (e) {
                e.preventDefault();
            }
            const url = new URL(button.href);
            const search = [];
            const projectId = document.body.dataset.projectId;
            search.push(encodeURIComponent('merge_request[source_project_id]') + '=' + projectId);
            search.push(encodeURIComponent('merge_request[target_project_id]') + '=' + projectId);
            search.push(encodeURIComponent('merge_request[target_branch]') + '=dev');
            button.href = url.href + '&' + search.join('&');
            console.log(button.href);
        }
    })();

    (function changeMergeButtonColor() {
        setTimeout(() => {
            const button = document.querySelector('.accept-merge-request.btn-success');
            if (!button) return;
            const targetBranch = document.querySelector('.js-target-branch').innerText;
            const colors = { release: '#3AA6B9', dev: '#3AA6B9', simulation: '#3DB2FF', master: '#A66CFF' };
            if (colors[targetBranch]) {
                button.style.background = colors[targetBranch];
                button.innerText += `到 ${targetBranch}`;
            }
        }, 2000);
    })();

    (function jenkinsDownloadArtifact() {
        // http://10.211.136.42:8080/jenkins/job/miniprogram-anta-distmc/97/artifact/*zip*/archive.zip
        setTimeout(() => {
            const rows = document.querySelectorAll('[data-runid]');
            rows.forEach(row => {
                const runid = row.getAttribute('data-runid');
                const url = location.href + runid + '/artifact/*zip*/archive.zip';
                const filename = [location.pathname.replace(/\/jenkins\/job\/(.*?)\/$/g, '$1'), runid, dayjs().format('MMDDHHmm')].join('-') + '.zip';
                const link = row.querySelector('[cbwf-controller="build-artifacts-popup"] .link');
                if(link) {
                    link.href = url;
                    link.download = filename;
                }
            });
        }, 3000);
    })();

    (function copyMRTtitles() {
        if (!document.querySelector('.merge-request-form')) return;
        let clip = new ClipboardJS('.page-title', {
            text: function() {
                return Array.from(document.querySelectorAll('#new .commit-row-message.item-title'))
                  .map(node => node.innerText)
                  .filter(title => !title.includes('Merge branch'))
                  .join('\n');
            }
        });
        clip.on('success', function (evt) {
            console.log('复制成功');
        })
        clip = null;
    })();


    document.body.addEventListener('click', (evt) => {
        const target = evt.target;
        if (target.classList.contains('gl-white-space-pre-wrap')) {
            setDeleteBranchName()
        }
    })

    function setDeleteBranchName() {
        const modal = document.getElementById('delete-branch-modal');
        const branch = modal.querySelector('.gl-white-space-pre-wrap');
        const input = modal.querySelector('.gl-form-input');

        input.value = branch.innerText;
        input.dispatchEvent(new Event('change'));
    };
})();