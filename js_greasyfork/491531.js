// ==UserScript==
// @name         微信公众号插件
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  微信公众号使用插件
// @author       Maotou
// @match        https://*mp.weixin.qq.com/*
// @license      MIT
// @icon         null
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/491531/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491531/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {

  // 创建节点
  const svg_html = `<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;display:block" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3817"><path d="M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88zM448.18432 230.94272c176.98304-53.95968 267.17696 110.98624 267.17696 110.98624-32.59392-17.78176-130.39104-37.53472-235.09504 16.7936s-126.4384 172.87168-126.4384 172.87168c-42.56256-45.4144-44.4928-118.6304-44.4928-118.6304 5.03296-137.41568 138.84928-182.02112 138.84928-182.02112zM393.50784 796.42112c-256.12288-49.6384-197.85216-273.38752-133.81632-371.95264 0 0-2.88256 138.13248 130.22208 214.4 0 0 15.82592 7.1936 10.79296 30.21312l-5.03808 29.49632s-6.656 20.1472 6.02624 22.30272c0 0 4.04992 0 13.39904-6.4768l48.92672-32.37376s10.07104-7.1936 23.01952-5.03808c12.94848 2.16064 95.68768 23.74656 177.70496-44.60032-0.00512 0-15.10912 213.67296-271.23712 164.02944z m256.8448-19.42016c16.54784-7.9104 97.1264-102.8864 58.98752-231.66464s-167.6288-157.55776-167.6288-157.55776c66.19136-28.0576 143.89248-7.19872 143.89248-7.19872 117.9904 34.5344 131.6608 146.77504 131.6608 146.77504 23.01952 200.71936-166.912 249.64608-166.912 249.64608z" fill="#01CC7A" p-id="3818"></path></svg>`

  const createContainer = () => {
    // 创建外层容器 div
    let gxhDiv = document.createElement("div");
    gxhDiv.id = "gxh";

    // 创建图标与文字容器 div
    let iconTextContainerDiv = document.createElement("div");
    iconTextContainerDiv.id = "gxhIconContainer";

    let iconContainerDiv = document.createElement("div");
    let textContainerDiv = document.createElement("div");
    // 创建图标元素 svg
    iconContainerDiv.classList.add("iconImage");
    iconContainerDiv.style.fontSize = "48px";
    iconContainerDiv.innerHTML = svg_html;
    iconContainerDiv.onclick = explandToggle;
    // iconContainerDiv.onclick=""
    // 创建文字元素 svg
    textContainerDiv.classList.add("program_txt","common", "card");
    textContainerDiv.textContent= "GZH-Downloader";
    
    // 将图标与文字元素添加到图标容器中
    iconTextContainerDiv.appendChild(iconContainerDiv);
    iconTextContainerDiv.appendChild(textContainerDiv);
    
    gxhDiv.appendChild(iconTextContainerDiv);

    document.body.appendChild(gxhDiv);

    return gxhDiv;
  };

 // 创建按钮的辅助函数
  const createButton = (id, text, onClick, ...args) => {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = "btnContainer";
    buttonContainer.classList.add("common", "card");

    const button = document.createElement('span');
    button.classList.add("text");
    button.id = id;
    button.textContent = text;
    button.addEventListener('click', () => onClick(...args));
    buttonContainer.appendChild(button);
    return buttonContainer;
  };  

  const exclusionButton = ["gxhIconContainer", "About"];

  const updateContainer = buttons => {
      let container = document.getElementById('gxh');
      if (!container) {
          container = createContainer();
      }
      
      // 移除除了 imgTextContainer 以外的所有子元素
      Array.from(container.children).forEach(child => {
          if (!exclusionButton.includes(child.id)) {
              child.remove();
          }
      });

      // 添加可使用的按钮
      buttons.forEach(button => {
          container.appendChild(button);
      });
  };

  let currentUrl = window.location.href;

  // 设置 MutationObserver 来监听 URL 变化
  let observer = new MutationObserver(function () {
      if (currentUrl !== window.location.href) {
          currentUrl = window.location.href;
          run(currentUrl);
      }
  });

  const config = {childList: true, subtree: true};

  observer.observe(document.body, config);

  // 样式修改
  const ghxStyle = `
  #gxh {
    position: fixed;
    bottom: 20%;
    padding: 5px 10px;
    right: -200px; 
    display: flex;
    align-items: flex-end;
    border-radius: 8px;
    transition: all 0.25s ease-in-out;
    white-space: nowrap;
    text-align: center;
    flex-direction: column-reverse;
    z-index: 99999;
    color: #000;
  }

  .iconImage{
    cursor: pointer;
  }

  .card {
    background-color: #FFF;
    height: 48px;
    line-height: 48px;
  }

  .common {
    width: 180px;
    cursor: pointer;
  }

  #gxhIconContainer {
    display: flex;
    align-items: center;
    right: 60px;
  }

  #gxhIconContainer .program_txt {
    font-weight: bold;
    margin-left: 14px;
    cursor: context-menu;
    border-radius: 6px;
    border: 2px #FFF solid;
  }

  #btnContainer {
    border: 3px #3ccb7d solid;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 0;
    user-select: none;
  }

  #btnContainer:active {
    zoom:0.98;
    background: #25e42f21;
  }

  #btnContainer .text {
    font-size: 16px;
    font-weight: 600;
    color: #3ccb7d;
    border: 0;
    background-color: transparent;
  }
  `;

  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);

  style.type = 'text/css';
  style.appendChild(document.createTextNode(ghxStyle));


  // js函数部分

  let expland = false;
  const explandToggle = () =>{
    var element = document.querySelector('#gxh');
    element.style.right = !expland ? '0px' :'-200px';
    expland = !expland;
  }


  // 异常提示
  const abnormal = () => {
    alert("提取本文图片下载地址失败！请及时告知作者修复！");
  };

  // 工具， 防抖
  const debounce = (fn, delay) =>{
    let timer = null;
    return (...args) =>{
      if(timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    }
  }

  // 工具， 监听
  const watch = (obj, prop, callback) =>{
    let value = obj[prop]; // 获取初始值
    // 将 value 绑定到 window 对象上
    Object.defineProperty(obj, prop, {
      get: function() {
        return value;
      },
      set: function(newValue) {
        value  = newValue;
        // 在属性被设置时执行回调函数
        callback(newValue);
      }
    });
  }
  
  // 获取图片地址
  const getImagesUrl = () =>{
    const meunPageType = ["mmbizwap:pages/common_share.html", "mmbizwap:appmsg/newindex.html"]
    let urls = [];
    switch (meunPageType.indexOf(unsafeWindow.PAGE_MID)) {
      case 0:
        urls = unsafeWindow.picture_page_info_list.map(item =>{
          return item.cdn_url;
        });
        break;
      case 1:
        var images = Array.from(unsafeWindow.document.images);
        urls = images.filter(item =>{
          if(item.className.includes("rich_pages wxw-img")){
            return item;
          } 
        }).map(item => item.dataset.src);
        break;
      default:
        break;
    }

    return urls;
  }

  // 获取文章标题
  const getMsgTitle = () =>{
    const name = unsafeWindow.msg_title;
    return name;
  }
  let ImageData = {
    hasDownload : false,
    imageUrls:[],
    articleTitle:"",
    orginDownloadText:"",
    downloadResult:[],
  }
  // 提取下载链接
  const extractDownloadLinks = () => {
    ImageData.imageUrls = getImagesUrl();
    ImageData.articleTitle = getMsgTitle();
    let buttonDownload = document.querySelector("#Download");
    ImageData.orginDownloadText = buttonDownload.textContent;
    buttonDownload.textContent = buttonDownload.textContent + ImageData.imageUrls.length + "张";
  };

  const downloadImages = async () =>{
   let urls =  ImageData.imageUrls;
   let name = ImageData.articleTitle;
   if(ImageData.hasDownload) {
      alert("正在下载中....")
      return ;
    }
   if (urls.length) {
      await downloadImage(urls, name);
    } else {
      abnormal();
    }
  }

  // 下载图片
  const downloadImage = async (urls, name) => {
    let result = [];
    ImageData.hasDownload = true;
    for (const [index, url] of urls.entries()) {    
      let res = await downloadFile(url, `${name}_${index + 1}.png`);
      result.push(res);
    }

    let downFileTimer = null;
    downFileTimer = setTimeout(() => {
      ImageData.downloadResult = result;
      ImageData.hasDownload = false;
      clearTimeout(downFileTimer);
    }, 1000);

    if (!result.every(item => item === true)) {
        abnormal();
    }
  };
  // 关于
  const about = ()=>{
    alert(`
      关于 GZH-Downloader 用户脚本的功能说明：
      1. 下载文件时，脚本需要花费时间处理文件，请等待片刻，切勿多次点击下载按钮
    `);
  }

  // 下载文件
  const downloadFile = async (link, filename) => {
      try {
          // 使用 fetch 获取文件数据
          let response = await fetch(link);

          // 检查响应状态码
          if (!response.ok) {
              console.error(`请求失败，状态码: ${response.status}`, response.status);
              return false
          }

          let blob = await response.blob();

          // 创建 Blob 对象的 URL
          let blobUrl = window.URL.createObjectURL(blob);

          // 创建一个临时链接元素
          let tempLink = document.createElement('a');
          tempLink.href = blobUrl;
          tempLink.download = filename;

          // 模拟点击链接
          tempLink.click();

          // 清理临时链接元素
          window.URL.revokeObjectURL(blobUrl);

          return true
      } catch (error) {
          console.error(`下载失败 (${filename}):`, error);
          return false
      }
  }

  // 按钮与函数结合处
  const buttons = [
    createButton("Download", "下载本文图片", debounce(downloadImages, 800)),
    createButton("About", "关于", about),
  ]

  console.log("开启监听");
  // 开启监听
  watch(ImageData,"hasDownload", function(newValue) {
    console.log('hasDownload 变化了：', newValue);
    let buttonDownload = document.querySelector("#Download");
    if(newValue){
      buttonDownload.textContent = "下载中....";
    }else {
      console.log(ImageData.downloadResult);
      const countTrue = ImageData.downloadResult.filter(element => element === true).length;
      buttonDownload.textContent = `共${ImageData.imageUrls.length}张，下载${countTrue}张`;
      
      let downFileBeforeTimer = null;
      downFileBeforeTimer = setTimeout(() => {
        buttonDownload.textContent = ImageData.orginDownloadText;
        clearTimeout(downFileBeforeTimer);
      }, 2000);
      
    }
  })


  const init = () =>{
    // 获取图片的下载链接
    extractDownloadLinks();
  }

  // 启动函数
  const run = url => {
    updateContainer(buttons);
    init();
  }

  //  启动
  run(currentUrl)
})();



