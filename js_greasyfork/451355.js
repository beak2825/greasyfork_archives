// ==UserScript==
// @name         Ctrl+X键筛选知乎高产且有影响力用户
// @namespace    https://mr-metasequoia.github.io/zhihunb
// @version      0.3.1
// @description  在知乎打开某个用户主页→关注后，按下Ctrl+X键(或⌘+X键)根据TA的关注列表，筛选出高产且有影响力👍的其他用户，作为参考以丰富自己的关注列表。关注者和回答数量的阈值可调。
// @author       水杉metasequoia
// @match        https://www.zhihu.com/people/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/451355/Ctrl%2BX%E9%94%AE%E7%AD%9B%E9%80%89%E7%9F%A5%E4%B9%8E%E9%AB%98%E4%BA%A7%E4%B8%94%E6%9C%89%E5%BD%B1%E5%93%8D%E5%8A%9B%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/451355/Ctrl%2BX%E9%94%AE%E7%AD%9B%E9%80%89%E7%9F%A5%E4%B9%8E%E9%AB%98%E4%BA%A7%E4%B8%94%E6%9C%89%E5%BD%B1%E5%93%8D%E5%8A%9B%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

//关注者和回答数量设置
var gzzlimit = 30000
var hdlimit = 200
var undo = true

function find()
{
    if(undo){
        var out = 0
        var other = 0
        if(document.getElementsByClassName(" css-0")[0].innerText.match(/回答了问题|发布了想法|发表了文章/g)!=null)
        {
            out = document.getElementsByClassName(" css-0")[0].innerText.match(/回答了问题|发布了想法|发表了文章/g).length
        }
        if(document.getElementsByClassName(" css-0")[0].innerText.match(/收藏了回答|赞同了回答/g)!=null)
        {
            other = document.getElementsByClassName(" css-0")[0].innerText.match(/收藏了回答|赞同了回答/g).length
        }
        console.log(out,other)

        if(out>=other)
        {
            document.getElementsByClassName("ProfileHeader-name")[0].innerHTML = "【内容输出型】" + document.getElementsByClassName("ProfileHeader-name")[0].innerHTML
        }else
        {
            document.getElementsByClassName("ProfileHeader-name")[0].innerHTML = "【常规型】" + document.getElementsByClassName("ProfileHeader-name")[0].innerHTML
        }
        undo = false
    }

    var people = document.getElementsByClassName("ContentItem-head")
    for(let i=0;i<people.length;i++)
    {
        var gzz = people[i].innerHTML.match(/[0-9|,]+\x20关注者/g)
        gzz[0] = gzz[0].replace(/,/g,'').replace(/关注者/g,'')
        var intgzz = parseInt(gzz[0])

        var hd = people[i].innerHTML.match(/[0-9|,]+\x20回答/g)
        if(hd==null)
        {
            hd = '0'
        }
        hd[0] = hd[0].replace(/,/g,'').replace(/回答/g,'')
        var inthd = parseInt(hd[0])

        if(intgzz>gzzlimit && inthd>hdlimit)
        {
            document.getElementsByClassName("ContentItem-head")[i].innerHTML = people[i].innerHTML.replace(/(<span class="UserLink">)/g,'<span style="color:red">高产且有影响力用户&nbsp;</span>$1')
        }
    }
}

(function() {
    document.addEventListener('keydown',e=>{
    const { ctrlKey , metaKey, key } = e;
    if( ctrlKey || metaKey )//按下Ctrl键+X，或mac系统的⌘键+X
        {
            if(key === 'x')//x的意思是抽象手势“哒咩！”，好按并避免和知乎的快捷键冲突。杂鱼答主退散！
            {
                find()
            }
        }
    })
})();