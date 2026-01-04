// ==UserScript==
// @name         jisilux
// @namespace    http://tampermonkey.net/
// @version      1.07
// @description  辅助选股小工具，方便查看相关信息。
// @author       scl
// @license      https://www.apache.org/licenses/LICENSE-2.0
// @match        https://*.jisilu.cn/data/*
// @match        https://*.xueqiu.com/*
// @connect      192.168.196.9  //配套服务器，查询个股指标用，非作者不能使用。
// @icon         https://www.jisilu.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435709/jisilux.user.js
// @updateURL https://update.greasyfork.org/scripts/435709/jisilux.meta.js
// ==/UserScript==

(function() {
    'use strict'
    const xqUrl = 'https://xueqiu.com/S/'
    const jslUrl = 'https://www.jisilu.cn/data/'
    const server = 'http://192.168.196.9:9096/indicator'
    const sh = /^(11|50|51|56|58|60|68|70|73|90)\d{4}$/ // 沪市证券
    const sz = /^(00|08|12|15|16|20|30)\d{4}$/ // 深市证券
    const bj = /^(43|83|87|88)\d{4}$/ //北交所
    const cb = /^(110|113|123|127|128)\d{3}$/ // 可转债
    const etf = /^(15|51|56|58)\d{4}$/ //这个跳到jsl会有错漏，ETF中的qdii ，jsl是分开的。没有找到分开的规律。
    const stock = /^(600|601|603|605|688|900|000|001|002|300|301|200|430|830|831|871)\d{3}$/ //20240306更新了部分新代码
    const lof = /^(16|50)\d{4}$/ //这个错的最多，qdii 封闭基金 都有可能，没有找到规律。
    console.log('jisulux is starting')
    //preSet
    function purifyCode(code) {
        return code.replace(/[a-z]*/gi, '')
    }
    function addPrefix(code) {
        code = purifyCode(code)
        if (sh.test(code)) {
            return 'SH' + String(code)}
        else if (sz.test(code)) {
            return 'SZ' + String(code)}
        else if (bj.test(code)) {
            return 'BJ' + String(code)}
        else {
            return false
        }
    }
    function classify(code) {
        code = purifyCode(code)
        if (cb.test(code)) {
            return jslUrl.concat('convert_bond_detail/',code)
        } else if (etf.test(code)) {
            return jslUrl.concat('etf/detail/',code)
        } else if (stock.test(code)) {
            return jslUrl.concat('stock/detail/',code)
        } else if (lof.test(code)) {
            return jslUrl.concat('lof/detail/',code)
        } else {
            return false
        }
    }
    function fetchIndicator(code){  //#0077dd 蓝色最好  #009933 绿色普通 #dd2200 红色警惕
        let url = server + '?stocks='+ String(code)
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                let indicator, roeColor, alrColor
                let res = JSON.parse(response.response)
                let EPS = parseFloat(/^-?\d+\.\d+/.exec($('#app .quote-info td:contains("每股收益")>span')[0].innerText)[0])
                let BVPS = parseFloat(/^-?\d+\.\d+/.exec($('#app .quote-info td:contains("每股净资产")>span')[0].innerText)[0])
                let roe = (EPS/BVPS*100).toFixed(1)
                if(roe>15){roeColor='#0077dd'}else if(roe<=5){roeColor='#dd2200'}else{roeColor='#009933'}
                if (res) {
                    console.log('市销率ttm',res.ps,'毛利率',res.gpm)
                    let alr = res.alr.toFixed(1)
                    if(alr>50){alrColor='#dd2200'}else if(alr<=20){alrColor='#0077dd'}else{alrColor='#009933'}
                    indicator = `<a class="stock-relation"><span>Roe </span><span style='color:${roeColor}'>${roe}% </span><span >负债 </span><span style='color:${alrColor}'>${alr}% </span></a>`
                } else {
                    indicator = `<a class="stock-relation"><span>Roe </span><span style='color:${roeColor}'>${roe}% </span></a>`
                }
                ////
                let total_share = parseFloat(/\d+\.\d+/.exec($('#app .quote-info td:contains("总股本")>span')[0].innerText)[0])
                let dividend_yield = $('#app .quote-info td:contains("股息率")>span')[0].innerText.replace(new RegExp('%', 'g'), '')
                if (isNaN(dividend_yield)){dividend_yield = false} else if(parseFloat(/\d+\.\d+/.exec(dividend_yield )[0])>= 5){dividend_yield = 5}else{dividend_yield = false}
                if (total_share >= 5 && total_share <= 300 ){$('td:contains("总股本")>span')[0].style = 'color:#07d'}
                if (dividend_yield){$('td:contains("股息率")>span')[0].style = 'color:#07d'}
                $('#app .stock-info').eq(0).after(indicator)
                new MutationObserver((recordList) => {
                    if (recordList[0].removedNodes.length!=0){
                        $('#app .stock-info').eq(0).after(indicator)
                        if (total_share >= 5 && total_share <= 300 ){$('td:contains("总股本")>span')[0].style = 'color:#07d'}
                        if (dividend_yield){$('td:contains("股息率")>span')[0].style = 'color:#07d'}
                    }
                }).observe( document.querySelector( 'div.quote-container' ), {
                    childList: true
                })
            },
            onerror: function(error) {
                console.error("Request failed:", error)
            }
        })
    }
    // start
    window.addEventListener('load', function() {
        let code = location.pathname.split('/').pop()
        if (location.hostname.replace('www.', '') === 'jisilu.cn') {
            let fullCode = addPrefix(code)
            if (!fullCode) { return }
            let xqUrlDetail = xqUrl.concat(fullCode)
            let xq = `<div style="flex:1 1 auto;"><a href= ${xqUrlDetail} target='_blank'> <img src='https://xueqiu.com/favicon.ico' width="20px" /></a></div>`
            let xq2 = `<li><a href= ${xqUrlDetail} target='_blank'> <img src='https://xueqiu.com/favicon.ico' width="18px" /></a></li>`
            if ( $('#compare_top').length > 0 ) {
                $('#compare_top > .left_title').after(xq)
            }
            if ( $('ol.breadcrumb').length > 0) {
                $('ol.breadcrumb > li.active').after(xq2)
            }
        }
        //
        if (location.hostname.replace('www.', '') === 'xueqiu.com') {
            if (location.pathname.match(/^\/[0-9]{10}\/[0-9]{8}/)) {
                [...document.querySelectorAll('div.article__container')].forEach(item=>{
                    item.oncopy = function(e) {
                        e.stopPropagation()
                    }
                })
                $('.article__bd__detail h-char').removeClass('bd-hangable')
            } else if (location.pathname.match(/^\/S\//)) {
                if (code.match('S[HZ]')&&stock.test(purifyCode(code))){
                    fetchIndicator(code)
                }
                let jslUrlDtail = classify(code)
                if (!jslUrlDtail) { return }
                let jsl = `&emsp; <a  href= ${jslUrlDtail} target='_blank'><img style='height: 1.5rem' src='https://www.jisilu.cn/favicon.ico' /></a>`
                $('#app .stock-name').eq(0).after(jsl)
            }
        }
    })
})()