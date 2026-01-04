// ==UserScript==
// @name         聚水潭-ajax版本
// @namespace    [https://sc.scm121.com/]
// @version      0.1
// @description  聚水潭-ajax版本-批量解密订单，保存到本地
// @author       Ｌｚｑ
// @run-at       document-end
// @license      MIT 
// @match        https://sc.scm121.com/*
// @match        *erp321.com/
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      innerorder.scm121.com
// @connect      sc.scm121.com
// @connect      erp321.com

// @downloadURL https://update.greasyfork.org/scripts/439899/%E8%81%9A%E6%B0%B4%E6%BD%AD-ajax%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439899/%E8%81%9A%E6%B0%B4%E6%BD%AD-ajax%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
	'use strict'  
	const apiFunList = {
		// 游客登陆 获取token
		getGuessTokenApi: (time) =>
			`https://erp321.com/app/drp/drp_common.aspx?ts___=${time}&am___=GetRedirectToken`,
		getGuessTokenFun: () => {
			const delInput = document.getElementById('__VIEWSTATE').value
			const rotor = document.getElementById('__VIEWSTATEGENERATOR').value
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					url: apiFunList.getGuessTokenApi(new Date().getTime()),
					method: 'POST',
					data: `__VIEWSTATE_DEL=${
						delInput && encodeURI(delInput)
					}&__VIEWSTATEGENERATOR=${
						rotor && encodeURI(rotor)
					}&__CALLBACKID=ACall1&__CALLBACKPARAM=%7B%22Method%22%3A%22GetRedirectToken%22%2C%22CallControl%22%3A%22%7Bpage%7D%22%7D&__VIEWSTATE=`,
					contentType: false,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					onload: function (xhr) {
						console.log('游客token', xhr.responseText)
						resolve(xhr.responseText)
					},
				})
			})
		},
		// 登陆 获取token
		getTokenApi: `https://sc.scm121.com/api/report/open/login/erpJointLoginGyl2`,
		getTokenFun: () => {
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					url: apiFunList.getTokenApi,
					method: 'POST',
					data: JSON.stringify({ fromSource: 'erp_nav_print' }),
					headers: {
						'content-type': 'application/json',
						token: initPublicData.guessToken,
					},
					onload: function (xhr) {
						console.log('TOken', xhr.responseText)
						resolve(xhr.responseText)
					},
				})
			})
		},
		// 获取会员信息 包含uid coid
		userInfoApi: `https://sc.scm121.com/api/company/user/supplier/getUserInfo?supplierType=shop&terminalName=SUPPLIER`,
		getUserInfo: () => {
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					url: apiFunList.userInfoApi,
					method: 'GET',
					headers: {
						authorization: initPublicData.token,
					},
					onload: function (xhr) {
						console.log('请求的数据', xhr.responseText)
						resolve(xhr.responseText)
					},
				})
			})
		},
		// 获取数据列表 已取消 已发货
		pageListApi:
			'https://innerorder.scm121.com/api/inner/supOrder/getErpNormalOrders',
		getPageList: () => {
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					url: apiFunList.pageListApi,
					method: 'POST',
					data: JSON.stringify(initSCObject.pageObject),
					headers: {
						'Content-type': 'application/json',
						accept: 'application/json',
						authorization: initPublicData.token,
					},
					onload: function (xhr) {
						console.log('请求的数据', xhr.responseText)
						resolve(xhr.responseText)
					},
				})
			})
		},
        // 待发货
        waitConfirmApi: `https://innerorder.scm121.com/api/inner/saleOutOrder/list`,
        waitConfirmFun: (pageObject) => {
            return new Promise((resolve) => {
				GM_xmlhttpRequest({
					url: apiFunList.waitConfirmApi,
					method: 'POST',
					data: pageObject,
					headers: {
						'Content-type': 'application/json',
						accept: 'application/json',
						authorization: initPublicData.token,
					},
					onload: function (xhr) {
						console.log('请求的数据', xhr.responseText)
						resolve(xhr.responseText)
					},
				})
			})
        },
		// 解密
		decryptionApi:
			'https://innerorder.scm121.com/api/inner/innerOrder/decryption',
		decryptionFun: (data) => {
			console.log('进入参数', data)
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					url: apiFunList.decryptionApi,
					method: 'POST',
					data,
					headers: {
						'Content-type': 'application/json',
						accept: 'application/json',
						authorization: initPublicData.token,
					},
					onload: function (xhr) {
						resolve(xhr.responseText)
					},
				})
			})
		},
		// 获取店铺列表
		getShopListApi: `https://sc.scm121.com/api/company/shop/queryAllShopForOrder`,
		getShopList: () => {
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					url: apiFunList.getShopListApi,
					method: 'GET',
					headers: {
						authorization: initPublicData.token,
					},
					onload: function (xhr) {
						console.log('请求的店铺数据', xhr.responseText)
						resolve(xhr.responseText)
					},
				})
			})
		},
	}
	// 公共函数
	const PublicFun = {
		// 获取Cookie内容
		getCookie: (name) => {
			var arr,
				reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
			if ((arr = document.cookie.match(reg))) {
				return unescape(arr[2])
			} else {
				return null
			}
		},
		// 下载txt
		download: (filename, text) => {
			var element = document.createElement('a')
			let ttt = ''
			text.forEach((res) => {
				ttt = ttt + res
			})
			element.setAttribute(
				'href',
				'data:text/plain;charset=utf-8,' + encodeURIComponent(ttt)
			)
			element.setAttribute('download', filename)

			element.style.display = 'none'
			document.body.appendChild(element)

			element.click()

			document.body.removeChild(element)
		},
	}
	// 公共数据
	const initPublicData = {
		userNamePhoneData: [],
		page: 1,
		limit: 10,
		guessToken: '',
		token: '',
		coId: '',
		uid: '',
		userAllData: [],
        shopId: '',
		combined: 0,
		listData: null,
		getTokenFuns: () => {
			return new Promise((resolve, rej) => {
				apiFunList.getTokenFun().then((res) => {
					console.log('res', res)
					const resJson = JSON.parse(res)
					if (resJson.success) {
						if (resJson.data || resJson.data.token) {
							initPublicData.token =
								resJson.data.token.refresh_token
							resolve(true)
							return
						}
						rej(true)
						return
					}
					rej(false)
				})
			})
		},
		combinedInit: 0, // 累加器
		//获取Uid Coid Function
		getUCOIDFun: () => {
			apiFunList.getUserInfo().then((res) => {
				const resJson = JSON.parse(res)
				if (resJson.success) {
					initPublicData.coId = resJson.data.coCompanyUser.coId
					initPublicData.uid = resJson.data.coCompanyUser.uid
					initSCObject.pageObject.coId =
						resJson.data.coCompanyUser.coId
					initSCObject.pageObject.uid = resJson.data.coCompanyUser.uid

					// 请求列表
					// initSCObject.getPageFun()
				}
				 // initPublicData.userAllData = resJson
				console.log('this', initPublicData)
			})
		},
	}
	// 已取消 已发货订单
	const initSCObject = {
		//订单状态序号序号
		orderStatusNum: 0,
		// 订单状态
		orderStatus: ['Sent', 'Cancelled'], //Sent 已发货 Cancelled 已取消
		// 获取页面的对象
		pageObject: {
			dateQueryType: 'OrderDate',
			coId: initPublicData.coId,
			uid: initPublicData.uid,
			upSendFailed: false,
			shopIds: [],
			expertName: {
				leftValue: 'referrerName',
			},
			pageNum: initPublicData.page,
			pageSize: initPublicData.limit,
			orderStatus: [],
		},
		getPageFun: () => {
			return new Promise((resolve, rej) => {
				apiFunList.getPageList().then((res) => {
					// console.log('列表数据',res)
					const resJson = JSON.parse(res)
					if (resJson.success) {
						initPublicData.listData = resJson.data
						initPublicData.combined = initPublicData.listData.length
						resolve(resJson.data)
						// 解密函数
						// decryptionObject.decryptionFun(initPublicData.combinedInit)
					}
				})
			})
		},
		// 获取token
	}
	// 解密
	const decryptionObject = {
		resnumcon: 5, // 错误重试次数
		resetNum: 0, // 空数据计数器
		errorResetNum: 0, // 失败计数器
		decryptionData: {
			shopId: '',
			coId: '',
			items: [
				{
					address: '',
					name: '',
					mobile: '',
					rawSoId: '',
				},
			],
			fuzzy: false,
		},
		savaDataFun: () => {
            if(!initPublicData.userAllData || !initPublicData.userAllData.length) {
                alert('你不获取数据，我保存什么东西？？？')
                return
            }
            const spliterconte = initPublicData.userAllData.map(res => {
                
                return  `${res.name} ${res.phone} ${res.address} ${res.shopList} ${res.shopName}\n`
            })
			var myDate = new Date()
				PublicFun.download(
					`聚水潭 - ${myDate.getFullYear()}-${
						myDate.getMonth() + 1
					}-${myDate.getDate()}  ${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()} --- ${
						initPublicData.combined
					}条.txt`,
					spliterconte
				)
				return
		},
        decryptionFun: (num) => {
            console.log('initPublicData.listData', initPublicData.userAllData[num])
            const numDatalist = initPublicData.userAllData[num]
            const userInfoData = numDatalist.fullReceiveData &&
                JSON.parse(numDatalist.fullReceiveData)
            const fuzzFullReceiverInfo = numDatalist.fuzzFullReceiverInfo &&
                JSON.parse(numDatalist.fuzzFullReceiverInfo)
            console.log('userInfoDatauserInfoData====>>>>', userInfoData)
            if (userInfoData) {
                decryptionObject.decryptionData.shopId = numDatalist.shopId
                decryptionObject.decryptionData.coId = initPublicData.coId
                decryptionObject.decryptionData.items = [
                    {
                        address: userInfoData.ReceiverAddress || '',
                        name: userInfoData.ReceiverName || '',
                        mobile: userInfoData.ReceiverPhone || '',
                        rawSoId: numDatalist.soId || '',
                    },
                ]
                apiFunList
                    .decryptionFun(
                        JSON.stringify(decryptionObject.decryptionData)
                    )
                    .then((res) => {
                        const resJson = JSON.parse(res)
                        if (resJson.success) {
                            if (!resJson.data.length) {
                                // 重试n次后跳出
                                if (decryptionObject.resetNum <
                                    decryptionObject.resnumcon) {
                                    decryptionObject.resetNum++
                                    decryptionObject.decryptionFun(num)
                                    return
                                }
                                decryptionObject.resetNum = 0
                                initPublicData.combinedInit++
                                decryptionObject.decryptionFun(
                                    initPublicData.combinedInit
                                )
                                return
                            }
                            const userAddInfos = {
                                name: resJson.data[0].name,
                                address: resJson.data[0].address,
                                mobile: resJson.data[0].mobile,
                            }
                            if(!userAddInfos.mobile) {
                                const r = confirm(resJson.data[0].message + '，申请后点击确认继续，或者取消保存已有数据；');
                                if(r) {
                                    decryptionObject.decryptionFun(num)
                                }
                                return
                            }
                            initPublicData.userAllData[num].name = userAddInfos.name
                            initPublicData.userAllData[num].phone = userAddInfos.mobile
                            initPublicData.userAllData[num].address = initPublicData.userAllData[num].touAddrs + userAddInfos.address
                            addDom.resetTabDom(num)
                            // 保存到本地
                            // decryptionObject.savaDataFun(
                            //     userAddInfos,
                            //     numDatalist
                            // )
                            if (initPublicData.combinedInit == initPublicData.combined-1) {
                                // 数据保存到本地
                                setTimeout(_=>{
                                    alert('已完成')
                                }, 1000)
                                
                                return
                            }
                            initPublicData.combinedInit++
                            decryptionObject.decryptionFun(initPublicData.combinedInit)
                      
                            console.log('解密数据', res)
                            return
                        }
                        console.log('错误', res)
                        // 重试n次后跳出
                        if (decryptionObject.errorResetNum <
                            decryptionObject.resnumcon) {
                            decryptionObject.decryptionFun(num)
                            decryptionObject.errorResetNum++
                            return
                        }
                        decryptionObject.errorResetNum = 0
                        initPublicData.combinedInit++
                        decryptionObject.decryptionFun(
                            initPublicData.combinedInit
                        )
                    })
            } else {
                console.clear()
                console.log('没有加密的数据', fuzzFullReceiverInfo)
                const userAddInfos = {
                    name: fuzzFullReceiverInfo.receiver_name,
                    address: fuzzFullReceiverInfo.receiver_address,
                    mobile: fuzzFullReceiverInfo.receiver_mobile,
                }
                if (initPublicData.combinedInit == initPublicData.combined-1) {
                    // 数据保存到本地
                    setTimeout(_=>{
                        alert('已完成')
                    }, 1000)
                    
                    return
                }
                // decryptionObject.savaDataFun(userAddInfos, numDatalist)
            }
        }
	}

	const addDom = {
		content: `<div class="topboxcontent" onClick="(()=>event.stopPropagation())()">
        <div class="tables" style="color: red">
            每日订单解密数量有限；<br/>
            根据抖音后台提供数量支持<br/>
            可到抖店服务市场内申请解密额度使用
        </div>
           <div class="tables">选择店铺：
             <form id='selectcontents'>
             </form>
           </div>
           <div class="tables">选择订单状态：
                <form id='selectOrderStatus'>
                    <span class="conshge"><input name="order" class="ordechrngd" type="radio" value="WaitConfirm" />待发货</span>
                    <span class="conshge"><input name="order" class="ordechrngd" type="radio" value="Cancelled" />已取消</span>
                    <span class="conshge"><input name="order" class="ordechrngd" type="radio" value="Sent" />已发货</span>
                </form>
           </div>
           <div class="tables">第： <input name="pageNum" class="pageclass" id="classnums" type="number" min="1" value="${initSCObject.pageObject.pageNum}" style="width: 50px"/> 页开始</div>
           <div class="tables">解密： <input name="pageNum" class="pageclass" id="classnumsunhs" type="number" min="1" max="500" value="${initSCObject.pageObject.pageSize}" /> 条数据</div>
           <div class="consthe">
                <table border="1" >
                    <tbody>
                        <tr>
                            <th>姓名</th>
                            <th>电话</th>
                            <th>地址</th>
                            <th>图片</th>
                            <th>商品</th>
                            <th>订单状态</th>
                            <th>快递</th>
                            <th>店铺</th>
                        </tr>
                    </tbody>
                    <tbody id="tablistDom">
                    </tbody>
                </table>
           </div>
           <div class="boutonContent">
             <button class="butons" id="getData">获取数据</button>
             <button class="butons" id="openData">开始解密</button>
             <button class="butons" id="saveData">保存到本地</button>
             <button class="butons" id="clearBox" style="color: red">关闭页面</button>
           </div>
        </div>`,
		selictDom: ``,
		addFun: () => {
			const dome = document.getElementById('tab_list')
			if (dome) {
				let newSpan = document.createElement('span')
				newSpan.className = 'tab-item'
				newSpan.style.color = 'red'
				newSpan.innerHTML = '订单解密功能'
				dome.append(newSpan)
				// addDom.funOpenContent()
				newSpan.addEventListener('click', addDom.funOpenContent)
			}
		},
		// 功能弹窗
		funOpenContent: () => {
			let newDiv = document.createElement('div')
			document.body.append(newDiv)
			newDiv.className = 'tobero-pages'
			newDiv.id = 'pagehs'
			newDiv.innerHTML = addDom.content
			apiFunList.getShopList().then((res) => {
				console.log('店铺数据:', res)
				const resJson = JSON.parse(res)
				if (resJson.success) {
					addDom.selictDom = `<span class="conshge"><input name="Fruit" class="chengnums" type="radio" value="0" />线下</span>`
					resJson.data.forEach((resq, i) => {
						addDom.selictDom =
							addDom.selictDom +
							`<span class="conshge"><input name="Fruit" class="chengnums" type="radio" value="${resq.shopId}" />${resq.shopName}</span>`
					})

					document.getElementById('selectcontents').innerHTML =
						addDom.selictDom
					addDom.addDomFun()
				}
			})
					
		},
        resetTabDom(num) {
            console.log(num)
            const tagbse = document.getElementById('tablistDom')
            const chjyen = tagbse.getElementsByTagName('tr')[num].getElementsByTagName('th')
            console.log('chjyen', chjyen)
            chjyen[0].innerText = initPublicData.userAllData[num].name
            chjyen[1].innerText = initPublicData.userAllData[num].phone
            chjyen[2].innerText = initPublicData.userAllData[num].address

        },
        // 绑定事件
		addDomFun: () => {
			// 选择店铺
			const inputNum = document.getElementsByClassName('chengnums')

			for (let i = 0; i < inputNum.length; i++) {
				console.log('resaa', inputNum[i])
				inputNum[i].addEventListener('click', () => {
                    initPublicData.shopId = inputNum[i].value
					initSCObject.pageObject.shopIds = [inputNum[i].value]
					console.log(
						'initSCObject.pageObject',
						initSCObject.pageObject
					)
				})
			}
			// 修改页
			const inputPage = document.getElementById('classnums')
			inputPage.addEventListener('change', () => {
				initSCObject.pageObject.pageNum = inputPage.value * 1
				console.log('initSCObject.pageObject', initSCObject.pageObject)
			})
			// 修改条
			const inputSize = document.getElementById('classnumsunhs')
			inputSize.addEventListener('change', () => {
				initSCObject.pageObject.pageSize = inputSize.value * 1
				console.log('initSCObject.pageObject', initSCObject.pageObject)
			})
			// 选择状态
			const inputStatus = document.getElementsByClassName('ordechrngd')
			for (let i = 0; i < inputStatus.length; i++) {
				console.log('resaa', inputStatus[i])
				inputStatus[i].addEventListener('click', () => {
					initSCObject.pageObject.orderStatus = [inputStatus[i].value]
					console.log(
						'initSCObject.pageObject',
						initSCObject.pageObject
					)
				})
			}
			// 获取数据
			const getdatadom = document.getElementById('getData')
			getdatadom.addEventListener('click', () => {
				
                if(!initSCObject.pageObject.shopIds || !initSCObject.pageObject.shopIds.length) {
                    alert('必须选一个店铺哈~')
                    return
                }
                if(!initSCObject.pageObject.orderStatus || !initSCObject.pageObject.orderStatus.length) {
                    alert('选个订单状态~')
                    return
                }
				console.log('获取数据')
				
                initPublicData.userAllData = []
                console.log('initSCObject.pageObject.orderStatus', initSCObject.pageObject.orderStatus)
                // 待发货
                if(initSCObject.pageObject.orderStatus.includes('WaitConfirm')) {
                    const datas = {
                        "coId": initPublicData.coId,
                        "uid": initPublicData.uid,
                        "pageNum": initPublicData.page,
                        "pageSize": initPublicData.limit,
                        "saleOutStatus": "WaitConfirm",
                        "shopId": initPublicData.shopId,
                        "sortByPayDate": "asc"
                    }
                    console.log('datasdatas', datas)
                    apiFunList.waitConfirmFun(JSON.stringify(datas)).then(res => {
                        const resJSON = JSON.parse(res)
                        initPublicData.combined = resJSON.data.length
                        dataFamate(resJSON.data.map(asd => {
                            asd.disInnerOrderGoodsViewList = asd.goodsInfo
                            return asd
                        }))
                    })
                    return
                }
                // 已发货已取消
				initSCObject.getPageFun().then((res) => {
					console.log('格式的', res)
                    dataFamate(res)
					
				})
                console.log('initPublicData.userAllData', initPublicData.userAllData)
			})
            // 数据格式化
            const dataFamate = function(res) {
                let datalistDom = ``
                const tablistDom = document.getElementById('tablistDom')
                res.forEach((as) => {
                    const fullReceiveData =
                        as.fullReceiveData && JSON.parse(as.fullReceiveData)
                    const fuzzFullReceiverInfo =
                        as.fuzzFullReceiverInfo &&
                        JSON.parse(as.fuzzFullReceiverInfo)
                    const datainfos = {
                        name:
                            (fullReceiveData && fullReceiveData.MaskName) ||
                            (fuzzFullReceiverInfo &&
                                fuzzFullReceiverInfo.receiver_name),
                        phone:
                            (fullReceiveData &&
                                fullReceiveData.MaskPhone) ||
                            (fuzzFullReceiverInfo &&
                                fuzzFullReceiverInfo.receiver_mobile),
                        address:
                            as.receiverState +
                            as.receiverCity +
                            as.receiverDistrict +
                            ((fullReceiveData &&
                                fullReceiveData.MaskAddress) ||
                                (fuzzFullReceiverInfo &&
                                    fuzzFullReceiverInfo.receiver_address)),

                        shopList: as.disInnerOrderGoodsViewList.map(
                            (resasd) => {
                                return `${resasd.properties}`
                            }
                        ),
                        pic: as.disInnerOrderGoodsViewList.map(
                            (resasd) => {
                                return{src: resasd.pic,
                                dom: `<img src=${resasd.pic} style="width: 30px;height: 30px"/>`
                                }
                            }
                        ),
                        touAddrs: as.receiverState +
                                    as.receiverCity +
                                    as.receiverDistrict ,
                        errorMsg: as.errorMsg,
                        expressCompany: as.expressCompany,
                        shopName: as.shopName,
                        fullReceiveData: as.fullReceiveData,
                        fuzzFullReceiverInfo: as.fuzzFullReceiverInfo,
                        shopId: as.shopId,
                        soId: as.soId
                    }
                    initPublicData.userAllData.push(datainfos)
                    
                    datalistDom =
                        datalistDom +
                        `<tr>
                            <th style="width: 50px">${datainfos.name}</th>
                            <th>${datainfos.phone}</th>
                            <th>${datainfos.address}</th>
                            <th>${datainfos.pic[0].dom}</th>
                            <th>${datainfos.shopList}</th>
                            <th>${datainfos.errorMsg}</th>
                            <th>${datainfos.expressCompany}</th>
                            <th>${datainfos.shopName}</th>
                        </tr>`
                    tablistDom.innerHTML = datalistDom
                    console.log('fullReceiveData', fullReceiveData)
                    console.log(
                        'fuzzFullReceiverInfo',
                        fuzzFullReceiverInfo
                    )
                })

            }
			// 开始解密
			const statrdecryptionFun = document.getElementById('openData')
			statrdecryptionFun.addEventListener('click', () => {
                if(!initPublicData.userAllData || !initPublicData.userAllData.length) {
                    alert('先获取数据呀~~~')
                    return
                }
				decryptionObject.decryptionFun(0)
			})

            // 保存按钮
            const saveDataFun = document.getElementById('saveData')
            saveDataFun.addEventListener('click', () => {
				decryptionObject.savaDataFun(0)
			})
            // 关闭弹窗
            const clearBox = document.getElementById('clearBox')
                clearBox.addEventListener('click', () => {
                    const newDiv = document.getElementById('pagehs')
                    const r = confirm("你关了数据就没了， 想想好先");
                    if (r) {
                        initPublicData.page = 1
                        initPublicData.userAllData = []
                        initPublicData.limit = 10
                        initPublicData.combined = 0
                        initPublicData.listData = null
                        initPublicData.combinedInit = 0
                        initSCObject.pageObject.shopIds = []
                        initSCObject.pageObject.orderStatus = []
                        
                        newDiv.remove()
                    } 
                    
                })
		},
	}
	//初始化
	const init = function () {
		// 渲染页面
		window.onload = function () {
			apiFunList.getGuessTokenFun().then((res) => {
				const strin = res.split('|')[1]
				const resJson = JSON.parse(strin)
				if (resJson.IsSuccess) {
					initPublicData.guessToken = resJson.ReturnValue
					initPublicData.getTokenFuns().then((res) => {
						initPublicData.getUCOIDFun()
						addDom.addFun()
					})
				}
			})
		}
		// 开始解密过程
	}
	// 样式
	GM_addStyle(`
                .tobero-pages {
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(0,0,0,0.3);
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 9999999999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .topboxcontent {
                    width: 60%;
                    min-height:50px;
                    background: #fff;
                    border-radius: 10px;
                    padding: 20px;
                }
                .topboxcontent .tables {
                    padding:10px 0;
                    border-bottom: 1px solid #eee;
                }
                .chengnums {
                    padding-right: 10px
                }
                .conshge {
                    padding: 10px 10px 10px 0;
                }
                .consthe {
                    max-height: 300px;
                    overflow: scroll;
                    margin: 10px 0;
                }
                `)
	init()
})()
