// ==UserScript==
// @name         BTS2 - FC-Research Table Parser
// @namespace    BTS2, amazon, fcresearch, parser
// @version      0.1
// @description  Parses defined items in a table and retrieve data from them in array
// @author       AA from BTS2
// @match        file:///*/LPN*.htm
// @include      http://fcresearch-eu.aka.amazon.com/*/results?*
// @include      https://fcresearch-eu.aka.amazon.com/*/results?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39471/BTS2%20-%20FC-Research%20Table%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/39471/BTS2%20-%20FC-Research%20Table%20Parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getColumn(table_id, col){
        var tab = document.getElementById(table_id);
        var header_nodes = document.getElementById(table_id+'_wrapper').querySelectorAll("th");
        var header_length = header_nodes.length / 2;
        var header_arr = new Array(header_length);
        while(header_length--){
            header_arr[header_length] = header_nodes[header_length]; // convert NodeList to an Array (half-sized) of Nodes
        }

        var n = tab.rows.length;
        var i, tr, td, items_arr = [];

        if (col < 0) return null;

        for (i = 0; i < n; i++) {
            tr = tab.rows[i];
            if (tr.cells.length > col){
                items_arr.push(tab.rows[i].cells[col].textContent);
            }
        }
        return delDups(items_arr);
    }

    function delDups(array){
        var seen = [];
        array.splice(0, 1); // deletes the first empty item in array
        return array.filter(function(item){
            return seen.hasOwnProperty(item) ? false : (seen[item] = true); // returns only the unique items
        });
    }

    function addParserIcon(){
        var elm = document.getElementById('inventory-lpn');
        var icon = '<span id="parserIcon" class="ui-icon ui-icon-circle-check" style="margin-left:45px;margin-top:-23px"></span>';
        elm.insertAdjacentHTML('beforeend', icon);
        elm.addEventListener('click', function(){
            var data = [];
            data = getColumn('table-inventory', 4);
            downloadFile(data, 'LPN_list.txt', 'text/plain');
        });
    }

    function downloadFile(data, name, type, stringify = false){
        if (stringify) data = JSON.stringify(data);
        var a = document.createElement('a');
        var file = new Blob([data], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    function ready(fn) {
        if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    // ----------------------------------------------------------
    ready(function(){
        addParserIcon();
    });

})();