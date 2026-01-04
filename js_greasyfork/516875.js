// ==UserScript==
// @name         tagww 导出文件脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  这是一个tagww.com网站的文件导出脚本
// @author       21克的爱情提供技术支持
// @match        *.tagww.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/516875/tagww%20%E5%AF%BC%E5%87%BA%E6%96%87%E4%BB%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/516875/tagww%20%E5%AF%BC%E5%87%BA%E6%96%87%E4%BB%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const menu_command_id = GM_registerMenuCommand("其他工具", function(event) {
        console.log("Menu item selected");
        // 打开新标签页
        // GM_openInTab('https://tool.civiccloud.cn/#/finance');
        GM_openInTab('https://tool.civiccloud.cn/#/finance', {
            active: true,  // 新标签页将被激活
            insert: true,  // 新标签页将在当前标签页旁边插入
            setParent: true // 新标签页将设置当前标签页为父标签页
        });

        // 宿主页面的Tampermonkey脚本
        window.addEventListener('message', function(event) {
            // 确保消息来源是可信的
            if (event.origin === "https://example.com") {
                console.log("接收到消息:", event.data);
                // 处理接收到的消息
            }
        }, false);
        // window.opener.postMessage('这是来自子页面的消息', 'https://example.com');
    });



    console.log('Tagww 插件加载成功');
    // 自定义拦截请求操作
    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }
    // e.g.
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                console.dir(xhr);
                if (xhr.responseURL.includes("includes/jobAjaxReqs.csp") || xhr.responseURL.includes("/apps/Dashboard/%25CSP.Broker.cls")) {
                    formatHtml();
                }
            }
        });

    });

    // axios 解决下载PDF 302 错误
    const request = axios.create({
        baseURL: 'https://sourcing.di.tagww.com',
        withCredentials: true,
    })
    // PDF 类
    const PDF = {
        workbook: null,
        async start (data, isExcel, progress, doneBlack) {
            const zip = new JSZip()
            const ids = JSON.parse(localStorage.getItem('downloadIds') || '{}')
            const excelData = []
            for (let i = 0; i < data.length; i++) {
                progress && progress(i + 1)
                const job = data[i];
                ids[job.id] = true
                console.log('开始下载', job)
                const purchaseOrdersUrl = await this.getViewByUrl(job.url, 0)
                console.log('获取到订单链接以及项目名称', purchaseOrdersUrl)
                const orderListUrl = await this.getViewByUrl(purchaseOrdersUrl.url, 1)
                console.log('获取到表格链接', orderListUrl)
                const tableListUrl = await this.getViewByUrl(orderListUrl, 2)
                console.log('获取到表格链接', tableListUrl)
                const tableList = await this.getViewByUrl(tableListUrl, 3)
                console.log('获取到表格数据列表链接', tableList)
                for (let index = 0; index < tableList.length; index++) {
                    const item = tableList[index];
                    const printViewUrl = await this.getViewByUrl(item.url, 4)
                    console.log('获取到打印链接', printViewUrl)
                    const downloadUrl = await this.getViewByUrl(printViewUrl, 5, item)
                    console.log('获取到下载链接', downloadUrl)
                    const fileBlob = await this.downloadFile(downloadUrl, `PO_${item.id}`)
                    console.log('获取到下载的文件数据', fileBlob, purchaseOrdersUrl, item)

                    const total = item.data.replace(/[a-zA-Z\s]/g, '')
                    const projectName = purchaseOrdersUrl.projectName
                    excelData.push({
                        orderId: item.id,
                        jobsId: job.id,
                        projectName,
                        total: total.replace(',', '') * 1
                    })
                    const name = `（${projectName}）${total}`
                    zip.file(`${fileBlob.name.replace(/\.[pdf|PDF]+/, name + '.pdf')}`, fileBlob.data)
                }
            }
            console.log(excelData)
            if (isExcel) {
                this.workbook = new ExcelJS.Workbook();
                const sheet = this.workbook.addWorksheet('My Sheet');
                sheet.columns = [
                    { header: 'JobsId', key: 'jobsId', width: 15 },
                    { header: 'OrderId', key: 'orderId', width: 32 },
                    { header: 'ProjectName', key: 'projectName', width: 40 },
                    { header: 'Total Money', key: 'total', width: 20 }
                ];
                sheet?.addRows(excelData);
                // 写入 buffer
                const buffer = await this.workbook.xlsx.writeBuffer();
                zip.file(`JOBS统计数据.xlsx`, buffer)
            }

            zip.generateAsync({ type: "blob" }).then(function (content) {
                localStorage.setItem('downloadIds', JSON.stringify(ids))
                doneBlack && doneBlack()
                saveAs(content, `${new Date().getTime()}.zip`);  //Photo.zip为生成zip后的文件名
            })
        },
        getViewByUrl (url, status, params={}) {
            return new Promise((resolve) => {
                if (!url) {
                    resolve('')
                }
                if (url.indexOf(location.origin) == -1) {
                    url = `${location.origin}/${url}`;
                }
                request({
                    url: url,
                    method: 'GET',
                }).then(({ data }) => {
                    let resultUrl = ''
                    if (status === 5) {
                        const downRegExp = new RegExp(/JbPurchaseOrderPrintView.csp\?(.?)+&/i)
                        console.log('是否含有locationHref链接', downRegExp.test(data))
                        if (downRegExp.test(data)) {
                            let viewUrl = downRegExp.exec(data)[0] || ''
                            viewUrl = viewUrl.replace("CSPCHD","CACHELOGINDATA")
                            const fileRegExp = new RegExp(/CoDownloadPDF.csp\?(.?)+&/i)
                            console.log('是否含有CoDownloadPDF链接', fileRegExp.test(data))
                            if (fileRegExp.test(data)) {
                                const oId = url.replace(/\D/g, '')
                                // https://sourcing.di.tagww.com/apps/CoDownloadPDF.csp?CSPToken=1_kbP44ZX4I9t$EXhtUFUvzZ9T2F6Iy0MR35zfFFkFaZumbzYv1LD1LG4sw$dguP1zIbX8K98nnH7Wh0s4vc7w--&locationHref=https://sourcing.di.tagww.com/apps/JbPurchaseOrderPrintView.csp?CSPSHARE=1&CACHELOGINDATA=000001020000mHg7cH0TIiFd9zz6ShNvs0iPT1BnxjoE1Un6qz&OID=129678&PARAMNAMES=CACHELOGINDATA,OID,st_forPrint,OID&TYPE=PO&st_forPrint=1&number=2100129678&OID=129678
                                resultUrl = `${fileRegExp.exec(data)[0] || ''}locationHref=https://sourcing.di.tagww.com/apps/${viewUrl}OID=${oId}&PARAMNAMES=CACHELOGINDATA,OID,st_forPrint,OID&TYPE=PO&st_forPrint=1&number=${params.id}&OID=${oId}`
                            }
                        }
                    } else {
                        let div = document.createElement("div")
                        div.style.display = "none"
                        div.innerHTML = data.replaceAll("img", "imgg")

                        if (status === 0) {
                            // 获取导航列表
                            const purchaseOrders = div.querySelector("#main-nav .sfhover")
                            const projectName = div.querySelector(".titlearea .titlewithbuttons").innerText
                            resolve({
                                url: 'apps/' + purchaseOrders.querySelector("a").getAttribute("href"),
                                projectName
                            })
                        } else if (status === 1) {
                            const orderDiv = div.querySelector("#main-nav").lastChild.previousElementSibling;
                            const orderList = orderDiv.querySelector('a')
                            resultUrl = orderList.getAttribute('href')
                        } else if (status === 2) {
                            resultUrl = div.querySelector("#JbPurchaseOrderList").getAttribute('src')
                            // resultUrl = orderList.attr('src')
                        } else if (status === 3) {
                            const tr = div.querySelectorAll('table tr[class]') || []
                            const trData = Array.from(tr).map(item => ({
                                id: item.querySelectorAll('td')[1].innerText.trim(),
                                url: 'apps/' + item.querySelectorAll('td')[1].querySelector('a').getAttribute("href"),
                                data: item.querySelectorAll('td')[6].innerText,
                            }))
                            resolve(trData)
                            // resultUrl = orderList.attr('src')
                        } else if (status === 4) {
                            const printRegExp = new RegExp(/JbPurchaseOrderPrintView.csp\?OID=[\d]+/)
                            if (printRegExp.test(data)) {
                                resultUrl = printRegExp.exec(data)[0] || ''
                            }
                        }
                    }
                    resolve('apps/' + resultUrl)
                })
            })
        },
        downloadFile(url, name){
            return new Promise((resolve) => {
                if (!url) {
                    resolve('')
                }
                if (url.indexOf(location.origin) == -1) {
                    url = `${location.origin}/${url}`;
                }
                request({
                    url: url,
                    method: 'GET',
                    responseType: "blob",
                }).then((res) => {
                    const name = (res.headers['content-disposition'] || '').substr((res.headers['content-disposition'] || '').indexOf('=') + 1)
                    resolve({
                        name,
                        data: res.data
                    })
                })
            })
        }
    }
    function formatHtml(){
        if (location.pathname === "/apps/Dashboard/DbJobs.csp") {
            const ids = JSON.parse(localStorage.getItem('downloadIds') || '{}')
            console.log(ids)

            // 设置下载的excel按钮
            const excel = document.querySelector('#jobRows thead th:last-child')
            if (excel) {
                excel.innerHTML = `<button class="downloadEXCEL" style="background:#28dfff;color:#fff;border:none;width:83px;padding:1px 0;margin:0 auto;display:block;cursor:pointer;">EXCEL</button>`
            }

            // 设置下载PDF按钮
            const list = document.querySelectorAll('#jobRows tbody td:last-child')
            list.forEach((item) => {
                const id = item.parentElement?.querySelector('a')?.outerText || ''
                const url = item.parentElement?.querySelector('a')?.href
                item.innerHTML = `<button class="downloadPDF" data-id="${id}" data-url="${url}" style="background:${ids[id] ? 'grey' : '#28dfff'};color:#fff;border:none;width:83px;padding:1px 10px;cursor:pointer;">${ids[id] ? 'retry' : 'down'} PDF</button>`
            })

            document.querySelectorAll('.downloadEXCEL').forEach((ele) => {
                ele.addEventListener('click', ( e ) => {
                    const { target } = e
                    e.preventDefault()
                    e.stopPropagation()
                    // 获取所有的选中框
                    const checkData = document.querySelectorAll('table tr[class] input[type=checkbox]')
                    const list = Array.from(checkData).filter((item) => item.checked).map((item) => {
                        const tr = item.parentElement.parentElement
                        return {
                            id: tr.querySelector('tr > td > a').outerText.trim(),
                            url: tr.querySelector('tr > td > a').href,
                            status: tr.querySelector('#jobStatusUpdateTd').outerText.trim(),
                        }
                    }).filter((item) => !'Cancelled'.includes(item.status))

                    if (list.length === 0) {
                        return alert('select data is empty')
                    }
                    PDF.start(
                        list,
                        true,
                        (index) => {
                            console.log(index)
                            target.innerHTML = `EXCEL${index}/${list.length}`
                            target.disabled = true
                            target.style.background = "#5d5d5d"
                        },
                        () => {
                            target.innerHTML = `EXCEL`
                            target.disabled = false
                            target.style.background = "#28dfff"
                        }
                    )
                })
            })

            document.querySelectorAll('.downloadPDF').forEach((ele) => {
                ele.addEventListener('click', ( e ) => {
                    const { target } = e
                    e.preventDefault()
                    e.stopPropagation()
                    ids[target?.dataset.id] = true
                    localStorage.setItem('downloadIds', JSON.stringify(ids))
                    target.innerHTML = "Download..."
                    target.disabled = true
                    target.style.background = "#808080"
                    console.log(target?.dataset)
                    PDF.start(
                        [target?.dataset],
                        false,
                        () => {},
                        () => {
                            target.innerHTML = `retry PDF`
                            target.disabled = false
                            target.style.background = "grey"
                        }
                    )
                })
            })
        }
    }
})();