// ==UserScript==
// @name     airflow-hack2
// @namespace thedream
// @description "调整airflow菜单和表格列显示，设置查询参数start date"
// @version  2.2.2
// @grant    none
// @include http://airflow.thedream.cc/*
// @include http://airflow.plat.x.thedream.cc:8180/*
// @include http://106.14.76.163:8092/*
// @include http://106.14.155.64:8092/*
// @author thedream
// @downloadURL https://update.greasyfork.org/scripts/424943/airflow-hack2.user.js
// @updateURL https://update.greasyfork.org/scripts/424943/airflow-hack2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var dtd = null;

  function addMenu(){
    var $ul = $(".navbar-nav .dropdown").eq(2).find("ul")
    $ul.find('li').eq(3).after('<li><a href="/taskinstance/list/?_oc_TaskInstanceModelView=start_date&_od_TaskInstanceModelView=desc" data-original-title="" title="">Task Instances(Ordered)</a></li>')
    $ul.find('li').eq(4).after('<li><a href="/taskinstance/list/?_flt_3_state=failed&_oc_TaskInstanceModelView=start_date&_od_TaskInstanceModelView=desc" data-original-title="" title="">Task Instances(Failed)</a></li>')
  }

  function deleteTh(){
    var len = 0

    do{
      var $ths = $(".table thead tr th")
      var $name =$($ths[len]).find('a').text().replace(/\s*/g,"")
      var $name1 = $($ths[len]).text().replace(/\s*/g,"")
      if($name == 'QueuedByJobId' || $name1 == "ExternalExecutorId" || $name == 'Pool'|| $name == 'Queue'|| $name == 'Unixname'|| $name == 'Hostname'){
        $($ths[len]).remove()
        deleteTd(len)
      }else{
        len++
      }
    }while(len<$ths.length)
  }

  function deleteTd(idx){
    dtd = $.Deferred()
    var $trs = $(".table tbody tr")
    $trs.each(function(){
      var $td = $(this).find('td')
      $($td[idx]).remove()
    })
    dtd.resolve();
    return dtd
  }

  function addTitle(){
    if(location.pathname === '/home'){
      var $trs = $("#main_content table tbody tr")
      $trs.each(function(){
        var txt = $(this).find("td").eq(1).find("a strong").text()
        var attrVal = $(this).find("td").eq(1).find("a").attr('data-original-title')
        if(attrVal){
          $(this).find("td").eq(1).find("a strong").text(txt+' - ('+attrVal+")")
        }
      })
    }
  }

  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  function setSearchParam(){
    let val = getUrlParam('_od_TaskInstanceModelView')
    $("#filter_form button").css({"height":"30px"})
    $("#filter_form").append(`
                        <a href="javascript:;" class="btn remove-filter" style="margin-left:10px;height: 30px;line-height: 16px;"><span class="close-icon"></span>start date</a>
                        <input name="_oc_TaskInstanceModelView" type="hidden" value="start_date"></input>
                        <select name="_od_TaskInstanceModelView" 
                                value="" id="start_date_select" 
                                style="background-color:#ffffff;padding:0 8px;height: 30px;border-color:#ccc;outline: none;
                                border-radius: 4px;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;color: #555555;"
                                >
                            <option value="desc">desc</option><option value="asc">asc</option>
                        </select>`)
    if (val === "asc") {
      $("#start_date_select").find('option').eq(1).attr("selected","selected")
    }
  }

  addMenu()
  deleteTh()
  addTitle()
  let pathname = window.location.pathname
  if(pathname === "/taskinstance/list/"){
    setSearchParam()
  }
})()
