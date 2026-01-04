
// ==UserScript==
// @name        智慧树 - 网络请求中有答案时，自动答选择题
// @description 全自动，无界面；应该可以答多选题和对错题；只有在网络请求中有答案时才能自动答题，否则这个脚本什么也不会干
// @namespace   UnKnown
// @author      UnKnown
// @license     AGPL-3.0-or-later
// @version     1.2
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDIxIDEwMjQiPjxwYXRoIGQ9Ik0xNzguNjYyIDc5My4yOTNjMCAxMi41OTUtMjIuODEgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTA4IDAtNTAuOTE4LTEwLjE4OS01MC45MTgtMjIuNzg0IDAtMTIuNTQ0IDIyLjc4NC0yMi43ODQgNTAuOTQ0LTIyLjc4NCAyOC4xMDkgMCA1MC45MTggMTAuMjQgNTAuOTE4IDIyLjc4NHptMTk0LjI1MyAwYzAgMTIuNTk1LTIyLjc4NCAyMi43ODQtNTAuOTQ0IDIyLjc4NC0yOC4xMDkgMC01MC44OTMtMTAuMTg5LTUwLjg5My0yMi43ODQgMC0xMi41NDQgMjIuNzg0LTIyLjc4NCA1MC45MTktMjIuNzg0IDI4LjEwOSAwIDUwLjkxOCAxMC4yNCA1MC45MTggMjIuNzg0em0xOTQuMjc5IDBjMCAxMi41OTUtMjIuODEgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTEgMC01MC45MTktMTAuMTg5LTUwLjkxOS0yMi43ODQgMC0xMi41NDQgMjIuNzg0LTIyLjc4NCA1MC45NDQtMjIuNzg0IDI4LjEwOSAwIDUwLjkxOSAxMC4yNCA1MC45MTkgMjIuNzg0em0xOTQuMjUyIDc3LjU2OGMwIDEyLjU0NC0yMi43ODQgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTA4IDAtNTAuOTE4LTEwLjI0LTUwLjkxOC0yMi43ODQgMC0xMi41OTUgMjIuNzg0LTIyLjc4NCA1MC45NDQtMjIuNzg0IDI4LjEwOSAwIDUwLjkxOCAxMC4xODkgNTAuOTE4IDIyLjc4NHpNOTU1LjcgNzkzLjI5M2MwIDEyLjU5NS0yMi43ODQgMjIuNzg0LTUwLjkxOCAyMi43ODQtMjguMTM1IDAtNTAuOTQ0LTEwLjE4OS01MC45NDQtMjIuNzg0IDAtMTIuNTQ0IDIyLjgxLTIyLjc4NCA1MC45NDQtMjIuNzg0czUwLjk0NCAxMC4yNCA1MC45NDQgMjIuNzg0em0xOTQuMjc5IDBjMCAxMi41OTUtMjIuODEgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTEgMC01MC45MTktMTAuMTg5LTUwLjkxOS0yMi43ODQgMC0xMi41NDQgMjIuNzg0LTIyLjc4NCA1MC45NDQtMjIuNzg0IDI4LjEwOSAwIDUwLjkxOSAxMC4yNCA1MC45MTkgMjIuNzg0em0xOTQuMjUyIDBjMCAxMi41OTUtMjIuNzg0IDIyLjc4NC01MC45NDQgMjIuNzg0LTI4LjEwOCAwLTUwLjg5Mi0xMC4xODktNTAuODkyLTIyLjc4NCAwLTEyLjU0NCAyMi43ODQtMjIuNzg0IDUwLjkxOC0yMi43ODQgMjguMTA5IDAgNTAuOTQ0IDEwLjI0IDUwLjk0NCAyMi43ODR6IiBmaWxsPSIjRTZFOEU3Ii8+PHBhdGggZD0iTTEwNy4yMTMgNzI5LjI5M2E1MC4wNDggNTAuMDQ4IDAgMCAxLTI3LjcyNS00NC43MjN2LTk0LjM2MmMwLTI3LjQxOCAyMi4zMjMtNDkuODY5IDQ5LjU4Ny00OS44NjlzNDkuNTg3IDIyLjQ1MSA0OS41ODcgNDkuODY5djk0LjM2MmMwIDE5LjUzMi0xMS4zNCAzNi41NTYtMjcuNzUgNDQuNzIzYTMwLjY5NCAzMC42OTQgMCAwIDAtMTcuMzU3IDI3LjkwNHYzMi43NDJoLTguOTg1di0zMi43NjhjMC0xMS42MjItNi44MzYtMjIuNzMzLTE3LjM1Ny0yNy44Nzh6bTU4MS45MzkgNzYuNDkzYTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMjExLTQ0Ljk4VjE3Ny44OTRjMC0yNy40NDMgMjIuMjk3LTQ5Ljg5NCA0OS41ODctNDkuODk0IDI3LjI2NCAwIDQ5LjU2MiAyMi40NTEgNDkuNTYyIDQ5Ljg2OVY3NjAuNzhjMCAxOS41NTgtMTEuMzE2IDM2LjYwOC0yNy43MjUgNDQuNzQ5YTMwLjY5NCAzMC42OTQgMCAwIDAtMTcuMzU3IDI3LjkwNHYzMi43NDJoLTguOTg2di0zMi43NjhjMC0xMS40NDMtNi42My0yMi40LTE2Ljg3LTI3LjY0OHoiIGZpbGw9IiM2Q0IxNTQiLz48cGF0aCBkPSJNMzAwLjEzNCA3MjkuMjkzYTUwLjA0OCA1MC4wNDggMCAwIDEtMjcuNzI0LTQ0LjcyM1Y0NTIuNzYyYzAtMjcuNDE4IDIyLjI5Ny00OS44NyA0OS41ODctNDkuODcgMjcuMjY0IDAgNDkuNTYxIDIyLjQ1MiA0OS41NjEgNDkuODdWNjg0LjU3YzAgMTkuNTU4LTExLjMxNSAzNi41NTYtMjcuNzI0IDQ0LjcyM2EzMC42OTQgMzAuNjk0IDAgMCAwLTE3LjM1NyAyNy45MDR2MzIuNzQyaC04Ljk2di0zMi43NjhjMC0xMS42MjItNi44NjEtMjIuNzMzLTE3LjM4My0yNy44Nzh6bTU4My4wNjYuMTI4YTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMDA2LTQ0Ljg1MVYzMTUuMzE1YzAtMjcuNDE3IDIyLjMyMy00OS44NjkgNDkuNTg3LTQ5Ljg2OXM0OS41ODcgMjIuNDUyIDQ5LjU4NyA0OS44N1Y2ODQuNTdjMCAxOS41MzItMTEuMzQgMzYuNTU2LTI3LjcyNSA0NC43MjNhMzAuNjk0IDMwLjY5NCAwIDAgMC0xNy4zODIgMjcuOTA0djMyLjc0MmgtOC45NnYtMzIuNzY4YzAtMTEuNTItNi43MzMtMjIuNTI4LTE3LjEwMS0yNy43NXoiIGZpbGw9IiM0QThCRTkiLz48cGF0aCBkPSJNNDk0Ljc0NiA3MjkuNDcyYTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMDg0LTQ0LjkyOFYzMTUuMzQxYzAtMjcuNDE4IDIyLjMyNC00OS44NjkgNDkuNTg4LTQ5Ljg2OXM0OS41ODcgMjIuNDUxIDQ5LjU4NyA0OS44Njl2MzY5LjI1NGMwIDE5LjUzMy0xMS4zNDEgMzYuNTU3LTI3LjcyNSA0NC43MjNhMzAuNjk0IDMwLjY5NCAwIDAgMC0xNy4zNTcgMjcuOTA0djMyLjc0M2gtOS4wMTF2LTMyLjc2OGMwLTExLjUyLTYuNjU2LTIyLjUyOC0xNi45OTgtMjcuN3ptNTgyLjQ1LS4xOGE1MC4wNDggNTAuMDQ4IDAgMCAxLTI3LjcyNC00NC43MjJWNDUyLjc2MmMwLTI3LjQxOCAyMi4yOTgtNDkuODcgNDkuNTg3LTQ5Ljg3IDI3LjI2NCAwIDQ5LjU2MiAyMi40NTIgNDkuNTYyIDQ5Ljg3VjY4NC41N2MwIDE5LjU1OC0xMS4zNDEgMzYuNTU2LTI3LjcyNSA0NC43MjNhMzAuNjY5IDMwLjY2OSAwIDAgMC0xNy4zNTcgMjcuOTA0djMyLjc0MmgtOS4wMTF2LTMyLjc2OGMwLTExLjYyMi02LjgxLTIyLjczMy0xNy4zMzEtMjcuODc4eiIgZmlsbD0iI0ZFQjgwMSIvPjxwYXRoIGQ9Ik0xMjcxLjgwOCA3MjkuNDcyYTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMDgzLTQ0LjkyOHYtOTQuMzM2YzAtMjcuNDE4IDIyLjI5Ny00OS44NjkgNDkuNTg3LTQ5Ljg2OSAyNy4yNjQgMCA0OS41ODcgMjIuNDUxIDQ5LjU4NyA0OS44Njl2OTQuMzYyYzAgMTkuNTMyLTExLjM0IDM2LjU1Ni0yNy43MjUgNDQuNzIzYTMwLjY5NCAzMC42OTQgMCAwIDAtMTcuMzgyIDI3LjkwNHYzMi43NDJoLTguOTg2di0zMi43NjhjMC0xMS40OTQtNi42NTYtMjIuNDc3LTE2Ljk5OC0yNy42OTl6IiBmaWxsPSIjRDUzRDJBIi8+PC9zdmc+
// @match       https://hiexam.zhihuishu.com/atHomeworkExam/stu/*
// @grant       none
// @inject-into page
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/405537/%E6%99%BA%E6%85%A7%E6%A0%91%20-%20%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E4%B8%AD%E6%9C%89%E7%AD%94%E6%A1%88%E6%97%B6%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%80%89%E6%8B%A9%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/405537/%E6%99%BA%E6%85%A7%E6%A0%91%20-%20%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E4%B8%AD%E6%9C%89%E7%AD%94%E6%A1%88%E6%97%B6%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%80%89%E6%8B%A9%E9%A2%98.meta.js
// ==/UserScript==

"use strict";

const isNonEmptyArray = arr => Array.isArray(arr) && arr.length > 0;
const isAnswerURL = urlStr => new URL(urlStr).pathname.endsWith("/getDoQuestSingle");

const msgPrefix = "[智慧树 - 网络请求中有答案时，自动答选择题]\n";
const consoleConfirm = (type, msg) => {
	console[type](msgPrefix + msg);
	confirm(
		msgPrefix + msg +
		"\n\n按下 F12 打开开发者工具查看和复制日志，\n",
		"点击 “确定” 打开 GreaseFork 进行反馈，\n",
		"点击 “取消” 关闭本提示。"
	);
};

const parseQuestionOption = option => (
	option?.isCorrect === true &&
	typeof option?.id === "number"
	? document.querySelector(`.questionBox .optionUl input[value="${ option.id }"]`).click()
	: false
);

/* 已知的 questionTypeId:
    1: 单选题
    2: 多选题
    3: 填空题
    4: 问答题
    5: 分析题/解答题/计算题/证明题
    9: 阅读理解（选择）/完型填空
   14: 判断题 */

const parseRt = rt => {
	const questionTypeId = rt?.questionTypeId;
	if ([1, 2, 14].some(id => id === questionTypeId)) {
		const questionOptionList = rt?.questionOptionList;
		if (isNonEmptyArray(questionOptionList)) {
			questionOptionList.map(parseQuestionOption).some(result => result !== false) &&
			console.log(msgPrefix + "网络请求中没有答案。");
		}
	} else {
		[3, 4, 5, 9, 14].every(id => id !== questionTypeId) ||
		consoleConfirm("warn", `发现新的题目类型，ID：${questionTypeId} 类型：${rt?.questionName}，请反馈！`);
	}
};

// https://hiexam-server.zhihuishu.com/zhsathome/homeworkUserPaper/getDoQuestSingle?homeworkId=22737&questionId=98337

const onXHRLoad = ({target: xhr}) => {
	if (xhr.status === 200 && isAnswerURL(xhr.responseURL)) {

		let responseJSON;
		try { responseJSON = JSON.parse(xhr.responseText); }
		catch (e) { consoleConfirm("error", "无法解析响应 JSON。错误信息：" + e); }

		const rt = responseJSON?.rt;
		rt && typeof rt === "object"
		? parseRt(rt)
		: consoleConfirm("error", "响应 JSON 中的 rt 属性无效。具体值为：" + JSON.stringify(rt));

	}
};

const xhrProto = unsafeWindow.XMLHttpRequest.prototype;
xhrProto.send = new Proxy(xhrProto.send, {
	apply: (target, thisArg, args) => {
		thisArg.addEventListener("load", onXHRLoad);
		return Reflect.apply(target, thisArg, args);
	}
});
