// ==UserScript==
// @name         tsadult-dl
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  tsadult post saver
// @author       You
// @match        https://*.tsadult.net/*/res/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsadult.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.8.0/jszip.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510377/tsadult-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/510377/tsadult-dl.meta.js
// ==/UserScript==


const CSS = `
  #dl-btn {
    position: fixed;
    bottom: 64px;
    right: 32px;
    font-size: 16pt;
    text-align: right;
  }
  #dl-msg {
   font-size: 12pt;
   color: black;
  }
`

function addDownloadButton() {
  let count = 0;
  const post = getPost();
  const imageTasks = post.filter(item => item.image != null);
  let downloading = false;

  const message = document.createElement('div');
  message.id = 'dl-msg';
  const printMessage = (msg) => { message.innerText = msg };
  printMessage(`image: (0/${imageTasks.length})`);

  const container = document.createElement('div');
  container.id = 'dl-btn';

  const button = document.createElement('button');
  button.innerText = '💾';
  button.onclick = async () => {
    if (downloading) return;
    downloading = true;
    
    try {
      const zip = new JSZip();
      await downloadImages(zip, imageTasks, count, printMessage);
      await createArticleContent(zip, post);
      await generateZipFile(zip, printMessage);
    } catch (error) {
      console.error('Download failed:', error);
      printMessage('Download failed!');
    } finally {
      downloading = false;
    }
  };
  
  container.appendChild(message);
  container.appendChild(button);
  return container;
}

async function downloadImages(zip, imageTasks, count, printMessage) {
  const tasks = imageTasks.map(async (item) => {
    const { name, url } = item.image;
    console.log('Downloading image:', item);
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(name, blob);
      count++;
      printMessage(`image: (${count}/${imageTasks.length})`);
    } catch (error) {
      console.error('Failed to download image:', name, error);
    }
  });
  
  return Promise.all(tasks);
}

async function createArticleContent(zip, post) {
  const article = post.map(item => item.content)
    .filter(content => content != null && content.length > 0)
    .join('\n\r---\n\r');
  
  zip.file('article.md', article);
}

async function generateZipFile(zip, printMessage) {
  const blob = await zip.generateAsync({ type: 'blob' });
  
  const download = document.createElement('a');
  document.body.appendChild(download);
  download.style.display = 'none';

  const postId = location.pathname.split('/').slice(-1)[0].replace('.html', '') ?? '';
  const fileName = `tsadult_${postId}_${new Date().getTime()}`;
  const fileUrl = window.URL.createObjectURL(blob);
  
  download.href = fileUrl;
  download.download = fileName;
  download.click();
  
  window.URL.revokeObjectURL(fileUrl);
  download.remove();
  
  printMessage('Download complete!');
}

// Helper functions for parser
function extractImageInfo(element, isOldFormat = false) {
  if (isOldFormat) {
    const img = element.querySelector('img');
    if (!img) return null;
    
    const url = new URL(img.parentElement.href, location.href).href.toString();
    const suffixIndex = url.lastIndexOf('/');
    const name = url.slice(suffixIndex + 1);
    
    return { url, name };
  } else {
    const url = new URL(element.href, location.href).href.toString();
    const name = element.innerText;
    
    return { url, name };
  }
}

function formatContent(text) {
  return text?.replace(/^#/gm, '> ') ?? '';
}

const parser = {
  old: function () {
    const convertTo = function (fragment) {
      let image = null;
      let content = formatContent(fragment.querySelector('.message')?.innerText);

      const imageInfo = extractImageInfo(fragment, true);
      if (imageInfo) {
        image = imageInfo;
        content = `![](${image.name})\n\n${content}`;
      }

      return { image, content };
    };
    
    const opPost = document.querySelector('.op');
    const tables = document.querySelectorAll('#posts > table');
    const contents = Array.from(tables).map(convertTo);
    
    return [convertTo(opPost), ...contents];
  },
  v2024: function () {
    const convertTo = function (fragment) {
      const imagesEle = fragment.querySelectorAll('.files .fileinfo > a');
      
      const images = Array.from(imagesEle)
        .map(element => {
          const image = extractImageInfo(element);
          const content = `![](${image.name})\n\n`;
          return { image, content };
        });

      const text = formatContent(fragment.querySelector('.body')?.innerText);
      return [...images, { image: null, content: text }];
    };

    const threadImagesEle = document.querySelectorAll('.thread > .files .fileinfo > a');
    const threadImages = Array.from(threadImagesEle)
      .map(element => {
        const image = extractImageInfo(element);
        const content = `![](${image.name})`;
        return { image, content };
      });
      
    const posts = Array.from(document.querySelectorAll('.thread > .post'))
      .map(convertTo)
      .flat();

    return [...threadImages, ...posts];
  }
};


/**
 * 根据网站版本选择合适的解析器
 * @returns {Array} 包含帖子内容和图片信息的数组
 */
function getPost() {
  const url = location.host;
  if (url.includes('2021')) {
    return parser.old();
  } else {
    return parser.v2024();
  }
}

(function () {
  'use strict';
  GM_addStyle(CSS);
  const button = addDownloadButton();
  document.body.appendChild(button);
})();