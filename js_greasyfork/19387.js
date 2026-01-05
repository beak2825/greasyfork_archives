// ==UserScript==
// @name         正确跟帖的方式
// @namespace    ysaerg
// @version      1.1
// @description  绕过国内网站的审核, 目前支持网易, v2ex
// @author       ysaerg
// @include       /^https?:\/\/comment.\w+\.163\.com\/.*\/.*\.html$/
// @include       /^https?:\/\/v2ex\.com\/t\/.*$/
// @todo      /https?:\/\/tieba\.baidu\.com\/.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19387/%E6%AD%A3%E7%A1%AE%E8%B7%9F%E5%B8%96%E7%9A%84%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/19387/%E6%AD%A3%E7%A1%AE%E8%B7%9F%E5%B8%96%E7%9A%84%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

var chinese = {
民: '泯',
自: '目',
杀: '纱',
死: '屎',
主: '猪',
统: '捅',
村: '木寸',
科: '禾斗',
处: '畜',
局: '菊',
部: '步',
厅: '汀',
省: '绳',
县: '馅',
国: '掴',
家: '稼',
马: '玛',
宁: '狞',
毛: '猫',
邓: '灯',
江: '茳',
泽: '沢',
谋: '某',
王: '仼',
周: '週',
胡: '葫',
刘: '浏',
李: '锂',
吴: '捂',
温: '溫',
习: '夕',
贺: '赫',
贾: '價',
彭: '嘭',
潭: '覃',
新: '亲斤',
诚: '铖',
事:　'story',
职: '耳只',
称: '禾尔',
英:　'瑛',
语: '言吾',
答: '嗒',
案: '桉',
公: '蚣',
务: '兀',
员: '猿',
宝: '孢',
轮: '纶',
胎: '肽',
政: '钲',
变: '煸',
枪: '炝',
声: '笙',
戒: '琾',
严: '盐',
京: '菁',
真: '稹',
理: '锂',
贼: '戝',
假: '茄',
异: '弈',
士: '仕',
军: '莙',
日: '衵',
高: '篙',
刊: '衎',
物: '焐',
议: '仪',
人: '朲',
权: '荃',
党: '谠',
独: '牍',
裁: '菜',
迫: '珀',
害: '嗐',
委: '萎',
论: '抡',
探: '镡',
斯: '嘶',
哲: '喆',
胜: '笙',
藏: '臧',
经: '泾',
命: '掵',
革: '諽',
劳: '捞',
牢: '涝',
佬: '姥',
监: '鉴',
狱: '域',
左: '佐',
右: '佑',
上: '丄',
下: '丅',
东: '岽',
南: '喃',
西: '茜',
北: '邶',
前: '偂',
后: '逅',
报: '铇',
进: '琎',
禁: '僸',
美: '镁',
业: '邺',
帝: '蒂',
城: '铖',
团: '団',
派: 'π',
怨: '鸳',
冤: '鸳',
封: '葑',
锁: '琐',
血: '桖',
邪: '偕',
地: '递',
岸: '堓',
宪: '筅',
社: '渉',
操: '鄵',
镇: '嫃',
审: '渖',
明: '朙',
文: '呅',
攻: '杛',
打: '哒',
骂: '瑪'
};


var sites = [
{
	url: /https?:\/\/comment\..+\.163\.com\/.*\/.*.html/,
	ele: ['#replyBody']
},
{
	url: /https?:\/\/v2ex\.com\/t\/.*/,
	ele: ['#reply_content']
},

{
	url:/https?:\/\/tieba\.baidu\.com\/f\?kw=.*/,
	ele: ['.editor_textfield','#ueditor_replace']
}
];

String.prototype.toUnicode = function(){
	var str ='';
	var text = this.toString();
	for(var i=0;i<text.length;i++)
	{
	   str+="\\u"+parseInt(text[i].charCodeAt(0),10).toString(16);
	}
	return str;
};

String.prototype.toChinese = function () {
	var text = this.toString();
	data = text.split('\\u');
	   var str ='';
	   for(var i=0;i<data.length;i++)
	   {
	       str+=String.fromCharCode(parseInt(data[i],16).toString(10));
	   }
	   return str;
};



function chooseEle(url){
	for (var i = sites.length - 1; i >= 0; i--) {
		if(url.match(sites[i].url) !== null)
			return sites[i].ele;
	}
}


var currentURL = window.location.href;
console.log(currentURL);
window.setTimeout(replaceCharactor(currentURL), 3000);

function replaceCharactor(url){
	var selectorArray = chooseEle(url);
	console.log('selector array: ' + selectorArray);
	if(selectorArray === false){
		console.log('url not support');
		return false;
	}

	addListeners(getDOMs(selectorArray),function(ele){
		console.log('dom: '+ele);
		if(eleIs(ele,'ueditor_replace')){
			console.log('unsupport yet');
			return;
		}

		var replaceText = function (){
			text = ele.value;
			if(text.length < 2) return;
			console.log('original texts: '+ text);
			text=text.toUnicode().split('\\').join(' \\');

			var patterns = Object.keys(chinese);
			for (var i = patterns.length - 1; i >= 0; i--) {
				var p = new RegExp('\\'+patterns[i].toUnicode(),"g");
				text=text.replace(p, chinese[patterns[i]].toUnicode());
			}

			var finalTexts = text.split(' ').join('').toChinese();

			console.log('final texts: '+finalTexts);
			ele.value=finalTexts;
			ele.removeEventListener('mouseout', replaceText ,false);
		};

		var watchText = function() {
			ele.addEventListener('mouseout',replaceText, false);
		};

		ele.addEventListener('input',watchText,false);
	});
}




function getDOMs(selectorArray) {
	var DOMs = [];
	for (var i = selectorArray.length - 1; i >= 0; i--) {
		var d = document.querySelector(selectorArray[i]);
		DOMs.push(d);
	}
	console.log('doms: ' + DOMs);
	return DOMs;
}

function addListeners(DOMArray, callback) {
	for (var i = DOMArray.length - 1; i >= 0; i--) {
		callback(DOMArray[i]);
	}
}

function eleIs(ele,classOrIdName) {
	// check http://stackoverflow.com/questions/1789945/how-can-i-check-if-one-string-contains-another-substring
	if(~ele.id.indexOf(classOrIdName) || ~ele.className.indexOf(classOrIdName))
		return true;
	return false;
}
