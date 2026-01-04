// ==UserScript==
// @name         Twitter Tweet Styler (HTML)
// @author       None
// @namespace    None
// @description  Stylize tweets for presentation.
// @version      1.33
// @include      /^https:\/\/twitter\.com/.+?/status.*/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/37216/Twitter%20Tweet%20Styler%20%28HTML%29.user.js
// @updateURL https://update.greasyfork.org/scripts/37216/Twitter%20Tweet%20Styler%20%28HTML%29.meta.js
// ==/UserScript==

// Selected text (including html) code by vsync/Tim Down https://stackoverflow.com/a/4177234
// Removing selected text code by User198868 https://stackoverflow.com/a/1643608
// Tag replace with content code by Nick Craver https://stackoverflow.com/a/4233021
// Regex multiple match position code by Gumbo https://stackoverflow.com/a/2295681
(function ($) {
    'use strict';
    var spanIDINC = 0,
        i = 0,
        spanIDArray = [],
        spanID = 0,
        container = [],
        classes = "",
        styles = "",
        textP1 = "",
        textP2 = "",
        html = "",
        defaultSizeNum = "",
        buttonFontSize = "",
        colorMode = "",
        defaultLineHeight = "",
        annotationSize = "",
        fontSize = "",
        fontLineHeight = "",
        textColor = "",
        decorationColor = "",
        highlightBackgroundColor = "",
        rubyAnnotation = "",
        matchIndexArray = [],
        matchText = "",
        matchIndex = 0,
        mulInput = "",
        position = 0,
        initialText = $('.TweetTextSize--jumbo')[0].innerHTML.replace(/pic.twitter.com.*/gi, '').replace(/\n\n/gi, "<hr>"),
        classList = Array.from($('.TweetTextSize--jumbo')[0].parentElement.parentElement.classList);
    $('.TweetTextSize--jumbo').empty();

    $('head').append("<style> " +
            ".hidden {display:none;}" +
            ".permahidden {display:none !important}" +
            "#containerStyles > button {background-color:#404040; color:white !important; padding-left:5px !important; padding-right:5px !important;margin-right:5px !important; font-size:16px !important;}" +
            ".checked {background-color:green !important}" +
            "hr {opacity:0.00 !important}" +
            "hr.sep {margin-top:0px !important; margin-bottom:1px !important;}" +
            ".F14 {font-size:14px !important}" +
            ".F18 {font-size:18px !important}" +
            ".F22 {font-size:22px !important}" +
            ".F27 {font-size:27px !important} " +
            ".F30 {font-size:30px !important}" +
            ".B1 {font-weight:200 !important}" +
            ".B2 {font-weight:400 !important}" +
            ".B3 {font-weight:600 !important}" +
            ".B4 {font-weight:900 !important}" +
            ".IT {font-style:italic !important}" +
            ".OB {font-style:oblique !important}" +
            ".SB {vertical-align:sub !important}" +
            ".SP {vertical-align:sup !important}" +
            ".UL {text-decoration:underline !important}" +
            ".ST {text-decoration:line-through !important}" +
            ".red {color:red !important;}" +
            ".green {color:green !important;}" +
            ".black {color:black !important;}" +
            "rt {margin-bottom:-5px !important}" +
            "#editPreview {-moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none; border:2px dotted #222222; margin-top:10px;}" +
            "input:not([id='RubyTextAnnotation']) {width:60px !important}" +
            "#editText, #editPreview {margin-top:7px !important; color:#202326; font-size:27px; letter-spacing:0.27px; line-height:32px; white-space:pre-wrap; word-wrap:break-word}" +
            "span, #editText {font-family:'Segoe UI',Arial,sans-serif !important}" +
            "</style>");

    $('.TweetTextSize--jumbo').parent().prepend("<div id='tweetEditContainer'><div id='containerStyles'>" +
            "<button id='colorred' class='colors red'>Red</button>" +
            "<button id='colorgreen' class='colors green'>Green</button>" +
            "<button id='colorblack' class='colors black checked'>Black</button>" +
            "<input id='TextColor' type='text' placeholder='#RRGGBB or #RGB or color'></input>" +
            "<hr class='sep'>" +
            "<button id='Underline' class='toggle UL'>UL</button>" +
            "<input id='DecorationColor' type='text' placeholder='#000000'></input>" +
            "<button id='Highlight'  class='toggle'>BG/Highlight</button>" +
            "<input id='HighlightBackgroundColor' type='text' placeholder='#FFFF00'></input>" +
            "<hr class='sep'>" +
            "<button id='Font14' class='fsz'>14px</button>" +
            "<button id='Font18' class='fsz'>18px</button>" +
            "<button id='Font22' class='fsz'>22px</button>" +
            "<button id='Font27' class='fsz checked'>27px</button>" +
            "<button id='Font30' class='fsz'>30px</button>" +
            "<input id='FontSize' type='text' placeholder='10/10px'></input>" +
            "<input id='FontLineHeight' type='text' placeholder='LineHeightPX(75%)' style='width:120px !important' ></input>" +
            "<hr class='sep'>" +
            "<button><ruby>Ruby Text<rt>Annotation</rt></ruby></button>" +
            "<input id='RubyTextAnnotation' type='text' placeholder='Annotation'  style='width:250px !important'></input>" +
            "<input id='RubyTextAnnotationSize' type='text' placeholder='10/10px' style='width:75px !important'></input>" +
            "<hr class='sep'>" +
            "<button id='bold1' class='bb' style='font-weight:200'>Light</button>" +
            "<button id='bold2' class='bb' style='font-weight:400'>Bold</button>" +
            "<button id='bold3' class='bb checked' style='font-weight:600'>Bolder</button>" +
            "<button id='bold4' class='bb' style='font-weight:900'>Boldest</button>" +
            "<hr class='sep'>" +
            "<button id='Italic' class='ita IT'>Italics</button>" +
            "<button id='Oblique' class='ita OB'>Oblique</button>" +
            "<button id='Strikethrough' class='toggle ST'>Strikethrough</button>" +
            "<button id='Subscript' class='scr SB'>Sub</button>" +
            "<button id='Superscript' class='scr SP'>Super</button>" +
            "<hr class='sep'>" +
            "<button id='editApply' class='edit'>Apply</button>" +
            "<button id='previewEditor' class='edit'>Preview</button>" +
            "<button id='hideEditor'>Hide</button>" +
            "<button id='showEditor'>Show</button>" +
            "<button id='showModifier'>Create</button>" +
            "<button id='applyModifier'>Apply Creation</button>" +
            "<button id='disableEditor'>Disable</button>" +
            "</div><div id='createText'><textarea id='newText' style='display:none' placeholder='Shift+Enter for newline'></textArea></div><div id='editText' class=''></div><div id='editPreview'></div></div>");

    $('#editText')[0].innerHTML = initialText;

    $('.bb').on('click', function () {
        $('.bb').removeClass("checked");
        $(this).addClass("checked");
    });

    $('.fsz').on('click', function () {
        $('.fsz').removeClass("checked");
        $(this).addClass("checked");
    });

    $('.scr').on('click', function () {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
        } else {
            $('.scr').removeClass("checked");
            $(this).addClass("checked");
        }
    });

    $('.ita').on('click', function () {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
        } else {
            $('.ita').removeClass("checked");
            $(this).addClass("checked");
        }
    });

    $('.colors').on('click', function () {
        $('.colors').removeClass("checked");
        $(this).addClass("checked");
    });

    $('.toggle').on('click', function () {
        $(this).toggleClass("checked");
    });

    $('#hideEditor').on('click', function () {
        $('#containerStyles > *').addClass("hidden");
        $('#editPreview').addClass("hidden");
        $('#showEditor').removeClass("hidden");
        $('#disableEditor').removeClass("hidden");
    });

    $('#showEditor').on('click', function () {
        $('#containerStyles > *').removeClass("hidden");
        $('#editPreview').removeClass("hidden");
        $('#showEditor').addClass("hidden");
        $('#applyModifier').addClass("hidden");
    });

    $('#disableEditor').on('click', function () {
        $('#containerStyles > *').addClass("hidden");
        $('#editPreview').addClass("hidden");
    });


    if (classList.indexOf("my-tweet") === -1) {
        $('#applyModifier').addClass("permahidden");
        $('#showModifier').addClass("permahidden");
    }


    $('#showModifier').on('click', function () {
        if (classList.indexOf("my-tweet") !== -1) {
            $('#newText')[0].setAttribute('style', "width:500px !important; height:200px !important;");
            $('#applyModifier').removeClass("hidden");
        } else {
            alert("Only modifying self made tweets is allowed");
        }
    });


    $('#applyModifier').on('click', function () {
        if ($('#newText')[0].value !== "") {
            $('#editText')[0].innerHTML = $('#newText')[0].value;
            $('#newText')[0].setAttribute('style', "display:none");
        } else {
            alert("Attempted to create an empty tweet");
        }
    });


    $('.edit').on('click', function () {
        // do stuff;
        // Set selected values of buttons
        defaultSizeNum = parseInt($('.fsz.checked')[0].textContent, 10);
        buttonFontSize = parseInt($('.fsz.checked')[0].textContent.substring(0, 2), 10);
        colorMode = $('.colors.checked').attr('id').substring(5, 11);
        defaultLineHeight = buttonFontSize + 5;
        annotationSize = $('#RubyTextAnnotationSize')[0].value.replace(/px/gi, '');
        fontSize = $('#FontSize')[0].value.replace(/px/gi, '');
        fontLineHeight = $('#FontLineHeight')[0].value.replace(/px/gi, '');
        textColor = $('#TextColor')[0].value;
        decorationColor = $('#DecorationColor')[0].value;
        highlightBackgroundColor = $('#HighlightBackgroundColor')[0].value;
        rubyAnnotation = $('#RubyTextAnnotation')[0].value;
        // Reset edit variables
        classes = "";
        styles = "";
        position = 0;
        textP1 = "";
        textP2 = "";
        html = "";
        container = document.createElement("div");
        container.appendChild(window.getSelection().getRangeAt(0).cloneContents());
        html = container.innerHTML;
        matchIndexArray = [];

        if (window.getSelection().anchorNode.parentElement.tagName === "SPAN") {
            // Overwrite single span case.
            $(window.getSelection().anchorNode.parentElement)[0].outerHTML = $(window.getSelection().anchorNode.parentElement)[0].innerHTML;
        } else {
            if (container.querySelectorAll('span').length !== 0) {
                // Editing over multiple spans
                spanIDArray = Array.from(container.querySelectorAll('span'));
                for (i = 0; i < spanIDArray.length; i += 1) {
                    spanID = spanIDArray[i].getAttribute("id");
                    $('#' + spanID)[0].replaceWith($('#' + spanID)[0].innerHTML);
                }
            }
        }

        container = document.createElement("div");
        container.appendChild(window.getSelection().getRangeAt(0).cloneContents());
        html = container.innerHTML;

        // Multiple text instances check
        if ($('#editText')[0].innerHTML.indexOf(html) === $('#editText')[0].innerHTML.lastIndexOf(html)) {
            // Single instance
            textP1 = $('#editText')[0].innerHTML.substring(0, $('#editText')[0].innerHTML.indexOf(html));
            textP2 = $('#editText')[0].innerHTML.substring($('#editText')[0].innerHTML.indexOf(html) + html.length, 99999);
        } else {
            matchIndexArray = [];
            for (i = 0; i < $('#editText')[0].innerHTML.length; i += 1) {
                matchText = $('#editText')[0].innerHTML.substring(i, 99999).indexOf(html);
                if (matchText !== -1) {
                    matchIndexArray.push(matchText + i);
                    i += matchText + 1;
                } else {
                    i = $('#editText')[0].innerHTML.length + 1;
                }
            }

            for (i = 0; i < matchIndexArray.length; i += 1) {
                if (textP1 === "") {
                    matchIndex = matchIndexArray[i];
                    matchText = $('#editText')[0].innerHTML.substring(matchIndex - 10, matchIndex + 15);
                    matchText = matchText.replace(/<span.+?>/gi, '').replace(/<\/span>/gi, '').replace(/<ruby.+?>/gi, '').replace(/<\/ruby>/gi, '').replace(/<rt.+?>/gi, '').replace(/<\/rt>/gi, '');
                    mulInput = prompt("Multiple word matches detected is this your selection? (y/yes/1)", matchText);
                    if (mulInput === "1" || mulInput.toLowerCase() === "yes" || mulInput.toLowerCase() === "y") {
                        textP1 = $('#editText')[0].innerHTML.substring(0, matchIndex);
                        textP2 = $('#editText')[0].innerHTML.substring(matchIndex + html.length, 99999);
                    }
                }
            }

            if (textP1 === "") {
                // No Selection fallback (last instance)
                matchIndex = matchIndexArray[matchIndexArray.length - 1];
                textP1 = $('#editText')[0].innerHTML.substring(0, matchIndex);
                textP2 = $('#editText')[0].innerHTML.substring(matchIndex + html.length, 99999);
            }

        }

        html = html.replace(/<span.+?>/gi, '').replace(/<\/span>/gi, '');
        html = html.replace(/<ruby.+?>/gi, '').replace(/<\/ruby>/gi, '');
        html = html.replace(/<rt.+?>/gi, '').replace(/<\/rt>/gi, '');



        if (rubyAnnotation !== "") {
            if (annotationSize !== "") {
                html = "<ruby>" + html + "<rt style='font-size:" + annotationSize + "px !important'>" + rubyAnnotation + "</rt></ruby>";
            } else {
                html = "<ruby>" + html + "<rt style='font-size:" + (defaultSizeNum - 4) + "px !important'>" + rubyAnnotation + "</rt></ruby>";
            }
            if (this.id !== "previewEditor") {
                // Clearing annotation value except in previews.
                $('#RubyTextAnnotation')[0].value = "";
            }
        }


        // Font-Weight Checks (Tag Replacement);
        if ($('#bold1').hasClass('checked')) {
            classes += "B1 ";
        } else if ($('#bold2').hasClass('checked')) {
            classes += "B2 ";
        } else if ($('#bold3').hasClass('checked')) {
            classes += "B3 ";
        } else if ($('#bold4').hasClass('checked')) {
            classes += "B4 ";
        } else {
            classes += "B3 ";
        }


        if ($('#Italic').hasClass('checked')) {
            classes += "IT ";
        } else if ($('#Oblique').hasClass('checked')) {
            classes += "OB ";
        }


        if (fontSize !== "") {
            styles += "font-size:" + fontSize + "px !important;";
        } else {
            styles += "font-size:" + defaultSizeNum + "px !important;";
        }


        if (fontLineHeight !== "") {
            styles += "line-height:" + fontLineHeight + "px !important;";
        } else {
            styles += "line-height:" + defaultLineHeight + "px !important;";
        }


        if (textColor !== "") {
            if ((textColor[0] === "#" && textColor.substring(1, 10).match(/\D/) === null) || textColor.match(/[g-z]/gi) === null) {
                styles += "color:" + textColor + ";";
            } else {
                colorMode.replace("black", '#202326');
                styles += "color:" + colorMode + ";";
            }
        } else {
            classes += colorMode + " ";
        }


        if ($('#Underline').hasClass('checked')) {
            classes += "UL ";
            if (decorationColor !== "") {
                styles += "text-decoration-color:" + decorationColor + "!important;";
            }
        }


        if ($('#Subscript').hasClass('checked')) {
            classes += "SB ";
        } else if ($('#Superscript').hasClass('checked')) {
            classes += "SP ";
        }


        if ($('#Highlight').hasClass('checked')) {
            if (highlightBackgroundColor !== "") {
                if (highlightBackgroundColor[0] === "#" && highlightBackgroundColor.substring(1, 10).match(/[g-z]/gi) === null) {
                    styles += "background-color:" + highlightBackgroundColor + ";";
                } else if (highlightBackgroundColor.match(/\d/) === null) {
                    styles += "background-color:" + highlightBackgroundColor + ";";
                }
            } else {
                styles += "background-color:yellow;";
            }
        }


        if ($('#Strikethrough').hasClass('checked')) {
            classes += "ST ";
        }

        // Incremental span ID
        spanIDINC += 1;
        // Final Span
        html = "<span class='" + classes + "' style='" + styles + "' id='s" + spanIDINC.toString() + "'>" + html + "</span>";

        // Preview or Apply on ID
        if (this.id === "previewEditor") {
            $('#editPreview').empty();
            $('#editPreview')[0].innerHTML = textP1 + html + textP2;
        } else {
            // Removing selection
            window.getSelection().deleteFromDocument();
            window.getSelection().removeAllRanges();
            $('#editText')[0].innerHTML = textP1 + html + textP2;
        }
    });


    $('#containerStyles > *').addClass("hidden");
    $('#editPreview').addClass("hidden");
    $('#showEditor').removeClass("hidden");
    $('#disableEditor').removeClass("hidden");
})(jQuery);