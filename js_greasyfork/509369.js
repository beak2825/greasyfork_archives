// ==UserScript==
// @name         google背景扩展及元素屏蔽
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.1
// @description  使用Chrome,edge以及Custom New Tab插件获得完整体验，并允许用户自定义背景和透明度，屏蔽指定元素
// @author       bshuai
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @include      https://www.google.com/
// @downloadURL https://update.greasyfork.org/scripts/509369/google%E8%83%8C%E6%99%AF%E6%89%A9%E5%B1%95%E5%8F%8A%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/509369/google%E8%83%8C%E6%99%AF%E6%89%A9%E5%B1%95%E5%8F%8A%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
  // 检查是否在谷歌首页
  if (location.href === "https://www.google.com/") {
    const defaultImage = "https://i.imgur.com/QD7htjZ.png";
    const defaultOpacity = 0.9;

    // 获取用户保存的背景图片和透明度，如果没有则使用默认值
    const backgroundImage = GM_getValue("backgroundImage", defaultImage);
    let opacity = GM_getValue("opacity", defaultOpacity);

    const updateStyle = () => {
      const css = `
        body:before {
          content: "";
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -100;
          background-image: url(${backgroundImage});
          background-position: center;
          background-size: cover;
          background-attachment: fixed;
          background-repeat: no-repeat;
          opacity: ${opacity}; /* 动态透明度 */
        }
        .UUbT9, .sfbg, .yg51vc, .appbar, .kp-blk, .f6F9Be, .minidiv,
        .s8GCU, .Lj9fsd, .jZWadf, .qcTKEe, .ECgenc, .sbib_a,
        .c93Gbe { background: rgba(255, 255, 255, 0) !important; }
        .RNNXgb  { 
          background: rgba(255, 255, 255, 0.7) !important; 
          border: none !important; /* 去掉边框 */
        }
        .aajZCb  { /* 搜索建议和记录 */
          background: rgba(255, 255, 255, 0.7) !important; /* 透明背景 */
          box-shadow: none  !important; /* 去掉阴影 */
        }
        .UUbT9 { margin-top: 0 !important;} /* 去掉负外边距 */

        /* 屏蔽指定元素 */
        div.L3eUgb:nth-child(2) > div.o3j99.c93Gbe:last-child > div.KxwPGc.SSwjIe:nth-child(2),
        div.L3eUgb:nth-child(2) > div.o3j99.qarstb:nth-child(4),
        div.L3eUgb:nth-child(2) > div.o3j99.ikrT4e.om7nvf:nth-child(3) > form:last-child > div:first-child > div.A8SBwf:first-child > div.FPdoLc.lJ9FBc:last-child > center,
        div.L3eUgb:nth-child(2) > div.o3j99.ikrT4e.om7nvf:nth-child(3) > form:last-child > div:first-child > div.A8SBwf.emcav:first-child > div.UUbT9.EyBRub:nth-child(3) > div.aajZCb:nth-child(5) > div.lJ9FBc:last-child > center:last-child,
        div.L3eUgb:nth-child(2) > div.o3j99.ikrT4e.om7nvf:nth-child(3) > form:last-child > div:first-child > div.A8SBwf.emcav:first-child > div.UUbT9.EyBRub:nth-child(3) > div.aajZCb:nth-child(5) > div.lJ9FBc:last-child,
        div.L3eUgb:nth-child(2) > div.o3j99.LLD4me.yr19Zb.LS8OJ:nth-child(2) > div.k1zIA.rSk4se:last-child > img.lnXdpd:last-child,
        div.L3eUgb:nth-child(2) > div.o3j99.ikrT4e.om7nvf:nth-child(3) > form:last-child > div:first-child > div.A8SBwf.emcav:first-child > div.UUbT9.EyBRub:nth-child(3) > div.aajZCb:nth-child(5) > div.xtSCL:first-child,
        div.L3eUgb:nth-child(2) > div.o3j99.c93Gbe:last-child,
        div.L3eUgb:nth-child(2) > div.o3j99.ikrT4e.om7nvf:nth-child(3) > form:last-child > div:first-child > div.A8SBwf:first-child > div.FPdoLc.lJ9FBc:last-child {
          display: none !important;
        }
      `;

      // 添加样式
      if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
      } else {
        const styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.head || document.documentElement).appendChild(styleNode);
      }
    };

    // 初次加载时应用样式
    updateStyle();

    // 注册菜单命令，允许用户选择本地图片作为背景
    GM_registerMenuCommand("选择背景图片", function() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageUrl = e.target.result;
          GM_setValue("backgroundImage", imageUrl);
          alert("背景图片已设置，刷新页面以应用新背景。");
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });

    // 注册菜单命令，允许用户设置透明度
    GM_registerMenuCommand("设置背景透明度", function() {
      const newOpacity = prompt("请输入背景透明度（0 - 1之间的小数值）：", opacity);
      if (newOpacity !== null) {
        const parsedOpacity = parseFloat(newOpacity);
        if (!isNaN(parsedOpacity) && parsedOpacity >= 0 && parsedOpacity <= 1) {
          opacity = parsedOpacity;
          GM_setValue("opacity", opacity);
          updateStyle(); // 更新样式
        } else {
          alert("无效的透明度值，请输入0到1之间的数字。");
        }
      }
    });
  }
})();
