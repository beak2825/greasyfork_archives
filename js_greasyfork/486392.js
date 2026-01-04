// ==UserScript==
// @name            徳島大学 統合認証システム 自動ログインスクリプト
// @version         1.1.5
// @license         MIT License
// @description     徳島大学の統合認証システムに自動でログインすることができるスクリプトです。このスクリプトはパスワードを平文で保存します。使用環境のセキュリティには十分に注意してください。
// @match           https://localidp.ait230.tokushima-u.ac.jp/*
// @match           https://gidp.ait230.tokushima-u.ac.jp/*
// @match           https://eweb.stud.tokushima-u.ac.jp/Portal/RichTimeOut.aspx
// @match           https://eweb.stud.tokushima-u.ac.jp/Portal/Login.aspx
// @match           https://eweb.stud.tokushima-u.ac.jp/Portal/ErrorPage.aspx*
// @namespace       https://greasyfork.org/users/1256941
// @downloadURL https://update.greasyfork.org/scripts/486392/%E5%BE%B3%E5%B3%B6%E5%A4%A7%E5%AD%A6%20%E7%B5%B1%E5%90%88%E8%AA%8D%E8%A8%BC%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%20%E8%87%AA%E5%8B%95%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/486392/%E5%BE%B3%E5%B3%B6%E5%A4%A7%E5%AD%A6%20%E7%B5%B1%E5%90%88%E8%AA%8D%E8%A8%BC%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%20%E8%87%AA%E5%8B%95%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

/* このスクリプトはパスワードを平文で保存します。使用環境のセキュリティには十分に注意してください。 */

window.addEventListener('DOMContentLoaded', function() {

	const username = "";	/* このコメントの前のダブルクォーテーション(")の間にcアカウントを入力してください。 */
	const password = "";	/* このコメントの前のダブルクォーテーション(")の間にパスワードを入力してください。 */

	if (location.href == "https://eweb.stud.tokushima-u.ac.jp/Portal/RichTimeOut.aspx" || location.href == "https://eweb.stud.tokushima-u.ac.jp/Portal/Login.aspx" || location.href.indexOf("https://eweb.stud.tokushima-u.ac.jp/Portal/ErrorPage.aspx") > -1) {
		location.href = "https://eweb.stud.tokushima-u.ac.jp/";
	} else {
		if (username != "" && password != "") {
			const elemInputboxUsername = document.getElementById('username');
			const elemInputboxPassword = document.getElementById('password');
			const elemButtonLogin = document.querySelector('button[name="_eventId_proceed"]');

			elemInputboxUsername.value = username;
			elemInputboxPassword.value = password;

			elemButtonLogin.click();
		}
	}
})