// ==UserScript==
// @name         Dean Wang Linkedin Page Finder
// @namespace https://greasyfork.org/users/710
// @version      0.1
// @description  enter something useful
// @author       Tjololo
// @match       https://www.mturkcontent.com/dynamic/hit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14632/Dean%20Wang%20Linkedin%20Page%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/14632/Dean%20Wang%20Linkedin%20Page%20Finder.meta.js
// ==/UserScript==

var googleApiPrefix="https://www.google.com/search?q=";

var company = $('table td:last').text();
console.log(company);

var searchQuery = company+" inurl:linkedin.com"
var googleSearch = googleApiPrefix+encodeURI(searchQuery);
$('table').append($('<tr></tr>').append($('<td></td').html("<a href=\""+googleSearch+"\">Click to search google</a>")));
console.log(searchQuery);
console.log(googleSearch);

getGoogleResults(googleSearch);

$('table').append($('<tr></tr>').append($('<td></td').append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        var resultURL = getGoogleResults(googleSearch);
    }))));

function getGoogleResults(task){
    ret = httpGet(task);
    return ret;
}

function httpGet(theUrl)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,

        onload: function (xhr,theUrl) {
            r = xhr.responseText;
            //console.log(r);
            var ret="";
            try{
                ret = getUrl(r);
                console.log("ret");
                console.log(ret);
                if (ret != null)
                    $('#web_url').val(ret);
                else{
                    $('#web_url').val("N/A");
                }
            }
            catch(err){
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    var check = $("#captcha", el);
    if (check.length > 0){
        alert("Captcha");
    }
    var element = $("#cnt div.g", el).not("#imagebox_bigimages").eq(0);
    var $h3 = $("h3.r", element).eq(0);
    console.log($h3);
    if ($h3.length > 0) {
        console.log($("a", $h3).eq(0));
        url = $("a", $h3).eq(0).attr("href");
        return url;
    }
    else
        return null;
}