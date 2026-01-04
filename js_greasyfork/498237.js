// ==UserScript==
// @name              B站成分检测器
// @version           24.06.1801
// @author            hmjz100,xulaupuz,trychen
// @namespace         github.com/hmjz100
// @license           GPLv3
// @description       针对华子哥成分改进
// @match             *://*.bilibili.com/*
// @icon              data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A1qEAANahAADWoQAG1qEAb9ahAMvWoQD01qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD01qEAy9ahAG/WoQAG1qEAANahAADWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANDWoQAb1qEAANahAAfWoQDQ1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANHWoQAH1qEAbtahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAG7WoQDH1qEA/9ahAP/WoQD/1qEAtdahABjWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABvWoQC11qEA/9ahAP/WoQD/1qEAx9ahAPnWoQD/1qEA/9ahAP/WoQAZ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABjWoQD/1qEA/9ahAP/WoQDz1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA+dahAP/WoQD/1qEA/9ahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAGdahAP/WoQD/1qEA/9ahAPjWoQDH1qEA/9ahAP/WoQD/1qEAttahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABnWoQC21qEA/9ahAP/WoQD/1qEAx9ahAG3WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQBt1qEABtahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA0NahAAfWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAM/WoQAb1qEAANahAADWoQAA1qEABtahAG7WoQDH1qEA89ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA89ahAMfWoQBu1qEABtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAAbWoQDF1qEA/9ahAP/WoQD/1qEA/9ahAMXWoQAP1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAAbWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAYtahAP/WoQD/1qEA/9ahAP/WoQDF1qEADtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAY9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBf1qEA/9ahAP/WoQD/1qEAxdahAA7WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQBf1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAATWoQCg1qEA6tahAKjWoQAO1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAKjWoQDr1qEAoNahAATWoQAA1qEAANahAADWoQAA1qEAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////AAAADgAAAAQAAAAAAAAAAA///wAf//+AP///wD///8A////AP///wDw/w8A8P8PAPD/DwDw/w8A8P8PAPD/DwD///8A////AH///gA///wAAAAAAAAAAAgAAAAcAAAAP8A8A/+AfgH/gP8B/4H/gf+D/8H/////8=
// @connect           bilibili.com
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @require           https://unpkg.com/jquery@3.6.3/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource Swal     https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @resource SwalDark https://unpkg.com/@sweetalert2/theme-dark@5.0.15/dark.min.css
// @downloadURL https://update.greasyfork.org/scripts/498237/B%E7%AB%99%E6%88%90%E5%88%86%E6%A3%80%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/498237/B%E7%AB%99%E6%88%90%E5%88%86%E6%A3%80%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

$(function BiliChecker() {
	// 是否在控制台显示错误消息
	let debug = true;
	/* 注释~
	在这里配置要检查的成分，或者直接拉黑（使用指定UID评论的人会被直接添加标签）。
	假设你要直接给指定UID添加一个标签的话，就这样写：blacklist: [1234567890,0987654321]
	*/
	const checkers = [
		{
			displayName: "抽奖",
			displayIcon: "🎁",
			keywords: ["互动抽奖", "转发本条动态"],
		},
		{
			displayName: "米の子",
			displayIcon: "https://i0.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #原神", "#原神", "#米哈游#", "#miHoYo#", "原神", "芙宁娜", "白术", "赛诺", "神里绫人", "神里绫华", "夏洛蒂", "珊瑚宫", "九条裟罗", "班尼特", "夜阑", "那维莱特", "枫原万叶", "万叶", "钟离", "纳西妲", "香菱", "八重神子", "久岐忍", "菲谢尔", "艾尔海森", "胡桃", "林尼", "达达利亚", "提纳里", "宵宫", "莫娜", "甘雨", "罗莎莉亚", "刻晴", "九条裟罗", "温迪", "阿贝多", "云堇", "芭芭拉", "可莉", "迪卢克", "烟绯", "重云", "雷泽", "凝光", "坎蒂丝", "辛焱"],
			followings: [401742377] // 原神官方号的 UID
		},
		{
			displayName: "崩坏3",
			displayIcon: "https://i0.hdslb.com/bfs/face/f861b2ff49d2bb996ec5fd05ba7a1eeb320dbf7b.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #崩坏3", "#崩坏3", "崩坏3", "德丽莎", "温蒂"],
			followings: [27534330] // 崩坏3官方号的 UID
		},
		{
			displayName: "崩铁",
			displayIcon: "https://i0.hdslb.com/bfs/face/57b6e8c16b909a49bfc8d8394d946f908cabe728.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #崩坏星穹铁道", "#崩坏星穹铁道", "#星穹铁道", "崩坏星穹铁道", "星铁", "崩铁"],
			followings: [1340190821] // 崩坏星穹铁道官方号的 UID
		},
		{
			displayName: "粥",
			displayIcon: "https://i0.hdslb.com/bfs/face/d4005a0f9b898d8bb049caf9c6355f8e8f772a8f.jpg@100w_100h.webp",
			keywords: ["明日方舟", "#明日方舟"],
			followings: [
				161775300, // 明日方舟官方号的 UID
			]
		},
		{
			displayName: "碧蓝航线",
			displayIcon: "https://i0.hdslb.com/bfs/face/1fd5b43d5f619e6df8c8adcf13c962a3e80ee971.jpg@100w_100h.webp",
			keywords: ["碧蓝航线", "#碧蓝航线", "#舰船新增#"],
			followings: [
				233114659, // 碧蓝航线官方号的 UID
			]
		},
		{
			displayName: "VTuber",
			displayIcon: "https://i0.hdslb.com/bfs/face/d399d6f5cf7943a996ae96999ba3e6ae2a2988de.jpg@100w_100h.webp",
			keywords: ["雪蓮", "塔菲", "七海", "草莓猫", "嘉然", "乃琳", "珈乐", "贝拉"],
			followings: [
				1437582453, // 東雪蓮Official
				1265680561, // 永雏塔菲
				434334701, // 七海Nana7mi
				1210816252, // 草莓猫Taffy
				672328094, // 嘉然今天吃什么
				672342685, // 乃琳Queen
				351609538, // 珈乐Carol
				672346917, // 向晚大魔王
				672353429, // 贝拉kira
                2073012767, // 美月もも
                439438614, // 木几萌Moe
                387636363, // 雫るる_Official
                698029620, // 兰音Reine

			]
		},
		{
			displayName: "Asoul",
			displayIcon: "https://i0.hdslb.com/bfs/face/43b21998da8e7e210340333f46d4e2ae7ec046eb.jpg@100w_100h.webp",
			keywords: ["@A-SOUL_Official", "#A_SOUL#"],
			followings: [
				703007996, // Asoul
				547510303, // Asoul二创计画
				672328094, // 嘉然今天吃什么
				672342685, // 乃琳Queen
				351609538, // 珈乐Carol
				672346917, // 向晚大魔王
				672353429, // 贝拉kira
			]
		},
		{
			displayName: "王者荣耀",
			displayIcon: "https://i0.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #王者荣耀", "#王者荣耀", "王者荣耀"],
			followings: [
				57863910, // 王者荣耀
				392836434, // 哔哩哔哩王者荣耀赛事
			]
		},
		{
			displayName: "三国杀",
			displayIcon: "https://i0.hdslb.com/bfs/face/fe2e1a6e3dc702a6c91378e096ef37ca71bf4629.jpg@100w_100h.webp",
			keywords: ["互动抽奖 #三国杀", "#三国杀", "三国杀", "#2023三国杀"],
			followings: [1254932367] // 三国杀十周年官方号的 UID
		},
		{
			displayName: "Minecraft",
			displayIcon: "https://i0.hdslb.com/bfs/face/c5578966c447a70edf831bbf7e522b7be6090fea.jpg@100w_100h.webp",
			keywords: ["我的世界", "minecraft", "#我的世界", "我的世界拜年祭", "MCBBS", "我的世界中文论坛", "MC玩家"],
			followings: [
				43310262, // 我的世界官方号的 UID
				39914211, // 我的世界中文论坛(MCBBS)官方号的 UID
			]
		},
		{
			displayName: "迷你世界",
			displayIcon: "https://i0.hdslb.com/bfs/face/a7591e5e0278aafb76cc083b11ca5dd46f049420.jpg@100w_100h.webp",
			keywords: ["mnsj", "迷你世界", "miniworld", "#迷你世界", "迷你世界拜年祭"],
			followings: [
				470935187, // 迷你世界官方号的 UID
			]
		},
		{
			displayName: "初生科技",
			displayIcon: "https://i0.hdslb.com/bfs/face/eb4c7bbea813eed3a92ee194809d85715e6a7659.jpg@100w_100h.webp",
			// [禁止骂我！禁止拉黑！.jpg]
			keywords: ["易语言", "编程猫", "scratch", "破解", "ramos", "winpe", "bsod", "memz", "MEMZ", "WindowsCE", "下崽器", "aero", "setup", "DWM", "CmzPrep", "虚拟机", "VMWare", "希沃白板", "Ubuntu PE", "PowerShell", "gnu/linux"],
			followings: [
				//- 组1/关键词:system -//
				493998035, // SYSTEM-RAMOS-ZDY
				702028797, // JERRY-SYSTEM
				631731585, // system-bootmgr-L
				501355555, // MS-SYSTEM
				1865727084, // SYSTEM-WinPE-CHD
				1162296488, // System3206
				1531948091, // SYSTEM_Win11_RE
				392697653, // System-i386
				313342814, // SYSTEM-GREE-GZN
				1546428456, // SYSTEM-WIN-EDGE
				631731585, // system-bootmgr-L
				501355555, // MS-SYSTEM
				2043088162, // SYSTEM-WINNT-ZDY
				601270898, // 601270898
				1531948091, // SYSTEM_Win11_RE
				3493083238894137, // 井_SYSTEM_火车迷
				1666981688, // System-Installer
				1546428456, // SYSTEM-WIN-24H2
				1162296488, // system4831
				1886348413, // SYSTEM-MEMZ-CAO
				1827307028, // SYSTEM_小影
				1744631001, // SYSTEM-SUYI-WIN
				699804375, // SYSTEM-MSDOS-ZDY
				3493298725456171, // SYSTEM-WIN-BY
				1431997122, // SYSTEM-Start
				669094468, // SYSTEM-TANGYUAN
				703051574, // SYSTEM-OOBE
				604076432, // SYSTEM-WIN32-PE
				//- 组2/关键词:bsod -//
				451475014, // STR-BSOD
				1511907771, // MEMZ-BSOD
				1975308950, // BSOD-MEMZ
				397847418, // 蓝屏钙BSOD
				1776025003, // 蓝瓶钙BSoD
				1007224506, // EXPLORER-BSOD
				1175873768, // BSOD-Winme
				2032637936, // BSOD-SYSTEM
				1933399514, // win11_BSOD
				1641461034, // DEEPIN_BSOD2_CMD
				3493293100894309, // SYSTEM-BSOD-ZFS
				1204666655, // 草方块BSOD
				1124857662, // Wininit_BSOD
				1306710323, // SHITOU_BSOD
				10828819, // BSoD正在玩
				1776025003, // 蓝瓶钙BSoD
				1266839139, // JHR_BSOD_MIMZ
				3461566410262700, // Windows_BSOD
				1061621085, // Vista-BSOD
				1007224506, // EXPLORER-BSOD
				1175873768, // BSOD-Winme
				665360141, // 微飞的BSOD
				3461578091399948, // Silversoft_BSOD
				1933399514, // win11_BSOD
				2043170695, // SYSTEM-BSOD-MEMZ
				//- 组3/关键词:memz -//
				21927744, // 360MEMZ
				1353783215, // MEMZ-Chrome
				412777837, // 注册表MEMZ
				457692234, // 奇怪的MEMZ
				298993710, // 注册表编辑器MEMZ
				413269076, // Cmd_MEMZ
				649846967, // Win7MEMZ-BX
				498912953, // AMD_MEMZ
				390483853, // 炒鸡360MEMZ
				362451533, // NC_Memz
				351258144, // 豆沙包MEMZ
				104657830, // 尚宜鼎MEMZ
				365129777, // DrAMA-MEMZ
				378430387, // 小李MEMZ
				392672572, // 123MEMZ
				1465447323, // 爱搞机的MEMZ
				1585476, // 23胡彬MEMZ
				1151195812, // 开朗的冰人MEMZ
				1089892994, // MEMZ-Windows11
				//- 组5/关键词:Aero -//
				435972058, // WindowsAero毛玻璃
				1452376557, // 没有Aero就没有灵魂
				1911529131, // Aero8m
				1321946754, // 没有Aero的Windows7
				//- 组5/关键词:setup -//
				589370259, // setup-windows安装
				2050076822, // Windows-Setup
				1549141274, // system-setup
				692755897, // Setup-Official
				483574120, // setup安装程序
				1031408618, // Deewin-Setup
				671918906, // win95setup
				//- 组6/关键词:Start -//
				524501321, // Start-hs888
				2030178992, // Start-BME
				//- 组7/关键词:Linux -//
				1933598970, // 白羊Linux
				603375808, // linux265
				1984449284, // Linux粉
				1093084152, // BSD-Linux
				67247219, // Linux_Newbie
				//- 组8/关键词:Windows -//
				1921195852, // Windows之家
				621857141, // Windows哥
				612743845, // 浩瀚星晨win
				1050145612, // windows11不会出
				3493092688661431, // 炸了的win10
				1601172780, // Windows毛玻璃解说233
				353290736, // Win11的粉丝_offical
				24821321, // Windows系统追更狂魔
				1833642992, // Win32_WinSxS_sys
				276817988, // 无人所知的windows12
				1613384176, // Aero-Windows311
				483675256, // Windows功能
				2009792251, // Windows-Lover
				3493125863508026, // 失败的Windows
				696040999, // Lemon_x64_Win11
				1225952698, // 叶一程哥哥win10
				601259909, // 星晨大海win_Acpn
				605857877, // 卖蓝屏钙的Win11
				1736839855, // SYSTEM-D-WIN
				3494364330330273, // 一只野生的win31
				1375459514, // 开心的Windows
				1340261135, // windows1球_启动中
				578278851, // 星晨天际win
				582129140, // Windows11-PPT
				1462538741, // 很屑的windows114514
				26284934, // win_小火龙
				1965090607, // 可乐Windows
				261016792, // Win10HOME
				1751934902, // Win-PowerShell
				248556377, // Win_Update
				2108200476, // Win_Threshold-10
				2017167096, // 喜欢Win8的MacPro
				694139497, // Windows_Tester_2
				1119522579, // 爱蓝屏的win10
				1724541085, // SYSTEM--win7
				1628906682, // 被win11吃掉的磁贴
				1509347075, // Windows12MC
				1261767230, // 一只屑win10
				1605910926, // -Windows-11-
				1326423111, // Win-Flash-Pro
				1497262975, // 不解风情のWin11
				1604146839, // windows田字牌电脑
				1463163459, // Windows81Metro
				687996269, // 喜欢Windows8的架空放送
				3493119670618871, // 小锅说Windows
				483345456, // Win10家庭版
				2101678528, // OS_Windows11_lzn
				1729734602, // bug32_Windows
				1222118214, // windows11电脑的cmd
				503289010, // Windows7の理系を行う
				403527839, // windows核心编程
				435227174, // Win10Win10是个屑
				509902447, // 爱折腾的Windows
				35833798, // Windows710
				3493133778160480, // SYSTEM-WIN11-PE
				169290582, // VMware的win7
				1385242199, // MS-SYSTEM-WIN
				383322806, // Win10Pro
				3546554428295778, // SYSTEM-WIN-DCR
				1283206843, // Windows被砍掉的Aero
				1935801783, // Windows软件倒腾师
				392012144, // 一只win8球
				1338015717, // windows_system
				1187162171, // Setup-Win11
				1009063496, // Windows的Windows
				3493118152280841, // mcdos-windows
				435462593, // 唐狐WIN
				1065194305, // 彩虹猫-win11
				//- 组9/关键词:KDE -//
				2008726064, // kde-yyds
				1989712487, // SYSTEM-WIN11-KDE
				//- 组10/关键词:Ubuntu -//
				668421393, // Ubuntu-PE
				586347926, // memz-ubuntu
				//- 自定义组/依照个人判断 -//
				1157923020, // 仗义的老班长
				401094700, // 旮沓曼_gt428
				356882513, // 被重组吃掉的虚拟桌面
				1151325757, // SYSTEM-OPS-LJY
				1304244190, // System-NBNB
				504179884, // MYB_CKLS
				1776456802, // 奇怪的MEMZ的小号
				1534842751, // 爱WinPE的MEMZ
				2112060594, // WINPE-SYSTEM
				1439352366, // SYSTEM-WINPE-EXE
				678414222, // Windows-regedit
				505199229, // SYSTEM_PHILI
				652188355, // 一个windows爱好者
				1863175083, // 半不了世的空城
				1736202379, // 胡桃玩VM
				1322183332, // WindowsCEMEMZ新账号
				414666753, // 桌面窗口管理器_DWM
				698760287, // 出星海wrcjs_sp4
				307432672, // 花l火
				3493108908034540, // S-1-5-21-1726115
				1158046953, // VistaChrome108
				727892489, // Windows2003R2
				1243577821, // hyq061221
				1330313497, // alan-CRL
				1190936866, // Qt小徐
				507658814, // 镜靛openforge
				310265955, // Ticki-Pigeon
				357779530, // 空巢老KriaStans
				456061336, // He1lo_Wor1d
				590491558, // Technology_him
				1948479703, // SYSTEM-Image-WIM
				3494362556140426, // start-windows
				1801064268, // 张星华-official
				390148573, // 西瓜xg_
				3461562834618602, // 辰东帅逼版
				1093536899, // 软萌可爱的洛神
				440662801, // 爱玩电脑的特兰克斯
				1029196202, // 杀猴专业户
				1283468503, // WinToGo-LZP
				3493105315613465, // van-豆射手
				42494833, // Happymax1212
				1015730693, // 玩了114514分钟mc
				484165196, // 351Workshop
				1624520869, // Lime青柠_QingNing
				1834260927, // Mo_Network
			],
			blacklist: [
				//- 组1/关键词:system -//
				493998035, // SYSTEM-RAMOS-ZDY
				702028797, // JERRY-SYSTEM
				631731585, // system-bootmgr-L
				501355555, // MS-SYSTEM
				1865727084, // SYSTEM-WinPE-CHD
				1162296488, // System3206
				1531948091, // SYSTEM_Win11_RE
				392697653, // System-i386
				313342814, // SYSTEM-GREE-GZN
				1546428456, // SYSTEM-WIN-EDGE
				631731585, // system-bootmgr-L
				501355555, // MS-SYSTEM
				2043088162, // SYSTEM-WINNT-ZDY
				601270898, // 601270898
				1531948091, // SYSTEM_Win11_RE
				3493083238894137, // 井_SYSTEM_火车迷
				1666981688, // System-Installer
				1546428456, // SYSTEM-WIN-24H2
				1162296488, // system4831
				1886348413, // SYSTEM-MEMZ-CAO
				1827307028, // SYSTEM_小影
				1744631001, // SYSTEM-SUYI-WIN
				699804375, // SYSTEM-MSDOS-ZDY
				3493298725456171, // SYSTEM-WIN-BY
				1431997122, // SYSTEM-Start
				669094468, // SYSTEM-TANGYUAN
				703051574, // SYSTEM-OOBE
				604076432, // SYSTEM-WIN32-PE
				//- 组2/关键词:bsod -//
				451475014, // STR-BSOD
				1511907771, // MEMZ-BSOD
				1975308950, // BSOD-MEMZ
				397847418, // 蓝屏钙BSOD
				1776025003, // 蓝瓶钙BSoD
				1007224506, // EXPLORER-BSOD
				1175873768, // BSOD-Winme
				2032637936, // BSOD-SYSTEM
				1933399514, // win11_BSOD
				1641461034, // DEEPIN_BSOD2_CMD
				3493293100894309, // SYSTEM-BSOD-ZFS
				1204666655, // 草方块BSOD
				1124857662, // Wininit_BSOD
				1306710323, // SHITOU_BSOD
				10828819, // BSoD正在玩
				1776025003, // 蓝瓶钙BSoD
				1266839139, // JHR_BSOD_MIMZ
				3461566410262700, // Windows_BSOD
				1061621085, // Vista-BSOD
				1007224506, // EXPLORER-BSOD
				1175873768, // BSOD-Winme
				665360141, // 微飞的BSOD
				3461578091399948, // Silversoft_BSOD
				1933399514, // win11_BSOD
				2043170695, // SYSTEM-BSOD-MEMZ
				//- 组3/关键词:memz -//
				21927744, // 360MEMZ
				1353783215, // MEMZ-Chrome
				412777837, // 注册表MEMZ
				457692234, // 奇怪的MEMZ
				298993710, // 注册表编辑器MEMZ
				413269076, // Cmd_MEMZ
				649846967, // Win7MEMZ-BX
				498912953, // AMD_MEMZ
				390483853, // 炒鸡360MEMZ
				362451533, // NC_Memz
				351258144, // 豆沙包MEMZ
				104657830, // 尚宜鼎MEMZ
				365129777, // DrAMA-MEMZ
				378430387, // 小李MEMZ
				392672572, // 123MEMZ
				1465447323, // 爱搞机的MEMZ
				1585476, // 23胡彬MEMZ
				1151195812, // 开朗的冰人MEMZ
				1089892994, // MEMZ-Windows11
				//- 组5/关键词:Aero -//
				435972058, // WindowsAero毛玻璃
				1452376557, // 没有Aero就没有灵魂
				1911529131, // Aero8m
				1321946754, // 没有Aero的Windows7
				//- 组5/关键词:setup -//
				589370259, // setup-windows安装
				2050076822, // Windows-Setup
				1549141274, // system-setup
				692755897, // Setup-Official
				483574120, // setup安装程序
				1031408618, // Deewin-Setup
				671918906, // win95setup
				//- 组6/关键词:Start -//
				524501321, // Start-hs888
				2030178992, // Start-BME
				//- 组7/关键词:Linux -//
				1933598970, // 白羊Linux
				603375808, // linux265
				1984449284, // Linux粉
				1093084152, // BSD-Linux
				67247219, // Linux_Newbie
				//- 组8/关键词:Windows -//
				1921195852, // Windows之家
				621857141, // Windows哥
				612743845, // 浩瀚星晨win
				1050145612, // windows11不会出
				3493092688661431, // 炸了的win10
				1601172780, // Windows毛玻璃解说233
				353290736, // Win11的粉丝_offical
				24821321, // Windows系统追更狂魔
				1833642992, // Win32_WinSxS_sys
				276817988, // 无人所知的windows12
				1613384176, // Aero-Windows311
				483675256, // Windows功能
				2009792251, // Windows-Lover
				3493125863508026, // 失败的Windows
				696040999, // Lemon_x64_Win11
				1225952698, // 叶一程哥哥win10
				601259909, // 星晨大海win_Acpn
				605857877, // 卖蓝屏钙的Win11
				1736839855, // SYSTEM-D-WIN
				3494364330330273, // 一只野生的win31
				1375459514, // 开心的Windows
				1340261135, // windows1球_启动中
				578278851, // 星晨天际win
				582129140, // Windows11-PPT
				1462538741, // 很屑的windows114514
				26284934, // win_小火龙
				1965090607, // 可乐Windows
				261016792, // Win10HOME
				1751934902, // Win-PowerShell
				248556377, // Win_Update
				2108200476, // Win_Threshold-10
				2017167096, // 喜欢Win8的MacPro
				694139497, // Windows_Tester_2
				1119522579, // 爱蓝屏的win10
				1724541085, // SYSTEM--win7
				1628906682, // 被win11吃掉的磁贴
				1509347075, // Windows12MC
				1261767230, // 一只屑win10
				1605910926, // -Windows-11-
				1326423111, // Win-Flash-Pro
				1497262975, // 不解风情のWin11
				1604146839, // windows田字牌电脑
				1463163459, // Windows81Metro
				687996269, // 喜欢Windows8的架空放送
				3493119670618871, // 小锅说Windows
				483345456, // Win10家庭版
				2101678528, // OS_Windows11_lzn
				1729734602, // bug32_Windows
				1222118214, // windows11电脑的cmd
				503289010, // Windows7の理系を行う
				403527839, // windows核心编程
				435227174, // Win10Win10是个屑
				509902447, // 爱折腾的Windows
				35833798, // Windows710
				3493133778160480, // SYSTEM-WIN11-PE
				169290582, // VMware的win7
				1385242199, // MS-SYSTEM-WIN
				383322806, // Win10Pro
				3546554428295778, // SYSTEM-WIN-DCR
				1283206843, // Windows被砍掉的Aero
				1935801783, // Windows软件倒腾师
				392012144, // 一只win8球
				1338015717, // windows_system
				1187162171, // Setup-Win11
				1009063496, // Windows的Windows
				3493118152280841, // mcdos-windows
				435462593, // 唐狐WIN
				1065194305, // 彩虹猫-win11
				//- 组9/关键词:KDE -//
				2008726064, // kde-yyds
				1989712487, // SYSTEM-WIN11-KDE
				//- 组10/关键词:Ubuntu -//
				668421393, // Ubuntu-PE
				586347926, // memz-ubuntu
				//- 自定义组/依照个人判断 -//
				1157923020, // 仗义的老班长
				401094700, // 旮沓曼_gt428
				356882513, // 被重组吃掉的虚拟桌面
				1151325757, // SYSTEM-OPS-LJY
				1304244190, // System-NBNB
				504179884, // MYB_CKLS
				1776456802, // 奇怪的MEMZ的小号
				1534842751, // 爱WinPE的MEMZ
				2112060594, // WINPE-SYSTEM
				1439352366, // SYSTEM-WINPE-EXE
				678414222, // Windows-regedit
				505199229, // SYSTEM_PHILI
				652188355, // 一个windows爱好者
				1863175083, // 半不了世的空城
				1736202379, // 胡桃玩VM
				1322183332, // WindowsCEMEMZ新账号
				414666753, // 桌面窗口管理器_DWM
				698760287, // 出星海wrcjs_sp4
				307432672, // 花l火
				3493108908034540, // S-1-5-21-1726115
				1158046953, // VistaChrome108
				727892489, // Windows2003R2
				1243577821, // hyq061221
				1330313497, // alan-CRL
				1190936866, // Qt小徐
				507658814, // 镜靛openforge
				310265955, // Ticki-Pigeon
				357779530, // 空巢老KriaStans
				456061336, // He1lo_Wor1d
				590491558, // Technology_him
				1948479703, // SYSTEM-Image-WIM
				3494362556140426, // start-windows
				1801064268, // 张星华-official
				390148573, // 西瓜xg_
				3461562834618602, // 辰东帅逼版
				1093536899, // 软萌可爱的洛神
				440662801, // 爱玩电脑的特兰克斯
				1029196202, // 杀猴专业户
				1283468503, // WinToGo-LZP
				3493105315613465, // van-豆射手
				42494833, // Happymax1212
				1015730693, // 玩了114514分钟mc
				484165196, // 351Workshop
				1624520869, // Lime青柠_QingNing
				1834260927, // Mo_Network
			]
		},
		{
			displayName: "穿越火线",
			displayIcon: "https://cf.qq.com/favicon.ico",
			keywords: ["穿越火线"],
			followings: [
				315554376, // 穿越火线官方号的 UID
				204120111, // CF农哥吊打小怪兽
				1083400219, // cf孙某
				398597510, // CF教父
				456180476, // CF猫七
				33281681, // CF威廉I黑化版
				440017413, // 穿越火线兴兴
				474595618, // 穿越火线赛事
			]
		},
		{
			displayName: "地下城与勇士",
			displayIcon: "https://dnf.qq.com/favicon.ico",
			keywords: ["地下城与勇士", "DNF"],
			followings: [
				102176172, // 地下城与勇士官方号的 UID
				90179837, // dnf老搬
				27253173, // DNF面码
				8233456, // DNF枪魂冰子
				332349, // DNF死兔子
				168090912, // 17173DNF官方
				353944511, // DNF手游假猪
			]
		},
		{
			displayName: "pubg",
			displayIcon: "https://pubg.qq.com/favicon.ico",
			keywords: ["绝地求生", "PUBG"],
			followings: [
				449704680, // 意识DT
				6528910, // 小贝的游戏食堂
				46708782, // 鲁大能
				50329485, // 吃鸡赛事
				552064023, // 吃鸡小表弟
			]
		},
		{
			displayName: "lol",
			displayIcon: "https://lol.qq.com/favicon.ico",
			keywords: ["英雄联盟", "LOL"],
			followings: [
				50329118, // 哔哩哔哩英雄联盟赛事官方号的 UID
				4895244, // LOL丶诺诺
				470840543, // LOL楠神李青
				178778949, // 英雄联盟
				50329220, // 哔哩哔哩LOL赛事直播
				302651406, // WBG英雄联盟分部
				652663378, // LOL小超梦
				23364027, // 英雄联盟-小白鸦
                268999208, //blg
                31536760, //edg
                299609985, //fpx
                29992385, //ig
                1141092059, //al
                676459665, //ra
                7294940, //we
                300634025, //tes
                302651406, //wbg
                390601281, //v5
                352760231, //lgd
                156619610, //jdg
                22797107, //omg
                257851644, //rng
			]
		},
		{
			displayName: "第五人格",
			displayIcon: "https://i0.hdslb.com/bfs/face/c4cbdafecef76836b94f2ba8832d0a04d709a499.jpg@100w_100h.webp",
			keywords: ["第五人格", "#第五人格", "互动抽奖 #第五人格"],
			followings: [
				211005705, // 网易第五人格手游官方号的 UID
				105022844, // 第五人格赛事
				452627895, // 狼队电竞第五人格分部
				1385707562, // TE溯第五人格分部
			]
		},
		{
			displayName: "蛋仔派对",
			displayIcon: "https://i0.hdslb.com/bfs/face/6afedb4d85ea6c4115f5548146dc8d7127886ca0.jpg@100w_100h.webp",
			keywords: ["蛋仔派对", "#蛋仔派对", "互动抽奖 #蛋仔派对"],
			followings: [
				1306451842, // 网易蛋仔派对官方号的 UID
			]
		},
        {
			displayName: "米の孙",
			displayIcon: "https://i0.hdslb.com/bfs/face/39494c159af8a961580a56803b32c4524177050e.jpg@96w_96h_1c_1s_!web-avatar-space-list.avif",
			keywords: ["鸣潮", "#鸣潮","#鸣潮全球公测开启","互动抽奖 #鸣潮"],
			followings: [
				1955897084, // 鸣潮官号
				382651856, // 战双
				3493090606188642, // 鸣潮先行公约
				1249567477, // 库街区
                1543330058, // 稷廷研究员
                1977702411, // 库洛
			]
		},
        {
			displayName: "麻辣鲜",
			displayIcon: "https://i0.hdslb.com/bfs/face/e2a7e30399860cfa7c1ec5c958ab9e519290e181.jpg@96w_96h_1c_1s_!web-avatar-space-list.avif",
			keywords: ["尘白禁区", "#尘白禁区","互动抽奖 #尘白禁区"],
			followings: [
				1409863611, // 尘白官号
				701179700, // 交错战线
				3546569016085336, // 蓝色原神
			]
		},
        {
			displayName: "1999",
			displayIcon: "https://i2.hdslb.com/bfs/face/6a1936d5cb5b315311fedbf2d4793c4d404cac83.jpg@96w_96h_1c_1s_!web-avatar-space-list.avif",
			keywords: ["重返未来1999", "#重返未来1999","互动抽奖 #重返未来1999"],
			followings: [
				1197454103, // 1999
			]
		},
        {
			displayName: "SB仙蛆",
			displayIcon: "https://i1.hdslb.com/bfs/face/3bfb9947e6398df15942a641ebfc99343a87aed5.jpg@96w_96h_1c_1s_!web-avatar-space-list.avif",
			keywords: ["人类不自由", "仙家军","百万仙军","利刃","乙解","麻辣仙人","粥粥人","弓弓","硬核不媚宅","幽默粥U","幽默粥u","幽默粥友","也有自己的生活","鹰晶","四字游戏","仙驱"],
			followings: [
				18751756, // 最靓休伯利安舰长
                197618851, // 金坷垃狗粮协会
                128154158, // 空灵大佐
                220281114, // nuk
                1044725703, //二观
                36579529, // 二观马甲
                492233743, // 伊蕾娜
                455857213, // 流星剑圣约书亚
                1825148722, // 米可nya
                3546575240432129, //末日兽绽放光芒

			]
		},
        {
			displayName: "BA",
			displayIcon: "https://i1.hdslb.com/bfs/face/f2635e09fe667d4ad29229c6ed0b5f4bdea09bd1.jpg@240w_240h_1c_1s_!web-avatar-space-header.avif",
			keywords: ["蔚蓝档案", "#蔚蓝档案","互动抽奖 #蔚蓝档案"],
			followings: [
				3493265644980448, // ba官号
                3493282386545566, // 小助理

			]
		},
	]

	/*
	防止代码因其他原因被执行多次
	这段代码出自 Via轻插件，作者谷花泰
	*/
	let key = encodeURIComponent('（改）B站成分检测器:主代码');
	if (window[key]) return;
	window[key] = true;
	console.log("【（改）B站成分检测器】即时\n运行中...")

	// 创建样式
	addCheckerStyle();

	// 空间动态api
	const cardApiUrl = 'https://api.bilibili.com/x/web-interface/card?mid='
	const spaceApiUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid='
	const followingApiUrl = 'https://api.bilibili.com/x/relation/followings?vmid='
	const searchIcon = `<svg width="12" height="12" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z" fill="currentColor"></path></svg>`
	const checked = {}
	const checking = {}
	const checkButton = `<div class="composition-checkable"><div class="composition-badge-control"><a class="composition-name-control" title="点击查询用户成分">${searchIcon}</a></div></div>`
	let dom = ''

	// 新版评论
	waitForKeyElements("div.content-warp div.user-info div.user-name[data-user-id]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.on('click', function () {
				checkComposition(element.attr("data-user-id"), element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 新版子评论
	waitForKeyElements("div > div.sub-user-info div.sub-user-name[data-user-id]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.on('click', function () {
				checkComposition(element.attr("data-user-id"), element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 新版含@的评论
	waitForKeyElements("span a.jump-link.user[data-user-id]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.on('click', function () {
				checkComposition(element.attr("data-user-id"), element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 新版用户卡片
	waitForKeyElements("div.user-card div.card-content div.card-user-info a.card-user-name", (element) => {
		if (element && element.length > 0 && element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
			let button = $(checkButton)
			element.parent().parent().after(button);
			button.css({ "margin": "8px 5px" });
			button.on('click', function () {
				checkComposition(element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], element, button.find(".composition-name-control"), element.parent().parent(), { "margin": "0 0 10px" })
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 新版动态用户卡片
	waitForKeyElements("div.bili-user-profile div.bili-user-profile-view div.bili-user-profile-view__info div.bili-user-profile-view__info__header a.bili-user-profile-view__info__uname", (element) => {
		if (element && element.length > 0 && element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
			let button = $(checkButton)
			element.parent().parent().parent().after(button);
			button.css({ "margin": "8px 5px" });
			button.on('click', function () {
				checkComposition(element.parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], element, button.find(".composition-name-control"), element.parent().parent().parent(), { "margin": "0 0 10px" })
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 旧版评论
	waitForKeyElements("div.reply-wrap > div > div.user a.name[data-usercard-mid]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.on('click', function () {
				checkComposition(element.attr("data-usercard-mid"), element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 旧版用户卡片
	waitForKeyElements("div.user-card div.info p.user a.name", (element) => {
		if (element && element.length > 0 && element.parent().parent().parent().find("a.like").attr("mid")) {
			let button = $(checkButton)
			element.parent().parent().parent().find("div.btn-box").after(button);
			button.css({ "margin": "8px 5px" });
			button.on('click', function () {
				checkComposition(element.parent().parent().parent().find("a.like").attr("mid"), element, button.find(".composition-name-control"), element.parent().parent().parent().find("div.btn-box"), { "margin": "0 0 10px" })
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 用户中心 关注列表、粉丝列表
	waitForKeyElements("div.content a.title span.fans-name", (element) => {
		if (element && element.length > 0) {
			if (element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1].length > 0) {
				let button = $(checkButton)
				button.css({ "overflow": "hidden", "margin-bottom": "10px" });
				element.parent().after(button)
				button.on('click', function () {
					checkComposition(element.parent().parent().find('a[href*="space.bilibili.com"]').attr('href').match(/space\.bilibili\.com\/(\d+)/)[1], element, button.find(".composition-name-control"), element.parent(), { "overflow": "hidden", "margin-bottom": "10px" })
				})
				if (GM_getValue('Auto') === 'true') button.click()
			}
		}
	});

	// 旧版包含@的评论
	waitForKeyElements("div.reply-wrap > div > p.text a[data-usercard-mid]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.on('click', function () {
				checkComposition(element.attr("data-usercard-mid"), element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 旧版 回复、纯@评论
	waitForKeyElements("span.text-con a[data-usercard-mid]", (element) => {
		if (element && element.length > 0) {
			let button = $(checkButton)
			element.after(button)
			button.on('click', function () {
				checkComposition(element.attr("data-usercard-mid"), element, button.find(".composition-name-control"), element, '')
			})
			if (GM_getValue('Auto') === 'true') button.click()
		}
	});

	// 添加标签
	function installComposition(rule, elemload, eleminst, elemcss) {
		let badge = $(`<div class="composition-checked"><div class="composition-badge">
			<a class="composition-name" title="点击查看已识别用户">${rule.displayName}</a>
			${rule.displayIcon ? (
				rule.displayIcon.match("https:") ? `<img src="${rule.displayIcon}" class="composition-icon">` :
					rule.displayIcon.match("data:") ? `<img src="${rule.displayIcon}" class="composition-icon">` :
						`<span class="composition-icon">${rule.displayIcon}</span>`
			) : ''}
			</div></div>`)
		badge.on('click', function () {
			showAllUser()
		})
		if (elemcss) badge.css(elemcss);
		if (eleminst) eleminst.after(badge);
		elemload.parent().parent().remove();
	}

	// 检查标签
	function checkComposition(id, element, elemload, eleminst, elemcss) {
		// 用户名称获取
		let eltx = element.text()
		let name = eltx.charAt(0) == "@" ? eltx.substring(1) : eltx

		elemload.text('等待...')

		if (checked[id] != undefined) {
			let found = checked[id]
			if (found.length > 0) {
				for (let rule of found) {
					console.log(`【（改）B站成分检测器】缓存\n检测到 ${name} ${id} 的成分为\n`, JSON.parse(JSON.stringify(found.map(it => { return { name: it.displayName, reason: it.reason, item: it.item, keyword: it.keyword, uid: it.uid, full: it.full } }))))
					installComposition(rule, elemload, eleminst, elemcss)
				}
			} else {
				console.log(`【（改）B站成分检测器】缓存\n检测到 ${name} ${id} 的成分为 无`)
				elemload.text('无')
				elemload.attr('title', '点击查看已查询过的用户')
				elemload.on('click', function () {
					showAllUser()
				})
			}
		} else if (checking[id] != undefined) {
			if (checking[id].indexOf(element) < 0)
				checking[id].push({
					element: element,
					elemload: elemload,
					eleminst: eleminst,
					elemcss: elemcss,
				});
		} else {
			checking[id] = [{
				element: element,
				elemload: elemload,
				eleminst: eleminst,
				elemcss: elemcss
			}];
			detectComposition(id, name, true)
				.then((found) => {
					if (found.length > 0) {
						value = found.map(it => ({
							name: it.displayName,
							img: it.displayIcon,
							reason: it.reason,
							item: it.item,
							keyword: it.keyword,
							uid: it.uid,
							full: it.full
						}))
						dom += `
						<div style="margin-top: 25px">
							<h3 style="margin:0">${name}</h3>
							<div id="tips" style="color: #fb7299;"><a href="https://space.bilibili.com/${id}/" target="_blank" style="color: #fb7299;">UID ${id}</a></div>
							`;
						for (let i = 0; i < value.length; i++) {
							let reason = value[i].keyword || value[i].uid
							let icon = value[i].img ? (
								value[i].img.match("https:") ? `<img src="${value[i].img}" class="composition-icon">` :
									value[i].img.match("data:") ? `<img src="${value[i].img}" class="composition-icon">` :
										`<span class="composition-icon">${value[i].img}</span>`
							) : ''
							dom += `
							<div style="margin-top: 10px;">
								<div class="composition-badge">
									<a class="composition-name">${value[i].name}</a>
									${icon}
								</div>
								<div style="margin-top: 8px;">
									<div class="composition-name">原因：${value[i].reason}</div>
									<div class="composition-name">匹配：${reason}</div>
								</div>
							</div>`;
						}
						dom += `</div>`

						let displayNameSet = new Set();
						found = found.filter(item => {
							if (displayNameSet.has(item.displayName)) {
								return false;
							} else {
								displayNameSet.add(item.displayName);
								return true;
							}
						});

						// 给所有用到的地方添加标签
						for (let elements of checking[id]) {
							if (found.length > 0) {
								for (let rule of found) {
									installComposition(rule, elements.elemload, elements.eleminst, elements.elemcss);
								}
							} else {
								elements.elemload.text('无');
								elements.elemload.attr('title', '点击查看已查询过的用户');
								elements.elemload.on('click', function () {
									showAllUser();
								});
							}
						}
					} else {
						for (let elements of checking[id]) {
							elements.elemload.text('无');
							elements.elemload.attr('title', '点击查看已查询过的用户');
							elements.elemload.on('click', function () {
								showAllUser();
							});
						}
					}
					delete checking[id];
					checked[id] = found
				})
				.catch((error) => {
					if (debug) console.error(`【（改）B站成分检测器】即时\n检测 ${name} ${id} 的成分失败`, error);
					for (let elements of checking[id]) {
						elements.elemload.text('重试')
						elements.elemload.attr('title', '点击重新查询此用户成分')
						elements.elemload.on('click', function () {
							checkComposition(id, elements.element, elements.elemload, elements.eleminst, elements.elemcss)
						})
					}
					delete checking[id];
				});
		}
	}
	dom = `<div id="Identified">
	<div id="tips">注:因判断关键词较为广泛，可能会出现识别错误的现象</div>
	<div id="tips">脚本还在测试阶段，喜欢的话还请留下你的评论</div>
	${dom}</div>`;
	function showAllUser() {
		Swal.fire({
			title: '已识别用户',
			html: dom,
			icon: 'info',
			heightAuto: false,
			scrollbarPadding: false,
			showCloseButton: true,
			confirmButtonText: '关闭'
		})
	}

	GM_registerMenuCommand("查看已检查的用户", () => {
		showAllUser();
	});
	GM_registerMenuCommand("手动输入 ID 检查", () => {
		uidChecker();
	});

	function request(option) {
		return new Promise((resolve, reject) => {
			let xmlHttpRequest = GM_xmlhttpRequest ? GM_xmlhttpRequest : GM.xmlHttpRequest
			xmlHttpRequest({
				method: 'get',
				...option,
				onload: (response) => {
					let res = JSON.parse(response.responseText);
					resolve(res);
				},
				onerror: (error) => {
					reject(error);
				},
			});
		});
	}

	function setting(conf_name, tips) {
		if (GM_getValue(conf_name) === 'true') {
			GM_setValue(conf_name, 'false');
			message.info('<span>已禁用 ' + tips + '<br/>刷新后生效，点我将刷新页面。</span>');
		} else {
			GM_setValue(conf_name, 'true');
			message.info('<span>已启用 ' + tips + '<br/>刷新后生效，点我将刷新页面。</span>');
		}
	}

	function uidChecker() {
		Swal.fire({
			title: '成分检测',
			imageUrl: 'https://www.bilibili.com/favicon.ico',
			imageAlt: `哔哩哔哩 干杯~`,
			imageWidth: 40,
			imageHeight: 40,
			input: 'number',
			inputAttributes: {
				autocapitalize: 'off'
			},
			allowOutsideClick: false,
			showCloseButton: true,
			confirmButtonText: '确定并查询',
			showLoaderOnConfirm: true,
			heightAuto: false,
			scrollbarPadding: false,
			text: '请输入要查询的 UID 号码',
			preConfirm: (uid) => {
				return new Promise(async (resolve, reject) => {
					// 检查用户卡片
					try {
						if (!uid) throw new CodeError("请输入完整的用户 UID")
						let cardRequest = await request({
							data: "",
							url: cardApiUrl + uid,
							headers: {
								"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
								"referer": "https://www.bilibili.com",
								"cookies": {
									"buvid3": generateBuvid3(),
									...document.cookies
								},
							},
						});
						let cardContent = cardRequest;
						if (cardContent.code === 0) {
							let card = cardContent.data.card
							detectComposition(card.mid, card.name, true)
								.then((found) => {
									let result = {
										mid: card.mid,
										name: card.name,
										level: card.level_info.current_level,
										face: card.face,
										sign: card.sign ? card.sign : '',
										official_title: card.Official.title ? card.Official.title : '',
										official_desc: card.Official.desc ? card.Official.desc : '',
										official_role: card.Official.role !== 0 ? (
											card.Official.role === 1 ? '个人认证 - 知名UP主' : card.Official.role === 2 ? '个人认证 - 大V达人' : card.Official.role === 3 ? '机构认证 - 企业' : card.Official.role === 4 ? '机构认证 - 组织' : card.Official.role === 5 ? '机构认证 - 媒体' : card.Official.role === 6 ? '机构认证 - 政府' : card.Official.role === 7 ? '个人认证 - 高能主播' : card.Official.role === 9 ? '个人认证 - 社会知名人士' : '未知认证角色(' + card.Official.role + ')'
										) : '',
										official_type: card.Official.type !== -1 ? (
											card.Official.type === 0 ? 'UP主认证' : card.Official.type === 1 ? '机构认证' : '未知认证类型(' + card.Official.type + ')'
										) : '',
										vip: card.vip.vipType !== 0 ? (
											card.vip.vipType === 1 ? '月度大会员' : card.vip.vipType === 2 ? '年度大会员(或以上)' : '未知会员(' + card.vip.vipType + ')'
										) : '',
										found: found.map(it => ({
											name: it.displayName,
											img: it.displayIcon,
											reason: it.reason,
											item: it.item,
											keyword: it.keyword,
											uid: it.uid,
											full: it.full
										}))
									}
									resolve(result)
								})
								.catch(error => {
									throw error
								})
						} else {
							throw new CodeError(`获取用户信息失败，错误码：${cardContent.code}`)
						}
					} catch (error) {
						resolve(null);
						Swal.showValidationMessage(`失败: ${error}`)
					}
				})
			},
		}).then((result) => {
			if (result.value) {
				let info = result.value
				let value = result.value.found;
				let final = '';
				for (let i = 0; i < value.length; i++) {
					let reason = value[i].keyword || value[i].uid
					let icon = value[i].img ? (
						value[i].img.match("https:") ? `<img src="${value[i].img}" class="composition-icon">` :
							value[i].img.match("data:") ? `<img src="${value[i].img}" class="composition-icon">` :
								`<span class="composition-icon">${value[i].img}</span>`
					) : ''
					final += `
					<div style="margin-top: 25px;">
						<div class="composition-badge">
							<a class="composition-name">${value[i].name}</a>
							${icon}
						</div>
						<div style="margin-top: 12px;">
							<div class="composition-name">原因：${value[i].reason}</div>
							<div class="composition-name">匹配：${reason}</div>
						</div>
					</div>`;
				}

				let level = info.level !== 0 ? (
					info.level === 1 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAQAAACdfrS+AAABdElEQVRIx+2WMU/CQBSAv5YagmiA1JEwMGBIhLi4O5jwDxz8Cf6C/gT+gLOjP8ORxaGJJkSHDtrVEDGkEmjiwLW05VpqPTZeh767d+99dy/X96oN+K9Yt9zlWPYwvNEUwD5o5lp4agBYVS45LExr5lxXNsC64j63wxYxOBbaRGpFHQouKAvN4X3DqludAFXBSN1vJddcJURBTRpH2HuYKftp0QY+ed4yBwt8Shnn1gPFTN3PCQD12FxNMgdLXnDywNTIRJKZncGyZQ/bw9TASrRCvbHxhSmDLcS7LXANzkSdmKmHjZlHcGvUnLF62BI7glujbLw/N6CYHNGLjFzRlTxszkXFXqF8KcqgG4v0lSheCVg50iSgzojlBi79VF1RzoNIJt+xJqpn38CDUPfCZPoFEpiATSXGeSyoh82UKU+pKBc/4f8TG2uPHV6lGQWRwuKXIOHf14dvuIEp+RSRLH8duA5wOxUXRxus/hv7VHcMGw1nv6qjZObRa1S2AAAAAElFTkSuQmCC"></img>' : info.level === 2 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAYAAAA3d3w1AAACU0lEQVRYw+2YQUsbQRTH/xk3k02DTbNZjKwe2hVSRNgemgopngvpQXvuR9Cv4Vfw1mNLT16EluJBKFQKimBbSqngNlQMarMsuqhhosFLErLZibsbN7oJ/Z+ykzdv5jfz9r2diSAEWtpdmQewCCAVgLv3CxOzryMhAdMBPArQ5WOhxXkCQD6gVfOrBwH7iwl1qDyAD3cEZdNYXMazVBYxQj33+WX9xfdj3dbW2LF3YYACgCdJFYqY9tVnOpV1gJGl3ZVse3yLQxTiEPXl3GsfNztKBN+LQUnU0SYAiLU2vBydxsN7GQDAF+OnYyV40pIqZtJTAIDi2SE+Hmx0bbdp7qCQyXUFwwvFphpQADAelz2BqYnR5m9FlDrajcdlV7v98zLeFD+5jtm6ATwRDKj+g/WbhLBNKEWHkZcmXbOjTO/3F1hemrw2KfRtKHZTxwb2HSueHfY+FCmJQkuqjvo3FpevrXE8sVrVU03r2Y6x2oXteSY9BS2p2qAKmZzta6HMTsKf7tf+bcNgFheOB8VqVXwu/wg/WOWSYfVoiwvHg1ourcNss73VOqaIEl4pz7n/bZo72D8vN59NZmH1aAsvRp4iTYe5H6t+oSiJdhy/9TX4dqzb5uIKRkm049mokMnh7d4aKpfMFe4mO+XlbKaIkiPJkJtkP54acKxWvbXw483FAWZ4HNxglm232uGWS+swmIVSxfAFpZ8eBFLHIvUT9O/2U66XhNFL+TnBc+aiReqXOUFff921tEYozgEwBwTqDwC9eWFav1fUACT6HOzrwsTs6RVchuSFILyhEwAAAABJRU5ErkJggg=="></img>' : info.level === 3 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAYAAAA3d3w1AAACL0lEQVRYw+2YzY7SUBSAv/4CwjCJKUPSYZLxZykZNiYs5AFcuNCFCx/BxTwMia+giQs3Jq7c6QMMkYVmJhOMMAuEcaYZUqS0uAEFWmhripSJZ9fm3HP73fN3TwViINVa6znwIiJzrw4Pdp8JMQH7BhQiNFmUp4xngQpwYw1shagNymOoCvByFRuElVxK4YG+jSoGD6YvP0yOOldusLhAAZTzWxTSaqg1OynFBSZWa61781ApWSIlS6GMB13jpydLYnShOC2P9m+yn00C8OHMcJ2El5S0DBU9C0DD6PO2cf7XevVuj52k4runKgnhwCZQAHsZlaOO/+nc2v6zRk8nFurtZVRfveMLk+ML03fPaQd4icg1lf9gmyZy3D4ol1Io57d8q6NfgYkdWDm/tbQobGwoRtXHYgdW7/YY2KP45ZgqCZS0jKux51LK0h4Xyz42tJ2Z54qepaRlZqCe3NZmbgvtvhX/cv++eYkxsD3hvKAG9oiPZ5fxBzOHNq9POp5wXlBvTjt8N1frsaU5pqcTPL6jeYbe57lcmMA9vauRVSXPy2oQqH/Sx1RJWDgb6ekEzasB5tD2hQvjqbX3sUVjg+U4rrAME34r62PtgLFvDGwsx3GHqTPCHNq8+3pO27Rom1aonKp3e6EhGkbf9U4YT9Cf5qfcIAVjZYkvCihiMM9ZjsPQcTX0ojD+mRP17691S3FyLA+B5jWBagInvytAtdZKAveBxAZD/QRqhwe7xi8cjegKCx350wAAAABJRU5ErkJggg=="></img>' : info.level === 4 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAYAAAA3d3w1AAAB7ElEQVRYw+2YMUvDQBiGn0isIUKxHUQUoYMFhXbUgqCjky6OCjq4+Rs6OvkHxFFBHB0qCK661EmxYFGHglqkQwTBUqVQh2s0bS4abVqT4guBj+Tycc/de7nvouAD1TLpdWAT6Pcg3b6ysLGk+ATsHhjxMGVStSQPA1NA5A/YBrxOqNahZoAjj6zQmiKjMDEn4mIOCtlftTNnbN8XUADxWYjGRBwecgb7pl1PLZNO2PzdH4WQ/rMOhXR374R0kd/RQ9ovfKfJrdigqWUYHBdx7tB5xKyKpSAxL+JSHs72WmvngXpsd0wogMExd1mGE5+xaQ+ZrPm+atcWsC7RP1jQpPq7dxpMr8mfhYcCDNbCR+Z/jXVMxRxUKz5cY6omNuLmjT0y6s5Whay7osBaSLRtxppHODEv4KxQqZXG0uf5MQBWPD+AsiGHk0FVK3BxEACwtzKcbsvhZFAnW/Bi/OE+Fo057yNXx/B01wiX3YHUKuhReeXdIajvZ0zVBJzsSq3YjykvhoArG/J1mN3tCFRrVlQ16JWcnWRwJpR1hjsOZhTcvVk2nEffCmcU2gNVurXEedtjpX6CvrSdct18MPygkC7rS1Kp/8y5BuJdVFElTSsuAg9dAnUD3H78MK1l0howCfQFGOoVuFAWNp7fASBUnBIuNastAAAAAElFTkSuQmCC"></img>' : info.level === 5 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAYAAAA3d3w1AAACO0lEQVRYw92YP2gTcRTHPxeuTZpyhdhBkFIbClX8c+BSyKAEtCLYRqcOugoWrYiDtE7iUqpboaVQKMUlAcHFfyB2ECoNlOjSqUNTSItbk0EMCmodLi13/JLcn9y1v+RNl1/ee7lPfu/9vvdOQQLbG+ceMOdTuowyyy1FErBtoMfHlKdUU/JOIAlEj4Ctx+d8YbUCdQVYCuAH3Fv/RUhNQVuH85iVecguWpaUgErBu93/CKevuov59QMed5lX9NDeOAMCVKwXojF3yaMxI65Rv3YPnRDRhCUVCFtW7r6Fc8PGdfqOsMVVbWgCUtPGdS4NL2835me2ctHeZ/lFVTCr7UMB6DedgZljzlyr3z8HMSPOSmyi21NFh+p+q3hQg1CbFK0aokWtZcFUqe8uosGD5fo+//7Ct1fCWaBK/9cPXLb36UsIYPKV4p/fvuiYfGC5jHHMS9djEc0Q4k/PRQ3rv2Qfn110pp1j7+Ds9YBPxWLB+jk1bcCZocbeW0umsNYEp+KbJxBPQHfcCgeQXxWhykV4/agJdKxUgJkk7G6JO1cNaiYJ39ePcMfiido68uEZbK6IcA8/W3fOLdSJ8zA0CV3HbUbTCw2ARY/V1pHeQXh6Esolezg3OzUyZX2oPvRSjGgQ1pyVpZvya+8IqMe2vzqL3N0yIGr13MINI1f+i7ueymU8aF9aHEwqE/SGMOXaDoClYIXazQQv3osu3zsPf0zfL8VRYKdFoHaA/MGIXHmvqAOdTQ6WVWb5+R9xhKJveDvHRQAAAABJRU5ErkJggg=="></img>' : info.level === 6 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAYAAAA3d3w1AAACEUlEQVRYw+2Yv0rDUBTGfykJ/oNiZofgoE7t4BDoIKK4+BQu7eLq6OiqT2BdHByc45TBoYMi+ABViBV0bERREB2uQ1rq9aZNYqONwQNnSDj3cL98X+4550IGTMCmgGcBIgU/AtAyAuwOmEkx5YL+KfkUUAHMEWCbTjnfmN4BVQFcAnCjNduGvT2YnIwX//4OBwewvx8uhZT0Pby7rkhsb29f85QKAuYVfVsWmAkVaZrBumHjxsdTIb4AjElvHAdaLfB9qNXiZdnaCuJbLajX48U5Trzcvh/th4ehMixJNH42x4knn0ajt6bd7h/nOL24x8foXP1ior1USP3n1/UsVBAK5NRyC0zP9O4mJsB1o+OOj5U6lm1ghgFra9Fxy8sKsHxI0TD+D4/vW7EYFOKwHnBpKVmupyfQtHA/OfkFYM2m/Ly7K4Oz7eAQKBZ77y4u/sCpuLMDq6swOyuDA2g0VFC+D9XqH5Di7S2srMDNjcpcGKj19WDNyBirVPrXke1tWU5dcKenMnNhoOLKcFAdW1yMHMv7N8FRM5Bpqg2oZQnheWp8uy2EbSdrqJNYak2wYchsDJJlEqZeX1O7SJEZOz+P94U8b/CXtywhLi+DfHGY6nqtFqghidXrCmNaZ4JuKlNulD08/GyFTTLBq3spax3WroC5HDUe5e4/tgHc5wTUNeBpX+4Vy5m4ghvOzjR4+QAXQvXJQUbjSgAAAABJRU5ErkJggg=="></img>' : info.level === 7 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAYAAAA3d3w1AAAB6klEQVRYw+2YMU/CQBTH/3ccRbQWSIlBmVx0MAFGSIyTm99AGRxMTJxd/AIujupg4uCgcXdxZnK0DA4mBickJpAAgialRZciLZQUpNhq+pZeL3cv9+v/vfTeI3CBFZPlPQCnNrm7juejm8QlYAUAiza6XGY65zMAMgAiDrAt2uwvwDSoDIAbAFGn1YtehMCl2Eh7ZElBebtmmKPa88oNUABGhhq0hxaT5aXeUGDzPtAQHck5DVGweZ9t68Y1CiCgnxBPBMzdhhHLRcBng0M54bNBxHIRzN2GETmcHWudLCm2gPVpGFj1d8dpPxqXH5ZOpta57njNPzij037Ldb25MsgWJNFSsX9pHpgH5oF5YB7YRMEIT0x/7NwK+9F1yVEw9aVteBf2pw1w3AqDeCaA8N0qqfWkThTMlk/4dvwOLsngi1MDHADI960+qM/GJ6oHDfcrppRUVHbqUIv9yplBVXbrUEoOKsalGMQTwTSP6kdNyA9KH5x4LhiUM4PS73MEjPDEcCk2VAFnAl43qmjX2pZwvw01VigSnoBOk6HC8rehTMGGrYfUYntgnnTgZEmBLCkTgdKf0+zMRKugH3urXCvTh6ALLUG0Zo7d7S/HwTrSbAEo/xOoZwCF7+zX+ooJADN/HOwuno82vwBHorjo0SYlWAAAAABJRU5ErkJggg=="></img>' : info.level === 8 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAYAAAA3d3w1AAACN0lEQVRYw+2YsU8TURzHP+96UOEKSDRpUyH+AZU0lsQOhsQBF6KTS+NW46COnUlcmEhQR1x0cGFhIsrA5GRkqIMxjSYiJoTUpHgpbe0V6p2DV+jRq+21lV613+WS997vl/vk933v5f0ELtDCROkBsAgo7eQREoahszK/470tXAK2DVzsYMopuSq5AlwDhrvAdr7TCWUTagZYb9cKndDc8j6ByKGjmHRygFf3Ri1jkvl94QYowDFUvRhpYaJ06aS/h8YNhsYNR8mbjWkld8tWrNb1xzkmrx4A8PaRwoeVMw2ThONFpu//AODzupfXD32260IxjWii0HDdXwGrQAEEo4dNgV2IHlthcqa+lYJNrqvWsyvnbMfvbO79MU7iH1UfrNcku/0HG+2lvhX7YP/bHhv06YRiWs39F7hcxh8uO87X1Xus8M2aJpooEIppFqjZpRyDPv1o7Psnj/srtvlEwR8u4wv+tMAB7H2Ua6AO8hJvFhX377GiKliLj5Hf9dRUzg7q5d1R1K0uVswfLjO3vG87l3w6TPrdcbiWFcZafEzcfJ61VK5dqFbvMbnRQRCI6LZzs0s5Vm+dpaj+7i4YOqIe3GlWqm0rVleiIkNHFFXBRmLEYsvThrIFy6SaO0/yux60rLB9MapbHjYSI2RSMpmU7AgqnRxwDGEXI8wX9PuTr9xG0rLCMHRc0eWy0ZQwmznbdLb91XWwihVvAF97nUZIGCbHlyMrmX3FCODtYbYSkJzf8RZ+AYGf0jxBU2CNAAAAAElFTkSuQmCC"></img>' : info.level === 9 ? '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAQAAACdfrS+AAABmklEQVRIx+WWvU4CQRCAvyVnKDARE60kocNGMJ6FEKOVCYlvoFBQUZhQ+gLaaay0MFQUJjwBldVVdkcAGymMxKOwg8L6LFiPI/fDAYeN0+zszmS/nZn9E3kWFf2CG2L+PgKzrp6LEGAfJAM5bisAeowc63PTNgL6RRXQczxPS8N0qbHnYWlSkloEqC+OwhNlt0T01CjjggRxj+LGXSxxEjMvKEJ0pNzTQKPo4lJAQ+N6YqyIRoPbGWHKr3IEQJYnR1wnABxPjGYBOHSZcNemtxyRTRFTtiuLl3U6LEz5U5gS9oStf5nG0GDNMGsWoyjPoCCN6rCXAtQvQGSfsr2U90uaR3mZvoa9GwV37LMlcdC2UAOuwq6ZyZAyfSu6MaqAsVhkaaq23gNtwMSgTFVG54Wq+TwyHrA4B7beDqcMACZwMKCCgbDuTf/3LGAaY6xaumElc0BFRjz3Oeu4GPt82XoGZbp0JCr4ORtbxGaKt9GuW3O4DedYvY9kFLWr90iCKauz7OvqjN6yMQJ6vIv86N+YCeOH5Ssv6vcP6ORXhje/gyUAAAAASUVORK5CYII="></img>' : '未知等级(' + info.level + ')'
				) : '<img style="height: 15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAbCAQAAACdfrS+AAABhklEQVRIx+2WvWrCUBTHf8oNFEFFBCcHh4wVt3bpWJC+Qh+hT5BH8AU6d+yLdMkiFDsIOhSapYMIKZRCHDrE5N6bnMTUxqX0n+me+/E7536ck8aU38q7477CsMfZbaMG2BvDSgPHCsDrcEHvaNqw6kAF3jUP1ScUq80IJ2OL2BKYsLpQE5Rg70OKa3rnCcrJ+ZVI6snaRiIKdoysyOLTow+sjaD1kbjAhkWpzbEAemlln5kOF3oCbABA17L1BFusDUsiwyFTTWpWgoKA8LSwXYqK7+KJIyvTP+wPw5SR09riC6sFllxgd4/TWfCzftgyfZwuQwO1Y3VgpnNMZAsDp1HPfBzY7Fa+npnqMjb8WqXLLbi0EquMit0ZEAEOrVwdUNlm32hN8In2p+anOBmlU1Mnl8IqbaOyFvP30+SotoWrvOZhoTAszKRVn5CwYAMD1kYMOqoN73nn54V12sTNS3oDAuEfxLqNs5ekXkbC91OVz28CN0J5rl8B68YU8M64Ojnsafb1DUgvcllHL7fFAAAAAElFTkSuQmCC"></img>'
				Swal.fire({
					title: info.name,
					imageUrl: info.face,
					imageAlt: `${info.name}的头像`,
					imageWidth: 200,
					imageHeight: 200,
					html: `<div id="Identified">
							<div id="tips">${info.sign}</div>
							<br/>
							<div id="tips" style="color: #fb7299;">${level}</div>
							<div id="tips" style="color: #fb7299;"><a href="https://space.bilibili.com/${info.mid}/" target="_blank" style="color: #fb7299;">UID ${info.mid}</a></div>
							<div id="tips" style="color: #fb7299;">${info.vip}</div>
							<br/>
							<div id="tips" style="color: #ffd700;">${info.official_type}</div>
							<div id="tips" style="color: #ffd700;">${info.official_role}</div>
							<div id="tips" style="color: #ffd700;">${info.official_title}</div>
							<div id="tips" style="color: #ffd700;">${info.official_desc}</div>
							<br/>
							<div id="tips">因判断关键词较为广泛，可能会出现识别错误的现象<br/>脚本还在测试阶段，喜欢的话还请留下你的评论</div>
							${final}
						</div>`,
					allowOutsideClick: false,
					showCloseButton: true,
					showConfirmButton: false,
					heightAuto: false,
					scrollbarPadding: false,
				})
			}
		})
	}

	if (GM_getValue('Auto') === 'true') {
		GM_registerMenuCommand('自动检测用户成分：✅ 已启用', function () {
			setting('Auto', '自动检测用户成分')
		});
	} else {
		GM_registerMenuCommand('自动检测用户成分：❌ 已禁用', function () {
			setting('Auto', '自动检测用户成分')
		});
	}

	function addStyle(id, tag, css) {
		tag = tag || 'style';
		let doc = document, styleDom = doc.getElementById(id);
		if (styleDom) styleDom.remove();
		let style = doc.createElement(tag);
		style.rel = 'stylesheet';
		style.id = id;
		tag === 'style' ? style.innerHTML = css : style.href = css;
		doc.getElementsByTagName('head')[0].appendChild(style);
	}

	function addCheckerStyle() {
		let color = "#574AB8";

		let swalcss = `
			.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:${color} transparent ${color} transparent }
			.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:${color};color:#fff;font-size:1em}
			.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px ${color}80 }
			.swal2-timer-progress-bar{width:100%;height:.25em;background:${color}33 }
			.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:${color};color:#fff;line-height:2em;text-align:center}
			.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:${color} }
			.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:${color}}
			div:where(.swal2-icon) {
				position: relative !important;
				box-sizing: content-box !important;
				justify-content: center !important;
				width: 5em !important;
				height: 5em !important;
				margin: 2.5em auto .6em !important;
				border: 0.25em solid !important;
				border-radius: 50% !important;
				font-family: inherit !important;
				line-height: 5em !important;
				cursor: default !important;
				user-select: none !important;
			}			

			[class^="composition-check"] {
				display: inline-block !important;
			}

			.composition-badge {
				display: inline-flex !important;
 				justify-content: center !important;
 				align-items: center !important;
				width: fit-content !important;
 				background: ${color}25 !important;
 				border-radius: 10px !important;
 				margin: 0 6px 0 6px !important;
 				font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif !important;
				font-weight: normal !important;
				cursor: pointer !important;
			}

			.composition-name {
 				line-height: 13px !important;
 				font-size: 13px !important;
				color: ${color} !important;
				padding: 2px 8px !important;
			}

			.composition-icon {
				color: ${color} !important;
				background: transparent !important;
				border-radius: 50% !important;
				width: 25px !important;
				height: 25px !important;
				border: 2px solid ${color}80 !important;
				margin: -6px !important;
				margin-right: 6px !important;
				display: flex !important;
				justify-content: center !important;
				align-items: center !important;
				font-size: 20px !important;
			}

			.composition-badge-control {
				display: inline-flex !important;
				justify-content: center !important;
				align-items: center !important;
				width: fit-content !important;
				background: #00000008 !important;
				border-radius: 10px !important;
				margin: 0 5px !important;
				font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
			}

			.composition-name-control {
				line-height: 13px !important;
				font-size: 12px !important;
				color: #00000050 !important;
				padding: 2px 8px !important;
			}
			`;

		// 先监听颜色方案变化 SweetAlert2-Default
		window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
			if (e.matches) {
				// 切换到暗色主题
				addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
			} else {
				// 切换到浅色主题
				addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
			}
			addStyle('SweetAlert2-User', 'style', swalcss);
		});

		// 再修改主题 SweetAlert2-Default
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			// 切换到暗色主题
			addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
		} else {
			// 切换到浅色主题
			addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
		}
		addStyle('SweetAlert2-User', 'style', swalcss);
	};

	// 准备好右上角的Toast提示
	let toast = Swal.mixin({
		toast: true,
		position: 'bottom-end',
		showConfirmButton: false,
		timer: 2700,
		heightAuto: false,
		scrollbarPadding: false,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer);
			toast.addEventListener('mouseleave', Swal.resumeTimer);
			toast.addEventListener('click', () => {
				window.location.reload(); // 刷新
			});
		}
	});

	// 提示信息
	const message = {
		success: (text) => {
			toast.fire({ html: text, icon: 'success' });
		},
		error: (text) => {
			toast.fire({ html: text, icon: 'error' });
		},
		warning: (text) => {
			toast.fire({ html: text, icon: 'warning' });
		},
		info: (text) => {
			toast.fire({ html: text, icon: 'info' });
		},
		question: (text) => {
			toast.fire({ html: text, icon: 'question' });
		}
	};

	class CodeError extends Error {
		constructor(message) {
			super(message);
			this.name = '';
		}
	}

	function generateBuvid3() {
		const uuid = () => {
			return 'xxxxxx'.replace(/[x]/g, function () {
				return Math.floor(Math.random() * 16).toString(16);
			});
		};
		const randomInt = Math.floor(Math.random() * 99999) + 1;
		const buvid3 = `${uuid()}${randomInt.toString().padStart(5, '0')}infoc`;
		return buvid3;
	}

	function detectComposition(id, name, single) {
		return new Promise(async (resolve, reject) => {
			try {
				// 存储检测结果的数组
				let found = [];

				// 设定请求
				let spaceRequest = request({
					data: "",
					url: spaceApiUrl + id,
					headers: {
						"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
						"referer": "https://www.bilibili.com",
						"cookies": {
							"buvid3": generateBuvid3()
						},
					},
				});

				let followingRequest = request({
					data: "",
					url: followingApiUrl + id,
					headers: {
						'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
					},
				});

				console.log(`【（改）B站成分检测器】即时\n正在检查用户 ${name} ${id} 的成分...`);

				// 检查用户是否在黑名单中
				try {
					for (let rule of checkers) {
						if (rule.blacklist) {
							for (let mid of rule.blacklist) {
								if (id.includes(mid)) {
									if (!found.includes(rule)) {
										found.push({
											...rule,
											reason: `黑名单`,
											keyword: "uid" + mid
										});
										if (single) break;
									}
								}
							}
						}
					}
				} catch (error) {
					if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 是否在命中名单失败`, error);
				}

				// 检查动态内容
				try {
					let spaceContent = await spaceRequest;
					if (spaceContent.code === 0) {
						let items = spaceContent.data.items;
						for (let rule of checkers) {
							if (rule.keywords) {
								for (let i = 0; i < items.length; i++) {
									let itemContent = items[i]
									let spacefull = items;
									let pendant = itemContent.modules?.module_author?.avatar?.pendant?.text
									let content = itemContent.modules?.module_dynamic?.desc?.text

									if (
										pendant && spacefull && content &&
										rule.keywords.find(keyword => JSON.stringify(pendant).includes(keyword)) &&
										rule.keywords.find(keyword => JSON.stringify(spacefull).includes(keyword)) &&
										rule.keywords.find(keyword => JSON.stringify(content).includes(keyword))
									) {
										found.push({
											...rule,
											full: items[i],
											reason: `空间动态`,
											item: content,
											keyword: rule.keywords.find(keyword => JSON.stringify(spacefull).includes(keyword))
										});
										if (single) break;
									} else if (spacefull && rule.keywords.find(keyword => JSON.stringify(spacefull).includes(keyword))) {
										found.push({
											...rule,
											reason: `用户空间内容(动态/简介/认证)`,
											item: items,
											keyword: rule.keywords.find(keyword => JSON.stringify(items).includes(keyword))
										});
										if (single) break;
									}
								}
							}
						}
					} else if (spaceContent.code === -352) {
						if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 的空间动态失败，已触发哔哩哔哩风控，错误码：${spaceContent.code}`);
					} else {
						if (found.length > 0) {
							if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 的空间动态失败，错误码：${spaceContent.code}`);
						} else {
							reject(new CodeError(`获取空间动态失败，错误码：${spaceContent.code}`));
						}
					}
				} catch (error) {
					if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 的空间动态失败`, error);
				}

				// 检查关注列表
				try {
					let followingContent = await followingRequest;
					if (followingContent.code === 0) {
						let following = followingContent.data.list.map(it => it.mid)
						for (let rule of checkers) {
							if (rule.followings) {
								for (let mid of rule.followings) {
									if (following.includes(mid)) {
										if (!found.includes(rule)) {
											found.push({
												...rule,
												uid: "uid" + mid,
												reason: `关注列表`
											});
											if (single) break;
										}
									}
								}
							}
						}
					} else if (followingContent.code === 22115) {
						console.warn(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 的关注列表失败，对方已关闭展示关注列表，错误码：${followingContent.code}`);
					} else if (followingContent.code === -352) {
						if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 的关注列表失败，已触发哔哩哔哩风控，错误码：${followingContent.code}`);
					} else {
						if (found.length > 0) {
							if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 的关注列表失败，错误码：${followingContent.code}`);
						} else {
							reject(new CodeError(`获取关注列表失败，错误码：${followingContent.code}`));
						}
					}
				} catch (error) {
					if (debug) console.error(`【（改）B站成分检测器】即时\n获取 ${name} ${id} 的关注列表失败`, error);
				}

				// 返回检测结果
				if (found.length > 0) {
					console.log(`【（改）B站成分检测器】即时\n检测到 ${name} ${id} 的成分为\n`, JSON.parse(JSON.stringify(found.map(it => { return { name: it.displayName, reason: it.reason, item: it.item, keyword: it.keyword, uid: it.uid, full: it.full } }))))
				}
				resolve(found);
			} catch (error) {
				if (debug) console.error(`【（改）B站成分检测器】即时\n检测 ${name} ${id} 的成分失败`, error);
				reject(error)
			}
		})
	}

	function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
		var targetbadges, btargetsFound;
		if (typeof iframeSelector == "undefined")
			targetbadges = $(selectorTxt);
		else
			targetbadges = $(iframeSelector).contents()
				.find(selectorTxt);
		if (targetbadges && targetbadges.length > 0) {
			btargetsFound = true;
			targetbadges.each(function () {
				var jThis = $(this);
				var alreadyFound = jThis.data('alreadyFound') || false;
				if (!alreadyFound) {
					var cancelFound = actionFunction(jThis);
					if (cancelFound) {
						btargetsFound = false;
					} else {
						jThis.data('alreadyFound', true);
					}
				}
			});
		} else {
			btargetsFound = false;
		}
		var controlObj = waitForKeyElements.controlObj || {};
		var controlKey = selectorTxt.replace(/[^\w]/g, "_");
		var timeControl = controlObj[controlKey];
		if (btargetsFound && bWaitOnce && timeControl) {
			clearInterval(timeControl);
			delete controlObj[controlKey]
		} else {
			if (!timeControl) {
				timeControl = setInterval(function () {
					waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
				}, 300);
				controlObj[controlKey] = timeControl;
			}
		}
		waitForKeyElements.controlObj = controlObj;
	}
})