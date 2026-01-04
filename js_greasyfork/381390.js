// ==UserScript==
// @name         HOJ Addon - Username Helper
// @namespace    https://twitter.com/r1825_java
// @version      0.3
// @description  HOJのメニューにログイン中のユーザー名を表示します。
// @author       r1825
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/problems*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/submit*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/state*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/ranking*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/contest*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/manage*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/info*
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381390/HOJ%20Addon%20-%20Username%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/381390/HOJ%20Addon%20-%20Username%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ( document.getElementById("menu").innerHTML.indexOf("ユーザー登録") != -1 ) {
        for ( let i = 0; i < 10; i++ ) {
            document.cookie = "username=;domain=hoj.hamako-ths.ed.jp;max-age=0;path=/";
        }
    }

    if ( location.href == "https://hoj.hamako-ths.ed.jp/onlinejudge/" ) {
        if ( document.body.innerHTML.indexOf("ログアウトしました") != -1 ) {
            document.cookie = "username=;domain=hoj.hamako-ths.ed.jp;max-age=0;path=/";
        }
        if ( document.body.innerHTML.indexOf("ログインしました") != -1 ) {
            let url = "https://hoj.hamako-ths.ed.jp/onlinejudge/users/settings";

            $.ajax({
                url: url,
                dataType: 'html',
                success: function(data) {
                    let login_user = data.match(/<h2 class="content-subhead">.*?<\/h2>/)[0].replace(/<.*?>/g, '');
                    let object = document.getElementsByTagName('li')[1];
                    object.insertAdjacentHTML('beforebegin','<li style="word-break: break-all; color: #bfbfbf; padding: 0px 15px" class="pure-menu-item"><div style="text-align: center">ユーザー名</div>' + login_user + '</li>');
                    document.cookie = "username=;domain=hoj.hamako-ths.ed.jp;max-age=0;path=/";
                    document.cookie = "username=" + encodeURIComponent(login_user) + ";domain=hoj.hamako-ths.ed.jp;max-age=300;path=/";
                }
            });
        }
    }
    else {
        var arr = new Array();
        if(document.cookie != ''){
            var tmp = document.cookie.split('; ');
            for(var i=0;i<tmp.length;i++){
                var data = tmp[i].split('=');
                arr[data[0]] = decodeURIComponent(data[1]);
            }
        }
        if ( document.cookie.indexOf("username") == -1 ) {
            var url = "https://hoj.hamako-ths.ed.jp/onlinejudge/users/settings";

            $.ajax({
                url: url,
                dataType: 'html',
                success: function(data) {
                    var login_user = data.match(/<h2 class="content-subhead">.*?<\/h2>/)[0].replace(/<.*?>/g, '');
                    var object = document.getElementsByTagName('li')[1];
                    object.insertAdjacentHTML('beforebegin','<li style="word-break: break-all; color: #bfbfbf; padding: 0px 15px" class="pure-menu-item"><div style="text-align: center">ユーザー名</div>' + login_user + '</li>');
                    document.cookie = "username=;domain=hoj.hamako-ths.ed.jp;max-age=0;path=/";
                    document.cookie = "username=" + encodeURIComponent(login_user) + ";domain=hoj.hamako-ths.ed.jp;max-age=300;path=/";
                }
            });
        }
        else {
            var object = document.getElementsByTagName('li')[1];
            object.insertAdjacentHTML('beforebegin','<li style="word-break: break-all; color: #bfbfbf; padding: 0px 15px" class="pure-menu-item"><div style="text-align: center">ユーザー名</div>' + arr['username'] + '</li>');
        }
    }

    // Your code here...
})();