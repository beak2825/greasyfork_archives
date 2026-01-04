// ==UserScript==
// @name         掘金抽奖
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  掘金抽奖 签到 免费抽奖 5连抽 10连抽 可视化抽奖 petite-vue
// @author       无仙
// @match        https://juejin.cn/*
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @require      https://unpkg.com/petite-vue
// @downloadURL https://update.greasyfork.org/scripts/431740/%E6%8E%98%E9%87%91%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431740/%E6%8E%98%E9%87%91%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const { createApp } = PetiteVue; // 不会吧不会吧，不会还有人不知道petite-vue吧

  const root = document.createElement('div');
  root.class = 'wx_draw_wrap';
  root.innerHTML = `
    <div v-show="!popup" class="wx_draw" @click="open">掘金抽奖</div>

    <div v-if="popup" class="wx_popup">
      <div class="wx_mask" @click="popup = false"></div>

      <div class="wx_main">
        <div class="wx_header">
          <div>掘金抽奖</div>
          <div class="wx_score">当前矿石：{{ score }}</div>
        </div>

        <div class="wx_body">
          <div class="wx_options">
            <div @click="check_in" v-if="check_status === -1 || check_status === false">签到</div>
            <div @click="get_free" v-else>签到成功</div>
            <div @click="draw(5)">5连抽</div>
            <div @click="draw(10)">10连抽</div>
            <div @click="draw(undefined)">梭哈抽奖</div>
          </div>

          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <thead>
              <tr>
                <th>奖品图片</th>
                <th>奖品名称</th>
                <th>中奖次数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in award">
                <td><img :src="item.lottery_image"/></td>
                <td>{{ item.lottery_name }}</td>
                <td>{{ item.times }}</td>
              </tr>
            </tbody>
          </table>

          <div class="wx_loading" v-if="loading">
            <svg class="circular" viewBox="25 25 50 50">
              <circle class="path" cx="50" cy="50" r="20" fill="none" />
            </svg>
          </div>
        </div>

        <div class="wx_footer">
          <div class="wx_confirm wx_btn" @click="popup = false">关闭</div>
        </div>
      </div>
    </div>
  `;

  // 查询奖品列表
  const res = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
    headers: {
      cookie: document.cookie
    },
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());

  const award = (res.data && res.data.lottery ? res.data.lottery : []).map((item) => ({ ...item, times: 0 }));
  const { free_count, point_cost } = res.data; // 剩余免费抽奖次数，单次抽奖消耗数

  document.body.appendChild(root); // 插入DOM

  // petite-vue init初始化
  createApp({
    award,
    popup: false,
    loading: false,
    score: 0,
    free_count,
    check_status: -1,

    async open() {
      const res = await fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
        headers: {
          cookie: document.cookie
        },
        method: 'GET',
        credentials: 'include'
      }).then((res) => res.json());

      this.score = res.data; // 当前分数

      this.popup = true;

      (this.check_status === -1 || this.check_status === false) && this.get_status();
    },
    async draw(times, is_not_free = true) {
      if (this.loading || times === 0) return;

      // const is_not_free = !(this.free_count && times === 1);

      if (is_not_free && this.score < point_cost * (times || 1)) return alert('分都不够想啥呢？');

      let i = 0;
      const drawFn = async () => {
        if ((is_not_free && this.score < point_cost) || i === times) {
          this.free_count = 0;
          this.loading = false;
          this.open();
          console.log(`${times ? times + '连抽' : '梭哈'}结束！`);
          return;
        }

        const result = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
          headers: {
            cookie: document.cookie
          },
          method: 'POST',
          credentials: 'include'
        }).then((res) => res.json());

        if (result.err_no !== 0) {
          console.log(result.err_msg);
          this.loading = false;
          this.open();
          return;
        }

        i++;
        is_not_free && (this.score -= point_cost);

        if (result.data.lottery_type === 1) this.score += 66;

        const item = this.award.find((item) => item.lottery_id === result.data.lottery_id);
        item.times++;

        console.log(`抽到：${result.data.lottery_name}`);
        drawFn();
      };

      console.log(`开始${times ? times + '连抽' : '梭哈'}！`);
      this.loading = true;
      this.award.forEach((item) => {
        item.times = 0;
      });
      try {
        drawFn();
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
    async check_in() {
      if (this.check_status) {
        this.get_free(); // 免费抽奖
        return;
      }

      // 签到
      const check_in = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
        headers: {
          cookie: document.cookie
        },
        method: 'POST',
        credentials: 'include'
      }).then((res) => res.json());

      if (check_in.err_no !== 0) {
        alert('签到失败！');
        this.check_status = false;
        return;
      }

      this.check_status = true;
      this.score = check_in.data.sum_point;
      this.get_free(); // 免费抽奖
    },
    async get_status() {
      // 查询签到状态
      const today_status = await fetch('https://api.juejin.cn/growth_api/v1/get_today_status', {
        headers: {
          cookie: document.cookie
        },
        method: 'GET',
        credentials: 'include'
      }).then((res) => res.json());

      this.check_status = today_status.data;
    },
    async get_free() {
      // 查询是否有免费抽奖次数
      const res = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
        headers: {
          cookie: document.cookie
        },
        method: 'GET',
        credentials: 'include'
      }).then((res) => res.json());

      this.free_count = res.data.free_count;

      if (res.data.free_count) {
        // 有免费抽奖次数
        this.draw(res.data.free_count, false);
      }
    }
  }).mount();

  // 处理样式
  const style = `
    .wx_draw_wrap {
      box-sizing: border-box;
      position: fixed;
      top: 50%;
      left: 0px;
      z-index: 888888;
      margin-top: -20px;
    }
    .wx_draw {
      box-sizing: border-box;
      position: fixed;
      top: 50%;
      left: 0px;
      z-index: 888888;
      width: 40px;
      height: 40px;
      line-height: 16px;
      font-size: 12px;
      padding: 4px;
      background-color: rgb(232, 243, 255);
      border: 1px solid rgb(232, 243, 255);
      color: rgb(30, 128, 255);
      text-align: center;
      overflow: hidden;
      cursor: pointer;
    }
    .wx_popup {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 999999;
    }
    .wx_mask {
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
    }
    .wx_main {
      --width: 460px;
      position: absolute;
      left: 50%;
      top: 50%;
      width: var(--width);
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 4px;
    }
    .wx_main .wx_header {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      padding: 0 16px;
      border-bottom: 1px solid #999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #000;
      font-weight: 400;
    }
    .wx_score {
      font-size: 12px;
      font-size: #00a100;
    }
    .wx_main .wx_body {
      padding: 16px;
      border-bottom: 1px solid #999;
      position: relative;
    }
    .wx_main .wx_options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .wx_main .wx_options div {
      width: 80px;
      text-align: center;
      height: 24px;
      line-height: 24px;
      background-color: rgb(232, 243, 255);
      border: 1px solid #c9d4e3;
      color: rgb(30, 128, 255);
      cursor: pointer;
      border-radius: 2px;
    }
    .wx_main .wx_body p {
      margin: 0 0 8px;
    }
    .wx_body table {
      width: 100%;
      text-align: center;
      border-left: 1px solid #ccc;
      border-top: 1px solid #ccc;
    }
    .wx_body table th,
    .wx_body table td {
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      line-height: 20px;
    }
    .wx_body table th {
      line-height: 28px;
    }
    .wx_main .wx_body img {
      vertical-align: middle;
      width: 40px;
      height: 40px;
    }
    .wx_main .wx_footer {
      padding: 12px 16px;
      text-align: right;
    }
    .wx_btn {
      display: inline-block;
      width: 48px;
      cursor: pointer;
      text-align: center;
      height: 20px;
      line-height: 20px;
      background-color: rgb(232, 243, 255);
      border: 1px solid #c9d4e3;
      color: rgb(30, 128, 255);
      border-radius: 2px;
    }
    .wx_loading {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      background: rgba(0,0,0,0.65);
    }
    .wx_loading .circular {
      height: 42px;
      width: 42px;
      -webkit-animation: loading-rotate 2s linear infinite;
      animation: loading-rotate 2s linear infinite;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -21px;
      margin-left: -21px;
    }
    .wx_loading .path {
      -webkit-animation: loading-dash 1.5s ease-in-out infinite;
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: #409eff;
      stroke-linecap: round;
    }
    @keyframes loading-rotate {
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes loading-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = style;
  document.head.appendChild(styleEl);
})();
