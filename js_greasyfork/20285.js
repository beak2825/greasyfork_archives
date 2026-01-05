// ==UserScript==
// @name        Fetch Total Number of Viewable Hits
// @author      StubbornlyDesigned
// @description Fetches the current number of viewable hits on mturk.
// @namespace   https://greasyfork.org/en/users/35961-stubbornlydesigned
// @version     1.1
// @match       https://www.mturk.com/mturk/findhits?match=false*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20285/Fetch%20Total%20Number%20of%20Viewable%20Hits.user.js
// @updateURL https://update.greasyfork.org/scripts/20285/Fetch%20Total%20Number%20of%20Viewable%20Hits.meta.js
// ==/UserScript==

(function () {
    var total = 0,
        totalPages = 0,
        hitsUrl = 'https://www.mturk.com/mturk/findhits?match=false&pageSize=100',
        currentUrl = '';

    function parse(data) {
        if(!data.querySelector('td[class="error_title"]')) {
            var available = data.querySelectorAll('a[id^="number_of_hits"]');
            totalPages = data.forms.hitGroupsForm.querySelector('td:nth-of-type(3) span:first-of-type a:last-of-type').search.match(/pageNumber=(\d+)/)[1];

            if(available.length) {
                [].slice.call(available).forEach(function(el) {
                    total = (total + Number(el.parentElement.parentElement.lastElementChild.innerText.trim()));
                });

                var next = '';

                if(data.forms.hitGroupsForm.querySelector('td:nth-of-type(3) span:first-of-type').outerHTML.includes('Next')) {
                    [].slice.call(data.forms.hitGroupsForm.querySelectorAll('td:nth-of-type(3) span:first-of-type a')).forEach(function(el) {
                        if(el.innerText.includes('Next')) {
                            next = el.href + '&pageSize=100';
                        }
                    });
                }

                if(next) {
                    return next;
                } else {
                    return 'completed';
                }
            }
        }

        throw new Error('You have exceeded the maximum number of page requests.');
    }

    function get(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function() {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.responseType = 'document';
            req.onerror = function() {
                reject(Error("error"));
            };
            req.send();
        });
    }

    function run() {
        var url = !currentUrl ? hitsUrl : currentUrl;
        get(url)
            .then(function(res) {
                var nextMove = parse(res);
                var currentPage = url.match(/pageNumber=(\d+)/) ? url.match(/pageNumber=(\d+)/)[1] : 1;
                document.getElementById('totalAvailableHits').innerText = currentPage + ' / ' + totalPages;
                if(nextMove) {
                    if(nextMove.includes('mturk')) {
                        currentUrl = nextMove;
                        setTimeout(function() {run();}, 200);
                    } else if(nextMove == 'completed') {
                        document.getElementById('totalAvailableHits').innerText = total;
                        total = 0;
                        totalPages = '';
                        currentUrl = '';
                    }
                }
            })
            .catch(function(err) {
                console.log(err);
                setTimeout(function() {run();}, 1000);
            });
    }

    function init() {
        var el = document.getElementById('user_name_field');
        el.setAttribute('id', 'totalAvailableHits');
        el.innerText = 'Fetch Total Available Hits';
        el.style.cursor = 'pointer';

        el.addEventListener('click', function() {run();});
    }

    init();
})();