// ==UserScript==
// @name         [Zeusro]宽版 dnspod.cn
// @namespace    https://www.zeusro.tech/
// @version      1.0.0
// @description  魔改 dnspod 域名配置页
// @author       Zeusro
// @supportURL   https://github.com/zeusro
// @match        *://www.dnspod.cn/console/dns/*
// @match        *://www.dnspod.cn/console/dns
// @match        *://www.dnspod.cn/console/*
// @grant        none
// @license      GPL-3.0-or-later
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/387189/%5BZeusro%5D%E5%AE%BD%E7%89%88%20dnspodcn.user.js
// @updateURL https://update.greasyfork.org/scripts/387189/%5BZeusro%5D%E5%AE%BD%E7%89%88%20dnspodcn.meta.js
// ==/UserScript==

(function () {

    var currentDocument

    //等待iframe加载
    setTimeout(function () {
        main()       
    }, 2500)


    // fixme: 由于切换域名是 iframe 操作,这里偷懒直接每1秒重新设定所有事件
    // 这里应该监听左侧的点击,但由于是iframe 实现起来略麻烦,
    setInterval(function () {
        main()
    }, 1000);

    // let options = {
    //     'childList': true,
    //     'attributes': true
    // };
    // let observer = new MutationObserver(main);
    // observer.observe(document.body, options);


    function main() {
        getCurrentDocument()
        changetWindow()
        //把样式加到 iframe 里面
        addGlobalStyle_1080p()
        fixEditBehavior()
        fixAddBehavior()
    }

    function listenClickInIfame() {
        if (!currentDocument) {
            return
        }
        currentDocument.getElementById("sidebar").addEventListener("click", function () {
            main()
        })
    }

    function changetWindow() {
        if (!currentDocument) {
            getCurrentDocument()
        }
        // 调整容器
        var containers = currentDocument.getElementsByClassName("container")
        if (!containers) {
            return
        }
        // console.log("set containers")
        if(!containers[0]){
            return
        }
        containers[0].setAttribute("style", "width:100%")
        var main = currentDocument.getElementById('main')
        if (main) {
            // console.log("set main")
            main.setAttribute("style", "width:80%")
        }
        // 调整表格头
        var recordHeader = currentDocument.getElementsByClassName('RecordHeader')[0]
        if (recordHeader) {
            // console.log("set recordHeader")
            recordHeader.setAttribute("style", "width:100%")
        }
        //TODO:适配多种常用分辨率
        var screen_height = screen.height;
        var screen_width = screen.width
        if (screen_width >= 1920 && screen_height >= 1080) {
            // console.log("setTableStyle_1080p")
            setTableStyle_1080p()
        }

    }

    function setTableStyle_1080p() {
        //table头
        var innerRecordHeader = currentDocument.getElementsByClassName('record-header')[0]
        //主机记录宽度
        var sub_domain = '300px'
        //记录类型
        var record_type = "100px"
        //记录值
        var order_key = "300px"
        if (innerRecordHeader) {
            // th list
            var cells = innerRecordHeader.childNodes[1].childNodes[1].childNodes[1].cells
            cells[1].setAttribute("width", sub_domain)
            cells[2].setAttribute("width", record_type)
            cells[4].setAttribute("width", order_key)
            var entry_names = currentDocument.getElementsByClassName("entry-name")
            var entry_values = currentDocument.getElementsByClassName("entry-value")
            var entry_types = currentDocument.getElementsByClassName("entry-type")
            //数据列
            for (var i = 0; i < entry_names.length; i++) {
                //设置主机记录列宽度
                entry_names[i].setAttribute("width", sub_domain)
                //#record-list > div:nth-child(1) > div > div.entry-name.field > span
                entry_names[i].childNodes[1].setAttribute("style", "width:280px")
                //设置记录类型
                entry_types[i].setAttribute("width", record_type)
                //设置线路类型
                entry_values[i].setAttribute("width", order_key)
                //#record-list > div:nth-child(1) > div > div.entry-value.field > span
                entry_values[i].childNodes[1].setAttribute("style", "width:270px")
            }

        }
    }

    function fixEditBehavior() {
        var entrys = currentDocument.getElementsByClassName("entry")
        if (!entrys) {
            return
        }
        for (var i = 0; i < entrys.length; i++) {
            entrys[i].addEventListener("click", function () {
                // console.log("entry click")
                if (this && this.childNodes &&
                    this.childNodes[1].childNodes &&
                    this.childNodes[1].childNodes[1].childNodes &&
                    this.childNodes[1].childNodes[1].childNodes[9]) {
                    // checkCurrentDocument()
                    // if (!currentDocument) {
                    //     getCurrentDocument()
                    // }
                    //记录类型                
                    this.childNodes[1].childNodes[1].childNodes[5].childNodes[1].setAttribute("style", "width: 100px;")
                    //记录值
                    this.childNodes[1].childNodes[1].childNodes[9].childNodes[1].setAttribute("style", "width: 278px;")
                }
                fixCancelBehavior()
            })

        }
    }

    function fixAddBehavior() {
        var createRecord = currentDocument.getElementById("create-record")
        if (!createRecord) {
            return
        }
        createRecord.addEventListener("click", function () {
            // console.log("create-record")
            // getCurrentDocument()
            setTimeout(function () {
                var entryList = currentDocument.getElementsByClassName("entry")
                if (!entryList || !entryList[0]) {
                    console.warn("no entry")
                    return
                }
                //记录类型                            
                entryList[0].childNodes[1].childNodes[5].childNodes[1].setAttribute("style", "width: 100px;")
                //记录值
                entryList[0].childNodes[1].childNodes[9].childNodes[1].setAttribute("style", "width: 278px;")
            }, 500)

        })
    }

    function fixCancelBehavior() {
        //按下取消按钮后修复CSS属性
        var cancel_buttons = currentDocument.getElementsByClassName("cancel")
        if (cancel_buttons.length === 0) {
            // console.log("no error,no warning")
            return
        }
        // console.dir(cancel_buttons)
        for (var i = 0; i < cancel_buttons.length; i++) {
            cancel_buttons[i].addEventListener("click", function () {
                // console.log("cancel click")
                setTableStyle_1080p()
            })
        }
    }

    function addGlobalStyle_1080p() {
        //es 6
        var css = `        
        .entry-name input{width: 270px;}

        /* 线路类型 */
        .entry-line span {
            width: 95px;
        }
        
        `
        var head, style;
        head = currentDocument.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = currentDocument.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }



    function getCurrentDocument() {
        var iframe = document.getElementsByTagName('iframe')[0]
        if (!iframe) {
            currentDocument = document
            console.warn("iframe未加载或已消失")
            return
        }
        if (iframe) {
            // console.log("iframe 加载完毕")
            currentDocument = iframe.contentWindow.document
        } else {
            currentDocument = document
        }
    }


})();