// ==UserScript==
// @name         手机端净化器

// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  手机网页删除元素
// @author       Negan
// @include      *
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/411431/%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/411431/%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==


let filter = {
    handleEle(selector, type) {
        try {
            for (let i in selector) {
                // 将id和class分开单独去除
                if (/\#/.test(selector[i])) {
                    let ele = document.querySelector(selector[i]);
                    if (!ele) {
                        continue;
                    }
                    if (type == 'remove') {
                        ele.parentNode.removeChild(ele);
                    } else {
                        ele.style.visibility = 'hidden';
                    }

                } else {
                    let ele_list = document.querySelectorAll(selector[i]);
                    for (let ele of ele_list) {
                        if (!ele) {
                            continue;
                        }
                        if (type == 'remove') {
                            ele.parentNode.removeChild(ele);
                        } else {
                            ele.style.visibility = 'hidden';
                        }
                    }
                }
            }
        } catch (e) {
            console.debug('handleEle 函数内捕获到了一些错误,下面是错误信息！')
            console.debug(e)
        }
    },
    // 只保留选中的元素，删除其他元素，遍历元素的父元素，删除其他子元素
    preserveElement(selector_list) {
        let preserve_element = [];
        for (let s of selector_list) {
            let ele = document.querySelector(s);
            preserve_element.push(ele);
        }
        function handle(target_ele) {
            try {
                if (target_ele.parentNode != document.documentElement) {
                    for (let ele of target_ele.parentNode.children) {
                        if (!preserve_element.includes(ele)) {
                            target_ele.parentNode.removeChild(ele);
                        }
                    }
                    preserve_element.push(target_ele.parentNode)
                    handle(target_ele.parentNode)
                }
            } catch (e) {
                console.debug(e)
            }
        }
        console.debug('保留数组', preserve_element)
        handle(preserve_element[0]);
    },
    isFiterUrl(options) {
        for (let i in options) {
            let url = location.href;
            if (i == 'https://www.baidu.com/') {
                if (i == url) {
                    if (options[i]['reserve']) {
                        this.preserveElement(options[i]['reserve']);
                    }
                    if (options[i]['remove']) {
                        this.handleEle(options[i]['remove'], 'remove');
                    }
                    if (options[i]['hide']) {
                        this.handleEle(options[i]['hide'], 'hide');
                    }
                }
            } else {
                if (new RegExp(i).test(url)) {
                    if (options[i]['reserve']) {
                        alert('isFiterUrl','test')
                        this.preserveElement(options[i]['reserve']);
                    }
                    if (options[i]['remove']) {
                        this.handleEle(options[i]['remove'], 'remove');
                    }
                    if (options[i]['hide']) {
                        this.handleEle(options[i]['hide'], 'hide');
                    }
                }
            }
        }
    },
    start() {
        let filter_options = {
            //百度主页
            'https://m.baidu.com/#':
            {
                'remove':
                    [
                        '#userinfo-wrap',
                        '#logo',
                        '.blank-frame',
                        '#bottom'
                    ]
            },

        };
        this.isFiterUrl(filter_options);
    }
}

filter.start()
let timer = 1;

setInterval(e => {
    if (timer < 5) {
        filter.start();
        timer++;
    }
}, timer * 1000);

