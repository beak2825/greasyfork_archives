// ==UserScript==
// @name         中国大学Mooc助手【免费使用】
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  中国大学Mooc助手
// @author       cunningYW
// @match        https://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/417297/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6Mooc%E5%8A%A9%E6%89%8B%E3%80%90%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/417297/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6Mooc%E5%8A%A9%E6%89%8B%E3%80%90%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%E3%80%91.meta.js
// ==/UserScript==




// 完整版安装链接：https://www.happy.xn--6qq986b3xl/happymooc.user.js
// 完整版使用说明：https://www.happy.xn--6qq986b3xl/sysm









function pigai(py){
var userId=window.webUser.id
var tid = window.location.href.slice(-10,)
$.ajax({
url:'https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getHomeworkInfo.dwr',
type:'post',
data:{ 'callCount':'1' ,
       'scriptSessionId':'\$\{scriptSessionId\}190' ,
       'c0-scriptName':'MocQuizBean' ,
       'c0-methodName':'getHomeworkInfo' ,
       'c0-id':'0' ,
       'c0-param0':'string:'+tid ,
       'c0-param1':'null:null' ,
       'c0-param2':'boolean:false' ,
       'batchId':'1'},
    success:function(msg){var aid=msg.match(/(?=aid:)(.*?)(?=,)/g)
    aid=aid[0].replace('aid:','')
    //console.log(aid)
    $.ajax({
              url : 'https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getHomeworkPaperDto.dwr',
	          type: 'post',
              data:{
               "callCount":"1" ,
              "scriptSessionId":"${scriptSessionId}190",
              "c0-scriptName":"MocQuizBean" ,
              "c0-methodName":"getHomeworkPaperDto" ,
              "c0-id":"0" ,
              "c0-param0":"string:" +tid,
              "c0-param1":"string:"+userId ,
              "c0-param2":"boolean:false" ,
              "c0-param3":"number:2" ,
              "c0-param4":"string:"+aid,
               "batchId":"1"},
                 success: function(msg){
                     var ids_scores=new Array()
                      var qids_lists=msg.match(/(?=qid=).*?(?=;.*score=)/g)
                      //console.log(qids_lists)
                      var qids_list=[];
                      for(var qs=0;qs<qids_lists.length;qs++) {
                          var items=qids_lists[qs]
                      if($.inArray(items,qids_list)==-1) {
                        qids_list.push(items);
                      }
                    }
                      //console.log(qids_list)
                      var qid_list=new Array
                      var list_keys1=new Array
                      var list_keys=new Array
                      for(let q=0;q<qids_list.length;q++){
                      qid_list.push([qids_list[q].replace('qid=','')])
                      }
                      //console.log(qid_list)
                      var ids=msg.match(/.id=(.*?);.*.maxScore=(.*?);/g)
                            for (let n = 0; n < ids.length; n++){var id_score=ids[n].match(/\d+/g)
                            var id=id_score[0]
                            var score=id_score[2]
                            ids_scores.push([id,score])
                            list_keys1.push(id.slice(-10))
                            //console.log(ids_scores)
                            }
                     //console.log(list_keys1)
                     for(let i=0;i<list_keys1.length;i++){
                         if(list_keys.indexOf(list_keys1[i])==-1){list_keys.push(list_keys1[i])}}
                     //console.log(list_keys)
                     var new_list1=new Array
                     var new_list=new Array
                     for(let i=0;i<list_keys.length;i++){var list_1=new Array
                     //console.log(list_keys[i])
                     for(let l=0;l<ids_scores.length;l++){
                         if(ids_scores[l][0].indexOf(list_keys[i])!=-1){
                             list_1.push(ids_scores[l])}
                                                  }new_list.push(list_1)
                     }
                      //console.log(new_list)
      $.ajax({
	  url : 'https://www.icourse163.org/dwr/call/plaincall/MocEvaluateBean.getEvaluateDetail.dwr',
	  type:'post',
      data :{
       'callCount':'1',
       'scriptSessionId':'\$\{scriptSessionId\}190',
       'c0-scriptName':'MocEvaluateBean',
       'c0-methodName':'getEvaluateDetail',
       'c0-id':'0',
       'c0-param0':'string:'+tid,
       'c0-param1':'string:'+userId,
       'batchId':'1'
      },
      success: function(msg){
      var eid_self=msg.match(`.answerformId=${aid};.*?evaluateId=(.*?);`)
      var eid=eid_self[1]
           var data0=
                        `"callCount": "1",
                        "scriptSessionId": "\$\{scriptSessionId\}190",
                        "c0-scriptName": "MocEvaluateBean",
                        "c0-methodName": "submitSubmissionEvaluate",
                        "c0-id": "0",
                        "c0-param0": "Object_Object:{evaluateId:reference:c0-e1,testId:reference:c0-e2,qitems:reference:c0-e3}",
                        "c0-param1": "boolean:false",
                        "batchId": "1",
                        "c0-e1": "string:${eid}",
                        "c0-e2": "number:${tid}",`
                  var data1=''
                  var n=4 ,k=0,j=0,c3=''
                  //console.log(ids_scores)
                  for (let i=0;i<qid_list.length;i++){
                      var c8=''
                  data1+=`"c0-e${n}":"Object_Object:{qid:reference:c0-e${n+1},qcomment:reference:c0-e${n+2},answerCanViewComment:reference:c0-e${n+3},jitems:reference:c0-e${n+4}}",
                        "c0-e${n+1}":"number:${qid_list[i]}",
                        "c0-e${n+2}":"string:${py}",
                        "c0-e${n+3}":"boolean:true",`
                  for(let x=0;x<new_list[i].length;x++){c8 += `reference:c0-e${n+5+j},`
                                                       j+=3}
                      data1 += `"c0-e${n+4}":"Array:[${c8}]",`
                      for(let l=0;l<new_list[i].length;l++){data1+=`
                        "c0-e${n+5+k}":"Object_Object:{jid:reference:c0-e${n+6+k},jscore:reference:c0-e${n+7+k}}",
                        "c0-e${n+6+k}":"string:${new_list[i][l][0]}",
                        "c0-e${n+7+k}":"string:${new_list[i][l][1]}",`
                         k+=3}
                      c3+=`reference:c0-e${n},`
                      n=n+k+5
                  }
                     var e3=`"c0-e3": "Array:[${c3}]"`
                     var data_end=`{${data0+data1+e3}}`
                      data_end = eval("(" + data_end + ")")
           $.ajax({
                                 url : 'https://www.icourse163.org/dwr/call/plaincall/MocEvaluateBean.submitSubmissionEvaluate.dwr',
                                 type: 'post',
                                  data:data_end,
                                     success :function(){}})
                          $.ajax({
                                 url : 'https://www.icourse163.org/dwr/call/plaincall/MocEvaluateBean.startOneSubmissionEvaluate.dwr',
                                 type: 'post',
                                 data:{
                                       'callCount':'1',
                                       'scriptSessionId':'${scriptSessionId}190' ,
                                       'c0-scriptName':'MocEvaluateBean' ,
                                       'c0-methodName':'startOneSubmissionEvaluate' ,
                                       'c0-id':'0' ,
                                       'c0-param0':'string:'+tid ,
                                       'c0-param1':'string:'+userId ,
                                         'batchId':'1'},
                                 success:function(msg){
                                 eid=msg.match(/evaluateId=(.*?);/g)[0].match(/\d+/g)[0]
                                 var data0=
                        `"callCount": "1",
                        "scriptSessionId": "\$\{scriptSessionId\}190",
                        "c0-scriptName": "MocEvaluateBean",
                        "c0-methodName": "submitSubmissionEvaluate",
                        "c0-id": "0",
                        "c0-param0": "Object_Object:{evaluateId:reference:c0-e1,testId:reference:c0-e2,qitems:reference:c0-e3}",
                        "c0-param1": "boolean:false",
                        "batchId": "1",
                        "c0-e1": "string:${eid}",
                        "c0-e2": "number:${tid}",`
                  var data1=''
                  var n=4 ,k=0,j=0,c3=''
                  //console.log(ids_scores)
                  for (let i=0;i<qid_list.length;i++){
                      var c8=''
                  data1+=`"c0-e${n}":"Object_Object:{qid:reference:c0-e${n+1},qcomment:reference:c0-e${n+2},answerCanViewComment:reference:c0-e${n+3},jitems:reference:c0-e${n+4}}",
                        "c0-e${n+1}":"number:${qid_list[i]}",
                        "c0-e${n+2}":"string:${py}",
                        "c0-e${n+3}":"boolean:true",`
                  for(let x=0;x<new_list[i].length;x++){c8 += `reference:c0-e${n+5+j},`
                                                       j+=3}
                      data1 += `"c0-e${n+4}":"Array:[${c8}]",`
                      for(let l=0;l<new_list[i].length;l++){data1+=`
                        "c0-e${n+5+k}":"Object_Object:{jid:reference:c0-e${n+6+k},jscore:reference:c0-e${n+7+k}}",
                        "c0-e${n+6+k}":"string:${new_list[i][l][0]}",
                        "c0-e${n+7+k}":"string:${new_list[i][l][1]}",`
                         k+=3}
                      c3+=`reference:c0-e${n},`
                      n=n+k+5
                  }
                     var e3=`"c0-e3": "Array:[${c3}]"`
                     var data_end=`{${data0+data1+e3}}`
                      data_end = eval("(" + data_end + ")")
                                       $.ajax({
                                 url : 'https://www.icourse163.org/dwr/call/plaincall/MocEvaluateBean.submitSubmissionEvaluate.dwr',
                                 type: 'post',
                                  data:data_end,
                                     success :function(){}})
                                 }})
      }})
                 }})
    }
})
}
function begin(s,py){
    if($('.count.f-pa').length==5){
                                   if(s!=null){
                                   if(s>0&&s<=31){
    var times = 0
    function aa(){
		setTimeout(function(){
			pigai(py)
            times++
			//console.log("program in for:"+times)
			if(times<+s+1){
				aa()
			}else{alert('互评已完成')
                location.reload()
                 }
		}, 500)
	}
                aa()
           }else{alert('请输入正确批改份数')}}}else if($('.u-btn.f-fl.j-backbtn').length>0){
                                   if(s!=null){
                                   if(s>0&&s<=31){
  times = 0
    function aa(){
		setTimeout(function(){
			pigai(py)
            times++
			//console.log("program in for:"+times)
			if(times<+s+1){
				aa()
			}else{alert('互评已完成')
                location.reload()
                 }
		}, 500)
	}
                aa()
           }else{alert('请输入正确批改份数')}}}else{alert('不在互评界面')}}
$(document).ready(function(){
  $("#flip").click(function(){
      window.open('https://www.happy.xn--6qq986b3xl/sysm/')
      $("#panel").slideToggle(800);
      $("#correct").slideToggle(800);
      $("#correct1").slideToggle(800);
  });
});
$('body').append($(`<style>
#flip
{
    font-family:楷体;
    font-size: 20px;
	text-align:center;
	background-color:#e5eecc;
	border:solid 1px #c3c3c3;
    width: 300px;
    height: 50px;
    margin: 1px;
    position:fixed;
    top:200px;
    right:10px;
}
#panel
{
    font-family:楷体;
    font-size: 20px;
	text-align:center;
	background-color:#e5eecc;
    width: 300px;
    height: 370px;
    margin: 1px;
    position:fixed;
    top:250px;
    right:10px;
	display:none;
}
#ways{
    font-family:楷体;
    font-size: 16px;
}
#ways{
	text-shadow: 5px 5px 5px #E6E6E6;
}
.tools:hover{
box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)
}
.tools {
    background-color: #FAAC58;
    color: #e5eecc;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    font-family:楷体;
    font-size: 20px;
    border-radius: 6px;
}
.tools_c a {
    color: #585858;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}
.tools_c {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 143px;
    border-radius: 6px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}
.tools_c a:hover {
background-color: #f1f1f1
}

.tool:hover .tools_c {
    display: block;
}

.tool:hover .tools {
    background-color: #0080FF;
}
.tool {
    position: relative;
    display: inline-block;
}
.title123{
   position: relative;
   width:180px;
   height:30px
}
.num{
   font-size:16px;
   color:#8000FF;
}
.title123{
   background-color: white;
}
.fade{
  font-size:15px;
}

</style>`))
$('body').append(`<button id="flip">戳我进入互评功能。</button>
   <div id="panel">安装完整版使用全部功能!<p id="ways">使用方法：输入你要互评的份数，点击互评作业按钮，等待互评完成的提示就ok
     <p class="num">请输入互评份数</p>
        <input class="title123" style="font-family:楷体;font-size:16px" value="5">
        </textarea>
     <p class="num">请输入互评评语</p>
        <input class="title123" style="font-family:楷体;font-size:16px" value="很好，继续努力！">
        </textarea>
      </p>
   </div>
                  `)

$("#panel").append(`<div class="tool">
  <p>↓↓↓</p>
  <button class="tools">嘎巴工具箱~</button>
  <div class="tools_c">
    <a onclick='getnum()'>一键互评</a>
    <a target="_blank" href="https://www.happy.xn--6qq986b3xl/HappyMooc.user.js">完整版下载</a>
    <a target="_blank" href="https://www.happy.xn--6qq986b3xl/sysm">完整版使用说明</a>
  </div>
</div><p class="fade">此版本只有互评功能</p><p class="fade">完整功能版(一键答题、互评、随堂测验、考试)请打开工具箱-->完整版下载
 直接安装,安装完成后便可只使用完整版关闭此脚本。</p>`)
$(".title123").focus(function(){
 if($(this).val()=="很好，继续努力！"||$(this).val()=="5")
$(this).val("");
});
$(".title123").eq(0).blur(function(){
     if($(this).val()==""){
      $(this).val("5");
         }
});
$(".title123").eq(1).blur(function(){
   if($(this).val()==""){
$(this).val("很好，继续努力！");
   }
});

getnum=function(){
var s = $(".title123")[0].value
var py= $(".title123")[1].value
begin(s,py)
}