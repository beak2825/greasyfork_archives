// ==UserScript==
// @name         Add average depth of sample and percentage of region with depth >= 20x
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hot patch for database.bio v3.1.0
// @author       L3
// @match        https://192.168.1.203/db*/vcf/*
// @match        https://10.60.13.111/db*/vcf/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/29990/Add%20average%20depth%20of%20sample%20and%20percentage%20of%20region%20with%20depth%20%3E%3D%2020x.user.js
// @updateURL https://update.greasyfork.org/scripts/29990/Add%20average%20depth%20of%20sample%20and%20percentage%20of%20region%20with%20depth%20%3E%3D%2020x.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    function getApiUrl()
    {
        var regexMatch = /\/vcf\/([\w-]+)/.exec(window.location.pathname);
        var vcfId = '';
        if (regexMatch && regexMatch.length > 1) {
            vcfId = regexMatch[1];
        }

        var url = window.location.href;
        url = url.substring(0, url.indexOf("vcf"));
        url += 'api/vcf/' + vcfId + '/';

        return url;
    }

    var $depthRow = $('<tr><td>On target average depth</td><td id="avg_depth">Loading...</td></tr>');
    var $percentRow = $('<tr><td>Percentage of region with depth &ge; 20x</td><td id="percent_depth_gt_20">Loading...</td></tr>');
    $('#align_qc > table > tbody').append($depthRow).append($percentRow);

    $.ajax({
        type: "GET",
        url: url,
        data: {
            'threshold': 20
        },
        success: function(data)
        {
            var totalLength = 0;
            var totalDepth = 0;
            var totalLengthWith20xOrMore = 0;

            data.table_data.forEach(function(row) {
                var length = parseInt(row[4]);
                var depth = parseFloat(row[5]);
                var percent = row[6];
                totalLength += length;
                totalDepth += depth * length;
                totalLengthWith20xOrMore += percent / 100 * length;
                console.log('Length:', length, ', Depth:', depth);
            });

            var averageDepth = Math.round(totalDepth / totalLength);
            console.log('Sample Average depth: ', averageDepth);
            $('#avg_depth').text(averageDepth);

            var percentOfDepthWith20xOrMore = Math.round(totalLengthWith20xOrMore / totalLength * 100 * 100) / 100;
            console.log('Percentage of Region with Depth >= 20x: ', percentOfDepthWith20xOrMore);
            $('#percent_depth_gt_20').text(percentOfDepthWith20xOrMore + '%');
        },
        error: function() {
            $('#avg_depth').text('No data');
            $('#percent_depth_gt_20').text('No data');
        }
    });
})(window.jQuery);
