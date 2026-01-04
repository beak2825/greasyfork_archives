// ==UserScript==
// @name         TikN雨课堂学堂在线试卷导出工具
// @namespace    http://blmm.top/
// @version      0.1.0
// @description  将雨课堂网页版试卷导出为TikN可识别的格式。
// @author       Fairytale_Store
// @match        https://examination.xuetangx.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482929/TikN%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%AF%95%E5%8D%B7%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482929/TikN%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%AF%95%E5%8D%B7%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function p(e){
    console.log(e)
}

var pageContent
function solve(){
    p("ok")
    pageContent = document.body.innerHTML;
    var dom=document.getElementsByClassName("subject-item")
    var problemDom=[];
    var list=["单选题","多选题","判断题"]
    for(var i=0;i<dom.length/2;i++)problemDom.push(dom[i+dom.length/2])
    p(problemDom)
    var str="";
    for(i=0;i<problemDom.length;i++){
        var more=1;
        var problemContent=problemDom[i].querySelectorAll(".clearfix p")[0]
        if(!problemContent){
            problemContent=problemDom[i].querySelectorAll(".clearfix")[0];
            more=2;
        }
        else{
            var idList=problemDom[i].querySelectorAll(".checkboxInput")
            var ansList=problemDom[i].querySelectorAll(".checkboxText")
            if(idList.length==0&&ansList.length==0){
               idList=problemDom[i].querySelectorAll(".radioInput")
                ansList=problemDom[i].querySelectorAll(".radioText")
                more=0;
            }
        }
         problemContent=problemContent.textContent.replace(/\n|\r/g, "")

        str+=("第"+(i+1)+"题"+"("+list[more]+"):"+problemContent)+"<br>"
        if(more==2){
            continue;
        }
        p(idList)
        for(var j=0;j<idList.length;j++){
            var opt=idList[j].innerText.replace(/\n|\r/g, "")+":"+ansList[j].innerText.replace(/\n|\r/g, "")
            str+=opt+"<br>"
        }
        str+="<br>"
   }
   p(str)
   document.body.innerHTML=str;
   window.print()
}


class Question {
  constructor(Qtype, Qcontent, answerList, correctAnswer) {
    this.Qtype = Qtype;
    this.Qcontent = Qcontent;
    this.answerList = answerList;
    this.correctAnswer = correctAnswer;
  }
}

function strReplace(str,key){
    if(str.includes(key)){
        return key;
    }
    return str;
}

function saveStringToFile(str, filename) {
    var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function test(){
    p("ok")
    pageContent = document.body.innerHTML;
    var pd=document.querySelector(".time")
    if(pd){
        alert("这张试卷还没有完成，完成后再进行导出")
        return
    }
    var elements = document.querySelectorAll('.result_item');//所有题目的集合

    var QList=[]
    for(var i=0;i<elements.length;i++){
       var cur=elements[i]
       //=========
       var Qtype=cur.querySelector(".item-type").textContent;//获取类型
       Qtype=strReplace(Qtype,"单选题")
       Qtype=strReplace(Qtype,"多选题")
       Qtype=strReplace(Qtype,"判断题")
       //==========
       var Qcontent=cur.querySelector('.clearfix.exam-font p');//获取题目描述
       if(!Qcontent)Qcontent=cur.querySelector('.clearfix.exam-font')
       Qcontent=Qcontent.innerText
       //=========
       var answerList=[]  //获取单个题目的答案集合
       if(Qtype=="判断题"){
           answerList=["对","错"]
       }else{
           var ansList=cur.querySelectorAll(".radioText p")
           for(var j=0;j<ansList.length;j++){
               var tmp=ansList[j].innerText;
               if(tmp&&tmp!="")answerList.push(tmp)
           }
       }
       p(answerList)
       //=========
        var correctAnswer;
        try{
           correctAnswer=cur.querySelector('.item-footer--header').innerText.match(/正确答案：\s*(\S+)/)[1]; //获取正确答案
        }catch(error){
            correctAnswer="主观题答案获取等待下次开发"
        }
       if(!correctAnswer)correctAnswer=""
       //========
       QList.push(new Question(Qtype,Qcontent,answerList,correctAnswer))
    }
    var str=""
    for(var k=0;k<QList.length;k++){
        var q=QList[k]
        //str+="【"+q.Qtype+"】"
        str+=q.Qcontent
        //str+="<strong>"+q.correctAnswer+"</strong>"
        str+="\r\n"
        if(q.Qtype=="判断题")continue
        for(var x=0;x<q.answerList.length;x++){
            var id=String.fromCharCode(65 + x); //答案选项字母
            var choice=q.answerList[x]
            str+=id+"."+choice+"\r\n"
        }
        str+="#"+q.correctAnswer+"#"
    }
    var saveAll ="<TikS><本试卷使用TikN雨课堂导出工具V1.0自动生成>" + str
    saveStringToFile(saveAll,"导出习题.tik")
    //window.print()
}

(function() {
    window.onload = function() {
        setTimeout(function() {
            test()
            //document.body.innerHTML=pageContent
   }, 3000);
 };


})();