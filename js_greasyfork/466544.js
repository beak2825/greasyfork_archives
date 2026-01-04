// ==UserScript==
// @name         b站统计真实评分
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  b站统计真实评分，使用后在番剧介绍页和游戏介绍页会多一个“计算真实评分”的按钮，点击将会收集**所有能进行访问的评论**进行统计，得出真实评分。
// @author       thunder-sword【b站up主：月雨洛然】
// @match        https://www.bilibili.com/bangumi/media/md*
// @match        https://www.biligame.com/detail/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466544/b%E7%AB%99%E7%BB%9F%E8%AE%A1%E7%9C%9F%E5%AE%9E%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/466544/b%E7%AB%99%E7%BB%9F%E8%AE%A1%E7%9C%9F%E5%AE%9E%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

//常量作用：全局设置
const settings = {
    "game_float_button": 1, //游戏区页面是否启用悬浮窗按钮，启用后会在页面右下角多一个“计算真实评分”的悬浮按钮，因为页面元素不同缘故，有些游戏不能不好插入页面按钮，所以可以点击悬浮窗运行代码
    "reTryGapTime": 500, //失败时重试等待时间
}

//作用：检验页面作用域，并执行对应函数
function mainFunction(){
    let id = 0;
    if(location.href.match(/media\/md(\d+)/)){
        console.log("当前位于视频页面");
        id = location.href.match(/media\/md(\d+)/)[1];
        statMedia(id);
    } else if(location.href.match(/biligame.com\/detail\/\?id=(\d+)/)) {
        console.log("当前位于游戏页面");
        id = location.href.match(/biligame.com\/detail\/\?id=(\d+)/)[1];
        statGame(id);
    } else{
        alert("未知的页面，无法运行脚本");
        throw new Error("未知的页面，无法运行脚本");
    }
}

//作用：运行时的进度条渲染
function beforeRender(type) {
    const dialog = document.createElement('div');
    document.body.appendChild(dialog);
    dialog.style.position = 'fixed';
    dialog.style.width = '100%';
    dialog.style.height = '100%';
    dialog.style.background = 'rgba(0,0,0,.8)';
    dialog.style.top = '0';
    dialog.style.left = '0';
    dialog.style.zIndex = '999';
    dialog.style.display = 'flex';
    dialog.style.alignItems = 'center';
    dialog.style.justifyContent = 'center';


    const dialogContent = document.createElement('div');
    dialog.appendChild(dialogContent);

    dialogContent.style.width = '455px';
    dialogContent.style.height = '200px';
    dialogContent.style.background = '#fff';
    dialogContent.style.borderRadius = '6px';
    dialogContent.style.padding = '51px 0';

    var render = undefined;

    if("media"==type){
        const shortWrap = document.createElement('div');
        dialogContent.appendChild(shortWrap);
        const longWrap = document.createElement('div');
        dialogContent.appendChild(longWrap);

        shortWrap.style.width = longWrap.style.width = '455px';
        shortWrap.style.height = longWrap.style.height = '100px';
        shortWrap.style.display = longWrap.style.display = 'flex';
        shortWrap.style.alignItems = longWrap.style.alignItems = 'center';
        shortWrap.style.justifyContent = longWrap.style.justifyContent = 'center';

        // --------------
        const shortw1 = document.createElement('div');
        const longw1 = document.createElement('div');
        shortWrap.appendChild(shortw1);
        longWrap.appendChild(longw1);
        shortw1.innerText = '短评:';
        longw1.innerText = '长评:';
        longw1.style.fontSize = shortw1.style.fontSize = '14px';
        longw1.style.color = shortw1.style.color = '#333';
        longw1.style.marginRight = shortw1.style.marginRight = '16px';


        const shortw2 = document.createElement('div');
        const longw2 = document.createElement('div');
        shortWrap.appendChild(shortw2);
        longWrap.appendChild(longw2);
        longw2.style.width = shortw2.style.width = '300px';
        longw2.style.height = shortw2.style.height = '32px';
        longw2.style.background = shortw2.style.background = '#eee';
        longw2.style.position = shortw2.style.position = 'relative';


        const shortPrg = document.createElement('div');
        const longPrg = document.createElement('div');
        shortw2.appendChild(shortPrg);
        longw2.appendChild(longPrg);

        longPrg.style.position = shortPrg.style.position = 'absolute';
        longPrg.style.left = shortPrg.style.left = '0';
        longPrg.style.top = shortPrg.style.top = '0';
        longPrg.style.width = shortPrg.style.width = '0%';
        longPrg.style.height = shortPrg.style.height = '100%';
        longPrg.style.background = shortPrg.style.background = '#ff85ad';


        render = function (type, percent) {
            const dom = type == 'long' ? longPrg : shortPrg;
            let width = percent + '%';
            dom.style.width = width;
        }
    } else if("game"==type){
        const nomalWrap = document.createElement('div');
        dialogContent.appendChild(nomalWrap);

        nomalWrap.style.width = '455px';
        nomalWrap.style.height = '100px';
        nomalWrap.style.display = 'flex';
        nomalWrap.style.alignItems = 'center';
        nomalWrap.style.justifyContent = 'center';

        // --------------
        const nomalw1 = document.createElement('div');
        nomalWrap.appendChild(nomalw1);
        nomalw1.innerText = '评价:';
        nomalw1.style.fontSize = '14px';
        nomalw1.style.color = '#333';
        nomalw1.style.marginRight = '16px';

        const nomalw2 = document.createElement('div');
        nomalWrap.appendChild(nomalw2);
        nomalw2.style.width = '300px';
        nomalw2.style.height = '32px';
        nomalw2.style.background = '#eee';
        nomalw2.style.position = 'relative';


        const nomalPrg = document.createElement('div');
        nomalw2.appendChild(nomalPrg);

        nomalPrg.style.position = 'absolute';
        nomalPrg.style.left = '0';
        nomalPrg.style.top = '0';
        nomalPrg.style.width = '0%';
        nomalPrg.style.height = '100%';
        nomalPrg.style.background = '#ff85ad';


        render = function (percent) {
            const dom = nomalPrg;
            let width = percent + '%';
            dom.style.width = width;
        }
    } else{
        alert(`未知的参数值${type}`);
        throw new Error(`未知的参数值${type}`);
    }

    var rmDialog = function () {
        document.body.removeChild(dialog);
    }

    return {"render": render, "rmDialog": rmDialog}
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//作用：单次请求视频评论
//参数说明：
/*
*next：单次查询光标位置
*type：选择长评或短评
*/
async function mediaGetScore(mid, next, type) {
    while(true){
        let url = `https://api.bilibili.com/pgc/review/${type}/list?media_id=${mid}&ps=12575&sort=0`;
        if (next) {
            url += `&cursor=${next}`;
        }
        const res = await fetch(url, { "method": "GET" });
        const { data } = await res.json();
        if(data!==undefined) return data;
        await delay(settings.reTryGapTime);
    }
}
//作用：根据长评或短评统计视频评论主函数，统计的同时调用render进行进度条渲染，返回当前总分数和总人数
async function mediaGetAllScores(mid, type, render) {
    let score=0, //目前总分数
        count=0; //目前总人数
    let { list, next, total } = await mediaGetScore(mid, undefined, type);
    count+=list.length;
    for (let i = 0; i < list.length; i++) {
        score += list[i].score;
    }
    render(type, count * 100 / total);

    while (true) {
        const data = await mediaGetScore(mid, next, type);
        count+=data.list.length;
        for (let i = 0; i < data.list.length; i++) {
            score += data.list[i].score;
        }
        render(type, count * 100 / total);
        next = data.next;
        if (next == 0) {
            return {"score": score, "count": count};
        }
    }
}
//作用：视频评分统计主函数，返回最后评分和评分人数
async function mediaScoreMain(id){
    //所用参数
    let shortScore = 0, //短评总分数
        shortCount = 0, //短评人数
        shortAverage = 0, //短评平均分
        longScore = 0,
        longCount = 0,
        longAverage = 0,
        totalCount = 0,
        totalAverage = 0;
    const func = beforeRender("media");
    const shortData = await mediaGetAllScores(id, "short", func.render);
    shortScore = shortData.score, shortCount = shortData.count;
    shortAverage = shortScore / shortCount;
    console.log(`短评评分人数：${shortCount}`);
    console.log(`短评平均分数：${shortAverage}`);
    const longData = await mediaGetAllScores(id, "long", func.render);
    longScore = longData.score, longCount = longData.count;
    longAverage = longScore / longCount;
    console.log(`长评评分人数：${longCount}`);
    console.log(`长评平均分数：${longAverage}`);
    func.rmDialog();
    totalCount = shortCount + longCount;
    totalAverage = (shortScore + longScore) / totalCount;
    console.log(`总平均分数：${totalAverage}`);
    showStackToast("统计结束");
    showStackToast(`共统计${totalCount}条评价`);
    showStackToast(`真实评分为：${totalAverage.toFixed(1)}`);
    return {"score": totalAverage, "count": totalCount};
}

//作用：视频评分最后添加元素对真实评分进行显示
function mediaShowScore(score, count){
    const trueScore = score.toFixed(1);
    const starLc = parseInt(Math.round(trueScore / 2));
    const starHc = 5 - starLc;
    let container = document.querySelector("#app > div.media-info-wrp > div.media-info-content > div > div.media-info-r > div.media-info-datas > div.media-info-score-wrp");
    if(!container){
        alert("获取评分容器失败，不能添加元素！");
        throw new Error("获取评分容器失败，不能添加元素！");
    }

    let parent = document.createElement("div");
    container.appendChild(parent);
    parent.className="media-info-score";
    parent.innerHTML=`<div class="media-info-score-content" style="color: #00aeec">${trueScore}</div> <div class="media-info-star-wrapper"><span class="review-stars"></span><div class="media-info-review-times" style="color: #00aeec">${count}人评</div> <div class="to-review-btn"><i class="icon-edit"></i>
                我要点评
            </div></div>`;

    //创建星星样式
    let style = document.createElement("style");
    style.innerText = `.icon-star-light-mod:before {
        content: "\\E906";
        color: #00aeec;
    }`;
    document.head.appendChild(style);

    let starsDom = parent.querySelector("span.review-stars");
    for (let i = 0; i < starLc; i++) {
        const star = document.createElement('i');
        star.className = "icon-star icon-star-light-mod";
        starsDom.appendChild(star);
    }
    for (let i = 0; i < starHc; i++) {
        const star = document.createElement('i');
        star.className = "icon-star";
        starsDom.appendChild(star);
    }
}

//作用：视频评分统计主函数
function statMedia(mid){
    //添加开始统计按钮
    var container=document.querySelector("#app > div.media-info-wrp > div.media-info-content > div > div.media-info-r > div.media-info-btns");
    if(!container){
        alert("获取按钮容器失败，请刷新重试！");
        throw new Error("获取按钮容器失败，请刷新重试！");
    }
    var button=document.createElement("div");
    button.setAttribute("class", "btn-pay-wrapper");
    button.setAttribute("style", "margin-left: 20px");
    button.innerHTML=`<a href="javascript:;" class="pay-btn ">计算真实评分</a> <div class="pic-wrapper"></div>`;
    button.addEventListener("click", async () => {
        let { score, count } = await mediaScoreMain(mid);
        mediaShowScore(score, count);
    });
    container.appendChild(button);
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

//作用：根据传入的原型params生成sign访问api，并将访问结果返回
async function gameQuery(params){
    const url = "https://line1-h5-pc-api.biligame.com/game/comment/page";
    const sign = CryptoJS.MD5(params + "BdiI92bjmZ9QRcjJBWv2EEssyjekAGKt");
    const data = await fetch(url+"?"+params+"&sign="+sign)
    .then(function(response) {
      if(!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).catch(error => {
      if (error instanceof NetworkError) {
        console.error("Network error: ", error.message);
      } else {
        console.error("Other error: ", error);
        alert("获取api数据失败，请联系开发者");
      }
    });
    return data;
}

//作用：获取request_id，即一串32位长度的字符串
function getRequestId(){
    const a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let request_id = "";
    for(let i = 0;i < 32;i++){
        request_id+=a[Math.floor(Math.random()*32)];
    }
    return request_id;
}

//作用：统计游戏评论主函数，统计的同时调用render进行进度条渲染，返回当前总分数和总人数
async function gameGetAllScores(gid, render) {
    let score=0, //目前总分数
        count=0; //目前总人数
    let request_id = getRequestId();
    let params = `appkey=h9Ejat5tFh81cq8V&game_base_id=${gid}&page_num=1&page_size=10&rank_type=3&request_id=${request_id}&ts=9692695382316`;
    let { code, data } = await gameQuery(params);
    if(0!==code){
        alert("访问api失败，请联系开发者");
        console.log(code, data);
        throw new Error("访问api失败，请联系开发者");
    }
    const page_count = data.page_count + 1;
    const total = page_count * 10;
    count+=data.list.length;
    //console.log(render);
    //console.log(count, total);
    for (let i = 0; i < data.list.length; i++) {
        score += data.list[i].grade;
    }
    render(count * 100 / total);

    for (let page = 2; page <= page_count; page++) {
        request_id = getRequestId();
        params = `appkey=h9Ejat5tFh81cq8V&game_base_id=${gid}&page_num=${page}&page_size=10&rank_type=3&request_id=${request_id}&ts=9692695382316`;
        const data = await gameQuery(params);
        if ( -703===data.code ) break; //返回数据为空
        if ( 0!==data.code ){
            alert("api访问异常，请联系开发者");
            console.log(data);
            throw new Error("api访问异常，请联系开发者");
        }
        count+=data.data.list.length;
        for (let i = 0; i < data.data.list.length; i++) {
            score += data.data.list[i].grade;
        }
        render(count * 100 / total);
    }
    return {"score": score, "count": count};
}

//作用：游戏评分统计主函数，返回最后评分和评分人数
async function gameScoreMain(id){
    //所用参数
    let totalAverage = 0;
    const func = beforeRender("game");
    const { score, count } = await gameGetAllScores(id, func.render);
    totalAverage = score / count;
    console.log(`评分人数：${count}`);
    console.log(`平均分数：${totalAverage}`);
    func.rmDialog();
    showStackToast("统计结束");
    showStackToast(`共统计${count}条评价`);
    showStackToast(`真实评分为：${totalAverage.toFixed(1)}`);
    return {"score": totalAverage, "count": count};
}

//作用：游戏评分最后添加元素对真实评分进行显示
function gameShowScore(score, count){
    const trueScore = score.toFixed(1);
    const starLc = parseInt(Math.round(trueScore / 2));
    const starHc = 5 - starLc;
    const container = document.querySelector("body > div.bui-gc > div.header-bar.one-row > div.right-panel > div > div > div.game-introduce > div.introduce-title > div.introduce-info");
    if(!container){
        showStackToast("获取评分容器失败，无法将评分放入页面内！");
        throw new Error("获取评分容器失败，无法将评分放入页面内！");
    }
    const brother = container.querySelector("div.introduce-count");
    if(!brother){
        alert("获取brother评分容器失败，不能添加元素！");
        throw new Error("获取brother评分容器失败，不能添加元素！");
    }

    let parent = document.createElement("div");
    container.insertBefore(parent, brother);
    parent.className="introduce-rate";
    parent.innerHTML=`<div class="mini-grade-summary"><span class="bui-star"></span><span class="grade introduce-grade" style="color: #00aeec !important">${trueScore}分</span></div>`;

    //创建星星样式
    let style = document.createElement("style");
    style.innerText = `.bui-star .bui-icon-star.filled-mod {
        fill: #00aeec;
    }`;
    document.head.appendChild(style);

    let starsDom = parent.querySelector("span.bui-star");
    for (let i = 0; i < starLc; i++) {
        const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        star.setAttribute("class","bui-icon bui-icon-star filled-mod");
        star.setAttribute("x",'0');
        star.setAttribute("y",'0');
        star.setAttribute("viewBox",'0 0 20 20');
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M17.7,5.6l-2.3-0.3c-0.8-0.1-1.6-0.7-2-1.5l-1.1-2.3c-1-2-3.7-2-4.7,0l-1,2.3c-0.4,0.8-1.1,1.4-2,1.5L2.2,5.6\n\t\tc-2.2,0.3-3,3.2-1.4,4.8l1.5,1.6c0.6,0.6,0.9,1.6,0.8,2.5l-0.4,2.3c-0.4,2.3,1.8,4,3.8,3l2.2-1.2c0.7-0.4,1.6-0.4,2.4,0l2.2,1.2\n\t\tc1.9,1,4.2-0.7,3.8-3l-0.4-2.3c-0.2-0.9,0.1-1.9,0.8-2.5l1.6-1.6C20.8,8.8,19.9,5.9,17.7,5.6z");
        star.appendChild(path);
        starsDom.appendChild(star);
    }
    for (let i = 0; i < starHc; i++) {
        const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        star.setAttribute("class","bui-icon bui-icon-star");
        star.setAttribute("x",'0');
        star.setAttribute("y",'0');
        star.setAttribute("viewBox",'0 0 20 20');
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M17.7,5.6l-2.3-0.3c-0.8-0.1-1.6-0.7-2-1.5l-1.1-2.3c-1-2-3.7-2-4.7,0l-1,2.3c-0.4,0.8-1.1,1.4-2,1.5L2.2,5.6\n\t\tc-2.2,0.3-3,3.2-1.4,4.8l1.5,1.6c0.6,0.6,0.9,1.6,0.8,2.5l-0.4,2.3c-0.4,2.3,1.8,4,3.8,3l2.2-1.2c0.7-0.4,1.6-0.4,2.4,0l2.2,1.2\n\t\tc1.9,1,4.2-0.7,3.8-3l-0.4-2.3c-0.2-0.9,0.1-1.9,0.8-2.5l1.6-1.6C20.8,8.8,19.9,5.9,17.7,5.6z");
        star.appendChild(path);
        starsDom.appendChild(star);
    }
}

//作用：创建一个在右下角出现的悬浮窗按钮，点击即可执行对应函数
function createFloatButton(name, func){

    // 创建一个 div 元素
    var floatWindow = document.createElement('div');

    // 设置 div 的内容
    //floatWindow.innerHTML = '点我执行代码';
    floatWindow.innerHTML = name;

    // 设置 div 的样式
    floatWindow.style.position = 'fixed';
    floatWindow.style.bottom = '10px';
    floatWindow.style.right = '10px';
    floatWindow.style.padding = '5px 10px';
    floatWindow.style.backgroundColor = '#333';
    floatWindow.style.color = '#fff';
    floatWindow.style.cursor = 'pointer';

    // 将悬浮窗的优先级提高
    floatWindow.style.zIndex = "99999";

    var isDragging = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    var cursorX;
    var cursorY;

    floatWindow.addEventListener("mousedown", function(e) {
        if (!isDragging) {
            cursorX = e.clientX;
            cursorY = e.clientY;
            initialX = cursorX - xOffset;
            initialY = cursorY - yOffset;
            isDragging = true;
        }
    });
    floatWindow.addEventListener("mousemove", function(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatWindow);
        }
    });
    floatWindow.addEventListener("mouseup", async function(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
        // 如果点击时鼠标的位置没有改变，就认为是真正的点击
        if (cursorX === e.clientX && cursorY === e.clientY) {
            await func();
        }
    });

    // 为悬浮窗添加事件处理程序，用来监听触摸开始和触摸移动事件
    // 这些事件处理程序的实现方式与上面的鼠标事件处理程序类似
    floatWindow.addEventListener('touchstart', (event) => {
        if (!isDragging) {
            cursorX = event.touches[0].clientX;
            cursorY = event.touches[0].clientY;
            initialX = cursorX - xOffset;
            initialY = cursorY - yOffset;
            isDragging = true;
        }
    });
    floatWindow.addEventListener('touchmove', (event) => {
        if (isDragging) {
            currentX = event.touches[0].clientX - initialX;
            currentY = event.touches[0].clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatWindow);
        }
    });

    // 为悬浮窗添加事件处理程序，用来监听触摸结束事件
    // 这个事件处理程序的实现方式与上面的鼠标事件处理程序类似
    floatWindow.addEventListener('touchend', async () => {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
        // 如果点击时鼠标的位置没有改变，就认为是真正的点击
        if (cursorX === event.touches[0].clientX && cursorY === event.touches[0].clientY) {
            await func();
        }
    });

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    // 将悬浮窗添加到 body 元素中
    document.body.appendChild(floatWindow);
}

//作用：游戏评分统计主函数
function statGame(gid){
    //添加悬浮窗按钮
    if(settings["game_float_button"]){
        createFloatButton("计算真实评分", async () => {
            let { score, count } = await gameScoreMain(gid);
            gameShowScore(score, count);
        });
    }
    setTimeout( () => {
        //添加开始统计按钮
        var container=document.querySelector("body > div.bui-gc > div.header-bar.one-row > div.right-panel > div > div > div.game-download > div.download-buttons.not-exist-app-store");
        if(!container){
            showStackToast("获取按钮容器失败，请使用右下角悬浮窗按钮计算真实评分！");
            throw new Error("获取按钮容器失败，请使用右下角悬浮窗按钮计算真实评分！");
        }
        var button=document.createElement("a");
        button.innerHTML=`<span>计算真实评分</span>`;
        button.addEventListener("click", async () => {
            let { score, count } = await gameScoreMain(gid);
            gameShowScore(score, count);
        });
        container.insertBefore(button, container.firstChild);
    }, 800);
}

//作用：生成toast，让其在toast_container中，显示在页面中上部，会永久性向页面添加一个id为ths_toast_container的div标签
function showStackToast(message, timeout=3000){
    //没有容器则生成容器
    let box=document.querySelector("body > div#ths_toast_container");
    if(!box){
        box=document.createElement('div');
        box.id="ths_toast_container";
        box.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    right: 10px;
    width: 300px;
    height: auto;
    display: flex;
    z-index: 9999;
    flex-direction: column-reverse;`;
        document.body.appendChild(box);
    }
    //创建toast
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
    padding: 10px;
    background-color: rgb(76, 175, 80);
    color: rgb(255, 255, 255);
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    box-shadow: rgb(0 0 0 / 30%) 0px 5px 10px;
    opacity: 1;
    transition: opacity 0.3s ease-in-out 0s;
    z-index: 9999;
    margin: 5px;
  `;
    box.appendChild(toast);
    toast.style.opacity = 1;
    if(timeout > 0){
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                box.removeChild(toast);
            }, 300);
        }, timeout);
    }
    return toast;
}

(function() {
    'use strict';
    mainFunction();
})();










