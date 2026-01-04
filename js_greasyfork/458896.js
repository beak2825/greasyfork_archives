// ==UserScript==
// @name        Bitbucket Enhanced +4
// @namespace   https://greasyfork.org/en/scripts/458896
// @homepageURL https://gist.github.com/raveren/3bd55656272143f667e9cfd7e7171c52
// @license     MIT
// @version     2.1.1
// @author      raveren
// @description Changes PR page titles to be useful, shows prominent branch name at top with click to copy, adds links to source lines for JetBrains IDEs, asks to confirm exit if you have comments pending.
// @match       https://bitbucket.org/*
// @run-at      document-start
// @connect     localhost
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458896/Bitbucket%20Enhanced%20%2B4.user.js
// @updateURL https://update.greasyfork.org/scripts/458896/Bitbucket%20Enhanced%20%2B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {
        let fixTitle = function () {
            if (location.href.match(/\/pull-requests\/$/)) {
                document.title = 'All Pull Requests';
            } else {
                document.title = document.title.replace(/[\w-]+ \/ [\w-]+\s?\/? Pull Request #/, '#');
                document.title = document.title.replace(/Feature\/\w+ \d* /, '');
            }
        };
        fixTitle();
        setInterval(fixTitle, 5000)


        const ideLink = 'http://localhost:63342/api/file/';
        const icon = '<svg width="8px" height="8px" viewBox="0 0 2.1 2.1">' +
            '<g transform="translate(-1 -1)"><path d="m1.2 1.2 1.8-7.4e-4 0 1.8m-1.6-0.2 1.6-1.6" stroke="#0fa" stroke-width=".5"/></g>' +
            '</svg>';

        // small monitor icon when hovering on line number to go to IDE
        $(document).on('mouseover', 'a.line-number-permalink', function (e) {
            if ($(this).data('ravLoaded')) {
                return
            }
            $(this).data('ravLoaded', 1)

            let link = $(this).prop('href').replace(/.*#chg_/, '')
            let href = ideLink + link.replace(/_newline/, ':').replace(/_oldline/, ':')

            let span = document.createElement('span');
            span.innerHTML = `<a class="rav-js-ide-link" href="${href}">${icon}</a> `;
            span.title = 'Open in PHPStorm'
            $(this).before(span);
        });

        // in overview tab
        $(document).on('mouseover', '[data-qa="pull-request-overview-activity-content"] .line-number', function (e) {
            let el = $(this);
            if (el.data('ravLoaded')) {
                return
            }
            el.data('ravLoaded', 1)

            // <div style="position: relative; top: -100px;" id="Lapp/Models/blalba.phpF22" data-qa="code-line-permalink"></div>
            let src = el.closest('.lines-wrapper').find('[data-qa="code-line-permalink"]').prop('id');
            let path = src.replace(/^L/, '').replace(/[FT]\d+$/, '')
            let line = src.match(/\d+$/, '')
            let href = ideLink + path + ':' + line;

            let span = document.createElement('span');
            span.innerHTML = ` <a class="rav-js-ide-link" href="${href}">${icon}</a>`;
            span.title = 'Open in IDE'
            el.append(span);
        });

        $(document).on('click', 'a.rav-js-ide-link', function (e) {
            e.preventDefault()

            GM_xmlhttpRequest({
                method: 'GET',
                url: this.href,
            })

            return false
        })

        let addTopBranch = function () {
            if ($('.rav-js-top-branch').length) {
                return;
            }

            // make branch name stand out a little and click to copy
            const branchName =
                $('div[data-qa="pr-branches-and-state-styles"] > div:first-child > div:first-child > span:first-child > span:first-child')
                    .eq(0)
                    .text()
                    .replace(/^Branch: /, '');

            const css = 'position: fixed;top: 0;z-index: 9999;margin: 0 auto;width: 100%;text-align: center;' +
                'cursor: pointer;font-weight: bold;color: darkred;background:linear-gradient(90deg,rgba(255, 0, 0, 1)' +
                ' 0%,rgba(255, 154, 0, 1) 10%,rgba(208, 222, 33, 1) 20%,rgba(79, 220, 74, 1) 30%,rgba(63, 218, 216, 1)' +
                ' 40%,rgba(47, 201, 226, 1) 50%,rgba(28, 127, 238, 1) 60%,rgba(95, 21, 242, 1) 70%,rgba(186, 12, 248, 1)' +
                ' 80%,rgba(251, 7, 217, 1) 90%,rgba(255, 0, 0, 1) 100%)'

            if (branchName) {
                $(`<div style="${css}">${branchName}</div>`)
                    .prop('class', 'rav-js-top-branch')
                    .prop('title', 'click to copy')
                    .on('click', function () {
                        navigator.clipboard.writeText($(this).text())
                        $(this).append(' <span style="color: green">📋 Copied!</span>');
                        $(this).find('span').fadeOut(1000, function () {
                            $(this).remove()
                        })
                    })
                    .appendTo(document.body)
            }
        };
        addTopBranch()
        setInterval(addTopBranch, 5000)
    });


    window.addEventListener('beforeunload', (event) => {
        if (document.documentElement.innerText.indexOf('Finish Review') !== -1) {
            // return 'You have a pending review, do you really want to exit?';
            // Recommended
            event.preventDefault();

            // Included for legacy support, e.g. Chrome/Edge < 119
            event.returnValue = true;
        }
    });
})();

