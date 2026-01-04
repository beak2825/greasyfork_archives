// ==UserScript==
// @name         Microsoft Bing Rewards每日任务脚本(非国区)
// @name:en      Microsoft Bing Rewards Daily Searches(Non-CN)
// @version      V0.1.1
// @description  自动完成微软Rewards每日搜索任务,每次运行时获取抖音/微博/哔哩哔哩/百度热门词,避免使用同样的搜索词被封号。
// @description:en Automatically completes the Microsoft Rewards daily search tasks. Each run fetches trending keywords from TikTok, Weibo, Bilibili, and Baidu to avoid using the same search terms and getting accounts banned.
// @note         更新于 2024年1月15日
// @author       怀沙2049 / k
// @match        https://www.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      tenapi.cn
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/832748
// @downloadURL https://update.greasyfork.org/scripts/484900/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%28%E9%9D%9E%E5%9B%BD%E5%8C%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484900/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%28%E9%9D%9E%E5%9B%BD%E5%8C%BA%29.meta.js
// ==/UserScript==

var max_rewards = 33; /*重复执行的次数*/
var minInterval = 300000; //固定延迟时间 300000=5分钟,10000=10秒
var search_words = []; //搜索词
var default_search_words=["盛年不重来，一日难再晨","千里之行，始于足下","少年易学老难成，一寸光阴不可轻","敏而好学，不耻下问","海内存知已，天涯若比邻","三人行，必有我师焉","莫愁前路无知已，天下谁人不识君","人生贵相知，何用金与钱","天生我材必有用","海纳百川有容乃大；壁立千仞无欲则刚","穷则独善其身，达则兼济天下","读书破万卷，下笔如有神","学而不思则罔，思而不学则殆","一年之计在于春，一日之计在于晨","莫等闲，白了少年头，空悲切","少壮不努力，老大徒伤悲","一寸光阴一寸金，寸金难买寸光阴","近朱者赤，近墨者黑","吾生也有涯，而知也无涯","纸上得来终觉浅，绝知此事要躬行","学无止境","己所不欲，勿施于人","天将降大任于斯人也","鞠躬尽瘁，死而后已","书到用时方恨少","天下兴亡，匹夫有责","人无远虑，必有近忧","为中华之崛起而读书","一日无书，百事荒废","岂能尽如人意，但求无愧我心","人生自古谁无死，留取丹心照汗青","吾生也有涯，而知也无涯","生于忧患，死于安乐","John","Beijing","Phone","Shanghai","The covid pandemic is still spreading","Mike","Tianjin","Computer","Beijing","Climate change leads to changing global rainfall patterns","Mary","Shandong","Car","Guangzhou","The economic situation is grim","David","Hebei","TV","Shenzhen","Housing prices hit record highs","Robert","Jiangsu","Book","Wuhan","Unemployment rises to a 5-year high","Susan","Zhejiang","Camera","Chongqing","Government stimulus aims to boost growth","Chris","Hunan","Phone","Hangzhou","Tech giants under scrutiny over data practices","Helen","Hubei","Computer","Nanjing","Central bank raises interest rates to curb inflation","Mark","Anhui","Bag","Xiamen","Tensions high as election approaches","Emma","Fujian","Shoes","Qingdao","Scientists make breakthrough cancer discovery","Michael","Jiangxi","Watch","Changsha","Severe flooding displaces thousands","Lisa","Henan","Toothbrush","Guiyang","Markets fall on renewed trade war fears","Paul","Guangdong","Bottle","Haikou","Nation mourns passing of beloved leader","Laura","Hainan","Bed","Lanzhou","Protests erupt over human rights abuses","Steven","Sichuan","Towel","Xian","Peace talks aim to end decade long conflict","Patricia","Guizhou","Paper","Yinchuan","Scandal rocks prominent industry leader","Matthew","Yunnan","Pen","Xining","Deadly earthquake strikes densely populated area","Dorothy","Shanxi","Pencil","Zhengzhou","Historic treaty signals new era of cooperation","Daniel","Gansu","Eraser","Taiyuan","Massive cyber attack causes widespread disruption","Michelle","Qinghai","Ruler","Changchun","Landmark case redefines privacy rights","Sarah","Ningxia","Scissors","Hefei","Nationwide protests call for political reform","George","Xinjiang","Notebook","Fuzhou","Scientists engineer drought resistant crops","Karen","Jilin","Backpack","Nanchang","Deadly new virus sparks global health emergency","Charles","Liaoning","Calculator","Jinan","Government accused of unethical human trials","Margaret","Heilongjiang","Stapler","Harbin","Police under fire over allegations of racism","William","Shanghai","Keyboard","Dalian","Record heat waves linked to climate change","Dorothy","Beijing","Mouse","Shenyang","Space probe sends back stunning images","James","Chongqing","Smartphone","Shijiazhuang","Pollution responsible for increase in respiratory disease","Barbara","Tianjin","Speaker","Chengdu","New tax laws spur economic growth but increase inequality","Richard","Shijiazhuang","Microphone","Changchun","Government grapples with rising healthcare costs","Linda","Taiyuan","Headphones","Kunming","Landmark agreement aims to preserve biodiversity","Thomas","Hohhot","Camera","Guiyang","Terror threat remains high amid political tensions","Betty","Datong","Telescope","Zhenjiang","Wave of nationalism sweeps country ahead of elections","Edward","Baotou","Photo album","Anyang","Construction boom drives urbanization but strains infrastructure","Kimberly","Jinzhong","Video game","Handan","Aging population presents economic and social challenges","Anthony","Yuncheng","Soccer ball","Xiangfan","Influential scholar revolutionizes field with new theory","Dorothy","Linfen","Chess set","Shaoguan","Central bank unveils controversial quantitative easing program","Kevin","Datong","Guitar","Mudanjiang","New medical innovations improve quality of life for millions","Eric","Yangquan","Piano","Xiangyang","Space agency succeeds in bold planetary exploration mission","Amanda","Changzhi","Violin","Zhongshan","Artificial intelligence spurs exciting new technological capabilities","Roger","Luliang","Flute","Foshan","Social media giants under fire over data security practices","Rachel","Jincheng","Trumpet","Liuzhou","Historic election brings major political realignment","Kenneth","Shuozhou","Harmonica","Anshun","Groundbreaking medical trial cures previously incurable disease","Sharon","Jinzhong","Sheet music","Sanya","Monetary stimulus provides short-term economic boost but long-term risks","Justin","Xinzhou","Microscope","Shaoyang","Violent conflict displaces millions, creates humanitarian crisis","Terry","Changzhi","Test tube","Chifeng","Automation transforms job market, reshapes workforce needs","Lawrence","Linfen","Beaker","Yangzhou","Landmark summit aims to halt arms race and curb proliferation",'John Smith','New York','breakfast is the most important meal of the day','Chicago','Local Team Wins Championship','Mary Johnson','Los Angeles','the early bird gets the worm','Houston','New Restaurant Opens Downtown','Robert Williams','London','practice makes perfect','Phoenix','Scientists Make New Discovery','Jennifer Brown','Paris','a penny saved is a penny earned','Philadelphia','Famous Actor Visits Town','David Jones','Tokyo','the grass is always greener on the other side','Detroit','Local Team Headed to Championships','Emily Davis','Berlin','the apple doesn\'t fall far from the tree','San Francisco','City Council Approves New Budget','Michael Miller','Sydney','better late than never','Jacksonville','Museum Announces New Exhibit','Jessica Wilson','Cairo','two heads are better than one','Indianapolis','Local Charity Event Raises Money','William Moore','Madrid','every cloud has a silver lining','Austin','Company Announces New Product Line','Elizabeth Taylor','Rome','the pen is mightier than the sword','Columbus','Mayor Gives State of City Address']
//{weibohot}微博热搜榜/{bilihot}哔哩热搜榜/{douyinhot}抖音热搜榜/{zhihuhot}知乎热搜榜/{baiduhot}百度热搜榜
//var keywords_source = "weibohot";
var keywords_sources = [
  "douyinhot",
  "weibohot",
  "zhihuhot",
  "baiduhot",
  "bilihot"
];
var keywords_source = keywords_sources[Math.floor(Math.random() * keywords_sources.length)];

//获取抖音热门搜索词用来作为关键词
function douyinhot_dic() {
    return new Promise((resolve, reject) => {
        // 发送GET请求到指定URL
        fetch("https://tenapi.cn/v2/" + keywords_source)
            .then(response => response.json()) // 将返回的响应转换为JSON格式
            .then(data => {
                if (data.data.some(item => item)) {
                    // 提取每个元素的name属性值
                    const names = data.data.map(item => item.name);
                    resolve(names); // 将name属性值作为Promise对象的结果返回
                } else {
                    //如果为空使用默认搜索词
                    resolve(default_search_words)
                }
            })
            .catch(error => {
                // 如果请求失败，则返回默认搜索词
                resolve(default_search_words)
                reject(error); // 将错误信息作为Promise对象的错误返回
            });
    });
}
douyinhot_dic()
    .then(names => {
        //   console.log(names[0]);
        search_words = names;
        exec()
    })
    .catch(error => {
        console.error(error);
    });

// 定义菜单命令：开始
let menu1 = GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0); // 将计数器重置为0
    location.href = "https://www.bing.com/?br_msg=Please-Wait"; // 跳转到Bing首页
}, 'o');

// 定义菜单命令：停止
let menu2 = GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10); // 将计数器设置为超过最大搜索次数，以停止搜索
}, 'o');

// 混淆字符串 confuseProb:0~1
function AutoStrTrans(str,confuseProb) {
    let orgStr = str; // 原字符串
    let confuseStr = ""; // 插入的混淆字符，可以自定义自己的混淆字符串
    let result = ""; // 结果字符串
    let prePo = 0;
    for (let i = 0; i < orgStr.length;) {
        let step = Math.floor(Math.random() * 3) + 1;; // 随机生成步长
        if (i > 0) {
            if (Math.random() < confuseProb) {
                result = result + orgStr.substr(prePo, i - prePo) + generateRandomString(Math.floor(Math.random()*3+1));// 将插入字符插入到相应位置
            }else{
                result = result + orgStr.substr(prePo, i - prePo);
            }
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < orgStr.length) {
        result = result + orgStr.substr(prePo, orgStr.length - prePo); // 将剩余部分添加到结果字符串中
    }
    return result;
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
// 添加倒计时元素
let countdownEle = document.createElement('div');
GM_addStyle(`
  #search-countdown {
    position: fixed;
    left: 20px;
    top: 100px;
    background: #fff;
    padding: 5px;
    border: 1px solid black;
  }
`);
document.body.appendChild(countdownEle);
countdownEle.id = 'search-countdown';

function startCountdown(duration) {
  let seconds = Math.round(duration/1000);
  updateCountdownText(seconds);

  let interval = setInterval(() => {
    seconds--;
    updateCountdownText(seconds);

    if (seconds <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function updateCountdownText(seconds) {
    if (GM_getValue('Cnt') < max_rewards){
        countdownEle.innerHTML = `下次搜索倒计时: ${seconds} 秒`;
    }
}
function exec() {
    updateCountdownText(0);
    // 生成随机延迟时间 5分钟+随机1~6秒
    let randomDelay = Math.floor(Math.random() * 6000) + minInterval; // 10000 毫秒 = 10 秒
    startCountdown(randomDelay);
    let randomString = generateRandomString(4); //生成4个长度的随机字符串
    let randomCvid = generateRandomString(32); //生成32位长度的cvid
    'use strict';

    if (GM_getValue('Cnt') < max_rewards){
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + GM_getValue('Cnt') + " / " + max_rewards + "] " + tt.innerHTML; // 在标题中显示当前搜索次数
        setTimeout(function () {
            GM_setValue('Cnt', GM_getValue('Cnt') + 1); // 将计数器加1
            let keywordIndex = Math.floor(Math.random() * search_words.length);
            let nowtxt = search_words[keywordIndex];// 获取当前搜索词
            nowtxt = AutoStrTrans(nowtxt,0.3); // 对搜索词进行替换
            location.href = "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid; // 在Bing搜索引擎中搜索
        }, randomDelay);
    }else{
        countdownEle.innerHTML = `搜索已停止`;
    }

};