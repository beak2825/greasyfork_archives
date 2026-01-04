// ==UserScript==
// @name         截天帝文字文章美化
// @namespace    lianluo/jietiandi
// @version      0.1
// @description  对截天帝论坛的文字文章小说美化，去除干扰的字符，积极开发中，欢迎提出建议。
// @author       lianluo
// @match        https://jietiandi.net/forum.php?mod=viewthread*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480280/%E6%88%AA%E5%A4%A9%E5%B8%9D%E6%96%87%E5%AD%97%E6%96%87%E7%AB%A0%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480280/%E6%88%AA%E5%A4%A9%E5%B8%9D%E6%96%87%E5%AD%97%E6%96%87%E7%AB%A0%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const map = {
        "u4E16": "一",
        "u5371": "十",
        "u737E": "百",
        "u4F63": "你",
        "u6721": "我",
        "u4ED9": "他",
        "u8FD4": "这",
        "u8C11": "谁",
        "u51E3": "几",
        "u5937": "天",
        "u5E77": "年",
        "u6713": "月",
        "u65E8": "日",
        "u681F": "星",
        "u4E7C": "东",
        "u4E5D": "中",
        "u527D": "前",
        "u5DE4": "左",
        "u768B": "王",
        "u7497": "男",
        "u5C64": "岁",
        "u59FD": "国",
        "u5E07": "市",
        "u3BB6": "家",
        "u9EBA": "人",
        "u53E7": "口",
        "u637B": "手",
        "u7291": "爸",
        "u6C99": "水",
        "u936D": "饭",
        "u59DC": "菜",
        "u9632": "酒",
        "u94B8": "钱",
        "u5768": "元",
        "u8347": "衣",
        "u673C": "楼",
        "u5BA7": "室",
        "u5BA9": "路",
        "u5E46": "店",
        "u8F27": "车",
        "u4E7A": "个",
        "u4EF9": "件",
        "u65A2": "斤",
        "u7C38": "米",
        "u6B92": "次",
        "u6736": "有",
        "u675F": "是",
        "u537C": "听",
        "u8BF7": "说",
        "u740B": "看",
        "u5467": "吃",
        "u587D": "喝",
        "u517A": "做",
        "u6236": "打",
        "u5B71": "学",
        "u4E27": "买",
        "u9ED5": "给",
        "u6792": "来",
        "u4731": "去",
        "u6479": "出",
        "u7E0A": "上",
        "u8D30": "走",
        "u5F46": "开",
        "u97FD": "能",
        "u3F6A": "会",
        "u5729": "大",
        "u519A": "多",
        "u95E6": "早",
        "u8AD9": "高",
        "u70D8": "胖",
        "u8198": "老",
        "u759F": "长",
        "u964D": "白",
        "u966D": "甜",
        "u799F": "饿",
        "u61A7": "热",
        "u759D": "好",
        "u56B0": "新",
        "u3BF5": "对",
        "u3F7E": "美",
        "u6593": "不",
        "u3934": "没",
        "u5F66": "很",
        "u7E4F": "也",
        "u1947": "都",
        "u925F": "就",
        "u462D": "才",
        "u854C": "和",
        "u8752": "在",
        "u8D85": "向",
        "ue23e": "从",
        "u4BD6": "比",
        "u7E2A": "为",
        "u4784": "的",
        "u7F95": "得",
        "u6E48": "了",
        "u9A5B": "着",
        "u7FC8": "过",
        "uC858": "呢",
        "u7415": "吗"
        }
        
    
    document.onreadystatechange = function(){
        if(document.readyState === 'complete') {
            /**
             * 遍历t_f的childNodes
             * 如果节点是style 就跳过
             * 如果节点是font 就跳过
             * 如果节点是br 下一个文字节点增加换行符
             * 如果是文本节点
             *      删除文字左侧的标点
             * 如果是span
             *      根据map找到before表示的汉子
             * 
             */
            
            const t = document.querySelector('.t_f')
            const read = document.querySelector('.read')
            let str = ''
 
            const dom = t.querySelector('.jammer')
            const box = dom.parentNode
   
        
            for(let i = 0; i < t.childNodes.length; i++){
                const node = t.childNodes[i]
                if(node.nodeName === 'FONT'){
                    continue
                }
                if(node.nodeName === 'BR'){
                    str += '<br />'
                }
                if(node.nodeName === '#text'){
                    let s = node.textContent.trim()
 
                    let text = ''
                    
                    let p1 = s.search(/[\u4e00-\u9fa5]+/)
 
                    if(p1 >= 0){
                        let p2 = s.lastIndexOf('......', p1) // .的位置                    
                        if(p2 >= 0){
                            text = s.substring(p2 + 6)
                        }else {
                            text = s
                        }
                        let p3 = text.lastIndexOf('.') // 句尾 .的位置
                        if(p3 >= 0){
                            text = text.substring(0, p3)
                        } 
                       
                    }
                    
                    
                  
                    str += text
 
                }
                if(node.nodeName === 'SPAN'){
                    const c = window.getComputedStyle(node, ':before').content.replace(/"/g, '')
                    const code = escape(c).substr(1)
                    str += map[code]
                }
            }
 
            // read.innerHTML = str
            t.style.display = 'block' 
            t.style.width = '500px'
            t.style.margin = '0 auto'
            t.style.fontSize = '24px'
            t.innerHTML = str
 
        }
    }
    // Your code here...
})();