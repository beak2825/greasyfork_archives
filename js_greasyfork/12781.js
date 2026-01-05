// ==UserScript==
// @name        Hue File Browser Quick Download buttons
// @description Adds a download link column to the file browser of Hue
// @namespace   com.bakdata
// @include     https://78.137.98.171:8888/filebrowser/view/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12781/Hue%20File%20Browser%20Quick%20Download%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/12781/Hue%20File%20Browser%20Quick%20Download%20buttons.meta.js
// ==/UserScript==

$(function() {
  $('<th width="1%">D</th>').insertBefore($( "thead th:nth-child(3)" ));
  var originalUpdateFileList = viewModel.updateFileList;
   viewModel.updateFileList = function() {
    originalUpdateFileList.apply(this, arguments);
    $( "#files > tr > td:nth-child(3)" ).each(function(index) {
      var cell = $('<td/>').insertBefore(this);  
      if(index > 1)
        cell.append($('<a href="/filebrowser/download' + viewModel.files()[index].path + '" target="_blank"><i class="fa fa-arrow-circle-o-down"></i> </a>'));   
    });
  }; 
});