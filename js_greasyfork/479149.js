// ==UserScript==
// @name         豆瓣阅读小工具 (聚力新生版)
// @name:zh-CN   豆瓣阅读小工具 (聚力新生版)
// @namespace    http://tampermonkey.net/
// @version      0.44
// @description  优化豆瓣网页版弹窗广告，自动展开手机原文，自动帮助回答薅羊毛的小组问题，修复默认豆瓣手机端无法查看小组问答
// @author       My Dream
// @match        https://www.douban.com/*
// @match        https://m.douban.com/*
// @icon         https://www.douban.com/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @connect      120.24.169.212
// @connect      greasyfork.org
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/479149/%E8%B1%86%E7%93%A3%E9%98%85%E8%AF%BB%E5%B0%8F%E5%B7%A5%E5%85%B7%20%28%E8%81%9A%E5%8A%9B%E6%96%B0%E7%94%9F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479149/%E8%B1%86%E7%93%A3%E9%98%85%E8%AF%BB%E5%B0%8F%E5%B7%A5%E5%85%B7%20%28%E8%81%9A%E5%8A%9B%E6%96%B0%E7%94%9F%E7%89%88%29.meta.js
// ==/UserScript==
//适配移动端回答窗口
GM_addStyle(`.question-wrapper{background-color:#fafafa;border:1px solid #dfdfdf;line-height:1;margin:20px 0px;overflow:hidden;padding:25px 18px;white-space:normal;}form{margin:0;padding:0;border:0px;}.question-content{margin-top:25px;}.question-input,.question-posted{background-color:#f8f8f8;border:none;box-sizing:border-box;color:#404040;border-radius:5px;display:block;font-size:14px;margin-bottom:10px;padding:15px 20px;resize:none;width:100%;}.question-submit{margin:15px auto 10px;text-align:center;}.question-btn{background-color:#40a156;border:0;border-radius:3px;box-sizing:border-box;color:#fff;display:inline-block;font-size:17px;height:25px;line-height:25px;max-width:100%;min-width:80px;outline:none;}.question-tip{color:gray;font-size:12px;line-height:normal;margin-top:10px;}textarea:focus{outline:none !important;border:none !important;}.question-content{margin-top:25px;}.is-wrong .question-posted{background-color:rgba(223,16,16,.1);}.question-result-meta{margin-top:20px;display:flex;margin-bottom:8px;width:100%;}.question-result-stat.correct{text-align:left;}.question-result-stat.wrong{text-align:right;}.question-result-stat{color:gray;flex:1;font-size:15px;}.question-result-bar{background-color:rgba(0,0,0,.1);border-radius:5px;display:flex;height:10px;margin:18px 0;overflow:hidden;}.question-result-active.wrong{background-color:#c74444;}.question-result-answer{color:#1a1a1a;font-size:15px;margin-top:10px;}.question-meta{font-size:13px;margin:8px 0 10px;}`);

//以下测试浏览器兼容代码，实际使用可以删除
if (typeof GM !== 'undefined' && GM_xmlhttpRequest) {
    //$("h1").after('该浏览器支持 GM_xmlhttpRequest');

} else {
    $("h1").after('该浏览器不支持 GM_xmlhttpRequest');
}
//以上测试浏览器兼容代码，实际使用可以删除


window.onload = function (){
    //疑似部分浏览器没有在页面加载完成就立刻执行，再加一个判断
    $(function() {

        // 判断是否是小组文章
        const currentURL = window.location.href;
        const urlregex = /\/group\/topic\/(\d+)\//;
        if (!urlregex.test(currentURL)) {
            return;
        }

        //判断是否是对应小组
        const groupidpattern = /(656297|698716|700687|536786|712738|716166)/;
        if (typeof group !== 'undefined' && group.id) {
            var groupid=group.id;
        }else{
            groupid = $(".info a").attr("href").replace("/group/", "");
        }
        if (!groupidpattern.test(groupid)) {
            return;
        }

        //判断是否是薅羊毛作业
        const titlepattern = /(作业|科普|教程|车)/;
        if (typeof topic !== 'undefined' && topic.title) {
            var topictitle=topic.title;
            var topicid=topic.id;
        }else{
            topictitle = $("title").text();
            topicid=PARAM.target_id;
        }
        if (!titlepattern.test(topictitle)) {
            return;
        }

        var currentHostname = window.location.host;

        //移动端移除广告，展开原文，适配回答功能
        if(currentHostname=="m.douban.com"){
            console.log("手机端");
            // 自动展开移动端手机原文
            $('.openapp.block-btn')
                .click();

            // 找到包含百度的 div 弹窗广告，并删除它们
            $('div iframe[src*="baidu.com"]')
                .closest('div')
                .remove();
            // 找到包含百度的 文章下面广告，并删除它们
            $('section div iframe[src*="baidu.com"]')
                .closest('section')
                .remove();
            // 再来一次
            $('div iframe[src*="baidu.com"]')
                .closest('div')
                .remove();

            //添加手机回复问答功能
            $(".question-title").after('<div class="question-content"><div class="question-meta"></div><form><textarea class="question-input" placeholder="请输入正确答案"></textarea><div class="question-submit"><button class="question-btn disabled">提交</button><div class="question-tip">提交后可查看结果</div></div></form></div>');

            //判断有没有添加成功
            if ($('.question-wrapper .question-content').length == 0) {
                $(".question-title").after('<div class="question-content"><div class="question-meta"></div><form><textarea class="question-input" placeholder="请输入正确答案"></textarea><div class="question-submit"><button class="question-btn disabled">提交</button><div class="question-tip">提交后可查看结果</div></div></form></div>');
            }

        }


        //自动回答
        $('div[data-entity-type="question"]').each(function() {
            let htmldata=this;
            let data = {
                Act: 'get',
                Cate: groupid,
                QID: $(this).attr('data-id'),
                Url: topicid
            };
            var postjson = JSON.stringify(data);

            //提交豆瓣服务器
            GM_xmlhttpRequest({
                method: "POST",
                url: 'http://120.24.169.212:8899/',
                data: postjson,
                onload: function(response) {
                    let jsonStr = response.responseText;
                    let obj = JSON.parse(jsonStr);
                    let objs = JSON.parse(obj.Content);
                    let huifu=["dd","感谢姐妹","哈哈","谢谢","xx","你好","大家好","非常感谢","啊哈哈","随便说说","好的哦","没问题","太棒了","好喜欢","无聊啊","小tips","有意思啊","厉害了","真不错","好开心","福利","这样","中","指教","真是个好问题","顺风","这个答案对吗？","加油加油","想什么","好","围观","随便","小幸福","好神奇啊！","努力！","奖励","真好","喜欢","笑死","赞","羡慕","旅行","哪里呀","这个问题太难了吧","你真厉害！","好","有","美好","点赞","开开心心！","出来","学习","分享","好久不见","珍贵","假日","愉快","享受","加油哦","keep","流星雨","无聊透顶","感谢","好困","请问","健康的身体"];
                    let randomIndex = Math.floor(Math.random() * huifu.length);
                    let randomValue = huifu[randomIndex];

                    if(obj.msg=="ok"){
                        if(objs.mode=="wenda"){

                            if (currentHostname == "www.douban.com") {
                                $(htmldata).find(".question-content").addClass("is-wrong");
                                $(htmldata).find(".question-content").html('<form><div class="question-posted is-wrong">'+randomValue+'</div><div class="question-result-meta"><div class="question-result-stat correct"><span>答对</span><em>0人（0.0%）</em></div><div class="question-result-stat wrong"><span>你答错了</span><em>'+$(htmldata).find(".question-meta span").eq(0).text()+'人（100.0%）</em></div></div><div class="question-result-bar"><div class="question-result-active wrong" style="width: 100%;"></div></div><div class="question-result-answer">正确答案：'+objs.neirong+'</div></div></form>');
                            }else if(currentHostname == "m.douban.com"){
                                console.log("ok");
                                $(htmldata).find(".question-content").addClass("is-wrong");
                                $(htmldata).find(".question-content").html('<form><div class="question-posted is-wrong">'+randomValue+'</div><div class="question-result-meta"><div class="question-result-stat correct"><span>答对</span><em>0人（0.0%）</em></div><div class="question-result-stat wrong"><span>你答错了</span></div></div><div class="question-result-bar"><div class="question-result-active wrong" style="width: 100%;"></div></div><div class="question-result-answer">正确答案：'+objs.neirong+'</div></div></form>');
                            }
                        }
                    }else{
                        if(objs.mode=="wenda"){
                            if (currentHostname === "www.douban.com") {
                                $(htmldata).find(".question-meta").html('<p><br><span>回答失败：'+objs.neirong+'</span><br></p>');
                            }else if(currentHostname == "m.douban.com"){
                                $(htmldata).find(".question-meta").html('<p><br><span>回答失败：'+objs.neirong+'</span><br></p>');
                            }
                        }
                    }

                    //console.log(obj);
                    //console.log(objs);
                    //console.log(response.responseText);
                },
                onerror: function(err) {
                    $(htmldata).find(".question-meta").html('<p><br><span>回答失败：问答服务器开小差了。。</span><br></p>');
                    console.log(err);
                }
            });


        });

        //让文字链接可以点击
        const linkRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#;]*[\w\-\@?^=%&/~\+#])?/g;
        const excludeTags = [
            'head', 'script', 'style', 'iframe', 'input', 'textarea',
            'select', 'button', 'option', 'label', 'nav', 'noscript',
            'code', 'pre', 'svg', 'image', 'audio', 'video'
        ];

        function shouldExcludeNode(node) {
            if (node && node.parentNode) {
                return excludeTags.includes(node.parentNode.tagName.toLowerCase());
            }
            return false;
        }

        function linkifyNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                let newText = '';
                let lastIndex = 0;
                let match = linkRegex.exec(text);
                while (match !== null) {
                    const prefix = text.slice(lastIndex, match.index);
                    lastIndex = match.index + match[0].length;
                    const link = match[0];
                    newText += `${prefix}<a href='${link}' target='_blank'>${link}</a>`;
                    match = linkRegex.exec(text);
                }
                newText += text.slice(lastIndex);
                if (newText !== text) {
                    const newNode = document.createElement('span');
                    newNode.innerHTML = newText;
                    node.parentNode.replaceChild(newNode, node);
                }
            } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                !shouldExcludeNode(node) &&
                !$(node).is('a')
            ) {
                node.childNodes.forEach(linkifyNode);
            }
        }

        const containers = $('#content');
        containers.each(function() {
            linkifyNode(this);
        });

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(node => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        ($(node).is('#content') || $(node).closest('#content').length)
                    ) {
                        linkifyNode(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });



        // 获取上次更新检查的时间戳
        const lastCheckTime = localStorage.getItem('lastCheckTime');
        // 获取当前时间戳
        const currentTime = Date.now();

        // 判断是否需要进行更新检查
        if (!lastCheckTime || (currentTime - lastCheckTime > 86400)) {

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const todayDate = `${year}-${month}-${day}`;

        // 检查更新的URL地址
        const scriptUrl = 'https://greasyfork.org/scripts/479149-%E8%B1%86%E7%93%A3%E9%98%85%E8%AF%BB%E5%B0%8F%E5%B7%A5%E5%85%B7-%E8%81%9A%E5%8A%9B%E6%96%B0%E7%94%9F%E7%89%88/code/%E8%B1%86%E7%93%A3%E9%98%85%E8%AF%BB%E5%B0%8F%E5%B7%A5%E5%85%B7%20(%E8%81%9A%E5%8A%9B%E6%96%B0%E7%94%9F%E7%89%88).user.js?time='+todayDate;
        const updataurl = "https://greasyfork.org/zh-CN/scripts/479149-%E8%B1%86%E7%93%A3%E9%98%85%E8%AF%BB%E5%B0%8F%E5%B7%A5%E5%85%B7-%E8%81%9A%E5%8A%9B%E6%96%B0%E7%94%9F%E7%89%88";



            // 发起XMLHttpRequest请求获取线上脚本的版本号和元数据信息
            GM_xmlhttpRequest({
                method: 'GET',
                url: scriptUrl,
                onload: function(response) {
                    const onlineScript = response.responseText;
                    // 从线上脚本中提取版本号和元数据信息
                    const onlineMeta = onlineScript.match(/@version\s+([^\s]+)/i);
                    const onlineVersion = onlineMeta ? onlineMeta[1] : '';

                    // 比较当前版本和线上版本，如果有新版本则提示用户更新
                    if (onlineVersion > GM_info.script.version) {
                        console.log("aaaaaaa");
                        const updateMessage = `当前脚本有新版本可用（v${onlineVersion}），是否立即更新？`;
                        if (confirm(updateMessage)) {
                            window.location.href = updataurl; // 跳转至线上脚本地址以触发更新
                        }
                    }
                }
            });

            // 更新最后一次检查的时间戳为当前时间
            localStorage.setItem('lastCheckTime', currentTime.toString());
        }
    });

}
