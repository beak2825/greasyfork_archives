// ==UserScript==
// @name         百特YC（Dev）
// @namespace    http://tampermonkey.net/
// @version      2024.5.11.1 Dev
// @description  try to take over the world!
// @author       You
// @match        https://ap.inceptio.cn/*
// @icon         https://ap.inceptio.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492057/%E7%99%BE%E7%89%B9YC%EF%BC%88Dev%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/492057/%E7%99%BE%E7%89%B9YC%EF%BC%88Dev%EF%BC%89.meta.js
// ==/UserScript==

(async function() {
	window.$ = Document.prototype.$ = Element.prototype.$ = $
	window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$
	
	let isLabeling = /\/labeling\/(\d*)\/pcd/.test(location.pathname)
	
    function _pushState() {
		let origin = history.pushState
		return function() {
			origin.apply(this, arguments);
			console.log('pushState');
			if(/\/labeling\/(\d*)\/pcd/.test(location.pathname)) location.reload()
		};
	};
	function _replaceState() {
		let origin = history.replaceState
		return function() {
			origin.apply(this, arguments);
			console.log('replaceState')
		};
	};
	
	history.pushState = _pushState();
	history.replaceState = _replaceState();
	
	if(!isLabeling) return
	
	var _ds = {
		boxData: [],
		curFrameNum: void 0,
		trackId_frameNum: void 0,
		isPasteInNextFrame: false,
		isOpenCountPanel: false,
		initKeyW: false,
        initKeyR: false,
		curSelId: void 0,
		isTriggerKeyD: false,
		maintainSelId: void 0,
		associateId: [],
		isTrace: false,
		isHideTypeSel: false,
		saveSeleItemList: [],
		isUnifySize: false,
		isMagnify: false,
	}
	window._ds = _ds
	
	
	const originalXHR = window.XMLHttpRequest;
	const baseURL = 'https://ap-api.inceptio.tech/v1'
	window.XMLHttpRequest = function () {
		const xhr = new originalXHR();

		xhr.addEventListener('readystatechange', () => {
			if(xhr.readyState !== 4 || xhr.status !== 200) return

			let url = xhr.responseURL
			url = url.includes('?') ? /^(.*)\?/.exec(url)[1] : url

			if(url === `${baseURL}/frames/annotation`) {
				const res = JSON.parse(xhr.responseText)
				fetch(`https://ap-api.inceptio.tech/v1/tasks/${+/labeling\/(\d*)\/pcd/.exec(location.pathname)[1]}`, {
					"headers": {
						"accept": "application/json, text/plain, */*",
						"authorization": `Bearer ${localStorage.getItem('accessToken')}`},
					"method": "GET",
				}).then(resp => resp.json())
					.then(res => {
					const allFramesData = res.beats
                    $('#info-batchId').textContent = `批次ID: ${res.batchId}`
                    $('#info-taskId').textContent = `任务ID: ${res.id}`


					const boxData = allFramesData.map(item => {
						let itemList = item.frames.find(item => item.deviceId === 'MERGED_LIDAR').annotation
						return itemList !== '' ? JSON.parse(itemList) : void 0

					})
					_ds.boxData = boxData
					// console.log(boxData)
					let count = boxData.reduce((counter, item, idx) => {
						return (counter+= (item !== void 0 ? item.result.elements.length : 0))
					}, 0)

					let omissiveCount = 0
					let mistakeCount = 0

					boxData.forEach((item, idx) => {
						if(item === void 0) return
						omissiveCount+=item.result.missedMarks.length

						item.result.elements.forEach((el) => {
							if(el.errors?.length) {
								++mistakeCount
							}
						})
					})
					// console.log(mistakeCount)

					let tbodyStr = boxData.reduce((counter, item, idx) => {
						return (counter += `
						  <tr>
    						<td>${++idx}</td>
						    <td>${item !== void 0 ? item.result.elements.length : 0}</td>
						  </tr>`)
					}, '')

					$('.count-container').innerHTML = `
						  <table style="margin: auto; width: 100px">
						    <thead>
						    <tr>
						      <th>帧号</th>
						      <th>框数</th>
						    </tr>
						  </thead>
						  <tbody>
						    ${tbodyStr}
						  </tbody>
						  </table>`

					$('#count-3D').textContent = `总数: ${count}`
					$('#accuracy-rating').textContent = `准确率: ${(((count-omissiveCount-mistakeCount)/count)*100).toFixed(2)}%`
					$('#accuracy-rating').title = `错误：${mistakeCount}  漏标：${omissiveCount}`
				})
			}

		});
		return xhr;
	};
	
	await init()
	
	const mappingImgWrap = $('.label-tool_workspace__images__rU-W2')
	
	$('.common_canvas-wrapper__LF832').style.transition = '.3s all'
	
	$$('.helplines-container').forEach((item, idx) => {
		clickTrigger(item, e=> {
				mappingImgWrap.style.display = !_ds.isMagnify ? 'none' : null
				setElStyle($('.label-tool_workspace__hRa91'), {
					width: !_ds.isMagnify ? '300%' : '100%',
					height: !_ds.isMagnify ? '300%' : '100%'
				})
				setTimeout(() => {item.scrollIntoView()}, 200)
				_ds.isMagnify = !_ds.isMagnify
		}, 2, 2)
	})
	
	
	_ds.swi = true
	$$('.helplines-box').forEach(borderLine => { borderLine.style.outline = '0px' })
	$$('.helplines-rect, .helplines-line').forEach(operator => {
		operator.style.opacity = '0.6'
		
		operator.addEventListener('mousedown', (e)=> {
			$$('.helplines-box').forEach(borderLine => {
				borderLine.style.outline = '1px dashed aqua'
			})
		})
		operator.addEventListener('mouseup', (e)=> {
			$$('.helplines-box').forEach(borderLine => {
				borderLine.style.outline = '0px'
			})
		})
	})

    const pointViewCanvas = $('.common_canvas-wrapper__LF832 canvas')
	setElStyle(pointViewCanvas, {
		filter: 'contrast(1.6) brightness(0.95)',
		transition: '.3s all',
	})
    document.onmouseup = (e)=> {
		const tar = e.target
		if(e.button == 1 && tar.matches('canvas') && ['common_canvas-wrapper', 'common_image-tool-wrapper'].find(cla => tar?.parentElement?.className.includes(cla))) {
			document.body.dispatchEvent(new KeyboardEvent('keyup', {code: 'Backspace', keyCode: 8, bubbles: true})) 
		}	
	}

    const annotationInfoWrap = document.createElement('div')

    const batchIdDiv = document.createElement('div')
    const taskIdDiv = document.createElement('div')
    const countBoxDiv = document.createElement('div')
    const countAccuracyRating = document.createElement('div')
    batchIdDiv.id = 'info-batchId'
    taskIdDiv.id = 'info-taskId'
    countBoxDiv.id = 'count-3D'
    countAccuracyRating.id = 'accuracy-rating'
    setElStyle(new Map([[
        annotationInfoWrap, {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            left: '60%',
        },
    ], [[batchIdDiv, taskIdDiv, countBoxDiv, countAccuracyRating], {
        marginRight: '10px',
    }], [[countBoxDiv, countAccuracyRating], {
        color: '#b37feb',
        fontSize: '16px',
        fontWeight: '700',
    }], [countBoxDiv, {
        marginLeft: '10px',
        cursor: 'pointer',
    }]]))
    countBoxDiv.onclick = () => {
        $('.count-panel').style.display = 'block'
    }

    annotationInfoWrap.append(batchIdDiv, taskIdDiv, countBoxDiv, countAccuracyRating)
    $('.common_controls__JVcfu').insertAdjacentElement('afterend', annotationInfoWrap)

	initCountPanel()

	
	
	function initCountPanel() {

		const countPanel = document.createElement('div')
		const openBtn = document.createElement('div')
		const closeBtn = document.createElement('div')
		const container = document.createElement('div')
		
		countPanel.className = 'count-panel'
		container.className = 'count-container'
		openBtn.textContent = '框数统计'
		closeBtn.textContent = '×'

		setElStyle(new Map([
			[countPanel, {
				display: 'none',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '280px',
				height: '350px',
				padding: '35px 15px 15px',
				background: 'rgb(34, 34, 37, .8)',
				textAlign: 'center',
				borderRadius: '5px',
				zIndex: 999,
			}],[closeBtn, {
				position: 'absolute',
				top: '8px',
				right: '8px',
				width: '25px',
				height: '25px',
				lineHeight: '21px',
				borderRadius: '5px',
				background: 'gray',
				cursor: 'pointer',
				textAlign: 'center',
				fontSize: '28px',
				color: '#ccc',

			}],
			[container, {
				overflow: 'auto',
				width: '100%',
				height: '300px',
				color: '#fff',
			}]
		]))

		closeBtn.onclick = () => {
			if(_ds.isOpenCountPanel) return
			_ds.isOpenCountPanel = false
			countPanel.style.display = 'none'

		}

		countPanel.append(container, closeBtn)
		document.body.appendChild(countPanel)
	}


	
	async function init() {
		return new Promise((res) => {
			Observe(document.body, (mrs)=> {
				mrs.forEach(mr => {
					// console.log('=======', mr)
					Array.from(mr.addedNodes).forEach(an => {
						// console.log('an', an)
							if(an?.matches?.('.inceptio-modal-root')) {
								Observe(an, (mrs) => {
									mrs.forEach((mr) => {
										if(mr.target.matches('.inceptio-modal-wrap') && !mr.target.style.display && _ds.isUnifySize) unifySize()
									})
								}, {childList: true, subtree: true, attributes: true, attributeFilter: ['style']})
								
								if( _ds.isUnifySize) unifySize()
								
								function unifySize() {
									_ds.isUnifySize = false
									
									const operationMap = {
										'框体大小': (formItem) => { if(!formItem.$('.inceptio-checkbox').matches('.inceptio-checkbox-checked')) formItem.$('input[type="checkbox"]').click() },
										'操作': (formItem) => formItem.$('input[value="update"]').click(),
										'起始帧': (formItem) => setInputValue(formItem.$('input'), 1),
										'结束帧': (formItem) => { 
											formItem.scrollIntoView({behavior: 'smooth', block: 'start'})
											setInputValue(formItem.$('input'), getFrameNum())
										},
									}
									
									for( const k in operationMap) {
										an.$$('.inceptio-form-item').some(formItem => { if(formItem.textContent.includes(k)) operationMap[k](formItem) })
									}
									an.$$('.inceptio-modal-footer button').find(btn => btn.textContent.includes('确 定')).click()
								}
							}
						
						if(an?.children?.[0]?.matches('.inceptio-popover') && an.textContent.includes('选择继承帧')) {
							const popover = an.children[0]
                            const btn_wrap = document.createElement('div')
							const btn_saveSeleItems = document.createElement('div')
							const btn_restoreSeleItems = document.createElement('div')
							const btn_clearSeleItems = document.createElement('div')
							btn_saveSeleItems.id = 'save-sele-items'
							btn_saveSeleItems.textContent = '复用'
							btn_restoreSeleItems.textContent = '还原'
							btn_clearSeleItems.textContent = '重置'
							setElStyle(new Map([
                                [btn_wrap, {
                                    display: 'flex',
                                }],
                                [[btn_saveSeleItems, btn_restoreSeleItems, btn_clearSeleItems], {
                                    width: '40px',
                                    height: '24px',
                                    marginRight: '5px',
                                    padding: '0 7px',
                                    lineHeight: '24px',
                                    border: '1px solid #9066c9',
                                    borderRadius: '2px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: '#9066c9',
                                }]]))
							btn_saveSeleItems.onclick = ()=> {
								_ds.saveSeleItemList = []

                                popover.$$('.inceptio-checkbox-wrapper').forEach(checkBoxWrap => {
                                    if(checkBoxWrap.matches('.inceptio-checkbox-wrapper-checked')) _ds.saveSeleItemList.push(checkBoxWrap.$('span.inceptio-typography').textContent)
                                })

							}
                            btn_restoreSeleItems.onclick = ()=> {
                                _ds.saveSeleItemList.forEach(item => {
                                    popover.$$('.inceptio-checkbox-wrapper').some(checkBoxWrap => {
                                        if(checkBoxWrap.$('span.inceptio-typography').textContent === item) {
                                            if(!checkBoxWrap.matches('.inceptio-checkbox-wrapper-checked')) checkBoxWrap.$('input[type="checkbox"]').click()
                                            return true
                                        }
                                    })
                                })

                            }
                            btn_clearSeleItems.onclick = () => {
                                popover.$$('.inceptio-checkbox-wrapper').forEach(checkBoxWrap => {
                                    if(checkBoxWrap.matches('.inceptio-checkbox-wrapper-checked')) checkBoxWrap.$('input[type="checkbox"]').click()
                                })
                            }
                            btn_wrap.append(btn_saveSeleItems, btn_restoreSeleItems, btn_clearSeleItems)
							$$('.inceptio-space-item').find(item => item.textContent.includes('确 定')).append(btn_wrap)
							
							
							selPreviousFrame()
							
							Observe(popover, (mrs)=> {
								mrs.forEach(mr => {
									if(mr.target.className === 'inceptio-popover inceptio-popover-placement-top ') {
										
										selPreviousFrame()
									}
								})
							}, {childList: true, attributes: true, attributeFilter: ['class']})
							
						}
						
						if(an.matches?.('.inceptio-drawer') && an.textContent?.startsWith('任务信息')) {
							if(_ds.isTriggerKeyD) an.style.visibility = 'hidden'

							if(_ds.isTrace) {
								const curFrameItems = an.$$('.inceptio-collapse .inceptio-collapse-item')
								curFrameItems.forEach(item => {
									const id = +item.$('.inceptio-typography')?.textContent
									if(id && _ds.maintainSelId == id) item.children[0].click()
								})
								_ds.isTrace = false
							}
							
							
							Observe(an.$('.inceptio-tabs'), mrs => {
								console.log('======')
								mrs.forEach(mr => {
									mr.addedNodes.forEach(an => {
										console.log('an', an)
										let idx_error = void 0
										$$('.inceptio-tabs-nav .inceptio-tabs-tab').some((tab, idx) => {
											if(tab.textContent.includes('错标')) { return ((idx_error = idx), true) }
										})
										if(idx_error !== void 0 && an.parentElement.matches('.inceptio-tabs-tabpane') && new RegExp(`panel-${idx_error+1}`).test(an.parentElement.id)) {
											Observe(an, mrs => {
												mrs.some(mr => {
													console.log(mr.target, mr.oldValue)
													if(mr.type === 'attributes' && mr.target.matches('.inceptio-collapse-item-active')) {
														_ds.maintainSelId = +mr.target.$('.inceptio-typography').textContent
													}
												})
											}, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})
										}
									})
								})
							}, {childList: true, subtree: true})
							
							const curFrameBlurItems = an.$$('.inceptio-collapse .inceptio-collapse-item:not(.inceptio-collapse-item-active)')
							let allTrackId = []
							_ds.boxData.forEach((curFrameData, idx) => {
							    if(curFrameData === void 0) return
								if(idx+1 !== getCurFrameNum()) {
									
									const boxs = curFrameData.result.elements
								    boxs.forEach(box => {
								        allTrackId.push(Number(box.attribute.track_id))
								    })
								} else {
									// console.log('本帧', idx+1)
									curFrameBlurItems.forEach(item => {
									    const idWrap = item.$('.inceptio-typography')
									    if(!idWrap) return
									    allTrackId.push(Number(idWrap.textContent))
									})
								}
							    
							})
							// console.log(allTrackId)
							let numSet = new Set(allTrackId)
							let sortIds = Array.from(numSet).sort((a, b) => a-b)
							
							function getOmissiveId(sortIds) {
							    let skipId = void 0
							    // console.log(sortIds)
							    sortIds.some((id, idx) => {
									return id == idx+1 ? false : ((skipId = idx == 0 ? 1 : sortIds[idx-1]+1), true)
							    })
							    return skipId ? skipId : undefined
							}
							let continuedId = sortIds.at(-1)+1

							_ds.associateId = [getOmissiveId(sortIds), continuedId].filter(num => !isNaN(num))
							


                            const input_id = $('#attribute_track_id')
							
                            if(input_id && !input_id.value) {
								const associateIdWrap = document.createElement('div')
								associateIdWrap.id = 'associateId-wrap'
								setElStyle(associateIdWrap, {
									display: 'flex',
									marginTop: '5px',
								})
                                _ds.associateId.forEach(id => {
                                    const div = document.createElement('div')
                                    div.textContent = id
                                    setElStyle(div, {
                                        height: '20px',
										marginRight: '5px',
                                        padding: '0 5px',
                                        lineHeight: '20px',
										color: '#fff',
										textAlign: 'center',
                                        borderRadius: '5px',
										cursor: 'pointer',
										background: '#9066c9',
                                    })
                                    div.onclick = () => {
                                        const input = $('#attribute_track_id')
                                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
                                        nativeInputValueSetter.call(input, id)
                                        input.dispatchEvent(new Event('input', { bubbles: true }))

                                    }
									associateIdWrap.appendChild(div)
                                })
                                $('#associateId-wrap')?.remove()
								$$('.inceptio-form-item').find(item => item.textContent.includes('追踪编号')).insertAdjacentElement('beforeend', associateIdWrap)

                            }




							// setTimeout(() => (an.style.visibility = ''), 300)
							if(_ds.isTriggerKeyD) {
								document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'd', keyCode: 68, ctrlKey: true, bubbles: true}))
								_ds.isTriggerKeyD = false
								
							}
						}
						
						if(an.matches?.('.inceptio-form-item') && an.innerText?.includes('追踪编号') && an?.parentElement?.parentElement?.parentElement?.textContent.startsWith('配置标签对象')) {
                            trigerKeyD()
							obsTrackIdValue($('#attribute_track_id'))
						}
						
						if(an?.children?.[0]?.matches?.('.inceptio-select-dropdown') && an.textContent.includes('乘用车') && _ds.isHideTypeSel === true) {
							an.style.visibility = 'hidden'
							const typeWrap = document.createElement('div')
							typeWrap.id = 'type-wrap'
							setElStyle(typeWrap, {
								display: 'flex',
								marginTop: '5px'
							})
							const typeMap = {
								'乘用车': '乘', 
								'拖车/挂车': '拖', 
								'厢式货车': '厢',
								'卡车': '卡',
								'特种车辆': '特',
								'行人': '人',
								'面包车': '面',
								'电瓶车': '电',
							}
							for(const k in typeMap) {
								const typeItem = document.createElement('div')
								typeItem.className = 'type-item'
								typeItem.typeName = k
								setElStyle(typeItem, {
									height: '20px',
									padding: '0px 5px',
									lineHeight: '20px',
									marginRight: '5px',
									background: 'pink',
									borderRadius: '6px',
									cursor: 'pointer',
									textAlign: 'center',
									background: '#9066c9',
									color: '#fff',
                                    fontSize: '13px',
								})
								typeItem.textContent = typeMap[k]
								typeItem.title = k
								
								typeWrap.appendChild(typeItem)
							}
							typeWrap.onclick = async function(e) {
								if( e.target.className !== 'type-item') return
								const typeItem = await findType(e.target.typeName)
								typeItem.click()
								
								const input = $('#attribute_track_id')
								input && ['', input.value].forEach(item => setInputValue(input, item))
							}
							async function findType(typeName) {
								return new Promise((res) => {
									const typeSelector = $$('.inceptio-select-selector').find(sel => {
										return new Array(5).fill(1).reduce((counter, item) => (counter = counter?.parentElement), sel).innerText.startsWith('选择标签')
									})

									typeSelector.dispatchEvent(new MouseEvent('mousedown', { bubbles: true}))
									
									
									const allType = an.$$('.inceptio-select-item')
									let findRes = allType.find(type => type.textContent.includes(typeName))
									if(findRes) {
										res(findRes)
									}
                                    if(!findRes) {
										setTimeout(() => {
                                            $$('.rc-virtual-list .inceptio-select-item').at(0).scrollIntoView(false)

                                        }, 300)
										setTimeout(() => {
											const allType = $$('.rc-virtual-list .inceptio-select-item')
											let findRes = allType.find(type => type.textContent.includes(typeName))
                                            if(findRes) {
                                                res(findRes)

                                            } else {
                                                if(!findRes) {
                                                    $$('.rc-virtual-list .inceptio-select-item').at(-1).scrollIntoView(true)
                                                    setTimeout(() => {
                                                        const allType = $$('.rc-virtual-list .inceptio-select-item')
                                                        let findRes = allType.find(type => type.textContent.includes(typeName))
                                                        res(findRes)
                                                    }, 200)
                                                }

                                            }

										}, 400)
										
									}

									
								})
							}
							$$('.inceptio-card').find(item => item.textContent.includes('配置标签对象')).$$('.inceptio-form-item').find(item => item.textContent.includes('选择标签'))?.insertAdjacentElement('beforeend', typeWrap)
							
							$$('.inceptio-select-selector').find(sel => {
								return new Array(5).fill(1).reduce((counter, item) => (counter = counter?.parentElement), sel).innerText.startsWith('选择标签')
							}).dispatchEvent(new MouseEvent('mousedown', { bubbles: true}))
							setTimeout( () => {
                                an.style.visibility = null

//                                 //容错
//                                 if(!an.children[0].matches('.inceptio-select-dropdown-hidden')) {
//                                     $$('.inceptio-select-selector').find(sel => {
//                                         return new Array(5).fill(1).reduce((counter, item) => (counter = counter?.parentElement), sel).innerText.startsWith('选择标签')
//                                     }).dispatchEvent(new MouseEvent('mousedown', { bubbles: true}))
//                                 }
                            }, 300)
							
							
							_ds.isHideTypeSel = false
						}
						
						if(an.innerText?.startsWith('配置标签对象')) {
							an.$('.inceptio-card-body').style.maxHeight = 'none'
							document.body.dispatchEvent(new KeyboardEvent('keyup', {key: 'c', keyCode: 67, ctrlKey: true, bubbles: true}))
							
							const typeSelector = $$('.inceptio-select-selector').find(sel => {
								return new Array(5).fill(1).reduce((counter, item) => (counter = counter?.parentElement), sel).innerText.startsWith('选择标签')
							})
							
							typeSelector.dispatchEvent(new MouseEvent('mousedown', { bubbles: true}))
							_ds.isHideTypeSel = true


                            trigerKeyD()
							
							const btn_unifySize = document.createElement('div')
							btn_unifySize.innerText = '统一尺寸'
							setElStyle(btn_unifySize, {
								display: 'inline-block',
								marginLeft: '15px',
								width: '70px',
								height: '22px',
								lineHeight: '22px',
								background: '#9066c9',
								borderRadius: '3px',
								textAlign: 'center',
								color: '#fff',
								cursor: 'pointer',
							})
							btn_unifySize.onclick = () => {
								getAttrPanel()?.$$('button').find(btn => btn.textContent.includes('批量修改')).click()
								_ds.isUnifySize = true
								setTimeout(() => { if(!$$('.inceptio-modal').find((modal) => modal.textContent.startsWith('批量修改标注数据'))) _ds.isUnifySize = false }, 1500)
							}
							an.$('.inceptio-card-body').appendChild(btn_unifySize)
							

                            $('#attribute_track_id') && obsTrackIdValue($('#attribute_track_id'))
							
						}
						
						if(an?.children?.[0]?.matches('.inceptio-popover') && an.textContent.includes('工具箱') && (_ds.initKeyW || _ds.initKeyR)) {
                            an.style.visibility = 'hidden'
							$$('.common_footer__NrP79 button').find(btn => btn.innerText.includes('更多工具')).dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
                            setTimeout(() => { an.style.visibility = 'visible' }, 300)
							if(_ds.initKeyR) (document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'r', keyCode: 82, bubbles: true})), (_ds.initKeyR = false))
							if(_ds.initKeyT) (document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 't', keyCode: 84, bubbles: true})), (_ds.initKeyW = false))

						}
						
						if(an.matches?.('.inceptio-spin')) {
							if(an.innerText.includes('资源加载') && !_ds.isInitFinish) {
                                res()
                                document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 's', keyCode: 83, ctrlKey: true, bubbles: true}))
                                _ds.isInitFinish = true
                            }
							
						}
						if(an.classList?.contains('inceptio-message-notice') && an.innerText.includes('Element Copied')) {
							an.$('.inceptio-message-notice-content').style.background = 'transparent'
							_ds.maintainSelId = +$('#attribute_track_id')?.value
							_ds.trackId_frameNum = getCurFrameNum()
						}

						if(an.classList?.contains('common_label-editor__sxQWG') && _ds.maintainSelId !== void 0) {
							const input = $('#attribute_track_id')
							if(input?.value || _ds.trackId_frameNum === getCurFrameNum()) return
							const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
							nativeInputValueSetter.call(input, _ds.maintainSelId);

							input.dispatchEvent(new Event('input', { bubbles: true }))
						}
					})

					Array.from(mr.removedNodes).forEach(rn => {
						// console.log('rn', rn)
						if(rn.matches?.('.inceptio-card')) {
							_ds.curSelId = void 0
						}
					})
					if(mr.type === 'characterData' && /第.*帧/.test(mr.target.nodeValue)) {
                        const oldFrameNum = _ds.curFrameNum
                        _ds.curFrameNum = getCurFrameNum()
                        if(oldFrameNum !== void 0 && !(oldFrameNum+1 == _ds.curFrameNum || oldFrameNum-1 == _ds.curFrameNum)) showMessage('注意：跨帧', {type: 'warning', direction: 'bottom8'})
						let viewport = $('canvas[data-engine^="three.js"]');
						viewport && ['mousedown', 'mouseup'].forEach(type => viewport.dispatchEvent(new MouseEvent(type, {bubbles: true})))

						setTimeout(() => { _ds.isPasteInNextFrame && (document.body.dispatchEvent(new KeyboardEvent('keyup', {key: 'v', keyCode: 86, ctrlKey: true, bubbles: true})), _ds.isPasteInNextFrame = false) }, 1000)
						
						let taskDataDrawer = $$('.inceptio-drawer').find(item => item.textContent.startsWith('任务信息'))
						if(_ds.maintainSelId && !taskDataDrawer) {
							_ds.isTrace = true
							document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'd', keyCode: 68, ctrlKey: true, bubbles: true}))
							_ds.isTriggerKeyD = true
						} else if(taskDataDrawer){
							_ds.isTrace = true
							const curFrameItems = taskDataDrawer.$$('.inceptio-collapse:first-child .inceptio-collapse-item')
							curFrameItems.forEach(item => {
								const id = +item.$('.inceptio-typography')?.textContent
								if(id && _ds.maintainSelId == id) item.children[0].click()
							})
						}
						
						
						$$('.inceptio-popover').find(item => item.textContent.startsWith('选择继承帧')) && selPreviousFrame()
						
						
					}
				})
			}, { childList: true, subtree: true, characterData: true, characterDataOldValue: true})

            function obsTrackIdValue(el) {
                Observe(el, (mrs)=> {
                    mrs.forEach(mr => {
                        if(mr.type === "attributes" && mr.attributeName === 'value') {
                            _ds.maintainSelId = _ds.curSelId = mr.target.value

                            if(!mr.target.value) {
                                // console.log('生成联想id')
								setTimeout(() => {
									$$('.inceptio-form-item-margin-offset').find(item => item?.previousElementSibling?.textContent.startsWith('追踪编号')).style.marginBottom = '-10px'
									trigerKeyD()
								}, 300) 
                            } else {
                                $('#associateId-wrap')?.remove()
                            }
                        }
                    })
                }, {childList: true, attributes: true, attributeFilter: ['value']})
            }

			function trigerKeyD() {
                let taskDataDrawer = $$('.inceptio-drawer').find(item => item.textContent.startsWith('任务信息'))
                if(!taskDataDrawer) {
                    document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'd', keyCode: 68, ctrlKey: true, bubbles: true}))
                    _ds.isTriggerKeyD = true
                }
            }
			
			function selPreviousFrame() {
				const allFrameBtn = $$('.inceptio-popover').find(item => item.textContent.startsWith('选择继承帧'))?.$$('button')
				const previousFrame = allFrameBtn?.find(btn => {
					return Number(/第(\d*)帧/.exec(btn.textContent)[1]) === getCurFrameNum()-1
				})
				previousFrame.click()
				previousFrame.scrollIntoView(true)
			}
		})
	}
	
	
	window.addEventListener('keydown', (e)=> {
		// console.log(e.keyCode, e)
		if(['input', 'textarea'].find(lab => document.activeElement?.matches(lab))) return
		
		if(e.keyCode === 192) {
			const btn_mapping = $$('.inceptio-card').find(card => card.textContent.startsWith('配置标签对象')).$$('button').find(btn => btn.textContent.startsWith('投影2D框'))
			btn_mapping && (btn_mapping.click(), showMessage('映射2D', {showTime: 1500}))
		}
		
		if([69, 81].some(item => e.keyCode === item) && e.altKey) _ds.isPasteInNextFrame = true
		
		if(e.keyCode === 82) {
			const toolPopover = $$('.inceptio-popover').find(item => item.textContent.includes('工具箱'))
			if(toolPopover) {
				toolPopover.$$('button').find(btn => /(隐藏|显示)视角/.test(btn.textContent)).click()
			} else {
				_ds.initKeyR = true
				$$('.common_footer__NrP79 button').find(btn => btn.innerText.includes('更多工具')).dispatchEvent(new MouseEvent('mouseover', {bubbles: true}))
			}
		}

        if(e.keyCode === 84) {
			const toolPopover = $$('.inceptio-popover').find(item => item.textContent.includes('工具箱'))
			if(toolPopover) {
				const btn = toolPopover.$$('button').find(btn => /缩放/.test(btn.textContent))
                btn.click()
                showMessage(`${btn.matches('.inceptio-switch-checked') ? '开启' : '取消'}：保持缩放`)
			} else {
				_ds.initKeyT = true
				$$('.common_footer__NrP79 button').find(btn => btn.innerText.includes('更多工具')).dispatchEvent(new MouseEvent('mouseover', {bubbles: true}))
			}
		}
		
		if(e.keyCode === 32) {
			$$('.helplines-rect-center').forEach(operator => {
				operator.style.width = '100%'
				operator.style.height = '100%'
			})
		}
		if(e.keyCode === 66) {
			_ds.maintainSelId = void 0
			showMessage('追踪id已置空')
			getAttrPanel()?.$('span[aria-label="close"]').click()
		}
		
		if(e.keyCode === 9) {
			e.preventDefault()
			const canvas = $('.common_canvas-wrapper__LF832 canvas')
			canvas.style.filter = `contrast(1.6) brightness(${ getBrightness() === '0.95' ? '3' : '0.95' })`
			
			function getBrightness() {
				return /brightness\((.*)\)/.exec(canvas.style.filter)[1]
			}


		}


        const rotationMap = {
            49: () => document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', keyCode: 37, bubbles: true})),
            50: () => document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', keyCode: 39, bubbles: true})),
            16: () => document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', keyCode: 38, bubbles: true})),
        }

        for(const k in rotationMap) {
            if(e.keyCode === +k) rotationMap[k]()
        }

        const mappingImgMap = {
            104: 'obstacle',
            100: '左鱼',
            102: '右鱼',
            97: '左后',
            99: '右后',
        }
        for(const k in mappingImgMap) {
            if(e.keyCode === +k) {
                const mappingImgWrap = $$('.common_image-tool-wrapper__XJoSV').find(imgWrap => imgWrap.$('.common_device-name__SXbZy').textContent.includes(mappingImgMap[k]))
                mappingImgWrap.scrollIntoView({behavior: 'instant', inline: 'center'})
                $$('.common_device-name__SXbZy').forEach(label => {
                    if(label.textContent.includes(mappingImgMap[k])) {
                        label.style.background = '#9254de'
                        label.parentElement.style.border = '2px solid #9254de'
                        setTimeout(() => {
                            label.style.background = label.parentElement.style.border = null
                        }, 1000)
                    } else {
						label.style.background = label.parentElement.style.border = null

                    }
                })
            }
        }

	})
	
	document.addEventListener('keyup', e => {
		$$('.helplines-rect-center').forEach(operator => {
			operator.style.width = null
			operator.style.height = null
		})
	})

	
	function getAttrPanel() {
		return $$('.inceptio-card').find(card => card.textContent.startsWith('配置标签对象'))
	}
	
	function setInputValue(input, value) {
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
		nativeInputValueSetter.call(input, value)
		input.dispatchEvent(new Event('input', { bubbles: true }))
	}
	
	function Observe(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
		const ob = new MutationObserver(callBack);
		ob.observe(target, options);
		return ob
	}

	function $(selector) {
		const _this = Element.prototype.isPrototypeOf(this) ? this : document
		const sel = String(selector).trim();

		const id = /^#([^ +>~\[:]*)$/.exec(sel)?.[1]
		return (id && _this === document) ? _this.getElementById(id) : _this.querySelector(sel)
	}

	function $$(selector) {
		const _this = Element.prototype.isPrototypeOf(this) ? this : document
		return Array.from(_this.querySelectorAll(selector))
	}

	function setElStyle() {
		[[Map, ()=> {
			const styleMap = arguments[0]
			for (const [el, styleObj] of styleMap) {
				!Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach((el) => setStyleObj(el, styleObj))
			}
		}], [Element, () => {
			const [el, styleObj] = arguments
			setStyleObj(el, styleObj)
		}], [Array, () => {
			const [els, styleObj] = arguments
			els.forEach((el) => setStyleObj(el, styleObj))
		}]].some(([O, fn]) => O.prototype.isPrototypeOf(arguments[0]) ? (fn(), true) : false)

		function setStyleObj(el, styleObj) {
			for (const attr in styleObj) {
				if (el.style[attr] !== undefined) {
					el.style[attr] = styleObj[attr]
				} else {
					//将key转为标准css属性名
					const formatAttr = attr.replace(/[A-Z]/, match => `-${match.toLowerCase()}`)
					console.error(el, `的 ${formatAttr} CSS属性设置失败!`)
				}
			}
		}
	}
	
	function getCurFrameNum() {
		return +/第(\d*)\//.exec($('.common_footer__NrP79').innerText)[1]
	}
	
	function getFrameNum() {
		return +/第.*\/(\d*)帧/.exec($('.common_footer__NrP79').innerText)[1]
	}
	
	/**
     * @description 展示消息框
     * @param {string} message 展示内容
     * @param {object} [config] 配置对象
     * @param {string} [config.type='default'] 内容类型（可选值：'default'、'success'、'warning'、'error'）
     * @param {number} [showTime=3000] 展示时间
     * @param {string} [direction='top'] 展示的位置（可选值：'top'、'top left'、'left'、'top right'、'right'、'center'、'bottom'、'bottom left'、'bottom right'）
     * @return {void}
     */
	function showMessage(message, config) { //type = 'default', showTime = 3000, direction
		let oldMessageWrap = document.querySelector(`.messageWrap-${config?.direction ? config.direction : 'top'}`)

		let MessageWrap
        if(!oldMessageWrap) {
            MessageWrap = document.createElement('div')
            MessageWrap.className = 'messageWrap'
            setElStyle(MessageWrap, {
                position: 'absolute',
                zIndex: '9999'
            })
        } else {
            MessageWrap = oldMessageWrap
        }

		let MessageBox = document.createElement('div')
		MessageBox.innerText = message

		let closeBtn = document.createElement('div')
		closeBtn.textContent = '×'
		closeBtn.addEventListener('click', MessageBox.remove.bind(MessageBox)) //关闭消息提示

		setElStyle(MessageBox, {
			position: 'relative',
			minWidth: '200px',
			marginTop: '5px',
			padding: '6px 50px',
			lineHeight: '25px',
			backgroundColor: 'pink',
			textAlign: 'center',
			fontSize: '16px',
			borderRadius: '5px',
			transition: 'all 1s'
		})

		setElStyle(closeBtn, {
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
			case 'top': setElStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
			case 'top left': setElStyle(MessageWrap, {top: '1%', left: '.5%'}); break;
			case 'left': setElStyle(MessageWrap, {top: '50%', left: '1%', transform: 'translateY(-50%)'}); break;
			case 'top right': setElStyle(MessageWrap, {top: '1%', right: '.5%', }); break;
			case 'right': setElStyle(MessageWrap, {top: '50%', right: '.5%', transform: 'translateY(-50%)'}); break;
			case 'center': setElStyle(MessageWrap, {top: '20%', left: '50%', transform: 'translate(-50%, -50%)'}); break;
			case 'bottom': setElStyle(MessageWrap, {bottom: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
			case 'bottom8': setElStyle(MessageWrap, {bottom: '8%', left: '50%', transform: 'translate(-50%, -50%)'}); break;
			case 'bottom left': setElStyle(MessageWrap, {bottom: '1%'}); break;
			case 'bottom right': setElStyle(MessageWrap, {bottom: '1%', right: '.5%'}); break;
			default: setElStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
		}

		switch(config?.type) {
			case 'success': setElStyle(MessageBox, {border: '1.5px solid rgb(225, 243, 216)', backgroundColor: 'rgb(240, 249, 235)', color: 'rgb(103, 194, 58)'}); break;
			case 'warning': setElStyle(MessageBox, {border: '1.5px solid rgb(250, 236, 216)', backgroundColor: 'rgb(253, 246, 236)', color: 'rgb(230, 162, 60)'}); break;
			case 'error': setElStyle(MessageBox, {border: '1.5px solid rgb(253, 226, 226)', backgroundColor: 'rgb(254, 240, 240)', color: 'rgb(245, 108, 108)'}); break;
			default: setElStyle(MessageBox, {border: '1.5px solid rgba(202, 228, 255) ', backgroundColor: 'rgba(236, 245, 255)', color: 'rgb(64, 158, 255)'}); break;
		}

		MessageBox.appendChild(closeBtn)
		if(oldMessageWrap) {
			oldMessageWrap.appendChild(MessageBox)
		} else {
			MessageWrap.appendChild(MessageBox)
			document.body.appendChild(MessageWrap)
		}
		let ani = MessageBox.animate([
			{
				transform: "translate(0, -100%)" ,
				opacity: 0.3,
			},
			{
				transform: "translate(0, 18px)",
				opacity: 0.7,
				offset: 0.9,
			},
			{
				transform: "translate(0, 15px)",
				opacity: 1,
				offset: 1,
			},
		], {
			duration: 300,
			fill: 'forwards',
			easing: 'ease-out',
		})

		//控制消失
		let timer = setTimeout(() => {
			ani.onfinish = () => {
				MessageBox.remove()
			}
			ani.reverse()
		}, (config?.showTime || 3000))

		//鼠标悬停时不清除，离开时重新计时
		MessageBox.addEventListener('mouseenter', () => clearTimeout(timer))
		MessageBox.addEventListener('mouseleave', () => {
			timer = setTimeout(() => {
				ani.reverse()
				ani.onfinish = () => {
					MessageBox.remove()
				}
			}, (config?.showTime || 3000))
		})
	}
	
	function clickTrigger(el, fn, button, moveThreshold = 0) {
		let movement = 0
		let allowTrigger = false
		let isRightdown = false

		el.addEventListener('mousedown', (e)=>{
			e.preventDefault()
			if(e.button !== button) return
			movement = 0
			isRightdown = true
			allowTrigger = true
		})
		el.addEventListener('mousemove', (e)=>{
			if(!isRightdown || (isRightdown && (movement+=(Math.sqrt(e.movementX**2 + e.movementY**2))) <= moveThreshold)) return

			allowTrigger && (allowTrigger = false)
		})
		el.addEventListener('mouseup', (e)=>{
			if(e.button !== button) return
			if(allowTrigger) fn(e)
			isRightdown = false
		})
	}
})();


/*
日志：
2024/4/8
- 新增：点击复制
- 新增：切帧后自动聚焦点云视图
- 新增：【Alt Q/E】切帧并粘贴3D框
- 新增：粘贴后复制 id

2024/4/9
- 新增：标注量统计

2024/4/15
- 新增：标注量统计详情
- 新增：【W】切换/隐藏 映射图
- 新增：【`】点云主视图背景色切换
- 优化：三视图的辅助线显示逻辑，淡化尺寸框遮罩

2024/4/16
- 新增：正确率统计
- 新增：同id追踪

2024/4/17
- 新增：框体类型快捷选择
- 新增：id联想
- 新增：弹出继承帧气泡框时，自动定位到当前帧的上帧
- 新增：【Tab】点云色彩增强

2024/4/18
- 新增：【Shift】车体180度旋转
- 新增：【1】逆时针旋转航向角
- 新增：【2】顺时针旋转航向角
- 新增：【空格】置空追踪的 id。切帧后不会再选中上一帧选中的 id
- 新增：【R】开启/关闭 保持缩放
- 新增：数字小键盘 切换映射图（8:前60度  4:左  6:右  1:左后  3:右后）
- 新增：鼠标中键删除个体框
- 新增：跨帧警告

2024/4/20
- 优化：聚焦textarea和input输入框时，快捷键失效
- 修复：不追踪错误列表中选中的个体id的问题

2024/4/21
- 移除：【`】键点云图背景色反转
- 新增：【`】映射2D框

2024/4/22
- 新增：鼠标中键删除2D框
- 新增：【空格】放大拖动操控点
- 新增：三视图右键缩放
- 新增：foot栏 新增 批次ID、任务ID

2024/4/23
- 优化：修改类型导致id重置，而input框内容不重置的问题

2024/5/11
- 调整：跨帧提示消息框位置
- 调整：显隐映射图【W】→【R】
- 调整：映射图继承缩放比【R】→【T】
*/