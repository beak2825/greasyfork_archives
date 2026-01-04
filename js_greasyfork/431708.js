// ==UserScript==
// @name      ASPR
// @include    https://atcoder.jp/contests/abc*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at   document-end
// @grant    GM.xmlHttpRequest
// @description 類似問題へのリンクをタブに追加するスクリプト
// @version 0.0.1.20210831115718
// @namespace https://greasyfork.org/users/810755
// @downloadURL https://update.greasyfork.org/scripts/431708/ASPR.user.js
// @updateURL https://update.greasyfork.org/scripts/431708/ASPR.meta.js
// ==/UserScript==
// original: https://stackoverflow.com/questions/53057715/tampermonkey-to-access-a-json-call-url-on-a-page
let url = location.href
let query = "https://aspr-tyama.herokuapp.com/echo?q="+url;
let apiURL = encodeURI(query);
console.log(query);

GM.xmlHttpRequest ( {
    method:         "GET",
    url:            apiURL,
    responseType:   "json",
    onload:         processJSON_Response,
    onabort:        reportAJAX_Error,
    onerror:        reportAJAX_Error,
    ontimeout:      reportAJAX_Error
});

function processJSON_Response (rspObj) {
    if (rspObj.status != 200 && rspObj.status != 304) {
        reportAJAX_Error (rspObj);
        return;
    }
	let res = rspObj.response;
	let html = '<div id="api_response"><ul>';
  	html += `<li>SImilar Problem</li>`;
    html += `<li>No.1 <a href="${res["results"][0]["url"]}">${res["results"][0]["title"]}</a></li>`
    html += `<li>No.2 <a href="${res["results"][1]["url"]}">${res["results"][1]["title"]}</a></li>`
    html += `<li>No.3 <a href="${res["results"][2]["url"]}">${res["results"][2]["title"]}</a></li>`
  	html += `</ul></div>`;
    $("body").append (html);
  	$("#api_response").css({
      "color": "white",
      "background": "black"
    });
    console.log(res);
    $("ul.nav-tabs").append(`<li class><a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-link" aria-hidden="true"></span>類似問題<span class="caret"></span></a><ul class="dropdown-menu"><li>No.1 <a href="${res["results"][0]["url"]}">${res["results"][0]["title"]}</a></li><li>No.2 <a href="${res["results"][1]["url"]}">${res["results"][1]["title"]}</a></li><li>No.3 <a href="${res["results"][2]["url"]}">${res["results"][2]["title"]}</a></li></ul></li>`)
}

function reportAJAX_Error (rspObj) {
    console.error (`TM scrpt => Error ${rspObj.status}!  ${rspObj.statusText}`);
}