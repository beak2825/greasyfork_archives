// ==UserScript==
// @name         AO3屏蔽某作者文章和某用户评论
// @namespace    https://github.com/VincentPvoid
// @version      0.2.1
// @description  一个简单的屏蔽特定AO3作者和特定用户评论的脚本
// @author       VincentPViod
// @match        https://archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/415419/AO3%E5%B1%8F%E8%94%BD%E6%9F%90%E4%BD%9C%E8%80%85%E6%96%87%E7%AB%A0%E5%92%8C%E6%9F%90%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/415419/AO3%E5%B1%8F%E8%94%BD%E6%9F%90%E4%BD%9C%E8%80%85%E6%96%87%E7%AB%A0%E5%92%8C%E6%9F%90%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let setting = {
    openNewPage: false, // 是否在新窗口打开文章
    quickKudo: false,   // 是否打开快捷点赞
    showBanBtn: true, // 是否显示屏蔽作者按钮
    useBanAuthors: true, // 是否屏蔽黑名单作者文章
    useBanUsers: true, // 是否屏蔽黑名单用户
    useBanOrphans: false, // 是否屏蔽orphan_account账号
    useFilterTitleSummary: false, // 是否进行关键词屏蔽
    filterKwType: 'ALL', // 关键词屏蔽模式（标题简介/标题/简介）
    hiddenImgs: true, // 是否隐藏文章图片
  }
  let banAuthorsList = []; // 屏蔽作者列表
  // 保存的屏蔽作者列表
  let localBanAuthorsList = JSON.parse(window.localStorage.getItem('vpv_ban_list'));
  if (localBanAuthorsList && localBanAuthorsList.length) {
    banAuthorsList = localBanAuthorsList;
  }

  let banUsersList = []; // 屏蔽用户列表
  // 保存的屏蔽用户列表
  let localBanUsersList = JSON.parse(window.localStorage.getItem('vpv_ban_users_list'));
  if (localBanUsersList && localBanUsersList.length) {
    banUsersList = localBanUsersList;
  }
  // 监视评论列表的计时器
  let watchCommentsListTimer = null;

  let filterKwList = []; // 屏蔽关键词列表
  // 保存的屏蔽关键词列表
  let localFilterKwList = JSON.parse(window.localStorage.getItem('vpv_filter_kw_list'));
  if (localFilterKwList && localFilterKwList.length) {
    filterKwList = localFilterKwList;
  }


  // 生成打开设置菜单按钮
  let btnOpenSetting = document.createElement('div');
  btnOpenSetting.setAttribute('id', 'vpv_AO3_switch_btn');
  btnOpenSetting.innerHTML = 'AO3插件设置';

  // 生成顶部提示
  let topTip = document.createElement('div');
  topTip.setAttribute('id', 'vpv_top_tip');
  topTip.innerHTML = '';
  document.body.appendChild(topTip);

  // 生成整体容器；覆盖整个页面
  let mainDivCover = document.createElement('div');
  mainDivCover.setAttribute('id', 'vpv_AO3_main_cover');
  mainDivCover.innerHTML = `
    <div class="vpv-AO3-main-con">
      <div class="btn-close">x</div>
      <h3 class="title">AO3插件 v0.2.0</h3>
      <div class="setting-items">
        <label>
          <input type="checkbox"> 新窗口打开文章
        </label>
      </div>
      <div class="setting-items">
        <label>
          <input type="checkbox"> 快捷点赞（快键键[K]）
        </label>
      </div>
      <div class="setting-items">
        <label>
          <input type="checkbox" checked> 显示屏蔽作者按钮
        </label>
      </div>
      <div class="setting-items">
        <label>
          <input type="checkbox" checked> 屏蔽orphan_account账号文章
        </label>
      </div>
      <div class="setting-items">
        <label>
          <input type="checkbox" checked> 屏蔽作者文章
        </label>
      </div>
      <div class="setting-items">
        <button class="btn-authors-list">名单管理</button>
      </div>
      <div class="setting-items">
        <label>
          <input type="checkbox" checked> 屏蔽用户评论
        </label>
      </div>
      <div class="setting-items">
        <button class="btn-users-list">名单管理</button>
      </div>

      <div class="setting-items">
        <label>
          <input type="checkbox" checked> 关键字屏蔽
        </label>
      </div>
      <div class="setting-items">
        <button class="btn-keywords-list">关键字管理</button>
        <select id="vpv-AO3-keyword-select">
          <option value="ALL">标题和简介</option>
          <option value="TITLE">仅标题</option>
          <option value="SUMMARY">仅简介</option>
        </select>
      </div>

      <div class="setting-items">
        <label>
          <input type="checkbox" checked> 隐藏文章图片
        </label>
      </div>

      <div class="bottom-con">
        <button class="btn-open-import">导入/导出名单</button>
        <button class="btn-save">保存设置</button>
      </div>

      <div class="inner-cover-authors">
        <div class="ban-authors-list-con">
          <div class="btn-close">x</div>
          <h4>屏蔽作者名单管理</h4>
          <div class="ban-authors-list">
            <table>
              <thead>
                <tr>
                  <th>用户名</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
          <button class="btn-open-add-author">添加作者</button>
          <button class="btn-clear-authors-list">清空作者列表</button>
          <button class="btn-clear-invalid-authors" title="此作者名不存在或此作者名下没有作品，则会被清除；名单长度太长时可能会有问题">清空无效作者</button>
          <div class="add-author-con">
            <div>
              <div class="btn-close">x</div>
            </div>
            <p>添加作者</p>
            <input type="text" placeholder="作者名" class="add-input">
            <button class="btn-add-author">添加</button>
          </div>
          <p class="clear-list-tip"></p>
        </div>
      </div>

      <div class="inner-cover-users">
        <div class="ban-users-list-con">
          <div class="btn-close">x</div>
          <h4>屏蔽用户名单管理</h4>
          <div class="ban-users-list">
            <table>
              <thead>
                <tr>
                  <th>用户名</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
          <button class="btn-open-add-user">添加用户</button>
          <button class="btn-clear-users-list">清空用户列表</button>
          <div class="add-user-con">
            <div>
              <div class="btn-close">x</div>
            </div>
            <p>添加用户</p>
            <input type="text" placeholder="用户名" class="add-input">
            <button class="btn-add-user">添加</button>
          </div>
        </div>
      </div>

      <div class="inner-cover-import">
        <div class="import-export-con">
          <div class="btn-close">x</div>
          <div class="import-left">
            <h4>选择要导出的名单</h4>
            <div class="export-items">
              <label>
                <input type="checkbox">屏蔽作者名单
              </label>
            </div>
            <div class="export-items">
              <label>
                <input type="checkbox">屏蔽用户名单
              </label>
            </div>
            <div class="import-btn-con">
              <button class="btn-export">导出</button>
              <button class="btn-import">导入</button>
            </div>
            <div class="import-export-msg">
            </div>
          </div>

          <div class="import-right">
            <h4>名单字符串</h4>
            <textarea cols="30" rows="12" placeholder="将名单字符串复制到这里，点击【导入】即可导入名单；点击【导出】后，这里将显示当前名单字符串，可以复制进行备份等"></textarea>
          </div>
     
        </div>
      </div>


      <div class="inner-cover-keywords">
        <div class="filter-keywords-list-con">
          <div class="btn-close">x</div>
          <h4>屏蔽关键字</h4>
          <div class="filter-keywords-list">
            <textarea cols="20" rows="15"></textarea>
          </div>
          <p>说明：一行一条，大小写敏感</p>
          <button class="btn-save-filter-keywords">保存列表</button>

        </div>
      </div>




      </div>`;

  // 把需要的结构插入body中
  document.body.appendChild(mainDivCover);

  // 保存的设置
  let localSetting = window.localStorage.getItem('vpv_AO3_setting');
  if (JSON.parse(localSetting)) {
    // console.log(localSetting)
    setting = JSON.parse(localSetting);
    let settingItems = document.querySelectorAll('#vpv_AO3_main_cover .setting-items input');
    let settingSelect = document.querySelector('#vpv-AO3-keyword-select')
    settingItems[0].checked = setting.openNewPage;
    settingItems[1].checked = setting.quickKudo;
    settingItems[2].checked = setting.showBanBtn;
    settingItems[3].checked = setting.useBanOrphans;
    settingItems[4].checked = setting.useBanAuthors;
    settingItems[5].checked = setting.useBanUsers;
    settingItems[6].checked = setting.useFilterTitleSummary;
    settingItems[7].checked = setting.hiddenImgs;
    settingSelect.value = setting.filterKwType || 'ALL';
  }

  // 在新窗口打开文章
  if (setting.openNewPage) {
    let titlesA = document.querySelectorAll('#main h4.heading a:first-child');
    for (let i = 0; i < titlesA.length; i++) {
      titlesA[i].target = '_blank';
    }
  }

  // 按K快捷点赞；当focus文本框时不触发
  if (setting.quickKudo) {
    document.onkeyup = function (e) {
      // 选中kudo按钮
      let btnKudo = document.querySelector('#new_kudo [type="submit"]');

      // 监听键盘事件，当e.target为input和textarea时不触发事件
      // 注意：kudo键本身为input；如果focus在kudo键上也不能触发事件
      if (e.keyCode === 75 && !(e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')) {
        window.scroll(0, btnKudo.offsetTop);
        btnKudo.click();
        // console.log('kudos')
      }
    }
  }

  // 所有作者列表数组
  let authors = document.querySelectorAll('h4.heading [rel="author"]');
  authors = [].slice.call(authors);

  // 如果选择屏蔽作者功能打开
  if (setting.useBanAuthors && banAuthorsList.length) {
    let tars = [];
    let temp = null;
    for (let i = 0; i < authors.length; i++) {
      // let tars = authors.filter((item) => item.innerHTML === banAuthorsList[i]);
      temp = banAuthorsList.find((item) => item === authors[i].innerHTML) ? authors[i] : null;
      if (temp) {
        tars.push(temp)
      }
    }
    tars.forEach((item) => {
      // a --- h4 --- div -- li
      let li = item.parentElement.parentElement.parentElement;
      // li.style.display = 'none';
      li.parentElement.removeChild(li);
    })
  }

  // 如果选择屏蔽orphan_account账号功能打开
  if (setting.useBanOrphans) {
    let tars = [];
    let temp = null;
    for (let i = 0; i < authors.length; i++) {
      temp = authors[i].innerHTML === 'orphan_account' ? authors[i] : null;
      if (temp) {
        tars.push(temp)
      }
    }
    tars.forEach((item) => {
      // a --- h4 --- div -- li
      let li = item.parentElement.parentElement.parentElement;
      // li.style.display = 'none';
      li.parentElement.removeChild(li);
    })
  }

  // 如果过滤关键词功能打开
  if (setting.useFilterTitleSummary && filterKwList.length) {
    // works列表
    let workLis = document.querySelectorAll('ol.work>li')
    let tarsArr = [];
    let temp = null;
    let tar = null;
    for (let i = 0; i < workLis.length; i++) {
      tar = filterKwList.find(item => {
        // 如果选择过滤全部/标题；标题一定存在所以不用进行检查
        if (setting.filterKwType === 'ALL' || setting.filterKwType === 'TITLE') {
          temp = workLis[i].querySelector('.heading a:first-child')
          if (temp.innerHTML.includes(item)) {
            return true
          }
        }
        // 如果选择过滤全部/简介
        if (setting.filterKwType === 'ALL' || setting.filterKwType === 'SUMMARY') {
          temp = workLis[i].querySelector('.summary')
          // 简介可能为空所以需要进行检查
          if (temp) {
            temp = temp.innerText.replaceAll('\n\n', ' ')
            if (temp.includes(item)) {
              return true
            }
          }

        }
        return false;
      })
      if (tar) {
        tarsArr.push(workLis[i])
      }
    }
    tarsArr.forEach(item => {
      item.parentElement.removeChild(item);
    })
  }

  // 文章中所有图片数组
  let articleImgs = document.querySelectorAll('#workskin img');
  articleImgs = [].slice.call(articleImgs);
  // 如果隐藏图片功能打开
  if (setting.hiddenImgs) {
    let btnEle = null;
    let parEle = null;
    articleImgs.forEach(imgEle => {
      // 如果图片在文章标题，则不使用显示/隐藏按钮
      if(imgEle.parentElement.tagName && imgEle.parentElement.tagName.toLowerCase() === 'h2'){
        return false;
      }
      imgEle.style.display = 'none';
      btnEle = document.createElement('button');
      // btnEle.classList.add('change-img-dis');
      // btnEle.innerHTML = '显示/隐藏图片';
      btnEle.innerHTML = '显示图片';
      btnEle.style = "display:block; margin-bottom:10px;";
      // 添加按钮点击事件
      addImgBtnEvent(imgEle, btnEle)
      parEle = imgEle.parentElement;
      // parEle.appendChild(btnEle);
      parEle.insertBefore(btnEle, imgEle)
    })
  }



  // 打开设置菜单
  btnOpenSetting.addEventListener('click', () => {
    let mainDivCover = document.querySelector('#vpv_AO3_main_cover');
    mainDivCover.style.display = 'flex';
    // console.log('abc')
  })

  // 把开关插入左上用户导航栏
  let greeting = document.querySelector('#greeting') ? document.querySelector('#greeting') : document.querySelector('#login');
  // 如果没有该结构，则不插入
  if (greeting != null) {
    greeting.insertBefore(btnOpenSetting, greeting.children[0]);
  }

  // 清除无效作者按钮下方tips容器
  let clearListTip = document.querySelector('.inner-cover-authors .clear-list-tip')

  // 关闭按钮事件
  let btnCloses = document.querySelectorAll('#vpv_AO3_main_cover .btn-close');
  for (let i = 0; i < btnCloses.length; i++) {
    btnCloses[i].addEventListener('click', () => {
      let tar = btnCloses[i].parentElement.parentElement;
      tar.style.display = 'none';
      clearListTip.innerHTML = '';
    })
  }




  /*
  屏蔽作者相关
  */

  // 生成屏蔽作者按钮
  if (setting.showBanBtn) {
    for (let i = 0; i < authors.length; i++) {
      let tar = authors[i].parentElement;
      if (authors[i].textContent === 'orphan_account') continue;
      let btnBan = document.createElement('div');
      btnBan.setAttribute('class', 'vpv-AO3-ban-btn');
      btnBan.innerHTML = '屏蔽该作者';
      tar.appendChild(btnBan);

      // 点击 屏蔽该作者 按钮把作者加入黑名单
      btnBan.addEventListener('click', function () {
        // console.log(authors[i].textContent);
        let text = authors[i].textContent;
        if (banAuthorsList.indexOf(text) === -1) {
          banAuthorsList.push(text);
        }
        window.localStorage.setItem('vpv_ban_list', JSON.stringify(banAuthorsList));
        showTopTip(topTip, '屏蔽成功，刷新后生效');
      })
    }
  }

  // 生成屏蔽作者名单列表
  let banAuthorsTable = document.querySelector('#vpv_AO3_main_cover .ban-authors-list table');
  if (banAuthorsList.length) {
    createBanList(banAuthorsList, banAuthorsTable)
  }
  // 点击删除，删除作者名单列表条目
  banAuthorsTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      let tr = e.target.parentElement.parentElement;
      let value = tr.querySelector('td').innerHTML;
      // console.log(value)
      tr.parentElement.removeChild(tr);
      banAuthorsList = banAuthorsList.filter((item) => item != value);
      window.localStorage.setItem('vpv_ban_list', JSON.stringify(banAuthorsList));
    }
  })


  // 打开屏蔽作者名单列表
  let btnAnthorsList = document.querySelector('#vpv_AO3_main_cover .btn-authors-list');
  btnAnthorsList.addEventListener('click', () => {
    let listCover = document.querySelector('#vpv_AO3_main_cover .inner-cover-authors');
    listCover.style.display = 'block';
  })

  // 打开添加作者弹框
  let btnOpenAddAuthor = document.querySelector('#vpv_AO3_main_cover .btn-open-add-author');
  btnOpenAddAuthor.addEventListener('click', () => {
    let addAuthorCon = document.querySelector('#vpv_AO3_main_cover .add-author-con');
    addAuthorCon.style.display = 'block';
  })

  let btnAddAuthor = document.querySelector('#vpv_AO3_main_cover .btn-add-author');
  // 添加作者进入屏蔽列表
  btnAddAuthor.addEventListener('click', () => {
    let par = btnAddAuthor.parentElement;
    let input = par.querySelector('.add-input');
    // console.log(input.value)
    let text = input.value.trim();
    if (text === '') {
      showTopTip(topTip, '请输入作者名');
      return;
    }
    if (banAuthorsList.indexOf(text) === -1) {
      banAuthorsList.push(text);
      window.localStorage.setItem('vpv_ban_list', JSON.stringify(banAuthorsList));

      let tr = document.createElement('tr');
      tr.innerHTML = `<td>${text}</td>
          <td><button class="btn-delete">删除</button></td>`;
      banAuthorsTable.querySelector('tbody').appendChild(tr);
    }
    input.value = '';
    // 关闭添加作者弹框
    par.style.display = 'none';
  })

  // 清空无效作者
  let btnClearInvaildAuthors = document.querySelector('.inner-cover-authors .btn-clear-invalid-authors')
  // let clearListTip = document.querySelector('.inner-cover-authors .clear-list-tip')
  btnClearInvaildAuthors.addEventListener('click', () => {
    if (banAuthorsList.length === 0) return;
    if (banAuthorsList.includes('orphan_account')) {
      banAuthorsList = banAuthorsList.filter(item => item != 'orphan_account')
      window.localStorage.setItem('vpv_ban_list', JSON.stringify(banAuthorsList));
      createBanList(banAuthorsList, banAuthorsTable)
      clearListTip.innerHTML = `请勿添加orphan_account到屏蔽名单中，如需屏蔽，请使用屏蔽orphan_account功能；当前已清除orphan_account，请重新开始清理功能`
      return;
    }

    let invaildArr = [];
    // let promiseArr = [];
    let failedReqList = []  // 清除无效作者发送请求的失败列表
    let num = 0;
    // let isHasOrphanAcc = false;
    const baseUrl = 'https://archiveofourown.org/users/'
    const keyword = 'id="user-works"' // 如果该作者存在并且有作品，则会带有该字段
    // banAuthorsList.forEach(item => {
    //   promiseArr.push(baseSendRequest(baseUrl + item))
    // })

    sendList(banAuthorsList)

    function sendList(listArr) {
      clearListTip.innerHTML = '正在处理，请稍后（请勿重复点击）；如不想继续清理，请刷新页面'
      let promiseArr = [];
      listArr.forEach(item => {
        promiseArr.push(baseSendRequest(baseUrl + handleUserNameUrl(item)))
      })
      Promise.all(promiseArr)
        .then(res => {
          clearListTip.innerHTML = ''
          failedReqList = []
          invaildArr = [];
          res.forEach((xhr, index) => {
            // console.log(item)
            // if (item.indexOf('Retry later') != -1) return;
            if (xhr.status >= 200 && xhr.status < 300) {
              let response = xhr.response;
              if (response.indexOf(keyword) === -1) {
                invaildArr.push(listArr[index])
              }
            } else {
              if (xhr.status === 429) {
                failedReqList.push(listArr[index])
              }
            }
            // return true;
          })
          // console.log(invaildArr)
          // if(isHasOrphanAcc) return;
          if (invaildArr.length) {
            num += invaildArr.length;
            banAuthorsList = banAuthorsList.filter(item => !invaildArr.includes(item))
            window.localStorage.setItem('vpv_ban_list', JSON.stringify(banAuthorsList));

            createBanList(banAuthorsList, banAuthorsTable)
          }
          clearListTip.innerHTML = `已清除${num}个无效作者 `
          if (failedReqList.length) {
            clearListTip.innerHTML += '请求过多，AO3需要冷却，冷却需要1min左右；列表清理未完成，请保持页面状态等待清理完成；如不想继续清理，请刷新页面'
            setTimeout(() => {
              sendList(failedReqList)
            }, 60000)
          } else {
            clearListTip.innerHTML = `清理完成，已清除${num}个无效作者`
          }
        })
    }

  })



  // 选中显示/隐藏评论按钮
  let showCommentBtn = document.querySelector('#show_comments_link')

  // 如果屏蔽用户功能打开
  if (setting.useBanUsers && banUsersList.length && showCommentBtn) {
    // 选择当前显示所有评论（不包括被折叠评论）
    // 注意：评论列表为异步获取，因此在加载页面时无法直接获取
    // let comments = document.querySelectorAll('#comments_placeholder li.comment')

    // 判断当前评论按钮状态（有Hide表示评论列表已经展开）
    if (showCommentBtn.innerText.indexOf('Hide') != -1) {
      clearInterval(watchCommentsListTimer);
      let usersComments = document.querySelectorAll('#comments_placeholder li.comment .heading a')
      filterUserList(banUsersList, usersComments);

      watchCommentsListTimer = setInterval(() => {
        // console.log(456)
        let newUsersComments = document.querySelectorAll('#comments_placeholder li.comment .heading a')
        if (newUsersComments[0] != usersComments[0]) {
          filterUserList(banUsersList, newUsersComments);
          usersComments = newUsersComments;
        }
      }, 200)
    }

    // 给评论按钮添加点击事件
    showCommentBtn.addEventListener('click', function () {
      clearInterval(watchCommentsListTimer);
      let usersComments = document.querySelectorAll('#comments_placeholder li.comment .heading a')
      // 点击按钮时按钮依然保持之前的状态
      // 如果点击时有Hide表示收起；没有表示展开
      if (this.innerText.indexOf('Hide') === -1) {
        watchCommentsListTimer = setInterval(() => {
          // console.log(123)
          let newUsersComments = document.querySelectorAll('#comments_placeholder li.comment .heading a')
          if (newUsersComments[0] != usersComments[0]) {
            filterUserList(banUsersList, newUsersComments);
            usersComments = newUsersComments;
          }
        }, 200)
      }
    })
  }




  /*
  屏蔽用户相关
  */

  // 生成屏蔽用户名单列表
  let banUsersTable = document.querySelector('#vpv_AO3_main_cover .ban-users-list table');
  if (banUsersList.length) {
    createBanList(banUsersList, banUsersTable)
  }
  // 点击删除，删除用户名单列表条目
  banUsersTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      let tr = e.target.parentElement.parentElement;
      let value = tr.querySelector('td').innerHTML;
      // console.log(value)
      tr.parentElement.removeChild(tr);
      banUsersList = banUsersList.filter((item) => item != value);
      window.localStorage.setItem('vpv_ban_users_list', JSON.stringify(banUsersList));
    }
  })


  // 打开屏蔽用户名单列表
  let btnUsersList = document.querySelector('#vpv_AO3_main_cover .btn-users-list');
  btnUsersList.addEventListener('click', () => {
    let listCover = document.querySelector('#vpv_AO3_main_cover .inner-cover-users');
    listCover.style.display = 'block';
  })

  // 打开添加用户弹框
  let btnOpenAddUser = document.querySelector('#vpv_AO3_main_cover .btn-open-add-user');
  btnOpenAddUser.addEventListener('click', () => {
    let addUserCon = document.querySelector('#vpv_AO3_main_cover .add-user-con');
    addUserCon.style.display = 'block';
  })

  let btnAddUser = document.querySelector('#vpv_AO3_main_cover .btn-add-user');
  // 添加用户进入屏蔽列表
  btnAddUser.addEventListener('click', () => {
    let par = btnAddUser.parentElement;
    let input = par.querySelector('.add-input');
    // console.log(input.value)
    let text = input.value.trim();
    if (text === '') {
      showTopTip(topTip, '请输入用户名');
      return;
    }
    if (banUsersList.indexOf(text) === -1) {
      banUsersList.push(text);
      window.localStorage.setItem('vpv_ban_users_list', JSON.stringify(banUsersList));

      let tr = document.createElement('tr');
      tr.innerHTML = `<td>${text}</td>
          <td><button class="btn-delete">删除</button></td>`;
      banUsersTable.querySelector('tbody').appendChild(tr);
    }
    input.value = '';
    // 关闭添加用户弹框
    par.style.display = 'none';
  })



  /*
  清空列表相关
  */

  // 清空屏蔽作者列表
  let btnClearAuthorsList = document.querySelector('.inner-cover-authors .btn-clear-authors-list');
  btnClearAuthorsList.addEventListener('click', () => {
    let list = btnClearAuthorsList.parentElement.querySelector('table tbody');
    if (list.innerHTML.trim() === '') return;
    if (!window.confirm('是否确定清空屏蔽作者列表？')) return;

    list.innerHTML = '';
    window.localStorage.removeItem('vpv_ban_list');
    showTopTip(topTip, '清空成功，刷新后生效')
  })

  // 清空屏蔽作者列表
  let btnClearUsersList = document.querySelector('.inner-cover-users .btn-clear-users-list');
  btnClearUsersList.addEventListener('click', () => {
    let list = btnClearUsersList.parentElement.querySelector('table tbody');
    if (list.innerHTML.trim() === '') return;
    if (!window.confirm('是否确定清空屏蔽用户列表？')) return;

    list.innerHTML = '';
    window.localStorage.removeItem('vpv_ban_users_list');
    showTopTip(topTip, '清空成功，刷新后生效')
  })





  /*
   导入/导出相关
  */

  // 导入/导出按钮
  let btnOpenImport = document.querySelector('#vpv_AO3_main_cover .btn-open-import');
  // 导出按钮
  let btnExport = document.querySelector('#vpv_AO3_main_cover .inner-cover-import .btn-export');
  // 导入按钮
  let btnImport = document.querySelector('#vpv_AO3_main_cover .inner-cover-import .btn-import');
  // 文字信息显示区
  let importExportMsg = document.querySelector('#vpv_AO3_main_cover .inner-cover-import .import-export-msg');
  // 导入/导出字符串显示区
  let listStringT = document.querySelector('.inner-cover-import .import-right textarea')

  // 打开导入/导出窗口
  btnOpenImport.addEventListener('click', () => {
    let importCover = document.querySelector('#vpv_AO3_main_cover .inner-cover-import');
    importCover.style.display = 'flex';
    importExportMsg.innerHTML = '';
    listStringT.value = '';
    let lists = document.querySelectorAll('.inner-cover-import .export-items input');
    lists[0].checked = false;
    lists[1].checked = false;
  })

  // 导出列表字符串
  btnExport.addEventListener('click', () => {
    let obj = {};
    let lists = document.querySelectorAll('.inner-cover-import .export-items input');

    if (!lists[0].checked && !lists[1].checked) {
      listStringT.value = '';
      importExportMsg.innerHTML = '请选择要导出的列表'
      return;
    }
    lists[0].checked && banAuthorsList.length && (obj['vpv_ban_list'] = banAuthorsList);
    lists[1].checked && banUsersList.length && (obj['vpv_ban_users_list'] = banUsersList);

    if (Object.keys(obj).length) {
      listStringT.value = encode(JSON.stringify(obj));
      importExportMsg.innerHTML = '导出成功';
    } else {
      listStringT.value = '';
      importExportMsg.innerHTML = '当前选中列表没有数据';
    }
  })

  // 导入列表字符串
  btnImport.addEventListener('click', () => {
    if (listStringT.value) {
      try {
        let obj = JSON.parse(decode(listStringT.value));
        if (!window.confirm('导入列表会覆盖原有的本地列表，是否确认导入？')) {
          return;
        }
        // console.log(obj)
        if (Object.keys(obj).includes('vpv_ban_list')) {
          window.localStorage.setItem('vpv_ban_list', JSON.stringify(obj['vpv_ban_list']));
        }
        if (Object.keys(obj).includes('vpv_ban_users_list')) {
          window.localStorage.setItem('vpv_ban_users_list', JSON.stringify(obj['vpv_ban_users_list']));
        }
        importExportMsg.innerHTML = '导入成功，刷新后生效';
      } catch (error) {
        importExportMsg.innerHTML = '字符串有误，解析失败';
      }
    } else {
      importExportMsg.innerHTML = '请填入数据'
    }
  })


  /*
   关键词屏蔽相关
  */
  // 关键字管理按钮
  let btnOpenfilterList = document.querySelector('#vpv_AO3_main_cover .btn-keywords-list');
  // 打开关键字管理窗口
  btnOpenfilterList.addEventListener('click', () => {
    let filterCover = document.querySelector('#vpv_AO3_main_cover .inner-cover-keywords');
    filterCover.style.display = 'block';
  })
  // 关键字列表文本区
  let filterKwTextarea = document.querySelector('#vpv_AO3_main_cover .filter-keywords-list textarea');
  // 生成关键字列表文本
  if (filterKwList.length) {
    filterKwTextarea.value = filterKwList.join('\n')
  }

  // 保存关键字列表按钮
  let btnSaveFilterKw = document.querySelector('#vpv_AO3_main_cover .btn-save-filter-keywords');
  btnSaveFilterKw.addEventListener('click', () => {
    let par = btnSaveFilterKw.parentElement.parentElement;

    // 文本区内容处理；如果为空则保存为空数组
    let temp = filterKwTextarea.value;
    if (temp) {
      temp = temp.split('\n');
    } else {
      temp = []
    }
    window.localStorage.setItem('vpv_filter_kw_list', JSON.stringify(temp));

    par.style.display = 'none';
    showTopTip(topTip, '保存成功，刷新后生效');
  })







  // 保存设置
  let btnSaveSetting = document.querySelector('#vpv_AO3_main_cover .btn-save');
  btnSaveSetting.addEventListener('click', () => {
    let settingItems = document.querySelectorAll('#vpv_AO3_main_cover .setting-items input');
    let settingSelect = document.querySelector('#vpv-AO3-keyword-select')
    setting.openNewPage = settingItems[0].checked;
    setting.quickKudo = settingItems[1].checked;
    setting.showBanBtn = settingItems[2].checked;
    setting.useBanOrphans = settingItems[3].checked;
    setting.useBanAuthors = settingItems[4].checked;
    setting.useBanUsers = settingItems[5].checked;
    setting.useFilterTitleSummary = settingItems[6].checked;
    setting.hiddenImgs = settingItems[7].checked;
    setting.filterKwType = settingSelect.value;
    window.localStorage.setItem('vpv_AO3_setting', JSON.stringify(setting));

    // 关闭设置窗口
    // .btn-save --- .bottom-con --- .vpv-AO3-main-con --- vpv_AO3_main_cover
    btnSaveSetting.parentElement.parentElement.parentElement.style.display = 'none';

    // 弹出提示
    showTopTip(topTip, '保存成功，刷新后生效');

  })




  // 顶部提示公共函数 ele元素容器 str内容
  function showTopTip(ele, str) {
    ele.style.display = 'block';
    ele.innerHTML = str;
    setTimeout(() => {
      ele.style.display = 'none';
    }, 2000);
  }

  // 过滤用户函数
  // banUsersList当前保存的屏蔽用户列表；usersComments当前所有评论列表
  function filterUserList(banUsersList, usersComments) {
    // console.log('--------',usersComments)
    usersComments = [].slice.call(usersComments);
    for (let i = 0; i < banUsersList.length; i++) {
      let tars = usersComments.filter((item) => item.innerHTML === banUsersList[i]);
      tars.forEach((item) => {
        // a --- h4 -- li
        let li = item.parentElement.parentElement;
        // li.style.display = 'none';
        li.parentElement.removeChild(li);
      })
    }
  }


  // 转码函数；虽然AO3的用户名不会有中文也不会有特殊字符，但还是顺便转换一下
  // 转base64
  function encode(str) {
    return window.btoa(unescape(encodeURIComponent(str)))
  }
  // base64解码
  function decode(str) {
    return decodeURIComponent(escape(window.atob(str)))
  }

  // 生成屏蔽列表函数 list列表数据 ele容器
  function createBanList(list, ele) {
    let tbody = ele.querySelector('tbody')
    tbody.innerHTML = ''
    for (let i = 0; i < list.length; i++) {
      let tr = document.createElement('tr');
      tr.innerHTML = `<td>${list[i]}</td>
            <td><button class="btn-delete">删除</button></td>`;
      // ele.querySelector('tbody').appendChild(tr);
      tbody.appendChild(tr)
    }
  }

  // 发送请求函数
  function baseSendRequest(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.timeout = 10000 // 超时时间
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // 当请求成功时返回响应；
          // 状态码不在这个范围时可能是请求过多（100左右）
          // 429时响应为Retry later；302为重定向到people search（该用户不存在）；0为404页面（orphan_account账号页面）
          // if (xhr.status >= 200 && xhr.status < 300) {
          //   resolve(xhr.response);
          // } else {
          //   reject(xhr.status)
          // }
          resolve(xhr)
        }
      }
    })
  }

  // 处理用户名字符串函数（主要用于处理有别名的作者地址）
  function handleUserNameUrl(str) {
    let tempArr = []
    let resStr = str;
    // 如果用户名字段含有(，表示为别名；格式：别名 (主账号名)；
    // 地址baseUrl+主账号名/pseuds/别名
    if (str.includes('(')) {
      tempArr = str.split(' (');
      // 主账号名；tempArr[0]别名
      tempArr[1] = tempArr[1].split(')')[0];
      resStr = `${tempArr[1]}/pseuds/${tempArr[0]}`
    }
    return resStr;
  }

  // 点击按钮切换显示/隐藏图片
  function addImgBtnEvent(imgEle, btnEle) {
    btnEle.addEventListener('click', () => {
      if (imgEle.style.display === 'none') {
        imgEle.style.display = 'inline';
        btnEle.innerHTML = '隐藏图片';
      } else {
        imgEle.style.display = 'none';
        btnEle.innerHTML = '显示图片';
      }
    })
  }


  /*
  样式
  */
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = ` #vpv_AO3_switch_btn {
      display: inline-block;
      padding: .4em .5em;
      margin: .4em 5px;
      font-size: inherit;
      border-radius: 5px;
      font-size: inherit;
    }

    #vpv_AO3_switch_btn:hover {
      background: #ddd;
      color: #900;
      cursor: pointer;
    }

    .vpv-AO3-ban-btn {
      display: inline-block;
      padding: 0 3px;
      margin: 0 1em;
      font-size: 14px;
      color: #aaa;
      border-radius: 5px;
    }

    .vpv-AO3-ban-btn:hover {
      color: #fff;
      background: #900;
      cursor: pointer;
    }

    #vpv_top_tip {
      display: none;
      position: fixed;
      top: 5px;
      left: 50%;
      z-index: 10;
      transform: translate(-50%);
      padding: 5px;
      border: 1px solid #333;
      background: #d1e1ef;
    }

    #vpv_AO3_main_cover {
      display:none;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      background: transparent;
      width: 100%;
      height: 100%;
    }

    #vpv_AO3_main_cover h3 {
      margin: 10px 0;
    }

    #vpv_AO3_main_cover .vpv-AO3-main-con {
      display: flex;
      flex-direction: column;
      position: relative;
      width: 300px;
      padding: 10px 20px;
      border: 1px solid #ccc;
      background: #fff;
      box-shadow: 0 0 5px #333;
    }

    #vpv_AO3_main_cover .setting-items {
      margin: 5px 0;
      vertical-align: middle;
    }

    #vpv_AO3_main_cover .bottom-con {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
    }

    #vpv_AO3_main_cover [class^="btn"] {
      padding: 5px 10px;
      background: #eee;
      border: 1px solid #ccc;
      outline: none;
      line-height: 16px;
      text-decoration: none;
      color: #000;
      font-size: 15px;
    }

    #vpv_AO3_main_cover [class^="btn"]:hover {
      background: #900;
      border: 1px solid #900;
      color: #fff;
      cursor: pointer;
    }

    #vpv_AO3_main_cover .btn-close {
      position: absolute;
      top: 10px;
      right: 10px;
      border: 1px solid #ccc;
      padding: 3px 8px;
      font-size: 18px;
    }

    #vpv_AO3_main_cover [class^=inner-cover] {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    #vpv_AO3_main_cover .ban-authors-list-con,
    #vpv_AO3_main_cover .ban-users-list-con {
      position: absolute;
      top: -15%;
      left: -10px;
      background: #fff;
      width: 100%;
      padding: 0 10px;
      height: 540px;
      border: 1px solid #ccc;
      box-shadow: 0 0 5px #333;
    }

    #vpv_AO3_main_cover .ban-authors-list,
    #vpv_AO3_main_cover .ban-users-list {
      height: 360px;
      border: 1px solid #ccc;
      margin: 20px 0 12px;
      line-height: 2.5;
      text-align: left;
      overflow: auto;
    }

    #vpv_AO3_main_cover table {
      border-collapse: collapse;
      width: 100%;
      overflow: hidden;
    }

    #vpv_AO3_main_cover th,
    tr,
    td {
      border: 1px solid #ccc;
      padding: 0 10px;
    }

    #vpv_AO3_main_cover tbody {
      height: auto;
    }

    #vpv_AO3_main_cover .add-author-con,
    #vpv_AO3_main_cover .add-user-con {
      display: none;
      position: absolute;
      left:10px;
      bottom: 10px;
      width: 95%;
      background: #fff;
      border: 1px solid #aaa;
      padding: 10px;
      box-shadow: 0 0 5px #333;
      box-sizing: border-box;
    }

    #vpv_AO3_main_cover p {
      margin: 5px 0;
    }

    #vpv_AO3_main_cover .add-input {
      line-height: 1.5;
      font-size: 15px;
      outline: none;
    }
    
    #vpv_AO3_main_cover .inner-cover-import{
      display: none;
      position: fixed;
      justify-content: center;
      align-items: center;
    }

    .inner-cover-import .import-export-con{
      position: absolute;
      display:flex;
      background: #fff;
      border: 1px solid #ccc;
      padding: 0 10px;
      width: 400px;
      height:360px;
      box-shadow: 0 0 5px #333;
    }
    .import-export-con>div{
      flex:1;
      margin:0 5px;
    }
    .import-export-con .export-items{
      margin: 5px 0;
      vertical-align: middle;
    }
    .import-export-con button{
      margin:15px 5px 20px;
    }
    .import-export-con textarea{
      resize:none;
    }
    .import-export-con .import-export-msg{
      font-size:14px;
    }

    .btn-clear-authors-list,
    .btn-clear-users-list{
      margin-left:.3em;
    }
    
    #vpv-AO3-keyword-select{
      width:140px;
      height:2em;
    }
    #vpv_AO3_main_cover .filter-keywords-list-con{
      position: absolute;
      top: -5%;
      left: 10%;
      background: #fff;
      width: 74%;
      padding: 0 10px;
      height: 500px;
      border: 1px solid #ccc;
      box-shadow: 0 0 5px #333;
    }
    .filter-keywords-list-con .filter-keywords-list textarea{
      width:98%;
    }
    `;
  document.querySelector('head').appendChild(style);
})();