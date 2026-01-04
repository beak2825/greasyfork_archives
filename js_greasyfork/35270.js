// ==UserScript==
// @name        LT后台中文化
// @namespace   http://tampermonkey.net/
// @description 实验性脚本, 尚有内容未翻译完毕。
// @include     *.allstar18.com/*
// @version     0.3
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35270/LT%E5%90%8E%E5%8F%B0%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/35270/LT%E5%90%8E%E5%8F%B0%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

var translation = {
    'body': {
        'Yes': '是',
        'No': '否',

        'All': '所有',
        'Pending': '处理中',
        'Approved': '成功',
        'Rejected': '拒绝',
        'Vendor Processing': '管理员处理',
        'Require Check': '需要检查',

        //Menu
        'Payment': '财务',
        'Deposit': '存款',
        'Withdrawal': '提款',
        'Funds Transfer': '转账',
        'Adjustment': '帐变',
        'Adjustment Management': '帐变管理',
        'Adjustment Summary Report': '帐变总结报告',
        'Blacklist': '黑名单',
        'Payment Blacklist': '付款黑名单',
        'Bank Account Blacklist': '银行帐户黑名单',
        'Local Bank': '本地银行',
        'Offline Bank Setting': '离线银行设置',
        'Setting': '设置',
        'Jarvis Setting': 'Jarvis设置',
        'Time Range Setting': '时间范围设置',
        'Payment Risk Edit(Batch)': '付款风险编辑（批）',

        'Member Data': '会员资料',
        'News Center': '公告中心',
        'Change Password': '修改密码',
        'Logout': '登出账号',
        'Player Info': '玩家信息',
        'CSD': 'CSD',
        'Call Log': '对话记录',
        'Member Call Log': '成员通话记录',
        'Overview': '概貌',
        'Summary': '概要',
        'Performance': '表现',
        'Uploader': '上传',
        'Bonus': '奖金',
        'Bonus Management V2': '奖金管理 V2',
        'Player Bonus': '玩家奖金',
        'Bonus Report': '奖金报告',
        'Bonus Management': '奖金管理 V2',
        'Bonus Management (Beta)': '奖金管理（测试版）',
        'Player Bonus (Beta)': '玩家奖金（测试版）',
        'Bonus Report (Beta)': '奖金报告（测试版）',
        'Player Bonus Record(Beta)': '玩家奖金记录（测试版）',
        'Rebates': '返水',
        'Rebate Management': '返水管理',
        'Player Rebate Management': '玩家返水管理',
        'Batch Rebate Management': '批量返水管理',
        'Report': '报告',
        'Member Winloss Report': '会员输赢报告',
        'Monte Carlo (MGSQF)': 'Monte Carlo (MGSQF)',
        'Top Trend Gaming (AM)': 'Top Trend Gaming (AM)',
        'PlayTech (PT)': 'PlayTech (PT)',
        'BetSoft Gaming (BSG)': 'BetSoft Gaming (BSG)',
        'GamesOS (GOS)': 'GamesOS (GOS)',
        'Gold Deluxe (GD)': 'Gold Deluxe (GD)',
        'Laxino (LX)': 'Laxino (LX)',
        'Spade Gaming (SPG)': 'Spade Gaming (SPG)',
        '2nd Deposit Report': '二次存款报告',
        'Survey': '调查',
        'Language': '语言',
        'Feedback': '反馈',
        'Link': '链接',
        'Admin': '管理员',
        'Announcement': '公告',
        'Promotion': '优惠',
        'Applicants': '申请人',
        'Giveaway Applicant': '赠送申请人',
        'Mobile Feed Management': '手机回馈管理',

        //存款
        'Deposit Information': '存款信息',
        'Payment Gateway': '支付网关',
        'Submitted Date': '提交日期',
        'Currency': '货币',
        'Sort': '类别',
        'Member Code': '会员账号',
        'Status': '状态',
        'Deposit ID': '存款ID',
        'Date Processed': '处理日期',
        'Reference No': '参考编号',
        'Hold Withdrawal': '冻结提款',
        'Fund In Bank': '收款银行',
        'Waiting': '等待',
        'Site': '来源',
        'Member VVIP/VIP and blacklisted': 'VVIP / VIP会员黑名单',
        'Member VVIP/VIP': 'VVIP / VIP会员',
        'Member blacklisted': '黑名单会员',
        'Deposit in \'Waiting\' status"': '等待中的存款',
        'Count': '计数',
        'Amount': '金额',
        'Sum Charges': '总额度',
        'Sum Net Amount': '总净额度',

        //提款
        'Withdrawal Information': '提款信息',
        'Withdrawal ID': '提款ID',
        'Payout Bank': '出款银行',
        'Charges': '收费',
        'Processing Fee': '手续费',
        'Total Amt': '总金额',
        'Net Amt': '净金额',

        //转账
        'Funds Transfer Information': '资金转账信息',
        'Transaction Date': '转账日期',
        'Product': '平台',
        'into': '至',
        'Product TimeZone': '时区',

        //帐变
        'Submitted By': '提交人',
        'Date Submited': '提交日期',
        'to': '至',
        'Adjustement ID': '帐变ID',
        'Date Updated': '更新日期',
        'Category': '帐变类型',
        'Account': '帐户',
        'Use Product Timezone': '使用平台时区',
        'File Name :': '文件名：',

        'Adjustment Report': '帐变报告',
        'Date From:': '日期从：',
        'Date To:': '至：',
        'Currency:': '货币：',
        'Status:': '状态：',
        'Account:': '帐户：',


    }
};

var _each = function (arr, eachCb, defValue) {
    if (!arr || !arr.length) return ;

    for (var i = arr.length, ret; i-- ; )
        // If there's something to return, then return it.
        if (ret = eachCb (arr[i], i))
            return ret;

    return defValue ;
};

var doesNodeMatch = (function (doc) {
    var matches = doc.matches || doc.mozMatchesSelector || doc.oMatchesSelector || doc.webkitMatchesSelector;

    return matches ? function (what, selector) {
        return matches.call (what, selector);
    } : function () {
        // No matche selector :<
        return false;
    };
}) (document.documentElement);

// 寻找翻译
var findTranslation = function (domSelector, origionalContent) {
    // Not string or undefined etc.
    if (!origionalContent) return null;

    var tmpNodeContent    = origionalContent.trim(),
        translatedContent = translation[domSelector][tmpNodeContent];

    // Empty string.
    if (!tmpNodeContent) return origionalContent;

    // Language string match!
    if (translatedContent) return translatedContent;

    // Check weather it has regex matches.
    if (!translation[domSelector].hasOwnProperty('__regex')) return null;

    // Check regex match.
    return _each (translation[domSelector].__regex, function (regex) {
        if (regex[0].test (tmpNodeContent))
            return String.prototype.replace.apply (tmpNodeContent, regex);
    });
};

var fixInput = function (domSelector, inputDom) {
    // 搜索框
    if (translatedContent = findTranslation(domSelector, inputDom.getAttribute ('placeholder') || ''))
        inputDom.setAttribute ('placeholder', translatedContent);

    // 提交按钮
    if (translatedContent = findTranslation(domSelector, inputDom.value || ''))
        inputDom.value = translatedContent;
};

var translateNode = function (domSelector, domNode) {
    // Fix input element
    if (domNode.nodeName == 'INPUT') {
        fixInput (domSelector, domNode);
        return ;
    }

    // Loop through all text nodes:
    // http://stackoverflow.com/a/2579869/3416493
    var walker = document.createTreeWalker(domNode, 4 /* NodeFilter.SHOW_TEXT */, function (textNode) {
        // Makesure not translating the code.
        // !parent > textNode should always be an element.
        if (doesNodeMatch(textNode.parentNode, 'pre, pre span, code'))
            return 2 /* NodeFilter.FILTER_REJECT */;

        return 1 /* NodeFilter.FILTER_ACCEPT */;
    }, false),
        node, translatedContent;

    // Loop through text nodes.
    while (node = walker.nextNode())
        if (translatedContent = findTranslation (domSelector, node.nodeValue))
            node.nodeValue = translatedContent;

    // Loop through inputs.
    _each (domNode.getElementsByTagName ('input'), fixInput.bind({}, domSelector));
};

var translateContent = function (domSelector, base) {
    _each (base.querySelectorAll (domSelector), translateNode.bind({}, domSelector));
};

var cbTranslate = function (base) {
    if (base.nodeType != 1)
        /**
		 * Node.nodeType:
		 * ELEMENT_NODE 	1
		 * TEXT_NODE 		3
		 */
        return ;

    for (var x in translation) {
        if (translation.hasOwnProperty (x)) {
            if (doesNodeMatch (base, x)) {
                translateNode (x, base);
            } else {
                translateContent (x, base);
            }
        }
    }
};

var mo = new MutationObserver (function (m) {
    _each (m, function (q) {
        _each (q.addedNodes, function (e) {
            if (e.className && e.className.indexOf ('firebug') != -1)
                return ;

            cbTranslate (e);
        });
    });
});

mo.observe (document, {
    childList: true,
    subtree: true,
    characterData: true
});

addEventListener ('DOMContentLoaded', function () {
    cbTranslate (document.body);
}, false);