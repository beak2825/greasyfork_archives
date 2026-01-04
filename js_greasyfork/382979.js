// ==UserScript==
// @name         extension for axure
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  axure 原型页面辅助
// @author       gkeeno
// @grant        none
// @run-at       document-idle
// @match        http://192.168.1.5:30032/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/382979/extension%20for%20axure.user.js
// @updateURL https://update.greasyfork.org/scripts/382979/extension%20for%20axure.meta.js
// ==/UserScript==

// axure增强
setTimeout(() => {
    if (self != top) return; // 不是顶层页面

    if (RP_VERSION && RP_VERSION <= 9) {
        loadFoldBtn(); // 折叠功能
        loadFolderTextClick(); // 给文件夹的整个元素加上点击即toggle的功能
    } else {
        console.warn('[extension for axure] 非axure页面或axure版本过高')
    }
}, 1000)

// TFS增强
setTimeout(() => {
    if (self != top) return; // 不是顶层页面

    if (TFS) {
        loadTFSImageImprove();
    } else {
        console.warn('[extension for axure] 非TFS页面')
    }
}, 1000)



// ******************************************************************************************* axure功能 BEGIN
function loadFolderTextClick() {
    // 所有文件夹元素
    const sitemapPageLinkContainers = document.querySelectorAll("div.sitemapPageLinkContainer");
    for (const div of sitemapPageLinkContainers) {
        const toggleBtn = div.querySelector(".sitemapPlusMinusLink")
        if (toggleBtn) {

            // 判断是可折叠的页面，可以不用处理（原本点击页面三角仅触发加载页面和折叠）
            //const toggleSibling = toggleBtn.nextElementSibling
            //if(toggleSibling && toggleSibling.querySelector('.sitemapPageIcon')) continue;

            // 给整个文件夹元素添加点击事件，点击时触发左边三角形按钮的点击
            div.addEventListener("click", function (e) {
                console.log("clicked")
                // 如果点击的是三角按钮本身，不需要处理，避免触发两次
                if (e.target === toggleBtn || toggleBtn.contains(e.target)) {
                    return;
                }
                e.stopPropagation();
                // 模拟点击三角形按钮
                toggleBtn.click();
            });

            // 设置鼠标样式为指针，提示用户可以点击
            div.style.cursor = "pointer";
        }
    }

    console.info('[extension for axure] 文件单击折叠已添加')
}
function loadFoldBtn() {

    const headerBtnMenu = document.querySelector("#sitemapToolbar"); // tips: 等1s后再添加较为安全（依据菜单数量）

    const foldMenuBtn = document.createElement("div");
    foldMenuBtn.title = "折叠菜单";
    foldMenuBtn.classList.add('sitemapToolbarButton');
    foldMenuBtn.textContent = '🧺';
    foldMenuBtn.onclick = function () {
        const userRes = prompt("从几级开始折叠？(最小为1级)", 2);
        if (!userRes) return;

        const level = Math.floor(Number(userRes));
        if (isNaN(level) || level < 0) return alert("必须输入正整数");
        foldLeftMenu(level);
    };

    if (headerBtnMenu) {
        headerBtnMenu.insertBefore(foldMenuBtn, headerBtnMenu.firstChild);
    }

    console.info('[extension for axure] 折叠按钮已添加')
}

function foldLeftMenu(level) {
    const leftMenuTree = document.querySelector("#sitemapTreeContainer > ul.sitemapTree");
    const levelFlag = {
        lvMax: 10,
        lvMin: level || 1,
        lvCur: 1,
        isExceed: function () {
            return this.lvCur > this.lvMax;
        },
        completeFold: function () {
            this.lvCur++;
        }
    };

    const nodeList = Array.from(leftMenuTree.querySelectorAll(":scope > .sitemapNode"));
    foldAllNodeByNodeList(nodeList, levelFlag, []);
}

function foldAllNodeByNodeList(nodeList, flag, foldCallBacks) {
    if (flag.isExceed()) {
        executedAllCallBacks(foldCallBacks);
        return;
    }

    const nextFoldNodeList = [];
    const needSkipLevel = isSkipLevel(flag);

    nodeList.forEach(node => {
        const subNodes = Array.from(node.querySelectorAll(":scope > ul > .sitemapNode"));
        nextFoldNodeList.push(...subNodes);

        if (!needSkipLevel) {
            foldCallBacks.push(() => foldNode(node));
        }
    });

    flag.completeFold();

    if (nextFoldNodeList.length === 0) {
        executedAllCallBacks(foldCallBacks);
        return;
    }

    foldAllNodeByNodeList(nextFoldNodeList, flag, foldCallBacks);
}

function foldNode(node) {
    const foldBtn = node.querySelector(":scope > div > div.sitemapPageLinkContainer .sitemapPlusMinusLink");
    if (!foldBtn) return;

    const isFolded = foldBtn.querySelector(".sitemapPlus");
    if (isFolded) return;

    foldBtn.click();
}

function executedAllCallBacks(arrCallBacks) {
    arrCallBacks.reverse().forEach(cb => cb());
}

function isSkipLevel(flag) {
    return flag.lvCur < flag.lvMin;
}
// ******************************************************************************************* axure功能 END

// ******************************************************************************************* TFS功能 BEGIN
function loadTFSImageImprove() {
    const iframes = document.querySelectorAll('iframe');

    // 遍历所有iframe
    iframes.forEach(iframe => {
        try {
            // 确保iframe已加载并且可以访问
            if (iframe.contentDocument) {
                // 给iframe中的所有图片添加点击事件
                addClickHooksToImages(iframe.contentDocument);

                // 给iframe添加load事件，以防iframe内容在后期加载
                iframe.addEventListener('load', function () {
                    try {
                        addClickHooksToImages(this.contentDocument);
                    } catch (e) {
                        console.warn('Error adding hooks to iframe on load:', e);
                    }
                });

                // 监视iframe内部DOM变化
                observeIframeChanges(iframe);
            }
        } catch (e) {
            // 处理跨域iframe的访问错误
            console.warn('[TFS Image Hook] Cannot access iframe content due to same-origin policy:', e);
        }
    });

    // 监听页面上动态添加的iframe
    observeDocumentForNewIframes();

    // 监听页面上的图片
    observePageImagesChanges();
    console.info('[extension for axure] TFS 富文本图片单击浏览已添加')
}

// 给指定文档中的所有图片添加点击事件
function addClickHooksToImages(doc) {
    if (!doc) return;
    const images = doc.querySelectorAll('img');


    images.forEach(img => {

        img.setAttribute('data-hook-added', 'true');

        // 添加鼠标悬停样式，表明图片可点击
        img.style.cursor = 'pointer';

        // 添加点击事件
        img.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 在这里实现您想要的点击功能
            // 例如：显示大图、复制图片链接等
            handleImageClick(this);
        });
    });
}
// 处理图片点击事件
function handleImageClick(img) {
    // 示例功能：在新窗口中打开大图
    const imgSrc = img.src;
    const imgAlt = img.alt || 'Image';

    // 创建一个模态框来显示大图
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';

    // 创建大图
    const largeImg = document.createElement('img');
    largeImg.src = imgSrc;
    largeImg.style.maxWidth = '90%';
    largeImg.style.maxHeight = '90%';
    largeImg.style.objectFit = 'contain';
    largeImg.alt = imgAlt;

    largeImg.dataset.hookAdded = 'true';

    // 创建关闭按钮
    const closeBtn = document.createElement('div');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '30px';
    closeBtn.style.cursor = 'pointer';

    // 点击模态框背景或关闭按钮时关闭
    modal.addEventListener('click', function () {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', escKeyHandler);
    });

    // 阻止点击图片时关闭模态框
    largeImg.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // 添加ESC键监听器退出大图
    const escKeyHandler = function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escKeyHandler);
        }
    };
    document.addEventListener('keydown', escKeyHandler);

    // 添加元素到模态框
    modal.appendChild(largeImg);
    modal.appendChild(closeBtn);

    // 添加模态框到页面
    document.body.appendChild(modal);
}


// 监视iframe内部DOM变化
function observeIframeChanges(iframe) {
    try {
        if (iframe.contentDocument) {
            const observer = new MutationObserver(function (mutations) {

                // DOM变化时，重新给所有图片添加点击事件
                addClickHooksToImages(iframe.contentDocument);
            });

            observer.observe(iframe.contentDocument.body, {
                childList: true,
                subtree: true
            });
        }
    } catch (e) {
        console.log('Cannot observe iframe content due to same-origin policy:', e);
    }
}
// 监视页面上动态添加的iframe
function observeDocumentForNewIframes() {
    const observer = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {
            if (!mutation.addedNodes) return;

            mutation.addedNodes.forEach(function (node) {
                // 如果添加的是iframe
                if (node.nodeName !== 'IFRAME') return;

                // 给新iframe添加load事件
                node.addEventListener('load', function () {
                    try {
                        addClickHooksToImages(this.contentDocument);
                        observeIframeChanges(this);
                    } catch (e) {
                        console.log('Error processing dynamically added iframe:', e);
                    }
                });
            });

        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}


function processImageAll() {

    // 找到评论框中的所有图片
    const images = document.querySelectorAll('img');

    // 为每个图片添加点击事件
    images.forEach(img => {
        if (!img.dataset.hookAdded) {
            img.dataset.hookAdded = 'true';
            img.style.cursor = 'pointer';

            img.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("Comment box image clicked:", this.src);
                handleImageClick(this);
            });
        }
    });
}

function observePageImagesChanges() {
    const imagesContainer = document.body;

    // 如果body尚未加载，则稍后重试
    if (!imagesContainer) {
        setTimeout(observePageImagesChanges, 200);
        return;
    }
    // 创建一个观察器实例
    const observer = new MutationObserver(function (mutations) {
        // 当评论框内容变化时，重新处理图片
        processImageAll();
    });

    // 配置观察选项
    const config = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

    // 开始观察
    observer.observe(imagesContainer, config);

    // 立即处理一次当前的评论框图片
    processImageAll();
}
// ******************************************************************************************* TFS功能 END