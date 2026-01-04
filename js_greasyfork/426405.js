// ==UserScript==
// @name        获取QQ群成员QQ号 - qq.com
// @namespace   Violentmonkey Scripts
// @match       https://qun.qq.com/member.html
// @grant       GM_setClipboard
// @icon        https://p.qlogo.cn/gh/1032532634/1032532634/40
// @version     1.0
// @author      渣渣火，QQ：2596136372
// @description 2021/3/20下午4:28:28
// @downloadURL https://update.greasyfork.org/scripts/426405/%E8%8E%B7%E5%8F%96QQ%E7%BE%A4%E6%88%90%E5%91%98QQ%E5%8F%B7%20-%20qqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/426405/%E8%8E%B7%E5%8F%96QQ%E7%BE%A4%E6%88%90%E5%91%98QQ%E5%8F%B7%20-%20qqcom.meta.js
// ==/UserScript==

(function () {
  // 群成员QQ号数组
  let qunMembersList = [];
	// 需要过滤的QQ群
	let filterQQList = [];
  setTimeout(() => {
		// 添加过滤QQ群号
    let groupTitle = document.querySelector('.group-tit');
    let inputQQNum = document.createElement('input');
    inputQQNum.placeholder = '请输入需要过滤的QQ群号码，多个以英文逗号分割';
    inputQQNum.style.width = '900px';
    groupTitle.appendChild(inputQQNum);
		// 添加获取按钮
    let membersDom = document.querySelector('.group-members');
    let copyBtn = document.createElement('button');
    copyBtn.innerText = '一键复制QQ群成员QQ号';
    copyBtn.style.width = 'auto';
    copyBtn.style.backgroundColor = '#2b77e5';
    membersDom.appendChild(copyBtn);
		// 添加事件
    copyBtn.addEventListener('click', () => {
			filterQQList = inputQQNum.value.split(',');
			console.log('filterQQList：', filterQQList);
      if (qunMembersList.length === 0) {
        getQunGroup();
      } else {
        GM_setClipboard(qunMembersList.join('\n'));
        console.log('群信息已获取完毕，请直接粘贴');
        alert('群信息已获取完毕，请直接粘贴');
      }
    });
  }, 3000);
  async function getQunGroup() {
    let groupListParams = new FormData();
    groupListParams.append('bkn', $.getCSRFToken());
    let response = await fetch('/cgi-bin/qun_mgr/get_group_list', {
      method: 'POST',
      body: groupListParams
    });
    let res = await response.json();
		filterQQArr(res);
		console.log('res：', res);
    // 获取创建的群
    await getListQun(res.create);
    // 获取管理群
    await getListQun(res.manage);
    // 获取加入群
    await getListQun(res.join);
    qunMembersList = [...new Set(qunMembersList)];
    qunMembersList = qunMembersList.map((d) => d + '@qq.com');
    console.log('总人数为：', qunMembersList.length);
    window.qunMembersList = qunMembersList;
    GM_setClipboard(qunMembersList.join('\n'));
    console.log('群成员QQ号信息已获取完毕，请直接粘贴');
    alert('群成员QQ号信息已获取完毕，请直接粘贴');
  }
	function filterQQArr(res) {
		res.create = res.create || [];
		res.manage = res.manage || [];
		res.join = res.join || [];
		res.create = res.create.filter(d => !filterQQList.includes(d.gc.toString()));
		res.manage = res.manage.filter(d => !filterQQList.includes(d.gc.toString()));
		res.join = res.join.filter(d => !filterQQList.includes(d.gc.toString()));
	}
	// 循环获取群信息
  async function getListQun(arr = []) {
    for (let index = 0; index < arr.length; index++) {
      const qun = arr[index];
      console.log(`正在获取第${index + 1}个群，${qun.gn}，${qun.gc}`);
      await getQunInfo(qun);
    }
  }
	// 循环分页获取群QQ号
  async function getQunInfo(qun) {
    let pageSize = 40;
    let page = 1;
    let isGet = true;
    let membersList = [];
    while (isGet) {
      console.log('页数：', (page - 1) * pageSize, page * pageSize);
      let mems = await getQunMembers(qun.gc, (page - 1) * pageSize, page * pageSize);
      if (mems.length === 0 || mems.length < pageSize) {
        membersList.push(...mems);
        isGet = false;
      } else {
        page++;
        membersList.push(...mems);
      }
    }
		// 获取最后一页的时候，第一条数据和上一页最后一条数据会重复，去重一下
    membersList = [...new Set(membersList)];
    console.log(`${qun.gn}，群人数为：${membersList.length}`);
    console.log('membersList：', membersList);
    qunMembersList.push(...membersList);
  }
	// 获取群QQ号
  async function getQunMembers(gc, st, end) {
    let params = new FormData();
    params.append('gc', gc);
    params.append('st', st);
    params.append('end', end);
    params.append('sort', 0);
    params.append('bkn', $.getCSRFToken());
    await delay(500);
    let response = await fetch('/cgi-bin/qun_mgr/search_group_members', {
      method: 'POST',
      body: params
    });
    let res = await response.json();
    return res.mems ? res.mems.map((d) => d.uin) : [];
  }

  async function delay(time) {
    return new Promise((res) => {
      setTimeout(() => {
        console.log(`延迟${time}ms`);
        res();
      }, time);
    });
  }
})();
