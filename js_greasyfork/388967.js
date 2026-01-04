// ==UserScript==
// @name         Better MxRP
// @namespace    http://oxeff.xyz/
// @version      0.4.4
// @description  An enhancement suite for MxRP
// @author       0xEFF <dez@oxeff.xyz> (https://github.com/hecksadecimal)
// @match        https://mxrp.chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388967/Better%20MxRP.user.js
// @updateURL https://update.greasyfork.org/scripts/388967/Better%20MxRP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    // The lists at /chats
    var group_chats = $("#group_chats");
    if (group_chats.length) {
        $("#group_chats li").each(function() {
            // Contains everything we need.
            var meta_info = $(this).find("p:nth-child(2) > a:nth-child(1)");
            if (meta_info.html() == "Searched" || window.location.pathname == "/chats/searched"){
                // Searched chat IDs follow a predictable schema.
                var chat_id = $(this).find("h3:nth-child(1) > a:nth-child(1)").html();
                console.log("Found Searched chat: " + chat_id);

                // Button setup
                $(this).find("form").before('<button id="better_rename_' + chat_id +'" class="unsubscribe" style="float: left; margin-right: 5px;">Rename</button>');
                var searched_rename_button = $("#better_rename_" + chat_id);
                searched_rename_button.after('<button id="better_description_' + chat_id + '" class="unsubscribe" style="float: left;">Set Description</button>');
                var searched_description_button = $("#better_description_" + chat_id);

                // Can't use $(this) in the context of a button press event to achieve the desired results. Need a mirror of the current $(this).
                var current_item = $(this);
                searched_rename_button.click(function() {
                    var rename_value = prompt("Name (Empty to reset)", current_item.find("h3:nth-child(1) > a:nth-child(1)").html());
                    if (rename_value) {
                        window.localStorage.setItem("name_" + chat_id, rename_value);
                        current_item.find("h3:nth-child(1) > a:nth-child(1)").html(rename_value);
                    } else if (rename_value === "") {
                        window.localStorage.removeItem("name_" + chat_id);
                        current_item.find("h3:nth-child(1) > a:nth-child(1)").html(chat_id);
                    } else {
                        return;
                    }
                });
                searched_description_button.click(function() {
                    var desc_value = prompt("Description (Empty to reset)", current_item.find(".desc").html());
                    if (desc_value) {
                        window.localStorage.setItem("desc_" + chat_id, desc_value);
                        current_item.find(".desc").html(desc_value);
                    } else if (desc_value === "" ){
                        window.localStorage.removeItem("desc_" + chat_id);
                        current_item.find(".desc").html("");
                    } else {
                        return;
                    }
                });
                var chat_name = window.localStorage.getItem("name_" + chat_id);
                if (chat_name) {
                    $(this).find("h3:nth-child(1) > a:nth-child(1)").html(chat_name);
                }
                var chat_desc = window.localStorage.getItem("desc_" + chat_id);
                if (chat_desc) {
                    $(this).find(".desc").html(chat_desc);
                }
            }
        });
    }

    // The lists that shows up when you're currently in a chat page.
    var group_chats_mini = $("#my_chats_list");
    if (group_chats_mini.length) {
        // Have to do it this way because the list is not populated by the time the page is loaded.
        group_chats_mini.bind('DOMSubtreeModified', function(e) {
            for (var i=0; i < e.target.children.length; i++) {
                if (e.target.children[i].classList.contains("searched")){
                    var chat_id = e.target.children[i].children[0].children[0].innerHTML;
                    console.log("Found Searched chat: " + chat_id);
                    var chat_name = window.localStorage.getItem("name_" + chat_id);
                    if (chat_name) {
                        e.target.children[i].children[0].children[0].innerHTML = chat_name;
                    }
                }
            }
        });
    }

    function paraInputHandler(e) {
        if (e.keyCode == 13 && !e.shiftKey) {
            $("#button_wrap > button:nth-child(1)").click();
            $("#chat_line_input > input[type=text]").keydown();
            $("#parainput").val("");
            $("#chat_line_input > input[type=text]").val("");
            $("#chat_line_input > input[type=text]").keyup();
        } else {
            var unclean_str = $("#parainput").val();
            unclean_str = unclean_str.replace(/(?:\r\n|\r|\n){2}/g, '[br] [br]');
            unclean_str = unclean_str.replace(/(?:\r\n|\r|\n)/g, '[br]');
            $("#chat_line_input > input[type=text]").keydown();
            $("#chat_line_input > input[type=text]").val(unclean_str);
            $("#chat_line_input > input[type=text]").keyup();
        }
    }
    var paragraph_mode_saved = window.localStorage.getItem("paramode_" + $(location).attr('pathname'));
    if (!paragraph_mode_saved) {
        paragraph_mode_saved = "script"
    }


    function toggleTextbox() {
        console.log("smart_quirk_mode: " + paragraph_mode_saved);
        if (paragraph_mode_saved == "paragraph") {
            $("#chat_line_input > input[type=text]").hide();
            $("#parainput").show();
        } else if (paragraph_mode_saved == "script") {
            $("#chat_line_input > input[type=text]").show();
            $("#parainput").hide();
            $("#conversation").css({"bottom": "59px"});
        } else {
            $("#chat_line_input > input[type=text]").show();
            $("#parainput").hide();
            $("#conversation").css({"bottom": "59px"});
        }
        try {
            $("#chat_line_input > input[type=text]").keydown();
            $("#chat_line_input > input[type=text]").keyup();
        } catch(err) {
            console.log("Likely error due to unready websocket. Ignore.")
        }
    }

    function setupTextbox() {
        $("#chat_line_input > input[type=text]").after('<textarea id="parainput" name="text" autocomplete="off" maxlength="10000">');
        $("#parainput").css({"min-height": "5em", "max-height": "100vh", "margin": "0 -2px 5px"});
        $("#conversation").css({"bottom": "59px"});
        $("#parainput").on("change keyup paste", paraInputHandler);
        toggleTextbox();
    }

    var mode_selector = $("#smart_quirk_select");
    if (mode_selector.length) {
        $("#settings > div > div:nth-child(4) > div:nth-child(9) > p").after('<p><input type="checkbox" id="chat_better_entry" class="chat_settings" name="chat_better_entry"><label for="chat_better_entry"> BMXrP: Enable paragraph box</label></p>');
        paragraph_mode_saved = window.localStorage.getItem("paramode_" + $(location).attr('pathname'));
        console.log(paragraph_mode_saved)
        if (paragraph_mode_saved == "paragraph") {
            $('#chat_better_entry').prop('checked', true);
        } else {
            $('#chat_better_entry').prop('checked', false);
        }

        setupTextbox();
        $("#chat_better_entry").change(function() {
            console.log($('#chat_better_entry').is(":checked"))
		    paragraph_mode_saved = ($('#chat_better_entry').is(":checked") ? "paragraph" : "script");
            window.localStorage.setItem("paramode_" + $(location).attr('pathname'), paragraph_mode_saved);
		    $("#chat_line_input input").trigger( "keyup" );
            toggleTextbox();
        });
    }

    var abscond_button = $("#abscond_button");
    if (abscond_button.length) {
        var might_abscond = false;
        var did_abscond = false;
        // The confirmation dialogue is both ugly and slow.
        window.confirm = function() { return true; };

        // We can create our own button to add functionality and delegate the vanilla behavior of disconnects to the original button
        // since we can't directly interact with any function that's a part of mxrp's scripts.
        abscond_button.hide();
        abscond_button.after( '<button type="button" id="better_abscond_button">Abscond</button>' );
        var better_abscond_button = $("#better_abscond_button");
        $(document).keydown(function(e) {
            if (e.key === "Escape") {
                better_abscond_button.trigger("click");
            }
        });
        better_abscond_button.click(function() {
            if (!might_abscond){
                might_abscond = true;
                better_abscond_button.html("[5] Abscond?");
                better_abscond_button.css('background-color','red');
                var seconds = 5;
                $('input[name="text"]').css("width", "97%");
                better_abscond_button.html("[" + seconds + "] Abscond?");
                var countdown = window.setInterval(function() {
                    seconds = seconds - 1;
                    better_abscond_button.html("[" + seconds + "] Abscond?");
                    if (seconds === 0 && !did_abscond) {
                        window.clearInterval(countdown);
                        might_abscond = false;
                        better_abscond_button.html("Abscond");
                        better_abscond_button.removeAttr("style");
                        $('input[name="text"]').removeAttr("style");
                    }
                }, 1000);
            } else {
                did_abscond = true;
                abscond_button.trigger("click");
                abscond_button.show();
                better_abscond_button.hide();
                window.clearInterval(countdown);
            }
        });
    }
})();