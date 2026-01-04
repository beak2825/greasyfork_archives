// ==UserScript==
// @name         微信加密消息处理
// @namespace    http://tampermonkey.net/
// @version      1.0.2  
// @description  发送微信加密消息并还原网页中的加密字符
// @author       heiyu
// @match        https://*.qq.com/*
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://wechat.com&size=64
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512321/%E5%BE%AE%E4%BF%A1%E5%8A%A0%E5%AF%86%E6%B6%88%E6%81%AF%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/512321/%E5%BE%AE%E4%BF%A1%E5%8A%A0%E5%AF%86%E6%B6%88%E6%81%AF%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加密函数
    function encryptText(text) {
        return text.split('').map(char => {
            const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
            return binary.split('').map(bit => bit === '1' ? '\u2060' : '\u200C').join('');
        }).join(' ');
    }

    const originalButton = document.querySelector('a.btn.btn_send');
    if (originalButton) {
        originalButton.style.display = 'none'; // 隐藏原按钮

        // 创建新的红色按钮
        const newButton = document.createElement('button');
        newButton.textContent = '加密发送';
        newButton.style.backgroundColor = 'red';
        newButton.style.color = 'white';
        newButton.style.border = 'none';
        newButton.style.padding = '3px 20px';
        newButton.style.cursor = 'pointer';
        newButton.style.borderRadius = '5px';

        // 将新按钮插入到原按钮的位置
        originalButton.parentNode.insertBefore(newButton, originalButton.nextSibling);

        // 点击新按钮进行加密并替换内容
        newButton.addEventListener('click', () => {
            const editArea = document.getElementById('editArea');
            if (editArea) {
                const originalText = editArea.textContent; // 获取原始文本
                const encryptedText = encryptText(originalText); // 加密文本
                editArea.textContent = encryptedText; // 更新内容
                editArea.dispatchEvent(new Event('input')); // 触发 input 事件以更新绑定
            }
            originalButton.click(); // 触发原按钮的功能
        });
    }

    // 将二进制字符串转换为对应的字符
    function binaryToString(binary_string) {
        return binary_string.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    }

    // 解密函数
    function decryptText(encryptedText) {
        const zeroWidth1 = '\u2060';  // 隐藏字符代表1
        const zeroWidth0 = '\u200C';   // 隐藏字符代表0
        const binaryString = encryptedText.replace(new RegExp(zeroWidth1, 'g'), '1').replace(new RegExp(zeroWidth0, 'g'), '0');
        return binaryToString(binaryString);
    }

    // 替换网页中所有包含隐藏字符的文本节点
    function replaceTextWithDecrypted(node) {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const encryptedText = child.textContent;
                // 检查是否包含隐藏字符
                if (encryptedText.includes('\u2060') || encryptedText.includes('\u200C')) {
                    // 尝试解密文本
                    const decryptedText = decryptText(encryptedText);
                    // 替换文本内容
                    if (decryptedText) {
                        child.textContent = decryptedText;
                    }
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                replaceTextWithDecrypted(child);
            }
        });
    }

    // 在页面加载完成后执行替换
    window.addEventListener('load', function() {
        replaceTextWithDecrypted(document.body);
    });

    // 观察 DOM 变化以处理动态内容
    const observer = new MutationObserver(() => {
        replaceTextWithDecrypted(document.body);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 检测按下 Enter 键且未按下 Ctrl 键
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.ctrlKey) {
            event.preventDefault(); // 阻止默认行为
            alert('直接按下回车键发送的消息，将不进行加密！😭😭'); // 显示弹窗
        }
    });

})();

(function() {
    'use strict';

    // 监控DOM的变化，确保图片操作列表加载完成
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // 检查是否已经插入了目标操作列表
                let imgOprList = document.querySelector(".img_opr_list");
                if (imgOprList && !document.querySelector(".web_wechat_restore")) {
                    addRestoreButton(imgOprList);
                }
            }
        });
    });

    // 观察整个文档
    observer.observe(document.body, { childList: true, subtree: true });

    // 添加还原按钮的函数
    function addRestoreButton(imgOprList) {
        // 创建新的 <li> 元素
        let restoreLi = document.createElement("li");
        restoreLi.className = "img_opr_item";

        // 创建 <a> 标签
        let restoreLink = document.createElement("a");
        restoreLink.href = "javascript:"; // JavaScript 链接
        restoreLink.title = "解密还原";

        // 创建 <i> 图标元素
        let restoreIcon = document.createElement("i");
        restoreIcon.className = "web_wechat_restore"; // 自定义类名
        restoreIcon.textContent = "解密还原";

        // 绑定点击事件，执行解密还原操作
        restoreLink.addEventListener("click", function() {
            let img = document.querySelector("#img_preview");
            if (img) {
                showLoadingAnimation(); // 显示加载动画
                decryptAndReplaceImage(img);
            } else {
                alert("找不到要解密的图片");
            }
        });

        // 将 <i> 插入 <a>，并将 <a> 插入 <li>
        restoreLink.appendChild(restoreIcon);
        restoreLi.appendChild(restoreLink);

        // 添加样式，确保垂直居中对齐
        restoreLi.style.display = "inline-block"; // 确保 li 作为 inline-block 元素
        restoreLi.style.verticalAlign = "middle"; // 垂直居中

        restoreIcon.style.display = "inline-block"; // 确保图标作为 inline-block 元素
        restoreIcon.style.lineHeight = "60px"; // 设置与其他图标一致的高度，调整为你的页面实际高度

        // 将新的 <li> 添加到 <ul> 中
        imgOprList.appendChild(restoreLi);

        console.log("还原按钮已添加");
    }

    // 显示等待动画
    function showLoadingAnimation() {
        let loadingDiv = document.createElement("div");
        loadingDiv.id = "loading-animation";
        loadingDiv.style.position = "fixed";
        loadingDiv.style.top = "50%";
        loadingDiv.style.left = "50%";
        loadingDiv.style.transform = "translate(-50%, -50%)";
        loadingDiv.style.zIndex = "999999";
        loadingDiv.style.width = "80px";
        loadingDiv.style.height = "80px";
        loadingDiv.style.border = "10px solid #f3f3f3";
        loadingDiv.style.borderTop = "10px solid #3498db";
        loadingDiv.style.borderRadius = "50%";
        loadingDiv.style.animation = "spin 1s linear infinite";
        document.body.appendChild(loadingDiv);

        // 添加 CSS 动画
        const style = document.createElement("style");
        style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
        document.head.appendChild(style);
    }

    // 隐藏等待动画
    function hideLoadingAnimation() {
        let loadingDiv = document.getElementById("loading-animation");
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // 图片解密函数
    async function decryptAndReplaceImage(img) {
        // 创建一个新图片对象加载原始图片
        let newImg = new Image();
        newImg.crossOrigin = "Anonymous"; // 允许跨域获取图片数据
        newImg.src = img.src;

        newImg.onload = async function() {
            // 调用解密函数
            let decryptedBlob = await encryptImage(newImg);

            // 创建解密后的图片 URL
            let decryptedURL = URL.createObjectURL(decryptedBlob);

            // 替换图片的 src 属性为解密后的图片
            img.src = decryptedURL;
            hideLoadingAnimation(); // 隐藏加载动画
            console.log("图片已解密并替换");
        };

        newImg.onerror = function() {
            alert("图片加载失败，无法解密");
            hideLoadingAnimation(); // 隐藏加载动画
        };
    }

    // 调用的解密函数
    async function encryptImage(img) {
        return new Promise((resolve) => {
            let cvs = document.createElement("canvas");
            let ctx = cvs.getContext("2d");
            cvs.width = img.width;
            cvs.height = img.height;
            ctx.drawImage(img, 0, 0);
            let imgdata1 = ctx.getImageData(0, 0, img.width, img.height);
            let imgdata2 = ctx.createImageData(img.width, img.height);

            // 调用 dePE2 函数进行解密
            dePE2(imgdata1.data, imgdata2.data, img.width, img.height, 0.666);

            // 将解密后的数据放回 canvas
            ctx.putImageData(imgdata2, 0, 0);
            cvs.toBlob(resolve, "image/jpeg"); // 返回 Blob 对象
        });
    }

    // 解密算法函数
    function logistic(x, n) {
        let l = [x];
        n--;
        while (n-- > 0) {
            l.push(x = 3.9999999 * x * (1 - x));
        }
        return l;
    }

    function logisticmap(l) {
        return l.map((x, a) => [x, a]).sort(logisticmapsort).map(x => x[1]);
    }

    function logisticmapsort(a, b) {
        return a[0] - b[0];
    }

    function dePE2(arr1, arr2, w, h, k) {
        let arr3 = new Uint8Array(4 * w * h);
        let k1 = k;
        for (let i = 0; i < w; i++) {
            let list1 = logistic(k1, h);
            let list = logisticmap(list1);
            k1 = list1[list1.length - 1];
            for (let j = 0; j < h; j++) {
                let j2 = list[j];
                arr3[(i + j2 * w) * 4] = arr1[(i + j * w) * 4];
                arr3[(i + j2 * w) * 4 + 1] = arr1[(i + j * w) * 4 + 1];
                arr3[(i + j2 * w) * 4 + 2] = arr1[(i + j * w) * 4 + 2];
                arr3[(i + j2 * w) * 4 + 3] = arr1[(i + j * w) * 4 + 3];
            }
        }
        k1 = k;
        for (let j = 0; j < h; j++) {
            let list1 = logistic(k1, w);
            let list = logisticmap(list1);
            k1 = list1[list1.length - 1];
            for (let i = 0; i < w; i++) {
                let i2 = list[i];
                arr2[(i2 + j * w) * 4] = arr3[(i + j * w) * 4];
                arr2[(i2 + j * w) * 4 + 1] = arr3[(i + j * w) * 4 + 1];
                arr2[(i2 + j * w) * 4 + 2] = arr3[(i + j * w) * 4 + 2];
                arr2[(i2 + j * w) * 4 + 3] = arr3[(i + j * w) * 4 + 3];
            }
        }
    }

})();
(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取工具栏的 DOM 元素
        const toolbar = document.querySelector('.toolbar');

        if (toolbar) {
            // 创建一个新的 <a> 元素，用于容纳 SVG 图标
            const svgContainer = document.createElement('a');
            svgContainer.setAttribute('href', 'javascript:;'); // 添加链接行为
            svgContainer.setAttribute('title', '上传加密混淆图像');
            svgContainer.classList.add('custom-svg-icon'); // 可以添加自定义样式

            // 设置图标样式
            svgContainer.style.display = 'inline-block';
            svgContainer.style.width = '30px';
            svgContainer.style.height = '30px';
            svgContainer.style.verticalAlign = 'middle';

            // SVG 图标代码
            const svgIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-photo-up" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M15 8h.01" />
                  <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                  <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5" />
                  <path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526" />
                  <path d="M19 22v-6" />
                  <path d="M22 19l-3 -3l-3 3" />
                </svg>
            `;

            // 将 SVG 插入到 <a> 元素中
            svgContainer.innerHTML = svgIcon;

            // 点击事件，弹出文件选择对话框
            svgContainer.addEventListener('click', () => {
                let inputFile = document.createElement('input');
                inputFile.type = 'file';
                inputFile.accept = 'image/*';
                inputFile.onchange = async (event) => {
                    let file = event.target.files[0];
                    if (file) {
                        // 读取图片并加密
                        let img = new Image();
                        img.src = URL.createObjectURL(file);
                        img.onload = async () => {
                            let encryptedBlob = await encryptImage(img);
                            // 上传加密后的图片
                            uploadImage(encryptedBlob);
                        };
                    }
                };
                inputFile.click();
            });

            // 将新创建的 <a> 元素插入到工具栏中
            toolbar.appendChild(svgContainer);
        } else {
            console.error('Toolbar element not found');
        }

        // 图片加密函数（使用之前定义的逻辑）
        async function encryptImage(img) {
            return new Promise((resolve) => {
                let cvs = document.createElement("canvas");
                let ctx = cvs.getContext("2d");
                cvs.width = img.width;
                cvs.height = img.height;
                ctx.drawImage(img, 0, 0);
                let imgdata1 = ctx.getImageData(0, 0, img.width, img.height);
                let imgdata2 = ctx.createImageData(img.width, img.height);

                // 调用 enPE2 函数进行加密
                enPE2(imgdata1.data, imgdata2.data, img.width, img.height, 0.666);

                // 将加密后的数据放回 canvas
                ctx.putImageData(imgdata2, 0, 0);
                cvs.toBlob(resolve, "image/jpeg"); // 返回 Blob 对象
            });
        }

        // 上传图片到文件发送区域
        function uploadImage(blob) {
            let fileInput = document.querySelector('.web_wechat_pic input[type="file"]');
            if (fileInput) {
                let dataTransfer = new DataTransfer();
                let file = new File([blob], "encrypted_image.jpg", { type: "image/jpeg" });
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;

                // 模拟点击“图片和文件”按钮以上传图片
                let event = new MouseEvent('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            } else {
                console.error('File input not found');
            }
        }

        // 加密算法函数
        function logistic(x, n) {
            let l = [x];
            n--;
            while (n-- > 0) {
                l.push(x = 3.9999999 * x * (1 - x));
            }
            return l;
        }

        function logisticmap(l) {
            return l.map((x, a) => [x, a]).sort(logisticmapsort).map(x => x[1]);
        }

        function logisticmapsort(a, b) {
            return a[0] - b[0];
        }

        function enPE2(arr1,arr2,w,h,k){
        let arr3=new Uint8Array(4*w*h)
        let k1=k
        for(let j=0;j<h;j++){
          let list1=logistic(k1,w)
          let list=logisticmap(list1)
          k1=list1[list1.length-1]
          for(let i=0;i<w;i++){
            let i2=list[i]
            arr3[(i+j*w)*4  ]=arr1[(i2+j*w)*4  ]
            arr3[(i+j*w)*4+1]=arr1[(i2+j*w)*4+1]
            arr3[(i+j*w)*4+2]=arr1[(i2+j*w)*4+2]
            arr3[(i+j*w)*4+3]=arr1[(i2+j*w)*4+3]
          }
        }
        k1=k
        for(let i=0;i<w;i++){
          let list1=logistic(k1,h)
          let list=logisticmap(list1)
          k1=list1[list1.length-1]
          for(let j=0;j<h;j++){
            let j2=list[j]
            arr2[(i+j*w)*4  ]=arr3[(i+j2*w)*4  ]
            arr2[(i+j*w)*4+1]=arr3[(i+j2*w)*4+1]
            arr2[(i+j*w)*4+2]=arr3[(i+j2*w)*4+2]
            arr2[(i+j*w)*4+3]=arr3[(i+j2*w)*4+3]
          }
        }
      }
    });
})();
