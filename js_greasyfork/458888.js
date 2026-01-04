// ==UserScript==
// @name        chatGPT辅助脚本 长文本分割
// @namespace   https://github.com/Huoyuuu
// @include     https://chat.openai.com/*
// @description 自动将英文文本分割为chatGPT可以承受住的输入量，省去人工分割的步骤。
// @author      Huoyuuu
// @version     1.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458888/chatGPT%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%20%E9%95%BF%E6%96%87%E6%9C%AC%E5%88%86%E5%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/458888/chatGPT%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%20%E9%95%BF%E6%96%87%E6%9C%AC%E5%88%86%E5%89%B2.meta.js
// ==/UserScript==

$(document).ready(function() {
    // Create textbox and button
    var textbox = $('<textarea>').css({
        'width': '100%',
        'resize': 'both',
    });
    var button = $('<button>Divide</button>').css({
        'width': '100%',
        'height': '2%',
    });
    var container = $('<div>').css({
        'position': 'absolute',
        'right': '20%',
        'top': '50%',
        'transform': 'translate(50%, -50%)',
        'text-align': 'center',
        'z-index': '9999',
    });
    var toggleBtn = $('<button>Toggle</button>').css({
        'width': '100%',
        'height': '2%',
    });

    //$(container).hide(); // hide the container by default

    toggleBtn.click(function() {
        $(container).toggle();
    });
    container.append(toggleBtn);
    toggleBtn.css({
        'display': 'inline-block',
        'margin': '0 auto'
    });

    $(container).draggable({
        containment: "parent"
    });
    textbox.css({
        'display': 'inline-block',
        'margin': '0 auto'
    });
    button.css({
        'display': 'inline-block',
        'margin': '0 auto'
    });
    container.append(textbox);
    container.append(button);
    // Append textbox and button to the body
    $('body').append(container);

    // Add click event to button
    button.click(function() {
        // Get the text from the textbox
        var text = textbox.val();
        // Split the text into paragraphs
        var paragraphs = text.split("\n");
        var ret = "Express it in succinct sentences:";
        var curlen = 0;
        // Loop through each paragraph
        for (var i = 0; i < paragraphs.length; i++) {
            var words = paragraphs[i].replaceAll("\n", " ").split(" ");
            var len = words.length;
            if (len <= 2) {
                continue;
            }

            curlen += len;
            if (curlen > 1400) {
                curlen = 0;
                ret += "\n\n\nExpress it in succinct sentences:";
                continue;
            }
            ret += paragraphs[i];
        }
        // Update the text in the textbox
        textbox.val(ret);
    });
});