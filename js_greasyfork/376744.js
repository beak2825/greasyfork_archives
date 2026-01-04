// ==UserScript==
// @name         Parse coursehunters video link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解析视频链接
// @author       scottluo
// @match        https://coursehunters.net/course/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376744/Parse%20coursehunters%20video%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/376744/Parse%20coursehunters%20video%20link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 下载文件
  function download(filename, text) {
    var element = document.createElement('a');
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

  // 检测是否开放链接
  function checkIsOpen() {
    let block = document.querySelector('.standard-block_blue');
    return block ? false : true;
  }

  // 创建按钮
  function createButton(title, callback) {
    let button = document.createElement('button');
    button.innerHTML = title;
    button.setAttribute(
      'style',
      'border:1px solid black;margin-left:10px;border-radius:5px;font-size:16px;padding:5px;color:red;'
    );
    button.onclick = function() {
      callback();
    };
    let node = document.querySelector('.lessons-list__more');

    node.append(button);
  }

  // 获取文件名
  function getFileName() {
    let url = window.location.href;
    let index = url.lastIndexOf('/');
    return url.substring(index + 1);
  }

  // 处理链接
  function processLinks(isFileNameMapping) {
    const videoNameReg = /(\d+.+)/;
    let videoLinks = [];
    let contents = '';

    let links = document.querySelectorAll('.lessons-list__li');
    if (links.length > 0) {
      links.forEach(link => {
        let videoLink = link.querySelector("[itemprop='contentUrl'").href;
        let videoName = link.querySelector("[itemprop='name']").textContent;
        videoName = videoName.match(videoNameReg)[0];
        if (videoName) {
          videoName = videoName.replace(/\s+/g, '');
        }
        if (!isFileNameMapping) {
          videoLinks.push(`${videoLink}`);
        } else {
          let onlineFileName = processLink(videoLink);
          videoLinks.push(`${onlineFileName},${videoName}`);
        }
      });
    }
    if (videoLinks.length > 0) {
      videoLinks.forEach(link => {
        contents += `${link}\r\n`;
      });
    }
    return contents;
  }

  function processLink(link) {
    if (link) {
      let index = link.lastIndexOf('/');
      return link.substring(index + 1);
    }
  }

  if (checkIsOpen()) {
    createButton('下载链接', () => {
      download(getFileName() + '.txt', processLinks());
    });
    createButton('下载文件名映射', () => {
      download(getFileName() + '_mapping.txt', processLinks(true));
    });
  }
  // Your code here...
})();
