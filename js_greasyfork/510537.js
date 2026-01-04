// ==UserScript==
// @name         HV简称替换为中文
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  受不了简称了
// @author       aotmd
// @match        https://forums.e-hentai.org/index.php?showtopic=*
// @match        https://ehwiki.org/wiki/Acronyms/Chinese
// @noframes
// @license MIT
// @run-at document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510537/HV%E7%AE%80%E7%A7%B0%E6%9B%BF%E6%8D%A2%E4%B8%BA%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/510537/HV%E7%AE%80%E7%A7%B0%E6%9B%BF%E6%8D%A2%E4%B8%BA%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==
//简称来源：https://ehwiki.org/wiki/Acronyms/Chinese
/*生成脚本：
let a=document.querySelectorAll("#mw-content-text > div > table > tbody > tr")
let s="";
for ( let i = 0; i < a.length; i++ ) {
	s+="\'"+a[i].children[0].innerText+"\'"+":\'"+a[i].children[2].innerText+"\',\n"
}
*/
/*
参见：https://forums.e-hentai.org/index.php?showtopic=189266
参见：https://forums.e-hentai.org/index.php?showtopic=256084&st=0&p=6092109&#entry6092109
参见：https://ehwiki.org/wiki/Acronyms/Chinese
*/
( function() {
	let map = {
		'10B': 'Ｔ氏、天妇罗、菠萝、大菠萝',
		'1H': '单手武器/战斗风格：单手',
		'2H': '双手武器/战斗风格：双手',
		'AAB': '攻击准确度奖励：这边指的是物理性质',
		'AB': '训练：技能推广',
		'ADB': '攻击伤害奖励',
		'AF': '咒语：奥术集成',
		'AGI': '主要属性奖励：敏捷',
		'AL': '训练：善于学习者',
		'AoE': '范围效果',
		'AP': '技能点',
		'Arch': '潜能：大法师',
		'AS': '行动速度',
		'B': '负重',
        'Bur':'负重',
		'BC': '后缀：战法师',
		'BoD': '黏合剂：毁灭',
		'BoP': '黏合剂：守护',
		'BoS': '黏合剂：杀戮',
		'But': '潜能：屠夫',
		'BW': '特效：流血',
		'C': '绅士幣',
		'Cap': '潜能：魔力电容',
		'CM': '特效：魔力合流',
		'CoD': '货到付款',
		'CR': '罕见素材：Crystallized Phazon',
		'DEX': '主要属性奖励：灵巧',
		'DMM': '罕见素材：Defense Matrix Modulator',
		'DNP': '请勿张贴',
		'DOT': '持续伤害',
		'DW': '战斗风格：双持',
		'DwD': '竞技场：与龙共舞/与龙共舞的敌人',
		'DX': '解剔除',
		'Eco': '潜能：节能装置',
		'ED': '能量饮料/有效伤害/竞技场：永恆的黑暗',
		'EDB': '元素伤害奖励',
		'EH': 'Ｅ变态',
        'E-H': 'Ｅ变态',
		'EHG': 'Ｅ变态图库',
		'EHP': '有效生命值',
		'EHT': 'Ｅ变态ＢＴ伺服器',
		'Ele': '元素类型前缀',
		'Emax': '精致装备上某数值的顶点。',
        'Exmax': '精致装备上某数值的顶点。',
		'END': '主要属性奖励：体质',
		'EoD': '竞技场：世界末日/竞技场：死亡前夕',
		'ET': '特效：以太水龙头',
		'Eth': '前缀：空灵',
		'EW': '后缀：地行者',
		'EXP': '经验值',
		'Exq': '品质：精致',
		'Fat': '潜能：致命性',
		'FB': '技巧：狂乱百裂斩',
		'FoS': '额外能力：雪花的信徒',
		'FRD': '技巧：龙吼',
		'FSM': '敌人：飞行义大利面怪物',
		'GF': '压榨界',
		'GLT': '黄金彩券',
		'GP': '图库点数',
		'GS': '金星',
		'GSC': '金星俱乐部',
		'H': 'Hath',
		'H@H': 'Hentai@Home',
		'Hellfest': '地狱榨：地狱难度的压榨界',
		'HG': '高阶素材',
		'HGC': '高阶布料素材',
		'HGL': '高阶皮革素材',
		'HGM': '高阶金属素材',
		'HGW': '高阶木材素材',
		'HP': '生命值',
		'HS': '咒语：穿心',
		'HV': '变态之道：呼应我要成为大变态',
        'Hverse': '变态之道：呼应我要成为大变态',
		'I': '干扰',
        'Int':'干扰',
		'IA': '额外能力：天赋奥术',
		'INT': '主要属性奖励：智力',
		'IPU': '敌人：隐形粉红独角兽',
		'ISB': '道具店机器人',
		'IW': '道具界',
		'IWBTH': '难易度：我要成为大变态',
		'Jug': '潜能：重装盔甲',
		'LE': '终极万能药',
		'Leg': '品质：传奇',
		'LG': '低阶素材',
		'Lmax': '传奇装备上某数值的顶点。',
		'LotD': '训练：抽签运',
		'MAB': '魔法准确度奖励',
		'Mag': '品质：华丽',
		'Mat': '素材',
		'MDB': '魔法伤害奖励',
		'Mit': '伤缓',
		'MG': '中阶素材',
		'ML': '怪物实验室',
		'MM': '莫古利邮务',
		'Mmax': '华丽装备上某数值的顶点。',
		'MMI': '魔法缓伤：缓伤意思就像缓冲，让伤害值踩煞车，所以此数值无法达到 100%',
        'MMit': '魔法缓伤：缓伤意思就像缓冲，让伤害值踩煞车，所以此数值无法达到 100%',
		'MP': '魔力值',
		'MPB': '魔法熟练度奖励',
		'MPV': '多页阅读器',
		'NS': '命名空间',
		'OC': '斗气：以前翻作怒气，但西方人应该比较熟悉斗气吧',
		'OFC': '技巧：友情小马砲',
		'PA': '特效：破甲',
		'PAB': '主要属性奖励',
		'PB': '回本',
		'RE': '随机遭遇',
		'Pen': '潜能：渗透',
		'PFUDOR': '难易度：粉红毛毛独角兽在彩虹上头舞动',
		'PL': '战斗力',
		'PM': '私人讯息',
		'PMI': '物理缓伤',
        'PMit':'物理缓伤',
		'PXP': '潜经验：难得中文也能取字首，自认为念起来还颇顺口的',
		'QM': '训练：军需官',
		'RA': '罕见素材：Repurposed Actuator',
		'RL': '敌人：现实生活',
		'RNG': '随机数发生器',
		'RoB': '浴血擂台',
		'ROI': '投资报酬率',
		'RP': '角色扮演 (论坛，避免使用)/真人色情 (在剔除日志里用简写)',
		'SD': '后缀：影舞者',
		'SF': '罕见素材：Shade Fragment',
		'SG': '敌人：女高中生',
		'Smax': '优秀装备上某数值的顶点。',
		'SoL': '咒语：生命火花',
		'SP': '灵力值',
		'SS': '灵动架式/咒语：灵力盾',
		'STR': '主要属性奖励：力量',
		'SV': '咒语：影纱',
		't/s': '每秒刷数',
        'TpS': '每秒刷数',
		'T&T': '竞技场：命运三女神与树/命运三女神与树的敌人',
        'TT': '竞技场：命运三女神与树/命运三女神与树的敌人',
		'ToB': '血令牌',
		'ToS': '服务条款',
		'TT&T': '浴血擂台：九死一树',
        'TTT': '浴血擂台：九死一树',
		'WIS': '主要属性奖励：感知',
		'WTB': '愿意购买',
		'WTS': '愿意卖出',
		'WTT': '愿意交换',
        /*自定义部分：*/
        'CS':'施法速度',
        'Prof':'熟练度加成',
        'PF':'熟练度系数',
        'Evade':'回避',
        'Resist':'抵抗',

	}
	const 递归 = ( function 闭包() {
		/**
			* 递归处理到每个节点
			* @param el   要处理的节点
			* @param func 调用的函数
			*/
		function 主控( el, func ) {
			const nodeList = el.childNodes;
			/*先处理自己*/
			统一处理( el, false, func );
			for ( let i = 0; i < nodeList.length; i++ ) {
				const node = nodeList[ i ];
				统一处理( node, true, func );
			}
		}

		/**
			* 捕获指定节点,属性和属性内容,并执行指定函数.
			* @param el  要处理的节点
			* @param recursion 是否递归
			* @param func 调用的函数
			*/
		function 统一处理( el, recursion, func ) {
			if ( el.nodeType === 1 ) {
				//为元素则递归
				if ( recursion ) {
					主控( el, func );
				}
			} else if ( el.nodeType === 3 ) {
				if ( !el.nodeValue || !el.nodeValue.length ) return;
				//为文本节点则处理数据
				func( el, 'Text', el.nodeValue );
			}
		}

		return 主控;
	} )();

	if ( typeof observerMap === 'undefined' ) observerMap = new Map();
	/**
		* 修改后的函数,在触发事件后会对其他相同config的obs排队依次触发,节流10并去重大大提升性能.
		* dom修改事件,包括属性,内容,节点修改
		* @param document 侦听对象
		* @param func  执行函数,可选参数(records),表示更改的节点
		* @param config 侦听的配置
		*/
	function dom修改事件( document, func, config = {
		attributes: true,
		childList: true,
		characterData: true,
		subtree: true
	} ) {
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		//将配置对象序列化为字符串,做为key.
		const serializedConfig = JSON.stringify( Object.entries( config ).sort() );
		let throttleTimeout;
		let recordsArr = [];
		const observer = new MutationObserver( function( records ) {
			clearTimeout( throttleTimeout );
			// 记录变化
			recordsArr.push( ...records );
			throttleTimeout = setTimeout( () => {
				// 从recordedMutations数组中移除重复项
				recordsArr = removeDuplicates( recordsArr );
				let observers = observerMap.get( serializedConfig ) || [];
				// 在每次变化前暂停相同 config 的所有观察器实例
				observers.forEach( obs => obs.observer.disconnect() );
				// 对拥有相同观察器实例的文档执行各自的函数
				observers.forEach( obs => {
					try {
						obs.func( recordsArr );
					} catch ( e ) {
						console.error( e );
					}
				} );
				// 在执行完毕后重新启用相同 config 的所有观察器实例
				observers.forEach( obs => obs.observer.observe( document, config ) );
				// 清空记录的修改
				recordsArr = [];
			}, 10 );
		} );

		// 将观察器实例和对应的函数添加到对应 config 的数组中
		let observers = observerMap.get( serializedConfig ) || [];
		observers.push( {
			observer,
			func
		} );
		observerMap.set( serializedConfig, observers );

		// 开启侦听
		observer.observe( document, config );
		/**
			* 从后面开始去重,并保留靠后的元素.
			* @param arr
			* @returns {*}
			*/
		function removeDuplicates( arr ) {
			return arr.reduceRight( ( unique, item ) => {
				// 检查当前元素是否已存在于结果数组中，如果不存在，则将其添加到数组中
				if ( !unique.some( i => (
						i.type === item.type &&
						i.target === item.target &&
						i.attributeName === item.attributeName
					) ) ) {
					unique.push( item ); // 将不重复的元素添加到结果数组中
				}
				return unique;
			}, [] );
		}
	}


	/*当body发生变化时执行*/
	dom修改事件( document.body, ( records ) => {
		console.time( '替换,时间' );
		for ( let i = 0, len = records.length; i < len; i++ ) {
			递归( records[ i ].target, 替换 );
		}
		console.timeEnd( '替换,时间' );
	} );

	addStyle( `
		ruby {
			text-indent: 0px;
		}
		ruby > rt {
		    display: block;
		    font-size: 50%;
		    text-align: start;
		}
		rt {
		    text-indent: 0px;
		    line-height: normal;
		    -webkit-text-emphasis: none;
		}
	` );

	function 替换( node, attribute, value ) {
		value = value.trim();
		if ( attribute == 'Text' ) {
			if ( node.parentNode.nodeName == 'RT' || node.parentNode.nodeName == 'RUBY' ) {
				return;
			}
		}
		let text = value;

		// 遍历映射表进行替换
		for ( let abbr in map ) {
			let regex = new RegExp( `\\b${abbr}\\b`, 'g' ); // 精确匹配简写
			if ( regex.test( text ) ) {
				// 使用ruby标签替换简写
				text = text.replace( regex, `<ruby>${map[abbr]}<rt>${abbr}</rt></ruby>` );
			}
		}

		// 创建一个包含替换后的HTML的新节点
		let span = document.createElement( 'span' );
		span.innerHTML = text;

		// 替换原有的文本节点
		node.parentNode.replaceChild( span, node );
	}
	//添加css样式
	function addStyle( rules ) {
		let styleElement = document.createElement( 'style' );
		styleElement[ "type" ] = 'text/css';
		document.getElementsByTagName( 'head' )[ 0 ].appendChild( styleElement );
		styleElement.appendChild( document.createTextNode( rules ) );
	}
} )();