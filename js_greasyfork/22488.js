// ==UserScript==
// @name         Gfycator 500+
// @version      1.0
// @description  Dodatkowy przycisk ułatwiający szybką konwersję gifów lub obrazków do postaci gfycatów
// @author       tRNA
// @license      GNU AGPLv3
// @match        http://*.wykop.pl/*
// @namespace    https://greasyfork.org/pl/users/56863
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22488/Gfycator%20500%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/22488/Gfycator%20500%2B.meta.js
// ==/UserScript==
    $(document).ready(function() {
        function Main() {
            $("#ButtonGfycat").remove();
            $(".nospace").find(".selectUrl").find("p").find("a").after('<button id="ButtonGfycat" type="button" class="button" tabindex="2"><i id="loading" class="fa fa-spinner fa-spin" style="display: none"></i>Gfycatuj</button>');
            document.getElementById('ButtonGfycat').onclick = function() {
                $("#loading").show();
                var SingleValues = $("input[name='url']").val();
                var StatusResponse;
                $.getJSON('http://upload.gfycat.com/transcode?fetchUrl=' + SingleValues, function(jd) {
                    if (jd.error !== undefined) {
                        StatusResponse = 'Błąd: ' + jd.error;
                    } else {
                        StatusResponse = 'https://gfycat.com/' + jd.gfyname;
                    }
                    $("input[name='url']").val(StatusResponse);
                    $("#loading").hide();
                });
            };
        }
        function ClickEvent() {
            $("fieldset.row.buttons.dnone").on("click", "a.button.openAddMediaOverlay", function(e) {
                setTimeout(Main, 10);
            });
        }
        $("div.row.elements.actions").on("click", " a.affect.btnReply", function(e) {
            setTimeout(ClickEvent, 10);
        });
        $("fieldset.row.buttons.dnone").on("click", "a.button.openAddMediaOverlay", function(e) {
            setTimeout(Main, 10);
        });
        $(document).ajaxComplete(function() {
            $("div.row.elements.actions").on("click", " a.affect.btnReply", function(e) {
                setTimeout(ClickEvent, 10);
            });
        });
    });

