// ==UserScript==
// @name        i Novel Reader
// @namespace   https://greasyfork.org/users/756764
// @version     2025.7.4
// @author      ivysrono
// @license     MIT
// @description 大字号，去干扰词，等。
// @match       *://*/*
// @match       *://*/*
// @run-at      document-start
// @grant       GM.addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424775/i%20Novel%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/424775/i%20Novel%20Reader.meta.js
// ==/UserScript==

// 网站对应正文元素
const sites = {
  // https://m.147xs.org/book/88398/1325971532.html
  'm.147xs.org': '#nr',
  // https://m.ddyveshu.cc/wapbook/10326_5342340.html
  'm.ddyveshu.cc': '#chaptercontent',
  // https://www.piaotia.com/html/15/15272/11305581.html
  'www.piaotia.com': '#content',
  // https://www.piaotianwenxue.com/book/50/50934/1.html
  'www.piaotianwenxue.com': '#htmlContent',
  // http://www.b5200.net/98_98050/168128414.html
  'www.b5200.net': '#content',
  // http://m.biquge5200.cc/wapbook-101696-167922457/
  'm.biquge5200.cc': '#content',

  // 以下站点屏蔽广告的最佳方法是通过noscript等屏蔽所有脚本

  // https://m.22biqu.com/biqu78793/39212500.html
  'm.22biqu.com': '#chaptercontent',
  // https://m.22biqu.net/biqu78793/39212500.html
  'm.22biqu.net': '#chaptercontent',
  // https://www.biquge543.com/chapter/089512/403688501.html
  'www.biquge543.com': '#txt',
  // https://m.biquge543.com/chapter/089512/403688501.html
  'm.biquge543.com': '#txt',
  // https://www.libahao.com/book/12495494_5314/1120.html
  'www.libahao.com': '#chapterContent',
  // https://m.libahao.com/book/12495494_5314/1120.html
  'm.libahao.com': '#chapterContent',
  // https://www.sudugu.com/1939/2659809.html
  'www.sudugu.com': '.con',

  // http://www.qiuyexs.cc/biquge_157166/74703657.html
  'www.qiuyexs.cc': ['#content', '#booktxt'],
};

// 全段干扰词
const jamP = [
  '天才一秒记住本站地址：[',
  '【咪咪阅读app 】',
  '】真心不错，值得',
  '追书神器',
  '我最近在用的小说app，【',
  '缓存看书，离线朗读！',
  '书友们之前用的小书亭',
  '推荐下，我最近在用的追书app',
  '书源多，书籍全，更新快！',
];

// 干扰词
const jams = [
  // http://m.biquge5200.cc/wapbook-98050-170106257/
  '先定个小目标，比如1秒记住：书客居',
  'www.44pq.com，',
  'www.44pq.com。',
  '<a href="http://www.44pq.com" title="Linkify Plus Plus" class="linkifyplus" rel="noopener">www.44pq.com</a>，',
  '<a href="http://www.44pq.com" title="Linkify Plus Plus" class="linkifyplus" rel="noopener">www.44pq.com</a>。',
  '狂沙文学网 www.kuangsha.net',
  '【】手机阅读网址 喜欢就分享一下',
  'www.pkgg.net',
  '【提示】：如果觉得此文不错，请推荐给更多小伙伴吧！分享也是一种享受。',
  '『可乐言情首发』',
  '水印广告测试 ',
  '水印广告测试',
  '<p>一秒记住！！！【狂沙文学网】手机用户输入：<a href="http://m.kuangsha.net" title="Linkify Plus Plus" class="linkifyplus" rel="noopener">m.kuangsha.net</a></p>',
  '支持（狂沙文学网）把本站分享那些需要的小伙伴！找不到书请留言！',
  '『言情首发',
  // https://www.piaotianwenxue.com/book/50/50934/316.html
  '【认识十年的老书友给我推荐的追书app，咪咪阅读！真特么好用，开车、睡前都靠这个朗读听书打发时间，这里可以下载  】',
  '想要看最新章节内容，请下载星星阅读app，无广告免费阅读最新章节内容。网站已经不更新最新章节内容，已经星星阅读小说APP更新最新章节内容。',
  '网页版章节内容慢，请下载爱阅小说app阅读最新内容',
  '网站即将关闭，下载爱阅app免费看最新内容',
  '请退出转码页面，请下载爱阅小说app 阅读最新章节。',
];

// 敏感词
const taboos = {
  // A
  '(爱ài)': '爱',
  '(ài)': '爱',
  // B
  仈Jiǔ: '八九',
  仈jiu: '八九',
  '白-兔': '白兔',
  bàozhà: '爆炸',
  '((逼bī)bī)': '逼',
  '装-赑': '装逼',
  // C
  '采-花': '采花',
  '((操cāo)cāo)': '操',
  'cāo)': '操',
  '禅-法': '禅法',
  '欢喜-禅': '欢喜禅',
  ChéngRén: '成人',
  ChóngQìng: '重庆',
  '成-熟': '成熟',
  '成-长-发-育': '成长发育',
  '吃-奶': '吃奶',
  '吃-屎': '吃屎',
  '(床chuáng)': '床',
  '(chuáng)': '床',
  '(春chūn)': '春',
  '春-水': '春水',
  // D
  '大-法': '大法',
  '((荡dàng)dàng)': '荡',
  '(荡dàng)': '荡',
  '(dàng)': '荡',
  '(殿diàn)': '殿',
  '(diàn)': '殿',
  '颠鸾-倒凤': '颠鸾倒凤',
  '动-乱': '动乱',
  '独-立': '独立',
  '赌-徒': '赌徒',
  '赌-场': '赌场',
  // F
  '放-荡': '放荡',
  // G
  '光-鸡': '光鸡',
  '狗-屁': '狗屁',
  // H
  '合|欢': '合欢',
  '怀-胎': '怀胎',
  '混-淡': '混蛋',
  '混-混': '混混',
  // J
  '(娇jiāo)': '娇',
  '交-合': '交合',
  jiāo: '交',
  '((贱jiàn)jiàn)': '贱',
  '(贱jiàn)': '贱',
  '抓-奸': '抓奸',
  '(禁jìn)': '禁',
  '(jìn)': '禁',
  '菊-花': '菊花',
  // K
  '快-感': '快感',
  // L
  '拉-屎-撒-尿': '拉屎撒尿',
  '拉-屎': '拉屎',
  '乱-搞': '乱搞',
  '(luǒ)': '裸',
  luǒ: '裸',
  '**裸': '赤裸裸',
  '赤-果果': '赤裸裸',
  // M
  '马-鞭': '马鞭',
  '迷-药': '迷药',
  // N
  '(奶nǎi)': '奶',
  '(nǎi)': '奶',
  // P
  '胚-胎': '胚胎',
  '(屁pì)': '屁',
  '(pì)': '屁',
  '屁-谷': '屁股',
  '屁-股': '屁股',
  // Q
  '骑-': '骑',
  '(情qíng)': '情',
  '(qíng)': '情',
  '情-欲': '情欲',
  // R
  '(热rè)': '热',
  '(rè)': '热',
  '(日rì)': '日',
  '(rì)': '日',
  // ri: '日', // 误伤 <script> 标签
  '日-逑': '日逑',
  '入-特-娘': '入特娘',
  róuruǎn: '柔软',
  '(肉ròu)': '肉',
  '(ròu)': '肉',
  '肉-体': '肉体',
  '(乳rǔ)': '乳',
  // S
  '(骚sāo)': '骚',
  '骚-婆-娘': '骚婆娘',
  // se: '色',
  '傻-': '傻',
  '上（蟹蟹）位': '上位',
  '(射shè)': '射',
  '(shè)': '射',
  '(身shēn)': '身',
  '(shēn)': '身',
  shīlùlù: '湿漉漉',
  '圣-母': '圣母',
  '风-骚': '风骚',
  '骚-热': '骚热',
  '双-修': '双修',
  // T
  '(套tào)': '套',
  '特-娘': '特娘',
  '(挺tǐng)': '挺',
  '(tǐng)': '挺',
  '(臀tún)': '臀',
  '脱-裤': '脱裤',
  // W
  '完-蛋': '完蛋',
  '玩-弄': '玩弄',
  '王-八-蛋': '王八蛋',
  // X
  '小-母-鸡': '小母鸡',
  '(性xìng)': '性',
  '(xìng)': '性',
  xìng: '性',
  '性-感': '性感',
  '性-淫': '性淫',
  '(胸xiōng)': '胸',
  '(xiōng)': '胸',
  xiōng: '胸',
  '(穴xué)': '穴',
  '(xué)': '穴',
  // Y
  '窑-子': '窑子',
  '幺-鸡': '幺鸡',
  '(阴yīn)': '阴',
  '(yīn)': '阴',
  yīn: '阴',
  '(淫yín)': '淫',
  '淫-日': '淫日',
  '淫-邪': '淫邪',
  '婴-儿': '婴儿',
  'yòu nǚ': '幼女',
  '(诱yòu)': '诱',
  '(欲yù)': '欲',
  '(yù)': '欲',
  yù: '欲',
  '欲-望': '欲望',
  '元-精': '元精',
  '(允yǔn)': '允',
  '(yǔn)': '允',
  '孕-育': '孕育',
  '孕-妇': '孕妇',
  // Z
  '杂-合': '杂合',
  '杂-交': '杂交',
  '中-正': '中正',
  '种-族': '种-族',
  '主-义': '主义',
};

/**
 * 若设置首行缩进，可去除首行空格
 * http://m.b5200.net/wapbook-98050-168128414
 */
const spaces = {
  '&nbsp;;': '',
  '<a&nbsp;href="http: "&nbsp;target="_blank">': '',

  '<br></div>': '</div>',

  '&nbsp;&nbsp;': '',
  '>;': '>',
  '<br>&nbsp;': '<br>',
  '<br><br>': '<br>',
  '<br>\n<br>': '<br>',
  '<p><br></p>': '<br>',
  '<p>\n<br>': '<br>',

  '<p>﻿': '<p>',
  '<p> ': '<p>',
  '<p>	': '<p>',
  '<p>　': '<p>',
  '<p>&nbsp;': '<p>',
  '&nbsp;<p>': '<p>',
};

/**
 * 讨厌的第一段开头插入标题
 * http://www.b5200.net/98_98050/168128414.html
 * http://www.b5200.net/109_109687/168249426.html
 * http://m.b5200.net/wapbook-98050-168128414/
 * http://m.b5200.net/wapbook-109687-168249426/
 * 标题中有多个空格且在正文中存在
 * http://www.b5200.net/98_98050/170177681.html
 * http://m.b5200.net/wapbook-98050-170177681/
 * 首段不含标题而在文中包含
 * http://m.b5200.net/wapbook-98050-169977555/
 * http://m.b5200.net/wapbook-98050-169990547/
 * 标题中有括号等其他字符
 * http://www.b5200.net/131_131174/170974028.html
 * http://www.b5200.net/131_131174/170982802.html
 */
const addLineBreak = (titleSelector, contentSelector) => {
  // 兼容翻页脚本
  const titles = document.querySelectorAll(titleSelector);
  const contents = document.querySelectorAll(contentSelector);
  if (titles.length === 0 || contents.length === 0) return;
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    const content = contents[i];
    if (!title || !content) continue;
    let titleText = title.textContent;
    if (titleText.includes('（')) {
      const titleArray = titleText.split('（');
      titleText = titleArray[titleArray.length - 2];
    }
    // 获取标题获取空格区隔的前后字符，可能不是标准的空格
    const titleFirstText = titleText.split(/\s+/).shift();
    //console.log(titleFirstText);
    const titleLastText = titleText.split(/\s+/).pop();
    //console.log(titleLastText);
    const firstText = content.querySelector('p').textContent;
    // 避免多次执行
    if (firstText.includes(titleLastText) && !firstText.endsWith(titleLastText)) {
      // 插入空行。加上最后一个<p>使网页自动补齐后续文字的</p>
      content.innerHTML = content.innerHTML.replace(titleLastText, `${titleLastText}<p>`);
      console.log(`已处理正文包含的标题：${titleLastText}`);
    } else if (firstText.includes(titleFirstText) && !firstText.endsWith(titleFirstText)) {
      // 插入空行。加上最后一个<p>使网页自动补齐后续文字的</p>
      content.innerHTML = content.innerHTML.replace(titleFirstText, `<p>${titleFirstText}<p>`);
      console.log(`已处理正文包含的标题：${titleFirstText}`);
    }
  }
};

// 设置全局变量供调用
let count = 0;
const reader = (textBody) => {
  /**
   * 统一设置阅读字号，及两端对齐。
   * 标准网页将文字封装在 p 标签中，如：原址已挂
   *
   * 非标网页将文字全部塞在一起，如：原址已挂
   *
   * 强制两端对齐避免部分网页在替换后变成居中。
   * 首行缩进必须配合清除已有空格，以免在部分已经强制使用两个中文空格的页面缩进过多。
   */
  GM.addStyle(`
  ${textBody}, ${textBody} p {
    font-size: x-large !important;
    text-align: justify !important;
  }
  ${textBody} p {
    text-indent: 2em !important;
  }
  
  /* 多个站点APP推广 */
  div[onclick^="window.location.href='http"] {
    display: none !important;
  }
  `);
  // 兼容翻页脚本
  const texts = document.querySelectorAll(textBody);
  // 每次调用函数都重新计数
  count = 0;
  for (const text of texts) {
    for (const i of jamP) {
      // 使用 textContent 或 innerText 会导致 p 标签丢失，样式丢失
      if (!text.innerHTML.includes(i)) continue;
      for (const p of text.querySelectorAll('p')) {
        if (!p.innerHTML.includes(i)) continue;
        p.remove();
        console.log(`Removed: ${p.textContent}`);
      }
    }
    for (const i of jams) {
      // 使用 textContent 或 innerText 会导致 p 标签丢失，样式丢失
      if (!text.innerHTML.includes(i)) continue;
      text.innerHTML = text.innerHTML.trim().replaceAll(i, '');
      count++;
    }
    for (const i in spaces) {
      if (!text.innerHTML.includes(i)) continue;
      text.innerHTML = text.innerHTML.trim().replaceAll(i, spaces[i]);
      count++;
    }
    for (const i in taboos) {
      if (!text.innerHTML.includes(i)) continue;
      text.innerHTML = text.innerHTML.trim().replaceAll(i, taboos[i]);
      count++;
    }
  }
  console.log(`已执行${count}次替换`);
};

// 主线调用
if (sites.hasOwnProperty(location.host)) {
  const textBodys = sites[location.host];

  const splitAgain = () => {
    // 非如此不足以令移动版生效
    const splitText = setInterval(() => {
      let textBody;
      console.log(`textBodys: ${textBodys}`);
      if (textBodys instanceof Array) {
        for (let i of textBodys) {
          textBody = i;
          console.log(`textBody: ${textBody}`);
          reader(textBody);
        }
      } else {
        textBody = textBodys;
        console.log(`textBody: ${textBody}`);
        reader(textBody);
      }

      // addLineBreak 已经兼容翻页脚本，放在 reader 函数中降低性能
      if (location.host === 'www.b5200.net' || location.host === 'm.b5200.net') {
        // 去除报错
        let errorTags = document.getElementsByTagName('sc日pt');
        for (let e of errorTags) {
          e.remove();
        }
        if (location.host === 'www.b5200.net') {
          addLineBreak('.bookname > h1', textBody);
        } else if (location.host === 'm.b5200.net') {
          // '#content > div.text' 避免影响标题本身，桌面版无此问题
          addLineBreak('.title', `${textBody} > div.text`);
        }
      }

      // 兼顾性能
      if (count !== 0) return;
      clearInterval(splitText);
    }, 1000);
  };
  splitAgain();

  // 兼容翻页
  const observer = new MutationObserver(() => {
    splitAgain();
  });
  observer.observe(document, {
    attributes: true,
    subtree: true,
  });
}

/**
 * 目录页顶部底部广告留白 http://www.b5200.net/98_98050/
 * 内容页 http://www.b5200.net/113_113914/179149828.html
 * 内容页底部广告留白
 * 内容页顶部广告留白
 * 内容页文中广告留白
 */
if (location.host === 'www.b5200.net') {
  GM.addStyle(`
  #cstad,
  #cbad,
  #ctad,
  div[style="margin: 0px auto;"] {
    display: none !important;
  }
  `);
}

// 嵌入广告 http://m.b5200.net/wapbook-98050-170188672/
if (location.host === 'm.b5200.net') {
  GM.addStyle(`div[class^=gcontent] {display: none !important;}`);
}

if (location.host === 'm.qidian.com') {
  GM.addStyle(`
  /* 继续使用浏览器 */
  #teleported,
  /* 新人领取奖励广告 */
  .fixed.inset-0,
  /* 底部广告 */
  .js-download-link {
    display: none !important;
  }
  `);
}
