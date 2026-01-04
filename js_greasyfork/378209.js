// ==UserScript==
// @name        Timesheet
// @include     https://*/secure/RapidBoard.jspa*
// @match        http://10.217.50.10:8080/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     4.2.1
// @grant    GM_xmlhttpRequest
// @grant    GM_addStyle
// @namespace http://tampermonkey.net/
// @description showepicname
// @downloadURL https://update.greasyfork.org/scripts/378209/Timesheet.user.js
// @updateURL https://update.greasyfork.org/scripts/378209/Timesheet.meta.js
// ==/UserScript==
var doing_modifications = false;
var $j = jQuery.noConflict(true);

var matched,j_browser;
$j.uaMatch = function (ua) {
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];
    return {
        j_browser: match[1] || '',
        version: match[2] || '0'
    };
};

matched = $j.uaMatch(navigator.userAgent);
j_browser = {
};
if (matched.j_browser) {
    j_browser[matched.j_browser] = true;
    j_browser.version = matched.version;
}
if (j_browser.chrome) {
    j_browser.webkit = true;
} else if (j_browser.webkit) {
    j_browser.safari = true;
}
$j.browser = j_browser;


$j(document).ready(function () {
    var timer=0;

    $j( "body" ).bind("DOMSubtreeModified", function(){
        if (timer)
        {
            window.clearTimeout(timer);
        }
        if(! doing_modifications) {
            timer = window.setTimeout(function() {
                GetIssueValue();
            }, 100);
        }
    });
});

function GetIssueValue(){
    $j('.dropper').each(function (index){
        var comment = $j(this).find('.commentSection')
        if ($j(this).find('.issueLink').length){
            var text = $j(this).find('img')[1].id;
            text = text.replace("img-", "");
            var EpickName = GetEpicName(text, comment);
        }
    });
}

function GetEpicName(IssueID , comment){
    var ret = GM_xmlhttpRequest({
        method: "GET",
        url: "http://10.217.50.10:8080/rest/api/latest/issue/"+IssueID+"?_=1550232198789", // pobieranie pola o idEpicka
        responseType:   "json",
        onload: function(res) {
            var epic = res.response.fields.customfield_10101;
            if(epic != null){
                var ret = GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://10.217.50.10:8080/rest/api/latest/issue/"+epic+"?_=1550232198789",
                    responseType:   "json",
                    onload: function(resp) {
                        var epickname = resp.response.fields.customfield_10104;
                        comment.html(epickname);
                        comment.attr('class', "aui-label "+resp.response.fields.customfield_10105);
                    }
                });
            }
        }
    });
}
