// ==UserScript==
// @name         教务系统课时统计脚本
// @namespace    http://tampermonkey.net/
// @version      2024-04-18
// @description  脚本小子
// @author       恶搞大王
// @match        https://jw-hzpt-edu-cn-s.webvpn.hzpt.edu.cn:8118/kbbp/dykb.GS1.jsp?kblx=jskb
// @match        https://jw.hzpt.edu.cn/kbbp/dykb.GS1.jsp?kblx=jskb
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hzpt.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509299/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E6%97%B6%E7%BB%9F%E8%AE%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/509299/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E6%97%B6%E7%BB%9F%E8%AE%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：解析单个课程数据中的周数和节次
    function parseCourse(courseData) {
        // 匹配周数和节次
        const weekPattern = /\[(.*?)\]/;
        const weekMatches = courseData.match(weekPattern);
        //const weeks = weekMatches ? weekMatches[1].split(',').map(w => w.split('-').map(Number)).flat() : [1];
        var weeks = weekMatches[1].split(",")
        var sum_week = 0;
        console.log(weeks);
        for(var i = 0;i<weeks.length;i++){
            var inner_week = weeks[i].split('-');
            console.log(inner_week);
            var total_week = 1;
            if(inner_week.length > 1){
                total_week = parseInt(inner_week[1])-parseInt(inner_week[0])+1;
            }
            sum_week = sum_week + total_week;
        }
        console.log("weeks:");
        console.log(sum_week);
        // 匹配节次
        const timePattern = /(\d+-\d+|\d+)节/;
        const timeMatches = courseData.match(timePattern)[1].split('-');
        // 计算学时
        var time_learn = parseInt(timeMatches[1])-parseInt(timeMatches[0])+1;
        //console.log(time_learn);
        // 计算总学时
        const totalHours = sum_week * time_learn;
        return totalHours;
    }



    // Your code here...
    // 等待网页完成加载
    window.addEventListener('load', function() {
        // 加载完成后执行的代码
        // 定义课程和班级的关系
        let class_dict = {};
        let duplidate_dict = {}; // 去重

        let table = document.getElementById("mytable0");
        //console.log(table);
        let tds = table.getElementsByClassName("td");
        console.log("td 长度");
        console.log(tds.length);
        for(var i = 0 ;i<tds.length;i++){
            if(tds[i].innerText.trim().indexOf("...详细内容见备注") >=0){
                // 针对详细内容见备注,提取head中的数据
                var hint_class = tds[i].getElementsByTagName("font")[0].title.trim();
            }
            var inner_class =tds[i].innerText.trim().split("\n");
            var class_details_array = Array()
            var class_week = i%7; // 获得当前的星期
            for(var j = 0;j<inner_class.length;j++){
                if(inner_class == ""){
                     break;
                }
                // 获得详细信息
                // 课程名 上课周期 节数 教室 班级
                var class_details = inner_class[j].split(" ");
                //console.log(class_details);
                if(class_details[0].indexOf("...详细内容见备注") >=0){
                    // 查看备注
                    //console.log("详情请查看备注");
                    //console.log(hint_class);
                    hint_class = hint_class.split("\r")
                        //console.log(hint_class);
                    for(var z = 0;z<hint_class.length;z++){
                        var hint = hint_class[z].trim() + class_week
                        console.log(hint);
                        if(duplidate_dict[hint_class[z].trim() + class_week]){
                            console.log("重复:"+hint);
                            continue;
                        }
                        duplidate_dict[hint_class[z].trim() + class_week] = true; //去重
                        class_details = hint_class[z].trim().split(" ");
                        // 计算总学时
                        const totalHours = parseCourse(hint);
                        //console.log(totalHours);
                        var class_week = i%7; // 获得当前的星期
                        var class_name = class_details[0];
                        //console.log(class_name);

                        //var class_period = class_details[1];
                        //var class_time = class_details[2];
                        //var class_room = class_details[3];
                        var class_stn_class_name = class_details[4];
                        if(class_dict[class_name+"_"+class_stn_class_name]==undefined){
                            class_dict[class_name+"_"+class_stn_class_name] = totalHours;
                        }else{
                            class_dict[class_name+"_"+class_stn_class_name] = class_dict[class_name+"_"+class_stn_class_name] + totalHours;
                        }

                    }

                }else{
                    if(duplidate_dict[inner_class[j].trim() + class_week]){
                       console.log("重复"+inner_class[j]);
                        continue;
                    }
                    duplidate_dict[inner_class[j].trim()+ class_week] = true; //去重
                    // 计算总学时
                    const totalHours = parseCourse(inner_class[j]);
                    //console.log(totalHours);
                    class_name = class_details[0];
                    //var class_period = class_details[1];
                    //var class_time = class_details[2];
                    //var class_room = class_details[3];
                    class_stn_class_name = class_details[4];
                    if(class_dict[class_name+"_"+class_stn_class_name]==undefined){
                        class_dict[class_name+"_"+class_stn_class_name] = totalHours;
                    }else{
                        class_dict[class_name+"_"+class_stn_class_name] = class_dict[class_name+"_"+class_stn_class_name] + totalHours;
                    }
                    //console.log(class_name);
                    //console.log(class_period);
                    //console.log(class_time);
                }
            }
        }
        const framework = document.getElementsByClassName("content")[0]

        var info_div = document.createElement("div");
        info_div.id = "info_div"
        info_div.style.position = "fixed";
        info_div.style.top = 0;
        info_div.style.left = 0;
        framework.insertBefore(info_div,document.getElementsByClassName("title")[0]);
        console.log(class_dict);
        var html = "<table><thead><tr><th>课程</th><th>课时</th></tr></thead><tbody>"
        var sum = 0;
        // 显示最后的结果
        for (let key in class_dict) {
            html = html + "<tr><td> "+key+"</td> <td>"+class_dict[key]+"</td></tr>"
            console.log(`课程: ${key}, 课时: ${class_dict[key]}`);
            sum = sum + class_dict[key];
        }
        html = html + "<tr><td>总课时</td><td>" + sum + "</td></tr></tbody></table>";
        info_div.innerHTML = html;

    }, false);


})();