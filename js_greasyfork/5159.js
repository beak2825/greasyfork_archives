// ==UserScript==
// @name       Chris Wong HIT Helper
// @namespace  http://ericfraze.com
// @version    0.2
// @description  Changes the plain text in "Find the News section and facebook/twitter page for these websites" to a real link.
// @include    https://s3.amazonaws.com/mturk_bulk/hits/*
// @include    https://www.mturkcontent.com/dynamic/hit*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5159/Chris%20Wong%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5159/Chris%20Wong%20HIT%20Helper.meta.js
// ==/UserScript==

 $(document).ready(function() {
     $('#DataCollection > div > table > tbody > tr:nth-child(2) > td:nth-child(2)').filter(function(index) {
            var url = $(this).text();
            url = url.replace("http://", "");
            $(this).html("<a target='_blank' href='http://" + url + "'>" + $(this).text() + "</a>");
            return false;
        });
});