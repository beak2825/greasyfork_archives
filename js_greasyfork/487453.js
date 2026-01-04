// ==UserScript==
// @name 椰子接码的辅助脚本
// @namespace http://h5.yezi66.net
// @version 0.0.1
// @description 椰子接码搜索页面是乱序的,需要添加一个金额升序功能
// @author woaiduling2
// @match http://h5.yezi66.net:90/invite/*/*
// @match http://h5.yezi66.net:90/#/*
// @license MIT
// @grant GM_log
// @grant GM_xmlhttpRequest
// @connect *
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487453/%E6%A4%B0%E5%AD%90%E6%8E%A5%E7%A0%81%E7%9A%84%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487453/%E6%A4%B0%E5%AD%90%E6%8E%A5%E7%A0%81%E7%9A%84%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {

	//定时检查是否要生成按钮
	setInterval(() => {
		//只处理search页面
		let url = unsafeWindow.location.href;
		if (false === url.endsWith("searchEx")) {
			// GM_log(`false === url.endsWith("searchEx")`);
			return;
		}
		let whichVanList = 0;
		let vanList = document.getElementsByClassName("van-list")[whichVanList];
		//找不到 vancard 说明没有到要操作的页面
		if (0 >= vanList.length) {
			// GM_log(`0>vanList.length`);
			return;
		}
		let vanCards = vanList.querySelectorAll("div.van-card");
		if (0 >= vanCards.length) {
			// GM_log(`0>vanCards.length`);
			return;
		}
		// GM_log(`match the pages`);
		let sortBtn = document.getElementsByClassName("sortBtn");
		if (0 < sortBtn.length) {
			// GM_log(`0<sortBtn.length`);

			return;
		}
		// GM_log(`0>=sortBtn.length`);
		let searchBtnDiv = document.getElementsByClassName('van-search__action')[0];
		let newInsertElement = document.createElement(`button`);
		newInsertElement.className = "sortBtn";
		newInsertElement.innerText = `排序`;
		newInsertElement.style.fontSize = `14px`;
		newInsertElement.onclick = main; //狗屎一样的排版
		searchBtnDiv.parentElement.insertBefore(newInsertElement, searchBtnDiv);
	}, 1000);

	function HtmlGen(title, description, cardType, address, priceInt, priceDecimal, action) {
		return `
<div class="van-card">
	<div class="van-card__header">
		<div class="van-card__content">
			<div>
				<div class="van-card__title van-multi-ellipsis--l2">${title}</div>
				<div class="van-card__desc van-ellipsis">${description}</div>
				<span class="van-tag van-tag--success">${cardType}</span>
				<span class="van-tag van-tag--plain van-tag--danger">${address}</span>
			</div>
			<div class="van-card__bottom">
				<div class="van-card__price">
					<div>
						<span class="van-card__price-currency">¥</span>
						<span class="van-card__price-integer">${priceInt}</span>.<span class="van-card__price-decimal">${priceDecimal}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="van-card__footer">
		<button class="van-button van-button--info van-button--mini">
			<div class="van-button__content">
				<span class="van-button__text">${action}</span>
			</div>
		</button>
	</div>
</div>
`;
	}

	function GetPublic2Deal(aJsonObj) {
		let re = '';
		JSON.parse(aJsonObj)
			.data.forEach(function(cardObj, index, array) {
				let title = `[${cardObj.key_}]`;
				let description = `可用/全部:${parseInt(cardObj.在线)-parseInt(cardObj.已用)}/${cardObj.在线}`;
				let cardType = cardObj.卡类型;
				let address = cardObj.address;
				let priceInt = 0;
				let priceDecimal = 0;
				let pricePointIdx = cardObj.price.indexOf('.');
				if (0 < pricePointIdx) {
					priceInt = cardObj.price.slice(0, pricePointIdx);
					priceDecimal = cardObj.price.slice(pricePointIdx + 1, cardObj.price.length - 1);
				} else {
					priceInt = cardObj.price;
				}
				let action = `对接专属`;
				if ('0' === cardObj.state) {} else if ('1' === cardObj.state) {
					action = `已经对接`;
				} else {
					alert(`wt happen?`);
				}
				re += HtmlGen(title, description, cardType, address, priceInt, priceDecimal, action);
			});
		return re;
	}


	function GetPublic2Post(sufficToken, projectId, pageIdx) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "POST",
				url: 'http://az.yezi28.com:90/api/service_exclusive_getpublic2',
				data: `token=${sufficToken};project_id={projectId};index={pageIdx}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					if (res.status === 200) {
						console.log(`${pageIdx}成功,res==${res.responseText}`);
						//根据返回值处理成合格的vanCard标签
						resolve(GetPublic2Deal(res.responseText));
					}
				}
			});
		})
	}

	function GetPromiseAndWait(sufficToken, projectId, pageIdx) {
		return GetPublic2Post(sufficToken, projectId, pageIdx)
			.then(vanCardItems => vanCardItems)
			.catch(error => (console.error("Error:", error), null));
	}


	function userExclusiveSave(e, sufficToken, exclusiveId) {
		//不把对象存下来,异步时找不到了
		this.e = e.currentTarget;
		this.exclusiveId=exclusiveId;
		GM_xmlhttpRequest({
			method: "POST",
			url: 'http://az.yezi28.com:90/api/user_exclusive_push',
			data: `token=${sufficToken};exclusive_id=${this.exclusiveId};key_=;isauto=0`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				if (res.status === 200) {
					console.log(`新增对接码${exclusiveId}成功,res==${res.responseText}`);
					this.e.className = "van-button van-button--warning van-button--mini";
					this.e.querySelector("span.van-button__text")
						.innerText = `已经对接`;
					//取消默认项目的添加
					GM_xmlhttpRequest({
						method: "POST",
						url: 'http://az.yezi28.com:90/api/user_exclusive_get',
						data: `token=${sufficToken}`,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						onload: function(res) {
							if (res.status === 200) {
								console.log(`查看已有对接码成功,res==${res.responseText}`);
								JSON.parse(res.responseText)
								.data.forEach(function(reObj, index, array) {
									if(reObj.key_===this.exclusiveId) {
										let projectId=reObj.project_id;
										console.log(`查看已有对接码的项目id成功,project_id==${projectId}`);
										GM_xmlhttpRequest({
											method: "POST",
											url: 'http://az.yezi28.com:90/api/user_project_pop',
											data: `token=${sufficToken};project_id=${projectId}`,
											headers: {
												"Content-Type": "application/x-www-form-urlencoded"
											},
											onload: function(res) {
												if (res.status === 200) {
													console.log(`删除默认默认项目成功,res==${res.responseText}`);
												}
											}
										});
									}
								});
							}
						}
					});
					
				}
			}
		});
	}
	
	function userExclusiveDelete(e, sufficToken, titleTxt) {
		//不把对象存下来,异步时找不到了
		this.e = e.currentTarget;
		//查看已有对接码
		GM_xmlhttpRequest({
			method: "POST",
			url: 'http://az.yezi28.com:90/api/user_exclusive_get',
			data: `token=${sufficToken}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				if (res.status === 200) {
					console.log(`查看已有对接码成功,res==${res.responseText}`);
					//比对所有结果,得到对应key_对应的id
					JSON.parse(res.responseText)
					.data.forEach(function(reObj, index, array) {
						if(reObj.key_===titleTxt)
						{
							let exclusive_id=reObj.id;
							GM_xmlhttpRequest({
								method: "POST",
								url: 'http://az.yezi28.com:90/api/user_exclusive_pop',
								data: `token=${sufficToken};exclusive_id=${exclusive_id}`,
								headers: {
									"Content-Type": "application/x-www-form-urlencoded"
								},
								onload: function(res) {
									if (res.status === 200) {
										console.log(`删除id==${exclusive_id}的对接码成功,res==${res.responseText}`);
										this.e.className = "van-button van-button--info van-button--mini";
										this.e.querySelector("span.van-button__text")
										.innerText = `对接专属`;
									}
								}
							});
						}
					});
				}
			}
		});
	}


	function userExclusiveClick(e) {
		//单击了对接按钮
		//e.target：触发事件的元素
		//e.currentTarget：绑定事件的元素
		if (e.target && e.target.nodeName == "BUTTON") {
			let sufficToken = localStorage.getItem("token");
			let title = e.target.parentElement.parentElement.children[0].querySelector(".van-card__title")
				.innerText;
			let titleTxt = title.slice(title.indexOf("[") + 1, title.indexOf("]"));
			if (`对接专属` === e.target.querySelector("span.van-button__text")
				.innerText) {
				// GM_log(`对接专属`);
				let exclusiveId = titleTxt;
				userExclusiveSave(e, sufficToken, exclusiveId);
			} else if (`已经对接` === e.target.querySelector("span.van-button__text")
				.innerText) {
				//GM_log(`已经对接`);
				userExclusiveDelete(e, sufficToken, titleTxt);
			}
		}
	}

	function main() {
		const whichVanList = 0;
		let sortBtn = document.getElementsByClassName("sortBtn")[0];
		if (sortBtn.innerText === `排序`) {
			sortBtn.innerText = `刷新`;
			//van-list有两个,当第一个有van-card存在时,说明到了searchEx有内容的页面了
			if (0 == document.getElementsByClassName("van-list")
				.length) {
				setTimeout(() => console.log(1), 5000);
			}
			let vanCards = document.getElementsByClassName("van-list")[whichVanList].querySelectorAll("div.van-card");
			if (null != vanCards && vanCards.length > 0) {
				//干脆自己去请求拿数据算了,虽然捞了点,还要自己写事件
				let sufficToken = localStorage.getItem("token");
				//GM_log(`token==${sufficToken}`);
				vanCardId = vanCards[0].querySelector("div.van-card__title")
					.innerText;
				let iVanCardId = vanCardId.slice(1, vanCardId.indexOf('-'));
				let vanCardItems = '';
				//alert(`start`)
				//for (let pageIdx = 0; pageIdx < 201; pageIdx += 100) { //运行3次,分别赋值为0,100,200
				//	vanCardItems += GetPromiseAndWait(sufficToken, iVanCardId, pageIdx);
				//}
				//alert(`end`)
				//得到需要处理的卡片的个数
				GM_log(`card count==${vanCards.length}`);
				let alreadyActions = new Array();
				let availableActions = new Array();
				//得到每个卡片的价格,还有与之对应的类别
				vanCards.forEach(function(vanCard, index, array) {
					let aInt = vanCard.querySelector("span.van-card__price-integer")
						.innerText;
					let aDec = vanCard.querySelector("span.van-card__price-decimal")
						.innerText;
					let aPrice = parseFloat(`${aInt}.${aDec}`);
					let aAction = vanCard.querySelector("span.van-button__text")
						.innerText;
					//根据要执行的动作进行分组
					if (aAction === "已经对接") {
						//位置0是价格,位置1是内容
						alreadyActions.push([aPrice, `${vanCard.outerHTML}`]);
					} else {
						availableActions.push([aPrice, `${vanCard.outerHTML}`]);
					}
				});

				//根据价格排序
				const pricePosition = 0;
				availableActions.sort((x, y) => {
					return x[pricePosition] - y[pricePosition];
				})

				alreadyActions.sort((x, y) => {
					return x[pricePosition] - y[pricePosition];
				})

				const innerHtmlPosition = 1;
				let vanListInerHtml = "";
				availableActions.forEach(function(item, index, array) {
					//GM_log(`availableActions,${item}`);
					vanListInerHtml += item[innerHtmlPosition];
				});

				alreadyActions.forEach(function(item, index, array) {
					//GM_log(`alreadyActions,${item}`);
					vanListInerHtml += item[innerHtmlPosition];
				});
				//替换排序后的卡片内容
				document.getElementsByClassName("van-list")[whichVanList].innerHTML = vanListInerHtml;
				//新页面添加单击事件
				vanCards = document.getElementsByClassName("van-list")[whichVanList].querySelectorAll("div.van-card button.van-button");
				vanCards.forEach(function(vanCard, index, array) {
					vanCard.addEventListener("click", userExclusiveClick);
				});
			} //if(null!=vanCards&&vanCards.length>0){

		} else if (sortBtn.innerText === `刷新`) {
			location.reload();
		}
	}
})();