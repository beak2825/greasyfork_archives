// ==UserScript==
// @name       BI_DR Automator
// @version    0.6
// @description  Automates BI_DR hits
// @match      https://www.mturkcontent.com/dynamic/hit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/11030/BI_DR%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/11030/BI_DR%20Automator.meta.js
// ==/UserScript==

var urlPrefix = "https://www.ocado.com/webshop/getSearchProducts.do?entry=";
var searchString = $("tr:last td:last").text();
var searchUrl = searchString.replace(/ +/g,"+");
var url = urlPrefix+searchUrl;

$("table:first").append($("<tr></tr>").append($("<td></td>").attr("colspan","2").html("<a href="+url+">Click to visit search page</a>")));

console.log(url);

getPage1(url);

function getPage1(url)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        synchronous: true,

        onload: function (xhr) {
            r = xhr.responseText;
            var ret="";
            try{
                getSubUrl(r);
            }
            catch(err){
                console.log(err);
                return r;
            }
        }
    });
}

function getPage2(url)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        synchronous: true,

        onload: function (xhr) {
            r = xhr.responseText;
            var ret="";
            try{
                getInfo(r);
            }
            catch(err){
                console.log(err);
                return r;
            }
        }
    });
}

function getSubUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    var urlEnd = $("h4.productTitle a", el).attr("href");
    var url = "https://www.ocado.com" + urlEnd;
    console.log(url);
    $("table:first").append($("<tr></tr>").append($("<td></td>").attr("colspan","2").html("<a href="+url+">Click to visit product page (if found)</a>")));
    getPage2(url);
}

function getInfo(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    //Loaded, first&last name, wells fargo advisors logo
    var energyText = $("table.nutrition tr:nth-child(2) td:nth-child(2)", el).text();
    var energy = energyText.replace(/kj/gi, '');
    energy = energy.replace(/ /g, '');
    energy = energy.replace(/\/.*/,'');
    energy = energy.replace(/\(.*\)/,'');
    if (!energy || energy == "" || energy == null)
        $("#energykj").val("Not found");
    else
        $("#energykj").val(energy);
    $("table:first").after($("table.nutrition", el));
    $("table:first").after($("h1.productTitle", el));
}/**/