// ==UserScript==
// @name         PDD商品上架复制小能手
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.2.1
// @description  复制自己已有的其他商品的配置，填到表单里
// @author       windeng
// @match        https://mms.pinduoduo.com/goods/category
// @match        https://mms.pinduoduo.com/goods/goods_add/index*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/420542/PDD%E5%95%86%E5%93%81%E4%B8%8A%E6%9E%B6%E5%A4%8D%E5%88%B6%E5%B0%8F%E8%83%BD%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420542/PDD%E5%95%86%E5%93%81%E4%B8%8A%E6%9E%B6%E5%A4%8D%E5%88%B6%E5%B0%8F%E8%83%BD%E6%89%8B.meta.js
// ==/UserScript==

function InputValue(dom, st) {
  var evt = new InputEvent('input', {
    inputType: 'insertText',
    data: st,
    dataTransfer: null,
    isComposing: false
  });
  dom.value = st;
  dom.dispatchEvent(evt);
}

function InputValueReact(dom, st) {
    let lastValue = dom.value;
    dom.value = st;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = dom._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    dom.dispatchEvent(event);
}

function DoWithInterval(funcList, sleepSecs) {
    sleepSecs = sleepSecs || 1
    let funcIndex = 0
    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            if (funcIndex >= funcList.length) {
                clearInterval(interval)
                resolve()
                return
            }
            funcList[funcIndex]()
            funcIndex++
        }, sleepSecs * 1000)
    })
}

function DoAndWait(func, sleepSecs) {
    return new Promise((resolve, reject) => {
        sleepSecs = sleepSecs || 1
        let res = func()
        setTimeout(() => {
            resolve(res)
        }, sleepSecs * 1000)
    })
}

function WaitUntil(conditionFunc, sleepSecs) {
    sleepSecs = sleepSecs || 1
    return new Promise((resolve, reject) => {
        if (conditionFunc()) resolve()
        let interval = setInterval(() => {
            if (conditionFunc()) {
                clearInterval(interval)
                resolve()
            }
        }, sleepSecs * 1000)
    })
}

// GM_xmlhttpRequest
function Request(url, opt={}) {
	Object.assign(opt, {
		url,
		timeout: 2000,
		responseType: 'json'
	})

	return new Promise((resolve, reject) => {
		/*
		for (let f of ['onerror', 'ontimeout'])
			opt[f] = reject
		*/

		opt.onerror = opt.ontimeout = reject
		opt.onload = resolve

		GM_xmlhttpRequest(opt)
	}).then(res => {
        if (res.status === 200) return Promise.resolve(res.response)
        else return Promise.reject(res)
    }, err => {
        return Promise.reject(err)
    })
}

function Get(url, opt={}) {
    Object.assign(opt, {
        method: 'GET'
    })
    return Request(url, opt)
}

function Post(url, opt={}) {
    Object.assign(opt, {
        method: 'POST'
    })
    return Request(url, opt)
}

function InsertInputBeforeMain(callback) {
    let mainElem = document.querySelector('main')
    let firstChild = mainElem.children[0]
    let inputText = document.createElement('input')
    inputText.setAttribute('id', 'goods-add-id')
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('placeholder', '已有货物在上架页的ID')
    inputText.style.setProperty('border', '1px solid')
    inputText.style.setProperty('padding', '2px 5px')
    inputText.style.setProperty('margin', '20px')
    inputText.value = '57986986499'
    mainElem.insertBefore(inputText, firstChild)

    let btn = document.createElement('button')
    btn.innerText = '复制他'
    btn.onclick = () => {
        let value = document.querySelector('#goods-add-id').value
        callback(value)
    }
    mainElem.insertBefore(btn, firstChild)
}

function InsertTextArea() { // 用来放那两个json，方便跨店复制
    let mainElem = document.querySelector('main')
    let firstChild = mainElem.children[0]
    let detailText = document.createElement('textarea')
    detailText.setAttribute('id', 'detail-textarea')
    detailText.setAttribute('rows', '4')
    detailText.setAttribute('cols', '30')
    detailText.style.setProperty('border', '1px solid')
    detailText.style.setProperty('padding', '2px 5px')
    detailText.style.setProperty('margin', '20px')
    detailText.setAttribute('placeholder', '/glide/v2/mms/query/commit/detail/${goodsAddId}')
    mainElem.insertBefore(detailText, firstChild)

    let propText = document.createElement('textarea')
    propText.setAttribute('id', 'prop-textarea')
    propText.setAttribute('rows', '4')
    propText.setAttribute('cols', '30')
    propText.style.setProperty('border', '1px solid')
    propText.style.setProperty('padding', '2px 5px')
    propText.style.setProperty('margin', '20px')
    propText.setAttribute('placeholder', '/draco-ms/mms/goods-property/${goodsId}')
    mainElem.insertBefore(propText, firstChild)
}

function GetGoodsAddDetail(goodsAddId) {
    let offlineElem = document.querySelector('#detail-textarea')
    if (offlineElem.value.trim()) {
        return new Promise((resolve, reject) => {
            resolve(JSON.parse(offlineElem.value.trim()))
        })
    }
    return Get(`https://mms.pinduoduo.com/glide/v2/mms/query/commit/detail/${goodsAddId}`).then(res => {
        offlineElem.value = JSON.stringify(res)
        return res
    })
}

function GetGoodsProperty(goodsId) {
    let offlineElem = document.querySelector('#prop-textarea')
    if (offlineElem.value.trim()) {
        return new Promise((resolve, reject) => {
            resolve(JSON.parse(offlineElem.value.trim()))
        })
    }
    return Get(`https://mms.pinduoduo.com/draco-ms/mms/goods-property/${goodsId}`).then(res => {
        offlineElem.value = JSON.stringify(res)
        return res
    })
}

function FillCategory(res) {
    let cats = res.result.cats
    if (cats.length >= 1) {
        let aList = document.querySelector('input[placeholder="一级分类: 名称检索"]').parentElement.nextElementSibling.getElementsByTagName('a')
        for (let i=0; i<aList.length; ++i) {
            let nameElem = aList[i].querySelector('.c-name')
            if (!nameElem) continue
            if (nameElem.innerText.trim() == cats[0].trim()) {
                aList[i].click()
            }
        }
    }
    if (cats.length >= 2) {
        setTimeout(() => {
            let aList = document.querySelector('input[placeholder="二级分类: 名称检索"]').parentElement.nextElementSibling.getElementsByTagName('a')
            for (let i=0; i<aList.length; ++i) {
                let nameElem = aList[i].querySelector('.c-name')
                if (!nameElem) continue
                if (nameElem.innerText.trim() == cats[1].trim()) {
                    aList[i].click()
                }
            }

            if (cats.length >= 3) {
                setTimeout(() => {
                    let aList = document.querySelector('input[placeholder="三级分类: 名称检索"]').parentElement.nextElementSibling.getElementsByTagName('a')
                    for (let i=0; i<aList.length; ++i) {
                        let nameElem = aList[i].querySelector('.c-name')
                        if (!nameElem) continue
                        if (nameElem.innerText.trim() == cats[2].trim()) {
                            aList[i].click()
                        }
                    }
                }, 200)
            }
        }, 200)
    }
}

function FillDetail(detail, goodsProp) {
    console.log('FillDetail start', detail, goodsProp)
    // console.log(`$('span:contains("产地")')`, $('span:contains("产地")'))

    // document.querySelector('#goods_name').value = detail.result.goods_name
    InputValueReact(document.querySelector('#goods_name'), detail.result.goods_name)

    let ScrollAndSelect = (name, scrollElem, scrollStep, scrollY) => {
        scrollY = scrollY || 0
        return new Promise((resolve, reject) => {
            if (!scrollElem) resolve(false)
            let scrollHeight = scrollElem.scrollHeight
            if (scrollY > scrollHeight) resolve(false)
            // console.log('scrollY', name, scrollY, scrollElem)
            scrollElem.scroll(0, scrollY)
            setTimeout(() => {
                let ok = false
                let liList = document.querySelectorAll('ul[role="listbox"] li')
                for (let i=0; i<liList.length; ++i) {
                    if (liList[i].innerText.trim() === name.trim()) {
                        console.log('找到目标选项', name)
                        liList[i].click()
                        ok = true
                        resolve(true)
                        break
                    }
                }
                resolve(ok)
            }, 50)
        }).then(ok => {
            if(!ok && scrollY <= scrollElem.scrollHeight) {
                return ScrollAndSelect(name, scrollElem, scrollStep, scrollY + scrollStep)
            } else {
                return ok
            }
        })
    }
    let SelectInListBox = (inputElem, name, scrollElemSelector) => {
        inputElem.click()
        setTimeout(() => {
            console.log('SelectInListBox', inputElem, name, scrollElemSelector)
            scrollElemSelector = scrollElemSelector || 'ul[role="listbox"]>div'
            let scrollElem = document.querySelector(scrollElemSelector)
            let scrollStep = 150
            ScrollAndSelect(name, scrollElem, scrollStep).then(ok => {
                if (!ok) document.querySelector('body').click()
            })
        }, 100)
    }

    let SetProps = () => {
        let GetLabelElem = (label) => {
            let elems = document.querySelectorAll('.goods-propertys label')
            for (let i=0; i<elems.length; ++i) {
                if (elems[i].innerText.trim().search(label.trim()) !== -1) return elems[i]
            }
        }
        let funcList = []
        goodsProp.result[0].properties.forEach(prop => {
            funcList.push(() => {
                let labelElem = GetLabelElem(prop.name)
                if (!labelElem) {
                    console.log('找不到label', prop.name)
                    return
                }
                let inputElem = labelElem.parentNode.querySelector('input')
                // inputElem.click()
                // InputValue(inputElem, prop.values[0].value)
                // inputElem.value = prop.values[0].value

                if (inputElem.getAttribute('placeholder') && inputElem.getAttribute('placeholder').trim() && prop.name !== '生产日期') {
                    SelectInListBox(inputElem, prop.values[0].value)
                } else {
                    InputValueReact(inputElem, prop.values[0].value)
                }
            })
        })
        return DoWithInterval(funcList, 1)
    }

    let SetSku = () => {
        let GetLabelElem = (label) => {
            let elems = document.querySelectorAll('#goods-spec-sku label')
            for (let i=0; i<elems.length; ++i) {
                if (elems[i].innerText.trim().search(label.trim()) !== -1) return elems[i]
            }
        }
        let specs = {}
        let name2sku = {}
        detail.result.sku.forEach(sku => {
            sku.spec.forEach(spec => {
                if (!specs[spec.parent_name]) specs[spec.parent_name] = {}
                specs[spec.parent_name][spec.spec_name] = 1
                name2sku[spec.spec_name] = sku
            })
        })
        console.log('规格', specs)
        let pList = []
        for (let name in specs) {
            let p = DoAndWait(() => document.querySelector('#goods-spec-sku button').click(), 0.2).then(() => {
                let labelElem = GetLabelElem('商品规格')
                let inputElems = labelElem.parentNode.querySelectorAll('input[type="text"]')
                let inputElem = inputElems[inputElems.length - 1]
                SelectInListBox(inputElem, name, 'ul[role="listbox"]')
                let funcList = []
                for (let specsName in specs[name]) {
                    funcList.push(() => {
                        let specsInputElems = document.querySelectorAll('input[placeholder="请输入规格名称"]')
                        let specsInputElem = specsInputElems[specsInputElems.length - 1]
                        console.log('填写规格', specsInputElem, specsName)
                        DoAndWait(() => specsInputElem.focus(), 0.2).then(() => {
                            return DoAndWait(() => InputValueReact(specsInputElem, specsName), 0.2).then(() => {
                                DoAndWait(() => specsInputElem.blur(), 0.2)
                            })
                        })
                    })
                }
                return DoWithInterval(funcList, 1)
            })
            pList.push(p)
        }

        let GetSpecElem = (name) => {
            let elems = document.querySelectorAll('span.sku-row-spec')
            for (let i=0; i<elems.length; ++i) {
                if (elems[i].innerText.trim() === name.trim()) return elems[i]
            }
        }
        Promise.all(pList).then(() => {
            return DoAndWait(() => {}, 0.5).then(() => {
                for (let name in name2sku) {
                    let sku = name2sku[name]
                    let elem = GetSpecElem(name)
                    if (!elem) {
                        console.log(`获取SpecElem ${name} 失败`)
                        continue
                    }
                    let td = elem.parentNode
                    let nextTd = td.nextElementSibling
                    InputValueReact(nextTd.querySelector('input'), sku.quantity)
                    nextTd = nextTd.nextElementSibling
                    InputValueReact(nextTd.querySelector('input'), sku.multi_price / 100)
                    nextTd = nextTd.nextElementSibling
                    InputValueReact(nextTd.querySelector('input'), sku.price / 100)
                    nextTd = nextTd.nextElementSibling
                    InputValueReact(nextTd.querySelector('input'), sku.out_sku_sn)
                }
            })
        })
    }

    SetProps().then(() => {
        SetSku()
    })
}

(function() {
    'use strict';

    // Your code here...
    window.onload = () => {
        InsertTextArea()
        InsertInputBeforeMain((goodsAddId) => {
            console.log('click', goodsAddId)
            if (window.location.href.search('goods/category') !== -1) {
                GetGoodsAddDetail(goodsAddId).then(res => {
                    console.log('GetGoodsAddDetail succ', res)
                    FillCategory(res)
                }, err => {
                    console.error('GetGoodsAddDetail fail', err)
                })
            } else if (window.location.href.search('goods/goods_add/index') !== -1) {
                GetGoodsAddDetail(goodsAddId).then(detail => {
                    console.log('GetGoodsAddDetail succ', detail)
                    GetGoodsProperty(detail.result.goods_id).then(goodsProp => {
                        console.log('GetGoodsProperty', goodsProp)
                        FillDetail(detail, goodsProp)
                    })
                }, err => {
                    console.error('GetGoodsAddDetail fail', err)
                })
            }
        })
    }
})();