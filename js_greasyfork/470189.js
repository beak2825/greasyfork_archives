// ==UserScript==
// @name         Learning ZJU Helper
// @namespace    https://github.com/camel-exvl/Learning-ZJU-Helper
// @version      1.3.1
// @description  show score in course
// @author       camel-exvl
// @match        https://courses.zju.edu.cn/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zju.edu.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470189/Learning%20ZJU%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470189/Learning%20ZJU%20Helper.meta.js
// ==/UserScript==

// 监听URL变化
// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
const observeURLChange = (callback) => {
	let oldHref = document.location.href;
	const body = document.querySelector("body");
	const observer = new MutationObserver((mulations) => {
		if (oldHref != document.location.href) {
			oldHref = document.location.href;
			callback();
			observer.disconnect();
		}
	});
	observer.observe(body, { childList: true, subtree: true });
};

// 休眠
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// 等待元素加载完成且满足条件后执行回调函数
function waitElement(selector) {
	console.log(`[Learning ZJU Helper] waiting for element ${selector}`);
	return new Promise((resolve) => {
		const check = () => {
			const element = document.querySelector(selector);
			if (element) {
				console.log(`[Learning ZJU Helper] found element ${selector}`);
				resolve(element);
			} else {
				setTimeout(check, 500);
			}
		};
		check();
	});
}

var user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0";

var header = {
	Accept: "application/json, text/plain, */*",
	"Accept-Encoding": "gzip, deflate, br, zstd",
	"Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en;q=0.3,en-US;q=0.2",
	Connection: "keep-alive",
	Cookie: document.cookie,
	"Sec-Fetch-Dest": "empty",
	"Sec-Fetch-Mode": "cors",
	"Sec-Fetch-Site": "same-origin",
	"User-Agent": user_agent
};

var homeworkStudentStatus;
var enrollments;

// 获取信息
async function getAPI(api) {
	try {
		let res = await fetch(`https://courses.zju.edu.cn/api/${api}`, {
			method: "GET",
			headers: header
		});
		let data = res.json();
		return data;
	} catch (err) {
		console.log(`[Learning ZJU Helper] get ${api} failed: ` + err);
		throw err;
	}
}

async function postAPI(api, body) {
	try {
		let res = await fetch(`https://courses.zju.edu.cn/${api}`, {
			method: "POST",
			headers: {
				...header,
				"Content-Length": body.length,
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest"
			},
			body: body
		});
		if (res.status === 204) {
			return {};
		}
		let data = res.json();
		return data;
	} catch (err) {
		console.log(`[Learning ZJU Helper] post ${api} failed: ` + err);
		throw err;
	}
}

// 获取统计信息
async function getStatistics() {
	let courseID = window.location.href.split("/")[4];
	homeworkStudentStatus = await getAPI(`course/${courseID}/homework-student-status`);
	let enrollmentsJson = (await getAPI(`course/${courseID}/enrollments?fields=user(id,name,user_no)`))["enrollments"];
	enrollments = new Map();
	for (let i = 0; i < enrollmentsJson.length; i++) {
		// delete number in name
		enrollmentsJson[i]["user"]["name"] = enrollmentsJson[i]["user"]["name"].replace(/[0-9]/g, "");
		enrollments.set(enrollmentsJson[i]["user"]["id"], enrollmentsJson[i]["user"]);
	}
}

// 作业页面显示成绩
async function showScoreInHomework() {
	let courseID = window.location.href.split("/")[4];
	let activities = (await getAPI(`courses/${courseID}/activities`))["activities"];
	let activityForUser = (await getAPI(`course/${courseID}/activity-reads-for-user`))["activity_reads"];

	// modify table header
	if (document.getElementsByClassName("large-12 column").length != 0) {
		let tableHeader = document.getElementsByClassName("column-header row collapse")[0];
		let nameElement = tableHeader.getElementsByClassName("large-10 column")[0];
		nameElement.className = "large-8 column";
		let statusElement = tableHeader.getElementsByClassName("large-4 column")[0];
		statusElement.className = "large-2 column";
		let scoreElement = tableHeader.getElementsByClassName("large-12 column")[0];
		scoreElement.className = "large-4 column";
		let formElement = tableHeader.getElementsByClassName("large-6 column")[0];
		formElement.className = "large-4 column";
		let highestScoreElement = document.createElement("div");
		highestScoreElement.className = "large-2 column";
		highestScoreElement.innerHTML = "<span>最高分</span>";
		tableHeader.appendChild(highestScoreElement);
		let averageScoreElement = document.createElement("div");
		averageScoreElement.className = "large-2 column";
		averageScoreElement.innerHTML = "<span>平均分</span>";
		tableHeader.appendChild(averageScoreElement);
		let lowestScoreElement = document.createElement("div");
		lowestScoreElement.className = "large-2 column";
		lowestScoreElement.innerHTML = "<span>最低分</span>";
		tableHeader.appendChild(lowestScoreElement);
		let statisticsElement = document.createElement("div");
		statisticsElement.className = "large-2 column";
		statisticsElement.innerHTML = "<span>提交情况</span>";
		tableHeader.appendChild(statisticsElement);
		let emptyElement = document.createElement("div");
		emptyElement.className = "large-2 column";
		tableHeader.appendChild(emptyElement);
	}

	let homeworkList = document.getElementsByClassName("list-item row collapse ng-scope");
	for (let i = 0; i < homeworkList.length; i++) {
		let scoreElement = homeworkList[i].getElementsByClassName("large-4 column")[1].getElementsByTagName("span")[0];
		let nameElement = homeworkList[i].getElementsByClassName("large-10 column")[0];
		nameElement.className = "large-8 column";
		let name = nameElement.getElementsByTagName("span")[0].innerText;

		// find activityID
		let activityID;
		let averageScore;
		let highestScore;
		let lowestScore;

		for (let j = 0; j < activities.length; j++) {
			if (activities[j]["title"] == name) {
				activityID = activities[j]["id"];
				averageScore = activities[j]["average_score"];
				highestScore = activities[j]["highest_score"];
				lowestScore = activities[j]["lowest_score"];
				break;
			}
		}

		if (scoreElement.getAttribute("ng-if") == "homework.notAnnounced" || scoreElement.getAttribute("ng-if") == "homework.notPublish") {
			// find score
			let score;
			for (let j = 0; j < activityForUser.length; j++) {
				if (activityForUser[j]["activity_id"] == activityID) {
					score = activityForUser[j]["data"]["score"];
					break;
				}
			}

			// show score
			scoreElement.style.color = "#ffc0cb";
			if (score != null) {
				scoreElement.innerText = score;
			} else {
				scoreElement.innerText = "未评分";
			}
		}

		let endElement;
		if (homeworkList[i].getElementsByClassName("large-8 column end").length != 0) {
			endElement = homeworkList[i].getElementsByClassName("large-8 column end")[0];
			endElement.className = "large-6 column end";
			let statusElement = homeworkList[i].getElementsByClassName("large-4 column")[0];
			statusElement.className = "large-2 column";
			let formElement = homeworkList[i].getElementsByClassName("large-6 group-set column")[0];
			formElement.className = "large-4 group-set column";
		} else {
			endElement = homeworkList[i].getElementsByClassName("large-6 column end")[0];
		}

		// show highest score
		if (highestScore) {
			highestScore = highestScore.toFixed(2);
		} else {
			highestScore = "未评分";
		}
		// if (homeworkList[i].getElementsByClassName("large-2 column").length != 4) {
		if (document.getElementById("highestScore" + i) == null) {
			let highestScoreElement = document.createElement("div");
			highestScoreElement.id = "highestScore" + i;
			highestScoreElement.className = "large-2 column";
			highestScoreElement.innerHTML = `<a class="detail" ng-click="openActivity(homework, false)">
            <span style="color:red">${highestScore}</span></a>`;
			endElement.parentNode.insertBefore(highestScoreElement, endElement);
		} else {
			homeworkList[i].getElementsByClassName("large-2 column")[1].innerHTML = `<a class="detail" ng-click="openActivity(homework, false)">
            <span style="color:red">${highestScore}</span></a>`;
		}

		// show average score
		if (averageScore != null) {
			averageScore = averageScore.toFixed(2);
		} else {
			averageScore = "未评分";
		}
		// if (homeworkList[i].getElementsByClassName("large-2 column").length != 4) {
		if (document.getElementById("averageScore" + i) == null) {
			let averageScoreElement = document.createElement("div");
			averageScoreElement.id = "averageScore" + i;
			averageScoreElement.className = "large-2 column";
			averageScoreElement.innerHTML = `<a class="detail" ng-click="openActivity(homework, false)">
            <span style="color:orange">${averageScore}</span></a>`;
			endElement.parentNode.insertBefore(averageScoreElement, endElement);
		} else {
			homeworkList[i].getElementsByClassName("large-2 column")[2].innerHTML = `<a class="detail" ng-click="openActivity(homework, false)">
            <span style="color:orange">${averageScore}</span></a>`;
		}

		// show lowest score
		if (lowestScore != null) {
			lowestScore = lowestScore.toFixed(2);
		} else {
			lowestScore = "未评分";
		}
		// if (homeworkList[i].getElementsByClassName("large-2 column").length != 4) {
		if (document.getElementById("lowestScore" + i) == null) {
			let lowestScoreElement = document.createElement("div");
			lowestScoreElement.id = "lowestScore" + i;
			lowestScoreElement.className = "large-2 column";
			lowestScoreElement.innerHTML = `<a class="detail" ng-click="openActivity(homework, false)">
            <span style="color:green">${lowestScore}</span></a>`;
			endElement.parentNode.insertBefore(lowestScoreElement, endElement);
		} else {
			homeworkList[i].getElementsByClassName("large-2 column")[3].innerHTML = `<a class="detail" ng-click="openActivity(homework, false)">
            <span style="color:green">${lowestScore}</span></a>`;
		}

		// show statistics button
		if (document.getElementById("statistics" + i) == null) {
			let statisticsElement = document.createElement("div");
			statisticsElement.id = "statistics" + i;
			statisticsElement.className = "large-2 column";
			statisticsElement.innerHTML = `<button class="button button-green small gtm-label">
            查看</button>`;
			statisticsElement.children[0].addEventListener("click", function () {
				showStatisticsData(activityID);
			});
			endElement.parentNode.insertBefore(statisticsElement, endElement);
		}

		console.log("[Learning ZJU Helper] show score in homework " + name + " success: score=" + scoreElement.innerText + " highestScore=" + highestScore + " averageScore=" + averageScore + " lowestScore=" + lowestScore);
	}
}

// 显示统计数据
function showStatisticsData(id) {
	// let message = "<table><tr><th>姓名</th><th>学号</th><th>提交情况</th></tr>";
	let data = [];
	let studentNum = 0;
	let submittedNum = 0;
	let markedNum = 0;
	for (let i in homeworkStudentStatus) {
		if (i == id) {
			studentNum = Object.keys(homeworkStudentStatus[i]).length;
			for (let j in homeworkStudentStatus[i]) {
				let student = enrollments.get(parseInt(j));
				let name = "未知",
					user_no = "未知",
					status = "未知";
				if (student != null) {
					name = student["name"];
					user_no = student["user_no"];
				}
				if (homeworkStudentStatus[i][j] != null) {
					switch (homeworkStudentStatus[i][j]) {
						case "un_submitted":
							status = "<span style='color:red'>未提交</span>";
							break;
						case "un_marked":
						case "un_scored":
							status = "<span style='color:orange'>未评分</span>";
							submittedNum++;
							break;
						case "scored":
							status = "<span style='color:green'>已评分</span>";
							submittedNum++;
							markedNum++;
							break;
						default:
							status = homeworkStudentStatus[i][j];
							break;
					}
				}
				data.push({ name: name, user_no: user_no, status: status });
			}
			break;
		}
	}
	let submittedRate = ((submittedNum / studentNum) * 100).toFixed(2);
	let markedRate = ((markedNum / submittedNum) * 100).toFixed(2);
	if (studentNum == 0) {
		submittedRate = 100.0;
	}
	if (submittedNum == 0) {
		markedRate = 100.0;
	}
	layui.use(["layer", "table"], function () {
		var layer = layui.layer;
		var table = layui.table;
		layer.open({
			type: 1, // page 层类型
			area: ["600px", "750px"],
			title: "班级提交情况",
			shade: 0.6, // 遮罩透明度
			shadeClose: true, // 点击遮罩区域，关闭弹层
			maxmin: true, // 允许全屏最小化
			anim: 0, // 0-6 的动画形式，-1 不开启
			content:
				"<br><div align='center'><span style='color:orange'>提交率：" +
				submittedNum +
				"/" +
				studentNum +
				"(" +
				submittedRate +
				"%)&emsp;</span><span style='color:green'>评分率：" +
				markedNum +
				"/" +
				submittedNum +
				"(" +
				markedRate +
				"%)</span></div><table id='statisticsTable'></table>",
			success: function () {
				table.render({
					elem: "#statisticsTable",
					data: data,
					cols: [
						[
							{ field: "name", title: "姓名", sort: true },
							{ field: "user_no", title: "学号", sort: true },
							{
								field: "status",
								title: "提交情况",
								sort: true,
								templet: function (d) {
									return d.status;
								}
							}
						]
					],
					initSort: {
						field: "user_no",
						type: "asc"
					}
				});
			}
		});
	});
}

// 添加排序事件监听器
function addSortEventListeners() {
	let sortButton = document.getElementsByClassName("dropdown-list dropdown-list-sorter")[0];
	let sortBy = sortButton.getElementsByTagName("li");
	for (let i = 0; i < sortBy.length; i++) {
		sortBy[i].addEventListener("click", function () {
			sleep(250).then(() => {
				waitElement(".list-item.row.collapse.ng-scope").then(showScoreInHomework);
			});
		});
	}

	let sortMethodButton = document.getElementsByClassName("dropdown-list sort-by-method")[0];
	let sortMethod = sortMethodButton.getElementsByTagName("li");
	for (let i = 0; i < sortMethod.length; i++) {
		sortMethod[i].addEventListener("click", function () {
			sleep(250).then(() => {
				waitElement(".list-item.row.collapse.ng-scope").then(showScoreInHomework);
			});
		});
	}
}

// 成绩页面显示成绩
async function showScoreInScore() {
	let courseID = window.location.href.split("/")[4];
	let activities = (await getAPI(`courses/${courseID}/activities`))["activities"];
	let activityForUser = (await getAPI(`course/${courseID}/activity-reads-for-user`))["activity_reads"];
	let activityList = document.getElementsByClassName("activity row ng-scope");
	for (let i = 0; i < activityList.length; i++) {
		let originScoreElement = activityList[i].getElementsByClassName("operand large-10 columns zh-CN")[0].getElementsByTagName("span")[0];
		let name = activityList[i].getElementsByClassName("unpublished-title ng-scope")[0].getElementsByTagName("a")[0].innerText;

		// find activityID
		let activityID;
		let averageScore;
		let highestScore;
		let lowestScore;

		for (let j = 0; j < activities.length; j++) {
			if (activities[j]["title"] == name) {
				activityID = activities[j]["id"];
				averageScore = activities[j]["average_score"];
				highestScore = activities[j]["highest_score"];
				lowestScore = activities[j]["lowest_score"];
				break;
			}
		}

		if (originScoreElement.className.includes("no-published")) {
			// find score
			let score;
			for (let j = 0; j < activityForUser.length; j++) {
				if (activityForUser[j]["activity_id"] == activityID) {
					score = activityForUser[j]["data"]["score"];
					break;
				}
			}

			// show score
			originScoreElement.style.color = "#ffc0cb";
			if (score != null) {
				originScoreElement.innerText = score;
			} else {
				originScoreElement.innerText = "未评分";
			}

			let actualScoreElement = originScoreElement.parentElement.parentElement.getElementsByClassName("operand large-10 columns zh-CN")[2].getElementsByTagName("span")[0];
			if (score != null) {
				actualScoreElement.innerText = ((score * parseFloat(originScoreElement.parentElement.parentElement.getElementsByClassName("operand large-10 columns zh-CN")[1].getElementsByTagName("span")[0].innerText)) / 100).toFixed(2);
			} else {
				actualScoreElement.innerText = "未评分";
			}
		}
		console.log("[Learning ZJU Helper] show score in score " + name + " success: score=" + originScoreElement.innerText);
	}
}

function formatUTC(date = new Date()) {
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const d = String(date.getUTCDate()).padStart(2, "0");
	const hh = String(date.getUTCHours()).padStart(2, "0");
	const mm = String(date.getUTCMinutes()).padStart(2, "0");
	const ss = String(date.getUTCSeconds()).padStart(2, "0");

	return `${y}/${m}/${d}T${hh}:${mm}:${ss}`;
}

let video_playing = false;
let video_timestamp = Date.now();

async function playVideo(course_data, user_data, video) {
	// 模拟用户点入视频
	let body = JSON.stringify({
		user_id: String(user_data["id"]),
		org_id: user_data["org"]["id"],
		course_id: course_data["id"],
		visit_duration: Math.floor(Math.random() * 4) + 2, // 随机2~5秒
		is_teacher: false,
		browser: "firefox",
		user_agent: user_agent,
		visit_start_from: formatUTC(new Date(video_timestamp)),
		org_name: user_data["org"]["name"],
		org_code: user_data["org"]["code"],
		user_no: user_data["user_no"],
		user_name: user_data["name"],
		course_code: course_data["course_code"],
		course_name: course_data["name"],
		dep_id: user_data["department"]["id"],
		dep_name: user_data["department"]["name"],
		dep_code: user_data["department"]["code"]
	});
	await postAPI(`statistics/api/user-visits`, body);
	// 模拟视频加载
	video_timestamp += 5000 + Math.floor(Math.random() * 10000); // 模拟加载时间5~15秒

	// 模拟用户点击播放
	body = JSON.stringify({
		user_id: user_data["id"],
		org_id: user_data["org"]["id"],
		course_id: course_data["id"],
		module_id: video["module_id"],
		activity_id: video["id"],
		upload_id: video["uploads"][0]["id"],
		reply_id: null,
		comment_id: null,
		forum_type: "",
		action_type: "view",
		is_teacher: false,
		is_student: true,
		ts: video_timestamp,
		user_agent: user_agent,
		meeting_type: "online_video",
		org_name: user_data["org"]["name"],
		org_code: user_data["org"]["code"],
		user_no: user_data["user_no"],
		user_name: user_data["name"],
		course_code: course_data["course_code"],
		course_name: course_data["name"],
		dep_id: user_data["department"]["id"],
		dep_name: user_data["department"]["name"],
		dep_code: user_data["department"]["code"]
	});
    await postAPI(`statistics/api/online-videos`, body);

	let total_seconds = video["uploads"][0]["videos"][0]["duration"];
	total_seconds = Math.floor(total_seconds);
	// 每60秒提交一次进度，但通过10%概率+-1秒来模拟网络波动
	let time = 0;
	let completeness = "";
	while (time < total_seconds) {
		if (video_playing === false) {
			console.log(`[Learning ZJU Helper] video ${video["id"]} canceled`);
			return false;
		}
		let chunk = Math.min(60, total_seconds - time);
		if (chunk == 60 && Math.random() < 0.1) {
			// 最后一次不扰动
			chunk += Math.random() < 0.5 ? -1 : 1;
		}

		video_timestamp += chunk * 1000; // 模拟播放chunk秒
		// 视频进度
		let body = JSON.stringify({
			start: time,
			end: time + chunk
		});
		let data = await postAPI(`api/course/activities-read/${video["id"]}`, body);
		completeness = data["completeness"];
		// online-videos 数据
		// 这边这个timestamp服务器没有严格验证，可以发未来的时间
		body = JSON.stringify({
			user_id: user_data["id"],
			org_id: user_data["org"]["id"],
			course_id: course_data["id"],
			module_id: video["module_id"],
			activity_id: video["id"],
			upload_id: video["uploads"][0]["id"],
			reply_id: null,
			comment_id: null,
			forum_type: "",
			action_type: "play",
			is_teacher: false,
			is_student: true,
			ts: video_timestamp,
			user_agent: user_agent,
			meeting_type: "online_video",
			start_at: time,
			end_at: time + chunk,
			duration: chunk,
			org_name: user_data["org"]["name"],
			org_code: user_data["org"]["code"],
			user_no: user_data["user_no"],
			user_name: user_data["name"],
			course_code: course_data["course_code"],
			course_name: course_data["name"],
			dep_id: user_data["department"]["id"],
			dep_name: user_data["department"]["name"],
			dep_code: user_data["department"]["code"]
		});
		await postAPI(`statistics/api/online-videos`, body);
		// user-visits 数据
		body = JSON.stringify({
			user_id: String(user_data["id"]),
			org_id: user_data["org"]["id"],
			course_id: course_data["id"],
			activity_id: video["id"],
			visit_duration: chunk,
			is_teacher: false,
			browser: "firefox",
			user_agent: user_agent,
			visit_start_from: formatUTC(new Date(video_timestamp)),
			activity_type: "online_video",
			auto_interval: true,
			org_name: user_data["org"]["name"],
			org_code: user_data["org"]["code"],
			user_no: user_data["user_no"],
			user_name: user_data["name"],
			course_code: course_data["course_code"],
			course_name: course_data["name"],
			dep_id: user_data["department"]["id"],
			dep_name: user_data["department"]["name"],
			dep_code: user_data["department"]["code"]
		});
		await postAPI(`statistics/api/user-visits`, body);
		time += chunk;
		console.log(`[Learning ZJU Helper] played video ${video["id"]} for ${chunk} seconds: ${time}/${total_seconds} seconds`);
		console.log(`[Learning ZJU Helper] post timestamp: ${new Date(video_timestamp).toISOString()}`);
		layui.element.progress("videoProgress", ((time / total_seconds) * 100).toFixed(2) + "%");
		layui.element.render("progress", "videoProgress");
		// 随机等待1~3秒
		await sleep(1000 + Math.random() * 2000); // 这个等待是为了防止请求过于密集，并不影响视频观看时间戳
	}
	if (completeness === "full") {
		console.log(`[Learning ZJU Helper] watched video ${video["id"]} successfully!`);
		return true;
	} else {
		console.log(`[Learning ZJU Helper] ERROR: watching video ${video["id"]} failed, completeness=${completeness}`);
		return false;
	}
}

// 自动观看视频
async function playVideos() {
	document.getElementById("autoWatchBtn").disabled = true;
	let courseID = window.location.href.split("/")[4];
	let course = await getAPI(`courses/${courseID}`);
	let userID = (await getAPI(`air-credit/user`))["user_id"];
	let user = await getAPI(`courses/${courseID}/enrollments/users/${userID}`);
	let activities = (await getAPI(`courses/${courseID}/activities`))["activities"];
	let activityForUser = (await getAPI(`course/${courseID}/activity-reads-for-user`))["activity_reads"];
	let videos = [];
	let complete_videos = new Set();
	let total_videos = 0;
	for (let i = 0; i < activityForUser.length; i++) {
		if (activityForUser[i]["completeness"] == "full") {
			complete_videos.add(activityForUser[i]["activity_id"]);
		}
	}
	for (let i = 0; i < activities.length; i++) {
		if (activities[i]["type"] == "online_video") {
			total_videos += 1;
			if (!complete_videos.has(activities[i]["id"])) {
				videos.push(activities[i]);
			}
		}
	}

    if (videos.length === 0) {
        alert("没有需要观看的视频！");
        document.getElementById("autoWatchBtn").disabled = false;
        return;
    }
	console.log("[Learning ZJU Helper] found video IDs: " + videos.map((v) => v["id"]).join(", "));
	layui.use("layer", function () {
		var layer = layui.layer;
		layer.open({
			type: 1, // page 层类型
			area: ["600px", "300px"],
			title: "自动观看视频",
			shade: 0.6, // 遮罩透明度
			shadeClose: false, // 点击遮罩区域，关闭弹层
			maxmin: true, // 允许全屏最小化
			anim: 0, // 0-6 的动画形式，-1 不开启
			content: `
                <div style="padding: 20px;">
                    <div align='center'>共找到 ${total_videos} 个视频</div>
                    <br>
                    <div align='center'><span id='videoNum'>${videos.length}</span> 个视频尚未完成</div>
                    <br>
                    <div>
                        正在观看 <span id='videoStatus'></span>：
                        <div class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="videoProgress">
                            <div class='layui-progress-bar' lay-percent='0%'></div>
                        </div>
                    </div>
                    <br>
                    <div>
                        总进度：
                        <div class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="totalProgress">
                            <div class='layui-progress-bar' lay-percent='0%'></div>
                        </div>
                    </div>
                </div>`,
			success: async function (layero, index, that) {
				video_playing = true;
				for (let i = 0; i < videos.length; i++) {
                    document.getElementById("videoNum").innerText = `${videos.length - i}`;
					document.getElementById("videoStatus").innerText = `${videos[i]["title"]}`;
					layui.element.progress("videoProgress", "0%");
					layui.element.render("progress", "videoProgress");
					layui.element.progress("totalProgress", ((i / videos.length) * 100).toFixed(2) + "%");
					layui.element.render("progress", "totalProgress");
					const success = await playVideo(course, user, videos[i]);
					if (!success) {
						if (video_playing === false) {
							alert(`观看视频 ${videos[i]["title"]} 已取消`);
							return;
						}
						alert(`观看视频 ${videos[i]["title"]} 失败，请重试`);
						return;
					}
					video_timestamp += 5000 + Math.floor(Math.random() * 10000); // 模拟视频切换时间5~15秒
				}
				alert("所有视频观看完成！");
				video_playing = false;
				layer.close(index);
			},
			end: function () {
				video_playing = false;
				// 刷新页面，以更新学习状态
				window.location.reload();
			}
		});
	});
	document.getElementById("autoWatchBtn").disabled = false;
}

function showPlayButton() {
	if (document.getElementById("autoWatchBtn")) {
		console.log("[Learning ZJU Helper] play button already exists");
		return;
	}
	let navbar = document.getElementsByClassName("filters")[0];
	let playButton = document.createElement("button");
	playButton.innerText = "自动观看视频";
	playButton.className = "layui-btn layui-btn-sm";
	playButton.id = "autoWatchBtn";
	playButton.onclick = playVideos;
	navbar.parentNode.insertBefore(playButton, navbar.nextSibling);
}

(function () {
	"use strict";
	console.log("[Learning ZJU Helper] start");

	let layuiScript = document.createElement("script");
	layuiScript.src = "//unpkg.com/layui@2.13.2/dist/layui.js";
	document.body.appendChild(layuiScript);
	let layuiLink = document.createElement("link");
	layuiLink.rel = "stylesheet";
	layuiLink.href = "//unpkg.com/layui@2.13.2/dist/css/layui.css";
	document.body.appendChild(layuiLink);
	console.log("[Learning ZJU Helper] import layui success");

	let URLChangeCallback = function () {
		let url = new URL(window.location.href);
		let path = url.pathname;

		if (path.includes("homework")) {
			// 作业页面
			sleep(1000).then(() => {
				getStatistics().then(() => {
					waitElement(".list-item.row.collapse.ng-scope").then(addSortEventListeners);
					waitElement(".list-item.row.collapse.ng-scope").then(showScoreInHomework);
				});
			});
		} else if (path.includes("score")) {
			// 成绩页面
			sleep(1000).then(() => {
				waitElement(".activity.row.ng-scope").then(showScoreInScore);
			});
		} else if (path.includes("content")) {
			// 章节页面
			sleep(1000).then(() => {
				waitElement(".filters").then(showPlayButton);
			});
		}
	};
	URLChangeCallback();
	window.onload = observeURLChange(URLChangeCallback);
	window.addEventListener("hashchange", function (event) {
		URLChangeCallback();
	});
})();
