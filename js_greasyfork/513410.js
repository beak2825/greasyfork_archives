// ==UserScript==
// @name         oil-set-img
// @namespace    longslee-longslee
// @version      2024-10-21_01
// @description  google proxy
// @author       longslee
// @include      http*://admin-zc.zjcw.cn*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513410/oil-set-img.user.js
// @updateURL https://update.greasyfork.org/scripts/513410/oil-set-img.meta.js
// ==/UserScript==
(function() {
    function replaceImageSrc(img) {
        if (img.src.startsWith('https://test-zc.zjcw.cn/satellite/map/vt2/')) {
             //首先去掉一些参数
            var oldUrl = img.src;
            var newUrl = oldUrl.replace('https://test-zc.zjcw.cn/satellite/map/vt2/', 'https://mts.google.com/vt/') + '&v=968';
            const paramsToRemove = ["hl", "gl"];
            var brandNewUrl = removeQueryParams(newUrl, paramsToRemove); //解决Google偏移
            img.src = brandNewUrl;
            // img.src = img.src.replace('https://test-zc.zjcw.cn/satellite/map/vt2/', 'https://mts1.google.com/vt/') + '&v=968';
        }
    }

    function removeQueryParams(url, paramsToRemove) {
        const urlObj = new URL(url);
        paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
        return urlObj.toString();
    }

    // Replace src for all existing img elements
    Array.from(document.getElementsByTagName('img')).forEach(replaceImageSrc);

    // Observe changes to the DOM to catch new img elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    replaceImageSrc(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    node.querySelectorAll('img').forEach(replaceImageSrc);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Override the src attribute setter for img elements
    const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set: function(value) {
            if (value.startsWith('https://test-zc.zjcw.cn/satellite/map/vt2/')) {
                value = value.replace('https://test-zc.zjcw.cn/satellite/map/vt2/', 'https://mts.google.com/vt/') + '&v=968';
                const paramsToRemove = ["hl", "gl"];
                value = removeQueryParams(value, paramsToRemove); //解决Google 偏移
            }
            return originalDescriptor.set.call(this, value);
        }
    });





})();

/**
(function() {
    // ----
function processFenceMapRadioGroup(){
console.log('processFenceMapRadioGroup-----')
    const fenceMapDiv = document.getElementById('fenceMap');

    if (fenceMapDiv) {
        const radioGroup = fenceMapDiv.querySelector('.el-radio-group[role="radiogroup"]');

        if (radioGroup) {
            const labels = Array.from(radioGroup.querySelectorAll('label'));

            if (labels.length >= 4) {
                labels[1].style.display = 'none';
                const thirdLabel = labels[2];
                radioGroup.insertBefore(labels[3], thirdLabel);
            }
        }
    }
}


// 创建一个MutationObserver实例
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // 检查是否有新的节点被添加
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME') {
                    console.error('iiiiiiiifffffffrrrrrrmmmmmmmm')
                    // 监听iframe的加载完成事件
                    node.addEventListener('load', () => {
                        // 确保iframe的内容完全加载
                        const iframeDocument = node.contentDocument || node.contentWindow.document;
                        if (iframeDocument.readyState === 'complete') {
                            // 执行processFenceMapRadioGroup方法
                            processFenceMapRadioGroup();
                        }
                    });
                }
            });
        }
    }
});

// 选择需要观察变动的节点
const targetNode = document.body;

// 配置观察选项
const config = { childList: true, subtree: true };

// 开始观察
observer.observe(targetNode, config);

})();
**/

(function() {
    
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

   // 暂时打开高德
   /**
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url; // 保存请求的URL
        return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        sleep(100)
        this.addEventListener('load', function() {
            //if (this._url.startsWith('https://vdata.amap.com/nebula/v2?key=2700ddecdad8171ca6045bd98a52224c&flds=road') && this._url.length > 128) {
              if(startsWithPattern(this._url)){
                console.log('Request to https://vdata.amap.com/nebula/v2?key=2700ddecdad8171ca6045bd98a52224c&flds=road completed');
                // 在请求结束后执行的方法
                processFenceMapRadioGroup();
            }
        });
        return originalSend.apply(this, [body]);
    };
    **/

    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime) return;
        }
    }

    function startsWithPattern(str) {
    // 定义正则表达式
    const pattern = /^https:\/\/vdata[a-zA-Z0-9]+\.amap\.com\/nebula\/v2\?key=/;

    // 使用正则表达式进行匹配
    return pattern.test(str);
}


    function processFenceMapRadioGroup(){
        console.log('processFenceMapRadioGroup-----')
    const fenceMapDiv = document.getElementById('fenceMap');
    if (fenceMapDiv) {
        const radioGroup = fenceMapDiv.querySelector('.el-radio-group[role="radiogroup"]');

        if (radioGroup) {
            const labels = Array.from(radioGroup.querySelectorAll('label'));

            if (labels.length >= 4) {
                labels[1].style.display = 'none';
                const thirdLabel = labels[2];
                radioGroup.insertBefore(labels[3], thirdLabel);
            }

            /**
                 // Select the radio button under the second label
                const secondLabelRadio = labels[2].querySelector('span input[type="radio"]');
                if (secondLabelRadio) {
                    secondLabelRadio.checked = true;
                }

                // Deselect the radio button under the first label
                const firstLabelRadio = labels[0].querySelector('span input[type="radio"]');
                if (firstLabelRadio) {
                    firstLabelRadio.checked = false;
                }
                **/
        }
    }
}
    
})();