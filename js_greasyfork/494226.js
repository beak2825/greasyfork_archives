// ==UserScript==
// @name         2025年BM教育考试自动答题-中国保密在线网
// @namespace    Ne-21
// @version      0.1.4
// @description  2025年BM教育线上培训考试自动答题
// @author       Ne-21
// @match        *://*.baomi.org.cn/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494226/2025%E5%B9%B4BM%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/494226/2025%E5%B9%B4BM%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91.meta.js
// ==/UserScript==

let _d = window.document
let routerAfHooks = _d.querySelector('#app').__vue__.$router.afterHooks

if (routerAfHooks && routerAfHooks[0]) {
    let oldfunc = routerAfHooks[0]
    routerAfHooks[0] = (...args) => {
        if (args[0].path == "/bmExam") {
            ELEMENT.MessageBox.alert("点击确定，三秒后开始自动作答，此脚本不存在任何逆向操作，答案为后端返回且在开发者控制台可以找到对应的JSON数据包。").then(()=>{
                setTimeout(()=>{
                    let qlist = _d.querySelectorAll("#questionListDiv > li > ul > li")
                    let alist = _d.querySelector("#nav > div > div.pageBox > div.container1_box > div > div").__vue__.$data.examContents
                    let aindex = {"A":0,"B":1,"C":2,"D":3}
                    qlist.forEach((item,i) => {
                        let a_index = aindex[alist[i].answer]
                        let xlist = item.querySelectorAll("label")
                        xlist[a_index].click()
                    });
                },3000)
            })
        }
        return oldfunc.call(this,...args)
    } 
}