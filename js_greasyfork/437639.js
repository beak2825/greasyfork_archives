// ==UserScript==
// @name         xmrc
// @namespace    http://www.akuvox.com/
// @version      1.0
// @description  take on the world!
// @author       andy.wang
// @match        https://www.xmrc.com.cn/net/Enterprise/Resultg.aspx*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/437639/xmrc.user.js
// @updateURL https://update.greasyfork.org/scripts/437639/xmrc.meta.js
// ==/UserScript==

//使用全大写定义岗位名称或学校名称
var mywork = ["嵌入式", "C++", "软件工程师"];
var filter_university_names = ['仰恩','闽南师范','泉州师范学院'];


(function() {
    //主函数开始
    //创建button
    console.log("xmrc9")

    //自己的方法
    function autoCloseNotice(){
        function filter_university(university_name){
            var bf = 0;
            university_name=university_name.toUpperCase();
            for(var j=0; j<filter_university_names.length; j++)
            {
                var pos = university_name.indexOf(filter_university_names[j]);
                if(pos >= 0)
                {
                    bf = 1;
                    break;
                }
            }
            return !bf; //返回False表示要隐藏
        }
        function filter_work(works){
            var bf = 0;
            works=works.toUpperCase();
            for(var j=0; j<mywork.length; j++)
            {
                var pos = works.indexOf(mywork[j]);
                if(pos >= 0)
                {
                    bf = 1
                    break
                }
            }
            return bf; //返回False表示要隐藏
        }

        var mytable = document.getElementsByClassName('text-center queryTalentTable')[0]
        //console.log(mytable)
        for(var i=1,rows=mytable.rows.length; i<rows; i++)
        {
            var bfound = 0;
            var works = mytable.rows[i].cells[7].innerHTML;
            bfound = filter_work(works);
            if(!bfound)
            {
                mytable.rows[i].style.display = "none";
            }

            var university_name = mytable.rows[i].cells[5].innerHTML;
            bfound = filter_university(university_name);
            if(!bfound)
            {
                mytable.rows[i].style.display = "none";
            }
        }

    }

     if (navigator.userAgent.indexOf('Firefox') >= 0) {
        //firefox 不支持 window.onload 直接调用函数
        autoCloseNotice();
    } else {
           window.onload = autoCloseNotice;

    }
})();