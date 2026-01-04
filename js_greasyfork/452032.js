// ==UserScript==
// @name         抖音评论筛选器 | Douyin Comment Picker
// @namespace    https://github.com/NewComer00
// @version      0.6.1
// @description  筛选搜索包含给定关键词的抖音评论 | Pick out the comments including the given keywords in Douyin.
// @author       NewComer00
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      GPLv2且禁止商用 | GPLv2 AND Commercial use prohibited
// @downloadURL https://update.greasyfork.org/scripts/452032/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E7%AD%9B%E9%80%89%E5%99%A8%20%7C%20Douyin%20Comment%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/452032/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E7%AD%9B%E9%80%89%E5%99%A8%20%7C%20Douyin%20Comment%20Picker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================================================
    // 使用说明
    //
    // 将脚本复制添加到Tampermonkey。使能该脚本，然后访问抖音官网https://www.douyin.com/，按下F12进入Console即可。
    // 在页面上方依次填写“视频关键词”、“评论筛选关键词（空格隔开）”和“最大浏览视频数量”，然后点击“开始”。
    //
    // 脚本的中间结果会保存在浏览器的本地缓存文件中，随时可以再次从断点开始。
    // 脚本运行中如被打断，刷新即可继续运行；若标签页或浏览器被关闭，打开任何抖音网站即可从断点继续运行脚本。
    //
    // 如中途需要从头执行脚本，请先删除浏览器上抖音网站的浏览缓存数据，然后刷新抖音页面即可。此为通用方法，但会使抖音账号登出。
    // 对于0.3及以上版本，也可在Console中执行localStorage.removeItem('State')命令，然后刷新网页即可重置脚本。此方法可保留抖音的登录状态。
    // 如需在脚本运行前排除先前浏览缓存数据的影响，可以点击“清除脚本缓存”按钮，清除缓存文件后页面会自动刷新。
    //
    // 执行完毕后，网页会弹出结果文件下载窗口。复制文件中所有内容，粘贴到Excel即可以表格方式查看。
    // ========================================================================

    // ========================================================================
    // 脚本输入参数
    // ========================================================================

    // 网站域名。目前只适用于抖音，请不要更改
    const DOMAIN = 'www.douyin.com';

    // ========================================================================
    // 相关数据类型和函数
    // ========================================================================
    const strFormat = (str, ...args) => args.reduce((s, v) => s.replace('%s', v), str);
    const State = {
        Original: 'Original',
        One: 'One',
        Two: 'Two'
    }

    // 当给定元素被加载后，返回该元素对象
    // https://stackoverflow.com/a/61511955/15283141
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // 下载数据至本地文件
    // https://stackoverflow.com/a/30832210
    function download(data, filename, type) {
        var file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob) { // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    // 检查用户是否已经登录抖音
    function hasLoggedIn(body) {
        return body.innerHTML.search('退出登录') === -1 ? false : true;
    }

    // 如果已登录，不断下滑到页面底部，加载更多视频
    async function loopForVideo(body, maxVideoNum, regex) {
        // 确保先等待几秒，再获取页面视频编号
        function getVideoAfterDelay(body, regex) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(Array.from(body.innerHTML.matchAll(regex), m => m[1]));
                }, 2000);
            });
        }

        let videoIdArr;
        for (let videoNum = 0; videoNum < maxVideoNum;) {
            console.log(strFormat(
                '正在获取视频链接：%s / %s', videoNum + 1, maxVideoNum));
            window.scrollTo(0, document.body.scrollHeight);
            videoIdArr = await getVideoAfterDelay(body, regex);
            videoIdArr = [...new Set(videoIdArr)]; // 去除重复的视频编号
            // 如果没有更多的视频了，不再继续获取视频
            if (videoIdArr.length <= videoNum) {
                break;
            }
            videoNum = videoIdArr.length;
        }
        return videoIdArr;
    }

    // ========================================================================
    // 分析视频页面的逻辑，可以自定义
    // ========================================================================
    function mainLogic(body, keywords) {
        // 获取HTML某节点下属所有不为空的含文本节点
        // https://stackoverflow.com/a/10730777
        function textNodesUnder(el) {
            var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            while (n = walk.nextNode()) {
                if (n.data.length > 0) a.push(n);
            }
            return a;
        }

        // 获取某节点的相对深度
        // https://stackoverflow.com/a/45223847/15283141
        function getElementDepth(element) {
            function getElementDepthRec(element, depth) {
                if(element.parentNode==null) return depth;
                else return getElementDepthRec(element.parentNode, depth+1);
            }
            return getElementDepthRec(element, 0);
        }

        // 递归搜索node的父母节点，直到遇到href中包含substr的节点，返回该节点的href字符串
        // 若未找到符合要求的href，则返回null
        // https://stackoverflow.com/a/29412162
        function getNearestAncestorHref(node, substr){
            while(node !== null) {
                if (typeof node.href !== "undefined" && node.href.includes(substr)) {
                    return node.href;
                } else {
                    node = node.parentNode;
                }
            }
            return null;
        }

        // 获取视频页面评论区的总节点
        let commentMainContent = body.getElementsByClassName("comment-mainContent")[0];
        // 提取评论区总节点中所有含文本的节点
        let textNodes = textNodesUnder(commentMainContent);
        // 假设首节点就是每个评论的开头。计算每个文字节点的相对深度，根据首节点的深度来切分不同评论
        let nodeDepths = textNodes.map(_ => getElementDepth(_));
        // 所有与首节点深度相同节点的idx
        let commentIdxList = nodeDepths.map(
            (depth,idx) => {if(depth === nodeDepths[0]) return idx;}).filter(idx => idx !== undefined);

        // 提取评论列表
        let commentList = [];
        const USER_URL_PREFIX = strFormat('%s/user/', DOMAIN);
        for (let i = 0; i < commentIdxList.length; i++) {
            // 截取每个评论的所有相关节点
            let startIdx = commentIdxList[i];
            let endIdx = (i !== commentIdxList.length - 1) ? commentIdxList[i+1] : textNodes.length;

            // 在每个评论相关的所有节点中，拼接“相邻深度接近的节点”的内容
            let diffThreshold = 1; // 深度相差多少算“接近”
            let curComment = [];
            let tmpStr = textNodes[startIdx].data;
            for (let j = startIdx; j < endIdx - 1; j++) {
                if (Math.abs(nodeDepths[j] - nodeDepths[j+1]) <= diffThreshold) {
                    tmpStr += textNodes[j+1].data;
                } else {
                    curComment.push(tmpStr);
                    tmpStr = textNodes[j+1].data;
                }
            }
            curComment.push(tmpStr);

            // 获取并存储当前评论所属的视频链接与用户主页链接
            curComment.videoUrl = window.location.href;
            curComment.userUrl = getNearestAncestorHref(textNodes[startIdx], USER_URL_PREFIX);
            curComment.userUrl = (curComment.userUrl === null) ? '' : curComment.userUrl;

            // 当前评论加入评论列表
            commentList.push(curComment);
        }

        // result存放检测到符合关键词要求的信息，每行格式如下：
        // 检测到的关键词\t评论相关信息...\t视频页面链接\t用户主页链接\n
        let result = '';
        for (const comment of commentList) {
            // 每条评论中包含了哪些关键词，假设每条评论的首个元素是用户名，用户名含关键词不算
            for (let i = 1; i < comment.length; i++) {
                let keywordsInComment = keywords.filter(
                    k => comment[i].toLowerCase().includes(k.toLowerCase()));
                // 如果在评论中找到了含有关键词的元素
                if (keywordsInComment.length > 0) {
                    // 先将评论列表格式化为字符串
                    let commentStr = comment.reduce((acc, elem) => {
                        // 删除“展开更多选项”的元素
                        if (elem === '...') {
                            return acc;
                        } else {
                            // 用空格代替换行符
                            let tmpStr = elem.replaceAll('\n', '');
                            return acc + tmpStr + '\t';
                        }
                    }, '');
                    commentStr = commentStr.trim();

                    // 将提取出的信息加入结果
                    result += strFormat('%s\t%s\t%s\t%s\n',
                                        keywordsInComment,
                                        commentStr,
                                        comment.videoUrl,
                                        comment.userUrl,
                                       );
                    break;
                }
            }
        }
        return result;
    }

    // ========================================================================
    // 状态机
    // ========================================================================
    // 初始化状态信息
    let curState = localStorage.getItem('State');
    if (curState === null) {
        localStorage.setItem('State', State.Original);
        curState = State.Original;
    }

    // 检查视频关键词和评论关键词等本地缓存文件是否存在
    let target = localStorage.getItem('target'); // 视频关键词
    let keywords = localStorage.getItem('keywords'); // 视频下的评论筛选关键词，由空格分开
    let maxVideoNum = localStorage.getItem('maxVideoNum'); // 只筛选前几个视频，应当是非负整数
    if (target === null || keywords === null || maxVideoNum === null) {
        // 除非当前状态在初态，否则这些缓存文件都应当存在。不存在则回到初态
        if (curState !== State.Original) {
            console.log('没有找到视频关键词和评论关键词等的本地缓存文件\n' +
                        '脚本将重置进度，请重新输入这些信息');
            localStorage.setItem('State', State.Original);
            curState = State.Original;
        }
    } else {
        // 代码运行到此处，证明视频关键词等信息都以字符串的形式存在
        // 将关键信息提取出来变成相应类型的常量，状态机除初态之外的核心逻辑都使用这些常量
        var TARGET = target; // string
        var KEYWORDS = keywords.split(' '); // array of string
        var MAX_VIDEO_NUM = parseInt(maxVideoNum); // int
    }

    switch (curState) {
        // 初态。加载脚本的用户交互组件，获取用户输入
        case State.Original:
            console.log("请在页面上填写相关筛选信息...");

            // 交互组件容器，用于存放以下组件
            var inputDiv = document.createElement("div");

            // 文本框，输入视频关键词
            var inputTarget = document.createElement("input");
            inputTarget.setAttribute('name', "inputTarget");
            inputTarget.setAttribute('type', "text");
            inputTarget.setAttribute('placeholder', "视频关键词");
            if (target !== null && target.length !== 0) {
                inputTarget.setAttribute('value', target);
            } else {
                inputTarget.setAttribute('value', '孙一峰');
            }
            inputDiv.appendChild(inputTarget);

            // 文本框，输入视频下的评论筛选关键词
            var inputKeywords = document.createElement("input");
            inputKeywords.setAttribute('name', "inputKeywords");
            inputKeywords.setAttribute('type', "text");
            inputKeywords.setAttribute('placeholder', "评论筛选关键词，空格分隔");
            if (keywords !== null && keywords.length !== 0) {
                inputKeywords.setAttribute('value', keywords);
            } else {
                inputKeywords.setAttribute('value', 'ToSsGirL 西湖 大哥 F91');
            }
            inputDiv.appendChild(inputKeywords);

            // 文本框，输入最大浏览视频数量
            var inputMaxVideoNum = document.createElement("input");
            inputMaxVideoNum.setAttribute('name', "inputMaxVideoNum");
            inputMaxVideoNum.setAttribute('type', "number");
            inputMaxVideoNum.setAttribute('min', "0");
            inputMaxVideoNum.setAttribute('step', "1");
            inputMaxVideoNum.setAttribute('placeholder', "最大浏览视频数量，数字");
            if (maxVideoNum !== null && maxVideoNum.length !== 0) {
                inputMaxVideoNum.setAttribute('value', maxVideoNum);
            } else {
                inputMaxVideoNum.setAttribute('value', '10');
            }
            inputMaxVideoNum.addEventListener('mouseup', (e) => {
                e.stopPropagation();
            });
            inputDiv.appendChild(inputMaxVideoNum);

            // 按钮，控制"开始筛选评论"行为，这是最主要的功能
            var btnStart = document.createElement("button");
            btnStart.innerHTML = "开始筛选评论";
            // 点击按钮后...
            btnStart.onclick = function () {
                // 保存用户输入至本地缓存文件
                // TODO: 没有检测用户输入合法性
                target = inputTarget.value;
                localStorage.setItem('target', String(target));
                keywords = inputKeywords.value;
                localStorage.setItem('keywords', String(keywords));
                maxVideoNum = inputMaxVideoNum.value;
                localStorage.setItem('maxVideoNum', String(maxVideoNum));

                // 重定向至视频搜索结果页面，页面自动刷新后进入下一个状态
                console.log("正在根据关键词搜索视频...");
                localStorage.setItem('State', String(State.One));
                curState = State.One;
                var searchUrl = encodeURI(strFormat('https://%s/search/%s?&type=video', DOMAIN, target));
                window.location.href = searchUrl;
            };
            inputDiv.appendChild(btnStart);

            // 按钮，手动删除和脚本相关的本地缓存文件
            var btnRmLocalStorage = document.createElement("button");
            btnRmLocalStorage.innerHTML = "清除脚本缓存";
            // 点击按钮后...
            btnRmLocalStorage.onclick = function () {
                console.log("正在清除脚本相关的本地缓存文件...");
                localStorage.removeItem('target');
                localStorage.removeItem('keywords');
                localStorage.removeItem('maxVideoNum');
                localStorage.removeItem('State');
                localStorage.removeItem('videoIdArr');
                localStorage.removeItem('videoCurIndex');
                localStorage.removeItem('Result');

                console.log("清除完成，页面即将刷新...");
                window.location.reload();
            };
            inputDiv.appendChild(btnRmLocalStorage);

            // setTimeout等待几秒，以确保网页真的已经完成加载
            // TODO: 为什么onload被触发时页面却没有加载完全？反爬虫机制？
            window.onload = setTimeout(async function() {
                // 添加交互菜单到页面悬浮标题栏下方
                document.getElementById('douyin-header').appendChild(inputDiv);
            }, 5000);
            break;

        // 状态一。获取关键词对应的所有视频编号
        case State.One:
            console.log("正在获取关键词对应的所有视频编号...");

            // 一旦页面加载完毕，等待几秒后就开始获取页面上的视频编号
            console.log("确保页面真的完全加载，请等待几秒...");
            // setTimeout等待几秒，以确保网页真的已经完成加载
            // TODO: 为什么onload被触发时页面却没有加载完全？反爬虫机制？
            window.onload = setTimeout(async function () {
                console.assert(MAX_VIDEO_NUM >= 0, '最大筛选视频数量应当是非负整数，否则可能会获取不到视频编号');
                // 提取视频编号的正则表达式
                const rgx = new RegExp(
                    strFormat(String.raw`href="\/\/%s\/video\/(\d+)" class`, DOMAIN), 'g');
                let videoIdArr;
                if (hasLoggedIn(document.body)) {
                    // 如果已登录，不断下滑到页面底部，加载更多视频
                    videoIdArr = await loopForVideo(document.body, MAX_VIDEO_NUM, rgx);
                } else {
                    // 如果未登录，直接获取页面上的视频链接
                    videoIdArr = Array.from(document.body.innerHTML.matchAll(rgx), m => m[1]);
                    videoIdArr = [...new Set(videoIdArr)];
                }
                videoIdArr = videoIdArr.slice(
                    0, Math.min(videoIdArr.length, Math.floor(MAX_VIDEO_NUM)));

                console.log(strFormat('已提取和“%s”相关的所有视频编号', TARGET));
                console.log(videoIdArr);
                if (videoIdArr.length > 0) {
                    localStorage.setItem('State', String(State.Two));
                    localStorage.setItem('videoIdArr', String(videoIdArr));
                    localStorage.setItem('videoCurIndex', String(0));
                    curState = State.Two;

                    // 重定向至第0号视频页面，下次脚本应当进入下一个状态
                    const videoUrl = strFormat('https://%s/video/%s', DOMAIN, videoIdArr[0]);
                    window.location.href = videoUrl;
                } else {
                    // 出错，下次用户刷新后返回初态
                    console.log('没有获取到任何有效的视频编号，用户刷新后将重新运行脚本');
                    localStorage.setItem('State', String(State.Original));
                    curState = State.Original;
                }
            }, 5000);
            break;

        // 状态二。处理每个编号的视频
        case State.Two:
            console.log("正在处理每个编号的视频...");
            var videoIdArr = localStorage.getItem('videoIdArr').split(",");
            var videoCurIndex = parseInt(localStorage.getItem('videoCurIndex'));
            if (videoIdArr !== null && !isNaN(videoCurIndex)) {
                // 如果当前页面不在正确的地址，跳转至准备处理的视频地址
                const videoUrl = strFormat('https://%s/video/%s', DOMAIN, videoIdArr[videoCurIndex]);
                // 抖音的图文笔记可能会伪装成视频，我们也兼容搜索图文笔记
                const noteUrl = strFormat('https://%s/note/%s', DOMAIN, videoIdArr[videoCurIndex]);
                if (window.location.href !== videoUrl && window.location.href !== noteUrl) {
                    window.location.href = videoUrl;
                }

                console.log(strFormat(
                    "处理进度：%s / %s", videoCurIndex + 1, videoIdArr.length));
                var videoId = videoIdArr[videoCurIndex];
                console.log('进入视频：' + videoId);

                // setTimeout等待几秒，以确保网页真的已经完成加载
                // TODO: 为什么onload被触发时页面却没有加载完全？反爬虫机制？
                window.onload = setTimeout(async function () {

                    // 分析视频页面，核心处理逻辑
                    const body = document.getElementsByTagName("body")[0];
                    let result = mainLogic(body, KEYWORDS);
                    console.log('本视频页面分析完成，结果为：')
                    console.log(result);
                    // 添加结果至本地缓存，若是从头开始运行则覆盖老的本地缓存
                    let oldResult = localStorage.getItem('Result');
                    if (oldResult !== null && videoCurIndex !== 0) {
                        result = oldResult + result;
                    }
                    localStorage.setItem('Result', String(result));

                    if (videoCurIndex + 1 < videoIdArr.length) {
                        // 下一次重定向时，将处理下一个视频
                        videoCurIndex++;
                        localStorage.setItem('videoCurIndex', String(videoCurIndex));
                        localStorage.setItem('State', String(State.Two));
                        curState = State.Two;

                        // 重定向至下一个视频，下次脚本应当处理下一个视频
                        videoId = videoIdArr[videoCurIndex];
                        const videoUrl = strFormat('https://%s/video/%s', DOMAIN, videoId);
                        window.location.href = videoUrl;
                    } else {
                        // 执行完毕正常退出，下次用户刷新后返回初态
                        let finMsg = strFormat(
                            '【视频主题】\n%s\n【评论关键词】\n%s\n【最终筛选结果】\n%s\n',
                            TARGET, KEYWORDS, result);
                        console.log(finMsg);
                        download(result, 'Result', 'text/plain');

                        console.log('脚本运行完成，注意结果文件下载弹窗。用户刷新后将重新运行脚本');
                        localStorage.setItem('State', String(State.Original));
                        curState = State.Original;
                    }
                }, 5000);

            } else {
                // 出错，下次用户刷新后返回初态
                console.log('没有找到视频编号的缓存文件，用户刷新后将重新运行脚本');
                localStorage.setItem('State', String(State.Original));
                curState = State.Original;
            }
            break;
    }

    console.log('除了填写信息的页面外，页面如果长时间没有自动跳转，脚本可能已经停止运行\n' +
                '可以尝试刷新页面，脚本可能恢复运行。仍不行请删除浏览器上该网站的浏览缓存数据，刷新后脚本将重置。');

})();
