// ==UserScript==
// @name         肆月限定
// @namespace    bonbon村粉
// @version      2.3
// @description  設置定時，希望有效
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468297/%E8%82%86%E6%9C%88%E9%99%90%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/468297/%E8%82%86%E6%9C%88%E9%99%90%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';


//2.1
//更新了定时完成修改innerhtml文案

//2.2
//把错误提醒去掉，改成自动刷新并自动开始

//2.3
//新增自己可見的選項



    // 保存20个文案到数组中
const messages = [
'你不勇敢，沒人替你堅強！',
'沒有傘的孩子，必須努力奔跑！也可以雨中跳舞！',
'沒有不進步的人生，只有不進取的人！',
'我不怕千萬人阻擋，只怕自己投降。',
'不要為小事遮住視線，我們還有更大的世界。',
'如果你的面前有陰影，那是因為你的背後有陽光。',
'真正的強者，不是流淚的人，而是含淚奔跑的人。',
'窮則思變，差則思勤!沒有比人更高的山，沒有比腳更長的路！',
'你不喜歡我，我一點都不介意。因為我活下來，不是為了取悅你!',
'生活中處處充滿著溫情，只要我們有一雙善於發現的明亮的眼睛。',
'生活不是林黛玉，不會因為憂傷而風情萬種。',
'活著，我願意就這樣單純的活著，簡單的行走，活出我平凡人的精彩。',
'懂得感恩，是收穫幸福的源泉。懂得感恩，你會發現原來自己周圍的一切都是那樣的美好。',
'當我覺得我倒霉了，我就會想：這是在揮灑我的霉運，揮灑之後，剩下的就全都是幸運了！',
'要想改變我們的人生，第一步就是要改變我們的心態。只要心態是正確的，我們的世界就會的光明的。',
'要想贏，就一定不能怕輸。不怕輸，結果未必能贏。但是怕輸，結果則一定是輸。',
'不是因為生活太現實，而對生活失望。而是知道生活太現實，所以更要用心的活下去，給自己一個擁抱。',
'要成功，就要時時懷著得意淡然、失意坦然的樂觀態度，笑對自己的挫折和苦難，去做，去努力，去爭取成功！',
'真正成功的人生，不在於成就的大小，而在於你是否努力地去實現自我，喊出自己的聲音，走出屬於自己的道路。',
'人生，在歷經大大小小的各種坎坷與收穫後，我的思想真的成熟了，不再幼稚的面對問題，而是沉著冷靜的思考。',
'低頭是一種能力，它不是自卑，也不是怯弱，它是清醒中的善變。有時，稍微低一下頭，或者我們的人生路會更精彩。',
'天塌下來，有個高的人幫你扛著，可是你能保證，天塌下來的時候，個兒高的人沒在彎腰嗎?之後，還不是得靠自己！',
'人活著就是為了解決困難。這才是生命的意義，也是生命的內容。逃避不是辦法，知難而上往往是解決問題的最好手段。',
'人生就有許多這樣的奇蹟，看似比登天還難的事，有時輕而易舉就可以做到，其中的差別就在於非凡的信念。',
'生命就是一杯清茶，就是一支歌謠，就是一首耐人尋味的小詩!讓我們一路行走，一路品味，一路經歷，靜靜享受這美麗的人生!',
'人活著，便注定了這輩子的奔波與勞累。有太多的選擇與無數的十字路口，這些太多的背後，我們只能選擇讓心去承受，學會沉澱。',
'即使遭遇了人間最大的不幸，能夠解決一切困難的前提是……活著。只有活著，才有希望。無論多麼痛苦、多麼悲傷，只要能夠努力地活下去，一切都會好起來。',
'人的一生中不可能會一帆風順，總會遇到一些挫折，當你對生活失去了信心的時候，仔細的看一看、好好回想一下你所遇到的最美好的事情吧，那會讓你感覺到生活的美好。',
'人活著，要有所追求，有所夢想，要生活得開心，快樂，這才是理想的人生。上天給我們機會，讓我們來到世間走一遭，我們要珍惜，因為生命是如此的短暫，如果我們不知道珍惜，它將很快的逝去，到頭來我們將一事無成。',
'生命不息，奮鬥不止！只要相信，只要堅持，只要你真的是用生命在熱愛，那一定是天賦使命使然，那就是一個人該堅持和努力的東西，無論夢想是什麼，無論路有多曲折多遙遠，只要是靈魂深處的熱愛，就會一直堅持到走上屬於自己的舞台！',
];
// 定义一个全局变量来表示是否是通过location.reload()触发的reload
var isReloadedByProgram = false;

    var timeweibocounter = localStorage.getItem('timeweibocounter') || 0;

async function selectDateAndTimeAndSendMessage() {

       timeweibocounter++;
    localStorage.setItem('timeweibocounter', timeweibocounter);

    function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
    await delay(1000)
// Click the date button to open the 定時
document.querySelector('#homeWrap > div.woo-panel-main.woo-panel-top.woo-panel-right.woo-panel-bottom.woo-panel-left.Card_wrap_2ibWe.Card_bottomGap_2Xjqi > div > div:nth-child(4) > div > div.woo-box-flex.Tool_iconitem_2d5Oo > div > i').click();

    await delay(1000);
    // Find the input element
const input = document.querySelector('input[data-v-64ee1ddd]');

// Get today's date
const today = new Date();

// Initialize target date
let targetDate = new Date();

// Set target date based on timeweibocounter
if (timeweibocounter >= 0 && timeweibocounter <= 5) {
  // Set the date to tomorrow
  targetDate.setDate(today.getDate() + 1);
} else if (timeweibocounter >= 6 && timeweibocounter <= 10) {
  // Set the date to the day after tomorrow
  targetDate.setDate(today.getDate() + 2);
} else if (timeweibocounter >= 11 && timeweibocounter <= 15) {
  // Set the date to the day after the day after tomorrow
  targetDate.setDate(today.getDate() + 3);
} else if (timeweibocounter >= 16 && timeweibocounter <= 20) {
  // Set the date to the day after the day after tomorrow
  targetDate.setDate(today.getDate() + 4);
} else if (timeweibocounter >= 21 && timeweibocounter <= 25) {
  // Set the date to the day after the day after tomorrow
  targetDate.setDate(today.getDate() + 5);
}

// Format the date as 'YYYY/MM/DD'
const year = targetDate.getFullYear();
const month = ('0' + (targetDate.getMonth() + 1)).slice(-2);
const day = ('0' + targetDate.getDate()).slice(-2);
const formattedDate = `${year}/${month}/${day}`;


  // Set日期输入框的值为明天的日期
  input.value = formattedDate;

// Trigger a Vue.js input event to update the model value
const event = new Event('input', { bubbles: true });
input.dispatchEvent(event);


// Define a function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
await delay(1000);
// Generate a random hour between 0 and 23
const randomHour = getRandomInt(0, 23);
    console.log('时间是' + randomHour)


// Find the hour element in the hour picker and click it
const hourElement = document.evaluate(`//span[contains(., '${randomHour} 时')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
hourElement.click();

await delay(1000);
// Find the available minute elements in the minute picker and choose a random one
const availableMinuteElements = document.evaluate("//span[contains(text(),'0 分') and not(contains(text(),'10 分')) and not(contains(text(),'20 分')) and not(contains(text(),'30 分')) and not(contains(text(),'40 分')) and not(contains(text(),'50 分'))]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
availableMinuteElements.click();

     // 随机选择两个文案
const randomIndexes = [];
while (randomIndexes.length < 2) {
  const randomIndex = Math.floor(Math.random() * messages.length);
  if (!randomIndexes.includes(randomIndex)) {
    randomIndexes.push(randomIndex);
  }
}

// 获取选中的文案内容
const message1 = messages[randomIndexes[0]];
const message2 = messages[randomIndexes[1]];

        console.log(message1)

// 在文本框中输入文案内容
const textareaElement = document.querySelector('#homeWrap > div > div > div > div > textarea');
textareaElement.value = message1 + '\n' + message2;

// 触发input事件以更新Vue.js模型
textareaElement.dispatchEvent(new Event('input', { bubbles: true }));


    document.querySelector('#homeWrap > div.woo-panel-main.woo-panel-top.woo-panel-right.woo-panel-bottom.woo-panel-left.Card_wrap_2ibWe.Card_bottomGap_2Xjqi > div > div:nth-child(4) > div > div.woo-pop-wrap.Visible_limits_11OKi > span > div > div.Visible_text_1QIP8').click();
    await delay(500);
    document.querySelector('#homeWrap > div.woo-panel-main.woo-panel-top.woo-panel-right.woo-panel-bottom.woo-panel-left.Card_wrap_2ibWe.Card_bottomGap_2Xjqi > div > div:nth-child(4) > div > div.woo-pop-wrap.Visible_limits_11OKi > div > div > div:nth-child(4)').click();

    await delay(1000);
    document.querySelector('#homeWrap > div.woo-panel-main.woo-panel-top.woo-panel-right.woo-panel-bottom.woo-panel-left.Card_wrap_2ibWe.Card_bottomGap_2Xjqi > div > div:nth-child(4) > div > div.Tool_check_2d3ld > button').click();

    await delay(1000);
    var frequentOperation = document.evaluate("//div[contains(@class,'woo-toast--error')]//span[contains(text(),'获取数据失败')]", document, null, XPathResult.ANY_TYPE, null);
    var operationElement = frequentOperation.iterateNext();
    while (operationElement) {
      startButton.disabled = false; // 启用 start button

//refresh the page and auto start the program again
// Set isReloadedByProgram to true and then reload the page
isReloadedByProgram = true

location.reload();

      //alert("渣浪發瘋，刷新頁面再點開始吧！");
      operationElement = frequentOperation.iterateNext();
    }


}

    var isStarted = false
// 定义一个变量来表示是否已经点击了start按钮
var startButton = document.createElement("button");
startButton.innerHTML = "設置5天定時";
startButton.setAttribute("floatButton", "");
startButton.style.zIndex = "9999999";
startButton.style.position = "fixed";
startButton.style.top = "200px";
startButton.style.height = "30px";
startButton.style.minWidth = "40px";
startButton.style.fontSize = "16px";
startButton.style.padding = "0 10px";
startButton.style.border = "0";
startButton.style.borderRadius = ".25em";
startButton.style.background = "initial";
startButton.style.backgroundColor = "#d4fad4";
startButton.style.color = "#727bf7";
startButton.addEventListener("click", async function() {
    isStarted = true
  startButton.disabled = true;
  console.log('停止了startbutton')
  while (timeweibocounter < 25) {
    await selectDateAndTimeAndSendMessage();
    timesweibocounterButton.innerHTML = "定時了" + timeweibocounter + "條";
  }
  if (timeweibocounter >= 25) {
    timesweibocounterButton.innerHTML = "定時完成，按一键登出换号吧";
  }
});

// 每次页面加载时检查localStorage中的isStarted值
window.addEventListener('load', () => {
  if (localStorage.getItem('isStarted') === 'true' && localStorage.getItem('isReloadedByProgram') === 'true') {
startButton.click()
  }
});

// 在页面关闭前保存isStarted的值到localStorage中
window.addEventListener('beforeunload', () => {
localStorage.setItem('isStarted', isStarted);
localStorage.setItem('isReloadedByProgram', isReloadedByProgram.toString());
console.log('isReloadedByProgram:', isReloadedByProgram); // 输出isReloadedByProgram的值
});

//顯示次數
var timesweibocounterButton = document.createElement("button");
timesweibocounterButton.innerHTML = "定時了" + timeweibocounter + "條";
timesweibocounterButton.setAttribute("floatButton", "");
timesweibocounterButton.style.zIndex = "9999999";
timesweibocounterButton.style.position = "fixed";
timesweibocounterButton.style.top = "240px";
timesweibocounterButton.style.height = "30px";
timesweibocounterButton.style.minWidth = "40px";
timesweibocounterButton.style.fontSize = "16px";
timesweibocounterButton.style.padding = "0 10px";
timesweibocounterButton.style.border = "0";
timesweibocounterButton.style.borderRadius = ".25em";
timesweibocounterButton.style.background = "initial";
timesweibocounterButton.style.backgroundColor = "#d4fad4";
timesweibocounterButton.style.color = "#727bf7";

//如果自己手動登出了，就需要手動重置一次。
var resetButton = document.createElement("button");
resetButton.innerHTML = "重置定时次数";
resetButton.setAttribute("floatButton", "");
resetButton.style.zIndex = "9999999";
resetButton.style.position = "fixed";
resetButton.style.top = "280px";
resetButton.style.height = "30px";
resetButton.style.minWidth = "40px";
resetButton.style.fontSize = "16px";
resetButton.style.padding = "0 10px";
resetButton.style.border = "0";
resetButton.style.borderRadius = ".25em";
resetButton.style.background = "initial";
resetButton.style.backgroundColor = "#d4fad4";
resetButton.style.color = "#727bf7";
resetButton.addEventListener("click", async function() {
localStorage.setItem('timeweibocounter', 0);
});

//自動點擊登出，會把次數也一起重置
var logoutButton = document.createElement("button");
logoutButton.innerHTML = "一键登出重置";
logoutButton.setAttribute("floatButton", "");
logoutButton.style.zIndex = "9999999";
logoutButton.style.position = "fixed";
logoutButton.style.top = "320px";
logoutButton.style.height = "30px";
logoutButton.style.minWidth = "40px";
logoutButton.style.fontSize = "16px";
logoutButton.style.padding = "0 10px";
logoutButton.style.border = "0";
logoutButton.style.borderRadius = ".25em";
logoutButton.style.background = "initial";
logoutButton.style.backgroundColor = "#d4fad4";
logoutButton.style.color = "#727bf7";
logoutButton.addEventListener("click", async function() {

const confirmed = confirm("确定需要登出吗？ ");

if (confirmed) {

    localStorage.setItem('timeweibocounter', 0);

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await delay(500)

// 获取要点击的第一个span元素
const firstSpan = document.evaluate('//*[@id="app"]/div[2]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[1]/div[1]/span/div',document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

// 点击第一个span元素
firstSpan.click();
    console.log('设置')

// 等待500毫秒
await delay(500);

// 获取要点击的第二个span元素
const secondSpan = document.evaluate('//*[@id="app"]/div[2]/div[1]/div/div[1]/div/div/div[3]/div[2]/div[1]/div[1]/div/div/div[11]/span/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

// 点击第二个span元素
secondSpan.click();

await delay(500);

const confirmSpan = document.querySelector('#app > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(3) > button:nth-child(2)');
confirmSpan.click();

}
});


document.body.appendChild(startButton);
document.body.appendChild(timesweibocounterButton);
document.body.appendChild(resetButton);
document.body.appendChild(logoutButton);



})();