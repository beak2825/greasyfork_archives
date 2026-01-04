// ==UserScript==
// @name         lzbc_manage
// @namespace    http://tampermonkey.net/
// @version      2024.12.17.1
// @description  try it
// @author       You
// @match        http://39.104.65.87:8778/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=65.87
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521705/lzbc_manage.user.js
// @updateURL https://update.greasyfork.org/scripts/521705/lzbc_manage.meta.js
// ==/UserScript==

(function() {
    if(location.pathname == '/editor/') return
    const headerInsertwrap = createEl('div', {
        style: {
            position: 'absolute',
            display: 'flex',
            top: '3%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }
    })
    const selector = createEl('select', {
        style: {
            cursor: 'pointer',
            background: '#eee',
        },
        onchange: function() {
            const selName = selector[selector.selectedIndex].value
            const voucherList = JSON.parse(localStorage.getItem('voucherList'))
            switchUser(voucherList[selName])
        }
    })


    if(location.hash !== '#/login') {
        const {name: localName, Authorization} = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).UserInfo
        let voucherList = JSON.parse(localStorage.getItem('voucherList'))

        verify(Authorization).then(res => {
            if(!res.name) return Promise.reject(() => showMessage('凭证无效', {type: 'error'}))

            let voucherList = JSON.parse(localStorage.getItem('voucherList'))
            if(!voucherList || Object.prototype.toString.call(voucherList) !== '[object Object]') voucherList = {}
            voucherList[res.name] = localStorage.getItem('persist:root')
            localStorage.setItem('voucherList', JSON.stringify(voucherList))


            for(let k in voucherList) {
                const option = createEl('option', {
                    value: k,
                    innerText: k,
                    selected: k === res.name,
                    style: {
                        cursor: 'pointer',
                    },
                })
                selector.append(option)
            }
        })

    } else {
        let voucherList = JSON.parse(localStorage.getItem('voucherList'))
        if(!voucherList || Object.prototype.toString.call(voucherList) !== '[object Object]') {
            voucherList = {}
            localStorage.setItem('voucherList', JSON.stringify(voucherList))
        }

        selector.append(createEl('option', {
            disabled: true,
            selected: true,
            style: {
                cursor: 'not-allowed',
            },
        }))

        for(let k in voucherList) {
            selector.append(createEl('option', {
                value: k,
                innerText: k,
                style: {
                    cursor: 'pointer',
                },
            }))
        }
    }

    const switchUserwrap = createEl('div', {
        style: {
            display: 'flex',
            margin: '0px 5px',
        }
    })
    const redirect_input = createEl('input', {
        className: 'redirect-input',
        style: {
            width: '70px',
            height: '20px',
            padding: '0',
            color: '#333',
            fontSize: '12px',
            outline: 'none',
            border: 'none',
            textIndent: '8px',
            transition: '.3s',
            background: '#ccc',
        },
    })
    const btn_redirect = createEl('div', {
        className: 'redirect-btn',
        innerText: '切换',
        style: {
            padding: '0 5px',
            height: '20px',
            lineHeight: '19px',
            backgroundColor: '#888',
            color: '#fff',
            fontSize: '12px',
            cursor: 'pointer',
        },
        onclick: function() {
            const inputVal = $('.redirect-input').value
            switchUser(inputVal)
        }
    })
    const btn_style = {
        padding: '0px 5px',
        height: '20px',
        lineHeight: '19px',
        margin: '0 5px 0 0',
        backgroundColor: 'rgb(136, 136, 136)',
        color: 'rgb(255, 255, 255)',
        fontSize: '12px',
        cursor: 'pointer',
        userSelect: 'none',
    }
    const btn_copy = createEl('div', {
        innerText: '复制',
        style: btn_style,
        onclick: function() {
            copyToClipboard(localStorage.getItem('persist:root')).then(res => showMessage('复制成功', {type: 'success', showTime: 500}))
        }
    })
    const btn_clear = createEl('div', {
        innerText: '退出',
        style: btn_style,
        onclick: function() {
            localStorage.setItem('persist:root', '')
            location.reload()
        }
    })
    switchUserwrap.append(redirect_input, btn_redirect)
    headerInsertwrap.append(selector, switchUserwrap)
    if(location.hash !== '#/login') headerInsertwrap.append(btn_copy, btn_clear)
    document.body.append(headerInsertwrap)

})();



Obs(document, mrs => {
    mrs.forEach(mr => {
        [...mr.addedNodes].forEach(an => {
            if(an.matches?.('.ant-layout.ant-layout-has-sider')) {}
        })
    })
})
function verify(Authorization) {
    return fetch("http://39.104.65.87:8778/api/personal_center/", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "authorization": `${Authorization}`,
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
    .then(res => res.json())
}

function switchUser(inputVal) {
    try {
        const {name: localName, Authorization} = JSON.parse(JSON.parse(inputVal).user).UserInfo
        verify(Authorization)
            .then(res => {
            let voucherList = JSON.parse(localStorage.getItem('voucherList'))
            if(!voucherList || Object.prototype.toString.call(voucherList) !== '[object Object]') voucherList = {}

            if(!res.name) {
                for(let k in voucherList) {
                    if(voucherList[k] !== inputVal) continue
                    delete voucherList[k]
                    localStorage.setItem('voucherList', JSON.stringify(voucherList))
                }
                return ( Promise.reject(), showMessage('凭证无效', {type: 'error', showTime: 500}))
            }

            voucherList[res.name] = inputVal
            localStorage.setItem('voucherList', JSON.stringify(voucherList))

            localStorage.setItem('persist:root', inputVal)
            location.reload()
        })
    } catch(e) {
        showMessage('凭证无效', {type: 'error', showTime: 500})
    }
}

function copyToClipboard(textToCopy) {
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(textToCopy);
    } else {
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

function Obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
    if(!target) return console.error('目标不存在')

    const ob = new MutationObserver(callBack);
    ob.observe(target, options);
    return ob
}


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

function createEl(elName, options) {
    const el = document.createElement(elName)
    for(let opt in options) {
        if(opt !== 'style') {
            el[opt] = options[opt]
        } else {
            let styles = options[opt]
            setStyle(el, styles)
        }
    }
    return el
}

function showMessage(message, config) { //type = 'default', showTime = 3000, direction
    let oldMessageWrap = document.querySelector(`.messageWrap-${config?.direction ? config.direction : 'top'}`)

    let MessageWrap
    if(!oldMessageWrap) {
        MessageWrap = document.createElement('div')
        MessageWrap.className = 'messageWrap'
        setStyle(MessageWrap, {
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

    setStyle(MessageBox, {
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

    setStyle(closeBtn, {
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
        case 'top': setStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
        case 'top left': setStyle(MessageWrap, {top: '1%', left: '.5%'}); break;
        case 'left': setStyle(MessageWrap, {top: '50%', left: '1%', transform: 'translateY(-50%)'}); break;
        case 'top right': setStyle(MessageWrap, {top: '1%', right: '.5%', }); break;
        case 'right': setStyle(MessageWrap, {top: '50%', right: '.5%', transform: 'translateY(-50%)'}); break;
        case 'center': setStyle(MessageWrap, {top: '20%', left: '50%', transform: 'translate(-50%, -50%)'}); break;
        case 'bottom': setStyle(MessageWrap, {bottom: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
        case 'bottom8': setStyle(MessageWrap, {bottom: '8%', left: '50%', transform: 'translate(-50%, -50%)'}); break;
        case 'bottom left': setStyle(MessageWrap, {bottom: '1%'}); break;
        case 'bottom right': setStyle(MessageWrap, {bottom: '1%', right: '.5%'}); break;
        default: setStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
    }

    switch(config?.type) {
        case 'success': setStyle(MessageBox, {border: '1.5px solid rgb(225, 243, 216)', backgroundColor: 'rgb(240, 249, 235)', color: 'rgb(103, 194, 58)'}); break;
        case 'warning': setStyle(MessageBox, {border: '1.5px solid rgb(250, 236, 216)', backgroundColor: 'rgb(253, 246, 236)', color: 'rgb(230, 162, 60)'}); break;
        case 'error': setStyle(MessageBox, {border: '1.5px solid rgb(253, 226, 226)', backgroundColor: 'rgb(254, 240, 240)', color: 'rgb(245, 108, 108)'}); break;
        default: setStyle(MessageBox, {border: '1.5px solid rgba(202, 228, 255) ', backgroundColor: 'rgba(236, 245, 255)', color: 'rgb(64, 158, 255)'}); break;
    }

    MessageBox.appendChild(closeBtn)
    if(oldMessageWrap) {
        oldMessageWrap.appendChild(MessageBox)
    } else {
        MessageWrap.appendChild(MessageBox)
        document.body.appendChild(MessageWrap)
    }
    let ani = MessageBox.animate([{
        transform: "translate(0, -100%)" ,
        opacity: 0.3,
    },{
        transform: "translate(0, 18px)",
        opacity: 0.7,
        offset: 0.9,
    },{
        transform: "translate(0, 15px)",
        opacity: 1,
        offset: 1,
    }], {
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

/*
2024/12/17
- 新增：账号切换的组件
*/