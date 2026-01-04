// ==UserScript==
// @name         QOS-Handler
// @namespace    http://greasyfork.org/
// @version      0.2
// @description  QOS-Handler(window param ver)
// @author       Cosil.C
// @grant        unsafeWindow
// @license      GPL
// ==/UserScript==

/* jshint esversion: 6 */
/**
 * @description 流控相关
 */
unsafeWindow.qos = {
    /**
     * @description 记录这次的访问时间戳，并返回是否超出限制
     * @param sec 时间限制
     * @param timesLimit 次数限制
     * @returns sec秒内访问了超过timesLimit次 ? true : false
     */
    record: (sec, timesLimit) => {
        sec = sec || 5;
        timesLimit = timesLimit || 10;
        console.log(`start qos recording...\nsec:${sec},timesLimit:${timesLimit}`);
        let timestamp = new Date().getTime(), historyArr = document.defaultView.qos.getRecord();
        historyArr.push(timestamp);
        if (historyArr.length > timesLimit) {
            let shift;
            do {
                shift = parseInt(historyArr.shift());
            } while (historyArr.length > timesLimit);
            //
            if (timestamp - shift <= sec * 1000) {
                let format = function (target) {
                    return new Date(target).toTimeString().substr(0, 8);
                };
                console.log(`current:${format(timestamp)}, shift:${format(shift)}, interval(sec):${(timestamp - shift) / 1000}`);
                return true;
            }
        }
        localStorage.setItem('historyArr', JSON.stringify(historyArr));
        console.log('qos recorded');
        return false;
    },
    /**
     * @description 清除缓存中的记录
     */
    clearRecord: () => {
        localStorage.removeItem('historyArr');
    },
    /**
     * @description 获取记录的历史
     * @returns 历史记录数组
     */
    getRecord: () => {
        let historyArr;
        try {
            historyArr = JSON.parse(localStorage.getItem('historyArr') || '[]');
        } catch (e) {
            console.error(e);
            console.error(`cause:${localStorage.getItem('historyArr')}`);
            document.defaultView.qos.clearRecord();
            historyArr = [];
        }
        return historyArr;
    }
};