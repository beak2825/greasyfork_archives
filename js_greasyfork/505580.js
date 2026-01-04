// ==UserScript==
// @name         Make Codeforces Songly Again!!!
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  1233
// @author       rotcar
// @match        https://codeforces.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505580/Make%20Codeforces%20Songly%20Again%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/505580/Make%20Codeforces%20Songly%20Again%21%21%21.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 功能开关
    let scriptEnabled = localStorage.getItem('scriptEnabled') === 'true';

    // 添加按钮
    function addToggleButton() {
        const ruButton = document.querySelector('a[href="?locale=ru"]');
        if (ruButton) {
            const cnButton = document.createElement('a');
            cnButton.href = "?locale=zh";
            cnButton.style.marginLeft = '5px'; // 与原有按钮保持一定间距
            const img = document.createElement('img');
            img.src = "//codeforces.org/s/84246/images/flags/24/cn.png";
            img.title = "中文";
            img.alt = "中文";
            img.height = 24
            img.width = 24
            cnButton.appendChild(img);

            // 按钮点击事件
            cnButton.addEventListener('click', (e) => {
                e.preventDefault();
                scriptEnabled = !scriptEnabled;
                localStorage.setItem('scriptEnabled', scriptEnabled);
                location.reload();
            });

            // 插入按钮到 ru 按钮之后
            ruButton.parentNode.insertBefore(cnButton, ruButton.nextSibling);
        }
    }

    const replacements = [
        { regex: /Time limit exceeded on (pretest|test) (\d+)/i, replace: (match, type, num) => `<span class="verdict-rejected">第 ${num} 个点跑不及了</span>` },
        { regex: /Wrong answer on (pretest|test) (\d+)/i, replace: (match, type, num) => `<span class="verdict-rejected">好不容易交了一发，ex ${num} 没过</span>` },
        { regex: /Compilation error/i, replace: () => `编译通不过，逊逊逊` },
        { regex: /Memory limit exceeded on (pretest|test) (\d+)/i, replace: (match, type, num) => `<span class="verdict-rejected">数组买太大了</span>` },
        { regex: /Runtime error on (pretest|test) (\d+)/i, replace: (match, type, num) => `<span class="verdict-rejected">爆栈了</span>` },
        { regex: /Accepted/, replace: () => `<span class="verdict-accepted">成功了！</span>` }
    ];

    function replaceTextInElement(element) {
        if (!scriptEnabled) return;
        // 提取元素中的纯文本内容
        const originalText = element.textContent;

        // 使用正则表达式替换文本内容
        let newText = originalText;
        replacements.forEach(({ regex, replace }) => {
            newText = newText.replace(regex, replace);
        });

        // 如果有变化，更新元素内容
        if (newText !== originalText) {
            element.innerHTML = newText
        }
    }


    function replaceTextInDocument() {
        const elements = document.querySelectorAll('.submissionVerdictWrapper');
        elements.forEach(element => {
            replaceTextInElement(element);
        });
    }

    const newSrc = 'https://cdn.luogu.com.cn/upload/image_hosting/2k64yr35.png';

    function replaceImageSrcInElement(element) {
        const img = element.querySelector('img');
        if (img) {
            img.src = newSrc; // 替换 src 属性
        }
    }

    function handleSpecificDiv() {
        if (!scriptEnabled) return;
        const specificDivSelector = 'div[style="float:left; max-height: 60px;"]';
        const specificDivs = document.querySelectorAll(specificDivSelector);
        specificDivs.forEach(div => {
            replaceImageSrcInElement(div);
        });
    }
   function replaceTextInDocument1() {
       if (!scriptEnabled) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;

    while ((node = walker.nextNode())) {
        // 跳过 script 和 style 标签的内容
        if (node.parentNode.nodeName.toLowerCase() === 'script' || node.parentNode.nodeName.toLowerCase() === 'style') {
            continue;
        }

        // 只处理文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent
                .replace(/congratulation/gi, 'congutation')
                .replace(/is/g, '士')
                .replace(/tional/gi, 'tural')
                .replace(/kb/gi, '珂比')
                .replace(/tion/gi, 'ZZZ')
                .replace(/ture/gi, 'tion')
                .replace(/ZZZ/g, 'ture')
                .replace(/t/gi, '')
                .replace(/s(ong|)/gi, '宋')
                .replace(/k(e|)/gi, '珂')
                .replace(/m(a|)/gi, '马')
                .replace(/x(ie|)/gi, '歇')
                .replace(/2|r/gi, '尔')
                .replace(/w|3/gi, '块长')
                .replace(/1\.5/g, '宋')
                .replace(/7/g, '娜娜')
                .replace(/i/g, '1')
                .replace(/6/g, '主')
                .replace(/h/gi, 'HALL')
                .replace(/o/g, 'φ')
                .replace(/O/g, 'Φ');
        }
    }
   }
    function replaceImages() {
        if (!scriptEnabled) return;
        const newSrc = 'https://q1.qlogo.cn/g?b=qq&nk=2719771274&s=640';
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 保存原始的宽度和高度
            const originalWidth = img.width;
            const originalHeight = img.height;

            // 替换图片 src
            img.src = newSrc;

            // 恢复原始的宽度和高度
            img.width = originalWidth;
            img.height = originalHeight;
        });
    }

    const TrickyHTML = `<div style="margin-bottom:2em;">


<div class="has-topic-id topic" topicid="1233">
    <div class="title">
            <a href="/">            <p>Codeforces Now Supports Chinese!</p>
</a>
    </div>

    <div class="info" style="position:relative;">
            By&nbsp;<a href="/profile/MikeMirzayanov" title="Headquarters, MikeMirzayanov" class="rated-user user-admin">MikeMirzayanov</a>,
                <a href="/topic/133672/en8">history</a>,
                <span class="format-humantime" title="Aug/28/2024 16:21 UTC+8">1 hour ago</span>,

            <img style="position: relative;top: 5px;" src="//codeforces.org/s/74267/images/flags/24/gb.png" alt="In English" title="In English">



        <span style="position:absolute;right:0;top:0.05em;margin-right:1em;display:inline;font-size:0.75em;">
            <div style="margin-top:0.25em;">
            </div>
        </span>
    </div>

    <div class="content">
        <div class="html2md-panel input-output-copier ">
        </button></div><div class="ttypography"><p><b>你好，中国人！我们现在有中文翻译了！</b></p><p>Hello, Chinese!</p><p>Recently, I've noticed an increasing number of contests on Codeforces being organized by Chinese contributors. Statistics show that in the last ten contests, at least five were entirely provided by Chinese participants. Additionally, Chinese users dominate the rating leaderboard.</p><p>Based on feedback from many users, I have decided to offer a Chinese version of Codeforces. The current translation of the website has been provided by ChatGPT, and I welcome everyone to contribute to improving the page by sharing suggestions in the comments below!</p></div>
    </div>



            <script type="text/javascript">
    $(document).ready(function () {
        $(".delete-resource-link-1-133672").click(function() {
            var that = this;
            Codeforces.confirm("Are you sure you want to detach a contest?", function () {
                $.post("/data/blogAndContest", {
                    action: "detachBlogFromContest",
                    blogId: "1",
                    blogEntryId: "133046",
                    contestId: $(that).attr("data-contestId"),
                    resourceIds: $(that).attr("data-resourceIds")
                }, function(json) {
                    Codeforces.reloadAndShowMessageOrShowError(json, "Contest detached");
                });
            }, function () {}, "Yes", "No");
        });
    });
</script>


        <div style="font-size: 1.1rem;line-height: 11px;">
            <img style="vertical-align: middle;" src="//codeforces.org/s/74267/images/blog/tags.png" title="Tags" alt="Tags">
                <span style="padding: 0 0.35em;">
    <a href="/search?query=codeforces" class="tag notice" style="text-decoration: none;">codeforces</a>,
                </span>
                <span style="padding: 0 0.35em;">
    <a href="/search?query=c%2B%2B" class="tag notice" style="text-decoration: none;">chinese</a>,
                </span>
                <span style="padding: 0 0.35em;">
    <a href="/search?query=g%2B%2B14" class="tag notice" style="text-decoration: none;">china</a>,
                </span>
                <span style="padding: 0 0.35em;">
    <a href="/search?query=c%2B%2B23" class="tag notice" style="text-decoration: none;">language</a>
                </span>
        </div>


    <div class="roundbox meta borderTopRound borderBottomRound" style="">
        <div class="left-meta">
            <ul>
                    <li style="line-height: 1.6em;">        <a href="#" class="topic-vote-up-133672"><img style="vertical-align:middle;position:relative;top:-0.2em" src="//codeforces.org/s/74267/images/actions/voteup.png" alt="Vote: I like it" title="Vote: I like it"></a>


</li>
                    <li style="line-height: 1.6em;">


        <span title="Topic rating" style="font-size:larger;position:relative;bottom:1px;font-weight:bold;color:green">+1481</span>

</li>
                    <li style="line-height: 1.6em;">        <a href="#" class="topic-vote-down-133672"><img style="vertical-align:middle;position:relative;top:-0.2em" src="//codeforces.org/s/74267/images/actions/votedown.png" alt="Vote: I do not like it" title="Vote: I do not like it"></a>


</li>
            </ul>
        </div>

            <div style="position: relative; float: left; left: -1.5rem; top: 1rem;">



            </div>

            <span style="position: relative; line-height: 1.65em; top: 0.75rem; left: 0.8em;">
            </span>

        <div class="right-meta">
            <ul>
                    <li>        <a href="/profile/MikeMirzayanov"><img style="vertical-align:middle;position:relative;top:-1px" src="//codeforces.org/s/74267/images/blog/user_16x16.png" alt="Author" title="Author"></a>


        <a href="/profile/MikeMirzayanov">
        MikeMirzayanov
        </a>
</li>
                    <li>        <img style="vertical-align:middle;position:relative;top:-1px" src="//codeforces.org/s/74267/images/blog/date_16x16.png" alt="Publication date" title="Publication date">



        <span class="format-humantime" title="Aug/24/2024 16:21 UTC+8">1 hour ago</span>

</li>
                    <li>        <a href="/"><img style="vertical-align:middle;position:relative;top:-1px" src="//codeforces.org/s/74267/images/blog/comments_16x16.png" alt="Comments" title="Comments"></a>


        <a href="/">
        87
        </a>
</li>
            </ul>
        </div>

        <br style="clear:both;">
    </div>




    <script type="text/javascript">
        $(document).ready(function () {
        $(".topic-vote-up-133672").click(function () {
        $.post("/data/topic/vote", {topicId: 133672, _tta: Codeforces.tta(), topicRevisionId: 361581, vote: +1}, function(data) {
        Codeforces.showMessage(data);
        }, "json");
        return false;
        });
        $(".topic-vote-down-133672").click(function () {
        $.post("/data/topic/vote", {topicId: 133672, _tta: Codeforces.tta(), topicRevisionId: 361581, vote: -1}, function(data) {
        Codeforces.showMessage(data);
        adjustTopicComplainFrames();
        }, "json");
        return false;
        });
        });
    </script>
</div>
</div>`

    function cinema() {
       if(scriptEnabled) return;
    const pageContentDiv = document.getElementById("pageContent");
    if (pageContentDiv){if(window.location.pathname === '/') {
        const newContent = document.createElement("div");
        newContent.innerHTML = TrickyHTML

        // Insert as the first child
        pageContentDiv.insertBefore(newContent, pageContentDiv.firstChild);
    }
    }}

    // 初次页面加载时替换文本
    window.addEventListener('load', () => {
        cinema();
        addToggleButton();
        replaceImages();
        replaceTextInDocument();
        handleSpecificDiv();
        replaceTextInDocument1();
    });

    // 监听 DOM 变化以动态替换新加载的内容
    const observer = new MutationObserver(mutations => {
        // 设置一个延迟以批量处理
        setTimeout(() => {
            const elementsToProcess = [];
            const elementsToRemoveTs = [];

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.classList.contains('submissionVerdictWrapper')) {
                            elementsToProcess.push(node);
                        }
                    } else if (node.nodeType === 3) { // 文本节点
                        const parentElement = node.parentNode;
                        if (parentElement && parentElement.classList.contains('submissionVerdictWrapper')) {
                            elementsToProcess.push(parentElement);
                        }
                    }
                });
            });

            // 批量处理
            elementsToProcess.forEach(element => {
                replaceTextInElement(element);
            });
        }, 100); // 延迟时间可以根据需要调整
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
