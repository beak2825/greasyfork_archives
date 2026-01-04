// ==UserScript==
// @name         同花顺问财助手
// @namespace
// @icon         http://s.thsi.cn/cd/iwc-web-result-red-rabbit-project/unifiedwap/static/img/iwencai_logo.png
// @version      1.20
// @description  去除无意义行列、优化表格展示---test
// @author       wang
// @match        http://www.iwencai.com/*
// @match        http://search.10jqka.com.cn/*
// @match        https://www.iwencai.com/*
// @match        https://search.10jqka.com.cn/*
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      *
// @namespace    https://greasyfork.org/users/984773
// @downloadURL https://update.greasyfork.org/scripts/463976/%E5%90%8C%E8%8A%B1%E9%A1%BA%E9%97%AE%E8%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463976/%E5%90%8C%E8%8A%B1%E9%A1%BA%E9%97%AE%E8%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    //劫持函数
    function addXMLRequestCallback(callback) {
        // oldSend 旧函数 i 循环
        var oldSend, i
        //判断是否有callbacks变量
        if (XMLHttpRequest.callbacks) {
            //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            XMLHttpRequest.callbacks.push(callback)
        } else {
            //如果不存在则在xmlhttprequest函数下创建一个回调列表/callback数组
            XMLHttpRequest.callbacks = [callback]
            // 保存 XMLHttpRequest 的send函数
            oldSend = XMLHttpRequest.prototype.send
            //获取旧xml的send函数，并对其进行劫持（替换）  function()则为替换的函数
            //以下function函数是一个替换的例子
            XMLHttpRequest.prototype.send = function () {
                // 把callback列表上的所有函数取出来
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    // 把this传入进去
                    XMLHttpRequest.callbacks[i](this)
                }
                //循环回调xml内的回调函数
                // 调用旧的send函数 并传入this 和 参数
                oldSend.apply(this, arguments)
                //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
            }
        }
    }
    // e.g.
    //传入回调 接收xhr变量
    addXMLRequestCallback(function (xhr) {
        //调用劫持函数，填入一个function的回调函数
        //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
        xhr.addEventListener('loadend', function () {
            // 输入xhr所有相关信息
            // console.log(xhr)
            if (xhr.readyState == 4 && xhr.status == 200) {
                //  如果xhr请求成功 则返回请求路径
                if (xhr.responseURL.indexOf('set-history') != -1) {
                    if (
                        document
                            .getElementsByClassName('input-base-copy')[0]
                            .innerHTML.indexOf('dde大单净额；资金流向；') != -1
                    ) {
                        return
                    }
                    let timeID
                    if (timeID) return
                    console.log('同花顺问财助手---启动！！！')
                    console.time('同花顺问财助手---耗时')
                    let conditionList
                    if(document.getElementsByClassName('left-bar-ul')[0].children[1].className=='selected'){
                        conditionList = [
                            '最新价',
                            '个股热度排名',
                            '分时涨跌幅:前复权',
                            '最新涨跌幅',
                            '涨跌幅:前复权',
                            '营业收入行业排名',
                            '所属同花顺行业',
                            '总市值',
                            '(市净率(pb)/同花顺二级行业市净率)',
                            '(市盈率(pe)/同花顺二级行业市盈率)',
                            '(市盈率(pe,ttm)/市盈率(pe,ttm)行业中值)',
                            '净资产收益率roe(加权,公布值)',
                            '((竞价未匹配量*竞价匹配价)/a股市值(不含限售股))',
                            '((竞价未匹配量*竞价匹配价)/总市值)',
                            '((竞价未匹配金额/总市值)*10000.0)',
                            '((竞价未匹配金额/总市值)*1000.0)',
                            '((竞价未匹配金额/总市值)*100.0)',
                            '委比',
                            '分时委比',
                            '小单净比',
                            '中单净比',
                            'dde大单净比',
                            '主力资金流向',
                            '主力增仓占比',
                            '(成交量/成交量)',
                        ]
                        Array.prototype.remove = function(val) {
                            var index = this.indexOf(val);
                            if (index > -1) {
                                this.splice(index, 1);
                            }
                        };
                        if (
                        document
                            .getElementsByClassName('input-base-copy')[0]
                            .innerHTML.indexOf('涨幅大于-10%排行') != -1
                    ) {
                        conditionList.remove('最新价')
                        conditionList.remove('所属同花顺行业')
                        //conditionList.remove('最新价')
                        //conditionList.remove('最新价')
                    }
                    }
                    if(document.getElementsByClassName('left-bar-ul')[0].children[2].className=='selected'){
                        conditionList = [
                            '指数@涨跌幅:前复权',
                            '指数@涨停家数占比',
                            '指数@一字涨停家数占比',
                            '指数@非一字涨停家数占比',
                            '指数@上涨家数占比',
                            '指数@下跌家数占比',
                            '指数@分时涨跌幅:前复权',
                            '指数@委比',
                            '指数@分时委比',
                            '指数@上涨家数',
                            '指数@分时上涨家数'
                        ]
                    }

                    try {
                        const li_arr = document.getElementsByClassName('select-box-li')
                        for (let i = 0; i < li_arr.length; i++) {
                            timeID = setTimeout(() => {
                                const li = li_arr[i]
                                const li_selected = li.children[0].children[1].className
                                if (li && li_selected.indexOf('selected') != -1) {
                                    if (conditionList.indexOf(li.title) == -1) {
                                        li.click()
                                    }
                                }
                                if (i == li_arr.length - 1) {
                                    console.log('同花顺问财助手---清理完成')
                                    console.timeEnd('同花顺问财助手---耗时')
                                    clearTimeout(timeID)
                                }
                            }, i * 110)
                        }
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        })
    })
})()
