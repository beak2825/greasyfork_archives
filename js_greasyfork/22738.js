// ==UserScript==
// @name         Pocket Web Reader Width
// @version      2016-08-29
// @description  Change the width of the article view in the Pocket.com Web Reader
// @author       abartonkc
// @match        https://getpocket.com/a/*
// @grant        none
// @namespace https://greasyfork.org/users/63029
// @downloadURL https://update.greasyfork.org/scripts/22738/Pocket%20Web%20Reader%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/22738/Pocket%20Web%20Reader%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';

//  Create column_width_array of options to be added
    var column_width_array = ["600px","800px","1000px","1200px"];

    function changeWidth(newWidth) {
        var reader_content = document.getElementsByClassName('reader_content');
        reader_content[0].style.maxWidth = newWidth;
    }

    function addWidthControl() {
        var rightIconDiv = document.getElementById("pagenav_more").parentNode;
        //    var rightIcons = document.getElementsByClassName('icons rightItem');
        //    var rightIconDiv = rightIcons[0];


        //  Create the list item that will be added the rightIcon menu
        var listItem = document.createElement("li");
        listItem.id = "pagenav_width";

        //  Create the selectList for the reading column width options
        var selectList = document.createElement("select");
        selectList.id = "myWidth";
        selectList.name = "myWidth";
        selectList.title = "Reading Column Width";
        selectList.className = "hint-item";
        selectList.setAttribute("data-intro", "Reading Width");
        selectList.style.position = "relative";
        selectList.style.left = "15px";
        selectList.onchange = function(){changeWidth(myWidth.value);};

        //  Create and append the options for each width size
        for (var i = 0; i < column_width_array.length; i++) {
            var option = document.createElement("option");
            option.value = column_width_array[i];
            option.text = column_width_array[i];
            selectList.appendChild(option);
        }

        //  Append the select list and list item to the rightIcon menu
        listItem.appendChild(selectList);
        rightIconDiv.appendChild(listItem);
    }

    function checkForPageReader() {
        if (document.getElementById("page_reader") == null) {
            setTimeout(checkForPageReader, 2000);
        }
        else {
            addWidthControl();
        }
    }

    checkForPageReader();
})();