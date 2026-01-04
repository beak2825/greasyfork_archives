// ==UserScript==
// @name         美团处方自动审核
// @namespace    lwxingkong
// @version      0.4
// @description  美团外卖商家处方自动审核
// @author       豌豆射手
// @license      MIT
// @match        *://yiyao.meituan.com/main/frame*
// @icon         data:image/gif;base64,R0lGODlhIAAgAAAAACH+HkJ1aWx0IHdpdGggR0lGIE1vdmllIEdlYXIgNC4wAAAh/wtORVRTQ0FQRTIuMAMBAAAAIfkEAQkA9wAsAAAAACAAIACHAAAAAAAzAABmAACZAADMAAD/ACsAACszACtmACuZACvMACv/AFUAAFUzAFVmAFWZAFXMAFX/AIAAAIAzAIBmAICZAIDMAID/AKoAAKozAKpmAKqZAKrMAKr/ANUAANUzANVmANWZANXMANX/AP8AAP8zAP9mAP+ZAP/MAP//MwAAMwAzMwBmMwCZMwDMMwD/MysAMyszMytmMyuZMyvMMyv/M1UAM1UzM1VmM1WZM1XMM1X/M4AAM4AzM4BmM4CZM4DMM4D/M6oAM6ozM6pmM6qZM6rMM6r/M9UAM9UzM9VmM9WZM9XMM9X/M/8AM/8zM/9mM/+ZM//MM///ZgAAZgAzZgBmZgCZZgDMZgD/ZisAZiszZitmZiuZZivMZiv/ZlUAZlUzZlVmZlWZZlXMZlX/ZoAAZoAzZoBmZoCZZoDMZoD/ZqoAZqozZqpmZqqZZqrMZqr/ZtUAZtUzZtVmZtWZZtXMZtX/Zv8AZv8zZv9mZv+ZZv/MZv//mQAAmQAzmQBmmQCZmQDMmQD/mSsAmSszmStmmSuZmSvMmSv/mVUAmVUzmVVmmVWZmVXMmVX/mYAAmYAzmYBmmYCZmYDMmYD/maoAmaozmapmmaqZmarMmar/mdUAmdUzmdVmmdWZmdXMmdX/mf8Amf8zmf9mmf+Zmf/Mmf//zAAAzAAzzABmzACZzADMzAD/zCsAzCszzCtmzCuZzCvMzCv/zFUAzFUzzFVmzFWZzFXMzFX/zIAAzIAzzIBmzICZzIDMzID/zKoAzKozzKpmzKqZzKrMzKr/zNUAzNUzzNVmzNWZzNXMzNX/zP8AzP8zzP9mzP+ZzP/MzP///wAA/wAz/wBm/wCZ/wDM/wD//ysA/ysz/ytm/yuZ/yvM/yv//1UA/1Uz/1Vm/1WZ/1XM/1X//4AA/4Az/4Bm/4CZ/4DM/4D//6oA/6oz/6pm/6qZ/6rM/6r//9UA/9Uz/9Vm/9WZ/9XM/9X///8A//8z//9m//+Z///M////AAAAAAAAAAAAAAAACP8A9wkcSLCgwYHEYgDIdPBgJoUMbNgAEIPhQE0GRIkyMKkhQQA2mt27J7JZs4nK9mUC0IyTjY0eBQZAhs+kzWajmp2xYcDGM1FmALCxkZJgPYsGkunTZ5JkMzYmxUBthkwUTzNsxBCMwYAHjANmlj67iQyNgWYGoI5yxskAAB5s0CDkwUmCBJb4kjU12ekGgJwtO1WdCFerwDQ8AIiZZMOpyWN8bTBodoxTJzbHNhooPHAYgKIwHjODTBknZVGdLLG5BBSAEDOGBRbdd9ay7U6WjeFmw5uHGTlsDLQl1lCMJU6VW2bGzUnOJTZweYARxckMDo/KzsrhZJuTpTm8ecP/AHAAQMQYMfelsXH5eXjeZswYuDEwTeyYYoS/NxPdAPr0DREDwGb8DeWWJgCml59bblmUYHpoSMCDAbM9GJMyNmBggIUJLiOBECrUw2F6xHR13YgX8sDAfSgOpAxxykjAwD70aDIMMZoQx6FZDDBgABcqcuVWjwwAEMaD+dkgxJIS9miDBEgsueSKACZkgAE+MiCBkgZI6aUQn+HHgBBIlLmkZBEtOcSSSZRJZUPKuJZHmXOQaSYGXiIhQZcSsEhQiU4gkYQcUSKxJhI8JGEnAMRkogIDHQUowRxlVmqnEGOWSWGc5MWUyZgr3BCAkmWqyMWVMeioTIUNDQiAQJosC1hRiwNl4iCtAgUEADs=
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @namespace    https://greasyfork.org/zh-CN/scripts/463056-%E7%BE%8E%E5%9B%A2%E5%A4%84%E6%96%B9%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463056/%E7%BE%8E%E5%9B%A2%E5%A4%84%E6%96%B9%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/463056/%E7%BE%8E%E5%9B%A2%E5%A4%84%E6%96%B9%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

const worker_fuc = `
setInterval(()=>{postMessage('short')},2000)
setInterval(()=>{postMessage('long')},10000)
`; //Worker函数
const worker_Blob = new Blob([worker_fuc]); //生成一个Blob
const worker_URL = URL.createObjectURL(worker_Blob); //生成一个Blob链接
const worker = new Worker(worker_URL); //创建一个Web Worker

let powerState = false;
worker.onmessage = function ({data}) {
  if (powerState) {
    if (data==='short') {
      clickMain();
    }else{
      clickEl(queryBtn);
    }
  }
};

const goToAudit = "去审核";
const passBtn = "通过，并审核下一单";
const queryBtn = "查询";

const clickEl = (text) => {
  const result = $("#hashframe")
    .contents()
    .find(`:contains(${text})`)
    .filter(function () {
      return $(this).text() === text;
    });
  if (result.length) {
    result.get(0).click();
    return true;
  }
  return false;
};

let taskInterval;

const clickMain = () => {
  clickEl(goToAudit);
  if (clickEl(passBtn)) {
    powerState = false;
    setTimeout(() => {
      powerState = true;
    }, 2500);
  }
};

(function () {
  "use strict";

  GM_addStyle(`.xk-card {
      position: fixed;
      bottom: 100px;
      right: 100px;
      text-align: center;
    }
    #btn-switcher {
      background-color: white;
      border-radius: 20px;
      padding: 10px 10px;
      cursor: pointer;
    }`);

  const init = () => {
    $("body").append(`
      <div class="xk-card">
      <button id="btn-switcher">开始自动审核</button>
      <div class="state-box" style="display: flex; font-size: 14px; margin-top: 10px">
        状态:
        <div id="state"></div>
      </div>
    </div>`);

    $(".xk-card #btn-switcher").on("click", function () {
      if (
        location.href !== "https://yiyao.meituan.com/main/frame#/page/ysorder#/"
      ) {
        alert("请在处方审核页面操作");
        return;
      }
      const text = $(this).text();
      if (text === "开始自动审核") {
        powerState = true;
        $(this).text("停止自动审核");
        $(".xk-card #state").text(`正在自动审核`);
      } else {
        powerState = false;
        $(".xk-card #state").text(`停止自动审核`);
        $(this).text("开始自动审核");
      }
    });
  };
  init();
})();
