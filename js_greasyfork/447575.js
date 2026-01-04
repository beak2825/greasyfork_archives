// ==UserScript==
// @name         自动申请解密额度（新版）
// @namespace    http://tampermonkey.net/
// @version      0.33
// @license MIT
// @description  自动申请抖店开放平台的解密额度（新版本，抖店升级了额度申请方式）
// @author       You
// @match        https://fxg.jinritemai.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447575/%E8%87%AA%E5%8A%A8%E7%94%B3%E8%AF%B7%E8%A7%A3%E5%AF%86%E9%A2%9D%E5%BA%A6%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447575/%E8%87%AA%E5%8A%A8%E7%94%B3%E8%AF%B7%E8%A7%A3%E5%AF%86%E9%A2%9D%E5%BA%A6%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(async function(){
    'use strict';

    const CODE_SUCCESS      = 1; //成功
    const CODE_FAILURE      = 2; //失败
    const CODE_NOT_NEED_NOW = 3; //暂不需要
    const CODE_UNKNOWN      = 100; //未知

    const SUB_CODE_REMAIN_TIMES_SPAN_FAILURE    = 201; //剩余次数的selector获取元素失败；可能是原因：HTML未载入成功、网络错误、程序员修改了代码
    const SUB_CODE_APPLY_TIMES_BUTTON_FAILURE   = 202; //未找到申请次数的按钮
    const SUB_CODE_UPGRADE_RADIO_FAILURE        = 203; //没有找到提升至XX 的radio按钮
    const SUB_CODE_REASON_SELECT_FAILURE        = 204; //申请原因的select
    const SUB_CODE_REASON_SELECT_OPTION_FAILURE = 205; //申请原因的select option
    const SUB_CODE_APPLY_SUBMIT_BUTTON_FAILURE  = 206; //找不到申请提交按钮
    const SUB_CODE_TODAY_REVIEW_REJECTION       = 210; //今天已被审核拒绝过

    const SUB_CODE_AMOUNT_REMAINING           = 301; //额度还有剩余没用完
    const SUB_CODE_UNDER_REVIEW               = 302; //正在审核中，一般code为CODE_NOT_NEED_NOW时



    let code = CODE_UNKNOWN, subCode = 0, applyForMsg = '';
    let gRemainTimes;
    /**
     * 判断是否要自动跳转到额度申请页面
     * @return bool
     */
    function isLocation() {
        if (location.href.indexOf('homepage/index') !== -1) { //如果是在店铺首页，则跳转过来
            return true;
        } else {
            return false;
        }
    }

    /**
     * 模拟点击事件
     */
    function triggerClick(el) {
        el.dispatchEvent(new Event("click", {'bubbles': !![]}));
    }

    /**
     * 让页面停止xx毫秒
     * @var int ms 2000代表2秒
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 判断弹窗是否处于显示状态，如果是显示状态，则返回TRUE
     * @return boolean
     */
    function modelVisited() {
        let reasonElement = document.querySelector('#apply_reason')
        return reasonElement !== null;
    }

    /**
     * 设置申请次数
     */
    function setApplyTimes() { //一般选择最大值
        let eleTimes = document.querySelector("#apply_quota > label:nth-child(4)");
        if (eleTimes !== null) {
            eleTimes.click();
            console.log("设置《次数提升至》成功");
        } else {
            code    = CODE_FAILURE;
            subCode = SUB_CODE_UPGRADE_RADIO_FAILURE;
            throw '没有找到《次数提升至》的选项，请检查代码';
            return false;
        }
    }

    /**
     * 取得店铺的名称
     * @return string
     */
    function shopName() {
        let eleUserName = document.querySelector('.index_userName__16Isl'); //取得店铺名称的HTML元素
        if (eleUserName === null) { //如果没有找到元素
            applyForMsg = '店铺名称元素没有找到；可能是切换到抖店旧版本 或 HTML修改了';
            return '';
        } else {
            console.log("获取店铺名称成功");
            return eleUserName.innerText;
        }
    }
    /* 不同店铺申请额度的原因不同，这里根据店铺名称取得申请理由 */
    function reasonOptionByShop() {
        let configReasonContactByPhone = ['胖弟珠宝']; //电联用户
        let name                       = shopName();
        let optionIndex                = 0; //默认选择分销模式
        if (configReasonContactByPhone.findIndex(item => item === name) > -1) {
            optionIndex = 2; //选择《处理订单、售后，电联用户》
        }
        return optionIndex;
    }

    /**
     * 点击申请原因的select
     */
    function clickApplyReasonSelect() {
        let ele = document.querySelector('#apply_reason');
        if (ele === null) { //如果申请原因的select不存在
            code    = CODE_FAILURE;
            subCode = SUB_CODE_REASON_SELECT_FAILURE;
            throw '未找到申请原因的select；可能是点击《申请次数》异常或HTML被修改了';
        } else {
            ele.dispatchEvent(new Event("mousedown", {'bubbles': !![]}));
            console.log("点击申请原因select成功");
        }
    }
    /**
     * 设置申请原因
     */
    async function setApplyReason() {

        clickApplyReasonSelect(); //点击申请原因的选项

        await sleep(0.8 * 1000); //等待0.8秒
        let optionIndex = reasonOptionByShop();
        let eleOptions   = document.querySelectorAll("body div > div > div > div.rc-virtual-list > div > div > div > div.auxo-select-item.auxo-select-item-option");
        if (eleOptions.length === 0) {
            code    = CODE_FAILURE;
            subCode = SUB_CODE_REASON_SELECT_OPTION_FAILURE;
            throw '未找到申请原因的option；可能是：select点击失败，或者HTML被修改了';
        } else {
            eleOptions[optionIndex].click();
            console.log("点击申请原因option成功");
            return false;
        }
    }

    /**
     * 获取临时解密剩余次数
     * @return int
     */
    function remainTimes() {
        let element = document.querySelector("#orderAppContainer > div > div.style_container__1oVeW > div.style_flexRow__zt1A9 > div:nth-child(2) > div.style_numRow__gisD5 > span");
        if (element === null) {
            code    = CODE_FAILURE;
            subCode = SUB_CODE_REMAIN_TIMES_SPAN_FAILURE;
            throw '找不到《今日剩余查看次数》，请检查代码是否错误 或 抖店修改了代码';
        } else {
            console.log("剩于次数获取成功");
            gRemainTimes = parseInt(element.innerText); //全局变量，会发送到日志系统
            return gRemainTimes;
        }
    }

    /**
     * 验证是否正在申请中
     * @return boolean
     */
    function checkApplying() {
        let eleApplying = document.querySelector('#orderAppContainer > div > div.style_container__1oVeW > div.style_flexRow__zt1A9 > div:nth-child(2) > div.style_numRow__gisD5 > span.style_applyBtn__nsuuC.style_staticText__2kGUo');
        if (eleApplying !== null && eleApplying.innerText === '次数申请中') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取今天是否有审核拒绝的情况
     * @return boolean true表示有，false表示无
     */
    function todayReviewRejection() {
        let today = moment().format("YYYY/MM/DD");
        let elePageNewDate = document.querySelector("#orderAppContainer > div > div.style_searchContainer__qgYka > div.auxo-table-wrapper.custom-style-gray.style_table__3XMwV > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > div > div:nth-child(1)");
        if (elePageNewDate === null) return false; //如果还没有审核记录，说明还有被审核拒绝过

        let pageNewDate = elePageNewDate.innerText;
        if (pageNewDate === today) { //如果最新一条记录是今天的
            let auditContent = document.querySelector('#orderAppContainer > div > div.style_searchContainer__qgYka > div.auxo-table-wrapper.custom-style-gray.style_table__3XMwV > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(6) > div > div:nth-child(1) > span:nth-child(2)').innerText;
            if (auditContent === '审核不通过') {
                let rejectionReason = document.querySelector('#orderAppContainer > div > div.style_searchContainer__qgYka > div.auxo-table-wrapper.custom-style-gray.style_table__3XMwV > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(6) > div > div:nth-child(2) > div');
                if (rejectionReason.innerText === '今日申请次数过多，请明日再来') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            return auditContent === '审核不通过' ? true : false;
        } else { //如果最新一条记录不是今天的，说明今天未被拒绝过
            return false;
        }
    }

    /**
     * 点击申请链接
     * @return bool
     */
    function clickApplyForLink() {
        if (modelVisited() === false) { //只有当弹穿处于隐藏状态时，才点击申请额度
            let element = document.querySelector('#orderAppContainer > div > div.style_container__1oVeW > div.style_flexRow__zt1A9 > div:nth-child(2) > div.style_numRow__gisD5 > button');
            if (element.innerText === '申请次数') {
                triggerClick(element);
                console.log("申请次数链接点击成功");
                return true;
            } else {
                code    = CODE_FAILURE; //错误
                subCode = SUB_CODE_APPLY_TIMES_BUTTON_FAILURE; //未找到申请次数的按钮
                throw "申请额度的按钮获取失败，请检查代码";
                return false;
            }
        } else {
            console.log("弹窗已经处于显示状态，无需再点击申请提额");
            return false;
        }
    }

    /**
     * 点击确定按钮提交申请
     * @return bool
     */
    function clickSubmitBtn() {
        let element = document.querySelector('div.style_btnRow__3LDNl > button.auxo-btn.auxo-btn-primary');
        if (element === null || element.innerText !== '提交申请') {
            code    = CODE_FAILURE;
            subCode = SUB_CODE_APPLY_SUBMIT_BUTTON_FAILURE;
            throw '找不到提交表单的按钮，请检查代码是否有错误';
        } else {
            triggerClick(element);
        }
    }



    /**
     * 一次提交
     */
    async function oneApplyFor() {
        applyForMsg = '';
        do {
            if (todayReviewRejection() === true) {
                code    = CODE_FAILURE;
                subCode = SUB_CODE_TODAY_REVIEW_REJECTION;
                applyForMsg = '今天已被拒绝审核；本次放弃申请';
                break;
            }

            if (checkApplying() === true) {
                code    = CODE_NOT_NEED_NOW;
                subCode = SUB_CODE_UNDER_REVIEW;
                applyForMsg = '正在申请中；无需再次申请';
                break;
            }

            let _remainTimes = remainTimes();
            if (_remainTimes > 0) {
                code        = CODE_NOT_NEED_NOW;
                subCode     = SUB_CODE_AMOUNT_REMAINING;
                applyForMsg = '剩余' + new String(_remainTimes).toString() + '临时额度，无需申请';
                break;
            }

            try {
                clickApplyForLink(); //点击申请额度
                await sleep(1 * 1000); //休息1秒
                setApplyTimes(); //设置申请次数
                await sleep(1 * 1000); //休息1秒
                setApplyReason(); //设置原因
                await sleep(1.2 * 1000); //休息1.2秒
                clickSubmitBtn(); //点击按钮

                code = CODE_SUCCESS; //成功
                //检查是否成功
                return true;
            } catch (err) {
                applyForMsg = err;
                return false;
            }
        } while (false);
    }

    if (isLocation()) {
        location.href = 'https://fxg.jinritemai.com/ffa/morder/order/receiver-info-manage';
    } else {
        console.info("脚本已运行；3秒后执行操作");
        await sleep(6 * 1000); //等待避免页面还未载入
        //-----等待3秒
        await oneApplyFor(); //开始执行一次操作
        console.log(applyForMsg);

        GM_xmlhttpRequest({ //ajax提交日志到服务器
            url:"http://om.wantusirui.cn/doudian/batch_encrypt/auto_apply_quota_log", //自动提额网址
            // url:"http://www.om.loc/doudian/batch_encrypt/auto_apply_quota_log", //自动提额网址
            method :"POST",
            data:"shop_name="+encodeURIComponent(shopName())+"&remain_times="+new String(gRemainTimes).toString()+"&code="+new String(code).toString()+"&sub_code="+new String(subCode).toString(),
            headers: {"Content-type": "application/x-www-form-urlencoded"},
            onload:function(xhr){
                console.log("日志提交成功");
                console.log(xhr.responseText);
            }
        });
        console.log("如果要定时操作，比如30秒操作一次，请安装浏览器插件Auto Refresh Plus")
    }
})();