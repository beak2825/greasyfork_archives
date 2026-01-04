// ==UserScript==
// @name         巴哈天天簽到
// @namespace    https://github.com/FlandreDaisuki
// @description  在巴哈任何頁面自動簽到
// @match        *://*.gamer.com.tw/*
// @exclude      *://user.gamer.com.tw/*
// @icon         https://i.imgur.com/LeSlv8b.png
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @connect      gamer.com.tw
// @version      0.1.5
// @noframes

// @author       FlandreDaisuki
// @homepageURL  https://github.com/FlandreDaisuki/Bahamut-Daily
// @license      MIT, Copyright (c) 2018 FlandreDaisuki
// @compatible   firefox
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/367737/%E5%B7%B4%E5%93%88%E5%A4%A9%E5%A4%A9%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/367737/%E5%B7%B4%E5%93%88%E5%A4%A9%E5%A4%A9%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

const store = {
  async get(name, failv = null) {
    if (window.GM_getValue) {
      // eslint-disable-next-line new-cap
      return Promise.resolve(GM_getValue(name) || failv);
    } else {
      return (await GM.getValue(name)) || failv;
    }
  },
  async set(name, value) {
    if (window.GM_setValue) {
      // eslint-disable-next-line new-cap
      GM_setValue(name, value);
    } else {
      GM.setValue(name, value);
    }
  },
};

(async () => {
  const BAHAID = document.cookie.replace(/.*\bBAHAID=(\w+)\b.*/ig, '$1');
  if (!BAHAID) {
    // not logged in
    return;
  }
  const today = (new Date()).toLocaleDateString();
  const signinDay = await store.get(BAHAID);
  if (signinDay === today) {
    // check and early return to save bandwidth to bahamut
    return;
  } else {
    if (await checkSignedIn()) {
      await store.set(BAHAID, today);
    } else {
      const result = await doSignIn();
      if (result.message === '簽到成功') {
        await store.set(BAHAID, today);
        popupAwardTable($.noConflict(true), result);
      }
    }
  }
})();

async function ajax(details) {
  const xhr = window.GM_xmlhttpRequest || (GM ? GM.xmlHttpRequest : null);
  if (!xhr) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    Object.assign(details, {
      onload: resolve,
      onabort: reject,
      onerror: reject,
      ontimeout: reject,
    });
    xhr(details);
  });
}

async function checkSignedIn() {
  const response = await ajax({
    method: 'POST',
    url: 'https://www.gamer.com.tw/ajax/signin.php',
    data: 'action=2',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': document.cookie,
    },
  }).catch(console.error);
  // signin: -1, 未登入
  // signin:  0, 未簽到
  // signin:  1, 已簽到
  return JSON.parse(response.responseText).signin > 0;
}

async function getToken() {
  const response = await ajax({
    method: 'GET',
    url: `https://www.gamer.com.tw/ajax/get_csrf_token.php?_=${Date.now()}`,
    headers: {
      Cookie: document.cookie,
    },
  }).catch(console.error);

  return response.responseText;
}

async function doSignIn() {
  const token = await getToken();
  const response = await ajax({
    method: 'POST',
    url: 'https://www.gamer.com.tw/ajax/signin.php',
    data: `action=1&token=${token}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': document.cookie,
    },
  }).catch(console.error);

  const result = JSON.parse(response.responseText);

  // prevent remote script injection
  result.nowd = Number(result.nowd);
  result.days = Number(result.days);

  console.info(result.message);

  return result;
}

function popupAwardTable($, { nowd, days }) {
  /* nowd: 表格簽到數 === (days - 1 % 28) + 1 */
  /* days: 連續簽到日數 */
  setTimeout(() => {
    $('.reword-progress-bar')
      .css('transition', `width ${nowd * 100}ms linear`)
      .css('width', `calc((100% / 28) * ${nowd})`);

    $('.bonus-day').slice(0, nowd).toArray().forEach((e, i) => {
      setTimeout(() => {
        $(e).addClass('is-active');
        if (i % 7 === 6) {
          $($('.reword-content > .daily-img')[Math.floor(i / 7)]).addClass('passthrough-effect');
        }
      }, 100 * i);
    });

    $('#📅, .popoup-close').on('click', (event) => {
      $('#📅').fadeOut(600);
      setTimeout(() => {
        $('#📅').remove();
      }, 1000);
      return false;
    });
  }, 1000);

  const bonusMonthTitle = Array(7)
    .fill()
    .map((e, i) => i + 1)
    .reduce((str, num) => {
      return str + $(`<li class="col"><div class="daily-num bonus-month-title">${num}</div></li>`)[0].outerHTML;
    }, '');
  const bonusDayLists = Array(28)
    .fill()
    .map((e, i) => i + 1)
    .reduce((str, num) => {
      if (num === 28) {
        return str + $(`<li class="col col-padding">
                    <div class="bonus-day" id="day-${num}">
                      <div class="daily-check"></div>
                      <div class="daily-img" style="background-image: url(https://i2.bahamut.com.tw/dailyBonus/badge.svg);"></div>
                      <div class="daily-num">
                        <span class="coin">勇者</span>
                        <span class="coin-unit">勳章</span>
                      </div>
                    </div>
                  </li>`)[0].outerHTML + '<li></li>';
      } else if (num % 7 === 0) {
        return str + $(`<li class="col col-padding">
                    <div class="bonus-day" id="day-${num}">
                      <div class="daily-check"></div>
                      <div class="daily-img" style="background-image: url(https://i2.bahamut.com.tw/dailyBonus/${num}day.svg);"></div>
                      <div class="daily-num">
                        <span class="coin">500</span>
                        <span class="coin-unit">巴幣</span>
                      </div>
                    </div>
                  </li>`)[0].outerHTML + '<li></li>';
      } else {
        return str + $(`<li class="col col-padding">
                    <div class="bonus-day" id="day-${num}">
                      <div class="daily-check"></div>
                      <div class="daily-img" style="background-image: url(https://i2.bahamut.com.tw/dailyBonus/coin.svg);"></div>
                      <div class="daily-num">
                        <span class="coin">20</span>
                        <span class="coin-unit">巴幣</span>
                      </div>
                    </div>
                  </li>`)[0].outerHTML + '<li></li>';
      }
    }, '');

  $('body').append(`
<div id="📅" class="popup-wrap fade is-show">
  <div class="popup-container">
    <div class="popup-content">
      <div class="modal">
        <div class="modal__header daily-header">
          <div class="daily-title">
            <h3 class="daily-title__text">每日簽到</h3>
          </div>
        </div>
        <div class="modal__body ">
          <div class="daily-progress-wrap">
            <div class="reword-progress-wrap">
              <div class="reword-progress">
                <div class="reword-progress-node">
                  <div class="reword-content">
                    <div class="daily-img" style="background-image: url(https://i2.bahamut.com.tw/dailyBonus/7day.svg);"></div>
                    <div class="daily-num">7 天</div>
                  </div>
                </div>
                <div class="reword-progress-node sec">
                  <div class="reword-content">
                    <div class="daily-img" style="background-image: url(https://i2.bahamut.com.tw/dailyBonus/14day.svg);"></div>
                    <div class="daily-num">14 天</div>
                  </div>
                </div>
                <div class="reword-progress-node third">
                  <div class="reword-content">
                    <div class="daily-img" style="background-image: url(https://i2.bahamut.com.tw/dailyBonus/21day.svg);"></div>
                    <div class="daily-num">21 天</div>
                  </div>
                </div>
                <div class="reword-progress-node fourth">
                  <div class="reword-content">
                    <div class="daily-img" style="background-image: url(https://i2.bahamut.com.tw/dailyBonus/badge.svg);"></div>
                    <div class="daily-num">28 天</div>
                  </div>
                </div>
                <div class="reword-progress-bar"></div>
              </div>
            </div>
            <div class="daily-tips mobile-tip">已連續簽到 ${days} 天</div>
          </div>
          <div class="bonus-month">
            <ul class="row grid-7 bonus-month__content">
              ${bonusMonthTitle} ${bonusDayLists}
            </ul>
          </div>
        </div>
        <div class="modal__footer ">
          <div class="modal-ctrl">
            <a role="button" class="popoup-ctrl-btn popoup-close">關閉</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`);

  $('head').append(`
<style>
#📅.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10010;
  width: 100%;
  height: 100%;
  outline: none !important;
  -webkit-backface-visibility: hidden;
  overflow-x: hidden;
  background-color: #000A;
}
#📅 .popup-container::before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
#📅 .popup-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 8px;
  box-sizing: border-box;
}
#📅 .popup-content {
  position: relative;
  z-index: 10010;
  display: inline-block;
  margin: 0 auto;
  width: 98%;
  text-align: left;
  vertical-align: middle;
}
#📅 .modal {
  position: relative;
  margin: 20px auto;
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}
#📅 .daily-header {
  padding-top: 15px;
}
#📅 .daily-title {
  display: block;
  margin: 0 auto 15px;
  padding: 12px 0 0;
  height: 66px;
  background: url(https://i2.bahamut.com.tw/dailyBonus/ribbon-desktop.svg) no-repeat center bottom;
  background-size: contain;
  text-align: center;
  box-sizing: border-box;
}
#📅 .daily-title__text {
  font-size: 24px;
  line-height: 1;
  color: #7B4901;
}
#📅 .daily-progress-wrap {
  padding: 80px 35px 15px;
}
#📅 .reword-progress-wrap {
  margin-bottom: 10px;
  padding: 0 20px 0 0;
}
#📅 .reword-progress {
  position: relative;
  width: 100%;
  height: 3px;
  border-radius: 10px;
  background-color: #D9D9D9;
  box-sizing: border-box;
}
#📅 .reword-progress-node {
  position: absolute;
  top: 0;
  left: calc(25% - 8px);
  margin-top: -6px;
  width: 8px;
  height: 8px;
  border: 4px solid #D9D9D9;
  border-radius: 100%;
  background-color: #fefefe;
  transition: border 250ms ease-in;
  box-sizing: content-box;
}
#📅 .reword-content {
  position: absolute;
  top: -65px;
  right: -15px;
}
#📅 .daily-img.passthrough-effect {
  transform: rotateY(-1080deg);
  transform-origin: center center;
}
#📅 .daily-img {
  margin: 0 auto 5px;
  width: 40px;
  height: 40px;
  background: transparent center center no-repeat;
  transition: transform 1s cubic-bezier(.17,.84,.44,1);
}
#📅 .daily-num {
  text-align: center;
}
#📅 .reword-progress-node.sec {
  left: calc(50% - 8px);
}
#📅 .reword-progress-node.third {
  left: calc(75% - 8px);
}
#📅 .reword-progress-node.fourth {
  left: calc(100% - 8px);
}
#📅 .reword-progress-bar {
  width: 0;
  height: 100%;
  background-color: #FFC849;
}
#📅 .row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  box-sizing: border-box;
}
#📅 [class*="grid-7"] > .col {
  -ms-flex-preferred-size: 14.28571%;
  flex-basis: 14.28571%;
  max-width: 14.28571%;
}
#📅 .bonus-month__content {
  margin-bottom: 5px;
  padding: 15px 15px 0;
  background-color: #FFEEB3;
}
#📅 .bonus-month-title {
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 1;
  color: #8C6631;
}
#📅 [class*="col-"][class*="-padding"] {
  padding: 0 8px;
}
#📅 [class*="col-"] {
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  box-sizing: border-box;
}
#📅 .bonus-day {
  position: relative;
  margin-bottom: 16px;
  padding: 6px 4px;
  background-color: #fefefe;
  border: 3px solid transparent;
  border-radius: 5px;
  box-sizing: border-box;
}
#📅 .bonus-day.is-active {
  border: 3px solid #64A6AE;
  transition: all 300ms ease-in;
}
#📅 .daily-check {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  background: rgba(254, 254, 254, 0.7) url(https://i2.bahamut.com.tw/dailyBonus/check.svg) center center no-repeat;
  transition: all 150ms ease-in;
  -webkit-transform: translate(0, -12%);
  transform: translate(0, -12%);
}
#📅 .bonus-day.is-active .daily-check {
  opacity: 1;
  visibility: visible;
  -webkit-transform: translate(0, 0);
  transform: translate(0, 0);
}
#📅 .modal__footer {
  padding: 15px;
}
#📅 .modal-ctrl {
  text-align: center;
}
#📅 .popoup-ctrl-btn {
  display: inline-block;
  padding: 15px 40px;
  background-color: #039CAD;
  font-size: 16px;
  color: #fff;
  line-height: 1;
  text-align: center;
  box-sizing: border-box;
  border-radius: 3px;
  cursor: pointer;
}
</style>
`);
}
