// ==UserScript==
// @name         Table to Markdown Copier
// @name:vi      Chép bảng HTML qua dạng markdown
// @namespace    https://github.com/hotmit/table-markdown-userscript
// @version      1.0.1
// @description  Convert html table to markdown format
// @description:vi  Chuyển bảng html (table) qua dạng markdown.
// @author       Du Dang
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require 	 https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.16/clipboard.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/26890/Table%20to%20Markdown%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/26890/Table%20to%20Markdown%20Copier.meta.js
// ==/UserScript==
(function($) {
    'use strict';

    // max cell with in chars count
    var MAX_COL_SIZE = 80;

    var Str = {};

    $(function(){
        var lastThreeKeys = [], combinationLength = 3;

        // region [ Display Control ]
        /**
         * Insert the "MD" button to all the last cell in the header of
         * all the tables in the current page.
         * @private
         */
        function displayTableControl(){
            $('table').each(function(i, e){
                var id = 'btn-copy-md-' + i, $tb = $(e),
                    $btnMd = $('<button type="button" class="convert-to-markdown btn btn-primary" />'),
                    $lastCell = $tb.find('tr:first').find('td:last, th:last').first();

                $btnMd.css({
                    height: '20px',
                    width: '30px',
                    'background-color': '#81358c',
                    color: '#fff',
                    padding: '0'
                }).text('MD').attr('id', id);

                // copy markdown content to the clipboard
                new Clipboard('#' + id, {
                    text: function() {
                        return convertTableToMd($btnMd);
                    }
                });

                $lastCell.append($btnMd);
            });

            //$('.convert-to-markdown').click(convertTableToMd);
        }
        // endregion

        // region [ Code ]
        /**
         * Extract the data from the table. Return array of row of data along with
         * the maximum length for each column.
         *
         * @param $table
         * @returns {{maxLengths: Array, tableData: Array}}
         * @private
         */
        function getData($table){
            var maxLengths = [], tableData = [];

            function setMax(index, length){
                // create new column if does not exist
                while(index >= maxLengths.length){
                    maxLengths.push(0);
                }
                maxLengths[index] = Math.max(maxLengths[index], length);
            }

            $table.find('tr').each(function(trIndex, tr){
                var $tr = $(tr), row = [], offset = 0;

                $tr.find('td, th').each(function(i, td){
                    var $td = $(td), text = getText($td, trIndex), tl = text.length,
                        index = i + offset, colspan = $td.attr('colspan');

                    setMax(index, tl);
                    row.push(text);

                    if (colspan && $.isNumeric(colspan) && Number(colspan) > 1){
                        colspan = Number(colspan);
                        offset += colspan - 1;
                        for (var k=0; k<colspan; k++){
                            row.push('');
                        }
                    }
                });

                tableData.push(row);
            });

            return {
                maxLengths: maxLengths,
                tableData: tableData
            };
        }

        /**
         * Convert the data from getData to actual markdown content.
         *
         * @param $btn - The "MD" button housed inside the table.
         * @returns {string} - The markdown table content
         * @private
         */
        function convertTableToMd($btn){
            var md = '', $table = $btn.parents('table').first(), data = getData($table), i, k,
                maxLengths = data.maxLengths;

            for (i=0; i<data.tableData.length; i++){
                var row = data.tableData[i], rowMd = '| ', sepMd = '| ';

                for(k=0; k<row.length; k++){
                    var rowWidth = Math.min(maxLengths[k], MAX_COL_SIZE),
                        text = Str.padRight(row[k], ' ', rowWidth);
                    rowMd += text + ' | ';

                    // add header separator
                    if (i === 0){
                        sepMd += Str.repeat(' ', rowWidth) + ' | ';
                    }
                }

                if (rowMd.length > 2){
                    md += Str.trim(rowMd) + "\n";
                    if (sepMd.length > 2){
                        md += Str.trim(sepMd).replace(/ /g, '-') + "\n";
                    }
                }
            }

            md += getReferenceLink($table);

            // copied indicator
            $btn.css('background-color', '#6AB714');
            setTimeout(function(){
                $btn.css('background-color', '#81358c');
            }, 3000);

            return md;
        }

        /**
         * Generate markdown link to the table for future reference.
         *
         * @param $table
         * @returns {*}
         */
        function getReferenceLink($table) {
            var refLink, $anchor, refId = $table.attr('id'), href = location.href;

            if(!refId) {
                $anchor = $table.parents('[id]').first();
                if ($anchor.length){
                    refId = $anchor.attr('id');
                }
            }

            if (refId) {
                if (href.indexOf('#') != -1) {
                    refLink = href.replace(/#.+/, '#' + refId);
                }
                else {
                    refLink = href + '#' + refId;
                }
            }
            // if no id link, then just use the main link as reference
            refLink = refLink || href;
            return '[Table Source](' + refLink + ')';
        }

        /**
         * Clean up the text for the cell content. Like remove new line so it doesn't break the table.
         *
         * @param $td
         * @param trIndex
         * @returns {string|*}
         */
        function getText($td, trIndex) {
            var text = $td.text();
            if (trIndex === 0){
                // remove the MD link from the text
                text = text.replace(/MD$/, '');
            }
            text = text.replace("\n", '');
            text = text.replace(/\s/g, ' ');
            return Str.trim(text);
        }
        // endregion

        // region [ Capture shortcut keys ]
        // Activate Markdown Converter Interface
        //      => Shift, Shift, T (3 key strokes as a sequence, NOT press all together)
        $(document).on('keydown', function(e) {
            lastThreeKeys.push(e.which);
            lastThreeKeys = lastThreeKeys.slice(-combinationLength);
            if (lastThreeKeys.toString() == '16,16,84') {
                displayTableControl();
                e.preventDefault();
                return false;
            }
        });
        // endregion

        // uncomment for dev
        // displayTableControl();

    }); //end jqReady

    // region [ Str Lib ]
    Str.trim = function (s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    };

    Str.padRight = function(s, padStr, totalLength){
        return s.length >= totalLength  ? s : s + Str.repeat(padStr, (totalLength-s.length)/padStr.length);
    };

    Str.repeat = function(s, count) {
        var newS = "", i;
        for (i=0; i<count; i++) {
            newS += s;
        }
        return newS;
    };
    // endregion

})(jQuery.noConflict(true));
