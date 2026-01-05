// ==UserScript==
// @name         CT Do-er thingy
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.6
// @description  For the Crowd Tasks's
// @author       Tjololo
// @match        https://www.mturk.com/mturk*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10747/CT%20Do-er%20thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/10747/CT%20Do-er%20thingy.meta.js
// ==/UserScript==
// ------------------------------------------------------------------------------------

var numResults = 2;
var googleApiPrefix="https://www.google.com/search?q=";
var company = $('li.-list-item:first').text().split(":")[1].trim();
var url = company.replace(/ /g,"%20")+"%20-inurl:facebook.com%20-inurl:yelp.com%20-inurl:plus.google.com%20-inurl:linkedin.com%20-inurl:hoovers.com%20-inurl:opencompany.org&nfpr=1";
var url2 = googleApiPrefix+url;
$('#Answer_1_FreeText').val("NA");

$('div.HITAnswer-wrapper').append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        var resultURL = getGoogleResults(url2);
    }));

$("#search_button").hide();

$("#search_button").click();

$("div.HITAnswer-wrapper").parent().append(
    $("<div></div>", {
        html: "<b>Results</b><br /><table id=\"results_table\"><tr><th style=\"border: 1px solid black\">Click to select</th><th style=\"border: 1px solid black\">Click to open corresponding URL</th></tr></table>",
        id: "results_div"
    }));

$("#results_div").parent().append(
    $('<table></table>')
    .append($("<tr></tr>")
            .append($("<td></td>")
                    .append($("<input type='text' value='"+numResults+"' />")
                            .attr("id", "numResultID")
                            .attr("name", "numResultID")
                           )
                   )
            .append($("<td></td>")
                    .attr("id","numResultsButton")
                    .css('border', '3px solid black')
                    .click(function() { reSearch(); })
                    .text("Update")
                   )
           )
    .append($("<tr></tr>")
            .append($("<td></td>")
                    .append($("<td></td>")
                            .append($("<input type='text' value='"+url2+"' />")
                                    .attr("id", "queryID")
                                    .attr("name", "queryID")
                                   )
                           )
                    .append($("<td></td>")
                            .attr("id","queryButton")
                            .css('border', '3px solid black')
                            .click(function() { reSearch(); })
                            .text("Search this link")
                           )
                   )
           )
);

function reSearch(){
    numResults = $("#numResultID").val();
    query = $("#queryID").val();
    $("#results_table").html("<tr><th style=\"border: 1px solid black\">Click to select</th><th style=\"border: 1px solid black\">Click to open corresponding URL</th></tr>");
    $("#search_button").click();
}


String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(match, number) {
        return args[number] !== undefined ? args[number] : match;
    });
};

function getGoogleResults(task){
    console.log("TASK: "+task);
    //var ret = "temp";
    var ret = httpGet(task);
    return ret;
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    el.html(html);
    var element = $("#rso li.g", el).not("#imagebox_bigimages").not(".ads-ad").eq(0);
    var $h3 = $("h3.r", element).eq(0);
    console.log($h3);
    if ($h3.length > 0) {
        console.log($("a", $h3).eq(0));
        url = $("a", $h3).eq(0).attr("href");
        return url;
    }
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
                for (var i = 0; i < numResults; i++){
                    $("#results_table").append($('<tr>')
                                               .append($('<td>')
                                                       .text(ret[i][0])
                                                       .css('border', '1px solid black')
                                                      )
                                               .append($('<td>')
                                                       .text(ret[i][1])
                                                       .css('border', '1px solid black')
                                                      )
                                              );
                    $("#results_table tbody").find("tr:last")
                    .find("td:first").click(function () {
                        var retval = fillTextbox($(this));
                    });
                    $("#results_table tbody").find("tr:last").find("td:last").click(function () {
                        var retval = openPage($(this).parent());
                    });
                }
                console.log(ret);
            }
            catch(err){
                console.log(err);
                return r;
            }
        }
    });
}

function getGoogleResults(task){
    console.log("TASK: "+task);
    ret = httpGet(task);
    return ret;
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    var check = $("#captcha", el);
    if (check.length > 0){
        alert("Captcha");
        captcha = true;
    }
    el.html(html);
    for (var i = 0; i < numResults; i++){
        var element = $("#rso li.g", el).not("#imagebox_bigimages").eq(i);
        item = [];
        var $h3 = $("h3.r", element).eq(0);
        console.log($h3);
        if ($h3.length > 0) {
            console.log($("a", $h3).eq(0));
            url = $("a", $h3).eq(0).attr("href");
            item.push(url);
        }
        var $h3s = $("div.s", element).eq(0);
        if ($h3s.length > 0) {
            console.log($h3s.text());
            text = $h3s.text();
            item.push(text);
        }
        finalUrl.push(item);
    }
    return finalUrl;
}

function fillTextbox(tableCell) {
    $('#Answer_1_FreeText').val(tableCell.text());
    //$('a.submit-btn').click();
}
function openPage(tableCell) {
    var url = $(tableCell).find("td:first").text();
    window.open(url);
}

$('input[type="radio"][value="No"]').click(function() { $('input.answerInput[type="text"]:first').val(""); });