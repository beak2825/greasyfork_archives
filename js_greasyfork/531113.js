// ==UserScript==
// @name         视频号助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  视频号助手脚本
// @author       许大包
// @match        https://channels.weixin.qq.com/platform/live/commodity/onsale/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @require      https://update.greasyfork.org/scripts/500012/1407355/jquery20.js
// @require      https://update.greasyfork.org/scripts/500013/1407356/xlsxfull-0185.js
// @downloadURL https://update.greasyfork.org/scripts/531113/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531113/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// update.gf.qytechs.cn（镜像域名）

(function() {
    'use strict';
    let rootDom,urlDate,kuanhao,speed = false,first = true
    let Doms = {
        addgoodsBtn: '.body-action-area .weui-desktop-btn_primary', //添加商品按钮
        goodsurlBtn: '.header-tabs-wrap .weui-desktop-tab__nav', // 商品链接导入按钮
        shibieurlBtn: '.link-textarea-wrap .weui-desktop-btn', // 识别链接按钮
        addBtn: '.weui-desktop-dialog .weui-desktop-btn_primary:eq(1)', // 添加按钮
        yichuBtn: '.weui-desktop-popover__desc .weui-desktop-btn_primary', // 移除链接按钮
        jiangjieBtn: '.promoting', // 讲解按钮
        searchInput: '.weui-desktop-form__input', // 搜索商品文本框
        goodsitem: '.table-row-wrap', // 商品链接：1号，2号...
    }

    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    callback();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 检测商品列表变动的函数
    function changegoodsFn(callback) {
        const parent = $(rootDom).find(Doms.goodsitem).parent()[0]; // 父元素
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 兄弟元素发生变化（增删或顺序变化）
                    console.log('商品列表已更新');
                    // 停止观察
                    observer.disconnect();
                    callback()
                }
            });
        });
        // 开始观察父元素的子节点变化
        observer.observe(parent, { childList: true });
        setTimeout(() => {
            observer.disconnect();
        },10000)
    }

    waitForElement('.wujie_iframe', () => {
        rootDom = document.querySelector('.wujie_iframe').shadowRoot
    });

    function setVueInputValue(element, value) {
        const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setValue.call(element, value);

        const event = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        event._isVue = true; // 标记为 Vue 内部事件
        element.dispatchEvent(event);
    }

    // 复制到粘贴板的方法
    function copyToClip(content, message) {
        var aux = document.createElement("input")
        aux.setAttribute("value", content)
        document.body.appendChild(aux)
        aux.select()
        document.execCommand("copy")
        document.body.removeChild(aux)
        if (message == null) {
            toast("复制成功");
        }else if (message == '') {
            return
        }else{
            toast(message+'复制成功');
        }
    }
    /**
 * 显示Toast提示
 * @param {string} text - 提示文字
 * @param {number} [time=2000] - 显示时长（毫秒）
 * @param {string} [id='toast'] - 元素ID（用于防止重复提示）
 */
    function toast(text, time = 2000, id = 'toast') {
        // 移除已存在的相同提示
        const existingToast = document.getElementById(id);
        if (existingToast) {
            existingToast.remove();
        }

        // 创建容器
        const toast = document.createElement('div');
        const htmlElement = document.documentElement;

        // 样式配置（推荐使用CSS类）
        Object.assign(toast.style, {
            position: 'fixed',
            left: '10px',
            top: id === 'toast' ? '20%' : '40%', // 根据ID调整位置
            padding: '6px 10px',
            borderRadius: '8px',
            opacity: '0',
            color: '#fff',
            lineHeight: '30px',
            background: 'rgba(250, 157, 59,0.8)', // 修正了颜色值
            zIndex: '9999', // 合理化的层级值
            transition: 'opacity 0.3s ease-in-out' // 改用CSS过渡动画
        });

        // 设置元素属性
        toast.id = id;
        toast.innerText = text;
        htmlElement.appendChild(toast);

        // 使用requestAnimationFrame优化动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // 自动关闭定时器
        setTimeout(() => {
            toast.style.opacity = '0';
            // 等待渐出动画完成后再移除元素
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, time);
    }
    /**
        * @param {Function} fn 目标函数
        * @param {Number} time 延迟执行毫秒数
        * @param {Boolean} type 1-立即执行，2-不立即执行
        * @description 节流函数
        */
    function throttle(fn, time, type = false) {
        let previous = 0
        let timeout
        return function() {
            let that = this
            let args = arguments
            if (type) {
                let now = Date.now()
                if (now - previous > time) {
                    fn.apply(that, args)
                    previous = now
                }
            } else {
                if (!timeout) {
                    timeout = setTimeout(() => {
                        timeout = null
                        fn.apply(that, args)
                    }, time)
                }
            }
        }
    }

    function outurlFn(timer = false) {
        rootDom.querySelector(Doms.addgoodsBtn).click()
        waitForElement('.wujie_iframe', () => {
            $(rootDom).find(Doms.goodsurlBtn)[1].click()
            setTimeout(() => {
                $(rootDom).find('.textarea-body').focus()
                if(timer) {
                    // 模拟粘贴事件
                    const pasteEvent = new Event('paste', { bubbles: true });
                    pasteEvent.clipboardData = {
                        types: ['text/plain'],
                        getData: () => urlDate
                    }
                    $(rootDom).find('.textarea-body')[0].dispatchEvent(pasteEvent);
                    setTimeout(() => {
                        $(rootDom).find(Doms.shibieurlBtn)[0].click()
                    },300)
                }
                $(rootDom).find('.textarea-body')[0].onpaste = throttle(() => {
                    $(rootDom).find(Doms.shibieurlBtn)[0].click()
                    $(rootDom).find('.textarea-body')[0].addEventListener('keydown', function (e) {
                        if(e.keyCode == 13) {
                            $(rootDom).find(Doms.addBtn)[0].click()
                            // 自动讲解
                            if(GM_getValue('autojiangjie',false)) changegoodsFn(() => {
                                setTimeout(() => {
                                    $(rootDom).find(Doms.jiangjieBtn)[0].click()
                                },300)
                            })
                        }
                    })
                },1000,true)
                if(speed) {
                    let startTime = Date.now()
                    let timer = setInterval(() => {
                        // 超时处理
                        if (Date.now() - startTime > 15000) {
                            clearInterval(timer);
                            return;
                        }
                        if(!$(rootDom).find(Doms.addBtn).hasClass('weui-desktop-btn_disabled')) {
                            clearInterval(timer)
                            $(rootDom).find(Doms.addBtn)[0].click()
                        }
                    },200)
                    }
                // 自动讲解
                if(GM_getValue('autojiangjie',false)) changegoodsFn(() => {
                    setTimeout(() => {
                        $(rootDom).find(Doms.jiangjieBtn)[0].click()
                    },300)
                })
            },200)
        });
    }
    window.addEventListener('keydown', function (e){
        if(e.altKey && e.keyCode == 87 ) {
            // alt + w
            outurlFn()
        }else if(e.keyCode == 27) {
            // 移除链接
            if($(rootDom).find('.action-item.last').parent().not('div:hidden').length > 0 && $(rootDom).find(Doms.yichuBtn).not('button:hidden')[0]) {
                $(rootDom).find(Doms.yichuBtn).not('button:hidden')[0].click()
            }
            document.querySelector('#kuanhao').focus()
            document.querySelector('#kuanhao').select()
            if (document.getElementById('toast')) document.getElementById('toast').remove();

        }else if(e.keyCode == 13) {

        }else if(e.altKey && e.keyCode == 90) {
            // alt + Z
            $(rootDom).find(Doms.jiangjieBtn)[0].click()
        }else if(e.altKey && e.keyCode == 88) {
            // alt + X
            // 滚动到顶部
            $(rootDom).find('.app-body').scrollTop(0)
            $(rootDom).find(Doms.searchInput)[0].focus()
            $(rootDom).find(Doms.searchInput)[0].select()
            if(first) {
                $(rootDom).find(Doms.searchInput)[0].addEventListener('keydown',function(e) {
                    if(e.keyCode == 13) {
                        setVueInputValue($(rootDom).find(Doms.searchInput)[0],$(rootDom).find(Doms.searchInput)[0].value.toUpperCase().trim())
                        // 款号是否含有H
                        if($(rootDom).find(Doms.searchInput)[0].value.toUpperCase().trim().indexOf('H') != -1) {
                            GM_getValue('jxdata',null).some(val => {
                                if(val["商品款号"] && val["商品款号"] != "" && val["商品款号"].match(/[^\u4e00-\u9fa5]+/) && val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0] == $(rootDom).find(Doms.searchInput)[0].value) {
                                    setVueInputValue($(rootDom).find(Doms.searchInput)[0],val["视频号链接"].split('/')[1])
                                    // 将序号改成1
                                    if($(rootDom).find('.id-wrap:first').text() == val["视频号链接"].split('/')[1]) {
                                        $(rootDom).find('.text-area:first').click()
                                        setVueInputValue($(rootDom).find('.index-input')[0],1)
                                        setTimeout(() => {
                                            $(rootDom).find('.weui-desktop-btn_input-clear')[0].click()
                                        },200)
                                    }else {
                                        changegoodsFn(() => {
                                            setTimeout(() => {
                                                $(rootDom).find('.text-area:first').click()
                                                setVueInputValue($(rootDom).find('.index-input')[0],1)
                                                setTimeout(() => {
                                                    $(rootDom).find('.weui-desktop-btn_input-clear')[0].click()
                                                },200)
                                            },700)
                                        })
                                    }
                                    return true
                                }
                            })
                        }
                    }
                },true)
                first = false
            }
        }else if(e.altKey && e.keyCode === 111) {
            // alt + /
            // 删除第一个链接
            $(rootDom).find(Doms.yichuBtn)[0].click()
        }else if(e.altKey && e.keyCode == 74) {
            // alt + J
            if(GM_getValue('autojiangjie',false) == true) {
                GM_setValue('autojiangjie',false)
                toast('不讲解')
            }else if(GM_getValue('autojiangjie',false) == false) {
                GM_setValue('autojiangjie',true)
                toast('自动讲解')
            }
        }else if(e.altKey && e.keyCode === 191) {
            // alt + ?
            // 获取精选联盟数据
            document.querySelector('#file').click()
        }else if(e.altKey && e.keyCode === 107 || e.altKey && e.keyCode === 187) {
            // alt + +
            speed = true
        }else if(e.altKey && e.keyCode === 109 || e.altKey && e.keyCode === 189) {
            // alt + -
            speed = false
        }
    })
    let styleDom = `
        <style>
            #bodyyifu,#bodykuzi {
                position: fixed;
                top: 9%;
                left: 10px;
                height: 25px;
                color: rgb(250, 157, 59);
                z-index: 9999;
                cursor: pointer;
            }
            #bodykuzi{
                transform: translate(0, 25px);
            }
            .left {
                position: fixed;
                top: 25%;
                left: 10px;
                transform: translate(0, -50%);
                z-index: 9999;
            }
            .left div {
                margin: 5px 0;
            }
            .left input,.right input,#passName{
                width: 80px;
                height: 25px;
                outline: none;
                border-radius: 4px;
                border: 1px solid rgba(250, 157, 59,.6);
                text-align: center;
                font-size: 12px;
                color: #888;
            }
            .right {
                position: fixed;
                top: 75%;
                right: 10px;
            }
            #lastkuanhao {
                position: fixed;
                top: 10%;
                right: 20px;
                text-align: center;
                color: rgb(250, 157, 59);
                font-size: 24px;
                z-index: 99999999;
            }
            .stockMax,#fixedNum {
                position: fixed;
                top: 15%;
                right: 10px;
            }
            #fixedNum {
                top: 30%;
            }
            #kuanhao {
                width: 80px;
                height: 25px;
            }
            #shangjia {
                width: 80px;
                height: 25px;
                background: rgba(100,86,247,.6);
                border: none;
                border-radius: 4px;
                color: #fff;
                transform: translate(0, 5px);
            }
            #file {
                position: absolute;
                display: none;
            }
            #xuhao {
                position:fixed;
                top:700%;
                width:250px;
                height:10%;
                line-height: 100px;
                font-size:48px;
                color:rgba(100,86,247,.6)
                font-weight: 700;
                border: 3px solid rgba(100, 86, 247,.6);
            }
            #xuhao::placeholder {
                font-size: 34px;
                font-weight: 300;
                color:rgba(100,86,247,.6);
            }
            .araUR {
                max-width: 600px!important;
            }
            #passName {
                resize:none;
                position: fixed;
                top: 19%;
                right: 10px;
                width: 140px;
                height: 100px;
            }
            #zhuanshuStock {
                position: fixed;
                top: 71%;
            }
            .flagDom {
                display: none;
            }
        </style>
        <input id="file" type="file" />
        <div id="bodyyifu">衣服款号：${GM_getValue("yifu","")}</div>
        <div id="bodykuzi">裤子款号：${GM_getValue("kuzi","")}</div>
        <div id="lastkuanhao"></div>
        <div class="left">
            <div>
                <input id="yifu" class="yifu" placeholder="身上衣服" value="" autocomplete="off">
            </div>
            <div>
                <input id="kuzi" class="kuzi" placeholder="身上裤子" value="" autocomplete="off">
            </div>
             <div>
                <input id="xuhao" class="xuhao" placeholder="链接序号" value="" autocomplete="off" style="position:fixed;top:700%;width:250px;height:100px;font-size:36px;color:rgba(100,86,247,.6);display: none">
            </div>
        </div>
        <div class="right">
            <div class="flagDom">
            <div class="stockMax" >
                <input id="stockMax" placeholder="剩余链接" value="" autocomplete="off">
            </div>
                <textarea id="passName" autocomplete="off" placeholder="跳过商品名称"></textarea>
                <input id="fixedNum" placeholder="固定链接序号" value="" autocomplete="off">
                <input id="zhuanshuStock" placeholder="专属剩余库存" value="" autocomplete="off">
            </div>
            <div>
                <input id="kuanhao" placeholder="商品款号" value="" autocomplete="off">
            </div>

        </div>
        `
    document.body.insertAdjacentHTML("beforeend", styleDom)
    document.querySelector('#bodyyifu').addEventListener('click',function() {
        kuanhao = GM_getValue("yifu","")
        autoshangjiaFn()
    })
    document.querySelector('#bodykuzi').addEventListener('click',function() {
        kuanhao = GM_getValue("kuzi","")
        autoshangjiaFn()
    })
    document.querySelector('#yifu').addEventListener('keydown',function(e) {
        if(e.keyCode == 13) {
            let yifu = document.querySelector('#yifu').value.toUpperCase().trim()
            GM_setValue('yifu',yifu)
            toast('衣服款号：'+yifu)
            bodygoods = yifu
            document.querySelector('#bodyyifu').innerText = '衣服款号：'+ GM_getValue('yifu','')
            document.querySelector('#yifu').value = ''
        }
    })
    document.querySelector('#kuzi').addEventListener('keydown',function(e) {
        if(e.keyCode == 13) {
            let kuzi = document.querySelector('#kuzi').value.toUpperCase().trim()
            GM_setValue('kuzi',kuzi)
            toast('裤子款号：'+kuzi)
            document.querySelector('#bodykuzi').innerText = '裤子款号：'+ GM_getValue('kuzi','')
            document.querySelector('#kuzi').value = ''
        }
    })
    // 一键上架的方法
    function autoshangjiaFn() {
        if(kuanhao.trim() != '') {
            if(GM_getValue('jxdata',null) != null) {
                GM_getValue('jxdata',null).some(val => {
                    //console.log(val)
                    //console.log(val["视频号链接"])
                    if(val["商品款号"] && val["商品款号"] != "" && val["商品款号"].match(/[^\u4e00-\u9fa5]+/) && val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0] == kuanhao.trim().toUpperCase() || val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0].split('H')[1] == kuanhao.trim().toUpperCase() || val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0].split('J')[1] == kuanhao.trim().toUpperCase()) {
                        urlDate = val["视频号链接"],''
                        copyToClip(val["视频号链接"],'')
                        // 匹配最多保留两位小数的数字
                        try{
                            if(val["商品名称-价格"].match(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")) {
                                toast("价格："+val["商品名称-价格"].match(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")[0]+"\n"+val["商品名称-价格"].replace(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")+"\n"+val["佣金比例"],20000)
                                console.log(val["商品名称-价格"])
                            }else {
                                toast(val["商品名称-价格"].replace(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")+"\n"+val["佣金比例"],20000)
                                console.log(val["商品名称-价格"])
                            }
                        }catch{}
                        return true
                    }
                })
            }
            outurlFn(true)
        }

    }
    // 一键上架
    document.querySelector('#kuanhao').addEventListener('keydown',function(e) {
        if(e.keyCode == 13) {
            kuanhao = document.querySelector('#kuanhao').value
            document.querySelector('#kuanhao').value = ''
            document.querySelector('#lastkuanhao').innerText = kuanhao.toUpperCase()
            autoshangjiaFn()
        }
    })
    // 获取精选联盟数据
    // 读取本地excel文件
    document.querySelector('#file').addEventListener('change',function() {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            // 处理excel文件
            handle(workbook);
        };
        reader.readAsBinaryString(document.querySelector('#file').files[0]);
    })

    // 处理excel文件
    function handle(workbook) {
        // workbook.SheetNames[0] excel第一个sheet
        var datas = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        console.log(datas)
        if(datas.length > 0){
            // 获取列名是汇总列名，避免某行某个字段没有值，会缺少字段
            // 标题
            /*
                var title = [];
                // 获取每行数据
                first:
                for(var index in datas){ // datas数组，index为索引
                    second:
                    for(var key in datas[index]){ // datas[index]对象,key为键
                        if (-1 === title.indexOf(key)) {
                            title.push(key);
                        }
                    }
                }
                // 列名
                console.log(title);
                */
            // 数据
            GM_setValue('jxdata',datas)
        }
    }
})();