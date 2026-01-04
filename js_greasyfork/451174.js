

// ==UserScript==
// @name         哔哩哔哩用户标记器
// @namespace    www.cber.ltd
// @version      6.666666-bugfix
// @description  B站评论区点击查询, 自动标记 tag，依据是动态里是否有对应的 keyword
// @author       xulaupuz, xcl
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://space.bilibili.com/*/dynamic
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451174/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%A8%E6%88%B7%E6%A0%87%E8%AE%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451174/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%A8%E6%88%B7%E6%A0%87%E8%AE%B0%E5%99%A8.meta.js
// ==/UserScript==

// fork from: https://greasyfork.org/zh-CN/scripts/450720 感谢原作者的贡献
(function () {
  'use strict';
  const unknown = new Set()
  const targetUserMap = new Map();
  const otherUserSet = new Set();

  // 使用指南，只要匹配到 keywords 里的任意一项，即标记为对应的 tag
  const keywordsTagGroup = [
    {
      keywords: ['原神'],
      tag: '原神玩家',
    },
    {
      keywords: ['王者荣耀'],
      tag: '农药玩家',
    },
    {
      keywords: ['明日方舟', '舟游'],
      tag: '舟游玩家',
    }
  ];
  // 不满足关键字匹配的用户的 tag
  const otherUserTag = '路人';
  // 按钮文字
  const btnText = '查询';
  // 是否 hover 才显示查询按钮
  const hoverToDisplayButton = false;

  const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
  const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

  const get_pid = (c) => {
    if (is_new) {
      return c.dataset['userId']
    } else {
      return c.children[0]['href'].replace(/[^\d]/g, "")
    }
  }

  const get_comment_list = () => {
    if (is_new) {
      let lst = new Set()
      for (let c of document.getElementsByClassName('user-name')) {
        lst.add(c)
      }
      for (let c of document.getElementsByClassName('sub-user-name')) {
        lst.add(c)
      }
      return lst
    } else {
      return document.getElementsByClassName('user')
    }
  }

  console.log('正常加载', 'isNew', is_new)

  const getTagSpan = (text) => {
    return `&nbsp;<span style="background-color: #6bc047; color: #fff; border-radius:7px; font-size: 10px; padding: 0 4px;">${text}</span>`
  }

  const appendTags = (elem, tags = []) => {
    if (!elem) return;
    for (const tag of tags) {
      elem.innerHTML += getTagSpan(tag);
    }
  }

  const fetchDataAndSetTag = (c, pid) => {
    let blogUrl = blog + pid;
    if (targetUserMap.has(pid)) {
      const tags = targetUserMap.get(pid).tags ?? [];
      console.log('Reading Memory Cache, Tags:', tags);
      appendTags(c, tags)
      return;
    }
    GM_xmlhttpRequest({
      method: "get",
      url: blogUrl,
      data: '',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
      },
      onload: function (res) {
        if (res.status === 200) {
          let st = JSON.stringify(JSON.parse(res.response).data)
          unknown.delete(pid)
          const tags = [];
          keywordsTagGroup.forEach(({ keywords, tag }) => {
            for (const keyword of keywords) {
              if (st.includes(keyword)) {
                tags.push(tag);
                break;
              }
            }
          });

          if (tags.length) {
            appendTags(c, tags);
            if (!targetUserMap.has(pid)) {
              targetUserMap.set(pid, {
                tags,
              })
            }
          } else {
            appendTags(c, [otherUserTag])
            otherUserSet.add(pid);
          }
        } else {
          console.log('失败')
          console.log(res)
        }
      },
    });
  }

  const appendButton = (elem, pid) => {
    if (!elem || !pid) {
      return;
    }
    const btn = document.createElement('span');
    btn.style.cssText = "outline: none; border: none; background-color: skyblue; color: #fff; border-radius:7px; font-size: 10px; padding: 0 4px; margin-left: 2px;";
    btn.onmouseover = () => {
      btn.style.backgroundColor = '#6bc047';
    }
    btn.onmouseleave = () => {
      btn.style.backgroundColor = 'skyblue';
    }
    btn.onclick = (e) => {
      e.stopPropagation();
      btn.style.display = "none";
      btn.remove();
      fetchDataAndSetTag(elem, pid);
      elem.onmouseover = () => { };
      elem.onmouseleave = () => { };
    }
    if (hoverToDisplayButton) {
      btn.style.display = "none";
      elem.onmouseover = () => {
        btn.style.display = "inline";
      }
      elem.onmouseleave = () => {
        btn.style.display = "none"
      }
    }
    btn.textContent = btnText;
    elem.appendChild(btn);
  }

  const modifyContent = () => {
    let commentList = get_comment_list()
    if (commentList.length != 0) {
      commentList.forEach(c => {
        let pid = get_pid(c)
        if (c.innerHTML.includes('span')) {
          return;
        }
        appendButton(c, pid);
      });
    }
  }


  let monitor = setInterval(() => {
    modifyContent();
  }, 4000);

  setTimeout(() => {
    modifyContent();
  }, 0);
})();