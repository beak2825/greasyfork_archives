// ==UserScript==
// @name         Jonathan Huston Script
// @version      0.4
// @description  Extracts the asin from first amazon result, and auto-fills it
// @author       Tjololo, clickhappier
// @match        https://s3.amazonaws.com/mturk_bulk/hits/*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/11633/Jonathan%20Huston%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/11633/Jonathan%20Huston%20Script.meta.js
// ==/UserScript==

var second = false;
var random = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
var urlStart = "http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords="
var text = $('a:first').text().replace(/&/g, "%26").replace(/ /g,"+");
var url = urlStart+text;

var timer = null;

httpGet(url);

$("input[name='ASIN']").parent().append(
    $("<button></button>", {
        type: "button",
        text: "STOP",
        id: "search_button"
    }).click(function() {
        if (timer)
            console.log("Timer cleared");
        else
            console.log("No timer yet");
        clearTimeout(timer);
    }));

function getASIN(href) {
    var asinMatch;
    asinMatch = href.match(/\/exec\/obidos\/ASIN\/(\w{10})/i);
    if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/exec\/obidos\/tg\/detail\/\-\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
    if (!asinMatch) { return null; }
    return asinMatch[1];
}

function httpGet(theUrl)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,

        onload: function (xhr,theUrl) {
            r = xhr.responseText;
            var ret="";
            try{
                ret = getUrl(r);
                $('input[name="ASIN"]').after($("<a></a>").attr("href",ret).text("Click to visit first result"));
                asin = getASIN(ret);
                console.log(asin);
                if (asin)
                    $('input[name="ASIN"]').val(asin);
                else
                    $('input[name="ASIN"]').val("NOASIN");
                timer = setTimeout(function() { console.log("click"); $("#submitButton").click(); }, random*1000);
            }
            catch(err){
                console.log(err);
                $('input[name="ASIN"]').val("NOASIN");
                timer = setTimeout(function() { console.log("click"); $("#submitButton").click(); }, random*1000);
                return r;
            }
        }
    });
}

function getAmazonResults(task){
    console.log("TASK: "+task);
    ret = httpGet(task);
    return ret;
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    el.html(html);
    var check = $("#captcha", el);
    if (check.length > 0){
        alert("Captcha");
    }
    console.log($("#apsRedirectLink h1", el).text());
    if (el.text().indexOf("did not match any") > -1 || $("#noResultsTitle", el).is(":visible"))
    {
        console.log("apsRedirectLink");
        return null;
    }
    var element = $("#result_0 a.a-link-normal", el);
    var url = element.attr("href");
    console.log($("img.s-access-image.cfMarker:first", el));
    var image = $("img.s-access-image.cfMarker:first", el).attr("src");
    $("div.panel.panel-primary").parent().append('<img src='+image+' />');
    return url;
}/**/