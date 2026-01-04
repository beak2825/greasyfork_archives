// ==UserScript==
// @name        大连东软作业系统
// @description 作业系统，你懂的
// @namespace    http://tampermonkey.net/
// @version      0.2
// @include      http://hw.neusoft.edu.cn/hw/exercise/exercise.do*
// @include      http://hw-neusoft-edu-cn.portal.neutech.com.cn/hw/exercise/*
// @downloadURL https://update.greasyfork.org/scripts/432838/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E4%BD%9C%E4%B8%9A%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/432838/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E4%BD%9C%E4%B8%9A%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==


$(function (){
    var autoChooseAnswer = true;
    var submitAnswer = true;
    //alert(sj);
    function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = location.search.substr(1).match(reg);
      if (r!=null) return (r[2]); return null;
    }
    var eid = getParameter("eid");
    function getAllAnswers() {
        $.ajax({
            type:'post',
            url:'getQuestList.do',
            data:sj,
            cache:false,
            dataType:'json',
            success : function (data) {
                console.log(data);
                var string = "";
                var ans = data.list;
                for (var i = 0; i < ans.length;i++){

                    $.ajax({
                        type : "POST",
                        url : "http://hw.neusoft.edu.cn/hw/exercise/saveoa.do",
                        data : {
                            qt_id: ans[i].qt_id,
                            qid: ans[i].qid,
                            objectiveanswer: ans[i].answer.replace(' ',''),
                            position: i + 1,
                            eid: eid,
                        },
                    })
                }
            }
        });
        //alert("选择完毕");
    }
    function getAnswer(ins) {
        $.ajax({
            type:'post',
            url:'getQuestList.do',
            data:sj,
            cache:false,
            dataType:'json',
            success : function (data) {
                console.log(data.list[ins].answer+ "/" +data.list[ins].chooseSequence);
                if (submitAnswer){
                    var string = "";
                    var ans = data.list;
                    var i = ins;
                    $.ajax({
                        type : "POST",
                        url : "http://hw.neusoft.edu.cn/hw/exercise/saveoa.do",
                        data : {
                            qt_id: ans[i].qt_id,
                            qid: ans[i].qid,
                            objectiveanswer: ans[i].answer,
                            position: i + 1,
                            eid: eid,
                        },
                    });
                    if (autoChooseAnswer){
                        var seq = ans[i].chooseSequence.replace(' ','');
                        var answer = ans[i].answer.replace(' ','');
                        var seqs = seq.split("");
                        var k = seqs.indexOf(answer);
                        for (var j=0;i<seqs.length;i++){
                            if(j==k){
                                document.getElementById("sc_"+ans[i].qid + j).checked="checked";
                            } else {
                                document.getElementById("sc_"+ans[i].qid + j).checked="";
                            }
                        }


                    }
                }
            }
        });
        //alert("选择完毕");
    }
    document.getElementsByClassName("col-md-12")[0].getElementsByTagName("img")[0].onclick=getAllAnswers;
    var list = document.getElementById("exercise").getElementsByTagName("li");
    for (var i=0;i<list.length;i++){
        getAnswer(list[i]);
    }
    //document.getElementsByClassName("col-md-12")[0].innerHTML.replace("<img src=\"/hw/page/hwms/images/1.png\" width=\"140\">","<img src=\"/hw/page/hwms/images/1.png\" width=\"140\" onclick=\"getAllAnswers();\">")
});
(function () {


    $.ajax({
        type: 'post',
        url: 'getQuestList.do',
        data: sj,
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            var sss = data
            let newAns = "<title>ans</title>"
            for (let i = 0; i < sss.list.length; i++) {

                let tt = sss.list[i];
                let ansList = tt.chooseSequence
                if( tt.qt_id <= 3 )
                {
                    tt.answer = tt.answer.replace(" ","")
                }
                console.log(i+" : " + tt.answer + " : " + tt.ansList )
                if (tt.qt_id == 1) {

                    let anslist = tt.chooseSequence;
                    if (tt.item6 == null) {
                        ansList = ansList.replace("F", "");
                    }
                    if (tt.item5 == null) {
                        ansList = ansList.replace("E", "");
                    }
                    if (tt.item4 == null) {
                        ansList = ansList.replace("D", "");
                    }
                    if (tt.item3 == null) {
                        ansList = ansList.replace("C", "");
                    }
                    if (tt.item2 == null) {
                        ansList = ansList.replace("B", "");
                    }
                    if (tt.item1 == null) {
                        ansList = ansList.replace("A", "");
                    }
                    for (let k = 0; k < ansList.length; k++) {
                        if (ansList[k] == tt.answer) {
                            let chr = ""
                            switch (k) {
                                case 0:
                                    chr = "A";
                                    break;
                                case 1:
                                    chr = "B";
                                    break;
                                case 2:
                                    chr = "C";
                                    break;
                                case 3:
                                    chr = "D";
                                    break;
                                case 4:
                                    chr = "E";
                                    break;
                                case 5:
                                    chr = "F";
                                    break;
                                default:
                                    newAns = " 错误 请联系代码作者"
                                    break;
                            }
                            newAns = newAns + "<br>" + (i + 1) + " " + tt.subject + chr + " " + "</br>"
                            console.log(tt.subject+ansList + "  " + tt.answer)
                            break;

                        }
                    }
                } else if (tt.qt_id == 2) {
                    newAns = newAns + "<br> " + (i + 1) + " 多选题 :</br><br>";
                    if (tt.item6 == null) {
                        ansList = ansList.replace("F", "");
                    }
                    if (tt.item5 == null) {
                        ansList = ansList.replace("E", "");
                    }
                    if (tt.item4 == null) {
                        ansList = ansList.replace("D", "");
                    }
                    if (tt.item3 == null) {
                        ansList = ansList.replace("C", "");
                    }
                    if (tt.item2 == null) {
                        ansList = ansList.replace("B", "");
                    }
                    if (tt.item1 == null) {
                        ansList = ansList.replace("A", "");
                    }
                    for (let it = 0; it < tt.answer.length; it++) {
                        for (let k = 0; k < ansList.length; k++) {
                            if (ansList[k] == tt.answer[it]) {
                                let chr = ""
                                switch (k) {
                                    case 0:
                                        chr = "A";
                                        break;
                                    case 1:
                                        chr = "B";
                                        break;
                                    case 2:
                                        chr = "C";
                                        break;
                                    case 3:
                                        chr = "D";
                                        break;
                                    case 4:
                                        chr = "E";
                                        break;
                                    case 5:
                                        chr = "F";
                                        break;
                                    default:
                                        newAns = " 错误 请联系代码作者"
                                        break;
                                }
                                newAns = newAns + chr;
                                break;
                            }
                        }
                    }
                    newAns = newAns + "</br>";
                } else if (tt.qt_id == 3) {
                    newAns = newAns + "<br>" + (i + 1) + " " + tt.answer + " " + "</br>"
                } else if (tt.qt_id == 4) {
                    newAns = newAns + "<br>" + (i + 1) + " " + tt.answer + " " + "</br>"
                }

            }
            let myWindow = window.open('', '', 'width=640,height=860');
            myWindow.document.write(newAns)
        },
        error: function (data) {
            showError("服务器错误");
        }
    });


    // Your code here...
})();
