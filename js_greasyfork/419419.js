// ==UserScript==
// @name         浙江理工大学体育理论考试辅助脚本-自动作答、记录、恢复-SL大法好
// @namespace    https://eliotzhang.cn
// @homepage     https://eliotzhang.cn
// @version      3.0
// @description  从题库提取答案, 保存写过的题目答案，并自动填写。在此感谢免费题库脚本作者！
// @author       EliotZhang
// @match        http://tygl.zstu.edu.cn/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/419419/%E6%B5%99%E6%B1%9F%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC-%E8%87%AA%E5%8A%A8%E4%BD%9C%E7%AD%94%E3%80%81%E8%AE%B0%E5%BD%95%E3%80%81%E6%81%A2%E5%A4%8D-SL%E5%A4%A7%E6%B3%95%E5%A5%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/419419/%E6%B5%99%E6%B1%9F%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC-%E8%87%AA%E5%8A%A8%E4%BD%9C%E7%AD%94%E3%80%81%E8%AE%B0%E5%BD%95%E3%80%81%E6%81%A2%E5%A4%8D-SL%E5%A4%A7%E6%B3%95%E5%A5%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let EZ = '------浙理体育脚本 by EliotZhang------\n'
    var titles = null
    var length = 0

    function get_ans(k) {
        var st = titles[k].nextSibling.nextSibling
        var ans = ''
        while (st.style.length > 0) {
            if (st.firstChild.firstChild.checked) {
                ans = st.firstChild.firstChild.nextSibling.data.substr(2)
                break
            }
            st = st.nextSibling
        }
        return ans
    }

    function set_ans(k, ans) {
        var st = titles[k].nextSibling.nextSibling
        while (st.style.length > 0) {
            if (st.firstChild.firstChild.nextSibling.data.substr(2) === ans) {
                st.firstChild.firstChild.checked = true
                break
            }
            st = st.nextSibling
        }
    }

    function saveAns() {
        for (var i = 0; i < length; ++i) {
            var ans = get_ans(i)
            if (ans != '' && ans != undefined) {
                window.localStorage.setItem(titles[i].text, ans)
            }
        }
    }

    function loadAns() {
        for (var i = 0; i < length; ++i) {
            var ans = window.localStorage.getItem(titles[i].text)
            if (ans != null && ans != 'undefined') {
                set_ans(i, ans)
            }
        }
    }

//     function getAns() {
//         $.get("https://1-1302682750.cos.ap-nanjing.myqcloud.com/yooc/tytk.json",data=>{
//             let voidAns=0;
//             for(let x of $('a[id$="_title"]')){
//                 if(data[x.innerText.trim()]==undefined){
//                     voidAns++;
//                     let redtext=document.createAttribute("style");
//                     redtext.nodeValue="color: red;";
//                     x.attributes.setNamedItem(redtext);
//                     continue;
//                 }
//                 let y=x.nextElementSibling.nextElementSibling;
//                 let choice=0;
//                 let hasChoice=false;
//                 while(y.tagName==='P'){
//                     if(data[x.innerText.trim()]===y.innerText.trim().substr(2)){
//                         hasChoice=true;
//                         break;
//                     }
//                     choice++;
//                     y=y.nextElementSibling;
//                 }
//                 if(hasChoice){
//                     $('input[name='+x.id.split('_')[0]+']')[choice].click()
//                 }else{
//                     voidAns++;
//                     let redtext=document.createAttribute("style");
//                     redtext.nodeValue="color: red;";
//                     x.attributes.setNamedItem(redtext);
//                 }
//             };
//             if(voidAns){
//                 alert("有"+voidAns+"个题目未查询到答案！");
//             }else{
//                 alert("答题完成！");
//             }
//         });
//     }

    function doAns() {
        $.getScript("https://1-1302682750.cos.ap-nanjing.myqcloud.com/yooc/tytk.js")
        saveAns()
    }

    function main() {
        titles = $('a[id]')
        length = titles.length
        console.log(EZ, length)
        if (length <= 0)
        {
            return
        }
        doAns()
        setInterval(saveAns, 1000)
        setTimeout(loadAns, 5000)
    }

    // Your code here...
    setTimeout(main, 5000)
})();