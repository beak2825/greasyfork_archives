// ==UserScript==
// @name        Download crowdestor agreements
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Download all crowdestor project agreements with one click
// @match       https://crowdestor.com/en/clients/investments
// @require     http://code.jquery.com/jquery-latest.js
// @author      Crowdestor Action
// @downloadURL https://update.greasyfork.org/scripts/459872/Download%20crowdestor%20agreements.user.js
// @updateURL https://update.greasyfork.org/scripts/459872/Download%20crowdestor%20agreements.meta.js
// ==/UserScript==

var totalCount = 0;

function runAfterPageLoads(callback) {
    setTimeout(function(){
        if ($("#investment_list_processing").is(":visible")) {
            runAfterPageLoads(callback);
            console.log('waiting...');
        } else {
            callback();
        }
    }, 100);
}

function downloadSingle(hrefs) {
    var href = hrefs.shift();
    href.download = 'true';
    href.click();
    totalCount++;
    if (hrefs.length > 0) {
        setTimeout(function(){
            downloadSingle(hrefs);
        }, 2500);
    } else {
        var nextButton = $('.paginate_button.next');
        if (nextButton.is(".disabled")){
            $("#overlay").toggle(false);
            alert("Downloaded " + totalCount + " documents");
        } else {
            nextButton.click();
            runAfterPageLoads(function() {
                downloadAllOnPage();
            });
        }
    }
}

function downloadAllOnPage(){
    var hrefs = new Array();
    $('div[class="transactions--subinfo"] > a[title="Download agreement"]').each(function(idx, el) {
        hrefs.push(el)
    });
    downloadSingle(hrefs);
}

function addGlobalStyle(css) {
    let target = document.head || document.body;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = (css).replaceAll(';', ' !important;');
    target.append(style);
}

$(document).ready(function() {
    addGlobalStyle(`
    #overlay {
        position: fixed;
        top: 0%;
        left: 0%;
        width: 100%;
        height: 100%;
        background-color: black;
        -moz-opacity: 0.6;
        filter: alpha(opacity=60);
        opacity:.60;
        z-index:1001;
        text-align: center;
    }
    #overlay span {
        position:relative;
        top:50%;
        font-weight: bold;
        font-size: 30px;
        color: white;
    }
    `);
    $("body").append('<div id="overlay" style="display:none"><span>Please wait...</span></div>');
    $(".clients--box-small-pdd").after('<input type="button" value="Download Agreements" id="dld"></input>');
    $('#dld').click(function(){
        var prevButton = $('.paginate_button.previous');
        if (prevButton.is(".disabled")){
            totalCount = 0;
            $("#overlay").toggle(true);
            downloadAllOnPage();
        } else {
            $('#investments_apply_filters').click();
            setTimeout(function(){
                runAfterPageLoads(function() {
                    downloadAllOnPage();
                });
            }, 1000);
        }
    });
});