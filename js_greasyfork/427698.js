// ==UserScript==
// @name         GitHub Actions secrets 自动填写及更新(改)
// @namespace    https://greasyfork.org/zh-CN/scripts/427698
// @version      1.0.3
// @description  基于Aerozb的代码进行了简单地更改 点击按钮触发脚本执行,当脚本未设置env数据或者脚本env与本地不同时 弹窗提示恢复或者覆盖
// @author       lukey
// @match        https://github.com/*/settings/secrets/actions*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/427698/GitHub%20Actions%20secrets%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8F%8A%E6%9B%B4%E6%96%B0%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427698/GitHub%20Actions%20secrets%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8F%8A%E6%9B%B4%E6%96%B0%28%E6%94%B9%29.meta.js
// ==/UserScript==

;(function () {
	'use strict'
	var Subhead = document.getElementsByClassName('Subhead')[0]
	Subhead.style.justifyContent = 'space-between'
	var button = document.createElement('div')
	button.className = 'Subhead-actions btn'
	button.innerText = '自动注入secrets'
	Subhead.appendChild(button)
	var flag = null

	button.onclick = function () {
		star()
	}

	function star() {
		console.clear()
		let env = new Object()
		let suffix = null
		let envKeys = []
		/*
    在此注释以下面添加secrets
    格式： env.机密名 = ‘机密值'，如有多个机密值请使用&符号分开
    ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    //示例:
    //换成自己的助力码即可
    env.DDFACTORY_SHARECODES = 'T0225KkcRU8Y9FaEIh_3wPAKcQCjVWnYaS5kRrbA&T0225KkcRU8Y9FaEIh_3wPAKcQCjVWnYaS5kRrbA&T0225KkcRU8Y9FaEIh_3wPAKcQCjVWnYaS5kRrbA&T0225KkcRU8Y9FaEIh_3wPAKcQCjVWnYaS5kRrbA'
    env.FRUITSHARECODES = '9bfe7b5b330f4af0b1f979fc87fe2944&9bfe7b5b330f4af0b1f979fc87fe2944&9bfe7b5b330f4af0b1f979fc87fe2944&9bfe7b5b330f4af0b1f979fc87fe2944&9bfe7b5b330f4af0b1f979fc87fe2944'
    env.PETSHARECODES = 'MTE1NDAxNzcwMDAwMDAwMzg5NTg4NTk=&MTE1NDAxNzcwMDAwMDAwMzg5NTg4NTk=&MTE1NDAxNzcwMDAwMDAwMzg5NTg4NTk=&MTE1NDAxNzcwMDAwMDAwMzg5NTg4NTk='
    env.PLANT_BEAN_SHARECODES = 'mlrdw3aw26j3wflpva4usauts5ecdk3fted7y5q&mlrdw3aw26j3wflpva4usauts5ecdk3fted7y5q&mlrdw3aw26j3wflpva4usauts5ecdk3fted7y5q&mlrdw3aw26j3wflpva4usauts5ecdk3fted7y5q'
    env.DREAM_FACTORY_SHARE_CODES = 'xE2FHpwP8-NFxEoASj29sw==&xE2FHpwP8-NFxEoASj29sw==&xE2FHpwP8-NFxEoASj29sw==&xE2FHpwP8-NFxEoASj29sw=='
    env.JDJOY_SHARECODES = 'A1c07QOFPcgMt1FYRLhlmKt9zd5YaBeE&A1c07QOFPcgMt1FYRLhlmKt9zd5YaBeE&A1c07QOFPcgMt1FYRLhlmKt9zd5YaBeE&A1c07QOFPcgMt1FYRLhlmKt9zd5YaBeE'
    env.JXNC_SHARECODES = '{"smp":"a591e640e867399f627a8e2b47d6f903","active":"jdnc_1_3yuanganju210601_2","joinnum":1}&{"smp":"a591e640e867399f627a8e2b47d6f903","active":"jdnc_1_3yuanganju210601_2","joinnum":1}&{"smp":"a591e640e867399f627a8e2b47d6f903","active":"jdnc_1_3yuanganju210601_2","joinnum":1}&{"smp":"a591e640e867399f627a8e2b47d6f903","active":"jdnc_1_3yuanganju210601_2","joinnum":1}'
    env.JDSGMH_SHARECODES = 'T0225KkcRU8Y9FaEIh_3wPAKcQCjVQmoaT5kRrbA&T0225KkcRU8Y9FaEIh_3wPAKcQCjVQmoaT5kRrbA&T0225KkcRU8Y9FaEIh_3wPAKcQCjVQmoaT5kRrbA&T0225KkcRU8Y9FaEIh_3wPAKcQCjVQmoaT5kRrbA'
    env.JD_CASH_SHARECODES = 'eU9Yab2zZ_5182vWn3QT0w&eU9Yab2zZ_5182vWn3QT0w&eU9Yab2zZ_5182vWn3QT0w&eU9Yab2zZ_5182vWn3QT0w'
		//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
	 let newObj = Object.keys(env);

		if (localStorage.getItem('env')&&newObj.length==0) {
			if (confirm('本地储存中存在secrets,是否恢复?')) env = JSON.parse(localStorage.getItem('env'))
		} else if (!localStorage.getItem('env')||localStorage.getItem('env')!=JSON.stringify(env)) {
			if (confirm('脚本与本地数据不一致,是否更新到本地nev数据?'))	localStorage.setItem('env', JSON.stringify(env))
		} else {
			GM_notification({text: `当前脚本与本地储存env一致`, title: '不需要同步env', timeout: 3000});
		}
		envKeys = Object.keys(env);
		let keyLen = envKeys.length
		let index = localStorage.getItem('index')
		let url = window.location.href
		let rex = url.lastIndexOf('/')
    suffix = url.substring(rex + 1, url.length)
    
		//通过截取URL斜杠后的字符串，判断当前页，是添加还是修改或者secret页面
   
		//在secret页面才进行失败的secret判断
		if (isSecretPage()) {
			//判断是否有设置失败的secret
			let failedDiv = document.querySelectorAll('div')
			let isDel = true
			for (let i = 0; i < failedDiv.length; i++) {
				if (macth(failedDiv[i].innerHTML, 'Please try again')) {
					isDel = false
					if (localStorage.getItem('resetSecret') == null) {
						localStorage.setItem('resetSecret', envKeys[index - 1])
					}
					break
				}
			}

			//成功设置，则移除resetSecret
			if (isDel) {
				localStorage.removeItem('resetSecret')
			}
		}

		if (index == keyLen) {
			if (confirm('已设置完所有secrets或已设置完新增的secrets，是否从头开始设置')) {
				if (confirm('真的确定从头开始设置？')) {
					index = setIndex(index)
				}
			}
		} else if (!index || index > keyLen) {
			index = setIndex(index)
		}

		//获取设置失败的secret
		let resetSecret = localStorage.getItem('resetSecret')
		if (isSecretPage()) {
			//获取页面secrets
			let keynameList = []
			document.querySelectorAll('code').forEach(e => {
				if (macth(e.className, 'f5')) {
					keynameList.push(e.innerText)
				}
			})

			//是否进入更新页
			let isUpdate = false

			//遍历页面secrets，进行下一步动作
			for (let i = index; i < keyLen; i++) {
				for (let j = 0; j < keynameList.length; j++) {
					//先进入需要重新设置secret的修改页面
					if (resetSecret != null) {
						if (resetSecret == keynameList[j]) {
							window.location.href += '/' + resetSecret
							isUpdate = true
							break
						}
					} else {
						if (envKeys[i] == keynameList[j]) {
							localStorage.setItem('index', i)
							window.location.href += '/' + envKeys[i]
							isUpdate = true
							break
						}
					}
				}
				if (isUpdate) {
					break
				}
				window.location.href += '/new'
				break
			}
		} else if (suffix === 'new') {
			if (resetSecret == null) {
				document.querySelector('#secret_name').value = envKeys[index]
			}
			// 处理设置失败的secret
			else {
				document.querySelector('#secret_name').value = resetSecret
			}
			addOrUpadteValue(true)
		} else {
			addOrUpadteValue(false)
		}

		function addOrUpadteValue(isAdd) {
			//先处理设置失败的secret
			if (resetSecret != null) {
				document.querySelector('#secret_value').value = env[resetSecret]
			} else if (isAdd) {
				document.querySelector('#secret_value').value = env[envKeys[index]]
      } else {
        if(!env[suffix]) return alert('未查询到当前name的值')
				document.querySelector('#secret_value').value = env[suffix]
			}
			localStorage.setItem('index', parseInt(index) + 1)
			let submit = document.querySelector('.form-group > button')
			submit.removeAttribute('disabled')
			submit.click()
		}

		function macth(str, macthStr) {
			return str.indexOf(macthStr) != -1
		}

		function setIndex(index) {
			localStorage.setItem('index', 0)
			index = localStorage.getItem('index')
			return index
		}

		function isSecretPage() {
			return macth(suffix, 'actions')
		}
	}
})()
