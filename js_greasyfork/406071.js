// ==UserScript==
// @name         ミルトーク（一括NGボタン追加）
// @namespace    milltalk
// @version      0.2
// @description  新UI作ったやつは肉骨粉食え
// @author       nikukoppun
// @match        https://milltalk.jp/
// @match        https://milltalk.jp/?*
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406071/%E3%83%9F%E3%83%AB%E3%83%88%E3%83%BC%E3%82%AF%EF%BC%88%E4%B8%80%E6%8B%ACNG%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/406071/%E3%83%9F%E3%83%AB%E3%83%88%E3%83%BC%E3%82%AF%EF%BC%88%E4%B8%80%E6%8B%ACNG%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function(d){
        let head = d.getElementsByTagName("head")[0];
        let link = d.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", "https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css");
        head.appendChild(link);
    })(document);

    appendUtilButtons();

    var observer = new MutationObserver(function (MutationRecords, MutationObserver) {
        appendUtilButtons();
    });
    observer.observe($("html").get(0), {
        attributes: true,
    });

    function appendUtilButtons() {
        if (0 < $(".form-search").find(".addedButtons").length) {
            return;
        }

        let styleHtml = `<style>
            .addedButtons {
                width: 10em;
                word-break: keep-all;
                word-wrap: normal;
                margin: 0 0 0 1em;
                padding: 0;
            }
            .utilButton1 {
                cursor: pointer;
                background-color: cornsilk;
            }
            #mutetarget {
                width: -moz-available;
                height: inherit;
                width: -webkit-fill-available;
                height: -webkit-fill-available;
            }
            .ui-dialog-titlebar {
                /*display: none;*/
            }
            .ui-dialog-buttonset{
               width: 100%;
               display: flex;
               display: -webkit-flex;
               text-align: center;
               justify-content: space-around;
               -webkit-justify-content: space-around;
            }
        </style>`;

        let scriptHtml = `<script>
            function muteAllDialog() {
                var outputText = "";
                var isBreak = false;
                var selector = ".box-board-part a:visible";
                $(selector).each(function(i, elem) {
                    outputText = outputText + $(elem).attr("href").replace("/boards/", "") + "\\n";
                });
                $("#mutetarget").val(outputText);
                $(".jqueryui_dialog").dialog({
                    title: "Mute All",
                });
                $(".jqueryui_dialog").dialog("open");
            }
            function muteAll() {
                var targets = $("#mutetarget").val().split("\\n");
                var isError = false;
                for (var key in targets) {
                    var target = targets[key];
                    if (target.trim().length < 1) {
                        continue;
                    }
                    $.ajax({
                        type: "POST",
                        url: "/board_mutes/create.json",
                        async: false,
                        data: {
                            board_id: target
                        },
                        success: function () {
                            console.log("success: " + target);
                        },
                        error: function () {
                            isError = true;
                            console.log("failure: " + target);
                        }
                    });
                }
                $(".jqueryui_dialog").dialog("close");
                if (!isError) {
                    location.reload();
                }
            }
            $(".jqueryui_dialog").dialog({
                autoOpen: false,
                width: 400,
                height: 500,
                autoOpen: false,
                modal: true,
                buttons:[
                    {
                        text: 'OK',
                        class:'btn-mute',
                        click: function() {
                            muteAll();
                        }
                    },
                    {
                        text: 'Cancel',
                        class:'btn-cancel',
                        click: function() {
                            $(this).dialog("close");
                        }
                    },
                ]
            });
            $(document).on("click", ".ui-widget-overlay", function(){
                $(".jqueryui_dialog").dialog("close");
            });
        </script>`;

        let buttonHtml = `
            <div class="addedButtons">
                <span class='common-button mini button-2 utilButton1 muteall' onclick='muteAllDialog();return false;'>Mute ALL</span>
            </div>`;

        let dialogHtml = `
            <div class="jqueryui_dialog">
                <textarea id="mutetarget" spellcheck="false"></textarea>
            </div>`;

        $(".form-search").append(styleHtml + scriptHtml + buttonHtml + dialogHtml);
    }

})();