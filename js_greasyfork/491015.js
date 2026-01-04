// ==UserScript==
// @name       曼孚点云连续帧(Dev)
// @namespace    http://tampermonkey.net/
// @version      2024.4.28.1 Dev
// @description  try to take over the world!
// @author       You
// @match        https://label.mindflow.com.cn/pointCloudPro?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mindflow.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491015/%E6%9B%BC%E5%AD%9A%E7%82%B9%E4%BA%91%E8%BF%9E%E7%BB%AD%E5%B8%A7%28Dev%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491015/%E6%9B%BC%E5%AD%9A%E7%82%B9%E4%BA%91%E8%BF%9E%E7%BB%AD%E5%B8%A7%28Dev%29.meta.js
// ==/UserScript==


/**==================================

键盘快捷键：
【Tab】      ==>  三视图被放大时，切换三视图；三视图没被放大时，调出个体属性面板
【`】        ==>  向后一帧
【空格】     ==>  向前一帧
【Z】        ==>  向上旋转视角（shift ↑）
【X】        ==>  向下旋转视角（shift ↓）


鼠标快捷键：
- 右键：
  - 缩放三视图
  - 缩放映射图
- 中键：
  - 还原三视图缩放比

自动生效：
- 收起映射图抽屉时，C1映射图自动抽离，展开时自动收回

==================================**/

(async function() {
	'use strict';
	window.$ = Document.prototype.$ = Element.prototype.$ = $
	window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$

    var ds = {
        isAutoKeyT: 0,
        objListObserver: null,
    }

	if(!await init()) return console.log('init fail')

	Observe($('.main'), (mrs) => {
		mrs.forEach((mr) => {
			[...mr.addedNodes].some((an) => {
				if(an.className === 'hotkey-bar-wrapper' && ['三视图微调', '快速放大/缩小视角'].some(text => an.innerText.includes(text))) an.$('.icon-annotation-close').click()
			})
		})
	}, {childList: true, subtree: true})


	let vps = $$('.viewport-bottom .box-wrapper');
	vps.some((vp) => {
		clickTrigger(vp, () => {
			vp.$('.box-scale-icon').click()
		}, 3, 5)
	});
	
	$$('.el-scrollbar__view .x-image-mapping').forEach(view => {
		clickTrigger(view, () => {
			view.$('.icon-annotation-blow-up,.icon-annotation-blow-down').click()
		}, 3, 5)

        clickTrigger(view, (e) => {
            if(e.target.classList?.contains('upper-canvas')) view.$('.icon-annotation-refresh').click()
        }, 2, 0)
	})
	
	let objListBtn = $('.drawer').nextElementSibling.$('.operate-item.el-tooltip__trigger')
	if(!objListBtn.className.includes('selected')) objListBtn.click()
	

//     let tip = document.createElement('div')
//     setElStyle(tip, {
//         margin: '0 0px 0 35px',
//         fontSize: '13px'
//     })
//     let modeWrap = $('.annotation-mode')
//     if(modeWrap.textContent.includes('标注')) {
//         let tips = $$('.pull-frame-wrapper .tool-wrapper .tool-name').map((item, idx) => `${(++idx)}.${item.textContent}`).slice(1)
//         tip.innerHTML = tips.reduce((counter, tip, idx) => (counter+=`${tip}${idx !== tips.length-1 ? '&nbsp;'.repeat(2) : '' }`), '')
//     }

//     $('.header__left').appendChild(tip)

	const scrollbar = $('.map-wrapper .el-scrollbar__view')
	const newWrap = document.createElement('div')
	newWrap.className = 'suspend-image-mapping'
	const mappingImgWrap = $('.x-image-mapping')
	setElStyle(newWrap, {
		marginLeft: '80px',
		width: '400px',
	})


	$('.mf-resize-container').appendChild(newWrap)
	Observe($('.left-wrapper'), (mrs) => {
		mrs.forEach(mr => {
			if(['left-wrapper', 'left-hide'].every(item => mr.target.classList.contains(item))) {
				newWrap.style.width = `${ mappingImgWrap.getBoundingClientRect().width }px`
				newWrap.appendChild(mappingImgWrap)
			}
			if(mr.oldValue === 'left-wrapper left-hide') {
				scrollbar.appendChild(mappingImgWrap)
			}
		})
	}, { childList: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})

    let selectedObj = null


    createSwitch()



	window.addEventListener('keydown', (e) => {
		console.log(e.keyCode, e)


		//【Tab】
		if(e.keyCode == 9) {
			e.preventDefault();
			let [vpTop, vpFront, vpLeft] = vps;
			let vpSequence = [vpTop, vpLeft, vpFront]

			let isBlow = vpSequence.some((vp, idx) => {
				//判断是否存在三视图放大状态
				if(vp.className.includes('transform-active')) {
					// console.log('当前处于放大', vp)
					//收起当前视图
					vp.$('.box-scale-icon.box-blow-down').click()
					//放大下一个视图
					let nextVp = vpSequence[idx !== 2 ? ++idx : 0]
					nextVp.dispatchEvent( new Event('mousedown') );
					setTimeout(() => { nextVp.$('.box-scale-icon.box-blow-up').click() })

					return true
				}
			})

			let modeWrap = $('.annotation-mode')
			if(!isBlow ) {
				if(!$('.attribute-container') && modeWrap && ( modeWrap.textContent.includes('标注') || modeWrap.$('.el-switch').classList.contains('is-checked'))) {
					$('.engraving-container .modify-attribute').click()
				} else if(modeWrap && modeWrap.textContent.includes('审核') && !modeWrap.$('.el-switch').classList.contains('is-checked')) {
					// focusTarget()
				}
			}
		}

        // 【Z】向上旋转视角（shift ↑）
        if(e.keyCode === 90 && !e.ctrlKey && !e.shifKey) {
            const e = { key: "ArrowUp", keyCode: 38, shiftKey: true, bubbles: true }
            document.body.dispatchEvent(new KeyboardEvent("keydown", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 16, bubbles: true }))
        }

        // 【X】向下旋转视角（shift ↓）
        if(e.keyCode === 88 && !e.ctrlKey && !e.shifKey) {
            const e = { key: "ArrowDown", keyCode: 40, shiftKey: true, bubbles: true }
            document.body.dispatchEvent(new KeyboardEvent("keydown", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 16, bubbles: true }))
        }

        // 【空格】
        if(e.keyCode === 32) {
            $('.pull-frame-item.select').click()
            let e = { key: "d", keyCode: 68, altKey: true, bubbles: true }
            document.body.dispatchEvent(new KeyboardEvent("keydown", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 18, bubbles: true }))

        }

        if(e.keyCode === 192) {
            $('.pull-frame-item.select').click()
            let e = { key: "a", keyCode: 65, altKey: true, bubbles: true }
            document.body.dispatchEvent(new KeyboardEvent("keydown", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", e))
            document.body.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 18, bubbles: true }))

        }
	})


	function clickTrigger(el, fn, button, moveThreshold = 0) {
		let movement = 0
		let allowTrigger = false
		let isRightdown = false

		el.addEventListener('mousedown', (e)=>{
			e.preventDefault()
			if(e.which !== button) return
			movement = 0
			isRightdown = true
			allowTrigger = true
		})
		el.addEventListener('mousemove', (e)=>{
			if(!isRightdown || (isRightdown && (movement+=(Math.sqrt(e.movementX**2 + e.movementY**2))) <= moveThreshold)) return

			allowTrigger && (allowTrigger = false)
		})
		el.addEventListener('mouseup', (e)=>{
			if(e.which !== button) return
			if(allowTrigger) fn(e)
			isRightdown = false
		})
	}

	function init() {
		const initObserveList = [
			'.show-attribute-container',
		]

		return new Promise((res, rej) => {
			let observer = new MutationObserver((mrs) => {
				mrs.some((mr) => {
					if(mr.type == 'attributes' && mr.target.className === 'task-load-panel' && mr.target.style.display === 'none') res((true))
					
					Array.from(mr.addedNodes).some(an => {
						if(an.classList?.contains('image-mapping-wrapper')) {
                            let btn_refresh = an.$('.icon-annotation-refresh')
                            let btn_scale = an.$('.icon-annotation-blow-up,.icon-annotation-blow-down')
							clickTrigger(an, btn_scale.click.bind(btn_scale), 3, 5)

                            clickTrigger(an, (e) => { if(e.target.classList?.contains('upper-canvas')) btn_refresh.click() }, 2, 0)

							if($('.left-wrapper.left-hide')) {
								$('.suspend-image-mapping').style.visibility = 'hidden'
							}
						}
					})
					
					Array.from(mr.removedNodes).some(rn => {
						if(rn.classList?.contains('image-mapping-wrapper')) {
							if($('.left-wrapper.left-hide')) {
								$('.suspend-image-mapping').style.visibility = null
							}
						}
					})
					
				})
			});
			observer.observe(document.body, { childList: true, subtree: true, attributes: true })
		})
	}

      function createSwitch() {
          const div = document.createElement('div')
          $('.paly-control').insertAdjacentElement('beforeend', div)

          div.outerHTML = `
      <div class="switch-container" title="切花个体时，自动触发T键">
        <span class="toggler"></span>
      </div>
      <style>
        .switch-container {
          display: flex;
          margin-top: 1px;
        }
        .switch-container span {
          cursor: pointer;
        }
        .switch-container .toggler {
          position: relative;
          height: 13px;
          width: 24px;
          border-radius: 50px;
          background: #fff3;
          transition: all .2s linear;
        }
        .switch-container .toggler::before{
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background: #fff;
          transition: all .2s linear;
        }
        .switch-container.active .toggler::before {
          left: 13px;
        }
        .switch-container.active .toggler{
          background-color: #9166ff;
        }
      </style>
    `
          const switchWrap = document.querySelector('.switch-container')
          const autoKeyT = localStorage.getItem('autoKeyT')
          if(!autoKeyT) {
              localStorage.setItem('autoKeyT', 0)
          } else if(Number(autoKeyT) === 1) {
              switchWrap.classList.toggle('active', true)
              ds.isAutoKeyT = 1
              ds.objListObserver = observeObjList() //尝试直接监控对象列表
          }

          switchWrap.onclick = () => {
              switchWrap.classList.toggle('active')
              const isActive = switchWrap.classList.contains('active')
              localStorage.setItem('autoKeyT', isActive ? 1 : 0)

              if(isActive) {
                  let selectedObj = null
                  ds.isAutoKeyT = true
                  ds.objListObserver = observeObjList() //尝试直接监控对象列表

              } else {
                  ds.objListObserver?.disconnect()
                  ds.isAutoKeyT = false

              }
          }

          let isRemoveObjList
          let allowTrigger = false
          let cancelTimer = null
          let lastExpand = void 0

          Observe($('.drawer'), (mrs) => {
              // console.log('drawer', mrs);
              mrs.some((mr) => {
                  [...mr.removedNodes].some((rn) => {
                      if(rn.className === 'object-list') {
                          isRemoveObjList = true
                          ds.objListObserver.disconnect()
                      }
                  });

                  [...mr.addedNodes].some((an) => {
                      if(ds.isAutoKeyT && isRemoveObjList !== false && an.className === 'object-list') {
                          ds.objListObserver = observeObjList()
                          isRemoveObjList = false
                      }
                  })
              })

          }, {childList: true});


          function observeObjList() {
              let objectList = document.querySelector('.object-list')
              if(!objectList) return null
              let objListObserver = new MutationObserver((mrs) => {
                  //console.log('=====', mrs)
                  mrs.some((mr) => {
                      if(mr.type !== 'attributes') return

                      if(selectedObj !== mr.target.parentNode.parentNode && mr.target.className.includes('el-icon el-tree-node__expand-icon expanded')) {
                          //刚打开对象列表的某个分类时，个体已选中，需要手动的获取一次选中个体
                          if(mr.target.nextElementSibling?.textContent?.includes('#')) {
                              selectedObj = mr.target.parentNode.parentNode
                              // console.log('artificial select', selectedObj)

                              if(allowTrigger && lastExpand !== 'id') {
                                  triggerT()
                                  clearTimeout(cancelTimer)
                                  cancelTimer = null
                                  allowTrigger = false
                              } else if(lastExpand !== 'id'){
                                  allowTrigger = true
                                  cancelTimer = setTimeout(() => {
                                      triggerT()
                                      allowTrigger = false;
                                      lastExpand = void 0
                                  }, 300)
                              }
                              lastExpand = 'id'

                          } else {
                              // console.log('type expanded', mr.target) //切换个体时，分类箭头也会响应
                              setTimeout(() => {
                                  selectedObj = $('.el-tree-node.is-expanded.object-item')
                              })

                              if(allowTrigger && lastExpand !== 'type') {
                                  triggerT()
                                  clearTimeout(cancelTimer)
                                  cancelTimer = null
                                  allowTrigger = false
                              } else if(lastExpand !== 'type') {
                                  allowTrigger = true
                                  cancelTimer = setTimeout(() => {
                                      allowTrigger = false
                                      lastExpand = void 0
                                  }, 300)
                              }
                              lastExpand = 'type'

                          }

                          function triggerT() {
                              setTimeout(() => {
                                  // console.log('trigger T')
                                  document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "t", keyCode: 84, bubbles: true }))
                              }, 300)
                          }

                      }
                  })
              })
              objListObserver.observe(objectList, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})
              return objListObserver
          }
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
		return id ? _this.getElementById(id) : _this.querySelector(sel)
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

})();

/**
日志：
2024/3/27：
- 新增：鼠标右键缩放三视图
- 新增：收起映射图抽屉时，C1映射图自动抽离，展开时自动收回
- 新增：【Tab】三视图被放大时，切换三视图；三视图没被放大时，调出个体属性面板
- 新增：【`】向后一帧
- 新增：【空格】向前一帧
- 新增：【Z】向上旋转视角（shift ↑）
- 新增：【X】向下旋转视角（shift ↓）

2024/3/28：
- 修复：脚本快捷键引起的平台shift快捷键失效问题。
- 优化：标注分类的提示内容动态生成。

2024/4/2
- 新增：映射图右键缩放

2024/4/5
- 新增：双击映射图还原缩放比
- 优化：映射图脱离抽屉时，放大后隐藏

2024/4/6
- 新增：自动触发T键

2024/4/7
- 完善：自动触发T键（个体箭头展开时，非重复个体则展开；个体箭头和类型箭头同时不同序展开时，触发T）

2024/4/28
- 调整：移除标注大类的序号类别提示。
**/