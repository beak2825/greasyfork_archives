// ==UserScript==
// @name      vip视频外嵌解析
// @namespace https://greasyfork.org/zh-CN
// @version      0.0.2
// @author       Bsutss
// @namespace  vip视频解析
// @description   vip视频解析 -【外嵌解析+带弹幕】目前支持: 腾讯,爱奇艺,优酷, 芒果tv, 脚本特点✔️简洁高效✔️方便快捷
// @match        https://www.iqiyi.com/*
// @match        https://v.qq.com/x/cover/*
// @match        https://www.mgtv.com/b/*
// @match        https://v.youku.com/v_show/*
// @match        https://youku.com/v_show/*
// @match        https://www.bilibili.com/*
// @license       MIT
// @grant         None
// @downloadURL https://update.greasyfork.org/scripts/485863/vip%E8%A7%86%E9%A2%91%E5%A4%96%E5%B5%8C%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/485863/vip%E8%A7%86%E9%A2%91%E5%A4%96%E5%B5%8C%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var style = document.createElement("style");
  style.textContent = `
        ::-webkit-scrollbar {
            width: 10px !important;
        }

        ::-webkit-scrollbar-thumb {
            background: #C1C1C1 !important;
            border-radius: 10px !important;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #9e9e !important;
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
            background: #605aca;
            border: 0;
            padding: 0 25px;
            height: 30px;
            padding:0 10px;
            color: #fff;
            cursor:pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            margin: 5px 0;
        }

        .vip-button:hover {
            background: #605aca;
            transform: scale(1.1);
        }
    `;

  document.head.appendChild(style);

  var YQ_cube = document.createElement("div");
  YQ_cube.className = "no-select";
  YQ_cube.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #605aca;
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
        color: white;
        font-size: 13px;
        font-weight: bold;
        box-shadow: rgb(0 0 0 / 30%) 0px 2px 5px;
    `;

  YQ_cube.textContent = "vip解析";
  YQ_cube.title = "微信公众号：残月影视";

  document.body.appendChild(YQ_cube);

  // 引入解析接口
  var Apilist = [ 
    { name: "解析线路1", url: "https://www.yemu.xyz/?url=" },
    { name: "解析线路2", url: "https://jx.aidouer.net/?url=" },
    { name: "解析线路3", url: "https://jx.xmflv.com/?url=" },
    //2023-10-13 新增
    { name: "解析线路4", url: "https://bd.jx.cn/player/?url=" },
    { name: "解析线路5", url: "https://api.qianqi.net/vip/?url=" },
  ];

  var buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  Apilist.forEach(function (api) {
    var button = document.createElement("button");
    button.className = "vip-button";
    button.textContent = api.name;
    button.addEventListener("click", function () {
      // 处理按钮点击事件，跳转到解析页面
      window.open(api.url + window.location.href, "_blank");
    });
    buttonContainer.appendChild(button);
  });

  document.body.appendChild(buttonContainer);
  var flag = 1;
  YQ_cube.addEventListener("click", function () {
    // 检查是否已同意协议
    var agreedToTerms = localStorage.getItem("agreedToTerms");
    // 如果未同意协议，显示协议弹窗
    if (!agreedToTerms) {
      var termsPopup = confirm(
        "免责声明：1、VIP视频解析中所用到的解析接口来自于网络，版权问题请联系相关解析接口所有者 2、为创造良好的创作氛围，请大家支持正版 3、脚本仅用于学习，切勿用于任何商业等其它用途 4、个别解析线路带有可选的额外收费提速功能，这是线路行为，与脚本作者无关 5、如发现有线路含有广告，请千万不要相信，并请及时反馈，我会第一时间移除该线路 6、点击确定，即表明你已经明确使用脚本可能带来的风险，且愿意自行承担相关风险，对于风险网站不承担任何责任, 以上内容请知晓 "
      );
      // 如果用户同意，设置同意标志并继续执行脚本
      if (termsPopup) {
        localStorage.setItem("agreedToTerms", "true");
      } else {
        alert("您取消了协议，脚本无法使用 确定后会恢复正常 ！");
        return;
      }
    }

    if (flag === 1) {
      buttonContainer.style.display = "block";
      YQ_cube.innerHTML = "隐藏";
      flag = 0;
    } else {
      buttonContainer.style.display = "none";
      YQ_cube.innerHTML = "vip解析";
      flag = 1;
    }
  });
})();
