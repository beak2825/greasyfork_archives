// ==UserScript==
// @name         笔趣阁章节自动下载
// @description  笔趣阁章节自动下载-自动进行章节下载
// @match        https://www.beqege.cc
// @version      0.7
// @namespace    kylqin/beqege-chapter
// @license      MIT
// @author       button2
// @match        https://www.beqege.cc/*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/517281/%E7%AC%94%E8%B6%A3%E9%98%81%E7%AB%A0%E8%8A%82%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/517281/%E7%AC%94%E8%B6%A3%E9%98%81%E7%AB%A0%E8%8A%82%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


// ==== Google Chrome Snippets
// function toggle() {
//     if (localStorage.getItem('WWW-BEQEGE-CC-AUTO-DOWNLOAD-CHAPTER')) {
//         localStorage.removeItem('WWW-BEQEGE-CC-AUTO-DOWNLOAD-CHAPTER')
//         console.log('%c 笔趣阁章节自动下载脚本【关闭】成功', 'color:green')
//     } else {
//         localStorage.setItem('WWW-BEQEGE-CC-AUTO-DOWNLOAD-CHAPTER', 1)
//         console.log('%c 笔趣阁章节自动下载脚本【打开】成功', 'color:green')
//     }
// }
// toggle()
// ===/ Google Chrome Snippets 

NodeList.prototype.toArray = function () {
  return Array.prototype.slice.call(this, 0);
};

function isChapter() {
  // return location.pathname.split('/').filter((a) => a).length === 2;
  return !!location.pathname.match(/\/\d+\/\d+\.html$/)
}

function isBookContents() {
  return !!location.pathname.match(/\/\d+\/?$/);
}

function bcBookName() {
  return document.querySelector('#info h1').innerText
}

function bcBookAuthor() {
  try {
    const author = document.querySelector('#info p').innerText
    return author.replace(/.*：/, '')
  } catch (error) {
    return '佚名'
  }
}

function chapterId() {
    return location.pathname.split('/').filter((a) => a).join('-').replace(/\.html$/, '')
}

function bookName() {
  return document.querySelector('.box_con .con_top a:nth-child(5)').innerText;
}

function chapterTitle() {
  const title = document.querySelector('.bookname').innerText;
  return title;
}

function chapterContent() {
  const paragraphs = document
    .querySelectorAll('#content p')
    .toArray()
    .map((p) => p.innerText);
  return paragraphs.join('\n\n');
}

function bookChapterTitles() {
  return document.querySelectorAll('#list dd a').toArray().map(e => e.innerText)
}

function nextChapter() {
  const nextBtn = document.querySelector('.bottem2 a:nth-child(3)');
  if (nextBtn) {
    nextBtn.click();
  }
}

function downloadChapter() {
  const id = chapterId();
  const bn = bookName();
  const title = chapterTitle();
  const chapter = [title, chapterContent()].join('\n\n')

  console.log(`下载章节: ${bn} - ${title}`);
  download(`BEQEGE-${id}-${bn}-${title}.txt`, chapter);
}

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function main() {
  if (!localStorage.getItem('WWW-BEQEGE-CC-AUTO-DOWNLOAD-CHAPTER')) {
    console.log('笔趣阁章节自动下载 脚本未打开，请设置localStorage WWW-BEQEGE-CC-AUTO-DOWNLOAD-CHAPTER');
    return;
  }

  try {
    if (isBookContents()) {
      console.log(`${bcBookName()} by ${bcBookAuthor()}, 共 ${bookChapterTitles().length} 章`)
      return;
    }

    if (!isChapter()) {
      console.log('不是章节');
      return;
    }

    downloadChapter();

    setTimeout(() => {
      nextChapter();
    }, 500);
  } catch (error) {
    console.log('出错', error)
    console.log('重试...')
    setTimeout(main, 200)
  }
}

setTimeout(main, 500)
