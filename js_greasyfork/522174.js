// ==UserScript==
// @name         复制标题和地址
// @namespace    http://tampermonkey.net/
// @version      0.1.14
// @description  复制标题和地址，主要用于知乎、B站、微信公众号文章
// @author       longguzzz
// @match        *://*/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTklEQVQ4jY3TO0tcURQF4G/ixFdhCIg2qWysZPwDsUkXSJk2Qso0IpLOTtLERkGwEjQhXV5d0gkGK6v7E/IHgg9EHR0nHLLvzGHujGbB5pzLOXvttfc6twaNRiMta1g1GG28xJfyRlEU6rF/FskpjvA4o7nABD7gM17hY3lYEjzHOd4NqP8QW3gURA+wJzYJI2hV0rq4xtfsexdPcwW3EQmLaSw4wVCQr+M1DtDEJt7iVz1jLRUsB0GOn9iPymWRJ7mChOFY5ysNVFHrHaKwKWEGUyG1HZcnMY4/0UarH0Ez1u+Yq9T8h5tw5BTTg1p4EYfNnuR6WC3srCgo+/odcRdK+7ubrGIRvfeLq7hz3KsgESXPE97HDFKfOUazxLFegst4MAmf7pGfkP6NNNAOwTesYAM/YkgdrzOcYRYLeJMTHMbTTE926T8U7GAb/gI+kkP5n3CsvwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/522174/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E5%92%8C%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/522174/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E5%92%8C%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(async function () {
  'use msgict';
  const sleep = (delay) => {
      console.log("waiting...")
      return new Promise((resolve) => setTimeout(resolve, delay))
  };
  function createEle(eleName, text, attrs) {
    let ele = document.createElement(eleName);
    ele.innerText = text;
    for (let k in attrs) {
      ele.setAttribute(k, attrs[k]);
    }
    return ele;
  }

  let bgImgBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACrCAYAAACnkvYBAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTEwLTE1VDIwOjI3OjI3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0xMC0xNVQyMDozMzoxOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMC0xNVQyMDozMzoxOCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyZDcwNDNhYi0xMTI5LTZiNGEtOGE0YS1iMjlmOGUzYWFjNWMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MmQ3MDQzYWItMTEyOS02YjRhLThhNGEtYjI5ZjhlM2FhYzVjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MmQ3MDQzYWItMTEyOS02YjRhLThhNGEtYjI5ZjhlM2FhYzVjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZDcwNDNhYi0xMTI5LTZiNGEtOGE0YS1iMjlmOGUzYWFjNWMiIHN0RXZ0OndoZW49IjIwMjEtMTAtMTVUMjA6Mjc6MjcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4YNvjXAAAAFklEQVQoz2P4////aYZRYpQYJahIAAA5jYa39ndGVgAAAABJRU5ErkJggg==';

  function myAlert(timeStamp, address) {
    let bgElement = document.getElementById('bg-iVBORw0KGg');
    if (bgElement) {
      document.querySelector('#alert-box-iVBORw0KGg textarea').innerHTML = timeStamp + address;
      bgElement.style.display = 'block';
      return;
    }
    let bg = createEle('div', '', {
      id: 'bg-iVBORw0KGg',
      style: `width: 100%; height: 100%; position: fixed !important; top: 0; left: 0; z-index: 299; background-image: url(${bgImgBase64});`
    });
    // background: rgba(243,242,238,0.8) !important;
    let alertBox = createEle('div', '本网页不支持操作剪切板，请手动复制下方内容：', {
      id: 'alert-box-iVBORw0KGg',
      style: `position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 4px; padding: 20px 20px; width: 450px; background: #292A2D; color: #ffffff; line-height: 20px; z-index: 300; font-size: 12px; font-family: Microsoft YaHei;`
    });

    let msgBox = createEle('textarea', '', {
      style: `width: 100%; height: 80px; font-size: 12px !important; margin-top: 15px; resize: none; background: #292A2D; color: #ffffff; border: #292A2D; padding: 0px; outline: none;`
    });
    msgBox.innerHTML = timeStamp + address;

    let closeBtn = createEle('button', '关闭', {
      style: `width: 64px; height: 32px; float: right; margin-top: 15px; border: #799dd7; border-radius: 4px; background: #799dd7; outline: none;`
    });

    closeBtn.onclick = function () {
      bg.style.display = 'none';
    }
    alertBox.appendChild(msgBox);
    alertBox.appendChild(closeBtn);
    bg.appendChild(alertBox);
    document.body.appendChild(bg);
  }

  let btnStyle = `
  #copy-title-and-location {
    position: fixed; top: 100px; z-index: 2147483647;
    background-image: none; cursor:pointer; color: #fff; background-color: #0084ff !important;
    margin: 5px 0px; width: auto; border-radius: 3px; border: #0084ff; outline: none; padding: 3px 6px; height: 26px;
    font-family: Arial, sans-serif; font-size: 12px; transition: left, 0.5s;
    }
  #copy-title-and-location {right: 0px; opacity: 1;}
  #copy-title-and-location svg {width: auto; vertical-align: middle; margin-left: 10px; border-style: none;text-align: center;display: inline-block !important;margin-bottom: 2px;}`;
  let styleTag = createEle('style', btnStyle, { type: "text/css" });

  // 将按钮图标由原来的img改为了svg，以增强适应性，同时也将对svg的样式设置移到了上面的 btnStyle 中
  let iconSVG = '<?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M8 6C8 4.89543 8.89543 4 10 4H30L40 14V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V6Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M16 20H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 28H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  let btn = createEle('button', '', { id: "copy-title-and-location" });
  btn.innerHTML = iconSVG;

  btn.addEventListener('click', async () => {
    let date = new Date();
    let timeStamp = '更新：' + date.toLocaleDateString().replace('\/', '年').replace('\/', '月') + '日' + date.toLocaleTimeString('chinese', { hour12: false });
    let titleInfo = document.querySelector('title').innerText;
    let address="", supplement="\n"
    let url = location.toString()

    const hostname = location.hostname;
    const pathname = location.pathname;

    const digest = (selector)=> {
        let content = document.querySelector(selector)?.textContent.substring(0,100)
        return content? content + "...\n\n": "\n"
    };

    switch(hostname){
        // 匹配微信公众号的文章地址
        case "mp.weixin.qq.com": (()=>{
                let officialAccount = document.getElementById('js_name') || document.getElementById('js_wx_follow_nickname');
                let publishDate = document.getElementById('publish_time');
                publishDate.click();
                supplement = digest('#js_content');
                if (officialAccount.innerText == titleInfo) {titleInfo = document.querySelector('h1').innerText;}

                titleInfo = '【微信公众号：' + officialAccount.innerText + ' ' + publishDate.innerText + '】' + titleInfo;
            })();break;
        case "www.zhihu.com":(()=>{
                let author = document.querySelector("[itemprop='author'] meta[itemprop='name']").getAttribute("content");
                let author_id = document.querySelector("[itemprop='author'] meta[itemprop='url']").getAttribute("content").match(/(?<=people\/)(.*)/)[0];
                supplement = digest(".RichContent");
                titleInfo = `${titleInfo.replace("- 知乎","【知乎")}_${author}_id:${author_id}】`;
            })();break;
        case "zhuanlan.zhihu.com":(()=>{
                let author = document.querySelector("[itemprop='author'] meta[itemprop='name'").getAttribute("content");
                let author_id = document.querySelector("[itemprop='author'] meta[itemprop='url']").getAttribute("content").match(/(?<=people\/)(.*)/)[0];
                supplement = digest(".RichText");
                titleInfo = `${titleInfo.replace("- 知乎","【知乎")}_${author}_id:${author_id}】`;
            })();break;
        case "www.bilibili.com":
            if (pathname.startsWith("/video/")) {
                let staff = document.querySelector(".members-info-container .membersinfo-upcard .staff-name");
                let author = staff?.textContent || document.querySelector(".author")?.textContent.trim() || document.querySelector(".up-name").textContent.trim();
                let author_id = staff?.href.match(/(?<=.com\/)(.*)/)[0] || document.querySelector("[type='space']")?.id ||
                     document.querySelector(".up-name").href.match(/(?<=com\/).*?$/)[0] || "";
                let field_author_id = author_id!==""? `_id:${author_id}`: "";

                titleInfo = `${titleInfo.replace(/_哔哩哔哩_bilibili$/g,"【哔哩哔哩")}_${author}${field_author_id}】`;
                url = location.toString().match(/https:\/\/.*?.bilibili.com\/video\/[a-zA-Z0-9]*/)[0];
                supplement = digest("div.basic-desc-info");
            }
            break;
        case "m.bilibili.com":
            if (pathname.startsWith("/video/")) {
                document.querySelector('.dialog-close')?.click()
                document.querySelector('.main-info > .btn')?.click()
                let wait_times = 20
                while(!document.querySelector('.open-app-dialog .icon-close') && wait_times > 0){
                    await sleep(100);
                    wait_times -=1
                }
                if (wait_times > 0) {
                    try {
                    document.querySelector('.open-app-dialog .icon-close')?.click()
                    } catch(e) {debugger}
                }
                while(!document.querySelector('.author-wrapper > .author')){
                    await sleep(100);
                }
                let author = document.querySelector('.author-wrapper > .author').textContent;
                let author_id = document.querySelector('.author-wrapper').getAttribute("id");
                let field_author_id = author_id!==""? `_id:${author_id}`: "";

                titleInfo = `${titleInfo.replace(/_哔哩哔哩_bilibili$/g,"【哔哩哔哩")}_${author}${field_author_id}】`;
                url = location.toString().match(/https:\/\/.*?.bilibili.com\/video\/[a-zA-Z0-9]*/)[0];
                supplement = digest("div.basic-desc-info");
            }
            break;
        case "space.bilibili.com":
            break;
        default:
            break;
    }

    // try catch应对不能访问 navigator.clipboard 对象的问题
    let targetText = `[${titleInfo.replace(/\|/g, "_")}](${url})\n${supplement}`;
    try {
      navigator.clipboard.writeText(targetText);
    } catch (err) {
      console.log('当前页面不支持访问 navigator.clipboard 对象：' + err);
      myAlert(timeStamp, targetText);
    }
    btn.textContent = "✓";
  });

  // document.body.appendChild(style); // 这种写法会导致脚本在<iframe>标签的html文档的body标签也被选中
  // self === top 是用来判断当前页面是否是在<iframe>标签内，如果为true则表示不<iframe>标签内
  if (window.self === window.top) {
    if (document.querySelector('body')) {
      document.body.appendChild(btn);
      document.body.appendChild(styleTag);
    } else {
      document.documentElement.appendChild(btn);
      document.documentElement.appendChild(styleTag);
    }
  }
})();