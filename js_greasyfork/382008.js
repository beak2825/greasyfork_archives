// ==UserScript==
// @name        Github Better Diff
// @description A userscript that adds a button to make the diff better
// @license     MIT
// @author      Marco Pelegrini
// @namespace   https://github.com/marcopelegrini
// @version     2.0.3
// @include     https://*github*/*
// @exclude     https://*github*/*/*.diff
// @exclude     https://*github*/*/*.patch
// @run-at      document-idle
// @grant       GM.addStyle
// @grant       GM_addStyle
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/382008/Github%20Better%20Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/382008/Github%20Better%20Diff.meta.js
// ==/UserScript==

(function () {

    let bdAppliedAfterProgressive = false;
    let bdAuto = JSON.parse(localStorage.bdAuto || true);
    let bdExpandDeleted = JSON.parse(localStorage.bdExpandDeleted || false);

    //console.log('BetterDiff Auto: ' + bdAuto);
    //console.log('BetterDiff Expand deleted: ' + bdExpandDeleted);

    function isProgressiveLoading() {
        let progressiveLoading = Array.from(document.querySelectorAll('.js-diff-progressive-container'))
            .some(e => {
                return e.querySelector('.js-diff-progressive-loader') != null
            });
        // console.log('BetterDiff Progressive Loading? ' + progressiveLoading);
        return progressiveLoading;
    }

    function addButton() {
        let e;
        if (/\/pull\/\d*\/(files|commits)/.test(location.href)
            && (e = document.querySelector('#files_bucket .pr-toolbar .diffbar > .float-right'))
            && (e.querySelector('.BetterDiffButton') == null)) {

            //console.log('BetterDiff Adding Button');

            let betterDiffContainer = document.createElement('details');
            betterDiffContainer.classList.add('details-reset', 'details-overlay', 'position-relative', 'float-left');

            let detailsButton = document.createElement('summary');
            detailsButton.classList.add('btn', 'btn-sm', 'select-menu-button');
            detailsButton.style.cssFloat = 'inherit';
            detailsButton.appendChild(document.createTextNode('Better Diff '));

            betterDiffContainer.appendChild(detailsButton);

            let popupDiv = document.createElement('div');
            popupDiv.classList.add('Popover', 'js-diff-settings', 'mt-2', 'pt-1');
            popupDiv.style.left = '-35px';
            popupDiv.innerHTML += "" +
                "<div class='Popover-message text-left p-3 mx-auto Box box-shadow-large'>" +
                "   <h5 class='mb-2'>" +
                "        <input type='checkbox' id='bd-auto' name='bd-auto' value='1' " + (bdAuto ? "checked='checked'" : "") + ">" +
                "        &nbsp;Execute automatically" +
                "   </h5>" +
                "   <h5 class='mb-2'>Deleted files content</h5>" +
                "   <div class='BtnGroup d-flex flex-content-stretch js-diff-style-toggle'>" +
                "       <label class='flex-auto btn btn-sm BtnGroup-item text-center " + (bdExpandDeleted ? "'" : "selected'") + ">" +
                "           <input class='sr-only' value='hide' name='bd-expand-deleted' type='radio' " + (bdExpandDeleted ? '' : "checked='checked'") + ">" +
                "           Hide" +
                "       </label>" +
                "       <label class='flex-auto btn btn-sm BtnGroup-item text-center " + (bdExpandDeleted ? "selected'" : "'") + ">" +
                "           <input class='sr-only' value='expand' name='bd-expand-deleted' type='radio' " + (bdExpandDeleted ? "checked='checked'" : "") + ">" +
                "           Expand" +
                "       </label>" +
                "   </div>" +
                "</div>";
            betterDiffContainer.appendChild(popupDiv);

            let g = document.createElement('div');
            g.classList.add('BetterDiffButton', 'diffbar-item');
            g.appendChild(betterDiffContainer);

            let runButton = document.createElement('a');
            runButton.setAttribute('id', 'bdRun');
            runButton.classList.add('social-count');
            runButton.appendChild(document.createTextNode('▶'));
            runButton.addEventListener('click', applyBetterDiffChanges, false);

            if (!bdAuto) {
                detailsButton.classList.add('btn-with-count');
            } else {
                runButton.style.display = "none";
            }

            g.appendChild(runButton);

            e.insertBefore(g, e.firstChild);

            document.getElementById('bd-auto').addEventListener('change', function (e) {
                //console.log('BetterDiff Auto changed: ' + e.target.checked);
                localStorage.bdAuto = e.target.checked;
                if (e.target.checked) {
                    runButton.style.display = "none";
                    detailsButton.classList.remove('btn-with-count');
                } else {
                    runButton.style.display = "block";
                    detailsButton.classList.add('btn-with-count');
                }
            }, false);

            document.getElementsByName('bd-expand-deleted').forEach(function (e) {
                e.addEventListener("click", function () {
                    let bdExpandDeleted = e.value === 'expand';
                    localStorage.bdExpandDeleted = bdExpandDeleted;
                    //console.log('BetterDiff Expand deleted changed: ' + bdExpandDeleted);
                });
            });
        } else {
            //console.log('BetterDiff button wont be added')
        }
    }

    function applyBetterDiffChanges() {
        // Fix deleted
        Array.from(document.querySelectorAll('.js-diff-load-container'))
            .filter(e => {
                let diffReason = e.querySelector('.hidden-diff-reason');
                return diffReason != null && diffReason.innerHTML.includes('This file was deleted');
            })
            .forEach(e => {
                let content = e.parentElement.parentElement;
                content.querySelector('.file-header').querySelector('.diffstat.tooltipped.tooltipped-e').innerHTML = 'DELETED';
                e.style.display = "none";
            });

        // Fix renamed
        Array.from(document.querySelectorAll('.data.highlight.empty'))
            .forEach(e => {
                let content = e.parentElement;
                content.style.display = "none";
                content.parentElement.querySelector('.file-header').querySelector('.diffstat.tooltipped.tooltipped-e').innerHTML = 'RENAMED'
            });

        // Expand large files
        Array.from(document.querySelectorAll('.js-diff-load-container'))
            .forEach(container => {
                let querySelector = container.querySelector('.load-diff-button');
                if (querySelector) {
                    querySelector.click()
                }
            });
    }

    function applyAfterProgressiveLoading() {
        // Progressive container
        if (isProgressiveLoading()) {
            // If progressive loading, wait for some time and check again
            setTimeout(function () {
                if (!bdAppliedAfterProgressive){
                    // If not applied, continue checking
                    if (isProgressiveLoading()) {
                        applyAfterProgressiveLoading();
                    } else {
                        applyBetterDiff();
                        bdAppliedAfterProgressive = true;
                    }
                }
            }, 1000)
        } else {
            applyBetterDiff();
        }
    }

    function applyBetterDiff() {
        // Init
        addButton();
        if (bdAuto) {
            // console.log('BetterDiff - applying');
            setTimeout(function () {
                applyBetterDiffChanges();
            }, 100);
        } else {
            // console.log('BetterDiff - manual');
        }
    }

    applyBetterDiff();
    applyAfterProgressiveLoading();

    // PJAX:END
    document.addEventListener('pjax:end', function () {
        // console.log('BetterDiff - pjax:end');
        applyAfterProgressiveLoading();
    });
})();