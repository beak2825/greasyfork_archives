// ==UserScript==
// @name         幻书公告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  幻书启世录公告转换
// @author       Elmeir
// @match        https://h62.update.netease.com/game_notice/notice_formal
// @icon         https://i2.hdslb.com/bfs/face/e9446eb7392ed509ea7d4201b82dc017abba8699.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427942/%E5%B9%BB%E4%B9%A6%E5%85%AC%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/427942/%E5%B9%BB%E4%B9%A6%E5%85%AC%E5%91%8A.meta.js
// ==/UserScript==

window.onload = (function() {
    function getContentForNGA() {
        var d = document.getElementsByTagName('pre')[0]
        var original = d.innerText
        var title_first = ''
        var result= ''
        var text = original.replace('<?xml version="1.0" ?>\n','').replace('<root>\n','').replace(/<md5>.*?<\/md5>\n/g,'') //去除无关格式
        var chapter = text.match(/<chapter>.*?<\/chapter>/gs) //匹配所有chapter
        for (var i =0 ;i < chapter.length;i++){ //遍历chapter
            var c = chapter[i] //每次循环中的chapter为c
            var title_one = ''
            var title_two = '' //重置标题内容
            if (c.match(/<applicable_channel>\(\'1\', \'2\', \'1000\'/)){ //只获取官服公告
                c = c.replace(/<_id>.*?<\/_id>\n/,'') //去除ID
                c = c.replace(/<notice_type>1<\/notice_type>\n/,'') //去除notice_type 全是1暂时判断不出用处
                c = c.replace(/<applicable_channel>.*?<\/applicable_channel>/) //去除公告频道
                if (c.match(/<title_one>(.*?)<\/title/)){
                    title_one = '[size=160%][color=orangered]' + RegExp.$1 + '[/color][/size]\n' //标题1 160%大小 橘色
                    if (i==0){ title_first = '[新闻搬运]' + RegExp.$1 + '\n\n' } //首个标题1作为整体标题
                }
                if (c.match(/<title_two>(.*?)<\/title/)){
                    title_two = '[size=130%][color=darkred]' + RegExp.$1 + '[/color][/size]\n' //标题2 130%大小 暗红色
                }
                var content = c.match(/<content>(.*?)<\/content>/s)[1]
                content = content.replace(/#cd34322(.*?)#/g,'[color=red]$1[/color]#') //特殊颜色转换
                content = content.replace(/#c564F5B/g,'') //清理默认颜色
                content = content.replace('欢迎添加官方QQ群（392436234 或 792983662 或 941805413 或 618587414 或 924440092）进行交流反馈。','') //去除官方Q群
                result = result + title_one + title_two + content + '\n'
            }
        }
        result =title_first + result.replace(/&amp;/g,'&') //转义html字符
        d.innerText = '---NGA code---\n\n' + result + '\n\n ---以下是原内容---\n\n' + original //替换innerText 加入nga格式
        console.log(result)
    }
    getContentForNGA()
})();