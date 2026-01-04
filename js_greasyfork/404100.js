// ==UserScript==
// @name        智慧树 - 直链下载
// @description 如果发生错误，请禁用脚本，尝试改用 Redirector 实现直链下载。
// @namespace   UnKnown
// @author      UnKnown
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDIxIDEwMjQiPjxwYXRoIGQ9Ik0xNzguNjYyIDc5My4yOTNjMCAxMi41OTUtMjIuODEgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTA4IDAtNTAuOTE4LTEwLjE4OS01MC45MTgtMjIuNzg0IDAtMTIuNTQ0IDIyLjc4NC0yMi43ODQgNTAuOTQ0LTIyLjc4NCAyOC4xMDkgMCA1MC45MTggMTAuMjQgNTAuOTE4IDIyLjc4NHptMTk0LjI1MyAwYzAgMTIuNTk1LTIyLjc4NCAyMi43ODQtNTAuOTQ0IDIyLjc4NC0yOC4xMDkgMC01MC44OTMtMTAuMTg5LTUwLjg5My0yMi43ODQgMC0xMi41NDQgMjIuNzg0LTIyLjc4NCA1MC45MTktMjIuNzg0IDI4LjEwOSAwIDUwLjkxOCAxMC4yNCA1MC45MTggMjIuNzg0em0xOTQuMjc5IDBjMCAxMi41OTUtMjIuODEgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTEgMC01MC45MTktMTAuMTg5LTUwLjkxOS0yMi43ODQgMC0xMi41NDQgMjIuNzg0LTIyLjc4NCA1MC45NDQtMjIuNzg0IDI4LjEwOSAwIDUwLjkxOSAxMC4yNCA1MC45MTkgMjIuNzg0em0xOTQuMjUyIDc3LjU2OGMwIDEyLjU0NC0yMi43ODQgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTA4IDAtNTAuOTE4LTEwLjI0LTUwLjkxOC0yMi43ODQgMC0xMi41OTUgMjIuNzg0LTIyLjc4NCA1MC45NDQtMjIuNzg0IDI4LjEwOSAwIDUwLjkxOCAxMC4xODkgNTAuOTE4IDIyLjc4NHpNOTU1LjcgNzkzLjI5M2MwIDEyLjU5NS0yMi43ODQgMjIuNzg0LTUwLjkxOCAyMi43ODQtMjguMTM1IDAtNTAuOTQ0LTEwLjE4OS01MC45NDQtMjIuNzg0IDAtMTIuNTQ0IDIyLjgxLTIyLjc4NCA1MC45NDQtMjIuNzg0czUwLjk0NCAxMC4yNCA1MC45NDQgMjIuNzg0em0xOTQuMjc5IDBjMCAxMi41OTUtMjIuODEgMjIuNzg0LTUwLjk0NCAyMi43ODQtMjguMTEgMC01MC45MTktMTAuMTg5LTUwLjkxOS0yMi43ODQgMC0xMi41NDQgMjIuNzg0LTIyLjc4NCA1MC45NDQtMjIuNzg0IDI4LjEwOSAwIDUwLjkxOSAxMC4yNCA1MC45MTkgMjIuNzg0em0xOTQuMjUyIDBjMCAxMi41OTUtMjIuNzg0IDIyLjc4NC01MC45NDQgMjIuNzg0LTI4LjEwOCAwLTUwLjg5Mi0xMC4xODktNTAuODkyLTIyLjc4NCAwLTEyLjU0NCAyMi43ODQtMjIuNzg0IDUwLjkxOC0yMi43ODQgMjguMTA5IDAgNTAuOTQ0IDEwLjI0IDUwLjk0NCAyMi43ODR6IiBmaWxsPSIjRTZFOEU3Ii8+PHBhdGggZD0iTTEwNy4yMTMgNzI5LjI5M2E1MC4wNDggNTAuMDQ4IDAgMCAxLTI3LjcyNS00NC43MjN2LTk0LjM2MmMwLTI3LjQxOCAyMi4zMjMtNDkuODY5IDQ5LjU4Ny00OS44NjlzNDkuNTg3IDIyLjQ1MSA0OS41ODcgNDkuODY5djk0LjM2MmMwIDE5LjUzMi0xMS4zNCAzNi41NTYtMjcuNzUgNDQuNzIzYTMwLjY5NCAzMC42OTQgMCAwIDAtMTcuMzU3IDI3LjkwNHYzMi43NDJoLTguOTg1di0zMi43NjhjMC0xMS42MjItNi44MzYtMjIuNzMzLTE3LjM1Ny0yNy44Nzh6bTU4MS45MzkgNzYuNDkzYTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMjExLTQ0Ljk4VjE3Ny44OTRjMC0yNy40NDMgMjIuMjk3LTQ5Ljg5NCA0OS41ODctNDkuODk0IDI3LjI2NCAwIDQ5LjU2MiAyMi40NTEgNDkuNTYyIDQ5Ljg2OVY3NjAuNzhjMCAxOS41NTgtMTEuMzE2IDM2LjYwOC0yNy43MjUgNDQuNzQ5YTMwLjY5NCAzMC42OTQgMCAwIDAtMTcuMzU3IDI3LjkwNHYzMi43NDJoLTguOTg2di0zMi43NjhjMC0xMS40NDMtNi42My0yMi40LTE2Ljg3LTI3LjY0OHoiIGZpbGw9IiM2Q0IxNTQiLz48cGF0aCBkPSJNMzAwLjEzNCA3MjkuMjkzYTUwLjA0OCA1MC4wNDggMCAwIDEtMjcuNzI0LTQ0LjcyM1Y0NTIuNzYyYzAtMjcuNDE4IDIyLjI5Ny00OS44NyA0OS41ODctNDkuODcgMjcuMjY0IDAgNDkuNTYxIDIyLjQ1MiA0OS41NjEgNDkuODdWNjg0LjU3YzAgMTkuNTU4LTExLjMxNSAzNi41NTYtMjcuNzI0IDQ0LjcyM2EzMC42OTQgMzAuNjk0IDAgMCAwLTE3LjM1NyAyNy45MDR2MzIuNzQyaC04Ljk2di0zMi43NjhjMC0xMS42MjItNi44NjEtMjIuNzMzLTE3LjM4My0yNy44Nzh6bTU4My4wNjYuMTI4YTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMDA2LTQ0Ljg1MVYzMTUuMzE1YzAtMjcuNDE3IDIyLjMyMy00OS44NjkgNDkuNTg3LTQ5Ljg2OXM0OS41ODcgMjIuNDUyIDQ5LjU4NyA0OS44N1Y2ODQuNTdjMCAxOS41MzItMTEuMzQgMzYuNTU2LTI3LjcyNSA0NC43MjNhMzAuNjk0IDMwLjY5NCAwIDAgMC0xNy4zODIgMjcuOTA0djMyLjc0MmgtOC45NnYtMzIuNzY4YzAtMTEuNTItNi43MzMtMjIuNTI4LTE3LjEwMS0yNy43NXoiIGZpbGw9IiM0QThCRTkiLz48cGF0aCBkPSJNNDk0Ljc0NiA3MjkuNDcyYTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMDg0LTQ0LjkyOFYzMTUuMzQxYzAtMjcuNDE4IDIyLjMyNC00OS44NjkgNDkuNTg4LTQ5Ljg2OXM0OS41ODcgMjIuNDUxIDQ5LjU4NyA0OS44Njl2MzY5LjI1NGMwIDE5LjUzMy0xMS4zNDEgMzYuNTU3LTI3LjcyNSA0NC43MjNhMzAuNjk0IDMwLjY5NCAwIDAgMC0xNy4zNTcgMjcuOTA0djMyLjc0M2gtOS4wMTF2LTMyLjc2OGMwLTExLjUyLTYuNjU2LTIyLjUyOC0xNi45OTgtMjcuN3ptNTgyLjQ1LS4xOGE1MC4wNDggNTAuMDQ4IDAgMCAxLTI3LjcyNC00NC43MjJWNDUyLjc2MmMwLTI3LjQxOCAyMi4yOTgtNDkuODcgNDkuNTg3LTQ5Ljg3IDI3LjI2NCAwIDQ5LjU2MiAyMi40NTIgNDkuNTYyIDQ5Ljg3VjY4NC41N2MwIDE5LjU1OC0xMS4zNDEgMzYuNTU2LTI3LjcyNSA0NC43MjNhMzAuNjY5IDMwLjY2OSAwIDAgMC0xNy4zNTcgMjcuOTA0djMyLjc0MmgtOS4wMTF2LTMyLjc2OGMwLTExLjYyMi02LjgxLTIyLjczMy0xNy4zMzEtMjcuODc4eiIgZmlsbD0iI0ZFQjgwMSIvPjxwYXRoIGQ9Ik0xMjcxLjgwOCA3MjkuNDcyYTUwLjA0OCA1MC4wNDggMCAwIDEtMjguMDgzLTQ0LjkyOHYtOTQuMzM2YzAtMjcuNDE4IDIyLjI5Ny00OS44NjkgNDkuNTg3LTQ5Ljg2OSAyNy4yNjQgMCA0OS41ODcgMjIuNDUxIDQ5LjU4NyA0OS44Njl2OTQuMzYyYzAgMTkuNTMyLTExLjM0IDM2LjU1Ni0yNy43MjUgNDQuNzIzYTMwLjY5NCAzMC42OTQgMCAwIDAtMTcuMzgyIDI3LjkwNHYzMi43NDJoLTguOTg2di0zMi43NjhjMC0xMS40OTQtNi42NTYtMjIuNDc3LTE2Ljk5OC0yNy42OTl6IiBmaWxsPSIjRDUzRDJBIi8+PC9zdmc+
// @version     1.0
// @match       https://hike.zhihuishu.com/aidedteaching/sourceLearning/sourceLearning
// @grant       GM_download
// @inject-into page
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/404100/%E6%99%BA%E6%85%A7%E6%A0%91%20-%20%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/404100/%E6%99%BA%E6%85%A7%E6%A0%91%20-%20%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
等效的 Redirector 规则，保存成文本导入即可：
{
	"redirects": [{
		"description": "智慧树文件下载",
		"exampleUrl": "https://hike.zhihuishu.com/aidedteaching/file/downloadFile?name=filename.pdf&fileUrl=https://file.zhihuishu.com/zhs/filename.pdf",
		"exampleResult": "https://file.zhihuishu.com/zhs/filename.pdf",
		"error": null,
		"includePattern": "https://hike.zhihuishu.com/aidedteaching/file/downloadFile?name=*&fileUrl=*",
		"excludePattern": "",
		"patternDesc": "",
		"redirectUrl": "$2",
		"patternType": "W",
		"processMatches": "noProcessing",
		"disabled": false,
		"grouped": false,
		"appliesTo": [
			 "main_frame"
		]
	}]
}
*/

"use strict";

unsafeWindow.fileStuOperationStatistics =
unsafeWindow.MonitorUtil.videoLogBase =
unsafeWindow.MonitorUtil.saveAction =
unsafeWindow.MonitorUtil.errorLog = () => {};

unsafeWindow.downloadFile = () => {

	const error = error => {
		console.error(error);
		alert(error);
	};

	// 返回 value 的值或者 false
	const getValueById = id =>
		document.getElementById(id) &&
		document.getElementById(id).value;

	const idArray = [ "dataId", "fileType", "fileId" ];
	const dataArray = idArray.map(getValueById);
	const fileName = getValueById("fileName");

	dataArray.every( value => !!value ) ? fetch(
		( unsafeWindow.ctx || "/aidedteaching" ) +
		"/common/downloadMaterialStudent", {
			"method": "POST",
			"mode": "same-origin",
			"credentials": "include",
			"x-requested-with": "XMLHttpRequest",
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			"body": "data=" + encodeURIComponent( dataArray.join(",") )
		}
	).then(
		response => response.text()
	).then(
		fileLink => {
			console.log(fileLink);
			location.assign(fileLink);
			// GM_download( fileLink, fileName || "" );
		}
	).catch(error) : error( [[ "dataId", "fileType", "fileId" ]] );

};
