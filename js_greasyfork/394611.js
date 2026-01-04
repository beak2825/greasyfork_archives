// ==UserScript==
// @name         LDU - 评教
// @namespace    http://blog.pxpoi.cn/
// @version      0.1
// @description  For LDU评教系统
// @author       three eyes
// @match        http://202.194.48.46:8080/login.jsp
// @grant        none
// @require     https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/394611/LDU%20-%20%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/394611/LDU%20-%20%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

 
//登陆post:            http://202.194.48.46:8080/doLogin?userId=...&password=...
//获取课程列表get:     http://202.194.48.46:8080/evaluationList
//提交选课请求post：   http://202.194.48.46:8080/saveStudentEvaluationNew
 
//开放性评语
var comments = [
    "重视教学，对教学工作认真、热情、敬业",
    "尊重学生，一视同仁，关心学生成才成长",
    "遵守教学规定，按时上下课，不擅自调课",
    "注重维护课堂纪律，关注学生的学习状态",
    "教态自然、大方，着装整洁、得体，精神饱满",
    "备课充分，内容充实，对讲授内容熟练",
    "基本知识讲解清晰准确，重、难点突出",
    "教学内容体现本专业前沿问题及最新研究成果",
    "注重学生实践应用能力培养",
    "教学适用，能提供参考资料，扩大信息量",
    "讲课思路清晰，语言规范，形象生动",
    "根据教学内容灵活运用多种教学方法",
    "注重启发式教学，重视培养学生分析问题、解决问题能力",
    "注重培养学生的批判性思维、创新意识和综合能力",
    "教学手段运用恰当，合理运用现代化教育技术手段",
    "能较好掌握教学内容，并能消化巩固",
    "能有效达成专业培养目标",
    "能激发学生对这门课的学习兴趣",
    "能学到很多课本以外的东西，使学生受益匪浅",
    "对学生未来所从事职业有较大帮助",
];
 
//获取课程列表并评教
function runEvaluate() {
    var list;
    var evaluatedata;
    $.ajax({
        url : 'http://202.194.48.46:8080/evaluationList',
        type : 'GET',
        dataType: "json", //指定服务器返回的数据类型
        success : function(result) {
            list = result;
            var num = -1;
            var max = list.length;
        
 
            function incrementNumber() {
                num++;
                
                //如果执行次数未达到max设定的值，则设置另一次超时调用
                if (num < max) {   
 
                    $.ajax({
                        url : 'http://202.194.48.46:8080/getEvaluationIndexNew',
                        data: {
                            'pjjgid': list[num].PJJGID,
                            'zbtxcode': list[num].ZBTXCODE
                        },
                        type : 'POST',
                        dataType: "json", //指定服务器返回的数据类型
                        success : function(getEvaluationIndexNewResult) {
                            
                            //数据准备
                            var yearTerm = list[num].XQ;
                            var kcid = list[num].KCID;
                            var jsid = list[num].JSID;
                            var pjjgid = list[num].PJJGID;
                            //时间戳
                            var kssj = Date.parse(new Date());
                            var randomNum = Math.floor(Math.random() * (comments.length-1));
                            kfxpjText = comments[randomNum] + comments[randomNum+1];
                            //json数据封装
                            var data = '{\"yearTerm\":\"' + yearTerm + '\",';
                            for (var j = 0; j< getEvaluationIndexNewResult.length ; j++) {
                                index = j
                                data += "\"" + kcid + "_" + ++index + "\":\"" + getEvaluationIndexNewResult[j].ZBFZ + "\",";
                            }
                            data += '\"kcid\":\"' + kcid + '\",';
                            data += '\"zbzs\":\"' + j + '\",';
                            data += '\"jsid\":\"' + jsid + '\",';
                            data += '\"pjjgid\":\"' + pjjgid + '\",';
                            data += '\"kssj\":\"' + kssj + '\",';
                            data += '\"kfxpjText\":\"' + kfxpjText + '\"';
                            data += '}';
                            console.log("data:" + data)
                            data = JSON.parse(data);
                        
                            //-------提交数据-------
                            $.ajax({
                                url : 'http://202.194.48.46:8080/saveStudentEvaluationNew',
                                data: data,
                                type : 'POST',
                                dataType: "json", //指定服务器返回的数据类型
                                success : function(result) {
                                    console.log("评教成功，课程名:" + list[num].KCMC)
                                },
                                error : function(result) {
                                    console.log("error:" + result);
                                }
                            });
                            //---------------
                            setTimeout(incrementNumber, 500);
                        },
                        error : function(result) {
                            console.log("error:" + result);
                        }
                    }); 
                    
 
                    
                } else {
                    console.log("学号：" + userId + " 评教完成,课程数：" + num);
                    //退出
                    logout();
                }
            }
            setTimeout(incrementNumber, 500);
        },
        error : function(result) {
            console.log("get list error:" + result);
        }
    });
}
 
//退出
function logout() {
    $.ajax({
        url : 'http://202.194.48.46:8080/doLogout',
        type : 'GET',
        success : function(result) {
            //选课
            console.log("学号：" + userId + "已退出登录...")
        }
    });
}
 
 
var userId = "2016220xxxx";
var password = userId;
 
//登录
$.ajax({
    data : 'userId='+userId+'&password='+password,
    url : 'http://202.194.48.46:8080/doLogin',
    type : 'POST',
    dataType: "json", //指定服务器返回的数据类型
    success : function(result) {
        var name;
        $.ajax({
            url : 'http://202.194.48.46:8080/manage',
            type : 'GET',
            success : function(result) {
                var index = result.lastIndexOf("<span class=\"ui-layout-north-about-user-userinfo\">");
                console.log(index);
                name=result.substring(index+50, index+53);
                console.log("学号：" + userId + " " + name + " 已登录，开始评教...")
            }
        });
        runEvaluate();
    },
    error : function(result) {
        console.log("error:" + result);
    }
});
