// ==UserScript==
// @name         Alwaysup script
// @version      1.0.1
// @description  Add quck filter feature to AlwaysUp
// @author       Dmitry K
// @namespace    http://versonix.com
// @include     /^https?://.*?:8585/application.*$/
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/368464/Alwaysup%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/368464/Alwaysup%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // add quicksort
    $('<td align=right><label>Quick Filter: <input type=text placeholder=Filter... list=quickFilterList id=quickFilter><button id=quickFilterReset>x</button><datalist id=quickFilterList></datalist></label></td>').appendTo($("body>p>table[border=1] table[cellpadding=4] tr"));
    const mainTable = $("body>p>table[border=1] table[cellpadding=6] tr:gt(0)");
    let dataList = $("#quickFilterList");
    $("#quickFilter")
    .val(localStorage.getItem("quickFilter"))
    .on('input', (e) => {
        localStorage.setItem("quickFilter", e.target.value);
        let filter = e.target.value.toLowerCase();
        mainTable.each(
            (i, e) => {
                let el = $(e);
                el.toggle(el.text().toLowerCase().indexOf(filter) >= 0);
            }
        )
    })
    .trigger("input").focus().select();
    $("#quickFilterReset").on("click", e => $("#quickFilter").val("").trigger("input"))
    let words = new Set(mainTable.text().split(/[\W+\s]+/).map(word=>word.toLowerCase()).filter(word => word.length>2 && /^[a-zA-Z]/.test(word)).sort()).forEach(word => dataList.append($('<option></option>').attr("value", word)));

})();