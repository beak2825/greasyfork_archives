// ==UserScript==
// @name         深大辅助选课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于选课方案组合辅助选课
// @author       ldb
// @match        http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/*default/curriculavariable.do*
// @grant        none
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      http://code.jquery.com/jquery-1.10.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/420343/%E6%B7%B1%E5%A4%A7%E8%BE%85%E5%8A%A9%E9%80%89%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/420343/%E6%B7%B1%E5%A4%A7%E8%BE%85%E5%8A%A9%E9%80%89%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let table=[]
  let selectList=[]
  let res = []
  const des = "【勾选方案内课程中要选的老师，将会显示所有方案，按按钮切换方案】"
  let now = -1
function init(){
  let $buttonArea=$("<div style=\"padding-top:5px;padding-bottom:5px;float:right;font-size:18px\"><span id=\"showPage\"></span><button style=\"margin-left:5px;font-size:18px\">next</button></div>")
  let $resultArea=$("<div style=\"padding-top:5px;padding-bottom:5px;float:right;font-size:18px\"><span id=\"showResult\"></span></div>")
  $buttonArea.find("span").text('0/0')
  $buttonArea.find("button").click(function(){
    if(!res.length)
      return
    now+=1
    if(now>=res.length)
      now=0
    showResult()
  })
  $("#cvProgramCourse .cv-pull-left").append($buttonArea)
  $("#cvProgramCourse .cv-pull-left").append($resultArea)
}
function showResult(){
  $("#cvCanSelectProgramCourse .cv-row ").each(function(){
    let courseNumber = $(this).attr("coursenumber")
    if(res.length>0&&res[now][courseNumber]){
      let tmp = res[now][courseNumber]
      $(this).find(".cv-course").html(tmp.name+"<br>"+tmp.teacher+"<br>"+tmp.time)
    }else{
      $(this).find(".cv-course").html(table[$(this).attr("index")].name)
    }
  });
  $("#showPage").text(res.length?(now+1)+"/"+res.length:"0/0")
  let content = ""
  if(res.length>0){
    console.log(res[now])
    for(let t in res[now]){
      let tmp = res[now][t]
      content+=("【"+tmp.name+"("+tmp.teacher+"|"+tmp.time+")"+"】")
    }
  }else{
    content += des
  }
  $("#showResult").text(content)
}

function getResult(){
    let select_time= {}
    res = []
    function find(index){
      if(index>=selectList.length&&selectList.length>0){
        let cpy = {}
        for (let key in select_time) {
          let tmp = select_time[key]
          if(cpy[tmp.number]){
            cpy[tmp.number].time+=("<br>"+key)
            continue
          }
          cpy[tmp.number]={teacher:tmp.teacher,time:key,name:tmp.course}
        }
        res.push(cpy)
        return
      }else if(selectList.length<=0){
        return
      }
      for(let i of selectList[index].teacher){//选老师
        let flag = false
        for(let t of i.time){//判断时间
          if(select_time[t]){
            flag = true
            break
          }
        }
        if(flag)
          break
        for(let t of i.time){//选择该时间
          select_time[t]={teacher:i.name,course:selectList[index].name,number:selectList[index].courseNumber}
        }

        find(index+1)//找下一个
        for(let t of i.time){
          delete select_time[t]
        }

      }
      return
    }
    find(0,[])
    if(res.length>0)
      now=0
    else
      now=-1
}

function showTeacher($listArea,$input,courseNumber){
  for(let i of selectList){
    if(i.courseNumber==courseNumber){
        $input.prop("checked",true)
        for(let t of i.teacher){
          let $tmp = $("<div class=\"partInput\"><span></span><input type=\"checkbox\" name=\"running\" style=\"width:30px;\"></div>")
          $tmp.find("input").prop("id", t.id)
          $tmp.find("input").click(function(){
            if(!$(this).prop("checked")){
              $tmp.remove()
              let id = $(this).prop("id")

              for(let k in i.teacher){
                if(i.teacher[k].id==id){
                  i.teacher.splice(k,1)
                }
              }
              if(i.teacher.length<=0){
                for(let i in selectList){
                  if(selectList[i].courseNumber==courseNumber){
                      $listArea.find(".partInput").remove()
                      selectList.splice(i, 1)
                      $input.prop("checked", false)
                      break
                  }
                }
              }
              if(selectList.length>0)
              getResult()
              showResult()
            }
          })
          $tmp.find("span").text(t.name)
          $listArea.append($tmp)
        }
        $listArea.find("input").prop("checked",true)
        break;
    }
  }
}
init()
ah.proxy({
  onRequest:(config,handler)=>{handler.next(config);},
  onError:(err,handler)=>{
      console.log(err.type)
      handler.next(err)},
  onResponse:(response,handler)=>{
      if(response.config.url=="http://bkxk.szu.edu.cn:80/xsxkapp/sys/xsxkapp/elective/programCourse.do"){
          let data= JSON.parse(response.response).dataList
          table = []
          for(let i of data){
              let tmp ={id:null,name:null,teacher:[],select:false,num:0,courseNumber:null}
              let teacherList = i.tcList
              tmp.name=i.courseName
              tmp.courseNumber = i.courseNumber
              for(let t of teacherList){
                  let j = {}
                  tmp.num++
                  j.id=tmp.num
                  j.time = t.teachingPlace.replace(/\s/g,"").match(/星期(.*?)节/g)
                  j.name = t.teacherName||"教师未安排"
                  tmp.teacher.push(j)
              }
              table.push(tmp)
          }
          handler.next(response)
          showResult()
          $("#cvCanSelectProgramCourse .cv-row ").each(function(){
              let courseNumber = $(this).attr("coursenumber")
              let index = $(this).attr("index")
              let $listArea=$("<div style=\"float:right\"></div>")
              $(this).append($listArea)
              $listArea.append($("<div><span>全部</span><input type=\"checkbox\" name=\"running\" style=\"width:30px;\"></div>"))
              let $input=$listArea.find("input")
              showTeacher($listArea,$input,courseNumber)
              $input.click(function(){
                  if($(this).prop("checked")){
                    selectList.push(JSON.parse(JSON.stringify(table[index])))
                    showTeacher($listArea,$input,courseNumber)
                  }else{
                    for(let i in selectList){
                      if(selectList[i].courseNumber==courseNumber){
                          $listArea.find(".partInput").remove()
                          selectList.splice(i, 1)
                          break
                      }
                    }
                  }
                    getResult()
                    showResult()

                  event.stopPropagation()
              })
          });
    }else{
      handler.next(response)
    }

  }

})
})();