// ==UserScript==
// @name         tmm广开自动
// @namespace    http://tampermonkey.net/
// @version      0.1.19
// @description  广开自动!
// @author       loneyclown
// @match        https://juejin.cn/post/7022654292880424991
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ougd.cn
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @require			 https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @include      https://course.ougd.cn/*
// @include      https://authserver.ougd.cn/*
// @license			 none
// @downloadURL https://update.greasyfork.org/scripts/455149/tmm%E5%B9%BF%E5%BC%80%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455149/tmm%E5%B9%BF%E5%BC%80%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==
(function () {
	"use strict";

	createTool();
	mainOnLoad();
	loginOnLoad();
	reload();

	/**
	 * 获取url参数
	 */
	function getQueryString(name) {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		let r = unsafeWindow.location.search.substr(1).match(reg);
		if (r != null) {
			return decodeURIComponent(r[2]);
		}
		return null;
	}

	/**
	 * 模拟鼠标点击
	 */
	function simulateClick(dom) {
		const event = new unsafeWindow.MouseEvent("click", {
			view: unsafeWindow,
			bubbles: true,
			cancelable: true,
		});
		dom.dispatchEvent(event);
	}

	/**
	 * 模拟鼠标操作
	 */
	function simulateEvent(dom, action) {
		const event = new unsafeWindow.MouseEvent(action, {
			view: unsafeWindow,
			bubbles: true,
			cancelable: true,
		});
		dom.dispatchEvent(event);
	}

	function download(downfile) {
		const tmpLink = document.createElement("a");
		const objectUrl = URL.createObjectURL(downfile);

		tmpLink.href = objectUrl;
		tmpLink.download = downfile.name;
		document.body.appendChild(tmpLink);
		tmpLink.click();

		document.body.removeChild(tmpLink);
		URL.revokeObjectURL(objectUrl);
	}

	/**
	 * file或blob转base64
	 * @param {*} blob file或者blob
	 * @param {*} callback function (data)通过参数获得base64
	 */
	function blobToBase64(blob, callback) {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			callback(reader.result);
		});
		reader.readAsDataURL(blob);
	}

	/**
	 * base64转file
	 * base64格式：data:image/png;base64,iVBORw0KGgoAAAANSU...
	 * @param {*} dataURL base64编码数据
	 * @param {*} filename 文件名称
	 */
	function dataURLToFile(dataURL, filename) {
		const arr = dataURL.split(","),
			mime = arr[0].match(/:(.*?);/)[1], //mime类型 image/png
			bstr = atob(arr[1]); //base64 解码

		let n = bstr.length,
			u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
		//return new Blob([a8arr], {type: mime});
	}

	/**
	 * 得到一个两数之间的随机整数，包括两个数在内
	 * @param min
	 * @param max
	 */
	const getRandomIntInclusive = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
	};

	/**
	 * 获取随机uuid
	 */
	function getUuid() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c) {
				var r = (Math.random() * 16) | 0,
					v = c == "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			}
		);
	}

	/**
	 * 网络请求 * 获取docx
	 */
	async function getDocx(name, id, uuid) {
		return new Promise(function (resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: `http://124.222.36.151:3000/ai/article/genDocx?name=${name}&id=${id}&zipUuid=${uuid}`,
				responseType: "blob",
				onload: function (res) {
					if (res.status == 200) {
						console.log(res);
						// blob转file;
						const file = new File([res.response], name + id + ".docx", {
							type: "application/docx",
						});
						resolve(file);
					}
				},
				onerror: function (error) {
					console.error("网络请求 * 获取docx", error);
					reject(error);
				},
			});
		});
	}

	/**
	 * 上传word
	 */
	async function uploadDocx(file) {
		console.log("调试输出生成文件 >>> ", file);
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		// 文件赋值
		$(".p-x-1 input")[0].files = dataTransfer.files;
		// 点击上传
		return new Promise((resolve, rejcet) => {
			setTimeout(() => {
				$(".fp-upload-btn").click();
				resolve();
			}, [3000]);
		});
	}

	/**
	 * 登录
	 */
	function login(username, password) {
		$("#username").val(username);
		$("#password").val(password);
		$(".auth_login_btn").click();
	}

	/**
	 * 开始
	 */
	async function start(name, num) {
		const $tips = $("#gm_tips");
		const type = GM_getValue("gm_type");
		if (type === 3) {
			// 自定义文本
			// const prefabText = GM_getValue("gm_prefabText");
			// console.log("prefabText", prefabText);
			// printLog(
			// 	$tips,
			// 	`当前登录: ${name}, 正在写入文本...`,
			// 	`当前登录: <span class="tmm-tools-usertext">${name}</span>, <br />正在写入文本...`
			// );
			// const texts = prefabText.split("=========");
			// const random = getRandomIntInclusive(0, texts.length - 1);
			// console.log(random, texts);
			// const text = texts[random];
			// console.log(text);
			// // $("#id_onlinetext_editor").show();
			// setTimeout(() => {
			// 	// console.log($("#id_onlinetext_editor_ifr")).contents();
			// 	// simulateEvent(
			// 	// 	$("#id_onlinetext_editor_ifr").contents().find("#tinymce")[0],
			// 	// 	"foucs"
			// 	// );
			// 	// $("#id_onlinetext_editor_ifr").focus();
			// 	// $("#id_onlinetext_editor").val(`<p>${text}</p>`);
			// 	// const editor = new EditorJS({
			// 	// 	/**
			// 	// 	 * Id of Element that should contain Editor instance
			// 	// 	 */
			// 	// 	holder: 'id_onlinetext_editor'
			// 	// });
			// 	// console.log(first)
			// 	// console.log(unsafeWindow.parent.tinyMCE.get("id_onlinetext_editor"));
			// 	// unsafeWindow.parent.tinyMCE
			// 	// 	.get("id_onlinetext_editor")
			// 	// 	.init({ data: text });
			// }, [1500]);
			return;
		}
		simulateClick($(".fp-toolbar .fp-btn-add .btn")[0]);
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				simulateClick($(".file-picker .nav-link")[1]);
				resolve();
			}, 1500);
		});
		await new Promise((resolve, reject) => {
			setTimeout(async () => {
				printLog(
					$tips,
					`当前登录: ${name}, 正在执行上传...`,
					`当前登录: <span class="tmm-tools-usertext">${name}</span>, <br />正在执行上传...`
				);
				if (type === 1) {
					// 形考
					try {
						const uuid = GM_getValue("gm_uuid");
						const file = await getDocx(name, num, uuid);
						await uploadDocx(file);
						resolve();
					} catch (error) {
						console.log("调试输出 >>>  形考文件请求", error);
						reject();
					}
				} else {
					// 大作业
					const fileBase = GM_getValue("gm_dzy_file_base");
					const fileExtension = GM_getValue("gm_dzy_file_extension");
					const file = dataURLToFile(
						fileBase,
						`${name}${num}.${fileExtension}`
					);
					await uploadDocx(file);
					resolve();
				}
			}, 3000);
		});
		await new Promise((resolve, reject) => {
			setTimeout(async () => {
				console.log(`当前登录: ${name}, 上传成功!`);
				$tips.html(`当前登录: ${name}, <br />上传成功!`);
				$("#id_submitbutton").click();
				resolve();
			}, 3000);
		});
	}

	function gemExcl(file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, { type: "array" });
			const obj = {};
			_.forEach(workbook.Sheets, (sheet) => {
				let currRow;
				_.forEach(sheet, (cell, key) => {
					if (!_.includes(key, "!")) {
						const x = key.replace(/[A-Z]/g, "");
						const y = key.replace(/[0-9]/g, "");
						if (currRow != x) {
							currRow = x;
						}
						if (!obj[currRow]) obj[currRow] = {};
						obj[currRow][y] = cell.v;
					}
				});
			});
			const list = [];
			_.forEach(obj, (value, index) => {
				if (index != 1) {
					list.push({
						name: value.A || "",
						num: value.B,
						pass: value.C,
						kmName: value.D || "",
						kmId: value.E,
					});
				}
			});
			GM_setValue("gm_list", list);
			GM_setValue("gm_list_cur_index", 0);
			GM_setValue("gm_omit_list", []);
			setTimeout(() => {
				unsafeWindow.location.href = "https://course.ougd.cn/my/";
			}, [3000]);
		};
		reader.readAsArrayBuffer(file);
	}

	/**
	 * 输出日志
	 */
	function printLog($tips, text, html) {
		text && console.log(text);
		html && $tips.html(html);
	}

	/** 超时自动刷新 */
	function reload() {
		setTimeout(() => {
			unsafeWindow.location.reload();
		}, [3 * 60 * 1000]);
	}

	/**
	 * 压缩css
	 */
	function yasuoCss(s) {
		//压缩代码
		s = s.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
		s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
		s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
		s = s.replace(/;\s*;/g, ";"); //清除连续分号
		s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
		return s == null ? "" : s[1];
	}

	/**
	 * 创建工具箱
	 */
	function createTool() {
		/** 样式文本 */
		const style = `
			.tmm-tools-exp-btn {
				position: fixed; bottom: 50%; left: 10px;
				box-sizing: border-box;
			}
			.tmm-tools, .tmm-tools * {
				box-sizing: border-box;
			}
			.tmm-tools {
				z-index: 9999999;
				position: fixed;
				bottom: 0;
				left: 0;
				padding: 5px;
				width: 300px;
				height: 100vh;
				border: 1px solid #4096ff;
				background-color: #91caff;
				opacity: .9;
			}
			.tmm-tools p {
				margin: 0;
			}
			.tmm-tools h2 {
				margin: 10px 0; font-size: 16px; text-align: center;
			}
			.tmm-tools > p {
				text-align: center;
				font-size: 14px;
			}
			.tmm-tools button, .tmm-tools-exp-btn {
				margin: 2px;
				border-radius: 4px;
				background-image: none;
				border: 1px solid transparent;
				padding: 4px 6px;
				color: #333;
				background-color: #fff;
				border-color: #ccc;
				cursor: pointer;
			}
			.tmm-tools-close-btn {
				position: absolute;
				right: 0;
			}
			.tmm-tools-usertext {
				color: #fa8c16; font-weight: bold;
			}
			.tmm-tools-tips {
				color: #434343;
				margin-bottom: 10px; height: 220px; overflow: auto;
			}
			.tmm-tools-prefabtext {
				width: 100%;
				height: 300px;
			}
			.tmm-tools-prefabtext textarea {
				width: 100%;
				height: calc(100% - 40px);
			}
			.tmm-area {
				margin-top: 10px;
				font-size: 14px;
			}
		`;

		// 插入style
		$("head").append(`<style>${yasuoCss(style)}</style>`);

		// ============================================================ //

		const typeMap = {
			1: "形考",
			2: "大作业",
			3: "文本",
		};
		const currNum = !!GM_getValue("gm_list_cur_index")
			? GM_getValue("gm_list_cur_index") + 1
			: -1;
		const total = _.isEmpty(GM_getValue("gm_list"))
			? -1
			: GM_getValue("gm_list").length;
		const $typeP = $(
			`<p>当前执行：${
				typeMap[GM_getValue("gm_type") || ""]
			}, 当前在第 ${currNum}/${total} 位</p>`
		);
		/** 展开工具箱按钮 */
		const $btn = $('<button class="tmm-tools-exp-btn">工具</button>');
		/** 工具箱dom */
		const $dom = $(`
			<div class="tmm-tools">
				<h2>工具箱</h2>
			</div>
		`);
		if (currNum > 0 && total > 0) {
			$dom.append($typeP);
		}

		/** 关闭工具箱按钮 */
		const $clsoseBtn = $('<button class="tmm-tools-close-btn">关闭</button>');
		/** 选择execl区域 */
		const $execlArea = $(`<div class='tmm-area'>
			<p>选择execl(形考、大作业通用)</p>
			<input id='gm_execl_file' type="file" />
		</div>`);
		/** 形考区域 */
		const $xkArea = $(`<div class='tmm-area'>
			<p>形势与政策请点击下方按钮</p>
			<button style="margin-bottom: 5px;">开始形考</button>
			<button style="margin-bottom: 5px;" data-gm-type="zip">开始形考(zip)</button>
			<button style="margin-bottom: 5px;" data-gm-type="download">下载zip</button>
		</div>`);
		/** 大作业区域 */
		const $dzyArea = $(`<div class='tmm-area'>
			<input type="file" id="gm_dzy_file" />
			<p>其他大作业请选择需要上传大作业文件后点击下方按钮</p>
			<button style="margin-bottom: 5px;">开始其他</button>
		</div>`);
		/** 提示信息区域 */
		const $tips = $(
			'<div id="gm_tips" class="tmm-tools-tips">暂无提示文本</div>'
		);
		/** 清空列表按钮 */
		const $clearBtn = $(
			'<button style="margin-bottom: 5px;">清空当前执行列表</button>'
		);
		/** 导出忽略列表按钮 */
		const $exportBtn = $(
			'<button style="margin-bottom: 5px;">导出忽略列表</button>'
		);
		/** 预制作业文本 */
		const $prefabText = $(
			`<div class="tmm-tools-prefabtext">
				<textarea id="gm_prefabText"></textarea>
				<div>
					<button>开始自定义文本</button>
				</div>
			</div>`
		);

		// ============================================================ //

		$btn.on("click", function () {
			$btn.hide();
			$dom.show();
		});
		$clsoseBtn.on("click", function () {
			$btn.show();
			$dom.hide();
		});
		$xkArea.find("button").on("click", (e) => {
			const gmType = e.target.dataset.gmType;
			if (gmType === "download") {
				const uuid = GM_getValue("gm_uuid");
				console.log(uuid);
				GM_xmlhttpRequest({
					method: "GET",
					url: `http://124.222.36.151:3000/ai/article/getZipDocs?zipUuid=${uuid}`,
					responseType: "blob",
					onload: function (res) {
						if (res.status == 200) {
							console.log(res);
							// blob转file;
							const file = new File([res.response], `${uuid}.zip`, {
								type: "application/zip",
							});
							download(file);
						}
					},
					onerror: function (error) {
						console.error("网络请求 * 下载zip", error);
					},
				});
				return;
			}
			if (gmType === "zip") {
				GM_setValue("gm_uuid", getUuid());
			}
			GM_setValue("gm_type", 1);
			const file = $execlArea.find("#gm_execl_file")[0].files[0];
			if (!file) {
				alert("没有选择execl文件!");
				return;
			}
			gemExcl(file);
		});
		$dzyArea.find("button").on("click", (e) => {
			const file = $execlArea.find("#gm_execl_file")[0].files[0];
			if (!file) {
				alert("没有选择execl文件!");
				return;
			}
			const file2 = $dzyArea.find("#gm_dzy_file")[0].files[0];
			blobToBase64(file2, (res) => {
				GM_setValue("gm_dzy_file_base", res);
				const fileExtension = file2.name.substring(
					file2.name.lastIndexOf(".") + 1
				);
				GM_setValue("gm_dzy_file_extension", fileExtension);
			});
			GM_setValue("gm_type", 2);
			gemExcl(file);
		});
		$clearBtn.on("click", function () {
			GM_setValue("gm_list", undefined);
			GM_setValue("gm_list_cur_index", undefined);
		});
		$exportBtn.on("click", function () {
			const gmOmitList = GM_getValue("gm_omit_list");
			const worksheet = XLSX.utils.json_to_sheet(gmOmitList);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
			XLSX.writeFile(workbook, "本次忽略名单.xlsx", { compression: true });
			GM_setValue("gm_omit_list", []);
		});

		$prefabText.find("button").on("click", function () {
			// const file = $file[0].files[0];
			// let text = $("#gm_prefabText")[0].value;
			// text = text.replace(/\n/g, "");
			// GM_setValue("gm_prefabText", text);
			// GM_setValue("gm_type", 3);
			// console.log(text);
			// console.log(file);
			// gemExcl(file);
		});

		// ============================================================ //

		// 添加dom
		$dom.prepend($clsoseBtn);
		$dom.append($execlArea);
		$dom.append($xkArea);
		$dom.append($dzyArea);
		$dom.append($tips);
		$dom.append($clearBtn);
		$dom.append($exportBtn);
		// $dom.append($prefabText);
		$("body").append($btn);
		$("body").append($dom);
		$btn.hide();

		// 给预制文本框赋值初始值
		// setTimeout(() => {
		// 	$("#gm_prefabText")[0].value = GM_getValue("gm_prefabText") || "";
		// }, [500]);
	}

	/** 主页onload */
	function mainOnLoad() {
		setTimeout(async () => {
			const host = unsafeWindow.location.host;
			const loginUrl = "https://course.ougd.cn/login/index.php?authCAS=CAS";
			const usertext = $(".usertext").html();
			const $tips = $("#gm_tips");
			const info = GM_getValue("gm_cur_info");
			const pathname = unsafeWindow.location.pathname;

			/** 需要二次提交的科目id */
			const wantSubmitKmIds = ["625773", "667715", "701951"];

			console.log("调试输出 >>> ", { info, location: unsafeWindow.location });

			if (host === "course.ougd.cn") {
				if (pathname === "/login/index.php") {
					return;
				}
				if (!usertext) {
					console.log("正在前往登录...");
					$tips.html("正在前往登录...");
					setTimeout(() => {
						unsafeWindow.location.href = loginUrl;
					}, [1500]);
				} else {
					if (pathname === "/enrol/index.php") {
						console.log(`当前登录: ${usertext}, 课程错误或者不存在，跳过`);
						$tips.html(
							`当前登录: <span class="tmm-tools-usertext">${usertext}</span>, <br />课程错误或者不存在，跳过`
						);
						const i = GM_getValue("gm_list_cur_index");
						const gmOmitList = GM_getValue("gm_omit_list");
						gmOmitList.push({
							姓名: usertext,
							学号: info.num,
							密码: info.pass,
							科目: info.kmName,
							ID: info.kmId,
							原因: "课程id错误，跳过",
						});
						GM_setValue("gm_list_cur_index", i + 1);
						GM_setValue("gm_omit_list", gmOmitList);
						// 课程id错误，跳过
						setTimeout(() => {
							simulateClick($(".menu-action")[5]);
						}, [1500]);
						return;
					}

					if (pathname !== "/mod/assign/view.php") {
						printLog(
							$tips,
							`当前登录: ${usertext}, 请在前往上传页...`,
							`当前登录: <span class="tmm-tools-usertext">${usertext}</span>, <br />请在前往上传页...`
						);
						// 不在上传页，跳转至上传页
						setTimeout(() => {
							// 如果是需要二次确认的科目，先跳转到预览页
							if (_.includes(wantSubmitKmIds, `${info.kmId}`)) {
								unsafeWindow.location.href = `https://course.ougd.cn/mod/assign/view.php?id=${info.kmId}&action=view`;
							} else {
								unsafeWindow.location.href = `https://course.ougd.cn/mod/assign/view.php?id=${info.kmId}&action=editsubmission`;
							}
						}, [1000]);
					} else {
						const action = getQueryString("action");
						const currId = getQueryString("id");

						// 如果在上传页
						if (action === "editsubmission") {
							// 延迟1s
							await new Promise((resolve, reject) => {
								setTimeout(() => {
									resolve();
								}, 1000);
							});

							const fileText = $('.fp-content:not(".card")').text();
							// const fileHide = $(".fm-empty-container").is(":hidden");

							// 如果文件框纯文本包含当前登录用户名，视为已上传，反之，视为已上传
							if (_.includes(fileText, usertext)) {
								setTimeout(() => {
									// 如果是需要二次确认的科目，跳转到预览页
									if (_.includes(wantSubmitKmIds, currId)) {
										unsafeWindow.location.href = `https://course.ougd.cn/mod/assign/view.php?id=${currId}&action=view`;
									} else {
										printLog(
											$tips,
											`当前登录: ${usertext}, 当前在上传页, 当前登录人已完成上传, 1s后执行下一位`,
											`当前登录: <span class="tmm-tools-usertext">${usertext}</span>, <br />当前在上传页<br />当前登录人已完成上传<br />1s后执行下一位`
										);
										const i = GM_getValue("gm_list_cur_index");
										const gmOmitList = GM_getValue("gm_omit_list");
										gmOmitList.push({
											姓名: usertext,
											学号: info.num,
											密码: info.pass,
											科目: info.kmName,
											ID: info.kmId,
											原因: "文件已经上传，跳过",
										});
										GM_setValue("gm_list_cur_index", i + 1);
										GM_setValue("gm_omit_list", gmOmitList);
										setTimeout(() => {
											simulateClick($(".menu-action")[5]);
										}, [3000]);
									}
								}, [1000]);
							} else {
								printLog(
									$tips,
									`当前登录: ${usertext}, 当前在上传页, 3s后开始自动上传`,
									`当前登录: <span class="tmm-tools-usertext">${usertext}</span>, <br />当前在上传页<br />3s后开始自动上传`
								);
								setTimeout(
									function () {
										start(usertext, info.num);
									},
									[3000]
								);
							}
							return;
						}

						// 如果在预览页
						if (action === "view") {
							// 如果需要二次提交
							if (_.includes(wantSubmitKmIds, currId)) {
								// const t = $(".generaltable .submissionstatusdraft").html();
								const t1 = $(
									'.generaltable .cell.lastcol:contains("没有提交")'
								);
								const t2 = $('.generaltable .cell.lastcol:contains("草稿")');
								const t3 = $(
									'.generaltable .cell.lastcol:contains("已经提交")'
								);

								// 没有上传，需要上传
								if (t1.length > 0) {
									setTimeout(() => {
										unsafeWindow.location.href = `https://course.ougd.cn/mod/assign/view.php?id=${currId}&action=editsubmission`;
									}, [1500]);
								}

								// 存在草稿，直接提交
								if (t2.length > 0) {
									printLog(
										$tips,
										`当前登录: ${usertext}, 当前在上传预览页, 当前登录人未提交, 即将执行提交`,
										`当前登录: <span class="tmm-tools-usertext">${usertext}</span>, <br />当前在上传预览页<br />当前登录人未提交<br />即将执行提交`
									);
									setTimeout(() => {
										// simulateClick($(".singlebutton .btn-secondary")[1]);
										simulateClick(
											$(
												".box.generalbox.submissionaction.py-3 .btn.btn-secondary"
											)[1]
										);
									}, [3000]);
								}

								// 已经提交，执行下一位
								if (t3.length > 0) {
									/** 当前用户是否进入过二次提交确认页 */
									const submitFlag = GM_getValue("gm_submitFlag");
									// 当前用户没有进入过二次提交确认页，记录到忽悠列表
									if (submitFlag !== "Y") {
										const gmOmitList = GM_getValue("gm_omit_list");
										gmOmitList.push({
											姓名: usertext,
											学号: info.num,
											密码: info.pass,
											科目: info.kmName,
											ID: info.kmId,
											原因: "文件已经上传，跳过",
										});
										GM_setValue("gm_omit_list", gmOmitList);
									} else {
										GM_setValue("gm_submitFlag", "N");
									}
									const i = GM_getValue("gm_list_cur_index");
									GM_setValue("gm_list_cur_index", i + 1);
									printLog(
										$tips,
										`当前登录: ${usertext}, 当前在上传预览页, 当前登录人已提交, 准备执行下一位`,
										`当前登录: <span class="tmm-tools-usertext">${usertext}</span>, <br />当前在上传预览页<br />当前登录人已提交<br />准备执行下一位`
									);
									setTimeout(() => {
										simulateClick($(".menu-action")[5]);
									}, [3000]);
								}

								// if (_.includes(t, "未提交")) {
								// }
								// const t2 = $(".generaltable .submissionstatussubmitted").html();
								// if (_.includes(t2, "已经提交")) {

								// }
								// const t3 = $(".generaltable .lastcol")[1].innerHTML;
								// if (_.includes(t3, "没有提交")) {
								// 	// 未上传，跳转到上传
								// }
							} else {
								const i = GM_getValue("gm_list_cur_index");
								GM_setValue("gm_list_cur_index", i + 1);
								setTimeout(() => {
									simulateClick($(".menu-action")[5]);
								}, [1500]);
							}
						}

						// 如果在提交二次确认页
						if (action === "submit") {
							// 如果需要二次提交
							if (_.includes(wantSubmitKmIds, currId)) {
								GM_setValue("gm_submitFlag", "Y");
								printLog(
									$tips,
									`当前登录: ${usertext}, 当前在二次提交确认页, 即将执行确认`,
									`当前登录: <span class="tmm-tools-usertext">${usertext}</span>, <br />当前在二次提交确认页<br />即将执行确认`
								);
								setTimeout(() => {
									simulateClick($("#id_submitbutton")[0]);
								}, [3000]);
							}
						}
						//
					}
				}
			}
		}, [1000]);
	}

	/** 登录页onload */
	function loginOnLoad() {
		setTimeout(
			function () {
				var host = unsafeWindow.location.host;
				if (host === "authserver.ougd.cn") {
					const $tips = $("#gm_tips");
					const i = GM_getValue("gm_list_cur_index") || 0;
					const list = GM_getValue("gm_list") || [];
					const info = list[i];

					if (info) {
						// 账号或者密码错误，跳过
						if ($("#msg").length > 0) {
							console.log(`${info.num}：账号或者密码错误，跳过`);
							$tips.html(`${info.num}：账号或者密码错误，跳过`);
							const gmOmitList = GM_getValue("gm_omit_list");
							gmOmitList.push({
								姓名: info.name,
								学号: info.num,
								密码: info.pass,
								科目: info.kmName,
								ID: info.kmId,
								原因: "账号或者密码错误，跳过",
							});
							GM_setValue("gm_omit_list", gmOmitList);
							GM_setValue("gm_list_cur_index", i + 1);
							setTimeout(() => {
								unsafeWindow.location.href = "https://course.ougd.cn/";
								// unsafeWindow.location.reload();
							}, [3000]);
						} else {
							GM_setValue("gm_cur_info", info);
							login(info.num, info.pass);
						}
					} else {
						const gmOmitList = GM_getValue("gm_omit_list") || [];
						if (!_.isEmpty(gmOmitList)) {
							const $tips = $("#gm_tips");
							alert(
								"本次执行以存在忽略数据，请点击《导出忽略列表按钮》，导出忽略数据"
							);
							$tips.html(
								"本次执行以存在忽略数据，请点击<br />《导出忽略列表按钮》<br />导出忽略数据"
							);
						}
						alert("文件读取失败或者当前批次已经全部执行完毕，请重新选择execl");
						GM_setValue("gm_list_cur_index", -1);
						GM_setValue("gm_list", []);
					}
				}
			},
			[1000]
		);
	}
})();
