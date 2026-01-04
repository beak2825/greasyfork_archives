// ==UserScript==
// @name         西北师范大学一键互评助手
// @version      0.2
// @namespace     nwnu-hp
// @description  一键填写互评分数，从此告别手动填写！
// @author       姜云凡
// @match        http://stu.nwnu.edu.cn/student_portal/mainparturl/appraisal_mutual
// @match         https://webvpn.nwnu.edu.cn/http/77726476706e69737468656265737421e3e354d229276645300d8db9d6562d/student_portal/mainparturl/appraisal_mutual
// @icon         https://www.nwnu.edu.cn/_upload/tpl/02/4b/587/template587/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453841/%E8%A5%BF%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453841/%E8%A5%BF%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
	'use strict';
	console.log('我的脚本加载了');
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position = "fixed"
    Container.style.left = "220px"
    Container.style.top = "20px"
    Container.style['z-index'] = "999999"
    Container.innerHTML = `<button id="myCustomize" style="position:absolute; left:30px; top:20px">点我进行填写成绩</button>`
    Container.onclick = function () {
        console.log('点击了按键');
        //为所欲为 功能实现处
        var mm = document.getElementsByTagName("input").length;
        for (var i = 0; i < mm; i++) {
            var dd = document.getElementsByTagName('input').item(i);
            if (dd.type == 'number') {
                dd.value = 100;
            }
        }
        alert("所有同学的互评成绩已经填写完成！");
        return;
    };

    document.body.appendChild(Container);
})();