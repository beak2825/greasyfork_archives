// ==UserScript==
// @name         DCF Filing Embed
// @namespace https://greasyfork.org/users/710
// @version      0.2
// @description  enter something useful
// @author       Tjololo
// @match        https://www.mturkcontent.com/dynamic*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13085/DCF%20Filing%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/13085/DCF%20Filing%20Embed.meta.js
// ==/UserScript==

var a = $('table.task_parameters a:first').attr("href");

var iframeString ='<iframe width="700" height="600" frameborder="1" scrolling="yes" marginheight="0" marginwidth="0" src="'+ a +'"></iframe>';

$('table.task_parameters').after($('<div></div>').html(iframeString));

function setDate(date) {
    $("#ReportDate").val(date);
}

getDate(a);

function getDate(url)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        synchronous: true,

        onload: function (xhr) {
            r = xhr.responseText;
            var ret="";
            getInfo(r);
        }
    });
}

function getInfo(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    //Loaded, first&last name, wells fargo advisors logo
    var date = $("div.formContent div.formGrouping:last div.info:first", el).text();
    $("#ReportDate").val(date);
}