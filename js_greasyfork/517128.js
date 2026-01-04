// ==UserScript==
// @name        Ubits_Upload_Web
// @namespace   Violentmonkey Scripts
// @match       https://ubits.club/details.php*
// @match       https://ubits.club/upload.php*
// @description ubits web发种辅助
// @grant       none
// @version     1.2.2
// @author      Jeremy
// @icon        https://ubits.club/pic/logo_V2.png
// @description 2025/03/08 17:20:00
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/517128/Ubits_Upload_Web.user.js
// @updateURL https://update.greasyfork.org/scripts/517128/Ubits_Upload_Web.meta.js
// ==/UserScript==
(async function () {
  'use strict';
  let url = window.location.href;
  // 获取url后面的参数
  const params = new URLSearchParams(window.location.search);
  const source = decodeURIComponent(params.get('source'));
  const title = decodeURIComponent(params.get('title'));
  const type = decodeURIComponent(params.get('type'));
  const doubanLink = decodeURIComponent(params.get('doubanLink'));
  const imdbLink = decodeURIComponent(params.get('imdbLink'));
  const tags = decodeURIComponent(params.get('tags'))?.split(',');
  // 发种页面增加解析豆瓣按钮
  if (url.includes('upload') && url.includes('ubits.club')) {
    const targetElement = document.querySelector('input[name="small_descr"]');
    const parentElement = document.createElement('div');

    parentElement.style.display = 'flex';
    parentElement.style.justifyContent = 'space-between'; // 可根据需求设置
    parentElement.style.alignItems = 'center'; // 可根据需求设置

    targetElement.parentNode.insertBefore(parentElement, targetElement);
    parentElement.appendChild(targetElement);
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('input');
    button.type = 'button';
    button.className = 'nexus-action-btn';
    button.value = '解析豆瓣';
    button.onclick = function (e) {
      console.log('解析豆瓣', e);
      e.stopPropagation();
      handleAnalysisDouban();
    };
    buttonWrapper.appendChild(button);
    targetElement.insertAdjacentElement('afterend', button);
  }

  // 详情页面增加引用按钮
  if (url.includes('details') && url.includes('ubits.club')) {
    const linkUrl = getLinkUrl();

    const reportButton = document.querySelector(
      'a[title="举报该种子违反了规则"]',
    );
    const quoteButton = document.createElement('a');
    quoteButton.setAttribute('title', '引用该种子用来发种');
    quoteButton.setAttribute('href', linkUrl); // 修改为实际的引用链接
    quoteButton.setAttribute('target', '_blank');
    quoteButton.setAttribute('rel', 'noopener noreferrer');
    quoteButton.innerHTML = `
                <img src="https://img.ubits.club/images/2024/11/13/58b84579e829599b5ba648a21a3df06c.png" alt="quote">&nbsp;
                <b><font class="small">引用</font></b>
            `;

    // 将引用按钮插入到举报按钮之后
    reportButton.parentNode.insertBefore(quoteButton, reportButton.nextSibling);
  }

  // 通过点击引用按钮跳转到当前页面
  if (source === 'quote') {
    // 设置标题的值
    document.querySelector('input[name="name"]').value = `${title.replace(
      /(\[.*?\])\s+/,
      '$1',
    )}`;
    // 设置豆瓣链接地址
    document.querySelector("input[name='pt_gen']").value = doubanLink;
    // 设置imdb链接地址
    document.querySelector("input[name='url']").value = imdbLink;
    parseForms({ title, type, doubanLink, imdbLink, tags });
  }
})();

/**
 * 解析url链接，填充表单页面
 * @param {object} param0
 */
async function parseForms({ title, type, doubanLink, imdbLink, tags }) {
  console.log(tags);
  const data = await fetchNetworkInfo(doubanLink);

  fillFormType(type);

  changeTorrentsIdentification(title);

  generateSubtitle(title, data);

  // 处理简介的值
  transformDesc(data.format);

  // 处理tags
  normalTags(tags);
}

/**
 * 获取跳转到发布页需要携带的参数
 * @returns
 */
function getLinkUrl() {
  // 获取标题内容
  const titleElement = document.querySelector('h1#top');
  const title = titleElement.childNodes[0].nodeValue.replace(
    /(&nbsp;|\s)+$/g,
    '',
  );

  // 获取标签内容
  const tags = getTdValue('标签')?.join(',');
  // 获取type
  const type = document.body.innerHTML
    .match(/<b>类型:<\/b>\s*([^<]+)(&nbsp;|$)/)[1]
    .replace(/&nbsp;/g, '');
  // 获取简介内的所有文本
  const text = document.getElementById('kdescr').innerText;
  // 获取douban链接
  const doubanLink =
    text.match(/https:\/\/movie\.douban\.com\/subject\/\d+/)?.[0] || '';
  // 获取imdb链接
  const imdbLink =
    text.match(/https:\/\/www\.imdb\.com\/title\/tt\d+/)?.[0] || '';
  return `/upload.php?source=quote&title=${encodeURIComponent(
    title.replace('.torrent', ''),
  )}&tags=${tags}&type=${encodeURIComponent(
    type,
  )}&doubanLink=${encodeURIComponent(doubanLink)}&imdbLink=${encodeURIComponent(
    imdbLink,
  )}`;
}

/**
 * 解析网络数据
 * 清洗后回填到页面上
 * @returns
 */
async function handleAnalysisDouban() {
  var genUrl = document.querySelector("input[name='pt_gen']").value;
  console.log(genUrl);
  if (!genUrl)
    return showToast('请先填入imdb/douban/bangumi/indienova链接地址');

  // 修改标题的值
  const title = document.querySelector('input[name="name"]').value;
  document.querySelector('input[name="name"]').value = `${title.replace(
    /\[.*?\]\s*/,
    '',
  )}`;

  // 修改简介的值
  const desc = document.querySelector('textarea[name="descr"]').value;
  if (!desc) return showToast('请先填入获取PT-Gen简介信息');
  if (!desc.includes('禁转PTT')) {
    document.querySelector('textarea[name="descr"]').value =
      `[quote][b][color=Red][size=6]禁转PTT[/size][/color][/b][/quote]\n${document
        .querySelector('textarea[name="descr"]')
        .value?.replace(
          /https:\/\/img\d+(\.doubanio\.com\/view\/photo\/[^\s]+)/,
          'https://img9$1',
        )}`;
  }

  // 修改种子类型下的一系列数据
  changeTorrentsIdentification(title);

  const data = await fetchNetworkInfo(genUrl);
  console.log(data);
  generateSubtitle(title, data);

  // 类型判断
  let type = '402';
  const { genre } = data;
  if (genre.includes('动画')) type = '405';
  if (genre.includes('真人秀') || genre.includes('脱口秀')) type = '403';
  if (!data?.episodes) type = '401';
  const selectElement = document.querySelector('select[name="type"]');
  selectElement.value = type;
}

/**
 * 拼接subtitle信息
 * @param {string} title
 * @param {object} data
 */
function generateSubtitle(title, data) {
  const trans_title =
    data?.trans_title && data?.trans_title?.filter((item) => !!item).length > 0
      ? data?.trans_title
      : data?.this_title;
  let newTitle = '';
  if (trans_title && trans_title.length > 1) {
    newTitle = trans_title
      ?.filter((item) => !title.replace(/\[.*?\]\s*/, '').includes(item))
      .join('/');
  } else {
    newTitle = trans_title.join('/');
  }
  const episodes = data?.episodes > 0 && `全${data?.episodes}集`;
  const directorName = filtersName(data?.director, data?.director?.length);
  const director = directorName ? `导演：${directorName}` : '';
  const pattern = /2160[Pp]/;
  const version = pattern.test(title) ? '[4K版]' : '';
  const languages = data?.language?.map((item) =>
    item.replace('汉语普通话', '国语').trim(),
  );
  const casts =
    filtersName(data?.cast, 4) &&
    `主演: ${filtersName(data?.cast, 4)} [${languages.join('|')}/${
      data?.captions || '中字'
    }] ${version}`;
  const newSubTitleArr = [newTitle, episodes, director, casts];
  const sub_title = newSubTitleArr.filter(Boolean).join(' | ');
  document.querySelector("input[name='small_descr']").value = sub_title;
}

/**
 * 获取多少天之后的时间
 * @param {number} num - 天数
 * @returns
 */
function getCutoffTime(num) {
  // 获取当前时间
  const currentDate = new Date();

  // 向后推迟五天（5天 * 24小时 * 60分钟 * 60秒 * 1000毫秒）
  const delayedDate = new Date(
    currentDate.getTime() + num * 24 * 60 * 60 * 1000,
  );

  // 输出推迟五天后的时间，精确到分钟
  const year = delayedDate.getFullYear();
  const month = String(delayedDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
  const day = String(delayedDate.getDate()).padStart(2, '0');
  const hours = String(delayedDate.getHours()).padStart(2, '0');
  const minutes = String(delayedDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 从标题中获取种子对应的信息
 * 回填到页面上
 * @param {string} eleName -对应的标签标识
 * @param {string} title
 * @returns
 */
function normalSelectValue(eleName, title) {
  const element = document.querySelector(`select[name="${eleName}"]`);
  if (!element) return;
  const options = element.options;
  console.log(Array.from(options));
  const words = title.replace(/-\w+$/, '').split(/[\s\[\]()\.]+/); // 使用空格、括号和其他符号作为分隔符
  console.log(words);
  const option = Array.from(options).filter(
    (item) =>
      !!words.filter(
        (word) => word && item.text.toLowerCase().includes(transformWord(word)),
      ).length,
  );
  if (option && option.length > 0) element.value = option[0].value;
}

/**
 * 将word进行转换
 * @param {string} word
 * @returns
 */
function transformWord(word) {
  const map = {
    DDP: 'DD+',
  };
  const keyword = map[word] ? map[word] : word;
  return keyword.toLowerCase();
}

/**
 * 取数组中的指定个数
 * 将过滤后的数组分割
 * 对数组元素进行处理，只取前面一截
 * @param {Array} names
 * @param {number} num
 * @returns
 */
function filtersName(names, num) {
  if (names && names.length === 0) return '';
  return names
    .slice(0, num)
    .map((item) => item.name.split(' ')[0])
    .join(' ');
}

/**
 * 消息提示框
 * @param {string} message
 */
function showToast(message) {
  // 如果弹窗已经存在，先移除它，防止重复创建
  const existingModal = document.querySelector('.custom-alert-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // 创建弹窗容器
  const modal = document.createElement('div');
  modal.className = 'custom-alert-modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.padding = '20px';
  modal.style.backgroundColor = '#fff';
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  modal.style.zIndex = '9999';
  modal.style.textAlign = 'center';
  modal.style.borderRadius = '4px';

  // 弹窗内容
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  modal.appendChild(messageElement);

  // 关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.style.marginTop = '4px';
  closeButton.onclick = () => document.body.removeChild(modal);
  modal.appendChild(closeButton);

  // 将弹窗添加到页面
  document.body.appendChild(modal);
}

/**
 * 修改简介的值
 * 加上禁转PTT
 * @param {string} descText
 */
function transformDesc(descText) {
  const desc = document.querySelector('textarea[name="descr"]').value;
  if (!desc) {
    document.querySelector('textarea[name="descr"]').value =
      `[quote][b][color=Red][size=6]禁转PTT[/size][/color][/b][/quote]\n${descText?.replace(
        /https:\/\/img\d+(\.doubanio\.com\/view\/photo\/[^\s]+)/,
        'https://img9$1',
      )}`;
  }
}

/**
 * 从种子名中提取信息
 * 填充到对应的表单中
 * @param {string} title
 */
function changeTorrentsIdentification(title) {
  // 修改页面展示
  const hiddenRows = document.querySelectorAll(
    'tr.mode_4[style="display: none;"]',
  );
  hiddenRows.forEach((row) => {
    row.style.display = 'table-row';
  });

  // 标题名称中包含UBWEB
  if (title && title.includes('UBWEB')) {
    document.querySelector('select[name="team_sel[4]"]').value = '6';

    // 勾选 value="3"（官方）的复选框
    document.querySelector(
      'input[type="checkbox"][name="tags[4][]"][value="3"]',
    ).checked = true;
    // 勾选 value="6"（中字）的复选框
    document.querySelector(
      'input[type="checkbox"][name="tags[4][]"][value="6"]',
    ).checked = true;

    // 勾选一级置顶
    // document.querySelector('select[name="pos_state"]').value = 'sticky'
  } else if (title && title.includes('UBits')) {
    document.querySelector('select[name="team_sel[4]"]').value = '1';
  } else {
    document.querySelector('select[name="team_sel[4]"]').value = '5';
  }
  if (title) {
    // 根据标题名自动适配
    normalSelectValue('medium_sel[4]', title);
    normalSelectValue('codec_sel[4]', title);
    normalSelectValue('audiocodec_sel[4]', title);
    normalSelectValue('standard_sel[4]', title);
  }

  // 截止时间
  // const dateTimeElement = document.getElementById(
  //   'datetime-picker-pos_state_until'
  // )
  // if (title.includes('Complete')) {
  //   dateTimeElement.value = getCutoffTime(5)
  // } else {
  //   dateTimeElement.value = getCutoffTime(2)
  // }

  // 默认勾选匿名发布
  document.querySelector('input[type="checkbox"][name="uplver"]').checked =
    true;

  // 设置HR值为NO
  // document.querySelector(
  //   'input[type="radio"][name="hr[4]"][value="0"]'
  // ).checked = true
}

function normalTags(tags) {
  const labels = document.querySelectorAll('td.rowfollow label');
  console.log(labels);
  labels.forEach((label) => {
    const input = label.querySelector('input[type="checkbox"]');
    const value = label.textContent.trim();

    if (!input) return;
    // 构造键值对
    const key = `input[type="checkbox"][name="${input.name}"][value="${input.value}"]`;
    if (tags.includes(value)) document.querySelector(key).checked = true;
  });
}

/**
 * 获取网络链接的返回值
 * @param {string} url
 * @returns
 */
async function fetchNetworkInfo(url) {
  // 请求数据
  const formData = new FormData();

  /**
   * 生成副标题名称
   * 添加表单字段 */
  formData.append('action', 'getPtGen');
  formData.append('params[url]', url);
  const response = await fetch('https://ubits.club/ajax.php', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  const { ret, data, msg } = result;
  if (ret !== 0) return showToast(msg);
  return data;
}

/**
 * 根据页面url中的type回填种子类型
 * @param {string} type
 */
function fillFormType(type) {
  let optionValue = '';
  const selectElement = document.getElementById('browsecat');
  const options = selectElement.getElementsByTagName('option');
  for (let option of options) {
    const value = option.value;
    const text = option.textContent || option.innerText; // 获取显示文本
    if (text.includes(type)) {
      optionValue = value;
    }
  }
  document.querySelector('select[name="type"]').value = optionValue;
}

function getTdValue(name) {
  const tdHeadElements = document.querySelectorAll('td.rowhead');

  const resultArray = [];

  tdHeadElements.forEach((tdHead) => {
    if (tdHead.textContent.trim() === name) {
      const trElement = tdHead.closest('tr');

      const tdFollow = trElement.querySelector('td.rowfollow');
      const spans = tdFollow.querySelectorAll('span');
      spans.forEach((span) => {
        const text = span.textContent.trim();
        resultArray.push(text);
      });
    }
  });
  return resultArray;
}