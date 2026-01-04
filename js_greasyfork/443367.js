// ==UserScript==
// @name         AutoCompleteForm
// @namespace    http://tampermonkey.net/
// @version      0.14.12
// @description  AScript!
// @author       You
// @match        https://docs.google.com/forms/*
// @match        https://app.poap.xyz/*
// @match        https://gleam.io/*
// @match        https://discord.com/invite/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443367/AutoCompleteForm.user.js
// @updateURL https://update.greasyfork.org/scripts/443367/AutoCompleteForm.meta.js
// ==/UserScript==

function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms));
}

function createBtn(name, text, top) {
	var btn = document.createElement('button');
	btn.innerText = name;
	btn.style.position = 'fixed';
	btn.style.top = `${top}px`;
	btn.style.left = `20%`;
	btn.style.width = '80px'
	btn.style.height = '45px'
	btn.addEventListener('click', () => {
		// 创建输入框
		var textarea = document.createElement('textarea');
		document.body.appendChild(textarea);
		// 隐藏此输入框
		textarea.style.position = 'absolute';
		textarea.style.clip = 'rect(0 0 0 0)';
		// 赋值
		textarea.value = text;
		// 选中
		textarea.select();
		// 复制
		document.execCommand('copy', true);
		console.log(`copy ${name}: ${text} success`)
	});
	return btn;

}


const insertBtns = (accountData) => {
	if (!accountData) {
		return
	}
	const btnSpace = 65
	console.log('currentAddress', accountData.eth)
	let btnIndex = 1
	const emailBtn = createBtn("Email", accountData.email, btnIndex * btnSpace + 20);
	btnIndex++
	const discordBtn = createBtn("Discord", accountData.discord, btnIndex * btnSpace + 20);
	btnIndex++
	const ethBtn = createBtn("ETH", accountData.eth, btnIndex * btnSpace + 20);
	btnIndex++
	const solBtn = createBtn("SOL", accountData.sol, btnIndex * btnSpace + 20);
	btnIndex++
	const twitterBtn = createBtn("Twitter", accountData.twitter, btnIndex * btnSpace + 20);
	btnIndex++
	const twitterProfileBtn = createBtn("TwitterLink", accountData.twitterProfile, btnIndex * btnSpace + 20);
	btnIndex++
	var wrapper = document.body;
	wrapper.appendChild(emailBtn);
	wrapper.appendChild(discordBtn);
	wrapper.appendChild(discordBtn);
	wrapper.appendChild(ethBtn);
	wrapper.appendChild(solBtn);
	wrapper.appendChild(twitterBtn);
	wrapper.appendChild(twitterProfileBtn);
}

const answerSnatTest01 = () => {
	if (document.title != '响指测验卷-01') {
		return
	}
	console.log("start answer snat test 01....")
	const spans = document.getElementsByClassName("aDTYNe snByac")
	for (let spanItem of spans) {
		const text = spanItem.textContent
		console.log('text', text)
		if (!text || !text.length) {
			continue
		}

		if (
			text.indexOf("The end of Feb—Gift for Meta Cowboy") != -1 ||
			text.indexOf("股份授权证明机制") != -1 ||
			text.indexOf("Eat to Earn") != -1 ||
			text.indexOf("4个") != -1 ||
			text.indexOf("跟管理员撒娇") != -1 ||
			text.indexOf("加入未成年人防沉迷系统") != -1 ||
			text.indexOf("绑定金系统") != -1 ||
			text.indexOf("陈奕迅") != -1 ||
			text.indexOf("用于激励生态") != -1 ||
			text.indexOf("生态使用参与凭证") != -1 ||
			text.indexOf("进行交易兑换") != -1 ||
			text.indexOf("参与治理凭证") != -1 ||
			text.indexOf("参与治理凭证") != -1 ||
			text.indexOf("Volmex") != -1 ||
			text.indexOf("Lv8 身份的用户") != -1 ||
			text.indexOf("SubDAO") != -1 ||
			text.indexOf("StarSharks") != -1 ||
			text.indexOf("Good Luck Games") != -1 ||
			text.indexOf("10") != -1
		) {
			spanItem.click()
			continue
		}
	}
	console.log("answer snat test 01 done")
}


const answerCryptoKudasaiJP = () => {
	if (document.title.indexOf("CryptoKudasaiJP") == -1) {
		return
	}
	console.log("start answer CryptoKudasaiJP....")
	const spans = document.getElementsByClassName("aDTYNe snByac")
	for (let spanItem of spans) {
		const text = spanItem.textContent
		console.log('text', text)
		if (!text || !text.length) {
			continue
		}

		if (
			text.indexOf("はい") != -1
		) {
			spanItem.click()
			continue
		}
	}
	console.log("answer snat test 01 done")
}

const answerMoleHack = () => {
	if (document.title.indexOf('MoleHack: NFT 2.0 Finale Quiz') == -1) {
		return
	}
	console.log("start answer MoleHack....")
	const spans = document.getElementsByClassName("aDTYNe snByac")
	for (let spanItem of spans) {
		const text = spanItem.textContent
		console.log('text', text)
		if (!text || !text.length) {
			continue
		}

		if (
			text.indexOf("NFT 2.0") != -1 ||
			text.indexOf("Project Galaxy") != -1
		) {
			spanItem.click()
			continue
		}
	}
	console.log("answer snat test 01 done")
}

const handleGleamEntry = async (entry, accountData) => {
	const innerText = entry.innerHTML.toLowerCase()
	const continuBtn = entry.querySelector("button")
	console.log('continuBtn', continuBtn)
	if (continuBtn) {
		continuBtn.click()
		await sleep(5000)
		return
	}

	const textareaItem = entry.querySelector("textarea")
	if (!textareaItem) {
		console.log('no textarea')
		return
	}
	textareaItem.focus()
	if (
		innerText.indexOf("address") != -1 ||
		innerText.indexOf("wallet") != -1 ||
		innerText.indexOf("polygon") != -1 ||
		innerText.indexOf("ethereum") != -1 ||
		innerText.indexOf("bsc") != -1
	) {
		document.execCommand('insertText', false, accountData.eth);
	} else if (innerText.indexOf("discord") != -1) {
		document.execCommand('insertText', false, accountData.discord);
	} else if (innerText.indexOf("speakers were featured") != -1) {
		document.execCommand('insertText', false, "8");
	} else if (innerText.indexOf("twitter") != -1) {
		document.execCommand('insertText', false, `@${accountData.twitter}`);
	} else if (innerText.indexOf("color of the hat") != -1) {
		document.execCommand('insertText', false, "blue");
	} else {
		document.execCommand('insertText', false, accountData.email);
	}

	await sleep(2000)
	const continueBtns = entry.getElementsByClassName("btn btn-primary")
	if (continueBtns && continueBtns.length) {
		continueBtns[0].click()
		await sleep(2000)
	}
}

class ActionPromise {
	constructor(_id, _timeout) {
		this.id = _id
		this.timeout = _timeout || 10000
		console.log(`new actionPromise id ${this.id}, timeout ${this.timeout}`)
		let entryResolve
		const entryPromise = new Promise((resolve, reject) => {
			entryResolve = resolve
		})
		const entryWaitfunc = async () => {
			return entryPromise
		}
		this.entryResolve = entryResolve
		this.entryPromise = entryPromise
		this.entryWaitfunc = entryWaitfunc
	}
	async wait() {
		let catchThis = this
		setTimeout(() => {
			if (catchThis.done) {
				return
			}
			console.log(`action ${catchThis.id} timeout`)
			catchThis.done = true
			catchThis.entryResolve()
		}, this.timeout)
		await this.entryWaitfunc()
	}
	resolve() {
		this.done = true
		this.entryResolve()
	}

}

const preFillWallet = async (accountData) => {
	if (!accountData) {
		return
	}
	const inputWraps = document.getElementsByClassName("input boolean form-group additional-checkbox")
	if (!inputWraps || !inputWraps.length) {
		console.log('no inputWraps')
		return
	}
	for (let item of inputWraps) {
		const inputItem = item.querySelector("input")
		console.log("click input", inputItem)
		inputItem.click()
	}

	const walletInputs = document.getElementsByName("bep20_wallet_address")
	if (!walletInputs || !walletInputs.length) {
		return
	}
	console.log('walletInputs', walletInputs[0], accountData.eth)
	await sleep(6000)
	walletInputs[0].focus()

	document.execCommand('insertText', false, accountData.eth);

}

const autoClickGleam = async (accountData) => {
	if (!accountData) {
		return
	}
	const localUrl = window.document.location.href
	if (!localUrl || localUrl.indexOf("gleam.io") == -1) {
		return
	}
	if (document.body.innerHTML.indexOf("agree to the following") != -1) {
		console.log("pre fill wallet")
		await preFillWallet(accountData)
		await sleep(15000)
	}
	console.log('gleam loading start')
	const entryList = document.getElementsByClassName("entry-method")
	console.log('all entry count', entryList.length)
	if (!entryList || !entryList.length) {
		return
	}
	let waitGroup = {}
	for (let entry of entryList) {

		waitGroup[entry.id] = new ActionPromise(entry.id, 5000)
		console.log("add entry wait group", entry.id)
		var observer = new MutationObserver(async function (mutations) {
			for (let mutation of mutations) {

				const className = mutation.target.className
				console.log('entry class onChange', className, mutation.target.id, mutation)
				if (className.indexOf("completed-entry-method") != -1) {
					const ap = waitGroup[entry.id]
					if (!ap.done) {
						ap.resolve()
					}
					return
				}

				if (className.indexOf("expanded") == -1) {
					console.log("no expanded")
					return
				}

				await handleGleamEntry(mutation.target, accountData)
			}
		});

		observer.observe(entry, {
			attributes: true,
			attributeFilter: ['class']
		});
	}

	console.log('gleam add watch done')
	for (let i = 0; i < entryList.length; i++) {
		const entry = entryList[i]
		const children = entry.children
		if (!children || !children.length) {
			continue
		}
		console.log(`entry ${i}, class ${entry.className}`)

		if (entry.className.indexOf("completed-entry-method") != -1) {
			console.log("completed entry", entry.className)
			continue
		}

		if (entry.className.indexOf("expanded") != -1) {
			console.log("expanded entry", i)
			await handleGleamEntry(entry, accountData)
			await sleep(10000)
			continue
		}

	}
	for (let i = 0; i < entryList.length; i++) {
		const entry = entryList[i]
		const children = entry.children
		if (!children || !children.length) {
			continue
		}
		if (entry.className.indexOf("completed-entry-method") != -1) {
			console.log("completed entry", i, entry.className)
			continue
		}

		if (entry.className.indexOf("expanded") != -1) {
			console.log("expanded entry second loop", i)
			// await handleGleamEntry(entry, accountData)
			continue
		}
		const innerText = entry.innerHTML.toLowerCase()
		if (innerText.indexOf("extra entries") != -1) {
			console.log("extra entries")
			continue
		}
		if (innerText.indexOf("secret code") != -1) {
			console.log("skip secret code now")
			continue
		}
		console.log(`click entry ${i}, ${entry.id}`)
		children[0].click()
		console.log("waiting...")
		await waitGroup[entry.id].wait()
		console.log("waiting... done")

	}
}

const acceptDiscord = () => {
	const localUrl = window.document.location.href
	if (!localUrl || (localUrl.indexOf("discord.com/invite/") == -1
		&& localUrl.indexOf("discord.gg/") == -1)) {
		console.log('it is not a discord invite link')
		return
	}
	const btn = document.querySelector("button")
	if (!btn) {
		console.log('discord invite link has no button')
		return
	}
	btn.click()

	let catchWin = window

	setTimeout(() => {
		if (catchWin.document.body.innerHTML.indexOf("Continue to Discord") != -1) {
			catchWin.location.href = "https://google.com"
		}


	}, 5000)
}


(function () {
	'use strict';

	if (window.location.href.indexOf("google") != -1 && window.location.href.indexOf("formResponse") != -1) {
		console.log("google response form")
		return
	}

	let windowLoaded = false
	let checkTimeout = 5 * 1000
	const checkWindowLoadingTimeoutFunc = async () => {
		console.log('check window timeout...')
		await sleep(checkTimeout)
		console.log('check  window timeout...++++')
		if (!windowLoaded) {
			window.location.reload()
		}
	}
	checkWindowLoadingTimeoutFunc()
	window.onload = async () => {
		windowLoaded = true
		console.log('loading')
		await sleep(2000)
		let account = undefined

		if (window.localStorage) {
			account = JSON.parse(window.localStorage.getItem("monkey_accountData"))
		}
		console.log('current account', account && account.eth)
		insertBtns(account)
		// answer questions
		answerSnatTest01()
		// answer molehack
		answerMoleHack()
		answerCryptoKudasaiJP()
		// click gleam
		autoClickGleam(account)

		acceptDiscord()

		const listWraper = document.getElementsByClassName("o3Dpx")[0]
		if (!listWraper) {
			return
		}
		const list = listWraper.children
		console.log(`list item len ${list.length}`)
		if (!list || !list.length) {
			return
		}
		for (let question of list) {
			const text = question.innerHTML.toLowerCase()
			let inputs = question.querySelectorAll("input")
			console.log('text', text.length, inputs, inputs.length)
			if (!inputs || inputs.length != 1) {
				inputs = question.querySelectorAll("textarea")
				if (!inputs || inputs.length != 1) {
					console.log('wrong inputs', inputs)
					continue
				}
			}
			const field = inputs[0]
			if (text.indexOf("email") != -1 || text.indexOf("邮件") != -1) {
				field.focus()
				document.execCommand('insertText', false, account.email);
				continue
			}


			if (text.indexOf('solana address') != -1) {
				field.focus()
				document.execCommand('insertText', false, account.sol);
				continue
			}

			if (text.indexOf("wallet") != -1 || text.indexOf("address") != -1 || text.indexOf("钱包") != -1) {
				field.focus()
				document.execCommand('insertText', false, account.eth);
				continue
			}

			if (text.indexOf("link") != -1 || text.indexOf("retweet") != -1) {
				if (text.indexOf("username") != -1) {
					field.focus()
					document.execCommand('insertText', false, `@${account.twitter}`);
					continue
				}
				field.focus()
				document.execCommand('insertText', false, account.twitterProfile);
				continue
			}

			if (text.indexOf("telegram") != -1 || text.indexOf("twitter") != -1 || text.indexOf("推特") != -1 || text.indexOf("nickname") != -1) {
				field.focus()
				document.execCommand('insertText', false, `@${account.twitter}`);
				continue
			}

			if (text.indexOf("discord") != -1) {
				field.focus()
				document.execCommand('insertText', false, account.discord);
				continue
			}
			if (text.indexOf("ideas") != -1 || text.indexOf("感想") != -1) {
				field.focus()
				document.execCommand('insertText', false, 'no');
				continue
			}


		}
	}
})();