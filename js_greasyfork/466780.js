// ==UserScript==
// @name             b站视频评论区规则屏蔽黑名单
// @namespace    /DBI/bili-reply-blacklist
// @version          0.1
// @description   按自定义的规则 (昵称, uid, 评论内容, 等级; 等于, 包含, 正则, 等级小于) 屏蔽 (新版) b站视频评论区的评论 (等有空再完善其他类型的评论区)
// @author          DBI
// @match           https://www.bilibili.com/video/*
// @icon              https://www.bilibili.com/favicon.ico
// @run-at          document-start
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @grant           GM_setClipboard
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/466780/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%A7%84%E5%88%99%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466780/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%A7%84%E5%88%99%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function (callback) {
	const wait = () => setTimeout(() => {
		if (document.querySelector('#comment > div > div > div > div.reply-warp > div.reply-list')) {
			console.log('[b站评论区黑名单] 正在运行');
			callback();
		} else {
			wait();
		}
	}, 10);
	wait();
})( () => {
    // 黑名单规则列表
    // 格式: [ { type: 'usernameEqual', value: '233' } ]
    let blacklist = GM_getValue("blacklist", []);
    // 支持的黑名单规则类型
    const blacklistTypes = {
        usernameEqual    : { display: '昵称等于', label: '昵称为 xxx 则屏蔽'                     , help: '若昵称等于输入的内容则屏蔽该评论, 区分大小写.' },
        usernameHas       : { display: '昵称包含', label: '昵称包含 xxx 则屏蔽'                  , help: '若昵称包含输入的内容则屏蔽该评论, 区分大小写.' },
        usernameRegexp : { display: '昵称正则', label: '昵称匹配正则表达式 xxx 则屏蔽' , help: '若昵称匹配输入的正则表达式则屏蔽该评论. 正则表达式在线测试网站: https://regexr-cn.com/' },
        uidEqual               : { display: 'uid等于' , label: 'uid为 xxx 则屏蔽'                       , help: '若uid为输入的内容则屏蔽该评论.' },
        replyHas               : { display: '评论包含', label: '评论包含 xxx 则屏蔽'                 , help: '若评论包含输入的内容则屏蔽该评论, 区分大小写.' },
        replyEqual            : { display: '评论等于', label: '评论为 xxx 则屏蔽'                     , help: '若评论为输入的内容则屏蔽该评论, 区分大小写.' },
        replyRegexp         : { display: '评论正则', label: '评论匹配正则表达式 xxx 则屏蔽' , help: '若评论内容匹配输入的正则表达式则屏蔽该评论. 正则表达式在线测试网站: https://regexr-cn.com/' },
        levelUnder            : { display: '等级小于', label: '等级小于 x 则屏蔽'                     , help: '若评论者的等级 (lv) 小于输入值 (阿拉伯数字, 0-7, 不含本数; 硬核会员 (lv6 + 小闪电) 表示为 7) 则屏蔽该评论.' },
    };
    // 得到 "用于友好地向用户展示规则列表" 的文本
    const getBlasklistDisplayText = () => {
        // 黑名单规则个数
        let blacklistLength = blacklist.length;
        // 如果没有规则
        if (blacklistLength < 1) return "目前没有任何黑名单规则.\n";
        let t = "以下是所有规则, 若显示不完全请按键盘上的 F12 并在打开的页面进入控制台 (Console) 查看:\n规则ID   规则类型    值\n";
        for (let i = 0; i < blacklistLength; i++) {
            let rule = blacklist[i];
            let type = blacklistTypes[rule.type].display;
            t += `${i}        ${type}      ${rule.value}\n`;
        }
        return t;
    };
    GM_registerMenuCommand("展示黑名单规则列表", () => {
        const b = getBlasklistDisplayText();
        console.log(b);
        alert(b);
    });
    // 循环为脚本设置增加 "添加规则" 选项
    for (let typeName in blacklistTypes) {
        let type = blacklistTypes[typeName];
        GM_registerMenuCommand("添加规则: " + type.label, () => {
            let value = prompt(`[${type.label}]\n${type.help}`);
            if (!value) return;
            if (typeName == 'levelUnder' && isNaN(value * 1)) return;
            blacklist.push({ type: typeName, value});
            GM_setValue('blacklist', blacklist);
            alert('添加成功, 刷新页面后生效');
        });
    }
    GM_registerMenuCommand("删除某个规则", () => {
        console.log(getBlasklistDisplayText());
        const id = prompt("输入规则ID即可删除黑名单规则.\n" + getBlasklistDisplayText());
        // 输入为空就 return
        if (id == '' || isNaN(id * 1) || id < 0 || id >= blacklist.length) return;
        // 删除黑名单规则数组对应下标的元素
        blacklist.splice(id * 1, 1);
        // 保存
        GM_setValue('blacklist', blacklist);
        alert('删除成功, 刷新页面后生效');
    });
    GM_registerMenuCommand("导出规则列表", () => {
        const blacklistText = JSON.stringify(blacklist);
        GM_setClipboard(blacklistText, 'text');
        alert("以下是导出的规则列表, 已复制到剪贴板:\n\n" + blacklistText);
    });
    GM_registerMenuCommand("导入规则列表", () => {
        const blacklistText = prompt("请在下面的输入框粘贴规则, 新规则将与旧规则合并.");
        if (!blacklistText) return;
        let theBlacklist = [];
        // 输入若非 JSON 则 return
        try { theBlacklist = JSON.parse(blacklistText); } catch { return; }
        // 合并
        // 不直接 [...blacklist, ...theBlacklist] 是因为无法判断输入 JSON 是否符合 blacklist 格式
        theBlacklist.forEach(rule => {
            if (!blacklistTypes[rule.type] || !rule.value) return;
            blacklist.push({ type: rule.type, value: rule.value});
        });
        // 保存
        GM_setValue('blacklist', blacklist);
        const blasklistDisplayText = getBlasklistDisplayText()
        console.log(blasklistDisplayText);
        alert("导入成功, 刷新页面后生效.\n" + blasklistDisplayText);
    });
    let isHighlightBlackReply = GM_getValue("isHighlightBlackReply", false);
    GM_registerMenuCommand((isHighlightBlackReply ? '[✔️已启用]' : '[❌已禁用]') + " 高亮符合规则的评论而不是删除", () => {
        isHighlightBlackReply = !isHighlightBlackReply;
        GM_setValue('isHighlightBlackReply', isHighlightBlackReply);
        alert("高亮符合规则的评论而不是删除.\n将会以红色为背景色将符合黑名单规则的评论高亮而不是删除, 用来测试目标评论是否被规则匹配.\n目前已" + (isHighlightBlackReply ? '启用' : '禁用') + ", 刷新页面后生效.")
    });

    // 正式的脚本逻辑

    // 选择需要监视变动的节点
    const targetNode = document.querySelector('#comment > div > div > div > div.reply-warp > div.reply-list');
    // 监视包括子元素
    const config = { attributes: false, childList: true, subtree: true };
    // 根据提供的信息返回是否在用户定义的屏蔽规则 (黑名单) 里
    const isInBlacklist = ({ username = '', uid = '0', reply = '', level = '0' }) => {
        username = username.trim();
        reply = reply.trim();
        level *= 1;
        // 昵称是否包含字符串
        for (let rule of blacklist) {
            switch (rule.type) {
                case 'usernameEqual':
                    // 昵称等于
                    if (username == rule.value) return true;
                    break;
                case 'usernameHas':
                    // 昵称含有
                    if (username.includes(rule.value)) return true;
                    break;
                case 'usernameRegexp':
                    // 昵称正则
                    if ((new RegExp(rule.value)).exec(username) != null) return true;
                    break;
                case 'uidEqual':
                    // uid 等于
                    if (uid == rule.value) return true;
                    break;
                case 'replyHas':
                    // 评论包含
                    if (reply.includes(rule.value)) return true;
                    break;
                case 'replyEqual':
                    // 评论等于
                    if (reply == rule.value) return true;
                    break;
                case 'replyRegexp':
                    // 评论正则
                    if ((new RegExp(rule.value)).exec(reply) != null) return true;
                    break;
                case 'levelUnder':
                    // 等级小于
                    if (level < (rule.value * 1)) return true;
                    break;
            }
        };
        return false;
    };
    // 处理评论的回复 (div.sub-reply-item)
    const processSubReplyItem = node => {
       // 获取用户名所在 div
        const usernameElement = node.querySelector('div.sub-user-info > div.sub-user-name');
        // 获取等级图标元素
        const levelElement = node.querySelector('div.sub-user-info > i.sub-user-level');
        // 存放评论内容的 span
        const replyElement = node.querySelector('span.reply-content-container.sub-reply-content > span.reply-content');
        // 从等级图标元素的 class 里获取等级
        let level = '';
        // 是否为硬核会员 (lv6 + 小闪电, level-hardcore)
        if (levelElement.classList.contains('level-hardcore')) {
            // 是硬核会员
            level = '7';
        } else {
            // 不是硬核会员, 需要遍历 class 寻找
            for (let theClass of levelElement.classList) {
                // 用正则表达式寻找
                let regexrLevel = (/(?:level\-)(\d)/gim).exec(theClass);
                if (regexrLevel) {
                    // 找到了
                    level = regexrLevel[1];
                    // 不用再找了
                    break;
                }
            }
        }
        // 最终得到的信息
        const infos = {
            username: usernameElement.innerText ?? '',
            // uid 在 用户名元素 的 dataset 里有
            uid: usernameElement.dataset.userId ?? '',
            reply: replyElement.innerText ?? '',
            level,
        };
        // 如果在黑名单规则里则移除元素
        if (isInBlacklist(infos)) {
            if (isHighlightBlackReply) {
                node.style.backgroundColor = 'red';
            } else {
                node.remove();
            }
        }
    };
    // 处理评论 (div.reply-item)
    const processReplyItem = node => {
        // 获取用户名所在 div
        const usernameElement = node.querySelector('div.root-reply-container > div.content-warp > div.user-info > div.user-name');
        // 获取等级图标元素
        const levelElement = node.querySelector('div.root-reply-container > div.content-warp > div.user-info > i.user-level');
        // 存放评论内容的 span
        const replyElement = node.querySelector('div.root-reply-container > div.content-warp > div.root-reply > span.reply-content-container.root-reply > span.reply-content');
        // 从等级图标元素的 class 里获取等级
        let level = '';
        // 是否为硬核会员 (lv6 + 小闪电, level-hardcore)
        if (levelElement.classList.contains('level-hardcore')) {
            // 是硬核会员
            level = '7';
        } else {
            // 不是硬核会员, 需要遍历 class 寻找
            for (let theClass of levelElement.classList) {
                // 用正则表达式寻找
                let regexrLevel = (/(?:level\-)(\d)/gim).exec(theClass);
                if (regexrLevel) {
                    // 找到了
                    level = regexrLevel[1];
                    // 不用再找了
                    break;
                }
            }
        }
        // 最终得到的信息
        const infos = {
            username: usernameElement.innerText ?? '',
            // uid 在 用户名元素 的 dataset 里有
            uid: usernameElement.dataset.userId ?? '',
            reply: replyElement.innerText ?? '',
            level,
        };
        // 判断是否在黑名单里
        if (isInBlacklist(infos)) {
            // 如果在黑名单规则里
            // 高亮或移除元素
            if (isHighlightBlackReply) { node.style.backgroundColor = 'red'; } else { node.remove(); }
            // 无需继续处理评论的回复
            return;
        }
        // 处理评论的回复
        // 得到回复的列表
        const subReplies = node.querySelectorAll('div.sub-reply-container > div.sub-reply-list > div.sub-reply-item');
        // 遍历, 处理
        subReplies.forEach(subReply => processSubReplyItem(subReply));
    };
    // 有变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        // 遍历监视结果 (此结果包括所有变动, 增删改)
        for (let mutation of mutationsList) {
            // 遍历增加的节点列表
            for (let node of mutation.addedNodes) {
                // 如果是纯文本节点则忽略
                if (!node.classList) continue;
                // 判断是评论还是评论的回复
                if (node.classList.contains('sub-reply-item')) {
                    // 如果是评论的回复
                    processSubReplyItem(node);
                } else if (node.classList.contains('reply-item')) {
                    // 如果是评论
                    processReplyItem(node);
                }
            }
        }
    };
    // 创建一个监视器实例并传入回调函数
    const observer = new MutationObserver(callback);
    // 以上述配置开始监视目标节点
    observer.observe(targetNode, config);
});


// 附:
// MutationObserver API 参考: https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
