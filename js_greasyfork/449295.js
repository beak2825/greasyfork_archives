// ==UserScript==
// @name         哈工大本科教务选课页面提取上课时间
// @namespace    http://tampermonkey.net/
// @version      0.9
// @license      MIT
// @description  【解析结果仅供参考】本脚本的意义在于：在选课前/选课后提取出来想要上的课的时间，提取后可自行或者使用俺写的一个小工具来判断课程间是否冲突&预查看课表。
// @author       jielahou
// @match        http://jwts-hit-edu-cn.ivpn.hit.edu.cn:1080/xsxk/queryXsxkList
// @match        http://jwts-hit-edu-cn.ivpn.hit.edu.cn:1080/xsxk/queryYxkc
// @match        http://jwts.hit.edu.cn/xsxk/queryXsxkList
// @match        http://jwts.hit.edu.cn/xsxk/queryYxkc
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.hit.edu.cn
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/449295/%E5%93%88%E5%B7%A5%E5%A4%A7%E6%9C%AC%E7%A7%91%E6%95%99%E5%8A%A1%E9%80%89%E8%AF%BE%E9%A1%B5%E9%9D%A2%E6%8F%90%E5%8F%96%E4%B8%8A%E8%AF%BE%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/449295/%E5%93%88%E5%B7%A5%E5%A4%A7%E6%9C%AC%E7%A7%91%E6%95%99%E5%8A%A1%E9%80%89%E8%AF%BE%E9%A1%B5%E9%9D%A2%E6%8F%90%E5%8F%96%E4%B8%8A%E8%AF%BE%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

var getHerfType = function(href){
    if(href.indexOf('queryYxkc') !== -1){
    //选课结果页面
       return 1;
    }else{
//选课页面
        return 0;
    }
}


getWeekday = function (weekday){
    let weekday_int = 0;
    if(weekday === "一"){
        weekday_int = 1;
    }else if(weekday === "二"){
        weekday_int = 2;
    }else if(weekday === "三"){
        weekday_int = 3;
    }else if(weekday === "四"){
        weekday_int = 4;
    }else if(weekday === "五"){
        weekday_int = 5;
    }else if(weekday === "六"){
        weekday_int = 6;
    }else if(weekday === "日"){
        weekday_int = 7;
    }
    return weekday_int;
};

paste = function(content) {
    var txt = document.createElement('input');
    txt.setAttribute('value', content);
    document.body.appendChild(txt);
    txt.select();
    document.execCommand('copy');
    document.body.removeChild(txt);
};

var addParseButton = function() {
    var searchNav = document.getElementsByClassName('addlist_button2 mt4')[0].parentElement.parentElement;
    if(getHerfType(window.location.href) === 0){
        searchNav.innerHTML = searchNav.innerHTML + '<li><div class="addlist_button2 mt4"><a onclick="parse(1);"><span>解 析（不带班级）</span></a></div></li>';
        searchNav.innerHTML = searchNav.innerHTML + '<li><div class="addlist_button2 mt4"><a onclick="parse(0);"><span>解 析（带班级）</span></a></div></li>';
    }else{
        searchNav.innerHTML = searchNav.innerHTML + '<li><div class="addlist_button2 mt4"><a onclick="parse(2);"><span>解 析（选课结果页面）</span></a></div></li>';
    }
    
};


parse = function(flag){
    let table = document.getElementsByClassName('bot_line')[0].getElementsByTagName('tr');

    for(let i = 1; i < table.length; i++){
        //一行一行的解析来咯
        let resultObj = {course_id: table[i].children[1].innerText ,course_name: table[i].children[3].innerText, course_time: [
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]],
            [[],[],[],[],[],[],[]]
        ]};
        var columnNum = 8;
        if(flag === 0){
            //选课页面带班级，解析col[8]
            columnNum = 8;
        }else if(flag === 1){
            //选课页面不带班级，解析col[7]
            columnNum = 7;
        }else if(flag === 2){
            //选课结果页面，解析col[5]
            columnNum = 5;
        }
        var info = table[i].children[columnNum].innerText.split('\n');
        var course_info = info.filter((item) => {
            return item.substring(0,4) === "上课信息"
        });
        //去掉 上课信息：
        var course_info_pure = course_info.map((item) => {
            return item.substring(5,)
        });

        var shangke_time_all = [];
        course_info_pure.forEach((element, index, array) => {
            var bigarray = [];
            element.split('◇').filter((item) => {
                return item.match("节") != null;
            }).forEach((element, index, array) => {
                bigarray.push(element)
            });

            bigarray = bigarray.map((element, index, array) => {
                const zuoPos = element.indexOf('[');
                const douhaoPos = element.indexOf(',');

                if(douhaoPos < zuoPos){
                    //说明前面有上课位置信息
                    return element.slice(douhaoPos + 1, );
                }else{
                    return element;
                }

            });

            shangke_time_all = shangke_time_all.concat(bigarray);
        })

        shangke_time_all.forEach((element, index, array) => {
            //获取周数
            const begin = element.indexOf('[');
            const end = element.indexOf(']');
            const week = element.substring(begin + 1, end - 1); // 考虑到最后一个字总是“周”，不如不要了
            //接下来数据总共有4种方式呈现：
            //单独的数字 / a-b / a-b单 / a-b双
            const week_group = week.split(',');
            let week_array = [];
            week_group.forEach((item) => {
                let week_part = item.match(/(\d+)-(\d+)/);
                if(week_part != null) {
                    //中间带下划线
                    let week_begin = Number.parseInt(week_part[1]);//首星期
                    let week_end = Number.parseInt(week_part[2]);//尾星期
                    let week_ctl = 0;//0没有限制，1是单，2是双
                    if(item.indexOf('单') !== -1){
                        week_ctl = 1;
                    }else if(item.indexOf('双') !== -1){
                        week_ctl = 2;
                    }
                    //debugger;
                    for(let i = week_begin; i <= week_end; i++){
                        if(week_ctl === 0){
                            week_array.push(i);
                        }else if(week_ctl === 1){
                            if(i % 2 !== 0){
                                week_array.push(i);
                            }
                        }else{
                            if(i % 2 === 0){
                                week_array.push(i);
                            }
                        }
                    }
                }else{
                    //不带下划线
                    week_array.push(Number.parseInt(item));
                }
            })

            //至此已经得到了第几周
            //下面看星期几
            const weekday = element.substring(end + 3, end + 4);
            let weekday_int = getWeekday(weekday);

            //最后看第几节课
            let time_part = element.slice(end + 5, -1).split(',').map((value, index, array) => {
                return Number.parseInt(value);
            }).filter((item) => {
                return item % 2 !== 0
            }).map((value, index, array) => {
                return (value + 1) / 2 ;
            });
            console.log("======",table[i].children[3].innerText)
            week_array.forEach((elem, index, array) => {
                resultObj.course_time[elem-1][weekday_int-1] = resultObj.course_time[elem-1][weekday_int-1].concat(time_part);
            });
        })

        //我们最终的目标是想做成一个三维的表格
        //周、星期、课
        table[i].children[0].innerHTML=table[i].children[0].innerHTML+`<div class="addlist_button" onclick="paste(document.getElementById('text${i}').value);"><a><span>复 制</span></a></div><input id="text${i}" style="display: none;" value=""></textarea>`;
        document.getElementById(`text${i}`).value = JSON.stringify(resultObj);
    }
};


(function()
{
    window.onload = addParseButton;
})();