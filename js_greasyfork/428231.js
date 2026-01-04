// ==UserScript==
// @name         微信公众号批量添加全局可转载账号
// @namespace    https://windliang.wang/
// @version      1.3
// @description  微信公众号批量添加转载白名单
// @author       windliang
// @match        https://mp.weixin.qq.com/cgi-bin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428231/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E5%85%A8%E5%B1%80%E5%8F%AF%E8%BD%AC%E8%BD%BD%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/428231/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E5%85%A8%E5%B1%80%E5%8F%AF%E8%BD%AC%E8%BD%BD%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

(async function () {
  const objToParams = (data) => {
    const res = [];
    for (const key in data) {
      if (data[key] instanceof Object) {
        res.push(`${key}=${JSON.stringify(data[key])}`);
      } else {
        res.push(`${key}=${data[key]}`);
      }
    }
    return res.join("&");
  };
  const post = async (url, body) => {
    const data = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        pragma: "no-cache",
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: objToParams(body),
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
    return await data.json();
  };
  const getToken = () => {
    try {
      const url = document.getElementsByClassName(
        "weui-desktop-account__nickname"
      )[0].href;
      return url.match(/.*token=(\d+)&.*/)[1];
    } catch (e) {
      return "";
    }
  };
  const sleep = async (time) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), time);
    });
  };
  const addUsersList = async (userList, authType, inputNames) => {
    const failList = [];
    const token = getToken();
    if (!token) {
      alert("获取 token 失败，可以联系 wx: liang_extraordinary 进行修复");
      return;
    }
    inputNames.value = "开始添加...\n";
    let hasFailed = false;
    for (const user of userList) {
      const searchBody = {
        username: user,
        id: "",
        idx: "",
        token,
        lang: "zh_CN",
        f: "json",
        ajax: 1,
      };

      const searchRes = await post(
        "https://mp.weixin.qq.com/cgi-bin/appmsgcopyright?action=searchacct",
        searchBody
      );
      await sleep(2000);
      const addUser =
        searchRes.search_list &&
        searchRes.search_list.length &&
        searchRes.search_list[0];
      if (!addUser) {
        inputNames.value += `${user}❌ `;
        hasFailed = true;
        failList.push(user);
        continue;
      }
      const addBody = {
        id: "",
        idx: "",
        token,
        lang: "zh_CN",
        f: "json",
        ajax: 1,
        whitelist: {
          white_list: [
            {
              nickname: addUser.nickname,
              openid: addUser.openid,
              can_modify: authType.can_modify,
              can_hide_source: authType.can_hide_source,
              can_video_hide_source: authType.can_video_hide_source,
              can_reward: 1,
            },
          ],
        },
      };

      const addRes = await post(
        "https://mp.weixin.qq.com/cgi-bin/appmsgcopyright?action=global_add_ori_whitelist",
        addBody
      );
      if (addRes.base_resp.ret === 0) {
        inputNames.value += `${user}✅ `;
      } else {
        inputNames.value += `${user}❌ `;
        hasFailed = true;
        failList.push(user);
      }
      await sleep(1000);
    }
    if (hasFailed) {
      inputNames.value =
        `失败的名单：（请复制后重新添加）\n${failList.join(",")}\n` +
        inputNames.value;
    }
    return !hasFailed;
  };
  const createDialog = () => {
    let dom = document.createElement("div");
    dom.innerHTML = `
     <div class="wrap" id="mutli-dialog">
  <div class="dialog">
    <div class="header">
      <div class="title">批量添加权限 <a href="https://windliang.wang/2021/06/21/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E5%85%A8%E5%B1%80%E5%8F%AF%E8%BD%AC%E8%BD%BD%E8%B4%A6%E5%8F%B7/" target="_blank">by windliang</a></div>
      <svg id="close-icon" class="close" width="18" height="18" viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.01 8.996l7.922-7.922c.086-.086.085-.21.008-.289l-.73-.73c-.075-.074-.208-.075-.29.007L9 7.984 1.077.062C.995-.02.863-.019.788.055l-.73.73c-.078.078-.079.203.007.29l7.922 7.92-7.922 7.922c-.086.086-.085.212-.007.29l.73.73c.075.074.207.074.29-.008l7.92-7.921 7.922 7.921c.082.082.215.082.29.008l.73-.73c.077-.078.078-.204-.008-.29l-7.921-7.921z">
        </path>
      </svg>
    </div>
    <div class=content>
      <div class="names">
        <div class="label">公众号名称：</div>
        <div class="input">
          <textarea id="input-names" placeholder="输入公众号名称，以逗号分隔（公众号名称可能会添加失败，最好输入公众号的微信号）" rows="6" cols="40" style="width: 99%; resize:none;"
            ></textarea>
        </div>
      </div>
      <div class="permissions">
        <div class="item">
          <div class="permissions-name"> 转载文章时可以修改
          </div>
          <div class="permissions-switch">
            <input id="can_modify" class="mui-switch" type="checkbox" checked>
          </div>
        </div>
        <div class="item">
          <div class="permissions-name"> 转载文章时可以不展示来源
          </div>
          <div class="permissions-switch"><input id="can_hide_source" class="mui-switch" type="checkbox"></div>
        </div>
        <div class="item">
          <div class="permissions-name"> 转载视频时可以不展示来源
          </div>
          <div class="permissions-switch"><input id="can_video_hide_source" class="mui-switch" type="checkbox"
              checked></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="confirm" id="confirm-button">确定</div>
    </div>
  </div>
  </div>
  `;

    const style = document.createElement("style");

    const heads = document.getElementsByTagName("head");

    style.setAttribute("type", "text/css");

    style.innerHTML = `
   .wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    padding-top: 100px;
    font-family: "mp-quote", -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  }
  
  .dialog {
    width: 600px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
    border-radius: 4px;
    padding: 30px;
  }
  
  .header {
    display: flex;
    align-items: center;
  }
  
  .title {
    color: #353535;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .close {
    margin-left: auto;
    cursor: pointer;
  }
  
  .footer {
    display: flex;
    margin-top: 20px;
  }
  
  .confirm {
    margin-left: auto;
    cursor: pointer;
    font-weight: 400;
    line-height: 36px;
    height: 36px;
    font-size: 14px;
    letter-spacing: 0;
    border-radius: 4px;
    background-color: #07c160;
    color: #fff;
    min-width: 96px;
    text-align: center;
  }
  
  .names {
    margin-top: 20px;
  }
  
  .label {
    color: #353535;
  }
  
  .input {
    margin-top: 5px;
  }
  
  .permissions {
    margin-top: 20px;
  }
  
  .item {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    color: #1a1b1c;
    font-size: 15px;
    align-items: center;
  }
  
  .permissions-name {}
  
  .permissions-switch {
    margin-left: auto;
  }
  
  label {
    display: block;
    vertical-align: middle;
  }
  
  label,
  input,
  select {
    vertical-align: middle;
  }
  
  .mui-switch {
    width: 52px;
    height: 31px;
    position: relative;
    border: 1px solid #dfdfdf;
    background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
  }
  
  .mui-switch:before {
    content: '';
    width: 29px;
    height: 29px;
    position: absolute;
    top: 0px;
    left: 0;
    border-radius: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
  
  .mui-switch:checked {
    border-color: #64bd63;
    box-shadow: #64bd63 0 0 0 16px inset;
    background-color: #64bd63;
  }
  
  .mui-switch:checked:before {
    left: 21px;
  }
  
  .mui-switch.mui-switch-animbg {
    transition: background-color ease 0.4s;
  }
  
  .mui-switch.mui-switch-animbg:before {
    transition: left 0.3s;
  }
  
  .mui-switch.mui-switch-animbg:checked {
    box-shadow: #dfdfdf 0 0 0 0 inset;
    background-color: #64bd63;
    transition: border-color 0.4s, background-color ease 0.4s;
  }
  
  .mui-switch.mui-switch-animbg:checked:before {
    transition: left 0.3s;
  }
  
  .mui-switch.mui-switch-anim {
    transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
  }
  
  .mui-switch.mui-switch-anim:before {
    transition: left 0.3s;
  }
  
  .mui-switch.mui-switch-anim:checked {
    box-shadow: #64bd63 0 0 0 16px inset;
    background-color: #64bd63;
    transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
  }
  
  .mui-switch.mui-switch-anim:checked:before {
    transition: left 0.3s;
  }
  `;

    heads[0].append(style);
    document.getElementsByTagName("body")[0].append(dom);
  };
  if (location.href.indexOf("appmsgcopyright") !== -1) {
    const fatherNode = document.getElementsByClassName(
      "global-article__add-button"
    )[0];
    if (!fatherNode) {
      return;
    }
    const addNode = fatherNode.firstElementChild.cloneNode(true);
    addNode.innerText = "批量添加";
    addNode.style = "margin-left:10px";
    fatherNode.appendChild(addNode);
    let hasCreatDialog = false;
    const dialogOps = () => {
      if (!hasCreatDialog) {
        createDialog();
        hasCreatDialog = true;
      } else {
        const muliDialog = document.getElementById("mutli-dialog");
        muliDialog.hidden = false;
        return;
      }
      const muliDialog = document.getElementById("mutli-dialog");
      const closeDialog = () => {
        muliDialog.hidden = true;
        const inputNames = document.getElementById("input-names");
        inputNames.value = "";
        window.reloadPage();
      };
      const closeButton = document.getElementById("close-icon");
      closeButton.addEventListener("click", closeDialog, false);

      const confirmButton = document.getElementById("confirm-button");

      const confirmDialogClick = async () => {
        const inputNames = document.getElementById("input-names");
        if (inputNames.value.startsWith("失败的名单：")) {
          alert("请将失败的名单复制粘贴覆盖后再点确定");
          return;
        }
        if (!inputNames.value) {
          alert("请至少输入一个公众号");
          return;
        }
        const users = inputNames.value
          .split(/[，,]/g)
          .map((item) => item.trim());

        const canModify = document.getElementById("can_modify");
        const canHideSource = document.getElementById("can_hide_source");
        const canVideoHideSource = document.getElementById(
          "can_video_hide_source"
        );

        const authType = {
          can_modify: +canModify.checked,
          can_hide_source: +canHideSource.checked,
          can_video_hide_source: +canVideoHideSource.checked,
        };
        const result = await addUsersList(users, authType, inputNames);
        if (result) {
          muliDialog.hidden = true;
          window.reloadPage();
        } else {
          alert("存在失败的公众号，请检查（可能通过公众号名称未搜索到）");
        }
      };

      confirmButton.addEventListener("click", confirmDialogClick, false);
    };
    addNode.addEventListener("click", dialogOps, false);
  }
})();
