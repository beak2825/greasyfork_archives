// ==UserScript==
// @name         AccountSelector
// @namespace    http://ae-mobile.com/
// @version      0.1
// @description  替换AWS登录账号
// @author       fuxiao
// @match        https://signin.aws.amazon.com/signin*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/389759/AccountSelector.user.js
// @updateURL https://update.greasyfork.org/scripts/389759/AccountSelector.meta.js
// ==/UserScript==

(function() {


    var sel = $('<select class="aws-signin-textfield"></select>');
    sel.append('<option value="">请选择...</option>');
    sel.append('<option>bingo.online@ae-mobile.com</option>');
    sel.append('<option>aecasino@ae-mobile.com</option>');
    sel.append('<option>aeads@ae-mobile.com</option>');
    sel.append('<option>ace@ae-mobile.com</option>');
    sel.append('<option>amazon@ae-mobile.com</option>');
    sel.append('<option value="custom">自定义</option>');
    sel.on('change', function() {
        var v = $(this).val();
        if(v == "custom") {
            $("#resolving_input").show();
            $(this).hide();
        }
        else {
            $('#resolving_input').val($(this).val());
        }
    });

    $('#resolving_input').parent().append(sel);
    $('#resolving_input').hide();
    //sel.before();


})();