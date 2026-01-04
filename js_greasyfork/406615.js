// ==UserScript==
// @name         Vortex finder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Find all vortexs on space
// @author       Maxime VINCENT
// @match        https://www.origins-return.fr/univers-origins/flotte_vortex.php*
// @require      http://code.jquery.com/jquery-3.5.1.slim.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/406615/Vortex%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/406615/Vortex%20finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findLastCoo() {
        let res = $('table.tableau:first-of-type tr td font:last-of-type')
        if (res && res.length) {
            let link = res.parents('tr').children('td').children('input').attr('onClick').slice(6, -2)
            $.ajax({
                url : link,
                method : 'GET',
                async : false
            })
        }
        return JSON.parse(GM_getValue('last_coo', JSON.stringify([1, 0])))
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function tryNextCoo() {
        let coo = findLastCoo()
        coo[1]++
        if (coo[1] > 100) {
            coo[0]++;
            coo[1] = 1
        }
        if (coo[0] <= 72) {
            $('form[action="flotte_vortex.php?type=add"] table.tableau tr td select[name=galaxi]').val(coo[0])
            $('form[action="flotte_vortex.php?type=add"] table.tableau tr td select[name=system]').val(coo[1])
            GM_setValue('last_coo', JSON.stringify(coo))
            $('form[action="flotte_vortex.php?type=add"]').submit()
        }
        else {
            GM_deleteValue('last_coo')
            GM_setValue('finding_vortex', "false")
        }
    }

    $('input[type=submit][value=Envoyer]').after(`
<table class="tableau" width="74%" style="margin-top: 15px">
<tr class="tabligne2" style="text-align:center">
<td colspan="3"><b>Rechercher des vortex</b></td>
</tr>
<tr class="tabligne1" style="text-align:center">
<td><input type="button" id="find-them-all" value="Search Vortex" /></td>
<td><input type="button" id="set-coo" value="Set Coo" /></td>
<td><input type="button" id="stop-find-them-all" value="Stop Search"/></td>
</tr>
</table>
`)
    $('#stop-find-them-all').on('click', function (e) {
        e.preventDefault()
        GM_deleteValue('finding_vortex')
    })

    $('#find-them-all').on('click', function (e) {
        e.preventDefault()
        GM_setValue('finding_vortex', "true")
        tryNextCoo()
    })

    $('#set-coo').on('click', function (e) {
        e.preventDefault()
        let coo = [
            $('form[action="flotte_vortex.php?type=add"] table.tableau tr td select[name=galaxi]').val(),
            $('form[action="flotte_vortex.php?type=add"] table.tableau tr td select[name=system]').val()
        ]
        GM_setValue('last_coo', JSON.stringify(coo))
    })

    let coo = findLastCoo()
    $('form[action="flotte_vortex.php?type=add"] table.tableau tr td select[name=galaxi]').val(coo[0])
    $('form[action="flotte_vortex.php?type=add"] table.tableau tr td select[name=system]').val(coo[1])

    if (JSON.parse(GM_getValue('finding_vortex', "false")) === true) {
        setTimeout(tryNextCoo, getRandomArbitrary(200, 500))
    }

})();