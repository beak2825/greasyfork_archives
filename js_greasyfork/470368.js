// ==UserScript==
// @name         CSU calculate GPA / 中南大学GPA换算
// @namespace    https://greasyfork.org/en/scripts/470368-csu-calculate-gpa-%E4%B8%AD%E5%8D%97%E5%A4%A7%E5%AD%A6gpa%E6%8D%A2%E7%AE%97
// @version      0.1.2
// @description  convert grade from 100-scale to 4.0-scale easily / 轻松换算GPA
// @author       0xDkXy
// @match        https://csujwc.its.csu.edu.cn/jsxsd/kscj/cjcx_list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csu.edu.cn
// @grant        none
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/470368/CSU%20calculate%20GPA%20%20%E4%B8%AD%E5%8D%97%E5%A4%A7%E5%AD%A6GPA%E6%8D%A2%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/470368/CSU%20calculate%20GPA%20%20%E4%B8%AD%E5%8D%97%E5%A4%A7%E5%AD%A6GPA%E6%8D%A2%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 将 等级映射为分数
    function map_level_2_float(score_str)
    {
        var float_score = parseFloat(score_str);
        // console.log(typeof float_score);
        if (!isNaN(float_score)) {
            return float_score;
        }
        if (score_str == "优") {
            return 4.0;
        } else if (score_str == "良") {
            return 3.0;
        } else if (score_str == "中") {
            return 2.0;
        } else if (score_str == "及格") {
            return 1.0
        } else {
            return 0.0
        }
    }

    function map_level_2_float_100(score_str)
    {
        var float_score = parseFloat(score_str);
        // console.log(typeof float_score);
        if (!isNaN(float_score)) {
            return float_score;
        }
        if (score_str == "优") {
            return 95.0;
        } else if (score_str == "良") {
            return 85.0;
        } else if (score_str == "中") {
            return 75.0;
        } else if (score_str == "及格") {
            return 60.0
        } else {
            return 0.0
        }
    }

    let title_list = new Array(
        "标准4.0",
        "改进4.0 1",
        "改进4.0 2",
        "北大4.0",
        "百分制",
    )

    let standard_convert = new Array(
        { ori:90.0, new:4.0 },
        { ori:80.0, new:3.0 },
        { ori:70.0, new:2.0 },
        { ori:60.0, new:1.0 },
        { ori:0.0,  new:0.0 },
    );

    let improve_convert_1 = new Array(
        { ori:85.0, new:4.0 },
        { ori:70.0, new:3.0 },
        { ori:60.0, new:2.0 },
        { ori:0.0,  new:0.0 },
    );

    let improve_convert_2 = new Array(
        { ori:85.0, new:4.0 },
        { ori:75.0, new:3.0 },
        { ori:60.0, new:2.0 },
        { ori:0.0,  new:0.0 },
    );

    let PKU_convert = new Array(
        { ori:90.0, new:4.0 },
        { ori:85.0, new:3.7 },
        { ori:82.0, new:3.3 },
        { ori:78.0, new:3.0 },
        { ori:75.0, new:2.7 },
        { ori:72.0, new:2.3 },
        { ori:68.0, new:2.0 },
        { ori:64.0, new:1.5 },
        { ori:60.0, new:1.0 },
        { ori:0.0,  new:0.0 },
    );

    let canada_convert = new Array(
        { ori:90.0, new:4.3 },
        { ori:85.0, new:4.0 },
        { ori:80.0, new:3.7 },
        { ori:75.0, new:3.3 },
        { ori:70.0, new:3.0 },
        { ori:65.0, new:2.7 },
        { ori:60.0, new:2.3 },
        { ori:0.0,  new:0.0 },
    );

    function convert(score_str, method, is_hundred=false) {
        var score = parseFloat(score_str);
        if (is_hundred || isNaN(score)) {
            return is_hundred ? map_level_2_float_100(score_str):map_level_2_float(score_str);
        } else {
            for (var i = 0; i < method.length; ++i) {
                let item = method[i];
                if (score >= item.ori) {
                    return item.new;
                }
            }
        }
    }

    var origin_grade_list = new Array();

    var hundred = 0.0
    var credit_sum = 0.0
    var grade_tr_list = document.getElementsByTagName("tbody")[1].childNodes;
    var grade_tr_list_len = grade_tr_list.length;
    for (var i = 2; i < grade_tr_list_len; i += 4) {
        var grade_line = grade_tr_list[i].childNodes; // get a line of score
        // var score = map_level_2_float(grade_line[11].innerText);
        var score = grade_line[11].innerText;
        var credit = parseFloat(grade_line[13].innerText);
        credit_sum += credit;
        // console.log(score,credit,credit_sum);
        origin_grade_list.push({score:score, credit:credit});
    }
    console.log(credit_sum);

    var standard_GPA = 0.0;
    var improve_1_GPA = 0.0;
    var improve_2_GPA = 0.0;
    var PKU_GPA = 0.0;

    for (i = 0; i < origin_grade_list.length; ++i) {
        let item = origin_grade_list[i];
        var weighted = item.credit / credit_sum;
        score = convert(item.score, standard_convert);
        standard_GPA += score * weighted;
        score = convert(item.score, improve_convert_1);
        improve_1_GPA += score * weighted;
        score = convert(item.score, improve_convert_2);
        improve_2_GPA += score * weighted;
        score = convert(item.score, PKU_convert);
        PKU_GPA += score * weighted;
        score = convert(item.score, NaN, true);
        console.log("hundred ", score);
        hundred += score * weighted;
    }

    console.log(standard_GPA, improve_1_GPA, improve_2_GPA, PKU_GPA, hundred);

    let GPA_list = new Array(
        standard_GPA,
        improve_1_GPA,
        improve_2_GPA,
        PKU_GPA,
        hundred
    );

    let left_menu = document.getElementById("LeftMenu1_divChildMenu");

    let div_GPA = document.createElement("div");
    for (i = 0; i < GPA_list.length; ++i) {
        let tmp_h4_title = document.createElement("h4");
        tmp_h4_title.innerText = title_list[i];
        let tmp_h4_GPA = document.createElement("h4");
        tmp_h4_GPA = GPA_list[i];
        div_GPA.append(tmp_h4_title);
        div_GPA.append(tmp_h4_GPA);
    }
    left_menu.append(div_GPA);


})();
