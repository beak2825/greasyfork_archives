// ==UserScript==
// @name         b站评论区 用文本显示永雏塔菲表情包
// @namespace    https://greasyfork.org/zh-CN/scripts/443756
// @version      1.3
// @description  在b站评论区使用永雏塔菲的表情包
// @author       fc
// @match        https://www.bilibili.com/video/**
// @match        https://t.bilibili.com/**
// @match        https://www.bilibili.com/read/**
// @icon         https://i0.hdslb.com/bfs/emote/182f48b6521d53ceb27f4947141326d46360710b.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443756/b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%20%E7%94%A8%E6%96%87%E6%9C%AC%E6%98%BE%E7%A4%BA%E6%B0%B8%E9%9B%8F%E5%A1%94%E8%8F%B2%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/443756/b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%20%E7%94%A8%E6%96%87%E6%9C%AC%E6%98%BE%E7%A4%BA%E6%B0%B8%E9%9B%8F%E5%A1%94%E8%8F%B2%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==


(function() {
    'use strict';
let style = document.createElement('style')
style.type = 'text/css';
style.innerHTML = `
    .bb-comment .comment-list .list-item .text_replaced {
	    position: relative;
	    z-index: 2;
	    line-height: 20px;
	    padding: 2px 0;
	    font-size: 14px;
	    text-shadow: none;
	    overflow: hidden;
	    word-wrap: break-word;
	    word-break: break-word;
	    white-space: pre-wrap;
	    width:
	}
	.bb-comment .comment-list .list-item .user .text-con_replaced {
	    font-weight: normal;
	    font-size: 14px;
	    line-height: 20px;
	    white-space: pre-wrap;
	    margin-left: 16px;
	}
	.bb-comment .comment-list .list-item .text_replaced img, .bb-comment .comment-list .list-item .text-con_replaced img {
	    vertical-align: text-bottom;
	    padding: 0 1px;
	    width: 50px;
	    height: 50px;
	}
	.bb-comment .comment-list .list-item .text_replaced img.small, .bb-comment .comment-list .list-item .text-con_replaced img.small {
	    width: 20px;
	    height: 20px;
	}
	.bb-comment .comment-list .list-item .text_replaced .jump-img, .bb-comment .comment-list .list-item .text-con_replaced .jump-img {
	    width: 20px;
	    height: 20px;
	    vertical-align: middle;
	}
`
document.querySelector('head').appendChild(style)

//const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay)) //https://segmentfault.com/a/1190000023490085

var f = function($1){
    var str = $1
    var key =  str.substring(str.search(/[_\-—]/)+1,str.length-1)
    for (var i in sets){
    	if (key in eval(sets[i])){
    		return '<img src="' + url + sets[i] + '/' + eval(sets[i])[key] + '.png@100w_100h.webp" alt="[永雏塔菲_' + key + ']" />'
    	}
    }
    return str//未检索到 原样返回
}

var url = 'https://i0.hdslb.com/bfs/'
var re = /(?<!(?:alt="))[【\[(（](永雏塔菲|[Tt]affy)[_\-—]\S{1,5}[】\])）]/g
var sets = ['emote', 'article', 'album']
var emote = {//装扮表情
	'NO喵!':'78e23445bf2ab026a4bc1ff6ff1945a3294b2375',
	'不理你了':'ec38a461c767fd0f4dee7346f82d81e5a88b176c',
	'嘲笑':'094c321f0829f0894f48195d6671358a1a43b53c',
	'喵喵拳':'897da2e9d791d4ec7d3d84a4dc5fd54b6abe004c',
	'对呀对呀':'37afa9e099d0c2ca9a4f3ff7d599e86060d6b942',
	'尴尬':'71a5b730a3c20ddac64f8e7803ffc00da97f7397',
	'哈哈哈':'b1f89d85b9c9f8553fe021c1e5785bc2995f8751',
	'好热':'b2038b7d4a30c6b65e4ce678ada349bc82bf0749',
	'呼呼喵':'0b006dc1e66f403931520da32003b42f29357276',
	'开派对咯':'182f48b6521d53ceb27f4947141326d46360710b',
	'累':'889f95e3b36f257cb6b68f420b8238a11c596d19',
	'令人兴奋':'c091fdfa02cfc3cbf6795d450300481d8116821c',
	'摸头':'a826477acfa607224dd4a6771431af3b18ee8f92',
	'亲嘴':'ce2123ec6b4f15eb8dfc2467f36fa3d69f2f97cd',
	'闪亮登场':'c7eff8db64b132e6757bacdd51e649e16965f6b9',
	'生日快乐':'9daed0ba16c89f983c7fcfa38e2bc8d1b80f7957',
	'太好吃了':'86b760ed0a466b5dc3fa0b1e64b9ba7d6b53b6ed',
	'我帅吗':'ff9a88e47b8afb26241953235c16d68a9505f931',
	'嘻嘻喵':'866c99dbf6cb5e054e8e94be60c1b37ff4581eaa',
	'星星眼':'bf3e961a1c3d4edf5ebdd063418495a1ed4c865f',
	'疑惑':'a1fef90f7864d68a141a0a233229dfb7dbe28f36',
	'嘤嘤嘤':'ba43546b013efffa7821dc21df6c79490cbafe72',
	'有鬼':'b33d0672a01810a6b26696bf4a56204dadd5ff31',
	'晕了':'d395fd944642b882a9226db81dcfa2e80307461c',
	'震惊':'36bea35a3a15b675b2f5f28529582f82cf65b1c9',
	//下面是别称适配
	'流汗':'71a5b730a3c20ddac64f8e7803ffc00da97f7397',
	'嘻嘻':'866c99dbf6cb5e054e8e94be60c1b37ff4581eaa',
	'嘤嘤':'ba43546b013efffa7821dc21df6c79490cbafe72',
	'大哭':'ba43546b013efffa7821dc21df6c79490cbafe72',
	'NO喵':'78e23445bf2ab026a4bc1ff6ff1945a3294b2375',
	'NO喵！':'78e23445bf2ab026a4bc1ff6ff1945a3294b2375',
	'NO':'78e23445bf2ab026a4bc1ff6ff1945a3294b2375',
	'no':'78e23445bf2ab026a4bc1ff6ff1945a3294b2375',
	'no喵':'78e23445bf2ab026a4bc1ff6ff1945a3294b2375'
}
var article = {//专栏发的 https://www.bilibili.com/read/cv16107536
	'散步':'288df4c494e44e55dfef9a5f7ca12cca8881ae21',
	'主人':'b51e3900acec90298f54ff70c34cb48fa75bd0d4',
	'耶咿！':'2a09356df34cdbe848dae87815f6729a88d65259',
	'呜呜呜':'2eae8b390516d8c332ee527ae38ced5bd80ded26',
	'晚上花':'dae460edf011b32d8979a4af8d9e0966e94da242',
	'投降':'16ff5ea4d1cef60a3811b86e70e137ed4703ea02',
	'收收味':'7b6dd8d7061cd30f9342739503778e22e9059704',
	'切割':'d9645e5680ec40c4393c505fc9481d9d0a5e7449',
	'嗯打游戏':'2180daaeb220ffe205011449055143376f1f98f1',
	'k48':'3852dd0b53842bf051827af91008b218d50e32b4',
	'好听':'e8face3200ae9883d5efde23fdb17f705a56d79a',
	'你好嘴里':'66e07609db8b950193dfbfe2f76d3c8e00d01bcd',
	'回私信':'f9a9a6f33768ec68fbbfb12a1e12efbd1b2e05f7',
	'活下去':'81ae056192b7f044665c54ed84221f2b42b7db59',
	'加油喵':'9b5dcea000af2c986a4291ab772c5a0de7079a84',
	'好似喵':'942c1f4c0233a1f76bdca36ae10688de1c654ea3',
	'留条命':'62f7bfbbc63e72f71c164ae0200b00ce96ccaa87',
	'路段':'4eb3ba6e22da47d7615fd1062078d3c156a8766a',
	'嫌弃':'c666f550f381523ff393022e017f8629d1975872',
	'嗯！':'6f61f4cbd35f91b0b019835a7c89a9b09147bf53',
	'857':'0f973f89a83b02be65d08b03d398a49a26cf737a',
	'mua喵':'1ed178a657b0064b797d31f313b4f7e2ca5ac957',
	'白白喵':'0b11e6e3d25d7c55e101c42ee271f3759ce06ec3',
	'爆金币咯':'dbf66951cbb5bae3b8467ec434c95c2fc150e0ff',
	'别急':'781d17bdc5cbb84a384c7e8e2d61da7504a7800b',
	'不敢想了':'09f9e128702a780bf9e0ca1ec0afa5e818751f92',
	'不玩儿了':'ecbe5f78a9a5dd84473fa8d9f95261cdfb84c8ce',
	'草喵':'fa365dda726c6ba115abca07821c511d38b0f6ff',
	'超塔菲':'fbd14a7079f58d9d0a94af8b127e1504022765a1',
	'吹爆':'35702cd8616d187002b5a78609ddf150fbce8070',
	'大骗子':'51801c37f5ca27a989aa8985b3902c6595474c5b',
	'疑惑2':'99f8cd71f00d998a809f60bc35f3aa75642cec33',
	'单推塔菲':'97b8c33c802b673a0e323f6055111a6fc921f2a7',
	'愤怒愤怒！':'a0324fab117d118b3cfce0e7ca9206ce1f43a15a',
	'高伤害':'79e8cdf53664ba75292773cb705fa4852f14c833',
	//下面是别称适配
	'汪汪':'288df4c494e44e55dfef9a5f7ca12cca8881ae21',
	'汪汪汪':'288df4c494e44e55dfef9a5f7ca12cca8881ae21',
	'耶':'2a09356df34cdbe848dae87815f6729a88d65259',
	'耶咿':'2a09356df34cdbe848dae87815f6729a88d65259',
	'呜呜':'2eae8b390516d8c332ee527ae38ced5bd80ded26',
	'打游戏':'2180daaeb220ffe205011449055143376f1f98f1',
	'游戏':'2180daaeb220ffe205011449055143376f1f98f1',
	'mua':'1ed178a657b0064b797d31f313b4f7e2ca5ac957',
	'白白':'0b11e6e3d25d7c55e101c42ee271f3759ce06ec3',
	'拜拜喵':'0b11e6e3d25d7c55e101c42ee271f3759ce06ec3',
	'拜拜':'0b11e6e3d25d7c55e101c42ee271f3759ce06ec3',
	'再见':'0b11e6e3d25d7c55e101c42ee271f3759ce06ec3',
	'爆金币':'dbf66951cbb5bae3b8467ec434c95c2fc150e0ff',
	'不玩了':'ecbe5f78a9a5dd84473fa8d9f95261cdfb84c8ce',
	'草':'fa365dda726c6ba115abca07821c511d38b0f6ff',
	'草苗':'fa365dda726c6ba115abca07821c511d38b0f6ff',
	'早苗':'fa365dda726c6ba115abca07821c511d38b0f6ff',
	'笛子':'35702cd8616d187002b5a78609ddf150fbce8070',
	'吹笛子':'35702cd8616d187002b5a78609ddf150fbce8070',
	'?':'99f8cd71f00d998a809f60bc35f3aa75642cec33',
	'单推':'97b8c33c802b673a0e323f6055111a6fc921f2a7',
	'愤怒愤怒':'a0324fab117d118b3cfce0e7ca9206ce1f43a15a',
	'愤怒愤怒!':'a0324fab117d118b3cfce0e7ca9206ce1f43a15a',
	'愤怒':'a0324fab117d118b3cfce0e7ca9206ce1f43a15a',
	'愤怒！':'a0324fab117d118b3cfce0e7ca9206ce1f43a15a',
	'愤怒!':'a0324fab117d118b3cfce0e7ca9206ce1f43a15a',
	'生气':'a0324fab117d118b3cfce0e7ca9206ce1f43a15a',
	'gsh':'79e8cdf53664ba75292773cb705fa4852f14c833',
	'ghs':'79e8cdf53664ba75292773cb705fa4852f14c833'
}
var album = {//一些别的表情包
	'还能说话吗':'5e54d0cc48c8b8f05f22e967e1bd2b305ec0efef',
	'嗯':'2bf1a170a4d3442acce06255d1742223d40587af'
}
var sail = document.createElement("div")
sail.setAttribute('class','sailing')
sail.innerHTML = '<img class="sailing-img" src="//i0.hdslb.com/bfs/garb/item/5b1bf4bf5963d5905207a243bcc5ec38498ec46f.png@576w_96h.webp" alt="永雏塔菲"><div class="sailing-info" style="color:#ff8ab3">NO.<br>114514</div>'

setInterval(function(){
	var texts = document.getElementsByClassName('text')
	var textcons = document.getElementsByClassName('text-con')
    while (texts.length + textcons.length){
		if (texts.length){
			if (texts[0].innerHTML.search(re) != -1){
				texts[0].innerHTML = texts[0].innerHTML.replace(re, f)
				if (texts[0].previousElementSibling.getElementsByClassName('sailing').length == 0){
					texts[0].previousElementSibling.appendChild(sail)
				}
				if(texts[0].previousElementSibling.getElementsByClassName('sailing')[0].innerHTML.indexOf('永雏塔菲') == -1){
					texts[0].previousElementSibling.getElementsByClassName('sailing')[0].innerHTML = sail.innerHTML
				}
			}
			texts[0].className = texts[0].className + '_replaced'
		}
		if (textcons.length){
			if (textcons[0].innerHTML.search(re) != -1){
				textcons[0].innerHTML = textcons[0].innerHTML.replace(re, f)
			}
			textcons[0].className = textcons[0].className + '_replaced'
		}
	}
}, 1200); //循环周期 单位毫秒

})();