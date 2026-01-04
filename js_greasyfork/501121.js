// ==UserScript==
// @name         Rule34 art alternative gallery viewer 水果玉米系列
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  just for Rule34 art alternative gallery .
// @author       hzx
// @match        https://rule34.art/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.art
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501121/Rule34%20art%20alternative%20gallery%20viewer%20%E6%B0%B4%E6%9E%9C%E7%8E%89%E7%B1%B3%E7%B3%BB%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/501121/Rule34%20art%20alternative%20gallery%20viewer%20%E6%B0%B4%E6%9E%9C%E7%8E%89%E7%B1%B3%E7%B3%BB%E5%88%97.meta.js
// ==/UserScript==

class ToolBar{
    constructor()
    {
        this.toolBarWrapperEl = document.createElement('div');
        this.toolBarWrapperEl.id = "toolbar-wrapper";

        this.toolBarStatusEl = document.createElement('p');
        this.toolBarWrapperEl.appendChild(this.toolBarStatusEl);
        this.SetStatus("如果没有出现图片请等待")

        this.toolBarLines = [];

        this.AppendLine();

        
        document.body.appendChild(this.toolBarWrapperEl);

        AppendCss(
            `
            #toolbar-wrapper {
                position: fixed;
                z-index: 9999;

                left: 0;
                top: 0;
                margin: 0;

                padding: 15px 20px;
                padding-top: 15px;
                padding-left: 5px;
                padding-bottom: 5px;

                background: #82bd45;
                overflow: hidden;
                visibility: hidden;
            }

            #toolbar-wrapper button {
                color: black;
                margin-left: 10px;
                padding: 10px 10px;
                margin-bottom: 10px;
            }

            #toolbar-wrapper p {
                color: white;
                margin-left: 10px;
                margin-bottom: 10px;
            }

            `);
        SetMovable(this.toolBarWrapperEl);

    }

    SetStatus(text)
    {
        this.toolBarStatusEl.innerHTML = text;
    }

    AppendFn(fn, text, line=0)
    {
        let btn = document.createElement('button');
        btn.innerText = text;
        this.toolBarLines[line].appendChild(btn);
        btn.onclick = ()=>{fn()};

        this.SetButtonsToMaxSize();
    }

    AppendLine()
    {
        let newLineEl = document.createElement('div');
        this.toolBarLines.push(newLineEl);
        this.toolBarWrapperEl.appendChild(newLineEl);

        return newLineEl;
    }

    ShowToolBar() {
        this.toolBarWrapperEl.style.visibility = "visible";
    }

    HideToolBar() {
        this.toolBarWrapperEl.style.visibility = "hidden";
    }

    SetButtonsToMaxSize() {
        let buttons = Array.from($QALL("#toolbar-wrapper button"));
        if (buttons.length === 0) return;
    
        // 找到最大的按钮
        let maxButton = buttons.reduce((max, button) => {
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;
            const maxWidth = max.offsetWidth;
            const maxHeight = max.offsetHeight;
    
            if (buttonWidth * buttonHeight > maxWidth * maxHeight) {
                return button;
            }
            return max;
        }, buttons[0]);
    
        // 获取最大的宽度和高度
        const maxWidth = maxButton.offsetWidth;
        const maxHeight = maxButton.offsetHeight;
    
        // 设置每个按钮的宽度和高度为最大的宽度和高度
        buttons.forEach(button => {
            button.style.width = `${maxWidth}px`;
            button.style.height = `${maxHeight}px`;
        });
    }
}

class Viewer{
    constructor()
    {
        let {img, imgWrapper} = Viewer.CreateCenteredImage();
        this.imgEle = img;
        this.imgWrapperEle = imgWrapper;
        this.toolbar = new ToolBar();

        // 用于加速阅读体验
        this.preImg = document.createElement('img');
        this.nextImg = document.createElement('img');

        this.preImg.style.visibility = "hidden";
        this.nextImg.style.visibility = "hidden";
        document.body.appendChild(this.preImg);
        document.body.appendChild(this.nextImg);

        this.imgWrapperEle.onclick = () => {
            this.HideImage();
        };

        SetMovable(this.imgEle);
        AppendCss(
            `
            #centered-img-wrapper {
            position: fixed;
            z-index: 999;

            left: 0;
            top: 0;
            margin: 0;

            display: flex;
            justify-content: center;
            align-items: center;

            height: 100vh;
            width: 100%;

            overflow: hidden;
            visibility: hidden;
        }

        `);

        this.toolbar.AppendFn(() => {this.DownloadImage()}, "下载图片");
        this.toolbar.AppendFn(() => {this.ResetImage()}, "重置图片位置");

    }

    static CreateCenteredImage() {
        let img  = document.createElement('img');
        let imgWrapper = document.createElement('div');

        img.src = "";
        imgWrapper.id = 'centered-img-wrapper';
        img.id = 'centered-img';
        imgWrapper.appendChild(img)
        document.body.appendChild(imgWrapper);

        // Center the image by adjusting its margin
        img.onload = function() {
            img.height = Math.floor(window.innerHeight * 0.93);
        };

        return {img, imgWrapper};
    }

    // Function to show the image
     ShowImage() {
        this.imgWrapperEle.style.visibility  = 'visible';
        this.toolbar.ShowToolBar()
    }

    // Function to hide the image
     HideImage() {
        this.imgWrapperEle.style.visibility  = 'hidden';
        this.toolbar.HideToolBar()
    }

    SetImage(src) {
        this.imgEle.src = src;
    }

    ResetImage() {
        this.imgEle.reset();
    }

    DownloadImage()  {
        GM_download({url:this.imgEle.src, name: getFileNameFromURL(this.imgEle.src)});
    }
}



let viewer = new Viewer();


function ChangeImage(el, note)
{
    if (el)
    {
        el.click();
        viewer.toolbar.SetStatus("工具栏可拖拽")
    }
    else 
    {
        viewer.toolbar.SetStatus(note)
    }
}

viewer.toolbar.AppendLine();
viewer.toolbar.AppendFn(()=>{
    ChangeImage(viewer.currentEl.previousElementSibling, "没有上一个了");
}, "上一个", 1);
viewer.toolbar.AppendFn(()=>{
    ChangeImage(viewer.currentEl.nextElementSibling, "没有下一个了");
}, "下一个", 1);

$QALL(".mfp-field .field--item").forEach(function(e) {
    e.onclick = function(event) {
        event.stopPropagation();
        event.preventDefault();
        viewer.SetImage(e.querySelector("a").href);
        viewer.ShowImage();
        viewer.currentEl = e;
        viewer.toolbar.SetStatus("如果图片没刷新请等待或是刷新网页")

        let preImg = e.previousElementSibling;
        
        if (preImg)
        {
            viewer.preImg.src = preImg.querySelector("a").href
        }

        let nextImg = e.nextElementSibling;
        if (nextImg)
        {
            viewer.nextImg.src = nextImg.querySelector("a").href
        }
        
    };
});

function getFileNameFromURL(url) {
    // 检查是否包含问号并去掉?及其后面的内容
    let cleanedUrl = url.includes('?') ? url.split('?')[0] : url;

    // 获取最后一个斜杠后的内容
    let fileName = cleanedUrl.substring(cleanedUrl.lastIndexOf('/') + 1);

    return fileName;
}

function SetMovable(Ele)
{
     let scale = 1;
      let originX = 0;
      let originY = 0;
      let isDragging = false;
      let startX, startY;

      Ele.addEventListener('wheel', (event) => {
          event.preventDefault();

          const rect = Ele.getBoundingClientRect();
          const offsetX = event.clientX - rect.left;
          const offsetY = event.clientY - rect.top;

          const delta = Math.sign(event.deltaY) * -0.1;
          const newScale = Math.min(Math.max(0.5, scale + delta), 3);

          originX = (originX - offsetX) * (newScale / scale) + offsetX;
          originY = (originY - offsetY) * (newScale / scale) + offsetY;

          scale = newScale;

          Ele.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
      });

      Ele.addEventListener('mousedown', (event) => {
        event.stopPropagation();
           event.preventDefault();
          isDragging = true;
          startX = event.clientX;
          startY = event.clientY;
          Ele.style.cursor = 'grabbing';
      });

      Ele.onclick = event => event.stopPropagation();

      window.addEventListener('mouseup', (event) => {
        event.stopPropagation();
           event.preventDefault();
          isDragging = false;
          Ele.style.cursor = 'grab';
      });

      window.addEventListener('mousemove', (event) => {
        event.stopPropagation();
           event.preventDefault();
          if (!isDragging) return;

          const dx = event.clientX - startX;
          const dy = event.clientY - startY;

          originX += dx;
          originY += dy;

          startX = event.clientX;
          startY = event.clientY;

          Ele.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
      });

      Ele.reset = function() {
          scale = 1;
          originX = 0;
          originY = 0;
          Ele.style.transform = `translate(0, 0) scale(${scale})`;
      }


}

function AppendCss(cssText)
{
    const css = document.createElement("style");
    css.innerHTML = cssText;
    document.head.prepend(css);
}

function $Q(selector) {
    let ele = document.querySelector(selector);
    if (ele == null) {
      return { style: {}, remove() {} };
    } else {
      return ele;
    }
}

function $QALL(query) {
    return document.querySelectorAll(query);
}
