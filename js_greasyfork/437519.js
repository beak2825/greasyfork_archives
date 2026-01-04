// ==UserScript==
// @name         douban_book_ptgen
// @namespace    https://puxx@greasyfork.org/
// @version      0.1.20211224
// @description  豆瓣读书PTGen
// @author       puxx
// @license      GPL-3.0 License
// @match        https://book.douban.com/subject/*
// @icon         https://img3.doubanio.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/437519/douban_book_ptgen.user.js
// @updateURL https://update.greasyfork.org/scripts/437519/douban_book_ptgen.meta.js
// ==/UserScript==


(function() {
'use strict';


/////////////////////////////////////////
// Polyfill

// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/before()/before().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('before')) {
      return;
    }
    Object.defineProperty(item, 'before', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function before() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();

        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });

        this.parentNode.insertBefore(docFrag, this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/////////////////////////////////////////


/////////////////////////////////////////
// 工具函数

let isCJK = (char) => {
  return /\p{Unified_Ideograph}/u.test(char);
}

let sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let createElementByHtml = (html) => {
  let node = document.createElement('div');
  node.innerHTML = html;
  return node.firstElementChild;
}

let blinkElement = async (el) => {
  const colors = [
    '#FF5EAB',  // 浅红
    '#3991FF',  // 蓝色
    '#F7B500',  // 橙色
    '#12CA7A',  // 绿色
  ];
  const endColor = '#3991FF';
  for (let i = 0; i < 8; i++) {
    const color = colors[i % colors.length];
    el.style.color = color;
    await sleep(60);
  }
  el.style.color = endColor;
}


// 从 url 下载 blob
let getBlobFromUrl = (url) => {
    return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}


// 上传图片到 sm.ms 图床
let uploadPicBlob = async (picBlob) => {
  let formData = new FormData();
  formData.append('smfile', picBlob);
  return new Promise(function (resolve, reject) {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://sm.ms/api/v2/upload',
      data: formData,
      onload: function (response) {
        let data = JSON.parse(response.responseText);
        let imgUrl = data.images || data.data.url;
        resolve(imgUrl);
      },
      onerror: response => { reject('Response error ' + response.status) },
      ontimeout: function() { reject('Timeout') },
    });
  });
}


/////////////////////////////////////////


console.log(`[豆瓣读书PTGen] starting`);


/********* 获取图书信息 *********/

let bookInfo = {};

// 标题
bookInfo.title = document.querySelector('#wrapper h1 span').innerText;

let elDivArticle = document.querySelector('#content .article');

// 封面
bookInfo.coverPicUrl = elDivArticle.querySelector('#mainpic a').href;

// info块
let infoBlockText = elDivArticle.querySelector('#info').innerText.trimEnd();
let infoBlockItems = infoBlockText
  .split('\n')
  .map((i) => {
    let [key, value] = i.split(':');
    value = value.trim();
    return [key, value];
  });
let infoBlock = Object.fromEntries(infoBlockItems);
bookInfo.infoBlockText = infoBlockText;
bookInfo.infoBlockItems = infoBlockItems;
bookInfo.infoBlock = infoBlock;

// 豆瓣评分
let elRatingWrap = elDivArticle.querySelector('.rating_wrap');
let rating = {}
rating.ratingNum = elRatingWrap.querySelector('.rating_num').innerText;
if (rating.ratingNum) {
  rating.ratingPeople = elRatingWrap.querySelector('.rating_people').innerText;
}
bookInfo.rating = rating;


let elDivRelatedInfo = elDivArticle.querySelector('.related_info');
for (let elH2 of elDivRelatedInfo.querySelectorAll('h2')) {
  let getText = (el) => {
    let elDivIntro = el.nextElementSibling.querySelector('.all .intro');
    if (!elDivIntro) {
      elDivIntro = el.nextElementSibling.querySelector('.intro');
    }
    return Array.from(elDivIntro.querySelectorAll('p'))
      .map(i => i.innerText)
      .join('\n\n');
  };
  if (elH2.innerText.startsWith('内容简介 ')) {
    bookInfo.contentIntro = getText(elH2);
  }
  if (elH2.innerText.startsWith('作者简介 ')) {
    bookInfo.authorIntro = getText(elH2);
  }
}


let getBookUploadInfo = () => {
  let result = [];

  // 标题（完整书名）
  if (bookInfo.title) {
    let fullname;
    if (bookInfo.infoBlock['副标题']) {
      fullname = `${bookInfo.title}：${bookInfo.infoBlock['副标题']}`;
    } else {
      fullname = bookInfo.title;
    }
    result.push(...[
      fullname,
      `\n☝️☝️☝️这是标题，复制到标题输入栏\n`,
      '\n\n',
    ]);
  }

  // 副标题
  if (bookInfo.infoBlock['作者']) {
    let items = [];
    let fields = ['作者', '译者', '出版社', '出版年'];
    for (let field of fields) {
      if (bookInfo.infoBlock[field]) {
        items.push(`${field}: ${bookInfo.infoBlock[field]}`);
      }
    }
    result.push(...[
      items.join(' | '),
      `\n☝️☝️☝️这是副标题，复制到副标题输入栏\n`,
      '\n\n',
    ]);
  }

  // 分隔线
  result.push(...[
    '记得删除此分隔线以及分隔线上面的内容！！！\n',
    Array(40).fill('*').join(''),
    '\n\n\n',
  ]);

  // 封面
  if (bookInfo.coverPicUrl) {
    let coverPicUrl = bookInfo.newCoverPicUrl || bookInfo.coverPicUrl;
    result.push(...[
      `[img]${coverPicUrl}[/img]`,
      '\n\n',
    ]);
  }

  // info块
  if (bookInfo.infoBlockText) {
    for (let [field, value] of bookInfo.infoBlockItems) {
      if (Array.from(field).every(isCJK)) {
        if (field.length === 1) {
          let c1 = field;
          field = `◎${c1}　　　`;
        }
        else if (field.length === 2) {
          let [c1, c2] = field;
          field = `◎${c1}　　${c2}`;
        } else if (field.length === 3) {
          let [c1, c2, c3] = field;
          field = `◎${c1}  ${c2}  ${c3}`;
        } else {
          field = '◎' + field;
        }
      } else if (field === 'ISBN') {
        field = '◎ISBN     ';
      } else {
        field = '◎' + field;
      }
      result.push(`${field}　${value}\n`);
    }
    result.push('\n');
  }

  // 豆瓣评分
  if (bookInfo.rating.ratingNum) {
    let starCount = parseFloat(bookInfo.rating.ratingNum) / 2;
    let starCountInt = Math.floor(starCount);
    let goldStars = Array(starCountInt).fill('★');
    if (starCount - Math.floor(starCount) > 0.5) {
      goldStars.push('☆');
    }
    let grayStars = Array(5 - goldStars.length).fill('☆');
    let stars = [
      '[color=#FFD700]',
      ...goldStars,
      '[/color]',
      '[color=gray]',
      ...grayStars,
      '[/color]',
    ]
    result.push(...[
      `◎豆瓣评分　`,
      `[size=6]${bookInfo.rating.ratingNum}[/size]  `,
      `${stars.join("")}  `,
      `[size=2](${bookInfo.rating.ratingPeople})[/size]\n`,
      '\n\n\n',
    ]);
  }

  // 作者简介
  if (bookInfo.contentIntro) {
    result.push(...[
      `[b][size=6]内容简介[/size][/b]\n\n`,
      bookInfo.contentIntro,
      '\n\n\n',
    ]);
  }

  // 作者简介
  if (bookInfo.authorIntro) {
    result.push(...[
      `[b][size=6]作者简介[/size][/b]\n\n`,
      bookInfo.authorIntro,
      '\n\n\n',
    ]);
  }

  // 豆瓣链接
  let bookUrl = location.href;
  result.push(...[
    `[img]https://i.loli.net/2021/10/25/TdO1JRobApl2C6Y.png[/img]\n\n`,
    `[size=5][url=${bookUrl}]${bookUrl}[/url][/size]\n`,
  ]);


  return result.join('');
}


console.log('bookInfo', bookInfo);



/******************/

let uploadBookCoverPic = async () => {
  if (!bookInfo.coverPicBlob) {
    console.log(`[DEBUG] 下载封面图片 ${bookInfo.coverPicUrl}`);
    bookInfo.coverPicBlob = await getBlobFromUrl(bookInfo.coverPicUrl);
    console.log(`[DEBUG] 封面图片下载成功`);
  }
  if (!bookInfo.newCoverPicUrl) {
    console.log(`[DEBUG] 上传封面图片到sm.ms`);
    let newPicUrl = await uploadPicBlob(bookInfo.coverPicBlob);
    console.log('[DEBUG] 上传结果', newPicUrl);
    bookInfo.newCoverPicUrl = newPicUrl;
  }
}



/******************/
/** 样式微调 **/
(() => {
  let elTitle = document.querySelector('#wrapper h1');
  elTitle.style.paddingBottom = '10px';
})();


/******************/
/** 搜索相关 **/
(() => {
  let title = bookInfo.title;
  let html = `
    <div id="search-wrapper" style="font-size: 16px; color: #ff4500;">
      <span style="display: inline-block;">快速搜索:</span>
      <a href="https://pt.soulvoice.club/live.php?search=${title}" target="_blank">聆音</a>
      <span> | </span>
      <a href="https://et8.org/torrents.php?search=${title}" target="_blank">TCCF</a>
    </div>
  `;
  let el = createElementByHtml(html);
  document.querySelector('#content').before(el);
})();


/******************/
/** 发种相关 **/


(() => {
  let buttonUploadCoverPic;
  let buttonCopyUploadInfo;

  let elUploadWrapper = createElementByHtml(`
    <div id="upload-wrapper" style="display: flex; font-size: 16px;">
      <div style="color: #ff4500; padding-right: 7px;">发种工具: </div>
      <div id="upload-content"></div>
    </div>`
  );
  document.querySelector('#content').before(elUploadWrapper);
  let elUploadContent = elUploadWrapper.querySelector('#upload-content');

  // 添加按钮「上传封面图片到sm.ms」
  buttonUploadCoverPic = createElementByHtml('<a style="text-decoration: none; cursor: pointer;" onclick="return false">①上传封面图片到sm.ms</a>');
  Object.assign(buttonUploadCoverPic.style, {
    fontSize: '16px',
    color: '#ff4500',
    backgroundColor: 'inherit',
    display: 'inline-block',
    width: '12em',
    marginBottom: '4px',
    marginRight: '14px',
  })
  elUploadContent.appendChild(buttonUploadCoverPic);
  buttonUploadCoverPic.addEventListener('click', async () => {
    console.log(`[DEBUG] 上传封面图片到sm.ms`);
    buttonUploadCoverPic.innerText = '①封面图片上传中......'
    await uploadBookCoverPic();
    buttonUploadCoverPic.innerText = '①已上传封面图片到sm.ms';
    blinkElement(buttonUploadCoverPic);
  });

  // 添加复制发种信息按钮
  buttonCopyUploadInfo = createElementByHtml('<a style="text-decoration: none; cursor: pointer;" onclick="return false">②复制发种信息</a>');
  Object.assign(buttonCopyUploadInfo.style, {
    fontSize: '16px',
    color: '#ff4500',
    backgroundColor: 'inherit',
    display: 'inline-block',
    marginBottom: '4px',
    marginRight: '14px',
  })
  elUploadContent.appendChild(buttonCopyUploadInfo);
  buttonCopyUploadInfo.addEventListener('click', async () => {
    console.log(`[DEBUG] 复制发种信息`);
    GM_setClipboard(getBookUploadInfo());
    blinkElement(buttonCopyUploadInfo);
  });

})();



})();
