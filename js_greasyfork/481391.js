// ==UserScript==
// @name         阿里拍卖信息采集
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  阿里拍卖信息采集。。。
// @author       imzhi <yxz_blue@126.com>
// @match        https://sf-item.taobao.com/sf_item/*.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481391/%E9%98%BF%E9%87%8C%E6%8B%8D%E5%8D%96%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/481391/%E9%98%BF%E9%87%8C%E6%8B%8D%E5%8D%96%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const jq = jQuery.noConflict()

    // 竞拍ID
    const sf_id = location.href.match(/sf_item\/(\d+?)\.htm/)[1]

    // 竞拍链接
    const sf_link = location.href

    // 竞拍阶段
    const sf_jieduan = document.querySelector('.item-status') ? document.querySelector('.item-status').innerText : ''

    // 竞拍日期
    const sf_riqi = document.querySelector('#sf-countdown .countdown.J_TimeLeft + span') ? slimKuo(document.querySelector('#sf-countdown .countdown.J_TimeLeft + span').innerText) : ''

    // 标题和标的位置
    const sf_title = document.querySelector('h1').innerText

    // 所有类型的金额
    function queryTypeAmount(type_str) {
        const ele = document.querySelectorAll('#J_HoverShow .pay-mark.i-b')
        let val = ''
        for (let i in ele) {
            if (!ele.hasOwnProperty(i)) continue

            const curr_ele = ele[i]
            const curr_text = curr_ele.innerText.trim()
            if (!curr_text.includes(type_str)) {
                continue
            }
            if (jq(curr_ele).next('.pay-price').length && jq(curr_ele).next('.pay-price').find('.J_Price').length) {
                val = jq(curr_ele).next('.pay-price').find('.J_Price').text().trim()
                val = val.split(' ')[0]
            }
        }
        return val.trim()
    }

    function slimKuo(str) {
        if (!str) {
            return ''
        }
        return str.replace('(', '').replace(')', '').trim()
    }
    // 去掉价格里面的逗号
    function slimTypeAmount(val) {
        return val.replace(',', '').trim()
    }

    // 转换成万，并保留一位小数
    function amountWan(val) {
        if (val === '') {
            return val
        }
        return parseFloat((val / 10000).toFixed(1))
    }

    // 保证金
    const amount_baozheng = slimTypeAmount(queryTypeAmount('保证金'))
    console.log('queryType 保证金', amount_baozheng)

    // 起拍价
    const amount_qipai_raw = slimTypeAmount(queryTypeAmount('起拍价'))
    const amount_qipai = amountWan(amount_qipai_raw)
    console.log('queryType 起拍价', amount_qipai)

    // 加价幅度
    const amount_jiajia = slimTypeAmount(queryTypeAmount('加价幅度'))
    console.log('queryType 加价幅度', amount_jiajia)

    // 评估价
    const amount_pinggu = slimTypeAmount(queryTypeAmount('评估价'))
    console.log('queryType 评估价', amount_pinggu)

    // 详情页所有图片
    function allPicFunc() {
        const arr = []
        const ele = document.querySelectorAll('.slide-bigpic')
        for (let i in ele) {
            if (!ele.hasOwnProperty(i)) continue

            const curr_ele = ele[i]
            const curr_img = curr_ele.querySelector('img')
            const curr_src = retImgSrc(curr_img)
            arr.push(curr_src)
        }
        return arr
    }
    function retImgSrc(curr_img) {
        const curr_src = curr_img.getAttribute('data-ks-lazyload') ? ('https:' + curr_img.getAttribute('data-ks-lazyload')) : curr_img.src
        return curr_src
    }

    setTimeout(() => {
        return;

        console.log(
            "%c正在采集。。。",
            "color: white; font-size: 16px; background-color: red;"
        );
        let allPic = allPicFunc()
        allPic = allPic.join(';;')
        // console.log('allPic', allPic)
        // return;
        const post_param = {
            allPic,
            sf_id,
            sf_riqi,
            sf_link,
            sf_jieduan,
            sf_title,
            amount_baozheng,
            amount_qipai,
            amount_qipai_raw,
            amount_jiajia,
            amount_pinggu,
        }
        const url = 'https://cxkf.miyang.net/web/index.php?token=HkbkPf3TbzY5rerZ&import_fang_taobao=1'
        jq.post(url, post_param, function(res_end) {
            // console.log('ajax post', res_end)
            if (res_end.code) {
                console.log(
                    "%c%s",
                    "color: white; font-size: 16px; background-color: red;",
                    res_end.msg
                );
                alert(res_end.msg)
                return
            }
            console.log(
                "%c%s",
                "color: white; font-size: 16px; background-color: green;",
                res_end.msg
            );
            alert(res_end.msg)
        })
    }, 1800)
})();