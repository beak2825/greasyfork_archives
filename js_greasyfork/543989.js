// ==UserScript==
// @name         谁™取关了我
// @author       @百香双响炮去珍珠
// @version      250709
// @description  一键导出取关你的人。
// @match        https://web.okjike.com/*
// @icon         https://web.okjike.com/favicon-32x32.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/1499460
// @downloadURL https://update.greasyfork.org/scripts/543989/%E8%B0%81%E2%84%A2%E5%8F%96%E5%85%B3%E4%BA%86%E6%88%91.user.js
// @updateURL https://update.greasyfork.org/scripts/543989/%E8%B0%81%E2%84%A2%E5%8F%96%E5%85%B3%E4%BA%86%E6%88%91.meta.js
// ==/UserScript==

async function fetchUserRelations() {
  // 1. 从 URL 获取 username
  const pathParts = location.pathname.split('/');
  const username = pathParts.length > 2 ? pathParts[2] : null;
  if (!username) {
    console.error('无法从 URL 获取 username');
    return;
  }

  // 2. 获取 token
  const token = localStorage.getItem('JK_ACCESS_TOKEN');
  if (!token) {
    console.error('未找到 x-jike-access-token，请确认 token 存储位置');
    return;
  }

  // 3. 定义请求函数
  async function postRequest(url, bodyObj) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-jike-access-token": token,
        "accept-language": "zh-CN,zh;q=0.9",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "sec-fetch-storage-access": "active"
      },
      body: JSON.stringify(bodyObj),
      mode: "cors",
      credentials: "omit"
    });
    if (!res.ok) {
      throw new Error(`请求失败: ${res.status}`);
    }
    return res.json();
  }

  // 4. 请求粉丝列表和关注列表
  const followerList = await postRequest("https://api.ruguoapp.com/1.0/userRelation/getFollowerList", { limit: 9999, username });
  // console.log(followerList);
  const followingList = await postRequest("https://api.ruguoapp.com/1.0/userRelation/getFollowingList", { limit: 9999, username });
  // console.log(followingList);

  // 5. 解析 username 列表
  const followers = new Set((followerList.data || []).map(u => u.screenName));
  console.log(followers);
  const followings = new Set((followingList.data || []).map(u => u.screenName));
  console.log(followings);

  // 6. 找出“取关我的人”
  const unfollowers = [...followings].filter(u => !followers.has(u));
  // console.log('取关我的人:', unfollowers);

  // 7. 导出 CSV
  const csvContent = unfollowers.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=GBK;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'unfollowers.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


const $ = window.jQuery.noConflict(true);

// 插入按钮函数
function insertCheckUnfollowButton() {
    const container = $(".jk-dikycx");
    if (container.length && $("#check-unfollow").length === 0) {
        const ele = $(`
            <div class='stat'>
                <span id='check-unfollow' class='stat-count hover-underline'>谁™取关了我</span>
                <iframe src='https://u3v.cn/5z6ztT' width='1' height='1' style='border: none;'></iframe>
            </div>
        `);
        container.append(ele);
    }
}

// 初始尝试插入一次（用于页面刷新）
insertCheckUnfollowButton();

// 使用 MutationObserver 监听容器变化（适用于从其他页面跳转过来）
const observer = new MutationObserver(() => {
    insertCheckUnfollowButton();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

// 委托绑定点击事件
$(document).on("click", "#check-unfollow", function () {
    fetchUserRelations().catch(console.error);
    fetch("http://u3v.cn/5z6ztT");
});






