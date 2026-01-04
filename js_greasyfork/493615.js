// ==UserScript==
// @name         HWClient
// @namespace    HWClient
// @version      2024-05-01
// @description  Мини клиент без интерфейса для игры hero-wars 
// @author       ZingerY
// @match        https://www.hero-wars.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hero-wars.com
// @grant        none
// @homepage     https://zingery.ru/scripts/HWClient.user.js
// @downloadURL https://update.greasyfork.org/scripts/493615/HWClient.user.js
// @updateURL https://update.greasyfork.org/scripts/493615/HWClient.meta.js
// ==/UserScript==

(function() {
	class HWClient {
		headers = {
			"X-Request-Id": 1,
			"X-Auth-Token": '',
			"X-Auth-Session-Id": '',
			"X-Env-Unique-Session-Id": '',
			"X-Auth-Session-Key": '',
			"X-Env-Library-Version": 1,
		}

		constructor(login, password) {
			this.login = login;
			this.password = password;
		}

		getToken() {
			return decodeURIComponent(Object.fromEntries(document.cookie.split(';').map(e => e.split('=').map(n => n.trim())))['XSRF-TOKEN']);
		}

		getSesstionId() {
			return ('000000' + (~~(2147483647 * Math.random())).toString(36)).slice(-7) + ('000000' + (Math.floor(Date.now() / 1E3) & 2147483647).toString(36)).slice(-7);
		}

		async logout() {
			return await fetch('https://www.hero-wars.com/logout', {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
					"X-Xsrf-Token": this.getToken()
				},
				body: '{}',
			});
		}

		async auth() {
			const result = await fetch('https://www.hero-wars.com/login', {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
					"X-Xsrf-Token": this.getToken()
				},
				body: JSON.stringify({ email: this.login, password: this.password, remember: 1 }),
			});
			if (result.status == 204) {
				const mainPage = await fetch('https://www.hero-wars.com/').then(e => e.text());
				const dom = new DOMParser().parseFromString(mainPage, 'text/html');
				eval(dom.querySelector('script').innerText)
				this.headers["X-Auth-Token"] = NXFlashVars.auth_key;
				this.headers["X-Auth-Session-Id"] = this.getSesstionId();
				this.headers["X-Env-Unique-Session-Id"] = NXAppInfo.visiting_uid;
				this.headers["X-Auth-Application-Id"] = NXPushDSettings.app_id;
				this.headers["X-Auth-Network-Ident"] = NXUserInfo.platform;
				this.headers["X-Auth-User-Id"] = NXUserInfo.platform_id;
				this.apiUrl = NXFlashVars.rpc_url;
				this.sessionId = NXAppInfo?.session_id || null;
				return true;
			}
			return false;
		}

		async send(body) {
			if (typeof body == 'string') {
				body = JSON.parse(body);
			}
			for (const call of body.calls) {
				if (!call?.context?.actionTs) {
					call.context = {
						actionTs: Math.floor(performance.now())
					}
				}
			}
			body = JSON.stringify(body);

			const headers = {
				"Content-Type": "application/json; charset=UTF-8",
				...this.headers
			}

			if (this.headers["X-Request-Id"] == 1) {
				headers["X-Auth-Session-Init"] = 1;
			}

			headers["X-Auth-Signature"] = getSignature(headers, body);
			const result = await fetch(this.apiUrl, {
				method: "POST",
				headers,
				body,
			}).then(e => e.json())
			this.headers["X-Request-Id"]++;

			if (result.error) {
				return result.error;
			}

			return result.results;
		}

		async registration(giftId = null) {
			const body = {
				calls: [{
					name: "registration",
					args: {
						user: { referrer: {} },
						giftId
					},
					context: {
						actionTs: Math.floor(performance.now()),
						cookie: this.sessionId
					},
					ident: 'body'
				}]
			};
			return await this.send(body);
		}

		async getUserInfo() {
			const result = await this.send({ calls: [{ name: "userGetInfo", args: {}, ident: "body" }] });
			return result[0].result.response;
		}
	}
	this.HWClient = HWClient;

	/**
	 * Собрать подарки на переданных аккаунтах
	 * @param {*} keys
		[
			{ pass: 'pass1', login: 'login1' },
			{ pass: 'pass2', login: 'login3' },
			{ pass: 'pass4', login: 'login5' },
		]
	* @param {*} gifts
		[
			'a97a03998d590a957eb5627f0dd38b36',
		]
	*/
	this.getGiftAllKeys = async function(keys = [], gifts = []) {
		for (const key of keys) {
			console.log(key.login)
			const client = new HWClient(key.login, key.pass);
			await client.logout();
			if (await client.auth()) {
				//console.log(await client.getUserInfo());
				for (const gift of gifts) {
					await client.registration(gift);
				}
			} else {
				console.error('Что-то пошло не так')
			}
			const delay = Math.random() * 5000;
			await new Promise((e) => setTimeout(e, delay));
		}
	}
})();