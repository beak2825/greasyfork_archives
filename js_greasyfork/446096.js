// ==UserScript==
// @name         我啥也不想背
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  低调使用
// @author       dadada
// @match        *://saishi.cnki.net/exam/ExamRd/Answer/*
// @match        *://saishi.cnki.net/m/exam/ExamRd/Answer/*
// @match        *://saishi.cnki.net/exam/ExamRd/Start/*
// @match        *://saishi.cnki.net/exam/PapersRd/Analysis/*
// @grant        nones
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/446096/%E6%88%91%E5%95%A5%E4%B9%9F%E4%B8%8D%E6%83%B3%E8%83%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/446096/%E6%88%91%E5%95%A5%E4%B9%9F%E4%B8%8D%E6%83%B3%E8%83%8C.meta.js
// ==/UserScript==

var server = "https://ssx.37it.cn"
const tagId = "syhu-dialog"
username = ''

var examId = window.location.href.split('/')[6]
const phone = window.location.href.split('/')[3] === 'm'
if (phone)
	examId = window.location.href.split('/')[7]

function display(tagId, content, reWrite = true) {
	var where = document.getElementById(tagId)
	if (where == null) {
		console.error("对话框未找到")
		return
	}
	array = content.split('&&')
	s = ''
	array.forEach(function (item) {
		s += item + '<br>'
	})
	if (reWrite) {
		where.innerHTML = ""
		where.innerHTML += "<br>"
		where.innerHTML += s
	} else {
		where.innerHTML += "<br>"
		where.innerHTML += s
	}
}

function updateUserInfo() {
	t = document.cookie.match(/qdu_soft_user=(.*?); .*/)
	display(tagId, "暗号: <input type='text' id='qdu_soft_user'/><button id='qdu_soft_user_button'>确定</button>", false)
	if (t === null || t.length < 2);
	else document.getElementById('qdu_soft_user').value = t[1]
	document.getElementById('qdu_soft_user_button').addEventListener('click', function () {
		document.cookie = 'qdu_soft_user=' + document.getElementById('qdu_soft_user').value + '; path=/'
		username = document.getElementById('qdu_soft_user').value.trim()
		search()
	})
}

function init(tagId) {
	var addTag = document.createElement("div")
	addTag.id = tagId
	addTag.className = "g-mn"

	var parentTag = document.querySelector(".g-mn")
	if (parentTag == null || parentTag.length < 2) {
		parentTag = document.querySelector(".g-box")
		addTag.className = "g-container"
	}

	if (parentTag == null) {
		// 解析窗口
		parentTag = document.querySelector(".jiexi-top-container")
	}

	if (phone) {
		parentTag = document.querySelector('body')
	}

	parentTag.appendChild(addTag)

	addTag.style.fontSize = "20px"
	addTag.style.padding = "5px"
	addTag.style.width = "94%"
	addTag.style.lineHeight = "35px"

	// 处理cookie, 装载 username
	t = (document.cookie + ';').match(/qdu_soft_user=(.*?);.*/)
	console.log(t);
	if (t === null || t.length < 2) {
		display(tagId, "请输入神秘暗号")
		updateUserInfo()
	} else {
		username = t[1].trim()
	}

	// 测试连接
	$.ajax({
		url: server + '/dt/check.php',
		type: 'GET',
		data: {
			username: username
		},
		success(res) {
			console.log(res)
			display(tagId, res.content, false)
			if (res.status !== 0) updateUserInfo()
		},
		error() {
			console.log("error")
			display(tagId, "连接服务器失败", false)
		}
	})

	addTag.innerHTML += username + " 用户, 您好"
}

function search() {
	var result = "未找到"
	questionClazz = phone?'.topic':'.tigan'
	question = document.querySelector(questionClazz).innerHTML.trim().replace(/&nbsp;/ig, ' ');
	if(username === '') return "请在下方输入神秘暗号"
	var jsoncx={ "title": question,
				     "username": username
        };
	$.ajax({
		url: server + '/dt/index.php',
		type: 'POST',
		async: false,
		dataType: 'JSON',
		data:JSON.stringify(jsoncx),
		success(data) {
			result = data.content;
		},
		error(e) {
			console.log("error: ", e);
		}
	})
	console.log(question);
	return result
}

function sleep(delay) {
	for (var t = Date.now(); Date.now() - t <= delay;);
}

function parseQuestion(questionSize) {
	var jiexiTags = document.querySelectorAll('.jiexi-question-block')
	if (jiexiTags.length < questionSize) {
		console.error("[error] quesionSize");
		return;
	}

	for (let i = 0; i < questionSize; i++) {
		const jiexiTag = jiexiTags[i];
		//jiexiTags[0].querySelector('.tigan').innerHTML.split('\n')[2].trim()
		var title = jiexiTag.querySelector('.tigan').innerHTML.split('\n')[2].trim().replace(/&nbsp;/ig, ' ')

		var listTags = jiexiTag.querySelectorAll('.img-list .clearfix')

		//jiexiTags[0].querySelector('.answer-line').querySelectorAll('.right-color')
		answerBlockTag = jiexiTag.querySelector('.answer-block') // 可能包含错误答案、解析
		var answerTag = answerBlockTag.querySelectorAll('.right-color')
		var answer = [];
		for (j = 0; j < answerTag.length; j++) {
			answer[j] = answerTag[j].innerHTML.trim().replace(/&nbsp;/ig, ' ').replaceAll(/<[^>]+>/g, "")
		}

		if (listTags.length > 0) { // 如果是选择题
			answer = answer[0].split('')
			t = answer
			c = 65
			answerIndex = 0
			for (tag of listTags) {
				if (t.includes(String.fromCharCode(c++))) {
					answer[answerIndex++] = tag.querySelector('.text-block').innerHTML.replace(/&nbsp;/ig, ' ').replaceAll(/<[^>]+>/g, "")
				}
			}
		}
		// console.log(title);
		// console.log(answer);

		answerStr = ''
		answer.forEach(function (item) {
			answerStr += item + '&&'
		})
		answerStr = answerStr.substr(0, answerStr.length - 2);
		console.log(answerStr);
        var jsondd={ "title": title,
				     "answer": answerStr,
				     "username": username
        };
		$.ajax({
			url: server + '/dt/index.php',
			async: false,
			dataType: 'JSON',
			type: 'POST',
			data:JSON.stringify(jsondd),
			success(res) {
				console.log(res.content);
				display(tagId, `正在提交第${i + 1}个: `, false)
			},
			error() {
				display(tagId, `[error] 提交第${i + 1}个时网络异常: `, false)
			}
		})

		if (i % 10 == 0)
			display(tagId, '', true)
	}
}

function autoFill(answer) {
	// 填空
	input = document.querySelector('.tiankong')
	if (input !== null) {
		input.value = answer.split(' 或 ')[0]
	}
}

(function () {

	var questionTitle = []
	var lastPageNum = -1

	if (false === init(tagId))
		return

	if (document.querySelectorAll(".jiexi-question-container").length > 0) { // 解析，上传题目
		parseQuestion(50)
	} else {

		$.ajax({
			url: '/api/ExamineRd/GetExamineePaperForTest',
			dataType: 'JSON',
			async: false,
			data: {
				examineepaperguid: examId,
				_: new Date().getTime()
			},
			success(data) {
				try {
					data = data.data.Questions;
					for (var i = 0; i < data.length; i++) {
						questionTitle[i] = data[i]["Question"].trim().replace(/&nbsp;/ig, ' ');
					}
				} catch (error) {
					display(tagId, "考试未开始")
				}
			},
			error(e) {
				console.log("脚本问题: 获取试题出错")
			}
		})

		if (!phone) {
			var nextBtn = document.querySelector(".g-next")
			var numTag = document.getElementsByClassName('num')
			if (nextBtn != null && nextBtn.childNodes != null && nextBtn.childNodes.length > 2) {
				nextBtn.children[0].addEventListener('click', function () {
					var currentPageNum = parseInt(numTag[0].innerHTML)
					lastPageNum = currentPageNum
					answer = search(questionTitle[currentPageNum - 1])

					autoFill(answer)
					display(tagId, currentPageNum + '<br>' + answer)

					if (username === null || username.length===0) {
						updateUserInfo()
					}
				})
				nextBtn.children[1].addEventListener('click', function () {
					var currentPageNum = parseInt(numTag[0].innerHTML)
					lastPageNum = currentPageNum
					answer = search(questionTitle[currentPageNum - 1])

					autoFill(answer)
					display(tagId, currentPageNum + '<br>' + answer)

					if (username === null || username.length===0) {
						updateUserInfo()
					}
				})
			} else {
				console.log("翻页按钮未找到");
			}
		}else {
			numTag = document.getElementById('q_number').querySelectorAll('span')
		}

		setInterval(function () {
			if (numTag.length === 0 || numTag[0] === null) return
			var currentPageNum = parseInt(numTag[0].innerHTML)
			if (currentPageNum != lastPageNum) {
				lastPageNum = currentPageNum
				answer = search(questionTitle[currentPageNum - 1])

				autoFill(answer)
				display(tagId, currentPageNum + ':<br>' + answer, true)

				if (username === null || username.length===0) {
					updateUserInfo()
				}
			}
			console.log(currentPageNum);
		}, 800)
	}
})()