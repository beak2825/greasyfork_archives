// ==UserScript==
// @name         UMU 增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  增强 UMU 的体验，可根据参与人数进行搜索，可模糊搜索，支持在新窗口打开页面从而不丢失当前浏览状态。
// @author       LinHQ
// @match        https://m.umu.cn/course/*
// @icon         https://m.umu.cn/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect https://m.umu.cn/uapi/*
// @require https://greasyfork.org/scripts/429203-async-xmlhttprequest/code/Async%20xmlhttprequest.js?version=949226
// @downloadURL https://update.greasyfork.org/scripts/429206/UMU%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429206/UMU%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
'use strict'

// 搜索关键字 ask
let TYPES = new Map();
TYPES.set(1,"survey");
TYPES.set(2, "ask");
TYPES.set(3, "discussion");
TYPES.set(4, "photo");
TYPES.set(5, "GAME");
TYPES.set(6, "attendance");
TYPES.set(7, "mini_course");
TYPES.set(8, "raffle_drawing");
TYPES.set(9, "registration");
TYPES.set(10, "quiz");
TYPES.set(11, "video");
TYPES.set(12, "live");
TYPES.set(13, "article");
TYPES.set(14, "document");
TYPES.set(16, "exercise/?surl=");

let GROUPID = new URL(window.location.href).searchParams.get('groupId');

// 获取第{cid}目录下的内容
async function getChapters(cid, sessionCount) {
  let resp = await req({
    method: "POST",
    headers: {"Content-type": "application/x-www-form-urlencoded"},
    url: "https://m.umu.cn/uapi/v2/element/chapter-session",
    data: `t=${new Date().getTime()}&parent_id=${GROUPID}&chapter_id=${cid}&page=1&size=${sessionCount}&get_draft=0`
  });
  // 解析返回数据
  let li = JSON.parse(resp.responseText).data.list;
  li = li.map(l => {
    return {
      title: l.index + '.' + l.title,
      href: l.share_card_view.replace("element/share", `session/${TYPES.get(l.type)}`),
      people: parseInt(l.stat.finish_num),
      learned: l.extend.learn_status !== 0
    }
  });
  console.log(li);
  return li;
}

// 获取第{id}页
async function getPage(index) {
  let resp = await req({
    method: "POST",
    headers: {"Content-type": "application/x-www-form-urlencoded"},
    url: "https://m.umu.cn/uapi/v2/element/list",
    data: `t=${new Date().getTime()}&parent_id=${GROUPID}&page=${index}&size=15&get_draft=0`
  });
  return JSON.parse(resp.responseText).data;
}

// 获取所有列表
async function getIds() {
  let ids = [];
  let meta = await getPage(1);
  const pages = meta.page_info.total_page_num;
  for (let p = 1; p <= pages; p++) {
    let currentPage = await getPage(p);
    for (let dir of currentPage.list){
      let chapterIds = await getChapters(dir.id, parseInt(dir.session_count));
      ids = ids.concat(chapterIds);
    }
  }
  return ids;
}

// 根据人数进行过滤
function doFilter(filter, data) {
  console.log(data)
  // 【模式，值】
  let [mode, v] = filter.split(":");
  switch (mode) {
    case 's':
      return data.filter(e => e.title !== undefined && e.title.includes(v));
    case 'gt':
      return data.filter(e => e.people >= parseInt(v));
    case 'lt':
      return data.filter(e => e.people <= parseInt(v));
    case 'd':
      return data.filter(e => e.learned);
    case '!d':
      return data.filter(e => !e.learned);
    default:
      return [];
  }
}

(function () {
  GM_addStyle(`#gm_box{
  position: fixed;
  z-index: 9999;
  top: 0vh;
  left: 0;
  border: 1px solid #a0c5fd;
  border-radius: 5px;
  height: 95vh;
  width: 3.4rem;
  display: flex;
  flex-flow: column;
  }

  #gm_box input {
  margin: 10px;
  }

  #gm_box .show{
  height: 90vh;
  width: 3.4rem;
  margin: 3px auto;
  overflow: auto;
  padding: 5px;
  }

  #gm_box li {
  margin: 5px;
  border-left: 3px solid #fa541c;
  background: #e6e6e6;
  border-radius: 3px;
  padding: 3px;
  color: #114979;
  cursor: pointer;
  line-height: 1.2em;
  }

  #gm_box li.learned {
  border-left: 3px solid #52c41a;
  }

  #gm_box li.clicked {
  border-left: 3px solid #73289b;
  }

  #gm_box .state {
  text-align: center;
  align-self: center;
  font-size: 0.7em;
  }

  #gm_box .state span {
  color: #ff7875;
  }
  `);
  let container = document.createElement("div");
  container.id = "gm_box";
  container.innerHTML = `
  <input type="text" value="s:"/>
  <div class="state">Enter以开始搜索</div>
  <div class="show">
  <ol>
  </ol>
  </div>
  `;
  document.body.appendChild(container);

  let reader = document.querySelector("#gm_box input");
  let li = [];
  reader.onkeypress = async (e) => {
    let ol = document.querySelector(".show>ol");
    let state = document.querySelector("div.state");

    if (e.code === "Enter") {
      // 清除之前内容
      ol.innerHTML = "";

      // 检查缓存
      if (li.length === 0) {
        state.textContent = "正在加载中，请稍后...";
        li = await getIds();
      }

      let res = doFilter(e.target.value, li);
      // 展示结果
      state.textContent = `${res.length} 条结果`;
      for (let l of res) {
        let li = document.createElement("li");
        li.textContent = `${l.title}`;
        ol.appendChild(li);
        if (l.learned) li.classList.add("learned");

        li.onclick = () => {
          // 点击变色
          li.classList.add("clicked");
          window.open(l.href)
        };
      }
    }
  };

})();
