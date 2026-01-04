// ==UserScript==
// @name           Assignment Feedback
// @version        2.0
// @include        https://ggc.view.usg.edu/d2l/lms/dropboclassID/user/folders_list.d2l?ou=*
// @description    The Assignment Feedback userscript is used to display the student's feedback for graded assignments on the assignments page.
// @namespace https://greasyfork.org/users/411524
// @downloadURL https://update.greasyfork.org/scripts/393217/Assignment%20Feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/393217/Assignment%20Feedback.meta.js
// ==/UserScript==

//regEx filter for d2l assignments
let regEx = /\b(\bhttps?:\/\/\ggc\.view\.usg\.edu\/d2l\/lms\/dropbox\/user\/folder_user_view_feedback\.d2l\?db=\S+)/g;

//Selects links in the evaluation status column
var links = document.getElementsByClassName("d2l-link d2l-link-inline");

$(function(){
    $.get(links[1], function(result){
        var obj = $(result).find('body');
        var PageText = $(result).find('.fct_w').text();
        console.log(PageText);
        // create div
        var newDiv = document.createElement("div");
        //add id to div
        newDiv.setAttribute("id", "test");
        var currentDiv = document.getElementById("div1");
        $(document.getElementsByClassName(".d_gc.d_gt)")).append(newDiv)
        var newContent = document.createTextNode(PageText);
        $('.d_gc.d_gt:nth-child(4n)').each(function(eachCounter){
            $(this).attr("id", "id-"+parseInt(eachCounter+1));
        });
        $(".d_gc.d_gt:nth-child(4n)").append('<br/>',newContent,newDiv)
        // $("id-2").load( "https://ggc.view.usg.edu/d2l/lms/dropbox/user/folder_user_view_feedback.d2l?db=1619880&grpid=0&isprv=0&bp=0&ou=1802552 ('.fct_w').text()" );

        function makeTable(container, data) {
            var table = $("<table/>").addClass('CSSTableGenerator');
            $.each(data, function(rowIndex, r) {
                var row = $("<tr/>");
                $.each(r, function(colIndex, c) {
                    row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
                });
                table.append(row);
            });
            return container.append(table);
        }

        $(document).ready(function() {
            var data = [["Assignment Feedback"], //headers
                ["Assignment 1", PageText],
                ["Assignment 1", PageText],
                ["Assignment 1", PageText]]
            var cityTable = makeTable($(document.body), data);
        });
    });
});