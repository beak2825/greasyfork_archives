const host = window.location.host
const id = getQueryVariable('id')
// 配置
const config = {
	zhetaoke: {
		appkey: '52b273a5972949388ce7b57b84453aa4',
		sid: '45532',
		pid: 'mm_55657354_2153100333_111014050406'
	}
}
// ajax
function dtd(url, params, callback, query) {
	let dtd = $.Deferred()
	let wait = function (dtd) {
		$.ajax({
			url: url,
			method: 'get',
			data: params
		})
			.done(function (res) {
				dtd.resolve(res)
			})
			.fail(function () {
				dtd.resolve({ error: true })
			})
		return dtd.promise()
	}
	$.when(wait(dtd)).done(function (res, q = query) {
		callback(res, q)
	})
}
// 历史价格图表
/**
 * @description: 初始化图表
 * @param {*} obj time 时间
 * @param {*} obj value 数据
 * @param {*} obj maxNum 最大值
 * @param {*} obj minNum 最小值
 * @return {*}
 */
function eachart(obj) {
	// 找到容器
	var myChart = echarts.init(document.getElementById('historyChart'))
	// 指定图表的配置项和数据
	var option = {
		title: {
			right: 30,
			subtext:
				'最高价：￥' +
				'{a|' +
				obj.maxNum +
				'}' +
				'  最低价：￥' +
				'{a|' +
				obj.minNum +
				'}',
			subtextStyle: {
				color: '#333',
				rich: {
					a: {
						fontSize: 16,
						fontWeight: 'bold',
						color: '#F40',
						lineHeight: 10
					}
				}
			}
		},
		tooltip: {
			trigger: 'axis',
			formatter: '{b0} <br />￥{c0}元'
		},
		legend: {
			type: 'scroll',
			icon: 'roundRect',
			left: 50,
			top: 10,
			itemGap: 100,
			itemWidth: 16, // 设置宽度
			itemHeight: 4, // 设置高度
			data: ['历史价格(券后价)'],
			textStyle: {
				fontSize: 16
			}
		},
		grid: {
			left: '12%',
			right: '5%',
			bottom: '30px'
		},
		xAxis: {
			data: obj.time,
			axisLabel: {
				formatter: function (value, idx) {
					var date = new Date(value)
					return idx === 0
						? value
						: [
								date.getMonth() + 1 < 10
									? '0' + (date.getMonth() + 1)
									: date.getMonth() + 1,
								date.getDate() < 10
									? '0' + date.getDate()
									: date.getDate()
						  ].join('-')
				}
			}
		},
		yAxis: {
			splitNumber: 5,
			min: obj.minNum,
			max: obj.maxNum
		},
		series: [
			{
				name: '历史价格(券后价)',
				type: 'line',
				color: '#F40',
				data: obj.historyPrice,
				lineStyle: {
					color: '#F40' //改变折线颜色
				}
			}
		]
	}

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option)
}
// 获取链接参数
function getQueryVariable(variable) {
	var query = window.location.search.substring(1)
	var vars = query.split('&')
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=')
		if (pair[0] == variable) {
			return pair[1]
		}
	}
	return false
}
// 对象排序
function objKeySort(obj) {
	//排序的函数
	var newkey = Object.keys(obj).sort()
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	var newObj = {} //创建一个新的对象，用于存放排好序的键值对
	for (var i = 0; i < newkey.length; i++) {
		//遍历newkey数组
		newObj[newkey[i]] = obj[newkey[i]] //向新创建的对象中按照排好的顺序依次增加键值对
	}
	return newObj //返回排好序的新对象
}
// 获取时间
function dateFormat() {
	let myDate = new Date()
	let obj = {
		year: myDate.getFullYear(),
		month: myDate.getMonth(),
		date: myDate.getDate(),
		hours: myDate.getHours(),
		min: myDate.getMinutes(),
		sec: myDate.getSeconds()
	}
	for (i in obj) {
		if (i === 'month') {
			obj[i] = obj[i] + 1
		}
		if (i !== 'year' && obj[i] < 10) {
			obj[i] = '0' + obj[i]
		}
	}
	let time =
		obj.year +
		'-' +
		obj.month +
		'-' +
		obj.date +
		' ' +
		obj.hours +
		':' +
		obj.min +
		':' +
		obj.sec
	return time
}
/**
 * @description: 获取数组最大值最小值
 * @param {*} arr 数据源
 * @return {*} arr[0] 最大值
 * @return {*} arr[1] 最小值
 */
function getMaxMin(arr) {
	let a = arr.sort()
	let max = a[a.length - 1]
	let min = a[0]
	return [max, min]
}
// 时间格式化
function timeFormat(val, type) {
	let date = new Date(val)
	let YY = date.getFullYear() + '-'
	let MM =
		(date.getMonth() + 1 < 10
			? '0' + (date.getMonth() + 1)
			: date.getMonth() + 1) + '-'
	let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
	let hh =
		(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
	let mm =
		(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
		':'
	let ss =
		date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
	if (type === 0) {
		return MM + DD
	} else if (type === 1) {
		return YY + MM + DD
	} else {
		return MM + DD + ' ' + hh + mm + ss
	}
}
// 监听dom变化
function domAddEventListener(node, callback) {
	let targetNode = node
	let observer = new MutationObserver(function (mutations) {
		callback(mutations)
	})
	observer.observe(targetNode, {
		attributes: true,
		childList: true,
		subtree: true
	})
}
// 大淘客加密
const makeSign = ($data, $appSecret) => {
	let $str = ''
	let $index = 0
	let $sortPor = []

	for (let key in $data) {
		$sortPor.push(`${key}=${$data[key]}`)
	}
	// 排序
	$sortPor.sort()

	// 转url
	for (let key in $sortPor) {
		$str = `${$str}${$index === 0 ? '' : '&'}${$sortPor[key]}`
		$index++
	}
	// md5加密
	const $ret = md5(`${$str}&key=52538654c86d4d403083c8f1ec69e87b`)
	return $ret.toUpperCase()
}
let historyMd5 = {
	zero: ['0', '00', '000', '0000', '00000', '000000', '0000000', '00000000'],
	chars: [
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	],
	strReverse: function (a) {
		var b,
			c = []
		var l
		for (b = 0, l = a.length; b < l; b++) c[c.length] = a.charAt(b)
		return c.reverse().join('')
	},
	encrypt: function (url, always2, alwaysTrue) {
		var a1 = historyMd5.shuzi(url)
		var a2 = historyMd5.zimu(url)
		url = a2 + a1
		var f,
			g = []
		var l
		for (f = 0, l = url.length; f < l; f++)
			g[g.length] = historyMd5.to(url.charCodeAt(f), always2)
		return historyMd5.rnd(
			alwaysTrue ? historyMd5.strReverse(g.join('')) : g.join(''),
			4
		)
	},
	to: function (a, c) {
		var e = '' + historyMd5.round(a + 88, c).toString(16),
			f = c - e.length
		return f > 0 ? historyMd5.zero[f - 1] + e : e
	},
	round: function (a, b) {
		var c = 1 << (4 * b)
		return 0 > a ? (a % c) + c : a % c
	},
	shuzi: function (a) {
		return a.replace(/[^0-9]+/gi, '')
	},
	zimu: function (a) {
		return a
			.toLowerCase()
			.replace(/https/g, 'http')
			.replace(/[^a-zA-Z]+/gi, '')
	},
	rnd: function (a, b) {
		return (
			historyMd5.rd(b) +
			md5(a) +
			historyMd5.rd(Math.ceil(Math.random() * 10))
		)
	},
	rd: function (a) {
		var res = ''
		for (var i = 0; i < a; i++) {
			res += historyMd5.chars[Math.ceil(Math.random() * 35)]
		}
		return res
	}
}
function urldecode(str, charset, callback) {
	window._urlDecodeFn_ = callback
	var script = document.createElement('script')
	script.id = '_urlDecodeFn_'
	var src =
		'data:text/javascript;charset=' +
		charset +
		',_urlDecodeFn_("' +
		str +
		'");'
	src +=
		'document.getElementById("_urlDecodeFn_").parentNode.removeChild(document.getElementById("_urlDecodeFn_"));'
	script.src = src
	document.body.appendChild(script)
}
// 跳转
function redirect(link) {
	var arg =
		'\u003cscript\u003etop.location.replace("' +
		link +
		'")\u003c/script\u003e'
	var iframe = document.createElement('iframe')
	iframe.src = 'javascript:window.name;'
	iframe.name = arg
	document.body.appendChild(iframe)
}
