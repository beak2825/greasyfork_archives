// ==UserScript==
// @name         ugg论坛绿化
// @namespace    https://greasyfork.org/zh-CN/scripts/508867-ugg论坛绿化
// @version      1.3.1
// @description  ugg论坛绿化，删除页面部分元素，取消每24h的60s强制弹窗
// @author       https://greasyfork.org/zh-CN/users/1368383-kotsos
// @match        https://uu-gg.rr.nu/*
// @match        https://uu-gg.rr.nu./*
// @match        https://www.uu-gg.one/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508867/ugg%E8%AE%BA%E5%9D%9B%E7%BB%BF%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/508867/ugg%E8%AE%BA%E5%9D%9B%E7%BB%BF%E5%8C%96.meta.js
// ==/UserScript==



function main_page() {
    GM_addStyle('#top-content{display:none !important}');
    GM_addStyle('.a_ugg_mu{display:none !important}');
    GM_addStyle('.bm bmw  flg cl{display:none !important}');
    GM_addStyle('#laba{display:none !important}');
    GM_addStyle('div.bm_c.cl.pbn{display:none !important}');
    GM_addStyle('div#flk.y{display:none !important}');
    GM_addStyle('#wolfcodepostwarn_div{display:none !important}');
    GM_addStyle('#scrolling-table{display:none !important}');
    GM_addStyle('div.sign{display: none !important}');
    //GM_addStyle('a.fastre{display: none !important}');
    GM_addStyle('#nv{display: none !important}');
    GM_addStyle('#toptb{display: none !important}');
    GM_addStyle('span.y{display: none !important}');
};


function no_image() {
    var images = document.querySelectorAll('img[src="source/plugin/study_haveread/images/alreadyread.gif"]');


    images.forEach(function(img) {
        img.style.display = 'none';  
    });
};



function no_textarea() {
    
    var textarea = document.querySelector('textarea#fastpostmessage.pt');
    if (textarea) {
        textarea.placeholder = '';
    }
};

function handleContent() {
	var tbodyElements = document.querySelectorAll('tbody');
	tbodyElements.forEach(tbody => {
		var thElements = tbody.querySelectorAll('th');
		thElements.forEach(th => {
			var aElements = th.querySelectorAll('a');
			aElements.forEach(a => {
				if (a.href.startsWith("https://uu-gg.rr.nu/forum.php?mod=redirect&goto=findpost&pid=") || a.href.startsWith("https://www.uu-gg.one/forum.php?mod=redirect&goto=findpost&pid=")) {
					a.remove();
				}
			});
		});
	});
}

function handleContent1() {
    var targetDiv = document.getElementById('threadlist'); 
    if (targetDiv) {
        var form = targetDiv.querySelector('form#moderate');
        if (form) {
            var table = form.querySelector('table#threadlisttableid');
            if (table) {
                var tbodies = table.querySelectorAll('tbody');
                var i = 0;
                while (tbodies[i].id !== 'separatorline') {
                    if(tbodies[i+1].id !== 'separatorline'){
                        tbodies[i].style.display = 'none'; 
                    }
                    i++;
                }

                if(i > 0){
                var tbody = document.getElementById(tbodies[i-1].id);
                if (tbody) {
                    var tr = tbody.querySelector('tr');
                    if (tr) {
                        var tdElements = tr.querySelectorAll('td');
                        var thElements = tr.querySelectorAll('th');
                        thElements.forEach(th => {
                            var links = th.querySelectorAll('a');
                            links.forEach(link => link.remove());
                        });
                        var customText = '';
                        thElements.forEach(th => {
                            th.appendChild(document.createTextNode(customText));
                        });
                    }
                }}

                var tbodyElements = table.querySelectorAll('tbody');
                tbodyElements.forEach(tbody => {
                    var thElements = tbody.querySelectorAll('th');
                    thElements.forEach(th => {
                        var aElements = th.querySelectorAll('a');
                        aElements.forEach(a => {
                            if (a.href.startsWith("https://uu-gg.rr.nu/forum.php?mod=redirect&goto=findpost&pid=") || a.href.startsWith("https://www.uu-gg.one/forum.php?mod=redirect&goto=findpost&pid=")) {
                                a.remove();
                            }
                        });
                    });
                });
            }
        }
    }
}



function Observer_NextPage() {
    'use strict';

    var targetNode = document.querySelector('table#threadlisttableid'); 

    if (!targetNode) {
        console.error('目标容器未找到');
        return;
    }

    let observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                handleContent();
            }
        }
    });

    let config = { childList: true, subtree: true };

    observer.observe(targetNode, config);
};


(function() {
    'use strict';
    if (isCloudflareChallengePage()) {
            //console.log('Cloudflare 验证页面，跳过屏蔽操作');
            return; // 如果是验证页面，直接跳过操作
    }
    document.documentElement.style.visibility = 'hidden';
    function replaceOrBlockElements() {
        localStorage.setItem('modalLastShown', Date.now());
        main_page();
	no_image();
	no_textarea();
	handleContent();
	handleContent1();
	Observer_NextPage();
        document.documentElement.style.visibility = 'visible';
    }
    document.addEventListener('DOMContentLoaded', replaceOrBlockElements);
})();

// 检测是否为 Cloudflare 验证页面
function isCloudflareChallengePage() {
    const title = document.title.toLowerCase();
    const challengeKeywords = ['checking your browser', 'cloudflare', 'just a moment...', '请稍候...', 'www.uu-gg.one - system error','502 bad gateway'];
    console.log("title:", title);
    return challengeKeywords.some(keyword => title.includes(keyword))
}

(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof confirmSubmit === 'function') {
            //console.log('目标函数已加载，进行覆盖');
            confirmSubmit = function(content, formId) {

                var form = document.getElementById(formId);
                if (!form) {
                    showAlert("<span class='warn'>错误 Error</span><br><br>找不到表单！");
                    return false;
                }

                var words = ["顶", "赞", "不错", "给力", "无脑", "拿下", "精品", "牛逼", "牛b", "狂喜", "怎么样", "看起来", "看上去", "收藏了", "厉害了", "谢分享", "非常感谢", "感谢大大", "无私分享", "楼主好人", "谢楼主", "谢LZ", "辛苦楼主", "支持楼主", "大佬", "dalao", "大佬威武", "收下了", "收了收了", "必须收下", "爱了爱了", "必须下载", "必须收藏", "收藏一下", "收藏下", "好东西", "试试看", "试一下", "找好久", "找了很久", "找了好久", "等了好久", "终于找到", "康康", "回复看密码", "回复看看", "楼主牛比", "支持下", "支持一下", "支持一波", "必须支持", "下载看看", "上手看看", "下来看看", "下了试试", "下来试试", "有点意思", "有点东西", "查漏补缺", "查缺补漏", "可以可以", "戳我xp", "没玩过", "没见过", "社保"];


                var contentClean = content.replace(/(\{:\s*.*?:\})|(\[.*?\])|([^\w\u4e00-\u9fa5])/g, '').replace(/\s+/g, '');

                // 清除之前的确认按钮
                var warningDiv = document.getElementById('warning-message');
                if (warningDiv) {
                    var existingButton = document.getElementById('confirm-button');
                    if (existingButton) {
                        warningDiv.removeChild(existingButton);
                    }
                }

                // 检查提交内容的长度是否符合要求
                if (contentClean.length < 7) {
                    showAlert("<br><br>帖子内容不得少于7个汉字。<br>Content must be at least 7 characters");
                    return false;
                }

                // 检查提交的内容是否为纯数字
                if (/^\d+$/.test(contentClean))  {
                    showAlert("<br><br>禁止提交纯数字<br>No posting only numbers.");
                    return false;
                }

                // 去除空格和[]符号及其包裹的内容，检查纯英文字母
                if (/^[a-zA-Z]+$/.test(content.replace(/\s+/g, '').replace(/\[.*?\]/g, ''))) {
                    showAlert("<br><br>禁止提交纯字母<br>No posting only letters without punctuation.");
                    return false;
                }

                // 去除空格和[]符号及其包裹的内容，并检查是否为只包含字母和数字的字符串，且不包含标点符号
                if (/[a-zA-Z]/.test(content.replace(/\s+/g, '').replace(/\[.*?\]/g, '')) &&
                    /\d/.test(content.replace(/\s+/g, '').replace(/\[.*?\]/g, '')) &&
                    !/[^\w\u4e00-\u9fa5]/.test(content.replace(/\s+/g, '').replace(/\[.*?\]/g, '')))   {
                    showAlert("<br><br>纯数字和纯字母组合内容，需包含常见英文标点，<br>Posts must contain punctuation to be meaningful.");
                    return false;
                }

                // 检查是否有连续重复的中文字符超过3个
                if (/([\u4e00-\u9fa5])\1{2,}/g.test(contentClean)) {
                    showAlert("<br><br>不要用连续三个相同的叠字");
                    return false;
                }

                // 检查提交的内容是否包含禁止词汇
                var foundWords = words.filter(function(word) {
                    return contentClean.indexOf(word) !== -1;
                });
                if (foundWords.length > 0) {
                    var message = "<br><br>你提交的内容包括以下词汇：<br><br><span class='spam'>" + foundWords.join(" | ") ;
                    showAlert(message);
                    return false;
                }

                // 如果所有内容检查通过，则弹出最后确认警示框
                showAlert("<span class='warn'>确认 &#9733; </span>");

                // 添加确认发布按钮
                var confirmButton = document.createElement("button");
                confirmButton.innerHTML = "确认发布  &#x1F680; ";
                confirmButton.className = "close-button";
                confirmButton.id = 'confirm-button';
                confirmButton.style.marginTop = '0px';
                confirmButton.style.marginRight = '180px';
                if (warningDiv) {
                    warningDiv.appendChild(confirmButton);
                }

                if (window.attachEvent) { // IE and 360 compatibility mode
                    confirmButton.attachEvent('onclick', function() {
                        warningDiv.style.display = 'none'; // 关闭警示框
                        var form = document.getElementById(formId);
                        if (form) {
                            form.submit(); // 提交表单
                        }
                    });
                } else {
                    confirmButton.addEventListener('click', function() {
                        warningDiv.style.display = 'none'; // 关闭警示框
                        var form = document.getElementById(formId);
                        if (form) {
                            form.submit(); // 提交表单
                        }
                    });
                }

                return false; // 阻止默认提交，等待用户确认
            }
        }
    });
})();