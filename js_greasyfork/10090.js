// ==UserScript==
// @name        aStore Strip
// @namespace   aStore Strip
// @include     http://astore.amazon.com/httpawesomenc-20/detail/*
// @version     1.1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant       none
// @description:en astore
// @description astore
// @downloadURL https://update.greasyfork.org/scripts/10090/aStore%20Strip.user.js
// @updateURL https://update.greasyfork.org/scripts/10090/aStore%20Strip.meta.js
// ==/UserScript==


var mainsubheader = document.getElementById("mainsubheader");
mainsubheader.outerHTML = "";
delete mainsubheader;


var addToCartForm = document.getElementById("addToCartForm");
addToCartForm.outerHTML = "";
delete addToCartForm;


var detailImage = document.getElementById("detailImage");
detailImage.outerHTML = "";
delete detailImage;


var productDetails = document.getElementById("productDetails");
productDetails.outerHTML = "";
delete productDetails;


var sidebar = document.getElementById("sidebar");
sidebar.outerHTML = "";
delete sidebar;


var footer = document.getElementById("footer");
footer.outerHTML = "";
delete footer;

$("h2 br").remove();
$("h2 span").remove();
$("#detailheader p").remove();
$("#detailheader a").remove();
$("#detailheader br").remove();
$("#prices").remove();
$("#productDescription h2").remove();

jQuery.fn.stripTags = function() {
        return this.replaceWith( this.html().replace(/<\/?[^>]+>/gi, '') );
};

$("#productDescription p").stripTags();