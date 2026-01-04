// ==UserScript==
// @name         四川轻化工大学辅助签到
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自用，仅供学习交流
// @author       litclus
// @match        https://qfhy.suse.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @icon         https://qfhy.suse.edu.cn/edu/admin/logo.svg
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541173/%E5%9B%9B%E5%B7%9D%E8%BD%BB%E5%8C%96%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541173/%E5%9B%9B%E5%B7%9D%E8%BD%BB%E5%8C%96%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

const GM_request = (params) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest(Object.assign({}, params, {
            onload: e=>{
                if(e.status != 200){
                    reject()
                    return
                }
                try {
                    resolve(JSON.parse(e.response))
                }catch(err) {
                    reject(err)
                }
            }, onerror: reject
        }))
    })
}


(function() {
    'use strict';

    let data = []
    // 需要新增或者自定义 就添加location_all和campus_all这里的参数就可以了
    const location_all = {
        宜宾: [[104.659500, 104.683000],[28.795200, 28.816000]],
        // 李白河: [[104.659500, 104.683000],[28.795200, 28.816000]]
    }
    const campus_all = {
        宜宾: "四川省宜宾市翠屏区白沙湾街道芭茅田四川轻化工大学宜宾校区",
        // 李白河: "四川省宜宾市翠屏区白沙湾街道芭茅田四川轻化工大学宜宾校区"
    }
    let userSelect = GM_getValue("user-select") || "宜宾"

    const observerTitle = new MutationObserver(function(mutations) {
        const element = document.querySelector(".listArea")
        if (element) {
            observerTitle.disconnect()

            const div = document.createElement("div")
            Object.assign(div.style, {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px"
            })

            const span = document.createElement("span")
            span.innerText = "欢迎使用辅助签到"
            Object.assign(span.style, {
                fontSize: "24px",
                fontWeight: "bold",
                color: "red"
            })

            const select = document.createElement("select")
            select.onclick = e => {
                userSelect = e.target.value
                GM_setValue("user-select", e.target.value)
            }
            Object.assign(select.style, {
                margin: "0 12px",
                fontSize: "14px"
            })

            for (const key in campus_all) {
                const option = document.createElement("option")
                option.innerText = key
                option.setAttribute("value", key)
                if(userSelect == key) option.setAttribute("selected", "")
                select.appendChild(option)
            }

            div.appendChild(span)
            div.appendChild(select)
            element.prepend(div)
        }
    })

    observerTitle.observe(document.body, {
        childList: true,
        subtree: true
    })

    function getRandomCoordinate(campus) {
        // 经度范围
        const minLon = location_all[campus][0][0]
        const maxLon = location_all[campus][0][1]

        // 纬度范围
        const minLat = location_all[campus][1][0]
        const maxLat = location_all[campus][1][1]

        // 生成6位小数精度的随机经度
        const randomLon = (Math.random() * (maxLon - minLon) + minLon).toFixed(6)

        // 生成6位小数精度的随机纬度
        const randomLat = (Math.random() * (maxLat - minLat) + minLat).toFixed(6)

        return [parseFloat(randomLon), parseFloat(randomLat)]
    }

    const observerItem = new MutationObserver(async function(mutations) {
        const elements = document.querySelectorAll(".renwuItem")
        if(elements.length) {
            observerItem.disconnect()
            try {
                data = (await GM_request({
                    url: "https://qfhy.suse.edu.cn/xg/qddk/qdrw/api/myList.rst?status=1",
                    method: "GET"
                }))?.result?.data ?? []
                console.table(data)
            }catch(err){
                if(confirm("获取签到任务列表失败，请尝试刷新当前页面")){
                    window.location.reload()
                }
            }

            elements.forEach((item, index)=>{
                const div = document.createElement("div")
                Object.assign(div.style, {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "12px"
                })

                const inner_div = document.createElement("div")
                if(/晚签/g.test(data[index].rwmc) && /定位/g.test(data[index].qdlx)) {
                    const button = document.createElement("button")
                    button.innerText = "辅助签到"
                    button.onclick = e => {
                        e.stopPropagation()

                        if(dayjs().isBefore(dayjs(`${data[index].needTime}T${data[index].qdkssj}`))){
                            alert("当前时间早于你选中的签到任务规定时间")
                            return
                        }
                        if(!confirm("即将进行签到任务")) return

                        const params = {
                            id: data[index].id,
                            qdzt: 1,
                            qdsj: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            isOuted: 0,
                            isLated: 0,
                            dkddPhoto: "",
                            txxx: "",
                            qdddjtdz: campus_all[userSelect],
                            location: JSON.stringify({
                                point: getRandomCoordinate(userSelect),
                                address: campus_all[userSelect]
                            })
                        }

                        GM_request({
                            url: "https://qfhy.suse.edu.cn/xg/qddk/qdrw/api/checkSignLocationWithPhonto.rst",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            data: JSON.stringify(params)
                        }).then(res=>{
                            if(res?.result?.data) {
                                alert("签到成功！")
                                window.location.reload()
                            }else {
                                alert("签到失败！")
                            }
                        }).catch(()=>{
                            alert("签到失败！")
                        })
                    }
                    inner_div.appendChild(button)
                }

                div.appendChild(inner_div)
                item.appendChild(div)
            })
        }
    })

    observerItem.observe(document.body, {
        childList: true,
        subtree: true
    })
    // Your code here...
})();