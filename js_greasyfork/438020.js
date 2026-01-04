// ==UserScript==
// @name         Disable password check
// @namespace    https://github.com/yzs981130/st-disable-password-check/
// @version      1.0
// @description  Disable password complexity check
// @author       yzs
// @match        https://it.sensetime.com/dashboard/ad/
// @icon         data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAf9JREFUOI3lkk9Ik3Ecxp/f++6fK7W5mm2MOed6wTTTUjMa/bEaq2FIh0wLSiLwYhSIEERdojpIGAiCRYVkSkQHD/YHoZAO8aZdJAODmSZzc29tOPfWu717v90Wdu1Wz/VzeD48PMD/E8pmQcNDJurtXU+y/AecHgW9qK6kSbufZvfZ1rDwAii4208N5W++bHHJon1zOuQomaSq+v0AwOjSWTMyU4+hTzihKxCxJ8+JEt1TVvNukG5e5vD65Q3pe6Irm9V4Na0hSTxWVIbYclIJbhMaGTXW9sDC1+L46UPsVKdKP5aA+Q4vPreEcPvWQDSZPAcAzKjP2go2PYOskz5JUttqUaawzmZ7Ds23PUxHfVfXaI/cMdDB6vuRHW6K7HRT6kDFCl1p9ef4iab66aBXDZ3xhblYKm1Q56WT1NzioOgiqKezAQ8HJyLf4u0ggsVsjJvrKgLs+vCrXEPXBdFbyS2WFuuXGQnCwJiSOq/qmFIl2FdZLG7lZQUcz+BYZ5pDeVkzrhXOMvfIz5zBk4AnOifOFJPQzehIU9HUe3FsSU3v2phnQL6RR76Bz7isGx7BU9rNhkYl+rh1LxQpgKj2ARGTE1b5IjTDOEztHQwAqK9Ph/57fjDNAz2XQJlrAncfLDCL9fcuMzUOpL8eg0ZmZCxvYe8XmevwX//rX8gvoIzSfpOzjHUAAAAASUVORK5CYII=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/438020/Disable%20password%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/438020/Disable%20password%20check.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var old_password = $('#id_old_password');
    var enable_button = function() {
        $("#submitButton").prop('disabled', false);
    };
    old_password.keyup(enable_button);

    var current_status = GM_getValue("status", 1);
    var menu_id = GM_registerMenuCommand(status_command(), click);

    function status_command(){
        if (current_status === 1) {
            return "关闭跟随原密码";
        }
        return "开启跟随原密码";
    }

    function change_text(){
        if (current_status === 1) {
            set_original_password();
            old_password.keyup(set_original_password);
        }
        else {
            new_password.val('');
            new_password_verify.val('');
        }
    }

    function click(){
       GM_unregisterMenuCommand(menu_id);
       current_status = ~current_status;
       GM_setValue("status", current_status);
       menu_id = GM_registerMenuCommand(status_command(), click);
       change_text();
    }

    var set_original_password = function() {
        var password = $('#id_old_password').val();
        new_password.val(password);
        new_password_verify.val(password);
    };
    if (current_status === 1) {
        old_password.keyup(set_original_password);
    }
})();
