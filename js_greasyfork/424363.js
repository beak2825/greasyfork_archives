// ==UserScript==
// @name 			Luogu Tasks
// @namespace 		http://tampermonkey.net/
// @version 		2.4.2
// @run-at			document-start
// @description 	在洛谷侧边栏显示题单与自己存的题
// @author 			__OwO__
// @match 			https://www.luogu.com.cn/*
// @grant       	GM_setValue
// @grant        	GM_getValue
// @grant			unsafeWindow
// @require 		https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require 		https://cdn.staticfile.org/sweetalert/2.1.2/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/424363/Luogu%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/424363/Luogu%20Tasks.meta.js
// ==/UserScript==

// == define config ==

const inject_lantency = 300; // in ms

//  configs store in browser
let configs = {
	set train(v) {
		GM_setValue("problem-helper-local-train-list", v);
	},
	get train() {
		return GM_getValue("problem-helper-local-train-list") || {};
	},
	set local(v) {
		GM_setValue("problem-helper-local-id", v);
	},
	get local() {
		return GM_getValue("problem-helper-local-id") || null;
	},
	set hide_ac(v) {
		GM_setValue("problem-helper-hide-aced", v);
	},
	get hide_ac() {
		return GM_getValue("problem-helper-hide-aced") || false;
	},
};

// == end config ==

// == lib functions ==

// get task info
function getTask(id) {
	return new Promise((r) => {
		$.get(`https://www.luogu.com.cn/training/${id}?_contentOnly=any`).then(
			(u) => r(u.currentData.training)
		);
	});
}

// save train list
let saveTrain = async (problems) => {
	return new Promise((r) => {
		$.ajax({
			type: "POST",
			url: `https://www.luogu.com.cn/api/training/editProblems/${configs.local}`,
			beforeSend: function (request) {
				request.setRequestHeader(
					"x-csrf-token",
					$("meta[name='csrf-token']")[0].content
				);
			},
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify({ pids: problems }),
			success: () => r(),
		});
	});
};

// save config
let saveConfig = async (config) => {
	return new Promise((r) => {
		$.ajax({
			type: "POST",
			url: `https://www.luogu.com.cn/paste/new`,
			beforeSend: function (request) {
				request.setRequestHeader(
					"x-csrf-token",
					$("meta[name='csrf-token']")[0].content
				);
			},
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify({
				public: false,
				data: "#lgtsk" + JSON.stringify(config),
			}),
			success: () => r(),
		});
	});
};

// load config
let loadConfig = () => {
	return new Promise((r) => {
		$.get("https://www.luogu.com.cn/paste?_contentOnly").then((u) => {
			u = u.currentData.pastes.result;
			let nc = null;
			for (let i in u) {
				try {
					if (u[i].data.substr(0, 6) !== "#lgtsk") continue;
					let k = u[i].data;
					nc = JSON.parse(k.substr(6, k.lentgh));
					break;
				} catch (e) {}
			}
			if (!nc) return r(0);
			configs.train = nc.train;
			configs.local = nc.local;
			configs.hide_ac = nc.hide_ac;
			r(1);
		});
	});
};

// == end lib functions ==

$(document).ready(async () => {
	let local_problems;

	// == get verdict icon ==
	let geticon = (pid, uid, your_score, full_score, is_aced = null) => {
		let res;
		let ua = (uid, pid) =>
			`<a data-v-303bbf52="" data-v-357e29e4="" href="/record/list?pid=${pid}&amp;user=${uid}" target="_blank" colorscheme="default" class="color-default" data-v-83961efe="" style="color: inherit; float:left; padding-right: 0.5em;"><svg data-v-1b44b3e6="" data-v-357e29e4="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="icon svg-inline--fa fa-times fa-w-11" data-v-303bbf52="" style="transform: scale(1.2); color: rgb(231, 76, 60);"><path data-v-1b44b3e6="" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg></a>`;
		let ac = (uid, pid) =>
			`<a data-v-303bbf52="" data-v-357e29e4="" href="/record/list?pid=${pid}&amp;user=${uid}" target="_blank" colorscheme="default" class="color-default" data-v-83961efe="" style="color: inherit; float:left; padding-right: 0.5em;"><svg data-v-1b44b3e6="" data-v-357e29e4="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon svg-inline--fa fa-check fa-w-16" data-v-303bbf52="" style="color: rgb(82, 196, 26);"><path data-v-1b44b3e6="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg></a>`;
		let nt = (uid, pid) =>
			`<a data-v-303bbf52="" data-v-357e29e4="" href="/record/list?pid=${pid}&amp;user=${uid}" target="_blank" colorscheme="default" class="color-default" data-v-83961efe="" style="color: inherit; float:left; padding-right: 0.5em;"><svg data-v-1b44b3e6="" data-v-357e29e4="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-minus fa-w-14" data-v-303bbf52="" style="opacity: 0.7;"><path data-v-1b44b3e6="" fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" class=""></path></svg></a>`;
		if (your_score == full_score || is_aced) res = ac(uid, pid);
		else if (your_score == null) res = nt(uid, pid);
		else res = ua(uid, pid);
		return `<span data-v-3fb75f36="" style="font-weight: bold;">${res}</span>`;
	};

	// == render one list ==
	let renderList = (title, content, float, id = "") =>
		`
			<div
				data-v-796309f8=""
				data-v-3fb75f36=""
				class="card padding-default problem-helper-container"
				data-v-6febb0e8=""
				id="list-${id}"
			>
				<div id="list-float-${id}">${float}</div>
				<h4 data-v-3fb75f36="" data-v-796309f8="" class="lfe-h4" >${title}</h4>
				<div class="problem-helper-inner" style="display:none;">
				<div id="list-content-${id}">${content}</div>
				</div>
				<div data-v-e4b7c2ca="" data-v-3fb75f36="" class="expand-tip lfe-caption" data-v-796309f8="" >
					<span class="problem-helper-fold-off" style="display:none;" data-v-e4b7c2ca=""><svg data-v-e4b7c2ca="" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-chevron-up fa-w-14" ><path data-v-e4b7c2ca="" fill="currentColor" d="M4.465 366.475l7.07 7.071c4.686 4.686 12.284 4.686 16.971 0L224 178.053l195.494 195.493c4.686 4.686 12.284 4.686 16.971 0l7.07-7.071c4.686-4.686 4.686-12.284 0-16.97l-211.05-211.051c-4.686-4.686-12.284-4.686-16.971 0L4.465 349.505c-4.687 4.686-4.687 12.284 0 16.97z" class=""></path></svg> 隐藏列表</span>
					<span class="problem-helper-fold-on" data-v-e4b7c2ca=""><svg data-v-e4b7c2ca="" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-chevron-down fa-w-14"><path data-v-e4b7c2ca="" fill="currentColor" d="M443.5 162.6l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L224 351 28.5 155.5c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l211 211.1c4.7 4.7 12.3 4.7 17 0l211-211.1c4.8-4.7 4.8-12.3.1-17z" class=""></path></svg> 查看列表</span>
				</div>
			</div>
		`;
	let loadProblemList = async (id) => {
		return renderList(
			"...",
			"...",
			`<a id="#list-float-${id}" style="float:right;" data-v-303bbf52="" data-v-3fb75f36=""  href="javascript:void 0" class="problem-helper-train-remove color-default">删除</a>`,
			id
		);
	};
	async function loadContent(id) {
		let task;
		let getList = (x, is_local) => {
			let id = task.problems[x].problem.pid;
			if (configs.hide_ac && task.userScore.status[id] && id != configs.local)
				return "";
			return `
				<div>
					<div>
						<span data-v-3a151854="">
							<a
								data-v-303bbf52=""
								data-v-3fb75f36=""
								href="/record/list?pid=${id}&amp;user=${task.userScore.user.uid}"
								class="color-default"
								style="text-decoration: none;"
							>
								${geticon(
									id,
									task.userScore.user.uid,
									task.userScore.score[id],
									task.problems[x].problem.fullScore,
									task.userScore.status[id]
								)}
							</a>
							${
								is_local
									? `
							<a
								data-v-3fb75f36=""
								style="float: right;font-weight: light;"
								class="problem-helper-delete-from-list"
								data="${id}"
							>
							<svg data-v-4121e124="" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10"><path data-v-4121e124="" fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg>
							</a>
							`
									: ""
							}
						</span>
						<a
							class="colored problem-helper-text"
							style="padding-left: 3px"
							href="/problemnew/show/${id}"
							target="_blank"
						>
							<b>${id}</b> ${task.problems[x].problem.title}
						</a>
					</div>
				</div>`;
		};
		task = await getTask(id);
		let content = "";
		if (id == configs.local) {
			$(`#list-float-${id}`).text("");
			local_problems = task.problems.map((u) => u.problem.pid);
		}
		for (let i in task.problems) content += getList(i, id == configs.local);
		$(`#list-content-${id}`).html(content);
		$(`#list-${id} > h4`).text(task.title);
		$(`#list-float-${id}`).attr("data", task.id);
	}
	let getScore = async (sett) => {
		if (sett.method == "train")
			return {
				uid: sett.task.userScore.user.uid,
				scr: sett.task.userScore.score[sett.id],
				fscr: sett.task.problems[sett.id].problem.fullScore,
			};
		else if (sett.method == "local")
			return new Promise((res, rej) => {
				$.get(`https://www.luogu.com.cn/problem/${sett.id}?_contentOnly`).then(
					(u) => {
						res({
							uid: u.currentUser.uid,
							scr: u.currentData.problem.score,
							fscr: u.currentData.problem.fullScore,
						});
					}
				);
			});
	};
	function renderItem(title, id) {
		return `
			<div>
				<div>
					<span data-v-3a151854="">
						<a
							data-v-303bbf52=""
							data-v-3fb75f36=""
							href="/record/list?pid=${id}&amp;user=${task.userScore.user.uid}"
							class="color-default"
							style="text-decoration: none;"
						>
							${geticon(
								id,
								task.userScore.user.uid,
								task.userScore.score[id],
								task.problems[x].problem.fullScore,
								task.userScore.status[id]
							)}
						</a>
					</span>
					<a
						class="colored problem-helper-text
						style="padding-left: 3px"
						href="/problemnew/show/${id}"
						target="_blank"
					>
						<b>${id}</b> ${task.problems[x].problem.title}
					</a>
				</div>
			</div>
		`;
	}
	function loadListener() {
		$("#problem-helper-hide-aced").click((u) => {
			u = $(u.target);
			configs.hide_ac = u[0].checked;
			unsafeWindow._feInstance.$swalToastSuccess("修改成功");
			loaderProblemEntry();
		});
		$("#problem-helper-save").click((u) => {
			saveConfig(configs);
			unsafeWindow._feInstance.$swalToastSuccess("保存成功");
			loaderProblemEntry();
		});
		$("#problem-helper-load").click(async (u) => {
			if (await loadConfig())
				unsafeWindow._feInstance.$swalToastSuccess("加载成功");
			else unsafeWindow._feInstance.$swalToastError("加载失败");
			loaderProblemEntry();
		});
		$("#problem-helper-set-local-list").keydown(function (e) {
			if (e.keyCode == 13) {
				configs.local = $("#problem-helper-set-local-list").val();
				unsafeWindow._feInstance.$swalToastSuccess("修改成功");
				loaderProblemEntry();
			}
		});
		$("#problem-helper-import").keydown(async (e) => {
			if (e.keyCode == 13) {
				let u = $("#problem-helper-import").val().trim().split(",");
				local_problems = (await getTask(configs.local)).problems.map(
					(u) => u.problem.pid
				);
				let t = local_problems;
				for (let i in u) if (t.indexOf(u[i]) == -1) t.push(u[i]);
				saveTrain(t);
				unsafeWindow._feInstance.$swalToastSuccess("导入成功");
				loaderProblemEntry();
			}
		});
		$("#problem-helper-add-to-list").click(async (u) => {
			let r = unsafeWindow.location.href.split("/");
			r = r[r.length - 1];
			while (r[r.length - 1] == "#") r = r.slice(0, r.length - 1);
			if (!unsafeWindow._feInjection.currentData.problem.title) return;
			local_problems = (await getTask(configs.local)).problems.map(
				(u) => u.problem.pid
			);
			if (local_problems.indexOf(r) == -1) local_problems.push(r);
			saveTrain(local_problems);
			unsafeWindow._feInstance.$swalToastSuccess("添加成功");
			loaderProblemEntry();
		});
		$(".problem-helper-delete-from-list").click(async (u) => {
			u = $(u.target).parents(".problem-helper-delete-from-list");
			let r = u.attr("data");
			local_problems = (await getTask(configs.local)).problems.map(
				(u) => u.problem.pid
			);
			let now = local_problems;
			let newone = [];
			for (let i in now) if (now[i] != r) newone.push(now[i]);
			saveTrain(newone);
			unsafeWindow._feInstance.$swalToastSuccess("删除成功");
			loaderProblemEntry();
		});
		$(".problem-helper-train-remove").click((u) => {
			u = $(u.target);
			let r = u.attr("data");
			let now = configs.train;
			let newone = {};
			for (let i in now) if (i != r) newone[i] = now[i];
			configs.train = now;
			unsafeWindow._feInstance.$swalToastSuccess("删除成功");
			loaderProblemEntry();
		});
	}
	async function loaderProblemEntry() {
		let lists = "";
		let urls = configs.train;
		// console.log(urls);
		if (configs.local && !urls[configs.local]) urls[configs.local] = "本地列表";
		for (let i in urls) lists += await loadProblemList(i);
		let content_promise = [];
		for (let i in urls) content_promise.push(loadContent(i));
		Promise.all(content_promise).then(loadListener);
		lists += renderList(
			"设置",
			`<div data-v-59a1d633="" data-v-83961efe="" class="row">
			<div data-v-72d91c56="" data-v-59a1d633="" class="checkbox" data-v-83961efe=""><input id="problem-helper-hide-aced" type="checkbox" value="65560" ${
				configs.hide_ac ? 'checked=""' : ""
			}">   <lable>
          	隐藏已通过题目
			</label> </div>
			<div>
				<label>本地题单</label>
				<input data-v-a7f7c968="" type="text" placeholder="题单id" class="lfe-form-sz-middle" style="width: 30%;" value="${
					configs.local || ""
				}" id="problem-helper-set-local-list">
			</div>
			<div>
				<a id="problem-helper-save">保存到洛谷云剪贴板</a>
			</div>
			<div>
				<a id="problem-helper-load">从洛谷云剪贴板加载</a>
			</div>
			<div>
				<label>批量导入</label>
				<input data-v-a7f7c968="" type="text" class="lfe-form-sz-middle" style="width: 30%;" id="problem-helper-import">
			</div>
			</div>`,
			""
		);
		$("#problem-helper-entry").html(lists);
		$(".problem-helper-fold-on").click((u) => {
			u = $(u.target);
			u.parent().prev(".problem-helper-inner").removeAttr("style");
			u.attr("style", "display:none;");
			u.prev(".problem-helper-fold-off").removeAttr("style");
		});
		$(".problem-helper-fold-off").click((u) => {
			u = $(u.target);
			u.parent().prev(".problem-helper-inner").attr("style", "display:none;");
			u.attr("style", "display:none;");
			u.next(".problem-helper-fold-on").removeAttr("style");
		});
	}
	let deferredInjectProblemPage = () => {
		$(".problem-helper-container").remove();
		$(".side").prepend(
			renderList(
				"做题助手",
				'<div id="problem-helper-entry"></div>',
				'<a style="float:right;" data-v-303bbf52="" data-v-3fb75f36=""  href="javascript:void 0" id="problem-helper-add-to-list" class="color-default"><svg data-v-b35188f4="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-plus-square fa-w-14"><path data-v-b35188f4="" fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" class=""></path></svg>添加至列表</a >'
			)
		);
		loaderProblemEntry();
	};
	let loadTrainList = (id) => {
		let local = configs.train;
		let getList = (id) => {
			return `
				<div>
					<div>
						<span data-v-3a151854="">
							<a
								style="text-decoration: none;float: right;font-weight: light;"
								data="${id}"
								class="color-default problem-helper-delete-from-list"
								data-v-303bbf52=""
								data-v-3fb75f36=""
								href="javascript:void 0"
							>
								<svg data-v-4121e124="" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10"><path data-v-4121e124="" fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg>
							</a>
						</span>
						<a
							class="colored problem-helper-text"
							style="padding-left: 3px"
							href="https://www.luogu.com.cn/training/${id}#information"
							target="_blank"
						>
							<b>${id}</b> ${local[id]}
						</a>
					</div>
				</div>`;
		};
		let lists = "";
		for (let i in local) lists += getList(i);
		return lists;
	};
	let loaderTrainEntry = async () => {
		let lists = loadTrainList();
		$("#problem-helper-entry").html(lists);
		$(".problem-helper-fold-on").click((u) => {
			u = $(u.target);
			u.parent().prev(".problem-helper-inner").removeAttr("style");
			u.attr("style", "display:none;");
			u.prev(".problem-helper-fold-off").removeAttr("style");
		});
		$(".problem-helper-fold-off").click((u) => {
			u = $(u.target);
			u.parent().prev(".problem-helper-inner").attr("style", "display:none;");
			u.attr("style", "display:none;");
			u.next(".problem-helper-fold-on").removeAttr("style");
		});
		$("#problem-helper-add-to-list").click((u) => {
			let r = unsafeWindow.location.href.split("/");
			r = r[r.length - 1].split("#")[0];
			if (!unsafeWindow._feInjection.currentData.training.title) return;
			let now = configs.train;
			if (!now) now = {};
			now[r] = unsafeWindow._feInjection.currentData.training.title;
			configs.train = now;
			unsafeWindow._feInstance.$swalToastSuccess("添加成功");
			loaderTrainEntry();
		});
		$(".problem-helper-delete-from-list").click((u) => {
			u = $(u.target).parents(".problem-helper-delete-from-list");
			let r = u.attr("data");
			let now = configs.train;
			let newone = {};
			for (let i in now) if (i != r) newone[i] = now[i];
			configs.train = newone;
			unsafeWindow._feInstance.$swalToastSuccess("删除成功");
			loaderProblemEntry();
		});
	};
	let deferredInjectTrainPage = () => {
		$(".problem-helper-container").remove();
		$(".side").prepend(
			renderList(
				"做题助手",
				'<div id="problem-helper-entry"></div>',
				'<a style="float:right;" data-v-303bbf52="" data-v-3fb75f36=""  href="javascript:void 0" id="problem-helper-add-to-list" class="color-default"><svg data-v-b35188f4="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-plus-square fa-w-14"><path data-v-b35188f4="" fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" class=""></path></svg>添加至列表</a>'
			)
		);
		loaderTrainEntry();
	};
	let deferredInjectProblemlist = async () => {
		local_problems = (await getTask(configs.local)).problems.map(
			(u) => u.problem.pid
		);
		$(".problem-helper-inlist-adder").remove();
		let pid = "",
			name = "";
		let h = (pid, name) => `
			<a style="float:right; padding-right: 2em;" data="${pid}" data-v-303bbf52="" data-v-3fb75f36=""  href="javascript:void 0" class="problem-helper-inlist-adder color-default"><svg data-v-b35188f4="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-plus-square fa-w-14"><path data-v-b35188f4="" fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" class=""></path></svg>
        		添加
     		</a>`;
		let rows = $(".row");
		let trim = (s) => {
			return s.replace(/(^\s*)|(\s*$)/g, "");
		};
		rows.each((u) => {
			u = $(rows[u]);
			pid = u.children(".pid").text();
			name = u.children(".title").children(".title").text();
			name = trim(name);
			u.children(".title").prepend(h(pid, name));
		});
		$(".problem-helper-inlist-adder").click(async (u) => {
			u = $(u.target);
			let r = u.attr("data");
			local_problems = (await getTask(configs.local)).problems.map(
				(u) => u.problem.pid
			);
			let now = local_problems;
			if (now.indexOf(r) == -1) now.push(r);
			saveTrain(now);
			unsafeWindow._feInstance.$swalToastSuccess("添加成功");
		});
	};

	/* main controller */
	function inject() {
		if (unsafeWindow.location.href.includes("problem/list"))
			deferredInjectProblemlist();
		else if (unsafeWindow.location.href.includes("training"))
			deferredInjectTrainPage(), deferredInjectProblemlist();
		else if (unsafeWindow.location.href.includes("problem"))
			deferredInjectProblemPage();
	}
	window.addEventListener("popstate", function (e) {
		setTimeout(inject, inject_lantency);
	});
	setTimeout(inject, inject_lantency);
	$(document.body).append(
		`<style>
		.problem-helper-text{
			-webkit-line-clamp: 1; overflow: hidden; display: -webkit-box;
			-webkit-box-orient: vertical; white-space: normal;
		}
		.expand-tip > span[data-v-e4b7c2ca] {
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			cuser-select: none;
			cursor: pointer;
			color: rgba(0, 0, 0, .3);
		}
		.expand-tip[data-v-e4b7c2ca] {
			text-align: center;
		}
		.expand-tip > span[data-v-e4b7c2ca]:hover {
			color: inherit;
		}
		</style>`
	);
});
