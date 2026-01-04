// ==UserScript==
// @name         Leetcode Contest Language reavealer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  The primary aim of this script is to identify in what coding language the user has written the code. For v1, I only consider the first result.
// @author       Rupesh Dabbir
// @license      MIT
// @namespace    https://github.com/rupeshdabbir
// @include      https://leetcode.com/contest/*/ranking/*
// @include      https://leetcode.com/contest/*
// @match        https://leetcode.com/contest/weekly-contest-*/ranking*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375145/Leetcode%20Contest%20Language%20reavealer.user.js
// @updateURL https://update.greasyfork.org/scripts/375145/Leetcode%20Contest%20Language%20reavealer.meta.js
// ==/UserScript==
(function() {

    let firstLoad = false;

    const pageURLCheckTimer = setInterval(
        function() {
            if (this.lastPathStr !== location.pathname ||
                this.lastQueryStr !== location.search ||
                this.lastPathStr === null ||
                this.lastQueryStr === null
            ) {
                this.lastPathStr = location.pathname;
                this.lastQueryStr = location.search;
                gmMain();
            }
        }, 222
    );

    function gmMain() {
        const isRanking = window.location.pathname.split('ranking').length > 1;
        if (isRanking && !firstLoad) {
            firstLoad = true;
            initMagic();
        }
    }

    function initMagic() {
        /* Promisified Helper method that waits for a particular DOM elem to be loaded */
        const waitFor = (...selectors) => new Promise(resolve => {
            const delay = 500
            const f = () => {
                const elements = selectors.map(selector => document.querySelector(selector))
                if (elements.every(element => element != null)) {
                    resolve(elements)
                } else {
                    setTimeout(f, delay)
                }
            }
            f()
        })

        /* When Pagination has been clicked */
        waitFor('.pagination').then(([table]) => {
            $('.pagination').click(function() {
                $('.td-lang-data').remove();
                $('.td-my-data').remove();

                $('.rupesh-loader').css('display', 'block');
                setTimeout(() => { // Time for window.location.href to update.
                    doAjax();
                }, 1000);
            });
        });

        /*
         * When Table has been loaded, add the language barrier! ;-)
         */

        waitFor('thead > tr').then(([table]) => {
            $('thead > tr').append('<th class="language-bar"> Language</th>');
            addLoader();
            doAjax();
        });

        /*
         * Helper to add Spinner on page.
         * Note: Once this component has been initialized, it'll stay on the page with
         * CSS display being 'none'. Thus, can be re-used without further DOM manipulation.
         * TODO: Refactor and move all the inline styling to CSS class.
         */

        function addLoader() {
            $('tbody > tr').each(function(i) {
                if (i >= 0) {
                    const img = document.createElement('img');
                    img.src = "https://image.ibb.co/bLqPSf/Facebook-1s-200px.gif";
                    img.width = "50";
                    img.height = "50";
                    img.style = "margin-left: 10px";
                    img.classList.add("rupesh-loader");
                    $('tbody > tr')[i].append(img);
                }
            });
        }

        function getLastUrlPath() {
            let locationLastPart = window.location.pathname
            if (locationLastPart.substring(locationLastPart.length - 1) == "/") {
                locationLastPart = locationLastPart.substring(0, locationLastPart.length - 1);
            }
            locationLastPart = locationLastPart.substr(locationLastPart.lastIndexOf('/') + 1);

            if (isNaN(+locationLastPart)) return "1";

            return +locationLastPart;
        }

        /*
         * @param AJAX with url.
         * @returns JSON that contains ID's that can be further fetched to find Lang metadata.
         */
        function doAjax() {
            const contextSuffix = window.location.href.split('/').filter((val) => val.indexOf('weekly-contest') > -1)[0];
            const page = getLastUrlPath();
            const url = `https://leetcode.com/contest/api/ranking/${contextSuffix}/?pagination=${page}`;
            // console.log("You are on page:", page);
            // console.info("The Url before making req:", url);

            fetch(url)
                .then((resp) => resp.json())
                .then(function(data) {
                    //console.log("Ranking API data return", data);
                    fetchSubmissionIDS(data);
                });
        }

        function fetchSubmissionIDS(data) {
            const submissions = [];

            data.submissions.forEach((submission, index) => {
                const one = Object.values(submission)[0];
                const id = one.submission_id;
                submissions.push({id, country: data.total_rank[index].data_region });
            });
            //console.log("Submission ID's are: ", ids);
            fetchLanguageInfo(submissions);
        }

        function doSyncCall(id, country) {
            let url = ''
            if (country === 'CN') {
                url = 'https://leetcode-cn.com/api/submissions/';
            } else {
                url = 'https://leetcode.com/api/submissions/';
            }

            return new Promise((resolve, reject) => {
                fetch(url + id)
                    .then(resp => resp.json())
                    .then((data) => {
                      return resolve(data.lang)
                    })
                    .catch((err) => resolve('N/A')); // TODO: Maybe retry promise after xx ms?
                                                    // Currently we are resolving the promise && proceeding.
            });
        }

        /*
         * At this point, this function does the following:
         * 1. It takes an array of ID's (leetcode submission ID)
         * 2. Fetch respective metadata from the leetcode submission API.
         * 3. Delegate the results to anther fxn to append to the DOM.
         *
         * Note: This is a promisified function that heavily relies on fetching data in sequence.
         *       This is because the appropriate ID needs to be shown the correct language choice.
         * TODO: Further optimization could be fetch everything async and maintain a running ID,
         *       And append their respective results to the DOM.
         */

        function fetchLanguageInfo(submissions) {
            const languageArr = [];

            submissions.reduce((promise, submission) => {
                const {id, country} = submission
                return promise.then((result) => {
                    return doSyncCall(id, country).then(val => {
                        languageArr.push(val);
                    });
                });
            }, Promise.resolve()).then(() => { // TODDO: Optimize with promise.all/race
                //console.log("Final Language Array: ", languageArr);
                appendLangToDOM(languageArr);
            });
        }

        /*
         * This method is currently deprecated. Thought of making this a helper method for something else.
         */

        function makeCallAndFetchLanguage(id, arr) {
            const url = `https://leetcode.com/api/submissions/${id}`;

            fetch(url)
                .then((resp) => resp.json())
                .then(function(data) {
                    //console.log("Language Results", data);
                    // Data is a JSON.
                    arr.push(Promise.resolve(data.lang));
                });
        }

        /*
         * It does exactly what it sounds like it does ;-)
         */

        function appendLangToDOM(arr) {
            let j = 0;

            // Hide the spinner.
            $('.rupesh-loader').css('display', 'none');

            // Append my submission.
            let startIndex = 0
            if ($("tbody").find(".success").length > 0) {
                const myTd = document.createElement('td');
                myTd.innerHTML = "You surely know it !!!"; // TODO: Make it dynamic.
                myTd.classList.add('td-my-data');
                $('.success').append(myTd);
                startIndex = 1
            }

            $('tbody > tr').each(function(i) {
                if (i >= startIndex) {
                    const td = document.createElement('td');
                    //console.log("array JAKE", arr[j]);
                    td.innerHTML = arr[j];
                    td.classList.add('td-lang-data');
                    $('tbody > tr')[i].append(td);
                    j++;
                }
            });
        }
    }


})();
