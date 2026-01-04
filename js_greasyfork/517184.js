// ==UserScript==
// @name         易班帖子自动评论点赞
// @namespace    https://wechatid.github.io/2024/11/06/Yiban-JSmonkey/
// @version      1.1
// @description  易班帖子自动评论点赞的脚本，完全自动获取网薪经验值。易班帖子自动评论点赞脚本，自动获取网薪和经验值
// @match        https://s.yiban.cn/app/*
// @exclude      https://s.yiban.cn/app/383996/post-detail/wxnC9a90k2Bge27
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/517184/%E6%98%93%E7%8F%AD%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/517184/%E6%98%93%E7%8F%AD%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==



(function () {
  "use strict";

    let COMMENT_COUNTER = 0;
    // 评论次数
    let msg_text;
  window.liked_count = 1;
  window.valid_liked_count = 1;
  let sever = 'http://113.45.159.104:8000';


    const floatingWindowHTML = `
    <div id="floatingWindow">
        <div id="title">易班自动评论发帖</div>
        <div id="announcement">公告：欢迎使用易班帖子自动评论点赞，自动执行零风险100%安全。<br>配合<a href="https://greasyfork.org/zh-CN/scripts/516166-%E6%98%93%E7%8F%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%96%E7%BD%91%E8%96%AA%E7%BB%8F%E9%AA%8C%E5%80%BC" target="_blank">自动发帖脚本</a>使用一天能获取160+网薪经验值<br>两个脚本共用同一张卡密哦~<br>加QQ群获取<strong>免费</strong>试用额度，群号：912033859  验证密码为：9412<br>刷网薪值和经验值必备！</div>

        <div class="button-row">
            <button class="btnhy" onclick="window.open('http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=73thmEuo_TCaipv8gUuEk1cTbbTgGKIe&authKey=iJEotuZey7eVphPY8Ab9b3Jk%2FSfg00laloCvM6%2FfjLkWv1sgtUWxnMtwLACYn18f&noverify=0&group_code=912033859', '_blank')">加QQ群</button>
            <button class="btnhy" onclick="window.open('https://hsfaka.cn/shop/D2GYQYL1', '_blank')">购买卡密</button>
        </div>

        <div id="countdown" style="display: inline-block;">评论次数: <div id="comment_counter" style="display: inline-block;">0</div></div>
        <div id="likes" style="display: inline-block;">点赞次数: <div id="thum_counter" style="display: inline-block;">0</div></div>
        <div id="finish_text" style="color: yellow;"></div>
        <div id="msg_key">卡密剩余次数：<div id="key_counter" style="display: inline-block; color: red;">10</div></div>

        <div id="inputRow">
            <input type="text" id="inputBox" placeholder="请输入卡密">
            <button id="subtn" class="btnhy">确定</button>
        </div>

        <span id="toggleBtn">&#9660;</span> <!-- 折叠/展开按钮 -->
    </div>
    `;
    // 将浮动窗口插入到body的第一行
    document.body.insertAdjacentHTML('afterbegin', floatingWindowHTML);

    // 2. 添加样式
    GM_addStyle(`
        #floatingWindow {
            position: fixed;
            bottom: 10px;
            left: 10px;
            width: 300px;
            max-height: 500px;
            background: #2c3e50;
            color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            padding: 10px;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        }

        #title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        #announcement {
            font-size: 13px;
            color: #bdc3c7;
            margin-bottom: 10px;
        }

        .button-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .btnhy {
            background-color: #2980b9;
            color: #fff;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }

        .btnhy:hover {
            background-color: #3498db;
        }

        #countdown, #likes,#msg_key{
            font-size: 13px;
            color: #ecf0f1;
        }

        #inputRow {
            display: flex;
            align-items: center;
        }

        #inputBox {
            width: 180px;
            padding: 6px;
            border-radius: 4px;
            border: 1px solid #34495e;
            background-color: #34495e;
            color: #ecf0f1;
            margin-right: 10px;
        }

        #toggleBtn {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 17px;
            cursor: pointer;
            color: #fff;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            padding: 5px;
        }

        #floatingWindow.collapsed {
            max-height: 40px;
            overflow: hidden;
        }
    `);

    // 3. 添加折叠和展开功能
    const toggleBtn = document.getElementById('toggleBtn');
    const floatingWindow = document.getElementById('floatingWindow');

    toggleBtn.addEventListener('click', () => {
        floatingWindow.classList.toggle('collapsed');
        toggleBtn.innerHTML = floatingWindow.classList.contains('collapsed') ? '&#9650;' : '&#9660;';
    });



    // 从 localStorage 中读取保存的 API Key
	let savedKey = localStorage.getItem('apiKey');
	if (savedKey) {
		// 如果有保存的API Key，将其填充到输入框
		document.getElementById('inputBox').value = savedKey;
	} else {
		document.getElementById('inputBox').placeholder = "暂未填写你的卡密";
	}
	// 获取确认按钮并添加事件监听器
	document.getElementById('subtn').addEventListener('click', function() {
		// 获取用户输入的 API Key
		const apiKey = document.getElementById('inputBox').value;

		if (apiKey) {
			// 存储用户输入的 API Key 到 localStorage
			localStorage.setItem('apiKey', apiKey);
			savedKey = localStorage.getItem('apiKey');
			document.getElementById('inputBox').value = savedKey;
			alert('卡密已保存，请妥善保管，清除缓存会丢失卡密信息！刷新页面即可开始');
		} else {
			//alert('请输入有效的API Key');
		}
	});

    let remaining = document.getElementById('key_counter');//剩余次数
    GM_xmlhttpRequest({
		method: 'GET',
		url: sever + '/check_counter?key=' + savedKey,
		headers: {
			'Accept': 'application/json'
		},
		onload: function(r) {
			if (r.status === 200) {
				try {
					const j = JSON.parse(r.responseText);
					remaining.textContent = j.counter;
				} catch (e) {
					remaining.textContent = '响应解析失败';
				}
			} else {
				remaining.textContent = '卡密不存在';
			}
		},
		onerror: function() {
			remaining.textContent = '请求失败';
		}
	});


  setTimeout(() => {
    window.scrollTo(0, document.querySelector("body > div.container.with-bg > section > section.comments.box").offsetTop);

    setTimeout(() => {
      window.scrollTo(0, document.querySelector("body > div.container.with-bg > section > section.comments.box").offsetTop + 105 * 20);

      setTimeout(() => {
        let reloadCoult = document.querySelector("body > div.container.with-bg > section > section.comments.box > div").children.length;
        if (reloadCoult >= 35) {
            Thumbs();
            executeFirstPart(startInterval);
            //评论执行入口（函数调用）
        } else {
          alert("脚本加载失败,当前帖子点赞量过少，请选择一个高浏览量的帖子。");
        }
      }, 2000);
    }, 2000);
  }, 3800);

function executeFirstPart() {
    let input_div;
    input_div= document.querySelector("body > div.container.with-bg > section > section.submit > div > div");
    if (input_div) {
        input_div.click();
        setTimeout(() => {
            let input_text;
            input_text= document.querySelector("body > div.container.with-bg > section > section.submit > div > div.inner > div.input-wrapper > input[type=text]");
             let text = getRandomMessage();
                    msg_text = text;
                    input_text.value = text;
                    input_text.dispatchEvent(new Event('input'));
                    let send_btn = document.querySelector("body > div.container.with-bg > section > section.submit > div > div.inner > div.submit-btn.btn");
                    send_btn.click();
                    setTimeout(() => {
                        verify();
                        startInterval();
                    }, 2000);
        }, 1000);
    }
}

function startInterval() {
    console.log("开始计时")
    COMMENT_COUNTER++;
    if (COMMENT_COUNTER == 30){
                document.getElementById("comment_counter").textContent = "30（已完成）";
        document.getElementById("finish_text").textContent = "恭喜你已完成！本次允许获得60网薪和经验值，配合自动发帖脚本使用能达到160网薪和经验值！";
                return;

            }
    let time = 62;
    // 每62秒执行一次
    let send_cd = setInterval(() => {
        time = time - 1;
        document.getElementById("comment_counter").textContent = COMMENT_COUNTER + "/" + time;
        if (time == 0){
            executeFirstPart();
            clearInterval(send_cd);
        }
    }, 1000);
}




    function Thumbs(){
       let _t = setInterval(() => {
            let dom = document.querySelector(
              "body > div.container.with-bg > section > section.comments.box > div > div:nth-child(" +
                liked_count +
                ") > div > div.status > div.actions > div.like > div"
            );

            if (!dom.firstChild.classList.contains("liked")) {
              dom.click();
              valid_liked_count++;
              liked_count++;
                document.getElementById("thum_counter").textContent = liked_count;

              if (valid_liked_count >= 35) {
                clearInterval(_t);
                  document.getElementById("thum_counter").textContent = liked_count + "（已完成）";
              }
            } else {
              liked_count++;
            }
          }, 4000);
   }



    function simulateComplexClick(element, offsetX, offsetY) {
		let rect = element.getBoundingClientRect();
		let click_x = rect.left + offsetX;
		let click_y = rect.top + offsetY;

		["mousedown", "mouseup", "click", /* "touchstart"*/ ].forEach((eventType) => {
			var clickEvent = new MouseEvent("mousedown", {
				bubbles: true,
				cancelable: true,
				view: unsafeWindow,
				clientX: click_x,
				clientY: click_y,
			});
			element.dispatchEvent(clickEvent);
			let new_msg;
			setTimeout(() => {
                    new_msg = document.querySelector("body > div.container.with-bg > section > section.comments.box > div > div:nth-child(1) > div > div.content");
                    //获取最新一条评论
                    if (msg_text == new_msg.textContent.trim()) {
                        console.log('发送成功');
                    }else{
                        verify();
                    }
			}, 3000);


		});


	}

    window.simulateComplexClick = simulateComplexClick
	let bg_url = ''; // 全局状态变量，存储背景图 URL
	let interval; // 用于保存定时器引用
    function verify() {
		// 清除之前的定时器
		if (interval) {
			clearInterval(interval);
		}

		setTimeout(() => {
			interval = setInterval(() => {
				//let element = document.querySelector('.shumei_captcha_loaded_img_bg');
				let base_dom = document.querySelector("body").lastChild.childNodes[1].childNodes[0];
				let element = base_dom.childNodes[0].childNodes[2].firstChild.firstChild;
				if (element) {
					console.log("333");
					// 检查 src 是否更新
					if (element.src.indexOf('https') !== -1 && bg_url !== element.src) {
						clearInterval(interval); // 清除定时器，防止重复执行
						bg_url = element.src; // 更新 bg_url

						GM_xmlhttpRequest({
							method: 'GET',
							url: sever + '/predict?key=' + savedKey + '&bg_img=' + encodeURIComponent(element.src),
							headers: {
								'Accept': 'application/json'
							},
							onload: function(r) {
								if (r.status === 200) {
									try {
										const j = JSON.parse(r.responseText);
										if (j['reply'] === 'success') {
											simulateComplexClick(base_dom.childNodes[0].childNodes[2].firstChild.firstChild, j['position']['X'] / 2, j['position']['Y'] / 2);
                                            remaining.textContent = j['counter'];
										} else {
											alert('次数不够');
										}
									} catch (e) {
										alert('响应解析失败');
									}
								} else {
									alert('卡密或者服务器错误');
								}
							},
							onerror: function() {
								alert('请求失败');
							}
						});
					}
				}
			}, 100);
		}, 100);
	}













// 随机选择短句或者 3 个随机词语
function getRandomMessage() {
// 词语和短句数组
const words1 = [
    "希望", "憧憬", "友爱", "团结", "合作", "愉快", "勤奋", "刻苦", "认真", "专注", "钻研", "踏实", "勤恳",
    "坦然",  "努力", "爱心", "积极", "友好", "自信", "勇敢",
    "坚定", "整齐",   "动人", "典雅", "豁达",  "和谐", "尊敬"];

const words2 = [
    "整洁",   "称赞", "简洁", "秀丽",   "匀称", "标致", "感激", "魅力", "优秀",  "关切", "坚强", "清净", "壮志", "激励", "勉励",
    "坚持", "奋进", "恒心", "毅力", "勤奋", "刻苦", "追求", "坚强", "自信", "干净", "壮观","玲珑", "健壮", "慈祥", "温柔", "赞许", "欣喜", "安详", "坦然",  "努力", "爱心",
    "甜蜜", "积极", "友好", "自信", "勇敢", "坚定", "整齐", "俏丽", "端庄", "文静", "动人", "典雅", "豁达",
    ];

const phrases = ["不要等待机会，而要创造机会。",
    "成功的秘诀在于对失败的态度。",
    "每天告诉自己一次，我真的很不错。",
    "发光并非太阳的专利，你也可以发光。",
    "理想的路总是为有信心的人预备着。",
    "不要等待机会，而是要创造机会。",
    "业精于勤荒于嬉，行成于思毁于随。",
    "世界会向那些有目标和远见的人让步。",
    "发光并非太阳的专利，你也可以发光。",
    "理想的路总是为有信心的人预备着。",
    "环境不会改变，解决之道在于改变自己。",
    "保持积极的心态，不断激发自己的潜能。",
    "每一发奋努力的背后，必有加倍的赏赐回报。",
    "过去不等于未来，只有努力才能成就更好的未来。",
    "只有不断学习和提升自我，才能跟上时代的步伐。",
    "每天进步一点点，积累小的成功，实现大的目标。",
    "只有勇于尝试新事物，才能拓展自己的视野和能力。",
    "生活中不是缺乏机会，而是缺乏发现机会的眼睛。",
    "要在竞争中取胜，必须不断提高自己的竞争力。",
    "人生没有过不去的坎，只有过不去的心态。",
    "要想获得成功，必须要有明确的目标和计划。",
    "困难像弹簧，你弱它就强；你强它就弱。",
    "只有不断找寻机会的人才会及时把握机会。",
    "拥有梦想只是一种智力，实现梦想才是一种能力。",
    "只要坚持努力，就一定能够实现自己的目标。",
    "每个人都可以成为自己想要的样子，只要他们愿意努力。",
    "成功需要耐心和恒心，而不是一时的冲动。",
    "不要害怕失败，它会让你更加坚强。",
    "只要你相信自己，没有什么是不可能的。",
    "不要被别人的评价所左右，要相信自己内心的声音。",
    "努力不一定会成功，但不努力一定不会成功。",
    "不要害怕冒险，因为冒险是成长的唯一途径。",
    "不要被困难所吓倒，因为困难是磨炼人的最好武器。",
    "与其嫉妒别人的成功，不如用自己的努力去争取。",
    "每一次失败都是一次宝贵的经验，只要我们不放弃。",
    "如果你有鸭梨，把它放冰箱里，它就会变成冻梨。",
    "在这世上珍贵的东西总是罕有，所以这世上只有一个你。",
    "不要被过去的失败困扰，要从失败中吸取经验，继续前行。",
    "每个人都有自己的优点和不足，关键是要发挥自己的长处。",
    "成败不在别人，而在自己。只有不断努力向前，才能实现梦想。",
    "每个人都有属于自己的战斗，挣脱过去，活在当下，还有创造未来。",
    "面对困难，首先要相信自己的能力，然后寻找解决问题的方法。",
    "做自己喜欢的事情是最重要的，因为那样你会更加快乐和自信。",
    "乐观者在一个灾难中看到一个希望，悲观者在一个希望中看到一个灾难。",
    "人生就像一场马拉松比赛，只有坚持到最后，才能看到美丽的风景。",
    "每一天都是一个新的开始，让我们迎接挑战，尽展潜能，追求卓越！",
    "相信自己，你能做到任何事情。只有克服了困难，才能更上一层楼！",
    "保持积极心态，让自己的情绪高涨，用激情和自信去迎接生活的挑战！",
    "每一个成功者都有一个开始。勇于开始，才能找到成功的路。",
    "有一种人只做两件事：你成功了，他妒嫉你；你失败了，他笑话你。",
    "乐观者在一个灾难中看到一个希望，悲观者在一个希望中看到一个灾难。",
    "不要害怕失败，失败是成功的垫脚石。只有敢于尝试，才能收获更多的成功！",
    "不断学习和进步，让自己成为更加有用的人。只有不断超越自己，才能实现梦想。",
    "不要安于现状，要勇往直前。只有敢于追求梦想，才能实现自己的价值！",
    "只要我们坚持努力，成功就会一步步靠近。让我们不断进取，成为更好的自己！",
    "无论才能、知识多么卓著，如果缺乏热情，则无异纸上画饼充饥，无补于事。",
    "过去的事已经一去不复返。聪明的人是考虑现在和未来，根本无暇去想过去的事。",
    "无论遇到什么困难，都要坚信自己可以战胜它。相信自己，就是胜利的第一步！",
    "世上并没有用来鼓励工作努力的赏赐，所有的赏赐都只是被用来奖励工作成果的。",
    "不要因为一次的失误而放弃整个事情，只要你认真总结经验教训，就一定能够成功。",
    "世上并没有用来鼓励工作努力的赏赐，所有的赏赐都只是被用来奖励工作成果的。",
    "努力是人生的一种精神状态，往往最美的不是成功的那一刻，而是那段努力奋斗的过程。",
    "保持积极的生活态度，把每天的事情安排得井井有条。只有做好小事，才能成就大事！",
    "不要让别人的评价左右自己的人生选择。做自己喜欢的事，坚定自己的信念，才能真正成功！",
    "要使自己的生命获得极值，就不能太在乎别人对你的看法，我最合适的老师在一座荒岛上——富兰克林？罗斯福。",
    "伟人之所以伟大，是因为他与别人共处逆境时，别人失去了信心，他却下决心实现自己的目标。",
    "实现自己既定目标的关键是意志。意志坚定的人，能自普通小事中挖掘出无穷无尽的潜能。",
    "今天的努力，是幸运的伏笔，当下的付出，是明日的花开，让我们怀揣希望去努力，静待美好的出现。",
    "岁月流逝，光阴一去不复返，漫漫人生路，多少坎坷起起伏，昨日的忧伤，昨日的哀痛，埋葬在岁月的长河里，除了遗忘还有铭记。",
    "生活中难免会有一些委屈，受委屈时我们的情绪往往会影响到整一天的心情和工作，其实和委屈已经没有多大的关系了，关键是我们要学会释放自己，消化它。",
    "人生就像一盒巧克力，你永远不知道你会吃到什么口味，每天都要吃点苦的东西，以免忘记苦味。",
    "无论遇到多大的困难，只要我们始终坚持并努力奋斗，我们一定能够克服它们，最终实现我们的目标。",
    "勇敢面对困难和挫折，不退缩，不放弃，积极寻求解决问题的方法，一步一个脚印地前进。",
    "成功并不是一蹴而就的，它是需要积累的，只有不断地积累经验、知识和技能，我们才能逐步迈向成功的道路。",
    "不要害怕失败，因为失败是成功的垫脚石。只有经历过失败，我们才能更好地吸取教训，发现自己的不足之处，不断提高自己。",
    "要有远大的目标和梦想，同时要敢于追求梦想、勇于突破自己的限制，不断地挑战自己，超越自己。",
    "不要忘记自己的价值，不要被周围的声音所左右。每个人都有自己的独特之处，只有发掘并发挥自己的优势，才能真正实现自己的价值。",
    "不断地学习和成长是永不停息的过程。只有不断地学习新的知识和技能，我们才能更好地适应不断变化的社会环境，迎接更多的挑战。",
    "保持积极乐观的心态是走向成功的重要因素之一。无论遇到什么困难和挫折，都要积极面对、乐观向上，相信自己一定能够克服它们。",
    "只有付出真诚的努力和奋斗，才能获得真正的成就和收获。不要想着走捷径或者偷懒，只有脚踏实地地前行才能走得更远更高。",
    "坚持正确的原则和价值观是实现自己梦想的基石。不要做违背自己原则的事情，要有正确的道德观念和社会责任感。",
    "任何的收获都不是巧合，而是每天的努力与坚持得来的。不怕你每天迈出一小步，只怕你停滞不前；不怕你每天做一点事，只怕你无所事事。",
    "人生并非都是选择题，而是在做应用题，那要我们一点一滴的去论证，是取舍的过程，做错了也没关系。向前走，不必想太多，也不要害怕，相信梦想并坚持。",
    "路是自己选的，所以即使以后会跌倒，会受伤，也都要学会自己承受，自己疗伤。我们都是这样，学会长大的。",
    "今天的努力，是幸运的伏笔，当下的付出，是明日的花开，让我们怀揣希望去努力，静待美好的出现。",
    "人生有一副最好的补药：早起的第一缕阳光、一个好习惯、一分诚实的劳动以及一份淡泊名利的平常心。",
    "路是自己选的，所以即使以后会跌倒、会受伤，也都要学会自己承受、自己疗伤。我们都是这样，学会长大的。",
    "人生如天气，可预料，但往往出乎意料。在自己的人生舞台上，我们不要做配角，要做自己生活的主角。",
    "过去的是回忆，现在的是拼搏，未来的是梦想。表面的东西不必太过于在意，更不用去为了那些无关紧要的东西而彻夜无眠。",
    "失败并不可怕，可怕的是你从未尝试过。不要害怕失败，勇敢地去尝试、去创新，才能拓展自己的视野和能力。",
    "每个人都是独一无二的，要学会欣赏自己的优点和长处，自信地展现自己的魅力。不要过分比较，相信自己可以创造美好的未来。",
    "生活不会给你一帆风顺的旅程，它会设置各种障碍和挑战来考验你。面对困难时，要坚定信念，相信自己能够克服一切。",
    "没有哪条路是一帆风顺的，但坚持走下去就会看到曙光。只要努力奋斗，付出辛勤的汗水，成功就会向你招手。",
    "不要害怕失败，因为每一次失败都是通向成功必经之路。只有勇敢地面对失败，才能汲取经验，不断成长和进步。",
    "人生就像一场马拉松比赛，要想走得更远、更稳，必须学会坚持。只有持之以恒地努力，才能抵达目标并享受成功的喜悦。",
    "每一个伟大的事物，都是由无数个小事物组成的。所以，试着去做那些小事情，然后你就会发现自己正在伟大。",
    "无论遇到什么困难，都要坚信自己拥有无限的可能。只要不断努力，不放弃追求，就一定能够克服难关，实现自己的目标。",
    "勇敢面对挑战，把每一次困难当作是成长的机会。即使在黑暗中，也要用内心的阳光照亮前行的道路。",
    "不要害怕失败，因为失败并不可怕。可怕的是你从未尝试过就放弃。要学会从失败中汲取经验教训，继续前进，最终走向成功。",
    "拥有积极的心态是非常重要的。无论情况多么糟糕，都要保持乐观和积极，相信自己能够改变现状。",
    "要学会坚持和耐心。成功需要时间和努力，不要期待一蹴而就。只有不断地付出努力，才能收获成功的果实。",
    "不要让他人的评价左右你的行动和决定。你要清楚自己的价值并且坚定地走自己的路。你的成功与快乐不需要建立在别人的认可上。",
    "不管前方有多少荆棘，只要你心中有梦想，脚下有力量，就一定能够闯出一条属于自己的路。所以，不要害怕挑战，勇敢前行吧！"];
    const randomChoice = Math.random(); // 生成一个 0 到 1 之间的随机数

    if (randomChoice < 0.5) {
        // 返回短句
        const randomIndex = Math.floor(Math.random() * phrases.length);
        return phrases[randomIndex];
    } else {
        // 返回 3 个随机词语，词语之间用逗号分隔
        const randomWords = [];
        while (randomWords.length < 3) {
            const wordList = Math.random() < 0.5 ? words1 : words2;
            const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
            if (!randomWords.includes(randomWord)) {
                randomWords.push(randomWord);
            }
        }
        return randomWords.join(", "); // 使用逗号连接词语
    }
}



})();
