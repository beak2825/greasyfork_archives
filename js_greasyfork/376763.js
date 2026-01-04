// ==UserScript==
// @name         マクロミル（PC版・事前）
// @namespace    macromill_pc
// @version      0.4
// @description  新UI作ったやつは肉骨粉食え
// @author       nikukoppun
// @include      https://monitor.macromill.com/airs/exec/answerAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376763/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88PC%E7%89%88%E3%83%BB%E4%BA%8B%E5%89%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376763/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%EF%BC%88PC%E7%89%88%E3%83%BB%E4%BA%8B%E5%89%8D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (0 < $("form[name=answerForm] td[class^=matrix]").size()) {

        let scriptHtml = `<script>
            function allCheck(ptn) {
                var inputNum;
                if (ptn == 0) {
                    inputNum = "1";
                } else if (ptn == 1) {
                    inputNum = "";
                } else {
                    inputNum = window.prompt("何列目を一括チェックしますか？ (1～) (0=全チェックをクリア)", "");
                    if (inputNum == null) return;
                }
                var tbl = $("form[name=answerForm] td[class^=matrix]:first").closest("table");
                if (inputNum == "0") {
                    tbl.find("input[type='checkbox']:checked").click();
                    return;
                }
                allCheckMain(tbl, inputNum);
            }
            function allCheckMain(tbl, inputNum) {
                tbl.find("tr").each(function(i, elem) {
                    var checkNum;
                    if (0 < $(elem).find("input[type='radio']").length) {
                        if (inputNum == "") {
                            checkNum = $(elem).find("input[type='radio']").length - 1;
                        } else {
                            checkNum = parseInt(inputNum) - 1;
                        }
                        if (0 <= checkNum) {
                            $(elem).find("input[type='radio']:eq(" + checkNum + ")").click();
                        }
                    }
                    if (0 < $(elem).find("input[type='checkbox']").length) {
                        if (inputNum == "") {
                            checkNum = $(elem).find("input[type='checkbox']").length - 1;
                        } else {
                            checkNum = parseInt(inputNum) - 1;
                        }
                        if (0 <= checkNum) {
                            $(elem).find("input[type='checkbox']:eq(" + checkNum + ")").click();
                        }
                    }
                });
            }
            function allCheckRow(elem) {
                elem.find("input[type='radio']").click();
                elem.find("input[type='checkbox']").click();
            }
            function allCheckBottom() {
                var tbl = $("form[name=answerForm] td[class^=matrix]:first").closest("table");
                tbl.children("tbody").children("tr:last").find("input[type='radio']").click();
                tbl.children("tbody").children("tr:last").find("input[type='checkbox']").click();
            }
            function formSubmit() {
                $("form[name='answerForm']").submit();
            }
            $("form[name=answerForm] td[class^=matrix]:first").closest("table").find("tr:first > td").on("click",function(){
                var thisIndex = $("form[name=answerForm] td[class^=matrix]:first").closest("table").find("tr:first > td").index(this);
                allCheckMain($("form[name=answerForm] td[class^=matrix]:first").closest("table"), thisIndex);
            });
            $("td.matrix2").on("click",function(){
                allCheckRow($(this).closest("tr"));
            });
            </script>`;

        let styleHtml = `<style>
            button.utilButton {
                float: right;
                margin: 0.5rem;
                padding: 0.5rem;
            }
        </style>`;

        let buttonHtml = `
            <button class="utilButton" onclick="allCheck(1);return false;">縦（→）</button>&nbsp;&nbsp;
            <button class="utilButton" onclick="allCheck(9);return false;">縦（任意）</button>&nbsp;&nbsp;
            <button class="utilButton" onclick="allCheck(0);return false;">縦（←）</button>&nbsp;&nbsp;
            <button class="utilButton" onclick="allCheckBottom();return false;">横（最終行）</button>&nbsp;&nbsp;
            <button class="utilButton" onclick="formSubmit();return false;">強制送信</button>
        `;

        let tbl = $("form[name=answerForm] td[class^=matrix]:first").closest("table");
        tbl.before(scriptHtml + styleHtml + buttonHtml);

    } else {

        let scriptHtml = `<script>
            function formSubmit() {
                $("form[name='answerForm']").submit();
            }
            </script>`;

        let styleHtml = `<style>
            div.utilButton {
                margin-top: 0.5rem;
            }
            button.utilButton {
                float: right;
                margin: 0.5rem;
                padding: 0.5rem;
            }
        </style>`;

        let buttonHtml = `<div class="utilButton">
            <button class="utilButton" onclick="formSubmit();return false;">強制送信</button>
        </div>`;

        $("td.q-text").append(scriptHtml + styleHtml + buttonHtml);
    }

    if (0 < $(".btnForm2").length) {
        $(".btnForm2").attr("onclick", $(".btnForm2").attr("onclick").replace(/answerSubmit/, "aplSubmit"));
    }

})();