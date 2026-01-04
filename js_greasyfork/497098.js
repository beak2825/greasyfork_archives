// ==UserScript==
// @name         IT报事转coding
// @namespace    http://tampermonkey.net/
// @version      2024-06-05.v3
// @description  内部使用
// @author       You
// @match        https://itsd.sunac.com.cn/admin/index.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunac.com.cn
// @grant        none
// @license MIT
// @require https://scriptcat.org/lib/637/1.4.1/ajaxHooker.js#sha256=k69hpCTTpzC162cpC1b4R2QyG/NRLFcbRV+7orOXq+k=
// @downloadURL https://update.greasyfork.org/scripts/497098/IT%E6%8A%A5%E4%BA%8B%E8%BD%ACcoding.user.js
// @updateURL https://update.greasyfork.org/scripts/497098/IT%E6%8A%A5%E4%BA%8B%E8%BD%ACcoding.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...

    // alert("hello");

/*
ajaxHooker.filter([
    {type: 'xhr', url: 'https://itsd.sunac.com.cn/admin/ticket/list.do', method: 'POST'},
    // {url: /^http/},
]);
*/

    window.onkeypress = function(e){

        console.log("    window.onkeypress " , e.shiftKey , e.key);

        if(e.shiftKey && e.key == 'S')
        {

            showParams()
        }
    }

    function showParams()
    {
                 document.body.innerHTML = ["<h3>参数设置</h3>"
                                            , "<h4>如果需要修改，请按 shift + S 进入此设置页面</h4>"
                                            , "<a href='https://sunac.feishu.cn/docx/B6QId9RZyorRXexNmY0cba67n0f' style='color:blue'>README</a>"

                                      , "AssigneeId (处理人) <input id='AssigneeId' value='"+ (window.localStorage.getItem("AssigneeId")||"") +"' /> "
                                      , "ProjectName (项目英文名) <input id='ProjectName' value='"+ (window.localStorage.getItem("ProjectName")||"")+"' /> "
                                      , "IterationCode (迭代ID) <input id='IterationCode' value='"+ (window.localStorage.getItem("IterationCode")||"")+"' /> "
                                      , "ParentCode (运维故事ID) <input id='ParentCode' value='"+ (window.localStorage.getItem("ParentCode")||"")+"' /> "
                                      , "IssueTypeId (事项类型ID) <input id='IssueTypeId' value='"+ (window.localStorage.getItem("IssueTypeId")||"")+"' /> "
                                      , "TOKEN (CODING TOKEN) <input id='TOKEN' value='"+ (window.localStorage.getItem("CODING-TOKEN")||"")+"' /> "
                                      , "CustomFieldValues (自定义属性)"
                                            , " <textarea id='CustomFieldValues' style='height: 200px; width: 400px' >"+ (window.localStorage.getItem("CustomFieldValues")||"[]")+"</textarea> "
                                      , "  <button onclick='javascript:window.setParams(1)'>修  改</button> " + "  <button onclick='javascript:window.setParams(0)'>取  消</button> "


                                       ].join("<br />");
    }

    window.setParams = function(y){

if(!y){
    location.reload()
    return
}

         window.localStorage.setItem("AssigneeId", document.getElementById("AssigneeId").value.trim());
         window.localStorage.setItem("ProjectName", document.getElementById("ProjectName").value.trim());
         window.localStorage.setItem("IterationCode", document.getElementById("IterationCode").value.trim());
         window.localStorage.setItem("ParentCode", document.getElementById("ParentCode").value.trim());
         window.localStorage.setItem("IssueTypeId", document.getElementById("IssueTypeId").value.trim());
         window.localStorage.setItem("CustomFieldValues", document.getElementById("CustomFieldValues").value.trim());
         window.localStorage.setItem("CODING-TOKEN", document.getElementById("TOKEN").value.trim());

        alert("修改成功");
        location.reload()
    }


    var waitadd = false;
    function add(data, itid){


        if(waitadd)
        {
            alert("不要连续提交");
            return;
        }

        if( "1" === window.localStorage.getItem(itid))
        {
            var y = confirm(itid + " 号任务貌似已经添加过了，是否重新添加");
            if(!y){
                return;
            }
        }

        waitadd = true;


          const response = fetch("https://wydevops.coding.net/open-api?Action=CreateIssue", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
        "Authorization":"token "+ window.localStorage.getItem("CODING-TOKEN"),
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
          .then(resp=>{
              alert("添加成功");

        waitadd = false;
              window.localStorage.setItem(itid, "1");

          });

    }


    window.addToCoding = function(e)
    {
        console.warn("addToCoding", e);

        var AssigneeId =  window.localStorage.getItem("AssigneeId");
                                      var ProjectName =  window.localStorage.getItem("ProjectName");
                                      var IterationCode =  window.localStorage.getItem("IterationCode");
                                      var ParentCode =  window.localStorage.getItem("ParentCode");
                                      var IssueTypeId =  window.localStorage.getItem("IssueTypeId");
                                      var CustomFieldValues = JSON.parse( window.localStorage.getItem("CustomFieldValues") || "[]" );
                                      var TOKEN =  window.localStorage.getItem("CODING-TOKEN");

        var workhours = 1

        if( AssigneeId && ProjectName && IterationCode && ParentCode && IssueTypeId && TOKEN  )
        {
            workhours =  prompt("输入工单解决时长(小时)", "0.2")
        }else{

            showParams();

            return;
        }

        var cfv = [];

        for(var i = 0;i < CustomFieldValues.length; i ++)
        {
            var c = CustomFieldValues[i].content;
            cfv.push({
              "Id":CustomFieldValues[i].id,
                "Content": c instanceof Array ? c.join(",") : c
            })

        }

        // alert(e.innerText);

        var title  = e.nextElementSibling.title;

 var data =          {
     "Action":"CreateIssue",
  "AssigneeId": AssigneeId,
  "CustomFieldValues":  cfv,
  "FileIds": [
  ],
  "IssueTypeId": IssueTypeId,
  "IterationCode": IterationCode,
  "LabelIds": [

  ],
  "Name": "[IT-"+e.innerText.trim()+"]" + title,
  "ParentCode": ParentCode,
  "Priority": "0",
  // "ProjectModuleId": "1",
  "ProjectName": ProjectName,

  // "RequirementTypeId": "0",
  // "StatusId": "1",
  // "TargetSortCode": "0",
  // "ThirdLinks": [],
  "Type": "SUB_TASK",
  "WatcherIds": [
  ],
  "WorkingHours": workhours
}  ;

        add(data, e.innerText.trim())
    }


    function any()
    {
    }

    var onResps = {};

     onResps["GET /admin/ticket/personalClosedList.do"] =
    onResps["POST /admin/ticket/personalClosedList.do"] =
     onResps["GET /admin/ticket/list.do"] =
    onResps["POST /admin/ticket/list.do"] = function(res ){

        console.warn('响应',res )

        res.responseText = res.responseText.replace(/(sid_ticket.*?<td)/gs, "$1 onclick='javascript: window.addToCoding(this)' ");

    };


ajaxHooker.hook(request => {
    console.log(request);

    var fresp = onResps[request.method + " " + request.url ]
        || onResps[request.method + " " + request.url.split('?')[0] ];
    if(fresp){
        request.response = fresp
    }
});


})();