// ==UserScript==
// @name         Pixiv系列小说自动爬虫
// @version      1.0
// @description  根据Pixiv系列小说seriesID自动爬取指定章节或整本小说并可导出成.txt
// @author       DreamNya
// @match        https://www.pixiv.net/novel/series/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_download
// @connect      pixiv.net
// @license      MIT
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/448366/Pixiv%E7%B3%BB%E5%88%97%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/448366/Pixiv%E7%B3%BB%E5%88%97%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==

/*
【简介】
用来练手的爬虫脚本，放弃了引入第三方脚本，选择使用油猴内置函数，因此依赖油猴。
不需要设置cookies，只需要用浏览器登陆Pixiv保证对目标小说有访问权限即可。
下载内容存储在油猴脚本中，可通过控制台命令将指定小说导出到本地。

由于GM_xmlhttpRequest没有跨域限制，实际上可以将
// @match https://www.pixiv.net/novel/series/*
替换为
// @include *
从而在任意页面使用本脚本

【爬虫命令】
startMain(seriesID,"Charpters",isForce)
启动爬虫
--{number}  seriesID:  必填，系列小说ID，获取位置为：https://www.pixiv.net/novel/series/系列小说ID （数字，不含?）
--{string}  Charpters: 可选，指定章节，默认为全部，具体指定规则见后文
--{boolean} isForce:   可选，对于已存在章节是否强制下载，默认为否


downloadList()
获取已下载内容列表
无参数，返回2个内容，分别为全部章节和全部小说，全部小说中文本可用于download()参数中的NovelName


download(NovelName,Charpters)
导出已下载内容
--{string} NovelName: 必填，系列小说名，可通过downloadList()获取
--{string} Charpters: 可选，指定章节，默认为全部，具体指定规则见后文


Charpters 规则：
规则1：单一数字/^\d+$/       添加单一数字章节到下载队列
规则2：数字范围/^\d+-\d+$/   添加数字范围章节到下载队列
规则3：^单一数字/^\^\d+$/    从下载队列中删除单一数字章节

多个规则用,分隔
例："1,3-10,^5,15" 代表下载第1、3、4、6、7、8、9、10、15章
例："^5,3-10,1,15" 代表下载第1、3、4、5、6、7、8、9、10、15章
*/


//自定义章节分割名 用以小说阅读器自动拆分章节
function CustomCharpter(index) {
	return `第${index}章 `
}

function GMget(url) {
	return new Promise((resolve) => {
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: resolve
		})
	})
}

//获取所有章节信息
async function startCharpter(ID) {
	let CharpterRes = await GMget(`https://www.pixiv.net/ajax/novel/series/${ID}/content_titles`)
	if(CharpterRes.status != 200) {
		console.log(CharpterRes)
		throw new Error(JSON.parse(CharpterRes.responseText).message)
	}
	return JSON.parse(CharpterRes.responseText).body
}

//获取章节内容
async function getCharpter(Charpter, CharpterIndex) {
	let CharpterPage = await GMget("https://www.pixiv.net/novel/show.php?id=" + Charpter.id)
	let CharpterDoc = new DOMParser().parseFromString(CharpterPage.responseText, "text/html")
	let CharpterNovel = JSON.parse(CharpterDoc.querySelector("#meta-preload-data").content).novel
	let result = CharpterNovel[Object.getOwnPropertyNames(CharpterNovel)].content
	return CharpterIndex + Charpter.title + "\n" + result //自动补一行章节名用以分割章节
}

//主函数 启动爬虫
async function startMain(ID, Charpters = "ALL", force = false) {
	let mainRes = await GMget("https://www.pixiv.net/ajax/novel/series/" + ID)
	if(mainRes.status != 200) {
		console.log(mainRes)
		throw new Error(JSON.parse(mainRes.responseText).message)
	}
	let mainJSON = JSON.parse(mainRes.responseText).body
	let NovelName = mainJSON.title
	let NovelTotal = mainJSON.total
	let res = Charpters != "ALL" ? CharptersParse(Charpters) : "ALL"
	if(res != "ALL" && res[res.length - 1] > NovelTotal) throw new Error(`欲爬取章节${res[res.length-1]}大于可爬取最大章节数${NovelTotal}`)
	let CharpterInfos = await startCharpter(ID)
	if(res == "ALL") res = CharpterInfos.map((item, index) => index + 1)
	for(let item of res) {
		let index = item - 1
		let CharpterInfo = CharpterInfos[index]
		let CharpterIndex = CustomCharpter(item)
		if(CharpterInfo.available != true) {
			console.log(`${CharpterIndex}无访问权限 无法爬取 已跳过 available!=true`, CharpterInfo)
			continue
		}
		let CharpterKey = `${NovelName} # ${CharpterIndex}`
		if(force == false && GM_getValue(CharpterKey)) {
			console.log(CharpterInfo.title + "已存在，已跳过爬取，如需强制爬取，请调用startMain(ID,Charpters,true)")
			continue
		}
		let CharpterResult = await getCharpter(CharpterInfo, CharpterIndex)
		GM_setValue(CharpterKey, CharpterResult)
		console.log(CharpterInfo.title + "爬取成功")
	}
	console.log(ID, `${NovelName} ${Charpters} "已爬取完毕"`)
}
unsafeWindow.startMain = startMain

/*
Charpters 规则：
规则1：单一数字/^\d+$/       添加该单一数字章节到下载队列
规则2：数字范围/^\d+-\d+$/   添加该数字范围章节到下载队列
规则3：^单一数字/^\^\d+$/    从下载队列中删除该单一数字

多个规则用,分隔
例："1,3-10,^5,15" 代表下载第1、3、4、6、7、8、9、10、15章
例："^5,3-10,1,15" 代表下载第1、3、4、5、6、7、8、9、10、15章
*/
//导出已下载内容
function download(NovelName, Charpters) {
	let keys = Charpters ? CharptersParse(Charpters) : "ALL"
	let NovelValues = []
	if(keys == "ALL") {
		let pattern = new RegExp("^" + NovelName + " # ")
		let Allkeys = GM_listValues().filter(i => pattern.test(i))
		if(Allkeys.length == 0) {
			throw new Error(NovelName + "未下载任何章节")
		}
		NovelValues = Allkeys.map(i => GM_getValue(i))
		Charpters = "ALL"
	} else {
		for(let item of keys) {
			let _value = GM_getValue(`${NovelName} # ${CustomCharpter(_value)}`)
			if(_value == void 0) {
				throw new Error(`${NovelName} # ${CustomCharpter(_value)} 未下载，无法保存到本地`)
			}
			NovelValues.push(_value)
		}
	}
	GM_download(URL.createObjectURL(new Blob([NovelValues.join("\n\n")])), `${NovelName} ${Charpters}.txt`)
}
unsafeWindow.download = download

//获取已下载内容列表
function downloadList() {
	let list = GM_listValues()
	console.log("全部章节", list)
	console.log("全部小说", [...new Set(list.map(i => i.split(" # ")[0]))])
}
unsafeWindow.downloadList = downloadList

//指定章节格式化
function CharptersParse(Charpters) {
	let res = []
	for(let item of Charpters.split(",")) {
		switch (true) {
			case /^\d+$/.test(item):
				res.push(item * 1)
				break
			case /^\d+-\d+$/.test(item):
				{
					let con = item.split("-")
					for(let i = con[0] * 1; i <= con[1] * 1; i++) res.push(i)
					break
				}
			case /^\^\d+$/.test(item):
				{
					let non = item.replace("^", "")
					res = res.filter(i => i != non)
					break
				}
			default:
				throw new Error(item + "格式有误")
		}
	}
	return [...new Set(res)].sort()
}