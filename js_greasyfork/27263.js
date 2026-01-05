// ==UserScript==
// @name        Erev bulgarian battle orders
// @include     *www.erevollution.com/en/index
// @include     *www.erevollution.com/bg/index
// @connect     erev.esy.es
// @connect     docs.google.com
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     0.06
// @grant       GM_xmlhttpRequest
// @description Battle orders for erev
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/27263/Erev%20bulgarian%20battle%20orders.user.js
// @updateURL https://update.greasyfork.org/scripts/27263/Erev%20bulgarian%20battle%20orders.meta.js
// ==/UserScript==

var $ = jQuery;

function style(t) {
    $("head").append("<style>" + t + "</style>");
}


function main() {
    var url = "http://erev.esy.es/orders.php";
    style("#orddiv{width: 333px;}");
    style("#orddiv ul {list-style-type: none; padding: 10px 0 0 10px;}");
    $("#orddiv").append("<ul></ul>");
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            var orders = $.parseJSON(response.responseText);
            $.each(orders, function(id, row) {
				link = row.link.length == 0 ? row.caption : "<a href='" + row.link + "' target='_blank'>" + row.caption + "</a>";
                $("#orddiv ul").append("<li>" + link + "</li>");
            });
        }
    });
}


$('.vs169:first').before("<div id='orddiv'></div>");
(/erevollution.com\/en\/index/ || /erevollution.com\/bg\/index/) && main();
