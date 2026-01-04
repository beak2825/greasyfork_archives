// ==UserScript==
// @name         codeforces_submission_accept
// @name:zh-CN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show your accepted submissions on your sidebar
// @author       aerian
// @match        https://codeforces.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381048/codeforces_submission_accept.user.js
// @updateURL https://update.greasyfork.org/scripts/381048/codeforces_submission_accept.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($ === undefined) {
        return ;
    }
    var sideElement = $('.personal-sidebar')[0];
    if (sideElement !== undefined) {
        var handle = sideElement.getElementsByClassName('rated-user')[0].innerText;
        console.log(handle);
        function getProblems(from, count, sum) {
            $.ajax({
                url:"https://codeforces.com/api/user.status?handle=" + handle + "&from=" + from + "&count=" + count,
                type:"GET",
                dataType: "jsonp",
                success: function (data){
                    console.log(data);
                },
                error: function(response){ // Why error here?
                    var data = response.responseText;
                    var jsonp = JSON.parse(data);
                    var result = jsonp['result'];
                    if (result.length !== 0) {
                        for (var i in result) {
                            if (result[i]['verdict'] === 'OK') {
                                sum++;
                            }
                        }
                        console.log(sum);
                        getProblems(from + count, count, sum);
                    } else {
                        sideElement.getElementsByClassName('nav-links')[0].getElementsByTagName('li')[3].getElementsByTagName('a')[0].innerText = "Submissions("+sum+")";
                    }
                }
            });
        }
        getProblems(1, 1000, 0);
    }
})();