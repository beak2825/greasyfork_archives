// ==UserScript==
// @name         B站评论区过滤
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  正则过滤B站评论
// @author       _Gliese_
// @match        *://*.bilibili.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @run-at       document-body
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/432454/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/432454/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {

    // Your code here...
    const configItems = ['filter-regex']
    let userConfig = {}

    const getConfig = () => { // 获取配置
    	configItems.forEach(item => {
    		let text = GM_getValue(item)
    		if(text){
				$('#comment-filter-form #' + item).val(text)
				userConfig[item] = text
			}
    	})
    }
    const setConfig = (config) => {
    	configItems.forEach(item => {
    		GM_setValue(item, config[item])
    		userConfig[item] = config[item]
    	})
    }

    const filterMain = () => { // 过滤主楼评论
    	let hasConfig = userConfig['filter-regex'] && userConfig['filter-regex'] !== ''
    	let mainNodes = $('.comment-list .list-item')
    	for(let i = 0; i < mainNodes.length; ++i) {
    		let commentItem = mainNodes[i]
    		let commentText = commentItem.children[1].children[1].innerText
    		if(commentText.search(new RegExp(userConfig['filter-regex'])) !== -1 && hasConfig) { // 匹配成功，将主楼设置为不可见
    			commentItem.style.display = 'none'
    		} else { // 设置为可见（防止过滤字符改变后某些楼需要显示）
    			commentItem.style.display = ''
    		}
    	}
    }
    const filter = () => { // 调用过滤操作
    	filterMain()
    }

    const mount = () => { // 初始化
    	let style = `
    		<style>
    			#comment-filter-form {
    				position: fixed;
    				top: 80px;
    				left: 15px;
    				z-index: 9999;
    			}
    			#comment-filter-form button {
    				background-color: #79bbff;
    				color: white;
    				border: none;
    				padding: 5px;
    			}
    			#comment-filter-form .filter-form {
    				position: fixed;
    				display: none;
    				left: 15px;
    				padding: 10px;
    				background-color: white;
    				border: 1px solid black;
                    border-radius: 5px;
    			}
    			#comment-filter-form #filter-save {
    				margin-top: 10px;
    			}
                #comment-filter-form .filter-input {
                    min-width: 250px;
                    min-height: 60px;
                    border-radius: 5px;
                    padding: 5px;
                }
    		</style>
    	`
    	$('head')
	    .append(style)
    	let form = `
	    	<div id="comment-filter-form">
	    		<button id="form-control">打开控制面板</button>
	    		<div class="filter-form">
	    			<div class="filter-form-item">
	    				<h4 class="filter-title">正则屏蔽:</h4>
	    				<textarea class="filter-input" id="filter-regex" />
	    			</div>
	    			<button id="filter-save">保存</button>
	    		</div>
	    	</div>
	    `
        if (self == top) { // 判断是否是在主页面(B站的消息和动态是放在iframe中的)
            $('body')
            .append(form)
        }
    }
    const addListeners = () => { // 监听
    	$('#comment-filter-form #form-control')
	    .on('click', () => {
	    	let text = $('#comment-filter-form #form-control').text()
	    	if(text === '打开控制面板') {
	    		$('#comment-filter-form #form-control').text('关闭控制面板')
	    		$('#comment-filter-form .filter-form')
	    		.css({'display': 'block'})
	    	} else {
	    		$('#comment-filter-form #form-control').text('打开控制面板')
	    		$('#comment-filter-form .filter-form')
	    		.css({'display': 'none'})
	    	}
	    })
	    $('#comment-filter-form #filter-save')
	    .on('click', () => {
	    	let config = {}
	    	configItems.forEach(item => {
	    		config[item] = $('#comment-filter-form #' + item).val()
	    	})
	    	setConfig(config)
	    	filter()
	    })
    }

    mount()
    addListeners()
    getConfig()
    setInterval(() => {
        filter()
    }, 1000)
})()