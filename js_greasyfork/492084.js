// ==UserScript==
// @name         吾爱论坛助手
// @namespace    http://tampermonkey.net/
// @version      3.10
// @description  try to take over the world! (MIT Licensed)
// @author       果心豆腐酱
// @run-at       document-start
// @match        https://www.52pojie.cn/*
// @icon         https://avatar.52pojie.cn/data/avatar/002/12/56/53_avatar_small.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492084/%E5%90%BE%E7%88%B1%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492084/%E5%90%BE%E7%88%B1%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var username = "超级管理员";//空值，不替换
var usergroups = "管理组: 独步成林";//空值，不替换
var integral = "积分: 999999"//空值，不替换
var messages = ["小小心意，意思一下", "正好需要~", "这么厉害！必须给个红包鼓励下~", "YYDS~！！！", "太厉害了！", "谢分享", "大佬继续更新吧!!!", "6666666", "谢谢@Thanks！",
    "Thanks", "我很赞同！", "感谢发布原创作品，精易论坛因你更精彩！", "用用试试，看看牛不牛", "鼓励转贴优秀软件安全工具和文档！", "热心回复！", "欢迎分析讨论交流，吾爱破解论坛有你更精彩！",
    "用心讨论，共获提升！", "感谢您的宝贵建议，我们会努力争取做得更好！",
    "看起来很强大", "下来试试", "感谢大佬分享", "感谢大大的分享", "好东西先收藏。", "牛，试试看", "支持一下", "厉害了，先收藏", "前来看看", "谢楼主", "感谢LZ分享", "这个看起来很厉害",
    "有此需求，下来看看", "支持分享", "不错，试试", "虽然不知道怎么用，但还是关注一下", "不错的软件", "楼主好强", "不错，谢谢", "感谢大佬", "先试试再说", "厉害厉害", "感谢发布", "感觉很强大",
    "看起来", "大佬技术", "好厉害", "好东西", "学习学习", "支持作者大大", "感谢你的分享", "收藏了 很有用", "真的很不错", "楼主辛苦了", "谢大佬", "感谢无私分享", "谢谢谢", "多大用处", "谢谢提供",
    "支持大佬", "牛逼牛逼", "下载看看", "好心人", "顶级大佬", "我的大佬", "不容错过", "论坛有您更精彩", "感谢大神分享", "大佬牛逼", "谢谢大大", "牛啊大佬", "大佬66", "不得不赞", "厉害了！", "内容自动屏蔽",
    "不错不错", "收藏备用，谢谢", "很好用，谢谢！", "论坛禁止求脱求破", "未能按照本版块发帖要求发帖", "请勿灌水", "此为违规行为", "广告贴", "感谢您的宝贵建议", "感谢发布原创作品", "欢迎分析讨论交流", "已经处理",
    "鼓励转贴", "用心讨论",
];//空值，不替换

var qianming = true;//删除评论用户的签名（晃眼）
var hidebg = true;//隐藏版规，页面内可设置永久隐藏，单条设置，此处一键隐藏、一键展示。
var hottie = true;//自动加载热门帖子、新鲜出炉等后续页面内容。
var upnumber = true;//为帖子增加序号，方便阅览
处理页面元素(document);//主要功能，关闭后，其他内容都影响
stylecreate();
document.addEventListener('DOMContentLoaded', function () {
    //自动签到；
    let qiandao = document.querySelector('[class="qq_bind"]');
    if (qiandao.src === 'https://static.52pojie.cn/static/image/common/qds.png') {
        qiandao.parentElement.click();
    }
    if (document.querySelector('[class="alert_btnleft"]')) history.back();

    处理页面元素(document);
    hidebangui();//隐藏/显示 版规
    hot();//加载热门帖子后续页面内容
    upnum();//更新序号
    delta_qm();//删除签名
    监测页面请求();//监测加载的内容并更新序号
    pttop();//启动滚动位置监测，为按钮设置位置
    addbutton();//添加功能按钮
    addremarry();//添加取后内容的按钮
    // var signimage = document.querySelector('[align="absmiddle"]');
    // if (signimage && signimage.src && signimage.src !== 'https://static.52pojie.cn/static/image/common/wbs.png') {
    //     var xhr = new XMLHttpRequest();
    //     var url = 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2&referer=%2Findex.php';
    //     xhr.open('GET', url, true);
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //             // 请求成功的处理逻辑
    //             // 这里可以编写处理请求成功后的代码
    //         }
    //     };
    //     xhr.send();
    // }
    let score = document.createElement('a')
    score.setAttribute("title", "快速评分,快速为作者评论，最大评分值1。")
    score.innerHTML = `<i><img src="https://static.52pojie.cn/static/image/common/agree.gif" alt="快速评分">快速评分</i>`
    score.addEventListener('click', function (event) {
        scoreg();
    })
    document.querySelector('[id="p_btn"]')?.appendChild(score)
});
//启动页面元素监测
function checkAndStart() {
    console.log('检测')
    if (document.body) {
        // 启动元素检测函数
        启动元素检测();

        // 停止定时器
        clearInterval(intervalId);
    }
}
// 每50毫秒检测一次
var intervalId = setInterval(checkAndStart, 50);

function addbutton(){
    // let scbar_form = document.querySelector('[id="scbar_form"] tr');
    let scbar_form = document.querySelector('[id="pt"] ');
    if (!scbar_form) return;
    let pt = document.createElement('button');
    pt.textContent = '取后续评论';
    pt.className = 'auxiliary_button up';
    pt.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        取评论();
    })

    scbar_form?.appendChild(pt);

    let px = document.createElement('button');
    px.textContent = '热度排序';
    px.className = 'auxiliary_button';
    px.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        rot();
    })
    scbar_form?.appendChild(px);

    let time = document.createElement('button');
    time.textContent = '时间排序';
    time.className = 'auxiliary_button';
    time.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        timeg();
    })
    scbar_form?.appendChild(time);

    let plate = document.createElement('button');
    plate.textContent = '版块排序';
    plate.className = 'auxiliary_button';
    plate.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        plateg();
    })
    scbar_form?.appendChild(plate);

    let author = document.createElement('button');
    author.textContent = '作者排序'
    author.className = 'auxiliary_button';
    author.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        authorg();
    })
    scbar_form?.appendChild(author);

    let content = document.createElement('button');
    content.textContent = '评论排序'
    content.className = 'auxiliary_button';
    content.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        commentg();
    })
    scbar_form?.appendChild(content);

    let bounty = document.createElement('button');
    bounty.textContent = '悬赏排序'
    bounty.className = 'auxiliary_button';
    bounty.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        Bounty();
    })
    scbar_form?.appendChild(bounty);
}

function stylecreate() {
    let css = `
    .auxiliary_button {
        height: 30px;
        cursor: pointer;
        border: 2px solid #d4d4d4;
        width: 70px;
        margin: 0px 0 0 2px;
    }
    .auxiliary_button.up {
        width: 82px;
    }

    #pt.top {
        position: fixed;
        top: 31px;
        z-index: 1000;
        background: aliceblue;
        padding: 0 10px 5px 10px;
        left: 0;
    }

    [id="nv"].top{
        top: 0px;
        left: 11.4688px;
        z-index: 199;
        border-left-width: 0px;
        border-right-width: 0px;
        height: 33px;
        width: 1124px;
        position: fixed;
        opacity: 0.85;
    }

    #an li {
        width: 370px !important;
    }
    /* 定义动画 */
    @keyframes changeColor {
        0% { color: #ff0000; }
        33% { color: #00ff00; }
        66% { color: #0000ff; }
        100% { color: #ff0000; }
    }

    /* 应用动画到元素 */
    .vwmy.qq a {
        animation: changeColor 6s infinite; /* 每个颜色切换持续2秒钟，总共6秒钟切换一轮 */
    }
    #pt .y {
        position: absolute;
        right: 15px;
        top: 160px;
    }
    // #an li span {
    //     width: 290px !important;
    // }
    #scbar_hot{
        display: none;
    }
    #scbar_hot a:nth-child(3) {
        position: relative;
        top: -42px;
        right: -70px;
    }
    #scbar_hot a:nth-child(4) {
        position: relative;
        top: -84px;
        right: -110px;
    }
    #scbar_hot a:nth-child(5) {
        position: relative;
        top: -126px;
        right: -150px;
    }
    #scbar_hot a:nth-child(6) {
        position: relative;
        top: -168px;
        right: -190px;
    }
    .xi2.pbn{
        width: 63px !important;
    }

    `
    if (!document.querySelector('.auxiliary_button')) {
        let st = document.createElement('style');
        st.className = "auxiliary_button";
        st.textContent = css;
        document.head.appendChild(st);
    }
}

 function addremarry() {
    const targetElement = document.getElementById('autopbn');
    if(targetElement)return;
    // 创建新的元素
    const newElement = document.createElement('div');
    newElement.innerHTML = '<div class="bm_h" href="javascript:;" rel="forum.php?mod=forumdisplay&amp;fid=8&amp;page=2" curpage="1" id="autopbn" totalpage="1000" picstyle="0" forumdefstyle="" style="display: block;">取后续 <input style="width: 60px;"><span> 页 »</span></div>';
    let autopbn = newElement.querySelector('#autopbn');
    let inp = autopbn.querySelector('input');

   
    // 获取目标元素
    

    // 在目标元素后面插入新元素
    targetElement?.parentNode?.insertBefore(newElement, targetElement.nextSibling);
    autopbn.addEventListener('clicl',async function(event){
        event.preventDefault();
        event.stopPropagation();
        for (let i = 1; i < Number(inp.value) + 1; i++) {
            document.querySelector('#autopbn')?.click();
            await sleep(1000);
        }

    })
}

function 启动元素检测() {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查每个变化的类型
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                // 循环遍历添加的节点
                mutation.addedNodes.forEach(function (addedNode) {
                    // 检查添加的节点是否为目标元素
                    if (addedNode.classList) {
                        处理监测元素(addedNode);
                    }
                });
            }
        });
    });
    // 开始观察父节点下的变化
    observer.observe(document.body, { childList: true, subtree: true });
}
function 处理监测元素(addedNode) {
    //console.log(addedNode.outerHTML);
    if (addedNode.classList.contains('f_c') && addedNode.classList.contains('altw')) {
        if (addedNode.querySelector('.alert_info')) {
            addedNode.querySelector('.alert_info').innerHTML = addedNode.querySelector('.alert_info').outerHTML.replace(`<script type="text/javascript" reload="1">setTimeout("window.location.href ='home.php?mod=task&item=new';", 3000);</script>`, '')
            console.log('新内容', addedNode.querySelector('.alert_info').innerHTML, addedNode.querySelector('.alert_info').outerHTML);
        }
    }

    处理页面元素(addedNode)
}
function 处理页面元素(addedNode) {
    document.querySelector('[id="messagetext"] p')?.innerHTML?.replace(`<script type="text/javascript" reload="1">setTimeout("window.location.href ='home.php?mod=task&item=new';", 3000);</script>`, "")
    if (!addedNode) return
    if (addedNode.classList && addedNode.classList.contains('f_c') && addedNode.classList.contains('altw')) {
        if (addedNode.querySelector('.alert_info')) {
            addedNode.querySelector('.alert_info').innerHTML = addedNode.querySelector('.alert_info').outerHTML.replace(`<script type="text/javascript" reload="1">setTimeout("window.location.href ='home.php?mod=task&item=new';", 3000);</script>`, '')
            console.log('新内容', addedNode.querySelector('.alert_info').innerHTML, addedNode.querySelector('.alert_info').outerHTML);
        }
    }
    let user = addedNode.querySelector('[class="vwmy qq"] a');
    if (user && username) {
        user.textContent = username;
        user.style.color = "#ff0000";
    }
    let userzu = addedNode.querySelector('[id="g_upmine"');
    if (userzu && usergroups) {
        userzu.textContent = usergroups;
    }
    let jifen = addedNode.querySelector('[id="extcreditmenu"]');
    if (jifen && integral) {
        jifen.textContent = integral;
    }
    let mt = addedNode.querySelector('[class="mt"');
    if (mt && username) {
        mt.textContent = username;
    }
    let xg1 = addedNode.querySelector('li [class="xg1"]');
    if (xg1 && usergroups) {
        xg1.textContent = usergroups.split(':')[0] + "  ";
    }
    // let xi2 = addedNode.querySelector('li [class="xi2"]');
    // if (xi2 && usergroups) {
    //     xi2.textContent = usergroups.split(':')[1];
    // }
    let h2Element = addedNode.querySelector('h2.mbn');
    if (h2Element && username) {
        // 创建一个新文本节点
        const newText = addedNode.createTextNode(username);
        // 替换第一个子节点（通常是文本节点）
        h2Element.replaceChild(newText, h2Element.childNodes[0]);
    }
    let psts = addedNode.querySelector('[id="psts"] ul li:nth-child(2)');
    if (psts && integral) {
        psts.textContent = integral;
    }
    let wp = addedNode.querySelector('#wp .z :nth-child(3)');
    if (wp && username) {
        wp.textContent = username;
    }
    let profilelist = addedNode.querySelector('[id="profilelist"] tr:nth-child(1) td:nth-child(2)');
    if (profilelist) {
        profilelist.textContent = username;
    }
    删除无用评论点评(addedNode);
    reply_js();
}

function pttop() {
    let nv = document.querySelector('#nv')

    let pt = document.querySelector('#pt')
    if (!pt) return;
    let navigation = pt.offsetTop //+ pt.offsetHeight 
    window.addEventListener('scroll', function () {
        // 获取页面的垂直滚动距离
        var scrollTop = window.scrollY;
        if (navigation < scrollTop) {
            pt.classList.add('top');
            nv.classList.add('top');
        } else {
            pt.classList.remove('top');
            nv.classList.remove('top');
        }
    });
}

function upnum() {
    if (!upnumber) return;
    // 删除所有已存在的 .bold 类元素
    var existingBoldElements = document.querySelectorAll('.bold');
    existingBoldElements.forEach(function (boldElement) {
        boldElement.remove();
    });
    // 创建标题元素并插入到每个 .xst 元素之前
    var icnElements = document.querySelectorAll('[id="threadlist"] tbody .common .xst');
    icnElements.forEach(function (element, index) {
        var count = index + 1;
        var title = count + '、';
        var titleElement = document.createElement('h7');
        titleElement.textContent = title;
        titleElement.className = 'bold'; // 添加 bold 类
        titleElement.style.fontWeight = 'bold';
        element.insertAdjacentElement('beforebegin', titleElement);
    });
}

function reply_js() {
    let replya = document.querySelector('[class="locked"]');
    if (replya) {
        if (!document.querySelector('.reply')) {
            let reply = document.createElement('a');
            reply.href = "javascript:;";
            reply.textContent = '快速回复';
            reply.className = 'reply';
            reply.style.margin = '0 10px 0 10px';
            replya.appendChild(reply);
            reply.addEventListener('click', async function (event) {
                let num = Math.floor(Math.random() * 5);
                document.querySelector('[class="replyfast"]')?.click();
                let intervalId = setInterval(async function () {
                    if (document.querySelector('[id="postmessage"]')) {
                        clearInterval(intervalId); // 元素存在则停止检测
                        document.querySelector('[id="postmessage"]').value = messages[num];
                        await sleep(200);
                        document.querySelector('[id="postsubmit"]').click();
                    }
                }, 100);
                setTimeout(function () {
                    clearInterval(intervalId); // 超过5秒停止检测
                }, 5000);
            });
        }
    }
    delta_qm();
}

async function scoreg() {
    document.querySelector('[id="ak_rate"]').click()
    await sleep(500)
    var a = 0
    if (Number(document.querySelector('[class="c"] > table > tbody tr:nth-child(2) td:nth-child(4)').textContent) > 0) {
        document.querySelector('[name="score2"]').value = '1'
        a = 1
    }
    if (Number(document.querySelector('[class="c"] > table > tbody tr:nth-child(3) td:nth-child(4)').textContent) > 0) {
        document.querySelector('[name="score6"]').value = '1'
        a = 1
    }
    var liElements = document.querySelectorAll('#reasonselect li');
    var randomIndex = Math.floor(Math.random() * 5); // 随机生成 0 到 4 之间的整数
    var randomText = liElements[randomIndex].textContent;
    document.querySelector('[id="reason"]').value = randomText
    await sleep(500)
    if (a === 1) {
        document.querySelector('[name="ratesubmit"]').click()
    } else {
        document.querySelector('[class="flbc"]').click()
    }

}

var sortOrder = 'desc'; // 初始排序顺序，默认为降序
function rot() {
    // 获取包含tbody元素的父元素
    const parentElement = document.querySelector('[id="threadlist"] [class="bm_c"] table');
    if (!parentElement) return;
    // 获取所有的tbody元素
    let tbodyElements = gettbody(parentElement);
    if (!tbodyElements) return;
    // 创建一个数组来存储tbody元素的顺序
    let tbodyOrder = [];
    // 遍历tbody元素，将它们的索引和时间存储到数组中
    tbodyElements?.forEach((tbody, index) => {
        const numSpan = tbody.querySelector('[class="common"] span');
        if (!numSpan) return;
        const numText = numSpan?.textContent.trim();
        if (!numText || !numText.includes('参与')) return;
        // 使用正则表达式匹配数字
        const matches = numText.match(/\d+/);
        // 将匹配到的数字转换为整数
        const num = matches ? parseInt(matches[0]) : 0;
        tbodyOrder.push({ index, num });
        tbody.remove();
    });
    // 对tbodyOrder数组按照时间进行排序
    tbodyOrder.sort((a, b) => a.num - b.num);
    if (sortOrder === 'desc') {
        tbodyOrder.reverse();
    }
    // 创建一个文档片段来存储排序后的tbody元素
    const fragment = document.createDocumentFragment();
    // 根据排序后的顺序将tbody元素插入文档片段中
    tbodyOrder.forEach(({ index }) => {
        fragment.appendChild(tbodyElements[index]);
    });
    // 清空父元素的内容
    //parentElement.innerHTML = '';
    // 将排序后的tbody元素插入父元素中
    parentElement?.appendChild(fragment);
    if (tbodyOrder.length === 0) { showToast("当前页不存在热度值的帖子。", false) };
    // 切换排序顺序
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    statistics_author(tbodyOrder, tbodyElements)
}

var sortOrder2 = 'desc'; // 初始排序顺序，默认为降序
function timeg() {
    // 获取包含tbody元素的父元素
    const parentElement = document.querySelector('[id="threadlist"] [class="bm_c"] table');
    if (!parentElement) return;
    // 获取所有的tbody元素
    let tbodyElements = gettbody(parentElement);
    // 创建一个数组来存储tbody元素的顺序
    let tbodyOrder = [];

    // 遍历tbody元素，将它们的索引和时间存储到数组中
    tbodyElements?.forEach((tbody, index) => {
        const timeSpan = tbody.querySelector('[class="by"] span');
        if (!timeSpan) return;
        const time = timeSpan?.textContent.trim();
        tbodyOrder.push({ index, time });
    });

    // 对tbodyOrder数组按照时间进行排序
    tbodyOrder.sort((a, b) => new Date(a.time) - new Date(b.time));
    if (sortOrder2 === 'desc') {
        tbodyOrder.reverse();
    }

    // 创建一个文档片段来存储排序后的tbody元素
    const fragment = document.createDocumentFragment();

    // 根据排序后的顺序将tbody元素插入文档片段中
    tbodyOrder.forEach(({ index }) => {
        fragment.appendChild(tbodyElements[index]);
    });

    // 清空父元素的内容
    // parentElement.innerHTML = '';

    // 将排序后的tbody元素插入父元素中
    parentElement?.appendChild(fragment);


    // 切换排序顺序
    sortOrder2 = sortOrder2 === 'desc' ? 'asc' : 'desc';
    statistics_author(tbodyOrder, tbodyElements)
}

var sortOrder3 = 'desc'; // 初始排序顺序，默认为降序
// 自定义的中文排序函数
function compareChinese(a, b) {
    return a?.localeCompare(b, 'zh');
}

function plateg() {
    // 获取包含tbody元素的父元素
    const parentElement = document.querySelector('[id="threadlist"] [class="bm_c"] table');
    if (!parentElement) return;
    // 获取所有的tbody元素
    let tbodyElements = gettbody(parentElement);
    // 创建一个数组来存储tbody元素的顺序
    let tbodyOrder = [];

    // 遍历tbody元素，将它们的索引和时间存储到数组中
    tbodyElements?.forEach((tbody, index) => {
        let timeSpan = tbody.querySelector('[class="by"] a');
        let timeText = timeSpan?.textContent.trim();
        if (timeText?.includes('『')) {

        } else {
            timeText = tbody.querySelector('em a')?.textContent.trim();

        }

        tbodyOrder.push({ index, time: timeText });
    });

    // 对tbodyOrder数组按照时间进行排序
    tbodyOrder.sort((a, b) => compareChinese(a.time, b.time));
    if (sortOrder3 === 'desc') {
        tbodyOrder.reverse();
    }

    // 创建一个文档片段来存储排序后的tbody元素
    const fragment = document.createDocumentFragment();

    // 根据排序后的顺序将tbody元素插入文档片段中
    tbodyOrder.forEach(({ index }) => {
        fragment.appendChild(tbodyElements[index]);
    });

    // 清空父元素的内容
    //parentElement.innerHTML = '';

    // 将排序后的tbody元素插入父元素中
    parentElement.appendChild(fragment);


    // 切换排序顺序
    sortOrder3 = sortOrder3 === 'desc' ? 'asc' : 'desc';
    statistics_author(tbodyOrder, tbodyElements)
}

var sortOrder4 = 'desc'; // 初始排序顺序，默认为降序
// 自定义的中文排序函数
function compareChinese(a, b) {
    return a?.localeCompare(b, 'zh');
}
function authorg() {
    // 获取包含tbody元素的父元素
    const parentElement = document.querySelector('[id="threadlist"] [class="bm_c"] table');
    if (!parentElement) return;
    // 获取所有的tbody元素
    let tbodyElements = gettbody(parentElement);
    // 创建一个数组来存储tbody元素的顺序
    let tbodyOrder = [];

    // 遍历tbody元素，将它们的索引和时间存储到数组中
    tbodyElements?.forEach((tbody, index) => {
        const timeSpan = tbody.querySelector('[class="by"] cite a');
        const timeText = timeSpan?.textContent.trim();
        tbodyOrder.push({ index, time: timeText });
    });

    // 对tbodyOrder数组按照时间进行排序
    tbodyOrder.sort((a, b) => compareChinese(a.time, b.time));
    if (sortOrder4 === 'desc') {
        tbodyOrder.reverse();
    }

    // 创建一个文档片段来存储排序后的tbody元素
    const fragment = document.createDocumentFragment();

    // 根据排序后的顺序将tbody元素插入文档片段中
    tbodyOrder.forEach(({ index }) => {
        fragment.appendChild(tbodyElements[index]);
    });

    // 清空父元素的内容
    //parentElement.innerHTML = '';

    // 将排序后的tbody元素插入父元素中
    parentElement.appendChild(fragment);
    // 切换排序顺序
    sortOrder4 = sortOrder4 === 'desc' ? 'asc' : 'desc';
    statistics_author(tbodyOrder, tbodyElements)
}

var sortOrder5 = 'desc'; // 初始排序顺序，默认为降序
function commentg() {
    // 获取包含tbody元素的父元素
    const parentElement = document.querySelector('[id="threadlist"] [class="bm_c"] table');
    if (!parentElement) return;
    // 获取所有的tbody元素
    let tbodyElements = gettbody(parentElement);
    if (!tbodyElements) return;
    // 创建一个数组来存储tbody元素的顺序
    let tbodyOrder = [];

    // 遍历tbody元素，将它们的索引和时间存储到数组中
    tbodyElements?.forEach((tbody, index) => {
        const numSpan = tbody.querySelector('[class="bm_c"] [class="num"] a');
        if (!numSpan) return;
        const numText = numSpan.textContent.trim();
        // 使用正则表达式匹配数字
        const matches = numText.match(/\d+/);
        // 将匹配到的数字转换为整数
        const num = matches ? parseInt(matches[0]) : 0;
        tbodyOrder.push({ index, num });
    });

    // 对tbodyOrder数组按照时间进行排序
    tbodyOrder.sort((a, b) => a.num - b.num);
    if (sortOrder5 === 'desc') {
        tbodyOrder.reverse();
    }
    // 创建一个文档片段来存储排序后的tbody元素
    const fragment = document.createDocumentFragment();

    // 根据排序后的顺序将tbody元素插入文档片段中
    tbodyOrder.forEach(({ index }) => {
        fragment.appendChild(tbodyElements[index]);
    });

    // 清空父元素的内容
    // parentElement.innerHTML = '';

    // 将排序后的tbody元素插入父元素中
    parentElement?.appendChild(fragment);
    // 切换排序顺序
    sortOrder5 = sortOrder5 === 'desc' ? 'asc' : 'desc';
    statistics_author(tbodyOrder, tbodyElements)
}

var sortOrder6 = 'desc'; // 初始排序顺序，默认为降序
async function Bounty() {
    // 获取包含tbody元素的父元素
    const parentElement = document.querySelector('[id="threadlist"] [class="bm_c"] table');
    if (!parentElement) return;
    // 获取所有的tbody元素
    let tbodyElements = gettbody(parentElement);
    if (!tbodyElements) return;
    // 创建一个数组来存储tbody元素的顺序
    let tbodyOrder = [];
    // 遍历tbody元素，将它们的索引和时间存储到数组中
    tbodyElements?.forEach((tbody, index) => {
        const numSpan = tbody.querySelector('span span');
        if (!numSpan) return;
        const numText = numSpan.textContent.trim();
        // 使用正则表达式匹配数字
        const matches = numText.match(/\d+/);
        // 将匹配到的数字转换为整数
        const num = matches ? parseInt(matches[0]) : 0;
        tbodyOrder.push({ index, num });
    });
    // 对tbodyOrder数组按照时间进行排序
    tbodyOrder.sort((a, b) => a.num - b.num);
    if (sortOrder6 === 'desc') {
        tbodyOrder.reverse();
    }
    // 创建一个文档片段来存储排序后的tbody元素
    const fragment = document.createDocumentFragment();
    // 根据排序后的顺序将tbody元素插入文档片段中
    tbodyOrder.forEach(({ index }) => {
        fragment.appendChild(tbodyElements[index]);
    });

    // 清空父元素的内容
    // parentElement.innerHTML = '';

    // 将排序后的tbody元素插入父元素中
    parentElement?.appendChild(fragment);
    if (tbodyOrder.length === 0) { showToast("当前页不存在悬赏的帖子。", false) };
    // 切换排序顺序
    sortOrder6 = sortOrder6 === 'desc' ? 'asc' : 'desc';
    statistics_author(tbodyOrder, tbodyElements)
    var element = document.querySelector('tbody [class="common"] span span');
    ele(element);
}

function statistics_author(tbodyOrder, tbodyElements) {
    // 统计重复的作者昵称及其重复次数
    const authorMap = new Map();
    tbodyOrder.forEach(({ index }) => {
        const authorSpan = tbodyElements[index].querySelector('[class="by"] cite a');
        if (authorSpan) {
            const authorName = authorSpan.textContent.trim();
            if (authorMap.has(authorName)) {
                authorMap.set(authorName, authorMap.get(authorName) + 1);
            } else {
                authorMap.set(authorName, 1);
            }
        }
    });
    // 打印重复的作者昵称及其重复次数
    authorMap.forEach((value, key) => {
        if (value > 1) {
            console.log(`作者昵称 "${key}" 重复 ${value} 次\n`);

        }
    });
    console.log(`\n`)
    upnum();
}

function gettbody(parentElement) {
    // 找到 id 为 "forumnewshow" 的元素
    const forumNewShow = document.getElementById('forumnewshow');
    // 定义要查找元素的起始点
    let startPoint;
    // 如果 forumNewShow 存在，起始点就是它的下一个元素；否则，起始点是 id 为 "separatorline" 的元素
    if (forumNewShow) {
        startPoint = forumNewShow.nextElementSibling;
    } else {
        const separatorLine = document.getElementById('separatorline');
        if (!separatorLine) {
            return parentElement.querySelectorAll('tbody');
        } else {
            startPoint = separatorLine.nextElementSibling;
        }
    }
    // 获取起始点之后的所有 tbody 元素
    const tbodyElements = [];
    let backups;
    let nextElement = startPoint;
    while (nextElement) {
        if (nextElement.tagName.toLowerCase() === 'tbody') {
            tbodyElements.push(nextElement);
            backups = nextElement
        }
        nextElement = nextElement.nextElementSibling;
        // backups.remove();
    }
    //console.log(tbodyElements);
    return tbodyElements;
}

function ele(element) {
    // 获取匹配选择器 'tbody [class="common"] span span' 的元素
    // 检查元素是否存在
    if (element) {
        // 获取元素相对于文档顶部的偏移量
        var elementOffset = element.getBoundingClientRect().top;
        // 计算滚动偏移量（元素偏移量 - 页面高度的一半）
        var scrollOffset = elementOffset - 110;
        // 滚动页面
        window.scrollBy(0, scrollOffset);
    }
}

async function hot() {
    if (!hottie) return;
    let a = 0;
    let url = '';
    if (location.href.includes('view=hot')) {
        url = `https://www.52pojie.cn/forum.php?mod=guide&view=hot&page=`
    } else {
        if (location.href.includes('view=digest')) {
            url = `https://www.52pojie.cn/forum.php?mod=guide&view=digest&page=`
        } else {
            if (location.href.includes('view=tech')) {
                url = `https://www.52pojie.cn/forum.php?mod=guide&view=tech&page=`
            } else {
                if (location.href.includes('view=newthread')) {
                    url = `https://www.52pojie.cn/forum.php?mod=guide&view=newthread&page=`
                } else { return }
            }
        }
    }

    for (let i = 2; i < Number(document.querySelector('[class="pg"] span').textContent.match(/(\d+)/g)[0]) + 1; i++) {

        if (document.querySelector('[class="pg"] strong')?.textContent === '1') {
            let data = await fetchData(`${url}${i}`)
            let doc = 元素转DOM对象(data);
            let parentElement = doc.querySelector('[id="threadlist"] [class="bm_c"] table')
            if (!parentElement) break;
            let tbodyOrder = gettbody(parentElement)
            //console.log(tbodyOrder);
            tbodyOrder.forEach((tbody) => {
                document.querySelector('[id="threadlist"] [class="bm_c"] table')?.appendChild(tbody);
            });
            if (tbodyOrder.length > 0) {
                showToast(`加载热门帖子第${i}页内容成功，加载数：${tbodyOrder.length}条`, true)
                a++
            }
        }
    }
    if (a > 0) {
        let len = document.querySelectorAll('[id="threadlist"] [class="bm_c"] table tbody')?.length
        showToast(`总共加载热门帖子数：${len}条`, true)
        upnum();
    }
}

// window.addEventListener('beforeunload', function(event) {
//     // 取消页面即将被卸载的默认行为
//     event.preventDefault();

//     // Chrome需要返回一个提示消息，其他浏览器可能不需要
//     event.returnValue = ''; 

//     // 展示确认提示
//     var confirmationMessage = '确定要离开吗？';
//     event.returnValue = confirmationMessage;
//     return confirmationMessage;
// });

//签到图标= document.querySelector('[align="absmiddle"]').src='https://static.52pojie.cn/static/image/common/wbs.png'
// let signimage=document.querySelector('[align="absmiddle"]');
// if(signimage?.src &&signimage?.src!='https://static.52pojie.cn/static/image/common/wbs.png' ){
//     location.href="https://www.52pojie.cn/home.php?mod=task&do=apply&id=2&referer=%2Findex.php"
// }



function 删除无用评论点评(doc) {
    let xh1 = doc.querySelectorAll('[class="ratl_l"] [class="xg1"]');
    if (xh1.length > 0) {
        for (let i = 0; i < xh1.length; i++) {
            let str = xh1[i].textContent.trim();
            if (str != "") {
                if (messages.some(item => item && (str.includes(item) || item.includes(str)))) {
                    xh1[i].parentElement.remove();
                }
            }
        }
    }

    let t_f = doc.querySelectorAll('[class="t_fsz"] [class="t_f"]')
    if (t_f.length > 0) {
        let g = 0;
        let item;
      
        for (let i = 0; i < t_f.length; i++) {
            let str = t_f[i].textContent.trim();
            if (str != "") {
                // if (messages.some(item => item && (str.includes(item) || item.includes(str)))) {
                //     console.log('删除评论',  str);
                //     t_f[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
                //     g++;
                // }
                // messages.forEach((item)=>{
                //     console.log('评论内容',item)
                // })
                messages.some((item) => {
                    if(item && str.includes(item) || item.includes(str)){
                       
                        let pid=t_f[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
                        if(!pid.querySelector('[class="plhin res-postfirst"]')){
                            console.log('删除评论', item,str);
                            pid.remove();
                            g++;
                            return true; // 当元素值为 3 时返回 true，终止循环
                        }
                    }
                });
            }
        }
        if (g > 0) {
            评论数();
        }
    }
    let locked = doc.querySelectorAll('[class="locked"] em')
    if (locked.length > 0) {
        for (let i = 0; i < locked.length; i++) {
            let str = locked[i].textContent.trim();
            if (str.includes('内容自动屏蔽')) {
                console.log('删除评论', str);
                locked[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
            }
        }
    }
}
function 评论数() {
    document.querySelector('.plnum')?.remove();
    var newElement = document.createElement("div");
    newElement.className = 'plnum';
    newElement.textContent = `当前页评论数${document.querySelectorAll('[class="t_fsz"] [class="t_f"]').length}`;
    newElement.style.color = 'red';
    newElement.style.fontSize = 'large';
    newElement.style.fontWeight = "600";
    newElement.style.position = 'absolute';
    newElement.style.left = '200px';
    // 获取目标元素
    var targetElement = document.querySelector('[class="y pgb"]');
    // 确保已经获取到目标元素
    if (targetElement) {
        // 将新元素插入到目标元素之前
        targetElement.parentNode.insertBefore(newElement, targetElement);
    } else {
        console.log("找不到目标元素！");
    }
}

async function fetchData(url, retryDelay) {
    retryDelay ? retryDelay : 1000
    try {
        const response = await fetch(url);
        if (response.status === 429) {
            console.log("Received 429 error. Retrying in 1 second...");
            await sleep(retryDelay); // 等待1秒
            return await fetchData(url, retryDelay); // 重新发起请求
        }
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('GBK');
        const data = decoder.decode(buffer);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//取评论()
// 使用示例
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function 取评论() {
    var currentPageUrl = window.location.href;
    console.log("当前页面的 URL：", currentPageUrl);
    // 提取页码部分
    var pageNumberMatch = currentPageUrl.match(/-(\d+)-\d+\.html/);
    if (pageNumberMatch && pageNumberMatch.length > 1) {
        var currentPageNumber = pageNumberMatch[1]; // 提取页码数
        console.log("当前页码数：", currentPageNumber);
        // 构建新的 URL，替换页码部分
        let nun = parseInt(document.querySelector(".pg")?.querySelector("span")?.textContent?.split("/")[1]);
        location.href.match(/-(\d+)-1.html/)
        console.log("总评论页数", nun);
        if(nun===Number(currentPageNumber)){showToast('当前已经是最后一页了。无需继续加载');return};
        let count = 0; // 计数器，记录已经取得的评论数
        for (let i = 0; i < nun; i++) {
            var newPageUrl = currentPageUrl.replace("-" + currentPageNumber + "-", `-${i + 1}-`);
            console.log("替换后的 URL：", newPageUrl);
            const data = await fetchData(newPageUrl);
            处理响应(data);
            count++; // 每取得一条评论，计数器加一
            if (count > 10) {
                if (count % 5 === 0) {
                    // 当取得10条评论时
                    console.log("等待2秒...", i);
                    await sleep(2000); // 等待5秒
                    console.log("继续执行...");
                    // 继续执行其他操作
                }
            }
        }
    }
}


function 处理响应(content) {
    // console.log("响应内容：", content); // 输出响应内容
    let doc = 元素转DOM对象(content);
    let postlist = doc.getElementById("postlist");
    let children = postlist.children;
    console.log("ID 为 postlist 的元素的所有子元素：", children, doc.url);
    删除无用评论点评(doc);
    // 获取具有特定 ID 的元素
    postlist = doc.getElementById("postlist");
    if (postlist) {
        // 获取该元素的所有子元素
        let children = postlist.children;
        if (children.length === 0) {
            console.log('当前页无内容', doc.URL);
        }
        for (let i2 = 0; i2 < children.length; i2++) {
            if (children[i2].getAttribute("cellspacing") === "0" || children[i2].getAttribute("pl") === 'pl' || children[i2].querySelector('.res-postfirst')) {
            } else {
                document.querySelector('[id="postlist"]').appendChild(children[i2]);
            }
        }
        // 输出所有子元素
        console.log("2,ID 为 postlist 的元素的所有子元素：", children, doc.url);
    } else {
        console.log("未找到 ID 为 postlist 的元素。");
    }
}

function 元素转DOM对象(data) {
    let htmlString = data;
    // 创建一个 DOMParser 实例
    let parser = new DOMParser();
    // 使用 DOMParser 的 parseFromString 方法将 HTML 文本解析为 DOM 对象
    return parser.parseFromString(htmlString, 'text/html');
}



function hidebangui() {
    if (!hidebg) return;
    let s = location.href.match(/forum-(\d+)-(\d+)/);
    if (s && s[2] != '1') return;
    let hide = document.createElement('span');
    hide.className = 'o';
    hide.innerHTML = `<img id="forum_rules_16_img" src="https://static.52pojie.cn/static/image/common/collapsed_no.gif" title="收起/展开" style="margin: 0 5px 0 5px;" alt="收起/展开" ">`;
    // document.querySelector('[class="th"] tr th').style.width = '71.5%';
    document.querySelector('[class="tf"]')?.appendChild(hide);
    let img = hide.querySelector('img');

    if (s && s[2] === '1') {
        if (localStorage.getItem(location.href?.match(/forum-(\d+)-(\d+)/)[0]) === 'true') {
            close(img);
        }
    }
    hide.addEventListener('click', function (event) {

        if (img.src === 'https://static.52pojie.cn/static/image/common/collapsed_yes.gif') {
            open(img);
        } else {
            close(img);
        }

    })
}


function open(img) {
    var tbodies = document.querySelectorAll('[class="bm_c"] table tbody');
    var separatorLineIndex = -1;
    // 找到 ID 为 "separatorline" 的 tbody 的索引
    for (var i = 0; i < tbodies.length; i++) {
        if (tbodies[i].id === 'separatorline') {
            separatorLineIndex = i;
            break;
        }
    }
    console.log(separatorLineIndex)
    // 隐藏 ID 为 "separatorline" 之前的所有 tbody
    for (var j = 1; j < separatorLineIndex; j++) {
        tbodies[j].style.display = 'table-row-group';
    }
    localStorage.setItem(location.href.match(/forum-(\d+)-(\d+)/)[0], false)
    img.src = "https://static.52pojie.cn/static/image/common/collapsed_no.gif"
}

function close(img) {
    var tbodies = document.querySelectorAll('[class="bm_c"] table tbody');
    var separatorLineIndex = 0;
    // 找到 ID 为 "separatorline" 的 tbody 的索引
    for (var i = 0; i < tbodies.length; i++) {
        if (tbodies[i].id === 'separatorline') {
            separatorLineIndex = i;
            break;
        }
    }
    console.log(2, separatorLineIndex)
    // 隐藏 ID 为 "separatorline" 之前的所有 tbody
    for (var j = 1; j < separatorLineIndex; j++) {
        tbodies[j].style.display = 'none';
    }
    localStorage.setItem(location.href.match(/forum-(\d+)-(\d+)/)[0], true)
    img.src = 'https://static.52pojie.cn/static/image/common/collapsed_yes.gif'
}
function showToast(message, isError) {
    // 创建新的提示框
    const toastContainer = document.createElement('div');
    // 设置样式属性
    toastContainer.style.position = 'fixed';
    toastContainer.style.justifyContent = 'center';
    toastContainer.style.top = '30%';
    toastContainer.style.left = '50%';
    toastContainer.style.width = '65vw';
    toastContainer.style.transform = 'translate(-50%, -50%)';
    toastContainer.style.display = 'flex';
    toastContainer.style.padding = '5px';
    toastContainer.style.fontSize = '20px';
    toastContainer.style.background = '#e7f4ff';
    toastContainer.style.zIndex = '999';
    toastContainer.style.borderRadius = '15px';
    toastContainer.classList.add('PopupMessage'); // 设置 class 名称为 PopupMessage
    // 根据是否为错误提示框添加不同的样式
    if (isError) {
        toastContainer.classList.add('success');
        toastContainer.style.color = '#3fc91d';
    } else {
        toastContainer.classList.add('error');
        toastContainer.style.color = '#CC5500';
    }
    // 将提示框添加到页面中
    document.body.appendChild(toastContainer);
    // 获取页面高度的 20vh
    const windowHeight = window.innerHeight;
    //设置最低的高度。
    const height = windowHeight * 0.2;
    // 设置当前提示框的位置
    toastContainer.style.top = `${height}px`;
    // 在页面中插入新的信息
    const toast = document.createElement('div');
    // 使用 <br> 实现换行
    toast.innerHTML = message.replace(/\n/g, '<br>');
    toastContainer.appendChild(toast);
    // 获取所有的弹出信息元素，包括新添加的元素
    const popupMessages = document.querySelectorAll('.PopupMessage');
    // 调整所有提示框的位置
    let offset = 0;
    popupMessages.forEach(popup => {
        if (popup !== toastContainer) {
            popup.style.top = `${parseInt(popup.style.top) - toast.offsetHeight - 5}px`;
        }
        offset += popup.offsetHeight;
    });
    // 在 3 秒后隐藏提示框
    setTimeout(() => {
        toastContainer.classList.add('hide');
        // 过渡动画结束后移除提示框
        setTimeout(() => {
            toastContainer.parentNode.removeChild(toastContainer);
        }, 300);
    }, 3000);
}

function delta_qm() {
    if (!qianming) return;
    let plm = document.querySelectorAll('[class="plc plm"]');
    plm.forEach((ele) => {
        ele.remove()
    })
}


function 监测页面请求() {


    // 保存原始的 XMLHttpRequest 对象
    var originalXhrOpen = XMLHttpRequest.prototype.open;
    var originalXhrSend = XMLHttpRequest.prototype.send;
    // 重写 XMLHttpRequest 的 open 方法
    XMLHttpRequest.prototype.open = function (method, url) {
        //console.log('发起网络请求：', method, url);

        // 保存请求URL
        this.__url = url;

        // 调用原始的 open 方法
        originalXhrOpen.apply(this, arguments);
    };
    // 重写 XMLHttpRequest 的 send 方法
    XMLHttpRequest.prototype.send = function (data) {
        var xhr = this;

        // 监听请求完成事件
        xhr.addEventListener('load', function () {
            // console.log('请求URL：', xhr.__url);
            // console.log('请求头：', xhr.getAllResponseHeaders());
            // console.log('响应内容：', xhr.responseText);
            if (xhr.responseType === 'arraybuffer') {
                // 处理 ArrayBuffer 类型的响应
                var arrayBuffer = xhr.response;
                // 在这里进行 ArrayBuffer 类型响应的处理
            } else {
                // 处理 text 类型的响应
                // console.log('响应内容：', xhr.responseText);
                数据判断(xhr.__url, xhr.responseText);
            }
        });

        // 调用原始的 send 方法
        originalXhrSend.apply(this, arguments);
    };

}
function 数据判断(url, data) {
    if (url.includes('forum.php?mod=forumdisplay')) {
        upnum();

    }
}