// ==UserScript==
// @name         .彩色开关
// @namespace    http://tampermonkey.net/
// @version      2.0-2025-12-12
// @description  Toggle custom CSS styles on GitHub
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license MIT
// @icon        https://pic1.imgdb.cn/item/694115f60dd29e7e22471b78.png
// @downloadURL https://update.greasyfork.org/scripts/535417/%E5%BD%A9%E8%89%B2%E5%BC%80%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/535417/%E5%BD%A9%E8%89%B2%E5%BC%80%E5%85%B3.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function colorfulTab() {
    // CSS 样式内容
    const customCSS = `

	/* 粉 */
	strong,
	strong span,
	b,
	b span {
		color: #1772F6 !important;
		/* #E94C88 粉红 */
	}

	/* 红 */
	em {
		color: #F73131 !important;
	}

	.markdown-body code,
	.markdown-title code {
		color: #44ddff;
		background-color: #18182f !important;
	}
	.markdown-body pre code {
		background-color: inherit !important;
	}

	.markdown-body pre {
		tab-size: 4;
	}

	/* 去除背景色 */
	h1[class="heading-element"],
	h1[class="heading-element"] code,
	h2[class="heading-element"],
	h2[class="heading-element"] code,
	h3.markdown-title code,
	h3[class="heading-element"],
	h3[class="heading-element"] code,
	h4[class="heading-element"],
	h4[class="heading-element"] code {
		background-color: #212830 !important;
		font-weight: 700 !important;
	}

	ul li strong,
	ul li b,
	ul li::marker,
	ul li::before,
	ol li strong,
	ol li b,
	ol li::marker,
	ol li::before {
		color: #20bffe !important;
	}

	ul li ul li strong,
	ul li ul li b,
	ul li ul li::marker,
	ul li ul li::before,
	ul li ol li strong,
	ul li ol li b,
	ul li ol li::marker,
	ul li ol li::before,
	ol li ul li strong,
	ol li ul li b,
	ol li ul li::marker,
	ol li ul li::before,
	ol li ol li strong,
	ol li ol li b,
	ol li ol li::marker,
	ol li ol li::before {
		color: #ff5f9c !important;
	}

	ul li ul li ul li strong,
	ul li ul li ul li b,
	ul li ul li ul li::marker,
	ul li ul li ul li::before,
	ul li ol li ul li strong,
	ul li ol li ul li b,
	ul li ol li ul li::marker,
	ul li ol li ul li::before,
	ul li ul li ol li strong,
	ul li ul li ol li b,
	ul li ul li ol li::marker,
	ul li ul li ol li::before,
	ul li ol li ol li strong,
	ul li ol li ol li b,
	ul li ol li ol li::marker,
	ul li ol li ol li::before,
	ol li ol li ol li strong,
	ol li ol li ol li b,
	ol li ol li ol li::marker,
	ol li ol li ol li::before,
	ol li ol li ul li strong,
	ol li ol li ul li b,
	ol li ol li ul li::marker,
	ol li ol li ul li::before,
	ol li ul li ol li strong,
	ol li ul li ol li b,
	ol li ul li ol li::marker,
	ol li ul li ol li::before,
	ol li ul li ul li strong,
	ol li ul li ul li b,
	ol li ul li ul li::marker,
	ol li ul li ul li::before {
		color: #61E5D2 !important;
	}

	*[id*="title"],
	*[class*="title"] {
		color: #FE9A20 !important;
	}

	h1,
	h1 a,
	h1 font,
	h1 span,
	h1 strong,
	h1 code,
	h1 b,
	.toc-label-h1 {
		color: #986c6a !important;
		/*#C2E1E5*/
	}

	h2,
	h2 a,
	h2 font,
	h2 span,
	h2 strong,
	h2 code,
	h2 b,
	.toc-label-h2 {
		color: #fe9a20 !important;
	}

	h3,
	h3 a,
	h3 font,
	h3 span,
	h3 strong,
	h3 code,
	h3 b,
	.toc-label-h3 {
		color: #f2d41b !important;
	}

	h4,
	h4 a,
	h4 font,
	h4 span,
	h4 strong,
	h4 code,
	h4 b,
	.toc-label-h4 {
		color: #00bc7b !important;
	}

	h5,
	h5 a,
	h5 font,
	h5 span,
	h5 strong,
	h5 code,
	h5 b,
	.toc-label-h5 {
		color: #00b3b9 !important;
	}

	h6,
	h6 a,
	h6 font,
	h6 span,
	h6 strong,
	h6 code,
	h6 b,
	.toc-label-h6 {
		color: #a165a8 !important;
	}




      `;

    // 创建并添加浮动按钮
    const button = document.createElement("button");
    button.textContent = "";
    button.style.position = "fixed";
    button.style.top = "0px";
    button.style.right = "20px";
    button.style.backgroundColor = "rgba(0,0,0,0)";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "0 0 10px 10px";
    button.style.cursor = "pointer";
    button.style.width = "25px";
    button.style.height = "20px";
    // 定义七彩渐变的CSS样式
    const gradientStyle = `
    linear-gradient(
      45deg,
      #FF69B4, #FFA07A, #FFDAB9, #FFFF99, #B0E0E6, #ADD8E6, #E6E6FA
    )
  `;

    // 添加鼠标悬停事件
    button.addEventListener("mouseenter", () => {
      button.style.background = gradientStyle; // 鼠标悬停时显示七彩渐变
    });

    // 添加鼠标离开事件
    button.addEventListener("mouseleave", () => {
      button.style.background = "transparent"; // 鼠标离开时恢复透明背景
    });
    document.body.appendChild(button);
    // 保证按钮是 DOM 树里最后一个节点

    // 当前是否已应用自定义样式
    //let styleApplied = true;
    let styleApplied = false;

    // 创建 <style> 标签
    const styleElement = document.createElement("style");
    styleElement.textContent = customCSS;
    //document.head.appendChild(styleElement);

    // 按钮点击事件处理
    button.addEventListener("click", () => {
      if (styleApplied) {
        // 移除样式
        document.head.removeChild(styleElement);
        styleApplied = false;
      } else {
        // 添加样式
        document.head.appendChild(styleElement);
        styleApplied = true;
      }
    });
  }

  let styleAppliedDark = false;
  let styleAppliedLight = false;

  // 创建 Dark 模式 <style> 标签
  let styleElementDark = document.createElement("style");
  styleElementDark.textContent = `
    *::selection {
        background-color: #353e5c !important;
        color: inherit !important;
    }
    font,p,h1,h2,h3,h4,h5,h6{
        color: white !important;
    }
    `;

  // 创建 Light 模式 <style> 标签
  let styleElementLight = document.createElement("style");
  styleElementLight.textContent = `
    *::selection {
        background-color: #f0d8b9 !important;
        color: inherit !important;
    }
    font,p,h1,h2,h3,h4,h5,h6{
        color: black !important;
    }
    `;
  // Dark模式
  function deepBlue() {
    // 创建并添加浮动按钮
    const button2 = document.createElement("button");
    button2.textContent = "";
    button2.style.position = "fixed";
    button2.style.top = "0px";
    button2.style.right = "50px";
    button2.style.backgroundColor = "rgba(0,0,0,0)";
    button2.style.color = "white";
    button2.style.border = "none";
    button2.style.borderRadius = "0 0 10px 10px";
    button2.style.cursor = "pointer";
    button2.style.width = "25px";
    button2.style.height = "20px";
    // 定义背景色
    const blueStyle = `#353e5c`;

    // 添加鼠标悬停事件
    button2.addEventListener("mouseenter", () => {
      button2.style.background = blueStyle; // 鼠标悬停时显示蓝色
    });

    // 添加鼠标离开事件
    button2.addEventListener("mouseleave", () => {
      button2.style.background = "transparent"; // 鼠标离开时恢复透明背景
    });
    document.body.appendChild(button2);

    // 按钮点击事件处理
    button2.addEventListener("click", () => {
      if (styleAppliedDark) {
        styleAppliedDark = false;
        // 移除样式
        document.head.removeChild(styleElementDark);

        if (styleAppliedLight) {
          styleAppliedLight = false;
          document.head.removeChild(styleElementLight);
        }
      } else {
        styleAppliedDark = true;
        // 添加样式
        document.head.appendChild(styleElementDark);

        if (styleAppliedLight) {
          styleAppliedLight = false;
          document.head.removeChild(styleElementLight);
        }
      }
    });
  }

  // Light 模式
  function yellow() {
    // 创建并添加浮动按钮
    const button3 = document.createElement("button");
    button3.textContent = "";
    button3.style.position = "fixed";
    button3.style.top = "0px";
    button3.style.right = "80px";
    button3.style.backgroundColor = "rgba(0,0,0,0)";
    button3.style.color = "white";
    button3.style.border = "none";
    button3.style.borderRadius = "0 0 10px 10px";
    button3.style.cursor = "pointer";
    button3.style.width = "25px";
    button3.style.height = "20px";
    // 定义背景色
    const yellowStyle = `#f0d8b9`;

    // 添加鼠标悬停事件
    button3.addEventListener("mouseenter", () => {
      button3.style.background = yellowStyle; // 鼠标悬停时显示黄色
    });

    // 添加鼠标离开事件
    button3.addEventListener("mouseleave", () => {
      button3.style.background = "transparent"; // 鼠标离开时恢复透明背景
    });
    document.body.appendChild(button3);

    // 按钮点击事件处理
    button3.addEventListener("click", () => {
      if (styleAppliedLight) {
        styleAppliedLight = false;
        // 移除样式
        document.head.removeChild(styleElementLight);

        if (styleAppliedDark) {
          styleAppliedDark = false;
          document.head.removeChild(styleElementDark);
        }
      } else {
        styleAppliedLight = true;
        // 添加样式
        document.head.appendChild(styleElementLight);

        if (styleAppliedDark) {
          styleAppliedDark = false;
          document.head.removeChild(styleElementDark);
        }
      }
    });
  }

  function greenFontStyle() {
    const customCSS = `
        *{
		    font-family: Segoe UI, Segoe UI Variable Text, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, sans-serif !important;
            /* font-family: Arial, sans-serif !important; */
	    }
    `;
    // 创建并添加浮动按钮
    const button5 = document.createElement("button");
    button5.textContent = "";
    button5.style.position = "fixed";
    button5.style.top = "0px";
    button5.style.right = "110px";
    button5.style.backgroundColor = "rgba(0,0,0,0)";
    button5.style.color = "black";
    button5.style.border = "none";
    button5.style.borderRadius = "0 0 10px 10px";
    button5.style.cursor = "pointer";
    button5.style.width = "25px";
    button5.style.height = "20px";
    button5.style.content = "F";
    // 定义背景色
    const greenStyle = `#0F5D2A`;

    // 添加鼠标悬停事件
    button5.addEventListener("mouseenter", () => {
      button5.style.background = greenStyle; // 鼠标悬停时显示黄色
    });

    // 添加鼠标离开事件
    button5.addEventListener("mouseleave", () => {
      button5.style.background = "transparent"; // 鼠标离开时恢复透明背景
    });
    document.body.appendChild(button5);

    // 当前是否已应用自定义样式
    let styleApplied = false;

    // 创建 <style> 标签
    const styleElement = document.createElement("style");
    styleElement.textContent = customCSS;
    //document.head.appendChild(styleElement);

    // 按钮点击事件处理
    button5.addEventListener("click", () => {
      if (styleApplied) {
        // 移除样式
        document.head.removeChild(styleElement);
        styleApplied = false;
      } else {
        // 添加样式
        document.head.appendChild(styleElement);
        styleApplied = true;
      }
    });
  }

  function p() {
    // CSS 样式内容
    const customCSS = `
          p,li,strong,a{
              margin-top: 0 !important;
              margin-bottom: 0 !important;
              font-size: 15px !important;
              line-height: 27px !important;
              padding-top:0px !important;
              padding-bottom:0px !important;
          }
          ul,ol{
              margin: 10px 0 !important;
              padding-top:0px !important;
              padding-bottom:0px !important;
          }
          h1,h2,h3,h4,h5,h6{
              margin: 10px 0 !important;
              padding-top:0px !important;
              padding-bottom:0px !important;
          }
          img{
              margin-top: 10px !important;
              margin-bottom: 10px !important;
          }
          p,div,span,a,figure,meta{
              img{
                  max-height: 400px !important;
                  padding-top:0px !important;
                  padding-bottom:0px !important;
              }
          }
      `;

    // 创建并添加浮动按钮
    const button4 = document.createElement("button");
    button4.textContent = "";
    button4.style.position = "fixed";
    button4.style.top = "0px";
    button4.style.right = "140px";
    button4.style.backgroundColor = "rgba(0,0,0,0)";
    button4.style.color = "black";
    button4.style.border = "none";
    button4.style.borderRadius = "0 0 10px 10px";
    button4.style.cursor = "pointer";
    button4.style.width = "25px";
    button4.style.height = "20px";
    button4.style.content = "P";
    // 定义背景色
    const yellowStyle = `#5DC3D7`;

    // 添加鼠标悬停事件
    button4.addEventListener("mouseenter", () => {
      button4.style.background = yellowStyle; // 鼠标悬停时显示黄色
    });

    // 添加鼠标离开事件
    button4.addEventListener("mouseleave", () => {
      button4.style.background = "transparent"; // 鼠标离开时恢复透明背景
    });
    document.body.appendChild(button4);

    // 当前是否已应用自定义样式
    let styleApplied = false;

    // 创建 <style> 标签
    const styleElement = document.createElement("style");
    styleElement.textContent = customCSS;
    //document.head.appendChild(styleElement);

    // 按钮点击事件处理
    button4.addEventListener("click", () => {
      if (styleApplied) {
        // 移除样式
        document.head.removeChild(styleElement);
        styleApplied = false;
      } else {
        // 添加样式
        document.head.appendChild(styleElement);
        styleApplied = true;
      }
    });
  }

  colorfulTab();
  deepBlue();
  yellow();
  greenFontStyle();
  p();
})();
