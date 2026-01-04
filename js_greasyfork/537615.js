// ==UserScript==
// @name         Gaytor 翻译器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  翻译 Gaytor 网站常见菜单和内容为中文
// @match        https://www.gaytor.rent/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/537615/Gaytor%20%E7%BF%BB%E8%AF%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537615/Gaytor%20%E7%BF%BB%E8%AF%91%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const translateElements = [
    { selector: 'a.dropdown-toggle', keyword: 'Torrents', replacement: '种子' },
    { selector: 'a[href*="search.php"]', text: '搜索' },
    { selector: 'a[href*="browse.php"]', text: '搜索（旧版）' },
    { selector: 'a[href*="picbrowse.php"]', text: '浏览' },
    { selector: 'a[href*="upload.php"]', text: '上传' },
    { selector: 'a[href*="qtm.php"]', text: '快速管理' },
    { selector: 'a[href*="getrss"]', text: '订阅（RSS）' },
    { selector: 'a[href*="donate.php"]', text: '捐助' },
    { selector: 'a[href*="community.gaytorrent.ru"]', text: '论坛' },

    { selector: 'a[href*="rules.php"]', text: '规则' },
    { selector: 'a[href*="faq.php"]', text: '常见问题' },
    { selector: 'a[href*="helpdesk.php"]', text: '帮助中心' },
    { selector: 'a[href*="dmca.php"]', text: '版权说明' },

    { selector: 'a[href*="rationator.php"]', keyword: 'Ratio:', replacement: '分享率：' },
    { selector: 'a[href*="getbonus.php"] font',keyword: 'Bonus:',replacement: '积分：'},

    { selector: 'a[href*="my.php"]', keyword: 'Profile', replacement: '个人资料' },
    { selector: 'a[href*="affiliate.php"]', keyword: 'Affiliate', replacement: '推广链接' },
    { selector: 'a[href*="inbox.php"]', keyword: 'Messages', replacement: '消息' },
    { selector: 'a[href*="mytorrents.php"]', keyword: 'My Torrents', replacement: '我的种子' },
    { selector: 'a[href*="logout.php"]', keyword: 'Logout', replacement: '登出' },

  ];

  function translateTableDescriptions() {
    const tdList = document.querySelectorAll('td.tabledescription.hidden-xs.hidden-sm');
    tdList.forEach(td => {
      switch (td.textContent.trim()) {
        case 'Category:':
          td.textContent = '分类：';
          break;
        case 'Freeleech:':
          td.textContent = '免费下载：';
          break;
        case 'Download:':
          td.textContent = '下载：';
          break;
        case 'Pictures:':
          td.textContent = '截图：';
          break;
        case 'Description:':
          td.textContent = '简介：';
          break;
        case 'Type:':
          td.textContent = '类型：';
          break;
        case 'Size:':
          td.textContent = '大小：';
          break;
        case 'Rating:':
          td.textContent = '评分：';
          break;
        case 'Added:':
          td.textContent = '添加时间：';
          break;
        case 'Views:':
          td.textContent = '浏览次数：';
          break;
        case 'Hits:':
          td.textContent = '点击数：';
          break;
        case 'Snatched:':
          td.textContent = '完成人次：';
          break;
        case 'Totaltraffic:':
          td.textContent = '总流量：';
          break;
        case 'Upped by:':
          td.textContent = '发布者：';
          break;
        case 'Thanks By':
          td.textContent = '感谢用户：';
          break;
        case 'Seedbonus Gift':
          td.textContent = '种子积分赠送：';
          break;
        case 'Num files:':
          td.textContent = '文件数量：';
          break;
        case 'Peers:':
          td.textContent = '连接用户：';
          break;
        case 'Reseed Request :':
          td.textContent = '请求补种：';
          break;
        case 'Report:':
          td.textContent = '举报：';
          break;
      }
    });
  }

  function translateFreeleechTd() {
    const td = document.querySelector('td:has(form[action="/freeleech.php"])');
    if (!td) return;
  
    // 替换提示文案中的英文为中文，保留数字部分
    td.innerHTML = td.innerHTML
      .replace('You can make this torrent', '你可以通过花费')
      .replace('Seedbonus Points per day', '种子积分/天使，')
      .replace('points per hour', '积分/小时')
      .replace('Make Torrent Freeleech!', '设为免费下载！')
      .replace('Selected seedbonus get deducted from your current bonus balance', '所选积分将从你当前的积分余额扣除');
  
    // 也可以针对 select 选项里的文本进行替换，替换 hours 和 points
    const options = td.querySelectorAll('select[name="freeleechtime"] option');
    options.forEach(opt => {
      opt.textContent = opt.textContent
        .replace('hours', '小时')
        .replace('points', '积分')
        .replace('for', '需要');
    });
  }

  function translateDownloadTd() {
    const td = document.querySelector('td > a.index + br + form[action^="/download.php"]');
    if (!td) return;
  
    // 翻译按钮和选项
    // 找下载按钮
    const downloadForm = document.querySelector('form[action^="/download.php"]');
    if (downloadForm) {
      const downloadBtn = downloadForm.querySelector('input[type="submit"][name="Download"]');
      if (downloadBtn) downloadBtn.value = '下载';
  
      const wishlistBtn = downloadForm.querySelector('button#wishlisttoggle');
      if (wishlistBtn) wishlistBtn.innerHTML = '<i class="fa fa-star-o"></i> 收藏';
    }
  
    // 找谢谢按钮和积分选项
    const thankForm = document.querySelector('form[action="takethankyou.php"]');
    if (thankForm) {
      const thankBtn = thankForm.querySelector('input[type="submit"][name="btn"]');
      if (thankBtn) thankBtn.value = '感谢上传者！';
  
      const select = thankForm.querySelector('select[name="givepoints"]');
      if (select) {
        // 翻译 option 文本
        const optionTexts = [
          '且不给种子积分',
          '并给予上传者 1 种子积分',
          '并给予上传者 2 种子积分',
          '并给予上传者 3 种子积分',
          '并给予上传者 4 种子积分',
          '并给予上传者 5 种子积分',
          '并给予上传者 10 种子积分',
          '并给予上传者 15 种子积分',
          '并给予上传者 20 种子积分',
          '并给予上传者 25 种子积分',
          '并给予上传者 30 种子积分',
          '并给予上传者 35 种子积分',
          '并给予上传者 40 种子积分',
          '并给予上传者 45 种子积分',
          '并给予上传者 50 种子积分',
          '并给予上传者 100 种子积分',
          '并给予上传者 150 种子积分',
          '并给予上传者 200 种子积分',
          '并给予上传者 250 种子积分',
        ];
        select.querySelectorAll('option').forEach((opt, i) => {
          if (optionTexts[i]) {
            opt.textContent = optionTexts[i];
          }
        });
      }
  
      // 替换底部提示文本，保留括号内的积分数字不变
      thankForm.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('Selected seedbonus get deducted from your current bonus balance')) {
          node.nodeValue = node.nodeValue.replace(
            'Selected seedbonus get deducted from your current bonus balance',
            '所选种子积分将从你的当前积分余额中扣除'
          );
        }
      });
    }
  }


  function translateThankYouAndCommentTable() {
    const table = document.querySelector('table.table');
    if (!table) return;
  
    // 替换表头文字
    const firstTd = table.querySelector('tbody tr:first-child td:first-child b');
    if (firstTd) firstTd.textContent = '喜欢这部电影？给上传者一点尊重并';
  
    // 感谢上传者按钮和积分选项翻译
    const thankForm = table.querySelector('form[action="takethankyou.php"]');
    if (thankForm) {
      const thankBtn = thankForm.querySelector('input[type="submit"][name="btn"]');
      if (thankBtn) thankBtn.value = '感谢上传者！';
  
      const select = thankForm.querySelector('select[name="givepoints"]');
      if (select) {
        const optionTexts = [
          '且不给种子积分',
          '并给予上传者 1 种子积分',
          '并给予上传者 2 种子积分',
          '并给予上传者 3 种子积分',
          '并给予上传者 4 种子积分',
          '并给予上传者 5 种子积分',
          '并给予上传者 10 种子积分',
          '并给予上传者 15 种子积分',
          '并给予上传者 20 种子积分',
          '并给予上传者 25 种子积分',
          '并给予上传者 30 种子积分',
          '并给予上传者 35 种子积分',
          '并给予上传者 40 种子积分',
          '并给予上传者 45 种子积分',
          '并给予上传者 50 种子积分',
          '并给予上传者 100 种子积分',
          '并给予上传者 150 种子积分',
          '并给予上传者 200 种子积分',
          '并给予上传者 250 种子积分',
        ];
        select.querySelectorAll('option').forEach((opt, i) => {
          if (optionTexts[i]) opt.textContent = optionTexts[i];
        });
      }
  
      // 替换底部提示文本（文本节点）
      thankForm.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('Selected seedbonus get deducted from your current bonus balance')) {
          node.nodeValue = node.nodeValue.replace(
            'Selected seedbonus get deducted from your current bonus balance',
            '所选种子积分将从你的当前积分余额中扣除'
          );
        }
      });
    }
  
    // 替换“and/or”
    const secondLeftTd = table.querySelector('tbody tr:nth-child(2) td:first-child b');
    if (secondLeftTd) secondLeftTd.textContent = '和/或';
  
    // 替换添加评论按钮文字
    const commentForm = table.querySelector('form[action="comment.php"]');
    if (commentForm) {
      const commentBtn = commentForm.querySelector('input[type="submit"]');
      if (commentBtn) commentBtn.value = '添加评论';
    }
  }


  function translateAndEnhanceBrowseCollapse() {
    const container = document.getElementById('browse-collapse');
    if (!container) return;
  
    // 分类名称的中英文映射（示例，可补充完整）
    const categoryTranslations = {
      'AI': '人工智能',
      'Amateur': '业余',
      'Anal': '肛交',
      'Anime Games': '动漫游戏',
      'Asian': '亚洲',
      'Bareback': '无套',
      'BDSM': 'BDSM',
      'Bears': '熊族',
      'Black': '黑人',
      'Books & Magazines': '书籍与杂志',
      'Chubbies': '胖子',
      'Clips': '视频剪辑',
      'Comic & Yaoi': '漫画与耽美',
      'Daddies / Sons': '爸爸/儿子',
      'Dildos': '假阳具',
      'Fan Sites': '粉丝站点',
      'Fetish': '恋物癖',
      'Fisting': '拳交',
      'Grey / Older': '灰色/年长',
      'Group-Sex': '群交',
      'Homemade': '自制',
      'Hunks': '帅哥',
      'Images': '图片',
      'Interracial': '异族',
      'Jocks': '运动员',
      'Latino': '拉丁裔',
      'Mature': '成熟',
      'Media Programs': '媒体节目',
      'Member': '会员',
      'Middle Eastern': '中东',
      'Military': '军人',
      'Oral-Sex': '口交',
      'Softcore': '软核',
      'Solo': '单人',
      'Themed Movie': '主题电影',
      'Trans': '变性',
      'Trans/FTM': '变性/女变男',
      'TV / Episodes': '电视剧/集数',
      'Twinks': '少年美男',
      'Vintage': '复古',
      'Voyeur': '偷窥',
      'Wrestling and Sports': '摔跤与体育',
      'Youngblood': '年轻人',
    };
  
    // 遍历所有分类a标签，替换文本为中文
    const links = container.querySelectorAll('.searchcat a.browselink');
    links.forEach(a => {
      const engText = a.textContent.trim();
      if (categoryTranslations[engText]) {
        a.textContent = categoryTranslations[engText];
      }
    });
  
    // 替换“Clear All”和“Set All”按钮的文字
    const btnClear = container.querySelector('#clrall');
    if (btnClear) btnClear.value = '清除所有';
  
    const btnSet = container.querySelector('#setall');
    if (btnSet) btnSet.value = '全选所有';
  
    // 为“Clear All”按钮添加点击事件，取消所有分类复选框选中
    btnClear?.addEventListener('click', () => {
      container.querySelectorAll('input.browsecatcheckbox').forEach(cb => cb.checked = false);
    });
  
    // 为“Set All”按钮添加点击事件，选中所有分类复选框
    btnSet?.addEventListener('click', () => {
      container.querySelectorAll('input.browsecatcheckbox').forEach(cb => cb.checked = true);
    });
  
    // 替换搜索输入框的 placeholder 文本
    const searchInput = container.querySelector('input[name="search"]');
    if (searchInput) searchInput.placeholder = '输入搜索关键词';
  
    // 替换“Search”按钮文本
    const searchBtn = container.querySelector('button[type="submit"]');
    if (searchBtn) searchBtn.textContent = '搜索 / 刷新';
  
    // 替换“Where to Search:”标签文字
    const whereLabel = [...container.querySelectorAll('label')].find(l => l.textContent.includes('Where to Search'));
    if (whereLabel) whereLabel.textContent = '搜索范围：';
  
    // 替换搜索范围复选框标签文字（示例）
    const scopeLabelsMap = {
      'Torrent Name': '种子名称',
      'Torrent Description': '种子描述',
      'Torrent Filename': '种子文件名',
      'Freeleech only': '仅免费',
      'On wishlist only': '仅愿望单',
    };
    container.querySelectorAll('div.searchfunctions label input[type="checkbox"]').forEach(input => {
      const label = input.parentElement;
      if (!label) return;
      const engText = label.textContent.trim().replace(input.value, '').trim();
      for (const [eng, ch] of Object.entries(scopeLabelsMap)) {
        if (label.textContent.includes(eng)) {
          label.childNodes[1].nodeValue = ch;
        }
      }
    });
  
    // 替换“Sort by”相关文字
    const sortLabels = container.querySelectorAll('.form-inline.searchline label');
    if (sortLabels.length >= 3) {
      sortLabels[0].textContent = '排序方式';
      sortLabels[1].textContent = '按';
      sortLabels[2].textContent = '顺序';
    }
  
    // 替换排序选项
    const orderbySelect = container.querySelector('select[name="orderby"]');
    if (orderbySelect) {
      const orderbyMap = {
        'name': '种子名称',
        'type': '类别',
        'files': '文件数量',
        'comments': '评论数量',
        'added': '上传日期',
        'size': '大小',
        'snatched': '下载次数',
        'seeds': '做种数',
        'leeches': '下载数',
        'uppedby': '上传者',
        'bonus': '积分',
        'freeleech': '免费做种剩余时间',
        'freeleechstart': '免费做种开始时间',
      };
      orderbySelect.querySelectorAll('option').forEach(opt => {
        if (orderbyMap[opt.value]) opt.textContent = orderbyMap[opt.value];
      });
    }
  
    // 替换排序顺序选项
    const sortSelect = container.querySelector('select[name="sort"]');
    if (sortSelect) {
      const sortMap = {
        'desc': '降序',
        'asc': '升序',
      };
      sortSelect.querySelectorAll('option').forEach(opt => {
        if (sortMap[opt.value]) opt.textContent = sortMap[opt.value];
      });
    }
  
    // 替换底部的Profile链接提示文字
    const profileHint = [...container.querySelectorAll('div.searchfunctions')].find(div => div.textContent.includes('Profile'));
    if (profileHint) {
      profileHint.innerHTML = '默认值可在你的 <a href="my.php">个人资料</a> 中更改';
    }
  }

  function translatePanelHeadingLinks() {
    const panelHeading = document.querySelector('.panel-heading h3.panel-title');
    if (!panelHeading) return;
  
    // 获取所有链接元素
    const links = panelHeading.querySelectorAll('a');
  
    if (links.length >= 5) {
      links[0].innerHTML = '<b>显示全部</b>';
      links[1].innerHTML = '<b>显示愿望清单种子</b>';
      links[2].innerHTML = '<b>显示尚未评分的种子</b>';
      links[3].innerHTML = '<b><font size="+1" color="yellow">显示免费种子</font></b>';
      links[4].textContent = 'RSS 订阅';
    }
  }
  
  function applyTranslations() {
    translateElements.forEach(item => {
      const el = document.querySelector(item.selector);
      if (!el) return;

      if (item.keyword && item.replacement) {
        // 只替换文本节点，不影响子结构
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(item.keyword)) {
            node.nodeValue = node.nodeValue.replace(item.keyword, item.replacement);
          }
        });
      } else if (item.text) {
        el.textContent = item.text;
      }
    });

     // 判断当前是否是/details.php页面，符合才执行
    if (window.location.pathname.includes('/details.php')) {
      translateTableDescriptions();
      translateFreeleechTd();
      translateDownloadTd();
      translateThankYouAndCommentTable();
    }

    if (window.location.pathname.includes('/search.php')) {
      translateAndEnhanceBrowseCollapse();
    }

      // 只在种子浏览页执行该翻译函数
    if (window.location.pathname === '/browse.php' || window.location.pathname === '/search.php') {
      translatePanelHeadingLinks();
    }
  }

  applyTranslations();
  
})();
