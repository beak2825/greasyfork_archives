// ==UserScript==
// @name         华工五山体育场地预订
// @namespace    http://worranhin.github.io/
// @version      0.5.0
// @description  自动发送网络请求以试图更高效地订场地。
// @author       worranhin
// @license      LGPL-3.0-or-later
// @match        https://venue.spe.scut.edu.cn/vb-user/booking
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scut.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517283/%E5%8D%8E%E5%B7%A5%E4%BA%94%E5%B1%B1%E4%BD%93%E8%82%B2%E5%9C%BA%E5%9C%B0%E9%A2%84%E8%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/517283/%E5%8D%8E%E5%B7%A5%E4%BA%94%E5%B1%B1%E4%BD%93%E8%82%B2%E5%9C%BA%E5%9C%B0%E9%A2%84%E8%AE%A2.meta.js
// ==/UserScript==

let GlobalAuthorization = null;

function main() {
    'use strict';

    /// 配置：用户应自行更改这些参数；
    /// UserId 请在页面按 F12 进入网络选项卡，然后随便提交一个订单，选择名为 apply的 POST 请求，查看其消息头
    /// 鄙人不知道其它获取方法
    let config = {};
    config.Authorization = null; // 令牌，长这样 "Bearer eyJ0eXAiOiJKV1Q..."，现已实现自动获取，也可以自己输入
    config.UserId = 0; // 用户 ID，请备份好自己的 UserId，更新脚本会覆盖掉
    config.startTime = "20:00"; // 时间段
    config.endTime = "22:00";
    config.week = 4; // 星期几
    config.receipts = 160; // 金额
    config.venue = 13; // 场地
    config.date = "2025-01-29"; // 日期每个月最后一天（maybe）

    const bookMode = "month"; // 预订模式，可以是 "month" 按月预订，和 "week" 按周预订
    const maxRetrys = 10; // 若预订失败的最大重试次数, 设为 0 则不断重试
    const useAutoGetAuthorization = true; // 自动获取授权令牌，若知道可以改为 false （注意，每次登录可能会不一样，请自行确认）
    const TryPeriod = 100; // 若请求失败，重复进行请求的周期（单位：ms），若太快不清楚服务器那边会做什么
    const BookWeeks = [2, 4, 6]; // 要预定的日子 of a week,取值为 [1, 7]
    const WaitHour = 18; // 需要等到的小时数，24小时制

    /// 用户配置结束 ///

    const scrambler = new Scrambler(config);

    // 通过劫持 XMLHttpRequest 的 setRequestHeader 方法，自动更新 Authorization, 不需要可以注释掉
    if (useAutoGetAuthorization) {
        let oldSetHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function (...args) {
            //console.log("From setRequestHeader", args);
            if (args[0] === "Authorization" && scrambler.Authorization === null) {
                scrambler.updateAuthorization(args[1]);
                GlobalAuthorization = args[1];
                // console.log(scrambler.Authorization);
            }
            return oldSetHeader.call(this, ...args);
        }
    }

    // 在页面添加赞赏码
    window.onload = function () {
        // 这里是页面所有资源加载完成后的回调代码
        console.log('所有资源已加载完成');
        setTimeout(() => {
            let div = document.querySelector('#root').children[0].children[2].cloneNode(true);
            const img = div.children[0].children[0];
            img.src = "https://s2.loli.net/2025/01/01/fvIsWQgBKmtNY7V.png";
            div.children[2].innerText = "请插件作者喝可乐";
            document.body.appendChild(div);
        }, 2500);
    };

    const targetTime = new Date();
    targetTime.setHours(WaitHour, 0, 0, 0);

    const scramblers = [];
    for (let i of BookWeeks) {
        config.week = i;
        const scramb = new Scrambler(config);
        scramb.StartAsync(targetTime, bookMode, maxRetrys, TryPeriod);
        scramblers.push(scramb);
    }
}

function Delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Scrambler {
    VenueId = { // 场地 ID 字典, 待填充
        1: 511508061201884,
        2: 511589859434885,
        3: 511687743682886,
        4: 511764318926887,
        5: 511839951512888,
        6: 511942956511889,
        7: 512037093039890,
        8: 512160523250891,
        9: 512288707374892,
        10: 512382636613893,
        11: 51246724428894,
        12: 512536644146895,
        13: 51262484178896,
        14: 512719988472897,
        15: 5128057837898,
        16: 512885983484899
    }

    PingPongVenueId = {
        14: 508739189072477
    }

    Authorization;
    UserId; // 用户 ID
    startTime; // 时间段
    endTime;
    week; // 星期几
    receipts; // 金额
    venue; // 场地
    date; // 日期，如果按月预定则填写下个月的最后一天
    #trys = 0; // 重试次数
    #header;
    #applyUrl = "https://venue.spe.scut.edu.cn/api/pc/order/rental/orders/apply";
    #payUrl = "https://venue.spe.scut.edu.cn/api/pc/order/rental/orders/pay";

    /**
     * Scrambler constructor
     * @param {Object} config configuration object, containing properties:
     * @param {string} config.Authorization authorization token
     * @param {number} config.UserId user ID
     * @param {string} config.startTime start time
     * @param {string} config.endTime end time
     * @param {number} config.week week number
     * @param {number} config.receipts receipts
     * @param {number} config.venue venue ID
     * @param {string} config.date date, if booking by month, fill in the last day of the next month
     */
    constructor(config) {
        for (let key in config) {
            this[key] = config[key];
        }

        this.#header = new Headers({
            "Host": "venue.spe.scut.edu.cn",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            // "Referer": "https://venue.spe.scut.edu.cn/vb-user/booking",
            "Content-Type": "application/json",
            "Authorization": this.Authorization,
            "Origin": "https://venue.spe.scut.edu.cn"
        });
    }

    async StartAsync(targetTime, mode = "month", maxTrys = 10, period = 100) {
        // 设置 Authorization
        if (this.Authorization === null || this.Authorization === undefined) {
            while (GlobalAuthorization === null) {
                await Delay(100);
            }
            this.updateAuthorization(GlobalAuthorization);
        }

        console.log(`准备预订周 ${this.week}，场地 ${this.venue}...`);

        // 等待时间到达
        while (true) {
            const now = new Date();
            let timeout = targetTime - now; // 计算时间
            if (timeout <= 0) {
                break;
            }
            console.log(`Not the time, waiting for ${timeout} ms...`);
            timeout = timeout > 10000 ? 10000 : timeout; // 最多延时 10s 以提高精度
            await Delay(timeout);
        }

        console.log(`Start booking week ${this.week} venue ${this.venue}...`);
        let succeed = false;
        succeed = await this.bookInterval(mode, maxTrys, period);
        if (succeed) {
            console.log("预订成功！:)");
            return true;
        }

        // 如果不成功就试试其它场地
        let tryVenueCount = 1;
        // this.venue = 17;
        while (tryVenueCount < 16) {
            this.venue++;
            if (this.venue > 16) {
                this.venue = 1;
            }
            console.log(`预定不成功，重新尝试场地 ${this.venue}`);
            succeed = await this.bookInterval(mode, 1, period); // 这里就只重试 1 次好了
            if (succeed) {
                console.log("预订成功！:)");
                return true;
            }
        }

        console.log("预订不成功 :(");
        return false;
    }

    /**
     * 周期性发送预定请求
     * @param {string} mode 预定模式，"month" 按月预定，"week" 按周预定
     * @param {number} maxTrys 最大请求次数
     * @param {number} period 请求周期
     * @returns true 表示成功，false 表示失败
     */
    async bookInterval(mode = "month", maxTrys = 10, period = 1000) {
        let trys = 0;
        let success = false;
        let bookMode = null;

        if (mode === "month") {
            bookMode = this.bookMonthly;
        } else if (mode === "week") {
            bookMode = this.bookWeekly;
        } else {
            console.log("Book mode unsupport! Must be `month` or `week`");
            return false;
        }

        // 确保 Authorization
        while (this.Authorization === null) {
            if (GlobalAuthorization !== null) {
                this.updateAuthorization(GlobalAuthorization);
                break;
            }

            await Delay(period);
        }

        // 开始预定
        while (trys++ < maxTrys) {
            try {
                const res = await bookMode.call(this);
                console.log("Book succeeded!", res);
                return true;
            } catch (err) {
                console.log("Error: ", err);
                await Delay(period);
            }
        }

        return false;
    }

    /**
     * Try to fetch the apply request and pay the order if succeeds.
     * If the request fails, retry after 1 second.
     * @returns {Promise} a promise that resolves to the pay info if succeeds, or rejects with an error object if fails
     */
    async bookMonthly() {
        const applyMonthBody = {
            "userId": this.UserId,
            "receipts": this.receipts,
            "buyerSource": 4,
            "stadiumId": 1,
            "mode": "month",
            "rentals": [{
                "belongDate": this.getBelongDate(this.date),
                "week": this.week,
                "start": this.startTime,
                "end": this.endTime,
                "venueId": this.VenueId[this.venue]
            }]
        }

        const applyMonthOption = {
            method: "POST",
            headers: this.#header,
            body: JSON.stringify(applyMonthBody),
            mode: "cors",
            cache: "no-cache"
        };

        const applyMonthRequest = new Request(this.#applyUrl, applyMonthOption);
        try {
            const res = await this.tryBook(applyMonthRequest);
            // console.log(res);
            return Promise.resolve(res);
        } catch (err) {
            // console.log(err);
            return Promise.reject(err);
        }
    }

    async bookPingPongMonthly() {
        const applyMonthBody = {
            "userId": this.UserId,
            "receipts": this.receipts,
            "buyerSource": 4,
            "stadiumId": 1,
            "mode": "month",
            "rentals": [{
                "belongDate": this.getBelongDate(this.date),
                "week": this.week,
                "start": this.startTime,
                "end": this.endTime,
                "venueId": this.PingPongVenueId[this.venue]
            }]
        }

        const applyMonthOption = {
            method: "POST",
            headers: this.#header,
            body: JSON.stringify(applyMonthBody),
            mode: "cors",
            cache: "no-cache"
        };

        const applyMonthRequest = new Request(this.#applyUrl, applyMonthOption);
        try {
            const res = await this.tryBook(applyMonthRequest);
            console.log(res);
            return await Promise.resolve(res);
        } catch (err) {
            console.log(err);
            return await Promise.reject(err);
        }
    }

    async bookWeekly() {
        const applyWeekBody = {
            "mode": "week",
            "userId": this.UserId,
            "receipts": this.receipts,
            "rentals": [
                {
                    "belongDate": this.getBelongDate(this.date),
                    "start": this.startTime,
                    "end": this.endTime,
                    "venueId": this.VenueId[this.venue],
                    "week": this.week
                }
            ],
            "buyerSource": 4,
            "stadiumId": 1
        }

        const applyWeekOption = {
            method: "POST",
            headers: this.#header,
            body: JSON.stringify(applyWeekBody),
            mode: "cors",
            cache: "no-cache"
        };

        const applyWeekRequest = new Request(this.#applyUrl, applyWeekOption);
        try {
            const res = await this.tryBook(applyWeekRequest);
            // console.log(res);
            return Promise.resolve(res);
        } catch (err) {
            // console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * 尝试一次请求
     * @param {Request} req Apply Request
     * @returns {Promise} 若成功返回 Promise.resolve(成功信息), 若失败返回 Promise.reject(失败信息)
     */
    async tryBook(req) {
        const response = await fetch(req);
        if (!response.ok) {
            return Promise.reject({
                "Error": "Apply Request Error",
                "Data": response
            });
        }

        const json = await response.json();
        if (json.code !== 1) {
            return Promise.reject({
                "Error": "Apply Error",
                "data": json
            });
        }
        const id = json.data.id;
        const payBody = {
            "id": id,
            "payMethod": 1,
            "payType": "wx_native"
        };
        const payOption = {
            method: "POST",
            headers: this.#header,
            body: JSON.stringify(payBody),
            mode: "cors",
            cache: "no-cache"
        };
        const payRequest = new Request(this.#payUrl, payOption);

        const payResponse = await fetch(payRequest);
        if (!payResponse.ok) {
            return Promise.reject({
                "Error": "Pay Request Error",
                "Data": payResponse
            });
        }

        const payJson = await payResponse.json();
        if (payJson.code !== 1) {
            return Promise.reject({
                "Error": "Pay Error",
                "Data": payJson
            });
        }
        const payInfo = payJson.data.payInfo;
        console.log(payInfo);
        return Promise.resolve(payJson);
    }

    /**
     * Calculates the belong date in milliseconds from a given date string.
     *
     * @param {string} date - The input date in the format "YYYY-MM-DD".
     * @returns {number} The corresponding belong date in milliseconds since the Unix epoch.
     */
    getBelongDate(date) {
        return new Date(date).getTime();
    }

    updateAuthorization(auth) {
        if (auth) {
            this.Authorization = auth;
            this.#header = new Headers({
                "Host": "venue.spe.scut.edu.cn",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Referer": "https://venue.spe.scut.edu.cn/vb-user/booking",
                "Content-Type": "application/json",
                "Authorization": auth,
                "Origin": "https://venue.spe.scut.edu.cn"
            });
        }
    }

    GetHeader() {
        return new Headers({
            "Host": "venue.spe.scut.edu.cn",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Referer": "https://venue.spe.scut.edu.cn/vb-user/booking",
            "Content-Type": "application/json",
            "Authorization": this.Authorization,
            "Origin": "https://venue.spe.scut.edu.cn"
        });
    }
}

main();
