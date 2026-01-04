// ==UserScript==
// @name            NTNU Moodle Login Automator
// @version         1.3
// @description     自動登入 NTNU Moodle，並在被登出時重新登入
// @author          skyhong2002
// @namespace       https://greasyfork.org/zh-TW/users/1411030-skyhong2002
// @match           https://moodle3.ntnu.edu.tw/*
// @license         MIT
// @require         https://code.jquery.com/jquery-3.1.0.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/520748/NTNU%20Moodle%20Login%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/520748/NTNU%20Moodle%20Login%20Automator.meta.js
// ==/UserScript==

/* eslint-env jquery */

(function() {
    GM_registerMenuCommand('Reset credentials', function() { 
        GM_deleteValue('ntnu_credentials'); 
        window.location.reload(); 
    });

    // Check if credentials are saved, triggered on first startup
    if(GM_getValue('ntnu_credentials', 0) === 0){
        first_startup();
    }

    // Getting values for webpage check
    var domain = location.href;

    // If the user is on the login page
    if(domain.includes('login/index.php')){
        $(document).ready(function() {
            login_to_moodle();
        });
    }

    // If the user is redirected to a logout or inactive page
    if(domain.includes('moodle3.ntnu.edu.tw') && $('a[href*="login/index.php"]').length > 0) {
        window.location.href = 'https://moodle3.ntnu.edu.tw/login/index.php';
    }

})();

function first_startup() {
    // set-up dialog
    alert('歡迎使用 "NTNU Moodle 自動登入腳本"，請先設定您的帳號密碼。這些資料會儲存在本地端。');
    var username = prompt('請輸入您的 NTNU Moodle 使用者名稱：');
    var password = prompt('請輸入您的密碼：');
    var ntnu_credentials = [username, password];
    GM_setValue('ntnu_credentials', ntnu_credentials);
    console.log('Saved credentials: ', GM_getValue('ntnu_credentials'));
}

function login_to_moodle() {
    var username = GM_getValue('ntnu_credentials')[0];
    var password = GM_getValue('ntnu_credentials')[1];
    
    // Check and fill the login form
    $('input[name="username"]').val(username); // 使用 name 屬性
    $('input[name="password"]').val(password); // 使用 name 屬性
    
    // Click the login button
    $('button[type="submit"]').click(); // 更新選擇器
}
