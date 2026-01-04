// ==UserScript==
// @name         正方教育期末自动填教师评价表
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  加建好评，减键差评
// @author       izum
// @match        http://jwgl.witpt.edu.cn/*
// @icon         http://jwgl.witpt.edu.cn/style/base/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437592/%E6%AD%A3%E6%96%B9%E6%95%99%E8%82%B2%E6%9C%9F%E6%9C%AB%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/437592/%E6%AD%A3%E6%96%B9%E6%95%99%E8%82%B2%E6%9C%9F%E6%9C%AB%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
    let t,s,d;

t = document.getElementById('lblPjs')
t.innerText = "启动成功，加键好评，减键差评，点击内框并按下-或+键，有提示表示成功，卡住不跳转是网站反应慢的原因，手动保存下即可"
t.style.color = "#ff0000"
t.style.fontSize = "20px"

t = document.getElementById('tdHead')
t.innerText = "以下均为内框"
t.style.color = "#ff0000"
t.style.fontSize = "20px"


document.onkeydown = function(e) {
    if (e.key === '+') {
        auto('A', 'B')
        alert('好评填写完毕，确定后自动跳转');
        document.getElementById('Button1').click()
    }
    if (e.key === '-') {
        auto('C', 'D')
        alert('差评填写完毕，确定后自动跳转');
        document.getElementById('Button1').click()
    }

}

function auto(one, two){
s = 2
d = 19
let select,v;
while (s <= 19) {
    select = 'DataGrid1__ctl' + s.toString() + '_JS1'
    if (s %2 === 0){
        v = one;
    }
    else {
        v = two;
    }
    document.getElementById(select).value = v;
    s++;
}
}
})();