// ==UserScript==
// @name         aoi
// @namespace    http://tampermonkey.net/
// @version      2024.7.11.1
// @description  try it!
// @author       You
// @match        https://beta-out-jdl-mapdata.jd.com/editor/?mode=edit&taskId=*
// @match        https://beta-out-jdl-mapdata.jd.com/editor/?mode=readonly&taskId=*
// @match        https://beta-out-jdl-mapdata.jd.com/editor/?mode=check&taskId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497803/aoi.user.js
// @updateURL https://update.greasyfork.org/scripts/497803/aoi.meta.js
// ==/UserScript==

window.$ = Document.prototype.$ = Element.prototype.$ = $
window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$;

(async function() {

    var _ds = {
        poiList: [],
    }
    window._ds = _ds

    hijackXHR(function() {
        const xhr = this
        // console.log(xhr.responseURL)
        const isMatch = ['^https://map-work.jd.com/inner/data/admin/get_admin_refer_info'].some(url => new RegExp(url).test(xhr.responseURL))
        if(!isMatch) return

        const data = JSON.parse(xhr.responseText)
        if(data.message !== `成功`) return

        _ds.poiList = data.result
    })

    await init()

    const configCard = $$('.el-card').find(card => card.textContent.startsWith('底图'))
    if(configCard.style.display === 'none') document.dispatchEvent(new KeyboardEvent('keydown', { code: "KeyW", key: "w", keyCode: 87}));

    // const iframe = document.createElement('iframe')
    // iframe.id = 'iframe'
    // iframe.src = 'https://joyspace.jd.com/sheets/NXkJIrWkK2uDPyzkWNul'
    // setStyle(new Map([
    //     [$('.container'), {
    //         position: 'relative',
    //     }],
    //     [iframe, {
    //         position: 'absolute',
    //         right: '0',
    //         bottom: '-6px',
    //         height: '400px',
    //         width: '800px',
    //         opacity: '.95',
    //     }]
    // ]))
    // $('.container').append(iframe)
    // iframe.onload = function(e) {
    //     // console.log(111, iframe.contentWindow.document.querySelector('.joyspace-portal-main-header'))
    //     console.log(111, iframe)
    // }
    let isInitIdInput = false
    Obs($('.sidebar'), mrs => {
        // console.log('%c------', 'color: darkseagreen', mrs);
        [...mrs].forEach(mr => {
            Array.from(mr.addedNodes).forEach(an => {
                // console.log('an', an, mr)
                if(!isInitIdInput && an?.classList?.contains('el-form-item') && an.$('.id-text')) {
                    console.log('update')
                    searchPOI(getFormItem('社区名称').$('input').value)

                    Obs($('.id-text'), (mrs)=> {
                        mrs.forEach(mr => {
                            Array.from(mr.addedNodes).forEach(an => {
                                if(an.nodeName !== '#text') return
                                searchPOI(getFormItem('社区名称').$('input').value)

                            })
                        })
                    }, { childList: true, subtree: true })

                    isInitIdInput = true
                }
            })
        })
    }, { childList: true, subtree: true })

    function searchPOI(address) {
        const keywords = [];
        [...address].forEach((char, idx) => {
            keywords.push(address.slice(0, idx+1))
        });

        let r = []
        keywords.forEach((keyword, idx) => {
            const findList = _ds.poiList.filter((poiInfo) => {
                return poiInfo.communityName == keyword
            })

            r = [...r, ...findList]
        })
        // console.log(r)

        const searchPanel = $('.search_panel')
        searchPanel.style.display = 'block'
        searchPanel.innerHTML = ''
        if(r.length) {
            r.forEach((item, idx) => {
                const li = document.createElement('li')
                li.textContent = item.communityName
                li.style.cursor = 'pointer'

                li.onclick = () => {
                    setInputValue($('.loc-search input'), /POINT \((.*)\)/.exec(item.geom)[1]);
                    $('.loc-search .search-container').click()
                }
                searchPanel.append(li)
            })
        } else {
            searchPanel.innerHTML = 'POI不存在'
        }
    }

    const searchPanel = document.createElement('div')
    searchPanel.className = 'search_panel'
    setStyle(searchPanel, {
        display: 'none',
        position: 'absolute',
        bottom: '215px',
        right: '47px',
        width: '150px',
        height: '100px',
        padding: '5px',
        overflow: 'auto',
        background: 'rgba(255,255,255,.8)',
        borderRadius: '5px',
        color: '#333',
        zIndex: 9999,
    })
    document.body.append(searchPanel)


    document.addEventListener('keydown', e => {
        if(e.keyCode == 70) {
            const canvas = document.querySelector('#map canvas')
            const filter = canvas.style.filter
            canvas.style.filter = filter ? null : 'invert(1)'

        }

        if(e.keyCode == 71) {
            const card = [...document.querySelectorAll('.el-card')].find(card => card.textContent.startsWith('底图'));
            [...card.querySelectorAll('.el-checkbox')].find(checkbox => checkbox.textContent.includes('作业范围')).querySelector('input').click()
        }

        if(e.keyCode == 9) {
            e.preventDefault()

            const baseMap = ['腾讯地图', '高德地图', '百度地图', '谷歌地图']
            const imageMap = ['谷歌影像', '腾讯影像', '高德影像']

            const card = [...$$('.el-card')].find(card => card.textContent.startsWith('底图'));
            const radios = card.$$('.el-radio-group .el-radio')

            const curSel = card.$('.el-radio-group .el-radio.is-checked').textContent
            selectMap(baseMap.includes(curSel) ? '腾讯影像' : '腾讯地图')

            function selectMap(name) {
                card.$$('.el-radio-group .el-radio').find(elRadio => elRadio.textContent == name).$('input[type="radio"]').click()
            }
        }
    })
})();


function setStyle() {
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

function Obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
    if(!target) return console.error('监视目标不存在')

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

async function init() {
    return new Promise(res => {
        Obs(document, mrs => {
            // console.log('%c====', 'color: red', mrs)
            mrs.forEach(mr => {
                Array.from(mr.addedNodes).forEach(an => {
                    // an.nodeName !== '#text' && !an.nodeValue?.includes('经纬度') && console.log('an', an, mr)
                    if(an?.matches?.('.container') && an?.parentElement.id === 'app') {
                        res(true)
                    }

                    if(an?.parentElement?.id?.includes('adminRefLayer_info_window')) {
                        an.style.color = '#666'
                    }

                })
            })
        })
    })
}

function hijackXHR(change, send) {
    const realXMLHttpRequest = window.XMLHttpRequest;

    window.XMLHttpRequest = function() {
        const xhr = new realXMLHttpRequest();

        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState !== 4) return
            change.call(this)
        });

        send && (xhr.send = send.bind(xhr))
        return xhr;
    }
}

function getFormItem(label) {
    return $$('.sidebar .el-form-item').find(item => item.querySelector('label')?.innerText === label)
}

function setInputValue(input, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    nativeInputValueSetter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
};
