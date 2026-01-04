// ==UserScript==
// @name         噼哩噼哩屏蔽唐氏黄豆表情
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  我看见唐氏表情就会死
// @author       SnhAenIgseAl
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502067/%E5%99%BC%E5%93%A9%E5%99%BC%E5%93%A9%E5%B1%8F%E8%94%BD%E5%94%90%E6%B0%8F%E9%BB%84%E8%B1%86%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/502067/%E5%99%BC%E5%93%A9%E5%99%BC%E5%93%A9%E5%B1%8F%E8%94%BD%E5%94%90%E6%B0%8F%E9%BB%84%E8%B1%86%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';



    const emoji = [
        {
            name: '[星星眼]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/63c9d1a31c0da745b61cdb35e0ecb28635675db2.png@48w_48h.webp" alt="[星星眼]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/63c9d1a31c0da745b61cdb35e0ecb28635675db2.png@44w_44h.webp" alt="[星星眼]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[微笑]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/685612eadc33f6bc233776c6241813385844f182.png@48w_48h.webp" alt="[微笑]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/685612eadc33f6bc233776c6241813385844f182.png@44w_44h.webp" alt="[微笑]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[doge]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/3087d273a78ccaff4bb1e9972e2ba2a7583c9f11.png@48w_48h.webp" alt="[doge]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/3087d273a78ccaff4bb1e9972e2ba2a7583c9f11.png@44w_44h.webp" alt="[doge]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[脱单doge]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/bf7e00ecab02171f8461ee8cf439c73db9797748.png@48w_48h.webp" alt="[脱单doge]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/bf7e00ecab02171f8461ee8cf439c73db9797748.png@44w_44h.webp" alt="[脱单doge]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[妙啊]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/b4cb77159d58614a9b787b91b1cd22a81f383535.png@48w_48h.webp" alt="[妙啊]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/b4cb77159d58614a9b787b91b1cd22a81f383535.png@44w_44h.webp" alt="[妙啊]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[呲牙]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/b5a5898491944a4268360f2e7a84623149672eb6.png@48w_48h.webp" alt="[呲牙]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/b5a5898491944a4268360f2e7a84623149672eb6.png@44w_44h.webp" alt="[呲牙]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[偷笑]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/6c49d226e76c42cd8002abc47b3112bc5a92f66a.png@48w_48h.webp" alt="[偷笑]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/6c49d226e76c42cd8002abc47b3112bc5a92f66a.png@44w_44h.webp" alt="[偷笑]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[笑哭]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/c3043ba94babf824dea03ce500d0e73763bf4f40.png@48w_48h.webp" alt="[笑哭]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/c3043ba94babf824dea03ce500d0e73763bf4f40.png@44w_44h.webp" alt="[笑哭]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[辣眼睛]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/35d62c496d1e4ea9e091243fa812866f5fecc101.png@48w_48h.webp" alt="[辣眼睛]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/35d62c496d1e4ea9e091243fa812866f5fecc101.png@44w_44h.webp" alt="[辣眼睛]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[吃瓜]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/4191ce3c44c2b3df8fd97c33f85d3ab15f4f3c84.png@48w_48h.webp" alt="[吃瓜]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/4191ce3c44c2b3df8fd97c33f85d3ab15f4f3c84.png@44w_44h.webp" alt="[吃瓜]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[调皮]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/8290b7308325e3179d2154327c85640af1528617.png@48w_48h.webp" alt="[调皮]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/8290b7308325e3179d2154327c85640af1528617.png@44w_44h.webp" alt="[调皮]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[嗑瓜子]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/28a91da1685d90124cfeead74622e1ebb417c0eb.png@48w_48h.webp" alt="[嗑瓜子]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/28a91da1685d90124cfeead74622e1ebb417c0eb.png@44w_44h.webp" alt="[嗑瓜子]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[脸红]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/0922c375da40e6b69002bd89b858572f424dcfca.png@48w_48h.webp" alt="[脸红]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/0922c375da40e6b69002bd89b858572f424dcfca.png@44w_44h.webp" alt="[脸红]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[抠鼻]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/cb89184c97e3f6d50acfd7961c313ce50360d70f.png@48w_48h.webp" alt="[抠鼻]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/cb89184c97e3f6d50acfd7961c313ce50360d70f.png@44w_44h.webp" alt="[抠鼻]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[思考]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/cfa9b7e89e4bfe04bbcd34ccb1b0df37f4fa905c.png@48w_48h.webp" alt="[思考]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/cfa9b7e89e4bfe04bbcd34ccb1b0df37f4fa905c.png@44w_44h.webp" alt="[思考]" class="bili-rich-text-emoji small">'
        },
        {
            name: '[疼]',
            reTag: '<img class="emoji-small" src="//i0.hdslb.com/bfs/emote/905fd9a99ec316e353b9bd4ecd49a5f0a301eabf.png@48w_48h.webp" alt="[疼]">',
            dyTag: '<img src="//i0.hdslb.com/bfs/emote/905fd9a99ec316e353b9bd4ecd49a5f0a301eabf.png@44w_44h.webp" alt="[疼]" class="bili-rich-text-emoji small">'
        }
    ]



    const observer = new PerformanceObserver(perObs)
	observer.observe({entryTypes: ['resource']})
 
	/**
	 * 过滤非fetch及xhr请求
	 */ 
	function getNetworkRequest(
		entries = performance.getEntriesByType('resource'),
		type = ['fetch', 'xmlhttprequest']) {
			return entries.filter(entry => {
				return type.indexOf(entry.initiatorType) > -1
			})
		}
 
	/**
	 * 监听网络变化
	 */ 
	function perObs(list, obs) {
		let per = getNetworkRequest(list.getEntriesByType('resource'))
 
		for (let i = 0; i < per.length; i++) {
			if (per[i].name.startsWith('https://api.bilibili.com/x/')) {
				fliterEmoji()
			}
		}
	}

    setInterval(fliterEmoji, 4000)

    /**
     * 屏蔽表情
     */
    function fliterEmoji() {
        const dynamicTxt = document.getElementsByClassName('bili-rich-text__content')
        const replyContent = document.getElementsByClassName('reply-content')

        // 动态内容屏蔽
        for (let i = 0; i < dynamicTxt.length; i++) { 
            for (let j = 0; j < emoji.length; j++) {
                dynamicTxt[i].innerHTML = dynamicTxt[i].innerHTML.toString()
                                            .split(emoji[j].dyTag)
                                            .join('')
            }

            // console.log(dynamicTxt[i].innerHTML)
        }

        // 评论屏蔽
        for (let i = 0; i < replyContent.length; i++) { 
            for (let j = 0; j < emoji.length; j++) {
                replyContent[i].innerHTML = replyContent[i].innerHTML.toString()
                                            .split(emoji[j].reTag)
                                            .join('')    
            }

            // console.log(replyContent[i].innerHTML)
        }
    }
})();