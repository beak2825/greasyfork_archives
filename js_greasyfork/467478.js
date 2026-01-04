// ==UserScript==
// @name         設置定時
// @namespace    bonbon村粉
// @version      2.2
// @description  設置定時，希望有效
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467478/%E8%A8%AD%E7%BD%AE%E5%AE%9A%E6%99%82.user.js
// @updateURL https://update.greasyfork.org/scripts/467478/%E8%A8%AD%E7%BD%AE%E5%AE%9A%E6%99%82.meta.js
// ==/UserScript==

(function() {
    'use strict';


//2.1
//更新了定时完成修改innerhtml文案

//2.2
//把错误提醒去掉，改成自动刷新并自动开始



    // 保存20个文案到数组中
const messages = [
'既然选择远方，当不负青春，砥砺前行。,你只管努力，剩下的交给时间。',
'青春由磨砺而出彩，人生因奋斗而升华！,如今我努力奔跑，不过是为了追上那个曾经被寄予厚望的自己 —— 约翰。利文斯顿',
'但行前路，不负韶华！,要有最朴素的生活和最遥远的梦想，即使明天天寒地冻，山高水远，路远马亡。 —— 《枫》',
'每一个裂缝都是为透出光而努力,成功的秘诀就是每天都比别人多努力一点。',
'美好的一天，上帝不会就这样给你，需要自己去创造。,别抱怨努力的苦，那是你去看世界的路。',
'你要做冲出的黑马 而不是坠落的星星。,一个人为什么要努力？ 我见过最好的答案就是：因为我喜欢的东西都很贵，我想去的地方都很远，我爱的人超完美。',
'纵然世间黑暗，仍有一点星光。,你必须非常努力，才能看起来毫不费力。',
'试一下，你会比你自己想象中的还要强大,当你在荒废时间，有多少人在拼命。别在最该奋斗的日子，选择了安逸。',
'眼里有不朽的光芒 心里有永恒的希望,在你想要放弃的那一刻，想想为什么当初坚持走到了这里。',
'等待的不仅仅是未来，还有希望…,任何不走心的努力都是敷衍你自己。',
'只有极致的拼搏，才能配得上极致的风景。,再小的努力，乘以365都很明显。',
'如果痛恨所处的黑暗，请你成为你想要的光。 —— 顾城,专注你的梦想，做自己的英雄。',
'以蝼蚁之行，展鸿鹄之志。,',
'一个人至少拥有一个梦想，有一个理由去坚强。,选一个方向，定一个时间；剩下的只管努力与坚持，时间会给我们最后的答案。',
'你可以一无所有，但绝不能一无是处。,不要假装努力，结果不会陪你演戏。',
'努力的时间还不够 哪有时间去绝望啊 —— 余安,当你真正喜欢做一件事时，自律就会成为你的本能。 —— 武志红',
'彗星般的人生可以短暂，但绝不黯淡或沉沦。 —— 纳兰容若,梦想，可以天花乱坠，理想，是我们一-步一个脚印踩出来的坎坷道路。 —— 三毛',
'抱怨身处黑暗，不如提灯前行。 —— 刘同《向着光亮那方》,你所做的一切努力并不会立即给你想要的一切 但可以让你逐渐成为你想成为的那一种人',
'黑暗的笼罩更会凸显光明的可贵。,努力成为自己喜欢的那种人 就算不成功 至少你会喜欢 这样努力的自己❤ —— 松子',
'你要成长，绝处也能逢生,你的压力来源于无法自律只是假装努力',
'心态决定高度，细节决定成败。,为梦想选择了远方，便没有回头路可以走。所以，要么战死沙场，要么狼狈回乡。',
'没人会嘲笑竭尽全力的人。 —— 《家庭教师》,没有退路，只能让自己变得强大',
'上天是公平的，有付出就有收获。,每天早上醒来时，我们可以有两个简单的选择：回头去睡，继续做梦。或者，起身去追逐梦想。',
'生活很苦，但不要放弃爱与希望 —— 《送你一朵小红花》,低调！才是最牛B的炫耀！！',
'过去的价值不代表未来的地位。,人生就是这样，要耐的住寂寞，才守得住繁华。 —— 七堇年',
'惟有主动付出，才有丰富的果实获得收获。,喜欢就要争取，不行就要努力。',
'站在死亡面前并不可怕，可怕的是不能牺牲的有所价值。,只有经历地狱般的磨练，才能炼出创造天堂的力量。',
'存在是因为价值创造!淘汰是因为价值丧失。,梦想不是空口无凭的大话，而是在寂静的奋斗里努力生长的果实！',
'价值的真正意义在于宁愿牺牲自己，也不愿拖累他人的精神。,努力把平凡的日子堆砌成伟大的人生。 —— 俞敏洪',
'当你全心全意为一个人付出时，这个人往往会背叛你。因为你已经全然付出，从而毫无新鲜感和利用价值。,',
'人生一世，总有个追求，有个盼望，有个让自己珍视，让自己向往，让自己护卫，愿意为之活一遭，乃至愿意为之献身的东西，这就是价值了。,人能走多远，不是问两脚，而要问志向。',
'什么都不懂的人是毫无价值的。,当你的才华不足以满足你的野心时，应该静下心来努力学习。',
'无私的奉献不仅可以帮助别人，也会在无形中提升自己的价值。,如果你问一个善于溜冰的人怎样获得成功时，他会告诉你：“跌倒了，爬起来”，这就是成功。 —— 牛顿',
'价值不等同于付出，但是付出却可以换来价值。,世上哪有什么成功，那只是努力的另一个代名词罢了。',
'任务在无形中完成，价值在无形中升华。,你要成长，绝处也能逢生',
'个人与不一样的人在一起也会出现不一样的价值!一个人与不一样的平台也会体现不同的价值。,天才是百分之一的灵感，百分之九十九的血汗。 —— 爱迪生',
'面对生活，不能无欲无求，但也不能过度强求，贫富只是身外之物的落差，不代表生存的价值。,少年的肩，应该担起草长莺飞和明月清风',
'当我们远离了言语与是非，我们的一切存在也就真实地显露了本来的价值。,自嘲，是有自信的人，才做得到的事！ —— 蔡康永',
'你若喜爱你本身的价值，那么你就得给世界创造价值。,努力不是为了得到更多 而是为了选择更多',
'人们总是喜欢高估自己所没有的东西的价值，而忽视自己本身所拥有的东西。,努力让自己发光，对的人才会迎光而来。',
'精彩的人生是在有限生命中实现无限价值的人生。,没有谁能够阻止你 成为一个优秀的人',
'人一生的价值，不应该用时间去衡量，而是用深度去衡量。,你只有尽力了，才有资格说自己的运气不好。',
'成功最重要的因素是要有一个健康的身体和旺盛的精力。,没有伞的孩子，必须努力奔跑！',
'成功之花，人们往往惊羡它现时的明艳，然而当初，它的芽儿却浸透了奋斗的泪泉，洒满了牺牲的血雨。,你可以胜利，也可以失败，但你不能屈服。',
'成功是陡峭的阶梯，两手插在裤袋里是爬不上去的。,伟大的人不是生下来就伟大的，而是在成长过程中显示其伟大的。 —— 《教父》',
'成功没有奇迹，只有轨迹；成功不靠条件，只靠信念!,思路清晰远比卖力苦干重要，心态正确远比现实表现重要，选对方向远比努力做事重要，做对的事情远比把事情做对重要。 —— 李嘉诚',
'成功就是失败到失败，也丝毫不减当初的热情。,心若有所向往，何惧道阻且长。',
'成功的关键，在于勇敢承担责任。,要在这个世界上获得成功，就必须坚持到底：至死都不能放手。 —— 伏尔泰',
'成功的道路别自己一个人摸索，只有多问路才不会迷路。,停下来休息的时候，不要忘记别人还在奔跑。',
'努力不一定成功，但放弃一定会失败。,从不浪费时间的人，没有工夫抱怨时间不够。 —— 杰弗逊',
'自己战胜自己是最可贵的胜利。,不拼不搏，人生白活，不苦不累，生活无味。',
'成功没有什么秘诀，如果真的有，也就两个，第一个就是坚持到底，永不放弃；第二个是当你想放弃的时候，回过头来看看第一个秘诀。,决定我们成为什么样人的，不是我们的能力，而是我们的选择。',
'人生虽曲折，记得活出精彩。,',
'怕的不是做不到，而是想都不敢想。, 不经一番彻骨寒，哪有梅花扑鼻香?',
'此刻打盹，你将做梦；此刻学习，你将圆梦。, 你可以走慢点，但千万别后退',
'得之坦然，失之淡然，争取必然，顺其自然。, 先相信你自己，然后别人才会相信你。 —— 屠格涅夫',
'世界的模样，取决你凝视它的目光。, 奋斗是自有人类以来就生生不息的 —— 孙中山《三民主义》',
'现在睡觉的话会做梦，而现在学习的话会让梦实现。, 梦想无论怎么模糊，它总潜伏在我们心底，使我们的心境永远得不到宁静，直到梦想成为事实。',
'那些比我强大的人都还在拼命。我有什麽理由不去努力。, 当勤奋成了一种习惯，你也就习惯了勤奋。',
'当你想要放弃的时候想想当初为什么坚持到这里。, 凡自强不息者，终将得到救赎。 —— 浮士德',
'以良好的心态面对生活，你的生活才美好。, 那些杀不死你的，终将使你强大。',
'把握现在, 只有努力才会成为真正的强者',
'人最大的对手，就是自己的懒惰。, 心若有阳光，你便会看见这个世界有那么多美好值得期待和向往。',
'人生不求与人相比，但求超越自己。, 我要努力变优秀 然后骄傲的生活',
'无论何时，不管怎样，我也绝不允许自己有一点点心丧气。 —— 爱迪生, 你有多自信，世界就有多相信你！你有多坚持，成功就有多眷顾你！',
'笨鸟先飞早入林，笨人勤学早成材 —— 《省世格言》, 成功来自使我们成功的信念。',
'成功是由日复一日的点滴努力汇聚而成的。, 成功是你即使跨过一个又一个的失败，但也没有失去热情。',
'一个有坚强心志的人，财产可以被人掠夺，勇气却不会被人剥夺的。 —— 雨果, 只要有梦想！你永远都是年轻！',
'迈开脚步，再长的路也不在话下；停滞不前，再短的路也难以到达。, 人生路上没有永远的成功，只有永远的奋斗。',
'梦想从这刻起，并不只是个幻想，靠自己它能成为现实中的一部分。, 每天努力一点点，每天进步一点点',
'为了未来好一点，现在苦一点有什么。, 三十年河东，三十年河西。莫欺少年穷！ —— 吴敬梓',
'只有承担起旅途风雨，最终才能守得住彩虹满天。, 一日一钱，千日千钱，绳锯木断，水滴石穿。 —— 班固',
'苦想没有盼头，苦干才有奔头。, 在意志面前，决无办不到的事 —— 约·海伍德',
'所有的努力 不是为了让别人觉得你了不起 而是让自己过得充实而有追求,',
'坚持意志伟大的事业需要始终不渝的精神。 —— 伏尔泰, 每天积累一点，就离成功近一点。',
'不要垂头丧气，即使失去一切，明天仍在你的手里。 —— 奥丅斯卡·王尔德, 只有经历地狱般的磨练，才能炼出创造天堂的力量。',
'既然我已经踏上这条道路，那么，任何东西都不应妨碍我沿着这条路走下去。 —— 康德, 彗星般的人生可以短暂，但绝不黯淡或沉沦。 —— 纳兰容若',
'欲穷千里目，更上一层楼。 —— 王之涣, 生命只有一次，你的任务就是竭尽全力活的精彩，活出自己，不留遗憾。',
'第一个青春是上天给的；第二个的青春是靠自己努力的。, 人一生的价值，不应该用时间去衡量，而是用深度去衡量。',
'每个梦想，都是在现实中坚持不懈才实现的。, 你的假装努力，欺骗的只有你自己，永远不要用战术上的勤奋，来掩饰战略上的懒惰。',
'只要路是对的，就不怕路远。, 你要成长，绝处也能逢生',
'成功的秘诀之一就是不让暂时的挫折击垮我们。, 伟大的人不是生下来就伟大的，而是在成长过程中显示其伟大的。 —— 《教父》',
'只有不断找寻机会的人才会及时把握机会。, 谁和我一样用功，谁就会和我一样成功。 —— 莫扎特',
'没有口水与汗水，就没有成功的泪水。, 梦里能达到的地方，总有一天，脚步也能达到。',
'勤奋是你生命的密码，能译出你一部壮丽的史诗。,',
'志在山顶的人，不会贪念山腰的风景。, 有志者,事竟成，破釜沉舟，百二秦关终属楚；苦心人,天不负，卧薪尝胆，三千越甲可吞吴。 —— 蒲松龄',
'选定一条路，坚定不移地走下去，只要你坚定梦想，即使前方是死胡同，你可以开辟出一条新的道路出来。, 天才是百分之一的灵感加上百分之九十九的努力。',
'所有的胜利，与征服自己的胜利比起来，都是微不足道。, 我成功是因为我有决心，从不踌躇。 —— 拿破仑',
'人生最宝贵的不是你拥有多少的物质，而是陪伴在你身边的人。, 那些比我强大的人都还在拼命。我有什麽理由不去努力。',
'奋斗者在汗水汇集的江河里，将事业之舟驶到了理想的彼岸。, 当你想要放弃的时候想想当初为什么坚持到这里。',
'帮别人的事做完就忘记，别人为自己做的事时时记着，哪怕这个人只有那么一次好，他也是曾经帮助过你的人。, 成功就是失败到失败，也丝毫不减当初的热情。',
'人生不可能总是顺心如意的，但是持续朝着阳光走，影子就会躲在后面。刺眼，却表明对的方向。, 美好的一天，上帝不会就这样给你，需要自己去创造。',
'努力去做自己该做的，但是不要期待回报，不是付出了就会有回报的，做了就不要后悔，不做才后悔。, 必须暗自努力，才能让你在人前显得轻松如意。',
'生活的道路一旦选定，就要勇敢地走到底，决不回头。, 你穷，是因为你没有野心。 —— 马云',
'天才是百分之一的灵感加上百分之九十九的努力。, 古之成大事者，不惟有超世之才，亦有坚忍不拔之志。 —— 苏轼',
'只有经历地狱般的磨练，才能炼出创造天堂的力量。, 没有经历过逆境的人不知道自己的力量。',
'萤火虫的光点虽然微弱，但亮着便是向黑暗挑战。, 人生就是这样，要耐的住寂寞，才守得住繁华。 —— 七堇年',
'在很多人看来，失败是可耻的，但其实，失败才是常态。, 生命很短，去做自己喜欢的 真正的富有，是你脸上的笑容',
'人不是因为没有信念而失败，而是因为不能把信念化成行动，并且坚持到底。 —— 戴尔·卡耐基, 生活不是等着暴风雨过去，而是学会在风雨中跳舞。 —— 柯云路',
'一个人失败的最大原因，就是对于自己的能力永远不敢充分信任，甚至自己认为必将失败无疑。 —— 富兰克林, 人生有些事，错过一时，就错过一世。',
', 不经历风雨，长不成大树，不受百炼，难以成钢。',
', 勇士是在充满荆棘的道路上前行的。 —— 奥维德',
', 成功有两个秘诀，一个是坚持到底，一个是永不放弃。',
', 我绝不低头，我永不后退。',
',虽然辛苦，我还是会选择那种滚烫的人生',
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