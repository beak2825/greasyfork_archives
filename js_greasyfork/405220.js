// ==UserScript==
// @name         SC2 - WS URL grabber
// @namespace    http://sc2.zone
// @version      0.2
// @description  better link grabber for webshare.cz search
// @author       mareklibor
// @match        https://webshare.cz/
// @include      https://webshare.cz/#/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405220/SC2%20-%20WS%20URL%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/405220/SC2%20-%20WS%20URL%20grabber.meta.js
// ==/UserScript==


(function () {

    'use strict';
    //alert( $.fn.jquery )
    $.wait = function (callback, seconds) {
        return window.setTimeout(callback, seconds * 1000);
    }
    function copyToClipboard() {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($("#sc2-links").val()).select();
        document.execCommand("copy");
        $temp.remove();
    }

    // onChange trigger
    $(document).change(function () {

        // if textarea not exists
        if ($("#sc2-links").length == 0) {
            // append textarea
            $('.ws-finder-files').prepend("<div style='float:none;'><textarea style='width:100%;height:200px;' id='sc2-links'></textarea>" +
                    "<input type='button' id='copy' value='Kopírovat' class='ws-small-button green ws-radius-2' style='float:right'>" +
                    "<input type='button' id='clear' value='Smazat vše' class='ws-small-button gray ws-radius-2' style='float:right;'>" +
                    //"<input type='checkbox' id='checkAll'><label for='checkAll'>Vybrat vše</label><code id='demo'></code>" +
                    "<br><br></div>");
        }

        // foreach ws-found-file div
        $('.ws-found-file').each(function () {
            // add checkbox
            var input = '<input type="checkbox" style="position:absolute;z-index:1000;" class="sc2-append-link" >';
            // add checkbox to all ws-found-file
            $(this).prepend(input);
        });


        // on checkbox click

        // copy button
        $(document).on("click", "#copy", function () {
            var $temp = $("<textarea><textarea>");
            $("body").append($temp);
            $temp.val($("#sc2-links").val()).select();
            document.execCommand("copy");
            //$temp.remove();
        });

        // clear button
        $(document).on('click', '#clear', function () {
            $("#sc2-links").val("");
            $(".sc2-append-link").each(function () {
                if ($(this).is(':checked')) {
                    $(this).prop("checked", false);
                }
            });
        });


    });



    $(document).ready(function () {
        var gh = [];
        $(document).on('change', '.sc2-append-link', function () {

            var link = $(this).next("a").attr("href"); // this gives me null
            var index = gh.indexOf(link);

            if ($(this).is(':checked')) {
                gh.push(link);
                $("#sc2-links").val(gh.join("\n\l"));
            } else {
                if (index > -1) {
                    gh.splice(index, 1);
                    $("#sc2-links").val(gh.join("\n\l"));
                }
            }
        });

        // checkbox all
        /*
        $(document).on('change', '#checkAll', function () {
            if ($(this).is(":checked")) {
                $(".sc2-append-link").each(function(){
                    $(this).prop("checked", true);
                    var link = $(this).next("a").attr("href"); // this gives me null
                    var index = gh.indexOf(link);

                    if ($(this).is(':checked')) {
                        gh.push(link);
                        $("#sc2-links").val(gh.join("\n\l"));
                    } else {
                        if (index > -1) {
                            gh.splice(index, 1);
                            $("#sc2-links").val(gh.join("\n\l"));
                        }
                    }
                });
                console.log(gh);

            }else{

            }
        });
        */
        // 5 seconds delay for loading of content
        $.wait(function () {
            $("body").trigger("change");
            console.log("delayover");
        }, 5);
    });

    $(window).bind('hashchange', function() {
     //code
        $("body").trigger("change");
    });


})();