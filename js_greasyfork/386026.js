// ==UserScript==
// @name         Custom Column Manager
// @namespace    https://canvas.colorado.edu/
// @description  Add buttons to create and delete custom gradebook columns in Canvas.
// @include      https://canvas.colorado.edu/*/gradebook
// @include      https://cuboulder.*instructure.com/*/gradebook
// @grant        none
// @run-at       document-idle
// @version 0.0.1.20190613200918
// @downloadURL https://update.greasyfork.org/scripts/386026/Custom%20Column%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/386026/Custom%20Column%20Manager.meta.js
// ==/UserScript==

function rmColumn() {
    var colName = prompt("Enter the name of the column you wish to delete.\n\nWARNING: All data in this column will be permanently lost!", "");
    if (colName) {
        //extract course id from url
        var courseId = window.location.href.split('/')[4];
        //build the url to the custom columns api endpoint
        var colUrl = "/api/v1/courses/" + courseId + "/custom_gradebook_columns";
        //get a list of existing custom columns
        $.ajax({url: colUrl, dataType: "text"}).done(function(data) {
            var columns = JSON.parse(data.substr(data.indexOf('['),data.length));
            for (var i = 0; i < columns.length; i++) {
                //Match the column that should be deleted by name
                if (columns[i].title === colName) {
                    //delete the column
                    $.ajax({
                        url: colUrl + "/" + columns[i].id,
                        type: "DELETE",
                        dataType: "text"
                    }).done(function(data) {
                        alert('"' + columns[i].title + '" deleted!');
                        location.reload();
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        alert("Error when deleting column: " + errorThrown);
                    });
                    return;
                }
            }
            //for loop completed without finding the column
            alert('Could not find a column named "' + colName + '".');
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Error when checking column names: " + errorThrown);
        });
    }
}

function addColumn() {
    var colName = prompt("Enter the name of the new column you wish to create.", "");
    if (colName) {
        //extract course id from url
        var courseId = window.location.href.split('/')[4];
        //build the url to the custom columns api endpoint
        var colUrl = "/api/v1/courses/" + courseId + "/custom_gradebook_columns";
        //get a list of existing columns
        $.get(colUrl, function(data) {
            for (var col in result) {
                //if a column with this name already exists, quit
                if (col.title === colName) {
                    alert('A column named "' + colName + '" already exists.');
                    return;
                }
            }
        });
        //create the column
        $.ajax({
            url: colUrl,
            type: "POST",
            data: {"column[title]": colName},
            dataType: "text"
        }).done(function(data) {
            alert('"' + colName + '" created!');
            location.reload();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Error when creating column: " + errorThrown);
        });
    }
}

(function() {
    'use strict';
    var rmColBtn = $('<button class="btn" role="button" aria-label="Delete Custom Column" id="rmColumnBtn">Delete Column</button>');
    var addColBtn = $('<button class="btn" role="button" aria-label="Add Custom Column" id="addColumnBtn"><i class="icon-plus"/> Column</button>');
    if ($("#gradebook-actions").length) {
        $("#gradebook-actions").prepend(rmColBtn);
        $("#gradebook-actions").prepend(addColBtn);
    } else {
        $(".gradebook_menu").prepend(rmColBtn);
        $(".gradebook_menu").prepend(addColBtn);
    }
    $("#rmColumnBtn").click(rmColumn);
    $("#addColumnBtn").click(addColumn);
})();