// ==UserScript==
// @name        KG - Import description from IMDb
// @description Automatically imports IMDb plot, country and languages to KG upload form
// @author      tadanobu
// @namespace   KG
// @match       https://karagarga.in/upload.php*
// @version     1.2
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419266/KG%20-%20Import%20description%20from%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/419266/KG%20-%20Import%20description%20from%20IMDb.meta.js
// ==/UserScript==

// Retrieve IMDb movie ID from KG upload form
var IMDbURL = $("[name='link']").val();
var IMDbID = IMDbURL.split('/title/tt')[1].split('/')[0];

// Scrape IMDb and import data
GM.xmlHttpRequest({
    method: "GET",
    url: "https://www.imdb.com/title/tt" + IMDbID + "/",
    onload: function(response) {
        // Import whole IMDb page in hidden div to handle data easily - Can be improved
        $("<div/>").attr('id', 'tempDiv').appendTo('body');
        $('#tempDiv').hide();
        $('#tempDiv').html(response.responseText);

        // Display IMDb plot in desription textarea
        $('#bbcodetextarea').html('[B]IMDb plot[/B]\r\n' + document.getElementById('titleStoryLine').getElementsByTagName('p')[0].getElementsByTagName('span')[0].textContent.trim());

        var h4s = document.getElementsByTagName('h4');
        for (var i = 0; i < h4s.length; i++) {
            var h4 = h4s[i];
            // Display language(s)
            if (h4.textContent == 'Language:') {
                var as = h4.parentNode.getElementsByTagName('a');
                for (var j = 0; j < as.length; j++) {
                    if (j == 0) {
                        $("[name='lang']").val($("[name='lang']").val() + as[j].textContent.trim());
                    } else {
                        $("[name='lang']").val($("[name='lang']").val() + ', ' + as[j].textContent.trim());
                    }
                }
            }
            // Select country from list
            if (h4.textContent == 'Country:') {
                var as = h4.parentNode.getElementsByTagName('a');
                $("[name='country_id']").attr('id', 'selectCountry');
                $("#selectCountry option").filter(function() {
                    return $(this).text() == as[0].textContent.trim();
                }).prop('selected', true);
            }
        }
    }
});