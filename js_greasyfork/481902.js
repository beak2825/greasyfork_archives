// ==UserScript==
// @name         车道标注-一阶段
// @namespace    http://tampermonkey.net/
// @version      2024.1.4.1 Beta
// @description  Try it
// @author       You
// @match        https://annotation.bettersmart.net/marking-panel/panel/*
// @match        https://annotation-test.bettersmart.net/marking-panel/panel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bettersmart.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481902/%E8%BD%A6%E9%81%93%E6%A0%87%E6%B3%A8-%E4%B8%80%E9%98%B6%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/481902/%E8%BD%A6%E9%81%93%E6%A0%87%E6%B3%A8-%E4%B8%80%E9%98%B6%E6%AE%B5.meta.js
// ==/UserScript==

(function() {
	'use strict';


	/**==================================

快捷键：
P          ==>  所有快捷键失效/生效

Q          ==>  选中普通车道
W          ==>  选中公交车道
E          ==>  选中非机动车道

B          ==>  返回到最近看过的一帧（仅预览跳转和查看最近标注帧跳转时记录）
Y          ==>  删除当前帧全部标注结果
Ctrl+Y     ==>  删除当前帧的最后一个标注项
Ctrl+S     ==>  保存当前帧数据
Enter      ==>  开启/关闭 自动遍历未查看帧并提交

<          ==>  自动向前遍历帧
> 或 空格  ==>  自动向后遍历帧

X          ==>  开启/关闭预览窗口
R          ==>  开启预览窗口的前提下，进行当前帧矫正

`          ==>  查看道路前方最近的标注帧
Shift+`    ==>  查看道路后方最近的标注帧
ESC        ==>  取消标注帧查找
==================================**/

	let drawPointImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAMAAADM4ogkAAAAAXNSR0IArs4c6QAAAF1QTFRFAAAA////////////////////////////////////////////////////////////////////////////AFj+C1/+DGD+DWH+QYP+fKn+fqv+ss3/s83/tM7/////8xfV/gAAABR0Uk5TABQVFlNUgoOGw8TO0NHS0/Dx8v45tTjGAAAAkklEQVQ4y+2T2w6CMBBEt1KRKqLlUhaL8/+fSQKSNGC2fdSE87g5SbuTWaIvGENpAIf4z6IqKqDMVczTT8xYHfEajOwcj2hE82TxamcG2EwQc7zbDx6FIJbgVWRU2z4jpF/FPhgaSXTB8Co/fReX8WnLZBZDUjxL4F3HPhI40ble/l/reCkewO2ijpv5QdHs+0cT7GsXY68JiuEAAAAASUVORK5CYII='
	let dragImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAMAAADM4ogkAAAAAXNSR0IArs4c6QAAAYlQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VkzjgAAAAIJ0Uk5TAAECAwQFBwkKDQ4PEBETFBUXGBobHB0eHyAhIiQmKCksMDEyNTg7PUFER0tNUFFSU1dYX2FkZmdoa25wc3V5fH+Cg4WIiYuMjo+RlJeanqCjpqeqrK2xtLe5u73AwsXGx8jJyszO0tbZ293e3+Dh4+Xm5+rs7u/x9PX3+Pn6+/z9/mziSBkAAAF0SURBVDjLjdLpW0FBFAbwoRKJ9qTSIq3atS8qUbRqU1HaFyntK8L7l3dx5V6ua+bTzPv8nmfOzDmEkD2LnlCtBcBnNUjyw1bEV8DRKc0nfTA7Aox9WesuFIU2rBCJwXbH2LcNoyw3NOAxUaHecsPYD2dfcQ4oCaCd3TbPXTH2a2dIISjtWEofGmbPYsCPy6TKhh3w886a6eMoED4cK8uA0me0ZUSVE+5fIOKZrOLFq1jMvkc9sh8Eot4mTtaFW8HiS52AlRsUvKJFCPaH+I6QdcxTOdKDaypHit6ho3GEbMJM5UgvLvmBMQS70Ptkn6jnBdp7eEuE5BZm+IH2QVgO4oRQSfl3rJpO7mIq9TCdqBzGUepfnkSlIhitYP8P4tKF8aRb9ohLE9xsP+TiUhUOqweSfcsjD7Cd6i9HKs/hr+XDUaTn+V8qT+GvyyiyPMKZF1YKOUI83LlKyLjTZDenkd9URl4Iuqz2e0Dl4pLOMbLmf/sHbW13/+CqzOwAAAAASUVORK5CYII='
	let isPause = false //使快捷键暂时失效
	let taskDataSet = []
	let taskId = /\marking-panel\/panel\/(.*)/.exec(location.pathname)[1]
	let isShowPreviewImg = false
	let isSubmit = false
	let isReadyDel = false
	let initPreview = false
	let frameInfo = {
		allFrameNum: 0,
		curFrameNum: 0
	}
	let tempFrame = 1;//临时帧存储
	let isRead = false;
	let readInterval = null;
	let stopFindAnnotateFrame = 0

	let delTimer = null;
	new MutationObserver((mutations) => {
		mutations.forEach(mutation => {
			if(mutation.addedNodes.length && mutation.addedNodes[0]?.className?.includes('wrapper item')) {
				let parentElement = mutation.addedNodes[0].querySelector('.content');
				let inputWrap = document.createElement('div')
				let timeInput = document.createElement('input')
				let timeSelector = document.createElement('select')
				let inputTip = document.createElement('span')
				timeInput.className = 'time-input'
				timeSelector.className = 'time-selector';
				timeInput.style.height = '25px'
				
				let selVals = ['工作日', '非工作日', '早高峰', '晚高峰', '--']
				selVals.forEach((curVal, idx) => {
					let selectOption = document.createElement('option')
					selectOption.innerText = curVal
					selectOption.value = idx
					if(idx == selVals.length-1) selectOption.setAttribute('selected', idx)
					timeSelector.appendChild(selectOption)
				})

				let storeTime = localStorage.getItem('inputTime');
				storeTime && (timeInput.value = storeTime)
				inputTip.style.fontSize = '12px'
				inputTip.style.marginRight = '5px'

				timeInput.addEventListener('input', ()=> {
					if(timeInput.value === '' || vertifyTime(timeInput.value)) {
						inputTip.textContent = ''
						localStorage.setItem('inputTime', timeInput.value)
					} else {
						inputTip.textContent = '格式有误 或 时间不合理'
					}
				})

				inputWrap.append(inputTip, timeSelector, timeInput)
				parentElement.append(inputWrap)
			}
			if(isSubmit && mutation.addedNodes.length && mutation.addedNodes[0]?.textContent.includes('是否提交任务，提交任务后无法修改') && mutation.addedNodes[0]?.className.includes('el-message-box__wrapper')) {
				// console.log(mutation)
				setTimeout(() => {
					mutation.addedNodes[0].querySelectorAll('.el-button.el-button--default.el-button--small')[1].click()
					setTimeout(() => {
						let pageNum = /还有未做完的图片，图片序号为: \[(.*)\]/.exec([...document.querySelectorAll('.el-message.el-message--warning')].at(-1)?.textContent)[1]
						pageTurning(pageNum)
					}, 500)
				})

			}
			if(isSubmit && mutation.addedNodes.length && mutation.addedNodes[0]?.className?.includes('el-loading-mask')) {
				// console.log('add')
				delTimer = setTimeout(() => {
					[...document.querySelector('.main').nextElementSibling.querySelectorAll('button')].find((curBtn) => curBtn.textContent.includes('提交任务')).click()
				}, 500)
			}
			if(isSubmit && mutation.removedNodes.length && mutation.removedNodes[0]?.className?.includes('el-loading-mask')) {
				// console.log('del')
				delTimer && clearTimeout(delTimer)
			}

			if(isSubmit && mutation.addedNodes.length && mutation.addedNodes[0]?.textContent.includes('已切换到下一任务，即将跳转至图片标注产线') && mutation.addedNodes[0]?.className.includes('el-message--success')) {
				isSubmit = false
			}

			if(mutation.addedNodes && mutation.addedNodes[0]?.className && mutation.addedNodes[0].querySelector('.listScroll')) {
				//监视标注结果列表
				new MutationObserver((mutations) => {
					mutations.forEach(mutation => {
						if(mutation.addedNodes && mutation.addedNodes[0]?.textContent?.includes('公交') && !/\d/.test(mutation.addedNodes[0].querySelector('.note')?.textContent)) {
							[...document.querySelector('.main-center').querySelector('.wrapper.item').children[1].querySelector('.uploadBox').children].find((item) => item.title.includes('疑问')).children[0].click()

							setTimeout(() => {
								[...document.querySelector('.optBox.opt').querySelectorAll('img')].find((curImg) => {
									if(curImg.src == drawPointImgSrc) return curImg
								}).click()
							}, 150)
						}
					})
				}).observe(document.querySelector('.listScroll'), {childList: true, subtree: true})
			}
		})
	}).observe(document.body, {childList: true, subtree: true})

	//翻页
	function pageTurning(pageNum) {
		let input = document.querySelector('.main').nextElementSibling.querySelector('.el-input__inner');
		input.value = pageNum;
		input.dispatchEvent(new Event('input', { bubbles: true }));
		[...document.querySelector('.main').nextElementSibling.querySelectorAll('button')].find((curBtn) => curBtn.textContent.includes('跳转')).click()
	}


	let curImgIdx = 0
	let curImg
	let timer
	let intervalTimer
	let startTime
	let previewBox = document.createElement('div');
	let imgWrap = document.createElement('div');
	let btnWrap = document.createElement('div');
	let previewBottom = document.createElement('div')
	let skipBtn = document.createElement('div')
	let returnBtn = document.createElement('div')
	let previewInfo = document.createElement('div')
	previewInfo.style.fontWeight = 800
	previewInfo.style.fontSize = '18px'

	setStyleSheet(previewBox, {
		display: 'none',
		position: 'absolute',
		top: '0%',
		left: '0%',
		zIndex: 9999,
	})

	setStyleSheet(previewBottom, {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		padding: '5px 10px',
		background: 'rgba(255,255,255,.5)',
		fontSize: '17px'
	})
	setStyleSheet(btnWrap, {
		display: 'flex',
	})

	setStyleSheet(imgWrap, {
		overflow: 'hidden',
		width: '1000px',
		minHeight: '450px',
		background: 'pink',
		willChange: 'transform',
	})
	skipBtn.innerText = `跳转`;
	setStyleSheet(skipBtn, {
		width: '80px',
		height: '35px',
		marginLeft: '5px',
		lineHeight: '35px',
		background: '#1e6fff',
		color: '#fff',
		textAlign: 'center',
		borderRadius: '5px',
		cursor: 'pointer',
	})
	returnBtn.innerText = `返回`;
	setStyleSheet(returnBtn, {
		width: '80px',
		height: '35px',
		lineHeight: '35px',
		background: '#1e6fff',
		color: '#fff',
		textAlign: 'center',
		borderRadius: '5px',
		cursor: 'pointer',
	})

	skipBtn.addEventListener('click', () => {
		tempFrame = /当前第\((.*)\//.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1];
		pageTurning(curImgIdx+1)
	})
	returnBtn.addEventListener('click', () => pageTurning(tempFrame))

	previewBox.append(imgWrap)
	previewBottom.append(previewInfo)
	btnWrap.append(returnBtn)
	btnWrap.append(skipBtn)
	previewBottom.append(btnWrap)
	previewBox.append(previewBottom)
	document.body.append(previewBox)

	function clickCallBackFn(e) {
		e.preventDefault(); // 阻止默认的右键菜单弹出

		const mouseY = e.clientY;
		const targetRect = imgWrap.getBoundingClientRect();
		console.log(targetRect)
		const distance = mouseY - targetRect.top;

		if(distance < imgWrap.offsetHeight/2 && curImgIdx !== taskDataSet.length-1) {
			imgWrap.children[curImgIdx].style.display = 'none';
			imgWrap.children[++curImgIdx].style.display = 'block';
			curImg = imgWrap.children[curImgIdx]
		}else if(distance > imgWrap.offsetHeight/2 && curImgIdx !== 0) {
			imgWrap.children[curImgIdx].style.display = 'none';
			imgWrap.children[--curImgIdx].style.display = 'block';
			curImg = imgWrap.children[curImgIdx]
		}

		previewInfo.innerText = `第${curImgIdx+1}帧${curImgIdx+1 == /当前第\((.*)\/(.*)\)帧/.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1]- 0 ? '(当前帧)' : ''}`
		console.log(123321)
    }

	imgWrap.addEventListener('contextmenu', clickCallBackFn);


	let findTip = document.createElement('div');
	setStyleSheet(findTip, {
		display: 'none',
		position: 'absolute',
		top: '10%',
		left: '50%',
		padding: '5px 10px',
		height: '45px',
		lineHeight: '45px',
		transform: 'translate(-50%, 0)',
		zIndex: 9999,
		background: 'pink',
	})
	document.body.append(findTip)

	let isAutoPageTurning = false
	imgWrap.addEventListener('mousedown', (e) => {
		e.preventDefault();
		if(e.button !== 1) return
		if(!isAutoPageTurning) {

			startTime = Date.now()
			intervalTimer = setInterval(()=> {
				clickCallBackFn(e)
			}, 250)
			isAutoPageTurning = true
		} else {
			clearInterval(intervalTimer)
			isAutoPageTurning = false
		}
	})



	function vertifyTime(timeStr) {
		let times = timeStr.split(',')
		return !times.some((curTime)=> {
			let groups = /^(?<hour1>\d{2}):(?<min1>\d{2})-(?<hour2>\d{2}):(?<min2>\d{2})$/.exec(curTime)?.groups
			if(!groups || groups.hour1-0 > 23 || groups.hour2-0 > 23 || groups.min1-0 > 59 || groups.min2-0 > 59 || groups.hour1-0 > groups.hour2-0 || (groups.hour1-0 == groups.hour2-0 && groups.min1-0 >= groups.min2-0)) return true
		});
	}

	function modifyTime(times, startIdx) {
		return new Promise((res) => {

			//调出公交车道 时间面板
			let addBtn = [...[...document.querySelector('.main-center').querySelector('.box-container').querySelectorAll('.title')].find((item) => item.innerText.includes('时间限制')).parentElement.querySelectorAll('button')].find((item) => item.children[0].className.includes('el-icon-plus'))
			addBtn.click()
			res()
		}).then(() => {
			//选择工作日
			let timeSelector = document.querySelector('.time-selector')
			let timeInput = document.querySelector('.time-input')
			if(timeInput.value && vertifyTime(timeInput.value) && timeSelector.value != timeSelector.querySelectorAll('option').length-1) {
				[...document.querySelector('.clearfix').querySelector('.fl').children].at(-1).querySelectorAll('li')[timeSelector.value].click()
			} 
		}).then(() => {
				console.log(document.querySelector('.el-input.el-input--small.el-input--suffix').querySelector('input').value);
			[...document.querySelector('.clearfix').querySelector('.fl').children].at(-1).querySelector('.el-date-editor').click()

		}).then(() => {
			return new Promise((res) => {
				setTimeout(() => { //要等到第二个时间选择到23:00，不然会被重置
					let groups = /^(?<time1>\d{2}:\d{2})-(?<time2>\d{2}:\d{2})$/.exec(times[startIdx]).groups;
					let inputs = [...document.querySelector('.clearfix').querySelector('.fl').children].at(-1).querySelectorAll('input')

					inputs[1].value = groups.time1
					inputs[1].dispatchEvent(new Event('input'));
					inputs[1].dispatchEvent(new Event('change'));

					inputs[2].value = groups.time2
					inputs[2].dispatchEvent(new Event('input'));
					inputs[2].dispatchEvent(new Event('change'));

					if(startIdx !== times.length-1) {
						modifyTime(times, ++startIdx)
					} else {
						//最后一口气关闭，点击确定可能不会立即关闭，关闭的操作可能在下一轮事件循环。开一个关闭一个的做法会不可控。
						let allTimePicker = [...document.querySelectorAll('.el-time-range-picker')].filter((item) => item.style.display !== 'none');
						allTimePicker.forEach((time) => {[...time.querySelectorAll('button')].find(btn => btn.innerText.includes('确定')).click()});
					}
					res()
				})

			})

		})
	}


	async function findAnnotatedFrame(files, num, startframeNum, direction) {
		let frameGroup
		if(direction == 'forward') {
			if(startframeNum == files.length) return -1
			frameGroup = (files.length - startframeNum) / num >= 1 ? files.slice(startframeNum, startframeNum+num) : files.slice(startframeNum)

		} else if(direction == 'backward'){
			if(startframeNum == 0) return -1
            console.log(startframeNum, startframeNum-2 / num >= 1)
			frameGroup = (startframeNum-2) / num >= 1 ? files.slice(startframeNum-1-num, startframeNum-1).reverse() : files.slice(0, startframeNum-1).reverse()
		}
		console.log(frameGroup)
		return reqFrameGroup(frameGroup).then(async (allRes)=> {
			console.log(allRes)
			let foundFrame
			allRes.some((curRes) => {
				if(curRes.panel !== undefined && curRes.panel.length !== 0) {
					console.log(curRes)

					files.some((file, idx) => {
						if(file.url.includes(curRes.fileName)) {
							foundFrame = {
								num: idx+1,
								data: curRes
							}
							return 1
						}
					})
					return curRes
				}
			})
			if(foundFrame) {
				return foundFrame
			} else if(!stopFindAnnotateFrame && direction == 'forward' && (files.length - startframeNum) / num >= 1) {
				return await findAnnotatedFrame(files, num, startframeNum+num, direction)
			} else if(!stopFindAnnotateFrame && direction == 'backward' && (startframeNum-2) / num >= 1){
				return await findAnnotatedFrame(files, num, startframeNum-num, direction)
			} else {
				return -1
			}
		}, ()=> {
			console.log('某些请求失败')
		})
	}

	function reqFrameGroup(frames) {
		return Promise.all(frames.map((file) => {
			return new Promise((res, rej) => {
				fetch(`https://annotation-api.bettersmart.net/bs-task/mytasks/${/\marking-panel\/panel\/(.*)/.exec(location.pathname)[1]}/${file.fileId}`, {
					method: "GET",
					headers: new Headers({
						"Content-Type": "application/json",
						"user-token": document.cookie.split('; ').find(cookie => cookie.startsWith('user-token=')).split('=')[1]
					}),
				}).then(function(response) {
					if (response.ok) return response.json();
					throw new Error("Network response was not ok.");
				}).then(async function(data) {
					if(!data?.data?.data){
						console.log(`首id为${frames[0].fileId}的组中，${file.fileId}返回了非预期的数据结构，该组重新请求`)
						return rej()
					}
					res(JSON.parse(data.data.data))
				})
			})
		})).then(async (allRes)=> {
			console.log('请求组得到正常结果'+frames[0]?.fileId)
			return allRes
		}, async ()=> {
			console.log(`重新请求首id为${frames[0]?.fileId}的组`)
			return await reqFrameGroup(frames)
		})
	}


	document.body.addEventListener('keydown', (e) => {
		console.log(e.keyCode, e)
		//P键 快捷键暂时失效
		if(e.keyCode == 80) {
			isPause = !isPause
			return alert(isPause ? '快捷键已暂时失效' : '启用快捷键')
		}

		if(isPause) return

		//ESC键 取消标注帧查找
		if(e.keyCode == 27) {
			stopFindAnnotateFrame = 1
			findTip.textContent = '正在撤销...'
		}

		//【`键】和 【Shift+`】分别查看前后的标注帧
		if(!isPause && e.keyCode == 192) {
			fetch(`https://annotation-api.bettersmart.net/bs-task/mytasks/${/\marking-panel\/panel\/(.*)/.exec(location.pathname)[1]}`, {
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json",
					"user-token": document.cookie.split('; ').find(cookie => cookie.startsWith('user-token=')).split('=')[1]
				}),
			}).then(function(response) {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			}).then(async function(data) {
				findTip.style.display = 'block';
				findTip.textContent = e.shiftKey ? '反向查找中...':'正向查找中...'
				let files = data.data.files
				// console.log(files)
				let curFrameNum = /当前第\((.*)\/(.*)\)帧/.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1] - 0
				let allFrameNum = /当前第\((.*)\/(.*)\)帧/.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[2] - 0
				if(curFrameNum <= allFrameNum) {
					return await findAnnotatedFrame(files, 10, curFrameNum, e.shiftKey ? 'backward':'forward')
				} else if(curFrameNum > allFrameNum){
					alert('当前帧信息异常')
				}
			}).then((res) => { //找到则res.num为帧数，找不到返回 -1
				findTip.style.display = 'none'
				if(!stopFindAnnotateFrame && res !== -1) {
					tempFrame = /当前第\((.*)\//.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1]
					pageTurning(res.num)
				} else if(stopFindAnnotateFrame) {
					findTip.style.display = 'none'
					stopFindAnnotateFrame = 0
				} else {
					alert(`${e.shiftKey ? '后方':'前方'}未查找到标注帧`)
				}
			}).catch(() => {
				alert('taskdata获取失败')
			})
		}

		//【[】和【]】 分别控制向前或后 自动遍历图片帧
		if(!isPause && [219, 221].includes(e.keyCode)) {
			if(!isRead) {
				readInterval = setInterval(() => {
					document.querySelector(`.el-icon-arrow-${e.keyCode == 219 ? 'left' : 'right'}.arrow`).click()
				}, 1000)
				isRead = true
			}else {
				clearInterval(readInterval)
				isRead = false
			}
		}

		//Enter键 自动保存并提交
		if(!isPause && e.keyCode == 13) {
			if(!isSubmit && !confirm('确认自动阅览并提交？')) {
				return
			}
			isSubmit = !isSubmit;
			if(isSubmit) {
				setTimeout(() => {[...document.querySelector('.main').nextElementSibling.querySelectorAll('button')].find((curBtn) => curBtn.textContent.includes('提交任务')).click()})
			}
		}

		//X键
		if(!isPause && e.keyCode == 88) {
			if(taskId !== /\marking-panel\/panel\/(.*)/.exec(location.pathname)[1]) {
				initPreview = false
				imgWrap.innerHTML = '';
			}
			if(!initPreview) {
				let url = `https://annotation-api.bettersmart.net/bs-task/mytasks/${/\marking-panel\/panel\/(.*)/.exec(location.pathname)[1]}`;
				let type = "huawei";

				let headers = new Headers({
					"Content-Type": "application/json",
					"user-token": document.cookie.split('; ').find(cookie => cookie.startsWith('user-token=')).split('=')[1]
				});

				fetch(url, {
					method: "GET",
					headers: headers,
				}).then(function(response) {
					if (response.ok) {
						return response.json();
					}
					throw new Error("Network response was not ok.");
				}).then(function(data) {
					taskDataSet = data.data.files
					frameInfo.allFrameNum = data.data.files.length
					console.log('请求成功%o', data);
					taskDataSet.forEach((curFileObj, fileObjIdx) => {
						let data = JSON.stringify({ type: type, url:  curFileObj.url});

						fetch('https://annotation-api.bettersmart.net/bs-store/stores/urls/replace', {
							method: "POST",
							headers: headers,
							body: data
						}).then(function(response) {
							if (response.ok) {
								return response.json();
							}
							throw new Error("Network response was not ok.");
						}).then(function(data) {
							// console.log(data);
							taskDataSet[fileObjIdx].imgSrc = data.data

							let imgPanel = document.createElement('img');
							imgPanel.imgIdx = fileObjIdx
							imgPanel.src = taskDataSet[fileObjIdx].imgSrc
							imgPanel.style.display = fileObjIdx == 0 ? 'block' : 'none'
							if(fileObjIdx == 0) curImg = imgPanel;
							setStyleSheet(imgPanel, {
								width: '100%',
							})
							taskDataSet[fileObjIdx].imgDom = imgPanel

							imgWrap.innerHTML = (frameInfo.curFrameNum / frameInfo.allFrameNum).toFixed(2)
							frameInfo.curFrameNum++;

						}).catch(function(error) {
							console.log(`获取图片失败，url:${curFileObj.url}`, error.message);
						});
					})
				}).catch(function(error) {
					console.log("获取项目数据集失败", error.message);
				});

				let _curFrameNum = 0
				Object.defineProperty(frameInfo, 'curFrameNum', {
					get() {
						return _curFrameNum
					},
					set(val) {
						_curFrameNum = val

						if(_curFrameNum / frameInfo.allFrameNum === 1) {
							imgWrap.innerHTML = ''

							let imgWidth = 800, imgHeight = 450; // 图片点击放大初始尺寸参数
							let isPointerdown = false; //鼠标按下的标识
							let maxZoom = 8; //最大缩放倍数
							let minreduce = 0.5; // 最小缩放倍数

							taskDataSet.forEach((curFile, fileIdx) => {

								// if(fileIdx > 10) return
								imgWrap.append(curFile.imgDom)

								const image = curFile.imgDom;
								//记录鼠标按下坐标和按下移动时坐标
								let lastPointermove = {
									x: 0,
									y: 0,
								};
								//移动过程从上一个坐标到下一个坐标之间的差值
								let diff = {
									x: 0,
									y: 0,
								};
								//图片放大后左上角的坐标，主要结合diff参数用于鼠标焦点缩放时图片偏移坐标
								let x = 0;
								let y = 0;
								let initScale = 1; //滚动缩放初始倍数，并不是图片点击放大的倍数

								// let rect = image.getBoundingClientRect();
								// imgWidth = rect.width;
								// imgHeight = rect.height;

								// 监听鼠标滚动事件
								image.addEventListener("wheel", handleStopWheel, {
									passive: false,
								});
								// 拖转事件调用
								imgDrag(image);



								function handleStopWheel(e) {
									let itemSizeChange = 1.1; //每一次滚动放大的倍数
									// if (e.target.id == "bigimg") {
									// 说明：e.dataY如果大于0则表示鼠标向下滚动，反之则向上滚动，这里设计为向上滚动为缩小，向下滚动为放大
									if (e.deltaY > 0) {
										itemSizeChange = 1 / 1.1;
									}
									let _initScale = initScale * itemSizeChange;

									// 说明：在超过或低于临界值时，虽然让initScale等于maxZoom或minreduce，但是在后续的判断中放大图片的最终倍数并没有达到maxZoom或minreduce，而是跳过。
									if (_initScale > maxZoom) {
										initScale = maxZoom;
									} else if (_initScale < minreduce) {
										initScale = minreduce;
									} else {
										initScale = _initScale;
									}
									const origin = {
										x: (itemSizeChange - 1) * imgWidth * 0.5,
										y: (itemSizeChange - 1) * imgHeight * 0.5,
									};
									// 计算偏移量
									if (_initScale < maxZoom && _initScale > minreduce) {
										x -= (itemSizeChange - 1) * (e.clientX - x) - origin.x;
										y -= (itemSizeChange - 1) * (e.clientY - y) - origin.y;
										e.target.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${initScale})`;
									}
									// }

									// 阻止默认事件
									e.preventDefault();
								}

								function imgDrag(image) {
									// 绑定 鼠标按下事件
									image.addEventListener("pointerdown", pointerdown);
									// 绑定 鼠标移动事件
									image.addEventListener("pointermove", pointermove);
									image.addEventListener("pointerup", function (e) {
										if (isPointerdown) {
											isPointerdown = false;
										}
									});
									image.addEventListener("pointercancel", function (e) {
										if (isPointerdown) {
											isPointerdown = false;
										}
									});

									function pointerdown(e) {
										isPointerdown = true;
										console.log(e.pointerId)

										// 说明：Element.setPointerCapture()将特定元素指定为未来指针事件的捕获目标。指针的后续事件将以捕获元素为目标，直到捕获被释放。可以理解为：在窗口不是全屏情况下，我在拖动放大图片时即使鼠标移出可窗口之外，此时事件还是捕获在该放大图片上。
										image.setPointerCapture(e.pointerId);

										lastPointermove = {
											x: e.clientX,
											y: e.clientY,
										};
									}

									function pointermove(e) {
										if (isPointerdown) {
											const current1 = {
												x: e.clientX,
												y: e.clientY,
											};
											diff.x = current1.x - lastPointermove.x;
											diff.y = current1.y - lastPointermove.y;
											lastPointermove = {
												x: current1.x,
												y: current1.y,
											};
											x += diff.x;
											y += diff.y;
											image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${initScale})`;
										}
										e.preventDefault();
									}
								}
							})


							initPreview = true

						}
					}
				})
			}
			isShowPreviewImg = !isShowPreviewImg
			if(isShowPreviewImg) { //更新当前图片帧数
				previewInfo.innerText = `第${curImgIdx+1}帧${curImgIdx+1 == /当前第\((.*)\/(.*)\)帧/.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1]- 0 ? '(当前帧)' : ''}`
            }
			console.log(curImgIdx == /当前第\((.*)\/(.*)\)帧/.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1]- 0)
			previewBox.style.display = isShowPreviewImg ? 'block' : 'none'
		}

		//R 键 预览窗回到当前帧
		if(!isPause && e.keyCode == 82 && isShowPreviewImg) {
			let curFrameNum = /当前第\((.*)\//.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1]-0;
			curImg.style.display = 'none'
			curImg = taskDataSet[curFrameNum -1].imgDom
			curImg.style.display = 'block'
			curImgIdx = curImg.imgIdx
			previewInfo.innerText = `第${curImgIdx+1}帧${curImgIdx+1 == /当前第\((.*)\/(.*)\)帧/.exec(document.querySelector('.infoBox').querySelector('.info').textContent)[1]- 0 ? '(当前帧)' : ''}`
        }

		//【Q、W、E】分别选中【普通车道、公交车道、非机动车道】
		let selectLaneArr = [81, 87, 69]
		if(!isPause && selectLaneArr.includes(e.keyCode)) {
			new Promise((res) => {
				document.querySelector('.main-center').querySelector('.wrapper.item').children[1].querySelector('.uploadBox').children[selectLaneArr.indexOf(e.keyCode)].children[0].click()
				res()
			}).then((res)=> {
				let attrWrap = [...document.querySelector('.main-center').querySelector('.wrapper.item').querySelector('.wrapper').children][1]; //拿到方向，时间限制等属性项的wrap
				if(e.keyCode !== 69) { //选中非机动车道时，不选行驶方向
					[...attrWrap.children[0].querySelectorAll('input')].forEach((input, index) => {
						if(input.checked) { //如果没选中直行，则点击直行，如果选中了非直行的input，则点击取消
							setTimeout(input.click.bind(input))
						}
					})
					setTimeout(() => attrWrap.children[0].querySelectorAll('input')[1].click())

				}
				setTimeout(async ()=> {
					if(e.keyCode == 87) {
						//清除现有的组件
						let allClearBtns = [...[...document.querySelector('.main-center').querySelector('.box-container').querySelectorAll('.title')].find((item) => item.innerText.includes('时间限制')).parentElement.querySelectorAll('button')].filter((item) => item.children[0].className.includes('el-icon-minus'))
						allClearBtns.forEach((btn) => {
							allClearBtns[0].click()
						})
						
						let timeStr = document.querySelector('.time-input').value
						if(timeStr !== '' && vertifyTime(timeStr)) {
							modifyTime(timeStr.split(','), 0)
						} else if(timeStr !== '' && !vertifyTime(timeStr)) {
							alert('时间不合法')
						} else if(timeStr == '') {
							await modifyTime(['07:00-09:00'], 0)
							let timeComponent = document.querySelector('.el-date-editor.el-range-editor.el-input__inner.el-date-editor--timerange.el-range-editor--small')
							timeComponent.dispatchEvent(new MouseEvent('mouseenter'))
							timeComponent.querySelector('.el-input__icon.el-range__close-icon').click()
							//清除现有的组件
							let allClearBtns = [...[...document.querySelector('.main-center').querySelector('.box-container').querySelectorAll('.title')].find((item) => item.innerText.includes('时间限制')).parentElement.querySelectorAll('button')].filter((item) => item.children[0].className.includes('el-icon-minus'))
							allClearBtns.forEach((btn) => {
								allClearBtns[0].click()
							})
						}
					}

					setTimeout(() => {
						[...document.querySelector('.main').querySelector('.box-container').querySelectorAll('img')].find((curImg) => {
							if(curImg.src == drawPointImgSrc) return curImg
						}).click()
					}, 150)
				})

			})
		}

		//Y键 一键删除当前帧标注结果
		//ctrl y 删除当前帧最后一个标注结果
		if(!isPause && e.keyCode == 89 && e.ctrlKey) {
			if(!document.querySelector('.listScroll').querySelectorAll('.list').length) return showMessage('没有要删除的项', {type: 'warning'});
			[...document.querySelector('.listScroll').querySelectorAll('.list')].at(-1).querySelector('.box').click()
			document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 8 })); //注意：点击后紧接着退格才能删，分开操作删不了
		} else if(!isPause && e.keyCode == 89) {
			let timer = setInterval(() => {
				if(!document.querySelector('.listScroll').querySelectorAll('.list').length) return clearInterval(timer);
				document.querySelector('.listScroll').querySelectorAll('.list')[0].querySelector('.box').click()
				document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 8 })); //注意：点击后紧接着退格才能删，分开操作删不了
			})
			}

		//B键 返回最近看过的一帧
		if(!isPause && e.keyCode == 66) {
			pageTurning(tempFrame)
		}

		//ctrl+s 保存
		if(!isPause && e.keyCode == 83 && e.ctrlKey) {
			[...document.querySelector('.contain').querySelectorAll('button')].find(item => item?.textContent?.includes('保存')).click()
		}
	})

	function showMessage(message, config) { //type = 'default', showTime = 3000, direction
		let MessageWrap = document.createElement('div')
		MessageWrap.className = 'messageWrap'
		setStyleSheet(MessageWrap, {
			position: 'absolute',
			zIndex: '9999'
		})

		let MessageBox = document.createElement('div')
		MessageBox.innerText = message

		let closeBtn = document.createElement('div')
		closeBtn.textContent = '×'
		closeBtn.addEventListener('click', MessageBox.remove.bind(MessageBox)) //关闭消息提示

		setStyleSheet(MessageBox, {
			position: 'relative',
			minWidth: '200px',
			marginTop: '5px',
			padding: '6px 50px',
			lineHeight: '25px',
			backgroundColor: 'pink',
			textAlign: 'center',
			fontSize: '16px',
			//animation: 'frame 1s ease-in-out forwards',
			borderRadius: '5px',
			transition: 'all 1s'
		})

		setStyleSheet(closeBtn, {
			position: 'absolute',
			top: '-3px',
			right: '3px',
			width: '15px',
			height: '15px',
			zIndex: '999',
			fontWeight: '800',
			fontSize: '15px',
			borderRadius: '5px',
			cursor: 'pointer',
			userSelect: 'none'
		})
		//控制方向
		switch(config?.direction) {
			case 'top': setStyleSheet(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
			case 'top left': setStyleSheet(MessageWrap, {top: '1%', left: '.5%'}); break;
			case 'left': setStyleSheet(MessageWrap, {top: '50%', left: '1%', transform: 'translateY(-50%)'}); break;
			case 'top right': setStyleSheet(MessageWrap, {top: '1%', right: '.5%', }); break;
			case 'right': setStyleSheet(MessageWrap, {top: '50%', right: '.5%', transform: 'translateY(-50%)'}); break;
			case 'bottom': setStyleSheet(MessageWrap, {bottom: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
			case 'bottom left': setStyleSheet(MessageWrap, {bottom: '1%'}); break;
			case 'bottom right': setStyleSheet(MessageWrap, {bottom: '1%', right: '.5%'}); break;
			default: setStyleSheet(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
		}

		switch(config?.type) {
			case 'success': setStyleSheet(MessageBox, {border: '1.5px solid rgb(225, 243, 216)', backgroundColor: 'rgb(240, 249, 235)', color: 'rgb(103, 194, 58)'}); break;
			case 'warning': setStyleSheet(MessageBox, {border: '1.5px solid rgb(250, 236, 216)', backgroundColor: 'rgb(253, 246, 236)', color: 'rgb(230, 162, 60)'}); break;
			case 'error': setStyleSheet(MessageBox, {border: '1.5px solid rgb(253, 226, 226)', backgroundColor: 'rgb(254, 240, 240)', color: 'rgb(245, 108, 108)'}); break;
			default: setStyleSheet(MessageBox, {border: '1.5px solid rgba(202, 228, 255) ', backgroundColor: 'rgba(236, 245, 255)', color: 'rgb(64, 158, 255)'}); break;
		}

		MessageBox.appendChild(closeBtn)
		let oldMessageWrap = document.querySelector('.messageWrap')
		if(oldMessageWrap) {
			oldMessageWrap.appendChild(MessageBox)
		} else {
			MessageWrap.appendChild(MessageBox)
			document.body.appendChild(MessageWrap)
		}

		//控制消失
		let timer = setTimeout(() => {
			document.querySelector('.messageWrap').removeChild(MessageBox)
		}, (config?.showTime || 3000))

		//鼠标悬停时不清除，离开时重新计时
		MessageBox.addEventListener('mouseenter', () => clearTimeout(timer))
		MessageBox.addEventListener('mouseleave', () => {
			timer = setTimeout(() => {
				document.querySelector('.messageWrap').removeChild(MessageBox)
			}, (config?.showTime || 3000))
		})
	}


	/**
     * 修改元素的css样式
     * @param {ElementObj} element
     * @param {obj} styleSheetObj
     */
	function setStyleSheet(element, styleSheetObj) {
		for( let key in styleSheetObj ) {
			if(element.style[key] !== undefined) {
				element.style[key] = styleSheetObj[key]
			} else {
				//将key转为标准css属性名
				let formatKey = [...key].reduce((counter, curVal) => counter + (curVal !== curVal.toUpperCase() ? curVal : `-${curVal.toLowerCase()}`), '')
				console.warn(`不存在${formatKey}这个CSS属性`)
			}
		}
	}

	/**
日志：
2023/11/20
- 新增：快捷键【Q、W、E】分别选中【普通车道、公交车道、非机动车道】的标注（并附加默认信息）
- 新增：当标注了公交车道后，自动选中车道占位符的标注

2023/11/21
- 适配：正式服
- 修复：选中点击相同类型的车提示无法标注
- 新增：一键删除当前帧标注结果

2023/11/22
- 新增：【ctrl+y】删除当前帧下的最后一项标注
- 新增：【P键】快捷键失效/生效
- 新增：【B键】选中可拖拽
- 新增：【ctrl+s】保存当前帧数据

2023/11/22
- 修复：快捷键【Q、W、E】
- 新增：快捷键【Enter】自动跳转未查看的帧并提交（再按一次取消）

2023/12/13
- 调整：换项目后自动停止自动保存
- 新增：【<】自动向前遍历帧，【> 或 空格】自动向后遍历帧
- 新增： 预览窗口新增返回（可返回跳转前的一帧）
- 新增：快捷键【`】和【Shift + `】向道路前方或后方查看最近的标注帧
- 调整：快捷键【B】调整为返回最近看过的一帧

2023/12/18
- 修复：W键标注公交车后自动选择摩托车的问题
- 调整：控制向前或后自动遍历图片帧的快捷键 由原来的 【<】和【空格或>】改为 【[】和【]】
- 新增：【ESC】中断标注帧查找
- 调整：预览窗口样式

2023/12/19
- 修改：【W】撤销input输入框的默认值，新增自动设置时间功能

2023/12/20
- 优化：标注帧查找性能

2024/1/2
- 新增：时间输入框不填时，可以选中公交车标注

2024/1/3
- 修复：标注公交车道但有时间，自动选中疑问
- 新增：工作日输入框选择公交车道工作日
- 新增：预览窗口提示当前帧

2024/1/4
- 修复：逆向查找标注帧的跳帧问题
*/
})();