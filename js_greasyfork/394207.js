// ==UserScript==
// @name 密钥生成器·新
// @namespace https://greasyfork.org/zh-CN/scripts/394207-防撞库密码生成器
// @version 4.9
// @description 给各个网站生成不同的密码,从而防止密码泄露存在的撞库风险
// @icon64 https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @icon https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @author Antecer
// @include *
// @match http://*/*
// @grant GM_addStyle
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/394207/%E5%AF%86%E9%92%A5%E7%94%9F%E6%88%90%E5%99%A8%C2%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394207/%E5%AF%86%E9%92%A5%E7%94%9F%E6%88%90%E5%99%A8%C2%B7%E6%96%B0.meta.js
// ==/UserScript==

/* Update Log
2021年09月01日:添加模拟输入事件,增强兼容性
2022年02月17日:增加user_id的输入识别方式
*/

// 给input标签添加新属性(模拟输入事件)
if (!('inputValue' in HTMLInputElement.prototype)) {
	Object.defineProperties(HTMLInputElement.prototype, {
		inputValue: {
			set: function (valString) {
				this.value = valString;
				this.dispatchEvent(new InputEvent('input', {
					inputType: 'insertText',
					data: valString,
					dataTransfer: null,
					isComposing: false
				}));
			},
			get: function () {
				return this.value;
			}
		}
	});
}
// 创建sleep方法(用于async/await的延时处理)
function Sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
// 提取顶级域名
function GetHost() {
	var ds = location.host.split('.');
	var len = ds.length;
	if (ds[len - 2] == 'com') {
		return ds[len - 3] + '.' + ds[len - 2];
	}
	return ds[len - 2] + '.' + ds[len - 1];
}

// 字符串循环左移
function ShiftLeft(str, n) {
	n = n % str.length;
	return str.substr(n) + str.substr(0, n);
}

// 字符串循环右移
function ShiftRight(str, n) {
	n = str.length - (n % str.length);
	return str.substr(n) + str.substr(0, n);
}

// 密钥生成函数
function Encrypt(SiteHost, UserName, PassCode, ExcludeS, PwLength) {
    // 设置密钥长度(默认16位)
	PwLength = PwLength > 0 ? PwLength : 16;
	// 定义加密备用字符串
	var AsciiList = [];
	for (let i = 33; i < 127; ++i) AsciiList.push(String.fromCharCode(i));
	var AsciiString = AsciiList.join('');
	var DigitList = AsciiString.match(/[0-9]/g);
	var LowerList = AsciiString.match(/[a-z]/g);
	var UpperList = AsciiString.match(/[A-Z]/g);
	var OtherList = AsciiString.match(/[^0-9a-zA-Z]/g); // 预处理字符串使其长度达到要求
	var tmpSiteHost = [];
	var tmpUserName = [];
	var tmpPassCode = [];
	for (let i = 0; i < PwLength; ++i) {
		tmpSiteHost.push(SiteHost);
		tmpUserName.push(UserName);
		tmpPassCode.push(PassCode);
	}
	SiteHost = tmpSiteHost.join('');
	UserName = tmpUserName.join('');
	PassCode = tmpPassCode.join('');
	// 截取需要的字符串
	SiteHost = SiteHost.substr(0, PwLength);
	UserName = UserName.substr(UserName.length - PwLength, PwLength);
	PassCode = ShiftLeft(PassCode, SiteHost[0].charCodeAt()).substr(0, PwLength); // 创建索引序列
	var tmpIndex = [];
	for (let i = 0; i < PwLength; ++i) {
		tmpIndex.push(SiteHost[i].charCodeAt() + UserName[i].charCodeAt() + PassCode[i].charCodeAt());
	}
	// 挑选密钥字符
	var offset = ExcludeS ? 3 : 4;
	var codeBook = [LowerList, UpperList, DigitList, OtherList];
	var encryptList = [];
	for (let i = 0; i < PwLength; ++i) {
		let encryptTable = codeBook[i % offset];
		encryptList.push({
			index: tmpIndex[i],
			encrypt: encryptTable[tmpIndex[i] % encryptTable.length]
		});
	}
	// 对密钥字符排序(使其看起来混乱一些)
	encryptList.sort(function (a, b) {
		if (a.index === b.index) {
			return a.encrypt.charCodeAt() - b.encrypt.charCodeAt();
		}
		return a.index - b.index;
	});
	return encryptList.map((item) => item.encrypt).join('');
}

// 定义剪贴板函数
window.Clipboard = (function (window, document, navigator) {
	var textArea, copy;

	// 判断是不是ios端
	function isOS() {
		return navigator.userAgent.match(/ipad|iphone/i);
	}
	//创建文本元素
	function createTextArea(text) {
		textArea = document.createElement('textArea');
		textArea.value = text;
		document.body.appendChild(textArea);
	}
	//选择内容
	function selectText() {
		var range, selection;

		if (isOS()) {
			range = document.createRange();
			range.selectNodeContents(textArea);
			selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
			textArea.setSelectionRange(0, 999999);
		} else {
			textArea.select();
		}
	}

	//复制到剪贴板
	function copyToClipboard() {
		try {
			if (document.execCommand('Copy')) {
				//alert("复制成功！");
			} else {
				alert('复制失败！请手动复制！');
			}
		} catch (err) {
			alert('复制错误！请手动复制！');
		}
		document.body.removeChild(textArea);
	}

	copy = function (text) {
		createTextArea(text);
		selectText();
		copyToClipboard();
	};

	return {
		copy: copy
	};
})(window, document, navigator);

const EncryptPanelCSS = `
				.encryptPanel {
					position: fixed;
					right: 30px;
					top: 40px;
					min-width: 16em;
					z-index: 88888;
					background: #fffa !important;
					color: #000 !important;
					outline: 1px #0009 solid !important;
				}
				.encryptPanel > div {
					margin: 10px;
					flex-flow: column;
				}
				.encryptPanel > div div:not([class]) {
					display: flex;
					flex: 1;
				}
				.encryptPanel > div > div * {
					margin: 1px 0px;
					align-items: center;
				}
				.encryptPanel select {
					height: 21px;
                    background: initial !important;
                    padding: initial !important;
				}
				.encryptPanel input {
					height: 21px;
                    padding: 0px !important;
					flex: 1;
					background: transparent;
					border: 1px #0005 solid !important;
					outline: none;
                    font-weight: initial !important;
                    text-transform: initial !important;
                    border-radius: initial !important;
                    color: initial !important;
                    background: initial !important;
				}
				.encryptPanel [type='button']:hover {
					cursor: pointer;
					background: #0ff2 !important;
				}
				.encryptPanel [type='checkbox'] {
					flex: 0;
				}
				.encryptPanel .title {
					align-self: center;
                    margin: 0px;
				}
				.getUser {
					display: flex;
					flex-flow: column;
				}
				.getUser select {
					flex: 1;
				}
				.setUser {
					display: none;
					flex-flow: column;
				}
				.setCode,
				.getCode {
					display: flex;
					flex-flow: column;
				}
				.setUser > div {
					display: flex;
				}
				.cfgPanel {
					display: none;
				}
				.webPanel {
					display: none;
				}
				.keyPanel {
					display: none;
				}
`;
GM_addStyle(EncryptPanelCSS);
const EncryptPanelHTML = `
			<div class="encryptPanel">
				<div class="cfgPanel">
					<div class="title"><b>密钥生成器 - 脚本配置</b></div>
					<div class="getUser">
						<div>
							当前用户:
							<select>
								{{userlist}}
							</select>
						</div>
						<input type="button" value="添加或修改用户" />
					</div>
					<div class="setUser">
						<div>用户:<input name="user" type="text" /></div>
						<div>邮箱:<input name="mail" type="text" /></div>
						<div>密钥:<input name="code" type="text" /></div>
					</div>
					<div>
						<input type="button" value="保存" />
						&nbsp;
						<input type="button" value="取消" />
					</div>
				</div>

				<div class="webPanel">
					<div class="title"><b>密钥生成器 - 网站配置</b></div>
					<div class="setCode">
						<div>自设账户:<input name="username" type="text" /></div>
						<div>自设密码:<input name="password" type="text" /></div>
						<div>密码长度:<input name="pwlength" type="number" /></div>
						<div>排除符号:<input name="nosymbol" type="checkbox" /></div>
					</div>
					<div>
						<input type="button" value="保存" />
						&nbsp;
						<input type="button" value="取消" />
					</div>
				</div>

				<div class="keyPanel">
					<div class="title"><b>密钥生成器 - 当前网站</b></div>
					<div class="getCode">
						<div>账户:<input alt="username" type="button" title="点击复制账户"/></div>
						<div>密码:<input alt="password" type="button" title="点击复制密钥并隐藏面板"/></div>
					</div>
				</div>
			</div>
`;
const EncryptPanel = document.createElement('div');
EncryptPanel.innerHTML = EncryptPanelHTML;
document.body.appendChild(EncryptPanel);
EncryptPanel.style.display = 'none';
/*隐藏面板*/
function hideEncryptPanel(thisPanel) {
	document.querySelector(thisPanel).style.display = 'none';
	let cfgShow = document.querySelector('.cfgPanel').offsetWidth;
	let webShow = document.querySelector('.webPanel').offsetWidth;
	let keyShow = document.querySelector('.keyPanel').offsetWidth;
	if (cfgShow + webShow + keyShow == 0) EncryptPanel.style.display = 'none';
}
/*脚本配置*/
function showCfgPanle() {
	document.querySelector('.getUser').style.display = 'none';
	document.querySelector('.setUser').style.display = 'none';
	let getUser = GM_getValue('inituser', false);
	if (getUser) {
		document.querySelector('.getUser').style.display = 'flex';
		let userlist = document.querySelector('.cfgPanel select');
		GM_listValues().forEach((item) => {
			if (item != 'inituser') {
				let userval = document.createElement('option');
				userval.text = item;
				if (getUser == item) userval.setAttribute('selected', 'selected');
				userlist.add(userval, null);
			}
		});
	} else {
		document.querySelector('.setUser').style.display = 'flex';
	}
	document.querySelector('.cfgPanel').style.display = 'flex';
	EncryptPanel.style.display = 'block';
}
document.querySelector('.cfgPanel [value="添加或修改用户"]').addEventListener('click', () => {
	document.querySelector('.getUser').style.display = 'none';
	document.querySelector('.setUser').style.display = 'flex';
});
document.querySelector('.cfgPanel [value="保存"]').addEventListener('click', () => {
	if (document.querySelector('.cfgPanel>.getUser').style.display == 'flex') {
		let user = document.querySelector('.cfgPanel [selected]').text;
		if (user) GM_setValue('inituser', user);
	} else if (document.querySelector('.cfgPanel>.setUser').style.display == 'flex') {
		let user = document.querySelector('.cfgPanel [name="user"]').value;
		let mail = document.querySelector('.cfgPanel [name="mail"]').value;
		let code = document.querySelector('.cfgPanel [name="code"]').value;
		if (user.trim() && mail.trim() && code.trim()) {
			let setUser = GM_getValue(user, {});
			setUser.user = user;
			setUser.mail = mail;
			setUser.code = code;
			GM_setValue(user, setUser);
			GM_setValue('inituser', user);
		} else {
			alert('请补全表格信息!');
			return;
		}
	}
	if (document.querySelector('.webPanel').offsetWidth > 0) showWebPanel();
	if (document.querySelector('.keyPanel').offsetWidth > 0) showKeyPanel();
	hideEncryptPanel('.cfgPanel');
});
document.querySelector('.cfgPanel [value="取消"]').addEventListener('click', () => {
	hideEncryptPanel('.cfgPanel');
});
/*网站配置*/
function showWebPanel() {
	let getUser = GM_getValue('inituser', false);
	if (getUser) {
		let siteCfg = GM_getValue(getUser)[GetHost()];
		if (siteCfg) {
			document.querySelector('.webPanel [name="username"]').value = siteCfg.username || '';
			document.querySelector('.webPanel [name="password"]').value = siteCfg.password || '';
			document.querySelector('.webPanel [name="pwlength"]').value = siteCfg.pwlength || 0;
			document.querySelector('.webPanel [name="nosymbol"]').checked = siteCfg.nosymbol || false;
		}
	}
	document.querySelector('.webPanel').style.display = 'flex';
	EncryptPanel.style.display = 'block';
}
document.querySelector('.webPanel [value="保存"]').addEventListener('click', () => {
	let username = document.querySelector('.webPanel [name="username"]').value;
	let password = document.querySelector('.webPanel [name="password"]').value;
	let pwlength = document.querySelector('.webPanel [name="pwlength"]').value;
	let nosymbol = document.querySelector('.webPanel [name="nosymbol"]').checked;
	let siteCfg = {};
	if (username) siteCfg.username = username;
	if (password) siteCfg.password = password;
	if (pwlength) siteCfg.pwlength = pwlength;
	if (nosymbol) siteCfg.nosymbol = nosymbol;
	let getUser = GM_getValue('inituser');
	let userCfg = GM_getValue(getUser);
	userCfg[GetHost()] = siteCfg;
	GM_setValue(getUser, userCfg);
	if (document.querySelector('.keyPanel').offsetWidth > 0) showKeyPanel();
	hideEncryptPanel('.webPanel');
});
document.querySelector('.webPanel [value="取消"]').addEventListener('click', () => {
	hideEncryptPanel('.webPanel');
});
/*密码生成*/
function showKeyPanel() {
	let getUser = GM_getValue('inituser', false);
	if (getUser) {
		let userCfg = GM_getValue(getUser);
		let mail = userCfg.mail;
		let code = userCfg.code;
		let siteHost = GetHost();
		let siteCfg = GM_getValue(getUser)[siteHost] || {};
		let username = siteCfg.username || mail;
		let password = siteCfg.password || '';
		let pwlength = siteCfg.pwlength || 0;
		let nosymbol = siteCfg.nosymbol || false;
		if (password.length == 0) {
			password = Encrypt(siteHost, username, code, nosymbol, pwlength);
		}
		document.querySelector('.keyPanel [alt="username"]').value = username;
		document.querySelector('.keyPanel [alt="password"]').value = password;
	}
	document.querySelector('.keyPanel').style.display = 'flex';
	EncryptPanel.style.display = 'block';
}
document.querySelector('.keyPanel [alt="username"]').addEventListener('click', () => {
	window.Clipboard.copy(document.querySelector('.keyPanel [alt="username"]').value);
});
document.querySelector('.keyPanel [alt="password"]').addEventListener('click', () => {
	window.Clipboard.copy(document.querySelector('.keyPanel [alt="password"]').value);
	hideEncryptPanel('.keyPanel');
});
// 插件菜单
(() => {
	GM_registerMenuCommand(`设定插件配置`, () => {
		showCfgPanle();
	});

	GM_registerMenuCommand(`设定当前网站`, () => {
		if (!GM_getValue('inituser')) {
			alert('请先创建默认用户,再修改网站配置!');
			return;
		}
		showWebPanel();
	});

	GM_registerMenuCommand(`生成登录密码`, () => {
		if (!GM_getValue('inituser')) {
			alert('请先创建默认用户,才能生成密码!');
			return;
		}
		showKeyPanel();
	});
})();

// 自动显示密码(仅尝试10次)
(async () => {
	for (let i = 0; i < 10; ++i) {
		await Sleep(1000);
		let inputUsername = document.querySelector('input[placeholder*=用户名],input[placeholder*=邮箱],input[name=username],input[id^=user_],input[id=Email]');
		let inputPassword = document.querySelector('input[type=password]');
		if ((inputPassword && inputPassword.offsetParent) || (inputUsername && inputUsername.offsetParent)) {
			// 显示密码面板
			if (GM_getValue('inituser')) showKeyPanel();
			// 尝试自动填充用户名
			if (inputUsername && inputUsername.value == '') {
				inputUsername.inputValue = document.querySelector('.keyPanel [alt=username]').value;
			}
			// 尝试自动填充密码
			if (inputPassword && inputPassword.value == '') {
				inputPassword.inputValue = document.querySelector('.keyPanel [alt=password]').value;
			}

            // 顺丰国际,尝试自动处理滑动验证(非正常处理模式)
            if (window.location.href.match(`^https*://icas.sf.global`)) {
                document.querySelector('.login button').click();
                while(!document.querySelector('.login .el-slider__button')) await Sleep(1000);
                document.querySelector('.login .el-slider__button').click();
            }
			break;
		}
	}
})();

if (location.href.match('https://item.taobao.com/item.htm')){
    GM_addStyle(`.baxia-dialog{z-index:999999999 !important;}`)
}