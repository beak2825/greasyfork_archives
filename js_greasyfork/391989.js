// ==UserScript==
// @name         百度去广告-搜索页去右边栏推荐内容-个性排版主题
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  百度搜索页-去广告-去右边栏推荐内容-个性排版主题
// @author       glk
// @icon		 data:image/png;base64,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
// @include *://*.baidu.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/391989/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A-%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%8E%BB%E5%8F%B3%E8%BE%B9%E6%A0%8F%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9-%E4%B8%AA%E6%80%A7%E6%8E%92%E7%89%88%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/391989/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A-%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%8E%BB%E5%8F%B3%E8%BE%B9%E6%A0%8F%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9-%E4%B8%AA%E6%80%A7%E6%8E%92%E7%89%88%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function(window) {
    'use strict';
	// 结果项中的关键字
    window.init = function () {
        if(!!$('#_bg')) {
            $('#_bg').remove()
        }

		// bg
		var bgBoy1 = `https://b-ssl.duitang.com/uploads/item/201511/27/20151127114946_a4XRt.jpeg`
		var bgBoy3 = `https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573128491333&di=1b1b874812e915a7d716be7ba600188a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F27%2F20151127113458_yVWHP.jpeg`
		var bgBoy2 = `https://b-ssl.duitang.com/uploads/item/201511/27/20151127114431_2MEjw.jpeg`
		var bgTeenageHeart = `http://b-ssl.duitang.com/uploads/item/201305/27/20130527211938_aPYek.jpeg`
		var bgJXY = `http://pic1.win4000.com/wallpaper/c/57e8c44d3cce9.jpg`
		$('body').append("<img src="+ bgTeenageHeart +" id='_bg'></img>")
		$("#content_left>div").each(function() {
			var thiz = $(this)
			$(this).find('span').each(function() {
				var guanGaoText = $(this).text()
				if (guanGaoText.indexOf('广告') !== -1) {
					thiz.css({"display": "none"})
				}
			})
		})

		// bg位置
        $('#_bg').css({
         	"position": "fixed",
			"left": "50%",
			"top": "50%",
			"height": "100%",
			"width": "100%",
			"transform": "translate(-50%, -50%)",
			"z-index": -1,
			"opacity": 0.5
        })

		// 搜索结果关键字
        $('em').css({
            color: 'rgb(228, 128, 174)',
            textDecoration: 'none'
        })

        // 搜索关键词周围非关键词
        $('h3.t a').css({
            color: '#3388ffd4'
        })

        // 搜索结果链接
        $('a').css({
            textDecoration: 'none',
            color: '#218cf3 !important'
        })

        // 百度快照
        $('a.m').css({
            textDecoration: 'none',
            color: '#6b6464'
        })


        // 百度一下按钮
        $('#su').css({
            marginLeft: '15px',
            borderRadius: '5px'
        })

        // logo
        $('#result_logo').css({
            position: 'absolute',
            left: '395px'
        })

        // 整个搜索框表单
        $('#form').css({
            marginLeft: '28%'
        })

        $('#s_tab').css({
          background: '#c2d7fde8'
        })

        // 搜索目录导航栏
        $('#s_tab .s_tab_inner').css({
            marginLeft: '23%'
        })

        // 搜索主体
        $('#container').css({
            paddingTop: '0px'
        })

        //
        $('.ead_nums_cont_inner .search_tool_conter').css({
            marginLet: '44%'
        })

        // 搜索结果的数目汇总及筛选
        $('#container .nums').css({
            marginLeft: '55%'
        })

        // 搜索结果的数目汇总及筛选
        $('.search_tool_conter').css({
            marginLeft: '55%'
        })

        // 搜索总结果
        $('#container #content_left').css({
			width: "850px",
            marginLeft: '34%'
        })

        // 搜索总结果中的每一大项
        $('#container #content_left .c-container').css({
            position: 'relative',
            width: '830px',
            marginBottom: '20px'
        })


		$('#container #content_left .c-container .c-row').css({
            width: '830px',
        }).children('.c-span-last').css({
			width: "80%"
		})

        // 大项中的小项
        $('#container #content_left .result.c-container .c-abstract').css({
            paddingTop: '5px'
        })

        var f13 = $('#container #content_left .result.c-container .f13')

        // 大项中的小项
        f13.css({display: 'none'})

        // 搜索框盒阴影及圆角
        $('.s_ipt_wr').css({
            border: 'none',
            boxShadow: '0 0 1px #a72222ab',
            borderRadius: '5px',
        })

        // 搜索框内文字
        $('#kw').css({
            fontSize: '13px',
            color: '#484644'
        })

        // 右边推荐内容
        $('#content_right').css({
            height: '0px',
            overflow: 'hidden'
        })

        // foot
        $('#foot .foot-inner').css({
            paddingLeft: '15%'
        })

        // 相关搜索
        $('#rs').css({
            marginLeft: '40%',
            backgroundColor: 'transparent'
        })

        // 相关搜索链接项
        $('#rs table tbody tr th a').css({
            color: 'rgba(35, 32, 26, 0.71)',
            fontSize: '13px'
        })

        // 相关搜索标题
        $('#rs .tt').css({
            color: '#ea6b67'
        })

        // 分页
        $('#page').css({
            marginLeft: '29%'
        })

        // 分页
        $('#page a').css({
            background: 'transparent'
        })
        $('#page strong').css({
            background: 'transparent'
        })

        pageClick()
    }

	// 函数防抖
    var debounce = function (fun, delay) {
		return function (args) {
			var that = this
			var _args = args
			clearTimeout(fun.id)
			fun.id = setTimeout(function () {
				fun.call(that, _args)
			}, delay)
		}
    }
	var debounceInput = debounce(init, 1000)

    var inputChange = function () {
        $('#kw').on('input', function () {
			debounceInput()
        })

    }

    window.keydownFun = function () {
        $('#kw').on('keydown', function (e) {
            e = e || window.event
            if (e && e.keyCode == 13){
                setTimeout(() => {
                    init()
                }, 800)

            }

        })

        $('#kw').on('blur', function () {
            setTimeout(() => {
                init()
            }, 800)
        })
    }
    window.historyFun = function () {
        //每当同一个文档的浏览历史（即history对象）出现变化(只有当前进、后退的时候才会，比如用户点击前进后退按钮，比如js调用go(-1)/back()/forward时，就会触发popstate事件。

        window.onpopstate = function (event) {
			console.log('操作了history')
            setTimeout(function() {
                init()
            }, 1000)
            var state = JSON.parse(JSON.stringify(event.state));
            console.log('你操作了历史，location:此时状态为::: ', state);
        };
    }

	// 上一页下一页以及所有页码
    window.pageClick = function () {
        $('#page a').on('click', function () {
            setTimeout(() => {
				console.log('执行了init方法')
                init()
            }, 800)
        })
    }

	init()
    historyFun()
    keydownFun()
    inputChange()

	// 解决手次在地址栏输入搜索内容可能加载不出效果出来的问题
	window.timer = setInterval(function() {
		init()
		window._bg = document.getElementById('_bg')
		_bg.onload = function() {
			clearInterval(window.timer)
		}
	}, 2000)

})(window);