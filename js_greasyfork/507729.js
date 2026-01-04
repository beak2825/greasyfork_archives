// ==UserScript==
// @name         导出个人网易云音乐歌单
// @namespace    http://tampermonkey.net/
// @version      2024-09-09
// @description  主要是把网易云音乐歌单导出，将歌单组合成导入QQ音乐的格式，方便导入QQ音乐
// @author       手机千万不要放在外套口袋！！！
// @match        https://music.163.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507729/%E5%AF%BC%E5%87%BA%E4%B8%AA%E4%BA%BA%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/507729/%E5%AF%BC%E5%87%BA%E4%B8%AA%E4%BA%BA%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

let isStart = false
let isFinsh = false

let RESULT = []
let CVR_LIST = []


init()

async function init() {
    initUi()
}

// 初始化ui
function initUi() {
    const htmlStr = `
<div id="_panel" style="width: 260px; display:flex;flex-direction:column; align-items:center;justify-content:center; position: fixed;top:0px;right:20px;z-index:999999;border-radius: 6px;padding: 10px;background-color: #fff;box-shadow: 0 0 10px rgba(0,0,0,.6);">
    <p style="font-size: 16px; color: #000000;margin-bottom: 10px;">请确保当前页面为个人中心页面（https://music.163.com/#/user/home?id=xxxxxx需登录），否则正确导出歌单。 点击查看按钮前需点击开始按钮，如果要关闭查看，只需再次点击查看按钮即可</p>
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <div id="_start" style="padding: 6px 20px; border-radius: 6px; background-color: #ff0000; color: #fff; cursor: pointer;border: 1px solid #ff0000;">开始</div>
        <div id="_download" style="padding: 6px 20px; border-radius: 6px; background-color: #999999; color: #ccc; cursor: pointer;border: 1px solid #999999; margin-left: 20px;">查看</div>
        <div id="_hidden" style="padding: 6px 20px; border-radius: 6px; color: #000000; cursor: pointer; border: 1px solid #000000;margin-left: 20px;">收起</div>
    </div>
    <div id="_info" style="display:none;max-height:400px; overflow-y: auto;">
            <p id="_count" style="text-align: center;margin-bottom: 10px;">共0个歌单</p>
            <p id="_wait" style="text-align: center;margin-bottom: 10px;">请等待...</p>
    </div>
<div>


    `
    const showPanel = `
            <div id="_show_panel" style="display:none;position: fixed;top:0px;right:20px;z-index:999999;padding: 6px 20px; border-radius: 6px; background-color: #ff0000; color: #fff; cursor: pointer;border: 1px solid #ff0000;">显示</div>
    `
    document.body.insertAdjacentHTML('beforeend', htmlStr)
    document.body.insertAdjacentHTML('beforeend', showPanel)

    const sEl = document.querySelector('#_start')
    const dEl = document.querySelector('#_download')
    const cEl = document.querySelector('#_count')
    const hEl = document.querySelector('#_hidden')
    const pEl = document.querySelector('#_panel')
    const showEl = document.querySelector('#_show_panel')

    sEl.addEventListener('click', async () => {
        if(isStart) {
            isStart = false
            sEl.style.background = "#ff0000"
            sEl.style.borderColor = "#ff0000"
            return
        }
        isStart = true
        document.querySelector('#_wait').style.display = 'block'
        sEl.style.background = "#999999"
        sEl.style.borderColor = "#999999"
        sEl.style.color = '#ccc'
        CVR_LIST = getAllcvrlst()
        if(CVR_LIST.length === 0) { 
            isStart = false
            sEl.style.background = "#ff0000"
            sEl.style.borderColor = "#ff0000"
            sEl.style.color = "#ffffff"
            alert('没有歌单，请确保当前页面为存在自定义歌单的个人中心页面，如：https://music.163.com/#/user/home?id=xxxxx')
            return
        }
        cEl.innerText = `共${CVR_LIST.length}个歌单`
        const infoEl = document.querySelector('#_info')
        infoEl.style.display = 'block'
        for await (let item of CVR_LIST) {
            item.list = await getCvrDetail(item.href)
            document.body.removeChild(document.querySelector('#cvr_detail'))
        }
        CVR_LIST.forEach((item,index) => {
            const p = document.createElement('p')
            p.style.color = '#000000'
            p.style.fontSize = '14px'
            p.style.marginBottom = '10px'
            p.id = `_p_${index}`
            p.innerHTML += `<p>${item.title}：共<span style="color: #ff0000;">${item.list.length}</span>首，已完成<span class="percent" style="color: #ff0000;">0%</span></p>`
            infoEl.appendChild(p)
        })
        document.querySelector('#_wait').style.display = 'none'
        RESULT = await handleCvrListData()
        isStart = false
        isFinsh = true
        sEl.style.background = "#ff0000"
        sEl.style.borderColor = "#ff0000"
        sEl.style.color = "#ffffff"
        sEl.style.display = "none"
        dEl.style.background = "#ff0000"
        dEl.style.borderColor = "#ff0000"
        dEl.style.color = "#ffffff"
    })
    dEl.addEventListener('click', async () => {
        if(!isFinsh)  {
            alert('请先点击开始按钮，获取数据')
            return
        }
        if(document.querySelector('#_show_detail')) {
            if(document.querySelector('#_show_detail').style.display !== 'none') {
                document.querySelector('#_show_detail').style.display = 'none'
                return
            } else if(document.querySelector('#_show_detail').style.display === 'none'){
                 document.querySelector('#_show_detail').style.display = 'block'
                 return
            }
            return
        }
        const r = RESULT.join("\n")
        dEl.insertAdjacentHTML('afterend',`
            <div id="_show_detail" style="position: fixed;top: 50%;left:50%;z-index:999999;border-radius: 10px;padding: 20px;background-color: #ffffff;transform: translate(-50%, -50%);">
    <div id="_copy" style="width:fit-content;margin-bottom:10px; padding: 6px 20px; border-radius: 6px; background-color: #ff0000; color: #fff; cursor: pointer;border: 1px solid #ff0000;">复制</div>
    <div  style="white-space: break-spaces;width:900px;height:700px;overflow-y:auto;">
    ${r}
    </div>
</div>
            `)
            document.querySelector("#_copy").addEventListener("click", () => {
                copyToClip(r)
            })

    })

    hEl.addEventListener('click', () => {
        pEl.style.display = 'none'
        showEl.style.display = 'block'
    })

    showEl.addEventListener('click', () => {
        pEl.style.display = 'block'
        showEl.style.display = 'none'
    })

}

// 处理视图更新
function updateView(index, percent) {
    console.log("更新：",index,percent)
    const percentSpan = document.querySelector(`#_p_${index} .percent`)
    percentSpan.innerHTML = `${percent}%`
}

// 获取所有歌单
function getAllcvrlst() {
    const lis = Array.from(document.querySelector('#g_iframe').contentDocument.querySelectorAll('#cBox li'))
    const cvrlst = lis.map(li => {
        const a = li.querySelector('a')
        return {
            title: a.title,
            href: a.href,
            el: a,
            list: []
        }
    })
    return cvrlst
}

// 获取歌单下的所有歌曲
function getCvrDetail(src) {
    return new Promise((res,rej) => {
        try {
            // 创建一个iframe
            const iframe = document.createElement("iframe");
            iframe.src = src
            iframe.id = 'cvr_detail'
            iframe.style = 'display:none'
            document.body.appendChild(iframe)
            iframe.onload = function () {
                iframe.contentWindow.postMessage('loaded', '*');
                const spanInfo = Array.from(iframe.contentDocument.querySelectorAll("#song-list-pre-cache table tr .s-fc3 .opt span:nth-of-type(2)"))
                const result = spanInfo.map(span => ({
                    author: span.dataset.resAuthor,
                    name: span.dataset.resName,
                    pic: span.dataset.resPic,
                    id: span.dataset.resId,
                }))
                res(result)
            }
        } catch (error) {
            rej(e)
        }
    })
}

// 处理数据
function handleCvrListData() {
    return new Promise((res,rej) => {
        try {
            const obj = {
                name: "",
                percent: 0
            }
            const allCvrList = CVR_LIST.map((item,index) => {
                obj['name'] = item.title
                return ({
                    t: item.title,
                    songs: item.list.map(ite => {
                        return `${ite.author} 《${ite.name}》`
                    }),
                    id: index
                })
            }).map((item) => {
                return item.songs.reduce((pre,cur,idx) => {
                    obj['percent'] = Math.round((idx+1)/item.songs.length)*100
                    updateView(item.id,obj['percent'])
                    return pre + cur + '\n'
                },`====${item.t}====\n`)
                // return `${item.t}\n` + item.songs.join('\n')
            })
            console.log(allCvrList)
            res(allCvrList)
        } catch (error) {
            rej(error)
        }
    })
}


function copyToClip(content, message) {
    if(!navigator.clipboard) {
            let txa = document.createElement('textarea')
            txa.value = content
            document.body.appendChild(txa)
            txa.select()
            let res = document.execCommand('copy')
            document.body.removeChild(txa)
            if (message == null) {
                alert("复制成功");
            } else{
                alert(message);
            }
        } else {
            navigator.clipboard.writeText(content).then(() => {
                if (message == null) {
                    alert("复制成功");
                } else {
                    alert(message);
                }
            }).catch(err => {
                console.error('复制失败：', err);
                alert("复制失败");
            });
        }
   
}



})();