// ==UserScript==
// @name         批量计算核酸检测状态
// @namespace    super
// @version      1.4
// @description  不对外公开
// @author       Crack
// @match        https://hsjc.qingdao.gov.cn
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      https://hsjc.qingdao.gov.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454114/%E6%89%B9%E9%87%8F%E8%AE%A1%E7%AE%97%E6%A0%B8%E9%85%B8%E6%A3%80%E6%B5%8B%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/454114/%E6%89%B9%E9%87%8F%E8%AE%A1%E7%AE%97%E6%A0%B8%E9%85%B8%E6%A3%80%E6%B5%8B%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function () {
  const css = `#current{color:#fff;height:40px;width:120px;top:15px;left:400px;background:#ff4d4f;cursor:pointer;z-index:1000;position:absolute;display:flex;align-items:center;border-radius:3px;justify-content:center}`;
  const div = document.createElement("div");
  const code = `aHR0cHM6Ly9oc2pjLnFpbmdkYW8uZ292LmNuL2FwaS90ZXN0UmVzdWx0L2ZpbmRUZXN0UmVzdWx0`;
  const url = window.atob(code);
  // UI层设置
  div.innerHTML = '<div id="current">批量查询v1.4</div>';
  document.body.append(div);
  GM_addStyle(css);

  // 获取身份标识
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
  }
  // 获取指定权限校验参数
  const killBear = decodeURIComponent(getCookie("vue_admin_template_token"));

  async function pull(ids) {
    let results = [];
    let count = 0;
    async function post(url = "", id = "") {
      const data = { pageNum: 1, pageSize: 1, idCard: id.trim() };
      const response = await fetch(url, {
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: killBear,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    }

    // 清除定时器
    clearInterval(window.timer);
    // 每50毫秒查询一次 防止触发防火墙封号。
    window.timer = setInterval(async () => {
      const target = document.getElementById("current");
      target.innerHTML = `查询中 - ${ids.length}`;
      const _id = ids.shift();
      if (_id) {
        // 请求数据
        const response = await post(url, _id);
        const target = response.data.result[0] || {
          idCard: _id,
          fullName: "没有查到检测结果",
        };
        const models = {};
        models.query = _id;
        models.idCard = target.idCard;
        models.fullName = target.fullName;
        models.gatheringTime = target.gatheringTime || "";
        models.mobile = target.mobile;
        models.regionName = target.regionName;
        models.gridName = target.gridName;
        models.testSiteName = target.testSiteName;
        models.testStatus = target.testStatus;

        results.push(models);
        count++;

        if (ids.length === 0) {
          GM_setClipboard(JSON.stringify(results));
          unsafeWindow.window.document.title = `${count}条数据已经复制到剪贴板`;
          results = [];
          count = 0;
          clearInterval(window.timer);
          const div = document.getElementById("current");
          div.style.background = "#52c41a";
          div.innerHTML = "批量查询v1.4";
        }
      }
    }, 80);
  }
  div.onclick = function (e) {
    const message = prompt("输入身份证号码,英文逗号间隔");
    if (message) {
      e.target.style.background = "#ff4d4f";
      e.target.innerHTML = "查询中";
      unsafeWindow.window.document.title = "";
      const ids = message.split(",");
      pull(ids);
    }
  };
})();
