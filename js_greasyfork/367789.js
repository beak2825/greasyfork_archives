// ==UserScript==
// @name         灯塔党建自动答题
// @namespace    
// @version      2.0
// @description  1、增加答案显示
// @author       Aaron
// @match        http://*.dtdjzx.gov.cn/kaishijingsai.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367789/%E7%81%AF%E5%A1%94%E5%85%9A%E5%BB%BA%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/367789/%E7%81%AF%E5%A1%94%E5%85%9A%E5%BB%BA%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    var domen=location.href.substring(location.href.indexOf("//")+2,location.href.indexOf("."));
    var allDataList=[];
    var err=[];
    var dataId="";
    var dataName="";
    var tkList="";
    var isLoad=false;
    var allDataListWidthAns=[];
    var tkNum=0;
    $(".w_btn_tab").append("<div id='divAutoA' style='position:  absolute;margin-top: -35px;margin-left: 258px;'></span>");
    $("#divAutoA").append("<div id='divMsg' ></div>");
    function getAns(tm){
        for(let i=0;i<allDataList.length;i++){
            if(allDataList[i].subjectTitle.indexOf(tm)>=0){
                var a=allDataList[i].optionInfoList.filter(f=>f.isRight==1);
                return a;
            }
        }
        return [];
    }
    //获取全部题库列表
    $.get("http://"+domen+".dtdjzx.gov.cn/quiz-api/chapter_info/list",r=>{
        if(r.code==200&&r.data.length>0){
            tkList=r.data;
            dataId=r.data[0].id;
            dataName=r.data[0].title;
            loadTK();
        }
    });
    function randomClick(){
        for(var i=0;i<19;i++){
            ClickButton({
                button:0,
                clientX:getRandom(1051,974),
                clientY:getRandom(855,833)
            });
        }
    }
    function getRandom(max,min){
        return parseInt(Math.random()*(max-min+1)+min,10);
    }
    function loadTK(){
        $.get("http://"+domen+".dtdjzx.gov.cn/quiz-api/subject_info/list?chapterId="+dataId,r=>{
            if(r.code==200){
                $("#divMsg").text("成功载入《"+dataName+"》 "+r.data.totalSubject+" 题库！");
                allDataList=r.data.subjectInfoList;
                $("#divAutoA").prepend("<input type='checkbox' id='cbCheck4' style='margin-left: 8px;'>答案</input>");
                $("#divAutoA").prepend("<input type='checkbox' id='cbCheck2' style='margin-left: 8px;'>自动分析</input>");
                $("#divAutoA").prepend("<input type='checkbox' id='cbCheck3' style='margin-left: 8px;'>加载全部题库</input>");
                $("#divAutoA").prepend("<button style='height: 35px;width: 120px;color: #000;background: greenyellow;border-radius: 4px;cursor: pointer;' id='btnAuto'>开始自动答题</button>");
                $("#cbCheck3").click(e=>{loadOtherTK();});
                $("#cbCheck4").click(e=>{showAns();});

                $("#btnAuto").click(()=>{
                    randomClick();
                    let elemLi=$(".w_charu li");
                    for(var i=0;i<elemLi.length;i++){
                        $("#divMsg").text("正在查找 "+(i+1)+" 题目的答案...");
                        var e=elemLi[i];
                        var tm=$(e).find("h1 .W_ml10.w_fz18").text();
                        var ans=[];
                        if(A_ans.length>i){
                            ans=A_ans[i].split(',');
                        }else{
                            ans=getAns(tm);
                        }
                        if(ans.length<=0){
                            var autoC=$("#cbCheck2").prop("checked");
                            if(autoC){
                                var ansStr=muItem(tm);
                                if(ansStr){
                                    var e_lelemts_s=$(e).find("input").next();
                                    for(var ei=0;ei<e_lelemts_s.length;ei++){
                                        var e_as_l=$(e_lelemts_s[ei]).text().split(".");
                                        var e_as=e_as_l.length>1?e_as_l[1]:e_as_l[0];
                                        if(ansStr.indexOf(e_as)>=0)
                                            $(e_lelemts_s[ei]).prev().click();
                                    }
                                    err.push("第 "+(i+1)+" 题，未找到答案,分析成功，请您核实。");
                                    var t=getTnum(ansStr);
                                    console.log("第 "+(i+1)+" 题，答案:"+ansStr+t);
                                }else{
                                    err.push("第 "+(i+1)+" 题，未找到答案,分析失败");
                                }
                            }else{
                                err.push("第 "+(i+1)+" 题，未找到答案.");
                            }
                        }
                        ans.forEach(a=>{
                            if(a.optionTitle)
                                $(e).find("input").next(":contains('"+a.optionTitle+"')").prev().click();
                            else
                                $(e).find("[value='"+a+"']").click();
                        });
                    }
                    if(err.length>0){
                        $("#divMsg").html(err.join("<br/>"));
                    }else{
                        $("#divMsg").text("答题完成");

                    }
                });
            }
        });
    }
    var A_ans=[];
    var A_ansList=[];
    function showAns(){
        if(A_ans.length==0 && $("#cbCheck4").prop('checked')){
            if(A_ansList.length==0){
                $.ajax({
                    async:false ,
                    type: "post",
                    url:'http://'+domen+'.dtdjzx.gov.cn/quiz-api/game_info/lookBackSubject',
                    data:{roundOnlyId:roundOnlyId},
                    dataType: "json",
                    success: function(data) {
                        if(data.success&&data.data.dateList.length>0){
                            A_ansList=data.data.dateList;
                            let ttt="";
                            let i=0;
                            A_ansList.forEach(e=>{
                                A_ans.push(e.answer);
                                i++;
                                ttt+=i+":"+e.answer+"、";
                            });
                            $("#divMsg").text(ttt);
                        }else{
                            $("#divMsg").text("答案加载失败");
                        }
                    }
        });
            }else{
                let ttt="";
                let i=0;
                A_ansList.forEach(e=>{
                    A_ans.push(e.answer);
                    i++;
                    ttt+=i+":"+e.answer+"、";
                });
                $("#divMsg").text(ttt);
            }
        }else{
            A_ans=[];
        }
    }
    function getTnum(s){
        var ss=s.split("|");
        var str="";
        if(ss.length>1){
            let lastCount=tkNum%200;

            for(var i=1;i<ss.length;i++){
                var n=parseInt(ss[i])||0;
                if(n>0){
                    var z= n<=lastCount?1:parseInt((n-lastCount)/200)+2;
                    var t=n<=lastCount?n:(n-lastCount)%200;
                    str+="第"+z+"期，第"+t+"题。";
                }
            }
        }
        return str;
    }
    function loadOtherTK(){
        if(!isLoad && $("#cbCheck3").prop('checked')){
            allDataList=[];
            tkList.forEach(tk=>{
                $.get("http://"+domen+".dtdjzx.gov.cn/quiz-api/subject_info/list?chapterId="+tk.id,r=>{
                    if(r.code==200){
                        allDataList=allDataList.concat(r.data.subjectInfoList);
                        tkNum+=r.data.totalSubject;
                        $("#divMsg").text("成功载入"+tkNum+" 题库！");
                    }
                });
            });
        }
    }
    //分析变异题目
    function muItem(qStr){
        if(allDataListWidthAns.length==0)
            addAns();
        let index=qStr.indexOf('（）');
        let serLen=qStr.length>10?10:qStr.length;
        let toRight=true;
        let serIndex=0;
        let serStr='';
        if(index<qStr.length/2){
            serIndex=index+2;
        }else{
            serIndex=index-serLen;
            toRight=false;
        }
        var list=[];
        var is_add=true;
        list=getG(qStr.substr(serIndex,serLen));
        var n_l=list.length;
        while (list.length!=1 && serLen>1){
            if(list.length<1){
                serLen--;
                if(!toRight)
                    serIndex++;
            }
            if(list.length>1){
                serLen++;
                if(!toRight)
                    serIndex--;
            }
            list=getG(qStr.substr(serIndex,serLen));
            if(list.length!=n_l)
                break;
        }
        if(list.length>0){
            var in_list=findIndex(qStr,"（）");
            var ass=[];
            in_list.forEach(e=>{
                var s=getAnsStr(qStr,list[0],e);
                var st=list[0].split("|");
                if(st.length>1)
                    s+="|"+st[1];
                ass.push(s);
            });
            return ass.join(";");
        }
        return "";
    }
    function getAnsStr(qStr,mbStr,index){
        let s_index=-1;let e_index=-1;
        if(index<3)
            s_index=index;
        else if(index >= qStr.length-3)
            e_index=mbStr.length-1;
        if(e_index<0){
            let i_index=1;
            let endStr="";
            let endIndex=-1;
            while (endIndex<index && (index+i_index+3)<=qStr.length) {
                i_index++;
                endStr=qStr.substr(index+i_index,3);
                endIndex= mbStr.indexOf(endStr);
            }
            if(endIndex>index){
                e_index=endIndex;
            }
        }
        if(s_index<0){
            let i_index=2;
            let staStr="";
            let staIndex=-1;
            while (staIndex<0 && (index-i_index)>=0) {
                i_index++;
                staStr=qStr.substr(index-i_index,3);
                staIndex= mbStr.indexOf(staStr);
            }
            if(staIndex>=0){
                s_index=staIndex+3;
            }
        }
        if(s_index<e_index&&s_index>=0)
            return mbStr.substring(s_index,e_index);
    }
    function getG(str){
        var l=[];
        allDataListWidthAns.forEach(e=>{
            if(e.indexOf(str)>=0){
                l.push(e);
            }
        });
        return l;
    }
    function findIndex(str1,str2){
        var res=[];
        var len=0;
        var list=str1.split(str2);
        for(var i=0;i<list.length-1;i++){
            if(i==0){
                if(list[i].length==0)
                    res.push(0);
                else{
                    len=list[i].length;
                    res.push(len);
                }
            }else{
                len=len+list[i].length+str2.length;
                res.push(len);
            }
        }
        return res;
    }
    function addAns(){
        var i=0;
        allDataList.forEach(e=>{
            i++;
            var ans="";
            e.optionInfoList.forEach(a=>{
                if(a.isRight=="1")
                    ans+=a.optionTitle;
            });
            var t=e.subjectTitle.replace(/（/g,ans);
            t=t.replace(/）/g,"");
            allDataListWidthAns.push(t+"|"+i);
        });
    }
})();