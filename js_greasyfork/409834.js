// ==UserScript==
// @name         鸿科经纬试题采集
// @namespace    http://yun.exam.hotmatrix.cn/
// @version      0.3
// @description  下载“错题回看”页中全部试题和答案（登录http://hotmatrix.cn/后，单击“我的课程，选择一门课程进入，单击“开始训练”进入后直接选“我要交卷”交空卷后返回，再选“错题回看”进入，脚本会自动在上面生成【下载试题】，单击下载即可自动汇集全部本页试题和答案。）
// @author       冯涛
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @match        http://yun.exam.hotmatrix.cn/student/examPaperWrongQuestionDetail?examPaperUserId=*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/409834/%E9%B8%BF%E7%A7%91%E7%BB%8F%E7%BA%AC%E8%AF%95%E9%A2%98%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/409834/%E9%B8%BF%E7%A7%91%E7%BB%8F%E7%BA%AC%E8%AF%95%E9%A2%98%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetNode =document.getElementsByClassName("ctr-parent-score")[0];

    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(function(mutations) {
        observer.disconnect(); // 停止观测
        getdata();
    });
    observer.observe(targetNode, { attributes: true, childList: true, subtree: true });//使用配置文件对目标节点进行观测
})();

// 当节点发生变化时的需要执行的函数
function getdata(){
    var questions="";
    let promiseArr = [];
    $("a.ctr-eps-a").each(function(i,e){
        promiseArr.push(new Promise((resolve, reject) => {
            let slfingerprint= $(e).attr("slfingerprint"); //题号
            let examPaperUserId=getUrlParam("examPaperUserId");
            let url="http://yun.exam.hotmatrix.cn/student/doExamPaperSubjectCheck?epuId=" + examPaperUserId + "&slFingerprint=" + slfingerprint + "&paperScore=1.0&userPaperId=" + examPaperUserId + "&epTrainingUseRole=1";
            $.ajax({
                method: "get",
                url: url,
                success:function(req){
                    let data =$.parseHTML(req);
                    let title= (i+1) + ". " + $(data).find(".st-title").children("div").text().replace(/\t/g,"").replace(/\n/g,"") + "[内部ID:" + slfingerprint + "]" ;
                    let options= $(data).find(".options").find("span").text().replace(/\t/g,"").replace(/\n/g,"").replace(/(A)/g,"$1:").replace(/([B-D])/g,"\n$1:");
                    let answer= $(data).find(".answer-area").next().text().replace(/\t/g,"").replace(/\n/g,"") ;
                    let temp=title + "\n"  + options  + "\n"  + answer   + "\n\n";
                    let q=temp;
                    questions +=   q ;
                    resolve();
                }
            })
        } ))
    })
    Promise.all(promiseArr).then(res => {
        var blob = new Blob([questions]);
        var a = document.createElement('a');
        a.innerHTML = "下载试题";
        a.download = "question";
        a.href = URL.createObjectURL(blob );
        $(".name-box2").append(a);
    });
}


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
