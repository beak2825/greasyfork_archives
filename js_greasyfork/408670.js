// ==UserScript==
// @name         springfox-swagger2
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  swagger-ui 展开、折叠、搜索、方法定位
// @author       dairong
// @include      *://*/swagger-ui.html
// @include      *://*/swagger-ui.html#/*
// @include      *://*/*swagger-ui.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408670/springfox-swagger2.user.js
// @updateURL https://update.greasyfork.org/scripts/408670/springfox-swagger2.meta.js
// ==/UserScript==

(function (config) {
    'use strict';

    // 展开状态  [ 展开true | 收起false ]
    let state = false
    // 操作按钮
    let myButton
    // 控制器集合
    let operations
    // url hash
    let hash
    // api 数据
    let apiData = []

    function getJavaTemplate({
        path,
        pathCamelCase,
        description,
        url
    }) {
        // java 字符模板
        let javaTemplate = `
    ------------------------------------------------
        ${pathCamelCase}:
        serviceId: NONE
        path: ${path}
        ------------------------------------------------
        @PostMapping(value = "${path}")
        @Operation(description = "${description}", externalDocs = @ExternalDocumentation(description = "${description}",
        url = "${url}"
        ))
        public BaseResult<?> ${pathCamelCase}(HttpServletRequest request) {
        return unifiedInvoker.restInvoke("${pathCamelCase}", request);
        }
    ------------------------------------------------
`
        return javaTemplate
    }

    // 生成 toast
    function getToastScript() {
        let toastString = 'function _toast(msg,duration){duration=isNaN(duration)?3000:duration;var m=document.createElement("div");m.innerHTML=msg;m.style.cssText="font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";document.body.appendChild(m);setTimeout(function(){var d=0.5;m.style.webkitTransition="-webkit-transform "+d+"s ease-in, opacity "+d+"s ease-in";m.style.opacity="0";setTimeout(function(){document.body.removeChild(m)},d*1000)},duration)};'
        let script = document.createElement("script");
        script.innerHTML = toastString;
        return script;
    }

    // 生成 button
    function getButtonElement(text, color = '#49cc90') {
        let buttonString = `<div class="mybutton" style="background:${color};font-size: 14px;font-weight: 700;min-width: 80px;padding: 6px 15px;text-align: center;border-radius: 3px;text-shadow: 0 1px 0 rgba(0,0,0,.1);color: #fff;">${text}</div>`;
        const buttonElement = document.createElement("div");
        buttonElement.style = 'display: inline-block; margin-left: 6px;'
        buttonElement.innerHTML = buttonString
        return buttonElement;
    }

    // 操作按钮
    function getBottons() {
        // copy button
        const copyButton = getButtonElement(config.copyButton.text, config.copyButton.color);
        copyButton.onclick = copyBottonClick;
        // template button
        const templateButton = getButtonElement(config.templateButton.text, config.templateButton.color);
        templateButton.onclick = templateBottonClick;

        const buttonsElement = document.createElement("div");
        // buttonsElement.style = 'background: blue;'
        // buttonsElement.appendChild(templateButton);
        buttonsElement.appendChild(copyButton);
        return buttonsElement
    }

    // <script src="https://wzrd.in/standalone/copy-to-clipboard@latest" async></script>
    function getClipboardScript() {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = `!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).copyToClipboard=e()}}(function(){return function(){return function e(t,n,o){function r(a,i){if(!n[a]){if(!t[a]){var u="function"==typeof require&&require;if(!i&&u)return u(a,!0);if(c)return c(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var s=n[a]={exports:{}};t[a][0].call(s.exports,function(e){return r(t[a][1][e]||e)},s,s.exports,e,t,n,o)}return n[a].exports}for(var c="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}}()({1:[function(e,t,n){"use strict";var o=e("toggle-selection"),r="Copy to clipboard: #{key}, Enter";t.exports=function(e,t){var n,c,a,i,u,l,s=!1;t||(t={}),n=t.debug||!1;try{if(a=o(),i=document.createRange(),u=document.getSelection(),(l=document.createElement("span")).textContent=e,l.style.all="unset",l.style.position="fixed",l.style.top=0,l.style.clip="rect(0, 0, 0, 0)",l.style.whiteSpace="pre",l.style.webkitUserSelect="text",l.style.MozUserSelect="text",l.style.msUserSelect="text",l.style.userSelect="text",document.body.appendChild(l),i.selectNode(l),u.addRange(i),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");s=!0}catch(o){n&&console.error("unable to copy using execCommand: ",o),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData("text",e),s=!0}catch(o){n&&console.error("unable to copy using clipboardData: ",o),n&&console.error("falling back to prompt"),c=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:r),window.prompt(c,e)}}finally{u&&("function"==typeof u.removeRange?u.removeRange(i):u.removeAllRanges()),l&&document.body.removeChild(l),a()}return s}},{"toggle-selection":2}],2:[function(e,t,n){t.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],o=0;o<e.rangeCount;o++)n.push(e.getRangeAt(o));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach(function(t){e.addRange(t)}),t&&t.focus()}}},{}]},{},[1])(1)});`
        return script
    }

    // 向页面添加 toast 插件
    function appendToast() {
        let toastScript = getToastScript();
        document.getElementsByTagName('head')[0].appendChild(toastScript);
    }

    // 向页面添加 copy 插件
    function appendClipboard() {
        let clipboardScript = getClipboardScript();
        document.getElementsByTagName('head')[0].appendChild(clipboardScript);
    }

    // 向页面添加 button
    function appendButton(ele) {
        const baseElement = ele || document;
        const paths = baseElement.querySelectorAll('.opblock-summary');
        // 
        paths.forEach(item => {
            let bottons = getBottons();
            item.appendChild(bottons);
        })
    }

    // copy 按钮点击
    function copyBottonClick(e) {
        try {
            // const title = document.querySelector('.information-container .title').innerText
            const pathElement = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.opblock-summary-path a span');
            const path = pathElement.innerText;
            window.copyToClipboard(path);
            _toast('复制成功', 1200);
        } catch (error) {
            console.error(error)
        }
        e.stopPropagation();
    }

    function templateBottonClick(e) {
        try {
            const pathElement = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.opblock-summary-path a span');
            const descElement = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.opblock-summary-description');
            let path = pathElement.innerText;
            let pathCamelCase = path2CamelCase(path);
            let description = descElement.innerText
            let url = decodeURIComponent(location.href);
            let data = getJavaTemplate({
                path,
                pathCamelCase,
                description,
                url
            });
            window.copyToClipboard(data);
            _toast('复制成功', 1200);
        } catch (error) {
            console.error(error)
        }
        e.stopPropagation();
    }

    function path2CamelCase(path) {
        if (path) {
            let words = path.split('/').filter(item => item);
            let pathCamelCase = words.reduce((t, c, i) => {
                return t += ( i === 0 ? c.charAt(0).toLowerCase() : c.charAt(0).toUpperCase() ) + c.substring(1);
            }, '')
            return pathCamelCase
        }
        return path
    }

    // controller 点击
    function opblockTagClick(e) {
        // 使用 event.target 会存在bug, 真正的点击到的元素可能是 opblocktag 内部的 元素
        // const currentElement = e.target
        // const controllerElement = currentElement.parentElement
        // const className = controllerElement.className
        // console.log(this);
        let opblockTag = this.parentElement
        nextTick(() => {
            appendButton(opblockTag);
        });
    }

    // 兼容 controller 展开、折叠 追加的按钮消失问题
    function handleOpblockTagClick() {
        const opblockTags = document.querySelectorAll('.opblock-tag');
        opblockTags.forEach(item => {
            // fix bug
            item.onclick = opblockTagClick.bind(item);
        })
    }

    // 数据匹配
    function match(val) {
        let valLowerCase = val.toLocaleLowerCase();
        return apiData.filter(item => {
            let pathLowerCase = item.path;
            let summaryLowerCase = item.summary;
            return pathLowerCase.toLocaleLowerCase().includes(valLowerCase) || summaryLowerCase.toLocaleLowerCase().includes(valLowerCase)
        })
    }

    // 模糊搜索（支持方法说明、映射路径）
    function search(e) {
        let val = e.target.value.trim()
        let list = document.getElementById('operList')
        if (val === "") {
            list.classList.add("hidden");
        } else {
            // 匹配方法
            let matchPaths = match(val);
            renderLi(matchPaths);
            list.classList.remove("hidden");
        }
    }

    // 渲染查询结果
    function renderLi(matchPaths) {
        let liHtml = ""
        if (matchPaths.length === 0) {
            liHtml =
                `<li class="list-li"><span class="list-li-left">暂无数据</span><span class="list-li-right"></span></li>`
        } else {
            matchPaths.forEach(item => {
                liHtml +=
                    `<li class="list-li" data-operation-id="${item.operationId}"><span class="list-li-left">${item.method} ${item.path}</span><span class="list-li-right">${item.summary}</span></li>`
            })
        }
        document.getElementById("operUl").innerHTML = liHtml
        // 绑定事件
        let lis = document.querySelectorAll('.list-li')
        lis.forEach(element => {
            element.addEventListener('mouseenter', function () {
                this.classList.add('active')
            });
            element.addEventListener('mouseleave', function () {
                this.classList.remove('active')
            });
            element.addEventListener('click', function (e) {
                let item = apiData.find(val => val.operationId === e.currentTarget.dataset.operationId)
                extendMethod(extendController(item.tag), item.tag, item.operationId);
                let operInput = document.getElementById("operInput");
                operInput.value = ''
                operInput.setAttribute('placeholder', `${item.method} ${item.path}`)
            });
        });
    }

    // input 失去焦点
    function inputBlur() {
        nextTick(() => {
            document.getElementById('operList').classList.add("hidden");
        }, 300)
    }

    // 点击事件
    function buttonClick() {
        if (state) {
            doCollapse();
        } else {
            doExtend();
        }
    }

    // 事件注册
    function initEvent() {
        document.getElementById("operInput").addEventListener("input", search);
        document.getElementById("operInput").addEventListener("blur", inputBlur);
        document.getElementById("operButton").addEventListener("click", buttonClick);
    }

    // UI初始化
    function appendSearchUI() {
        // 样式加载
        let commonStyle = `.extends{position:fixed;display:inline-block;right:15px;top:60px;font-size:14px}.oper{display:inline-table;box-shadow:3px 4px 5px 0 #999}.oper-input{background-color:#fff;border:1px solid #dcdfe6;box-sizing:border-box;color:#606266;font-size:inherit;height:40px;line-height:40px;padding:0 15px;width:700px;cursor:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC10lEQVRYR+2WvWtTURTAfyFp0yQmNWlCGiqUDkLGClIcDCiEpIPulkyCDv4N6u6fIOjQ0sV0KUIHQQuKgyEEdCoO0qWUl8S0CpUIiemTc30vPGryPhIxS88S8u459/7u+bw+7OVnOByeabfb34G4g+5Iyz4bq2+rq6sX5+fnlcr6+voX4PJIp9gY2QHomUwGn89HoVAQANnGTn8kNkcA2TWXy7G1tTU5gIWFBWq12uQAQqEQ+/v7kwOQkzVNOwcQD3wGska6Z4D6SKlvMXJVBWYISqUSU1NTynxjYwNd13ei0eitXq9Hu91+Dtz3CmQFKAEvgR/GJqoPmCI5YP5fWlqSA9XS8vKy+q1Wq+zt7V0FVLlI7wLuOgEJQBF4JYrT09N0Op2nwANgKIDoiie63a7af2VlhdnZWcrlMmtra+rbwcEBu7u7d4CyHYQA6KIQi8WIRCI0m016vZ76PswDon9yckI0Gu3vXSwW2d7eJhwOs7i4SDable75FrjpCmBubk55QG7VarXywBsvAPF4nMPDQwUgks/n2dzcdAXwUUIptxcvGAnXApJeAMRO8sIEEC9UKhVXAJckZDJ0zMnXaDQ4PT3tJ90gF54NwVmAQCAgeeAKQGxVHpg37nQ6HB0d2QIMgrJ6wPCka4D3wPVEIkEwGDTD4BlA+oHf7++zaZrmGkCFweoFCUM6nXYqY9t1LwADwyBVMY54BXgt1SMNxczkcQ73mgOinwS+WsPwvwH+CsMkAFQYrNUwDoSmaTvAbadWbF3/Z2EwWvoN4J0XgH4YpCtKdxxVjG7quMEghWfAvXGSUdp4o9F4AfyZzTYyjFC1ZuuActrIuu7lATsM4IKMfFWbyWT/GeYGwnC9PBTMl9VIHhCjPkQqlUKmm53ouk69rt6oKUDGuStxTBLgA3BtWIeUg4+Pj+Up9wm44upUi5IbAFP9IfAImLHY/wKeAI+9Hmzq/wbyQyQw9l5pkQAAAABJRU5ErkJggg==") 12 3,auto!important;outline:0;vertical-align:middle;display:table-cell}.oper-button{background-color:#f5f8fa;color:#909399;vertical-align:middle;display:table-cell;position:relative;border:1px solid #dcdfe6;border-left:none;height:40px;line-height:1;border-radius:0 4px 4px 0;padding:0 20px;width:120px;white-space:nowrap;outline:0}.list{margin-top:15px;background:#fff;box-shadow:3px 4px 5px 0 #999}.list.hidden{display:none}.list-ul{width:100%;margin:0;padding:0;list-style:none;width:820px;border:1px solid #dcdfe6;max-height:600px;overflow-y:scroll}.list-zw{width:120px}.list-li{padding:10px 15px;border-bottom:1px solid #dcdfe6;overflow:hidden;box-sizing:border-box}.list-li.active{background:#f5f8fa}.list-li-left{width:60%;float:left;white-space:nowrap;word-break:break-all;overflow:hidden;text-overflow:ellipsis;box-sizing:border-box}.list-li-right{box-sizing:border-box;width:40%;float:right;padding-left:15px;white-space:nowrap;word-break:break-all;overflow:hidden;text-overflow:ellipsis;text-align:right}`;
        let styleTextNode = document.createTextNode(commonStyle);
        let styleElement = document.createElement('style');
        styleElement.appendChild(styleTextNode)
        document.body.appendChild(styleElement);
        // 创建根节点
        let rootDiv = document.createElement('div');
        rootDiv.setAttribute("id", "swagger-ui-extends-root");
        document.body.appendChild(rootDiv);

        let rootHtml = `<div class="extends"><div class="oper"><input class="oper-input" id="operInput" type="text" value="" /><button class="oper-button" id="operButton">展开</button></div><div class="list hidden" id="operList"><ul class="list-ul" id="operUl"></ul></div></div>`;
        rootDiv.innerHTML = rootHtml;

        initEvent();
    }

    // 设置按钮文字
    function setMyButtonInnerText(text) {
        myButton = myButton || document.getElementById('operButton');
        myButton.innerText = text
    }

    // 所有控制器按钮
    function getOperationsButtons() {
        if (!operations || operations.length === 0) {
            operations = document.querySelectorAll('.opblock-tag-section')
        }
        return operations
    }

    // 展开
    function doExtend() {
        setMyButtonInnerText(config.loadingText);
        nextTick(() => {
            let operations = getOperationsButtons()
            operations.forEach(btn => {
                let isOpen = btn.className.indexOf('is-open') > -1
                if (!isOpen) {
                    btn.querySelector('.expand-operation').click();
                }
            });
            state = true;
            setMyButtonInnerText(config.collapseText);
        })
    }

    // 收起
    function doCollapse() {
        setMyButtonInnerText(config.loadingText);
        nextTick(() => {
            let operations = getOperationsButtons()
            operations.forEach(btn => {
                let isOpen = btn.className.indexOf('is-open') > -1
                if (isOpen) {
                    btn.querySelector('.expand-operation').click();
                }
            });
            state = false;
            setMyButtonInnerText(config.extendText);
        })
    }

    // next tick 解决加载状态无法及时生效
    function nextTick(fn, time = 50) {
        setTimeout(() => {
            let isFunction = Object.prototype.toString.call(fn) === "[object Function]"
            if (isFunction) {
                fn();
            }
        }, time)
    }

    // 获取查询参数
    function getLoactionHash() {
        // #/auto-msg-controller/checkAutoMsgUsingPOST
        // rdss 自定义 hash
        let reg = /\$.+\$/
        let customHash = reg.exec(window.location.hash)
        if (customHash) {
            hash = window.location.hash
            return {
                type: 3,
                name: decodeURIComponent(customHash[0].replace(/\$/ig, ''))
            }
        }
        hash = decodeURIComponent(window.location.hash)
        let hashArray = hash.split('/').filter(v => v !== '#' && v !== "")
        return {
            type: hashArray.length,
            controllerName: hashArray[0],
            methodName: hashArray[1],
        }
    }

    // 定位控制器
    function extendController(controllerName) {
        let controllerElement = document.getElementById('operations-tag-' + controllerName);
        if (!controllerElement) {
            console.error('未找到页面元素', controllerName)
        }
        let controllerSection = controllerElement.parentElement;
        let isOpen = controllerSection.className.indexOf('is-open') > -1;
        if (!isOpen) {
            controllerElement.querySelector('.expand-operation').click();
        }
        return controllerSection
    }

    // 定位方法
    function extendMethod(controllerSection, controllerName, methodName) {
        let methodElement = controllerSection.querySelector(`#operations-${controllerName}-${methodName}`);
        if (!methodElement) {
            console.error('未找到页面元素', `${controllerName}-${methodName}`)
        }
        let methodIsOpen = methodElement.className.indexOf('is-open') > -1;
        if (!methodIsOpen) {
            let methodHref = methodElement.querySelector('.opblock-summary')
            methodHref.click();
            nextTick(() => {
                methodHref.scrollIntoView();
            })
        } else {
            let methodHref = methodElement.querySelector('.opblock-summary')
            nextTick(() => {
                methodHref.scrollIntoView();
            })
        }
        window.location.hash = hash
    }

    // http get
    function get(url, successCallBack) {
        // 解析数据
        function parseData(responseText) {
            let swaggerInfo = JSON.parse(responseText)
            let paths = swaggerInfo.paths
            let pathKeys = Object.keys(paths)
            pathKeys.forEach(pathKey => {
                // 映射路径
                let pathObjs = paths[pathKey]
                let pathObjKeys = Object.keys(pathObjs)
                pathObjKeys.forEach(methodName => {
                    let pathObj = pathObjs[methodName]
                    // 方法集合
                    apiData.push({
                        path: pathKey,
                        method: methodName,
                        tag: pathObj.tags[0],
                        summary: pathObj.summary,
                        description: pathObj.description,
                        operationId: pathObj.operationId,
                    })
                })
            })
            successCallBack && successCallBack(apiData)
        }
        // 发送 http 请求
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    try {
                        parseData(httpRequest.responseText)
                    } catch (error) {
                        console.error(`数据处理异常：`, httpRequest.responseText);
                    }
                } else {
                    console.error(`请求失败, 检测请求地址是否有效【${url}】`);
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    }

    // 获取 swagger 数据
    function initUI(delegationCustom) {
        // 2、加载 api 数据，挂载查询组件
        get(`${window.location.origin}/v2/api-docs`, (data) => {
            // console.log('api 数据准备就绪！', apiData);
            if (delegationCustom) {
                // 自定义 hash 处理
                try {
                    console.log('处理自定义hash', delegationCustom);
                    let matchPath = apiData.find(obj => obj.path.toLocaleLowerCase().includes(delegationCustom.toLocaleLowerCase()))
                    hash = `#/${matchPath.tag}/${matchPath.operationId}`
                    extendMethod(extendController(matchPath.tag), matchPath.tag, matchPath.operationId);
                } catch (error) {
                    console.error('处理自定义hash异常', error)
                }

            }
            appendSearchUI();
        })
    }

    // 初始化组件
    function initSwaggerExtend() {
        // 1、type [ 0无, 1controller, 2method, 3name ]
        let hashResult = getLoactionHash()
        const {
            type,
            controllerName,
            methodName,
            name
        } = hashResult
        // console.log('获取 hash', hashResult);
        // 委托处理自定义 hash（依赖 api 数据）
        let delegationCustom
        switch (type) {
            case 1:
                // 中文无法自动展开
                extendController(controllerName);
                break;
            case 2:
                // 定位到方法
                extendMethod(extendController(controllerName), controllerName, methodName);
                break;
            case 3:
                // 自定义 hash 处理
                delegationCustom = name
                break;
            default:
                // 展开所有控制器
                if (config.autoExtend) {
                    setMyButtonInnerText(config.loadingText);
                    nextTick(doExtend)
                }
                break;
        }
        // 2、添加 search input element
        initUI(delegationCustom);
        // 3、添加 toast script
        appendToast();
        // 4、添加 copy script
        appendClipboard();
        // 5、添加按钮
        appendButton();
        // 6、controller 绑定点击事件
        handleOpblockTagClick();

    }

    // swagger 异步加载，定时器捕获页面元素
    let timer = setInterval(() => {
        let operations = getOperationsButtons();
        if (operations.length === 0) {
            // 页面没有加载完成
            return;
        }
        clearInterval(timer);
        console.log('swagger-ui 组件加载开始！');
        initSwaggerExtend();
        console.log('swagger-ui 组件加载完成！');
    }, 500);

})({
    autoExtend: false,
    extendText: "展开",
    collapseText: "收起",
    loadingText: "loading...",
    copyButton: {
        text: '复制路径',
        color: '#49cc90'
    },
    templateButton: {
        text: '复制模板',
        color: '#49cc90'
    },
});