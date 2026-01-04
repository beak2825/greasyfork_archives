// ==UserScript==
// @name         PtTime自动签到
// @namespace    bear
// @version      1.0
// @description  每天在首次进入pttime论坛时,自动跳转到签到页面进行签到.
// @license MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE2UlEQVR4nO2aeYhWVRjGf02jYs5YUrTYQlKp0YJQSUUGNTUtVloiBIFSUUi2UJBGJCRkzpRBUVFR0PKHFbRRUKGRS2ZFCy1EqVhpTZljVk6bbVdeeK68XO795pv57vZdfeAwyzn3nPPc8+7nQjEYBcwEXgI2A78BHwLXAq1UBPsCM4BXgO1AkNDeB8bQpDgMuAFYCfznSP0DLAVmAYcCw4ApwDfq3wJMpkkwRiRXAf87kn+JpPUdkPDs3sBzGm/P3gcMoYQ4Bpgrkl48/5AImyiPrHOuPfRS/tYcK4DRaW52MvBdgj71At0xhsQ2NRHoAtZFntkKPCkRHd7Avk4HejTnJuBMUsK3NQxI2BZJH8+RmG2M9NuGHgE6UxbB/YE3tMa/wDygpdFJA7U4nFbjJWwA7tVJ7El2sLnnO6P3OrBfVoR9v/nLd4GFwEkS6zzRqT0EkspTsyacJa6RHdkiuzAiYdwhzjCaUbtpMC8+KJBwO/BMjLp8DZyb8IwZ0NudiL+syK30hCc4C/8LMA04USFmuOZiGa44TJFHsHHrgRPKTHgG8Lvm/Qg4MnKC5of71P+z/o6zzuY53nGBjY0rFeHhwKNuzqeAvRLGHg685sZaeHp0zLhhcpXhuOcVsSUiK8Jv1+HfB9r+BG5L8PWXAts07gvg2LwJv5UB4bB9luCWxgGfaoypzMw8CacN0+2pLsY2K/1gTIxuKvK42/dj0RC3WQiHWBE5bfPfF8eMu1zJi435GBjbjITNGP2g/UyP2IkXgYMj448H1qj/J4l83YQtGHhWIV5esLSwQ5HYA4rfAxFFrsr6ftX/7efsiAtr18uw/lc9oThMSjAaqxqJZWN0c6z08xbgCeA9BSNxa38g/+thJ/uCG7MaOM71j3IvpK70sFvBwRylgt7n7dSNftCmaOgyYIEqG5/3U9/qlc5a6nkjcEo/6eFUl9ubcbsD2Ae4wrkrzqtBenNMAaBNsWyfm/ghkbE3eRBwhupVFhAscaIY18zafiVxs7z7KqWlVvQbDMxq3x+poQVqV9IADgQeVkGuHt9pod8nsgPzFShMaLAqUgsnK3c21VgLXJ3WxON0kusknj9Kh8z/3QxcAByRcZFgN3aj5LBcd7muYKwtAy6kouiqYfjMnVXuZAMZvzmKtEaryB/6azOClcFykTKCUcxV35tUCH0iZcFLnN8PlORXAq0unVutEHa72ib9L9CYpr5DHilxjV7f1GobpeOWCTUVLorE8V/KSltKOF4F+RH6/SzF9WsixJvCXbUA90Ru/QdyO9ihNDF8flEal2xZwTb2tMu0Zg/ynsqeuc4lL4vLSvpubXCr0shG0aFifZi3lwqXuJNNg6wnHZ60FQFKgTZnoEyM08b1mntDjdvHXDHPGags7pZbdE9la9xKwWh1tabUvtWIwdnulAstOJzvi2gZY63Wsu9RCsNd2oR9LpGXF7iTAhHeEJg1zRqd7nq1MIRx8lE5rDVea9lnjIUhzILMNWWNdnddmjuGOP0tonXnnUqGBqTI1p0n4V4tmtbF20AQfkVo10W5IXzLRSHIe/1SEh4qOf++BPqWVetRJWVof4XvqrUu3EfYRRiWvA1YTxn0LC8EIc9djnCPfrFjryomeZHelYzWQiNsptpIhyddxbbTLe0A1mY9bPYt6XkAAAAASUVORK5CYII=
// @author       ukid
// @match     *://*.pttime.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540459/PtTime%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/540459/PtTime%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
  // Cookie管理
  const CookieManager = {
    // 设置cookie
    setCookie: function(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },

    // 获取cookie
    getCookie: function(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    // 获取今天的日期字符串（格式：YYYY-MM-DD）
    getTodayString: function() {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    // 检查今天是否已签到
    checkSignedIn24Hours: function(site) {
      const cookieName = `pt_sign_${site}`;
      const lastSignDate = this.getCookie(cookieName);
      const today = this.getTodayString();

      return lastSignDate === today;
    },

    // 记录签到时间
    recordSignIn: function(site) {
      const cookieName = `pt_sign_${site}`;
      this.setCookie(cookieName, this.getTodayString(), 1); // 保存1天
    }
  };

  // 站点配置
  const siteConfigs = {
      'pttime': {
          selector: 'a.faqlink',
          filter: (el) => el.innerText.trim() === '签到领魔力'
      }
  };

  // 获取当前站点配置
  function getCurrentSiteConfig() {
      const host = window.location.host;
      const href = window.location.href;

      for (const [site, config] of Object.entries(siteConfigs)) {
          if (host.indexOf(site) !== -1) {
              // 检查是否需要排除特定路径
              if (config.excludePath && href.indexOf(config.excludePath) !== -1) {
                  continue;
              }
              return { site, config };
          }
      }
      return null;
  }

  // 执行签到
  function performSignIn() {
      const siteInfo = getCurrentSiteConfig();
      if (!siteInfo) {
          console.log('未找到站点配置');
          return;
      }

      const { site, config } = siteInfo;

      // 检查24小时内是否已签到
      if (CookieManager.checkSignedIn24Hours(site)) {
          console.log(`[PT签到] ${site} 24小时内已签到，跳过`);
          return;
      }

      const elements = Array.from(document.querySelectorAll(config.selector));
      const targetElement = elements.find(config.filter);

      if (!targetElement) {
          console.log('未找到签到元素');
          return;
      }

      targetElement.click();
      CookieManager.recordSignIn(site);
  }

  // 延迟执行签到
  setTimeout(performSignIn, 500);
})();
