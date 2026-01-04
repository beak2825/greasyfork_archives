// ==UserScript==
// @name         My Submissions
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add link to my submissions
// @author       beet
// @match       *://judge.u-aizu.ac.jp/onlinejudge/description.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415786/My%20Submissions.user.js
// @updateURL https://update.greasyfork.org/scripts/415786/My%20Submissions.meta.js
// ==/UserScript==

function getJson(url){
    return $.ajax(
	{
	    type     : 'GET',
	    url      : url,
	    dataType : 'json',
	    timeout  : 20000,
	});
};

(function() {
    'use strict';
    $(window).load(() => {
    const user = $("#status")[0].outerHTML.replace(/.*?id=(.*)\" .*/, '$1');
    const problem = window.location.search.replace(/.*?id=(\d*).*/, '$1');
    const url = "https://judgeapi.u-aizu.ac.jp/solutions/users/" + user + "/problems/" + problem;
    function create(x) {return "<a href=\"http://judge.u-aizu.ac.jp/onlinejudge/review.jsp?rid=" + x + "\">" + x + "</a>";};
    getJson(url).done(function(data){
        $("#pageinfo .wrapper").append("<br><span class=\"test\">My Submissions: </span>");
        data.forEach(x => $("#pageinfo .wrapper").append(create(x.judgeId) + ", "));
    });
    });
})();