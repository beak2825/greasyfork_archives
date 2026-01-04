// ==UserScript==
// @name         NGA Missing Floor Detector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动检测NGA楼层缺失
// @author       东云曦月
// @match        https://bbs.nga.cn/read.php*
// @icon         https://img4.nga.178.com/ngabbs/post/smile/pg04.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447549/NGA%20Missing%20Floor%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/447549/NGA%20Missing%20Floor%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.body.innerHTML
    var patt = /a name=.l\d+./g
    var floors = body.match(patt)
    if (floors != null){
        //alert('楼层数：' + floors.length)
        var app = new Array()
        var min = 10000000;
        for (var i = 0; i < floors.length; i++){
            //alert(floors[i])
            var num_str = floors[i].match(/\d+/g)
            //alert(num_str)
            var index = parseInt(num_str)
            if (app.length == 0 || app.indexOf(index) == -1){
                app.push(index)
                if (index < min){
                    min = index;
                }
                //alert('!')
            }
        }
        //alert(app)
        min = min / 20 * 20
        var missing = new Array()
        for (i = min; i < min + 20; i++){
            if (app.indexOf(i) == -1){
                missing.push(i)
            }
        }
        if (missing.length == 0){
            alert('无缺失楼层')
        }
        else{
            alert('缺失以下楼层：' + missing)
        }
    }
    else {
        alert('没有匹配，请尝试刷新')
    }
})();