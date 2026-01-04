// ==UserScript==
// @name         Shogiwars Account Switcher
// @version      0.1
// @description  A simple login prompt for Shogi Wars multi account
// @author       Quisette
// @match        https://shogiwars.heroz.jp/web_app/standard/
// @icon         https://image-pona.heroz.jp/web_app/favicon/apple-touch-icon-120x120.png
// @run-at       document-start
// @license private
// @namespace https://greasyfork.org/users/943685
// @downloadURL https://update.greasyfork.org/scripts/454341/Shogiwars%20Account%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/454341/Shogiwars%20Account%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // enter the value by the order of "user_id", "user_secret", "user_token", "user_secret_setup"
    var account=[
        // Please use "current" command to find these values in inspector page.
        //      ["user_id","user_secret","user_token","user_secret_setup"],
        
    ]

    var accountnum = prompt("Please enter your account number,\ntype in \"current\" to show current info, \nor type \"list\" to list available accounts.", "");
    if(accountnum == "list"){
        var nameList = ""
        for(var i = 0; i < account.length; i++){
            nameList += i + ": " + account[i][0] + "\n"
        }
        window.alert(nameList)
    }else if(accountnum == "current"){
        console.log("user_id: " + localStorage.getItem("user_id"))
        console.log("user_secret: " + localStorage.getItem("user_secret"))
        console.log("user_token: " + localStorage.getItem("user_token"))
        console.log("user_secret_setup: " + localStorage.getItem("user_secret_setup"))

        window.alert("check console page by tapping F12 for your IDs.")
    }else if (accountnum == null || accountnum == "") {
        window.alert("Account has not switched.")
    } else {
        if(accountnum >= account.length){
            window.alert("This account does not exist.")
        }else{
            localStorage.setItem("user_id", account[accountnum][0])
            localStorage.setItem("user_secret", account[accountnum][1])
            localStorage.setItem("user_token", account[accountnum][2])
            localStorage.setItem("user_secret_setup", account[accountnum][3])
            window.alert("switched account to " +account[accountnum][0])
        }
    }



})();


