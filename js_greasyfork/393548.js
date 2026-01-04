// ==UserScript==
// @name		智龙迷城战友网增强
// @namespace	http://www.mapaler.com/
// @version		2.5.5
// @description	地下城增加技能图标
// @author		Mapaler <mapaler@163.com>
// @copyright	2019+, Mapaler <mapaler@163.com>
// @icon		https://pad.skyozora.com/images/egg.ico
// @match		*://pad.skyozora.com/*
// @require		https://unpkg.com/opencc-js@1.0.5/dist/umd/full.js
// @resource	jquery	https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @resource	icons	https://www.gitlink.org.cn/repo/mapaler/fix-pad_skyozora_com/raw/branch/v2.5.0/icons-symbol.svg
// @grant		GM_getResourceText
// @grant		GM_registerMenuCommand
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		unsafeWindow
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/393548/%E6%99%BA%E9%BE%99%E8%BF%B7%E5%9F%8E%E6%88%98%E5%8F%8B%E7%BD%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/393548/%E6%99%BA%E9%BE%99%E8%BF%B7%E5%9F%8E%E6%88%98%E5%8F%8B%E7%BD%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(async function() {
	'use strict';
	const svgNS = "http://www.w3.org/2000/svg"; //svg用的命名空间

	let mobileMode = /\bmobile\b/i.test(navigator.userAgent);
	
	let T2S = GM_getValue("traditional-to-simplified") ?? true; //繁转简
	let ConciseMode = GM_getValue("dungeon-style-concise") ?? true; //简洁模式
	let OpenAllDetails = GM_getValue("open-all-details") ?? false; //自动展开所有详情
	let storeAvatar = GM_getValue("local-store-card-avatar") ?? true; //数据库里储存怪物头像

	//监听head的加载，代码来源于 EhTagSyringe
	const headLoaded = new Promise(function (resolve, reject) {
		if(document.head && document.head.nodeName == "HEAD") {
			console.debug("已经有 head");
			resolve(document.head);
		}else{
			console.debug("开始监听 head");
			//监听DOM变化
			let observer = new MutationObserver(function(mutations) {
				for (const mutation of mutations) {
					//监听到HEAD 结束
					if(mutation.target.nodeName === "HEAD") {
						console.debug("已监听到 head");
						observer.disconnect();
						resolve(mutation.target);
						break;
					}
				}
			});
			observer.observe(document, {childList: true, subtree: true, attributes: true});
		}
	});

	//head加载后添加国内的JQ源
	headLoaded.then(head=>{
		let jqElement = document.querySelector('script[src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"]');
		if (jqElement) {
			jqElement.src = "https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js";
			console.debug('替换外链 jQuery 路径');
		} else {
			console.debug('直接内嵌 jQuery');
			[
				'jquery',
			].forEach(resName=>{
				let scriptText = GM_getResourceText(resName);
				if (!scriptText) return;
				const script = document.createElement("script");
				script.id = resName;
				script.type = "text/javascript";
				script.innerHTML = scriptText;
				head.appendChild(script);
			});
		}
	});

	//大数字缩短长度
	Number.prototype.bigNumberToString = /^(zh|ja|ko)\b/i.test(navigator.language) ?
	(function() { //中、日、韩习惯
		const negative = this < 0;
	
		let numTemp = negative ? Math.abs(this) : this.valueOf();
		if (!numTemp) return "0";
		const grouping = 1e4;
		const unit = ['','萬','億','兆','京','垓'];
		const numParts = [];
		do {
			numParts.push(numTemp % grouping);
			numTemp = Math.floor(numTemp / grouping);
		} while (numTemp > 0 && numParts.length < (unit.length - 1))
		if (numTemp > 0) {
			numParts.push(numTemp);
		}
		let numPartsStr = numParts.map((num, idx) => {
			if (num > 0) {
				return (num < 1e3 ? "零" : "") + num + unit[idx];
			} else
				return "零";
		});
	
		numPartsStr.reverse(); //反向
		let outStr = numPartsStr.join("");
		outStr = outStr.replace(/(^零+|零+$)/g, ''); //去除开头的零
		outStr = outStr.replace(/零{2,}/g, '零'); //去除多个连续的零
		return (negative ? "-" : "") + outStr;
	}) :
	(function() { //英语习惯
		const negative = this < 0;
	
		let numTemp = negative ? Math.abs(this) : this.valueOf();
		if (!numTemp) return "0";
		const grouping = 1e3;
		const unit = ['', 'K', 'M', 'G', 'T', 'P'];
		const numParts = [];
		do {
			numParts.push(numTemp % grouping);
			numTemp = Math.floor(numTemp / grouping);
		} while (numTemp > 0 && numParts.length < (unit.length - 1))
		if (numTemp > 0) {
			numParts.push(numTemp);
		}
		let numPartsStr = numParts.map((num, idx) => {
			if (num > 0) {
				return num + unit[idx];
			} else
				return "";
		});
	
		let outStr = numPartsStr.filter(Boolean).reverse().join(" ");
		return (negative ? "-" : "") + outStr;
	});
	
	const bootstrap = function(){
		if (!mobileMode) {
			document.styleSheets[0].deleteRule(1);
			document.styleSheets[0].deleteRule(0);
		}
		
		//插入总svg
		const svgText = GM_getResourceText("icons"); //将svg文本读取出来
		if (svgText) {
			const parser = new DOMParser();
			const iconsSvg = parser.parseFromString(svgText, "image/svg+xml"); //转换成svg文档
			const svgDoc = iconsSvg.documentElement;
			svgDoc.setAttribute("class","hide");
			const symbols = Array.from(svgDoc.querySelectorAll('symbol'));
			const [maxWidth, maxHeight] = symbols.reduce(([maxWidth, maxHeight], symble)=>{
				const img = symble.querySelector('image');
				return [
					Math.max(maxWidth, img.width.baseVal.value),
					Math.max(maxHeight, img.height.baseVal.value)
				];
			},[0,0]);
	
			symbols.forEach(symble=>{
				const img = symble.querySelector('image');
				symble.setAttribute('viewBox', [(maxWidth - img.width.baseVal.value) / -2, (maxHeight - img.height.baseVal.value) / -2, maxWidth, maxHeight].join(" "));
			});
	
			document.body.insertAdjacentElement("afterbegin", svgDoc); //插入body
		}

		const styleDom = document.head.appendChild(document.createElement("style"));
		styleDom.textContent = `
* {
	font-family: "Microsoft Yahei", "Microsoft JhengHei", "Source Han Sans", Arial, Helvetica, sans-serif, "Malgun Gothic", "맑은 고딕", "Gulim", AppleGothic !important;
	color: white;
	user-select: auto !important;
}
#container .item2 {
	display: none;
}
body {
	background:#222 ;
}
.hide {
	display: none;
	postion: absolute;
}
.svg-icon {
	width: 2em;
	height: 2em;
	vertical-align: text-bottom;
}
.svg-icon text {
	font-family: "FOT-Kurokane Std EB", "Arial Black" !important;
	font-size: 1.1em;
	font-weight: bold;
	text-shadow: 0 0 1px black,1px 1px 1px black,-1px -1px 1px black;
    text-anchor: middle;
    /* 文本水平居中 */
    dominant-baseline: middle;
    /* 文本垂直居中 */
}
.tooltip[href*="pets/"][data-id]::after
{
	display: inline-block;
	vertical-align: middle;
	content: "No."attr(data-id)"\\000A"attr(data-name);
	white-space: pre;
	line-height: 1em;
}
.tooltip[href$="pets/"]::after,
.tooltip:not([data-id])::after
{
	content: unset;
}
tr[align="center"] .tooltip[href*="pets/"]::after
{
	display: block;
	max-width: 70px;
	white-space: pre-wrap;
}
.paddf-link:link {
	text-decoration: underline;
}
.enhance-board {
	border-collapse: collapse;
	background-color: #532;
}
.enhance-board tr>td
{
	width: 12px;
	height: 12px;
}
.enhance-board tr:nth-of-type(2n+1)>td:nth-of-type(2n+1),
.enhance-board tr:nth-of-type(2n)>td:nth-of-type(2n)
{
	background-color: rgba(0,0,0,0.4);
}
.enhance-board .orb-true::before
{
	display: block;
	content: "";
	background-color: white;
	width: 12px;
	height: 12px;
	border-radius: 50%;
}
details summary{
	cursor: pointer;
}
.skill-detail summary{
	font-size:14px;
	color: #99E8FF;
}
.board-position summary{
	width: max-content;
	padding: 0 5px;
	border-radius: 5px;
	background-color: #F252A1;
}
`;
		// 将和制汉字转换为简体中文（中国大陆）
		const converterJP2CN = OpenCC.Converter({ from: 'jp', to: 'cn' });
		// 将和制汉字转换为繁体中文（中国香港）
		const converterJP2HK = OpenCC.Converter({ from: 'jp', to: 'hk' });
		// 将繁体中文（香港）转换为简体中文（中国大陆）
		const converterHK2CN = OpenCC.Converter({ from: 'hk', to: 'cn' });
		// 将类型的假名转换为繁体中文（中国香港）
		const converterKANA2CN = OpenCC.CustomConverter([
			['のみ', '限定'],
			['タイプ', '類型'],
			['キャラ', '角色'],
			['マシン', '機械'],
			['ドラゴン', '龍'],
			['バランス', '平衡'],
			['リーダー', '隊長'],
			['助っ人', '輔助'],
			['ハンター', '獵人'],
			['ラッシュ', 'Rush '],
			['コロシアム', 'Coliseum '],
			['ボス', 'BOSS '],
			['ノーコン', '無法續關'],
			['チーム', '隊伍'],

			['ヘラ', '赫拉赫拉'],
			['ゼウス', '宙斯'],
			['アテナ', '雅典娜'],
			['からくり', '機關'],
			['ノア', '諾亞'],

			['の', '的'],
			['と', '與'],
		]);

		//本地数据库储存头像;
		if (storeAvatar) redirectLocalCardAvatar();

		//所有带名字的头像添加名字
		const cardAvatars = [...document.body.querySelectorAll('.tooltip[href^="pets/"]')];
		cardAvatars.forEach(avatar=>{
			let titleReg = /(\d+)\s*\-\s*(.+)/i.exec(avatar.title);
			if (titleReg) {
				avatar.dataset.id = titleReg[1];
				avatar.dataset.name = T2S ? converterHK2CN(titleReg[2]) : titleReg[2];
			}
		})
		
		const StageInfo = document.querySelector('#StageInfo');
		//地下城页面
		if (/^\/stage\b/.test(location.pathname) && StageInfo)
		{
			//====去除禁止复制内容的限制====
			let unbidFunctionStr = "$(`#${this.id}`).unbind(); this.removeAttribute('oncopy'); this.removeAttribute('oncut'); this.removeAttribute('onpaste');";
			StageInfo.setAttribute("oncopy", unbidFunctionStr);
			StageInfo.setAttribute("oncut", unbidFunctionStr);
			StageInfo.setAttribute("onpaste", unbidFunctionStr);

			const pcPage = document.querySelector("#wrapper");
			if (ConciseMode) { //添加精简模式的CSS
				const styleConcise = document.createElement("style");
				styleConcise.textContent = pcPage
? `.ats-skyscraper-wrapper,
.fb-share-button,
.twitter-tweet-button,
.twitter-share-button,
body > :not(#wrapper),
#wrapper > :not(table),
#wrapper > table:not(:nth-of-type(3)),
#wrapper > table:nth-of-type(3) > tbody > tr > td:nth-of-type(n+2),
#wrapper > table:nth-of-type(3) > tbody > tr > td:first-of-type > #fb-root,
#wrapper #StageInfo ~ *
{
	display: none !important;
}
#wrapper {
	width: 100%;
	padding: 0;
}
#wrapper > table:nth-of-type(3) {
	width: auto;
}`
: `body > :not(.content),
.content>p:empty,
.content>center,
#StageInfo>br,
#StageInfo>div:empty
{
	display: none !important;
}
`
;
				document.head.appendChild(styleConcise);
			}
			let pageTitle = document.title;
			const JpHTMLConverter = T2S ? converterJP2CN : converterJP2HK;
			pageTitle = pageTitle.replace(/^(.+)\s*-\s*(.+)\s*-\s*Puzzle & Dragons 戰友系統及資訊網/,
				(match, p1, p2) => `${converterKANA2CN(JpHTMLConverter(p2))} - ${converterKANA2CN(JpHTMLConverter(p1))}` );
			document.title = pageTitle;
			const stageTitle = StageInfo.querySelector(":scope>h2");
			if (stageTitle)
			{
				//和制汉字到繁体
				const stage1 = stageTitle.querySelector("a");
				stage1.textContent = converterKANA2CN(stage1.textContent);
				const stage2 = Array.from(stageTitle.childNodes).find(node=>node.nodeName == "#text");
				stage2.nodeValue = converterKANA2CN(stage2.nodeValue);

				//和制汉字到中文
				stageTitle.lang = 'jp';
				const HTMLConvertHandler = OpenCC.HTMLConverter(JpHTMLConverter, stageTitle, 'jp', T2S ? 'zh-CN' : 'zh-HK');
				HTMLConvertHandler.convert();
			}
			//提供固定队伍可跳转到PADDashFormation
			const stageTeam = StageInfo.querySelector(":scope>div");
			if (stageTeam?.textContent?.includes("本地下城採用系統預設隊伍"))
			{
				const cardAvatars = Array.from(stageTeam.querySelectorAll(':scope>a[href^="pets/"]'));
				const cardIds = cardAvatars.map(avatar=>{
					let hrefReg = /pets\/(\d+)/i.exec(avatar.href);
					return hrefReg?.[1] || 0;
				});
				console.log(cardAvatars, cardIds);

				const formationOutObj = {f: [[cardIds.map(id=>id>0?[id,99]:null), []]], v: 4};
				const PADDFurl = new URL("https://mapaler.github.io/PADDashFormation/solo.html");
				PADDFurl.searchParams.set("d", JSON.stringify(formationOutObj));
				
				const PADDFlink = document.createElement("a");
				PADDFlink.className = "paddf-link";
				PADDFlink.href = PADDFurl;
				PADDFlink.target = "_blank";
				PADDFlink.textContent = "PADDashFormation 组队链接";
				stageTeam.appendChild(PADDFlink);
			}

			const stageDetail = StageInfo.querySelector(":scope>table:nth-of-type(2)");
			if (stageDetail)
			{
				//HP和防御条
				const centerRows = stageDetail.tBodies[0].querySelectorAll(":scope>tr[align=\"center\"]:not(:first-child)");
				for (let tr of centerRows)
				{
					let tds = tr.querySelectorAll(":scope>td:not([rowspan])");
					if (tds.length>5)
					{
						domBigNumToString(tds[0]); //血量
						domBigNumToString(tds[3]); //攻击
						domBigNumToString(tds[5]); //防御
					}
				}

				//先制数字
				const leftRows = stageDetail.tBodies[0].querySelectorAll(":scope>tr[align=\"left\"]");
				for (let tr of leftRows)
				{
					let skillNames = tr.querySelectorAll(":scope .skill");
					for (let skillName of skillNames) {
						if (skillName.nextSibling) {
							domBigNumToString(skillName.nextSibling);
							domAddIcon(skillName.nextSibling); //技能加图标
						}
					}

					//伤害数字
					let skillDamages = tr.querySelectorAll(":scope .skill_demage");
					for (let skillDamage of skillDamages)
					{
						domBigNumToString(skillDamage);
					}
				}
			}

			//强化版面位置的显示
			const boardsNode = Array.from(StageInfo.querySelectorAll('[onclick^="open_menu"]+[id^="skill"]'));
			boardsNode.forEach(node=>{
				node.classList.add("boards");
				const boardDataCells = node.querySelectorAll(":scope table tr:nth-of-type(2)>td");
				boardDataCells.forEach(cell=>{
					const data = cell.textContent.split('\n').map(row=>Array.from(row).map(o=>Boolean(o=='●')));
					const boardTable = createBoard(data);
					cell.innerHTML = '';
					cell.appendChild(boardTable);
				})
				if (node.nextElementSibling.nodeName == "BR") {
					node.nextElementSibling.remove();
				}
			});
			function createBoard(data) {
				const table = document.createElement("table");
				table.className = `enhance-board`;
				for (let ri=0; ri<data.length; ri++)
				{
					const orbsRow = data[ri];
					const row = table.insertRow();
					for (let ci=0; ci<orbsRow.length; ci++)
					{
						const cell = row.insertCell();
						cell.className = `orb-${orbsRow[ci]}`;
					}
				}
				return table;
			}

			//直接打开所有隐藏内容
			const hiddenSkillsSwitch = Array.from(document.body.querySelectorAll("[onclick^=open_]"));
			hiddenSkillsSwitch.forEach(i=>i.remove()); //删除所有开关
			
			const hiddenSkills = Array.from(document.querySelectorAll('[id^="skill"]')).filter(i=>i.style.display);
			hiddenSkills.forEach(i=>{
				const boardPos = /skill(\d+_){4}\d+/.test(i.id);
				const detail = document.createElement("details");
				detail.className = boardPos ? "board-position" : "skill-detail";
				detail.open = OpenAllDetails ? true : boardPos;
				detail.id = i.id;
				const summary = detail.appendChild(document.createElement("summary"));
				summary.textContent = boardPos ? "生成位置" : "敌人技能资料" ;

				detail.append(...i.childNodes);
				i.parentNode.insertBefore(detail, i);
				i.remove();
			});
		}
		//新闻页面，主要是针对于8人本页面
		if (/^\/news\//.test(location.pathname))
		{
			const contentTables = Array.from(document.body.querySelectorAll(".content>table"));
			for (let table of contentTables)
			{
				const rows = Array.from(table.rows).slice(1);
				for (let tr of rows)
				{
					domBigNumToString(tr.cells[1]);
				}
			}
		}

		//====转简体====
		if (T2S) {
			document.title = converterHK2CN(document.title);
			// 设置转换起点为根节点，即转换整个页面
			const rootNode = document.documentElement;
			document.body.lang = 'zh-HK';
			// 将所有 zh-HK 标签转为 zh-CN 标签
			const HTMLConvertHandler = OpenCC.HTMLConverter(converterHK2CN, rootNode, 'zh-HK', 'zh-CN');
			HTMLConvertHandler.convert(); // 开始转换  -> 汉语
		}
	}

	function domBigNumToString(dom)
	{
		if (!(dom instanceof Node)) return;
		const regOriginal = /\b-?\d+(?:,\d{3})*\b/g;

		if (dom.nodeType === Node.TEXT_NODE) {
			textNodeConvertNumber(dom);
		} else {
			let nodes = Array.from(dom.childNodes);
			nodes = nodes.filter(node=>node.nodeType === Node.TEXT_NODE);
			for (let textNode of nodes)
			{
				textNodeConvertNumber(textNode);
			}
		}
		//在纯文本node内转换数字
		function textNodeConvertNumber(textNode) {
			textNode.nodeValue = textNode.nodeValue.trim()
				.replace(new RegExp(regOriginal), match=>{
					return parseInt(match.replaceAll(",",""), 10).bigNumberToString();
				});
		}
	}

	SVGSVGElement.prototype.appendSymbleIcon = function(id) {
		const use = document.createElementNS(svgNS,'use');
		use.setAttribute("href",`#i-${id}`);
		this.appendChild(use);
		return use;
	}

	function domAddIcon(dom)
	{
		//创建svg图标引用的svg
		function svgIcon(id) {
			const svg = document.createElementNS(svgNS,'svg');
			svg.setAttribute("class","svg-icon");
			svg.appendSymbleIcon(id);
			return svg;
		}
		function attrIndex(str) {
			switch (str) {
				case '火': return 0;
				case '水': return 1;
				case '木': return 2;
				case '光': return 3;
				case '暗': return 4;
			}
		}
		function typeIndex(str) {
			switch (str) {
				case '進化用': return 0;
				case '平衡': return 1;
				case '體力': return 2;
				case '回復': return 3;
				case '龍': return 4;
				case '神': return 5;
				case '攻擊': return 6;
				case '惡魔': return 7;
				case '機械': return 8;
				case '特別保護': return 9; //已经没有这个type了
				case '能力覺醒用': return 12;
				case '強化合成用': return 14;
				case '販賣用': return 15;
			}
		}
		//用于查找下一个文本节点
		function nextTextNode(node) {
			const nextNode = node.nextSibling;
			if (nextNode == null ||
				nextNode.nodeType === Node.TEXT_NODE && nextNode.length > 0) {
				return nextNode;
			} else {
				return nextTextNode(nextNode);
			}
		}
		if (dom.nodeType === Node.TEXT_NODE) {
			let res;
			if (res = /異常狀態（如毒、威嚇、破防）無效化/.exec(dom.nodeValue)) {
				dom.parentElement.insertBefore(svgIcon('abnormal-state-shield'), dom);
			}
			if (res = /HP在上限\d+%或以上的話，受到致命傷害時，將會以(\d+)(點|%)HP生還/.exec(dom.nodeValue)) {
				const superResolve = res[2] == '%';
				const svg = svgIcon(superResolve ? 'super-resolve' : 'resolve');
				if (superResolve) {
					const text = document.createElementNS(svgNS,'text');
					text.textContent = res[1];
					text.setAttribute("x", "50%");
					text.setAttribute("y", "50%");
					text.setAttribute("fill", "white");
					svg.appendChild(text);
				}
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /單一傷害值.+點以上的傷害(吸收|無效)/.exec(dom.nodeValue)) {
				const svg = svgIcon('shield');
				const frontIcon = svg.appendSymbleIcon(`damage-${res[1]=='吸收'?'absorb':'void'}`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /將\s*(\d+)COMBO\s*或以下時所造成的傷害全部吸收/.exec(dom.nodeValue)) {
				const svg = svgIcon('combo-absorb');
				svg.appendSymbleIcon('recover');
				const text = document.createElementNS(svgNS,'text');
				text.textContent = res[1];
				text.setAttribute("x", "50%");
				text.setAttribute("y", "50%");
				text.setAttribute("fill", "#F7C");
				svg.appendChild(text);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /受到的(.*)屬性傷害減少(\d+)%/.exec(dom.nodeValue)) {
				const all = !Boolean(res[1]);
				const attrs = res[1].split("、");
				for (let i = 0; i < attrs.length; i++) {
					const attr = attrIndex(attrs[i]);
					const svg = svgIcon('shield');
					if (all) {
						const text = document.createElementNS(svgNS,'text');
						text.textContent = res[2];
						text.setAttribute("x", "50%");
						text.setAttribute("y", "50%");
						text.setAttribute("fill", "white");
						svg.appendChild(text);
					} else {
						const frontIcon = svg.appendSymbleIcon(`attr-${attr}`);
						frontIcon.setAttribute('transform', 'scale(0.85) translate(2, 0)');
					}
					dom.parentElement.insertBefore(svg, dom);
				}
			}
			if (res = /由(.+)寵物造成的傷害減少(\d+)%/.exec(dom.nodeValue)) {
				const types = res[1].split(/[、和]/);
				for (let i = 0; i < types.length; i++) {
					const type = typeIndex(types[i].replace(/類$/,''));
					const svg = svgIcon('shield');
					const frontIcon = svg.appendSymbleIcon(`type-${type}`);
					frontIcon.setAttribute('transform', 'scale(0.7) translate(5, 3)');
					dom.parentElement.insertBefore(svg, dom);
				}
			}
			if (res = /將(?:受到的)?(?:隨機|其中)?([一\d]種)?(.*)屬性傷害轉換成自己的生命值/.exec(dom.nodeValue)) {
				if (Boolean(res[1])) { //如果随机
				   const svg = svgIcon(`attr-any`);
				   svg.appendSymbleIcon('recover');
				   dom.parentElement.insertBefore(svg, dom);
				   return;
				}
				let attrsStr = res[2];
				const hasMultiGroup = /「.+」/.test(attrsStr);
				//multiGroupTypeA 「火水」、「水木」
				//multiGroupTypeB 「火/水」、「水/木」
				//multiGroupTypeC 「火水/水木」
				const multiGroupTypeC = /^「([^「」]+)」$/.exec(attrsStr);
				if (multiGroupTypeC) attrsStr = multiGroupTypeC[1];

				const normalSplit = attrsStr.includes('、'); //是否是顿号的普通分割
				let attrs = attrsStr.split(normalSplit ? "、" : "/" ); //用顿号或者/分割第一次
				attrs = attrs.map(attrStr=>{
					const multiGroupTypeAB = /「(.+?)」/mg.exec(attrStr);
					if (multiGroupTypeAB) {
						attrStr = multiGroupTypeAB[1];
					}
					if (attrStr.length > 1) { //如果不止一个属性
						return (attrStr.includes('/') ? attrStr.split('/') : Array.from(attrStr)).map(attrIndex); //子组分割
					} else {
						return attrIndex(attrStr);
					}
				});
				if (!hasMultiGroup) attrs = [attrs]; //如果并没有多组，则嵌入到一个单元素数组
				const fragment = document.createDocumentFragment();
				for (let i=0;i<attrs.length;i++) {
					let attrArr = attrs[i];
					
					attrArr.forEach(attr=>{
						const svg = svgIcon(`attr-${attr}`);
						svg.appendSymbleIcon('recover');
						fragment.append(svg);
					});
					if (i<(attrs.length-1)) {
						fragment.append('/');
					}
				}
				dom.parentElement.insertBefore(fragment, dom);
			}
			if (res = /技能的?冷卻時間(增加|縮短)/.exec(dom.nodeValue)) {
				const zuo = res[1]=='增加';
				const svg = svgIcon('skill-boost');
				const text = document.createElementNS(svgNS,'text');
				text.textContent = zuo?'-':'+';
				text.setAttribute("x", "80%");
				text.setAttribute("y", zuo?"80%":"20%");
				text.setAttribute("fill", zuo?"lightblue":"yellow");
				text.setAttribute("style", "font-size: 2em;");
				svg.appendChild(text);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /覺醒技能無效化/.exec(dom.nodeValue)) {
				const svg = svgIcon('awoken-bind');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /無法發動任何主動技能/.exec(dom.nodeValue)) {
				const svg = svgIcon('skill-bind');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /封鎖.+寵物/.exec(dom.nodeValue)) {
				const svg = svgIcon('member-bind');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /結算時(增加|減少)(\d+)COMBO/.exec(dom.nodeValue)) {
				const decrease = res[1]=='減少';
				const svg = svgIcon(`combo-${decrease?'decrease':'increase'}`);
				const text = document.createElementNS(svgNS,'text');
				text.textContent = res[2];
				text.setAttribute("x", "70%");
				text.setAttribute("y", "40%");
				text.setAttribute("fill", "white");
				svg.appendChild(text);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /(寵物的)?攻擊力變成原來的(\d+)%/.exec(dom.nodeValue)) {
				const member = Boolean(res[1]);
				const decrease = Number(res[2])<100;	
				let svg = svgIcon(member ? 'assist-bind' : 'attr-any');
				const frontIcon = svg.appendSymbleIcon(`member-atk-${decrease?'decrease':'increase'}`);
				frontIcon.setAttribute('transform', `scale(0.75) translate(${member ? 4 : 10}, ${member ? 4 : (decrease? 10 : 0)})`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /回復力變成(?:原來的)?(\d+)%?/.exec(dom.nodeValue)) {
				const decrease = Number(res[1])<100;
				const svg = svgIcon('attr-5');
				const frontIcon = svg.appendSymbleIcon(`member-atk-${decrease?'decrease':'increase'}`);
				frontIcon.setAttribute('transform', `scale(0.75) translate(10, ${decrease? 10 : 0 })`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /輔助寵物無效化/.exec(dom.nodeValue)) {
				const svg = svgIcon('assist-bind');
				const frontIcon = svg.appendSymbleIcon(`bind`);
				//frontIcon.setAttribute('transform', 'translate(0, 5)');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /寶珠鎖定/.exec(dom.nodeValue)) {
				const svg = svgIcon('lock');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /鎖定.*掉落/.exec(dom.nodeValue)) {
				const svg = svgIcon('lock');
				svg.appendSymbleIcon(`fall-down`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /攻擊力提升至/.exec(dom.nodeValue)) {
				const svg = svgIcon('angry');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /(遮擋寶珠的雲|雲遮擋寶珠)/.exec(dom.nodeValue)) {
				const svg = svgIcon('cloud');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /無法移動(.+)的寶珠/.exec(dom.nodeValue)) {
				const svg = svgIcon('immobility');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /(掉落|變成)超暗闇/.exec(dom.nodeValue)) {
				const svg = svgIcon('super-dark');
				if (res[1] == '掉落') {
					svg.appendSymbleIcon(`fall-down`);
				}
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /寶珠每隔([\d\.]+)秒不斷轉換/.exec(dom.nodeValue)) {
				const svg = svgIcon('roulette');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /造成玩家目前HP(\d+)%的傷害/.exec(dom.nodeValue)) {
				const svg1 = svgIcon('gravity');
				dom.parentElement.insertBefore(svg1, dom);
				const damage = Number(res[1]);
				if (damage < 100) return; //小于100的重力不需要盾
				const fragment = document.createDocumentFragment();
				fragment.append(`（需要`);
				const svg2 = svgIcon('shield');
				svg2.appendSymbleIcon(`text-defense`);
				fragment.append(svg2);
				fragment.append(`盾>${Math.round((1-100/Number(res[1]))*10000)/100}%）`);
				dom.parentElement.insertBefore(fragment, dom.nextSibling);
			}
			if (res = /掉落(弱體|强)化寶珠/.exec(dom.nodeValue)) {
				const decline = res[1]=='弱體';
				const svg = svgIcon(`orb-${decline?'decline':'enhance'}`);
				svg.appendSymbleIcon(`fall-down`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /天降的寶珠不會產生COMBO/.exec(dom.nodeValue)) {
				const svg = svgIcon('no-fall-dowm');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /寶珠起手的位置/.exec(dom.nodeValue)) {
				const svg = svgIcon('fix-start-position');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /攻擊目標被鎖定/.exec(dom.nodeValue)) {
				const svg = svgIcon('fix-target');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /寶珠移動時間變成原來的(\d+)%/.exec(dom.nodeValue)) {
				const decrease = Number(res[1])<100;
				const svg = svgIcon(`move-time-${decrease?'decrease':'increase'}`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /寶珠移動時間(減少|增加)(\d+)秒/.exec(dom.nodeValue)) {
				const decrease = res[1] == '減少';
				const svg = svgIcon(`move-time-${decrease?'decrease':'increase'}`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /玩家的HP上限/.exec(dom.nodeValue)) {
				const svg = svgIcon('change-max-hp');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /隊員換成隊長/.exec(dom.nodeValue)) {
				const svg = svgIcon('change-leader-position');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /隊長會(?:隨機)?變成/.exec(dom.nodeValue)) {
				const svg = svgIcon('change-leader-card');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /寶珠盤面變成【\d+×\d+】/.exec(dom.nodeValue)) {
				const svg = svgIcon('board-change-size');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /掉落COMBO寶珠/.exec(dom.nodeValue)) {
				const svg = svgIcon('orb-combo');
				svg.appendSymbleIcon(`fall-down`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /隨機轉換自身的屬性|將自身的屬性轉換成(.)/.exec(dom.nodeValue)) {
				const svg = svgIcon('enemy-attr');
				const attr = res[1] ? attrIndex(res[1]) : 'any';
				const frontIcon = svg.appendSymbleIcon(`attr-${attr}`);
				frontIcon.setAttribute('transform', 'scale(0.85) translate(1, 1)');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /回復玩家(\d+)%HP/.exec(dom.nodeValue)) {
				const svg = svgIcon('heal');
				dom.parentElement.insertBefore(svg, dom);
			}
			// if (res = /消除玩家所有BUFF技能效果/.exec(dom.nodeValue)) {
			// 	const svg = svgIcon('bind');
			// 	dom.parentElement.insertBefore(svg, dom);
			// }
			if (res = /變成不會受到任何傷害的狀態/.exec(dom.nodeValue)) {
				const svg = svgIcon('invincible');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /回到可以承受傷害的狀態/.exec(dom.nodeValue)) {
				const svg = svgIcon('invincible');
				const frontIcon = svg.appendSymbleIcon(`bind`);
				frontIcon.setAttribute('transform', 'translate(0, 5)');
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /(掉落|出現)荊棘/.exec(dom.nodeValue)) {
				const svg = svgIcon('thorn');
				if (res[1] == '掉落') svg.appendSymbleIcon(`fall-down`);
				dom.parentElement.insertBefore(svg, dom);
			}
			if (res = /\d+回合內，$/.exec(dom.nodeValue) && dom.nextElementSibling.nodeName == 'IMG') {
				const nextText = nextTextNode(dom);
				if (/無法被消除/.exec(nextText.nodeValue)) {
					const svg = svgIcon('bind');
					dom.parentElement.insertBefore(svg, dom);
				}
				if (/掉落機率提升/.exec(nextText.nodeValue)) {
					const svg = svgIcon('fall-down');
					dom.parentElement.insertBefore(svg, dom);
				}
			}
		}
	}

	GM_registerMenuCommand(`${T2S?"关闭":"开启"}-繁体转简体`, function(){
		alert(`${T2S?"关闭":"开启"}繁体转简体后，刷新页面生效。`);
		GM_setValue("traditional-to-simplified", !T2S);
	});
	GM_registerMenuCommand(`${ConciseMode?"关闭":"开启"}-地下城简洁模式`, function(){
		alert(`${ConciseMode?"关闭":"开启"}地下城简洁模式后，刷新页面生效。`);
		GM_setValue("dungeon-style-concise", !ConciseMode);
	});
	GM_registerMenuCommand(`${OpenAllDetails?"关闭":"开启"}-自动展开所有详情`, function(){
		alert(`${OpenAllDetails?"关闭":"开启"}自动展开所有详情后，刷新页面生效。`);
		GM_setValue("open-all-details", !OpenAllDetails);
	});
	GM_registerMenuCommand(`${storeAvatar?"关闭":"开启"}-在本地数据库储存怪物头像`, function(){
		alert(`${storeAvatar?"关闭":"开启"}本地数据库储存怪物头像后，刷新页面生效。`);
		GM_setValue("local-store-card-avatar", !storeAvatar);
	});

	//加载document后执行启动器
	if (/loaded|complete/.test(document.readyState)){
		bootstrap();
	}else{
		document.addEventListener('DOMContentLoaded',bootstrap,false);
	}

	async function redirectLocalCardAvatar(){
		function loadDatabase(dbName, dbVersion) {
			return new Promise(function(resolve, reject) {
				const DBOpenRequest = indexedDB.open(dbName, dbVersion);
				DBOpenRequest.onsuccess = function(event) {
					resolve(event.target.result); //DBOpenRequest.result;
					console.debug(GM_info.script.name, "数据库已可使用");
				};
				DBOpenRequest.onerror = function(event) {
					// 错误处理
					console.error(GM_info.script.name, "数据库无法启用，删除可能存在的异常数据库。",event);
					indexedDB.deleteDatabase(dbName); //直接把整个数据库删掉
					console.error("也可能是隐私模式导致无法启用数据库，于是尝试不保存的情况下读取数据。");
					reject(event);
				};
				DBOpenRequest.onupgradeneeded = function(event) {
					let db = event.target.result;
				
					let store;
					store = db.createObjectStore("cards_avatar");
				
					// 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
					store.transaction.oncomplete = function(event) {
						console.log(GM_info.script.name, "数据库建立完毕");
					};
				};
			});
		}

		const dbName = "pad-skyozora-enhance";
		const tableName = "cards_avatar";
		const dbVersion = 1;
		let db = await loadDatabase(dbName, dbVersion);

		function putImageBlob(blob, key) {
			return new Promise(function(resolve, reject) {
				const transaction = db.transaction([tableName], "readwrite");
				const objectStore = transaction.objectStore(tableName);
				const put = objectStore.put(blob, key);
				put.onsuccess = function (event) {
					const imgURL = URL.createObjectURL(blob);
					resolve(imgURL);
				};
				put.onerror = function (event) {
					reject(false);
				};
			});
		}
		function getImageBlobURL(key) {
			return new Promise(function(resolve, reject) {
				const transaction = db.transaction([tableName], "readwrite");
				const objectStore = transaction.objectStore(tableName);
				const get = objectStore.get(key);
				get.onsuccess = function(event) {
					const blob = event.target.result;
					if (blob == undefined) {
						resolve(false);
						return;
					}
					const imgURL = URL.createObjectURL(blob);
					resolve(imgURL);
				};
				get.onerror = function(event) {
					reject(false);
				};
			});
		}

		function getId(src) {
			const regres = src.match(/pets\/(\d+)\.png/i);
			return parseInt(regres[1],10);
			//return `card-avatar-${regres[1]}`;
		}
		const cardAvatars = Array.from(document.querySelectorAll('img:where([src^="images/pets"],[data-original^="images/pets"])'));
		cardAvatars.forEach(async avatar=>{
			const src = avatar.dataset.original ?? avatar.src;
			const cardId = getId(src);
			//console.log("configId",configId);
			let avatarURL = await getImageBlobURL(cardId);
			if (!avatarURL) {
				console.debug('数据库中未获取到 No.%d 的头像数据，开始下载。', cardId);
				let response = await fetch(src);
				let blob = await response.blob();
				avatarURL = await putImageBlob(blob, cardId);
				console.debug(' No.%d 的头像数据下载成功。', cardId);
			} else {
				//console.debug('直接使用数据库中获取到的 No.%d 的头像数据。', cardId);
			}
			avatar.dataset.id = cardId;
			if (avatar.dataset.original) avatar.dataset.original = avatarURL;
			avatar.src = avatarURL;
		});
	}
})();