// ==UserScript==
// @name         杏坛 PT 书籍自动检索工具 (修复增强版)
// @namespace    zetxtech
// @version      10.6
// @description  已有的书籍名称通过豆瓣和 Google Book API 获取信息，然后填充至各个信息区
// @author       zetxtech & 周半仙
// @license      GPLv3
// @match        https://xingtan.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xingtan.one
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/511445/%E6%9D%8F%E5%9D%9B%20PT%20%E4%B9%A6%E7%B1%8D%E8%87%AA%E5%8A%A8%E6%A3%80%E7%B4%A2%E5%B7%A5%E5%85%B7%20%28%E4%BF%AE%E5%A4%8D%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511445/%E6%9D%8F%E5%9D%9B%20PT%20%E4%B9%A6%E7%B1%8D%E8%87%AA%E5%8A%A8%E6%A3%80%E7%B4%A2%E5%B7%A5%E5%85%B7%20%28%E4%BF%AE%E5%A4%8D%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function handleDetailsPage() {
    // 匹配给定的 XPath 表达式
    var xpathExpression = '//td[@class="rowfollow"]/a[@class="index"]';
    var result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    // 获取匹配的元素
    var element = result.singleNodeValue;

    if (element) {
      // 获取元素的文本内容
      var text = element.textContent;

      // 提取倒数第二个 `.` 到倒数第三个 `.` 之间的内容
      var regex = /(?:\.[^.]+)(\.)([^.]+)(?:\.[^.]+)$/; // 正则表达式
      var match = regex.exec(text);

      if (match && match[2]) {
        var extractedText = match[2];
        // 匹配给定的 XPath 表达式

        var xpathExpression = '//a[contains(@title, "编辑")]';
        var result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        // 获取匹配的链接元素
        var linkElement = result.singleNodeValue;

        if (linkElement) {
          // 获取链接的 href 属性值
          var link = linkElement.getAttribute("href");

          // 在链接后面追加参数
          var updatedLink = link + "&type=" + extractedText;

          // 更新链接的 href 属性
          linkElement.setAttribute("href", updatedLink);
        }
      }
    }
  }

  function cleanBookTitle(title) {
    return title
      .replace(/^《|》$/g, "") // 去除开头和结尾的书名号
      .replace(/[\(\（\【\[].*?[\)\）\】\]]/g, '') // 去除各种括号及其内容
      .trim(); // 去除两侧空格
  }

  function handleEditPage() {
    const xtXpath = '//td[@id="outer"]/div/div[2]';
    const targetElement = document.evaluate(xtXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // 创建一个包裹所有元素的主div
    const mainDiv = document.createElement("div");
    mainDiv.id = "auto-search-wrapper";
    mainDiv.style = "width:58%;margin-bottom:20px;background-color:#f1f1f1;font-size:15px;padding:10px;border-radius:5px;";

    // 创建三个子div元素
    const infoElement = document.createElement("div");
    const searchElement = document.createElement("div");
    const resultElement = document.createElement("div");

    // 设置子元素的id和样式
    infoElement.id = "info-element";
    infoElement.style = "margin-bottom:10px;";
    searchElement.id = "search-element";
    searchElement.style = "margin-bottom:10px;";
    resultElement.id = "result-element";
    resultElement.style = "margin-bottom:10px;";

    // 将子元素添加到主div中，注意顺序
    mainDiv.appendChild(infoElement);
    mainDiv.appendChild(searchElement);
    mainDiv.appendChild(resultElement);

    // 将主div插入到目标元素后面
    targetElement.parentNode.insertBefore(mainDiv, targetElement.nextSibling);

    checkAndAddAuthorIntroButton();

    // 监听textarea的变化
    const textarea = document.querySelector('textarea[class="bbcode"]');
    if (textarea) {
      textarea.addEventListener('input', checkAndAddAuthorIntroButton);
    }

    const titleXpath = '//input[@name="name"]';
    const element = document.evaluate(titleXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (element) {
      const originalTitle = element.value;
      const cleanedTitle = cleanBookTitle(originalTitle);

      // 添加搜索输入框和按钮到searchElement
      searchElement.innerHTML = `
            <div style="margin-bottom:10px;">
              <input type="text" id="searchTitle" value="${cleanedTitle}" style="width:70%;padding:5px;">
              <button id="searchButton" style="padding:5px 10px;background-color:#007bff;color:white;border:none;border-radius:3px;cursor:pointer;">重新搜索</button>
            </div>
          `;

      const searchButton = document.getElementById("searchButton");
      const searchTitleInput = document.getElementById("searchTitle");

      if (searchButton && searchTitleInput) {
        searchButton.addEventListener("click", function () {
          const searchTitle = searchTitleInput.value.trim();
          resultElement.innerHTML = ""; // 清空之前的搜索结果
          searchBooks(searchTitle, infoElement, resultElement);
        });

        if (document.querySelector('input[name="author"]').value != "本资源由LM-AUTO-BOT机器人自动发布,请及时修改资料") {
          infoElement.innerHTML = "当前种子已被编辑过，不再执行自动检索脚本....";
          return 0;
        }

        // 初始搜索
        searchBooks(cleanedTitle, infoElement, resultElement);
      } else {
        console.log("无法找到搜索按钮或输入框");
      }

      // 搜索并修改所有匹配的 select 元素
      const selectElements = document.querySelectorAll('select[name^="source_sel"]');
      if (selectElements.length > 0) {
        selectElements.forEach(selectElement => {
          const bookOption = Array.from(selectElement.options).find(option => option.text === '书籍');
          if (bookOption) {
            bookOption.selected = true;
            selectElement.dispatchEvent(new Event('change'));
          }
        });
        console.log(`已修改 ${selectElements.length} 个 source_sel select 元素`);
      } else {
        console.log("未找到 source_sel select 元素");
      }

      const processingSelElements = document.querySelectorAll('select[name^="processing_sel"]');
      if (processingSelElements.length > 0) {
        processingSelElements.forEach(selectElement => {
          const pdfOption = Array.from(selectElement.options).find(option => option.text === 'PDF');
          if (pdfOption) {
            pdfOption.selected = true;
            selectElement.dispatchEvent(new Event('change'));
          }
        });
        console.log(`已修改 ${processingSelElements.length} 个 processing_sel select 元素为 PDF`);
      } else {
        console.log("未找到 processing_sel select 元素");
      }
    } else {
      console.log("找不到元素");
    }
  }

  function checkAndAddAuthorIntroButton() {
    const textarea = document.querySelector('textarea[class="bbcode"]');
    if (textarea && !textarea.value.includes("作者简介")) {
      const buttonContainer = document.getElementById('auto-search-wrapper');
      if (buttonContainer && !document.getElementById('add-author-intro-btn')) {
        const addAuthorIntroBtn = document.createElement('button');
        addAuthorIntroBtn.id = 'add-author-intro-btn';
        addAuthorIntroBtn.textContent = '补全作者简介';
        addAuthorIntroBtn.style = 'padding:5px 10px;background-color:#28a745;color:white;border:none;border-radius:3px;cursor:pointer;margin-top:10px;';
        addAuthorIntroBtn.addEventListener('click', fetchAuthorIntro);
        buttonContainer.appendChild(addAuthorIntroBtn);
      }
    } else if (document.getElementById('add-author-intro-btn')) {
      document.getElementById('add-author-intro-btn').remove();
    }
  }

  function fetchAuthorIntro() {
    const titleInput = document.querySelector('input[name="name"]');
    const authorInput = document.querySelector('input[name="author"]');
    if (!titleInput || !authorInput) return;
  
    const bookTitle = cleanBookTitle(titleInput.value);
    const author = authorInput.value.split('&')[0].trim(); // 获取第一个作者
  
    searchBaiduBaikeBookAutherInfo(bookTitle)
      .then(authorIntro => {
        if (!authorIntro) {
          return searchBaiduBaikeAuthor(author);
        }
        return authorIntro;
      })
      .then(authorIntro => {
        if (authorIntro) {
          const textarea = document.querySelector('textarea[class="bbcode"]');
          textarea.value += `\n\n作者简介：\n    ${authorIntro.trim()}`;
          checkAndAddAuthorIntroButton(); // 重新检查按钮状态
        } else {
          alert('未找到作者简介信息');
        }
      })
      .catch(error => {
        console.error('获取作者简介时出错:', error);
        alert('获取作者简介时出错，请稍后重试');
      });
  }
  
  function searchBaiduBaikeBookAutherInfo(keyword) {
    const url = `https://wapbaike.baidu.com/item/${encodeURIComponent(keyword)}`;
    console.log('从百度百科 API 获取图书数据中的作者简介:', url);
  
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");
          const authorSections = doc.querySelectorAll('h2.title-level-2');
          let authorIntro = '';
          
          for (const section of authorSections) {
            if (section.getAttribute('data-title').includes('作者')) {
              let nextElement = section.nextElementSibling;
              while (nextElement && !nextElement.matches('h2.title-level-2')) {
                if (nextElement.classList.contains('para')) {
                  authorIntro += nextElement.textContent.trim() + '\n';
                }
                nextElement = nextElement.nextElementSibling;
              }
              break;
            }
          }
  
          resolve(authorIntro.trim());
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }
  
  function searchBaiduBaikeAuthor(author) {
    const url = `https://wapbaike.baidu.com/item/${encodeURIComponent(author)}`;
    console.log('从百度百科 API 获取作者数据:', url);
  
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");
          const summaryContent = doc.querySelector('.summary-content');
          
          if (summaryContent) {
            let authorIntro = '';
            const paragraphs = summaryContent.querySelectorAll('p');
            paragraphs.forEach(p => {
              let text = p.textContent.trim();
              // 移除 [1] 等标识
              text = text.replace(/\[\d+\]/g, '');
              authorIntro += text + '\n';
            });
            resolve(authorIntro.trim());
          } else {
            resolve('');
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }

  function searchBooks(processedTitle, infoElement, resultElement) {
    // 清空之前的搜索结果
    resultElement.innerHTML = "";

    const loadingElement = document.createElement("div");
    loadingElement.id = "loading-message";
    loadingElement.innerHTML = "正在搜索";
    loadingElement.style.marginBottom = "10px";
    infoElement.innerHTML = ""; // 清空之前的信息
    infoElement.appendChild(loadingElement);

    const loadingInterval = setInterval(() => {
      loadingElement.innerHTML += ".";
      if (loadingElement.innerHTML === "正在搜索....") {
        loadingElement.innerHTML = "正在搜索";
      }
    }, 500);

    const doubanUrl = `https://api.douban.com/v2/book/search?q=${encodeURIComponent(
      processedTitle
    )}&apikey=0ac44ae016490db2204ce0a042db2916`;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(processedTitle)}&projection=full`;

    Promise.all([fetchBookInfo(doubanUrl, "douban"), fetchBookInfo(googleBooksUrl, "google")])
      .then((results) => {
        clearInterval(loadingInterval);
        loadingElement.remove();
        const [doubanBooks, googleBooks] = results;
        const mergedBooks = [...doubanBooks, ...googleBooks];
        displayBookResults(mergedBooks, resultElement);
      })
      .catch((error) => {
        clearInterval(loadingInterval);
        loadingElement.remove();
        console.error("Error fetching book information:", error);
        infoElement.innerHTML = "获取书籍信息时出错，请稍后重试。";
      });
  }

  function fetchBookInfo(url, source) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            console.log(data)
            let books = [];
            if (source === "douban") {
              books = data.books || [];
            } else {
              books = data.items || [];
            }
            resolve(books.slice(0, 8).map((book) => formatBookInfo(book, source)));
          } catch (error) {
            console.error(`处理 ${source} 数据时出错:`, error);
            resolve([]);
          }
        },
        onerror: function (error) {
          console.error(`获取 ${source} 数据时出错:`, error);
          resolve([]);
        },
      });
    });
  }

  function formatBookInfo(book, source) {
    if (source === "douban") {
      return {
        title: book.title,
        authors: book.author ? book.author.flatMap(author => author.split('//').map(name => name.trim())) : [],
        publisher: book.publisher,
        publishedDate: book.pubdate,
        pageCount: book.pages,
        isbn: book.isbn13,
        description: book.summary,
        authorIntro: book.author_intro, // 添加作者简介
        imageLink: book.images?.large || book.images?.medium || book.images?.small,
        id: book.id,
        source: "douban",
      };
    } else if (source === "google") {
      const volumeInfo = book.volumeInfo;
      const imageLinks = volumeInfo.imageLinks || {};
      return {
        title: volumeInfo.title,
        authors: volumeInfo.authors,
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        pageCount: volumeInfo.pageCount,
        isbn: volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers.find((id) => id.type === "ISBN_13")?.identifier : null,
        description: volumeInfo.description,
        imageLink: (
          imageLinks.extraLarge ||
          imageLinks.large ||
          imageLinks.medium ||
          imageLinks.small ||
          imageLinks.thumbnail ||
          imageLinks.smallThumbnail
        )?.replace(/^http:/, "https:"),
        id: book.id,
        source: "google",
      };
    }
  }

  async function fetchGoogleBookDetails(bookId) {
    return new Promise((resolve, reject) => {
      const detailUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
      GM_xmlhttpRequest({
        method: "GET",
        url: detailUrl,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            resolve(data.volumeInfo);
          } catch (error) {
            console.error("处理 Google Book 详情时出错:", error);
            resolve(null);
          }
        },
        onerror: function (error) {
          console.error("获取 Google Book 详情时出错:", error);
          resolve(null);
        },
      });
    });
  }

  async function displayBookResults(books, divElement) {
    if (books.length === 0) {
      divElement.innerHTML += "<p>暂未检索到相关资源</p>";
      return;
    }

    const fetchPromises = books.map((book) => {
      if (book.source === "google" && !book.publisher) {
        return fetchGoogleBookDetails(book.id).then((details) => {
          if (details) {
            book.publisher = details.publisher || "";
          }
          return book;
        });
      }
      return Promise.resolve(book);
    });

    await Promise.all(fetchPromises);

    const values = books.map(createBookValue);
    sessionStorage.setItem("books", JSON.stringify(books));
    sessionStorage.setItem("values", JSON.stringify(values));

    let tableHTML = `
          <table style="width:100%;margin-top:10px;table-layout:fixed;border-top-left-radius:10px;border-top-right-radius:10px;overflow:hidden;font-size:12px;">
            <thead>
              <tr style="background-image:url(https://xingtan.one/styles/BlasphemyOrange/shade.gif);background-repeat:repeat-x;background-color:rgb(255, 151, 24);color:white;">
                <th style="text-align:left;width:40%;padding:5px;">书名</th>
                <th style="text-align:left;width:15%;padding:5px;">来源</th>
                <th style="text-align:left;width:25%;padding:5px;">缺失数据</th>
                <th style="text-align:left;width:20%;padding:5px;">操作</th>
              </tr>
            </thead>
            <tbody>
        `;

    books.forEach((book, index) => {
      const sourceText = book.source === "douban" ? "豆瓣" : "Google Books";
      const bookLink =
        book.source === "douban" ? `https://book.douban.com/subject/${book.id}` : `https://books.google.com/books?id=${book.id}`;

      const missingData = [];
      if (!book.authors) missingData.push("作者");
      if (!book.publisher) missingData.push("出版社");
      if (!book.publishedDate) missingData.push("出版日期");
      if (!book.pageCount) missingData.push("页数");
      if (!book.isbn) missingData.push("ISBN");
      if (!book.imageLink) missingData.push("图片");
      if (!book.description) missingData.push("简介");
      if (!book.authorIntro) missingData.push("作者简介");

      const missingDataText = missingData.length > 0 ? missingData.join(", ") : "无";

      tableHTML += `
            <tr style="background-color:${index % 2 === 0 ? "#f8f9fa" : "#ffffff"};">
              <td style="padding-left:5px;padding-right:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${
                book.title
              }">${book.title}</td>
              <td style="padding-left:5px;padding-right:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sourceText}</td>
              <td style="padding-left:5px;padding-right:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${missingDataText}">${missingDataText}</td>
              <td style="padding-left:5px;padding-right:5px;">
                <a class="fill-info" data-index="${index}" style="text-decoration:underline;color:#28a745;cursor:pointer;margin-right:10px;">填充信息</a>
                <a href="${bookLink}" target="_blank" style="text-decoration:underline;color:#007bff;">查看详情</a>
              </td>
            </tr>
          `;
    });

    tableHTML += `
            </tbody>
          </table>
        `;

    divElement.innerHTML += tableHTML;

    // 添加事件监听器
    const fillInfoLinks = divElement.querySelectorAll(".fill-info");
    fillInfoLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        const index = parseInt(event.target.getAttribute("data-index"));
        insert(index);
      });
    });
  }

  function createBookValue(book) {
    let value = "\n";
    if (book.authors && book.authors.length) value += `作者: ${book.authors.join("&")}\n`;
    if (book.publisher) value += `出版社: ${book.publisher}\n`;
    if (book.publishedDate) value += `出版年: ${book.publishedDate.split("-")[0]}\n`;
    if (book.pageCount) value += `页数: ${book.pageCount}\n`;
    if (book.isbn) value += `ISBN: ${book.isbn}\n\n`;
    if (book.description) value += `内容简介: \n  ${book.description}\n\n`;
    if (book.authorIntro) value += `作者简介: \n  ${book.authorIntro}\n\n`; // 添加作者简介
    return value;
  }

  function createLoadingOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        `;

    const spinner = document.createElement("div");
    spinner.style.cssText = `
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        `;

    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
  }

  function removeLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.remove();
    }
  }

  function addSpinAnimation() {
    const style = document.createElement("style");
    style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
    document.head.appendChild(style);
  }

  function insert(id) {
    var urlString = window.location.href;
    var url = new URL(urlString);
    var type = url.searchParams.get("type");
    var book = JSON.parse(sessionStorage.getItem("books"))[id];

    createLoadingOverlay();

    var author = book.authors ? (Array.isArray(book.authors) ? book.authors.join("&") : book.authors) : "";
    var pubdate = book.publishedDate ? book.publishedDate.split("-")[0] : "";
    var publisher = book.publisher || "";
    var isbn = book.isbn || "";
    var bookId = book.id || "";

    var pic_url = "";
    var values = JSON.parse(sessionStorage.getItem("values"))[id];

    if (book.imageLink) {
      uploadImg(book.imageLink)
        .then((uploadedImageUrl) => {
          pic_url = uploadedImageUrl;
          values = "[img]" + pic_url + "[/img]" + values;
          document.querySelector('textarea[name="descr"]').value = values;
          fillOtherFields();
          removeLoadingOverlay();
        })
        .catch((error) => {
          console.error("图片上传或处理过程中发生错误:", error);
          document.querySelector('textarea[name="descr"]').value = values;
          fillOtherFields();
          removeLoadingOverlay();
        });
    } else {
      document.querySelector('textarea[name="descr"]').value = values;
      fillOtherFields();
      removeLoadingOverlay();
    }

    function fillOtherFields() {
      document.querySelector('input[name="author"]').value = author;
      document.querySelector('input[name="publisher"]').value = publisher;
      document.querySelector('input[name="year"]').value = pubdate;
      document.querySelector('input[name="ftype"]').value = type?type.toUpperCase():'【请自行填写】';
      document.querySelector('input[name="isbn"]').value = isbn;
      document.querySelector('input[name="pt_gen"]').value =
        book.source === "douban" ? "https://book.douban.com/subject/" + bookId : "https://books.google.com/books?id=" + bookId;
    }
  }

  function uploadImg(imageUrl) {
    console.log("开始上传图片，URL:", imageUrl);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: imageUrl,
        responseType: "blob",
        onload: function(response) {
          console.log("成功获取图片");
          const blob = response.response;
          const formData = new FormData();
          formData.append("file", blob, "image.jpg");

          // 使用 fetch 上传到 img.xingtan.one
          fetch("https://img.xingtan.one/api/v1/upload", {
            method: "POST",
            body: formData,
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`上传图片失败: ${response.status} ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.status) {
              const uploadedImageUrl = data.data.links.url;
              console.log("图片上传成功，URL:", uploadedImageUrl);
              resolve(uploadedImageUrl);
            } else {
              throw new Error("图片上传失败: " + data.message);
            }
          })
          .catch(error => {
            console.error("上传过程中发生错误:", error);
            reject(error);
          });
        },
        onerror: function(error) {
          console.error("获取图片时出错:", error);
          reject(error);
        }
      });
    });
  }

  function handleTorrentsPage() {
    const rowsXPath = '//table[@class="torrents"]/tbody/tr';
    const rowsResult = document.evaluate(rowsXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    if (rowsResult.snapshotLength === 0) {
      console.log('未找到符合条件的表格行.');
      return;
    }

    console.log('正在筛选可使用豆瓣信息填充的条目.');
    
    processRows(0);

    function processRows(startIndex) {
      if (startIndex >= rowsResult.snapshotLength) {
        console.log('所有条目处理完毕.');
        return;
      }

      const endIndex = Math.min(startIndex + 3, rowsResult.snapshotLength);
      const promises = [];

      for (let i = startIndex; i < endIndex; i++) {
        const row = rowsResult.snapshotItem(i);
        const titleXPath = './/a[@title]';
        const titleElement = document.evaluate(titleXPath, row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        if (!titleElement) continue;


        const originalTitle = titleElement.getAttribute('title');
        const cleanedTitle = cleanBookTitle(originalTitle);

        console.log('正在搜索:', originalTitle);
        
        // 添加搜索中标志
        const searchingBadge = addBadge(titleElement, '搜索中', '#007bff');
        
        const promise = searchDoubanBook(cleanedTitle)
          .then(result => {
            // 移除搜索中标志
            searchingBadge.remove();
            
            if (result.multipleMatches) {
              // 添加多个结果标志
              addMultipleMatchesBadge(titleElement);
            } else if (result.bookInfo && isCompleteBookInfo(result.bookInfo)) {
              addCompleteBadge(titleElement);
            } else {
              // 添加不完整标志
              addIncompleteBadge(titleElement);
            }
          })
          .catch(error => {
            console.error('搜索书籍信息时出错:', error);
            // 移除搜索中标志
            searchingBadge.remove();
            // 添加错误标志
            addErrorBadge(titleElement);
          });

        promises.push(promise);
      }

      Promise.all(promises).then(() => {
        setTimeout(() => processRows(endIndex), 100);
      });
    }
  }

  async function searchDoubanBook(title) {
    const doubanUrl = `https://api.douban.com/v2/book/search?q=${encodeURIComponent(title)}&apikey=0ac44ae016490db2204ce0a042db2916`;
    
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: doubanUrl,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            const books = data.books || [];
            const exactMatches = books.filter(book => book.title === title);
            
            if (exactMatches.length > 1) {
              resolve({ multipleMatches: true });
            } else if (exactMatches.length === 1) {
              resolve({ bookInfo: exactMatches[0] });
            } else {
              resolve({ bookInfo: null });
            }
          } catch (error) {
            reject(error);
          }
        },
        onerror: function (error) {
          reject(error);
        },
      });
    });
  }

  function isCompleteBookInfo(book) {
    return book.author && 
           book.publisher && 
           book.pubdate && 
           book.pages && 
           book.isbn13 && 
           book.image && 
           book.summary;
  }

  function addBadge(element, text, backgroundColor) {
    const badge = document.createElement('span');
    badge.textContent = text;
    badge.style.cssText = `
      background-color: ${backgroundColor};
      color: white;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 12px;
      margin-left: 5px;
    `;
    element.parentNode.insertBefore(badge, element.nextSibling);
    return badge;
  }

  function addCompleteBadge(element) {
    addBadge(element, '完整', '#28a745');
  }

  function addIncompleteBadge(element) {
    addBadge(element, '不完整', '#ffc107');
  }

  function addErrorBadge(element) {
    addBadge(element, '错误', '#dc3545');
  }

  function addMultipleMatchesBadge(element) {
    addBadge(element, '多个结果', '#17a2b8');
  }

  function handleUserDetailsPage() {
    function processKaDivs() {
      const kaDivs = document.querySelectorAll('div[id^="ka"]');
      if (kaDivs.length === 0) return;

      kaDivs.forEach(kaDiv => {
        if (kaDiv.style.display === 'none') return;

        const table = kaDiv.querySelector(':scope > table');
        if (!table) return;

        const links = Array.from(table.querySelectorAll('tbody tr a[title]'));
        
        // 创建一个处理链接的队列
        const processLinks = (linkQueue) => {
          if (linkQueue.length === 0) return;

          const batch = linkQueue.slice(0, 3);
          const remainingLinks = linkQueue.slice(3);

          Promise.all(batch.map(link => processLink(link)))
            .then(() => {
              // 处理完一批后，等待1秒再处理下一批
              setTimeout(() => processLinks(remainingLinks), 1000);
            });
        };

        // 处理单个链接的函数
        const processLink = (link) => {
          return new Promise((resolve) => {
            const href = link.getAttribute('href');
            const fullUrl = `https://xingtan.one/${href}`; // 构建完整的 URL

            GM_xmlhttpRequest({
              method: "GET",
              url: fullUrl, // 使用完整的 URL
              onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                
                const tagsTd = doc.evaluate(
                  "//td[normalize-space(text())='标签']",
                  doc,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                if (!tagsTd) {
                  resolve();
                  return;
                }

                const contentTd = tagsTd.nextElementSibling;
                if (!contentTd) {
                  resolve();
                  return;
                }

                const fragment = document.createDocumentFragment();
                Array.from(contentTd.children).forEach(child => {
                  const clonedChild = child.cloneNode(true);
                  fragment.appendChild(clonedChild);
                });
                
                const br = link.parentNode.querySelector('br');
                if (br && br.nextSibling) {
                  br.parentNode.insertBefore(fragment, br.nextSibling);
                } else {
                  link.parentNode.appendChild(fragment);
                }
                resolve();
              },
              onerror: function(error) {
                console.error('获取页面内容时出错:', error);
                resolve();
              }
            });
          });
        };

        // 开始处理链接队列
        processLinks(links);
      });
    }

    // 初始执行
    processKaDivs();

    // 创建一个 MutationObserver 来监视所有 kaDiv 的 style 属性变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          processKaDivs();
        }
      });
    });

    // 查找所有 kaDiv 并开始观察
    const kaDivs = document.querySelectorAll('div[id^="ka"]');
    kaDivs.forEach(kaDiv => {
      observer.observe(kaDiv, { attributes: true, attributeFilter: ['style'] });
    });
  }

  // 插入必须元素
  addSpinAnimation();

  // 获取当前页面的链接
  var currentUrl = window.location.href;
  // 判断链接是否包含 "details.php"
  if (currentUrl.includes("details.php")) {
    handleDetailsPage();
  }
  // 判断链接是否包含 "edit.php"，判断是否是编辑页面
  if (currentUrl.includes("edit.php")) {
    handleEditPage();
  }
  // 判断链接是否包含 "torrents.php" 且搜索内容包含 LM-AUTO-BOT
  if (currentUrl.includes("torrents.php")) {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search && search.includes('LM-AUTO-BOT')) {
      handleTorrentsPage();
    }
  }
  // 判断链接是否包含 "userdetails.php"
  if (currentUrl.includes("userdetails.php")) {
    handleUserDetailsPage();
  }
})();