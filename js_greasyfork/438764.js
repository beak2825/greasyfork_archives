// ==UserScript==
// @name         哔哩哔哩邮箱验证
// @description  注:
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @iconURL      https://gitee.com/java_cn/BILIBLI_RES/raw/master/PIC/PC_1606377718.gif
// @author       荒年（QQ：2019676120）
// @match        *://passport.bilibili.com/account/mobile/security/managephone/phone/verify*
// @match        *://account.bilibili.com/account/realname/identify*
// @match        *://passport.bilibili.com/register*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @connect      gitee.com
// @grant        GM_addStyle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/438764/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%82%AE%E7%AE%B1%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/438764/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%82%AE%E7%AE%B1%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

GM_addStyle(`

div#sj_uname,div#sj_userpwd {
    line-height: 30px;
    height: 30px;
    background: #00a1d6;
    text-align: center;
	color: #fff;
}

`);

let userpwd = "123456789";
let emil = "https://passport.bilibili.com/register/verifypc.html#/mail?";

window.onload = function() {


	let root_href =
		'<div id="root_href" style="position: absolute; top:20%; z-index:999;";  > <img src="https://gitee.com/java_cn/BILIBLI_RES/raw/master/PIC/PC_1606377718.gif" width="100px" height="100px"></div>';
	let sj_uname = '<div id="sj_uname" >随机名</div>';
	let sj_userpwd = '<div id="sj_userpwd" >固定密码</div>';

	let account = window.location.href.indexOf("account") > -1;
	let register = window.location.href.indexOf("register") > -1;
	let managephone = window.location.href.indexOf("managephone") > -1;
	let realname = window.location.href.indexOf("realname") > -1;


	let href = document.location.href.split('?');
	if (managephone || realname) {
		window.location.href = emil + href[1];
	}
	if (account) {
		$("#root").after(root_href);
		$("#app").after(root_href);
	}

	if (register) {

		$("#registerForm > div:nth-child(1) > div > input").after(sj_uname);
		$("#registerForm > div:nth-child(3) > div > input").after(sj_userpwd);

	}


	$("#sj_uname").bind("click", async function() {


		//getRandomName(randomAccess(2, 5))
		const user_name = await getUser();
		await wait(500);
		$("#registerForm > div:nth-child(1) > div > input").val(user_name);
	});

	$("#sj_userpwd").bind("click", async function() {

		$("#registerForm > div:nth-child(3) > div > input").val(userpwd);

	});



}

// 暂停
const wait = async delay => new Promise(resolve => setTimeout(resolve, delay));

const getUser = async () => {
		const userRes = await $.ajax('https://api.muxiaoguo.cn/api/163reping', {
			type: 'GET'
		});
		if (userRes.code !== "200") {
			return undefined;
		}
		return userRes.data.nickname;
	};
