// ==UserScript==
// @name         阿里云日志辅助
// @namespace    http://tampermonkey.net/
// @version      v1.0.4
// @description  更方便的使用阿里云日志
// @author       X
// @match        https://sls.console.aliyun.com/lognext/project/*
// @match 		 https://sls.console.aliyun.com/lognext/project/tha-games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/486349/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/486349/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

GM_addStyle(`
        .json-modal {
        	position: fixed;
        	left: 50%;
        	top: 50%;
        	transform: translate(-50%, -50%);
        	background-color: #fff;
        	color: #000;
        	width: 80%;
        	max-width: 800px;
        	height: 70%;
        	max-height: 800px;
        	z-index: 9999;
        	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        	border-radius: 4px;
        	padding: 20px;
        	font-size: 14px;
        }
        
        .close-btn {
        	position: fixed;
        	top: 10px;
        	right: 40px;
        	padding: 5px 10px;
        	font-size: 1.2em;
        	cursor: pointer;
        	border: none;
        	border-radius: 3px;
        	background-color: #333;
        	color: #fff;
        }
		
		.pre-container {
			position:relative;
			overflow-y:auto;
			height:100%;
		}
        
        pre {
        	white-space: pre-wrap;
        	word-wrap: break-word;
			overflow: auto;
        }
		
		.resolve-btn {
		    padding: 6px 10px;
		    margin-right: 10px;
			margin-top: 10px;
		    font-size: 12px;
		    font-weight: bold;
		    color: white;
		    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
		    border: none;
		    border-radius: 20px;
		    cursor: pointer;
		    outline: none;
		    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		    transition: all 0.3s ease;
		}
		
		.resolve-btn-container {
			position:absolute;
			top:10px;
			right:30px;
		}
		
		.resolve-btn:hover {
		    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		    transform: translateY(-2px);
		}
		
		/* 对第二个按钮使用稍微不同的配色方案 */
		.resolve-btn:last-child {
		    background: linear-gradient(to right, #f093fb 0%, #f5576c 100%);
		}
    `)

const titleObserver = new MutationObserver((mutations, obs) => {
	const title = $('[data-testid="titleBox"]').children(':nth-child(2)').text()
	if (title !== "") {
		obs.disconnect(); // 停止观察
	}
});

let beforeContent = ""
const logObserver = new MutationObserver((mutations, obs) => {
	const content = $('.view-line').text()
	if (content !== "" && content !== beforeContent) {
		beforeContent = content
		const btn = $('[data-logsearch-click="logsearch.baseSearch.search_btn"]').parent()
		if (btn.length > 0) {
			btn.off('click')
			btn.click(() => {
				let search = $('.view-line').text()
				if (search !== "") {

					console.log("启动日志具体详情监听")

					const logListObserver = new MutationObserver((mutations, obs) => {
						let logItems = $('[class*="style-m__kv-content"]');
						if (logItems) {
							for (let i = 0; i < logItems.length; i++) {
								let item = logItems[i]
								if ($(item).parent().find(".resolve-btn").length !== 0) {
									continue
								}
								$(item).parent().parent().css("position", "relative")
								$(item).parent().prepend(
									`<div class="resolve-btn-container"><button class="resolve-btn" data-type="1" data-index="` +
									i +
									`">一键美化</button><button class="resolve-btn" data-type="2" data-index="` +
									i +
									`">一键统计</button></div>`)
								// let last = $(item).children('div').last().text()
								// console.log(last)
							}
						}
					});

					logListObserver.observe(document, {
						attributes: true, // 观察属性变动
						childList: true, // 观察子元素的变动
						subtree: true, // 观察后代节点
						characterData: true // 观察文本内容的变动
					})

				}
			})
		}
	}
});


$(document).on('click', '.resolve-btn', function() {
	let index = $(this).attr('data-index')
	let type = $(this).attr('data-type')
	let logItem = $('[class*="style-m__kv-content"]').eq(index);
	let log = logItem.children('div').last().text();
	//console.log(log)

	if (log !== "" && log.indexOf("...展开") !== -1) {
		alert("请先展开日志，再点击解析")
		return
	}

	let re = /\{.*\}/g

	let matches = log.match(re)
	if (!matches || matches.length == 0) {
		alert("解析失败，请核对内容是否为玩家收益日志")
		return
	}

	//console.log(matches[0])
	let parse = JSON.parse(matches[0])

	switch (type) {
		case "1":
			let formatter = JSON.stringify(parse, null, 4);

			let modal = `
									    <div class="json-modal">
										    <div class="pre-container">   
											<button class="close-btn">&times;</button>
											<pre>${formatter}</pre>
										   </div>
									   
									    </div>
									  `;

			$('body').append(modal);

			$('.close-btn').click(function() {
				$(this).parent().parent().remove();
			});
			break
		case "2":
			let moneyLog = parse.Money
			let multiplierStats = moneyLog["倍率统计"]
			let statIndexMap = new Map()

			for (let key in multiplierStats) {
				if (multiplierStats.hasOwnProperty(key)) {

					let typeStats = multiplierStats[key][
						"类型统计"
					]
					for (let statId in typeStats) {
						if (typeStats.hasOwnProperty(
								statId)) {
							console.log(statId, "->",
								typeStats[
									statId])

							let earn = typeStats[statId][
								"玩家收益"
							]
							let cost = typeStats[statId][
								"玩家支出"
							]

							if (statIndexMap.has(statId)) {
								let v = statIndexMap.get(
									statId)
								v.earn += parseFloat(earn)
								v.cost += parseFloat(cost)
								statIndexMap.set(statId, v)
							} else {
								statIndexMap.set(statId, {
									earn: parseFloat(
										earn),
									cost: parseFloat(
										cost)
								})
							}
						}
					}

				}
			}

			let statList = []
			statIndexMap.forEach(function(value, key) {
				let statObj = {}
				statObj["统计项"] = key
				statObj["玩家收入"] = value.earn
				statObj["玩家支出"] = value.cost
				statList.push(statObj)
			});

			let statFormat = JSON.stringify(statList, null,
				4)

			let statModal = `
									    <div class="json-modal">
										    <div class="pre-container">   
											<button class="close-btn">&times;</button>
											<pre>${statFormat}</pre>
										   </div>
									   
									    </div>
									  `;

			$('body').append(statModal);

			$('.close-btn').click(function() {
				$(this).parent().parent().remove();
			});

			break

	}

})

logObserver.observe(document, {
	attributes: true, // 观察属性变动
	childList: true, // 观察子元素的变动
	subtree: true, // 观察后代节点
	characterData: true // 观察文本内容的变动
})

titleObserver.observe(document, {
	attributes: true, // 观察属性变动
	childList: true, // 观察子元素的变动
	subtree: true, // 观察后代节点
	characterData: true // 观察文本内容的变动
})