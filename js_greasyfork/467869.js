// ==UserScript==
// @name         🎬追剧系列--爱优腾芒VIP视频破解（精简版）
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  爱优腾芒VIP视频解析 - 目前支持腾讯、爱奇艺、优酷、芒果TV，简单脚本，无杂七杂八功能，主打一个干净简洁。
// @match        https://www.iqiyi.com/*
// @match        https://v.qq.com/x/cover/*
// @match        https://www.mgtv.com/b/*
// @match        https://v.youku.com/v_show/*
// @match        https://youku.com/v_show/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467869/%F0%9F%8E%AC%E8%BF%BD%E5%89%A7%E7%B3%BB%E5%88%97--%E7%88%B1%E4%BC%98%E8%85%BE%E8%8A%92VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/467869/%F0%9F%8E%AC%E8%BF%BD%E5%89%A7%E7%B3%BB%E5%88%97--%E7%88%B1%E4%BC%98%E8%85%BE%E8%8A%92VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 加载 SweetAlert2 并确保样式正确加载
  const loadSweetAlert = () => {
    const swalCss = document.createElement("link");
    swalCss.rel = "stylesheet";
    swalCss.href = "";
    document.head.appendChild(swalCss);

    const swalScript = document.createElement("script");
    swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    document.head.appendChild(swalScript);

    return new Promise((resolve) => {
      swalScript.onload = resolve;
    });
  };

  // 添加全局样式，确保与其他组件不冲突
  const addGlobalStyle = () => {
    const style = document.createElement("style");
    style.textContent = `
        /* 通用样式 */
        ::-webkit-scrollbar {
            width: 10px !important;
        }
        ::-webkit-scrollbar-thumb {
            background: #8e8e8e !important;
            border-radius: 10px !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555555 !important;
        }
        .no-select {
            user-select: none;
        }
        .button-container {
            position: fixed;
            top: 50%;
            left: 60px;
            transform: translate(0, -50%);
            z-index: 99999999;
            display: none;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            grid-gap: 10px;
        }
        .vip-button {
            background: linear-gradient(45deg, #ff8c00, #ffd700); /* 渐变色背景 */
            border: 0;
            padding: 0 25px;
            height: 30px;
            color: #000;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            margin: 5px 0;
            transition: transform 0.3s, background-color 0.3s;
            border-radius: 5px; /* 圆角效果 */
        }
        .vip-button:hover {
             background: linear-gradient(45deg, #ffa500, #ff4500); /* hover 状态下的渐变色 */
        }
        /* 顶部作者介绍样式 */
        .author-info {
            background-color: #ff4500; /* 显眼的橙红色背景 */
            color: #ffffff; /* 白色字体 */
            padding: 10px;
            text-align: center;
            font-weight: bold;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        /* 底部链接按钮样式 */
        .author-link-button {
            background: linear-gradient(45deg, #1e90ff, #00bfff); /* 渐变色背景 */
            color: #ffffff; /* 白色字体 */
            padding: 8px 12px;
            text-align: center;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            display: inline-block; /* 使按钮宽度自适应文字 */
        }
        .author-link-button:hover {
            background: linear-gradient(45deg, #1c86ee, #87cefa); /* 渐变色的 hover 效果 */
            color:#fff !important;
        }
        /* 确保 SweetAlert2 弹窗样式不受其他全局样式影响 */
        .swal2-container {
            z-index: 100000000 !important;
        }
        /* 关于作者样式 */
        #about {
            color:#ff0000;
            line-height: 27px;
        }
        #about:hover {
            font-weight: 900;
        }
      `;
    document.head.appendChild(style);
  };

  // 创建解析按钮
  const createParseButton = () => {
    const parseButton = document.createElement("div");
    parseButton.className = "no-select";
    parseButton.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background:linear-gradient(45deg, #ff8c00, #ffd700);
        position: fixed;
        left: 0;
        top: 50%;
        cursor: pointer;
        z-index: 99999999;
        transform: translate(0, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: black;
        font-size: 13px;
        font-weight: bold;
        box-shadow: rgb(0 0 0 / 30%) 0px 2px 5px;
      `;
    parseButton.textContent = "VIP";
    parseButton.title = "公众号：软件小邓";
    return parseButton;
  };

  // 创建作者介绍
  const createAuthorInfo = () => {
    const authorInfo = document.createElement("div");
    authorInfo.className = "author-info";
    authorInfo.textContent = "注：遇到无法解析的，请切换路线！";
    return authorInfo;
  };

  // 创建底部访问作者博客的按钮
  const createAuthorLinkButton = () => {
    const authorLinkButton = document.createElement("a");
    authorLinkButton.className = "author-link-button";
    authorLinkButton.href = "https://link3.cc/rjxd";
    authorLinkButton.target = "_blank";
    authorLinkButton.textContent = "关于作者";
    return authorLinkButton;
  };

  // 创建解析接口按钮容器
  const createButtonContainer = (apiList) => {
    const container = document.createElement("div");
    container.className = "button-container";

    // 添加作者介绍到按钮容器的顶部
    const authorInfo = createAuthorInfo();
    container.appendChild(authorInfo);

    apiList.forEach((api) => {
      const button = document.createElement("button");
      button.className = "vip-button";
      button.textContent = api.name;
      button.addEventListener("click", (event) => {
        event.stopPropagation(); // 防止点击按钮时关闭接口容器
        window.open(`${api.url}${window.location.href}`, "_blank");
      });
      container.appendChild(button);
    });

    // 添加访问作者博客按钮到按钮容器的底部
    const authorLinkButton = createAuthorLinkButton();
    container.appendChild(authorLinkButton);

    return container;
  };

  // 显示用户协议弹窗，并添加二维码
  const showTermsPopup = async () => {
    const result = await Swal.fire({
      title: "用户协议",
      html: `
          <div style='text-align:left; font-size:14px;'>
            免责声明：<br>
            1. VIP视频解析中所用到的解析接口来自于网络，版权问题请联系相关解析接口所有者。<br>
            2. 为创造良好的创作氛围，请大家支持正版。<br>
            3. 脚本仅用于学习，切勿用于任何商业用途。<br>
            4. 个别解析线路带有可选的额外收费提速功能，这是线路行为，与脚本作者无关。<br>
            5. 如发现有线路含有广告，请千万不要相信，并请及时反馈，我会第一时间移除该线路。<br>
            6. 点击同意，即表明你已经明确使用脚本可能带来的风险，且愿意自行承担相关风险，对于风险网站不承担任何责任。
            <p style="color:#ff0000;margin-top:10px;">- 更新1：新增了可用路线，移除了失效路线！</p>
            <p style="color:#ff0000;">- 更新2：代码架构重新构建，确保运行速度及稳定。</p>
            <br><br>
           <div style="text-align:center;">
              <span>⭐️Zlibrary最新地址，各种实用软件，李跳跳最新规则等⭐️</span><br>
              <span>请关注公众号：<b style="color:#0045ff;">软件小邓</b></span><br>
              <a href="https://link3.cc/rjxd" target="_blank" id="about"> >>关于作者<< </a>
            </div>
          </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "我已仔细阅读协议并同意",
      cancelButtonText: "取消",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "已确认",
        text: "您已经同意用户协议。",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      return true;
    } else {
      await Swal.fire({
        title: "已取消",
        text: "您取消了用户协议。",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return false;
    }
  };

  // 主逻辑
  const main = async () => {
    await loadSweetAlert(); // 加载 SweetAlert2

    addGlobalStyle();

    const parseButton = createParseButton();
    const apiList = [
      // { name: "综合", url: "https://jx.bozrc.com:4433/player/?url=" },
      { name: "路线①", url: "https://jx.m3u8.tv/jiexi/?url=" },
      { name: "盘古", url: "https://www.pangujiexi.com/jiexi/?url=" },
      { name: "夜幕", url: "https://www.yemu.xyz/?url=" },
      { name: "爱豆", url: "https://jx.aidouer.net/?url=" },
      { name: "虾米", url: "https://jx.xmflv.com/?url=" },
      // { name: "纯净1", url: "https://im1907.top/?jx=" },
      { name: "冰豆", url: "https://api.qianqi.net/vip/?url=" },
    ];

    const buttonContainer = createButtonContainer(apiList);
    document.body.appendChild(parseButton);
    document.body.appendChild(buttonContainer);

    let isVisible = false;
    parseButton.addEventListener("click", async (event) => {
      if (!localStorage.getItem("agreedToTerms")) {
        const agreed = await showTermsPopup();
        if (!agreed) {
          // 用户取消，脚本不执行
          return;
        }
        localStorage.setItem("agreedToTerms", "true");
      }

      isVisible = !isVisible;
      buttonContainer.style.display = isVisible ? "block" : "none";
      parseButton.textContent = isVisible ? "隐藏" : "VIP";
      event.stopPropagation(); // 防止点击解析按钮时关闭接口容器
    });

    // 点击页面任意地方隐藏接口
    document.addEventListener("click", () => {
      if (isVisible) {
        buttonContainer.style.display = "none";
        parseButton.textContent = "VIP";
        isVisible = false;
      }
    });

    // 防止点击接口按钮时关闭接口容器
    buttonContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  };

  main();
})();
