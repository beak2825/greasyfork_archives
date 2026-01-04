// ==UserScript==
// @name         auto_rainbow_medal
// @namespace    https://example.com/
// @version      1.1.2
// @description:zh-CN  PT站点用户名自动添加动态彩虹样式.添加勋章！如果想要适配PT站点请联系我:960487551@qq.com
// @description:en  Automatically add dynamic rainbow styles to PT site usernames and add badges! If you want to adapt it for a PT site, please contact me: 960487551@qq.com
// @license MIT
// @copyright (c) 2025-01-01
// @author       wiiii
// @match        *://pt.m-team.cc/*.php*
// @match        *://kp.m-team.cc/*.php*
// @match        *://xp.m-team.io/*.php*
// @match        *://xp.m-team.cc/*
// @match        *://pt.btschool.club/*.php*
// @match        *://hhanclub.top/*.php*
// @match        *://ubits.club/*.php*
// @match        *://rousi.zip/*.php*
// @match        *://hdfans.org/*.php*
// @match        *://carpt.net/*.php*
// @match        *://www.tjupt.org/*.php*
// @match        *://njtupt.top/*.php*
// @match        *://sunnypt.top/*.php*
// @match        *://www.hddolby.com/*.php*
// @match        *://ourbits.club/*.php*
// @match        *://audiences.me/*.php*
// @match        *://hdhome.org/*.php*
// @match        *://xingtan.one/*.php*
// @match        *://share.ilolicon.com/*.php*
// @grant        none
// @description PT站点用户名自动添加动态彩虹样式.添加勋章！如果想要适配PT站点请联系我:960487551@qq.com
// @downloadURL https://update.greasyfork.org/scripts/522991/auto_rainbow_medal.user.js
// @updateURL https://update.greasyfork.org/scripts/522991/auto_rainbow_medal.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 动态插入 CSS 样式到页面中
  let style = document.createElement("style");

  // 允许的颜色数量选项
  const allowedColors = [10, 20, 50, 100];

  // 获取当前站点的域名
  const currentSite = window.location.hostname;

  // 检查 localStorage 中是否已保存该站点的彩虹设置
  const siteSettings = JSON.parse(
    localStorage.getItem("rainbowSettings") || "{}"
  );
  const now = Date.now();
  const expirationTime = 180 * 24 * 60 * 60 * 1000; // 180 天（以毫秒为单位）

  // 检查站点状态或缓存是否过期
  function isSettingExpired(timestamp) {
    return now - timestamp >= expirationTime; // 如果超过 180 天则返回 true
  }

  // 控制台日志输出函数
  function logMessage(message, color) {
    console.log(`%c${message}`, `color: ${color}; font-weight: bold;`);
  }

  // 获取渐变颜色
  function generateGradientColors(steps) {
    const colors = [];
    const hueStep = 360 / steps; // 每一步的色相间隔
    for (let i = 0; i < steps; i++) {
      const hue = i * hueStep; // 当前颜色的色相
      colors.push(`hsl(${hue}, 100%, 50%)`); // 使用 HSL 模式生成颜色
    }
    return colors.join(", "); // 返回逗号分隔的颜色字符串
  }

  // 提示用户选择颜色数量
  function getGradientStepCount() {
    let gradientStepCount = parseInt(
      prompt(
        `请选择彩虹渐变颜色数量（仅允许输入：10、20、50、100）：`,
        allowedColors.includes(siteSettings[currentSite]?.colors)
          ? siteSettings[currentSite].colors
          : 20
      ),
      10
    );
    while (!allowedColors.includes(gradientStepCount)) {
      alert(`输入无效！请仅输入以下选项之一：${allowedColors.join("、")}`);
      gradientStepCount = parseInt(
        prompt(`请选择彩虹渐变颜色数量（仅允许输入：10、20、50、100）：`, "20"),
        10
      );
    }
    return gradientStepCount;
  }

  // 功能：根据不同站点动态插入对应配置的勋章图片
  function applyRainbowEffect(userId, gradientStepCount) {
    const currentHost = window.location.host; // 获取当前页面的域名

    // 不同站点的勋章配置
    const siteBadgeConfig = {
      "hhanclub.top": [
        {
          src: "pic/medal/vip.svg",
          title: "永久VIP勋章",
          className:
            "nexus-username-medal preview !max-w-8 !max-h-8 !rounded-md",
          style: "margin-left: 2pt",
          width: "35", // 保证宽度生效
          height: "35", // 保证高度生效
        },
        {
          src: "pic/medal/temp.svg",
          title: "二周年站庆徽章",
          className:
            "nexus-username-medal preview !max-w-8 !max-h-8 !rounded-md",
          style: "margin-left: 2pt",
          width: "35", // 保证宽度生效
          height: "35", // 保证高度生效
        },
        {
          src: "pic/medal/anniversary.svg",
          title: "一周年站庆徽章",
          className:
            "nexus-username-medal preview !max-w-8 !max-h-8 !rounded-md",
          style: "margin-left: 2pt",
          width: "35", // 保证宽度生效
          height: "35", // 保证高度生效
        },
        {
          src: "pic/trans.gif",
          alt: "Donor",
          className: "star",
          style: "margin-left: 2pt",
        },
      ],
      "ubits.club": [
        // ubits 的勋章配置（倒序排列）
        {
          src: "/pic/Medal/Copper_One_Year_Normal.png",
          title: "1周年铜质勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/pic/Medal/Gold_One_Year_Normal.png",
          title: "1周年金质勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/pic/Medal/UPload_Team_Normal.png",
          title: "发布组",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/pic/Medal/Seeding_Normal.png",
          title: "保种组",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/pic/Medal/Sliver_One_Year_Normal.png",
          title: "1周年银质勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/pic/Medal/1K_torrent_Normal.png",
          title: "官种千种纪念勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/pic/Medal/2W_torrent_sliver_normal.png",
          title: "2万种纪念银质勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/pic/trans.gif",
          alt: "Donor",
          className: "starbig",
          style: "margin-left: 4pt",
        },
      ],
      "carpt.net": [
        {
          src: "/medal/youche2.png",
          title: "有车勋章_豪华款",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "/medal/youche1.png",
          title: "有车勋章_普通款",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
      ],
      "hdfans.org": [
        {
          src: "http://img.hdfans.org/images/2024/04/30/HDFans.fw.png",
          title: "HDFans四周年纪念勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "http://img.hdfans.org/images/2023/06/01/HDFans-2023.png",
          title: "HDFans三周年纪念勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "http://img.hdfans.org/images/2023/06/01/HDFans-2022.png",
          title: "HDFans二周年纪念勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
        {
          src: "http://img.hdfans.org/images/2023/06/01/HDFans-2021.png",
          title: "HDFans一周年纪念勋章",
          className: "nexus-username-medal-big preview",
          style: "max-height: 16px; max-width: 16px; margin-left: 4pt",
        },
      ],
      // 可以为其他站点添加更多配置
      "another-site.com": [
        {
          src: "pic/medal/special.svg",
          title: "特别勋章",
          className: "special-medal",
          style: "margin-left: 3pt",
          width: "30",
          height: "30",
        },
      ],
    };

    // 根据当前站点获取对应的勋章配置
    const images = siteBadgeConfig[currentHost] || []; // 如果找不到站点配置，返回空数组

    const links = document.querySelectorAll("a");
    links.forEach(function (link) {
      const href = link.getAttribute("href"); // 获取 href 属性值
      if (href && href.includes(`userdetails.php?id=${userId}`)) {
        const boldElement = link.querySelector("b"); // 找到嵌套的 <b> 标签
        if (boldElement) {
          // 为 <b> 标签添加彩虹样式
          boldElement.classList.add("beautifulrainbow");

          // 遍历当前站点的勋章配置，并按顺序插入
          images.forEach((imageData) => {
            const img = document.createElement("img");
            img.src = imageData.src;
            if (imageData.alt) img.alt = imageData.alt;
            if (imageData.className) img.className = imageData.className;
            if (imageData.style) img.style = imageData.style;
            if (imageData.title) img.title = imageData.title;

            // 确保设置宽度和高度
            img.style.width = `${imageData.width}px`;
            img.style.height = `${imageData.height}px`;

            // 将 <img> 标签插入到 <a> 标签之后
            link.insertAdjacentElement("afterend", img);
          });

          logMessage(`为链接 ${href} 添加了彩虹样式和图片标签`, "green");
        }
      }
    });

    // 动态生成 CSS 样式
    const style = document.createElement("style");
    style.textContent = `
            /* 彩虹样式 */
            .beautifulrainbow {
                display: inline-block !important;
                margin: 0 !important;
                padding: 0 !important;
                font-size: inherit !important;
                line-height: inherit !important;
                text-align: center !important;
                text-decoration: none !important;
                background: linear-gradient(
                    to right,
                    ${generateGradientColors(
                      gradientStepCount
                    )} /* 动态生成的渐变颜色 */
                );
                background-size: ${
                  gradientStepCount * 10
                }% 100%; /* 根据颜色数量调整背景尺寸 */
                -webkit-background-clip: text !important;
                background-clip: text !important;
                color: transparent !important;
                animation: beautifulrainbow_animation 8s linear infinite alternate; /* 动画时间为 8 秒 */
            }

            /* 动态彩虹动画 */
            @keyframes beautifulrainbow_animation {
                0% { background-position: 0% 50%; }
                100% { background-position: 100% 50%; }
            }
        `;
    document.head.appendChild(style);
  }

  // 检查站点是否启用
  if (
    siteSettings[currentSite] &&
    !isSettingExpired(siteSettings[currentSite].timestamp)
  ) {
    if (siteSettings[currentSite].status === "DISABLED") {
      logMessage(
        `彩虹效果已禁用（180 天有效期内），站点：${currentSite}`,
        "red"
      );
      return;
    } else if (siteSettings[currentSite].status === "PENDING") {
      const userId = prompt(
        "您已启用彩虹效果，但尚未输入您的 ID。\n\n请输入您的用户 ID（例如：userdetails.php?id=12345）："
      );
      if (userId) {
        const gradientStepCount =
          siteSettings[currentSite].colors || getGradientStepCount();
        siteSettings[currentSite] = {
          status: userId,
          colors: gradientStepCount,
          timestamp: now,
        };
        localStorage.setItem("rainbowSettings", JSON.stringify(siteSettings));
        alert("彩虹效果已应用！页面将动态处理您的 ID。");
        logMessage(
          `彩虹效果已启用，输入的 ID 为 ${userId}，站点：${currentSite}，颜色数量：${gradientStepCount}`,
          "green"
        );
        applyRainbowEffect(userId, gradientStepCount);
      } else {
        alert("您未输入 ID，彩虹效果暂时未启用。找到您的 ID 后可以再次输入。");
        logMessage(
          `用户未输入 ID，彩虹效果暂时未启用，站点：${currentSite}`,
          "red"
        );
      }
      return;
    } else if (siteSettings[currentSite].status) {
      const gradientStepCount = siteSettings[currentSite].colors || 20;
      applyRainbowEffect(siteSettings[currentSite].status, gradientStepCount);
      logMessage(
        `彩虹效果正在应用（180 天有效期内），站点：${currentSite}，用户 ID：${siteSettings[currentSite].status}，颜色数量：${gradientStepCount}`,
        "green"
      );
      return;
    }
  }

  const enableRainbow = confirm(
    `是否为当前站点 (${currentSite}) 启用彩虹效果？`
  );
  if (enableRainbow) {
    const gradientStepCount = getGradientStepCount();
    siteSettings[currentSite] = {
      status: "PENDING",
      colors: gradientStepCount,
      timestamp: now,
    };
    localStorage.setItem("rainbowSettings", JSON.stringify(siteSettings));
    alert(
      `彩虹效果已启用！渐变颜色数量设置为 ${gradientStepCount}，请找到您的 ID 后输入。`
    );
    logMessage(
      `彩虹效果已启用，但未输入 ID，站点：${currentSite}，渐变颜色数量：${gradientStepCount}`,
      "green"
    );
  } else {
    siteSettings[currentSite] = {
      status: "DISABLED",
      colors: null,
      timestamp: now,
    };
    localStorage.setItem("rainbowSettings", JSON.stringify(siteSettings));
    alert("您已选择不启用彩虹效果，180 天内不再提示。");
    logMessage(`彩虹效果已禁用，站点：${currentSite}`, "red");
  }
})();
