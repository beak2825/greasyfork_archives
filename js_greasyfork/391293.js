// ==UserScript==
// @name         fuckjuicestore
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://juicestore.com/password
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391293/fuckjuicestore.user.js
// @updateURL https://update.greasyfork.org/scripts/391293/fuckjuicestore.meta.js
// ==/UserScript==

(function() {
    var html= "<div style='text-align:center;'><p style='color:white;'>FirstName: <input  type='text' id='firstName'> </p><p style='color:white;'>SecondName: <input type='text' id='lastName'> </p><p style='color:white;'>Email: <input type='text' id='email'> </p><p style='color:white;'>Password <input type='text' id='password'></p><p style='color:white;'><button id='register'>注册</button></p></div>";
    $('body').append(html);
    $("#register").click(function(e) {
            const firstName = $("#firstName").val();
            const lastName = $("#lastName").val();
            const email = $("#email").val();
            const password = $("#password").val();
            var data = "form_type=create_customer&utf8=%E2%9C%93&customer%5Bfirst_name%5D=" + firstName + "&customer%5Blast_name%5D=" + lastName + "&customer%5Bemail%5D=" + email + "&customer%5Bpassword%5D=" + password;
            jQuery.post('https://juicestore.com/account', data).done(
                function(response) {
                    var logErrors = jQuery(response).find('.errors').text();
                    if (logErrors != '' && logErrors != 'undefined') {
                        alert(logErrors);
                    } else {
                        alert('Account created!');
                    }
                }).fail(
                function() {
                    alert('Failed to create account! Please try different details or activate a VPN!');
                }
            );
        });
})();