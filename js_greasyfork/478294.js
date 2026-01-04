// ==UserScript==
// @name         Google Search with Obsidian
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search Obsidian while searching on Google and display the results on the right side of the page.
// @author       maidong
// @match        https://www.google.com.hk/*
// @match        https://www.google.com/*
// @grant        GM_log
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/478294/Google%20Search%20with%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/478294/Google%20Search%20with%20Obsidian.meta.js
// ==/UserScript==


(function($) {
    'use strict';

   // http server endpoint, start based with obsidian-vault directory
   var local_static_file_server="http://localhost:17890/"
   var omnisearch_server="http://127.0.0.1:51361/"
   var max_search_resut=10

   // Function to call the Obsidian search API
   function searchObsidian(keyword) {
       // Make an HTTP request to the Obsidian search API
       // Replace the authorization token and API endpoint with your own
       $.ajax({
           url: omnisearch_server+'search?q=' + encodeURIComponent(keyword),
           headers: {
               'Content-Type': 'application/json'
           },
           success: function(data) {
               // Process the response and display the results on the right side of the page
               displayResults(data);
           },
           error: function(error) {
               GM_log('Error calling Obsidian search API: ' + error);
           }
       });
   }

    // Function to display the search results
    function displayResults(results) {
        // Remove any existing search results
        $('#obsidian-results').remove();

        // Create a container for the search results
        var container = $('<div>').attr('id', 'obsidian-results')
        .css({'position': 'fixed',
              'top': '135px',
              'right': '0',
              'padding': '10px',
              'height': '1160px',
              'width': '500px',
              'background-color': '#fff',
              'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
              'padding': '16px',
              'z-index': '9999'
             });

        // Create an iframe to render the search results
        var iframe = $('<iframe>').attr('srcdoc', getIframeContent(results))
        .css({'width': '100%', 'height': '100%', 'border': 'none'});

        container.append(iframe);
        $('body').append(container);
    }

    // Function to generate the HTML content for the iframe
    function getIframeContent(results) {
        var html = "<html><head><style>body {padding:0;margin:0;background:0 0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'}</style></head><body>";

        var count = 0;
        // Loop through the search results and create a result element for each
        $.each(results, function(index, result) {
            if (count >= max_search_resut) {
                return false;
            }
            html += '<div style="margin-bottom: 16px;">';
            html += '<h3 style="font-size: 18px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">';
            html += '<a target="_blank" href="' +local_static_file_server+ result.path + '">' + result.basename + '</a></h3>';
            var excerpt = result.excerpt.length > 100 ? result.excerpt.substring(0, 100) + '...' : result.excerpt;
            html += '<span style="font-size: 14px; color: #70757a; display: block; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">';
            html += excerpt + '</span>';
            html += '</div>';
            count++;
        });


        html += '</body></html>';
        return html;
    }

    // Get the keyword from the URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var keyword = urlParams.get('q');

    // Call the Obsidian search API
    searchObsidian(keyword);
})(jQuery);