// ==UserScript==
// @name pterclub-auto-wof加强版
// @namespace http://tampermonkey.net/
// @version 0.2
// @description 白兔大转盘自动抽奖,安装后打开大转盘页面,就会自动抽奖,打开console可以看到抽奖详情（参考猫站修改，感谢 wget, source 大佬）
// @author Cat911
// @match https://pterclub.com/wof.php*
// @match https://pterclub.com/dowof.php*
// @match https://club.hares.top/wof.php*
// @match https://club.hares.top/dowof.php*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/483397/pterclub-auto-wof%E5%8A%A0%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/483397/pterclub-auto-wof%E5%8A%A0%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var clearBonus = {
    container: '.Detail', // 渲染容器

    lotteryData: {
      // 抽奖基础数据
      autoStatus: 0, // 默认关闭抽奖，-1 表示一直自动抽
      lotteryTimes: 0,
      winning1Times: 0,
      winning2Times: 0,
      winning3Times: 0,
      winning4Times: 0,
      winning5Times: 0,
      winning6Times: 0,
      winning7Times: 0,
    },

    pageData: {
      totalBonus: 0,
      price: 2000, // 每次消耗
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    getData() {
      const lotteryData = JSON.parse(localStorage.getItem('lotteryData'));
      if (lotteryData) {
        this.lotteryData = lotteryData;
      }
    },

    renderLog() {
      $('.auto-times').val(this.lotteryData.autoStatus == 0 ? 10 : this.lotteryData.autoStatus);
      $('.current-status').text(`当前状态: ${this.lotteryData.autoStatus == 0 ? '已停止' : '抽奖中'}`);
      $('.log').html(`
        已抽奖次数: ${this.lotteryData.lotteryTimes},
        还可以抽奖次数: ${parseInt(this.pageData.totalBonus / this.pageData.price)}}<br/>
        已中一等奖次数: ${this.lotteryData.winning1Times}, 当前概率：${(this.lotteryData.winning1Times/this.lotteryData.lotteryTimes*100).toFixed(2)}%<br/>
        已中二等奖次数: ${this.lotteryData.winning2Times}, 当前概率：${(this.lotteryData.winning2Times/this.lotteryData.lotteryTimes*100).toFixed(2)}%<br/>
        已中三等奖次数: ${this.lotteryData.winning3Times}, 当前概率：${(this.lotteryData.winning3Times/this.lotteryData.lotteryTimes*100).toFixed(2)}%<br/>
        已中四等奖次数: ${this.lotteryData.winning4Times}, 当前概率：${(this.lotteryData.winning4Times/this.lotteryData.lotteryTimes*100).toFixed(2)}%<br/>
        已中五等奖次数: ${this.lotteryData.winning5Times}, 当前概率：${(this.lotteryData.winning5Times/this.lotteryData.lotteryTimes*100).toFixed(2)}%<br/>
        已中六等奖次数: ${this.lotteryData.winning6Times}, 当前概率：${(this.lotteryData.winning6Times/this.lotteryData.lotteryTimes*100).toFixed(2)}%<br/>
        中谢谢参与次数: ${this.lotteryData.winning7Times}, 当前概率：${(this.lotteryData.winning7Times/this.lotteryData.lotteryTimes*100).toFixed(2)}%
      `);
    },

    openAutoLottery() {
      this.lotteryData.autoStatus = -1;
      localStorage.setItem('lotteryData', JSON.stringify(this.lotteryData));
      window.location.reload();
    },

    closeAutoLottery() {
      this.lotteryData.autoStatus = 0;
      localStorage.setItem('lotteryData', JSON.stringify(this.lotteryData));
    },

    setLotteryTime(t) {
      this.lotteryData.autoStatus = t;
      localStorage.setItem('lotteryData', JSON.stringify(this.lotteryData));
      window.location.reload();
    },

    init() {
      this.pageData.totalBonus = parseInt($('b')[0].innerText.substr(7).replaceAll(',', ''));
      this.getData();

      $(this.container).append(`
        <div style="margin:5px 0;">
          ${
            this.lotteryData.autoStatus == 0
              ? `<button class="auto-start"> 一直抽奖 </button>`
              : ``
          }
          ${
            this.lotteryData.autoStatus != -1
              ? `<span> 再抽<input class="auto-times" type="number" size="5" value="10"></input>次 ${
                  this.lotteryData.autoStatus == 0
                    ? `<button class="set-times"> 开始 </button></span>`
                    : ``
                }`
              : ``
          }
          ${
            this.lotteryData.autoStatus != 0
              ? `<button class="auto-stop"> 停止抽奖 </button>`
              : ``
          }
          <span class="current-status"></span>
        </div>
        <div class="log"></div>
      `);

      this.renderLog();

      window.alert = (message) => {
        this.lotteryData.lotteryTimes++;
        if (message.indexOf('一等奖') == 0) {
          this.lotteryData.winning1Times++;
        }
        if (message.indexOf('二等奖') == 0) {
          this.lotteryData.winning2Times++;
        }
        if (message.indexOf('三等奖') == 0) {
          this.lotteryData.winning3Times++;
        }
        if (message.indexOf('四等奖') == 0) {
          this.lotteryData.winning4Times++;
        }
        if (message.indexOf('五等奖') == 0) {
          this.lotteryData.winning5Times++;
        }
        if (message.indexOf('六等奖') == 0) {
          this.lotteryData.winning6Times++;
        }
        if (message.indexOf('谢谢参与奖') == 0) {
          this.lotteryData.winning7Times++;
        }
        if (this.lotteryData.autoStatus > 0) {
          this.lotteryData.autoStatus--;
        }
        localStorage.setItem('lotteryData', JSON.stringify(this.lotteryData));
      };

      console.log(this.lotteryData);

      if (this.lotteryData.autoStatus) {
        this.sleep(3000).then(() => {
          $('#inner').click();
        });
      }

      $('.auto-start').click(() => {
        this.openAutoLottery();
      });

      $('.auto-stop').click(() => {
        this.closeAutoLottery();
      });

      $('.set-times').click(() => {
        this.setLotteryTime(Number($('.auto-times').val()));
      });
    },
  };

  clearBonus.init();
})();
