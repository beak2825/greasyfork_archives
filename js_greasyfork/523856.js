// ==UserScript==
// @name         网址纠错
// @namespace    https://xiaote.data.blog/wzjc
// @version      1.4.2
// @description  在您访问了错误的网址时提示您，并可设置白名单和删除白名单
// @author       xiaote_XT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
//https://update.greasyfork.org/scripts/523856/%E7%BD%91%E5%9D%80%E7%BA%A0%E9%94%99.meta.js
//https://scriptcat.org/scripts/code/2639/%E7%BD%91%E5%9D%80%E7%BA%A0%E9%94%99.user.js
// @downloadURL https://update.greasyfork.org/scripts/523856/%E7%BD%91%E5%9D%80%E7%BA%A0%E9%94%99.user.js
// @updateURL https://update.greasyfork.org/scripts/523856/%E7%BD%91%E5%9D%80%E7%BA%A0%E9%94%99.meta.js
// ==/UserScript==


var text1 = "您可能想要访问的可能是";
var text2 = "，是否需要跳转至推荐网址？";


//设置界面-头
(function () {
    'use strict';

    // 从存储中获取白名单，如果没有则默认为空数组
    let whitelist = loadWhitelist();

    // 注册一个菜单命令，用于打开设置界面
    GM_registerMenuCommand("网址纠错白名单设置", openSettings);

    function loadWhitelist() {
        let storedWhitelist = GM_getValue('whitelist', '[]');
        console.log('Loaded whitelist:', storedWhitelist);
        return JSON.parse(storedWhitelist);
    }

    function saveWhitelist() {
        let whitelistString = JSON.stringify(whitelist);
        console.log('Saving whitelist:', whitelistString);
        GM_setValue('whitelist', whitelistString);
    }

    function openSettings() {
        // 创建一个包含设置界面的 div 元素
        let settingsDiv = document.createElement('div');
        settingsDiv.id = 'urlCorrectionSettings';
        settingsDiv.style.position = 'fixed';
        settingsDiv.style.top = '50%';
        settingsDiv.style.left = '50%';
        settingsDiv.style.transform = 'translate(-50%, -50%)';
        settingsDiv.style.backgroundColor = 'white';
        settingsDiv.style.padding = '20px';
        settingsDiv.style.border = '1px solid black';
        settingsDiv.style.zIndex = '9999';//层级设置，确保在最高层

        // 创建输入框和按钮元素
        let html = `
            <h2>网址纠错白名单设置</h2>
            <h4>操作说明</h4>
            <h5>输入：点击“添加白名单网址:”后空白处可输入内容</h5>
            <h5>添加：点击“添加”添加至白名单(添加后需要点“保存”)</h5>
            <h5>保存：点击“保存”保存修改后的白名单</h5>
            <h5>取消：点击“取消”不执行任何修改并关闭此窗口</h5>
            <h5>删除：点击对应网址后的“删除”删除对应网址</h5>
            <label for="whitelistInput">添加白名单网址：</label>
            <input type="text" id="whitelistInput"><br>
            <button id="addButton">添加</button>
            <button id="saveButton">保存</button>
            <button id="cancelButton">取消</button>
            <h3>当前白名单：</h3>
            <ul id="whitelistList"></ul>
            <h6><br>访问https://xiaote.design.blog/yhjb获取更多</h6>
        `;
        settingsDiv.innerHTML = html;

        // 填充当前白名单列表
        let whitelistList = settingsDiv.querySelector('#whitelistList');
        for (let url of whitelist) {
            let listItem = document.createElement('li');
            listItem.textContent = url;
            listItem.innerHTML += ` <button class="removeButton">删除</button>`;
            whitelistList.appendChild(listItem);
        }

        // 添加样式
        GM_addStyle(`
            #urlCorrectionSettings input, #urlCorrectionSettings button {
                margin: 5px;
            }
            #urlCorrectionSettings ul {
                list-style-type: none;
                padding: 0;
            }
          .removeButton {
                margin-left: 10px;
            }
        `);

        // 添加按钮点击事件
        settingsDiv.querySelector('#addButton').addEventListener('click', () => {
            let input = settingsDiv.querySelector('#whitelistInput');
            let url = input.value;
            if (url) {
                whitelist.push(url);
                let listItem = document.createElement('li');
                listItem.textContent = url;
                listItem.innerHTML += ` <button class="removeButton">删除</button>`;
                whitelistList.appendChild(listItem);
                input.value = '';
                saveWhitelist(); // 保存白名单
            }
        });

        settingsDiv.querySelector('#saveButton').addEventListener('click', () => {
            saveWhitelist();
            closeSettings();
        });

        settingsDiv.querySelector('#cancelButton').addEventListener('click', () => {
            closeSettings();
        });

        // 为删除按钮添加事件监听
        settingsDiv.querySelectorAll('.removeButton').forEach(button => {
            button.addEventListener('click', () => {
                let listItem = button.parentNode;
                let url = listItem.textContent.replace('删除', '').trim();
                let index = whitelist.indexOf(url);
                if (index > -1) {
                    whitelist.splice(index, 1);
                    listItem.remove();
                    saveWhitelist();
                    alert("删除成功")
                }
            });
        });

        // 将设置界面添加到页面
        document.body.appendChild(settingsDiv);
    }

    function closeSettings() {
        let settingsDiv = document.getElementById('urlCorrectionSettings');
        if (settingsDiv) {
            document.body.removeChild(settingsDiv);
        }
    }
    //设置界面-尾

    // 使用对象存储错误网址和对应的正确网址及网站名称
    let urlMap = {
        "bilibil.com": ["https://bilibili.com", "哔哩哔哩"],//b站
        "douying.com": ["https://douyin.com", "抖音"],//抖音
        "baidv.com": ["https://baidu.com", "百度"],//百度
        "alibaba.com": ["https://taobao.com", "淘宝"],//阿里巴巴海外版转至淘宝
        "ta0bao.com": ["https://taobao.com", "淘宝"],//淘宝
        "1668.com": ["https://1688.com", "阿里巴巴1688"],//阿里1688
        "sinq.com.cn": ["https://sina.com.cn", "新浪网"],//新浪网
        "168.com": ["https://163.com", "网易"],//网易
        "jdl.cn": ["https://jd.com", "京东"],//京东
        "wei6o.com": ["https://weibo.com", "微博"],//微博
        "iqiy1.com": ["https://iqiyi.com", "爱奇艺"],//爱奇艺
        //qq.com诱导性网站字典
        "v.qqq.com": ["https://v.qq.com", "腾讯视频"],
        "360123.com": ["https://qq.com", "腾讯网"],
        "lo1.qq.com": ["https://lol.qq.com", "英雄联盟官网"],
        "pvp.qqq.com": ["https://pvp.qq.com", "王者荣耀官网"],
        "mp.weix1n.qq.com": ["https://mp.weixin.qq.com", "微信公众平台"],
        "qzoen.qq.com": ["https://qzone.qq.com", "QQ空间"],
        "qql.com": ["https://qq.com", "腾讯网"],
        //
        "youk1.com": ["https://youku.com", "优酷"],//优酷
        "ba1du.com": ["https://baidu.com", "百度"],//百度
        "sogov.com": ["https://sogou.com", "搜狗搜索"],//搜狗
        "sougou.com": ["https://sogou.com", "搜狗搜索"],//搜狗
        "soo.com": ["https://so.com", "360搜索"],//360搜索
        "163.com/gamez": ["https://163.com/games", "网易游戏"],//网易
        "www.icbc1.com.cn": ["https://www.icbc.com.cn", "中国工商银行"],//工商银行
        "www.cmbch1na.com": ["https://www.cmbchina.com", "招商银行"],//招商银行
        "www.al1pay.com": ["https://www.alipay.com", "支付宝"],//支付宝
        "59.com": ["https://58.com", "58同城"],//58同城
        "ctripp.com": ["https://ctrip.com", "携程旅行"],//携程旅行
        "www.dianp1ng.com": ["https://www.dianping.com", "大众点评"],//大众点评
        "wenku.ba1du.com": ["https://wenku.baidu.com", "百度文库"],//百度文库
        "blog.csd1.net": ["https://blog.csdn.net", "CSDN博客"],//流氓博客
        "zhih1.com": ["https://zhihu.com", "知乎"],//知乎
        "tout1ao.com": ["https://toutiao.com", "今日头条"],//头条
        "lfeng.com": ["https://ifeng.com", "凤凰网"],//凤凰网
        "thepaperr.cn": ["https://thepaper.cn", "澎湃新闻"],//澎湃新闻
        "xiaote.com": ["https://xiaote.data.blog", "小特网"],//小特网
        //Chrome诱导性网站字典
        "chrome.zuitie.cn": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://www.goguge.com/": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://www8.aldeee.com/pcsoftware/llq/519885.html": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://google-chrom.cn/": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://xiazai.zol.com.cn/detail/33/327560.shtml": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "www.chrome.net.cn": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "http://chrome.stywru.cn/": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://www.bear20.com/window/4211/472030921.html?f=bdj_695886": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://chrome.cmrrs.com/": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://baoku.360.cn/sinfo/104384025_4002818.html": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://chromcn.cn/": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://chrome.softbd.cn/": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "http://soft.wxxznkj.cn/": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://soft7.ydxiazai.com/pcgame/fps/764276.html": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://sem.duba.net/sem/childbd/f336.html?sfrom=196&keyID=000017&TFT=3&msclkid=94b7b1bd86061e331528d6343bdc9af2": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        //可能需要访问Chrome下载地址的网址
        "https://cn.bing.com/search?q=%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://www.pcsoft.com.cn/article/61837.html": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        "https://sogou.com/web?query=谷歌浏览器": ["https://www.google.cn/intl/zh-CN/chrome/", "Chrome官方下载页"],
        //Microsoft365诱导性官网字典
        "https://ms.shuangon.cn/": ["https://www.office.com/", "Microsoft365(原Microsoft Office)"],
        "https://rj.dbhnj888.top/": ["https://www.office.com/", "Microsoft365(原Microsoft Office)"],
        "https://office.sujieo.cn/": ["https://www.office.com/", "Microsoft365(原Microsoft Office)"],
        "https://www.microsoftstore.com.cn/": ["https://www.office.com/", "Microsoft365(原Microsoft Office)"],
        "https://mydown.yesky.com/pcsoft/349610100.html": ["https://www.office.com/", "Microsoft365(原Microsoft Office)"],
        "https://www.so.com/s?q=%E5%BE%AE%E8%BD%AF%E5%8A%9E%E5%85%AC": ["https://www.office.com/", "Microsoft365(原Microsoft Office)"],
        // "91.com": ["https://www.office.com/", "Microsoft365(原Microsoft Office)"],
        //
        "91.com": ["https://xiaote.data.blog", "小特网"],
        "91.com": ["https://xiaote.data.blog", "小特网"],
        "91.com": ["https://xiaote.data.blog", "小特网"]
        // 可以继续添加更多的键值对
    };

    // 从 sessionStorage 中获取 hasCancelled 的状态，如果不存在则默认为 false
    let hasCancelled = sessionStorage.getItem('hasCancelled') === 'true';


    function checkAndCorrectUrl() {
        let currentUrl = window.location.href;
        for (let wrongUrl in urlMap) {
            let [correctUrl, siteName] = urlMap[wrongUrl];
            let currentUrlObj = new URL(currentUrl);
            let isInWhitelist = false;
            for (let whiteUrl of whitelist) {
                if (new URL(whiteUrl).href === currentUrlObj.href) {
                    isInWhitelist = true;
                    break;
                }
            }
            if (currentUrl.includes(wrongUrl) &&!hasCancelled &&!isInWhitelist) {
                if (confirm(`${text1} ${siteName}（${correctUrl}）${text2}`)) {
                    window.location.href = correctUrl;
                } else {
                    hasCancelled = true;
                    sessionStorage.setItem('hasCancelled', 'true');
                }
            }
        }
    }


    checkAndCorrectUrl();
})();