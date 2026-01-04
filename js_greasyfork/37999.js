// ==UserScript==
// @name           Next page in Lobby Epicmafia
// @namespace      https://greasyfork.org/en/users/159342-cleresd
// @description    Add Go through the selected next pages button in Lobby of Epicmafia
// @match          https://epicmafia.com/lobby*
// @version 1.01
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/37999/Next%20page%20in%20Lobby%20Epicmafia.user.js
// @updateURL https://update.greasyfork.org/scripts/37999/Next%20page%20in%20Lobby%20Epicmafia.meta.js
// ==/UserScript==


if ($('#gamepage').length) {
  $('#gamepage').find('a.t').last().parent().after('| <button id="_oGoThruoghButton" style="background-color: #e7e7e7; color: #777; border: 1px solid #bbb; padding: 2px 5px; text-align: center; text-decoration: none; display: inline-block; font-size: .8em; cursor: pointer; border-radius: 4px; " onclick="_oGoToN()" onmouseover="this.style.color=\'#fff\';" onmouseout="this.style.color=\'#777\';">Go through</button> <input id="_oGoSelectedPageCount" style="text-align: center; width: 2em; height: 1em;"></input> <li class="smallfont"> pages</li>');
}

_oGoToN = function () {
    let count = Number($('#_oGoSelectedPageCount').val());
    let curr = 0;
    let intervalButtomClickNext = setInterval(() => {
        $('#gamepage').find('a.t').last().click();
        curr++;
        if (curr === count) clearInterval(intervalButtomClickNext);
    }, 755);
};

window.nr = function(roleName) {
    let count = 60;
    let curr = 0;
    let intervalButtomClickNext = setInterval(()=>{
        if (curr >= count || ($('div.roleimg.tt.role-' + roleName).length && $('div.roleimg.tt.role-' + roleName).parent().parent().parent().parent().css('border') != '1px solid rgb(255, 0, 0)')) {
            clearInterval(intervalButtomClickNext);
            $('div.roleimg.tt.role-dreamer').parent().parent().parent().parent().css('border', '1px solid red');
        } else {
            $('#gamepage').find('a.t').last().click();
            curr++;
        }
    }
    , 800);
};