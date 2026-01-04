// ==UserScript==
// @name         豆瓣小组清新空气计划
// @version      0.0.2
// @license      MIT
// @namespace    https://greasyfork.org/users/1384897
// @description  抓取用户豆瓣黑名单，在后台存储并自动屏蔽黑名单用户的帖子
// @author       ✌
// @match        https://www.douban.com/group/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/513787/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E6%B8%85%E6%96%B0%E7%A9%BA%E6%B0%94%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/513787/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E6%B8%85%E6%96%B0%E7%A9%BA%E6%B0%94%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==
(function() {
  const utils = {
    // 通过 Tampermonkey 后台保存配置
    saveConfig: config => {
      GM_setValue('douban_group_enhance_config', config);
      console.log('保存黑名单到后台: ', config);
    },
    // 从 Tampermonkey 后台获取配置
    getConfig: () => {
      const config = GM_getValue('douban_group_enhance_config', { blackUserList: [] });
      console.log('从后台加载黑名单: ', config);
      return config;
    }
  }

  // 手动抓取豆瓣黑名单
  const fetchBlacklist = async () => {
    let start = 0;
    let userIdList = [];
    let hasNextPage = true;

    console.log('开始抓取豆瓣黑名单...');

    while (hasNextPage) {
      const url = `https://www.douban.com/contacts/blacklist?start=${start}`;
      console.log('请求黑名单页面: ', url);

      const response = await fetch(url, {
        credentials: 'include' // 保持登录状态
      });

      if (response.ok) {
        console.log('黑名单页面响应成功，解析中...');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // 从页面中提取用户ID
        const userLinks = doc.querySelectorAll('dl.obu dd a');

        if (userLinks.length === 0) {
          console.log('没有找到更多用户，终止抓取。');
          break; // 没有更多用户数据，终止抓取
        }

        userLinks.forEach(link => {
          const userProfileUrl = link.getAttribute('href');
          const userId = userProfileUrl.split('/').filter(v => v).pop(); // 提取user_id
          userIdList.push(userId);
          console.log('抓取到用户ID: ', userId);
        });

        // 检查是否还有下一页
        hasNextPage = !!doc.querySelector('.next');
        start += 72; // 下一页的起始值增加
        console.log('是否有下一页: ', hasNextPage);
      } else {
        console.error('请求黑名单页面失败: ', response.status);
        hasNextPage = false; // 请求失败则终止抓取
      }
    }

    console.log('黑名单抓取完成: ', userIdList);
    return userIdList;
  }

  // 更新黑名单配置
  const updateBlacklistConfig = async () => {
    console.log('手动更新黑名单配置...');
    const blackUserIds = await fetchBlacklist();
    const config = { blackUserList: blackUserIds };

    utils.saveConfig(config); // 保存配置到 Tampermonkey 后台
    console.log("黑名单用户ID已更新: ", blackUserIds);
  }

  // 屏蔽用户功能
  const runFiltUser = (config) => {
    console.log('开始运行屏蔽用户功能...');
    $('.olt tr td:nth-child(2) a').each(function() {
      const $this = $(this);
      const userProfileUrl = $this.attr('href'); // 获取用户个人主页链接
      const userId = userProfileUrl.split('/').filter(v => v).pop(); // 提取用户ID
      const isBlackUser = id => (config.blackUserList || []).includes(id); // 使用ID判断是否在黑名单
      if (isBlackUser(userId)) {
        console.log("屏蔽首页发帖:", userId);
        $this.parents('tr').hide(); // 隐藏发帖行
      }
    });
  }

  // 帖子内屏蔽黑名单用户
  const runFilterBlackUser = (config, self) => {
    const userProfileUrl = self.find('h4 a').attr('href'); // 获取发帖用户的个人主页链接
    const userId = userProfileUrl.split('/').filter(v => v).pop(); // 提取user_id
    const isBlackUser = id => (config.blackUserList || []).includes(id);
    if (isBlackUser(userId)) {
      console.log("屏蔽回帖人: ", userId);
      self.hide(); // 隐藏发帖
      return;
    }

    const isFiltBeReplyedUser = config.filtBeReplyedBlackUser;
    if (isFiltBeReplyedUser) {
      const replyQuote = self.find('.reply-quote');
      if (replyQuote != null) {
        const replyProfileUrl = replyQuote.find('.reply-quote-content .pubdate a').attr('href');
        const replyUserId = replyProfileUrl.split('/').filter(v => v).pop(); // 回复的用户ID
        if (isBlackUser(replyUserId)) {
          console.log("屏蔽回复: ", replyUserId);
          self.hide(); // 隐藏回复
          return;
        }
      }
    }
  }

const addButtonToPage = () => {
    const buttonHtml = `
      <button id="updateBlacklistButton" style="position:fixed; bottom:20px; left:20px; padding:12px 20px; background-color:#409EFF; color:#fff; border:none; border-radius:5px; box-shadow:0 4px 8px rgba(0,0,0,0.1); font-size:14px; cursor:pointer; transition:background-color 0.3s ease;">
        更新黑名单
      </button>
      <div id="balloon" style="display:none; position:fixed; bottom:90px; left:20px; transform:translateX(10px); font-size:30px; letter-spacing:-5px; text-align:center;">
        🎈🎈🎈
      </div>
    `;
    $('body').append(buttonHtml);

    $('#updateBlacklistButton').hover(
      function() {
        $('#balloon').css('display', 'block').css('opacity', '1');
      },
      function() {
        $('#balloon').css('opacity', '0');
        setTimeout(() => {
          $('#balloon').css('display', 'none');
        }, 300);
      }
    );

    // 点击按钮时更新黑名单
    $('#updateBlacklistButton').click(async () => {
      $('#updateBlacklistButton').text('更新中...');
      await updateBlacklistConfig();
      $('#updateBlacklistButton').text('更新黑名单');
    });
  }

  // 脚本初始化
  const init = () => {
    console.log('初始化增强脚本...');
    const config = utils.getConfig(); // 从后台获取黑名单配置
    runFiltUser(config); // 屏蔽首页用户
    $('#comments li').each(function() {
      const $this = $(this);
      runFilterBlackUser(config, $this); // 屏蔽帖子内用户
    });
  }

  addButtonToPage();

  init();
})();