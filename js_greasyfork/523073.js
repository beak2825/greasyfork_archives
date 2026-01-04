// ==UserScript==
// @name         auto-say-hello-plus
// @namespace    http://tampermonkey.net/
// @description:zh-CN  化身西部hello哥亚瑟摩根,对每个种子页面都自动感谢!如果未匹配成功请联系我:960487551@qq.com
// @description:en  Transform into the Western Hello Brother Arthur Morgan and automatically send thanks on every torrent page! If it fails to match successfully, please contact me: 960487551@qq.com
// @license MIT
// @author       wiiii
// @version      1.0.4
// @email        960487551@qq.com
// @copyright (c) 2025-01-01
// @match        *://pt.m-team.cc/*details.php*
// @match        *://kp.m-team.cc/*details.php*
// @match        *://xp.m-team.io/*details.php*
// @match        *://pt.btschool.club/details.php*
// @match        *://www.haidan.video/details.php*
// @match        *://www.hddolby.com/details.php*
// @match        *://www.hdarea.co/details.php*
// @match        *://hdatmos.club/details.php*
// @match        *://hdhome.org/details.php*
// @match        *://hdsky.me/details.php*
// @match        *://hdtime.org/details.php*
// @match        *://hhanclub.top/details.php*
// @match        *://lemonhd.org/details*
// @match        *://pt.soulvoice.club/details.php*
// @match        *://avgv.cc/details.php*
// @match        *://ptsbao.club/details.php*
// @match        *://www.beitai.pt/details.php*
// @match        *://ubits.club/details.php*
// @match        *://et8.org/details.php*
// @match        *://pt.eastgame.org/details.php*
// @match        *://pthome.net/details.php*
// @match        *://pterclub.com/details.php*
// @match        *://ourbits.club/details.php*
// @match        *://hdzone.me/details.php*
// @match        *://pt.msg.vg/details.php*
// @match        *://hdfans.org/details.php*
// @match        *://rousi.zip/details.php*
// @match        *://carpt.net/details.php*
// @match        *://www.tjupt.org/details.php*
// @match        *://yingk.com/details.php*
// @match        *://www.dragonhd.xyz/details.php*
// @match        *://chdbits.co/details.php*
// @match        *://njtupt.top/details.php*
// @match        *://sunnypt.top/details.php*
// @match        *://audiences.me/details.php*
// @match        *://xingtan.one/details.php*
// @match        *://www.nicept.net/details.php*
// @grant        none
// @description Transform into the Western Hello Brother Arthur Morgan and automatically send thanks on every torrent page! If it fails to match successfully, please contact me: 960487551@qq.com
// @downloadURL https://update.greasyfork.org/scripts/523073/auto-say-hello-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/523073/auto-say-hello-plus.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 定义等待函数
  var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 定义站点组
  const siteGroups = [
    {
      sites: ["pt.m-team.cc", "kp.m-team.cc", "xp.m-team.io", "m-team"],
      action: () => {
        const sayThanksButton = document.getElementById("saythanks");
        if (sayThanksButton && !sayThanksButton.disabled) {
          console.log("auto click thanks way 1~~~");
          sayThanksButton.click();
        }
      },
    },
    {
      sites: [
        "pt.btschool.club",
        "www.hddolby.com",
        "hdatmos.club",
        "hdhome.org",
        "hdsky.me",
        "audiences.me",
        "lemonhd.org",
        "pt.soulvoice.club",
        "www.beitai.pt",
        "et8.org",
        "pt.eastgame.org",
        "pthome.net",
        "pterclub.com",
        "hdzone.me",
        "pt.msg.vg",
        "hdfans.org",
        "rousi.zip",
        "carpt.net",
        "hhanclub.top",
        "ubits.club",
        "www.dragonhd.xyz",
        "njtupt.top",
        "sunnypt.top",
        "audiences.me",
        "xingtan.one",
        "www.nicept.net",
      ],
      action: () => {
        wait(5000).then(() => {
          const sayThanksButton = document.getElementById("saythanks");
          if (sayThanksButton && !sayThanksButton.disabled) {
            console.log("auto click thanks way 2~~~");
            sayThanksButton.click();
          }
        });
      },
    },
    {
      sites: [
        "www.hdarea.co",
        "hdtime.org",
        "avgv.cc",
        "ptsbao.club",
        "ourbits.club",
      ],
      action: () => {
        wait(5000).then(() => {
          const sayThanksButton = document.getElementById("saythanks");
          if (sayThanksButton && !sayThanksButton.disabled) {
            console.log("auto click thanks way 3~~~");
            sayThanksButton.click();
          }
        });
      },
    },
    {
      sites: ["www.haidan.video"],
      action: () => {
        const sayThanksButton = document.querySelector('a[id*="saythanks"]');
        if (sayThanksButton && !sayThanksButton.style) {
          wait(2000).then(() => {
            console.log("auto click thanks way 4~~~");
            sayThanksButton.click();
          });
        }
      },
    },
    {
      sites: ["www.tjupt.org", "yingk.com", "chdbits.co"],
      action: () => {
        wait(5000).then(() => {
          const sayThanksButton = document.getElementById("saythanks");
          if (
            sayThanksButton &&
            !sayThanksButton.disabled &&
            !sayThanksButton.disabled
          ) {
            console.log("auto click thanks way 5~~~");
            sayThanksButton.click();
          }
        });
      },
    },
  ];

  // 遍历站点组并匹配执行相应动作
  for (const group of siteGroups) {
    console.log('%c 说谢谢。', 'color: green;');
    if (group.sites.some((site) => location.href.indexOf(site) >= 0)) {
      group.action();
      break; // 只执行匹配到的第一个组的动作
    }
  }
})();