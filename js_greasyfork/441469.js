// ==UserScript==
// @name         招聘系统简历下载
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  为猎聘、猎上等系统创建简历下载按钮
// @author       You
// @match        https://hh.hunteron.com/talents.html*
// @match        https://h.liepin.com/resume/showresumedetail*
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441469/%E6%8B%9B%E8%81%98%E7%B3%BB%E7%BB%9F%E7%AE%80%E5%8E%86%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/441469/%E6%8B%9B%E8%81%98%E7%B3%BB%E7%BB%9F%E7%AE%80%E5%8E%86%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function image2Base64(img) {
      img.setAttribute("crossOrigin","anonymous");
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
  }
  function getImage(img){
    var result = image2Base64(img);
     result = image2Base64(img);
    return result;
  }

  function lt(label){
      return $("span:contains('"+label+"')").parent("li").find("p:eq(0)").text().trim();
  }
  if(location.href.match(/hunteron/)){
    setTimeout(function(){
    getImage(document.getElementsByClassName("avatar-box")[0].getElementsByTagName("img")[0]);
    $("<a>").text("下载简历").addClass("add-into-position").appendTo(".side-slipe-action").click(function(){
      if(localStorage.getItem("username")==undefined||localStorage.getItem("username")==""){
          var username = prompt("请输入您的账号");
          localStorage.setItem("username",username);
       }
       username = localStorage.getItem("username");
       var profile = {
            tel:lt("联系电话："),
            email:lt("邮  箱："),
            hrName:username,
            language:"中文",
            name:$(".candidate-name").text(),
            workStatus:"未知",
            gender:$(".candidate-name").parent("li").find("p:eq(1)").text().indexOf("先生")>-1?"男":"女",
            birthYear:parseInt(new Date().getFullYear())-parseInt(lt("年  龄：").match(/\d+岁/g)[0].replace(/岁/g,"")),
            position:lt("所 在 地："),
            education:lt("最高学历："),
            workStartYear:parseInt(new Date().getFullYear())-parseInt(lt("工作年限：").match(/\d+年经验/g)[0].replace(/年经验/g,"")),
            currentTitle:lt("目前职位："),
            currentCompany:lt("目前公司："),
            school:lt("毕业学校："),
            avatar:getImage(document.getElementsByClassName("avatar-box")[0].getElementsByTagName("img")[0]),
            description:$(".self-evaluation .n-text").html(),
            workExpirience:[],
            projectExpirience:[],
            educationHistory:[],
            skills:[],
            languageSkills:[]
        };
        try{
            profile.expactMonthlySalary=parseInt($("span:contains('基本薪资')").parent("li").find("span:eq(4)").text().trim().match(/\d+/g)[0]);
        }catch{}
         try{
            profile.expactSalaryMonth=parseInt($("span:contains('基本薪资')").parent("li").find("span:eq(4)").text().trim().match(/\d+/g)[1]);
        }catch{}
        $(".work-experiences .experience-con").each(function(){
           var wex= {
                  company:$(this).find(".c-name").text(),
                  title:$(this).find(".fwb-name").text(),
                  startMonth:parseInt($(this).find(".time").text().split(",")[0].replace("（","").split("-")[0].replace(".","").trim()),
                  description:$(this).find(".work-sub li:eq(0) .n-text").html()
              };
            try{
                wex.endMonth=parseInt($(this).find(".time").text().split(",")[0].replace("（","").split("-")[1].replace(".","").replace("（","").replace("）","").replace("至今","").trim());
            }catch{}

            profile.workExpirience.push(wex);
        });
        $(".project-experiences .experience-con").each(function(){
           var work={
               name:$(this).find(".name").text(),
               startMonth:parseInt($(this).find(".time:eq(0)").text().replace(/（.*）/g,"").split("-")[0].replace(".","").trim()),
           };
           try{
            work.endMonth=parseInt($(this).find(".time:eq(0)").text().replace(/（.*）/g,"").split("-")[1].replace(".","").trim());
           }catch{}
           try{
               work.role=$(this).find("span:contains('项目职务：')").parent("li").find("span:eq(1)").text();
           }catch{}
           try{
               work.description= $("span:contains('项目描述：')").parent("li").find(".n-text").html().trim();;
           }catch{}
            try{
                work.duty= $("span:contains('项目职责：')").parent("li").find(".n-text").html().trim();;
            }catch{}
           profile.projectExpirience.push(work);
        });
        $(".education-experiences .experience-con").each(function(){
            var school={
                school:$(this).find(".title").text(),
                major:$(this).find(".name p:eq(1)").text(),
                education:$(this).find(".s-title").text(),
                startMonth:parseInt($(this).find(".time").text().replace(/（.*）/g,"").split("-")[0].replace(".").trim()),
                endMonth:parseInt($(this).find(".time").text().replace(/（.*）/g,"").split("-")[1].replace(".").trim())
            };
            profile.educationHistory.push(school);
        });
        $(".other-info ul:eq(0) .separate-info-list").each(function(){
          var lan ={
              name:$(this).find(".n-text:eq(0)").text()
          };
            try{
                lan.description=$(this).find(".n-text:eq(1)").text()
            }catch{}
            try{
                lan.certification=$(this).find(".n-text:eq(2)").text()
            } catch{}
            profile.languageSkills.push(lan);
        })
        console.log(JSON.stringify(profile));
        $.ajax({
               type:"POST",
               dataType:"json",
               data:JSON.stringify(profile),
               url:"https://hrssc.fewju.com/api/profile2",
               //url:"http://localhost:5000/api/profile2",
               contentType:"application/json",
               success:function(data){
                 console.log(data);
                 location.href="https://hrssc.fewju.com/resume/details/"+data;
               }
             });
    });
  },3000);
  }else if(location.href.match(/liepin/)){
    setTimeout(function(){
      image2Base64(document.getElementsByClassName("res-logo")[0]);
      $("<button>").addClass("hunt-btn line primary recom-job-btn").text("下载简历").appendTo(".rd-operation-left").click(function(){
          var mob = prompt("输入电话号码");
          var email=prompt("输入邮箱地址");
          if(mob==undefined || mob.length<10){
              alert("电话号码格式不正确");
              return false;
          }
          if(localStorage.getItem("username")==undefined||localStorage.getItem("username")==""){
           var username = prompt("请输入您的账号");
           localStorage.setItem("username",username);
          }
          username = localStorage.getItem("username");
          $(".rd-info-other-link").click();
          var profile = {
              tel:mob,
              email:email,
              hrName:username,
              language:$(".res-tab-title").text(),
              name:$("h4").prop("title"),
              workStatus:$(".user-status-tag").text(),
              gender:$(".basic-cont").text().indexOf("男")>-1?"男":"女",
              birthYear:parseInt(new Date().getFullYear())-parseInt($(".basic-cont").text().match(/\d+岁/g)[0].replace(/岁/g,"")),
              position:$(".basic-cont .sep-info:eq(0)").html().split("<i></i>")[2],
              education:$(".basic-cont .sep-info:eq(0)").html().split("<i></i>")[3],
              //workStartYear:parseInt(new Date().getFullYear())-parseInt($(".basic-cont").text().match(/\d+年工作经验/g)[0].replace(/年工作经验/g,"")),
              currentTitle:$(".basic-cont .sep-info:eq(1)").html().split("<i></i>")[0],
              currentCompany:$(".basic-cont .sep-info:eq(1)").html().split("<i></i>")[1],
              avatar:image2Base64(document.getElementsByClassName("res-logo")[0]),
              description:$("#resume-detail-self-eva-info .resume-detail-template-cont").html(),
              workExpirience:[],
              projectExpirience:[],
              educationHistory:[],
              skills:[],
              languageSkills:[]
          };
           try{
              profile.workStartYear=parseInt(new Date().getFullYear())-parseInt($(".basic-cont").text().match(/\d+年工作经验/g)[0].replace(/年工作经验/g,""));
          } catch{
            try{
              profile.workStartYear=parseInt(new Date().getFullYear())-parseInt($(".basic-cont").text().match(/工作\d+年/g)[0].replace(/年/g,"").replace(/工作/g,""));
            }
             catch{
              profile.workStartYear=parseInt($(".basic-cont").text().match(/\d+年毕业/g)[0].replace(/年毕业/g,""))
             }
          }
          try{
              profile.expactMontlySalary=parseFloat($(".salary").text().split("-")[0].trim().replace("k","000"));
          } catch{}
          try{
              profile.ExpanctSalaryMonth=parseFloat($(".salary").text().split("·")[1].trim().replace("薪",""));
          } catch{}

          //工作经历
          $("#resume-detail-work-info .rd-work-item-cont").each(function(i){
              var wex= {
                  company:$(this).find("h5").text(),
                  title:$(this).find(".job-name:eq(0)").text(),
                  startMonth:parseInt($(this).find(".rd-work-time:eq(0)").text().split(",")[0].replace("（","").split("-")[0].replace(".","").trim()),
                  description:$(this).find(".rd-info-col-title:contains('职责业绩：')").parent().find(".rd-info-col-cont").html()
              };
              try{
                  wex.devision=$(this).find(".rd-info-col-title:contains('所在部门：')").parent().find(".rd-info-col-cont").text();
              } catch{}

              try{
                  wex.position=$(this).find(".rd-info-col-title:contains('工作地点：')").parent().find(".rd-info-col-cont").text();
              } catch{}
               try{
                 wex.subordinateQty=parseInt($(this).find(".rd-info-col-title:contains('下属人数：')").parent().find(".rd-info-col-cont").text());
               } catch{}
               try{
                 wex.reportTo=$(this).find(".rd-info-col-title:contains('汇报对象：')").parent().find(".rd-info-col-cont").text();
               } catch{}
                try{
                  wex.monthlySalary=parseFloat($(this).find(".rd-info-col-title:contains('薪　　资：')").parent().find(".rd-info-col-cont").text().split("·")[0].replace("k","000").trim());
                } catch{}
                try{
                  wex.salaryMonth=parseFloat($(this).find(".rd-info-col-title:contains('薪　　资：')").parent().find(".rd-info-col-cont").text().split("·")[1].replace("薪","").trim());
                } catch{}
                try{
                  wex.endMonth=parseInt($(this).find(".rd-work-time:eq(0)").text().split(",")[0].replace("（","").split("-")[1].replace(".","").replace("至今","").trim());
                } catch{}
                profile.workExpirience.push(wex);
                //profile.workExpirience.push(wex);
              })
             //项目经历
             $("#resume-detail-project-info .rd-project-item-cont").each(function(){
               var work={
                 name:$(this).find("h5").text(),
                 startMonth:parseInt($(this).find(".rd-project-time:eq(0)").text().split(",")[0].replace("（","").split("-")[0].replace(".","").trim()),
               };
               try{
                   work.company=$(this).find(".rd-info-col-title:contains('所在公司：')").parent().find(".rd-info-col-cont").text();
               }catch{}
               try{
                   work.role=$(this).find(".rd-info-col-title:contains('项目职务：')").parent().find(".rd-info-col-cont").text();
               }catch{}
               try{
                   work.endMonth=parseInt($(this).find(".rd-project-time:eq(0)").text().split(",")[0].replace(")","").split("-")[1].replace(".","").replace("至今","").trim());
               }catch{}
               try{
                   work.description=$(this).find(".rd-info-col-title:contains('项目描述：')").parent().find(".rd-info-col-cont").html();
               }catch{}
               try{
                   work.duty=$(this).find(".rd-info-col-title:contains('项目职责：')").parent().find(".rd-info-col-cont").html();
               }catch{}
               try{
                   work.performance=$(this).find(".rd-info-col-title:contains('项目业绩：')").parent().find(".rd-info-col-cont").html();
               }catch{}
               profile.projectExpirience.push(work);
             });
             //教育经历
             $("#resume-detail-edu-info .edu-school-cont").each(function(){
               var school={
                   school:$(this).find(".school-name").text(),
                   major:$(this).find(".school-special").text(),
                   education:$(this).find(".school-degree").text(),
                   startMonth:parseInt($(this).find(".school-time").text().split(",")[0].replace("（","").split("-")[0].replace(".","").trim()),
                   endMonth:parseInt($(this).find(".school-time").text().split(",")[0].replace("）","").split("-")[1].replace(".","").trim())
               };
               profile.educationHistory.push(school);
             });
             //技能
             $("#resume-detail-skill-info .skill-tag").each(function(){
               profile.skills.push({name:$(this).text(),score:0});
             });
             //语言能力
             $("#resume-detail-lang-info .rd-lang-item").each(function(){
               var lan={
                 name:$(this).find(".lang-name").text()
               };
               try{
                 lan.description=$(this).find(".lang-level").eq(0).text();
               } catch{}
               try{
                 lan.certification=$(this).find(".lang-level").eq(1).text();
               } catch{}
              profile.languageSkills.push(lan);
             });
             console.log(profile);
             $.ajax({
               type:"POST",
               dataType:"json",
               data:JSON.stringify(profile),
               url:"https://hrssc.fewju.com/api/profile2",
               //url:"http://localhost:5000/api/profile2",
               contentType:"application/json",
               success:function(data){
                 console.log(data);
                 location.href="https://hrssc.fewju.com/resume/details/"+data;
               }
             });
      });
  },3000);
  }
  
})();