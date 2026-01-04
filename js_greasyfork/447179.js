// ==UserScript==
// @name         如法网练习选题
// @description  用于普法网学习练习题使用，自动选题
// @namespace    https://greasyfork.org/users/197529
// @version      0.9.9
// @author       BK
// @license      Unlicense
// @match        *://*.12348.gov.cn/*
// @noframes
// @require https://greasyfork.org/scripts/447162-12348rufa/code/12348rufa.js?version=1065638
// @downloadURL https://update.greasyfork.org/scripts/447179/%E5%A6%82%E6%B3%95%E7%BD%91%E7%BB%83%E4%B9%A0%E9%80%89%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/447179/%E5%A6%82%E6%B3%95%E7%BD%91%E7%BB%83%E4%B9%A0%E9%80%89%E9%A2%98.meta.js
// ==/UserScript==
"use strict";

/// 去除正文，只显示题目
document.querySelectorAll('.s_flzs_fnei')[0].remove()

const { addFloatButton } = {
  addFloatButton(text, onclick) /* 20220324-0950 */ {
    if (!document.addFloatButton) {
      const host = document.body.appendChild(document.createElement("div"));
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{position:fixed;top:4px;left:4px;z-index:2147483647;height:0}#i{display:none}*{float:left;padding:1em;margin:4px;line-height:0;color:#fff;user-select:none;background:#28e;border:1px solid #fffa;border-radius:8px;transition:.3s}[for]~:active{background:#4af;transition:0s}:checked~*{opacity:.3;transform:translateY(-3em)}:checked+*{transform:translateY(3em)}</style><input id=i type=checkbox><label for=i>`;
      document.addFloatButton = (text, onclick) => {
        const el = document.createElement("label");
        el.textContent = text;
        el.addEventListener("click", onclick);
        return root.appendChild(el);
      };
    }
    return document.addFloatButton(text, onclick);
  },
};
var data = ["A","B","C","D","E","F"];
var paileizh=new Array(); // 排列好的数据
  var newpaileizh=new Array();
var APIBL=true; // 如果为假表示远程连接题库失败
Start();
addFloatButton("点我答题", async function () {
  this.textContent = "点我答题";
  this.style.background = "#ff9800";
  // 设置
  // var f=document.querySelectorAll('span.question')[0].attributes.flag.value;
  Start();
  // this.textContent=f;
  //this.textContent = "运行结束";
  this.style.background = "#4caf50";
});

function Start(){
  if(paileizh.length==0){
    glGroup();
  }
  
  // 开始答题
  var $span=$("form.questions").find("span");
  var questionId,flag
  //this.textContent = "有"+$span.length+"题";
  // console.log(paileizh);
  for (var i = 0; i < $span.length;i++){
            questionId = $($span[i]).attr("qid");
            flag = $($span[i]).attr("flag");
    
    FindeAPI(questionId,flag);
    if(flag=="1"){
      //this.textContent="单选题";
      //dx(questionId);
    }else{
      //this.textContent="多选题";
      // 先搜索题库 如果没有在遍历
      //duxun(questionId);
      //var zh= getGroup(data);
      //console.log(zh);
    }
  }
  
}


function duxun(questiont,i=0,xb=4){
  
  
  
  
  xb=document.querySelectorAll(`input[type="checkbox"][name="`+questiont+`"]`).length;
  
  if(i>=paileizh.length ){
    return true;
  }
  for(var jjs=0;jjs<xb;jjs++){
    // 清除所有选中状态
    var d=document.querySelectorAll(`input[value="`+data[jjs]+`"][type="checkbox"][name="`+questiont+`"]`)[0];
    if(d.checked){
      // 如果是选中状态先点一下为未选中
      d.click();
    }
  }
  for(var ii=0;ii<newpaileizh[i].length;ii++){
    var d=document.querySelectorAll(`input[value="`+newpaileizh[i][ii]+`"][type="checkbox"][name="`+questiont+`"]`)[0];
    d.click();
  };
  // answer(); // 提交答案
  comAnswerMy();// 提交答案
  setTimeout(function(){
    if (comAnswers(questiont,newpaileizh[i],"No")=="2"){
      // 正确就不要循环了
       
     return true; 
    }else{
      // var j=i+1;
      console.log("长度"+paileizh.length);
      if(newpaileizh.length != paileizh.length){
        // 表示题库里的答案是错的，要重新遍历一次
        newpaileizh=paileizh;
        i=0;
      }
      return duxun(questiont,i+1,xb)
    };
  },500);
}






function dx (questiont){
  // 单选题
  var i=0
  var dd=findID(questiont);
  var rus="No"; //状态码判断是否要上传答案
  if(dd.length>0){
    console.log("单选找到了");
    i=data.indexOf(dd[0]);
    if(i<0){
      i=0;
    }else{
      rus="OK"
    }
  }else{
    console.log("单选没有找到");
  };
  var timer = setInterval(function(){
dj(i,timer,questiont,rus);
    i++;
},1000)
  
};

function dj(ii,t,questiont,rus){
    if (ii>=data.length){
    clearInterval(t);
  };
  var d=document.getElementById(data[ii]+','+questiont);
    d.click();
    //comAnswer();
  //answer(); // 提交答案
  comAnswerMy();// 提交答案
  setTimeout(function(){
    if (comAnswers(questiont,data[ii],rus)=="2"){
      // 正确就不要循环了
      
     clearInterval(t);
      
    };
  },500);
};

// API单选
function djAPI(daan,questiont){
  var d=document.getElementById(daan+','+questiont);
    d.click();
  comAnswerMy();// 提交答案
    if (comAnswers(questiont,daan,"OK")=="2"){
      // 正确就不要循环了  
     return 
    }else{
      // 答案不正确就执行遍历
      dx(questiont);
    };
};


function comAnswers(res,daan,rus){
  // 判断是否正确
  var c=$("#answer"+res).val();
    if(c=="回答错误"){
      clearInterval(interval);
								$(".tijiao").text("答题");
								$(".tijiao").attr("onclick","answer();");
      return "1";
    }else if(c=="回答正确"){
      if(rus == "No"){
        //表示上传
        // upload(res+"|"+daan);
      }
      
      return "2";
    }else{
      return "0"
    }
};


function getGroup(data, index = 0, group = []) {
  // 将选项进行全排序
  var need_apply = new Array();
  need_apply.push(data[index]);
  for(var i = 0; i < group.length; i++) {
    need_apply.push(group[i] +","+ data[index]);
  }
  group.push.apply(group, need_apply);
  if(index + 1 >= data.length) return group;
  else return getGroup(data, index + 1, group);
}

function glGroup(){
  // 过滤单选项
  var t=getGroup(data);
  //var need_apply2 = new Array();
  var need_apply3 = new Array();
  for(var iis=0;iis<t.length;iis++){
    var l=t[iis].split(",");
    if(l.length>1){
      need_apply3.push(l);
    };
  };
  //need_apply2.push(need_apply3);
  paileizh=need_apply3;
  return paileizh;
};
// console.log(DAAN);
//glGroup();

// 远程搜索答案
function FindeAPI(id,flag){
  var aa= new Array(); 
  if(APIBL){
  $.ajax({
        url: 'http://192.168.0.10:8001/xf/q/',
        type: 'GET',
        data: {'s': id,'x':'2022如法'},
        async: true,
        success: function (res) {
          console.log(res)
          if(res.code==1){
            aa=res.err.daan.split(",");
            // i=data.indexOf(aa[0]);
            if(aa.length==1){
              // 单选
              djAPI(aa[0],id)
            }else{
              // 多选题
              var dd=new Array();
              dd.push(aa);
              if(dd.length>0){
                console.log("多选找到了");
                newpaileizh=dd;
              }else{
                newpaileizh=paileizh;
                console.log("多选没到");
                };
              duxun(id);
              };
            
            return aa;
          }else{
            // 没有找到答案
          if(flag=="1"){
            dx(id);
          }else{
            newpaileizh=paileizh;
            duxun(id);
          }
          }
        },
        error: function (err) {
          // 网络异常等错误
          APIBL=false;
          if(flag=="1"){
            dx(id);
          }else{
            //newpaileizh=paileizh;
            var dds=findID(id)
            if(dds.length>0){
                console.log("多选找到了");
                newpaileizh=dds;
              }else{
                newpaileizh=paileizh;
                console.log("多选没到");
                };
            duxun(id);
          }
        }
    });
  }else{
    daTi(flag,id);
  }
}


// 答题操作
function daTi(flag,id){
  if(flag=="1"){
            dx(id);
          }else{
            //newpaileizh=paileizh;
            var dds=findID(id)
            if(dds.length>0){
                console.log("多选找到了");
                newpaileizh=dds;
              }else{
                newpaileizh=paileizh;
                console.log("多选没到");
                };
            duxun(id);
          }
}

function upload(question_data) {
  // 上传正确答案
    $.ajax({
        url: 'http://192.168.0.10:8001/xf/add/',
        type: 'POST',
        data: {'username': question_data,'splitstr':"|",'xm':'2022如法'},
        async: true,
        success: function (res) {
        },
        error: function (err) {
        }
    });
};
console.log(FindeAPI("1537017761858854912"));

function findID(id){
  // 查找答题
  // var DAAN =new Array(); // 完成题库收集后删除
  var newArr = DAAN.filter(function(p){
  return p.tm === id;
});
  var a = new Array();
  var newa = new Array();
  if(newArr.length>0){
     a=newArr[0].daan.split(",");
  }
  if(a.length>1){
    newa.push(a);
  }else{
    newa=a;
  }
  return newa;
}







// 答案判断
function comAnswerMy() {
  var answerDTOList = []
  var $span = $('form.questions').find('span')
  for (var i = 0; i < $span.length; i++) {
    var answer = {}
    answer.questionId = $($span[i]).attr('qid')
    answer.contentId = objId.split('objId=')[1]
    answer.contentType = $('.ctype').val()
    answer.flag = $($span[i]).attr('flag')
    answer.chapterId = $('.chaptId').val()
    if (answer.flag == 2) {
            	var v = []
            	var $select = $("input:checkbox[name='" + answer.questionId + "']:checked")
            	for (var j = 0; j < $select.length; j++) {
            		v.push($($select[j]).val())
            	}

      answer.answerResult = v.join(',')
    } else {
      answer.answerResult = $('input[name="' + answer.questionId + '"]:checked ').val()
    }
    if (!answer.answerResult) {
            	$('#answer' + answer.questionId).val('请选择')
            	$('#answer' + answer.questionId).addClass('answerfalse')
    }
    if (answer.answerResult) {
	            answerDTOList.push(answer)
    }
  }

  answerAll()
  $.ajax({
    type: 'post',
    async: true,
    url: '/fxmain/onlineanswer/ex',
    data: JSON.stringify(answerDTOList),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function(answerResult) {
      if (answerResult.extend.result.code == '500') {
        alert('答题异常，请不要采取非法答题！')
        removeFrontLoading()
        clickFlag = false
        return
      } else {
        var flag = false
        var size = 0
        for (var res in answerResult.extend.result) {
          var c = answerResult.extend.result[res]
          if (c == '0') {
            $('#answer' + res).val('回答错误')
            $('#answer' + res).addClass('answerfalse')
            flag = true
          }
          if (c == '1') {
            $('#answer' + res).val('回答正确')
            $('#answer' + res).addClass('answertrue').removeClass('answerfalse').removeClass('answerxz')
            $('#answer' + res).prop('disabled', true)
            $('input[name="' + res + '"]').each(function() {
              $(this).prop('disabled', true)
            })
            // 答案正确就把正确选择推送到数据库
            var newArr = answerDTOList.filter(function(p){
                return p.questionId === res;
              });
            upload(res+"|"+newArr[0].answerResult) 
          }
          size++
        }
        if (size == $span.length && !flag) {
          $('.tijiao').css('background', 'rgb(202, 202, 202)')
          $('.tijiao').prop('disabled', true)
        }
        if (flag) {
          $('.tijiao').attr('onclick', '')
          clearInterval(interval)
        }
        // $(".tijiao").attr("onclick","answer();");
        removeFrontLoading()
        clickFlag = false
      }
    },
    error: function(d) {
      removeFrontLoading()
      clickFlag = false
    }
  })
}