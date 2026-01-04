$(function () {
	if (host.indexOf('item.jd.com') > -1) {
		initJdDetail()
		addJdBasic()
	}
})
// 京东详情初始化入口
function initJdDetail() {
	if (host.indexOf('item.jd.com') > -1) {
		let id = window.location.pathname
		let index = id.lastIndexOf('/')
		id = id.substring(index + 1, id.length)
		id = id.match(/(\S*).html/)[1]
		getJdDetail(id)
		likeJd()
		getJdHistory()
	}
}
//获取京东商品信息;
function getJdDetail(id) {
	let url =
		'https://api.zhetaoke.com:10001/api/open_jing_union_open_goods_query.ashx'
	let params = {
		appkey: '52b273a5972949388ce7b57b84453aa4',
		keyword: id,
	}
	dtd(url, params, addJdCoupon)
}
// 插入京东优惠券
function addJdCoupon(res) {
	let clickURL = ''
	let obj = JSON.parse(res)
	let result = obj.jd_union_open_goods_query_response.result
	let data = JSON.parse(result).data[0]
	let couponList = data.couponInfo.couponList
	if (couponList.length > 0) {
		// 是否有优惠券
		let bestArr = couponList.filter((item) => {
			return item.isBest === 1
		})
		let coupon = bestArr[0] // 优惠券对象
		let turnedUrl = jdChangeUrl(data.skuId, coupon.link) // 转链后
		clickURL = turnedUrl
		let html =
			'<div class="jar-body-coupon-left">满' +
			coupon.quota +
			'元减' +
			coupon.discount +
			'元</div>' +
			'<div class="jar-body-coupon-center">' +
			'<div>使用开始时间: <span>' +
			timeFormat(coupon.useStartTime, 1) +
			'</span></div>' +
			'<div>优惠券结束时间: <span>' +
			timeFormat(coupon.useEndTime, 1) +
			'</span></div>' +
			'</div>' +
			'<div id="jar-qrcode" style="float:right;"></div>' +
			'<span style="color: #ff0036;text-align: center;position: absolute;right:10px;top:100px;font-weight:bold;"><p>京东扫一扫领取优惠券</p></span>' +
			'<div class="jar-button"><a rel=noreferrer href="' +
			clickURL +
			'" target="_blank">点击领取</a></div>'
		$('.jar-body-coupon-top').append(html)
		let qrcode = new QRCode('jar-qrcode', {
			text: clickURL,
			width: 500,
			height: 500,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H,
		})
	} else {
		// 无优惠券
		let turnedUrl = jdChangeUrl(data.skuId) // 转链后

		let html =
			'<a rel=noreferrer href="' +
			turnedUrl +
			'" target="_blank"><div class="jar-body-coupon-left">点击查询</div></a>' +
			'<div class="jar-body-coupon-center">' +
			'<div>优惠券结束时间: <span>0</span></div>' +
			'<div>优惠券剩余量: <span>0</span></div>' +
			'</div>' +
			'<div id="jar-qrcode" style="float:right;"></div>' +
			'<span style="color: #ff0036;text-align: center;position: absolute;right:10px;top:100px;font-weight:bold;"><p>京东扫一扫查询优惠券</p></span>'
		$('.jar-body-coupon-top').append(html)
		let qrcode = new QRCode('jar-qrcode', {
			text: turnedUrl,
			width: 500,
			height: 500,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H,
		})
	}
}
// 获取相似比价
function likeJd() {
	let goodsReq = {
		eliteId: 2,
		hasCoupon: 1,
		siteId: '4000380964',
	}
	let params = {
		v: '1.0',
		method: 'jd.union.open.goods.material.query',
		app_key: '749ec5acf07b3bc2c623a465bc77c0e4',
		sign_method: 'md5',
		format: 'json',
		timestamp: dateFormat(),
		param_json: JSON.stringify({
			goodsReq: goodsReq,
		}),
	}
	let obj = objKeySort(params)
	let secretkey = 'de15ce50b876430b941d3d9d5f307c2b'
	let str = ''
	for (i in obj) {
		if (params[i] !== '' && params[i] !== null && params[i] !== undefined) {
			str += i + params[i]
		}
	}
	params.sign = md5(secretkey + str + secretkey).toUpperCase()
	let url = 'https://api.ergirl.com/jdApi/api'
	dtd(url, params, addJdLike)
}
// 插入相似
function addJdLike(data) {
	let result =
		JSON.parse(data).jd_union_open_goods_material_query_response.result
	let obj = JSON.parse(result).data
	obj.forEach((item) => {
		let html =
			'<dl>' +
			'<dd><a rel=noreferrer href="' +
			item.promotionInfo.clickURL +
			'" target="_blank">' +
			'<div class="img">' +
			'<img src="' +
			item.imageInfo.imageList[0].url +
			'" alt="">' +
			'</div>' +
			'<div class="infor" >' +
			'<div>价格: <span>' +
			item.priceInfo.price +
			'</span></div>' +
			'<div class="jar-like-coupon">优惠券: <span>' +
			item.couponInfo.couponList[0].discount +
			'</span></div>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="title">' +
			item.skuName +
			'</div>' +
			'</a></dd>' +
			'</dl>'
		$('.jar-like-list').append(html)
	})
}
// 获取历史记录
function getJdHistory() {
	let id = window.location.pathname
	let index = id.lastIndexOf('/')
	id = id.substring(index + 1, id.length)
	id = id.match(/(\S*).html/)[1]
	let url = 'https://api.ergirl.com/gwdang/trend/data_www'
	let params = {
		dp_id: id + '-3',
		v: 2,
	}
	let arr = []
	$.ajax({
		url: url,
		data: params,
		type: 'get',
		success: function (res) {
			let obj = JSON.parse(res).promo_detail
			obj.forEach((item) => {
				let o = {
					time: timeFormat(item.time * 1000, 1),
					ori_price: item.ori_price / 100,
					price: item.price / 100,
					msg: item.msg[0].text,
				}
				arr.push(o)
			})
			let max = JSON.parse(res).promo_series[0].max / 100
			let min = JSON.parse(res).promo_series[0].min / 100
			addJdHistory(arr, max, min)
		},
	})
}
// 插入历史价格
function addJdHistory(data, max, min) {
	let ori_price = []
	let time = []
	data.forEach((item) => {
		ori_price.push(item.ori_price)
		time.push(item.time)
	})
	let seriesData = {
		historyPrice: ori_price,
		time: time,
	}
	seriesData.minNum = min
	seriesData.maxNum = max
	console.log(seriesData)
	eachart(seriesData)
}
// 插入基本元素
function addJdBasic() {
	let html =
		'<div class="jar-detail-coupon">' +
		'<div class="jar-tab" >' +
		'<ul>' +
		'<li class="active">领券</li>' +
		'<li>实时热销</li>' +
		'<li>价格趋势</li>' +
		'</ul><span class="jar-show">隐藏</span>' +
		'</div >' +
		'<div class="jar-body">' +
		'<ul>' +
		'<li>' +
		'<div class="jar-body-coupon">' +
		'<div class="jar-body-coupon-top"></div>' +
		'<div class="clear"></div>' +
		'<div class="jar-body-coupon-right">温馨提示: <br><span><a href="https://www.ergirl.com" rel="noreferrer nofollow" target="_blank">扫码小程序查询更多优惠券</a></span><img style="width: 120px;position: absolute;top: -10px;left:180px" src="https://api.ergirl.com/images/mp-code.jpg" />' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="jar-like-list">' +
		'</div> ' +
		'</li>' +
		'<li>' +
		'<div class="jar-history">' +
		'<div id="historyChart" style="width: 468px; height: 300px;"></div>' +
		'</div>' +
		'</li>' +
		'</ul>' +
		'</div>' +
		'</div >'
	if (host.indexOf('jd') > -1) {
		// 插入京东
		$('.summary-price-wrap').append(html)
	}
	$('.jar-detail-coupon .jar-tab li').click(function () {
		let index = $(this).index()
		$('.jar-detail-coupon .jar-tab li').removeClass('active')
		$(this).addClass('active')
		$('.jar-detail-coupon .jar-body li').hide()
		$('.jar-detail-coupon .jar-body li').eq(index).show()
	})
	$('.jar-show').click(function () {
		if ($('.jar-show').html() == '隐藏') {
			$('.jar-show').html('展开')
		} else {
			$('.jar-show').html('隐藏')
		}
		$('.jar-detail-coupon .jar-body').toggle()
	})
}
// 京东转链
function jdChangeUrl(id, cUrl) {
	let url = ''
	$.ajax({
		url: 'https://api.zhetaoke.com:10001/api/open_jing_union_open_promotion_byunionid_get.ashx',
		async: false,
		data: {
			appkey: '52b273a5972949388ce7b57b84453aa4',
			unionId: '1001407893',
			materialId: id,
			positionId: '3002873177',
			couponUrl: cUrl,
		},
		success: function (res) {
			let obj = JSON.parse(res)
			let result = JSON.parse(
				obj.jd_union_open_promotion_byunionid_get_response.result
			)
			if (result.message === 'success') {
				let data = result.data
				url = data.shortURL
			} else {
				url = cUrl
			}
		},
	})
	return url
}
