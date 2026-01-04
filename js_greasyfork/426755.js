// ==UserScript==
// @name         TMVN Squad Hide
// @version      3
// @namespace    https://trophymanager.com
// @description  Trophymanager: hide the players who buy wholesale to focus on the main squad
// @match        https://trophymanager.com/club/*/squad/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426755/TMVN%20Squad%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/426755/TMVN%20Squad%20Hide.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_KEEP_RANGE = [[1, 39]];

    const RANGE_NUMBER_INVALID_ALERT = 'Range value has form [[a, b], [c, d], [e, f]] with 1 or more pairs of [x, y], x & y > 0 and are integer';

    const LOCAL_STORAGE_KEY = 'TMVN_SQUAD_HIDE_NUMBER';
    const HIDE_DIV_ID = 'tmvn_script_squad_hide_div_id';
    const INPUT_ID = 'tmvn_script_squad_hide_input';

    const BUTTON_ID = {
        SAVE: 'tmvn_script_squad_save_button',
        HIDE: 'tmvn_script_squad_hide_button',
    }
    const BUTTON_HIDE_TEXT = {
        HIDE: 'Hide',
        SHOW: 'Show'
    }

    try {
        $('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
    } catch (err) {}

    let divContainer = $('.column1')[0];

    let hideArea =
        '<div class="box">' +
        '<div class="box_head"><h2 class="std">HIDE</h2></div>' +
        '<div class="box_body">' +
        '<div class="box_shadow"></div>' +
        '<div id="' + HIDE_DIV_ID + '" class="content_menu"></div>' +
        '<div class="box_footer"><div></div></div>' +
        '</div>';

    $(".column1").append(hideArea);

    let hideArea_content = '<table>';
    hideArea_content += '<tr><td style="text-align: center;">';
    hideArea_content += '<input type="checkbox" name="main-team-checkbox" id="main-team-checkbox" value="Main" checked> Main team';
    hideArea_content += '<input type="checkbox" name="b-team-checkbox" id="b-team-checkbox" value="B" checked> B team';
    hideArea_content += '</td></tr>';
    hideArea_content += '<tr><td style="text-align: center;">';
    hideArea_content += '<input type="checkbox" name="shirt-number" id="shirt-number" value="Shirt" checked> Shirt';
    hideArea_content += '<input id="' + INPUT_ID + '" type="text" class="embossed" style="width: 120px; line-height: 150%; padding: 3px 3px 4px 3px;" placeholder="Number to keep">';
    hideArea_content += '</td></tr>';
    hideArea_content += '<tr><td style="text-align: center;">';
    hideArea_content += '<span id="' + BUTTON_ID.SAVE + '" class="button" style="margin-left: 3px;"><span class="button_border">Save</span></span>';
    hideArea_content += '<span id="' + BUTTON_ID.HIDE + '" class="button" style="margin-left: 3px;"><span class="button_border">' + BUTTON_HIDE_TEXT.HIDE + '</span></span>';
    hideArea_content += '</td></tr>';
    hideArea_content += '</table>';

    $("#" + HIDE_DIV_ID).append(hideArea_content);

    let keepRange;
    getKeepRangeFromLocalStorage();
    document.getElementById(BUTTON_ID.SAVE).addEventListener('click', (e) => {
        save();
    });
    document.getElementById(BUTTON_ID.HIDE).addEventListener('click', (e) => {
        toggle();
    });

    function toggle() {
        let btn = $('#' + BUTTON_ID.HIDE)[0];
        let mainTeamShow = $('#main-team-checkbox').is(':checked');
        let bTeamShow = $('#b-team-checkbox').is(':checked');
        let shirtFilter = $('#shirt-number').is(':checked');
        let keepRange;

        if (shirtFilter) {
            let inputValue = $('#' + INPUT_ID)[0].value;
            if (inputValue == '') {
                alert('Input shirt number ranges into textbox');
                return;
            }
            if (!isValidRangeNumber(inputValue)) {
                alert(RANGE_NUMBER_INVALID_ALERT);
                return;
            }
            keepRange = JSON.parse(inputValue);
        }

        if (btn.innerText == BUTTON_HIDE_TEXT.HIDE) {
            let tdNumberArr = $('.align_center.minishirt.small');
            for (let i = 0; i < tdNumberArr.length; i++) {
                let trNode = tdNumberArr[i].parentNode;
                let number = tdNumberArr[i].innerText;
                let bTeam = trNode.querySelector('span.b_team_icon') != null;

                if (!bTeamShow && bTeam) {
                    trNode.style.display = 'none';
                } else if (!mainTeamShow && !bTeam) {
                    trNode.style.display = 'none';
                } else if (shirtFilter) {
                    let isValidNumber = false;
                    for (let j = 0; j < keepRange.length; j++) {
                        if (Number(number) >= keepRange[j][0] && Number(number) <= keepRange[j][1]) {
                            isValidNumber = true;
                        }
                    }
                    if (!isValidNumber) {
                        trNode.style.display = 'none';
                    }
                }
            }
            btn.children[0].innerText = BUTTON_HIDE_TEXT.SHOW;
        } else {
            let tdNumberArr = $('.align_center.minishirt.small');
            for (let i = 0; i < tdNumberArr.length; i++) {
                tdNumberArr[i].parentNode.style.display = '';
            }
            btn.children[0].innerText = BUTTON_HIDE_TEXT.HIDE;
            $("#main-team-checkbox").prop("checked", true);
            $("#b-team-checkbox").prop("checked", true);
            $("#shirt-number").prop("checked", true);
        }
    }

    function getKeepRangeFromLocalStorage() {
        try {
            let lsData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (lsData == null || lsData == "") {
                lsData = DEFAULT_KEEP_RANGE;
            } else if (isValidRangeNumber(lsData)) {
                lsData = JSON.parse(lsData);
            } else {
                lsData = DEFAULT_KEEP_RANGE;
            }
            $('#' + INPUT_ID).val(JSON.stringify(lsData));
        } catch (e) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            $('#' + INPUT_ID).val(JSON.stringify(DEFAULT_KEEP_RANGE));
        }
    }

    function isValidRangeNumber(value) {
        let result = true;
        try {
            let array = JSON.parse(value);
            for (let i = 0; i < array.length; i++) {
                if (isNaN(array[i][0]) || isNaN(array[i][1]) || !isInt(array[i][0]) || !isInt(array[i][1]) || array[i][0] <= 0 || array[i][1] <= 0) {
                    throw Exception;
                }
            }
        } catch (e) {
            result = false;
        }
        return result;
    }

    function save() {
        let inputValue = $('#' + INPUT_ID)[0].value;
        if (inputValue == '') {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            alert('Remove successful');
        } else if (isValidRangeNumber(inputValue)) {
            localStorage.setItem(LOCAL_STORAGE_KEY, inputValue);
            alert('Save successful');
        } else {
            alert(RANGE_NUMBER_INVALID_ALERT);
        }
    }

    function isInt(n) {
        return n % 1 === 0;
    }
})();
