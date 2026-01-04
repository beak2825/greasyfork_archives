// ==UserScript==
// @name        来客推送电话到后台 - douyin.com
// @namespace   Violentmonkey Scripts
// @match       https://life.douyin.com/p/fulfillsettle/tradeDetail
// @require     https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require     https://cdn.jsdelivr.net/npm/dayjs@1.11.9/dayjs.min.js
// @grant       none
// @version     1.0.1
// @author      -
// @description 2023/8/16 下午2:29:10
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473166/%E6%9D%A5%E5%AE%A2%E6%8E%A8%E9%80%81%E7%94%B5%E8%AF%9D%E5%88%B0%E5%90%8E%E5%8F%B0%20-%20douyincom.user.js
// @updateURL https://update.greasyfork.org/scripts/473166/%E6%9D%A5%E5%AE%A2%E6%8E%A8%E9%80%81%E7%94%B5%E8%AF%9D%E5%88%B0%E5%90%8E%E5%8F%B0%20-%20douyincom.meta.js
// ==/UserScript==

;(() => {
  'use strict'


  const postData = async (item) => {


    await axios.post('https://commonform.xahmyy.com/api/laike_store',item)


  }

  const statusList = {
    1 : '未核销',
    2 : '已核销',
    3 : '退款'
  }

   const work = async (fnList = [], max = 10, taskName = 'default') => {
      const count = fnList.length; // 总任务数量
      if (!count) return;

      const startTime = new Date().getTime(); // 记录任务执行开始时间


      let current = 0;
      // 任务执行程序
      const schedule = async (index) => {
          return new Promise(async (resolve) => {
              const fn = fnList[index];
              if (!fn) return resolve();

              // 执行当前异步任务
              await fn();


              // 执行完当前任务后，继续执行任务池的剩余任务
              await schedule(index + max);

              resolve();
          });
      };

      // 任务池执行程序
      const scheduleList = new Array(max)
          .fill(0)
          .map((_, index) => schedule(index));
      // 使用 Promise.all 批量执行
      const r = await Promise.all(scheduleList);

      const cost = (new Date().getTime() - startTime) / 1000;

  };

  const getData = async () => {
    const yesterdayStart = dayjs().subtract(1, 'day').startOf('day');
    const todayEnd = dayjs().endOf('day');
    const yesterdayStartTimestamp = Math.floor(yesterdayStart.valueOf()/1000);
    const todayEndTimestamp = Math.floor(todayEnd.valueOf()/1000);
    let data = JSON.stringify({
      "filter": {
        "start_time": yesterdayStartTimestamp,
        "end_time": todayEndTimestamp,
        "is_market": false
      }
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://life.douyin.com/life/fulfilment/v1/query/certificate_list?end_time=${todayEndTimestamp}&page_index=1&page_size=1000&start_time=${yesterdayStartTimestamp}&root_life_account_id=7210663566225983546`,
      headers: {
        'authority': 'life.douyin.com',
        'sec-ch-ua': '"Chromium";v="94", "Microsoft Edge";v="94", ";Not A Brand";v="99"',
        'ac-tag': 'smb_m',
        'x-tt-trace-id': '00-fd0e6acb1860b287d1c491cb-fd0e6acb1860b287-01',
        'x-secsdk-csrf-token': '000100000001392726b9aa4de77fdfd1b2e321dd77477448bb3c1ef27ba2bf41e73760834598177bc986e3349a7a',
        'x-tt-trace-log': '01',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36 Edg/94.0.992.31',
        'content-type': 'application/json',
        'accept': 'application/json, text/plain, */*',
        'sec-ch-ua-mobile': '?0',
        'x-tt-ls-session-id': '9077f8c1-8535-4068-b7b3-eafd3c06b5a3',
        'agw-js-conv': 'str',
        'sec-ch-ua-platform': '"macOS"',
        'origin': 'https://life.douyin.com',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://life.douyin.com/p/fulfillsettle/tradeDetail?groupid=1765397444684812',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      },
      data : data
    };

    let response = await axios.request(config)
    let result = response.data?.data?.list;
    if(!result?.length) return;
    result = result.map((item) => {
      let payAmount = item.amount?.pay_amount || 0;
      let payTime  = dayjs(item.pay_time * 1000).format('YYYY-MM-DD HH:mm:ss');
      let status = statusList[item.status] || item.status;
      let hospitalName = item.intention_poi_info.poi_name;
      return {
        phone : item.user?.tel,
        leads_id: item.order_id,
        question_data: `${item.sku.title}\n\r金额:${payAmount / 100}\r\n 开单时间: ${payTime}\r\n 状态:${status}`,
        created_at: payTime,
        group_id: 4,
        channel: hospitalName,
      }
    }).filter((item) => {
      return item.phone && !item.channel.includes("北京")
    });

    console.log(result)

    await work(result.map((item) => () => postData(item) ) , 10)

    setTimeout(() => {
      location.reload();
    },60000)

  }

  setTimeout(async () => {
    await getData();
  },8000)

})();