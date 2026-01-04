// ==UserScript==
// @name         AutoFill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填写问卷85709452
// @author       WJ
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @match        https://www.wjx.cn/jq/85709452.aspx
// @match        https://www.wjx.cn/wjx/join/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408054/AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/408054/AutoFill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    $(document).ready(function() {
        var tmp
        var flag
        var u

        u = $(location).attr('href')
        if (u[20] == 'j') {
            $(location).attr('href', 'https://www.wjx.cn/jq/85709452.aspx');
        }

        if (Math.random() > 0.5) {
            $("[rel='q1_1']").click()
        }
        else {
            $("[rel='q1_2']").click()
        }

        tmp = Math.random()
        //0-20岁
        if (tmp < 0.1) {
            $("[rel='q2_1']").click()
            tmp = Math.random()
            //0-20&初中及以下
            if (tmp < 0.092) {
                $("[rel='q4_1']").click()
                tmp = Math.random()
                if (tmp < 0.0833) {
                    $("[rel='q3_11']").click() //0-20&初中&其他
                }
                else {
                    $("[rel='q3_1']").click() //0-20&初中&在校学生
                }
            }
            //0-20&高中
            else if (tmp < 0.092+0.3802) {
                $("[rel='q4_2']").click()
                $("[rel='q3_1']").click() //0-20&高中&在校学生
            }
            //0-20&大学
            else {
                $("[rel='q4_3']").click()
                tmp = Math.random()
                if (tmp < 0.9048) {
                    $("[rel='q3_1']").click() //0-20&大学&在校学生
                }
                else if (tmp < 0.9048+0.0317) {
                    $("[rel='q3_2']").click() //0-20&大学&政府机关干部
                }
                else if (tmp < 0.9048+0.0317+0.0476) {
                    $("[rel='q3_4']").click() //0-20&大学&普通职员
                }
                else {
                    $("[rel='q3_8']").click() //0-20&大学&自由职业者
                }
            }
        }
        //20-35岁
        else if (tmp < 0.1+0.33) {
            $("[rel='q2_2']").click()
            tmp = Math.random()
            //20-35初中
            if (tmp < 0.0254) {
                $("[rel='q4_1']").click()
                tmp = Math.random()
                if (tmp < 0.2615) {
                    $("[rel='q3_1']").click() //20-35&初中&在校学生
                }
                else if (tmp < 0.2615+0.1538) {
                    $("[rel='q3_3']").click() //20-35&初中&企业管理者
                }
                else if (tmp < 0.2615+0.1538+0.1769) {
                    $("[rel='q3_4']").click() //20-35&初中&普通职员
                }
                else if (tmp < 0.2615+0.1538+0.1769+0.1269) {
                    $("[rel='q3_5']").click() //20-35&初中&商业服务业职工
                }
                else if (tmp < 0.2615+0.1538+0.1769+0.1269+0.1269) {
                    $("[rel='q3_7']").click() //20-35&初中&普通工人
                }
                else if (tmp < 0.2615+0.1538+0.1769+0.1269+0.1269+0.0769) {
                    $("[rel='q3_8']").click() //20-35&初中&自由职业者
                }
                else {
                    $("[rel='q3_11']").click() //20-35&初中&其他
                }
            }
            //20-35&高中
            else if (tmp < 0.0254+0.0802) {
                $("[rel='q4_2']").click()
                tmp = Math.random()
                if (tmp < 0.3659) {
                    $("[rel='q3_1']").click() //20-35&高中&在校学生
                }
                else if (tmp < 0.3659+0.0488) {
                    $("[rel='q3_2']").click() //20-35&高中&政府机关
                }
                else if (tmp < 0.3659+0.0488+0.0488) {
                    $("[rel='q3_3']").click() //20-35&高中&企业管理者
                }
                else if (tmp < 0.3659+0.0488+0.0488+0.2683) {
                    $("[rel='q3_4']").click() //20-35&高中&普通职工
                }
                else if (tmp < 0.3659+0.0488+0.0488+0.2683+0.0488) {
                    $("[rel='q3_5']").click() //20-35&高中&商业服务业
                }
                else if (tmp < 0.3659+0.0488+0.0488+0.2683+0.0488+0.0732) {
                    $("[rel='q3_6']").click() //20-35&高中&个体经营者
                }
                else if (tmp < 0.3659+0.0488+0.0488+0.2683+0.0488+0.0732+0.0488) {
                    $("[rel='q3_7']").click() //20-35&高中&普通工人
                }
                else if (tmp < 0.3659+0.0488+0.0488+0.2683+0.0488+0.0732+0.0488+0.0732) {
                    $("[rel='q3_8']").click() //20-35&高中&自由职业者
                }
                else {
                    $("[rel='q3_11']").click() //20-35&高中&其他
                }
            }
            //20-35&大学
            else {
                $("[rel='q4_3']").click()
                tmp = Math.random()
                if (tmp < 0.5339) {
                    $("[rel='q3_1']").click() //20-35&大学&在校学生
                }
                else if (tmp < 0.5339+0.0941) {
                    $("[rel='q3_2']").click() //20-35&大学&政府机关
                }
                else if (tmp < 0.5339+0.0941+0.0503) {
                    $("[rel='q3_3']").click() //20-35&大学&企业管理者
                }
                else if (tmp < 0.5339+0.0941+0.0503+0.2035) {
                    $("[rel='q3_4']").click() //20-35&大学&普通职工
                }
                else if (tmp < 0.5339+0.0941+0.0503+0.2035+0.0263) {
                    $("[rel='q3_5']").click() //20-35&大学&商业服务业
                }
                else if (tmp < 0.5339+0.0941+0.0503+0.2035+0.0263+0.0131) {
                    $("[rel='q3_6']").click() //20-35&大学&个体经营者
                }
                else if (tmp < 0.5339+0.0941+0.0503+0.2035+0.0263+0.0131+0.0284) {
                    $("[rel='q3_7']").click() //20-35&大学&普通工人
                }
                else if (tmp < 0.5339+0.0941+0.0503+0.2035+0.0263+0.0131+0.0284+0.0263) {
                    $("[rel='q3_8']").click() //20-35&大学&自由职业者
                }
                else if (tmp < 0.5339+0.0941+0.0503+0.2035+0.0263+0.0131+0.0284+0.0263+0.0066) {
                    $("[rel='q3_10']").click() //20-35&大学&暂无职业
                }
                else {
                    $("[rel='q3_11']").click() //20-35&大学&其他
                }
            }
        }
        //35-50岁
        else if (tmp < 0.1+0.33+0.48) {
            $("[rel='q2_3']").click()
            tmp = Math.random()
            //35-50初中
            if (tmp < 0.1205) {
                $("[rel='q4_1']").click()
                tmp = Math.random()
                if (tmp < 0.05) {
                    $("[rel='q3_2']").click() //35-50&初中&政府机关
                }
                else if (tmp < 0.05+0.1) {
                    $("[rel='q3_3']").click() //35-50&初中&企业管理者
                }
                else if (tmp < 0.05+0.1+0.3) {
                    $("[rel='q3_4']").click() //35-50&初中&普通职员
                }
                else if (tmp < 0.05+0.1+0.3+0.15) {
                    $("[rel='q3_5']").click() //35-50&初中&商业服务业职工
                }
                else if (tmp < 0.05+0.1+0.3+0.15+0.05) {
                    $("[rel='q3_6']").click() //35-50&初中&个体经营者
                }
                else if (tmp < 0.05+0.1+0.3+0.15+0.05+0.2) {
                    $("[rel='q3_7']").click() //35-50&初中&普通工人
                }
                else {
                    $("[rel='q3_8']").click() //35-50&初中&自由职业者
                }
            }
            //35-50高中
            else if (tmp < 0.1205+0.2229) {
                $("[rel='q4_2']").click()
                tmp = Math.random()
                if (tmp < 0.0811) {
                    $("[rel='q3_2']").click() //35-50&高中&政府机关
                }
                else if (tmp < 0.0811+0.0811) {
                    $("[rel='q3_3']").click() //35-50&高中&企业管理者
                }
                else if (tmp < 0.0811+0.0811+0.2703) {
                    $("[rel='q3_4']").click() //35-50&高中&普通职员
                }
                else if (tmp < 0.0811+0.0811+0.2703+0.1081) {
                    $("[rel='q3_5']").click() //35-50&高中&商业服务业职工
                }
                else if (tmp < 0.0811+0.0811+0.2703+0.1081+0.01351) {
                    $("[rel='q3_6']").click() //35-50&高中&个体经营者
                }
                else if (tmp < 0.0811+0.0811+0.2703+0.1081+0.01351+0.1081) {
                    $("[rel='q3_7']").click() //35-50&高中&普通工人
                }
                else {
                    $("[rel='q3_8']").click() //35-50&高中&自由职业者
                }
            }
            //35-50大学
            else {
                $("[rel='q4_3']").click()
                tmp = Math.random()
                if (tmp < 0.002) {
                    $("[rel='q3_1']").click() //35-50&大学&在校学生
                }
                else if (tmp < 0.002+0.1835) {
                    $("[rel='q3_2']").click() //35-50&大学&政府机关
                }
                else if (tmp < 0.002+0.1835+0.1509) {
                    $("[rel='q3_3']").click() //35-50&大学&企业管理者
                }
                else if (tmp < 0.002+0.1835+0.1509+0.2969) {
                    $("[rel='q3_4']").click() //35-50&大学&普通职员
                }
                else if (tmp < 0.002+0.1835+0.1509+0.2969+0.0917) {
                    $("[rel='q3_5']").click() //35-50&大学&商业服务业
                }
                else if (tmp < 0.002+0.1835+0.1509+0.2969+0.0917+0.0734) {
                    $("[rel='q3_6']").click() //35-50&大学&个体经营者
                }
                else if (tmp < 0.002+0.1835+0.1509+0.2969+0.0917+0.0734+0.0550) {
                    $("[rel='q3_7']").click() //35-50&大学&普通工人
                }
                else if (tmp < 0.002+0.1835+0.1509+0.2969+0.0917+0.0734+0.0550+0.2018) {
                    $("[rel='q3_8']").click() //35-50&大学&自由职业者
                }
                else {
                    $("[rel='q3_11']").click() //35-50&大学&其他
                }
            }
        }
        //50-65岁
        else if (tmp < 0.1+0.33+0.48+0.08) {
            $("[rel='q2_4']").click()
            tmp = Math.random()
            //50-65初中
            if (tmp < 0.4348) {
                $("[rel='q4_1']").click()
                tmp = Math.random()
                if (tmp < 0.05) {
                    $("[rel='q3_5']").click() //50-65&初中&商业服务业职工
                }
                else if (tmp < 0.05+0.1) {
                    $("[rel='q3_7']").click() //50-65&初中&普通工人
                }
                else if (tmp < 0.05+0.1+0.05) {
                    $("[rel='q3_8']").click() //50-65&初中&自由职业者
                }
                else if (tmp < 0.05+0.1+0.05+0.7) {
                    $("[rel='q3_9']").click() //50-65&初中&退休
                }
                else {
                    $("[rel='q3_10']").click() //50-65&初中&暂无职业
                }
            }
            //50-65高中
            else if (tmp < 0.4348+0.3696) {
                $("[rel='q4_2']").click()
                tmp = Math.random()
                if (tmp < 0.13) {
                    $("[rel='q3_2']").click() //50-65&高中&政府机关
                }
                else if (tmp < 0.13+0.12) {
                    $("[rel='q3_3']").click() //50-65&高中&企业管理者
                }
                else if (tmp < 0.13+0.12+0.084) {
                    $("[rel='q3_4']").click() //50-65&高中&普通职员
                }
                else if (tmp < 0.13+0.12+0.084+0.055) {
                    $("[rel='q3_6']").click() //50-65&高中&个体经营者
                }
                else if (tmp < 0.13+0.12+0.084+0.055+0.0588) {
                    $("[rel='q3_8']").click() //50-65&高中&自由职业者
                }
                else {
                    $("[rel='q3_9']").click() //50-65&高中&退休
                }
            }
            //50-65大学
            else {
                $("[rel='q4_3']").click()
                tmp = Math.random()
                if (tmp < 0.3333) {
                    $("[rel='q3_2']").click() //50-65&大学&政府机关
                }
                else if (tmp < 0.3333+0.2222) {
                    $("[rel='q3_3']").click() //50-65&大学&企业管理者
                }
                else if (tmp < 0.3333+0.2222+0.1111) {
                    $("[rel='q3_4']").click() //50-65&大学&普通职员
                }
                else {
                    $("[rel='q3_9']").click() //50-65&大学&退休
                }
            }
        }
        //65岁+
        else {
            $("[rel='q2_5']").click()
            tmp = Math.random()
            //65+初中
            if (tmp < 0.5333) {
                $("[rel='q4_1']").click()
                tmp = Math.random()
                if (tmp < 0.125) {
                    $("[rel='q3_6']").click() //65+&初中&个体经营者
                }
                else {
                    $("[rel='q3_9']").click() //65+&初中&退休
                }
            }
            //65+高中
            else if (tmp < 0.5333+0.4) {
                $("[rel='q4_2']").click()
                tmp = Math.random()
                if (tmp < 0.1667) {
                    $("[rel='q3_6']").click() //65+&高中&个体经营者
                }
                else {
                    $("[rel='q3_9']").click() //65+&高中&退休
                }
            }
            //65+大学
            else {
                $("[rel='q4_3']").click()
                $("[rel='q3_9']").click()
            }
        }


        $("[rel='q5_1']").click()

        tmp = Math.random()
        if (tmp < 0.08) {
            $("#q6").val("黄浦区")
        }
        else if (tmp < 0.16) {
            $("#q6").val("徐汇区")
        }
        else if (tmp < 0.24) {
            $("#q6").val("长宁区")
        }
        else if (tmp < 0.32) {
            $("#q6").val("静安区")
        }
        else if (tmp < 0.40) {
            $("#q6").val("普陀区")
        }
        else if (tmp < 0.48) {
            $("#q6").val("虹口区")
        }
        else if (tmp < 0.56) {
            $("#q6").val("杨浦区")
        }
        else if (tmp < 0.64) {
            $("#q6").val("闵行区")
        }
        else if (tmp < 0.72) {
            $("#q6").val("浦东新区")
        }
        else if (tmp < 0.80) {
            $("#q6").val("松江区")
        }
        else if (tmp < 0.8333) {
            $("#q6").val("崇明区")
        }
        else if (tmp < 0.8666) {
            $("#q6").val("奉贤区")
        }
        else if (tmp < 0.8999) {
            $("#q6").val("青浦区")
        }
        else if (tmp < 0.9332) {
            $("#q6").val("金山区")
        }
        else if (tmp < 0.9665) {
            $("#q6").val("嘉定区")
        }
        else {
            $("#q6").val("宝山区")
        }

        tmp = Math.random()
        if (tmp < 0.9252) {
            $("[rel='q7_1']").click()
        }
        else {
            $("[rel='q7_2']").click()
        }

        tmp = Math.random()
        $("[rel='q8_1']").click()
        $("[rel='q8_2']").click()
        tmp = Math.random()
        if (tmp < 0.5167) {
            $("[rel='q8_3']").click()
        }
        tmp = Math.random()
        if (tmp < 0.1236) {
            $("[rel='q8_4']").click()
        }
        tmp = Math.random()
        if (tmp < 0.0470) {
            $("[rel='q8_5']").click()
        }

        tmp = Math.random()
        if (tmp < 0.1137) {
            $("[rel='q9_1']").click()
        }
        else if (tmp < 0.1137+0.5192) {
            $("[rel='q9_2']").click()
        }
        else if (tmp < 0.1137+0.5192+0.2361) {
            $("[rel='q9_3']").click()
        }
        else if (tmp < 0.1137+0.5192+0.2361+0.0667) {
            $("[rel='q9_4']").click()
        }
        else {
            $("[rel='q9_5']").click()
        }

        tmp = Math.random()
        if (tmp < 0.6366) {
            $("[rel='q10_1']").click()
        }
        else if (tmp < 0.6366+0.3251) {
            $("[rel='q10_2']").click()
        }
        else {
            $("[rel='q10_3']").click()
        }

        tmp = Math.random()
        if (tmp < 0.0865) {
            $("[rel='q11_7']").click()
        }
        else {
            flag = 0
            tmp = Math.random()
            if (tmp < 0.5315) {
                $("[rel='q11_1']").click()
                $("[rel='q11_2']").click()
                flag = 1
            }
            tmp = Math.random()
            if (tmp < 0.5785) {
                $("[rel='q11_3']").click()
                flag = 1
            }
            tmp = Math.random()
            if (tmp < 0.6712) {
                $("[rel='q11_4']").click()
                flag = 1
            }
            tmp = Math.random()
            if (tmp < 0.3300) {
                $("[rel='q11_5']").click()
                flag = 1
            }
            tmp = Math.random()
            if (tmp < 0.4771) {
                $("[rel='q11_6']").click()
                flag = 1
            }
            if (flag == 0) {
                $("[rel='q11_7']").click()
            }
        }

        tmp = Math.random()
        if (tmp < 0.3832) {
            $("[rel='q12_1']").click()
        }
        else if (tmp < 0.3882+0.3226) {
            $("[rel='q12_2']").click()
        }
        else if (tmp < 0.3882+0.3226+0.0692) {
            $("[rel='q12_3']").click()
        }
        else if (tmp < 0.3882+0.3226+0.0692+0.1112) {
            $("[rel='q12_4']").click()
        }
        else if (tmp < 0.3882+0.3226+0.0692+0.1112+0.0358) {
            $("[rel='q12_5']").click()
        }
        else if (tmp < 0.3882+0.3226+0.0692+0.1112+0.0358+0.0742) {
            $("[rel='q12_6']").click()
        }
        else {
            $("[rel='q12_7']").click()
        }

        tmp = Math.random()
        if (tmp < 0.0309) {
            $("[rel='q13_8']").click()
        }
        else {
            flag = 0
            tmp = Math.random()
            if (tmp < 0.4635 && flag < 3) {
                $("[rel='q13_1']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.5513 && flag < 3) {
                $("[rel='q13_2']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.4821 && flag < 3) {
                $("[rel='q13_3']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.4054 && flag < 3) {
                $("[rel='q13_4']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.2954 && flag < 3) {
                $("[rel='q13_5']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.1248 && flag < 3) {
                $("[rel='q13_6']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.1112 && flag < 3) {
                $("[rel='q13_7']").click()
                flag++
            }
            if (flag == 0) {
                $("[rel='q13_8']").click()
            }
        }

        tmp = Math.random()
        if (tmp < 0.0049) {
            $("[rel='q14_6']").click()
        }
        else {
            flag = 0
            tmp = Math.random()
            if (tmp < 0.5773 && flag < 2) {
                $("[rel='q14_1']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.6687 && flag < 2) {
                $("[rel='q14_2']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.1147 && flag < 2) {
                $("[rel='q14_3']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.2633 && flag < 2) {
                $("[rel='q14_4']").click()
                flag++
            }
            tmp = Math.random()
            if (tmp < 0.8530 && flag < 2) {
                $("[rel='q14_5']").click()
                flag++
            }
            if (flag == 0) {
                $("[rel='q14_6']").click()
            }
        }

        tmp = Math.random()
        if (tmp < 0.1162) {
            $("[rel='q15_1']").click()
        }
        else if (tmp < 0.1162+0.4710) {
            $("[rel='q15_2']").click()
        }
        else if (tmp < 0.1162+0.4710+0.3387) {
            $("[rel='q15_3']").click()
        }
        else {
            $("[rel='q15_4']").click()
        }

        tmp = Math.random()
        if (tmp < 0.4129) {
            $("[rel='q16_1']").click()
        }
        else if (tmp < 0.4129+0.3560) {
            $("[rel='q16_2']").click()
        }
        else if (tmp < 0.4129+0.3560+0.1570) {
            $("[rel='q16_2']").click()
        }
        else {
            $("[rel='q16_4']").click()
        }

        tmp = Math.random()
        if (tmp < 0.3486) {
            $("[rel='q17_1']").click()
        }
        else if (tmp < 0.3486+0.3164) {
            $("[rel='q17_2']").click()
        }
        else if (tmp < 0.3486+0.3164+0.1731) {
            $("[rel='q17_3']").click()
        }
        else if (tmp < 0.3486+0.3164+0.1731+0.1496) {
            $("[rel='q17_4']").click()
        }
        else {
            $("[rel='q17_5']").click()
        }

        tmp = Math.random()
        if (tmp < 0.4969) {
            $("[rel='q18_1']").click()
        }
        else if (tmp < 0.4969+0.3659) {
            $("[rel='q18_2']").click()
        }
        else if (tmp < 0.4969+0.3659+0.1137) {
            $("[rel='q18_3']").click()
        }
        else if (tmp < 0.4969+0.3659+0.1137+0.0148) {
            $("[rel='q18_4']").click()
        }
        else {
            $("[rel='q18_5']").click()
        }

        tmp = Math.random()
        if (tmp < 0.0890) {
            $("[rel='q19_1']").click()
        }
        else if (tmp < 0.0890+0.3609) {
            $("[rel='q19_2']").click()
        }
        else if (tmp < 0.0890+0.3609+0.5439) {
            $("[rel='q19_3']").click()
        }
        else {
            $("[rel='q19_4']").click()
        }

        tmp = Math.random()
        if (tmp < 0.4796) {
            $("[rel='q20_1']").click()
        }
        else {
            $("[rel='q20_2']").click()
        }
        sleep(5000).then(() => {
            $("#submit_button").click()
            var t = document.body.clientHeight;
            window.scroll({top: t, left:0, behavior: 'smooth'});
//             sleep(1000).then(() => {
//                 $("#SM_BTN_1").click()
//             })
        })


    })
})();