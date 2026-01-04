// ==UserScript==
// @name          MyFantasyLeague.com Confidence Pool
// @version       1.1.1
// @namespace     http://www66.myfantasyleague.com/2017/options?L=48002&O=121
// @description   jQuery test script
// @include       http://www66.myfantasyleague.com/2019/options?L=*&O=121*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js
// @resource      https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.css
// @downloadURL https://update.greasyfork.org/scripts/33524/MyFantasyLeaguecom%20Confidence%20Pool.user.js
// @updateURL https://update.greasyfork.org/scripts/33524/MyFantasyLeaguecom%20Confidence%20Pool.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    let css = `.selections-container {
            border: solid 1px #888888;
            padding: 10px;
        }

        .selections-container .selection {
            border: 1px dotted #5a5a5a;
            padding: 5px;
            width: 100%;
            cursor: move; /* fallback if grab cursor is unsupported */
            cursor: grab;
            cursor: -moz-grab;
            cursor: -webkit-grab;
       }
       .selections-container .selection:not(:last-child) {
           margin-bottom: 10px;
       }
       .selections-container .selection:active {
           cursor: grabbing;
           cursor: -moz-grabbing;
           cursor: -webkit-grabbing;
       }
       `;
    addGlobalStyle(css);
    $(document).ready(function() {
        const $radioInputs = $("table.report input[type='radio']");
        function generateSelectionContainer(inputId, inputName, inputValue, teamName, selected, rankInputName, confidenceRank) {
            let display = selected ? "block" : "none";
            return `<div style="display: ${display}" class="selection" data-input-id="${inputId}" data-current-confidence-rank="${confidenceRank}" data-input-name="${inputName}" data-input-value="${inputValue}" data-team-name="${teamName}" data-rank-input-name="${rankInputName}">${teamName}</div>`;
        }

        let html = "";
        $radioInputs.each(function() {
            let $input = $(this);
            let label = $($input.closest("label"));
            let inputId = $input.attr("id");
            let inputName = $input.attr("name");
            let inputValue = $input.attr("value");
            let teamName = $input.parent().find("label").text();
            let confidenceRank = $input.parent().parent().find("select").val();
            let rankInputName = "RANK" + inputName.replace("PICK", "");
            html += generateSelectionContainer(inputId, inputName, inputValue, teamName, this.checked, rankInputName, confidenceRank);
        });

        $radioInputs.change(function() {
            let radioGroup = $(this).attr("name");
            let radios = $("input[name='" + radioGroup + "']");
            radios.each(function() {
                updateSelectionContainerDisplay($(this).attr("id"), this.checked);
            });
        });

        function updateSelectionContainerDisplay(inputId, selected) {
            let display = selected ? "block" : "none";
            $("div.selection[data-input-id='" + inputId + "']").css("display", display);
        }

        function updateForm() {
            const $selections = $("div.selections-container div.selection:visible");
            $selections.each(function(i, $el) {
                let rankInputName = $($el).attr("data-rank-input-name");
                let newRank = $selections.length - i;
                $("select[name='" + rankInputName + "']").val(newRank);
            });
        }

        $("h3").before(`<div class="selections-container">` + html + `</div>` + `<button id="update-form">Update</button>`);

        var $wrapper = $('.selections-container');

        $wrapper.find('.selection').sort(function(a, b) {
            return +b.dataset.currentConfidenceRank - +a.dataset.currentConfidenceRank;
        })
            .appendTo($wrapper);

        dragula([document.querySelector('.selections-container')]);
        $("button#update-form").click(function() {
            updateForm();
        });

    });
})();