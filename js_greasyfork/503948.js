// ==UserScript==
// @name         🦄Microsoft Rewards每日任务脚本
// @version      1.1.0.0
// @description  自动完成微软Rewards每日搜索任务,每次运行时获取抖音/微博/哔哩哔哩/百度/头条热门词,避免使用同样的搜索词被封号。
// @author       Unicorn
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/
// @match        https://cn.bing.com/?*
// @match        https://cn.bing.com/search?*
// @license      GNU GPLv3
// @icon         https://az15297.vo.msecnd.net/images/rewards.png
// @connect      tenapi.cn
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/layui@2.9.16/dist/layui.js
// @namespace https://greasyfork.org/users/994905
// @downloadURL https://update.greasyfork.org/scripts/503948/%F0%9F%A6%84Microsoft%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/503948/%F0%9F%A6%84Microsoft%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

if(!GM_getValue("currentSearchCount") || GM_getValue("currentSearchCount") == null){
    GM_setValue('currentSearchCount', 0);
}
if(!GM_getValue("max_rewards") || GM_getValue("max_rewards") == null){
    GM_setValue('max_rewards', 40);
}
if(!GM_getValue("start")){
    GM_setValue('start', 0);
}

//每执行4次搜索后插入暂停时间,解决账号被监控不增加积分的问题
var pause_time = 5000; // 暂停时长建议为10分钟（600000毫秒=10分钟）
var search_words = []; //搜索词
var originalPageTitle //原始标题

//默认搜索词，热门搜索词请求失败时使用
var default_search_words = ["盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", "敏而好学，不耻下问", "海内存知已，天涯若比邻","三人行，必有我师焉",
                            "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用", "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神",
                            "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "莫等闲，白了少年头，空悲切", "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴","近朱者赤，近墨者黑",
                            "吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境", "己所不欲，勿施于人", "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少","天下兴亡，匹夫有责",
                            "人无远虑，必有近忧","为中华之崛起而读书","一日无书，百事荒废","岂能尽如人意，但求无愧我心","人生自古谁无死，留取丹心照汗青","吾生也有涯，而知也无涯","生于忧患，死于安乐",
                            "言必信，行必果","读书破万卷，下笔如有神","夫君子之行，静以修身，俭以养德","老骥伏枥，志在千里","一日不读书，胸臆无佳想","王侯将相宁有种乎","淡泊以明志。宁静而致远,","卧龙跃马终黄土"]
//{weibohot}微博热搜榜//{douyinhot}抖音热搜榜/{zhihuhot}知乎热搜榜/{baiduhot}百度热搜榜/{toutiaohot}今日头条热搜榜/
var keywords_source = ['toutiaohot','baiduhot','zhihuhot','douyinhot'];
var random_keywords_source = keywords_source[Math.floor(Math.random() * keywords_source.length)]
var current_source_index = 0; // 当前搜索词来源的索引

// 引入Layui库
// 原始地址: //cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/css/layui.css
// 名称: layui
// 版本: 2.9.14
// 根据Greasy Fork 的要求：“库是应被 @require 的脚本，除非因为技术原因不能这么做。如果一个库被内嵌入了脚本，那么你必须一并提供库的来源（比如一行评论指向原始地址、名称以及版本）。”
// 由于技术原因，我们无法直接引入css外部代码，故使用如下方法引入
// 这是 Greasy Fork 允许的 CDN 列表。详见：https://greasyfork.org/zh-CN/help/cdns
document.head.insertAdjacentHTML('beforeend', '<link href="//cdnjs.cloudflare.com/ajax/libs/layui/2.9.14/css/layui.css" rel="stylesheet">');

//获取网页原始标题
window.onload = function() {
    originalPageTitle = document.title;
    initElement()
};

let wakeLock = null;

// 请求唤醒锁函数
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active!');
    } catch (err) {
        console.error(`Failed to acquire wake lock: ${err.message}`);
    }
}

// 释放唤醒锁函数
async function releaseWakeLock() {
    if (wakeLock) {
        try {
            await wakeLock.release();
            console.log('Wake Lock was released.');
            wakeLock = null;
        } catch (err) {
            console.error(`Failed to release wake lock: ${err.message}`);
        }
    }
}

// 当页面隐藏时释放唤醒锁
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && wakeLock) {
        releaseWakeLock();
    }
});


// 初始化页面元素
async function initElement() {
    // 获取当前搜索次数
    let currentSearchCount = GM_getValue('currentSearchCount');
    // 初始化一个按钮，并当作功能栏
    var ctrl_btn = document.createElement("div");
    // 一些样式定义，一行三个，节省空间
    ctrl_btn.style.position = 'fixed'; ctrl_btn.style.height = '3rem'; ctrl_btn.style.width = '3rem';
    ctrl_btn.style.backgroundImage = "url('https://s1.ax1x.com/2023/01/31/pS0yjEQ.png'), url('https://s11.ax1x.com/2024/02/10/pF3g0HK.png')";
    ctrl_btn.style.backgroundSize = '2rem 2rem'; ctrl_btn.style.backgroundColor = 'white'; ctrl_btn.style.borderRadius = '1.5rem';
    ctrl_btn.style.boxShadow = '0px 0px 20px -4px Gray'; ctrl_btn.style.backgroundRepeat = 'no-repeat'; ctrl_btn.id = 'ctrl_btn';
    ctrl_btn.style.right = '1rem'; ctrl_btn.style.bottom = '10rem'; ctrl_btn.style.backgroundPosition = 'center';
    ctrl_btn.style.cursor = "pointer";
    ctrl_btn.style.zIndex = 9999;
    // 设置鼠标悬停时的背景图片
    ctrl_btn.addEventListener('mouseover', function() {
        // 添加过渡效果
        this.style.transition = "background-image 0.4s ease";
        // 切换到预加载图片
        this.style.backgroundImage = "url('https://s11.ax1x.com/2024/02/10/pF3g0HK.png'), url('https://s1.ax1x.com/2023/01/31/pS0yjEQ.png')";
        //ctrl_btn.style.backgroundColor = "#adadad";
    });

    // 设置鼠标移出时恢复默认背景图片
    ctrl_btn.addEventListener('mouseout', function() {
        // 添加过渡效果
        this.style.transition = "background-image 0.4s ease";
        // 切换图片
        this.style.backgroundImage = "url('https://s1.ax1x.com/2023/01/31/pS0yjEQ.png')";
    });

    ctrl_btn.onclick = function (e) {
        // 显示工具栏
        layer.open({
            type: 1,
            area: ['auto', 'auto'], //宽高
            anim: 2,
            content: content,
            title: "设置",
            shadeClose: true,
            success: function(layero, index){
                updateState()
                // 获取输入框元素
                const previousSearchInput = document.getElementById("previous-search");
                const maxSearchInput = document.getElementById("max-search");
                const startBtn = document.getElementById("start-btn");
                const resetBtn = document.getElementById("reset-btn");

                previousSearchInput.onblur = function updateSearchCount() {
                    if(previousSearchInput.value === ''){
                        layer.msg("不能为空")
                    } else{
                        // 在失去焦点时执行的代码
                        GM_setValue('currentSearchCount', parseInt(previousSearchInput.value));
                        layer.tips(`当前搜索次数设置为${parseInt(previousSearchInput.value)}`, this, {tips: 1});
                        restoreToOriginalTitle()
                        UpdateTitle()
                        updateState()
                    }
                }

                maxSearchInput.onblur = function updateMaxCount() {
                    if(maxSearchInput.value === ''){
                        layer.msg("不能为空")
                    } else{
                        // 在失去焦点时执行的代码
                        GM_setValue('max_rewards', parseInt(maxSearchInput.value));
                        layer.tips(`最大搜索次数设置为${parseInt(maxSearchInput.value)}`, this, {tips: 1});
                        restoreToOriginalTitle()
                        UpdateTitle()
                        updateState()
                    }
                }

                startBtn.onclick = function start() {
                    let IsStart = GM_getValue('start');
                    // 开始按钮点击事件的代码
                    let start_btn = document.getElementById('start-btn');
                    if (IsStart === 0){
                        //暂停状态
                        start_btn.innerText = "开始";
                        GM_setValue('start', 1);
                    }else{
                        //开始状态
                        start_btn.innerText = "暂停";
                        GM_setValue('start', 0);
                    }
                    updateState()
                    // 在这里添加你想要执行的代码，比如开始搜索
                }

                resetBtn.onclick = function reset() {
                    // 重置按钮点击事件的代码
                    GM_setValue('currentSearchCount', 0);
                    GM_setValue('start', 0);
                    previousSearchInput.value = GM_getValue('currentSearchCount');
                    maxSearchInput.value = GM_getValue('max_rewards');
                    restoreToOriginalTitle()
                    updateState()
                    // 在这里添加你想要执行的代码，比如重置搜索次数
                }
            }
        });
    }

    //定义一些样式（红、绿、橙色）
    const style = document.createElement('style');
    style.innerHTML = `
        .green {
          color: green;
        }
        .red {
          color: red;
        }
        .orange {
          color: orange;
        }
  `;
    document.head.appendChild(style);

    //更新状态提示文本的显示文本
    function updateState() {
        var maxRewards = GM_getValue("max_rewards");
        var currentSearchCountNumber = GM_getValue("currentSearchCount");
        let state_label = document.getElementById('state-text');
        let start_btn = document.getElementById('start-btn');
        if (state_label) {
            var startState = GM_getValue("start");
            if (currentSearchCountNumber >= maxRewards) {
                //当前搜索次数 ≥ 最大搜索次数
                startBtnText = "结束"
                state_label.innerHTML = "当前状态：<span class='red'>结束</span>";
            } else if(startState === 1){
                //开始状态
                startBtnText = "开始"
                start_btn.textContent = "暂停"
                state_label.innerHTML = "当前状态：<span class='green'>开始</span>";
            } else if(startState === 0){
                //暂停状态
                startBtnText = "暂停"
                start_btn.textContent = "开始"
                state_label.innerHTML = "当前状态：<span class='orange'>暂停</span>";
            }
        } else {
            // 元素不存在，处理错误
            console.error("未找到 ID 为 'state-text' 的元素。");
        }
    }

    var startBtnText
    var start = GM_getValue("start");
    var max_rewards = GM_getValue("max_rewards"); //重复执行的次数
    if (start === 0) {
        startBtnText = "开始"
    } else {
        startBtnText = "暂停"
    }
    var content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body{
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            background-color: #f0f0f0;
        }
        .container{
            width: auto;
            padding: 20px;
            border-radius: 8px;
        }
        h2{
            text-align: center;
            margin-bottom: 20px;
        }
        .input-group{
            margin-bottom: 20px;
        }
        label{
            display: block;
            margin-bottom: 5px;
        }
        input{
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .buttons{
            display: flex;
            justify-content: space-around;
        }
        button{
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .reset-btn{
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          background-color: #ff3b00;
          color: white;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.4s;
        }
        .reset-btn:hover {
          background-color: #ca2f00;
        }
        .reset-btn:active {
          background-color: #ca2f00;
        }

        .start-btn {
          padding: 8px 15px;
          border-radius: 4px;
          color: black;
          cursor: pointer;
          margin-left: 10px; /* 设置左边距为 10 像素 */
          margin-top: 10px;
          transition: all 0.4s;
          background-color: white;
          border: 1px solid #860086;
        }
        .start-btn:hover {
          background-color: #860086;
          color: white;
        }
        .start-btn:active {
          background-color: #860086;
          color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>设置</h2>
        <div class="input-group">
            <label for="previous-search">当前搜索次数</label>
            <input type="number" id="previous-search" value=${currentSearchCount} onblur="updateSearchCount() lay-on="test-tips-color"">
        </div>
        <div class="input-group">
            <label for="max-search">最大搜索次数</label>
            <input type="number" id="max-search" value=${max_rewards} onblur="updateMaxCount() lay-on="test-tips-color"">
        </div>
        <div class="state-group">
            <span id="state-text">当前状态:</span>
        </div>
        <div class="buttons">
            <button class="start-btn" id="start-btn" onclick="start()">${startBtnText}</button>
            <button class="reset-btn" id="reset-btn" onclick="reset()">重置</button>
        </div>
    </div>
</body>
</html>`;

    //start-btn开始按钮、pause-btn暂停按钮
    // 获取 body 元素
    const body = document.querySelector('body');
    // 将 ctrl_btn 元素追加到 body 元素中
    body.appendChild(ctrl_btn);
}

/**
 * 尝试从多个搜索词来源获取搜索词，如果所有来源都失败，则返回默认搜索词。
 * @returns {Promise<string[]>} 返回搜索到的name属性值列表或默认搜索词列表
 */
async function getTrendingSearchTerms() {
    while (current_source_index < keywords_source.length) {
        const source = keywords_source[current_source_index]; // 获取当前搜索词来源
        try {
            const response = await fetch("https://tenapi.cn/v2/" + source); // 发起网络请求
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status); // 如果响应状态不是OK，则抛出错误
            }
            const data = await response.json(); // 解析响应内容为JSON

            if (data.data.some(item => item)) {
                // 如果数据中存在有效项
                // 提取每个元素的name属性值
                const names = data.data.map(item => item.name);
                return names; // 返回搜索到的name属性值列表
            }
        } catch (error) {
            // 当前来源请求失败，记录错误并尝试下一个来源
            console.error('搜索词来源请求失败:', error);
        }

        // 尝试下一个搜索词来源
        current_source_index++;
    }

    // 所有搜索词来源都已尝试且失败
    console.error('所有搜索词来源请求失败');
    return default_search_words; // 返回默认搜索词列表
}
getTrendingSearchTerms()
    .then(names => {
    //   console.log(names[0]);
    search_words = names;
    exec()
})
    .catch(error => {
    console.error(error);
});

// 定义菜单命令：开始
let menu1 = GM_registerMenuCommand('重置并开始', function () {
    GM_setValue('currentSearchCount', 0); // 将计数器重置为0
    GM_setValue('start', 1);// 开始
    UpdateTitle(); // 更新标题
}, 'o');

// 定义菜单命令：暂停
let menu2 = GM_registerMenuCommand('暂停', function () {
    GM_setValue('start', 0);// 暂停
    restoreToOriginalTitle()
}, 'o');

// 自动将字符串中的字符进行替换
function AutoStrTrans(st) {
    let yStr = st; // 原字符串
    let rStr = ""; // 插入的混淆字符，可以自定义自己的混淆字符串
    let zStr = ""; // 结果字符串
    let prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 5) + 1; // 随机生成步长
        if (i > 0) {
            zStr = zStr + yStr.substr(prePo, i - prePo) + rStr; // 将插入字符插入到相应位置
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < yStr.length) {
        zStr = zStr + yStr.substr(prePo, yStr.length - prePo); // 将剩余部分添加到结果字符串中
    }
    return zStr;
}

// 生成指定长度的包含大写字母、小写字母和数字的随机字符串
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        // 从字符集中随机选择字符，并拼接到结果字符串中
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//更新标题
function UpdateTitle(){
    if (GM_getValue("currentSearchCount") < GM_getValue("max_rewards")){
        var max_rewards = GM_getValue("max_rewards"); //重复执行的次数
        let title = document.getElementsByTagName("title")[0];
        title.innerHTML = "[" + GM_getValue('currentSearchCount') + " / " + max_rewards + "] " + title.innerHTML; // 在标题中显示当前搜索次数
    }
}
//恢复为原始标题
function restoreToOriginalTitle(){
    let title = document.getElementsByTagName("title")[0];
    title.innerHTML = originalPageTitle; // 恢复为原始标题
}

function exec() {
    // 生成随机延迟时间
    let randomDelay = Math.floor(Math.random() * 20000) + 20000; // 10000 毫秒 = 10 秒 randomDelay(单位：ms)
    let randomString = generateRandomString(4); //生成4个长度的随机字符串
    let randomCvid = generateRandomString(32); //生成32位长度的随机cvid

    let totalTime = (randomDelay + pause_time) / 1000; //总时长（单位：s）
    let time = 0; //计时器
    ///console.log(totalTime)

    function timeOut() {
        // 获取当前搜索次数
        let currentSearchCount = GM_getValue('currentSearchCount');
        let max_rewards = GM_getValue('max_rewards');
        let start = GM_getValue('start');
        //console.log("每隔一秒执行一次");
        //开始状态时计时
        if (start === 1 && currentSearchCount < max_rewards){
            //开始状态
            time++ //时间+1s
            //检查浏览器是否支持WakeLock
            if ('wakeLock' in navigator) {
                //检查是否已设置WakeLock
                if (!wakeLock) {
                    requestWakeLock(); //开启WakeLock
                }
            }
        } else{
            //非开始状态（暂停、停止）
            //检查浏览器是否支持WakeLock
            if ('wakeLock' in navigator) {
                releaseWakeLock() //释放WakeLock
            }
        }
        if (time > totalTime){
            //计时>总时长，开始搜索
            if(start === 1){
                if (currentSearchCount <= max_rewards / 2) {
                    //前半段搜索
                    search("https://www.bing.com/search?q="); // 在Bing国际版搜索引擎中搜索
                } else if (currentSearchCount > max_rewards / 2 && currentSearchCount < max_rewards) {
                    //后半段搜索
                    search("https://cn.bing.com/search?q="); // 在Bing国内版搜索引擎中搜索
                }
            }
        }
    }

    setInterval(timeOut, 1000);

    function search(searchEngineURL){
        UpdateTitle(); //更新标题

        // 获取当前搜索次数
        let currentSearchCount = GM_getValue('currentSearchCount');
        let max_rewards = GM_getValue('max_rewards');
        let start = GM_getValue('start');
        GM_setValue('currentSearchCount', currentSearchCount + 1); // 将计数器加1
        let nowtxt = search_words[currentSearchCount]; // 获取当前搜索词
        nowtxt = AutoStrTrans(nowtxt); // 对搜索词进行替换

        let searchURL = searchEngineURL + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
        location.href = searchURL; // 在Bing搜索引擎中搜索

    }
}