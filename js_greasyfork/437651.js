// ==UserScript==
// @name         SJTU研究生选课显示备注
// @match        http://yjsxk.sjtu.edu.cn/yjsxkapp/sys/xsxkapp/course.html
// @match        http://yjsxk.sjtu.edu.cn/yjsxkapp/sys/xsxkapp/course_en.html
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  SJTU研究生选课加备注(并对'留学生'关键字进行识别), 尽量避免类似大陆学生抢课抢到国际班的杯具发生
// @author       joshCai
// @icon         chrome://favicon/http://yjsxk.sjtu.edu.cn/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437651/SJTU%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E6%98%BE%E7%A4%BA%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/437651/SJTU%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E6%98%BE%E7%A4%BA%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //绑定操作
    function bound(formName,girdName,windowGrid) {
        $(formName)[0].onchange = function () { doAfterQuery(girdName,windowGrid) };//属性界面修改
        $(formName+" [role-action='query']")[0].onclick = () => { doAfterQuery(girdName,windowGrid) };//查询按钮
        $(".zero-grid-pagination")[0].onclick = function () { doAfterQuery(girdName,windowGrid) };//页脚
        $(formName+" .querybtn-container")[0].style.float = 'right';
        doAfterQuery(girdName,windowGrid);
    }
    function setPageSize(pageSize) {
        pageSize=Math.max(pageSize,10);
        pageSize=Math.min(pageSize,30);
        if (typeof (window.zynkc_zeroGrid) !== 'undefined') { window.zynkc_zeroGrid.params.pageSize = pageSize; }
    }

    //延迟1秒加载脚本
    setTimeout(() => {

        //ui
        var span123 = document.createElement('span'); //1、创建元素
        var pageSizeStr = '<label class="" for="xkSize">每页显示几条数据</label><input value="10" id="xkSize" name="xkSize" type="number" class="form-control" max="30" placeholder="伙计别整太大了"/>';
        span123.innerHTML += pageSizeStr;
        span123.style='float:right;display:inline-block;background:#d6e2ff;padding: 5px 10px 10px 0;'

        var xk_containrt_0 = document.getElementById('xk_containrt_0'); //2、找到父级元素
        xk_containrt_0.insertBefore(span123, xk_containrt_0.childNodes[2]);//插入

        $("#xkSize")[0].onchange = () => {
            setPageSize($("#xkSize")[0].value);
        }

        //绑定操作
        bound("#jhnkcQueryForm","#zynkcGrid",window.zynkc_zeroGrid);
        $("#xkkctab_0")[0].onclick = ()=>{ bound("#jhnkcQueryForm","#zynkcGrid",window.zynkc_zeroGrid);};
        $("#xkkctab_1")[0].onclick = ()=>{ bound("#gxkQueryForm","#gxkGrid",window.gxkkc_zeroGrid);};
        $("#xkkctab_99")[0].onclick = ()=>{bound("#allQueryForm","#allCourseGrid",window.allcourse_zeroGrid);};
    }, 1000);


    //自动标注
    function doAfterQuery(girdName,windowGrid) {
        var waitting= setInterval(() => {
            if(windowGrid.loading)return;

            window.clearInterval(waitting);
            //因为表格刷新所以要重新绑定事件
            var gotopage=$(".zero-grid-pagination");
            for(var i=0;i<gotopage.length;i++){
                gotopage[i].onclick = function () { doAfterQuery(girdName,windowGrid) };
            }

            var courses = $(girdName+" tbody")[0].children;
            if(courses.length===1 && courses[0].children.length===1){
                return;//表格为空
            }
            for (var i = 0; i < courses.length; i++) {

                //显示tip
                if (courses[i].children[0].innerHTML.indexOf('tip="') > 0) {
                    //显式显示tip
                    var tip1 = courses[i].children[0].innerHTML.substring(courses[i].children[0].innerHTML.indexOf('tip="') + 5, courses[i].children[0].innerHTML.indexOf('>') - 1);
                    var appendStyle = 'background:rgb(95 141 255);color:white;';
                    if (tip1.indexOf('留学生') > 0) {
                        //courses[i].style.color = 'red';
                        appendStyle = 'background:red;color:white;';
                    }
                    courses[i].children[0].innerHTML = courses[i].children[0].innerHTML.replace('tip="', 'title="');
                    courses[i].children[0].innerHTML +=
                        '<span title="' + tip1 + '" style="' + appendStyle + '">'
                        + ((tip1.length > 12) ? (tip1.substr(0, 12) + '...') : (tip1))
                        + '</span>';
                }

            }
        }, 5);
        //console.log('refreshing @ '+new Date().toTimeString().substr(0,5));
    }

})();