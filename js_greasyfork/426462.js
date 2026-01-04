// ==UserScript==
// @name         Cool Math Flash Override
// @namespace    https://stevetech.me/
// @version      0.1
// @description  Hide the "This Flash game is currently not playable in your browser" message, and allow the game to play.
// @author       Steve-Tech
// @match        https://www.coolmathgames.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js#sha384=Qg00WFl9r0Xr6rUqNLv1ffTSSKEFFCDCKVyHZ+sVt8KuvG99nWw5RNvbhuKgif9z
// @downloadURL https://update.greasyfork.org/scripts/426462/Cool%20Math%20Flash%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/426462/Cool%20Math%20Flash%20Override.meta.js
// ==/UserScript==

$(document).ready(function() { //When document has loaded

    $('#newFlashDetectHtml').css("display", "none");
    $('#swfgamewrapper').css("display", "");

    renameElement($('iframe1'),'iframe');

});

// This function is from https://stackoverflow.com/a/56298261/12843844
function renameElement($element,newElement){

    $element.wrap("<"+newElement+">");
    $newElement = $element.parent();

    //Copying Attributes
    $.each($element.prop('attributes'), function() {
        $newElement.attr(this.name,this.value);
    });

    $element.contents().unwrap();

    return $newElement;
}