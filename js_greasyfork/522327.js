// ==UserScript==
// @name         Baidu Suggestion to Bing Search (PC)
// @icon         https://www.bing.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  随机取2K常用字，通过百度补全API获得热门词汇，作为必应搜索的关键词，实现几乎完全不会重复的效果。
// @author       阿派
// @match        https://suggestion.baidu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      https://cn.bing.com/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522327/Baidu%20Suggestion%20to%20Bing%20Search%20%28PC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522327/Baidu%20Suggestion%20to%20Bing%20Search%20%28PC%29.meta.js
// ==/UserScript==

const candidateWords = "于天末开下理事画现玫珠表珍列玉平妻寺城霜载直进吉协南才夫坟增示赤过志地雪支夺厅左丰百右历面帮原胡春克太磁砂灰达成顾友龙本村枯林相查机格析极检构术样档杰棕杨李要权楷革基苛式牙划功贡攻匠菜共区芳燕东芝世节切芭药睛盯虎旧占卤贞睡肯具餐眩瞳步眯瞎卢眼皮此量时晨果虹早昌蝇曙遇昨蝗明蛤晚景暗晃显晕电最归紧昆呈叶顺呆中虽吕另员呼听吸史吵喧叫车轩因困加男轴力斩胃办罗罚较边思轨轻累同财央朵曲由崭册贩骨内风凡赠迪岂邮凤生行知条长处务向笔物秀答称入科秒秋管秘季委后持拓打找年提扣押抽手折扔失换扩拉朱搂近所报扫反批且肝采肛胆肿肋肌用遥朋脸胸胶膛爱甩妥肥脂全会估休代介保仙作伯仍从信偿伙亿他分公化钱针然钉氏外旬名负儿铁角欠多久匀乐炙锭包凶争色主计庆订度让刘训为高放诉衣认义方说就变这记离良充率闰半关亲并站间部曾商产瓣前闪交立冰普帝决闻妆冯北汪法尖洒江小浊澡渐没少泊肖兴光注洋水淡学沁池当汉涨业灶类灯煤粘烛炽烟灿烽煌粗粉炮米料炒炎迷断籽娄宽寂审宫军宙客宾家空宛社实宵灾官字安它怀导居民收慢避惭届必怕愉懈心习悄屡忱忆敢恨怪尼卫际承陈耻阳职阵出降孤阴队防联孙耿辽子限取陛姨寻姑杂毁旭如舅奶婚妨嫌录灵巡刀好妇妈姆对参戏台劝观能难允驻驼马邓艰双线结顷红引旨强细纲张绵级给约纺弱纱继综纪弛绿经比定守害工上国和人发以瑟斑晴语伍残封都动杆舍鞍伏邦悲韭源善羚矿剧页万尤森棵酒宁歌臣谨甘黄腊垂道植申卡叔趾足虚玻晶暮临象坚界肃梨刊章朝蚕品喊带雷恩闸鸭轰曼黑柬温盆苯苦荆匡芋棋柑奎霸震积余叙复炸笺简数彻覆碧易肠派汽拿攀势抛看拜哲岳兵肢县拥解穆受貌豺豪橡毅衰畏丧众输夷份雁谷苏癸蹬察镜跑软鸟鸣岛印逛鲁渔免见便誓辩尺丹孩俯激唯截颜冲头均壮兽幸夹旁辞疗泵永函泰康杯灭兼播挖巨启眉媚声蕊恭舔翻熟屈齿龄蒸服矛仓施媳案淄扭丸津食霓骚令通私云爸雍幻慈王土木目日口田山禾白月金言火已女干士寸雨古犬石厂丁西戈虫川甲竹斤夕文广辛门贝羽耳巴弓阶种自深农体路正论资形重战使合图新想点起性斗里两应制育去气问展意接情油题利压组期毛群次孔流席运质治位器指建活教统别更真将识先专常造修病老回验特根团转总任调热改完集毫研求精层清确低证劳号装单据设场花传判究须青越轮整速织书状海斯议般千影推今德差始响觉液维破消试布需胜济效选话片牧备续标存身板述底规走除置配养敌华测准许技床端感非磨往圆照搞族神容亚段算适讲按值美态彪班麦削排该击素密候草何树属市径螺英快坏移材省武培著河京助升抓含苗副谈围射例致酸却短剂宣环落首波践府考刻靠够满住枝局菌周护岩师举元超模贫减扬亩球医校稻滑鼓写微略范供块套项倒卷创律远初优圈伟控裂粮母练塞钢顶策留误粒础故丝焊株院冷弹错散盾视艺版烈零室血缺厘绝富喷柱望盘雄似巩益洲脱投送侧润盖挥距触星松获独混座依未突架冬湿偏纹执寨责阀吃稳硬价努奇预评读背损棉侵厚泥辟卵箱掌氧停溶营终孟待尽俄缩沙退讨奋胞幼迫旋征槽殖握担鲜钻逐脚盐编蜂急伤飞域露核缘游振操甚迅辉异序纸夜乡隶缸念兰映沟儒磷插埃燃欢补咱芽瓦倾碳演附耪裔斜灌欧献猪腐请透司危括靛脉囤若尾束暴企穗愈拖牛染遍锻夏井费访吹荣铜沿替滚旱悟脑措贯藏隙濮徐吴赵陆沈蒋曹唐潘袁郭蔡戴薛姚宋韩谢姜严陶董郑程倪秦邵汤葛俞杜殷龚魏梁崔邹邱彭尹庄卞贾洪盛樊侯邢郁凌仇韦童翟付祁仲宗梅鲍祝谭钟庞乔虞郝傅焦熊浦柏狄裴柳戚房毕翁储聂莫贺茅屠杭尚诸芦鞠廖骆靳詹阮惠桑柯刁柴丛齐喻桂侍舒戎阎宦巫黎涂符厉糜冒钮郎霍甄姬祖卓晓祥萍忠俊斌宏玲勇峰宝霞丽娟敏琴健静福贵勤锦艳莉涛瑞跃仁泉连喜银亮宇慧鹏茂淑芹坤剑君翠彬恒礼侠智浩菊香蓉寿圣贤洁耀延翔芬绍琳颖栋巧铭敬淮登鸿宜莲庭孝泽政彩诚崇彦佩宪锡钧劲锋殿希迎堂裕鹤欣汝妹岭沛莹雅佳纯靖蕾俭蔚彤湘绪尧廷锁勋庚嘉伦娥详钦寅冠骏滨威捷亭巍楼娜旺晋悦咏焕昭枫琼慎杏仕仪珊桃谦航舜猛卿鼎咸陵镇召敦熙遵桥网闽挺菲禄潮鉴婉塔蚜描粤粱惮慨乌矩疾徊戒买笛痛锈锌匆矢溪荤陪掩耸棠祭槐憨狙忙辑奉忧飘沫怖悬厌欲谱瘤货蛊赴嚎履闯藩遁雀渠探滇诡弟秩渗捏茸枪狠弃摇倘贬庙汇肩帽寄岸饼违蝎擅闹蜡裸碱奠秉丑倍萧瞒萌煎梳携蛇臂皖奸胎赌魁患凿匪翅瘫烤汛碘嗜瓶疤递搬睬盎丈袋颈屉邻拆趣鼠鼻倔蝴酿辈钨盂购逆桅娇瑶父抢浮晦拂葫揉壕弊冻笼舵凹型默闲菩驰篡孪蜗午宴驯砚怠粥躁豁靡拴睁丘碟懂皆淤矗浸咬揩妖荡疼哥撬拨迹命渤躺礁贸赶尝咖裤割炕砸俏饥赦博衙摆畅码砍渡绒牢捡棍辨澳饮洼窟辰隋憋酋绅狱悔厄";

const START_HOUR = 0;
const START_MINUTE = 15;
const CD_TIME = 575*1000;
const MAX_COUNT = 32; // 搜索总次数

var wordIndex = -1; // 随机字符库索引
var suggestionIndex = -1; // 搜索关键词索引
var gStartTime = 0;


async function fetchSuggestionKeywords(seed) {
    console.log(seed);
    const url = `https://suggestion.baidu.com/su?wd=${seed}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch url: ' + response);
    }
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('gbk'); // 指定 GBK 编码
    const data = decoder.decode(buffer);

    // 提取 `s` 参数数组
    const match = data.match(/s:\s*(\[[^\]]+\])/);
    if (match && match[1]) {
        const suggestionKeywords = JSON.parse(match[1]);
        console.log('Suggestions:', suggestionKeywords);
        return suggestionKeywords;
    } else {
        throw new Error('Failed to extract suggestions. Raw data: ' + data);
    }
}

async function doSearch() {
    if (gStartTime == 0) {
        gStartTime = Date.now();
    }
    var delay = 100;
    if (wordIndex < 0 || wordIndex >= candidateWords.length) {
        delay = 3000;
        wordIndex = Math.floor(Math.random() * candidateWords.length);
    } else {
        wordIndex = (wordIndex + 13) % candidateWords.length;
    }
    const seed = candidateWords.charAt(wordIndex);
    var suggestionKeywords = null;
    try {
        suggestionKeywords = await fetchSuggestionKeywords(seed);
    } catch (error) {
        console.log(error);
    }
    var query;
    if (suggestionKeywords && suggestionKeywords.length > 1) {
        query = getSearchString(suggestionKeywords);
        //let queryIndex = Math.floor(Math.random() * suggestionKeywords.length);
        //query = suggestionKeywords[queryIndex];
    } else {
        query = seed + ' 常用组词'; // 百度suggestion接口若失败就模拟构造一个。
    }
    console.log(`Searching on Bing: ${query}`);
    const bingUrl = `https://cn.bing.com/search?q=${encodeURIComponent(query)}&form=QBLH&sp=-1&lq=0&pq=${encodeURIComponent(query)}&sc=12-2&qs=n&sk=&ghsh=0&ghacc=0&ghpl=`;
    setTimeout(() => {
        var win = window.open(bingUrl, '_blank');
        onSearchAccumulated();
        delayCloseWindow(win);
        var count = getSearchCount();
        toast(`正在进行第${count}次搜索……`)
    }, delay);
}

function delayCloseWindow(win) {
    var delay = 5000;
    if (isSearchTaskFinished()) {
        delay = 5000;
    } else {
        delay = CD_TIME/2 + Math.floor(Math.random() * 5000);
    }
    setTimeout(() => {
        if (win && !win.closed) {
            win.close();
            console.log('Closed the previous search page.');
            var count = getSearchCount();
            toast(`已完成${count}次搜索`)
        }
        if (isSearchTaskFinished()) {
            var deltaTime = Date.now() - gStartTime;
            var timeText = formatDuration(deltaTime);
            toast(`今日搜索任务已完成！耗时${timeText}`);
        } else {
            randomDelayAndSearchAgain();
        }
    }, delay);
}

function randomDelayAndSearchAgain() {
    let delay = Math.floor(Math.random() * 10*1000) + 10*1000;
    setTimeout(() => {
        work();
    }, delay);
}

function getSearchString(strArray) {
    if (!Array.isArray(strArray) || strArray.length === 0) {
        throw new Error("输入必须是非空的字符串数组");
    }

    // 找到包含空格的字符串
    const stringsWithSpace = strArray.filter(str => str.includes(' '));

    if (stringsWithSpace.length > 0) {
        // 找到包含空格的最短长度
        const minLength = Math.min(...stringsWithSpace.map(str => str.length));
        const shortestWithSpace = stringsWithSpace.filter(str => str.length === minLength);
        // 随机返回一个包含空格的最短字符串
        return shortestWithSpace[Math.floor(Math.random() * shortestWithSpace.length)];
    } else {
        // 找到最长字符串的长度
        const maxLength = Math.max(...strArray.map(str => str.length));
        const longestStrings = strArray.filter(str => str.length === maxLength);
        // 随机返回一个最长字符串
        return longestStrings[Math.floor(Math.random() * longestStrings.length)];
    }
}

function getCdTime() {
    return CD_TIME;
}
function getRemainCdTime() {
    return getLastSearchTime() + getCdTime() - Date.now();
}
function isCoolingDown() {
    return getRemainCdTime() > 0;
}
function getLastSearchTime() {
    return GM_getValue("last_search_time", -1);
}
function getSearchCount() {
    var count = GM_getValue("today_search_count", 0);
    if (count > 0) {
        var lastSearchTime = getLastSearchTime();
        const todayStart = new Date();
        todayStart.setHours(0);
        todayStart.setMinutes(0);
        todayStart.setSeconds(0);
        todayStart.setMilliseconds(0);
        if (lastSearchTime < todayStart.getTime()) {
            count = 0;
            GM_setValue("today_search_count", count);
        }
    }
    return count;
}
function setSearchCount(count, time) {
    if (time == -1) {
        var todayStart = new Date();
        todayStart.setHours(0);
        todayStart.setMinutes(0);
        todayStart.setSeconds(0);
        todayStart.setMilliseconds(0);
        if (count > 0 && getLastSearchTime() < todayStart.getTime()) {
            time = todayStart.getTime();
        }
    }
    GM_setValue("today_search_count", count);
    if (time != -1) {
        GM_setValue("last_search_time", time);
    }
}
function getSearchMax() {
    return MAX_COUNT;
}
function isSearchTaskFinished() {
    return getSearchCount() >= getSearchMax();
}
function onSearchAccumulated() {
    var searchCount = getSearchCount();
    searchCount++;
    setSearchCount(searchCount, Date.now());
}
function isWorkingTime() {
    var startTime = new Date();
    startTime.setHours(START_HOUR);
    startTime.setMinutes(START_MINUTE);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);
    var endTime = new Date();
    endTime.setHours(22);
    endTime.setMinutes(0);
    endTime.setSeconds(0);
    endTime.setMilliseconds(0);
    var now = Date.now();
    return now > startTime.getTime() && now < endTime.getTime();
}

function work() {
    if (isSearchTaskFinished()) {
        toast(`今日任务已完成，休息5分钟后再试`);
        setTimeout(() => {
            work();
        }, 300*1000);
    } else if (!isWorkingTime()) {
        toast('非工作时间，休息1分钟后再试');
        setTimeout(() => {
            work();
        }, 60*1000);
    } else if (isCoolingDown()) {
        var count = getSearchCount();
        var remainCdTime = getRemainCdTime();
        var remainText = formatDuration(remainCdTime);
        toast(`已完成${count}次搜索，冷却时间还有${remainText}`)
        setTimeout(() => {
            work();
        }, 15*1000);
    } else {
        doSearch();
    }
}

function formatDuration(millis) {
    const time = Math.round(millis/1000);
    const hours = Math.floor(time / 3600);
    const remainingSeconds = time % 3600;
    const minutes = Math.round(remainingSeconds / 60); // 分钟数四舍五入
    const seconds = time % 60;

    if (hours > 0) {
        // 超过1小时
        if (minutes === 60) {
            return `${hours + 1}小时整`; // 分钟数为60，进位到小时
        } else if (minutes === 0) {
            return `${hours}小时整`; // 分钟数为0，显示几小时整
        } else {
            return `${hours}小时${minutes}分钟`; // 显示几小时几分钟
        }
    } else if (minutes > 0) {
        // 小于1小时
        if (seconds === 0) {
            return `${minutes}分钟`; // 秒数为0，只显示几分钟
        } else {
            return `${minutes}分${seconds}秒`; // 显示几分几秒
        }
    } else {
        // 只有秒
        return `${seconds}秒`; // 显示几秒
    }
}

// 全局变量，用于保存提示框的引用
let toastContainer = null;
// 封装 toast 函数
function toast(msg, duration) {
    console.log(msg);
    const time = new Date().toLocaleTimeString();
    const fullMsg = `[${time}] ${msg}`;
    // 如果提示框已存在，则更新内容
    if (toastContainer) {
        toastContainer.textContent = fullMsg;
    } else {
        // 如果提示框不存在，则创建新的提示框
        toastContainer = document.createElement("div");
        toastContainer.textContent = fullMsg;
        toastContainer.style.position = "fixed";
        toastContainer.style.top = "50%";
        toastContainer.style.left = "50%";
        toastContainer.style.transform = "translate(-50%, -50%)";
        toastContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        toastContainer.style.color = "#fff";
        toastContainer.style.padding = "20px";
        toastContainer.style.borderRadius = "12px";
        toastContainer.style.zIndex = "9999";
        toastContainer.style.fontSize = "24px";
        toastContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
        document.body.appendChild(toastContainer);
    }

    // 如果传递了 duration，则设置定时器自动隐藏提示框
    if (typeof duration !== "undefined") {
        setTimeout(() => {
            if (toastContainer) {
                toastContainer.remove(); // 移除提示框
                toastContainer = null; // 重置引用
            }
        }, duration);
    }
}

(function () {
    'use strict';

    console.log('Start Baidu Suggestion to Bing Search script.');
    work();
})();
