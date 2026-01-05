// ==UserScript==
// @name        Procore Development helper (Mturk)
// @namespace   https://greasyfork.org/users/3408
// @author      DonovanM
// @description Makes it easier to do Procore Development drawing number and title HITs on Mturk.
// @include     https://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @include     http://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @include     https://get.thecurrentset.com/*
// @include     https://app.procore.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version     0.9.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3324/Procore%20Development%20helper%20%28Mturk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3324/Procore%20Development%20helper%20%28Mturk%29.meta.js
// ==/UserScript==

// Automatically scrolls to the bottom right on load. Whatever you type into the floating
// form will be entered into the real form. Pressing enter or clicking the Done button will
// bring the window back to the top with the input fields filled in (so you can preview
// before you submit). Hitting Enter again will submit the hit. Use Ctrl + arrow keys to
// move around the window.

var clone,
    currentSet = false;

$(document).ready(function() {
    if (document.URL.indexOf("get.thecurrentset.com") !== -1)
        currentSet = true;

    if (!currentSet){
        // Stretch out the input boxes to make sure everything was typed out correctly
        $("#drawing_number").css('width', "500px");
        $("#drawing_title").css('width', "500px");
    } else {
        $("div.drawing-image").css({
            'max-width': "100%",
            'position': "absolute",
            'right': "0",
            'left': "195px",
            'width': "auto",
            'top': "0",
            'bottom': "30px",
            'height': "auto"           
        });

        $("hr").remove();
    }

    var form = $("<form>");

    // Container
    var div = $("<div>")
        .css('position', "fixed")
        .css('right', "0px")
        .css('bottom', "0px")
        .css('padding', "3px")
        .css('background-color', "rgba(160,215,255,0.75)")
        .css('border', "1px solid rgba(130,200,220,0.75)")
        .css('border-width', "1px 0 0 1px")
        .css('border-radius', "2px 0 0 0")
        .css('font', "11pt sans-serif")
        .append(
            $("<p>") 
            .html("Drawing/sheet number: ")
            .append(
                $("<input>") // First input (drawing number)
                .attr('id', "clone_number")
                .keydown(function() { clone.number() })
            )
        )
        .append(
            $("<p>")
            .html("Drawing/sheet title: ")
            .css('margin-left', "20px")
            .append(
                $("<input>") // Second input (drawing number)
                .attr('id', "clone_title")
                .css('width', "500px")
                .keydown(function() { clone.title() })
            )
            .append(
                $("<button>") // Done button (doesn't submit, just takes you to the real sumbit button)
                .html("Done")
                .prop('type', "button")
                .css('margin', "0 10px 0 20px")
                .click(function() {
                    $(window).scrollTop(0).scrollLeft(0);
                    $("button[name='commit']").focus();
                })
            )
        )

    // Add some shared styles
    $("p", div).css('text-align', "right").css('display', "inline");
    $("input", div).css('background-color', "rgba(255,255,255,0.65)").css('border', "1px solid #ddd");


    form.append(div);
    $("body").append(form);

    $("#clone_number")[0].focus();
    clone = new Clone();
});

$(window).load(function(e) {
    // Timeout needed for Chrome or it will scroll to the bottom right and quickly back to it's original position
    // otherwise. Not sure if a longer timeout is needed for slower computers.
    setTimeout(function() { Scroll.bottom(); Scroll.farRight() }, 100);
});

// Clone object. Copies text from the floating form to the HIT form. Created as an object to keep references to
// jQuery objects instead of doing a search on each keypress. The timeout allows the text to go into the floating
// form before copying it, otherwise it'll copy before the text is actually in the input box.
function Clone() {
    var self = this;
    this.numberBox = $("#drawing_number");
    this.titleBox = $("#drawing_title");
    this.numberClone = $("#clone_number");
    this.titleClone = $("#clone_title");

    this.number = function() {
        setTimeout(function() {
            self.numberBox.val(self.numberClone.val());
        }, 100);
    }

    this.title = function() {
        setTimeout(function() {
            self.titleBox.val(self.titleClone.val());
        }, 100);
    }
}

$(document).keydown(function(e) {
    if (e.keyCode == 13) {
        $(window).scrollTop(0).scrollLeft(0);
        $("*[name='commit']").focus();
    } else if (e.ctrlKey) {
        switch (e.keyCode) {
            case 38: // Up
                Scroll.top();
                break;
            case 40: // Down
                Scroll.bottom();
                break;
            case 37: // Left
                Scroll.farLeft();
                break;
            case 39: // Right
                Scroll.farRight();
                break;
        }
    }
});

var Scroll = {
    top: function() {
        if (currentSet)
            $("div.drawing-image").scrollTop(0);
        else
            $(window).scrollTop(0);
        },

    bottom: function() {
        if (currentSet)
            $("div.drawing-image").scrollTop($("div.drawing-image")[0].scrollHeight);
        else
            $(window).scrollTop($(window).height());
        },

    farLeft: function() {
        if (currentSet)
            $("div.drawing-image").scrollLeft(0);
        else
            $(window).scrollLeft(0);
        },

    farRight: function() {
        if (currentSet)
            $("div.drawing-image").scrollLeft($("div.drawing-image")[0].scrollWidth);
        else
            $(window).scrollLeft($(document).outerWidth() - $(window).width());
        }
}