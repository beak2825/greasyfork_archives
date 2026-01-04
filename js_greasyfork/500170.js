// ==UserScript==
// @name         笔趣阁下载器
// @namespace    http://tampermonkey.net/
// @version      0.3.8
// @description  可在笔趣阁下载小说（TXT格式），在小说目录页面使用。（仅供交流，可能存在bug）（已测试网址:beqege.cc|bigee.cc|bqgui.cc|bbiquge.la|3bqg.cc|xbiqugew.com)
// @author       Yearly
// @match        https://www.beqege.cc/*/
// @match        https://www.bigee.cc/book/*/
// @match        https://www.bqgui.cc/book/*/
// @match        https://www.3bqg.cc/book/*/
// @match        https://www.bbiquge.la/*/
// @match        https://www.xbiqugew.com/book/*/
// @match        https://www.beqege.com/*/
// @match        https://www.bqg78.cc/book/*/
// @match        https://www.biquge.tw/book/*/
// @license      GPL-3.0
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/scripts/500170
// @supportURL   https://greasyfork.org/scripts/500170
// @homepageURL  https://greasyfork.org/scripts/500170
// @icon         https://www.beqege.cc/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/500170/%E7%AC%94%E8%B6%A3%E9%98%81%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/500170/%E7%AC%94%E8%B6%A3%E9%98%81%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {

  GM_addStyle(`
        #fetchContentModal {
            display: block;
            border-radius: 10px;
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 5px 20px 10px 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            width: 500px;
            text-align: center;
        }
        #fetchContentModal h3{
            margin: 1.3em;
        }
        #fetchContentModal label{
            display: block;
            font-size: 14px;
        }
        #fetchContentModal input[type="number"] {
            width: auto;
            margin: 2px 3px;
            text-align: center;
            -moz-appearance: textfield;
            appearance: textfield;
        }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: inner-spin-button;
            opacity: 1;
        }
        #fetchContentModal button {
            width: 100%;
            margin: 10px 0;
        }
        #fetchContentModal #fetchContentProgress {
            width: 100%;
            background: #f3f3f3;
            border: 1px solid #ccc;
            margin: 10px 0;
        }
        #fetchContentProgress div {
            width: 0;
            height: 20px;
            background: #4caf50;
            text-align: center;
            margin-left: 0;
            color: #960;
            white-space: nowrap;
        }
        #fetchContentModal td {
            white-space: nowrap;
            overflow: hidden;
        }
    `);

  const modalHtml = `
        <div id="fetchContentModal" style="display:none;">
            <h3>小说下载工具<span id="fetcModalClose" style="cursor: pointer; float: right; margin:-8px -4px;">✕</span></h3>
            <label id="_book_info"></label>
            <label for="ranges">下载章节范围：</label>
            <table style="width:100%; margin-bottom:10px; table-layout:fixed;">
              <tbody>
                 <colgroup>
                  <col style="width: 45%;">
                  <col style="width: 10%;">
                  <col style="width: 45%;">
                </colgroup>
                <tr>
                  <th style="width:45%; text-align:right;"><input type="number" id="_startRange" min="1" value="1"></th>
                  <th style="width:10%; text-align:center;"> ~ </th>
                  <th style="width:45%; text-align: left;"><input type="number" id="_finalRange" min="1" value="2"></th>
                </tr>
                <tr>
                  <td style="width:45%; text-align:right;" id="_startRange_title"></td>
                  <td style="width:10%; text-align:center;"> ~ </td>
                  <td style="width:45%; text-align:left;" id="_finalRange_title"></td>
                </tr>
              </tbody>
            </table>
            <label id="_warn_info"></label>
            <label id="_warn_info"></label>
            <button id="fetchContentButton">开始下载</button>
            <div id="fetchContentProgress">
                <div></div>
            </div>
            <a id="_downlink"></a>
        </div>
    `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // 获取元素
  const modal = document.getElementById('fetchContentModal');
  const startRangeInput = document.getElementById('_startRange');
  const finalRangeInput = document.getElementById('_finalRange');

  const startTitle = document.getElementById('_startRange_title');
  const finalTitle = document.getElementById('_finalRange_title');

  const fetchButton = document.getElementById('fetchContentButton');
  const progressBar = document.getElementById('fetchContentProgress').firstElementChild;
  const downlink = document.getElementById('_downlink');
  const warnInfo = document.getElementById('_warn_info');
  const bookInfo = document.getElementById('_book_info');
  const fetcClose = document.getElementById('fetcModalClose');

  let booktitle = null;
  let tocDiv = null;
  let chapters = null;

  let startIndex, finalIndex;

  function downloadMenu() {
    modal.style.display = 'block';
    tocDiv = document.querySelector("#list") || document.querySelector(".listmain") || document.querySelector(".list-chapter");

    if(tocDiv.querySelector('dl center.clear')) {
      chapters = document.querySelectorAll("dl center.clear ~ dd > a[href]")
    } else {
      chapters = tocDiv.querySelectorAll("dl dd > a[href]")
    }
    if(!chapters.length) {
      chapters = document.querySelectorAll("div.list-chapter > div.booklist > ul > li > a[href]")
    }

    startRangeInput.max = chapters.length;
    finalRangeInput.max = chapters.length;

    startIndex = 0;
    finalIndex = chapters.length - 1;

    finalRangeInput.value = chapters.length;
    startTitle.innerText = chapters[startIndex].innerText;
    finalTitle.innerText = chapters[finalIndex].innerText;

    const title = document.querySelector("#maininfo #info h1") || document.querySelector(".info h1") || document.querySelector("h1") ;
    if(title) booktitle = title.innerText;
    else booktitle = document.title;
    bookInfo.innerText=`当前小说:《${booktitle}》，共 ${chapters.length} 章。`
    warnInfo.innerText=`设置范围后点击开始下载，并稍作等待。\n若章节过多下载卡住，可尝试减小章节范围分次下载。`

    if(document.querySelector('button#downloadMenuBtn')) { document.querySelector('button#downloadMenuBtn').hidden=true; }
  }

  if (document.querySelector("h1")) {
    let downloadMenuBtn = document.createElement("button");
    downloadMenuBtn.innerText = "下载"
    downloadMenuBtn.id="downloadMenuBtn"
    downloadMenuBtn.style="padding:2px 10px; margin:auto 10px; font-size:15px; background:#ccF8;"
    document.querySelector("h1").append(downloadMenuBtn)
    downloadMenuBtn.addEventListener('click', downloadMenu);
  }

  GM_registerMenuCommand('小说下载工具', downloadMenu);

  fetcClose.addEventListener('click', async () => {
    modal.style.display = 'none';
    if(document.querySelector('button#downloadMenuBtn')) { document.querySelector('button#downloadMenuBtn').hidden=false; }
  });

  startRangeInput.addEventListener('input', function() {
    let val = parseInt(startRangeInput.value)
    if (!isNaN(val)) {
      if (val < 1) {val = 1;}
      if (val > chapters.length) {val = chapters.length;}
      startRangeInput.value = val;
      startIndex = parseInt(val) - 1;
      startTitle.innerText = chapters[startIndex].innerText;
    }
  });

  finalRangeInput.addEventListener('input', function() {
    let val = parseInt(finalRangeInput.value)
    if (!isNaN(val)) {
      if (val < 1) {val = 1;}
      if (val > chapters.length) {val = chapters.length;}
      finalRangeInput.value = val;
      finalIndex = parseInt(val) - 1;
      finalTitle.innerText = chapters[finalIndex].innerText;
    }
  });

  fetchButton.addEventListener('click', async () => {
    downlink.innerText = "";
    downlink.href = null;
    downlink.download = null;
    fetchButton.disabled = true;

    if (startIndex > finalIndex) {
      let temp0 = startIndex;
      let temp1 = finalIndex;
      startIndex = temp1;
      finalIndex = temp0;
      startRangeInput.value = startIndex+1;
      startTitle.innerText = chapters[startIndex].innerText;
      finalRangeInput.value = finalIndex+1;
      finalTitle.innerText = chapters[finalIndex].innerText;
    }

    const links = document.querySelectorAll("dl dd > a[href], div.list-chapter > div.booklist > ul > li > a[href]")

    const selectedLinks = Array.from(links).slice(startIndex, finalIndex+1);

    if (!booktitle){
      booktitle = document.title;
    }
    const results = [];
    const totalLinks = selectedLinks.length;
    let completedRequests = 0;

    const retry = [];
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    let queue = 0;


    async function fetchContent(url, link) {
      let allContent = '';
      let title = '';

      async function fetchPage(pageUrl) {
        const response = await fetch(pageUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let text = '';
        const contentType = response.headers.get('Content-Type');
        if (contentType) {
          let charset = 'utf-8'; // 默认编码
          const charsetMatch = contentType && contentType.match(/charset=([^;]+)/i);
          if (charsetMatch) {
            charset = charsetMatch[1].toLowerCase();
          }
          const arrayBuffer = await response.arrayBuffer();
          const decoder = new TextDecoder(charset);
          text = decoder.decode(new Uint8Array(arrayBuffer));
        } else {
          text = await response.text();
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const contentDiv = doc.querySelector('div#content') || doc.querySelector('#chaptercontent') || doc.querySelector('.content');

        if (contentDiv) {
          contentDiv.querySelectorAll('div#device').forEach(function(web_ad) {
            web_ad.remove();
          });
          contentDiv.querySelectorAll('p.readinline > a[href*="javascript:"]').forEach(function(web_op) {
            web_op.remove();
          });
          contentDiv.innerHTML = contentDiv.innerHTML.replaceAll('<br>', '\n');
          allContent += contentDiv.innerText + '\n\n'; // 添加页面内容到总内容
        }

        if (doc.querySelector('h1')) {
          title = doc.querySelector('h1').innerText;
        }

        const nextPage = doc.querySelector('.read-page a[href][rel="next"]');
        if (nextPage && (nextPage.innerText == '下一页')) {
          console.log(nextPage.href);
          await fetchPage(new URL(nextPage.href, pageUrl).href);
        }
      }

      await fetchPage(url);

      if (link && !title) {
        title = link.innerText;
      }

      return { title: title, content: allContent };
    }

    const fetchAndParse = async (link, index) => {
      await delay(5 * index);
      await delay(5 * queue++);

      const url = link.href;
      try {
        results[index] = await fetchContent(url, link);
      } catch (error) {
        results[index] = { title: link.innerText, content: `Error fetching ${url}: ${error}` };
      } finally {
        if (queue) queue--;
        // 更新进度条
        completedRequests++;
        const progress = Math.round((completedRequests / totalLinks) * 100);
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${progress}% (${completedRequests}/${totalLinks})`;
      }
    };

    Promise.all(selectedLinks.map((link, index) => fetchAndParse(link, index)))
      .then(() => {
      const bookInfoDiv = document.querySelector("#maininfo #info") || document.querySelector("div.book div.info") || document.querySelector("h1");
      let finalResults = booktitle;
      if (bookInfoDiv ) finalResults = bookInfoDiv.innerText;

      finalResults += `\n\n下载章节索引范围：${startIndex+1} ~ ${finalIndex+1}\n`;
      finalResults += `\n来自链接：${document.URL}\n`
      finalResults += "\n-----------------------\n";

      results.forEach((result) => {
        finalResults += `\n## ${result.title}\n\n`;
        finalResults += result.content + '\n';
      });

      finalResults += "\n-----------------------\n";

      const blob = new Blob([finalResults], { type: 'text/plain' });
      downlink.innerText = "若未开始自动下载，点击这里";
      downlink.href = URL.createObjectURL(blob);
      downlink.download = `${booktitle}_${startIndex+1}~${finalIndex+1}.txt`;
      downlink.click();
      fetchButton.disabled = false;
    })
      .catch((error) => {
      console.error('Error fetching links:', error);
    });

  });
})();
