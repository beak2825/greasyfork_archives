// ==UserScript==
// @name         DeepSeek问答图片下载
// @namespace    https://space.bilibili.com/1208812226
// @version      1.0.0
// @description  我是DeepSeek问答图片下载，很高兴见到你！
// @author       大王鹅鹅鹅
// @match        https://chat.deepseek.com/a/chat/s/*
// @match        https://chat.deepseek.com/a/chat/*
// @match        https://chat.deepseek.com/a/*
// @match        https://chat.deepseek.com/*
// @icon         https://chat.deepseek.com/deepseek-chat.jpeg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527829/DeepSeek%E9%97%AE%E7%AD%94%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/527829/DeepSeek%E9%97%AE%E7%AD%94%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function () {
    "use strict";

 document.addEventListener("keydown", function (event) {
 if (event.altKey && event.keyCode == 83) {//下载为markdown格式——快捷键：Ctrl+Alt+S
            if (event.ctrlKey) {
                downloadMD();
            }
        }
   });


})();


function generateTextImage(titleText, bodyText, {
  titleFontSize = 72,
  titleColor = '#000',
  titleLineHeight = 1.2,
  titleMargin = 40,
  bodyFontSize = 42,
  bodyColor = '#333',
  bodyLineHeight = 1.6,
  width = 1080,
  minHeight = 1920,
  padding = 60,
  blurRadius = 20
} = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 固定尺寸系统
  canvas.width = width;
  canvas.height = minHeight; // 初始高度
  canvas.style.width = `${width}px`;

  // 内容处理
  const safeTitle = titleText.trim() || '默认标题';
  const safeBody = bodyText.trim() || '默认内容';

  // 计算文本尺寸
  ctx.font = `bold ${titleFontSize}px Arial`;
  const titleMaxWidth = width - padding * 2;
  const wrappedDawangTitleeee = wrapText(ctx, safeTitle, titleMaxWidth, titleFontSize, titleLineHeight);

  ctx.font = `${bodyFontSize}px Arial`;
  const bodyMaxWidth = width - padding * 2;
  const wrappedBody = wrapText(ctx, safeBody, bodyMaxWidth, bodyFontSize, bodyLineHeight);

  // 计算最终高度
  const contentHeight = wrappedDawangTitleeee.textHeight + titleMargin + wrappedBody.textHeight;
  const finalHeight = Math.max(contentHeight + padding * 2, minHeight);
  canvas.height = finalHeight;

  // 生成不透明背景
  const bgdaCwangeeeanvas = createOpaqueBackground(width, finalHeight, blurRadius);

  // 绘制背景
  ctx.drawImage(bgdaCwangeeeanvas, 0, 0);

  // 添加毛玻璃效果
  ctx.filter = `blur(${blurRadius}px)`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(0, 0, width, finalHeight);

  // 绘制文本
  ctx.filter = 'none'; // 清除模糊效果
  ctx.fillStyle = titleColor;
  ctx.font = `bold ${titleFontSize}px Arial`;
  ctx.textBaseline = 'top';
  let titleY = Math.max((finalHeight - contentHeight) / 2, padding);
  wrappedDawangTitleeee.lines.forEach(line => {
    ctx.fillText(line, padding, titleY);
    titleY += titleFontSize * titleLineHeight;
  });

  ctx.fillStyle = bodyColor;
  ctx.font = `${bodyFontSize}px Arial`;
  let bodyY = titleY + titleMargin;

  wrappedBody.lines.forEach(line => {
    ctx.fillText(line, padding, bodyY);
    bodyY += bodyFontSize * bodyLineHeight;
  });

  downloadImage(canvas, safeTitle); // 传递标题用于命名
}

function createOpaqueBackground(width, height, blurRadius) {
  const mainCanvas = document.createElement('canvas');
  mainCanvas.width = width;
  mainCanvas.height = height;
  const ctx = mainCanvas.getContext('2d');

  // 生成基础渐变
  const angle = Math.random() * Math.PI * 2;
  const gradient = ctx.createLinearGradient(
    Math.cos(angle) * width * 1.2, // 扩展渐变区域
    Math.sin(angle) * height * 1.2,
    width * 0.5,
    height * 0.5
  );

  // 使用完全不透明颜色
  const hue1 = Math.random() * 360;
  const hue2 = (hue1 + 120) % 360;
  gradient.addColorStop(0, `hsl(${hue1}, 70%, 60%)`);
  gradient.addColorStop(1, `hsl(${hue2}, 70%, 60%)`);

  // 填充基础颜色
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 模糊处理
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurCtx = blurCanvas.getContext('2d');

  // 扩展模糊区域
  blurCtx.filter = `blur(${blurRadius}px)`;
  blurCtx.drawImage(mainCanvas, -blurRadius, -blurRadius, width + blurRadius * 2, height + blurRadius * 2);

  // 覆盖基础颜色确保不透明
  blurCtx.globalCompositeOperation = 'source-over';
  blurCtx.fillStyle = gradient;
  blurCtx.fillRect(0, 0, width, height);

  return blurCanvas;
}

function wrapText(ctx, text, maxWidth, fontSize, lineHeight) {
  const lines = [];
  const paragraphs = text.split('\n').filter(p => p);

  paragraphs.forEach(para => {
    let currentLine = '';
    for (const char of para) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
  });

  return {
    lines: lines.length ? lines : [' '],
    textHeight: lines.length * fontSize * lineHeight
  };
}

function downloadImage(canvas, title) {
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${title}.png`; // 使用标题作为文件名
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadMD() {
  const wFull = document.querySelector("#root");
  const wFullList = wFull.childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes;
  for (var i = 0; i < wFullList.length; i++) {
    var title = wFull.childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[i].innerText;
    var contentList = wFull.childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[i + 1].childNodes;
    var content = wFull.childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[i + 1].childNodes[contentList.length - 2].innerText;
    i++;
    generateTextImage(title, content, {
      titleFontSize: 80,
      titleColor: '#26374c',
      bodyFontSize: 36,
      bodyColor: 'rgba(38, 55, 76, 0.9)',
      blurRadius: 40,
      padding: 80
    });
  }
}

//下载图标
window.onload=function(){
    var svgDom= '<div style="cursor: pointer; position: fixed; top: 6rem;right: 6rem;z-index: 100000;"><svg t="1740145372667" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2647" width="32" height="32"><path d="M551.783587 591.158874 551.783587 249.237481 472.216413 249.237481 472.216413 591.160921 336.806397 455.740672 280.542976 512.00921 511.995395 743.448326 743.454978 512.00921 687.192579 455.740672Z" p-id="2648" data-spm-anchor-id="a313x.search_index.0.i2.45e53a81DgcsQA" class="" fill="#4d6bfe"></path><path d="M982.400045 313.280076c-25.713638-60.794621-62.521962-115.3921-109.403712-162.27385-46.880727-46.879704-101.477182-83.691097-162.272827-109.403712-62.950727-26.626427-129.811508-40.126906-198.727087-40.126906-68.915579 0-135.778406 13.500479-198.72811 40.126906-60.794621 25.712615-115.390054 62.524009-162.269757 109.403712-46.879704 46.88175-83.687004 101.479229-109.400642 162.27385-26.624381 62.951751-40.123836 129.813554-40.123836 198.727087 0 68.915579 13.499455 135.77636 40.123836 198.72504 25.713638 60.794621 62.520939 115.390054 109.400642 162.269757 46.879704 46.87868 101.475136 83.687004 162.269757 109.399619 62.949704 26.624381 129.811508 40.122813 198.72811 40.122813s135.777383-13.498432 198.727087-40.122813c60.795645-25.712615 115.3921-62.521962 162.272827-109.399619 46.880727-46.879704 83.689051-101.475136 109.403712-162.269757 26.625404-62.949704 40.124859-129.810484 40.124859-198.72504C1022.525927 443.093631 1009.025449 376.230804 982.400045 313.280076zM679.751097 909.096017c-53.122895 22.468734-109.563348 33.861202-167.754678 33.861202-58.182121 0-114.617457-11.392468-167.738305-33.861202-51.316759-21.703301-97.407494-52.780087-136.993071-92.363617-39.585577-39.58353-70.663386-85.672218-92.368734-136.986931-22.470781-53.119825-33.864272-109.556185-33.864272-167.738305 0-58.18826 11.394515-114.63076 33.864272-167.754678 21.705348-51.316759 52.783157-97.40954 92.368734-136.995117 39.584554-39.58353 85.675288-70.660316 136.992047-92.365664 53.120848-22.468734 109.556185-33.861202 167.738305-33.861202 58.19133 0 114.631784 11.392468 167.754678 33.861202 51.316759 21.705348 97.40647 52.782134 136.988977 92.365664s70.656223 85.676311 92.360548 136.995117c22.466688 53.121871 33.858132 109.563348 33.858132 167.754678 0 58.184167-11.391445 114.620527-33.858132 167.738305-21.704324 51.316759-52.77804 97.40647-92.359524 136.986931C777.157567 856.314906 731.067856 887.392716 679.751097 909.096017z" p-id="2649" data-spm-anchor-id="a313x.search_index.0.i0.45e53a81DgcsQA" class="" fill="#4d6bfe"></path></svg></div>';
    var newDiv = document.createElement("div");
    newDiv.innerHTML = svgDom;
    newDiv.addEventListener("click", () => {
      downloadMD();

    });
    document.body.append(newDiv);

};