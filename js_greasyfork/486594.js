// ==UserScript==
// @name         學習歷程登入優化
// @namespace    http://your-namespace.com/
// @version      1.5
// @description  Auto select district and school
// @author       Chiu Kuan Hsun
// @match        https://highschool.kh.edu.tw/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486594/%E5%AD%B8%E7%BF%92%E6%AD%B7%E7%A8%8B%E7%99%BB%E5%85%A5%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/486594/%E5%AD%B8%E7%BF%92%E6%AD%B7%E7%A8%8B%E7%99%BB%E5%85%A5%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==

class DistrictSchoolSelector {
    constructor() {
        this.schNoValue = GM_getValue('schNoValue', '');
        this.schNoSelectIndex = GM_getValue('schNoSelectIndex','');
        // Create the menu command
        this.createMenuCommand();

        // Wait for the login button to be pressed
        this.waitForLoginButton();
        this.autoClick();
    }

    createMenuCommand() {
        /*GM_registerMenuCommand('District School Selector', () => {
            this.showSelectorDialog();
        });*/
        GM_registerMenuCommand('重置預設學校 Reset Default School', () => {
            GM_deleteValue ( "schNoValue" );
            GM_deleteValue ( "schNoSelectIndex" );
            this.schNoValue = GM_getValue('schNoValue', '');
            this.schNoSelectIndex = GM_getValue('schNoSelectIndex','');
            alert('Finish Resetting!');
            window.location.reload();
        },'r');
    }

    showSelectorDialog() {
        // Read the value from the element with id 'schNo'
        const schNoElement = document.getElementById('schNo');
        const schNoValue = schNoElement ? schNoElement.value : '';
        if(!GM_getValue('schNoValue','')){
            GM_setValue('schNoValue',schNoValue);
        }
        this.schNoValue = GM_getValue('schNoValue', '');
        console.log("選擇的學校代碼：" + schNoValue);


        const schNoSelectIndex = schNoElement ? schNoElement.selectedIndex : '';
        if(!GM_getValue('schNoSelectIndex','')){
            GM_setValue('schNoSelectIndex',schNoSelectIndex);
        }
        this.schNoSelectIndex = GM_getValue('schNoSelectIndex','');
        console.log("選擇的索引：" + schNoSelectIndex);

    }

    waitForLoginButton() {
        // Wait for the login button to be pressed
        const loginButton = document.getElementById('login');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                // Execute your logic when the login button is clicked
                this.onLoginButtonClicked();
             // Listen for keydown event on the document
            });
        document.addEventListener('keydown', (event) => {
                // Check if the pressed key is Enter (key code 13)
                if (event.key === 'Enter') {
                    // Execute your logic when the Enter key is pressed
                    this.onEnterKeyPressed();
                }
            });
        } else {
            // If the login button is not found, check again after a short delay
            setTimeout(() => this.waitForLoginButton(), 500);
        }

    }
    autoClick(){
        const textElement = document.getElementById('validateCode');

        if(true){
            textElement.addEventListener('input', function(event) {
            const text = event.target.value.trim(); // 获取文本内容并去除空白
            if (text.length == 4) {
                console.log('驗證碼已填上：', text);
                setTimeout(() => document.querySelector('#login').click(),1000);
            }
            });
        }
         else {
            // If the login button is not found, check again after a short delay
            setTimeout(() => this.autoClick(), 500);
    }
    }
    onLoginButtonClicked() {
        // Execute your logic here when the login button is clicked
        console.log('Login button clicked!');
        this.showSelectorDialog();
    }
    onEnterKeyPressed() {
        // Execute your logic here when the Enter key is pressed
        console.log('Enter key pressed!');
        this.showSelectorDialog();
    }
}

// Entry point
(function () {
    new DistrictSchoolSelector();
    'use strict';
    setTimeout(() => document.querySelector('#loginId').click(),1000);
	setTimeout(2000);
$.post("School.action", { schNo: GM_getValue('schNoValue','') }, function (json) {
    var d = json.parameterMap;
    if (d != null && d.list != null) {
        var h1 = ['<option value="">請選擇</option>'];
        var cc = {};

        var doChange = false;

        for (var i = 0; i < d.list.length; i++) {
            var selected = '';
            if (d.list[i].d == 'Y') {
                selected = ' selected="selected"';
                doChange = true;
            }
            h1.push('<option value="' + d.list[i].z + '"' + selected + '>' + d.list[i].n + '</option>');
            cc['' + d.list[i].z] = d.list[i].s;
        }

        $("#zip").html(h1.join("")).change(function () {
            var v = $(this).val();
            var def = $('#schNo').attr("def");
            $('#schNo').removeAttr("def");

            if (cc[v]) {
                var h2 = ['<option value="">請選擇</option>'];
                for (var i = 0; i < cc[v].length; i++) {
                    var selected = '';
                    if (def != null && def == cc[v][i].s) selected = ' selected="selected"';
                    h2.push('<option value="' + cc[v][i].s + '"' + selected + '>' + cc[v][i].n + '</option>');
                }
                $("#schNo").html(h2.join(""));
                if (h2.length == 2) {
                    $("#schNo").val($("#schNo").find("option:last")[0].value);
                    $("#loginId").focus();
                }
            }
        })

        if (doChange) {
            $("#schNo").attr("def", "553301D");
            $("#zip").change();
        }
    }
    setTimeout(3000);
    $("#schNo").prop("selectedIndex", GM_getValue('schNoSelectIndex',''));
}, 'json');
})();
(function() {
    'use strict';

    // Your code here...
    document.querySelector('input[name="loginId"]').value = '自行填入帳號';
    document.querySelector('input[name="password"]').value = '自行填入密碼';
})();
