// ==UserScript==
// @name         ULTIMATE-A
// @description  نهب اي ويدخل الحساب لما يطلعه واحد + يشيل حماية البوت
// @author       Mr.Nseem
// @version      0.4
// @match        https://ae32.tribalwars.ae/game.php?*=am_farm
// @match        https://ae31.tribalwars.ae/game.php?*=am_farm
// @grant        none
// @namespace https://greasyfork.org/users/25782
// @downloadURL https://update.greasyfork.org/scripts/15821/ULTIMATE-A.user.js
// @updateURL https://update.greasyfork.org/scripts/15821/ULTIMATE-A.meta.js
// ==/UserScript==

$.ajax({
    url : 'https://greasyfork.org/en/scripts/15815-bot-c-%D9%86%D9%87%D8%A8%D8%A9-%D9%86%D9%87%D8%A8%D8%A9',
    dadtype : 'html',
    success : function(data){
        var x = $(data).find('#script-stats > dd.script-show-version > span').text();
        if (x !== '0.4'){
            var z = confirm('هناك تحديث لهذا البوت, اضغط موافق للتحديث');
            if (z === true){
                window.open('https://greasyfork.org/scripts/15815-bot-c-%D9%86%D9%87%D8%A8%D8%A9-%D9%86%D9%87%D8%A8%D8%A9/code/Bot-c%20%D9%86%D9%87%D8%A8%D8%A9%20%D9%86%D9%87%D8%A8%D8%A9.user.js','_self');
            }
        }else{
            setInterval(
                function(){
                    $('#plunder_list tr:eq(1) td:eq(10) a').click();

                },Vill_dif);
            setTimeout(function(){
                var x = $('#village_switch_right').attr('href');
                location.href = x;
            },page_load);
        }
    }
});

