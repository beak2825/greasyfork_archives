// ==UserScript==
// @name         接口名称对应
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  和比赛的接口做一个对应
// @author       xygod
// @match        http://ncyunhua.com:9999/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ncyunhua.com
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/517325/1483922/QuHouLibary.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519457/%E6%8E%A5%E5%8F%A3%E5%90%8D%E7%A7%B0%E5%AF%B9%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/519457/%E6%8E%A5%E5%8F%A3%E5%90%8D%E7%A7%B0%E5%AF%B9%E5%BA%94.meta.js
// ==/UserScript==

(function () {
    'use strict';
	const tipsMap = {}
	let isShowTips = localStorage.getItem("tipsShow") === "true" ? true : false
	document.documentElement.style.setProperty(`--tipsShow`, isShowTips ? "block":"none");
    let lastType = location.href.split("html")[0].substr(-2, 1)
    run()
    GM_addStyle(`
    #VPContent > div > div > div.aside > div.aside-container{
        overflow: scroll !important;
    }
    #VPContent > div > div > div.aside > div.aside-container{
        width:fit-content;
    }
	.onlyLink{

	}
	.tips{
	 display:var(--tipsShow)
	}
    `)
	onlyLink()
	async function onlyLink(){
	  const parent = await qq.findDom(".VPNavBarMenu.menu")
	  parent.style.display = "flex"
	  parent.style.alignItems = "center"
	  const label = document.createElement("label")
	  label.innerText = "不要显示提示"
      const check = document.createElement("input")
	  check.checked = !isShowTips
	  check.addEventListener("change",toggleTips)
	  check.type = "checkbox"
	  label.className = "onlyLink"
	  label.append(check)
	  parent.append(label)
	}

	function toggleTips(e){
       isShowTips = !e.target.checked
	   localStorage.setItem("tipsShow",isShowTips)
		console.log(isShowTips)
	   document.documentElement.style.setProperty(`--tipsShow`, isShowTips ? "block":"none");
	}

    replaceDocLink()
    const docLinks = [
        "https://kdocs.cn/l/cuPoET1uyxvW",
        "https://kdocs.cn/l/cpwmSVleoui9",
        "https://kdocs.cn/l/ccclMixKxljZ",
        "https://kdocs.cn/l/cv7mTTIhWxFC",
        "https://kdocs.cn/l/crCOt4KePAZ1",
    ]
    async function replaceDocLink() {
        const links = (await qq.findAllDom(".VPLink")).slice(0, 5)
        links.forEach((link, i) => {
            link.href = docLinks[i]
            link.target = "_blank"
            link.ref = "prev"
        })
        console.log(links)
    }
    new MutationObserver(function () {
        const type = location.href.split("html")[0].substr(-2, 1)
        if (lastType !== type) {
            run()
            lastType = type
        }
    }).observe(document, { subtree: true, childList: true })

    function run() {
        const type = location.href.split("html")[0].substr(-2, 1)
        switch (type) {
            case "A":
                replaceA();
                break
            case "B":
                replaceB();
                break
            case "C":
                replaceC();
                break
            case "D":
                replaceD();
                break
            case "E":
                replaceE();
                break
        }

        function replaceText(config) {
            qq.findDom(".aside-container").then(container => {
                container.style.overflow = 'visible'
            })
            qq.findAllDom(".VPDocOutlineItem li a").then(arr => {
                arr.forEach(function (a) {
                    a.style.textOverflow = "unset"
                    a.style.overflow = "visible"
					// tipsMap[type] = tipsMap[type] || {}
					// tipsMap[type][a.textContent] = tipsMap[type][a.textContent] || {"init":true}
					// tipsMap[type][a.textContent]["init"] ? tipsMap[type][a.textContent]["origin"] = a.textContent: void 0
					// tipsMap[type][a.textContent]["init"] = false
					const wrap = a.parentElement.querySelector(".tip-wrap") || document.createElement("div")
					wrap.innerHTML = ""
					wrap.className = "tip-wrap"
					const tip = document.createElement("span")
					tip.className = "tips"
                    const title = Object.hasOwn(config, a.textContent) ? `--${config[a.textContent]}` : `---没找到`
					tip.innerText = title
                    a.title = a.textContent + title
					a.parentElement.style.display = "flex"
					a.parentElement.style.alignItems = "center"
					wrap.append(tip)
					a.parentElement.append(wrap)
                })
            })

        }

        function replaceA() {
            const config = {
                "国内业务接口": "业务介绍(首页)",
                "行业解决方案接口": "行业解决方案(首页)",
                "物流公司介绍接口": "公司介绍(关于我们页面)",
                "城市接口": "省市区三级联动数据（合作伙伴页面）",
                "急速货接口": "产品介绍（产品服务页面）",
                "logo接口1": "产品特点（产品服务页面）",
                "logo接口2": "应用场景（产品服务页面）",
                "高科技行业接口": "行业解决方案（解决方案页面）",
                "入厂物流接口": "物流服务模块解决方案（解决方案页面）",
                "核心内涵接口": "供应链金融（解决方案页面）",
                "首页接口": "顶部导航栏和子级导航栏",
                "邮件综合查询": "搜索和右边三个卡片（首页）",
            }
            replaceText(config)
        }

        function replaceB() {
            const config = {
                "海边图片接口": "顶部背景图片",
                "沙滩logo图相关接口": "logo图标",
                "物流公司介绍接口": "公司介绍(关于我们页面)",
                "风景介绍接口": "热门旅游（首页）",
                "头像接口": "热门话题（首页）",
                "便捷性接口": "服务（首页）",
                "景点介绍接口": "旅游攻略页面的推荐攻略内容",
                "云南景点介绍接口": "景点咨询的综合排序（可能）",
                "昆明景点介绍接口": "景点咨询的近期热销（可能）",
                "优选推荐日出日落接口": "风景欣赏（第1个）",
                "优选推荐森林接口": "风景欣赏（第2个）",
                "优选推荐大自然接口": "风景欣赏（第3个）",
                "优选推荐海岸线接口": "风景欣赏（第4个）",
                "梦幻之旅接口": "风景欣赏（最下面的：他们，带你踏上梦幻之旅!）",
                "关于我们介绍接口": "关于我们界面的故事和介绍",
                "入厂物流接口": "物流服务模块解决方案（解决方案页面）",
                "核心内涵接口": "供应链金融（解决方案页面）",
                "首页接口": "顶部导航栏和子级导航栏",
                "邮件综合查询": "搜索和右边三个卡片（首页）",
                "图片接口": "目的地页面里的精选主题第一个切换内容",
                "帆船图片接口": "目的地页面里的精选主题第二个切换内容",
                "雨伞图片接口": "目的地页面里的精选主题第三个切换内容",
                "果盘图片接口": "目的地页面里的精选主题第四个切换内容",
            }
            replaceText(config)
        }

        function replaceC() {
            const config = {
                "GET 分类接口": "首页轮播图左边的一列分类",
                "GET 电脑接口": "首页轮播图右边的分类展示（有图片和文字的）",
                "GET 皮鞋接口": "猜你喜欢和为你推荐（首页）",
                "GET 耳机接口": "目测是购物车页面里的‘买了购物车中商品的人还买了’内容",
                "GET 电视机接口": "目测是购物车页面里的‘买了购物车中商品的人还买了’内容",
                "GET 鞋子的质量问题接口": "爱购社区里的评论内容",
                "GET 手机商品接口": "企业采购的列表",
            }
            replaceText(config)
        }

        function replaceD() {
            const config = {
                "logo接口": "网站logo",
                "轮播图接口": "主页的轮播图",
                "俯卧撑图片接口": "主页推荐的左边的两张图片",
                "问题接口": "主页推荐的中间的文字列表",
                "图片接口": "主页推荐的右边的四张图片列表",
                "天天健身网接口": "也是网站的logo，而且有网站名字，不知道是干嘛的",
                "Logo图片接口": "又是一个banner图片？？有什么用？不知道。",
                "立定跳图片接口": "有六张图片，不知道用在哪里",
                "慢跑等运动接口": "主页的健身计划的右边文字列表",
                "训练项目接口": "主页的训练内容（应该是确定的）",
                "新闻接口": "新闻页面的热点新闻内容",
                "新闻大会接口": "新闻页面的推荐新闻内容",
                "最近更新接口": "新闻页面的最近更新内容",
                "减肥群组接口": "应该是减肥界面的运动减肥的左边的图文内容",
                "减肥接口": "应该是减肥界面的运动减肥的右边的图文内容列表",
                "减肥介绍接口": "应该是减肥界面的运动减肥的右边的图文内容列表（和上面一起的）",
                "小建议接口": "应该是减肥界面的减肥知识 ps:第二个小建议接口是饮食界面的常见食物内容",
                "有氧运动接口": "应该是减肥界面的减肥知识",
                "图片接口2": "",
                "健身接口": "计划界面的切换按钮1-4",
                "健身指南接口": "计划界面底部的内容",
                "图片2接口": "应该是饮食界面的顶部图片",
                "小建议接口2": "",
                "大米食品接口": "饮食界面的按钮切换1",
                "鸡胸肉食品接口": "饮食界面的按钮切换2",
                "黄豆食品接口": "饮食界面的按钮切换3",
                "生菜食品接口": "饮食界面的按钮切换4",
                "植物油食品接口": "饮食界面的按钮切换5",
                "课程接口": "课程界面的学习课程内容",
                "健身课程问题接口": "课程界面的帮助内容",
                "食品大类接口": "应该也是饮食界面的常见食物内容，不知道到底是小建议接口还是这个",
            }
            replaceText(config)
        }

        function replaceE() {
            const config = {
                "金融图片轮询接口": "首页轮播图，和内容一起轮播",
                "视频接口": "首页的视频（其实是图片）",
                "时政头条相关接口": "首页的视频右边的文字列表（跳转详细页可以把数据保存在本地，然后在详细页读取（手动跳转））",
                "主页图和网站相关接口": "顶部的图片，还有一个文字不知道干嘛的",
                "金融文章相关接口": "应该是金融新闻（首页和金融咨询页面的金融新闻）",
                "金融文章标题相关接口": "金融咨询页面左边的金融资讯内容",
                "金融通知公告相关接口": "金融咨询页面右边的金融通知内容",
                "金融海报相关接口": "金融咨询页面右边的《金融时报》数字时报内容",
                "星际创业贷款接口": "行业交流的切换栏1",
                "区块链技术应用接口": "行业交流的切换栏2",
                "投资理财策略接口": "行业交流的切换栏3",
                "气候变化与投资决策接口": "行业交流的切换栏4",
                "关于我们文字接口": "网页底部的三个警察图片",
                "人物简介相关接口": "金融大家页面的图片",
                "主页相关接口": "关于我们图片下面的文字",
                "科普图片接口": "里面有个图片的接口是关于我们的大图",
                "金融科技接口": "关于我们右下角的发展历程里的内容",
                "汤医科普接口": "关于我们右下角的重要公告里的内容（可能）",
                "logo接口": "网站的logo图标",
            }
            replaceText(config)
        }
    }

})();
