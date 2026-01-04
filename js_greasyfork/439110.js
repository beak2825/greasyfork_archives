// ==UserScript==
// @name         Cosmos file plain view
// @namespace    https://lego.binginternal.com/
// @version      0.5
// @description  Show the content of Cosmos files as plain text
// @include      https://www.cosmos*.osdinfra.net/cosmos/*?property=info
// @downloadURL https://update.greasyfork.org/scripts/439110/Cosmos%20file%20plain%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/439110/Cosmos%20file%20plain%20view.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textLimit = 5242880;

    $(document).ready(function() {
        // var opMenu = $('div#TheMenuBar>ul:nth-child(1)>li:nth-child(2)');
        // var viewMenu = opMenu.clone(false);
        // viewMenu.html(viewMenu.children('span:nth-child(1)'));
        // viewMenu.children('span').text('View Plain');
        // viewMenu.insertAfter(opMenu);

        var fileSize = parseInt($('div#details_fileinfo tr:nth-child(5)>td').text().slice(0, -6).replaceAll(',', ''));
        var payload = {
            selected: window.location.pathname.substring(1),
            returnPath: window.location.pathname.substring(1),
            offset: 0,
            length: isNaN(fileSize) ? textLimit : Math.min(fileSize, textLimit)
        };

        var serialize = function(obj) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            }
            return str.join('&');
        };

        // viewMenu.click(function() {
            var $table = $('table[role="grid"]');
            var $myTable = $table.clone();
            $table.hide();
            $table.parent().prepend($myTable);
            var theadTr = $myTable.find('thead>tr');
            // var theadTr = $('table[role="grid"]>thead>tr');
            theadTr.empty();
            var theadTrTh = $('<th>', {'class': 'k-header', 'data-field': 'Content', 'data-title': 'Content', 'scope': 'col'});
            theadTrTh.text('Content');
            theadTr.append(theadTrTh);

            var contentPane = $myTable.find('tbody');
            // var contentPane = $('table[role="grid"]>tbody');
            var loading = $('div#FilePreviewNoRecordsText');
            var hint = $('div#FilePreviewGridHint');

            contentPane.html('<tr><td></td></tr>');
            loading.text('Preparing file preview... If the page does not respond, consider reloading the page.');
            hint.hide();

            var loadingImg = $('<div>', {'class': 'k-loading-mask', 'css': {'width': '100%', 'height': '100%', 'top': '0px', 'left': '0px'}});
            loadingImg.html('<span class="k-loading-text">Loading...</span><div class="k-loading-image"></div><div class="k-loading-color"></div>');
            var previewGrid = $('div#FilePreviewGrid');
            previewGrid.prepend(loadingImg);

            $.post('/FileOp/DownloadPartialStream', serialize(payload), function(data) {
                var pre = $('<pre>', {'css': {'font-size': '1.33em'}});
                pre.text(data);
                contentPane.find('td').append(pre);
                loading.text('');
                loadingImg.remove();
                if (isNaN(fileSize) || fileSize > textLimit) {
                    hint.text('Showing only the beginning ' + (textLimit / 1048576).toLocaleString('en-US', { maximumFractionDigits: 2 }) +
                              ' MB. The content shown above has been truncated.');
                    hint.show();
                }
            }, 'text');
        // });
    });
})();
