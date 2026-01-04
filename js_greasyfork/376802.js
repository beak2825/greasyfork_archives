// ==UserScript==
// @name         マクロミル（SP版・事前）
// @namespace    macromill_sp
// @version      0.7.2
// @description  新UI作ったやつは肉骨粉食え
// @author       nikukoppun
// @include      https://monitor.macromill.com/airs/exec/smartAnswerAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376802/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%E3%83%BB%E4%BA%8B%E5%89%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376802/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88SP%E7%89%88%E3%83%BB%E4%BA%8B%E5%89%8D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (0 < $(".qtype-matrix").size()) {

        let scriptHtml = `<script>
            function allCheck(ptn) {
                var inputNum;
                if (ptn == 0) {
                    inputNum = "1";
                } else if (ptn == 1) {
                    inputNum = "";
                } else {
                    inputNum = window.prompt("何番目を一括チェックしますか？ (1～)", "");
                    if (inputNum == null) return;
                }
                allCheckMain(inputNum);
            }
            function allCheckMain(inputNum) {
                var targetSelector = null;
                if (0 < $(".matrix_chk").length) {
                    targetSelector = $(".matrix_chk");
                } else if (0 < $(".matrix-selections").length) {
                    targetSelector = $(".matrix-selections");
                }
                if (targetSelector == null) {return}
                targetSelector.each(function(i, elem) {
                    var checkNum;
                    if (0 < $(elem).find("li[data-choiceid]").length) {
                        if (inputNum == "") {
                            checkNum = $(elem).find("li[data-choiceid]").length - 1;
                        } else {
                            checkNum = parseInt(inputNum) - 1;
                        }
                        $(elem).find("li[data-choiceid]:eq(" + checkNum + ")").click();
                    }
                });
                $("#finishButton").addClass("btnshow");
            }
            function formSubmit() {
                $("form[name='smartAnswerForm']").submit();
            }
        </script>`;

        let styleHtml = `<style>
            div.allChoise {
                clear: both;
                float: right;
                margin-top: 5px;
            }
            span.allChoise {
                border: 1px solid white;
                margin-right: 3px;
                margin-bottom: 3px;
                cursor: pointer;
                width: 3ex;
                display: inline-block;
                text-align: center;
            }
            button.utilButton {
                border: 1px solid white;
                margin-right: 3px;
                margin-bottom: 3px;
                cursor: pointer;
                display: inline-block;
                text-align: center;
                font-size: 100%;
                font-weight: normal;
                font-style: normal;
            }
            ul.qnr-q-req {
                clear: both;
            }
        </style>`;

        let targetSelector = null;
        if (0 < $(".matrix_chk").length) {
            targetSelector = $(".matrix_chk:first");
        } else if (0 < $(".matrix-selections").length) {
            targetSelector = $(".matrix-selections:first");
        }

        if (targetSelector != null) {
            let choiseLength = targetSelector.find("li[data-choiceid]").length;
            let buttonHtml = `<div class="allChoise"><button class="utilButton" onclick="formSubmit();return false;">強制送信</button>`;
            for (let i = 1; i < choiseLength + 1; ++i) {
                buttonHtml = buttonHtml + `<span class="allChoise" onclick="allCheckMain(${i})">${i}</span>`;
            }
            buttonHtml = buttonHtml + `</div>`;

            $("div.qnr-q-qbody-furl").append(styleHtml + scriptHtml + buttonHtml);
        }
    } else {
        let scriptHtml = `<script>
            function formSubmit() {
                $("form[name='smartAnswerForm']").submit();
            }
        </script>`;

        let styleHtml = `<style>
            div.utilButton {
                clear: both;
                float: right;
                margin-top: 5px;
            }
            button.utilButton {
                border: 1px solid white;
                margin-right: 3px;
                margin-bottom: 3px;
                cursor: pointer;
                display: inline-block;
                text-align: center;
                font-size: 100%;
                font-weight: normal;
                font-style: normal;
            }
            ul.qnr-q-req {
                clear: both;
            }
        </style>`;

        let buttonHtml = `<div class="utilButton">
            <button class="utilButton" onclick="formSubmit();return false;">強制送信</button>
        </div>`;

        $("div.qnr-q-qbody-furl").append(styleHtml + scriptHtml + buttonHtml);
    }

    let scriptHtmlAll = `<script>
        $("#finishButton").on("click", (e) => {
            if (typeof clickCount !== 'undefined') {
                clickCount = 100;
            }
        });
        const handlers = $._data("#finishButton").events.click;
        handlers.unshift(handlers.pop());
    </script>`;
    $("body").append(scriptHtmlAll);

})();